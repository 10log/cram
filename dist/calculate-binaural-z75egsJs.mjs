import { l as loadDecoderFilters } from "./index-BW01orYZ.mjs";
function getAmbisonicChannelCount(D) {
  return (D + 1) * (D + 1);
}
function degreesToRadians(D) {
  return D * Math.PI / 180;
}
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, numeric1_2_6 = {};
(function(exports$1) {
  var numeric = exports$1;
  typeof commonjsGlobal < "u" && (commonjsGlobal.numeric = numeric), numeric.version = "1.2.6", numeric.bench = function(c, t) {
    var n, f, a, r;
    for (typeof t > "u" && (t = 15), a = 0.5, n = /* @__PURE__ */ new Date(); ; ) {
      for (a *= 2, r = a; r > 3; r -= 4)
        c(), c(), c(), c();
      for (; r > 0; )
        c(), r--;
      if (f = /* @__PURE__ */ new Date(), f - n > t) break;
    }
    for (r = a; r > 3; r -= 4)
      c(), c(), c(), c();
    for (; r > 0; )
      c(), r--;
    return f = /* @__PURE__ */ new Date(), 1e3 * (3 * a - 1) / (f - n);
  }, numeric._myIndexOf = function(c) {
    var t = this.length, n;
    for (n = 0; n < t; ++n) if (this[n] === c) return n;
    return -1;
  }, numeric.myIndexOf = Array.prototype.indexOf ? Array.prototype.indexOf : numeric._myIndexOf, numeric.Function = Function, numeric.precision = 4, numeric.largeArray = 50, numeric.prettyPrint = function(c) {
    function t(a) {
      if (a === 0)
        return "0";
      if (isNaN(a))
        return "NaN";
      if (a < 0)
        return "-" + t(-a);
      if (isFinite(a)) {
        var r = Math.floor(Math.log(a) / Math.log(10)), i = a / Math.pow(10, r), s = i.toPrecision(numeric.precision);
        return parseFloat(s) === 10 && (r++, i = 1, s = i.toPrecision(numeric.precision)), parseFloat(s).toString() + "e" + r.toString();
      }
      return "Infinity";
    }
    var n = [];
    function f(a) {
      var r;
      if (typeof a > "u")
        return n.push(Array(numeric.precision + 8).join(" ")), !1;
      if (typeof a == "string")
        return n.push('"' + a + '"'), !1;
      if (typeof a == "boolean")
        return n.push(a.toString()), !1;
      if (typeof a == "number") {
        var i = t(a), s = a.toPrecision(numeric.precision), u = parseFloat(a.toString()).toString(), o = [i, s, u, parseFloat(s).toString(), parseFloat(u).toString()];
        for (r = 1; r < o.length; r++)
          o[r].length < i.length && (i = o[r]);
        return n.push(Array(numeric.precision + 8 - i.length).join(" ") + i), !1;
      }
      if (a === null)
        return n.push("null"), !1;
      if (typeof a == "function") {
        n.push(a.toString());
        var v = !1;
        for (r in a)
          a.hasOwnProperty(r) && (v ? n.push(`,
`) : n.push(`
{`), v = !0, n.push(r), n.push(`: 
`), f(a[r]));
        return v && n.push(`}
`), !0;
      }
      if (a instanceof Array) {
        if (a.length > numeric.largeArray)
          return n.push("...Large Array..."), !0;
        var v = !1;
        for (n.push("["), r = 0; r < a.length; r++)
          r > 0 && (n.push(","), v && n.push(`
 `)), v = f(a[r]);
        return n.push("]"), !0;
      }
      n.push("{");
      var v = !1;
      for (r in a)
        a.hasOwnProperty(r) && (v && n.push(`,
`), v = !0, n.push(r), n.push(`: 
`), f(a[r]));
      return n.push("}"), !0;
    }
    return f(c), n.join("");
  }, numeric.parseDate = function(c) {
    function t(n) {
      if (typeof n == "string")
        return Date.parse(n.replace(/-/g, "/"));
      if (!(n instanceof Array))
        throw new Error("parseDate: parameter must be arrays of strings");
      var f = [], a;
      for (a = 0; a < n.length; a++)
        f[a] = t(n[a]);
      return f;
    }
    return t(c);
  }, numeric.parseFloat = function(c) {
    function t(n) {
      if (typeof n == "string")
        return parseFloat(n);
      if (!(n instanceof Array))
        throw new Error("parseFloat: parameter must be arrays of strings");
      var f = [], a;
      for (a = 0; a < n.length; a++)
        f[a] = t(n[a]);
      return f;
    }
    return t(c);
  }, numeric.parseCSV = function(c) {
    var t = c.split(`
`), n, f, a = [], r = /(([^'",]*)|('[^']*')|("[^"]*")),/g, i = /^\s*(([+-]?[0-9]+(\.[0-9]*)?(e[+-]?[0-9]+)?)|([+-]?[0-9]*(\.[0-9]+)?(e[+-]?[0-9]+)?))\s*$/, s = function(w) {
      return w.substr(0, w.length - 1);
    }, u = 0;
    for (f = 0; f < t.length; f++) {
      var o = (t[f] + ",").match(r), v;
      if (o.length > 0) {
        for (a[u] = [], n = 0; n < o.length; n++)
          v = s(o[n]), i.test(v) ? a[u][n] = parseFloat(v) : a[u][n] = v;
        u++;
      }
    }
    return a;
  }, numeric.toCSV = function(c) {
    var t = numeric.dim(c), n, f, a, r, i;
    for (a = t[0], t[1], i = [], n = 0; n < a; n++) {
      for (r = [], f = 0; f < a; f++)
        r[f] = c[n][f].toString();
      i[n] = r.join(", ");
    }
    return i.join(`
`) + `
`;
  }, numeric.getURL = function(c) {
    var t = new XMLHttpRequest();
    return t.open("GET", c, !1), t.send(), t;
  }, numeric.imageURL = function(c) {
    function t(E) {
      var z = E.length, g, d, R, L, F, l, S, O, j = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Y = "";
      for (g = 0; g < z; g += 3)
        d = E[g], R = E[g + 1], L = E[g + 2], F = d >> 2, l = ((d & 3) << 4) + (R >> 4), S = ((R & 15) << 2) + (L >> 6), O = L & 63, g + 1 >= z ? S = O = 64 : g + 2 >= z && (O = 64), Y += j.charAt(F) + j.charAt(l) + j.charAt(S) + j.charAt(O);
      return Y;
    }
    function n(E, z, g) {
      typeof z > "u" && (z = 0), typeof g > "u" && (g = E.length);
      var d = [
        0,
        1996959894,
        3993919788,
        2567524794,
        124634137,
        1886057615,
        3915621685,
        2657392035,
        249268274,
        2044508324,
        3772115230,
        2547177864,
        162941995,
        2125561021,
        3887607047,
        2428444049,
        498536548,
        1789927666,
        4089016648,
        2227061214,
        450548861,
        1843258603,
        4107580753,
        2211677639,
        325883990,
        1684777152,
        4251122042,
        2321926636,
        335633487,
        1661365465,
        4195302755,
        2366115317,
        997073096,
        1281953886,
        3579855332,
        2724688242,
        1006888145,
        1258607687,
        3524101629,
        2768942443,
        901097722,
        1119000684,
        3686517206,
        2898065728,
        853044451,
        1172266101,
        3705015759,
        2882616665,
        651767980,
        1373503546,
        3369554304,
        3218104598,
        565507253,
        1454621731,
        3485111705,
        3099436303,
        671266974,
        1594198024,
        3322730930,
        2970347812,
        795835527,
        1483230225,
        3244367275,
        3060149565,
        1994146192,
        31158534,
        2563907772,
        4023717930,
        1907459465,
        112637215,
        2680153253,
        3904427059,
        2013776290,
        251722036,
        2517215374,
        3775830040,
        2137656763,
        141376813,
        2439277719,
        3865271297,
        1802195444,
        476864866,
        2238001368,
        4066508878,
        1812370925,
        453092731,
        2181625025,
        4111451223,
        1706088902,
        314042704,
        2344532202,
        4240017532,
        1658658271,
        366619977,
        2362670323,
        4224994405,
        1303535960,
        984961486,
        2747007092,
        3569037538,
        1256170817,
        1037604311,
        2765210733,
        3554079995,
        1131014506,
        879679996,
        2909243462,
        3663771856,
        1141124467,
        855842277,
        2852801631,
        3708648649,
        1342533948,
        654459306,
        3188396048,
        3373015174,
        1466479909,
        544179635,
        3110523913,
        3462522015,
        1591671054,
        702138776,
        2966460450,
        3352799412,
        1504918807,
        783551873,
        3082640443,
        3233442989,
        3988292384,
        2596254646,
        62317068,
        1957810842,
        3939845945,
        2647816111,
        81470997,
        1943803523,
        3814918930,
        2489596804,
        225274430,
        2053790376,
        3826175755,
        2466906013,
        167816743,
        2097651377,
        4027552580,
        2265490386,
        503444072,
        1762050814,
        4150417245,
        2154129355,
        426522225,
        1852507879,
        4275313526,
        2312317920,
        282753626,
        1742555852,
        4189708143,
        2394877945,
        397917763,
        1622183637,
        3604390888,
        2714866558,
        953729732,
        1340076626,
        3518719985,
        2797360999,
        1068828381,
        1219638859,
        3624741850,
        2936675148,
        906185462,
        1090812512,
        3747672003,
        2825379669,
        829329135,
        1181335161,
        3412177804,
        3160834842,
        628085408,
        1382605366,
        3423369109,
        3138078467,
        570562233,
        1426400815,
        3317316542,
        2998733608,
        733239954,
        1555261956,
        3268935591,
        3050360625,
        752459403,
        1541320221,
        2607071920,
        3965973030,
        1969922972,
        40735498,
        2617837225,
        3943577151,
        1913087877,
        83908371,
        2512341634,
        3803740692,
        2075208622,
        213261112,
        2463272603,
        3855990285,
        2094854071,
        198958881,
        2262029012,
        4057260610,
        1759359992,
        534414190,
        2176718541,
        4139329115,
        1873836001,
        414664567,
        2282248934,
        4279200368,
        1711684554,
        285281116,
        2405801727,
        4167216745,
        1634467795,
        376229701,
        2685067896,
        3608007406,
        1308918612,
        956543938,
        2808555105,
        3495958263,
        1231636301,
        1047427035,
        2932959818,
        3654703836,
        1088359270,
        936918e3,
        2847714899,
        3736837829,
        1202900863,
        817233897,
        3183342108,
        3401237130,
        1404277552,
        615818150,
        3134207493,
        3453421203,
        1423857449,
        601450431,
        3009837614,
        3294710456,
        1567103746,
        711928724,
        3020668471,
        3272380065,
        1510334235,
        755167117
      ], R = -1, L = 0;
      E.length;
      var F;
      for (F = z; F < g; F++)
        L = (R ^ E[F]) & 255, R = R >>> 8 ^ d[L];
      return R ^ -1;
    }
    var f = c[0].length, a = c[0][0].length, r, i, s, u, o, v, w, h, m, y, P = [
      137,
      80,
      78,
      71,
      13,
      10,
      26,
      10,
      //  0: PNG signature
      0,
      0,
      0,
      13,
      //  8: IHDR Chunk length
      73,
      72,
      68,
      82,
      // 12: "IHDR" 
      a >> 24 & 255,
      a >> 16 & 255,
      a >> 8 & 255,
      a & 255,
      // 16: Width
      f >> 24 & 255,
      f >> 16 & 255,
      f >> 8 & 255,
      f & 255,
      // 20: Height
      8,
      // 24: bit depth
      2,
      // 25: RGB
      0,
      // 26: deflate
      0,
      // 27: no filter
      0,
      // 28: no interlace
      -1,
      -2,
      -3,
      -4,
      // 29: CRC
      -5,
      -6,
      -7,
      -8,
      // 33: IDAT Chunk length
      73,
      68,
      65,
      84,
      // 37: "IDAT"
      // RFC 1950 header starts here
      8,
      // 41: RFC1950 CMF
      29
      // 42: RFC1950 FLG
    ];
    for (y = n(P, 12, 29), P[29] = y >> 24 & 255, P[30] = y >> 16 & 255, P[31] = y >> 8 & 255, P[32] = y & 255, r = 1, i = 0, w = 0; w < f; w++) {
      for (w < f - 1 ? P.push(0) : P.push(1), o = 3 * a + 1 + (w === 0) & 255, v = 3 * a + 1 + (w === 0) >> 8 & 255, P.push(o), P.push(v), P.push(~o & 255), P.push(~v & 255), w === 0 && P.push(0), h = 0; h < a; h++)
        for (s = 0; s < 3; s++)
          o = c[s][w][h], o > 255 ? o = 255 : o < 0 ? o = 0 : o = Math.round(o), r = (r + o) % 65521, i = (i + r) % 65521, P.push(o);
      P.push(0);
    }
    return m = (i << 16) + r, P.push(m >> 24 & 255), P.push(m >> 16 & 255), P.push(m >> 8 & 255), P.push(m & 255), u = P.length - 41, P[33] = u >> 24 & 255, P[34] = u >> 16 & 255, P[35] = u >> 8 & 255, P[36] = u & 255, y = n(P, 37), P.push(y >> 24 & 255), P.push(y >> 16 & 255), P.push(y >> 8 & 255), P.push(y & 255), P.push(0), P.push(0), P.push(0), P.push(0), P.push(73), P.push(69), P.push(78), P.push(68), P.push(174), P.push(66), P.push(96), P.push(130), "data:image/png;base64," + t(P);
  }, numeric._dim = function(c) {
    for (var t = []; typeof c == "object"; )
      t.push(c.length), c = c[0];
    return t;
  }, numeric.dim = function(c) {
    var t, n;
    return typeof c == "object" ? (t = c[0], typeof t == "object" ? (n = t[0], typeof n == "object" ? numeric._dim(c) : [c.length, t.length]) : [c.length]) : [];
  }, numeric.mapreduce = function(c, t) {
    return Function(
      "x",
      "accum",
      "_s",
      "_k",
      'if(typeof accum === "undefined") accum = ' + t + `;
if(typeof x === "number") { var xi = x; ` + c + `; return accum; }
if(typeof _s === "undefined") _s = numeric.dim(x);
if(typeof _k === "undefined") _k = 0;
var _n = _s[_k];
var i,xi;
if(_k < _s.length-1) {
    for(i=_n-1;i>=0;i--) {
        accum = arguments.callee(x[i],accum,_s,_k+1);
    }    return accum;
}
for(i=_n-1;i>=1;i-=2) { 
    xi = x[i];
    ` + c + `;
    xi = x[i-1];
    ` + c + `;
}
if(i === 0) {
    xi = x[i];
    ` + c + `
}
return accum;`
    );
  }, numeric.mapreduce2 = function(c, t) {
    return Function(
      "x",
      `var n = x.length;
var i,xi;
` + t + `;
for(i=n-1;i!==-1;--i) { 
    xi = x[i];
    ` + c + `;
}
return accum;`
    );
  }, numeric.same = function D(c, t) {
    var n, f;
    if (!(c instanceof Array) || !(t instanceof Array) || (f = c.length, f !== t.length))
      return !1;
    for (n = 0; n < f; n++)
      if (c[n] !== t[n])
        if (typeof c[n] == "object") {
          if (!D(c[n], t[n])) return !1;
        } else
          return !1;
    return !0;
  }, numeric.rep = function(c, t, n) {
    typeof n > "u" && (n = 0);
    var f = c[n], a = Array(f), r;
    if (n === c.length - 1) {
      for (r = f - 2; r >= 0; r -= 2)
        a[r + 1] = t, a[r] = t;
      return r === -1 && (a[0] = t), a;
    }
    for (r = f - 1; r >= 0; r--)
      a[r] = numeric.rep(c, t, n + 1);
    return a;
  }, numeric.dotMMsmall = function(c, t) {
    var n, f, a, r, i, s, u, o, v, w, h;
    for (r = c.length, i = t.length, s = t[0].length, u = Array(r), n = r - 1; n >= 0; n--) {
      for (o = Array(s), v = c[n], a = s - 1; a >= 0; a--) {
        for (w = v[i - 1] * t[i - 1][a], f = i - 2; f >= 1; f -= 2)
          h = f - 1, w += v[f] * t[f][a] + v[h] * t[h][a];
        f === 0 && (w += v[0] * t[0][a]), o[a] = w;
      }
      u[n] = o;
    }
    return u;
  }, numeric._getCol = function(c, t, n) {
    var f = c.length, a;
    for (a = f - 1; a > 0; --a)
      n[a] = c[a][t], --a, n[a] = c[a][t];
    a === 0 && (n[0] = c[0][t]);
  }, numeric.dotMMbig = function(c, t) {
    var n = numeric._getCol, f = t.length, a = Array(f), r = c.length, i = t[0].length, s = new Array(r), u, o = numeric.dotVV, v, w;
    for (--f, --r, v = r; v !== -1; --v) s[v] = Array(i);
    for (--i, v = i; v !== -1; --v)
      for (n(t, v, a), w = r; w !== -1; --w)
        u = c[w], s[w][v] = o(u, a);
    return s;
  }, numeric.dotMV = function(c, t) {
    var n = c.length;
    t.length;
    var f, a = Array(n), r = numeric.dotVV;
    for (f = n - 1; f >= 0; f--)
      a[f] = r(c[f], t);
    return a;
  }, numeric.dotVM = function(c, t) {
    var n, f, a, r, i, s, u;
    for (a = c.length, r = t[0].length, i = Array(r), f = r - 1; f >= 0; f--) {
      for (s = c[a - 1] * t[a - 1][f], n = a - 2; n >= 1; n -= 2)
        u = n - 1, s += c[n] * t[n][f] + c[u] * t[u][f];
      n === 0 && (s += c[0] * t[0][f]), i[f] = s;
    }
    return i;
  }, numeric.dotVV = function(c, t) {
    var n, f = c.length, a, r = c[f - 1] * t[f - 1];
    for (n = f - 2; n >= 1; n -= 2)
      a = n - 1, r += c[n] * t[n] + c[a] * t[a];
    return n === 0 && (r += c[0] * t[0]), r;
  }, numeric.dot = function(c, t) {
    var n = numeric.dim;
    switch (n(c).length * 1e3 + n(t).length) {
      case 2002:
        return t.length < 10 ? numeric.dotMMsmall(c, t) : numeric.dotMMbig(c, t);
      case 2001:
        return numeric.dotMV(c, t);
      case 1002:
        return numeric.dotVM(c, t);
      case 1001:
        return numeric.dotVV(c, t);
      case 1e3:
        return numeric.mulVS(c, t);
      case 1:
        return numeric.mulSV(c, t);
      case 0:
        return c * t;
      default:
        throw new Error("numeric.dot only works on vectors and matrices");
    }
  }, numeric.diag = function(c) {
    var t, n, f, a = c.length, r = Array(a), i;
    for (t = a - 1; t >= 0; t--) {
      for (i = Array(a), n = t + 2, f = a - 1; f >= n; f -= 2)
        i[f] = 0, i[f - 1] = 0;
      for (f > t && (i[f] = 0), i[t] = c[t], f = t - 1; f >= 1; f -= 2)
        i[f] = 0, i[f - 1] = 0;
      f === 0 && (i[0] = 0), r[t] = i;
    }
    return r;
  }, numeric.getDiag = function(D) {
    var c = Math.min(D.length, D[0].length), t, n = Array(c);
    for (t = c - 1; t >= 1; --t)
      n[t] = D[t][t], --t, n[t] = D[t][t];
    return t === 0 && (n[0] = D[0][0]), n;
  }, numeric.identity = function(c) {
    return numeric.diag(numeric.rep([c], 1));
  }, numeric.pointwise = function(c, t, n) {
    typeof n > "u" && (n = "");
    var f = [], a, r = /\[i\]$/, i, s = "", u = !1;
    for (a = 0; a < c.length; a++)
      r.test(c[a]) ? (i = c[a].substring(0, c[a].length - 3), s = i) : i = c[a], i === "ret" && (u = !0), f.push(i);
    return f[c.length] = "_s", f[c.length + 1] = "_k", f[c.length + 2] = 'if(typeof _s === "undefined") _s = numeric.dim(' + s + `);
if(typeof _k === "undefined") _k = 0;
var _n = _s[_k];
var i` + (u ? "" : ", ret = Array(_n)") + `;
if(_k < _s.length-1) {
    for(i=_n-1;i>=0;i--) ret[i] = arguments.callee(` + c.join(",") + `,_s,_k+1);
    return ret;
}
` + n + `
for(i=_n-1;i!==-1;--i) {
    ` + t + `
}
return ret;`, Function.apply(null, f);
  }, numeric.pointwise2 = function(c, t, n) {
    typeof n > "u" && (n = "");
    var f = [], a, r = /\[i\]$/, i, s = "", u = !1;
    for (a = 0; a < c.length; a++)
      r.test(c[a]) ? (i = c[a].substring(0, c[a].length - 3), s = i) : i = c[a], i === "ret" && (u = !0), f.push(i);
    return f[c.length] = "var _n = " + s + `.length;
var i` + (u ? "" : ", ret = Array(_n)") + `;
` + n + `
for(i=_n-1;i!==-1;--i) {
` + t + `
}
return ret;`, Function.apply(null, f);
  }, numeric._biforeach = function D(c, t, n, f, a) {
    if (f === n.length - 1) {
      a(c, t);
      return;
    }
    var r, i = n[f];
    for (r = i - 1; r >= 0; r--)
      D(typeof c == "object" ? c[r] : c, typeof t == "object" ? t[r] : t, n, f + 1, a);
  }, numeric._biforeach2 = function D(c, t, n, f, a) {
    if (f === n.length - 1)
      return a(c, t);
    var r, i = n[f], s = Array(i);
    for (r = i - 1; r >= 0; --r)
      s[r] = D(typeof c == "object" ? c[r] : c, typeof t == "object" ? t[r] : t, n, f + 1, a);
    return s;
  }, numeric._foreach = function D(c, t, n, f) {
    if (n === t.length - 1) {
      f(c);
      return;
    }
    var a, r = t[n];
    for (a = r - 1; a >= 0; a--)
      D(c[a], t, n + 1, f);
  }, numeric._foreach2 = function D(c, t, n, f) {
    if (n === t.length - 1)
      return f(c);
    var a, r = t[n], i = Array(r);
    for (a = r - 1; a >= 0; a--)
      i[a] = D(c[a], t, n + 1, f);
    return i;
  }, numeric.ops2 = {
    add: "+",
    sub: "-",
    mul: "*",
    div: "/",
    mod: "%",
    and: "&&",
    or: "||",
    eq: "===",
    neq: "!==",
    lt: "<",
    gt: ">",
    leq: "<=",
    geq: ">=",
    band: "&",
    bor: "|",
    bxor: "^",
    lshift: "<<",
    rshift: ">>",
    rrshift: ">>>"
  }, numeric.opseq = {
    addeq: "+=",
    subeq: "-=",
    muleq: "*=",
    diveq: "/=",
    modeq: "%=",
    lshifteq: "<<=",
    rshifteq: ">>=",
    rrshifteq: ">>>=",
    bandeq: "&=",
    boreq: "|=",
    bxoreq: "^="
  }, numeric.mathfuns = [
    "abs",
    "acos",
    "asin",
    "atan",
    "ceil",
    "cos",
    "exp",
    "floor",
    "log",
    "round",
    "sin",
    "sqrt",
    "tan",
    "isNaN",
    "isFinite"
  ], numeric.mathfuns2 = ["atan2", "pow", "max", "min"], numeric.ops1 = {
    neg: "-",
    not: "!",
    bnot: "~",
    clone: ""
  }, numeric.mapreducers = {
    any: ["if(xi) return true;", "var accum = false;"],
    all: ["if(!xi) return false;", "var accum = true;"],
    sum: ["accum += xi;", "var accum = 0;"],
    prod: ["accum *= xi;", "var accum = 1;"],
    norm2Squared: ["accum += xi*xi;", "var accum = 0;"],
    norminf: ["accum = max(accum,abs(xi));", "var accum = 0, max = Math.max, abs = Math.abs;"],
    norm1: ["accum += abs(xi)", "var accum = 0, abs = Math.abs;"],
    sup: ["accum = max(accum,xi);", "var accum = -Infinity, max = Math.max;"],
    inf: ["accum = min(accum,xi);", "var accum = Infinity, min = Math.min;"]
  }, (function() {
    var D, c;
    for (D = 0; D < numeric.mathfuns2.length; ++D)
      c = numeric.mathfuns2[D], numeric.ops2[c] = c;
    for (D in numeric.ops2)
      if (numeric.ops2.hasOwnProperty(D)) {
        c = numeric.ops2[D];
        var t, n, f = "";
        numeric.myIndexOf.call(numeric.mathfuns2, D) !== -1 ? (f = "var " + c + " = Math." + c + `;
`, t = function(a, r, i) {
          return a + " = " + c + "(" + r + "," + i + ")";
        }, n = function(a, r) {
          return a + " = " + c + "(" + a + "," + r + ")";
        }) : (t = function(a, r, i) {
          return a + " = " + r + " " + c + " " + i;
        }, numeric.opseq.hasOwnProperty(D + "eq") ? n = function(a, r) {
          return a + " " + c + "= " + r;
        } : n = function(a, r) {
          return a + " = " + a + " " + c + " " + r;
        }), numeric[D + "VV"] = numeric.pointwise2(["x[i]", "y[i]"], t("ret[i]", "x[i]", "y[i]"), f), numeric[D + "SV"] = numeric.pointwise2(["x", "y[i]"], t("ret[i]", "x", "y[i]"), f), numeric[D + "VS"] = numeric.pointwise2(["x[i]", "y"], t("ret[i]", "x[i]", "y"), f), numeric[D] = Function(
          `var n = arguments.length, i, x = arguments[0], y;
var VV = numeric.` + D + "VV, VS = numeric." + D + "VS, SV = numeric." + D + `SV;
var dim = numeric.dim;
for(i=1;i!==n;++i) { 
  y = arguments[i];
  if(typeof x === "object") {
      if(typeof y === "object") x = numeric._biforeach2(x,y,dim(x),0,VV);
      else x = numeric._biforeach2(x,y,dim(x),0,VS);
  } else if(typeof y === "object") x = numeric._biforeach2(x,y,dim(y),0,SV);
  else ` + n("x", "y") + `
}
return x;
`
        ), numeric[c] = numeric[D], numeric[D + "eqV"] = numeric.pointwise2(["ret[i]", "x[i]"], n("ret[i]", "x[i]"), f), numeric[D + "eqS"] = numeric.pointwise2(["ret[i]", "x"], n("ret[i]", "x"), f), numeric[D + "eq"] = Function(
          `var n = arguments.length, i, x = arguments[0], y;
var V = numeric.` + D + "eqV, S = numeric." + D + `eqS
var s = numeric.dim(x);
for(i=1;i!==n;++i) { 
  y = arguments[i];
  if(typeof y === "object") numeric._biforeach(x,y,s,0,V);
  else numeric._biforeach(x,y,s,0,S);
}
return x;
`
        );
      }
    for (D = 0; D < numeric.mathfuns2.length; ++D)
      c = numeric.mathfuns2[D], delete numeric.ops2[c];
    for (D = 0; D < numeric.mathfuns.length; ++D)
      c = numeric.mathfuns[D], numeric.ops1[c] = c;
    for (D in numeric.ops1)
      numeric.ops1.hasOwnProperty(D) && (f = "", c = numeric.ops1[D], numeric.myIndexOf.call(numeric.mathfuns, D) !== -1 && Math.hasOwnProperty(c) && (f = "var " + c + " = Math." + c + `;
`), numeric[D + "eqV"] = numeric.pointwise2(["ret[i]"], "ret[i] = " + c + "(ret[i]);", f), numeric[D + "eq"] = Function(
        "x",
        'if(typeof x !== "object") return ' + c + `x
var i;
var V = numeric.` + D + `eqV;
var s = numeric.dim(x);
numeric._foreach(x,s,0,V);
return x;
`
      ), numeric[D + "V"] = numeric.pointwise2(["x[i]"], "ret[i] = " + c + "(x[i]);", f), numeric[D] = Function(
        "x",
        'if(typeof x !== "object") return ' + c + `(x)
var i;
var V = numeric.` + D + `V;
var s = numeric.dim(x);
return numeric._foreach2(x,s,0,V);
`
      ));
    for (D = 0; D < numeric.mathfuns.length; ++D)
      c = numeric.mathfuns[D], delete numeric.ops1[c];
    for (D in numeric.mapreducers)
      numeric.mapreducers.hasOwnProperty(D) && (c = numeric.mapreducers[D], numeric[D + "V"] = numeric.mapreduce2(c[0], c[1]), numeric[D] = Function(
        "x",
        "s",
        "k",
        c[1] + `if(typeof x !== "object") {    xi = x;
` + c[0] + `;
    return accum;
}if(typeof s === "undefined") s = numeric.dim(x);
if(typeof k === "undefined") k = 0;
if(k === s.length-1) return numeric.` + D + `V(x);
var xi;
var n = x.length, i;
for(i=n-1;i!==-1;--i) {
   xi = arguments.callee(x[i]);
` + c[0] + `;
}
return accum;
`
      ));
  })(), numeric.truncVV = numeric.pointwise(["x[i]", "y[i]"], "ret[i] = round(x[i]/y[i])*y[i];", "var round = Math.round;"), numeric.truncVS = numeric.pointwise(["x[i]", "y"], "ret[i] = round(x[i]/y)*y;", "var round = Math.round;"), numeric.truncSV = numeric.pointwise(["x", "y[i]"], "ret[i] = round(x/y[i])*y[i];", "var round = Math.round;"), numeric.trunc = function(c, t) {
    return typeof c == "object" ? typeof t == "object" ? numeric.truncVV(c, t) : numeric.truncVS(c, t) : typeof t == "object" ? numeric.truncSV(c, t) : Math.round(c / t) * t;
  }, numeric.inv = function(y) {
    var t = numeric.dim(y), n = Math.abs, f = t[0], a = t[1], r = numeric.clone(y), i, s, u = numeric.identity(f), o, v, w, h, m, y;
    for (h = 0; h < a; ++h) {
      var P = -1, E = -1;
      for (w = h; w !== f; ++w)
        m = n(r[w][h]), m > E && (P = w, E = m);
      for (s = r[P], r[P] = r[h], r[h] = s, v = u[P], u[P] = u[h], u[h] = v, y = s[h], m = h; m !== a; ++m) s[m] /= y;
      for (m = a - 1; m !== -1; --m) v[m] /= y;
      for (w = f - 1; w !== -1; --w)
        if (w !== h) {
          for (i = r[w], o = u[w], y = i[h], m = h + 1; m !== a; ++m) i[m] -= s[m] * y;
          for (m = a - 1; m > 0; --m)
            o[m] -= v[m] * y, --m, o[m] -= v[m] * y;
          m === 0 && (o[0] -= v[0] * y);
        }
    }
    return u;
  }, numeric.det = function(c) {
    var t = numeric.dim(c);
    if (t.length !== 2 || t[0] !== t[1])
      throw new Error("numeric: det() only works on square matrices");
    var n = t[0], f = 1, a, r, i, s = numeric.clone(c), u, o, v, w, h;
    for (r = 0; r < n - 1; r++) {
      for (i = r, a = r + 1; a < n; a++)
        Math.abs(s[a][r]) > Math.abs(s[i][r]) && (i = a);
      for (i !== r && (w = s[i], s[i] = s[r], s[r] = w, f *= -1), u = s[r], a = r + 1; a < n; a++) {
        for (o = s[a], v = o[r] / u[r], i = r + 1; i < n - 1; i += 2)
          h = i + 1, o[i] -= u[i] * v, o[h] -= u[h] * v;
        i !== n && (o[i] -= u[i] * v);
      }
      if (u[r] === 0)
        return 0;
      f *= u[r];
    }
    return f * s[r][r];
  }, numeric.transpose = function(c) {
    var t, n, f = c.length, a = c[0].length, r = Array(a), i, s, u;
    for (n = 0; n < a; n++) r[n] = Array(f);
    for (t = f - 1; t >= 1; t -= 2) {
      for (s = c[t], i = c[t - 1], n = a - 1; n >= 1; --n)
        u = r[n], u[t] = s[n], u[t - 1] = i[n], --n, u = r[n], u[t] = s[n], u[t - 1] = i[n];
      n === 0 && (u = r[0], u[t] = s[0], u[t - 1] = i[0]);
    }
    if (t === 0) {
      for (i = c[0], n = a - 1; n >= 1; --n)
        r[n][0] = i[n], --n, r[n][0] = i[n];
      n === 0 && (r[0][0] = i[0]);
    }
    return r;
  }, numeric.negtranspose = function(c) {
    var t, n, f = c.length, a = c[0].length, r = Array(a), i, s, u;
    for (n = 0; n < a; n++) r[n] = Array(f);
    for (t = f - 1; t >= 1; t -= 2) {
      for (s = c[t], i = c[t - 1], n = a - 1; n >= 1; --n)
        u = r[n], u[t] = -s[n], u[t - 1] = -i[n], --n, u = r[n], u[t] = -s[n], u[t - 1] = -i[n];
      n === 0 && (u = r[0], u[t] = -s[0], u[t - 1] = -i[0]);
    }
    if (t === 0) {
      for (i = c[0], n = a - 1; n >= 1; --n)
        r[n][0] = -i[n], --n, r[n][0] = -i[n];
      n === 0 && (r[0][0] = -i[0]);
    }
    return r;
  }, numeric._random = function D(c, t) {
    var n, f = c[t], a = Array(f), r;
    if (t === c.length - 1) {
      for (r = Math.random, n = f - 1; n >= 1; n -= 2)
        a[n] = r(), a[n - 1] = r();
      return n === 0 && (a[0] = r()), a;
    }
    for (n = f - 1; n >= 0; n--) a[n] = D(c, t + 1);
    return a;
  }, numeric.random = function(c) {
    return numeric._random(c, 0);
  }, numeric.norm2 = function(c) {
    return Math.sqrt(numeric.norm2Squared(c));
  }, numeric.linspace = function(c, t, n) {
    if (typeof n > "u" && (n = Math.max(Math.round(t - c) + 1, 1)), n < 2)
      return n === 1 ? [c] : [];
    var f, a = Array(n);
    for (n--, f = n; f >= 0; f--)
      a[f] = (f * t + (n - f) * c) / n;
    return a;
  }, numeric.getBlock = function(c, t, n) {
    var f = numeric.dim(c);
    function a(r, i) {
      var s, u = t[i], o = n[i] - u, v = Array(o);
      if (i === f.length - 1) {
        for (s = o; s >= 0; s--)
          v[s] = r[s + u];
        return v;
      }
      for (s = o; s >= 0; s--)
        v[s] = a(r[s + u], i + 1);
      return v;
    }
    return a(c, 0);
  }, numeric.setBlock = function(c, t, n, f) {
    var a = numeric.dim(c);
    function r(i, s, u) {
      var o, v = t[u], w = n[u] - v;
      if (u === a.length - 1)
        for (o = w; o >= 0; o--)
          i[o + v] = s[o];
      for (o = w; o >= 0; o--)
        r(i[o + v], s[o], u + 1);
    }
    return r(c, f, 0), c;
  }, numeric.getRange = function(c, t, n) {
    var f = t.length, a = n.length, r, i, s = Array(f), u, o;
    for (r = f - 1; r !== -1; --r)
      for (s[r] = Array(a), u = s[r], o = c[t[r]], i = a - 1; i !== -1; --i) u[i] = o[n[i]];
    return s;
  }, numeric.blockMatrix = function(c) {
    var t = numeric.dim(c);
    if (t.length < 4) return numeric.blockMatrix([c]);
    var n = t[0], f = t[1], a, r, i, s, u;
    for (a = 0, r = 0, i = 0; i < n; ++i) a += c[i][0].length;
    for (s = 0; s < f; ++s) r += c[0][s][0].length;
    var o = Array(a);
    for (i = 0; i < a; ++i) o[i] = Array(r);
    var v = 0, w, h, m, y, P;
    for (i = 0; i < n; ++i) {
      for (w = r, s = f - 1; s !== -1; --s)
        for (u = c[i][s], w -= u[0].length, m = u.length - 1; m !== -1; --m)
          for (P = u[m], h = o[v + m], y = P.length - 1; y !== -1; --y) h[w + y] = P[y];
      v += c[i][0].length;
    }
    return o;
  }, numeric.tensor = function(c, t) {
    if (typeof c == "number" || typeof t == "number") return numeric.mul(c, t);
    var n = numeric.dim(c), f = numeric.dim(t);
    if (n.length !== 1 || f.length !== 1)
      throw new Error("numeric: tensor product is only defined for vectors");
    var a = n[0], r = f[0], i = Array(a), s, u, o, v;
    for (u = a - 1; u >= 0; u--) {
      for (s = Array(r), v = c[u], o = r - 1; o >= 3; --o)
        s[o] = v * t[o], --o, s[o] = v * t[o], --o, s[o] = v * t[o], --o, s[o] = v * t[o];
      for (; o >= 0; )
        s[o] = v * t[o], --o;
      i[u] = s;
    }
    return i;
  }, numeric.T = function(c, t) {
    this.x = c, this.y = t;
  }, numeric.t = function(c, t) {
    return new numeric.T(c, t);
  }, numeric.Tbinop = function(c, t, n, f, a) {
    if (numeric.indexOf, typeof a != "string") {
      var r;
      a = "";
      for (r in numeric)
        numeric.hasOwnProperty(r) && (c.indexOf(r) >= 0 || t.indexOf(r) >= 0 || n.indexOf(r) >= 0 || f.indexOf(r) >= 0) && r.length > 1 && (a += "var " + r + " = numeric." + r + `;
`);
    }
    return Function(
      ["y"],
      `var x = this;
if(!(y instanceof numeric.T)) { y = new numeric.T(y); }
` + a + `
if(x.y) {  if(y.y) {    return new numeric.T(` + f + `);
  }
  return new numeric.T(` + n + `);
}
if(y.y) {
  return new numeric.T(` + t + `);
}
return new numeric.T(` + c + `);
`
    );
  }, numeric.T.prototype.add = numeric.Tbinop(
    "add(x.x,y.x)",
    "add(x.x,y.x),y.y",
    "add(x.x,y.x),x.y",
    "add(x.x,y.x),add(x.y,y.y)"
  ), numeric.T.prototype.sub = numeric.Tbinop(
    "sub(x.x,y.x)",
    "sub(x.x,y.x),neg(y.y)",
    "sub(x.x,y.x),x.y",
    "sub(x.x,y.x),sub(x.y,y.y)"
  ), numeric.T.prototype.mul = numeric.Tbinop(
    "mul(x.x,y.x)",
    "mul(x.x,y.x),mul(x.x,y.y)",
    "mul(x.x,y.x),mul(x.y,y.x)",
    "sub(mul(x.x,y.x),mul(x.y,y.y)),add(mul(x.x,y.y),mul(x.y,y.x))"
  ), numeric.T.prototype.reciprocal = function() {
    var c = numeric.mul, t = numeric.div;
    if (this.y) {
      var n = numeric.add(c(this.x, this.x), c(this.y, this.y));
      return new numeric.T(t(this.x, n), t(numeric.neg(this.y), n));
    }
    return new T(t(1, this.x));
  }, numeric.T.prototype.div = function(c) {
    if (c instanceof numeric.T || (c = new numeric.T(c)), c.y)
      return this.mul(c.reciprocal());
    var t = numeric.div;
    return this.y ? new numeric.T(t(this.x, c.x), t(this.y, c.x)) : new numeric.T(t(this.x, c.x));
  }, numeric.T.prototype.dot = numeric.Tbinop(
    "dot(x.x,y.x)",
    "dot(x.x,y.x),dot(x.x,y.y)",
    "dot(x.x,y.x),dot(x.y,y.x)",
    "sub(dot(x.x,y.x),dot(x.y,y.y)),add(dot(x.x,y.y),dot(x.y,y.x))"
  ), numeric.T.prototype.transpose = function() {
    var c = numeric.transpose, t = this.x, n = this.y;
    return n ? new numeric.T(c(t), c(n)) : new numeric.T(c(t));
  }, numeric.T.prototype.transjugate = function() {
    var c = numeric.transpose, t = this.x, n = this.y;
    return n ? new numeric.T(c(t), numeric.negtranspose(n)) : new numeric.T(c(t));
  }, numeric.Tunop = function(c, t, n) {
    return typeof n != "string" && (n = ""), Function(
      `var x = this;
` + n + `
if(x.y) {  ` + t + `;
}
` + c + `;
`
    );
  }, numeric.T.prototype.exp = numeric.Tunop(
    "return new numeric.T(ex)",
    "return new numeric.T(mul(cos(x.y),ex),mul(sin(x.y),ex))",
    "var ex = numeric.exp(x.x), cos = numeric.cos, sin = numeric.sin, mul = numeric.mul;"
  ), numeric.T.prototype.conj = numeric.Tunop(
    "return new numeric.T(x.x);",
    "return new numeric.T(x.x,numeric.neg(x.y));"
  ), numeric.T.prototype.neg = numeric.Tunop(
    "return new numeric.T(neg(x.x));",
    "return new numeric.T(neg(x.x),neg(x.y));",
    "var neg = numeric.neg;"
  ), numeric.T.prototype.sin = numeric.Tunop(
    "return new numeric.T(numeric.sin(x.x))",
    "return x.exp().sub(x.neg().exp()).div(new numeric.T(0,2));"
  ), numeric.T.prototype.cos = numeric.Tunop(
    "return new numeric.T(numeric.cos(x.x))",
    "return x.exp().add(x.neg().exp()).div(2);"
  ), numeric.T.prototype.abs = numeric.Tunop(
    "return new numeric.T(numeric.abs(x.x));",
    "return new numeric.T(numeric.sqrt(numeric.add(mul(x.x,x.x),mul(x.y,x.y))));",
    "var mul = numeric.mul;"
  ), numeric.T.prototype.log = numeric.Tunop(
    "return new numeric.T(numeric.log(x.x));",
    `var theta = new numeric.T(numeric.atan2(x.y,x.x)), r = x.abs();
return new numeric.T(numeric.log(r.x),theta.x);`
  ), numeric.T.prototype.norm2 = numeric.Tunop(
    "return numeric.norm2(x.x);",
    `var f = numeric.norm2Squared;
return Math.sqrt(f(x.x)+f(x.y));`
  ), numeric.T.prototype.inv = function() {
    var c = this;
    if (typeof c.y > "u")
      return new numeric.T(numeric.inv(c.x));
    var t = c.x.length, y, P, E, n = numeric.identity(t), f = numeric.rep([t, t], 0), a = numeric.clone(c.x), r = numeric.clone(c.y), i, s, u, o, v, w, h, m, y, P, E, z, g, d, R, L, F, l;
    for (y = 0; y < t; y++) {
      for (d = a[y][y], R = r[y][y], z = d * d + R * R, E = y, P = y + 1; P < t; P++)
        d = a[P][y], R = r[P][y], g = d * d + R * R, g > z && (E = P, z = g);
      for (E !== y && (l = a[y], a[y] = a[E], a[E] = l, l = r[y], r[y] = r[E], r[E] = l, l = n[y], n[y] = n[E], n[E] = l, l = f[y], f[y] = f[E], f[E] = l), i = a[y], s = r[y], v = n[y], w = f[y], d = i[y], R = s[y], P = y + 1; P < t; P++)
        L = i[P], F = s[P], i[P] = (L * d + F * R) / z, s[P] = (F * d - L * R) / z;
      for (P = 0; P < t; P++)
        L = v[P], F = w[P], v[P] = (L * d + F * R) / z, w[P] = (F * d - L * R) / z;
      for (P = y + 1; P < t; P++) {
        for (u = a[P], o = r[P], h = n[P], m = f[P], d = u[y], R = o[y], E = y + 1; E < t; E++)
          L = i[E], F = s[E], u[E] -= L * d - F * R, o[E] -= F * d + L * R;
        for (E = 0; E < t; E++)
          L = v[E], F = w[E], h[E] -= L * d - F * R, m[E] -= F * d + L * R;
      }
    }
    for (y = t - 1; y > 0; y--)
      for (v = n[y], w = f[y], P = y - 1; P >= 0; P--)
        for (h = n[P], m = f[P], d = a[P][y], R = r[P][y], E = t - 1; E >= 0; E--)
          L = v[E], F = w[E], h[E] -= d * L - R * F, m[E] -= d * F + R * L;
    return new numeric.T(n, f);
  }, numeric.T.prototype.get = function(c) {
    var t = this.x, n = this.y, f = 0, a, r = c.length;
    if (n) {
      for (; f < r; )
        a = c[f], t = t[a], n = n[a], f++;
      return new numeric.T(t, n);
    }
    for (; f < r; )
      a = c[f], t = t[a], f++;
    return new numeric.T(t);
  }, numeric.T.prototype.set = function(c, t) {
    var n = this.x, f = this.y, a = 0, r, i = c.length, s = t.x, u = t.y;
    if (i === 0)
      return u ? this.y = u : f && (this.y = void 0), this.x = n, this;
    if (u) {
      for (f || (f = numeric.rep(numeric.dim(n), 0), this.y = f); a < i - 1; )
        r = c[a], n = n[r], f = f[r], a++;
      return r = c[a], n[r] = s, f[r] = u, this;
    }
    if (f) {
      for (; a < i - 1; )
        r = c[a], n = n[r], f = f[r], a++;
      return r = c[a], n[r] = s, s instanceof Array ? f[r] = numeric.rep(numeric.dim(s), 0) : f[r] = 0, this;
    }
    for (; a < i - 1; )
      r = c[a], n = n[r], a++;
    return r = c[a], n[r] = s, this;
  }, numeric.T.prototype.getRows = function(c, t) {
    var n = t - c + 1, f, a = Array(n), r, i = this.x, s = this.y;
    for (f = c; f <= t; f++)
      a[f - c] = i[f];
    if (s) {
      for (r = Array(n), f = c; f <= t; f++)
        r[f - c] = s[f];
      return new numeric.T(a, r);
    }
    return new numeric.T(a);
  }, numeric.T.prototype.setRows = function(c, t, n) {
    var f, a = this.x, r = this.y, i = n.x, s = n.y;
    for (f = c; f <= t; f++)
      a[f] = i[f - c];
    if (s)
      for (r || (r = numeric.rep(numeric.dim(a), 0), this.y = r), f = c; f <= t; f++)
        r[f] = s[f - c];
    else if (r)
      for (f = c; f <= t; f++)
        r[f] = numeric.rep([i[f - c].length], 0);
    return this;
  }, numeric.T.prototype.getRow = function(c) {
    var t = this.x, n = this.y;
    return n ? new numeric.T(t[c], n[c]) : new numeric.T(t[c]);
  }, numeric.T.prototype.setRow = function(c, t) {
    var n = this.x, f = this.y, a = t.x, r = t.y;
    return n[c] = a, r ? (f || (f = numeric.rep(numeric.dim(n), 0), this.y = f), f[c] = r) : f && (f = numeric.rep([a.length], 0)), this;
  }, numeric.T.prototype.getBlock = function(c, t) {
    var n = this.x, f = this.y, a = numeric.getBlock;
    return f ? new numeric.T(a(n, c, t), a(f, c, t)) : new numeric.T(a(n, c, t));
  }, numeric.T.prototype.setBlock = function(c, t, n) {
    n instanceof numeric.T || (n = new numeric.T(n));
    var f = this.x, a = this.y, r = numeric.setBlock, i = n.x, s = n.y;
    if (s)
      return a || (this.y = numeric.rep(numeric.dim(this), 0), a = this.y), r(f, c, t, i), r(a, c, t, s), this;
    r(f, c, t, i), a && r(a, c, t, numeric.rep(numeric.dim(i), 0));
  }, numeric.T.rep = function(c, t) {
    var n = numeric.T;
    t instanceof n || (t = new n(t));
    var f = t.x, a = t.y, r = numeric.rep;
    return a ? new n(r(c, f), r(c, a)) : new n(r(c, f));
  }, numeric.T.diag = function(c) {
    c instanceof numeric.T || (c = new numeric.T(c));
    var t = c.x, n = c.y, f = numeric.diag;
    return n ? new numeric.T(f(t), f(n)) : new numeric.T(f(t));
  }, numeric.T.eig = function() {
    if (this.y)
      throw new Error("eig: not implemented for complex matrices.");
    return numeric.eig(this.x);
  }, numeric.T.identity = function(c) {
    return new numeric.T(numeric.identity(c));
  }, numeric.T.prototype.getDiag = function() {
    var c = numeric, t = this.x, n = this.y;
    return n ? new c.T(c.getDiag(t), c.getDiag(n)) : new c.T(c.getDiag(t));
  }, numeric.house = function(c) {
    var t = numeric.clone(c), n = c[0] >= 0 ? 1 : -1, f = n * numeric.norm2(c);
    t[0] += f;
    var a = numeric.norm2(t);
    if (a === 0)
      throw new Error("eig: internal error");
    return numeric.div(t, a);
  }, numeric.toUpperHessenberg = function(c) {
    var t = numeric.dim(c);
    if (t.length !== 2 || t[0] !== t[1])
      throw new Error("numeric: toUpperHessenberg() only works on square matrices");
    var n = t[0], f, a, r, i, s, u = numeric.clone(c), o, v, w, h, m = numeric.identity(n), y;
    for (a = 0; a < n - 2; a++) {
      for (i = Array(n - a - 1), f = a + 1; f < n; f++)
        i[f - a - 1] = u[f][a];
      if (numeric.norm2(i) > 0) {
        for (s = numeric.house(i), o = numeric.getBlock(u, [a + 1, a], [n - 1, n - 1]), v = numeric.tensor(s, numeric.dot(s, o)), f = a + 1; f < n; f++)
          for (w = u[f], h = v[f - a - 1], r = a; r < n; r++) w[r] -= 2 * h[r - a];
        for (o = numeric.getBlock(u, [0, a + 1], [n - 1, n - 1]), v = numeric.tensor(numeric.dot(o, s), s), f = 0; f < n; f++)
          for (w = u[f], h = v[f], r = a + 1; r < n; r++) w[r] -= 2 * h[r - a - 1];
        for (o = Array(n - a - 1), f = a + 1; f < n; f++) o[f - a - 1] = m[f];
        for (v = numeric.tensor(s, numeric.dot(s, o)), f = a + 1; f < n; f++)
          for (y = m[f], h = v[f - a - 1], r = 0; r < n; r++) y[r] -= 2 * h[r];
      }
    }
    return { H: u, Q: m };
  }, numeric.epsilon = 2220446049250313e-31, numeric.QRFrancis = function(D, c) {
    typeof c > "u" && (c = 1e4), D = numeric.clone(D), numeric.clone(D);
    var t = numeric.dim(D), n = t[0], f, a, r, i, s, u, o, v, w, h = numeric.identity(n), m, y, P, E, z, g, d, R, L;
    if (n < 3)
      return { Q: h, B: [[0, n - 1]] };
    var F = numeric.epsilon;
    for (L = 0; L < c; L++) {
      for (d = 0; d < n - 1; d++)
        if (Math.abs(D[d + 1][d]) < F * (Math.abs(D[d][d]) + Math.abs(D[d + 1][d + 1]))) {
          var l = numeric.QRFrancis(numeric.getBlock(D, [0, 0], [d, d]), c), S = numeric.QRFrancis(numeric.getBlock(D, [d + 1, d + 1], [n - 1, n - 1]), c);
          for (P = Array(d + 1), g = 0; g <= d; g++)
            P[g] = h[g];
          for (E = numeric.dot(l.Q, P), g = 0; g <= d; g++)
            h[g] = E[g];
          for (P = Array(n - d - 1), g = d + 1; g < n; g++)
            P[g - d - 1] = h[g];
          for (E = numeric.dot(S.Q, P), g = d + 1; g < n; g++)
            h[g] = E[g - d - 1];
          return { Q: h, B: l.B.concat(numeric.add(S.B, d + 1)) };
        }
      if (r = D[n - 2][n - 2], i = D[n - 2][n - 1], s = D[n - 1][n - 2], u = D[n - 1][n - 1], v = r + u, o = r * u - i * s, w = numeric.getBlock(D, [0, 0], [2, 2]), v * v >= 4 * o) {
        var O, j;
        O = 0.5 * (v + Math.sqrt(v * v - 4 * o)), j = 0.5 * (v - Math.sqrt(v * v - 4 * o)), w = numeric.add(
          numeric.sub(
            numeric.dot(w, w),
            numeric.mul(w, O + j)
          ),
          numeric.diag(numeric.rep([3], O * j))
        );
      } else
        w = numeric.add(
          numeric.sub(
            numeric.dot(w, w),
            numeric.mul(w, v)
          ),
          numeric.diag(numeric.rep([3], o))
        );
      for (f = [w[0][0], w[1][0], w[2][0]], a = numeric.house(f), P = [D[0], D[1], D[2]], E = numeric.tensor(a, numeric.dot(a, P)), g = 0; g < 3; g++)
        for (y = D[g], z = E[g], R = 0; R < n; R++) y[R] -= 2 * z[R];
      for (P = numeric.getBlock(D, [0, 0], [n - 1, 2]), E = numeric.tensor(numeric.dot(P, a), a), g = 0; g < n; g++)
        for (y = D[g], z = E[g], R = 0; R < 3; R++) y[R] -= 2 * z[R];
      for (P = [h[0], h[1], h[2]], E = numeric.tensor(a, numeric.dot(a, P)), g = 0; g < 3; g++)
        for (m = h[g], z = E[g], R = 0; R < n; R++) m[R] -= 2 * z[R];
      var Y;
      for (d = 0; d < n - 2; d++) {
        for (R = d; R <= d + 1; R++)
          if (Math.abs(D[R + 1][R]) < F * (Math.abs(D[R][R]) + Math.abs(D[R + 1][R + 1]))) {
            var l = numeric.QRFrancis(numeric.getBlock(D, [0, 0], [R, R]), c), S = numeric.QRFrancis(numeric.getBlock(D, [R + 1, R + 1], [n - 1, n - 1]), c);
            for (P = Array(R + 1), g = 0; g <= R; g++)
              P[g] = h[g];
            for (E = numeric.dot(l.Q, P), g = 0; g <= R; g++)
              h[g] = E[g];
            for (P = Array(n - R - 1), g = R + 1; g < n; g++)
              P[g - R - 1] = h[g];
            for (E = numeric.dot(S.Q, P), g = R + 1; g < n; g++)
              h[g] = E[g - R - 1];
            return { Q: h, B: l.B.concat(numeric.add(S.B, R + 1)) };
          }
        for (Y = Math.min(n - 1, d + 3), f = Array(Y - d), g = d + 1; g <= Y; g++)
          f[g - d - 1] = D[g][d];
        for (a = numeric.house(f), P = numeric.getBlock(D, [d + 1, d], [Y, n - 1]), E = numeric.tensor(a, numeric.dot(a, P)), g = d + 1; g <= Y; g++)
          for (y = D[g], z = E[g - d - 1], R = d; R < n; R++) y[R] -= 2 * z[R - d];
        for (P = numeric.getBlock(D, [0, d + 1], [n - 1, Y]), E = numeric.tensor(numeric.dot(P, a), a), g = 0; g < n; g++)
          for (y = D[g], z = E[g], R = d + 1; R <= Y; R++) y[R] -= 2 * z[R - d - 1];
        for (P = Array(Y - d), g = d + 1; g <= Y; g++) P[g - d - 1] = h[g];
        for (E = numeric.tensor(a, numeric.dot(a, P)), g = d + 1; g <= Y; g++)
          for (m = h[g], z = E[g - d - 1], R = 0; R < n; R++) m[R] -= 2 * z[R];
      }
    }
    throw new Error("numeric: eigenvalue iteration does not converge -- increase maxiter?");
  }, numeric.eig = function(c, t) {
    var n = numeric.toUpperHessenberg(c), f = numeric.QRFrancis(n.H, t), a = numeric.T, W = c.length, r, i, s = f.B, u = numeric.dot(f.Q, numeric.dot(n.H, numeric.transpose(f.Q))), o = new a(numeric.dot(f.Q, n.Q)), v, w = s.length, h, m, y, P, E, z, g, d, R, L, F, l, S, O, j = Math.sqrt;
    for (i = 0; i < w; i++)
      if (r = s[i][0], r !== s[i][1]) {
        if (h = r + 1, m = u[r][r], y = u[r][h], P = u[h][r], E = u[h][h], y === 0 && P === 0) continue;
        z = -m - E, g = m * E - y * P, d = z * z - 4 * g, d >= 0 ? (z < 0 ? R = -0.5 * (z - j(d)) : R = -0.5 * (z + j(d)), S = (m - R) * (m - R) + y * y, O = P * P + (E - R) * (E - R), S > O ? (S = j(S), F = (m - R) / S, l = y / S) : (O = j(O), F = P / O, l = (E - R) / O), v = new a([[l, -F], [F, l]]), o.setRows(r, h, v.dot(o.getRows(r, h)))) : (R = -0.5 * z, L = 0.5 * j(-d), S = (m - R) * (m - R) + y * y, O = P * P + (E - R) * (E - R), S > O ? (S = j(S + L * L), F = (m - R) / S, l = y / S, R = 0, L /= S) : (O = j(O + L * L), F = P / O, l = (E - R) / O, R = L / O, L = 0), v = new a([[l, -F], [F, l]], [[R, L], [L, -R]]), o.setRows(r, h, v.dot(o.getRows(r, h))));
      }
    var Y = o.dot(c).dot(o.transjugate()), W = c.length, er = numeric.T.identity(W);
    for (h = 0; h < W; h++)
      if (h > 0)
        for (i = h - 1; i >= 0; i--) {
          var mr = Y.get([i, i]), yr = Y.get([h, h]);
          if (numeric.neq(mr.x, yr.x) || numeric.neq(mr.y, yr.y))
            R = Y.getRow(i).getBlock([i], [h - 1]), L = er.getRow(h).getBlock([i], [h - 1]), er.set([h, i], Y.get([i, h]).neg().sub(R.dot(L)).div(mr.sub(yr)));
          else {
            er.setRow(h, er.getRow(i));
            continue;
          }
        }
    for (h = 0; h < W; h++)
      R = er.getRow(h), er.setRow(h, R.div(R.norm2()));
    return er = er.transpose(), er = o.transjugate().dot(er), { lambda: Y.getDiag(), E: er };
  }, numeric.ccsSparse = function(c) {
    var t = c.length, i, n, f, a, r = [];
    for (f = t - 1; f !== -1; --f) {
      n = c[f];
      for (a in n) {
        for (a = parseInt(a); a >= r.length; ) r[r.length] = 0;
        n[a] !== 0 && r[a]++;
      }
    }
    var i = r.length, s = Array(i + 1);
    for (s[0] = 0, f = 0; f < i; ++f) s[f + 1] = s[f] + r[f];
    var u = Array(s[i]), o = Array(s[i]);
    for (f = t - 1; f !== -1; --f) {
      n = c[f];
      for (a in n)
        n[a] !== 0 && (r[a]--, u[s[a] + r[a]] = f, o[s[a] + r[a]] = n[a]);
    }
    return [s, u, o];
  }, numeric.ccsFull = function(c) {
    var t = c[0], n = c[1], f = c[2], a = numeric.ccsDim(c), r = a[0], i = a[1], s, u, o, v, w = numeric.rep([r, i], 0);
    for (s = 0; s < i; s++)
      for (o = t[s], v = t[s + 1], u = o; u < v; ++u)
        w[n[u]][s] = f[u];
    return w;
  }, numeric.ccsTSolve = function(c, t, n, f, a) {
    var r = c[0], i = c[1], s = c[2], u = r.length - 1, o = Math.max, v = 0;
    typeof f > "u" && (n = numeric.rep([u], 0)), typeof f > "u" && (f = numeric.linspace(0, n.length - 1)), typeof a > "u" && (a = []);
    function w(d) {
      var R;
      if (n[d] === 0) {
        for (n[d] = 1, R = r[d]; R < r[d + 1]; ++R) w(i[R]);
        a[v] = d, ++v;
      }
    }
    var h, m, y, P, E, z, g;
    for (h = f.length - 1; h !== -1; --h)
      w(f[h]);
    for (a.length = v, h = a.length - 1; h !== -1; --h)
      n[a[h]] = 0;
    for (h = f.length - 1; h !== -1; --h)
      m = f[h], n[m] = t[m];
    for (h = a.length - 1; h !== -1; --h) {
      for (m = a[h], y = r[m], P = o(r[m + 1], y), E = y; E !== P; ++E)
        if (i[E] === m) {
          n[m] /= s[E];
          break;
        }
      for (g = n[m], E = y; E !== P; ++E)
        z = i[E], z !== m && (n[z] -= g * s[E]);
    }
    return n;
  }, numeric.ccsDFS = function(c) {
    this.k = Array(c), this.k1 = Array(c), this.j = Array(c);
  }, numeric.ccsDFS.prototype.dfs = function(c, t, n, f, a, r) {
    var i = 0, s, u = a.length, o = this.k, v = this.k1, w = this.j, h, m;
    if (f[c] === 0)
      for (f[c] = 1, w[0] = c, o[0] = h = t[c], v[0] = m = t[c + 1]; ; )
        if (h >= m) {
          if (a[u] = w[i], i === 0) return;
          ++u, --i, h = o[i], m = v[i];
        } else
          s = r[n[h]], f[s] === 0 ? (f[s] = 1, o[i] = h, ++i, w[i] = s, h = t[s], v[i] = m = t[s + 1]) : ++h;
  }, numeric.ccsLPSolve = function(c, t, n, f, a, r, i) {
    var s = c[0], u = c[1], o = c[2];
    s.length - 1;
    var v = t[0], w = t[1], h = t[2], m, y, P, E, z, g, d, R, L;
    for (y = v[a], P = v[a + 1], f.length = 0, m = y; m < P; ++m)
      i.dfs(r[w[m]], s, u, n, f, r);
    for (m = f.length - 1; m !== -1; --m)
      n[f[m]] = 0;
    for (m = y; m !== P; ++m)
      E = r[w[m]], n[E] = h[m];
    for (m = f.length - 1; m !== -1; --m) {
      for (E = f[m], z = s[E], g = s[E + 1], d = z; d < g; ++d)
        if (r[u[d]] === E) {
          n[E] /= o[d];
          break;
        }
      for (L = n[E], d = z; d < g; ++d)
        R = r[u[d]], R !== E && (n[R] -= L * o[d]);
    }
    return n;
  }, numeric.ccsLUP1 = function(c, t) {
    var n = c[0].length - 1, f = [numeric.rep([n + 1], 0), [], []], a = [numeric.rep([n + 1], 0), [], []], r = f[0], i = f[1], s = f[2], u = a[0], o = a[1], v = a[2], w = numeric.rep([n], 0), h = numeric.rep([n], 0), m, y, P, E, z, g, d, R = numeric.ccsLPSolve, L = Math.abs, F = numeric.linspace(0, n - 1), l = numeric.linspace(0, n - 1), S = new numeric.ccsDFS(n);
    for (typeof t > "u" && (t = 1), m = 0; m < n; ++m) {
      for (R(f, c, w, h, m, l, S), E = -1, z = -1, y = h.length - 1; y !== -1; --y)
        P = h[y], !(P <= m) && (g = L(w[P]), g > E && (z = P, E = g));
      for (L(w[m]) < t * E && (y = F[m], E = F[z], F[m] = E, l[E] = m, F[z] = y, l[y] = z, E = w[m], w[m] = w[z], w[z] = E), E = r[m], z = u[m], d = w[m], i[E] = F[m], s[E] = 1, ++E, y = h.length - 1; y !== -1; --y)
        P = h[y], g = w[P], h[y] = 0, w[P] = 0, P <= m ? (o[z] = P, v[z] = g, ++z) : (i[E] = F[P], s[E] = g / d, ++E);
      r[m + 1] = E, u[m + 1] = z;
    }
    for (y = i.length - 1; y !== -1; --y)
      i[y] = l[i[y]];
    return { L: f, U: a, P: F, Pinv: l };
  }, numeric.ccsDFS0 = function(c) {
    this.k = Array(c), this.k1 = Array(c), this.j = Array(c);
  }, numeric.ccsDFS0.prototype.dfs = function(c, t, n, f, a, r, i) {
    var s = 0, u, o = a.length, v = this.k, w = this.k1, h = this.j, m, y;
    if (f[c] === 0)
      for (f[c] = 1, h[0] = c, v[0] = m = t[r[c]], w[0] = y = t[r[c] + 1]; ; ) {
        if (isNaN(m)) throw new Error("Ow!");
        if (m >= y) {
          if (a[o] = r[h[s]], s === 0) return;
          ++o, --s, m = v[s], y = w[s];
        } else
          u = n[m], f[u] === 0 ? (f[u] = 1, v[s] = m, ++s, h[s] = u, u = r[u], m = t[u], w[s] = y = t[u + 1]) : ++m;
      }
  }, numeric.ccsLPSolve0 = function(c, t, n, f, a, r, i, s) {
    var u = c[0], o = c[1], v = c[2];
    u.length - 1;
    var w = t[0], h = t[1], m = t[2], y, P, E, z, g, d, R, L, F;
    for (P = w[a], E = w[a + 1], f.length = 0, y = P; y < E; ++y)
      s.dfs(h[y], u, o, n, f, r, i);
    for (y = f.length - 1; y !== -1; --y)
      z = f[y], n[i[z]] = 0;
    for (y = P; y !== E; ++y)
      z = h[y], n[z] = m[y];
    for (y = f.length - 1; y !== -1; --y) {
      for (z = f[y], L = i[z], g = u[z], d = u[z + 1], R = g; R < d; ++R)
        if (o[R] === L) {
          n[L] /= v[R];
          break;
        }
      for (F = n[L], R = g; R < d; ++R) n[o[R]] -= F * v[R];
      n[L] = F;
    }
  }, numeric.ccsLUP0 = function(c, t) {
    var n = c[0].length - 1, f = [numeric.rep([n + 1], 0), [], []], a = [numeric.rep([n + 1], 0), [], []], r = f[0], i = f[1], s = f[2], u = a[0], o = a[1], v = a[2], w = numeric.rep([n], 0), h = numeric.rep([n], 0), m, y, P, E, z, g, d, R = numeric.ccsLPSolve0, L = Math.abs, F = numeric.linspace(0, n - 1), l = numeric.linspace(0, n - 1), S = new numeric.ccsDFS0(n);
    for (typeof t > "u" && (t = 1), m = 0; m < n; ++m) {
      for (R(f, c, w, h, m, l, F, S), E = -1, z = -1, y = h.length - 1; y !== -1; --y)
        P = h[y], !(P <= m) && (g = L(w[F[P]]), g > E && (z = P, E = g));
      for (L(w[F[m]]) < t * E && (y = F[m], E = F[z], F[m] = E, l[E] = m, F[z] = y, l[y] = z), E = r[m], z = u[m], d = w[F[m]], i[E] = F[m], s[E] = 1, ++E, y = h.length - 1; y !== -1; --y)
        P = h[y], g = w[F[P]], h[y] = 0, w[F[P]] = 0, P <= m ? (o[z] = P, v[z] = g, ++z) : (i[E] = F[P], s[E] = g / d, ++E);
      r[m + 1] = E, u[m + 1] = z;
    }
    for (y = i.length - 1; y !== -1; --y)
      i[y] = l[i[y]];
    return { L: f, U: a, P: F, Pinv: l };
  }, numeric.ccsLUP = numeric.ccsLUP0, numeric.ccsDim = function(c) {
    return [numeric.sup(c[1]) + 1, c[0].length - 1];
  }, numeric.ccsGetBlock = function(c, t, n) {
    var f = numeric.ccsDim(c), a = f[0], r = f[1];
    typeof t > "u" ? t = numeric.linspace(0, a - 1) : typeof t == "number" && (t = [t]), typeof n > "u" ? n = numeric.linspace(0, r - 1) : typeof n == "number" && (n = [n]);
    var i, s = t.length, u, o = n.length, v, w, h, m = numeric.rep([r], 0), y = [], P = [], E = [m, y, P], z = c[0], g = c[1], d = c[2], R = numeric.rep([a], 0), L = 0, F = numeric.rep([a], 0);
    for (u = 0; u < o; ++u) {
      w = n[u];
      var l = z[w], S = z[w + 1];
      for (i = l; i < S; ++i)
        v = g[i], F[v] = 1, R[v] = d[i];
      for (i = 0; i < s; ++i)
        h = t[i], F[h] && (y[L] = i, P[L] = R[t[i]], ++L);
      for (i = l; i < S; ++i)
        v = g[i], F[v] = 0;
      m[u + 1] = L;
    }
    return E;
  }, numeric.ccsDot = function(c, t) {
    var n = c[0], f = c[1], a = c[2], r = t[0], i = t[1], s = t[2], u = numeric.ccsDim(c), o = numeric.ccsDim(t), v = u[0];
    u[1];
    var w = o[1], h = numeric.rep([v], 0), m = numeric.rep([v], 0), y = Array(v), P = numeric.rep([w], 0), E = [], z = [], g = [P, E, z], d, R, L, F, l, S, O, j, Y, W, er;
    for (L = 0; L !== w; ++L) {
      for (F = r[L], l = r[L + 1], Y = 0, R = F; R < l; ++R)
        for (W = i[R], er = s[R], S = n[W], O = n[W + 1], d = S; d < O; ++d)
          j = f[d], m[j] === 0 && (y[Y] = j, m[j] = 1, Y = Y + 1), h[j] = h[j] + a[d] * er;
      for (F = P[L], l = F + Y, P[L + 1] = l, R = Y - 1; R !== -1; --R)
        er = F + R, d = y[R], E[er] = d, z[er] = h[d], m[d] = 0, h[d] = 0;
      P[L + 1] = P[L] + Y;
    }
    return g;
  }, numeric.ccsLUPSolve = function(c, t) {
    var n = c.L, f = c.U;
    c.P;
    var a = t[0], r = !1;
    typeof a != "object" && (t = [[0, t.length], numeric.linspace(0, t.length - 1), t], a = t[0], r = !0);
    var i = t[1], s = t[2], u = n[0].length - 1, o = a.length - 1, v = numeric.rep([u], 0), w = Array(u), h = numeric.rep([u], 0), m = Array(u), y = numeric.rep([o + 1], 0), P = [], E = [], z = numeric.ccsTSolve, g, d, R, L, F, l, S = 0;
    for (g = 0; g < o; ++g) {
      for (F = 0, R = a[g], L = a[g + 1], d = R; d < L; ++d)
        l = c.Pinv[i[d]], m[F] = l, h[l] = s[d], ++F;
      for (m.length = F, z(n, h, v, m, w), d = m.length - 1; d !== -1; --d) h[m[d]] = 0;
      if (z(f, v, h, w, m), r) return h;
      for (d = w.length - 1; d !== -1; --d) v[w[d]] = 0;
      for (d = m.length - 1; d !== -1; --d)
        l = m[d], P[S] = l, E[S] = h[l], h[l] = 0, ++S;
      y[g + 1] = S;
    }
    return [y, P, E];
  }, numeric.ccsbinop = function(c, t) {
    return typeof t > "u" && (t = ""), Function(
      "X",
      "Y",
      `var Xi = X[0], Xj = X[1], Xv = X[2];
var Yi = Y[0], Yj = Y[1], Yv = Y[2];
var n = Xi.length-1,m = Math.max(numeric.sup(Xj),numeric.sup(Yj))+1;
var Zi = numeric.rep([n+1],0), Zj = [], Zv = [];
var x = numeric.rep([m],0),y = numeric.rep([m],0);
var xk,yk,zk;
var i,j,j0,j1,k,p=0;
` + t + `for(i=0;i<n;++i) {
  j0 = Xi[i]; j1 = Xi[i+1];
  for(j=j0;j!==j1;++j) {
    k = Xj[j];
    x[k] = 1;
    Zj[p] = k;
    ++p;
  }
  j0 = Yi[i]; j1 = Yi[i+1];
  for(j=j0;j!==j1;++j) {
    k = Yj[j];
    y[k] = Yv[j];
    if(x[k] === 0) {
      Zj[p] = k;
      ++p;
    }
  }
  Zi[i+1] = p;
  j0 = Xi[i]; j1 = Xi[i+1];
  for(j=j0;j!==j1;++j) x[Xj[j]] = Xv[j];
  j0 = Zi[i]; j1 = Zi[i+1];
  for(j=j0;j!==j1;++j) {
    k = Zj[j];
    xk = x[k];
    yk = y[k];
` + c + `
    Zv[j] = zk;
  }
  j0 = Xi[i]; j1 = Xi[i+1];
  for(j=j0;j!==j1;++j) x[Xj[j]] = 0;
  j0 = Yi[i]; j1 = Yi[i+1];
  for(j=j0;j!==j1;++j) y[Yj[j]] = 0;
}
return [Zi,Zj,Zv];`
    );
  }, (function() {
    var k, A, B, C;
    for (k in numeric.ops2)
      isFinite(eval("1" + numeric.ops2[k] + "0")) ? A = "[Y[0],Y[1],numeric." + k + "(X,Y[2])]" : A = "NaN", isFinite(eval("0" + numeric.ops2[k] + "1")) ? B = "[X[0],X[1],numeric." + k + "(X[2],Y)]" : B = "NaN", isFinite(eval("1" + numeric.ops2[k] + "0")) && isFinite(eval("0" + numeric.ops2[k] + "1")) ? C = "numeric.ccs" + k + "MM(X,Y)" : C = "NaN", numeric["ccs" + k + "MM"] = numeric.ccsbinop("zk = xk " + numeric.ops2[k] + "yk;"), numeric["ccs" + k] = Function(
        "X",
        "Y",
        'if(typeof X === "number") return ' + A + `;
if(typeof Y === "number") return ` + B + `;
return ` + C + `;
`
      );
  })(), numeric.ccsScatter = function D(c) {
    var t = c[0], n = c[1], f = c[2], a = numeric.sup(n) + 1, r = t.length, i = numeric.rep([a], 0), s = Array(r), u = Array(r), o = numeric.rep([a], 0), v;
    for (v = 0; v < r; ++v) o[n[v]]++;
    for (v = 0; v < a; ++v) i[v + 1] = i[v] + o[v];
    var w = i.slice(0), h, m;
    for (v = 0; v < r; ++v)
      m = n[v], h = w[m], s[h] = t[v], u[h] = f[v], w[m] = w[m] + 1;
    return [i, s, u];
  }, numeric.ccsGather = function D(c) {
    var t = c[0], n = c[1], f = c[2], a = t.length - 1, r = n.length, i = Array(r), s = Array(r), u = Array(r), o, v, w, h, m;
    for (m = 0, o = 0; o < a; ++o)
      for (w = t[o], h = t[o + 1], v = w; v !== h; ++v)
        s[m] = o, i[m] = n[v], u[m] = f[v], ++m;
    return [i, s, u];
  }, numeric.sdim = function D(c, t, n) {
    if (typeof t > "u" && (t = []), typeof c != "object") return t;
    typeof n > "u" && (n = 0), n in t || (t[n] = 0), c.length > t[n] && (t[n] = c.length);
    var f;
    for (f in c)
      c.hasOwnProperty(f) && D(c[f], t, n + 1);
    return t;
  }, numeric.sclone = function D(c, t, n) {
    typeof t > "u" && (t = 0), typeof n > "u" && (n = numeric.sdim(c).length);
    var f, a = Array(c.length);
    if (t === n - 1) {
      for (f in c)
        c.hasOwnProperty(f) && (a[f] = c[f]);
      return a;
    }
    for (f in c)
      c.hasOwnProperty(f) && (a[f] = D(c[f], t + 1, n));
    return a;
  }, numeric.sdiag = function D(c) {
    var t = c.length, n, f = Array(t), a;
    for (n = t - 1; n >= 1; n -= 2)
      a = n - 1, f[n] = [], f[n][n] = c[n], f[a] = [], f[a][a] = c[a];
    return n === 0 && (f[0] = [], f[0][0] = c[n]), f;
  }, numeric.sidentity = function D(c) {
    return numeric.sdiag(numeric.rep([c], 1));
  }, numeric.stranspose = function D(c) {
    var t = [];
    c.length;
    var n, f, a;
    for (n in c)
      if (c.hasOwnProperty(n)) {
        a = c[n];
        for (f in a)
          a.hasOwnProperty(f) && (typeof t[f] != "object" && (t[f] = []), t[f][n] = a[f]);
      }
    return t;
  }, numeric.sLUP = function D(c, t) {
    throw new Error("The function numeric.sLUP had a bug in it and has been removed. Please use the new numeric.ccsLUP function instead.");
  }, numeric.sdotMM = function D(c, t) {
    var n = c.length;
    t.length;
    var f = numeric.stranspose(t), a = f.length, r, i, s, u, o, v, w = Array(n), h;
    for (s = n - 1; s >= 0; s--) {
      for (h = [], r = c[s], o = a - 1; o >= 0; o--) {
        v = 0, i = f[o];
        for (u in r)
          r.hasOwnProperty(u) && u in i && (v += r[u] * i[u]);
        v && (h[o] = v);
      }
      w[s] = h;
    }
    return w;
  }, numeric.sdotMV = function D(c, t) {
    var n = c.length, f, a, r, i = Array(n), s;
    for (a = n - 1; a >= 0; a--) {
      f = c[a], s = 0;
      for (r in f)
        f.hasOwnProperty(r) && t[r] && (s += f[r] * t[r]);
      s && (i[a] = s);
    }
    return i;
  }, numeric.sdotVM = function D(c, t) {
    var n, f, a, r, i = [];
    for (n in c)
      if (c.hasOwnProperty(n)) {
        a = t[n], r = c[n];
        for (f in a)
          a.hasOwnProperty(f) && (i[f] || (i[f] = 0), i[f] += r * a[f]);
      }
    return i;
  }, numeric.sdotVV = function D(c, t) {
    var n, f = 0;
    for (n in c)
      c[n] && t[n] && (f += c[n] * t[n]);
    return f;
  }, numeric.sdot = function D(c, t) {
    var n = numeric.sdim(c).length, f = numeric.sdim(t).length, a = n * 1e3 + f;
    switch (a) {
      case 0:
        return c * t;
      case 1001:
        return numeric.sdotVV(c, t);
      case 2001:
        return numeric.sdotMV(c, t);
      case 1002:
        return numeric.sdotVM(c, t);
      case 2002:
        return numeric.sdotMM(c, t);
      default:
        throw new Error("numeric.sdot not implemented for tensors of order " + n + " and " + f);
    }
  }, numeric.sscatter = function D(c) {
    var t = c[0].length, n, f, a, r = c.length, i = [], s;
    for (f = t - 1; f >= 0; --f)
      if (c[r - 1][f]) {
        for (s = i, a = 0; a < r - 2; a++)
          n = c[a][f], s[n] || (s[n] = []), s = s[n];
        s[c[a][f]] = c[a + 1][f];
      }
    return i;
  }, numeric.sgather = function D(c, t, n) {
    typeof t > "u" && (t = []), typeof n > "u" && (n = []);
    var f, a, r;
    f = n.length;
    for (a in c)
      if (c.hasOwnProperty(a))
        if (n[f] = parseInt(a), r = c[a], typeof r == "number") {
          if (r) {
            if (t.length === 0)
              for (a = f + 1; a >= 0; --a) t[a] = [];
            for (a = f; a >= 0; --a) t[a].push(n[a]);
            t[f + 1].push(r);
          }
        } else D(r, t, n);
    return n.length > f && n.pop(), t;
  }, numeric.cLU = function D(c) {
    var t = c[0], n = c[1], f = c[2], S = t.length, a = 0, r, i, s, u, o, v;
    for (r = 0; r < S; r++) t[r] > a && (a = t[r]);
    a++;
    var w = Array(a), h = Array(a), m = numeric.rep([a], 1 / 0), y = numeric.rep([a], -1 / 0), g, d, P;
    for (s = 0; s < S; s++)
      r = t[s], i = n[s], i < m[r] && (m[r] = i), i > y[r] && (y[r] = i);
    for (r = 0; r < a - 1; r++)
      y[r] > y[r + 1] && (y[r + 1] = y[r]);
    for (r = a - 1; r >= 1; r--)
      m[r] < m[r - 1] && (m[r - 1] = m[r]);
    var E = 0, z = 0;
    for (r = 0; r < a; r++)
      h[r] = numeric.rep([y[r] - m[r] + 1], 0), w[r] = numeric.rep([r - m[r]], 0), E += r - m[r] + 1, z += y[r] - r + 1;
    for (s = 0; s < S; s++)
      r = t[s], h[r][n[s] - m[r]] = f[s];
    for (r = 0; r < a - 1; r++)
      for (u = r - m[r], g = h[r], i = r + 1; m[i] <= r && i < a; i++)
        if (o = r - m[i], v = y[r] - r, d = h[i], P = d[o] / g[u], P) {
          for (s = 1; s <= v; s++)
            d[s + o] -= P * g[s + u];
          w[i][r - m[i]] = P;
        }
    var g = [], d = [], R = [], L = [], F = [], l = [], S, O, j;
    for (S = 0, O = 0, r = 0; r < a; r++) {
      for (u = m[r], o = y[r], j = h[r], i = r; i <= o; i++)
        j[i - u] && (g[S] = r, d[S] = i, R[S] = j[i - u], S++);
      for (j = w[r], i = u; i < r; i++)
        j[i - u] && (L[O] = r, F[O] = i, l[O] = j[i - u], O++);
      L[O] = r, F[O] = r, l[O] = 1, O++;
    }
    return { U: [g, d, R], L: [L, F, l] };
  }, numeric.cLUsolve = function D(c, t) {
    var n = c.L, f = c.U, a = numeric.clone(t), r = n[0], i = n[1], s = n[2], u = f[0], o = f[1], v = f[2], w = u.length;
    r.length;
    var h = a.length, m, y;
    for (y = 0, m = 0; m < h; m++) {
      for (; i[y] < m; )
        a[m] -= s[y] * a[i[y]], y++;
      y++;
    }
    for (y = w - 1, m = h - 1; m >= 0; m--) {
      for (; o[y] > m; )
        a[m] -= v[y] * a[o[y]], y--;
      a[m] /= v[y], y--;
    }
    return a;
  }, numeric.cgrid = function D(c, t) {
    typeof c == "number" && (c = [c, c]);
    var n = numeric.rep(c, -1), f, a, r;
    if (typeof t != "function")
      switch (t) {
        case "L":
          t = function(i, s) {
            return i >= c[0] / 2 || s < c[1] / 2;
          };
          break;
        default:
          t = function(i, s) {
            return !0;
          };
          break;
      }
    for (r = 0, f = 1; f < c[0] - 1; f++) for (a = 1; a < c[1] - 1; a++)
      t(f, a) && (n[f][a] = r, r++);
    return n;
  }, numeric.cdelsq = function D(c) {
    var t = [[-1, 0], [0, -1], [0, 1], [1, 0]], n = numeric.dim(c), f = n[0], a = n[1], r, i, s, u, o, v = [], w = [], h = [];
    for (r = 1; r < f - 1; r++) for (i = 1; i < a - 1; i++)
      if (!(c[r][i] < 0)) {
        for (s = 0; s < 4; s++)
          u = r + t[s][0], o = i + t[s][1], !(c[u][o] < 0) && (v.push(c[r][i]), w.push(c[u][o]), h.push(-1));
        v.push(c[r][i]), w.push(c[r][i]), h.push(4);
      }
    return [v, w, h];
  }, numeric.cdotMV = function D(c, t) {
    var n, f = c[0], a = c[1], r = c[2], i, s = f.length, u;
    for (u = 0, i = 0; i < s; i++)
      f[i] > u && (u = f[i]);
    for (u++, n = numeric.rep([u], 0), i = 0; i < s; i++)
      n[f[i]] += r[i] * t[a[i]];
    return n;
  }, numeric.Spline = function D(c, t, n, f, a) {
    this.x = c, this.yl = t, this.yr = n, this.kl = f, this.kr = a;
  }, numeric.Spline.prototype._at = function D(s, t) {
    var n = this.x, f = this.yl, a = this.yr, r = this.kl, i = this.kr, s, u, o, v, w = numeric.add, h = numeric.sub, m = numeric.mul;
    u = h(m(r[t], n[t + 1] - n[t]), h(a[t + 1], f[t])), o = w(m(i[t + 1], n[t] - n[t + 1]), h(a[t + 1], f[t])), v = (s - n[t]) / (n[t + 1] - n[t]);
    var y = v * (1 - v);
    return w(w(w(m(1 - v, f[t]), m(v, a[t + 1])), m(u, y * (1 - v))), m(o, y * v));
  }, numeric.Spline.prototype.at = function D(c) {
    if (typeof c == "number") {
      var t = this.x, i = t.length, n, f, a, r = Math.floor;
      for (n = 0, f = i - 1; f - n > 1; )
        a = r((n + f) / 2), t[a] <= c ? n = a : f = a;
      return this._at(c, n);
    }
    var i = c.length, s, u = Array(i);
    for (s = i - 1; s !== -1; --s) u[s] = this.at(c[s]);
    return u;
  }, numeric.Spline.prototype.diff = function D() {
    var c = this.x, t = this.yl, n = this.yr, f = this.kl, a = this.kr, r = t.length, i, s, u, o = f, v = a, w = Array(r), h = Array(r), m = numeric.add, y = numeric.mul, P = numeric.div, E = numeric.sub;
    for (i = r - 1; i !== -1; --i)
      s = c[i + 1] - c[i], u = E(n[i + 1], t[i]), w[i] = P(m(y(u, 6), y(f[i], -4 * s), y(a[i + 1], -2 * s)), s * s), h[i + 1] = P(m(y(u, -6), y(f[i], 2 * s), y(a[i + 1], 4 * s)), s * s);
    return new numeric.Spline(c, o, v, w, h);
  }, numeric.Spline.prototype.roots = function D() {
    function c(_) {
      return _ * _;
    }
    var P = [], t = this.x, n = this.yl, f = this.yr, a = this.kl, r = this.kr;
    typeof n[0] == "number" && (n = [n], f = [f], a = [a], r = [r]);
    var i = n.length, s = t.length - 1, u, o, v, w, h, m, y, P = Array(i), E, z, g, d, R, L, F, l, S, O, j, Y, W, er, mr, yr, or = Math.sqrt;
    for (u = 0; u !== i; ++u) {
      for (w = n[u], h = f[u], m = a[u], y = r[u], E = [], o = 0; o !== s; o++) {
        for (o > 0 && h[o] * w[o] < 0 && E.push(t[o]), S = t[o + 1] - t[o], t[o], d = w[o], R = h[o + 1], z = m[o] / S, g = y[o + 1] / S, l = c(z - g + 3 * (d - R)) + 12 * g * d, L = g + 3 * d + 2 * z - 3 * R, F = 3 * (g + z + 2 * (d - R)), l <= 0 ? (j = L / F, j > t[o] && j < t[o + 1] ? O = [t[o], j, t[o + 1]] : O = [t[o], t[o + 1]]) : (j = (L - or(l)) / F, Y = (L + or(l)) / F, O = [t[o]], j > t[o] && j < t[o + 1] && O.push(j), Y > t[o] && Y < t[o + 1] && O.push(Y), O.push(t[o + 1])), er = O[0], j = this._at(er, o), v = 0; v < O.length - 1; v++) {
          if (mr = O[v + 1], Y = this._at(mr, o), j === 0) {
            E.push(er), er = mr, j = Y;
            continue;
          }
          if (Y === 0 || j * Y > 0) {
            er = mr, j = Y;
            continue;
          }
          for (var V = 0; yr = (j * mr - Y * er) / (j - Y), !(yr <= er || yr >= mr); )
            if (W = this._at(yr, o), W * Y > 0)
              mr = yr, Y = W, V === -1 && (j *= 0.5), V = -1;
            else if (W * j > 0)
              er = yr, j = W, V === 1 && (Y *= 0.5), V = 1;
            else break;
          E.push(yr), er = O[v + 1], j = this._at(er, o);
        }
        Y === 0 && E.push(mr);
      }
      P[u] = E;
    }
    return typeof this.yl[0] == "number" ? P[0] : P;
  }, numeric.spline = function D(c, t, n, f) {
    var a = c.length, r = [], i = [], s = [], u, o = numeric.sub, v = numeric.mul, w = numeric.add;
    for (u = a - 2; u >= 0; u--)
      i[u] = c[u + 1] - c[u], s[u] = o(t[u + 1], t[u]);
    (typeof n == "string" || typeof f == "string") && (n = f = "periodic");
    var h = [[], [], []];
    switch (typeof n) {
      case "undefined":
        r[0] = v(3 / (i[0] * i[0]), s[0]), h[0].push(0, 0), h[1].push(0, 1), h[2].push(2 / i[0], 1 / i[0]);
        break;
      case "string":
        r[0] = w(v(3 / (i[a - 2] * i[a - 2]), s[a - 2]), v(3 / (i[0] * i[0]), s[0])), h[0].push(0, 0, 0), h[1].push(a - 2, 0, 1), h[2].push(1 / i[a - 2], 2 / i[a - 2] + 2 / i[0], 1 / i[0]);
        break;
      default:
        r[0] = n, h[0].push(0), h[1].push(0), h[2].push(1);
        break;
    }
    for (u = 1; u < a - 1; u++)
      r[u] = w(v(3 / (i[u - 1] * i[u - 1]), s[u - 1]), v(3 / (i[u] * i[u]), s[u])), h[0].push(u, u, u), h[1].push(u - 1, u, u + 1), h[2].push(1 / i[u - 1], 2 / i[u - 1] + 2 / i[u], 1 / i[u]);
    switch (typeof f) {
      case "undefined":
        r[a - 1] = v(3 / (i[a - 2] * i[a - 2]), s[a - 2]), h[0].push(a - 1, a - 1), h[1].push(a - 2, a - 1), h[2].push(1 / i[a - 2], 2 / i[a - 2]);
        break;
      case "string":
        h[1][h[1].length - 1] = 0;
        break;
      default:
        r[a - 1] = f, h[0].push(a - 1), h[1].push(a - 1), h[2].push(1);
        break;
    }
    typeof r[0] != "number" ? r = numeric.transpose(r) : r = [r];
    var m = Array(r.length);
    if (typeof n == "string")
      for (u = m.length - 1; u !== -1; --u)
        m[u] = numeric.ccsLUPSolve(numeric.ccsLUP(numeric.ccsScatter(h)), r[u]), m[u][a - 1] = m[u][0];
    else
      for (u = m.length - 1; u !== -1; --u)
        m[u] = numeric.cLUsolve(numeric.cLU(h), r[u]);
    return typeof t[0] == "number" ? m = m[0] : m = numeric.transpose(m), new numeric.Spline(c, t, t, m, m);
  }, numeric.fftpow2 = function D(c, t) {
    var n = c.length;
    if (n !== 1) {
      var f = Math.cos, a = Math.sin, r, i, s = Array(n / 2), u = Array(n / 2), o = Array(n / 2), v = Array(n / 2);
      for (i = n / 2, r = n - 1; r !== -1; --r)
        --i, o[i] = c[r], v[i] = t[r], --r, s[i] = c[r], u[i] = t[r];
      D(s, u), D(o, v), i = n / 2;
      var w, h = -6.283185307179586 / n, m, y;
      for (r = n - 1; r !== -1; --r)
        --i, i === -1 && (i = n / 2 - 1), w = h * r, m = f(w), y = a(w), c[r] = s[i] + m * o[i] - y * v[i], t[r] = u[i] + m * v[i] + y * o[i];
    }
  }, numeric._ifftpow2 = function D(c, t) {
    var n = c.length;
    if (n !== 1) {
      var f = Math.cos, a = Math.sin, r, i, s = Array(n / 2), u = Array(n / 2), o = Array(n / 2), v = Array(n / 2);
      for (i = n / 2, r = n - 1; r !== -1; --r)
        --i, o[i] = c[r], v[i] = t[r], --r, s[i] = c[r], u[i] = t[r];
      D(s, u), D(o, v), i = n / 2;
      var w, h = 6.283185307179586 / n, m, y;
      for (r = n - 1; r !== -1; --r)
        --i, i === -1 && (i = n / 2 - 1), w = h * r, m = f(w), y = a(w), c[r] = s[i] + m * o[i] - y * v[i], t[r] = u[i] + m * v[i] + y * o[i];
    }
  }, numeric.ifftpow2 = function D(c, t) {
    numeric._ifftpow2(c, t), numeric.diveq(c, c.length), numeric.diveq(t, t.length);
  }, numeric.convpow2 = function D(c, t, n, f) {
    numeric.fftpow2(c, t), numeric.fftpow2(n, f);
    var a, r = c.length, i, s, u, o;
    for (a = r - 1; a !== -1; --a)
      i = c[a], u = t[a], s = n[a], o = f[a], c[a] = i * s - u * o, t[a] = i * o + u * s;
    numeric.ifftpow2(c, t);
  }, numeric.T.prototype.fft = function D() {
    var c = this.x, t = this.y, n = c.length, f = Math.log, a = f(2), r = Math.ceil(f(2 * n - 1) / a), i = Math.pow(2, r), s = numeric.rep([i], 0), u = numeric.rep([i], 0), o = Math.cos, v = Math.sin, w, h = -3.141592653589793 / n, m, y = numeric.rep([i], 0), P = numeric.rep([i], 0);
    for (w = 0; w < n; w++) y[w] = c[w];
    if (typeof t < "u") for (w = 0; w < n; w++) P[w] = t[w];
    for (s[0] = 1, w = 1; w <= i / 2; w++)
      m = h * w * w, s[w] = o(m), u[w] = v(m), s[i - w] = o(m), u[i - w] = v(m);
    var E = new numeric.T(y, P), z = new numeric.T(s, u);
    return E = E.mul(z), numeric.convpow2(E.x, E.y, numeric.clone(z.x), numeric.neg(z.y)), E = E.mul(z), E.x.length = n, E.y.length = n, E;
  }, numeric.T.prototype.ifft = function D() {
    var c = this.x, t = this.y, n = c.length, f = Math.log, a = f(2), r = Math.ceil(f(2 * n - 1) / a), i = Math.pow(2, r), s = numeric.rep([i], 0), u = numeric.rep([i], 0), o = Math.cos, v = Math.sin, w, h = 3.141592653589793 / n, m, y = numeric.rep([i], 0), P = numeric.rep([i], 0);
    for (w = 0; w < n; w++) y[w] = c[w];
    if (typeof t < "u") for (w = 0; w < n; w++) P[w] = t[w];
    for (s[0] = 1, w = 1; w <= i / 2; w++)
      m = h * w * w, s[w] = o(m), u[w] = v(m), s[i - w] = o(m), u[i - w] = v(m);
    var E = new numeric.T(y, P), z = new numeric.T(s, u);
    return E = E.mul(z), numeric.convpow2(E.x, E.y, numeric.clone(z.x), numeric.neg(z.y)), E = E.mul(z), E.x.length = n, E.y.length = n, E.div(n);
  }, numeric.gradient = function D(c, t) {
    var n = t.length, f = c(t);
    if (isNaN(f)) throw new Error("gradient: f(x) is a NaN!");
    var v = Math.max, a, r = numeric.clone(t), i, s, u = Array(n);
    numeric.div, numeric.sub;
    var o, v = Math.max, w = 1e-3, h = Math.abs, m = Math.min, y, P, E, z = 0, g, d, R;
    for (a = 0; a < n; a++)
      for (var L = v(1e-6 * f, 1e-8); ; ) {
        if (++z, z > 20)
          throw new Error("Numerical gradient fails");
        if (r[a] = t[a] + L, i = c(r), r[a] = t[a] - L, s = c(r), r[a] = t[a], isNaN(i) || isNaN(s)) {
          L /= 16;
          continue;
        }
        if (u[a] = (i - s) / (2 * L), y = t[a] - L, P = t[a], E = t[a] + L, g = (i - f) / L, d = (f - s) / L, R = v(h(u[a]), h(f), h(i), h(s), h(y), h(P), h(E), 1e-8), o = m(v(h(g - u[a]), h(d - u[a]), h(g - d)) / R, L / R), o > w)
          L /= 16;
        else break;
      }
    return u;
  }, numeric.uncmin = function D(c, t, n, f, a, r, i) {
    var s = numeric.gradient;
    typeof i > "u" && (i = {}), typeof n > "u" && (n = 1e-8), typeof f > "u" && (f = function($) {
      return s(c, $);
    }), typeof a > "u" && (a = 1e3), t = numeric.clone(t);
    var u = t.length, o = c(t), v, w;
    if (isNaN(o)) throw new Error("uncmin: f(x0) is a NaN!");
    var h = Math.max, m = numeric.norm2;
    n = h(n, numeric.epsilon);
    var y, P, E, z = i.Hinv || numeric.identity(u), g = numeric.dot;
    numeric.inv;
    var d = numeric.sub, R = numeric.add, L = numeric.tensor, F = numeric.div, l = numeric.mul, S = numeric.all, O = numeric.isFinite, j = numeric.neg, Y = 0, W, er, mr, yr, or, V, _, I = "";
    for (P = f(t); Y < a; ) {
      if (typeof r == "function" && r(Y, t, o, P, z)) {
        I = "Callback returned true";
        break;
      }
      if (!S(O(P))) {
        I = "Gradient has Infinity or NaN";
        break;
      }
      if (y = j(g(z, P)), !S(O(y))) {
        I = "Search direction has Infinity or NaN";
        break;
      }
      if (_ = m(y), _ < n) {
        I = "Newton step smaller than tol";
        break;
      }
      for (V = 1, w = g(P, y), er = t; Y < a && !(V * _ < n); ) {
        if (W = l(y, V), er = R(t, W), v = c(er), v - o >= 0.1 * V * w || isNaN(v)) {
          V *= 0.5, ++Y;
          continue;
        }
        break;
      }
      if (V * _ < n) {
        I = "Line search step size smaller than tol";
        break;
      }
      if (Y === a) {
        I = "maxit reached during line search";
        break;
      }
      E = f(er), mr = d(E, P), or = g(mr, W), yr = g(z, mr), z = d(
        R(
          z,
          l(
            (or + g(mr, yr)) / (or * or),
            L(W, W)
          )
        ),
        F(R(L(yr, W), L(W, yr)), or)
      ), t = er, o = v, P = E, ++Y;
    }
    return { solution: t, f: o, gradient: P, invHessian: z, iterations: Y, message: I };
  }, numeric.Dopri = function D(c, t, n, f, a, r, i) {
    this.x = c, this.y = t, this.f = n, this.ymid = f, this.iterations = a, this.events = i, this.message = r;
  }, numeric.Dopri.prototype._at = function D(y, t) {
    function n(l) {
      return l * l;
    }
    var f = this, a = f.x, r = f.y, i = f.f, s = f.ymid;
    a.length;
    var u, o, v, w, h, m, y, P, E = 0.5, z = numeric.add, g = numeric.mul, d = numeric.sub, R, L, F;
    return u = a[t], o = a[t + 1], w = r[t], h = r[t + 1], P = o - u, v = u + E * P, m = s[t], R = d(i[t], g(w, 1 / (u - v) + 2 / (u - o))), L = d(i[t + 1], g(h, 1 / (o - v) + 2 / (o - u))), F = [
      n(y - o) * (y - v) / n(u - o) / (u - v),
      n(y - u) * n(y - o) / n(u - v) / n(o - v),
      n(y - u) * (y - v) / n(o - u) / (o - v),
      (y - u) * n(y - o) * (y - v) / n(u - o) / (u - v),
      (y - o) * n(y - u) * (y - v) / n(u - o) / (o - v)
    ], z(
      z(
        z(
          z(
            g(w, F[0]),
            g(m, F[1])
          ),
          g(h, F[2])
        ),
        g(R, F[3])
      ),
      g(L, F[4])
    );
  }, numeric.Dopri.prototype.at = function D(c) {
    var t, n, f, a = Math.floor;
    if (typeof c != "number") {
      var r = c.length, i = Array(r);
      for (t = r - 1; t !== -1; --t)
        i[t] = this.at(c[t]);
      return i;
    }
    var s = this.x;
    for (t = 0, n = s.length - 1; n - t > 1; )
      f = a(0.5 * (t + n)), s[f] <= c ? t = f : n = f;
    return this._at(c, t);
  }, numeric.dopri = function D(c, t, n, f, a, r, i) {
    typeof a > "u" && (a = 1e-6), typeof r > "u" && (r = 1e3);
    var s = [c], u = [n], o = [f(c, n)], v, w, h, m, y, P, E = [], z = 1 / 5, g = [3 / 40, 9 / 40], d = [44 / 45, -56 / 15, 32 / 9], R = [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729], L = [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656], F = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84], l = [
      0.5 * 6025192743 / 30085553152,
      0,
      0.5 * 51252292925 / 65400821598,
      0.5 * -2691868925 / 45128329728,
      0.5 * 187940372067 / 1594534317056,
      0.5 * -1776094331 / 19743644256,
      0.5 * 11237099 / 235043384
    ], S = [1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1], O = [-71 / 57600, 0, 71 / 16695, -71 / 1920, 17253 / 339200, -22 / 525, 1 / 40], j = 0, Y, W, er = (t - c) / 10, mr = 0, yr = numeric.add, or = numeric.mul, V, _, I = Math.min, $ = Math.abs, rr = numeric.norminf, ir = Math.pow, hr = numeric.any, b = numeric.lt, p = numeric.and;
    numeric.sub;
    var q, Z, U, Q = new numeric.Dopri(s, u, o, E, -1, "");
    for (typeof i == "function" && (q = i(c, n)); c < t && mr < r; ) {
      if (++mr, c + er > t && (er = t - c), v = f(c + S[0] * er, yr(n, or(z * er, o[j]))), w = f(c + S[1] * er, yr(yr(n, or(g[0] * er, o[j])), or(g[1] * er, v))), h = f(c + S[2] * er, yr(yr(yr(n, or(d[0] * er, o[j])), or(d[1] * er, v)), or(d[2] * er, w))), m = f(c + S[3] * er, yr(yr(yr(yr(n, or(R[0] * er, o[j])), or(R[1] * er, v)), or(R[2] * er, w)), or(R[3] * er, h))), y = f(c + S[4] * er, yr(yr(yr(yr(yr(n, or(L[0] * er, o[j])), or(L[1] * er, v)), or(L[2] * er, w)), or(L[3] * er, h)), or(L[4] * er, m))), V = yr(yr(yr(yr(yr(n, or(o[j], er * F[0])), or(w, er * F[2])), or(h, er * F[3])), or(m, er * F[4])), or(y, er * F[5])), P = f(c + er, V), Y = yr(yr(yr(yr(yr(or(o[j], er * O[0]), or(w, er * O[2])), or(h, er * O[3])), or(m, er * O[4])), or(y, er * O[5])), or(P, er * O[6])), typeof Y == "number" ? _ = $(Y) : _ = rr(Y), _ > a) {
        if (er = 0.2 * er * ir(a / _, 0.25), c + er === c) {
          Q.msg = "Step size became too small";
          break;
        }
        continue;
      }
      if (E[j] = yr(
        yr(
          yr(
            yr(
              yr(
                yr(
                  n,
                  or(o[j], er * l[0])
                ),
                or(w, er * l[2])
              ),
              or(h, er * l[3])
            ),
            or(m, er * l[4])
          ),
          or(y, er * l[5])
        ),
        or(P, er * l[6])
      ), ++j, s[j] = c + er, u[j] = V, o[j] = P, typeof i == "function") {
        var x, fr = c, vr = c + 0.5 * er, N;
        if (Z = i(vr, E[j - 1]), U = p(b(q, 0), b(0, Z)), hr(U) || (fr = vr, vr = c + er, q = Z, Z = i(vr, V), U = p(b(q, 0), b(0, Z))), hr(U)) {
          for (var H, J, ar = 0, cr = 1, e = 1; ; ) {
            if (typeof q == "number") N = (e * Z * fr - cr * q * vr) / (e * Z - cr * q);
            else
              for (N = vr, W = q.length - 1; W !== -1; --W)
                q[W] < 0 && Z[W] > 0 && (N = I(N, (e * Z[W] * fr - cr * q[W] * vr) / (e * Z[W] - cr * q[W])));
            if (N <= fr || N >= vr) break;
            x = Q._at(N, j - 1), J = i(N, x), H = p(b(q, 0), b(0, J)), hr(H) ? (vr = N, Z = J, U = H, e = 1, ar === -1 ? cr *= 0.5 : cr = 1, ar = -1) : (fr = N, q = J, cr = 1, ar === 1 ? e *= 0.5 : e = 1, ar = 1);
          }
          return V = Q._at(0.5 * (c + N), j - 1), Q.f[j] = f(N, x), Q.x[j] = N, Q.y[j] = x, Q.ymid[j - 1] = V, Q.events = U, Q.iterations = mr, Q;
        }
      }
      c += er, n = V, q = Z, er = I(0.8 * er * ir(a / _, 0.25), 4 * er);
    }
    return Q.iterations = mr, Q;
  }, numeric.LU = function(D, c) {
    c = c || !1;
    var t = Math.abs, n, f, a, r, i, s, u, o, v, w = D.length, h = w - 1, m = new Array(w);
    for (c || (D = numeric.clone(D)), a = 0; a < w; ++a) {
      for (u = a, s = D[a], v = t(s[a]), f = a + 1; f < w; ++f)
        r = t(D[f][a]), v < r && (v = r, u = f);
      for (m[a] = u, u != a && (D[a] = D[u], D[u] = s, s = D[a]), i = s[a], n = a + 1; n < w; ++n)
        D[n][a] /= i;
      for (n = a + 1; n < w; ++n) {
        for (o = D[n], f = a + 1; f < h; ++f)
          o[f] -= o[a] * s[f], ++f, o[f] -= o[a] * s[f];
        f === h && (o[f] -= o[a] * s[f]);
      }
    }
    return {
      LU: D,
      P: m
    };
  }, numeric.LUsolve = function D(c, t) {
    var n, f, a = c.LU, r = a.length, i = numeric.clone(t), s = c.P, u, o, v;
    for (n = r - 1; n !== -1; --n) i[n] = t[n];
    for (n = 0; n < r; ++n)
      for (u = s[n], s[n] !== n && (v = i[n], i[n] = i[u], i[u] = v), o = a[n], f = 0; f < n; ++f)
        i[n] -= i[f] * o[f];
    for (n = r - 1; n >= 0; --n) {
      for (o = a[n], f = n + 1; f < r; ++f)
        i[n] -= i[f] * o[f];
      i[n] /= o[n];
    }
    return i;
  }, numeric.solve = function D(c, t, n) {
    return numeric.LUsolve(numeric.LU(c, n), t);
  }, numeric.echelonize = function D(c) {
    var t = numeric.dim(c), n = t[0], f = t[1], a = numeric.identity(n), r = Array(n), i, s, u, o, v, w, h, m, y = Math.abs, P = numeric.diveq;
    for (c = numeric.clone(c), i = 0; i < n; ++i) {
      for (u = 0, v = c[i], w = a[i], s = 1; s < f; ++s) y(v[u]) < y(v[s]) && (u = s);
      for (r[i] = u, P(w, v[u]), P(v, v[u]), s = 0; s < n; ++s) if (s !== i) {
        for (h = c[s], m = h[u], o = f - 1; o !== -1; --o) h[o] -= v[o] * m;
        for (h = a[s], o = n - 1; o !== -1; --o) h[o] -= w[o] * m;
      }
    }
    return { I: a, A: c, P: r };
  }, numeric.__solveLP = function D(c, t, n, f, a, r, i) {
    var s = numeric.sum;
    numeric.log;
    var u = numeric.mul, o = numeric.sub, v = numeric.dot, w = numeric.div, h = numeric.add, m = c.length, y = n.length, P, E = !1, z = 0, g = 1;
    numeric.transpose(t), numeric.svd;
    var d = numeric.transpose;
    numeric.leq;
    var R = Math.sqrt, L = Math.abs;
    numeric.muleq, numeric.norminf, numeric.any;
    var F = Math.min, l = numeric.all, S = numeric.gt, O = Array(m), j = Array(y);
    numeric.rep([y], 1);
    var Y, W = numeric.solve, er = o(n, v(t, r)), mr, yr = v(c, c), or;
    for (mr = z; mr < a; ++mr) {
      var V, _;
      for (V = y - 1; V !== -1; --V) j[V] = w(t[V], er[V]);
      var I = d(j);
      for (V = m - 1; V !== -1; --V) O[V] = /*x[i]+*/
      s(I[V]);
      g = 0.25 * L(yr / v(c, O));
      var $ = 100 * R(yr / v(O, O));
      for ((!isFinite(g) || g > $) && (g = $), or = h(c, u(g, O)), Y = v(I, j), V = m - 1; V !== -1; --V) Y[V][V] += 1;
      _ = W(Y, w(or, g), !0);
      var rr = w(er, v(t, _)), ir = 1;
      for (V = y - 1; V !== -1; --V) rr[V] < 0 && (ir = F(ir, -0.999 * rr[V]));
      if (P = o(r, u(_, ir)), er = o(n, v(t, P)), !l(S(er, 0))) return { solution: r, message: "", iterations: mr };
      if (r = P, g < f) return { solution: P, message: "", iterations: mr };
      if (i) {
        var hr = v(c, or), b = v(t, or);
        for (E = !0, V = y - 1; V !== -1; --V) if (hr * b[V] < 0) {
          E = !1;
          break;
        }
      } else
        r[m - 1] >= 0 ? E = !1 : E = !0;
      if (E) return { solution: P, message: "Unbounded", iterations: mr };
    }
    return { solution: r, message: "maximum iteration count exceeded", iterations: mr };
  }, numeric._solveLP = function D(c, t, n, f, a) {
    var r = c.length, i = n.length, m;
    numeric.sum, numeric.log, numeric.mul;
    var s = numeric.sub, u = numeric.dot;
    numeric.div, numeric.add;
    var o = numeric.rep([r], 0).concat([1]), v = numeric.rep([i, 1], -1), w = numeric.blockMatrix([[t, v]]), h = n, m = numeric.rep([r], 0).concat(Math.max(0, numeric.sup(numeric.neg(n))) + 1), y = numeric.__solveLP(o, w, h, f, a, m, !1), P = numeric.clone(y.solution);
    P.length = r;
    var E = numeric.inf(s(n, u(t, P)));
    if (E < 0)
      return { solution: NaN, message: "Infeasible", iterations: y.iterations };
    var z = numeric.__solveLP(c, t, n, f, a - y.iterations, P, !0);
    return z.iterations += y.iterations, z;
  }, numeric.solveLP = function D(c, t, n, f, a, r, i) {
    if (typeof i > "u" && (i = 1e3), typeof r > "u" && (r = numeric.epsilon), typeof f > "u") return numeric._solveLP(c, t, n, r, i);
    var s = f.length, u = f[0].length, o = t.length, v = numeric.echelonize(f), w = numeric.rep([u], 0), h = v.P, m = [], y;
    for (y = h.length - 1; y !== -1; --y) w[h[y]] = 1;
    for (y = u - 1; y !== -1; --y) w[y] === 0 && m.push(y);
    var P = numeric.getRange, E = numeric.linspace(0, s - 1), z = numeric.linspace(0, o - 1), g = P(f, E, m), d = P(t, z, h), R = P(t, z, m), L = numeric.dot, F = numeric.sub, l = L(d, v.I), S = F(R, L(l, g)), O = F(n, L(l, a)), j = Array(h.length), Y = Array(m.length);
    for (y = h.length - 1; y !== -1; --y) j[y] = c[h[y]];
    for (y = m.length - 1; y !== -1; --y) Y[y] = c[m[y]];
    var W = F(Y, L(j, L(v.I, g))), er = numeric._solveLP(W, S, O, r, i), mr = er.solution;
    if (mr !== mr) return er;
    var yr = L(v.I, F(a, L(g, mr))), or = Array(c.length);
    for (y = h.length - 1; y !== -1; --y) or[h[y]] = yr[y];
    for (y = m.length - 1; y !== -1; --y) or[m[y]] = mr[y];
    return { solution: or, message: er.message, iterations: er.iterations };
  }, numeric.MPStoLP = function D(c) {
    c instanceof String && c.split(`
`);
    var t = 0, n = ["Initial state", "NAME", "ROWS", "COLUMNS", "RHS", "BOUNDS", "ENDATA"], f = c.length, a, r, i, s = 0, u = {}, o = [], v = 0, w = {}, h = 0, m, y = [], P = [], E = [];
    function z(F) {
      throw new Error("MPStoLP: " + F + `
Line ` + a + ": " + c[a] + `
Current state: ` + n[t] + `
`);
    }
    for (a = 0; a < f; ++a) {
      i = c[a];
      var g = i.match(/\S*/g), d = [];
      for (r = 0; r < g.length; ++r) g[r] !== "" && d.push(g[r]);
      if (d.length !== 0) {
        for (r = 0; r < n.length && i.substr(0, n[r].length) !== n[r]; ++r) ;
        if (r < n.length) {
          if (t = r, r === 1 && (m = d[1]), r === 6) return { name: m, c: y, A: numeric.transpose(P), b: E, rows: u, vars: w };
          continue;
        }
        switch (t) {
          case 0:
          case 1:
            z("Unexpected line");
          case 2:
            switch (d[0]) {
              case "N":
                s === 0 ? s = d[1] : z("Two or more N rows");
                break;
              case "L":
                u[d[1]] = v, o[v] = 1, E[v] = 0, ++v;
                break;
              case "G":
                u[d[1]] = v, o[v] = -1, E[v] = 0, ++v;
                break;
              case "E":
                u[d[1]] = v, o[v] = 0, E[v] = 0, ++v;
                break;
              default:
                z("Parse error " + numeric.prettyPrint(d));
            }
            break;
          case 3:
            w.hasOwnProperty(d[0]) || (w[d[0]] = h, y[h] = 0, P[h] = numeric.rep([v], 0), ++h);
            var R = w[d[0]];
            for (r = 1; r < d.length; r += 2) {
              if (d[r] === s) {
                y[R] = parseFloat(d[r + 1]);
                continue;
              }
              var L = u[d[r]];
              P[R][L] = (o[L] < 0 ? -1 : 1) * parseFloat(d[r + 1]);
            }
            break;
          case 4:
            for (r = 1; r < d.length; r += 2) E[u[d[r]]] = (o[u[d[r]]] < 0 ? -1 : 1) * parseFloat(d[r + 1]);
            break;
          case 5:
            break;
          case 6:
            z("Internal error");
        }
      }
    }
    z("Reached end of file without ENDATA");
  }, numeric.seedrandom = { pow: Math.pow, random: Math.random }, (function(D, c, t, n, f, a, r) {
    c.seedrandom = function(w, h) {
      var m = [], y;
      return w = u(s(
        h ? [w, D] : arguments.length ? w : [(/* @__PURE__ */ new Date()).getTime(), D, window],
        3
      ), m), y = new i(m), u(y.S, D), c.random = function() {
        for (var E = y.g(n), z = r, g = 0; E < f; )
          E = (E + g) * t, z *= t, g = y.g(1);
        for (; E >= a; )
          E /= 2, z /= 2, g >>>= 1;
        return (E + g) / z;
      }, w;
    };
    function i(v) {
      var w, h, m = this, y = v.length, P = 0, E = m.i = m.j = m.m = 0;
      for (m.S = [], m.c = [], y || (v = [y++]); P < t; )
        m.S[P] = P++;
      for (P = 0; P < t; P++)
        w = m.S[P], E = o(E + w + v[P % y]), h = m.S[E], m.S[P] = h, m.S[E] = w;
      m.g = function(g) {
        var d = m.S, R = o(m.i + 1), L = d[R], F = o(m.j + L), l = d[F];
        d[R] = l, d[F] = L;
        for (var S = d[o(L + l)]; --g; )
          R = o(R + 1), L = d[R], F = o(F + L), l = d[F], d[R] = l, d[F] = L, S = S * t + d[o(L + l)];
        return m.i = R, m.j = F, S;
      }, m.g(t);
    }
    function s(v, w, h, m, y) {
      if (h = [], y = typeof v, w && y == "object") {
        for (m in v)
          if (m.indexOf("S") < 5)
            try {
              h.push(s(v[m], w - 1));
            } catch {
            }
      }
      return h.length ? h : v + (y != "string" ? "\0" : "");
    }
    function u(v, w, h, m) {
      for (v += "", h = 0, m = 0; m < v.length; m++)
        w[o(m)] = o((h ^= w[o(m)] * 19) + v.charCodeAt(m));
      v = "";
      for (m in w)
        v += String.fromCharCode(w[m]);
      return v;
    }
    function o(v) {
      return v & t - 1;
    }
    r = c.pow(t, n), f = c.pow(2, f), a = f * 2, u(c.random(), D);
  })(
    [],
    // pool: entropy pool starts empty
    numeric.seedrandom,
    // math: package containing random, pow, and seedrandom
    256,
    // width: each RC4 output is 0 <= x < 256
    6,
    // chunks: at least six RC4 outputs for each double
    52
    // significance: there are 52 significant digits in a double
  ), (function(D) {
    function c(s) {
      if (typeof s != "object")
        return s;
      var u = [], o, v = s.length;
      for (o = 0; o < v; o++) u[o + 1] = c(s[o]);
      return u;
    }
    function t(s) {
      if (typeof s != "object")
        return s;
      var u = [], o, v = s.length;
      for (o = 1; o < v; o++) u[o - 1] = t(s[o]);
      return u;
    }
    function n(s, u, o) {
      var v, w, h, m, y;
      for (h = 1; h <= o; h = h + 1) {
        for (s[h][h] = 1 / s[h][h], y = -s[h][h], v = 1; v < h; v = v + 1)
          s[v][h] = y * s[v][h];
        if (m = h + 1, o < m)
          break;
        for (w = m; w <= o; w = w + 1)
          for (y = s[h][w], s[h][w] = 0, v = 1; v <= h; v = v + 1)
            s[v][w] = s[v][w] + y * s[v][h];
      }
    }
    function f(s, u, o, v) {
      var w, h, m, y;
      for (h = 1; h <= o; h = h + 1) {
        for (y = 0, w = 1; w < h; w = w + 1)
          y = y + s[w][h] * v[w];
        v[h] = (v[h] - y) / s[h][h];
      }
      for (m = 1; m <= o; m = m + 1)
        for (h = o + 1 - m, v[h] = v[h] / s[h][h], y = -v[h], w = 1; w < h; w = w + 1)
          v[w] = v[w] + y * s[w][h];
    }
    function a(s, u, o, v) {
      var w, h, m, y, P, E;
      for (h = 1; h <= o; h = h + 1) {
        if (v[1] = h, E = 0, m = h - 1, m < 1) {
          if (E = s[h][h] - E, E <= 0)
            break;
          s[h][h] = Math.sqrt(E);
        } else {
          for (y = 1; y <= m; y = y + 1) {
            for (P = s[y][h], w = 1; w < y; w = w + 1)
              P = P - s[w][h] * s[w][y];
            P = P / s[y][y], s[y][h] = P, E = E + P * P;
          }
          if (E = s[h][h] - E, E <= 0)
            break;
          s[h][h] = Math.sqrt(E);
        }
        v[1] = 0;
      }
    }
    function r(s, u, o, v, w, h, m, y, P, E, z, g, d, R, L, F) {
      var l, S, O, j, Y, W, er, mr, yr, or, V, _, I, $, rr, ir, hr, b, p, q, Z, U, Q, x, fr, vr, N;
      I = Math.min(v, E), O = 2 * v + I * (I + 5) / 2 + 2 * E + 1, x = 1e-60;
      do
        x = x + x, fr = 1 + 0.1 * x, vr = 1 + 0.2 * x;
      while (fr <= 1 || vr <= 1);
      for (l = 1; l <= v; l = l + 1)
        L[l] = u[l];
      for (l = v + 1; l <= O; l = l + 1)
        L[l] = 0;
      for (l = 1; l <= E; l = l + 1)
        g[l] = 0;
      if (Y = [], F[1] === 0) {
        if (a(s, o, v, Y), Y[1] !== 0) {
          F[1] = 2;
          return;
        }
        f(s, o, v, u), n(s, o, v);
      } else {
        for (S = 1; S <= v; S = S + 1)
          for (w[S] = 0, l = 1; l <= S; l = l + 1)
            w[S] = w[S] + s[l][S] * u[l];
        for (S = 1; S <= v; S = S + 1)
          for (u[S] = 0, l = S; l <= v; l = l + 1)
            u[S] = u[S] + s[S][l] * w[l];
      }
      for (h[1] = 0, S = 1; S <= v; S = S + 1)
        for (w[S] = u[S], h[1] = h[1] + L[S] * w[S], L[S] = 0, l = S + 1; l <= v; l = l + 1)
          s[l][S] = 0;
      for (h[1] = -h[1] / 2, F[1] = 0, er = v, mr = er + v, V = mr + I, yr = V + I + 1, or = yr + I * (I + 1) / 2, $ = or + E, l = 1; l <= E; l = l + 1) {
        for (ir = 0, S = 1; S <= v; S = S + 1)
          ir = ir + m[S][l] * m[S][l];
        L[$ + l] = Math.sqrt(ir);
      }
      d = 0, R[1] = 0, R[2] = 0;
      function H() {
        for (R[1] = R[1] + 1, O = or, l = 1; l <= E; l = l + 1) {
          for (O = O + 1, ir = -y[l], S = 1; S <= v; S = S + 1)
            ir = ir + m[S][l] * w[S];
          if (Math.abs(ir) < x && (ir = 0), l > z)
            L[O] = ir;
          else if (L[O] = -Math.abs(ir), ir > 0) {
            for (S = 1; S <= v; S = S + 1)
              m[S][l] = -m[S][l];
            y[l] = -y[l];
          }
        }
        for (l = 1; l <= d; l = l + 1)
          L[or + g[l]] = 0;
        for (_ = 0, rr = 0, l = 1; l <= E; l = l + 1)
          L[or + l] < rr * L[$ + l] && (_ = l, rr = L[or + l] / L[$ + l]);
        return _ === 0 ? 999 : 0;
      }
      function J() {
        for (l = 1; l <= v; l = l + 1) {
          for (ir = 0, S = 1; S <= v; S = S + 1)
            ir = ir + s[S][l] * m[S][_];
          L[l] = ir;
        }
        for (j = er, l = 1; l <= v; l = l + 1)
          L[j + l] = 0;
        for (S = d + 1; S <= v; S = S + 1)
          for (l = 1; l <= v; l = l + 1)
            L[j + l] = L[j + l] + s[l][S] * L[S];
        for (U = !0, l = d; l >= 1; l = l - 1) {
          for (ir = L[l], O = yr + l * (l + 3) / 2, j = O - l, S = l + 1; S <= d; S = S + 1)
            ir = ir - L[O] * L[mr + S], O = O + S;
          if (ir = ir / L[j], L[mr + l] = ir, g[l] < z || ir < 0)
            break;
          U = !1, W = l;
        }
        if (!U)
          for (hr = L[V + W] / L[mr + W], l = 1; l <= d && !(g[l] < z || L[mr + l] < 0); l = l + 1)
            rr = L[V + l] / L[mr + l], rr < hr && (hr = rr, W = l);
        for (ir = 0, l = er + 1; l <= er + v; l = l + 1)
          ir = ir + L[l] * L[l];
        if (Math.abs(ir) <= x) {
          if (U)
            return F[1] = 1, 999;
          for (l = 1; l <= d; l = l + 1)
            L[V + l] = L[V + l] - hr * L[mr + l];
          return L[V + d + 1] = L[V + d + 1] + hr, 700;
        } else {
          for (ir = 0, l = 1; l <= v; l = l + 1)
            ir = ir + L[er + l] * m[l][_];
          for (b = -L[or + _] / ir, Q = !0, U || hr < b && (b = hr, Q = !1), l = 1; l <= v; l = l + 1)
            w[l] = w[l] + b * L[er + l], Math.abs(w[l]) < x && (w[l] = 0);
          for (h[1] = h[1] + b * ir * (b / 2 + L[V + d + 1]), l = 1; l <= d; l = l + 1)
            L[V + l] = L[V + l] - b * L[mr + l];
          if (L[V + d + 1] = L[V + d + 1] + b, Q) {
            for (d = d + 1, g[d] = _, O = yr + (d - 1) * d / 2 + 1, l = 1; l <= d - 1; l = l + 1)
              L[O] = L[l], O = O + 1;
            if (d === v)
              L[O] = L[v];
            else {
              for (l = v; l >= d + 1 && !(L[l] === 0 || (p = Math.max(Math.abs(L[l - 1]), Math.abs(L[l])), q = Math.min(Math.abs(L[l - 1]), Math.abs(L[l])), L[l - 1] >= 0 ? rr = Math.abs(p * Math.sqrt(1 + q * q / (p * p))) : rr = -Math.abs(p * Math.sqrt(1 + q * q / (p * p))), p = L[l - 1] / rr, q = L[l] / rr, p === 1)); l = l - 1)
                if (p === 0)
                  for (L[l - 1] = q * rr, S = 1; S <= v; S = S + 1)
                    rr = s[S][l - 1], s[S][l - 1] = s[S][l], s[S][l] = rr;
                else
                  for (L[l - 1] = rr, Z = q / (1 + p), S = 1; S <= v; S = S + 1)
                    rr = p * s[S][l - 1] + q * s[S][l], s[S][l] = Z * (s[S][l - 1] + rr) - s[S][l], s[S][l - 1] = rr;
              L[O] = L[d];
            }
          } else {
            for (ir = -y[_], S = 1; S <= v; S = S + 1)
              ir = ir + w[S] * m[S][_];
            if (_ > z)
              L[or + _] = ir;
            else if (L[or + _] = -Math.abs(ir), ir > 0) {
              for (S = 1; S <= v; S = S + 1)
                m[S][_] = -m[S][_];
              y[_] = -y[_];
            }
            return 700;
          }
        }
        return 0;
      }
      function ar() {
        if (O = yr + W * (W + 1) / 2 + 1, j = O + W, L[j] === 0 || (p = Math.max(Math.abs(L[j - 1]), Math.abs(L[j])), q = Math.min(Math.abs(L[j - 1]), Math.abs(L[j])), L[j - 1] >= 0 ? rr = Math.abs(p * Math.sqrt(1 + q * q / (p * p))) : rr = -Math.abs(p * Math.sqrt(1 + q * q / (p * p))), p = L[j - 1] / rr, q = L[j] / rr, p === 1))
          return 798;
        if (p === 0) {
          for (l = W + 1; l <= d; l = l + 1)
            rr = L[j - 1], L[j - 1] = L[j], L[j] = rr, j = j + l;
          for (l = 1; l <= v; l = l + 1)
            rr = s[l][W], s[l][W] = s[l][W + 1], s[l][W + 1] = rr;
        } else {
          for (Z = q / (1 + p), l = W + 1; l <= d; l = l + 1)
            rr = p * L[j - 1] + q * L[j], L[j] = Z * (L[j - 1] + rr) - L[j], L[j - 1] = rr, j = j + l;
          for (l = 1; l <= v; l = l + 1)
            rr = p * s[l][W] + q * s[l][W + 1], s[l][W + 1] = Z * (s[l][W] + rr) - s[l][W + 1], s[l][W] = rr;
        }
        return 0;
      }
      function cr() {
        for (j = O - W, l = 1; l <= W; l = l + 1)
          L[j] = L[O], O = O + 1, j = j + 1;
        return L[V + W] = L[V + W + 1], g[W] = g[W + 1], W = W + 1, W < d ? 797 : 0;
      }
      function e() {
        return L[V + d] = L[V + d + 1], L[V + d + 1] = 0, g[d] = 0, d = d - 1, R[2] = R[2] + 1, 0;
      }
      for (N = 0; ; ) {
        if (N = H(), N === 999)
          return;
        for (; N = J(), N !== 0; ) {
          if (N === 999)
            return;
          if (N === 700)
            if (W === d)
              e();
            else {
              for (; ar(), N = cr(), N === 797; )
                ;
              e();
            }
        }
      }
    }
    function i(s, u, o, v, w, h) {
      s = c(s), u = c(u), o = c(o);
      var m, y, P, E, z, g = [], d = [], R = [], L = [], F = [], l;
      if (w = w || 0, h = h ? c(h) : [void 0, 0], v = v ? c(v) : [], y = s.length - 1, P = o[1].length - 1, !v)
        for (m = 1; m <= P; m = m + 1)
          v[m] = 0;
      for (m = 1; m <= P; m = m + 1)
        d[m] = 0;
      for (E = 0, z = Math.min(y, P), m = 1; m <= y; m = m + 1)
        R[m] = 0;
      for (g[1] = 0, m = 1; m <= 2 * y + z * (z + 5) / 2 + 2 * P + 1; m = m + 1)
        L[m] = 0;
      for (m = 1; m <= 2; m = m + 1)
        F[m] = 0;
      return r(
        s,
        u,
        y,
        y,
        R,
        g,
        o,
        v,
        y,
        P,
        w,
        d,
        E,
        F,
        L,
        h
      ), l = "", h[1] === 1 && (l = "constraints are inconsistent, no solution!"), h[1] === 2 && (l = "matrix D in quadratic function is not positive definite!"), {
        solution: t(R),
        value: t(g),
        unconstrained_solution: t(u),
        iterations: t(F),
        iact: t(d),
        message: l
      };
    }
    D.solveQP = i;
  })(numeric), numeric.svd = function D(c) {
    var t, n = numeric.epsilon, f = 1e-64 / n, a = 50, r = 0, i = 0, s = 0, u = 0, o = 0, v = numeric.clone(c), w = v.length, h = v[0].length;
    if (w < h) throw "Need more rows than columns";
    var m = new Array(h), y = new Array(h);
    for (i = 0; i < h; i++) m[i] = y[i] = 0;
    var P = numeric.rep([h, h], 0);
    function E(Y, W) {
      return Y = Math.abs(Y), W = Math.abs(W), Y > W ? Y * Math.sqrt(1 + W * W / Y / Y) : W == 0 ? Y : W * Math.sqrt(1 + Y * Y / W / W);
    }
    var z = 0, g = 0, d = 0, R = 0, L = 0, F = 0, l = 0;
    for (i = 0; i < h; i++) {
      for (m[i] = g, l = 0, o = i + 1, s = i; s < w; s++)
        l += v[s][i] * v[s][i];
      if (l <= f)
        g = 0;
      else
        for (z = v[i][i], g = Math.sqrt(l), z >= 0 && (g = -g), d = z * g - l, v[i][i] = z - g, s = o; s < h; s++) {
          for (l = 0, u = i; u < w; u++)
            l += v[u][i] * v[u][s];
          for (z = l / d, u = i; u < w; u++)
            v[u][s] += z * v[u][i];
        }
      for (y[i] = g, l = 0, s = o; s < h; s++)
        l = l + v[i][s] * v[i][s];
      if (l <= f)
        g = 0;
      else {
        for (z = v[i][i + 1], g = Math.sqrt(l), z >= 0 && (g = -g), d = z * g - l, v[i][i + 1] = z - g, s = o; s < h; s++) m[s] = v[i][s] / d;
        for (s = o; s < w; s++) {
          for (l = 0, u = o; u < h; u++)
            l += v[s][u] * v[i][u];
          for (u = o; u < h; u++)
            v[s][u] += l * m[u];
        }
      }
      L = Math.abs(y[i]) + Math.abs(m[i]), L > R && (R = L);
    }
    for (i = h - 1; i != -1; i += -1) {
      if (g != 0) {
        for (d = g * v[i][i + 1], s = o; s < h; s++)
          P[s][i] = v[i][s] / d;
        for (s = o; s < h; s++) {
          for (l = 0, u = o; u < h; u++)
            l += v[i][u] * P[u][s];
          for (u = o; u < h; u++)
            P[u][s] += l * P[u][i];
        }
      }
      for (s = o; s < h; s++)
        P[i][s] = 0, P[s][i] = 0;
      P[i][i] = 1, g = m[i], o = i;
    }
    for (i = h - 1; i != -1; i += -1) {
      for (o = i + 1, g = y[i], s = o; s < h; s++)
        v[i][s] = 0;
      if (g != 0) {
        for (d = v[i][i] * g, s = o; s < h; s++) {
          for (l = 0, u = o; u < w; u++) l += v[u][i] * v[u][s];
          for (z = l / d, u = i; u < w; u++) v[u][s] += z * v[u][i];
        }
        for (s = i; s < w; s++) v[s][i] = v[s][i] / g;
      } else
        for (s = i; s < w; s++) v[s][i] = 0;
      v[i][i] += 1;
    }
    for (n = n * R, u = h - 1; u != -1; u += -1)
      for (var S = 0; S < a; S++) {
        var O = !1;
        for (o = u; o != -1; o += -1) {
          if (Math.abs(m[o]) <= n) {
            O = !0;
            break;
          }
          if (Math.abs(y[o - 1]) <= n)
            break;
        }
        if (!O) {
          r = 0, l = 1;
          var j = o - 1;
          for (i = o; i < u + 1 && (z = l * m[i], m[i] = r * m[i], !(Math.abs(z) <= n)); i++)
            for (g = y[i], d = E(z, g), y[i] = d, r = g / d, l = -z / d, s = 0; s < w; s++)
              L = v[s][j], F = v[s][i], v[s][j] = L * r + F * l, v[s][i] = -L * l + F * r;
        }
        if (F = y[u], o == u) {
          if (F < 0)
            for (y[u] = -F, s = 0; s < h; s++)
              P[s][u] = -P[s][u];
          break;
        }
        if (S >= a - 1)
          throw "Error: no convergence.";
        for (R = y[o], L = y[u - 1], g = m[u - 1], d = m[u], z = ((L - F) * (L + F) + (g - d) * (g + d)) / (2 * d * L), g = E(z, 1), z < 0 ? z = ((R - F) * (R + F) + d * (L / (z - g) - d)) / R : z = ((R - F) * (R + F) + d * (L / (z + g) - d)) / R, r = 1, l = 1, i = o + 1; i < u + 1; i++) {
          for (g = m[i], L = y[i], d = l * g, g = r * g, F = E(z, d), m[i - 1] = F, r = z / F, l = d / F, z = R * r + g * l, g = -R * l + g * r, d = L * l, L = L * r, s = 0; s < h; s++)
            R = P[s][i - 1], F = P[s][i], P[s][i - 1] = R * r + F * l, P[s][i] = -R * l + F * r;
          for (F = E(z, d), y[i - 1] = F, r = z / F, l = d / F, z = r * g + l * L, R = -l * g + r * L, s = 0; s < w; s++)
            L = v[s][i - 1], F = v[s][i], v[s][i - 1] = L * r + F * l, v[s][i] = -L * l + F * r;
        }
        m[o] = 0, m[u] = z, y[u] = R;
      }
    for (i = 0; i < y.length; i++)
      y[i] < n && (y[i] = 0);
    for (i = 0; i < h; i++)
      for (s = i - 1; s >= 0; s--)
        if (y[s] < y[i]) {
          for (r = y[s], y[s] = y[i], y[i] = r, u = 0; u < v.length; u++)
            t = v[u][i], v[u][i] = v[u][s], v[u][s] = t;
          for (u = 0; u < P.length; u++)
            t = P[u][i], P[u][i] = P[u][s], P[u][s] = t;
          i = s;
        }
    return { U: v, S: y, V: P };
  };
})(numeric1_2_6);
var numeric$1 = numeric1_2_6, convertCart2Sph = function(D, c) {
  for (var t, n, f, a = new Array(D.length), r = 0; r < D.length; r++)
    t = Math.atan2(D[r][1], D[r][0]), n = Math.atan2(D[r][2], Math.sqrt(D[r][0] * D[r][0] + D[r][1] * D[r][1])), c == 1 ? a[r] = [t, n] : (f = Math.sqrt(D[r][0] * D[r][0] + D[r][1] * D[r][1] + D[r][2] * D[r][2]), a[r] = [t, n, f]);
  return a;
}, computeRealSH = function(D, c) {
  for (var t = new Array(c.length), n = new Array(c.length), f = 0; f < c.length; f++)
    t[f] = c[f][0], n[f] = c[f][1];
  var a = new Array(2 * D + 1);
  t.length;
  for (var r = (D + 1) * (D + 1), i = 0, s = 0, u, o = numeric$1.sin(n), v = 0, w = new Array(r), h, m, y, P, f = 0; f < 2 * D + 1; f++) a[f] = factorial(f);
  for (var E = 0; E < D + 1; E++) {
    if (E == 0) {
      var z = new Array(t.length);
      z.fill(1), w[E] = z, v = 1;
    } else {
      u = recurseLegendrePoly(E, o, i, s), h = Math.sqrt(2 * E + 1);
      for (var g = 0; g < E + 1; g++)
        g == 0 ? w[v + E] = numeric$1.mul(h, u[g]) : (m = h * Math.sqrt(2 * a[E - g] / a[E + g]), y = numeric$1.cos(numeric$1.mul(g, t)), P = numeric$1.sin(numeric$1.mul(g, t)), w[v + E - g] = numeric$1.mul(m, numeric$1.mul(u[g], P)), w[v + E + g] = numeric$1.mul(m, numeric$1.mul(u[g], y)));
      v = v + 2 * E + 1;
    }
    s = i, i = u;
  }
  return w;
}, factorial = function(D) {
  return D === 0 ? 1 : D * factorial(D - 1);
}, recurseLegendrePoly = function(D, c, t, n) {
  var f = new Array(D + 1);
  switch (D) {
    case 1:
      var o = numeric$1.mul(c, c), a = c, r = numeric$1.sqrt(numeric$1.sub(1, o));
      f[0] = a, f[1] = r;
      break;
    case 2:
      var o = numeric$1.mul(c, c), i = numeric$1.mul(3, o);
      i = numeric$1.sub(i, 1), i = numeric$1.div(i, 2);
      var s = numeric$1.sub(1, o);
      s = numeric$1.sqrt(s), s = numeric$1.mul(3, s), s = numeric$1.mul(s, c);
      var u = numeric$1.sub(1, o);
      u = numeric$1.mul(3, u), f[0] = i, f[1] = s, f[2] = u;
      break;
    default:
      var o = numeric$1.mul(c, c), v = numeric$1.sub(1, o), w = 2 * D - 1, h = 1;
      if (w % 2 == 0)
        for (var m = 1; m < w / 2 + 1; m++) h = h * 2 * m;
      else
        for (var m = 1; m < (w + 1) / 2 + 1; m++) h = h * (2 * m - 1);
      f[D] = numeric$1.mul(h, numeric$1.pow(v, D / 2)), f[D - 1] = numeric$1.mul(2 * D - 1, numeric$1.mul(c, t[D - 1]));
      for (var y = 0; y < D - 1; y++) {
        var P = numeric$1.mul(2 * D - 1, numeric$1.mul(c, t[y])), E = numeric$1.mul(D + y - 1, n[y]);
        f[y] = numeric$1.div(numeric$1.sub(P, E), D - y);
      }
  }
  return f;
}, convertCart2Sph_1 = convertCart2Sph, computeRealSH_1 = computeRealSH, orientation = { exports: {} }, twoProduct_1 = twoProduct$1, SPLITTER = +(Math.pow(2, 27) + 1);
function twoProduct$1(D, c, t) {
  var n = D * c, f = SPLITTER * D, a = f - D, r = f - a, i = D - r, s = SPLITTER * c, u = s - c, o = s - u, v = c - o, w = n - r * o, h = w - i * o, m = h - r * v, y = i * v - m;
  return t ? (t[0] = y, t[1] = n, t) : [y, n];
}
var robustSum = linearExpansionSum;
function scalarScalar$1(D, c) {
  var t = D + c, n = t - D, f = t - n, a = c - n, r = D - f, i = r + a;
  return i ? [i, t] : [t];
}
function linearExpansionSum(D, c) {
  var t = D.length | 0, n = c.length | 0;
  if (t === 1 && n === 1)
    return scalarScalar$1(D[0], c[0]);
  var f = t + n, a = new Array(f), r = 0, i = 0, s = 0, u = Math.abs, o = D[i], v = u(o), w = c[s], h = u(w), m, y;
  v < h ? (y = o, i += 1, i < t && (o = D[i], v = u(o))) : (y = w, s += 1, s < n && (w = c[s], h = u(w))), i < t && v < h || s >= n ? (m = o, i += 1, i < t && (o = D[i], v = u(o))) : (m = w, s += 1, s < n && (w = c[s], h = u(w)));
  for (var P = m + y, E = P - m, z = y - E, g = z, d = P, R, L, F, l, S; i < t && s < n; )
    v < h ? (m = o, i += 1, i < t && (o = D[i], v = u(o))) : (m = w, s += 1, s < n && (w = c[s], h = u(w))), y = g, P = m + y, E = P - m, z = y - E, z && (a[r++] = z), R = d + P, L = R - d, F = R - L, l = P - L, S = d - F, g = S + l, d = R;
  for (; i < t; )
    m = o, y = g, P = m + y, E = P - m, z = y - E, z && (a[r++] = z), R = d + P, L = R - d, F = R - L, l = P - L, S = d - F, g = S + l, d = R, i += 1, i < t && (o = D[i]);
  for (; s < n; )
    m = w, y = g, P = m + y, E = P - m, z = y - E, z && (a[r++] = z), R = d + P, L = R - d, F = R - L, l = P - L, S = d - F, g = S + l, d = R, s += 1, s < n && (w = c[s]);
  return g && (a[r++] = g), d && (a[r++] = d), r || (a[r++] = 0), a.length = r, a;
}
var twoSum$1 = fastTwoSum;
function fastTwoSum(D, c, t) {
  var n = D + c, f = n - D, a = n - f, r = c - f, i = D - a;
  return t ? (t[0] = i + r, t[1] = n, t) : [i + r, n];
}
var twoProduct = twoProduct_1, twoSum = twoSum$1, robustScale = scaleLinearExpansion;
function scaleLinearExpansion(D, c) {
  var t = D.length;
  if (t === 1) {
    var n = twoProduct(D[0], c);
    return n[0] ? n : [n[1]];
  }
  var f = new Array(2 * t), a = [0.1, 0.1], r = [0.1, 0.1], i = 0;
  twoProduct(D[0], c, a), a[0] && (f[i++] = a[0]);
  for (var s = 1; s < t; ++s) {
    twoProduct(D[s], c, r);
    var u = a[1];
    twoSum(u, r[0], a), a[0] && (f[i++] = a[0]);
    var o = r[1], v = a[1], w = o + v, h = w - o, m = v - h;
    a[1] = w, m && (f[i++] = m);
  }
  return a[1] && (f[i++] = a[1]), i === 0 && (f[i++] = 0), f.length = i, f;
}
var robustDiff = robustSubtract;
function scalarScalar(D, c) {
  var t = D + c, n = t - D, f = t - n, a = c - n, r = D - f, i = r + a;
  return i ? [i, t] : [t];
}
function robustSubtract(D, c) {
  var t = D.length | 0, n = c.length | 0;
  if (t === 1 && n === 1)
    return scalarScalar(D[0], -c[0]);
  var f = t + n, a = new Array(f), r = 0, i = 0, s = 0, u = Math.abs, o = D[i], v = u(o), w = -c[s], h = u(w), m, y;
  v < h ? (y = o, i += 1, i < t && (o = D[i], v = u(o))) : (y = w, s += 1, s < n && (w = -c[s], h = u(w))), i < t && v < h || s >= n ? (m = o, i += 1, i < t && (o = D[i], v = u(o))) : (m = w, s += 1, s < n && (w = -c[s], h = u(w)));
  for (var P = m + y, E = P - m, z = y - E, g = z, d = P, R, L, F, l, S; i < t && s < n; )
    v < h ? (m = o, i += 1, i < t && (o = D[i], v = u(o))) : (m = w, s += 1, s < n && (w = -c[s], h = u(w))), y = g, P = m + y, E = P - m, z = y - E, z && (a[r++] = z), R = d + P, L = R - d, F = R - L, l = P - L, S = d - F, g = S + l, d = R;
  for (; i < t; )
    m = o, y = g, P = m + y, E = P - m, z = y - E, z && (a[r++] = z), R = d + P, L = R - d, F = R - L, l = P - L, S = d - F, g = S + l, d = R, i += 1, i < t && (o = D[i]);
  for (; s < n; )
    m = w, y = g, P = m + y, E = P - m, z = y - E, z && (a[r++] = z), R = d + P, L = R - d, F = R - L, l = P - L, S = d - F, g = S + l, d = R, s += 1, s < n && (w = -c[s]);
  return g && (a[r++] = g), d && (a[r++] = d), r || (a[r++] = 0), a.length = r, a;
}
(function(D) {
  var c = twoProduct_1, t = robustSum, n = robustScale, f = robustDiff, a = 5, r = 11102230246251565e-32, i = (3 + 16 * r) * r, s = (7 + 56 * r) * r;
  function u(g, d, R, L) {
    return function(l, S, O) {
      var j = g(g(d(S[1], O[0]), d(-O[1], S[0])), g(d(l[1], S[0]), d(-S[1], l[0]))), Y = g(d(l[1], O[0]), d(-O[1], l[0])), W = L(j, Y);
      return W[W.length - 1];
    };
  }
  function o(g, d, R, L) {
    return function(l, S, O, j) {
      var Y = g(g(R(g(d(O[1], j[0]), d(-j[1], O[0])), S[2]), g(R(g(d(S[1], j[0]), d(-j[1], S[0])), -O[2]), R(g(d(S[1], O[0]), d(-O[1], S[0])), j[2]))), g(R(g(d(S[1], j[0]), d(-j[1], S[0])), l[2]), g(R(g(d(l[1], j[0]), d(-j[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), j[2])))), W = g(g(R(g(d(O[1], j[0]), d(-j[1], O[0])), l[2]), g(R(g(d(l[1], j[0]), d(-j[1], l[0])), -O[2]), R(g(d(l[1], O[0]), d(-O[1], l[0])), j[2]))), g(R(g(d(S[1], O[0]), d(-O[1], S[0])), l[2]), g(R(g(d(l[1], O[0]), d(-O[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), O[2])))), er = L(Y, W);
      return er[er.length - 1];
    };
  }
  function v(g, d, R, L) {
    return function(l, S, O, j, Y) {
      var W = g(g(g(R(g(R(g(d(j[1], Y[0]), d(-Y[1], j[0])), O[2]), g(R(g(d(O[1], Y[0]), d(-Y[1], O[0])), -j[2]), R(g(d(O[1], j[0]), d(-j[1], O[0])), Y[2]))), S[3]), g(R(g(R(g(d(j[1], Y[0]), d(-Y[1], j[0])), S[2]), g(R(g(d(S[1], Y[0]), d(-Y[1], S[0])), -j[2]), R(g(d(S[1], j[0]), d(-j[1], S[0])), Y[2]))), -O[3]), R(g(R(g(d(O[1], Y[0]), d(-Y[1], O[0])), S[2]), g(R(g(d(S[1], Y[0]), d(-Y[1], S[0])), -O[2]), R(g(d(S[1], O[0]), d(-O[1], S[0])), Y[2]))), j[3]))), g(R(g(R(g(d(O[1], j[0]), d(-j[1], O[0])), S[2]), g(R(g(d(S[1], j[0]), d(-j[1], S[0])), -O[2]), R(g(d(S[1], O[0]), d(-O[1], S[0])), j[2]))), -Y[3]), g(R(g(R(g(d(j[1], Y[0]), d(-Y[1], j[0])), S[2]), g(R(g(d(S[1], Y[0]), d(-Y[1], S[0])), -j[2]), R(g(d(S[1], j[0]), d(-j[1], S[0])), Y[2]))), l[3]), R(g(R(g(d(j[1], Y[0]), d(-Y[1], j[0])), l[2]), g(R(g(d(l[1], Y[0]), d(-Y[1], l[0])), -j[2]), R(g(d(l[1], j[0]), d(-j[1], l[0])), Y[2]))), -S[3])))), g(g(R(g(R(g(d(S[1], Y[0]), d(-Y[1], S[0])), l[2]), g(R(g(d(l[1], Y[0]), d(-Y[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), Y[2]))), j[3]), g(R(g(R(g(d(S[1], j[0]), d(-j[1], S[0])), l[2]), g(R(g(d(l[1], j[0]), d(-j[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), j[2]))), -Y[3]), R(g(R(g(d(O[1], j[0]), d(-j[1], O[0])), S[2]), g(R(g(d(S[1], j[0]), d(-j[1], S[0])), -O[2]), R(g(d(S[1], O[0]), d(-O[1], S[0])), j[2]))), l[3]))), g(R(g(R(g(d(O[1], j[0]), d(-j[1], O[0])), l[2]), g(R(g(d(l[1], j[0]), d(-j[1], l[0])), -O[2]), R(g(d(l[1], O[0]), d(-O[1], l[0])), j[2]))), -S[3]), g(R(g(R(g(d(S[1], j[0]), d(-j[1], S[0])), l[2]), g(R(g(d(l[1], j[0]), d(-j[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), j[2]))), O[3]), R(g(R(g(d(S[1], O[0]), d(-O[1], S[0])), l[2]), g(R(g(d(l[1], O[0]), d(-O[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), O[2]))), -j[3]))))), er = g(g(g(R(g(R(g(d(j[1], Y[0]), d(-Y[1], j[0])), O[2]), g(R(g(d(O[1], Y[0]), d(-Y[1], O[0])), -j[2]), R(g(d(O[1], j[0]), d(-j[1], O[0])), Y[2]))), l[3]), R(g(R(g(d(j[1], Y[0]), d(-Y[1], j[0])), l[2]), g(R(g(d(l[1], Y[0]), d(-Y[1], l[0])), -j[2]), R(g(d(l[1], j[0]), d(-j[1], l[0])), Y[2]))), -O[3])), g(R(g(R(g(d(O[1], Y[0]), d(-Y[1], O[0])), l[2]), g(R(g(d(l[1], Y[0]), d(-Y[1], l[0])), -O[2]), R(g(d(l[1], O[0]), d(-O[1], l[0])), Y[2]))), j[3]), R(g(R(g(d(O[1], j[0]), d(-j[1], O[0])), l[2]), g(R(g(d(l[1], j[0]), d(-j[1], l[0])), -O[2]), R(g(d(l[1], O[0]), d(-O[1], l[0])), j[2]))), -Y[3]))), g(g(R(g(R(g(d(O[1], Y[0]), d(-Y[1], O[0])), S[2]), g(R(g(d(S[1], Y[0]), d(-Y[1], S[0])), -O[2]), R(g(d(S[1], O[0]), d(-O[1], S[0])), Y[2]))), l[3]), R(g(R(g(d(O[1], Y[0]), d(-Y[1], O[0])), l[2]), g(R(g(d(l[1], Y[0]), d(-Y[1], l[0])), -O[2]), R(g(d(l[1], O[0]), d(-O[1], l[0])), Y[2]))), -S[3])), g(R(g(R(g(d(S[1], Y[0]), d(-Y[1], S[0])), l[2]), g(R(g(d(l[1], Y[0]), d(-Y[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), Y[2]))), O[3]), R(g(R(g(d(S[1], O[0]), d(-O[1], S[0])), l[2]), g(R(g(d(l[1], O[0]), d(-O[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), O[2]))), -Y[3])))), mr = L(W, er);
      return mr[mr.length - 1];
    };
  }
  function w(g) {
    var d = g === 3 ? u : g === 4 ? o : v;
    return d(t, c, n, f);
  }
  var h = w(3), m = w(4), y = [
    function() {
      return 0;
    },
    function() {
      return 0;
    },
    function(d, R) {
      return R[0] - d[0];
    },
    function(d, R, L) {
      var F = (d[1] - L[1]) * (R[0] - L[0]), l = (d[0] - L[0]) * (R[1] - L[1]), S = F - l, O;
      if (F > 0) {
        if (l <= 0)
          return S;
        O = F + l;
      } else if (F < 0) {
        if (l >= 0)
          return S;
        O = -(F + l);
      } else
        return S;
      var j = i * O;
      return S >= j || S <= -j ? S : h(d, R, L);
    },
    function(d, R, L, F) {
      var l = d[0] - F[0], S = R[0] - F[0], O = L[0] - F[0], j = d[1] - F[1], Y = R[1] - F[1], W = L[1] - F[1], er = d[2] - F[2], mr = R[2] - F[2], yr = L[2] - F[2], or = S * W, V = O * Y, _ = O * j, I = l * W, $ = l * Y, rr = S * j, ir = er * (or - V) + mr * (_ - I) + yr * ($ - rr), hr = (Math.abs(or) + Math.abs(V)) * Math.abs(er) + (Math.abs(_) + Math.abs(I)) * Math.abs(mr) + (Math.abs($) + Math.abs(rr)) * Math.abs(yr), b = s * hr;
      return ir > b || -ir > b ? ir : m(d, R, L, F);
    }
  ];
  function P(g) {
    var d = y[g.length];
    return d || (d = y[g.length] = w(g.length)), d.apply(void 0, g);
  }
  function E(g, d, R, L, F, l, S) {
    return function(j, Y, W, er, mr) {
      switch (arguments.length) {
        case 0:
        case 1:
          return 0;
        case 2:
          return L(j, Y);
        case 3:
          return F(j, Y, W);
        case 4:
          return l(j, Y, W, er);
        case 5:
          return S(j, Y, W, er, mr);
      }
      for (var yr = new Array(arguments.length), or = 0; or < arguments.length; ++or)
        yr[or] = arguments[or];
      return g(yr);
    };
  }
  function z() {
    for (; y.length <= a; )
      y.push(w(y.length));
    D.exports = E.apply(void 0, [P].concat(y));
    for (var g = 0; g <= a; ++g)
      D.exports[g] = y[g];
  }
  z();
})(orientation);
var orientationExports = orientation.exports;
orientationExports[3];
var REVERSE_TABLE = new Array(256);
(function(D) {
  for (var c = 0; c < 256; ++c) {
    var t = c, n = c, f = 7;
    for (t >>>= 1; t; t >>>= 1)
      n <<= 1, n |= t & 1, --f;
    D[c] = n << f & 255;
  }
})(REVERSE_TABLE);
function UnionFind$1(D) {
  this.roots = new Array(D), this.ranks = new Array(D);
  for (var c = 0; c < D; ++c)
    this.roots[c] = c, this.ranks[c] = 0;
}
var proto$1 = UnionFind$1.prototype;
Object.defineProperty(proto$1, "length", {
  get: function() {
    return this.roots.length;
  }
});
proto$1.makeSet = function() {
  var D = this.roots.length;
  return this.roots.push(D), this.ranks.push(0), D;
};
proto$1.find = function(D) {
  for (var c = D, t = this.roots; t[D] !== D; )
    D = t[D];
  for (; t[c] !== D; ) {
    var n = t[c];
    t[c] = D, c = n;
  }
  return D;
};
proto$1.link = function(D, c) {
  var t = this.find(D), n = this.find(c);
  if (t !== n) {
    var f = this.ranks, a = this.roots, r = f[t], i = f[n];
    r < i ? a[t] = n : i < r ? a[n] = t : (a[n] = t, ++f[t]);
  }
};
function computeEncodingCoefficients(D, c, t) {
  const n = getAmbisonicChannelCount(t), f = degreesToRadians(D), a = degreesToRadians(c), r = computeRealSH_1(t, [[f, a]]), i = new Float32Array(n);
  for (let s = 0; s < n; s++)
    i[s] = r[s][0];
  return i;
}
function encodeBuffer(D, c, t, n) {
  const f = getAmbisonicChannelCount(n), a = D.length, r = computeEncodingCoefficients(c, t, n), i = new Array(f);
  for (let s = 0; s < f; s++) {
    i[s] = new Float32Array(a);
    const u = r[s];
    for (let o = 0; o < a; o++)
      i[s][o] = D[o] * u;
  }
  return i;
}
function encodeBufferFromDirection(D, c, t, n, f, a = "ambisonics") {
  let r = c, i = t, s = n;
  a === "threejs" && (r = n, i = -c, s = t);
  const [[u, o]] = convertCart2Sph_1([[r, i, s]], 1), v = u * 180 / Math.PI, w = o * 180 / Math.PI;
  return encodeBuffer(D, v, w, f);
}
if (commonjsGlobal.AnalyserNode && !commonjsGlobal.AnalyserNode.prototype.getFloatTimeDomainData) {
  var uint8 = new Uint8Array(2048);
  commonjsGlobal.AnalyserNode.prototype.getFloatTimeDomainData = function(D) {
    this.getByteTimeDomainData(uint8);
    for (var c = 0, t = D.length; c < t; c++)
      D[c] = (uint8[c] - 128) * 78125e-7;
  };
}
function commonjsRequire(D) {
  throw new Error('Could not dynamically require "' + D + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var serveSofaHrir = { exports: {} };
(function(D, c) {
  (function(t) {
    D.exports = t();
  })(function() {
    return (function t(n, f, a) {
      function r(u, o) {
        if (!f[u]) {
          if (!n[u]) {
            var v = typeof commonjsRequire == "function" && commonjsRequire;
            if (!o && v) return v(u, !0);
            if (i) return i(u, !0);
            var w = new Error("Cannot find module '" + u + "'");
            throw w.code = "MODULE_NOT_FOUND", w;
          }
          var h = f[u] = { exports: {} };
          n[u][0].call(h.exports, function(m) {
            var y = n[u][1][m];
            return r(y || m);
          }, h, h.exports, t, n, f, a);
        }
        return f[u].exports;
      }
      for (var i = typeof commonjsRequire == "function" && commonjsRequire, s = 0; s < a.length; s++) r(a[s]);
      return r;
    })({ 1: [function(t, n, f) {
      n.exports = { default: t("core-js/library/fn/object/define-property"), __esModule: !0 };
    }, { "core-js/library/fn/object/define-property": 4 }], 2: [function(t, n, f) {
      f.default = function(a, r) {
        if (!(a instanceof r))
          throw new TypeError("Cannot call a class as a function");
      }, f.__esModule = !0;
    }, {}], 3: [function(t, n, f) {
      var a = t("babel-runtime/core-js/object/define-property").default;
      f.default = /* @__PURE__ */ (function() {
        function r(i, s) {
          for (var u = 0; u < s.length; u++) {
            var o = s[u];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), a(i, o.key, o);
          }
        }
        return function(i, s, u) {
          return s && r(i.prototype, s), u && r(i, u), i;
        };
      })(), f.__esModule = !0;
    }, { "babel-runtime/core-js/object/define-property": 1 }], 4: [function(t, n, f) {
      var a = t("../../modules/$");
      n.exports = function(i, s, u) {
        return a.setDesc(i, s, u);
      };
    }, { "../../modules/$": 5 }], 5: [function(t, n, f) {
      var a = Object;
      n.exports = {
        create: a.create,
        getProto: a.getPrototypeOf,
        isEnum: {}.propertyIsEnumerable,
        getDesc: a.getOwnPropertyDescriptor,
        setDesc: a.defineProperty,
        setDescs: a.defineProperties,
        getKeys: a.keys,
        getNames: a.getOwnPropertyNames,
        getSymbols: a.getOwnPropertySymbols,
        each: [].forEach
      };
    }, {}], 6: [function(t, n, f) {
      var a = t("babel-runtime/helpers/create-class").default, r = t("babel-runtime/helpers/class-call-check").default;
      Object.defineProperty(f, "__esModule", {
        value: !0
      });
      var i = (function() {
        function s(u, o) {
          r(this, s), this.delayTime = 0, this.posRead = 0, this.posWrite = 0, this.fracXi1 = 0, this.fracYi1 = 0, this.intDelay = 0, this.fracDelay = 0, this.a1 = void 0, this.sampleRate = u, this.maxDelayTime = o || 1, this.bufferSize = this.maxDelayTime * this.sampleRate, this.bufferSize % 1 !== 0 && (this.bufferSize = parseInt(this.bufferSize) + 1), this.buffer = new Float32Array(this.bufferSize);
        }
        return a(s, [{
          key: "setDelay",
          value: function(o) {
            if (o < this.maxDelayTime) {
              this.delayTime = o;
              var v = o * this.sampleRate;
              this.intDelay = parseInt(v), this.fracDelay = v - this.intDelay, this.resample(), this.fracDelay !== 0 && this.updateThiranCoefficient();
            } else
              throw new Error("delayTime > maxDelayTime");
          }
          /**
           * Update delay value
           * @public
           */
        }, {
          key: "getDelay",
          value: function() {
            return this.delayTime;
          }
          /**
           * Process method, where the output is calculated.
           * @param inputBuffer Input Array
           * @public
           */
        }, {
          key: "process",
          value: function(o) {
            for (var v = new Float32Array(o.length), w = 0; w < o.length; w = w + 1)
              this.buffer[this.posWrite] = o[w], v[w] = this.buffer[this.posRead], this.updatePointers();
            return this.fracDelay === 0 || (v = new Float32Array(this.fractionalThiranProcess(v))), v;
          }
          /**
           * Update the value of posRead and posWrite pointers inside the circular buffer
           * @private
           */
        }, {
          key: "updatePointers",
          value: function() {
            this.posWrite === this.buffer.length - 1 ? this.posWrite = 0 : this.posWrite = this.posWrite + 1, this.posRead === this.buffer.length - 1 ? this.posRead = 0 : this.posRead = this.posRead + 1;
          }
          /**
           * Update Thiran coefficient (1st order Thiran)
           * @private
           */
        }, {
          key: "updateThiranCoefficient",
          value: function() {
            this.a1 = (1 - this.fracDelay) / (1 + this.fracDelay);
          }
          /**
           * Update the pointer posRead value when the delay value is changed
           * @private
           */
        }, {
          key: "resample",
          value: function() {
            if (this.posWrite - this.intDelay < 0) {
              var o = this.intDelay - this.posWrite;
              this.posRead = this.buffer.length - o;
            } else
              this.posRead = this.posWrite - this.intDelay;
          }
          /**
           * Fractional process method.
           * @private
           * @param inputBuffer Input Array
           */
        }, {
          key: "fractionalThiranProcess",
          value: function(o) {
            for (var v = new Float32Array(o.length), w, h, m = this.fracXi1, y = this.fracYi1, P = 0; P < o.length; P = P + 1)
              w = o[P], h = this.a1 * w + m - this.a1 * y, m = w, y = h, v[P] = h;
            return this.fracXi1 = m, this.fracYi1 = y, v;
          }
        }]), s;
      })();
      f.default = i, n.exports = f.default;
    }, { "babel-runtime/helpers/class-call-check": 2, "babel-runtime/helpers/create-class": 3 }], 7: [function(t, n, f) {
      n.exports = t("./dist/fractional-delay");
    }, { "./dist/fractional-delay": 6 }], 8: [function(t, n, f) {
      (function(r, i) {
        if (typeof f == "object" && typeof n == "object")
          n.exports = i();
        else {
          var s = i();
          for (var u in s) (typeof f == "object" ? f : r)[u] = s[u];
        }
      })(this, function() {
        return (
          /******/
          (function(a) {
            var r = {};
            function i(s) {
              if (r[s])
                return r[s].exports;
              var u = r[s] = {
                /******/
                i: s,
                /******/
                l: !1,
                /******/
                exports: {}
                /******/
              };
              return a[s].call(u.exports, u, u.exports, i), u.l = !0, u.exports;
            }
            return i.m = a, i.c = r, i.d = function(s, u, o) {
              i.o(s, u) || Object.defineProperty(s, u, {
                /******/
                configurable: !1,
                /******/
                enumerable: !0,
                /******/
                get: o
                /******/
              });
            }, i.n = function(s) {
              var u = s && s.__esModule ? (
                /******/
                (function() {
                  return s.default;
                })
              ) : (
                /******/
                (function() {
                  return s;
                })
              );
              return i.d(u, "a", u), u;
            }, i.o = function(s, u) {
              return Object.prototype.hasOwnProperty.call(s, u);
            }, i.p = "", i(i.s = 4);
          })([
            /* 0 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.setMatrixArrayType = u, r.toRadian = v, r.equals = w;
              var s = r.EPSILON = 1e-6;
              r.ARRAY_TYPE = typeof Float32Array < "u" ? Float32Array : Array, r.RANDOM = Math.random;
              function u(h) {
                r.ARRAY_TYPE = h;
              }
              var o = Math.PI / 180;
              function v(h) {
                return h * o;
              }
              function w(h, m) {
                return Math.abs(h - m) <= s * Math.max(1, Math.abs(h), Math.abs(m));
              }
            },
            /* 1 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = v, r.fromMat4 = w, r.clone = h, r.copy = m, r.fromValues = y, r.set = P, r.identity = E, r.transpose = z, r.invert = g, r.adjoint = d, r.determinant = R, r.multiply = L, r.translate = F, r.rotate = l, r.scale = S, r.fromTranslation = O, r.fromRotation = j, r.fromScaling = Y, r.fromMat2d = W, r.fromQuat = er, r.normalFromMat4 = mr, r.projection = yr, r.str = or, r.frob = V, r.add = _, r.subtract = I, r.multiplyScalar = $, r.multiplyScalarAndAdd = rr, r.exactEquals = ir, r.equals = hr;
              var s = i(0), u = o(s);
              function o(b) {
                if (b && b.__esModule)
                  return b;
                var p = {};
                if (b != null)
                  for (var q in b)
                    Object.prototype.hasOwnProperty.call(b, q) && (p[q] = b[q]);
                return p.default = b, p;
              }
              function v() {
                var b = new u.ARRAY_TYPE(9);
                return b[0] = 1, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 1, b[5] = 0, b[6] = 0, b[7] = 0, b[8] = 1, b;
              }
              function w(b, p) {
                return b[0] = p[0], b[1] = p[1], b[2] = p[2], b[3] = p[4], b[4] = p[5], b[5] = p[6], b[6] = p[8], b[7] = p[9], b[8] = p[10], b;
              }
              function h(b) {
                var p = new u.ARRAY_TYPE(9);
                return p[0] = b[0], p[1] = b[1], p[2] = b[2], p[3] = b[3], p[4] = b[4], p[5] = b[5], p[6] = b[6], p[7] = b[7], p[8] = b[8], p;
              }
              function m(b, p) {
                return b[0] = p[0], b[1] = p[1], b[2] = p[2], b[3] = p[3], b[4] = p[4], b[5] = p[5], b[6] = p[6], b[7] = p[7], b[8] = p[8], b;
              }
              function y(b, p, q, Z, U, Q, x, fr, vr) {
                var N = new u.ARRAY_TYPE(9);
                return N[0] = b, N[1] = p, N[2] = q, N[3] = Z, N[4] = U, N[5] = Q, N[6] = x, N[7] = fr, N[8] = vr, N;
              }
              function P(b, p, q, Z, U, Q, x, fr, vr, N) {
                return b[0] = p, b[1] = q, b[2] = Z, b[3] = U, b[4] = Q, b[5] = x, b[6] = fr, b[7] = vr, b[8] = N, b;
              }
              function E(b) {
                return b[0] = 1, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 1, b[5] = 0, b[6] = 0, b[7] = 0, b[8] = 1, b;
              }
              function z(b, p) {
                if (b === p) {
                  var q = p[1], Z = p[2], U = p[5];
                  b[1] = p[3], b[2] = p[6], b[3] = q, b[5] = p[7], b[6] = Z, b[7] = U;
                } else
                  b[0] = p[0], b[1] = p[3], b[2] = p[6], b[3] = p[1], b[4] = p[4], b[5] = p[7], b[6] = p[2], b[7] = p[5], b[8] = p[8];
                return b;
              }
              function g(b, p) {
                var q = p[0], Z = p[1], U = p[2], Q = p[3], x = p[4], fr = p[5], vr = p[6], N = p[7], H = p[8], J = H * x - fr * N, ar = -H * Q + fr * vr, cr = N * Q - x * vr, e = q * J + Z * ar + U * cr;
                return e ? (e = 1 / e, b[0] = J * e, b[1] = (-H * Z + U * N) * e, b[2] = (fr * Z - U * x) * e, b[3] = ar * e, b[4] = (H * q - U * vr) * e, b[5] = (-fr * q + U * Q) * e, b[6] = cr * e, b[7] = (-N * q + Z * vr) * e, b[8] = (x * q - Z * Q) * e, b) : null;
              }
              function d(b, p) {
                var q = p[0], Z = p[1], U = p[2], Q = p[3], x = p[4], fr = p[5], vr = p[6], N = p[7], H = p[8];
                return b[0] = x * H - fr * N, b[1] = U * N - Z * H, b[2] = Z * fr - U * x, b[3] = fr * vr - Q * H, b[4] = q * H - U * vr, b[5] = U * Q - q * fr, b[6] = Q * N - x * vr, b[7] = Z * vr - q * N, b[8] = q * x - Z * Q, b;
              }
              function R(b) {
                var p = b[0], q = b[1], Z = b[2], U = b[3], Q = b[4], x = b[5], fr = b[6], vr = b[7], N = b[8];
                return p * (N * Q - x * vr) + q * (-N * U + x * fr) + Z * (vr * U - Q * fr);
              }
              function L(b, p, q) {
                var Z = p[0], U = p[1], Q = p[2], x = p[3], fr = p[4], vr = p[5], N = p[6], H = p[7], J = p[8], ar = q[0], cr = q[1], e = q[2], M = q[3], X = q[4], G = q[5], K = q[6], nr = q[7], tr = q[8];
                return b[0] = ar * Z + cr * x + e * N, b[1] = ar * U + cr * fr + e * H, b[2] = ar * Q + cr * vr + e * J, b[3] = M * Z + X * x + G * N, b[4] = M * U + X * fr + G * H, b[5] = M * Q + X * vr + G * J, b[6] = K * Z + nr * x + tr * N, b[7] = K * U + nr * fr + tr * H, b[8] = K * Q + nr * vr + tr * J, b;
              }
              function F(b, p, q) {
                var Z = p[0], U = p[1], Q = p[2], x = p[3], fr = p[4], vr = p[5], N = p[6], H = p[7], J = p[8], ar = q[0], cr = q[1];
                return b[0] = Z, b[1] = U, b[2] = Q, b[3] = x, b[4] = fr, b[5] = vr, b[6] = ar * Z + cr * x + N, b[7] = ar * U + cr * fr + H, b[8] = ar * Q + cr * vr + J, b;
              }
              function l(b, p, q) {
                var Z = p[0], U = p[1], Q = p[2], x = p[3], fr = p[4], vr = p[5], N = p[6], H = p[7], J = p[8], ar = Math.sin(q), cr = Math.cos(q);
                return b[0] = cr * Z + ar * x, b[1] = cr * U + ar * fr, b[2] = cr * Q + ar * vr, b[3] = cr * x - ar * Z, b[4] = cr * fr - ar * U, b[5] = cr * vr - ar * Q, b[6] = N, b[7] = H, b[8] = J, b;
              }
              function S(b, p, q) {
                var Z = q[0], U = q[1];
                return b[0] = Z * p[0], b[1] = Z * p[1], b[2] = Z * p[2], b[3] = U * p[3], b[4] = U * p[4], b[5] = U * p[5], b[6] = p[6], b[7] = p[7], b[8] = p[8], b;
              }
              function O(b, p) {
                return b[0] = 1, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 1, b[5] = 0, b[6] = p[0], b[7] = p[1], b[8] = 1, b;
              }
              function j(b, p) {
                var q = Math.sin(p), Z = Math.cos(p);
                return b[0] = Z, b[1] = q, b[2] = 0, b[3] = -q, b[4] = Z, b[5] = 0, b[6] = 0, b[7] = 0, b[8] = 1, b;
              }
              function Y(b, p) {
                return b[0] = p[0], b[1] = 0, b[2] = 0, b[3] = 0, b[4] = p[1], b[5] = 0, b[6] = 0, b[7] = 0, b[8] = 1, b;
              }
              function W(b, p) {
                return b[0] = p[0], b[1] = p[1], b[2] = 0, b[3] = p[2], b[4] = p[3], b[5] = 0, b[6] = p[4], b[7] = p[5], b[8] = 1, b;
              }
              function er(b, p) {
                var q = p[0], Z = p[1], U = p[2], Q = p[3], x = q + q, fr = Z + Z, vr = U + U, N = q * x, H = Z * x, J = Z * fr, ar = U * x, cr = U * fr, e = U * vr, M = Q * x, X = Q * fr, G = Q * vr;
                return b[0] = 1 - J - e, b[3] = H - G, b[6] = ar + X, b[1] = H + G, b[4] = 1 - N - e, b[7] = cr - M, b[2] = ar - X, b[5] = cr + M, b[8] = 1 - N - J, b;
              }
              function mr(b, p) {
                var q = p[0], Z = p[1], U = p[2], Q = p[3], x = p[4], fr = p[5], vr = p[6], N = p[7], H = p[8], J = p[9], ar = p[10], cr = p[11], e = p[12], M = p[13], X = p[14], G = p[15], K = q * fr - Z * x, nr = q * vr - U * x, tr = q * N - Q * x, sr = Z * vr - U * fr, ur = Z * N - Q * fr, lr = U * N - Q * vr, gr = H * M - J * e, Mr = H * X - ar * e, pr = H * G - cr * e, wr = J * X - ar * M, _r = J * G - cr * M, Sr = ar * G - cr * X, dr = K * Sr - nr * _r + tr * wr + sr * pr - ur * Mr + lr * gr;
                return dr ? (dr = 1 / dr, b[0] = (fr * Sr - vr * _r + N * wr) * dr, b[1] = (vr * pr - x * Sr - N * Mr) * dr, b[2] = (x * _r - fr * pr + N * gr) * dr, b[3] = (U * _r - Z * Sr - Q * wr) * dr, b[4] = (q * Sr - U * pr + Q * Mr) * dr, b[5] = (Z * pr - q * _r - Q * gr) * dr, b[6] = (M * lr - X * ur + G * sr) * dr, b[7] = (X * tr - e * lr - G * nr) * dr, b[8] = (e * ur - M * tr + G * K) * dr, b) : null;
              }
              function yr(b, p, q) {
                return b[0] = 2 / p, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = -2 / q, b[5] = 0, b[6] = -1, b[7] = 1, b[8] = 1, b;
              }
              function or(b) {
                return "mat3(" + b[0] + ", " + b[1] + ", " + b[2] + ", " + b[3] + ", " + b[4] + ", " + b[5] + ", " + b[6] + ", " + b[7] + ", " + b[8] + ")";
              }
              function V(b) {
                return Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2) + Math.pow(b[2], 2) + Math.pow(b[3], 2) + Math.pow(b[4], 2) + Math.pow(b[5], 2) + Math.pow(b[6], 2) + Math.pow(b[7], 2) + Math.pow(b[8], 2));
              }
              function _(b, p, q) {
                return b[0] = p[0] + q[0], b[1] = p[1] + q[1], b[2] = p[2] + q[2], b[3] = p[3] + q[3], b[4] = p[4] + q[4], b[5] = p[5] + q[5], b[6] = p[6] + q[6], b[7] = p[7] + q[7], b[8] = p[8] + q[8], b;
              }
              function I(b, p, q) {
                return b[0] = p[0] - q[0], b[1] = p[1] - q[1], b[2] = p[2] - q[2], b[3] = p[3] - q[3], b[4] = p[4] - q[4], b[5] = p[5] - q[5], b[6] = p[6] - q[6], b[7] = p[7] - q[7], b[8] = p[8] - q[8], b;
              }
              function $(b, p, q) {
                return b[0] = p[0] * q, b[1] = p[1] * q, b[2] = p[2] * q, b[3] = p[3] * q, b[4] = p[4] * q, b[5] = p[5] * q, b[6] = p[6] * q, b[7] = p[7] * q, b[8] = p[8] * q, b;
              }
              function rr(b, p, q, Z) {
                return b[0] = p[0] + q[0] * Z, b[1] = p[1] + q[1] * Z, b[2] = p[2] + q[2] * Z, b[3] = p[3] + q[3] * Z, b[4] = p[4] + q[4] * Z, b[5] = p[5] + q[5] * Z, b[6] = p[6] + q[6] * Z, b[7] = p[7] + q[7] * Z, b[8] = p[8] + q[8] * Z, b;
              }
              function ir(b, p) {
                return b[0] === p[0] && b[1] === p[1] && b[2] === p[2] && b[3] === p[3] && b[4] === p[4] && b[5] === p[5] && b[6] === p[6] && b[7] === p[7] && b[8] === p[8];
              }
              function hr(b, p) {
                var q = b[0], Z = b[1], U = b[2], Q = b[3], x = b[4], fr = b[5], vr = b[6], N = b[7], H = b[8], J = p[0], ar = p[1], cr = p[2], e = p[3], M = p[4], X = p[5], G = p[6], K = p[7], nr = p[8];
                return Math.abs(q - J) <= u.EPSILON * Math.max(1, Math.abs(q), Math.abs(J)) && Math.abs(Z - ar) <= u.EPSILON * Math.max(1, Math.abs(Z), Math.abs(ar)) && Math.abs(U - cr) <= u.EPSILON * Math.max(1, Math.abs(U), Math.abs(cr)) && Math.abs(Q - e) <= u.EPSILON * Math.max(1, Math.abs(Q), Math.abs(e)) && Math.abs(x - M) <= u.EPSILON * Math.max(1, Math.abs(x), Math.abs(M)) && Math.abs(fr - X) <= u.EPSILON * Math.max(1, Math.abs(fr), Math.abs(X)) && Math.abs(vr - G) <= u.EPSILON * Math.max(1, Math.abs(vr), Math.abs(G)) && Math.abs(N - K) <= u.EPSILON * Math.max(1, Math.abs(N), Math.abs(K)) && Math.abs(H - nr) <= u.EPSILON * Math.max(1, Math.abs(H), Math.abs(nr));
              }
              r.mul = L, r.sub = I;
            },
            /* 2 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.forEach = r.sqrLen = r.len = r.sqrDist = r.dist = r.div = r.mul = r.sub = void 0, r.create = v, r.clone = w, r.length = h, r.fromValues = m, r.copy = y, r.set = P, r.add = E, r.subtract = z, r.multiply = g, r.divide = d, r.ceil = R, r.floor = L, r.min = F, r.max = l, r.round = S, r.scale = O, r.scaleAndAdd = j, r.distance = Y, r.squaredDistance = W, r.squaredLength = er, r.negate = mr, r.inverse = yr, r.normalize = or, r.dot = V, r.cross = _, r.lerp = I, r.hermite = $, r.bezier = rr, r.random = ir, r.transformMat4 = hr, r.transformMat3 = b, r.transformQuat = p, r.rotateX = q, r.rotateY = Z, r.rotateZ = U, r.angle = Q, r.str = x, r.exactEquals = fr, r.equals = vr;
              var s = i(0), u = o(s);
              function o(N) {
                if (N && N.__esModule)
                  return N;
                var H = {};
                if (N != null)
                  for (var J in N)
                    Object.prototype.hasOwnProperty.call(N, J) && (H[J] = N[J]);
                return H.default = N, H;
              }
              function v() {
                var N = new u.ARRAY_TYPE(3);
                return N[0] = 0, N[1] = 0, N[2] = 0, N;
              }
              function w(N) {
                var H = new u.ARRAY_TYPE(3);
                return H[0] = N[0], H[1] = N[1], H[2] = N[2], H;
              }
              function h(N) {
                var H = N[0], J = N[1], ar = N[2];
                return Math.sqrt(H * H + J * J + ar * ar);
              }
              function m(N, H, J) {
                var ar = new u.ARRAY_TYPE(3);
                return ar[0] = N, ar[1] = H, ar[2] = J, ar;
              }
              function y(N, H) {
                return N[0] = H[0], N[1] = H[1], N[2] = H[2], N;
              }
              function P(N, H, J, ar) {
                return N[0] = H, N[1] = J, N[2] = ar, N;
              }
              function E(N, H, J) {
                return N[0] = H[0] + J[0], N[1] = H[1] + J[1], N[2] = H[2] + J[2], N;
              }
              function z(N, H, J) {
                return N[0] = H[0] - J[0], N[1] = H[1] - J[1], N[2] = H[2] - J[2], N;
              }
              function g(N, H, J) {
                return N[0] = H[0] * J[0], N[1] = H[1] * J[1], N[2] = H[2] * J[2], N;
              }
              function d(N, H, J) {
                return N[0] = H[0] / J[0], N[1] = H[1] / J[1], N[2] = H[2] / J[2], N;
              }
              function R(N, H) {
                return N[0] = Math.ceil(H[0]), N[1] = Math.ceil(H[1]), N[2] = Math.ceil(H[2]), N;
              }
              function L(N, H) {
                return N[0] = Math.floor(H[0]), N[1] = Math.floor(H[1]), N[2] = Math.floor(H[2]), N;
              }
              function F(N, H, J) {
                return N[0] = Math.min(H[0], J[0]), N[1] = Math.min(H[1], J[1]), N[2] = Math.min(H[2], J[2]), N;
              }
              function l(N, H, J) {
                return N[0] = Math.max(H[0], J[0]), N[1] = Math.max(H[1], J[1]), N[2] = Math.max(H[2], J[2]), N;
              }
              function S(N, H) {
                return N[0] = Math.round(H[0]), N[1] = Math.round(H[1]), N[2] = Math.round(H[2]), N;
              }
              function O(N, H, J) {
                return N[0] = H[0] * J, N[1] = H[1] * J, N[2] = H[2] * J, N;
              }
              function j(N, H, J, ar) {
                return N[0] = H[0] + J[0] * ar, N[1] = H[1] + J[1] * ar, N[2] = H[2] + J[2] * ar, N;
              }
              function Y(N, H) {
                var J = H[0] - N[0], ar = H[1] - N[1], cr = H[2] - N[2];
                return Math.sqrt(J * J + ar * ar + cr * cr);
              }
              function W(N, H) {
                var J = H[0] - N[0], ar = H[1] - N[1], cr = H[2] - N[2];
                return J * J + ar * ar + cr * cr;
              }
              function er(N) {
                var H = N[0], J = N[1], ar = N[2];
                return H * H + J * J + ar * ar;
              }
              function mr(N, H) {
                return N[0] = -H[0], N[1] = -H[1], N[2] = -H[2], N;
              }
              function yr(N, H) {
                return N[0] = 1 / H[0], N[1] = 1 / H[1], N[2] = 1 / H[2], N;
              }
              function or(N, H) {
                var J = H[0], ar = H[1], cr = H[2], e = J * J + ar * ar + cr * cr;
                return e > 0 && (e = 1 / Math.sqrt(e), N[0] = H[0] * e, N[1] = H[1] * e, N[2] = H[2] * e), N;
              }
              function V(N, H) {
                return N[0] * H[0] + N[1] * H[1] + N[2] * H[2];
              }
              function _(N, H, J) {
                var ar = H[0], cr = H[1], e = H[2], M = J[0], X = J[1], G = J[2];
                return N[0] = cr * G - e * X, N[1] = e * M - ar * G, N[2] = ar * X - cr * M, N;
              }
              function I(N, H, J, ar) {
                var cr = H[0], e = H[1], M = H[2];
                return N[0] = cr + ar * (J[0] - cr), N[1] = e + ar * (J[1] - e), N[2] = M + ar * (J[2] - M), N;
              }
              function $(N, H, J, ar, cr, e) {
                var M = e * e, X = M * (2 * e - 3) + 1, G = M * (e - 2) + e, K = M * (e - 1), nr = M * (3 - 2 * e);
                return N[0] = H[0] * X + J[0] * G + ar[0] * K + cr[0] * nr, N[1] = H[1] * X + J[1] * G + ar[1] * K + cr[1] * nr, N[2] = H[2] * X + J[2] * G + ar[2] * K + cr[2] * nr, N;
              }
              function rr(N, H, J, ar, cr, e) {
                var M = 1 - e, X = M * M, G = e * e, K = X * M, nr = 3 * e * X, tr = 3 * G * M, sr = G * e;
                return N[0] = H[0] * K + J[0] * nr + ar[0] * tr + cr[0] * sr, N[1] = H[1] * K + J[1] * nr + ar[1] * tr + cr[1] * sr, N[2] = H[2] * K + J[2] * nr + ar[2] * tr + cr[2] * sr, N;
              }
              function ir(N, H) {
                H = H || 1;
                var J = u.RANDOM() * 2 * Math.PI, ar = u.RANDOM() * 2 - 1, cr = Math.sqrt(1 - ar * ar) * H;
                return N[0] = Math.cos(J) * cr, N[1] = Math.sin(J) * cr, N[2] = ar * H, N;
              }
              function hr(N, H, J) {
                var ar = H[0], cr = H[1], e = H[2], M = J[3] * ar + J[7] * cr + J[11] * e + J[15];
                return M = M || 1, N[0] = (J[0] * ar + J[4] * cr + J[8] * e + J[12]) / M, N[1] = (J[1] * ar + J[5] * cr + J[9] * e + J[13]) / M, N[2] = (J[2] * ar + J[6] * cr + J[10] * e + J[14]) / M, N;
              }
              function b(N, H, J) {
                var ar = H[0], cr = H[1], e = H[2];
                return N[0] = ar * J[0] + cr * J[3] + e * J[6], N[1] = ar * J[1] + cr * J[4] + e * J[7], N[2] = ar * J[2] + cr * J[5] + e * J[8], N;
              }
              function p(N, H, J) {
                var ar = H[0], cr = H[1], e = H[2], M = J[0], X = J[1], G = J[2], K = J[3], nr = K * ar + X * e - G * cr, tr = K * cr + G * ar - M * e, sr = K * e + M * cr - X * ar, ur = -M * ar - X * cr - G * e;
                return N[0] = nr * K + ur * -M + tr * -G - sr * -X, N[1] = tr * K + ur * -X + sr * -M - nr * -G, N[2] = sr * K + ur * -G + nr * -X - tr * -M, N;
              }
              function q(N, H, J, ar) {
                var cr = [], e = [];
                return cr[0] = H[0] - J[0], cr[1] = H[1] - J[1], cr[2] = H[2] - J[2], e[0] = cr[0], e[1] = cr[1] * Math.cos(ar) - cr[2] * Math.sin(ar), e[2] = cr[1] * Math.sin(ar) + cr[2] * Math.cos(ar), N[0] = e[0] + J[0], N[1] = e[1] + J[1], N[2] = e[2] + J[2], N;
              }
              function Z(N, H, J, ar) {
                var cr = [], e = [];
                return cr[0] = H[0] - J[0], cr[1] = H[1] - J[1], cr[2] = H[2] - J[2], e[0] = cr[2] * Math.sin(ar) + cr[0] * Math.cos(ar), e[1] = cr[1], e[2] = cr[2] * Math.cos(ar) - cr[0] * Math.sin(ar), N[0] = e[0] + J[0], N[1] = e[1] + J[1], N[2] = e[2] + J[2], N;
              }
              function U(N, H, J, ar) {
                var cr = [], e = [];
                return cr[0] = H[0] - J[0], cr[1] = H[1] - J[1], cr[2] = H[2] - J[2], e[0] = cr[0] * Math.cos(ar) - cr[1] * Math.sin(ar), e[1] = cr[0] * Math.sin(ar) + cr[1] * Math.cos(ar), e[2] = cr[2], N[0] = e[0] + J[0], N[1] = e[1] + J[1], N[2] = e[2] + J[2], N;
              }
              function Q(N, H) {
                var J = m(N[0], N[1], N[2]), ar = m(H[0], H[1], H[2]);
                or(J, J), or(ar, ar);
                var cr = V(J, ar);
                return cr > 1 ? 0 : cr < -1 ? Math.PI : Math.acos(cr);
              }
              function x(N) {
                return "vec3(" + N[0] + ", " + N[1] + ", " + N[2] + ")";
              }
              function fr(N, H) {
                return N[0] === H[0] && N[1] === H[1] && N[2] === H[2];
              }
              function vr(N, H) {
                var J = N[0], ar = N[1], cr = N[2], e = H[0], M = H[1], X = H[2];
                return Math.abs(J - e) <= u.EPSILON * Math.max(1, Math.abs(J), Math.abs(e)) && Math.abs(ar - M) <= u.EPSILON * Math.max(1, Math.abs(ar), Math.abs(M)) && Math.abs(cr - X) <= u.EPSILON * Math.max(1, Math.abs(cr), Math.abs(X));
              }
              r.sub = z, r.mul = g, r.div = d, r.dist = Y, r.sqrDist = W, r.len = h, r.sqrLen = er, r.forEach = (function() {
                var N = v();
                return function(H, J, ar, cr, e, M) {
                  var X = void 0, G = void 0;
                  for (J || (J = 3), ar || (ar = 0), cr ? G = Math.min(cr * J + ar, H.length) : G = H.length, X = ar; X < G; X += J)
                    N[0] = H[X], N[1] = H[X + 1], N[2] = H[X + 2], e(N, N, M), H[X] = N[0], H[X + 1] = N[1], H[X + 2] = N[2];
                  return H;
                };
              })();
            },
            /* 3 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.forEach = r.sqrLen = r.len = r.sqrDist = r.dist = r.div = r.mul = r.sub = void 0, r.create = v, r.clone = w, r.fromValues = h, r.copy = m, r.set = y, r.add = P, r.subtract = E, r.multiply = z, r.divide = g, r.ceil = d, r.floor = R, r.min = L, r.max = F, r.round = l, r.scale = S, r.scaleAndAdd = O, r.distance = j, r.squaredDistance = Y, r.length = W, r.squaredLength = er, r.negate = mr, r.inverse = yr, r.normalize = or, r.dot = V, r.lerp = _, r.random = I, r.transformMat4 = $, r.transformQuat = rr, r.str = ir, r.exactEquals = hr, r.equals = b;
              var s = i(0), u = o(s);
              function o(p) {
                if (p && p.__esModule)
                  return p;
                var q = {};
                if (p != null)
                  for (var Z in p)
                    Object.prototype.hasOwnProperty.call(p, Z) && (q[Z] = p[Z]);
                return q.default = p, q;
              }
              function v() {
                var p = new u.ARRAY_TYPE(4);
                return p[0] = 0, p[1] = 0, p[2] = 0, p[3] = 0, p;
              }
              function w(p) {
                var q = new u.ARRAY_TYPE(4);
                return q[0] = p[0], q[1] = p[1], q[2] = p[2], q[3] = p[3], q;
              }
              function h(p, q, Z, U) {
                var Q = new u.ARRAY_TYPE(4);
                return Q[0] = p, Q[1] = q, Q[2] = Z, Q[3] = U, Q;
              }
              function m(p, q) {
                return p[0] = q[0], p[1] = q[1], p[2] = q[2], p[3] = q[3], p;
              }
              function y(p, q, Z, U, Q) {
                return p[0] = q, p[1] = Z, p[2] = U, p[3] = Q, p;
              }
              function P(p, q, Z) {
                return p[0] = q[0] + Z[0], p[1] = q[1] + Z[1], p[2] = q[2] + Z[2], p[3] = q[3] + Z[3], p;
              }
              function E(p, q, Z) {
                return p[0] = q[0] - Z[0], p[1] = q[1] - Z[1], p[2] = q[2] - Z[2], p[3] = q[3] - Z[3], p;
              }
              function z(p, q, Z) {
                return p[0] = q[0] * Z[0], p[1] = q[1] * Z[1], p[2] = q[2] * Z[2], p[3] = q[3] * Z[3], p;
              }
              function g(p, q, Z) {
                return p[0] = q[0] / Z[0], p[1] = q[1] / Z[1], p[2] = q[2] / Z[2], p[3] = q[3] / Z[3], p;
              }
              function d(p, q) {
                return p[0] = Math.ceil(q[0]), p[1] = Math.ceil(q[1]), p[2] = Math.ceil(q[2]), p[3] = Math.ceil(q[3]), p;
              }
              function R(p, q) {
                return p[0] = Math.floor(q[0]), p[1] = Math.floor(q[1]), p[2] = Math.floor(q[2]), p[3] = Math.floor(q[3]), p;
              }
              function L(p, q, Z) {
                return p[0] = Math.min(q[0], Z[0]), p[1] = Math.min(q[1], Z[1]), p[2] = Math.min(q[2], Z[2]), p[3] = Math.min(q[3], Z[3]), p;
              }
              function F(p, q, Z) {
                return p[0] = Math.max(q[0], Z[0]), p[1] = Math.max(q[1], Z[1]), p[2] = Math.max(q[2], Z[2]), p[3] = Math.max(q[3], Z[3]), p;
              }
              function l(p, q) {
                return p[0] = Math.round(q[0]), p[1] = Math.round(q[1]), p[2] = Math.round(q[2]), p[3] = Math.round(q[3]), p;
              }
              function S(p, q, Z) {
                return p[0] = q[0] * Z, p[1] = q[1] * Z, p[2] = q[2] * Z, p[3] = q[3] * Z, p;
              }
              function O(p, q, Z, U) {
                return p[0] = q[0] + Z[0] * U, p[1] = q[1] + Z[1] * U, p[2] = q[2] + Z[2] * U, p[3] = q[3] + Z[3] * U, p;
              }
              function j(p, q) {
                var Z = q[0] - p[0], U = q[1] - p[1], Q = q[2] - p[2], x = q[3] - p[3];
                return Math.sqrt(Z * Z + U * U + Q * Q + x * x);
              }
              function Y(p, q) {
                var Z = q[0] - p[0], U = q[1] - p[1], Q = q[2] - p[2], x = q[3] - p[3];
                return Z * Z + U * U + Q * Q + x * x;
              }
              function W(p) {
                var q = p[0], Z = p[1], U = p[2], Q = p[3];
                return Math.sqrt(q * q + Z * Z + U * U + Q * Q);
              }
              function er(p) {
                var q = p[0], Z = p[1], U = p[2], Q = p[3];
                return q * q + Z * Z + U * U + Q * Q;
              }
              function mr(p, q) {
                return p[0] = -q[0], p[1] = -q[1], p[2] = -q[2], p[3] = -q[3], p;
              }
              function yr(p, q) {
                return p[0] = 1 / q[0], p[1] = 1 / q[1], p[2] = 1 / q[2], p[3] = 1 / q[3], p;
              }
              function or(p, q) {
                var Z = q[0], U = q[1], Q = q[2], x = q[3], fr = Z * Z + U * U + Q * Q + x * x;
                return fr > 0 && (fr = 1 / Math.sqrt(fr), p[0] = Z * fr, p[1] = U * fr, p[2] = Q * fr, p[3] = x * fr), p;
              }
              function V(p, q) {
                return p[0] * q[0] + p[1] * q[1] + p[2] * q[2] + p[3] * q[3];
              }
              function _(p, q, Z, U) {
                var Q = q[0], x = q[1], fr = q[2], vr = q[3];
                return p[0] = Q + U * (Z[0] - Q), p[1] = x + U * (Z[1] - x), p[2] = fr + U * (Z[2] - fr), p[3] = vr + U * (Z[3] - vr), p;
              }
              function I(p, q) {
                return q = q || 1, p[0] = u.RANDOM(), p[1] = u.RANDOM(), p[2] = u.RANDOM(), p[3] = u.RANDOM(), or(p, p), S(p, p, q), p;
              }
              function $(p, q, Z) {
                var U = q[0], Q = q[1], x = q[2], fr = q[3];
                return p[0] = Z[0] * U + Z[4] * Q + Z[8] * x + Z[12] * fr, p[1] = Z[1] * U + Z[5] * Q + Z[9] * x + Z[13] * fr, p[2] = Z[2] * U + Z[6] * Q + Z[10] * x + Z[14] * fr, p[3] = Z[3] * U + Z[7] * Q + Z[11] * x + Z[15] * fr, p;
              }
              function rr(p, q, Z) {
                var U = q[0], Q = q[1], x = q[2], fr = Z[0], vr = Z[1], N = Z[2], H = Z[3], J = H * U + vr * x - N * Q, ar = H * Q + N * U - fr * x, cr = H * x + fr * Q - vr * U, e = -fr * U - vr * Q - N * x;
                return p[0] = J * H + e * -fr + ar * -N - cr * -vr, p[1] = ar * H + e * -vr + cr * -fr - J * -N, p[2] = cr * H + e * -N + J * -vr - ar * -fr, p[3] = q[3], p;
              }
              function ir(p) {
                return "vec4(" + p[0] + ", " + p[1] + ", " + p[2] + ", " + p[3] + ")";
              }
              function hr(p, q) {
                return p[0] === q[0] && p[1] === q[1] && p[2] === q[2] && p[3] === q[3];
              }
              function b(p, q) {
                var Z = p[0], U = p[1], Q = p[2], x = p[3], fr = q[0], vr = q[1], N = q[2], H = q[3];
                return Math.abs(Z - fr) <= u.EPSILON * Math.max(1, Math.abs(Z), Math.abs(fr)) && Math.abs(U - vr) <= u.EPSILON * Math.max(1, Math.abs(U), Math.abs(vr)) && Math.abs(Q - N) <= u.EPSILON * Math.max(1, Math.abs(Q), Math.abs(N)) && Math.abs(x - H) <= u.EPSILON * Math.max(1, Math.abs(x), Math.abs(H));
              }
              r.sub = E, r.mul = z, r.div = g, r.dist = j, r.sqrDist = Y, r.len = W, r.sqrLen = er, r.forEach = (function() {
                var p = v();
                return function(q, Z, U, Q, x, fr) {
                  var vr = void 0, N = void 0;
                  for (Z || (Z = 4), U || (U = 0), Q ? N = Math.min(Q * Z + U, q.length) : N = q.length, vr = U; vr < N; vr += Z)
                    p[0] = q[vr], p[1] = q[vr + 1], p[2] = q[vr + 2], p[3] = q[vr + 3], x(p, p, fr), q[vr] = p[0], q[vr + 1] = p[1], q[vr + 2] = p[2], q[vr + 3] = p[3];
                  return q;
                };
              })();
            },
            /* 4 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.vec4 = r.vec3 = r.vec2 = r.quat = r.mat4 = r.mat3 = r.mat2d = r.mat2 = r.glMatrix = void 0;
              var s = i(0), u = O(s), o = i(5), v = O(o), w = i(6), h = O(w), m = i(1), y = O(m), P = i(7), E = O(P), z = i(8), g = O(z), d = i(9), R = O(d), L = i(2), F = O(L), l = i(3), S = O(l);
              function O(j) {
                if (j && j.__esModule)
                  return j;
                var Y = {};
                if (j != null)
                  for (var W in j)
                    Object.prototype.hasOwnProperty.call(j, W) && (Y[W] = j[W]);
                return Y.default = j, Y;
              }
              r.glMatrix = u, r.mat2 = v, r.mat2d = h, r.mat3 = y, r.mat4 = E, r.quat = g, r.vec2 = R, r.vec3 = F, r.vec4 = S;
            },
            /* 5 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = v, r.clone = w, r.copy = h, r.identity = m, r.fromValues = y, r.set = P, r.transpose = E, r.invert = z, r.adjoint = g, r.determinant = d, r.multiply = R, r.rotate = L, r.scale = F, r.fromRotation = l, r.fromScaling = S, r.str = O, r.frob = j, r.LDU = Y, r.add = W, r.subtract = er, r.exactEquals = mr, r.equals = yr, r.multiplyScalar = or, r.multiplyScalarAndAdd = V;
              var s = i(0), u = o(s);
              function o(_) {
                if (_ && _.__esModule)
                  return _;
                var I = {};
                if (_ != null)
                  for (var $ in _)
                    Object.prototype.hasOwnProperty.call(_, $) && (I[$] = _[$]);
                return I.default = _, I;
              }
              function v() {
                var _ = new u.ARRAY_TYPE(4);
                return _[0] = 1, _[1] = 0, _[2] = 0, _[3] = 1, _;
              }
              function w(_) {
                var I = new u.ARRAY_TYPE(4);
                return I[0] = _[0], I[1] = _[1], I[2] = _[2], I[3] = _[3], I;
              }
              function h(_, I) {
                return _[0] = I[0], _[1] = I[1], _[2] = I[2], _[3] = I[3], _;
              }
              function m(_) {
                return _[0] = 1, _[1] = 0, _[2] = 0, _[3] = 1, _;
              }
              function y(_, I, $, rr) {
                var ir = new u.ARRAY_TYPE(4);
                return ir[0] = _, ir[1] = I, ir[2] = $, ir[3] = rr, ir;
              }
              function P(_, I, $, rr, ir) {
                return _[0] = I, _[1] = $, _[2] = rr, _[3] = ir, _;
              }
              function E(_, I) {
                if (_ === I) {
                  var $ = I[1];
                  _[1] = I[2], _[2] = $;
                } else
                  _[0] = I[0], _[1] = I[2], _[2] = I[1], _[3] = I[3];
                return _;
              }
              function z(_, I) {
                var $ = I[0], rr = I[1], ir = I[2], hr = I[3], b = $ * hr - ir * rr;
                return b ? (b = 1 / b, _[0] = hr * b, _[1] = -rr * b, _[2] = -ir * b, _[3] = $ * b, _) : null;
              }
              function g(_, I) {
                var $ = I[0];
                return _[0] = I[3], _[1] = -I[1], _[2] = -I[2], _[3] = $, _;
              }
              function d(_) {
                return _[0] * _[3] - _[2] * _[1];
              }
              function R(_, I, $) {
                var rr = I[0], ir = I[1], hr = I[2], b = I[3], p = $[0], q = $[1], Z = $[2], U = $[3];
                return _[0] = rr * p + hr * q, _[1] = ir * p + b * q, _[2] = rr * Z + hr * U, _[3] = ir * Z + b * U, _;
              }
              function L(_, I, $) {
                var rr = I[0], ir = I[1], hr = I[2], b = I[3], p = Math.sin($), q = Math.cos($);
                return _[0] = rr * q + hr * p, _[1] = ir * q + b * p, _[2] = rr * -p + hr * q, _[3] = ir * -p + b * q, _;
              }
              function F(_, I, $) {
                var rr = I[0], ir = I[1], hr = I[2], b = I[3], p = $[0], q = $[1];
                return _[0] = rr * p, _[1] = ir * p, _[2] = hr * q, _[3] = b * q, _;
              }
              function l(_, I) {
                var $ = Math.sin(I), rr = Math.cos(I);
                return _[0] = rr, _[1] = $, _[2] = -$, _[3] = rr, _;
              }
              function S(_, I) {
                return _[0] = I[0], _[1] = 0, _[2] = 0, _[3] = I[1], _;
              }
              function O(_) {
                return "mat2(" + _[0] + ", " + _[1] + ", " + _[2] + ", " + _[3] + ")";
              }
              function j(_) {
                return Math.sqrt(Math.pow(_[0], 2) + Math.pow(_[1], 2) + Math.pow(_[2], 2) + Math.pow(_[3], 2));
              }
              function Y(_, I, $, rr) {
                return _[2] = rr[2] / rr[0], $[0] = rr[0], $[1] = rr[1], $[3] = rr[3] - _[2] * $[1], [_, I, $];
              }
              function W(_, I, $) {
                return _[0] = I[0] + $[0], _[1] = I[1] + $[1], _[2] = I[2] + $[2], _[3] = I[3] + $[3], _;
              }
              function er(_, I, $) {
                return _[0] = I[0] - $[0], _[1] = I[1] - $[1], _[2] = I[2] - $[2], _[3] = I[3] - $[3], _;
              }
              function mr(_, I) {
                return _[0] === I[0] && _[1] === I[1] && _[2] === I[2] && _[3] === I[3];
              }
              function yr(_, I) {
                var $ = _[0], rr = _[1], ir = _[2], hr = _[3], b = I[0], p = I[1], q = I[2], Z = I[3];
                return Math.abs($ - b) <= u.EPSILON * Math.max(1, Math.abs($), Math.abs(b)) && Math.abs(rr - p) <= u.EPSILON * Math.max(1, Math.abs(rr), Math.abs(p)) && Math.abs(ir - q) <= u.EPSILON * Math.max(1, Math.abs(ir), Math.abs(q)) && Math.abs(hr - Z) <= u.EPSILON * Math.max(1, Math.abs(hr), Math.abs(Z));
              }
              function or(_, I, $) {
                return _[0] = I[0] * $, _[1] = I[1] * $, _[2] = I[2] * $, _[3] = I[3] * $, _;
              }
              function V(_, I, $, rr) {
                return _[0] = I[0] + $[0] * rr, _[1] = I[1] + $[1] * rr, _[2] = I[2] + $[2] * rr, _[3] = I[3] + $[3] * rr, _;
              }
              r.mul = R, r.sub = er;
            },
            /* 6 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = v, r.clone = w, r.copy = h, r.identity = m, r.fromValues = y, r.set = P, r.invert = E, r.determinant = z, r.multiply = g, r.rotate = d, r.scale = R, r.translate = L, r.fromRotation = F, r.fromScaling = l, r.fromTranslation = S, r.str = O, r.frob = j, r.add = Y, r.subtract = W, r.multiplyScalar = er, r.multiplyScalarAndAdd = mr, r.exactEquals = yr, r.equals = or;
              var s = i(0), u = o(s);
              function o(V) {
                if (V && V.__esModule)
                  return V;
                var _ = {};
                if (V != null)
                  for (var I in V)
                    Object.prototype.hasOwnProperty.call(V, I) && (_[I] = V[I]);
                return _.default = V, _;
              }
              function v() {
                var V = new u.ARRAY_TYPE(6);
                return V[0] = 1, V[1] = 0, V[2] = 0, V[3] = 1, V[4] = 0, V[5] = 0, V;
              }
              function w(V) {
                var _ = new u.ARRAY_TYPE(6);
                return _[0] = V[0], _[1] = V[1], _[2] = V[2], _[3] = V[3], _[4] = V[4], _[5] = V[5], _;
              }
              function h(V, _) {
                return V[0] = _[0], V[1] = _[1], V[2] = _[2], V[3] = _[3], V[4] = _[4], V[5] = _[5], V;
              }
              function m(V) {
                return V[0] = 1, V[1] = 0, V[2] = 0, V[3] = 1, V[4] = 0, V[5] = 0, V;
              }
              function y(V, _, I, $, rr, ir) {
                var hr = new u.ARRAY_TYPE(6);
                return hr[0] = V, hr[1] = _, hr[2] = I, hr[3] = $, hr[4] = rr, hr[5] = ir, hr;
              }
              function P(V, _, I, $, rr, ir, hr) {
                return V[0] = _, V[1] = I, V[2] = $, V[3] = rr, V[4] = ir, V[5] = hr, V;
              }
              function E(V, _) {
                var I = _[0], $ = _[1], rr = _[2], ir = _[3], hr = _[4], b = _[5], p = I * ir - $ * rr;
                return p ? (p = 1 / p, V[0] = ir * p, V[1] = -$ * p, V[2] = -rr * p, V[3] = I * p, V[4] = (rr * b - ir * hr) * p, V[5] = ($ * hr - I * b) * p, V) : null;
              }
              function z(V) {
                return V[0] * V[3] - V[1] * V[2];
              }
              function g(V, _, I) {
                var $ = _[0], rr = _[1], ir = _[2], hr = _[3], b = _[4], p = _[5], q = I[0], Z = I[1], U = I[2], Q = I[3], x = I[4], fr = I[5];
                return V[0] = $ * q + ir * Z, V[1] = rr * q + hr * Z, V[2] = $ * U + ir * Q, V[3] = rr * U + hr * Q, V[4] = $ * x + ir * fr + b, V[5] = rr * x + hr * fr + p, V;
              }
              function d(V, _, I) {
                var $ = _[0], rr = _[1], ir = _[2], hr = _[3], b = _[4], p = _[5], q = Math.sin(I), Z = Math.cos(I);
                return V[0] = $ * Z + ir * q, V[1] = rr * Z + hr * q, V[2] = $ * -q + ir * Z, V[3] = rr * -q + hr * Z, V[4] = b, V[5] = p, V;
              }
              function R(V, _, I) {
                var $ = _[0], rr = _[1], ir = _[2], hr = _[3], b = _[4], p = _[5], q = I[0], Z = I[1];
                return V[0] = $ * q, V[1] = rr * q, V[2] = ir * Z, V[3] = hr * Z, V[4] = b, V[5] = p, V;
              }
              function L(V, _, I) {
                var $ = _[0], rr = _[1], ir = _[2], hr = _[3], b = _[4], p = _[5], q = I[0], Z = I[1];
                return V[0] = $, V[1] = rr, V[2] = ir, V[3] = hr, V[4] = $ * q + ir * Z + b, V[5] = rr * q + hr * Z + p, V;
              }
              function F(V, _) {
                var I = Math.sin(_), $ = Math.cos(_);
                return V[0] = $, V[1] = I, V[2] = -I, V[3] = $, V[4] = 0, V[5] = 0, V;
              }
              function l(V, _) {
                return V[0] = _[0], V[1] = 0, V[2] = 0, V[3] = _[1], V[4] = 0, V[5] = 0, V;
              }
              function S(V, _) {
                return V[0] = 1, V[1] = 0, V[2] = 0, V[3] = 1, V[4] = _[0], V[5] = _[1], V;
              }
              function O(V) {
                return "mat2d(" + V[0] + ", " + V[1] + ", " + V[2] + ", " + V[3] + ", " + V[4] + ", " + V[5] + ")";
              }
              function j(V) {
                return Math.sqrt(Math.pow(V[0], 2) + Math.pow(V[1], 2) + Math.pow(V[2], 2) + Math.pow(V[3], 2) + Math.pow(V[4], 2) + Math.pow(V[5], 2) + 1);
              }
              function Y(V, _, I) {
                return V[0] = _[0] + I[0], V[1] = _[1] + I[1], V[2] = _[2] + I[2], V[3] = _[3] + I[3], V[4] = _[4] + I[4], V[5] = _[5] + I[5], V;
              }
              function W(V, _, I) {
                return V[0] = _[0] - I[0], V[1] = _[1] - I[1], V[2] = _[2] - I[2], V[3] = _[3] - I[3], V[4] = _[4] - I[4], V[5] = _[5] - I[5], V;
              }
              function er(V, _, I) {
                return V[0] = _[0] * I, V[1] = _[1] * I, V[2] = _[2] * I, V[3] = _[3] * I, V[4] = _[4] * I, V[5] = _[5] * I, V;
              }
              function mr(V, _, I, $) {
                return V[0] = _[0] + I[0] * $, V[1] = _[1] + I[1] * $, V[2] = _[2] + I[2] * $, V[3] = _[3] + I[3] * $, V[4] = _[4] + I[4] * $, V[5] = _[5] + I[5] * $, V;
              }
              function yr(V, _) {
                return V[0] === _[0] && V[1] === _[1] && V[2] === _[2] && V[3] === _[3] && V[4] === _[4] && V[5] === _[5];
              }
              function or(V, _) {
                var I = V[0], $ = V[1], rr = V[2], ir = V[3], hr = V[4], b = V[5], p = _[0], q = _[1], Z = _[2], U = _[3], Q = _[4], x = _[5];
                return Math.abs(I - p) <= u.EPSILON * Math.max(1, Math.abs(I), Math.abs(p)) && Math.abs($ - q) <= u.EPSILON * Math.max(1, Math.abs($), Math.abs(q)) && Math.abs(rr - Z) <= u.EPSILON * Math.max(1, Math.abs(rr), Math.abs(Z)) && Math.abs(ir - U) <= u.EPSILON * Math.max(1, Math.abs(ir), Math.abs(U)) && Math.abs(hr - Q) <= u.EPSILON * Math.max(1, Math.abs(hr), Math.abs(Q)) && Math.abs(b - x) <= u.EPSILON * Math.max(1, Math.abs(b), Math.abs(x));
              }
              r.mul = g, r.sub = W;
            },
            /* 7 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = v, r.clone = w, r.copy = h, r.fromValues = m, r.set = y, r.identity = P, r.transpose = E, r.invert = z, r.adjoint = g, r.determinant = d, r.multiply = R, r.translate = L, r.scale = F, r.rotate = l, r.rotateX = S, r.rotateY = O, r.rotateZ = j, r.fromTranslation = Y, r.fromScaling = W, r.fromRotation = er, r.fromXRotation = mr, r.fromYRotation = yr, r.fromZRotation = or, r.fromRotationTranslation = V, r.getTranslation = _, r.getScaling = I, r.getRotation = $, r.fromRotationTranslationScale = rr, r.fromRotationTranslationScaleOrigin = ir, r.fromQuat = hr, r.frustum = b, r.perspective = p, r.perspectiveFromFieldOfView = q, r.ortho = Z, r.lookAt = U, r.targetTo = Q, r.str = x, r.frob = fr, r.add = vr, r.subtract = N, r.multiplyScalar = H, r.multiplyScalarAndAdd = J, r.exactEquals = ar, r.equals = cr;
              var s = i(0), u = o(s);
              function o(e) {
                if (e && e.__esModule)
                  return e;
                var M = {};
                if (e != null)
                  for (var X in e)
                    Object.prototype.hasOwnProperty.call(e, X) && (M[X] = e[X]);
                return M.default = e, M;
              }
              function v() {
                var e = new u.ARRAY_TYPE(16);
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function w(e) {
                var M = new u.ARRAY_TYPE(16);
                return M[0] = e[0], M[1] = e[1], M[2] = e[2], M[3] = e[3], M[4] = e[4], M[5] = e[5], M[6] = e[6], M[7] = e[7], M[8] = e[8], M[9] = e[9], M[10] = e[10], M[11] = e[11], M[12] = e[12], M[13] = e[13], M[14] = e[14], M[15] = e[15], M;
              }
              function h(e, M) {
                return e[0] = M[0], e[1] = M[1], e[2] = M[2], e[3] = M[3], e[4] = M[4], e[5] = M[5], e[6] = M[6], e[7] = M[7], e[8] = M[8], e[9] = M[9], e[10] = M[10], e[11] = M[11], e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15], e;
              }
              function m(e, M, X, G, K, nr, tr, sr, ur, lr, gr, Mr, pr, wr, _r, Sr) {
                var dr = new u.ARRAY_TYPE(16);
                return dr[0] = e, dr[1] = M, dr[2] = X, dr[3] = G, dr[4] = K, dr[5] = nr, dr[6] = tr, dr[7] = sr, dr[8] = ur, dr[9] = lr, dr[10] = gr, dr[11] = Mr, dr[12] = pr, dr[13] = wr, dr[14] = _r, dr[15] = Sr, dr;
              }
              function y(e, M, X, G, K, nr, tr, sr, ur, lr, gr, Mr, pr, wr, _r, Sr, dr) {
                return e[0] = M, e[1] = X, e[2] = G, e[3] = K, e[4] = nr, e[5] = tr, e[6] = sr, e[7] = ur, e[8] = lr, e[9] = gr, e[10] = Mr, e[11] = pr, e[12] = wr, e[13] = _r, e[14] = Sr, e[15] = dr, e;
              }
              function P(e) {
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function E(e, M) {
                if (e === M) {
                  var X = M[1], G = M[2], K = M[3], nr = M[6], tr = M[7], sr = M[11];
                  e[1] = M[4], e[2] = M[8], e[3] = M[12], e[4] = X, e[6] = M[9], e[7] = M[13], e[8] = G, e[9] = nr, e[11] = M[14], e[12] = K, e[13] = tr, e[14] = sr;
                } else
                  e[0] = M[0], e[1] = M[4], e[2] = M[8], e[3] = M[12], e[4] = M[1], e[5] = M[5], e[6] = M[9], e[7] = M[13], e[8] = M[2], e[9] = M[6], e[10] = M[10], e[11] = M[14], e[12] = M[3], e[13] = M[7], e[14] = M[11], e[15] = M[15];
                return e;
              }
              function z(e, M) {
                var X = M[0], G = M[1], K = M[2], nr = M[3], tr = M[4], sr = M[5], ur = M[6], lr = M[7], gr = M[8], Mr = M[9], pr = M[10], wr = M[11], _r = M[12], Sr = M[13], dr = M[14], br = M[15], Dr = X * sr - G * tr, Ar = X * ur - K * tr, Rr = X * lr - nr * tr, Tr = G * ur - K * sr, Pr = G * lr - nr * sr, Or = K * lr - nr * ur, Lr = gr * Sr - Mr * _r, qr = gr * dr - pr * _r, jr = gr * br - wr * _r, kr = Mr * dr - pr * Sr, Cr = Mr * br - wr * Sr, zr = pr * br - wr * dr, Er = Dr * zr - Ar * Cr + Rr * kr + Tr * jr - Pr * qr + Or * Lr;
                return Er ? (Er = 1 / Er, e[0] = (sr * zr - ur * Cr + lr * kr) * Er, e[1] = (K * Cr - G * zr - nr * kr) * Er, e[2] = (Sr * Or - dr * Pr + br * Tr) * Er, e[3] = (pr * Pr - Mr * Or - wr * Tr) * Er, e[4] = (ur * jr - tr * zr - lr * qr) * Er, e[5] = (X * zr - K * jr + nr * qr) * Er, e[6] = (dr * Rr - _r * Or - br * Ar) * Er, e[7] = (gr * Or - pr * Rr + wr * Ar) * Er, e[8] = (tr * Cr - sr * jr + lr * Lr) * Er, e[9] = (G * jr - X * Cr - nr * Lr) * Er, e[10] = (_r * Pr - Sr * Rr + br * Dr) * Er, e[11] = (Mr * Rr - gr * Pr - wr * Dr) * Er, e[12] = (sr * qr - tr * kr - ur * Lr) * Er, e[13] = (X * kr - G * qr + K * Lr) * Er, e[14] = (Sr * Ar - _r * Tr - dr * Dr) * Er, e[15] = (gr * Tr - Mr * Ar + pr * Dr) * Er, e) : null;
              }
              function g(e, M) {
                var X = M[0], G = M[1], K = M[2], nr = M[3], tr = M[4], sr = M[5], ur = M[6], lr = M[7], gr = M[8], Mr = M[9], pr = M[10], wr = M[11], _r = M[12], Sr = M[13], dr = M[14], br = M[15];
                return e[0] = sr * (pr * br - wr * dr) - Mr * (ur * br - lr * dr) + Sr * (ur * wr - lr * pr), e[1] = -(G * (pr * br - wr * dr) - Mr * (K * br - nr * dr) + Sr * (K * wr - nr * pr)), e[2] = G * (ur * br - lr * dr) - sr * (K * br - nr * dr) + Sr * (K * lr - nr * ur), e[3] = -(G * (ur * wr - lr * pr) - sr * (K * wr - nr * pr) + Mr * (K * lr - nr * ur)), e[4] = -(tr * (pr * br - wr * dr) - gr * (ur * br - lr * dr) + _r * (ur * wr - lr * pr)), e[5] = X * (pr * br - wr * dr) - gr * (K * br - nr * dr) + _r * (K * wr - nr * pr), e[6] = -(X * (ur * br - lr * dr) - tr * (K * br - nr * dr) + _r * (K * lr - nr * ur)), e[7] = X * (ur * wr - lr * pr) - tr * (K * wr - nr * pr) + gr * (K * lr - nr * ur), e[8] = tr * (Mr * br - wr * Sr) - gr * (sr * br - lr * Sr) + _r * (sr * wr - lr * Mr), e[9] = -(X * (Mr * br - wr * Sr) - gr * (G * br - nr * Sr) + _r * (G * wr - nr * Mr)), e[10] = X * (sr * br - lr * Sr) - tr * (G * br - nr * Sr) + _r * (G * lr - nr * sr), e[11] = -(X * (sr * wr - lr * Mr) - tr * (G * wr - nr * Mr) + gr * (G * lr - nr * sr)), e[12] = -(tr * (Mr * dr - pr * Sr) - gr * (sr * dr - ur * Sr) + _r * (sr * pr - ur * Mr)), e[13] = X * (Mr * dr - pr * Sr) - gr * (G * dr - K * Sr) + _r * (G * pr - K * Mr), e[14] = -(X * (sr * dr - ur * Sr) - tr * (G * dr - K * Sr) + _r * (G * ur - K * sr)), e[15] = X * (sr * pr - ur * Mr) - tr * (G * pr - K * Mr) + gr * (G * ur - K * sr), e;
              }
              function d(e) {
                var M = e[0], X = e[1], G = e[2], K = e[3], nr = e[4], tr = e[5], sr = e[6], ur = e[7], lr = e[8], gr = e[9], Mr = e[10], pr = e[11], wr = e[12], _r = e[13], Sr = e[14], dr = e[15], br = M * tr - X * nr, Dr = M * sr - G * nr, Ar = M * ur - K * nr, Rr = X * sr - G * tr, Tr = X * ur - K * tr, Pr = G * ur - K * sr, Or = lr * _r - gr * wr, Lr = lr * Sr - Mr * wr, qr = lr * dr - pr * wr, jr = gr * Sr - Mr * _r, kr = gr * dr - pr * _r, Cr = Mr * dr - pr * Sr;
                return br * Cr - Dr * kr + Ar * jr + Rr * qr - Tr * Lr + Pr * Or;
              }
              function R(e, M, X) {
                var G = M[0], K = M[1], nr = M[2], tr = M[3], sr = M[4], ur = M[5], lr = M[6], gr = M[7], Mr = M[8], pr = M[9], wr = M[10], _r = M[11], Sr = M[12], dr = M[13], br = M[14], Dr = M[15], Ar = X[0], Rr = X[1], Tr = X[2], Pr = X[3];
                return e[0] = Ar * G + Rr * sr + Tr * Mr + Pr * Sr, e[1] = Ar * K + Rr * ur + Tr * pr + Pr * dr, e[2] = Ar * nr + Rr * lr + Tr * wr + Pr * br, e[3] = Ar * tr + Rr * gr + Tr * _r + Pr * Dr, Ar = X[4], Rr = X[5], Tr = X[6], Pr = X[7], e[4] = Ar * G + Rr * sr + Tr * Mr + Pr * Sr, e[5] = Ar * K + Rr * ur + Tr * pr + Pr * dr, e[6] = Ar * nr + Rr * lr + Tr * wr + Pr * br, e[7] = Ar * tr + Rr * gr + Tr * _r + Pr * Dr, Ar = X[8], Rr = X[9], Tr = X[10], Pr = X[11], e[8] = Ar * G + Rr * sr + Tr * Mr + Pr * Sr, e[9] = Ar * K + Rr * ur + Tr * pr + Pr * dr, e[10] = Ar * nr + Rr * lr + Tr * wr + Pr * br, e[11] = Ar * tr + Rr * gr + Tr * _r + Pr * Dr, Ar = X[12], Rr = X[13], Tr = X[14], Pr = X[15], e[12] = Ar * G + Rr * sr + Tr * Mr + Pr * Sr, e[13] = Ar * K + Rr * ur + Tr * pr + Pr * dr, e[14] = Ar * nr + Rr * lr + Tr * wr + Pr * br, e[15] = Ar * tr + Rr * gr + Tr * _r + Pr * Dr, e;
              }
              function L(e, M, X) {
                var G = X[0], K = X[1], nr = X[2], tr = void 0, sr = void 0, ur = void 0, lr = void 0, gr = void 0, Mr = void 0, pr = void 0, wr = void 0, _r = void 0, Sr = void 0, dr = void 0, br = void 0;
                return M === e ? (e[12] = M[0] * G + M[4] * K + M[8] * nr + M[12], e[13] = M[1] * G + M[5] * K + M[9] * nr + M[13], e[14] = M[2] * G + M[6] * K + M[10] * nr + M[14], e[15] = M[3] * G + M[7] * K + M[11] * nr + M[15]) : (tr = M[0], sr = M[1], ur = M[2], lr = M[3], gr = M[4], Mr = M[5], pr = M[6], wr = M[7], _r = M[8], Sr = M[9], dr = M[10], br = M[11], e[0] = tr, e[1] = sr, e[2] = ur, e[3] = lr, e[4] = gr, e[5] = Mr, e[6] = pr, e[7] = wr, e[8] = _r, e[9] = Sr, e[10] = dr, e[11] = br, e[12] = tr * G + gr * K + _r * nr + M[12], e[13] = sr * G + Mr * K + Sr * nr + M[13], e[14] = ur * G + pr * K + dr * nr + M[14], e[15] = lr * G + wr * K + br * nr + M[15]), e;
              }
              function F(e, M, X) {
                var G = X[0], K = X[1], nr = X[2];
                return e[0] = M[0] * G, e[1] = M[1] * G, e[2] = M[2] * G, e[3] = M[3] * G, e[4] = M[4] * K, e[5] = M[5] * K, e[6] = M[6] * K, e[7] = M[7] * K, e[8] = M[8] * nr, e[9] = M[9] * nr, e[10] = M[10] * nr, e[11] = M[11] * nr, e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15], e;
              }
              function l(e, M, X, G) {
                var K = G[0], nr = G[1], tr = G[2], sr = Math.sqrt(K * K + nr * nr + tr * tr), ur = void 0, lr = void 0, gr = void 0, Mr = void 0, pr = void 0, wr = void 0, _r = void 0, Sr = void 0, dr = void 0, br = void 0, Dr = void 0, Ar = void 0, Rr = void 0, Tr = void 0, Pr = void 0, Or = void 0, Lr = void 0, qr = void 0, jr = void 0, kr = void 0, Cr = void 0, zr = void 0, Er = void 0, Nr = void 0;
                return Math.abs(sr) < u.EPSILON ? null : (sr = 1 / sr, K *= sr, nr *= sr, tr *= sr, ur = Math.sin(X), lr = Math.cos(X), gr = 1 - lr, Mr = M[0], pr = M[1], wr = M[2], _r = M[3], Sr = M[4], dr = M[5], br = M[6], Dr = M[7], Ar = M[8], Rr = M[9], Tr = M[10], Pr = M[11], Or = K * K * gr + lr, Lr = nr * K * gr + tr * ur, qr = tr * K * gr - nr * ur, jr = K * nr * gr - tr * ur, kr = nr * nr * gr + lr, Cr = tr * nr * gr + K * ur, zr = K * tr * gr + nr * ur, Er = nr * tr * gr - K * ur, Nr = tr * tr * gr + lr, e[0] = Mr * Or + Sr * Lr + Ar * qr, e[1] = pr * Or + dr * Lr + Rr * qr, e[2] = wr * Or + br * Lr + Tr * qr, e[3] = _r * Or + Dr * Lr + Pr * qr, e[4] = Mr * jr + Sr * kr + Ar * Cr, e[5] = pr * jr + dr * kr + Rr * Cr, e[6] = wr * jr + br * kr + Tr * Cr, e[7] = _r * jr + Dr * kr + Pr * Cr, e[8] = Mr * zr + Sr * Er + Ar * Nr, e[9] = pr * zr + dr * Er + Rr * Nr, e[10] = wr * zr + br * Er + Tr * Nr, e[11] = _r * zr + Dr * Er + Pr * Nr, M !== e && (e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15]), e);
              }
              function S(e, M, X) {
                var G = Math.sin(X), K = Math.cos(X), nr = M[4], tr = M[5], sr = M[6], ur = M[7], lr = M[8], gr = M[9], Mr = M[10], pr = M[11];
                return M !== e && (e[0] = M[0], e[1] = M[1], e[2] = M[2], e[3] = M[3], e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15]), e[4] = nr * K + lr * G, e[5] = tr * K + gr * G, e[6] = sr * K + Mr * G, e[7] = ur * K + pr * G, e[8] = lr * K - nr * G, e[9] = gr * K - tr * G, e[10] = Mr * K - sr * G, e[11] = pr * K - ur * G, e;
              }
              function O(e, M, X) {
                var G = Math.sin(X), K = Math.cos(X), nr = M[0], tr = M[1], sr = M[2], ur = M[3], lr = M[8], gr = M[9], Mr = M[10], pr = M[11];
                return M !== e && (e[4] = M[4], e[5] = M[5], e[6] = M[6], e[7] = M[7], e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15]), e[0] = nr * K - lr * G, e[1] = tr * K - gr * G, e[2] = sr * K - Mr * G, e[3] = ur * K - pr * G, e[8] = nr * G + lr * K, e[9] = tr * G + gr * K, e[10] = sr * G + Mr * K, e[11] = ur * G + pr * K, e;
              }
              function j(e, M, X) {
                var G = Math.sin(X), K = Math.cos(X), nr = M[0], tr = M[1], sr = M[2], ur = M[3], lr = M[4], gr = M[5], Mr = M[6], pr = M[7];
                return M !== e && (e[8] = M[8], e[9] = M[9], e[10] = M[10], e[11] = M[11], e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15]), e[0] = nr * K + lr * G, e[1] = tr * K + gr * G, e[2] = sr * K + Mr * G, e[3] = ur * K + pr * G, e[4] = lr * K - nr * G, e[5] = gr * K - tr * G, e[6] = Mr * K - sr * G, e[7] = pr * K - ur * G, e;
              }
              function Y(e, M) {
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = M[0], e[13] = M[1], e[14] = M[2], e[15] = 1, e;
              }
              function W(e, M) {
                return e[0] = M[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = M[1], e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = M[2], e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function er(e, M, X) {
                var G = X[0], K = X[1], nr = X[2], tr = Math.sqrt(G * G + K * K + nr * nr), sr = void 0, ur = void 0, lr = void 0;
                return Math.abs(tr) < u.EPSILON ? null : (tr = 1 / tr, G *= tr, K *= tr, nr *= tr, sr = Math.sin(M), ur = Math.cos(M), lr = 1 - ur, e[0] = G * G * lr + ur, e[1] = K * G * lr + nr * sr, e[2] = nr * G * lr - K * sr, e[3] = 0, e[4] = G * K * lr - nr * sr, e[5] = K * K * lr + ur, e[6] = nr * K * lr + G * sr, e[7] = 0, e[8] = G * nr * lr + K * sr, e[9] = K * nr * lr - G * sr, e[10] = nr * nr * lr + ur, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e);
              }
              function mr(e, M) {
                var X = Math.sin(M), G = Math.cos(M);
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = G, e[6] = X, e[7] = 0, e[8] = 0, e[9] = -X, e[10] = G, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function yr(e, M) {
                var X = Math.sin(M), G = Math.cos(M);
                return e[0] = G, e[1] = 0, e[2] = -X, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = X, e[9] = 0, e[10] = G, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function or(e, M) {
                var X = Math.sin(M), G = Math.cos(M);
                return e[0] = G, e[1] = X, e[2] = 0, e[3] = 0, e[4] = -X, e[5] = G, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function V(e, M, X) {
                var G = M[0], K = M[1], nr = M[2], tr = M[3], sr = G + G, ur = K + K, lr = nr + nr, gr = G * sr, Mr = G * ur, pr = G * lr, wr = K * ur, _r = K * lr, Sr = nr * lr, dr = tr * sr, br = tr * ur, Dr = tr * lr;
                return e[0] = 1 - (wr + Sr), e[1] = Mr + Dr, e[2] = pr - br, e[3] = 0, e[4] = Mr - Dr, e[5] = 1 - (gr + Sr), e[6] = _r + dr, e[7] = 0, e[8] = pr + br, e[9] = _r - dr, e[10] = 1 - (gr + wr), e[11] = 0, e[12] = X[0], e[13] = X[1], e[14] = X[2], e[15] = 1, e;
              }
              function _(e, M) {
                return e[0] = M[12], e[1] = M[13], e[2] = M[14], e;
              }
              function I(e, M) {
                var X = M[0], G = M[1], K = M[2], nr = M[4], tr = M[5], sr = M[6], ur = M[8], lr = M[9], gr = M[10];
                return e[0] = Math.sqrt(X * X + G * G + K * K), e[1] = Math.sqrt(nr * nr + tr * tr + sr * sr), e[2] = Math.sqrt(ur * ur + lr * lr + gr * gr), e;
              }
              function $(e, M) {
                var X = M[0] + M[5] + M[10], G = 0;
                return X > 0 ? (G = Math.sqrt(X + 1) * 2, e[3] = 0.25 * G, e[0] = (M[6] - M[9]) / G, e[1] = (M[8] - M[2]) / G, e[2] = (M[1] - M[4]) / G) : M[0] > M[5] & M[0] > M[10] ? (G = Math.sqrt(1 + M[0] - M[5] - M[10]) * 2, e[3] = (M[6] - M[9]) / G, e[0] = 0.25 * G, e[1] = (M[1] + M[4]) / G, e[2] = (M[8] + M[2]) / G) : M[5] > M[10] ? (G = Math.sqrt(1 + M[5] - M[0] - M[10]) * 2, e[3] = (M[8] - M[2]) / G, e[0] = (M[1] + M[4]) / G, e[1] = 0.25 * G, e[2] = (M[6] + M[9]) / G) : (G = Math.sqrt(1 + M[10] - M[0] - M[5]) * 2, e[3] = (M[1] - M[4]) / G, e[0] = (M[8] + M[2]) / G, e[1] = (M[6] + M[9]) / G, e[2] = 0.25 * G), e;
              }
              function rr(e, M, X, G) {
                var K = M[0], nr = M[1], tr = M[2], sr = M[3], ur = K + K, lr = nr + nr, gr = tr + tr, Mr = K * ur, pr = K * lr, wr = K * gr, _r = nr * lr, Sr = nr * gr, dr = tr * gr, br = sr * ur, Dr = sr * lr, Ar = sr * gr, Rr = G[0], Tr = G[1], Pr = G[2];
                return e[0] = (1 - (_r + dr)) * Rr, e[1] = (pr + Ar) * Rr, e[2] = (wr - Dr) * Rr, e[3] = 0, e[4] = (pr - Ar) * Tr, e[5] = (1 - (Mr + dr)) * Tr, e[6] = (Sr + br) * Tr, e[7] = 0, e[8] = (wr + Dr) * Pr, e[9] = (Sr - br) * Pr, e[10] = (1 - (Mr + _r)) * Pr, e[11] = 0, e[12] = X[0], e[13] = X[1], e[14] = X[2], e[15] = 1, e;
              }
              function ir(e, M, X, G, K) {
                var nr = M[0], tr = M[1], sr = M[2], ur = M[3], lr = nr + nr, gr = tr + tr, Mr = sr + sr, pr = nr * lr, wr = nr * gr, _r = nr * Mr, Sr = tr * gr, dr = tr * Mr, br = sr * Mr, Dr = ur * lr, Ar = ur * gr, Rr = ur * Mr, Tr = G[0], Pr = G[1], Or = G[2], Lr = K[0], qr = K[1], jr = K[2];
                return e[0] = (1 - (Sr + br)) * Tr, e[1] = (wr + Rr) * Tr, e[2] = (_r - Ar) * Tr, e[3] = 0, e[4] = (wr - Rr) * Pr, e[5] = (1 - (pr + br)) * Pr, e[6] = (dr + Dr) * Pr, e[7] = 0, e[8] = (_r + Ar) * Or, e[9] = (dr - Dr) * Or, e[10] = (1 - (pr + Sr)) * Or, e[11] = 0, e[12] = X[0] + Lr - (e[0] * Lr + e[4] * qr + e[8] * jr), e[13] = X[1] + qr - (e[1] * Lr + e[5] * qr + e[9] * jr), e[14] = X[2] + jr - (e[2] * Lr + e[6] * qr + e[10] * jr), e[15] = 1, e;
              }
              function hr(e, M) {
                var X = M[0], G = M[1], K = M[2], nr = M[3], tr = X + X, sr = G + G, ur = K + K, lr = X * tr, gr = G * tr, Mr = G * sr, pr = K * tr, wr = K * sr, _r = K * ur, Sr = nr * tr, dr = nr * sr, br = nr * ur;
                return e[0] = 1 - Mr - _r, e[1] = gr + br, e[2] = pr - dr, e[3] = 0, e[4] = gr - br, e[5] = 1 - lr - _r, e[6] = wr + Sr, e[7] = 0, e[8] = pr + dr, e[9] = wr - Sr, e[10] = 1 - lr - Mr, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function b(e, M, X, G, K, nr, tr) {
                var sr = 1 / (X - M), ur = 1 / (K - G), lr = 1 / (nr - tr);
                return e[0] = nr * 2 * sr, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = nr * 2 * ur, e[6] = 0, e[7] = 0, e[8] = (X + M) * sr, e[9] = (K + G) * ur, e[10] = (tr + nr) * lr, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = tr * nr * 2 * lr, e[15] = 0, e;
              }
              function p(e, M, X, G, K) {
                var nr = 1 / Math.tan(M / 2), tr = 1 / (G - K);
                return e[0] = nr / X, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = nr, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = (K + G) * tr, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = 2 * K * G * tr, e[15] = 0, e;
              }
              function q(e, M, X, G) {
                var K = Math.tan(M.upDegrees * Math.PI / 180), nr = Math.tan(M.downDegrees * Math.PI / 180), tr = Math.tan(M.leftDegrees * Math.PI / 180), sr = Math.tan(M.rightDegrees * Math.PI / 180), ur = 2 / (tr + sr), lr = 2 / (K + nr);
                return e[0] = ur, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = lr, e[6] = 0, e[7] = 0, e[8] = -((tr - sr) * ur * 0.5), e[9] = (K - nr) * lr * 0.5, e[10] = G / (X - G), e[11] = -1, e[12] = 0, e[13] = 0, e[14] = G * X / (X - G), e[15] = 0, e;
              }
              function Z(e, M, X, G, K, nr, tr) {
                var sr = 1 / (M - X), ur = 1 / (G - K), lr = 1 / (nr - tr);
                return e[0] = -2 * sr, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * ur, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * lr, e[11] = 0, e[12] = (M + X) * sr, e[13] = (K + G) * ur, e[14] = (tr + nr) * lr, e[15] = 1, e;
              }
              function U(e, M, X, G) {
                var K = void 0, nr = void 0, tr = void 0, sr = void 0, ur = void 0, lr = void 0, gr = void 0, Mr = void 0, pr = void 0, wr = void 0, _r = M[0], Sr = M[1], dr = M[2], br = G[0], Dr = G[1], Ar = G[2], Rr = X[0], Tr = X[1], Pr = X[2];
                return Math.abs(_r - Rr) < u.EPSILON && Math.abs(Sr - Tr) < u.EPSILON && Math.abs(dr - Pr) < u.EPSILON ? mat4.identity(e) : (gr = _r - Rr, Mr = Sr - Tr, pr = dr - Pr, wr = 1 / Math.sqrt(gr * gr + Mr * Mr + pr * pr), gr *= wr, Mr *= wr, pr *= wr, K = Dr * pr - Ar * Mr, nr = Ar * gr - br * pr, tr = br * Mr - Dr * gr, wr = Math.sqrt(K * K + nr * nr + tr * tr), wr ? (wr = 1 / wr, K *= wr, nr *= wr, tr *= wr) : (K = 0, nr = 0, tr = 0), sr = Mr * tr - pr * nr, ur = pr * K - gr * tr, lr = gr * nr - Mr * K, wr = Math.sqrt(sr * sr + ur * ur + lr * lr), wr ? (wr = 1 / wr, sr *= wr, ur *= wr, lr *= wr) : (sr = 0, ur = 0, lr = 0), e[0] = K, e[1] = sr, e[2] = gr, e[3] = 0, e[4] = nr, e[5] = ur, e[6] = Mr, e[7] = 0, e[8] = tr, e[9] = lr, e[10] = pr, e[11] = 0, e[12] = -(K * _r + nr * Sr + tr * dr), e[13] = -(sr * _r + ur * Sr + lr * dr), e[14] = -(gr * _r + Mr * Sr + pr * dr), e[15] = 1, e);
              }
              function Q(e, M, X, G) {
                var K = M[0], nr = M[1], tr = M[2], sr = G[0], ur = G[1], lr = G[2], gr = K - X[0], Mr = nr - X[1], pr = tr - X[2], wr = gr * gr + Mr * Mr + pr * pr;
                wr > 0 && (wr = 1 / Math.sqrt(wr), gr *= wr, Mr *= wr, pr *= wr);
                var _r = ur * pr - lr * Mr, Sr = lr * gr - sr * pr, dr = sr * Mr - ur * gr;
                return e[0] = _r, e[1] = Sr, e[2] = dr, e[3] = 0, e[4] = Mr * dr - pr * Sr, e[5] = pr * _r - gr * dr, e[6] = gr * Sr - Mr * _r, e[7] = 0, e[8] = gr, e[9] = Mr, e[10] = pr, e[11] = 0, e[12] = K, e[13] = nr, e[14] = tr, e[15] = 1, e;
              }
              function x(e) {
                return "mat4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ", " + e[9] + ", " + e[10] + ", " + e[11] + ", " + e[12] + ", " + e[13] + ", " + e[14] + ", " + e[15] + ")";
              }
              function fr(e) {
                return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + Math.pow(e[6], 2) + Math.pow(e[7], 2) + Math.pow(e[8], 2) + Math.pow(e[9], 2) + Math.pow(e[10], 2) + Math.pow(e[11], 2) + Math.pow(e[12], 2) + Math.pow(e[13], 2) + Math.pow(e[14], 2) + Math.pow(e[15], 2));
              }
              function vr(e, M, X) {
                return e[0] = M[0] + X[0], e[1] = M[1] + X[1], e[2] = M[2] + X[2], e[3] = M[3] + X[3], e[4] = M[4] + X[4], e[5] = M[5] + X[5], e[6] = M[6] + X[6], e[7] = M[7] + X[7], e[8] = M[8] + X[8], e[9] = M[9] + X[9], e[10] = M[10] + X[10], e[11] = M[11] + X[11], e[12] = M[12] + X[12], e[13] = M[13] + X[13], e[14] = M[14] + X[14], e[15] = M[15] + X[15], e;
              }
              function N(e, M, X) {
                return e[0] = M[0] - X[0], e[1] = M[1] - X[1], e[2] = M[2] - X[2], e[3] = M[3] - X[3], e[4] = M[4] - X[4], e[5] = M[5] - X[5], e[6] = M[6] - X[6], e[7] = M[7] - X[7], e[8] = M[8] - X[8], e[9] = M[9] - X[9], e[10] = M[10] - X[10], e[11] = M[11] - X[11], e[12] = M[12] - X[12], e[13] = M[13] - X[13], e[14] = M[14] - X[14], e[15] = M[15] - X[15], e;
              }
              function H(e, M, X) {
                return e[0] = M[0] * X, e[1] = M[1] * X, e[2] = M[2] * X, e[3] = M[3] * X, e[4] = M[4] * X, e[5] = M[5] * X, e[6] = M[6] * X, e[7] = M[7] * X, e[8] = M[8] * X, e[9] = M[9] * X, e[10] = M[10] * X, e[11] = M[11] * X, e[12] = M[12] * X, e[13] = M[13] * X, e[14] = M[14] * X, e[15] = M[15] * X, e;
              }
              function J(e, M, X, G) {
                return e[0] = M[0] + X[0] * G, e[1] = M[1] + X[1] * G, e[2] = M[2] + X[2] * G, e[3] = M[3] + X[3] * G, e[4] = M[4] + X[4] * G, e[5] = M[5] + X[5] * G, e[6] = M[6] + X[6] * G, e[7] = M[7] + X[7] * G, e[8] = M[8] + X[8] * G, e[9] = M[9] + X[9] * G, e[10] = M[10] + X[10] * G, e[11] = M[11] + X[11] * G, e[12] = M[12] + X[12] * G, e[13] = M[13] + X[13] * G, e[14] = M[14] + X[14] * G, e[15] = M[15] + X[15] * G, e;
              }
              function ar(e, M) {
                return e[0] === M[0] && e[1] === M[1] && e[2] === M[2] && e[3] === M[3] && e[4] === M[4] && e[5] === M[5] && e[6] === M[6] && e[7] === M[7] && e[8] === M[8] && e[9] === M[9] && e[10] === M[10] && e[11] === M[11] && e[12] === M[12] && e[13] === M[13] && e[14] === M[14] && e[15] === M[15];
              }
              function cr(e, M) {
                var X = e[0], G = e[1], K = e[2], nr = e[3], tr = e[4], sr = e[5], ur = e[6], lr = e[7], gr = e[8], Mr = e[9], pr = e[10], wr = e[11], _r = e[12], Sr = e[13], dr = e[14], br = e[15], Dr = M[0], Ar = M[1], Rr = M[2], Tr = M[3], Pr = M[4], Or = M[5], Lr = M[6], qr = M[7], jr = M[8], kr = M[9], Cr = M[10], zr = M[11], Er = M[12], Nr = M[13], Fr = M[14], Ir = M[15];
                return Math.abs(X - Dr) <= u.EPSILON * Math.max(1, Math.abs(X), Math.abs(Dr)) && Math.abs(G - Ar) <= u.EPSILON * Math.max(1, Math.abs(G), Math.abs(Ar)) && Math.abs(K - Rr) <= u.EPSILON * Math.max(1, Math.abs(K), Math.abs(Rr)) && Math.abs(nr - Tr) <= u.EPSILON * Math.max(1, Math.abs(nr), Math.abs(Tr)) && Math.abs(tr - Pr) <= u.EPSILON * Math.max(1, Math.abs(tr), Math.abs(Pr)) && Math.abs(sr - Or) <= u.EPSILON * Math.max(1, Math.abs(sr), Math.abs(Or)) && Math.abs(ur - Lr) <= u.EPSILON * Math.max(1, Math.abs(ur), Math.abs(Lr)) && Math.abs(lr - qr) <= u.EPSILON * Math.max(1, Math.abs(lr), Math.abs(qr)) && Math.abs(gr - jr) <= u.EPSILON * Math.max(1, Math.abs(gr), Math.abs(jr)) && Math.abs(Mr - kr) <= u.EPSILON * Math.max(1, Math.abs(Mr), Math.abs(kr)) && Math.abs(pr - Cr) <= u.EPSILON * Math.max(1, Math.abs(pr), Math.abs(Cr)) && Math.abs(wr - zr) <= u.EPSILON * Math.max(1, Math.abs(wr), Math.abs(zr)) && Math.abs(_r - Er) <= u.EPSILON * Math.max(1, Math.abs(_r), Math.abs(Er)) && Math.abs(Sr - Nr) <= u.EPSILON * Math.max(1, Math.abs(Sr), Math.abs(Nr)) && Math.abs(dr - Fr) <= u.EPSILON * Math.max(1, Math.abs(dr), Math.abs(Fr)) && Math.abs(br - Ir) <= u.EPSILON * Math.max(1, Math.abs(br), Math.abs(Ir));
              }
              r.mul = R, r.sub = N;
            },
            /* 8 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.setAxes = r.sqlerp = r.rotationTo = r.equals = r.exactEquals = r.normalize = r.sqrLen = r.squaredLength = r.len = r.length = r.lerp = r.dot = r.scale = r.mul = r.add = r.set = r.copy = r.fromValues = r.clone = void 0, r.create = E, r.identity = z, r.setAxisAngle = g, r.getAxisAngle = d, r.multiply = R, r.rotateX = L, r.rotateY = F, r.rotateZ = l, r.calculateW = S, r.slerp = O, r.invert = j, r.conjugate = Y, r.fromMat3 = W, r.fromEuler = er, r.str = mr;
              var s = i(0), u = P(s), o = i(1), v = P(o), w = i(2), h = P(w), m = i(3), y = P(m);
              function P(_) {
                if (_ && _.__esModule)
                  return _;
                var I = {};
                if (_ != null)
                  for (var $ in _)
                    Object.prototype.hasOwnProperty.call(_, $) && (I[$] = _[$]);
                return I.default = _, I;
              }
              function E() {
                var _ = new u.ARRAY_TYPE(4);
                return _[0] = 0, _[1] = 0, _[2] = 0, _[3] = 1, _;
              }
              function z(_) {
                return _[0] = 0, _[1] = 0, _[2] = 0, _[3] = 1, _;
              }
              function g(_, I, $) {
                $ = $ * 0.5;
                var rr = Math.sin($);
                return _[0] = rr * I[0], _[1] = rr * I[1], _[2] = rr * I[2], _[3] = Math.cos($), _;
              }
              function d(_, I) {
                var $ = Math.acos(I[3]) * 2, rr = Math.sin($ / 2);
                return rr != 0 ? (_[0] = I[0] / rr, _[1] = I[1] / rr, _[2] = I[2] / rr) : (_[0] = 1, _[1] = 0, _[2] = 0), $;
              }
              function R(_, I, $) {
                var rr = I[0], ir = I[1], hr = I[2], b = I[3], p = $[0], q = $[1], Z = $[2], U = $[3];
                return _[0] = rr * U + b * p + ir * Z - hr * q, _[1] = ir * U + b * q + hr * p - rr * Z, _[2] = hr * U + b * Z + rr * q - ir * p, _[3] = b * U - rr * p - ir * q - hr * Z, _;
              }
              function L(_, I, $) {
                $ *= 0.5;
                var rr = I[0], ir = I[1], hr = I[2], b = I[3], p = Math.sin($), q = Math.cos($);
                return _[0] = rr * q + b * p, _[1] = ir * q + hr * p, _[2] = hr * q - ir * p, _[3] = b * q - rr * p, _;
              }
              function F(_, I, $) {
                $ *= 0.5;
                var rr = I[0], ir = I[1], hr = I[2], b = I[3], p = Math.sin($), q = Math.cos($);
                return _[0] = rr * q - hr * p, _[1] = ir * q + b * p, _[2] = hr * q + rr * p, _[3] = b * q - ir * p, _;
              }
              function l(_, I, $) {
                $ *= 0.5;
                var rr = I[0], ir = I[1], hr = I[2], b = I[3], p = Math.sin($), q = Math.cos($);
                return _[0] = rr * q + ir * p, _[1] = ir * q - rr * p, _[2] = hr * q + b * p, _[3] = b * q - hr * p, _;
              }
              function S(_, I) {
                var $ = I[0], rr = I[1], ir = I[2];
                return _[0] = $, _[1] = rr, _[2] = ir, _[3] = Math.sqrt(Math.abs(1 - $ * $ - rr * rr - ir * ir)), _;
              }
              function O(_, I, $, rr) {
                var ir = I[0], hr = I[1], b = I[2], p = I[3], q = $[0], Z = $[1], U = $[2], Q = $[3], x = void 0, fr = void 0, vr = void 0, N = void 0, H = void 0;
                return fr = ir * q + hr * Z + b * U + p * Q, fr < 0 && (fr = -fr, q = -q, Z = -Z, U = -U, Q = -Q), 1 - fr > 1e-6 ? (x = Math.acos(fr), vr = Math.sin(x), N = Math.sin((1 - rr) * x) / vr, H = Math.sin(rr * x) / vr) : (N = 1 - rr, H = rr), _[0] = N * ir + H * q, _[1] = N * hr + H * Z, _[2] = N * b + H * U, _[3] = N * p + H * Q, _;
              }
              function j(_, I) {
                var $ = I[0], rr = I[1], ir = I[2], hr = I[3], b = $ * $ + rr * rr + ir * ir + hr * hr, p = b ? 1 / b : 0;
                return _[0] = -$ * p, _[1] = -rr * p, _[2] = -ir * p, _[3] = hr * p, _;
              }
              function Y(_, I) {
                return _[0] = -I[0], _[1] = -I[1], _[2] = -I[2], _[3] = I[3], _;
              }
              function W(_, I) {
                var $ = I[0] + I[4] + I[8], rr = void 0;
                if ($ > 0)
                  rr = Math.sqrt($ + 1), _[3] = 0.5 * rr, rr = 0.5 / rr, _[0] = (I[5] - I[7]) * rr, _[1] = (I[6] - I[2]) * rr, _[2] = (I[1] - I[3]) * rr;
                else {
                  var ir = 0;
                  I[4] > I[0] && (ir = 1), I[8] > I[ir * 3 + ir] && (ir = 2);
                  var hr = (ir + 1) % 3, b = (ir + 2) % 3;
                  rr = Math.sqrt(I[ir * 3 + ir] - I[hr * 3 + hr] - I[b * 3 + b] + 1), _[ir] = 0.5 * rr, rr = 0.5 / rr, _[3] = (I[hr * 3 + b] - I[b * 3 + hr]) * rr, _[hr] = (I[hr * 3 + ir] + I[ir * 3 + hr]) * rr, _[b] = (I[b * 3 + ir] + I[ir * 3 + b]) * rr;
                }
                return _;
              }
              function er(_, I, $, rr) {
                var ir = 0.5 * Math.PI / 180;
                I *= ir, $ *= ir, rr *= ir;
                var hr = Math.sin(I), b = Math.cos(I), p = Math.sin($), q = Math.cos($), Z = Math.sin(rr), U = Math.cos(rr);
                return _[0] = hr * q * U - b * p * Z, _[1] = b * p * U + hr * q * Z, _[2] = b * q * Z - hr * p * U, _[3] = b * q * U + hr * p * Z, _;
              }
              function mr(_) {
                return "quat(" + _[0] + ", " + _[1] + ", " + _[2] + ", " + _[3] + ")";
              }
              r.clone = y.clone, r.fromValues = y.fromValues, r.copy = y.copy, r.set = y.set, r.add = y.add, r.mul = R, r.scale = y.scale, r.dot = y.dot, r.lerp = y.lerp;
              var yr = r.length = y.length;
              r.len = yr;
              var or = r.squaredLength = y.squaredLength;
              r.sqrLen = or;
              var V = r.normalize = y.normalize;
              r.exactEquals = y.exactEquals, r.equals = y.equals, r.rotationTo = (function() {
                var _ = h.create(), I = h.fromValues(1, 0, 0), $ = h.fromValues(0, 1, 0);
                return function(rr, ir, hr) {
                  var b = h.dot(ir, hr);
                  return b < -0.999999 ? (h.cross(_, I, ir), h.len(_) < 1e-6 && h.cross(_, $, ir), h.normalize(_, _), g(rr, _, Math.PI), rr) : b > 0.999999 ? (rr[0] = 0, rr[1] = 0, rr[2] = 0, rr[3] = 1, rr) : (h.cross(_, ir, hr), rr[0] = _[0], rr[1] = _[1], rr[2] = _[2], rr[3] = 1 + b, V(rr, rr));
                };
              })(), r.sqlerp = (function() {
                var _ = E(), I = E();
                return function($, rr, ir, hr, b, p) {
                  return O(_, rr, b, p), O(I, ir, hr, p), O($, _, I, 2 * p * (1 - p)), $;
                };
              })(), r.setAxes = (function() {
                var _ = v.create();
                return function(I, $, rr, ir) {
                  return _[0] = rr[0], _[3] = rr[1], _[6] = rr[2], _[1] = ir[0], _[4] = ir[1], _[7] = ir[2], _[2] = -$[0], _[5] = -$[1], _[8] = -$[2], V(I, W(I, _));
                };
              })();
            },
            /* 9 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.forEach = r.sqrLen = r.sqrDist = r.dist = r.div = r.mul = r.sub = r.len = void 0, r.create = v, r.clone = w, r.fromValues = h, r.copy = m, r.set = y, r.add = P, r.subtract = E, r.multiply = z, r.divide = g, r.ceil = d, r.floor = R, r.min = L, r.max = F, r.round = l, r.scale = S, r.scaleAndAdd = O, r.distance = j, r.squaredDistance = Y, r.length = W, r.squaredLength = er, r.negate = mr, r.inverse = yr, r.normalize = or, r.dot = V, r.cross = _, r.lerp = I, r.random = $, r.transformMat2 = rr, r.transformMat2d = ir, r.transformMat3 = hr, r.transformMat4 = b, r.str = p, r.exactEquals = q, r.equals = Z;
              var s = i(0), u = o(s);
              function o(U) {
                if (U && U.__esModule)
                  return U;
                var Q = {};
                if (U != null)
                  for (var x in U)
                    Object.prototype.hasOwnProperty.call(U, x) && (Q[x] = U[x]);
                return Q.default = U, Q;
              }
              function v() {
                var U = new u.ARRAY_TYPE(2);
                return U[0] = 0, U[1] = 0, U;
              }
              function w(U) {
                var Q = new u.ARRAY_TYPE(2);
                return Q[0] = U[0], Q[1] = U[1], Q;
              }
              function h(U, Q) {
                var x = new u.ARRAY_TYPE(2);
                return x[0] = U, x[1] = Q, x;
              }
              function m(U, Q) {
                return U[0] = Q[0], U[1] = Q[1], U;
              }
              function y(U, Q, x) {
                return U[0] = Q, U[1] = x, U;
              }
              function P(U, Q, x) {
                return U[0] = Q[0] + x[0], U[1] = Q[1] + x[1], U;
              }
              function E(U, Q, x) {
                return U[0] = Q[0] - x[0], U[1] = Q[1] - x[1], U;
              }
              function z(U, Q, x) {
                return U[0] = Q[0] * x[0], U[1] = Q[1] * x[1], U;
              }
              function g(U, Q, x) {
                return U[0] = Q[0] / x[0], U[1] = Q[1] / x[1], U;
              }
              function d(U, Q) {
                return U[0] = Math.ceil(Q[0]), U[1] = Math.ceil(Q[1]), U;
              }
              function R(U, Q) {
                return U[0] = Math.floor(Q[0]), U[1] = Math.floor(Q[1]), U;
              }
              function L(U, Q, x) {
                return U[0] = Math.min(Q[0], x[0]), U[1] = Math.min(Q[1], x[1]), U;
              }
              function F(U, Q, x) {
                return U[0] = Math.max(Q[0], x[0]), U[1] = Math.max(Q[1], x[1]), U;
              }
              function l(U, Q) {
                return U[0] = Math.round(Q[0]), U[1] = Math.round(Q[1]), U;
              }
              function S(U, Q, x) {
                return U[0] = Q[0] * x, U[1] = Q[1] * x, U;
              }
              function O(U, Q, x, fr) {
                return U[0] = Q[0] + x[0] * fr, U[1] = Q[1] + x[1] * fr, U;
              }
              function j(U, Q) {
                var x = Q[0] - U[0], fr = Q[1] - U[1];
                return Math.sqrt(x * x + fr * fr);
              }
              function Y(U, Q) {
                var x = Q[0] - U[0], fr = Q[1] - U[1];
                return x * x + fr * fr;
              }
              function W(U) {
                var Q = U[0], x = U[1];
                return Math.sqrt(Q * Q + x * x);
              }
              function er(U) {
                var Q = U[0], x = U[1];
                return Q * Q + x * x;
              }
              function mr(U, Q) {
                return U[0] = -Q[0], U[1] = -Q[1], U;
              }
              function yr(U, Q) {
                return U[0] = 1 / Q[0], U[1] = 1 / Q[1], U;
              }
              function or(U, Q) {
                var x = Q[0], fr = Q[1], vr = x * x + fr * fr;
                return vr > 0 && (vr = 1 / Math.sqrt(vr), U[0] = Q[0] * vr, U[1] = Q[1] * vr), U;
              }
              function V(U, Q) {
                return U[0] * Q[0] + U[1] * Q[1];
              }
              function _(U, Q, x) {
                var fr = Q[0] * x[1] - Q[1] * x[0];
                return U[0] = U[1] = 0, U[2] = fr, U;
              }
              function I(U, Q, x, fr) {
                var vr = Q[0], N = Q[1];
                return U[0] = vr + fr * (x[0] - vr), U[1] = N + fr * (x[1] - N), U;
              }
              function $(U, Q) {
                Q = Q || 1;
                var x = u.RANDOM() * 2 * Math.PI;
                return U[0] = Math.cos(x) * Q, U[1] = Math.sin(x) * Q, U;
              }
              function rr(U, Q, x) {
                var fr = Q[0], vr = Q[1];
                return U[0] = x[0] * fr + x[2] * vr, U[1] = x[1] * fr + x[3] * vr, U;
              }
              function ir(U, Q, x) {
                var fr = Q[0], vr = Q[1];
                return U[0] = x[0] * fr + x[2] * vr + x[4], U[1] = x[1] * fr + x[3] * vr + x[5], U;
              }
              function hr(U, Q, x) {
                var fr = Q[0], vr = Q[1];
                return U[0] = x[0] * fr + x[3] * vr + x[6], U[1] = x[1] * fr + x[4] * vr + x[7], U;
              }
              function b(U, Q, x) {
                var fr = Q[0], vr = Q[1];
                return U[0] = x[0] * fr + x[4] * vr + x[12], U[1] = x[1] * fr + x[5] * vr + x[13], U;
              }
              function p(U) {
                return "vec2(" + U[0] + ", " + U[1] + ")";
              }
              function q(U, Q) {
                return U[0] === Q[0] && U[1] === Q[1];
              }
              function Z(U, Q) {
                var x = U[0], fr = U[1], vr = Q[0], N = Q[1];
                return Math.abs(x - vr) <= u.EPSILON * Math.max(1, Math.abs(x), Math.abs(vr)) && Math.abs(fr - N) <= u.EPSILON * Math.max(1, Math.abs(fr), Math.abs(N));
              }
              r.len = W, r.sub = E, r.mul = z, r.div = g, r.dist = j, r.sqrDist = Y, r.sqrLen = er, r.forEach = (function() {
                var U = v();
                return function(Q, x, fr, vr, N, H) {
                  var J = void 0, ar = void 0;
                  for (x || (x = 2), fr || (fr = 0), vr ? ar = Math.min(vr * x + fr, Q.length) : ar = Q.length, J = fr; J < ar; J += x)
                    U[0] = Q[J], U[1] = Q[J + 1], N(U, U, H), Q[J] = U[0], Q[J + 1] = U[1];
                  return Q;
                };
              })();
            }
            /******/
          ])
        );
      });
    }, {}], 9: [function(t, n, f) {
      /**
       * AUTHOR OF INITIAL JS LIBRARY
       * k-d Tree JavaScript - V 1.0
       *
       * https://github.com/ubilabs/kd-tree-javascript
       *
       * @author Mircea Pricop <pricop@ubilabs.net>, 2012
       * @author Martin Kleppe <kleppe@ubilabs.net>, 2012
       * @author Ubilabs http://ubilabs.net, 2012
       * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
       */
      function a(s, u, o) {
        this.obj = s, this.left = null, this.right = null, this.parent = o, this.dimension = u;
      }
      function r(s, u, o) {
        var v = this;
        function w(h, m, y) {
          var P = m % o.length, E, z;
          return h.length === 0 ? null : h.length === 1 ? new a(h[0], P, y) : (h.sort(function(g, d) {
            return g[o[P]] - d[o[P]];
          }), E = Math.floor(h.length / 2), z = new a(h[E], P, y), z.left = w(h.slice(0, E), m + 1, z), z.right = w(h.slice(E + 1), m + 1, z), z);
        }
        this.root = w(s, 0, null), this.insert = function(h) {
          function m(z, g) {
            if (z === null)
              return g;
            var d = o[z.dimension];
            return h[d] < z.obj[d] ? m(z.left, z) : m(z.right, z);
          }
          var y = m(this.root, null), P, E;
          if (y === null) {
            this.root = new a(h, 0, null);
            return;
          }
          P = new a(h, (y.dimension + 1) % o.length, y), E = o[y.dimension], h[E] < y.obj[E] ? y.left = P : y.right = P;
        }, this.remove = function(h) {
          var m;
          function y(E) {
            if (E === null)
              return null;
            if (E.obj === h)
              return E;
            var z = o[E.dimension];
            return h[z] < E.obj[z] ? y(E.left) : y(E.right);
          }
          function P(E) {
            var z, g, d;
            function R(F, l) {
              var S, O, j, Y, W;
              return F === null ? null : (S = o[l], F.dimension === l ? F.right !== null ? R(F.right, l) : F : (O = F.obj[S], j = R(F.left, l), Y = R(F.right, l), W = F, j !== null && j.obj[S] > O && (W = j), Y !== null && Y.obj[S] > W.obj[S] && (W = Y), W));
            }
            function L(F, l) {
              var S, O, j, Y, W;
              return F === null ? null : (S = o[l], F.dimension === l ? F.left !== null ? L(F.left, l) : F : (O = F.obj[S], j = L(F.left, l), Y = L(F.right, l), W = F, j !== null && j.obj[S] < O && (W = j), Y !== null && Y.obj[S] < W.obj[S] && (W = Y), W));
            }
            if (E.left === null && E.right === null) {
              if (E.parent === null) {
                v.root = null;
                return;
              }
              d = o[E.parent.dimension], E.obj[d] < E.parent.obj[d] ? E.parent.left = null : E.parent.right = null;
              return;
            }
            E.left !== null ? z = R(E.left, E.dimension) : z = L(E.right, E.dimension), g = z.obj, P(z), E.obj = g;
          }
          m = y(v.root), m !== null && P(m);
        }, this.nearest = function(h, m, y) {
          var P, E, z;
          z = new i(
            function(d) {
              return -d[1];
            }
          );
          function g(d) {
            if (!v.root)
              return [];
            var R, L = o[d.dimension], F = u(h, d.obj), l = {}, S, O, j;
            function Y(W, er) {
              z.push([W, er]), z.size() > m && z.pop();
            }
            for (j = 0; j < o.length; j += 1)
              j === d.dimension ? l[o[j]] = h[o[j]] : l[o[j]] = d.obj[o[j]];
            if (S = u(l, d.obj), d.right === null && d.left === null) {
              (z.size() < m || F < z.peek()[1]) && Y(d, F);
              return;
            }
            d.right === null ? R = d.left : d.left === null ? R = d.right : h[L] < d.obj[L] ? R = d.left : R = d.right, g(R), (z.size() < m || F < z.peek()[1]) && Y(d, F), (z.size() < m || Math.abs(S) < z.peek()[1]) && (R === d.left ? O = d.right : O = d.left, O !== null && g(O));
          }
          if (y)
            for (P = 0; P < m; P += 1)
              z.push([null, y]);
          for (g(v.root), E = [], P = 0; P < m && P < z.content.length; P += 1)
            z.content[P][0] && E.push([z.content[P][0].obj, z.content[P][1]]);
          return E;
        }, this.balanceFactor = function() {
          function h(y) {
            return y === null ? 0 : Math.max(h(y.left), h(y.right)) + 1;
          }
          function m(y) {
            return y === null ? 0 : m(y.left) + m(y.right) + 1;
          }
          return h(v.root) / (Math.log(m(v.root)) / Math.log(2));
        };
      }
      function i(s) {
        this.content = [], this.scoreFunction = s;
      }
      i.prototype = {
        push: function(s) {
          this.content.push(s), this.bubbleUp(this.content.length - 1);
        },
        pop: function() {
          var s = this.content[0], u = this.content.pop();
          return this.content.length > 0 && (this.content[0] = u, this.sinkDown(0)), s;
        },
        peek: function() {
          return this.content[0];
        },
        remove: function(s) {
          for (var u = this.content.length, o = 0; o < u; o++)
            if (this.content[o] == s) {
              var v = this.content.pop();
              o != u - 1 && (this.content[o] = v, this.scoreFunction(v) < this.scoreFunction(s) ? this.bubbleUp(o) : this.sinkDown(o));
              return;
            }
          throw new Error("Node not found.");
        },
        size: function() {
          return this.content.length;
        },
        bubbleUp: function(s) {
          for (var u = this.content[s]; s > 0; ) {
            var o = Math.floor((s + 1) / 2) - 1, v = this.content[o];
            if (this.scoreFunction(u) < this.scoreFunction(v))
              this.content[o] = u, this.content[s] = v, s = o;
            else
              break;
          }
        },
        sinkDown: function(s) {
          for (var u = this.content.length, o = this.content[s], v = this.scoreFunction(o); ; ) {
            var w = (s + 1) * 2, h = w - 1, m = null;
            if (h < u) {
              var y = this.content[h], P = this.scoreFunction(y);
              P < v && (m = h);
            }
            if (w < u) {
              var E = this.content[w], z = this.scoreFunction(E);
              z < (m == null ? v : P) && (m = w);
            }
            if (m != null)
              this.content[s] = this.content[m], this.content[m] = o, s = m;
            else
              break;
          }
        }
      }, n.exports = {
        createKdTree: function(s, u, o) {
          return new r(s, u, o);
        }
      };
    }, {}], 10: [function(t, n, f) {
      n.exports = {
        name: "serve-sofa-hrir",
        exports: "serveSofaHrir",
        version: "0.4.2",
        description: "Utility to fetch and shape sofa formated HRIR from server",
        main: "./dist/",
        standalone: "serveSofaHrir",
        scripts: {
          lint: "eslint ./src/ ./test/ && jscs --verbose ./src/ ./test/",
          "lint-examples": "eslint -c examples/.eslintrc ./examples/*.html",
          compile: "rm -rf ./dist && babel ./src/ --out-dir ./dist/",
          browserify: "browserify ./src/index.js -t [ babelify ] --standalone serveSofaHrir > serveSofaHrir.js",
          bundle: "npm run lint && npm run test && npm run doc && npm run compile && npm run browserify",
          doc: "esdoc -c esdoc.json",
          test: "browserify test/*/*.js -t [ babelify ] --exclude 'test/*/*_listen.js*' --exclude 'test/*/*_issues.js' | tape-run",
          "test-browser": "browserify test/*/*.js -t [ babelify ] --exclude 'test/*/*_listen.js*' --exclude 'test/*/*_issues.js' | testling -u",
          "test-listen": "browserify test/*/*_listen.js -t [ babelify ] | tape-run",
          "test-issues": "browserify test/*/*_issues.js -t [ babelify ] | tape-run",
          watch: "watch 'npm run browserify && echo $( date ): browserified' ./src/"
        },
        authors: [
          "Jean-Philippe.Lambert@ircam.fr",
          "Arnau Julià <arnau.julia@gmail.com>",
          "Samuel.Goldszmidt@ircam.fr",
          "David.Poirier-Quinot@ircam.fr"
        ],
        license: "BSD-3-Clause",
        dependencies: {
          "fractional-delay": "git://github.com/Ircam-RnD/fractional-delay#gh-pages",
          "gl-matrix": "^2.4.0",
          "kd.tree": "akshaylive/node-kdt#39bc780704a324393bca68a17cf7bc71be8544c6"
        },
        repository: {
          type: "git",
          url: "https://github.com/Ircam-RnD/serveSofaHrir"
        },
        engines: {
          node: "0.12 || 4",
          npm: ">=1.0.0 <3.0.0"
        },
        devDependencies: {
          "babel-cli": "^6.5.1",
          "babel-eslint": "^4.1.8",
          "babel-preset-es2015": "^6.5.0",
          babelify: "^7.2.0",
          "blue-tape": "^0.1.11",
          browserify: "^12.0.2",
          esdoc: "^0.4.6",
          eslint: "^1.10.3",
          "eslint-config-airbnb": "^1.0.2",
          "eslint-plugin-html": "^1.4.0",
          jscs: "2.11.0",
          "jscs-jsdoc": "^1.3.1",
          tape: "^4.4.0",
          "tape-run": "^2.1.2",
          testling: "^1.7.1",
          watch: "^0.17.1"
        }
      };
    }, {}], 11: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.resampleFloat32Array = s;
      var a = t("fractional-delay"), r = i(a);
      function i(u) {
        return u && u.__esModule ? u : { default: u };
      }
      function s() {
        var u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = new Promise(function(v, w) {
          var h = u.inputSamples, m = u.inputSampleRate, y = typeof u.inputDelay < "u" ? u.inputDelay : 0, P = typeof u.outputSampleRate < "u" ? u.outputSampleRate : m;
          if (m === P && y === 0)
            v(new Float32Array(h));
          else
            try {
              var E = Math.ceil(h.length * P / m), z = new window.OfflineAudioContext(1, E, P), g = z.createBuffer(1, h.length, m), d = 1, R = new r.default(m, d);
              R.setDelay(y / m), g.getChannelData(0).set(R.process(h));
              var L = z.createBufferSource();
              L.buffer = g, L.connect(z.destination), L.start(), z.oncomplete = function(F) {
                var l = F.renderedBuffer.getChannelData(0);
                v(l);
              }, z.startRendering();
            } catch (F) {
              w(new Error("Unable to re-sample Float32Array. " + F.message));
            }
        });
        return o;
      }
      /**
       * @fileOverview Audio utilities
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      f.default = {
        resampleFloat32Array: s
      };
    }, { "fractional-delay": 7 }], 12: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.tree = void 0, f.distanceSquared = s, f.distance = u;
      var a = t("kd.tree"), r = i(a);
      function i(o) {
        return o && o.__esModule ? o : { default: o };
      }
      f.tree = r.default;
      /**
       * @fileOverview Helpers for k-d tree.
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      function s(o, v) {
        var w = v.x - o.x, h = v.y - o.y, m = v.z - o.z;
        return w * w + h * h + m * m;
      }
      function u(o, v) {
        return Math.sqrt(this.distanceSquared(o, v));
      }
      f.default = {
        distance: u,
        distanceSquared: s,
        tree: r.default
      };
    }, { "kd.tree": 9 }], 13: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.sofaCartesianToGl = s, f.glToSofaCartesian = u, f.sofaCartesianToSofaSpherical = o, f.sofaSphericalToSofaCartesian = v, f.sofaSphericalToGl = w, f.glToSofaSpherical = h, f.sofaToSofaCartesian = m, f.spat4CartesianToGl = y, f.glToSpat4Cartesian = P, f.spat4CartesianToSpat4Spherical = E, f.spat4SphericalToSpat4Cartesian = z, f.spat4SphericalToGl = g, f.glToSpat4Spherical = d, f.systemType = R, f.systemToGl = L, f.glToSystem = F;
      var a = t("./degree"), r = i(a);
      function i(l) {
        return l && l.__esModule ? l : { default: l };
      }
      function s(l, S) {
        var O = S[0], j = S[1], Y = S[2];
        return l[0] = 0 - j, l[1] = Y, l[2] = 0 - O, l;
      }
      /**
       * @fileOverview Coordinate systems conversions. openGL, SOFA, and Spat4 (Ircam).
       *
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      function u(l, S) {
        var O = S[0], j = S[1], Y = S[2];
        return l[0] = 0 - Y, l[1] = 0 - O, l[2] = j, l;
      }
      function o(l, S) {
        var O = S[0], j = S[1], Y = S[2], W = O * O + j * j;
        return l[0] = (r.default.atan2(j, O) + 360) % 360, l[1] = r.default.atan2(Y, Math.sqrt(W)), l[2] = Math.sqrt(W + Y * Y), l;
      }
      function v(l, S) {
        var O = S[0], j = S[1], Y = S[2], W = r.default.cos(j);
        return l[0] = Y * W * r.default.cos(O), l[1] = Y * W * r.default.sin(O), l[2] = Y * r.default.sin(j), l;
      }
      function w(l, S) {
        var O = S[0], j = S[1], Y = S[2], W = r.default.cos(j);
        return l[0] = 0 - Y * W * r.default.sin(O), l[1] = Y * r.default.sin(j), l[2] = 0 - Y * W * r.default.cos(O), l;
      }
      function h(l, S) {
        var O = 0 - S[2], j = 0 - S[0], Y = S[1], W = O * O + j * j;
        return l[0] = (r.default.atan2(j, O) + 360) % 360, l[1] = r.default.atan2(Y, Math.sqrt(W)), l[2] = Math.sqrt(W + Y * Y), l;
      }
      function m(l, S, O) {
        switch (O) {
          case "sofaCartesian":
            l[0] = S[0], l[1] = S[1], l[2] = S[2];
            break;
          case "sofaSpherical":
            v(l, S);
            break;
          default:
            throw new Error("Bad coordinate system");
        }
        return l;
      }
      function y(l, S) {
        var O = S[0], j = S[1], Y = S[2];
        return l[0] = O, l[1] = Y, l[2] = 0 - j, l;
      }
      function P(l, S) {
        var O = S[0], j = S[1], Y = S[2];
        return l[0] = O, l[1] = 0 - Y, l[2] = j, l;
      }
      function E(l, S) {
        var O = S[0], j = S[1], Y = S[2], W = O * O + j * j;
        return l[0] = r.default.atan2(O, j), l[1] = r.default.atan2(Y, Math.sqrt(W)), l[2] = Math.sqrt(W + Y * Y), l;
      }
      function z(l, S) {
        var O = S[0], j = S[1], Y = S[2], W = r.default.cos(j);
        return l[0] = Y * W * r.default.sin(O), l[1] = Y * W * r.default.cos(O), l[2] = Y * r.default.sin(j), l;
      }
      function g(l, S) {
        var O = S[0], j = S[1], Y = S[2], W = r.default.cos(j);
        return l[0] = Y * W * r.default.sin(O), l[1] = Y * r.default.sin(j), l[2] = 0 - Y * W * r.default.cos(O), l;
      }
      function d(l, S) {
        var O = S[0], j = 0 - S[2], Y = S[1], W = O * O + j * j;
        return l[0] = r.default.atan2(O, j), l[1] = r.default.atan2(Y, Math.sqrt(W)), l[2] = Math.sqrt(W + Y * Y), l;
      }
      function R(l) {
        var S = void 0;
        if (l === "sofaCartesian" || l === "spat4Cartesian" || l === "gl")
          S = "cartesian";
        else if (l === "sofaSpherical" || l === "spat4Spherical")
          S = "spherical";
        else
          throw new Error("Unknown coordinate system type " + l);
        return S;
      }
      function L(l, S, O) {
        switch (O) {
          case "gl":
            l[0] = S[0], l[1] = S[1], l[2] = S[2];
            break;
          case "sofaCartesian":
            s(l, S);
            break;
          case "sofaSpherical":
            w(l, S);
            break;
          case "spat4Cartesian":
            y(l, S);
            break;
          case "spat4Spherical":
            g(l, S);
            break;
          default:
            throw new Error("Bad coordinate system");
        }
        return l;
      }
      function F(l, S, O) {
        switch (O) {
          case "gl":
            l[0] = S[0], l[1] = S[1], l[2] = S[2];
            break;
          case "sofaCartesian":
            u(l, S);
            break;
          case "sofaSpherical":
            h(l, S);
            break;
          case "spat4Cartesian":
            P(l, S);
            break;
          case "spat4Spherical":
            d(l, S);
            break;
          default:
            throw new Error("Bad coordinate system");
        }
        return l;
      }
      f.default = {
        glToSofaCartesian: u,
        glToSofaSpherical: h,
        glToSpat4Cartesian: P,
        glToSpat4Spherical: d,
        glToSystem: F,
        sofaCartesianToGl: s,
        sofaCartesianToSofaSpherical: o,
        sofaSphericalToGl: w,
        sofaSphericalToSofaCartesian: v,
        sofaToSofaCartesian: m,
        spat4CartesianToGl: y,
        spat4CartesianToSpat4Spherical: E,
        spat4SphericalToGl: g,
        spat4SphericalToSpat4Cartesian: z,
        systemToGl: L,
        systemType: R
      };
    }, { "./degree": 14 }], 14: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.toRadian = i, f.fromRadian = s, f.cos = u, f.sin = o, f.atan2 = v;
      /**
       * @fileOverview Convert to and from degree
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var a = f.toRadianFactor = Math.PI / 180, r = f.fromRadianFactor = 1 / a;
      function i(w) {
        return w * a;
      }
      function s(w) {
        return w * r;
      }
      function u(w) {
        return Math.cos(w * a);
      }
      function o(w) {
        return Math.sin(w * a);
      }
      function v(w, h) {
        return Math.atan2(w, h) * r;
      }
      f.default = {
        atan2: v,
        cos: u,
        fromRadian: s,
        fromRadianFactor: r,
        sin: o,
        toRadian: i,
        toRadianFactor: a
      };
    }, {}], 15: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.ServerDataBase = f.HrtfSet = void 0;
      var a = t("./sofa/HrtfSet"), r = u(a), i = t("./sofa/ServerDataBase"), s = u(i);
      function u(o) {
        return o && o.__esModule ? o : { default: o };
      }
      f.HrtfSet = r.default, f.ServerDataBase = s.default, f.default = {
        HrtfSet: r.default,
        ServerDataBase: s.default
      };
    }, { "./sofa/HrtfSet": 17, "./sofa/ServerDataBase": 18 }], 16: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.version = f.name = f.license = f.description = void 0;
      var a = t("../package.json"), r = i(a);
      function i(w) {
        return w && w.__esModule ? w : { default: w };
      }
      var s = r.default.description;
      /**
       * @fileOverview Information on the library, from the `package.json` file.
       *
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      f.description = s;
      var u = r.default.license;
      f.license = u;
      var o = r.default.name;
      f.name = o;
      var v = r.default.version;
      f.version = v, f.default = {
        description: s,
        license: u,
        name: o,
        version: v
      };
    }, { "../package.json": 10 }], 17: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.HrtfSet = void 0;
      var a = /* @__PURE__ */ (function() {
        function L(F, l) {
          for (var S = 0; S < l.length; S++) {
            var O = l[S];
            O.enumerable = O.enumerable || !1, O.configurable = !0, "value" in O && (O.writable = !0), Object.defineProperty(F, O.key, O);
          }
        }
        return function(F, l, S) {
          return l && L(F.prototype, l), S && L(F, S), F;
        };
      })();
      /**
       * @fileOverview Container for HRTF set: load a set from an URL and get
       * filters from corresponding positions.
       *
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var r = t("gl-matrix"), i = z(r), s = t("../info"), u = E(s), o = t("./parseDataSet"), v = t("./parseSofa"), w = t("../geometry/coordinates"), h = E(w), m = t("../geometry/KdTree"), y = E(m), P = t("../audio/utilities");
      function E(L) {
        return L && L.__esModule ? L : { default: L };
      }
      function z(L) {
        if (L && L.__esModule)
          return L;
        var F = {};
        if (L != null)
          for (var l in L)
            Object.prototype.hasOwnProperty.call(L, l) && (F[l] = L[l]);
        return F.default = L, F;
      }
      function g(L) {
        if (Array.isArray(L)) {
          for (var F = 0, l = Array(L.length); F < L.length; F++)
            l[F] = L[F];
          return l;
        } else
          return Array.from(L);
      }
      function d(L, F) {
        if (!(L instanceof F))
          throw new TypeError("Cannot call a class as a function");
      }
      var R = f.HrtfSet = (function() {
        function L() {
          var F = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          d(this, L), this._audioContext = F.audioContext, this._ready = !1, this.coordinateSystem = F.coordinateSystem, this.filterCoordinateSystem = F.filterCoordinateSystem, this.filterPositions = F.filterPositions, this.filterAfterLoad = F.filterAfterLoad;
        }
        return a(L, [{
          key: "applyFilterPositions",
          // ------------- public methods
          /**
           * Apply filter positions to an existing set of HRTF. (After a successful
           * load.)
           *
           * This is destructive.
           *
           * @see {@link HrtfSet#load}
           */
          value: function() {
            var l = this, S = this._filterPositions.map(function(O) {
              return l._kdt.nearest({ x: O[0], y: O[1], z: O[2] }, 1).pop()[0];
            });
            S = [].concat(g(new Set(S))), this._kdt = y.default.tree.createKdTree(S, y.default.distanceSquared, ["x", "y", "z"]);
          }
          /**
           * Load an URL and generate the corresponding set of IR buffers.
           *
           * @param {String} sourceUrl
           * @returns {Promise.<this|Error>} resolve when the URL sucessfully
           * loaded.
           */
        }, {
          key: "load",
          value: function(l) {
            var S = this, O = l.split(".").pop(), j = O === "sofa" ? l + ".json" : l, Y = void 0, W = typeof this._filterPositions < "u" && !this.filterAfterLoad && O === "sofa";
            return W ? Y = Promise.all([this._loadMetaAndPositions(l), this._loadDataSet(l)]).then(function(er) {
              var mr = er[0], yr = er[1];
              return S._loadSofaPartial(l, mr, yr).then(function() {
                return S._ready = !0, S;
              });
            }).catch(function() {
              return S._loadSofaFull(j).then(function() {
                return S.applyFilterPositions(), S._ready = !0, S;
              });
            }) : Y = this._loadSofaFull(j).then(function() {
              return typeof S._filterPositions < "u" && S.filterAfterLoad && S.applyFilterPositions(), S._ready = !0, S;
            }), Y;
          }
          /**
           * Export the current HRTF set as a JSON string.
           *
           * When set, `this.filterPositions` reduce the actual number of filter, and
           * thus the exported set. The coordinate system of the export is
           * `this.filterCoordinateSystem`.
           *
           * @see {@link HrtfSet#filterCoordinateSystem}
           * @see {@link HrtfSet#filterPositions}
           *
           * @returns {String} as a SOFA JSON file.
           * @throws {Error} when this.filterCoordinateSystem is unknown.
           */
        }, {
          key: "export",
          value: function() {
            var l = this, S = void 0, O = h.default.systemType(this.filterCoordinateSystem);
            switch (O) {
              case "cartesian":
                S = this._sofaSourcePosition.map(function(Y) {
                  return h.default.glToSofaCartesian([], Y);
                });
                break;
              case "spherical":
                S = this._sofaSourcePosition.map(function(Y) {
                  return h.default.glToSofaSpherical([], Y);
                });
                break;
              default:
                throw new Error("Bad source position type " + O + " for export.");
            }
            var j = this._sofaSourcePosition.map(function(Y) {
              for (var W = l._kdt.nearest({ x: Y[0], y: Y[1], z: Y[2] }, 1).pop()[0].fir, er = [], mr = 0; mr < W.numberOfChannels; ++mr)
                er.push([].concat(g(W.getChannelData(mr))));
              return er;
            });
            return (0, v.stringifySofa)({
              name: this._sofaName,
              metaData: this._sofaMetaData,
              ListenerPosition: [0, 0, 0],
              ListenerPositionType: "cartesian",
              ListenerUp: [0, 0, 1],
              ListenerUpType: "cartesian",
              ListenerView: [1, 0, 0],
              ListenerViewType: "cartesian",
              SourcePositionType: O,
              SourcePosition: S,
              DataSamplingRate: this._audioContext.sampleRate,
              DataDelay: this._sofaDelay,
              DataIR: j,
              RoomVolume: this._sofaRoomVolume
            });
          }
          /**
           * @typedef {Object} HrtfSet.nearestType
           * @property {Number} distance from the request
           * @property {AudioBuffer} fir 2-channels impulse response
           * @property {Number} index original index in the SOFA set
           * @property {Coordinates} position using coordinateSystem coordinates
           * system.
           */
          /**
           * Get the nearest point in the HRTF set, after a successful load.
           *
           * @see {@link HrtfSet#load}
           *
           * @param {Coordinates} positionRequest
           * @returns {HrtfSet.nearestType}
           */
        }, {
          key: "nearest",
          value: function(l) {
            var S = h.default.systemToGl([], l, this.coordinateSystem), O = this._kdt.nearest({
              x: S[0],
              y: S[1],
              z: S[2]
            }, 1).pop(), j = O[0];
            return h.default.glToSystem(S, [j.x, j.y, j.z], this.coordinateSystem), {
              distance: O[1],
              fir: j.fir,
              index: j.index,
              position: S
            };
          }
          /**
           * Get the FIR AudioBuffer that corresponds to the closest position in
           * the set.
           * @param {Coordinates} positionRequest
           * @returns {AudioBuffer}
           */
        }, {
          key: "nearestFir",
          value: function(l) {
            return this.nearest(l).fir;
          }
          // ----------- private methods
          /**
           * Creates a kd-tree out of the specified indices, positions, and FIR.
           *
           * @private
           *
           * @param {Array} indicesPositionsFirs
           * @returns {this}
           */
        }, {
          key: "_createKdTree",
          value: function(l) {
            var S = this, O = l.map(function(j) {
              var Y = j[2], W = S._audioContext.createBuffer(Y.length, Y[0].length, S._audioContext.sampleRate);
              return Y.forEach(function(er, mr) {
                W.getChannelData(mr).set(er);
              }), {
                index: j[0],
                x: j[1][0],
                y: j[1][1],
                z: j[1][2],
                fir: W
              };
            });
            return this._sofaSourcePosition = O.map(function(j) {
              return [j.x, j.y, j.z];
            }), this._kdt = y.default.tree.createKdTree(O, y.default.distanceSquared, ["x", "y", "z"]), this;
          }
          /**
           * Asynchronously create Float32Arrays, with possible re-sampling.
           *
           * @private
           *
           * @param {Array.<Number>} indices
           * @param {Array.<Coordinates>} positions
           * @param {Array.<Float32Array>} firs
           * @returns {Promise.<Array|Error>}
           * @throws {Error} assertion that the channel count is 2
           */
        }, {
          key: "_generateIndicesPositionsFirs",
          value: function(l, S, O, j) {
            var Y = this, W = O.map(function(er, mr) {
              var yr = er.length;
              if (yr !== 2)
                throw new Error("Bad number of channels" + (" for IR index " + l[mr]) + (" (" + yr + " instead of 2)"));
              if (j[0].length !== 2)
                throw new Error("Bad delay format" + (" for IR index " + l[mr]) + (" (first element in Data.Delay is " + j[0]) + " instead of [[delayL, delayR]] )");
              var or = typeof j[mr] < "u" ? j[mr] : j[0], V = er.map(function(_, I) {
                if (or[I] < 0)
                  throw new Error("Negative delay detected (not handled at the moment):" + (" delay index " + l[mr]) + (" channel " + I));
                return (0, P.resampleFloat32Array)({
                  inputSamples: _,
                  inputDelay: or[I],
                  inputSampleRate: Y._sofaSampleRate,
                  outputSampleRate: Y._audioContext.sampleRate
                });
              });
              return Promise.all(V).then(function(_) {
                return [l[mr], S[mr], _];
              }).catch(function(_) {
                throw new Error("Unable to re-sample impulse response " + mr + ". " + _.message);
              });
            });
            return Promise.all(W);
          }
          /**
           * Try to load a data set from a SOFA URL.
           *
           * @private
           *
           * @param {String} sourceUrl
           * @returns {Promise.<Object|Error>}
           */
        }, {
          key: "_loadDataSet",
          value: function(l) {
            var S = new Promise(function(O, j) {
              var Y = l + ".dds", W = new window.XMLHttpRequest();
              W.open("GET", Y), W.onerror = function() {
                j(new Error("Unable to GET " + Y + ", status " + W.status + " " + ("" + W.responseText)));
              }, W.onload = function() {
                if (W.status < 200 || W.status >= 300) {
                  W.onerror();
                  return;
                }
                try {
                  var er = (0, o.parseDataSet)(W.response);
                  O(er);
                } catch (mr) {
                  j(new Error("Unable to parse " + Y + ". " + mr.message));
                }
              }, W.send();
            });
            return S;
          }
          /**
           * Try to load meta-data and positions from a SOFA URL, to get the
           * indices closest to the filter positions.
           *
           * @private
           *
           * @param {String} sourceUrl
           * @returns {Promise.<Array.<Number>|Error>}
           */
        }, {
          key: "_loadMetaAndPositions",
          value: function(l) {
            var S = this, O = new Promise(function(j, Y) {
              var W = l + ".json?ListenerPosition,ListenerUp,ListenerView,SourcePosition,Data.Delay,Data.SamplingRate,EmitterPosition,ReceiverPosition,RoomVolume", er = new window.XMLHttpRequest();
              er.open("GET", W), er.onerror = function() {
                Y(new Error("Unable to GET " + W + ", status " + er.status + " " + ("" + er.responseText)));
              }, er.onload = function() {
                if (er.status < 200 || er.status >= 300) {
                  er.onerror();
                  return;
                }
                try {
                  var mr = (0, v.parseSofa)(er.response);
                  S._setMetaData(mr, l);
                  var yr = S._sourcePositionsToGl(mr), or = yr.map(function(I, $) {
                    return {
                      x: I[0],
                      y: I[1],
                      z: I[2],
                      index: $
                    };
                  }), V = y.default.tree.createKdTree(or, y.default.distanceSquared, ["x", "y", "z"]), _ = S._filterPositions.map(function(I) {
                    return V.nearest({ x: I[0], y: I[1], z: I[2] }, 1).pop()[0].index;
                  });
                  _ = [].concat(g(new Set(_))), S._sofaUrl = l, j(_);
                } catch (I) {
                  Y(new Error("Unable to parse " + W + ". " + I.message));
                }
              }, er.send();
            });
            return O;
          }
          /**
           * Try to load full SOFA URL.
           *
           * @private
           *
           * @param {String} url
           * @returns {Promise.<this|Error>}
           */
        }, {
          key: "_loadSofaFull",
          value: function(l) {
            var S = this, O = new Promise(function(j, Y) {
              var W = new window.XMLHttpRequest();
              W.open("GET", l), W.onerror = function() {
                Y(new Error("Unable to GET " + l + ", status " + W.status + " " + ("" + W.responseText)));
              }, W.onload = function() {
                if (W.status < 200 || W.status >= 300) {
                  W.onerror();
                  return;
                }
                try {
                  var er = (0, v.parseSofa)(W.response);
                  S._setMetaData(er, l);
                  var mr = S._sourcePositionsToGl(er);
                  S._generateIndicesPositionsFirs(
                    mr.map(function(yr, or) {
                      return or;
                    }),
                    // full
                    mr,
                    er["Data.IR"].data,
                    er["Data.Delay"].data
                  ).then(function(yr) {
                    S._createKdTree(yr), S._sofaUrl = l, j(S);
                  });
                } catch (yr) {
                  Y(new Error("Unable to parse " + l + ". " + yr.message));
                }
              }, W.send();
            });
            return O;
          }
          /**
           * Try to load partial data from a SOFA URL.
           *
           * @private
           *
           * @param {Array.<String>} sourceUrl
           * @param {Array.<Number>} indices
           * @param {Object} dataSet
           * @returns {Promise.<this|Error>}
           */
        }, {
          key: "_loadSofaPartial",
          value: function(l, S, O) {
            var j = this, Y = S.map(function(W) {
              var er = new Promise(function(mr, yr) {
                var or = l + ".json?" + ("SourcePosition[" + W + "][0:1:" + (O.SourcePosition.C - 1) + "],") + ("Data.IR[" + W + "][0:1:" + (O["Data.IR"].R - 1) + "]") + ("[0:1:" + (O["Data.IR"].N - 1) + "]"), V = new window.XMLHttpRequest();
                V.open("GET", or), V.onerror = function() {
                  yr(new Error("Unable to GET " + or + ", status " + V.status + " " + ("" + V.responseText)));
                }, V.onload = function() {
                  (V.status < 200 || V.status >= 300) && V.onerror();
                  try {
                    var _ = (0, v.parseSofa)(V.response), I = j._sourcePositionsToGl(_);
                    j._generateIndicesPositionsFirs([W], I, _["Data.IR"].data, _["Data.Delay"].data).then(function($) {
                      mr($[0]);
                    });
                  } catch ($) {
                    yr(new Error("Unable to parse " + or + ". " + $.message));
                  }
                }, V.send();
              });
              return er;
            });
            return Promise.all(Y).then(function(W) {
              return j._createKdTree(W), j;
            });
          }
          /**
           * Set meta-data, and assert for supported HRTF type.
           *
           * @private
           *
           * @param {Object} data
           * @param {String} sourceUrl
           * @throws {Error} assertion for FIR data.
           */
        }, {
          key: "_setMetaData",
          value: function(l, S) {
            if (typeof l.metaData.DataType < "u" && l.metaData.DataType !== "FIR")
              throw new Error("According to meta-data, SOFA data type is not FIR");
            var O = (/* @__PURE__ */ new Date()).toISOString();
            this._sofaName = typeof l.name < "u" ? "" + l.name : "HRTF.sofa", this._sofaMetaData = typeof l.metaData < "u" ? l.metaData : {}, typeof S < "u" && (this._sofaMetaData.OriginalUrl = S), this._sofaMetaData.Converter = "Ircam " + u.default.name + " " + u.default.version + " javascript API ", this._sofaMetaData.DateConverted = O, this._sofaSampleRate = typeof l["Data.SamplingRate"] < "u" ? l["Data.SamplingRate"].data[0] : 48e3, this._sofaSampleRate !== this._audioContext.sampleRate && (this._sofaMetaData.OriginalSampleRate = this._sofaSampleRate), this._sofaDelay = typeof l["Data.Delay"] < "u" ? l["Data.Delay"].data : [0, 0], this._sofaRoomVolume = typeof l.RoomVolume < "u" ? l.RoomVolume.data[0] : void 0;
            var j = h.default.sofaToSofaCartesian([], l.ListenerPosition.data[0], (0, v.conformSofaCoordinateSystem)(l.ListenerPosition.Type || "cartesian")), Y = h.default.sofaToSofaCartesian([], l.ListenerView.data[0], (0, v.conformSofaCoordinateSystem)(l.ListenerView.Type || "cartesian")), W = h.default.sofaToSofaCartesian([], l.ListenerUp.data[0], (0, v.conformSofaCoordinateSystem)(l.ListenerUp.Type || "cartesian"));
            this._sofaToGl = i.mat4.lookAt([], j, Y, W);
          }
          /**
           * Convert to GL coordinates, in-place.
           *
           * @private
           *
           * @param {Object} data
           * @returns {Array.<Coordinates>}
           * @throws {Error}
           */
        }, {
          key: "_sourcePositionsToGl",
          value: function(l) {
            var S = this, O = l.SourcePosition.data, j = typeof l.SourcePosition.Type < "u" ? l.SourcePosition.Type : "spherical";
            switch (j) {
              case "cartesian":
                O.forEach(function(Y) {
                  i.vec3.transformMat4(Y, Y, S._sofaToGl);
                });
                break;
              case "spherical":
                O.forEach(function(Y) {
                  h.default.sofaSphericalToSofaCartesian(Y, Y), i.vec3.transformMat4(Y, Y, S._sofaToGl);
                });
                break;
              default:
                throw new Error("Bad source position type");
            }
            return O;
          }
        }, {
          key: "coordinateSystem",
          set: function(l) {
            this._coordinateSystem = typeof l < "u" ? l : "gl";
          },
          get: function() {
            return this._coordinateSystem;
          }
          /**
           * Set coordinate system for filter positions.
           *
           * @param {CoordinateSystem} [system] undefined to use coordinateSystem
           */
        }, {
          key: "filterCoordinateSystem",
          set: function(l) {
            this._filterCoordinateSystem = typeof l < "u" ? l : this.coordinateSystem;
          },
          get: function() {
            return this._filterCoordinateSystem;
          }
          /**
           * Set filter positions.
           *
           * @param {Array.<Coordinates>} [positions] undefined for no filtering.
           */
        }, {
          key: "filterPositions",
          set: function(l) {
            if (typeof l > "u")
              this._filterPositions = void 0;
            else
              switch (this.filterCoordinateSystem) {
                case "gl":
                  this._filterPositions = l.map(function(S) {
                    return S.slice(0);
                  });
                  break;
                case "sofaCartesian":
                  this._filterPositions = l.map(function(S) {
                    return h.default.sofaCartesianToGl([], S);
                  });
                  break;
                case "sofaSpherical":
                  this._filterPositions = l.map(function(S) {
                    return h.default.sofaSphericalToGl([], S);
                  });
                  break;
                default:
                  throw new Error("Bad filter coordinate system");
              }
          },
          get: function() {
            var l = void 0;
            if (typeof this._filterPositions < "u")
              switch (this.filterCoordinateSystem) {
                case "gl":
                  l = this._filterPositions.map(function(S) {
                    return S.slice(0);
                  });
                  break;
                case "sofaCartesian":
                  l = this._filterPositions.map(function(S) {
                    return h.default.glToSofaCartesian([], S);
                  });
                  break;
                case "sofaSpherical":
                  l = this._filterPositions.map(function(S) {
                    return h.default.glToSofaSpherical([], S);
                  });
                  break;
                default:
                  throw new Error("Bad filter coordinate system");
              }
            return l;
          }
          /**
           * Set post-filtering flag. When false, try to load a partial set of
           * HRTF.
           *
           * @param {Boolean} [post=false]
           */
        }, {
          key: "filterAfterLoad",
          set: function(l) {
            this._filterAfterLoad = typeof l < "u" ? l : !1;
          },
          get: function() {
            return this._filterAfterLoad;
          }
          /**
           * Test whether an HRTF set is actually loaded.
           *
           * @see {@link HrtfSet#load}
           *
           * @returns {Boolean} false before any successful load, true after.
           *
           */
        }, {
          key: "isReady",
          get: function() {
            return this._ready;
          }
          /**
           * Get the original name of the HRTF set.
           *
           * @returns {String} that is undefined before a successfully load.
           */
        }, {
          key: "sofaName",
          get: function() {
            return this._sofaName;
          }
          /**
           * Get the URL used to actually load the HRTF set.
           *
           * @returns {String} that is undefined before a successfully load.
           */
        }, {
          key: "sofaUrl",
          get: function() {
            return this._sofaUrl;
          }
          /**
           * Get the original sample-rate from the SOFA URL already loaded.
           *
           * @returns {Number} that is undefined before a successfully load.
           */
        }, {
          key: "sofaSampleRate",
          get: function() {
            return this._sofaSampleRate;
          }
          /**
           * Get the meta-data from the SOFA URL already loaded.
           *
           * @returns {Object} that is undefined before a successfully load.
           */
        }, {
          key: "sofaMetaData",
          get: function() {
            return this._sofaMetaData;
          }
        }]), L;
      })();
      f.default = R;
    }, { "../audio/utilities": 11, "../geometry/KdTree": 12, "../geometry/coordinates": 13, "../info": 16, "./parseDataSet": 19, "./parseSofa": 20, "gl-matrix": 8 }], 18: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.ServerDataBase = void 0;
      var a = /* @__PURE__ */ (function() {
        function w(h, m) {
          for (var y = 0; y < m.length; y++) {
            var P = m[y];
            P.enumerable = P.enumerable || !1, P.configurable = !0, "value" in P && (P.writable = !0), Object.defineProperty(h, P.key, P);
          }
        }
        return function(h, m, y) {
          return m && w(h.prototype, m), y && w(h, y), h;
        };
      })();
      /**
       * @fileOverview Access a remote catalogue from a SOFA server, and get URLs
       * with filtering.
       *
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var r = t("./parseXml"), i = u(r), s = t("./parseDataSet");
      function u(w) {
        return w && w.__esModule ? w : { default: w };
      }
      function o(w, h) {
        if (!(w instanceof h))
          throw new TypeError("Cannot call a class as a function");
      }
      var v = f.ServerDataBase = (function() {
        function w() {
          var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          if (o(this, w), this._server = h.serverUrl, typeof this._server > "u") {
            var m = window.location.protocol === "https:" ? "https:" : "http:";
            this._server = m + "//bili2.ircam.fr";
          }
          this._catalogue = {}, this._urls = [];
        }
        return a(w, [{
          key: "loadCatalogue",
          value: function() {
            var m = this, y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this._server + "/catalog.xml", P = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this._catalogue, E = new Promise(function(z, g) {
              var d = new window.XMLHttpRequest();
              d.open("GET", y), d.onerror = function() {
                g(new Error("Unable to GET " + y + ", status " + d.status + " " + ("" + d.responseText)));
              }, d.onload = function() {
                if (d.status < 200 || d.status >= 300) {
                  d.onerror();
                  return;
                }
                var R = (0, i.default)(d.response), L = R.querySelector("dataset"), F = R.querySelectorAll("dataset > catalogRef");
                if (F.length === 0) {
                  P.urls = [];
                  for (var l = R.querySelectorAll("dataset > dataset"), S = 0; S < l.length; ++S) {
                    var O = m._server + L.getAttribute("name") + "/" + l[S].getAttribute("name");
                    m._urls.push(O), P.urls.push(O);
                  }
                  z(y);
                } else {
                  for (var j = [], Y = 0; Y < F.length; ++Y) {
                    var W = F[Y].getAttribute("name"), er = m._server + L.getAttribute("name") + "/" + F[Y].getAttribute("xlink:href");
                    P[W] = {}, j.push(m.loadCatalogue(er, P[W]));
                  }
                  Promise.all(j).then(function() {
                    m._urls.sort(), z(y);
                  }).catch(function(mr) {
                    g(mr);
                  });
                }
              }, d.send();
            });
            return E;
          }
          /**
           * Get URLs, possibly filtered.
           *
           * Any filter can be partial, and is case-insensitive. The result must
           * match every supplied filter. Undefined filters are not applied. For
           * any filter, `|` is the or operator.
           *
           * @param {Object} [options] optional filters
           * @param {String} [options.convention] 'HRIR' or 'SOS'
           * @param {String} [options.dataBase] 'LISTEN', 'BILI', etc.
           * @param {String} [options.equalisation] 'RAW','COMPENSATED'
           * @param {String} [options.sampleRate] in Hertz
           * @param {String} [options.sosOrder] '12order' or '24order'
           * @param {String} [options.freePattern] any pattern matched
           * globally. Use separators (spaces, tabs, etc.) to combine multiple
           * patterns: '44100 listen' will restrict on URLs matching '44100' and
           * 'listen'; '44100|48000 bili|listen' matches ('44100' or '48000') and
           * ('bili' or 'listen').
           * @returns {Array.<String>} URLs that match every filter.
           */
        }, {
          key: "getUrls",
          value: function() {
            var m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, y = [m.convention, m.dataBase, m.equalisation, m.sampleRate, m.sosOrder], P = typeof m.freePattern == "number" ? m.freePattern.toString() : m.freePattern, E = y.reduce(function(R, L) {
              return R + "/" + (typeof L < "u" ? "[^/]*(?:" + L + ")[^/]*" : "[^/]*");
            }, ""), z = new RegExp(E, "i"), g = this._urls.filter(function(R) {
              return z.test(R);
            });
            if (typeof P < "u") {
              var d = P.split(/\s+/);
              d.forEach(function(R) {
                z = new RegExp(R, "i"), g = g.filter(function(L) {
                  return z.test(L);
                });
              });
            }
            return g;
          }
          /**
           * Get the data-set definitions of a given URL.
           *
           * @param {String} sourceUrl is the complete SOFA URL, with the
           * server, like
           * 'http://bili2.ircam.fr/SimpleFreeFieldHRIR/BILI/COMPENSATED/44100/IRC_1100_C_HRIR.sofa'
           *
           * @returns {Promise.<Object|String>} The promise will resolve after
           * successfully loading, with definitions as * `{definition: {key: values}}`
           * objects; the promise will reject is the transfer fails, with an error.
           */
        }, {
          key: "getDataSetDefinitions",
          value: function(m) {
            var y = new Promise(function(P, E) {
              var z = m + ".dds", g = new window.XMLHttpRequest();
              g.open("GET", z), g.onerror = function() {
                E(new Error("Unable to GET " + z + ", status " + g.status + " " + ("" + g.responseText)));
              }, g.onload = function() {
                if (g.status < 200 || g.status >= 300) {
                  g.onerror();
                  return;
                }
                P((0, s.parseDataSet)(g.response));
              }, g.send();
            });
            return y;
          }
          /**
           * Get all source positions of a given URL.
           *
           * @param {String} sourceUrl is the complete SOFA URL, with the
           * server, like
           * 'http://bili2.ircam.fr/SimpleFreeFieldHRIR/BILI/COMPENSATED/44100/IRC_1100_C_HRIR.sofa'
           *
           * @returns {Promise.<Array<Array.<Number>>|Error>} The promise will resolve
           * after successfully loading, with an array of positions (which are
           * arrays of 3 numbers); the promise will reject is the transfer fails,
           * with an error.
           */
        }, {
          key: "getSourcePositions",
          value: function(m) {
            var y = new Promise(function(P, E) {
              var z = m + ".json?SourcePosition", g = new window.XMLHttpRequest();
              g.open("GET", z), g.onerror = function() {
                E(new Error("Unable to GET " + z + ", status " + g.status + " " + ("" + g.responseText)));
              }, g.onload = function() {
                if (g.status < 200 || g.status >= 300) {
                  g.onerror();
                  return;
                }
                try {
                  var d = JSON.parse(g.response);
                  if (d.leaves[0].name !== "SourcePosition")
                    throw new Error("SourcePosition not found");
                  P(d.leaves[0].data);
                } catch (R) {
                  E(new Error("Unable to parse response from " + z + ". " + R.message));
                }
              }, g.send();
            });
            return y;
          }
        }]), w;
      })();
      f.default = v;
    }, { "./parseDataSet": 19, "./parseXml": 21 }], 19: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f._parseDimension = h, f._parseDefinition = m, f.parseDataSet = y;
      /**
       * @fileOverview Parser for DDS files
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var a = "\\[\\s*(\\w+)\\s*=\\s*(\\d+)\\s*\\]", r = new RegExp(a, "g"), i = new RegExp(a), s = "\\s*(\\w+)\\s*([\\w.]+)\\s*((?:\\[[^\\]]+\\]\\s*)+);\\s*", u = new RegExp(s, "g"), o = new RegExp(s), v = "\\s*Dataset\\s*\\{\\s*((?:[^;]+;\\s*)*)\\s*\\}\\s*[\\w.]+\\s*;\\s*", w = new RegExp(v);
      function h(P) {
        var E = [], z = P.match(r);
        return z !== null && z.forEach(function(g) {
          var d = i.exec(g);
          d !== null && d.length > 2 && E.push([d[1], Number(d[2])]);
        }), E;
      }
      function m(P) {
        var E = [], z = P.match(u);
        return z !== null && z.forEach(function(g) {
          var d = o.exec(g);
          if (d !== null && d.length > 3) {
            var R = [];
            R[0] = d[2], R[1] = {}, R[1].type = d[1], h(d[3]).forEach(function(L) {
              R[1][L[0]] = L[1];
            }), E.push(R);
          }
        }), E;
      }
      function y(P) {
        var E = {}, z = w.exec(P);
        return z !== null && z.length > 1 && m(z[1]).forEach(function(g) {
          E[g[0]] = g[1];
        }), E;
      }
      f.default = y;
    }, {}], 20: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.parseSofa = a, f.stringifySofa = r, f.conformSofaCoordinateSystem = i;
      /**
       * @fileOverview Parser functions for SOFA files
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      function a(s) {
        try {
          var u = JSON.parse(s), o = {};
          if (o.name = u.name, typeof u.attributes < "u") {
            o.metaData = {};
            var v = u.attributes.find(function(h) {
              return h.name === "NC_GLOBAL";
            });
            typeof v < "u" && v.attributes.forEach(function(h) {
              o.metaData[h.name] = h.value[0];
            });
          }
          if (typeof u.leaves < "u") {
            var w = u.leaves;
            w.forEach(function(h) {
              o[h.name] = {}, h.attributes.forEach(function(m) {
                o[h.name][m.name] = m.value[0];
              }), o[h.name].shape = h.shape, o[h.name].data = h.data;
            });
          }
          return o;
        } catch (h) {
          throw new Error("Unable to parse SOFA string. " + h.message);
        }
      }
      function r(s) {
        var u = {};
        if (typeof s.name < "u" && (u.name = s.name), typeof s.metaData < "u") {
          u.attributes = [];
          var o = {
            name: "NC_GLOBAL",
            attributes: []
          };
          for (var v in s.metaData)
            s.metaData.hasOwnProperty(v) && o.attributes.push({
              name: v,
              value: [s.metaData[v]]
            });
          u.attributes.push(o);
        }
        var w = "Float64", h = void 0;
        if (u.leaves = [], [["ListenerPosition", "ListenerPositionType"], ["ListenerUp", "ListenerUpType"], ["ListenerView", "ListenerViewType"]].forEach(function(m) {
          var y = m[0], P = s[y], E = s[m[1]];
          if (typeof P < "u") {
            switch (E) {
              case "cartesian":
                h = [{ name: "Type", value: ["cartesian"] }, { name: "Units", value: ["metre, metre, metre"] }];
                break;
              case "spherical":
                h = [{ name: "Type", value: ["spherical"] }, { name: "Units", value: ["degree, degree, metre"] }];
                break;
              default:
                throw new Error("Unknown coordinate system type " + (E + " for " + P));
            }
            u.leaves.push({
              name: y,
              type: w,
              attributes: h,
              shape: [1, 3],
              data: [P]
            });
          }
        }), typeof s.SourcePosition < "u") {
          switch (s.SourcePositionType) {
            case "cartesian":
              h = [{ name: "Type", value: ["cartesian"] }, { name: "Units", value: ["metre, metre, metre"] }];
              break;
            case "spherical":
              h = [{ name: "Type", value: ["spherical"] }, { name: "Units", value: ["degree, degree, metre"] }];
              break;
            default:
              throw new Error("Unknown coordinate system type " + ("" + s.SourcePositionType));
          }
          u.leaves.push({
            name: "SourcePosition",
            type: w,
            attributes: h,
            shape: [s.SourcePosition.length, s.SourcePosition[0].length],
            data: s.SourcePosition
          });
        }
        if (typeof s.DataSamplingRate < "u")
          u.leaves.push({
            name: "Data.SamplingRate",
            type: w,
            attributes: [{ name: "Unit", value: "hertz" }],
            shape: [1],
            data: [s.DataSamplingRate]
          });
        else
          throw new Error("No data sampling-rate");
        if (typeof s.DataDelay < "u" && u.leaves.push({
          name: "Data.Delay",
          type: w,
          attributes: [],
          shape: [1, s.DataDelay.length],
          data: s.DataDelay
        }), typeof s.DataIR < "u")
          u.leaves.push({
            name: "Data.IR",
            type: w,
            attributes: [],
            shape: [s.DataIR.length, s.DataIR[0].length, s.DataIR[0][0].length],
            data: s.DataIR
          });
        else
          throw new Error("No data IR");
        return typeof s.RoomVolume < "u" && u.leaves.push({
          name: "RoomVolume",
          type: w,
          attributes: [{ name: "Units", value: ["cubic metre"] }],
          shape: [1],
          data: [s.RoomVolume]
        }), u.nodes = [], JSON.stringify(u);
      }
      function i(s) {
        var u = void 0;
        switch (s) {
          case "cartesian":
            u = "sofaCartesian";
            break;
          case "spherical":
            u = "sofaSpherical";
            break;
          default:
            throw new Error("Bad SOFA type " + s);
        }
        return u;
      }
      f.default = {
        parseSofa: a,
        conformSofaCoordinateSystem: i
      };
    }, {}], 21: [function(t, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      });
      /**
       * @fileOverview Simple XML parser, as a DOM parser.
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var a = f.parseXml = void 0;
      if (typeof window.DOMParser < "u")
        f.parseXml = a = function(i) {
          return new window.DOMParser().parseFromString(i, "text/xml");
        };
      else if (typeof window.ActiveXObject < "u" && new window.ActiveXObject("Microsoft.XMLDOM"))
        f.parseXml = a = function(i) {
          var s = new window.ActiveXObject("Microsoft.XMLDOM");
          return s.async = "false", s.loadXML(i), s;
        };
      else
        throw new Error("No XML parser found");
      f.default = a;
    }, {}] }, {}, [15])(15);
  });
})(serveSofaHrir);
async function decodeBinaural(D, c) {
  const t = D.sampleRate;
  if (t !== c.sampleRate)
    throw new Error(
      `Sample rate mismatch: ambisonic IR is ${t} Hz but HRTF filters are ${c.sampleRate} Hz`
    );
  const n = Math.min(D.numberOfChannels, c.channelCount);
  if (n === 0)
    throw new Error("No channels to decode");
  const f = D.length + c.filterLength - 1, a = new OfflineAudioContext(2, f, t);
  for (let i = 0; i < n; i++) {
    const s = a.createBuffer(1, D.length, t);
    s.copyToChannel(D.getChannelData(i), 0);
    const u = a.createBufferSource();
    u.buffer = s;
    const o = a.createBuffer(2, c.filterLength, t);
    o.copyToChannel(new Float32Array(c.filtersLeft[i]), 0), o.copyToChannel(new Float32Array(c.filtersRight[i]), 1);
    const v = a.createConvolver();
    v.normalize = !1, v.buffer = o, u.connect(v), v.connect(a.destination), u.start(0);
  }
  return {
    buffer: await a.startRendering(),
    sampleRate: t
  };
}
function rotateAmbisonicIR(D, c, t, n) {
  if (c === 0 && t === 0 && n === 0)
    return D;
  const f = D.numberOfChannels, a = D.length, r = D.sampleRate;
  if (f < 4)
    throw new Error("Ambisonic rotation requires at least 4 channels (first order)");
  const i = c * Math.PI / 180, s = t * Math.PI / 180, u = n * Math.PI / 180, o = Math.cos(i), v = Math.sin(i), w = Math.cos(s), h = Math.sin(s), m = Math.cos(u), y = Math.sin(u), P = o * m + v * h * y, E = -o * y + v * h * m, z = v * w, g = w * y, d = w * m, R = -h, L = -v * m + o * h * y, F = v * y + o * h * m, l = o * w, O = new OfflineAudioContext(f, a, r).createBuffer(f, a, r);
  O.copyToChannel(D.getChannelData(0), 0);
  const j = D.getChannelData(1), Y = D.getChannelData(2), W = D.getChannelData(3), er = new Float32Array(a), mr = new Float32Array(a), yr = new Float32Array(a);
  for (let or = 0; or < a; or++) {
    const V = j[or], _ = Y[or], I = W[or];
    er[or] = P * V + E * _ + z * I, mr[or] = g * V + d * _ + R * I, yr[or] = L * V + F * _ + l * I;
  }
  O.copyToChannel(er, 1), O.copyToChannel(mr, 2), O.copyToChannel(yr, 3);
  for (let or = 4; or < f; or++)
    O.copyToChannel(D.getChannelData(or), or);
  return O;
}
async function calculateBinauralFromAmbisonic(D) {
  const { ambisonicImpulseResponse: c, order: t, hrtfSubjectId: n, headYaw: f, headPitch: a, headRoll: r } = D;
  let i = c;
  (f !== 0 || a !== 0 || r !== 0) && (i = rotateAmbisonicIR(i, f, a, r));
  const s = await loadDecoderFilters(n, t);
  return (await decodeBinaural(i, s)).buffer;
}
export {
  calculateBinauralFromAmbisonic as c,
  encodeBufferFromDirection as e,
  getAmbisonicChannelCount as g
};
//# sourceMappingURL=calculate-binaural-z75egsJs.mjs.map
