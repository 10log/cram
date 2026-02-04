import { k as g, F as x } from "./index-BUlpYGJ0.mjs";
function m(o, t) {
  return typeof t == "number" ? o(t) : t.map((e) => o(e));
}
function U(o, t) {
  return g.map((e) => e.Center).filter((e) => e >= Number(o || 0) && e <= Number(t || 2e4));
}
function y(o, t) {
  return m((e) => e / Math.pow(2, 1 / (2 * o)), t);
}
function A(o, t) {
  return m((e) => e * Math.pow(2, 1 / (2 * o)), t);
}
const b = {
  pcm8: (o, t, e, n, a) => {
    let s = new Uint8Array(o, t), l = 0;
    for (let c = 0; c < a; ++c)
      for (let i = 0; i < n; ++i) {
        let r = Math.max(-1, Math.min(e[i][c], 1));
        r = (r * 0.5 + 0.5) * 255 | 0, s[l++] = r;
      }
  },
  pcm16: (o, t, e, n, a) => {
    let s = new Int16Array(o, t), l = 0;
    for (let c = 0; c < a; ++c)
      for (let i = 0; i < n; ++i) {
        let r = Math.max(-1, Math.min(e[i][c], 1));
        r = (r < 0 ? r * 32768 : r * 32767) | 0, s[l++] = r;
      }
  },
  pcm24: (o, t, e, n, a) => {
    let s = new Uint8Array(o, t), l = 0;
    for (let c = 0; c < a; ++c)
      for (let i = 0; i < n; ++i) {
        let r = Math.max(-1, Math.min(e[i][c], 1));
        r = (r < 0 ? 16777216 + r * 8388608 : r * 8388607) | 0, s[l++] = r >> 0 & 255, s[l++] = r >> 8 & 255, s[l++] = r >> 16 & 255;
      }
  },
  pcm32: (o, t, e, n, a) => {
    let s = new Int32Array(o, t), l = 0;
    for (let c = 0; c < a; ++c)
      for (let i = 0; i < n; ++i) {
        let r = Math.max(-1, Math.min(e[i][c], 1));
        r = (r < 0 ? r * 2147483648 : r * 2147483647) | 0, s[l++] = r;
      }
  },
  pcm32f: (o, t, e, n, a) => {
    let s = new Float32Array(o, t), l = 0;
    for (let c = 0; c < a; ++c)
      for (let i = 0; i < n; ++i) {
        let r = Math.max(-1, Math.min(e[i][c], 1));
        s[l++] = r;
      }
  },
  pcm64f: (o, t, e, n, a) => {
    let s = new Float64Array(o, t), l = 0;
    for (let c = 0; c < a; ++c)
      for (let i = 0; i < n; ++i) {
        let r = Math.max(-1, Math.min(e[i][c], 1));
        s[l++] = r;
      }
  }
};
function F(o, t) {
  const e = "pcm" + o + (t ? "f" : ""), n = b[e];
  if (!n) throw new TypeError("Unsupported data format: " + e);
  return n;
}
function M(o, t) {
  const e = t.sampleRate || 48e3, n = !!(t.float || t.floatingPoint), a = n ? 32 : t.bitDepth | 0 || 16, s = o.length, l = o[0].length, c = new ArrayBuffer(44 + l * s * (a >> 3)), i = new DataView(c);
  let r = 0;
  function w(u) {
    i.setUint8(r++, u);
  }
  function h(u) {
    i.setUint16(r, u, !0), r += 2;
  }
  function f(u) {
    i.setUint32(r, u, !0), r += 4;
  }
  function p(u) {
    for (var d = 0; d < u.length; ++d) w(u.charCodeAt(d));
  }
  return p("RIFF"), f(c.byteLength - 8), p("WAVE"), p("fmt "), f(16), h(n ? 3 : 1), h(s), f(e), f(e * s * (a >> 3)), h(s * (a >> 3)), h(a), p("data"), f(c.byteLength - 44), F(a, n)(
    c,
    r,
    o,
    s,
    l
  ), new Uint8Array(c);
}
function v(o, { sampleRate: t = 44100, bitDepth: e = 16 }) {
  const n = M(o, {
    channels: o.length,
    sampleRate: t,
    bitDepth: e
  });
  return new Blob([n.buffer], { type: "audio/wav" });
}
function B(o) {
  let t = Math.abs(o[0]);
  for (let e = 1; e < o.length; e++)
    Math.abs(o[e]) > t && (t = Math.abs(o[e]));
  if (t !== 0)
    for (let e = 0; e < o.length; e++)
      o[e] = o[e] / t;
  return o;
}
function C(o, t) {
  if (!o) throw Error(t);
}
const S = window.AudioContext || window.webkitAudioContext, E = window.OfflineAudioContext || window.webkitOfflineAudioContext;
class O {
  context;
  constructor() {
    this.context = new S();
  }
  /**
   * Creates an offline audio context for faster rendering
   * @param numberOfChannels number of channels for this context
   * @param length length of the context in samples
   * @param sampleRate sample rate in samples / second
   */
  createOfflineContext(t, e, n) {
    return new E(t, e, n);
  }
  /**
   * Renders an offline audio context in a more browser agnostic way.
   * neither Safari or Edge like `await context.startRendering()`
   * @param context offline audio context
   * @returns {Promise<AudioBuffer>} the rendered buffer
   */
  async renderContextAsync(t) {
    return new Promise((e, n) => {
      t.oncomplete = function(a) {
        a.renderedBuffer ? e(a.renderedBuffer) : n("failed to get renderedBuffer after context completed rendering");
      }, t.startRendering();
    });
  }
  /**
   * Creates a buffer source node filled with the supplied data
   * @param buffer The buffer of samples in a Float32Array
   * @param context audio context to use
   * @returns the buffer source
   */
  createBufferSource(t, e = this.context) {
    const n = e.createBufferSource();
    return n.buffer = e.createBuffer(1, t.length, this.context.sampleRate), n.buffer.getChannelData(0).set(t, 0), n;
  }
  /**
   * Creates a bandpass filter node
   * @param freq center frequency
   * @param Q Q-factor (reciprocal of the fractional bandwidth)
   * @param context audio context to use
   * @returns a bandpass filter
   */
  createBandpassFilter(t, e = 1.414, n = this.context) {
    const a = n.createBiquadFilter();
    return a.type = "bandpass", a.Q.value = e, a.frequency.value = t, a;
  }
  /**
   * Creates a bandpass filter node
   * @param freq center frequency
   * @param Q Q-factor (reciprocal of the fractional bandwidth)
   * @param context audio context to use
   * @returns a bandpass filter
   */
  createBiquadFilter(t, e, n = 1.414, a = 1, s = this.context) {
    const l = s.createBiquadFilter();
    return l.type = t, l.Q.value = n, l.frequency.value = e, l.gain.value = a, l;
  }
  /**
   * Creates a gain node
   * @param value the gain value
   * @param context audio context to use
   * @returns a gain node
   */
  createGainNode(t, e = this.context) {
    const n = e.createGain();
    return n.gain.value = t, n;
  }
  /**
   * Creates a channel merger node
   * @param count number of input channels to merge
   * @param context audio context to use
   * @returns a channel merger node
   */
  createMerger(t, e = this.context) {
    return e.createChannelMerger(t);
  }
  /**
   * Creates a filtered source node 
   * @param buffer The buffer of samples in a Float32Array
   * @param freq center frequency
   * @param Q Q-factor (reciprocal of the fractional bandwidth)
   * @param gain the gain value
   * @param context audio context to use
   * @returns a filtered source node
   */
  createFilteredSource(t, e, n = 1.414, a = 1, s = this.context) {
    const l = y(1, e), c = A(1, e), i = {
      source: this.createBufferSource(t, s),
      lowpass: this.createBiquadFilter("lowpass", c, n, 1, s),
      highpass: this.createBiquadFilter("highpass", l, n, 1, s),
      gain: this.createGainNode(a, s)
    };
    return i.source.connect(i.lowpass), i.lowpass.connect(i.highpass), i.highpass.connect(i.gain), i;
  }
  /**
   * Creates an array of filtered source nodes
   * @param dataBuffers an array of sample buffers
   * @param frequencies an array of frequencies
   * @param context audio context to use
   * @returns an array of filtered source nodes
   */
  createFilteredSources(t, e, n = this.context) {
    C(t.length === e.length, "There should be exactly one frequency for each data buffer.");
    const a = [];
    for (let s = 0; s < e.length; s++)
      a.push(this.createFilteredSource(t[s], e[s], 0.707, 1, n));
    return a;
  }
  diracDelta(t = 8192, e = 0) {
    const n = new Float32Array(Array(t).fill(0));
    return n[e] = 1, n;
  }
  async testFilters(t, e = 44100) {
    const n = Array(t.length).fill(0).map((r) => this.diracDelta()), a = this.createOfflineContext(1, n[0].length, e), s = this.createFilteredSources(n, t, a), l = this.createMerger(s.length, a);
    for (let r = 0; r < s.length; r++)
      s[r].gain.connect(l, 0, r);
    l.connect(a.destination), s.forEach((r) => r.source.start());
    const c = await this.renderContextAsync(a), i = v([B(c.getChannelData(0))], { sampleRate: e, bitDepth: 32 });
    x.saveAs(i, "testFilters.wav");
  }
  get sampleRate() {
    return this.context.sampleRate;
  }
}
const D = new O();
export {
  U as O,
  D as a,
  B as n,
  v as w
};
//# sourceMappingURL=audio-engine-3uA9mmDi.mjs.map
