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
 * How `k = 2(1 − cos ωΔt)` is arrived at, which turns out to matter as much as
 * using `k` at all.
 *
 *  - `precomputed` — evaluated in double on the CPU and uploaded as f32.
 *  - `halfAngle` — `4·sin²(ωΔt/2)`, computed entirely in f32. Identical
 *    algebraically, and free of cancellation because `sin(θ/2)` for a small
 *    angle has full relative precision, so squaring it keeps it.
 *  - `naive` — `2(1 − cos ωΔt)` evaluated in f32, which is what a WGSL
 *    transcription of the reformulation looks like if nobody thinks about it.
 *    The subtraction throws away exactly what the reformulation was for.
 */
type KForm = 'precomputed' | 'halfAngle' | 'naive';

function coefficient(theta: number, form: KForm): number {
  if (form === 'precomputed') return f(2 * (1 - Math.cos(theta)));
  if (form === 'halfAngle') return f(4 * f(Math.sin(f(theta / 2))) ** 2);
  return f(2 * f(1 - f(Math.cos(theta))));
}

/**
 * The f32-safe update: `M' = M + (M − P) − k·M`.
 *
 * Algebraically identical to the textbook form — `M + (M − P) − 2M(1 − cos) =
 * 2M·cos − P` — but it never stores `cos ωΔt` itself. That is the whole
 * difference, provided `k` does not go through `cos` in f32 on its way in.
 */
function safeForm(theta: number, steps: number, form: KForm = 'precomputed'): number {
  const k = coefficient(theta, form);
  let p = f(0);
  let m = f(Math.sin(theta));
  for (let n = 0; n < steps; n++) {
    const next = f(f(m + f(m - p)) - f(k * m));
    p = m;
    m = next;
  }
  return m;
}

/** The safe update in double, for the neutrality claim about the shipped solver. */
function safeFormF64(theta: number, steps: number): number {
  const k = 2 * (1 - Math.cos(theta));
  let p = 0;
  let m = Math.sin(theta);
  for (let n = 0; n < steps; n++) {
    const next = m + (m - p) - k * m;
    p = m;
    m = next;
  }
  return m;
}

/** Frequency in Hz a given `ωΔt` corresponds to at the plan's default `Δt`. */
const DT = 1.5e-4;
const hz = (theta: number) => theta / (2 * Math.PI) / DT;

/**
 * Where the k-form is the right choice: `k = 2(1 − cos ωΔt)` small enough that
 * `M + (M − P) − k·M` has no cancellation of its own. Measured crossover is
 * around `k = 0.5`; see the per-mode test below for the numbers either side.
 */
const K_CROSSOVER = 0.5;
const smallK = (theta: number) => 2 * (1 - Math.cos(theta)) < K_CROSSOVER;

