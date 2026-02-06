# Plan: Complete the Acoustic Radiance Transfer (ART) Solver

## 1. Current State

The ART solver exists as a skeleton with supporting data structures but no computation engine.

**What exists:**
- `src/compute/radiance/art.ts` — Solver subclass with lifecycle (create/save/restore/delete), event wiring, and a `tessellate()` method that subdivides surface geometry
- `src/compute/radiance/response.ts` — Time-domain energy buffer with `delayMultiplyAdd(source, delay, multiplier)` for accumulating delayed, scaled copies of a source response
- `src/compute/radiance/directional-response.ts` — Array of `Response` objects indexed by BRDF direction, with `delayMultiplyAdd` that fans a source response into all directions scaled by per-direction coefficients
- `src/compute/radiance/brdf.ts` — Hemisphere discretization using an icosahedron, extracts upper-hemisphere sample points (but does not store coefficients or provide lookup)
- `src/compute/radiance/TessellateModifier.ts` — Iterative edge-splitting subdivision that breaks triangles until no edge exceeds `maxEdgeLength`
- `src/compute/raytracer/ga/GA_ART.js` — Savioja's 2D reference implementation of progressive ART shooting with `createARTresponses`, `nextARTshoot`, `createNextARTraysAndReflect`, and `registerARTenergies`
- `src/components/parameter-config/ARTTab.tsx` — Empty placeholder UI with a single collapsed "Room Settings" folder

**What is missing:**
- Patch data structure mapping tessellated triangles back to parent surfaces and their acoustic properties
- Form factor computation (visibility + geometric coupling between patches)
- BRDF coefficient storage and incident/outgoing angle lookup
- The progressive shooting loop (select highest-energy patch, propagate, iterate)
- Source emission injection
- Receiver gathering (collect patch responses visible to receiver)
- Air absorption during propagation
- Frequency-band resolution
- Result emission (impulse responses / energy decay curves)
- Parameter configuration UI (patch size, iteration count, convergence threshold, frequency bands)
- Registration in auto-calculate

---

## 2. Algorithm Overview

Acoustic Radiance Transfer solves the Room Acoustic Rendering Equation (RARE) via progressive radiosity with directional energy tracking. The algorithm discretizes room surfaces into small patches, then iteratively "shoots" energy from the patch with the most unshot energy to all other visible patches, applying the BRDF at each reflection. Each patch stores a time-dependent directional energy response, so the result captures both the temporal structure (for impulse responses) and the directional distribution (for non-diffuse reflections).

### 2.1 The Room Acoustic Rendering Equation

From Siltanen et al. [1]:

```
L(x', Omega, t) = L0(x', Omega, t) + integral_A  R(x, x', Omega, t) * L(x, v_{x->x'}, t) dA(x)
```

where:
- `L(x', Omega, t)` is the outgoing time-dependent energy radiance at surface point `x'` in direction `Omega`
- `L0` is the initial (self-emitted) radiance from sound sources
- `R` is the reflection kernel: `R = V(x,x') * F(x,x') * D(x,x',t) * rho(Theta, Omega)`
  - `V(x,x')`: binary visibility (0 or 1)
  - `F(x,x') = cos(theta_x) * cos(theta_x') / |x - x'|^2`: geometric form factor
  - `D(x,x',t) = delta(t - |x-x'|/c)`: propagation delay
  - `rho(Theta, Omega)`: BRDF at the receiving surface

### 2.2 Discretization

The continuous surface `A` is divided into `N_pat` patches. The direction hemisphere at each patch is divided into `N_dir` sectors (BRDF bins). Each patch `i` stores a `DirectionalResponse`: an array of `N_dir` time-domain buffers of length `T` samples.

### 2.3 Progressive Shooting

Rather than solving the full `N_pat * N_dir` linear system, we use progressive refinement (shooting radiosity):

```
repeat:
    i = patch with max total unshot energy
    for each visible patch j:
        delay = distance(i, j) / c
        for each outgoing direction k of patch i:
            for each incoming direction l at patch j:
                coefficient = formFactor(i, j) * brdf_j(l, k) * airAbs(distance)
                unshotEnergy[j][l].delayMultiplyAdd(unshotEnergy[i][k], delay, coefficient)
                totalEnergy[j][l].delayMultiplyAdd(unshotEnergy[i][k], delay, coefficient)
    clear unshotEnergy[i]
until totalUnshotEnergy < threshold
```

