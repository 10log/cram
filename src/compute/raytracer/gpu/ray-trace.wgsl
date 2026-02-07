// ─── GPU Ray Tracer Compute Shader ───────────────────────────────────
// Traces one ray per thread through all bounces using an iterative BVH
// traversal and Moller–Trumbore ray-triangle intersection.
//
// Mirrors the CPU implementation in ray-core.ts.

// Constants
const MAX_BOUNCES: u32 = 64u;
const MAX_BANDS: u32 = 7u;
const BVH_STACK_SIZE: u32 = 64u;
const SELF_INTERSECTION_OFFSET: f32 = 0.01;
const PI: f32 = 3.14159265358979;
const EPSILON: f32 = 1e-6;

// ─── Structures ──────────────────────────────────────────────────────

struct Params {
  numRays: u32,
  maxBounces: u32,
  numBands: u32,
  numReceivers: u32,
  numTriangles: u32,
  numNodes: u32,
  numSurfaces: u32,
  batchSeed: u32,
  rrThreshold: f32,
  _pad0: f32,
  _pad1: f32,
  _pad2: f32,
  // Per-band air attenuation in dB/m (up to MAX_BANDS)
  airAtt: array<f32, 7>,
}

// Per-bounce output written to the chain buffer
struct ChainEntry {
  px: f32, py: f32, pz: f32,
  distance: f32,
  surfaceIndex: u32,
  _pad0: u32,
  angle: f32,
  energy: f32,
  bandEnergy: array<f32, 7>,
  _pad1: f32,
}

// Per-ray output
struct RayOutput {
  chainLength: u32,
  intersectedReceiver: u32, // 0 or 1
  receiverIndex: u32,
  arrivalDirX: f32,
  arrivalDirY: f32,
  arrivalDirZ: f32,
  _pad0: f32,
  _pad1: f32,
  finalBandEnergy: array<f32, 7>,
  _pad2: f32,
}

// Per-ray input
struct RayInput {
  ox: f32, oy: f32, oz: f32,
  dx: f32, dy: f32, dz: f32,
  initialPhi: f32,
  initialTheta: f32,
  bandEnergy: array<f32, 7>,
  _pad: f32,
}

// ─── Bindings ────────────────────────────────────────────────────────

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> bvhNodes: array<f32>;
@group(0) @binding(2) var<storage, read> triVerts: array<f32>;
@group(0) @binding(3) var<storage, read> triSurfIndex: array<u32>;
@group(0) @binding(4) var<storage, read> triNormals: array<f32>;
@group(0) @binding(5) var<storage, read> surfAcoustic: array<f32>;
@group(0) @binding(6) var<storage, read> receiverSpheres: array<f32>;
@group(0) @binding(7) var<storage, read> rayInputs: array<RayInput>;
@group(0) @binding(8) var<storage, read_write> rayOutputs: array<RayOutput>;
@group(0) @binding(9) var<storage, read_write> chainBuffer: array<ChainEntry>;

// ─── RNG (PCG hash) ─────────────────────────────────────────────────

