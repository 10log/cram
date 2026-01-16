import { v as i, T as u, r as n, k as m, o as t, D as l, C as d, B as c } from "./index-CgcZvXNw.mjs";
import { S as h } from "./solver-BGevQtbj.mjs";
import { Mesh as f } from "three";
const o = {
  name: "Acoustic Radiance Transfer"
};
class p extends h {
  constructor(e = o) {
    super(e), this.kind = "art", this.name = e.name || o.name, this.uuid = i();
  }
  tessellate() {
    const e = Object.keys(this.rooms[0].surfaceMap).map((s) => this.rooms[0].surfaceMap[s]), a = new u();
    e.map((s) => new f(a.modify(s.geometry), s.wire.material)).forEach((s) => {
      n.workspace.add(s);
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
    return m.getState().getRooms();
  }
}
t("ADD_ART", l(p));
t("REMOVE_ART", d);
t("ART_SET_PROPERTY", c);
export {
  p as ART,
  p as default
};
//# sourceMappingURL=art-Dl5z7o3g.mjs.map
