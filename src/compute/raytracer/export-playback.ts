import * as ac from "../acoustics";
import { useContainer } from "../../store";
import Receiver from "../../objects/receiver";
import FileSaver from "file-saver";
import { KVP } from "../../common/key-value-pair";
import { RayPath, DEFAULT_INITIAL_SPL, RESPONSE_TIME_PADDING } from "./types";
import { monteCarloSign, monteCarloWeight, rayOrderFromChain } from "./ir-scale";
import {
  playImpulseResponse as sharedPlayIR,
  downloadImpulseResponse as sharedDownloadIR,
  downloadAmbisonicImpulseResponse as sharedDownloadAmbisonicIR,
  playBinauralImpulseResponse as sharedPlayBinauralIR,
  downloadBinauralImpulseResponse as sharedDownloadBinauralIR,
} from "../shared/export-playback";

const { floor } = Math;

const RAYTRACER_EVENT = "RAYTRACER_SET_PROPERTY";

/**
 * Download per-octave impulse responses as individual WAV files.
 * (Raytracer-specific: uses RayPath structure)
 */
export function downloadImpulses(
  paths: KVP<RayPath[]>,
  receiverIDs: string[],
  sourceIDs: string[],
  arrivalPressureFn: (spls: number[], freqs: number[], path: RayPath, receiverGain: number) => number[],
  filename: string,
  initialSPL: number = DEFAULT_INITIAL_SPL,
  frequencies: number[] = ac.Octave(125, 8000),
  sampleRate: number = 44100
) {
  if(receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
  if(sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
  if(paths[receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");

  const sorted = paths[receiverIDs[0]].sort((a,b)=>a.time - b.time) as RayPath[];
  const totalTime = sorted[sorted.length - 1].time + RESPONSE_TIME_PADDING;

  const spls = Array(frequencies.length).fill(initialSPL);
  const numberOfSamples = floor(sampleRate * totalTime);

  const samples: Array<Float32Array> = [];
  for(let f = 0; f<frequencies.length; f++){
    samples.push(new Float32Array(numberOfSamples));
  }
  const recForDownload = useContainer.getState().containers[receiverIDs[0]] as Receiver;
  const mcWeight = monteCarloWeight(sorted.length);
  for(let i = 0; i<sorted.length; i++){
    const sign = monteCarloSign(rayOrderFromChain(sorted[i]));
    const t = sorted[i].time;
    const dir = sorted[i].arrivalDirection || [0, 0, 1] as [number, number, number];
    const recGain = recForDownload.getGain(dir as [number, number, number]);
    const p = arrivalPressureFn(spls, frequencies, sorted[i], recGain).map(x => x * sign * mcWeight);
    const roundedSample = floor(t * sampleRate);

    for(let f = 0; f<frequencies.length; f++){
      samples[f][roundedSample] += p[f];
    }
  }

  for(let f = 0; f<frequencies.length; f++){
    const blob = ac.wavAsBlob([samples[f]], { sampleRate, bitDepth: 32 });
    FileSaver.saveAs(blob, `${frequencies[f]}_${filename}.wav`);
  }
}

// Re-export shared functions with RAYTRACER_SET_PROPERTY event name bound

export async function playImpulseResponse(
  impulseResponse: AudioBuffer | undefined,
  calculateImpulseResponse: () => Promise<AudioBuffer>,
  uuid: string
): Promise<{ impulseResponse: AudioBuffer }> {
  return sharedPlayIR(impulseResponse, calculateImpulseResponse, uuid, RAYTRACER_EVENT);
}

export async function downloadImpulseResponse(
  impulseResponse: AudioBuffer | undefined,
  calculateImpulseResponse: () => Promise<AudioBuffer>,
  filename: string,
  sampleRate?: number
): Promise<{ impulseResponse: AudioBuffer }> {
  return sharedDownloadIR(impulseResponse, calculateImpulseResponse, filename, sampleRate);
}

export async function downloadAmbisonicImpulseResponse(
  ambisonicImpulseResponse: AudioBuffer | undefined,
  calculateAmbisonicImpulseResponse: (order: number) => Promise<AudioBuffer>,
  ambisonicOrder: number,
  order: number = 1,
  filename: string
): Promise<{ ambisonicImpulseResponse: AudioBuffer; ambisonicOrder: number }> {
  return sharedDownloadAmbisonicIR(ambisonicImpulseResponse, calculateAmbisonicImpulseResponse, ambisonicOrder, order, filename);
}

export async function playBinauralImpulseResponse(
  binauralImpulseResponse: AudioBuffer | undefined,
  calculateBinauralImpulseResponse: () => Promise<AudioBuffer>,
  uuid: string
): Promise<{ binauralImpulseResponse: AudioBuffer }> {
  return sharedPlayBinauralIR(binauralImpulseResponse, calculateBinauralImpulseResponse, uuid, RAYTRACER_EVENT);
}

export async function downloadBinauralImpulseResponse(
  binauralImpulseResponse: AudioBuffer | undefined,
  calculateBinauralImpulseResponse: () => Promise<AudioBuffer>,
  filename: string
): Promise<{ binauralImpulseResponse: AudioBuffer }> {
  return sharedDownloadBinauralIR(binauralImpulseResponse, calculateBinauralImpulseResponse, filename);
}
