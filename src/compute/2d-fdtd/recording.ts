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

/**
 * Low cut of the recording's integrator, in Hz (#224). Below the lowest
 * room mode of anything a 2D FDTD grid holds, and PFFDTD's usual choice.
 */
export const RECORDING_HIGHPASS_HZ = 10;

/**
 * Integrate a receiver's recording back out of the differentiated source,
 * and remove DC, in one filter (#224, after PFFDTD's `process_outputs`).
 *
 * The source forces the field with the per-sample difference of its signal,
 * so a receiver hears the response to that difference. A running sum undoes
 * it exactly. On its own, though, a sum would integrate any DC or sub-audio
 * drift into a ramp. So this is a second-order Butterworth high-pass at
 * `cutoff` (bilinear, pre-warped), whose numerator is `(1 − z⁻¹)²`, with one
 * of those two differences cancelled against the sum:
 *
 * ```
 * H(z) = g·(1 − z⁻¹) / (1 + d₁z⁻¹ + d₂z⁻²)  =  HPF(z) / (1 − z⁻¹)
 * ```
 *
 * Above the cutoff that is the exact inverse of the source's difference: no
 * droop and no delay, where a trapezoidal integrator would lose
 * `cos(πf/fs)`. Below it, it rolls off like a first-order high-pass, and DC
 * decays to nothing. (PFFDTD removes the zero from the analog prototype
 * instead; that is the trapezoidal version.)
 */
export function integrateAndHighpass(
  samples: readonly number[],
  sampleRate: number,
  cutoff = RECORDING_HIGHPASS_HZ,
): number[] {
  if (!(sampleRate > 0)) throw new Error(`Sample rate must be positive, got ${sampleRate}`);
  if (!(cutoff > 0) || cutoff >= sampleRate / 2) {
    throw new Error(`Cutoff must be in (0, ${sampleRate / 2}) Hz, got ${cutoff}`);
  }
  // Analog prototype s²/(s² + √2·ωc·s + ωc²), bilinear with K = 2·fs and
  // ωc pre-warped so the corner lands at `cutoff`.
  const K = 2 * sampleRate;
  const wc = K * Math.tan((Math.PI * cutoff) / sampleRate);
  const a1 = Math.SQRT2 * wc;
  const a0 = wc * wc;
  const d0 = K * K + a1 * K + a0;
  const g = (K * K) / d0;
  const d1 = (2 * a0 - 2 * K * K) / d0;
  const d2 = (K * K - a1 * K + a0) / d0;
  const out = new Array<number>(samples.length);
  let x1 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let n = 0; n < samples.length; n++) {
    const x0 = samples[n];
    const y0 = g * (x0 - x1) - d1 * y1 - d2 * y2;
    out[n] = y0;
    x1 = x0;
    y2 = y1;
    y1 = y0;
  }
  return out;
}