### 2.4 Receiver Gathering

After convergence, the impulse response at a receiver point `r` is constructed by gathering energy from all visible patches:

```
for each patch i visible from receiver r:
    delay = distance(centroid_i, r) / c
    weight = solidAngle(patch_i as seen from r) * directionalWeight
    receiverResponse.delayMultiplyAdd(totalEnergy[i][direction_toward_r], delay, weight)
```

---

## 3. Implementation Phases

### Phase 1: Patch Infrastructure

**Goal:** Create the `Patch` data structure and tessellation pipeline.

**Files to create/modify:**
- Create `src/compute/radiance/patch.ts`
- Modify `src/compute/radiance/art.ts`

**Patch data structure:**
```typescript
interface Patch {
    index: number;                    // Global patch index
    centroid: Vector3;                // World-space center
    normal: Vector3;                  // World-space outward normal
    area: number;                     // Triangle area in world units
    vertices: [Vector3, Vector3, Vector3]; // World-space triangle vertices
    surfaceIndex: number;             // Index into parent Surface array
    absorption: (freq: number) => number; // From parent surface material
    scattering: (freq: number) => number; // From parent surface material
}
```

**Tessellation pipeline:**
1. Iterate `room.allSurfaces`
2. For each surface, apply `TessellateModifier` (parameterized by `maxEdgeLength`)
3. Extract each output triangle as a `Patch`, transforming vertices to world space via `surface.localToWorld()`
4. Assign `absorption` and `scattering` functions from the parent surface's `acousticMaterial`
5. Build a flat `Patch[]` array and a mapping `triangleIndex -> patchIndex` for BVH lookups
6. Build a single BVH from all patch triangles using `BVHBuilder`

**Key consideration:** The `TessellateModifier` already exists and works on `BufferGeometry`. The `maxEdgeLength` parameter controls patch granularity — smaller patches give more accurate form factors but increase memory and computation quadratically. A reasonable default is 0.5m for room-scale simulations (yielding ~100-1000 patches for a typical room).

### Phase 2: BRDF Representation

**Goal:** Complete the `BRDF` class so it stores reflection coefficients per direction bin and supports lookups.

**Files to modify:**
- `src/compute/radiance/brdf.ts`

**Design:**
```typescript
class BRDF {
    detail: number;                        // Icosahedron subdivision level
    directions: Vector3[];                 // Unit vectors for each hemisphere bin
    nSlots: number;                        // Number of direction bins
    coefficients: Float32Array[];          // [incomingSlot][outgoingSlot] reflection weights

    constructor(detail: number, absorption: number, scattering: number)
    getDirectionIndex(direction: Vector3, patchNormal: Vector3): number
    computeCoefficients(absorption: number, scattering: number): void
}
```

The BRDF combines specular and diffuse components:
- **Diffuse component** (weight = `scattering`): energy distributed uniformly across all outgoing bins, weighted by `(1 - absorption) * scattering / N_dir`
- **Specular component** (weight = `1 - scattering`): energy concentrated in the mirror-reflection bin, weighted by `(1 - absorption) * (1 - scattering)`

The `getDirectionIndex` method transforms a world-space direction into the patch's local frame (using the patch normal as the z-axis) and finds the nearest hemisphere bin.

The existing icosahedron-based hemisphere sampling is the right approach. At `detail=1`, the icosahedron has ~21 upper-hemisphere vertices (~21 BRDF bins). At `detail=0`, there are ~6 bins. The number of bins controls angular resolution vs. memory per patch.

### Phase 3: Form Factor Computation

**Goal:** Compute visibility and geometric coupling between patch pairs using ray-based sampling.

**Files to create:**
- Create `src/compute/radiance/form-factor.ts`

**Approach:** Use the existing BVH for ray-based form factor estimation. For each shooting patch, cast rays toward all other patches and compute:

