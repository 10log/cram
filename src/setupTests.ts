import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserverMock });

// Mock requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  value: (callback: FrameRequestCallback) => setTimeout(callback, 16),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: (id: number) => clearTimeout(id),
});

// Mock WebGL context for Three.js
HTMLCanvasElement.prototype.getContext = vi.fn((contextType: string) => {
  if (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl') {
    return {
      canvas: document.createElement('canvas'),
      drawingBufferWidth: 800,
      drawingBufferHeight: 600,
      getExtension: vi.fn(() => ({
        loseContext: vi.fn(),
      })),
      getParameter: vi.fn((param: number) => {
        // Return reasonable defaults for common parameters
        if (param === 7936) return 'WebGL Vendor'; // VENDOR
        if (param === 7937) return 'WebGL Renderer'; // RENDERER
        if (param === 7938) return 'WebGL 2.0'; // VERSION
        if (param === 35661) return 16; // MAX_TEXTURE_IMAGE_UNITS
        if (param === 34076) return 16384; // MAX_TEXTURE_SIZE
        if (param === 34024) return 16384; // MAX_RENDERBUFFER_SIZE
        if (param === 3379) return 16384; // MAX_TEXTURE_SIZE
        if (param === 36347) return 1024; // MAX_VERTEX_UNIFORM_VECTORS
        if (param === 36348) return 1024; // MAX_FRAGMENT_UNIFORM_VECTORS
        return 0;
      }),
      getShaderPrecisionFormat: vi.fn(() => ({
        precision: 23,
        rangeMin: 127,
        rangeMax: 127,
      })),
      createBuffer: vi.fn(() => ({})),
      createFramebuffer: vi.fn(() => ({})),
      createProgram: vi.fn(() => ({})),
      createRenderbuffer: vi.fn(() => ({})),
      createShader: vi.fn(() => ({})),
      createTexture: vi.fn(() => ({})),
      bindBuffer: vi.fn(),
      bindFramebuffer: vi.fn(),
      bindRenderbuffer: vi.fn(),
      bindTexture: vi.fn(),
      bufferData: vi.fn(),
      clear: vi.fn(),
      clearColor: vi.fn(),
      clearDepth: vi.fn(),
      clearStencil: vi.fn(),
      compileShader: vi.fn(),
      deleteBuffer: vi.fn(),
      deleteFramebuffer: vi.fn(),
      deleteProgram: vi.fn(),
      deleteRenderbuffer: vi.fn(),
      deleteShader: vi.fn(),
      deleteTexture: vi.fn(),
      depthFunc: vi.fn(),
      depthMask: vi.fn(),
      disable: vi.fn(),
      drawArrays: vi.fn(),
      drawElements: vi.fn(),
      enable: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      framebufferRenderbuffer: vi.fn(),
      framebufferTexture2D: vi.fn(),
      frontFace: vi.fn(),
      getAttribLocation: vi.fn(() => 0),
      getProgramInfoLog: vi.fn(() => ''),
      getProgramParameter: vi.fn(() => true),
      getShaderInfoLog: vi.fn(() => ''),
      getShaderParameter: vi.fn(() => true),
      getUniformLocation: vi.fn(() => ({})),
      linkProgram: vi.fn(),
      pixelStorei: vi.fn(),
      renderbufferStorage: vi.fn(),
      scissor: vi.fn(),
      shaderSource: vi.fn(),
      texImage2D: vi.fn(),
      texParameteri: vi.fn(),
      uniform1f: vi.fn(),
      uniform1i: vi.fn(),
      uniform2f: vi.fn(),
      uniform3f: vi.fn(),
      uniform4f: vi.fn(),
      uniformMatrix4fv: vi.fn(),
      useProgram: vi.fn(),
      vertexAttribPointer: vi.fn(),
      viewport: vi.fn(),
      attachShader: vi.fn(),
      cullFace: vi.fn(),
      blendEquation: vi.fn(),
      blendFunc: vi.fn(),
      blendFuncSeparate: vi.fn(),
      colorMask: vi.fn(),
      generateMipmap: vi.fn(),
      isContextLost: vi.fn(() => false),
      activeTexture: vi.fn(),
      stencilFunc: vi.fn(),
      stencilOp: vi.fn(),
      stencilMask: vi.fn(),
      readPixels: vi.fn(),
      checkFramebufferStatus: vi.fn(() => 36053), // FRAMEBUFFER_COMPLETE
    };
  }
  if (contextType === '2d') {
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    };
  }
  return null;
});

// Mock AudioContext for Web Audio API tests
class AudioContextMock {
  sampleRate = 44100;
  currentTime = 0;
  destination = {};
  state = 'running';
  createBuffer = vi.fn(() => ({
    getChannelData: vi.fn(() => new Float32Array(1024)),
    numberOfChannels: 1,
    length: 1024,
    sampleRate: 44100,
  }));
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }));
  createGain = vi.fn(() => ({
    gain: { value: 1 },
    connect: vi.fn(),
  }));
  createBiquadFilter = vi.fn(() => ({
    type: 'lowpass',
    frequency: { value: 350 },
    Q: { value: 1 },
    connect: vi.fn(),
  }));
  decodeAudioData = vi.fn();
  close = vi.fn();
}

class OfflineAudioContextMock extends AudioContextMock {
  startRendering = vi.fn(() => Promise.resolve({
    getChannelData: vi.fn(() => new Float32Array(1024)),
  }));
}

Object.defineProperty(window, 'AudioContext', { value: AudioContextMock });
Object.defineProperty(window, 'OfflineAudioContext', { value: OfflineAudioContextMock });

// Suppress console errors/warnings during tests (optional - remove if you want to see them)
// console.error = vi.fn();
// console.warn = vi.fn();
