import { S as e } from "./FileSaver.min-DhK9iPpQ.mjs";
//#region src/compute/solver.ts
var t = class {
	params;
	name;
	uuid;
	kind;
	running;
	update;
	clearpass;
	autoCalculate;
	constructor(t) {
		this.params = t || {}, this.name = t && t.name || "untitled solver", this.kind = "solver", this.uuid = e(), this.running = !1, this.clearpass = !1, this.autoCalculate = !1, this.update = () => {};
	}
	calculate() {}
	save() {
		let { name: e, kind: t, uuid: n, autoCalculate: r } = this;
		return {
			name: e,
			kind: t,
			uuid: n,
			autoCalculate: r
		};
	}
	restore(e) {
		return this.name = e.name, this.uuid = e.uuid, this.autoCalculate = e.autoCalculate ?? !1, this;
	}
	dispose() {
		console.log("disposed from abstract...");
	}
	onModeChange(e) {}
	onParameterConfigFocus() {}
	onParameterConfigBlur() {}
};
//#endregion
export { t };

//# sourceMappingURL=solver-DovuaY8D.mjs.map