export const between = (min: number, max: number) => (
  value: number
): boolean => {
  return value <= max && value >= min;
};
