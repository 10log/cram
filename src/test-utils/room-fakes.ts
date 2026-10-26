/**
 * Light stand-ins for Surface and Room, for testing the geometry adapter.
 *
 * The real Surface reaches csg, BRDF, the store and the renderer, so mocking it
 * out properly costs more than it proves. These fakes keep the behaviour the
 * adapter actually depends on — in-place `init`, self-detaching `dispose`,
 * `allSurfaces`, and `userData` — and nothing else.
 *
 * Lives in test-utils rather than a `__tests__` folder so vitest does not try
 * to collect it as a suite.
 */

import type * as THREE from 'three';

let surfaceCounter = 0;

export function resetSurfaceCounter(): void {
  surfaceCounter = 0;
}

export interface FakeSurfaceProps {
  geometry: THREE.BufferGeometry;
  acousticMaterial: unknown;
}

export class FakeSurface {
  uuid = `surface-${++surfaceCounter}`;
  name: string;
  userData: Record<string, unknown> = {};
  geometry: THREE.BufferGeometry;
  acousticMaterial: unknown;
  initCalls: FakeSurfaceProps[] = [];
  disposed = false;
  parent: { remove(s: FakeSurface): void } | null = null;

  constructor(name: string, props?: FakeSurfaceProps) {
    this.name = name;
    this.geometry = props!.geometry;
    this.acousticMaterial = props!.acousticMaterial;
  }

  init(props: FakeSurfaceProps) {
    this.initCalls.push(props);
    this.geometry = props.geometry;
    this.acousticMaterial = props.acousticMaterial;
  }

  /** Mirrors the real Surface, which detaches itself from its parent. */
  dispose() {
    this.disposed = true;
    this.parent?.remove(this);
  }
}

export class FakeSurfaceChildren {
  children: FakeSurface[] = [];

  add(s: FakeSurface) {
    s.parent = this;
    this.children.push(s);
  }

  remove(s: FakeSurface) {
    this.children = this.children.filter((c) => c !== s);
  }
}

export class FakeRoom {
  name: string;
  uuid = `room-${Math.random().toString(36).slice(2)}`;
  userData: Record<string, unknown> = {};
  surfaces = new FakeSurfaceChildren();
  surfaceMap: Record<string, FakeSurface> = {};
  derivedRefreshCount = 0;

  constructor(name: string, props?: { surfaces: FakeSurface[] }) {
    this.name = name;
    for (const s of props?.surfaces ?? []) this.surfaces.add(s);
  }

  get allSurfaces() {
    return this.surfaces.children;
  }

  /** Mirrors the real Room, which caches fields derived from its surfaces. */
  refreshDerivedGeometry() {
    this.derivedRefreshCount += 1;
    this.surfaceMap = Object.fromEntries(this.allSurfaces.map((s) => [s.uuid, s]));
  }

  /** Find a surface by the face id the adapter tagged it with. */
  byFaceId(key: string, id: string): FakeSurface | undefined {
    return this.allSurfaces.find((s) => s.userData[key] === id);
  }
}
