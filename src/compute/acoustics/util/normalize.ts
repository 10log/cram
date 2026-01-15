
export function normalize<T extends ArrayLike<number> & { [index: number]: number }>(arr: T): T {
  let _max = Math.abs(arr[0]);
  for (let i = 1; i < arr.length; i++){
    if (Math.abs(arr[i]) > _max) {
      _max = Math.abs(arr[i]);
    }
  }
  if (_max !== 0) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i] / _max;
    }
  }
  return arr;
}
