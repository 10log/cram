export type BarGroupProps = {
    uuid: string;
    width?: number;
    height?: number;
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    events?: boolean;
};
export interface RTData {
    frequency: number;
    sabine: number;
    eyring: number;
    ap: number;
}
export declare const background = "#612efb";
export declare const Chart: ({ uuid, width, height, events, }: BarGroupProps) => import("react/jsx-runtime").JSX.Element | null;
export declare const RT60Chart: ({ uuid, width, height, events, }: BarGroupProps) => import("react/jsx-runtime").JSX.Element | null;
export default RT60Chart;
