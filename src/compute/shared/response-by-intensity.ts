import * as ac from "../acoustics";
import { lerp } from "../../common/lerp";
import { movingAverage } from "../../common/moving-average";
import linearRegression from "../../common/linear-regression";
import { KVP } from "../../common/key-value-pair";
import type { ResponseByIntensity } from "./response-by-intensity-types";
import { DEFAULT_INTENSITY_SAMPLE_RATE } from "./response-by-intensity-types";

const { floor } = Math;

export function resampleResponseByIntensity(
  responseByIntensity: KVP<KVP<ResponseByIntensity>>,
  sampleRate: number = DEFAULT_INTENSITY_SAMPLE_RATE
): KVP<KVP<ResponseByIntensity>> | undefined {
  if (responseByIntensity) {
    for (const recKey in responseByIntensity) {
      for (const srcKey in responseByIntensity[recKey]) {
        const { response, freqs } = responseByIntensity[recKey][srcKey];
        const maxTime = response[response.length - 1].time;
        const numSamples = floor(sampleRate * maxTime);
        responseByIntensity[recKey][srcKey].resampledResponse = Array(freqs.length)
          .fill(0)
          .map((x) => new Float32Array(numSamples)) as Array<Float32Array>;

        responseByIntensity[recKey][srcKey].sampleRate = sampleRate;
        let sampleArrayIndex = 0;
        let zeroIndices = [] as number[];
        let lastNonZeroPoint = freqs.map((x) => 0);
        let seenFirstPointYet = false;
        for (let i = 0, j = 0; i < numSamples; i++) {
          let sampleTime = (i / numSamples) * maxTime;
          if (response[j] && response[j].time) {
            let actualTime = response[j].time;
            if (actualTime > sampleTime) {
              for (let f = 0; f < freqs.length; f++) {
                responseByIntensity[recKey][srcKey].resampledResponse![f][sampleArrayIndex] = 0.0;
              }
              if (seenFirstPointYet) {
                zeroIndices.push(sampleArrayIndex);
              }
              sampleArrayIndex++;
              continue;
            }
            if (actualTime <= sampleTime) {
              let sums = response[j].level.map((x) => 0);
              while (actualTime <= sampleTime) {
                actualTime = response[j].time;
                for (let k = 0; k < freqs.length; k++) {
                  sums[k] = ac.db_add([sums[k], response[j].level[k]]);
                }
                j++;
              }
              for (let f = 0; f < freqs.length; f++) {
                responseByIntensity[recKey][srcKey].resampledResponse![f][sampleArrayIndex] = sums[f];
                if (zeroIndices.length > 0) {
                  const lastValue = lastNonZeroPoint[f];
                  const nextValue = sums[f];
                  for (let z = 0; z < zeroIndices.length; z++) {
                    const value = lerp(lastValue, nextValue, (z + 1) / (zeroIndices.length + 1));
                    responseByIntensity[recKey][srcKey].resampledResponse![f][zeroIndices[z]] = value;
                  }
                }
                lastNonZeroPoint[f] = sums[f];
              }
              if (zeroIndices.length > 0) {
                zeroIndices = [] as number[];
              }

              seenFirstPointYet = true;
              sampleArrayIndex++;
              continue;
            }
          }
        }
        calculateT20(responseByIntensity, recKey, srcKey);
        calculateT30(responseByIntensity, recKey, srcKey);
        calculateT60(responseByIntensity, recKey, srcKey);
      }
    }

    // return the sample array
    return responseByIntensity;
  }

  // if reponse has not been calculated yet
  else {
    console.warn("no data yet");
  }
}

export function calculateT30(
  responseByIntensity: KVP<KVP<ResponseByIntensity>>,
  receiverId: string,
  sourceId: string
) {
  const recid = receiverId;
  const srcid = sourceId;
  const resampledResponse = responseByIntensity[recid][srcid].resampledResponse;
  const sampleRate = responseByIntensity[recid][srcid].sampleRate;

  if (resampledResponse && sampleRate) {
    const resampleTime = new Float32Array(resampledResponse[0].length);
    for (let i = 0; i < resampledResponse[0].length; i++) {
      resampleTime[i] = i / sampleRate;
    }

    responseByIntensity[recid][srcid].t30 = resampledResponse.map((resp) => {
      let i = 0;
      let val = resp[i];
      while (val === 0) {
        val = resp[i++];
      }
      for (let j = i; j >= 0; j--) {
        resp[j] = val;
      }
      const cutoffLevel = val - 30;
      const avg = movingAverage(resp, 2).filter((x) => x >= cutoffLevel);
      const len = avg.length;

      return linearRegression(resampleTime.slice(0, len), resp.slice(0, len));
    });
  }
}

export function calculateT20(
  responseByIntensity: KVP<KVP<ResponseByIntensity>>,
  receiverId: string,
  sourceId: string
) {
  const recid = receiverId;
  const srcid = sourceId;
  const resampledResponse = responseByIntensity[recid][srcid].resampledResponse;
  const sampleRate = responseByIntensity[recid][srcid].sampleRate;

  if (resampledResponse && sampleRate) {
    const resampleTime = new Float32Array(resampledResponse[0].length);
    for (let i = 0; i < resampledResponse[0].length; i++) {
      resampleTime[i] = i / sampleRate;
    }

    responseByIntensity[recid][srcid].t20 = resampledResponse.map((resp) => {
      let i = 0;
      let val = resp[i];
      while (val === 0) {
        val = resp[i++];
      }
      for (let j = i; j >= 0; j--) {
        resp[j] = val;
      }
      const cutoffLevel = val - 20;
      const avg = movingAverage(resp, 2).filter((x) => x >= cutoffLevel);
      const len = avg.length;

      return linearRegression(resampleTime.slice(0, len), resp.slice(0, len));
    });
  }
}

export function calculateT60(
  responseByIntensity: KVP<KVP<ResponseByIntensity>>,
  receiverId: string,
  sourceId: string
) {
  const recid = receiverId;
  const srcid = sourceId;
  const resampledResponse = responseByIntensity[recid][srcid].resampledResponse;
  const sampleRate = responseByIntensity[recid][srcid].sampleRate;

  if (resampledResponse && sampleRate) {
    const resampleTime = new Float32Array(resampledResponse[0].length);
    for (let i = 0; i < resampledResponse[0].length; i++) {
      resampleTime[i] = i / sampleRate;
    }

    responseByIntensity[recid][srcid].t60 = resampledResponse.map((resp) => {
      let i = 0;
      let val = resp[i];
      while (val === 0) {
        val = resp[i++];
      }
      for (let j = i; j >= 0; j--) {
        resp[j] = val;
      }
      const cutoffLevel = val - 60;
      const avg = movingAverage(resp, 2).filter((x) => x >= cutoffLevel);
      const len = avg.length;

      return linearRegression(resampleTime.slice(0, len), resp.slice(0, len));
    });
  }
}
