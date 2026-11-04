export function atPath(path: Array<number | string>, object: any): undefined | any {
  let obj = object;
  for (const key of path) {
    if (Object.hasOwn(obj, key)) {
      obj = obj[key];
    } else {
      return undefined;
    }
  }
  return obj;
}

export default atPath;
