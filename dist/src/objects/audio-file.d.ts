export interface AudioFileProps {
    name: string;
    filename: string;
    duration: number;
    length: number;
    numberOfChannels: number;
    channelData: Float32Array[];
    sampleRate: number;
}
export declare class AudioFile {
    uuid: string;
    name: string;
    filename: string;
    duration: number;
    length: number;
    numberOfChannels: number;
    sampleRate: number;
    channelData: Float32Array[];
    constructor(props: AudioFileProps);
    downsample(sampleRate: number): Float32Array<ArrayBufferLike>[];
}
export default AudioFile;
