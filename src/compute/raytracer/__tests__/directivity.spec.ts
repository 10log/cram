/**
 * Source-scanning tests for source directivity at ray launch and receiver directivity.
 *
 * Phase 5 applies source directivity at ray launch time (via initialBandEnergy)
 * and adds receiver directivity support with standard microphone polar patterns.
 * These tests verify the source code has the expected structure without
 * needing to instantiate the full Three.js/WebGL environment.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('source directivity at ray launch', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', 'index.ts'),
    'utf8'
  );

  const impulseResponseSource = fs.readFileSync(
    path.resolve(__dirname, '..', 'impulse-response.ts'),
    'utf8'
  );

  it('step() uses sourceDH to compute initialBandEnergy per frequency band', () => {
    // Should call getPressureAtPosition for directivity weighting
    expect(source).toContain('sourceDH.getPressureAtPosition(0, this.frequencies[f], phi, theta)');
    // Should compute on-axis reference
    expect(source).toContain('sourceDH.getPressureAtPosition(0, this.frequencies[f], 0, 0)');
    // Should compute ratio squared for energy weighting
    expect(source).toContain('(dirPressure / refPressure) ** 2');
  });

  it('step() no longer has hardcoded initialBandEnergy = fill(1)', () => {
    // The old pattern: new Array(this.frequencies.length).fill(1) should NOT be present
    expect(source).not.toContain('new Array(this.frequencies.length).fill(1)');
  });

  it('arrivalPressure accepts optional receiverGain parameter', () => {
    // Match the method definition signature (with type annotations)
    const signatureMatch = source.match(/arrivalPressure\(initialSPL[^{]+\{/);
    expect(signatureMatch).not.toBeNull();
    expect(signatureMatch![0]).toContain('receiverGain');
  });

  it('arrivalPressure applies receiverGain to pressure output', () => {
    // The method body should contain receiverGain multiplications
    expect(impulseResponseSource).toContain('pressures[i] *= receiverGain');
  });
});

describe('receiver directivity in impulse response methods', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', 'index.ts'),
    'utf8'
  );

  const impulseResponseSource = fs.readFileSync(
    path.resolve(__dirname, '..', 'impulse-response.ts'),
    'utf8'
  );

  const exportPlaybackSource = fs.readFileSync(
    path.resolve(__dirname, '..', 'export-playback.ts'),
    'utf8'
  );

  const responseByIntensitySource = fs.readFileSync(
    path.resolve(__dirname, '..', 'response-by-intensity.ts'),
    'utf8'
  );

  it('calculateImpulseResponse applies receiver directivity', () => {
    // Should access receiver and call getGain
    expect(source).toContain('recForIR.getGain(');
  });

  it('calculateAmbisonicImpulseResponse applies receiver directivity', () => {
    expect(source).toContain('recForAmbi.getGain(');
  });

  it('calculateImpulseResponseForPair applies receiver directivity', () => {
    expect(impulseResponseSource).toContain('recForPair.getGain(');
  });

  it('calculateImpulseResponseForDisplay applies receiver directivity', () => {
    expect(impulseResponseSource).toContain('recForDisplay.getGain(');
  });

  it('downloadImpulses applies receiver directivity', () => {
    expect(exportPlaybackSource).toContain('recForDownload.getGain(');
  });

  it('calculateResponseByIntensity applies receiver directivity', () => {
    expect(responseByIntensitySource).toContain('recForIntensity.getGain(');
    // Should apply gain squared for intensity domain
    expect(responseByIntensitySource).toContain('recGainSq');
  });
});

describe('receiver directivity infrastructure', () => {
  const receiverSource = fs.readFileSync(
    path.resolve(__dirname, '..', '..', '..', 'objects', 'receiver.ts'),
    'utf8'
  );

  it('exports ReceiverPattern enum with expected values', () => {
    expect(receiverSource).toContain("OMNIDIRECTIONAL = 'omni'");
    expect(receiverSource).toContain("CARDIOID = 'cardioid'");
    expect(receiverSource).toContain("SUPERCARDIOID = 'supercardioid'");
    expect(receiverSource).toContain("FIGURE_EIGHT = 'figure8'");
  });

  it('exports receiverPatternGain function', () => {
    expect(receiverSource).toMatch(/export function receiverPatternGain/);
  });

  it('Receiver class has directivityPattern property', () => {
    expect(receiverSource).toContain('directivityPattern: ReceiverPattern');
  });

  it('Receiver class has getGain method', () => {
    expect(receiverSource).toContain('getGain(arrivalDirection: [number, number, number]): number');
  });

  it('ReceiverSaveObject includes directivityPattern', () => {
    const interfaceMatch = receiverSource.match(
      /export\s+interface\s+ReceiverSaveObject\s*\{([\s\S]*?)\}/
    );
    expect(interfaceMatch).not.toBeNull();
    expect(interfaceMatch![1]).toContain('directivityPattern');
  });

  it('save() includes directivityPattern', () => {
    // The save method should include directivityPattern in the returned object
    expect(receiverSource).toMatch(/const directivityPattern = this\.directivityPattern/);
  });

  it('restore() reads directivityPattern from state', () => {
    expect(receiverSource).toContain('state.directivityPattern');
  });
});
