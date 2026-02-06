/**
 * Source-scanning tests for frequency-dependent scattering in the ray tracer.
 *
 * Phase 3 replaces the scalar _scatteringCoefficient with energy-weighted
 * broadband scattering derived from surface.scatteringFunction(). These tests
 * verify the source code has the expected structure without needing to
 * instantiate the full Three.js/WebGL environment.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('frequency-dependent scattering', () => {
  const raytracerSource = fs.readFileSync(
    path.resolve(__dirname, '..', 'index.ts'),
    'utf8'
  );

  const surfaceSource = fs.readFileSync(
    path.resolve(__dirname, '..', '..', '..', 'objects', 'surface.ts'),
    'utf8'
  );

  const materialSource = fs.readFileSync(
    path.resolve(__dirname, '..', '..', '..', 'db', 'acoustic-material.ts'),
    'utf8'
  );

  describe('traceRay', () => {
    it('uses surface.scatteringFunction( not _scatteringCoefficient', () => {
      // Extract the traceRay method body
      const traceRayMatch = raytracerSource.match(/traceRay\(([\s\S]*?)\)\s*\{([\s\S]*?)^\s{2}\}/m);
      expect(traceRayMatch).not.toBeNull();
      const traceRayBody = traceRayMatch![0];

      // Should use surface.scatteringFunction(, not _scatteringCoefficient
      expect(traceRayBody).toContain('surface.scatteringFunction(');
      expect(traceRayBody).not.toContain('_scatteringCoefficient');
    });

    it('derives scatterCoeffs from this.frequencies', () => {
      expect(raytracerSource).toContain(
        'this.frequencies.map(f => surface.scatteringFunction(f))'
      );
    });

    it('computes energy-weighted broadband scattering', () => {
      // Verify energy weighting: scatterCoeffs[f] * bandEnergy[f]
      expect(raytracerSource).toContain('scatterCoeffs[f] * (bandEnergy[f] || 0)');
      // Verify division by total energy
      expect(raytracerSource).toContain('broadbandScattering /= totalEnergy');
    });
  });

  describe('BRDF construction', () => {
    it('uses this.scatteringFunction(freq) not hardcoded 0.1 in init()', () => {
      // Find the init method — look for the BRDF construction in init
      // The init method sets up scatteringCoefficient before BRDF
      const brdfBlocks = surfaceSource.match(/new BRDF\(\{[\s\S]*?\}\)/g);
      expect(brdfBlocks).not.toBeNull();

      // All BRDF constructions should use scatteringFunction, not 0.1
      brdfBlocks!.forEach(block => {
        expect(block).toContain('this.scatteringFunction(freq)');
        expect(block).not.toContain('diffusionCoefficient: 0.1');
      });
    });

    it('does not contain any hardcoded diffusionCoefficient: 0.1', () => {
      expect(surfaceSource).not.toContain('diffusionCoefficient: 0.1');
    });
  });

  describe('calculateWithDiffuse', () => {
    it('uses surface.scatteringFunction(frequency) not hardcoded 0.1', () => {
      // Find the calculateWithDiffuse method body
      const methodStart = raytracerSource.indexOf('calculateWithDiffuse');
      expect(methodStart).toBeGreaterThan(-1);

      // Extract a generous chunk of the method containing scatteredEnergy call
      const methodChunk = raytracerSource.slice(methodStart, methodStart + 3000);

      // Find the scatteredEnergy call within the method
      const scatteredEnergyMatch = methodChunk.match(/scatteredEnergy\(([\s\S]*?)\)\s*\n/);
      expect(scatteredEnergyMatch).not.toBeNull();

      // The scatteredEnergy call should use surface.scatteringFunction(frequency)
      expect(scatteredEnergyMatch![1]).toContain('surface.scatteringFunction(frequency)');
      expect(scatteredEnergyMatch![1]).not.toMatch(/\b0\.1\b/);
    });
  });

  describe('AcousticMaterial interface', () => {
    it('includes optional scattering field', () => {
      expect(materialSource).toContain('scattering?');
    });
  });
});
