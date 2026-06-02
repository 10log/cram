import { default as React } from 'react';
export interface Stat {
    name: string;
    value: number | string;
}
export interface StatsProps {
    data: Stat[];
}
export default function Stats(props: StatsProps): React.JSX.Element;
