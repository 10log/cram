/**
 * Decouple FDTD display frames from recorded sample rate (#112).
 *
 * Display: `numPasses` GPU steps per rAF (slow-motion is fine).
 * Record: steps ≈ wallDt / dt so 1 s of Record ≈ 1 s of sim at 1/dt Hz.
 */

export const MAX_RECORD_PASSES = 2048;

export function sampleRateFromDt(dt: number): number {
  return 1 / dt;
}

export function passesForElapsed(opts: {
  wallDt: number;
  dt: number;
  displayPasses: number;
  recording: boolean;
  cap?: number;
}): number {
  if (!opts.recording) {
    return Math.max(1, Math.round(opts.displayPasses) || 1);
  }
  if (!(opts.wallDt > 0) || !(opts.dt > 0)) {
    return 1;
  }
  const cap = opts.cap ?? MAX_RECORD_PASSES;
  return Math.max(1, Math.min(cap, Math.round(opts.wallDt / opts.dt)));
}

export function formatSampleText(samples: number[], sampleRate?: number): string {
  const header = sampleRate && sampleRate > 0 ? `# sampleRate=${sampleRate}\n` : "";
  return header + samples.join("\n");
}

/** 16-bit PCM WAV. `samples` are nominally in [-1, 1]. */
export function encodeWavPcm16(samples: number[], sampleRate: number): ArrayBuffer {
  const n = samples.length;
  const dataBytes = n * 2;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);
  const ascii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };
  ascii(0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, "data");
  view.setUint32(40, dataBytes, true);
  let o = 44;
  for (let i = 0; i < n; i++) {
    const x = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(o, Math.round(x * 32767), true);
    o += 2;
  }
  return buffer;
}

/** Zero-crossings of a near-sinusoid ≈ 2 × cycles. */
export function countZeroCrossings(samples: number[]): number {
  let n = 0;
  for (let i = 1; i < samples.length; i++) {
    if (samples[i - 1] === 0) continue;
    if ((samples[i - 1] < 0 && samples[i] >= 0) || (samples[i - 1] > 0 && samples[i] <= 0)) {
      n += 1;
    }
  }
  return n;
}
