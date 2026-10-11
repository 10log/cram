import { S as e, a as t, l as n, s as r } from "./FileSaver.min-BXKs1cBL.mjs";
import "./store-BubwJyeH.mjs";
//#region src/compute/2d-fdtd/events.ts
function i() {
	e("FDTD_2D_SET_PROPERTY", r), e("REMOVE_FDTD_2D", t), e("ADD_FDTD_2D", async (e) => {
		if (e) n.getState().set((t) => {
			t.solvers[e.uuid] = e;
		});
		else {
			let { FDTD_2D: e } = await import("./2d-fdtd-C_pZErbP.mjs"), t = new e();
			n.getState().set((e) => {
				e.solvers[t.uuid] = t;
			});
		}
	});
}
//#endregion
export { i as default };

//# sourceMappingURL=events-CCpKzQBF.mjs.map