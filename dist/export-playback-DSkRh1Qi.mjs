import { e as h, F as y } from "./index-DDGfegRq.mjs";
import { a as c, w as g, n as x } from "./audio-engine-DbWjDVpV.mjs";
async function A(t, r, e, o) {
  t || (t = await r()), c.context.state === "suspended" && c.context.resume(), console.log(t);
  const a = c.context.createBufferSource();
  return a.buffer = t, a.connect(c.context.destination), a.start(), h(o, { uuid: e, property: "impulseResponsePlaying", value: !0 }), a.onended = () => {
    a.stop(), a.disconnect(c.context.destination), h(o, { uuid: e, property: "impulseResponsePlaying", value: !1 });
  }, { impulseResponse: t };
}
async function b(t, r, e, o = c.sampleRate) {
  t || (t = await r());
  const a = g([x(t.getChannelData(0))], { sampleRate: o, bitDepth: 32 }), f = e.endsWith(".wav") ? "" : ".wav";
  return y.saveAs(a, e + f), { impulseResponse: t };
}
async function D(t, r, e, o = 1, a) {
  (!t || e !== o) && (e = o, t = await r(o));
  const f = t.numberOfChannels, s = t.sampleRate, i = [];
  for (let n = 0; n < f; n++)
    i.push(t.getChannelData(n));
  const l = g(i, { sampleRate: s, bitDepth: 32 }), d = a.endsWith(".wav") ? "" : ".wav", w = o === 1 ? "FOA" : `HOA${o}`;
  return y.saveAs(l, `${a}_${w}${d}`), { ambisonicImpulseResponse: t, ambisonicOrder: e };
}
async function C(t, r, e, o) {
  t || (t = await r()), c.context.state === "suspended" && c.context.resume();
  const a = c.context.createBufferSource();
  return a.buffer = t, a.connect(c.context.destination), a.start(), h(o, { uuid: e, property: "binauralPlaying", value: !0 }), a.onended = () => {
    a.stop(), a.disconnect(c.context.destination), h(o, { uuid: e, property: "binauralPlaying", value: !1 });
  }, { binauralImpulseResponse: t };
}
async function $(t, r, e) {
  t || (t = await r());
  const o = t.sampleRate, a = t.getChannelData(0), f = t.getChannelData(1);
  let s = 0;
  for (let n = 0; n < a.length; n++)
    Math.abs(a[n]) > s && (s = Math.abs(a[n])), Math.abs(f[n]) > s && (s = Math.abs(f[n]));
  const i = new Float32Array(a.length), l = new Float32Array(f.length);
  if (s > 0)
    for (let n = 0; n < a.length; n++)
      i[n] = a[n] / s, l[n] = f[n] / s;
  const d = g([i, l], { sampleRate: o, bitDepth: 32 }), w = e.endsWith(".wav") ? "" : ".wav";
  return y.saveAs(d, `${e}_binaural${w}`), { binauralImpulseResponse: t };
}
export {
  D as a,
  C as b,
  $ as c,
  b as d,
  A as p
};
//# sourceMappingURL=export-playback-DSkRh1Qi.mjs.map
