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
11. **Concurrency is one OS thread per partition** with `condition_variable`
    handshakes — not portable to the browser as written.

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

**D2 — Compute in a dedicated Web Worker, one worker total.** Not one worker per
partition: `SharedArrayBuffer` needs `Cross-Origin-Opener-Policy` and
`Cross-Origin-Embedder-Policy` response headers, and `vite.config.ts` sets no
`server.headers`, so cross-origin isolation is unavailable. Structured-clone
handoff per partition per step would dominate the step cost. Run the entire time
loop in one worker and post back progress frames (receiver samples + an
optional downsampled slice for display) via transferable `ArrayBuffer`s. Revisit
a pool only if COOP/COEP is added.

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

### Phase 1 — Separable DCT

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
a twiddle rotation, reusing `src/compute/acoustics/fft`; precompute twiddle
tables per axis length in `createDctPlan` so the hot loop allocates nothing.
Apply per axis with strided passes. Normalize so `inverse(forward(x)) === x`
(the reference splits its scaling `2*sqrt(2WH)` / `sqrt(2WH)` across the two
directions; make the round trip exact and unit-test it).

**Tests** (`src/compute/ard/__tests__/dct.spec.ts`): round-trip identity to
`1e-12` for non-square 2D and 3D grids; a single cosine mode transforms to a
single non-zero coefficient at the expected index; forward output matches a
naive `O(N^2)` reference DCT-II for small `N`.

### Phase 2 — Voxelization

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

### Phase 3 — Rectangular Decomposition

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

### Phase 4 — Partitions

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

### Phase 5 — Interfaces and Walls

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

### Phase 6 — Simulation Driver and Worker

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

### Phase 7 — Solver Class

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

### Phase 8 — UI and Wiring

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

### Phase 9 — 3D

Flip `dimensions` to `3` once Phase 4-6 tests pass in 2D: the DCT plan, the
partition solvers, the interface routine and the decomposition were all written
axis-generic, so the remaining work is the voxelizer's z-extent (already
present), a slice-plane visualization instead of a full-field one, and
re-baselining the performance tests. Keep 2D selectable — on a floor-plan slice
it is the only mode that reaches 4 kHz (§5).

---

## 5. Cost Envelope

Worth stating plainly in both the plan and the UI, because it determines what
the solver is for. With `dx = c / (2.6 * fMax)` and `dt = 0.5 * dx / c`:

| Mode | Room | `fMax` | Grid | Steps for 1 s | Rough runtime |
|------|------|--------|------|---------------|---------------|
| 2D slice | 10 x 8 m | 1 kHz | 76 x 61 | 5.2 k | < 1 s |
| 2D slice | 10 x 8 m | 4 kHz | 303 x 242 | 20.8 k | ~1 min |
| 3D | 10 x 8 x 4 m | 500 Hz | 38 x 30 x 15 | 2.6 k | a few seconds |
| 3D | 10 x 8 x 4 m | 1 kHz | 76 x 61 x 30 | 5.2 k | ~1 min |
| 3D | 10 x 8 x 4 m | 2 kHz | 152 x 121 x 61 | 10.4 k | ~15 min |
| 3D | 10 x 8 x 4 m | 4 kHz | 303 x 242 x 121 | 20.8 k | hours |

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
| `src/compute/ard/dct.ts` | Create | Separable DCT-II/III plans over N-D grids |
| `src/compute/ard/voxelize.ts` | Create | Triangle rasterization + flood fill to an air voxel grid |
| `src/compute/ard/decompose.ts` | Create | Greedy rectangular decomposition of the air region |
| `src/compute/ard/partition.ts` | Create | Partition interface and shared bookkeeping |
| `src/compute/ard/dct-partition.ts` | Create | Analytic modal update — the ARD interior solver |
| `src/compute/ard/fdtd-partition.ts` | Create | 6th-order FDTD partition for degenerate regions |
| `src/compute/ard/pml-partition.ts` | Create | Graded PML absorbing layer |
| `src/compute/ard/interface.ts` | Create | 6th-order interface residual forcing |
| `src/compute/ard/wall.ts` | Create | alpha -> PML damping calibration for room boundaries |
| `src/compute/ard/source.ts` | Create | Bandlimited Gaussian pulse, calibration, deconvolution |
| `src/compute/ard/simulation.ts` | Create | Portable time-loop driver |
| `src/compute/ard/ard.worker.ts` | Create | Worker host with progress messaging |
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
flip plus a performance re-baseline.

A reasonable first milestone that proves the whole idea: Phases 1, 4 (DCT
partition only), and 5 (interface only), with `interface.spec.ts` green. If a
split partition cannot be made indistinguishable from an undivided one, nothing
downstream matters.

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
