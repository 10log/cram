import { directivityData } from '../objects/source';
export declare class CLFParser {
    private fileContents;
    private clfData;
    private clfVersion;
    private phi;
    private theta;
    private frequencies;
    private angleres;
    private radiation;
    private minband;
    private maxband;
    constructor(fileContents: string);
    parse(): CLFResult;
    parseProperty(property: string, rowStartIndex?: number): parsePropertyResult;
    parseDirectivity(band: number): directivityData;
    private parseRowAsNumber;
    private applySymmetry;
    private isvalid;
    private getCLFArray;
    private createAngleList;
}
interface parsePropertyResult {
    result: any;
    nextIndex: number;
}
export interface CLFResult {
    clfversion: number;
    speakerName: string;
    speakerDescription: string;
    speakerType: string;
    symmetry: string;
    arcorder: string;
    sign: string;
    reference: string;
    measurementDistance: number;
    phi: number[];
    theta: number[];
    frequencies: number[];
    minband: number;
    maxband: number;
    angleres: number;
    sensitivity: number[];
    impedance: number[];
    axialspectrum: number[];
    directivity: directivityData[];
}
export {};
