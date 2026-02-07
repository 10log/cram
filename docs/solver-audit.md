# Solver Audit Report

Comprehensive review of acoustic solver implementations in CRAM, identifying correctness errors, numerical issues, and potential bugs.

**Date:** 2026-02-05
**Scope:** All registered solvers and supporting acoustics library functions

---

## Critical Issues

### 1. FDTD 2D: CFL Stability Condition Violated

**File:** `src/compute/2d-fdtd/index.ts:150`
**Severity:** High

The time step is computed as `dt = cellSize / waveSpeed`, giving a Courant number of `C = c * dt / dx = 1.0`. For the 2D wave equation, the CFL condition requires `C <= 1/sqrt(2) ≈ 0.707`. The current value of 1.0 exceeds this, meaning the simulation is **numerically unstable** and will diverge over time.

**Fix:** `dt = cellSize / (waveSpeed * Math.sqrt(2))`

---

### 2. Energy Decay: `schroederBackwardsIntegration` Mutates Input via `.reverse()`

**File:** `src/compute/energy-decay.ts:198`
**Severity:** High

`Float32Array.reverse()` reverses in-place. After line 198, `data_reversed` and `data` are the same reversed array. Subsequent operations on `data` (line 204) operate on already-reversed data, producing incorrect backwards integration results.

**Fix:** Copy the array before reversing: `let data_reversed = new Float32Array(data).reverse();`

---

### 3. Energy Decay: `trimIR` Out-of-Bounds Array Access

**File:** `src/compute/energy-decay.ts:267-271`
**Severity:** High

`sindex` is initialized to `ir.length`, which is one past the last valid index. `Math.abs(ir[ir.length])` returns `NaN`, and `NaN < tolerance` is `false`, so the while loop exits immediately. The tail-trimming logic is non-functional.

**Fix:** Initialize `sindex = ir.length - 1`.

---

### 4. Ray Tracer: Hardcoded 4000 Hz in Recursive `traceRay`

**File:** `src/compute/raytracer/index.ts:713`
**Severity:** High

When `traceRay` recurses, the frequency argument is always `4000` regardless of what was originally passed. All recursive bounces compute reflection losses at 4000 Hz only.

**Fix:** Pass the `frequency` parameter through the recursive call instead of the literal `4000`.

---

## Medium Issues

### 5. Image Source: `isvalid` Skips First Surface in Occlusion Check

**File:** `src/compute/raytracer/image-source/index.ts:193`
**Severity:** Medium

The occlusion check loop starts at `j = 1` instead of `j = 0`, so the first surface in the room's surface list is never tested for occlusion. Paths occluded by that surface will be incorrectly reported as valid.

**Fix:** Change `let j = 1` to `let j = 0`.

---

### 6. FDTD 2D: `addWall` Uses `nx` Instead of `ny` for Y-Coordinate Clamping

**File:** `src/compute/2d-fdtd/index.ts:391-393`
**Severity:** Medium

Both `y1` and `y2` are clamped to `this.nx - 1` instead of `this.ny - 1`. When the grid is non-square (`nx != ny`), walls near the top edge will be clipped to the wrong boundary.

**Fix:** Change the y-coordinate clamp upper bound from `this.nx - 1` to `this.ny - 1`.

---

### 7. RT60: Eyring and Arau-Puchades Produce NaN/Infinity with High Absorption

**File:** `src/compute/rt/index.ts:161, 227-229`
**Severity:** Medium

`Math.log(1 - avg_abs)` produces `-Infinity` when `avg_abs === 1` and `NaN` when `avg_abs > 1` (possible from bad material data). No guard exists in either Eyring or Arau-Puchades implementations.

**Fix:** Clamp absorption coefficients to `[0, 0.99]` before passing to the log function, or add explicit guard logic.

---

### 8. Ray Tracer: Non-Uniform Random Scattering Direction

