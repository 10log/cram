import { default as chroma } from 'chroma-js';
export type Absorption = {
    "63": number;
    "125": number;
    "250": number;
    "500": number;
    "1000": number;
    "2000": number;
    "4000": number;
    "8000": number;
};
export declare const scale: chroma.Scale<chroma.Color>;
export declare function absorptionGradient(absorption: Absorption | number[]): string;
export default absorptionGradient;
