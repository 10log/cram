import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
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
HTMLCanvasElement.prototype.getContext = jest.fn((contextType: string) => {
  if (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl') {
    return {
      canvas: document.createElement('canvas'),
      drawingBufferWidth: 800,
      drawingBufferHeight: 600,
      getExtension: jest.fn(() => ({
        loseContext: jest.fn(),
      })),
      getParameter: jest.fn((param: number) => {
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
      getShaderPrecisionFormat: jest.fn(() => ({
        precision: 23,
        rangeMin: 127,
        rangeMax: 127,
      })),
      createBuffer: jest.fn(() => ({})),
      createFramebuffer: jest.fn(() => ({})),
      createProgram: jest.fn(() => ({})),
      createRenderbuffer: jest.fn(() => ({})),
      createShader: jest.fn(() => ({})),
      createTexture: jest.fn(() => ({})),
      bindBuffer: jest.fn(),
      bindFramebuffer: jest.fn(),
      bindRenderbuffer: jest.fn(),
      bindTexture: jest.fn(),
      bufferData: jest.fn(),
      clear: jest.fn(),
      clearColor: jest.fn(),
      clearDepth: jest.fn(),
      clearStencil: jest.fn(),
      compileShader: jest.fn(),
      deleteBuffer: jest.fn(),
      deleteFramebuffer: jest.fn(),
      deleteProgram: jest.fn(),
      deleteRenderbuffer: jest.fn(),
      deleteShader: jest.fn(),
      deleteTexture: jest.fn(),
      depthFunc: jest.fn(),
      depthMask: jest.fn(),
      disable: jest.fn(),
      drawArrays: jest.fn(),
      drawElements: jest.fn(),
      enable: jest.fn(),
      enableVertexAttribArray: jest.fn(),
      framebufferRenderbuffer: jest.fn(),
      framebufferTexture2D: jest.fn(),
      frontFace: jest.fn(),
      getAttribLocation: jest.fn(() => 0),
      getProgramInfoLog: jest.fn(() => ''),
      getProgramParameter: jest.fn(() => true),
      getShaderInfoLog: jest.fn(() => ''),
      getShaderParameter: jest.fn(() => true),
      getUniformLocation: jest.fn(() => ({})),
      linkProgram: jest.fn(),
      pixelStorei: jest.fn(),
      renderbufferStorage: jest.fn(),
      scissor: jest.fn(),
      shaderSource: jest.fn(),
      texImage2D: jest.fn(),
      texParameteri: jest.fn(),
      uniform1f: jest.fn(),
      uniform1i: jest.fn(),
      uniform2f: jest.fn(),
      uniform3f: jest.fn(),
      uniform4f: jest.fn(),
      uniformMatrix4fv: jest.fn(),
      useProgram: jest.fn(),
      vertexAttribPointer: jest.fn(),
      viewport: jest.fn(),
      attachShader: jest.fn(),
      cullFace: jest.fn(),
      blendEquation: jest.fn(),
      blendFunc: jest.fn(),
      blendFuncSeparate: jest.fn(),
      colorMask: jest.fn(),
      generateMipmap: jest.fn(),
      isContextLost: jest.fn(() => false),
      activeTexture: jest.fn(),
      stencilFunc: jest.fn(),
      stencilOp: jest.fn(),
      stencilMask: jest.fn(),
      readPixels: jest.fn(),
      checkFramebufferStatus: jest.fn(() => 36053), // FRAMEBUFFER_COMPLETE
    };
  }
  if (contextType === '2d') {
    return {
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn(() => ({ width: 0 })),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    };
  }
  return null;
}) as jest.Mock;

// Mock AudioContext for Web Audio API tests
class AudioContextMock {
  sampleRate = 44100;
  currentTime = 0;
  destination = {};
  state = 'running';
  createBuffer = jest.fn(() => ({
    getChannelData: jest.fn(() => new Float32Array(1024)),
    numberOfChannels: 1,
    length: 1024,
    sampleRate: 44100,
  }));
  createBufferSource = jest.fn(() => ({
    buffer: null,
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  }));
  createGain = jest.fn(() => ({
    gain: { value: 1 },
    connect: jest.fn(),
  }));
  createBiquadFilter = jest.fn(() => ({
    type: 'lowpass',
    frequency: { value: 350 },
    Q: { value: 1 },
    connect: jest.fn(),
  }));
  decodeAudioData = jest.fn();
  close = jest.fn();
}

class OfflineAudioContextMock extends AudioContextMock {
  startRendering = jest.fn(() => Promise.resolve({
    getChannelData: jest.fn(() => new Float32Array(1024)),
  }));
}

Object.defineProperty(window, 'AudioContext', { value: AudioContextMock });
Object.defineProperty(window, 'OfflineAudioContext', { value: OfflineAudioContextMock });

// Suppress console errors/warnings during tests (optional - remove if you want to see them)
// console.error = jest.fn();
// console.warn = jest.fn();
