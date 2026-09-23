/**
 * Constants the solver uses that are worth importing without it.
 *
 * `index.ts` pulls in three.js, the renderer and the container store, so a
 * headless test cannot import it for a number. These live here and `index.ts`
 * re-exports them, so there is still one definition.
 */
/**
 * Velocity sponge applied every step. 1 is off, which is the default now that
 * surfaces carry their own absorption.
 *
 * At 0.9999 — the old default — the sponge *was* the room's reverberation, and
 * because `dt = dx/(c·√2)` the steps per simulated second go as `1/dx`: the
 * imposed T60 was 71 s at half-metre cells, 5.6 s at the 0.039 m default and
 * 2.8 s at half of that. Refining the grid changed the answer.
 *
 * It is also only conditionally stable, which was not known before #199 went
 * looking. The scheme runs at `C = 1/√2` exactly, where the grid's checkerboard
 * mode sits on the unit circle; damping velocity pushes it off. Whether that
 * shows up depends on how close a domain's discrete spectrum reaches towards
 * Nyquist, which is to say on how many cells it has — measured on a 6 x 4 m
 * room, 0.999 decays at 8 cm cells and diverges at 6, 4 and 3 cm. The slider's
 * range is bounded accordingly; 1 is the only value safe at every grid.
 */
export declare const DEFAULT_DAMPING = 1;
/**
 * Frequency at which a surface's absorption is read for the wall impedance.
 *
 * One run is broadband, so one coefficient has to stand in for the curve; 500
 * Hz is the usual mid-band choice and the one `ARD` makes for the same reason.
 */
export declare const FDTD_REFERENCE_FREQUENCY = 500;
