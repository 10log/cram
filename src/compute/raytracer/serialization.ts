// @ts-nocheck
import { KVP } from "../../common/key-value-pair";
import { RayPath, Chain } from "./types";

export function pathsToLinearBuffer(paths: KVP<RayPath[]>): Float32Array {
  const uuidToLinearBuffer = (uuid) => uuid.split("").map((x) => x.charCodeAt(0));
  const chainArrayToLinearBuffer = (chainArray) => {
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
  const pathOrder = ["source", "chainLength", "time", "intersectedReceiver", "energy", "chain"];
  const chainOrder = [
    "object",
    "angle",
    "distance",
    "energy",
    "faceIndex",
    "faceMaterialIndex",
    "faceNormal",
    "point"
  ];

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

export function linearBufferToPaths(linearBuffer: Float32Array): KVP<RayPath[]> {
  const uuidLength = 36;
  const chainItemLength = 47;
  const decodeUUID = (buffer) => String.fromCharCode(...buffer);
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
  const decodePathBuffer = (buffer) => {
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
      /*
      paths.push({
        source,
        chainLength,
        time,
        intersectedReceiver,
        energy,
        chain
      });
      */
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
