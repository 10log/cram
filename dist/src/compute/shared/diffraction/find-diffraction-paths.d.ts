import { DiffractionPath, EdgeGraph } from './types';
/**
 * Diffraction path enumeration: finds valid source→edge→receiver paths.
 *
 * For each (source, edge, receiver) triple, finds the Fermat-principle
 * diffraction point on the edge, checks line-of-sight on both legs,
 * and computes UTD diffraction coefficients per frequency band.
 */
import * as THREE from "three";
/**
 * Find the diffraction point on an edge segment using Fermat's principle.
 *
 * The point that minimizes total path length source→point→receiver lies
 * where the projection onto the edge balances the angular requirement.
 * For a finite-length edge, this is solved by minimizing
 * |S - P(t)| + |P(t) - R| where P(t) = start + t*(end-start), t ∈ [0,1].
 *
 * Uses analytical projection: the minimum of f(t) = |S-P(t)| + |P(t)-R|
 * can be found by binary search or by the "unfolding" approach.
 * Here we use a simple iterative bisection for robustness.
 *
 * @param edgeStart - Start of edge segment
 * @param edgeEnd - End of edge segment
 * @param sourcePos - Source position
 * @param receiverPos - Receiver position
 * @returns Diffraction point on the edge
 */
export declare function findDiffractionPoint(edgeStart: [number, number, number], edgeEnd: [number, number, number], sourcePos: [number, number, number], receiverPos: [number, number, number]): [number, number, number];
/**
 * Check line-of-sight between two points using raycasting.
 *
 * @param from - Start point
 * @param to - End point
 * @param raycaster - THREE.Raycaster instance
 * @param objects - Intersectable surface objects
 * @param tolerance - Distance tolerance for self-intersection avoidance
 * @returns true if line of sight is clear
 */
export declare function hasLineOfSight(from: [number, number, number], to: [number, number, number], raycaster: THREE.Raycaster, objects: Array<THREE.Mesh | THREE.Object3D>, tolerance?: number): boolean;
/**
 * Find all valid first-order diffraction paths in the scene.
 *
 * @param edgeGraph - Graph of diffracting edges
 * @param sourcePositions - Map of source UUID → world position
 * @param receiverPositions - Map of receiver UUID → world position
 * @param frequencies - Octave band center frequencies
 * @param soundSpeed - Speed of sound in m/s
 * @param temperature - Temperature in °C (for air absorption)
 * @param raycaster - THREE.Raycaster for LOS checks
 * @param surfaceObjects - Intersectable surface meshes
 * @returns Array of valid diffraction paths
 */
export declare function findDiffractionPaths(edgeGraph: EdgeGraph, sourcePositions: Map<string, [number, number, number]>, receiverPositions: Map<string, [number, number, number]>, frequencies: number[], soundSpeed: number, temperature: number, raycaster: THREE.Raycaster, surfaceObjects: Array<THREE.Mesh | THREE.Object3D>): DiffractionPath[];
