import { default as React } from 'react';
export interface ObjectCardProps {
    uuid: string;
    defaultExpanded?: boolean;
    isChild?: boolean;
}
export default function ObjectCard({ uuid, defaultExpanded, isChild }: ObjectCardProps): React.JSX.Element | null;
