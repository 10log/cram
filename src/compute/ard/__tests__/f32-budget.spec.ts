/**
 * The precision budget a GPU port has to respect — Phase 10 of the ARD solver
 * (docs/ard-solver-plan.md).
 *
 * WGSL has no `f64`, and the plan flagged that as the open question to settle
 * *before* committing to a GPU implementation: the modal update is a
 * marginally-stable second-order recurrence run for 10 000–20 000 steps, and
 * whether f32 survives that horizon is not a rounding footnote.
 *
 * It does — but only if the update is reformulated. These tests pin the
 * finding, because nothing in the shipped f64 solver would catch its loss and
 * the obvious transcription of the published formula is the broken one.
 *
 * Nothing here tests production code. It tests an arithmetic constraint on code
 * that does not exist yet, in the same spirit as `ard-wiring.spec.ts`: the
 * numbers are the deliverable, and a future GPU kernel written against the
 * textbook form would be wrong in a way that looks like physics.
 */

const f = Math.fround;

/** Steps in a one-second impulse response at the plan's defaults. */
const STEPS_ONE_SECOND = 6500;
/** Three seconds — the horizon the plan asked about. */
const STEPS_LONG = 20000;

/** Exact solution of the unforced recurrence seeded with `M₀ = sin θ, M₋₁ = 0`. */
function exact(theta: number, steps: number): number {
  return Math.sin((steps + 1) * theta);
}

/**
 * The textbook modal update: `M' = 2·M·cos(ωΔt) − P`.
 *
 * `roundState` and `roundCos` select what gets rounded to f32, so the two
 * error sources can be separated.
 */
function textbook(
  theta: number,
  steps: number,
  { roundState = false, roundCos = false } = {},
): number {
  const c = roundCos ? f(Math.cos(theta)) : Math.cos(theta);
  const r = roundState ? f : (x: number) => x;
  let p = r(0);
  let m = r(Math.sin(theta));
  for (let n = 0; n < steps; n++) {
    const next = roundState ? f(f(f(2 * m) * c) - p) : 2 * m * c - p;
    p = m;
    m = next;
  }
  return m;
}

/**
 * The f32-safe form: `M' = M + (M − P) − k·M`, with `k = 2(1 − cos ωΔt)`
 * evaluated in double and stored as f32.
 *
 * Algebraically identical — `M + (M − P) − 2M(1 − cos) = 2M·cos − P` — but it
 * never stores `cos ωΔt` itself. That is the whole difference.
 */
function safeForm(theta: number, steps: number): number {
  const k = f(2 * (1 - Math.cos(theta)));
  let p = f(0);
  let m = f(Math.sin(theta));
  for (let n = 0; n < steps; n++) {
    const next = f(f(m + f(m - p)) - f(k * m));
    p = m;
    m = next;
  }
  return m;
}

/** Frequency in Hz a given `ωΔt` corresponds to at the plan's default `Δt`. */
const DT = 1.5e-4;
const hz = (theta: number) => theta / (2 * Math.PI) / DT;

describe('f32 modal drift', () => {
  it('is caused by storing cos(wdt), not by storing the state', () => {
    // The distinction decides whether a GPU port is viable at all. State
    // rounding is unavoidable in f32; rounding `cos` is a choice.
    for (const theta of [0.005, 0.02, 0.05, 0.2]) {
      const want = exact(theta, STEPS_LONG);
      const stateOnly = Math.abs(textbook(theta, STEPS_LONG, { roundState: true }) - want);
      const cosOnly = Math.abs(textbook(theta, STEPS_LONG, { roundCos: true }) - want);
      const both = Math.abs(
        textbook(theta, STEPS_LONG, { roundState: true, roundCos: true }) - want,
      );

      // Rounding `cos` alone is as bad as rounding everything...
      expect(cosOnly / both).toBeGreaterThan(0.5);
      expect(cosOnly / both).toBeLessThan(2);
      // ...and rounding the state alone is orders of magnitude better.
      expect(stateOnly).toBeLessThan(cosOnly / 20);
    }
  });

  it('grows without bound in the textbook form, and does not in the safe one', () => {
    // The signature of a *frequency* error rather than noise: it accumulates
    // as phase, linearly in the step count. Noise would go as sqrt(N) and a
    // stable formulation stays flat.
    const theta = 0.05; // 53 Hz at the default time step
    const err = (steps: number, safe: boolean) =>
      Math.abs(
        (safe ? safeForm(theta, steps) : textbook(theta, steps, { roundState: true, roundCos: true })) -
          exact(theta, steps),
      );

    const short = err(2000, false);
    const long = err(32000, false);
    // 16x the steps, and the error follows — measured 2.9e-4 to 3.2e-3.
    expect(long / short).toBeGreaterThan(5);

    // The safe form does not grow at all over the same range: measured 3.3e-5
    // at 2000 steps and 1.2e-5 at 32000, which is scatter, not a trend.
    expect(err(32000, true)).toBeLessThan(4 * err(2000, true));
    expect(err(32000, true)).toBeLessThan(err(32000, false) / 20);
  });

  it('is under a tenth of a percent of amplitude across the audible band', () => {
    // The budget itself. `M` here has unit amplitude, so the error is a
    // fraction of full scale. A GPU port using the safe form has to stay
    // inside this for the mode frequencies a room actually has.
    for (const theta of [0.02, 0.05, 0.2, 1.0, 3.0]) {
      expect(hz(theta)).toBeGreaterThan(20);
      const error = Math.abs(safeForm(theta, STEPS_ONE_SECOND) - exact(theta, STEPS_ONE_SECOND));
      expect(error).toBeLessThan(1e-3);
    }
  });

  it('would exceed one percent of amplitude in the textbook form by 20 Hz', () => {
    // What the budget buys, stated as the failure it avoids: a 21 Hz mode,
    // which a large room has, is out by 1% of full scale over three seconds —
    // and worse the lower the mode.
    const theta = 0.02;
    expect(hz(theta)).toBeCloseTo(21, 0);
    const broken = Math.abs(
      textbook(theta, STEPS_LONG, { roundState: true, roundCos: true }) - exact(theta, STEPS_LONG),
    );
    expect(broken).toBeGreaterThan(1e-2);
    expect(Math.abs(safeForm(theta, STEPS_LONG) - exact(theta, STEPS_LONG))).toBeLessThan(
      broken / 50,
    );
  });

  it('is not a problem in the double-precision solver that ships today', () => {
    // Which is why the reformulation is not applied to `DctPartition`: in f64
    // the two forms agree to within their own noise, so changing validated
    // numerics would be churn. The constraint belongs to the GPU path.
    for (const theta of [0.002, 0.05, 1.0]) {
      const want = exact(theta, STEPS_LONG);
      const textbookF64 = Math.abs(textbook(theta, STEPS_LONG) - want);
      expect(textbookF64).toBeLessThan(1e-9);
    }
  });
});
