import { Source, Receiver, Surface, Room } from '../../objects';
import { AllowedNames } from '../../common/helpers';
type SetPropertyEventTypes = AllowedNames<EventTypes, SetPropertyPayload<Source>> | AllowedNames<EventTypes, SetPropertyPayload<Receiver>> | AllowedNames<EventTypes, SetPropertyPayload<Surface>> | AllowedNames<EventTypes, SetPropertyPayload<Room>>;
type Containers = Source | Receiver | Surface | Room;
export declare function useContainerProperty<T extends Containers, K extends keyof T>(uuid: string, property: K, event: SetPropertyEventTypes): [T[K], (e: any) => void];
type Option = {
    value: string;
    label: string;
};
type ConnectedPropertyRowInputElement = ({ uuid, property }: {
    uuid: string;
    property: any;
}) => JSX.Element;
type Props<T extends Containers, K extends keyof T> = {
    uuid: string;
    property: K | K[];
    label: string;
    tooltip: string;
    options?: Option[];
};
export declare const createPropertyInput: <T extends Containers>(Element: ConnectedPropertyRowInputElement) => <K extends keyof T>({ uuid, property, label, tooltip, options }: Props<T, K>) => import("react/jsx-runtime").JSX.Element;
export declare const createPropertyInputs: <T extends Containers>(event: SetPropertyEventTypes) => {
    PropertyTextInput: <K extends keyof T>({ uuid, property, label, tooltip, options }: Props<T, K>) => import("react/jsx-runtime").JSX.Element;
    PropertyNumberInput: <K extends keyof T>({ uuid, property, label, tooltip, options }: Props<T, K>) => import("react/jsx-runtime").JSX.Element;
    PropertyCheckboxInput: <K extends keyof T>({ uuid, property, label, tooltip, options }: Props<T, K>) => import("react/jsx-runtime").JSX.Element;
    PropertyVectorInput: <K extends keyof T>({ uuid, property, label, tooltip, options }: Props<T, K>) => import("react/jsx-runtime").JSX.Element;
    PropertySelect: <K extends keyof T>({ uuid, property, label, tooltip, options }: Props<T, K>) => import("react/jsx-runtime").JSX.Element;
};
export {};
