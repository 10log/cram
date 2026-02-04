/**
 * Solver Registry - Dynamic import loaders for code splitting
 *
 * This registry enables lazy loading of solver modules to reduce
 * initial bundle size. Solvers are only loaded when actually needed.
 */

import type Solver from "./solver";
import type { Cram } from "../index";

type SolverFactory = (cram: Cram, props?: Record<string, unknown>) => Promise<Solver>;

const solverFactories = new Map<string, SolverFactory>();

/**
 * Register a solver factory function
 */
export function registerSolverFactory(kind: string, factory: SolverFactory): void {
  solverFactories.set(kind, factory);
}

/**
 * Create a solver instance by kind using dynamic import
 */
export async function createSolver(
  kind: string,
  cram: Cram,
  props?: Record<string, unknown>
): Promise<Solver> {
  const factory = solverFactories.get(kind);
  if (!factory) {
    throw new Error(`Unknown solver type: ${kind}`);
  }
  return factory(cram, props);
}

/**
 * Check if a solver kind is registered
 */
export function hasSolverFactory(kind: string): boolean {
  return solverFactories.has(kind);
}

// Register all solver factories with dynamic imports
// These imports only execute when the factory is called

registerSolverFactory("ray-tracer", async (_cram, props) => {
  const { default: RayTracer } = await import("./raytracer");
  return new RayTracer(props);
});

registerSolverFactory("image-source", async (_cram, _props) => {
  const { ImageSourceSolver } = await import("./raytracer/image-source");
  const defaults = {
    name: "Image Source",
    roomID: "",
    sourceIDs: [] as string[],
    surfaceIDs: [] as string[],
    receiverIDs: [] as string[],
    maxReflectionOrder: 2,
    imageSourcesVisible: false,
    rayPathsVisible: true,
    plotOrders: [0, 1, 2],
    frequencies: [125, 250, 500, 1000, 2000, 4000, 8000],
  };
  return new ImageSourceSolver(defaults);
});

registerSolverFactory("rt60", async (_cram, _props) => {
  const { default: RT60 } = await import("./rt");
  return new RT60();
});

registerSolverFactory("energydecay", async (_cram, _props) => {
  const { default: EnergyDecay } = await import("./energy-decay");
  return new EnergyDecay();
});

registerSolverFactory("fdtd-2d", async (_cram, _props) => {
  const { default: FDTD_2D } = await import("./2d-fdtd");
  return new FDTD_2D();
});

registerSolverFactory("beam-trace", async (_cram, _props) => {
  const { BeamTraceSolver } = await import("./beam-trace");
  return new BeamTraceSolver();
});

registerSolverFactory("art", async (_cram, _props) => {
  const { ART } = await import("./radiance/art");
  return new ART();
});
