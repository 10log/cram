import { DirectionalResponse } from '../directional-response';
import { Response } from '../response';

describe('DirectionalResponse', () => {
  describe('constructor', () => {
    it('creates responses for each direction', () => {
      const dr = new DirectionalResponse(5, 100);
      expect(dr.n).toBe(5);
      expect(dr.responses.length).toBe(5);
    });

    it('each response has correct length', () => {
      const dr = new DirectionalResponse(3, 50);
      for (const r of dr.responses) {
        expect(r.buffer.length).toBe(50);
      }
    });
  });

  describe('clear', () => {
    it('zeros all responses', () => {
      const dr = new DirectionalResponse(3, 10);
      dr.responses[0].buffer[0] = 5;
      dr.responses[1].buffer[3] = 7;
      dr.clear();
      expect(dr.sum()).toBe(0);
    });
  });

  describe('sum', () => {
    it('returns sum across all directions', () => {
      const dr = new DirectionalResponse(2, 3);
      dr.responses[0].buffer[0] = 1;
      dr.responses[0].buffer[1] = 2;
      dr.responses[1].buffer[0] = 3;
      expect(dr.sum()).toBe(6);
    });

    it('returns 0 for empty response', () => {
      const dr = new DirectionalResponse(4, 10);
      expect(dr.sum()).toBe(0);
    });
  });

  describe('delayMultiplyAdd', () => {
    it('distributes source across directions with per-direction weights', () => {
      const dr = new DirectionalResponse(3, 10);
      const src = new Response(2);
      src.buffer[0] = 1;
      src.buffer[1] = 1;

      const weights = [0.5, 0.3, 0.2];
      dr.delayMultiplyAdd(src, 0, weights, 1.0);

      expect(dr.responses[0].buffer[0]).toBeCloseTo(0.5);
      expect(dr.responses[1].buffer[0]).toBeCloseTo(0.3);
      expect(dr.responses[2].buffer[0]).toBeCloseTo(0.2);
    });

    it('applies constant scaler', () => {
      const dr = new DirectionalResponse(2, 5);
      const src = new Response(1);
      src.buffer[0] = 1;

      const weights = [1.0, 1.0];
      dr.delayMultiplyAdd(src, 0, weights, 0.5);

      expect(dr.responses[0].buffer[0]).toBeCloseTo(0.5);
      expect(dr.responses[1].buffer[0]).toBeCloseTo(0.5);
    });
  });

  describe('accumulateFrom', () => {
    it('sums source direction responses into buffer[0]', () => {
      const src = new DirectionalResponse(2, 5);
      src.responses[0].buffer[0] = 1;
      src.responses[0].buffer[1] = 2;
      src.responses[1].buffer[0] = 3;
      src.responses[1].buffer[1] = 4;

      const dst = new DirectionalResponse(2, 5);
      dst.accumulateFrom(src);

      expect(dst.responses[0].buffer[0]).toBe(3); // 1 + 2
      expect(dst.responses[1].buffer[0]).toBe(7); // 3 + 4
    });
  });
});
