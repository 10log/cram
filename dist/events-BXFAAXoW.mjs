import { o as s, D as a, E as n, f as o } from "./index-Cyx44W_I.mjs";
function _() {
  s("FDTD_2D_SET_PROPERTY", a), s("REMOVE_FDTD_2D", n), s("ADD_FDTD_2D", async (e) => {
    if (e)
      o.getState().set((t) => {
        t.solvers[e.uuid] = e;
      });
    else {
      const { FDTD_2D: t } = await import("./index-5ZSiGYJy.mjs"), D = new t();
      o.getState().set((r) => {
        r.solvers[D.uuid] = D;
      });
    }
  });
}
export {
  _ as default
};
//# sourceMappingURL=events-BXFAAXoW.mjs.map