fn pcg_hash(input: u32) -> u32 {
  var state = input * 747796405u + 2891336453u;
  var word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn rand(seed: ptr<function, u32>) -> f32 {
  *seed = pcg_hash(*seed);
  return f32(*seed) / 4294967295.0;
}

// ─── Vector helpers ─────────────────────────────────────────────────

fn dot3(ax: f32, ay: f32, az: f32, bx: f32, by: f32, bz: f32) -> f32 {
  return ax * bx + ay * by + az * bz;
}

fn length3(x: f32, y: f32, z: f32) -> f32 {
  return sqrt(x * x + y * y + z * z);
}

fn normalize3(x: f32, y: f32, z: f32) -> vec3<f32> {
  let len = length3(x, y, z);
  if (len < EPSILON) { return vec3<f32>(0.0, 1.0, 0.0); }
  return vec3<f32>(x / len, y / len, z / len);
}

// ─── Ray-AABB slab test ─────────────────────────────────────────────

fn rayAabbIntersect(
  ox: f32, oy: f32, oz: f32,
  invDx: f32, invDy: f32, invDz: f32,
  bminX: f32, bminY: f32, bminZ: f32,
  bmaxX: f32, bmaxY: f32, bmaxZ: f32,
  tMax: f32,
) -> bool {
  var t1 = (bminX - ox) * invDx;
  var t2 = (bmaxX - ox) * invDx;
  var tNear = min(t1, t2);
  var tFar = max(t1, t2);

  t1 = (bminY - oy) * invDy;
  t2 = (bmaxY - oy) * invDy;
  tNear = max(tNear, min(t1, t2));
  tFar = min(tFar, max(t1, t2));

  t1 = (bminZ - oz) * invDz;
  t2 = (bmaxZ - oz) * invDz;
  tNear = max(tNear, min(t1, t2));
  tFar = min(tFar, max(t1, t2));

  return tNear <= tFar && tFar >= 0.0 && tNear < tMax;
}

// ─── Moller–Trumbore ray-triangle intersection ──────────────────────

fn rayTriIntersect(
  ox: f32, oy: f32, oz: f32,
  dx: f32, dy: f32, dz: f32,
  triIdx: u32,
) -> vec2<f32> {
  // Returns (t, 0) on hit, (-1, 0) on miss
  let b = triIdx * 9u;
  let v0x = triVerts[b]; let v0y = triVerts[b + 1u]; let v0z = triVerts[b + 2u];
  let v1x = triVerts[b + 3u]; let v1y = triVerts[b + 4u]; let v1z = triVerts[b + 5u];
  let v2x = triVerts[b + 6u]; let v2y = triVerts[b + 7u]; let v2z = triVerts[b + 8u];

  let e1x = v1x - v0x; let e1y = v1y - v0y; let e1z = v1z - v0z;
  let e2x = v2x - v0x; let e2y = v2y - v0y; let e2z = v2z - v0z;

  // h = cross(d, e2)
  let hx = dy * e2z - dz * e2y;
  let hy = dz * e2x - dx * e2z;
  let hz = dx * e2y - dy * e2x;

  let a = e1x * hx + e1y * hy + e1z * hz;
  if (abs(a) < EPSILON) { return vec2<f32>(-1.0, 0.0); }

  let f_inv = 1.0 / a;
  let sx = ox - v0x; let sy = oy - v0y; let sz = oz - v0z;
  let u = f_inv * (sx * hx + sy * hy + sz * hz);
  if (u < 0.0 || u > 1.0) { return vec2<f32>(-1.0, 0.0); }

  // q = cross(s, e1)
  let qx = sy * e1z - sz * e1y;
  let qy = sz * e1x - sx * e1z;
  let qz = sx * e1y - sy * e1x;
  let v = f_inv * (dx * qx + dy * qy + dz * qz);
  if (v < 0.0 || u + v > 1.0) { return vec2<f32>(-1.0, 0.0); }

  let t = f_inv * (e2x * qx + e2y * qy + e2z * qz);
  if (t < EPSILON) { return vec2<f32>(-1.0, 0.0); }

  return vec2<f32>(t, 0.0);
}

// ─── Ray-sphere intersection ────────────────────────────────────────

fn raySphereIntersect(
  ox: f32, oy: f32, oz: f32,
  dx: f32, dy: f32, dz: f32,
  cx: f32, cy: f32, cz: f32,
  r: f32,
) -> f32 {
  let lx = cx - ox; let ly = cy - oy; let lz = cz - oz;
  let tca = lx * dx + ly * dy + lz * dz;
  let d2 = lx * lx + ly * ly + lz * lz - tca * tca;
  let r2 = r * r;
  if (d2 > r2) { return -1.0; }
  let thc = sqrt(r2 - d2);
  var t0 = tca - thc;
  let t1 = tca + thc;
  if (t0 < EPSILON) { t0 = t1; }
  if (t0 < EPSILON) { return -1.0; }
  return t0;
}

// ─── BVH traversal — find closest triangle hit ─────────────────────

struct HitResult {
  t: f32,
  triIdx: u32,
  hit: bool,
}

fn traceClosest(
  ox: f32, oy: f32, oz: f32,
  dx: f32, dy: f32, dz: f32,
) -> HitResult {
  var result: HitResult;
  result.t = 1e30;
  result.triIdx = 0u;
  result.hit = false;

  let invDx = select(1e30, 1.0 / dx, abs(dx) > EPSILON);
  let invDy = select(1e30, 1.0 / dy, abs(dy) > EPSILON);
  let invDz = select(1e30, 1.0 / dz, abs(dz) > EPSILON);

  var stack: array<u32, 64>;
  var stackPtr: u32 = 0u;
  stack[0] = 0u; // root node index
  stackPtr = 1u;

  while (stackPtr > 0u) {
    stackPtr -= 1u;
    let nodeIdx = stack[stackPtr];
    let off = nodeIdx * 8u;

    let bminX = bvhNodes[off];
    let bminY = bvhNodes[off + 1u];
    let bminZ = bvhNodes[off + 2u];
    let bmaxX = bvhNodes[off + 4u];
    let bmaxY = bvhNodes[off + 5u];
    let bmaxZ = bvhNodes[off + 6u];

    if (!rayAabbIntersect(ox, oy, oz, invDx, invDy, invDz, bminX, bminY, bminZ, bmaxX, bmaxY, bmaxZ, result.t)) {
      continue;
    }

    // Read data1 as u32 to check leaf flag
    let data1Bits = bitcast<u32>(bvhNodes[off + 7u]);
    let isLeaf = (data1Bits & 0x80000000u) != 0u;

    if (isLeaf) {
      let triStart = bitcast<u32>(bvhNodes[off + 3u]);
      let triCount = data1Bits & 0x7FFFFFFFu;
      for (var i = 0u; i < triCount; i++) {
        let tri = triStart + i;
        let res = rayTriIntersect(ox, oy, oz, dx, dy, dz, tri);
        if (res.x > 0.0 && res.x < result.t) {
          result.t = res.x;
          result.triIdx = tri;
          result.hit = true;
        }
      }
    } else {
      let leftIdx = bitcast<u32>(bvhNodes[off + 3u]);
      let rightIdx = data1Bits;
      if (stackPtr < BVH_STACK_SIZE - 1u) {
        stack[stackPtr] = leftIdx;
        stackPtr += 1u;
      }
      if (stackPtr < BVH_STACK_SIZE - 1u) {
        stack[stackPtr] = rightIdx;
        stackPtr += 1u;
      }
    }
  }

  return result;
}

// ─── Reflection coefficient (matches CPU reflection-coefficient.ts) ──

fn reflectionCoefficient(alpha: f32, theta: f32) -> f32 {
  let rootOneMinusAlpha = sqrt(max(1.0 - alpha, 0.0));
  let xi_o = (1.0 - rootOneMinusAlpha) / (1.0 + rootOneMinusAlpha);
  let cosTheta = abs(cos(theta));
  let xi_o_cosTheta = xi_o * cosTheta;
  let R = (xi_o_cosTheta - 1.0) / (xi_o_cosTheta + 1.0);
  return R * R;
}

// ─── Main compute entry point ───────────────────────────────────────

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let rayIdx = gid.x;
  if (rayIdx >= params.numRays) { return; }

  let inp = rayInputs[rayIdx];
  let numBands = min(params.numBands, MAX_BANDS);
  let maxBounces = min(params.maxBounces, MAX_BOUNCES);

  var rngSeed: u32 = pcg_hash(rayIdx * 747796405u + params.batchSeed);

  // Current ray state
  var ox = inp.ox; var oy = inp.oy; var oz = inp.oz;
  var dx = inp.dx; var dy = inp.dy; var dz = inp.dz;
  var d = normalize3(dx, dy, dz);
  dx = d.x; dy = d.y; dz = d.z;

  var bandEnergy: array<f32, 7>;
  for (var b = 0u; b < numBands; b++) {
    bandEnergy[b] = inp.bandEnergy[b];
  }

  // Output
  let chainBase = rayIdx * MAX_BOUNCES;
  var chainLen: u32 = 0u;
  var hitReceiver: u32 = 0u;
  var receiverIdx: u32 = 0u;
  var arrivalDir = vec3<f32>(0.0, 0.0, 0.0);

  for (var bounce = 0u; bounce < maxBounces; bounce++) {
    // Check receiver spheres first (find closest)
    var closestRecT: f32 = 1e30;
    var closestRecIdx: u32 = 0u;
    var recHit = false;
    for (var ri = 0u; ri < params.numReceivers; ri++) {
      let rb = ri * 4u;
      let rcx = receiverSpheres[rb];
      let rcy = receiverSpheres[rb + 1u];
      let rcz = receiverSpheres[rb + 2u];
      let rr = receiverSpheres[rb + 3u];
      let t = raySphereIntersect(ox, oy, oz, dx, dy, dz, rcx, rcy, rcz, rr);
      if (t > 0.0 && t < closestRecT) {
        closestRecT = t;
        closestRecIdx = ri;
        recHit = true;
      }
    }

    // BVH closest triangle hit
    let triHit = traceClosest(ox, oy, oz, dx, dy, dz);

    // Receiver is closer than any surface — ray enters receiver
    if (recHit && closestRecT < triHit.t) {
      // Apply air absorption for receiver segment
      for (var b = 0u; b < numBands; b++) {
        bandEnergy[b] *= pow(10.0, -params.airAtt[b] * closestRecT / 10.0);
      }

      // Compute mean energy
      var totalE: f32 = 0.0;
      for (var b = 0u; b < numBands; b++) { totalE += bandEnergy[b]; }
      let meanE = totalE / f32(numBands);

      // Record chain entry at receiver position
      if (chainLen < MAX_BOUNCES) {
        let ci = chainBase + chainLen;
        chainBuffer[ci].px = ox + dx * closestRecT;
        chainBuffer[ci].py = oy + dy * closestRecT;
        chainBuffer[ci].pz = oz + dz * closestRecT;
        chainBuffer[ci].distance = closestRecT;
        // Store receiver index encoded as surface index + numSurfaces offset
        chainBuffer[ci].surfaceIndex = params.numSurfaces + closestRecIdx;
        chainBuffer[ci].angle = 0.0;
        chainBuffer[ci].energy = meanE;
        for (var b = 0u; b < numBands; b++) {
          chainBuffer[ci].bandEnergy[b] = bandEnergy[b];
        }
        chainLen += 1u;
      }

      hitReceiver = 1u;
      receiverIdx = closestRecIdx;
      arrivalDir = normalize3(-dx, -dy, -dz);
      break;
    }

    // No surface hit — ray escapes
    if (!triHit.hit) { break; }

    // Surface hit
    let hitT = triHit.t;
    let hitTri = triHit.triIdx;
    let surfIdx = triSurfIndex[hitTri];

    // Hit point
    let hx = ox + dx * hitT;
    let hy = oy + dy * hitT;
    let hz = oz + dz * hitT;

    // Face normal
    let nb = hitTri * 3u;
    let nx = triNormals[nb];
    let ny = triNormals[nb + 1u];
    let nz = triNormals[nb + 2u];

    // Incidence angle
    let negDdotN = -(dx * nx + dy * ny + dz * nz);
    let angle = acos(clamp(abs(negDdotN), 0.0, 1.0));

    // Mean energy before reflection (for chain output)
    var totalEBefore: f32 = 0.0;
    for (var b = 0u; b < numBands; b++) { totalEBefore += bandEnergy[b]; }
    let meanEBefore = totalEBefore / f32(numBands);

    // Record chain entry
    if (chainLen < MAX_BOUNCES) {
      let ci = chainBase + chainLen;
      chainBuffer[ci].px = hx;
      chainBuffer[ci].py = hy;
      chainBuffer[ci].pz = hz;
      chainBuffer[ci].distance = hitT;
      chainBuffer[ci].surfaceIndex = surfIdx;
      chainBuffer[ci].angle = angle;
      chainBuffer[ci].energy = meanEBefore;
      for (var b = 0u; b < numBands; b++) {
        chainBuffer[ci].bandEnergy[b] = bandEnergy[b];
      }
      chainLen += 1u;
    }

    // Apply per-band reflection loss and air absorption
    var broadbandScatter: f32 = 0.0;
    var totalEForScatter: f32 = 0.0;

    for (var b = 0u; b < numBands; b++) {
      let acousticOffset = (surfIdx * params.numBands + b) * 2u;
      let alpha = surfAcoustic[acousticOffset];
      let scatter = surfAcoustic[acousticOffset + 1u];

      let R = reflectionCoefficient(alpha, angle);
      bandEnergy[b] *= abs(R);
      bandEnergy[b] *= pow(10.0, -params.airAtt[b] * hitT / 10.0);

      broadbandScatter += scatter * bandEnergy[b];
      totalEForScatter += bandEnergy[b];
    }

    if (totalEForScatter > 0.0) {
      broadbandScatter /= totalEForScatter;
    }

    // Russian Roulette termination
    var maxE: f32 = 0.0;
    for (var b = 0u; b < numBands; b++) {
      maxE = max(maxE, bandEnergy[b]);
    }

    if (maxE < params.rrThreshold && maxE > 0.0) {
      let survivalProb = maxE / params.rrThreshold;
      if (rand(&rngSeed) > survivalProb) {
        break; // Terminate
      }
      // Boost survivors
      for (var b = 0u; b < numBands; b++) {
        bandEnergy[b] /= survivalProb;
      }
    } else if (maxE <= 0.0) {
      break;
    }

    // Compute reflected direction
    // Specular: r = d - 2(d·n)n
    let dDotN = dx * nx + dy * ny + dz * nz;
    var rx = dx - 2.0 * dDotN * nx;
    var ry = dy - 2.0 * dDotN * ny;
    var rz = dz - 2.0 * dDotN * nz;

    // Scattering: probabilistic Lambert vs specular
    if (rand(&rngSeed) < broadbandScatter) {
      // Cosine-weighted hemisphere sampling (rejection + normal offset)
      var sx: f32; var sy: f32; var sz: f32; var lenSq: f32;
      loop {
        sx = rand(&rngSeed) * 2.0 - 1.0;
        sy = rand(&rngSeed) * 2.0 - 1.0;
        sz = rand(&rngSeed) * 2.0 - 1.0;
        lenSq = sx * sx + sy * sy + sz * sz;
        if (lenSq <= 1.0 && lenSq > 1e-6) { break; }
      }
      let invLen = 1.0 / sqrt(lenSq);
      sx *= invLen; sy *= invLen; sz *= invLen;
      // Offset along normal for cosine distribution
      rx = sx + nx;
      ry = sy + ny;
      rz = sz + nz;
    }

    // Normalize reflected direction
    d = normalize3(rx, ry, rz);
    dx = d.x; dy = d.y; dz = d.z;

    // Offset origin along normal to avoid self-intersection
    ox = hx + nx * SELF_INTERSECTION_OFFSET;
    oy = hy + ny * SELF_INTERSECTION_OFFSET;
    oz = hz + nz * SELF_INTERSECTION_OFFSET;
  }

  // Write output
  rayOutputs[rayIdx].chainLength = chainLen;
  rayOutputs[rayIdx].intersectedReceiver = hitReceiver;
  rayOutputs[rayIdx].receiverIndex = receiverIdx;
  rayOutputs[rayIdx].arrivalDirX = arrivalDir.x;
  rayOutputs[rayIdx].arrivalDirY = arrivalDir.y;
  rayOutputs[rayIdx].arrivalDirZ = arrivalDir.z;
  for (var b = 0u; b < min(params.numBands, MAX_BANDS); b++) {
    rayOutputs[rayIdx].finalBandEnergy[b] = bandEnergy[b];
  }
}
