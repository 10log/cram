/**
 * ART native output is a broadband energy envelope sampled at the
 * energy-bin rate (default 1 kHz). That is not a pressure IR: do not
 * peak-normalize it or advertise the bin rate as an audio sample rate.
 */

export function downsampleEnergyEnvelope(
  samples: ArrayLike<number>,
  binRate: number,
  maxPoints = 2000,
): { time: number; amplitude: number }[] {
  const step = Math.max(1, Math.floor(samples.length / maxPoints));
  const out: { time: number; amplitude: number }[] = [];
  for (let i = 0; i < samples.length; i += step) {
    out.push({ time: i / binRate, amplitude: samples[i] });
  }
  let last = out.length - 1;
  while (last > 0 && Math.abs(out[last].amplitude) < 1e-10) last -= 1;
  return out.slice(0, last + 1);
}

export function peakAmplitude(samples: ArrayLike<number>): number {
  let max = 0;
  for (let i = 0; i < samples.length; i++) {
    const a = Math.abs(samples[i]);
    if (a > max) max = a;
  }
  return max;
}
