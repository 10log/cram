import FileSaver from "file-saver";
import { encodeBufferFromDirection, getAmbisonicChannelCount } from "ambisonics";
import Receiver from "../../objects/receiver";
import { emit } from "../../messenger";
import { useContainer, ResultKind, Result } from "../../store";
import { audioEngine } from "../../audio-engine/audio-engine";
import * as ac from "../acoustics";
import { normalize } from "../acoustics";
import { extractDecayParameters, synthesizeTail, assembleFinalIR, applyAmbisonicTail } from "../shared/tail-synthesis";
import { HISTOGRAM_BIN_WIDTH } from "../shared/tail-synthesis-types";
import { calculateBinauralFromAmbisonic } from "../binaural/calculate-binaural";
import type { BeamTracePath } from "./paths";

const FilterWorker = () => new Worker(new URL("../../audio-engine/filter.worker.ts", import.meta.url));

export type ArrivalPressureFn = (initialSPL: number[], path: BeamTracePath, receiverGain: number) => number[];

export function receiverGainForPath(receiver: Receiver | null | undefined, path: BeamTracePath): number {
  if (!receiver) return 1.0;
  const dir = path.arrivalDirection;
  return receiver.getGain([dir.x, dir.y, dir.z]);
}

export async function calculateMonoImpulseResponse(params: {
  validPaths: BeamTracePath[];
  frequencies: number[];
  receiver: Receiver | null;
  arrivalPressure: ArrivalPressureFn;
  lateReverbTailEnabled: boolean;
  energyHistogram: Float32Array[] | null;
  tailCrossfadeTime: number;
  tailCrossfadeDuration: number;
  updateResult: (ir: AudioBuffer, sampleRate: number) => void;
}): Promise<AudioBuffer> {
  const {
    validPaths, frequencies, receiver, arrivalPressure,
    lateReverbTailEnabled, energyHistogram, tailCrossfadeTime, tailCrossfadeDuration,
    updateResult,
  } = params;

  if (validPaths.length === 0) {
    throw new Error("No paths calculated yet. Run calculate() first.");
  }

  const sampleRate = audioEngine.sampleRate;
  const initialSPL = 100;
  const spls = Array(frequencies.length).fill(initialSPL);

  const totalTime = validPaths[validPaths.length - 1].arrivalTime + 0.05;
  const numberOfSamples = Math.floor(sampleRate * totalTime) * 2;

  const samples: Float32Array[] = [];
  for (let f = 0; f < frequencies.length; f++) {
    samples.push(new Float32Array(numberOfSamples));
  }

  for (const path of validPaths) {
    const randomPhase = Math.random() > 0.5 ? 1 : -1;
    const recGain = receiverGainForPath(receiver, path);
    const pressure = arrivalPressure(spls, path, recGain);
    const roundedSample = Math.floor(path.arrivalTime * sampleRate);

    for (let f = 0; f < frequencies.length; f++) {
      if (roundedSample < samples[f].length) {
        samples[f][roundedSample] += pressure[f] * randomPhase;
      }
    }
  }

  let finalSamples = samples;
  if (lateReverbTailEnabled && energyHistogram) {
    const decayParams = extractDecayParameters(
      energyHistogram, frequencies, tailCrossfadeTime, HISTOGRAM_BIN_WIDTH,
    );
    const { tailSamples, tailStartSample } = synthesizeTail(decayParams, sampleRate);
    const crossfadeDurationSamples = Math.floor(tailCrossfadeDuration * sampleRate);
    finalSamples = assembleFinalIR(samples, tailSamples, tailStartSample, crossfadeDurationSamples);
  }

  const worker = FilterWorker();

  return new Promise((resolve, reject) => {
    worker.postMessage({ samples: finalSamples });

    worker.onmessage = (event) => {
      const filteredSamples = event.data.samples as Float32Array[];
      const signal = new Float32Array(filteredSamples[0].length >> 1);

      let max = 0;
      for (let i = 0; i < filteredSamples.length; i++) {
        for (let j = 0; j < signal.length; j++) {
          signal[j] += filteredSamples[i][j];
          if (Math.abs(signal[j]) > max) {
            max = Math.abs(signal[j]);
          }
        }
      }

      const normalizedSignal = normalize(signal);
      const offlineContext = audioEngine.createOfflineContext(1, signal.length, sampleRate);
      const source = audioEngine.createBufferSource(normalizedSignal, offlineContext);

      source.connect(offlineContext.destination);
      source.start();

      audioEngine.renderContextAsync(offlineContext)
        .then(ir => {
          updateResult(ir, sampleRate);
          resolve(ir);
        })
        .catch(reject)
        .finally(() => worker.terminate());
    };

    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };
  });
}

