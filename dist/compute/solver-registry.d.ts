import { default as Solver } from './solver';
import { Cram } from '../index';
type SolverFactory = (cram: Cram, props?: Record<string, unknown>) => Promise<Solver>;
/**
 * Register a solver factory function
 */
export declare function registerSolverFactory(kind: string, factory: SolverFactory): void;
/**
 * Create a solver instance by kind using dynamic import
 */
export declare function createSolver(kind: string, cram: Cram, props?: Record<string, unknown>): Promise<Solver>;
/**
 * Check if a solver kind is registered
 */
export declare function hasSolverFactory(kind: string): boolean;
export {};
