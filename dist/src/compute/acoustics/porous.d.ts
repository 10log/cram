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
        magnitude: number[];
        phase: number[];
    };
    absorption: number[];
};
