// @ts-nocheck
import FileSaver from "file-saver";
import * as ac from "../acoustics";
import { useContainer } from "../../store";
import Receiver from "../../objects/receiver";
import { emit } from "../../messenger";
import { audioEngine } from "../../audio-engine/audio-engine";
import { KVP } from "../../common/key-value-pair";
import { RayPath, normalize, DEFAULT_INITIAL_SPL, RESPONSE_TIME_PADDING } from "./types";

const { floor, abs } = Math;
const coinFlip = () => Math.random() > 0.5;

/**
 * Download per-octave impulse responses as individual WAV files.
 *
 * @param paths - The receiver-keyed ray path collection
 * @param receiverIDs - Array of receiver UUIDs
 * @param sourceIDs - Array of source UUIDs
 * @param arrivalPressureFn - Function to compute arrival pressures for a path
 * @param filename - Base filename for the downloads
 * @param initialSPL - Initial SPL in dB (default 100)
 * @param frequencies - Octave band frequencies
 * @param sampleRate - Output sample rate
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
  let max = 0;
  const recForDownload = useContainer.getState().containers[receiverIDs[0]] as Receiver;
  for(let i = 0; i<sorted.length; i++){
    const randomPhase = coinFlip() ? 1 : -1;
    const t = sorted[i].time;
    const dir = sorted[i].arrivalDirection || [0, 0, 1] as [number, number, number];
    const recGain = recForDownload.getGain(dir as [number, number, number]);
    const p = arrivalPressureFn(spls, frequencies, sorted[i], recGain).map(x => x * randomPhase);
    const roundedSample = floor(t * sampleRate);

    for(let f = 0; f<frequencies.length; f++){
      samples[f][roundedSample] += p[f];
      if(abs(samples[f][roundedSample]) > max){
        max = abs(samples[f][roundedSample]);
      }
    }
  }

  for(let f = 0; f<frequencies.length; f++){
    const blob = ac.wavAsBlob([ac.normalize(samples[f])], { sampleRate, bitDepth: 32 });
    FileSaver.saveAs(blob, `${frequencies[f]}_${filename}.wav`);
  }
}

/**
 * Play the impulse response through the audio engine.
 *
 * @param impulseResponse - The AudioBuffer to play (or undefined to calculate first)
 * @param calculateImpulseResponse - Async function to calculate the IR if needed
 * @param uuid - The solver UUID for property events
 */
export async function playImpulseResponse(
  impulseResponse: AudioBuffer | undefined,
  calculateImpulseResponse: () => Promise<AudioBuffer>,
  uuid: string
): Promise<{ impulseResponse: AudioBuffer }> {
  if(!impulseResponse){
    try{
      impulseResponse = await calculateImpulseResponse();
    } catch(err){
      throw err
    }
  }
  if (audioEngine.context.state === 'suspended') {
    audioEngine.context.resume();
  }
  console.log(impulseResponse);
  const impulseResponseSource = audioEngine.context.createBufferSource();
  impulseResponseSource.buffer = impulseResponse;
  impulseResponseSource.connect(audioEngine.context.destination);
  impulseResponseSource.start();
  emit("RAYTRACER_SET_PROPERTY", { uuid, property: "impulseResponsePlaying", value: true });
  impulseResponseSource.onended = () => {
    impulseResponseSource.stop();
    impulseResponseSource.disconnect(audioEngine.context.destination);
    emit("RAYTRACER_SET_PROPERTY", { uuid, property: "impulseResponsePlaying", value: false });
  };
  return { impulseResponse };
}

/**
 * Download the impulse response as a WAV file.
 *
 * @param impulseResponse - The AudioBuffer (or undefined to calculate first)
 * @param calculateImpulseResponse - Async function to calculate the IR if needed
 * @param filename - Output filename
 * @param sampleRate - Sample rate for the output
 */
export async function downloadImpulseResponse(
  impulseResponse: AudioBuffer | undefined,
  calculateImpulseResponse: () => Promise<AudioBuffer>,
  filename: string,
  sampleRate: number = audioEngine.sampleRate
): Promise<{ impulseResponse: AudioBuffer }> {
  if(!impulseResponse){
    try{
      impulseResponse = await calculateImpulseResponse();
    } catch(err){
      throw err
    }
  }
  const blob = ac.wavAsBlob([normalize(impulseResponse.getChannelData(0))], { sampleRate, bitDepth: 32 });
  const extension = !filename.endsWith(".wav") ? ".wav" : "";
  FileSaver.saveAs(blob, filename + extension);
  return { impulseResponse };
}

/**
 * Download the ambisonic impulse response as a multi-channel WAV file.
 * Channels are in ACN order with N3D normalization.
 *
 * @param ambisonicImpulseResponse - The ambisonic AudioBuffer (or undefined to calculate first)
 * @param calculateAmbisonicImpulseResponse - Async function to calculate if needed
 * @param ambisonicOrder - Current cached ambisonic order
 * @param order - Desired ambisonic order (default: 1)
 * @param filename - Output filename (without extension)
 */
export async function downloadAmbisonicImpulseResponse(
  ambisonicImpulseResponse: AudioBuffer | undefined,
  calculateAmbisonicImpulseResponse: (order: number) => Promise<AudioBuffer>,
  ambisonicOrder: number,
  order: number = 1,
  filename: string
): Promise<{ ambisonicImpulseResponse: AudioBuffer; ambisonicOrder: number }> {
  // Calculate if not already cached or if order changed
  if (!ambisonicImpulseResponse || ambisonicOrder !== order) {
    ambisonicOrder = order;
    ambisonicImpulseResponse = await calculateAmbisonicImpulseResponse(order);
  }

  const nCh = ambisonicImpulseResponse.numberOfChannels;
  const sampleRate = ambisonicImpulseResponse.sampleRate;
  const channelData: Float32Array[] = [];

  // Extract all channels
  for (let ch = 0; ch < nCh; ch++) {
    channelData.push(ambisonicImpulseResponse.getChannelData(ch));
  }

  const blob = ac.wavAsBlob(channelData, { sampleRate, bitDepth: 32 });
  const extension = !filename.endsWith(".wav") ? ".wav" : "";
  const orderLabel = order === 1 ? "FOA" : `HOA${order}`;
  FileSaver.saveAs(blob, `${filename}_${orderLabel}${extension}`);
  return { ambisonicImpulseResponse, ambisonicOrder };
}