```
F(i, j) = (1 / N_rays) * sum_over_rays_hitting_j [ cos(theta_i) * cos(theta_j) / (pi * d^2) ] * A_j
```

However, since ART uses progressive shooting (not precomputed form factors), we compute form factors on-the-fly during each shoot: cast `N_rays` from the shooting patch's centroid in hemisphere directions distributed according to the BRDF, trace each ray to find which patch it hits, and deposit energy at the hit patch.

This is exactly what Savioja's GA_ART.js does: `createNextARTraysAndReflect` casts rays from the shooting patch, weighted by the directional energy distribution, and `registerARTenergies` deposits energy at the receiving patch.

**Ray-based shooting (per iteration):**
1. Select patch `i` with highest `unshotEnergy[i].sum()`
2. For each BRDF slot `k` of patch `i`, compute `raysPerSlot[k]` proportional to energy in that slot
3. For each ray in slot `k`:
   - Origin: random point on patch `i` (barycentric sampling)
   - Direction: random direction within BRDF slot `k` angular range
   - Trace ray through BVH to find hit patch `j`
   - Compute `delay = distance / c` and `gain = 1 / raysPerSlot[k]`
   - Deposit energy: `unshotEnergy[j].delayMultiplyAdd(unshotEnergy[i][k], delay, brdf_j_coefficients[incomingSlot], gain)`
4. Clear `unshotEnergy[i]`

### Phase 4: Core Shooting Loop

**Goal:** Implement the main `calculate()` method in `ART`.

**Files to modify:**
- `src/compute/radiance/art.ts`

**Properties to add to ART class:**
```typescript
// Configuration
roomID: string;
sourceIDs: string[];
receiverIDs: string[];
maxEdgeLength: number;           // Tessellation granularity (default 0.5m)
brdfDetail: number;              // Icosahedron subdivision (default 1)
raysPerShoot: number;            // Rays per shooting iteration (default 200)
maxIterations: number;           // Max shooting iterations (default 100)
convergenceThreshold: number;    // Stop when unshot/total < threshold (default 0.01)
responseLength: number;          // Time samples in response buffers
sampleRate: number;              // Internal temporal sample rate (e.g. 1000 Hz)
frequencies: number[];           // Octave bands to compute
temperature: number;             // For speed of sound and air absorption

// Runtime state
patches: Patch[];
bvh: BVH;
unshotEnergy: DirectionalResponse[];   // Per patch
totalEnergy: DirectionalResponse[];    // Per patch
patchBRDFs: BRDF[];                    // Per patch (shared by material)
```

**calculate() pseudocode:**
```
calculate():
    1. Tessellate room surfaces into patches
    2. Build BVH from patch triangles
    3. Create BRDF for each unique surface material
    4. Initialize energy buffers (unshotEnergy, totalEnergy) for each patch
    5. Inject source emission into nearest visible patches
    6. For each frequency band:
        a. Progressive shooting loop:
            while (totalUnshotEnergy > threshold && iteration < maxIterations):
                shootingPatch = argmax(unshotEnergy[i].sum())
                shootFromPatch(shootingPatch)
                iteration++
        b. Gather receiver response from all visible patches
        c. Store frequency-band impulse response
    7. Combine frequency-band responses
    8. Emit results to result-store
```

**Source injection (step 5):**
For each source, cast rays from the source position into the room. Each ray that hits a patch `j` deposits initial energy:
```
delay = distance(source, centroid_j) / c
unshotEnergy[j][incomingDirection].delayMultiplyAdd(sourceEmission, delay, brdf_j[incoming][outgoing])
totalEnergy[j][incomingDirection].delayMultiplyAdd(sourceEmission, delay, brdf_j[incoming][outgoing])
```

**Air absorption during propagation:**
At each energy transfer, scale by `exp(-m * distance)` where `m` is the air attenuation coefficient from `ac.airAttenuation([freq], temperature)` converted from dB/m to Nepers/m.

### Phase 5: Receiver Gathering and Result Emission

**Goal:** Collect energy at receiver positions and output impulse responses.

**Files to modify:**
- `src/compute/radiance/art.ts`
- `src/store/result-store.ts` (if new ResultKind needed)

