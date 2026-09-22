# Plan: Adaptive Rectangular Decomposition (ARD) Solver

Port of [`thecodeboss/AcousticSimulator`](https://github.com/thecodeboss/AcousticSimulator)
into CRAM as a new solver kind, `ard`.

> Note on the name: the request referenced `thecodeboss/AcousticsSimulator`. The
> repository is `thecodeboss/AcousticSimulator` (singular "Acoustic"). It is a
> C++/SDL2/FFTW desktop application implementing Raghuvanshi, Narain & Lin's
> Adaptive Rectangular Decomposition, with PML boundaries after Marcus & Imbo.

---

## 1. What the Reference Implementation Actually Does

The whole reference is ~1,700 lines across 21 files in `src/`. Read in full, it
breaks down as:

| File | Lines | Role |
|------|-------|------|
| `Simulation.cpp/h` | 382 | Scene assembly: finds shared boundaries between partitions, wraps unattached borders in PML partitions, runs the global time loop, rasterizes pressure to an SDL pixel buffer, writes the `.irs` output |
| `Partition.cpp/h` | 207 | Abstract partition base: per-partition worker thread, free-border bookkeeping, source forcing, `.rec` file reader |
| `DCTPartition.cpp/h` | 105 | The ARD interior solver: analytic modal update via DCT-II/DCT-III |
| `DCTVolume.cpp/h` | 87 | FFTW `REDFT10`/`REDFT01` plan wrapper plus normalization |
| `PMLPartition.cpp/h` | 212 | Absorbing layer: 6th-order FDTD with PML auxiliary fields `phi_x`, `phi_y` |
| `FDTDPartition.cpp/h` | 95 | Plain 6th-order FDTD partition (available, but unused by `Main.cpp`) |
| `Boundary.cpp/h` | 192 | Interface handling: 6th-order residual forcing across a 3-cell layer on each side of a partition interface |
| `IRSFile.cpp/h` | 281 | Custom `.irs` binary format (header + source table + listener table + per-pair float sample chunks) |
| `SoundSource`, `GaussianSource` | 37 | Source position and a hardcoded Gaussian pulse `exp(-0.5(t-8)^2)/sqrt(2*pi)` |
| `Main.cpp` | 94 | SDL window, loads `assets/test_level.rec`, one hardcoded source, runs 11,025 steps |

### 1.1 The core algorithm

ARD's premise: inside a rectangular, rigid-walled air region the wave equation
has a known analytic eigenbasis (a cosine basis), so the field can be advanced
**exactly** per mode, with no numerical dispersion and with a time step bounded
only by the source bandwidth rather than by a CFL condition. The room is
decomposed into as few rectangles as possible; each is stepped in the DCT
domain; the (physically wrong) rigid walls the decomposition introduces
*between* adjacent rectangles are cancelled by adding a finite-difference
residual forcing term across each interface.

Per partition, per step (`DCTPartition::step`):

```
F~      = DCT2(F)                                    // forcing into modal space
M^{n+1} = 2 M^n cos(w dt) - M^{n-1}
          + (2 F~ / w^2) (1 - cos(w dt))             // exact modal update
P       = iDCT2(M^{n+1})                             // back to pressure
```

with mode angular frequencies (3D form; the reference implements only 2D)

```
w(kx,ky,kz) = c * pi * sqrt( (kx/Lx)^2 + (ky/Ly)^2 + (kz/Lz)^2 )
```

Global loop (`Simulation::main`):

```
for each step:
    for each partition: computeSourceForcingTerms(t); startStep()
    wait for all partitions
    for each boundary: computeForcingTerms()          // interface + wall residuals
    t += dt
    record / render
```

### 1.2 Interface handling

`Boundary::computeForcingTerms` applies the 6th-order residual operator over a
3-cell layer on either side of an interface. Per-row, for offset `j` in
`[-3, 3)`, the seven-point stencil row is selected from:

```
{  0,   0,    0,    0,    0,   -2,   2 }
{  0,   0,    0,   -2,   27,  -27,   2 }
{  0,  -2,   27, -270,  270,  -27,   2 }
{  2, -27,  270, -270,   27,   -2,   0 }
{  2, -27,   27,   -2,    0,    0,   0 }
{  2,  -2,    0,    0,    0,    0,   0 }
```

divided by 180, and the result is applied as `F += absorption * c^2 * residual`.
DCT partitions include their own terms; FDTD/PML partitions set
`includeSelfTerms = false` because their own stencil already covers them.

### 1.3 PML

Free borders get a 40-cell-thick `PMLPartition`. Its update adds damping and
auxiliary-field terms to the 6th-order FDTD stencil:

```
p^{n+1} = 2p - p_old + dt^2 [ c^2(KPx + KPy + F)
                              - (kx+ky)(p - p_old)/dt
                              - kx*ky*p
                              + dphi_x/dx + dphi_y/dy ]
phi_x^{n+1} = phi_x - dt*kx*phi_x + dt*c^2 (ky - kx) du/dx
phi_y^{n+1} = phi_y - dt*ky*phi_y + dt*c^2 (kx - ky) du/dy
```

### 1.4 Units in the reference

Everything is in grid units: `dx = 1`, `c = 1`, `dt = 0.5`. The `.irs` header
records `scale = 65` voxels/metre and `samplingRate = 44100`, which is
self-consistent: `fs = 2c/dx` gives `2 * 343 * 65 = 44,590 ~= 44,100`, i.e. a
Courant number of 0.5. Cells per shortest wavelength is `fs / (2 * f_max)`, so
44.1 kHz resolves 8 kHz at ~2.76 cells/wavelength — adequate for ARD, which is
spectrally exact in the partition interiors.

### 1.5 What the reference cannot do (and we must not inherit)

These are load-bearing gaps, not polish items:

1. **It is 2D, not 3D.** `DCTVolume` is constructed `DCTVolume(w, h)`, the FFTW
   plans are `fftw_plan_r2r_2d`, `depth` is marked `// @TODO` in both
   `DCTVolume.h` and the mode-frequency loop, `readFromRecFile` discards depth,
   and `getPressure(int x, int y)` has no z argument. The README's "3D scene" is
   aspirational.
2. **The decomposition is not computed.** `Partition::readFromRecFile` parses a
   pre-baked `.rec` box list produced offline (the `matlab/` directory). There
   is no voxelizer and no box-fitting code in `src/`.
3. **There are no materials.** `Partition::absorption` is a single scalar that
   defaults to `0.8` and is never assigned from geometry. Octave-band absorption
   does not exist anywhere in the codebase.
4. **The mode indices are off by one.** `DCTPartition`'s constructor loops
   `i = 1..height`, `j = 1..width` and stores at `(i-1)*width + (j-1)`. FFTW's
   `REDFT10` output index `m` corresponds to wavenumber `m*pi/L` starting at
   `m = 0`, so every mode is assigned the frequency of the next mode up, and the
   DC mode (`w = 0`) is given a non-zero `w`. For the lowest modes this is a
   100% frequency error.
5. **There is a hardcoded `0.999` decay per step** in the modal update. At the
   reference's own sample rate that is `20*log10(0.999) * 44600 = -387 dB/s`, an
   imposed T60 of ~0.155 s independent of materials. It is masked only because
   `Simulation::done()` stops after 11,025 samples (0.25 s).
6. **Forcing terms overwrite instead of accumulate.** `setForce` does
   `force[idx] = f`. A cell that is both a source cell and an interface cell, or
   that sits on two interfaces at a partition corner, silently loses one
   contribution.
7. **`DCTPartition` never clears its forcing field.** `FDTDPartition::step` and
   `PMLPartition::step` end with `memset(force, ...)`; `DCTPartition::step` does
   not, and `force.values` is only ever written by `setForce`. A source impulse
   therefore persists as a permanent static force.
8. **The PML profile is hand-tuned magic numbers.** `kx = (20 - i) * kxMin/10`
   with `kxMin = 0.2` inside partitions created 40 cells thick, plus a constant
   `0.05` cross-damping. No graded polynomial profile, no reflection-coefficient
   calibration.
9. **The source is a fixed, uncalibrated pulse** at `t = 8` grid time units with
   no bandwidth control, no level, and no directivity.
10. **Receivers are a hardcoded 20x20 lattice** spanning the scene bounding box.
11. **The forcing-term convention is internally inconsistent, and `c = 1` hides
    it.** `Boundary::computeForcingTerms` sets `force = c²·sip`.
    `DCTPartition::step` then consumes it as `2F̃/ω²·(1 − cos ωΔt)`, which is
    correct, because `ω` already carries `c`. But `FDTDPartition::step` and
    `PMLPartition::step` consume the same field as `c²Δt²·(KP + force)`,
    applying `c²` a second time. The reference sets `speedOfSound = 1.0`, so
    `c² = c⁴ = 1` and the two conventions coincide exactly; at 343 m/s they
    differ by a factor of ~10⁵. Any port that keeps both partition kinds must
    pick one convention — Phase 4 defines `addForce` as taking `F` in
    `∂²p/∂t² = c²∇²p + F` — and test for it at a physical sound speed.
12. **Concurrency is one OS thread per partition** with `condition_variable`
    handshakes — not portable to the browser as written, and not correct as
    written either: `volatile bool finish/quit/wait` is used for cross-thread
    flags where `std::atomic` is required by the C++ memory model, and
    `waitForStepFinish` polls `cv_finish.wait_for(lk, 100ms)` in a loop instead
    of using a real barrier. See §3 D2 and Phase 10 for the browser strategy.

So the port is better framed as: **implement ARD in CRAM, using the reference as
the authoritative structural and numerical guide, while supplying the four
pieces it leaves out** (3D, voxelization + decomposition, materials, calibrated
sources/boundaries).

---

## 2. Current State in CRAM

**Directly reusable:**

- `src/compute/solver.ts` — `Solver` base class: `params`, `kind`, `uuid`,
  `running`, `autoCalculate`, `calculate()`, `save()`/`restore()`, `dispose()`,
  `onModeChange()`.
- `src/compute/solver-registry.ts` — `registerSolverFactory(kind, factory)` with
  dynamic `import()` for code splitting.
- `src/compute/2d-fdtd/slice.ts` — `domainFromBox`, `worldToPlane`, `gridCell`,
  `gridCellIndex`, `applySliceTransform`, `inferSlice`. Y-up-aware world-to-grid
  mapping, already unit-tested. The 2D ARD phase can use this verbatim.
- `src/compute/2d-fdtd/timestep.ts`, `field-encoding.ts`, `recording.ts`,
  `dispose-gpu.ts` — timestep/recording/teardown patterns to mirror.
- `src/compute/acoustics/sound-speed.ts` — `soundSpeed(temperature)`.
- `src/compute/acoustics/air-attenuation.ts` — `airAttenuation(freqs, temp)`,
  `airAbsDbToEnergyNepers`.
- `src/compute/acoustics/bands.ts` — `whole_octave`.
- `src/compute/schroeder.ts` — `schroederBackwardsIntegration(Float32Array)`.
- `src/objects/room.ts` — `allSurfaces`, `calculateBoundingBox()` /
  `boundingBox`, `volume`, `temperature`. Note that `calculateBoundingBox()`
  unions the surfaces' *local-space* geometry bounds, so the voxelizer of Phase 2
  must recompute world-space bounds itself rather than trusting it.
- `src/objects/surface.ts` — `absorption: number[]`,
  `absorptionFunction(freq)`, `scatteringFunction(freq)`, `acousticMaterial`.
- `src/objects/source.ts` — `initialSPL`, `directivityHandler`, `quaternion`.
- `three-mesh-bvh` — already a dependency, wired up in
  `src/compute/raytracer/index.ts` (`computeBoundsTree`, `acceleratedRaycast`).
- **`src/compute/raytracer/gpu/` — a working WebGPU compute path.**
  `gpu-context.ts` provides `isWebGPUAvailable()` / `requestGpuContext()` /
  `releaseGpuContext()` with a cached adapter and device, device-loss recovery,
  and `requiredLimits` negotiation (it already raises
  `maxStorageBuffersPerShaderStage` past the default 8). `ray-trace.wgsl` is a
  real compute shader, `gpu-bvh.ts` shows the buffer-packing conventions,
  `gpu-ray-tracer.ts` shows the correct readback discipline
  (`copyBufferToBuffer` into dedicated `MAP_READ` staging buffers, then
  `mapAsync`), and `RayTracer._initGpu()` shows the graceful
  WebGPU-or-CPU-fallback pattern. Phase 10 reuses all of it.
- `src/compute/radiance/art.ts` — the cleanest end-to-end example of a modern
  CRAM solver: property declaration, `calculate()`, result emission,
  `save`/`restore`, `declare global { interface EventTypes }`, `on(...)` wiring.

**Missing and must be built:**

- A **DCT** of any kind. `src/compute/acoustics/fft` provides `fft()` only;
  `grep -i '\bdct\b' src` returns nothing.
- A **voxelizer**. `grep -i voxel src` returns nothing. `src/compute/volume/` is
  only a vertex/fragment shader pair; `src/compute/csg/` and
  `src/compute/modeling/` are JSCAD wrappers for boolean modelling, not
  rasterization.
- **Rectangular decomposition** (box fitting over a voxel set).
- Any **wave solver with physical material boundaries**. The existing
  `FDTD_2D` treats walls as rasterized perfectly-reflecting line stencils
  (`fdtd-wall.ts`, `wall-stencil.ts`) and carries no absorption at all.
- A **long-running compute host**. `FDTD_2D` runs on the GPU inside the render
  loop; ARD is a CPU transform loop that must not block the UI thread. CRAM has
  worker precedent (`src/audio-engine/filter.worker.ts`,
  `src/import-handlers/dxf.worker.ts`) but no worker pool.

---

## 3. Design Decisions

These are the choices that shape the port. Each departs from the reference for a
stated reason.

**D1 — Dimension-generic core, 2D shipped first.** Write the partition solver
over an `N`-dimensional axis-aligned box with a separable DCT applied per axis,
so 2D is the degenerate `nz = 1` case. Ship and validate 2D first (it can be
checked against both the reference and CRAM's existing `FDTD_2D` on the same
slice), then enable 3D by flipping a parameter. This avoids writing the solver
twice and avoids shipping an unvalidated 3D solver.

**D2 — Compute in a dedicated Web Worker, one worker total.** The worker is
non-negotiable for a reason unrelated to parallelism: the time loop blocks for
seconds to minutes (§5), which on the main thread freezes the editor and stalls
the render loop.

Not one worker *per partition*, though. The reference parallelizes over
partitions with `std::thread` and a per-step fork-join barrier, and the browser
equivalent would want `SharedArrayBuffer` — which requires
`Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` response headers.
Setting those in `vite.config.ts` would be trivial, but **CRAM ships as a
consumable library** (`package.json` `main`/`module`/`exports`,
`files: ["dist", "src/lib"]`, `build:lib` with `src/lib/index.ts` as entry). That
would impose cross-origin isolation on every host application embedding CRAM, and
COEP `require-corp` breaks any cross-origin resource that does not send CORP
headers. That is not CRAM's decision to make for its consumers, so
`SharedArrayBuffer` is out.

Run the entire time loop in one worker and post back progress frames (receiver
samples plus an optional downsampled display slice) via transferable
`ArrayBuffer`s.

A SAB-free parallel variant is possible if it ever becomes necessary: keep each
partition's state resident in its own worker and exchange only the 3-cell halo
layers by `postMessage` per step. The win is bounded by partition count and by
load imbalance — the barrier waits on the largest box, and box sizes vary widely —
against roughly `2 * nPartitions * nSteps` messages (~320k for a 20k-step,
8-partition run). High complexity, modest payoff. Phase 10 (GPU) is the better
use of the same effort.

**D3 — Absorption via calibrated PML damping, one run per octave band.** ARD's
boundary treatment is frequency-independent by construction, and the reference's
`absorption` scalar multiplying an interface residual is not a calibrated alpha.
Instead: map a target normal-incidence pressure reflection coefficient
`|R| = sqrt(1 - alpha)` to a PML damping magnitude through a calibration curve
measured once by a 1D normal-incidence test, then run the whole simulation once
per octave band using that band's `alpha`, band-filter each result, and sum.
Default to a single broadband run at the 500 Hz alpha for interactive use, with
a `perBandRuns` toggle for the accurate path. This is a real limitation of the
method and should be stated in the UI tooltip, not hidden.

**D4 — Calibrated source injection.** Replace the fixed
`exp(-0.5(t-8)^2)/sqrt(2*pi)` with a Gaussian pulse whose `-3 dB` bandwidth is
set from `fMax`, injected as a point force, then **spectrally deconvolved** out
of the recorded signal so the result is a true impulse response rather than a
pulse response. Amplitude is normalized against a free-field reference run so
the direct arrival matches `Source.initialSPL` at 1 m, and directivity is
applied via `source.directivityHandler` as the existing solvers do.

**D5 — Fix the reference's bugs rather than reproduce them.** Specifically:
mode indices start at 0 with an explicit `w = 0` DC branch
(`M^{n+1} = 2M^n - M^{n-1} + F~ dt^2`); no `0.999` factor (decay comes from
boundaries and air attenuation); forcing accumulates with `+=` and is cleared at
the end of every step in *all* partition types; stencil coefficients are divided
by `dx^2` explicitly rather than relying on `dx = 1`; PML uses a graded
`sigma(x) = sigma_max (x/L)^m` profile.

**D6 — Emit `ImpulseResponse` plus `EnergyDecay`.** `ResultKind` already has
both (`src/store/result-store.ts`). No new result kind is needed. The
reference's `.irs` format is not ported; a per-receiver IR plus an optional
pressure-field export covers the same ground in CRAM's existing vocabulary.

---

## 4. Implementation Phases

### Phase 1 — Separable DCT — **implemented**

**Created** `src/compute/ard/fft.ts`, `src/compute/ard/dct.ts`,
`src/compute/ard/__tests__/{fft,dct}.spec.ts`.

Built as specced below, with one addition: the FFT had to be written too. The
three existing FFTs in `compute/acoustics/fft/` are all unusable in a
20k-iteration hot loop — `fft.ts` wraps every element in a `Complex` object,
`_fft.ts` allocates fresh arrays per call, and `index.ts` applies a Hann window
and chunks its input by default. `fft.ts` is therefore a self-contained
allocation-free plan-based complex FFT: radix-2 for power-of-two lengths,
Bluestein's chirp-z for everything else (mandatory, since partition extents are
whatever integers Phase 3 produces).

