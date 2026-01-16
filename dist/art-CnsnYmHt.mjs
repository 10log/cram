import { v as i, M as u, U as n, r as m, k as l, o as t, G as d, E as c, D as h } from "./index-Cyx44W_I.mjs";
import { S as f } from "./solver-Co1OmpsL.mjs";
const o = {
  name: "Acoustic Radiance Transfer"
};
class R extends f {
  constructor(e = o) {
    super(e), this.kind = "art", this.name = e.name || o.name, this.uuid = i();
  }
  tessellate() {
    const e = Object.keys(this.rooms[0].surfaceMap).map((s) => this.rooms[0].surfaceMap[s]), a = new n();
    e.map((s) => new u(a.modify(s.geometry), s.wire.material)).forEach((s) => {
      m.workspace.add(s);
    });
  }
  save() {
    const { name: e, kind: a, uuid: r, autoCalculate: s } = this;
    return {
      name: e,
      kind: a,
      uuid: r,
      autoCalculate: s
    };
  }
  restore(e) {
    return this.name = e.name, this.uuid = e.uuid, this.autoCalculate = e.autoCalculate ?? !1, this;
  }
  get rooms() {
    return l.getState().getRooms();
  }
}
t("ADD_ART", d(R));
t("REMOVE_ART", c);
t("ART_SET_PROPERTY", h);
export {
  R as ART,
  R as default
};
//# sourceMappingURL=art-CnsnYmHt.mjs.map
