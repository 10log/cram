import { i as e, o as t, s as n, y as r } from "./FileSaver.min-DhK9iPpQ.mjs";
import "./store-CAL1R5s7.mjs";
//#region src/compute/2d-fdtd/events.ts
function i() {
	r("FDTD_2D_SET_PROPERTY", t), r("REMOVE_FDTD_2D", e), r("ADD_FDTD_2D", async (e) => {
		if (e) n.getState().set((t) => {
			t.solvers[e.uuid] = e;
		});
		else {
			let { FDTD_2D: e } = await import("./2d-fdtd-iM3iSx6D.mjs"), t = new e();
			n.getState().set((e) => {
				e.solvers[t.uuid] = t;
			});
		}
	});
}
//#endregion
export { i as default };

//# sourceMappingURL=events-BfBUcQiz.mjs.map