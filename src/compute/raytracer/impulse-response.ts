import * as ac from "../acoustics";
import Surface from "../../objects/surface";
import Receiver from "../../objects/receiver";
import { useContainer } from "../../store";
import { audioEngine } from "../../audio-engine/audio-engine";
import { RayPath, normalize, RESPONSE_TIME_PADDING, DEFAULT_INITIAL_SPL } from "./types";
import { extractDecayParameters, synthesizeTail, assembleFinalIR } from "./tail-synthesis";

export interface TailOptions {
  energyHistogram: Float32Array[];
  crossfadeTime: number;
  crossfadeDuration: number;
  histogramBinWidth: number;
  frequencies: number[];
}

const { floor, abs, max: mathMax } = Math;
const coinFlip = () => Math.random() > 0.5;

// Webpack 5 native worker support
const FilterWorker = () => new Worker(new URL('../../audio-engine/filter.worker.ts', import.meta.url));

export function arrivalPressure(
  initialSPL: number[],
  freqs: number[],
  path: RayPath,
  receiverGain: number = 1.0,
  temperature: number = 20,
): number[] {
  const intensities = ac.P2I(ac.Lp2P(initialSPL)) as number[];

  if (path.bandEnergy && path.bandEnergy.length === freqs.length) {
    // New path: per-band energy (including air absorption and source directivity) already tracked during tracing
    for (let i = 0; i < freqs.length; i++) {
      intensities[i] *= path.bandEnergy[i];
    }
    // convert back to pressure (no post-hoc air absorption needed), apply receiver directivity gain
    const pressures = ac.Lp2P(ac.P2Lp(ac.I2P(intensities)) as number[]) as number[];
    if (receiverGain !== 1.0) {
      for (let i = 0; i < pressures.length; i++) pressures[i] *= receiverGain;
    }
    return pressures;
  }

  // Legacy path: re-walk chain (backward compat)
  path.chain.slice(0, -1).forEach(p => {
    const surface = useContainer.getState().containers[p.object] as Surface;
    intensities.forEach((I, i) => {
      const R = abs(surface.reflectionFunction(freqs[i], p.angle));
      intensities[i] = I * R;
    });
  });

  // convert back to SPL
  const arrivalLp = ac.P2Lp(ac.I2P(intensities)) as number[];

  // apply air absorption (dB/m) — only for legacy paths
  const airAttenuationdB = ac.airAttenuation(freqs, temperature);
  freqs.forEach((_, f) => arrivalLp[f] -= airAttenuationdB[f] * path.totalLength);

  // convert back to pressure, apply receiver directivity gain
  const pressures = ac.Lp2P(arrivalLp) as number[];
  if (receiverGain !== 1.0) {
    for (let i = 0; i < pressures.length; i++) pressures[i] *= receiverGain;
  }
  return pressures;
}

export async function calculateImpulseResponseForPair(
  sourceId: string,
  receiverId: string,
  paths: RayPath[],
  initialSPL = DEFAULT_INITIAL_SPL,
  frequencies: number[],
  temperature: number,
  sampleRate = audioEngine.sampleRate,
  tailOptions?: TailOptions,
): Promise<{ signal: Float32Array; normalizedSignal: Float32Array }> {
  if (paths.length === 0) throw Error("No rays have been traced for this pair");

  let sorted = paths.sort((a, b) => a.time - b.time) as RayPath[];

  const totalTime = sorted[sorted.length - 1].time + RESPONSE_TIME_PADDING;

  const spls = Array(frequencies.length).fill(initialSPL);

  const numberOfSamples = floor(sampleRate * totalTime) * 2;

  let samples: Array<Float32Array> = [];
  for (let f = 0; f < frequencies.length; f++) {
    samples.push(new Float32Array(numberOfSamples));
  }

  // add in raytracer paths (apply receiver directivity)
  const recForPair = useContainer.getState().containers[receiverId] as Receiver;
  for (let i = 0; i < sorted.length; i++) {
    const randomPhase = coinFlip() ? 1 : -1;
    const t = sorted[i].time;
    const dir = sorted[i].arrivalDirection || [0, 0, 1] as [number, number, number];
    const recGain = recForPair.getGain(dir as [number, number, number]);
    const p = arrivalPressure(spls, frequencies, sorted[i], recGain, temperature).map(x => x * randomPhase);
    const roundedSample = floor(t * sampleRate);

    for (let f = 0; f < frequencies.length; f++) {
      samples[f][roundedSample] += p[f];
    }
  }

  // Apply late reverberation tail synthesis if enabled
  if (tailOptions && tailOptions.energyHistogram && tailOptions.energyHistogram.length > 0) {
    const decayParams = extractDecayParameters(
      tailOptions.energyHistogram, tailOptions.frequencies,
      tailOptions.crossfadeTime, tailOptions.histogramBinWidth
    );
    const { tailSamples, tailStartSample } = synthesizeTail(
      decayParams, sampleRate
    );
    const crossfadeDurationSamples = floor(tailOptions.crossfadeDuration * sampleRate);
    samples = assembleFinalIR(samples, tailSamples, tailStartSample, crossfadeDurationSamples);

    // Re-pad for FFT: ensure samples are doubled for the filter worker
    const maxLen = samples.reduce((m, s) => mathMax(m, s.length), 0);
    const paddedLength = maxLen * 2;
    for (let f = 0; f < frequencies.length; f++) {
      if (samples[f].length < paddedLength) {
        const padded = new Float32Array(paddedLength);
        padded.set(samples[f]);
        samples[f] = padded;
      }
    }
  }

  const worker = FilterWorker();

  return new Promise((resolve, reject) => {
    worker.postMessage({ samples });
    worker.onmessage = (event) => {
      const filteredSamples = event.data.samples as Float32Array[];

      const signal = new Float32Array(filteredSamples[0].length >> 1);

      for (let i = 0; i < filteredSamples.length; i++) {
        for (let j = 0; j < signal.length; j++) {
          signal[j] += filteredSamples[i][j];
        }
      }

      const normalizedSignal = normalize(signal.slice());

      worker.terminate();
      resolve({ signal, normalizedSignal });
    };
    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };
  });
}

