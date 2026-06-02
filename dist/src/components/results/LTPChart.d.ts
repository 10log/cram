import { default as React } from 'react';
type ChartMode = 'ltp' | 'etc';
type YRange = 'auto' | 10 | 20 | 30;
export type LTPChartProps = {
    uuid: string;
    width?: number;
    height?: number;
    events?: boolean;
    plotOrders?: number[];
    solverKind?: string;
    chartMode?: ChartMode;
    yRange?: YRange;
};
export declare const LTPChart: ({ uuid, width, height, events }: LTPChartProps) => React.JSX.Element | null;
export default LTPChart;
