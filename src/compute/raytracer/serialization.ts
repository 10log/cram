import { KVP } from "../../common/key-value-pair";
import { RayPath, Chain } from "./types";

// ── V2 magic number for format detection ─────────────────────────────
const V2_MAGIC = -2.0;

// ── V1 format (legacy, kept for backward compatibility) ──────────────

function pathsToLinearBufferV1(paths: KVP<RayPath[]>): Float32Array {
  const uuidToLinearBuffer = (uuid: string) => uuid.split("").map((x: string) => x.charCodeAt(0));
  const chainArrayToLinearBuffer = (chainArray: Chain[]) => {
    return chainArray
      .map((chain: Chain) => [
        ...uuidToLinearBuffer(chain.object), // 36x8
        chain.angle, // 1x32
        chain.distance, // 1x32
        chain.energy, // 1x32
        chain.faceIndex, // 1x8
        chain.faceMaterialIndex, // 1x8
        ...chain.faceNormal, // 3x32
        ...chain.point // 3x32
      ])
      .flat();
  };
  const buffer = new Float32Array(
    Object.keys(paths)
      .map((key) => {
        const pathBuffer = paths[key]
          .map((path) => {
            return [
              ...uuidToLinearBuffer(path.source),
              path.chainLength,
              path.time,
              Number(path.intersectedReceiver),
              path.energy,
              ...chainArrayToLinearBuffer(path.chain)
            ];
          })
          .flat();
        return [...uuidToLinearBuffer(key), pathBuffer.length, ...pathBuffer];
      })
      .flat()
  );
  return buffer;
}

function linearBufferToPathsV1(linearBuffer: Float32Array): KVP<RayPath[]> {
  const uuidLength = 36;
  const chainItemLength = 47;
  const decodeUUID = (buffer: Float32Array) => String.fromCharCode(...buffer);
  const decodeChainItem = (chainItem: Float32Array) => {
    let o = 0;
    const object = decodeUUID(chainItem.slice(o, (o += uuidLength)));
    const angle = chainItem[o++];
    const distance = chainItem[o++];
    const energy = chainItem[o++];
    const faceIndex = chainItem[o++];
    const faceMaterialIndex = chainItem[o++];
    const faceNormal = [chainItem[o++], chainItem[o++], chainItem[o++]];
    const point = [chainItem[o++], chainItem[o++], chainItem[o++]];
    return {
      object,
      angle,
      distance,
      energy,
      faceIndex,
      faceMaterialIndex,
      faceNormal,
      point
    } as Chain;
  };
  const decodePathBuffer = (buffer: Float32Array) => {
    const paths = [] as RayPath[];
    let o = 0;
    while (o < buffer.length) {
      const source = decodeUUID(buffer.slice(o, (o += uuidLength)));
      const chainLength = buffer[o++];
      const time = buffer[o++];
      const intersectedReceiver = Boolean(buffer[o++]);
      const energy = buffer[o++];
      const chain = [] as Chain[];
      for (let i = 0; i < chainLength; i++) {
        chain.push(decodeChainItem(buffer.slice(o, (o += chainItemLength))));
      }
      paths.push({
        source,
        chainLength,
        time,
        intersectedReceiver,
        energy,
        chain
      } as RayPath);
    }
    return paths as RayPath[];
  };
  let offset = 0;
  const pathsObj = {} as KVP<RayPath[]>;
  while (offset < linearBuffer.length) {
    const uuid = decodeUUID(linearBuffer.slice(offset, (offset += uuidLength)));
    const pathBufferLength = linearBuffer[offset++];
    const paths = decodePathBuffer(linearBuffer.slice(offset, (offset += pathBufferLength)));
    pathsObj[uuid] = paths;
  }
  return pathsObj;
}

// ── V2 format (compact binary with UUID lookup table) ────────────────
//
// Layout:
//   [MAGIC=-2.0] [numUUIDs]
//   [uuid0_c0..uuid0_c35] [uuid1_c0..uuid1_c35] ...   (lookup table)
//   [receiverIdx] [pathBufLen]
//     [sourceIdx] [chainLen] [time] [isReceiver] [energy]
//       [objectIdx] [angle] [dist] [energy] [faceIdx] [matIdx] [nx] [ny] [nz] [px] [py] [pz]
//     ...
//   ...
//
// Per chain entry: 12 floats (vs 47 in V1). ~75% reduction.

