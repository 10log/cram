/**
 * Regression test for image source path occlusion validation.
 *
 * Bug: The occlusion check loop started at j = 1 instead of j = 0,
 * so the first surface in the room's surface list was never tested
 * for occlusion. Paths blocked by surface[0] were incorrectly
 * reported as valid.
 *
 * Fix: Change `let j = 1` to `let j = 0`.
 *
 * The isvalid() method requires Three.js Raycaster, Surface meshes,
 * and room geometry, making it impractical to instantiate in Jest.
 * This test scans the source to verify the loop starts at 0.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Image source isvalid occlusion check', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', 'index.ts'),
    'utf8'
  );

  it('occlusion loop in isvalid starts at j = 0, not j = 1', () => {
    // Extract the isvalid method body
    const isvalidBody = source.match(/isvalid\(room_surfaces[\s\S]*?return true;\s*\}/);
    expect(isvalidBody).not.toBeNull();

    // Find the inner loop over room_surfaces
    const loopMatch = isvalidBody![0].match(/for\s*\(\s*let\s+j\s*=\s*(\d+)\s*;\s*j\s*<\s*room_surfaces\.length/);
    expect(loopMatch).not.toBeNull();
    expect(loopMatch![1]).toBe('0');
  });
});