Verified: round-trip identity to `1e-12`; `forward` matches an independent
direct `REDFT10` and the FFT matches a direct DFT; single cosine modes map to
single coefficients; allocation-free across 2000 transform pairs. The suite was
mutation-checked — injecting the reference's own off-by-one mode index (§1.5
item 4) fails 28 of 32 DCT tests.

**Measured, and it corrects §5:** Bluestein costs **3x in 2D and 5.6x in 3D**
against power-of-two extents at equal cell count (`61x67x31` at 102 ms/step
versus `64x64x32` at 18 ms/step). The penalty compounds with rank because every
axis pays it, and it is the single largest lever on whether ARD is usable at all.
Two follow-ups, in order of value:

1. **Mixed-radix FFT** (radix 2/3/5/7 with a Bluestein fallback for large prime
   factors). This is the real fix and what FFTW does; it would make most integer
   extents cheap rather than only powers of two. Independently testable against
   the suite already written.
2. **Phase 3 should prefer FFT-friendly box extents.** Box dimensions are the
   modal basis, so they cannot simply be rounded — but greedy growth may stop
   short of maximal, so it can be biased toward friendly lengths at the cost of
   more boxes and therefore more interface area. Worth measuring against (1)
   before doing, since (1) may make it unnecessary.

**Original specification follows.**

**Create** `src/compute/ard/dct.ts`

```typescript
/** In-place separable DCT-II / DCT-III over an axis-aligned grid. */
export interface DctPlan {
  dims: number[];                 // [nx, ny] or [nx, ny, nz]
  forward(values: Float64Array, modes: Float64Array): void;   // DCT-II
  inverse(modes: Float64Array, values: Float64Array): void;   // DCT-III
}
export function createDctPlan(dims: number[]): DctPlan;
```

