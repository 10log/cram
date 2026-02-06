/**
 * Tests for FDTD 2D addWall y-coordinate clamping.
 *
 * Bug: y1 and y2 were clamped to `this.nx - 1` instead of `this.ny - 1`.
 * When the grid is non-square (nx != ny), walls near the top edge are
 * clipped to the wrong boundary.
 *
 * Fix: Change the y-coordinate clamp upper bound from `this.nx - 1` to `this.ny - 1`.
 */

import { clamp } from '../../../common/clamp';

describe('FDTD 2D addWall y-coordinate clamping', () => {
  describe('bug demonstration', () => {
    it('buggy version clips y to nx instead of ny on non-square grids', () => {
      const nx = 100;
      const ny = 200; // taller grid

      // A wall at y = 150 cells (within ny=200 bounds)
      // Buggy: clamp to nx - 1 = 99
      const buggyY = clamp(150, 0, nx - 1);
      expect(buggyY).toBe(99); // incorrectly clipped!

      // Fixed: clamp to ny - 1 = 199
      const fixedY = clamp(150, 0, ny - 1);
      expect(fixedY).toBe(150); // correctly preserved
    });

    it('bug has no effect on square grids (nx === ny)', () => {
      const nx = 256;
      const ny = 256;

      const rawY = 200;

      // Both produce the same result when nx === ny
      const buggyY = clamp(rawY, 0, nx - 1);
      const fixedY = clamp(rawY, 0, ny - 1);

      expect(buggyY).toBe(fixedY);
    });

    it('bug causes wall to be placed at wrong position on wide grids', () => {
      const nx = 300; // wider grid
      const ny = 100;

      // On a wide grid (nx > ny), the buggy version allows y > ny-1
      // This could cause out-of-bounds texture access
      const rawYLarge = 250; // within nx range but outside ny range

      // Buggy: allows y = 250 (nx-1 = 299), but ny-1 = 99
      const buggyY = clamp(rawYLarge, 0, nx - 1);
      expect(buggyY).toBe(250); // exceeds ny bounds!

      // Fixed: clamps y to ny-1 = 99
      const fixedY = clamp(rawYLarge, 0, ny - 1);
      expect(fixedY).toBe(99); // correctly clamped
    });
  });

  describe('x-coordinates are correctly clamped (unchanged)', () => {
    it('x values clamp to nx - 1', () => {
      const nx = 256;

      expect(clamp(300, 0, nx - 1)).toBe(255);
      expect(clamp(0, 0, nx - 1)).toBe(0);
      expect(clamp(100, 0, nx - 1)).toBe(100);
    });
  });

  describe('source code verification', () => {
    it('y1 and y2 use ny, not nx, as the upper bound', () => {
      const fs = require('fs');
      const path = require('path');

      const sourceFile = fs.readFileSync(
        path.resolve(__dirname, '..', 'index.ts'),
        'utf8'
      );

      // Find the addWall method and check y-coordinate clamping
      const addWallSection = sourceFile.match(/addWall\(props[\s\S]*?this\.walls\.push/);
      expect(addWallSection).not.toBeNull();

      const section = addWallSection![0];

      // y1 and y2 should reference this.ny, not this.nx
      const y1Match = section.match(/const y1 = clamp\([^,]+,\s*0,\s*this\.(n[xy])\s*-\s*1\)/);
      const y2Match = section.match(/const y2 = clamp\([^,]+,\s*0,\s*this\.(n[xy])\s*-\s*1\)/);

      expect(y1Match).not.toBeNull();
      expect(y2Match).not.toBeNull();
      expect(y1Match![1]).toBe('ny');
      expect(y2Match![1]).toBe('ny');

      // x1 and x2 should still reference this.nx
      const x1Match = section.match(/const x1 = clamp\([^,]+,\s*0,\s*this\.(n[xy])\s*-\s*1\)/);
      const x2Match = section.match(/const x2 = clamp\([^,]+,\s*0,\s*this\.(n[xy])\s*-\s*1\)/);

      expect(x1Match).not.toBeNull();
      expect(x2Match).not.toBeNull();
      expect(x1Match![1]).toBe('nx');
      expect(x2Match![1]).toBe('nx');
    });
  });
});
