export function isPlainObject(o: unknown): boolean {
  if (Object.prototype.toString.call(o) !== "[object Object]") return false;

  // If has modified constructor
  const ctor = (o as Record<string, unknown>).constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  const prot = ctor.prototype;
  if (Object.prototype.toString.call(o) !== "[object Object]") return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

export default isPlainObject;
