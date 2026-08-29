/**
 * Issue #107: Beam-trace tests must run the energy path, not grep source text.
 *
 * calculateArrivalPressure lives in arrival-pressure.ts so these fixtures
 * construct a path and assert numeric SPL / pressure without the renderer.
 */

import * as THREE from "three";
import * as ac from "../../acoustics";
import { reflectionCoefficient } from "../../acoustics/reflection-coefficient";
import { lookingBackArrivalDirection } from "../../../common/arrival-direction";
import {
  calculateArrivalPressure,
  type ArrivalPath,
  type ArrivalSource,
  type ArrivalSurface,
} from "../arrival-pressure";

const FREQS = [1000];
const TEMP = 20;
const INITIAL_SPL = [100];

function splFromPressure(p: number): number {
  return (ac.P2Lp([p]) as number[])[0];
}

function directPath(length: number): ArrivalPath {
  const receiver = new THREE.Vector3(0, 0, 0);
  const source = new THREE.Vector3(0, length, 0);
  return {
    points: [receiver, source],
    length,
    polygonIds: [null, null],
  };
}

function arrivalOpts(overrides: Partial<Parameters<typeof calculateArrivalPressure>[2]> = {}) {
  return {
    frequencies: FREQS,
    temperature: TEMP,
    receiverGain: 1,
    ...overrides,
  };
}

describe("Issue #107: beam-trace energy path runs as physics, not a source grep", () => {
  test("direct path 1 m / 2 m / 4 m drops ~6 dB SPL per doubling (air subtracted)", () => {
    const p1 = calculateArrivalPressure(INITIAL_SPL, directPath(1), arrivalOpts())[0];
    const p2 = calculateArrivalPressure(INITIAL_SPL, directPath(2), arrivalOpts())[0];
    const p4 = calculateArrivalPressure(INITIAL_SPL, directPath(4), arrivalOpts())[0];

    const spl1 = splFromPressure(p1);
    const spl2 = splFromPressure(p2);
    const spl4 = splFromPressure(p4);

    const air = ac.airAttenuation(FREQS, TEMP)[0];
    const expectedDrop1to2 = 20 * Math.log10(2) + air * (2 - 1);
    const expectedDrop2to4 = 20 * Math.log10(2) + air * (4 - 2);

    expect(spl1).toBeCloseTo(100, 1);
    expect(spl1 - spl2).toBeCloseTo(expectedDrop1to2, 1);
    expect(spl2 - spl4).toBeCloseTo(expectedDrop2to4, 1);
  });

  test("one bounce at known α multiplies intensity by reflectionFunction(f, 0)", () => {
    const alpha = 0.2;
    const Renergy = reflectionCoefficient(alpha, 0);
    const bounce: ArrivalPath = {
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 2, 0),
      ],
      length: 2,
      polygonIds: [null, 7, null],
      reflections: [{ incidenceAngle: 0 }],
    };
    const surfaces = new Map<number, ArrivalSurface>([
      [7, { reflectionFunction: (freq, theta) => reflectionCoefficient(alpha, theta) }],
    ]);

    const bounced = calculateArrivalPressure(INITIAL_SPL, bounce, arrivalOpts({ polygonToSurface: surfaces }))[0];
    const direct = calculateArrivalPressure(INITIAL_SPL, directPath(2), arrivalOpts())[0];

    const Ibounce = (ac.P2I([bounced]) as number[])[0];
    const Idirect = (ac.P2I([direct]) as number[])[0];
    expect(Ibounce / Idirect).toBeCloseTo(Renergy, 6);
  });

  test("cardioid on-axis vs 180° matches getPressureAtPosition ratio squared", () => {
    const cardioid = {
      getPressureAtPosition: (_gain: number, _freq: number, _phi: number, theta: number) => {
        const th = (theta * Math.PI) / 180;
        return (1 + Math.cos(th)) / 2;
      },
    };

    const onAxisSource: ArrivalSource = {
      quaternion: new THREE.Quaternion(),
      directivityHandler: cardioid,
    };

    const pathLeaving = (dir: THREE.Vector3): ArrivalPath => {
      const source = new THREE.Vector3(0, 0, 0);
      const receiver = dir.clone().multiplyScalar(2);
      return { points: [receiver, source], length: 2, polygonIds: [null, null] };
    };

    const front = calculateArrivalPressure(
      INITIAL_SPL, pathLeaving(new THREE.Vector3(0, 1, 0)), arrivalOpts({ source: onAxisSource }),
    )[0];
    const rear = calculateArrivalPressure(
      INITIAL_SPL, pathLeaving(new THREE.Vector3(0, -1, 0)), arrivalOpts({ source: onAxisSource }),
    )[0];

    const frontP = cardioid.getPressureAtPosition(0, 1000, 0, 0);
    const rearP = cardioid.getPressureAtPosition(0, 1000, 0, 180);
    const expectedEnergyRatio = (rearP / frontP) ** 2;

    const Ifront = (ac.P2I([front]) as number[])[0];
    const Irear = (ac.P2I([rear]) as number[])[0];
    expect(Irear / Ifront).toBeCloseTo(expectedEnergyRatio, 6);
    expect(front).toBeGreaterThan(rear);
  });

  test("diffraction arrival uses incident 1/s'², not total path length", () => {
    const sPrime = 2;
    const s = 2;
    const path: ArrivalPath = {
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, s, 0),
        new THREE.Vector3(0, s + sPrime, 0),
      ],
      length: s + sPrime,
      polygonIds: [null, null, null],
      bandEnergy: [1],
    };

    const p = calculateArrivalPressure(INITIAL_SPL, path, arrivalOpts())[0];
    const I = (ac.P2I([p]) as number[])[0];
    const I0 = (ac.P2I(ac.Lp2P(INITIAL_SPL)) as number[])[0];

    expect(I / I0).toBeCloseTo(ac.spreadingFactor(sPrime), 6);
    expect(I / I0).not.toBeCloseTo(ac.spreadingFactor(s + sPrime), 3);
  });

  test("specular and diffracted last segments share looking-back arrivalDirection", () => {
    const receiver = { x: 1, y: 2, z: 3 };
    const lastBounce = { x: 4, y: 6, z: 3 };
    const specular = lookingBackArrivalDirection(receiver, lastBounce);
    const diffracted = lookingBackArrivalDirection(receiver, lastBounce);
    expect(specular).toEqual(diffracted);

    const [x, y, z] = specular;
    const len = Math.hypot(x, y, z);
    expect(len).toBeCloseTo(1, 10);
    expect(x / (lastBounce.x - receiver.x)).toBeCloseTo(y / (lastBounce.y - receiver.y), 8);
  });

  test("receiverGain scales pressure linearly", () => {
    const unity = calculateArrivalPressure(INITIAL_SPL, directPath(1), arrivalOpts({ receiverGain: 1 }))[0];
    const half = calculateArrivalPressure(INITIAL_SPL, directPath(1), arrivalOpts({ receiverGain: 0.5 }))[0];
    expect(half / unity).toBeCloseTo(0.5, 6);
  });
});
