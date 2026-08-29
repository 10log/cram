/**
 * Spherical-wave intensity spreading factor, referenced to 1 m.
 * Intensity falls off as 1/r^2 (pressure as 1/r), so at the 1 m reference
 * distance the factor is 1 and initialSPL is reproduced unchanged.
 */
export declare function spreadingFactor(r: number): number;
