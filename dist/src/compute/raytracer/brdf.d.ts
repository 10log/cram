export interface BRDFProps {
    /**
     * the number of discrete chunks in the BRDF
     */
    steps?: number;
    absorptionCoefficient: number;
    diffusionCoefficient: number;
}
export declare class BRDF {
    coefficients: number[][];
    steps: number;
    getIndex: (v: number) => number;
    constructor(props: BRDFProps);
    get(angle_in: number, angle_out: number): number;
    set(absorptionCoefficient: number, diffusionCoefficient: number): this;
    randomize(): this;
}