FFTW's `REDFT10` is DCT-II and `REDFT01` is DCT-III. Implement 1D DCT-II of
length `N` by the standard even-odd reordering plus a length-`N` complex FFT and
a twiddle rotation; precompute twiddle tables per axis length in
`createDctPlan` so the hot loop allocates nothing. Apply per axis with strided
passes. Normalize so `inverse(forward(x)) === x` (the reference splits its
scaling `2*sqrt(2WH)` / `sqrt(2WH)` across the two directions; make the round
trip exact and unit-test it).

The complex FFT comes from `./fft` (`createComplexFftPlan`). **The three
transforms under `src/compute/acoustics/fft` are off-limits to the ARD hot
loop** and must not be reached for here or in any later phase: `fft.ts` wraps
every sample in a `Complex` object, `_fft.ts` allocates fresh arrays on every
call, and `index.ts` applies a Hann window and chunks its input by default. An
earlier draft of this paragraph pointed at them; it was wrong.

**Tests** (`src/compute/ard/__tests__/dct.spec.ts`): round-trip identity to
`1e-12` for non-square 2D and 3D grids; a single cosine mode transforms to a
single non-zero coefficient at the expected index; forward output matches a
naive `O(N^2)` reference DCT-II for small `N`.

### Phase 2 — Voxelization — **implemented**

**Created** `src/compute/ard/{voxelize,voxelize-room}.ts` and
`__tests__/{voxelize,voxelize-room}.spec.ts`.

Built as specced, with three changes:

- **No BVH.** The spec called for a `three-mesh-bvh` box-vs-triangle query per
  candidate cell. Scattering each triangle into the cells its own bounding box
  covers is strictly better: work is proportional to the surface area in cells —
  the solid cells actually produced — rather than grid volume times
  `log(triangles)`, and it needs no acceleration structure. The overlap test is
  exact either way (full 13-axis SAT; a conservative AABB test thickens oblique
  walls into a blob, which changes the air volume and with it the modal
  frequencies).
- **Split into a pure core and a `Room` adapter**, mirroring
  `radiance/patch.ts`. `voxelize.ts` has no `three`, no stores and no DOM, so
  the geometry can be tested on plain triangle lists; `voxelize-room.ts` is the
  thin adapter.
- **Leaks are reported, not thrown.** A grid whose fill reaches the padded rim
  carries `leaked: true` and a warning; `decompose` is what refuses it. The
  caller may still want the grid to diagnose which surface is open.

**Original specification follows.**

**Create** `src/compute/ard/voxelize.ts`

```typescript
export const enum Cell { Solid = 0, Air = 1 }

export interface VoxelGrid {
  nx: number; ny: number; nz: number;
  dx: number;                       // metres per cell
  origin: { x: number; y: number; z: number };
  cells: Uint8Array;                // length nx*ny*nz
  /** Per-boundary-cell parent surface index, -1 for interior air. */
  surfaceOf: Int32Array;
}

export function voxelizeRoom(room: Room, dx: number, seed?: Vector3): VoxelGrid;
```

1. Grid the room's world bounding box, padded by one cell, at spacing `dx`.
2. Mark **solid** cells by rasterizing each `room.allSurfaces` triangle
   (world-space, via `surface.localToWorld`) into the grid with a
   triangle-box overlap test, recording the surface index in `surfaceOf` so
   Phase 5 can look up per-band `alpha` from `surface.absorptionFunction`.
3. Flood-fill **air** from a seed — the first source position if it is not
   solid, otherwise the room centroid — using a 6-connected queue. Only the
   connected component reachable from the seed becomes `Air`; this discards
   exterior space and any sealed voids, which is what the decomposition needs.
4. Return the grid. `dx` comes from `dx = c / (cellsPerWavelength * fMax)` with
   `cellsPerWavelength` defaulting to 2.6.

Use `three-mesh-bvh` (already a dependency) for a fast
`Box3`-vs-triangle query per candidate cell rather than iterating all triangles
per cell.

**Tests**: a unit cube of six quads at `dx = 0.1` yields an air component of
`8*8*8` interior cells with a one-cell solid shell; a room with a sealed
interior closet leaves the closet `Solid` when the seed is outside it; a
non-watertight surface set does not leak the fill to the grid edge (assert no
`Air` on the padded rim) and surfaces a warning.

### Phase 3 — Rectangular Decomposition — **implemented**

**Created** `src/compute/ard/decompose.ts` and `__tests__/decompose.spec.ts`.

**This section's axis-ordering claim was wrong.** It asserted that growing the
longest run first "noticeably reduces the box count and therefore the interface
area". Measured against a fixed x→y→z order it **ties on every room-like shape
tried** — corridor, L, cross, T, comb, staircase, pillared room, ball — and on
200 randomized air masks it is *worse*: 172 losses to 17 wins, mean 207.5 boxes
against 202.9. The stronger variant, trying all six orders per seed and keeping
the largest box, also ties everywhere room-like and comes out slightly worse on
random masks (205.2 vs 202.8), because greedily maximizing one box leaves worse
leftovers.

The reason is that the slab rule already extends maximally along each axis in
turn, so for near-rectilinear geometry the result is order-independent. The
option is kept but **defaulted off**, with a test pinning the negative result so
the idea is not rediscovered. Reducing box count — and with it the interface
area where the error lives — needs a different idea: seed selection, or a merge
pass.

Thin boxes are marked `fdtd` rather than merged. A merge pass was the spec's
first suggestion, but the union of two boxes is only a box in special cases, so
it would succeed rarely and silently leave the rest; marking the kind always
works and Phase 4 already implements the partition.

Also added `validateDecomposition`, which checks the cover is a true partition
of the air region. It is cheap next to a simulation and worth running before
Phase 6 spends minutes on a bad cover.

`__tests__/decompose.spec.ts` carries the first **end-to-end test of Phases
2-5**: a shoebox and an L-shaped room go from triangles through the voxelizer
and decomposition into real partitions with real interfaces, and a pulse driven
in one partition reaches another through the seam. That is the sequence Phase 6's
driver will run.

**Original specification follows.**

**Create** `src/compute/ard/decompose.ts`

```typescript
export interface Box { x: number; y: number; z: number; w: number; h: number; d: number; }
export interface Decomposition {
  boxes: Box[];
  /** box index per air cell, -1 for solid. */
  assignment: Int32Array;
  /** Cells of air divided by cells covered — should be 1. */
  coverage: number;
}
export function decompose(grid: VoxelGrid, minBoxEdge?: number): Decomposition;
```

Greedy box growth, as in Raghuvanshi §4: pick the lowest-index unassigned air
cell as a seed, extend maximally along `+x` while every cell is unassigned air,
then extend that run along `+y` while every cell of the candidate slab is
unassigned air, then along `+z` likewise; emit the box, mark its cells assigned,
repeat. Order the axes so the longest run is grown first — for typical rooms this
noticeably reduces the box count and therefore the interface area. Merge boxes
thinner than `minBoxEdge` (default 4 cells, since the interface stencil needs a
3-cell layer per side) into a neighbour, or fall back to marking them as FDTD
partitions (Phase 4 supports both kinds, which is exactly why the reference
keeps `FDTDPartition` around).

**Tests**: a solid rectangular room decomposes to exactly one box; an L-shaped
room to exactly two; `coverage === 1` and `assignment` is a partition (no cell
assigned twice) on a randomized fuzz set of air masks; every emitted box
contains only air cells.

### Phase 4 — Partitions — **implemented**

**Created** `src/compute/ard/{partition,dct-partition,fdtd-partition,pml-partition}.ts`
and `__tests__/{partition,wall}.spec.ts`.

Built as specced, with four things the spec did not anticipate:

- **A single forcing-term convention**, because the reference has two (§1.5
  item 11). `addForce` takes `F` in `∂²p/∂t² = c²∇²p + F`; every partition kind
  applies it identically. There is a test that drives a DCT and an FDTD
  partition with the same forcing at 343 m/s, which fails under the reference's
  convention.
- **Courant 0.5 is unstable for a 3D FDTD partition.** Von Neumann analysis of
  the 6th-order symbol gives `C ≤ 0.813` (1D), `0.575` (2D), `0.470` (3D), so
  the plan's default sits just past the 3D limit. DCT partitions are
  unconditionally stable and unaffected, but `FdtdPartition` now throws rather
  than diverging quietly, and Phase 6 must pick `dt` per partition kind.
- **Axes of extent 1 must be skipped in the stencil.** Zero-padded, a 1-thick
  axis collapses to its centre tap and injects `−490·p` into the Laplacian, so
  a 2D run (`nz = 1`) would solve the wrong equation entirely.
- **`modalEnergy` is not `Σ M²`.** Each mode is an oscillator, so that
  oscillates; the conserved invariant of `x_{n+1} = 2λx_n − x_{n−1}` is
  `x_n² + x_{n−1}² − 2λ x_n x_{n−1}`.

Measured: modal energy drifts < 1e-9 over 10,000 steps; eigenfrequencies match
the analytic shoebox series to 8 decimal places; DCT and FDTD partitions agree
to < 1% relative L2 on both a propagating pulse and a forced response. The suite
is mutation-checked against the reference's own bugs — the `0.999` damping fails
7 of 16 tests, the double-`c²` forcing fails the test written for it, and
removing the 1-thick-axis guard fails 3.

**PML accuracy is below what this section assumed.** The target was `|R| < 1e-3`
at a tuned `σmax`. Measured floors at Courant 0.4, grading 2: `0.138` at 10
cells, `0.030` at 20, `0.010` at 30, `0.005` at 60 — so 1e-3 is not reached at
any tested thickness. That matters for terminating an open domain and would need
a better-matched profile than a graded sponge. It does not matter for room
surfaces (§Phase 5).

**Original specification follows.**

**Create** `src/compute/ard/partition.ts`, `dct-partition.ts`,
`fdtd-partition.ts`, `pml-partition.ts`

```typescript
export interface Partition {
  readonly kind: "dct" | "fdtd" | "pml";
  readonly box: Box;               // in global cell coordinates
  readonly includeSelfTerms: boolean;
  step(dt: number): void;
  pressureAt(x: number, y: number, z: number): number;   // local cell coords
  addForce(x: number, y: number, z: number, f: number): void;  // accumulates
  clearForce(): void;
  readonly pressure: Float64Array; // for display and recording
  dispose(): void;
}
```

