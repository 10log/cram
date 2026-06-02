import { default as Room } from '../../objects/room';
import { KVP } from '../../common/key-value-pair';
import { RayPath, ResponseByIntensity, ChartData, ReceiverData } from './types';
export { resampleResponseByIntensity, calculateT20, calculateT30, calculateT60 } from '../shared/response-by-intensity';
export declare function reflectionLossFunction(room: Room, raypath: RayPath, frequency: number): number;
export declare function calculateReflectionLoss(paths: KVP<RayPath[]>, room: Room, receiverIDs: string[], frequencies: number[]): [ReceiverData[], ChartData[]];
export declare function calculateResponseByIntensity(indexedPaths: KVP<KVP<RayPath[]>>, receiverIDs: string[], sourceIDs: string[], frequencies: number[], temperature: number, intensitySampleRate: number): KVP<KVP<ResponseByIntensity>> | undefined;