**Receiver gathering:**
For each receiver position `r`:
1. For each patch `i`, check visibility from `r` to `centroid_i` via BVH
2. If visible, compute:
   - `delay = distance(r, centroid_i) / c`
   - `directionIndex = brdf.getDirectionIndex(r - centroid_i, patch_i.normal)`
   - `solidAngle = patch_i.area * cos(theta) / distance^2`
   - `airAbsFactor = exp(-m * distance)`
3. Accumulate: `receiverResponse.delayMultiplyAdd(totalEnergy[i][directionIndex], delay, solidAngle * airAbsFactor)`

**Result emission:**
Use the existing `ResultKind.ImpulseResponse` to emit results, following the pattern established by the RayTracer:
```typescript
const result: Result<ResultKind.ImpulseResponse> = {
    kind: ResultKind.ImpulseResponse,
    name: `ART IR: ${sourceName} -> ${receiverName}`,
    uuid: `${this.uuid}-art-ir-${sourceId}-${receiverId}`,
    from: this.uuid,
    info: { sampleRate, sourceName, receiverName, sourceId, receiverId },
    data: displayData
};
emit("ADD_RESULT", result);
```

### Phase 6: Parameter UI

**Goal:** Build the ARTTab configuration panel.

**Files to modify:**
- `src/components/parameter-config/ARTTab.tsx`
- `src/compute/auto-calculate.ts` (add `"art"` to `CALCULATABLE_SOLVER_KINDS`)

**Parameters to expose:**

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Room | (first room) | dropdown | Room to simulate |
| Sources | [] | multi-select | Sound sources |
| Receivers | [] | multi-select | Receiver positions |
| Max Edge Length | 0.5 m | 0.1 - 2.0 | Tessellation patch size |
| BRDF Detail | 1 | 0 - 2 | Hemisphere subdivision (6/21/81 bins) |
| Rays Per Shoot | 200 | 50 - 1000 | Rays cast per shooting iteration |
| Max Iterations | 100 | 10 - 500 | Convergence iteration limit |
| Convergence Threshold | 0.01 | 0.001 - 0.1 | Stop when unshot/total < threshold |
| Temperature | 20 C | -10 - 50 | For speed of sound and air absorption |
| Frequency Bands | octave 125-8000 | checkboxes | Bands to compute |

Follow the existing pattern from the RT60 and RayTracer parameter panels: use `PropertyRowFolder`, `PropertyRowLabel`, `PropertyRowSlider`, and `PropertyRowSelect` components, emitting `ART_SET_PROPERTY` events on change.

### Phase 7: Frequency-Dependent Computation

**Goal:** Run the shooting loop per octave band with frequency-dependent absorption and air attenuation.

The frequency dependence enters at three points:
1. **Surface absorption**: `patch.absorption(freq)` varies per band
2. **Air attenuation**: `ac.airAttenuation([freq], temperature)` varies per band
3. **Scattering coefficient**: `patch.scattering(freq)` varies per band, affecting BRDF shape

**Approach:** Run the full progressive shooting loop independently for each frequency band. This is the standard approach in time-domain ART [1][2]. Each band produces its own impulse response, which can then be:
- Displayed as individual band responses
- Combined via octave-band filtering and summation for broadband auralization

An optimization noted by Siltanen et al. [5] is to perform the computation in the frequency domain, where all bands can be processed simultaneously. This is a future enhancement — the initial implementation should use the simpler per-band approach.

### Phase 8: Testing

**Test categories:**

1. **Patch tessellation tests** — Verify patches cover the full surface area, normals point outward, centroid lies on the surface
2. **BRDF tests** — Energy conservation (sum of all outgoing coefficients = `1 - absorption`), specular peak in correct bin, diffuse uniformity
3. **Form factor / visibility tests** — Two parallel patches facing each other have high form factor; occluded patches have zero; form factor reciprocity `F_ij * A_i = F_ji * A_j`
4. **Energy conservation tests** — Total energy (shot + unshot) remains constant minus absorbed energy at each iteration
5. **Convergence tests** — Simple shoebox room converges to known Sabine RT60
6. **Response symmetry** — Swapping source and receiver produces the same impulse response (reciprocity)
7. **Comparison with RT60 solver** — ART-derived RT60 should approximately match Sabine/Eyring for a diffuse shoebox room

