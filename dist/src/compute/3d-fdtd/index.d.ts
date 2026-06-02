/**
 *
 * Wave number is the magnitude of the wave vector
 *    k = ω/c
 *
 * Magnitude of the ratio between pressure and velocity
 *    |P/v| = ρc
 *
 * Characteristic impedance
 *    Z = ρc
 *
 * the pressure nodes are offset a half time-step
 *
 */
export declare class FDTD_3D {
    gpu: any;
    nx: number;
    ny: number;
    nz: number;
    n: number;
    Po: Float32Array;
    Vx: Float32Array;
    Vy: Float32Array;
    Vz: Float32Array;
    rho: Float32Array;
    cr: Float32Array;
    c0: number;
    dt: number;
    dx: number;
    Sc: number;
    megaKernel: any;
    constructor();
    step(): void;
}
export default FDTD_3D;
