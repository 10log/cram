import { o as s, s as a, c as n, f as o } from "./index-B9bcsZYv.mjs";
function _() {
  s("FDTD_2D_SET_PROPERTY", a), s("REMOVE_FDTD_2D", n), s("ADD_FDTD_2D", async (e) => {
    if (e)
      o.getState().set((t) => {
        t.solvers[e.uuid] = e;
      });
    else {
      const { FDTD_2D: t } = await import("./index-DZgl-Asv.mjs"), D = new t();
      o.getState().set((r) => {
        r.solvers[D.uuid] = D;
      });
    }
  });
}
export {
  _ as default
};
//# sourceMappingURL=events-CFpOL3c4.mjs.map
