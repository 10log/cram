import { FullOptions, Searcher } from 'fast-fuzzy';
import { AcousticMaterial } from '../db/acoustic-material';
import { default as Surface } from '../objects/surface';
export type MaterialStore = {
    materials: Map<string, AcousticMaterial>;
    materialSearcher: Searcher<AcousticMaterial, FullOptions<AcousticMaterial>>;
    search: (query: string) => ReturnType<MaterialStore["materialSearcher"]["search"]>;
    set: SetFunction<MaterialStore>;
    bufferLength: number;
    selectedMaterial: string;
    query: string;
};
export declare const useMaterial: import('zustand').UseBoundStore<import('zustand').StoreApi<MaterialStore>>;
declare global {
    interface EventTypes {
        ASSIGN_MATERIAL: {
            material: AcousticMaterial;
            target: Surface | Surface[];
        };
    }
}
/**
 * Reset the material store to its initial state.
 * Note: Materials are loaded from static JSON, so we just reset user state.
 */
export declare const resetMaterialStore: () => void;
