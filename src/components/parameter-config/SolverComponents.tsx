import React from "react";
import { emit } from "../../messenger";
import { useSolver } from "../../store";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import PropertyRowButton from "./property-row/PropertyRowButton";
import { PropertyRowCheckbox } from "./property-row/PropertyRowCheckbox";
import { PropertyRowTextInput } from "./property-row/PropertyRowTextInput";
import { PropertyRowNumberInput } from "./property-row/PropertyRowNumberInput";
import RayTracer from "../../compute/raytracer";
import FDTD_2D from "../../compute/2d-fdtd"
import {AllowedNames } from '../../common/helpers';
import { ImageSourceSolver } from "../../compute/raytracer/image-source";
import RT60 from "../../compute/rt";
import ART from "../../compute/radiance/art";
import EnergyDecay from "../../compute/energy-decay";

type SetPropertyEventTypes =
  | AllowedNames<EventTypes, SetPropertyPayload<FDTD_2D>>
  | AllowedNames<EventTypes, SetPropertyPayload<RayTracer>>
  | AllowedNames<EventTypes, SetPropertyPayload<ImageSourceSolver>>
  | AllowedNames<EventTypes, SetPropertyPayload<RT60>>
  | AllowedNames<EventTypes, SetPropertyPayload<EnergyDecay>>
  | AllowedNames<EventTypes, SetPropertyPayload<ART>>

export function useSolverProperty<T extends RayTracer | FDTD_2D|ImageSourceSolver|RT60|EnergyDecay|ART, K extends keyof T>(
  uuid: string,
  property: K,
  event: SetPropertyEventTypes
) {
  // Include version in selector to force re-render when properties change
  const value = useSolver<T[K]>(
    (state) => {
      // Access state.version to ensure selector subscribes to version changes (triggers re-render)
      const _version = state.version;
      return (state.solvers[uuid] as T)[property];
    }
  );
  //@ts-ignore
  const changeHandler = (e: any) => emit(event, { uuid, property, value: e.value });

  return [value, changeHandler] as [typeof value, typeof changeHandler];
}

type PropertyRowInputElement = ({ value, onChange }: { value: any, onChange: any }) => JSX.Element;
type Props<T extends RayTracer | FDTD_2D|ImageSourceSolver|RT60|EnergyDecay|ART, K extends keyof T> = {
  uuid: string;
  property: K;
  label: string;
  tooltip: string;
  elementProps?: {
    [key: string]: any
  }
};

export const createPropertyInput = <T extends RayTracer | FDTD_2D|ImageSourceSolver|RT60|EnergyDecay|ART>(
  event: SetPropertyEventTypes,
  Element: PropertyRowInputElement
) => <K extends keyof T>({ uuid, property, label, tooltip, elementProps }: Props<T, K>) => {
  const [state, changeHandler] = useSolverProperty<T, K>(uuid, property, event);
  return (
    <PropertyRow>
      <PropertyRowLabel label={label} hasToolTip tooltip={tooltip} />
      <Element value={state} onChange={changeHandler} {...elementProps} />
    </PropertyRow>
  );
};

export const createPropertyInputs = <T extends RayTracer|FDTD_2D|ImageSourceSolver|RT60|EnergyDecay|ART>(event: SetPropertyEventTypes) => ({
  PropertyTextInput: createPropertyInput<T>(event, PropertyRowTextInput),
  PropertyNumberInput: createPropertyInput<T>(event, PropertyRowNumberInput),
  PropertyCheckboxInput: createPropertyInput<T>(event, PropertyRowCheckbox),
})

export const PropertyButton = <T extends keyof EventTypes>({
  args,
  event,
  label,
  tooltip,
  disabled,
}: {
  args: EventTypes[T];
  event: T;
  label: string;
  tooltip: string;
  disabled?: boolean;
}) => {
  return (
    <PropertyRow>
      <PropertyRowLabel label={label} hasToolTip tooltip={tooltip} />
      <PropertyRowButton onClick={(_e) => emit(event, args)} label={label} disabled={disabled} />
    </PropertyRow>
  );
};
