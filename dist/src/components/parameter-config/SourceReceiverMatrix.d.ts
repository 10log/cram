import { default as React } from 'react';
interface SourceReceiverMatrixProps {
    uuid: string;
    disabled?: boolean;
    eventType?: "RAYTRACER_SET_PROPERTY" | "IMAGESOURCE_SET_PROPERTY" | "BEAMTRACE_SET_PROPERTY" | "ART_SET_PROPERTY";
}
export declare const SourceReceiverMatrix: React.MemoExoticComponent<({ uuid, disabled, eventType }: SourceReceiverMatrixProps) => import("react/jsx-runtime").JSX.Element>;
export default SourceReceiverMatrix;