---

## 4. Data Flow Diagram

```
                    Room
                     |
              allSurfaces[]
                     |
            TessellateModifier
                     |
                 Patch[]  -----> BVH (for ray-surface intersection)
                     |
              BRDF per patch
                     |
    Source emission --+--> Progressive Shooting Loop
                     |       |
                     |    [select max-energy patch]
                     |    [cast rays -> BVH intersection]
                     |    [deposit energy at hit patches]
                     |    [apply BRDF, delay, air absorption]
                     |    [repeat until convergence]
                     |       |
                     |    totalEnergy[patch][direction][time]
                     |       |
                     +--- Receiver Gathering
                             |
                     [cast rays from receiver to patches]
                     [accumulate delayed responses]
                             |
                    Impulse Response
                             |
                    Result Store -> UI
```

---

## 5. Complexity and Performance Considerations

**Memory:** Each patch stores `N_dir` response buffers of `T` samples. For `N = 500` patches, `N_dir = 21` bins, `T = 5000` samples (5s at 1000 Hz): `500 * 21 * 5000 * 4 bytes = ~200 MB` for `unshotEnergy` alone, doubled for `totalEnergy`. This is the primary memory bottleneck.

**Mitigations:**
- Use a coarser temporal sample rate (e.g., 500 Hz) for late reflections where fine temporal detail is less important
- Dynamically extend response buffers only when energy arrives at later times (the existing `Response.extend()` method supports this)
- Use fewer BRDF bins (`detail=0` gives 6 bins, reducing memory by 3.5x)
- Limit patch count through appropriate `maxEdgeLength`

**Computation:** Each shooting iteration traces `raysPerShoot` rays through the BVH (`O(log N)` per ray) and performs `raysPerShoot` `delayMultiplyAdd` operations. With 100 iterations and 200 rays: 20,000 ray traces total. This is modest and should complete in under a second for typical rooms.

**Frequency bands:** Running 7 octave bands multiplies the computation and memory by 7. Consider running bands in sequence (not simultaneously) to limit peak memory.

---

## 6. File Manifest

| File | Action | Description |
|------|--------|-------------|
| `src/compute/radiance/patch.ts` | **Create** | Patch interface and tessellation-to-patches pipeline |
| `src/compute/radiance/form-factor.ts` | **Create** | Ray-based form factor estimation and shooting helpers |
| `src/compute/radiance/art.ts` | **Modify** | Add properties, `calculate()`, source injection, receiver gathering |
| `src/compute/radiance/brdf.ts` | **Modify** | Add coefficient storage, direction lookup, specular/diffuse mixing |
| `src/compute/radiance/directional-response.ts` | **Modify** | Minor additions if needed (e.g., `maxEnergy()` helper) |
| `src/compute/radiance/response.ts` | **Modify** | Minor additions if needed |
| `src/components/parameter-config/ARTTab.tsx` | **Modify** | Full parameter configuration UI |
| `src/compute/auto-calculate.ts` | **Modify** | Add `"art"` to `CALCULATABLE_SOLVER_KINDS` |
| `src/compute/radiance/__tests__/` | **Create** | Test suite for patches, BRDF, shooting, energy conservation |

---

## 7. References

### Primary Sources

[1] **Siltanen, S., Lokki, T., Kiminki, S., & Savioja, L.** (2007). "The room acoustic rendering equation." *Journal of the Acoustical Society of America*, 122(3), 1624-1635. doi:10.1121/1.2766781
- Derives the RARE from Kajiya's rendering equation, presents the acoustic radiance transfer method handling both diffuse and non-diffuse reflections, validates against measured room data.
- https://pubs.aip.org/asa/jasa/article-abstract/122/3/1624/852994/

