import { B as lerp, C as loadDecoderFilters, D as numbersEqualWithinTolerence, S as Surface } from "./index-DDGfegRq.mjs";
import * as THREE from "three";
import { a as airAttenuation } from "./air-attenuation-CBIk1QMo.mjs";
import { s as soundSpeed } from "./sound-speed-Biev-mJ1.mjs";
function sum(_) {
  return _.reduce((s, f) => s + f);
}
function db_add(_) {
  let s = sum(_.map((f) => 10 ** (f / 10)));
  return 10 * Math.log10(s);
}
function getAmbisonicChannelCount(_) {
  return (_ + 1) * (_ + 1);
}
function degreesToRadians(_) {
  return _ * Math.PI / 180;
}
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, numeric1_2_6 = {};
(function(exports$1) {
  var numeric = exports$1;
  typeof commonjsGlobal < "u" && (commonjsGlobal.numeric = numeric), numeric.version = "1.2.6", numeric.bench = function(s, f) {
    var n, c, a, r;
    for (typeof f > "u" && (f = 15), a = 0.5, n = /* @__PURE__ */ new Date(); ; ) {
      for (a *= 2, r = a; r > 3; r -= 4)
        s(), s(), s(), s();
      for (; r > 0; )
        s(), r--;
      if (c = /* @__PURE__ */ new Date(), c - n > f) break;
    }
    for (r = a; r > 3; r -= 4)
      s(), s(), s(), s();
    for (; r > 0; )
      s(), r--;
    return c = /* @__PURE__ */ new Date(), 1e3 * (3 * a - 1) / (c - n);
  }, numeric._myIndexOf = function(s) {
    var f = this.length, n;
    for (n = 0; n < f; ++n) if (this[n] === s) return n;
    return -1;
  }, numeric.myIndexOf = Array.prototype.indexOf ? Array.prototype.indexOf : numeric._myIndexOf, numeric.Function = Function, numeric.precision = 4, numeric.largeArray = 50, numeric.prettyPrint = function(s) {
    function f(a) {
      if (a === 0)
        return "0";
      if (isNaN(a))
        return "NaN";
      if (a < 0)
        return "-" + f(-a);
      if (isFinite(a)) {
        var r = Math.floor(Math.log(a) / Math.log(10)), i = a / Math.pow(10, r), t = i.toPrecision(numeric.precision);
        return parseFloat(t) === 10 && (r++, i = 1, t = i.toPrecision(numeric.precision)), parseFloat(t).toString() + "e" + r.toString();
      }
      return "Infinity";
    }
    var n = [];
    function c(a) {
      var r;
      if (typeof a > "u")
        return n.push(Array(numeric.precision + 8).join(" ")), !1;
      if (typeof a == "string")
        return n.push('"' + a + '"'), !1;
      if (typeof a == "boolean")
        return n.push(a.toString()), !1;
      if (typeof a == "number") {
        var i = f(a), t = a.toPrecision(numeric.precision), o = parseFloat(a.toString()).toString(), u = [i, t, o, parseFloat(t).toString(), parseFloat(o).toString()];
        for (r = 1; r < u.length; r++)
          u[r].length < i.length && (i = u[r]);
        return n.push(Array(numeric.precision + 8 - i.length).join(" ") + i), !1;
      }
      if (a === null)
        return n.push("null"), !1;
      if (typeof a == "function") {
        n.push(a.toString());
        var m = !1;
        for (r in a)
          a.hasOwnProperty(r) && (m ? n.push(`,
`) : n.push(`
{`), m = !0, n.push(r), n.push(`: 
`), c(a[r]));
        return m && n.push(`}
`), !0;
      }
      if (a instanceof Array) {
        if (a.length > numeric.largeArray)
          return n.push("...Large Array..."), !0;
        var m = !1;
        for (n.push("["), r = 0; r < a.length; r++)
          r > 0 && (n.push(","), m && n.push(`
 `)), m = c(a[r]);
        return n.push("]"), !0;
      }
      n.push("{");
      var m = !1;
      for (r in a)
        a.hasOwnProperty(r) && (m && n.push(`,
`), m = !0, n.push(r), n.push(`: 
`), c(a[r]));
      return n.push("}"), !0;
    }
    return c(s), n.join("");
  }, numeric.parseDate = function(s) {
    function f(n) {
      if (typeof n == "string")
        return Date.parse(n.replace(/-/g, "/"));
      if (!(n instanceof Array))
        throw new Error("parseDate: parameter must be arrays of strings");
      var c = [], a;
      for (a = 0; a < n.length; a++)
        c[a] = f(n[a]);
      return c;
    }
    return f(s);
  }, numeric.parseFloat = function(s) {
    function f(n) {
      if (typeof n == "string")
        return parseFloat(n);
      if (!(n instanceof Array))
        throw new Error("parseFloat: parameter must be arrays of strings");
      var c = [], a;
      for (a = 0; a < n.length; a++)
        c[a] = f(n[a]);
      return c;
    }
    return f(s);
  }, numeric.parseCSV = function(s) {
    var f = s.split(`
`), n, c, a = [], r = /(([^'",]*)|('[^']*')|("[^"]*")),/g, i = /^\s*(([+-]?[0-9]+(\.[0-9]*)?(e[+-]?[0-9]+)?)|([+-]?[0-9]*(\.[0-9]+)?(e[+-]?[0-9]+)?))\s*$/, t = function(w) {
      return w.substr(0, w.length - 1);
    }, o = 0;
    for (c = 0; c < f.length; c++) {
      var u = (f[c] + ",").match(r), m;
      if (u.length > 0) {
        for (a[o] = [], n = 0; n < u.length; n++)
          m = t(u[n]), i.test(m) ? a[o][n] = parseFloat(m) : a[o][n] = m;
        o++;
      }
    }
    return a;
  }, numeric.toCSV = function(s) {
    var f = numeric.dim(s), n, c, a, r, i;
    for (a = f[0], f[1], i = [], n = 0; n < a; n++) {
      for (r = [], c = 0; c < a; c++)
        r[c] = s[n][c].toString();
      i[n] = r.join(", ");
    }
    return i.join(`
`) + `
`;
  }, numeric.getURL = function(s) {
    var f = new XMLHttpRequest();
    return f.open("GET", s, !1), f.send(), f;
  }, numeric.imageURL = function(s) {
    function f(E) {
      var j = E.length, g, d, R, L, z, l, S, I, O = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", U = "";
      for (g = 0; g < j; g += 3)
        d = E[g], R = E[g + 1], L = E[g + 2], z = d >> 2, l = ((d & 3) << 4) + (R >> 4), S = ((R & 15) << 2) + (L >> 6), I = L & 63, g + 1 >= j ? S = I = 64 : g + 2 >= j && (I = 64), U += O.charAt(z) + O.charAt(l) + O.charAt(S) + O.charAt(I);
      return U;
    }
    function n(E, j, g) {
      typeof j > "u" && (j = 0), typeof g > "u" && (g = E.length);
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
      var z;
      for (z = j; z < g; z++)
        L = (R ^ E[z]) & 255, R = R >>> 8 ^ d[L];
      return R ^ -1;
    }
    var c = s[0].length, a = s[0][0].length, r, i, t, o, u, m, w, v, h, y, b = [
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
      c >> 24 & 255,
      c >> 16 & 255,
      c >> 8 & 255,
      c & 255,
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
    for (y = n(b, 12, 29), b[29] = y >> 24 & 255, b[30] = y >> 16 & 255, b[31] = y >> 8 & 255, b[32] = y & 255, r = 1, i = 0, w = 0; w < c; w++) {
      for (w < c - 1 ? b.push(0) : b.push(1), u = 3 * a + 1 + (w === 0) & 255, m = 3 * a + 1 + (w === 0) >> 8 & 255, b.push(u), b.push(m), b.push(~u & 255), b.push(~m & 255), w === 0 && b.push(0), v = 0; v < a; v++)
        for (t = 0; t < 3; t++)
          u = s[t][w][v], u > 255 ? u = 255 : u < 0 ? u = 0 : u = Math.round(u), r = (r + u) % 65521, i = (i + r) % 65521, b.push(u);
      b.push(0);
    }
    return h = (i << 16) + r, b.push(h >> 24 & 255), b.push(h >> 16 & 255), b.push(h >> 8 & 255), b.push(h & 255), o = b.length - 41, b[33] = o >> 24 & 255, b[34] = o >> 16 & 255, b[35] = o >> 8 & 255, b[36] = o & 255, y = n(b, 37), b.push(y >> 24 & 255), b.push(y >> 16 & 255), b.push(y >> 8 & 255), b.push(y & 255), b.push(0), b.push(0), b.push(0), b.push(0), b.push(73), b.push(69), b.push(78), b.push(68), b.push(174), b.push(66), b.push(96), b.push(130), "data:image/png;base64," + f(b);
  }, numeric._dim = function(s) {
    for (var f = []; typeof s == "object"; )
      f.push(s.length), s = s[0];
    return f;
  }, numeric.dim = function(s) {
    var f, n;
    return typeof s == "object" ? (f = s[0], typeof f == "object" ? (n = f[0], typeof n == "object" ? numeric._dim(s) : [s.length, f.length]) : [s.length]) : [];
  }, numeric.mapreduce = function(s, f) {
    return Function(
      "x",
      "accum",
      "_s",
      "_k",
      'if(typeof accum === "undefined") accum = ' + f + `;
if(typeof x === "number") { var xi = x; ` + s + `; return accum; }
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
    ` + s + `;
    xi = x[i-1];
    ` + s + `;
}
if(i === 0) {
    xi = x[i];
    ` + s + `
}
return accum;`
    );
  }, numeric.mapreduce2 = function(s, f) {
    return Function(
      "x",
      `var n = x.length;
var i,xi;
` + f + `;
for(i=n-1;i!==-1;--i) { 
    xi = x[i];
    ` + s + `;
}
return accum;`
    );
  }, numeric.same = function _(s, f) {
    var n, c;
    if (!(s instanceof Array) || !(f instanceof Array) || (c = s.length, c !== f.length))
      return !1;
    for (n = 0; n < c; n++)
      if (s[n] !== f[n])
        if (typeof s[n] == "object") {
          if (!_(s[n], f[n])) return !1;
        } else
          return !1;
    return !0;
  }, numeric.rep = function(s, f, n) {
    typeof n > "u" && (n = 0);
    var c = s[n], a = Array(c), r;
    if (n === s.length - 1) {
      for (r = c - 2; r >= 0; r -= 2)
        a[r + 1] = f, a[r] = f;
      return r === -1 && (a[0] = f), a;
    }
    for (r = c - 1; r >= 0; r--)
      a[r] = numeric.rep(s, f, n + 1);
    return a;
  }, numeric.dotMMsmall = function(s, f) {
    var n, c, a, r, i, t, o, u, m, w, v;
    for (r = s.length, i = f.length, t = f[0].length, o = Array(r), n = r - 1; n >= 0; n--) {
      for (u = Array(t), m = s[n], a = t - 1; a >= 0; a--) {
        for (w = m[i - 1] * f[i - 1][a], c = i - 2; c >= 1; c -= 2)
          v = c - 1, w += m[c] * f[c][a] + m[v] * f[v][a];
        c === 0 && (w += m[0] * f[0][a]), u[a] = w;
      }
      o[n] = u;
    }
    return o;
  }, numeric._getCol = function(s, f, n) {
    var c = s.length, a;
    for (a = c - 1; a > 0; --a)
      n[a] = s[a][f], --a, n[a] = s[a][f];
    a === 0 && (n[0] = s[0][f]);
  }, numeric.dotMMbig = function(s, f) {
    var n = numeric._getCol, c = f.length, a = Array(c), r = s.length, i = f[0].length, t = new Array(r), o, u = numeric.dotVV, m, w;
    for (--c, --r, m = r; m !== -1; --m) t[m] = Array(i);
    for (--i, m = i; m !== -1; --m)
      for (n(f, m, a), w = r; w !== -1; --w)
        o = s[w], t[w][m] = u(o, a);
    return t;
  }, numeric.dotMV = function(s, f) {
    var n = s.length;
    f.length;
    var c, a = Array(n), r = numeric.dotVV;
    for (c = n - 1; c >= 0; c--)
      a[c] = r(s[c], f);
    return a;
  }, numeric.dotVM = function(s, f) {
    var n, c, a, r, i, t, o;
    for (a = s.length, r = f[0].length, i = Array(r), c = r - 1; c >= 0; c--) {
      for (t = s[a - 1] * f[a - 1][c], n = a - 2; n >= 1; n -= 2)
        o = n - 1, t += s[n] * f[n][c] + s[o] * f[o][c];
      n === 0 && (t += s[0] * f[0][c]), i[c] = t;
    }
    return i;
  }, numeric.dotVV = function(s, f) {
    var n, c = s.length, a, r = s[c - 1] * f[c - 1];
    for (n = c - 2; n >= 1; n -= 2)
      a = n - 1, r += s[n] * f[n] + s[a] * f[a];
    return n === 0 && (r += s[0] * f[0]), r;
  }, numeric.dot = function(s, f) {
    var n = numeric.dim;
    switch (n(s).length * 1e3 + n(f).length) {
      case 2002:
        return f.length < 10 ? numeric.dotMMsmall(s, f) : numeric.dotMMbig(s, f);
      case 2001:
        return numeric.dotMV(s, f);
      case 1002:
        return numeric.dotVM(s, f);
      case 1001:
        return numeric.dotVV(s, f);
      case 1e3:
        return numeric.mulVS(s, f);
      case 1:
        return numeric.mulSV(s, f);
      case 0:
        return s * f;
      default:
        throw new Error("numeric.dot only works on vectors and matrices");
    }
  }, numeric.diag = function(s) {
    var f, n, c, a = s.length, r = Array(a), i;
    for (f = a - 1; f >= 0; f--) {
      for (i = Array(a), n = f + 2, c = a - 1; c >= n; c -= 2)
        i[c] = 0, i[c - 1] = 0;
      for (c > f && (i[c] = 0), i[f] = s[f], c = f - 1; c >= 1; c -= 2)
        i[c] = 0, i[c - 1] = 0;
      c === 0 && (i[0] = 0), r[f] = i;
    }
    return r;
  }, numeric.getDiag = function(_) {
    var s = Math.min(_.length, _[0].length), f, n = Array(s);
    for (f = s - 1; f >= 1; --f)
      n[f] = _[f][f], --f, n[f] = _[f][f];
    return f === 0 && (n[0] = _[0][0]), n;
  }, numeric.identity = function(s) {
    return numeric.diag(numeric.rep([s], 1));
  }, numeric.pointwise = function(s, f, n) {
    typeof n > "u" && (n = "");
    var c = [], a, r = /\[i\]$/, i, t = "", o = !1;
    for (a = 0; a < s.length; a++)
      r.test(s[a]) ? (i = s[a].substring(0, s[a].length - 3), t = i) : i = s[a], i === "ret" && (o = !0), c.push(i);
    return c[s.length] = "_s", c[s.length + 1] = "_k", c[s.length + 2] = 'if(typeof _s === "undefined") _s = numeric.dim(' + t + `);
if(typeof _k === "undefined") _k = 0;
var _n = _s[_k];
var i` + (o ? "" : ", ret = Array(_n)") + `;
if(_k < _s.length-1) {
    for(i=_n-1;i>=0;i--) ret[i] = arguments.callee(` + s.join(",") + `,_s,_k+1);
    return ret;
}
` + n + `
for(i=_n-1;i!==-1;--i) {
    ` + f + `
}
return ret;`, Function.apply(null, c);
  }, numeric.pointwise2 = function(s, f, n) {
    typeof n > "u" && (n = "");
    var c = [], a, r = /\[i\]$/, i, t = "", o = !1;
    for (a = 0; a < s.length; a++)
      r.test(s[a]) ? (i = s[a].substring(0, s[a].length - 3), t = i) : i = s[a], i === "ret" && (o = !0), c.push(i);
    return c[s.length] = "var _n = " + t + `.length;
var i` + (o ? "" : ", ret = Array(_n)") + `;
` + n + `
for(i=_n-1;i!==-1;--i) {
` + f + `
}
return ret;`, Function.apply(null, c);
  }, numeric._biforeach = function _(s, f, n, c, a) {
    if (c === n.length - 1) {
      a(s, f);
      return;
    }
    var r, i = n[c];
    for (r = i - 1; r >= 0; r--)
      _(typeof s == "object" ? s[r] : s, typeof f == "object" ? f[r] : f, n, c + 1, a);
  }, numeric._biforeach2 = function _(s, f, n, c, a) {
    if (c === n.length - 1)
      return a(s, f);
    var r, i = n[c], t = Array(i);
    for (r = i - 1; r >= 0; --r)
      t[r] = _(typeof s == "object" ? s[r] : s, typeof f == "object" ? f[r] : f, n, c + 1, a);
    return t;
  }, numeric._foreach = function _(s, f, n, c) {
    if (n === f.length - 1) {
      c(s);
      return;
    }
    var a, r = f[n];
    for (a = r - 1; a >= 0; a--)
      _(s[a], f, n + 1, c);
  }, numeric._foreach2 = function _(s, f, n, c) {
    if (n === f.length - 1)
      return c(s);
    var a, r = f[n], i = Array(r);
    for (a = r - 1; a >= 0; a--)
      i[a] = _(s[a], f, n + 1, c);
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
    var _, s;
    for (_ = 0; _ < numeric.mathfuns2.length; ++_)
      s = numeric.mathfuns2[_], numeric.ops2[s] = s;
    for (_ in numeric.ops2)
      if (numeric.ops2.hasOwnProperty(_)) {
        s = numeric.ops2[_];
        var f, n, c = "";
        numeric.myIndexOf.call(numeric.mathfuns2, _) !== -1 ? (c = "var " + s + " = Math." + s + `;
`, f = function(a, r, i) {
          return a + " = " + s + "(" + r + "," + i + ")";
        }, n = function(a, r) {
          return a + " = " + s + "(" + a + "," + r + ")";
        }) : (f = function(a, r, i) {
          return a + " = " + r + " " + s + " " + i;
        }, numeric.opseq.hasOwnProperty(_ + "eq") ? n = function(a, r) {
          return a + " " + s + "= " + r;
        } : n = function(a, r) {
          return a + " = " + a + " " + s + " " + r;
        }), numeric[_ + "VV"] = numeric.pointwise2(["x[i]", "y[i]"], f("ret[i]", "x[i]", "y[i]"), c), numeric[_ + "SV"] = numeric.pointwise2(["x", "y[i]"], f("ret[i]", "x", "y[i]"), c), numeric[_ + "VS"] = numeric.pointwise2(["x[i]", "y"], f("ret[i]", "x[i]", "y"), c), numeric[_] = Function(
          `var n = arguments.length, i, x = arguments[0], y;
var VV = numeric.` + _ + "VV, VS = numeric." + _ + "VS, SV = numeric." + _ + `SV;
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
        ), numeric[s] = numeric[_], numeric[_ + "eqV"] = numeric.pointwise2(["ret[i]", "x[i]"], n("ret[i]", "x[i]"), c), numeric[_ + "eqS"] = numeric.pointwise2(["ret[i]", "x"], n("ret[i]", "x"), c), numeric[_ + "eq"] = Function(
          `var n = arguments.length, i, x = arguments[0], y;
var V = numeric.` + _ + "eqV, S = numeric." + _ + `eqS
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
    for (_ = 0; _ < numeric.mathfuns2.length; ++_)
      s = numeric.mathfuns2[_], delete numeric.ops2[s];
    for (_ = 0; _ < numeric.mathfuns.length; ++_)
      s = numeric.mathfuns[_], numeric.ops1[s] = s;
    for (_ in numeric.ops1)
      numeric.ops1.hasOwnProperty(_) && (c = "", s = numeric.ops1[_], numeric.myIndexOf.call(numeric.mathfuns, _) !== -1 && Math.hasOwnProperty(s) && (c = "var " + s + " = Math." + s + `;
`), numeric[_ + "eqV"] = numeric.pointwise2(["ret[i]"], "ret[i] = " + s + "(ret[i]);", c), numeric[_ + "eq"] = Function(
        "x",
        'if(typeof x !== "object") return ' + s + `x
var i;
var V = numeric.` + _ + `eqV;
var s = numeric.dim(x);
numeric._foreach(x,s,0,V);
return x;
`
      ), numeric[_ + "V"] = numeric.pointwise2(["x[i]"], "ret[i] = " + s + "(x[i]);", c), numeric[_] = Function(
        "x",
        'if(typeof x !== "object") return ' + s + `(x)
var i;
var V = numeric.` + _ + `V;
var s = numeric.dim(x);
return numeric._foreach2(x,s,0,V);
`
      ));
    for (_ = 0; _ < numeric.mathfuns.length; ++_)
      s = numeric.mathfuns[_], delete numeric.ops1[s];
    for (_ in numeric.mapreducers)
      numeric.mapreducers.hasOwnProperty(_) && (s = numeric.mapreducers[_], numeric[_ + "V"] = numeric.mapreduce2(s[0], s[1]), numeric[_] = Function(
        "x",
        "s",
        "k",
        s[1] + `if(typeof x !== "object") {    xi = x;
` + s[0] + `;
    return accum;
}if(typeof s === "undefined") s = numeric.dim(x);
if(typeof k === "undefined") k = 0;
if(k === s.length-1) return numeric.` + _ + `V(x);
var xi;
var n = x.length, i;
for(i=n-1;i!==-1;--i) {
   xi = arguments.callee(x[i]);
` + s[0] + `;
}
return accum;
`
      ));
  })(), numeric.truncVV = numeric.pointwise(["x[i]", "y[i]"], "ret[i] = round(x[i]/y[i])*y[i];", "var round = Math.round;"), numeric.truncVS = numeric.pointwise(["x[i]", "y"], "ret[i] = round(x[i]/y)*y;", "var round = Math.round;"), numeric.truncSV = numeric.pointwise(["x", "y[i]"], "ret[i] = round(x/y[i])*y[i];", "var round = Math.round;"), numeric.trunc = function(s, f) {
    return typeof s == "object" ? typeof f == "object" ? numeric.truncVV(s, f) : numeric.truncVS(s, f) : typeof f == "object" ? numeric.truncSV(s, f) : Math.round(s / f) * f;
  }, numeric.inv = function(y) {
    var f = numeric.dim(y), n = Math.abs, c = f[0], a = f[1], r = numeric.clone(y), i, t, o = numeric.identity(c), u, m, w, v, h, y;
    for (v = 0; v < a; ++v) {
      var b = -1, E = -1;
      for (w = v; w !== c; ++w)
        h = n(r[w][v]), h > E && (b = w, E = h);
      for (t = r[b], r[b] = r[v], r[v] = t, m = o[b], o[b] = o[v], o[v] = m, y = t[v], h = v; h !== a; ++h) t[h] /= y;
      for (h = a - 1; h !== -1; --h) m[h] /= y;
      for (w = c - 1; w !== -1; --w)
        if (w !== v) {
          for (i = r[w], u = o[w], y = i[v], h = v + 1; h !== a; ++h) i[h] -= t[h] * y;
          for (h = a - 1; h > 0; --h)
            u[h] -= m[h] * y, --h, u[h] -= m[h] * y;
          h === 0 && (u[0] -= m[0] * y);
        }
    }
    return o;
  }, numeric.det = function(s) {
    var f = numeric.dim(s);
    if (f.length !== 2 || f[0] !== f[1])
      throw new Error("numeric: det() only works on square matrices");
    var n = f[0], c = 1, a, r, i, t = numeric.clone(s), o, u, m, w, v;
    for (r = 0; r < n - 1; r++) {
      for (i = r, a = r + 1; a < n; a++)
        Math.abs(t[a][r]) > Math.abs(t[i][r]) && (i = a);
      for (i !== r && (w = t[i], t[i] = t[r], t[r] = w, c *= -1), o = t[r], a = r + 1; a < n; a++) {
        for (u = t[a], m = u[r] / o[r], i = r + 1; i < n - 1; i += 2)
          v = i + 1, u[i] -= o[i] * m, u[v] -= o[v] * m;
        i !== n && (u[i] -= o[i] * m);
      }
      if (o[r] === 0)
        return 0;
      c *= o[r];
    }
    return c * t[r][r];
  }, numeric.transpose = function(s) {
    var f, n, c = s.length, a = s[0].length, r = Array(a), i, t, o;
    for (n = 0; n < a; n++) r[n] = Array(c);
    for (f = c - 1; f >= 1; f -= 2) {
      for (t = s[f], i = s[f - 1], n = a - 1; n >= 1; --n)
        o = r[n], o[f] = t[n], o[f - 1] = i[n], --n, o = r[n], o[f] = t[n], o[f - 1] = i[n];
      n === 0 && (o = r[0], o[f] = t[0], o[f - 1] = i[0]);
    }
    if (f === 0) {
      for (i = s[0], n = a - 1; n >= 1; --n)
        r[n][0] = i[n], --n, r[n][0] = i[n];
      n === 0 && (r[0][0] = i[0]);
    }
    return r;
  }, numeric.negtranspose = function(s) {
    var f, n, c = s.length, a = s[0].length, r = Array(a), i, t, o;
    for (n = 0; n < a; n++) r[n] = Array(c);
    for (f = c - 1; f >= 1; f -= 2) {
      for (t = s[f], i = s[f - 1], n = a - 1; n >= 1; --n)
        o = r[n], o[f] = -t[n], o[f - 1] = -i[n], --n, o = r[n], o[f] = -t[n], o[f - 1] = -i[n];
      n === 0 && (o = r[0], o[f] = -t[0], o[f - 1] = -i[0]);
    }
    if (f === 0) {
      for (i = s[0], n = a - 1; n >= 1; --n)
        r[n][0] = -i[n], --n, r[n][0] = -i[n];
      n === 0 && (r[0][0] = -i[0]);
    }
    return r;
  }, numeric._random = function _(s, f) {
    var n, c = s[f], a = Array(c), r;
    if (f === s.length - 1) {
      for (r = Math.random, n = c - 1; n >= 1; n -= 2)
        a[n] = r(), a[n - 1] = r();
      return n === 0 && (a[0] = r()), a;
    }
    for (n = c - 1; n >= 0; n--) a[n] = _(s, f + 1);
    return a;
  }, numeric.random = function(s) {
    return numeric._random(s, 0);
  }, numeric.norm2 = function(s) {
    return Math.sqrt(numeric.norm2Squared(s));
  }, numeric.linspace = function(s, f, n) {
    if (typeof n > "u" && (n = Math.max(Math.round(f - s) + 1, 1)), n < 2)
      return n === 1 ? [s] : [];
    var c, a = Array(n);
    for (n--, c = n; c >= 0; c--)
      a[c] = (c * f + (n - c) * s) / n;
    return a;
  }, numeric.getBlock = function(s, f, n) {
    var c = numeric.dim(s);
    function a(r, i) {
      var t, o = f[i], u = n[i] - o, m = Array(u);
      if (i === c.length - 1) {
        for (t = u; t >= 0; t--)
          m[t] = r[t + o];
        return m;
      }
      for (t = u; t >= 0; t--)
        m[t] = a(r[t + o], i + 1);
      return m;
    }
    return a(s, 0);
  }, numeric.setBlock = function(s, f, n, c) {
    var a = numeric.dim(s);
    function r(i, t, o) {
      var u, m = f[o], w = n[o] - m;
      if (o === a.length - 1)
        for (u = w; u >= 0; u--)
          i[u + m] = t[u];
      for (u = w; u >= 0; u--)
        r(i[u + m], t[u], o + 1);
    }
    return r(s, c, 0), s;
  }, numeric.getRange = function(s, f, n) {
    var c = f.length, a = n.length, r, i, t = Array(c), o, u;
    for (r = c - 1; r !== -1; --r)
      for (t[r] = Array(a), o = t[r], u = s[f[r]], i = a - 1; i !== -1; --i) o[i] = u[n[i]];
    return t;
  }, numeric.blockMatrix = function(s) {
    var f = numeric.dim(s);
    if (f.length < 4) return numeric.blockMatrix([s]);
    var n = f[0], c = f[1], a, r, i, t, o;
    for (a = 0, r = 0, i = 0; i < n; ++i) a += s[i][0].length;
    for (t = 0; t < c; ++t) r += s[0][t][0].length;
    var u = Array(a);
    for (i = 0; i < a; ++i) u[i] = Array(r);
    var m = 0, w, v, h, y, b;
    for (i = 0; i < n; ++i) {
      for (w = r, t = c - 1; t !== -1; --t)
        for (o = s[i][t], w -= o[0].length, h = o.length - 1; h !== -1; --h)
          for (b = o[h], v = u[m + h], y = b.length - 1; y !== -1; --y) v[w + y] = b[y];
      m += s[i][0].length;
    }
    return u;
  }, numeric.tensor = function(s, f) {
    if (typeof s == "number" || typeof f == "number") return numeric.mul(s, f);
    var n = numeric.dim(s), c = numeric.dim(f);
    if (n.length !== 1 || c.length !== 1)
      throw new Error("numeric: tensor product is only defined for vectors");
    var a = n[0], r = c[0], i = Array(a), t, o, u, m;
    for (o = a - 1; o >= 0; o--) {
      for (t = Array(r), m = s[o], u = r - 1; u >= 3; --u)
        t[u] = m * f[u], --u, t[u] = m * f[u], --u, t[u] = m * f[u], --u, t[u] = m * f[u];
      for (; u >= 0; )
        t[u] = m * f[u], --u;
      i[o] = t;
    }
    return i;
  }, numeric.T = function(s, f) {
    this.x = s, this.y = f;
  }, numeric.t = function(s, f) {
    return new numeric.T(s, f);
  }, numeric.Tbinop = function(s, f, n, c, a) {
    if (numeric.indexOf, typeof a != "string") {
      var r;
      a = "";
      for (r in numeric)
        numeric.hasOwnProperty(r) && (s.indexOf(r) >= 0 || f.indexOf(r) >= 0 || n.indexOf(r) >= 0 || c.indexOf(r) >= 0) && r.length > 1 && (a += "var " + r + " = numeric." + r + `;
`);
    }
    return Function(
      ["y"],
      `var x = this;
if(!(y instanceof numeric.T)) { y = new numeric.T(y); }
` + a + `
if(x.y) {  if(y.y) {    return new numeric.T(` + c + `);
  }
  return new numeric.T(` + n + `);
}
if(y.y) {
  return new numeric.T(` + f + `);
}
return new numeric.T(` + s + `);
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
    var s = numeric.mul, f = numeric.div;
    if (this.y) {
      var n = numeric.add(s(this.x, this.x), s(this.y, this.y));
      return new numeric.T(f(this.x, n), f(numeric.neg(this.y), n));
    }
    return new T(f(1, this.x));
  }, numeric.T.prototype.div = function(s) {
    if (s instanceof numeric.T || (s = new numeric.T(s)), s.y)
      return this.mul(s.reciprocal());
    var f = numeric.div;
    return this.y ? new numeric.T(f(this.x, s.x), f(this.y, s.x)) : new numeric.T(f(this.x, s.x));
  }, numeric.T.prototype.dot = numeric.Tbinop(
    "dot(x.x,y.x)",
    "dot(x.x,y.x),dot(x.x,y.y)",
    "dot(x.x,y.x),dot(x.y,y.x)",
    "sub(dot(x.x,y.x),dot(x.y,y.y)),add(dot(x.x,y.y),dot(x.y,y.x))"
  ), numeric.T.prototype.transpose = function() {
    var s = numeric.transpose, f = this.x, n = this.y;
    return n ? new numeric.T(s(f), s(n)) : new numeric.T(s(f));
  }, numeric.T.prototype.transjugate = function() {
    var s = numeric.transpose, f = this.x, n = this.y;
    return n ? new numeric.T(s(f), numeric.negtranspose(n)) : new numeric.T(s(f));
  }, numeric.Tunop = function(s, f, n) {
    return typeof n != "string" && (n = ""), Function(
      `var x = this;
` + n + `
if(x.y) {  ` + f + `;
}
` + s + `;
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
    var s = this;
    if (typeof s.y > "u")
      return new numeric.T(numeric.inv(s.x));
    var f = s.x.length, y, b, E, n = numeric.identity(f), c = numeric.rep([f, f], 0), a = numeric.clone(s.x), r = numeric.clone(s.y), i, t, o, u, m, w, v, h, y, b, E, j, g, d, R, L, z, l;
    for (y = 0; y < f; y++) {
      for (d = a[y][y], R = r[y][y], j = d * d + R * R, E = y, b = y + 1; b < f; b++)
        d = a[b][y], R = r[b][y], g = d * d + R * R, g > j && (E = b, j = g);
      for (E !== y && (l = a[y], a[y] = a[E], a[E] = l, l = r[y], r[y] = r[E], r[E] = l, l = n[y], n[y] = n[E], n[E] = l, l = c[y], c[y] = c[E], c[E] = l), i = a[y], t = r[y], m = n[y], w = c[y], d = i[y], R = t[y], b = y + 1; b < f; b++)
        L = i[b], z = t[b], i[b] = (L * d + z * R) / j, t[b] = (z * d - L * R) / j;
      for (b = 0; b < f; b++)
        L = m[b], z = w[b], m[b] = (L * d + z * R) / j, w[b] = (z * d - L * R) / j;
      for (b = y + 1; b < f; b++) {
        for (o = a[b], u = r[b], v = n[b], h = c[b], d = o[y], R = u[y], E = y + 1; E < f; E++)
          L = i[E], z = t[E], o[E] -= L * d - z * R, u[E] -= z * d + L * R;
        for (E = 0; E < f; E++)
          L = m[E], z = w[E], v[E] -= L * d - z * R, h[E] -= z * d + L * R;
      }
    }
    for (y = f - 1; y > 0; y--)
      for (m = n[y], w = c[y], b = y - 1; b >= 0; b--)
        for (v = n[b], h = c[b], d = a[b][y], R = r[b][y], E = f - 1; E >= 0; E--)
          L = m[E], z = w[E], v[E] -= d * L - R * z, h[E] -= d * z + R * L;
    return new numeric.T(n, c);
  }, numeric.T.prototype.get = function(s) {
    var f = this.x, n = this.y, c = 0, a, r = s.length;
    if (n) {
      for (; c < r; )
        a = s[c], f = f[a], n = n[a], c++;
      return new numeric.T(f, n);
    }
    for (; c < r; )
      a = s[c], f = f[a], c++;
    return new numeric.T(f);
  }, numeric.T.prototype.set = function(s, f) {
    var n = this.x, c = this.y, a = 0, r, i = s.length, t = f.x, o = f.y;
    if (i === 0)
      return o ? this.y = o : c && (this.y = void 0), this.x = n, this;
    if (o) {
      for (c || (c = numeric.rep(numeric.dim(n), 0), this.y = c); a < i - 1; )
        r = s[a], n = n[r], c = c[r], a++;
      return r = s[a], n[r] = t, c[r] = o, this;
    }
    if (c) {
      for (; a < i - 1; )
        r = s[a], n = n[r], c = c[r], a++;
      return r = s[a], n[r] = t, t instanceof Array ? c[r] = numeric.rep(numeric.dim(t), 0) : c[r] = 0, this;
    }
    for (; a < i - 1; )
      r = s[a], n = n[r], a++;
    return r = s[a], n[r] = t, this;
  }, numeric.T.prototype.getRows = function(s, f) {
    var n = f - s + 1, c, a = Array(n), r, i = this.x, t = this.y;
    for (c = s; c <= f; c++)
      a[c - s] = i[c];
    if (t) {
      for (r = Array(n), c = s; c <= f; c++)
        r[c - s] = t[c];
      return new numeric.T(a, r);
    }
    return new numeric.T(a);
  }, numeric.T.prototype.setRows = function(s, f, n) {
    var c, a = this.x, r = this.y, i = n.x, t = n.y;
    for (c = s; c <= f; c++)
      a[c] = i[c - s];
    if (t)
      for (r || (r = numeric.rep(numeric.dim(a), 0), this.y = r), c = s; c <= f; c++)
        r[c] = t[c - s];
    else if (r)
      for (c = s; c <= f; c++)
        r[c] = numeric.rep([i[c - s].length], 0);
    return this;
  }, numeric.T.prototype.getRow = function(s) {
    var f = this.x, n = this.y;
    return n ? new numeric.T(f[s], n[s]) : new numeric.T(f[s]);
  }, numeric.T.prototype.setRow = function(s, f) {
    var n = this.x, c = this.y, a = f.x, r = f.y;
    return n[s] = a, r ? (c || (c = numeric.rep(numeric.dim(n), 0), this.y = c), c[s] = r) : c && (c = numeric.rep([a.length], 0)), this;
  }, numeric.T.prototype.getBlock = function(s, f) {
    var n = this.x, c = this.y, a = numeric.getBlock;
    return c ? new numeric.T(a(n, s, f), a(c, s, f)) : new numeric.T(a(n, s, f));
  }, numeric.T.prototype.setBlock = function(s, f, n) {
    n instanceof numeric.T || (n = new numeric.T(n));
    var c = this.x, a = this.y, r = numeric.setBlock, i = n.x, t = n.y;
    if (t)
      return a || (this.y = numeric.rep(numeric.dim(this), 0), a = this.y), r(c, s, f, i), r(a, s, f, t), this;
    r(c, s, f, i), a && r(a, s, f, numeric.rep(numeric.dim(i), 0));
  }, numeric.T.rep = function(s, f) {
    var n = numeric.T;
    f instanceof n || (f = new n(f));
    var c = f.x, a = f.y, r = numeric.rep;
    return a ? new n(r(s, c), r(s, a)) : new n(r(s, c));
  }, numeric.T.diag = function(s) {
    s instanceof numeric.T || (s = new numeric.T(s));
    var f = s.x, n = s.y, c = numeric.diag;
    return n ? new numeric.T(c(f), c(n)) : new numeric.T(c(f));
  }, numeric.T.eig = function() {
    if (this.y)
      throw new Error("eig: not implemented for complex matrices.");
    return numeric.eig(this.x);
  }, numeric.T.identity = function(s) {
    return new numeric.T(numeric.identity(s));
  }, numeric.T.prototype.getDiag = function() {
    var s = numeric, f = this.x, n = this.y;
    return n ? new s.T(s.getDiag(f), s.getDiag(n)) : new s.T(s.getDiag(f));
  }, numeric.house = function(s) {
    var f = numeric.clone(s), n = s[0] >= 0 ? 1 : -1, c = n * numeric.norm2(s);
    f[0] += c;
    var a = numeric.norm2(f);
    if (a === 0)
      throw new Error("eig: internal error");
    return numeric.div(f, a);
  }, numeric.toUpperHessenberg = function(s) {
    var f = numeric.dim(s);
    if (f.length !== 2 || f[0] !== f[1])
      throw new Error("numeric: toUpperHessenberg() only works on square matrices");
    var n = f[0], c, a, r, i, t, o = numeric.clone(s), u, m, w, v, h = numeric.identity(n), y;
    for (a = 0; a < n - 2; a++) {
      for (i = Array(n - a - 1), c = a + 1; c < n; c++)
        i[c - a - 1] = o[c][a];
      if (numeric.norm2(i) > 0) {
        for (t = numeric.house(i), u = numeric.getBlock(o, [a + 1, a], [n - 1, n - 1]), m = numeric.tensor(t, numeric.dot(t, u)), c = a + 1; c < n; c++)
          for (w = o[c], v = m[c - a - 1], r = a; r < n; r++) w[r] -= 2 * v[r - a];
        for (u = numeric.getBlock(o, [0, a + 1], [n - 1, n - 1]), m = numeric.tensor(numeric.dot(u, t), t), c = 0; c < n; c++)
          for (w = o[c], v = m[c], r = a + 1; r < n; r++) w[r] -= 2 * v[r - a - 1];
        for (u = Array(n - a - 1), c = a + 1; c < n; c++) u[c - a - 1] = h[c];
        for (m = numeric.tensor(t, numeric.dot(t, u)), c = a + 1; c < n; c++)
          for (y = h[c], v = m[c - a - 1], r = 0; r < n; r++) y[r] -= 2 * v[r];
      }
    }
    return { H: o, Q: h };
  }, numeric.epsilon = 2220446049250313e-31, numeric.QRFrancis = function(_, s) {
    typeof s > "u" && (s = 1e4), _ = numeric.clone(_), numeric.clone(_);
    var f = numeric.dim(_), n = f[0], c, a, r, i, t, o, u, m, w, v = numeric.identity(n), h, y, b, E, j, g, d, R, L;
    if (n < 3)
      return { Q: v, B: [[0, n - 1]] };
    var z = numeric.epsilon;
    for (L = 0; L < s; L++) {
      for (d = 0; d < n - 1; d++)
        if (Math.abs(_[d + 1][d]) < z * (Math.abs(_[d][d]) + Math.abs(_[d + 1][d + 1]))) {
          var l = numeric.QRFrancis(numeric.getBlock(_, [0, 0], [d, d]), s), S = numeric.QRFrancis(numeric.getBlock(_, [d + 1, d + 1], [n - 1, n - 1]), s);
          for (b = Array(d + 1), g = 0; g <= d; g++)
            b[g] = v[g];
          for (E = numeric.dot(l.Q, b), g = 0; g <= d; g++)
            v[g] = E[g];
          for (b = Array(n - d - 1), g = d + 1; g < n; g++)
            b[g - d - 1] = v[g];
          for (E = numeric.dot(S.Q, b), g = d + 1; g < n; g++)
            v[g] = E[g - d - 1];
          return { Q: v, B: l.B.concat(numeric.add(S.B, d + 1)) };
        }
      if (r = _[n - 2][n - 2], i = _[n - 2][n - 1], t = _[n - 1][n - 2], o = _[n - 1][n - 1], m = r + o, u = r * o - i * t, w = numeric.getBlock(_, [0, 0], [2, 2]), m * m >= 4 * u) {
        var I, O;
        I = 0.5 * (m + Math.sqrt(m * m - 4 * u)), O = 0.5 * (m - Math.sqrt(m * m - 4 * u)), w = numeric.add(
          numeric.sub(
            numeric.dot(w, w),
            numeric.mul(w, I + O)
          ),
          numeric.diag(numeric.rep([3], I * O))
        );
      } else
        w = numeric.add(
          numeric.sub(
            numeric.dot(w, w),
            numeric.mul(w, m)
          ),
          numeric.diag(numeric.rep([3], u))
        );
      for (c = [w[0][0], w[1][0], w[2][0]], a = numeric.house(c), b = [_[0], _[1], _[2]], E = numeric.tensor(a, numeric.dot(a, b)), g = 0; g < 3; g++)
        for (y = _[g], j = E[g], R = 0; R < n; R++) y[R] -= 2 * j[R];
      for (b = numeric.getBlock(_, [0, 0], [n - 1, 2]), E = numeric.tensor(numeric.dot(b, a), a), g = 0; g < n; g++)
        for (y = _[g], j = E[g], R = 0; R < 3; R++) y[R] -= 2 * j[R];
      for (b = [v[0], v[1], v[2]], E = numeric.tensor(a, numeric.dot(a, b)), g = 0; g < 3; g++)
        for (h = v[g], j = E[g], R = 0; R < n; R++) h[R] -= 2 * j[R];
      var U;
      for (d = 0; d < n - 2; d++) {
        for (R = d; R <= d + 1; R++)
          if (Math.abs(_[R + 1][R]) < z * (Math.abs(_[R][R]) + Math.abs(_[R + 1][R + 1]))) {
            var l = numeric.QRFrancis(numeric.getBlock(_, [0, 0], [R, R]), s), S = numeric.QRFrancis(numeric.getBlock(_, [R + 1, R + 1], [n - 1, n - 1]), s);
            for (b = Array(R + 1), g = 0; g <= R; g++)
              b[g] = v[g];
            for (E = numeric.dot(l.Q, b), g = 0; g <= R; g++)
              v[g] = E[g];
            for (b = Array(n - R - 1), g = R + 1; g < n; g++)
              b[g - R - 1] = v[g];
            for (E = numeric.dot(S.Q, b), g = R + 1; g < n; g++)
              v[g] = E[g - R - 1];
            return { Q: v, B: l.B.concat(numeric.add(S.B, R + 1)) };
          }
        for (U = Math.min(n - 1, d + 3), c = Array(U - d), g = d + 1; g <= U; g++)
          c[g - d - 1] = _[g][d];
        for (a = numeric.house(c), b = numeric.getBlock(_, [d + 1, d], [U, n - 1]), E = numeric.tensor(a, numeric.dot(a, b)), g = d + 1; g <= U; g++)
          for (y = _[g], j = E[g - d - 1], R = d; R < n; R++) y[R] -= 2 * j[R - d];
        for (b = numeric.getBlock(_, [0, d + 1], [n - 1, U]), E = numeric.tensor(numeric.dot(b, a), a), g = 0; g < n; g++)
          for (y = _[g], j = E[g], R = d + 1; R <= U; R++) y[R] -= 2 * j[R - d - 1];
        for (b = Array(U - d), g = d + 1; g <= U; g++) b[g - d - 1] = v[g];
        for (E = numeric.tensor(a, numeric.dot(a, b)), g = d + 1; g <= U; g++)
          for (h = v[g], j = E[g - d - 1], R = 0; R < n; R++) h[R] -= 2 * j[R];
      }
    }
    throw new Error("numeric: eigenvalue iteration does not converge -- increase maxiter?");
  }, numeric.eig = function(s, f) {
    var n = numeric.toUpperHessenberg(s), c = numeric.QRFrancis(n.H, f), a = numeric.T, Z = s.length, r, i, t = c.B, o = numeric.dot(c.Q, numeric.dot(n.H, numeric.transpose(c.Q))), u = new a(numeric.dot(c.Q, n.Q)), m, w = t.length, v, h, y, b, E, j, g, d, R, L, z, l, S, I, O = Math.sqrt;
    for (i = 0; i < w; i++)
      if (r = t[i][0], r !== t[i][1]) {
        if (v = r + 1, h = o[r][r], y = o[r][v], b = o[v][r], E = o[v][v], y === 0 && b === 0) continue;
        j = -h - E, g = h * E - y * b, d = j * j - 4 * g, d >= 0 ? (j < 0 ? R = -0.5 * (j - O(d)) : R = -0.5 * (j + O(d)), S = (h - R) * (h - R) + y * y, I = b * b + (E - R) * (E - R), S > I ? (S = O(S), z = (h - R) / S, l = y / S) : (I = O(I), z = b / I, l = (E - R) / I), m = new a([[l, -z], [z, l]]), u.setRows(r, v, m.dot(u.getRows(r, v)))) : (R = -0.5 * j, L = 0.5 * O(-d), S = (h - R) * (h - R) + y * y, I = b * b + (E - R) * (E - R), S > I ? (S = O(S + L * L), z = (h - R) / S, l = y / S, R = 0, L /= S) : (I = O(I + L * L), z = b / I, l = (E - R) / I, R = L / I, L = 0), m = new a([[l, -z], [z, l]], [[R, L], [L, -R]]), u.setRows(r, v, m.dot(u.getRows(r, v))));
      }
    var U = u.dot(s).dot(u.transjugate()), Z = s.length, nr = numeric.T.identity(Z);
    for (v = 0; v < Z; v++)
      if (v > 0)
        for (i = v - 1; i >= 0; i--) {
          var dr = U.get([i, i]), mr = U.get([v, v]);
          if (numeric.neq(dr.x, mr.x) || numeric.neq(dr.y, mr.y))
            R = U.getRow(i).getBlock([i], [v - 1]), L = nr.getRow(v).getBlock([i], [v - 1]), nr.set([v, i], U.get([i, v]).neg().sub(R.dot(L)).div(dr.sub(mr)));
          else {
            nr.setRow(v, nr.getRow(i));
            continue;
          }
        }
    for (v = 0; v < Z; v++)
      R = nr.getRow(v), nr.setRow(v, R.div(R.norm2()));
    return nr = nr.transpose(), nr = u.transjugate().dot(nr), { lambda: U.getDiag(), E: nr };
  }, numeric.ccsSparse = function(s) {
    var f = s.length, i, n, c, a, r = [];
    for (c = f - 1; c !== -1; --c) {
      n = s[c];
      for (a in n) {
        for (a = parseInt(a); a >= r.length; ) r[r.length] = 0;
        n[a] !== 0 && r[a]++;
      }
    }
    var i = r.length, t = Array(i + 1);
    for (t[0] = 0, c = 0; c < i; ++c) t[c + 1] = t[c] + r[c];
    var o = Array(t[i]), u = Array(t[i]);
    for (c = f - 1; c !== -1; --c) {
      n = s[c];
      for (a in n)
        n[a] !== 0 && (r[a]--, o[t[a] + r[a]] = c, u[t[a] + r[a]] = n[a]);
    }
    return [t, o, u];
  }, numeric.ccsFull = function(s) {
    var f = s[0], n = s[1], c = s[2], a = numeric.ccsDim(s), r = a[0], i = a[1], t, o, u, m, w = numeric.rep([r, i], 0);
    for (t = 0; t < i; t++)
      for (u = f[t], m = f[t + 1], o = u; o < m; ++o)
        w[n[o]][t] = c[o];
    return w;
  }, numeric.ccsTSolve = function(s, f, n, c, a) {
    var r = s[0], i = s[1], t = s[2], o = r.length - 1, u = Math.max, m = 0;
    typeof c > "u" && (n = numeric.rep([o], 0)), typeof c > "u" && (c = numeric.linspace(0, n.length - 1)), typeof a > "u" && (a = []);
    function w(d) {
      var R;
      if (n[d] === 0) {
        for (n[d] = 1, R = r[d]; R < r[d + 1]; ++R) w(i[R]);
        a[m] = d, ++m;
      }
    }
    var v, h, y, b, E, j, g;
    for (v = c.length - 1; v !== -1; --v)
      w(c[v]);
    for (a.length = m, v = a.length - 1; v !== -1; --v)
      n[a[v]] = 0;
    for (v = c.length - 1; v !== -1; --v)
      h = c[v], n[h] = f[h];
    for (v = a.length - 1; v !== -1; --v) {
      for (h = a[v], y = r[h], b = u(r[h + 1], y), E = y; E !== b; ++E)
        if (i[E] === h) {
          n[h] /= t[E];
          break;
        }
      for (g = n[h], E = y; E !== b; ++E)
        j = i[E], j !== h && (n[j] -= g * t[E]);
    }
    return n;
  }, numeric.ccsDFS = function(s) {
    this.k = Array(s), this.k1 = Array(s), this.j = Array(s);
  }, numeric.ccsDFS.prototype.dfs = function(s, f, n, c, a, r) {
    var i = 0, t, o = a.length, u = this.k, m = this.k1, w = this.j, v, h;
    if (c[s] === 0)
      for (c[s] = 1, w[0] = s, u[0] = v = f[s], m[0] = h = f[s + 1]; ; )
        if (v >= h) {
          if (a[o] = w[i], i === 0) return;
          ++o, --i, v = u[i], h = m[i];
        } else
          t = r[n[v]], c[t] === 0 ? (c[t] = 1, u[i] = v, ++i, w[i] = t, v = f[t], m[i] = h = f[t + 1]) : ++v;
  }, numeric.ccsLPSolve = function(s, f, n, c, a, r, i) {
    var t = s[0], o = s[1], u = s[2];
    t.length - 1;
    var m = f[0], w = f[1], v = f[2], h, y, b, E, j, g, d, R, L;
    for (y = m[a], b = m[a + 1], c.length = 0, h = y; h < b; ++h)
      i.dfs(r[w[h]], t, o, n, c, r);
    for (h = c.length - 1; h !== -1; --h)
      n[c[h]] = 0;
    for (h = y; h !== b; ++h)
      E = r[w[h]], n[E] = v[h];
    for (h = c.length - 1; h !== -1; --h) {
      for (E = c[h], j = t[E], g = t[E + 1], d = j; d < g; ++d)
        if (r[o[d]] === E) {
          n[E] /= u[d];
          break;
        }
      for (L = n[E], d = j; d < g; ++d)
        R = r[o[d]], R !== E && (n[R] -= L * u[d]);
    }
    return n;
  }, numeric.ccsLUP1 = function(s, f) {
    var n = s[0].length - 1, c = [numeric.rep([n + 1], 0), [], []], a = [numeric.rep([n + 1], 0), [], []], r = c[0], i = c[1], t = c[2], o = a[0], u = a[1], m = a[2], w = numeric.rep([n], 0), v = numeric.rep([n], 0), h, y, b, E, j, g, d, R = numeric.ccsLPSolve, L = Math.abs, z = numeric.linspace(0, n - 1), l = numeric.linspace(0, n - 1), S = new numeric.ccsDFS(n);
    for (typeof f > "u" && (f = 1), h = 0; h < n; ++h) {
      for (R(c, s, w, v, h, l, S), E = -1, j = -1, y = v.length - 1; y !== -1; --y)
        b = v[y], !(b <= h) && (g = L(w[b]), g > E && (j = b, E = g));
      for (L(w[h]) < f * E && (y = z[h], E = z[j], z[h] = E, l[E] = h, z[j] = y, l[y] = j, E = w[h], w[h] = w[j], w[j] = E), E = r[h], j = o[h], d = w[h], i[E] = z[h], t[E] = 1, ++E, y = v.length - 1; y !== -1; --y)
        b = v[y], g = w[b], v[y] = 0, w[b] = 0, b <= h ? (u[j] = b, m[j] = g, ++j) : (i[E] = z[b], t[E] = g / d, ++E);
      r[h + 1] = E, o[h + 1] = j;
    }
    for (y = i.length - 1; y !== -1; --y)
      i[y] = l[i[y]];
    return { L: c, U: a, P: z, Pinv: l };
  }, numeric.ccsDFS0 = function(s) {
    this.k = Array(s), this.k1 = Array(s), this.j = Array(s);
  }, numeric.ccsDFS0.prototype.dfs = function(s, f, n, c, a, r, i) {
    var t = 0, o, u = a.length, m = this.k, w = this.k1, v = this.j, h, y;
    if (c[s] === 0)
      for (c[s] = 1, v[0] = s, m[0] = h = f[r[s]], w[0] = y = f[r[s] + 1]; ; ) {
        if (isNaN(h)) throw new Error("Ow!");
        if (h >= y) {
          if (a[u] = r[v[t]], t === 0) return;
          ++u, --t, h = m[t], y = w[t];
        } else
          o = n[h], c[o] === 0 ? (c[o] = 1, m[t] = h, ++t, v[t] = o, o = r[o], h = f[o], w[t] = y = f[o + 1]) : ++h;
      }
  }, numeric.ccsLPSolve0 = function(s, f, n, c, a, r, i, t) {
    var o = s[0], u = s[1], m = s[2];
    o.length - 1;
    var w = f[0], v = f[1], h = f[2], y, b, E, j, g, d, R, L, z;
    for (b = w[a], E = w[a + 1], c.length = 0, y = b; y < E; ++y)
      t.dfs(v[y], o, u, n, c, r, i);
    for (y = c.length - 1; y !== -1; --y)
      j = c[y], n[i[j]] = 0;
    for (y = b; y !== E; ++y)
      j = v[y], n[j] = h[y];
    for (y = c.length - 1; y !== -1; --y) {
      for (j = c[y], L = i[j], g = o[j], d = o[j + 1], R = g; R < d; ++R)
        if (u[R] === L) {
          n[L] /= m[R];
          break;
        }
      for (z = n[L], R = g; R < d; ++R) n[u[R]] -= z * m[R];
      n[L] = z;
    }
  }, numeric.ccsLUP0 = function(s, f) {
    var n = s[0].length - 1, c = [numeric.rep([n + 1], 0), [], []], a = [numeric.rep([n + 1], 0), [], []], r = c[0], i = c[1], t = c[2], o = a[0], u = a[1], m = a[2], w = numeric.rep([n], 0), v = numeric.rep([n], 0), h, y, b, E, j, g, d, R = numeric.ccsLPSolve0, L = Math.abs, z = numeric.linspace(0, n - 1), l = numeric.linspace(0, n - 1), S = new numeric.ccsDFS0(n);
    for (typeof f > "u" && (f = 1), h = 0; h < n; ++h) {
      for (R(c, s, w, v, h, l, z, S), E = -1, j = -1, y = v.length - 1; y !== -1; --y)
        b = v[y], !(b <= h) && (g = L(w[z[b]]), g > E && (j = b, E = g));
      for (L(w[z[h]]) < f * E && (y = z[h], E = z[j], z[h] = E, l[E] = h, z[j] = y, l[y] = j), E = r[h], j = o[h], d = w[z[h]], i[E] = z[h], t[E] = 1, ++E, y = v.length - 1; y !== -1; --y)
        b = v[y], g = w[z[b]], v[y] = 0, w[z[b]] = 0, b <= h ? (u[j] = b, m[j] = g, ++j) : (i[E] = z[b], t[E] = g / d, ++E);
      r[h + 1] = E, o[h + 1] = j;
    }
    for (y = i.length - 1; y !== -1; --y)
      i[y] = l[i[y]];
    return { L: c, U: a, P: z, Pinv: l };
  }, numeric.ccsLUP = numeric.ccsLUP0, numeric.ccsDim = function(s) {
    return [numeric.sup(s[1]) + 1, s[0].length - 1];
  }, numeric.ccsGetBlock = function(s, f, n) {
    var c = numeric.ccsDim(s), a = c[0], r = c[1];
    typeof f > "u" ? f = numeric.linspace(0, a - 1) : typeof f == "number" && (f = [f]), typeof n > "u" ? n = numeric.linspace(0, r - 1) : typeof n == "number" && (n = [n]);
    var i, t = f.length, o, u = n.length, m, w, v, h = numeric.rep([r], 0), y = [], b = [], E = [h, y, b], j = s[0], g = s[1], d = s[2], R = numeric.rep([a], 0), L = 0, z = numeric.rep([a], 0);
    for (o = 0; o < u; ++o) {
      w = n[o];
      var l = j[w], S = j[w + 1];
      for (i = l; i < S; ++i)
        m = g[i], z[m] = 1, R[m] = d[i];
      for (i = 0; i < t; ++i)
        v = f[i], z[v] && (y[L] = i, b[L] = R[f[i]], ++L);
      for (i = l; i < S; ++i)
        m = g[i], z[m] = 0;
      h[o + 1] = L;
    }
    return E;
  }, numeric.ccsDot = function(s, f) {
    var n = s[0], c = s[1], a = s[2], r = f[0], i = f[1], t = f[2], o = numeric.ccsDim(s), u = numeric.ccsDim(f), m = o[0];
    o[1];
    var w = u[1], v = numeric.rep([m], 0), h = numeric.rep([m], 0), y = Array(m), b = numeric.rep([w], 0), E = [], j = [], g = [b, E, j], d, R, L, z, l, S, I, O, U, Z, nr;
    for (L = 0; L !== w; ++L) {
      for (z = r[L], l = r[L + 1], U = 0, R = z; R < l; ++R)
        for (Z = i[R], nr = t[R], S = n[Z], I = n[Z + 1], d = S; d < I; ++d)
          O = c[d], h[O] === 0 && (y[U] = O, h[O] = 1, U = U + 1), v[O] = v[O] + a[d] * nr;
      for (z = b[L], l = z + U, b[L + 1] = l, R = U - 1; R !== -1; --R)
        nr = z + R, d = y[R], E[nr] = d, j[nr] = v[d], h[d] = 0, v[d] = 0;
      b[L + 1] = b[L] + U;
    }
    return g;
  }, numeric.ccsLUPSolve = function(s, f) {
    var n = s.L, c = s.U;
    s.P;
    var a = f[0], r = !1;
    typeof a != "object" && (f = [[0, f.length], numeric.linspace(0, f.length - 1), f], a = f[0], r = !0);
    var i = f[1], t = f[2], o = n[0].length - 1, u = a.length - 1, m = numeric.rep([o], 0), w = Array(o), v = numeric.rep([o], 0), h = Array(o), y = numeric.rep([u + 1], 0), b = [], E = [], j = numeric.ccsTSolve, g, d, R, L, z, l, S = 0;
    for (g = 0; g < u; ++g) {
      for (z = 0, R = a[g], L = a[g + 1], d = R; d < L; ++d)
        l = s.Pinv[i[d]], h[z] = l, v[l] = t[d], ++z;
      for (h.length = z, j(n, v, m, h, w), d = h.length - 1; d !== -1; --d) v[h[d]] = 0;
      if (j(c, m, v, w, h), r) return v;
      for (d = w.length - 1; d !== -1; --d) m[w[d]] = 0;
      for (d = h.length - 1; d !== -1; --d)
        l = h[d], b[S] = l, E[S] = v[l], v[l] = 0, ++S;
      y[g + 1] = S;
    }
    return [y, b, E];
  }, numeric.ccsbinop = function(s, f) {
    return typeof f > "u" && (f = ""), Function(
      "X",
      "Y",
      `var Xi = X[0], Xj = X[1], Xv = X[2];
var Yi = Y[0], Yj = Y[1], Yv = Y[2];
var n = Xi.length-1,m = Math.max(numeric.sup(Xj),numeric.sup(Yj))+1;
var Zi = numeric.rep([n+1],0), Zj = [], Zv = [];
var x = numeric.rep([m],0),y = numeric.rep([m],0);
var xk,yk,zk;
var i,j,j0,j1,k,p=0;
` + f + `for(i=0;i<n;++i) {
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
` + s + `
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
  })(), numeric.ccsScatter = function _(s) {
    var f = s[0], n = s[1], c = s[2], a = numeric.sup(n) + 1, r = f.length, i = numeric.rep([a], 0), t = Array(r), o = Array(r), u = numeric.rep([a], 0), m;
    for (m = 0; m < r; ++m) u[n[m]]++;
    for (m = 0; m < a; ++m) i[m + 1] = i[m] + u[m];
    var w = i.slice(0), v, h;
    for (m = 0; m < r; ++m)
      h = n[m], v = w[h], t[v] = f[m], o[v] = c[m], w[h] = w[h] + 1;
    return [i, t, o];
  }, numeric.ccsGather = function _(s) {
    var f = s[0], n = s[1], c = s[2], a = f.length - 1, r = n.length, i = Array(r), t = Array(r), o = Array(r), u, m, w, v, h;
    for (h = 0, u = 0; u < a; ++u)
      for (w = f[u], v = f[u + 1], m = w; m !== v; ++m)
        t[h] = u, i[h] = n[m], o[h] = c[m], ++h;
    return [i, t, o];
  }, numeric.sdim = function _(s, f, n) {
    if (typeof f > "u" && (f = []), typeof s != "object") return f;
    typeof n > "u" && (n = 0), n in f || (f[n] = 0), s.length > f[n] && (f[n] = s.length);
    var c;
    for (c in s)
      s.hasOwnProperty(c) && _(s[c], f, n + 1);
    return f;
  }, numeric.sclone = function _(s, f, n) {
    typeof f > "u" && (f = 0), typeof n > "u" && (n = numeric.sdim(s).length);
    var c, a = Array(s.length);
    if (f === n - 1) {
      for (c in s)
        s.hasOwnProperty(c) && (a[c] = s[c]);
      return a;
    }
    for (c in s)
      s.hasOwnProperty(c) && (a[c] = _(s[c], f + 1, n));
    return a;
  }, numeric.sdiag = function _(s) {
    var f = s.length, n, c = Array(f), a;
    for (n = f - 1; n >= 1; n -= 2)
      a = n - 1, c[n] = [], c[n][n] = s[n], c[a] = [], c[a][a] = s[a];
    return n === 0 && (c[0] = [], c[0][0] = s[n]), c;
  }, numeric.sidentity = function _(s) {
    return numeric.sdiag(numeric.rep([s], 1));
  }, numeric.stranspose = function _(s) {
    var f = [];
    s.length;
    var n, c, a;
    for (n in s)
      if (s.hasOwnProperty(n)) {
        a = s[n];
        for (c in a)
          a.hasOwnProperty(c) && (typeof f[c] != "object" && (f[c] = []), f[c][n] = a[c]);
      }
    return f;
  }, numeric.sLUP = function _(s, f) {
    throw new Error("The function numeric.sLUP had a bug in it and has been removed. Please use the new numeric.ccsLUP function instead.");
  }, numeric.sdotMM = function _(s, f) {
    var n = s.length;
    f.length;
    var c = numeric.stranspose(f), a = c.length, r, i, t, o, u, m, w = Array(n), v;
    for (t = n - 1; t >= 0; t--) {
      for (v = [], r = s[t], u = a - 1; u >= 0; u--) {
        m = 0, i = c[u];
        for (o in r)
          r.hasOwnProperty(o) && o in i && (m += r[o] * i[o]);
        m && (v[u] = m);
      }
      w[t] = v;
    }
    return w;
  }, numeric.sdotMV = function _(s, f) {
    var n = s.length, c, a, r, i = Array(n), t;
    for (a = n - 1; a >= 0; a--) {
      c = s[a], t = 0;
      for (r in c)
        c.hasOwnProperty(r) && f[r] && (t += c[r] * f[r]);
      t && (i[a] = t);
    }
    return i;
  }, numeric.sdotVM = function _(s, f) {
    var n, c, a, r, i = [];
    for (n in s)
      if (s.hasOwnProperty(n)) {
        a = f[n], r = s[n];
        for (c in a)
          a.hasOwnProperty(c) && (i[c] || (i[c] = 0), i[c] += r * a[c]);
      }
    return i;
  }, numeric.sdotVV = function _(s, f) {
    var n, c = 0;
    for (n in s)
      s[n] && f[n] && (c += s[n] * f[n]);
    return c;
  }, numeric.sdot = function _(s, f) {
    var n = numeric.sdim(s).length, c = numeric.sdim(f).length, a = n * 1e3 + c;
    switch (a) {
      case 0:
        return s * f;
      case 1001:
        return numeric.sdotVV(s, f);
      case 2001:
        return numeric.sdotMV(s, f);
      case 1002:
        return numeric.sdotVM(s, f);
      case 2002:
        return numeric.sdotMM(s, f);
      default:
        throw new Error("numeric.sdot not implemented for tensors of order " + n + " and " + c);
    }
  }, numeric.sscatter = function _(s) {
    var f = s[0].length, n, c, a, r = s.length, i = [], t;
    for (c = f - 1; c >= 0; --c)
      if (s[r - 1][c]) {
        for (t = i, a = 0; a < r - 2; a++)
          n = s[a][c], t[n] || (t[n] = []), t = t[n];
        t[s[a][c]] = s[a + 1][c];
      }
    return i;
  }, numeric.sgather = function _(s, f, n) {
    typeof f > "u" && (f = []), typeof n > "u" && (n = []);
    var c, a, r;
    c = n.length;
    for (a in s)
      if (s.hasOwnProperty(a))
        if (n[c] = parseInt(a), r = s[a], typeof r == "number") {
          if (r) {
            if (f.length === 0)
              for (a = c + 1; a >= 0; --a) f[a] = [];
            for (a = c; a >= 0; --a) f[a].push(n[a]);
            f[c + 1].push(r);
          }
        } else _(r, f, n);
    return n.length > c && n.pop(), f;
  }, numeric.cLU = function _(s) {
    var f = s[0], n = s[1], c = s[2], S = f.length, a = 0, r, i, t, o, u, m;
    for (r = 0; r < S; r++) f[r] > a && (a = f[r]);
    a++;
    var w = Array(a), v = Array(a), h = numeric.rep([a], 1 / 0), y = numeric.rep([a], -1 / 0), g, d, b;
    for (t = 0; t < S; t++)
      r = f[t], i = n[t], i < h[r] && (h[r] = i), i > y[r] && (y[r] = i);
    for (r = 0; r < a - 1; r++)
      y[r] > y[r + 1] && (y[r + 1] = y[r]);
    for (r = a - 1; r >= 1; r--)
      h[r] < h[r - 1] && (h[r - 1] = h[r]);
    var E = 0, j = 0;
    for (r = 0; r < a; r++)
      v[r] = numeric.rep([y[r] - h[r] + 1], 0), w[r] = numeric.rep([r - h[r]], 0), E += r - h[r] + 1, j += y[r] - r + 1;
    for (t = 0; t < S; t++)
      r = f[t], v[r][n[t] - h[r]] = c[t];
    for (r = 0; r < a - 1; r++)
      for (o = r - h[r], g = v[r], i = r + 1; h[i] <= r && i < a; i++)
        if (u = r - h[i], m = y[r] - r, d = v[i], b = d[u] / g[o], b) {
          for (t = 1; t <= m; t++)
            d[t + u] -= b * g[t + o];
          w[i][r - h[i]] = b;
        }
    var g = [], d = [], R = [], L = [], z = [], l = [], S, I, O;
    for (S = 0, I = 0, r = 0; r < a; r++) {
      for (o = h[r], u = y[r], O = v[r], i = r; i <= u; i++)
        O[i - o] && (g[S] = r, d[S] = i, R[S] = O[i - o], S++);
      for (O = w[r], i = o; i < r; i++)
        O[i - o] && (L[I] = r, z[I] = i, l[I] = O[i - o], I++);
      L[I] = r, z[I] = r, l[I] = 1, I++;
    }
    return { U: [g, d, R], L: [L, z, l] };
  }, numeric.cLUsolve = function _(s, f) {
    var n = s.L, c = s.U, a = numeric.clone(f), r = n[0], i = n[1], t = n[2], o = c[0], u = c[1], m = c[2], w = o.length;
    r.length;
    var v = a.length, h, y;
    for (y = 0, h = 0; h < v; h++) {
      for (; i[y] < h; )
        a[h] -= t[y] * a[i[y]], y++;
      y++;
    }
    for (y = w - 1, h = v - 1; h >= 0; h--) {
      for (; u[y] > h; )
        a[h] -= m[y] * a[u[y]], y--;
      a[h] /= m[y], y--;
    }
    return a;
  }, numeric.cgrid = function _(s, f) {
    typeof s == "number" && (s = [s, s]);
    var n = numeric.rep(s, -1), c, a, r;
    if (typeof f != "function")
      switch (f) {
        case "L":
          f = function(i, t) {
            return i >= s[0] / 2 || t < s[1] / 2;
          };
          break;
        default:
          f = function(i, t) {
            return !0;
          };
          break;
      }
    for (r = 0, c = 1; c < s[0] - 1; c++) for (a = 1; a < s[1] - 1; a++)
      f(c, a) && (n[c][a] = r, r++);
    return n;
  }, numeric.cdelsq = function _(s) {
    var f = [[-1, 0], [0, -1], [0, 1], [1, 0]], n = numeric.dim(s), c = n[0], a = n[1], r, i, t, o, u, m = [], w = [], v = [];
    for (r = 1; r < c - 1; r++) for (i = 1; i < a - 1; i++)
      if (!(s[r][i] < 0)) {
        for (t = 0; t < 4; t++)
          o = r + f[t][0], u = i + f[t][1], !(s[o][u] < 0) && (m.push(s[r][i]), w.push(s[o][u]), v.push(-1));
        m.push(s[r][i]), w.push(s[r][i]), v.push(4);
      }
    return [m, w, v];
  }, numeric.cdotMV = function _(s, f) {
    var n, c = s[0], a = s[1], r = s[2], i, t = c.length, o;
    for (o = 0, i = 0; i < t; i++)
      c[i] > o && (o = c[i]);
    for (o++, n = numeric.rep([o], 0), i = 0; i < t; i++)
      n[c[i]] += r[i] * f[a[i]];
    return n;
  }, numeric.Spline = function _(s, f, n, c, a) {
    this.x = s, this.yl = f, this.yr = n, this.kl = c, this.kr = a;
  }, numeric.Spline.prototype._at = function _(t, f) {
    var n = this.x, c = this.yl, a = this.yr, r = this.kl, i = this.kr, t, o, u, m, w = numeric.add, v = numeric.sub, h = numeric.mul;
    o = v(h(r[f], n[f + 1] - n[f]), v(a[f + 1], c[f])), u = w(h(i[f + 1], n[f] - n[f + 1]), v(a[f + 1], c[f])), m = (t - n[f]) / (n[f + 1] - n[f]);
    var y = m * (1 - m);
    return w(w(w(h(1 - m, c[f]), h(m, a[f + 1])), h(o, y * (1 - m))), h(u, y * m));
  }, numeric.Spline.prototype.at = function _(s) {
    if (typeof s == "number") {
      var f = this.x, i = f.length, n, c, a, r = Math.floor;
      for (n = 0, c = i - 1; c - n > 1; )
        a = r((n + c) / 2), f[a] <= s ? n = a : c = a;
      return this._at(s, n);
    }
    var i = s.length, t, o = Array(i);
    for (t = i - 1; t !== -1; --t) o[t] = this.at(s[t]);
    return o;
  }, numeric.Spline.prototype.diff = function _() {
    var s = this.x, f = this.yl, n = this.yr, c = this.kl, a = this.kr, r = f.length, i, t, o, u = c, m = a, w = Array(r), v = Array(r), h = numeric.add, y = numeric.mul, b = numeric.div, E = numeric.sub;
    for (i = r - 1; i !== -1; --i)
      t = s[i + 1] - s[i], o = E(n[i + 1], f[i]), w[i] = b(h(y(o, 6), y(c[i], -4 * t), y(a[i + 1], -2 * t)), t * t), v[i + 1] = b(h(y(o, -6), y(c[i], 2 * t), y(a[i + 1], 4 * t)), t * t);
    return new numeric.Spline(s, u, m, w, v);
  }, numeric.Spline.prototype.roots = function _() {
    function s(P) {
      return P * P;
    }
    var b = [], f = this.x, n = this.yl, c = this.yr, a = this.kl, r = this.kr;
    typeof n[0] == "number" && (n = [n], c = [c], a = [a], r = [r]);
    var i = n.length, t = f.length - 1, o, u, m, w, v, h, y, b = Array(i), E, j, g, d, R, L, z, l, S, I, O, U, Z, nr, dr, mr, or = Math.sqrt;
    for (o = 0; o !== i; ++o) {
      for (w = n[o], v = c[o], h = a[o], y = r[o], E = [], u = 0; u !== t; u++) {
        for (u > 0 && v[u] * w[u] < 0 && E.push(f[u]), S = f[u + 1] - f[u], f[u], d = w[u], R = v[u + 1], j = h[u] / S, g = y[u + 1] / S, l = s(j - g + 3 * (d - R)) + 12 * g * d, L = g + 3 * d + 2 * j - 3 * R, z = 3 * (g + j + 2 * (d - R)), l <= 0 ? (O = L / z, O > f[u] && O < f[u + 1] ? I = [f[u], O, f[u + 1]] : I = [f[u], f[u + 1]]) : (O = (L - or(l)) / z, U = (L + or(l)) / z, I = [f[u]], O > f[u] && O < f[u + 1] && I.push(O), U > f[u] && U < f[u + 1] && I.push(U), I.push(f[u + 1])), nr = I[0], O = this._at(nr, u), m = 0; m < I.length - 1; m++) {
          if (dr = I[m + 1], U = this._at(dr, u), O === 0) {
            E.push(nr), nr = dr, O = U;
            continue;
          }
          if (U === 0 || O * U > 0) {
            nr = dr, O = U;
            continue;
          }
          for (var V = 0; mr = (O * dr - U * nr) / (O - U), !(mr <= nr || mr >= dr); )
            if (Z = this._at(mr, u), Z * U > 0)
              dr = mr, U = Z, V === -1 && (O *= 0.5), V = -1;
            else if (Z * O > 0)
              nr = mr, O = Z, V === 1 && (U *= 0.5), V = 1;
            else break;
          E.push(mr), nr = I[m + 1], O = this._at(nr, u);
        }
        U === 0 && E.push(dr);
      }
      b[o] = E;
    }
    return typeof this.yl[0] == "number" ? b[0] : b;
  }, numeric.spline = function _(s, f, n, c) {
    var a = s.length, r = [], i = [], t = [], o, u = numeric.sub, m = numeric.mul, w = numeric.add;
    for (o = a - 2; o >= 0; o--)
      i[o] = s[o + 1] - s[o], t[o] = u(f[o + 1], f[o]);
    (typeof n == "string" || typeof c == "string") && (n = c = "periodic");
    var v = [[], [], []];
    switch (typeof n) {
      case "undefined":
        r[0] = m(3 / (i[0] * i[0]), t[0]), v[0].push(0, 0), v[1].push(0, 1), v[2].push(2 / i[0], 1 / i[0]);
        break;
      case "string":
        r[0] = w(m(3 / (i[a - 2] * i[a - 2]), t[a - 2]), m(3 / (i[0] * i[0]), t[0])), v[0].push(0, 0, 0), v[1].push(a - 2, 0, 1), v[2].push(1 / i[a - 2], 2 / i[a - 2] + 2 / i[0], 1 / i[0]);
        break;
      default:
        r[0] = n, v[0].push(0), v[1].push(0), v[2].push(1);
        break;
    }
    for (o = 1; o < a - 1; o++)
      r[o] = w(m(3 / (i[o - 1] * i[o - 1]), t[o - 1]), m(3 / (i[o] * i[o]), t[o])), v[0].push(o, o, o), v[1].push(o - 1, o, o + 1), v[2].push(1 / i[o - 1], 2 / i[o - 1] + 2 / i[o], 1 / i[o]);
    switch (typeof c) {
      case "undefined":
        r[a - 1] = m(3 / (i[a - 2] * i[a - 2]), t[a - 2]), v[0].push(a - 1, a - 1), v[1].push(a - 2, a - 1), v[2].push(1 / i[a - 2], 2 / i[a - 2]);
        break;
      case "string":
        v[1][v[1].length - 1] = 0;
        break;
      default:
        r[a - 1] = c, v[0].push(a - 1), v[1].push(a - 1), v[2].push(1);
        break;
    }
    typeof r[0] != "number" ? r = numeric.transpose(r) : r = [r];
    var h = Array(r.length);
    if (typeof n == "string")
      for (o = h.length - 1; o !== -1; --o)
        h[o] = numeric.ccsLUPSolve(numeric.ccsLUP(numeric.ccsScatter(v)), r[o]), h[o][a - 1] = h[o][0];
    else
      for (o = h.length - 1; o !== -1; --o)
        h[o] = numeric.cLUsolve(numeric.cLU(v), r[o]);
    return typeof f[0] == "number" ? h = h[0] : h = numeric.transpose(h), new numeric.Spline(s, f, f, h, h);
  }, numeric.fftpow2 = function _(s, f) {
    var n = s.length;
    if (n !== 1) {
      var c = Math.cos, a = Math.sin, r, i, t = Array(n / 2), o = Array(n / 2), u = Array(n / 2), m = Array(n / 2);
      for (i = n / 2, r = n - 1; r !== -1; --r)
        --i, u[i] = s[r], m[i] = f[r], --r, t[i] = s[r], o[i] = f[r];
      _(t, o), _(u, m), i = n / 2;
      var w, v = -6.283185307179586 / n, h, y;
      for (r = n - 1; r !== -1; --r)
        --i, i === -1 && (i = n / 2 - 1), w = v * r, h = c(w), y = a(w), s[r] = t[i] + h * u[i] - y * m[i], f[r] = o[i] + h * m[i] + y * u[i];
    }
  }, numeric._ifftpow2 = function _(s, f) {
    var n = s.length;
    if (n !== 1) {
      var c = Math.cos, a = Math.sin, r, i, t = Array(n / 2), o = Array(n / 2), u = Array(n / 2), m = Array(n / 2);
      for (i = n / 2, r = n - 1; r !== -1; --r)
        --i, u[i] = s[r], m[i] = f[r], --r, t[i] = s[r], o[i] = f[r];
      _(t, o), _(u, m), i = n / 2;
      var w, v = 6.283185307179586 / n, h, y;
      for (r = n - 1; r !== -1; --r)
        --i, i === -1 && (i = n / 2 - 1), w = v * r, h = c(w), y = a(w), s[r] = t[i] + h * u[i] - y * m[i], f[r] = o[i] + h * m[i] + y * u[i];
    }
  }, numeric.ifftpow2 = function _(s, f) {
    numeric._ifftpow2(s, f), numeric.diveq(s, s.length), numeric.diveq(f, f.length);
  }, numeric.convpow2 = function _(s, f, n, c) {
    numeric.fftpow2(s, f), numeric.fftpow2(n, c);
    var a, r = s.length, i, t, o, u;
    for (a = r - 1; a !== -1; --a)
      i = s[a], o = f[a], t = n[a], u = c[a], s[a] = i * t - o * u, f[a] = i * u + o * t;
    numeric.ifftpow2(s, f);
  }, numeric.T.prototype.fft = function _() {
    var s = this.x, f = this.y, n = s.length, c = Math.log, a = c(2), r = Math.ceil(c(2 * n - 1) / a), i = Math.pow(2, r), t = numeric.rep([i], 0), o = numeric.rep([i], 0), u = Math.cos, m = Math.sin, w, v = -3.141592653589793 / n, h, y = numeric.rep([i], 0), b = numeric.rep([i], 0);
    for (w = 0; w < n; w++) y[w] = s[w];
    if (typeof f < "u") for (w = 0; w < n; w++) b[w] = f[w];
    for (t[0] = 1, w = 1; w <= i / 2; w++)
      h = v * w * w, t[w] = u(h), o[w] = m(h), t[i - w] = u(h), o[i - w] = m(h);
    var E = new numeric.T(y, b), j = new numeric.T(t, o);
    return E = E.mul(j), numeric.convpow2(E.x, E.y, numeric.clone(j.x), numeric.neg(j.y)), E = E.mul(j), E.x.length = n, E.y.length = n, E;
  }, numeric.T.prototype.ifft = function _() {
    var s = this.x, f = this.y, n = s.length, c = Math.log, a = c(2), r = Math.ceil(c(2 * n - 1) / a), i = Math.pow(2, r), t = numeric.rep([i], 0), o = numeric.rep([i], 0), u = Math.cos, m = Math.sin, w, v = 3.141592653589793 / n, h, y = numeric.rep([i], 0), b = numeric.rep([i], 0);
    for (w = 0; w < n; w++) y[w] = s[w];
    if (typeof f < "u") for (w = 0; w < n; w++) b[w] = f[w];
    for (t[0] = 1, w = 1; w <= i / 2; w++)
      h = v * w * w, t[w] = u(h), o[w] = m(h), t[i - w] = u(h), o[i - w] = m(h);
    var E = new numeric.T(y, b), j = new numeric.T(t, o);
    return E = E.mul(j), numeric.convpow2(E.x, E.y, numeric.clone(j.x), numeric.neg(j.y)), E = E.mul(j), E.x.length = n, E.y.length = n, E.div(n);
  }, numeric.gradient = function _(s, f) {
    var n = f.length, c = s(f);
    if (isNaN(c)) throw new Error("gradient: f(x) is a NaN!");
    var m = Math.max, a, r = numeric.clone(f), i, t, o = Array(n);
    numeric.div, numeric.sub;
    var u, m = Math.max, w = 1e-3, v = Math.abs, h = Math.min, y, b, E, j = 0, g, d, R;
    for (a = 0; a < n; a++)
      for (var L = m(1e-6 * c, 1e-8); ; ) {
        if (++j, j > 20)
          throw new Error("Numerical gradient fails");
        if (r[a] = f[a] + L, i = s(r), r[a] = f[a] - L, t = s(r), r[a] = f[a], isNaN(i) || isNaN(t)) {
          L /= 16;
          continue;
        }
        if (o[a] = (i - t) / (2 * L), y = f[a] - L, b = f[a], E = f[a] + L, g = (i - c) / L, d = (c - t) / L, R = m(v(o[a]), v(c), v(i), v(t), v(y), v(b), v(E), 1e-8), u = h(m(v(g - o[a]), v(d - o[a]), v(g - d)) / R, L / R), u > w)
          L /= 16;
        else break;
      }
    return o;
  }, numeric.uncmin = function _(s, f, n, c, a, r, i) {
    var t = numeric.gradient;
    typeof i > "u" && (i = {}), typeof n > "u" && (n = 1e-8), typeof c > "u" && (c = function($) {
      return t(s, $);
    }), typeof a > "u" && (a = 1e3), f = numeric.clone(f);
    var o = f.length, u = s(f), m, w;
    if (isNaN(u)) throw new Error("uncmin: f(x0) is a NaN!");
    var v = Math.max, h = numeric.norm2;
    n = v(n, numeric.epsilon);
    var y, b, E, j = i.Hinv || numeric.identity(o), g = numeric.dot;
    numeric.inv;
    var d = numeric.sub, R = numeric.add, L = numeric.tensor, z = numeric.div, l = numeric.mul, S = numeric.all, I = numeric.isFinite, O = numeric.neg, U = 0, Z, nr, dr, mr, or, V, P, F = "";
    for (b = c(f); U < a; ) {
      if (typeof r == "function" && r(U, f, u, b, j)) {
        F = "Callback returned true";
        break;
      }
      if (!S(I(b))) {
        F = "Gradient has Infinity or NaN";
        break;
      }
      if (y = O(g(j, b)), !S(I(y))) {
        F = "Search direction has Infinity or NaN";
        break;
      }
      if (P = h(y), P < n) {
        F = "Newton step smaller than tol";
        break;
      }
      for (V = 1, w = g(b, y), nr = f; U < a && !(V * P < n); ) {
        if (Z = l(y, V), nr = R(f, Z), m = s(nr), m - u >= 0.1 * V * w || isNaN(m)) {
          V *= 0.5, ++U;
          continue;
        }
        break;
      }
      if (V * P < n) {
        F = "Line search step size smaller than tol";
        break;
      }
      if (U === a) {
        F = "maxit reached during line search";
        break;
      }
      E = c(nr), dr = d(E, b), or = g(dr, Z), mr = g(j, dr), j = d(
        R(
          j,
          l(
            (or + g(dr, mr)) / (or * or),
            L(Z, Z)
          )
        ),
        z(R(L(mr, Z), L(Z, mr)), or)
      ), f = nr, u = m, b = E, ++U;
    }
    return { solution: f, f: u, gradient: b, invHessian: j, iterations: U, message: F };
  }, numeric.Dopri = function _(s, f, n, c, a, r, i) {
    this.x = s, this.y = f, this.f = n, this.ymid = c, this.iterations = a, this.events = i, this.message = r;
  }, numeric.Dopri.prototype._at = function _(y, f) {
    function n(l) {
      return l * l;
    }
    var c = this, a = c.x, r = c.y, i = c.f, t = c.ymid;
    a.length;
    var o, u, m, w, v, h, y, b, E = 0.5, j = numeric.add, g = numeric.mul, d = numeric.sub, R, L, z;
    return o = a[f], u = a[f + 1], w = r[f], v = r[f + 1], b = u - o, m = o + E * b, h = t[f], R = d(i[f], g(w, 1 / (o - m) + 2 / (o - u))), L = d(i[f + 1], g(v, 1 / (u - m) + 2 / (u - o))), z = [
      n(y - u) * (y - m) / n(o - u) / (o - m),
      n(y - o) * n(y - u) / n(o - m) / n(u - m),
      n(y - o) * (y - m) / n(u - o) / (u - m),
      (y - o) * n(y - u) * (y - m) / n(o - u) / (o - m),
      (y - u) * n(y - o) * (y - m) / n(o - u) / (u - m)
    ], j(
      j(
        j(
          j(
            g(w, z[0]),
            g(h, z[1])
          ),
          g(v, z[2])
        ),
        g(R, z[3])
      ),
      g(L, z[4])
    );
  }, numeric.Dopri.prototype.at = function _(s) {
    var f, n, c, a = Math.floor;
    if (typeof s != "number") {
      var r = s.length, i = Array(r);
      for (f = r - 1; f !== -1; --f)
        i[f] = this.at(s[f]);
      return i;
    }
    var t = this.x;
    for (f = 0, n = t.length - 1; n - f > 1; )
      c = a(0.5 * (f + n)), t[c] <= s ? f = c : n = c;
    return this._at(s, f);
  }, numeric.dopri = function _(s, f, n, c, a, r, i) {
    typeof a > "u" && (a = 1e-6), typeof r > "u" && (r = 1e3);
    var t = [s], o = [n], u = [c(s, n)], m, w, v, h, y, b, E = [], j = 1 / 5, g = [3 / 40, 9 / 40], d = [44 / 45, -56 / 15, 32 / 9], R = [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729], L = [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656], z = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84], l = [
      0.5 * 6025192743 / 30085553152,
      0,
      0.5 * 51252292925 / 65400821598,
      0.5 * -2691868925 / 45128329728,
      0.5 * 187940372067 / 1594534317056,
      0.5 * -1776094331 / 19743644256,
      0.5 * 11237099 / 235043384
    ], S = [1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1], I = [-71 / 57600, 0, 71 / 16695, -71 / 1920, 17253 / 339200, -22 / 525, 1 / 40], O = 0, U, Z, nr = (f - s) / 10, dr = 0, mr = numeric.add, or = numeric.mul, V, P, F = Math.min, $ = Math.abs, rr = numeric.norminf, ir = Math.pow, hr = numeric.any, D = numeric.lt, p = numeric.and;
    numeric.sub;
    var q, H, Y, x = new numeric.Dopri(t, o, u, E, -1, "");
    for (typeof i == "function" && (q = i(s, n)); s < f && dr < r; ) {
      if (++dr, s + nr > f && (nr = f - s), m = c(s + S[0] * nr, mr(n, or(j * nr, u[O]))), w = c(s + S[1] * nr, mr(mr(n, or(g[0] * nr, u[O])), or(g[1] * nr, m))), v = c(s + S[2] * nr, mr(mr(mr(n, or(d[0] * nr, u[O])), or(d[1] * nr, m)), or(d[2] * nr, w))), h = c(s + S[3] * nr, mr(mr(mr(mr(n, or(R[0] * nr, u[O])), or(R[1] * nr, m)), or(R[2] * nr, w)), or(R[3] * nr, v))), y = c(s + S[4] * nr, mr(mr(mr(mr(mr(n, or(L[0] * nr, u[O])), or(L[1] * nr, m)), or(L[2] * nr, w)), or(L[3] * nr, v)), or(L[4] * nr, h))), V = mr(mr(mr(mr(mr(n, or(u[O], nr * z[0])), or(w, nr * z[2])), or(v, nr * z[3])), or(h, nr * z[4])), or(y, nr * z[5])), b = c(s + nr, V), U = mr(mr(mr(mr(mr(or(u[O], nr * I[0]), or(w, nr * I[2])), or(v, nr * I[3])), or(h, nr * I[4])), or(y, nr * I[5])), or(b, nr * I[6])), typeof U == "number" ? P = $(U) : P = rr(U), P > a) {
        if (nr = 0.2 * nr * ir(a / P, 0.25), s + nr === s) {
          x.msg = "Step size became too small";
          break;
        }
        continue;
      }
      if (E[O] = mr(
        mr(
          mr(
            mr(
              mr(
                mr(
                  n,
                  or(u[O], nr * l[0])
                ),
                or(w, nr * l[2])
              ),
              or(v, nr * l[3])
            ),
            or(h, nr * l[4])
          ),
          or(y, nr * l[5])
        ),
        or(b, nr * l[6])
      ), ++O, t[O] = s + nr, o[O] = V, u[O] = b, typeof i == "function") {
        var K, fr = s, vr = s + 0.5 * nr, N;
        if (H = i(vr, E[O - 1]), Y = p(D(q, 0), D(0, H)), hr(Y) || (fr = vr, vr = s + nr, q = H, H = i(vr, V), Y = p(D(q, 0), D(0, H))), hr(Y)) {
          for (var Q, J, tr = 0, cr = 1, e = 1; ; ) {
            if (typeof q == "number") N = (e * H * fr - cr * q * vr) / (e * H - cr * q);
            else
              for (N = vr, Z = q.length - 1; Z !== -1; --Z)
                q[Z] < 0 && H[Z] > 0 && (N = F(N, (e * H[Z] * fr - cr * q[Z] * vr) / (e * H[Z] - cr * q[Z])));
            if (N <= fr || N >= vr) break;
            K = x._at(N, O - 1), J = i(N, K), Q = p(D(q, 0), D(0, J)), hr(Q) ? (vr = N, H = J, Y = Q, e = 1, tr === -1 ? cr *= 0.5 : cr = 1, tr = -1) : (fr = N, q = J, cr = 1, tr === 1 ? e *= 0.5 : e = 1, tr = 1);
          }
          return V = x._at(0.5 * (s + N), O - 1), x.f[O] = c(N, K), x.x[O] = N, x.y[O] = K, x.ymid[O - 1] = V, x.events = Y, x.iterations = dr, x;
        }
      }
      s += nr, n = V, q = H, nr = F(0.8 * nr * ir(a / P, 0.25), 4 * nr);
    }
    return x.iterations = dr, x;
  }, numeric.LU = function(_, s) {
    s = s || !1;
    var f = Math.abs, n, c, a, r, i, t, o, u, m, w = _.length, v = w - 1, h = new Array(w);
    for (s || (_ = numeric.clone(_)), a = 0; a < w; ++a) {
      for (o = a, t = _[a], m = f(t[a]), c = a + 1; c < w; ++c)
        r = f(_[c][a]), m < r && (m = r, o = c);
      for (h[a] = o, o != a && (_[a] = _[o], _[o] = t, t = _[a]), i = t[a], n = a + 1; n < w; ++n)
        _[n][a] /= i;
      for (n = a + 1; n < w; ++n) {
        for (u = _[n], c = a + 1; c < v; ++c)
          u[c] -= u[a] * t[c], ++c, u[c] -= u[a] * t[c];
        c === v && (u[c] -= u[a] * t[c]);
      }
    }
    return {
      LU: _,
      P: h
    };
  }, numeric.LUsolve = function _(s, f) {
    var n, c, a = s.LU, r = a.length, i = numeric.clone(f), t = s.P, o, u, m;
    for (n = r - 1; n !== -1; --n) i[n] = f[n];
    for (n = 0; n < r; ++n)
      for (o = t[n], t[n] !== n && (m = i[n], i[n] = i[o], i[o] = m), u = a[n], c = 0; c < n; ++c)
        i[n] -= i[c] * u[c];
    for (n = r - 1; n >= 0; --n) {
      for (u = a[n], c = n + 1; c < r; ++c)
        i[n] -= i[c] * u[c];
      i[n] /= u[n];
    }
    return i;
  }, numeric.solve = function _(s, f, n) {
    return numeric.LUsolve(numeric.LU(s, n), f);
  }, numeric.echelonize = function _(s) {
    var f = numeric.dim(s), n = f[0], c = f[1], a = numeric.identity(n), r = Array(n), i, t, o, u, m, w, v, h, y = Math.abs, b = numeric.diveq;
    for (s = numeric.clone(s), i = 0; i < n; ++i) {
      for (o = 0, m = s[i], w = a[i], t = 1; t < c; ++t) y(m[o]) < y(m[t]) && (o = t);
      for (r[i] = o, b(w, m[o]), b(m, m[o]), t = 0; t < n; ++t) if (t !== i) {
        for (v = s[t], h = v[o], u = c - 1; u !== -1; --u) v[u] -= m[u] * h;
        for (v = a[t], u = n - 1; u !== -1; --u) v[u] -= w[u] * h;
      }
    }
    return { I: a, A: s, P: r };
  }, numeric.__solveLP = function _(s, f, n, c, a, r, i) {
    var t = numeric.sum;
    numeric.log;
    var o = numeric.mul, u = numeric.sub, m = numeric.dot, w = numeric.div, v = numeric.add, h = s.length, y = n.length, b, E = !1, j = 0, g = 1;
    numeric.transpose(f), numeric.svd;
    var d = numeric.transpose;
    numeric.leq;
    var R = Math.sqrt, L = Math.abs;
    numeric.muleq, numeric.norminf, numeric.any;
    var z = Math.min, l = numeric.all, S = numeric.gt, I = Array(h), O = Array(y);
    numeric.rep([y], 1);
    var U, Z = numeric.solve, nr = u(n, m(f, r)), dr, mr = m(s, s), or;
    for (dr = j; dr < a; ++dr) {
      var V, P;
      for (V = y - 1; V !== -1; --V) O[V] = w(f[V], nr[V]);
      var F = d(O);
      for (V = h - 1; V !== -1; --V) I[V] = /*x[i]+*/
      t(F[V]);
      g = 0.25 * L(mr / m(s, I));
      var $ = 100 * R(mr / m(I, I));
      for ((!isFinite(g) || g > $) && (g = $), or = v(s, o(g, I)), U = m(F, O), V = h - 1; V !== -1; --V) U[V][V] += 1;
      P = Z(U, w(or, g), !0);
      var rr = w(nr, m(f, P)), ir = 1;
      for (V = y - 1; V !== -1; --V) rr[V] < 0 && (ir = z(ir, -0.999 * rr[V]));
      if (b = u(r, o(P, ir)), nr = u(n, m(f, b)), !l(S(nr, 0))) return { solution: r, message: "", iterations: dr };
      if (r = b, g < c) return { solution: b, message: "", iterations: dr };
      if (i) {
        var hr = m(s, or), D = m(f, or);
        for (E = !0, V = y - 1; V !== -1; --V) if (hr * D[V] < 0) {
          E = !1;
          break;
        }
      } else
        r[h - 1] >= 0 ? E = !1 : E = !0;
      if (E) return { solution: b, message: "Unbounded", iterations: dr };
    }
    return { solution: r, message: "maximum iteration count exceeded", iterations: dr };
  }, numeric._solveLP = function _(s, f, n, c, a) {
    var r = s.length, i = n.length, h;
    numeric.sum, numeric.log, numeric.mul;
    var t = numeric.sub, o = numeric.dot;
    numeric.div, numeric.add;
    var u = numeric.rep([r], 0).concat([1]), m = numeric.rep([i, 1], -1), w = numeric.blockMatrix([[f, m]]), v = n, h = numeric.rep([r], 0).concat(Math.max(0, numeric.sup(numeric.neg(n))) + 1), y = numeric.__solveLP(u, w, v, c, a, h, !1), b = numeric.clone(y.solution);
    b.length = r;
    var E = numeric.inf(t(n, o(f, b)));
    if (E < 0)
      return { solution: NaN, message: "Infeasible", iterations: y.iterations };
    var j = numeric.__solveLP(s, f, n, c, a - y.iterations, b, !0);
    return j.iterations += y.iterations, j;
  }, numeric.solveLP = function _(s, f, n, c, a, r, i) {
    if (typeof i > "u" && (i = 1e3), typeof r > "u" && (r = numeric.epsilon), typeof c > "u") return numeric._solveLP(s, f, n, r, i);
    var t = c.length, o = c[0].length, u = f.length, m = numeric.echelonize(c), w = numeric.rep([o], 0), v = m.P, h = [], y;
    for (y = v.length - 1; y !== -1; --y) w[v[y]] = 1;
    for (y = o - 1; y !== -1; --y) w[y] === 0 && h.push(y);
    var b = numeric.getRange, E = numeric.linspace(0, t - 1), j = numeric.linspace(0, u - 1), g = b(c, E, h), d = b(f, j, v), R = b(f, j, h), L = numeric.dot, z = numeric.sub, l = L(d, m.I), S = z(R, L(l, g)), I = z(n, L(l, a)), O = Array(v.length), U = Array(h.length);
    for (y = v.length - 1; y !== -1; --y) O[y] = s[v[y]];
    for (y = h.length - 1; y !== -1; --y) U[y] = s[h[y]];
    var Z = z(U, L(O, L(m.I, g))), nr = numeric._solveLP(Z, S, I, r, i), dr = nr.solution;
    if (dr !== dr) return nr;
    var mr = L(m.I, z(a, L(g, dr))), or = Array(s.length);
    for (y = v.length - 1; y !== -1; --y) or[v[y]] = mr[y];
    for (y = h.length - 1; y !== -1; --y) or[h[y]] = dr[y];
    return { solution: or, message: nr.message, iterations: nr.iterations };
  }, numeric.MPStoLP = function _(s) {
    s instanceof String && s.split(`
`);
    var f = 0, n = ["Initial state", "NAME", "ROWS", "COLUMNS", "RHS", "BOUNDS", "ENDATA"], c = s.length, a, r, i, t = 0, o = {}, u = [], m = 0, w = {}, v = 0, h, y = [], b = [], E = [];
    function j(z) {
      throw new Error("MPStoLP: " + z + `
Line ` + a + ": " + s[a] + `
Current state: ` + n[f] + `
`);
    }
    for (a = 0; a < c; ++a) {
      i = s[a];
      var g = i.match(/\S*/g), d = [];
      for (r = 0; r < g.length; ++r) g[r] !== "" && d.push(g[r]);
      if (d.length !== 0) {
        for (r = 0; r < n.length && i.substr(0, n[r].length) !== n[r]; ++r) ;
        if (r < n.length) {
          if (f = r, r === 1 && (h = d[1]), r === 6) return { name: h, c: y, A: numeric.transpose(b), b: E, rows: o, vars: w };
          continue;
        }
        switch (f) {
          case 0:
          case 1:
            j("Unexpected line");
          case 2:
            switch (d[0]) {
              case "N":
                t === 0 ? t = d[1] : j("Two or more N rows");
                break;
              case "L":
                o[d[1]] = m, u[m] = 1, E[m] = 0, ++m;
                break;
              case "G":
                o[d[1]] = m, u[m] = -1, E[m] = 0, ++m;
                break;
              case "E":
                o[d[1]] = m, u[m] = 0, E[m] = 0, ++m;
                break;
              default:
                j("Parse error " + numeric.prettyPrint(d));
            }
            break;
          case 3:
            w.hasOwnProperty(d[0]) || (w[d[0]] = v, y[v] = 0, b[v] = numeric.rep([m], 0), ++v);
            var R = w[d[0]];
            for (r = 1; r < d.length; r += 2) {
              if (d[r] === t) {
                y[R] = parseFloat(d[r + 1]);
                continue;
              }
              var L = o[d[r]];
              b[R][L] = (u[L] < 0 ? -1 : 1) * parseFloat(d[r + 1]);
            }
            break;
          case 4:
            for (r = 1; r < d.length; r += 2) E[o[d[r]]] = (u[o[d[r]]] < 0 ? -1 : 1) * parseFloat(d[r + 1]);
            break;
          case 5:
            break;
          case 6:
            j("Internal error");
        }
      }
    }
    j("Reached end of file without ENDATA");
  }, numeric.seedrandom = { pow: Math.pow, random: Math.random }, (function(_, s, f, n, c, a, r) {
    s.seedrandom = function(w, v) {
      var h = [], y;
      return w = o(t(
        v ? [w, _] : arguments.length ? w : [(/* @__PURE__ */ new Date()).getTime(), _, window],
        3
      ), h), y = new i(h), o(y.S, _), s.random = function() {
        for (var E = y.g(n), j = r, g = 0; E < c; )
          E = (E + g) * f, j *= f, g = y.g(1);
        for (; E >= a; )
          E /= 2, j /= 2, g >>>= 1;
        return (E + g) / j;
      }, w;
    };
    function i(m) {
      var w, v, h = this, y = m.length, b = 0, E = h.i = h.j = h.m = 0;
      for (h.S = [], h.c = [], y || (m = [y++]); b < f; )
        h.S[b] = b++;
      for (b = 0; b < f; b++)
        w = h.S[b], E = u(E + w + m[b % y]), v = h.S[E], h.S[b] = v, h.S[E] = w;
      h.g = function(g) {
        var d = h.S, R = u(h.i + 1), L = d[R], z = u(h.j + L), l = d[z];
        d[R] = l, d[z] = L;
        for (var S = d[u(L + l)]; --g; )
          R = u(R + 1), L = d[R], z = u(z + L), l = d[z], d[R] = l, d[z] = L, S = S * f + d[u(L + l)];
        return h.i = R, h.j = z, S;
      }, h.g(f);
    }
    function t(m, w, v, h, y) {
      if (v = [], y = typeof m, w && y == "object") {
        for (h in m)
          if (h.indexOf("S") < 5)
            try {
              v.push(t(m[h], w - 1));
            } catch {
            }
      }
      return v.length ? v : m + (y != "string" ? "\0" : "");
    }
    function o(m, w, v, h) {
      for (m += "", v = 0, h = 0; h < m.length; h++)
        w[u(h)] = u((v ^= w[u(h)] * 19) + m.charCodeAt(h));
      m = "";
      for (h in w)
        m += String.fromCharCode(w[h]);
      return m;
    }
    function u(m) {
      return m & f - 1;
    }
    r = s.pow(f, n), c = s.pow(2, c), a = c * 2, o(s.random(), _);
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
  ), (function(_) {
    function s(t) {
      if (typeof t != "object")
        return t;
      var o = [], u, m = t.length;
      for (u = 0; u < m; u++) o[u + 1] = s(t[u]);
      return o;
    }
    function f(t) {
      if (typeof t != "object")
        return t;
      var o = [], u, m = t.length;
      for (u = 1; u < m; u++) o[u - 1] = f(t[u]);
      return o;
    }
    function n(t, o, u) {
      var m, w, v, h, y;
      for (v = 1; v <= u; v = v + 1) {
        for (t[v][v] = 1 / t[v][v], y = -t[v][v], m = 1; m < v; m = m + 1)
          t[m][v] = y * t[m][v];
        if (h = v + 1, u < h)
          break;
        for (w = h; w <= u; w = w + 1)
          for (y = t[v][w], t[v][w] = 0, m = 1; m <= v; m = m + 1)
            t[m][w] = t[m][w] + y * t[m][v];
      }
    }
    function c(t, o, u, m) {
      var w, v, h, y;
      for (v = 1; v <= u; v = v + 1) {
        for (y = 0, w = 1; w < v; w = w + 1)
          y = y + t[w][v] * m[w];
        m[v] = (m[v] - y) / t[v][v];
      }
      for (h = 1; h <= u; h = h + 1)
        for (v = u + 1 - h, m[v] = m[v] / t[v][v], y = -m[v], w = 1; w < v; w = w + 1)
          m[w] = m[w] + y * t[w][v];
    }
    function a(t, o, u, m) {
      var w, v, h, y, b, E;
      for (v = 1; v <= u; v = v + 1) {
        if (m[1] = v, E = 0, h = v - 1, h < 1) {
          if (E = t[v][v] - E, E <= 0)
            break;
          t[v][v] = Math.sqrt(E);
        } else {
          for (y = 1; y <= h; y = y + 1) {
            for (b = t[y][v], w = 1; w < y; w = w + 1)
              b = b - t[w][v] * t[w][y];
            b = b / t[y][y], t[y][v] = b, E = E + b * b;
          }
          if (E = t[v][v] - E, E <= 0)
            break;
          t[v][v] = Math.sqrt(E);
        }
        m[1] = 0;
      }
    }
    function r(t, o, u, m, w, v, h, y, b, E, j, g, d, R, L, z) {
      var l, S, I, O, U, Z, nr, dr, mr, or, V, P, F, $, rr, ir, hr, D, p, q, H, Y, x, K, fr, vr, N;
      F = Math.min(m, E), I = 2 * m + F * (F + 5) / 2 + 2 * E + 1, K = 1e-60;
      do
        K = K + K, fr = 1 + 0.1 * K, vr = 1 + 0.2 * K;
      while (fr <= 1 || vr <= 1);
      for (l = 1; l <= m; l = l + 1)
        L[l] = o[l];
      for (l = m + 1; l <= I; l = l + 1)
        L[l] = 0;
      for (l = 1; l <= E; l = l + 1)
        g[l] = 0;
      if (U = [], z[1] === 0) {
        if (a(t, u, m, U), U[1] !== 0) {
          z[1] = 2;
          return;
        }
        c(t, u, m, o), n(t, u, m);
      } else {
        for (S = 1; S <= m; S = S + 1)
          for (w[S] = 0, l = 1; l <= S; l = l + 1)
            w[S] = w[S] + t[l][S] * o[l];
        for (S = 1; S <= m; S = S + 1)
          for (o[S] = 0, l = S; l <= m; l = l + 1)
            o[S] = o[S] + t[S][l] * w[l];
      }
      for (v[1] = 0, S = 1; S <= m; S = S + 1)
        for (w[S] = o[S], v[1] = v[1] + L[S] * w[S], L[S] = 0, l = S + 1; l <= m; l = l + 1)
          t[l][S] = 0;
      for (v[1] = -v[1] / 2, z[1] = 0, nr = m, dr = nr + m, V = dr + F, mr = V + F + 1, or = mr + F * (F + 1) / 2, $ = or + E, l = 1; l <= E; l = l + 1) {
        for (ir = 0, S = 1; S <= m; S = S + 1)
          ir = ir + h[S][l] * h[S][l];
        L[$ + l] = Math.sqrt(ir);
      }
      d = 0, R[1] = 0, R[2] = 0;
      function Q() {
        for (R[1] = R[1] + 1, I = or, l = 1; l <= E; l = l + 1) {
          for (I = I + 1, ir = -y[l], S = 1; S <= m; S = S + 1)
            ir = ir + h[S][l] * w[S];
          if (Math.abs(ir) < K && (ir = 0), l > j)
            L[I] = ir;
          else if (L[I] = -Math.abs(ir), ir > 0) {
            for (S = 1; S <= m; S = S + 1)
              h[S][l] = -h[S][l];
            y[l] = -y[l];
          }
        }
        for (l = 1; l <= d; l = l + 1)
          L[or + g[l]] = 0;
        for (P = 0, rr = 0, l = 1; l <= E; l = l + 1)
          L[or + l] < rr * L[$ + l] && (P = l, rr = L[or + l] / L[$ + l]);
        return P === 0 ? 999 : 0;
      }
      function J() {
        for (l = 1; l <= m; l = l + 1) {
          for (ir = 0, S = 1; S <= m; S = S + 1)
            ir = ir + t[S][l] * h[S][P];
          L[l] = ir;
        }
        for (O = nr, l = 1; l <= m; l = l + 1)
          L[O + l] = 0;
        for (S = d + 1; S <= m; S = S + 1)
          for (l = 1; l <= m; l = l + 1)
            L[O + l] = L[O + l] + t[l][S] * L[S];
        for (Y = !0, l = d; l >= 1; l = l - 1) {
          for (ir = L[l], I = mr + l * (l + 3) / 2, O = I - l, S = l + 1; S <= d; S = S + 1)
            ir = ir - L[I] * L[dr + S], I = I + S;
          if (ir = ir / L[O], L[dr + l] = ir, g[l] < j || ir < 0)
            break;
          Y = !1, Z = l;
        }
        if (!Y)
          for (hr = L[V + Z] / L[dr + Z], l = 1; l <= d && !(g[l] < j || L[dr + l] < 0); l = l + 1)
            rr = L[V + l] / L[dr + l], rr < hr && (hr = rr, Z = l);
        for (ir = 0, l = nr + 1; l <= nr + m; l = l + 1)
          ir = ir + L[l] * L[l];
        if (Math.abs(ir) <= K) {
          if (Y)
            return z[1] = 1, 999;
          for (l = 1; l <= d; l = l + 1)
            L[V + l] = L[V + l] - hr * L[dr + l];
          return L[V + d + 1] = L[V + d + 1] + hr, 700;
        } else {
          for (ir = 0, l = 1; l <= m; l = l + 1)
            ir = ir + L[nr + l] * h[l][P];
          for (D = -L[or + P] / ir, x = !0, Y || hr < D && (D = hr, x = !1), l = 1; l <= m; l = l + 1)
            w[l] = w[l] + D * L[nr + l], Math.abs(w[l]) < K && (w[l] = 0);
          for (v[1] = v[1] + D * ir * (D / 2 + L[V + d + 1]), l = 1; l <= d; l = l + 1)
            L[V + l] = L[V + l] - D * L[dr + l];
          if (L[V + d + 1] = L[V + d + 1] + D, x) {
            for (d = d + 1, g[d] = P, I = mr + (d - 1) * d / 2 + 1, l = 1; l <= d - 1; l = l + 1)
              L[I] = L[l], I = I + 1;
            if (d === m)
              L[I] = L[m];
            else {
              for (l = m; l >= d + 1 && !(L[l] === 0 || (p = Math.max(Math.abs(L[l - 1]), Math.abs(L[l])), q = Math.min(Math.abs(L[l - 1]), Math.abs(L[l])), L[l - 1] >= 0 ? rr = Math.abs(p * Math.sqrt(1 + q * q / (p * p))) : rr = -Math.abs(p * Math.sqrt(1 + q * q / (p * p))), p = L[l - 1] / rr, q = L[l] / rr, p === 1)); l = l - 1)
                if (p === 0)
                  for (L[l - 1] = q * rr, S = 1; S <= m; S = S + 1)
                    rr = t[S][l - 1], t[S][l - 1] = t[S][l], t[S][l] = rr;
                else
                  for (L[l - 1] = rr, H = q / (1 + p), S = 1; S <= m; S = S + 1)
                    rr = p * t[S][l - 1] + q * t[S][l], t[S][l] = H * (t[S][l - 1] + rr) - t[S][l], t[S][l - 1] = rr;
              L[I] = L[d];
            }
          } else {
            for (ir = -y[P], S = 1; S <= m; S = S + 1)
              ir = ir + w[S] * h[S][P];
            if (P > j)
              L[or + P] = ir;
            else if (L[or + P] = -Math.abs(ir), ir > 0) {
              for (S = 1; S <= m; S = S + 1)
                h[S][P] = -h[S][P];
              y[P] = -y[P];
            }
            return 700;
          }
        }
        return 0;
      }
      function tr() {
        if (I = mr + Z * (Z + 1) / 2 + 1, O = I + Z, L[O] === 0 || (p = Math.max(Math.abs(L[O - 1]), Math.abs(L[O])), q = Math.min(Math.abs(L[O - 1]), Math.abs(L[O])), L[O - 1] >= 0 ? rr = Math.abs(p * Math.sqrt(1 + q * q / (p * p))) : rr = -Math.abs(p * Math.sqrt(1 + q * q / (p * p))), p = L[O - 1] / rr, q = L[O] / rr, p === 1))
          return 798;
        if (p === 0) {
          for (l = Z + 1; l <= d; l = l + 1)
            rr = L[O - 1], L[O - 1] = L[O], L[O] = rr, O = O + l;
          for (l = 1; l <= m; l = l + 1)
            rr = t[l][Z], t[l][Z] = t[l][Z + 1], t[l][Z + 1] = rr;
        } else {
          for (H = q / (1 + p), l = Z + 1; l <= d; l = l + 1)
            rr = p * L[O - 1] + q * L[O], L[O] = H * (L[O - 1] + rr) - L[O], L[O - 1] = rr, O = O + l;
          for (l = 1; l <= m; l = l + 1)
            rr = p * t[l][Z] + q * t[l][Z + 1], t[l][Z + 1] = H * (t[l][Z] + rr) - t[l][Z + 1], t[l][Z] = rr;
        }
        return 0;
      }
      function cr() {
        for (O = I - Z, l = 1; l <= Z; l = l + 1)
          L[O] = L[I], I = I + 1, O = O + 1;
        return L[V + Z] = L[V + Z + 1], g[Z] = g[Z + 1], Z = Z + 1, Z < d ? 797 : 0;
      }
      function e() {
        return L[V + d] = L[V + d + 1], L[V + d + 1] = 0, g[d] = 0, d = d - 1, R[2] = R[2] + 1, 0;
      }
      for (N = 0; ; ) {
        if (N = Q(), N === 999)
          return;
        for (; N = J(), N !== 0; ) {
          if (N === 999)
            return;
          if (N === 700)
            if (Z === d)
              e();
            else {
              for (; tr(), N = cr(), N === 797; )
                ;
              e();
            }
        }
      }
    }
    function i(t, o, u, m, w, v) {
      t = s(t), o = s(o), u = s(u);
      var h, y, b, E, j, g = [], d = [], R = [], L = [], z = [], l;
      if (w = w || 0, v = v ? s(v) : [void 0, 0], m = m ? s(m) : [], y = t.length - 1, b = u[1].length - 1, !m)
        for (h = 1; h <= b; h = h + 1)
          m[h] = 0;
      for (h = 1; h <= b; h = h + 1)
        d[h] = 0;
      for (E = 0, j = Math.min(y, b), h = 1; h <= y; h = h + 1)
        R[h] = 0;
      for (g[1] = 0, h = 1; h <= 2 * y + j * (j + 5) / 2 + 2 * b + 1; h = h + 1)
        L[h] = 0;
      for (h = 1; h <= 2; h = h + 1)
        z[h] = 0;
      return r(
        t,
        o,
        y,
        y,
        R,
        g,
        u,
        m,
        y,
        b,
        w,
        d,
        E,
        z,
        L,
        v
      ), l = "", v[1] === 1 && (l = "constraints are inconsistent, no solution!"), v[1] === 2 && (l = "matrix D in quadratic function is not positive definite!"), {
        solution: f(R),
        value: f(g),
        unconstrained_solution: f(o),
        iterations: f(z),
        iact: f(d),
        message: l
      };
    }
    _.solveQP = i;
  })(numeric), numeric.svd = function _(s) {
    var f, n = numeric.epsilon, c = 1e-64 / n, a = 50, r = 0, i = 0, t = 0, o = 0, u = 0, m = numeric.clone(s), w = m.length, v = m[0].length;
    if (w < v) throw "Need more rows than columns";
    var h = new Array(v), y = new Array(v);
    for (i = 0; i < v; i++) h[i] = y[i] = 0;
    var b = numeric.rep([v, v], 0);
    function E(U, Z) {
      return U = Math.abs(U), Z = Math.abs(Z), U > Z ? U * Math.sqrt(1 + Z * Z / U / U) : Z == 0 ? U : Z * Math.sqrt(1 + U * U / Z / Z);
    }
    var j = 0, g = 0, d = 0, R = 0, L = 0, z = 0, l = 0;
    for (i = 0; i < v; i++) {
      for (h[i] = g, l = 0, u = i + 1, t = i; t < w; t++)
        l += m[t][i] * m[t][i];
      if (l <= c)
        g = 0;
      else
        for (j = m[i][i], g = Math.sqrt(l), j >= 0 && (g = -g), d = j * g - l, m[i][i] = j - g, t = u; t < v; t++) {
          for (l = 0, o = i; o < w; o++)
            l += m[o][i] * m[o][t];
          for (j = l / d, o = i; o < w; o++)
            m[o][t] += j * m[o][i];
        }
      for (y[i] = g, l = 0, t = u; t < v; t++)
        l = l + m[i][t] * m[i][t];
      if (l <= c)
        g = 0;
      else {
        for (j = m[i][i + 1], g = Math.sqrt(l), j >= 0 && (g = -g), d = j * g - l, m[i][i + 1] = j - g, t = u; t < v; t++) h[t] = m[i][t] / d;
        for (t = u; t < w; t++) {
          for (l = 0, o = u; o < v; o++)
            l += m[t][o] * m[i][o];
          for (o = u; o < v; o++)
            m[t][o] += l * h[o];
        }
      }
      L = Math.abs(y[i]) + Math.abs(h[i]), L > R && (R = L);
    }
    for (i = v - 1; i != -1; i += -1) {
      if (g != 0) {
        for (d = g * m[i][i + 1], t = u; t < v; t++)
          b[t][i] = m[i][t] / d;
        for (t = u; t < v; t++) {
          for (l = 0, o = u; o < v; o++)
            l += m[i][o] * b[o][t];
          for (o = u; o < v; o++)
            b[o][t] += l * b[o][i];
        }
      }
      for (t = u; t < v; t++)
        b[i][t] = 0, b[t][i] = 0;
      b[i][i] = 1, g = h[i], u = i;
    }
    for (i = v - 1; i != -1; i += -1) {
      for (u = i + 1, g = y[i], t = u; t < v; t++)
        m[i][t] = 0;
      if (g != 0) {
        for (d = m[i][i] * g, t = u; t < v; t++) {
          for (l = 0, o = u; o < w; o++) l += m[o][i] * m[o][t];
          for (j = l / d, o = i; o < w; o++) m[o][t] += j * m[o][i];
        }
        for (t = i; t < w; t++) m[t][i] = m[t][i] / g;
      } else
        for (t = i; t < w; t++) m[t][i] = 0;
      m[i][i] += 1;
    }
    for (n = n * R, o = v - 1; o != -1; o += -1)
      for (var S = 0; S < a; S++) {
        var I = !1;
        for (u = o; u != -1; u += -1) {
          if (Math.abs(h[u]) <= n) {
            I = !0;
            break;
          }
          if (Math.abs(y[u - 1]) <= n)
            break;
        }
        if (!I) {
          r = 0, l = 1;
          var O = u - 1;
          for (i = u; i < o + 1 && (j = l * h[i], h[i] = r * h[i], !(Math.abs(j) <= n)); i++)
            for (g = y[i], d = E(j, g), y[i] = d, r = g / d, l = -j / d, t = 0; t < w; t++)
              L = m[t][O], z = m[t][i], m[t][O] = L * r + z * l, m[t][i] = -L * l + z * r;
        }
        if (z = y[o], u == o) {
          if (z < 0)
            for (y[o] = -z, t = 0; t < v; t++)
              b[t][o] = -b[t][o];
          break;
        }
        if (S >= a - 1)
          throw "Error: no convergence.";
        for (R = y[u], L = y[o - 1], g = h[o - 1], d = h[o], j = ((L - z) * (L + z) + (g - d) * (g + d)) / (2 * d * L), g = E(j, 1), j < 0 ? j = ((R - z) * (R + z) + d * (L / (j - g) - d)) / R : j = ((R - z) * (R + z) + d * (L / (j + g) - d)) / R, r = 1, l = 1, i = u + 1; i < o + 1; i++) {
          for (g = h[i], L = y[i], d = l * g, g = r * g, z = E(j, d), h[i - 1] = z, r = j / z, l = d / z, j = R * r + g * l, g = -R * l + g * r, d = L * l, L = L * r, t = 0; t < v; t++)
            R = b[t][i - 1], z = b[t][i], b[t][i - 1] = R * r + z * l, b[t][i] = -R * l + z * r;
          for (z = E(j, d), y[i - 1] = z, r = j / z, l = d / z, j = r * g + l * L, R = -l * g + r * L, t = 0; t < w; t++)
            L = m[t][i - 1], z = m[t][i], m[t][i - 1] = L * r + z * l, m[t][i] = -L * l + z * r;
        }
        h[u] = 0, h[o] = j, y[o] = R;
      }
    for (i = 0; i < y.length; i++)
      y[i] < n && (y[i] = 0);
    for (i = 0; i < v; i++)
      for (t = i - 1; t >= 0; t--)
        if (y[t] < y[i]) {
          for (r = y[t], y[t] = y[i], y[i] = r, o = 0; o < m.length; o++)
            f = m[o][i], m[o][i] = m[o][t], m[o][t] = f;
          for (o = 0; o < b.length; o++)
            f = b[o][i], b[o][i] = b[o][t], b[o][t] = f;
          i = t;
        }
    return { U: m, S: y, V: b };
  };
})(numeric1_2_6);
var numeric$1 = numeric1_2_6, convertCart2Sph = function(_, s) {
  for (var f, n, c, a = new Array(_.length), r = 0; r < _.length; r++)
    f = Math.atan2(_[r][1], _[r][0]), n = Math.atan2(_[r][2], Math.sqrt(_[r][0] * _[r][0] + _[r][1] * _[r][1])), s == 1 ? a[r] = [f, n] : (c = Math.sqrt(_[r][0] * _[r][0] + _[r][1] * _[r][1] + _[r][2] * _[r][2]), a[r] = [f, n, c]);
  return a;
}, computeRealSH = function(_, s) {
  for (var f = new Array(s.length), n = new Array(s.length), c = 0; c < s.length; c++)
    f[c] = s[c][0], n[c] = s[c][1];
  var a = new Array(2 * _ + 1);
  f.length;
  for (var r = (_ + 1) * (_ + 1), i = 0, t = 0, o, u = numeric$1.sin(n), m = 0, w = new Array(r), v, h, y, b, c = 0; c < 2 * _ + 1; c++) a[c] = factorial(c);
  for (var E = 0; E < _ + 1; E++) {
    if (E == 0) {
      var j = new Array(f.length);
      j.fill(1), w[E] = j, m = 1;
    } else {
      o = recurseLegendrePoly(E, u, i, t), v = Math.sqrt(2 * E + 1);
      for (var g = 0; g < E + 1; g++)
        g == 0 ? w[m + E] = numeric$1.mul(v, o[g]) : (h = v * Math.sqrt(2 * a[E - g] / a[E + g]), y = numeric$1.cos(numeric$1.mul(g, f)), b = numeric$1.sin(numeric$1.mul(g, f)), w[m + E - g] = numeric$1.mul(h, numeric$1.mul(o[g], b)), w[m + E + g] = numeric$1.mul(h, numeric$1.mul(o[g], y)));
      m = m + 2 * E + 1;
    }
    t = i, i = o;
  }
  return w;
}, factorial = function(_) {
  return _ === 0 ? 1 : _ * factorial(_ - 1);
}, recurseLegendrePoly = function(_, s, f, n) {
  var c = new Array(_ + 1);
  switch (_) {
    case 1:
      var u = numeric$1.mul(s, s), a = s, r = numeric$1.sqrt(numeric$1.sub(1, u));
      c[0] = a, c[1] = r;
      break;
    case 2:
      var u = numeric$1.mul(s, s), i = numeric$1.mul(3, u);
      i = numeric$1.sub(i, 1), i = numeric$1.div(i, 2);
      var t = numeric$1.sub(1, u);
      t = numeric$1.sqrt(t), t = numeric$1.mul(3, t), t = numeric$1.mul(t, s);
      var o = numeric$1.sub(1, u);
      o = numeric$1.mul(3, o), c[0] = i, c[1] = t, c[2] = o;
      break;
    default:
      var u = numeric$1.mul(s, s), m = numeric$1.sub(1, u), w = 2 * _ - 1, v = 1;
      if (w % 2 == 0)
        for (var h = 1; h < w / 2 + 1; h++) v = v * 2 * h;
      else
        for (var h = 1; h < (w + 1) / 2 + 1; h++) v = v * (2 * h - 1);
      c[_] = numeric$1.mul(v, numeric$1.pow(m, _ / 2)), c[_ - 1] = numeric$1.mul(2 * _ - 1, numeric$1.mul(s, f[_ - 1]));
      for (var y = 0; y < _ - 1; y++) {
        var b = numeric$1.mul(2 * _ - 1, numeric$1.mul(s, f[y])), E = numeric$1.mul(_ + y - 1, n[y]);
        c[y] = numeric$1.div(numeric$1.sub(b, E), _ - y);
      }
  }
  return c;
}, convertCart2Sph_1 = convertCart2Sph, computeRealSH_1 = computeRealSH, orientation = { exports: {} }, twoProduct_1 = twoProduct$1, SPLITTER = +(Math.pow(2, 27) + 1);
function twoProduct$1(_, s, f) {
  var n = _ * s, c = SPLITTER * _, a = c - _, r = c - a, i = _ - r, t = SPLITTER * s, o = t - s, u = t - o, m = s - u, w = n - r * u, v = w - i * u, h = v - r * m, y = i * m - h;
  return f ? (f[0] = y, f[1] = n, f) : [y, n];
}
var robustSum = linearExpansionSum;
function scalarScalar$1(_, s) {
  var f = _ + s, n = f - _, c = f - n, a = s - n, r = _ - c, i = r + a;
  return i ? [i, f] : [f];
}
function linearExpansionSum(_, s) {
  var f = _.length | 0, n = s.length | 0;
  if (f === 1 && n === 1)
    return scalarScalar$1(_[0], s[0]);
  var c = f + n, a = new Array(c), r = 0, i = 0, t = 0, o = Math.abs, u = _[i], m = o(u), w = s[t], v = o(w), h, y;
  m < v ? (y = u, i += 1, i < f && (u = _[i], m = o(u))) : (y = w, t += 1, t < n && (w = s[t], v = o(w))), i < f && m < v || t >= n ? (h = u, i += 1, i < f && (u = _[i], m = o(u))) : (h = w, t += 1, t < n && (w = s[t], v = o(w)));
  for (var b = h + y, E = b - h, j = y - E, g = j, d = b, R, L, z, l, S; i < f && t < n; )
    m < v ? (h = u, i += 1, i < f && (u = _[i], m = o(u))) : (h = w, t += 1, t < n && (w = s[t], v = o(w))), y = g, b = h + y, E = b - h, j = y - E, j && (a[r++] = j), R = d + b, L = R - d, z = R - L, l = b - L, S = d - z, g = S + l, d = R;
  for (; i < f; )
    h = u, y = g, b = h + y, E = b - h, j = y - E, j && (a[r++] = j), R = d + b, L = R - d, z = R - L, l = b - L, S = d - z, g = S + l, d = R, i += 1, i < f && (u = _[i]);
  for (; t < n; )
    h = w, y = g, b = h + y, E = b - h, j = y - E, j && (a[r++] = j), R = d + b, L = R - d, z = R - L, l = b - L, S = d - z, g = S + l, d = R, t += 1, t < n && (w = s[t]);
  return g && (a[r++] = g), d && (a[r++] = d), r || (a[r++] = 0), a.length = r, a;
}
var twoSum$1 = fastTwoSum;
function fastTwoSum(_, s, f) {
  var n = _ + s, c = n - _, a = n - c, r = s - c, i = _ - a;
  return f ? (f[0] = i + r, f[1] = n, f) : [i + r, n];
}
var twoProduct = twoProduct_1, twoSum = twoSum$1, robustScale = scaleLinearExpansion;
function scaleLinearExpansion(_, s) {
  var f = _.length;
  if (f === 1) {
    var n = twoProduct(_[0], s);
    return n[0] ? n : [n[1]];
  }
  var c = new Array(2 * f), a = [0.1, 0.1], r = [0.1, 0.1], i = 0;
  twoProduct(_[0], s, a), a[0] && (c[i++] = a[0]);
  for (var t = 1; t < f; ++t) {
    twoProduct(_[t], s, r);
    var o = a[1];
    twoSum(o, r[0], a), a[0] && (c[i++] = a[0]);
    var u = r[1], m = a[1], w = u + m, v = w - u, h = m - v;
    a[1] = w, h && (c[i++] = h);
  }
  return a[1] && (c[i++] = a[1]), i === 0 && (c[i++] = 0), c.length = i, c;
}
var robustDiff = robustSubtract;
function scalarScalar(_, s) {
  var f = _ + s, n = f - _, c = f - n, a = s - n, r = _ - c, i = r + a;
  return i ? [i, f] : [f];
}
function robustSubtract(_, s) {
  var f = _.length | 0, n = s.length | 0;
  if (f === 1 && n === 1)
    return scalarScalar(_[0], -s[0]);
  var c = f + n, a = new Array(c), r = 0, i = 0, t = 0, o = Math.abs, u = _[i], m = o(u), w = -s[t], v = o(w), h, y;
  m < v ? (y = u, i += 1, i < f && (u = _[i], m = o(u))) : (y = w, t += 1, t < n && (w = -s[t], v = o(w))), i < f && m < v || t >= n ? (h = u, i += 1, i < f && (u = _[i], m = o(u))) : (h = w, t += 1, t < n && (w = -s[t], v = o(w)));
  for (var b = h + y, E = b - h, j = y - E, g = j, d = b, R, L, z, l, S; i < f && t < n; )
    m < v ? (h = u, i += 1, i < f && (u = _[i], m = o(u))) : (h = w, t += 1, t < n && (w = -s[t], v = o(w))), y = g, b = h + y, E = b - h, j = y - E, j && (a[r++] = j), R = d + b, L = R - d, z = R - L, l = b - L, S = d - z, g = S + l, d = R;
  for (; i < f; )
    h = u, y = g, b = h + y, E = b - h, j = y - E, j && (a[r++] = j), R = d + b, L = R - d, z = R - L, l = b - L, S = d - z, g = S + l, d = R, i += 1, i < f && (u = _[i]);
  for (; t < n; )
    h = w, y = g, b = h + y, E = b - h, j = y - E, j && (a[r++] = j), R = d + b, L = R - d, z = R - L, l = b - L, S = d - z, g = S + l, d = R, t += 1, t < n && (w = -s[t]);
  return g && (a[r++] = g), d && (a[r++] = d), r || (a[r++] = 0), a.length = r, a;
}
(function(_) {
  var s = twoProduct_1, f = robustSum, n = robustScale, c = robustDiff, a = 5, r = 11102230246251565e-32, i = (3 + 16 * r) * r, t = (7 + 56 * r) * r;
  function o(g, d, R, L) {
    return function(l, S, I) {
      var O = g(g(d(S[1], I[0]), d(-I[1], S[0])), g(d(l[1], S[0]), d(-S[1], l[0]))), U = g(d(l[1], I[0]), d(-I[1], l[0])), Z = L(O, U);
      return Z[Z.length - 1];
    };
  }
  function u(g, d, R, L) {
    return function(l, S, I, O) {
      var U = g(g(R(g(d(I[1], O[0]), d(-O[1], I[0])), S[2]), g(R(g(d(S[1], O[0]), d(-O[1], S[0])), -I[2]), R(g(d(S[1], I[0]), d(-I[1], S[0])), O[2]))), g(R(g(d(S[1], O[0]), d(-O[1], S[0])), l[2]), g(R(g(d(l[1], O[0]), d(-O[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), O[2])))), Z = g(g(R(g(d(I[1], O[0]), d(-O[1], I[0])), l[2]), g(R(g(d(l[1], O[0]), d(-O[1], l[0])), -I[2]), R(g(d(l[1], I[0]), d(-I[1], l[0])), O[2]))), g(R(g(d(S[1], I[0]), d(-I[1], S[0])), l[2]), g(R(g(d(l[1], I[0]), d(-I[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), I[2])))), nr = L(U, Z);
      return nr[nr.length - 1];
    };
  }
  function m(g, d, R, L) {
    return function(l, S, I, O, U) {
      var Z = g(g(g(R(g(R(g(d(O[1], U[0]), d(-U[1], O[0])), I[2]), g(R(g(d(I[1], U[0]), d(-U[1], I[0])), -O[2]), R(g(d(I[1], O[0]), d(-O[1], I[0])), U[2]))), S[3]), g(R(g(R(g(d(O[1], U[0]), d(-U[1], O[0])), S[2]), g(R(g(d(S[1], U[0]), d(-U[1], S[0])), -O[2]), R(g(d(S[1], O[0]), d(-O[1], S[0])), U[2]))), -I[3]), R(g(R(g(d(I[1], U[0]), d(-U[1], I[0])), S[2]), g(R(g(d(S[1], U[0]), d(-U[1], S[0])), -I[2]), R(g(d(S[1], I[0]), d(-I[1], S[0])), U[2]))), O[3]))), g(R(g(R(g(d(I[1], O[0]), d(-O[1], I[0])), S[2]), g(R(g(d(S[1], O[0]), d(-O[1], S[0])), -I[2]), R(g(d(S[1], I[0]), d(-I[1], S[0])), O[2]))), -U[3]), g(R(g(R(g(d(O[1], U[0]), d(-U[1], O[0])), S[2]), g(R(g(d(S[1], U[0]), d(-U[1], S[0])), -O[2]), R(g(d(S[1], O[0]), d(-O[1], S[0])), U[2]))), l[3]), R(g(R(g(d(O[1], U[0]), d(-U[1], O[0])), l[2]), g(R(g(d(l[1], U[0]), d(-U[1], l[0])), -O[2]), R(g(d(l[1], O[0]), d(-O[1], l[0])), U[2]))), -S[3])))), g(g(R(g(R(g(d(S[1], U[0]), d(-U[1], S[0])), l[2]), g(R(g(d(l[1], U[0]), d(-U[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), U[2]))), O[3]), g(R(g(R(g(d(S[1], O[0]), d(-O[1], S[0])), l[2]), g(R(g(d(l[1], O[0]), d(-O[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), O[2]))), -U[3]), R(g(R(g(d(I[1], O[0]), d(-O[1], I[0])), S[2]), g(R(g(d(S[1], O[0]), d(-O[1], S[0])), -I[2]), R(g(d(S[1], I[0]), d(-I[1], S[0])), O[2]))), l[3]))), g(R(g(R(g(d(I[1], O[0]), d(-O[1], I[0])), l[2]), g(R(g(d(l[1], O[0]), d(-O[1], l[0])), -I[2]), R(g(d(l[1], I[0]), d(-I[1], l[0])), O[2]))), -S[3]), g(R(g(R(g(d(S[1], O[0]), d(-O[1], S[0])), l[2]), g(R(g(d(l[1], O[0]), d(-O[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), O[2]))), I[3]), R(g(R(g(d(S[1], I[0]), d(-I[1], S[0])), l[2]), g(R(g(d(l[1], I[0]), d(-I[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), I[2]))), -O[3]))))), nr = g(g(g(R(g(R(g(d(O[1], U[0]), d(-U[1], O[0])), I[2]), g(R(g(d(I[1], U[0]), d(-U[1], I[0])), -O[2]), R(g(d(I[1], O[0]), d(-O[1], I[0])), U[2]))), l[3]), R(g(R(g(d(O[1], U[0]), d(-U[1], O[0])), l[2]), g(R(g(d(l[1], U[0]), d(-U[1], l[0])), -O[2]), R(g(d(l[1], O[0]), d(-O[1], l[0])), U[2]))), -I[3])), g(R(g(R(g(d(I[1], U[0]), d(-U[1], I[0])), l[2]), g(R(g(d(l[1], U[0]), d(-U[1], l[0])), -I[2]), R(g(d(l[1], I[0]), d(-I[1], l[0])), U[2]))), O[3]), R(g(R(g(d(I[1], O[0]), d(-O[1], I[0])), l[2]), g(R(g(d(l[1], O[0]), d(-O[1], l[0])), -I[2]), R(g(d(l[1], I[0]), d(-I[1], l[0])), O[2]))), -U[3]))), g(g(R(g(R(g(d(I[1], U[0]), d(-U[1], I[0])), S[2]), g(R(g(d(S[1], U[0]), d(-U[1], S[0])), -I[2]), R(g(d(S[1], I[0]), d(-I[1], S[0])), U[2]))), l[3]), R(g(R(g(d(I[1], U[0]), d(-U[1], I[0])), l[2]), g(R(g(d(l[1], U[0]), d(-U[1], l[0])), -I[2]), R(g(d(l[1], I[0]), d(-I[1], l[0])), U[2]))), -S[3])), g(R(g(R(g(d(S[1], U[0]), d(-U[1], S[0])), l[2]), g(R(g(d(l[1], U[0]), d(-U[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), U[2]))), I[3]), R(g(R(g(d(S[1], I[0]), d(-I[1], S[0])), l[2]), g(R(g(d(l[1], I[0]), d(-I[1], l[0])), -S[2]), R(g(d(l[1], S[0]), d(-S[1], l[0])), I[2]))), -U[3])))), dr = L(Z, nr);
      return dr[dr.length - 1];
    };
  }
  function w(g) {
    var d = g === 3 ? o : g === 4 ? u : m;
    return d(f, s, n, c);
  }
  var v = w(3), h = w(4), y = [
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
      var z = (d[1] - L[1]) * (R[0] - L[0]), l = (d[0] - L[0]) * (R[1] - L[1]), S = z - l, I;
      if (z > 0) {
        if (l <= 0)
          return S;
        I = z + l;
      } else if (z < 0) {
        if (l >= 0)
          return S;
        I = -(z + l);
      } else
        return S;
      var O = i * I;
      return S >= O || S <= -O ? S : v(d, R, L);
    },
    function(d, R, L, z) {
      var l = d[0] - z[0], S = R[0] - z[0], I = L[0] - z[0], O = d[1] - z[1], U = R[1] - z[1], Z = L[1] - z[1], nr = d[2] - z[2], dr = R[2] - z[2], mr = L[2] - z[2], or = S * Z, V = I * U, P = I * O, F = l * Z, $ = l * U, rr = S * O, ir = nr * (or - V) + dr * (P - F) + mr * ($ - rr), hr = (Math.abs(or) + Math.abs(V)) * Math.abs(nr) + (Math.abs(P) + Math.abs(F)) * Math.abs(dr) + (Math.abs($) + Math.abs(rr)) * Math.abs(mr), D = t * hr;
      return ir > D || -ir > D ? ir : h(d, R, L, z);
    }
  ];
  function b(g) {
    var d = y[g.length];
    return d || (d = y[g.length] = w(g.length)), d.apply(void 0, g);
  }
  function E(g, d, R, L, z, l, S) {
    return function(O, U, Z, nr, dr) {
      switch (arguments.length) {
        case 0:
        case 1:
          return 0;
        case 2:
          return L(O, U);
        case 3:
          return z(O, U, Z);
        case 4:
          return l(O, U, Z, nr);
        case 5:
          return S(O, U, Z, nr, dr);
      }
      for (var mr = new Array(arguments.length), or = 0; or < arguments.length; ++or)
        mr[or] = arguments[or];
      return g(mr);
    };
  }
  function j() {
    for (; y.length <= a; )
      y.push(w(y.length));
    _.exports = E.apply(void 0, [b].concat(y));
    for (var g = 0; g <= a; ++g)
      _.exports[g] = y[g];
  }
  j();
})(orientation);
var orientationExports = orientation.exports;
orientationExports[3];
var REVERSE_TABLE = new Array(256);
(function(_) {
  for (var s = 0; s < 256; ++s) {
    var f = s, n = s, c = 7;
    for (f >>>= 1; f; f >>>= 1)
      n <<= 1, n |= f & 1, --c;
    _[s] = n << c & 255;
  }
})(REVERSE_TABLE);
function UnionFind$1(_) {
  this.roots = new Array(_), this.ranks = new Array(_);
  for (var s = 0; s < _; ++s)
    this.roots[s] = s, this.ranks[s] = 0;
}
var proto$1 = UnionFind$1.prototype;
Object.defineProperty(proto$1, "length", {
  get: function() {
    return this.roots.length;
  }
});
proto$1.makeSet = function() {
  var _ = this.roots.length;
  return this.roots.push(_), this.ranks.push(0), _;
};
proto$1.find = function(_) {
  for (var s = _, f = this.roots; f[_] !== _; )
    _ = f[_];
  for (; f[s] !== _; ) {
    var n = f[s];
    f[s] = _, s = n;
  }
  return _;
};
proto$1.link = function(_, s) {
  var f = this.find(_), n = this.find(s);
  if (f !== n) {
    var c = this.ranks, a = this.roots, r = c[f], i = c[n];
    r < i ? a[f] = n : i < r ? a[n] = f : (a[n] = f, ++c[f]);
  }
};
function computeEncodingCoefficients(_, s, f) {
  const n = getAmbisonicChannelCount(f), c = degreesToRadians(_), a = degreesToRadians(s), r = computeRealSH_1(f, [[c, a]]), i = new Float32Array(n);
  for (let t = 0; t < n; t++)
    i[t] = r[t][0];
  return i;
}
function encodeBuffer(_, s, f, n) {
  const c = getAmbisonicChannelCount(n), a = _.length, r = computeEncodingCoefficients(s, f, n), i = new Array(c);
  for (let t = 0; t < c; t++) {
    i[t] = new Float32Array(a);
    const o = r[t];
    for (let u = 0; u < a; u++)
      i[t][u] = _[u] * o;
  }
  return i;
}
function encodeBufferFromDirection(_, s, f, n, c, a = "ambisonics") {
  let r = s, i = f, t = n;
  a === "threejs" && (r = n, i = -s, t = f);
  const [[o, u]] = convertCart2Sph_1([[r, i, t]], 1), m = o * 180 / Math.PI, w = u * 180 / Math.PI;
  return encodeBuffer(_, m, w, c);
}
if (commonjsGlobal.AnalyserNode && !commonjsGlobal.AnalyserNode.prototype.getFloatTimeDomainData) {
  var uint8 = new Uint8Array(2048);
  commonjsGlobal.AnalyserNode.prototype.getFloatTimeDomainData = function(_) {
    this.getByteTimeDomainData(uint8);
    for (var s = 0, f = _.length; s < f; s++)
      _[s] = (uint8[s] - 128) * 78125e-7;
  };
}
function commonjsRequire(_) {
  throw new Error('Could not dynamically require "' + _ + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var serveSofaHrir = { exports: {} };
(function(_, s) {
  (function(f) {
    _.exports = f();
  })(function() {
    return (function f(n, c, a) {
      function r(o, u) {
        if (!c[o]) {
          if (!n[o]) {
            var m = typeof commonjsRequire == "function" && commonjsRequire;
            if (!u && m) return m(o, !0);
            if (i) return i(o, !0);
            var w = new Error("Cannot find module '" + o + "'");
            throw w.code = "MODULE_NOT_FOUND", w;
          }
          var v = c[o] = { exports: {} };
          n[o][0].call(v.exports, function(h) {
            var y = n[o][1][h];
            return r(y || h);
          }, v, v.exports, f, n, c, a);
        }
        return c[o].exports;
      }
      for (var i = typeof commonjsRequire == "function" && commonjsRequire, t = 0; t < a.length; t++) r(a[t]);
      return r;
    })({ 1: [function(f, n, c) {
      n.exports = { default: f("core-js/library/fn/object/define-property"), __esModule: !0 };
    }, { "core-js/library/fn/object/define-property": 4 }], 2: [function(f, n, c) {
      c.default = function(a, r) {
        if (!(a instanceof r))
          throw new TypeError("Cannot call a class as a function");
      }, c.__esModule = !0;
    }, {}], 3: [function(f, n, c) {
      var a = f("babel-runtime/core-js/object/define-property").default;
      c.default = /* @__PURE__ */ (function() {
        function r(i, t) {
          for (var o = 0; o < t.length; o++) {
            var u = t[o];
            u.enumerable = u.enumerable || !1, u.configurable = !0, "value" in u && (u.writable = !0), a(i, u.key, u);
          }
        }
        return function(i, t, o) {
          return t && r(i.prototype, t), o && r(i, o), i;
        };
      })(), c.__esModule = !0;
    }, { "babel-runtime/core-js/object/define-property": 1 }], 4: [function(f, n, c) {
      var a = f("../../modules/$");
      n.exports = function(i, t, o) {
        return a.setDesc(i, t, o);
      };
    }, { "../../modules/$": 5 }], 5: [function(f, n, c) {
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
    }, {}], 6: [function(f, n, c) {
      var a = f("babel-runtime/helpers/create-class").default, r = f("babel-runtime/helpers/class-call-check").default;
      Object.defineProperty(c, "__esModule", {
        value: !0
      });
      var i = (function() {
        function t(o, u) {
          r(this, t), this.delayTime = 0, this.posRead = 0, this.posWrite = 0, this.fracXi1 = 0, this.fracYi1 = 0, this.intDelay = 0, this.fracDelay = 0, this.a1 = void 0, this.sampleRate = o, this.maxDelayTime = u || 1, this.bufferSize = this.maxDelayTime * this.sampleRate, this.bufferSize % 1 !== 0 && (this.bufferSize = parseInt(this.bufferSize) + 1), this.buffer = new Float32Array(this.bufferSize);
        }
        return a(t, [{
          key: "setDelay",
          value: function(u) {
            if (u < this.maxDelayTime) {
              this.delayTime = u;
              var m = u * this.sampleRate;
              this.intDelay = parseInt(m), this.fracDelay = m - this.intDelay, this.resample(), this.fracDelay !== 0 && this.updateThiranCoefficient();
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
          value: function(u) {
            for (var m = new Float32Array(u.length), w = 0; w < u.length; w = w + 1)
              this.buffer[this.posWrite] = u[w], m[w] = this.buffer[this.posRead], this.updatePointers();
            return this.fracDelay === 0 || (m = new Float32Array(this.fractionalThiranProcess(m))), m;
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
              var u = this.intDelay - this.posWrite;
              this.posRead = this.buffer.length - u;
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
          value: function(u) {
            for (var m = new Float32Array(u.length), w, v, h = this.fracXi1, y = this.fracYi1, b = 0; b < u.length; b = b + 1)
              w = u[b], v = this.a1 * w + h - this.a1 * y, h = w, y = v, m[b] = v;
            return this.fracXi1 = h, this.fracYi1 = y, m;
          }
        }]), t;
      })();
      c.default = i, n.exports = c.default;
    }, { "babel-runtime/helpers/class-call-check": 2, "babel-runtime/helpers/create-class": 3 }], 7: [function(f, n, c) {
      n.exports = f("./dist/fractional-delay");
    }, { "./dist/fractional-delay": 6 }], 8: [function(f, n, c) {
      (function(r, i) {
        if (typeof c == "object" && typeof n == "object")
          n.exports = i();
        else {
          var t = i();
          for (var o in t) (typeof c == "object" ? c : r)[o] = t[o];
        }
      })(this, function() {
        return (
          /******/
          (function(a) {
            var r = {};
            function i(t) {
              if (r[t])
                return r[t].exports;
              var o = r[t] = {
                /******/
                i: t,
                /******/
                l: !1,
                /******/
                exports: {}
                /******/
              };
              return a[t].call(o.exports, o, o.exports, i), o.l = !0, o.exports;
            }
            return i.m = a, i.c = r, i.d = function(t, o, u) {
              i.o(t, o) || Object.defineProperty(t, o, {
                /******/
                configurable: !1,
                /******/
                enumerable: !0,
                /******/
                get: u
                /******/
              });
            }, i.n = function(t) {
              var o = t && t.__esModule ? (
                /******/
                (function() {
                  return t.default;
                })
              ) : (
                /******/
                (function() {
                  return t;
                })
              );
              return i.d(o, "a", o), o;
            }, i.o = function(t, o) {
              return Object.prototype.hasOwnProperty.call(t, o);
            }, i.p = "", i(i.s = 4);
          })([
            /* 0 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.setMatrixArrayType = o, r.toRadian = m, r.equals = w;
              var t = r.EPSILON = 1e-6;
              r.ARRAY_TYPE = typeof Float32Array < "u" ? Float32Array : Array, r.RANDOM = Math.random;
              function o(v) {
                r.ARRAY_TYPE = v;
              }
              var u = Math.PI / 180;
              function m(v) {
                return v * u;
              }
              function w(v, h) {
                return Math.abs(v - h) <= t * Math.max(1, Math.abs(v), Math.abs(h));
              }
            },
            /* 1 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = m, r.fromMat4 = w, r.clone = v, r.copy = h, r.fromValues = y, r.set = b, r.identity = E, r.transpose = j, r.invert = g, r.adjoint = d, r.determinant = R, r.multiply = L, r.translate = z, r.rotate = l, r.scale = S, r.fromTranslation = I, r.fromRotation = O, r.fromScaling = U, r.fromMat2d = Z, r.fromQuat = nr, r.normalFromMat4 = dr, r.projection = mr, r.str = or, r.frob = V, r.add = P, r.subtract = F, r.multiplyScalar = $, r.multiplyScalarAndAdd = rr, r.exactEquals = ir, r.equals = hr;
              var t = i(0), o = u(t);
              function u(D) {
                if (D && D.__esModule)
                  return D;
                var p = {};
                if (D != null)
                  for (var q in D)
                    Object.prototype.hasOwnProperty.call(D, q) && (p[q] = D[q]);
                return p.default = D, p;
              }
              function m() {
                var D = new o.ARRAY_TYPE(9);
                return D[0] = 1, D[1] = 0, D[2] = 0, D[3] = 0, D[4] = 1, D[5] = 0, D[6] = 0, D[7] = 0, D[8] = 1, D;
              }
              function w(D, p) {
                return D[0] = p[0], D[1] = p[1], D[2] = p[2], D[3] = p[4], D[4] = p[5], D[5] = p[6], D[6] = p[8], D[7] = p[9], D[8] = p[10], D;
              }
              function v(D) {
                var p = new o.ARRAY_TYPE(9);
                return p[0] = D[0], p[1] = D[1], p[2] = D[2], p[3] = D[3], p[4] = D[4], p[5] = D[5], p[6] = D[6], p[7] = D[7], p[8] = D[8], p;
              }
              function h(D, p) {
                return D[0] = p[0], D[1] = p[1], D[2] = p[2], D[3] = p[3], D[4] = p[4], D[5] = p[5], D[6] = p[6], D[7] = p[7], D[8] = p[8], D;
              }
              function y(D, p, q, H, Y, x, K, fr, vr) {
                var N = new o.ARRAY_TYPE(9);
                return N[0] = D, N[1] = p, N[2] = q, N[3] = H, N[4] = Y, N[5] = x, N[6] = K, N[7] = fr, N[8] = vr, N;
              }
              function b(D, p, q, H, Y, x, K, fr, vr, N) {
                return D[0] = p, D[1] = q, D[2] = H, D[3] = Y, D[4] = x, D[5] = K, D[6] = fr, D[7] = vr, D[8] = N, D;
              }
              function E(D) {
                return D[0] = 1, D[1] = 0, D[2] = 0, D[3] = 0, D[4] = 1, D[5] = 0, D[6] = 0, D[7] = 0, D[8] = 1, D;
              }
              function j(D, p) {
                if (D === p) {
                  var q = p[1], H = p[2], Y = p[5];
                  D[1] = p[3], D[2] = p[6], D[3] = q, D[5] = p[7], D[6] = H, D[7] = Y;
                } else
                  D[0] = p[0], D[1] = p[3], D[2] = p[6], D[3] = p[1], D[4] = p[4], D[5] = p[7], D[6] = p[2], D[7] = p[5], D[8] = p[8];
                return D;
              }
              function g(D, p) {
                var q = p[0], H = p[1], Y = p[2], x = p[3], K = p[4], fr = p[5], vr = p[6], N = p[7], Q = p[8], J = Q * K - fr * N, tr = -Q * x + fr * vr, cr = N * x - K * vr, e = q * J + H * tr + Y * cr;
                return e ? (e = 1 / e, D[0] = J * e, D[1] = (-Q * H + Y * N) * e, D[2] = (fr * H - Y * K) * e, D[3] = tr * e, D[4] = (Q * q - Y * vr) * e, D[5] = (-fr * q + Y * x) * e, D[6] = cr * e, D[7] = (-N * q + H * vr) * e, D[8] = (K * q - H * x) * e, D) : null;
              }
              function d(D, p) {
                var q = p[0], H = p[1], Y = p[2], x = p[3], K = p[4], fr = p[5], vr = p[6], N = p[7], Q = p[8];
                return D[0] = K * Q - fr * N, D[1] = Y * N - H * Q, D[2] = H * fr - Y * K, D[3] = fr * vr - x * Q, D[4] = q * Q - Y * vr, D[5] = Y * x - q * fr, D[6] = x * N - K * vr, D[7] = H * vr - q * N, D[8] = q * K - H * x, D;
              }
              function R(D) {
                var p = D[0], q = D[1], H = D[2], Y = D[3], x = D[4], K = D[5], fr = D[6], vr = D[7], N = D[8];
                return p * (N * x - K * vr) + q * (-N * Y + K * fr) + H * (vr * Y - x * fr);
              }
              function L(D, p, q) {
                var H = p[0], Y = p[1], x = p[2], K = p[3], fr = p[4], vr = p[5], N = p[6], Q = p[7], J = p[8], tr = q[0], cr = q[1], e = q[2], M = q[3], X = q[4], G = q[5], W = q[6], er = q[7], ar = q[8];
                return D[0] = tr * H + cr * K + e * N, D[1] = tr * Y + cr * fr + e * Q, D[2] = tr * x + cr * vr + e * J, D[3] = M * H + X * K + G * N, D[4] = M * Y + X * fr + G * Q, D[5] = M * x + X * vr + G * J, D[6] = W * H + er * K + ar * N, D[7] = W * Y + er * fr + ar * Q, D[8] = W * x + er * vr + ar * J, D;
              }
              function z(D, p, q) {
                var H = p[0], Y = p[1], x = p[2], K = p[3], fr = p[4], vr = p[5], N = p[6], Q = p[7], J = p[8], tr = q[0], cr = q[1];
                return D[0] = H, D[1] = Y, D[2] = x, D[3] = K, D[4] = fr, D[5] = vr, D[6] = tr * H + cr * K + N, D[7] = tr * Y + cr * fr + Q, D[8] = tr * x + cr * vr + J, D;
              }
              function l(D, p, q) {
                var H = p[0], Y = p[1], x = p[2], K = p[3], fr = p[4], vr = p[5], N = p[6], Q = p[7], J = p[8], tr = Math.sin(q), cr = Math.cos(q);
                return D[0] = cr * H + tr * K, D[1] = cr * Y + tr * fr, D[2] = cr * x + tr * vr, D[3] = cr * K - tr * H, D[4] = cr * fr - tr * Y, D[5] = cr * vr - tr * x, D[6] = N, D[7] = Q, D[8] = J, D;
              }
              function S(D, p, q) {
                var H = q[0], Y = q[1];
                return D[0] = H * p[0], D[1] = H * p[1], D[2] = H * p[2], D[3] = Y * p[3], D[4] = Y * p[4], D[5] = Y * p[5], D[6] = p[6], D[7] = p[7], D[8] = p[8], D;
              }
              function I(D, p) {
                return D[0] = 1, D[1] = 0, D[2] = 0, D[3] = 0, D[4] = 1, D[5] = 0, D[6] = p[0], D[7] = p[1], D[8] = 1, D;
              }
              function O(D, p) {
                var q = Math.sin(p), H = Math.cos(p);
                return D[0] = H, D[1] = q, D[2] = 0, D[3] = -q, D[4] = H, D[5] = 0, D[6] = 0, D[7] = 0, D[8] = 1, D;
              }
              function U(D, p) {
                return D[0] = p[0], D[1] = 0, D[2] = 0, D[3] = 0, D[4] = p[1], D[5] = 0, D[6] = 0, D[7] = 0, D[8] = 1, D;
              }
              function Z(D, p) {
                return D[0] = p[0], D[1] = p[1], D[2] = 0, D[3] = p[2], D[4] = p[3], D[5] = 0, D[6] = p[4], D[7] = p[5], D[8] = 1, D;
              }
              function nr(D, p) {
                var q = p[0], H = p[1], Y = p[2], x = p[3], K = q + q, fr = H + H, vr = Y + Y, N = q * K, Q = H * K, J = H * fr, tr = Y * K, cr = Y * fr, e = Y * vr, M = x * K, X = x * fr, G = x * vr;
                return D[0] = 1 - J - e, D[3] = Q - G, D[6] = tr + X, D[1] = Q + G, D[4] = 1 - N - e, D[7] = cr - M, D[2] = tr - X, D[5] = cr + M, D[8] = 1 - N - J, D;
              }
              function dr(D, p) {
                var q = p[0], H = p[1], Y = p[2], x = p[3], K = p[4], fr = p[5], vr = p[6], N = p[7], Q = p[8], J = p[9], tr = p[10], cr = p[11], e = p[12], M = p[13], X = p[14], G = p[15], W = q * fr - H * K, er = q * vr - Y * K, ar = q * N - x * K, sr = H * vr - Y * fr, lr = H * N - x * fr, ur = Y * N - x * vr, gr = Q * M - J * e, Mr = Q * X - tr * e, pr = Q * G - cr * e, wr = J * X - tr * M, Sr = J * G - cr * M, _r = tr * G - cr * X, yr = W * _r - er * Sr + ar * wr + sr * pr - lr * Mr + ur * gr;
                return yr ? (yr = 1 / yr, D[0] = (fr * _r - vr * Sr + N * wr) * yr, D[1] = (vr * pr - K * _r - N * Mr) * yr, D[2] = (K * Sr - fr * pr + N * gr) * yr, D[3] = (Y * Sr - H * _r - x * wr) * yr, D[4] = (q * _r - Y * pr + x * Mr) * yr, D[5] = (H * pr - q * Sr - x * gr) * yr, D[6] = (M * ur - X * lr + G * sr) * yr, D[7] = (X * ar - e * ur - G * er) * yr, D[8] = (e * lr - M * ar + G * W) * yr, D) : null;
              }
              function mr(D, p, q) {
                return D[0] = 2 / p, D[1] = 0, D[2] = 0, D[3] = 0, D[4] = -2 / q, D[5] = 0, D[6] = -1, D[7] = 1, D[8] = 1, D;
              }
              function or(D) {
                return "mat3(" + D[0] + ", " + D[1] + ", " + D[2] + ", " + D[3] + ", " + D[4] + ", " + D[5] + ", " + D[6] + ", " + D[7] + ", " + D[8] + ")";
              }
              function V(D) {
                return Math.sqrt(Math.pow(D[0], 2) + Math.pow(D[1], 2) + Math.pow(D[2], 2) + Math.pow(D[3], 2) + Math.pow(D[4], 2) + Math.pow(D[5], 2) + Math.pow(D[6], 2) + Math.pow(D[7], 2) + Math.pow(D[8], 2));
              }
              function P(D, p, q) {
                return D[0] = p[0] + q[0], D[1] = p[1] + q[1], D[2] = p[2] + q[2], D[3] = p[3] + q[3], D[4] = p[4] + q[4], D[5] = p[5] + q[5], D[6] = p[6] + q[6], D[7] = p[7] + q[7], D[8] = p[8] + q[8], D;
              }
              function F(D, p, q) {
                return D[0] = p[0] - q[0], D[1] = p[1] - q[1], D[2] = p[2] - q[2], D[3] = p[3] - q[3], D[4] = p[4] - q[4], D[5] = p[5] - q[5], D[6] = p[6] - q[6], D[7] = p[7] - q[7], D[8] = p[8] - q[8], D;
              }
              function $(D, p, q) {
                return D[0] = p[0] * q, D[1] = p[1] * q, D[2] = p[2] * q, D[3] = p[3] * q, D[4] = p[4] * q, D[5] = p[5] * q, D[6] = p[6] * q, D[7] = p[7] * q, D[8] = p[8] * q, D;
              }
              function rr(D, p, q, H) {
                return D[0] = p[0] + q[0] * H, D[1] = p[1] + q[1] * H, D[2] = p[2] + q[2] * H, D[3] = p[3] + q[3] * H, D[4] = p[4] + q[4] * H, D[5] = p[5] + q[5] * H, D[6] = p[6] + q[6] * H, D[7] = p[7] + q[7] * H, D[8] = p[8] + q[8] * H, D;
              }
              function ir(D, p) {
                return D[0] === p[0] && D[1] === p[1] && D[2] === p[2] && D[3] === p[3] && D[4] === p[4] && D[5] === p[5] && D[6] === p[6] && D[7] === p[7] && D[8] === p[8];
              }
              function hr(D, p) {
                var q = D[0], H = D[1], Y = D[2], x = D[3], K = D[4], fr = D[5], vr = D[6], N = D[7], Q = D[8], J = p[0], tr = p[1], cr = p[2], e = p[3], M = p[4], X = p[5], G = p[6], W = p[7], er = p[8];
                return Math.abs(q - J) <= o.EPSILON * Math.max(1, Math.abs(q), Math.abs(J)) && Math.abs(H - tr) <= o.EPSILON * Math.max(1, Math.abs(H), Math.abs(tr)) && Math.abs(Y - cr) <= o.EPSILON * Math.max(1, Math.abs(Y), Math.abs(cr)) && Math.abs(x - e) <= o.EPSILON * Math.max(1, Math.abs(x), Math.abs(e)) && Math.abs(K - M) <= o.EPSILON * Math.max(1, Math.abs(K), Math.abs(M)) && Math.abs(fr - X) <= o.EPSILON * Math.max(1, Math.abs(fr), Math.abs(X)) && Math.abs(vr - G) <= o.EPSILON * Math.max(1, Math.abs(vr), Math.abs(G)) && Math.abs(N - W) <= o.EPSILON * Math.max(1, Math.abs(N), Math.abs(W)) && Math.abs(Q - er) <= o.EPSILON * Math.max(1, Math.abs(Q), Math.abs(er));
              }
              r.mul = L, r.sub = F;
            },
            /* 2 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.forEach = r.sqrLen = r.len = r.sqrDist = r.dist = r.div = r.mul = r.sub = void 0, r.create = m, r.clone = w, r.length = v, r.fromValues = h, r.copy = y, r.set = b, r.add = E, r.subtract = j, r.multiply = g, r.divide = d, r.ceil = R, r.floor = L, r.min = z, r.max = l, r.round = S, r.scale = I, r.scaleAndAdd = O, r.distance = U, r.squaredDistance = Z, r.squaredLength = nr, r.negate = dr, r.inverse = mr, r.normalize = or, r.dot = V, r.cross = P, r.lerp = F, r.hermite = $, r.bezier = rr, r.random = ir, r.transformMat4 = hr, r.transformMat3 = D, r.transformQuat = p, r.rotateX = q, r.rotateY = H, r.rotateZ = Y, r.angle = x, r.str = K, r.exactEquals = fr, r.equals = vr;
              var t = i(0), o = u(t);
              function u(N) {
                if (N && N.__esModule)
                  return N;
                var Q = {};
                if (N != null)
                  for (var J in N)
                    Object.prototype.hasOwnProperty.call(N, J) && (Q[J] = N[J]);
                return Q.default = N, Q;
              }
              function m() {
                var N = new o.ARRAY_TYPE(3);
                return N[0] = 0, N[1] = 0, N[2] = 0, N;
              }
              function w(N) {
                var Q = new o.ARRAY_TYPE(3);
                return Q[0] = N[0], Q[1] = N[1], Q[2] = N[2], Q;
              }
              function v(N) {
                var Q = N[0], J = N[1], tr = N[2];
                return Math.sqrt(Q * Q + J * J + tr * tr);
              }
              function h(N, Q, J) {
                var tr = new o.ARRAY_TYPE(3);
                return tr[0] = N, tr[1] = Q, tr[2] = J, tr;
              }
              function y(N, Q) {
                return N[0] = Q[0], N[1] = Q[1], N[2] = Q[2], N;
              }
              function b(N, Q, J, tr) {
                return N[0] = Q, N[1] = J, N[2] = tr, N;
              }
              function E(N, Q, J) {
                return N[0] = Q[0] + J[0], N[1] = Q[1] + J[1], N[2] = Q[2] + J[2], N;
              }
              function j(N, Q, J) {
                return N[0] = Q[0] - J[0], N[1] = Q[1] - J[1], N[2] = Q[2] - J[2], N;
              }
              function g(N, Q, J) {
                return N[0] = Q[0] * J[0], N[1] = Q[1] * J[1], N[2] = Q[2] * J[2], N;
              }
              function d(N, Q, J) {
                return N[0] = Q[0] / J[0], N[1] = Q[1] / J[1], N[2] = Q[2] / J[2], N;
              }
              function R(N, Q) {
                return N[0] = Math.ceil(Q[0]), N[1] = Math.ceil(Q[1]), N[2] = Math.ceil(Q[2]), N;
              }
              function L(N, Q) {
                return N[0] = Math.floor(Q[0]), N[1] = Math.floor(Q[1]), N[2] = Math.floor(Q[2]), N;
              }
              function z(N, Q, J) {
                return N[0] = Math.min(Q[0], J[0]), N[1] = Math.min(Q[1], J[1]), N[2] = Math.min(Q[2], J[2]), N;
              }
              function l(N, Q, J) {
                return N[0] = Math.max(Q[0], J[0]), N[1] = Math.max(Q[1], J[1]), N[2] = Math.max(Q[2], J[2]), N;
              }
              function S(N, Q) {
                return N[0] = Math.round(Q[0]), N[1] = Math.round(Q[1]), N[2] = Math.round(Q[2]), N;
              }
              function I(N, Q, J) {
                return N[0] = Q[0] * J, N[1] = Q[1] * J, N[2] = Q[2] * J, N;
              }
              function O(N, Q, J, tr) {
                return N[0] = Q[0] + J[0] * tr, N[1] = Q[1] + J[1] * tr, N[2] = Q[2] + J[2] * tr, N;
              }
              function U(N, Q) {
                var J = Q[0] - N[0], tr = Q[1] - N[1], cr = Q[2] - N[2];
                return Math.sqrt(J * J + tr * tr + cr * cr);
              }
              function Z(N, Q) {
                var J = Q[0] - N[0], tr = Q[1] - N[1], cr = Q[2] - N[2];
                return J * J + tr * tr + cr * cr;
              }
              function nr(N) {
                var Q = N[0], J = N[1], tr = N[2];
                return Q * Q + J * J + tr * tr;
              }
              function dr(N, Q) {
                return N[0] = -Q[0], N[1] = -Q[1], N[2] = -Q[2], N;
              }
              function mr(N, Q) {
                return N[0] = 1 / Q[0], N[1] = 1 / Q[1], N[2] = 1 / Q[2], N;
              }
              function or(N, Q) {
                var J = Q[0], tr = Q[1], cr = Q[2], e = J * J + tr * tr + cr * cr;
                return e > 0 && (e = 1 / Math.sqrt(e), N[0] = Q[0] * e, N[1] = Q[1] * e, N[2] = Q[2] * e), N;
              }
              function V(N, Q) {
                return N[0] * Q[0] + N[1] * Q[1] + N[2] * Q[2];
              }
              function P(N, Q, J) {
                var tr = Q[0], cr = Q[1], e = Q[2], M = J[0], X = J[1], G = J[2];
                return N[0] = cr * G - e * X, N[1] = e * M - tr * G, N[2] = tr * X - cr * M, N;
              }
              function F(N, Q, J, tr) {
                var cr = Q[0], e = Q[1], M = Q[2];
                return N[0] = cr + tr * (J[0] - cr), N[1] = e + tr * (J[1] - e), N[2] = M + tr * (J[2] - M), N;
              }
              function $(N, Q, J, tr, cr, e) {
                var M = e * e, X = M * (2 * e - 3) + 1, G = M * (e - 2) + e, W = M * (e - 1), er = M * (3 - 2 * e);
                return N[0] = Q[0] * X + J[0] * G + tr[0] * W + cr[0] * er, N[1] = Q[1] * X + J[1] * G + tr[1] * W + cr[1] * er, N[2] = Q[2] * X + J[2] * G + tr[2] * W + cr[2] * er, N;
              }
              function rr(N, Q, J, tr, cr, e) {
                var M = 1 - e, X = M * M, G = e * e, W = X * M, er = 3 * e * X, ar = 3 * G * M, sr = G * e;
                return N[0] = Q[0] * W + J[0] * er + tr[0] * ar + cr[0] * sr, N[1] = Q[1] * W + J[1] * er + tr[1] * ar + cr[1] * sr, N[2] = Q[2] * W + J[2] * er + tr[2] * ar + cr[2] * sr, N;
              }
              function ir(N, Q) {
                Q = Q || 1;
                var J = o.RANDOM() * 2 * Math.PI, tr = o.RANDOM() * 2 - 1, cr = Math.sqrt(1 - tr * tr) * Q;
                return N[0] = Math.cos(J) * cr, N[1] = Math.sin(J) * cr, N[2] = tr * Q, N;
              }
              function hr(N, Q, J) {
                var tr = Q[0], cr = Q[1], e = Q[2], M = J[3] * tr + J[7] * cr + J[11] * e + J[15];
                return M = M || 1, N[0] = (J[0] * tr + J[4] * cr + J[8] * e + J[12]) / M, N[1] = (J[1] * tr + J[5] * cr + J[9] * e + J[13]) / M, N[2] = (J[2] * tr + J[6] * cr + J[10] * e + J[14]) / M, N;
              }
              function D(N, Q, J) {
                var tr = Q[0], cr = Q[1], e = Q[2];
                return N[0] = tr * J[0] + cr * J[3] + e * J[6], N[1] = tr * J[1] + cr * J[4] + e * J[7], N[2] = tr * J[2] + cr * J[5] + e * J[8], N;
              }
              function p(N, Q, J) {
                var tr = Q[0], cr = Q[1], e = Q[2], M = J[0], X = J[1], G = J[2], W = J[3], er = W * tr + X * e - G * cr, ar = W * cr + G * tr - M * e, sr = W * e + M * cr - X * tr, lr = -M * tr - X * cr - G * e;
                return N[0] = er * W + lr * -M + ar * -G - sr * -X, N[1] = ar * W + lr * -X + sr * -M - er * -G, N[2] = sr * W + lr * -G + er * -X - ar * -M, N;
              }
              function q(N, Q, J, tr) {
                var cr = [], e = [];
                return cr[0] = Q[0] - J[0], cr[1] = Q[1] - J[1], cr[2] = Q[2] - J[2], e[0] = cr[0], e[1] = cr[1] * Math.cos(tr) - cr[2] * Math.sin(tr), e[2] = cr[1] * Math.sin(tr) + cr[2] * Math.cos(tr), N[0] = e[0] + J[0], N[1] = e[1] + J[1], N[2] = e[2] + J[2], N;
              }
              function H(N, Q, J, tr) {
                var cr = [], e = [];
                return cr[0] = Q[0] - J[0], cr[1] = Q[1] - J[1], cr[2] = Q[2] - J[2], e[0] = cr[2] * Math.sin(tr) + cr[0] * Math.cos(tr), e[1] = cr[1], e[2] = cr[2] * Math.cos(tr) - cr[0] * Math.sin(tr), N[0] = e[0] + J[0], N[1] = e[1] + J[1], N[2] = e[2] + J[2], N;
              }
              function Y(N, Q, J, tr) {
                var cr = [], e = [];
                return cr[0] = Q[0] - J[0], cr[1] = Q[1] - J[1], cr[2] = Q[2] - J[2], e[0] = cr[0] * Math.cos(tr) - cr[1] * Math.sin(tr), e[1] = cr[0] * Math.sin(tr) + cr[1] * Math.cos(tr), e[2] = cr[2], N[0] = e[0] + J[0], N[1] = e[1] + J[1], N[2] = e[2] + J[2], N;
              }
              function x(N, Q) {
                var J = h(N[0], N[1], N[2]), tr = h(Q[0], Q[1], Q[2]);
                or(J, J), or(tr, tr);
                var cr = V(J, tr);
                return cr > 1 ? 0 : cr < -1 ? Math.PI : Math.acos(cr);
              }
              function K(N) {
                return "vec3(" + N[0] + ", " + N[1] + ", " + N[2] + ")";
              }
              function fr(N, Q) {
                return N[0] === Q[0] && N[1] === Q[1] && N[2] === Q[2];
              }
              function vr(N, Q) {
                var J = N[0], tr = N[1], cr = N[2], e = Q[0], M = Q[1], X = Q[2];
                return Math.abs(J - e) <= o.EPSILON * Math.max(1, Math.abs(J), Math.abs(e)) && Math.abs(tr - M) <= o.EPSILON * Math.max(1, Math.abs(tr), Math.abs(M)) && Math.abs(cr - X) <= o.EPSILON * Math.max(1, Math.abs(cr), Math.abs(X));
              }
              r.sub = j, r.mul = g, r.div = d, r.dist = U, r.sqrDist = Z, r.len = v, r.sqrLen = nr, r.forEach = (function() {
                var N = m();
                return function(Q, J, tr, cr, e, M) {
                  var X = void 0, G = void 0;
                  for (J || (J = 3), tr || (tr = 0), cr ? G = Math.min(cr * J + tr, Q.length) : G = Q.length, X = tr; X < G; X += J)
                    N[0] = Q[X], N[1] = Q[X + 1], N[2] = Q[X + 2], e(N, N, M), Q[X] = N[0], Q[X + 1] = N[1], Q[X + 2] = N[2];
                  return Q;
                };
              })();
            },
            /* 3 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.forEach = r.sqrLen = r.len = r.sqrDist = r.dist = r.div = r.mul = r.sub = void 0, r.create = m, r.clone = w, r.fromValues = v, r.copy = h, r.set = y, r.add = b, r.subtract = E, r.multiply = j, r.divide = g, r.ceil = d, r.floor = R, r.min = L, r.max = z, r.round = l, r.scale = S, r.scaleAndAdd = I, r.distance = O, r.squaredDistance = U, r.length = Z, r.squaredLength = nr, r.negate = dr, r.inverse = mr, r.normalize = or, r.dot = V, r.lerp = P, r.random = F, r.transformMat4 = $, r.transformQuat = rr, r.str = ir, r.exactEquals = hr, r.equals = D;
              var t = i(0), o = u(t);
              function u(p) {
                if (p && p.__esModule)
                  return p;
                var q = {};
                if (p != null)
                  for (var H in p)
                    Object.prototype.hasOwnProperty.call(p, H) && (q[H] = p[H]);
                return q.default = p, q;
              }
              function m() {
                var p = new o.ARRAY_TYPE(4);
                return p[0] = 0, p[1] = 0, p[2] = 0, p[3] = 0, p;
              }
              function w(p) {
                var q = new o.ARRAY_TYPE(4);
                return q[0] = p[0], q[1] = p[1], q[2] = p[2], q[3] = p[3], q;
              }
              function v(p, q, H, Y) {
                var x = new o.ARRAY_TYPE(4);
                return x[0] = p, x[1] = q, x[2] = H, x[3] = Y, x;
              }
              function h(p, q) {
                return p[0] = q[0], p[1] = q[1], p[2] = q[2], p[3] = q[3], p;
              }
              function y(p, q, H, Y, x) {
                return p[0] = q, p[1] = H, p[2] = Y, p[3] = x, p;
              }
              function b(p, q, H) {
                return p[0] = q[0] + H[0], p[1] = q[1] + H[1], p[2] = q[2] + H[2], p[3] = q[3] + H[3], p;
              }
              function E(p, q, H) {
                return p[0] = q[0] - H[0], p[1] = q[1] - H[1], p[2] = q[2] - H[2], p[3] = q[3] - H[3], p;
              }
              function j(p, q, H) {
                return p[0] = q[0] * H[0], p[1] = q[1] * H[1], p[2] = q[2] * H[2], p[3] = q[3] * H[3], p;
              }
              function g(p, q, H) {
                return p[0] = q[0] / H[0], p[1] = q[1] / H[1], p[2] = q[2] / H[2], p[3] = q[3] / H[3], p;
              }
              function d(p, q) {
                return p[0] = Math.ceil(q[0]), p[1] = Math.ceil(q[1]), p[2] = Math.ceil(q[2]), p[3] = Math.ceil(q[3]), p;
              }
              function R(p, q) {
                return p[0] = Math.floor(q[0]), p[1] = Math.floor(q[1]), p[2] = Math.floor(q[2]), p[3] = Math.floor(q[3]), p;
              }
              function L(p, q, H) {
                return p[0] = Math.min(q[0], H[0]), p[1] = Math.min(q[1], H[1]), p[2] = Math.min(q[2], H[2]), p[3] = Math.min(q[3], H[3]), p;
              }
              function z(p, q, H) {
                return p[0] = Math.max(q[0], H[0]), p[1] = Math.max(q[1], H[1]), p[2] = Math.max(q[2], H[2]), p[3] = Math.max(q[3], H[3]), p;
              }
              function l(p, q) {
                return p[0] = Math.round(q[0]), p[1] = Math.round(q[1]), p[2] = Math.round(q[2]), p[3] = Math.round(q[3]), p;
              }
              function S(p, q, H) {
                return p[0] = q[0] * H, p[1] = q[1] * H, p[2] = q[2] * H, p[3] = q[3] * H, p;
              }
              function I(p, q, H, Y) {
                return p[0] = q[0] + H[0] * Y, p[1] = q[1] + H[1] * Y, p[2] = q[2] + H[2] * Y, p[3] = q[3] + H[3] * Y, p;
              }
              function O(p, q) {
                var H = q[0] - p[0], Y = q[1] - p[1], x = q[2] - p[2], K = q[3] - p[3];
                return Math.sqrt(H * H + Y * Y + x * x + K * K);
              }
              function U(p, q) {
                var H = q[0] - p[0], Y = q[1] - p[1], x = q[2] - p[2], K = q[3] - p[3];
                return H * H + Y * Y + x * x + K * K;
              }
              function Z(p) {
                var q = p[0], H = p[1], Y = p[2], x = p[3];
                return Math.sqrt(q * q + H * H + Y * Y + x * x);
              }
              function nr(p) {
                var q = p[0], H = p[1], Y = p[2], x = p[3];
                return q * q + H * H + Y * Y + x * x;
              }
              function dr(p, q) {
                return p[0] = -q[0], p[1] = -q[1], p[2] = -q[2], p[3] = -q[3], p;
              }
              function mr(p, q) {
                return p[0] = 1 / q[0], p[1] = 1 / q[1], p[2] = 1 / q[2], p[3] = 1 / q[3], p;
              }
              function or(p, q) {
                var H = q[0], Y = q[1], x = q[2], K = q[3], fr = H * H + Y * Y + x * x + K * K;
                return fr > 0 && (fr = 1 / Math.sqrt(fr), p[0] = H * fr, p[1] = Y * fr, p[2] = x * fr, p[3] = K * fr), p;
              }
              function V(p, q) {
                return p[0] * q[0] + p[1] * q[1] + p[2] * q[2] + p[3] * q[3];
              }
              function P(p, q, H, Y) {
                var x = q[0], K = q[1], fr = q[2], vr = q[3];
                return p[0] = x + Y * (H[0] - x), p[1] = K + Y * (H[1] - K), p[2] = fr + Y * (H[2] - fr), p[3] = vr + Y * (H[3] - vr), p;
              }
              function F(p, q) {
                return q = q || 1, p[0] = o.RANDOM(), p[1] = o.RANDOM(), p[2] = o.RANDOM(), p[3] = o.RANDOM(), or(p, p), S(p, p, q), p;
              }
              function $(p, q, H) {
                var Y = q[0], x = q[1], K = q[2], fr = q[3];
                return p[0] = H[0] * Y + H[4] * x + H[8] * K + H[12] * fr, p[1] = H[1] * Y + H[5] * x + H[9] * K + H[13] * fr, p[2] = H[2] * Y + H[6] * x + H[10] * K + H[14] * fr, p[3] = H[3] * Y + H[7] * x + H[11] * K + H[15] * fr, p;
              }
              function rr(p, q, H) {
                var Y = q[0], x = q[1], K = q[2], fr = H[0], vr = H[1], N = H[2], Q = H[3], J = Q * Y + vr * K - N * x, tr = Q * x + N * Y - fr * K, cr = Q * K + fr * x - vr * Y, e = -fr * Y - vr * x - N * K;
                return p[0] = J * Q + e * -fr + tr * -N - cr * -vr, p[1] = tr * Q + e * -vr + cr * -fr - J * -N, p[2] = cr * Q + e * -N + J * -vr - tr * -fr, p[3] = q[3], p;
              }
              function ir(p) {
                return "vec4(" + p[0] + ", " + p[1] + ", " + p[2] + ", " + p[3] + ")";
              }
              function hr(p, q) {
                return p[0] === q[0] && p[1] === q[1] && p[2] === q[2] && p[3] === q[3];
              }
              function D(p, q) {
                var H = p[0], Y = p[1], x = p[2], K = p[3], fr = q[0], vr = q[1], N = q[2], Q = q[3];
                return Math.abs(H - fr) <= o.EPSILON * Math.max(1, Math.abs(H), Math.abs(fr)) && Math.abs(Y - vr) <= o.EPSILON * Math.max(1, Math.abs(Y), Math.abs(vr)) && Math.abs(x - N) <= o.EPSILON * Math.max(1, Math.abs(x), Math.abs(N)) && Math.abs(K - Q) <= o.EPSILON * Math.max(1, Math.abs(K), Math.abs(Q));
              }
              r.sub = E, r.mul = j, r.div = g, r.dist = O, r.sqrDist = U, r.len = Z, r.sqrLen = nr, r.forEach = (function() {
                var p = m();
                return function(q, H, Y, x, K, fr) {
                  var vr = void 0, N = void 0;
                  for (H || (H = 4), Y || (Y = 0), x ? N = Math.min(x * H + Y, q.length) : N = q.length, vr = Y; vr < N; vr += H)
                    p[0] = q[vr], p[1] = q[vr + 1], p[2] = q[vr + 2], p[3] = q[vr + 3], K(p, p, fr), q[vr] = p[0], q[vr + 1] = p[1], q[vr + 2] = p[2], q[vr + 3] = p[3];
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
              var t = i(0), o = I(t), u = i(5), m = I(u), w = i(6), v = I(w), h = i(1), y = I(h), b = i(7), E = I(b), j = i(8), g = I(j), d = i(9), R = I(d), L = i(2), z = I(L), l = i(3), S = I(l);
              function I(O) {
                if (O && O.__esModule)
                  return O;
                var U = {};
                if (O != null)
                  for (var Z in O)
                    Object.prototype.hasOwnProperty.call(O, Z) && (U[Z] = O[Z]);
                return U.default = O, U;
              }
              r.glMatrix = o, r.mat2 = m, r.mat2d = v, r.mat3 = y, r.mat4 = E, r.quat = g, r.vec2 = R, r.vec3 = z, r.vec4 = S;
            },
            /* 5 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = m, r.clone = w, r.copy = v, r.identity = h, r.fromValues = y, r.set = b, r.transpose = E, r.invert = j, r.adjoint = g, r.determinant = d, r.multiply = R, r.rotate = L, r.scale = z, r.fromRotation = l, r.fromScaling = S, r.str = I, r.frob = O, r.LDU = U, r.add = Z, r.subtract = nr, r.exactEquals = dr, r.equals = mr, r.multiplyScalar = or, r.multiplyScalarAndAdd = V;
              var t = i(0), o = u(t);
              function u(P) {
                if (P && P.__esModule)
                  return P;
                var F = {};
                if (P != null)
                  for (var $ in P)
                    Object.prototype.hasOwnProperty.call(P, $) && (F[$] = P[$]);
                return F.default = P, F;
              }
              function m() {
                var P = new o.ARRAY_TYPE(4);
                return P[0] = 1, P[1] = 0, P[2] = 0, P[3] = 1, P;
              }
              function w(P) {
                var F = new o.ARRAY_TYPE(4);
                return F[0] = P[0], F[1] = P[1], F[2] = P[2], F[3] = P[3], F;
              }
              function v(P, F) {
                return P[0] = F[0], P[1] = F[1], P[2] = F[2], P[3] = F[3], P;
              }
              function h(P) {
                return P[0] = 1, P[1] = 0, P[2] = 0, P[3] = 1, P;
              }
              function y(P, F, $, rr) {
                var ir = new o.ARRAY_TYPE(4);
                return ir[0] = P, ir[1] = F, ir[2] = $, ir[3] = rr, ir;
              }
              function b(P, F, $, rr, ir) {
                return P[0] = F, P[1] = $, P[2] = rr, P[3] = ir, P;
              }
              function E(P, F) {
                if (P === F) {
                  var $ = F[1];
                  P[1] = F[2], P[2] = $;
                } else
                  P[0] = F[0], P[1] = F[2], P[2] = F[1], P[3] = F[3];
                return P;
              }
              function j(P, F) {
                var $ = F[0], rr = F[1], ir = F[2], hr = F[3], D = $ * hr - ir * rr;
                return D ? (D = 1 / D, P[0] = hr * D, P[1] = -rr * D, P[2] = -ir * D, P[3] = $ * D, P) : null;
              }
              function g(P, F) {
                var $ = F[0];
                return P[0] = F[3], P[1] = -F[1], P[2] = -F[2], P[3] = $, P;
              }
              function d(P) {
                return P[0] * P[3] - P[2] * P[1];
              }
              function R(P, F, $) {
                var rr = F[0], ir = F[1], hr = F[2], D = F[3], p = $[0], q = $[1], H = $[2], Y = $[3];
                return P[0] = rr * p + hr * q, P[1] = ir * p + D * q, P[2] = rr * H + hr * Y, P[3] = ir * H + D * Y, P;
              }
              function L(P, F, $) {
                var rr = F[0], ir = F[1], hr = F[2], D = F[3], p = Math.sin($), q = Math.cos($);
                return P[0] = rr * q + hr * p, P[1] = ir * q + D * p, P[2] = rr * -p + hr * q, P[3] = ir * -p + D * q, P;
              }
              function z(P, F, $) {
                var rr = F[0], ir = F[1], hr = F[2], D = F[3], p = $[0], q = $[1];
                return P[0] = rr * p, P[1] = ir * p, P[2] = hr * q, P[3] = D * q, P;
              }
              function l(P, F) {
                var $ = Math.sin(F), rr = Math.cos(F);
                return P[0] = rr, P[1] = $, P[2] = -$, P[3] = rr, P;
              }
              function S(P, F) {
                return P[0] = F[0], P[1] = 0, P[2] = 0, P[3] = F[1], P;
              }
              function I(P) {
                return "mat2(" + P[0] + ", " + P[1] + ", " + P[2] + ", " + P[3] + ")";
              }
              function O(P) {
                return Math.sqrt(Math.pow(P[0], 2) + Math.pow(P[1], 2) + Math.pow(P[2], 2) + Math.pow(P[3], 2));
              }
              function U(P, F, $, rr) {
                return P[2] = rr[2] / rr[0], $[0] = rr[0], $[1] = rr[1], $[3] = rr[3] - P[2] * $[1], [P, F, $];
              }
              function Z(P, F, $) {
                return P[0] = F[0] + $[0], P[1] = F[1] + $[1], P[2] = F[2] + $[2], P[3] = F[3] + $[3], P;
              }
              function nr(P, F, $) {
                return P[0] = F[0] - $[0], P[1] = F[1] - $[1], P[2] = F[2] - $[2], P[3] = F[3] - $[3], P;
              }
              function dr(P, F) {
                return P[0] === F[0] && P[1] === F[1] && P[2] === F[2] && P[3] === F[3];
              }
              function mr(P, F) {
                var $ = P[0], rr = P[1], ir = P[2], hr = P[3], D = F[0], p = F[1], q = F[2], H = F[3];
                return Math.abs($ - D) <= o.EPSILON * Math.max(1, Math.abs($), Math.abs(D)) && Math.abs(rr - p) <= o.EPSILON * Math.max(1, Math.abs(rr), Math.abs(p)) && Math.abs(ir - q) <= o.EPSILON * Math.max(1, Math.abs(ir), Math.abs(q)) && Math.abs(hr - H) <= o.EPSILON * Math.max(1, Math.abs(hr), Math.abs(H));
              }
              function or(P, F, $) {
                return P[0] = F[0] * $, P[1] = F[1] * $, P[2] = F[2] * $, P[3] = F[3] * $, P;
              }
              function V(P, F, $, rr) {
                return P[0] = F[0] + $[0] * rr, P[1] = F[1] + $[1] * rr, P[2] = F[2] + $[2] * rr, P[3] = F[3] + $[3] * rr, P;
              }
              r.mul = R, r.sub = nr;
            },
            /* 6 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = m, r.clone = w, r.copy = v, r.identity = h, r.fromValues = y, r.set = b, r.invert = E, r.determinant = j, r.multiply = g, r.rotate = d, r.scale = R, r.translate = L, r.fromRotation = z, r.fromScaling = l, r.fromTranslation = S, r.str = I, r.frob = O, r.add = U, r.subtract = Z, r.multiplyScalar = nr, r.multiplyScalarAndAdd = dr, r.exactEquals = mr, r.equals = or;
              var t = i(0), o = u(t);
              function u(V) {
                if (V && V.__esModule)
                  return V;
                var P = {};
                if (V != null)
                  for (var F in V)
                    Object.prototype.hasOwnProperty.call(V, F) && (P[F] = V[F]);
                return P.default = V, P;
              }
              function m() {
                var V = new o.ARRAY_TYPE(6);
                return V[0] = 1, V[1] = 0, V[2] = 0, V[3] = 1, V[4] = 0, V[5] = 0, V;
              }
              function w(V) {
                var P = new o.ARRAY_TYPE(6);
                return P[0] = V[0], P[1] = V[1], P[2] = V[2], P[3] = V[3], P[4] = V[4], P[5] = V[5], P;
              }
              function v(V, P) {
                return V[0] = P[0], V[1] = P[1], V[2] = P[2], V[3] = P[3], V[4] = P[4], V[5] = P[5], V;
              }
              function h(V) {
                return V[0] = 1, V[1] = 0, V[2] = 0, V[3] = 1, V[4] = 0, V[5] = 0, V;
              }
              function y(V, P, F, $, rr, ir) {
                var hr = new o.ARRAY_TYPE(6);
                return hr[0] = V, hr[1] = P, hr[2] = F, hr[3] = $, hr[4] = rr, hr[5] = ir, hr;
              }
              function b(V, P, F, $, rr, ir, hr) {
                return V[0] = P, V[1] = F, V[2] = $, V[3] = rr, V[4] = ir, V[5] = hr, V;
              }
              function E(V, P) {
                var F = P[0], $ = P[1], rr = P[2], ir = P[3], hr = P[4], D = P[5], p = F * ir - $ * rr;
                return p ? (p = 1 / p, V[0] = ir * p, V[1] = -$ * p, V[2] = -rr * p, V[3] = F * p, V[4] = (rr * D - ir * hr) * p, V[5] = ($ * hr - F * D) * p, V) : null;
              }
              function j(V) {
                return V[0] * V[3] - V[1] * V[2];
              }
              function g(V, P, F) {
                var $ = P[0], rr = P[1], ir = P[2], hr = P[3], D = P[4], p = P[5], q = F[0], H = F[1], Y = F[2], x = F[3], K = F[4], fr = F[5];
                return V[0] = $ * q + ir * H, V[1] = rr * q + hr * H, V[2] = $ * Y + ir * x, V[3] = rr * Y + hr * x, V[4] = $ * K + ir * fr + D, V[5] = rr * K + hr * fr + p, V;
              }
              function d(V, P, F) {
                var $ = P[0], rr = P[1], ir = P[2], hr = P[3], D = P[4], p = P[5], q = Math.sin(F), H = Math.cos(F);
                return V[0] = $ * H + ir * q, V[1] = rr * H + hr * q, V[2] = $ * -q + ir * H, V[3] = rr * -q + hr * H, V[4] = D, V[5] = p, V;
              }
              function R(V, P, F) {
                var $ = P[0], rr = P[1], ir = P[2], hr = P[3], D = P[4], p = P[5], q = F[0], H = F[1];
                return V[0] = $ * q, V[1] = rr * q, V[2] = ir * H, V[3] = hr * H, V[4] = D, V[5] = p, V;
              }
              function L(V, P, F) {
                var $ = P[0], rr = P[1], ir = P[2], hr = P[3], D = P[4], p = P[5], q = F[0], H = F[1];
                return V[0] = $, V[1] = rr, V[2] = ir, V[3] = hr, V[4] = $ * q + ir * H + D, V[5] = rr * q + hr * H + p, V;
              }
              function z(V, P) {
                var F = Math.sin(P), $ = Math.cos(P);
                return V[0] = $, V[1] = F, V[2] = -F, V[3] = $, V[4] = 0, V[5] = 0, V;
              }
              function l(V, P) {
                return V[0] = P[0], V[1] = 0, V[2] = 0, V[3] = P[1], V[4] = 0, V[5] = 0, V;
              }
              function S(V, P) {
                return V[0] = 1, V[1] = 0, V[2] = 0, V[3] = 1, V[4] = P[0], V[5] = P[1], V;
              }
              function I(V) {
                return "mat2d(" + V[0] + ", " + V[1] + ", " + V[2] + ", " + V[3] + ", " + V[4] + ", " + V[5] + ")";
              }
              function O(V) {
                return Math.sqrt(Math.pow(V[0], 2) + Math.pow(V[1], 2) + Math.pow(V[2], 2) + Math.pow(V[3], 2) + Math.pow(V[4], 2) + Math.pow(V[5], 2) + 1);
              }
              function U(V, P, F) {
                return V[0] = P[0] + F[0], V[1] = P[1] + F[1], V[2] = P[2] + F[2], V[3] = P[3] + F[3], V[4] = P[4] + F[4], V[5] = P[5] + F[5], V;
              }
              function Z(V, P, F) {
                return V[0] = P[0] - F[0], V[1] = P[1] - F[1], V[2] = P[2] - F[2], V[3] = P[3] - F[3], V[4] = P[4] - F[4], V[5] = P[5] - F[5], V;
              }
              function nr(V, P, F) {
                return V[0] = P[0] * F, V[1] = P[1] * F, V[2] = P[2] * F, V[3] = P[3] * F, V[4] = P[4] * F, V[5] = P[5] * F, V;
              }
              function dr(V, P, F, $) {
                return V[0] = P[0] + F[0] * $, V[1] = P[1] + F[1] * $, V[2] = P[2] + F[2] * $, V[3] = P[3] + F[3] * $, V[4] = P[4] + F[4] * $, V[5] = P[5] + F[5] * $, V;
              }
              function mr(V, P) {
                return V[0] === P[0] && V[1] === P[1] && V[2] === P[2] && V[3] === P[3] && V[4] === P[4] && V[5] === P[5];
              }
              function or(V, P) {
                var F = V[0], $ = V[1], rr = V[2], ir = V[3], hr = V[4], D = V[5], p = P[0], q = P[1], H = P[2], Y = P[3], x = P[4], K = P[5];
                return Math.abs(F - p) <= o.EPSILON * Math.max(1, Math.abs(F), Math.abs(p)) && Math.abs($ - q) <= o.EPSILON * Math.max(1, Math.abs($), Math.abs(q)) && Math.abs(rr - H) <= o.EPSILON * Math.max(1, Math.abs(rr), Math.abs(H)) && Math.abs(ir - Y) <= o.EPSILON * Math.max(1, Math.abs(ir), Math.abs(Y)) && Math.abs(hr - x) <= o.EPSILON * Math.max(1, Math.abs(hr), Math.abs(x)) && Math.abs(D - K) <= o.EPSILON * Math.max(1, Math.abs(D), Math.abs(K));
              }
              r.mul = g, r.sub = Z;
            },
            /* 7 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = m, r.clone = w, r.copy = v, r.fromValues = h, r.set = y, r.identity = b, r.transpose = E, r.invert = j, r.adjoint = g, r.determinant = d, r.multiply = R, r.translate = L, r.scale = z, r.rotate = l, r.rotateX = S, r.rotateY = I, r.rotateZ = O, r.fromTranslation = U, r.fromScaling = Z, r.fromRotation = nr, r.fromXRotation = dr, r.fromYRotation = mr, r.fromZRotation = or, r.fromRotationTranslation = V, r.getTranslation = P, r.getScaling = F, r.getRotation = $, r.fromRotationTranslationScale = rr, r.fromRotationTranslationScaleOrigin = ir, r.fromQuat = hr, r.frustum = D, r.perspective = p, r.perspectiveFromFieldOfView = q, r.ortho = H, r.lookAt = Y, r.targetTo = x, r.str = K, r.frob = fr, r.add = vr, r.subtract = N, r.multiplyScalar = Q, r.multiplyScalarAndAdd = J, r.exactEquals = tr, r.equals = cr;
              var t = i(0), o = u(t);
              function u(e) {
                if (e && e.__esModule)
                  return e;
                var M = {};
                if (e != null)
                  for (var X in e)
                    Object.prototype.hasOwnProperty.call(e, X) && (M[X] = e[X]);
                return M.default = e, M;
              }
              function m() {
                var e = new o.ARRAY_TYPE(16);
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function w(e) {
                var M = new o.ARRAY_TYPE(16);
                return M[0] = e[0], M[1] = e[1], M[2] = e[2], M[3] = e[3], M[4] = e[4], M[5] = e[5], M[6] = e[6], M[7] = e[7], M[8] = e[8], M[9] = e[9], M[10] = e[10], M[11] = e[11], M[12] = e[12], M[13] = e[13], M[14] = e[14], M[15] = e[15], M;
              }
              function v(e, M) {
                return e[0] = M[0], e[1] = M[1], e[2] = M[2], e[3] = M[3], e[4] = M[4], e[5] = M[5], e[6] = M[6], e[7] = M[7], e[8] = M[8], e[9] = M[9], e[10] = M[10], e[11] = M[11], e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15], e;
              }
              function h(e, M, X, G, W, er, ar, sr, lr, ur, gr, Mr, pr, wr, Sr, _r) {
                var yr = new o.ARRAY_TYPE(16);
                return yr[0] = e, yr[1] = M, yr[2] = X, yr[3] = G, yr[4] = W, yr[5] = er, yr[6] = ar, yr[7] = sr, yr[8] = lr, yr[9] = ur, yr[10] = gr, yr[11] = Mr, yr[12] = pr, yr[13] = wr, yr[14] = Sr, yr[15] = _r, yr;
              }
              function y(e, M, X, G, W, er, ar, sr, lr, ur, gr, Mr, pr, wr, Sr, _r, yr) {
                return e[0] = M, e[1] = X, e[2] = G, e[3] = W, e[4] = er, e[5] = ar, e[6] = sr, e[7] = lr, e[8] = ur, e[9] = gr, e[10] = Mr, e[11] = pr, e[12] = wr, e[13] = Sr, e[14] = _r, e[15] = yr, e;
              }
              function b(e) {
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function E(e, M) {
                if (e === M) {
                  var X = M[1], G = M[2], W = M[3], er = M[6], ar = M[7], sr = M[11];
                  e[1] = M[4], e[2] = M[8], e[3] = M[12], e[4] = X, e[6] = M[9], e[7] = M[13], e[8] = G, e[9] = er, e[11] = M[14], e[12] = W, e[13] = ar, e[14] = sr;
                } else
                  e[0] = M[0], e[1] = M[4], e[2] = M[8], e[3] = M[12], e[4] = M[1], e[5] = M[5], e[6] = M[9], e[7] = M[13], e[8] = M[2], e[9] = M[6], e[10] = M[10], e[11] = M[14], e[12] = M[3], e[13] = M[7], e[14] = M[11], e[15] = M[15];
                return e;
              }
              function j(e, M) {
                var X = M[0], G = M[1], W = M[2], er = M[3], ar = M[4], sr = M[5], lr = M[6], ur = M[7], gr = M[8], Mr = M[9], pr = M[10], wr = M[11], Sr = M[12], _r = M[13], yr = M[14], Tr = M[15], Er = X * sr - G * ar, Pr = X * lr - W * ar, Rr = X * ur - er * ar, br = G * lr - W * sr, Ar = G * ur - er * sr, jr = W * ur - er * lr, Lr = gr * _r - Mr * Sr, qr = gr * yr - pr * Sr, Or = gr * Tr - wr * Sr, Ir = Mr * yr - pr * _r, kr = Mr * Tr - wr * _r, zr = pr * Tr - wr * yr, Dr = Er * zr - Pr * kr + Rr * Ir + br * Or - Ar * qr + jr * Lr;
                return Dr ? (Dr = 1 / Dr, e[0] = (sr * zr - lr * kr + ur * Ir) * Dr, e[1] = (W * kr - G * zr - er * Ir) * Dr, e[2] = (_r * jr - yr * Ar + Tr * br) * Dr, e[3] = (pr * Ar - Mr * jr - wr * br) * Dr, e[4] = (lr * Or - ar * zr - ur * qr) * Dr, e[5] = (X * zr - W * Or + er * qr) * Dr, e[6] = (yr * Rr - Sr * jr - Tr * Pr) * Dr, e[7] = (gr * jr - pr * Rr + wr * Pr) * Dr, e[8] = (ar * kr - sr * Or + ur * Lr) * Dr, e[9] = (G * Or - X * kr - er * Lr) * Dr, e[10] = (Sr * Ar - _r * Rr + Tr * Er) * Dr, e[11] = (Mr * Rr - gr * Ar - wr * Er) * Dr, e[12] = (sr * qr - ar * Ir - lr * Lr) * Dr, e[13] = (X * Ir - G * qr + W * Lr) * Dr, e[14] = (_r * Pr - Sr * br - yr * Er) * Dr, e[15] = (gr * br - Mr * Pr + pr * Er) * Dr, e) : null;
              }
              function g(e, M) {
                var X = M[0], G = M[1], W = M[2], er = M[3], ar = M[4], sr = M[5], lr = M[6], ur = M[7], gr = M[8], Mr = M[9], pr = M[10], wr = M[11], Sr = M[12], _r = M[13], yr = M[14], Tr = M[15];
                return e[0] = sr * (pr * Tr - wr * yr) - Mr * (lr * Tr - ur * yr) + _r * (lr * wr - ur * pr), e[1] = -(G * (pr * Tr - wr * yr) - Mr * (W * Tr - er * yr) + _r * (W * wr - er * pr)), e[2] = G * (lr * Tr - ur * yr) - sr * (W * Tr - er * yr) + _r * (W * ur - er * lr), e[3] = -(G * (lr * wr - ur * pr) - sr * (W * wr - er * pr) + Mr * (W * ur - er * lr)), e[4] = -(ar * (pr * Tr - wr * yr) - gr * (lr * Tr - ur * yr) + Sr * (lr * wr - ur * pr)), e[5] = X * (pr * Tr - wr * yr) - gr * (W * Tr - er * yr) + Sr * (W * wr - er * pr), e[6] = -(X * (lr * Tr - ur * yr) - ar * (W * Tr - er * yr) + Sr * (W * ur - er * lr)), e[7] = X * (lr * wr - ur * pr) - ar * (W * wr - er * pr) + gr * (W * ur - er * lr), e[8] = ar * (Mr * Tr - wr * _r) - gr * (sr * Tr - ur * _r) + Sr * (sr * wr - ur * Mr), e[9] = -(X * (Mr * Tr - wr * _r) - gr * (G * Tr - er * _r) + Sr * (G * wr - er * Mr)), e[10] = X * (sr * Tr - ur * _r) - ar * (G * Tr - er * _r) + Sr * (G * ur - er * sr), e[11] = -(X * (sr * wr - ur * Mr) - ar * (G * wr - er * Mr) + gr * (G * ur - er * sr)), e[12] = -(ar * (Mr * yr - pr * _r) - gr * (sr * yr - lr * _r) + Sr * (sr * pr - lr * Mr)), e[13] = X * (Mr * yr - pr * _r) - gr * (G * yr - W * _r) + Sr * (G * pr - W * Mr), e[14] = -(X * (sr * yr - lr * _r) - ar * (G * yr - W * _r) + Sr * (G * lr - W * sr)), e[15] = X * (sr * pr - lr * Mr) - ar * (G * pr - W * Mr) + gr * (G * lr - W * sr), e;
              }
              function d(e) {
                var M = e[0], X = e[1], G = e[2], W = e[3], er = e[4], ar = e[5], sr = e[6], lr = e[7], ur = e[8], gr = e[9], Mr = e[10], pr = e[11], wr = e[12], Sr = e[13], _r = e[14], yr = e[15], Tr = M * ar - X * er, Er = M * sr - G * er, Pr = M * lr - W * er, Rr = X * sr - G * ar, br = X * lr - W * ar, Ar = G * lr - W * sr, jr = ur * Sr - gr * wr, Lr = ur * _r - Mr * wr, qr = ur * yr - pr * wr, Or = gr * _r - Mr * Sr, Ir = gr * yr - pr * Sr, kr = Mr * yr - pr * _r;
                return Tr * kr - Er * Ir + Pr * Or + Rr * qr - br * Lr + Ar * jr;
              }
              function R(e, M, X) {
                var G = M[0], W = M[1], er = M[2], ar = M[3], sr = M[4], lr = M[5], ur = M[6], gr = M[7], Mr = M[8], pr = M[9], wr = M[10], Sr = M[11], _r = M[12], yr = M[13], Tr = M[14], Er = M[15], Pr = X[0], Rr = X[1], br = X[2], Ar = X[3];
                return e[0] = Pr * G + Rr * sr + br * Mr + Ar * _r, e[1] = Pr * W + Rr * lr + br * pr + Ar * yr, e[2] = Pr * er + Rr * ur + br * wr + Ar * Tr, e[3] = Pr * ar + Rr * gr + br * Sr + Ar * Er, Pr = X[4], Rr = X[5], br = X[6], Ar = X[7], e[4] = Pr * G + Rr * sr + br * Mr + Ar * _r, e[5] = Pr * W + Rr * lr + br * pr + Ar * yr, e[6] = Pr * er + Rr * ur + br * wr + Ar * Tr, e[7] = Pr * ar + Rr * gr + br * Sr + Ar * Er, Pr = X[8], Rr = X[9], br = X[10], Ar = X[11], e[8] = Pr * G + Rr * sr + br * Mr + Ar * _r, e[9] = Pr * W + Rr * lr + br * pr + Ar * yr, e[10] = Pr * er + Rr * ur + br * wr + Ar * Tr, e[11] = Pr * ar + Rr * gr + br * Sr + Ar * Er, Pr = X[12], Rr = X[13], br = X[14], Ar = X[15], e[12] = Pr * G + Rr * sr + br * Mr + Ar * _r, e[13] = Pr * W + Rr * lr + br * pr + Ar * yr, e[14] = Pr * er + Rr * ur + br * wr + Ar * Tr, e[15] = Pr * ar + Rr * gr + br * Sr + Ar * Er, e;
              }
              function L(e, M, X) {
                var G = X[0], W = X[1], er = X[2], ar = void 0, sr = void 0, lr = void 0, ur = void 0, gr = void 0, Mr = void 0, pr = void 0, wr = void 0, Sr = void 0, _r = void 0, yr = void 0, Tr = void 0;
                return M === e ? (e[12] = M[0] * G + M[4] * W + M[8] * er + M[12], e[13] = M[1] * G + M[5] * W + M[9] * er + M[13], e[14] = M[2] * G + M[6] * W + M[10] * er + M[14], e[15] = M[3] * G + M[7] * W + M[11] * er + M[15]) : (ar = M[0], sr = M[1], lr = M[2], ur = M[3], gr = M[4], Mr = M[5], pr = M[6], wr = M[7], Sr = M[8], _r = M[9], yr = M[10], Tr = M[11], e[0] = ar, e[1] = sr, e[2] = lr, e[3] = ur, e[4] = gr, e[5] = Mr, e[6] = pr, e[7] = wr, e[8] = Sr, e[9] = _r, e[10] = yr, e[11] = Tr, e[12] = ar * G + gr * W + Sr * er + M[12], e[13] = sr * G + Mr * W + _r * er + M[13], e[14] = lr * G + pr * W + yr * er + M[14], e[15] = ur * G + wr * W + Tr * er + M[15]), e;
              }
              function z(e, M, X) {
                var G = X[0], W = X[1], er = X[2];
                return e[0] = M[0] * G, e[1] = M[1] * G, e[2] = M[2] * G, e[3] = M[3] * G, e[4] = M[4] * W, e[5] = M[5] * W, e[6] = M[6] * W, e[7] = M[7] * W, e[8] = M[8] * er, e[9] = M[9] * er, e[10] = M[10] * er, e[11] = M[11] * er, e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15], e;
              }
              function l(e, M, X, G) {
                var W = G[0], er = G[1], ar = G[2], sr = Math.sqrt(W * W + er * er + ar * ar), lr = void 0, ur = void 0, gr = void 0, Mr = void 0, pr = void 0, wr = void 0, Sr = void 0, _r = void 0, yr = void 0, Tr = void 0, Er = void 0, Pr = void 0, Rr = void 0, br = void 0, Ar = void 0, jr = void 0, Lr = void 0, qr = void 0, Or = void 0, Ir = void 0, kr = void 0, zr = void 0, Dr = void 0, Cr = void 0;
                return Math.abs(sr) < o.EPSILON ? null : (sr = 1 / sr, W *= sr, er *= sr, ar *= sr, lr = Math.sin(X), ur = Math.cos(X), gr = 1 - ur, Mr = M[0], pr = M[1], wr = M[2], Sr = M[3], _r = M[4], yr = M[5], Tr = M[6], Er = M[7], Pr = M[8], Rr = M[9], br = M[10], Ar = M[11], jr = W * W * gr + ur, Lr = er * W * gr + ar * lr, qr = ar * W * gr - er * lr, Or = W * er * gr - ar * lr, Ir = er * er * gr + ur, kr = ar * er * gr + W * lr, zr = W * ar * gr + er * lr, Dr = er * ar * gr - W * lr, Cr = ar * ar * gr + ur, e[0] = Mr * jr + _r * Lr + Pr * qr, e[1] = pr * jr + yr * Lr + Rr * qr, e[2] = wr * jr + Tr * Lr + br * qr, e[3] = Sr * jr + Er * Lr + Ar * qr, e[4] = Mr * Or + _r * Ir + Pr * kr, e[5] = pr * Or + yr * Ir + Rr * kr, e[6] = wr * Or + Tr * Ir + br * kr, e[7] = Sr * Or + Er * Ir + Ar * kr, e[8] = Mr * zr + _r * Dr + Pr * Cr, e[9] = pr * zr + yr * Dr + Rr * Cr, e[10] = wr * zr + Tr * Dr + br * Cr, e[11] = Sr * zr + Er * Dr + Ar * Cr, M !== e && (e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15]), e);
              }
              function S(e, M, X) {
                var G = Math.sin(X), W = Math.cos(X), er = M[4], ar = M[5], sr = M[6], lr = M[7], ur = M[8], gr = M[9], Mr = M[10], pr = M[11];
                return M !== e && (e[0] = M[0], e[1] = M[1], e[2] = M[2], e[3] = M[3], e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15]), e[4] = er * W + ur * G, e[5] = ar * W + gr * G, e[6] = sr * W + Mr * G, e[7] = lr * W + pr * G, e[8] = ur * W - er * G, e[9] = gr * W - ar * G, e[10] = Mr * W - sr * G, e[11] = pr * W - lr * G, e;
              }
              function I(e, M, X) {
                var G = Math.sin(X), W = Math.cos(X), er = M[0], ar = M[1], sr = M[2], lr = M[3], ur = M[8], gr = M[9], Mr = M[10], pr = M[11];
                return M !== e && (e[4] = M[4], e[5] = M[5], e[6] = M[6], e[7] = M[7], e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15]), e[0] = er * W - ur * G, e[1] = ar * W - gr * G, e[2] = sr * W - Mr * G, e[3] = lr * W - pr * G, e[8] = er * G + ur * W, e[9] = ar * G + gr * W, e[10] = sr * G + Mr * W, e[11] = lr * G + pr * W, e;
              }
              function O(e, M, X) {
                var G = Math.sin(X), W = Math.cos(X), er = M[0], ar = M[1], sr = M[2], lr = M[3], ur = M[4], gr = M[5], Mr = M[6], pr = M[7];
                return M !== e && (e[8] = M[8], e[9] = M[9], e[10] = M[10], e[11] = M[11], e[12] = M[12], e[13] = M[13], e[14] = M[14], e[15] = M[15]), e[0] = er * W + ur * G, e[1] = ar * W + gr * G, e[2] = sr * W + Mr * G, e[3] = lr * W + pr * G, e[4] = ur * W - er * G, e[5] = gr * W - ar * G, e[6] = Mr * W - sr * G, e[7] = pr * W - lr * G, e;
              }
              function U(e, M) {
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = M[0], e[13] = M[1], e[14] = M[2], e[15] = 1, e;
              }
              function Z(e, M) {
                return e[0] = M[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = M[1], e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = M[2], e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function nr(e, M, X) {
                var G = X[0], W = X[1], er = X[2], ar = Math.sqrt(G * G + W * W + er * er), sr = void 0, lr = void 0, ur = void 0;
                return Math.abs(ar) < o.EPSILON ? null : (ar = 1 / ar, G *= ar, W *= ar, er *= ar, sr = Math.sin(M), lr = Math.cos(M), ur = 1 - lr, e[0] = G * G * ur + lr, e[1] = W * G * ur + er * sr, e[2] = er * G * ur - W * sr, e[3] = 0, e[4] = G * W * ur - er * sr, e[5] = W * W * ur + lr, e[6] = er * W * ur + G * sr, e[7] = 0, e[8] = G * er * ur + W * sr, e[9] = W * er * ur - G * sr, e[10] = er * er * ur + lr, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e);
              }
              function dr(e, M) {
                var X = Math.sin(M), G = Math.cos(M);
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = G, e[6] = X, e[7] = 0, e[8] = 0, e[9] = -X, e[10] = G, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function mr(e, M) {
                var X = Math.sin(M), G = Math.cos(M);
                return e[0] = G, e[1] = 0, e[2] = -X, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = X, e[9] = 0, e[10] = G, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function or(e, M) {
                var X = Math.sin(M), G = Math.cos(M);
                return e[0] = G, e[1] = X, e[2] = 0, e[3] = 0, e[4] = -X, e[5] = G, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function V(e, M, X) {
                var G = M[0], W = M[1], er = M[2], ar = M[3], sr = G + G, lr = W + W, ur = er + er, gr = G * sr, Mr = G * lr, pr = G * ur, wr = W * lr, Sr = W * ur, _r = er * ur, yr = ar * sr, Tr = ar * lr, Er = ar * ur;
                return e[0] = 1 - (wr + _r), e[1] = Mr + Er, e[2] = pr - Tr, e[3] = 0, e[4] = Mr - Er, e[5] = 1 - (gr + _r), e[6] = Sr + yr, e[7] = 0, e[8] = pr + Tr, e[9] = Sr - yr, e[10] = 1 - (gr + wr), e[11] = 0, e[12] = X[0], e[13] = X[1], e[14] = X[2], e[15] = 1, e;
              }
              function P(e, M) {
                return e[0] = M[12], e[1] = M[13], e[2] = M[14], e;
              }
              function F(e, M) {
                var X = M[0], G = M[1], W = M[2], er = M[4], ar = M[5], sr = M[6], lr = M[8], ur = M[9], gr = M[10];
                return e[0] = Math.sqrt(X * X + G * G + W * W), e[1] = Math.sqrt(er * er + ar * ar + sr * sr), e[2] = Math.sqrt(lr * lr + ur * ur + gr * gr), e;
              }
              function $(e, M) {
                var X = M[0] + M[5] + M[10], G = 0;
                return X > 0 ? (G = Math.sqrt(X + 1) * 2, e[3] = 0.25 * G, e[0] = (M[6] - M[9]) / G, e[1] = (M[8] - M[2]) / G, e[2] = (M[1] - M[4]) / G) : M[0] > M[5] & M[0] > M[10] ? (G = Math.sqrt(1 + M[0] - M[5] - M[10]) * 2, e[3] = (M[6] - M[9]) / G, e[0] = 0.25 * G, e[1] = (M[1] + M[4]) / G, e[2] = (M[8] + M[2]) / G) : M[5] > M[10] ? (G = Math.sqrt(1 + M[5] - M[0] - M[10]) * 2, e[3] = (M[8] - M[2]) / G, e[0] = (M[1] + M[4]) / G, e[1] = 0.25 * G, e[2] = (M[6] + M[9]) / G) : (G = Math.sqrt(1 + M[10] - M[0] - M[5]) * 2, e[3] = (M[1] - M[4]) / G, e[0] = (M[8] + M[2]) / G, e[1] = (M[6] + M[9]) / G, e[2] = 0.25 * G), e;
              }
              function rr(e, M, X, G) {
                var W = M[0], er = M[1], ar = M[2], sr = M[3], lr = W + W, ur = er + er, gr = ar + ar, Mr = W * lr, pr = W * ur, wr = W * gr, Sr = er * ur, _r = er * gr, yr = ar * gr, Tr = sr * lr, Er = sr * ur, Pr = sr * gr, Rr = G[0], br = G[1], Ar = G[2];
                return e[0] = (1 - (Sr + yr)) * Rr, e[1] = (pr + Pr) * Rr, e[2] = (wr - Er) * Rr, e[3] = 0, e[4] = (pr - Pr) * br, e[5] = (1 - (Mr + yr)) * br, e[6] = (_r + Tr) * br, e[7] = 0, e[8] = (wr + Er) * Ar, e[9] = (_r - Tr) * Ar, e[10] = (1 - (Mr + Sr)) * Ar, e[11] = 0, e[12] = X[0], e[13] = X[1], e[14] = X[2], e[15] = 1, e;
              }
              function ir(e, M, X, G, W) {
                var er = M[0], ar = M[1], sr = M[2], lr = M[3], ur = er + er, gr = ar + ar, Mr = sr + sr, pr = er * ur, wr = er * gr, Sr = er * Mr, _r = ar * gr, yr = ar * Mr, Tr = sr * Mr, Er = lr * ur, Pr = lr * gr, Rr = lr * Mr, br = G[0], Ar = G[1], jr = G[2], Lr = W[0], qr = W[1], Or = W[2];
                return e[0] = (1 - (_r + Tr)) * br, e[1] = (wr + Rr) * br, e[2] = (Sr - Pr) * br, e[3] = 0, e[4] = (wr - Rr) * Ar, e[5] = (1 - (pr + Tr)) * Ar, e[6] = (yr + Er) * Ar, e[7] = 0, e[8] = (Sr + Pr) * jr, e[9] = (yr - Er) * jr, e[10] = (1 - (pr + _r)) * jr, e[11] = 0, e[12] = X[0] + Lr - (e[0] * Lr + e[4] * qr + e[8] * Or), e[13] = X[1] + qr - (e[1] * Lr + e[5] * qr + e[9] * Or), e[14] = X[2] + Or - (e[2] * Lr + e[6] * qr + e[10] * Or), e[15] = 1, e;
              }
              function hr(e, M) {
                var X = M[0], G = M[1], W = M[2], er = M[3], ar = X + X, sr = G + G, lr = W + W, ur = X * ar, gr = G * ar, Mr = G * sr, pr = W * ar, wr = W * sr, Sr = W * lr, _r = er * ar, yr = er * sr, Tr = er * lr;
                return e[0] = 1 - Mr - Sr, e[1] = gr + Tr, e[2] = pr - yr, e[3] = 0, e[4] = gr - Tr, e[5] = 1 - ur - Sr, e[6] = wr + _r, e[7] = 0, e[8] = pr + yr, e[9] = wr - _r, e[10] = 1 - ur - Mr, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function D(e, M, X, G, W, er, ar) {
                var sr = 1 / (X - M), lr = 1 / (W - G), ur = 1 / (er - ar);
                return e[0] = er * 2 * sr, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = er * 2 * lr, e[6] = 0, e[7] = 0, e[8] = (X + M) * sr, e[9] = (W + G) * lr, e[10] = (ar + er) * ur, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = ar * er * 2 * ur, e[15] = 0, e;
              }
              function p(e, M, X, G, W) {
                var er = 1 / Math.tan(M / 2), ar = 1 / (G - W);
                return e[0] = er / X, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = er, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = (W + G) * ar, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = 2 * W * G * ar, e[15] = 0, e;
              }
              function q(e, M, X, G) {
                var W = Math.tan(M.upDegrees * Math.PI / 180), er = Math.tan(M.downDegrees * Math.PI / 180), ar = Math.tan(M.leftDegrees * Math.PI / 180), sr = Math.tan(M.rightDegrees * Math.PI / 180), lr = 2 / (ar + sr), ur = 2 / (W + er);
                return e[0] = lr, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = ur, e[6] = 0, e[7] = 0, e[8] = -((ar - sr) * lr * 0.5), e[9] = (W - er) * ur * 0.5, e[10] = G / (X - G), e[11] = -1, e[12] = 0, e[13] = 0, e[14] = G * X / (X - G), e[15] = 0, e;
              }
              function H(e, M, X, G, W, er, ar) {
                var sr = 1 / (M - X), lr = 1 / (G - W), ur = 1 / (er - ar);
                return e[0] = -2 * sr, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * lr, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * ur, e[11] = 0, e[12] = (M + X) * sr, e[13] = (W + G) * lr, e[14] = (ar + er) * ur, e[15] = 1, e;
              }
              function Y(e, M, X, G) {
                var W = void 0, er = void 0, ar = void 0, sr = void 0, lr = void 0, ur = void 0, gr = void 0, Mr = void 0, pr = void 0, wr = void 0, Sr = M[0], _r = M[1], yr = M[2], Tr = G[0], Er = G[1], Pr = G[2], Rr = X[0], br = X[1], Ar = X[2];
                return Math.abs(Sr - Rr) < o.EPSILON && Math.abs(_r - br) < o.EPSILON && Math.abs(yr - Ar) < o.EPSILON ? mat4.identity(e) : (gr = Sr - Rr, Mr = _r - br, pr = yr - Ar, wr = 1 / Math.sqrt(gr * gr + Mr * Mr + pr * pr), gr *= wr, Mr *= wr, pr *= wr, W = Er * pr - Pr * Mr, er = Pr * gr - Tr * pr, ar = Tr * Mr - Er * gr, wr = Math.sqrt(W * W + er * er + ar * ar), wr ? (wr = 1 / wr, W *= wr, er *= wr, ar *= wr) : (W = 0, er = 0, ar = 0), sr = Mr * ar - pr * er, lr = pr * W - gr * ar, ur = gr * er - Mr * W, wr = Math.sqrt(sr * sr + lr * lr + ur * ur), wr ? (wr = 1 / wr, sr *= wr, lr *= wr, ur *= wr) : (sr = 0, lr = 0, ur = 0), e[0] = W, e[1] = sr, e[2] = gr, e[3] = 0, e[4] = er, e[5] = lr, e[6] = Mr, e[7] = 0, e[8] = ar, e[9] = ur, e[10] = pr, e[11] = 0, e[12] = -(W * Sr + er * _r + ar * yr), e[13] = -(sr * Sr + lr * _r + ur * yr), e[14] = -(gr * Sr + Mr * _r + pr * yr), e[15] = 1, e);
              }
              function x(e, M, X, G) {
                var W = M[0], er = M[1], ar = M[2], sr = G[0], lr = G[1], ur = G[2], gr = W - X[0], Mr = er - X[1], pr = ar - X[2], wr = gr * gr + Mr * Mr + pr * pr;
                wr > 0 && (wr = 1 / Math.sqrt(wr), gr *= wr, Mr *= wr, pr *= wr);
                var Sr = lr * pr - ur * Mr, _r = ur * gr - sr * pr, yr = sr * Mr - lr * gr;
                return e[0] = Sr, e[1] = _r, e[2] = yr, e[3] = 0, e[4] = Mr * yr - pr * _r, e[5] = pr * Sr - gr * yr, e[6] = gr * _r - Mr * Sr, e[7] = 0, e[8] = gr, e[9] = Mr, e[10] = pr, e[11] = 0, e[12] = W, e[13] = er, e[14] = ar, e[15] = 1, e;
              }
              function K(e) {
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
              function Q(e, M, X) {
                return e[0] = M[0] * X, e[1] = M[1] * X, e[2] = M[2] * X, e[3] = M[3] * X, e[4] = M[4] * X, e[5] = M[5] * X, e[6] = M[6] * X, e[7] = M[7] * X, e[8] = M[8] * X, e[9] = M[9] * X, e[10] = M[10] * X, e[11] = M[11] * X, e[12] = M[12] * X, e[13] = M[13] * X, e[14] = M[14] * X, e[15] = M[15] * X, e;
              }
              function J(e, M, X, G) {
                return e[0] = M[0] + X[0] * G, e[1] = M[1] + X[1] * G, e[2] = M[2] + X[2] * G, e[3] = M[3] + X[3] * G, e[4] = M[4] + X[4] * G, e[5] = M[5] + X[5] * G, e[6] = M[6] + X[6] * G, e[7] = M[7] + X[7] * G, e[8] = M[8] + X[8] * G, e[9] = M[9] + X[9] * G, e[10] = M[10] + X[10] * G, e[11] = M[11] + X[11] * G, e[12] = M[12] + X[12] * G, e[13] = M[13] + X[13] * G, e[14] = M[14] + X[14] * G, e[15] = M[15] + X[15] * G, e;
              }
              function tr(e, M) {
                return e[0] === M[0] && e[1] === M[1] && e[2] === M[2] && e[3] === M[3] && e[4] === M[4] && e[5] === M[5] && e[6] === M[6] && e[7] === M[7] && e[8] === M[8] && e[9] === M[9] && e[10] === M[10] && e[11] === M[11] && e[12] === M[12] && e[13] === M[13] && e[14] === M[14] && e[15] === M[15];
              }
              function cr(e, M) {
                var X = e[0], G = e[1], W = e[2], er = e[3], ar = e[4], sr = e[5], lr = e[6], ur = e[7], gr = e[8], Mr = e[9], pr = e[10], wr = e[11], Sr = e[12], _r = e[13], yr = e[14], Tr = e[15], Er = M[0], Pr = M[1], Rr = M[2], br = M[3], Ar = M[4], jr = M[5], Lr = M[6], qr = M[7], Or = M[8], Ir = M[9], kr = M[10], zr = M[11], Dr = M[12], Cr = M[13], Nr = M[14], Fr = M[15];
                return Math.abs(X - Er) <= o.EPSILON * Math.max(1, Math.abs(X), Math.abs(Er)) && Math.abs(G - Pr) <= o.EPSILON * Math.max(1, Math.abs(G), Math.abs(Pr)) && Math.abs(W - Rr) <= o.EPSILON * Math.max(1, Math.abs(W), Math.abs(Rr)) && Math.abs(er - br) <= o.EPSILON * Math.max(1, Math.abs(er), Math.abs(br)) && Math.abs(ar - Ar) <= o.EPSILON * Math.max(1, Math.abs(ar), Math.abs(Ar)) && Math.abs(sr - jr) <= o.EPSILON * Math.max(1, Math.abs(sr), Math.abs(jr)) && Math.abs(lr - Lr) <= o.EPSILON * Math.max(1, Math.abs(lr), Math.abs(Lr)) && Math.abs(ur - qr) <= o.EPSILON * Math.max(1, Math.abs(ur), Math.abs(qr)) && Math.abs(gr - Or) <= o.EPSILON * Math.max(1, Math.abs(gr), Math.abs(Or)) && Math.abs(Mr - Ir) <= o.EPSILON * Math.max(1, Math.abs(Mr), Math.abs(Ir)) && Math.abs(pr - kr) <= o.EPSILON * Math.max(1, Math.abs(pr), Math.abs(kr)) && Math.abs(wr - zr) <= o.EPSILON * Math.max(1, Math.abs(wr), Math.abs(zr)) && Math.abs(Sr - Dr) <= o.EPSILON * Math.max(1, Math.abs(Sr), Math.abs(Dr)) && Math.abs(_r - Cr) <= o.EPSILON * Math.max(1, Math.abs(_r), Math.abs(Cr)) && Math.abs(yr - Nr) <= o.EPSILON * Math.max(1, Math.abs(yr), Math.abs(Nr)) && Math.abs(Tr - Fr) <= o.EPSILON * Math.max(1, Math.abs(Tr), Math.abs(Fr));
              }
              r.mul = R, r.sub = N;
            },
            /* 8 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.setAxes = r.sqlerp = r.rotationTo = r.equals = r.exactEquals = r.normalize = r.sqrLen = r.squaredLength = r.len = r.length = r.lerp = r.dot = r.scale = r.mul = r.add = r.set = r.copy = r.fromValues = r.clone = void 0, r.create = E, r.identity = j, r.setAxisAngle = g, r.getAxisAngle = d, r.multiply = R, r.rotateX = L, r.rotateY = z, r.rotateZ = l, r.calculateW = S, r.slerp = I, r.invert = O, r.conjugate = U, r.fromMat3 = Z, r.fromEuler = nr, r.str = dr;
              var t = i(0), o = b(t), u = i(1), m = b(u), w = i(2), v = b(w), h = i(3), y = b(h);
              function b(P) {
                if (P && P.__esModule)
                  return P;
                var F = {};
                if (P != null)
                  for (var $ in P)
                    Object.prototype.hasOwnProperty.call(P, $) && (F[$] = P[$]);
                return F.default = P, F;
              }
              function E() {
                var P = new o.ARRAY_TYPE(4);
                return P[0] = 0, P[1] = 0, P[2] = 0, P[3] = 1, P;
              }
              function j(P) {
                return P[0] = 0, P[1] = 0, P[2] = 0, P[3] = 1, P;
              }
              function g(P, F, $) {
                $ = $ * 0.5;
                var rr = Math.sin($);
                return P[0] = rr * F[0], P[1] = rr * F[1], P[2] = rr * F[2], P[3] = Math.cos($), P;
              }
              function d(P, F) {
                var $ = Math.acos(F[3]) * 2, rr = Math.sin($ / 2);
                return rr != 0 ? (P[0] = F[0] / rr, P[1] = F[1] / rr, P[2] = F[2] / rr) : (P[0] = 1, P[1] = 0, P[2] = 0), $;
              }
              function R(P, F, $) {
                var rr = F[0], ir = F[1], hr = F[2], D = F[3], p = $[0], q = $[1], H = $[2], Y = $[3];
                return P[0] = rr * Y + D * p + ir * H - hr * q, P[1] = ir * Y + D * q + hr * p - rr * H, P[2] = hr * Y + D * H + rr * q - ir * p, P[3] = D * Y - rr * p - ir * q - hr * H, P;
              }
              function L(P, F, $) {
                $ *= 0.5;
                var rr = F[0], ir = F[1], hr = F[2], D = F[3], p = Math.sin($), q = Math.cos($);
                return P[0] = rr * q + D * p, P[1] = ir * q + hr * p, P[2] = hr * q - ir * p, P[3] = D * q - rr * p, P;
              }
              function z(P, F, $) {
                $ *= 0.5;
                var rr = F[0], ir = F[1], hr = F[2], D = F[3], p = Math.sin($), q = Math.cos($);
                return P[0] = rr * q - hr * p, P[1] = ir * q + D * p, P[2] = hr * q + rr * p, P[3] = D * q - ir * p, P;
              }
              function l(P, F, $) {
                $ *= 0.5;
                var rr = F[0], ir = F[1], hr = F[2], D = F[3], p = Math.sin($), q = Math.cos($);
                return P[0] = rr * q + ir * p, P[1] = ir * q - rr * p, P[2] = hr * q + D * p, P[3] = D * q - hr * p, P;
              }
              function S(P, F) {
                var $ = F[0], rr = F[1], ir = F[2];
                return P[0] = $, P[1] = rr, P[2] = ir, P[3] = Math.sqrt(Math.abs(1 - $ * $ - rr * rr - ir * ir)), P;
              }
              function I(P, F, $, rr) {
                var ir = F[0], hr = F[1], D = F[2], p = F[3], q = $[0], H = $[1], Y = $[2], x = $[3], K = void 0, fr = void 0, vr = void 0, N = void 0, Q = void 0;
                return fr = ir * q + hr * H + D * Y + p * x, fr < 0 && (fr = -fr, q = -q, H = -H, Y = -Y, x = -x), 1 - fr > 1e-6 ? (K = Math.acos(fr), vr = Math.sin(K), N = Math.sin((1 - rr) * K) / vr, Q = Math.sin(rr * K) / vr) : (N = 1 - rr, Q = rr), P[0] = N * ir + Q * q, P[1] = N * hr + Q * H, P[2] = N * D + Q * Y, P[3] = N * p + Q * x, P;
              }
              function O(P, F) {
                var $ = F[0], rr = F[1], ir = F[2], hr = F[3], D = $ * $ + rr * rr + ir * ir + hr * hr, p = D ? 1 / D : 0;
                return P[0] = -$ * p, P[1] = -rr * p, P[2] = -ir * p, P[3] = hr * p, P;
              }
              function U(P, F) {
                return P[0] = -F[0], P[1] = -F[1], P[2] = -F[2], P[3] = F[3], P;
              }
              function Z(P, F) {
                var $ = F[0] + F[4] + F[8], rr = void 0;
                if ($ > 0)
                  rr = Math.sqrt($ + 1), P[3] = 0.5 * rr, rr = 0.5 / rr, P[0] = (F[5] - F[7]) * rr, P[1] = (F[6] - F[2]) * rr, P[2] = (F[1] - F[3]) * rr;
                else {
                  var ir = 0;
                  F[4] > F[0] && (ir = 1), F[8] > F[ir * 3 + ir] && (ir = 2);
                  var hr = (ir + 1) % 3, D = (ir + 2) % 3;
                  rr = Math.sqrt(F[ir * 3 + ir] - F[hr * 3 + hr] - F[D * 3 + D] + 1), P[ir] = 0.5 * rr, rr = 0.5 / rr, P[3] = (F[hr * 3 + D] - F[D * 3 + hr]) * rr, P[hr] = (F[hr * 3 + ir] + F[ir * 3 + hr]) * rr, P[D] = (F[D * 3 + ir] + F[ir * 3 + D]) * rr;
                }
                return P;
              }
              function nr(P, F, $, rr) {
                var ir = 0.5 * Math.PI / 180;
                F *= ir, $ *= ir, rr *= ir;
                var hr = Math.sin(F), D = Math.cos(F), p = Math.sin($), q = Math.cos($), H = Math.sin(rr), Y = Math.cos(rr);
                return P[0] = hr * q * Y - D * p * H, P[1] = D * p * Y + hr * q * H, P[2] = D * q * H - hr * p * Y, P[3] = D * q * Y + hr * p * H, P;
              }
              function dr(P) {
                return "quat(" + P[0] + ", " + P[1] + ", " + P[2] + ", " + P[3] + ")";
              }
              r.clone = y.clone, r.fromValues = y.fromValues, r.copy = y.copy, r.set = y.set, r.add = y.add, r.mul = R, r.scale = y.scale, r.dot = y.dot, r.lerp = y.lerp;
              var mr = r.length = y.length;
              r.len = mr;
              var or = r.squaredLength = y.squaredLength;
              r.sqrLen = or;
              var V = r.normalize = y.normalize;
              r.exactEquals = y.exactEquals, r.equals = y.equals, r.rotationTo = (function() {
                var P = v.create(), F = v.fromValues(1, 0, 0), $ = v.fromValues(0, 1, 0);
                return function(rr, ir, hr) {
                  var D = v.dot(ir, hr);
                  return D < -0.999999 ? (v.cross(P, F, ir), v.len(P) < 1e-6 && v.cross(P, $, ir), v.normalize(P, P), g(rr, P, Math.PI), rr) : D > 0.999999 ? (rr[0] = 0, rr[1] = 0, rr[2] = 0, rr[3] = 1, rr) : (v.cross(P, ir, hr), rr[0] = P[0], rr[1] = P[1], rr[2] = P[2], rr[3] = 1 + D, V(rr, rr));
                };
              })(), r.sqlerp = (function() {
                var P = E(), F = E();
                return function($, rr, ir, hr, D, p) {
                  return I(P, rr, D, p), I(F, ir, hr, p), I($, P, F, 2 * p * (1 - p)), $;
                };
              })(), r.setAxes = (function() {
                var P = m.create();
                return function(F, $, rr, ir) {
                  return P[0] = rr[0], P[3] = rr[1], P[6] = rr[2], P[1] = ir[0], P[4] = ir[1], P[7] = ir[2], P[2] = -$[0], P[5] = -$[1], P[8] = -$[2], V(F, Z(F, P));
                };
              })();
            },
            /* 9 */
            /***/
            function(a, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.forEach = r.sqrLen = r.sqrDist = r.dist = r.div = r.mul = r.sub = r.len = void 0, r.create = m, r.clone = w, r.fromValues = v, r.copy = h, r.set = y, r.add = b, r.subtract = E, r.multiply = j, r.divide = g, r.ceil = d, r.floor = R, r.min = L, r.max = z, r.round = l, r.scale = S, r.scaleAndAdd = I, r.distance = O, r.squaredDistance = U, r.length = Z, r.squaredLength = nr, r.negate = dr, r.inverse = mr, r.normalize = or, r.dot = V, r.cross = P, r.lerp = F, r.random = $, r.transformMat2 = rr, r.transformMat2d = ir, r.transformMat3 = hr, r.transformMat4 = D, r.str = p, r.exactEquals = q, r.equals = H;
              var t = i(0), o = u(t);
              function u(Y) {
                if (Y && Y.__esModule)
                  return Y;
                var x = {};
                if (Y != null)
                  for (var K in Y)
                    Object.prototype.hasOwnProperty.call(Y, K) && (x[K] = Y[K]);
                return x.default = Y, x;
              }
              function m() {
                var Y = new o.ARRAY_TYPE(2);
                return Y[0] = 0, Y[1] = 0, Y;
              }
              function w(Y) {
                var x = new o.ARRAY_TYPE(2);
                return x[0] = Y[0], x[1] = Y[1], x;
              }
              function v(Y, x) {
                var K = new o.ARRAY_TYPE(2);
                return K[0] = Y, K[1] = x, K;
              }
              function h(Y, x) {
                return Y[0] = x[0], Y[1] = x[1], Y;
              }
              function y(Y, x, K) {
                return Y[0] = x, Y[1] = K, Y;
              }
              function b(Y, x, K) {
                return Y[0] = x[0] + K[0], Y[1] = x[1] + K[1], Y;
              }
              function E(Y, x, K) {
                return Y[0] = x[0] - K[0], Y[1] = x[1] - K[1], Y;
              }
              function j(Y, x, K) {
                return Y[0] = x[0] * K[0], Y[1] = x[1] * K[1], Y;
              }
              function g(Y, x, K) {
                return Y[0] = x[0] / K[0], Y[1] = x[1] / K[1], Y;
              }
              function d(Y, x) {
                return Y[0] = Math.ceil(x[0]), Y[1] = Math.ceil(x[1]), Y;
              }
              function R(Y, x) {
                return Y[0] = Math.floor(x[0]), Y[1] = Math.floor(x[1]), Y;
              }
              function L(Y, x, K) {
                return Y[0] = Math.min(x[0], K[0]), Y[1] = Math.min(x[1], K[1]), Y;
              }
              function z(Y, x, K) {
                return Y[0] = Math.max(x[0], K[0]), Y[1] = Math.max(x[1], K[1]), Y;
              }
              function l(Y, x) {
                return Y[0] = Math.round(x[0]), Y[1] = Math.round(x[1]), Y;
              }
              function S(Y, x, K) {
                return Y[0] = x[0] * K, Y[1] = x[1] * K, Y;
              }
              function I(Y, x, K, fr) {
                return Y[0] = x[0] + K[0] * fr, Y[1] = x[1] + K[1] * fr, Y;
              }
              function O(Y, x) {
                var K = x[0] - Y[0], fr = x[1] - Y[1];
                return Math.sqrt(K * K + fr * fr);
              }
              function U(Y, x) {
                var K = x[0] - Y[0], fr = x[1] - Y[1];
                return K * K + fr * fr;
              }
              function Z(Y) {
                var x = Y[0], K = Y[1];
                return Math.sqrt(x * x + K * K);
              }
              function nr(Y) {
                var x = Y[0], K = Y[1];
                return x * x + K * K;
              }
              function dr(Y, x) {
                return Y[0] = -x[0], Y[1] = -x[1], Y;
              }
              function mr(Y, x) {
                return Y[0] = 1 / x[0], Y[1] = 1 / x[1], Y;
              }
              function or(Y, x) {
                var K = x[0], fr = x[1], vr = K * K + fr * fr;
                return vr > 0 && (vr = 1 / Math.sqrt(vr), Y[0] = x[0] * vr, Y[1] = x[1] * vr), Y;
              }
              function V(Y, x) {
                return Y[0] * x[0] + Y[1] * x[1];
              }
              function P(Y, x, K) {
                var fr = x[0] * K[1] - x[1] * K[0];
                return Y[0] = Y[1] = 0, Y[2] = fr, Y;
              }
              function F(Y, x, K, fr) {
                var vr = x[0], N = x[1];
                return Y[0] = vr + fr * (K[0] - vr), Y[1] = N + fr * (K[1] - N), Y;
              }
              function $(Y, x) {
                x = x || 1;
                var K = o.RANDOM() * 2 * Math.PI;
                return Y[0] = Math.cos(K) * x, Y[1] = Math.sin(K) * x, Y;
              }
              function rr(Y, x, K) {
                var fr = x[0], vr = x[1];
                return Y[0] = K[0] * fr + K[2] * vr, Y[1] = K[1] * fr + K[3] * vr, Y;
              }
              function ir(Y, x, K) {
                var fr = x[0], vr = x[1];
                return Y[0] = K[0] * fr + K[2] * vr + K[4], Y[1] = K[1] * fr + K[3] * vr + K[5], Y;
              }
              function hr(Y, x, K) {
                var fr = x[0], vr = x[1];
                return Y[0] = K[0] * fr + K[3] * vr + K[6], Y[1] = K[1] * fr + K[4] * vr + K[7], Y;
              }
              function D(Y, x, K) {
                var fr = x[0], vr = x[1];
                return Y[0] = K[0] * fr + K[4] * vr + K[12], Y[1] = K[1] * fr + K[5] * vr + K[13], Y;
              }
              function p(Y) {
                return "vec2(" + Y[0] + ", " + Y[1] + ")";
              }
              function q(Y, x) {
                return Y[0] === x[0] && Y[1] === x[1];
              }
              function H(Y, x) {
                var K = Y[0], fr = Y[1], vr = x[0], N = x[1];
                return Math.abs(K - vr) <= o.EPSILON * Math.max(1, Math.abs(K), Math.abs(vr)) && Math.abs(fr - N) <= o.EPSILON * Math.max(1, Math.abs(fr), Math.abs(N));
              }
              r.len = Z, r.sub = E, r.mul = j, r.div = g, r.dist = O, r.sqrDist = U, r.sqrLen = nr, r.forEach = (function() {
                var Y = m();
                return function(x, K, fr, vr, N, Q) {
                  var J = void 0, tr = void 0;
                  for (K || (K = 2), fr || (fr = 0), vr ? tr = Math.min(vr * K + fr, x.length) : tr = x.length, J = fr; J < tr; J += K)
                    Y[0] = x[J], Y[1] = x[J + 1], N(Y, Y, Q), x[J] = Y[0], x[J + 1] = Y[1];
                  return x;
                };
              })();
            }
            /******/
          ])
        );
      });
    }, {}], 9: [function(f, n, c) {
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
      function a(t, o, u) {
        this.obj = t, this.left = null, this.right = null, this.parent = u, this.dimension = o;
      }
      function r(t, o, u) {
        var m = this;
        function w(v, h, y) {
          var b = h % u.length, E, j;
          return v.length === 0 ? null : v.length === 1 ? new a(v[0], b, y) : (v.sort(function(g, d) {
            return g[u[b]] - d[u[b]];
          }), E = Math.floor(v.length / 2), j = new a(v[E], b, y), j.left = w(v.slice(0, E), h + 1, j), j.right = w(v.slice(E + 1), h + 1, j), j);
        }
        this.root = w(t, 0, null), this.insert = function(v) {
          function h(j, g) {
            if (j === null)
              return g;
            var d = u[j.dimension];
            return v[d] < j.obj[d] ? h(j.left, j) : h(j.right, j);
          }
          var y = h(this.root, null), b, E;
          if (y === null) {
            this.root = new a(v, 0, null);
            return;
          }
          b = new a(v, (y.dimension + 1) % u.length, y), E = u[y.dimension], v[E] < y.obj[E] ? y.left = b : y.right = b;
        }, this.remove = function(v) {
          var h;
          function y(E) {
            if (E === null)
              return null;
            if (E.obj === v)
              return E;
            var j = u[E.dimension];
            return v[j] < E.obj[j] ? y(E.left) : y(E.right);
          }
          function b(E) {
            var j, g, d;
            function R(z, l) {
              var S, I, O, U, Z;
              return z === null ? null : (S = u[l], z.dimension === l ? z.right !== null ? R(z.right, l) : z : (I = z.obj[S], O = R(z.left, l), U = R(z.right, l), Z = z, O !== null && O.obj[S] > I && (Z = O), U !== null && U.obj[S] > Z.obj[S] && (Z = U), Z));
            }
            function L(z, l) {
              var S, I, O, U, Z;
              return z === null ? null : (S = u[l], z.dimension === l ? z.left !== null ? L(z.left, l) : z : (I = z.obj[S], O = L(z.left, l), U = L(z.right, l), Z = z, O !== null && O.obj[S] < I && (Z = O), U !== null && U.obj[S] < Z.obj[S] && (Z = U), Z));
            }
            if (E.left === null && E.right === null) {
              if (E.parent === null) {
                m.root = null;
                return;
              }
              d = u[E.parent.dimension], E.obj[d] < E.parent.obj[d] ? E.parent.left = null : E.parent.right = null;
              return;
            }
            E.left !== null ? j = R(E.left, E.dimension) : j = L(E.right, E.dimension), g = j.obj, b(j), E.obj = g;
          }
          h = y(m.root), h !== null && b(h);
        }, this.nearest = function(v, h, y) {
          var b, E, j;
          j = new i(
            function(d) {
              return -d[1];
            }
          );
          function g(d) {
            if (!m.root)
              return [];
            var R, L = u[d.dimension], z = o(v, d.obj), l = {}, S, I, O;
            function U(Z, nr) {
              j.push([Z, nr]), j.size() > h && j.pop();
            }
            for (O = 0; O < u.length; O += 1)
              O === d.dimension ? l[u[O]] = v[u[O]] : l[u[O]] = d.obj[u[O]];
            if (S = o(l, d.obj), d.right === null && d.left === null) {
              (j.size() < h || z < j.peek()[1]) && U(d, z);
              return;
            }
            d.right === null ? R = d.left : d.left === null ? R = d.right : v[L] < d.obj[L] ? R = d.left : R = d.right, g(R), (j.size() < h || z < j.peek()[1]) && U(d, z), (j.size() < h || Math.abs(S) < j.peek()[1]) && (R === d.left ? I = d.right : I = d.left, I !== null && g(I));
          }
          if (y)
            for (b = 0; b < h; b += 1)
              j.push([null, y]);
          for (g(m.root), E = [], b = 0; b < h && b < j.content.length; b += 1)
            j.content[b][0] && E.push([j.content[b][0].obj, j.content[b][1]]);
          return E;
        }, this.balanceFactor = function() {
          function v(y) {
            return y === null ? 0 : Math.max(v(y.left), v(y.right)) + 1;
          }
          function h(y) {
            return y === null ? 0 : h(y.left) + h(y.right) + 1;
          }
          return v(m.root) / (Math.log(h(m.root)) / Math.log(2));
        };
      }
      function i(t) {
        this.content = [], this.scoreFunction = t;
      }
      i.prototype = {
        push: function(t) {
          this.content.push(t), this.bubbleUp(this.content.length - 1);
        },
        pop: function() {
          var t = this.content[0], o = this.content.pop();
          return this.content.length > 0 && (this.content[0] = o, this.sinkDown(0)), t;
        },
        peek: function() {
          return this.content[0];
        },
        remove: function(t) {
          for (var o = this.content.length, u = 0; u < o; u++)
            if (this.content[u] == t) {
              var m = this.content.pop();
              u != o - 1 && (this.content[u] = m, this.scoreFunction(m) < this.scoreFunction(t) ? this.bubbleUp(u) : this.sinkDown(u));
              return;
            }
          throw new Error("Node not found.");
        },
        size: function() {
          return this.content.length;
        },
        bubbleUp: function(t) {
          for (var o = this.content[t]; t > 0; ) {
            var u = Math.floor((t + 1) / 2) - 1, m = this.content[u];
            if (this.scoreFunction(o) < this.scoreFunction(m))
              this.content[u] = o, this.content[t] = m, t = u;
            else
              break;
          }
        },
        sinkDown: function(t) {
          for (var o = this.content.length, u = this.content[t], m = this.scoreFunction(u); ; ) {
            var w = (t + 1) * 2, v = w - 1, h = null;
            if (v < o) {
              var y = this.content[v], b = this.scoreFunction(y);
              b < m && (h = v);
            }
            if (w < o) {
              var E = this.content[w], j = this.scoreFunction(E);
              j < (h == null ? m : b) && (h = w);
            }
            if (h != null)
              this.content[t] = this.content[h], this.content[h] = u, t = h;
            else
              break;
          }
        }
      }, n.exports = {
        createKdTree: function(t, o, u) {
          return new r(t, o, u);
        }
      };
    }, {}], 10: [function(f, n, c) {
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
    }, {}], 11: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      }), c.resampleFloat32Array = t;
      var a = f("fractional-delay"), r = i(a);
      function i(o) {
        return o && o.__esModule ? o : { default: o };
      }
      function t() {
        var o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, u = new Promise(function(m, w) {
          var v = o.inputSamples, h = o.inputSampleRate, y = typeof o.inputDelay < "u" ? o.inputDelay : 0, b = typeof o.outputSampleRate < "u" ? o.outputSampleRate : h;
          if (h === b && y === 0)
            m(new Float32Array(v));
          else
            try {
              var E = Math.ceil(v.length * b / h), j = new window.OfflineAudioContext(1, E, b), g = j.createBuffer(1, v.length, h), d = 1, R = new r.default(h, d);
              R.setDelay(y / h), g.getChannelData(0).set(R.process(v));
              var L = j.createBufferSource();
              L.buffer = g, L.connect(j.destination), L.start(), j.oncomplete = function(z) {
                var l = z.renderedBuffer.getChannelData(0);
                m(l);
              }, j.startRendering();
            } catch (z) {
              w(new Error("Unable to re-sample Float32Array. " + z.message));
            }
        });
        return u;
      }
      /**
       * @fileOverview Audio utilities
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      c.default = {
        resampleFloat32Array: t
      };
    }, { "fractional-delay": 7 }], 12: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      }), c.tree = void 0, c.distanceSquared = t, c.distance = o;
      var a = f("kd.tree"), r = i(a);
      function i(u) {
        return u && u.__esModule ? u : { default: u };
      }
      c.tree = r.default;
      /**
       * @fileOverview Helpers for k-d tree.
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      function t(u, m) {
        var w = m.x - u.x, v = m.y - u.y, h = m.z - u.z;
        return w * w + v * v + h * h;
      }
      function o(u, m) {
        return Math.sqrt(this.distanceSquared(u, m));
      }
      c.default = {
        distance: o,
        distanceSquared: t,
        tree: r.default
      };
    }, { "kd.tree": 9 }], 13: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      }), c.sofaCartesianToGl = t, c.glToSofaCartesian = o, c.sofaCartesianToSofaSpherical = u, c.sofaSphericalToSofaCartesian = m, c.sofaSphericalToGl = w, c.glToSofaSpherical = v, c.sofaToSofaCartesian = h, c.spat4CartesianToGl = y, c.glToSpat4Cartesian = b, c.spat4CartesianToSpat4Spherical = E, c.spat4SphericalToSpat4Cartesian = j, c.spat4SphericalToGl = g, c.glToSpat4Spherical = d, c.systemType = R, c.systemToGl = L, c.glToSystem = z;
      var a = f("./degree"), r = i(a);
      function i(l) {
        return l && l.__esModule ? l : { default: l };
      }
      function t(l, S) {
        var I = S[0], O = S[1], U = S[2];
        return l[0] = 0 - O, l[1] = U, l[2] = 0 - I, l;
      }
      /**
       * @fileOverview Coordinate systems conversions. openGL, SOFA, and Spat4 (Ircam).
       *
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      function o(l, S) {
        var I = S[0], O = S[1], U = S[2];
        return l[0] = 0 - U, l[1] = 0 - I, l[2] = O, l;
      }
      function u(l, S) {
        var I = S[0], O = S[1], U = S[2], Z = I * I + O * O;
        return l[0] = (r.default.atan2(O, I) + 360) % 360, l[1] = r.default.atan2(U, Math.sqrt(Z)), l[2] = Math.sqrt(Z + U * U), l;
      }
      function m(l, S) {
        var I = S[0], O = S[1], U = S[2], Z = r.default.cos(O);
        return l[0] = U * Z * r.default.cos(I), l[1] = U * Z * r.default.sin(I), l[2] = U * r.default.sin(O), l;
      }
      function w(l, S) {
        var I = S[0], O = S[1], U = S[2], Z = r.default.cos(O);
        return l[0] = 0 - U * Z * r.default.sin(I), l[1] = U * r.default.sin(O), l[2] = 0 - U * Z * r.default.cos(I), l;
      }
      function v(l, S) {
        var I = 0 - S[2], O = 0 - S[0], U = S[1], Z = I * I + O * O;
        return l[0] = (r.default.atan2(O, I) + 360) % 360, l[1] = r.default.atan2(U, Math.sqrt(Z)), l[2] = Math.sqrt(Z + U * U), l;
      }
      function h(l, S, I) {
        switch (I) {
          case "sofaCartesian":
            l[0] = S[0], l[1] = S[1], l[2] = S[2];
            break;
          case "sofaSpherical":
            m(l, S);
            break;
          default:
            throw new Error("Bad coordinate system");
        }
        return l;
      }
      function y(l, S) {
        var I = S[0], O = S[1], U = S[2];
        return l[0] = I, l[1] = U, l[2] = 0 - O, l;
      }
      function b(l, S) {
        var I = S[0], O = S[1], U = S[2];
        return l[0] = I, l[1] = 0 - U, l[2] = O, l;
      }
      function E(l, S) {
        var I = S[0], O = S[1], U = S[2], Z = I * I + O * O;
        return l[0] = r.default.atan2(I, O), l[1] = r.default.atan2(U, Math.sqrt(Z)), l[2] = Math.sqrt(Z + U * U), l;
      }
      function j(l, S) {
        var I = S[0], O = S[1], U = S[2], Z = r.default.cos(O);
        return l[0] = U * Z * r.default.sin(I), l[1] = U * Z * r.default.cos(I), l[2] = U * r.default.sin(O), l;
      }
      function g(l, S) {
        var I = S[0], O = S[1], U = S[2], Z = r.default.cos(O);
        return l[0] = U * Z * r.default.sin(I), l[1] = U * r.default.sin(O), l[2] = 0 - U * Z * r.default.cos(I), l;
      }
      function d(l, S) {
        var I = S[0], O = 0 - S[2], U = S[1], Z = I * I + O * O;
        return l[0] = r.default.atan2(I, O), l[1] = r.default.atan2(U, Math.sqrt(Z)), l[2] = Math.sqrt(Z + U * U), l;
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
      function L(l, S, I) {
        switch (I) {
          case "gl":
            l[0] = S[0], l[1] = S[1], l[2] = S[2];
            break;
          case "sofaCartesian":
            t(l, S);
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
      function z(l, S, I) {
        switch (I) {
          case "gl":
            l[0] = S[0], l[1] = S[1], l[2] = S[2];
            break;
          case "sofaCartesian":
            o(l, S);
            break;
          case "sofaSpherical":
            v(l, S);
            break;
          case "spat4Cartesian":
            b(l, S);
            break;
          case "spat4Spherical":
            d(l, S);
            break;
          default:
            throw new Error("Bad coordinate system");
        }
        return l;
      }
      c.default = {
        glToSofaCartesian: o,
        glToSofaSpherical: v,
        glToSpat4Cartesian: b,
        glToSpat4Spherical: d,
        glToSystem: z,
        sofaCartesianToGl: t,
        sofaCartesianToSofaSpherical: u,
        sofaSphericalToGl: w,
        sofaSphericalToSofaCartesian: m,
        sofaToSofaCartesian: h,
        spat4CartesianToGl: y,
        spat4CartesianToSpat4Spherical: E,
        spat4SphericalToGl: g,
        spat4SphericalToSpat4Cartesian: j,
        systemToGl: L,
        systemType: R
      };
    }, { "./degree": 14 }], 14: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      }), c.toRadian = i, c.fromRadian = t, c.cos = o, c.sin = u, c.atan2 = m;
      /**
       * @fileOverview Convert to and from degree
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var a = c.toRadianFactor = Math.PI / 180, r = c.fromRadianFactor = 1 / a;
      function i(w) {
        return w * a;
      }
      function t(w) {
        return w * r;
      }
      function o(w) {
        return Math.cos(w * a);
      }
      function u(w) {
        return Math.sin(w * a);
      }
      function m(w, v) {
        return Math.atan2(w, v) * r;
      }
      c.default = {
        atan2: m,
        cos: o,
        fromRadian: t,
        fromRadianFactor: r,
        sin: u,
        toRadian: i,
        toRadianFactor: a
      };
    }, {}], 15: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      }), c.ServerDataBase = c.HrtfSet = void 0;
      var a = f("./sofa/HrtfSet"), r = o(a), i = f("./sofa/ServerDataBase"), t = o(i);
      function o(u) {
        return u && u.__esModule ? u : { default: u };
      }
      c.HrtfSet = r.default, c.ServerDataBase = t.default, c.default = {
        HrtfSet: r.default,
        ServerDataBase: t.default
      };
    }, { "./sofa/HrtfSet": 17, "./sofa/ServerDataBase": 18 }], 16: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      }), c.version = c.name = c.license = c.description = void 0;
      var a = f("../package.json"), r = i(a);
      function i(w) {
        return w && w.__esModule ? w : { default: w };
      }
      var t = r.default.description;
      /**
       * @fileOverview Information on the library, from the `package.json` file.
       *
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      c.description = t;
      var o = r.default.license;
      c.license = o;
      var u = r.default.name;
      c.name = u;
      var m = r.default.version;
      c.version = m, c.default = {
        description: t,
        license: o,
        name: u,
        version: m
      };
    }, { "../package.json": 10 }], 17: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      }), c.HrtfSet = void 0;
      var a = /* @__PURE__ */ (function() {
        function L(z, l) {
          for (var S = 0; S < l.length; S++) {
            var I = l[S];
            I.enumerable = I.enumerable || !1, I.configurable = !0, "value" in I && (I.writable = !0), Object.defineProperty(z, I.key, I);
          }
        }
        return function(z, l, S) {
          return l && L(z.prototype, l), S && L(z, S), z;
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
      var r = f("gl-matrix"), i = j(r), t = f("../info"), o = E(t), u = f("./parseDataSet"), m = f("./parseSofa"), w = f("../geometry/coordinates"), v = E(w), h = f("../geometry/KdTree"), y = E(h), b = f("../audio/utilities");
      function E(L) {
        return L && L.__esModule ? L : { default: L };
      }
      function j(L) {
        if (L && L.__esModule)
          return L;
        var z = {};
        if (L != null)
          for (var l in L)
            Object.prototype.hasOwnProperty.call(L, l) && (z[l] = L[l]);
        return z.default = L, z;
      }
      function g(L) {
        if (Array.isArray(L)) {
          for (var z = 0, l = Array(L.length); z < L.length; z++)
            l[z] = L[z];
          return l;
        } else
          return Array.from(L);
      }
      function d(L, z) {
        if (!(L instanceof z))
          throw new TypeError("Cannot call a class as a function");
      }
      var R = c.HrtfSet = (function() {
        function L() {
          var z = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          d(this, L), this._audioContext = z.audioContext, this._ready = !1, this.coordinateSystem = z.coordinateSystem, this.filterCoordinateSystem = z.filterCoordinateSystem, this.filterPositions = z.filterPositions, this.filterAfterLoad = z.filterAfterLoad;
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
            var l = this, S = this._filterPositions.map(function(I) {
              return l._kdt.nearest({ x: I[0], y: I[1], z: I[2] }, 1).pop()[0];
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
            var S = this, I = l.split(".").pop(), O = I === "sofa" ? l + ".json" : l, U = void 0, Z = typeof this._filterPositions < "u" && !this.filterAfterLoad && I === "sofa";
            return Z ? U = Promise.all([this._loadMetaAndPositions(l), this._loadDataSet(l)]).then(function(nr) {
              var dr = nr[0], mr = nr[1];
              return S._loadSofaPartial(l, dr, mr).then(function() {
                return S._ready = !0, S;
              });
            }).catch(function() {
              return S._loadSofaFull(O).then(function() {
                return S.applyFilterPositions(), S._ready = !0, S;
              });
            }) : U = this._loadSofaFull(O).then(function() {
              return typeof S._filterPositions < "u" && S.filterAfterLoad && S.applyFilterPositions(), S._ready = !0, S;
            }), U;
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
            var l = this, S = void 0, I = v.default.systemType(this.filterCoordinateSystem);
            switch (I) {
              case "cartesian":
                S = this._sofaSourcePosition.map(function(U) {
                  return v.default.glToSofaCartesian([], U);
                });
                break;
              case "spherical":
                S = this._sofaSourcePosition.map(function(U) {
                  return v.default.glToSofaSpherical([], U);
                });
                break;
              default:
                throw new Error("Bad source position type " + I + " for export.");
            }
            var O = this._sofaSourcePosition.map(function(U) {
              for (var Z = l._kdt.nearest({ x: U[0], y: U[1], z: U[2] }, 1).pop()[0].fir, nr = [], dr = 0; dr < Z.numberOfChannels; ++dr)
                nr.push([].concat(g(Z.getChannelData(dr))));
              return nr;
            });
            return (0, m.stringifySofa)({
              name: this._sofaName,
              metaData: this._sofaMetaData,
              ListenerPosition: [0, 0, 0],
              ListenerPositionType: "cartesian",
              ListenerUp: [0, 0, 1],
              ListenerUpType: "cartesian",
              ListenerView: [1, 0, 0],
              ListenerViewType: "cartesian",
              SourcePositionType: I,
              SourcePosition: S,
              DataSamplingRate: this._audioContext.sampleRate,
              DataDelay: this._sofaDelay,
              DataIR: O,
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
            var S = v.default.systemToGl([], l, this.coordinateSystem), I = this._kdt.nearest({
              x: S[0],
              y: S[1],
              z: S[2]
            }, 1).pop(), O = I[0];
            return v.default.glToSystem(S, [O.x, O.y, O.z], this.coordinateSystem), {
              distance: I[1],
              fir: O.fir,
              index: O.index,
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
            var S = this, I = l.map(function(O) {
              var U = O[2], Z = S._audioContext.createBuffer(U.length, U[0].length, S._audioContext.sampleRate);
              return U.forEach(function(nr, dr) {
                Z.getChannelData(dr).set(nr);
              }), {
                index: O[0],
                x: O[1][0],
                y: O[1][1],
                z: O[1][2],
                fir: Z
              };
            });
            return this._sofaSourcePosition = I.map(function(O) {
              return [O.x, O.y, O.z];
            }), this._kdt = y.default.tree.createKdTree(I, y.default.distanceSquared, ["x", "y", "z"]), this;
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
          value: function(l, S, I, O) {
            var U = this, Z = I.map(function(nr, dr) {
              var mr = nr.length;
              if (mr !== 2)
                throw new Error("Bad number of channels" + (" for IR index " + l[dr]) + (" (" + mr + " instead of 2)"));
              if (O[0].length !== 2)
                throw new Error("Bad delay format" + (" for IR index " + l[dr]) + (" (first element in Data.Delay is " + O[0]) + " instead of [[delayL, delayR]] )");
              var or = typeof O[dr] < "u" ? O[dr] : O[0], V = nr.map(function(P, F) {
                if (or[F] < 0)
                  throw new Error("Negative delay detected (not handled at the moment):" + (" delay index " + l[dr]) + (" channel " + F));
                return (0, b.resampleFloat32Array)({
                  inputSamples: P,
                  inputDelay: or[F],
                  inputSampleRate: U._sofaSampleRate,
                  outputSampleRate: U._audioContext.sampleRate
                });
              });
              return Promise.all(V).then(function(P) {
                return [l[dr], S[dr], P];
              }).catch(function(P) {
                throw new Error("Unable to re-sample impulse response " + dr + ". " + P.message);
              });
            });
            return Promise.all(Z);
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
            var S = new Promise(function(I, O) {
              var U = l + ".dds", Z = new window.XMLHttpRequest();
              Z.open("GET", U), Z.onerror = function() {
                O(new Error("Unable to GET " + U + ", status " + Z.status + " " + ("" + Z.responseText)));
              }, Z.onload = function() {
                if (Z.status < 200 || Z.status >= 300) {
                  Z.onerror();
                  return;
                }
                try {
                  var nr = (0, u.parseDataSet)(Z.response);
                  I(nr);
                } catch (dr) {
                  O(new Error("Unable to parse " + U + ". " + dr.message));
                }
              }, Z.send();
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
            var S = this, I = new Promise(function(O, U) {
              var Z = l + ".json?ListenerPosition,ListenerUp,ListenerView,SourcePosition,Data.Delay,Data.SamplingRate,EmitterPosition,ReceiverPosition,RoomVolume", nr = new window.XMLHttpRequest();
              nr.open("GET", Z), nr.onerror = function() {
                U(new Error("Unable to GET " + Z + ", status " + nr.status + " " + ("" + nr.responseText)));
              }, nr.onload = function() {
                if (nr.status < 200 || nr.status >= 300) {
                  nr.onerror();
                  return;
                }
                try {
                  var dr = (0, m.parseSofa)(nr.response);
                  S._setMetaData(dr, l);
                  var mr = S._sourcePositionsToGl(dr), or = mr.map(function(F, $) {
                    return {
                      x: F[0],
                      y: F[1],
                      z: F[2],
                      index: $
                    };
                  }), V = y.default.tree.createKdTree(or, y.default.distanceSquared, ["x", "y", "z"]), P = S._filterPositions.map(function(F) {
                    return V.nearest({ x: F[0], y: F[1], z: F[2] }, 1).pop()[0].index;
                  });
                  P = [].concat(g(new Set(P))), S._sofaUrl = l, O(P);
                } catch (F) {
                  U(new Error("Unable to parse " + Z + ". " + F.message));
                }
              }, nr.send();
            });
            return I;
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
            var S = this, I = new Promise(function(O, U) {
              var Z = new window.XMLHttpRequest();
              Z.open("GET", l), Z.onerror = function() {
                U(new Error("Unable to GET " + l + ", status " + Z.status + " " + ("" + Z.responseText)));
              }, Z.onload = function() {
                if (Z.status < 200 || Z.status >= 300) {
                  Z.onerror();
                  return;
                }
                try {
                  var nr = (0, m.parseSofa)(Z.response);
                  S._setMetaData(nr, l);
                  var dr = S._sourcePositionsToGl(nr);
                  S._generateIndicesPositionsFirs(
                    dr.map(function(mr, or) {
                      return or;
                    }),
                    // full
                    dr,
                    nr["Data.IR"].data,
                    nr["Data.Delay"].data
                  ).then(function(mr) {
                    S._createKdTree(mr), S._sofaUrl = l, O(S);
                  });
                } catch (mr) {
                  U(new Error("Unable to parse " + l + ". " + mr.message));
                }
              }, Z.send();
            });
            return I;
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
          value: function(l, S, I) {
            var O = this, U = S.map(function(Z) {
              var nr = new Promise(function(dr, mr) {
                var or = l + ".json?" + ("SourcePosition[" + Z + "][0:1:" + (I.SourcePosition.C - 1) + "],") + ("Data.IR[" + Z + "][0:1:" + (I["Data.IR"].R - 1) + "]") + ("[0:1:" + (I["Data.IR"].N - 1) + "]"), V = new window.XMLHttpRequest();
                V.open("GET", or), V.onerror = function() {
                  mr(new Error("Unable to GET " + or + ", status " + V.status + " " + ("" + V.responseText)));
                }, V.onload = function() {
                  (V.status < 200 || V.status >= 300) && V.onerror();
                  try {
                    var P = (0, m.parseSofa)(V.response), F = O._sourcePositionsToGl(P);
                    O._generateIndicesPositionsFirs([Z], F, P["Data.IR"].data, P["Data.Delay"].data).then(function($) {
                      dr($[0]);
                    });
                  } catch ($) {
                    mr(new Error("Unable to parse " + or + ". " + $.message));
                  }
                }, V.send();
              });
              return nr;
            });
            return Promise.all(U).then(function(Z) {
              return O._createKdTree(Z), O;
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
            var I = (/* @__PURE__ */ new Date()).toISOString();
            this._sofaName = typeof l.name < "u" ? "" + l.name : "HRTF.sofa", this._sofaMetaData = typeof l.metaData < "u" ? l.metaData : {}, typeof S < "u" && (this._sofaMetaData.OriginalUrl = S), this._sofaMetaData.Converter = "Ircam " + o.default.name + " " + o.default.version + " javascript API ", this._sofaMetaData.DateConverted = I, this._sofaSampleRate = typeof l["Data.SamplingRate"] < "u" ? l["Data.SamplingRate"].data[0] : 48e3, this._sofaSampleRate !== this._audioContext.sampleRate && (this._sofaMetaData.OriginalSampleRate = this._sofaSampleRate), this._sofaDelay = typeof l["Data.Delay"] < "u" ? l["Data.Delay"].data : [0, 0], this._sofaRoomVolume = typeof l.RoomVolume < "u" ? l.RoomVolume.data[0] : void 0;
            var O = v.default.sofaToSofaCartesian([], l.ListenerPosition.data[0], (0, m.conformSofaCoordinateSystem)(l.ListenerPosition.Type || "cartesian")), U = v.default.sofaToSofaCartesian([], l.ListenerView.data[0], (0, m.conformSofaCoordinateSystem)(l.ListenerView.Type || "cartesian")), Z = v.default.sofaToSofaCartesian([], l.ListenerUp.data[0], (0, m.conformSofaCoordinateSystem)(l.ListenerUp.Type || "cartesian"));
            this._sofaToGl = i.mat4.lookAt([], O, U, Z);
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
            var S = this, I = l.SourcePosition.data, O = typeof l.SourcePosition.Type < "u" ? l.SourcePosition.Type : "spherical";
            switch (O) {
              case "cartesian":
                I.forEach(function(U) {
                  i.vec3.transformMat4(U, U, S._sofaToGl);
                });
                break;
              case "spherical":
                I.forEach(function(U) {
                  v.default.sofaSphericalToSofaCartesian(U, U), i.vec3.transformMat4(U, U, S._sofaToGl);
                });
                break;
              default:
                throw new Error("Bad source position type");
            }
            return I;
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
                    return v.default.sofaCartesianToGl([], S);
                  });
                  break;
                case "sofaSpherical":
                  this._filterPositions = l.map(function(S) {
                    return v.default.sofaSphericalToGl([], S);
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
                    return v.default.glToSofaCartesian([], S);
                  });
                  break;
                case "sofaSpherical":
                  l = this._filterPositions.map(function(S) {
                    return v.default.glToSofaSpherical([], S);
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
      c.default = R;
    }, { "../audio/utilities": 11, "../geometry/KdTree": 12, "../geometry/coordinates": 13, "../info": 16, "./parseDataSet": 19, "./parseSofa": 20, "gl-matrix": 8 }], 18: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      }), c.ServerDataBase = void 0;
      var a = /* @__PURE__ */ (function() {
        function w(v, h) {
          for (var y = 0; y < h.length; y++) {
            var b = h[y];
            b.enumerable = b.enumerable || !1, b.configurable = !0, "value" in b && (b.writable = !0), Object.defineProperty(v, b.key, b);
          }
        }
        return function(v, h, y) {
          return h && w(v.prototype, h), y && w(v, y), v;
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
      var r = f("./parseXml"), i = o(r), t = f("./parseDataSet");
      function o(w) {
        return w && w.__esModule ? w : { default: w };
      }
      function u(w, v) {
        if (!(w instanceof v))
          throw new TypeError("Cannot call a class as a function");
      }
      var m = c.ServerDataBase = (function() {
        function w() {
          var v = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          if (u(this, w), this._server = v.serverUrl, typeof this._server > "u") {
            var h = window.location.protocol === "https:" ? "https:" : "http:";
            this._server = h + "//bili2.ircam.fr";
          }
          this._catalogue = {}, this._urls = [];
        }
        return a(w, [{
          key: "loadCatalogue",
          value: function() {
            var h = this, y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this._server + "/catalog.xml", b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this._catalogue, E = new Promise(function(j, g) {
              var d = new window.XMLHttpRequest();
              d.open("GET", y), d.onerror = function() {
                g(new Error("Unable to GET " + y + ", status " + d.status + " " + ("" + d.responseText)));
              }, d.onload = function() {
                if (d.status < 200 || d.status >= 300) {
                  d.onerror();
                  return;
                }
                var R = (0, i.default)(d.response), L = R.querySelector("dataset"), z = R.querySelectorAll("dataset > catalogRef");
                if (z.length === 0) {
                  b.urls = [];
                  for (var l = R.querySelectorAll("dataset > dataset"), S = 0; S < l.length; ++S) {
                    var I = h._server + L.getAttribute("name") + "/" + l[S].getAttribute("name");
                    h._urls.push(I), b.urls.push(I);
                  }
                  j(y);
                } else {
                  for (var O = [], U = 0; U < z.length; ++U) {
                    var Z = z[U].getAttribute("name"), nr = h._server + L.getAttribute("name") + "/" + z[U].getAttribute("xlink:href");
                    b[Z] = {}, O.push(h.loadCatalogue(nr, b[Z]));
                  }
                  Promise.all(O).then(function() {
                    h._urls.sort(), j(y);
                  }).catch(function(dr) {
                    g(dr);
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
            var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, y = [h.convention, h.dataBase, h.equalisation, h.sampleRate, h.sosOrder], b = typeof h.freePattern == "number" ? h.freePattern.toString() : h.freePattern, E = y.reduce(function(R, L) {
              return R + "/" + (typeof L < "u" ? "[^/]*(?:" + L + ")[^/]*" : "[^/]*");
            }, ""), j = new RegExp(E, "i"), g = this._urls.filter(function(R) {
              return j.test(R);
            });
            if (typeof b < "u") {
              var d = b.split(/\s+/);
              d.forEach(function(R) {
                j = new RegExp(R, "i"), g = g.filter(function(L) {
                  return j.test(L);
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
          value: function(h) {
            var y = new Promise(function(b, E) {
              var j = h + ".dds", g = new window.XMLHttpRequest();
              g.open("GET", j), g.onerror = function() {
                E(new Error("Unable to GET " + j + ", status " + g.status + " " + ("" + g.responseText)));
              }, g.onload = function() {
                if (g.status < 200 || g.status >= 300) {
                  g.onerror();
                  return;
                }
                b((0, t.parseDataSet)(g.response));
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
          value: function(h) {
            var y = new Promise(function(b, E) {
              var j = h + ".json?SourcePosition", g = new window.XMLHttpRequest();
              g.open("GET", j), g.onerror = function() {
                E(new Error("Unable to GET " + j + ", status " + g.status + " " + ("" + g.responseText)));
              }, g.onload = function() {
                if (g.status < 200 || g.status >= 300) {
                  g.onerror();
                  return;
                }
                try {
                  var d = JSON.parse(g.response);
                  if (d.leaves[0].name !== "SourcePosition")
                    throw new Error("SourcePosition not found");
                  b(d.leaves[0].data);
                } catch (R) {
                  E(new Error("Unable to parse response from " + j + ". " + R.message));
                }
              }, g.send();
            });
            return y;
          }
        }]), w;
      })();
      c.default = m;
    }, { "./parseDataSet": 19, "./parseXml": 21 }], 19: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      }), c._parseDimension = v, c._parseDefinition = h, c.parseDataSet = y;
      /**
       * @fileOverview Parser for DDS files
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var a = "\\[\\s*(\\w+)\\s*=\\s*(\\d+)\\s*\\]", r = new RegExp(a, "g"), i = new RegExp(a), t = "\\s*(\\w+)\\s*([\\w.]+)\\s*((?:\\[[^\\]]+\\]\\s*)+);\\s*", o = new RegExp(t, "g"), u = new RegExp(t), m = "\\s*Dataset\\s*\\{\\s*((?:[^;]+;\\s*)*)\\s*\\}\\s*[\\w.]+\\s*;\\s*", w = new RegExp(m);
      function v(b) {
        var E = [], j = b.match(r);
        return j !== null && j.forEach(function(g) {
          var d = i.exec(g);
          d !== null && d.length > 2 && E.push([d[1], Number(d[2])]);
        }), E;
      }
      function h(b) {
        var E = [], j = b.match(o);
        return j !== null && j.forEach(function(g) {
          var d = u.exec(g);
          if (d !== null && d.length > 3) {
            var R = [];
            R[0] = d[2], R[1] = {}, R[1].type = d[1], v(d[3]).forEach(function(L) {
              R[1][L[0]] = L[1];
            }), E.push(R);
          }
        }), E;
      }
      function y(b) {
        var E = {}, j = w.exec(b);
        return j !== null && j.length > 1 && h(j[1]).forEach(function(g) {
          E[g[0]] = g[1];
        }), E;
      }
      c.default = y;
    }, {}], 20: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      }), c.parseSofa = a, c.stringifySofa = r, c.conformSofaCoordinateSystem = i;
      /**
       * @fileOverview Parser functions for SOFA files
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      function a(t) {
        try {
          var o = JSON.parse(t), u = {};
          if (u.name = o.name, typeof o.attributes < "u") {
            u.metaData = {};
            var m = o.attributes.find(function(v) {
              return v.name === "NC_GLOBAL";
            });
            typeof m < "u" && m.attributes.forEach(function(v) {
              u.metaData[v.name] = v.value[0];
            });
          }
          if (typeof o.leaves < "u") {
            var w = o.leaves;
            w.forEach(function(v) {
              u[v.name] = {}, v.attributes.forEach(function(h) {
                u[v.name][h.name] = h.value[0];
              }), u[v.name].shape = v.shape, u[v.name].data = v.data;
            });
          }
          return u;
        } catch (v) {
          throw new Error("Unable to parse SOFA string. " + v.message);
        }
      }
      function r(t) {
        var o = {};
        if (typeof t.name < "u" && (o.name = t.name), typeof t.metaData < "u") {
          o.attributes = [];
          var u = {
            name: "NC_GLOBAL",
            attributes: []
          };
          for (var m in t.metaData)
            t.metaData.hasOwnProperty(m) && u.attributes.push({
              name: m,
              value: [t.metaData[m]]
            });
          o.attributes.push(u);
        }
        var w = "Float64", v = void 0;
        if (o.leaves = [], [["ListenerPosition", "ListenerPositionType"], ["ListenerUp", "ListenerUpType"], ["ListenerView", "ListenerViewType"]].forEach(function(h) {
          var y = h[0], b = t[y], E = t[h[1]];
          if (typeof b < "u") {
            switch (E) {
              case "cartesian":
                v = [{ name: "Type", value: ["cartesian"] }, { name: "Units", value: ["metre, metre, metre"] }];
                break;
              case "spherical":
                v = [{ name: "Type", value: ["spherical"] }, { name: "Units", value: ["degree, degree, metre"] }];
                break;
              default:
                throw new Error("Unknown coordinate system type " + (E + " for " + b));
            }
            o.leaves.push({
              name: y,
              type: w,
              attributes: v,
              shape: [1, 3],
              data: [b]
            });
          }
        }), typeof t.SourcePosition < "u") {
          switch (t.SourcePositionType) {
            case "cartesian":
              v = [{ name: "Type", value: ["cartesian"] }, { name: "Units", value: ["metre, metre, metre"] }];
              break;
            case "spherical":
              v = [{ name: "Type", value: ["spherical"] }, { name: "Units", value: ["degree, degree, metre"] }];
              break;
            default:
              throw new Error("Unknown coordinate system type " + ("" + t.SourcePositionType));
          }
          o.leaves.push({
            name: "SourcePosition",
            type: w,
            attributes: v,
            shape: [t.SourcePosition.length, t.SourcePosition[0].length],
            data: t.SourcePosition
          });
        }
        if (typeof t.DataSamplingRate < "u")
          o.leaves.push({
            name: "Data.SamplingRate",
            type: w,
            attributes: [{ name: "Unit", value: "hertz" }],
            shape: [1],
            data: [t.DataSamplingRate]
          });
        else
          throw new Error("No data sampling-rate");
        if (typeof t.DataDelay < "u" && o.leaves.push({
          name: "Data.Delay",
          type: w,
          attributes: [],
          shape: [1, t.DataDelay.length],
          data: t.DataDelay
        }), typeof t.DataIR < "u")
          o.leaves.push({
            name: "Data.IR",
            type: w,
            attributes: [],
            shape: [t.DataIR.length, t.DataIR[0].length, t.DataIR[0][0].length],
            data: t.DataIR
          });
        else
          throw new Error("No data IR");
        return typeof t.RoomVolume < "u" && o.leaves.push({
          name: "RoomVolume",
          type: w,
          attributes: [{ name: "Units", value: ["cubic metre"] }],
          shape: [1],
          data: [t.RoomVolume]
        }), o.nodes = [], JSON.stringify(o);
      }
      function i(t) {
        var o = void 0;
        switch (t) {
          case "cartesian":
            o = "sofaCartesian";
            break;
          case "spherical":
            o = "sofaSpherical";
            break;
          default:
            throw new Error("Bad SOFA type " + t);
        }
        return o;
      }
      c.default = {
        parseSofa: a,
        conformSofaCoordinateSystem: i
      };
    }, {}], 21: [function(f, n, c) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      });
      /**
       * @fileOverview Simple XML parser, as a DOM parser.
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var a = c.parseXml = void 0;
      if (typeof window.DOMParser < "u")
        c.parseXml = a = function(i) {
          return new window.DOMParser().parseFromString(i, "text/xml");
        };
      else if (typeof window.ActiveXObject < "u" && new window.ActiveXObject("Microsoft.XMLDOM"))
        c.parseXml = a = function(i) {
          var t = new window.ActiveXObject("Microsoft.XMLDOM");
          return t.async = "false", t.loadXML(i), t;
        };
      else
        throw new Error("No XML parser found");
      c.default = a;
    }, {}] }, {}, [15])(15);
  });
})(serveSofaHrir);
const DEFAULT_INTENSITY_SAMPLE_RATE = 256, QUICK_ESTIMATE_MAX_ORDER = 1e3, RT60_DECAY_RATIO = 1e6, MIN_TAIL_DECAY_RATE = 1, MAX_TAIL_END_TIME = 10, HISTOGRAM_BIN_WIDTH = 1e-3, HISTOGRAM_NUM_BINS = 1e4;
function linearRegression$1(_) {
  var s, f, n = _.length;
  if (n === 1)
    s = 0, f = _[0][1];
  else {
    for (var c = 0, a = 0, r = 0, i = 0, t, o, u, m = 0; m < n; m++)
      t = _[m], o = t[0], u = t[1], c += o, a += u, r += o * o, i += o * u;
    s = (n * i - c * a) / (n * r - c * c), f = a / n - s * c / n;
  }
  return {
    m: s,
    b: f
  };
}
function linearRegression(_, s) {
  const f = _.length, n = [];
  for (let t = 0; t < f; t++)
    n.push([_[t], s[t]]);
  const { m: c, b: a } = linearRegression$1(n);
  return { m: c, b: a, fx: (t) => c * t + a, fy: (t) => (t - a) / c };
}
const { log10, pow, floor: floor$1, max, min, sqrt: sqrt$1, cos: cos$1, PI: PI$1, random } = Math;
function extractDecayParameters(_, s, f, n) {
  const c = s.length, a = [];
  for (let r = 0; r < c; r++) {
    const i = _[r];
    let t = 0;
    for (let R = i.length - 1; R >= 0; R--)
      if (i[R] > 0) {
        t = R;
        break;
      }
    if (t < 2) {
      a.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }
    const o = new Float32Array(t + 1);
    o[t] = i[t];
    for (let R = t - 1; R >= 0; R--)
      o[R] = o[R + 1] + i[R];
    const u = o[0];
    if (u <= 0) {
      a.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }
    const m = u * pow(10, -5 / 10), w = u * pow(10, -35 / 10);
    let v = -1, h = -1;
    for (let R = 0; R <= t; R++)
      v < 0 && o[R] <= m && (v = R), h < 0 && o[R] <= w && (h = R);
    let y = 0, b = 0;
    if (v >= 0 && h > v) {
      const R = [], L = [];
      for (let z = v; z <= h; z++) {
        const l = o[z];
        l > 0 && (R.push(z * n), L.push(10 * log10(l / u)));
      }
      if (R.length >= 2) {
        const l = linearRegression(R, L).m;
        l < 0 && (y = l, b = -60 / l);
      }
    }
    y < 0 && y > -MIN_TAIL_DECAY_RATE && (y = -MIN_TAIL_DECAY_RATE, b = 60 / MIN_TAIL_DECAY_RATE);
    let E = f;
    if (E <= 0) {
      const R = max(1, floor$1(0.05 / n));
      E = max(0, t - R) * n;
    }
    const j = min(floor$1(E / n), t), g = j <= t && j >= 0 ? o[j] / u : 0, d = b > 0 ? min(E + b, MAX_TAIL_END_TIME) : E;
    a.push({ t60: b, decayRate: y, crossfadeLevel: g, crossfadeTime: E, endTime: d });
  }
  return a;
}
function synthesizeTail(_, s) {
  let f = 0, n = 1 / 0;
  for (const t of _)
    t.endTime > f && (f = t.endTime), t.crossfadeTime > 0 && t.crossfadeTime < n && (n = t.crossfadeTime);
  if (f <= 0 || !isFinite(n))
    return { tailSamples: _.map(() => new Float32Array(0)), tailStartSample: 0, totalSamples: 0 };
  const c = floor$1(n * s), a = floor$1(f * s), r = a - c;
  if (r <= 0)
    return { tailSamples: _.map(() => new Float32Array(0)), tailStartSample: c, totalSamples: a };
  const i = [];
  for (const t of _) {
    const o = new Float32Array(r);
    if (t.decayRate >= 0 || t.crossfadeLevel <= 0) {
      i.push(o);
      continue;
    }
    const u = sqrt$1(t.crossfadeLevel), m = 1 / sqrt$1(3), w = u / m;
    for (let v = 0; v < r; v++) {
      const h = v / s, y = pow(10, t.decayRate * h / 20), b = random() * 2 - 1;
      o[v] = b * y * w;
    }
    i.push(o);
  }
  return { tailSamples: i, tailStartSample: c, totalSamples: a };
}
function assembleFinalIR(_, s, f, n) {
  const c = _.length, a = [];
  for (let r = 0; r < c; r++) {
    const i = _[r], t = s[r];
    if (!t || t.length === 0) {
      a.push(i);
      continue;
    }
    const o = max(i.length, f + t.length), u = new Float32Array(o);
    for (let v = 0; v < min(f, i.length); v++)
      u[v] = i[v];
    const m = n, w = m > 1 ? m - 1 : 1;
    for (let v = 0; v < m; v++) {
      const h = f + v;
      if (h >= o) break;
      const y = 0.5 * (1 + cos$1(PI$1 * v / w)), b = 0.5 * (1 - cos$1(PI$1 * v / w)), E = h < i.length ? i[h] : 0, j = v < t.length ? t[v] : 0;
      u[h] = E * y + j * b;
    }
    for (let v = m; v < t.length; v++) {
      const h = f + v;
      if (h >= o) break;
      u[h] = t[v];
    }
    a.push(u);
  }
  return a;
}
function movingAverage(_, s = 1) {
  let f = _.slice();
  for (let n = 0; n < _.length; n++)
    if (n >= s && n < _.length - s) {
      const c = n - s, a = n + s;
      let r = 0;
      for (let i = c; i < a; i++)
        r += _[i];
      f[n] = r / (2 * s);
    }
  return f;
}
const { floor } = Math;
function resampleResponseByIntensity(_, s = DEFAULT_INTENSITY_SAMPLE_RATE) {
  if (_) {
    for (const f in _)
      for (const n in _[f]) {
        const { response: c, freqs: a } = _[f][n], r = c[c.length - 1].time, i = floor(s * r);
        _[f][n].resampledResponse = Array(a.length).fill(0).map((w) => new Float32Array(i)), _[f][n].sampleRate = s;
        let t = 0, o = [], u = a.map((w) => 0), m = !1;
        for (let w = 0, v = 0; w < i; w++) {
          let h = w / i * r;
          if (c[v] && c[v].time) {
            let y = c[v].time;
            if (y > h) {
              for (let b = 0; b < a.length; b++)
                _[f][n].resampledResponse[b][t] = 0;
              m && o.push(t), t++;
              continue;
            }
            if (y <= h) {
              let b = c[v].level.map((E) => 0);
              for (; y <= h; ) {
                y = c[v].time;
                for (let E = 0; E < a.length; E++)
                  b[E] = db_add([b[E], c[v].level[E]]);
                v++;
              }
              for (let E = 0; E < a.length; E++) {
                if (_[f][n].resampledResponse[E][t] = b[E], o.length > 0) {
                  const j = u[E], g = b[E];
                  for (let d = 0; d < o.length; d++) {
                    const R = lerp(j, g, (d + 1) / (o.length + 1));
                    _[f][n].resampledResponse[E][o[d]] = R;
                  }
                }
                u[E] = b[E];
              }
              o.length > 0 && (o = []), m = !0, t++;
              continue;
            }
          }
        }
        calculateT20(_, f, n), calculateT30(_, f, n), calculateT60(_, f, n);
      }
    return _;
  } else
    console.warn("no data yet");
}
function calculateT30(_, s, f) {
  const n = s, c = f, a = _[n][c].resampledResponse, r = _[n][c].sampleRate;
  if (a && r) {
    const i = new Float32Array(a[0].length);
    for (let t = 0; t < a[0].length; t++)
      i[t] = t / r;
    _[n][c].t30 = a.map((t) => {
      let o = 0, u = t[o];
      for (; u === 0; )
        u = t[o++];
      for (let h = o; h >= 0; h--)
        t[h] = u;
      const m = u - 30, v = movingAverage(t, 2).filter((h) => h >= m).length;
      return linearRegression(i.slice(0, v), t.slice(0, v));
    });
  }
}
function calculateT20(_, s, f) {
  const n = s, c = f, a = _[n][c].resampledResponse, r = _[n][c].sampleRate;
  if (a && r) {
    const i = new Float32Array(a[0].length);
    for (let t = 0; t < a[0].length; t++)
      i[t] = t / r;
    _[n][c].t20 = a.map((t) => {
      let o = 0, u = t[o];
      for (; u === 0; )
        u = t[o++];
      for (let h = o; h >= 0; h--)
        t[h] = u;
      const m = u - 20, v = movingAverage(t, 2).filter((h) => h >= m).length;
      return linearRegression(i.slice(0, v), t.slice(0, v));
    });
  }
}
function calculateT60(_, s, f) {
  const n = s, c = f, a = _[n][c].resampledResponse, r = _[n][c].sampleRate;
  if (a && r) {
    const i = new Float32Array(a[0].length);
    for (let t = 0; t < a[0].length; t++)
      i[t] = t / r;
    _[n][c].t60 = a.map((t) => {
      let o = 0, u = t[o];
      for (; u === 0; )
        u = t[o++];
      for (let h = o; h >= 0; h--)
        t[h] = u;
      const m = u - 60, v = movingAverage(t, 2).filter((h) => h >= m).length;
      return linearRegression(i.slice(0, v), t.slice(0, v));
    });
  }
}
async function decodeBinaural(_, s) {
  const f = _.sampleRate;
  if (f !== s.sampleRate)
    throw new Error(
      `Sample rate mismatch: ambisonic IR is ${f} Hz but HRTF filters are ${s.sampleRate} Hz`
    );
  const n = Math.min(_.numberOfChannels, s.channelCount);
  if (n === 0)
    throw new Error("No channels to decode");
  const c = _.length + s.filterLength - 1, a = new OfflineAudioContext(2, c, f);
  for (let i = 0; i < n; i++) {
    const t = a.createBuffer(1, _.length, f);
    t.copyToChannel(_.getChannelData(i), 0);
    const o = a.createBufferSource();
    o.buffer = t;
    const u = a.createBuffer(2, s.filterLength, f);
    u.copyToChannel(new Float32Array(s.filtersLeft[i]), 0), u.copyToChannel(new Float32Array(s.filtersRight[i]), 1);
    const m = a.createConvolver();
    m.normalize = !1, m.buffer = u, o.connect(m), m.connect(a.destination), o.start(0);
  }
  return {
    buffer: await a.startRendering(),
    sampleRate: f
  };
}
function rotateAmbisonicIR(_, s, f, n) {
  if (s === 0 && f === 0 && n === 0)
    return _;
  const c = _.numberOfChannels, a = _.length, r = _.sampleRate;
  if (c < 4)
    throw new Error("Ambisonic rotation requires at least 4 channels (first order)");
  const i = s * Math.PI / 180, t = f * Math.PI / 180, o = n * Math.PI / 180, u = Math.cos(i), m = Math.sin(i), w = Math.cos(t), v = Math.sin(t), h = Math.cos(o), y = Math.sin(o), b = u * h + m * v * y, E = -u * y + m * v * h, j = m * w, g = w * y, d = w * h, R = -v, L = -m * h + u * v * y, z = m * y + u * v * h, l = u * w, I = new OfflineAudioContext(c, a, r).createBuffer(c, a, r);
  I.copyToChannel(_.getChannelData(0), 0);
  const O = _.getChannelData(1), U = _.getChannelData(2), Z = _.getChannelData(3), nr = new Float32Array(a), dr = new Float32Array(a), mr = new Float32Array(a);
  for (let or = 0; or < a; or++) {
    const V = O[or], P = U[or], F = Z[or];
    nr[or] = b * V + E * P + j * F, dr[or] = g * V + d * P + R * F, mr[or] = L * V + z * P + l * F;
  }
  I.copyToChannel(nr, 1), I.copyToChannel(dr, 2), I.copyToChannel(mr, 3);
  for (let or = 4; or < c; or++)
    I.copyToChannel(_.getChannelData(or), or);
  return I;
}
async function calculateBinauralFromAmbisonic(_) {
  const { ambisonicImpulseResponse: s, order: f, hrtfSubjectId: n, headYaw: c, headPitch: a, headRoll: r } = _;
  let i = s;
  (c !== 0 || a !== 0 || r !== 0) && (i = rotateAmbisonicIR(i, c, a, r));
  const t = await loadDecoderFilters(n, f);
  return (await decodeBinaural(i, t)).buffer;
}
function hashPointKeys(_, s, f, n) {
  const c = _ / n, a = s / n, r = f / n, i = Math.floor(c), t = Math.floor(a), o = Math.floor(r), u = [`${i},${t},${o}`], m = [0, -1, 1];
  for (const w of m)
    for (const v of m)
      for (const h of m) {
        if (w === 0 && v === 0 && h === 0) continue;
        const y = i + w, b = t + v, E = o + h;
        Math.abs(c - (y + 0.5)) < 1 && Math.abs(a - (b + 0.5)) < 1 && Math.abs(r - (E + 0.5)) < 1 && u.push(`${y},${b},${E}`);
      }
  return u;
}
function edgeKey(_, s) {
  return _ < s ? `${_}|${s}` : `${s}|${_}`;
}
function buildEdgeGraph(_, s = 1e-4) {
  const f = numbersEqualWithinTolerence(s), n = s * 10, c = /* @__PURE__ */ new Map();
  for (const r of _) {
    const i = r.edgeLoop;
    if (!i || i.length < 3) continue;
    const t = [r.normal.x, r.normal.y, r.normal.z];
    for (let o = 0; o < i.length; o++) {
      const u = i[o], m = i[(o + 1) % i.length], w = [u.x, u.y, u.z], v = [m.x, m.y, m.z], h = { start: w, end: v, surfaceId: r.uuid, normal: t }, y = hashPointKeys(u.x, u.y, u.z, n), b = hashPointKeys(m.x, m.y, m.z, n), E = /* @__PURE__ */ new Set();
      for (const j of y)
        for (const g of b) {
          const d = edgeKey(j, g);
          E.has(d) || (E.add(d), c.has(d) ? c.get(d).push(h) : c.set(d, [h]));
        }
    }
  }
  const a = [];
  for (const [, r] of c) {
    if (r.length !== 2 || r[0].surfaceId === r[1].surfaceId) continue;
    const i = r[0], t = r[1];
    if (!(f(i.start[0], t.start[0]) && f(i.start[1], t.start[1]) && f(i.start[2], t.start[2]) && f(i.end[0], t.end[0]) && f(i.end[1], t.end[1]) && f(i.end[2], t.end[2]) || f(i.start[0], t.end[0]) && f(i.start[1], t.end[1]) && f(i.start[2], t.end[2]) && f(i.end[0], t.start[0]) && f(i.end[1], t.start[1]) && f(i.end[2], t.start[2]))) continue;
    const u = i.end[0] - i.start[0], m = i.end[1] - i.start[1], w = i.end[2] - i.start[2], v = Math.sqrt(u * u + m * m + w * w);
    if (v < s) continue;
    const h = [u / v, m / v, w / v], y = i.normal, b = t.normal, E = y[0] * b[0] + y[1] * b[1] + y[2] * b[2], j = Math.acos(Math.max(-1, Math.min(1, E)));
    if (j < 0.01) continue;
    const d = 2 * Math.PI - j, R = d / Math.PI;
    R <= 1 || a.push({
      start: i.start,
      end: i.end,
      direction: h,
      length: v,
      normal0: y,
      normal1: b,
      surface0Id: i.surfaceId,
      surface1Id: t.surfaceId,
      wedgeAngle: d,
      n: R
    });
  }
  return { edges: a };
}
const { PI, sqrt, abs, cos, sin, atan2 } = Math;
function fresnelTransition(_) {
  return _ < 0 && (_ = 0), 1 - Math.exp(-sqrt(PI * _));
}
function computeWedgeAngles(_, s, f, n, c) {
  const a = _, r = [
    n[0] - f[0],
    n[1] - f[1],
    n[2] - f[2]
  ], i = r[0] * a[0] + r[1] * a[1] + r[2] * a[2], t = [r[0] - i * a[0], r[1] - i * a[1], r[2] - i * a[2]], o = sqrt(t[0] ** 2 + t[1] ** 2 + t[2] ** 2), u = [
    c[0] - f[0],
    c[1] - f[1],
    c[2] - f[2]
  ], m = u[0] * a[0] + u[1] * a[1] + u[2] * a[2], w = [u[0] - m * a[0], u[1] - m * a[1], u[2] - m * a[2]], v = sqrt(w[0] ** 2 + w[1] ** 2 + w[2] ** 2);
  if (o < 1e-10 || v < 1e-10)
    return { phiSource: PI, phiReceiver: PI };
  const h = [t[0] / o, t[1] / o, t[2] / o], y = [w[0] / v, w[1] / v, w[2] / v], b = [-s[0], -s[1], -s[2]], E = [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ], j = atan2(
    h[0] * E[0] + h[1] * E[1] + h[2] * E[2],
    h[0] * b[0] + h[1] * b[1] + h[2] * b[2]
  ), g = atan2(
    y[0] * E[0] + y[1] * E[1] + y[2] * E[2],
    y[0] * b[0] + y[1] * b[1] + y[2] * b[2]
  ), d = (R) => {
    let L = R;
    for (; L < 0; ) L += 2 * PI;
    return L;
  };
  return {
    phiSource: d(j),
    phiReceiver: d(g)
  };
}
function cotTerm(_, s, f, n, c) {
  const a = f + n * c, r = (PI + s * a) / (2 * _), i = sin(r);
  return abs(i) < 1e-12 ? 0 : cos(r) / i;
}
function utdDiffractionCoefficient(_, s, f, n, c, a, r) {
  if (f < 1e-10 || n < 1e-10) return 0;
  const i = 2 * PI * _ / r;
  if (i < 1e-10) return 0;
  const t = f * n / (f + n), o = (O, U, Z, nr) => {
    const mr = U + Z * nr, or = Math.round((mr + PI) / (2 * PI * s)), V = Math.round((mr - PI) / (2 * PI * s)), P = 2 * cos((2 * PI * s * or - mr) / 2) ** 2, F = 2 * cos((2 * PI * s * V - mr) / 2) ** 2;
    return O > 0 ? P : F;
  };
  let u = 0;
  const m = o(1, a, -1, c), w = cotTerm(s, 1, a, -1, c), v = fresnelTransition(i * t * m), h = o(-1, a, -1, c), y = cotTerm(s, -1, a, -1, c), b = fresnelTransition(i * t * h), E = o(1, a, 1, c), j = cotTerm(s, 1, a, 1, c), g = fresnelTransition(i * t * E), d = o(-1, a, 1, c), R = cotTerm(s, -1, a, 1, c), L = fresnelTransition(i * t * d), z = 1 / (2 * s * sqrt(2 * PI * i)), l = w * v + y * b + j * g + R * L;
  u = z * z * l * l;
  const S = f, I = S / (n * (n + S));
  return u * I;
}
function findDiffractionPoint(_, s, f, n) {
  const c = s[0] - _[0], a = s[1] - _[1], r = s[2] - _[2], i = c * c + a * a + r * r;
  if (i < 1e-20)
    return [..._];
  const t = Math.sqrt(i), o = [c / t, a / t, r / t], u = (b) => {
    const E = _[0] + b * c, j = _[1] + b * a, g = _[2] + b * r, d = Math.sqrt(
      (E - f[0]) ** 2 + (j - f[1]) ** 2 + (g - f[2]) ** 2
    ), R = Math.sqrt(
      (E - n[0]) ** 2 + (j - n[1]) ** 2 + (g - n[2]) ** 2
    );
    if (d < 1e-10 || R < 1e-10) return 0;
    const L = ((E - f[0]) * o[0] + (j - f[1]) * o[1] + (g - f[2]) * o[2]) / d, z = ((E - n[0]) * o[0] + (j - n[1]) * o[1] + (g - n[2]) * o[2]) / R;
    return L + z;
  };
  let m = 0, w = 1;
  const v = u(m), h = u(w);
  if (v * h > 0) {
    const b = (j) => {
      const g = _[0] + j * c, d = _[1] + j * a, R = _[2] + j * r, L = Math.sqrt(
        (g - f[0]) ** 2 + (d - f[1]) ** 2 + (R - f[2]) ** 2
      ), z = Math.sqrt(
        (g - n[0]) ** 2 + (d - n[1]) ** 2 + (R - n[2]) ** 2
      );
      return L + z;
    }, E = b(0) < b(1) ? 0 : 1;
    return [
      _[0] + E * c,
      _[1] + E * a,
      _[2] + E * r
    ];
  }
  for (let b = 0; b < 50; b++) {
    const E = (m + w) / 2, j = u(E);
    if (Math.abs(j) < 1e-12) break;
    v * j < 0 ? w = E : m = E;
  }
  const y = (m + w) / 2;
  return [
    _[0] + y * c,
    _[1] + y * a,
    _[2] + y * r
  ];
}
function hasLineOfSight(_, s, f, n, c = 0.01) {
  const a = s[0] - _[0], r = s[1] - _[1], i = s[2] - _[2], t = Math.sqrt(a * a + r * r + i * i);
  if (t < c) return !0;
  const o = new THREE.Vector3(a / t, r / t, i / t), u = new THREE.Vector3(
    _[0] + o.x * c,
    _[1] + o.y * c,
    _[2] + o.z * c
  );
  f.ray.set(u, o), f.far = t - 2 * c, f.near = 0;
  const m = f.intersectObjects(n, !0);
  return f.far = 1 / 0, m.length === 0;
}
function findDiffractionPaths(_, s, f, n, c, a, r, i) {
  const t = [], o = airAttenuation(n, a);
  for (const u of _.edges)
    for (const [m, w] of s)
      for (const [v, h] of f) {
        const y = findDiffractionPoint(u.start, u.end, w, h), b = Math.sqrt(
          (y[0] - w[0]) ** 2 + (y[1] - w[1]) ** 2 + (y[2] - w[2]) ** 2
        ), E = Math.sqrt(
          (y[0] - h[0]) ** 2 + (y[1] - h[1]) ** 2 + (y[2] - h[2]) ** 2
        );
        if (b < 1e-6 || E < 1e-6 || !hasLineOfSight(w, y, r, i) || !hasLineOfSight(y, h, r, i)) continue;
        const { phiSource: j, phiReceiver: g } = computeWedgeAngles(
          u.direction,
          u.normal0,
          y,
          w,
          h
        ), d = b + E, R = d / c, L = new Array(n.length);
        for (let z = 0; z < n.length; z++) {
          let l = utdDiffractionCoefficient(
            n[z],
            u.n,
            b,
            E,
            j,
            g,
            c
          );
          const S = o[z] * d;
          l *= Math.pow(10, -S / 10), L[z] = l;
        }
        t.push({
          edge: u,
          diffractionPoint: y,
          totalDistance: d,
          time: R,
          bandEnergy: L,
          sourceId: m,
          receiverId: v
        });
      }
  return t;
}
function quickEstimateStep(_, s, f, n, c, a, r = QUICK_ESTIMATE_MAX_ORDER) {
  const i = soundSpeed(a), t = Array(c.length).fill(0);
  let o = f.clone(), u, m, w, v;
  do
    u = Math.random() * 2 - 1, m = Math.random() * 2 - 1, w = Math.random() * 2 - 1, v = u * u + m * m + w * w;
  while (v > 1 || v < 1e-6);
  let h = new THREE.Vector3(u, m, w).normalize(), y = 0;
  const b = Array(c.length).fill(n);
  let E = 0, j = !1, g = 0;
  airAttenuation(c, a);
  let d = {};
  for (; !j && E < r; ) {
    _.ray.set(o, h);
    const R = _.intersectObjects(s, !0);
    if (R.length > 0) {
      y = h.clone().multiplyScalar(-1).angleTo(R[0].face.normal), g += R[0].distance;
      const L = R[0].object.parent;
      for (let l = 0; l < c.length; l++) {
        const S = c[l];
        let I = 1;
        L.kind === "surface" && (I = L.reflectionFunction(S, y)), b[l] *= I;
        const O = n / b[l] > RT60_DECAY_RATIO;
        O && (t[l] = g / i), j = j || O;
      }
      R[0].object.parent instanceof Surface && (R[0].object.parent.numHits += 1);
      const z = R[0].face.normal.normalize();
      h.sub(z.clone().multiplyScalar(h.dot(z)).multiplyScalar(2)).normalize(), o.copy(R[0].point), d = R[0];
    }
    E += 1;
  }
  return {
    distance: g,
    rt60s: t,
    angle: y,
    direction: h,
    lastIntersection: d
  };
}
export {
  DEFAULT_INTENSITY_SAMPLE_RATE as D,
  HISTOGRAM_NUM_BINS as H,
  MAX_TAIL_END_TIME as M,
  QUICK_ESTIMATE_MAX_ORDER as Q,
  RT60_DECAY_RATIO as R,
  HISTOGRAM_BIN_WIDTH as a,
  buildEdgeGraph as b,
  assembleFinalIR as c,
  encodeBufferFromDirection as d,
  extractDecayParameters as e,
  findDiffractionPaths as f,
  calculateBinauralFromAmbisonic as g,
  getAmbisonicChannelCount as h,
  calculateT30 as i,
  calculateT20 as j,
  calculateT60 as k,
  linearRegression as l,
  MIN_TAIL_DECAY_RATE as m,
  quickEstimateStep as q,
  resampleResponseByIntensity as r,
  synthesizeTail as s
};
//# sourceMappingURL=quick-estimate-7e5tl2Yy.mjs.map