`DctPartition` holds `pressure`, `modes`, `prevModes`, `force`, plus
precomputed `cosWdt[]` and `invW2[]` tables and a `DctPlan`. Mode indices run
from 0; index 0 (all-zero wavevector) takes the `w -> 0` branch. Per step:
`forward(force)`, apply the modal update, rotate `prevModes`/`modes`,
`inverse(modes) -> pressure`, `clearForce()`.

`FdtdPartition` and `PmlPartition` port the 6th-order stencil
`{2, -27, 270, -490, 270, -27, 2} / 180` and the PML auxiliary-field update
directly, with two changes: the Laplacian is divided by `dx^2`, and damping uses
a graded `sigma(x) = sigmaMax * (x/L)^2` profile over a `pmlThickness` (default
20 cells) rather than the reference's hand-tuned constants. Both set
`includeSelfTerms = false`, matching the reference's reasoning about double
forcing.

**Tests**: a DCT partition with rigid walls and no forcing conserves modal
energy over 10,000 steps to within `1e-9`; its lowest eigenfrequency matches
`c/(2L)` for a 1D box to within 0.1%; an FDTD partition and a DCT partition
driven identically agree to within 1% over the first 200 steps at
`Courant = 0.5`; a plane wave normally incident on a PML layer reflects with
`|R| < 1e-3` at `sigmaMax` tuned for maximum absorption.

### Phase 5 — Interfaces and Walls — **implemented**

**Created** `src/compute/ard/{interface,wall}.ts` and
`__tests__/interface.spec.ts`.

**The milestone in §8 is met.** A 400-cell domain split in two, driven
identically to an undivided one, agrees to **0.089% relative L2** after a pulse
crosses the seam — against the 2% this section asked for. The same holds in 2D
(cut along Y), in 3D (cut along Z), across three partitions and two seams, and
at every cut position tried. With the interface forcing removed the error is
100%, so the comparison is discriminating rather than vacuous. Error falls with
pulse width (0.22% at 3 cells, 0.042% at 12), as a high-order scheme should.

`interface.ts` does not port the reference's 6×7 coefficient table. It derives
the residual instead — for a cell at depth `d` from the face,
`R(d) = Σ_t STENCIL[3 + d + t]·(across[t] − own[t])` — which is three short dot
products over the three cells each side, and can be checked by eye. A test
cross-checks it against the literal reference table term by term, so the
equivalence is verified rather than asserted.

`wall.ts` departs from the spec below in one way: the calibration table is built
at runtime and memoized, not generated by a script and checked in. A checked-in
table goes stale the moment the stencil, the grading or the Courant number
changes, and cannot cover the `(thickness, grading, Courant)` grid a caller might
ask for. Expressing damping dimensionlessly as `σ̂ = σ·dx/c` makes one cached
curve valid for every grid; the default builds in ~0.9 s, once.

Two findings the spec did not anticipate:

- **`|R|(σ̂)` is not monotonic.** It falls from 1, reaches a floor, then rises
  again as the profile gets steep enough to reflect on its own, and goes
  unstable above `σ̂ ≈ 15`. Only the falling branch is invertible, so
  `calibrationCurve` samples the whole range and keeps that branch. (An earlier
  version broke out of the walk at the first non-improving sample and stopped
  far short of the floor, capping absorption at 0.76 instead of 0.999.)
- **The reachable range is set by thickness, and a 20-cell layer is enough for
  room surfaces** even though it misses the Phase 4 `|R| < 1e-3` target: it
  reaches α ≤ 0.9991, and the α → σ̂ → measured-α round trip is accurate to
  ~0.001 across α ∈ [0.05, 0.95]. `dampingForAbsorption` throws rather than
  clamping when asked for more than the layer can deliver.

Still not covered: **PML corners**, where two slabs overlap and both axes need
damping. `PmlPartition` damps one axis and the Phase 6 driver must avoid
building corners; the reference papers over this case with a hand-tuned constant
cross-term.

**Original specification follows.**

**Create** `src/compute/ard/interface.ts`, `src/compute/ard/wall.ts`

`interface.ts` ports `Boundary::findBoundary` and
`Boundary::computeForcingTerms`: detect shared faces between boxes (zero overlap
on one axis, positive overlap on the others), and apply the 6-row residual
coefficient table from §1.2 over the 3-cell layer each side, scaled by
`c^2 / dx^2`. Generalize the reference's `X_BOUNDARY`/`Y_BOUNDARY` switch into
one axis-parameterized routine so the Z case comes for free.

`wall.ts` supplies what the reference lacks: every partition face not shared
with another partition is a room wall, and gets a PML partition whose damping is
chosen to realize that wall's absorption.

```typescript
/** Normal-incidence pressure reflection magnitude for an absorption coefficient. */
export function reflectionMagnitude(alpha: number): number;   // sqrt(1 - alpha)
/** Invert the measured |R|(sigmaMax) curve. */
export function dampingForReflection(r: number, thickness: number): number;
```

`dampingForReflection` is backed by a calibration table generated by a 1D
normal-incidence experiment (checked in as a small JSON, regenerated by a script
under `scripts/`), with log-linear interpolation between entries. The wall's
`alpha` comes from `surfaceOf` in the voxel grid →
`surface.absorptionFunction(freq)` for the band being run.

**Tests**: two DCT partitions sharing a face, driven on one side, transmit a
pulse across the interface with amplitude error under 2% and no visible
reflection off the seam (compare against a single undivided partition of the
combined size — this is the single most important correctness test in the port);
`reflectionMagnitude(0) === 1` and `reflectionMagnitude(1) === 0`; a wall
configured for `alpha = 0.3` reflects `|R| = sqrt(0.7) ± 0.05` in a 1D test.

### Phase 6 — Simulation Driver and Worker — **implemented**

**Created** `src/compute/ard/{simulation,walls-from-grid,ard.worker}.ts` and
`__tests__/{simulation,walls-from-grid,ard.worker}.spec.ts`.

All three physics checks below pass: the direct arrival lands within one sample
of `round(distance / (c·Δt))` at three distances, its amplitude follows `1/r`,
field energy does not grow once the source stops (and decays with absorbing
walls where it holds flat with rigid ones), and a rigid shoebox's spectrum shows
peaks at the analytic mode frequencies.

Three findings, each of which changes something outside this phase:

**The source must be DC-free, and a plain Gaussian is not.** Injecting an
all-positive forcing pulse pushes net volume into a sealed rigid room, which
drives the DC mode — `ω = 0`, no restoring force — so the mean pressure ramps
linearly and the field energy grows without bound. Measured: a plain Gaussian
grew the energy 27x between steps 120 and 600 with the source long silent, and
buried the modal peaks under the ramp. `bandlimitedPulse` is therefore the
first derivative of a Gaussian, whose integral is exactly zero; it holds at
1.1x. The growth is real physics, just not what an acoustic source does.

**Absorbing walls reimpose a CFL limit on everything, and §5 undercounts their
cost by 3x.** A wall slab is a `PmlPartition` running an explicit update, so it
is CFL-limited where a `DctPartition` is not — and since every partition shares
one `Δt`, the walls set the time step for the whole simulation: about Courant
0.446 on a 3D room rather than this plan's default 0.5. Worse, slabs are not
free in cells. Measured on a 3 x 2.4 x 2 m room at `dx = 0.1`:

| thickness | max α | slab cells |
|-----------|-------|------------|
| 4         | 0.813 | ~1.0x room |
| 8         | 0.958 | ~2.1x room |
| 12        | 0.992 | ~3.1x room |
| 20        | 0.999 | ~5.2x room |

**§5's table counts room cells only, so its rows are optimistic by roughly 3x
once walls are included.** The default thickness is 8 — α up to 0.958, past any
material in the database. Both problems disappear with a locally-reacting
impedance boundary (reference [6]), which costs no cells and has no CFL limit;
that is now the most valuable single change available to this solver.

**Phase 2's default padding makes walls impossible.** A slab grows outward from
a room face into solid cells, and a voxelized room's shell is one cell thick, so
the space has to come from the grid's padding — which defaults to 1. At that
setting every face is dropped and the room comes out perfectly rigid, carrying
no absorption at all. `padCellsForWalls(thickness)` gives the figure, and
`createArdSimulation` **throws** rather than warns when walls were asked for and
every face was dropped for lack of room: the run would otherwise complete and
return a reverberation time set by nothing but the room's volume, which looks
entirely publishable. `WallPlan.droppedForSpace` is what distinguishes that from
the legitimate case of every material being perfectly reflective, which is
`skippedRigid` and only warns.

PML corners are avoided as the Phase 5 contract requires: slabs are clipped to
their own face's extent, so the corner region beyond two faces is simply left
empty and no cell is ever inside two slabs. Partly-shared faces are covered by
running `decompose` on the face's exposed mask, and slabs claim the solid cells
they occupy so two never overlap inside a thin pillar.
`__tests__/walls-from-grid.spec.ts` checks each of those three against the mask
rule directly, including the concave corner of an L-room where two faces want
the same cells and one must lose.

Four smaller corrections, from review:

- **A face whose material absorbs nothing gets no slab.** A PML at `α = 0` is
  acoustically identical to a rigid face while costing its cells and pinning the
  whole simulation to the PML's CFL limit. Skipping it means a fully rigid room
  keeps the requested Courant number, which is the observable difference.
- **The CFL clamp keys off slabs actually placed, not the `walls` flag.** The
  two diverge exactly in the case above.
- **Air attenuation is applied to room partitions only.** A PML slab's damping
  is already calibrated to a target reflection coefficient; scaling its state on
  top of that makes the wall more absorbing than its material, and also scales
  the auxiliary `φ` fields, which are not pressure.
- **`bandlimitedPulse` subtracts the sample mean.** The Gaussian derivative's
  integral is zero over `(−∞, ∞)`, which a finite buffer is not. Measured on a
  buffer truncated 1.3σ past the peak: mean-pressure drift over 600 silent steps
  is 0.24 of the field peak uncorrected and 2e-8 corrected, the latter being the
  float32 buffer's own quantization floor.

