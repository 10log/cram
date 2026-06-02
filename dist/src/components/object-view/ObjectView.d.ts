import { default as React } from 'react';
import { default as Container } from '../../objects/container';
export interface MapChildrenProps {
    parent: string;
    container: Container;
    expanded: string[];
    setExpanded: (value: React.SetStateAction<string[]>) => void;
}
export default function ObjectView(): React.JSX.Element;
