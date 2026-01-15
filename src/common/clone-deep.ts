import clone from "./shallow-clone";
import kindOf from "./kind-of";
import isPlainObject from "./is-plain-object";

type InstanceCloneFn = ((val: unknown) => unknown) | boolean;

export function cloneDeep<T>(val: T, instanceClone?: InstanceCloneFn): T {
  switch (kindOf(val)) {
    case "object":
      return cloneObjectDeep(val, instanceClone) as T;
    case "array":
      return cloneArrayDeep(val as unknown[], instanceClone) as T;
    default: {
      return clone(val);
    }
  }
}

export function cloneObjectDeep<T>(val: T, instanceClone?: InstanceCloneFn): T {
  if (typeof instanceClone === "function") {
    return instanceClone(val) as T;
  }
  if (instanceClone || isPlainObject(val)) {
    const res = new (val as { constructor: new () => T }).constructor();
    for (const key in val) {
      (res as Record<string, unknown>)[key] = cloneDeep((val as Record<string, unknown>)[key], instanceClone);
    }
    return res;
  }
  return val;
}

export function cloneArrayDeep<T>(val: T[], instanceClone?: InstanceCloneFn): T[] {
  const res = new (val as unknown as { constructor: new (len: number) => T[] }).constructor(val.length);
  for (let i = 0; i < val.length; i++) {
    res[i] = cloneDeep(val[i], instanceClone);
  }
  return res;
}

export default cloneDeep;
