const toString = Object.prototype.toString;

export function kindOf(val: unknown): string {
  if (val === void 0) return "undefined";
  if (val === null) return "null";

  const type = typeof val;
  if (type === "boolean") return "boolean";
  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "symbol") return "symbol";
  if (type === "function") {
    return isGeneratorFn(val) ? "generatorfunction" : "function";
  }

  if (isArray(val)) return "array";
  if (isBuffer(val)) return "buffer";
  if (isArguments(val)) return "arguments";
  if (isDate(val)) return "date";
  if (isError(val)) return "error";
  if (isRegexp(val)) return "regexp";

  switch (ctorName(val)) {
    case "Symbol":
      return "symbol";
    case "Promise":
      return "promise";

    // Set, Map, WeakSet, WeakMap
    case "WeakMap":
      return "weakmap";
    case "WeakSet":
      return "weakset";
    case "Map":
      return "map";
    case "Set":
      return "set";

    // 8-bit typed arrays
    case "Int8Array":
      return "int8array";
    case "Uint8Array":
      return "uint8array";
    case "Uint8ClampedArray":
      return "uint8clampedarray";

    // 16-bit typed arrays
    case "Int16Array":
      return "int16array";
    case "Uint16Array":
      return "uint16array";

    // 32-bit typed arrays
    case "Int32Array":
      return "int32array";
    case "Uint32Array":
      return "uint32array";
    case "Float32Array":
      return "float32array";
    case "Float64Array":
      return "float64array";
  }

  if (isGeneratorObj(val)) {
    return "generator";
  }

  // Non-plain objects
  const toStringType = toString.call(val);
  switch (toStringType) {
    case "[object Object]":
      return "object";
    // iterators
    case "[object Map Iterator]":
      return "mapiterator";
    case "[object Set Iterator]":
      return "setiterator";
    case "[object String Iterator]":
      return "stringiterator";
    case "[object Array Iterator]":
      return "arrayiterator";
  }

  // other
  return toStringType.slice(8, -1).toLowerCase().replace(/\s/g, "");
}

function ctorName(val: unknown): string | null {
  return typeof (val as { constructor?: { name?: string } }).constructor === "function"
    ? (val as { constructor: { name: string } }).constructor.name
    : null;
}

function isArray(val: unknown): val is unknown[] {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}

function isError(val: unknown): val is Error {
  return (
    val instanceof Error ||
    (typeof (val as Error).message === "string" &&
     (val as { constructor?: { stackTraceLimit?: number } }).constructor !== undefined &&
     typeof (val as { constructor: { stackTraceLimit?: number } }).constructor.stackTraceLimit === "number")
  );
}

function isDate(val: unknown): val is Date {
  if (val instanceof Date) return true;
  const d = val as { toDateString?: unknown; getDate?: unknown; setDate?: unknown };
  return (
    typeof d.toDateString === "function" && typeof d.getDate === "function" && typeof d.setDate === "function"
  );
}

function isRegexp(val: unknown): val is RegExp {
  if (val instanceof RegExp) return true;
  const r = val as { flags?: unknown; ignoreCase?: unknown; multiline?: unknown; global?: unknown };
  return (
    typeof r.flags === "string" &&
    typeof r.ignoreCase === "boolean" &&
    typeof r.multiline === "boolean" &&
    typeof r.global === "boolean"
  );
}

function isGeneratorFn(val: unknown): boolean {
  return ctorName(val) === "GeneratorFunction";
}

function isGeneratorObj(val: unknown): boolean {
  const g = val as { throw?: unknown; return?: unknown; next?: unknown };
  return typeof g.throw === "function" && typeof g.return === "function" && typeof g.next === "function";
}

function isArguments(val: unknown): boolean {
  try {
    const a = val as { length?: unknown; callee?: unknown };
    if (typeof a.length === "number" && typeof a.callee === "function") {
      return true;
    }
  } catch (err) {
    if (err instanceof Error && err.message.indexOf("callee") !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val: unknown): boolean {
  const b = val as { constructor?: { isBuffer?: (v: unknown) => boolean } };
  if (b.constructor && typeof b.constructor.isBuffer === "function") {
    return b.constructor.isBuffer(val);
  }
  return false;
}

export default kindOf;
