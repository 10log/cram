import { create } from 'zustand';
import { produce, enableMapSet } from 'immer';
import * as THREE from 'three';

// Enable Immer's MapSet plugin for Set/Map support in store
enableMapSet();
import { KeyValuePair } from "../common/key-value-pair";
import Container from "../objects/container";
import { AllowedNames, omit, reach } from '../common/helpers';
import { Room } from "../objects";
import Solver from "../compute/solver";
import { emit } from "../messenger";

export type ContainerStore = {
  containers: KeyValuePair<Container>;
  selectedObjects: Set<Container>;
  version: number;
  set: SetFunction<ContainerStore>;
  getWorkspace: () => THREE.Object3D | null;
  getRooms: () => Room[];
};

const getWorkspace = (containers: KeyValuePair<Container>) => {
  const keys= Object.keys(containers);
  if(keys.length > 0){
    let parent = containers[keys[0]] as THREE.Object3D;
    while(parent.parent && !parent.userData.hasOwnProperty("isWorkspace")){
      parent = parent.parent;
    }
    return parent;
  }
  return null;
}

const getRoomKeys = (containers: KeyValuePair<Container>) => {
  return Object.keys(containers).filter(key=>containers[key].kind === "room")
}

const getRooms = (containers: KeyValuePair<Container>) => {
  return getRoomKeys(containers).map(key=>containers[key] as Room);
} 

export const useContainer = create<ContainerStore>((set, get) => ({
  containers: {},
  selectedObjects: new Set(),
  version: 0,
  set: (fn) => set(produce(fn)),
  getWorkspace: () => getWorkspace(get().containers),
  getRooms: () => getRooms(get().containers),
}));

export const addContainer = <T extends Container>(ContainerClass: new(...args: any[]) => T) => (container: T|undefined) => {
  const c = container || new ContainerClass() as T;
  useContainer.setState((state) => ({
    ...state,
    containers: {
      ...state.containers,
      [c!.uuid]: c
    }
  }), true);
  emit("MARK_DIRTY", undefined);
};

export const removeContainer = (uuid: keyof ContainerStore['containers']) => {
  if(useContainer.getState().containers[uuid]){
    useContainer.getState().containers[uuid].dispose();
    // console.log(uuid);
    useContainer.getState().set(store=>{
      store.selectedObjects.delete(useContainer.getState().containers[uuid]);
    });
    useContainer.setState(state => ({
      ...state,
      containers: omit([uuid], state.containers)
    }), true);
    emit("MARK_DIRTY", undefined);
  }
}


export const setContainerProperty = ({uuid, property, value}: {uuid: string, property: string, value: unknown}) => {
  // Access the actual container instance directly (not through Immer draft)
  // so that class setters (like position.setX) are properly invoked
  const container = useContainer.getState().containers[uuid];
  if (container) {
    (container as unknown as Record<string, unknown>)[property] = value;
  }
  // Update version to trigger re-renders
  useContainer.getState().set(store => {
    store.version++;
  });
  // Request a render to update the Three.js view
  emit("RENDER", undefined);
  emit("MARK_DIRTY", undefined);
}

export const setNestedContainerProperty = ({path, property, value}: {path: (string | number)[], property: string, value: unknown}) => {
  useContainer.getState().set(store => {
    const container = reach(store.containers, path) as Record<string, unknown> | undefined;
    if(container && container.hasOwnProperty(property)){
      container[property] = value;
    }
  });
  emit("MARK_DIRTY", undefined);
}

export const callContainerMethod = ({uuid, method, args = []}: {uuid: string, method?: string, args?: unknown[]}) => {
  if (!method) return;
  useContainer.getState().set(store => {
    const container = store.containers[uuid] as unknown as Record<string, (...args: unknown[]) => unknown>;
    container[method](...args);
  });
}


export const getContainerKeys = () => Object.keys(useContainer.getState().containers);

/**
 * Reset the container store to its initial state.
 * Disposes all containers before clearing.
 */
export const resetContainerStore = () => {
  // Dispose all containers to clean up Three.js resources
  const { containers, selectedObjects } = useContainer.getState();
  Object.values(containers).forEach(container => {
    try {
      container.dispose();
    } catch (e) {
      console.warn('[ContainerStore] Error disposing container:', e);
    }
  });
  selectedObjects.clear();

  // Reset to initial state (partial update to preserve methods)
  useContainer.setState({
    containers: {},
    selectedObjects: new Set(),
    version: 0,
  });

  console.log('[ContainerStore] Reset complete');
};

declare global {
  type CallMethodArgs<T extends Object, K extends AllowedNames<T, Function>> = {
    uuid: string;
    method: K;
    isAsync?: boolean;
    args?: T[K] extends (...args: any) => any ? Parameters<T[K]> : never
  }
  type CallContainerMethod<T extends Container> = CallMethodArgs<T, AllowedNames<T, Function>>;
  type CallSolverMethod<T extends Solver> = CallMethodArgs<T, AllowedNames<T, Function>>;
}

