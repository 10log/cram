import { v as u } from "./index-BaH-Rmpc.mjs";
class l {
  constructor(e) {
    this.params = e || {}, this.name = e && e.name || "untitled solver", this.kind = "solver", this.uuid = u(), this.running = !1, this.clearpass = !1, this.autoCalculate = !1, this.update = () => {
    };
  }
  /** Override in subclasses to perform the solver's calculation */
  calculate() {
  }
  save() {
    const { name: e, kind: a, uuid: s, autoCalculate: t } = this;
    return {
      name: e,
      kind: a,
      uuid: s,
      autoCalculate: t
    };
  }
  restore(e) {
    return this.name = e.name, this.uuid = e.uuid, this.autoCalculate = e.autoCalculate ?? !1, this;
  }
  dispose() {
    console.log("disposed from abstract...");
  }
  onModeChange(e) {
  }
  onParameterConfigFocus() {
  }
  onParameterConfigBlur() {
  }
}
export {
  l as S
};
//# sourceMappingURL=solver-BY1W6uB-.mjs.map
