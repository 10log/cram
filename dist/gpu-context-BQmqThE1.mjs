//#region src/compute/raytracer/gpu/gpu-context.ts
var e = null, t = null, n = !1;
function r() {
	return typeof navigator < "u" && "gpu" in navigator;
}
async function i() {
	if (t && !n) return {
		adapter: e,
		device: t
	};
	if (!r()) return null;
	try {
		let r = await navigator.gpu.requestAdapter();
		if (!r) return console.warn("[GPU RT] No WebGPU adapter found"), null;
		let i = r.limits.maxStorageBuffersPerShaderStage, a = Math.min(10, i), o = await r.requestDevice({ requiredLimits: {
			maxStorageBuffersPerShaderStage: a,
			maxStorageBufferBindingSize: r.limits.maxStorageBufferBindingSize,
			maxBufferSize: r.limits.maxBufferSize,
			maxComputeWorkgroupSizeX: 64
		} });
		return e = r, t = o, n = !1, o.lost.then((r) => {
			n || (n = !0, console.error(`[GPU RT] Device lost: ${r.reason ?? "unknown"} — ${r.message}`), t = null, e = null);
		}), {
			adapter: r,
			device: o
		};
	} catch (e) {
		return console.warn("[GPU RT] Failed to initialize WebGPU:", e), null;
	}
}
//#endregion
export { i as n, r as t };

//# sourceMappingURL=gpu-context-BQmqThE1.mjs.map