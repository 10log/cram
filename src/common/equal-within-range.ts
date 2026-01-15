

export function equalWithinTolerenceFactory(keys: string[]): (tolerence: number) => (v1: Record<string, number>, v2: Record<string, number>) => boolean;
export function equalWithinTolerenceFactory(): (tolerence: number) => (v1: number, v2: number) => boolean;
export function equalWithinTolerenceFactory(keys?: string[]) {
  if (keys) {
    return (tolerence: number) => (v1: Record<string, number>, v2: Record<string, number>): boolean => {
      return keys.reduce((accum: boolean, key: string) => accum && Math.abs(v1[key] - v2[key]) < tolerence, true);
    };
  }
  return (tolerence: number) => (v1: number, v2: number): boolean => {
    return Math.abs(v1 - v2) < tolerence;
  };
}

export const numbersEqualWithinTolerence = equalWithinTolerenceFactory();


