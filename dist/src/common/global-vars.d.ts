/**
 * `window.vars`, created on first use. The editor entry (`src/index.tsx`)
 * seeds it, but the library entry does not, so callers must not assume it
 * exists (#89).
 */
export declare function globalVars(): Record<string, any>;
/** Remove every global var whose object has the given `uuid`. */
export declare function removeGlobalVarsByUuid(uuid: string): void;
export declare function addToGlobalVars(object: any, name: string): void;