**The worker's cancel state is per run, not per module.** The chunked loop
yields with `setTimeout`, so between chunks the worker is idle and dispatches
whatever arrives next. A module-level `cancelled` flag does not survive that: a
second `start` resets it to `false` and two loops then interleave on one flag,
so a `cancel` aimed at the second stops both and both post their own `done`. The
token is created per run and closed over by that run's chunks, a second `start`
is refused while one is live, and a throw inside a chunk — which runs outside
the `start` handler's `try` — is caught and reported rather than leaving the
worker silent and permanently marked busy.

**Original specification follows.**

**Create** `src/compute/ard/simulation.ts`, `src/compute/ard/ard.worker.ts`

`simulation.ts` is the portable, testable core — no DOM, no `three` imports
beyond plain vectors:

```typescript
export interface ArdSimulationConfig {
  grid: VoxelGrid;
  decomposition: Decomposition;
  dx: number; dt: number; c: number;
  sources: { cell: [number, number, number]; signal: Float32Array }[];
  receivers: { cell: [number, number, number] }[];
  steps: number;
  airAbsNepersPerMetre: number;
  /** Emit a display slice every N steps; 0 disables. */
  frameInterval: number;
  sliceAxis?: "x" | "y" | "z";
  sliceIndex?: number;
}

export interface ArdStepResult {
  step: number;
  receiverSamples: Float32Array;   // one per receiver
  slice?: Float32Array;            // optional display frame
}

export function createArdSimulation(config: ArdSimulationConfig): {
  step(): ArdStepResult;
  dispose(): void;
};
```

The loop mirrors `Simulation::main` exactly (source forcing → all partitions
step → all interface/wall forcing → record), minus the threading: partitions are
stepped sequentially in one worker. Air attenuation is applied as a per-step
multiplicative decay `exp(-m * c * dt)` on the modal amplitudes, which is the
cheap stand-in for the reference's absent air absorption and is the correct place
for the decay the `0.999` factor was faking.

`ard.worker.ts` owns a simulation, runs a bounded number of steps per macrotask
so `postMessage` can interleave, and posts `{ type: "progress", step, total,
receiverSamples, slice }` and `{ type: "done", irs }`. Follow the message shape
already used by `src/import-handlers/dxf.worker.ts`.

**Tests**: with sources and receivers in one partition and no walls, the direct
arrival lands at `round(distance / (c * dt))` ± 1 sample and its amplitude
follows `1/r` across three distances (the free-field check
`src/compute/beam-trace/__tests__/geometric-spreading.spec.ts` already
establishes the pattern); total field energy is non-increasing once the source
has stopped; a rigid box's measured mode frequencies match
`(c/2)*sqrt((nx/Lx)^2 + (ny/Ly)^2 + (nz/Lz)^2)` for the first ten modes.

### Phase 7 — Solver Class — **implemented**

**Created** `src/compute/ard/{index,deconvolve,resample,worker-host}.ts`,
`__tests__/{ard-solver,ard-worker-host,deconvolve,resample}.spec.ts`,
`nearestCell` in `voxelize.ts`, and `airAbsDbToPressureNepers` in
`compute/acoustics/air-attenuation.ts`.

The solver runs end to end: room and probes out of the stores, grid from
`fMax`, voxelize, decompose, simulate (in the worker where there is one),
deconvolve the pulse, calibrate the level, resample, emit an
`ImpulseResponse` and an `EnergyDecay` per source–receiver pair.

**The absolute scale is analytic, and the time-domain peak would have got it
wrong.** The forcing convention is `∂²p/∂t² = c²∇²p + F` injected into one
cell, so the continuum free-field transfer function is `Δx³/(4πc²r)`. Measured
against the assembled solver at 0.25, 0.5 and 0.75 `fMax`, over `Δx` 0.05–0.1 m,
Courant 0.3–0.4, `fMax` 600–1200 Hz and `r` 0.3–1.8 m: **every ratio within 2.5%
of 1, no systematic bias.** The *peak* of the recorded waveform does not follow
that constant — it runs 1–5% high, increasing with both Courant number and cells
per wavelength, because it is a band-limited delta sampled at an arbitrary
offset. Calibrating on the peak would have folded a discretization artefact into
the level. The calibration is therefore spectral, and the impulse-response
convention is that **an arrival's sum is its pressure** — the same thing the ray
tracer means when it puts an arrival's pressure in a single sample, except
spread over the band-limited arrival, so the peak is lower than the pressure by
a factor that depends on `fMax`.

**Every ARD run is *up*sampled on the way out, and the result is band-limited
whatever rate it is written at.** `fs_sim = n·fMax/C`, which at the plan's
defaults is 6500 Hz, not 44100. There is nothing above `1.3·fMax` to alias, and
nothing above it in the written result either. Resampling makes the IR playable
and convolvable next to CRAM's other results; it does not make it broadband.
Kaiser-windowed sinc rather than FFT zero-padding, because an impulse response
is not periodic and the FFT method wraps the reverberant tail onto the direct
arrival.

**`perBandRuns` works, and costs what it says.** The octave-band windows sum to
exactly one, so a room with frequency-flat materials gives the same answer
either way — checked end to end to 2% relative. Cost is `sources × bands` runs.

**Source directivity does not port, and D4 was wrong to assume it would.** A ray
carries its own launch direction, so a geometric solver can weight it by
`Q(θ,φ,f)`. A wave solver injects into a single cell, which is a monopole with
no direction to weight. Scaling the whole impulse response by the on-axis gain
toward the receiver would be right for the direct sound and wrong for every
reflection. Sources are omnidirectional and `source.directivityHandler` is
ignored; directivity needs a multipole or an array of driven cells with per-cell
delays, which is its own piece of work.

Three smaller findings:

- **`duration`, not `steps`.** `dt` is not settled until the wall slabs are
  planned and the CFL clamp applied, so a caller computing `steps` from its
  *requested* Courant number asks for the wrong number every time the clamp
  bites — 12% short on a 3D room with walls. `createArdSimulation` now takes
  either, and `planArdTimeStep` is split out so a caller can learn `dt` without
  building partitions (which would mean a PML calibration curve per thickness,
  about a second each). That is also what makes a worker handoff possible: the
  driving pulse has to be in the message, and it has to be sampled at `dt`.
- **Probes snap to cells, and it is worth saying so.** At `fMax` 500 the grid is
  26 cm, so a source or receiver moves up to 13 cm per axis on its way onto the
  grid while its marker stays put in the room view. Measured effect on a 2 m
  free-field path: 6% in level. `ARDRunSummary` therefore reports the cells
  everything landed in.
- **Air attenuation on a pressure field needs `dB/(20/ln10)` nepers, not the
  energy figure.** The existing `airAbsDbToEnergyNepers` is twice as large;
  using it on a wave solver attenuates twice as fast in dB as ISO 9613 says and
  reads as a plausible but short reverberation time.

`estimatedSteps` uses the *clamped* Courant number, not the requested one:
wall slabs are `PmlPartition`s and every partition shares a time step, so on a
3D room the bound is `PML_CFL_MARGIN × vonNeumann(3)` ≈ 0.446. Reporting the
requested number would show a step count 12% low every time walls exist, which
is the default. The cost estimate reaches `O(fMax⁴)` only asymptotically: the wall
slabs' padding is a fixed *cell* count per axis, so on a coarse grid it is most
of the grid. Measured on a 4 × 3 × 2.5 m room at the default 8-cell slabs, 5.2x
for 500 → 1000 Hz and 8.4x for 1000 → 2000 Hz.

Five more from review, each of which is a contract the earlier phases already
hold and this one had to learn:

- **One time step for every band, planned from the union of faces.** Per-band
  planning is a trap: a band whose materials are all rigid builds no PML slabs,
  which lifts the CFL clamp and gives that band a larger `dt` and a shorter
  record than its neighbours — while every band is deconvolved against one pulse
  at one rate. At the default Courant 0.4 the clamp never bites and the bug is
  invisible; at the plan's original 0.5 it is immediate. The union of the faces
  any band would build is the most constrained case, so forcing the resolved
  Courant number on each run leaves every band's own limit untouched.
- **Bands are filtered against `fMax`.** Unfiltered, a 250 Hz run paid for seven
  simulations and the deconvolver zeroed five of them. A band whose lower edge
  (`centre/√2`) is past `fMax` contributes nothing; the highest surviving band's
  window still runs to Nyquist, so dropping the rest loses no energy and the
  windows still sum to one. The single-run reference frequency is clamped the
  same way, so a 250 Hz run no longer reads its `alpha` from the 500 Hz column.
- **Probes relocate off wall cells.** `worldToCell` only rounds and
  bounds-checks, so a receiver flush against a surface lands on the one-cell
  shell and the run died with "inside a wall" only after voxelizing, decomposing
  and planning walls. The flood-fill seed already relocated, which made it worse
  rather than better: a run could clear the first source — which *is* the seed —
  and then die on a receiver that landed the same way. `nearestCell` orders by
  Chebyshev radius then true distance from the probe, deliberately unlike the
  seed's centre-first tie-break: a seed needs any interior cell, a probe stands
  for equipment someone placed.
- **A worker that dies mid-run rejects; one that never started falls back
  once.** Re-running the time loop on the main thread after a mid-run crash is
  the minutes-long freeze the worker exists to avoid, for a run the UI has
  already shown progress for. One worker serves the whole `run()` rather than
  one per band, and `run()` itself refuses to start while one is in flight —
  the same rule `ard.worker.ts` applies to a second `start`.
- **The octave window rides inside the deconvolution.** Applying it afterwards
  was a second forward and inverse FFT over the whole record, per band, per
  receiver. Measured against the claim that the two windows in series
  under-weight the low octaves: at `fMax` 1000 on a 6500 Hz record the
  deconvolver's own window reaches 1.000 by 39 Hz, so 125 Hz is untouched, and
  the Wiener term costs 2.3% there — applied identically on the broadband path,
  so it is not a per-band penalty.

Event wiring (`ADD_ARD`, `REMOVE_ARD`, `ARD_SET_PROPERTY`, `CALCULATE_ARD`,
`ARD_PROGRESS`) is in place. The registry entry, the restore case and the UI are
Phase 8's table, untouched here.

