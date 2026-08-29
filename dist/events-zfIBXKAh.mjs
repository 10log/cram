import { a as e, b as t, c as n, s as r } from "./FileSaver.min-BS9rdHrk.mjs";
import "./store-CUhn0IQy.mjs";
//#region src/compute/2d-fdtd/events.ts
function i() {
	t("FDTD_2D_SET_PROPERTY", r), t("REMOVE_FDTD_2D", e), t("ADD_FDTD_2D", async (e) => {
		if (e) n.getState().set((t) => {
			t.solvers[e.uuid] = e;
		});
		else {
			let { FDTD_2D: e } = await import("./2d-fdtd-Bqtq5IJW.mjs"), t = new e();
			n.getState().set((e) => {
				e.solvers[t.uuid] = t;
			});
		}
	});
}
//#endregion
export { i as default };

//# sourceMappingURL=events-zfIBXKAh.mjs.map