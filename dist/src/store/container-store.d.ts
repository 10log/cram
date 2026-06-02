import { KeyValuePair } from '../common/key-value-pair';
import { default as Container } from '../objects/container';
import { AllowedNames } from '../common/helpers';
import { Room } from '../objects';
import { default as Solver } from '../compute/solver';
import * as THREE from 'three';
export type ContainerStore = {
    containers: KeyValuePair<Container>;
    selectedObjects: Set<Container>;
    version: number;
    set: SetFunction<ContainerStore>;
    getWorkspace: () => THREE.Object3D | null;
    getRooms: () => Room[];
};
export declare const useContainer: import('zustand').UseBoundStore<import('zustand').StoreApi<ContainerStore>>;
export declare const addContainer: <T extends Container>(ContainerClass: new (...args: any[]) => T) => (container: T | undefined) => void;
export declare const removeContainer: (uuid: keyof ContainerStore["containers"]) => void;
export declare const setContainerProperty: ({ uuid, property, value }: {
    uuid: string;
    property: string;
    value: unknown;
}) => void;
export declare const setNestedContainerProperty: ({ path, property, value }: {
    path: (string | number)[];
    property: string;
    value: unknown;
}) => void;
export declare const callContainerMethod: ({ uuid, method, args }: {
    uuid: string;
    method?: string;
    args?: unknown[];
}) => void;
export declare const getContainerKeys: () => string[];
/**
 * Reset the container store to its initial state.
 * Disposes all containers before clearing.
 */
export declare const resetContainerStore: () => void;
declare global {
    type CallMethodArgs<T extends Object, K extends AllowedNames<T, Function>> = {
        uuid: string;
        method: K;
        isAsync?: boolean;
        args?: T[K] extends (...args: any) => any ? Parameters<T[K]> : never;
    };
    type CallContainerMethod<T extends Container> = CallMethodArgs<T, AllowedNames<T, Function>>;
    type CallSolverMethod<T extends Solver> = CallMethodArgs<T, AllowedNames<T, Function>>;
}