**Original specification follows.**

**Create** `src/compute/ard/index.ts`

Modelled on `src/compute/radiance/art.ts`.

```typescript
export interface ARDProps extends SolverParams {
  roomID?: string;
  sourceIDs?: string[];
  receiverIDs?: string[];
  fMax?: number;                 // Hz, upper frequency limit — default 1000
  cellsPerWavelength?: number;   // default 2.6
  courant?: number;              // dt = courant * dx / c — default 0.5
  irLength?: number;             // seconds — default 1.0
  pmlThickness?: number;         // cells — default 20
  perBandRuns?: boolean;         // one run per octave band — default false
  dimensions?: 2 | 3;            // default 2 until Phase 9
  slice?: FdtdSlice;             // for dimensions === 2
  visualize?: boolean;
}

export class ARD extends Solver {
  // ... properties mirroring ARDProps, plus:
  lastBoxCount: number;
  lastCellCount: number;
  lastRunSeconds: number;
  progress: number;              // 0..1

  async calculate(): Promise<void>;
  save(): ARDSaveObject;
  restore(state: ARDSaveObject): this;
  dispose(): void;               // terminate worker, dispose display mesh
  get room(): Room;
  get temperature(): number;
  get estimatedCellCount(): number;   // for the UI cost warning
  get estimatedSteps(): number;
}
```

`calculate()` sequences: resolve room/sources/receivers → derive `dx`, `dt`,
`steps` → `voxelizeRoom` → `decompose` → build partitions, interfaces and walls
→ start the worker → accumulate receiver samples → on completion, deconvolve the
source pulse, resample to 44.1 kHz, and emit results.

Results per source-receiver pair, following `art.ts`'s existing pattern of
reusing a deterministic `uuid` and choosing `ADD_RESULT` vs `UPDATE_RESULT`:

- `ResultKind.ImpulseResponse`, uuid `${this.uuid}-ard-ir-${srcId}-${rxId}`.
- `ResultKind.EnergyDecay` from `schroederBackwardsIntegration` of the squared
  IR, uuid `${this.uuid}-ard-edc-${srcId}-${rxId}`.

Event wiring, exactly as `art.ts` does it:

```typescript
declare global {
  interface EventTypes {
    ADD_ARD: ARD | undefined;
    REMOVE_ARD: string;
    ARD_SET_PROPERTY: { uuid: string; property: keyof ARD; value: ... };
    CALCULATE_ARD: string;
    ARD_PROGRESS: { uuid: string; progress: number };
  }
}
on("ADD_ARD", addSolver(ARD));
on("REMOVE_ARD", removeSolver);
on("ARD_SET_PROPERTY", setSolverProperty);
on("CALCULATE_ARD", (uuid) => { ... });
```

### Phase 8 — UI and Wiring — **implemented**

**Created** `src/components/parameter-config/ARDTab.tsx`,
`__tests__/ARDTab.spec.tsx` and `src/compute/__tests__/ard-wiring.spec.ts`.
Modified all twelve files in the table below, plus `lib/CRAMEditor.tsx` and
`lib/CRAMCanvas.tsx` (their `Record<SolverType, string>` maps are exhaustive, so
adding `'ard'` to the union makes the compiler demand both) and
`SourceReceiverMatrix.tsx` (its `eventType` union).

**The cost line is measured, not guessed.** The plan asked for "estimated
runtime" without saying where the number comes from; inventing one would be
worse than showing nothing. Throughput of the assembled solver, across four
room sizes:

| room (cells)        | total cells | Mcell-steps/s |
|---------------------|-------------|---------------|
| 16 x 14 x 12        | 12 032      | 1.31          |
| 24 x 20 x 16        | 26 624      | 1.39          |
| 32 x 24 x 20        | 45 568      | 1.33          |
| 32 x 32 x 16        | 49 152      | 1.61          |
| 24 x 20 x 16, rigid | 7 680       | 1.90          |

Flat to within ~5% once absorbing walls exist, which is the default. The two
outliers are Phase 1 and Phase 5 findings seen from the other side:
power-of-two extents take the radix-2 FFT path and run 20% faster, and a rigid
room has no PML slabs — the most expensive partition kind — at all.
`ARD_CELL_STEPS_PER_SECOND` takes the conservative end.

**Estimated cells had to be counted in cells, not metres.** The obvious form —
bounding volume over `Δx³` plus surface area over `Δx²` times the slab
thickness — is exact on a hand-built grid and wrong on a real one, because the
voxelized air region is one cell smaller than the bounding box on every side.
At a coarse grid that is most of the room: on a 3.2 x 2.6 x 2.2 m room at
`fMax` 250 (`Δx` 53 cm) the air region is 5 x 4 x 3 cells and the metric form
over-counted the whole simulation by 64%. Counting interior extents in cells
gets both terms exactly right there — 60 air cells and 94 face cells, against
60 and 94 actual.

The grid *allocation* and the cells actually *stepped* are therefore separate
getters. They differ by more than a factor of two, because most of the
allocated grid is padding for the slabs to grow into, and only the second one
predicts runtime.

**`SHOW_PROGRESS` / `UPDATE_PROGRESS` / `HIDE_PROGRESS`,** as the ray tracer
drives them, in addition to `ARD_PROGRESS`. A run of this length with no
indicator reads as a hang. `HIDE_PROGRESS` fires from a `finally`, so a failed
or cancelled run does not leave the bar on screen.

**Two departures from the table above.** The property is `wallThickness`, not
`pmlThickness` — Phase 6 named it for what it is rather than for the partition
kind that implements it. And there is no `visualize` checkbox: nothing consumes
the slice frames the driver can emit, so the toggle would have been a control
that does nothing. Both wait for a phase that gives them something to do.

Three more from review, all of them the same shape — a number or a state that
is right in one place and wrong in another:

- **The cost line undercounted by the number of sources.** `execute` runs
  `sources × bands` times, because a single simulation carrying several sources
  leaves every receiver recording their sum. `estimatedSteps` counted only the
  bands, so two sources read half the real cost — exactly the silent undercount
  the line exists to prevent. Split into `estimatedStepsPerRun` and
  `estimatedRuns`, and the tab now spells out every multiplier
  (`2,600 x 2 sources x 4 bands`) rather than folding them into one number that
  cannot be acted on. Receivers stay free: they are probes into a field that is
  being computed anyway.
- **A cancelled or failed run left `ARD_PROGRESS` mid-flight.** Nothing else
  moves it afterwards, so anything keyed on "0 < progress < 1 means running"
  latched on for good. The solver card is the sharp case, and a closed loop: it
  disables its Calculate button while calculating, so the stuck state could not
  be cleared by starting the run that would have cleared it. `run()` now resets
  to 0 from its `finally` — zero, not one, because the run did not finish.
- **The card would start a run the solver refuses.** Its `canCalculate` checked
  only sources and receivers, while the parameter tab also checked the room. Two
  entry points, two answers to whether the same solver can run, and the card's
  answer produced a flash of progress bar and a throw.

**The wiring checklist is a test.** Adding a solver kind means touching a dozen
unrelated files, and missing one fails silently and specifically — no icon, or
present in the Add menu but not the properties panel, or the quiet one: saves
fine and comes back as nothing, with nothing anywhere reporting a problem.
`ard-wiring.spec.ts` asserts each entry exists, following the source-text
precedent in `temperature-air-absorption.spec.ts`; importing the modules would
drag in MUI and a React tree to ask whether a map has a key, and several of the
maps are module-local consts that are not exported at all.

**Original specification follows.**

**Create** `src/components/parameter-config/ARDTab.tsx`, modelled on
`ARTTab.tsx`: `SolverControlBar`, a room `PropertyRowSelect`,
`SourceReceiverMatrix` with `eventType="ARD_SET_PROPERTY"`, then
`PropertyNumberInput`s for `fMax`, `cellsPerWavelength`, `courant`, `irLength`,
`pmlThickness`, and `PropertyCheckboxInput`s for `perBandRuns` and `visualize`.
Add a read-only cost line — grid size, box count, step count, estimated runtime
— above the run button, since ARD's cost is the property users most need to see
before pressing play (§5).

**Modify** — the full wiring checklist, derived from every file that currently
references `"art"` or `"beam-trace"`:

| File | Change |
|------|--------|
| `src/compute/solver-registry.ts` | `registerSolverFactory("ard", async (_cram, props) => { const { ARD } = await import("./ard"); return new ARD(props); })` |
| `src/compute/events.ts` | Add `ARDSaveObject` to the `RESTORE_SOLVERS` union, an `"ard"` case in `restoreSolver`, and an `"ard"` case emitting `ADD_ARD` in the restore switch |
| `src/lib/types.ts` | Add `'ard'` to the solver-kind union |
| `src/lib/registerHandlers.ts` | `msg.addMessageHandler("SHOULD_ADD_ARD", ...)` following the `SHOULD_ADD_ART` block |
| `src/components/NavBarComponent.tsx` | `<MenuItemWithEmitter label="Adaptive Rectangular Decomposition" event="ADD_ARD" />` next to the ART entry |
| `src/components/workbench/panels/SolversPanel.tsx` | `SolverTabMap['ard'] = ARDTab`; `solverDescriptions['ard'] = 'Wave-based adaptive rectangular decomposition'` |
| `src/components/parameter-config/ParameterConfig.tsx` | `["ard", ARDTab]` |
| `src/components/properties-panel/PropertiesPanel.tsx` | `"ard": ARDTab` in the tab map and the description map |
| `src/components/solver-cards/SolverCard.tsx` | `["ard", ARDTab]`; add `"ard"` to `supportsCalculate` |
| `src/components/solver-cards/SolverCardHeader.tsx` | Icon entry — `WavesIcon` reads as wave-based and is not yet taken (`GraphicEqIcon` is already Energy Decay) |
| `src/components/parameter-config/SolverComponents.tsx` | Add `ARD` to the `SetPropertyEventTypes` union and to every `T extends ...` constraint |
| `src/compute/auto-calculate.ts` | **Do not** add `"ard"` to `CALCULATABLE_SOLVER_KINDS`. A 300 ms-debounced auto-run of a multi-second wave solve would make the editor unusable. Revisit only behind an explicit opt-in |

