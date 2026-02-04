import { v as u } from "./index-SdxqgSpQ.mjs";
class n {
  params;
  name;
  uuid;
  kind;
  running;
  update;
  clearpass;
  autoCalculate;
  constructor(a) {
    this.params = a || {}, this.name = a && a.name || "untitled solver", this.kind = "solver", this.uuid = u(), this.running = !1, this.clearpass = !1, this.autoCalculate = !1, this.update = () => {
    };
  }
  /** Override in subclasses to perform the solver's calculation */
  calculate() {
  }
  save() {
    const { name: a, kind: e, uuid: s, autoCalculate: t } = this;
    return {
      name: a,
      kind: e,
      uuid: s,
      autoCalculate: t
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
  n as S
};
//# sourceMappingURL=solver-PU-y3HWT.mjs.map
