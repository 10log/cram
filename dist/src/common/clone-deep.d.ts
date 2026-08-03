type InstanceCloneFn = ((val: unknown) => unknown) | boolean;
export declare function cloneDeep<T>(val: T, instanceClone?: InstanceCloneFn): T;
export declare function cloneObjectDeep<T>(val: T, instanceClone?: InstanceCloneFn): T;
export declare function cloneArrayDeep<T>(val: T[], instanceClone?: InstanceCloneFn): T[];
export default cloneDeep;
