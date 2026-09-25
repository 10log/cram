import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { globalVars, removeGlobalVarsByUuid, addToGlobalVars } from '../global-vars';

// #89: window.vars is only seeded by the editor entry (src/index.tsx), so a
// RayTracer deleted before any run (or any use under the library entry) hit
// Object.keys(undefined) in dispose().
describe('global-vars (#89)', () => {
  beforeEach(() => {
    delete (window as any).vars;
  });

  it('globalVars creates window.vars when it is missing and reuses it after', () => {
    expect((window as any).vars).toBeUndefined();
    const v = globalVars();
    expect(v).toEqual({});
    expect((window as any).vars).toBe(v);
    expect(globalVars()).toBe(v);
  });

  it('globalVars keeps an existing window.vars', () => {
    const existing = { a: { uuid: 'x' } };
    (window as any).vars = existing;
    expect(globalVars()).toBe(existing);
  });

  it('removeGlobalVarsByUuid does not throw when window.vars was never created', () => {
    expect(() => removeGlobalVarsByUuid('solver-uuid')).not.toThrow();
  });

  it('removeGlobalVarsByUuid removes only entries with that uuid and skips null / uuid-less values', () => {
    (window as any).vars = {
      mine: { uuid: 'solver-uuid' },
      mineToo: { uuid: 'solver-uuid' },
      other: { uuid: 'other-uuid' },
      empty: null,
      plain: 42,
    };
    removeGlobalVarsByUuid('solver-uuid');
    expect(Object.keys((window as any).vars).sort()).toEqual(['empty', 'other', 'plain']);
  });

  it('addToGlobalVars works when window.vars was never created', () => {
    vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const obj = { uuid: 'u' };
    addToGlobalVars(obj, 'thing');
    expect(Object.values((window as any).vars)).toContain(obj);
  });

  it('RayTracer.dispose goes through removeGlobalVarsByUuid, not a raw window.vars walk', () => {
    const src = readFileSync(resolve(__dirname, '../../compute/raytracer/index.ts'), 'utf8');
    const body = src.slice(src.indexOf('  dispose() {'), src.indexOf('  addSource(source: Source)'));
    expect(body).toContain('removeGlobalVarsByUuid(this.uuid);');
    expect(src).not.toMatch(/window\.vars/);
    // The scene cleanup after it must still be reached.
    expect(body.indexOf('removeGlobalVarsByUuid')).toBeLessThan(body.indexOf('renderer.scene.remove(this.rays)'));
  });
});
