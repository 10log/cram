/**
 * checks for equality between two arrays of depth 1
 * @param first target array
 * @param second array to check for equality
 * @param compare optional comparison function
 */
export declare function compareArrays<T>(first: T[], second: T[], compare?: (a: T, b: T) => boolean): boolean;
