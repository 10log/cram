type DecoderFunction = (buffer: ArrayBuffer, offset: number, output: number[][], channels: number, samples: number) => void;
type EncoderFunction = (buffer: ArrayBuffer, offset: number, input: number[][], channels: number, samples: number) => void;
export declare const data_decoders: Record<string, DecoderFunction>;
export declare const data_encoders: Record<string, EncoderFunction>;
interface DecodeResult {
    sampleRate: number;
    channelData: Float32Array[];
}
export declare function decode(buffer: ArrayBuffer | {
    buffer: ArrayBuffer;
    byteOffset: number;
    length: number;
}): DecodeResult | undefined;
export interface encodeParams {
    sampleRate: number;
    floatingPoint?: boolean;
    float?: boolean;
    bitDepth: number;
    channels: number;
}
export declare function encode(channelData: number[][] | Float32Array[], opts: encodeParams): Uint8Array;
export declare function wavAsBlob(data: Float32Array[], { sampleRate, bitDepth }: {
    sampleRate: number;
    bitDepth: number;
}): Blob;
export {};