export function updateImpulseResponseResult(params: {
  ir: AudioBuffer;
  sampleRate: number;
  sourceIDs: string[];
  receiverIDs: string[];
  impulseResponseResult: string;
  solverUuid: string;
}) {
  const { ir, sampleRate, sourceIDs, receiverIDs, impulseResponseResult, solverUuid } = params;
  const containers = useContainer.getState().containers;
  const sourceName = sourceIDs.length > 0 ? containers[sourceIDs[0]]?.name || "source" : "source";
  const receiverName = receiverIDs.length > 0 ? containers[receiverIDs[0]]?.name || "receiver" : "receiver";

  const channelData = ir.getChannelData(0);
  const data: { time: number; amplitude: number }[] = [];

  const downsampleFactor = Math.max(1, Math.floor(channelData.length / 2000));
  for (let i = 0; i < channelData.length; i += downsampleFactor) {
    data.push({
      time: i / sampleRate,
      amplitude: channelData[i],
    });
  }

  console.log(`BeamTraceSolver: Updating IR result with ${data.length} samples, duration: ${(channelData.length / sampleRate).toFixed(3)}s`);

  const result: Result<ResultKind.ImpulseResponse> = {
    kind: ResultKind.ImpulseResponse,
    data,
    info: {
      sampleRate,
      sourceName,
      receiverName,
      sourceId: sourceIDs[0] || "",
      receiverId: receiverIDs[0] || "",
    },
    name: `IR: ${sourceName} → ${receiverName}`,
    uuid: impulseResponseResult,
    from: solverUuid,
  };

  emit("UPDATE_RESULT", { uuid: impulseResponseResult, result });
}

export async function calculateAmbisonicImpulseResponse(params: {
  validPaths: BeamTracePath[];
  frequencies: number[];
  receiver: Receiver | null;
  arrivalPressure: ArrivalPressureFn;
  lateReverbTailEnabled: boolean;
  energyHistogram: Float32Array[] | null;
  tailCrossfadeTime: number;
  tailCrossfadeDuration: number;
  order: number;
}): Promise<AudioBuffer> {
  const {
    validPaths, frequencies, receiver, arrivalPressure,
    lateReverbTailEnabled, energyHistogram, tailCrossfadeTime, tailCrossfadeDuration, order,
  } = params;

  if (validPaths.length === 0) {
    throw new Error("No paths calculated yet. Run calculate() first.");
  }

  const sampleRate = audioEngine.sampleRate;
  const initialSPL = 100;
  const spls = Array(frequencies.length).fill(initialSPL);

  const totalTime = validPaths[validPaths.length - 1].arrivalTime + 0.05;
  if (totalTime <= 0) throw new Error("Invalid impulse response duration");
  const numberOfSamples = Math.floor(sampleRate * totalTime) * 2;
  if (numberOfSamples < 2) throw new Error("Impulse response too short to process");
  const nCh = getAmbisonicChannelCount(order);

  const samples: Float32Array[][] = [];
  for (let f = 0; f < frequencies.length; f++) {
    samples.push([]);
    for (let ch = 0; ch < nCh; ch++) {
      samples[f].push(new Float32Array(numberOfSamples));
    }
  }

  for (const path of validPaths) {
    const randomPhase = Math.random() > 0.5 ? 1 : -1;
    const recGain = receiverGainForPath(receiver, path);
    const pressure = arrivalPressure(spls, path, recGain);
    const roundedSample = Math.floor(path.arrivalTime * sampleRate);
    if (roundedSample >= numberOfSamples) continue;

    const impulse = new Float32Array(1);
    const dir = path.arrivalDirection;

    for (let f = 0; f < frequencies.length; f++) {
      impulse[0] = pressure[f] * randomPhase;
      const encoded = encodeBufferFromDirection(impulse, dir.x, dir.y, dir.z, order, "threejs");
      for (let ch = 0; ch < nCh; ch++) {
        samples[f][ch][roundedSample] += encoded[ch][0];
      }
    }
  }

  if (lateReverbTailEnabled && energyHistogram) {
    const decayParams = extractDecayParameters(
      energyHistogram, frequencies, tailCrossfadeTime, HISTOGRAM_BIN_WIDTH,
    );
    const crossfadeDurationSamples = Math.floor(tailCrossfadeDuration * sampleRate);
    applyAmbisonicTail(samples, decayParams, sampleRate, crossfadeDurationSamples);
  }

  const processChannel = async (chIndex: number): Promise<Float32Array> => {
    return new Promise((resolveChannel) => {
      const channelFreqSamples: Float32Array[] = [];
      for (let f = 0; f < frequencies.length; f++) {
        channelFreqSamples.push(samples[f][chIndex]);
      }

      const channelWorker = FilterWorker();
      channelWorker.postMessage({ samples: channelFreqSamples });
      channelWorker.onmessage = (event) => {
        const filteredSamples = event.data.samples as Float32Array[];
        const signal = new Float32Array(filteredSamples[0].length >> 1);
        for (let f = 0; f < filteredSamples.length; f++) {
          for (let j = 0; j < signal.length; j++) {
            signal[j] += filteredSamples[f][j];
          }
        }
        channelWorker.terminate();
        resolveChannel(signal);
      };
    });
  };

  const channelSignals = await Promise.all(
    Array.from({ length: nCh }, (_, ch) => processChannel(ch)),
  );

  let max = 0;
  for (const signal of channelSignals) {
    for (let j = 0; j < signal.length; j++) {
      if (Math.abs(signal[j]) > max) max = Math.abs(signal[j]);
    }
  }
  if (max > 0) {
    for (const signal of channelSignals) {
      for (let j = 0; j < signal.length; j++) {
        signal[j] /= max;
      }
    }
  }

  const signalLength = channelSignals[0].length;
  if (signalLength === 0) {
    throw new Error("Filtered signal has zero length");
  }
  const offlineContext = audioEngine.createOfflineContext(nCh, signalLength, sampleRate);
  const buffer = offlineContext.createBuffer(nCh, signalLength, sampleRate);
  for (let ch = 0; ch < nCh; ch++) {
    buffer.copyToChannel(new Float32Array(channelSignals[ch]), ch);
  }
  return buffer;
}