### Phase 9 — 3D — **implemented, inverted**

**Created** `src/compute/ard/grid-slice.ts`, `__tests__/grid-slice.spec.ts`,
`freeFieldGain2D` and `calibration2D` in `deconvolve.ts`, and the
`dimensions` / `slice` / `sliceCoordinate` properties with their UI.

**This phase turned out to be the other way round.** D1 said to ship 2D first
and flip a parameter for 3D; what happened instead is that Phases 4–8 were
written, validated and shipped in 3D throughout — the tests have been driving
3D rooms since Phase 4, and there was never a `dimensions` parameter to flip.
So the work here was not adding 3D. It was **adding 2D**, which is the phase's
own closing sentence and the half that did not exist.

The axis-generic claim held completely. A grid with one axis of extent 1 runs
end to end through the existing machinery with nothing changed: one DCT box,
four PML walls, rank 2, stable, correct arrival times. `decompose` already
carried the case explicitly — *"a 1-thick axis is a legitimate 2D run, not a
thin box"* — as do `FdtdPartition`, `PmlPartition` and `planWalls`. Both
orientations work identically.

**The orientation that matters is not the one the name suggests.** CRAM rooms
are Y-up, so the floor plan is the world **XZ** plane and the axis that
collapses is world **Y** — grid axis 1, not the 2 that "the third axis"
implies. `compute/2d-fdtd/slice.ts` had already had to settle this and its
`xy`/`xz` naming is reused.

**A 2D run is a different room, and the level calibration is where that stops
being a caveat and becomes arithmetic.** The source is a line, not a point, so
the Green's function is a Hankel function:

```
|P/F| = (Δx² / 4πc²) · sqrt(c / (f·r))
```

Measured against the assembled solver at 0.25, 0.5 and 0.75 `fMax` over
`r` 0.4–1.2 m: **every ratio within 1.6% of 1**. Over the same nine points the
3D expression is wrong by factors of **8 to 23** — and the spread across them
is itself a factor of three, so it is not off by a gain, it is off by a
function and no scale factor rescues it.

Two consequences, neither of them cosmetic:

- 2D free field falls as `1/√r`, not `1/r` — 3 dB per doubling, not 6.
- It is **not flat in frequency**. Phase 7's whole convention, *an arrival's sum
  is its pressure*, does not hold: a 2D impulse response carries a −3 dB/octave
  tilt that is spreading, not the room. `calibration2D` takes it back out, and
  it is necessarily a spectral weight rather than a scalar — there is no 2D
  counterpart to `calibrationScale` returning a number.

So a 2D result is labelled `IR [2D xz]` in the results panel, and the run
pushes a warning saying in words what it is: the response of a room uniform and
unbounded along the collapsed axis, with no modes across it at all. Useful for
wavefronts and early reflections in plan. Not for a reverberation time.

**The plane is a slice of the room's own 3D voxelization**, not an independent
2D rasterization. That costs the whole volume grid — 948 ms and 12M cells for a
10 × 4 × 8 m room at 4 kHz, against a simulation that touches 85 000 cells —
and buys two things worth more than the second: the validated triangle/box
overlap and flood fill are reused rather than reimplemented, and the 2D air
region *is* the region a 3D run would have used at that height, so the two
modes cannot disagree about where the room is at a doorway or a balcony edge.

The default cut goes through the first source, which is inside the room by
construction because it seeded the fill. Clamping a requested height into the
grid is not enough on its own — the outermost layers are the padding the wall
slabs grow into, so a height above the ceiling clamps to solid; the fallback is
the widest layer, named in a warning.

Cost estimation follows: collapsing an axis removes a whole cross-section
rather than a third of the cells (measured >10x on an 8 × 4 × 6 m room), and
the two faces normal to the collapsed axis lose their slabs entirely, because
there is no outside along a 1-thick axis to absorb into.

**Still outstanding from this phase: the slice-plane visualization.** The driver
has emitted display frames since Phase 6 (`frameInterval`, `sliceAxis`,
`sliceIndex`) and nothing consumes them. Making them visible is a renderer
change on the scale of `compute/2d-fdtd/index.ts` — a `DataTexture` and a mesh
in `renderer.fdtdItems`, plus plumbing the frames back through the worker
protocol, which currently discards them. It is the other half of the
`visualize` toggle deferred in Phase 8, and it is a piece of work rather than a
loose end.

**Re-baselining the performance tests** was done in Phase 8, where the cost line
needed a measured throughput figure.

**Original specification follows.**

Flip `dimensions` to `3` once Phase 4-6 tests pass in 2D: the DCT plan, the
partition solvers, the interface routine and the decomposition were all written
axis-generic, so the remaining work is the voxelizer's z-extent (already
present), a slice-plane visualization instead of a full-field one, and
re-baselining the performance tests. Keep 2D selectable — on a floor-plan slice
it is the only mode that reaches 4 kHz (§5).

### Phase 10 — WebGPU (optional, and the only real answer to §5)

The CPU worker of Phase 6 is what makes ARD *correct*; it is not what makes it
*fast*. The cost table in §5 is a CPU table, and the way past it is the GPU —
which is how ARD is deployed in the literature ([3], [4]).

This is not new infrastructure for CRAM: `src/compute/raytracer/gpu/` is already
a working WebGPU compute path (§2). An `ard.wgsl` calls the existing
`requestGpuContext()` and inherits device caching, loss recovery, limit
negotiation and the staging-buffer readback pattern. Keep the
`isWebGPUAvailable()` → CPU fallback shape that `RayTracer._initGpu()` uses.

**What ports cleanly:**
- The modal update is embarrassingly parallel: elementwise over modes, with
  `cos(w*dt)` and `1/w^2` precomputed per mode into storage buffers, and no
  communication between invocations. One invocation per mode.
- The 6th-order FDTD and PML updates are textbook stencil kernels.
- Interface forcing is a gather over a thin 3-cell layer, parallel over
  interface cells.

**What is actually hard:**
- **The DCT is the bulk of the work.** There is no WebGPU FFT or DCT in the
  dependency tree, so Phase 1's plan must be rewritten as separable 1D passes
  per axis, ping-ponging between storage buffers. The non-contiguous axes are
  bandwidth-bound without an explicit transpose pass.
- **WGSL has no `f64`.** The reference is `double` throughout, and the modal
  recurrence `M_new = 2*M*cos(w*dt) - M_prev + ...` is a marginally-stable
  second-order recurrence run for 10k-20k steps. f32 drift over that horizon is
  an open question, not a rounding footnote. **Settle it before committing to
  this phase:** run the Phase 6 CPU simulation in f32 and in f64 over a full
  duration and compare the resulting IRs. The CPU path is the control for that
  experiment, which is one more reason it is not throwaway.
- **Partitions have very different sizes**, so either pad to a common size
  (wasted lanes) or issue many small dispatches (launch-overhead bound). Mehra
  et al. [4] batch partitions of similar size; do the same.
- **Never read back per step.** Accumulate receiver samples into a GPU buffer and
  map once at the end; read the display slice only every Nth step.

**Not WebGL2.** `GPUComputationRenderer` — what `FDTD_2D` uses — has no compute
shaders, so the DCT would become a multi-pass render-to-texture contortion.
WebGPU compute with storage buffers is the right fit and is already in the repo.

---

## 5. Cost Envelope

Worth stating plainly in both the plan and the UI, because it determines what
the solver is for. With `dx = c / (2.6 * fMax)` and `dt = 0.5 * dx / c`:

| Mode | Room | `fMax` | Grid | Steps for 1 s | ms/step | 1 s of IR |
|------|------|--------|------|---------------|---------|-----------|
| 2D slice | 10 x 8 m | 1 kHz | 76 x 61 | 5.2 k | 2.6 | 13 s |
| 2D slice | 10 x 8 m | 4 kHz | 303 x 242 | 20.8 k | 47 | 16 min |
| 3D | 10 x 8 x 4 m | 500 Hz | 38 x 30 x 15 | 2.6 k | 12 | 30 s |
| 3D | 10 x 8 x 4 m | 1 kHz | 76 x 61 x 30 | 5.2 k | 103 | 9 min |
| 3D | 10 x 8 x 4 m | 2 kHz | 152 x 121 x 61 | 10.4 k | 928 | 2.7 h |
| 3D | 10 x 8 x 4 m | 4 kHz | 303 x 242 x 121 | 20.8 k | — | days |

