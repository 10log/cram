import kindOf from "./kind-of";
const valueOf = Symbol.prototype.valueOf;

export function clone<T>(val: T): T {
  switch (kindOf(val)) {
    case "array":
      return (val as unknown as unknown[]).slice() as T;
    case "object":
      return Object.assign({}, val);
    case "date":
      return new (val as unknown as { constructor: new (n: number) => T }).constructor(Number(val));
    case "map":
      return new Map(val as unknown as Map<unknown, unknown>) as T;
    case "set":
      return new Set(val as unknown as Set<unknown>) as T;
    case "buffer":
      return cloneBuffer(val as unknown as Buffer) as T;
    case "symbol":
      return cloneSymbol(val) as T;
    case "arraybuffer":
      return cloneArrayBuffer(val as unknown as ArrayBuffer) as T;
    case "float32array":
    case "float64array":
    case "int16array":
    case "int32array":
    case "int8array":
    case "uint16array":
    case "uint32array":
    case "uint8clampedarray":
    case "uint8array":
      return cloneTypedArray(val as unknown as TypedArray) as T;
    case "regexp":
      return cloneRegExp(val as unknown as RegExp) as T;
    case "error":
      return Object.create(val as object) as T;
    default: {
      return val;
    }
  }
}

type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

function cloneRegExp(val: RegExp): RegExp {
  const flags = val.flags !== void 0 ? val.flags : (/\w+$/.exec(val.toString()) || [""])[0];
  const re = new RegExp(val.source, flags);
  re.lastIndex = val.lastIndex;
  return re;
}

function cloneArrayBuffer(val: ArrayBuffer): ArrayBuffer {
  const res = new ArrayBuffer(val.byteLength);
  new Uint8Array(res).set(new Uint8Array(val));
  return res;
}

function cloneTypedArray(val: TypedArray): TypedArray {
  return new (val.constructor as new (buffer: ArrayBuffer, byteOffset: number, length: number) => TypedArray)(
    val.buffer as ArrayBuffer,
    val.byteOffset,
    val.length
  );
}

function cloneBuffer(val: Buffer): Buffer {
  const len = val.length;
  const buf = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(val);
  val.copy(buf);
  return buf;
}

function cloneSymbol(val: unknown): object {
  return valueOf ? Object(valueOf.call(val)) : {};
}

export default clone;
