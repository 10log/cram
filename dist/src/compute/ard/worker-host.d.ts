/**
 * Construction of the ARD simulation worker.
 *
 * A module of its own so the solver's worker-protocol handling can be tested.
 * `Worker` is absent under jsdom and Node, so a test that imports the solver
 * directly always takes the inline path and never exercises the parts that
 * matter most — the mid-run crash that must *not* restart the time loop on the
 * main thread, and the never-started failure that must fall back exactly once.
 * Mocking one named export is a smaller seam than threading a factory through
 * the solver's constructor.
 */
/** A worker for the ARD time loop, or `null` where there is none. */
export declare function createArdWorker(): Worker | null;