function pathsToLinearBufferV2(paths: KVP<RayPath[]>): Float32Array {
  // Build UUID lookup table
  const uuidSet = new Set<string>();
  for (const key of Object.keys(paths)) {
    uuidSet.add(key);
    for (const path of paths[key]) {
      uuidSet.add(path.source);
      for (const chain of path.chain) {
        uuidSet.add(chain.object);
      }
    }
  }
  const uuidList = Array.from(uuidSet);
  const uuidToIndex = new Map<string, number>();
  for (let i = 0; i < uuidList.length; i++) {
    uuidToIndex.set(uuidList[i], i);
  }

  // Pre-calculate total size
  const uuidTableSize = 2 + uuidList.length * 36; // magic + numUUIDs + all UUID chars
  let dataSize = 0;
  for (const key of Object.keys(paths)) {
    // receiverIdx + pathBufLen
    dataSize += 2;
    for (const path of paths[key]) {
      // sourceIdx + chainLen + time + isReceiver + energy
      dataSize += 5;
      // 12 floats per chain entry
      dataSize += path.chain.length * 12;
    }
  }

  const buffer = new Float32Array(uuidTableSize + dataSize);
  let o = 0;

  // Write header
  buffer[o++] = V2_MAGIC;
  buffer[o++] = uuidList.length;

  // Write UUID lookup table
  for (const uuid of uuidList) {
    for (let c = 0; c < 36; c++) {
      buffer[o++] = uuid.charCodeAt(c);
    }
  }

  // Write path data
  for (const key of Object.keys(paths)) {
    buffer[o++] = uuidToIndex.get(key)!;

    // Calculate path buffer length for this receiver
    let pathBufLen = 0;
    for (const path of paths[key]) {
      pathBufLen += 5 + path.chain.length * 12;
    }
    buffer[o++] = pathBufLen;

    for (const path of paths[key]) {
      buffer[o++] = uuidToIndex.get(path.source)!;
      buffer[o++] = path.chainLength;
      buffer[o++] = path.time;
      buffer[o++] = Number(path.intersectedReceiver);
      buffer[o++] = path.energy;

      for (const chain of path.chain) {
        buffer[o++] = uuidToIndex.get(chain.object)!;
        buffer[o++] = chain.angle;
        buffer[o++] = chain.distance;
        buffer[o++] = chain.energy;
        buffer[o++] = chain.faceIndex;
        buffer[o++] = chain.faceMaterialIndex;
        buffer[o++] = chain.faceNormal[0];
        buffer[o++] = chain.faceNormal[1];
        buffer[o++] = chain.faceNormal[2];
        buffer[o++] = chain.point[0];
        buffer[o++] = chain.point[1];
        buffer[o++] = chain.point[2];
      }
    }
  }

  return buffer;
}

function linearBufferToPathsV2(linearBuffer: Float32Array): KVP<RayPath[]> {
  let o = 0;

  // Read header
  o++; // skip magic
  const numUUIDs = linearBuffer[o++];

  // Read UUID lookup table
  const uuidList: string[] = [];
  for (let i = 0; i < numUUIDs; i++) {
    const chars: number[] = [];
    for (let c = 0; c < 36; c++) {
      chars.push(linearBuffer[o++]);
    }
    uuidList.push(String.fromCharCode(...chars));
  }

  // Read path data
  const pathsObj = {} as KVP<RayPath[]>;
  while (o < linearBuffer.length) {
    const receiverUuid = uuidList[linearBuffer[o++]];
    const pathBufLen = linearBuffer[o++];
    const endOffset = o + pathBufLen;

    const paths = [] as RayPath[];
    while (o < endOffset) {
      const source = uuidList[linearBuffer[o++]];
      const chainLength = linearBuffer[o++];
      const time = linearBuffer[o++];
      const intersectedReceiver = Boolean(linearBuffer[o++]);
      const energy = linearBuffer[o++];

      const chain = [] as Chain[];
      for (let i = 0; i < chainLength; i++) {
        const object = uuidList[linearBuffer[o++]];
        const angle = linearBuffer[o++];
        const distance = linearBuffer[o++];
        const chainEnergy = linearBuffer[o++];
        const faceIndex = linearBuffer[o++];
        const faceMaterialIndex = linearBuffer[o++];
        const faceNormal: [number, number, number] = [linearBuffer[o++], linearBuffer[o++], linearBuffer[o++]];
        const point: [number, number, number] = [linearBuffer[o++], linearBuffer[o++], linearBuffer[o++]];
        chain.push({
          object,
          angle,
          distance,
          energy: chainEnergy,
          faceIndex,
          faceMaterialIndex,
          faceNormal,
          point,
        } as Chain);
      }

      paths.push({
        source,
        chainLength,
        time,
        intersectedReceiver,
        energy,
        chain,
      } as RayPath);
    }

    pathsObj[receiverUuid] = paths;
  }

  return pathsObj;
}

// ── Public API with auto-detection ───────────────────────────────────

export function pathsToLinearBuffer(paths: KVP<RayPath[]>): Float32Array {
  return pathsToLinearBufferV2(paths);
}

export function linearBufferToPaths(linearBuffer: Float32Array): KVP<RayPath[]> {
  if (linearBuffer.length === 0) return {} as KVP<RayPath[]>;

  // V1 detection: first byte is a UUID charCode (48-122); V2: first byte is -2.0
  if (linearBuffer[0] === V2_MAGIC) {
    return linearBufferToPathsV2(linearBuffer);
  }
  return linearBufferToPathsV1(linearBuffer);
}

// Expose V1 for backward-compat testing
export { pathsToLinearBufferV1, linearBufferToPathsV1 };