export async function calculateBinauralImpulseResponse(params: {
  ambisonicImpulseResponse: AudioBuffer;
  order: number;
  hrtfSubjectId: string;
  headYaw: number;
  headPitch: number;
  headRoll: number;
}): Promise<AudioBuffer> {
  return calculateBinauralFromAmbisonic(params);
}

export function downloadOctaveBandIR(params: {
  validPaths: BeamTracePath[];
  frequencies: number[];
  receiver: Receiver | null;
  arrivalPressure: ArrivalPressureFn;
  filename: string;
  sampleRate?: number;
}) {
  const { validPaths, frequencies, receiver, arrivalPressure, filename } = params;
  const sampleRate = params.sampleRate ?? audioEngine.sampleRate;

  if (validPaths.length === 0) {
    throw new Error("No paths calculated yet. Run calculate() first.");
  }

  const initialSPL = 100;
  const spls = Array(frequencies.length).fill(initialSPL);
  const sortedPaths = [...validPaths].sort((a, b) => a.arrivalTime - b.arrivalTime);

  const totalTime = sortedPaths[sortedPaths.length - 1].arrivalTime + 0.05;
  const numberOfSamples = Math.floor(sampleRate * totalTime);

  const samples: Float32Array[] = [];
  for (let f = 0; f < frequencies.length; f++) {
    samples.push(new Float32Array(numberOfSamples));
  }

  for (const path of sortedPaths) {
    const randomPhase = Math.random() > 0.5 ? 1 : -1;
    const recGain = receiverGainForPath(receiver, path);
    const pressure = arrivalPressure(spls, path, recGain);
    const roundedSample = Math.floor(path.arrivalTime * sampleRate);
    for (let f = 0; f < frequencies.length; f++) {
      if (roundedSample < samples[f].length) {
        samples[f][roundedSample] += pressure[f] * randomPhase;
      }
    }
  }

  for (let f = 0; f < frequencies.length; f++) {
    const blob = ac.wavAsBlob([normalize(samples[f])], { sampleRate, bitDepth: 32 });
    FileSaver.saveAs(blob, `${frequencies[f]}_${filename}.wav`);
  }
}