/** What a correct kernel does: the k-form below the crossover, textbook above. */
function bestForm(theta: number, steps: number): number {
  return smallK(theta)
    ? safeForm(theta, steps, 'precomputed')
    : textbook(theta, steps, { roundState: true, roundCos: true });
}

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

  it('keeps every mode under a tenth of a percent of amplitude', () => {
    // The budget itself. `M` here has unit amplitude, so the error is a
    // fraction of full scale, and the horizon is the long one: over 6500 steps
    // the textbook form is already under 1e-3 above about 50 Hz, so a budget
    // stated there would pass whether or not the reformulation is used.
    //
    // `theta` runs to 2.18, which is not arbitrary — it is the largest
    // `omega*dt` a run produces, at the corner of the mode cube:
    // `pi * sqrt(3) * Courant` at the plan's default 0.4.
    for (const theta of [0.02, 0.05, 0.2, 1.0, 1.5, 2.18]) {
      const want = exact(theta, STEPS_LONG);
      expect(Math.abs(bestForm(theta, STEPS_LONG) - want)).toBeLessThan(1e-3);
    }
  });

  it('needs the k-form only where k is small, and needs it badly there', () => {
    // A correction to the first reading of this finding. The k-form is not a
    // universal replacement: it has a cancellation of its own once `k` is
    // O(1), between `M + (M − P)` and `k·M`. Measured at 20 000 steps, ratio
    // of textbook error to k-form error:
    //
    //   theta 0.05 (k 0.00): 45x     theta 1.2 (k 1.28): 0.59x
    //   theta 0.20 (k 0.04): 28x     theta 1.8 (k 2.45): 0.18x
    //   theta 0.50 (k 0.24): 3.7x    theta 2.0 (k 2.83): 0.21x
    //
    // So the rule is to pick per mode, which costs nothing when the
    // coefficients are precomputed anyway. Below the crossover the k-form is
    // required; above it, either works and both are inside the budget.
    for (const theta of [0.02, 0.05, 0.2, 0.5]) {
      expect(smallK(theta)).toBe(true);
      const want = exact(theta, STEPS_LONG);
      const kForm = Math.abs(safeForm(theta, STEPS_LONG) - want);
      const text = Math.abs(
        textbook(theta, STEPS_LONG, { roundState: true, roundCos: true }) - want,
      );
      expect(text / kForm).toBeGreaterThan(3);
    }

    // Above the crossover neither form is in trouble, which is the part that
    // makes a per-mode choice safe rather than a compromise.
    for (const theta of [1.2, 1.8, 2.18]) {
      expect(smallK(theta)).toBe(false);
      const want = exact(theta, STEPS_LONG);
      expect(Math.abs(textbook(theta, STEPS_LONG, { roundState: true, roundCos: true }) - want))
        .toBeLessThan(1e-3);
      expect(Math.abs(safeForm(theta, STEPS_LONG) - want)).toBeLessThan(1e-3);
    }
  });

  it('depends on how k is computed as much as on using k at all', () => {
    // The trap. `M' = M + (M − P) − k·M` with `k = 2(1 − cos wdt)` evaluated
    // in f32 is the natural WGSL transcription of the reformulation, and it is
    // no better than the form it replaces: the subtraction throws away exactly
    // the small quantity the reformulation exists to keep.
    for (const theta of [0.005, 0.02, 0.05]) {
      const want = exact(theta, STEPS_LONG);
      const naive = Math.abs(safeForm(theta, STEPS_LONG, 'naive') - want);
      const broken = Math.abs(
        textbook(theta, STEPS_LONG, { roundState: true, roundCos: true }) - want,
      );
      // Indistinguishable from the textbook form — measured 6.1e-2 against
      // 6.2e-2 at 5 Hz.
      expect(naive / broken).toBeGreaterThan(0.5);
      expect(naive / broken).toBeLessThan(2);

      // Both safe routes are an order of magnitude better or more: precompute
      // `k` in double on the CPU and upload it, or use the half-angle identity
      // `k = 4·sin²(wdt/2)`, which has no cancellation to lose.
      for (const form of ['precomputed', 'halfAngle'] as const) {
        expect(Math.abs(safeForm(theta, STEPS_LONG, form) - want)).toBeLessThan(naive / 10);
      }
    }
  });

  it('keeps the half-angle route inside the budget too', () => {
    // A kernel that cannot upload per-mode coefficients has to compute `k`
    // itself. The half-angle route drifts a little where the precomputed one
    // does not — measured 9.4e-6 at 2000 steps against 4.4e-5 at 32000 — but
    // it stays two orders under the naive route and inside the budget, which
    // is what it has to do.
    const theta = 0.05;
    const err = (steps: number, form: KForm) =>
      Math.abs(safeForm(theta, steps, form) - exact(theta, steps));
    for (const steps of [2000, 8000, 32000]) {
      expect(err(steps, 'halfAngle')).toBeLessThan(1e-3);
      expect(err(steps, 'halfAngle')).toBeLessThan(err(steps, 'naive') / 10);
    }
    // And the naive route grows over that range where the half-angle does not
    // meaningfully: 3.2e-4 to 3.2e-3, a factor of ten for a factor of sixteen.
    expect(err(32000, 'naive')).toBeGreaterThan(5 * err(2000, 'naive'));
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
    //
    // Pinned as a comparison rather than as prose, so a later change that
    // "helpfully" rewrites `DctPartition` to the k-form has a number to point
    // at — in either direction. If this ever stops holding, the neutrality
    // argument stops holding with it.
    for (const theta of [0.002, 0.01, 0.05, 0.3, 1.0]) {
      for (const steps of [STEPS_ONE_SECOND, STEPS_LONG]) {
        const want = exact(theta, steps);
        const textbookError = Math.abs(textbook(theta, steps) - want);
        const safeError = Math.abs(safeFormF64(theta, steps) - want);

        // Both far below anything physical...
        expect(textbookError).toBeLessThan(1e-9);
        expect(safeError).toBeLessThan(1e-9);
        // ...and neither systematically better: measured ratio 1.0 to 1.1
        // across every mode and horizon here.
        const ratio = textbookError / safeError;
        expect(ratio).toBeGreaterThan(0.5);
        expect(ratio).toBeLessThan(2);
      }
    }
  });
});
