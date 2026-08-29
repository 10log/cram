/**
 * Issue #105: dispose() leaked the quick-estimate interval and highlight GPU resources.
 */
import * as fs from 'fs';
import * as path from 'path';

describe('Issue #105: BeamTraceSolver.dispose', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../index.ts'), 'utf-8');

  function method(name: string): string {
    const match = source.match(new RegExp(`${name}\\([^)]*\\)\\s*\\{[\\s\\S]*?^\\s{2}\\}`, 'm'));
    expect(match).not.toBeNull();
    return match![0];
  }

  test('dispose calls reset (stops the quick-estimate interval)', () => {
    const body = method('dispose');
    expect(body).toMatch(/this\.reset\(\)/);
  });

  test('reset clears the quick-estimate interval', () => {
    const body = method('reset');
    expect(body).toMatch(/clearInterval\(this\._quickEstimateInterval\)/);
  });

  test('dispose disposes selectedPath geometry and material', () => {
    const body = method('dispose');
    expect(body).toMatch(/selectedPath\.geometry\?\.dispose/);
    expect(body).toMatch(/material\.dispose\(\)/);
  });

  test('reset is safe to call twice (idempotent interval clear)', () => {
    const body = method('reset');
    expect(body).toMatch(/_quickEstimateInterval !== null/);
    expect(body).toMatch(/_quickEstimateInterval = null/);
  });
});
