/**
 * Storage utility for namespaced localStorage access.
 *
 * This allows multiple CRAM instances (or CRAM + other apps) to coexist
 * without localStorage key conflicts.
 */

// Default prefix for standalone mode
let storagePrefix = 'cram';

/**
 * Set the storage prefix for all localStorage operations.
 * Call this early in component initialization.
 */
export function setStoragePrefix(prefix: string) {
  storagePrefix = prefix;
}

/**
 * Get the current storage prefix.
 */
export function getStoragePrefix(): string {
  return storagePrefix;
}

/**
 * Get a namespaced key for localStorage.
 */
function getKey(key: string): string {
  return storagePrefix ? `${storagePrefix}-${key}` : key;
}

/**
 * Get an item from localStorage with the current prefix.
 */
export function getItem(key: string): string | null {
  return localStorage.getItem(getKey(key));
}

/**
 * Set an item in localStorage with the current prefix.
 */
export function setItem(key: string, value: string): void {
  localStorage.setItem(getKey(key), value);
}

/**
 * Remove an item from localStorage with the current prefix.
 */
export function removeItem(key: string): void {
  localStorage.removeItem(getKey(key));
}

/**
 * Clear all items with the current prefix from localStorage.
 */
export function clearPrefixedItems(): void {
  const prefix = getKey('');
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Named exports for common storage keys
export const storage = {
  getItem,
  setItem,
  removeItem,
  clearPrefixedItems,
  setStoragePrefix,
  getStoragePrefix,
};

export default storage;
