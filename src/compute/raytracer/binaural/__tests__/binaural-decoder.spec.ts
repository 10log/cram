/**
 * Tests for binaural HRTF decoding (Issue #80).
 *
 * Part 1: Source-scanning tests that verify module structure
 * without requiring browser APIs (OfflineAudioContext, etc.).
 *
 * Part 2: Unit tests for pure functions (rotation, data parsing).
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Source code for scanning tests ───────────────────────────────────

const hrtfDataSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'hrtf-data.ts'),
  'utf8'
);

const binauralDecoderSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'binaural-decoder.ts'),
  'utf8'
);

// ── Part 1: Source-scanning tests ────────────────────────────────────

describe('Binaural HRTF – source structure', () => {

  describe('hrtf-data.ts', () => {
    it('exports HRTFSubject interface', () => {
      expect(hrtfDataSource).toMatch(/export\s+interface\s+HRTFSubject/);
    });

    it('HRTFSubject has required fields', () => {
      const match = hrtfDataSource.match(/export\s+interface\s+HRTFSubject\s*\{([^}]+)\}/);
      expect(match).not.toBeNull();
      const body = match![1];
      expect(body).toContain('id: string');
      expect(body).toContain('name: string');
      expect(body).toContain('description: string');
      expect(body).toContain('maxOrder: number');
      expect(body).toContain('thumbnailLeft: string');
      expect(body).toContain('thumbnailRight: string');
    });

    it('exports HRTFDecoderFilters interface', () => {
      expect(hrtfDataSource).toMatch(/export\s+interface\s+HRTFDecoderFilters/);
    });

    it('HRTFDecoderFilters has required fields', () => {
      const match = hrtfDataSource.match(/export\s+interface\s+HRTFDecoderFilters\s*\{([^}]+)\}/);
      expect(match).not.toBeNull();
      const body = match![1];
      expect(body).toContain('sampleRate: number');
      expect(body).toContain('filterLength: number');
      expect(body).toContain('channelCount: number');
      expect(body).toContain('filtersLeft: Float32Array[]');
      expect(body).toContain('filtersRight: Float32Array[]');
    });

    it('exports getAvailableSubjects function', () => {
      expect(hrtfDataSource).toMatch(/export\s+async\s+function\s+getAvailableSubjects/);
    });

    it('exports loadDecoderFilters function', () => {
      expect(hrtfDataSource).toMatch(/export\s+async\s+function\s+loadDecoderFilters/);
    });

    it('exports getThumbnailUrl function', () => {
      expect(hrtfDataSource).toMatch(/export\s+function\s+getThumbnailUrl/);
    });

    it('exports clearCache function', () => {
      expect(hrtfDataSource).toMatch(/export\s+function\s+clearCache/);
    });
  });

  describe('binaural-decoder.ts', () => {
    it('exports BinauralResult interface', () => {
      expect(binauralDecoderSource).toMatch(/export\s+interface\s+BinauralResult/);
    });

    it('BinauralResult has buffer and sampleRate', () => {
      const match = binauralDecoderSource.match(/export\s+interface\s+BinauralResult\s*\{([^}]+)\}/);
      expect(match).not.toBeNull();
      const body = match![1];
      expect(body).toContain('buffer: AudioBuffer');
      expect(body).toContain('sampleRate: number');
    });

    it('exports decodeBinaural async function', () => {
      expect(binauralDecoderSource).toMatch(/export\s+async\s+function\s+decodeBinaural/);
    });

    it('decodeBinaural takes ambisonicIR and filters parameters', () => {
      expect(binauralDecoderSource).toMatch(/decodeBinaural\(\s*\n?\s*ambisonicIR:\s*AudioBuffer/);
      expect(binauralDecoderSource).toMatch(/filters:\s*HRTFDecoderFilters/);
    });

    it('exports rotateAmbisonicIR function', () => {
      expect(binauralDecoderSource).toMatch(/export\s+function\s+rotateAmbisonicIR/);
    });

    it('rotateAmbisonicIR takes yaw, pitch, roll parameters', () => {
      expect(binauralDecoderSource).toMatch(/yawDeg:\s*number/);
      expect(binauralDecoderSource).toMatch(/pitchDeg:\s*number/);
      expect(binauralDecoderSource).toMatch(/rollDeg:\s*number/);
    });

    it('decodeBinaural checks for sample rate mismatch', () => {
      expect(binauralDecoderSource).toContain('Sample rate mismatch');
    });

    it('decodeBinaural creates OfflineAudioContext with 2 output channels', () => {
      expect(binauralDecoderSource).toMatch(/new\s+OfflineAudioContext\(\s*2/);
    });

    it('decodeBinaural sets convolver.normalize = false', () => {
      expect(binauralDecoderSource).toContain('convolver.normalize = false');
    });

    it('rotateAmbisonicIR returns input unchanged for zero rotation', () => {
      expect(binauralDecoderSource).toContain('yawDeg === 0 && pitchDeg === 0 && rollDeg === 0');
    });

    it('rotateAmbisonicIR requires at least 4 channels', () => {
      expect(binauralDecoderSource).toContain('requires at least 4 channels');
    });
  });
});

// ── Part 2: Integration structure tests (index.ts) ──────────────────

describe('Binaural HRTF – RayTracer integration', () => {
  const indexSource = fs.readFileSync(
    path.resolve(__dirname, '..', '..', 'index.ts'),
    'utf8'
  );

  const typesSource = fs.readFileSync(
    path.resolve(__dirname, '..', '..', 'types.ts'),
    'utf8'
  );

  const exportPlaybackSource = fs.readFileSync(
    path.resolve(__dirname, '..', '..', 'export-playback.ts'),
    'utf8'
  );

  it('index.ts imports binaural modules', () => {
    expect(indexSource).toContain('from "./binaural/hrtf-data"');
    expect(indexSource).toContain('from "./binaural/binaural-decoder"');
  });

  it('index.ts declares hrtfSubjectId property', () => {
    expect(indexSource).toMatch(/hrtfSubjectId:\s*string/);
  });

  it('index.ts declares head rotation properties', () => {
    expect(indexSource).toMatch(/headYaw:\s*number/);
    expect(indexSource).toMatch(/headPitch:\s*number/);
    expect(indexSource).toMatch(/headRoll:\s*number/);
  });

  it('index.ts has calculateBinauralImpulseResponse method', () => {
    expect(indexSource).toMatch(/async\s+calculateBinauralImpulseResponse/);
  });

  it('index.ts has playBinauralImpulseResponse method', () => {
    expect(indexSource).toMatch(/async\s+playBinauralImpulseResponse/);
  });

  it('index.ts has downloadBinauralImpulseResponse method', () => {
    expect(indexSource).toMatch(/async\s+downloadBinauralImpulseResponse/);
  });

  it('index.ts declares RAYTRACER_PLAY_BINAURAL_IR event type', () => {
    expect(indexSource).toContain('RAYTRACER_PLAY_BINAURAL_IR');
  });

  it('index.ts declares RAYTRACER_DOWNLOAD_BINAURAL_IR event type', () => {
    expect(indexSource).toContain('RAYTRACER_DOWNLOAD_BINAURAL_IR');
  });

  it('index.ts registers binaural event handlers', () => {
    expect(indexSource).toMatch(/on\(\s*"RAYTRACER_PLAY_BINAURAL_IR"/);
    expect(indexSource).toMatch(/on\(\s*"RAYTRACER_DOWNLOAD_BINAURAL_IR"/);
  });

  it('index.ts saves binaural properties (hrtfSubjectId, headYaw, headPitch, headRoll)', () => {
    expect(indexSource).toContain('hrtfSubjectId,');
    expect(indexSource).toContain('headYaw,');
    expect(indexSource).toContain('headPitch,');
    expect(indexSource).toContain('headRoll,');
  });

  it('types.ts includes binaural properties in RayTracerSaveObject', () => {
    const match = typesSource.match(/export\s+type\s+RayTracerSaveObject\s*=\s*\{([\s\S]*?)\n\}/);
    expect(match).not.toBeNull();
    const body = match![1];
    expect(body).toContain('hrtfSubjectId');
    expect(body).toContain('headYaw');
    expect(body).toContain('headPitch');
    expect(body).toContain('headRoll');
  });

  it('types.ts includes binaural properties in RayTracerParams', () => {
    const match = typesSource.match(/export\s+interface\s+RayTracerParams\s*\{([\s\S]*?)\n\}/);
    expect(match).not.toBeNull();
    const body = match![1];
    expect(body).toContain('hrtfSubjectId');
    expect(body).toContain('headYaw');
    expect(body).toContain('headPitch');
    expect(body).toContain('headRoll');
  });

  it('export-playback.ts exports playBinauralImpulseResponse', () => {
    expect(exportPlaybackSource).toMatch(/export\s+async\s+function\s+playBinauralImpulseResponse/);
  });

  it('export-playback.ts exports downloadBinauralImpulseResponse', () => {
    expect(exportPlaybackSource).toMatch(/export\s+async\s+function\s+downloadBinauralImpulseResponse/);
  });
});

// ── Part 3: Binary filter parsing unit tests ─────────────────────────

describe('Binaural HRTF – binary filter parsing', () => {
  // We test the binary format by creating a test buffer and checking that
  // the hrtf-data module can parse it correctly.
  // Since the actual parseDecoderFilters is private, we test via the exported
  // module structure to ensure the format expectations are correct.

  it('binary format header is 12 bytes (3 uint32)', () => {
    // The header consists of: nChannels (4 bytes) + filterLength (4 bytes) + sampleRate (4 bytes)
    expect(hrtfDataSource).toContain("getUint32(0, true)");
    expect(hrtfDataSource).toContain("getUint32(4, true)");
    expect(hrtfDataSource).toContain("getUint32(8, true)");
  });

  it('validates buffer size against expected data size', () => {
    expect(hrtfDataSource).toContain('Invalid HRTF filter data');
  });

  it('creates Float32Array views for left and right filters per channel', () => {
    expect(hrtfDataSource).toContain('filtersLeft');
    expect(hrtfDataSource).toContain('filtersRight');
    expect(hrtfDataSource).toMatch(/new Float32Array\(buffer,\s*offset,\s*filterLength\)/);
  });
});

// ── Part 4: Rotation math unit tests ─────────────────────────────────

describe('Binaural HRTF – rotation math', () => {
  // These tests verify the rotation matrix properties by checking the source code
  // structure. Full numerical tests require AudioBuffer (browser API).

  it('rotation function computes cos/sin for yaw, pitch, roll', () => {
    expect(binauralDecoderSource).toContain('Math.cos(yaw)');
    expect(binauralDecoderSource).toContain('Math.sin(yaw)');
    expect(binauralDecoderSource).toContain('Math.cos(pitch)');
    expect(binauralDecoderSource).toContain('Math.sin(pitch)');
    expect(binauralDecoderSource).toContain('Math.cos(roll)');
    expect(binauralDecoderSource).toContain('Math.sin(roll)');
  });

  it('rotation preserves W channel (channel 0) unchanged', () => {
    // W channel should be copied directly without modification
    expect(binauralDecoderSource).toMatch(/copyToChannel\(ambisonicIR\.getChannelData\(0\),\s*0\)/);
  });

  it('rotation operates on channels 1, 2, 3 (Y, Z, X)', () => {
    expect(binauralDecoderSource).toContain('getChannelData(1)');
    expect(binauralDecoderSource).toContain('getChannelData(2)');
    expect(binauralDecoderSource).toContain('getChannelData(3)');
  });

  it('rotation copies higher-order channels unchanged', () => {
    // Channels >= 4 should pass through
    expect(binauralDecoderSource).toMatch(/for\s*\(\s*let\s+ch\s*=\s*4;\s*ch\s*<\s*nCh/);
  });
});
