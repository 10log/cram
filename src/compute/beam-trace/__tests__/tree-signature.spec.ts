/**
 * Issue #104: beam tree was not rebuilt when room geometry or source identity changed.
 */
import * as fs from 'fs';
import * as path from 'path';
import { beamTreeSignature, BeamTreeInputs } from '../tree-signature';

const base: BeamTreeInputs = {
  sourceId: 'src-a',
  sourceX: 0,
  sourceY: 0,
  sourceZ: 0,
  roomID: 'room-1',
  maxOrder: 3,
  surfaceCount: 1,
  surfaceWorlds: [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ],
};

describe('beamTreeSignature', () => {
  test('identical inputs produce the same signature', () => {
    expect(beamTreeSignature(base)).toBe(beamTreeSignature({ ...base, surfaceWorlds: [...base.surfaceWorlds] }));
  });

  test('source identity change rebuilds even at the same coordinates', () => {
    expect(beamTreeSignature(base)).not.toBe(beamTreeSignature({ ...base, sourceId: 'src-b' }));
  });

  test('source translation rebuilds', () => {
    expect(beamTreeSignature(base)).not.toBe(beamTreeSignature({ ...base, sourceX: 1 }));
  });

  test('wall translation (matrixWorld) rebuilds', () => {
    const moved = [...base.surfaceWorlds];
    moved[12] = 2; // tx
    expect(beamTreeSignature(base)).not.toBe(beamTreeSignature({ ...base, surfaceWorlds: moved }));
  });

  test('adding/removing a surface rebuilds', () => {
    expect(beamTreeSignature(base)).not.toBe(beamTreeSignature({ ...base, surfaceCount: 2 }));
  });

  test('max order change rebuilds', () => {
    expect(beamTreeSignature(base)).not.toBe(beamTreeSignature({ ...base, maxOrder: 4 }));
  });

  test('listener position is not part of the signature', () => {
    // The type has no receiver field; this documents the contract.
    expect('receiver' in base).toBe(false);
    expect('listener' in base).toBe(false);
  });
});

describe('Issue #104: production wiring', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../index.ts'), 'utf-8');

  test('needsBeamTreeRebuild compares beamTreeSignature, not only source position', () => {
    const match = source.match(/needsBeamTreeRebuild\(\)[\s\S]*?^  \}/m);
    expect(match).not.toBeNull();
    expect(match![0]).toMatch(/currentTreeSignature/);
    expect(match![0]).not.toMatch(/_lastSourcePos/);
  });

  test('currentTreeSignature includes source.uuid and surface matrixWorld', () => {
    const match = source.match(/currentTreeSignature\(\)[\s\S]*?^  \}/m);
    expect(match).not.toBeNull();
    expect(match![0]).toMatch(/source\.uuid/);
    expect(match![0]).toMatch(/matrixWorld/);
    expect(match![0]).not.toMatch(/receiver\.position/);
  });
});
