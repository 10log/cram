export const rad2deg = (rad: number): number => (180 / Math.PI) * rad;
export const deg2rad = (deg: number): number => (Math.PI / 180) * deg;

export default {
  rad2deg,
  deg2rad
}

