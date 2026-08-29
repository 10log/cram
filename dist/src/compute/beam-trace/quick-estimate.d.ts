import { default as Source } from '../../objects/source';
import { default as Room } from '../../objects/room';
import { QuickEstimateStepResult } from '../shared/quick-estimate-types';
import * as THREE from "three";
export interface QuickEstimateHost {
    uuid: string;
    sourceIDs: string[];
    frequencies: number[];
    temperature: number;
    room: Room | undefined;
    _raycaster: THREE.Raycaster;
    _quickEstimateInterval: number | null;
    quickEstimateResults: QuickEstimateStepResult[];
    estimatedT30: number[] | null;
}
export declare function startQuickEstimate(host: QuickEstimateHost, source: Source | undefined, numRays?: number): void;