**File:** `src/compute/raytracer/index.ts:690`
**Severity:** Medium

When scattering occurs, the random direction is generated as `new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize()`. This samples uniformly from a cube and normalizes, producing a bias toward cube corners (higher density near diagonals). For room acoustic ray tracing, a cosine-weighted (Lambertian) distribution over the hemisphere is standard for diffuse scattering.

**Fix:** Use proper hemisphere sampling, e.g., via rejection sampling on a unit sphere or spherical coordinates with `cos`-weighted theta.

---

### 9. Reflection Coefficient: Uses `sin(theta)` Where Standard Formula Uses `cos(theta)`

**File:** `src/compute/acoustics/reflection-coefficient.ts:15-16`
**Severity:** Medium

The formula computes `R = ((xi_o * sin(theta) - 1) / (xi_o * sin(theta) + 1))^2`. The standard locally-reactive reflection coefficient formula is `R = ((xi * cos(theta) - 1) / (xi * cos(theta) + 1))^2`. Using `sin` instead of `cos` inverts the angle dependence. This needs verification against the angle convention used in the ray tracer (angle from normal vs. angle from surface).

---

## Low Issues

### 10. RT60: Hardcoded Air Absorption Instead of Using `airAttenuation()`

**File:** `src/compute/rt/index.ts:281-303`
**Severity:** Low

The `airAbs20c40rh()` function uses hardcoded lookup values for 20C/40%RH only and returns 0 for 125 Hz and 250 Hz. The codebase has a proper ISO-standards-based `airAttenuation()` function in `src/compute/acoustics/air-attenuation.ts` that handles arbitrary conditions.

**Fix:** Replace `airAbs20c40rh()` with calls to the existing `airAttenuation()` function.

---

### 11. RT60: Arau-Puchades Missing Air Absorption Term

**File:** `src/compute/rt/index.ts:225-231`
**Severity:** Low

The Sabine and Eyring methods include an air absorption term (`4*m*V`), but the Arau-Puchades implementation omits it entirely.

**Fix:** Add the air absorption term to the Arau-Puchades formula for consistency with the other methods.

---

### 12. Energy Decay: Console Log Mislabeled "T10" vs "T15"

**File:** `src/compute/energy-decay.ts:97`
**Severity:** Low

`console.log("T10 Values: ")` is followed by `console.log(this.T15)`. The label should say "T15".

---

### 13. Energy Decay: `calculateAcParams` Auto-Downloads CSV

**File:** `src/compute/energy-decay.ts:104`
**Severity:** Low

`calculateAcParams()` unconditionally calls `this.downloadResultsAsCSV()`, triggering a file save dialog every time parameters are calculated. This is likely unintentional for a calculation function.

**Fix:** Remove the auto-download call from `calculateAcParams()` and let the user trigger it explicitly.

---

### 14. Scattered Energy: Missing Clamp for Negative `cos(theta)`

**File:** `src/compute/raytracer/scattered-energy.ts:22`
**Severity:** Low

`cos(theta)` can be negative when `theta > pi/2` (receiver behind the surface), producing a physically meaningless negative energy value.

**Fix:** Use `Math.max(0, cos(theta))` to clamp the result.

---

### 15. Image Source: Hardcoded Speed of Sound

**File:** `src/compute/raytracer/image-source/index.ts:489,537,691`
**Severity:** Low

The speed of sound is hardcoded as `343` in many places rather than using `ac.soundSpeed(temperature)`. This prevents temperature from affecting results.

---

### 16. Image Source: `reflectPointAcrossSurface` Computes Unused Normal

**File:** `src/compute/raytracer/image-source/index.ts:1063-1068`
**Severity:** Low

The function computes `normal_calc` from surface vertices but never uses it, instead using `surface.normal`. If these disagree (e.g., due to transforms or winding order), the reflection point will be wrong.

**Fix:** Either use the computed normal or remove the dead code.
