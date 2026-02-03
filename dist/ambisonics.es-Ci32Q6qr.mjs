function getAmbisonicChannelCount(D) {
  return (D + 1) * (D + 1);
}
function degreesToRadians(D) {
  return D * Math.PI / 180;
}
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, numeric1_2_6 = {};
(function(exports$1) {
  var numeric = exports$1;
  typeof commonjsGlobal < "u" && (commonjsGlobal.numeric = numeric), numeric.version = "1.2.6", numeric.bench = function(s, a) {
    var n, f, t, r;
    for (typeof a > "u" && (a = 15), t = 0.5, n = /* @__PURE__ */ new Date(); ; ) {
      for (t *= 2, r = t; r > 3; r -= 4)
        s(), s(), s(), s();
      for (; r > 0; )
        s(), r--;
      if (f = /* @__PURE__ */ new Date(), f - n > a) break;
    }
    for (r = t; r > 3; r -= 4)
      s(), s(), s(), s();
    for (; r > 0; )
      s(), r--;
    return f = /* @__PURE__ */ new Date(), 1e3 * (3 * t - 1) / (f - n);
  }, numeric._myIndexOf = function(s) {
    var a = this.length, n;
    for (n = 0; n < a; ++n) if (this[n] === s) return n;
    return -1;
  }, numeric.myIndexOf = Array.prototype.indexOf ? Array.prototype.indexOf : numeric._myIndexOf, numeric.Function = Function, numeric.precision = 4, numeric.largeArray = 50, numeric.prettyPrint = function(s) {
    function a(t) {
      if (t === 0)
        return "0";
      if (isNaN(t))
        return "NaN";
      if (t < 0)
        return "-" + a(-t);
      if (isFinite(t)) {
        var r = Math.floor(Math.log(t) / Math.log(10)), i = t / Math.pow(10, r), c = i.toPrecision(numeric.precision);
        return parseFloat(c) === 10 && (r++, i = 1, c = i.toPrecision(numeric.precision)), parseFloat(c).toString() + "e" + r.toString();
      }
      return "Infinity";
    }
    var n = [];
    function f(t) {
      var r;
      if (typeof t > "u")
        return n.push(Array(numeric.precision + 8).join(" ")), !1;
      if (typeof t == "string")
        return n.push('"' + t + '"'), !1;
      if (typeof t == "boolean")
        return n.push(t.toString()), !1;
      if (typeof t == "number") {
        var i = a(t), c = t.toPrecision(numeric.precision), u = parseFloat(t.toString()).toString(), o = [i, c, u, parseFloat(c).toString(), parseFloat(u).toString()];
        for (r = 1; r < o.length; r++)
          o[r].length < i.length && (i = o[r]);
        return n.push(Array(numeric.precision + 8 - i.length).join(" ") + i), !1;
      }
      if (t === null)
        return n.push("null"), !1;
      if (typeof t == "function") {
        n.push(t.toString());
        var h = !1;
        for (r in t)
          t.hasOwnProperty(r) && (h ? n.push(`,
`) : n.push(`
{`), h = !0, n.push(r), n.push(`: 
`), f(t[r]));
        return h && n.push(`}
`), !0;
      }
      if (t instanceof Array) {
        if (t.length > numeric.largeArray)
          return n.push("...Large Array..."), !0;
        var h = !1;
        for (n.push("["), r = 0; r < t.length; r++)
          r > 0 && (n.push(","), h && n.push(`
 `)), h = f(t[r]);
        return n.push("]"), !0;
      }
      n.push("{");
      var h = !1;
      for (r in t)
        t.hasOwnProperty(r) && (h && n.push(`,
`), h = !0, n.push(r), n.push(`: 
`), f(t[r]));
      return n.push("}"), !0;
    }
    return f(s), n.join("");
  }, numeric.parseDate = function(s) {
    function a(n) {
      if (typeof n == "string")
        return Date.parse(n.replace(/-/g, "/"));
      if (!(n instanceof Array))
        throw new Error("parseDate: parameter must be arrays of strings");
      var f = [], t;
      for (t = 0; t < n.length; t++)
        f[t] = a(n[t]);
      return f;
    }
    return a(s);
  }, numeric.parseFloat = function(s) {
    function a(n) {
      if (typeof n == "string")
        return parseFloat(n);
      if (!(n instanceof Array))
        throw new Error("parseFloat: parameter must be arrays of strings");
      var f = [], t;
      for (t = 0; t < n.length; t++)
        f[t] = a(n[t]);
      return f;
    }
    return a(s);
  }, numeric.parseCSV = function(s) {
    var a = s.split(`
`), n, f, t = [], r = /(([^'",]*)|('[^']*')|("[^"]*")),/g, i = /^\s*(([+-]?[0-9]+(\.[0-9]*)?(e[+-]?[0-9]+)?)|([+-]?[0-9]*(\.[0-9]+)?(e[+-]?[0-9]+)?))\s*$/, c = function(S) {
      return S.substr(0, S.length - 1);
    }, u = 0;
    for (f = 0; f < a.length; f++) {
      var o = (a[f] + ",").match(r), h;
      if (o.length > 0) {
        for (t[u] = [], n = 0; n < o.length; n++)
          h = c(o[n]), i.test(h) ? t[u][n] = parseFloat(h) : t[u][n] = h;
        u++;
      }
    }
    return t;
  }, numeric.toCSV = function(s) {
    var a = numeric.dim(s), n, f, t, r, i;
    for (t = a[0], a[1], i = [], n = 0; n < t; n++) {
      for (r = [], f = 0; f < t; f++)
        r[f] = s[n][f].toString();
      i[n] = r.join(", ");
    }
    return i.join(`
`) + `
`;
  }, numeric.getURL = function(s) {
    var a = new XMLHttpRequest();
    return a.open("GET", s, !1), a.send(), a;
  }, numeric.imageURL = function(s) {
    function a(E) {
      var z = E.length, y, v, R, L, I, l, w, O, j = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Y = "";
      for (y = 0; y < z; y += 3)
        v = E[y], R = E[y + 1], L = E[y + 2], I = v >> 2, l = ((v & 3) << 4) + (R >> 4), w = ((R & 15) << 2) + (L >> 6), O = L & 63, y + 1 >= z ? w = O = 64 : y + 2 >= z && (O = 64), Y += j.charAt(I) + j.charAt(l) + j.charAt(w) + j.charAt(O);
      return Y;
    }
    function n(E, z, y) {
      typeof z > "u" && (z = 0), typeof y > "u" && (y = E.length);
      var v = [
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
      var I;
      for (I = z; I < y; I++)
        L = (R ^ E[I]) & 255, R = R >>> 8 ^ v[L];
      return R ^ -1;
    }
    var f = s[0].length, t = s[0][0].length, r, i, c, u, o, h, S, m, d, g, P = [
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
      t >> 24 & 255,
      t >> 16 & 255,
      t >> 8 & 255,
      t & 255,
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
    for (g = n(P, 12, 29), P[29] = g >> 24 & 255, P[30] = g >> 16 & 255, P[31] = g >> 8 & 255, P[32] = g & 255, r = 1, i = 0, S = 0; S < f; S++) {
      for (S < f - 1 ? P.push(0) : P.push(1), o = 3 * t + 1 + (S === 0) & 255, h = 3 * t + 1 + (S === 0) >> 8 & 255, P.push(o), P.push(h), P.push(~o & 255), P.push(~h & 255), S === 0 && P.push(0), m = 0; m < t; m++)
        for (c = 0; c < 3; c++)
          o = s[c][S][m], o > 255 ? o = 255 : o < 0 ? o = 0 : o = Math.round(o), r = (r + o) % 65521, i = (i + r) % 65521, P.push(o);
      P.push(0);
    }
    return d = (i << 16) + r, P.push(d >> 24 & 255), P.push(d >> 16 & 255), P.push(d >> 8 & 255), P.push(d & 255), u = P.length - 41, P[33] = u >> 24 & 255, P[34] = u >> 16 & 255, P[35] = u >> 8 & 255, P[36] = u & 255, g = n(P, 37), P.push(g >> 24 & 255), P.push(g >> 16 & 255), P.push(g >> 8 & 255), P.push(g & 255), P.push(0), P.push(0), P.push(0), P.push(0), P.push(73), P.push(69), P.push(78), P.push(68), P.push(174), P.push(66), P.push(96), P.push(130), "data:image/png;base64," + a(P);
  }, numeric._dim = function(s) {
    for (var a = []; typeof s == "object"; )
      a.push(s.length), s = s[0];
    return a;
  }, numeric.dim = function(s) {
    var a, n;
    return typeof s == "object" ? (a = s[0], typeof a == "object" ? (n = a[0], typeof n == "object" ? numeric._dim(s) : [s.length, a.length]) : [s.length]) : [];
  }, numeric.mapreduce = function(s, a) {
    return Function(
      "x",
      "accum",
      "_s",
      "_k",
      'if(typeof accum === "undefined") accum = ' + a + `;
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
  }, numeric.mapreduce2 = function(s, a) {
    return Function(
      "x",
      `var n = x.length;
var i,xi;
` + a + `;
for(i=n-1;i!==-1;--i) { 
    xi = x[i];
    ` + s + `;
}
return accum;`
    );
  }, numeric.same = function D(s, a) {
    var n, f;
    if (!(s instanceof Array) || !(a instanceof Array) || (f = s.length, f !== a.length))
      return !1;
    for (n = 0; n < f; n++)
      if (s[n] !== a[n])
        if (typeof s[n] == "object") {
          if (!D(s[n], a[n])) return !1;
        } else
          return !1;
    return !0;
  }, numeric.rep = function(s, a, n) {
    typeof n > "u" && (n = 0);
    var f = s[n], t = Array(f), r;
    if (n === s.length - 1) {
      for (r = f - 2; r >= 0; r -= 2)
        t[r + 1] = a, t[r] = a;
      return r === -1 && (t[0] = a), t;
    }
    for (r = f - 1; r >= 0; r--)
      t[r] = numeric.rep(s, a, n + 1);
    return t;
  }, numeric.dotMMsmall = function(s, a) {
    var n, f, t, r, i, c, u, o, h, S, m;
    for (r = s.length, i = a.length, c = a[0].length, u = Array(r), n = r - 1; n >= 0; n--) {
      for (o = Array(c), h = s[n], t = c - 1; t >= 0; t--) {
        for (S = h[i - 1] * a[i - 1][t], f = i - 2; f >= 1; f -= 2)
          m = f - 1, S += h[f] * a[f][t] + h[m] * a[m][t];
        f === 0 && (S += h[0] * a[0][t]), o[t] = S;
      }
      u[n] = o;
    }
    return u;
  }, numeric._getCol = function(s, a, n) {
    var f = s.length, t;
    for (t = f - 1; t > 0; --t)
      n[t] = s[t][a], --t, n[t] = s[t][a];
    t === 0 && (n[0] = s[0][a]);
  }, numeric.dotMMbig = function(s, a) {
    var n = numeric._getCol, f = a.length, t = Array(f), r = s.length, i = a[0].length, c = new Array(r), u, o = numeric.dotVV, h, S;
    for (--f, --r, h = r; h !== -1; --h) c[h] = Array(i);
    for (--i, h = i; h !== -1; --h)
      for (n(a, h, t), S = r; S !== -1; --S)
        u = s[S], c[S][h] = o(u, t);
    return c;
  }, numeric.dotMV = function(s, a) {
    var n = s.length;
    a.length;
    var f, t = Array(n), r = numeric.dotVV;
    for (f = n - 1; f >= 0; f--)
      t[f] = r(s[f], a);
    return t;
  }, numeric.dotVM = function(s, a) {
    var n, f, t, r, i, c, u;
    for (t = s.length, r = a[0].length, i = Array(r), f = r - 1; f >= 0; f--) {
      for (c = s[t - 1] * a[t - 1][f], n = t - 2; n >= 1; n -= 2)
        u = n - 1, c += s[n] * a[n][f] + s[u] * a[u][f];
      n === 0 && (c += s[0] * a[0][f]), i[f] = c;
    }
    return i;
  }, numeric.dotVV = function(s, a) {
    var n, f = s.length, t, r = s[f - 1] * a[f - 1];
    for (n = f - 2; n >= 1; n -= 2)
      t = n - 1, r += s[n] * a[n] + s[t] * a[t];
    return n === 0 && (r += s[0] * a[0]), r;
  }, numeric.dot = function(s, a) {
    var n = numeric.dim;
    switch (n(s).length * 1e3 + n(a).length) {
      case 2002:
        return a.length < 10 ? numeric.dotMMsmall(s, a) : numeric.dotMMbig(s, a);
      case 2001:
        return numeric.dotMV(s, a);
      case 1002:
        return numeric.dotVM(s, a);
      case 1001:
        return numeric.dotVV(s, a);
      case 1e3:
        return numeric.mulVS(s, a);
      case 1:
        return numeric.mulSV(s, a);
      case 0:
        return s * a;
      default:
        throw new Error("numeric.dot only works on vectors and matrices");
    }
  }, numeric.diag = function(s) {
    var a, n, f, t = s.length, r = Array(t), i;
    for (a = t - 1; a >= 0; a--) {
      for (i = Array(t), n = a + 2, f = t - 1; f >= n; f -= 2)
        i[f] = 0, i[f - 1] = 0;
      for (f > a && (i[f] = 0), i[a] = s[a], f = a - 1; f >= 1; f -= 2)
        i[f] = 0, i[f - 1] = 0;
      f === 0 && (i[0] = 0), r[a] = i;
    }
    return r;
  }, numeric.getDiag = function(D) {
    var s = Math.min(D.length, D[0].length), a, n = Array(s);
    for (a = s - 1; a >= 1; --a)
      n[a] = D[a][a], --a, n[a] = D[a][a];
    return a === 0 && (n[0] = D[0][0]), n;
  }, numeric.identity = function(s) {
    return numeric.diag(numeric.rep([s], 1));
  }, numeric.pointwise = function(s, a, n) {
    typeof n > "u" && (n = "");
    var f = [], t, r = /\[i\]$/, i, c = "", u = !1;
    for (t = 0; t < s.length; t++)
      r.test(s[t]) ? (i = s[t].substring(0, s[t].length - 3), c = i) : i = s[t], i === "ret" && (u = !0), f.push(i);
    return f[s.length] = "_s", f[s.length + 1] = "_k", f[s.length + 2] = 'if(typeof _s === "undefined") _s = numeric.dim(' + c + `);
if(typeof _k === "undefined") _k = 0;
var _n = _s[_k];
var i` + (u ? "" : ", ret = Array(_n)") + `;
if(_k < _s.length-1) {
    for(i=_n-1;i>=0;i--) ret[i] = arguments.callee(` + s.join(",") + `,_s,_k+1);
    return ret;
}
` + n + `
for(i=_n-1;i!==-1;--i) {
    ` + a + `
}
return ret;`, Function.apply(null, f);
  }, numeric.pointwise2 = function(s, a, n) {
    typeof n > "u" && (n = "");
    var f = [], t, r = /\[i\]$/, i, c = "", u = !1;
    for (t = 0; t < s.length; t++)
      r.test(s[t]) ? (i = s[t].substring(0, s[t].length - 3), c = i) : i = s[t], i === "ret" && (u = !0), f.push(i);
    return f[s.length] = "var _n = " + c + `.length;
var i` + (u ? "" : ", ret = Array(_n)") + `;
` + n + `
for(i=_n-1;i!==-1;--i) {
` + a + `
}
return ret;`, Function.apply(null, f);
  }, numeric._biforeach = function D(s, a, n, f, t) {
    if (f === n.length - 1) {
      t(s, a);
      return;
    }
    var r, i = n[f];
    for (r = i - 1; r >= 0; r--)
      D(typeof s == "object" ? s[r] : s, typeof a == "object" ? a[r] : a, n, f + 1, t);
  }, numeric._biforeach2 = function D(s, a, n, f, t) {
    if (f === n.length - 1)
      return t(s, a);
    var r, i = n[f], c = Array(i);
    for (r = i - 1; r >= 0; --r)
      c[r] = D(typeof s == "object" ? s[r] : s, typeof a == "object" ? a[r] : a, n, f + 1, t);
    return c;
  }, numeric._foreach = function D(s, a, n, f) {
    if (n === a.length - 1) {
      f(s);
      return;
    }
    var t, r = a[n];
    for (t = r - 1; t >= 0; t--)
      D(s[t], a, n + 1, f);
  }, numeric._foreach2 = function D(s, a, n, f) {
    if (n === a.length - 1)
      return f(s);
    var t, r = a[n], i = Array(r);
    for (t = r - 1; t >= 0; t--)
      i[t] = D(s[t], a, n + 1, f);
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
    var D, s;
    for (D = 0; D < numeric.mathfuns2.length; ++D)
      s = numeric.mathfuns2[D], numeric.ops2[s] = s;
    for (D in numeric.ops2)
      if (numeric.ops2.hasOwnProperty(D)) {
        s = numeric.ops2[D];
        var a, n, f = "";
        numeric.myIndexOf.call(numeric.mathfuns2, D) !== -1 ? (f = "var " + s + " = Math." + s + `;
`, a = function(t, r, i) {
          return t + " = " + s + "(" + r + "," + i + ")";
        }, n = function(t, r) {
          return t + " = " + s + "(" + t + "," + r + ")";
        }) : (a = function(t, r, i) {
          return t + " = " + r + " " + s + " " + i;
        }, numeric.opseq.hasOwnProperty(D + "eq") ? n = function(t, r) {
          return t + " " + s + "= " + r;
        } : n = function(t, r) {
          return t + " = " + t + " " + s + " " + r;
        }), numeric[D + "VV"] = numeric.pointwise2(["x[i]", "y[i]"], a("ret[i]", "x[i]", "y[i]"), f), numeric[D + "SV"] = numeric.pointwise2(["x", "y[i]"], a("ret[i]", "x", "y[i]"), f), numeric[D + "VS"] = numeric.pointwise2(["x[i]", "y"], a("ret[i]", "x[i]", "y"), f), numeric[D] = Function(
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
        ), numeric[s] = numeric[D], numeric[D + "eqV"] = numeric.pointwise2(["ret[i]", "x[i]"], n("ret[i]", "x[i]"), f), numeric[D + "eqS"] = numeric.pointwise2(["ret[i]", "x"], n("ret[i]", "x"), f), numeric[D + "eq"] = Function(
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
      s = numeric.mathfuns2[D], delete numeric.ops2[s];
    for (D = 0; D < numeric.mathfuns.length; ++D)
      s = numeric.mathfuns[D], numeric.ops1[s] = s;
    for (D in numeric.ops1)
      numeric.ops1.hasOwnProperty(D) && (f = "", s = numeric.ops1[D], numeric.myIndexOf.call(numeric.mathfuns, D) !== -1 && Math.hasOwnProperty(s) && (f = "var " + s + " = Math." + s + `;
`), numeric[D + "eqV"] = numeric.pointwise2(["ret[i]"], "ret[i] = " + s + "(ret[i]);", f), numeric[D + "eq"] = Function(
        "x",
        'if(typeof x !== "object") return ' + s + `x
var i;
var V = numeric.` + D + `eqV;
var s = numeric.dim(x);
numeric._foreach(x,s,0,V);
return x;
`
      ), numeric[D + "V"] = numeric.pointwise2(["x[i]"], "ret[i] = " + s + "(x[i]);", f), numeric[D] = Function(
        "x",
        'if(typeof x !== "object") return ' + s + `(x)
var i;
var V = numeric.` + D + `V;
var s = numeric.dim(x);
return numeric._foreach2(x,s,0,V);
`
      ));
    for (D = 0; D < numeric.mathfuns.length; ++D)
      s = numeric.mathfuns[D], delete numeric.ops1[s];
    for (D in numeric.mapreducers)
      numeric.mapreducers.hasOwnProperty(D) && (s = numeric.mapreducers[D], numeric[D + "V"] = numeric.mapreduce2(s[0], s[1]), numeric[D] = Function(
        "x",
        "s",
        "k",
        s[1] + `if(typeof x !== "object") {    xi = x;
` + s[0] + `;
    return accum;
}if(typeof s === "undefined") s = numeric.dim(x);
if(typeof k === "undefined") k = 0;
if(k === s.length-1) return numeric.` + D + `V(x);
var xi;
var n = x.length, i;
for(i=n-1;i!==-1;--i) {
   xi = arguments.callee(x[i]);
` + s[0] + `;
}
return accum;
`
      ));
  })(), numeric.truncVV = numeric.pointwise(["x[i]", "y[i]"], "ret[i] = round(x[i]/y[i])*y[i];", "var round = Math.round;"), numeric.truncVS = numeric.pointwise(["x[i]", "y"], "ret[i] = round(x[i]/y)*y;", "var round = Math.round;"), numeric.truncSV = numeric.pointwise(["x", "y[i]"], "ret[i] = round(x/y[i])*y[i];", "var round = Math.round;"), numeric.trunc = function(s, a) {
    return typeof s == "object" ? typeof a == "object" ? numeric.truncVV(s, a) : numeric.truncVS(s, a) : typeof a == "object" ? numeric.truncSV(s, a) : Math.round(s / a) * a;
  }, numeric.inv = function(g) {
    var a = numeric.dim(g), n = Math.abs, f = a[0], t = a[1], r = numeric.clone(g), i, c, u = numeric.identity(f), o, h, S, m, d, g;
    for (m = 0; m < t; ++m) {
      var P = -1, E = -1;
      for (S = m; S !== f; ++S)
        d = n(r[S][m]), d > E && (P = S, E = d);
      for (c = r[P], r[P] = r[m], r[m] = c, h = u[P], u[P] = u[m], u[m] = h, g = c[m], d = m; d !== t; ++d) c[d] /= g;
      for (d = t - 1; d !== -1; --d) h[d] /= g;
      for (S = f - 1; S !== -1; --S)
        if (S !== m) {
          for (i = r[S], o = u[S], g = i[m], d = m + 1; d !== t; ++d) i[d] -= c[d] * g;
          for (d = t - 1; d > 0; --d)
            o[d] -= h[d] * g, --d, o[d] -= h[d] * g;
          d === 0 && (o[0] -= h[0] * g);
        }
    }
    return u;
  }, numeric.det = function(s) {
    var a = numeric.dim(s);
    if (a.length !== 2 || a[0] !== a[1])
      throw new Error("numeric: det() only works on square matrices");
    var n = a[0], f = 1, t, r, i, c = numeric.clone(s), u, o, h, S, m;
    for (r = 0; r < n - 1; r++) {
      for (i = r, t = r + 1; t < n; t++)
        Math.abs(c[t][r]) > Math.abs(c[i][r]) && (i = t);
      for (i !== r && (S = c[i], c[i] = c[r], c[r] = S, f *= -1), u = c[r], t = r + 1; t < n; t++) {
        for (o = c[t], h = o[r] / u[r], i = r + 1; i < n - 1; i += 2)
          m = i + 1, o[i] -= u[i] * h, o[m] -= u[m] * h;
        i !== n && (o[i] -= u[i] * h);
      }
      if (u[r] === 0)
        return 0;
      f *= u[r];
    }
    return f * c[r][r];
  }, numeric.transpose = function(s) {
    var a, n, f = s.length, t = s[0].length, r = Array(t), i, c, u;
    for (n = 0; n < t; n++) r[n] = Array(f);
    for (a = f - 1; a >= 1; a -= 2) {
      for (c = s[a], i = s[a - 1], n = t - 1; n >= 1; --n)
        u = r[n], u[a] = c[n], u[a - 1] = i[n], --n, u = r[n], u[a] = c[n], u[a - 1] = i[n];
      n === 0 && (u = r[0], u[a] = c[0], u[a - 1] = i[0]);
    }
    if (a === 0) {
      for (i = s[0], n = t - 1; n >= 1; --n)
        r[n][0] = i[n], --n, r[n][0] = i[n];
      n === 0 && (r[0][0] = i[0]);
    }
    return r;
  }, numeric.negtranspose = function(s) {
    var a, n, f = s.length, t = s[0].length, r = Array(t), i, c, u;
    for (n = 0; n < t; n++) r[n] = Array(f);
    for (a = f - 1; a >= 1; a -= 2) {
      for (c = s[a], i = s[a - 1], n = t - 1; n >= 1; --n)
        u = r[n], u[a] = -c[n], u[a - 1] = -i[n], --n, u = r[n], u[a] = -c[n], u[a - 1] = -i[n];
      n === 0 && (u = r[0], u[a] = -c[0], u[a - 1] = -i[0]);
    }
    if (a === 0) {
      for (i = s[0], n = t - 1; n >= 1; --n)
        r[n][0] = -i[n], --n, r[n][0] = -i[n];
      n === 0 && (r[0][0] = -i[0]);
    }
    return r;
  }, numeric._random = function D(s, a) {
    var n, f = s[a], t = Array(f), r;
    if (a === s.length - 1) {
      for (r = Math.random, n = f - 1; n >= 1; n -= 2)
        t[n] = r(), t[n - 1] = r();
      return n === 0 && (t[0] = r()), t;
    }
    for (n = f - 1; n >= 0; n--) t[n] = D(s, a + 1);
    return t;
  }, numeric.random = function(s) {
    return numeric._random(s, 0);
  }, numeric.norm2 = function(s) {
    return Math.sqrt(numeric.norm2Squared(s));
  }, numeric.linspace = function(s, a, n) {
    if (typeof n > "u" && (n = Math.max(Math.round(a - s) + 1, 1)), n < 2)
      return n === 1 ? [s] : [];
    var f, t = Array(n);
    for (n--, f = n; f >= 0; f--)
      t[f] = (f * a + (n - f) * s) / n;
    return t;
  }, numeric.getBlock = function(s, a, n) {
    var f = numeric.dim(s);
    function t(r, i) {
      var c, u = a[i], o = n[i] - u, h = Array(o);
      if (i === f.length - 1) {
        for (c = o; c >= 0; c--)
          h[c] = r[c + u];
        return h;
      }
      for (c = o; c >= 0; c--)
        h[c] = t(r[c + u], i + 1);
      return h;
    }
    return t(s, 0);
  }, numeric.setBlock = function(s, a, n, f) {
    var t = numeric.dim(s);
    function r(i, c, u) {
      var o, h = a[u], S = n[u] - h;
      if (u === t.length - 1)
        for (o = S; o >= 0; o--)
          i[o + h] = c[o];
      for (o = S; o >= 0; o--)
        r(i[o + h], c[o], u + 1);
    }
    return r(s, f, 0), s;
  }, numeric.getRange = function(s, a, n) {
    var f = a.length, t = n.length, r, i, c = Array(f), u, o;
    for (r = f - 1; r !== -1; --r)
      for (c[r] = Array(t), u = c[r], o = s[a[r]], i = t - 1; i !== -1; --i) u[i] = o[n[i]];
    return c;
  }, numeric.blockMatrix = function(s) {
    var a = numeric.dim(s);
    if (a.length < 4) return numeric.blockMatrix([s]);
    var n = a[0], f = a[1], t, r, i, c, u;
    for (t = 0, r = 0, i = 0; i < n; ++i) t += s[i][0].length;
    for (c = 0; c < f; ++c) r += s[0][c][0].length;
    var o = Array(t);
    for (i = 0; i < t; ++i) o[i] = Array(r);
    var h = 0, S, m, d, g, P;
    for (i = 0; i < n; ++i) {
      for (S = r, c = f - 1; c !== -1; --c)
        for (u = s[i][c], S -= u[0].length, d = u.length - 1; d !== -1; --d)
          for (P = u[d], m = o[h + d], g = P.length - 1; g !== -1; --g) m[S + g] = P[g];
      h += s[i][0].length;
    }
    return o;
  }, numeric.tensor = function(s, a) {
    if (typeof s == "number" || typeof a == "number") return numeric.mul(s, a);
    var n = numeric.dim(s), f = numeric.dim(a);
    if (n.length !== 1 || f.length !== 1)
      throw new Error("numeric: tensor product is only defined for vectors");
    var t = n[0], r = f[0], i = Array(t), c, u, o, h;
    for (u = t - 1; u >= 0; u--) {
      for (c = Array(r), h = s[u], o = r - 1; o >= 3; --o)
        c[o] = h * a[o], --o, c[o] = h * a[o], --o, c[o] = h * a[o], --o, c[o] = h * a[o];
      for (; o >= 0; )
        c[o] = h * a[o], --o;
      i[u] = c;
    }
    return i;
  }, numeric.T = function(s, a) {
    this.x = s, this.y = a;
  }, numeric.t = function(s, a) {
    return new numeric.T(s, a);
  }, numeric.Tbinop = function(s, a, n, f, t) {
    if (numeric.indexOf, typeof t != "string") {
      var r;
      t = "";
      for (r in numeric)
        numeric.hasOwnProperty(r) && (s.indexOf(r) >= 0 || a.indexOf(r) >= 0 || n.indexOf(r) >= 0 || f.indexOf(r) >= 0) && r.length > 1 && (t += "var " + r + " = numeric." + r + `;
`);
    }
    return Function(
      ["y"],
      `var x = this;
if(!(y instanceof numeric.T)) { y = new numeric.T(y); }
` + t + `
if(x.y) {  if(y.y) {    return new numeric.T(` + f + `);
  }
  return new numeric.T(` + n + `);
}
if(y.y) {
  return new numeric.T(` + a + `);
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
    var s = numeric.mul, a = numeric.div;
    if (this.y) {
      var n = numeric.add(s(this.x, this.x), s(this.y, this.y));
      return new numeric.T(a(this.x, n), a(numeric.neg(this.y), n));
    }
    return new T(a(1, this.x));
  }, numeric.T.prototype.div = function(s) {
    if (s instanceof numeric.T || (s = new numeric.T(s)), s.y)
      return this.mul(s.reciprocal());
    var a = numeric.div;
    return this.y ? new numeric.T(a(this.x, s.x), a(this.y, s.x)) : new numeric.T(a(this.x, s.x));
  }, numeric.T.prototype.dot = numeric.Tbinop(
    "dot(x.x,y.x)",
    "dot(x.x,y.x),dot(x.x,y.y)",
    "dot(x.x,y.x),dot(x.y,y.x)",
    "sub(dot(x.x,y.x),dot(x.y,y.y)),add(dot(x.x,y.y),dot(x.y,y.x))"
  ), numeric.T.prototype.transpose = function() {
    var s = numeric.transpose, a = this.x, n = this.y;
    return n ? new numeric.T(s(a), s(n)) : new numeric.T(s(a));
  }, numeric.T.prototype.transjugate = function() {
    var s = numeric.transpose, a = this.x, n = this.y;
    return n ? new numeric.T(s(a), numeric.negtranspose(n)) : new numeric.T(s(a));
  }, numeric.Tunop = function(s, a, n) {
    return typeof n != "string" && (n = ""), Function(
      `var x = this;
` + n + `
if(x.y) {  ` + a + `;
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
    var a = s.x.length, g, P, E, n = numeric.identity(a), f = numeric.rep([a, a], 0), t = numeric.clone(s.x), r = numeric.clone(s.y), i, c, u, o, h, S, m, d, g, P, E, z, y, v, R, L, I, l;
    for (g = 0; g < a; g++) {
      for (v = t[g][g], R = r[g][g], z = v * v + R * R, E = g, P = g + 1; P < a; P++)
        v = t[P][g], R = r[P][g], y = v * v + R * R, y > z && (E = P, z = y);
      for (E !== g && (l = t[g], t[g] = t[E], t[E] = l, l = r[g], r[g] = r[E], r[E] = l, l = n[g], n[g] = n[E], n[E] = l, l = f[g], f[g] = f[E], f[E] = l), i = t[g], c = r[g], h = n[g], S = f[g], v = i[g], R = c[g], P = g + 1; P < a; P++)
        L = i[P], I = c[P], i[P] = (L * v + I * R) / z, c[P] = (I * v - L * R) / z;
      for (P = 0; P < a; P++)
        L = h[P], I = S[P], h[P] = (L * v + I * R) / z, S[P] = (I * v - L * R) / z;
      for (P = g + 1; P < a; P++) {
        for (u = t[P], o = r[P], m = n[P], d = f[P], v = u[g], R = o[g], E = g + 1; E < a; E++)
          L = i[E], I = c[E], u[E] -= L * v - I * R, o[E] -= I * v + L * R;
        for (E = 0; E < a; E++)
          L = h[E], I = S[E], m[E] -= L * v - I * R, d[E] -= I * v + L * R;
      }
    }
    for (g = a - 1; g > 0; g--)
      for (h = n[g], S = f[g], P = g - 1; P >= 0; P--)
        for (m = n[P], d = f[P], v = t[P][g], R = r[P][g], E = a - 1; E >= 0; E--)
          L = h[E], I = S[E], m[E] -= v * L - R * I, d[E] -= v * I + R * L;
    return new numeric.T(n, f);
  }, numeric.T.prototype.get = function(s) {
    var a = this.x, n = this.y, f = 0, t, r = s.length;
    if (n) {
      for (; f < r; )
        t = s[f], a = a[t], n = n[t], f++;
      return new numeric.T(a, n);
    }
    for (; f < r; )
      t = s[f], a = a[t], f++;
    return new numeric.T(a);
  }, numeric.T.prototype.set = function(s, a) {
    var n = this.x, f = this.y, t = 0, r, i = s.length, c = a.x, u = a.y;
    if (i === 0)
      return u ? this.y = u : f && (this.y = void 0), this.x = n, this;
    if (u) {
      for (f || (f = numeric.rep(numeric.dim(n), 0), this.y = f); t < i - 1; )
        r = s[t], n = n[r], f = f[r], t++;
      return r = s[t], n[r] = c, f[r] = u, this;
    }
    if (f) {
      for (; t < i - 1; )
        r = s[t], n = n[r], f = f[r], t++;
      return r = s[t], n[r] = c, c instanceof Array ? f[r] = numeric.rep(numeric.dim(c), 0) : f[r] = 0, this;
    }
    for (; t < i - 1; )
      r = s[t], n = n[r], t++;
    return r = s[t], n[r] = c, this;
  }, numeric.T.prototype.getRows = function(s, a) {
    var n = a - s + 1, f, t = Array(n), r, i = this.x, c = this.y;
    for (f = s; f <= a; f++)
      t[f - s] = i[f];
    if (c) {
      for (r = Array(n), f = s; f <= a; f++)
        r[f - s] = c[f];
      return new numeric.T(t, r);
    }
    return new numeric.T(t);
  }, numeric.T.prototype.setRows = function(s, a, n) {
    var f, t = this.x, r = this.y, i = n.x, c = n.y;
    for (f = s; f <= a; f++)
      t[f] = i[f - s];
    if (c)
      for (r || (r = numeric.rep(numeric.dim(t), 0), this.y = r), f = s; f <= a; f++)
        r[f] = c[f - s];
    else if (r)
      for (f = s; f <= a; f++)
        r[f] = numeric.rep([i[f - s].length], 0);
    return this;
  }, numeric.T.prototype.getRow = function(s) {
    var a = this.x, n = this.y;
    return n ? new numeric.T(a[s], n[s]) : new numeric.T(a[s]);
  }, numeric.T.prototype.setRow = function(s, a) {
    var n = this.x, f = this.y, t = a.x, r = a.y;
    return n[s] = t, r ? (f || (f = numeric.rep(numeric.dim(n), 0), this.y = f), f[s] = r) : f && (f = numeric.rep([t.length], 0)), this;
  }, numeric.T.prototype.getBlock = function(s, a) {
    var n = this.x, f = this.y, t = numeric.getBlock;
    return f ? new numeric.T(t(n, s, a), t(f, s, a)) : new numeric.T(t(n, s, a));
  }, numeric.T.prototype.setBlock = function(s, a, n) {
    n instanceof numeric.T || (n = new numeric.T(n));
    var f = this.x, t = this.y, r = numeric.setBlock, i = n.x, c = n.y;
    if (c)
      return t || (this.y = numeric.rep(numeric.dim(this), 0), t = this.y), r(f, s, a, i), r(t, s, a, c), this;
    r(f, s, a, i), t && r(t, s, a, numeric.rep(numeric.dim(i), 0));
  }, numeric.T.rep = function(s, a) {
    var n = numeric.T;
    a instanceof n || (a = new n(a));
    var f = a.x, t = a.y, r = numeric.rep;
    return t ? new n(r(s, f), r(s, t)) : new n(r(s, f));
  }, numeric.T.diag = function(s) {
    s instanceof numeric.T || (s = new numeric.T(s));
    var a = s.x, n = s.y, f = numeric.diag;
    return n ? new numeric.T(f(a), f(n)) : new numeric.T(f(a));
  }, numeric.T.eig = function() {
    if (this.y)
      throw new Error("eig: not implemented for complex matrices.");
    return numeric.eig(this.x);
  }, numeric.T.identity = function(s) {
    return new numeric.T(numeric.identity(s));
  }, numeric.T.prototype.getDiag = function() {
    var s = numeric, a = this.x, n = this.y;
    return n ? new s.T(s.getDiag(a), s.getDiag(n)) : new s.T(s.getDiag(a));
  }, numeric.house = function(s) {
    var a = numeric.clone(s), n = s[0] >= 0 ? 1 : -1, f = n * numeric.norm2(s);
    a[0] += f;
    var t = numeric.norm2(a);
    if (t === 0)
      throw new Error("eig: internal error");
    return numeric.div(a, t);
  }, numeric.toUpperHessenberg = function(s) {
    var a = numeric.dim(s);
    if (a.length !== 2 || a[0] !== a[1])
      throw new Error("numeric: toUpperHessenberg() only works on square matrices");
    var n = a[0], f, t, r, i, c, u = numeric.clone(s), o, h, S, m, d = numeric.identity(n), g;
    for (t = 0; t < n - 2; t++) {
      for (i = Array(n - t - 1), f = t + 1; f < n; f++)
        i[f - t - 1] = u[f][t];
      if (numeric.norm2(i) > 0) {
        for (c = numeric.house(i), o = numeric.getBlock(u, [t + 1, t], [n - 1, n - 1]), h = numeric.tensor(c, numeric.dot(c, o)), f = t + 1; f < n; f++)
          for (S = u[f], m = h[f - t - 1], r = t; r < n; r++) S[r] -= 2 * m[r - t];
        for (o = numeric.getBlock(u, [0, t + 1], [n - 1, n - 1]), h = numeric.tensor(numeric.dot(o, c), c), f = 0; f < n; f++)
          for (S = u[f], m = h[f], r = t + 1; r < n; r++) S[r] -= 2 * m[r - t - 1];
        for (o = Array(n - t - 1), f = t + 1; f < n; f++) o[f - t - 1] = d[f];
        for (h = numeric.tensor(c, numeric.dot(c, o)), f = t + 1; f < n; f++)
          for (g = d[f], m = h[f - t - 1], r = 0; r < n; r++) g[r] -= 2 * m[r];
      }
    }
    return { H: u, Q: d };
  }, numeric.epsilon = 2220446049250313e-31, numeric.QRFrancis = function(D, s) {
    typeof s > "u" && (s = 1e4), D = numeric.clone(D), numeric.clone(D);
    var a = numeric.dim(D), n = a[0], f, t, r, i, c, u, o, h, S, m = numeric.identity(n), d, g, P, E, z, y, v, R, L;
    if (n < 3)
      return { Q: m, B: [[0, n - 1]] };
    var I = numeric.epsilon;
    for (L = 0; L < s; L++) {
      for (v = 0; v < n - 1; v++)
        if (Math.abs(D[v + 1][v]) < I * (Math.abs(D[v][v]) + Math.abs(D[v + 1][v + 1]))) {
          var l = numeric.QRFrancis(numeric.getBlock(D, [0, 0], [v, v]), s), w = numeric.QRFrancis(numeric.getBlock(D, [v + 1, v + 1], [n - 1, n - 1]), s);
          for (P = Array(v + 1), y = 0; y <= v; y++)
            P[y] = m[y];
          for (E = numeric.dot(l.Q, P), y = 0; y <= v; y++)
            m[y] = E[y];
          for (P = Array(n - v - 1), y = v + 1; y < n; y++)
            P[y - v - 1] = m[y];
          for (E = numeric.dot(w.Q, P), y = v + 1; y < n; y++)
            m[y] = E[y - v - 1];
          return { Q: m, B: l.B.concat(numeric.add(w.B, v + 1)) };
        }
      if (r = D[n - 2][n - 2], i = D[n - 2][n - 1], c = D[n - 1][n - 2], u = D[n - 1][n - 1], h = r + u, o = r * u - i * c, S = numeric.getBlock(D, [0, 0], [2, 2]), h * h >= 4 * o) {
        var O, j;
        O = 0.5 * (h + Math.sqrt(h * h - 4 * o)), j = 0.5 * (h - Math.sqrt(h * h - 4 * o)), S = numeric.add(
          numeric.sub(
            numeric.dot(S, S),
            numeric.mul(S, O + j)
          ),
          numeric.diag(numeric.rep([3], O * j))
        );
      } else
        S = numeric.add(
          numeric.sub(
            numeric.dot(S, S),
            numeric.mul(S, h)
          ),
          numeric.diag(numeric.rep([3], o))
        );
      for (f = [S[0][0], S[1][0], S[2][0]], t = numeric.house(f), P = [D[0], D[1], D[2]], E = numeric.tensor(t, numeric.dot(t, P)), y = 0; y < 3; y++)
        for (g = D[y], z = E[y], R = 0; R < n; R++) g[R] -= 2 * z[R];
      for (P = numeric.getBlock(D, [0, 0], [n - 1, 2]), E = numeric.tensor(numeric.dot(P, t), t), y = 0; y < n; y++)
        for (g = D[y], z = E[y], R = 0; R < 3; R++) g[R] -= 2 * z[R];
      for (P = [m[0], m[1], m[2]], E = numeric.tensor(t, numeric.dot(t, P)), y = 0; y < 3; y++)
        for (d = m[y], z = E[y], R = 0; R < n; R++) d[R] -= 2 * z[R];
      var Y;
      for (v = 0; v < n - 2; v++) {
        for (R = v; R <= v + 1; R++)
          if (Math.abs(D[R + 1][R]) < I * (Math.abs(D[R][R]) + Math.abs(D[R + 1][R + 1]))) {
            var l = numeric.QRFrancis(numeric.getBlock(D, [0, 0], [R, R]), s), w = numeric.QRFrancis(numeric.getBlock(D, [R + 1, R + 1], [n - 1, n - 1]), s);
            for (P = Array(R + 1), y = 0; y <= R; y++)
              P[y] = m[y];
            for (E = numeric.dot(l.Q, P), y = 0; y <= R; y++)
              m[y] = E[y];
            for (P = Array(n - R - 1), y = R + 1; y < n; y++)
              P[y - R - 1] = m[y];
            for (E = numeric.dot(w.Q, P), y = R + 1; y < n; y++)
              m[y] = E[y - R - 1];
            return { Q: m, B: l.B.concat(numeric.add(w.B, R + 1)) };
          }
        for (Y = Math.min(n - 1, v + 3), f = Array(Y - v), y = v + 1; y <= Y; y++)
          f[y - v - 1] = D[y][v];
        for (t = numeric.house(f), P = numeric.getBlock(D, [v + 1, v], [Y, n - 1]), E = numeric.tensor(t, numeric.dot(t, P)), y = v + 1; y <= Y; y++)
          for (g = D[y], z = E[y - v - 1], R = v; R < n; R++) g[R] -= 2 * z[R - v];
        for (P = numeric.getBlock(D, [0, v + 1], [n - 1, Y]), E = numeric.tensor(numeric.dot(P, t), t), y = 0; y < n; y++)
          for (g = D[y], z = E[y], R = v + 1; R <= Y; R++) g[R] -= 2 * z[R - v - 1];
        for (P = Array(Y - v), y = v + 1; y <= Y; y++) P[y - v - 1] = m[y];
        for (E = numeric.tensor(t, numeric.dot(t, P)), y = v + 1; y <= Y; y++)
          for (d = m[y], z = E[y - v - 1], R = 0; R < n; R++) d[R] -= 2 * z[R];
      }
    }
    throw new Error("numeric: eigenvalue iteration does not converge -- increase maxiter?");
  }, numeric.eig = function(s, a) {
    var n = numeric.toUpperHessenberg(s), f = numeric.QRFrancis(n.H, a), t = numeric.T, W = s.length, r, i, c = f.B, u = numeric.dot(f.Q, numeric.dot(n.H, numeric.transpose(f.Q))), o = new t(numeric.dot(f.Q, n.Q)), h, S = c.length, m, d, g, P, E, z, y, v, R, L, I, l, w, O, j = Math.sqrt;
    for (i = 0; i < S; i++)
      if (r = c[i][0], r !== c[i][1]) {
        if (m = r + 1, d = u[r][r], g = u[r][m], P = u[m][r], E = u[m][m], g === 0 && P === 0) continue;
        z = -d - E, y = d * E - g * P, v = z * z - 4 * y, v >= 0 ? (z < 0 ? R = -0.5 * (z - j(v)) : R = -0.5 * (z + j(v)), w = (d - R) * (d - R) + g * g, O = P * P + (E - R) * (E - R), w > O ? (w = j(w), I = (d - R) / w, l = g / w) : (O = j(O), I = P / O, l = (E - R) / O), h = new t([[l, -I], [I, l]]), o.setRows(r, m, h.dot(o.getRows(r, m)))) : (R = -0.5 * z, L = 0.5 * j(-v), w = (d - R) * (d - R) + g * g, O = P * P + (E - R) * (E - R), w > O ? (w = j(w + L * L), I = (d - R) / w, l = g / w, R = 0, L /= w) : (O = j(O + L * L), I = P / O, l = (E - R) / O, R = L / O, L = 0), h = new t([[l, -I], [I, l]], [[R, L], [L, -R]]), o.setRows(r, m, h.dot(o.getRows(r, m))));
      }
    var Y = o.dot(s).dot(o.transjugate()), W = s.length, er = numeric.T.identity(W);
    for (m = 0; m < W; m++)
      if (m > 0)
        for (i = m - 1; i >= 0; i--) {
          var mr = Y.get([i, i]), Mr = Y.get([m, m]);
          if (numeric.neq(mr.x, Mr.x) || numeric.neq(mr.y, Mr.y))
            R = Y.getRow(i).getBlock([i], [m - 1]), L = er.getRow(m).getBlock([i], [m - 1]), er.set([m, i], Y.get([i, m]).neg().sub(R.dot(L)).div(mr.sub(Mr)));
          else {
            er.setRow(m, er.getRow(i));
            continue;
          }
        }
    for (m = 0; m < W; m++)
      R = er.getRow(m), er.setRow(m, R.div(R.norm2()));
    return er = er.transpose(), er = o.transjugate().dot(er), { lambda: Y.getDiag(), E: er };
  }, numeric.ccsSparse = function(s) {
    var a = s.length, i, n, f, t, r = [];
    for (f = a - 1; f !== -1; --f) {
      n = s[f];
      for (t in n) {
        for (t = parseInt(t); t >= r.length; ) r[r.length] = 0;
        n[t] !== 0 && r[t]++;
      }
    }
    var i = r.length, c = Array(i + 1);
    for (c[0] = 0, f = 0; f < i; ++f) c[f + 1] = c[f] + r[f];
    var u = Array(c[i]), o = Array(c[i]);
    for (f = a - 1; f !== -1; --f) {
      n = s[f];
      for (t in n)
        n[t] !== 0 && (r[t]--, u[c[t] + r[t]] = f, o[c[t] + r[t]] = n[t]);
    }
    return [c, u, o];
  }, numeric.ccsFull = function(s) {
    var a = s[0], n = s[1], f = s[2], t = numeric.ccsDim(s), r = t[0], i = t[1], c, u, o, h, S = numeric.rep([r, i], 0);
    for (c = 0; c < i; c++)
      for (o = a[c], h = a[c + 1], u = o; u < h; ++u)
        S[n[u]][c] = f[u];
    return S;
  }, numeric.ccsTSolve = function(s, a, n, f, t) {
    var r = s[0], i = s[1], c = s[2], u = r.length - 1, o = Math.max, h = 0;
    typeof f > "u" && (n = numeric.rep([u], 0)), typeof f > "u" && (f = numeric.linspace(0, n.length - 1)), typeof t > "u" && (t = []);
    function S(v) {
      var R;
      if (n[v] === 0) {
        for (n[v] = 1, R = r[v]; R < r[v + 1]; ++R) S(i[R]);
        t[h] = v, ++h;
      }
    }
    var m, d, g, P, E, z, y;
    for (m = f.length - 1; m !== -1; --m)
      S(f[m]);
    for (t.length = h, m = t.length - 1; m !== -1; --m)
      n[t[m]] = 0;
    for (m = f.length - 1; m !== -1; --m)
      d = f[m], n[d] = a[d];
    for (m = t.length - 1; m !== -1; --m) {
      for (d = t[m], g = r[d], P = o(r[d + 1], g), E = g; E !== P; ++E)
        if (i[E] === d) {
          n[d] /= c[E];
          break;
        }
      for (y = n[d], E = g; E !== P; ++E)
        z = i[E], z !== d && (n[z] -= y * c[E]);
    }
    return n;
  }, numeric.ccsDFS = function(s) {
    this.k = Array(s), this.k1 = Array(s), this.j = Array(s);
  }, numeric.ccsDFS.prototype.dfs = function(s, a, n, f, t, r) {
    var i = 0, c, u = t.length, o = this.k, h = this.k1, S = this.j, m, d;
    if (f[s] === 0)
      for (f[s] = 1, S[0] = s, o[0] = m = a[s], h[0] = d = a[s + 1]; ; )
        if (m >= d) {
          if (t[u] = S[i], i === 0) return;
          ++u, --i, m = o[i], d = h[i];
        } else
          c = r[n[m]], f[c] === 0 ? (f[c] = 1, o[i] = m, ++i, S[i] = c, m = a[c], h[i] = d = a[c + 1]) : ++m;
  }, numeric.ccsLPSolve = function(s, a, n, f, t, r, i) {
    var c = s[0], u = s[1], o = s[2];
    c.length - 1;
    var h = a[0], S = a[1], m = a[2], d, g, P, E, z, y, v, R, L;
    for (g = h[t], P = h[t + 1], f.length = 0, d = g; d < P; ++d)
      i.dfs(r[S[d]], c, u, n, f, r);
    for (d = f.length - 1; d !== -1; --d)
      n[f[d]] = 0;
    for (d = g; d !== P; ++d)
      E = r[S[d]], n[E] = m[d];
    for (d = f.length - 1; d !== -1; --d) {
      for (E = f[d], z = c[E], y = c[E + 1], v = z; v < y; ++v)
        if (r[u[v]] === E) {
          n[E] /= o[v];
          break;
        }
      for (L = n[E], v = z; v < y; ++v)
        R = r[u[v]], R !== E && (n[R] -= L * o[v]);
    }
    return n;
  }, numeric.ccsLUP1 = function(s, a) {
    var n = s[0].length - 1, f = [numeric.rep([n + 1], 0), [], []], t = [numeric.rep([n + 1], 0), [], []], r = f[0], i = f[1], c = f[2], u = t[0], o = t[1], h = t[2], S = numeric.rep([n], 0), m = numeric.rep([n], 0), d, g, P, E, z, y, v, R = numeric.ccsLPSolve, L = Math.abs, I = numeric.linspace(0, n - 1), l = numeric.linspace(0, n - 1), w = new numeric.ccsDFS(n);
    for (typeof a > "u" && (a = 1), d = 0; d < n; ++d) {
      for (R(f, s, S, m, d, l, w), E = -1, z = -1, g = m.length - 1; g !== -1; --g)
        P = m[g], !(P <= d) && (y = L(S[P]), y > E && (z = P, E = y));
      for (L(S[d]) < a * E && (g = I[d], E = I[z], I[d] = E, l[E] = d, I[z] = g, l[g] = z, E = S[d], S[d] = S[z], S[z] = E), E = r[d], z = u[d], v = S[d], i[E] = I[d], c[E] = 1, ++E, g = m.length - 1; g !== -1; --g)
        P = m[g], y = S[P], m[g] = 0, S[P] = 0, P <= d ? (o[z] = P, h[z] = y, ++z) : (i[E] = I[P], c[E] = y / v, ++E);
      r[d + 1] = E, u[d + 1] = z;
    }
    for (g = i.length - 1; g !== -1; --g)
      i[g] = l[i[g]];
    return { L: f, U: t, P: I, Pinv: l };
  }, numeric.ccsDFS0 = function(s) {
    this.k = Array(s), this.k1 = Array(s), this.j = Array(s);
  }, numeric.ccsDFS0.prototype.dfs = function(s, a, n, f, t, r, i) {
    var c = 0, u, o = t.length, h = this.k, S = this.k1, m = this.j, d, g;
    if (f[s] === 0)
      for (f[s] = 1, m[0] = s, h[0] = d = a[r[s]], S[0] = g = a[r[s] + 1]; ; ) {
        if (isNaN(d)) throw new Error("Ow!");
        if (d >= g) {
          if (t[o] = r[m[c]], c === 0) return;
          ++o, --c, d = h[c], g = S[c];
        } else
          u = n[d], f[u] === 0 ? (f[u] = 1, h[c] = d, ++c, m[c] = u, u = r[u], d = a[u], S[c] = g = a[u + 1]) : ++d;
      }
  }, numeric.ccsLPSolve0 = function(s, a, n, f, t, r, i, c) {
    var u = s[0], o = s[1], h = s[2];
    u.length - 1;
    var S = a[0], m = a[1], d = a[2], g, P, E, z, y, v, R, L, I;
    for (P = S[t], E = S[t + 1], f.length = 0, g = P; g < E; ++g)
      c.dfs(m[g], u, o, n, f, r, i);
    for (g = f.length - 1; g !== -1; --g)
      z = f[g], n[i[z]] = 0;
    for (g = P; g !== E; ++g)
      z = m[g], n[z] = d[g];
    for (g = f.length - 1; g !== -1; --g) {
      for (z = f[g], L = i[z], y = u[z], v = u[z + 1], R = y; R < v; ++R)
        if (o[R] === L) {
          n[L] /= h[R];
          break;
        }
      for (I = n[L], R = y; R < v; ++R) n[o[R]] -= I * h[R];
      n[L] = I;
    }
  }, numeric.ccsLUP0 = function(s, a) {
    var n = s[0].length - 1, f = [numeric.rep([n + 1], 0), [], []], t = [numeric.rep([n + 1], 0), [], []], r = f[0], i = f[1], c = f[2], u = t[0], o = t[1], h = t[2], S = numeric.rep([n], 0), m = numeric.rep([n], 0), d, g, P, E, z, y, v, R = numeric.ccsLPSolve0, L = Math.abs, I = numeric.linspace(0, n - 1), l = numeric.linspace(0, n - 1), w = new numeric.ccsDFS0(n);
    for (typeof a > "u" && (a = 1), d = 0; d < n; ++d) {
      for (R(f, s, S, m, d, l, I, w), E = -1, z = -1, g = m.length - 1; g !== -1; --g)
        P = m[g], !(P <= d) && (y = L(S[I[P]]), y > E && (z = P, E = y));
      for (L(S[I[d]]) < a * E && (g = I[d], E = I[z], I[d] = E, l[E] = d, I[z] = g, l[g] = z), E = r[d], z = u[d], v = S[I[d]], i[E] = I[d], c[E] = 1, ++E, g = m.length - 1; g !== -1; --g)
        P = m[g], y = S[I[P]], m[g] = 0, S[I[P]] = 0, P <= d ? (o[z] = P, h[z] = y, ++z) : (i[E] = I[P], c[E] = y / v, ++E);
      r[d + 1] = E, u[d + 1] = z;
    }
    for (g = i.length - 1; g !== -1; --g)
      i[g] = l[i[g]];
    return { L: f, U: t, P: I, Pinv: l };
  }, numeric.ccsLUP = numeric.ccsLUP0, numeric.ccsDim = function(s) {
    return [numeric.sup(s[1]) + 1, s[0].length - 1];
  }, numeric.ccsGetBlock = function(s, a, n) {
    var f = numeric.ccsDim(s), t = f[0], r = f[1];
    typeof a > "u" ? a = numeric.linspace(0, t - 1) : typeof a == "number" && (a = [a]), typeof n > "u" ? n = numeric.linspace(0, r - 1) : typeof n == "number" && (n = [n]);
    var i, c = a.length, u, o = n.length, h, S, m, d = numeric.rep([r], 0), g = [], P = [], E = [d, g, P], z = s[0], y = s[1], v = s[2], R = numeric.rep([t], 0), L = 0, I = numeric.rep([t], 0);
    for (u = 0; u < o; ++u) {
      S = n[u];
      var l = z[S], w = z[S + 1];
      for (i = l; i < w; ++i)
        h = y[i], I[h] = 1, R[h] = v[i];
      for (i = 0; i < c; ++i)
        m = a[i], I[m] && (g[L] = i, P[L] = R[a[i]], ++L);
      for (i = l; i < w; ++i)
        h = y[i], I[h] = 0;
      d[u + 1] = L;
    }
    return E;
  }, numeric.ccsDot = function(s, a) {
    var n = s[0], f = s[1], t = s[2], r = a[0], i = a[1], c = a[2], u = numeric.ccsDim(s), o = numeric.ccsDim(a), h = u[0];
    u[1];
    var S = o[1], m = numeric.rep([h], 0), d = numeric.rep([h], 0), g = Array(h), P = numeric.rep([S], 0), E = [], z = [], y = [P, E, z], v, R, L, I, l, w, O, j, Y, W, er;
    for (L = 0; L !== S; ++L) {
      for (I = r[L], l = r[L + 1], Y = 0, R = I; R < l; ++R)
        for (W = i[R], er = c[R], w = n[W], O = n[W + 1], v = w; v < O; ++v)
          j = f[v], d[j] === 0 && (g[Y] = j, d[j] = 1, Y = Y + 1), m[j] = m[j] + t[v] * er;
      for (I = P[L], l = I + Y, P[L + 1] = l, R = Y - 1; R !== -1; --R)
        er = I + R, v = g[R], E[er] = v, z[er] = m[v], d[v] = 0, m[v] = 0;
      P[L + 1] = P[L] + Y;
    }
    return y;
  }, numeric.ccsLUPSolve = function(s, a) {
    var n = s.L, f = s.U;
    s.P;
    var t = a[0], r = !1;
    typeof t != "object" && (a = [[0, a.length], numeric.linspace(0, a.length - 1), a], t = a[0], r = !0);
    var i = a[1], c = a[2], u = n[0].length - 1, o = t.length - 1, h = numeric.rep([u], 0), S = Array(u), m = numeric.rep([u], 0), d = Array(u), g = numeric.rep([o + 1], 0), P = [], E = [], z = numeric.ccsTSolve, y, v, R, L, I, l, w = 0;
    for (y = 0; y < o; ++y) {
      for (I = 0, R = t[y], L = t[y + 1], v = R; v < L; ++v)
        l = s.Pinv[i[v]], d[I] = l, m[l] = c[v], ++I;
      for (d.length = I, z(n, m, h, d, S), v = d.length - 1; v !== -1; --v) m[d[v]] = 0;
      if (z(f, h, m, S, d), r) return m;
      for (v = S.length - 1; v !== -1; --v) h[S[v]] = 0;
      for (v = d.length - 1; v !== -1; --v)
        l = d[v], P[w] = l, E[w] = m[l], m[l] = 0, ++w;
      g[y + 1] = w;
    }
    return [g, P, E];
  }, numeric.ccsbinop = function(s, a) {
    return typeof a > "u" && (a = ""), Function(
      "X",
      "Y",
      `var Xi = X[0], Xj = X[1], Xv = X[2];
var Yi = Y[0], Yj = Y[1], Yv = Y[2];
var n = Xi.length-1,m = Math.max(numeric.sup(Xj),numeric.sup(Yj))+1;
var Zi = numeric.rep([n+1],0), Zj = [], Zv = [];
var x = numeric.rep([m],0),y = numeric.rep([m],0);
var xk,yk,zk;
var i,j,j0,j1,k,p=0;
` + a + `for(i=0;i<n;++i) {
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
  })(), numeric.ccsScatter = function D(s) {
    var a = s[0], n = s[1], f = s[2], t = numeric.sup(n) + 1, r = a.length, i = numeric.rep([t], 0), c = Array(r), u = Array(r), o = numeric.rep([t], 0), h;
    for (h = 0; h < r; ++h) o[n[h]]++;
    for (h = 0; h < t; ++h) i[h + 1] = i[h] + o[h];
    var S = i.slice(0), m, d;
    for (h = 0; h < r; ++h)
      d = n[h], m = S[d], c[m] = a[h], u[m] = f[h], S[d] = S[d] + 1;
    return [i, c, u];
  }, numeric.ccsGather = function D(s) {
    var a = s[0], n = s[1], f = s[2], t = a.length - 1, r = n.length, i = Array(r), c = Array(r), u = Array(r), o, h, S, m, d;
    for (d = 0, o = 0; o < t; ++o)
      for (S = a[o], m = a[o + 1], h = S; h !== m; ++h)
        c[d] = o, i[d] = n[h], u[d] = f[h], ++d;
    return [i, c, u];
  }, numeric.sdim = function D(s, a, n) {
    if (typeof a > "u" && (a = []), typeof s != "object") return a;
    typeof n > "u" && (n = 0), n in a || (a[n] = 0), s.length > a[n] && (a[n] = s.length);
    var f;
    for (f in s)
      s.hasOwnProperty(f) && D(s[f], a, n + 1);
    return a;
  }, numeric.sclone = function D(s, a, n) {
    typeof a > "u" && (a = 0), typeof n > "u" && (n = numeric.sdim(s).length);
    var f, t = Array(s.length);
    if (a === n - 1) {
      for (f in s)
        s.hasOwnProperty(f) && (t[f] = s[f]);
      return t;
    }
    for (f in s)
      s.hasOwnProperty(f) && (t[f] = D(s[f], a + 1, n));
    return t;
  }, numeric.sdiag = function D(s) {
    var a = s.length, n, f = Array(a), t;
    for (n = a - 1; n >= 1; n -= 2)
      t = n - 1, f[n] = [], f[n][n] = s[n], f[t] = [], f[t][t] = s[t];
    return n === 0 && (f[0] = [], f[0][0] = s[n]), f;
  }, numeric.sidentity = function D(s) {
    return numeric.sdiag(numeric.rep([s], 1));
  }, numeric.stranspose = function D(s) {
    var a = [];
    s.length;
    var n, f, t;
    for (n in s)
      if (s.hasOwnProperty(n)) {
        t = s[n];
        for (f in t)
          t.hasOwnProperty(f) && (typeof a[f] != "object" && (a[f] = []), a[f][n] = t[f]);
      }
    return a;
  }, numeric.sLUP = function D(s, a) {
    throw new Error("The function numeric.sLUP had a bug in it and has been removed. Please use the new numeric.ccsLUP function instead.");
  }, numeric.sdotMM = function D(s, a) {
    var n = s.length;
    a.length;
    var f = numeric.stranspose(a), t = f.length, r, i, c, u, o, h, S = Array(n), m;
    for (c = n - 1; c >= 0; c--) {
      for (m = [], r = s[c], o = t - 1; o >= 0; o--) {
        h = 0, i = f[o];
        for (u in r)
          r.hasOwnProperty(u) && u in i && (h += r[u] * i[u]);
        h && (m[o] = h);
      }
      S[c] = m;
    }
    return S;
  }, numeric.sdotMV = function D(s, a) {
    var n = s.length, f, t, r, i = Array(n), c;
    for (t = n - 1; t >= 0; t--) {
      f = s[t], c = 0;
      for (r in f)
        f.hasOwnProperty(r) && a[r] && (c += f[r] * a[r]);
      c && (i[t] = c);
    }
    return i;
  }, numeric.sdotVM = function D(s, a) {
    var n, f, t, r, i = [];
    for (n in s)
      if (s.hasOwnProperty(n)) {
        t = a[n], r = s[n];
        for (f in t)
          t.hasOwnProperty(f) && (i[f] || (i[f] = 0), i[f] += r * t[f]);
      }
    return i;
  }, numeric.sdotVV = function D(s, a) {
    var n, f = 0;
    for (n in s)
      s[n] && a[n] && (f += s[n] * a[n]);
    return f;
  }, numeric.sdot = function D(s, a) {
    var n = numeric.sdim(s).length, f = numeric.sdim(a).length, t = n * 1e3 + f;
    switch (t) {
      case 0:
        return s * a;
      case 1001:
        return numeric.sdotVV(s, a);
      case 2001:
        return numeric.sdotMV(s, a);
      case 1002:
        return numeric.sdotVM(s, a);
      case 2002:
        return numeric.sdotMM(s, a);
      default:
        throw new Error("numeric.sdot not implemented for tensors of order " + n + " and " + f);
    }
  }, numeric.sscatter = function D(s) {
    var a = s[0].length, n, f, t, r = s.length, i = [], c;
    for (f = a - 1; f >= 0; --f)
      if (s[r - 1][f]) {
        for (c = i, t = 0; t < r - 2; t++)
          n = s[t][f], c[n] || (c[n] = []), c = c[n];
        c[s[t][f]] = s[t + 1][f];
      }
    return i;
  }, numeric.sgather = function D(s, a, n) {
    typeof a > "u" && (a = []), typeof n > "u" && (n = []);
    var f, t, r;
    f = n.length;
    for (t in s)
      if (s.hasOwnProperty(t))
        if (n[f] = parseInt(t), r = s[t], typeof r == "number") {
          if (r) {
            if (a.length === 0)
              for (t = f + 1; t >= 0; --t) a[t] = [];
            for (t = f; t >= 0; --t) a[t].push(n[t]);
            a[f + 1].push(r);
          }
        } else D(r, a, n);
    return n.length > f && n.pop(), a;
  }, numeric.cLU = function D(s) {
    var a = s[0], n = s[1], f = s[2], w = a.length, t = 0, r, i, c, u, o, h;
    for (r = 0; r < w; r++) a[r] > t && (t = a[r]);
    t++;
    var S = Array(t), m = Array(t), d = numeric.rep([t], 1 / 0), g = numeric.rep([t], -1 / 0), y, v, P;
    for (c = 0; c < w; c++)
      r = a[c], i = n[c], i < d[r] && (d[r] = i), i > g[r] && (g[r] = i);
    for (r = 0; r < t - 1; r++)
      g[r] > g[r + 1] && (g[r + 1] = g[r]);
    for (r = t - 1; r >= 1; r--)
      d[r] < d[r - 1] && (d[r - 1] = d[r]);
    var E = 0, z = 0;
    for (r = 0; r < t; r++)
      m[r] = numeric.rep([g[r] - d[r] + 1], 0), S[r] = numeric.rep([r - d[r]], 0), E += r - d[r] + 1, z += g[r] - r + 1;
    for (c = 0; c < w; c++)
      r = a[c], m[r][n[c] - d[r]] = f[c];
    for (r = 0; r < t - 1; r++)
      for (u = r - d[r], y = m[r], i = r + 1; d[i] <= r && i < t; i++)
        if (o = r - d[i], h = g[r] - r, v = m[i], P = v[o] / y[u], P) {
          for (c = 1; c <= h; c++)
            v[c + o] -= P * y[c + u];
          S[i][r - d[i]] = P;
        }
    var y = [], v = [], R = [], L = [], I = [], l = [], w, O, j;
    for (w = 0, O = 0, r = 0; r < t; r++) {
      for (u = d[r], o = g[r], j = m[r], i = r; i <= o; i++)
        j[i - u] && (y[w] = r, v[w] = i, R[w] = j[i - u], w++);
      for (j = S[r], i = u; i < r; i++)
        j[i - u] && (L[O] = r, I[O] = i, l[O] = j[i - u], O++);
      L[O] = r, I[O] = r, l[O] = 1, O++;
    }
    return { U: [y, v, R], L: [L, I, l] };
  }, numeric.cLUsolve = function D(s, a) {
    var n = s.L, f = s.U, t = numeric.clone(a), r = n[0], i = n[1], c = n[2], u = f[0], o = f[1], h = f[2], S = u.length;
    r.length;
    var m = t.length, d, g;
    for (g = 0, d = 0; d < m; d++) {
      for (; i[g] < d; )
        t[d] -= c[g] * t[i[g]], g++;
      g++;
    }
    for (g = S - 1, d = m - 1; d >= 0; d--) {
      for (; o[g] > d; )
        t[d] -= h[g] * t[o[g]], g--;
      t[d] /= h[g], g--;
    }
    return t;
  }, numeric.cgrid = function D(s, a) {
    typeof s == "number" && (s = [s, s]);
    var n = numeric.rep(s, -1), f, t, r;
    if (typeof a != "function")
      switch (a) {
        case "L":
          a = function(i, c) {
            return i >= s[0] / 2 || c < s[1] / 2;
          };
          break;
        default:
          a = function(i, c) {
            return !0;
          };
          break;
      }
    for (r = 0, f = 1; f < s[0] - 1; f++) for (t = 1; t < s[1] - 1; t++)
      a(f, t) && (n[f][t] = r, r++);
    return n;
  }, numeric.cdelsq = function D(s) {
    var a = [[-1, 0], [0, -1], [0, 1], [1, 0]], n = numeric.dim(s), f = n[0], t = n[1], r, i, c, u, o, h = [], S = [], m = [];
    for (r = 1; r < f - 1; r++) for (i = 1; i < t - 1; i++)
      if (!(s[r][i] < 0)) {
        for (c = 0; c < 4; c++)
          u = r + a[c][0], o = i + a[c][1], !(s[u][o] < 0) && (h.push(s[r][i]), S.push(s[u][o]), m.push(-1));
        h.push(s[r][i]), S.push(s[r][i]), m.push(4);
      }
    return [h, S, m];
  }, numeric.cdotMV = function D(s, a) {
    var n, f = s[0], t = s[1], r = s[2], i, c = f.length, u;
    for (u = 0, i = 0; i < c; i++)
      f[i] > u && (u = f[i]);
    for (u++, n = numeric.rep([u], 0), i = 0; i < c; i++)
      n[f[i]] += r[i] * a[t[i]];
    return n;
  }, numeric.Spline = function D(s, a, n, f, t) {
    this.x = s, this.yl = a, this.yr = n, this.kl = f, this.kr = t;
  }, numeric.Spline.prototype._at = function D(c, a) {
    var n = this.x, f = this.yl, t = this.yr, r = this.kl, i = this.kr, c, u, o, h, S = numeric.add, m = numeric.sub, d = numeric.mul;
    u = m(d(r[a], n[a + 1] - n[a]), m(t[a + 1], f[a])), o = S(d(i[a + 1], n[a] - n[a + 1]), m(t[a + 1], f[a])), h = (c - n[a]) / (n[a + 1] - n[a]);
    var g = h * (1 - h);
    return S(S(S(d(1 - h, f[a]), d(h, t[a + 1])), d(u, g * (1 - h))), d(o, g * h));
  }, numeric.Spline.prototype.at = function D(s) {
    if (typeof s == "number") {
      var a = this.x, i = a.length, n, f, t, r = Math.floor;
      for (n = 0, f = i - 1; f - n > 1; )
        t = r((n + f) / 2), a[t] <= s ? n = t : f = t;
      return this._at(s, n);
    }
    var i = s.length, c, u = Array(i);
    for (c = i - 1; c !== -1; --c) u[c] = this.at(s[c]);
    return u;
  }, numeric.Spline.prototype.diff = function D() {
    var s = this.x, a = this.yl, n = this.yr, f = this.kl, t = this.kr, r = a.length, i, c, u, o = f, h = t, S = Array(r), m = Array(r), d = numeric.add, g = numeric.mul, P = numeric.div, E = numeric.sub;
    for (i = r - 1; i !== -1; --i)
      c = s[i + 1] - s[i], u = E(n[i + 1], a[i]), S[i] = P(d(g(u, 6), g(f[i], -4 * c), g(t[i + 1], -2 * c)), c * c), m[i + 1] = P(d(g(u, -6), g(f[i], 2 * c), g(t[i + 1], 4 * c)), c * c);
    return new numeric.Spline(s, o, h, S, m);
  }, numeric.Spline.prototype.roots = function D() {
    function s(_) {
      return _ * _;
    }
    var P = [], a = this.x, n = this.yl, f = this.yr, t = this.kl, r = this.kr;
    typeof n[0] == "number" && (n = [n], f = [f], t = [t], r = [r]);
    var i = n.length, c = a.length - 1, u, o, h, S, m, d, g, P = Array(i), E, z, y, v, R, L, I, l, w, O, j, Y, W, er, mr, Mr, dr = Math.sqrt;
    for (u = 0; u !== i; ++u) {
      for (S = n[u], m = f[u], d = t[u], g = r[u], E = [], o = 0; o !== c; o++) {
        for (o > 0 && m[o] * S[o] < 0 && E.push(a[o]), w = a[o + 1] - a[o], a[o], v = S[o], R = m[o + 1], z = d[o] / w, y = g[o + 1] / w, l = s(z - y + 3 * (v - R)) + 12 * y * v, L = y + 3 * v + 2 * z - 3 * R, I = 3 * (y + z + 2 * (v - R)), l <= 0 ? (j = L / I, j > a[o] && j < a[o + 1] ? O = [a[o], j, a[o + 1]] : O = [a[o], a[o + 1]]) : (j = (L - dr(l)) / I, Y = (L + dr(l)) / I, O = [a[o]], j > a[o] && j < a[o + 1] && O.push(j), Y > a[o] && Y < a[o + 1] && O.push(Y), O.push(a[o + 1])), er = O[0], j = this._at(er, o), h = 0; h < O.length - 1; h++) {
          if (mr = O[h + 1], Y = this._at(mr, o), j === 0) {
            E.push(er), er = mr, j = Y;
            continue;
          }
          if (Y === 0 || j * Y > 0) {
            er = mr, j = Y;
            continue;
          }
          for (var U = 0; Mr = (j * mr - Y * er) / (j - Y), !(Mr <= er || Mr >= mr); )
            if (W = this._at(Mr, o), W * Y > 0)
              mr = Mr, Y = W, U === -1 && (j *= 0.5), U = -1;
            else if (W * j > 0)
              er = Mr, j = W, U === 1 && (Y *= 0.5), U = 1;
            else break;
          E.push(Mr), er = O[h + 1], j = this._at(er, o);
        }
        Y === 0 && E.push(mr);
      }
      P[u] = E;
    }
    return typeof this.yl[0] == "number" ? P[0] : P;
  }, numeric.spline = function D(s, a, n, f) {
    var t = s.length, r = [], i = [], c = [], u, o = numeric.sub, h = numeric.mul, S = numeric.add;
    for (u = t - 2; u >= 0; u--)
      i[u] = s[u + 1] - s[u], c[u] = o(a[u + 1], a[u]);
    (typeof n == "string" || typeof f == "string") && (n = f = "periodic");
    var m = [[], [], []];
    switch (typeof n) {
      case "undefined":
        r[0] = h(3 / (i[0] * i[0]), c[0]), m[0].push(0, 0), m[1].push(0, 1), m[2].push(2 / i[0], 1 / i[0]);
        break;
      case "string":
        r[0] = S(h(3 / (i[t - 2] * i[t - 2]), c[t - 2]), h(3 / (i[0] * i[0]), c[0])), m[0].push(0, 0, 0), m[1].push(t - 2, 0, 1), m[2].push(1 / i[t - 2], 2 / i[t - 2] + 2 / i[0], 1 / i[0]);
        break;
      default:
        r[0] = n, m[0].push(0), m[1].push(0), m[2].push(1);
        break;
    }
    for (u = 1; u < t - 1; u++)
      r[u] = S(h(3 / (i[u - 1] * i[u - 1]), c[u - 1]), h(3 / (i[u] * i[u]), c[u])), m[0].push(u, u, u), m[1].push(u - 1, u, u + 1), m[2].push(1 / i[u - 1], 2 / i[u - 1] + 2 / i[u], 1 / i[u]);
    switch (typeof f) {
      case "undefined":
        r[t - 1] = h(3 / (i[t - 2] * i[t - 2]), c[t - 2]), m[0].push(t - 1, t - 1), m[1].push(t - 2, t - 1), m[2].push(1 / i[t - 2], 2 / i[t - 2]);
        break;
      case "string":
        m[1][m[1].length - 1] = 0;
        break;
      default:
        r[t - 1] = f, m[0].push(t - 1), m[1].push(t - 1), m[2].push(1);
        break;
    }
    typeof r[0] != "number" ? r = numeric.transpose(r) : r = [r];
    var d = Array(r.length);
    if (typeof n == "string")
      for (u = d.length - 1; u !== -1; --u)
        d[u] = numeric.ccsLUPSolve(numeric.ccsLUP(numeric.ccsScatter(m)), r[u]), d[u][t - 1] = d[u][0];
    else
      for (u = d.length - 1; u !== -1; --u)
        d[u] = numeric.cLUsolve(numeric.cLU(m), r[u]);
    return typeof a[0] == "number" ? d = d[0] : d = numeric.transpose(d), new numeric.Spline(s, a, a, d, d);
  }, numeric.fftpow2 = function D(s, a) {
    var n = s.length;
    if (n !== 1) {
      var f = Math.cos, t = Math.sin, r, i, c = Array(n / 2), u = Array(n / 2), o = Array(n / 2), h = Array(n / 2);
      for (i = n / 2, r = n - 1; r !== -1; --r)
        --i, o[i] = s[r], h[i] = a[r], --r, c[i] = s[r], u[i] = a[r];
      D(c, u), D(o, h), i = n / 2;
      var S, m = -6.283185307179586 / n, d, g;
      for (r = n - 1; r !== -1; --r)
        --i, i === -1 && (i = n / 2 - 1), S = m * r, d = f(S), g = t(S), s[r] = c[i] + d * o[i] - g * h[i], a[r] = u[i] + d * h[i] + g * o[i];
    }
  }, numeric._ifftpow2 = function D(s, a) {
    var n = s.length;
    if (n !== 1) {
      var f = Math.cos, t = Math.sin, r, i, c = Array(n / 2), u = Array(n / 2), o = Array(n / 2), h = Array(n / 2);
      for (i = n / 2, r = n - 1; r !== -1; --r)
        --i, o[i] = s[r], h[i] = a[r], --r, c[i] = s[r], u[i] = a[r];
      D(c, u), D(o, h), i = n / 2;
      var S, m = 6.283185307179586 / n, d, g;
      for (r = n - 1; r !== -1; --r)
        --i, i === -1 && (i = n / 2 - 1), S = m * r, d = f(S), g = t(S), s[r] = c[i] + d * o[i] - g * h[i], a[r] = u[i] + d * h[i] + g * o[i];
    }
  }, numeric.ifftpow2 = function D(s, a) {
    numeric._ifftpow2(s, a), numeric.diveq(s, s.length), numeric.diveq(a, a.length);
  }, numeric.convpow2 = function D(s, a, n, f) {
    numeric.fftpow2(s, a), numeric.fftpow2(n, f);
    var t, r = s.length, i, c, u, o;
    for (t = r - 1; t !== -1; --t)
      i = s[t], u = a[t], c = n[t], o = f[t], s[t] = i * c - u * o, a[t] = i * o + u * c;
    numeric.ifftpow2(s, a);
  }, numeric.T.prototype.fft = function D() {
    var s = this.x, a = this.y, n = s.length, f = Math.log, t = f(2), r = Math.ceil(f(2 * n - 1) / t), i = Math.pow(2, r), c = numeric.rep([i], 0), u = numeric.rep([i], 0), o = Math.cos, h = Math.sin, S, m = -3.141592653589793 / n, d, g = numeric.rep([i], 0), P = numeric.rep([i], 0);
    for (S = 0; S < n; S++) g[S] = s[S];
    if (typeof a < "u") for (S = 0; S < n; S++) P[S] = a[S];
    for (c[0] = 1, S = 1; S <= i / 2; S++)
      d = m * S * S, c[S] = o(d), u[S] = h(d), c[i - S] = o(d), u[i - S] = h(d);
    var E = new numeric.T(g, P), z = new numeric.T(c, u);
    return E = E.mul(z), numeric.convpow2(E.x, E.y, numeric.clone(z.x), numeric.neg(z.y)), E = E.mul(z), E.x.length = n, E.y.length = n, E;
  }, numeric.T.prototype.ifft = function D() {
    var s = this.x, a = this.y, n = s.length, f = Math.log, t = f(2), r = Math.ceil(f(2 * n - 1) / t), i = Math.pow(2, r), c = numeric.rep([i], 0), u = numeric.rep([i], 0), o = Math.cos, h = Math.sin, S, m = 3.141592653589793 / n, d, g = numeric.rep([i], 0), P = numeric.rep([i], 0);
    for (S = 0; S < n; S++) g[S] = s[S];
    if (typeof a < "u") for (S = 0; S < n; S++) P[S] = a[S];
    for (c[0] = 1, S = 1; S <= i / 2; S++)
      d = m * S * S, c[S] = o(d), u[S] = h(d), c[i - S] = o(d), u[i - S] = h(d);
    var E = new numeric.T(g, P), z = new numeric.T(c, u);
    return E = E.mul(z), numeric.convpow2(E.x, E.y, numeric.clone(z.x), numeric.neg(z.y)), E = E.mul(z), E.x.length = n, E.y.length = n, E.div(n);
  }, numeric.gradient = function D(s, a) {
    var n = a.length, f = s(a);
    if (isNaN(f)) throw new Error("gradient: f(x) is a NaN!");
    var h = Math.max, t, r = numeric.clone(a), i, c, u = Array(n);
    numeric.div, numeric.sub;
    var o, h = Math.max, S = 1e-3, m = Math.abs, d = Math.min, g, P, E, z = 0, y, v, R;
    for (t = 0; t < n; t++)
      for (var L = h(1e-6 * f, 1e-8); ; ) {
        if (++z, z > 20)
          throw new Error("Numerical gradient fails");
        if (r[t] = a[t] + L, i = s(r), r[t] = a[t] - L, c = s(r), r[t] = a[t], isNaN(i) || isNaN(c)) {
          L /= 16;
          continue;
        }
        if (u[t] = (i - c) / (2 * L), g = a[t] - L, P = a[t], E = a[t] + L, y = (i - f) / L, v = (f - c) / L, R = h(m(u[t]), m(f), m(i), m(c), m(g), m(P), m(E), 1e-8), o = d(h(m(y - u[t]), m(v - u[t]), m(y - v)) / R, L / R), o > S)
          L /= 16;
        else break;
      }
    return u;
  }, numeric.uncmin = function D(s, a, n, f, t, r, i) {
    var c = numeric.gradient;
    typeof i > "u" && (i = {}), typeof n > "u" && (n = 1e-8), typeof f > "u" && (f = function($) {
      return c(s, $);
    }), typeof t > "u" && (t = 1e3), a = numeric.clone(a);
    var u = a.length, o = s(a), h, S;
    if (isNaN(o)) throw new Error("uncmin: f(x0) is a NaN!");
    var m = Math.max, d = numeric.norm2;
    n = m(n, numeric.epsilon);
    var g, P, E, z = i.Hinv || numeric.identity(u), y = numeric.dot;
    numeric.inv;
    var v = numeric.sub, R = numeric.add, L = numeric.tensor, I = numeric.div, l = numeric.mul, w = numeric.all, O = numeric.isFinite, j = numeric.neg, Y = 0, W, er, mr, Mr, dr, U, _, F = "";
    for (P = f(a); Y < t; ) {
      if (typeof r == "function" && r(Y, a, o, P, z)) {
        F = "Callback returned true";
        break;
      }
      if (!w(O(P))) {
        F = "Gradient has Infinity or NaN";
        break;
      }
      if (g = j(y(z, P)), !w(O(g))) {
        F = "Search direction has Infinity or NaN";
        break;
      }
      if (_ = d(g), _ < n) {
        F = "Newton step smaller than tol";
        break;
      }
      for (U = 1, S = y(P, g), er = a; Y < t && !(U * _ < n); ) {
        if (W = l(g, U), er = R(a, W), h = s(er), h - o >= 0.1 * U * S || isNaN(h)) {
          U *= 0.5, ++Y;
          continue;
        }
        break;
      }
      if (U * _ < n) {
        F = "Line search step size smaller than tol";
        break;
      }
      if (Y === t) {
        F = "maxit reached during line search";
        break;
      }
      E = f(er), mr = v(E, P), dr = y(mr, W), Mr = y(z, mr), z = v(
        R(
          z,
          l(
            (dr + y(mr, Mr)) / (dr * dr),
            L(W, W)
          )
        ),
        I(R(L(Mr, W), L(W, Mr)), dr)
      ), a = er, o = h, P = E, ++Y;
    }
    return { solution: a, f: o, gradient: P, invHessian: z, iterations: Y, message: F };
  }, numeric.Dopri = function D(s, a, n, f, t, r, i) {
    this.x = s, this.y = a, this.f = n, this.ymid = f, this.iterations = t, this.events = i, this.message = r;
  }, numeric.Dopri.prototype._at = function D(g, a) {
    function n(l) {
      return l * l;
    }
    var f = this, t = f.x, r = f.y, i = f.f, c = f.ymid;
    t.length;
    var u, o, h, S, m, d, g, P, E = 0.5, z = numeric.add, y = numeric.mul, v = numeric.sub, R, L, I;
    return u = t[a], o = t[a + 1], S = r[a], m = r[a + 1], P = o - u, h = u + E * P, d = c[a], R = v(i[a], y(S, 1 / (u - h) + 2 / (u - o))), L = v(i[a + 1], y(m, 1 / (o - h) + 2 / (o - u))), I = [
      n(g - o) * (g - h) / n(u - o) / (u - h),
      n(g - u) * n(g - o) / n(u - h) / n(o - h),
      n(g - u) * (g - h) / n(o - u) / (o - h),
      (g - u) * n(g - o) * (g - h) / n(u - o) / (u - h),
      (g - o) * n(g - u) * (g - h) / n(u - o) / (o - h)
    ], z(
      z(
        z(
          z(
            y(S, I[0]),
            y(d, I[1])
          ),
          y(m, I[2])
        ),
        y(R, I[3])
      ),
      y(L, I[4])
    );
  }, numeric.Dopri.prototype.at = function D(s) {
    var a, n, f, t = Math.floor;
    if (typeof s != "number") {
      var r = s.length, i = Array(r);
      for (a = r - 1; a !== -1; --a)
        i[a] = this.at(s[a]);
      return i;
    }
    var c = this.x;
    for (a = 0, n = c.length - 1; n - a > 1; )
      f = t(0.5 * (a + n)), c[f] <= s ? a = f : n = f;
    return this._at(s, a);
  }, numeric.dopri = function D(s, a, n, f, t, r, i) {
    typeof t > "u" && (t = 1e-6), typeof r > "u" && (r = 1e3);
    var c = [s], u = [n], o = [f(s, n)], h, S, m, d, g, P, E = [], z = 1 / 5, y = [3 / 40, 9 / 40], v = [44 / 45, -56 / 15, 32 / 9], R = [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729], L = [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656], I = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84], l = [
      0.5 * 6025192743 / 30085553152,
      0,
      0.5 * 51252292925 / 65400821598,
      0.5 * -2691868925 / 45128329728,
      0.5 * 187940372067 / 1594534317056,
      0.5 * -1776094331 / 19743644256,
      0.5 * 11237099 / 235043384
    ], w = [1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1], O = [-71 / 57600, 0, 71 / 16695, -71 / 1920, 17253 / 339200, -22 / 525, 1 / 40], j = 0, Y, W, er = (a - s) / 10, mr = 0, Mr = numeric.add, dr = numeric.mul, U, _, F = Math.min, $ = Math.abs, rr = numeric.norminf, ir = Math.pow, vr = numeric.any, b = numeric.lt, M = numeric.and;
    numeric.sub;
    var q, Z, V, Q = new numeric.Dopri(c, u, o, E, -1, "");
    for (typeof i == "function" && (q = i(s, n)); s < a && mr < r; ) {
      if (++mr, s + er > a && (er = a - s), h = f(s + w[0] * er, Mr(n, dr(z * er, o[j]))), S = f(s + w[1] * er, Mr(Mr(n, dr(y[0] * er, o[j])), dr(y[1] * er, h))), m = f(s + w[2] * er, Mr(Mr(Mr(n, dr(v[0] * er, o[j])), dr(v[1] * er, h)), dr(v[2] * er, S))), d = f(s + w[3] * er, Mr(Mr(Mr(Mr(n, dr(R[0] * er, o[j])), dr(R[1] * er, h)), dr(R[2] * er, S)), dr(R[3] * er, m))), g = f(s + w[4] * er, Mr(Mr(Mr(Mr(Mr(n, dr(L[0] * er, o[j])), dr(L[1] * er, h)), dr(L[2] * er, S)), dr(L[3] * er, m)), dr(L[4] * er, d))), U = Mr(Mr(Mr(Mr(Mr(n, dr(o[j], er * I[0])), dr(S, er * I[2])), dr(m, er * I[3])), dr(d, er * I[4])), dr(g, er * I[5])), P = f(s + er, U), Y = Mr(Mr(Mr(Mr(Mr(dr(o[j], er * O[0]), dr(S, er * O[2])), dr(m, er * O[3])), dr(d, er * O[4])), dr(g, er * O[5])), dr(P, er * O[6])), typeof Y == "number" ? _ = $(Y) : _ = rr(Y), _ > t) {
        if (er = 0.2 * er * ir(t / _, 0.25), s + er === s) {
          Q.msg = "Step size became too small";
          break;
        }
        continue;
      }
      if (E[j] = Mr(
        Mr(
          Mr(
            Mr(
              Mr(
                Mr(
                  n,
                  dr(o[j], er * l[0])
                ),
                dr(S, er * l[2])
              ),
              dr(m, er * l[3])
            ),
            dr(d, er * l[4])
          ),
          dr(g, er * l[5])
        ),
        dr(P, er * l[6])
      ), ++j, c[j] = s + er, u[j] = U, o[j] = P, typeof i == "function") {
        var K, fr = s, or = s + 0.5 * er, N;
        if (Z = i(or, E[j - 1]), V = M(b(q, 0), b(0, Z)), vr(V) || (fr = or, or = s + er, q = Z, Z = i(or, U), V = M(b(q, 0), b(0, Z))), vr(V)) {
          for (var H, J, ar = 0, cr = 1, e = 1; ; ) {
            if (typeof q == "number") N = (e * Z * fr - cr * q * or) / (e * Z - cr * q);
            else
              for (N = or, W = q.length - 1; W !== -1; --W)
                q[W] < 0 && Z[W] > 0 && (N = F(N, (e * Z[W] * fr - cr * q[W] * or) / (e * Z[W] - cr * q[W])));
            if (N <= fr || N >= or) break;
            K = Q._at(N, j - 1), J = i(N, K), H = M(b(q, 0), b(0, J)), vr(H) ? (or = N, Z = J, V = H, e = 1, ar === -1 ? cr *= 0.5 : cr = 1, ar = -1) : (fr = N, q = J, cr = 1, ar === 1 ? e *= 0.5 : e = 1, ar = 1);
          }
          return U = Q._at(0.5 * (s + N), j - 1), Q.f[j] = f(N, K), Q.x[j] = N, Q.y[j] = K, Q.ymid[j - 1] = U, Q.events = V, Q.iterations = mr, Q;
        }
      }
      s += er, n = U, q = Z, er = F(0.8 * er * ir(t / _, 0.25), 4 * er);
    }
    return Q.iterations = mr, Q;
  }, numeric.LU = function(D, s) {
    s = s || !1;
    var a = Math.abs, n, f, t, r, i, c, u, o, h, S = D.length, m = S - 1, d = new Array(S);
    for (s || (D = numeric.clone(D)), t = 0; t < S; ++t) {
      for (u = t, c = D[t], h = a(c[t]), f = t + 1; f < S; ++f)
        r = a(D[f][t]), h < r && (h = r, u = f);
      for (d[t] = u, u != t && (D[t] = D[u], D[u] = c, c = D[t]), i = c[t], n = t + 1; n < S; ++n)
        D[n][t] /= i;
      for (n = t + 1; n < S; ++n) {
        for (o = D[n], f = t + 1; f < m; ++f)
          o[f] -= o[t] * c[f], ++f, o[f] -= o[t] * c[f];
        f === m && (o[f] -= o[t] * c[f]);
      }
    }
    return {
      LU: D,
      P: d
    };
  }, numeric.LUsolve = function D(s, a) {
    var n, f, t = s.LU, r = t.length, i = numeric.clone(a), c = s.P, u, o, h;
    for (n = r - 1; n !== -1; --n) i[n] = a[n];
    for (n = 0; n < r; ++n)
      for (u = c[n], c[n] !== n && (h = i[n], i[n] = i[u], i[u] = h), o = t[n], f = 0; f < n; ++f)
        i[n] -= i[f] * o[f];
    for (n = r - 1; n >= 0; --n) {
      for (o = t[n], f = n + 1; f < r; ++f)
        i[n] -= i[f] * o[f];
      i[n] /= o[n];
    }
    return i;
  }, numeric.solve = function D(s, a, n) {
    return numeric.LUsolve(numeric.LU(s, n), a);
  }, numeric.echelonize = function D(s) {
    var a = numeric.dim(s), n = a[0], f = a[1], t = numeric.identity(n), r = Array(n), i, c, u, o, h, S, m, d, g = Math.abs, P = numeric.diveq;
    for (s = numeric.clone(s), i = 0; i < n; ++i) {
      for (u = 0, h = s[i], S = t[i], c = 1; c < f; ++c) g(h[u]) < g(h[c]) && (u = c);
      for (r[i] = u, P(S, h[u]), P(h, h[u]), c = 0; c < n; ++c) if (c !== i) {
        for (m = s[c], d = m[u], o = f - 1; o !== -1; --o) m[o] -= h[o] * d;
        for (m = t[c], o = n - 1; o !== -1; --o) m[o] -= S[o] * d;
      }
    }
    return { I: t, A: s, P: r };
  }, numeric.__solveLP = function D(s, a, n, f, t, r, i) {
    var c = numeric.sum;
    numeric.log;
    var u = numeric.mul, o = numeric.sub, h = numeric.dot, S = numeric.div, m = numeric.add, d = s.length, g = n.length, P, E = !1, z = 0, y = 1;
    numeric.transpose(a), numeric.svd;
    var v = numeric.transpose;
    numeric.leq;
    var R = Math.sqrt, L = Math.abs;
    numeric.muleq, numeric.norminf, numeric.any;
    var I = Math.min, l = numeric.all, w = numeric.gt, O = Array(d), j = Array(g);
    numeric.rep([g], 1);
    var Y, W = numeric.solve, er = o(n, h(a, r)), mr, Mr = h(s, s), dr;
    for (mr = z; mr < t; ++mr) {
      var U, _;
      for (U = g - 1; U !== -1; --U) j[U] = S(a[U], er[U]);
      var F = v(j);
      for (U = d - 1; U !== -1; --U) O[U] = /*x[i]+*/
      c(F[U]);
      y = 0.25 * L(Mr / h(s, O));
      var $ = 100 * R(Mr / h(O, O));
      for ((!isFinite(y) || y > $) && (y = $), dr = m(s, u(y, O)), Y = h(F, j), U = d - 1; U !== -1; --U) Y[U][U] += 1;
      _ = W(Y, S(dr, y), !0);
      var rr = S(er, h(a, _)), ir = 1;
      for (U = g - 1; U !== -1; --U) rr[U] < 0 && (ir = I(ir, -0.999 * rr[U]));
      if (P = o(r, u(_, ir)), er = o(n, h(a, P)), !l(w(er, 0))) return { solution: r, message: "", iterations: mr };
      if (r = P, y < f) return { solution: P, message: "", iterations: mr };
      if (i) {
        var vr = h(s, dr), b = h(a, dr);
        for (E = !0, U = g - 1; U !== -1; --U) if (vr * b[U] < 0) {
          E = !1;
          break;
        }
      } else
        r[d - 1] >= 0 ? E = !1 : E = !0;
      if (E) return { solution: P, message: "Unbounded", iterations: mr };
    }
    return { solution: r, message: "maximum iteration count exceeded", iterations: mr };
  }, numeric._solveLP = function D(s, a, n, f, t) {
    var r = s.length, i = n.length, d;
    numeric.sum, numeric.log, numeric.mul;
    var c = numeric.sub, u = numeric.dot;
    numeric.div, numeric.add;
    var o = numeric.rep([r], 0).concat([1]), h = numeric.rep([i, 1], -1), S = numeric.blockMatrix([[a, h]]), m = n, d = numeric.rep([r], 0).concat(Math.max(0, numeric.sup(numeric.neg(n))) + 1), g = numeric.__solveLP(o, S, m, f, t, d, !1), P = numeric.clone(g.solution);
    P.length = r;
    var E = numeric.inf(c(n, u(a, P)));
    if (E < 0)
      return { solution: NaN, message: "Infeasible", iterations: g.iterations };
    var z = numeric.__solveLP(s, a, n, f, t - g.iterations, P, !0);
    return z.iterations += g.iterations, z;
  }, numeric.solveLP = function D(s, a, n, f, t, r, i) {
    if (typeof i > "u" && (i = 1e3), typeof r > "u" && (r = numeric.epsilon), typeof f > "u") return numeric._solveLP(s, a, n, r, i);
    var c = f.length, u = f[0].length, o = a.length, h = numeric.echelonize(f), S = numeric.rep([u], 0), m = h.P, d = [], g;
    for (g = m.length - 1; g !== -1; --g) S[m[g]] = 1;
    for (g = u - 1; g !== -1; --g) S[g] === 0 && d.push(g);
    var P = numeric.getRange, E = numeric.linspace(0, c - 1), z = numeric.linspace(0, o - 1), y = P(f, E, d), v = P(a, z, m), R = P(a, z, d), L = numeric.dot, I = numeric.sub, l = L(v, h.I), w = I(R, L(l, y)), O = I(n, L(l, t)), j = Array(m.length), Y = Array(d.length);
    for (g = m.length - 1; g !== -1; --g) j[g] = s[m[g]];
    for (g = d.length - 1; g !== -1; --g) Y[g] = s[d[g]];
    var W = I(Y, L(j, L(h.I, y))), er = numeric._solveLP(W, w, O, r, i), mr = er.solution;
    if (mr !== mr) return er;
    var Mr = L(h.I, I(t, L(y, mr))), dr = Array(s.length);
    for (g = m.length - 1; g !== -1; --g) dr[m[g]] = Mr[g];
    for (g = d.length - 1; g !== -1; --g) dr[d[g]] = mr[g];
    return { solution: dr, message: er.message, iterations: er.iterations };
  }, numeric.MPStoLP = function D(s) {
    s instanceof String && s.split(`
`);
    var a = 0, n = ["Initial state", "NAME", "ROWS", "COLUMNS", "RHS", "BOUNDS", "ENDATA"], f = s.length, t, r, i, c = 0, u = {}, o = [], h = 0, S = {}, m = 0, d, g = [], P = [], E = [];
    function z(I) {
      throw new Error("MPStoLP: " + I + `
Line ` + t + ": " + s[t] + `
Current state: ` + n[a] + `
`);
    }
    for (t = 0; t < f; ++t) {
      i = s[t];
      var y = i.match(/\S*/g), v = [];
      for (r = 0; r < y.length; ++r) y[r] !== "" && v.push(y[r]);
      if (v.length !== 0) {
        for (r = 0; r < n.length && i.substr(0, n[r].length) !== n[r]; ++r) ;
        if (r < n.length) {
          if (a = r, r === 1 && (d = v[1]), r === 6) return { name: d, c: g, A: numeric.transpose(P), b: E, rows: u, vars: S };
          continue;
        }
        switch (a) {
          case 0:
          case 1:
            z("Unexpected line");
          case 2:
            switch (v[0]) {
              case "N":
                c === 0 ? c = v[1] : z("Two or more N rows");
                break;
              case "L":
                u[v[1]] = h, o[h] = 1, E[h] = 0, ++h;
                break;
              case "G":
                u[v[1]] = h, o[h] = -1, E[h] = 0, ++h;
                break;
              case "E":
                u[v[1]] = h, o[h] = 0, E[h] = 0, ++h;
                break;
              default:
                z("Parse error " + numeric.prettyPrint(v));
            }
            break;
          case 3:
            S.hasOwnProperty(v[0]) || (S[v[0]] = m, g[m] = 0, P[m] = numeric.rep([h], 0), ++m);
            var R = S[v[0]];
            for (r = 1; r < v.length; r += 2) {
              if (v[r] === c) {
                g[R] = parseFloat(v[r + 1]);
                continue;
              }
              var L = u[v[r]];
              P[R][L] = (o[L] < 0 ? -1 : 1) * parseFloat(v[r + 1]);
            }
            break;
          case 4:
            for (r = 1; r < v.length; r += 2) E[u[v[r]]] = (o[u[v[r]]] < 0 ? -1 : 1) * parseFloat(v[r + 1]);
            break;
          case 5:
            break;
          case 6:
            z("Internal error");
        }
      }
    }
    z("Reached end of file without ENDATA");
  }, numeric.seedrandom = { pow: Math.pow, random: Math.random }, (function(D, s, a, n, f, t, r) {
    s.seedrandom = function(S, m) {
      var d = [], g;
      return S = u(c(
        m ? [S, D] : arguments.length ? S : [(/* @__PURE__ */ new Date()).getTime(), D, window],
        3
      ), d), g = new i(d), u(g.S, D), s.random = function() {
        for (var E = g.g(n), z = r, y = 0; E < f; )
          E = (E + y) * a, z *= a, y = g.g(1);
        for (; E >= t; )
          E /= 2, z /= 2, y >>>= 1;
        return (E + y) / z;
      }, S;
    };
    function i(h) {
      var S, m, d = this, g = h.length, P = 0, E = d.i = d.j = d.m = 0;
      for (d.S = [], d.c = [], g || (h = [g++]); P < a; )
        d.S[P] = P++;
      for (P = 0; P < a; P++)
        S = d.S[P], E = o(E + S + h[P % g]), m = d.S[E], d.S[P] = m, d.S[E] = S;
      d.g = function(y) {
        var v = d.S, R = o(d.i + 1), L = v[R], I = o(d.j + L), l = v[I];
        v[R] = l, v[I] = L;
        for (var w = v[o(L + l)]; --y; )
          R = o(R + 1), L = v[R], I = o(I + L), l = v[I], v[R] = l, v[I] = L, w = w * a + v[o(L + l)];
        return d.i = R, d.j = I, w;
      }, d.g(a);
    }
    function c(h, S, m, d, g) {
      if (m = [], g = typeof h, S && g == "object") {
        for (d in h)
          if (d.indexOf("S") < 5)
            try {
              m.push(c(h[d], S - 1));
            } catch {
            }
      }
      return m.length ? m : h + (g != "string" ? "\0" : "");
    }
    function u(h, S, m, d) {
      for (h += "", m = 0, d = 0; d < h.length; d++)
        S[o(d)] = o((m ^= S[o(d)] * 19) + h.charCodeAt(d));
      h = "";
      for (d in S)
        h += String.fromCharCode(S[d]);
      return h;
    }
    function o(h) {
      return h & a - 1;
    }
    r = s.pow(a, n), f = s.pow(2, f), t = f * 2, u(s.random(), D);
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
    function s(c) {
      if (typeof c != "object")
        return c;
      var u = [], o, h = c.length;
      for (o = 0; o < h; o++) u[o + 1] = s(c[o]);
      return u;
    }
    function a(c) {
      if (typeof c != "object")
        return c;
      var u = [], o, h = c.length;
      for (o = 1; o < h; o++) u[o - 1] = a(c[o]);
      return u;
    }
    function n(c, u, o) {
      var h, S, m, d, g;
      for (m = 1; m <= o; m = m + 1) {
        for (c[m][m] = 1 / c[m][m], g = -c[m][m], h = 1; h < m; h = h + 1)
          c[h][m] = g * c[h][m];
        if (d = m + 1, o < d)
          break;
        for (S = d; S <= o; S = S + 1)
          for (g = c[m][S], c[m][S] = 0, h = 1; h <= m; h = h + 1)
            c[h][S] = c[h][S] + g * c[h][m];
      }
    }
    function f(c, u, o, h) {
      var S, m, d, g;
      for (m = 1; m <= o; m = m + 1) {
        for (g = 0, S = 1; S < m; S = S + 1)
          g = g + c[S][m] * h[S];
        h[m] = (h[m] - g) / c[m][m];
      }
      for (d = 1; d <= o; d = d + 1)
        for (m = o + 1 - d, h[m] = h[m] / c[m][m], g = -h[m], S = 1; S < m; S = S + 1)
          h[S] = h[S] + g * c[S][m];
    }
    function t(c, u, o, h) {
      var S, m, d, g, P, E;
      for (m = 1; m <= o; m = m + 1) {
        if (h[1] = m, E = 0, d = m - 1, d < 1) {
          if (E = c[m][m] - E, E <= 0)
            break;
          c[m][m] = Math.sqrt(E);
        } else {
          for (g = 1; g <= d; g = g + 1) {
            for (P = c[g][m], S = 1; S < g; S = S + 1)
              P = P - c[S][m] * c[S][g];
            P = P / c[g][g], c[g][m] = P, E = E + P * P;
          }
          if (E = c[m][m] - E, E <= 0)
            break;
          c[m][m] = Math.sqrt(E);
        }
        h[1] = 0;
      }
    }
    function r(c, u, o, h, S, m, d, g, P, E, z, y, v, R, L, I) {
      var l, w, O, j, Y, W, er, mr, Mr, dr, U, _, F, $, rr, ir, vr, b, M, q, Z, V, Q, K, fr, or, N;
      F = Math.min(h, E), O = 2 * h + F * (F + 5) / 2 + 2 * E + 1, K = 1e-60;
      do
        K = K + K, fr = 1 + 0.1 * K, or = 1 + 0.2 * K;
      while (fr <= 1 || or <= 1);
      for (l = 1; l <= h; l = l + 1)
        L[l] = u[l];
      for (l = h + 1; l <= O; l = l + 1)
        L[l] = 0;
      for (l = 1; l <= E; l = l + 1)
        y[l] = 0;
      if (Y = [], I[1] === 0) {
        if (t(c, o, h, Y), Y[1] !== 0) {
          I[1] = 2;
          return;
        }
        f(c, o, h, u), n(c, o, h);
      } else {
        for (w = 1; w <= h; w = w + 1)
          for (S[w] = 0, l = 1; l <= w; l = l + 1)
            S[w] = S[w] + c[l][w] * u[l];
        for (w = 1; w <= h; w = w + 1)
          for (u[w] = 0, l = w; l <= h; l = l + 1)
            u[w] = u[w] + c[w][l] * S[l];
      }
      for (m[1] = 0, w = 1; w <= h; w = w + 1)
        for (S[w] = u[w], m[1] = m[1] + L[w] * S[w], L[w] = 0, l = w + 1; l <= h; l = l + 1)
          c[l][w] = 0;
      for (m[1] = -m[1] / 2, I[1] = 0, er = h, mr = er + h, U = mr + F, Mr = U + F + 1, dr = Mr + F * (F + 1) / 2, $ = dr + E, l = 1; l <= E; l = l + 1) {
        for (ir = 0, w = 1; w <= h; w = w + 1)
          ir = ir + d[w][l] * d[w][l];
        L[$ + l] = Math.sqrt(ir);
      }
      v = 0, R[1] = 0, R[2] = 0;
      function H() {
        for (R[1] = R[1] + 1, O = dr, l = 1; l <= E; l = l + 1) {
          for (O = O + 1, ir = -g[l], w = 1; w <= h; w = w + 1)
            ir = ir + d[w][l] * S[w];
          if (Math.abs(ir) < K && (ir = 0), l > z)
            L[O] = ir;
          else if (L[O] = -Math.abs(ir), ir > 0) {
            for (w = 1; w <= h; w = w + 1)
              d[w][l] = -d[w][l];
            g[l] = -g[l];
          }
        }
        for (l = 1; l <= v; l = l + 1)
          L[dr + y[l]] = 0;
        for (_ = 0, rr = 0, l = 1; l <= E; l = l + 1)
          L[dr + l] < rr * L[$ + l] && (_ = l, rr = L[dr + l] / L[$ + l]);
        return _ === 0 ? 999 : 0;
      }
      function J() {
        for (l = 1; l <= h; l = l + 1) {
          for (ir = 0, w = 1; w <= h; w = w + 1)
            ir = ir + c[w][l] * d[w][_];
          L[l] = ir;
        }
        for (j = er, l = 1; l <= h; l = l + 1)
          L[j + l] = 0;
        for (w = v + 1; w <= h; w = w + 1)
          for (l = 1; l <= h; l = l + 1)
            L[j + l] = L[j + l] + c[l][w] * L[w];
        for (V = !0, l = v; l >= 1; l = l - 1) {
          for (ir = L[l], O = Mr + l * (l + 3) / 2, j = O - l, w = l + 1; w <= v; w = w + 1)
            ir = ir - L[O] * L[mr + w], O = O + w;
          if (ir = ir / L[j], L[mr + l] = ir, y[l] < z || ir < 0)
            break;
          V = !1, W = l;
        }
        if (!V)
          for (vr = L[U + W] / L[mr + W], l = 1; l <= v && !(y[l] < z || L[mr + l] < 0); l = l + 1)
            rr = L[U + l] / L[mr + l], rr < vr && (vr = rr, W = l);
        for (ir = 0, l = er + 1; l <= er + h; l = l + 1)
          ir = ir + L[l] * L[l];
        if (Math.abs(ir) <= K) {
          if (V)
            return I[1] = 1, 999;
          for (l = 1; l <= v; l = l + 1)
            L[U + l] = L[U + l] - vr * L[mr + l];
          return L[U + v + 1] = L[U + v + 1] + vr, 700;
        } else {
          for (ir = 0, l = 1; l <= h; l = l + 1)
            ir = ir + L[er + l] * d[l][_];
          for (b = -L[dr + _] / ir, Q = !0, V || vr < b && (b = vr, Q = !1), l = 1; l <= h; l = l + 1)
            S[l] = S[l] + b * L[er + l], Math.abs(S[l]) < K && (S[l] = 0);
          for (m[1] = m[1] + b * ir * (b / 2 + L[U + v + 1]), l = 1; l <= v; l = l + 1)
            L[U + l] = L[U + l] - b * L[mr + l];
          if (L[U + v + 1] = L[U + v + 1] + b, Q) {
            for (v = v + 1, y[v] = _, O = Mr + (v - 1) * v / 2 + 1, l = 1; l <= v - 1; l = l + 1)
              L[O] = L[l], O = O + 1;
            if (v === h)
              L[O] = L[h];
            else {
              for (l = h; l >= v + 1 && !(L[l] === 0 || (M = Math.max(Math.abs(L[l - 1]), Math.abs(L[l])), q = Math.min(Math.abs(L[l - 1]), Math.abs(L[l])), L[l - 1] >= 0 ? rr = Math.abs(M * Math.sqrt(1 + q * q / (M * M))) : rr = -Math.abs(M * Math.sqrt(1 + q * q / (M * M))), M = L[l - 1] / rr, q = L[l] / rr, M === 1)); l = l - 1)
                if (M === 0)
                  for (L[l - 1] = q * rr, w = 1; w <= h; w = w + 1)
                    rr = c[w][l - 1], c[w][l - 1] = c[w][l], c[w][l] = rr;
                else
                  for (L[l - 1] = rr, Z = q / (1 + M), w = 1; w <= h; w = w + 1)
                    rr = M * c[w][l - 1] + q * c[w][l], c[w][l] = Z * (c[w][l - 1] + rr) - c[w][l], c[w][l - 1] = rr;
              L[O] = L[v];
            }
          } else {
            for (ir = -g[_], w = 1; w <= h; w = w + 1)
              ir = ir + S[w] * d[w][_];
            if (_ > z)
              L[dr + _] = ir;
            else if (L[dr + _] = -Math.abs(ir), ir > 0) {
              for (w = 1; w <= h; w = w + 1)
                d[w][_] = -d[w][_];
              g[_] = -g[_];
            }
            return 700;
          }
        }
        return 0;
      }
      function ar() {
        if (O = Mr + W * (W + 1) / 2 + 1, j = O + W, L[j] === 0 || (M = Math.max(Math.abs(L[j - 1]), Math.abs(L[j])), q = Math.min(Math.abs(L[j - 1]), Math.abs(L[j])), L[j - 1] >= 0 ? rr = Math.abs(M * Math.sqrt(1 + q * q / (M * M))) : rr = -Math.abs(M * Math.sqrt(1 + q * q / (M * M))), M = L[j - 1] / rr, q = L[j] / rr, M === 1))
          return 798;
        if (M === 0) {
          for (l = W + 1; l <= v; l = l + 1)
            rr = L[j - 1], L[j - 1] = L[j], L[j] = rr, j = j + l;
          for (l = 1; l <= h; l = l + 1)
            rr = c[l][W], c[l][W] = c[l][W + 1], c[l][W + 1] = rr;
        } else {
          for (Z = q / (1 + M), l = W + 1; l <= v; l = l + 1)
            rr = M * L[j - 1] + q * L[j], L[j] = Z * (L[j - 1] + rr) - L[j], L[j - 1] = rr, j = j + l;
          for (l = 1; l <= h; l = l + 1)
            rr = M * c[l][W] + q * c[l][W + 1], c[l][W + 1] = Z * (c[l][W] + rr) - c[l][W + 1], c[l][W] = rr;
        }
        return 0;
      }
      function cr() {
        for (j = O - W, l = 1; l <= W; l = l + 1)
          L[j] = L[O], O = O + 1, j = j + 1;
        return L[U + W] = L[U + W + 1], y[W] = y[W + 1], W = W + 1, W < v ? 797 : 0;
      }
      function e() {
        return L[U + v] = L[U + v + 1], L[U + v + 1] = 0, y[v] = 0, v = v - 1, R[2] = R[2] + 1, 0;
      }
      for (N = 0; ; ) {
        if (N = H(), N === 999)
          return;
        for (; N = J(), N !== 0; ) {
          if (N === 999)
            return;
          if (N === 700)
            if (W === v)
              e();
            else {
              for (; ar(), N = cr(), N === 797; )
                ;
              e();
            }
        }
      }
    }
    function i(c, u, o, h, S, m) {
      c = s(c), u = s(u), o = s(o);
      var d, g, P, E, z, y = [], v = [], R = [], L = [], I = [], l;
      if (S = S || 0, m = m ? s(m) : [void 0, 0], h = h ? s(h) : [], g = c.length - 1, P = o[1].length - 1, !h)
        for (d = 1; d <= P; d = d + 1)
          h[d] = 0;
      for (d = 1; d <= P; d = d + 1)
        v[d] = 0;
      for (E = 0, z = Math.min(g, P), d = 1; d <= g; d = d + 1)
        R[d] = 0;
      for (y[1] = 0, d = 1; d <= 2 * g + z * (z + 5) / 2 + 2 * P + 1; d = d + 1)
        L[d] = 0;
      for (d = 1; d <= 2; d = d + 1)
        I[d] = 0;
      return r(
        c,
        u,
        g,
        g,
        R,
        y,
        o,
        h,
        g,
        P,
        S,
        v,
        E,
        I,
        L,
        m
      ), l = "", m[1] === 1 && (l = "constraints are inconsistent, no solution!"), m[1] === 2 && (l = "matrix D in quadratic function is not positive definite!"), {
        solution: a(R),
        value: a(y),
        unconstrained_solution: a(u),
        iterations: a(I),
        iact: a(v),
        message: l
      };
    }
    D.solveQP = i;
  })(numeric), numeric.svd = function D(s) {
    var a, n = numeric.epsilon, f = 1e-64 / n, t = 50, r = 0, i = 0, c = 0, u = 0, o = 0, h = numeric.clone(s), S = h.length, m = h[0].length;
    if (S < m) throw "Need more rows than columns";
    var d = new Array(m), g = new Array(m);
    for (i = 0; i < m; i++) d[i] = g[i] = 0;
    var P = numeric.rep([m, m], 0);
    function E(Y, W) {
      return Y = Math.abs(Y), W = Math.abs(W), Y > W ? Y * Math.sqrt(1 + W * W / Y / Y) : W == 0 ? Y : W * Math.sqrt(1 + Y * Y / W / W);
    }
    var z = 0, y = 0, v = 0, R = 0, L = 0, I = 0, l = 0;
    for (i = 0; i < m; i++) {
      for (d[i] = y, l = 0, o = i + 1, c = i; c < S; c++)
        l += h[c][i] * h[c][i];
      if (l <= f)
        y = 0;
      else
        for (z = h[i][i], y = Math.sqrt(l), z >= 0 && (y = -y), v = z * y - l, h[i][i] = z - y, c = o; c < m; c++) {
          for (l = 0, u = i; u < S; u++)
            l += h[u][i] * h[u][c];
          for (z = l / v, u = i; u < S; u++)
            h[u][c] += z * h[u][i];
        }
      for (g[i] = y, l = 0, c = o; c < m; c++)
        l = l + h[i][c] * h[i][c];
      if (l <= f)
        y = 0;
      else {
        for (z = h[i][i + 1], y = Math.sqrt(l), z >= 0 && (y = -y), v = z * y - l, h[i][i + 1] = z - y, c = o; c < m; c++) d[c] = h[i][c] / v;
        for (c = o; c < S; c++) {
          for (l = 0, u = o; u < m; u++)
            l += h[c][u] * h[i][u];
          for (u = o; u < m; u++)
            h[c][u] += l * d[u];
        }
      }
      L = Math.abs(g[i]) + Math.abs(d[i]), L > R && (R = L);
    }
    for (i = m - 1; i != -1; i += -1) {
      if (y != 0) {
        for (v = y * h[i][i + 1], c = o; c < m; c++)
          P[c][i] = h[i][c] / v;
        for (c = o; c < m; c++) {
          for (l = 0, u = o; u < m; u++)
            l += h[i][u] * P[u][c];
          for (u = o; u < m; u++)
            P[u][c] += l * P[u][i];
        }
      }
      for (c = o; c < m; c++)
        P[i][c] = 0, P[c][i] = 0;
      P[i][i] = 1, y = d[i], o = i;
    }
    for (i = m - 1; i != -1; i += -1) {
      for (o = i + 1, y = g[i], c = o; c < m; c++)
        h[i][c] = 0;
      if (y != 0) {
        for (v = h[i][i] * y, c = o; c < m; c++) {
          for (l = 0, u = o; u < S; u++) l += h[u][i] * h[u][c];
          for (z = l / v, u = i; u < S; u++) h[u][c] += z * h[u][i];
        }
        for (c = i; c < S; c++) h[c][i] = h[c][i] / y;
      } else
        for (c = i; c < S; c++) h[c][i] = 0;
      h[i][i] += 1;
    }
    for (n = n * R, u = m - 1; u != -1; u += -1)
      for (var w = 0; w < t; w++) {
        var O = !1;
        for (o = u; o != -1; o += -1) {
          if (Math.abs(d[o]) <= n) {
            O = !0;
            break;
          }
          if (Math.abs(g[o - 1]) <= n)
            break;
        }
        if (!O) {
          r = 0, l = 1;
          var j = o - 1;
          for (i = o; i < u + 1 && (z = l * d[i], d[i] = r * d[i], !(Math.abs(z) <= n)); i++)
            for (y = g[i], v = E(z, y), g[i] = v, r = y / v, l = -z / v, c = 0; c < S; c++)
              L = h[c][j], I = h[c][i], h[c][j] = L * r + I * l, h[c][i] = -L * l + I * r;
        }
        if (I = g[u], o == u) {
          if (I < 0)
            for (g[u] = -I, c = 0; c < m; c++)
              P[c][u] = -P[c][u];
          break;
        }
        if (w >= t - 1)
          throw "Error: no convergence.";
        for (R = g[o], L = g[u - 1], y = d[u - 1], v = d[u], z = ((L - I) * (L + I) + (y - v) * (y + v)) / (2 * v * L), y = E(z, 1), z < 0 ? z = ((R - I) * (R + I) + v * (L / (z - y) - v)) / R : z = ((R - I) * (R + I) + v * (L / (z + y) - v)) / R, r = 1, l = 1, i = o + 1; i < u + 1; i++) {
          for (y = d[i], L = g[i], v = l * y, y = r * y, I = E(z, v), d[i - 1] = I, r = z / I, l = v / I, z = R * r + y * l, y = -R * l + y * r, v = L * l, L = L * r, c = 0; c < m; c++)
            R = P[c][i - 1], I = P[c][i], P[c][i - 1] = R * r + I * l, P[c][i] = -R * l + I * r;
          for (I = E(z, v), g[i - 1] = I, r = z / I, l = v / I, z = r * y + l * L, R = -l * y + r * L, c = 0; c < S; c++)
            L = h[c][i - 1], I = h[c][i], h[c][i - 1] = L * r + I * l, h[c][i] = -L * l + I * r;
        }
        d[o] = 0, d[u] = z, g[u] = R;
      }
    for (i = 0; i < g.length; i++)
      g[i] < n && (g[i] = 0);
    for (i = 0; i < m; i++)
      for (c = i - 1; c >= 0; c--)
        if (g[c] < g[i]) {
          for (r = g[c], g[c] = g[i], g[i] = r, u = 0; u < h.length; u++)
            a = h[u][i], h[u][i] = h[u][c], h[u][c] = a;
          for (u = 0; u < P.length; u++)
            a = P[u][i], P[u][i] = P[u][c], P[u][c] = a;
          i = c;
        }
    return { U: h, S: g, V: P };
  };
})(numeric1_2_6);
var numeric$1 = numeric1_2_6, convertCart2Sph = function(D, s) {
  for (var a, n, f, t = new Array(D.length), r = 0; r < D.length; r++)
    a = Math.atan2(D[r][1], D[r][0]), n = Math.atan2(D[r][2], Math.sqrt(D[r][0] * D[r][0] + D[r][1] * D[r][1])), s == 1 ? t[r] = [a, n] : (f = Math.sqrt(D[r][0] * D[r][0] + D[r][1] * D[r][1] + D[r][2] * D[r][2]), t[r] = [a, n, f]);
  return t;
}, computeRealSH = function(D, s) {
  for (var a = new Array(s.length), n = new Array(s.length), f = 0; f < s.length; f++)
    a[f] = s[f][0], n[f] = s[f][1];
  var t = new Array(2 * D + 1);
  a.length;
  for (var r = (D + 1) * (D + 1), i = 0, c = 0, u, o = numeric$1.sin(n), h = 0, S = new Array(r), m, d, g, P, f = 0; f < 2 * D + 1; f++) t[f] = factorial(f);
  for (var E = 0; E < D + 1; E++) {
    if (E == 0) {
      var z = new Array(a.length);
      z.fill(1), S[E] = z, h = 1;
    } else {
      u = recurseLegendrePoly(E, o, i, c), m = Math.sqrt(2 * E + 1);
      for (var y = 0; y < E + 1; y++)
        y == 0 ? S[h + E] = numeric$1.mul(m, u[y]) : (d = m * Math.sqrt(2 * t[E - y] / t[E + y]), g = numeric$1.cos(numeric$1.mul(y, a)), P = numeric$1.sin(numeric$1.mul(y, a)), S[h + E - y] = numeric$1.mul(d, numeric$1.mul(u[y], P)), S[h + E + y] = numeric$1.mul(d, numeric$1.mul(u[y], g)));
      h = h + 2 * E + 1;
    }
    c = i, i = u;
  }
  return S;
}, factorial = function(D) {
  return D === 0 ? 1 : D * factorial(D - 1);
}, recurseLegendrePoly = function(D, s, a, n) {
  var f = new Array(D + 1);
  switch (D) {
    case 1:
      var o = numeric$1.mul(s, s), t = s, r = numeric$1.sqrt(numeric$1.sub(1, o));
      f[0] = t, f[1] = r;
      break;
    case 2:
      var o = numeric$1.mul(s, s), i = numeric$1.mul(3, o);
      i = numeric$1.sub(i, 1), i = numeric$1.div(i, 2);
      var c = numeric$1.sub(1, o);
      c = numeric$1.sqrt(c), c = numeric$1.mul(3, c), c = numeric$1.mul(c, s);
      var u = numeric$1.sub(1, o);
      u = numeric$1.mul(3, u), f[0] = i, f[1] = c, f[2] = u;
      break;
    default:
      var o = numeric$1.mul(s, s), h = numeric$1.sub(1, o), S = 2 * D - 1, m = 1;
      if (S % 2 == 0)
        for (var d = 1; d < S / 2 + 1; d++) m = m * 2 * d;
      else
        for (var d = 1; d < (S + 1) / 2 + 1; d++) m = m * (2 * d - 1);
      f[D] = numeric$1.mul(m, numeric$1.pow(h, D / 2)), f[D - 1] = numeric$1.mul(2 * D - 1, numeric$1.mul(s, a[D - 1]));
      for (var g = 0; g < D - 1; g++) {
        var P = numeric$1.mul(2 * D - 1, numeric$1.mul(s, a[g])), E = numeric$1.mul(D + g - 1, n[g]);
        f[g] = numeric$1.div(numeric$1.sub(P, E), D - g);
      }
  }
  return f;
}, convertCart2Sph_1 = convertCart2Sph, computeRealSH_1 = computeRealSH, orientation = { exports: {} }, twoProduct_1 = twoProduct$1, SPLITTER = +(Math.pow(2, 27) + 1);
function twoProduct$1(D, s, a) {
  var n = D * s, f = SPLITTER * D, t = f - D, r = f - t, i = D - r, c = SPLITTER * s, u = c - s, o = c - u, h = s - o, S = n - r * o, m = S - i * o, d = m - r * h, g = i * h - d;
  return a ? (a[0] = g, a[1] = n, a) : [g, n];
}
var robustSum = linearExpansionSum;
function scalarScalar$1(D, s) {
  var a = D + s, n = a - D, f = a - n, t = s - n, r = D - f, i = r + t;
  return i ? [i, a] : [a];
}
function linearExpansionSum(D, s) {
  var a = D.length | 0, n = s.length | 0;
  if (a === 1 && n === 1)
    return scalarScalar$1(D[0], s[0]);
  var f = a + n, t = new Array(f), r = 0, i = 0, c = 0, u = Math.abs, o = D[i], h = u(o), S = s[c], m = u(S), d, g;
  h < m ? (g = o, i += 1, i < a && (o = D[i], h = u(o))) : (g = S, c += 1, c < n && (S = s[c], m = u(S))), i < a && h < m || c >= n ? (d = o, i += 1, i < a && (o = D[i], h = u(o))) : (d = S, c += 1, c < n && (S = s[c], m = u(S)));
  for (var P = d + g, E = P - d, z = g - E, y = z, v = P, R, L, I, l, w; i < a && c < n; )
    h < m ? (d = o, i += 1, i < a && (o = D[i], h = u(o))) : (d = S, c += 1, c < n && (S = s[c], m = u(S))), g = y, P = d + g, E = P - d, z = g - E, z && (t[r++] = z), R = v + P, L = R - v, I = R - L, l = P - L, w = v - I, y = w + l, v = R;
  for (; i < a; )
    d = o, g = y, P = d + g, E = P - d, z = g - E, z && (t[r++] = z), R = v + P, L = R - v, I = R - L, l = P - L, w = v - I, y = w + l, v = R, i += 1, i < a && (o = D[i]);
  for (; c < n; )
    d = S, g = y, P = d + g, E = P - d, z = g - E, z && (t[r++] = z), R = v + P, L = R - v, I = R - L, l = P - L, w = v - I, y = w + l, v = R, c += 1, c < n && (S = s[c]);
  return y && (t[r++] = y), v && (t[r++] = v), r || (t[r++] = 0), t.length = r, t;
}
var twoSum$1 = fastTwoSum;
function fastTwoSum(D, s, a) {
  var n = D + s, f = n - D, t = n - f, r = s - f, i = D - t;
  return a ? (a[0] = i + r, a[1] = n, a) : [i + r, n];
}
var twoProduct = twoProduct_1, twoSum = twoSum$1, robustScale = scaleLinearExpansion;
function scaleLinearExpansion(D, s) {
  var a = D.length;
  if (a === 1) {
    var n = twoProduct(D[0], s);
    return n[0] ? n : [n[1]];
  }
  var f = new Array(2 * a), t = [0.1, 0.1], r = [0.1, 0.1], i = 0;
  twoProduct(D[0], s, t), t[0] && (f[i++] = t[0]);
  for (var c = 1; c < a; ++c) {
    twoProduct(D[c], s, r);
    var u = t[1];
    twoSum(u, r[0], t), t[0] && (f[i++] = t[0]);
    var o = r[1], h = t[1], S = o + h, m = S - o, d = h - m;
    t[1] = S, d && (f[i++] = d);
  }
  return t[1] && (f[i++] = t[1]), i === 0 && (f[i++] = 0), f.length = i, f;
}
var robustDiff = robustSubtract;
function scalarScalar(D, s) {
  var a = D + s, n = a - D, f = a - n, t = s - n, r = D - f, i = r + t;
  return i ? [i, a] : [a];
}
function robustSubtract(D, s) {
  var a = D.length | 0, n = s.length | 0;
  if (a === 1 && n === 1)
    return scalarScalar(D[0], -s[0]);
  var f = a + n, t = new Array(f), r = 0, i = 0, c = 0, u = Math.abs, o = D[i], h = u(o), S = -s[c], m = u(S), d, g;
  h < m ? (g = o, i += 1, i < a && (o = D[i], h = u(o))) : (g = S, c += 1, c < n && (S = -s[c], m = u(S))), i < a && h < m || c >= n ? (d = o, i += 1, i < a && (o = D[i], h = u(o))) : (d = S, c += 1, c < n && (S = -s[c], m = u(S)));
  for (var P = d + g, E = P - d, z = g - E, y = z, v = P, R, L, I, l, w; i < a && c < n; )
    h < m ? (d = o, i += 1, i < a && (o = D[i], h = u(o))) : (d = S, c += 1, c < n && (S = -s[c], m = u(S))), g = y, P = d + g, E = P - d, z = g - E, z && (t[r++] = z), R = v + P, L = R - v, I = R - L, l = P - L, w = v - I, y = w + l, v = R;
  for (; i < a; )
    d = o, g = y, P = d + g, E = P - d, z = g - E, z && (t[r++] = z), R = v + P, L = R - v, I = R - L, l = P - L, w = v - I, y = w + l, v = R, i += 1, i < a && (o = D[i]);
  for (; c < n; )
    d = S, g = y, P = d + g, E = P - d, z = g - E, z && (t[r++] = z), R = v + P, L = R - v, I = R - L, l = P - L, w = v - I, y = w + l, v = R, c += 1, c < n && (S = -s[c]);
  return y && (t[r++] = y), v && (t[r++] = v), r || (t[r++] = 0), t.length = r, t;
}
(function(D) {
  var s = twoProduct_1, a = robustSum, n = robustScale, f = robustDiff, t = 5, r = 11102230246251565e-32, i = (3 + 16 * r) * r, c = (7 + 56 * r) * r;
  function u(y, v, R, L) {
    return function(l, w, O) {
      var j = y(y(v(w[1], O[0]), v(-O[1], w[0])), y(v(l[1], w[0]), v(-w[1], l[0]))), Y = y(v(l[1], O[0]), v(-O[1], l[0])), W = L(j, Y);
      return W[W.length - 1];
    };
  }
  function o(y, v, R, L) {
    return function(l, w, O, j) {
      var Y = y(y(R(y(v(O[1], j[0]), v(-j[1], O[0])), w[2]), y(R(y(v(w[1], j[0]), v(-j[1], w[0])), -O[2]), R(y(v(w[1], O[0]), v(-O[1], w[0])), j[2]))), y(R(y(v(w[1], j[0]), v(-j[1], w[0])), l[2]), y(R(y(v(l[1], j[0]), v(-j[1], l[0])), -w[2]), R(y(v(l[1], w[0]), v(-w[1], l[0])), j[2])))), W = y(y(R(y(v(O[1], j[0]), v(-j[1], O[0])), l[2]), y(R(y(v(l[1], j[0]), v(-j[1], l[0])), -O[2]), R(y(v(l[1], O[0]), v(-O[1], l[0])), j[2]))), y(R(y(v(w[1], O[0]), v(-O[1], w[0])), l[2]), y(R(y(v(l[1], O[0]), v(-O[1], l[0])), -w[2]), R(y(v(l[1], w[0]), v(-w[1], l[0])), O[2])))), er = L(Y, W);
      return er[er.length - 1];
    };
  }
  function h(y, v, R, L) {
    return function(l, w, O, j, Y) {
      var W = y(y(y(R(y(R(y(v(j[1], Y[0]), v(-Y[1], j[0])), O[2]), y(R(y(v(O[1], Y[0]), v(-Y[1], O[0])), -j[2]), R(y(v(O[1], j[0]), v(-j[1], O[0])), Y[2]))), w[3]), y(R(y(R(y(v(j[1], Y[0]), v(-Y[1], j[0])), w[2]), y(R(y(v(w[1], Y[0]), v(-Y[1], w[0])), -j[2]), R(y(v(w[1], j[0]), v(-j[1], w[0])), Y[2]))), -O[3]), R(y(R(y(v(O[1], Y[0]), v(-Y[1], O[0])), w[2]), y(R(y(v(w[1], Y[0]), v(-Y[1], w[0])), -O[2]), R(y(v(w[1], O[0]), v(-O[1], w[0])), Y[2]))), j[3]))), y(R(y(R(y(v(O[1], j[0]), v(-j[1], O[0])), w[2]), y(R(y(v(w[1], j[0]), v(-j[1], w[0])), -O[2]), R(y(v(w[1], O[0]), v(-O[1], w[0])), j[2]))), -Y[3]), y(R(y(R(y(v(j[1], Y[0]), v(-Y[1], j[0])), w[2]), y(R(y(v(w[1], Y[0]), v(-Y[1], w[0])), -j[2]), R(y(v(w[1], j[0]), v(-j[1], w[0])), Y[2]))), l[3]), R(y(R(y(v(j[1], Y[0]), v(-Y[1], j[0])), l[2]), y(R(y(v(l[1], Y[0]), v(-Y[1], l[0])), -j[2]), R(y(v(l[1], j[0]), v(-j[1], l[0])), Y[2]))), -w[3])))), y(y(R(y(R(y(v(w[1], Y[0]), v(-Y[1], w[0])), l[2]), y(R(y(v(l[1], Y[0]), v(-Y[1], l[0])), -w[2]), R(y(v(l[1], w[0]), v(-w[1], l[0])), Y[2]))), j[3]), y(R(y(R(y(v(w[1], j[0]), v(-j[1], w[0])), l[2]), y(R(y(v(l[1], j[0]), v(-j[1], l[0])), -w[2]), R(y(v(l[1], w[0]), v(-w[1], l[0])), j[2]))), -Y[3]), R(y(R(y(v(O[1], j[0]), v(-j[1], O[0])), w[2]), y(R(y(v(w[1], j[0]), v(-j[1], w[0])), -O[2]), R(y(v(w[1], O[0]), v(-O[1], w[0])), j[2]))), l[3]))), y(R(y(R(y(v(O[1], j[0]), v(-j[1], O[0])), l[2]), y(R(y(v(l[1], j[0]), v(-j[1], l[0])), -O[2]), R(y(v(l[1], O[0]), v(-O[1], l[0])), j[2]))), -w[3]), y(R(y(R(y(v(w[1], j[0]), v(-j[1], w[0])), l[2]), y(R(y(v(l[1], j[0]), v(-j[1], l[0])), -w[2]), R(y(v(l[1], w[0]), v(-w[1], l[0])), j[2]))), O[3]), R(y(R(y(v(w[1], O[0]), v(-O[1], w[0])), l[2]), y(R(y(v(l[1], O[0]), v(-O[1], l[0])), -w[2]), R(y(v(l[1], w[0]), v(-w[1], l[0])), O[2]))), -j[3]))))), er = y(y(y(R(y(R(y(v(j[1], Y[0]), v(-Y[1], j[0])), O[2]), y(R(y(v(O[1], Y[0]), v(-Y[1], O[0])), -j[2]), R(y(v(O[1], j[0]), v(-j[1], O[0])), Y[2]))), l[3]), R(y(R(y(v(j[1], Y[0]), v(-Y[1], j[0])), l[2]), y(R(y(v(l[1], Y[0]), v(-Y[1], l[0])), -j[2]), R(y(v(l[1], j[0]), v(-j[1], l[0])), Y[2]))), -O[3])), y(R(y(R(y(v(O[1], Y[0]), v(-Y[1], O[0])), l[2]), y(R(y(v(l[1], Y[0]), v(-Y[1], l[0])), -O[2]), R(y(v(l[1], O[0]), v(-O[1], l[0])), Y[2]))), j[3]), R(y(R(y(v(O[1], j[0]), v(-j[1], O[0])), l[2]), y(R(y(v(l[1], j[0]), v(-j[1], l[0])), -O[2]), R(y(v(l[1], O[0]), v(-O[1], l[0])), j[2]))), -Y[3]))), y(y(R(y(R(y(v(O[1], Y[0]), v(-Y[1], O[0])), w[2]), y(R(y(v(w[1], Y[0]), v(-Y[1], w[0])), -O[2]), R(y(v(w[1], O[0]), v(-O[1], w[0])), Y[2]))), l[3]), R(y(R(y(v(O[1], Y[0]), v(-Y[1], O[0])), l[2]), y(R(y(v(l[1], Y[0]), v(-Y[1], l[0])), -O[2]), R(y(v(l[1], O[0]), v(-O[1], l[0])), Y[2]))), -w[3])), y(R(y(R(y(v(w[1], Y[0]), v(-Y[1], w[0])), l[2]), y(R(y(v(l[1], Y[0]), v(-Y[1], l[0])), -w[2]), R(y(v(l[1], w[0]), v(-w[1], l[0])), Y[2]))), O[3]), R(y(R(y(v(w[1], O[0]), v(-O[1], w[0])), l[2]), y(R(y(v(l[1], O[0]), v(-O[1], l[0])), -w[2]), R(y(v(l[1], w[0]), v(-w[1], l[0])), O[2]))), -Y[3])))), mr = L(W, er);
      return mr[mr.length - 1];
    };
  }
  function S(y) {
    var v = y === 3 ? u : y === 4 ? o : h;
    return v(a, s, n, f);
  }
  var m = S(3), d = S(4), g = [
    function() {
      return 0;
    },
    function() {
      return 0;
    },
    function(v, R) {
      return R[0] - v[0];
    },
    function(v, R, L) {
      var I = (v[1] - L[1]) * (R[0] - L[0]), l = (v[0] - L[0]) * (R[1] - L[1]), w = I - l, O;
      if (I > 0) {
        if (l <= 0)
          return w;
        O = I + l;
      } else if (I < 0) {
        if (l >= 0)
          return w;
        O = -(I + l);
      } else
        return w;
      var j = i * O;
      return w >= j || w <= -j ? w : m(v, R, L);
    },
    function(v, R, L, I) {
      var l = v[0] - I[0], w = R[0] - I[0], O = L[0] - I[0], j = v[1] - I[1], Y = R[1] - I[1], W = L[1] - I[1], er = v[2] - I[2], mr = R[2] - I[2], Mr = L[2] - I[2], dr = w * W, U = O * Y, _ = O * j, F = l * W, $ = l * Y, rr = w * j, ir = er * (dr - U) + mr * (_ - F) + Mr * ($ - rr), vr = (Math.abs(dr) + Math.abs(U)) * Math.abs(er) + (Math.abs(_) + Math.abs(F)) * Math.abs(mr) + (Math.abs($) + Math.abs(rr)) * Math.abs(Mr), b = c * vr;
      return ir > b || -ir > b ? ir : d(v, R, L, I);
    }
  ];
  function P(y) {
    var v = g[y.length];
    return v || (v = g[y.length] = S(y.length)), v.apply(void 0, y);
  }
  function E(y, v, R, L, I, l, w) {
    return function(j, Y, W, er, mr) {
      switch (arguments.length) {
        case 0:
        case 1:
          return 0;
        case 2:
          return L(j, Y);
        case 3:
          return I(j, Y, W);
        case 4:
          return l(j, Y, W, er);
        case 5:
          return w(j, Y, W, er, mr);
      }
      for (var Mr = new Array(arguments.length), dr = 0; dr < arguments.length; ++dr)
        Mr[dr] = arguments[dr];
      return y(Mr);
    };
  }
  function z() {
    for (; g.length <= t; )
      g.push(S(g.length));
    D.exports = E.apply(void 0, [P].concat(g));
    for (var y = 0; y <= t; ++y)
      D.exports[y] = g[y];
  }
  z();
})(orientation);
var orientationExports = orientation.exports;
orientationExports[3];
var REVERSE_TABLE = new Array(256);
(function(D) {
  for (var s = 0; s < 256; ++s) {
    var a = s, n = s, f = 7;
    for (a >>>= 1; a; a >>>= 1)
      n <<= 1, n |= a & 1, --f;
    D[s] = n << f & 255;
  }
})(REVERSE_TABLE);
function UnionFind$1(D) {
  this.roots = new Array(D), this.ranks = new Array(D);
  for (var s = 0; s < D; ++s)
    this.roots[s] = s, this.ranks[s] = 0;
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
  for (var s = D, a = this.roots; a[D] !== D; )
    D = a[D];
  for (; a[s] !== D; ) {
    var n = a[s];
    a[s] = D, s = n;
  }
  return D;
};
proto$1.link = function(D, s) {
  var a = this.find(D), n = this.find(s);
  if (a !== n) {
    var f = this.ranks, t = this.roots, r = f[a], i = f[n];
    r < i ? t[a] = n : i < r ? t[n] = a : (t[n] = a, ++f[a]);
  }
};
function computeEncodingCoefficients(D, s, a) {
  const n = getAmbisonicChannelCount(a), f = degreesToRadians(D), t = degreesToRadians(s), r = computeRealSH_1(a, [[f, t]]), i = new Float32Array(n);
  for (let c = 0; c < n; c++)
    i[c] = r[c][0];
  return i;
}
function encodeBuffer(D, s, a, n) {
  const f = getAmbisonicChannelCount(n), t = D.length, r = computeEncodingCoefficients(s, a, n), i = new Array(f);
  for (let c = 0; c < f; c++) {
    i[c] = new Float32Array(t);
    const u = r[c];
    for (let o = 0; o < t; o++)
      i[c][o] = D[o] * u;
  }
  return i;
}
function encodeBufferFromDirection(D, s, a, n, f, t = "ambisonics") {
  let r = s, i = a, c = n;
  t === "threejs" && (r = n, i = -s, c = a);
  const [[u, o]] = convertCart2Sph_1([[r, i, c]], 1), h = u * 180 / Math.PI, S = o * 180 / Math.PI;
  return encodeBuffer(D, h, S, f);
}
if (commonjsGlobal.AnalyserNode && !commonjsGlobal.AnalyserNode.prototype.getFloatTimeDomainData) {
  var uint8 = new Uint8Array(2048);
  commonjsGlobal.AnalyserNode.prototype.getFloatTimeDomainData = function(D) {
    this.getByteTimeDomainData(uint8);
    for (var s = 0, a = D.length; s < a; s++)
      D[s] = (uint8[s] - 128) * 78125e-7;
  };
}
function commonjsRequire(D) {
  throw new Error('Could not dynamically require "' + D + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var serveSofaHrir = { exports: {} };
(function(D, s) {
  (function(a) {
    D.exports = a();
  })(function() {
    return (function a(n, f, t) {
      function r(u, o) {
        if (!f[u]) {
          if (!n[u]) {
            var h = typeof commonjsRequire == "function" && commonjsRequire;
            if (!o && h) return h(u, !0);
            if (i) return i(u, !0);
            var S = new Error("Cannot find module '" + u + "'");
            throw S.code = "MODULE_NOT_FOUND", S;
          }
          var m = f[u] = { exports: {} };
          n[u][0].call(m.exports, function(d) {
            var g = n[u][1][d];
            return r(g || d);
          }, m, m.exports, a, n, f, t);
        }
        return f[u].exports;
      }
      for (var i = typeof commonjsRequire == "function" && commonjsRequire, c = 0; c < t.length; c++) r(t[c]);
      return r;
    })({ 1: [function(a, n, f) {
      n.exports = { default: a("core-js/library/fn/object/define-property"), __esModule: !0 };
    }, { "core-js/library/fn/object/define-property": 4 }], 2: [function(a, n, f) {
      f.default = function(t, r) {
        if (!(t instanceof r))
          throw new TypeError("Cannot call a class as a function");
      }, f.__esModule = !0;
    }, {}], 3: [function(a, n, f) {
      var t = a("babel-runtime/core-js/object/define-property").default;
      f.default = /* @__PURE__ */ (function() {
        function r(i, c) {
          for (var u = 0; u < c.length; u++) {
            var o = c[u];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), t(i, o.key, o);
          }
        }
        return function(i, c, u) {
          return c && r(i.prototype, c), u && r(i, u), i;
        };
      })(), f.__esModule = !0;
    }, { "babel-runtime/core-js/object/define-property": 1 }], 4: [function(a, n, f) {
      var t = a("../../modules/$");
      n.exports = function(i, c, u) {
        return t.setDesc(i, c, u);
      };
    }, { "../../modules/$": 5 }], 5: [function(a, n, f) {
      var t = Object;
      n.exports = {
        create: t.create,
        getProto: t.getPrototypeOf,
        isEnum: {}.propertyIsEnumerable,
        getDesc: t.getOwnPropertyDescriptor,
        setDesc: t.defineProperty,
        setDescs: t.defineProperties,
        getKeys: t.keys,
        getNames: t.getOwnPropertyNames,
        getSymbols: t.getOwnPropertySymbols,
        each: [].forEach
      };
    }, {}], 6: [function(a, n, f) {
      var t = a("babel-runtime/helpers/create-class").default, r = a("babel-runtime/helpers/class-call-check").default;
      Object.defineProperty(f, "__esModule", {
        value: !0
      });
      var i = (function() {
        function c(u, o) {
          r(this, c), this.delayTime = 0, this.posRead = 0, this.posWrite = 0, this.fracXi1 = 0, this.fracYi1 = 0, this.intDelay = 0, this.fracDelay = 0, this.a1 = void 0, this.sampleRate = u, this.maxDelayTime = o || 1, this.bufferSize = this.maxDelayTime * this.sampleRate, this.bufferSize % 1 !== 0 && (this.bufferSize = parseInt(this.bufferSize) + 1), this.buffer = new Float32Array(this.bufferSize);
        }
        return t(c, [{
          key: "setDelay",
          value: function(o) {
            if (o < this.maxDelayTime) {
              this.delayTime = o;
              var h = o * this.sampleRate;
              this.intDelay = parseInt(h), this.fracDelay = h - this.intDelay, this.resample(), this.fracDelay !== 0 && this.updateThiranCoefficient();
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
            for (var h = new Float32Array(o.length), S = 0; S < o.length; S = S + 1)
              this.buffer[this.posWrite] = o[S], h[S] = this.buffer[this.posRead], this.updatePointers();
            return this.fracDelay === 0 || (h = new Float32Array(this.fractionalThiranProcess(h))), h;
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
            for (var h = new Float32Array(o.length), S, m, d = this.fracXi1, g = this.fracYi1, P = 0; P < o.length; P = P + 1)
              S = o[P], m = this.a1 * S + d - this.a1 * g, d = S, g = m, h[P] = m;
            return this.fracXi1 = d, this.fracYi1 = g, h;
          }
        }]), c;
      })();
      f.default = i, n.exports = f.default;
    }, { "babel-runtime/helpers/class-call-check": 2, "babel-runtime/helpers/create-class": 3 }], 7: [function(a, n, f) {
      n.exports = a("./dist/fractional-delay");
    }, { "./dist/fractional-delay": 6 }], 8: [function(a, n, f) {
      (function(r, i) {
        if (typeof f == "object" && typeof n == "object")
          n.exports = i();
        else {
          var c = i();
          for (var u in c) (typeof f == "object" ? f : r)[u] = c[u];
        }
      })(this, function() {
        return (
          /******/
          (function(t) {
            var r = {};
            function i(c) {
              if (r[c])
                return r[c].exports;
              var u = r[c] = {
                /******/
                i: c,
                /******/
                l: !1,
                /******/
                exports: {}
                /******/
              };
              return t[c].call(u.exports, u, u.exports, i), u.l = !0, u.exports;
            }
            return i.m = t, i.c = r, i.d = function(c, u, o) {
              i.o(c, u) || Object.defineProperty(c, u, {
                /******/
                configurable: !1,
                /******/
                enumerable: !0,
                /******/
                get: o
                /******/
              });
            }, i.n = function(c) {
              var u = c && c.__esModule ? (
                /******/
                (function() {
                  return c.default;
                })
              ) : (
                /******/
                (function() {
                  return c;
                })
              );
              return i.d(u, "a", u), u;
            }, i.o = function(c, u) {
              return Object.prototype.hasOwnProperty.call(c, u);
            }, i.p = "", i(i.s = 4);
          })([
            /* 0 */
            /***/
            function(t, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.setMatrixArrayType = u, r.toRadian = h, r.equals = S;
              var c = r.EPSILON = 1e-6;
              r.ARRAY_TYPE = typeof Float32Array < "u" ? Float32Array : Array, r.RANDOM = Math.random;
              function u(m) {
                r.ARRAY_TYPE = m;
              }
              var o = Math.PI / 180;
              function h(m) {
                return m * o;
              }
              function S(m, d) {
                return Math.abs(m - d) <= c * Math.max(1, Math.abs(m), Math.abs(d));
              }
            },
            /* 1 */
            /***/
            function(t, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = h, r.fromMat4 = S, r.clone = m, r.copy = d, r.fromValues = g, r.set = P, r.identity = E, r.transpose = z, r.invert = y, r.adjoint = v, r.determinant = R, r.multiply = L, r.translate = I, r.rotate = l, r.scale = w, r.fromTranslation = O, r.fromRotation = j, r.fromScaling = Y, r.fromMat2d = W, r.fromQuat = er, r.normalFromMat4 = mr, r.projection = Mr, r.str = dr, r.frob = U, r.add = _, r.subtract = F, r.multiplyScalar = $, r.multiplyScalarAndAdd = rr, r.exactEquals = ir, r.equals = vr;
              var c = i(0), u = o(c);
              function o(b) {
                if (b && b.__esModule)
                  return b;
                var M = {};
                if (b != null)
                  for (var q in b)
                    Object.prototype.hasOwnProperty.call(b, q) && (M[q] = b[q]);
                return M.default = b, M;
              }
              function h() {
                var b = new u.ARRAY_TYPE(9);
                return b[0] = 1, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 1, b[5] = 0, b[6] = 0, b[7] = 0, b[8] = 1, b;
              }
              function S(b, M) {
                return b[0] = M[0], b[1] = M[1], b[2] = M[2], b[3] = M[4], b[4] = M[5], b[5] = M[6], b[6] = M[8], b[7] = M[9], b[8] = M[10], b;
              }
              function m(b) {
                var M = new u.ARRAY_TYPE(9);
                return M[0] = b[0], M[1] = b[1], M[2] = b[2], M[3] = b[3], M[4] = b[4], M[5] = b[5], M[6] = b[6], M[7] = b[7], M[8] = b[8], M;
              }
              function d(b, M) {
                return b[0] = M[0], b[1] = M[1], b[2] = M[2], b[3] = M[3], b[4] = M[4], b[5] = M[5], b[6] = M[6], b[7] = M[7], b[8] = M[8], b;
              }
              function g(b, M, q, Z, V, Q, K, fr, or) {
                var N = new u.ARRAY_TYPE(9);
                return N[0] = b, N[1] = M, N[2] = q, N[3] = Z, N[4] = V, N[5] = Q, N[6] = K, N[7] = fr, N[8] = or, N;
              }
              function P(b, M, q, Z, V, Q, K, fr, or, N) {
                return b[0] = M, b[1] = q, b[2] = Z, b[3] = V, b[4] = Q, b[5] = K, b[6] = fr, b[7] = or, b[8] = N, b;
              }
              function E(b) {
                return b[0] = 1, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 1, b[5] = 0, b[6] = 0, b[7] = 0, b[8] = 1, b;
              }
              function z(b, M) {
                if (b === M) {
                  var q = M[1], Z = M[2], V = M[5];
                  b[1] = M[3], b[2] = M[6], b[3] = q, b[5] = M[7], b[6] = Z, b[7] = V;
                } else
                  b[0] = M[0], b[1] = M[3], b[2] = M[6], b[3] = M[1], b[4] = M[4], b[5] = M[7], b[6] = M[2], b[7] = M[5], b[8] = M[8];
                return b;
              }
              function y(b, M) {
                var q = M[0], Z = M[1], V = M[2], Q = M[3], K = M[4], fr = M[5], or = M[6], N = M[7], H = M[8], J = H * K - fr * N, ar = -H * Q + fr * or, cr = N * Q - K * or, e = q * J + Z * ar + V * cr;
                return e ? (e = 1 / e, b[0] = J * e, b[1] = (-H * Z + V * N) * e, b[2] = (fr * Z - V * K) * e, b[3] = ar * e, b[4] = (H * q - V * or) * e, b[5] = (-fr * q + V * Q) * e, b[6] = cr * e, b[7] = (-N * q + Z * or) * e, b[8] = (K * q - Z * Q) * e, b) : null;
              }
              function v(b, M) {
                var q = M[0], Z = M[1], V = M[2], Q = M[3], K = M[4], fr = M[5], or = M[6], N = M[7], H = M[8];
                return b[0] = K * H - fr * N, b[1] = V * N - Z * H, b[2] = Z * fr - V * K, b[3] = fr * or - Q * H, b[4] = q * H - V * or, b[5] = V * Q - q * fr, b[6] = Q * N - K * or, b[7] = Z * or - q * N, b[8] = q * K - Z * Q, b;
              }
              function R(b) {
                var M = b[0], q = b[1], Z = b[2], V = b[3], Q = b[4], K = b[5], fr = b[6], or = b[7], N = b[8];
                return M * (N * Q - K * or) + q * (-N * V + K * fr) + Z * (or * V - Q * fr);
              }
              function L(b, M, q) {
                var Z = M[0], V = M[1], Q = M[2], K = M[3], fr = M[4], or = M[5], N = M[6], H = M[7], J = M[8], ar = q[0], cr = q[1], e = q[2], p = q[3], X = q[4], G = q[5], x = q[6], nr = q[7], tr = q[8];
                return b[0] = ar * Z + cr * K + e * N, b[1] = ar * V + cr * fr + e * H, b[2] = ar * Q + cr * or + e * J, b[3] = p * Z + X * K + G * N, b[4] = p * V + X * fr + G * H, b[5] = p * Q + X * or + G * J, b[6] = x * Z + nr * K + tr * N, b[7] = x * V + nr * fr + tr * H, b[8] = x * Q + nr * or + tr * J, b;
              }
              function I(b, M, q) {
                var Z = M[0], V = M[1], Q = M[2], K = M[3], fr = M[4], or = M[5], N = M[6], H = M[7], J = M[8], ar = q[0], cr = q[1];
                return b[0] = Z, b[1] = V, b[2] = Q, b[3] = K, b[4] = fr, b[5] = or, b[6] = ar * Z + cr * K + N, b[7] = ar * V + cr * fr + H, b[8] = ar * Q + cr * or + J, b;
              }
              function l(b, M, q) {
                var Z = M[0], V = M[1], Q = M[2], K = M[3], fr = M[4], or = M[5], N = M[6], H = M[7], J = M[8], ar = Math.sin(q), cr = Math.cos(q);
                return b[0] = cr * Z + ar * K, b[1] = cr * V + ar * fr, b[2] = cr * Q + ar * or, b[3] = cr * K - ar * Z, b[4] = cr * fr - ar * V, b[5] = cr * or - ar * Q, b[6] = N, b[7] = H, b[8] = J, b;
              }
              function w(b, M, q) {
                var Z = q[0], V = q[1];
                return b[0] = Z * M[0], b[1] = Z * M[1], b[2] = Z * M[2], b[3] = V * M[3], b[4] = V * M[4], b[5] = V * M[5], b[6] = M[6], b[7] = M[7], b[8] = M[8], b;
              }
              function O(b, M) {
                return b[0] = 1, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 1, b[5] = 0, b[6] = M[0], b[7] = M[1], b[8] = 1, b;
              }
              function j(b, M) {
                var q = Math.sin(M), Z = Math.cos(M);
                return b[0] = Z, b[1] = q, b[2] = 0, b[3] = -q, b[4] = Z, b[5] = 0, b[6] = 0, b[7] = 0, b[8] = 1, b;
              }
              function Y(b, M) {
                return b[0] = M[0], b[1] = 0, b[2] = 0, b[3] = 0, b[4] = M[1], b[5] = 0, b[6] = 0, b[7] = 0, b[8] = 1, b;
              }
              function W(b, M) {
                return b[0] = M[0], b[1] = M[1], b[2] = 0, b[3] = M[2], b[4] = M[3], b[5] = 0, b[6] = M[4], b[7] = M[5], b[8] = 1, b;
              }
              function er(b, M) {
                var q = M[0], Z = M[1], V = M[2], Q = M[3], K = q + q, fr = Z + Z, or = V + V, N = q * K, H = Z * K, J = Z * fr, ar = V * K, cr = V * fr, e = V * or, p = Q * K, X = Q * fr, G = Q * or;
                return b[0] = 1 - J - e, b[3] = H - G, b[6] = ar + X, b[1] = H + G, b[4] = 1 - N - e, b[7] = cr - p, b[2] = ar - X, b[5] = cr + p, b[8] = 1 - N - J, b;
              }
              function mr(b, M) {
                var q = M[0], Z = M[1], V = M[2], Q = M[3], K = M[4], fr = M[5], or = M[6], N = M[7], H = M[8], J = M[9], ar = M[10], cr = M[11], e = M[12], p = M[13], X = M[14], G = M[15], x = q * fr - Z * K, nr = q * or - V * K, tr = q * N - Q * K, sr = Z * or - V * fr, ur = Z * N - Q * fr, lr = V * N - Q * or, yr = H * p - J * e, pr = H * X - ar * e, gr = H * G - cr * e, wr = J * X - ar * p, _r = J * G - cr * p, Sr = ar * G - cr * X, hr = x * Sr - nr * _r + tr * wr + sr * gr - ur * pr + lr * yr;
                return hr ? (hr = 1 / hr, b[0] = (fr * Sr - or * _r + N * wr) * hr, b[1] = (or * gr - K * Sr - N * pr) * hr, b[2] = (K * _r - fr * gr + N * yr) * hr, b[3] = (V * _r - Z * Sr - Q * wr) * hr, b[4] = (q * Sr - V * gr + Q * pr) * hr, b[5] = (Z * gr - q * _r - Q * yr) * hr, b[6] = (p * lr - X * ur + G * sr) * hr, b[7] = (X * tr - e * lr - G * nr) * hr, b[8] = (e * ur - p * tr + G * x) * hr, b) : null;
              }
              function Mr(b, M, q) {
                return b[0] = 2 / M, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = -2 / q, b[5] = 0, b[6] = -1, b[7] = 1, b[8] = 1, b;
              }
              function dr(b) {
                return "mat3(" + b[0] + ", " + b[1] + ", " + b[2] + ", " + b[3] + ", " + b[4] + ", " + b[5] + ", " + b[6] + ", " + b[7] + ", " + b[8] + ")";
              }
              function U(b) {
                return Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2) + Math.pow(b[2], 2) + Math.pow(b[3], 2) + Math.pow(b[4], 2) + Math.pow(b[5], 2) + Math.pow(b[6], 2) + Math.pow(b[7], 2) + Math.pow(b[8], 2));
              }
              function _(b, M, q) {
                return b[0] = M[0] + q[0], b[1] = M[1] + q[1], b[2] = M[2] + q[2], b[3] = M[3] + q[3], b[4] = M[4] + q[4], b[5] = M[5] + q[5], b[6] = M[6] + q[6], b[7] = M[7] + q[7], b[8] = M[8] + q[8], b;
              }
              function F(b, M, q) {
                return b[0] = M[0] - q[0], b[1] = M[1] - q[1], b[2] = M[2] - q[2], b[3] = M[3] - q[3], b[4] = M[4] - q[4], b[5] = M[5] - q[5], b[6] = M[6] - q[6], b[7] = M[7] - q[7], b[8] = M[8] - q[8], b;
              }
              function $(b, M, q) {
                return b[0] = M[0] * q, b[1] = M[1] * q, b[2] = M[2] * q, b[3] = M[3] * q, b[4] = M[4] * q, b[5] = M[5] * q, b[6] = M[6] * q, b[7] = M[7] * q, b[8] = M[8] * q, b;
              }
              function rr(b, M, q, Z) {
                return b[0] = M[0] + q[0] * Z, b[1] = M[1] + q[1] * Z, b[2] = M[2] + q[2] * Z, b[3] = M[3] + q[3] * Z, b[4] = M[4] + q[4] * Z, b[5] = M[5] + q[5] * Z, b[6] = M[6] + q[6] * Z, b[7] = M[7] + q[7] * Z, b[8] = M[8] + q[8] * Z, b;
              }
              function ir(b, M) {
                return b[0] === M[0] && b[1] === M[1] && b[2] === M[2] && b[3] === M[3] && b[4] === M[4] && b[5] === M[5] && b[6] === M[6] && b[7] === M[7] && b[8] === M[8];
              }
              function vr(b, M) {
                var q = b[0], Z = b[1], V = b[2], Q = b[3], K = b[4], fr = b[5], or = b[6], N = b[7], H = b[8], J = M[0], ar = M[1], cr = M[2], e = M[3], p = M[4], X = M[5], G = M[6], x = M[7], nr = M[8];
                return Math.abs(q - J) <= u.EPSILON * Math.max(1, Math.abs(q), Math.abs(J)) && Math.abs(Z - ar) <= u.EPSILON * Math.max(1, Math.abs(Z), Math.abs(ar)) && Math.abs(V - cr) <= u.EPSILON * Math.max(1, Math.abs(V), Math.abs(cr)) && Math.abs(Q - e) <= u.EPSILON * Math.max(1, Math.abs(Q), Math.abs(e)) && Math.abs(K - p) <= u.EPSILON * Math.max(1, Math.abs(K), Math.abs(p)) && Math.abs(fr - X) <= u.EPSILON * Math.max(1, Math.abs(fr), Math.abs(X)) && Math.abs(or - G) <= u.EPSILON * Math.max(1, Math.abs(or), Math.abs(G)) && Math.abs(N - x) <= u.EPSILON * Math.max(1, Math.abs(N), Math.abs(x)) && Math.abs(H - nr) <= u.EPSILON * Math.max(1, Math.abs(H), Math.abs(nr));
              }
              r.mul = L, r.sub = F;
            },
            /* 2 */
            /***/
            function(t, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.forEach = r.sqrLen = r.len = r.sqrDist = r.dist = r.div = r.mul = r.sub = void 0, r.create = h, r.clone = S, r.length = m, r.fromValues = d, r.copy = g, r.set = P, r.add = E, r.subtract = z, r.multiply = y, r.divide = v, r.ceil = R, r.floor = L, r.min = I, r.max = l, r.round = w, r.scale = O, r.scaleAndAdd = j, r.distance = Y, r.squaredDistance = W, r.squaredLength = er, r.negate = mr, r.inverse = Mr, r.normalize = dr, r.dot = U, r.cross = _, r.lerp = F, r.hermite = $, r.bezier = rr, r.random = ir, r.transformMat4 = vr, r.transformMat3 = b, r.transformQuat = M, r.rotateX = q, r.rotateY = Z, r.rotateZ = V, r.angle = Q, r.str = K, r.exactEquals = fr, r.equals = or;
              var c = i(0), u = o(c);
              function o(N) {
                if (N && N.__esModule)
                  return N;
                var H = {};
                if (N != null)
                  for (var J in N)
                    Object.prototype.hasOwnProperty.call(N, J) && (H[J] = N[J]);
                return H.default = N, H;
              }
              function h() {
                var N = new u.ARRAY_TYPE(3);
                return N[0] = 0, N[1] = 0, N[2] = 0, N;
              }
              function S(N) {
                var H = new u.ARRAY_TYPE(3);
                return H[0] = N[0], H[1] = N[1], H[2] = N[2], H;
              }
              function m(N) {
                var H = N[0], J = N[1], ar = N[2];
                return Math.sqrt(H * H + J * J + ar * ar);
              }
              function d(N, H, J) {
                var ar = new u.ARRAY_TYPE(3);
                return ar[0] = N, ar[1] = H, ar[2] = J, ar;
              }
              function g(N, H) {
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
              function y(N, H, J) {
                return N[0] = H[0] * J[0], N[1] = H[1] * J[1], N[2] = H[2] * J[2], N;
              }
              function v(N, H, J) {
                return N[0] = H[0] / J[0], N[1] = H[1] / J[1], N[2] = H[2] / J[2], N;
              }
              function R(N, H) {
                return N[0] = Math.ceil(H[0]), N[1] = Math.ceil(H[1]), N[2] = Math.ceil(H[2]), N;
              }
              function L(N, H) {
                return N[0] = Math.floor(H[0]), N[1] = Math.floor(H[1]), N[2] = Math.floor(H[2]), N;
              }
              function I(N, H, J) {
                return N[0] = Math.min(H[0], J[0]), N[1] = Math.min(H[1], J[1]), N[2] = Math.min(H[2], J[2]), N;
              }
              function l(N, H, J) {
                return N[0] = Math.max(H[0], J[0]), N[1] = Math.max(H[1], J[1]), N[2] = Math.max(H[2], J[2]), N;
              }
              function w(N, H) {
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
              function Mr(N, H) {
                return N[0] = 1 / H[0], N[1] = 1 / H[1], N[2] = 1 / H[2], N;
              }
              function dr(N, H) {
                var J = H[0], ar = H[1], cr = H[2], e = J * J + ar * ar + cr * cr;
                return e > 0 && (e = 1 / Math.sqrt(e), N[0] = H[0] * e, N[1] = H[1] * e, N[2] = H[2] * e), N;
              }
              function U(N, H) {
                return N[0] * H[0] + N[1] * H[1] + N[2] * H[2];
              }
              function _(N, H, J) {
                var ar = H[0], cr = H[1], e = H[2], p = J[0], X = J[1], G = J[2];
                return N[0] = cr * G - e * X, N[1] = e * p - ar * G, N[2] = ar * X - cr * p, N;
              }
              function F(N, H, J, ar) {
                var cr = H[0], e = H[1], p = H[2];
                return N[0] = cr + ar * (J[0] - cr), N[1] = e + ar * (J[1] - e), N[2] = p + ar * (J[2] - p), N;
              }
              function $(N, H, J, ar, cr, e) {
                var p = e * e, X = p * (2 * e - 3) + 1, G = p * (e - 2) + e, x = p * (e - 1), nr = p * (3 - 2 * e);
                return N[0] = H[0] * X + J[0] * G + ar[0] * x + cr[0] * nr, N[1] = H[1] * X + J[1] * G + ar[1] * x + cr[1] * nr, N[2] = H[2] * X + J[2] * G + ar[2] * x + cr[2] * nr, N;
              }
              function rr(N, H, J, ar, cr, e) {
                var p = 1 - e, X = p * p, G = e * e, x = X * p, nr = 3 * e * X, tr = 3 * G * p, sr = G * e;
                return N[0] = H[0] * x + J[0] * nr + ar[0] * tr + cr[0] * sr, N[1] = H[1] * x + J[1] * nr + ar[1] * tr + cr[1] * sr, N[2] = H[2] * x + J[2] * nr + ar[2] * tr + cr[2] * sr, N;
              }
              function ir(N, H) {
                H = H || 1;
                var J = u.RANDOM() * 2 * Math.PI, ar = u.RANDOM() * 2 - 1, cr = Math.sqrt(1 - ar * ar) * H;
                return N[0] = Math.cos(J) * cr, N[1] = Math.sin(J) * cr, N[2] = ar * H, N;
              }
              function vr(N, H, J) {
                var ar = H[0], cr = H[1], e = H[2], p = J[3] * ar + J[7] * cr + J[11] * e + J[15];
                return p = p || 1, N[0] = (J[0] * ar + J[4] * cr + J[8] * e + J[12]) / p, N[1] = (J[1] * ar + J[5] * cr + J[9] * e + J[13]) / p, N[2] = (J[2] * ar + J[6] * cr + J[10] * e + J[14]) / p, N;
              }
              function b(N, H, J) {
                var ar = H[0], cr = H[1], e = H[2];
                return N[0] = ar * J[0] + cr * J[3] + e * J[6], N[1] = ar * J[1] + cr * J[4] + e * J[7], N[2] = ar * J[2] + cr * J[5] + e * J[8], N;
              }
              function M(N, H, J) {
                var ar = H[0], cr = H[1], e = H[2], p = J[0], X = J[1], G = J[2], x = J[3], nr = x * ar + X * e - G * cr, tr = x * cr + G * ar - p * e, sr = x * e + p * cr - X * ar, ur = -p * ar - X * cr - G * e;
                return N[0] = nr * x + ur * -p + tr * -G - sr * -X, N[1] = tr * x + ur * -X + sr * -p - nr * -G, N[2] = sr * x + ur * -G + nr * -X - tr * -p, N;
              }
              function q(N, H, J, ar) {
                var cr = [], e = [];
                return cr[0] = H[0] - J[0], cr[1] = H[1] - J[1], cr[2] = H[2] - J[2], e[0] = cr[0], e[1] = cr[1] * Math.cos(ar) - cr[2] * Math.sin(ar), e[2] = cr[1] * Math.sin(ar) + cr[2] * Math.cos(ar), N[0] = e[0] + J[0], N[1] = e[1] + J[1], N[2] = e[2] + J[2], N;
              }
              function Z(N, H, J, ar) {
                var cr = [], e = [];
                return cr[0] = H[0] - J[0], cr[1] = H[1] - J[1], cr[2] = H[2] - J[2], e[0] = cr[2] * Math.sin(ar) + cr[0] * Math.cos(ar), e[1] = cr[1], e[2] = cr[2] * Math.cos(ar) - cr[0] * Math.sin(ar), N[0] = e[0] + J[0], N[1] = e[1] + J[1], N[2] = e[2] + J[2], N;
              }
              function V(N, H, J, ar) {
                var cr = [], e = [];
                return cr[0] = H[0] - J[0], cr[1] = H[1] - J[1], cr[2] = H[2] - J[2], e[0] = cr[0] * Math.cos(ar) - cr[1] * Math.sin(ar), e[1] = cr[0] * Math.sin(ar) + cr[1] * Math.cos(ar), e[2] = cr[2], N[0] = e[0] + J[0], N[1] = e[1] + J[1], N[2] = e[2] + J[2], N;
              }
              function Q(N, H) {
                var J = d(N[0], N[1], N[2]), ar = d(H[0], H[1], H[2]);
                dr(J, J), dr(ar, ar);
                var cr = U(J, ar);
                return cr > 1 ? 0 : cr < -1 ? Math.PI : Math.acos(cr);
              }
              function K(N) {
                return "vec3(" + N[0] + ", " + N[1] + ", " + N[2] + ")";
              }
              function fr(N, H) {
                return N[0] === H[0] && N[1] === H[1] && N[2] === H[2];
              }
              function or(N, H) {
                var J = N[0], ar = N[1], cr = N[2], e = H[0], p = H[1], X = H[2];
                return Math.abs(J - e) <= u.EPSILON * Math.max(1, Math.abs(J), Math.abs(e)) && Math.abs(ar - p) <= u.EPSILON * Math.max(1, Math.abs(ar), Math.abs(p)) && Math.abs(cr - X) <= u.EPSILON * Math.max(1, Math.abs(cr), Math.abs(X));
              }
              r.sub = z, r.mul = y, r.div = v, r.dist = Y, r.sqrDist = W, r.len = m, r.sqrLen = er, r.forEach = (function() {
                var N = h();
                return function(H, J, ar, cr, e, p) {
                  var X = void 0, G = void 0;
                  for (J || (J = 3), ar || (ar = 0), cr ? G = Math.min(cr * J + ar, H.length) : G = H.length, X = ar; X < G; X += J)
                    N[0] = H[X], N[1] = H[X + 1], N[2] = H[X + 2], e(N, N, p), H[X] = N[0], H[X + 1] = N[1], H[X + 2] = N[2];
                  return H;
                };
              })();
            },
            /* 3 */
            /***/
            function(t, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.forEach = r.sqrLen = r.len = r.sqrDist = r.dist = r.div = r.mul = r.sub = void 0, r.create = h, r.clone = S, r.fromValues = m, r.copy = d, r.set = g, r.add = P, r.subtract = E, r.multiply = z, r.divide = y, r.ceil = v, r.floor = R, r.min = L, r.max = I, r.round = l, r.scale = w, r.scaleAndAdd = O, r.distance = j, r.squaredDistance = Y, r.length = W, r.squaredLength = er, r.negate = mr, r.inverse = Mr, r.normalize = dr, r.dot = U, r.lerp = _, r.random = F, r.transformMat4 = $, r.transformQuat = rr, r.str = ir, r.exactEquals = vr, r.equals = b;
              var c = i(0), u = o(c);
              function o(M) {
                if (M && M.__esModule)
                  return M;
                var q = {};
                if (M != null)
                  for (var Z in M)
                    Object.prototype.hasOwnProperty.call(M, Z) && (q[Z] = M[Z]);
                return q.default = M, q;
              }
              function h() {
                var M = new u.ARRAY_TYPE(4);
                return M[0] = 0, M[1] = 0, M[2] = 0, M[3] = 0, M;
              }
              function S(M) {
                var q = new u.ARRAY_TYPE(4);
                return q[0] = M[0], q[1] = M[1], q[2] = M[2], q[3] = M[3], q;
              }
              function m(M, q, Z, V) {
                var Q = new u.ARRAY_TYPE(4);
                return Q[0] = M, Q[1] = q, Q[2] = Z, Q[3] = V, Q;
              }
              function d(M, q) {
                return M[0] = q[0], M[1] = q[1], M[2] = q[2], M[3] = q[3], M;
              }
              function g(M, q, Z, V, Q) {
                return M[0] = q, M[1] = Z, M[2] = V, M[3] = Q, M;
              }
              function P(M, q, Z) {
                return M[0] = q[0] + Z[0], M[1] = q[1] + Z[1], M[2] = q[2] + Z[2], M[3] = q[3] + Z[3], M;
              }
              function E(M, q, Z) {
                return M[0] = q[0] - Z[0], M[1] = q[1] - Z[1], M[2] = q[2] - Z[2], M[3] = q[3] - Z[3], M;
              }
              function z(M, q, Z) {
                return M[0] = q[0] * Z[0], M[1] = q[1] * Z[1], M[2] = q[2] * Z[2], M[3] = q[3] * Z[3], M;
              }
              function y(M, q, Z) {
                return M[0] = q[0] / Z[0], M[1] = q[1] / Z[1], M[2] = q[2] / Z[2], M[3] = q[3] / Z[3], M;
              }
              function v(M, q) {
                return M[0] = Math.ceil(q[0]), M[1] = Math.ceil(q[1]), M[2] = Math.ceil(q[2]), M[3] = Math.ceil(q[3]), M;
              }
              function R(M, q) {
                return M[0] = Math.floor(q[0]), M[1] = Math.floor(q[1]), M[2] = Math.floor(q[2]), M[3] = Math.floor(q[3]), M;
              }
              function L(M, q, Z) {
                return M[0] = Math.min(q[0], Z[0]), M[1] = Math.min(q[1], Z[1]), M[2] = Math.min(q[2], Z[2]), M[3] = Math.min(q[3], Z[3]), M;
              }
              function I(M, q, Z) {
                return M[0] = Math.max(q[0], Z[0]), M[1] = Math.max(q[1], Z[1]), M[2] = Math.max(q[2], Z[2]), M[3] = Math.max(q[3], Z[3]), M;
              }
              function l(M, q) {
                return M[0] = Math.round(q[0]), M[1] = Math.round(q[1]), M[2] = Math.round(q[2]), M[3] = Math.round(q[3]), M;
              }
              function w(M, q, Z) {
                return M[0] = q[0] * Z, M[1] = q[1] * Z, M[2] = q[2] * Z, M[3] = q[3] * Z, M;
              }
              function O(M, q, Z, V) {
                return M[0] = q[0] + Z[0] * V, M[1] = q[1] + Z[1] * V, M[2] = q[2] + Z[2] * V, M[3] = q[3] + Z[3] * V, M;
              }
              function j(M, q) {
                var Z = q[0] - M[0], V = q[1] - M[1], Q = q[2] - M[2], K = q[3] - M[3];
                return Math.sqrt(Z * Z + V * V + Q * Q + K * K);
              }
              function Y(M, q) {
                var Z = q[0] - M[0], V = q[1] - M[1], Q = q[2] - M[2], K = q[3] - M[3];
                return Z * Z + V * V + Q * Q + K * K;
              }
              function W(M) {
                var q = M[0], Z = M[1], V = M[2], Q = M[3];
                return Math.sqrt(q * q + Z * Z + V * V + Q * Q);
              }
              function er(M) {
                var q = M[0], Z = M[1], V = M[2], Q = M[3];
                return q * q + Z * Z + V * V + Q * Q;
              }
              function mr(M, q) {
                return M[0] = -q[0], M[1] = -q[1], M[2] = -q[2], M[3] = -q[3], M;
              }
              function Mr(M, q) {
                return M[0] = 1 / q[0], M[1] = 1 / q[1], M[2] = 1 / q[2], M[3] = 1 / q[3], M;
              }
              function dr(M, q) {
                var Z = q[0], V = q[1], Q = q[2], K = q[3], fr = Z * Z + V * V + Q * Q + K * K;
                return fr > 0 && (fr = 1 / Math.sqrt(fr), M[0] = Z * fr, M[1] = V * fr, M[2] = Q * fr, M[3] = K * fr), M;
              }
              function U(M, q) {
                return M[0] * q[0] + M[1] * q[1] + M[2] * q[2] + M[3] * q[3];
              }
              function _(M, q, Z, V) {
                var Q = q[0], K = q[1], fr = q[2], or = q[3];
                return M[0] = Q + V * (Z[0] - Q), M[1] = K + V * (Z[1] - K), M[2] = fr + V * (Z[2] - fr), M[3] = or + V * (Z[3] - or), M;
              }
              function F(M, q) {
                return q = q || 1, M[0] = u.RANDOM(), M[1] = u.RANDOM(), M[2] = u.RANDOM(), M[3] = u.RANDOM(), dr(M, M), w(M, M, q), M;
              }
              function $(M, q, Z) {
                var V = q[0], Q = q[1], K = q[2], fr = q[3];
                return M[0] = Z[0] * V + Z[4] * Q + Z[8] * K + Z[12] * fr, M[1] = Z[1] * V + Z[5] * Q + Z[9] * K + Z[13] * fr, M[2] = Z[2] * V + Z[6] * Q + Z[10] * K + Z[14] * fr, M[3] = Z[3] * V + Z[7] * Q + Z[11] * K + Z[15] * fr, M;
              }
              function rr(M, q, Z) {
                var V = q[0], Q = q[1], K = q[2], fr = Z[0], or = Z[1], N = Z[2], H = Z[3], J = H * V + or * K - N * Q, ar = H * Q + N * V - fr * K, cr = H * K + fr * Q - or * V, e = -fr * V - or * Q - N * K;
                return M[0] = J * H + e * -fr + ar * -N - cr * -or, M[1] = ar * H + e * -or + cr * -fr - J * -N, M[2] = cr * H + e * -N + J * -or - ar * -fr, M[3] = q[3], M;
              }
              function ir(M) {
                return "vec4(" + M[0] + ", " + M[1] + ", " + M[2] + ", " + M[3] + ")";
              }
              function vr(M, q) {
                return M[0] === q[0] && M[1] === q[1] && M[2] === q[2] && M[3] === q[3];
              }
              function b(M, q) {
                var Z = M[0], V = M[1], Q = M[2], K = M[3], fr = q[0], or = q[1], N = q[2], H = q[3];
                return Math.abs(Z - fr) <= u.EPSILON * Math.max(1, Math.abs(Z), Math.abs(fr)) && Math.abs(V - or) <= u.EPSILON * Math.max(1, Math.abs(V), Math.abs(or)) && Math.abs(Q - N) <= u.EPSILON * Math.max(1, Math.abs(Q), Math.abs(N)) && Math.abs(K - H) <= u.EPSILON * Math.max(1, Math.abs(K), Math.abs(H));
              }
              r.sub = E, r.mul = z, r.div = y, r.dist = j, r.sqrDist = Y, r.len = W, r.sqrLen = er, r.forEach = (function() {
                var M = h();
                return function(q, Z, V, Q, K, fr) {
                  var or = void 0, N = void 0;
                  for (Z || (Z = 4), V || (V = 0), Q ? N = Math.min(Q * Z + V, q.length) : N = q.length, or = V; or < N; or += Z)
                    M[0] = q[or], M[1] = q[or + 1], M[2] = q[or + 2], M[3] = q[or + 3], K(M, M, fr), q[or] = M[0], q[or + 1] = M[1], q[or + 2] = M[2], q[or + 3] = M[3];
                  return q;
                };
              })();
            },
            /* 4 */
            /***/
            function(t, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.vec4 = r.vec3 = r.vec2 = r.quat = r.mat4 = r.mat3 = r.mat2d = r.mat2 = r.glMatrix = void 0;
              var c = i(0), u = O(c), o = i(5), h = O(o), S = i(6), m = O(S), d = i(1), g = O(d), P = i(7), E = O(P), z = i(8), y = O(z), v = i(9), R = O(v), L = i(2), I = O(L), l = i(3), w = O(l);
              function O(j) {
                if (j && j.__esModule)
                  return j;
                var Y = {};
                if (j != null)
                  for (var W in j)
                    Object.prototype.hasOwnProperty.call(j, W) && (Y[W] = j[W]);
                return Y.default = j, Y;
              }
              r.glMatrix = u, r.mat2 = h, r.mat2d = m, r.mat3 = g, r.mat4 = E, r.quat = y, r.vec2 = R, r.vec3 = I, r.vec4 = w;
            },
            /* 5 */
            /***/
            function(t, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = h, r.clone = S, r.copy = m, r.identity = d, r.fromValues = g, r.set = P, r.transpose = E, r.invert = z, r.adjoint = y, r.determinant = v, r.multiply = R, r.rotate = L, r.scale = I, r.fromRotation = l, r.fromScaling = w, r.str = O, r.frob = j, r.LDU = Y, r.add = W, r.subtract = er, r.exactEquals = mr, r.equals = Mr, r.multiplyScalar = dr, r.multiplyScalarAndAdd = U;
              var c = i(0), u = o(c);
              function o(_) {
                if (_ && _.__esModule)
                  return _;
                var F = {};
                if (_ != null)
                  for (var $ in _)
                    Object.prototype.hasOwnProperty.call(_, $) && (F[$] = _[$]);
                return F.default = _, F;
              }
              function h() {
                var _ = new u.ARRAY_TYPE(4);
                return _[0] = 1, _[1] = 0, _[2] = 0, _[3] = 1, _;
              }
              function S(_) {
                var F = new u.ARRAY_TYPE(4);
                return F[0] = _[0], F[1] = _[1], F[2] = _[2], F[3] = _[3], F;
              }
              function m(_, F) {
                return _[0] = F[0], _[1] = F[1], _[2] = F[2], _[3] = F[3], _;
              }
              function d(_) {
                return _[0] = 1, _[1] = 0, _[2] = 0, _[3] = 1, _;
              }
              function g(_, F, $, rr) {
                var ir = new u.ARRAY_TYPE(4);
                return ir[0] = _, ir[1] = F, ir[2] = $, ir[3] = rr, ir;
              }
              function P(_, F, $, rr, ir) {
                return _[0] = F, _[1] = $, _[2] = rr, _[3] = ir, _;
              }
              function E(_, F) {
                if (_ === F) {
                  var $ = F[1];
                  _[1] = F[2], _[2] = $;
                } else
                  _[0] = F[0], _[1] = F[2], _[2] = F[1], _[3] = F[3];
                return _;
              }
              function z(_, F) {
                var $ = F[0], rr = F[1], ir = F[2], vr = F[3], b = $ * vr - ir * rr;
                return b ? (b = 1 / b, _[0] = vr * b, _[1] = -rr * b, _[2] = -ir * b, _[3] = $ * b, _) : null;
              }
              function y(_, F) {
                var $ = F[0];
                return _[0] = F[3], _[1] = -F[1], _[2] = -F[2], _[3] = $, _;
              }
              function v(_) {
                return _[0] * _[3] - _[2] * _[1];
              }
              function R(_, F, $) {
                var rr = F[0], ir = F[1], vr = F[2], b = F[3], M = $[0], q = $[1], Z = $[2], V = $[3];
                return _[0] = rr * M + vr * q, _[1] = ir * M + b * q, _[2] = rr * Z + vr * V, _[3] = ir * Z + b * V, _;
              }
              function L(_, F, $) {
                var rr = F[0], ir = F[1], vr = F[2], b = F[3], M = Math.sin($), q = Math.cos($);
                return _[0] = rr * q + vr * M, _[1] = ir * q + b * M, _[2] = rr * -M + vr * q, _[3] = ir * -M + b * q, _;
              }
              function I(_, F, $) {
                var rr = F[0], ir = F[1], vr = F[2], b = F[3], M = $[0], q = $[1];
                return _[0] = rr * M, _[1] = ir * M, _[2] = vr * q, _[3] = b * q, _;
              }
              function l(_, F) {
                var $ = Math.sin(F), rr = Math.cos(F);
                return _[0] = rr, _[1] = $, _[2] = -$, _[3] = rr, _;
              }
              function w(_, F) {
                return _[0] = F[0], _[1] = 0, _[2] = 0, _[3] = F[1], _;
              }
              function O(_) {
                return "mat2(" + _[0] + ", " + _[1] + ", " + _[2] + ", " + _[3] + ")";
              }
              function j(_) {
                return Math.sqrt(Math.pow(_[0], 2) + Math.pow(_[1], 2) + Math.pow(_[2], 2) + Math.pow(_[3], 2));
              }
              function Y(_, F, $, rr) {
                return _[2] = rr[2] / rr[0], $[0] = rr[0], $[1] = rr[1], $[3] = rr[3] - _[2] * $[1], [_, F, $];
              }
              function W(_, F, $) {
                return _[0] = F[0] + $[0], _[1] = F[1] + $[1], _[2] = F[2] + $[2], _[3] = F[3] + $[3], _;
              }
              function er(_, F, $) {
                return _[0] = F[0] - $[0], _[1] = F[1] - $[1], _[2] = F[2] - $[2], _[3] = F[3] - $[3], _;
              }
              function mr(_, F) {
                return _[0] === F[0] && _[1] === F[1] && _[2] === F[2] && _[3] === F[3];
              }
              function Mr(_, F) {
                var $ = _[0], rr = _[1], ir = _[2], vr = _[3], b = F[0], M = F[1], q = F[2], Z = F[3];
                return Math.abs($ - b) <= u.EPSILON * Math.max(1, Math.abs($), Math.abs(b)) && Math.abs(rr - M) <= u.EPSILON * Math.max(1, Math.abs(rr), Math.abs(M)) && Math.abs(ir - q) <= u.EPSILON * Math.max(1, Math.abs(ir), Math.abs(q)) && Math.abs(vr - Z) <= u.EPSILON * Math.max(1, Math.abs(vr), Math.abs(Z));
              }
              function dr(_, F, $) {
                return _[0] = F[0] * $, _[1] = F[1] * $, _[2] = F[2] * $, _[3] = F[3] * $, _;
              }
              function U(_, F, $, rr) {
                return _[0] = F[0] + $[0] * rr, _[1] = F[1] + $[1] * rr, _[2] = F[2] + $[2] * rr, _[3] = F[3] + $[3] * rr, _;
              }
              r.mul = R, r.sub = er;
            },
            /* 6 */
            /***/
            function(t, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = h, r.clone = S, r.copy = m, r.identity = d, r.fromValues = g, r.set = P, r.invert = E, r.determinant = z, r.multiply = y, r.rotate = v, r.scale = R, r.translate = L, r.fromRotation = I, r.fromScaling = l, r.fromTranslation = w, r.str = O, r.frob = j, r.add = Y, r.subtract = W, r.multiplyScalar = er, r.multiplyScalarAndAdd = mr, r.exactEquals = Mr, r.equals = dr;
              var c = i(0), u = o(c);
              function o(U) {
                if (U && U.__esModule)
                  return U;
                var _ = {};
                if (U != null)
                  for (var F in U)
                    Object.prototype.hasOwnProperty.call(U, F) && (_[F] = U[F]);
                return _.default = U, _;
              }
              function h() {
                var U = new u.ARRAY_TYPE(6);
                return U[0] = 1, U[1] = 0, U[2] = 0, U[3] = 1, U[4] = 0, U[5] = 0, U;
              }
              function S(U) {
                var _ = new u.ARRAY_TYPE(6);
                return _[0] = U[0], _[1] = U[1], _[2] = U[2], _[3] = U[3], _[4] = U[4], _[5] = U[5], _;
              }
              function m(U, _) {
                return U[0] = _[0], U[1] = _[1], U[2] = _[2], U[3] = _[3], U[4] = _[4], U[5] = _[5], U;
              }
              function d(U) {
                return U[0] = 1, U[1] = 0, U[2] = 0, U[3] = 1, U[4] = 0, U[5] = 0, U;
              }
              function g(U, _, F, $, rr, ir) {
                var vr = new u.ARRAY_TYPE(6);
                return vr[0] = U, vr[1] = _, vr[2] = F, vr[3] = $, vr[4] = rr, vr[5] = ir, vr;
              }
              function P(U, _, F, $, rr, ir, vr) {
                return U[0] = _, U[1] = F, U[2] = $, U[3] = rr, U[4] = ir, U[5] = vr, U;
              }
              function E(U, _) {
                var F = _[0], $ = _[1], rr = _[2], ir = _[3], vr = _[4], b = _[5], M = F * ir - $ * rr;
                return M ? (M = 1 / M, U[0] = ir * M, U[1] = -$ * M, U[2] = -rr * M, U[3] = F * M, U[4] = (rr * b - ir * vr) * M, U[5] = ($ * vr - F * b) * M, U) : null;
              }
              function z(U) {
                return U[0] * U[3] - U[1] * U[2];
              }
              function y(U, _, F) {
                var $ = _[0], rr = _[1], ir = _[2], vr = _[3], b = _[4], M = _[5], q = F[0], Z = F[1], V = F[2], Q = F[3], K = F[4], fr = F[5];
                return U[0] = $ * q + ir * Z, U[1] = rr * q + vr * Z, U[2] = $ * V + ir * Q, U[3] = rr * V + vr * Q, U[4] = $ * K + ir * fr + b, U[5] = rr * K + vr * fr + M, U;
              }
              function v(U, _, F) {
                var $ = _[0], rr = _[1], ir = _[2], vr = _[3], b = _[4], M = _[5], q = Math.sin(F), Z = Math.cos(F);
                return U[0] = $ * Z + ir * q, U[1] = rr * Z + vr * q, U[2] = $ * -q + ir * Z, U[3] = rr * -q + vr * Z, U[4] = b, U[5] = M, U;
              }
              function R(U, _, F) {
                var $ = _[0], rr = _[1], ir = _[2], vr = _[3], b = _[4], M = _[5], q = F[0], Z = F[1];
                return U[0] = $ * q, U[1] = rr * q, U[2] = ir * Z, U[3] = vr * Z, U[4] = b, U[5] = M, U;
              }
              function L(U, _, F) {
                var $ = _[0], rr = _[1], ir = _[2], vr = _[3], b = _[4], M = _[5], q = F[0], Z = F[1];
                return U[0] = $, U[1] = rr, U[2] = ir, U[3] = vr, U[4] = $ * q + ir * Z + b, U[5] = rr * q + vr * Z + M, U;
              }
              function I(U, _) {
                var F = Math.sin(_), $ = Math.cos(_);
                return U[0] = $, U[1] = F, U[2] = -F, U[3] = $, U[4] = 0, U[5] = 0, U;
              }
              function l(U, _) {
                return U[0] = _[0], U[1] = 0, U[2] = 0, U[3] = _[1], U[4] = 0, U[5] = 0, U;
              }
              function w(U, _) {
                return U[0] = 1, U[1] = 0, U[2] = 0, U[3] = 1, U[4] = _[0], U[5] = _[1], U;
              }
              function O(U) {
                return "mat2d(" + U[0] + ", " + U[1] + ", " + U[2] + ", " + U[3] + ", " + U[4] + ", " + U[5] + ")";
              }
              function j(U) {
                return Math.sqrt(Math.pow(U[0], 2) + Math.pow(U[1], 2) + Math.pow(U[2], 2) + Math.pow(U[3], 2) + Math.pow(U[4], 2) + Math.pow(U[5], 2) + 1);
              }
              function Y(U, _, F) {
                return U[0] = _[0] + F[0], U[1] = _[1] + F[1], U[2] = _[2] + F[2], U[3] = _[3] + F[3], U[4] = _[4] + F[4], U[5] = _[5] + F[5], U;
              }
              function W(U, _, F) {
                return U[0] = _[0] - F[0], U[1] = _[1] - F[1], U[2] = _[2] - F[2], U[3] = _[3] - F[3], U[4] = _[4] - F[4], U[5] = _[5] - F[5], U;
              }
              function er(U, _, F) {
                return U[0] = _[0] * F, U[1] = _[1] * F, U[2] = _[2] * F, U[3] = _[3] * F, U[4] = _[4] * F, U[5] = _[5] * F, U;
              }
              function mr(U, _, F, $) {
                return U[0] = _[0] + F[0] * $, U[1] = _[1] + F[1] * $, U[2] = _[2] + F[2] * $, U[3] = _[3] + F[3] * $, U[4] = _[4] + F[4] * $, U[5] = _[5] + F[5] * $, U;
              }
              function Mr(U, _) {
                return U[0] === _[0] && U[1] === _[1] && U[2] === _[2] && U[3] === _[3] && U[4] === _[4] && U[5] === _[5];
              }
              function dr(U, _) {
                var F = U[0], $ = U[1], rr = U[2], ir = U[3], vr = U[4], b = U[5], M = _[0], q = _[1], Z = _[2], V = _[3], Q = _[4], K = _[5];
                return Math.abs(F - M) <= u.EPSILON * Math.max(1, Math.abs(F), Math.abs(M)) && Math.abs($ - q) <= u.EPSILON * Math.max(1, Math.abs($), Math.abs(q)) && Math.abs(rr - Z) <= u.EPSILON * Math.max(1, Math.abs(rr), Math.abs(Z)) && Math.abs(ir - V) <= u.EPSILON * Math.max(1, Math.abs(ir), Math.abs(V)) && Math.abs(vr - Q) <= u.EPSILON * Math.max(1, Math.abs(vr), Math.abs(Q)) && Math.abs(b - K) <= u.EPSILON * Math.max(1, Math.abs(b), Math.abs(K));
              }
              r.mul = y, r.sub = W;
            },
            /* 7 */
            /***/
            function(t, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.sub = r.mul = void 0, r.create = h, r.clone = S, r.copy = m, r.fromValues = d, r.set = g, r.identity = P, r.transpose = E, r.invert = z, r.adjoint = y, r.determinant = v, r.multiply = R, r.translate = L, r.scale = I, r.rotate = l, r.rotateX = w, r.rotateY = O, r.rotateZ = j, r.fromTranslation = Y, r.fromScaling = W, r.fromRotation = er, r.fromXRotation = mr, r.fromYRotation = Mr, r.fromZRotation = dr, r.fromRotationTranslation = U, r.getTranslation = _, r.getScaling = F, r.getRotation = $, r.fromRotationTranslationScale = rr, r.fromRotationTranslationScaleOrigin = ir, r.fromQuat = vr, r.frustum = b, r.perspective = M, r.perspectiveFromFieldOfView = q, r.ortho = Z, r.lookAt = V, r.targetTo = Q, r.str = K, r.frob = fr, r.add = or, r.subtract = N, r.multiplyScalar = H, r.multiplyScalarAndAdd = J, r.exactEquals = ar, r.equals = cr;
              var c = i(0), u = o(c);
              function o(e) {
                if (e && e.__esModule)
                  return e;
                var p = {};
                if (e != null)
                  for (var X in e)
                    Object.prototype.hasOwnProperty.call(e, X) && (p[X] = e[X]);
                return p.default = e, p;
              }
              function h() {
                var e = new u.ARRAY_TYPE(16);
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function S(e) {
                var p = new u.ARRAY_TYPE(16);
                return p[0] = e[0], p[1] = e[1], p[2] = e[2], p[3] = e[3], p[4] = e[4], p[5] = e[5], p[6] = e[6], p[7] = e[7], p[8] = e[8], p[9] = e[9], p[10] = e[10], p[11] = e[11], p[12] = e[12], p[13] = e[13], p[14] = e[14], p[15] = e[15], p;
              }
              function m(e, p) {
                return e[0] = p[0], e[1] = p[1], e[2] = p[2], e[3] = p[3], e[4] = p[4], e[5] = p[5], e[6] = p[6], e[7] = p[7], e[8] = p[8], e[9] = p[9], e[10] = p[10], e[11] = p[11], e[12] = p[12], e[13] = p[13], e[14] = p[14], e[15] = p[15], e;
              }
              function d(e, p, X, G, x, nr, tr, sr, ur, lr, yr, pr, gr, wr, _r, Sr) {
                var hr = new u.ARRAY_TYPE(16);
                return hr[0] = e, hr[1] = p, hr[2] = X, hr[3] = G, hr[4] = x, hr[5] = nr, hr[6] = tr, hr[7] = sr, hr[8] = ur, hr[9] = lr, hr[10] = yr, hr[11] = pr, hr[12] = gr, hr[13] = wr, hr[14] = _r, hr[15] = Sr, hr;
              }
              function g(e, p, X, G, x, nr, tr, sr, ur, lr, yr, pr, gr, wr, _r, Sr, hr) {
                return e[0] = p, e[1] = X, e[2] = G, e[3] = x, e[4] = nr, e[5] = tr, e[6] = sr, e[7] = ur, e[8] = lr, e[9] = yr, e[10] = pr, e[11] = gr, e[12] = wr, e[13] = _r, e[14] = Sr, e[15] = hr, e;
              }
              function P(e) {
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function E(e, p) {
                if (e === p) {
                  var X = p[1], G = p[2], x = p[3], nr = p[6], tr = p[7], sr = p[11];
                  e[1] = p[4], e[2] = p[8], e[3] = p[12], e[4] = X, e[6] = p[9], e[7] = p[13], e[8] = G, e[9] = nr, e[11] = p[14], e[12] = x, e[13] = tr, e[14] = sr;
                } else
                  e[0] = p[0], e[1] = p[4], e[2] = p[8], e[3] = p[12], e[4] = p[1], e[5] = p[5], e[6] = p[9], e[7] = p[13], e[8] = p[2], e[9] = p[6], e[10] = p[10], e[11] = p[14], e[12] = p[3], e[13] = p[7], e[14] = p[11], e[15] = p[15];
                return e;
              }
              function z(e, p) {
                var X = p[0], G = p[1], x = p[2], nr = p[3], tr = p[4], sr = p[5], ur = p[6], lr = p[7], yr = p[8], pr = p[9], gr = p[10], wr = p[11], _r = p[12], Sr = p[13], hr = p[14], br = p[15], Dr = X * sr - G * tr, Ar = X * ur - x * tr, Rr = X * lr - nr * tr, Tr = G * ur - x * sr, Pr = G * lr - nr * sr, Or = x * lr - nr * ur, Lr = yr * Sr - pr * _r, qr = yr * hr - gr * _r, jr = yr * br - wr * _r, kr = pr * hr - gr * Sr, zr = pr * br - wr * Sr, Nr = gr * br - wr * hr, Er = Dr * Nr - Ar * zr + Rr * kr + Tr * jr - Pr * qr + Or * Lr;
                return Er ? (Er = 1 / Er, e[0] = (sr * Nr - ur * zr + lr * kr) * Er, e[1] = (x * zr - G * Nr - nr * kr) * Er, e[2] = (Sr * Or - hr * Pr + br * Tr) * Er, e[3] = (gr * Pr - pr * Or - wr * Tr) * Er, e[4] = (ur * jr - tr * Nr - lr * qr) * Er, e[5] = (X * Nr - x * jr + nr * qr) * Er, e[6] = (hr * Rr - _r * Or - br * Ar) * Er, e[7] = (yr * Or - gr * Rr + wr * Ar) * Er, e[8] = (tr * zr - sr * jr + lr * Lr) * Er, e[9] = (G * jr - X * zr - nr * Lr) * Er, e[10] = (_r * Pr - Sr * Rr + br * Dr) * Er, e[11] = (pr * Rr - yr * Pr - wr * Dr) * Er, e[12] = (sr * qr - tr * kr - ur * Lr) * Er, e[13] = (X * kr - G * qr + x * Lr) * Er, e[14] = (Sr * Ar - _r * Tr - hr * Dr) * Er, e[15] = (yr * Tr - pr * Ar + gr * Dr) * Er, e) : null;
              }
              function y(e, p) {
                var X = p[0], G = p[1], x = p[2], nr = p[3], tr = p[4], sr = p[5], ur = p[6], lr = p[7], yr = p[8], pr = p[9], gr = p[10], wr = p[11], _r = p[12], Sr = p[13], hr = p[14], br = p[15];
                return e[0] = sr * (gr * br - wr * hr) - pr * (ur * br - lr * hr) + Sr * (ur * wr - lr * gr), e[1] = -(G * (gr * br - wr * hr) - pr * (x * br - nr * hr) + Sr * (x * wr - nr * gr)), e[2] = G * (ur * br - lr * hr) - sr * (x * br - nr * hr) + Sr * (x * lr - nr * ur), e[3] = -(G * (ur * wr - lr * gr) - sr * (x * wr - nr * gr) + pr * (x * lr - nr * ur)), e[4] = -(tr * (gr * br - wr * hr) - yr * (ur * br - lr * hr) + _r * (ur * wr - lr * gr)), e[5] = X * (gr * br - wr * hr) - yr * (x * br - nr * hr) + _r * (x * wr - nr * gr), e[6] = -(X * (ur * br - lr * hr) - tr * (x * br - nr * hr) + _r * (x * lr - nr * ur)), e[7] = X * (ur * wr - lr * gr) - tr * (x * wr - nr * gr) + yr * (x * lr - nr * ur), e[8] = tr * (pr * br - wr * Sr) - yr * (sr * br - lr * Sr) + _r * (sr * wr - lr * pr), e[9] = -(X * (pr * br - wr * Sr) - yr * (G * br - nr * Sr) + _r * (G * wr - nr * pr)), e[10] = X * (sr * br - lr * Sr) - tr * (G * br - nr * Sr) + _r * (G * lr - nr * sr), e[11] = -(X * (sr * wr - lr * pr) - tr * (G * wr - nr * pr) + yr * (G * lr - nr * sr)), e[12] = -(tr * (pr * hr - gr * Sr) - yr * (sr * hr - ur * Sr) + _r * (sr * gr - ur * pr)), e[13] = X * (pr * hr - gr * Sr) - yr * (G * hr - x * Sr) + _r * (G * gr - x * pr), e[14] = -(X * (sr * hr - ur * Sr) - tr * (G * hr - x * Sr) + _r * (G * ur - x * sr)), e[15] = X * (sr * gr - ur * pr) - tr * (G * gr - x * pr) + yr * (G * ur - x * sr), e;
              }
              function v(e) {
                var p = e[0], X = e[1], G = e[2], x = e[3], nr = e[4], tr = e[5], sr = e[6], ur = e[7], lr = e[8], yr = e[9], pr = e[10], gr = e[11], wr = e[12], _r = e[13], Sr = e[14], hr = e[15], br = p * tr - X * nr, Dr = p * sr - G * nr, Ar = p * ur - x * nr, Rr = X * sr - G * tr, Tr = X * ur - x * tr, Pr = G * ur - x * sr, Or = lr * _r - yr * wr, Lr = lr * Sr - pr * wr, qr = lr * hr - gr * wr, jr = yr * Sr - pr * _r, kr = yr * hr - gr * _r, zr = pr * hr - gr * Sr;
                return br * zr - Dr * kr + Ar * jr + Rr * qr - Tr * Lr + Pr * Or;
              }
              function R(e, p, X) {
                var G = p[0], x = p[1], nr = p[2], tr = p[3], sr = p[4], ur = p[5], lr = p[6], yr = p[7], pr = p[8], gr = p[9], wr = p[10], _r = p[11], Sr = p[12], hr = p[13], br = p[14], Dr = p[15], Ar = X[0], Rr = X[1], Tr = X[2], Pr = X[3];
                return e[0] = Ar * G + Rr * sr + Tr * pr + Pr * Sr, e[1] = Ar * x + Rr * ur + Tr * gr + Pr * hr, e[2] = Ar * nr + Rr * lr + Tr * wr + Pr * br, e[3] = Ar * tr + Rr * yr + Tr * _r + Pr * Dr, Ar = X[4], Rr = X[5], Tr = X[6], Pr = X[7], e[4] = Ar * G + Rr * sr + Tr * pr + Pr * Sr, e[5] = Ar * x + Rr * ur + Tr * gr + Pr * hr, e[6] = Ar * nr + Rr * lr + Tr * wr + Pr * br, e[7] = Ar * tr + Rr * yr + Tr * _r + Pr * Dr, Ar = X[8], Rr = X[9], Tr = X[10], Pr = X[11], e[8] = Ar * G + Rr * sr + Tr * pr + Pr * Sr, e[9] = Ar * x + Rr * ur + Tr * gr + Pr * hr, e[10] = Ar * nr + Rr * lr + Tr * wr + Pr * br, e[11] = Ar * tr + Rr * yr + Tr * _r + Pr * Dr, Ar = X[12], Rr = X[13], Tr = X[14], Pr = X[15], e[12] = Ar * G + Rr * sr + Tr * pr + Pr * Sr, e[13] = Ar * x + Rr * ur + Tr * gr + Pr * hr, e[14] = Ar * nr + Rr * lr + Tr * wr + Pr * br, e[15] = Ar * tr + Rr * yr + Tr * _r + Pr * Dr, e;
              }
              function L(e, p, X) {
                var G = X[0], x = X[1], nr = X[2], tr = void 0, sr = void 0, ur = void 0, lr = void 0, yr = void 0, pr = void 0, gr = void 0, wr = void 0, _r = void 0, Sr = void 0, hr = void 0, br = void 0;
                return p === e ? (e[12] = p[0] * G + p[4] * x + p[8] * nr + p[12], e[13] = p[1] * G + p[5] * x + p[9] * nr + p[13], e[14] = p[2] * G + p[6] * x + p[10] * nr + p[14], e[15] = p[3] * G + p[7] * x + p[11] * nr + p[15]) : (tr = p[0], sr = p[1], ur = p[2], lr = p[3], yr = p[4], pr = p[5], gr = p[6], wr = p[7], _r = p[8], Sr = p[9], hr = p[10], br = p[11], e[0] = tr, e[1] = sr, e[2] = ur, e[3] = lr, e[4] = yr, e[5] = pr, e[6] = gr, e[7] = wr, e[8] = _r, e[9] = Sr, e[10] = hr, e[11] = br, e[12] = tr * G + yr * x + _r * nr + p[12], e[13] = sr * G + pr * x + Sr * nr + p[13], e[14] = ur * G + gr * x + hr * nr + p[14], e[15] = lr * G + wr * x + br * nr + p[15]), e;
              }
              function I(e, p, X) {
                var G = X[0], x = X[1], nr = X[2];
                return e[0] = p[0] * G, e[1] = p[1] * G, e[2] = p[2] * G, e[3] = p[3] * G, e[4] = p[4] * x, e[5] = p[5] * x, e[6] = p[6] * x, e[7] = p[7] * x, e[8] = p[8] * nr, e[9] = p[9] * nr, e[10] = p[10] * nr, e[11] = p[11] * nr, e[12] = p[12], e[13] = p[13], e[14] = p[14], e[15] = p[15], e;
              }
              function l(e, p, X, G) {
                var x = G[0], nr = G[1], tr = G[2], sr = Math.sqrt(x * x + nr * nr + tr * tr), ur = void 0, lr = void 0, yr = void 0, pr = void 0, gr = void 0, wr = void 0, _r = void 0, Sr = void 0, hr = void 0, br = void 0, Dr = void 0, Ar = void 0, Rr = void 0, Tr = void 0, Pr = void 0, Or = void 0, Lr = void 0, qr = void 0, jr = void 0, kr = void 0, zr = void 0, Nr = void 0, Er = void 0, Cr = void 0;
                return Math.abs(sr) < u.EPSILON ? null : (sr = 1 / sr, x *= sr, nr *= sr, tr *= sr, ur = Math.sin(X), lr = Math.cos(X), yr = 1 - lr, pr = p[0], gr = p[1], wr = p[2], _r = p[3], Sr = p[4], hr = p[5], br = p[6], Dr = p[7], Ar = p[8], Rr = p[9], Tr = p[10], Pr = p[11], Or = x * x * yr + lr, Lr = nr * x * yr + tr * ur, qr = tr * x * yr - nr * ur, jr = x * nr * yr - tr * ur, kr = nr * nr * yr + lr, zr = tr * nr * yr + x * ur, Nr = x * tr * yr + nr * ur, Er = nr * tr * yr - x * ur, Cr = tr * tr * yr + lr, e[0] = pr * Or + Sr * Lr + Ar * qr, e[1] = gr * Or + hr * Lr + Rr * qr, e[2] = wr * Or + br * Lr + Tr * qr, e[3] = _r * Or + Dr * Lr + Pr * qr, e[4] = pr * jr + Sr * kr + Ar * zr, e[5] = gr * jr + hr * kr + Rr * zr, e[6] = wr * jr + br * kr + Tr * zr, e[7] = _r * jr + Dr * kr + Pr * zr, e[8] = pr * Nr + Sr * Er + Ar * Cr, e[9] = gr * Nr + hr * Er + Rr * Cr, e[10] = wr * Nr + br * Er + Tr * Cr, e[11] = _r * Nr + Dr * Er + Pr * Cr, p !== e && (e[12] = p[12], e[13] = p[13], e[14] = p[14], e[15] = p[15]), e);
              }
              function w(e, p, X) {
                var G = Math.sin(X), x = Math.cos(X), nr = p[4], tr = p[5], sr = p[6], ur = p[7], lr = p[8], yr = p[9], pr = p[10], gr = p[11];
                return p !== e && (e[0] = p[0], e[1] = p[1], e[2] = p[2], e[3] = p[3], e[12] = p[12], e[13] = p[13], e[14] = p[14], e[15] = p[15]), e[4] = nr * x + lr * G, e[5] = tr * x + yr * G, e[6] = sr * x + pr * G, e[7] = ur * x + gr * G, e[8] = lr * x - nr * G, e[9] = yr * x - tr * G, e[10] = pr * x - sr * G, e[11] = gr * x - ur * G, e;
              }
              function O(e, p, X) {
                var G = Math.sin(X), x = Math.cos(X), nr = p[0], tr = p[1], sr = p[2], ur = p[3], lr = p[8], yr = p[9], pr = p[10], gr = p[11];
                return p !== e && (e[4] = p[4], e[5] = p[5], e[6] = p[6], e[7] = p[7], e[12] = p[12], e[13] = p[13], e[14] = p[14], e[15] = p[15]), e[0] = nr * x - lr * G, e[1] = tr * x - yr * G, e[2] = sr * x - pr * G, e[3] = ur * x - gr * G, e[8] = nr * G + lr * x, e[9] = tr * G + yr * x, e[10] = sr * G + pr * x, e[11] = ur * G + gr * x, e;
              }
              function j(e, p, X) {
                var G = Math.sin(X), x = Math.cos(X), nr = p[0], tr = p[1], sr = p[2], ur = p[3], lr = p[4], yr = p[5], pr = p[6], gr = p[7];
                return p !== e && (e[8] = p[8], e[9] = p[9], e[10] = p[10], e[11] = p[11], e[12] = p[12], e[13] = p[13], e[14] = p[14], e[15] = p[15]), e[0] = nr * x + lr * G, e[1] = tr * x + yr * G, e[2] = sr * x + pr * G, e[3] = ur * x + gr * G, e[4] = lr * x - nr * G, e[5] = yr * x - tr * G, e[6] = pr * x - sr * G, e[7] = gr * x - ur * G, e;
              }
              function Y(e, p) {
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = p[0], e[13] = p[1], e[14] = p[2], e[15] = 1, e;
              }
              function W(e, p) {
                return e[0] = p[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = p[1], e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = p[2], e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function er(e, p, X) {
                var G = X[0], x = X[1], nr = X[2], tr = Math.sqrt(G * G + x * x + nr * nr), sr = void 0, ur = void 0, lr = void 0;
                return Math.abs(tr) < u.EPSILON ? null : (tr = 1 / tr, G *= tr, x *= tr, nr *= tr, sr = Math.sin(p), ur = Math.cos(p), lr = 1 - ur, e[0] = G * G * lr + ur, e[1] = x * G * lr + nr * sr, e[2] = nr * G * lr - x * sr, e[3] = 0, e[4] = G * x * lr - nr * sr, e[5] = x * x * lr + ur, e[6] = nr * x * lr + G * sr, e[7] = 0, e[8] = G * nr * lr + x * sr, e[9] = x * nr * lr - G * sr, e[10] = nr * nr * lr + ur, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e);
              }
              function mr(e, p) {
                var X = Math.sin(p), G = Math.cos(p);
                return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = G, e[6] = X, e[7] = 0, e[8] = 0, e[9] = -X, e[10] = G, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function Mr(e, p) {
                var X = Math.sin(p), G = Math.cos(p);
                return e[0] = G, e[1] = 0, e[2] = -X, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = X, e[9] = 0, e[10] = G, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function dr(e, p) {
                var X = Math.sin(p), G = Math.cos(p);
                return e[0] = G, e[1] = X, e[2] = 0, e[3] = 0, e[4] = -X, e[5] = G, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function U(e, p, X) {
                var G = p[0], x = p[1], nr = p[2], tr = p[3], sr = G + G, ur = x + x, lr = nr + nr, yr = G * sr, pr = G * ur, gr = G * lr, wr = x * ur, _r = x * lr, Sr = nr * lr, hr = tr * sr, br = tr * ur, Dr = tr * lr;
                return e[0] = 1 - (wr + Sr), e[1] = pr + Dr, e[2] = gr - br, e[3] = 0, e[4] = pr - Dr, e[5] = 1 - (yr + Sr), e[6] = _r + hr, e[7] = 0, e[8] = gr + br, e[9] = _r - hr, e[10] = 1 - (yr + wr), e[11] = 0, e[12] = X[0], e[13] = X[1], e[14] = X[2], e[15] = 1, e;
              }
              function _(e, p) {
                return e[0] = p[12], e[1] = p[13], e[2] = p[14], e;
              }
              function F(e, p) {
                var X = p[0], G = p[1], x = p[2], nr = p[4], tr = p[5], sr = p[6], ur = p[8], lr = p[9], yr = p[10];
                return e[0] = Math.sqrt(X * X + G * G + x * x), e[1] = Math.sqrt(nr * nr + tr * tr + sr * sr), e[2] = Math.sqrt(ur * ur + lr * lr + yr * yr), e;
              }
              function $(e, p) {
                var X = p[0] + p[5] + p[10], G = 0;
                return X > 0 ? (G = Math.sqrt(X + 1) * 2, e[3] = 0.25 * G, e[0] = (p[6] - p[9]) / G, e[1] = (p[8] - p[2]) / G, e[2] = (p[1] - p[4]) / G) : p[0] > p[5] & p[0] > p[10] ? (G = Math.sqrt(1 + p[0] - p[5] - p[10]) * 2, e[3] = (p[6] - p[9]) / G, e[0] = 0.25 * G, e[1] = (p[1] + p[4]) / G, e[2] = (p[8] + p[2]) / G) : p[5] > p[10] ? (G = Math.sqrt(1 + p[5] - p[0] - p[10]) * 2, e[3] = (p[8] - p[2]) / G, e[0] = (p[1] + p[4]) / G, e[1] = 0.25 * G, e[2] = (p[6] + p[9]) / G) : (G = Math.sqrt(1 + p[10] - p[0] - p[5]) * 2, e[3] = (p[1] - p[4]) / G, e[0] = (p[8] + p[2]) / G, e[1] = (p[6] + p[9]) / G, e[2] = 0.25 * G), e;
              }
              function rr(e, p, X, G) {
                var x = p[0], nr = p[1], tr = p[2], sr = p[3], ur = x + x, lr = nr + nr, yr = tr + tr, pr = x * ur, gr = x * lr, wr = x * yr, _r = nr * lr, Sr = nr * yr, hr = tr * yr, br = sr * ur, Dr = sr * lr, Ar = sr * yr, Rr = G[0], Tr = G[1], Pr = G[2];
                return e[0] = (1 - (_r + hr)) * Rr, e[1] = (gr + Ar) * Rr, e[2] = (wr - Dr) * Rr, e[3] = 0, e[4] = (gr - Ar) * Tr, e[5] = (1 - (pr + hr)) * Tr, e[6] = (Sr + br) * Tr, e[7] = 0, e[8] = (wr + Dr) * Pr, e[9] = (Sr - br) * Pr, e[10] = (1 - (pr + _r)) * Pr, e[11] = 0, e[12] = X[0], e[13] = X[1], e[14] = X[2], e[15] = 1, e;
              }
              function ir(e, p, X, G, x) {
                var nr = p[0], tr = p[1], sr = p[2], ur = p[3], lr = nr + nr, yr = tr + tr, pr = sr + sr, gr = nr * lr, wr = nr * yr, _r = nr * pr, Sr = tr * yr, hr = tr * pr, br = sr * pr, Dr = ur * lr, Ar = ur * yr, Rr = ur * pr, Tr = G[0], Pr = G[1], Or = G[2], Lr = x[0], qr = x[1], jr = x[2];
                return e[0] = (1 - (Sr + br)) * Tr, e[1] = (wr + Rr) * Tr, e[2] = (_r - Ar) * Tr, e[3] = 0, e[4] = (wr - Rr) * Pr, e[5] = (1 - (gr + br)) * Pr, e[6] = (hr + Dr) * Pr, e[7] = 0, e[8] = (_r + Ar) * Or, e[9] = (hr - Dr) * Or, e[10] = (1 - (gr + Sr)) * Or, e[11] = 0, e[12] = X[0] + Lr - (e[0] * Lr + e[4] * qr + e[8] * jr), e[13] = X[1] + qr - (e[1] * Lr + e[5] * qr + e[9] * jr), e[14] = X[2] + jr - (e[2] * Lr + e[6] * qr + e[10] * jr), e[15] = 1, e;
              }
              function vr(e, p) {
                var X = p[0], G = p[1], x = p[2], nr = p[3], tr = X + X, sr = G + G, ur = x + x, lr = X * tr, yr = G * tr, pr = G * sr, gr = x * tr, wr = x * sr, _r = x * ur, Sr = nr * tr, hr = nr * sr, br = nr * ur;
                return e[0] = 1 - pr - _r, e[1] = yr + br, e[2] = gr - hr, e[3] = 0, e[4] = yr - br, e[5] = 1 - lr - _r, e[6] = wr + Sr, e[7] = 0, e[8] = gr + hr, e[9] = wr - Sr, e[10] = 1 - lr - pr, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
              }
              function b(e, p, X, G, x, nr, tr) {
                var sr = 1 / (X - p), ur = 1 / (x - G), lr = 1 / (nr - tr);
                return e[0] = nr * 2 * sr, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = nr * 2 * ur, e[6] = 0, e[7] = 0, e[8] = (X + p) * sr, e[9] = (x + G) * ur, e[10] = (tr + nr) * lr, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = tr * nr * 2 * lr, e[15] = 0, e;
              }
              function M(e, p, X, G, x) {
                var nr = 1 / Math.tan(p / 2), tr = 1 / (G - x);
                return e[0] = nr / X, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = nr, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = (x + G) * tr, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = 2 * x * G * tr, e[15] = 0, e;
              }
              function q(e, p, X, G) {
                var x = Math.tan(p.upDegrees * Math.PI / 180), nr = Math.tan(p.downDegrees * Math.PI / 180), tr = Math.tan(p.leftDegrees * Math.PI / 180), sr = Math.tan(p.rightDegrees * Math.PI / 180), ur = 2 / (tr + sr), lr = 2 / (x + nr);
                return e[0] = ur, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = lr, e[6] = 0, e[7] = 0, e[8] = -((tr - sr) * ur * 0.5), e[9] = (x - nr) * lr * 0.5, e[10] = G / (X - G), e[11] = -1, e[12] = 0, e[13] = 0, e[14] = G * X / (X - G), e[15] = 0, e;
              }
              function Z(e, p, X, G, x, nr, tr) {
                var sr = 1 / (p - X), ur = 1 / (G - x), lr = 1 / (nr - tr);
                return e[0] = -2 * sr, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * ur, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * lr, e[11] = 0, e[12] = (p + X) * sr, e[13] = (x + G) * ur, e[14] = (tr + nr) * lr, e[15] = 1, e;
              }
              function V(e, p, X, G) {
                var x = void 0, nr = void 0, tr = void 0, sr = void 0, ur = void 0, lr = void 0, yr = void 0, pr = void 0, gr = void 0, wr = void 0, _r = p[0], Sr = p[1], hr = p[2], br = G[0], Dr = G[1], Ar = G[2], Rr = X[0], Tr = X[1], Pr = X[2];
                return Math.abs(_r - Rr) < u.EPSILON && Math.abs(Sr - Tr) < u.EPSILON && Math.abs(hr - Pr) < u.EPSILON ? mat4.identity(e) : (yr = _r - Rr, pr = Sr - Tr, gr = hr - Pr, wr = 1 / Math.sqrt(yr * yr + pr * pr + gr * gr), yr *= wr, pr *= wr, gr *= wr, x = Dr * gr - Ar * pr, nr = Ar * yr - br * gr, tr = br * pr - Dr * yr, wr = Math.sqrt(x * x + nr * nr + tr * tr), wr ? (wr = 1 / wr, x *= wr, nr *= wr, tr *= wr) : (x = 0, nr = 0, tr = 0), sr = pr * tr - gr * nr, ur = gr * x - yr * tr, lr = yr * nr - pr * x, wr = Math.sqrt(sr * sr + ur * ur + lr * lr), wr ? (wr = 1 / wr, sr *= wr, ur *= wr, lr *= wr) : (sr = 0, ur = 0, lr = 0), e[0] = x, e[1] = sr, e[2] = yr, e[3] = 0, e[4] = nr, e[5] = ur, e[6] = pr, e[7] = 0, e[8] = tr, e[9] = lr, e[10] = gr, e[11] = 0, e[12] = -(x * _r + nr * Sr + tr * hr), e[13] = -(sr * _r + ur * Sr + lr * hr), e[14] = -(yr * _r + pr * Sr + gr * hr), e[15] = 1, e);
              }
              function Q(e, p, X, G) {
                var x = p[0], nr = p[1], tr = p[2], sr = G[0], ur = G[1], lr = G[2], yr = x - X[0], pr = nr - X[1], gr = tr - X[2], wr = yr * yr + pr * pr + gr * gr;
                wr > 0 && (wr = 1 / Math.sqrt(wr), yr *= wr, pr *= wr, gr *= wr);
                var _r = ur * gr - lr * pr, Sr = lr * yr - sr * gr, hr = sr * pr - ur * yr;
                return e[0] = _r, e[1] = Sr, e[2] = hr, e[3] = 0, e[4] = pr * hr - gr * Sr, e[5] = gr * _r - yr * hr, e[6] = yr * Sr - pr * _r, e[7] = 0, e[8] = yr, e[9] = pr, e[10] = gr, e[11] = 0, e[12] = x, e[13] = nr, e[14] = tr, e[15] = 1, e;
              }
              function K(e) {
                return "mat4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ", " + e[9] + ", " + e[10] + ", " + e[11] + ", " + e[12] + ", " + e[13] + ", " + e[14] + ", " + e[15] + ")";
              }
              function fr(e) {
                return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + Math.pow(e[6], 2) + Math.pow(e[7], 2) + Math.pow(e[8], 2) + Math.pow(e[9], 2) + Math.pow(e[10], 2) + Math.pow(e[11], 2) + Math.pow(e[12], 2) + Math.pow(e[13], 2) + Math.pow(e[14], 2) + Math.pow(e[15], 2));
              }
              function or(e, p, X) {
                return e[0] = p[0] + X[0], e[1] = p[1] + X[1], e[2] = p[2] + X[2], e[3] = p[3] + X[3], e[4] = p[4] + X[4], e[5] = p[5] + X[5], e[6] = p[6] + X[6], e[7] = p[7] + X[7], e[8] = p[8] + X[8], e[9] = p[9] + X[9], e[10] = p[10] + X[10], e[11] = p[11] + X[11], e[12] = p[12] + X[12], e[13] = p[13] + X[13], e[14] = p[14] + X[14], e[15] = p[15] + X[15], e;
              }
              function N(e, p, X) {
                return e[0] = p[0] - X[0], e[1] = p[1] - X[1], e[2] = p[2] - X[2], e[3] = p[3] - X[3], e[4] = p[4] - X[4], e[5] = p[5] - X[5], e[6] = p[6] - X[6], e[7] = p[7] - X[7], e[8] = p[8] - X[8], e[9] = p[9] - X[9], e[10] = p[10] - X[10], e[11] = p[11] - X[11], e[12] = p[12] - X[12], e[13] = p[13] - X[13], e[14] = p[14] - X[14], e[15] = p[15] - X[15], e;
              }
              function H(e, p, X) {
                return e[0] = p[0] * X, e[1] = p[1] * X, e[2] = p[2] * X, e[3] = p[3] * X, e[4] = p[4] * X, e[5] = p[5] * X, e[6] = p[6] * X, e[7] = p[7] * X, e[8] = p[8] * X, e[9] = p[9] * X, e[10] = p[10] * X, e[11] = p[11] * X, e[12] = p[12] * X, e[13] = p[13] * X, e[14] = p[14] * X, e[15] = p[15] * X, e;
              }
              function J(e, p, X, G) {
                return e[0] = p[0] + X[0] * G, e[1] = p[1] + X[1] * G, e[2] = p[2] + X[2] * G, e[3] = p[3] + X[3] * G, e[4] = p[4] + X[4] * G, e[5] = p[5] + X[5] * G, e[6] = p[6] + X[6] * G, e[7] = p[7] + X[7] * G, e[8] = p[8] + X[8] * G, e[9] = p[9] + X[9] * G, e[10] = p[10] + X[10] * G, e[11] = p[11] + X[11] * G, e[12] = p[12] + X[12] * G, e[13] = p[13] + X[13] * G, e[14] = p[14] + X[14] * G, e[15] = p[15] + X[15] * G, e;
              }
              function ar(e, p) {
                return e[0] === p[0] && e[1] === p[1] && e[2] === p[2] && e[3] === p[3] && e[4] === p[4] && e[5] === p[5] && e[6] === p[6] && e[7] === p[7] && e[8] === p[8] && e[9] === p[9] && e[10] === p[10] && e[11] === p[11] && e[12] === p[12] && e[13] === p[13] && e[14] === p[14] && e[15] === p[15];
              }
              function cr(e, p) {
                var X = e[0], G = e[1], x = e[2], nr = e[3], tr = e[4], sr = e[5], ur = e[6], lr = e[7], yr = e[8], pr = e[9], gr = e[10], wr = e[11], _r = e[12], Sr = e[13], hr = e[14], br = e[15], Dr = p[0], Ar = p[1], Rr = p[2], Tr = p[3], Pr = p[4], Or = p[5], Lr = p[6], qr = p[7], jr = p[8], kr = p[9], zr = p[10], Nr = p[11], Er = p[12], Cr = p[13], Ir = p[14], Fr = p[15];
                return Math.abs(X - Dr) <= u.EPSILON * Math.max(1, Math.abs(X), Math.abs(Dr)) && Math.abs(G - Ar) <= u.EPSILON * Math.max(1, Math.abs(G), Math.abs(Ar)) && Math.abs(x - Rr) <= u.EPSILON * Math.max(1, Math.abs(x), Math.abs(Rr)) && Math.abs(nr - Tr) <= u.EPSILON * Math.max(1, Math.abs(nr), Math.abs(Tr)) && Math.abs(tr - Pr) <= u.EPSILON * Math.max(1, Math.abs(tr), Math.abs(Pr)) && Math.abs(sr - Or) <= u.EPSILON * Math.max(1, Math.abs(sr), Math.abs(Or)) && Math.abs(ur - Lr) <= u.EPSILON * Math.max(1, Math.abs(ur), Math.abs(Lr)) && Math.abs(lr - qr) <= u.EPSILON * Math.max(1, Math.abs(lr), Math.abs(qr)) && Math.abs(yr - jr) <= u.EPSILON * Math.max(1, Math.abs(yr), Math.abs(jr)) && Math.abs(pr - kr) <= u.EPSILON * Math.max(1, Math.abs(pr), Math.abs(kr)) && Math.abs(gr - zr) <= u.EPSILON * Math.max(1, Math.abs(gr), Math.abs(zr)) && Math.abs(wr - Nr) <= u.EPSILON * Math.max(1, Math.abs(wr), Math.abs(Nr)) && Math.abs(_r - Er) <= u.EPSILON * Math.max(1, Math.abs(_r), Math.abs(Er)) && Math.abs(Sr - Cr) <= u.EPSILON * Math.max(1, Math.abs(Sr), Math.abs(Cr)) && Math.abs(hr - Ir) <= u.EPSILON * Math.max(1, Math.abs(hr), Math.abs(Ir)) && Math.abs(br - Fr) <= u.EPSILON * Math.max(1, Math.abs(br), Math.abs(Fr));
              }
              r.mul = R, r.sub = N;
            },
            /* 8 */
            /***/
            function(t, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.setAxes = r.sqlerp = r.rotationTo = r.equals = r.exactEquals = r.normalize = r.sqrLen = r.squaredLength = r.len = r.length = r.lerp = r.dot = r.scale = r.mul = r.add = r.set = r.copy = r.fromValues = r.clone = void 0, r.create = E, r.identity = z, r.setAxisAngle = y, r.getAxisAngle = v, r.multiply = R, r.rotateX = L, r.rotateY = I, r.rotateZ = l, r.calculateW = w, r.slerp = O, r.invert = j, r.conjugate = Y, r.fromMat3 = W, r.fromEuler = er, r.str = mr;
              var c = i(0), u = P(c), o = i(1), h = P(o), S = i(2), m = P(S), d = i(3), g = P(d);
              function P(_) {
                if (_ && _.__esModule)
                  return _;
                var F = {};
                if (_ != null)
                  for (var $ in _)
                    Object.prototype.hasOwnProperty.call(_, $) && (F[$] = _[$]);
                return F.default = _, F;
              }
              function E() {
                var _ = new u.ARRAY_TYPE(4);
                return _[0] = 0, _[1] = 0, _[2] = 0, _[3] = 1, _;
              }
              function z(_) {
                return _[0] = 0, _[1] = 0, _[2] = 0, _[3] = 1, _;
              }
              function y(_, F, $) {
                $ = $ * 0.5;
                var rr = Math.sin($);
                return _[0] = rr * F[0], _[1] = rr * F[1], _[2] = rr * F[2], _[3] = Math.cos($), _;
              }
              function v(_, F) {
                var $ = Math.acos(F[3]) * 2, rr = Math.sin($ / 2);
                return rr != 0 ? (_[0] = F[0] / rr, _[1] = F[1] / rr, _[2] = F[2] / rr) : (_[0] = 1, _[1] = 0, _[2] = 0), $;
              }
              function R(_, F, $) {
                var rr = F[0], ir = F[1], vr = F[2], b = F[3], M = $[0], q = $[1], Z = $[2], V = $[3];
                return _[0] = rr * V + b * M + ir * Z - vr * q, _[1] = ir * V + b * q + vr * M - rr * Z, _[2] = vr * V + b * Z + rr * q - ir * M, _[3] = b * V - rr * M - ir * q - vr * Z, _;
              }
              function L(_, F, $) {
                $ *= 0.5;
                var rr = F[0], ir = F[1], vr = F[2], b = F[3], M = Math.sin($), q = Math.cos($);
                return _[0] = rr * q + b * M, _[1] = ir * q + vr * M, _[2] = vr * q - ir * M, _[3] = b * q - rr * M, _;
              }
              function I(_, F, $) {
                $ *= 0.5;
                var rr = F[0], ir = F[1], vr = F[2], b = F[3], M = Math.sin($), q = Math.cos($);
                return _[0] = rr * q - vr * M, _[1] = ir * q + b * M, _[2] = vr * q + rr * M, _[3] = b * q - ir * M, _;
              }
              function l(_, F, $) {
                $ *= 0.5;
                var rr = F[0], ir = F[1], vr = F[2], b = F[3], M = Math.sin($), q = Math.cos($);
                return _[0] = rr * q + ir * M, _[1] = ir * q - rr * M, _[2] = vr * q + b * M, _[3] = b * q - vr * M, _;
              }
              function w(_, F) {
                var $ = F[0], rr = F[1], ir = F[2];
                return _[0] = $, _[1] = rr, _[2] = ir, _[3] = Math.sqrt(Math.abs(1 - $ * $ - rr * rr - ir * ir)), _;
              }
              function O(_, F, $, rr) {
                var ir = F[0], vr = F[1], b = F[2], M = F[3], q = $[0], Z = $[1], V = $[2], Q = $[3], K = void 0, fr = void 0, or = void 0, N = void 0, H = void 0;
                return fr = ir * q + vr * Z + b * V + M * Q, fr < 0 && (fr = -fr, q = -q, Z = -Z, V = -V, Q = -Q), 1 - fr > 1e-6 ? (K = Math.acos(fr), or = Math.sin(K), N = Math.sin((1 - rr) * K) / or, H = Math.sin(rr * K) / or) : (N = 1 - rr, H = rr), _[0] = N * ir + H * q, _[1] = N * vr + H * Z, _[2] = N * b + H * V, _[3] = N * M + H * Q, _;
              }
              function j(_, F) {
                var $ = F[0], rr = F[1], ir = F[2], vr = F[3], b = $ * $ + rr * rr + ir * ir + vr * vr, M = b ? 1 / b : 0;
                return _[0] = -$ * M, _[1] = -rr * M, _[2] = -ir * M, _[3] = vr * M, _;
              }
              function Y(_, F) {
                return _[0] = -F[0], _[1] = -F[1], _[2] = -F[2], _[3] = F[3], _;
              }
              function W(_, F) {
                var $ = F[0] + F[4] + F[8], rr = void 0;
                if ($ > 0)
                  rr = Math.sqrt($ + 1), _[3] = 0.5 * rr, rr = 0.5 / rr, _[0] = (F[5] - F[7]) * rr, _[1] = (F[6] - F[2]) * rr, _[2] = (F[1] - F[3]) * rr;
                else {
                  var ir = 0;
                  F[4] > F[0] && (ir = 1), F[8] > F[ir * 3 + ir] && (ir = 2);
                  var vr = (ir + 1) % 3, b = (ir + 2) % 3;
                  rr = Math.sqrt(F[ir * 3 + ir] - F[vr * 3 + vr] - F[b * 3 + b] + 1), _[ir] = 0.5 * rr, rr = 0.5 / rr, _[3] = (F[vr * 3 + b] - F[b * 3 + vr]) * rr, _[vr] = (F[vr * 3 + ir] + F[ir * 3 + vr]) * rr, _[b] = (F[b * 3 + ir] + F[ir * 3 + b]) * rr;
                }
                return _;
              }
              function er(_, F, $, rr) {
                var ir = 0.5 * Math.PI / 180;
                F *= ir, $ *= ir, rr *= ir;
                var vr = Math.sin(F), b = Math.cos(F), M = Math.sin($), q = Math.cos($), Z = Math.sin(rr), V = Math.cos(rr);
                return _[0] = vr * q * V - b * M * Z, _[1] = b * M * V + vr * q * Z, _[2] = b * q * Z - vr * M * V, _[3] = b * q * V + vr * M * Z, _;
              }
              function mr(_) {
                return "quat(" + _[0] + ", " + _[1] + ", " + _[2] + ", " + _[3] + ")";
              }
              r.clone = g.clone, r.fromValues = g.fromValues, r.copy = g.copy, r.set = g.set, r.add = g.add, r.mul = R, r.scale = g.scale, r.dot = g.dot, r.lerp = g.lerp;
              var Mr = r.length = g.length;
              r.len = Mr;
              var dr = r.squaredLength = g.squaredLength;
              r.sqrLen = dr;
              var U = r.normalize = g.normalize;
              r.exactEquals = g.exactEquals, r.equals = g.equals, r.rotationTo = (function() {
                var _ = m.create(), F = m.fromValues(1, 0, 0), $ = m.fromValues(0, 1, 0);
                return function(rr, ir, vr) {
                  var b = m.dot(ir, vr);
                  return b < -0.999999 ? (m.cross(_, F, ir), m.len(_) < 1e-6 && m.cross(_, $, ir), m.normalize(_, _), y(rr, _, Math.PI), rr) : b > 0.999999 ? (rr[0] = 0, rr[1] = 0, rr[2] = 0, rr[3] = 1, rr) : (m.cross(_, ir, vr), rr[0] = _[0], rr[1] = _[1], rr[2] = _[2], rr[3] = 1 + b, U(rr, rr));
                };
              })(), r.sqlerp = (function() {
                var _ = E(), F = E();
                return function($, rr, ir, vr, b, M) {
                  return O(_, rr, b, M), O(F, ir, vr, M), O($, _, F, 2 * M * (1 - M)), $;
                };
              })(), r.setAxes = (function() {
                var _ = h.create();
                return function(F, $, rr, ir) {
                  return _[0] = rr[0], _[3] = rr[1], _[6] = rr[2], _[1] = ir[0], _[4] = ir[1], _[7] = ir[2], _[2] = -$[0], _[5] = -$[1], _[8] = -$[2], U(F, W(F, _));
                };
              })();
            },
            /* 9 */
            /***/
            function(t, r, i) {
              Object.defineProperty(r, "__esModule", {
                value: !0
              }), r.forEach = r.sqrLen = r.sqrDist = r.dist = r.div = r.mul = r.sub = r.len = void 0, r.create = h, r.clone = S, r.fromValues = m, r.copy = d, r.set = g, r.add = P, r.subtract = E, r.multiply = z, r.divide = y, r.ceil = v, r.floor = R, r.min = L, r.max = I, r.round = l, r.scale = w, r.scaleAndAdd = O, r.distance = j, r.squaredDistance = Y, r.length = W, r.squaredLength = er, r.negate = mr, r.inverse = Mr, r.normalize = dr, r.dot = U, r.cross = _, r.lerp = F, r.random = $, r.transformMat2 = rr, r.transformMat2d = ir, r.transformMat3 = vr, r.transformMat4 = b, r.str = M, r.exactEquals = q, r.equals = Z;
              var c = i(0), u = o(c);
              function o(V) {
                if (V && V.__esModule)
                  return V;
                var Q = {};
                if (V != null)
                  for (var K in V)
                    Object.prototype.hasOwnProperty.call(V, K) && (Q[K] = V[K]);
                return Q.default = V, Q;
              }
              function h() {
                var V = new u.ARRAY_TYPE(2);
                return V[0] = 0, V[1] = 0, V;
              }
              function S(V) {
                var Q = new u.ARRAY_TYPE(2);
                return Q[0] = V[0], Q[1] = V[1], Q;
              }
              function m(V, Q) {
                var K = new u.ARRAY_TYPE(2);
                return K[0] = V, K[1] = Q, K;
              }
              function d(V, Q) {
                return V[0] = Q[0], V[1] = Q[1], V;
              }
              function g(V, Q, K) {
                return V[0] = Q, V[1] = K, V;
              }
              function P(V, Q, K) {
                return V[0] = Q[0] + K[0], V[1] = Q[1] + K[1], V;
              }
              function E(V, Q, K) {
                return V[0] = Q[0] - K[0], V[1] = Q[1] - K[1], V;
              }
              function z(V, Q, K) {
                return V[0] = Q[0] * K[0], V[1] = Q[1] * K[1], V;
              }
              function y(V, Q, K) {
                return V[0] = Q[0] / K[0], V[1] = Q[1] / K[1], V;
              }
              function v(V, Q) {
                return V[0] = Math.ceil(Q[0]), V[1] = Math.ceil(Q[1]), V;
              }
              function R(V, Q) {
                return V[0] = Math.floor(Q[0]), V[1] = Math.floor(Q[1]), V;
              }
              function L(V, Q, K) {
                return V[0] = Math.min(Q[0], K[0]), V[1] = Math.min(Q[1], K[1]), V;
              }
              function I(V, Q, K) {
                return V[0] = Math.max(Q[0], K[0]), V[1] = Math.max(Q[1], K[1]), V;
              }
              function l(V, Q) {
                return V[0] = Math.round(Q[0]), V[1] = Math.round(Q[1]), V;
              }
              function w(V, Q, K) {
                return V[0] = Q[0] * K, V[1] = Q[1] * K, V;
              }
              function O(V, Q, K, fr) {
                return V[0] = Q[0] + K[0] * fr, V[1] = Q[1] + K[1] * fr, V;
              }
              function j(V, Q) {
                var K = Q[0] - V[0], fr = Q[1] - V[1];
                return Math.sqrt(K * K + fr * fr);
              }
              function Y(V, Q) {
                var K = Q[0] - V[0], fr = Q[1] - V[1];
                return K * K + fr * fr;
              }
              function W(V) {
                var Q = V[0], K = V[1];
                return Math.sqrt(Q * Q + K * K);
              }
              function er(V) {
                var Q = V[0], K = V[1];
                return Q * Q + K * K;
              }
              function mr(V, Q) {
                return V[0] = -Q[0], V[1] = -Q[1], V;
              }
              function Mr(V, Q) {
                return V[0] = 1 / Q[0], V[1] = 1 / Q[1], V;
              }
              function dr(V, Q) {
                var K = Q[0], fr = Q[1], or = K * K + fr * fr;
                return or > 0 && (or = 1 / Math.sqrt(or), V[0] = Q[0] * or, V[1] = Q[1] * or), V;
              }
              function U(V, Q) {
                return V[0] * Q[0] + V[1] * Q[1];
              }
              function _(V, Q, K) {
                var fr = Q[0] * K[1] - Q[1] * K[0];
                return V[0] = V[1] = 0, V[2] = fr, V;
              }
              function F(V, Q, K, fr) {
                var or = Q[0], N = Q[1];
                return V[0] = or + fr * (K[0] - or), V[1] = N + fr * (K[1] - N), V;
              }
              function $(V, Q) {
                Q = Q || 1;
                var K = u.RANDOM() * 2 * Math.PI;
                return V[0] = Math.cos(K) * Q, V[1] = Math.sin(K) * Q, V;
              }
              function rr(V, Q, K) {
                var fr = Q[0], or = Q[1];
                return V[0] = K[0] * fr + K[2] * or, V[1] = K[1] * fr + K[3] * or, V;
              }
              function ir(V, Q, K) {
                var fr = Q[0], or = Q[1];
                return V[0] = K[0] * fr + K[2] * or + K[4], V[1] = K[1] * fr + K[3] * or + K[5], V;
              }
              function vr(V, Q, K) {
                var fr = Q[0], or = Q[1];
                return V[0] = K[0] * fr + K[3] * or + K[6], V[1] = K[1] * fr + K[4] * or + K[7], V;
              }
              function b(V, Q, K) {
                var fr = Q[0], or = Q[1];
                return V[0] = K[0] * fr + K[4] * or + K[12], V[1] = K[1] * fr + K[5] * or + K[13], V;
              }
              function M(V) {
                return "vec2(" + V[0] + ", " + V[1] + ")";
              }
              function q(V, Q) {
                return V[0] === Q[0] && V[1] === Q[1];
              }
              function Z(V, Q) {
                var K = V[0], fr = V[1], or = Q[0], N = Q[1];
                return Math.abs(K - or) <= u.EPSILON * Math.max(1, Math.abs(K), Math.abs(or)) && Math.abs(fr - N) <= u.EPSILON * Math.max(1, Math.abs(fr), Math.abs(N));
              }
              r.len = W, r.sub = E, r.mul = z, r.div = y, r.dist = j, r.sqrDist = Y, r.sqrLen = er, r.forEach = (function() {
                var V = h();
                return function(Q, K, fr, or, N, H) {
                  var J = void 0, ar = void 0;
                  for (K || (K = 2), fr || (fr = 0), or ? ar = Math.min(or * K + fr, Q.length) : ar = Q.length, J = fr; J < ar; J += K)
                    V[0] = Q[J], V[1] = Q[J + 1], N(V, V, H), Q[J] = V[0], Q[J + 1] = V[1];
                  return Q;
                };
              })();
            }
            /******/
          ])
        );
      });
    }, {}], 9: [function(a, n, f) {
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
      function t(c, u, o) {
        this.obj = c, this.left = null, this.right = null, this.parent = o, this.dimension = u;
      }
      function r(c, u, o) {
        var h = this;
        function S(m, d, g) {
          var P = d % o.length, E, z;
          return m.length === 0 ? null : m.length === 1 ? new t(m[0], P, g) : (m.sort(function(y, v) {
            return y[o[P]] - v[o[P]];
          }), E = Math.floor(m.length / 2), z = new t(m[E], P, g), z.left = S(m.slice(0, E), d + 1, z), z.right = S(m.slice(E + 1), d + 1, z), z);
        }
        this.root = S(c, 0, null), this.insert = function(m) {
          function d(z, y) {
            if (z === null)
              return y;
            var v = o[z.dimension];
            return m[v] < z.obj[v] ? d(z.left, z) : d(z.right, z);
          }
          var g = d(this.root, null), P, E;
          if (g === null) {
            this.root = new t(m, 0, null);
            return;
          }
          P = new t(m, (g.dimension + 1) % o.length, g), E = o[g.dimension], m[E] < g.obj[E] ? g.left = P : g.right = P;
        }, this.remove = function(m) {
          var d;
          function g(E) {
            if (E === null)
              return null;
            if (E.obj === m)
              return E;
            var z = o[E.dimension];
            return m[z] < E.obj[z] ? g(E.left) : g(E.right);
          }
          function P(E) {
            var z, y, v;
            function R(I, l) {
              var w, O, j, Y, W;
              return I === null ? null : (w = o[l], I.dimension === l ? I.right !== null ? R(I.right, l) : I : (O = I.obj[w], j = R(I.left, l), Y = R(I.right, l), W = I, j !== null && j.obj[w] > O && (W = j), Y !== null && Y.obj[w] > W.obj[w] && (W = Y), W));
            }
            function L(I, l) {
              var w, O, j, Y, W;
              return I === null ? null : (w = o[l], I.dimension === l ? I.left !== null ? L(I.left, l) : I : (O = I.obj[w], j = L(I.left, l), Y = L(I.right, l), W = I, j !== null && j.obj[w] < O && (W = j), Y !== null && Y.obj[w] < W.obj[w] && (W = Y), W));
            }
            if (E.left === null && E.right === null) {
              if (E.parent === null) {
                h.root = null;
                return;
              }
              v = o[E.parent.dimension], E.obj[v] < E.parent.obj[v] ? E.parent.left = null : E.parent.right = null;
              return;
            }
            E.left !== null ? z = R(E.left, E.dimension) : z = L(E.right, E.dimension), y = z.obj, P(z), E.obj = y;
          }
          d = g(h.root), d !== null && P(d);
        }, this.nearest = function(m, d, g) {
          var P, E, z;
          z = new i(
            function(v) {
              return -v[1];
            }
          );
          function y(v) {
            if (!h.root)
              return [];
            var R, L = o[v.dimension], I = u(m, v.obj), l = {}, w, O, j;
            function Y(W, er) {
              z.push([W, er]), z.size() > d && z.pop();
            }
            for (j = 0; j < o.length; j += 1)
              j === v.dimension ? l[o[j]] = m[o[j]] : l[o[j]] = v.obj[o[j]];
            if (w = u(l, v.obj), v.right === null && v.left === null) {
              (z.size() < d || I < z.peek()[1]) && Y(v, I);
              return;
            }
            v.right === null ? R = v.left : v.left === null ? R = v.right : m[L] < v.obj[L] ? R = v.left : R = v.right, y(R), (z.size() < d || I < z.peek()[1]) && Y(v, I), (z.size() < d || Math.abs(w) < z.peek()[1]) && (R === v.left ? O = v.right : O = v.left, O !== null && y(O));
          }
          if (g)
            for (P = 0; P < d; P += 1)
              z.push([null, g]);
          for (y(h.root), E = [], P = 0; P < d && P < z.content.length; P += 1)
            z.content[P][0] && E.push([z.content[P][0].obj, z.content[P][1]]);
          return E;
        }, this.balanceFactor = function() {
          function m(g) {
            return g === null ? 0 : Math.max(m(g.left), m(g.right)) + 1;
          }
          function d(g) {
            return g === null ? 0 : d(g.left) + d(g.right) + 1;
          }
          return m(h.root) / (Math.log(d(h.root)) / Math.log(2));
        };
      }
      function i(c) {
        this.content = [], this.scoreFunction = c;
      }
      i.prototype = {
        push: function(c) {
          this.content.push(c), this.bubbleUp(this.content.length - 1);
        },
        pop: function() {
          var c = this.content[0], u = this.content.pop();
          return this.content.length > 0 && (this.content[0] = u, this.sinkDown(0)), c;
        },
        peek: function() {
          return this.content[0];
        },
        remove: function(c) {
          for (var u = this.content.length, o = 0; o < u; o++)
            if (this.content[o] == c) {
              var h = this.content.pop();
              o != u - 1 && (this.content[o] = h, this.scoreFunction(h) < this.scoreFunction(c) ? this.bubbleUp(o) : this.sinkDown(o));
              return;
            }
          throw new Error("Node not found.");
        },
        size: function() {
          return this.content.length;
        },
        bubbleUp: function(c) {
          for (var u = this.content[c]; c > 0; ) {
            var o = Math.floor((c + 1) / 2) - 1, h = this.content[o];
            if (this.scoreFunction(u) < this.scoreFunction(h))
              this.content[o] = u, this.content[c] = h, c = o;
            else
              break;
          }
        },
        sinkDown: function(c) {
          for (var u = this.content.length, o = this.content[c], h = this.scoreFunction(o); ; ) {
            var S = (c + 1) * 2, m = S - 1, d = null;
            if (m < u) {
              var g = this.content[m], P = this.scoreFunction(g);
              P < h && (d = m);
            }
            if (S < u) {
              var E = this.content[S], z = this.scoreFunction(E);
              z < (d == null ? h : P) && (d = S);
            }
            if (d != null)
              this.content[c] = this.content[d], this.content[d] = o, c = d;
            else
              break;
          }
        }
      }, n.exports = {
        createKdTree: function(c, u, o) {
          return new r(c, u, o);
        }
      };
    }, {}], 10: [function(a, n, f) {
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
    }, {}], 11: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.resampleFloat32Array = c;
      var t = a("fractional-delay"), r = i(t);
      function i(u) {
        return u && u.__esModule ? u : { default: u };
      }
      function c() {
        var u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = new Promise(function(h, S) {
          var m = u.inputSamples, d = u.inputSampleRate, g = typeof u.inputDelay < "u" ? u.inputDelay : 0, P = typeof u.outputSampleRate < "u" ? u.outputSampleRate : d;
          if (d === P && g === 0)
            h(new Float32Array(m));
          else
            try {
              var E = Math.ceil(m.length * P / d), z = new window.OfflineAudioContext(1, E, P), y = z.createBuffer(1, m.length, d), v = 1, R = new r.default(d, v);
              R.setDelay(g / d), y.getChannelData(0).set(R.process(m));
              var L = z.createBufferSource();
              L.buffer = y, L.connect(z.destination), L.start(), z.oncomplete = function(I) {
                var l = I.renderedBuffer.getChannelData(0);
                h(l);
              }, z.startRendering();
            } catch (I) {
              S(new Error("Unable to re-sample Float32Array. " + I.message));
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
        resampleFloat32Array: c
      };
    }, { "fractional-delay": 7 }], 12: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.tree = void 0, f.distanceSquared = c, f.distance = u;
      var t = a("kd.tree"), r = i(t);
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
      function c(o, h) {
        var S = h.x - o.x, m = h.y - o.y, d = h.z - o.z;
        return S * S + m * m + d * d;
      }
      function u(o, h) {
        return Math.sqrt(this.distanceSquared(o, h));
      }
      f.default = {
        distance: u,
        distanceSquared: c,
        tree: r.default
      };
    }, { "kd.tree": 9 }], 13: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.sofaCartesianToGl = c, f.glToSofaCartesian = u, f.sofaCartesianToSofaSpherical = o, f.sofaSphericalToSofaCartesian = h, f.sofaSphericalToGl = S, f.glToSofaSpherical = m, f.sofaToSofaCartesian = d, f.spat4CartesianToGl = g, f.glToSpat4Cartesian = P, f.spat4CartesianToSpat4Spherical = E, f.spat4SphericalToSpat4Cartesian = z, f.spat4SphericalToGl = y, f.glToSpat4Spherical = v, f.systemType = R, f.systemToGl = L, f.glToSystem = I;
      var t = a("./degree"), r = i(t);
      function i(l) {
        return l && l.__esModule ? l : { default: l };
      }
      function c(l, w) {
        var O = w[0], j = w[1], Y = w[2];
        return l[0] = 0 - j, l[1] = Y, l[2] = 0 - O, l;
      }
      /**
       * @fileOverview Coordinate systems conversions. openGL, SOFA, and Spat4 (Ircam).
       *
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      function u(l, w) {
        var O = w[0], j = w[1], Y = w[2];
        return l[0] = 0 - Y, l[1] = 0 - O, l[2] = j, l;
      }
      function o(l, w) {
        var O = w[0], j = w[1], Y = w[2], W = O * O + j * j;
        return l[0] = (r.default.atan2(j, O) + 360) % 360, l[1] = r.default.atan2(Y, Math.sqrt(W)), l[2] = Math.sqrt(W + Y * Y), l;
      }
      function h(l, w) {
        var O = w[0], j = w[1], Y = w[2], W = r.default.cos(j);
        return l[0] = Y * W * r.default.cos(O), l[1] = Y * W * r.default.sin(O), l[2] = Y * r.default.sin(j), l;
      }
      function S(l, w) {
        var O = w[0], j = w[1], Y = w[2], W = r.default.cos(j);
        return l[0] = 0 - Y * W * r.default.sin(O), l[1] = Y * r.default.sin(j), l[2] = 0 - Y * W * r.default.cos(O), l;
      }
      function m(l, w) {
        var O = 0 - w[2], j = 0 - w[0], Y = w[1], W = O * O + j * j;
        return l[0] = (r.default.atan2(j, O) + 360) % 360, l[1] = r.default.atan2(Y, Math.sqrt(W)), l[2] = Math.sqrt(W + Y * Y), l;
      }
      function d(l, w, O) {
        switch (O) {
          case "sofaCartesian":
            l[0] = w[0], l[1] = w[1], l[2] = w[2];
            break;
          case "sofaSpherical":
            h(l, w);
            break;
          default:
            throw new Error("Bad coordinate system");
        }
        return l;
      }
      function g(l, w) {
        var O = w[0], j = w[1], Y = w[2];
        return l[0] = O, l[1] = Y, l[2] = 0 - j, l;
      }
      function P(l, w) {
        var O = w[0], j = w[1], Y = w[2];
        return l[0] = O, l[1] = 0 - Y, l[2] = j, l;
      }
      function E(l, w) {
        var O = w[0], j = w[1], Y = w[2], W = O * O + j * j;
        return l[0] = r.default.atan2(O, j), l[1] = r.default.atan2(Y, Math.sqrt(W)), l[2] = Math.sqrt(W + Y * Y), l;
      }
      function z(l, w) {
        var O = w[0], j = w[1], Y = w[2], W = r.default.cos(j);
        return l[0] = Y * W * r.default.sin(O), l[1] = Y * W * r.default.cos(O), l[2] = Y * r.default.sin(j), l;
      }
      function y(l, w) {
        var O = w[0], j = w[1], Y = w[2], W = r.default.cos(j);
        return l[0] = Y * W * r.default.sin(O), l[1] = Y * r.default.sin(j), l[2] = 0 - Y * W * r.default.cos(O), l;
      }
      function v(l, w) {
        var O = w[0], j = 0 - w[2], Y = w[1], W = O * O + j * j;
        return l[0] = r.default.atan2(O, j), l[1] = r.default.atan2(Y, Math.sqrt(W)), l[2] = Math.sqrt(W + Y * Y), l;
      }
      function R(l) {
        var w = void 0;
        if (l === "sofaCartesian" || l === "spat4Cartesian" || l === "gl")
          w = "cartesian";
        else if (l === "sofaSpherical" || l === "spat4Spherical")
          w = "spherical";
        else
          throw new Error("Unknown coordinate system type " + l);
        return w;
      }
      function L(l, w, O) {
        switch (O) {
          case "gl":
            l[0] = w[0], l[1] = w[1], l[2] = w[2];
            break;
          case "sofaCartesian":
            c(l, w);
            break;
          case "sofaSpherical":
            S(l, w);
            break;
          case "spat4Cartesian":
            g(l, w);
            break;
          case "spat4Spherical":
            y(l, w);
            break;
          default:
            throw new Error("Bad coordinate system");
        }
        return l;
      }
      function I(l, w, O) {
        switch (O) {
          case "gl":
            l[0] = w[0], l[1] = w[1], l[2] = w[2];
            break;
          case "sofaCartesian":
            u(l, w);
            break;
          case "sofaSpherical":
            m(l, w);
            break;
          case "spat4Cartesian":
            P(l, w);
            break;
          case "spat4Spherical":
            v(l, w);
            break;
          default:
            throw new Error("Bad coordinate system");
        }
        return l;
      }
      f.default = {
        glToSofaCartesian: u,
        glToSofaSpherical: m,
        glToSpat4Cartesian: P,
        glToSpat4Spherical: v,
        glToSystem: I,
        sofaCartesianToGl: c,
        sofaCartesianToSofaSpherical: o,
        sofaSphericalToGl: S,
        sofaSphericalToSofaCartesian: h,
        sofaToSofaCartesian: d,
        spat4CartesianToGl: g,
        spat4CartesianToSpat4Spherical: E,
        spat4SphericalToGl: y,
        spat4SphericalToSpat4Cartesian: z,
        systemToGl: L,
        systemType: R
      };
    }, { "./degree": 14 }], 14: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.toRadian = i, f.fromRadian = c, f.cos = u, f.sin = o, f.atan2 = h;
      /**
       * @fileOverview Convert to and from degree
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var t = f.toRadianFactor = Math.PI / 180, r = f.fromRadianFactor = 1 / t;
      function i(S) {
        return S * t;
      }
      function c(S) {
        return S * r;
      }
      function u(S) {
        return Math.cos(S * t);
      }
      function o(S) {
        return Math.sin(S * t);
      }
      function h(S, m) {
        return Math.atan2(S, m) * r;
      }
      f.default = {
        atan2: h,
        cos: u,
        fromRadian: c,
        fromRadianFactor: r,
        sin: o,
        toRadian: i,
        toRadianFactor: t
      };
    }, {}], 15: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.ServerDataBase = f.HrtfSet = void 0;
      var t = a("./sofa/HrtfSet"), r = u(t), i = a("./sofa/ServerDataBase"), c = u(i);
      function u(o) {
        return o && o.__esModule ? o : { default: o };
      }
      f.HrtfSet = r.default, f.ServerDataBase = c.default, f.default = {
        HrtfSet: r.default,
        ServerDataBase: c.default
      };
    }, { "./sofa/HrtfSet": 17, "./sofa/ServerDataBase": 18 }], 16: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.version = f.name = f.license = f.description = void 0;
      var t = a("../package.json"), r = i(t);
      function i(S) {
        return S && S.__esModule ? S : { default: S };
      }
      var c = r.default.description;
      /**
       * @fileOverview Information on the library, from the `package.json` file.
       *
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      f.description = c;
      var u = r.default.license;
      f.license = u;
      var o = r.default.name;
      f.name = o;
      var h = r.default.version;
      f.version = h, f.default = {
        description: c,
        license: u,
        name: o,
        version: h
      };
    }, { "../package.json": 10 }], 17: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.HrtfSet = void 0;
      var t = /* @__PURE__ */ (function() {
        function L(I, l) {
          for (var w = 0; w < l.length; w++) {
            var O = l[w];
            O.enumerable = O.enumerable || !1, O.configurable = !0, "value" in O && (O.writable = !0), Object.defineProperty(I, O.key, O);
          }
        }
        return function(I, l, w) {
          return l && L(I.prototype, l), w && L(I, w), I;
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
      var r = a("gl-matrix"), i = z(r), c = a("../info"), u = E(c), o = a("./parseDataSet"), h = a("./parseSofa"), S = a("../geometry/coordinates"), m = E(S), d = a("../geometry/KdTree"), g = E(d), P = a("../audio/utilities");
      function E(L) {
        return L && L.__esModule ? L : { default: L };
      }
      function z(L) {
        if (L && L.__esModule)
          return L;
        var I = {};
        if (L != null)
          for (var l in L)
            Object.prototype.hasOwnProperty.call(L, l) && (I[l] = L[l]);
        return I.default = L, I;
      }
      function y(L) {
        if (Array.isArray(L)) {
          for (var I = 0, l = Array(L.length); I < L.length; I++)
            l[I] = L[I];
          return l;
        } else
          return Array.from(L);
      }
      function v(L, I) {
        if (!(L instanceof I))
          throw new TypeError("Cannot call a class as a function");
      }
      var R = f.HrtfSet = (function() {
        function L() {
          var I = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          v(this, L), this._audioContext = I.audioContext, this._ready = !1, this.coordinateSystem = I.coordinateSystem, this.filterCoordinateSystem = I.filterCoordinateSystem, this.filterPositions = I.filterPositions, this.filterAfterLoad = I.filterAfterLoad;
        }
        return t(L, [{
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
            var l = this, w = this._filterPositions.map(function(O) {
              return l._kdt.nearest({ x: O[0], y: O[1], z: O[2] }, 1).pop()[0];
            });
            w = [].concat(y(new Set(w))), this._kdt = g.default.tree.createKdTree(w, g.default.distanceSquared, ["x", "y", "z"]);
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
            var w = this, O = l.split(".").pop(), j = O === "sofa" ? l + ".json" : l, Y = void 0, W = typeof this._filterPositions < "u" && !this.filterAfterLoad && O === "sofa";
            return W ? Y = Promise.all([this._loadMetaAndPositions(l), this._loadDataSet(l)]).then(function(er) {
              var mr = er[0], Mr = er[1];
              return w._loadSofaPartial(l, mr, Mr).then(function() {
                return w._ready = !0, w;
              });
            }).catch(function() {
              return w._loadSofaFull(j).then(function() {
                return w.applyFilterPositions(), w._ready = !0, w;
              });
            }) : Y = this._loadSofaFull(j).then(function() {
              return typeof w._filterPositions < "u" && w.filterAfterLoad && w.applyFilterPositions(), w._ready = !0, w;
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
            var l = this, w = void 0, O = m.default.systemType(this.filterCoordinateSystem);
            switch (O) {
              case "cartesian":
                w = this._sofaSourcePosition.map(function(Y) {
                  return m.default.glToSofaCartesian([], Y);
                });
                break;
              case "spherical":
                w = this._sofaSourcePosition.map(function(Y) {
                  return m.default.glToSofaSpherical([], Y);
                });
                break;
              default:
                throw new Error("Bad source position type " + O + " for export.");
            }
            var j = this._sofaSourcePosition.map(function(Y) {
              for (var W = l._kdt.nearest({ x: Y[0], y: Y[1], z: Y[2] }, 1).pop()[0].fir, er = [], mr = 0; mr < W.numberOfChannels; ++mr)
                er.push([].concat(y(W.getChannelData(mr))));
              return er;
            });
            return (0, h.stringifySofa)({
              name: this._sofaName,
              metaData: this._sofaMetaData,
              ListenerPosition: [0, 0, 0],
              ListenerPositionType: "cartesian",
              ListenerUp: [0, 0, 1],
              ListenerUpType: "cartesian",
              ListenerView: [1, 0, 0],
              ListenerViewType: "cartesian",
              SourcePositionType: O,
              SourcePosition: w,
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
            var w = m.default.systemToGl([], l, this.coordinateSystem), O = this._kdt.nearest({
              x: w[0],
              y: w[1],
              z: w[2]
            }, 1).pop(), j = O[0];
            return m.default.glToSystem(w, [j.x, j.y, j.z], this.coordinateSystem), {
              distance: O[1],
              fir: j.fir,
              index: j.index,
              position: w
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
            var w = this, O = l.map(function(j) {
              var Y = j[2], W = w._audioContext.createBuffer(Y.length, Y[0].length, w._audioContext.sampleRate);
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
            }), this._kdt = g.default.tree.createKdTree(O, g.default.distanceSquared, ["x", "y", "z"]), this;
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
          value: function(l, w, O, j) {
            var Y = this, W = O.map(function(er, mr) {
              var Mr = er.length;
              if (Mr !== 2)
                throw new Error("Bad number of channels" + (" for IR index " + l[mr]) + (" (" + Mr + " instead of 2)"));
              if (j[0].length !== 2)
                throw new Error("Bad delay format" + (" for IR index " + l[mr]) + (" (first element in Data.Delay is " + j[0]) + " instead of [[delayL, delayR]] )");
              var dr = typeof j[mr] < "u" ? j[mr] : j[0], U = er.map(function(_, F) {
                if (dr[F] < 0)
                  throw new Error("Negative delay detected (not handled at the moment):" + (" delay index " + l[mr]) + (" channel " + F));
                return (0, P.resampleFloat32Array)({
                  inputSamples: _,
                  inputDelay: dr[F],
                  inputSampleRate: Y._sofaSampleRate,
                  outputSampleRate: Y._audioContext.sampleRate
                });
              });
              return Promise.all(U).then(function(_) {
                return [l[mr], w[mr], _];
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
            var w = new Promise(function(O, j) {
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
            return w;
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
            var w = this, O = new Promise(function(j, Y) {
              var W = l + ".json?ListenerPosition,ListenerUp,ListenerView,SourcePosition,Data.Delay,Data.SamplingRate,EmitterPosition,ReceiverPosition,RoomVolume", er = new window.XMLHttpRequest();
              er.open("GET", W), er.onerror = function() {
                Y(new Error("Unable to GET " + W + ", status " + er.status + " " + ("" + er.responseText)));
              }, er.onload = function() {
                if (er.status < 200 || er.status >= 300) {
                  er.onerror();
                  return;
                }
                try {
                  var mr = (0, h.parseSofa)(er.response);
                  w._setMetaData(mr, l);
                  var Mr = w._sourcePositionsToGl(mr), dr = Mr.map(function(F, $) {
                    return {
                      x: F[0],
                      y: F[1],
                      z: F[2],
                      index: $
                    };
                  }), U = g.default.tree.createKdTree(dr, g.default.distanceSquared, ["x", "y", "z"]), _ = w._filterPositions.map(function(F) {
                    return U.nearest({ x: F[0], y: F[1], z: F[2] }, 1).pop()[0].index;
                  });
                  _ = [].concat(y(new Set(_))), w._sofaUrl = l, j(_);
                } catch (F) {
                  Y(new Error("Unable to parse " + W + ". " + F.message));
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
            var w = this, O = new Promise(function(j, Y) {
              var W = new window.XMLHttpRequest();
              W.open("GET", l), W.onerror = function() {
                Y(new Error("Unable to GET " + l + ", status " + W.status + " " + ("" + W.responseText)));
              }, W.onload = function() {
                if (W.status < 200 || W.status >= 300) {
                  W.onerror();
                  return;
                }
                try {
                  var er = (0, h.parseSofa)(W.response);
                  w._setMetaData(er, l);
                  var mr = w._sourcePositionsToGl(er);
                  w._generateIndicesPositionsFirs(
                    mr.map(function(Mr, dr) {
                      return dr;
                    }),
                    // full
                    mr,
                    er["Data.IR"].data,
                    er["Data.Delay"].data
                  ).then(function(Mr) {
                    w._createKdTree(Mr), w._sofaUrl = l, j(w);
                  });
                } catch (Mr) {
                  Y(new Error("Unable to parse " + l + ". " + Mr.message));
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
          value: function(l, w, O) {
            var j = this, Y = w.map(function(W) {
              var er = new Promise(function(mr, Mr) {
                var dr = l + ".json?" + ("SourcePosition[" + W + "][0:1:" + (O.SourcePosition.C - 1) + "],") + ("Data.IR[" + W + "][0:1:" + (O["Data.IR"].R - 1) + "]") + ("[0:1:" + (O["Data.IR"].N - 1) + "]"), U = new window.XMLHttpRequest();
                U.open("GET", dr), U.onerror = function() {
                  Mr(new Error("Unable to GET " + dr + ", status " + U.status + " " + ("" + U.responseText)));
                }, U.onload = function() {
                  (U.status < 200 || U.status >= 300) && U.onerror();
                  try {
                    var _ = (0, h.parseSofa)(U.response), F = j._sourcePositionsToGl(_);
                    j._generateIndicesPositionsFirs([W], F, _["Data.IR"].data, _["Data.Delay"].data).then(function($) {
                      mr($[0]);
                    });
                  } catch ($) {
                    Mr(new Error("Unable to parse " + dr + ". " + $.message));
                  }
                }, U.send();
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
          value: function(l, w) {
            if (typeof l.metaData.DataType < "u" && l.metaData.DataType !== "FIR")
              throw new Error("According to meta-data, SOFA data type is not FIR");
            var O = (/* @__PURE__ */ new Date()).toISOString();
            this._sofaName = typeof l.name < "u" ? "" + l.name : "HRTF.sofa", this._sofaMetaData = typeof l.metaData < "u" ? l.metaData : {}, typeof w < "u" && (this._sofaMetaData.OriginalUrl = w), this._sofaMetaData.Converter = "Ircam " + u.default.name + " " + u.default.version + " javascript API ", this._sofaMetaData.DateConverted = O, this._sofaSampleRate = typeof l["Data.SamplingRate"] < "u" ? l["Data.SamplingRate"].data[0] : 48e3, this._sofaSampleRate !== this._audioContext.sampleRate && (this._sofaMetaData.OriginalSampleRate = this._sofaSampleRate), this._sofaDelay = typeof l["Data.Delay"] < "u" ? l["Data.Delay"].data : [0, 0], this._sofaRoomVolume = typeof l.RoomVolume < "u" ? l.RoomVolume.data[0] : void 0;
            var j = m.default.sofaToSofaCartesian([], l.ListenerPosition.data[0], (0, h.conformSofaCoordinateSystem)(l.ListenerPosition.Type || "cartesian")), Y = m.default.sofaToSofaCartesian([], l.ListenerView.data[0], (0, h.conformSofaCoordinateSystem)(l.ListenerView.Type || "cartesian")), W = m.default.sofaToSofaCartesian([], l.ListenerUp.data[0], (0, h.conformSofaCoordinateSystem)(l.ListenerUp.Type || "cartesian"));
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
            var w = this, O = l.SourcePosition.data, j = typeof l.SourcePosition.Type < "u" ? l.SourcePosition.Type : "spherical";
            switch (j) {
              case "cartesian":
                O.forEach(function(Y) {
                  i.vec3.transformMat4(Y, Y, w._sofaToGl);
                });
                break;
              case "spherical":
                O.forEach(function(Y) {
                  m.default.sofaSphericalToSofaCartesian(Y, Y), i.vec3.transformMat4(Y, Y, w._sofaToGl);
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
                  this._filterPositions = l.map(function(w) {
                    return w.slice(0);
                  });
                  break;
                case "sofaCartesian":
                  this._filterPositions = l.map(function(w) {
                    return m.default.sofaCartesianToGl([], w);
                  });
                  break;
                case "sofaSpherical":
                  this._filterPositions = l.map(function(w) {
                    return m.default.sofaSphericalToGl([], w);
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
                  l = this._filterPositions.map(function(w) {
                    return w.slice(0);
                  });
                  break;
                case "sofaCartesian":
                  l = this._filterPositions.map(function(w) {
                    return m.default.glToSofaCartesian([], w);
                  });
                  break;
                case "sofaSpherical":
                  l = this._filterPositions.map(function(w) {
                    return m.default.glToSofaSpherical([], w);
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
    }, { "../audio/utilities": 11, "../geometry/KdTree": 12, "../geometry/coordinates": 13, "../info": 16, "./parseDataSet": 19, "./parseSofa": 20, "gl-matrix": 8 }], 18: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.ServerDataBase = void 0;
      var t = /* @__PURE__ */ (function() {
        function S(m, d) {
          for (var g = 0; g < d.length; g++) {
            var P = d[g];
            P.enumerable = P.enumerable || !1, P.configurable = !0, "value" in P && (P.writable = !0), Object.defineProperty(m, P.key, P);
          }
        }
        return function(m, d, g) {
          return d && S(m.prototype, d), g && S(m, g), m;
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
      var r = a("./parseXml"), i = u(r), c = a("./parseDataSet");
      function u(S) {
        return S && S.__esModule ? S : { default: S };
      }
      function o(S, m) {
        if (!(S instanceof m))
          throw new TypeError("Cannot call a class as a function");
      }
      var h = f.ServerDataBase = (function() {
        function S() {
          var m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          if (o(this, S), this._server = m.serverUrl, typeof this._server > "u") {
            var d = window.location.protocol === "https:" ? "https:" : "http:";
            this._server = d + "//bili2.ircam.fr";
          }
          this._catalogue = {}, this._urls = [];
        }
        return t(S, [{
          key: "loadCatalogue",
          value: function() {
            var d = this, g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this._server + "/catalog.xml", P = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this._catalogue, E = new Promise(function(z, y) {
              var v = new window.XMLHttpRequest();
              v.open("GET", g), v.onerror = function() {
                y(new Error("Unable to GET " + g + ", status " + v.status + " " + ("" + v.responseText)));
              }, v.onload = function() {
                if (v.status < 200 || v.status >= 300) {
                  v.onerror();
                  return;
                }
                var R = (0, i.default)(v.response), L = R.querySelector("dataset"), I = R.querySelectorAll("dataset > catalogRef");
                if (I.length === 0) {
                  P.urls = [];
                  for (var l = R.querySelectorAll("dataset > dataset"), w = 0; w < l.length; ++w) {
                    var O = d._server + L.getAttribute("name") + "/" + l[w].getAttribute("name");
                    d._urls.push(O), P.urls.push(O);
                  }
                  z(g);
                } else {
                  for (var j = [], Y = 0; Y < I.length; ++Y) {
                    var W = I[Y].getAttribute("name"), er = d._server + L.getAttribute("name") + "/" + I[Y].getAttribute("xlink:href");
                    P[W] = {}, j.push(d.loadCatalogue(er, P[W]));
                  }
                  Promise.all(j).then(function() {
                    d._urls.sort(), z(g);
                  }).catch(function(mr) {
                    y(mr);
                  });
                }
              }, v.send();
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
            var d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, g = [d.convention, d.dataBase, d.equalisation, d.sampleRate, d.sosOrder], P = typeof d.freePattern == "number" ? d.freePattern.toString() : d.freePattern, E = g.reduce(function(R, L) {
              return R + "/" + (typeof L < "u" ? "[^/]*(?:" + L + ")[^/]*" : "[^/]*");
            }, ""), z = new RegExp(E, "i"), y = this._urls.filter(function(R) {
              return z.test(R);
            });
            if (typeof P < "u") {
              var v = P.split(/\s+/);
              v.forEach(function(R) {
                z = new RegExp(R, "i"), y = y.filter(function(L) {
                  return z.test(L);
                });
              });
            }
            return y;
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
          value: function(d) {
            var g = new Promise(function(P, E) {
              var z = d + ".dds", y = new window.XMLHttpRequest();
              y.open("GET", z), y.onerror = function() {
                E(new Error("Unable to GET " + z + ", status " + y.status + " " + ("" + y.responseText)));
              }, y.onload = function() {
                if (y.status < 200 || y.status >= 300) {
                  y.onerror();
                  return;
                }
                P((0, c.parseDataSet)(y.response));
              }, y.send();
            });
            return g;
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
          value: function(d) {
            var g = new Promise(function(P, E) {
              var z = d + ".json?SourcePosition", y = new window.XMLHttpRequest();
              y.open("GET", z), y.onerror = function() {
                E(new Error("Unable to GET " + z + ", status " + y.status + " " + ("" + y.responseText)));
              }, y.onload = function() {
                if (y.status < 200 || y.status >= 300) {
                  y.onerror();
                  return;
                }
                try {
                  var v = JSON.parse(y.response);
                  if (v.leaves[0].name !== "SourcePosition")
                    throw new Error("SourcePosition not found");
                  P(v.leaves[0].data);
                } catch (R) {
                  E(new Error("Unable to parse response from " + z + ". " + R.message));
                }
              }, y.send();
            });
            return g;
          }
        }]), S;
      })();
      f.default = h;
    }, { "./parseDataSet": 19, "./parseXml": 21 }], 19: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f._parseDimension = m, f._parseDefinition = d, f.parseDataSet = g;
      /**
       * @fileOverview Parser for DDS files
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var t = "\\[\\s*(\\w+)\\s*=\\s*(\\d+)\\s*\\]", r = new RegExp(t, "g"), i = new RegExp(t), c = "\\s*(\\w+)\\s*([\\w.]+)\\s*((?:\\[[^\\]]+\\]\\s*)+);\\s*", u = new RegExp(c, "g"), o = new RegExp(c), h = "\\s*Dataset\\s*\\{\\s*((?:[^;]+;\\s*)*)\\s*\\}\\s*[\\w.]+\\s*;\\s*", S = new RegExp(h);
      function m(P) {
        var E = [], z = P.match(r);
        return z !== null && z.forEach(function(y) {
          var v = i.exec(y);
          v !== null && v.length > 2 && E.push([v[1], Number(v[2])]);
        }), E;
      }
      function d(P) {
        var E = [], z = P.match(u);
        return z !== null && z.forEach(function(y) {
          var v = o.exec(y);
          if (v !== null && v.length > 3) {
            var R = [];
            R[0] = v[2], R[1] = {}, R[1].type = v[1], m(v[3]).forEach(function(L) {
              R[1][L[0]] = L[1];
            }), E.push(R);
          }
        }), E;
      }
      function g(P) {
        var E = {}, z = S.exec(P);
        return z !== null && z.length > 1 && d(z[1]).forEach(function(y) {
          E[y[0]] = y[1];
        }), E;
      }
      f.default = g;
    }, {}], 20: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      }), f.parseSofa = t, f.stringifySofa = r, f.conformSofaCoordinateSystem = i;
      /**
       * @fileOverview Parser functions for SOFA files
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      function t(c) {
        try {
          var u = JSON.parse(c), o = {};
          if (o.name = u.name, typeof u.attributes < "u") {
            o.metaData = {};
            var h = u.attributes.find(function(m) {
              return m.name === "NC_GLOBAL";
            });
            typeof h < "u" && h.attributes.forEach(function(m) {
              o.metaData[m.name] = m.value[0];
            });
          }
          if (typeof u.leaves < "u") {
            var S = u.leaves;
            S.forEach(function(m) {
              o[m.name] = {}, m.attributes.forEach(function(d) {
                o[m.name][d.name] = d.value[0];
              }), o[m.name].shape = m.shape, o[m.name].data = m.data;
            });
          }
          return o;
        } catch (m) {
          throw new Error("Unable to parse SOFA string. " + m.message);
        }
      }
      function r(c) {
        var u = {};
        if (typeof c.name < "u" && (u.name = c.name), typeof c.metaData < "u") {
          u.attributes = [];
          var o = {
            name: "NC_GLOBAL",
            attributes: []
          };
          for (var h in c.metaData)
            c.metaData.hasOwnProperty(h) && o.attributes.push({
              name: h,
              value: [c.metaData[h]]
            });
          u.attributes.push(o);
        }
        var S = "Float64", m = void 0;
        if (u.leaves = [], [["ListenerPosition", "ListenerPositionType"], ["ListenerUp", "ListenerUpType"], ["ListenerView", "ListenerViewType"]].forEach(function(d) {
          var g = d[0], P = c[g], E = c[d[1]];
          if (typeof P < "u") {
            switch (E) {
              case "cartesian":
                m = [{ name: "Type", value: ["cartesian"] }, { name: "Units", value: ["metre, metre, metre"] }];
                break;
              case "spherical":
                m = [{ name: "Type", value: ["spherical"] }, { name: "Units", value: ["degree, degree, metre"] }];
                break;
              default:
                throw new Error("Unknown coordinate system type " + (E + " for " + P));
            }
            u.leaves.push({
              name: g,
              type: S,
              attributes: m,
              shape: [1, 3],
              data: [P]
            });
          }
        }), typeof c.SourcePosition < "u") {
          switch (c.SourcePositionType) {
            case "cartesian":
              m = [{ name: "Type", value: ["cartesian"] }, { name: "Units", value: ["metre, metre, metre"] }];
              break;
            case "spherical":
              m = [{ name: "Type", value: ["spherical"] }, { name: "Units", value: ["degree, degree, metre"] }];
              break;
            default:
              throw new Error("Unknown coordinate system type " + ("" + c.SourcePositionType));
          }
          u.leaves.push({
            name: "SourcePosition",
            type: S,
            attributes: m,
            shape: [c.SourcePosition.length, c.SourcePosition[0].length],
            data: c.SourcePosition
          });
        }
        if (typeof c.DataSamplingRate < "u")
          u.leaves.push({
            name: "Data.SamplingRate",
            type: S,
            attributes: [{ name: "Unit", value: "hertz" }],
            shape: [1],
            data: [c.DataSamplingRate]
          });
        else
          throw new Error("No data sampling-rate");
        if (typeof c.DataDelay < "u" && u.leaves.push({
          name: "Data.Delay",
          type: S,
          attributes: [],
          shape: [1, c.DataDelay.length],
          data: c.DataDelay
        }), typeof c.DataIR < "u")
          u.leaves.push({
            name: "Data.IR",
            type: S,
            attributes: [],
            shape: [c.DataIR.length, c.DataIR[0].length, c.DataIR[0][0].length],
            data: c.DataIR
          });
        else
          throw new Error("No data IR");
        return typeof c.RoomVolume < "u" && u.leaves.push({
          name: "RoomVolume",
          type: S,
          attributes: [{ name: "Units", value: ["cubic metre"] }],
          shape: [1],
          data: [c.RoomVolume]
        }), u.nodes = [], JSON.stringify(u);
      }
      function i(c) {
        var u = void 0;
        switch (c) {
          case "cartesian":
            u = "sofaCartesian";
            break;
          case "spherical":
            u = "sofaSpherical";
            break;
          default:
            throw new Error("Bad SOFA type " + c);
        }
        return u;
      }
      f.default = {
        parseSofa: t,
        conformSofaCoordinateSystem: i
      };
    }, {}], 21: [function(a, n, f) {
      Object.defineProperty(f, "__esModule", {
        value: !0
      });
      /**
       * @fileOverview Simple XML parser, as a DOM parser.
       * @author Jean-Philippe.Lambert@ircam.fr
       * @copyright 2015-2016 IRCAM, Paris, France
       * @license BSD-3-Clause
       */
      var t = f.parseXml = void 0;
      if (typeof window.DOMParser < "u")
        f.parseXml = t = function(i) {
          return new window.DOMParser().parseFromString(i, "text/xml");
        };
      else if (typeof window.ActiveXObject < "u" && new window.ActiveXObject("Microsoft.XMLDOM"))
        f.parseXml = t = function(i) {
          var c = new window.ActiveXObject("Microsoft.XMLDOM");
          return c.async = "false", c.loadXML(i), c;
        };
      else
        throw new Error("No XML parser found");
      f.default = t;
    }, {}] }, {}, [15])(15);
  });
})(serveSofaHrir);
export {
  encodeBufferFromDirection as e,
  getAmbisonicChannelCount as g
};
//# sourceMappingURL=ambisonics.es-Ci32Q6qr.mjs.map