The `ms/step` column is **measured** from the Phase 1 DCT on one partition per
room (a shoebox decomposes to a single box, which is ARD's best case). It is a
**lower bound on the real step cost**: interface forcing, PML layers, source
injection and recording all add on top, and a room that decomposes into many
boxes pays more.

**Phase 6 quantified the largest of those.** Absorbing wall slabs at the default
8-cell thickness add about twice the room's cell count, so a simulation with
walls is roughly **3x** the figures below. Multiply every row accordingly until
a boundary condition that does not cost cells replaces the PML (Phase 6 notes).

An earlier revision of this table carried estimates that were optimistic by
roughly 10x. They were replaced once Phase 1 could be benchmarked. Phase 1 also
identified the reason the numbers are as bad as they are — Bluestein transforms
for non-power-of-two extents — and the two follow-ups that would recover most of
it; with power-of-two extents the 3D 1 kHz row drops from 9 min to about 1.7 min.
Treat every row here as "current", not "intrinsic".

These are **single-threaded CPU** figures, which is what Phases 1-8 deliver.
Phase 10 (WebGPU) is the way past them; per-partition threading is not, for the
reasons in §3 D2.

So ARD's place in CRAM is the **low-frequency band**, where the geometrical
solvers are least valid (below the Schroeder frequency) — not as a replacement
for the ray tracer. The natural follow-on, out of scope here, is a hybrid result
that crosses ARD's low band over to `RayTracer` or `BeamTraceSolver` above the
Schroeder frequency. Default `fMax` to 1000 Hz and put the estimate in front of
the user before they press run.

---

## 6. Testing Plan

Following `TESTING_STRATEGY.md` and the existing per-solver `__tests__`
convention, all under `src/compute/ard/__tests__/` and run by `vitest`:

| Spec | Asserts |
|------|---------|
| `dct.spec.ts` | Round-trip identity; single-mode transform; agreement with a naive DCT-II |
| `voxelize.spec.ts` | Shell and interior counts for a unit cube; sealed voids excluded; no rim leakage for watertight input |
| `decompose.spec.ts` | One box for a box room, two for an L; full coverage and disjointness under fuzzing |
| `partition.spec.ts` | Modal energy conservation; analytic eigenfrequencies; DCT-vs-FDTD agreement |
| `interface.spec.ts` | Split partition matches an undivided one across a seam (the key test) |
| `wall.spec.ts` | Calibrated `\|R\|` matches `sqrt(1 - alpha)`; PML reflection floor |
| `physics.spec.ts` | Free-field `1/r` decay; arrival-time accuracy; energy non-increase after the source stops |
| `simulation.spec.ts` | Deterministic output for a fixed seed; `dispose()` releases buffers and terminates the worker |
| `rt60-cross-check.spec.ts` | A shoebox with uniform `alpha` gives a Schroeder T60 within 15% of Sabine — the end-to-end sanity check that ties ARD back to `src/compute/rt` |

A `dispose.spec.ts` in the style of `src/compute/beam-trace/__tests__/dispose.spec.ts`
should confirm no leaked worker or retained `Float64Array`s after solver removal.

---

## 7. File Manifest

| File | Action | Purpose |
|------|--------|---------|
| `src/compute/ard/fft.ts` | **Done** | Allocation-free complex FFT plans (radix-2 + Bluestein) |
| `src/compute/ard/dct.ts` | **Done** | Separable DCT-II/III plans over N-D grids |
| `src/compute/ard/voxelize.ts` | **Done** | Triangle rasterization + flood fill to an air voxel grid |
| `src/compute/ard/voxelize-room.ts` | **Done** | `Room` adapter onto the three-free voxelizer core |
| `src/compute/ard/decompose.ts` | **Done** | Greedy rectangular decomposition of the air region |
| `src/compute/ard/partition.ts` | **Done** | Partition interface and shared bookkeeping |
| `src/compute/ard/dct-partition.ts` | **Done** | Analytic modal update — the ARD interior solver |
| `src/compute/ard/fdtd-partition.ts` | **Done** | 6th-order FDTD partition for degenerate regions |
| `src/compute/ard/pml-partition.ts` | **Done** | Graded PML absorbing layer |
| `src/compute/ard/interface.ts` | **Done** | 6th-order interface residual forcing |
| `src/compute/ard/wall.ts` | **Done** | alpha -> PML damping calibration for room boundaries |
| `src/compute/ard/source.ts` | Create | Bandlimited Gaussian pulse, calibration, deconvolution |
| `src/compute/ard/simulation.ts` | **Done** | Portable time-loop driver |
| `src/compute/ard/walls-from-grid.ts` | **Done** | Wall slab placement: corner avoidance, overlap claims |
| `src/compute/ard/ard.worker.ts` | **Done** | Worker host with progress messaging |
| `src/compute/ard/gpu/ard.wgsl` | Create (Phase 10) | Modal update, stencil and DCT compute kernels |
| `src/compute/ard/gpu/gpu-ard.ts` | Create (Phase 10) | Buffer packing and dispatch, reusing `raytracer/gpu/gpu-context.ts` |
| `src/compute/ard/visualization.ts` | Create | Pressure-field display mesh / slice plane |
| `src/compute/ard/index.ts` | Create | `ARD extends Solver`, event wiring, result emission |
| `src/compute/ard/__tests__/*.spec.ts` | Create | Suite from §6 |
| `src/components/parameter-config/ARDTab.tsx` | Create | Parameter UI |
| `src/compute/solver-registry.ts` | Modify | Register the `"ard"` factory |
| `src/compute/events.ts` | Modify | Save-object union, restore case, restore emit |
| `src/lib/types.ts` | Modify | Add `'ard'` to the solver-kind union |
| `src/lib/registerHandlers.ts` | Modify | `SHOULD_ADD_ARD` handler |
| `src/components/NavBarComponent.tsx` | Modify | Add-solver menu entry |
| `src/components/workbench/panels/SolversPanel.tsx` | Modify | Tab map + description |
| `src/components/parameter-config/ParameterConfig.tsx` | Modify | Tab map |
| `src/components/properties-panel/PropertiesPanel.tsx` | Modify | Tab map + description |
| `src/components/solver-cards/SolverCard.tsx` | Modify | Tab map, `supportsCalculate` |
| `src/components/solver-cards/SolverCardHeader.tsx` | Modify | Solver icon |
| `src/components/parameter-config/SolverComponents.tsx` | Modify | Property-event type unions |
| `docs/solvers.md` | Modify | Document the solver, its frequency envelope and its limits |
| `scripts/generate-pml-calibration.mjs` | Create | Regenerates the alpha -> damping table |

---

## 8. Suggested Order of Work

Phases 1-3 are independent of CRAM's UI and fully unit-testable in isolation;
they are also where the reference gives the least help (Phase 2 and 3 do not
exist in it at all). Phases 4-6 are the port proper. Phase 7-8 is wiring, and is
mechanical once §4 Phase 8's table is worked through. Phase 9 is a parameter
flip plus a performance re-baseline. Phase 10 is optional and gated on the f32
precision experiment described there — run that experiment early, since a
negative result means the CPU path is the only path and §5's envelope is the
permanent one.

A reasonable first milestone that proves the whole idea: Phases 1, 4 (DCT
partition only), and 5 (interface only), with `interface.spec.ts` green. If a
split partition cannot be made indistinguishable from an undivided one, nothing
downstream matters.

**That milestone is met** (0.089% relative L2, against a 2% target; see Phase 5),
and Phases 2 and 3 — the geometry pipeline, which has no counterpart in the
reference at all — are now built and tested end to end into Phase 4/5
partitions.

What remains is therefore Phase 6 onward: the driver, the solver class and the
wiring, plus §5's cost envelope, which is the open question the numerics cannot
answer.

---

## 9. References

### Primary Sources

[1] **Raghuvanshi, N., Narain, R., & Lin, M. C.** (2009). "Efficient and
Accurate Sound Propagation Using Adaptive Rectangular Decomposition." *IEEE
Transactions on Visualization and Computer Graphics*, 15(5), 789-801.
- The method being ported. Introduces the rectangular decomposition, the
  analytic per-partition modal update, and the 6th-order interface handling.
  Sections 4 (decomposition), 5 (interface and boundary treatment) and 6
  (performance) map directly onto Phases 3, 5 and 5 of this plan.
- https://ieeexplore.ieee.org/document/4815251

[2] **Marcus, G. S. & Imbo** (2010). "Efficient PML for the wave equation."
*arXiv:1001.0319*.
- The PML formulation the reference follows for its absorbing layers, with the
  auxiliary fields `phi_x`, `phi_y`. The reference README notes it had to
  re-derive the discretization for stability; expect the same and validate
  against the reflection tests in §6 rather than against the paper's equations.
- https://arxiv.org/abs/1001.0319

[3] **Raghuvanshi, N., Lloyd, B., Govindaraju, N., & Lin, M. C.** (2007).
"Efficient Numerical Acoustic Simulation on Graphics Processors Using Adaptive
Rectangular Decomposition." *EAA Symposium on Auralization*.
- Earlier GPU-targeted formulation. Relevant if the CPU worker of Phase 6 proves
  too slow and the transforms move to WebGL/WebGPU, which would put ARD on the
  same footing as the existing `FDTD_2D` GPU solver.

[4] **Mehra, R., Raghuvanshi, N., Savioja, L., Lin, M. C., & Manocha, D.**
(2012). "An efficient GPU-based time domain solver for the acoustic wave
equation." *Applied Acoustics*, 73(2), 83-94.
- ARD on the GPU with measured accuracy against analytic solutions; its error
  metrics are a good template for the validation suite in §6.

[5] **Savioja, L. & Svensson, U. P.** (2015). "Overview of geometrical room
acoustic modeling techniques." *Journal of the Acoustical Society of America*,
138(2), 708-730.
- Situates wave-based methods against the geometrical ones CRAM already has, and
  is the reference for the Schroeder-frequency crossover argued for in §5.
- https://doi.org/10.1121/1.4926438

[6] **Bilbao, S.** (2013). "Modeling of Complex Geometries and Boundary
Conditions in Finite Difference/Finite Volume Time Domain Room Acoustics
Simulation." *IEEE Transactions on Audio, Speech, and Language Processing*,
21(7), 1524-1533.
- Boundary-condition treatment for grid-based room acoustics; the basis for the
  `alpha` -> impedance -> reflection-coefficient mapping of §3 D3, which the
  reference implementation lacks entirely.

### Implementation References

[7] **thecodeboss/AcousticSimulator.**
- The port's source. `src/DCTPartition.cpp` for the modal update,
  `src/Boundary.cpp` for the interface coefficient table, `src/PMLPartition.cpp`
  for the PML update, `src/Simulation.cpp` for scene assembly and the global
  loop, `file_format.txt` for the `.irs` output format (not ported — see §3 D6).
  Read §1.5 before copying anything.
- https://github.com/thecodeboss/AcousticSimulator

[8] **CRAM `FDTD_2D`** — `src/compute/2d-fdtd/`.
- The existing grid solver. `slice.ts` is reused directly for the 2D world-to-grid
  mapping; `timestep.ts`, `recording.ts` and `dispose-gpu.ts` are the patterns to
  mirror for stability bookkeeping, sample-rate handling and teardown.

[9] **CRAM `ART`** — `src/compute/radiance/art.ts` and `docs/art-solver-plan.md`.
- The template for a new solver's shape: property declaration, `calculate()`,
  deterministic result uuids with `ADD_RESULT`/`UPDATE_RESULT`, `save`/`restore`,
  and the `declare global { interface EventTypes }` + `on(...)` wiring block.

[10] **FFTW real-to-real transform documentation.**
- Defines `REDFT10` (DCT-II) and `REDFT01` (DCT-III) and their normalization, which
  Phase 1 must reproduce for the reference's numbers to carry over.
- https://www.fftw.org/fftw3_doc/1d-Real_002deven-DFTs-_0028DCTs_0029.html
