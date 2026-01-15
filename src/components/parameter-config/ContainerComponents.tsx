// @ts-nocheck
import React from "react";
import { emit } from "../../messenger";
import { Source, Receiver, Surface, Room } from "../../objects";
import { useContainer } from "../../store";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import { PropertyRowCheckbox } from "./property-row/PropertyRowCheckbox";
import { PropertyRowTextInput } from "./property-row/PropertyRowTextInput";
import { PropertyRowNumberInput } from "./property-row/PropertyRowNumberInput";
import { AllowedNames, ensureArray } from '../../common/helpers';
import { PropertyRowVectorInput } from "./property-row/PropertyRowVectorInput";
import { PropertyRowSelect } from "./property-row/PropertyRowSelect";


type SetPropertyEventTypes =
  | AllowedNames<EventTypes, SetPropertyPayload<Source>>
  | AllowedNames<EventTypes, SetPropertyPayload<Receiver>>
  | AllowedNames<EventTypes, SetPropertyPayload<Surface>>
  | AllowedNames<EventTypes, SetPropertyPayload<Room>>;

type Containers = Source | Receiver | Surface | Room;

export function useContainerProperty<T extends Containers, K extends keyof T>(
  uuid: string,
  property: K,
  event: SetPropertyEventTypes
) {
  // Include version in selector to force re-render when properties change
  const value = useContainer<T[K]>(
    (state) => {
      // Access version to subscribe to changes (unused but triggers re-render)
      void state.version;
      return (state.containers[uuid] as T)[property];
    }
  );
  //@ts-ignore
  const changeHandler = (e: any) => emit(event, { uuid, property, value: e.value });

  return [value, changeHandler] as [typeof value, typeof changeHandler];
}

type Option =  { value: string, label: string }

type PropertyRowInputElement = ({ value, onChange, options }: { value: any, onChange: any, options?: Option[]}) => JSX.Element;
type ConnectedPropertyRowInputElement = ({ uuid, property }: { uuid: string, property: any }) => JSX.Element;
const connectComponent = <T extends Containers>(
  event: SetPropertyEventTypes,
  Element: PropertyRowInputElement
) => <K extends keyof T>({ uuid, property, options }: {
  uuid: string;
  property: K;
  options?: Option[];
}) => {
  const [state, changeHandler] = useContainerProperty<T, K>(uuid, property, event);
  return <Element value={state} onChange={changeHandler} {...{ options }} />
};



type Props<T extends Containers, K extends keyof T> = {
  uuid: string;
  property: K | K[];
  label: string;
  tooltip: string;
  options?: Option[]
};

export const createPropertyInput = <T extends Containers>(
  Element: ConnectedPropertyRowInputElement
  ) => <K extends keyof T>({ uuid, property, label, tooltip, options }: Props<T, K>) => {
    return (
      <PropertyRow>
        <PropertyRowLabel label={label} hasToolTip tooltip={tooltip} />
        <div>{ensureArray(property).map((prop, index) => <Element uuid={uuid} property={prop} key={`${uuid}-${String(prop)}-${index}`} {...{options}}/>)}</div>
      </PropertyRow>
  );
};

export const createPropertyInputs = <T extends Containers>(event: SetPropertyEventTypes) => ({
  PropertyTextInput: createPropertyInput<T>(connectComponent<T>(event, PropertyRowTextInput)),
  PropertyNumberInput: createPropertyInput<T>(connectComponent<T>(event, PropertyRowNumberInput)),
  PropertyCheckboxInput: createPropertyInput<T>(connectComponent<T>(event, PropertyRowCheckbox)),
  PropertyVectorInput: createPropertyInput<T>(connectComponent<T>(event, PropertyRowVectorInput)),
  PropertySelect: createPropertyInput<T>(connectComponent<T>(event, PropertyRowSelect)),
})

