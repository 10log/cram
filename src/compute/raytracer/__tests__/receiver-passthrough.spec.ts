/**
 * Issue #234: a ray passes through receivers. Every crossing is an arrival,
 * and the ray carries on to the wall behind them.
 *
 * Real `traceRay`, real three.js raycasting. The wall is duck-typed as in
 * `rt60-cross-check.spec.ts`, since `traceRay` only needs its
 * `reflectionFunction`, `scatteringFunction` and `uuid`.
 */

import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { traceRay } from "../ray-core";
import type { RayPath } from "../types";

/** A receiver sphere of radius `r` at `x` on the x axis, as the solver marks one. */
function receiver(x: number, r = 0.5): THREE.Object3D {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(r, 32, 16),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
  );
  mesh.userData.kind = "receiver";
  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(x, 0, 0);
  group.updateMatrixWorld(true);
  return group;
}

/** A fully absorbing wall across the x axis at `x`, facing back along it. */
function absorbingWall(x: number): THREE.Object3D {
  const geometry = new THREE.PlaneGeometry(10, 10);
  geometry.rotateY(-Math.PI / 2); // normal to −x
  geometry.translate(x, 0, 0);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
  const group = new THREE.Group() as THREE.Group & Record<string, unknown>;
  group.add(mesh);
  group.reflectionFunction = () => 0;
  group.scatteringFunction = () => 0;
  group.updateMatrixWorld(true);
  return group;
}

function shootAlongX(objects: THREE.Object3D[], arrivals?: RayPath[]) {
  return traceRay(
    new THREE.Raycaster(),
    objects,
    [1000],
    [0],
    1e-12,
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0, 0),
    10,
    [1],
    "source",
    0,
    0,
    1,
    [],
    arrivals,
  );
}

const total = (path: RayPath) => path.chain.reduce((sum, hop) => sum + (hop.distance ?? 0), 0);

describe("Issue #234: rays pass through receivers", () => {
  const near = receiver(3);
  const far = receiver(6);
  const wall = absorbingWall(10);

  it("records every receiver it crosses, in order, and carries on to the wall", () => {
    const arrivals: RayPath[] = [];
    const path = shootAlongX([far, wall, near], arrivals);

    expect(arrivals).toHaveLength(2);
    expect(arrivals.map((a) => a.chain[a.chain.length - 1].object)).toEqual([near.uuid, far.uuid]);
    // Each at its sphere's near surface, measured from the source.
    expect(total(arrivals[0])).toBeCloseTo(2.5, 6);
    expect(total(arrivals[1])).toBeCloseTo(5.5, 6);
    for (const a of arrivals) {
      expect(a.intersectedReceiver).toBe(true);
      expect(a.bandEnergy).toEqual([1]);
    }
    // The ray's own path ended on the wall behind them, not on a receiver.
    expect(path).toBeDefined();
    expect(path!.intersectedReceiver).toBe(false);
    expect(path!.chain.map((hop) => hop.object)).toEqual([wall.uuid]);
    expect(total(path!)).toBeCloseTo(10, 6);
  });

  it("counts a double-sided sphere's entry and exit as one crossing", () => {
    const arrivals: RayPath[] = [];
    shootAlongX([near, wall], arrivals);
    expect(arrivals).toHaveLength(1);
  });

  it("gives each arrival its own chain, unchanged by the ray carrying on", () => {
    const arrivals: RayPath[] = [];
    shootAlongX([near, far, wall], arrivals);
    expect(arrivals[0].chain).toHaveLength(1);
    expect(arrivals[1].chain).toHaveLength(1);
    expect(arrivals[0].chain).not.toBe(arrivals[1].chain);
  });

  it("still records a crossing when the ray then leaves the model", () => {
    const arrivals: RayPath[] = [];
    const path = shootAlongX([near], arrivals);
    expect(path).toBeUndefined();
    expect(arrivals).toHaveLength(1);
  });

  it("without a collector, ends at the first receiver as before", () => {
    const path = shootAlongX([near, far, wall]);
    expect(path!.intersectedReceiver).toBe(true);
    expect(path!.chain[path!.chain.length - 1].object).toBe(near.uuid);
    expect(total(path!)).toBeCloseTo(2.5, 6);
  });
});
