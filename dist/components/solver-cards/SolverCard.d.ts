import { default as React } from 'react';
export interface SolverCardProps {
    uuid: string;
    defaultExpanded?: boolean;
}
export default function SolverCard({ uuid, defaultExpanded }: SolverCardProps): React.JSX.Element | null;