export async function calculateImpulseResponseForDisplay(
  receiverIDs: string[],
  sourceIDs: string[],
  paths: Record<string, RayPath[]>,
  initialSPL = DEFAULT_INITIAL_SPL,
  frequencies: number[],
  temperature: number,
  sampleRate = audioEngine.sampleRate,
  tailOptions?: TailOptions,
): Promise<{ signal: Float32Array; normalizedSignal: Float32Array }> {
  if (receiverIDs.length == 0) throw Error("No receivers have been assigned to the raytracer");
  if (sourceIDs.length == 0) throw Error("No sources have been assigned to the raytracer");
  if (paths[receiverIDs[0]].length == 0) throw Error("No rays have been traced yet");

  let sorted = paths[receiverIDs[0]].sort((a, b) => a.time - b.time) as RayPath[];

  const totalTime = sorted[sorted.length - 1].time + RESPONSE_TIME_PADDING;

  const spls = Array(frequencies.length).fill(initialSPL);

  const numberOfSamples = floor(sampleRate * totalTime) * 2;

  let samples: Array<Float32Array> = [];
  for (let f = 0; f < frequencies.length; f++) {
    samples.push(new Float32Array(numberOfSamples));
  }

  // add in raytracer paths (apply receiver directivity)
  const recForDisplay = useContainer.getState().containers[receiverIDs[0]] as Receiver;
  for (let i = 0; i < sorted.length; i++) {
    const randomPhase = coinFlip() ? 1 : -1;
    const t = sorted[i].time;
    const dir = sorted[i].arrivalDirection || [0, 0, 1] as [number, number, number];
    const recGain = recForDisplay.getGain(dir as [number, number, number]);
    const p = arrivalPressure(spls, frequencies, sorted[i], recGain, temperature).map(x => x * randomPhase);
    const roundedSample = floor(t * sampleRate);

    for (let f = 0; f < frequencies.length; f++) {
      samples[f][roundedSample] += p[f];
    }
  }

  // Apply late reverberation tail synthesis if enabled
  if (tailOptions && tailOptions.energyHistogram && tailOptions.energyHistogram.length > 0) {
    const decayParams = extractDecayParameters(
      tailOptions.energyHistogram, tailOptions.frequencies,
      tailOptions.crossfadeTime, tailOptions.histogramBinWidth
    );
    const { tailSamples, tailStartSample } = synthesizeTail(
      decayParams, sampleRate
    );
    const crossfadeDurationSamples = floor(tailOptions.crossfadeDuration * sampleRate);
    samples = assembleFinalIR(samples, tailSamples, tailStartSample, crossfadeDurationSamples);

    // Re-pad for FFT
    const maxLen = samples.reduce((m, s) => mathMax(m, s.length), 0);
    const paddedLength = maxLen * 2;
    for (let f = 0; f < frequencies.length; f++) {
      if (samples[f].length < paddedLength) {
        const padded = new Float32Array(paddedLength);
        padded.set(samples[f]);
        samples[f] = padded;
      }
    }
  }

  const worker = FilterWorker();

  return new Promise((resolve, reject) => {
    worker.postMessage({ samples });
    worker.onmessage = (event) => {
      const filteredSamples = event.data.samples as Float32Array[];

      const signal = new Float32Array(filteredSamples[0].length >> 1);

      for (let i = 0; i < filteredSamples.length; i++) {
        for (let j = 0; j < signal.length; j++) {
          signal[j] += filteredSamples[i][j];
        }
      }

      const normalizedSignal = normalize(signal.slice());

      worker.terminate();
      resolve({ signal, normalizedSignal });
    };
    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };
  });
}
