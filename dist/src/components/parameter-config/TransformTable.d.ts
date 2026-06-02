type SetPropertyEvent = "ROOM_SET_PROPERTY" | "SOURCE_SET_PROPERTY" | "RECEIVER_SET_PROPERTY" | "SURFACE_SET_PROPERTY";
interface TransformTableProps {
    uuid: string;
    event: SetPropertyEvent;
}
export default function TransformTable({ uuid, event }: TransformTableProps): import("react/jsx-runtime").JSX.Element;
export {};
