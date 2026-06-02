/**
 * Convert sound power level to sound pressure level
 * @param Lw sound power level
 * @param r radius
 * @param Q directivity
 */
export declare function Lw2Lp(Lw: number | number[], r?: number, Q?: number): number | number[];
/**
 * Convert sound pressure level to sound power level
 * @param Lp sound pressure level
 * @param r radius
 * @param Q directivity
 */
export declare function Lp2Lw(Lp: number | number[], r?: number, Q?: number): number | number[];
/**
 * Convert pressure to sound pressure level
 * @param P pressure
 */
export declare function P2Lp(P: number | number[]): number | number[];
/**
 * Convert sound pressure level to pressure
 * @param Lp sound pressure level
 */
export declare function Lp2P(Lp: number | number[]): number | number[];
/**
 * Convert Intensity to sound intensity level
 * @param I Intensity
 */
export declare function I2Li(I: number | number[]): number | number[];
/**
 * Convert sound intensity level to Intensity
 * @param Li sound intensity level
 */
export declare function Li2I(Li: number | number[]): number | number[];
/**
 * Convert Power to sound power level
 * @param W Power
 */
export declare function W2Lw(W: number | number[]): number | number[];
/**
 * Convert sound power level to Power
 * @param Lw sound power level
 */
export declare function Lw2W(Lw: number | number[]): number | number[];
/**
 *
 * @param p pressure in Pa
 * @param z0 specific acoustic impedance (400 N·s/m3 for air)
 */
export declare function P2I(p: number | number[], z0?: number): number | number[];
/**
 *
 * @param I intensity in W/m^2
 * @param z0 specific acoustic impedance (400 N·s/m^3 for air)
 */
export declare function I2P(I: number | number[], z0?: number): number | number[];
export declare function Lp2Ln(Lp: number | number[], Ar: number, Ao?: number): number | number[];
