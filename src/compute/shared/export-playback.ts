import FileSaver from "file-saver";
import * as ac from "../acoustics";
import { emit } from "../../messenger";
import { audioEngine } from "../../audio-engine/audio-engine";

/**
 * Play the impulse response through the audio engine.
 *
 * @param impulseResponse - The AudioBuffer to play (or undefined to calculate first)
 * @param calculateImpulseResponse - Async function to calculate the IR if needed
 * @param uuid - The solver UUID for property events
 * @param eventName - The event name for property updates (e.g. "RAYTRACER_SET_PROPERTY")
 */
export async function playImpulseResponse(
  impulseResponse: AudioBuffer | undefined,
  calculateImpulseResponse: () => Promise<AudioBuffer>,
  uuid: string,
  eventName: string
): Promise<{ impulseResponse: AudioBuffer }> {
  if (!impulseResponse) {
    impulseResponse = await calculateImpulseResponse();
  }
  if (audioEngine.context.state === 'suspended') {
    audioEngine.context.resume();
  }
  console.log(impulseResponse);
  const source = audioEngine.context.createBufferSource();
  source.buffer = impulseResponse;
  source.connect(audioEngine.context.destination);
  source.start();
  emit(eventName, { uuid, property: "impulseResponsePlaying", value: true });
  source.onended = () => {
    source.stop();
    source.disconnect(audioEngine.context.destination);
    emit(eventName, { uuid, property: "impulseResponsePlaying", value: false });
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
  if (!impulseResponse) {
    impulseResponse = await calculateImpulseResponse();
  }
  const blob = ac.wavAsBlob([ac.normalize(impulseResponse.getChannelData(0))], { sampleRate, bitDepth: 32 });
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

/**
 * Play the binaural impulse response through the audio engine.
 *
 * @param binauralImpulseResponse - The stereo AudioBuffer to play (or undefined to calculate first)
 * @param calculateBinauralImpulseResponse - Async function to calculate if needed
 * @param uuid - The solver UUID for property events
 * @param eventName - The event name for property updates (e.g. "RAYTRACER_SET_PROPERTY")
 */
export async function playBinauralImpulseResponse(
  binauralImpulseResponse: AudioBuffer | undefined,
  calculateBinauralImpulseResponse: () => Promise<AudioBuffer>,
  uuid: string,
  eventName: string
): Promise<{ binauralImpulseResponse: AudioBuffer }> {
  if (!binauralImpulseResponse) {
    binauralImpulseResponse = await calculateBinauralImpulseResponse();
  }
  if (audioEngine.context.state === 'suspended') {
    audioEngine.context.resume();
  }
  const source = audioEngine.context.createBufferSource();
  source.buffer = binauralImpulseResponse;
  source.connect(audioEngine.context.destination);
  source.start();
  emit(eventName, { uuid, property: "binauralPlaying", value: true });
  source.onended = () => {
    source.stop();
    source.disconnect(audioEngine.context.destination);
    emit(eventName, { uuid, property: "binauralPlaying", value: false });
  };
  return { binauralImpulseResponse };
}

/**
 * Download the binaural impulse response as a stereo WAV file.
 *
 * @param binauralImpulseResponse - The stereo AudioBuffer (or undefined to calculate first)
 * @param calculateBinauralImpulseResponse - Async function to calculate if needed
 * @param filename - Output filename
 */
export async function downloadBinauralImpulseResponse(
  binauralImpulseResponse: AudioBuffer | undefined,
  calculateBinauralImpulseResponse: () => Promise<AudioBuffer>,
  filename: string
): Promise<{ binauralImpulseResponse: AudioBuffer }> {
  if (!binauralImpulseResponse) {
    binauralImpulseResponse = await calculateBinauralImpulseResponse();
  }

  const sampleRate = binauralImpulseResponse.sampleRate;
  const left = binauralImpulseResponse.getChannelData(0);
  const right = binauralImpulseResponse.getChannelData(1);

  // Normalize stereo signal
  let max = 0;
  for (let i = 0; i < left.length; i++) {
    if (Math.abs(left[i]) > max) max = Math.abs(left[i]);
    if (Math.abs(right[i]) > max) max = Math.abs(right[i]);
  }
  const normLeft = new Float32Array(left.length);
  const normRight = new Float32Array(right.length);
  if (max > 0) {
    for (let i = 0; i < left.length; i++) {
      normLeft[i] = left[i] / max;
      normRight[i] = right[i] / max;
    }
  }

  const blob = ac.wavAsBlob([normLeft, normRight], { sampleRate, bitDepth: 32 });
  const extension = !filename.endsWith(".wav") ? ".wav" : "";
  FileSaver.saveAs(blob, `${filename}_binaural${extension}`);
  return { binauralImpulseResponse };
}
