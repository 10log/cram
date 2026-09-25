
import { makeUniqueVariableName } from './make-variable-name';

/**
 * `window.vars`, created on first use. The editor entry (`src/index.tsx`)
 * seeds it, but the library entry does not, so callers must not assume it
 * exists (#89).
 */
export function globalVars(): Record<string, any> {
  if (window.vars == null) window.vars = {};
  return window.vars;
}

/** Remove every global var whose object has the given `uuid`. */
export function removeGlobalVarsByUuid(uuid: string) {
  const vars = globalVars();
  Object.keys(vars).forEach((key) => {
    if (vars[key]?.uuid === uuid) {
      delete vars[key];
    }
  });
}

export function addToGlobalVars(object: any, name: string) {
  const vars = globalVars();
  const varname = makeUniqueVariableName(name, Object.keys(vars));
  vars[varname] = object;
  console.group(varname);
  console.log(
    `%cYou can access this via vars.${varname}`,
    'font-style: oblique; color: rgba(127,127,127,1); font-family: Consolas, Menlo, monospace;'
  );
  console.log(object);
  console.groupEnd();
}
