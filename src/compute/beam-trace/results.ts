import Receiver from "../../objects/receiver";
import { emit } from "../../messenger";
import { useResult, ResultKind, Result } from "../../store";
import * as ac from "../acoustics";
import { HISTOGRAM_BIN_WIDTH, HISTOGRAM_NUM_BINS } from "../shared/tail-synthesis-types";
import type { ResponseByIntensity, RayPathResult } from "../shared/response-by-intensity-types";
import { DEFAULT_INTENSITY_SAMPLE_RATE } from "../shared/response-by-intensity-types";
import { resampleResponseByIntensity } from "../shared/response-by-intensity";
import { KVP } from "../../common/key-value-pair";
import type { BeamTracePath } from "./paths";
import { receiverGainForPath } from "./impulse-response";

export type ArrivalPressureFn = (initialSPL: number[], path: BeamTracePath, receiverGain: number) => number[];

export function buildEnergyHistogram(params: {
  validPaths: BeamTracePath[];
  frequencies: number[];
  receiver: Receiver | null;
  arrivalPressure: ArrivalPressureFn;
}): Float32Array[] {
  const { validPaths, frequencies, receiver, arrivalPressure } = params;
  const numBands = frequencies.length;
  const histogram: Float32Array[] = [];
  for (let f = 0; f < numBands; f++) {
    histogram.push(new Float32Array(HISTOGRAM_NUM_BINS));
  }
  const spls = Array(numBands).fill(100);

  for (const path of validPaths) {
    const bin = Math.floor(path.arrivalTime / HISTOGRAM_BIN_WIDTH);
    if (bin < 0 || bin >= HISTOGRAM_NUM_BINS) continue;
    const pressure = arrivalPressure(spls, path, receiverGainForPath(receiver, path));
    for (let f = 0; f < numBands; f++) {
      histogram[f][bin] += pressure[f] * pressure[f];
    }
  }
  return histogram;
}

export function calculateLevelTimeProgression(params: {
  validPaths: BeamTracePath[];
  levelTimeProgressionId: string;
  plotFrequency: number;
  maxReflectionOrder: number;
  solverUuid: string;
  receiver: Receiver | null;
  arrivalPressure: ArrivalPressureFn;
}) {
  const {
    validPaths, levelTimeProgressionId, plotFrequency, maxReflectionOrder,
    solverUuid, receiver, arrivalPressure,
  } = params;
  if (validPaths.length === 0) return;

  const sortedPaths = [...validPaths].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const levelTimeProgression = {
    ...useResult.getState().results[levelTimeProgressionId] as Result<ResultKind.LevelTimeProgression>,
  };
  levelTimeProgression.data = [];
  levelTimeProgression.info = {
    ...levelTimeProgression.info,
    maxOrder: maxReflectionOrder,
    frequency: [plotFrequency],
  };

  for (let i = 0; i < sortedPaths.length; i++) {
    const path = sortedPaths[i];
    const recGain = receiverGainForPath(receiver, path);
    const pressure = arrivalPressure(levelTimeProgression.info.initialSPL, path, recGain);
    const pressureLp = ac.P2Lp(pressure) as number[];
    levelTimeProgression.data.push({
      time: path.arrivalTime,
      pressure: pressureLp,
      arrival: i + 1,
      order: path.order,
      uuid: `${solverUuid}-path-${i}`,
    });
  }
  emit("UPDATE_RESULT", { uuid: levelTimeProgressionId, result: levelTimeProgression });
}

export function calculateResponseByIntensity(params: {
  validPaths: BeamTracePath[];
  frequencies: number[];
  sourceId: string;
  receiverId: string;
  receiver: Receiver | null;
  arrivalPressure: ArrivalPressureFn;
}): KVP<KVP<ResponseByIntensity>> {
  const { validPaths, frequencies, sourceId, receiverId, receiver, arrivalPressure } = params;
  const spls = Array(frequencies.length).fill(100);
  const sortedPaths = [...validPaths].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const response: RayPathResult[] = [];

  for (const path of sortedPaths) {
    const pressure = arrivalPressure(spls, path, receiverGainForPath(receiver, path));
    response.push({
      time: path.arrivalTime,
      bounces: path.order,
      level: ac.P2Lp(pressure) as number[],
    });
  }

  const raw: KVP<KVP<ResponseByIntensity>> = {
    [receiverId]: { [sourceId]: { freqs: frequencies, response } },
  };
  return resampleResponseByIntensity(raw, DEFAULT_INTENSITY_SAMPLE_RATE) ?? raw;
}
