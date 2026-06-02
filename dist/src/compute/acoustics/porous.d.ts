export interface RigidBackedPorousAbsorberParams {
    speed?: number;
    density?: number;
    flowResistivity?: number;
    thickness?: number;
    frequencies?: number[];
}
export declare function rigidBackedPorousAbsorber(params: RigidBackedPorousAbsorberParams): {
    frequency: number[];
    reflection: {
        magnitude: any[];
        phase: any[];
    };
    absorption: number[];
};
