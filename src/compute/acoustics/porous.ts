// @ts-nocheck
import { linspace } from "./util/linspace";
import { Complex } from "./complex";

const { PI: pi, tanh } = Math;
const coth = (x: number) => 1 / tanh(x);

/** Lift a real scalar into the complex plane. */
const re = (value: number) => new Complex({ real: value, imag: 0 });

// NOTE: this takes coth of the real and imaginary parts independently, which is not the
// complex hyperbolic cotangent that the Delany–Bazley surface impedance calls for.
// Preserved exactly as it was — correcting it would move every absorption coefficient
// this function returns, which is a change to the acoustics rather than to the plumbing.
const ccoth = (x: Complex) => new Complex({ real: coth(x.real), imag: coth(x.imag) });

export interface RigidBackedPorousAbsorberParams {
  speed?: number;
  density?: number;
  flowResistivity?: number;
  thickness?: number;
  frequencies?: number[];
}

const defaults = {
  speed: 340,
  density: 1.21,
  flowResistivity: 50000,
  thickness: 0.0254,
  frequencies: linspace(100, 50, 10000)
};

export function rigidBackedPorousAbsorber(params: RigidBackedPorousAbsorberParams) {
  const { speed: c, density: ρ, flowResistivity: σ, thickness: l, frequencies: f } = Object.assign(defaults, params);

  const Z0 = c * ρ;

  // dimensionless quantity for Delany and Bazley
  const X = f.map((f) => (ρ * f) / σ);

  // characteristic impedance
  const zc = X.map((X) => new Complex({
    real: ρ * c * (1 + 0.0571 * X ** -0.754),
    imag: ρ * c * (-0.087 * X ** -0.732)
  }));

  // complex wave number
  const k = X.map((X, i) => {
    const multiplier = ((2 * pi) / c) * f[i];
    return new Complex({
      real: multiplier * +(1 + 0.0978 * X ** -0.7),
      imag: multiplier * -(0 + 0.189 * X ** -0.595)
    });
  });

  // propogation constant
  const γ = k.map((k) => new Complex({ real: -k.imag, imag: k.real }));

  // surface impedance
  // Complex is immutable, so the defensive clones the previous library needed are gone.
  const z = zc.map((zc, i) => zc.multiply(ccoth(γ[i].multiply(re(l)))));

  // reflection factor
  const R = z.map((z) => z.subtract(re(Z0)).divide(z.add(re(Z0))));

  // normal incidence absorption coefficient
  const a = R.map((R) => 1 - R.absolute() ** 2);

  return {
    frequency: f,
    reflection: {
      magnitude: R.map((R) => R.absolute()),
      phase: R.map((R) => R.angle())
    },
    absorption: a
  };
}
