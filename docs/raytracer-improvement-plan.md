# Raytracer Solver Improvement Plan

Comprehensive plan for improving the stochastic Monte Carlo ray tracing solver in CRAM.

**Date:** 2026-02-06
**Updated:** 2026-02-06 — PRs #43–#60 merged
**Scope:** `src/compute/raytracer/index.ts` and supporting modules
**Current state:** ~2300 lines, `@ts-nocheck`, Phase 1 complete, all 16 audit issues resolved

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Phase 1: Critical Bug Fixes](#2-phase-1-critical-bug-fixes)
3. [Phase 2: Frequency-Dependent Ray Tracing](#3-phase-2-frequency-dependent-ray-tracing)
4. [Phase 3: Physically Correct Scattering](#4-phase-3-physically-correct-scattering)
5. [Phase 4: Air Absorption During Propagation](#5-phase-4-air-absorption-during-propagation)
6. [Phase 5: Source and Receiver Directivity](#6-phase-5-source-and-receiver-directivity)
7. [Phase 6: Reflection Coefficient Corrections](#7-phase-6-reflection-coefficient-corrections)
8. [Phase 7: Convergence and Variance Reduction](#8-phase-7-convergence-and-variance-reduction)
9. [Phase 8: Code Quality and Architecture](#9-phase-8-code-quality-and-architecture)
10. [Phase 9: Performance Optimization](#10-phase-9-performance-optimization)
11. [Phase 10: Advanced Features](#11-phase-10-advanced-features)
12. [File Manifest](#12-file-manifest)
13. [References](#13-references)

---

## 1. Executive Summary

The raytracer is the most feature-rich solver in CRAM, supporting Monte Carlo ray tracing, hybrid image-source/ray-tracing, ambisonic output, and real-time visualization. However, it has critical correctness issues that undermine the accuracy of its results:

- ~~**Hardcoded 4000 Hz** in recursive `traceRay` means all reflection losses are computed at a single frequency~~ **Fixed in PR #46**
- ~~**Non-uniform scattering distribution** biases scattered rays toward cube diagonals~~ **Fixed in PR #50** (cosine-weighted hemisphere sampling)
- **No air absorption during ray propagation** — only applied post-hoc during IR synthesis
- ~~**Reflection coefficient uses `sin(theta)` instead of `cos(theta)`** in the standard impedance formula~~ **Fixed in PR #51**
- **`arrivalPressure` uses `1 - absorption` instead of angle-dependent reflection coefficient** at each surface
- **`@ts-nocheck` disables all TypeScript safety** across 2300+ lines

The plan is organized into 10 phases, from critical fixes (hours) to advanced features (weeks). Each phase is independently valuable and shippable.

### Progress Summary

All 16 issues from `solver-audit.md` have been resolved (PRs #43–#58). Additionally, PR #60 implemented the Acoustic Radiance Transfer (ART) solver as a new feature.

| Phase | Status | PRs |
|-------|--------|-----|
| **Phase 1: Critical Bug Fixes** | **Complete** | #46, #47, #50, #56 |
| Phase 2: Frequency-Dependent Ray Tracing | Complete | #69 |
| Phase 3: Physically Correct Scattering | Partially complete (3a, 3b done) | #50, #70 |
| **Phase 4: Air Absorption During Propagation** | **Complete** | #57, #63 |
| **Phase 5: Source and Receiver Directivity** | **Complete** | #72 |
| Phase 6: Reflection Coefficient Corrections | Partially complete (6a done) | #51 |
| Phase 7: Convergence and Variance Reduction | Not started | — |
| Phase 8: Code Quality and Architecture | Not started | — |
| Phase 9: Performance Optimization | Not started | — |
| Phase 10: Advanced Features | Not started | — |

**Other merged fixes** (from solver-audit.md, outside plan scope):

| PR | Fix |
|----|-----|
| #43 | CFL stability condition for 2D FDTD (audit #1) |
| #44 | Array mutation in Schroeder backwards integration (audit #2) |
| #45 | trimIR out-of-bounds access (audit #3) |
| #48 | addWall ny clamp for non-square FDTD grids (audit #6) |
| #49 | Eyring/Arau-Puchades NaN guard for high absorption (audit #7) |
| #52 | ISO-based air attenuation in RT60 (audit #10) |
| #53 | Air absorption term in Arau-Puchades (audit #11) |
| #54 | Mislabeled T10/T15 console log (audit #12) |
| #55 | Auto-download side effect removal (audit #13) |
| #57 | Hardcoded speed of sound in image source (audit #15) |
| #58 | Dead normal computation removal (audit #16) |

**New feature:**

| PR | Feature |
|----|---------|
| #60 | Acoustic Radiance Transfer (ART) solver — progressive radiosity with BRDF, BVH ray tracing, per-band energy, direct path contribution |

---

## 2. Phase 1: Critical Bug Fixes ✅ Complete

**Priority:** Immediate
**Effort:** 4–6 hours
**Issues:** #4, #5, #8, #14 from solver-audit.md
**Status:** All four fixes merged.

### 1a. Pass `frequency` through recursive `traceRay` (Issue #4) ✅ PR #46

**File:** `src/compute/raytracer/index.ts:713`

The recursive call hardcodes `4000` instead of forwarding the `frequency` parameter. Every recursive bounce computes reflection losses at 4 kHz regardless of the actual band.

```typescript
// Current (line 713):
return this.traceRay(..., 4000);

// Fix:
return this.traceRay(..., frequency);
```

### 1b. Fix scattering direction sampling (Issue #8) ✅ PR #50

**File:** `src/compute/raytracer/index.ts:690`

Uniform cube sampling normalized to the sphere produces a non-uniform distribution biased toward cube corners [1]. Replaced with cosine-weighted hemisphere sampling (Lambertian):

```typescript
// Current:
rr = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();

// Fix — uniform hemisphere sampling:
const u1 = Math.random();
const u2 = Math.random();
const cosTheta = u1;                          // uniform hemisphere
const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
const phi = 2 * Math.PI * u2;
const localDir = new THREE.Vector3(
  sinTheta * Math.cos(phi),
  sinTheta * Math.sin(phi),
  cosTheta
);
// Transform from local (normal = z-up) to world frame
rr = localToWorld(localDir, normal);
```

For Lambertian (cosine-weighted) scattering per Lambert's law [2]:
```typescript
const cosTheta = Math.sqrt(u1);  // cosine-weighted
```

### 1c. Fix image source occlusion check (Issue #5) ✅ PR #47

**File:** `src/compute/raytracer/image-source/index.ts:193`

The loop started at `j = 1`, skipping the first surface in occlusion checks.

```typescript
// Current:
for(let j = 1; j < room_surfaces.length; j++){

// Fix:
for(let j = 0; j < room_surfaces.length; j++){
```

### 1d. Clamp scattered energy (Issue #14) ✅ PR #56

**File:** `src/compute/raytracer/scattered-energy.ts:22`

Fixed: negative `cos(theta)` clamped to 0 for behind-surface cases.

### Tests

- Uniform distribution test: Generate 10K scattered directions, bin into solid-angle cells, verify chi-squared uniformity
- Frequency propagation test: Trace ray at 500 Hz, verify reflection losses use 500 Hz absorption
- Occlusion test: Place source behind first surface, verify image source correctly reports occlusion

---

## 3. Phase 2: Frequency-Dependent Ray Tracing

**Priority:** High
**Effort:** 8–12 hours
**Depends on:** Phase 1a

### Problem

Currently `traceRay` computes a single scalar `energy` that decays at each reflection using `surface.reflectionFunction(frequency, angle)` at a single frequency. The `arrivalPressure` method then separately recomputes frequency-dependent losses by walking the chain. This means:

1. The ray's energy threshold check (`reflectionloss > 1/2^16`) only considers one frequency
2. Rays that should have died at high frequencies (strong absorption) continue propagating
3. Rays that should survive at low frequencies (weak absorption) may terminate early

### Solution: Per-Band Energy Tracking

Replace the scalar `energy` parameter with a per-band energy array tracked through each reflection:

```typescript
interface BandEnergy {
  frequencies: number[];
  values: Float32Array;   // energy per band
}

traceRay(
  ro: Vector3, rd: Vector3,
  order: number,
  bandEnergy: BandEnergy,    // replaces scalar energy
  source: string,
  initialPhi: number, initialTheta: number,
  iter: number = 1,
  chain: Chain[] = [],
) {
  // ... intersection ...

  // At each reflection:
  for (let f = 0; f < bandEnergy.frequencies.length; f++) {
    const R = surface.reflectionFunction(bandEnergy.frequencies[f], angle);
    bandEnergy.values[f] *= Math.abs(R);
  }

  // Termination: check if ALL bands are below threshold
  const maxEnergy = Math.max(...bandEnergy.values);
  if (maxEnergy > 1 / 2**16 && iter < order + 1) {
    return this.traceRay(hitPoint, reflectedDir, order, bandEnergy, ...);
  }
}
```

### Impact on `arrivalPressure`

With per-band energy tracked during tracing, `arrivalPressure` no longer needs to re-walk the chain. The stored `bandEnergy.values` at the receiver already contains the correct frequency-dependent attenuation. This is both faster and more accurate.

### Impact on `Chain` Interface

Each chain entry should store the per-band energy state:

```typescript
interface Chain {
  object: string;
  angle: number;
  distance: number;
  point: [number, number, number];
  faceNormal: [number, number, number];
  bandEnergy?: Float32Array;  // energy at this point, per band
}
```

### Impact on Visualization

The energy-based coloring currently uses a scalar. With per-band energy, use the broadband sum or a user-selected band for coloring:

```typescript
const displayEnergy = bandEnergy.values.reduce((a, b) => a + b, 0) / bandEnergy.frequencies.length;
```

### Migration

- Default frequencies: `[125, 250, 500, 1000, 2000, 4000, 8000]` (standard octave bands)
- Backward-compatible: if no frequencies specified, fall back to scalar energy at 1000 Hz
- `RayPath` interface extended with `bandEnergy` field; old paths without it still work

---

## 4. Phase 3: Physically Correct Scattering — Partially Complete

**Priority:** High
**Effort:** 6–8 hours
**Depends on:** Phase 1b ✅

### Current Behavior

Scattering is a binary probabilistic choice: with probability `s` (the surface's scattering coefficient), the ray is scattered into a random direction; otherwise it reflects specularly. This is the standard stochastic approach [3] but has issues:

1. **Scattering coefficient is frequency-independent** — real surfaces scatter more at high frequencies
2. **No Lambertian weighting** — scattered rays should follow Lambert's cosine law
3. **Scattering coefficient is accessed via private `_scatteringCoefficient`** — no public API

### 3a. Frequency-Dependent Scattering Coefficient

Surfaces should expose a `scatteringFunction(freq)` method analogous to `absorptionFunction(freq)`. The scattering coefficient at each frequency determines the probability of diffuse vs. specular reflection at that bounce.

With per-band energy (Phase 2), scattering can be handled per-band:

```typescript
for (let f = 0; f < nBands; f++) {
  const s = surface.scatteringFunction(frequencies[f]);
  if (probability(s)) {
    // This band's energy goes into diffuse direction
    bandEnergy.values[f] *= diffuseWeight;
  } else {
    // This band's energy goes into specular direction
    bandEnergy.values[f] *= specularWeight;
  }
}
```

However, this creates a problem: each band wants a different direction. The standard solution from Vorländer [3] is to split the ray energy:

```typescript
const specularEnergy = bandEnergy.clone();
const diffuseEnergy = bandEnergy.clone();
for (let f = 0; f < nBands; f++) {
  const s = surface.scatteringFunction(frequencies[f]);
  specularEnergy.values[f] *= (1 - s);
  diffuseEnergy.values[f] *= s;
}
// Trace specular ray with specularEnergy
// Trace diffuse ray with diffuseEnergy (Lambertian direction)
```

This doubles the ray count at each reflection. To avoid exponential growth, use the **probabilistic single-ray approach**: randomly choose specular or diffuse based on the broadband scattering coefficient, but weight the energy by the per-band coefficients. This is the standard practice in ODEON, CATT-Acoustic, and similar tools [3, 4].

### 3b. Lambertian Scattering Distribution ✅ PR #50

Implemented in PR #50 as part of Phase 1b. Scattered rays now use cosine-weighted hemisphere sampling:

```typescript
const cosTheta = Math.sqrt(Math.random());
const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
const phi = 2 * Math.PI * Math.random();
```

This produces directions biased toward the normal, matching the physical behavior of diffuse scattering from rough surfaces [1, 5].

### 3c. Surface Scattering Data Model

Add to the `Surface` class:

```typescript
get scatteringCoefficient(): number { ... }  // broadband, for backward compat
scatteringFunction(freq: number): number { ... }  // frequency-dependent
```

Material database entries should include optional per-band scattering coefficients. Default: use the ISO 17497-1 frequency-dependent model or a constant value [6].

---

## 5. Phase 4: Air Absorption During Propagation ✅ Complete

**Priority:** High
**Effort:** 4–6 hours
**Depends on:** Phase 2

### Current Behavior

Air absorption is applied **only** in `arrivalPressure()` after all ray tracing is complete. It uses `ac.airAttenuation(freqs)` (dB/m) multiplied by total path length. This means:

1. Ray energy termination doesn't account for air absorption — long-distance rays in large rooms persist far too long
2. The post-hoc application is mathematically correct for the total path but doesn't affect the convergence behavior of the Monte Carlo process

### Solution: Apply Per-Segment Air Absorption

At each reflection, after computing surface reflection loss, apply air absorption for the segment distance:

```typescript
// After surface reflection:
const airAtt = ac.airAttenuation(bandEnergy.frequencies); // dB/m per band
for (let f = 0; f < nBands; f++) {
  // Convert dB/m attenuation to linear factor for this segment distance
  const attenuationFactor = Math.pow(10, -airAtt[f] * segmentDistance / 20);
  bandEnergy.values[f] *= attenuationFactor;
}
```

This makes the energy threshold check frequency-aware and distance-aware. In large rooms (concert halls, cathedrals), high-frequency rays will correctly terminate earlier than low-frequency rays, matching physical behavior.

### Temperature Dependency — Partially Complete

Air absorption depends on temperature and humidity [7]. The image source solver already has a configurable `temperature` property (PR #57). The main raytracer still needs the same treatment:

```typescript
public temperature: number = 20;  // Celsius

get c(): number {
  return ac.soundSpeed(this.temperature);
}
```

Replace all hardcoded `343.2` occurrences with `this.c`.

**Done:** Image source solver (PR #57) — added `temperature` param with default 20°C, cached `this.c`.
**Done:** All solvers (PR #63) — added `temperature` property to RayTracer, BeamTraceSolver, RT60; per-segment air absorption in `traceRay`; all hardcoded `343.2`/`343` replaced; temperature passed to all `airAttenuation()` calls.

---

## 6. Phase 5: Source and Receiver Directivity ✅ Complete

**Priority:** Medium
**Effort:** 8–10 hours
**Depends on:** Phase 2
**Issue:** #64 — **Status:** Complete (PR #72)

### 5a. Source Directivity in Ray Generation

Currently, rays are generated uniformly within the source's theta/phi angular range, and directivity is applied only during `arrivalPressure()` via `source.directivityHandler.getPressureAtPosition()`. This wastes rays in low-directivity directions.

**Approach 1: Importance sampling** — Generate rays proportional to directivity pattern. Requires invertible directivity CDF, which is complex for measured patterns.

**Approach 2: Energy weighting** (recommended) — Keep uniform ray generation but weight each ray's initial energy by the source directivity in its launch direction:

```typescript
const directivityGain = sourceDH.getGainAtDirection(phi, theta, frequency);
const initialBandEnergy = new Float32Array(nBands);
for (let f = 0; f < nBands; f++) {
  initialBandEnergy[f] = directivityGain[f];
}
```

This is simpler, unbiased, and compatible with arbitrary directivity patterns. The tradeoff is higher variance in low-directivity directions, but this is acceptable since those directions contribute less energy overall.

### 5b. Receiver Directivity

Receivers are currently omnidirectional points. For microphone modeling, weight each arriving ray by the receiver's directional response:

```typescript
// In impulse response accumulation:
const receiverGain = receiver.directivityHandler.getGainAtDirection(
  arrivalDirection, frequency
);
for (let f = 0; f < nBands; f++) {
  samples[f][sampleIndex] += pressure[f] * phase * receiverGain[f];
}
```

Standard microphone patterns (omnidirectional, cardioid, figure-8) can be modeled analytically:

| Pattern | Gain(theta) |
|---------|------------|
| Omni | 1.0 |
| Cardioid | 0.5 + 0.5 * cos(theta) |
| Supercardioid | 0.37 + 0.63 * cos(theta) |
| Figure-8 | cos(theta) |

Where theta is the angle between the arrival direction and the receiver's forward axis.

### UI Changes

- Add a directivity pattern dropdown to the Receiver parameter panel
- Add visualization of the directivity pattern in the 3D view (polar plot overlay)

---

## 7. Phase 6: Reflection Coefficient Corrections — Partially Complete

**Priority:** Medium
**Effort:** 4–6 hours

### 6a. `sin(theta)` vs `cos(theta)` in Reflection Coefficient (Issue #9) ✅ PR #51

**File:** `src/compute/acoustics/reflection-coefficient.ts`

Fixed in PR #51: the formula now uses `cos(θ)` with `Math.abs()` to handle obtuse angles:

```typescript
const cosθ = Math.abs(Math.cos(θ));
const ξo_cosθ = ξo * cosθ;
```

The angle convention is `θ_normal` (0 = normal incidence, π/2 = grazing), which the ray tracer computes as the angle between the incoming ray and the face normal. Using `cos(θ_normal)` is correct since `cos(θ_normal) = sin(θ_surface)`, matching the standard locally-reactive formula [8]. Regression tests added for obtuse angles.

### 6b. `arrivalPressure` Uses `1 - absorption` Instead of Angle-Dependent Coefficient

**File:** `src/compute/raytracer/index.ts:1922–1929`

```typescript
R = 1 - surface.absorptionFunction(freqs[i]);
intensities[i] = I * R;
```

This uses `1 - α` (normal-incidence energy reflection coefficient) regardless of incidence angle. The correct approach uses the angle-dependent reflection coefficient that's already available:

```typescript
R = Math.abs(surface.reflectionFunction(freqs[i], chain[j].angle));
```

Also note the bug on line 1924-1925:
```typescript
if (freqs[i] === 16000) {
  R = 1 - surface.absorptionFunction(freqs[8000]); // freqs[8000] is wrong!
```

`freqs[8000]` indexes position 8000 in the array, not frequency 8000 Hz. This is clearly a bug — likely should be `surface.absorptionFunction(8000)` or the 16 kHz lookup should just use the last available band.

---

## 8. Phase 7: Convergence and Variance Reduction

**Priority:** Medium
**Effort:** 10–15 hours

### 7a. Convergence Monitoring

Add real-time convergence metrics to track when the impulse response has stabilized:

```typescript
interface ConvergenceMetrics {
  totalRays: number;
  validRays: number;
  estimatedT30: number[];        // per band
  t30Variance: number[];          // running variance
  convergenceRatio: number;       // variance / mean
}
```

Display in the Statistics panel. Auto-stop when convergence ratio drops below a threshold (e.g., 1%).

### 7b. Russian Roulette Termination

Replace the fixed energy threshold (`1/2^16`) with Russian Roulette [9], which provides unbiased early termination:

```typescript
const survivalProbability = Math.min(1.0, maxBandEnergy / threshold);
if (Math.random() > survivalProbability) {
  // Terminate ray
  return;
}
// Boost surviving ray energy to compensate
for (let f = 0; f < nBands; f++) {
  bandEnergy.values[f] /= survivalProbability;
}
```

This eliminates bias from hard energy cutoffs while reducing computation for low-energy rays.

### 7c. Stratified Sampling

Replace purely random ray generation with stratified sampling to reduce variance [1]:

```typescript
// Divide the source hemisphere into N strata
// Generate one ray per stratum with jittered position within the stratum
const strataPhi = Math.ceil(Math.sqrt(nRays));
const strataTheta = Math.ceil(nRays / strataPhi);
for (let i = 0; i < strataPhi; i++) {
  for (let j = 0; j < strataTheta; j++) {
    const phi = (i + Math.random()) / strataPhi * source.phi;
    const theta = (j + Math.random()) / strataTheta * source.theta;
    // ... trace ray ...
  }
}
```

This ensures more uniform coverage of the source hemisphere, reducing clustering artifacts and improving convergence rate by up to 2x for the same number of rays [1].

### 7d. Reciprocal Ray Tracing

For single-receiver scenarios, trace rays from both source and receiver simultaneously and connect matching paths. This squares the effective number of paths for a given number of rays [10].

---

## 9. Phase 8: Code Quality and Architecture

**Priority:** Medium
**Effort:** 12–16 hours

### 8a. Remove `@ts-nocheck`

The file currently disables all TypeScript checking. Incrementally re-enable by:

1. Remove `@ts-nocheck`
2. Add explicit types to all function parameters and return values
3. Replace `any` types with proper interfaces
4. Fix all remaining type errors

Key interfaces to formalize:

```typescript
interface Chain {
  object: string;          // surface/receiver UUID
  angle: number;           // incidence angle (from normal)
  distance: number;        // segment distance
  point: [number, number, number];
  faceNormal: [number, number, number];
  faceMaterialIndex: number;
  faceIndex: number;
  energy: number;
  bandEnergy?: Float32Array;
}

interface RayPath {
  chain: Chain[];
  chainLength: number;
  intersectedReceiver: boolean;
  energy: number;
  time: number;
  totalLength: number;
  source: string;
  initialPhi: number;
  initialTheta: number;
  arrivalDirection?: [number, number, number];
  bandEnergy?: Float32Array;
}
```

### 8b. Extract Methods into Modules

The 2300-line monolith should be decomposed:

| Module | Responsibility | Estimated Lines |
|--------|---------------|-----------------|
| `ray-tracer.ts` | Main class, lifecycle, store integration | ~400 |
| `ray-generation.ts` | Ray sampling, directivity weighting | ~150 |
| `ray-tracing.ts` | `traceRay`, intersection handling, reflection/scattering | ~300 |
| `impulse-response.ts` | IR calculation, filtering, normalization | ~400 |
| `visualization.ts` | Buffer geometry, shaders, color mapping | ~300 |
| `convergence.ts` | Metrics, variance estimation, auto-stop | ~150 |
| `hybrid.ts` | Image source integration, transition logic | ~200 |
| `types.ts` | Interfaces, enums, type definitions | ~100 |

### 8c. Remove Dead Code

- `calculateWithDiffuse()` — appears to be a legacy method, partially duplicates `calculateReflectionLoss()`
- `resampleResponse()` — complex resampling that is superseded by the filter-worker approach
- `saveImpulseResponse()` — CSV export that's superseded by WAV download
- `startQuickEstimate()` / `quickEstimateStep()` — quick RT60 estimate with its own scattering issues (line 760: same cube sampling bug)
- Commented-out code blocks throughout

### 8d. Fix Magic Numbers

| Value | Location | Meaning | Replace With | Status |
|-------|----------|---------|-------------|--------|
| `4000` | line 713 | Frequency for reflection loss | `frequency` parameter | ✅ PR #46 |
| `343.2` | line 990 | Speed of sound (m/s) | `this.c` or `ac.soundSpeed(this.temperature)` | ✅ PR #57 (image source only) |
| `0.01` | line 704 | Self-intersection offset (m) | `const SELF_INTERSECTION_OFFSET = 0.001` |
| `1/2^16` | line 701 | Energy termination threshold | `const MIN_ENERGY_THRESHOLD = 1e-5` |
| `256` | line 290 | Intensity sample rate | Named constant |
| `100` | various | Default SPL | Named constant |

---

## 10. Phase 9: Performance Optimization

**Priority:** Low
**Effort:** 10–20 hours

### 9a. Web Worker Ray Tracing

Move ray tracing computation to a Web Worker to avoid blocking the main thread. Currently, `startAllMonteCarlo()` uses `setInterval()` on the main thread, which competes with rendering and UI updates.

**Architecture:**
```
Main Thread                    Worker Thread
─────────────                  ─────────────
RayTracer.start()  ──────>    Worker receives scene data
                              Worker traces rays in batches
                   <──────    Worker posts back RayPath[]
RayTracer.appendRay()         (repeat until stopped)
RayTracer.stop()   ──────>    Worker terminates
```

**Challenge:** The worker needs a copy of the BVH and surface data. Serialize the BVH triangle array and material properties into transferable ArrayBuffers.

### 9b. Batch Ray Tracing

Instead of tracing one ray at a time with `setInterval`, trace batches of rays synchronously and yield between batches:

```typescript
async *traceRayBatch(batchSize: number = 1000) {
  for (let i = 0; i < batchSize; i++) {
    yield this.traceRay(...);
  }
}
```

This reduces the overhead of `setInterval` callbacks and allows the browser to maintain smooth rendering between batches.

### 9c. Reuse Allocated Objects

The current code creates many temporary `Vector3` objects per ray. Pre-allocate and reuse:

```typescript
private readonly _tempVec3 = new THREE.Vector3();
private readonly _tempNormal = new THREE.Vector3();
private readonly _tempReflected = new THREE.Vector3();
```

This reduces GC pressure, which can cause frame stutters during intensive tracing.

### 9d. Binary Path Encoding

The current `RayPath` stores data as JavaScript objects with string keys. For large path counts (>100K), use a compact binary encoding:

```typescript
// Per path: 4 bytes per float, packed
// [numChains:u16, source:u32, time:f32, totalLength:f32, energy:f32, ...]
// Per chain entry: [x:f32, y:f32, z:f32, angle:f32, distance:f32, surfaceIdx:u16]
```

This reduces memory by ~4x and improves cache locality.

---

## 11. Phase 10: Advanced Features

**Priority:** Low
**Effort:** 20+ hours each

### 10a. Edge Diffraction (UTD)

Implement the Uniform Theory of Diffraction [11] for edge diffraction:

1. Identify diffracting edges from room geometry (convex edges between surfaces)
2. For each ray that passes near an edge (within Fresnel zone), spawn a diffracted ray
3. Compute diffraction coefficient using Kouyoumjian-Pathak formulas
4. Add diffracted energy to the impulse response

This is critical for accurate prediction in rooms with columns, balconies, and other geometric discontinuities.

### 10b. Late Reverberation Tail Synthesis

For very late reflections (after the ray-traced portion decays), synthesize a statistical tail using the Schroeder backward integration of the traced energy:

1. Fit an exponential decay to the last portion of the ray-traced IR
2. Extrapolate the decay with frequency-dependent RT60
3. Synthesize noise with the correct spectral envelope and decay rate
4. Crossfade from traced IR to synthetic tail

This produces perceptually complete impulse responses without tracing billions of rays.

### 10c. GPU-Accelerated Ray Tracing

Use WebGPU compute shaders for massively parallel ray tracing:

1. Upload BVH and triangle data as storage buffers
2. Launch compute shader with one thread per ray
3. Read back intersection results
4. Process reflections on GPU (embarrassingly parallel)

Expected speedup: 10–100x over CPU for >10K concurrent rays. Requires WebGPU support (Chrome 113+).

### 10d. Binaural Output

Extend ambisonic output to binaural:

1. Compute ambisonic IR (already implemented)
2. Convolve with HRTF (Head-Related Transfer Function) dataset
3. Produce stereo binaural output for headphone listening

Use the SADIE II or HUTUBS HRTF datasets [12].

---

## 12. File Manifest

### Files Modified

| File | Phase | Changes | Status |
|------|-------|---------|--------|
| `src/compute/raytracer/index.ts` | 1a, 1b, 4, 5 | Pass frequency through traceRay; cosine-weighted scattering; temperature property, per-segment air absorption, hardcoded 343.2 fix; source directivity at launch, receiver directivity in IR methods | ✅ PR #46, #50, #63, #72 |
| `src/compute/raytracer/image-source/index.ts` | 1c, 4 | Fix occlusion loop start index; temperature param; pass temperature to airAttenuation | ✅ PR #47, #57, #63 |
| `src/compute/raytracer/scattered-energy.ts` | 1d | Clamp negative cos(theta) | ✅ PR #56 |
| `src/compute/acoustics/reflection-coefficient.ts` | 6a | sin→cos fix with abs() for obtuse angles | ✅ PR #51 |
| `src/compute/beam-trace/index.ts` | 4 | temperature property, c getter, hardcoded 343 fix, pass temperature to airAttenuation | ✅ PR #63 |
| `src/compute/rt/index.ts` | 4 | temperature property, pass temperature to airAttenuation | ✅ PR #63 |
| `src/components/parameter-config/RayTracerTab.tsx` | 4 | Temperature input control | ✅ PR #63 |
| `src/objects/receiver.ts` | 5 | ReceiverPattern enum, directivityPattern property, getGain() method, save/restore | ✅ PR #72 |
| `src/components/parameter-config/ReceiverTab.tsx` | 5 | Directivity pattern dropdown | ✅ PR #72 |
| `src/__mocks__/three.ts` | 5 | Vector3 applyEuler and angleTo for directivity tests | ✅ PR #72 |

### Files Still Pending Modification

| File | Phase | Changes |
|------|-------|---------|
| `src/compute/raytracer/index.ts` | 6–9 | Reflection coefficient corrections, architecture |
| `src/objects/surface.ts` | 3 | Add `scatteringFunction(freq)` |
| `src/components/parameter-config/RayTracerTab.tsx` | 4, 5 | Add temperature, directivity controls |

### Files Created (PR #60 — ART Solver)

| File | Purpose |
|------|---------|
| `src/compute/radiance/art.ts` | ART solver: progressive radiosity with per-band shooting, direct path, ADD/UPDATE_RESULT |
| `src/compute/radiance/brdf.ts` | BRDF class: icosahedron hemisphere binning, absorption/scattering clamping |
| `src/compute/radiance/form-factor.ts` | Shooting/gathering: ray-traced energy transfer, source injection, receiver gathering |
| `src/compute/radiance/patch.ts` | Tessellation: surface → triangle patches, BVH construction |
| `src/compute/radiance/response.ts` | Time-domain energy response buffer |
| `src/compute/radiance/directional-response.ts` | Per-direction response container |
| `src/components/parameter-config/ARTTab.tsx` | ART solver parameter panel |

### Files to Create (Planned)

| File | Phase | Purpose |
|------|-------|---------|
| `src/compute/raytracer/ray-generation.ts` | 8b | Ray sampling and directivity |
| `src/compute/raytracer/ray-tracing.ts` | 8b | Core tracing logic |
| `src/compute/raytracer/impulse-response.ts` | 8b | IR calculation and filtering |
| `src/compute/raytracer/visualization.ts` | 8b | Buffer geometry and shaders |
| `src/compute/raytracer/convergence.ts` | 7 | Convergence monitoring |
| `src/compute/raytracer/types.ts` | 8b | Shared type definitions |
| `src/compute/raytracer/__tests__/ray-tracing.spec.ts` | All | Core tracing tests |
| `src/compute/raytracer/__tests__/scattering.spec.ts` | 3 | Scattering distribution tests |
| `src/compute/raytracer/__tests__/impulse-response.spec.ts` | 2 | IR accuracy tests |

---

## 13. References

1. Pharr, M., Jakob, W., & Humphreys, G. (2023). *Physically Based Rendering: From Theory to Implementation* (4th ed.). MIT Press. — Chapters on Monte Carlo sampling, stratified sampling, hemisphere sampling.

2. Lambert, J. H. (1760). *Photometria sive de mensura et gradibus luminis, colorum et umbrae*. — Lambert's cosine law for diffuse reflection.

3. Vorländer, M. (2008). *Auralization: Fundamentals of Acoustics, Modelling, Simulation, Algorithms and Acoustic Virtual Reality*. Springer. — Chapter 9: Stochastic ray tracing for room acoustics, scattering models.

4. Christensen, C. L., & Rindel, J. H. (2005). "A new scattering method that combines roughness and diffraction effects." *Forum Acusticum, Budapest*. — Frequency-dependent scattering in ODEON.

5. Dalenbäck, B.-I. (1996). "Room acoustic prediction based on a unified treatment of diffuse and specular reflection." *JASA*, 100(2), 899–909. — CATT-Acoustic's scattering model.

6. ISO 17497-1:2004. *Acoustics — Sound-scattering properties of surfaces — Part 1: Measurement of the random-incidence scattering coefficient in a reverberation room*. — Standard measurement method for scattering coefficients.

7. ISO 9613-1:1993. *Acoustics — Attenuation of sound during propagation outdoors — Part 1: Calculation of the absorption of sound by the atmosphere*. — Air absorption formulas.

8. Kuttruff, H. (2009). *Room Acoustics* (5th ed.). Spon Press. — Chapter 2: Reflection coefficients, impedance models, locally-reactive surfaces.

9. Arvo, J., & Kirk, D. (1990). "Particle transport and image synthesis." *SIGGRAPH '90*. — Russian Roulette for unbiased path termination.

10. Krokstad, A., Strom, S., & Sørsdal, S. (1968). "Calculating the acoustical room response by the use of a ray tracing technique." *Journal of Sound and Vibration*, 8(1), 118–125. — Foundational paper on ray tracing for room acoustics.

11. Kouyoumjian, R. G., & Pathak, P. H. (1974). "A uniform geometrical theory of diffraction for an edge in a perfectly conducting surface." *Proceedings of the IEEE*, 62(11), 1448–1461. — UTD diffraction coefficients.

12. Armstrong, C., et al. (2018). "A perceptual spectral difference model for binaural signals." *AES Convention 145*. — SADIE II HRTF database for binaural rendering.

13. Savioja, L., & Svensson, U. P. (2015). "Overview of geometrical room acoustic modeling techniques." *JASA*, 138(2), 605–642. — Comprehensive survey of ray tracing, image source, beam tracing, and radiosity methods for room acoustics.
