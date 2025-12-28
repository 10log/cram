// Type declarations for ambisonics package - buffer-based encoding
// These extend the existing package types with offline processing utilities

declare module 'ambisonics' {
  // Re-export existing types from the package
  export type CoordinateSystem = 'ambisonics' | 'threejs';

  // Channel count utilities
  export function getAmbisonicChannelCount(order: number): number;
  export function getAmbisonicChannelCount2D(order: number): number;
  export function degreesToRadians(degrees: number): number;
  export function radiansToDegrees(radians: number): number;

  // Buffer-based encoding functions (offline processing)

  /**
   * Compute spherical harmonic encoding coefficients for a direction.
   * @param azim - Azimuth angle in degrees
   * @param elev - Elevation angle in degrees
   * @param order - Ambisonic order
   * @returns Array of encoding coefficients, one per ambisonic channel
   */
  export function computeEncodingCoefficients(
    azim: number,
    elev: number,
    order: number
  ): Float32Array;

  /**
   * Compute circular harmonic encoding coefficients for 2D encoding.
   * @param azim - Azimuth angle in degrees
   * @param order - Ambisonic order
   * @returns Array of encoding coefficients, one per 2D ambisonic channel
   */
  export function computeEncodingCoefficients2D(
    azim: number,
    order: number
  ): Float32Array;

  /**
   * Encode a mono audio buffer to ambisonic channels at a fixed direction.
   * @param monoSamples - Input mono audio samples
   * @param azim - Azimuth angle in degrees
   * @param elev - Elevation angle in degrees
   * @param order - Ambisonic order
   * @returns Array of Float32Arrays, one per ambisonic channel (ACN ordering, N3D normalization)
   */
  export function encodeBuffer(
    monoSamples: Float32Array,
    azim: number,
    elev: number,
    order: number
  ): Float32Array[];

  /**
   * Encode a mono audio buffer to 2D ambisonic channels.
   * @param monoSamples - Input mono audio samples
   * @param azim - Azimuth angle in degrees
   * @param order - Ambisonic order
   * @returns Array of Float32Arrays, one per 2D ambisonic channel
   */
  export function encodeBuffer2D(
    monoSamples: Float32Array,
    azim: number,
    order: number
  ): Float32Array[];

  /**
   * Encode a mono buffer using a Cartesian direction vector.
   * @param monoSamples - Input mono audio samples
   * @param x - X component of direction vector
   * @param y - Y component of direction vector
   * @param z - Z component of direction vector
   * @param order - Ambisonic order
   * @param coords - Coordinate system convention (default: 'ambisonics')
   * @returns Array of Float32Arrays, one per ambisonic channel
   */
  export function encodeBufferFromDirection(
    monoSamples: Float32Array,
    x: number,
    y: number,
    z: number,
    order: number,
    coords?: CoordinateSystem
  ): Float32Array[];

  /**
   * Encode a mono buffer to 2D ambisonics using a Cartesian direction vector.
   * @param monoSamples - Input mono audio samples
   * @param x - X component of direction vector
   * @param y - Y component of direction vector
   * @param z - Z component (ignored for 2D encoding)
   * @param order - Ambisonic order
   * @param coords - Coordinate system convention (default: 'ambisonics')
   * @returns Array of Float32Arrays, one per 2D ambisonic channel
   */
  export function encodeBuffer2DFromDirection(
    monoSamples: Float32Array,
    x: number,
    y: number,
    z: number,
    order: number,
    coords?: CoordinateSystem
  ): Float32Array[];

  /**
   * Encode multiple mono buffers at different directions and sum them.
   * @param sources - Array of {samples, azim, elev} objects
   * @param order - Ambisonic order
   * @returns Array of Float32Arrays containing the summed ambisonic output
   */
  export function encodeAndSumBuffers(
    sources: Array<{ samples: Float32Array; azim: number; elev: number }>,
    order: number
  ): Float32Array[];

  // Web Audio node-based classes (existing)
  export class monoEncoder {
    constructor(context: AudioContext, order: number);
    azim: number;
    elev: number;
    in: GainNode;
    out: ChannelMergerNode;
    updateGains(): void;
    setDirection(x: number, y: number, z: number, coords?: CoordinateSystem): void;
    getDirection(coords?: CoordinateSystem): [number, number, number];
  }

  export class monoEncoder2D {
    constructor(context: AudioContext, order: number);
    azim: number;
    in: GainNode;
    out: ChannelMergerNode;
    updateGains(): void;
    setDirection(x: number, y: number, z: number, coords?: CoordinateSystem): void;
    getDirection(coords?: CoordinateSystem): [number, number, number];
  }

  export class binDecoder {
    constructor(context: AudioContext, order: number);
    in: ChannelSplitterNode;
    out: GainNode;
    updateFilters(audioBuffer: AudioBuffer): void;
  }

  export class binDecoder2D {
    constructor(context: AudioContext, order: number);
    in: ChannelSplitterNode;
    out: GainNode;
    updateFilters(audioBuffer: AudioBuffer): void;
  }

  export class sceneRotator {
    constructor(context: AudioContext, order: number);
    yaw: number;
    pitch: number;
    roll: number;
    in: ChannelSplitterNode;
    out: ChannelMergerNode;
    updateRotMtx(): void;
  }

  export class sceneRotator2D {
    constructor(context: AudioContext, order: number);
    yaw: number;
    in: ChannelSplitterNode;
    out: ChannelMergerNode;
    updateRotMtx(): void;
  }

  export interface SpeakerPosition {
    azim: number;
    elev: number;
    dist?: number;
  }

  export class decoder {
    constructor(context: AudioContext, order: number, speakerPositions: SpeakerPosition[]);
    in: ChannelSplitterNode;
    out: ChannelMergerNode;
  }

  export class HRIRloader_local {
    constructor(context: AudioContext, order: number, callback: () => void);
    load(url: string): void;
    hrirBuffer: AudioBuffer;
  }

  export class HOAloader {
    constructor(context: AudioContext, order: number, callback: () => void);
    load(url: string | string[]): void;
    hoaBuffer: AudioBuffer;
  }
}
