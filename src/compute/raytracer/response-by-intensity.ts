import * as ac from "../acoustics";
import Surface from "../../objects/surface";
import Source from "../../objects/source";
import Receiver from "../../objects/receiver";
import Room from "../../objects/room";
import { useContainer } from "../../store";
import { KVP } from "../../common/key-value-pair";
import {
  RayPath, RayPathResult, ResponseByIntensity, ChartData, EnergyTime, ReceiverData,
} from "./types";

// Re-export shared functions
export { resampleResponseByIntensity, calculateT20, calculateT30, calculateT60 } from "../shared/response-by-intensity";

import { resampleResponseByIntensity } from "../shared/response-by-intensity";

const { abs } = Math;

export function reflectionLossFunction(room: Room, raypath: RayPath, frequency: number): number {
  const chain = raypath.chain.slice(0, -1);
  if (chain && chain.length > 0) {
    let magnitude = 1;
    for (let k = 0; k < chain.length; k++) {
      const intersection = chain[k];
      const surface = room.surfaceMap[intersection.object] as Surface;
      const angle = intersection["angle"] || 0;
      magnitude = magnitude * abs(surface.reflectionFunction(frequency, angle));
    }
    return magnitude;
  }
  return 1;
}

//TODO change this name to something more appropriate
export function calculateReflectionLoss(
  paths: KVP<RayPath[]>,
  room: Room,
  receiverIDs: string[],
  frequencies: number[]
): [ReceiverData[], ChartData[]] {
  // reset the receiver data
  const allReceiverData = [] as ReceiverData[];

  // helper function
  const dataset = (label: string, data: number[][]) => ({ label, data });

  // for the chart
  const chartdata = [] as ChartData[];
  if (frequencies) {
    for (let i = 0; i < frequencies.length; i++) {
      chartdata.push(dataset(frequencies[i].toString(), []));
    }
  }

  // pathkeys.length should equal the number of receivers in the scene
  const pathkeys = Object.keys(paths);

  // for each receiver's path in the total path array
  for (let i = 0; i < pathkeys.length; i++) {
    // init contribution array
    allReceiverData.push({
      id: pathkeys[i],
      data: [] as EnergyTime[]
    });

    // for each path's chain of intersections
    for (let j = 0; j < paths[pathkeys[i]].length; j++) {
      // the individual ray path which holds intersection data
      const raypath = paths[pathkeys[i]][j];

      let refloss: any;
      // if there was a given frequency array
      if (frequencies) {
        // map the frequencies to reflection loss
        refloss = frequencies.map((freq) => ({
          frequency: freq,
          value: reflectionLossFunction(room, raypath, freq)
        }));
        frequencies.forEach((f, i) => {
          chartdata[i].data.push([raypath.time!, reflectionLossFunction(room, raypath, f)]);
        });
      } else {
        // if no frequencies given, just give back the function that calculates the reflection loss
        refloss = (freq: number) => reflectionLossFunction(room, raypath, freq);
      }
      allReceiverData[allReceiverData.length - 1].data.push({
        time: raypath.time!,
        energy: refloss
      });
    }
    allReceiverData[allReceiverData.length - 1].data = allReceiverData[
      allReceiverData.length - 1
    ].data.sort((a, b) => a.time - b.time);
  }
  for (let i = 0; i < chartdata.length; i++) {
    chartdata[i].data = chartdata[i].data.sort((a, b) => a[0] - b[0]);
    chartdata[i].x = chartdata[i].data.map((x) => x[0]);
    chartdata[i].y = chartdata[i].data.map((x) => x[1]);
  }
  return [allReceiverData, chartdata];
}

export function calculateResponseByIntensity(
  indexedPaths: KVP<KVP<RayPath[]>>,
  receiverIDs: string[],
  sourceIDs: string[],
  frequencies: number[],
  temperature: number,
  intensitySampleRate: number
): KVP<KVP<ResponseByIntensity>> | undefined {
  const paths = indexedPaths;

  // sound speed in m/s
  const soundSpeed = ac.soundSpeed(temperature);

  // attenuation in dB/m
  const airAttenuationdB = ac.airAttenuation(frequencies, temperature);

  const responseByIntensity = {} as KVP<KVP<ResponseByIntensity>>;

  // for each receiver
  for (const receiverKey in paths) {
    responseByIntensity[receiverKey] = {} as KVP<ResponseByIntensity>;
    const recForIntensity = useContainer.getState().containers[receiverKey] as Receiver;

    // for each source
    for (const sourceKey in paths[receiverKey]) {
      responseByIntensity[receiverKey][sourceKey] = {
        freqs: frequencies,
        response: [] as RayPathResult[]
      };

      // for each path
      for (let i = 0; i < paths[receiverKey][sourceKey].length; i++) {

        // propogagtion time
        let time = 0;

        // ray initial intensity
        // const Iray = Itotal / (useContainer.getState().containers[sourceKey] as Source).numRays;

        // initial intensity at each frequency
        let IrayArray: number[] = [];
        let phi = paths[receiverKey][sourceKey][i].initialPhi;
        let theta = paths[receiverKey][sourceKey][i].initialTheta;

        let srcDirectivityHandler = (useContainer.getState().containers[sourceKey] as Source).directivityHandler;

        for(let findex = 0; findex<frequencies.length; findex++){
          IrayArray[findex] = ac.P2I(srcDirectivityHandler.getPressureAtPosition(0,frequencies[findex],phi,theta)) as number;
        }

        // apply receiver directivity gain (intensity domain: gain²)
        const pathObj = paths[receiverKey][sourceKey][i];
        const dir = pathObj.arrivalDirection || [0, 0, 1] as [number, number, number];
        const recGainIntensity = recForIntensity.getGain(dir as [number, number, number]);
        const recGainSq = recGainIntensity * recGainIntensity;
        if (recGainSq !== 1.0) {
          for (let findex = 0; findex < frequencies.length; findex++) {
            IrayArray[findex] *= recGainSq;
          }
        }

        // for each intersection
        for (let j = 0; j < paths[receiverKey][sourceKey][i].chain.length; j++) {
          // intersected angle wrt normal, and the distance traveled
          const { angle, distance } = paths[receiverKey][sourceKey][i].chain[j];

          time += distance / soundSpeed;

          // the intersected surface
          // const surface = paths[receiverKey][sourceKey][i].chain[j].object.parent as Surface;
          const id = paths[receiverKey][sourceKey][i].chain[j].object;

          const surface = useContainer.getState().containers[id] || null;

          // for each frequency
          for (let f = 0; f < frequencies.length; f++) {
            const freq = frequencies[f];
            let coefficient = 1;
            if (surface && surface.kind === 'surface') {
              coefficient = (surface as Surface).reflectionFunction(freq, angle);
              // coefficient = 1 - (surface as Surface).absorptionFunction(freq);
            }
            IrayArray[f] = ac.P2I(
              ac.Lp2P((ac.P2Lp(ac.I2P(IrayArray[f] * coefficient)) as number) - airAttenuationdB[f] * distance)
            ) as number;
          }
        }
        const level = ac.P2Lp(ac.I2P(IrayArray)) as number[];
        responseByIntensity[receiverKey][sourceKey].response.push({
          time,
          level,
          bounces: paths[receiverKey][sourceKey][i].chain.length
        });
      }
      responseByIntensity[receiverKey][sourceKey].response.sort((a, b) => a.time - b.time);
    }
  }

  return resampleResponseByIntensity(responseByIntensity, intensitySampleRate);
}

