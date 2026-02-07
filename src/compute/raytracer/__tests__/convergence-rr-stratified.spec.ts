/**
 * Source-scanning tests for Phase 7: convergence monitoring, Russian Roulette
 * termination, and stratified hemisphere sampling.
 *
 * These tests verify the source code has the expected structure without
 * needing to instantiate the full Three.js/WebGL environment.
 */

import * as fs from 'fs';
import * as path from 'path';

const source = fs.readFileSync(
  path.resolve(__dirname, '..', 'index.ts'),
  'utf8'
);

const typesSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'types.ts'),
  'utf8'
);

describe('Phase 7: Convergence, Russian Roulette, Stratified Sampling', () => {

  describe('7a: Convergence monitoring', () => {
    it('exports ConvergenceMetrics interface', () => {
      expect(typesSource).toMatch(/export\s+interface\s+ConvergenceMetrics/);
    });

    it('ConvergenceMetrics has required fields', () => {
      const match = typesSource.match(/export\s+interface\s+ConvergenceMetrics\s*\{([\s\S]*?)\}/);
      expect(match).not.toBeNull();
      const body = match![1];
      expect(body).toContain('totalRays: number');
      expect(body).toContain('validRays: number');
      expect(body).toContain('estimatedT30: number[]');
      expect(body).toContain('convergenceRatio: number');
    });

    it('convergenceThreshold property in defaults', () => {
      expect(typesSource).toMatch(/convergenceThreshold:\s*0\.01/);
    });

    it('autoStop property in defaults', () => {
      expect(typesSource).toMatch(/autoStop:\s*true/);
    });

    it('has _updateConvergenceMetrics method', () => {
      expect(source).toContain('_updateConvergenceMetrics()');
    });

    it('has _resetConvergenceState method', () => {
      expect(source).toContain('_resetConvergenceState()');
    });

    it('auto-stop checks convergenceRatio against convergenceThreshold', () => {
      expect(source).toContain('convergenceMetrics.convergenceRatio < this.convergenceThreshold');
    });

    it('convergence check respects autoStop flag', () => {
      expect(source).toContain('this.autoStop &&');
    });

    it('_updateConvergenceMetrics uses Schroeder backward integration', () => {
      // Should compute cumulative sum from end to start
      expect(source).toMatch(/schroeder\[b\]\s*=\s*schroeder\[b\s*\+\s*1\]\s*\+\s*histogram\[b\]/);
    });

    it('_updateConvergenceMetrics uses Welford online algorithm', () => {
      // Check for Welford's running mean update
      expect(source).toContain('oldMean + (val - oldMean) / n');
    });

    it('uses stable receiver selection via this.receiverIDs', () => {
      expect(source).toContain('this.receiverIDs');
      // Should not just use Object.keys()[0]
      const updateMethod = source.match(/_updateConvergenceMetrics\(\)\s*\{([\s\S]*?)\n\s{2}\}/);
      expect(updateMethod).not.toBeNull();
      expect(updateMethod![1]).toContain('this.receiverIDs');
    });

    it('uses linearRegression for T30 estimation', () => {
      const updateMethod = source.match(/_updateConvergenceMetrics\(\)\s*\{([\s\S]*?)\n\s{2}\}/);
      expect(updateMethod).not.toBeNull();
      expect(updateMethod![1]).toContain('linearRegression(times, levelsDb)');
    });

    it('skips bands with invalid T30 from convergence ratio', () => {
      expect(source).toContain('validBandCount');
      expect(source).toContain('validBandCount > 0 ? maxRatio : Infinity');
    });

    it('save() includes convergenceThreshold, autoStop, rrThreshold', () => {
      const saveMatch = source.match(/save\(\)\s*\{([\s\S]*?)\n\s{2}\}/);
      expect(saveMatch).not.toBeNull();
      expect(saveMatch![1]).toContain('convergenceThreshold');
      expect(saveMatch![1]).toContain('autoStop');
      expect(saveMatch![1]).toContain('rrThreshold');
    });

    it('RayTracerParams includes convergenceThreshold, autoStop, rrThreshold', () => {
      const paramsMatch = typesSource.match(/export\s+interface\s+RayTracerParams\s*\{([\s\S]*?)\}/);
      expect(paramsMatch).not.toBeNull();
      expect(paramsMatch![1]).toContain('convergenceThreshold');
      expect(paramsMatch![1]).toContain('autoStop');
      expect(paramsMatch![1]).toContain('rrThreshold');
    });

    it('start() resets convergence state', () => {
      const startMatch = source.match(/start\(\)\s*\{([\s\S]*?)startAllMonteCarlo/);
      expect(startMatch).not.toBeNull();
      expect(startMatch![1]).toContain('_resetConvergenceState');
    });

    it('manual stop still works (isRunning setter unchanged)', () => {
      expect(source).toMatch(/set\s+isRunning\(isRunning:\s*boolean\)/);
    });
  });

  describe('7b: Russian Roulette termination', () => {
    it('hard energy cutoff (1/2**16) is removed', () => {
      // The old threshold should not appear as a condition
      expect(source).not.toMatch(/Math\.max\(\.\.\.newBandEnergy\)\s*>\s*1\s*\/\s*2\s*\*\*\s*16/);
    });

    it('rrThreshold property in defaults', () => {
      expect(typesSource).toMatch(/rrThreshold:\s*0\.1/);
    });

    it('Russian Roulette uses survival probability', () => {
      expect(source).toContain('survivalProbability');
    });

    it('surviving rays are boosted by 1/survivalProbability', () => {
      expect(source).toContain('newBandEnergy[f] /= survivalProbability');
    });

    it('Russian Roulette terminates probabilistically', () => {
      expect(source).toContain('Math.random() > survivalProbability');
    });

    it('reflectionOrder limit preserved as safety bound', () => {
      expect(source).toContain('iter < order + 1');
    });

    it('RR termination returns energy and bandEnergy fields', () => {
      // The early termination return should include energy and bandEnergy
      // Find the RR termination block and check it returns a complete RayPath
      expect(source).toContain('rrEnergy');
      expect(source).toMatch(/return\s*\{[^}]*energy:\s*rrEnergy[^}]*bandEnergy:[^}]*\}\s*as\s*RayPath/);
    });
  });

  describe('7b: Russian Roulette unbiasedness', () => {
    it('expected value is preserved: E[boosted energy] = original energy', () => {
      // Run many trials with Russian Roulette
      const rrThreshold = 0.1;
      const N = 100000;
      const trueEnergy = 0.05; // below threshold

      let totalSurvived = 0;
      let totalBoostedEnergy = 0;

      for (let i = 0; i < N; i++) {
        const survivalProbability = trueEnergy / rrThreshold;
        if (Math.random() <= survivalProbability) {
          // Survived: boosted energy
          totalBoostedEnergy += trueEnergy / survivalProbability;
          totalSurvived++;
        }
        // Else: terminated, contributes 0
      }

      const meanBoostedEnergy = totalBoostedEnergy / N;
      // Expected value should equal true energy
      expect(meanBoostedEnergy).toBeCloseTo(trueEnergy, 1);

      // Survival rate should be approximately survivalProbability
      const expectedSurvivalRate = trueEnergy / rrThreshold;
      expect(totalSurvived / N).toBeCloseTo(expectedSurvivalRate, 1);
    });
  });

  describe('7c: Stratified hemisphere sampling', () => {
    it('has stepStratified method', () => {
      expect(source).toMatch(/stepStratified\(numRays:\s*number\)/);
    });

    it('stepStratified uses exact-divisor grid strata with jitter', () => {
      // Should find exact divisor for nPhi * nTheta === numRays
      expect(source).toContain('Math.floor(Math.sqrt(numRays))');
      expect(source).toContain('numRays % nPhi !== 0');
      // Should jitter within strata
      expect(source).toMatch(/\(si \+ Math\.random\(\)\)\s*\/\s*nPhi/);
      expect(source).toMatch(/\(sj \+ Math\.random\(\)\)\s*\/\s*nTheta/);
    });

    it('startAllMonteCarlo calls stepStratified instead of step loop', () => {
      const monteCarloMatch = source.match(/startAllMonteCarlo\(\)\s*\{([\s\S]*?)\n\s{2}\}/);
      expect(monteCarloMatch).not.toBeNull();
      expect(monteCarloMatch![1]).toContain('this.stepStratified(this.passes)');
      // Should NOT contain the old for loop calling step()
      expect(monteCarloMatch![1]).not.toMatch(/for\s*\(let\s+i\s*=\s*0.*this\.step\(\)/);
    });

    it('quickEstimateStep uses rejection sampling (no cube-normalized bias)', () => {
      // Should NOT contain the old biased cube-normalize pattern
      expect(source).not.toContain('new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()');
      // Should contain rejection sampling loop
      expect(source).toContain('rejection sampling for uniform sphere');
    });
  });

  describe('7c: Stratified sampling coverage', () => {
    it('stratified samples cover hemisphere more uniformly than random', () => {
      // Compare variance of angular coverage between pure random and stratified
      const N = 64; // rays per batch

      // Pure random: generate N random angles in [0, 2*PI] x [0, PI]
      const randomBins = new Array(16).fill(0);
      for (let i = 0; i < N; i++) {
        const phi = Math.random() * 2 * Math.PI;
        const bin = Math.floor((phi / (2 * Math.PI)) * 16);
        randomBins[Math.min(bin, 15)]++;
      }

      // Stratified: divide into exact grid and jitter
      let nPhi = Math.floor(Math.sqrt(N));
      while (nPhi > 1 && N % nPhi !== 0) nPhi--;
      const nTheta = N / nPhi;
      const stratBins = new Array(16).fill(0);
      for (let si = 0; si < nPhi; si++) {
        for (let sj = 0; sj < nTheta; sj++) {
          const phi = ((si + Math.random()) / nPhi) * 2 * Math.PI;
          const bin = Math.floor((phi / (2 * Math.PI)) * 16);
          stratBins[Math.min(bin, 15)]++;
        }
      }

      // Stratified should have lower variance in bin counts
      const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
      const variance = (arr: number[]) => {
        const m = mean(arr);
        return arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length;
      };

      // Run multiple trials to get stable comparison
      let randomVarianceSum = 0;
      let stratVarianceSum = 0;
      const trials = 100;

      for (let t = 0; t < trials; t++) {
        const rBins = new Array(16).fill(0);
        const sBins = new Array(16).fill(0);

        for (let i = 0; i < N; i++) {
          const phi = Math.random() * 2 * Math.PI;
          rBins[Math.floor((phi / (2 * Math.PI)) * 16) % 16]++;
        }
        let snPhi = Math.floor(Math.sqrt(N));
        while (snPhi > 1 && N % snPhi !== 0) snPhi--;
        const snTheta = N / snPhi;
        for (let si = 0; si < snPhi; si++) {
          for (let sj = 0; sj < snTheta; sj++) {
            const phi = ((si + Math.random()) / snPhi) * 2 * Math.PI;
            sBins[Math.floor((phi / (2 * Math.PI)) * 16) % 16]++;
          }
        }

        randomVarianceSum += variance(rBins);
        stratVarianceSum += variance(sBins);
      }

      // Stratified should have lower average variance
      expect(stratVarianceSum / trials).toBeLessThan(randomVarianceSum / trials);
    });
  });
});
