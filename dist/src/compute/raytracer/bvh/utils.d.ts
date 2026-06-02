import { BVHNode } from './BVHNode';
export declare function countNodes(node: BVHNode, count?: number): number;
export declare function asyncWork(workCheck: Evaluator, work: Work, options: AsyncifyParams, progressCallback?: WorkProgressCallback): Promise<void>;
