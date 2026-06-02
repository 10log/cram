/**
 * Storage utility for namespaced localStorage access.
 *
 * This allows multiple CRAM instances (or CRAM + other apps) to coexist
 * without localStorage key conflicts.
 */
/**
 * Set the storage prefix for all localStorage operations.
 * Call this early in component initialization.
 */
export declare function setStoragePrefix(prefix: string): void;
/**
 * Get the current storage prefix.
 */
export declare function getStoragePrefix(): string;
/**
 * Get an item from localStorage with the current prefix.
 */
export declare function getItem(key: string): string | null;
/**
 * Set an item in localStorage with the current prefix.
 */
export declare function setItem(key: string, value: string): void;
/**
 * Remove an item from localStorage with the current prefix.
 */
export declare function removeItem(key: string): void;
/**
 * Clear all items with the current prefix from localStorage.
 */
export declare function clearPrefixedItems(): void;
export declare const storage: {
    getItem: typeof getItem;
    setItem: typeof setItem;
    removeItem: typeof removeItem;
    clearPrefixedItems: typeof clearPrefixedItems;
    setStoragePrefix: typeof setStoragePrefix;
    getStoragePrefix: typeof getStoragePrefix;
};
export default storage;
