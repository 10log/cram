export interface Stat {
    name: string;
    value: number | string;
}
export interface StatsProps {
    data: Stat[];
}
export default function Stats(props: StatsProps): import("react/jsx-runtime").JSX.Element;
