/**
 * Issue #103: calculate() mixed every receiver into one IR and ignored extra sources.
 * Active-pair policy: warn and use sourceIDs[0] / receiverIDs[0] only.
 */
import * as fs from 'fs';
import * as path from 'path';

describe('Issue #103: beam-trace active source/receiver pair', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../index.ts'), 'utf-8');

  function method(name: string): string {
    const match = source.match(new RegExp(`${name}\\([^)]*\\)\\s*\\{[\\s\\S]*?^\\s{2}\\}`, 'm'));
    expect(match).not.toBeNull();
    return match![0];
  }

  test('calculate warns when extra sources or receivers are selected', () => {
    const body = method('calculate');
    expect(body).toMatch(/sources selected; using only the first/);
    expect(body).toMatch(/receivers selected; using only the first/);
  });

  test('calculate traces one receiver, not receiverIDs.forEach', () => {
    const body = method('calculate');
    expect(body).toMatch(/this\.receiverIDs\[0\]/);
    expect(body).not.toMatch(/receiverIDs\.forEach/);
  });

  test('diffraction maps only the active source and receiver', () => {
    const body = method('_computeDiffractionPaths');
    expect(body).toMatch(/this\.sourceIDs\[0\]/);
    expect(body).toMatch(/this\.receiverIDs\[0\]/);
    expect(body).not.toMatch(/for \(const id of this\.sourceIDs\)/);
    expect(body).not.toMatch(/for \(const id of this\.receiverIDs\)/);
  });

  test('lastMetrics is assigned once, not inside a receiver loop', () => {
    const body = method('calculate');
    const assignments = body.match(/this\.lastMetrics\s*=/g) ?? [];
    expect(assignments.length).toBe(1);
  });
});
