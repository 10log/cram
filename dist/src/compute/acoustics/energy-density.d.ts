/** Energy Density Calculation
 * Architectural Acoustics pg. 64 'Energy Density' Marshal Long, Second Edition
 * @function EnergyDensity
 * @param  {Number} E Energy Contained in a Sound Wave
 * @param  {Number} S Measurement Area
 * @param  {Number} c Speed of Sound
 * @param  {Number} t Time
 * @param  {Number} W Power
 * @param  {Number} I Intensity
 * @param  {Number} p Pressure
 * @param  {Number} rho Bulk Density of Medium
 */
declare function EnergyDensity({ E, S, c, t, W, I, p, rho, }: {
    E?: number;
    S?: number;
    c?: number;
    t?: number;
    W?: number;
    I?: number;
    p?: number;
    rho?: number;
}): number;
export default EnergyDensity;