[2] **Nosal, E.-M., Hodgson, M., & Ashdown, I.** (2004). "Improved algorithms and methods for room sound-field prediction by acoustical radiosity in arbitrary polyhedral rooms." *Journal of the Acoustical Society of America*, 116(2), 970-980. doi:10.1121/1.1772400
- Foundational work on time-dependent acoustical radiosity with discrete patches, presents the progressive shooting algorithm and averaging technique for computational efficiency.
- https://pubmed.ncbi.nlm.nih.gov/15376663/

[3] **Siltanen, S., Lokki, T., & Savioja, L.** (2009). "Frequency domain acoustic radiance transfer for real-time auralization." *Acta Acustica united with Acustica*, 95(1), 106-117.
- Extends ART to frequency domain allowing all bands to be processed simultaneously, demonstrates real-time auralization with a moving listener using GPU computation.
- https://www.researchgate.net/publication/233626633_Frequency_Domain_Acoustic_Radiance_Transfer_for_Real-Time_Auralization

[4] **Savioja, L. & Xiang, N.** (2020). "Simulation-Based Auralization of Room Acoustics." *Acoustics Today*, 16(4), 48-56.
- Overview of ART in the context of modern room acoustic simulation, describes precomputation of surface responses and real-time receiver gathering.
- https://acousticstoday.org/simulation-based-auralization-of-room-acoustics-lauri-savioja-and-ning-xiang/

[5] **Antani, L., Chandak, A., Taylor, M., & Manocha, D.** (2012). "Direct-to-Indirect Acoustic Radiance Transfer." *IEEE Transactions on Visualization and Computer Graphics*, 18(2), 261-269.
- Efficient ART variant separating direct and indirect transfer, uses precomputed transport for static scenes with reduced computational complexity.
- https://ieeexplore.ieee.org/document/5753892/

[6] **Lam, Y. W.** (1996). "A comparison of three diffuse reflection modeling methods used in room acoustics computer models." *Journal of the Acoustical Society of America*, 100(4), 2181-2192.
- Compares Lambert, BRDF, and random scattering models for diffuse reflections relevant to the BRDF implementation.

### Background and Theory

[7] **Kajiya, J. T.** (1986). "The rendering equation." *ACM SIGGRAPH Computer Graphics*, 20(4), 143-150.
- The original rendering equation from computer graphics that RARE extends to acoustics with temporal convolution and propagation delay.

[8] **Cohen, M. F. & Wallace, J. R.** (1993). *Radiosity and Realistic Image Synthesis*. Academic Press.
- Comprehensive reference on radiosity algorithms including progressive refinement, form factors, and hemisphere discretization — directly applicable to the shooting loop implementation.

[9] **Kuttruff, H.** (2009). *Room Acoustics*, 5th edition. Spon Press.
- Standard reference for room acoustic theory including diffuse field assumptions, Sabine/Eyring equations (for validation), and sound energy density concepts underlying the radiance formulation.

### Implementation References

[10] **Savioja, L.** (2016). Legacy GA_ART.js implementation.
- Existing reference code in this repository at `src/compute/raytracer/ga/GA_ART.js`. Implements 2D progressive ART shooting with BRDF-weighted ray distribution, energy registration, and animation. Key functions: `createARTresponses`, `nextARTshoot`, `createNextARTraysAndReflect`, `registerARTenergies`.

[11] **Savioja, L.** Interactive Acoustics course material.
- Online teaching materials covering acoustic radiosity and radiance transfer with pseudocode and interactive demonstrations.
- http://interactiveacoustics.info/html/GA_radiance.html
- http://interactiveacoustics.info/html/GA_RARE.html

[12] **NVIDIA GPU Gems 2, Chapter 39.** "Global Illumination Using Progressive Refinement Radiosity."
- GPU-accelerated progressive radiosity applicable to future ART optimization.
- https://developer.nvidia.com/gpugems/gpugems2/part-v-image-oriented-computing/chapter-39-global-illumination-using-progressive

### Differentiable and Modern Extensions

[13] **Xu, Z. et al.** (2025). "Differentiable Acoustic Radiance Transfer." *arXiv:2509.15946*.
- Modern formulation with factorized visibility and material matrices, gradient-based optimization of material parameters, frequency-domain solution. Provides the clearest modern mathematical treatment of discretized ART.
- https://arxiv.org/abs/2509.15946
