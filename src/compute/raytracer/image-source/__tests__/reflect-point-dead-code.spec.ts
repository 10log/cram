/**
 * @jest-environment jsdom
 *
 * Issue #42: Remove dead code in reflectPointAcrossSurface
 *
 * The function computed a normal via cross product of surface vertices
 * (stored in normal_calc) but never used it. Instead, surface.normal was
 * used for the actual reflection. The dead computation was confusing and
 * wasted CPU cycles. This fix removes the unused vertex-based normal
 * calculation while preserving the a_global point needed for the plane
 * distance computation.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Issue #42: Remove dead code in reflectPointAcrossSurface', () => {
  const filePath = path.resolve(__dirname, '../index.ts');
  const source = fs.readFileSync(filePath, 'utf-8');

  // Extract the function body
  const funcMatch = source.match(
    /function reflectPointAcrossSurface\([\s\S]*?\n\}/
  );

  test('reflectPointAcrossSurface function exists', () => {
    expect(funcMatch).not.toBeNull();
  });

  test('does not contain unused normal_calc variable', () => {
    const funcBody = funcMatch![0];
    expect(funcBody).not.toContain('normal_calc');
  });

  test('does not contain unused b and c vertex extraction', () => {
    const funcBody = funcMatch![0];
    // Should not extract vertices[1] or vertices[2]
    expect(funcBody).not.toContain('vertices[1]');
    expect(funcBody).not.toContain('vertices[2]');
    // Should not have b_global or c_global
    expect(funcBody).not.toContain('b_global');
    expect(funcBody).not.toContain('c_global');
  });

  test('does not contain cross product computation', () => {
    const funcBody = funcMatch![0];
    expect(funcBody).not.toContain('.cross(');
  });

  test('preserves a_global (needed for plane distance d)', () => {
    const funcBody = funcMatch![0];
    expect(funcBody).toContain('a_global');
    expect(funcBody).toContain('localToWorld');
  });

  test('uses surface.normal for the reflection', () => {
    const funcBody = funcMatch![0];
    expect(funcBody).toContain('surface.normal.clone()');
  });

  test('preserves complete reflection math (d, u, v, mirror)', () => {
    const funcBody = funcMatch![0];
    // Plane distance
    expect(funcBody).toContain('a_global.dot(negnormal)');
    // Projection
    expect(funcBody).toContain('point.dot(normal)');
    // Mirror computation
    expect(funcBody).toContain('mirror');
    expect(funcBody).toContain('return mirror');
  });

  test('does not contain the TODO comment about surface class changes', () => {
    const funcBody = funcMatch![0];
    expect(funcBody).not.toContain('TODO');
  });
});
