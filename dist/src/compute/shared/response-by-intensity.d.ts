import { KVP } from '../../common/key-value-pair';
import { ResponseByIntensity } from './response-by-intensity-types';
export declare function resampleResponseByIntensity(responseByIntensity: KVP<KVP<ResponseByIntensity>>, sampleRate?: number): KVP<KVP<ResponseByIntensity>> | undefined;
export declare function calculateT30(responseByIntensity: KVP<KVP<ResponseByIntensity>>, receiverId: string, sourceId: string): void;
export declare function calculateT20(responseByIntensity: KVP<KVP<ResponseByIntensity>>, receiverId: string, sourceId: string): void;
export declare function calculateT60(responseByIntensity: KVP<KVP<ResponseByIntensity>>, receiverId: string, sourceId: string): void;
