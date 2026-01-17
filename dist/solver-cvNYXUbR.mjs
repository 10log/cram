var o = Object.defineProperty;
var n = (s, a, t) => a in s ? o(s, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[a] = t;
var e = (s, a, t) => n(s, typeof a != "symbol" ? a + "" : a, t);
import { v as l } from "./index-BovKYX7u.mjs";
class c {
  constructor(a) {
    e(this, "params");
    e(this, "name");
    e(this, "uuid");
    e(this, "kind");
    e(this, "running");
    e(this, "update");
    e(this, "clearpass");
    e(this, "autoCalculate");
    this.params = a || {}, this.name = a && a.name || "untitled solver", this.kind = "solver", this.uuid = l(), this.running = !1, this.clearpass = !1, this.autoCalculate = !1, this.update = () => {
    };
  }
  /** Override in subclasses to perform the solver's calculation */
  calculate() {
  }
  save() {
    const { name: a, kind: t, uuid: u, autoCalculate: i } = this;
    return {
      name: a,
      kind: t,
      uuid: u,
      autoCalculate: i
    };
  }
  restore(a) {
    return this.name = a.name, this.uuid = a.uuid, this.autoCalculate = a.autoCalculate ?? !1, this;
  }
  dispose() {
    console.log("disposed from abstract...");
  }
  onModeChange(a) {
  }
  onParameterConfigFocus() {
  }
  onParameterConfigBlur() {
  }
}
export {
  c as S
};
//# sourceMappingURL=solver-cvNYXUbR.mjs.map
