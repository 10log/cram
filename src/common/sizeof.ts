export function sizeof(object: unknown): number {
  const objectList: unknown[] = [];
  const stack: unknown[] = [object];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    if (typeof value === "boolean") {
      bytes += 4;
    } else if (typeof value === "string") {
      bytes += value.length * 2;
    } else if (typeof value === "number") {
      bytes += 8;
    } else if (typeof value === "object" && value !== null && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (const i in value) {
        stack.push((value as Record<string, unknown>)[i]);
      }
    }
  }
  return bytes;
}

export default {
  sizeof
};
