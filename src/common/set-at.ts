export const at = (obj: Record<string, unknown>, path: string | string[]): unknown => {
	const keys = typeof path === "string" ? path.split(".") : path;
	if (keys.length > 1) {
		return at(obj[keys[0]] as Record<string, unknown>, keys.slice(1).join("."));
	}
	return obj[keys[0]];
};


export const set = (obj: Record<string, unknown>, path: string | string[], val: unknown): Record<string, unknown> => {
	const splitpath = typeof path === "string" ? path.split(".") : path;
	const prepath = splitpath.slice(0, -1);
	const prop = splitpath[splitpath.length - 1];
	const ob = splitpath.length > 1 ? at(obj, prepath) as Record<string, unknown> : obj;
	ob[prop] && (ob[prop] = val);
	return obj;
};


export default {
	at,
	set
};
