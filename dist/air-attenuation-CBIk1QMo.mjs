function g(r, e = 20, w = 40, u = 101325) {
  const t = e + 273.15, s = 293.15, x = 273.16, o = 101325, n = u || o, i = -6.8346 * Math.pow(x / t, 1.261) + 4.6151, h = Math.pow(10, i) * w * o / n, p = n / o * Math.pow(s / t, 0.5) * (9 + 280 * h * Math.exp(-4.17 * (Math.pow(s / t, 1 / 3) - 1))), c = n / o * (24 + 40400 * h * (0.02 + h) / (0.391 + h)), M = [];
  return r.forEach((a) => {
    const l = a ** 2 * (184e-13 / (Math.pow(s / t, 0.5) * n / o) + Math.pow(s / t, -2.5) * (0.1068 * Math.exp(-3352 / t) * p / (a * a + p * p) + 0.01278 * Math.exp(-2239.1 / t) * c / (a * a + c * c)));
    M.push(20 * l / Math.log(10));
  }), M;
}
export {
  g as a
};
//# sourceMappingURL=air-attenuation-CBIk1QMo.mjs.map
