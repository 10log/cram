import { default as React } from 'react';
export interface PropertyRowFolderProps {
    label: string;
    open: boolean;
    children: React.ReactNode;
    id?: string;
    onOpenClose: (id?: string) => void;
}
export default function PropertyRowFolder(props: PropertyRowFolderProps): import("react/jsx-runtime").JSX.Element;
