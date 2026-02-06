import { Response } from '../response';

describe('Response', () => {
  describe('constructor', () => {
    it('creates a buffer of given length', () => {
      const r = new Response(100);
      expect(r.buffer.length).toBe(100);
    });

    it('initializes buffer to zeros', () => {
      const r = new Response(10);
      for (let i = 0; i < 10; i++) {
        expect(r.buffer[i]).toBe(0);
      }
    });
  });

  describe('clear', () => {
    it('fills buffer with zeros', () => {
      const r = new Response(5);
      r.buffer[0] = 1;
      r.buffer[2] = 3;
      r.clear();
      for (let i = 0; i < 5; i++) {
        expect(r.buffer[i]).toBe(0);
      }
    });

    it('clears a sub-range', () => {
      const r = new Response(5);
      r.buffer.fill(1);
      r.clear(1, 3);
      expect(r.buffer[0]).toBe(1);
      expect(r.buffer[1]).toBe(0);
      expect(r.buffer[2]).toBe(0);
      expect(r.buffer[3]).toBe(1);
    });
  });

  describe('extend', () => {
    it('grows buffer preserving existing data', () => {
      const r = new Response(3);
      r.buffer[0] = 1;
      r.buffer[1] = 2;
      r.buffer[2] = 3;
      r.extend(6);
      expect(r.buffer.length).toBe(6);
      expect(r.buffer[0]).toBe(1);
      expect(r.buffer[1]).toBe(2);
      expect(r.buffer[2]).toBe(3);
      expect(r.buffer[3]).toBe(0);
    });
  });

  describe('sum', () => {
    it('returns sum of all samples', () => {
      const r = new Response(4);
      r.buffer[0] = 1;
      r.buffer[1] = 2;
      r.buffer[2] = 3;
      r.buffer[3] = 4;
      expect(r.sum()).toBe(10);
    });

    it('returns 0 for empty response', () => {
      const r = new Response(5);
      expect(r.sum()).toBe(0);
    });
  });

  describe('delayMultiplyAdd', () => {
    it('adds delayed and scaled source', () => {
      const dst = new Response(10);
      const src = new Response(3);
      src.buffer[0] = 1;
      src.buffer[1] = 2;
      src.buffer[2] = 3;

      dst.delayMultiplyAdd(src, 2, 0.5);

      expect(dst.buffer[0]).toBe(0);
      expect(dst.buffer[1]).toBe(0);
      expect(dst.buffer[2]).toBeCloseTo(0.5);
      expect(dst.buffer[3]).toBeCloseTo(1.0);
      expect(dst.buffer[4]).toBeCloseTo(1.5);
    });

    it('extends buffer if delay + source exceeds length', () => {
      const dst = new Response(2);
      const src = new Response(3);
      src.buffer[0] = 1;
      src.buffer[1] = 1;
      src.buffer[2] = 1;

      dst.delayMultiplyAdd(src, 5, 1.0);

      expect(dst.buffer.length).toBe(8);
      expect(dst.buffer[5]).toBe(1);
      expect(dst.buffer[6]).toBe(1);
      expect(dst.buffer[7]).toBe(1);
    });

    it('accumulates multiple additions', () => {
      const dst = new Response(5);
      const src = new Response(2);
      src.buffer[0] = 1;
      src.buffer[1] = 1;

      dst.delayMultiplyAdd(src, 0, 1.0);
      dst.delayMultiplyAdd(src, 0, 2.0);

      expect(dst.buffer[0]).toBeCloseTo(3.0);
      expect(dst.buffer[1]).toBeCloseTo(3.0);
    });
  });
});
