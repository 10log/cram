import { default as RayTracer } from '../../compute/raytracer';
import { default as FDTD_2D } from '../../compute/2d-fdtd';
import { AllowedNames } from '../../common/helpers';
import { ImageSourceSolver } from '../../compute/raytracer/image-source';
import { default as RT60 } from '../../compute/rt';
import { default as ART } from '../../compute/radiance/art';
import { default as EnergyDecay } from '../../compute/energy-decay';
import { BeamTraceSolver } from '../../compute/beam-trace';
type SetPropertyEventTypes = AllowedNames<EventTypes, SetPropertyPayload<FDTD_2D>> | AllowedNames<EventTypes, SetPropertyPayload<RayTracer>> | AllowedNames<EventTypes, SetPropertyPayload<ImageSourceSolver>> | AllowedNames<EventTypes, SetPropertyPayload<RT60>> | AllowedNames<EventTypes, SetPropertyPayload<EnergyDecay>> | AllowedNames<EventTypes, SetPropertyPayload<ART>> | AllowedNames<EventTypes, SetPropertyPayload<BeamTraceSolver>>;
export declare function useSolverProperty<T extends RayTracer | FDTD_2D | ImageSourceSolver | RT60 | EnergyDecay | ART | BeamTraceSolver, K extends keyof T>(uuid: string, property: K, event: SetPropertyEventTypes): [T[K] | undefined, (e: any) => void];
type PropertyRowInputElement = ({ value, onChange }: {
    value: any;
    onChange: any;
}) => JSX.Element;
type Props<T extends RayTracer | FDTD_2D | ImageSourceSolver | RT60 | EnergyDecay | ART | BeamTraceSolver, K extends keyof T> = {
    uuid: string;
    property: K;
    label: string;
    tooltip: string;
    elementProps?: {
        [key: string]: any;
    };
};
export declare const createPropertyInput: <T extends RayTracer | FDTD_2D | ImageSourceSolver | RT60 | EnergyDecay | ART | BeamTraceSolver>(event: SetPropertyEventTypes, Element: PropertyRowInputElement) => <K extends keyof T>({ uuid, property, label, tooltip, elementProps }: Props<T, K>) => import("react/jsx-runtime").JSX.Element;
export declare const createPropertyInputs: <T extends RayTracer | FDTD_2D | ImageSourceSolver | RT60 | EnergyDecay | ART | BeamTraceSolver>(event: SetPropertyEventTypes) => {
    PropertyTextInput: <K extends keyof T>({ uuid, property, label, tooltip, elementProps }: Props<T, K>) => import("react/jsx-runtime").JSX.Element;
    PropertyNumberInput: <K extends keyof T>({ uuid, property, label, tooltip, elementProps }: Props<T, K>) => import("react/jsx-runtime").JSX.Element;
    PropertyCheckboxInput: <K extends keyof T>({ uuid, property, label, tooltip, elementProps }: Props<T, K>) => import("react/jsx-runtime").JSX.Element;
};
export declare const PropertyButton: <T extends keyof EventTypes>({ args, event, label, tooltip, disabled, }: {
    args: EventTypes[T];
    event: T;
    label: string;
    tooltip: string;
    disabled?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export {};
