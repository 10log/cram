import { C as e, _ as t, b as n, f as r, v as i, y as a } from "./FileSaver.min-BS9rdHrk.mjs";
import { g as o, n as s, r as c } from "./store-DRnKXLf0.mjs";
/* empty css                            */
import { t as l } from "./round-to-CrejEAZs.mjs";
import * as u from "three";
import { BoxGeometry as d, BufferGeometry as f, Color as p, Controls as m, CylinderGeometry as h, DoubleSide as g, Euler as _, EventDispatcher as v, Float32BufferAttribute as y, HalfFloatType as b, Line as x, LineBasicMaterial as S, LineSegments as C, MOUSE as w, Matrix4 as T, Mesh as E, MeshBasicMaterial as ee, NoBlending as te, Object3D as D, OctahedronGeometry as O, OrthographicCamera as ne, PlaneGeometry as re, Quaternion as k, Raycaster as ie, ShaderMaterial as A, ShapePath as ae, SphereGeometry as oe, Spherical as se, TOUCH as j, Timer as M, TorusGeometry as N, UniformsUtils as ce, Vector2 as P, Vector3 as F, WebGLRenderTarget as le } from "three";
//#region src/render/Stats.ts
var I = class {
	name;
	fg;
	bg;
	textColor;
	dom;
	width;
	height;
	padding;
	fontSize;
	context;
	pixelRatio;
	min;
	max;
	unit;
	dimmensions;
	canvas;
	constructor(e, t) {
		this.name = e, this.unit = t.unit || "", this.fg = t.fg, this.bg = t.bg, this.textColor = t.textColor || this.fg, this.min = Infinity, this.max = 0, this.pixelRatio = Math.round(window.devicePixelRatio || 1), this.width = t.width || 80, this.height = t.height || 48, this.fontSize = t.fontSize || 9, this.padding = 3, this.dimmensions = {
			WIDTH: this.width * this.pixelRatio,
			HEIGHT: this.height * this.pixelRatio,
			TEXT_X: this.padding * this.pixelRatio,
			TEXT_Y: this.padding * this.pixelRatio,
			GRAPH_X: this.padding * this.pixelRatio,
			GRAPH_Y: (this.fontSize + 2 * this.padding) * this.pixelRatio,
			GRAPH_WIDTH: (this.width - 2 * this.padding) * this.pixelRatio,
			GRAPH_HEIGHT: (this.height - (3 * this.padding + this.fontSize)) * this.pixelRatio
		}, this.canvas = document.createElement("canvas"), this.canvas.width = this.dimmensions.WIDTH, this.canvas.height = this.dimmensions.HEIGHT, this.canvas.setAttribute("class", "renderer-stats-panel"), this.canvas.style.cssText = `width:${this.width}px;height:${this.height}px`, this.dom = this.canvas, this.context = this.canvas.getContext("2d"), this.context.font = "regular " + this.fontSize * this.pixelRatio + "px Helvetica,Arial,sans-serif", this.context.textBaseline = "top", this.context.fillStyle = this.bg, this.context.fillRect(0, 0, this.dimmensions.WIDTH, this.dimmensions.HEIGHT), this.context.fillStyle = this.textColor, this.context.fillText(e, this.dimmensions.TEXT_X, this.dimmensions.TEXT_Y), this.context.fillStyle = this.fg, this.context.fillRect(this.dimmensions.GRAPH_X, this.dimmensions.GRAPH_Y, this.dimmensions.GRAPH_WIDTH, this.dimmensions.GRAPH_HEIGHT), this.context.fillStyle = this.bg, this.context.globalAlpha = .9, this.context.fillRect(this.dimmensions.GRAPH_X, this.dimmensions.GRAPH_Y, this.dimmensions.GRAPH_WIDTH, this.dimmensions.GRAPH_HEIGHT);
	}
	update(e, t) {
		this.min = Math.min(this.min, e), this.max = Math.max(this.max, e), this.context.fillStyle = this.bg, this.context.globalAlpha = 1, this.context.fillRect(0, 0, this.dimmensions.WIDTH, this.dimmensions.GRAPH_Y), this.context.fillStyle = this.textColor, this.context.fillText(`${this.name}: ${Math.round(e)} ${this.unit} [${Math.round(this.min)}-${Math.round(this.max)}]`, this.dimmensions.TEXT_X, this.dimmensions.TEXT_Y), this.context.fillStyle = this.fg, this.context.drawImage(this.canvas, this.dimmensions.GRAPH_X + this.pixelRatio, this.dimmensions.GRAPH_Y, this.dimmensions.GRAPH_WIDTH - this.pixelRatio, this.dimmensions.GRAPH_HEIGHT, this.dimmensions.GRAPH_X, this.dimmensions.GRAPH_Y, this.dimmensions.GRAPH_WIDTH - this.pixelRatio, this.dimmensions.GRAPH_HEIGHT), this.context.fillRect(this.dimmensions.GRAPH_X + this.dimmensions.GRAPH_WIDTH - this.pixelRatio, this.dimmensions.GRAPH_Y, this.pixelRatio, this.dimmensions.GRAPH_HEIGHT), this.context.fillStyle = this.bg, this.context.globalAlpha = .9, this.context.fillRect(this.dimmensions.GRAPH_X + this.dimmensions.GRAPH_WIDTH - this.pixelRatio, this.dimmensions.GRAPH_Y, this.pixelRatio, Math.round((1 - e / t) * this.dimmensions.GRAPH_HEIGHT));
	}
}, ue = class {
	REVISION;
	currentPanelIndex;
	container;
	fpsPanel;
	fpsPanelValue;
	memPanel;
	memPanelValue;
	msPanel;
	msPanelValue;
	beginTime;
	prevTime;
	frames;
	auxPanelUpdatePeriod;
	_displayStyle;
	DISPLAY_STYLES;
	constructor() {
		this.DISPLAY_STYLES = {
			NONE: 0,
			SINGLE: 1,
			STACKED_X: 2,
			STACKED_Y: 3
		}, this.REVISION = 16, this.currentPanelIndex = 0, this.container = document.createElement("div"), this.container.setAttribute("class", "renderer-stats-container"), this.clickHandler = this.clickHandler.bind(this), this.container.addEventListener("click", this.clickHandler, !1), this.beginTime = (performance || Date).now(), this.prevTime = this.beginTime, this.frames = 0;
		let e = {
			fg: "#808080",
			bg: "#FCFCFC",
			textColor: "#182026",
			fontSize: 9,
			height: 48,
			width: 160,
			padding: 3
		};
		this.auxPanelUpdatePeriod = 500, this.fpsPanel = this.addPanel(new I("Frame Rate", {
			...e,
			unit: "Hz"
		})), this.fpsPanelValue = 0, this.msPanel = this.addPanel(new I("Frame Time", {
			...e,
			unit: "ms"
		})), this.msPanelValue = 0, self.performance.memory && (this.memPanel = this.addPanel(new I("Heap", {
			...e,
			unit: "MB"
		})), this.memPanelValue = 0), this.showSinglePanel(this.currentPanelIndex), this._displayStyle = this.DISPLAY_STYLES.STACKED_Y, this.displayStyle = this._displayStyle;
	}
	addPanel(e) {
		return this.container.appendChild(e.dom), e;
	}
	showSinglePanel(e) {
		for (let t = 0; t < this.container.children.length; t++) t === e ? this.container.children[t].classList.remove("renderer-stats-panel-hidden") : this.container.children[t].classList.add("renderer-stats-panel-hidden");
		this.currentPanelIndex = e;
	}
	showAllPanels() {
		for (let e = 0; e < this.container.children.length; e++) this.container.children[e].classList.remove("renderer-stats-panel-hidden");
	}
	set displayStyle(e) {
		switch (e) {
			case this.DISPLAY_STYLES.NONE:
				this.hide(), this._displayStyle = e;
				break;
			case this.DISPLAY_STYLES.SINGLE:
				this.unhide(), this.container.classList.remove("renderer-stats-container-stacked-x"), this.container.classList.remove("renderer-stats-container-stacked-y"), this.showSinglePanel(this.currentPanelIndex), this._displayStyle = e;
				break;
			case this.DISPLAY_STYLES.STACKED_X:
				this.unhide(), this.container.classList.remove("renderer-stats-container-stacked-y"), this.container.classList.add("renderer-stats-container-stacked-x"), this.showAllPanels(), this._displayStyle = e;
				break;
			case this.DISPLAY_STYLES.STACKED_Y: this.unhide(), this.container.classList.remove("renderer-stats-container-stacked-x"), this.container.classList.add("renderer-stats-container-stacked-y"), this.showAllPanels(), this._displayStyle = e;
		}
	}
	get displayStyle() {
		return this._displayStyle;
	}
	get hidden() {
		return this.container.classList.contains("renderer-stats-container-hidden");
	}
	hide() {
		this.hidden || this.container.classList.add("renderer-stats-container-hidden");
	}
	unhide() {
		this.hidden && this.container.classList.remove("renderer-stats-container-hidden");
	}
	clickHandler(e) {
		if (e.preventDefault(), e.shiftKey) {
			let e = (this._displayStyle + 1) % Object.keys(this.DISPLAY_STYLES).length;
			this.displayStyle = e === this.DISPLAY_STYLES.NONE ? e + 1 : e;
		} else this.displayStyle === this.DISPLAY_STYLES.SINGLE && this.showSinglePanel((this.currentPanelIndex + 1) % this.container.children.length);
	}
	begin() {
		this.beginTime = (performance || Date).now();
	}
	end() {
		this.frames++;
		let e = (performance || Date).now();
		if (this.msPanelValue = e - this.beginTime, this.msPanel.update(this.msPanelValue, 200), e >= this.prevTime + this.auxPanelUpdatePeriod && (this.fpsPanelValue = this.frames * 1e3 / (e - this.prevTime), this.fpsPanel.update(this.fpsPanelValue, 100), this.prevTime = e, this.frames = 0, this.memPanel)) {
			let e = performance.memory;
			e && (this.memPanelValue = e.usedJSHeapSize / 1048576, this.memPanel.update(this.memPanelValue, e.jsHeapSizeLimit / 1048576));
		}
		return e;
	}
	update() {
		this.beginTime = this.end();
	}
	get domElement() {
		return this.container;
	}
	set domElement(e) {
		this.container = e;
	}
}, de = {
	name: "CopyShader",
	uniforms: {
		tDiffuse: { value: null },
		opacity: { value: 1 }
	},
	vertexShader: "\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}",
	fragmentShader: "\n\n		uniform float opacity;\n\n		uniform sampler2D tDiffuse;\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vec4 texel = texture2D( tDiffuse, vUv );\n			gl_FragColor = opacity * texel;\n\n\n		}"
}, L = class {
	constructor() {
		this.isPass = !0, this.enabled = !0, this.needsSwap = !0, this.clear = !1, this.renderToScreen = !1;
	}
	setSize() {}
	render() {
		console.error("THREE.Pass: .render() must be implemented in derived pass.");
	}
	dispose() {}
}, fe = new ne(-1, 1, 1, -1, 0, 1), pe = new class extends f {
	constructor() {
		super(), this.setAttribute("position", new y([
			-1,
			3,
			0,
			-1,
			-1,
			0,
			3,
			-1,
			0
		], 3)), this.setAttribute("uv", new y([
			0,
			2,
			0,
			0,
			2,
			0
		], 2));
	}
}(), me = class {
	constructor(e) {
		this._mesh = new E(pe, e);
	}
	dispose() {
		this._mesh.geometry.dispose();
	}
	render(e) {
		e.render(this._mesh, fe);
	}
	get material() {
		return this._mesh.material;
	}
	set material(e) {
		this._mesh.material = e;
	}
}, he = class extends L {
	constructor(e, t = "tDiffuse") {
		super(), this.textureID = t, this.uniforms = null, this.material = null, e instanceof A ? (this.uniforms = e.uniforms, this.material = e) : e && (this.uniforms = ce.clone(e.uniforms), this.material = new A({
			name: e.name === void 0 ? "unspecified" : e.name,
			defines: Object.assign({}, e.defines),
			uniforms: this.uniforms,
			vertexShader: e.vertexShader,
			fragmentShader: e.fragmentShader
		})), this._fsQuad = new me(this.material);
	}
	render(e, t, n) {
		this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = n.texture), this._fsQuad.material = this.material, this.renderToScreen ? (e.setRenderTarget(null), this._fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this._fsQuad.render(e));
	}
	dispose() {
		this.material.dispose(), this._fsQuad.dispose();
	}
}, ge = class extends L {
	constructor(e, t) {
		super(), this.scene = e, this.camera = t, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
	}
	render(e, t, n) {
		let r = e.getContext(), i = e.state;
		i.buffers.color.setMask(!1), i.buffers.depth.setMask(!1), i.buffers.color.setLocked(!0), i.buffers.depth.setLocked(!0);
		let a, o;
		this.inverse ? (a = 0, o = 1) : (a = 1, o = 0), i.buffers.stencil.setTest(!0), i.buffers.stencil.setOp(r.REPLACE, r.REPLACE, r.REPLACE), i.buffers.stencil.setFunc(r.ALWAYS, a, 4294967295), i.buffers.stencil.setClear(o), i.buffers.stencil.setLocked(!0), e.setRenderTarget(n), this.clear && e.clear(), e.render(this.scene, this.camera), e.setRenderTarget(t), this.clear && e.clear(), e.render(this.scene, this.camera), i.buffers.color.setLocked(!1), i.buffers.depth.setLocked(!1), i.buffers.color.setMask(!0), i.buffers.depth.setMask(!0), i.buffers.stencil.setLocked(!1), i.buffers.stencil.setFunc(r.EQUAL, 1, 4294967295), i.buffers.stencil.setOp(r.KEEP, r.KEEP, r.KEEP), i.buffers.stencil.setLocked(!0);
	}
}, _e = class extends L {
	constructor() {
		super(), this.needsSwap = !1;
	}
	render(e) {
		e.state.buffers.stencil.setLocked(!1), e.state.buffers.stencil.setTest(!1);
	}
}, ve = class {
	constructor(e, t) {
		if (this.renderer = e, this._pixelRatio = e.getPixelRatio(), t === void 0) {
			let n = e.getSize(new P());
			this._width = n.width, this._height = n.height, t = new le(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: b }), t.texture.name = "EffectComposer.rt1";
		} else this._width = t.width, this._height = t.height;
		this.renderTarget1 = t, this.renderTarget2 = t.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, this.passes = [], this.copyPass = new he(de), this.copyPass.material.blending = te, this.timer = new M();
	}
	swapBuffers() {
		let e = this.readBuffer;
		this.readBuffer = this.writeBuffer, this.writeBuffer = e;
	}
	addPass(e) {
		this.passes.push(e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
	}
	insertPass(e, t) {
		this.passes.splice(t, 0, e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
	}
	removePass(e) {
		let t = this.passes.indexOf(e);
		t !== -1 && this.passes.splice(t, 1);
	}
	isLastEnabledPass(e) {
		for (let t = e + 1; t < this.passes.length; t++) if (this.passes[t].enabled) return !1;
		return !0;
	}
	render(e) {
		this.timer.update(), e === void 0 && (e = this.timer.getDelta());
		let t = this.renderer.getRenderTarget(), n = !1;
		for (let t = 0, r = this.passes.length; t < r; t++) {
			let r = this.passes[t];
			if (r.enabled !== !1) {
				if (r.renderToScreen = this.renderToScreen && this.isLastEnabledPass(t), r.render(this.renderer, this.writeBuffer, this.readBuffer, e, n), r.needsSwap) {
					if (n) {
						let t = this.renderer.getContext(), n = this.renderer.state.buffers.stencil;
						n.setFunc(t.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e), n.setFunc(t.EQUAL, 1, 4294967295);
					}
					this.swapBuffers();
				}
				ge !== void 0 && (r instanceof ge ? n = !0 : r instanceof _e && (n = !1));
			}
		}
		this.renderer.setRenderTarget(t);
	}
	reset(e) {
		if (e === void 0) {
			let t = this.renderer.getSize(new P());
			this._pixelRatio = this.renderer.getPixelRatio(), this._width = t.width, this._height = t.height, e = this.renderTarget1.clone(), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
		}
		this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.renderTarget1 = e, this.renderTarget2 = e.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
	}
	setSize(e, t) {
		this._width = e, this._height = t;
		let n = this._width * this._pixelRatio, r = this._height * this._pixelRatio;
		this.renderTarget1.setSize(n, r), this.renderTarget2.setSize(n, r);
		for (let e = 0; e < this.passes.length; e++) this.passes[e].setSize(n, r);
	}
	setPixelRatio(e) {
		this._pixelRatio = e, this.setSize(this._width, this._height);
	}
	dispose() {
		this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
	}
}, ye = class extends L {
	constructor(e, t, n = null, r = null, i = null) {
		super(), this.scene = e, this.camera = t, this.overrideMaterial = n, this.clearColor = r, this.clearAlpha = i, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this.isRenderPass = !0, this._oldClearColor = new p();
	}
	render(e, t, n) {
		let r = e.autoClear;
		e.autoClear = !1;
		let i, a;
		this.overrideMaterial !== null && (a = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (e.getClearColor(this._oldClearColor), e.setClearColor(this.clearColor, e.getClearAlpha())), this.clearAlpha !== null && (i = e.getClearAlpha(), e.setClearAlpha(this.clearAlpha)), this.clearDepth == 1 && e.clearDepth(), e.setRenderTarget(this.renderToScreen ? null : n), this.clear === !0 && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), e.render(this.scene, this.camera), this.clearColor !== null && e.setClearColor(this._oldClearColor), this.clearAlpha !== null && e.setClearAlpha(i), this.overrideMaterial !== null && (this.scene.overrideMaterial = a), e.autoClear = r;
	}
}, R = function(e, t) {
	t === void 0 && console.warn("THREE.OrbitControls: The second parameter \"domElement\" is now mandatory."), t === document && console.error("THREE.OrbitControls: \"document\" should not be used as the target \"domElement\". Please use \"renderer.domElement\" instead."), this.object = e, this.domElement = t, this.enabled = !0, this.target = new F(), this.minDistance = 0, this.maxDistance = Infinity, this.minZoom = 0, this.maxZoom = Infinity, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -Infinity, this.maxAzimuthAngle = Infinity, this.enableDamping = !1, this.dampingFactor = .05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !1, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.enableKeys = !1, this.keys = {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		BOTTOM: 40
	}, this.mouseButtons = {
		LEFT: w.ROTATE,
		MIDDLE: w.DOLLY,
		RIGHT: w.PAN
	}, this.touches = {
		ONE: j.ROTATE,
		TWO: j.DOLLY_PAN
	}, this.keyMods = {
		pan: "shiftKey",
		dolly: "metaKey",
		noMiddleButton: "altKey"
	}, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.quat0 = this.object.quaternion.clone(), this.zoom0 = this.object.zoom, this.getPolarAngle = function() {
		return l.phi;
	}, this.getAzimuthalAngle = function() {
		return l.theta;
	}, this.saveState = function() {
		n.target0.copy(n.target), n.position0.copy(n.object.position), n.quat0.copy(n.object.quaternion), n.zoom0 = n.object.zoom;
	}, this.reset = function() {
		n.target.copy(n.target0), n.object.position.copy(n.position0), n.object.quaternion.copy(n.quaternion0), n.object.zoom = n.zoom0, n.object.updateProjectionMatrix(), n.dispatchEvent(r), n.update(), s = o.NONE;
	}, this.update = (function() {
		var t = new F(), i = new k().setFromUnitVectors(e.up, new F(0, 1, 0)), a = i.clone().invert(), m = new F(), h = new k();
		return function() {
			var e = n.object.position;
			return t.copy(e).sub(n.target), t.applyQuaternion(i), l.setFromVector3(t), n.autoRotate && s === o.NONE && E(C()), n.enableDamping ? (l.theta += u.theta * n.dampingFactor, l.phi += u.phi * n.dampingFactor) : (l.theta += u.theta, l.phi += u.phi), l.theta = Math.max(n.minAzimuthAngle, Math.min(n.maxAzimuthAngle, l.theta)), l.phi = Math.max(n.minPolarAngle, Math.min(n.maxPolarAngle, l.phi)), l.makeSafe(), l.radius *= d, l.radius = Math.max(n.minDistance, Math.min(n.maxDistance, l.radius)), n.enableDamping === !0 ? n.target.addScaledVector(f, n.dampingFactor) : n.target.add(f), t.setFromSpherical(l), t.applyQuaternion(a), e.copy(n.target).add(t), n.object.lookAt(n.target), n.enableDamping === !0 ? (u.theta *= 1 - n.dampingFactor, u.phi *= 1 - n.dampingFactor, f.multiplyScalar(1 - n.dampingFactor)) : (u.set(0, 0, 0), f.set(0, 0, 0)), d = 1, p || m.distanceToSquared(n.object.position) > c || 8 * (1 - h.dot(n.object.quaternion)) > c ? (n.dispatchEvent(r), m.copy(n.object.position), h.copy(n.object.quaternion), p = !1, !0) : !1;
		};
	})(), this.dispose = function() {
		n.domElement.removeEventListener("contextmenu", xe, !1), n.domElement.removeEventListener("mousedown", ve, !1), n.domElement.removeEventListener("wheel", be, !1), n.domElement.removeEventListener("touchstart", B, !1), n.domElement.removeEventListener("touchend", H, !1), n.domElement.removeEventListener("touchmove", V, !1), document.removeEventListener("mousemove", ye, !1), document.removeEventListener("mouseup", R, !1), n.domElement.removeEventListener("keydown", z, !1);
	};
	var n = this;
	n.keyMods ||= {
		pan: "shiftKey",
		dolly: "metaKey",
		noMiddleButton: "altKey"
	};
	var r = { type: "change" }, i = { type: "start" }, a = { type: "end" }, o = {
		NONE: -1,
		ROTATE: 0,
		DOLLY: 1,
		PAN: 2,
		TOUCH_ROTATE: 3,
		TOUCH_PAN: 4,
		TOUCH_DOLLY_PAN: 5,
		TOUCH_DOLLY_ROTATE: 6
	}, s = o.NONE, c = 1e-6, l = new se(), u = new se(), d = 1, f = new F(), p = !1, m = new P(), h = new P(), g = new P(), _ = new P(), v = new P(), y = new P(), b = new P(), x = new P(), S = new P();
	function C() {
		return 2 * Math.PI / 60 / 60 * n.autoRotateSpeed;
	}
	function T() {
		return .95 ** n.zoomSpeed;
	}
	function E(e) {
		u.theta -= e;
	}
	function ee(e) {
		u.phi -= e;
	}
	var te = (function() {
		var e = new F();
		return function(t, n) {
			e.setFromMatrixColumn(n, 0), e.multiplyScalar(-t), f.add(e);
		};
	})(), D = (function() {
		var e = new F();
		return function(t, r) {
			n.screenSpacePanning === !0 ? e.setFromMatrixColumn(r, 1) : (e.setFromMatrixColumn(r, 0), e.crossVectors(n.object.up, e)), e.multiplyScalar(t), f.add(e);
		};
	})(), O = (function() {
		var e = new F();
		return function(t, r) {
			var i = n.domElement;
			if (n.object.isPerspectiveCamera) {
				var a = n.object.position;
				e.copy(a).sub(n.target);
				var o = e.length();
				o *= Math.tan(n.object.fov / 2 * Math.PI / 180), te(2 * t * o / i.clientHeight, n.object.matrix), D(2 * r * o / i.clientHeight, n.object.matrix);
			} else n.object.isOrthographicCamera ? (te(t * (n.object.right - n.object.left) / n.object.zoom / i.clientWidth, n.object.matrix), D(r * (n.object.top - n.object.bottom) / n.object.zoom / i.clientHeight, n.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), n.enablePan = !1);
		};
	})();
	function ne(e) {
		n.object.isPerspectiveCamera ? d /= e : n.object.isOrthographicCamera ? (n.object.zoom = Math.max(n.minZoom, Math.min(n.maxZoom, n.object.zoom * e)), n.object.updateProjectionMatrix(), p = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), n.enableZoom = !1);
	}
	function re(e) {
		n.object.isPerspectiveCamera ? d *= e : n.object.isOrthographicCamera ? (n.object.zoom = Math.max(n.minZoom, Math.min(n.maxZoom, n.object.zoom / e)), n.object.updateProjectionMatrix(), p = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), n.enableZoom = !1);
	}
	function ie(e) {
		m.set(e.clientX, e.clientY);
	}
	function A(e) {
		b.set(e.clientX, e.clientY);
	}
	function ae(e) {
		_.set(e.clientX, e.clientY);
	}
	function oe(e) {
		h.set(e.clientX, e.clientY), g.subVectors(h, m).multiplyScalar(n.rotateSpeed);
		var t = n.domElement;
		E(2 * Math.PI * g.x / t.clientHeight), ee(2 * Math.PI * g.y / t.clientHeight), m.copy(h), n.update();
	}
	function M(e) {
		x.set(e.clientX, e.clientY), S.subVectors(x, b), S.y > 0 ? ne(T()) : S.y < 0 && re(T()), b.copy(x), n.update();
	}
	function N(e) {
		v.set(e.clientX, e.clientY), y.subVectors(v, _).multiplyScalar(n.panSpeed), O(y.x, y.y), _.copy(v), n.update();
	}
	function ce(e) {
		e.deltaY < 0 ? re(T()) : e.deltaY > 0 && ne(T()), n.update();
	}
	function le(e) {
		var t = !1;
		switch (e.keyCode) {
			case n.keys.UP:
				O(0, n.keyPanSpeed), t = !0;
				break;
			case n.keys.BOTTOM:
				O(0, -n.keyPanSpeed), t = !0;
				break;
			case n.keys.LEFT:
				O(n.keyPanSpeed, 0), t = !0;
				break;
			case n.keys.RIGHT: O(-n.keyPanSpeed, 0), t = !0;
		}
		t && (e.preventDefault(), n.update());
	}
	function I(e) {
		if (e.touches.length === 1) m.set(e.touches[0].pageX, e.touches[0].pageY);
		else {
			var t = .5 * (e.touches[0].pageX + e.touches[1].pageX), n = .5 * (e.touches[0].pageY + e.touches[1].pageY);
			m.set(t, n);
		}
	}
	function ue(e) {
		if (e.touches.length === 1) _.set(e.touches[0].pageX, e.touches[0].pageY);
		else {
			var t = .5 * (e.touches[0].pageX + e.touches[1].pageX), n = .5 * (e.touches[0].pageY + e.touches[1].pageY);
			_.set(t, n);
		}
	}
	function de(e) {
		var t = e.touches[0].pageX - e.touches[1].pageX, n = e.touches[0].pageY - e.touches[1].pageY, r = Math.sqrt(t * t + n * n);
		b.set(0, r);
	}
	function L(e) {
		n.enableZoom && de(e), n.enablePan && ue(e);
	}
	function fe(e) {
		n.enableZoom && de(e), n.enableRotate && I(e);
	}
	function pe(e) {
		if (e.touches.length === 1) h.set(e.touches[0].pageX, e.touches[0].pageY);
		else {
			var t = .5 * (e.touches[0].pageX + e.touches[1].pageX), r = .5 * (e.touches[0].pageY + e.touches[1].pageY);
			h.set(t, r);
		}
		g.subVectors(h, m).multiplyScalar(n.rotateSpeed);
		var i = n.domElement;
		E(2 * Math.PI * g.x / i.clientHeight), ee(2 * Math.PI * g.y / i.clientHeight), m.copy(h);
	}
	function me(e) {
		if (e.touches.length === 1) v.set(e.touches[0].pageX, e.touches[0].pageY);
		else {
			var t = .5 * (e.touches[0].pageX + e.touches[1].pageX), r = .5 * (e.touches[0].pageY + e.touches[1].pageY);
			v.set(t, r);
		}
		y.subVectors(v, _).multiplyScalar(n.panSpeed), O(y.x, y.y), _.copy(v);
	}
	function he(e) {
		var t = e.touches[0].pageX - e.touches[1].pageX, r = e.touches[0].pageY - e.touches[1].pageY, i = Math.sqrt(t * t + r * r);
		x.set(0, i), S.set(0, (x.y / b.y) ** +n.zoomSpeed), ne(S.y), b.copy(x);
	}
	function ge(e) {
		n.enableZoom && he(e), n.enablePan && me(e);
	}
	function _e(e) {
		n.enableZoom && he(e), n.enableRotate && pe(e);
	}
	function ve(e) {
		if (n.enabled !== !1) {
			switch (e.preventDefault(), n.domElement.focus ? n.domElement.focus() : window.focus(), e.button) {
				case 0:
					if (e[n.keyMods.noMiddleButton]) if (e[n.keyMods.pan] && !e[n.keyMods.dolly]) {
						if (n.enablePan === !1) return;
						ae(e), s = o.PAN;
					} else if (e[n.keyMods.dolly]) {
						if (n.enableZoom === !1) return;
						A(e), s = o.DOLLY;
					} else {
						if (n.enableRotate === !1) return;
						ie(e), s = o.ROTATE;
					}
					else s = o.NONE;
					break;
				case 1:
					if (e[n.keyMods.pan] && !e[n.keyMods.dolly]) {
						if (n.enablePan === !1) return;
						ae(e), s = o.PAN;
					} else if (e[n.keyMods.dolly]) {
						if (n.enableZoom === !1) return;
						A(e), s = o.DOLLY;
					} else {
						if (n.enableRotate === !1) return;
						ie(e), s = o.ROTATE;
					}
					break;
				case 2: s = o.NONE;
			}
			s !== o.NONE && (document.addEventListener("mousemove", ye, !1), document.addEventListener("mouseup", R, !1), n.dispatchEvent(i));
		}
	}
	function ye(e) {
		if (n.enabled !== !1) switch (e.preventDefault(), s) {
			case o.ROTATE:
				if (n.enableRotate === !1) return;
				oe(e);
				break;
			case o.DOLLY:
				if (n.enableZoom === !1) return;
				M(e);
				break;
			case o.PAN:
				if (n.enablePan === !1) return;
				N(e);
		}
	}
	function R(e) {
		n.enabled !== !1 && (document.removeEventListener("mousemove", ye, !1), document.removeEventListener("mouseup", R, !1), n.dispatchEvent(a), s = o.NONE);
	}
	function be(e) {
		n.enabled === !1 || n.enableZoom === !1 || s !== o.NONE && s !== o.ROTATE || (e.preventDefault(), e.stopPropagation(), n.dispatchEvent(i), ce(e), n.dispatchEvent(a));
	}
	function z(e) {
		n.enabled !== !1 && n.enableKeys !== !1 && n.enablePan !== !1 && le(e);
	}
	function B(e) {
		if (n.enabled !== !1) {
			switch (e.preventDefault(), e.touches.length) {
				case 1:
					switch (n.touches.ONE) {
						case j.ROTATE:
							if (n.enableRotate === !1) return;
							I(e), s = o.TOUCH_ROTATE;
							break;
						case j.PAN:
							if (n.enablePan === !1) return;
							ue(e), s = o.TOUCH_PAN;
							break;
						default: s = o.NONE;
					}
					break;
				case 2:
					switch (n.touches.TWO) {
						case j.DOLLY_PAN:
							if (n.enableZoom === !1 && n.enablePan === !1) return;
							L(e), s = o.TOUCH_DOLLY_PAN;
							break;
						case j.DOLLY_ROTATE:
							if (n.enableZoom === !1 && n.enableRotate === !1) return;
							fe(e), s = o.TOUCH_DOLLY_ROTATE;
							break;
						default: s = o.NONE;
					}
					break;
				default: s = o.NONE;
			}
			s !== o.NONE && n.dispatchEvent(i);
		}
	}
	function V(e) {
		if (n.enabled !== !1) switch (e.preventDefault(), e.stopPropagation(), s) {
			case o.TOUCH_ROTATE:
				if (n.enableRotate === !1) return;
				pe(e), n.update();
				break;
			case o.TOUCH_PAN:
				if (n.enablePan === !1) return;
				me(e), n.update();
				break;
			case o.TOUCH_DOLLY_PAN:
				if (n.enableZoom === !1 && n.enablePan === !1) return;
				ge(e), n.update();
				break;
			case o.TOUCH_DOLLY_ROTATE:
				if (n.enableZoom === !1 && n.enableRotate === !1) return;
				_e(e), n.update();
				break;
			default: s = o.NONE;
		}
	}
	function H(e) {
		n.enabled !== !1 && (n.dispatchEvent(a), s = o.NONE);
	}
	function xe(e) {
		n.enabled !== !1 && e.preventDefault();
	}
	n.domElement.addEventListener("contextmenu", xe, !1), n.domElement.addEventListener("mousedown", ve, !1), n.domElement.addEventListener("wheel", be, !1), n.domElement.addEventListener("touchstart", B, !1), n.domElement.addEventListener("touchend", H, !1), n.domElement.addEventListener("touchmove", V, !1), n.domElement.addEventListener("keydown", z, !1), n.domElement.tabIndex === -1 && (n.domElement.tabIndex = 0), this.update();
};
R.prototype = Object.create(v.prototype), R.prototype.constructor = R;
var be = function(e, t) {
	R.call(this, e, t), this.mouseButtons.LEFT = w.PAN, this.mouseButtons.RIGHT = w.ROTATE, this.touches.ONE = j.PAN, this.touches.TWO = j.DOLLY_ROTATE;
};
be.prototype = Object.create(v.prototype), be.prototype.constructor = be;
//#endregion
//#region src/render/TransformControls.js
var z = new ie(), B = new F(), V = new F(), H = new k(), xe = {
	X: new F(1, 0, 0),
	Y: new F(0, 1, 0),
	Z: new F(0, 0, 1)
}, Se = { type: "change" }, Ce = {
	type: "mouseDown",
	mode: null
}, we = {
	type: "mouseUp",
	mode: null
}, Te = { type: "objectChange" }, Ee = class extends m {
	constructor(e, t = null) {
		super(void 0, t);
		let n = new Be(this);
		this._root = n;
		let r = new Ve();
		this._gizmo = r, n.add(r);
		let i = new He();
		this._plane = i, n.add(i);
		let a = this;
		function o(e, t) {
			let n = t;
			Object.defineProperty(a, e, {
				get: function() {
					return n === void 0 ? t : n;
				},
				set: function(t) {
					n !== t && (n = t, i[e] = t, r[e] = t, a.dispatchEvent({
						type: e + "-changed",
						value: t
					}), a.dispatchEvent(Se));
				}
			}), a[e] = t, i[e] = t, r[e] = t;
		}
		o("camera", e), o("object", void 0), o("allAssociatedObjects", void 0), o("enabled", !0), o("axis", null), o("mode", "translate"), o("translationSnap", null), o("rotationSnap", null), o("scaleSnap", null), o("space", "world"), o("size", 1), o("dragging", !1), o("showX", !0), o("showY", !0), o("showZ", !0), o("minX", -Infinity), o("maxX", Infinity), o("minY", -Infinity), o("maxY", Infinity), o("minZ", -Infinity), o("maxZ", Infinity);
		let s = new F(), c = new F(), l = new k(), u = new k(), d = new F(), f = new k(), p = new F(), m = new F(), h = new F(), g = new F();
		o("worldPosition", s), o("worldPositionStart", c), o("worldQuaternion", l), o("worldQuaternionStart", u), o("cameraPosition", d), o("cameraQuaternion", f), o("pointStart", p), o("pointEnd", m), o("rotationAxis", h), o("rotationAngle", 0), o("eye", g), this._offset = new F(), this._startNorm = new F(), this._endNorm = new F(), this._cameraScale = new F(), this._parentPosition = new F(), this._parentQuaternion = new k(), this._parentQuaternionInv = new k(), this._parentScale = new F(), this._worldScaleStart = new F(), this._worldQuaternionInv = new k(), this._worldScale = new F(), this._positionStart = new F(), this._quaternionStart = new k(), this._scaleStart = new F(), this._getPointer = De.bind(this), this._onPointerDown = ke.bind(this), this._onPointerHover = Oe.bind(this), this._onPointerMove = Ae.bind(this), this._onPointerUp = je.bind(this), t !== null && this.connect(t);
	}
	connect(e) {
		super.connect(e), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointermove", this._onPointerHover), this.domElement.addEventListener("pointerup", this._onPointerUp), this.domElement.style.touchAction = "none";
	}
	disconnect() {
		this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerHover), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.style.touchAction = "auto";
	}
	getHelper() {
		return this._root;
	}
	pointerHover(e) {
		if (this.object === void 0 || this.dragging === !0) return;
		e !== null && z.setFromCamera(e, this.camera);
		let t = Me(this._gizmo.picker[this.mode], z);
		this.axis = t ? t.object.name : null;
	}
	pointerDown(e) {
		if (!(this.object === void 0 || this.dragging === !0 || e != null && e.button !== 0) && this.axis !== null) {
			e !== null && z.setFromCamera(e, this.camera);
			let t = Me(this._plane, z, !0);
			t && (this.object.updateMatrixWorld(), this.object.parent.updateMatrixWorld(), this._positionStart.copy(this.object.position), this._quaternionStart.copy(this.object.quaternion), this._scaleStart.copy(this.object.scale), this.object.matrixWorld.decompose(this.worldPositionStart, this.worldQuaternionStart, this._worldScaleStart), this.pointStart.copy(t.point).sub(this.worldPositionStart)), this.dragging = !0, Ce.mode = this.mode, this.dispatchEvent(Ce);
		}
	}
	pointerMove(e) {
		let t = this.axis, n = this.mode, r = this.object, i = this.space;
		if (n === "scale" ? i = "local" : (t === "E" || t === "XYZE" || t === "XYZ") && (i = "world"), r === void 0 || t === null || this.dragging === !1 || e !== null && e.button !== -1) return;
		e !== null && z.setFromCamera(e, this.camera);
		let a = Me(this._plane, z, !0);
		if (a) {
			if (this.pointEnd.copy(a.point).sub(this.worldPositionStart), n === "translate") this._offset.copy(this.pointEnd).sub(this.pointStart), i === "local" && t !== "XYZ" && this._offset.applyQuaternion(this._worldQuaternionInv), t.indexOf("X") === -1 && (this._offset.x = 0), t.indexOf("Y") === -1 && (this._offset.y = 0), t.indexOf("Z") === -1 && (this._offset.z = 0), i === "local" && t !== "XYZ" ? this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale) : this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale), r.position.copy(this._offset).add(this._positionStart), this.translationSnap && (i === "local" && (r.position.applyQuaternion(H.copy(this._quaternionStart).invert()), t.search("X") !== -1 && (r.position.x = Math.round(r.position.x / this.translationSnap) * this.translationSnap), t.search("Y") !== -1 && (r.position.y = Math.round(r.position.y / this.translationSnap) * this.translationSnap), t.search("Z") !== -1 && (r.position.z = Math.round(r.position.z / this.translationSnap) * this.translationSnap), r.position.applyQuaternion(this._quaternionStart)), i === "world" && (r.parent && r.position.add(B.setFromMatrixPosition(r.parent.matrixWorld)), t.search("X") !== -1 && (r.position.x = Math.round(r.position.x / this.translationSnap) * this.translationSnap), t.search("Y") !== -1 && (r.position.y = Math.round(r.position.y / this.translationSnap) * this.translationSnap), t.search("Z") !== -1 && (r.position.z = Math.round(r.position.z / this.translationSnap) * this.translationSnap), r.parent && r.position.sub(B.setFromMatrixPosition(r.parent.matrixWorld)))), r.position.x = Math.max(this.minX, Math.min(this.maxX, r.position.x)), r.position.y = Math.max(this.minY, Math.min(this.maxY, r.position.y)), r.position.z = Math.max(this.minZ, Math.min(this.maxZ, r.position.z));
			else if (n === "scale") {
				if (t.search("XYZ") !== -1) {
					let e = this.pointEnd.length() / this.pointStart.length();
					this.pointEnd.dot(this.pointStart) < 0 && (e *= -1), V.set(e, e, e);
				} else B.copy(this.pointStart), V.copy(this.pointEnd), B.applyQuaternion(this._worldQuaternionInv), V.applyQuaternion(this._worldQuaternionInv), V.divide(B), t.search("X") === -1 && (V.x = 1), t.search("Y") === -1 && (V.y = 1), t.search("Z") === -1 && (V.z = 1);
				r.scale.copy(this._scaleStart).multiply(V), this.scaleSnap && (t.search("X") !== -1 && (r.scale.x = Math.round(r.scale.x / this.scaleSnap) * this.scaleSnap || this.scaleSnap), t.search("Y") !== -1 && (r.scale.y = Math.round(r.scale.y / this.scaleSnap) * this.scaleSnap || this.scaleSnap), t.search("Z") !== -1 && (r.scale.z = Math.round(r.scale.z / this.scaleSnap) * this.scaleSnap || this.scaleSnap));
			} else if (n === "rotate") {
				this._offset.copy(this.pointEnd).sub(this.pointStart);
				let e = 20 / this.worldPosition.distanceTo(B.setFromMatrixPosition(this.camera.matrixWorld)), n = !1;
				t === "XYZE" ? (this.rotationAxis.copy(this._offset).cross(this.eye).normalize(), this.rotationAngle = this._offset.dot(B.copy(this.rotationAxis).cross(this.eye)) * e) : (t === "X" || t === "Y" || t === "Z") && (this.rotationAxis.copy(xe[t]), B.copy(xe[t]), i === "local" && B.applyQuaternion(this.worldQuaternion), B.cross(this.eye), B.length() === 0 ? n = !0 : this.rotationAngle = this._offset.dot(B.normalize()) * e), (t === "E" || n) && (this.rotationAxis.copy(this.eye), this.rotationAngle = this.pointEnd.angleTo(this.pointStart), this._startNorm.copy(this.pointStart).normalize(), this._endNorm.copy(this.pointEnd).normalize(), this.rotationAngle *= this._endNorm.cross(this._startNorm).dot(this.eye) < 0 ? 1 : -1), this.rotationSnap && (this.rotationAngle = Math.round(this.rotationAngle / this.rotationSnap) * this.rotationSnap), i === "local" && t !== "E" && t !== "XYZE" ? (r.quaternion.copy(this._quaternionStart), r.quaternion.multiply(H.setFromAxisAngle(this.rotationAxis, this.rotationAngle)).normalize()) : (this.rotationAxis.applyQuaternion(this._parentQuaternionInv), r.quaternion.copy(H.setFromAxisAngle(this.rotationAxis, this.rotationAngle)), r.quaternion.multiply(this._quaternionStart).normalize());
			}
			this.dispatchEvent(Se), this.dispatchEvent(Te);
		}
	}
	pointerUp(e) {
		(e === null || e.button === 0) && (this.dragging && this.axis !== null && (we.mode = this.mode, this.dispatchEvent(we)), this.dragging = !1, this.axis = null);
	}
	dispose() {
		this.disconnect(), this._root.dispose();
	}
	attach(e) {
		return Array.isArray(e) ? (this.object = e[0], this.allAssociatedObjects = e) : (this.object = e, this.allAssociatedObjects = [e]), this._root.visible = !0, this;
	}
	detach() {
		return this.object = void 0, this.allAssociatedObjects = void 0, this.axis = null, this._root.visible = !1, this;
	}
	reset() {
		this.enabled && this.dragging && (this.object.position.copy(this._positionStart), this.object.quaternion.copy(this._quaternionStart), this.object.scale.copy(this._scaleStart), this.dispatchEvent(Se), this.dispatchEvent(Te), this.pointStart.copy(this.pointEnd));
	}
	getRaycaster() {
		return z;
	}
	getMode() {
		return this.mode;
	}
	setMode(e) {
		this.mode = e;
	}
	setTranslationSnap(e) {
		this.translationSnap = e;
	}
	setRotationSnap(e) {
		this.rotationSnap = e;
	}
	setScaleSnap(e) {
		this.scaleSnap = e;
	}
	setSize(e) {
		this.size = e;
	}
	setSpace(e) {
		this.space = e;
	}
	setColors(e, t, n, r) {
		let i = this._gizmo.materialLib;
		i.xAxis.color.set(e), i.yAxis.color.set(t), i.zAxis.color.set(n), i.active.color.set(r), i.xAxisTransparent.color.set(e), i.yAxisTransparent.color.set(t), i.zAxisTransparent.color.set(n), i.activeTransparent.color.set(r), i.xAxis._color && i.xAxis._color.set(e), i.yAxis._color && i.yAxis._color.set(t), i.zAxis._color && i.zAxis._color.set(n), i.active._color && i.active._color.set(r), i.xAxisTransparent._color && i.xAxisTransparent._color.set(e), i.yAxisTransparent._color && i.yAxisTransparent._color.set(t), i.zAxisTransparent._color && i.zAxisTransparent._color.set(n), i.activeTransparent._color && i.activeTransparent._color.set(r);
	}
};
function De(e) {
	if (this.domElement.ownerDocument.pointerLockElement) return {
		x: 0,
		y: 0,
		button: e.button
	};
	{
		let t = this.domElement.getBoundingClientRect();
		return {
			x: (e.clientX - t.left) / t.width * 2 - 1,
			y: -(e.clientY - t.top) / t.height * 2 + 1,
			button: e.button
		};
	}
}
function Oe(e) {
	if (this.enabled) switch (e.pointerType) {
		case "mouse":
		case "pen": this.pointerHover(this._getPointer(e));
	}
}
function ke(e) {
	this.enabled && (document.pointerLockElement || this.domElement.setPointerCapture(e.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.pointerHover(this._getPointer(e)), this.pointerDown(this._getPointer(e)));
}
function Ae(e) {
	this.enabled && this.pointerMove(this._getPointer(e));
}
function je(e) {
	this.enabled && (this.domElement.releasePointerCapture(e.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.pointerUp(this._getPointer(e)));
}
function Me(e, t, n) {
	let r = t.intersectObject(e, !0);
	for (let e = 0; e < r.length; e++) if (r[e].object.visible || n) return r[e];
	return !1;
}
var Ne = new _(), U = new F(0, 1, 0), Pe = new F(0, 0, 0), Fe = new T(), Ie = new k(), Le = new k(), W = new F(), Re = new T(), G = new F(1, 0, 0), K = new F(0, 1, 0), q = new F(0, 0, 1), ze = new F(), J = new F(), Y = new F(), Be = class extends D {
	constructor(e) {
		super(), this.isTransformControlsRoot = !0, this.controls = e, this.visible = !1;
	}
	updateMatrixWorld(e) {
		let t = this.controls;
		t.object !== void 0 && (t.object.updateMatrixWorld(), t.object.parent === null ? console.error("TransformControls: The attached 3D object must be a part of the scene graph.") : t.object.parent.matrixWorld.decompose(t._parentPosition, t._parentQuaternion, t._parentScale), t.object.matrixWorld.decompose(t.worldPosition, t.worldQuaternion, t._worldScale), t._parentQuaternionInv.copy(t._parentQuaternion).invert(), t._worldQuaternionInv.copy(t.worldQuaternion).invert()), t.camera.updateMatrixWorld(), t.camera.matrixWorld.decompose(t.cameraPosition, t.cameraQuaternion, t._cameraScale), t.camera.isOrthographicCamera ? t.camera.getWorldDirection(t.eye).negate() : t.eye.copy(t.cameraPosition).sub(t.worldPosition).normalize(), super.updateMatrixWorld(e);
	}
	dispose() {
		this.traverse(function(e) {
			e.geometry && e.geometry.dispose(), e.material && e.material.dispose();
		});
	}
}, Ve = class extends D {
	constructor() {
		super(), this.isTransformControlsGizmo = !0, this.type = "TransformControlsGizmo";
		let e = new ee({
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			toneMapped: !1,
			transparent: !0
		}), t = new S({
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			toneMapped: !1,
			transparent: !0
		}), n = e.clone();
		n.opacity = .15;
		let r = t.clone();
		r.opacity = .5;
		let i = e.clone();
		i.color.setHex(16711680);
		let a = e.clone();
		a.color.setHex(65280);
		let o = e.clone();
		o.color.setHex(255);
		let s = e.clone();
		s.color.setHex(16711680), s.opacity = .5;
		let c = e.clone();
		c.color.setHex(65280), c.opacity = .5;
		let l = e.clone();
		l.color.setHex(255), l.opacity = .5;
		let u = e.clone();
		u.opacity = .25;
		let p = e.clone();
		p.color.setHex(16776960), p.opacity = .25;
		let m = e.clone();
		m.color.setHex(16776960);
		let g = e.clone();
		g.color.setHex(7895160), this.materialLib = {
			xAxis: i,
			yAxis: a,
			zAxis: o,
			active: m,
			xAxisTransparent: s,
			yAxisTransparent: c,
			zAxisTransparent: l,
			activeTransparent: p
		};
		let _ = new h(0, .04, .1, 12);
		_.translate(0, .05, 0);
		let v = new d(.08, .08, .08);
		v.translate(0, .04, 0);
		let b = new f();
		b.setAttribute("position", new y([
			0,
			0,
			0,
			1,
			0,
			0
		], 3));
		let C = new h(.0075, .0075, .5, 3);
		C.translate(0, .25, 0);
		function w(e, t) {
			let n = new N(e, .0075, 3, 64, t * Math.PI * 2);
			return n.rotateY(Math.PI / 2), n.rotateX(Math.PI / 2), n;
		}
		function T() {
			let e = new f();
			return e.setAttribute("position", new y([
				0,
				0,
				0,
				1,
				1,
				1
			], 3)), e;
		}
		let te = {
			X: [
				[
					new E(_, i),
					[
						.5,
						0,
						0
					],
					[
						0,
						0,
						-Math.PI / 2
					]
				],
				[
					new E(_, i),
					[
						-.5,
						0,
						0
					],
					[
						0,
						0,
						Math.PI / 2
					]
				],
				[
					new E(C, i),
					[
						0,
						0,
						0
					],
					[
						0,
						0,
						-Math.PI / 2
					]
				]
			],
			Y: [
				[new E(_, a), [
					0,
					.5,
					0
				]],
				[
					new E(_, a),
					[
						0,
						-.5,
						0
					],
					[
						Math.PI,
						0,
						0
					]
				],
				[new E(C, a)]
			],
			Z: [
				[
					new E(_, o),
					[
						0,
						0,
						.5
					],
					[
						Math.PI / 2,
						0,
						0
					]
				],
				[
					new E(_, o),
					[
						0,
						0,
						-.5
					],
					[
						-Math.PI / 2,
						0,
						0
					]
				],
				[
					new E(C, o),
					null,
					[
						Math.PI / 2,
						0,
						0
					]
				]
			],
			XYZ: [[new E(new O(.1, 0), u), [
				0,
				0,
				0
			]]],
			XY: [[new E(new d(.15, .15, .01), l), [
				.15,
				.15,
				0
			]]],
			YZ: [[
				new E(new d(.15, .15, .01), s),
				[
					0,
					.15,
					.15
				],
				[
					0,
					Math.PI / 2,
					0
				]
			]],
			XZ: [[
				new E(new d(.15, .15, .01), c),
				[
					.15,
					0,
					.15
				],
				[
					-Math.PI / 2,
					0,
					0
				]
			]]
		}, ne = {
			X: [[
				new E(new h(.2, 0, .6, 4), n),
				[
					.3,
					0,
					0
				],
				[
					0,
					0,
					-Math.PI / 2
				]
			], [
				new E(new h(.2, 0, .6, 4), n),
				[
					-.3,
					0,
					0
				],
				[
					0,
					0,
					Math.PI / 2
				]
			]],
			Y: [[new E(new h(.2, 0, .6, 4), n), [
				0,
				.3,
				0
			]], [
				new E(new h(.2, 0, .6, 4), n),
				[
					0,
					-.3,
					0
				],
				[
					0,
					0,
					Math.PI
				]
			]],
			Z: [[
				new E(new h(.2, 0, .6, 4), n),
				[
					0,
					0,
					.3
				],
				[
					Math.PI / 2,
					0,
					0
				]
			], [
				new E(new h(.2, 0, .6, 4), n),
				[
					0,
					0,
					-.3
				],
				[
					-Math.PI / 2,
					0,
					0
				]
			]],
			XYZ: [[new E(new O(.2, 0), n)]],
			XY: [[new E(new d(.2, .2, .01), n), [
				.15,
				.15,
				0
			]]],
			YZ: [[
				new E(new d(.2, .2, .01), n),
				[
					0,
					.15,
					.15
				],
				[
					0,
					Math.PI / 2,
					0
				]
			]],
			XZ: [[
				new E(new d(.2, .2, .01), n),
				[
					.15,
					0,
					.15
				],
				[
					-Math.PI / 2,
					0,
					0
				]
			]]
		}, re = {
			START: [[
				new E(new O(.01, 2), r),
				null,
				null,
				null,
				"helper"
			]],
			END: [[
				new E(new O(.01, 2), r),
				null,
				null,
				null,
				"helper"
			]],
			DELTA: [[
				new x(T(), r),
				null,
				null,
				null,
				"helper"
			]],
			X: [[
				new x(b, r),
				[
					-1e3,
					0,
					0
				],
				null,
				[
					1e6,
					1,
					1
				],
				"helper"
			]],
			Y: [[
				new x(b, r),
				[
					0,
					-1e3,
					0
				],
				[
					0,
					0,
					Math.PI / 2
				],
				[
					1e6,
					1,
					1
				],
				"helper"
			]],
			Z: [[
				new x(b, r),
				[
					0,
					0,
					-1e3
				],
				[
					0,
					-Math.PI / 2,
					0
				],
				[
					1e6,
					1,
					1
				],
				"helper"
			]]
		}, k = {
			XYZE: [[
				new E(w(.5, 1), g),
				null,
				[
					0,
					Math.PI / 2,
					0
				]
			]],
			X: [[new E(w(.5, .5), i)]],
			Y: [[
				new E(w(.5, .5), a),
				null,
				[
					0,
					0,
					-Math.PI / 2
				]
			]],
			Z: [[
				new E(w(.5, .5), o),
				null,
				[
					0,
					Math.PI / 2,
					0
				]
			]],
			E: [[
				new E(w(.75, 1), p),
				null,
				[
					0,
					Math.PI / 2,
					0
				]
			]]
		}, ie = { AXIS: [[
			new x(b, r),
			[
				-1e3,
				0,
				0
			],
			null,
			[
				1e6,
				1,
				1
			],
			"helper"
		]] }, A = {
			XYZE: [[new E(new oe(.25, 10, 8), n)]],
			X: [[
				new E(new N(.5, .1, 4, 24), n),
				[
					0,
					0,
					0
				],
				[
					0,
					-Math.PI / 2,
					-Math.PI / 2
				]
			]],
			Y: [[
				new E(new N(.5, .1, 4, 24), n),
				[
					0,
					0,
					0
				],
				[
					Math.PI / 2,
					0,
					0
				]
			]],
			Z: [[
				new E(new N(.5, .1, 4, 24), n),
				[
					0,
					0,
					0
				],
				[
					0,
					0,
					-Math.PI / 2
				]
			]],
			E: [[new E(new N(.75, .1, 2, 24), n)]]
		}, ae = {
			X: [
				[
					new E(v, i),
					[
						.5,
						0,
						0
					],
					[
						0,
						0,
						-Math.PI / 2
					]
				],
				[
					new E(C, i),
					[
						0,
						0,
						0
					],
					[
						0,
						0,
						-Math.PI / 2
					]
				],
				[
					new E(v, i),
					[
						-.5,
						0,
						0
					],
					[
						0,
						0,
						Math.PI / 2
					]
				]
			],
			Y: [
				[new E(v, a), [
					0,
					.5,
					0
				]],
				[new E(C, a)],
				[
					new E(v, a),
					[
						0,
						-.5,
						0
					],
					[
						0,
						0,
						Math.PI
					]
				]
			],
			Z: [
				[
					new E(v, o),
					[
						0,
						0,
						.5
					],
					[
						Math.PI / 2,
						0,
						0
					]
				],
				[
					new E(C, o),
					[
						0,
						0,
						0
					],
					[
						Math.PI / 2,
						0,
						0
					]
				],
				[
					new E(v, o),
					[
						0,
						0,
						-.5
					],
					[
						-Math.PI / 2,
						0,
						0
					]
				]
			],
			XY: [[new E(new d(.15, .15, .01), l), [
				.15,
				.15,
				0
			]]],
			YZ: [[
				new E(new d(.15, .15, .01), s),
				[
					0,
					.15,
					.15
				],
				[
					0,
					Math.PI / 2,
					0
				]
			]],
			XZ: [[
				new E(new d(.15, .15, .01), c),
				[
					.15,
					0,
					.15
				],
				[
					-Math.PI / 2,
					0,
					0
				]
			]],
			XYZ: [[new E(new d(.1, .1, .1), u)]]
		}, se = {
			X: [[
				new E(new h(.2, 0, .6, 4), n),
				[
					.3,
					0,
					0
				],
				[
					0,
					0,
					-Math.PI / 2
				]
			], [
				new E(new h(.2, 0, .6, 4), n),
				[
					-.3,
					0,
					0
				],
				[
					0,
					0,
					Math.PI / 2
				]
			]],
			Y: [[new E(new h(.2, 0, .6, 4), n), [
				0,
				.3,
				0
			]], [
				new E(new h(.2, 0, .6, 4), n),
				[
					0,
					-.3,
					0
				],
				[
					0,
					0,
					Math.PI
				]
			]],
			Z: [[
				new E(new h(.2, 0, .6, 4), n),
				[
					0,
					0,
					.3
				],
				[
					Math.PI / 2,
					0,
					0
				]
			], [
				new E(new h(.2, 0, .6, 4), n),
				[
					0,
					0,
					-.3
				],
				[
					-Math.PI / 2,
					0,
					0
				]
			]],
			XY: [[new E(new d(.2, .2, .01), n), [
				.15,
				.15,
				0
			]]],
			YZ: [[
				new E(new d(.2, .2, .01), n),
				[
					0,
					.15,
					.15
				],
				[
					0,
					Math.PI / 2,
					0
				]
			]],
			XZ: [[
				new E(new d(.2, .2, .01), n),
				[
					.15,
					0,
					.15
				],
				[
					-Math.PI / 2,
					0,
					0
				]
			]],
			XYZ: [[new E(new d(.2, .2, .2), n), [
				0,
				0,
				0
			]]]
		}, j = {
			X: [[
				new x(b, r),
				[
					-1e3,
					0,
					0
				],
				null,
				[
					1e6,
					1,
					1
				],
				"helper"
			]],
			Y: [[
				new x(b, r),
				[
					0,
					-1e3,
					0
				],
				[
					0,
					0,
					Math.PI / 2
				],
				[
					1e6,
					1,
					1
				],
				"helper"
			]],
			Z: [[
				new x(b, r),
				[
					0,
					0,
					-1e3
				],
				[
					0,
					-Math.PI / 2,
					0
				],
				[
					1e6,
					1,
					1
				],
				"helper"
			]]
		};
		function M(e) {
			let t = new D();
			for (let n in e) for (let r = e[n].length; r--;) {
				let i = e[n][r][0].clone(), a = e[n][r][1], o = e[n][r][2], s = e[n][r][3], c = e[n][r][4];
				i.name = n, i.tag = c, a && i.position.set(a[0], a[1], a[2]), o && i.rotation.set(o[0], o[1], o[2]), s && i.scale.set(s[0], s[1], s[2]), i.updateMatrix();
				let l = i.geometry.clone();
				l.applyMatrix4(i.matrix), i.geometry = l, i.renderOrder = Infinity, i.position.set(0, 0, 0), i.rotation.set(0, 0, 0), i.scale.set(1, 1, 1), t.add(i);
			}
			return t;
		}
		this.gizmo = {}, this.picker = {}, this.helper = {}, this.add(this.gizmo.translate = M(te)), this.add(this.gizmo.rotate = M(k)), this.add(this.gizmo.scale = M(ae)), this.add(this.picker.translate = M(ne)), this.add(this.picker.rotate = M(A)), this.add(this.picker.scale = M(se)), this.add(this.helper.translate = M(re)), this.add(this.helper.rotate = M(ie)), this.add(this.helper.scale = M(j)), this.picker.translate.visible = !1, this.picker.rotate.visible = !1, this.picker.scale.visible = !1;
	}
	updateMatrixWorld(e) {
		let t = (this.mode === "scale" ? "local" : this.space) === "local" ? this.worldQuaternion : Le;
		this.gizmo.translate.visible = this.mode === "translate", this.gizmo.rotate.visible = this.mode === "rotate", this.gizmo.scale.visible = this.mode === "scale", this.helper.translate.visible = this.mode === "translate", this.helper.rotate.visible = this.mode === "rotate", this.helper.scale.visible = this.mode === "scale";
		let n = [];
		n = n.concat(this.picker[this.mode].children), n = n.concat(this.gizmo[this.mode].children), n = n.concat(this.helper[this.mode].children);
		for (let e = 0; e < n.length; e++) {
			let r = n[e];
			r.visible = !0, r.rotation.set(0, 0, 0), r.position.copy(this.worldPosition);
			let i;
			if (i = this.camera.isOrthographicCamera ? (this.camera.top - this.camera.bottom) / this.camera.zoom : this.worldPosition.distanceTo(this.cameraPosition) * Math.min(1.9 * Math.tan(Math.PI * this.camera.fov / 360) / this.camera.zoom, 7), r.scale.set(1, 1, 1).multiplyScalar(i * this.size / 4), r.tag === "helper") {
				r.visible = !1, r.name === "AXIS" ? (r.visible = !!this.axis, this.axis === "X" && (H.setFromEuler(Ne.set(0, 0, 0)), r.quaternion.copy(t).multiply(H), Math.abs(U.copy(G).applyQuaternion(t).dot(this.eye)) > .9 && (r.visible = !1)), this.axis === "Y" && (H.setFromEuler(Ne.set(0, 0, Math.PI / 2)), r.quaternion.copy(t).multiply(H), Math.abs(U.copy(K).applyQuaternion(t).dot(this.eye)) > .9 && (r.visible = !1)), this.axis === "Z" && (H.setFromEuler(Ne.set(0, Math.PI / 2, 0)), r.quaternion.copy(t).multiply(H), Math.abs(U.copy(q).applyQuaternion(t).dot(this.eye)) > .9 && (r.visible = !1)), this.axis === "XYZE" && (H.setFromEuler(Ne.set(0, Math.PI / 2, 0)), U.copy(this.rotationAxis), r.quaternion.setFromRotationMatrix(Fe.lookAt(Pe, U, K)), r.quaternion.multiply(H), r.visible = this.dragging), this.axis === "E" && (r.visible = !1)) : r.name === "START" ? (r.position.copy(this.worldPositionStart), r.visible = this.dragging) : r.name === "END" ? (r.position.copy(this.worldPosition), r.visible = this.dragging) : r.name === "DELTA" ? (r.position.copy(this.worldPositionStart), r.quaternion.copy(this.worldQuaternionStart), B.set(1e-10, 1e-10, 1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1), B.applyQuaternion(this.worldQuaternionStart.clone().invert()), r.scale.copy(B), r.visible = this.dragging) : (r.quaternion.copy(t), this.dragging ? r.position.copy(this.worldPositionStart) : r.position.copy(this.worldPosition), this.axis && (r.visible = this.axis.search(r.name) !== -1));
				continue;
			}
			if (r.quaternion.copy(t), this.mode === "translate" || this.mode === "scale") {
				let e = .99, n = .2;
				r.name === "X" && Math.abs(U.copy(G).applyQuaternion(t).dot(this.eye)) > e && (r.scale.set(1e-10, 1e-10, 1e-10), r.visible = !1), r.name === "Y" && Math.abs(U.copy(K).applyQuaternion(t).dot(this.eye)) > e && (r.scale.set(1e-10, 1e-10, 1e-10), r.visible = !1), r.name === "Z" && Math.abs(U.copy(q).applyQuaternion(t).dot(this.eye)) > e && (r.scale.set(1e-10, 1e-10, 1e-10), r.visible = !1), r.name === "XY" && Math.abs(U.copy(q).applyQuaternion(t).dot(this.eye)) < n && (r.scale.set(1e-10, 1e-10, 1e-10), r.visible = !1), r.name === "YZ" && Math.abs(U.copy(G).applyQuaternion(t).dot(this.eye)) < n && (r.scale.set(1e-10, 1e-10, 1e-10), r.visible = !1), r.name === "XZ" && Math.abs(U.copy(K).applyQuaternion(t).dot(this.eye)) < n && (r.scale.set(1e-10, 1e-10, 1e-10), r.visible = !1);
			} else this.mode === "rotate" && (Ie.copy(t), U.copy(this.eye).applyQuaternion(H.copy(t).invert()), r.name.search("E") !== -1 && r.quaternion.setFromRotationMatrix(Fe.lookAt(this.eye, Pe, K)), r.name === "X" && (H.setFromAxisAngle(G, Math.atan2(-U.y, U.z)), H.multiplyQuaternions(Ie, H), r.quaternion.copy(H)), r.name === "Y" && (H.setFromAxisAngle(K, Math.atan2(U.x, U.z)), H.multiplyQuaternions(Ie, H), r.quaternion.copy(H)), r.name === "Z" && (H.setFromAxisAngle(q, Math.atan2(U.y, U.x)), H.multiplyQuaternions(Ie, H), r.quaternion.copy(H)));
			r.visible = r.visible && (r.name.indexOf("X") === -1 || this.showX), r.visible = r.visible && (r.name.indexOf("Y") === -1 || this.showY), r.visible = r.visible && (r.name.indexOf("Z") === -1 || this.showZ), r.visible = r.visible && (r.name.indexOf("E") === -1 || this.showX && this.showY && this.showZ), r.material._color = r.material._color || r.material.color.clone(), r.material._opacity = r.material._opacity || r.material.opacity, r.material.color.copy(r.material._color), r.material.opacity = r.material._opacity, this.enabled && this.axis && (r.name === this.axis || this.axis.split("").some(function(e) {
				return r.name === e;
			})) && (r.material.color.copy(this.materialLib.active.color), r.material.opacity = 1);
		}
		super.updateMatrixWorld(e);
	}
}, He = class extends E {
	constructor() {
		super(new re(1e5, 1e5, 2, 2), new ee({
			visible: !1,
			wireframe: !0,
			side: g,
			transparent: !0,
			opacity: .1,
			toneMapped: !1
		})), this.isTransformControlsPlane = !0, this.type = "TransformControlsPlane";
	}
	updateMatrixWorld(e) {
		let t = this.space;
		switch (this.position.copy(this.worldPosition), this.mode === "scale" && (t = "local"), ze.copy(G).applyQuaternion(t === "local" ? this.worldQuaternion : Le), J.copy(K).applyQuaternion(t === "local" ? this.worldQuaternion : Le), Y.copy(q).applyQuaternion(t === "local" ? this.worldQuaternion : Le), U.copy(J), this.mode) {
			case "translate":
			case "scale":
				switch (this.axis) {
					case "X":
						U.copy(this.eye).cross(ze), W.copy(ze).cross(U);
						break;
					case "Y":
						U.copy(this.eye).cross(J), W.copy(J).cross(U);
						break;
					case "Z":
						U.copy(this.eye).cross(Y), W.copy(Y).cross(U);
						break;
					case "XY":
						W.copy(Y);
						break;
					case "YZ":
						W.copy(ze);
						break;
					case "XZ":
						U.copy(Y), W.copy(J);
						break;
					case "XYZ":
					case "E": W.set(0, 0, 0);
				}
				break;
			default: W.set(0, 0, 0);
		}
		W.length() === 0 ? this.quaternion.copy(this.cameraQuaternion) : (Re.lookAt(B.set(0, 0, 0), W, U), this.quaternion.setFromRotationMatrix(Re)), super.updateMatrixWorld(e);
	}
};
//#endregion
//#region src/common/QuatAngle.ts
function Ue(e) {
	let t = Math.acos(e.w), n = e.x / Math.sin(t), r = e.y / Math.sin(t), i = e.z / Math.sin(t), a = Math.sqrt(n ** 2 + r ** 2 + i ** 2);
	return new Ge(t, new F(n / a, r / a, i / a));
}
function We(e) {
	e.angle;
	let t = Math.cos(e.angle), n = Math.sin(e.angle) * e.i, r = Math.sin(e.angle) * e.j, i = Math.sin(e.angle) * e.k;
	return new k(n, r, i, t);
}
var Ge = class {
	_angle;
	vector;
	constructor(e = 0, t = new F(0, 0, 1)) {
		this._angle = e, this.vector = t;
	}
	toQuaternion() {
		return We(this);
	}
	fromQuaternion(e) {
		let t = Ue(e);
		return this.angle = t.angle, this.vector = t.vector.clone(), this;
	}
	get i() {
		return this.vector.x;
	}
	set i(e) {
		this.vector.setX(e);
	}
	get j() {
		return this.vector.y;
	}
	set j(e) {
		this.vector.setY(e);
	}
	get k() {
		return this.vector.z;
	}
	set k(e) {
		this.vector.setZ(e);
	}
	get angle() {
		return this._angle;
	}
	set angle(e) {
		this._angle = e % (Math.PI * 2);
	}
}, Ke = class {
	t1;
	dt;
	time;
	progress;
	length;
	onFinish;
	constructor(e, t) {
		this.length = e, this.progress = 0, this.time = 0, this.dt = 0, this.t1 = 0, this.onFinish = t || (() => {});
	}
	start() {
		this.t1 = Date.now();
	}
	tick() {
		let e = Date.now();
		return this.dt = e - this.t1, this.time += this.dt, this.progress = this.time / this.length, this.t1 = e, this.progress > 1 && (this.progress = 1, this.onFinish(this)), this.progress;
	}
};
//#endregion
//#region src/common/lerp.ts
function qe(e, t, n) {
	return e + (t - e) * n;
}
function Je(e, t, n) {
	return new F(qe(e.x, t.x, n), qe(e.y, t.y, n), qe(e.z, t.z, n));
}
//#endregion
//#region src/common/easing.ts
var X = {
	linear: (e) => e,
	easeInQuad: (e) => e * e,
	easeOutQuad: (e) => e * (2 - e),
	easeInOutQuad: (e) => e < .5 ? 2 * e * e : -1 + (4 - 2 * e) * e,
	easeInCubic: (e) => e * e * e,
	easeOutCubic: (e) => --e * e * e + 1,
	easeInOutCubic: (e) => e < .5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1,
	easeInQuart: (e) => e * e * e * e,
	easeOutQuart: (e) => 1 - --e * e * e * e,
	easeInOutQuart: (e) => e < .5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e,
	easeInQuint: (e) => e * e * e * e * e,
	easeOutQuint: (e) => 1 + --e * e * e * e * e,
	easeInOutQuint: (e) => e < .5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e
}, Z = class e extends u.Group {
	kind;
	selected;
	renderCallback;
	constructor(e, t) {
		super(), this.name = e, this.kind = "container", t && (() => {
			for (let e in t) this[e] = t[e];
		})(), this.selected = !1, this.renderCallback = () => {};
	}
	save() {
		return {
			kind: this.kind,
			visible: this.visible,
			name: this.name,
			position: this.position.toArray(),
			rotation: this.rotation.toArray().slice(0, 3),
			scale: this.scale.toArray(),
			uuid: this.uuid,
			children: this.children.reduce((e, t) => {
				let n = t;
				return typeof n.save == "function" ? [...e, n.save()] : e;
			}, [])
		};
	}
	restore(e) {
		return this.visible = e.visible, this.name = e.name, this.position.fromArray(e.position), this.rotation.fromArray(e.rotation), this.scale.fromArray(e.scale), this.uuid = e.uuid, this;
	}
	dispose() {}
	onModeChange(e) {}
	select() {
		this.selectChildren(), this.selected = !0;
	}
	deselect() {
		this.deselectChildren(), this.selected = !1;
	}
	selectChildren() {
		this.children.filter((t) => t instanceof e).forEach((e) => e.select());
	}
	deselectChildren() {
		this.children.filter((t) => t instanceof e).forEach((e) => e.deselect());
	}
	traverse(e, t = 0) {
		e(this, t);
		for (var n = this.children, r = 0, i = n.length; r < i; r++) {
			let i = n[r];
			i.traverse && i.traverse(e, t + 1);
		}
	}
	traverseVisible(e, t = 0) {
		if (this.visible !== !1) {
			e(this, t);
			for (var n = this.children, r = 0, i = n.length; r < i; r++) {
				let i = n[r];
				i.traverseVisible && i.traverseVisible(e, t + 1);
			}
		}
	}
	get x() {
		return this.position.x;
	}
	set x(e) {
		this.position.setX(e);
	}
	get y() {
		return this.position.y;
	}
	set y(e) {
		this.position.setY(e);
	}
	get z() {
		return this.position.z;
	}
	set z(e) {
		this.position.setZ(e);
	}
	get scalex() {
		return this.scale.x;
	}
	set scalex(e) {
		this.scale.setX(e);
	}
	get scaley() {
		return this.scale.y;
	}
	set scaley(e) {
		this.scale.setY(e);
	}
	get scalez() {
		return this.scale.z;
	}
	set scalez(e) {
		this.scale.setZ(e);
	}
	get rotationx() {
		return this.rotation.x;
	}
	set rotationx(e) {
		this.rotation.x = e;
	}
	get rotationy() {
		return this.rotation.y;
	}
	set rotationy(e) {
		this.rotation.y = e;
	}
	get rotationz() {
		return this.rotation.z;
	}
	set rotationz(e) {
		this.rotation.z = e;
	}
}, Ye = (e) => r(o.getState().containers, (t) => t.kind === e), Xe = "data:image/jpeg;base64,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AAAAAAAAAAAAUnNsdFVudEYjUHhsQFIAAAAAAAAAAAAKdmVjdG9yRGF0YWJvb2wBAAAAAFBnUHNlbnVtAAAAAFBnUHMAAAAAUGdQQwAAAABMZWZ0VW50RiNSbHQAAAAAAAAAAAAAAABUb3AgVW50RiNSbHQAAAAAAAAAAAAAAABTY2wgVW50RiNQcmNAWQAAAAAAAAAAABBjcm9wV2hlblByaW50aW5nYm9vbAAAAAAOY3JvcFJlY3RCb3R0b21sb25nAAAAAAAAAAxjcm9wUmVjdExlZnRsb25nAAAAAAAAAA1jcm9wUmVjdFJpZ2h0bG9uZwAAAAAAAAALY3JvcFJlY3RUb3Bsb25nAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAQBIAAAAAQABOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAAAeOEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAABOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0ECAAAAAAAEAAAAAEAAAJAAAACQAAAAAA4QklNBB4AAAAAAAQAAAAAOEJJTQQaAAAAAAM9AAAABgAAAAAAAAAAAAACAAAAAgAAAAAEAGEALQA0ADUAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAgAAAAIAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAIAAAAAAFJnaHRsb25nAAACAAAAAAZzbGljZXNW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ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxMi0wNi0yM1QwNjoyODozOC0wNDowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTYtMDMtMTNUMjE6MDE6MjYtMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTYtMDMtMTNUMjE6MDE6MjYtMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkIzNDk3MjIyODBFOUU1MTE4NkRCOEJCQTc4M0ZEMzcyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkIyNDk3MjIyODBFOUU1MTE4NkRCOEJCQTc4M0ZEMzcyIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6QjI0OTcyMjI4MEU5RTUxMTg2REI4QkJBNzgzRkQzNzIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOkIyNDk3MjIyODBFOUU1MTE4NkRCOEJCQTc4M0ZEMzcyIiBzdEV2dDp3aGVuPSIyMDEyLTA2LTIzVDA2OjI4OjM4LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL2JtcCB0byBpbWFnZS9qcGVnIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMzQ5NzIyMjgwRTlFNTExODZEQjhCQkE3ODNGRDM3MiIgc3RFdnQ6d2hlbj0iMjAxNi0wMy0xM1QyMTowMToyNi0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAA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", Ze = "data:image/png;base64,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", Qe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyZGJhMzNlOC03M2JkLTRjMmUtOWFmOS00OGFiNTU4ZjJlYmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTYzRkQ0NzBBMkM1MTFFOEFDNUVERjczMTNBOTc0QzgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTYzRkQ0NkZBMkM1MTFFOEFDNUVERjczMTNBOTc0QzgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZGJhMzNlOC03M2JkLTRjMmUtOWFmOS00OGFiNTU4ZjJlYmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MmRiYTMzZTgtNzNiZC00YzJlLTlhZjktNDhhYjU1OGYyZWJlIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+cQJ/swAAABdJREFUeNpiaGhoOHDgAJODgwOQAggwAC6cBsMmqZXvAAAAAElFTkSuQmCC", $e = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATzSURBVHgB7Zo5bBRJFIbfXPbMeLUEEGxib7CBN4BdgXYjezdjA3aBhA2MiHACMikeQEjGEuKKwTgAIsABSIgz4EjAJgEZcQQgEBJHwClhsMf2XM3737hGIyTbVdXVY6D7k1o++qr669Wr9151zGMoxMQp5CyoAP39/XIsJJEFUMiJBKCQEwlAIScSgEJOJACFnCQ1GC8/RpXn96ny7jmV+ScoDp+k+JI2ircto1h2ETWShghQfjhMxTuXqDR6kbzJMe5sKyVal4kIcv4Rn78JQR6IAIn2Tmrq6KLEr50UNIEKUBw5yaM7RBTzpFPZ3HkZaUXqZTURSnf31f4Hq4Agk8d65O/mtTlKdaynoAhEAIzs1NEe6XjT2m2UNBjJBE8DHE0rN1OJLWeKhZg+u59aes9TrE48Vzh3goUrg5Tfv5qSK1ZRtveCUee/BPf+cOAuNa/J0fiuv/nZh8k1Ti0AIwWzb8m5Ha1U53rxB/kDq9mJfpRp4QpnFiCdv3ORWnZdD8ZU+ZlZngZFdqR4l7PnkgNg9jLyW44HuoxBBFgX3uVqOvgWAA5v+uy+wJzUl0BgWAJE92aWUT/4FgDzMt21pyGdV8ASmlZuovzRHvKLLwFgiiDIdXo2sEzWt8EWXwLAGaU3HqKFAqtBAYGWD6wFQHgLbNZ53ItA6f/Xp+WY5N8RJpui3l2aaYsNMdudITQ60ba0Zoo61EeIyeX/UpzzAQBnVrg6KImSqTOFA8Z96a69ZIVnyaetv3mlZ/e0ry+/fSb3TF8emPUanMM1Fb7W9Lm2WAlQmfjgfez52eSWeTuvwDXj+/7zTEBb0CYbrHwA8nmYvy4ljhBj2R+1pou6xmReY1lUtQVT7ATgORtfrD9Pi6OXjHxFihOpksHyFm9dSt57u6ColgyZbFKWZyo6Kp+fj3WvrlM7Fzh0QbHkyZkBOqX5/OLobYrffEOJq49Jl76+ag0i9DVBKydYuHHCmzyyWfv6PF+r4wBrzx8+IfeYPB/32GBlAXA6Ja7f6YJQGX5Al8LlQUpxnKCL9+4FxRbb5SJ2AnDJysTpqIhNJ4WVLI8Lp8kV+gKUX9yXMpoNVgIgJY1lFhmJkOk+JJ2bSwR1HtGgLhXuvLTHsg5hHQpPDW2XlzZz0VMXrBxIn4nFa/5nU20pxQiWMEU4RM5sHDAKhSEYVqVM9wDZYC0AAhWp1ub0R0uBshaCo6e3b8jfv/zxFyXZT9gkVuO9v0tGalt8tV4G/WRiKZ7fGLHTP62TI82/22aV9W2xwVccgN0blwVKU7B54rdC7EsAlKtBEPX6+XBVjfIdCSrv7qJAqYvUFYZ2GK0Ws+FbAFWgnJBNizEKGrWSwPRdFGKd5ALI9FLsDyZ4SyxIS4DA+YMb5F0m2eVcOEuGEA8gjRVLCEAEjPwE7w+mlq8yij3mw2k2iIZhOmAj02+5uh614Ypnu+w8cL49DtNEwRPzFEtkhoMU2w8dyjPBFiJE1xuuikC+D4BjxLY2Pn1RHzpg9JLtnZJIzYVUiEeGqkEOdxxLbZAbL9ahsAmIFjElyo9GxJGh4gORdp+7Jed3rvmzWmXi5Aq1Q1iQHN/6JzK1l3BHVGcgADqLkY4veS3/S7R3cC7QJSntd/mRVD3ooBIjca1aw1MR5UIQfShJIScSgEJOJACFnEgACjmRABRyGpIMfc2E3gI+Az/K3uGhzsi6AAAAAElFTkSuQmCC", et = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sHDgwCEMBJZu0AAAAdaVRYdENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAABM5JREFUWMO1V0tPG2cUPZ4Hxh6DazIOrjFNqJs0FIMqWFgWQkatsmvVbtggKlSVRVf5AWz4AWz4AUSKEChll19QJYSXkECuhFxsHjEhxCYm+DWGMZ5HF72DJq4bAzFXurI0M/I5997v3u9cC65vTJVn2lX/xHINQOYSBLTLEuIuCWw4Z3IGAEvf6ASmVHjNzHCXBG4A0AjACsAOwEbO0nsFQBnAGYASAIl+ZRMR7SolMEdsByD09fV5R0ZGgg8ePPjW5/N1iqLYpuu6RZblciKR2I9Go69evnwZnZ+fjwI4IS8AKBIRzeQfJWCANwKwh0KhtrGxsYehUOin1tbW+zzP23ietzY2NnIAoGmaLsuyUiqVyvl8XtrY2NiamZn589mzZxsAUgCOAeQAnFI2tI+VxIjaAeDzoaGh7xYWFuZOTk6OZVk+12uYqqq6JEnn0Wg0OT4+/geAXwGEAdwDIFJQXC1wO4DWR48e/RCPxxclSSroVzRFUbSDg4P848ePFwH8DuAhkWih83TRQWxFOXgAwvDwcOfo6OhvXV1d39tsNtuVBwTDWBwOh1UUxVsMw1hXVlbSdCgNV43uYSvrHg6H24aHh38eHBz85TrgF9FYLHA4HLzH43FvbW2d7u/vG+dANp8FpqIlbd3d3V8Fg8EfBUFw4BONZVmL3+9vHhkZCQL4AoAHgJPK8G+yzC0XDofdoVAo5PP5vkadTBAEtr+/39ff3x8gAp/RPOEqx2qjx+NpvXv3bk9DQ0NDvQgwDIOWlhZrMBj8kgi0UJdxRgYMArzL5XJ7vd57qLPZ7Xamp6fnNgBXtQxcjFuHw+Hyer3t9SYgCAITCAScAJoBNNEY/08GOFVVrfVMv7kMNDntFD1vjIAPrlRN0xjckOm6biFQ3jwNPwDMZrOnqVTqfb3Bi8Wivru7W/VCYkwPlKOjo0IikXh7EwQikYgE4Nw0CfXKDCipVCoTj8df3QABbW1tLUc6oUgkFPMkVACUNjc337148eKvw8PDbJ2jP1taWkoCyNDVXDSECmNSK4qiKNLq6urW8+fPI/UicHx8rD59+jSVy+WOAKSJhKENwFItLtoxk8mwsixzHR0dHe3t7c5PAU+n09rs7OzJkydPYqVSaQfANoDXALIk31S2smU1TWMPDg7K5XKZ7+3t9TudTut1U7+wsFCcmJiIpdPpbQBxADsAknQWymYCOukBHYCuKApisdhpMpnURFEU79y503TVyKenpzOTk5M7e3t7MQKPV0Zv1gNm+awB0MvlshqLxfLb29uyJElWURSbXC4XXyvqxcXFs6mpqeTc3Nzu3t7e3wQcA7BPZ8Cov1pNlJplmQtAG8MwHV6v95tAINA5MDBwPxAIuLu6upr8fr/VAN3c3JQjkcjZ+vp6fnl5+d2bN29SuVzuNYAEpf01CdRChUL+X1VskHACuA3Ay3Fcu9vt7nA6nZ7m5uYWQRCaNE3jVVW15PP580KhIGUymWw2m00DOAJwSP4WwPtq4LX2Ao6USxNlQyS/RcQcdLGwlNIz6vEMAaZpNzCk2Pll94LK/cDYimxERiBwG10sxjgvEZBE0UpE6vxj+0Ct5bTaXthgEhRmja8QWNkkPGsuIpfdjpkK+cZUWTC0KredVmtD/gdlSl6EG4AMvQAAAABJRU5ErkJggg==", tt = "data:image/png;base64,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", Q = new u.TextureLoader(), nt = Q.load(Xe, () => i("RENDER")), rt = Q.load(Ze, () => i("RENDER")), it = Q.load(Qe, () => i("RENDER")), at = Q.load($e, () => i("RENDER"));
Q.load(et, () => i("RENDER")), Q.load(tt, () => i("RENDER"));
//#endregion
//#region src/render/env/modified-grid-helper.js
var ot = class extends C {
	constructor(e = 10, t = 10, n = 4473924, r = 8947848, i) {
		let a = new p(n), o = new p(r), s = t / 2, c = e / t, l = e / 2, u = [], d = [];
		for (let e = 0, n = 0, r = -l; e <= t; e++, r += c) if (i(e)) {
			u.push(-l, r, 0, l, r, 0), u.push(r, -l, 0, r, l, 0);
			let t = e === s ? a : o;
			t.toArray(d, n), n += 3, t.toArray(d, n), n += 3, t.toArray(d, n), n += 3, t.toArray(d, n), n += 3;
		}
		let m = new f();
		m.name = "grid-helper-geometry", m.setAttribute("position", new y(u, 3)), m.setAttribute("color", new y(d, 3));
		let h = new S({
			vertexColors: !0,
			name: "grid-helper-material"
		});
		super(m, h);
	}
	copy(e) {
		return super.copy(e), this.geometry.copy(e.geometry), this.material.copy(e.material), this;
	}
	clone() {
		return new this.constructor().copy(this);
	}
}, st = class extends Z {
	gridHelper;
	majorGridHelper;
	constructor(e, t) {
		super(e || "grid");
		let n = t && t.size || 1e3, r = t && t.cellSize || 1, i = t && t.majorLinesEvery || 10, a = n / r, o = t && t.color1 || 13948632, s = t && t.color2 || 15001576;
		it.wrapS = u.RepeatWrapping, it.wrapT = u.RepeatWrapping, it.magFilter = u.NearestFilter, it.repeat.set(a / 2, a / 2);
		let c = new u.PlaneGeometry(n, n);
		c.name = "grid-checkered-plane-geometry";
		let l = new u.MeshPhongMaterial({
			fog: !0,
			map: it,
			side: u.FrontSide,
			transparent: !0,
			opacity: .025,
			name: "grid-checkered-material"
		}), d = new u.Mesh(c, l);
		this.gridHelper = new ot(n, a, o, s, (e) => e % i !== 0), this.gridHelper.renderOrder = -1;
		let f = this.gridHelper.material;
		f.fog = !0, f.transparent = !0, f.opacity = .1, f.color.setRGB(0, 0, 0), this.add(this.gridHelper), this.majorGridHelper = new ot(n, a, o, s, (e) => e % i === 0 && e !== a / 2), this.majorGridHelper.renderOrder = -.5;
		let p = this.majorGridHelper.material;
		p.fog = !0, p.transparent = !0, p.opacity = .2, p.color.setRGB(0, 0, 0), this.add(this.majorGridHelper), this.add(d);
	}
	get mesh() {
		return this.children[2];
	}
	updateColors(e, t, n, r) {
		let i = this.gridHelper.material;
		i.color.setHex(e), i.opacity = n;
		let a = this.majorGridHelper.material;
		a.color.setHex(t), a.opacity = r;
	}
}, ct = JSON.stringify({
	leftPanelInitialSize: 200,
	bottomPanelInitialSize: 1,
	rightPanelInitialSize: 300,
	rightPanelTopInitialSize: 300
}), lt = {
	layout: ct,
	camera: JSON.stringify({
		metadata: {
			version: 4.5,
			type: "Object",
			generator: "Object3D.toJSON"
		},
		object: {
			uuid: "0A298473-BABD-4E19-8A96-B12FA9E385E3",
			type: "PerspectiveCamera",
			layers: -1,
			matrix: [
				.8982657387772196,
				-.439452685210838,
				27755575615628914e-33,
				0,
				.16707067900318084,
				.34150176333728044,
				.9249129331212447,
				0,
				-.40645547204636334,
				-.83081759917476,
				.3801789922458312,
				0,
				-13.52050250806736,
				-25.029452670403685,
				11.80734082664881,
				1
			],
			fov: 45,
			zoom: 1,
			near: .001,
			far: 500,
			focus: 10,
			aspect: 2.413793103448276,
			filmGauge: 35,
			filmOffset: 0,
			quat: [
				.5423525106409364,
				-.1255557966744563,
				-.18735760601809792,
				.8093124387960948
			],
			pos: [
				-13.52050250806736,
				-25.029452670403685,
				11.80734082664881
			],
			target: [
				-.31053201497406996,
				1.9724619919465611,
				-.5486332346095051
			]
		}
	}),
	orientationControl: JSON.stringify({
		width: 180,
		height: 180,
		axis: "none"
	})
}, ut = class extends Z {
	Xaxis;
	Yaxis;
	Zaxis;
	constructor(e, t) {
		super(e || "axes"), this.Xaxis = new u.Line(this.makeLine(new u.Vector3(-1e3, 0, 0), new u.Vector3(1e3, 0, 0)), new u.LineBasicMaterial({
			fog: !0,
			color: 16711680,
			transparent: !0,
			opacity: .3,
			visible: t && t.Xaxis || !0,
			name: "x-axis-material"
		})), this.Xaxis.geometry.name = "x-axis-geometry", this.Yaxis = new u.Line(this.makeLine(new u.Vector3(0, -1e3, 0), new u.Vector3(0, 1e3, 0)), new u.LineBasicMaterial({
			fog: !0,
			color: 3711244,
			transparent: !0,
			opacity: .3,
			visible: t && t.Yaxis || !0,
			name: "y-axis-material"
		})), this.Yaxis.geometry.name = "y-axis-geometry", this.Zaxis = new u.Line(this.makeLine(new u.Vector3(0, 0, -1e3), new u.Vector3(0, 0, 1e3)), new u.LineBasicMaterial({
			fog: !0,
			color: 255,
			transparent: !0,
			opacity: .3,
			visible: t && t.Zaxis || !1,
			name: "z-axis-material"
		})), this.Zaxis.geometry.name = "z-axis-geometry", this.renderOrder = -.1, this.add(this.Xaxis, this.Yaxis, this.Zaxis);
	}
	makeLine(e, t) {
		let n = new u.BufferGeometry(), r = new Float32Array([
			e.x,
			e.y,
			e.z,
			t.x,
			t.y,
			t.z
		]);
		return n.setAttribute("position", new u.BufferAttribute(r, 3)), n;
	}
}, dt = class extends Z {
	constructor(e) {
		super(e || "lights"), this.add(new Z("ambientLights")), this.add(new Z("geometryLights")), this.add(new Z("helpers"));
		let t = new u.AmbientLight(16777215, 1);
		t.layers.enableAll(), this.ambientLights.add(t);
	}
	setHelpersVisible(e) {
		this.helpers.visible = e;
	}
	get ambientLights() {
		return this.children[0];
	}
	get geometryLights() {
		return this.children[1];
	}
	get helpers() {
		return this.children[2];
	}
}, ft = class {
	uuid;
	objectId;
	category;
	timestamp;
	recallFunction;
	constructor(t) {
		this.uuid = e(), this.objectId = t.objectId, this.category = t.category, this.recallFunction = t.recallFunction, this.timestamp = Date.now();
	}
}, pt = new class {
	timeline;
	currentIndex;
	constructor() {
		this.timeline = [], this.currentIndex = 0;
	}
	addMoment(e) {
		let { objectId: t, category: n, recallFunction: r } = e;
		this.timeline.length > 0 && this.currentIndex < this.timeline.length - 1 ? (this.timeline = this.timeline.slice(0, this.currentIndex), this.timeline.push(new ft({
			objectId: t,
			category: n,
			recallFunction: r
		})), this.currentIndex = this.timeline.length - 1) : (this.timeline.push(new ft({
			objectId: t,
			category: n,
			recallFunction: r
		})), this.currentIndex = this.timeline.length - 1);
	}
	undo() {
		this.currentIndex >= 0 && (this.recall("UNDO"), --this.currentIndex);
	}
	redo() {
		this.currentIndex < this.timeline.length - 1 && (this.currentIndex += 1, this.recall("REDO"));
	}
	recall(e) {
		this.timeline[this.currentIndex] && this.timeline[this.currentIndex].recallFunction(e);
	}
	clear() {
		this.timeline = [], this.currentIndex = 0;
	}
	get canUndo() {
		return this.currentIndex >= 0;
	}
	get canRedo() {
		return this.currentIndex < this.timeline.length - 1;
	}
}(), mt = pt.addMoment.bind(pt), ht = (e, t) => Math.sqrt((t.y - e.y) ** 2 + (t.x - e.x) ** 2), gt = 1e-8, _t = class {
	pickPosition;
	raycaster;
	pickedObject;
	pickedPoint;
	pickedObjectSavedColor;
	hover;
	scene;
	camera;
	objects;
	mount;
	__pickedObject;
	__pickedPoint;
	constructor(e, t, n) {
		this.pickPosition = new u.Vector2(0, 0), this.raycaster = new u.Raycaster(), this.pickedObject = null, this.pickedPoint = new u.Vector3(0, 0, 0), this.pickedObjectSavedColor = 0, this.hover = null, this.scene = e, this.camera = t, this.objects = [], this.mount = n;
	}
	pick(e, t = this.objects, n = this.scene, r = this.camera, i = this.mount) {
		this.setPickPosition(e, i), this.raycaster.setFromCamera(this.pickPosition, this.camera);
		let a = this.raycaster.intersectObjects(t, !0);
		if (a.length) {
			let e = !1, t = 0, n = !1, r = 0, i = [];
			for (let o = 0; o < a.length; o++) {
				ht(this.pickPosition, a[o].point.clone().project(this.camera)) < gt && i.push(o);
				let s = a[o].object, c = s.parent, l = c?.parent;
				s.isTransformControlsRoot || s.isTransformControlsGizmo || s.isTransformControlsPlane || c?.isTransformControlsRoot || c?.isTransformControlsGizmo || s && c && l && (l.type === "TransformControlsGizmo" || l.isTransformControlsRoot) ? (n = !0, r = o) : s && c && c.kind && c.kind.match(/source|receiver/gi) && (e = !0, t = o);
			}
			return n ? {
				clickedOnTransformControl: n,
				clickedOnSourceReceiver: e,
				pickedObject: a[r].object
			} : e ? (this.pickedObject = a[t].object.parent, this.pickedPoint = a[t].point, {
				clickedOnTransformControl: n,
				clickedOnSourceReceiver: e,
				pickedObject: this.pickedObject
			}) : i[0] ? (this.pickedObject = a[i[0]].object.parent, this.pickedPoint = a[i[0]].point, {
				clickedOnSourceReceiver: e,
				clickedOnTransformControl: n,
				pickedObject: this.pickedObject
			}) : (this.pickedObject = a[0].object.parent, this.pickedPoint = a[0].point, {
				clickedOnSourceReceiver: e,
				clickedOnTransformControl: n,
				pickedObject: this.pickedObject
			});
		}
		return this.pickedObject = !1, {
			clickedOnSourceReceiver: !1,
			clickedOnTransformControl: !1,
			pickedObject: !1
		};
	}
	getPickedPoint() {
		return [
			this.pickedPoint.x,
			this.pickedPoint.y,
			this.pickedPoint.z
		];
	}
	pickOnce(e, t, n, r) {
		this.setPickPosition(e, r);
		let i = this.pickPosition;
		this.raycaster.setFromCamera(i, n);
		let a = this.raycaster.intersectObjects(t.children, !0);
		if (a.length) {
			if (a[0].object === this.pickedObject) return !1;
			this.pickedObject = a[0].object;
		} else this.pickedObject = !1;
		return this.pickedObject;
	}
	pickCenter(e, t, n) {
		this.setPickPositionCenter(n);
		let r = this.pickPosition;
		this.raycaster.setFromCamera(r, t);
		let i = this.raycaster.intersectObjects(e.children, !0);
		return this.pickedObject = i.length ? i[0].object : !1, this.pickedObject;
	}
	setPickPosition(e, t) {
		let n = this.getCanvasRelativePosition(e, t);
		this.pickPosition.x = n.x / t.clientWidth * 2 - 1, this.pickPosition.y = n.y / t.clientHeight * -2 + 1;
	}
	setPickPositionCenter(e) {
		let t = {
			x: e.clientWidth / 2,
			y: e.clientHeight / 2
		};
		this.pickPosition.x = t.x / e.clientWidth * 2 - 1, this.pickPosition.y = t.y / e.clientHeight * -2 + 1;
	}
	getCanvasRelativePosition(e, t) {
		let n = t.getBoundingClientRect();
		return {
			x: e.clientX - n.left,
			y: e.clientY - n.top
		};
	}
	clearPickPosition() {
		this.pickPosition.x = -1e5, this.pickPosition.y = -1e5;
	}
	updateCamera(e) {
		this.camera = e;
	}
}, vt = (e, t = 0) => {
	let n = document.createElement("td");
	return n.id = "transform_overlay-" + e, n.className = "transform_overlay-cell", n.textContent = t.toString(), n;
}, yt = class {
	dx;
	dy;
	dz;
	elt;
	parent;
	cells;
	constructor(e) {
		this.cells = /* @__PURE__ */ new Map(), this.elt = document.createElement("div"), this.parent = document.querySelector(e) || document.querySelector("#editor-container") || document.body, this.parent.appendChild(this.elt), this.elt.className = "canvas_overlay canvas_overlay-transform_overlay hidden";
		let t = document.createElement("table"), n = document.createElement("tbody"), r = document.createElement("tr"), i = document.createElement("td");
		i.className = "transform_overlay-cell-label", i.innerText = "Δ", r.appendChild(i), this.cells.set("dx", vt("dx", 0)), this.cells.set("dy", vt("dy", 0)), this.cells.set("dz", vt("dz", 0)), this.cells.forEach((e, t) => {
			r.appendChild(e);
		}), n.appendChild(r), t.appendChild(n), this.elt.appendChild(t), this.setValues = this.setValues.bind(this), this.updateHTML = this.updateHTML.bind(this), this.setValues(0, 0, 0);
	}
	setValues(e, t, n) {
		this.dx = e, this.dy = t, this.dz = n, this.updateHTML();
	}
	updateHTML() {
		let e = {
			dx: this.dx,
			dy: this.dy,
			dz: this.dz
		};
		this.cells.forEach((t, n) => {
			t.textContent = l(e[n] || 0, 4).toString();
		});
	}
	show() {
		this.hidden && this.elt.classList.remove("hidden");
	}
	hide() {
		this.hidden || this.elt.classList.add("hidden");
	}
	get hidden() {
		return this.elt.classList.contains("hidden");
	}
	set hidden(e) {
		e && this.hide();
	}
	get visible() {
		return !this.hidden;
	}
	set visible(e) {
		e && this.show();
	}
}, bt = class {
	constructor(e, t, n) {
		this.label = e, this.value = t, this.formatter = n.formatter || ((e) => String(e)), this.id = n.id || e, this.elt = document.createElement("span"), this.elt.setAttribute("class", "global_overlay-cell");
		let r = document.createElement("span");
		r.textContent = this.label + ":", r.setAttribute("class", "global_overlay-label"), this.elt.appendChild(r);
		let i = document.createElement("span");
		i.textContent = this.formatter(this.value), i.setAttribute("class", "global_overlay-value"), this.elt.appendChild(i), n.hasOwnProperty("hidden") && n.hidden && this.hide();
	}
	setValue(e) {
		this.value = e, this.valueElt.textContent = this.formatter(this.value);
	}
	show() {
		this.hidden && this.elt.classList.remove("global_overlay-cell-hidden");
	}
	hide() {
		this.hidden || this.elt.classList.add("global_overlay-cell-hidden");
	}
	get hidden() {
		return this.elt.classList.contains("global_overlay-cell-hidden");
	}
	get labelElt() {
		return this.elt.children[0];
	}
	get valueElt() {
		return this.elt.children[1];
	}
}, xt = class {
	elt;
	parent;
	cells;
	constructor(e) {
		this.cells = /* @__PURE__ */ new Map(), this.elt = document.createElement("div"), this.parent = e || document.querySelector("#editor-container") || document.body, this.parent.appendChild(this.elt), this.elt.className = "canvas_overlay canvas_overlay-global_overlay", this.setCellValue = this.setCellValue.bind(this);
	}
	setCellValue(e, t) {
		this.cells.has(e) && this.cells.get(e).setValue(t);
	}
	addCell(t, n, r) {
		let i = r.id || e();
		if (this.cells.has(i)) console.warn(`GlobalOverlay already has cell with id ${i}`);
		else {
			let e = new bt(t, n, r);
			return this.cells.set(i, e), this.elt.appendChild(e.elt), e;
		}
	}
	removeCell(e) {
		if (this.cells.has(e)) {
			let t = this.cells.get(e);
			this.elt.removeChild(t.elt), this.cells.delete(e);
		}
	}
	show() {
		this.hidden && this.elt.classList.remove("global_overlay-hidden");
	}
	hide() {
		this.hidden || this.elt.classList.add("global_overlay-hidden");
	}
	showCell(e) {
		this.cells.has(e) && this.cells.get(e).show();
	}
	hideCell(e) {
		this.cells.has(e) && this.cells.get(e).hide();
	}
	get hidden() {
		return this.elt.classList.contains("global_overlay-hidden");
	}
	set hidden(e) {
		e && this.hide();
	}
	get visible() {
		return !this.hidden;
	}
	set visible(e) {
		e && this.show();
	}
}, St = class {
	constructor(e) {
		this.isFont = !0, this.type = "Font", this.data = e;
	}
	generateShapes(e, t = 100, n = "ltr") {
		let r = [], i = Ct(e, t, this.data, n);
		for (let e = 0, t = i.length; e < t; e++) r.push(...i[e].toShapes());
		return r;
	}
};
function Ct(e, t, n, r) {
	let i = Array.from(e), a = t / n.resolution, o = (n.boundingBox.yMax - n.boundingBox.yMin + n.underlineThickness) * a, s = [], c = 0, l = 0;
	(r == "rtl" || r == "tb") && i.reverse();
	for (let e = 0; e < i.length; e++) {
		let t = i[e];
		if (t === "\n") c = 0, l -= o;
		else {
			let e = wt(t, a, c, l, n);
			r == "tb" ? (c = 0, l += n.ascender * a) : c += e.offsetX, s.push(e.path);
		}
	}
	return s;
}
function wt(e, t, n, r, i) {
	let a = i.glyphs[e] || i.glyphs["?"];
	if (!a) {
		console.error("THREE.Font: character \"" + e + "\" does not exists in font family " + i.familyName + ".");
		return;
	}
	let o = new ae(), s, c, l, u, d, f, p, m;
	if (a.o) {
		let e = a._cachedOutline ||= a.o.split(" ");
		for (let i = 0, a = e.length; i < a;) switch (e[i++]) {
			case "m":
				s = e[i++] * t + n, c = e[i++] * t + r, o.moveTo(s, c);
				break;
			case "l":
				s = e[i++] * t + n, c = e[i++] * t + r, o.lineTo(s, c);
				break;
			case "q":
				l = e[i++] * t + n, u = e[i++] * t + r, d = e[i++] * t + n, f = e[i++] * t + r, o.quadraticCurveTo(d, f, l, u);
				break;
			case "b": l = e[i++] * t + n, u = e[i++] * t + r, d = e[i++] * t + n, f = e[i++] * t + r, p = e[i++] * t + n, m = e[i++] * t + r, o.bezierCurveTo(d, f, p, m, l, u);
		}
	}
	return {
		offsetX: a.ha * t,
		path: o
	};
}
var Tt = {
	glyphs: /* @__PURE__ */ JSON.parse("{\"ο\":{\"x_min\":0,\"x_max\":712,\"ha\":815,\"o\":\"m 356 -25 q 96 88 192 -25 q 0 368 0 201 q 92 642 0 533 q 356 761 192 761 q 617 644 517 761 q 712 368 712 533 q 619 91 712 201 q 356 -25 520 -25 m 356 85 q 527 175 465 85 q 583 369 583 255 q 528 562 583 484 q 356 651 466 651 q 189 560 250 651 q 135 369 135 481 q 187 177 135 257 q 356 85 250 85 \"},\"S\":{\"x_min\":0,\"x_max\":788,\"ha\":890,\"o\":\"m 788 291 q 662 54 788 144 q 397 -26 550 -26 q 116 68 226 -26 q 0 337 0 168 l 131 337 q 200 152 131 220 q 384 85 269 85 q 557 129 479 85 q 650 270 650 183 q 490 429 650 379 q 194 513 341 470 q 33 739 33 584 q 142 964 33 881 q 388 1041 242 1041 q 644 957 543 1041 q 756 716 756 867 l 625 716 q 561 874 625 816 q 395 933 497 933 q 243 891 309 933 q 164 759 164 841 q 325 609 164 656 q 625 526 475 568 q 788 291 788 454 \"},\"¦\":{\"x_min\":343,\"x_max\":449,\"ha\":792,\"o\":\"m 449 462 l 343 462 l 343 986 l 449 986 l 449 462 m 449 -242 l 343 -242 l 343 280 l 449 280 l 449 -242 \"},\"/\":{\"x_min\":183.25,\"x_max\":608.328125,\"ha\":792,\"o\":\"m 608 1041 l 266 -129 l 183 -129 l 520 1041 l 608 1041 \"},\"Τ\":{\"x_min\":-0.4375,\"x_max\":777.453125,\"ha\":839,\"o\":\"m 777 893 l 458 893 l 458 0 l 319 0 l 319 892 l 0 892 l 0 1013 l 777 1013 l 777 893 \"},\"y\":{\"x_min\":0,\"x_max\":684.78125,\"ha\":771,\"o\":\"m 684 738 l 388 -83 q 311 -216 356 -167 q 173 -279 252 -279 q 97 -266 133 -279 l 97 -149 q 132 -155 109 -151 q 168 -160 155 -160 q 240 -114 213 -160 q 274 -26 248 -98 l 0 738 l 137 737 l 341 139 l 548 737 l 684 738 \"},\"Π\":{\"x_min\":0,\"x_max\":803,\"ha\":917,\"o\":\"m 803 0 l 667 0 l 667 886 l 140 886 l 140 0 l 0 0 l 0 1012 l 803 1012 l 803 0 \"},\"ΐ\":{\"x_min\":-111,\"x_max\":339,\"ha\":361,\"o\":\"m 339 800 l 229 800 l 229 925 l 339 925 l 339 800 m -1 800 l -111 800 l -111 925 l -1 925 l -1 800 m 284 3 q 233 -10 258 -5 q 182 -15 207 -15 q 85 26 119 -15 q 42 200 42 79 l 42 737 l 167 737 l 168 215 q 172 141 168 157 q 226 101 183 101 q 248 103 239 101 q 284 112 257 104 l 284 3 m 302 1040 l 113 819 l 30 819 l 165 1040 l 302 1040 \"},\"g\":{\"x_min\":0,\"x_max\":686,\"ha\":838,\"o\":\"m 686 34 q 586 -213 686 -121 q 331 -306 487 -306 q 131 -252 216 -306 q 31 -84 31 -190 l 155 -84 q 228 -174 166 -138 q 345 -207 284 -207 q 514 -109 454 -207 q 564 89 564 -27 q 461 6 521 36 q 335 -23 401 -23 q 88 100 184 -23 q 0 370 0 215 q 87 634 0 522 q 330 758 183 758 q 457 728 398 758 q 564 644 515 699 l 564 737 l 686 737 l 686 34 m 582 367 q 529 560 582 481 q 358 652 468 652 q 189 561 250 652 q 135 369 135 482 q 189 176 135 255 q 361 85 251 85 q 529 176 468 85 q 582 367 582 255 \"},\"²\":{\"x_min\":0,\"x_max\":442,\"ha\":539,\"o\":\"m 442 383 l 0 383 q 91 566 0 492 q 260 668 176 617 q 354 798 354 727 q 315 875 354 845 q 227 905 277 905 q 136 869 173 905 q 99 761 99 833 l 14 761 q 82 922 14 864 q 232 974 141 974 q 379 926 316 974 q 442 797 442 878 q 351 635 442 704 q 183 539 321 611 q 92 455 92 491 l 442 455 l 442 383 \"},\"–\":{\"x_min\":0,\"x_max\":705.5625,\"ha\":803,\"o\":\"m 705 334 l 0 334 l 0 410 l 705 410 l 705 334 \"},\"Κ\":{\"x_min\":0,\"x_max\":819.5625,\"ha\":893,\"o\":\"m 819 0 l 650 0 l 294 509 l 139 356 l 139 0 l 0 0 l 0 1013 l 139 1013 l 139 526 l 626 1013 l 809 1013 l 395 600 l 819 0 \"},\"ƒ\":{\"x_min\":-46.265625,\"x_max\":392,\"ha\":513,\"o\":\"m 392 651 l 259 651 l 79 -279 l -46 -278 l 134 651 l 14 651 l 14 751 l 135 751 q 151 948 135 900 q 304 1041 185 1041 q 334 1040 319 1041 q 392 1034 348 1039 l 392 922 q 337 931 360 931 q 271 883 287 931 q 260 793 260 853 l 260 751 l 392 751 l 392 651 \"},\"e\":{\"x_min\":0,\"x_max\":714,\"ha\":813,\"o\":\"m 714 326 l 140 326 q 200 157 140 227 q 359 87 260 87 q 488 130 431 87 q 561 245 545 174 l 697 245 q 577 48 670 123 q 358 -26 484 -26 q 97 85 195 -26 q 0 363 0 197 q 94 642 0 529 q 358 765 195 765 q 626 627 529 765 q 714 326 714 503 m 576 429 q 507 583 564 522 q 355 650 445 650 q 206 583 266 650 q 140 429 152 522 l 576 429 \"},\"ό\":{\"x_min\":0,\"x_max\":712,\"ha\":815,\"o\":\"m 356 -25 q 94 91 194 -25 q 0 368 0 202 q 92 642 0 533 q 356 761 192 761 q 617 644 517 761 q 712 368 712 533 q 619 91 712 201 q 356 -25 520 -25 m 356 85 q 527 175 465 85 q 583 369 583 255 q 528 562 583 484 q 356 651 466 651 q 189 560 250 651 q 135 369 135 481 q 187 177 135 257 q 356 85 250 85 m 576 1040 l 387 819 l 303 819 l 438 1040 l 576 1040 \"},\"J\":{\"x_min\":0,\"x_max\":588,\"ha\":699,\"o\":\"m 588 279 q 287 -26 588 -26 q 58 73 126 -26 q 0 327 0 158 l 133 327 q 160 172 133 227 q 288 96 198 96 q 426 171 391 96 q 449 336 449 219 l 449 1013 l 588 1013 l 588 279 \"},\"»\":{\"x_min\":-1,\"x_max\":503,\"ha\":601,\"o\":\"m 503 302 l 280 136 l 281 256 l 429 373 l 281 486 l 280 608 l 503 440 l 503 302 m 221 302 l 0 136 l 0 255 l 145 372 l 0 486 l -1 608 l 221 440 l 221 302 \"},\"©\":{\"x_min\":-3,\"x_max\":1008,\"ha\":1106,\"o\":\"m 502 -7 q 123 151 263 -7 q -3 501 -3 294 q 123 851 -3 706 q 502 1011 263 1011 q 881 851 739 1011 q 1008 501 1008 708 q 883 151 1008 292 q 502 -7 744 -7 m 502 60 q 830 197 709 60 q 940 501 940 322 q 831 805 940 681 q 502 944 709 944 q 174 805 296 944 q 65 501 65 680 q 173 197 65 320 q 502 60 294 60 m 741 394 q 661 246 731 302 q 496 190 591 190 q 294 285 369 190 q 228 497 228 370 q 295 714 228 625 q 499 813 370 813 q 656 762 588 813 q 733 625 724 711 l 634 625 q 589 704 629 673 q 498 735 550 735 q 377 666 421 735 q 334 504 334 597 q 374 340 334 408 q 490 272 415 272 q 589 304 549 272 q 638 394 628 337 l 741 394 \"},\"ώ\":{\"x_min\":0,\"x_max\":922,\"ha\":1030,\"o\":\"m 687 1040 l 498 819 l 415 819 l 549 1040 l 687 1040 m 922 339 q 856 97 922 203 q 650 -26 780 -26 q 538 9 587 -26 q 461 103 489 44 q 387 12 436 46 q 277 -22 339 -22 q 69 97 147 -22 q 0 338 0 202 q 45 551 0 444 q 161 737 84 643 l 302 737 q 175 552 219 647 q 124 336 124 446 q 155 179 124 248 q 275 88 197 88 q 375 163 341 88 q 400 294 400 219 l 400 572 l 524 572 l 524 294 q 561 135 524 192 q 643 88 591 88 q 762 182 719 88 q 797 341 797 257 q 745 555 797 450 q 619 737 705 637 l 760 737 q 874 551 835 640 q 922 339 922 444 \"},\"^\":{\"x_min\":193.0625,\"x_max\":598.609375,\"ha\":792,\"o\":\"m 598 772 l 515 772 l 395 931 l 277 772 l 193 772 l 326 1013 l 462 1013 l 598 772 \"},\"«\":{\"x_min\":0,\"x_max\":507.203125,\"ha\":604,\"o\":\"m 506 136 l 284 302 l 284 440 l 506 608 l 507 485 l 360 371 l 506 255 l 506 136 m 222 136 l 0 302 l 0 440 l 222 608 l 221 486 l 73 373 l 222 256 l 222 136 \"},\"D\":{\"x_min\":0,\"x_max\":828,\"ha\":935,\"o\":\"m 389 1013 q 714 867 593 1013 q 828 521 828 729 q 712 161 828 309 q 382 0 587 0 l 0 0 l 0 1013 l 389 1013 m 376 124 q 607 247 523 124 q 681 510 681 355 q 607 771 681 662 q 376 896 522 896 l 139 896 l 139 124 l 376 124 \"},\"∙\":{\"x_min\":0,\"x_max\":142,\"ha\":239,\"o\":\"m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 \"},\"ÿ\":{\"x_min\":0,\"x_max\":47,\"ha\":125,\"o\":\"m 47 3 q 37 -7 47 -7 q 28 0 30 -7 q 39 -4 32 -4 q 45 3 45 -1 l 37 0 q 28 9 28 0 q 39 19 28 19 l 47 16 l 47 19 l 47 3 m 37 1 q 44 8 44 1 q 37 16 44 16 q 30 8 30 16 q 37 1 30 1 m 26 1 l 23 22 l 14 0 l 3 22 l 3 3 l 0 25 l 13 1 l 22 25 l 26 1 \"},\"w\":{\"x_min\":0,\"x_max\":1009.71875,\"ha\":1100,\"o\":\"m 1009 738 l 783 0 l 658 0 l 501 567 l 345 0 l 222 0 l 0 738 l 130 738 l 284 174 l 432 737 l 576 738 l 721 173 l 881 737 l 1009 738 \"},\"$\":{\"x_min\":0,\"x_max\":700,\"ha\":793,\"o\":\"m 664 717 l 542 717 q 490 825 531 785 q 381 872 450 865 l 381 551 q 620 446 540 522 q 700 241 700 370 q 618 45 700 116 q 381 -25 536 -25 l 381 -152 l 307 -152 l 307 -25 q 81 62 162 -25 q 0 297 0 149 l 124 297 q 169 146 124 204 q 307 81 215 89 l 307 441 q 80 536 148 469 q 13 725 13 603 q 96 910 13 839 q 307 982 180 982 l 307 1077 l 381 1077 l 381 982 q 574 917 494 982 q 664 717 664 845 m 307 565 l 307 872 q 187 831 233 872 q 142 724 142 791 q 180 618 142 656 q 307 565 218 580 m 381 76 q 562 237 562 96 q 517 361 562 313 q 381 423 472 409 l 381 76 \"},\"\\\\\":{\"x_min\":-0.015625,\"x_max\":425.0625,\"ha\":522,\"o\":\"m 425 -129 l 337 -129 l 0 1041 l 83 1041 l 425 -129 \"},\"µ\":{\"x_min\":0,\"x_max\":697.21875,\"ha\":747,\"o\":\"m 697 -4 q 629 -14 658 -14 q 498 97 513 -14 q 422 9 470 41 q 313 -23 374 -23 q 207 4 258 -23 q 119 81 156 32 l 119 -278 l 0 -278 l 0 738 l 124 738 l 124 343 q 165 173 124 246 q 308 83 216 83 q 452 178 402 83 q 493 359 493 255 l 493 738 l 617 738 l 617 214 q 623 136 617 160 q 673 92 637 92 q 697 96 684 92 l 697 -4 \"},\"Ι\":{\"x_min\":42,\"x_max\":181,\"ha\":297,\"o\":\"m 181 0 l 42 0 l 42 1013 l 181 1013 l 181 0 \"},\"Ύ\":{\"x_min\":0,\"x_max\":1144.5,\"ha\":1214,\"o\":\"m 1144 1012 l 807 416 l 807 0 l 667 0 l 667 416 l 325 1012 l 465 1012 l 736 533 l 1004 1012 l 1144 1012 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 \"},\"’\":{\"x_min\":0,\"x_max\":139,\"ha\":236,\"o\":\"m 139 851 q 102 737 139 784 q 0 669 65 690 l 0 734 q 59 787 42 741 q 72 873 72 821 l 0 873 l 0 1013 l 139 1013 l 139 851 \"},\"Ν\":{\"x_min\":0,\"x_max\":801,\"ha\":915,\"o\":\"m 801 0 l 651 0 l 131 822 l 131 0 l 0 0 l 0 1013 l 151 1013 l 670 191 l 670 1013 l 801 1013 l 801 0 \"},\"-\":{\"x_min\":8.71875,\"x_max\":350.390625,\"ha\":478,\"o\":\"m 350 317 l 8 317 l 8 428 l 350 428 l 350 317 \"},\"Q\":{\"x_min\":0,\"x_max\":968,\"ha\":1072,\"o\":\"m 954 5 l 887 -79 l 744 35 q 622 -11 687 2 q 483 -26 556 -26 q 127 130 262 -26 q 0 504 0 279 q 127 880 0 728 q 484 1041 262 1041 q 841 884 708 1041 q 968 507 968 735 q 933 293 968 398 q 832 104 899 188 l 954 5 m 723 191 q 802 330 777 248 q 828 499 828 412 q 744 790 828 673 q 483 922 650 922 q 228 791 322 922 q 142 505 142 673 q 227 221 142 337 q 487 91 323 91 q 632 123 566 91 l 520 215 l 587 301 l 723 191 \"},\"ς\":{\"x_min\":1,\"x_max\":676.28125,\"ha\":740,\"o\":\"m 676 460 l 551 460 q 498 595 542 546 q 365 651 448 651 q 199 578 263 651 q 136 401 136 505 q 266 178 136 241 q 508 106 387 142 q 640 -50 640 62 q 625 -158 640 -105 q 583 -278 611 -211 l 465 -278 q 498 -182 490 -211 q 515 -80 515 -126 q 381 12 515 -15 q 134 91 197 51 q 1 388 1 179 q 100 651 1 542 q 354 761 199 761 q 587 680 498 761 q 676 460 676 599 \"},\"M\":{\"x_min\":0,\"x_max\":954,\"ha\":1067,\"o\":\"m 954 0 l 819 0 l 819 869 l 537 0 l 405 0 l 128 866 l 128 0 l 0 0 l 0 1013 l 200 1013 l 472 160 l 757 1013 l 954 1013 l 954 0 \"},\"Ψ\":{\"x_min\":0,\"x_max\":1006,\"ha\":1094,\"o\":\"m 1006 678 q 914 319 1006 429 q 571 200 814 200 l 571 0 l 433 0 l 433 200 q 92 319 194 200 q 0 678 0 429 l 0 1013 l 139 1013 l 139 679 q 191 417 139 492 q 433 326 255 326 l 433 1013 l 571 1013 l 571 326 l 580 326 q 813 423 747 326 q 868 679 868 502 l 868 1013 l 1006 1013 l 1006 678 \"},\"C\":{\"x_min\":0,\"x_max\":886,\"ha\":944,\"o\":\"m 886 379 q 760 87 886 201 q 455 -26 634 -26 q 112 136 236 -26 q 0 509 0 283 q 118 882 0 737 q 469 1041 245 1041 q 748 955 630 1041 q 879 708 879 859 l 745 708 q 649 862 724 805 q 473 920 573 920 q 219 791 312 920 q 136 509 136 675 q 217 229 136 344 q 470 99 311 99 q 672 179 591 99 q 753 379 753 259 l 886 379 \"},\"!\":{\"x_min\":0,\"x_max\":138,\"ha\":236,\"o\":\"m 138 684 q 116 409 138 629 q 105 244 105 299 l 33 244 q 16 465 33 313 q 0 684 0 616 l 0 1013 l 138 1013 l 138 684 m 138 0 l 0 0 l 0 151 l 138 151 l 138 0 \"},\"{\":{\"x_min\":0,\"x_max\":480.5625,\"ha\":578,\"o\":\"m 480 -286 q 237 -213 303 -286 q 187 -45 187 -159 q 194 48 187 -15 q 201 141 201 112 q 164 264 201 225 q 0 314 118 314 l 0 417 q 164 471 119 417 q 201 605 201 514 q 199 665 201 644 q 193 772 193 769 q 241 941 193 887 q 480 1015 308 1015 l 480 915 q 336 866 375 915 q 306 742 306 828 q 310 662 306 717 q 314 577 314 606 q 288 452 314 500 q 176 365 256 391 q 289 275 257 337 q 314 143 314 226 q 313 84 314 107 q 310 -11 310 -5 q 339 -131 310 -94 q 480 -182 377 -182 l 480 -286 \"},\"X\":{\"x_min\":-0.015625,\"x_max\":854.15625,\"ha\":940,\"o\":\"m 854 0 l 683 0 l 423 409 l 166 0 l 0 0 l 347 519 l 18 1013 l 186 1013 l 428 637 l 675 1013 l 836 1013 l 504 520 l 854 0 \"},\"#\":{\"x_min\":0,\"x_max\":963.890625,\"ha\":1061,\"o\":\"m 963 690 l 927 590 l 719 590 l 655 410 l 876 410 l 840 310 l 618 310 l 508 -3 l 393 -2 l 506 309 l 329 310 l 215 -2 l 102 -3 l 212 310 l 0 310 l 36 410 l 248 409 l 312 590 l 86 590 l 120 690 l 347 690 l 459 1006 l 573 1006 l 462 690 l 640 690 l 751 1006 l 865 1006 l 754 690 l 963 690 m 606 590 l 425 590 l 362 410 l 543 410 l 606 590 \"},\"ι\":{\"x_min\":42,\"x_max\":284,\"ha\":361,\"o\":\"m 284 3 q 233 -10 258 -5 q 182 -15 207 -15 q 85 26 119 -15 q 42 200 42 79 l 42 738 l 167 738 l 168 215 q 172 141 168 157 q 226 101 183 101 q 248 103 239 101 q 284 112 257 104 l 284 3 \"},\"Ά\":{\"x_min\":0,\"x_max\":906.953125,\"ha\":982,\"o\":\"m 283 1040 l 88 799 l 5 799 l 145 1040 l 283 1040 m 906 0 l 756 0 l 650 303 l 251 303 l 143 0 l 0 0 l 376 1012 l 529 1012 l 906 0 m 609 421 l 452 866 l 293 421 l 609 421 \"},\")\":{\"x_min\":0,\"x_max\":318,\"ha\":415,\"o\":\"m 318 365 q 257 25 318 191 q 87 -290 197 -141 l 0 -290 q 140 21 93 -128 q 193 360 193 189 q 141 704 193 537 q 0 1024 97 850 l 87 1024 q 257 706 197 871 q 318 365 318 542 \"},\"ε\":{\"x_min\":0,\"x_max\":634.71875,\"ha\":714,\"o\":\"m 634 234 q 527 38 634 110 q 300 -25 433 -25 q 98 29 183 -25 q 0 204 0 93 q 37 314 0 265 q 128 390 67 353 q 56 460 82 419 q 26 555 26 505 q 114 712 26 654 q 295 763 191 763 q 499 700 416 763 q 589 515 589 631 l 478 515 q 419 618 464 580 q 307 657 374 657 q 207 630 253 657 q 151 547 151 598 q 238 445 151 469 q 389 434 280 434 l 389 331 l 349 331 q 206 315 255 331 q 125 210 125 287 q 183 107 125 145 q 302 76 233 76 q 436 117 379 76 q 509 234 493 159 l 634 234 \"},\"Δ\":{\"x_min\":0,\"x_max\":952.78125,\"ha\":1028,\"o\":\"m 952 0 l 0 0 l 400 1013 l 551 1013 l 952 0 m 762 124 l 476 867 l 187 124 l 762 124 \"},\"}\":{\"x_min\":0,\"x_max\":481,\"ha\":578,\"o\":\"m 481 314 q 318 262 364 314 q 282 136 282 222 q 284 65 282 97 q 293 -58 293 -48 q 241 -217 293 -166 q 0 -286 174 -286 l 0 -182 q 143 -130 105 -182 q 171 -2 171 -93 q 168 81 171 22 q 165 144 165 140 q 188 275 165 229 q 306 365 220 339 q 191 455 224 391 q 165 588 165 505 q 168 681 165 624 q 171 742 171 737 q 141 865 171 827 q 0 915 102 915 l 0 1015 q 243 942 176 1015 q 293 773 293 888 q 287 675 293 741 q 282 590 282 608 q 318 466 282 505 q 481 417 364 417 l 481 314 \"},\"‰\":{\"x_min\":-3,\"x_max\":1672,\"ha\":1821,\"o\":\"m 846 0 q 664 76 732 0 q 603 244 603 145 q 662 412 603 344 q 846 489 729 489 q 1027 412 959 489 q 1089 244 1089 343 q 1029 76 1089 144 q 846 0 962 0 m 845 103 q 945 143 910 103 q 981 243 981 184 q 947 340 981 301 q 845 385 910 385 q 745 342 782 385 q 709 243 709 300 q 742 147 709 186 q 845 103 781 103 m 888 986 l 284 -25 l 199 -25 l 803 986 l 888 986 m 241 468 q 58 545 126 468 q -3 715 -3 615 q 56 881 -3 813 q 238 958 124 958 q 421 881 353 958 q 483 712 483 813 q 423 544 483 612 q 241 468 356 468 m 241 855 q 137 811 175 855 q 100 710 100 768 q 136 612 100 653 q 240 572 172 572 q 344 614 306 572 q 382 713 382 656 q 347 810 382 771 q 241 855 308 855 m 1428 0 q 1246 76 1314 0 q 1185 244 1185 145 q 1244 412 1185 344 q 1428 489 1311 489 q 1610 412 1542 489 q 1672 244 1672 343 q 1612 76 1672 144 q 1428 0 1545 0 m 1427 103 q 1528 143 1492 103 q 1564 243 1564 184 q 1530 340 1564 301 q 1427 385 1492 385 q 1327 342 1364 385 q 1291 243 1291 300 q 1324 147 1291 186 q 1427 103 1363 103 \"},\"a\":{\"x_min\":0,\"x_max\":698.609375,\"ha\":794,\"o\":\"m 698 0 q 661 -12 679 -7 q 615 -17 643 -17 q 536 12 564 -17 q 500 96 508 41 q 384 6 456 37 q 236 -25 312 -25 q 65 31 130 -25 q 0 194 0 88 q 118 390 0 334 q 328 435 180 420 q 488 483 476 451 q 495 523 495 504 q 442 619 495 584 q 325 654 389 654 q 209 617 257 654 q 152 513 161 580 l 33 513 q 123 705 33 633 q 332 772 207 772 q 528 712 448 772 q 617 531 617 645 l 617 163 q 624 108 617 126 q 664 90 632 90 l 698 94 l 698 0 m 491 262 l 491 372 q 272 329 350 347 q 128 201 128 294 q 166 113 128 144 q 264 83 205 83 q 414 130 346 83 q 491 262 491 183 \"},\"—\":{\"x_min\":0,\"x_max\":941.671875,\"ha\":1039,\"o\":\"m 941 334 l 0 334 l 0 410 l 941 410 l 941 334 \"},\"=\":{\"x_min\":8.71875,\"x_max\":780.953125,\"ha\":792,\"o\":\"m 780 510 l 8 510 l 8 606 l 780 606 l 780 510 m 780 235 l 8 235 l 8 332 l 780 332 l 780 235 \"},\"N\":{\"x_min\":0,\"x_max\":801,\"ha\":914,\"o\":\"m 801 0 l 651 0 l 131 823 l 131 0 l 0 0 l 0 1013 l 151 1013 l 670 193 l 670 1013 l 801 1013 l 801 0 \"},\"ρ\":{\"x_min\":0,\"x_max\":712,\"ha\":797,\"o\":\"m 712 369 q 620 94 712 207 q 362 -26 521 -26 q 230 2 292 -26 q 119 83 167 30 l 119 -278 l 0 -278 l 0 362 q 91 643 0 531 q 355 764 190 764 q 617 647 517 764 q 712 369 712 536 m 583 366 q 530 559 583 480 q 359 651 469 651 q 190 562 252 651 q 135 370 135 483 q 189 176 135 257 q 359 85 250 85 q 528 175 466 85 q 583 366 583 254 \"},\"2\":{\"x_min\":59,\"x_max\":731,\"ha\":792,\"o\":\"m 731 0 l 59 0 q 197 314 59 188 q 457 487 199 315 q 598 691 598 580 q 543 819 598 772 q 411 867 488 867 q 272 811 328 867 q 209 630 209 747 l 81 630 q 182 901 81 805 q 408 986 271 986 q 629 909 536 986 q 731 694 731 826 q 613 449 731 541 q 378 316 495 383 q 201 122 235 234 l 731 122 l 731 0 \"},\"¯\":{\"x_min\":0,\"x_max\":941.671875,\"ha\":938,\"o\":\"m 941 1033 l 0 1033 l 0 1109 l 941 1109 l 941 1033 \"},\"Z\":{\"x_min\":0,\"x_max\":779,\"ha\":849,\"o\":\"m 779 0 l 0 0 l 0 113 l 621 896 l 40 896 l 40 1013 l 779 1013 l 778 887 l 171 124 l 779 124 l 779 0 \"},\"u\":{\"x_min\":0,\"x_max\":617,\"ha\":729,\"o\":\"m 617 0 l 499 0 l 499 110 q 391 10 460 45 q 246 -25 322 -25 q 61 58 127 -25 q 0 258 0 136 l 0 738 l 125 738 l 125 284 q 156 148 125 202 q 273 82 197 82 q 433 165 369 82 q 493 340 493 243 l 493 738 l 617 738 l 617 0 \"},\"k\":{\"x_min\":0,\"x_max\":612.484375,\"ha\":697,\"o\":\"m 612 738 l 338 465 l 608 0 l 469 0 l 251 382 l 121 251 l 121 0 l 0 0 l 0 1013 l 121 1013 l 121 402 l 456 738 l 612 738 \"},\"Η\":{\"x_min\":0,\"x_max\":803,\"ha\":917,\"o\":\"m 803 0 l 667 0 l 667 475 l 140 475 l 140 0 l 0 0 l 0 1013 l 140 1013 l 140 599 l 667 599 l 667 1013 l 803 1013 l 803 0 \"},\"Α\":{\"x_min\":0,\"x_max\":906.953125,\"ha\":985,\"o\":\"m 906 0 l 756 0 l 650 303 l 251 303 l 143 0 l 0 0 l 376 1013 l 529 1013 l 906 0 m 609 421 l 452 866 l 293 421 l 609 421 \"},\"s\":{\"x_min\":0,\"x_max\":604,\"ha\":697,\"o\":\"m 604 217 q 501 36 604 104 q 292 -23 411 -23 q 86 43 166 -23 q 0 238 0 114 l 121 237 q 175 122 121 164 q 300 85 223 85 q 415 112 363 85 q 479 207 479 147 q 361 309 479 276 q 140 372 141 370 q 21 544 21 426 q 111 708 21 647 q 298 761 190 761 q 492 705 413 761 q 583 531 583 643 l 462 531 q 412 625 462 594 q 298 657 363 657 q 199 636 242 657 q 143 558 143 608 q 262 454 143 486 q 484 394 479 397 q 604 217 604 341 \"},\"B\":{\"x_min\":0,\"x_max\":778,\"ha\":876,\"o\":\"m 580 546 q 724 469 670 535 q 778 311 778 403 q 673 83 778 171 q 432 0 575 0 l 0 0 l 0 1013 l 411 1013 q 629 957 541 1013 q 732 768 732 892 q 691 633 732 693 q 580 546 650 572 m 393 899 l 139 899 l 139 588 l 379 588 q 521 624 462 588 q 592 744 592 667 q 531 859 592 819 q 393 899 471 899 m 419 124 q 566 169 504 124 q 635 303 635 219 q 559 436 635 389 q 402 477 494 477 l 139 477 l 139 124 l 419 124 \"},\"…\":{\"x_min\":0,\"x_max\":614,\"ha\":708,\"o\":\"m 142 0 l 0 0 l 0 151 l 142 151 l 142 0 m 378 0 l 236 0 l 236 151 l 378 151 l 378 0 m 614 0 l 472 0 l 472 151 l 614 151 l 614 0 \"},\"?\":{\"x_min\":0,\"x_max\":607,\"ha\":704,\"o\":\"m 607 777 q 543 599 607 674 q 422 474 482 537 q 357 272 357 391 l 236 272 q 297 487 236 395 q 411 619 298 490 q 474 762 474 691 q 422 885 474 838 q 301 933 371 933 q 179 880 228 933 q 124 706 124 819 l 0 706 q 94 963 0 872 q 302 1044 177 1044 q 511 973 423 1044 q 607 777 607 895 m 370 0 l 230 0 l 230 151 l 370 151 l 370 0 \"},\"H\":{\"x_min\":0,\"x_max\":803,\"ha\":915,\"o\":\"m 803 0 l 667 0 l 667 475 l 140 475 l 140 0 l 0 0 l 0 1013 l 140 1013 l 140 599 l 667 599 l 667 1013 l 803 1013 l 803 0 \"},\"ν\":{\"x_min\":0,\"x_max\":675,\"ha\":761,\"o\":\"m 675 738 l 404 0 l 272 0 l 0 738 l 133 738 l 340 147 l 541 738 l 675 738 \"},\"c\":{\"x_min\":1,\"x_max\":701.390625,\"ha\":775,\"o\":\"m 701 264 q 584 53 681 133 q 353 -26 487 -26 q 91 91 188 -26 q 1 370 1 201 q 92 645 1 537 q 353 761 190 761 q 572 688 479 761 q 690 493 666 615 l 556 493 q 487 606 545 562 q 356 650 428 650 q 186 563 246 650 q 134 372 134 487 q 188 179 134 258 q 359 88 250 88 q 492 136 437 88 q 566 264 548 185 l 701 264 \"},\"¶\":{\"x_min\":0,\"x_max\":566.671875,\"ha\":678,\"o\":\"m 21 892 l 52 892 l 98 761 l 145 892 l 176 892 l 178 741 l 157 741 l 157 867 l 108 741 l 88 741 l 40 871 l 40 741 l 21 741 l 21 892 m 308 854 l 308 731 q 252 691 308 691 q 227 691 240 691 q 207 696 213 695 l 207 712 l 253 706 q 288 733 288 706 l 288 763 q 244 741 279 741 q 193 797 193 741 q 261 860 193 860 q 287 860 273 860 q 308 854 302 855 m 288 842 l 263 843 q 213 796 213 843 q 248 756 213 756 q 288 796 288 756 l 288 842 m 566 988 l 502 988 l 502 -1 l 439 -1 l 439 988 l 317 988 l 317 -1 l 252 -1 l 252 602 q 81 653 155 602 q 0 805 0 711 q 101 989 0 918 q 309 1053 194 1053 l 566 1053 l 566 988 \"},\"β\":{\"x_min\":0,\"x_max\":660,\"ha\":745,\"o\":\"m 471 550 q 610 450 561 522 q 660 280 660 378 q 578 64 660 151 q 367 -22 497 -22 q 239 5 299 -22 q 126 82 178 32 l 126 -278 l 0 -278 l 0 593 q 54 903 0 801 q 318 1042 127 1042 q 519 964 436 1042 q 603 771 603 887 q 567 644 603 701 q 471 550 532 586 m 337 79 q 476 138 418 79 q 535 279 535 198 q 427 437 535 386 q 226 477 344 477 l 226 583 q 398 620 329 583 q 486 762 486 668 q 435 884 486 833 q 312 935 384 935 q 169 861 219 935 q 126 698 126 797 l 126 362 q 170 169 126 242 q 337 79 224 79 \"},\"Μ\":{\"x_min\":0,\"x_max\":954,\"ha\":1068,\"o\":\"m 954 0 l 819 0 l 819 868 l 537 0 l 405 0 l 128 865 l 128 0 l 0 0 l 0 1013 l 199 1013 l 472 158 l 758 1013 l 954 1013 l 954 0 \"},\"Ό\":{\"x_min\":0.109375,\"x_max\":1120,\"ha\":1217,\"o\":\"m 1120 505 q 994 132 1120 282 q 642 -29 861 -29 q 290 130 422 -29 q 167 505 167 280 q 294 883 167 730 q 650 1046 430 1046 q 999 882 868 1046 q 1120 505 1120 730 m 977 504 q 896 784 977 669 q 644 915 804 915 q 391 785 484 915 q 307 504 307 669 q 391 224 307 339 q 644 95 486 95 q 894 224 803 95 q 977 504 977 339 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 \"},\"Ή\":{\"x_min\":0,\"x_max\":1158,\"ha\":1275,\"o\":\"m 1158 0 l 1022 0 l 1022 475 l 496 475 l 496 0 l 356 0 l 356 1012 l 496 1012 l 496 599 l 1022 599 l 1022 1012 l 1158 1012 l 1158 0 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 \"},\"•\":{\"x_min\":0,\"x_max\":663.890625,\"ha\":775,\"o\":\"m 663 529 q 566 293 663 391 q 331 196 469 196 q 97 294 194 196 q 0 529 0 393 q 96 763 0 665 q 331 861 193 861 q 566 763 469 861 q 663 529 663 665 \"},\"¥\":{\"x_min\":0.1875,\"x_max\":819.546875,\"ha\":886,\"o\":\"m 563 561 l 697 561 l 696 487 l 520 487 l 482 416 l 482 380 l 697 380 l 695 308 l 482 308 l 482 0 l 342 0 l 342 308 l 125 308 l 125 380 l 342 380 l 342 417 l 303 487 l 125 487 l 125 561 l 258 561 l 0 1013 l 140 1013 l 411 533 l 679 1013 l 819 1013 l 563 561 \"},\"(\":{\"x_min\":0,\"x_max\":318.0625,\"ha\":415,\"o\":\"m 318 -290 l 230 -290 q 61 23 122 -142 q 0 365 0 190 q 62 712 0 540 q 230 1024 119 869 l 318 1024 q 175 705 219 853 q 125 360 125 542 q 176 22 125 187 q 318 -290 223 -127 \"},\"U\":{\"x_min\":0,\"x_max\":796,\"ha\":904,\"o\":\"m 796 393 q 681 93 796 212 q 386 -25 566 -25 q 101 95 208 -25 q 0 393 0 211 l 0 1013 l 138 1013 l 138 391 q 204 191 138 270 q 394 107 276 107 q 586 191 512 107 q 656 391 656 270 l 656 1013 l 796 1013 l 796 393 \"},\"γ\":{\"x_min\":0.5,\"x_max\":744.953125,\"ha\":822,\"o\":\"m 744 737 l 463 54 l 463 -278 l 338 -278 l 338 54 l 154 495 q 104 597 124 569 q 13 651 67 651 l 0 651 l 0 751 l 39 753 q 168 711 121 753 q 242 594 207 676 l 403 208 l 617 737 l 744 737 \"},\"α\":{\"x_min\":0,\"x_max\":765.5625,\"ha\":809,\"o\":\"m 765 -4 q 698 -14 726 -14 q 564 97 586 -14 q 466 7 525 40 q 337 -26 407 -26 q 88 98 186 -26 q 0 369 0 212 q 88 637 0 525 q 337 760 184 760 q 465 728 407 760 q 563 637 524 696 l 563 739 l 685 739 l 685 222 q 693 141 685 168 q 748 94 708 94 q 765 96 760 94 l 765 -4 m 584 371 q 531 562 584 485 q 360 653 470 653 q 192 566 254 653 q 135 379 135 489 q 186 181 135 261 q 358 84 247 84 q 528 176 465 84 q 584 371 584 260 \"},\"F\":{\"x_min\":0,\"x_max\":683.328125,\"ha\":717,\"o\":\"m 683 888 l 140 888 l 140 583 l 613 583 l 613 458 l 140 458 l 140 0 l 0 0 l 0 1013 l 683 1013 l 683 888 \"},\"­\":{\"x_min\":0,\"x_max\":705.5625,\"ha\":803,\"o\":\"m 705 334 l 0 334 l 0 410 l 705 410 l 705 334 \"},\":\":{\"x_min\":0,\"x_max\":142,\"ha\":239,\"o\":\"m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 m 142 0 l 0 0 l 0 151 l 142 151 l 142 0 \"},\"Χ\":{\"x_min\":0,\"x_max\":854.171875,\"ha\":935,\"o\":\"m 854 0 l 683 0 l 423 409 l 166 0 l 0 0 l 347 519 l 18 1013 l 186 1013 l 427 637 l 675 1013 l 836 1013 l 504 521 l 854 0 \"},\"*\":{\"x_min\":116,\"x_max\":674,\"ha\":792,\"o\":\"m 674 768 l 475 713 l 610 544 l 517 477 l 394 652 l 272 478 l 178 544 l 314 713 l 116 766 l 153 876 l 341 812 l 342 1013 l 446 1013 l 446 811 l 635 874 l 674 768 \"},\"†\":{\"x_min\":0,\"x_max\":777,\"ha\":835,\"o\":\"m 458 804 l 777 804 l 777 683 l 458 683 l 458 0 l 319 0 l 319 681 l 0 683 l 0 804 l 319 804 l 319 1015 l 458 1013 l 458 804 \"},\"°\":{\"x_min\":0,\"x_max\":347,\"ha\":444,\"o\":\"m 173 802 q 43 856 91 802 q 0 977 0 905 q 45 1101 0 1049 q 173 1153 90 1153 q 303 1098 255 1153 q 347 977 347 1049 q 303 856 347 905 q 173 802 256 802 m 173 884 q 238 910 214 884 q 262 973 262 937 q 239 1038 262 1012 q 173 1064 217 1064 q 108 1037 132 1064 q 85 973 85 1010 q 108 910 85 937 q 173 884 132 884 \"},\"V\":{\"x_min\":0,\"x_max\":862.71875,\"ha\":940,\"o\":\"m 862 1013 l 505 0 l 361 0 l 0 1013 l 143 1013 l 434 165 l 718 1012 l 862 1013 \"},\"Ξ\":{\"x_min\":0,\"x_max\":734.71875,\"ha\":763,\"o\":\"m 723 889 l 9 889 l 9 1013 l 723 1013 l 723 889 m 673 463 l 61 463 l 61 589 l 673 589 l 673 463 m 734 0 l 0 0 l 0 124 l 734 124 l 734 0 \"},\"\xA0\":{\"x_min\":0,\"x_max\":0,\"ha\":853},\"Ϋ\":{\"x_min\":0.328125,\"x_max\":819.515625,\"ha\":889,\"o\":\"m 588 1046 l 460 1046 l 460 1189 l 588 1189 l 588 1046 m 360 1046 l 232 1046 l 232 1189 l 360 1189 l 360 1046 m 819 1012 l 482 416 l 482 0 l 342 0 l 342 416 l 0 1012 l 140 1012 l 411 533 l 679 1012 l 819 1012 \"},\"0\":{\"x_min\":73,\"x_max\":715,\"ha\":792,\"o\":\"m 394 -29 q 153 129 242 -29 q 73 479 73 272 q 152 829 73 687 q 394 989 241 989 q 634 829 545 989 q 715 479 715 684 q 635 129 715 270 q 394 -29 546 -29 m 394 89 q 546 211 489 89 q 598 479 598 322 q 548 748 598 640 q 394 871 491 871 q 241 748 298 871 q 190 479 190 637 q 239 211 190 319 q 394 89 296 89 \"},\"”\":{\"x_min\":0,\"x_max\":347,\"ha\":454,\"o\":\"m 139 851 q 102 737 139 784 q 0 669 65 690 l 0 734 q 59 787 42 741 q 72 873 72 821 l 0 873 l 0 1013 l 139 1013 l 139 851 m 347 851 q 310 737 347 784 q 208 669 273 690 l 208 734 q 267 787 250 741 q 280 873 280 821 l 208 873 l 208 1013 l 347 1013 l 347 851 \"},\"@\":{\"x_min\":0,\"x_max\":1260,\"ha\":1357,\"o\":\"m 1098 -45 q 877 -160 1001 -117 q 633 -203 752 -203 q 155 -29 327 -203 q 0 360 0 127 q 176 802 0 616 q 687 1008 372 1008 q 1123 854 969 1008 q 1260 517 1260 718 q 1155 216 1260 341 q 868 82 1044 82 q 772 106 801 82 q 737 202 737 135 q 647 113 700 144 q 527 82 594 82 q 367 147 420 82 q 314 312 314 212 q 401 565 314 452 q 639 690 498 690 q 810 588 760 690 l 849 668 l 938 668 q 877 441 900 532 q 833 226 833 268 q 853 182 833 198 q 902 167 873 167 q 1088 272 1012 167 q 1159 512 1159 372 q 1051 793 1159 681 q 687 925 925 925 q 248 747 415 925 q 97 361 97 586 q 226 26 97 159 q 627 -122 370 -122 q 856 -87 737 -122 q 1061 8 976 -53 l 1098 -45 m 786 488 q 738 580 777 545 q 643 615 700 615 q 483 517 548 615 q 425 322 425 430 q 457 203 425 250 q 552 156 490 156 q 722 273 665 156 q 786 488 738 309 \"},\"Ί\":{\"x_min\":0,\"x_max\":499,\"ha\":613,\"o\":\"m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 m 499 0 l 360 0 l 360 1012 l 499 1012 l 499 0 \"},\"i\":{\"x_min\":14,\"x_max\":136,\"ha\":275,\"o\":\"m 136 873 l 14 873 l 14 1013 l 136 1013 l 136 873 m 136 0 l 14 0 l 14 737 l 136 737 l 136 0 \"},\"Β\":{\"x_min\":0,\"x_max\":778,\"ha\":877,\"o\":\"m 580 545 q 724 468 671 534 q 778 310 778 402 q 673 83 778 170 q 432 0 575 0 l 0 0 l 0 1013 l 411 1013 q 629 957 541 1013 q 732 768 732 891 q 691 632 732 692 q 580 545 650 571 m 393 899 l 139 899 l 139 587 l 379 587 q 521 623 462 587 q 592 744 592 666 q 531 859 592 819 q 393 899 471 899 m 419 124 q 566 169 504 124 q 635 302 635 219 q 559 435 635 388 q 402 476 494 476 l 139 476 l 139 124 l 419 124 \"},\"υ\":{\"x_min\":0,\"x_max\":617,\"ha\":725,\"o\":\"m 617 352 q 540 94 617 199 q 308 -24 455 -24 q 76 94 161 -24 q 0 352 0 199 l 0 739 l 126 739 l 126 355 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 355 492 257 l 492 739 l 617 739 l 617 352 \"},\"]\":{\"x_min\":0,\"x_max\":275,\"ha\":372,\"o\":\"m 275 -281 l 0 -281 l 0 -187 l 151 -187 l 151 920 l 0 920 l 0 1013 l 275 1013 l 275 -281 \"},\"m\":{\"x_min\":0,\"x_max\":1019,\"ha\":1128,\"o\":\"m 1019 0 l 897 0 l 897 454 q 860 591 897 536 q 739 660 816 660 q 613 586 659 660 q 573 436 573 522 l 573 0 l 447 0 l 447 455 q 412 591 447 535 q 294 657 372 657 q 165 586 213 657 q 122 437 122 521 l 122 0 l 0 0 l 0 738 l 117 738 l 117 640 q 202 730 150 697 q 316 763 254 763 q 437 730 381 763 q 525 642 494 697 q 621 731 559 700 q 753 763 682 763 q 943 694 867 763 q 1019 512 1019 625 l 1019 0 \"},\"χ\":{\"x_min\":8.328125,\"x_max\":780.5625,\"ha\":815,\"o\":\"m 780 -278 q 715 -294 747 -294 q 616 -257 663 -294 q 548 -175 576 -227 l 379 133 l 143 -277 l 9 -277 l 313 254 l 163 522 q 127 586 131 580 q 36 640 91 640 q 8 637 27 640 l 8 752 l 52 757 q 162 719 113 757 q 236 627 200 690 l 383 372 l 594 737 l 726 737 l 448 250 l 625 -69 q 670 -153 647 -110 q 743 -188 695 -188 q 780 -184 759 -188 l 780 -278 \"},\"8\":{\"x_min\":55,\"x_max\":736,\"ha\":792,\"o\":\"m 571 527 q 694 424 652 491 q 736 280 736 358 q 648 71 736 158 q 395 -26 551 -26 q 142 69 238 -26 q 55 279 55 157 q 96 425 55 359 q 220 527 138 491 q 120 615 153 562 q 88 726 88 668 q 171 904 88 827 q 395 986 261 986 q 618 905 529 986 q 702 727 702 830 q 670 616 702 667 q 571 527 638 565 m 394 565 q 519 610 475 565 q 563 717 563 655 q 521 823 563 781 q 392 872 474 872 q 265 824 312 872 q 224 720 224 783 q 265 613 224 656 q 394 565 312 565 m 395 91 q 545 150 488 91 q 597 280 597 204 q 546 408 597 355 q 395 465 492 465 q 244 408 299 465 q 194 280 194 356 q 244 150 194 203 q 395 91 299 91 \"},\"ί\":{\"x_min\":42,\"x_max\":326.71875,\"ha\":361,\"o\":\"m 284 3 q 233 -10 258 -5 q 182 -15 207 -15 q 85 26 119 -15 q 42 200 42 79 l 42 737 l 167 737 l 168 215 q 172 141 168 157 q 226 101 183 101 q 248 102 239 101 q 284 112 257 104 l 284 3 m 326 1040 l 137 819 l 54 819 l 189 1040 l 326 1040 \"},\"Ζ\":{\"x_min\":0,\"x_max\":779.171875,\"ha\":850,\"o\":\"m 779 0 l 0 0 l 0 113 l 620 896 l 40 896 l 40 1013 l 779 1013 l 779 887 l 170 124 l 779 124 l 779 0 \"},\"R\":{\"x_min\":0,\"x_max\":781.953125,\"ha\":907,\"o\":\"m 781 0 l 623 0 q 587 242 590 52 q 407 433 585 433 l 138 433 l 138 0 l 0 0 l 0 1013 l 396 1013 q 636 946 539 1013 q 749 731 749 868 q 711 597 749 659 q 608 502 674 534 q 718 370 696 474 q 729 207 722 352 q 781 26 736 62 l 781 0 m 373 551 q 533 594 465 551 q 614 731 614 645 q 532 859 614 815 q 373 896 465 896 l 138 896 l 138 551 l 373 551 \"},\"o\":{\"x_min\":0,\"x_max\":713,\"ha\":821,\"o\":\"m 357 -25 q 94 91 194 -25 q 0 368 0 202 q 93 642 0 533 q 357 761 193 761 q 618 644 518 761 q 713 368 713 533 q 619 91 713 201 q 357 -25 521 -25 m 357 85 q 528 175 465 85 q 584 369 584 255 q 529 562 584 484 q 357 651 467 651 q 189 560 250 651 q 135 369 135 481 q 187 177 135 257 q 357 85 250 85 \"},\"5\":{\"x_min\":54.171875,\"x_max\":738,\"ha\":792,\"o\":\"m 738 314 q 626 60 738 153 q 382 -23 526 -23 q 155 47 248 -23 q 54 256 54 125 l 183 256 q 259 132 204 174 q 382 91 314 91 q 533 149 471 91 q 602 314 602 213 q 538 469 602 411 q 386 528 475 528 q 284 506 332 528 q 197 439 237 484 l 81 439 l 159 958 l 684 958 l 684 840 l 254 840 l 214 579 q 306 627 258 612 q 407 643 354 643 q 636 552 540 643 q 738 314 738 457 \"},\"7\":{\"x_min\":58.71875,\"x_max\":730.953125,\"ha\":792,\"o\":\"m 730 839 q 469 448 560 641 q 335 0 378 255 l 192 0 q 328 441 235 252 q 593 830 421 630 l 58 830 l 58 958 l 730 958 l 730 839 \"},\"K\":{\"x_min\":0,\"x_max\":819.46875,\"ha\":906,\"o\":\"m 819 0 l 649 0 l 294 509 l 139 355 l 139 0 l 0 0 l 0 1013 l 139 1013 l 139 526 l 626 1013 l 809 1013 l 395 600 l 819 0 \"},\",\":{\"x_min\":0,\"x_max\":142,\"ha\":239,\"o\":\"m 142 -12 q 105 -132 142 -82 q 0 -205 68 -182 l 0 -138 q 57 -82 40 -124 q 70 0 70 -51 l 0 0 l 0 151 l 142 151 l 142 -12 \"},\"d\":{\"x_min\":0,\"x_max\":683,\"ha\":796,\"o\":\"m 683 0 l 564 0 l 564 93 q 456 6 516 38 q 327 -25 395 -25 q 87 100 181 -25 q 0 365 0 215 q 90 639 0 525 q 343 763 187 763 q 564 647 486 763 l 564 1013 l 683 1013 l 683 0 m 582 373 q 529 562 582 484 q 361 653 468 653 q 190 561 253 653 q 135 365 135 479 q 189 175 135 254 q 358 85 251 85 q 529 178 468 85 q 582 373 582 258 \"},\"¨\":{\"x_min\":-109,\"x_max\":247,\"ha\":232,\"o\":\"m 247 1046 l 119 1046 l 119 1189 l 247 1189 l 247 1046 m 19 1046 l -109 1046 l -109 1189 l 19 1189 l 19 1046 \"},\"E\":{\"x_min\":0,\"x_max\":736.109375,\"ha\":789,\"o\":\"m 736 0 l 0 0 l 0 1013 l 725 1013 l 725 889 l 139 889 l 139 585 l 677 585 l 677 467 l 139 467 l 139 125 l 736 125 l 736 0 \"},\"Y\":{\"x_min\":0,\"x_max\":820,\"ha\":886,\"o\":\"m 820 1013 l 482 416 l 482 0 l 342 0 l 342 416 l 0 1013 l 140 1013 l 411 534 l 679 1012 l 820 1013 \"},\"\\\"\":{\"x_min\":0,\"x_max\":299,\"ha\":396,\"o\":\"m 299 606 l 203 606 l 203 988 l 299 988 l 299 606 m 96 606 l 0 606 l 0 988 l 96 988 l 96 606 \"},\"‹\":{\"x_min\":17.984375,\"x_max\":773.609375,\"ha\":792,\"o\":\"m 773 40 l 18 376 l 17 465 l 773 799 l 773 692 l 159 420 l 773 149 l 773 40 \"},\"„\":{\"x_min\":0,\"x_max\":364,\"ha\":467,\"o\":\"m 141 -12 q 104 -132 141 -82 q 0 -205 67 -182 l 0 -138 q 56 -82 40 -124 q 69 0 69 -51 l 0 0 l 0 151 l 141 151 l 141 -12 m 364 -12 q 327 -132 364 -82 q 222 -205 290 -182 l 222 -138 q 279 -82 262 -124 q 292 0 292 -51 l 222 0 l 222 151 l 364 151 l 364 -12 \"},\"δ\":{\"x_min\":1,\"x_max\":710,\"ha\":810,\"o\":\"m 710 360 q 616 87 710 196 q 356 -28 518 -28 q 99 82 197 -28 q 1 356 1 192 q 100 606 1 509 q 355 703 199 703 q 180 829 288 754 q 70 903 124 866 l 70 1012 l 643 1012 l 643 901 l 258 901 q 462 763 422 794 q 636 592 577 677 q 710 360 710 485 m 584 365 q 552 501 584 447 q 451 602 521 555 q 372 611 411 611 q 197 541 258 611 q 136 355 136 472 q 190 171 136 245 q 358 85 252 85 q 528 173 465 85 q 584 365 584 252 \"},\"έ\":{\"x_min\":0,\"x_max\":634.71875,\"ha\":714,\"o\":\"m 634 234 q 527 38 634 110 q 300 -25 433 -25 q 98 29 183 -25 q 0 204 0 93 q 37 313 0 265 q 128 390 67 352 q 56 459 82 419 q 26 555 26 505 q 114 712 26 654 q 295 763 191 763 q 499 700 416 763 q 589 515 589 631 l 478 515 q 419 618 464 580 q 307 657 374 657 q 207 630 253 657 q 151 547 151 598 q 238 445 151 469 q 389 434 280 434 l 389 331 l 349 331 q 206 315 255 331 q 125 210 125 287 q 183 107 125 145 q 302 76 233 76 q 436 117 379 76 q 509 234 493 159 l 634 234 m 520 1040 l 331 819 l 248 819 l 383 1040 l 520 1040 \"},\"ω\":{\"x_min\":0,\"x_max\":922,\"ha\":1031,\"o\":\"m 922 339 q 856 97 922 203 q 650 -26 780 -26 q 538 9 587 -26 q 461 103 489 44 q 387 12 436 46 q 277 -22 339 -22 q 69 97 147 -22 q 0 339 0 203 q 45 551 0 444 q 161 738 84 643 l 302 738 q 175 553 219 647 q 124 336 124 446 q 155 179 124 249 q 275 88 197 88 q 375 163 341 88 q 400 294 400 219 l 400 572 l 524 572 l 524 294 q 561 135 524 192 q 643 88 591 88 q 762 182 719 88 q 797 342 797 257 q 745 556 797 450 q 619 738 705 638 l 760 738 q 874 551 835 640 q 922 339 922 444 \"},\"´\":{\"x_min\":0,\"x_max\":96,\"ha\":251,\"o\":\"m 96 606 l 0 606 l 0 988 l 96 988 l 96 606 \"},\"±\":{\"x_min\":11,\"x_max\":781,\"ha\":792,\"o\":\"m 781 490 l 446 490 l 446 255 l 349 255 l 349 490 l 11 490 l 11 586 l 349 586 l 349 819 l 446 819 l 446 586 l 781 586 l 781 490 m 781 21 l 11 21 l 11 115 l 781 115 l 781 21 \"},\"|\":{\"x_min\":343,\"x_max\":449,\"ha\":792,\"o\":\"m 449 462 l 343 462 l 343 986 l 449 986 l 449 462 m 449 -242 l 343 -242 l 343 280 l 449 280 l 449 -242 \"},\"ϋ\":{\"x_min\":0,\"x_max\":617,\"ha\":725,\"o\":\"m 482 800 l 372 800 l 372 925 l 482 925 l 482 800 m 239 800 l 129 800 l 129 925 l 239 925 l 239 800 m 617 352 q 540 93 617 199 q 308 -24 455 -24 q 76 93 161 -24 q 0 352 0 199 l 0 738 l 126 738 l 126 354 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 354 492 257 l 492 738 l 617 738 l 617 352 \"},\"§\":{\"x_min\":0,\"x_max\":593,\"ha\":690,\"o\":\"m 593 425 q 554 312 593 369 q 467 233 516 254 q 537 83 537 172 q 459 -74 537 -12 q 288 -133 387 -133 q 115 -69 184 -133 q 47 96 47 -6 l 166 96 q 199 7 166 40 q 288 -26 232 -26 q 371 -5 332 -26 q 420 60 420 21 q 311 201 420 139 q 108 309 210 255 q 0 490 0 383 q 33 602 0 551 q 124 687 66 654 q 75 743 93 712 q 58 812 58 773 q 133 984 58 920 q 300 1043 201 1043 q 458 987 394 1043 q 529 814 529 925 l 411 814 q 370 908 404 877 q 289 939 336 939 q 213 911 246 939 q 180 841 180 883 q 286 720 180 779 q 484 612 480 615 q 593 425 593 534 m 467 409 q 355 544 467 473 q 196 630 228 612 q 146 587 162 609 q 124 525 124 558 q 239 387 124 462 q 398 298 369 315 q 448 345 429 316 q 467 409 467 375 \"},\"b\":{\"x_min\":0,\"x_max\":685,\"ha\":783,\"o\":\"m 685 372 q 597 99 685 213 q 347 -25 501 -25 q 219 5 277 -25 q 121 93 161 36 l 121 0 l 0 0 l 0 1013 l 121 1013 l 121 634 q 214 723 157 692 q 341 754 272 754 q 591 637 493 754 q 685 372 685 526 m 554 356 q 499 550 554 470 q 328 644 437 644 q 162 556 223 644 q 108 369 108 478 q 160 176 108 256 q 330 83 221 83 q 498 169 435 83 q 554 356 554 245 \"},\"q\":{\"x_min\":0,\"x_max\":683,\"ha\":876,\"o\":\"m 683 -278 l 564 -278 l 564 97 q 474 8 533 39 q 345 -23 415 -23 q 91 93 188 -23 q 0 364 0 203 q 87 635 0 522 q 337 760 184 760 q 466 727 408 760 q 564 637 523 695 l 564 737 l 683 737 l 683 -278 m 582 375 q 527 564 582 488 q 358 652 466 652 q 190 565 253 652 q 135 377 135 488 q 189 179 135 261 q 361 84 251 84 q 530 179 469 84 q 582 375 582 260 \"},\"Ω\":{\"x_min\":-0.171875,\"x_max\":969.5625,\"ha\":1068,\"o\":\"m 969 0 l 555 0 l 555 123 q 744 308 675 194 q 814 558 814 423 q 726 812 814 709 q 484 922 633 922 q 244 820 334 922 q 154 567 154 719 q 223 316 154 433 q 412 123 292 199 l 412 0 l 0 0 l 0 124 l 217 124 q 68 327 122 210 q 15 572 15 444 q 144 911 15 781 q 484 1041 274 1041 q 822 909 691 1041 q 953 569 953 777 q 899 326 953 443 q 750 124 846 210 l 969 124 l 969 0 \"},\"ύ\":{\"x_min\":0,\"x_max\":617,\"ha\":725,\"o\":\"m 617 352 q 540 93 617 199 q 308 -24 455 -24 q 76 93 161 -24 q 0 352 0 199 l 0 738 l 126 738 l 126 354 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 354 492 257 l 492 738 l 617 738 l 617 352 m 535 1040 l 346 819 l 262 819 l 397 1040 l 535 1040 \"},\"z\":{\"x_min\":-0.015625,\"x_max\":613.890625,\"ha\":697,\"o\":\"m 613 0 l 0 0 l 0 100 l 433 630 l 20 630 l 20 738 l 594 738 l 593 636 l 163 110 l 613 110 l 613 0 \"},\"™\":{\"x_min\":0,\"x_max\":894,\"ha\":1000,\"o\":\"m 389 951 l 229 951 l 229 503 l 160 503 l 160 951 l 0 951 l 0 1011 l 389 1011 l 389 951 m 894 503 l 827 503 l 827 939 l 685 503 l 620 503 l 481 937 l 481 503 l 417 503 l 417 1011 l 517 1011 l 653 580 l 796 1010 l 894 1011 l 894 503 \"},\"ή\":{\"x_min\":0.78125,\"x_max\":697,\"ha\":810,\"o\":\"m 697 -278 l 572 -278 l 572 454 q 540 587 572 536 q 425 650 501 650 q 271 579 337 650 q 206 420 206 509 l 206 0 l 81 0 l 81 489 q 73 588 81 562 q 0 644 56 644 l 0 741 q 68 755 38 755 q 158 721 124 755 q 200 630 193 687 q 297 726 234 692 q 434 761 359 761 q 620 692 544 761 q 697 516 697 624 l 697 -278 m 479 1040 l 290 819 l 207 819 l 341 1040 l 479 1040 \"},\"Θ\":{\"x_min\":0,\"x_max\":960,\"ha\":1056,\"o\":\"m 960 507 q 833 129 960 280 q 476 -32 698 -32 q 123 129 255 -32 q 0 507 0 280 q 123 883 0 732 q 476 1045 255 1045 q 832 883 696 1045 q 960 507 960 732 m 817 500 q 733 789 817 669 q 476 924 639 924 q 223 792 317 924 q 142 507 142 675 q 222 222 142 339 q 476 89 315 89 q 730 218 636 89 q 817 500 817 334 m 716 449 l 243 449 l 243 571 l 716 571 l 716 449 \"},\"®\":{\"x_min\":-3,\"x_max\":1008,\"ha\":1106,\"o\":\"m 503 532 q 614 562 566 532 q 672 658 672 598 q 614 747 672 716 q 503 772 569 772 l 338 772 l 338 532 l 503 532 m 502 -7 q 123 151 263 -7 q -3 501 -3 294 q 123 851 -3 706 q 502 1011 263 1011 q 881 851 739 1011 q 1008 501 1008 708 q 883 151 1008 292 q 502 -7 744 -7 m 502 60 q 830 197 709 60 q 940 501 940 322 q 831 805 940 681 q 502 944 709 944 q 174 805 296 944 q 65 501 65 680 q 173 197 65 320 q 502 60 294 60 m 788 146 l 678 146 q 653 316 655 183 q 527 449 652 449 l 338 449 l 338 146 l 241 146 l 241 854 l 518 854 q 688 808 621 854 q 766 658 766 755 q 739 563 766 607 q 668 497 713 519 q 751 331 747 472 q 788 164 756 190 l 788 146 \"},\"~\":{\"x_min\":0,\"x_max\":833,\"ha\":931,\"o\":\"m 833 958 q 778 753 833 831 q 594 665 716 665 q 402 761 502 665 q 240 857 302 857 q 131 795 166 857 q 104 665 104 745 l 0 665 q 54 867 0 789 q 237 958 116 958 q 429 861 331 958 q 594 765 527 765 q 704 827 670 765 q 729 958 729 874 l 833 958 \"},\"Ε\":{\"x_min\":0,\"x_max\":736.21875,\"ha\":778,\"o\":\"m 736 0 l 0 0 l 0 1013 l 725 1013 l 725 889 l 139 889 l 139 585 l 677 585 l 677 467 l 139 467 l 139 125 l 736 125 l 736 0 \"},\"³\":{\"x_min\":0,\"x_max\":450,\"ha\":547,\"o\":\"m 450 552 q 379 413 450 464 q 220 366 313 366 q 69 414 130 366 q 0 567 0 470 l 85 567 q 126 470 85 504 q 225 437 168 437 q 320 467 280 437 q 360 552 360 498 q 318 632 360 608 q 213 657 276 657 q 195 657 203 657 q 176 657 181 657 l 176 722 q 279 733 249 722 q 334 815 334 752 q 300 881 334 856 q 220 907 267 907 q 133 875 169 907 q 97 781 97 844 l 15 781 q 78 926 15 875 q 220 972 135 972 q 364 930 303 972 q 426 817 426 888 q 344 697 426 733 q 421 642 392 681 q 450 552 450 603 \"},\"[\":{\"x_min\":0,\"x_max\":273.609375,\"ha\":371,\"o\":\"m 273 -281 l 0 -281 l 0 1013 l 273 1013 l 273 920 l 124 920 l 124 -187 l 273 -187 l 273 -281 \"},\"L\":{\"x_min\":0,\"x_max\":645.828125,\"ha\":696,\"o\":\"m 645 0 l 0 0 l 0 1013 l 140 1013 l 140 126 l 645 126 l 645 0 \"},\"σ\":{\"x_min\":0,\"x_max\":803.390625,\"ha\":894,\"o\":\"m 803 628 l 633 628 q 713 368 713 512 q 618 93 713 204 q 357 -25 518 -25 q 94 91 194 -25 q 0 368 0 201 q 94 644 0 533 q 356 761 194 761 q 481 750 398 761 q 608 739 564 739 l 803 739 l 803 628 m 360 85 q 529 180 467 85 q 584 374 584 262 q 527 566 584 490 q 352 651 463 651 q 187 559 247 651 q 135 368 135 478 q 189 175 135 254 q 360 85 251 85 \"},\"ζ\":{\"x_min\":0,\"x_max\":573,\"ha\":642,\"o\":\"m 573 -40 q 553 -162 573 -97 q 510 -278 543 -193 l 400 -278 q 441 -187 428 -219 q 462 -90 462 -132 q 378 -14 462 -14 q 108 45 197 -14 q 0 290 0 117 q 108 631 0 462 q 353 901 194 767 l 55 901 l 55 1012 l 561 1012 l 561 924 q 261 669 382 831 q 128 301 128 489 q 243 117 128 149 q 458 98 350 108 q 573 -40 573 80 \"},\"θ\":{\"x_min\":0,\"x_max\":674,\"ha\":778,\"o\":\"m 674 496 q 601 160 674 304 q 336 -26 508 -26 q 73 153 165 -26 q 0 485 0 296 q 72 840 0 683 q 343 1045 166 1045 q 605 844 516 1045 q 674 496 674 692 m 546 579 q 498 798 546 691 q 336 935 437 935 q 178 798 237 935 q 126 579 137 701 l 546 579 m 546 475 l 126 475 q 170 233 126 348 q 338 80 230 80 q 504 233 447 80 q 546 475 546 346 \"},\"Ο\":{\"x_min\":0,\"x_max\":958,\"ha\":1054,\"o\":\"m 485 1042 q 834 883 703 1042 q 958 511 958 735 q 834 136 958 287 q 481 -26 701 -26 q 126 130 261 -26 q 0 504 0 279 q 127 880 0 729 q 485 1042 263 1042 m 480 98 q 731 225 638 98 q 815 504 815 340 q 733 783 815 670 q 480 913 640 913 q 226 785 321 913 q 142 504 142 671 q 226 224 142 339 q 480 98 319 98 \"},\"Γ\":{\"x_min\":0,\"x_max\":705.28125,\"ha\":749,\"o\":\"m 705 886 l 140 886 l 140 0 l 0 0 l 0 1012 l 705 1012 l 705 886 \"},\" \":{\"x_min\":0,\"x_max\":0,\"ha\":375},\"%\":{\"x_min\":-3,\"x_max\":1089,\"ha\":1186,\"o\":\"m 845 0 q 663 76 731 0 q 602 244 602 145 q 661 412 602 344 q 845 489 728 489 q 1027 412 959 489 q 1089 244 1089 343 q 1029 76 1089 144 q 845 0 962 0 m 844 103 q 945 143 909 103 q 981 243 981 184 q 947 340 981 301 q 844 385 909 385 q 744 342 781 385 q 708 243 708 300 q 741 147 708 186 q 844 103 780 103 m 888 986 l 284 -25 l 199 -25 l 803 986 l 888 986 m 241 468 q 58 545 126 468 q -3 715 -3 615 q 56 881 -3 813 q 238 958 124 958 q 421 881 353 958 q 483 712 483 813 q 423 544 483 612 q 241 468 356 468 m 241 855 q 137 811 175 855 q 100 710 100 768 q 136 612 100 653 q 240 572 172 572 q 344 614 306 572 q 382 713 382 656 q 347 810 382 771 q 241 855 308 855 \"},\"P\":{\"x_min\":0,\"x_max\":726,\"ha\":806,\"o\":\"m 424 1013 q 640 931 555 1013 q 726 719 726 850 q 637 506 726 587 q 413 426 548 426 l 140 426 l 140 0 l 0 0 l 0 1013 l 424 1013 m 379 889 l 140 889 l 140 548 l 372 548 q 522 589 459 548 q 593 720 593 637 q 528 845 593 801 q 379 889 463 889 \"},\"Έ\":{\"x_min\":0,\"x_max\":1078.21875,\"ha\":1118,\"o\":\"m 1078 0 l 342 0 l 342 1013 l 1067 1013 l 1067 889 l 481 889 l 481 585 l 1019 585 l 1019 467 l 481 467 l 481 125 l 1078 125 l 1078 0 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 \"},\"Ώ\":{\"x_min\":0.125,\"x_max\":1136.546875,\"ha\":1235,\"o\":\"m 1136 0 l 722 0 l 722 123 q 911 309 842 194 q 981 558 981 423 q 893 813 981 710 q 651 923 800 923 q 411 821 501 923 q 321 568 321 720 q 390 316 321 433 q 579 123 459 200 l 579 0 l 166 0 l 166 124 l 384 124 q 235 327 289 210 q 182 572 182 444 q 311 912 182 782 q 651 1042 441 1042 q 989 910 858 1042 q 1120 569 1120 778 q 1066 326 1120 443 q 917 124 1013 210 l 1136 124 l 1136 0 m 277 1040 l 83 800 l 0 800 l 140 1041 l 277 1040 \"},\"_\":{\"x_min\":0,\"x_max\":705.5625,\"ha\":803,\"o\":\"m 705 -334 l 0 -334 l 0 -234 l 705 -234 l 705 -334 \"},\"Ϊ\":{\"x_min\":-110,\"x_max\":246,\"ha\":275,\"o\":\"m 246 1046 l 118 1046 l 118 1189 l 246 1189 l 246 1046 m 18 1046 l -110 1046 l -110 1189 l 18 1189 l 18 1046 m 136 0 l 0 0 l 0 1012 l 136 1012 l 136 0 \"},\"+\":{\"x_min\":23,\"x_max\":768,\"ha\":792,\"o\":\"m 768 372 l 444 372 l 444 0 l 347 0 l 347 372 l 23 372 l 23 468 l 347 468 l 347 840 l 444 840 l 444 468 l 768 468 l 768 372 \"},\"½\":{\"x_min\":0,\"x_max\":1050,\"ha\":1149,\"o\":\"m 1050 0 l 625 0 q 712 178 625 108 q 878 277 722 187 q 967 385 967 328 q 932 456 967 429 q 850 484 897 484 q 759 450 798 484 q 721 352 721 416 l 640 352 q 706 502 640 448 q 851 551 766 551 q 987 509 931 551 q 1050 385 1050 462 q 976 251 1050 301 q 829 179 902 215 q 717 68 740 133 l 1050 68 l 1050 0 m 834 985 l 215 -28 l 130 -28 l 750 984 l 834 985 m 224 422 l 142 422 l 142 811 l 0 811 l 0 867 q 104 889 62 867 q 164 973 157 916 l 224 973 l 224 422 \"},\"Ρ\":{\"x_min\":0,\"x_max\":720,\"ha\":783,\"o\":\"m 424 1013 q 637 933 554 1013 q 720 723 720 853 q 633 508 720 591 q 413 426 546 426 l 140 426 l 140 0 l 0 0 l 0 1013 l 424 1013 m 378 889 l 140 889 l 140 548 l 371 548 q 521 589 458 548 q 592 720 592 637 q 527 845 592 801 q 378 889 463 889 \"},\"'\":{\"x_min\":0,\"x_max\":139,\"ha\":236,\"o\":\"m 139 851 q 102 737 139 784 q 0 669 65 690 l 0 734 q 59 787 42 741 q 72 873 72 821 l 0 873 l 0 1013 l 139 1013 l 139 851 \"},\"ª\":{\"x_min\":0,\"x_max\":350,\"ha\":397,\"o\":\"m 350 625 q 307 616 328 616 q 266 631 281 616 q 247 673 251 645 q 190 628 225 644 q 116 613 156 613 q 32 641 64 613 q 0 722 0 669 q 72 826 0 800 q 247 866 159 846 l 247 887 q 220 934 247 916 q 162 953 194 953 q 104 934 129 953 q 76 882 80 915 l 16 882 q 60 976 16 941 q 166 1011 104 1011 q 266 979 224 1011 q 308 891 308 948 l 308 706 q 311 679 308 688 q 331 670 315 670 l 350 672 l 350 625 m 247 757 l 247 811 q 136 790 175 798 q 64 726 64 773 q 83 682 64 697 q 132 667 103 667 q 207 690 174 667 q 247 757 247 718 \"},\"΅\":{\"x_min\":0,\"x_max\":450,\"ha\":553,\"o\":\"m 450 800 l 340 800 l 340 925 l 450 925 l 450 800 m 406 1040 l 212 800 l 129 800 l 269 1040 l 406 1040 m 110 800 l 0 800 l 0 925 l 110 925 l 110 800 \"},\"T\":{\"x_min\":0,\"x_max\":777,\"ha\":835,\"o\":\"m 777 894 l 458 894 l 458 0 l 319 0 l 319 894 l 0 894 l 0 1013 l 777 1013 l 777 894 \"},\"Φ\":{\"x_min\":0,\"x_max\":915,\"ha\":997,\"o\":\"m 527 0 l 389 0 l 389 122 q 110 231 220 122 q 0 509 0 340 q 110 785 0 677 q 389 893 220 893 l 389 1013 l 527 1013 l 527 893 q 804 786 693 893 q 915 509 915 679 q 805 231 915 341 q 527 122 696 122 l 527 0 m 527 226 q 712 310 641 226 q 779 507 779 389 q 712 705 779 627 q 527 787 641 787 l 527 226 m 389 226 l 389 787 q 205 698 275 775 q 136 505 136 620 q 206 308 136 391 q 389 226 276 226 \"},\"⁋\":{\"x_min\":0,\"x_max\":0,\"ha\":694},\"j\":{\"x_min\":-77.78125,\"x_max\":167,\"ha\":349,\"o\":\"m 167 871 l 42 871 l 42 1013 l 167 1013 l 167 871 m 167 -80 q 121 -231 167 -184 q -26 -278 76 -278 l -77 -278 l -77 -164 l -41 -164 q 26 -143 11 -164 q 42 -65 42 -122 l 42 737 l 167 737 l 167 -80 \"},\"Σ\":{\"x_min\":0,\"x_max\":756.953125,\"ha\":819,\"o\":\"m 756 0 l 0 0 l 0 107 l 395 523 l 22 904 l 22 1013 l 745 1013 l 745 889 l 209 889 l 566 523 l 187 125 l 756 125 l 756 0 \"},\"1\":{\"x_min\":215.671875,\"x_max\":574,\"ha\":792,\"o\":\"m 574 0 l 442 0 l 442 697 l 215 697 l 215 796 q 386 833 330 796 q 475 986 447 875 l 574 986 l 574 0 \"},\"›\":{\"x_min\":18.0625,\"x_max\":774,\"ha\":792,\"o\":\"m 774 376 l 18 40 l 18 149 l 631 421 l 18 692 l 18 799 l 774 465 l 774 376 \"},\"<\":{\"x_min\":17.984375,\"x_max\":773.609375,\"ha\":792,\"o\":\"m 773 40 l 18 376 l 17 465 l 773 799 l 773 692 l 159 420 l 773 149 l 773 40 \"},\"£\":{\"x_min\":0,\"x_max\":704.484375,\"ha\":801,\"o\":\"m 704 41 q 623 -10 664 5 q 543 -26 583 -26 q 359 15 501 -26 q 243 36 288 36 q 158 23 197 36 q 73 -21 119 10 l 6 76 q 125 195 90 150 q 175 331 175 262 q 147 443 175 383 l 0 443 l 0 512 l 108 512 q 43 734 43 623 q 120 929 43 854 q 358 1010 204 1010 q 579 936 487 1010 q 678 729 678 857 l 678 684 l 552 684 q 504 838 552 780 q 362 896 457 896 q 216 852 263 896 q 176 747 176 815 q 199 627 176 697 q 248 512 217 574 l 468 512 l 468 443 l 279 443 q 297 356 297 398 q 230 194 297 279 q 153 107 211 170 q 227 133 190 125 q 293 142 264 142 q 410 119 339 142 q 516 96 482 96 q 579 105 550 96 q 648 142 608 115 l 704 41 \"},\"t\":{\"x_min\":0,\"x_max\":367,\"ha\":458,\"o\":\"m 367 0 q 312 -5 339 -2 q 262 -8 284 -8 q 145 28 183 -8 q 108 143 108 64 l 108 638 l 0 638 l 0 738 l 108 738 l 108 944 l 232 944 l 232 738 l 367 738 l 367 638 l 232 638 l 232 185 q 248 121 232 140 q 307 102 264 102 q 345 104 330 102 q 367 107 360 107 l 367 0 \"},\"¬\":{\"x_min\":0,\"x_max\":706,\"ha\":803,\"o\":\"m 706 411 l 706 158 l 630 158 l 630 335 l 0 335 l 0 411 l 706 411 \"},\"λ\":{\"x_min\":0,\"x_max\":750,\"ha\":803,\"o\":\"m 750 -7 q 679 -15 716 -15 q 538 59 591 -15 q 466 214 512 97 l 336 551 l 126 0 l 0 0 l 270 705 q 223 837 247 770 q 116 899 190 899 q 90 898 100 899 l 90 1004 q 152 1011 125 1011 q 298 938 244 1011 q 373 783 326 901 l 605 192 q 649 115 629 136 q 716 95 669 95 l 736 95 q 750 97 745 97 l 750 -7 \"},\"W\":{\"x_min\":0,\"x_max\":1263.890625,\"ha\":1351,\"o\":\"m 1263 1013 l 995 0 l 859 0 l 627 837 l 405 0 l 265 0 l 0 1013 l 136 1013 l 342 202 l 556 1013 l 701 1013 l 921 207 l 1133 1012 l 1263 1013 \"},\">\":{\"x_min\":18.0625,\"x_max\":774,\"ha\":792,\"o\":\"m 774 376 l 18 40 l 18 149 l 631 421 l 18 692 l 18 799 l 774 465 l 774 376 \"},\"v\":{\"x_min\":0,\"x_max\":675.15625,\"ha\":761,\"o\":\"m 675 738 l 404 0 l 272 0 l 0 738 l 133 737 l 340 147 l 541 737 l 675 738 \"},\"τ\":{\"x_min\":0.28125,\"x_max\":644.5,\"ha\":703,\"o\":\"m 644 628 l 382 628 l 382 179 q 388 120 382 137 q 436 91 401 91 q 474 94 447 91 q 504 97 501 97 l 504 0 q 454 -9 482 -5 q 401 -14 426 -14 q 278 67 308 -14 q 260 233 260 118 l 260 628 l 0 628 l 0 739 l 644 739 l 644 628 \"},\"ξ\":{\"x_min\":0,\"x_max\":624.9375,\"ha\":699,\"o\":\"m 624 -37 q 608 -153 624 -96 q 563 -278 593 -211 l 454 -278 q 491 -183 486 -200 q 511 -83 511 -126 q 484 -23 511 -44 q 370 1 452 1 q 323 0 354 1 q 283 -1 293 -1 q 84 76 169 -1 q 0 266 0 154 q 56 431 0 358 q 197 538 108 498 q 94 613 134 562 q 54 730 54 665 q 77 823 54 780 q 143 901 101 867 l 27 901 l 27 1012 l 576 1012 l 576 901 l 380 901 q 244 863 303 901 q 178 745 178 820 q 312 600 178 636 q 532 582 380 582 l 532 479 q 276 455 361 479 q 118 281 118 410 q 165 173 118 217 q 274 120 208 133 q 494 101 384 110 q 624 -37 624 76 \"},\"&\":{\"x_min\":-3,\"x_max\":894.25,\"ha\":992,\"o\":\"m 894 0 l 725 0 l 624 123 q 471 0 553 40 q 306 -41 390 -41 q 168 -7 231 -41 q 62 92 105 26 q 14 187 31 139 q -3 276 -3 235 q 55 433 -3 358 q 248 581 114 508 q 170 689 196 640 q 137 817 137 751 q 214 985 137 922 q 384 1041 284 1041 q 548 988 483 1041 q 622 824 622 928 q 563 666 622 739 q 431 556 516 608 l 621 326 q 649 407 639 361 q 663 493 653 426 l 781 493 q 703 229 781 352 l 894 0 m 504 818 q 468 908 504 877 q 384 940 433 940 q 293 907 331 940 q 255 818 255 875 q 289 714 255 767 q 363 628 313 678 q 477 729 446 682 q 504 818 504 771 m 556 209 l 314 499 q 179 395 223 449 q 135 283 135 341 q 146 222 135 253 q 183 158 158 192 q 333 80 241 80 q 556 209 448 80 \"},\"Λ\":{\"x_min\":0,\"x_max\":862.5,\"ha\":942,\"o\":\"m 862 0 l 719 0 l 426 847 l 143 0 l 0 0 l 356 1013 l 501 1013 l 862 0 \"},\"I\":{\"x_min\":41,\"x_max\":180,\"ha\":293,\"o\":\"m 180 0 l 41 0 l 41 1013 l 180 1013 l 180 0 \"},\"G\":{\"x_min\":0,\"x_max\":921,\"ha\":1011,\"o\":\"m 921 0 l 832 0 l 801 136 q 655 15 741 58 q 470 -28 568 -28 q 126 133 259 -28 q 0 499 0 284 q 125 881 0 731 q 486 1043 259 1043 q 763 957 647 1043 q 905 709 890 864 l 772 709 q 668 866 747 807 q 486 926 589 926 q 228 795 322 926 q 142 507 142 677 q 228 224 142 342 q 483 94 323 94 q 712 195 625 94 q 796 435 796 291 l 477 435 l 477 549 l 921 549 l 921 0 \"},\"ΰ\":{\"x_min\":0,\"x_max\":617,\"ha\":725,\"o\":\"m 524 800 l 414 800 l 414 925 l 524 925 l 524 800 m 183 800 l 73 800 l 73 925 l 183 925 l 183 800 m 617 352 q 540 93 617 199 q 308 -24 455 -24 q 76 93 161 -24 q 0 352 0 199 l 0 738 l 126 738 l 126 354 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 354 492 257 l 492 738 l 617 738 l 617 352 m 489 1040 l 300 819 l 216 819 l 351 1040 l 489 1040 \"},\"`\":{\"x_min\":0,\"x_max\":138.890625,\"ha\":236,\"o\":\"m 138 699 l 0 699 l 0 861 q 36 974 0 929 q 138 1041 72 1020 l 138 977 q 82 931 95 969 q 69 839 69 893 l 138 839 l 138 699 \"},\"·\":{\"x_min\":0,\"x_max\":142,\"ha\":239,\"o\":\"m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 \"},\"Υ\":{\"x_min\":0.328125,\"x_max\":819.515625,\"ha\":889,\"o\":\"m 819 1013 l 482 416 l 482 0 l 342 0 l 342 416 l 0 1013 l 140 1013 l 411 533 l 679 1013 l 819 1013 \"},\"r\":{\"x_min\":0,\"x_max\":355.5625,\"ha\":432,\"o\":\"m 355 621 l 343 621 q 179 569 236 621 q 122 411 122 518 l 122 0 l 0 0 l 0 737 l 117 737 l 117 604 q 204 719 146 686 q 355 753 262 753 l 355 621 \"},\"x\":{\"x_min\":0,\"x_max\":675,\"ha\":764,\"o\":\"m 675 0 l 525 0 l 331 286 l 144 0 l 0 0 l 256 379 l 12 738 l 157 737 l 336 473 l 516 738 l 661 738 l 412 380 l 675 0 \"},\"μ\":{\"x_min\":0,\"x_max\":696.609375,\"ha\":747,\"o\":\"m 696 -4 q 628 -14 657 -14 q 498 97 513 -14 q 422 8 470 41 q 313 -24 374 -24 q 207 3 258 -24 q 120 80 157 31 l 120 -278 l 0 -278 l 0 738 l 124 738 l 124 343 q 165 172 124 246 q 308 82 216 82 q 451 177 402 82 q 492 358 492 254 l 492 738 l 616 738 l 616 214 q 623 136 616 160 q 673 92 636 92 q 696 95 684 92 l 696 -4 \"},\"h\":{\"x_min\":0,\"x_max\":615,\"ha\":724,\"o\":\"m 615 472 l 615 0 l 490 0 l 490 454 q 456 590 490 535 q 338 654 416 654 q 186 588 251 654 q 122 436 122 522 l 122 0 l 0 0 l 0 1013 l 122 1013 l 122 633 q 218 727 149 694 q 362 760 287 760 q 552 676 484 760 q 615 472 615 600 \"},\".\":{\"x_min\":0,\"x_max\":142,\"ha\":239,\"o\":\"m 142 0 l 0 0 l 0 151 l 142 151 l 142 0 \"},\"φ\":{\"x_min\":-2,\"x_max\":878,\"ha\":974,\"o\":\"m 496 -279 l 378 -279 l 378 -17 q 101 88 204 -17 q -2 367 -2 194 q 68 626 -2 510 q 283 758 151 758 l 283 646 q 167 537 209 626 q 133 373 133 462 q 192 177 133 254 q 378 93 259 93 l 378 758 q 445 764 426 763 q 476 765 464 765 q 765 659 653 765 q 878 377 878 553 q 771 96 878 209 q 496 -17 665 -17 l 496 -279 m 496 93 l 514 93 q 687 183 623 93 q 746 380 746 265 q 691 569 746 491 q 522 658 629 658 l 496 656 l 496 93 \"},\";\":{\"x_min\":0,\"x_max\":142,\"ha\":239,\"o\":\"m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 m 142 -12 q 105 -132 142 -82 q 0 -206 68 -182 l 0 -138 q 58 -82 43 -123 q 68 0 68 -56 l 0 0 l 0 151 l 142 151 l 142 -12 \"},\"f\":{\"x_min\":0,\"x_max\":378,\"ha\":472,\"o\":\"m 378 638 l 246 638 l 246 0 l 121 0 l 121 638 l 0 638 l 0 738 l 121 738 q 137 935 121 887 q 290 1028 171 1028 q 320 1027 305 1028 q 378 1021 334 1026 l 378 908 q 323 918 346 918 q 257 870 273 918 q 246 780 246 840 l 246 738 l 378 738 l 378 638 \"},\"“\":{\"x_min\":1,\"x_max\":348.21875,\"ha\":454,\"o\":\"m 140 670 l 1 670 l 1 830 q 37 943 1 897 q 140 1011 74 990 l 140 947 q 82 900 97 940 q 68 810 68 861 l 140 810 l 140 670 m 348 670 l 209 670 l 209 830 q 245 943 209 897 q 348 1011 282 990 l 348 947 q 290 900 305 940 q 276 810 276 861 l 348 810 l 348 670 \"},\"A\":{\"x_min\":0.03125,\"x_max\":906.953125,\"ha\":1008,\"o\":\"m 906 0 l 756 0 l 648 303 l 251 303 l 142 0 l 0 0 l 376 1013 l 529 1013 l 906 0 m 610 421 l 452 867 l 293 421 l 610 421 \"},\"6\":{\"x_min\":53,\"x_max\":739,\"ha\":792,\"o\":\"m 739 312 q 633 62 739 162 q 400 -31 534 -31 q 162 78 257 -31 q 53 439 53 206 q 178 859 53 712 q 441 986 284 986 q 643 912 559 986 q 732 713 732 833 l 601 713 q 544 830 594 786 q 426 875 494 875 q 268 793 331 875 q 193 517 193 697 q 301 597 240 570 q 427 624 362 624 q 643 540 552 624 q 739 312 739 451 m 603 298 q 540 461 603 400 q 404 516 484 516 q 268 461 323 516 q 207 300 207 401 q 269 137 207 198 q 405 83 325 83 q 541 137 486 83 q 603 298 603 197 \"},\"‘\":{\"x_min\":1,\"x_max\":139.890625,\"ha\":236,\"o\":\"m 139 670 l 1 670 l 1 830 q 37 943 1 897 q 139 1011 74 990 l 139 947 q 82 900 97 940 q 68 810 68 861 l 139 810 l 139 670 \"},\"ϊ\":{\"x_min\":-70,\"x_max\":283,\"ha\":361,\"o\":\"m 283 800 l 173 800 l 173 925 l 283 925 l 283 800 m 40 800 l -70 800 l -70 925 l 40 925 l 40 800 m 283 3 q 232 -10 257 -5 q 181 -15 206 -15 q 84 26 118 -15 q 41 200 41 79 l 41 737 l 166 737 l 167 215 q 171 141 167 157 q 225 101 182 101 q 247 103 238 101 q 283 112 256 104 l 283 3 \"},\"π\":{\"x_min\":-0.21875,\"x_max\":773.21875,\"ha\":857,\"o\":\"m 773 -7 l 707 -11 q 575 40 607 -11 q 552 174 552 77 l 552 226 l 552 626 l 222 626 l 222 0 l 97 0 l 97 626 l 0 626 l 0 737 l 773 737 l 773 626 l 676 626 l 676 171 q 695 103 676 117 q 773 90 714 90 l 773 -7 \"},\"ά\":{\"x_min\":0,\"x_max\":765.5625,\"ha\":809,\"o\":\"m 765 -4 q 698 -14 726 -14 q 564 97 586 -14 q 466 7 525 40 q 337 -26 407 -26 q 88 98 186 -26 q 0 369 0 212 q 88 637 0 525 q 337 760 184 760 q 465 727 407 760 q 563 637 524 695 l 563 738 l 685 738 l 685 222 q 693 141 685 168 q 748 94 708 94 q 765 95 760 94 l 765 -4 m 584 371 q 531 562 584 485 q 360 653 470 653 q 192 566 254 653 q 135 379 135 489 q 186 181 135 261 q 358 84 247 84 q 528 176 465 84 q 584 371 584 260 m 604 1040 l 415 819 l 332 819 l 466 1040 l 604 1040 \"},\"O\":{\"x_min\":0,\"x_max\":958,\"ha\":1057,\"o\":\"m 485 1041 q 834 882 702 1041 q 958 512 958 734 q 834 136 958 287 q 481 -26 702 -26 q 126 130 261 -26 q 0 504 0 279 q 127 880 0 728 q 485 1041 263 1041 m 480 98 q 731 225 638 98 q 815 504 815 340 q 733 783 815 669 q 480 912 640 912 q 226 784 321 912 q 142 504 142 670 q 226 224 142 339 q 480 98 319 98 \"},\"n\":{\"x_min\":0,\"x_max\":615,\"ha\":724,\"o\":\"m 615 463 l 615 0 l 490 0 l 490 454 q 453 592 490 537 q 331 656 410 656 q 178 585 240 656 q 117 421 117 514 l 117 0 l 0 0 l 0 738 l 117 738 l 117 630 q 218 728 150 693 q 359 764 286 764 q 552 675 484 764 q 615 463 615 593 \"},\"3\":{\"x_min\":54,\"x_max\":737,\"ha\":792,\"o\":\"m 737 284 q 635 55 737 141 q 399 -25 541 -25 q 156 52 248 -25 q 54 308 54 140 l 185 308 q 245 147 185 202 q 395 96 302 96 q 539 140 484 96 q 602 280 602 190 q 510 429 602 390 q 324 454 451 454 l 324 565 q 487 584 441 565 q 565 719 565 617 q 515 835 565 791 q 395 879 466 879 q 255 824 307 879 q 203 661 203 769 l 78 661 q 166 909 78 822 q 387 992 250 992 q 603 921 513 992 q 701 723 701 844 q 669 607 701 656 q 578 524 637 558 q 696 434 655 499 q 737 284 737 369 \"},\"9\":{\"x_min\":53,\"x_max\":739,\"ha\":792,\"o\":\"m 739 524 q 619 94 739 241 q 362 -32 516 -32 q 150 47 242 -32 q 59 244 59 126 l 191 244 q 246 129 191 176 q 373 82 301 82 q 526 161 466 82 q 597 440 597 255 q 363 334 501 334 q 130 432 216 334 q 53 650 53 521 q 134 880 53 786 q 383 986 226 986 q 659 841 566 986 q 739 524 739 719 m 388 449 q 535 514 480 449 q 585 658 585 573 q 535 805 585 744 q 388 873 480 873 q 242 809 294 873 q 191 658 191 745 q 239 514 191 572 q 388 449 292 449 \"},\"l\":{\"x_min\":41,\"x_max\":166,\"ha\":279,\"o\":\"m 166 0 l 41 0 l 41 1013 l 166 1013 l 166 0 \"},\"¤\":{\"x_min\":40.09375,\"x_max\":728.796875,\"ha\":825,\"o\":\"m 728 304 l 649 224 l 512 363 q 383 331 458 331 q 256 363 310 331 l 119 224 l 40 304 l 177 441 q 150 553 150 493 q 184 673 150 621 l 40 818 l 119 898 l 267 749 q 321 766 291 759 q 384 773 351 773 q 447 766 417 773 q 501 749 477 759 l 649 898 l 728 818 l 585 675 q 612 618 604 648 q 621 553 621 587 q 591 441 621 491 l 728 304 m 384 682 q 280 643 318 682 q 243 551 243 604 q 279 461 243 499 q 383 423 316 423 q 487 461 449 423 q 525 553 525 500 q 490 641 525 605 q 384 682 451 682 \"},\"κ\":{\"x_min\":0,\"x_max\":632.328125,\"ha\":679,\"o\":\"m 632 0 l 482 0 l 225 384 l 124 288 l 124 0 l 0 0 l 0 738 l 124 738 l 124 446 l 433 738 l 596 738 l 312 466 l 632 0 \"},\"4\":{\"x_min\":48,\"x_max\":742.453125,\"ha\":792,\"o\":\"m 742 243 l 602 243 l 602 0 l 476 0 l 476 243 l 48 243 l 48 368 l 476 958 l 602 958 l 602 354 l 742 354 l 742 243 m 476 354 l 476 792 l 162 354 l 476 354 \"},\"p\":{\"x_min\":0,\"x_max\":685,\"ha\":786,\"o\":\"m 685 364 q 598 96 685 205 q 350 -23 504 -23 q 121 89 205 -23 l 121 -278 l 0 -278 l 0 738 l 121 738 l 121 633 q 220 726 159 691 q 351 761 280 761 q 598 636 504 761 q 685 364 685 522 m 557 371 q 501 560 557 481 q 330 651 437 651 q 162 559 223 651 q 108 366 108 479 q 162 177 108 254 q 333 87 224 87 q 502 178 441 87 q 557 371 557 258 \"},\"‡\":{\"x_min\":0,\"x_max\":777,\"ha\":835,\"o\":\"m 458 238 l 458 0 l 319 0 l 319 238 l 0 238 l 0 360 l 319 360 l 319 681 l 0 683 l 0 804 l 319 804 l 319 1015 l 458 1013 l 458 804 l 777 804 l 777 683 l 458 683 l 458 360 l 777 360 l 777 238 l 458 238 \"},\"ψ\":{\"x_min\":0,\"x_max\":808,\"ha\":907,\"o\":\"m 465 -278 l 341 -278 l 341 -15 q 87 102 180 -15 q 0 378 0 210 l 0 739 l 133 739 l 133 379 q 182 195 133 275 q 341 98 242 98 l 341 922 l 465 922 l 465 98 q 623 195 563 98 q 675 382 675 278 l 675 742 l 808 742 l 808 381 q 720 104 808 213 q 466 -13 627 -13 l 465 -278 \"},\"η\":{\"x_min\":0.78125,\"x_max\":697,\"ha\":810,\"o\":\"m 697 -278 l 572 -278 l 572 454 q 540 587 572 536 q 425 650 501 650 q 271 579 337 650 q 206 420 206 509 l 206 0 l 81 0 l 81 489 q 73 588 81 562 q 0 644 56 644 l 0 741 q 68 755 38 755 q 158 720 124 755 q 200 630 193 686 q 297 726 234 692 q 434 761 359 761 q 620 692 544 761 q 697 516 697 624 l 697 -278 \"}}"),
	cssFontWeight: "normal",
	ascender: 1189,
	underlinePosition: -100,
	cssFontStyle: "normal",
	boundingBox: {
		yMin: -334,
		xMin: -111,
		yMax: 1189,
		xMax: 1672
	},
	resolution: 1e3,
	original_font_information: {
		postscript_name: "Helvetiker-Regular",
		version_string: "Version 1.00 2004 initial release",
		vendor_url: "http://www.magenta.gr/",
		full_font_name: "Helvetiker",
		font_family_name: "Helvetiker",
		copyright: "Copyright (c) Μagenta ltd, 2004",
		description: "",
		trademark: "",
		designer: "",
		designer_url: "",
		unique_font_identifier: "Μagenta ltd:Helvetiker:22-10-104",
		license_url: "http://www.ellak.gr/fonts/MgOpen/license.html",
		license_description: "Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license (\"Fonts\") and associated documentation files (the \"Font Software\"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word \"MgOpen\", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the \"MgOpen\" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.",
		manufacturer_name: "Μagenta ltd",
		font_sub_family_name: "Regular"
	},
	descender: -334,
	familyName: "Helvetiker",
	lineHeight: 1522,
	underlineThickness: 50
}, Et = "\n  <svg width=\"31\" height=\"20\" viewBox=\"0 0 31 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n    <g filter=\"url(#filter0_d)\">\n      <path d=\"M12.624 3.97512C14.1964 2.34857 16.8036 2.34858 18.376 3.97512L26.723 12.61C27.95 13.8793 27.0505 16 25.285 16L5.71502 16C3.94951 16 3.04997 13.8793 4.27704 12.61L12.624 3.97512Z\" fill=\"white\"/>\n      <path d=\"M18.0165 4.32264L26.3635 12.9575C27.2838 13.9095 26.6091 15.5 25.285 15.5L5.71502 15.5C4.39088 15.5 3.71623 13.9095 4.63654 12.9575L12.9835 4.32263C14.3593 2.8994 16.6407 2.8994 18.0165 4.32264Z\" stroke=\"black\" stroke-opacity=\"0.28\"/>\n    </g>\n    <defs>\n      <filter id=\"filter0_d\" x=\"0.711029\" y=\"0.755211\" width=\"29.5779\" height=\"19.2448\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\">\n        <feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/>\n        <feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/>\n        <feOffset dy=\"1\"/>\n        <feGaussianBlur stdDeviation=\"1.5\"/>\n        <feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0\"/>\n        <feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow\"/>\n        <feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow\" result=\"shape\"/>\n      </filter>\n    </defs>\n  </svg>", Dt = "data:image/svg+xml,%3csvg%20width='46'%20height='28'%20viewBox='0%200%2046%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20filter='url(%23filter0_d)'%3e%3cmask%20id='path-1-inside-1'%20fill='white'%3e%3cpath%20d='M15.7229%202.90861V8.05168C25.5221%208.3455%2035.7273%2010.7305%2043%2017.3698L36.2468%2023.7279C30.013%2019.4611%2025.3377%2017.3698%2015.7186%2017.3698V23.0945C15.7186%2023.461%2015.4754%2023.7916%2015.1128%2023.9231C14.7501%2024.0745%2014.3362%2023.9988%2014.0589%2023.7279L3.28535%2013.6489C2.9056%2013.2983%202.9056%2012.7247%203.28108%2012.3741L14.0546%202.26324C14.3405%202.00827%2014.7586%201.9286%2015.117%202.06803C15.484%202.20746%2015.7229%202.53812%2015.7229%202.90861Z'/%3e%3c/mask%3e%3cpath%20d='M15.7229%202.90861V8.05168C25.5221%208.3455%2035.7273%2010.7305%2043%2017.3698L36.2468%2023.7279C30.013%2019.4611%2025.3377%2017.3698%2015.7186%2017.3698V23.0945C15.7186%2023.461%2015.4754%2023.7916%2015.1128%2023.9231C14.7501%2024.0745%2014.3362%2023.9988%2014.0589%2023.7279L3.28535%2013.6489C2.9056%2013.2983%202.9056%2012.7247%203.28108%2012.3741L14.0546%202.26324C14.3405%202.00827%2014.7586%201.9286%2015.117%202.06803C15.484%202.20746%2015.7229%202.53812%2015.7229%202.90861Z'%20fill='white'/%3e%3cpath%20d='M15.7229%202.90861V8.05168C25.5221%208.3455%2035.7273%2010.7305%2043%2017.3698L36.2468%2023.7279C30.013%2019.4611%2025.3377%2017.3698%2015.7186%2017.3698V23.0945C15.7186%2023.461%2015.4754%2023.7916%2015.1128%2023.9231C14.7501%2024.0745%2014.3362%2023.9988%2014.0589%2023.7279L3.28535%2013.6489C2.9056%2013.2983%202.9056%2012.7247%203.28108%2012.3741L14.0546%202.26324C14.3405%202.00827%2014.7586%201.9286%2015.117%202.06803C15.484%202.20746%2015.7229%202.53812%2015.7229%202.90861Z'%20stroke='black'%20stroke-opacity='0.28'%20stroke-width='2'%20mask='url(%23path-1-inside-1)'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_d'%20x='0'%20y='0'%20width='46'%20height='28'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'/%3e%3cfeOffset%20dy='1'/%3e%3cfeGaussianBlur%20stdDeviation='1.5'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.2%200'/%3e%3cfeBlend%20mode='normal'%20in2='BackgroundImageFix'%20result='effect1_dropShadow'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_dropShadow'%20result='shape'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e", Ot = "data:image/svg+xml,%3csvg%20width='28'%20height='46'%20viewBox='0%200%2028%2046'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20filter='url(%23filter0_d)'%3e%3cpath%20d='M24.0914%2029.2771H18.9483C18.6545%2019.4779%2016.2695%209.27273%209.63024%202L3.27212%208.75325C7.53891%2014.987%209.63024%2019.6623%209.63024%2029.2814H3.90554C3.53903%2029.2814%203.20838%2029.5246%203.07692%2029.8872C2.92553%2030.2499%203.00122%2030.6638%203.27212%2030.9411L13.3511%2041.7147C13.7017%2042.0944%2014.2753%2042.0944%2014.6259%2041.7189L24.7368%2030.9454C24.9917%2030.6595%2025.0714%2030.2414%2024.932%2029.883C24.7925%2029.516%2024.4619%2029.2771%2024.0914%2029.2771Z'%20fill='white'/%3e%3cpath%20d='M18.4485%2029.2921L18.4631%2029.7771H18.9483H24.0914C24.2375%2029.7771%2024.3927%2029.8715%2024.4646%2030.0606L24.4646%2030.0606L24.466%2030.0643C24.5353%2030.2423%2024.4967%2030.4602%2024.3671%2030.6086L14.2613%2041.3768L14.2604%2041.3777C14.108%2041.541%2013.8715%2041.5412%2013.7185%2041.3755L13.7162%2041.3731L3.63725%2030.5995L3.63733%2030.5995L3.6298%2030.5917C3.50274%2030.4617%203.46217%2030.2623%203.53833%2030.0798L3.54292%2030.0688L3.54699%2030.0576C3.61255%2029.8768%203.76603%2029.7814%203.90554%2029.7814H9.63024H10.1302V29.2814C10.1302%2024.4348%209.60333%2020.8045%208.5253%2017.5889C7.48606%2014.489%205.94327%2011.801%203.91143%208.80362L9.62101%202.73922C15.8721%209.85777%2018.1618%2019.729%2018.4485%2029.2921Z'%20stroke='black'%20stroke-opacity='0.28'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_d'%20x='0'%20y='0'%20width='28'%20height='46'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'/%3e%3cfeOffset%20dy='1'/%3e%3cfeGaussianBlur%20stdDeviation='1.5'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.2%200'/%3e%3cfeBlend%20mode='normal'%20in2='BackgroundImageFix'%20result='effect1_dropShadow'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_dropShadow'%20result='shape'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e", kt = /* @__PURE__ */ function(e) {
	return e.TOP = "top", e.BOTTOM = "bottom", e.LEFT = "left", e.RIGHT = "right", e.FRONT = "front", e.BACK = "back", e.TOP_FROM_FRONT = "top-from-front", e.TOP_FROM_RIGHT = "top-from-right", e.TOP_FROM_BACK = "top-from-back", e.TOP_FROM_LEFT = "top-from-left", e.BOTTOM_FROM_FRONT = "bottom-from-front", e.BOTTOM_FROM_RIGHT = "bottom-from-right", e.BOTTOM_FROM_BACK = "bottom-from-back", e.BOTTOM_FROM_LEFT = "bottom-from-left", e;
}({}), At = {
	right: new u.Vector3(1, 0, 0),
	left: new u.Vector3(-1, 0, 0),
	back: new u.Vector3(0, 1, 0),
	front: new u.Vector3(0, -1, 0),
	top: new u.Vector3(0, 0, 1),
	bottom: new u.Vector3(0, 0, -1),
	"top-from-front": new u.Vector3(0, 0, 1),
	"top-from-right": new u.Vector3(0, 0, 1),
	"top-from-back": new u.Vector3(0, 0, 1),
	"top-from-left": new u.Vector3(0, 0, 1),
	"bottom-from-front": new u.Vector3(0, 0, -1),
	"bottom-from-right": new u.Vector3(0, 0, -1),
	"bottom-from-back": new u.Vector3(0, 0, -1),
	"bottom-from-left": new u.Vector3(0, 0, -1)
}, jt = {
	right: new u.Quaternion(.5, .5, .5, .5),
	left: new u.Quaternion(-.5, .5, .5, -.5),
	back: new u.Quaternion(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0),
	front: new u.Quaternion(Math.sqrt(2) / 2, 0, 0, Math.sqrt(2) / 2),
	top: new u.Quaternion(0, 0, 0, 1),
	bottom: new u.Quaternion(1, 0, 0, 0),
	"top-from-front": new u.Quaternion(0, 0, 0, 1),
	"top-from-right": new u.Quaternion(0, 0, Math.sqrt(2) / 2, Math.sqrt(2) / 2),
	"top-from-back": new u.Quaternion(0, 0, 1, 0),
	"top-from-left": new u.Quaternion(0, 0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2),
	"bottom-from-front": new u.Quaternion(1, 0, 0, 0),
	"bottom-from-right": new u.Quaternion(Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0, 0),
	"bottom-from-back": new u.Quaternion(0, 1, 0, 0),
	"bottom-from-left": new u.Quaternion(Math.sqrt(2) / 2, -Math.sqrt(2) / 2, 0, 0)
}, Mt = class {
	width;
	height;
	pickHelper;
	scene;
	camera;
	cube;
	element;
	pointLight;
	ambientLight;
	renderer;
	font;
	fontMaterial;
	edges;
	fontMeshes;
	surfaceMeshes;
	pickPosition;
	raycaster;
	_hoveredPlane;
	shouldRender;
	cameraDistance;
	clickListeners;
	_axis;
	helperArrows;
	constructor(e, t) {
		this.width = t && t.width || 180, this.height = t && t.height || 180, this.clickListeners = /* @__PURE__ */ new Map(), this._axis = t && t.axis || "none", this.cameraDistance = 20, this.scene = new u.Scene(), this.pickPosition = new u.Vector2(0, 0), this.raycaster = new u.Raycaster(), this.camera = new u.PerspectiveCamera(7.5, 1, .01, 50), this.camera.up.set(0, 0, 1), this.camera.position.set(0, -this.cameraDistance, 0), this.camera.lookAt(new u.Vector3(0, 0, 0));
		let n = document.querySelector(e);
		n || (n = document.createElement("div"), document.appendChild(n)), this.element = n, this.element.setAttribute("style", `
      width: ${this.width}px;
      height: ${this.height}px;
      left: calc(100% - .5em - ${this.width}px);
    `), this.element.setAttribute("class", "orientation_control");
		let r = document.createElement("canvas");
		r.setAttribute("width", this.width.toString()), r.setAttribute("height", this.height.toString()), this.element.appendChild(r);
		let i = 1 / 2, a = [
			[
				-.5,
				-.5,
				-.5
			],
			[
				.5,
				-.5,
				-.5
			],
			[
				.5,
				.5,
				-.5
			],
			[
				-.5,
				.5,
				-.5
			],
			[
				-.5,
				-.5,
				.5
			],
			[
				.5,
				-.5,
				.5
			],
			[
				.5,
				.5,
				.5
			],
			[
				-.5,
				.5,
				.5
			]
		], o = [
			a[0],
			a[1],
			a[1],
			a[2],
			a[2],
			a[3],
			a[3],
			a[0],
			a[4],
			a[5],
			a[5],
			a[6],
			a[6],
			a[7],
			a[7],
			a[4],
			a[0],
			a[4],
			a[1],
			a[5],
			a[2],
			a[6],
			a[3],
			a[7]
		], s = new u.BufferGeometry(), c = new u.Float32BufferAttribute(new Float32Array(o.flat()), 3);
		s.setAttribute("position", c);
		let l = new u.LineDashedMaterial({
			color: 2631977,
			transparent: !0,
			opacity: .5,
			premultipliedAlpha: !0,
			blending: u.NormalBlending,
			depthFunc: u.AlwaysDepth
		});
		this.edges = new u.LineSegments(s, l), this.scene.add(this.edges), this.font = new St(Tt), this.fontMaterial = new u.MeshBasicMaterial({
			color: 0,
			transparent: !0,
			opacity: .75,
			side: u.FrontSide
		}), this.fontMeshes = {
			top: this.getMeshFromText("TOP"),
			bottom: this.getMeshFromText("BOTTOM"),
			left: this.getMeshFromText("LEFT"),
			right: this.getMeshFromText("RIGHT"),
			front: this.getMeshFromText("FRONT"),
			back: this.getMeshFromText("BACK")
		}, this.fontMeshes.top.position.setZ(.51), this.fontMeshes.bottom.rotateX(Math.PI), this.fontMeshes.bottom.position.setZ(-.51), this.fontMeshes.front.rotateX(Math.PI / 2), this.fontMeshes.front.position.setY(-.51), this.fontMeshes.back.rotateX(Math.PI / 2), this.fontMeshes.back.rotateY(Math.PI), this.fontMeshes.back.position.setY(.51), this.fontMeshes.left.rotateX(Math.PI / 2), this.fontMeshes.left.rotateY(-Math.PI / 2), this.fontMeshes.left.position.setX(-.51), this.fontMeshes.right.rotateX(Math.PI / 2), this.fontMeshes.right.rotateY(Math.PI / 2), this.fontMeshes.right.position.setX(.51), this.scene.add(this.fontMeshes.top), this.scene.add(this.fontMeshes.bottom), this.scene.add(this.fontMeshes.left), this.scene.add(this.fontMeshes.right), this.scene.add(this.fontMeshes.front), this.scene.add(this.fontMeshes.back);
		let d = {
			color: 16777215,
			transparent: !0,
			side: u.FrontSide,
			opacity: .75
		};
		this.surfaceMeshes = {
			top: this.createPlaneMesh(1, d),
			bottom: this.createPlaneMesh(1, d),
			left: this.createPlaneMesh(1, d),
			right: this.createPlaneMesh(1, d),
			front: this.createPlaneMesh(1, d),
			back: this.createPlaneMesh(1, d)
		}, this.surfaceMeshes.top.position.setZ(i), this.surfaceMeshes.top.name = "TOP", this.surfaceMeshes.bottom.rotateX(Math.PI), this.surfaceMeshes.bottom.position.setZ(-.5), this.surfaceMeshes.bottom.name = "BOTTOM", this.surfaceMeshes.front.rotateX(Math.PI / 2), this.surfaceMeshes.front.position.setY(-.5), this.surfaceMeshes.front.name = "FRONT", this.surfaceMeshes.back.rotateX(Math.PI / 2), this.surfaceMeshes.back.rotateY(Math.PI), this.surfaceMeshes.back.position.setY(i), this.surfaceMeshes.back.name = "BACK", this.surfaceMeshes.left.rotateX(Math.PI / 2), this.surfaceMeshes.left.rotateY(-Math.PI / 2), this.surfaceMeshes.left.position.setX(-.5), this.surfaceMeshes.left.name = "LEFT", this.surfaceMeshes.right.rotateX(Math.PI / 2), this.surfaceMeshes.right.rotateY(Math.PI / 2), this.surfaceMeshes.right.position.setX(i), this.surfaceMeshes.right.name = "RIGHT", this.cube = new Z("cube"), this.cube.add(this.surfaceMeshes.top), this.cube.add(this.surfaceMeshes.bottom), this.cube.add(this.surfaceMeshes.left), this.cube.add(this.surfaceMeshes.right), this.cube.add(this.surfaceMeshes.front), this.cube.add(this.surfaceMeshes.back), this.scene.add(this.cube), this.pointLight = new u.PointLight(16777215, .5), this.pointLight.position.set(0, -5, 0), this.scene.add(this.pointLight), this.ambientLight = new u.AmbientLight(16777215, .5), this.scene.add(this.ambientLight), this.renderer = new u.WebGLRenderer({
			alpha: !0,
			antialias: !0,
			canvas: r
		}), this.renderer.setPixelRatio(window.devicePixelRatio), this.renderer.setSize(this.width, this.height), this.pickHelper = new _t(this.scene, this.camera, this.renderer.domElement), this._hoveredPlane = void 0, this.renderer.domElement.addEventListener("mousemove", (e) => {
			this.setPickPosition(e, this.renderer.domElement), this.raycaster.setFromCamera(this.pickPosition, this.camera);
			let t = this.raycaster.intersectObjects([this.cube], !0);
			this.hoveredPlane = t.length ? t[0].object : void 0, this.shouldRender = !0;
		}), this.renderer.domElement.addEventListener("mousedown", (e) => {
			if (this.hoveredPlane) {
				let e = kt[this.hoveredPlane.name];
				e && this.clickListeners.forEach((t) => {
					t({ target: e });
				});
			}
		}), this.helperArrows = {
			top: document.createElement("div"),
			bottom: document.createElement("div"),
			left: document.createElement("div"),
			right: document.createElement("div"),
			rotateLeft: document.createElement("div"),
			rotateRight: document.createElement("div")
		}, this.element.appendChild(this.helperArrows.top), this.element.appendChild(this.helperArrows.bottom), this.element.appendChild(this.helperArrows.left), this.element.appendChild(this.helperArrows.right), this.element.appendChild(this.helperArrows.rotateLeft), this.element.appendChild(this.helperArrows.rotateRight);
		let f = (e) => {
			if (this.hoveredPlane = void 0, e.target) {
				let t = e.target.querySelector("path");
				t && t.setAttribute("fill", "#BFDEFD");
			}
			this.shouldRender = !0;
		}, p = (e) => {
			if (e.target) {
				let t = e.target.querySelector("path");
				t && t.setAttribute("fill", "#ffffff");
			}
		}, m = (e) => {
			this.clickListeners.forEach((t) => t({ target: e }));
		}, h = (e) => {
			if (e.target) {
				let t = e.target.parentElement;
				for (; t.tagName !== "DIV";) t = t.parentElement;
				let n = t;
				if (this.axis !== "none") switch (this.axis) {
					case "top":
						switch (n.id) {
							case "helper-arrow-top":
								m("back");
								break;
							case "helper-arrow-bottom":
								m("front");
								break;
							case "helper-arrow-left":
								m("left");
								break;
							case "helper-arrow-right":
								m("right");
								break;
							case "helper-arrow-rotate-right":
								m("top-from-right");
								break;
							case "helper-arrow-rotate-left": m("top-from-left");
						}
						break;
					case "bottom":
						switch (n.id) {
							case "helper-arrow-top":
								m("front");
								break;
							case "helper-arrow-bottom":
								m("back");
								break;
							case "helper-arrow-left":
								m("left");
								break;
							case "helper-arrow-right":
								m("right");
								break;
							case "helper-arrow-rotate-right":
								m("bottom-from-left");
								break;
							case "helper-arrow-rotate-left": m("bottom-from-right");
						}
						break;
					case "right":
						switch (n.id) {
							case "helper-arrow-top":
								m("top-from-right");
								break;
							case "helper-arrow-bottom":
								m("bottom-from-right");
								break;
							case "helper-arrow-left":
								m("front");
								break;
							case "helper-arrow-right": m("back");
						}
						break;
					case "left":
						switch (n.id) {
							case "helper-arrow-top":
								m("top-from-left");
								break;
							case "helper-arrow-bottom":
								m("bottom-from-left");
								break;
							case "helper-arrow-left":
								m("back");
								break;
							case "helper-arrow-right": m("front");
						}
						break;
					case "front":
						switch (n.id) {
							case "helper-arrow-top":
								m("top");
								break;
							case "helper-arrow-bottom":
								m("bottom");
								break;
							case "helper-arrow-left":
								m("left");
								break;
							case "helper-arrow-right": m("right");
						}
						break;
					case "back":
						switch (n.id) {
							case "helper-arrow-top":
								m("top-from-back");
								break;
							case "helper-arrow-bottom":
								m("bottom-from-back");
								break;
							case "helper-arrow-left":
								m("right");
								break;
							case "helper-arrow-right": m("left");
						}
						break;
					case "top-from-back":
						switch (n.id) {
							case "helper-arrow-top":
								m("front");
								break;
							case "helper-arrow-bottom":
								m("back");
								break;
							case "helper-arrow-left":
								m("right");
								break;
							case "helper-arrow-right":
								m("left");
								break;
							case "helper-arrow-rotate-right":
								m("top-from-left");
								break;
							case "helper-arrow-rotate-left": m("top-from-right");
						}
						break;
					case "top-from-front":
						switch (n.id) {
							case "helper-arrow-top":
								m("back");
								break;
							case "helper-arrow-bottom":
								m("front");
								break;
							case "helper-arrow-left":
								m("left");
								break;
							case "helper-arrow-right":
								m("right");
								break;
							case "helper-arrow-rotate-right":
								m("top-from-left");
								break;
							case "helper-arrow-rotate-left": m("top-from-right");
						}
						break;
					case "top-from-left":
						switch (n.id) {
							case "helper-arrow-top":
								m("right");
								break;
							case "helper-arrow-bottom":
								m("left");
								break;
							case "helper-arrow-left":
								m("back");
								break;
							case "helper-arrow-right":
								m("front");
								break;
							case "helper-arrow-rotate-right":
								m("top");
								break;
							case "helper-arrow-rotate-left": m("top-from-back");
						}
						break;
					case "top-from-right":
						switch (n.id) {
							case "helper-arrow-top":
								m("left");
								break;
							case "helper-arrow-bottom":
								m("right");
								break;
							case "helper-arrow-left":
								m("front");
								break;
							case "helper-arrow-right":
								m("back");
								break;
							case "helper-arrow-rotate-right":
								m("top-from-back");
								break;
							case "helper-arrow-rotate-left": m("top");
						}
						break;
					case "bottom-from-back":
						switch (n.id) {
							case "helper-arrow-top":
								m("back");
								break;
							case "helper-arrow-bottom":
								m("front");
								break;
							case "helper-arrow-left":
								m("right");
								break;
							case "helper-arrow-right":
								m("left");
								break;
							case "helper-arrow-rotate-right":
								m("bottom-from-right");
								break;
							case "helper-arrow-rotate-left": m("bottom-from-left");
						}
						break;
					case "bottom-from-front":
						switch (n.id) {
							case "helper-arrow-top":
								m("front");
								break;
							case "helper-arrow-bottom":
								m("back");
								break;
							case "helper-arrow-left":
								m("left");
								break;
							case "helper-arrow-right":
								m("right");
								break;
							case "helper-arrow-rotate-right":
								m("bottom-from-left");
								break;
							case "helper-arrow-rotate-left": m("bottom-from-right");
						}
						break;
					case "bottom-from-left":
						switch (n.id) {
							case "helper-arrow-top":
								m("left");
								break;
							case "helper-arrow-bottom":
								m("right");
								break;
							case "helper-arrow-left":
								m("back");
								break;
							case "helper-arrow-right":
								m("front");
								break;
							case "helper-arrow-rotate-right":
								m("bottom-from-back");
								break;
							case "helper-arrow-rotate-left": m("bottom");
						}
						break;
					case "bottom-from-right":
						switch (n.id) {
							case "helper-arrow-top":
								m("right");
								break;
							case "helper-arrow-bottom":
								m("left");
								break;
							case "helper-arrow-left":
								m("front");
								break;
							case "helper-arrow-right":
								m("back");
								break;
							case "helper-arrow-rotate-right":
								m("bottom");
								break;
							case "helper-arrow-rotate-left": m("bottom-from-back");
						}
						break;
					default: console.log(this.axis);
				}
			}
		};
		this.helperArrows.top.setAttribute("id", "helper-arrow-top"), this.helperArrows.top.setAttribute("class", "helper-arrow"), this.helperArrows.top.innerHTML = Et, this.helperArrows.top.addEventListener("mouseenter", f), this.helperArrows.top.addEventListener("mouseleave", p), this.helperArrows.top.addEventListener("mousedown", h), this.helperArrows.bottom.setAttribute("id", "helper-arrow-bottom"), this.helperArrows.bottom.setAttribute("class", "helper-arrow"), this.helperArrows.bottom.innerHTML = Et, this.helperArrows.bottom.addEventListener("mouseenter", f), this.helperArrows.bottom.addEventListener("mouseleave", p), this.helperArrows.bottom.addEventListener("mousedown", h), this.helperArrows.left.setAttribute("id", "helper-arrow-left"), this.helperArrows.left.setAttribute("class", "helper-arrow"), this.helperArrows.left.innerHTML = Et, this.helperArrows.left.addEventListener("mouseenter", f), this.helperArrows.left.addEventListener("mouseleave", p), this.helperArrows.left.addEventListener("mousedown", h), this.helperArrows.right.setAttribute("id", "helper-arrow-right"), this.helperArrows.right.setAttribute("class", "helper-arrow"), this.helperArrows.right.innerHTML = Et, this.helperArrows.right.addEventListener("mouseenter", f), this.helperArrows.right.addEventListener("mouseleave", p), this.helperArrows.right.addEventListener("mousedown", h), this.helperArrows.rotateLeft.setAttribute("id", "helper-arrow-rotate-left"), this.helperArrows.rotateLeft.setAttribute("class", "helper-arrow"), this.helperArrows.rotateLeft.innerHTML = `<img src="${Dt}"/>`, this.helperArrows.rotateLeft.addEventListener("mouseenter", f), this.helperArrows.rotateLeft.addEventListener("mouseleave", p), this.helperArrows.rotateLeft.addEventListener("mousedown", h), this.helperArrows.rotateRight.setAttribute("id", "helper-arrow-rotate-right"), this.helperArrows.rotateRight.setAttribute("class", "helper-arrow"), this.helperArrows.rotateRight.innerHTML = `<img src="${Ot}"/>`, this.helperArrows.rotateRight.addEventListener("mouseenter", f), this.helperArrows.rotateRight.addEventListener("mouseleave", p), this.helperArrows.rotateRight.addEventListener("mousedown", h), this.hideHelperArrows(), this.axis = t && t.axis || "none", this.shouldRender = !0;
	}
	setCameraTransforms(e, t) {
		this.camera.quaternion.copy(t), this.camera.position.set(e.x, e.y, e.z), this.pointLight.position.set(e.x, e.y, e.z), this.camera.updateProjectionMatrix();
	}
	showHelperArrows(e) {
		Object.keys(this.helperArrows).forEach((t) => {
			e.includes(t) ? this.helperArrows[t].classList.contains("helper-arrow-hidden") && this.helperArrows[t].classList.remove("helper-arrow-hidden") : this.helperArrows[t].classList.contains("helper-arrow-hidden") || this.helperArrows[t].classList.add("helper-arrow-hidden");
		});
	}
	hideHelperArrows() {
		Object.keys(this.helperArrows).forEach((e) => {
			this.helperArrows[e].classList.contains("helper-arrow-hidden") || this.helperArrows[e].classList.add("helper-arrow-hidden");
		});
	}
	hide() {
		this.element.classList.contains("orientation_control-hidden") || this.element.classList.add("orientation_control-hidden");
	}
	show() {
		this.element.classList.contains("orientation_control-hidden") && this.element.classList.remove("orientation_control-hidden");
	}
	addClickListener(t) {
		let n = e();
		return this.clickListeners.set(n, t), n;
	}
	removeClickListener(e) {
		this.clickListeners.has(e) && this.clickListeners.delete(e);
	}
	createPlaneMesh(e, t) {
		let n = new u.Mesh(new u.PlaneGeometry(e, e), new u.MeshLambertMaterial(t));
		return n.userData.selectedColor = 12574461, n.userData.normalColor = t.color || 16777215, n;
	}
	getMeshFromText(e) {
		let t = this.font.generateShapes(e, .125), n = new u.ShapeGeometry(t);
		n.computeBoundingBox();
		let r = n.boundingBox;
		if (r) {
			let e = -.5 * (r.max.x - r.min.x), t = -.5 * (r.max.y - r.min.y);
			n.translate(e, t, 0);
		}
		return new u.Mesh(n, this.fontMaterial);
	}
	setPickPosition(e, t) {
		let n = this.getCanvasRelativePosition(e, t);
		this.pickPosition.x = n.x / t.clientWidth * 2 - 1, this.pickPosition.y = n.y / t.clientHeight * -2 + 1;
	}
	setPickPositionCenter(e) {
		let t = {
			x: e.clientWidth / 2,
			y: e.clientHeight / 2
		};
		this.pickPosition.x = t.x / e.clientWidth * 2 - 1, this.pickPosition.y = t.y / e.clientHeight * -2 + 1;
	}
	getCanvasRelativePosition(e, t) {
		let n = t.getBoundingClientRect();
		return {
			x: e.clientX - n.left,
			y: e.clientY - n.top
		};
	}
	clearPickPosition() {
		this.pickPosition.x = -1e5, this.pickPosition.y = -1e5;
	}
	save() {
		return {
			axis: this.axis,
			width: this.width,
			height: this.height
		};
	}
	render() {
		this.shouldRender &&= (this.renderer.render(this.scene, this.camera), !1);
	}
	get axis() {
		return this._axis;
	}
	set axis(e) {
		e === "none" ? this._axis !== "none" && this.hideHelperArrows() : e === "top" || e === "top-from-back" || e === "top-from-front" || e === "top-from-left" || e === "top-from-right" || e === "bottom" || e === "bottom-from-back" || e === "bottom-from-front" || e === "bottom-from-left" || e === "bottom-from-right" ? this.showHelperArrows([
			"top",
			"bottom",
			"left",
			"right",
			"rotateLeft",
			"rotateRight"
		]) : this.showHelperArrows([
			"top",
			"bottom",
			"left",
			"right"
		]), this._axis = e;
	}
	get hoveredPlane() {
		return this._hoveredPlane;
	}
	set hoveredPlane(e) {
		this._hoveredPlane && this._hoveredPlane.material.color.set(this._hoveredPlane.userData.normalColor), e && e.material.color.set(e.userData.selectedColor), this._hoveredPlane = e;
	}
}, Nt = class extends Z {
	sprite;
	constructor() {
		super("cursor");
		let e = new u.SpriteMaterial({
			sizeAttenuation: !1,
			side: u.DoubleSide,
			map: at,
			depthTest: !1,
			fog: !1,
			name: "cursor-material",
			transparent: !0,
			blending: u.MultiplyBlending,
			premultipliedAlpha: !0,
			polygonOffset: !0,
			polygonOffsetFactor: .01
		});
		this.sprite = new u.Sprite(e), this.sprite.scale.setScalar(.045), this.sprite.renderOrder = .1, this.add(this.sprite);
	}
}, Pt = .003, Ft = class e {
	state = null;
	canvas;
	_renderer;
	yaw = 0;
	pitch = 0;
	dragging = !1;
	lastMouseX = 0;
	lastMouseY = 0;
	lastUIUpdate = 0;
	onMouseDown = null;
	onMouseMove = null;
	onMouseUp = null;
	onContextMenu = null;
	propertyUnsubs = [];
	orbitButton = null;
	constructor(e, t) {
		this.canvas = e, this._renderer = t;
	}
	get active() {
		return this.state !== null;
	}
	enter(e) {
		if (this.active) return;
		let t = this._renderer;
		if (t.isPerformingOperation || t.isOrtho || t.currentlyMovingObjects) return;
		let n = o.getState().containers[e];
		if (!n) return;
		let r = t.camera.position.clone(), i = t.camera.quaternion.clone(), a = t.controls.target.clone(), c = n.save();
		this.state = {
			targetUuid: e,
			savedCameraPosition: r,
			savedCameraQuaternion: i,
			savedControlsTarget: a,
			initialContainerSave: c
		};
		let l = n.position.clone(), d = new u.Vector3(0, 0, 1).applyEuler(n.rotation);
		this.extractYawPitch(d);
		let f = this.buildQuaternion();
		t.controls.dispose(), t.smoothCameraToQuat({
			position: l,
			quat: f,
			duration: 300,
			onFinish: () => {
				this.attachMouseListeners(), this.attachPropertyListeners(), s.setScope("FIRST_PERSON");
			}
		}), t.overlays.global.addCell("Mode", "First Person View", { id: "fpv-mode" }), this.showOrbitButton();
	}
	exit() {
		if (!this.state) return;
		let e = this._renderer, { targetUuid: t, savedCameraPosition: n, savedCameraQuaternion: r, savedControlsTarget: a, initialContainerSave: c } = this.state;
		this.detachMouseListeners(), this.detachPropertyListeners(), e.overlays.global.removeCell("fpv-mode"), this.removeOrbitButton();
		let l = o.getState().containers[t];
		if (l) {
			let e = l.save(), n = c;
			mt({
				category: "FIRST_PERSON_ROTATION",
				objectId: t,
				recallFunction: (r) => {
					let a = o.getState().containers[t];
					a && (r === "UNDO" ? a.restore(n) : a.restore(e), o.getState().set((e) => {
						e.version++;
					}), i("RENDER"));
				}
			});
		}
		this.state = null, e.smoothCameraToQuat({
			position: n,
			quat: r,
			duration: 300,
			onFinish: () => {
				e.resetControls(), e.controls.target.copy(a), e.controls.update(), s.setScope("EDITOR");
			}
		});
	}
	dispose() {
		this.detachMouseListeners(), this.detachPropertyListeners(), this.removeOrbitButton(), this.state = null;
	}
	static ROTATION_PROPS = /* @__PURE__ */ new Set([
		"rotationx",
		"rotationy",
		"rotationz"
	]);
	handlePropertyChange = (t) => {
		if (!this.state || t.uuid !== this.state.targetUuid || !e.ROTATION_PROPS.has(t.property)) return;
		let n = o.getState().containers[this.state.targetUuid];
		if (!n) return;
		let r = new u.Vector3(0, 0, 1).applyEuler(n.rotation);
		this.extractYawPitch(r), this._renderer.camera.quaternion.copy(this.buildQuaternion()), this.syncOrientationControl(), i("RENDER");
	};
	attachPropertyListeners() {
		this.propertyUnsubs.push(t("SOURCE_SET_PROPERTY", this.handlePropertyChange), t("RECEIVER_SET_PROPERTY", this.handlePropertyChange));
	}
	detachPropertyListeners() {
		this.propertyUnsubs.forEach((e) => e()), this.propertyUnsubs = [];
	}
	attachMouseListeners() {
		this.onMouseDown = (e) => this.handleMouseDown(e), this.onMouseMove = (e) => this.handleMouseMove(e), this.onMouseUp = () => this.handleMouseUp(), this.onContextMenu = (e) => e.preventDefault(), this.canvas.addEventListener("mousedown", this.onMouseDown), window.addEventListener("mousemove", this.onMouseMove), window.addEventListener("mouseup", this.onMouseUp), this.canvas.addEventListener("contextmenu", this.onContextMenu);
	}
	detachMouseListeners() {
		this.onMouseDown &&= (this.canvas.removeEventListener("mousedown", this.onMouseDown), null), this.onMouseMove &&= (window.removeEventListener("mousemove", this.onMouseMove), null), this.onMouseUp &&= (window.removeEventListener("mouseup", this.onMouseUp), null), this.onContextMenu &&= (this.canvas.removeEventListener("contextmenu", this.onContextMenu), null), this.dragging = !1;
	}
	handleMouseDown(e) {
		e.button === 0 && (this.dragging = !0, this.lastMouseX = e.clientX, this.lastMouseY = e.clientY);
	}
	handleMouseMove(e) {
		if (!this.dragging || !this.state) return;
		let t = o.getState().containers[this.state.targetUuid];
		if (!t) {
			this.exit();
			return;
		}
		let n = e.clientX - this.lastMouseX, r = e.clientY - this.lastMouseY;
		this.lastMouseX = e.clientX, this.lastMouseY = e.clientY, this.yaw += -n * Pt, this.pitch = Math.max(-Math.PI / 2 + .001, Math.min(Math.PI / 2 - .001, this.pitch + -r * Pt)), this._renderer.camera.quaternion.copy(this.buildQuaternion()), this.syncCameraToContainer(t), this.syncOrientationControl();
		let a = performance.now();
		a - this.lastUIUpdate > 33 && (this.lastUIUpdate = a, o.getState().set((e) => {
			e.version++;
		})), i("RENDER");
	}
	handleMouseUp() {
		this.dragging && (this.dragging = !1, o.getState().set((e) => {
			e.version++;
		}));
	}
	showOrbitButton() {
		let e = this.canvas.parentElement;
		if (!e) return;
		let t = document.createElement("button");
		t.textContent = "Back to Orbit", Object.assign(t.style, {
			position: "absolute",
			bottom: "12px",
			left: "50%",
			transform: "translateX(-50%)",
			padding: "6px 20px",
			fontSize: "13px",
			fontFamily: "inherit",
			color: "#fff",
			background: "rgba(255,255,255,0.12)",
			border: "1px solid rgba(255,255,255,0.25)",
			borderRadius: "4px",
			cursor: "pointer",
			zIndex: "10",
			backdropFilter: "blur(4px)"
		}), t.addEventListener("mouseenter", () => {
			t.style.background = "rgba(255,255,255,0.25)";
		}), t.addEventListener("mouseleave", () => {
			t.style.background = "rgba(255,255,255,0.12)";
		}), t.addEventListener("click", () => {
			i("EXIT_FIRST_PERSON");
		}), e.appendChild(t), this.orbitButton = t;
	}
	removeOrbitButton() {
		this.orbitButton &&= (this.orbitButton.remove(), null);
	}
	extractYawPitch(e) {
		let t = e.clone().normalize();
		this.yaw = Math.atan2(t.y, t.x), this.pitch = Math.asin(Math.max(-1, Math.min(1, t.z)));
	}
	buildForward() {
		return new u.Vector3(Math.cos(this.pitch) * Math.cos(this.yaw), Math.cos(this.pitch) * Math.sin(this.yaw), Math.sin(this.pitch));
	}
	buildQuaternion() {
		return this.forwardToQuaternion(this.buildForward());
	}
	syncCameraToContainer(e) {
		let t = this.forwardToQuaternion(this.buildForward()), n = new u.Euler().setFromQuaternion(t, "XYZ");
		e.rotation.copy(n);
	}
	syncOrientationControl() {
		let e = this._renderer, t = new u.Vector3(0, 0, -1).applyQuaternion(e.camera.quaternion).negate().normalize().multiplyScalar(e.orientationControl.cameraDistance);
		e.orientationControl.setCameraTransforms(t, e.camera.quaternion);
	}
	forwardToQuaternion(e) {
		let t = new u.Vector3(0, 0, 0), n = new u.Vector3(0, 0, 1), r = e.clone().normalize(), i = new u.Matrix4().lookAt(t, r, n);
		return new u.Quaternion().setFromRotationMatrix(i);
	}
}, It = /* @__PURE__ */ function(e) {
	return e.PICKING_SURFACE = "PICKING_SURFACE", e.PICKING_SOURCE = "PICKING_SOURCE", e.PICKING_RECEIVER = "PICKING_RECEIVER", e.PICKING_PLANAR_SURFACE = "PICKING_PLANAR_SURFACE", e.PICKING_AXIS = "PICKING_AXIS", e.PICKING_VERTEX = "PICKING_VERTEX", e.SMOOTHING_CAMERA = "SMOOTHING_CAMERA", e.NONE = "NONE", e;
}({}), Lt = {
	vs: "attribute vec3 color;\nvarying vec3 vColor;\nuniform float pointScale;\nvoid main() {\n  vColor = color;\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  gl_PointSize = pointScale;\n  gl_Position = projectionMatrix * mvPosition;\n  \n}",
	fs: "varying vec3 vColor;\nvec3 hsl2rgb(vec3 c){\n    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );\n\n    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));\n}\n\nvec3 rgb2hsl( vec3 c ){\n  float h = 0.0;\n	float s = 0.0;\n	float l = 0.0;\n	float r = c.r;\n	float g = c.g;\n	float b = c.b;\n	float cMin = min( r, min( g, b ) );\n	float cMax = max( r, max( g, b ) );\n\n	l = ( cMax + cMin ) / 2.0;\n	if ( cMax > cMin ) {\n		float cDelta = cMax - cMin;\n        \n        //s = l < .05 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) ); Original\n		s = l < .0 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) );\n        \n		if ( r == cMax ) {\n			h = ( g - b ) / cDelta;\n		} else if ( g == cMax ) {\n			h = 2.0 + ( b - r ) / cDelta;\n		} else {\n			h = 4.0 + ( r - g ) / cDelta;\n		}\n\n		if ( h < 0.0) {\n			h += 6.0;\n		}\n		h = h / 6.0;\n	}\n	return vec3( h, s, l );\n}\n\nvoid main() {\n  // Render as circle/sphere instead of square\n  vec2 center = gl_PointCoord - vec2(0.5);\n  float dist = length(center);\n\n  // Discard pixels outside the circle\n  if (dist > 0.5) {\n    discard;\n  }\n\n  // Add slight shading for 3D sphere effect\n  float shade = 1.0 - dist * 0.5;\n  gl_FragColor = vec4(vColor * shade, 1.0);\n}"
}, Rt = {
	maxlines: 5e5,
	maxpoints: 5e4,
	pointScale: 7
}, zt = class extends Z {
	linesBufferGeometry;
	pointsBufferGeometry;
	maxlines;
	maxpoints;
	linesBufferAttribute;
	pointsBufferAttribute;
	lines;
	points;
	colorBufferAttribute;
	lineColorBufferAttribute;
	linePositionIndex;
	pointsPositionIndex;
	pointScale;
	boxes;
	linesOverflowed = !1;
	pointsOverflowed = !1;
	overflowWarningLogged = !1;
	constructor(e) {
		super("markup", e), this.maxlines = e && e.maxlines || Rt.maxlines, this.maxpoints = e && e.maxpoints || Rt.maxpoints, this.pointScale = e && e.pointScale || Rt.pointScale, this.linePositionIndex = 0, this.pointsPositionIndex = 0, this.linesBufferGeometry = new u.BufferGeometry(), this.pointsBufferGeometry = new u.BufferGeometry(), this.linesBufferGeometry.name = "markup-linesBufferGeometry", this.pointsBufferGeometry.name = "markup-pointsBufferGeometry", this.linesBufferAttribute = new u.Float32BufferAttribute(new Float32Array(this.maxlines * 3), 3), this.pointsBufferAttribute = new u.Float32BufferAttribute(new Float32Array(this.maxpoints * 3), 3), this.linesBufferAttribute.setUsage(u.DynamicDrawUsage), this.pointsBufferAttribute.setUsage(u.DynamicDrawUsage), this.linesBufferGeometry.setAttribute("position", this.linesBufferAttribute), this.pointsBufferGeometry.setAttribute("position", this.pointsBufferAttribute), this.linesBufferGeometry.setDrawRange(0, this.maxlines), this.pointsBufferGeometry.setDrawRange(0, this.maxpoints), this.colorBufferAttribute = new u.Float32BufferAttribute(new Float32Array(this.maxpoints * 3), 3), this.colorBufferAttribute.setUsage(u.DynamicDrawUsage), this.lineColorBufferAttribute = new u.Float32BufferAttribute(new Float32Array(this.maxlines * 3), 3), this.lineColorBufferAttribute.setUsage(u.DynamicDrawUsage), this.linesBufferGeometry.setAttribute("color", this.lineColorBufferAttribute), this.pointsBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.lines = new u.LineSegments(this.linesBufferGeometry, new u.LineBasicMaterial({
			fog: !1,
			vertexColors: !0,
			transparent: !0,
			opacity: .6,
			premultipliedAlpha: !0,
			blending: u.NormalBlending,
			depthFunc: u.AlwaysDepth,
			name: "markup-material",
			linewidth: 2
		})), this.lines.renderOrder = -.5, this.lines.frustumCulled = !1, this.add(this.lines), this.points = new u.Points(this.pointsBufferGeometry, new u.ShaderMaterial({
			fog: !1,
			vertexShader: Lt.vs,
			fragmentShader: Lt.fs,
			transparent: !0,
			premultipliedAlpha: !0,
			uniforms: { pointScale: { value: this.pointScale } },
			blending: u.NormalBlending,
			name: "markup-points-material"
		})), this.points.frustumCulled = !1, this.add(this.points), this.boxes = new Z("boxes"), this.add(this.boxes);
	}
	addLine(e, t, n = [
		.16,
		.16,
		.16
	], r = [
		.16,
		.16,
		.16
	]) {
		return this.linePositionIndex + 2 > this.maxlines ? (this.linesOverflowed || (this.linesOverflowed = !0, this.overflowWarningLogged ||= (console.warn(`Markup: Line buffer overflow! Capacity: ${this.maxlines} vertices (${this.maxlines / 2} line segments). Consider reducing reflection order.`), !0)), !1) : (this.linesBufferAttribute.setXYZ(this.linePositionIndex++, e[0], e[1], e[2]), this.lineColorBufferAttribute.setXYZ(this.linePositionIndex, ...n), this.linesBufferAttribute.setXYZ(this.linePositionIndex++, t[0], t[1], t[2]), this.lineColorBufferAttribute.setXYZ(this.linePositionIndex, ...r), this.linesBufferGeometry.setDrawRange(0, this.linePositionIndex), this.linesBufferAttribute.needsUpdate = !0, this.linesBufferAttribute.version++, this.lineColorBufferAttribute.needsUpdate = !0, this.lineColorBufferAttribute.version++, !0);
	}
	addPoint(e, t) {
		return this.pointsPositionIndex + 1 > this.maxpoints ? (this.pointsOverflowed || (this.pointsOverflowed = !0, this.overflowWarningLogged ||= (console.warn(`Markup: Points buffer overflow! Capacity: ${this.maxpoints} points. Consider reducing reflection order.`), !0)), !1) : (this.pointsBufferAttribute.setXYZ(this.pointsPositionIndex++, e[0], e[1], e[2]), this.colorBufferAttribute.setXYZ(this.pointsPositionIndex, t[0], t[1], t[2]), this.pointsBufferGeometry.setDrawRange(0, this.pointsPositionIndex), this.pointsBufferAttribute.needsUpdate = !0, this.pointsBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++, !0);
	}
	clearPoints() {
		this.pointsBufferGeometry.dispose(), this.pointsBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.needsUpdate = !0, this.pointsPositionIndex = 0, this.pointsBufferGeometry.setDrawRange(0, this.pointsPositionIndex), this.pointsOverflowed = !1;
	}
	clearLines() {
		this.linesBufferGeometry.dispose(), this.linesBufferAttribute.needsUpdate = !0, this.lineColorBufferAttribute.needsUpdate = !0, this.linePositionIndex = 0, this.linesBufferGeometry.setDrawRange(0, this.linePositionIndex), this.linesOverflowed = !1, this.overflowWarningLogged = !1;
	}
	getUsageStats() {
		let e = this.linePositionIndex / this.maxlines * 100, t = this.pointsPositionIndex / this.maxpoints * 100;
		return {
			linesUsed: this.linePositionIndex,
			linesCapacity: this.maxlines,
			linesPercent: e,
			pointsUsed: this.pointsPositionIndex,
			pointsCapacity: this.maxpoints,
			pointsPercent: t,
			overflowWarning: this.linesOverflowed || this.pointsOverflowed
		};
	}
	hasOverflow() {
		return this.linesOverflowed || this.pointsOverflowed;
	}
	addBox(e, t, n = [
		Math.random(),
		Math.random(),
		Math.random()
	]) {
		let r = Math.abs(t[0] - e[0]), i = Math.abs(t[1] - e[1]), a = Math.abs(t[2] - e[2]), o = new u.BoxGeometry(r, i, a), s = new u.MeshBasicMaterial({
			color: new u.Color(n[0], n[1], n[2]),
			transparent: !0,
			opacity: .2
		}), c = new u.Mesh(o, s);
		return c.translateX(r / 2 + e[0]), c.translateY(i / 2 + e[1]), c.translateZ(a / 2 + e[2]), this.boxes.add(c), c;
	}
}, Bt = (e, t = 60) => {
	let n = 1e3 / t, r = 0, i = null, a = (e) => {
		r = e, i = null;
	};
	return ((...t) => {
		let o = Date.now(), s = o - r, c = n - s;
		c <= 0 ? (e(...t), a(o)) : (i && clearTimeout(i), i = setTimeout(() => {
			e(...t), a(Date.now());
		}, c));
	});
}, Vt = "cram";
function Ht(e) {
	Vt = e;
}
function Ut() {
	return Vt;
}
function Wt(e) {
	return Vt ? `${Vt}-${e}` : e;
}
function Gt(e) {
	return localStorage.getItem(Wt(e));
}
function Kt(e, t) {
	localStorage.setItem(Wt(e), t);
}
function qt(e) {
	localStorage.removeItem(Wt(e));
}
function Jt() {
	let e = Wt(""), t = [];
	for (let n = 0; n < localStorage.length; n++) {
		let r = localStorage.key(n);
		r && r.startsWith(e) && t.push(r);
	}
	t.forEach((e) => localStorage.removeItem(e));
}
var Yt = {
	getItem: Gt,
	setItem: Kt,
	removeItem: qt,
	clearPrefixedItems: Jt,
	setStoragePrefix: Ht,
	getStoragePrefix: Ut
}, $ = new class {
	stats;
	mouseConfigSet;
	modifierKeyState;
	elt;
	renderer;
	_camera;
	perspectiveCamera;
	orthoCamera;
	scene;
	env;
	fdtdItems;
	interactables;
	workspace;
	sketches;
	markup;
	lights;
	axes;
	grid;
	stack;
	settingHandlers;
	sourceGroup;
	sourceTemplate;
	receiverGroup;
	receiverTemplate;
	geometryGroup;
	controls;
	workspaceCursor;
	fog;
	_fov;
	textures;
	smoothingCameraCallback;
	smoothingCamera;
	pickHelper;
	cursor;
	composer;
	outlinePass;
	renderPass;
	effectFXAA;
	transformControls;
	currentlyMovingObjects;
	overlays;
	fdtd2drunning;
	fdtd3drunning;
	needsToRender;
	shouldAnimate;
	isIdle = !1;
	orientationControl;
	firstPersonControls;
	currentProcess;
	_pendingTheme;
	constructor() {
		[
			"init",
			"render",
			"smoothCameraTo",
			"setOrtho",
			"storeCameraState",
			"onOrbitControlsChange"
		].forEach((e) => {
			this[e] = this[e].bind(this);
		}), this.shouldAnimate = !1, this.currentProcess = It.NONE;
	}
	init(e) {
		this.fdtd2drunning = !1, this.fdtd3drunning = !1, this.modifierKeyState = {
			Shift: 0,
			Control: 0,
			Alt: 0,
			Meta: 0
		}, this.overlays = {
			transform: new yt("#canvas_overlay"),
			global: new xt(e.parentElement)
		}, this.smoothingCamera = !1, this.smoothingCameraCallback = void 0, this.elt = e, this.stack = [], this.env = new Z("env"), this.fdtdItems = new Z("fdtdItems"), this.workspace = new Z("workspace"), this.workspace.userData.isWorkspace = !0, this.interactables = new Z("interactables"), this.sketches = new Z("sketches"), this.markup = new zt(), this.workspaceCursor = this.workspace, this.lights = new dt(), this.grid = new st("grid", {
			size: 500,
			cellSize: 1,
			majorLinesEvery: 10,
			color1: 13948632,
			color2: 15001576
		}), this.axes = new ut(), this.env.add(this.grid, this.lights, this.axes), this.cursor = new Nt(), this.env.add(this.cursor);
		let t = c.getState().theme.renderer.background;
		this.scene = new u.Scene(), this.scene.background = new u.Color(t), this.scene.add(this.env, this.workspace, this.interactables, this.fdtdItems, this.sketches, this.markup), this.renderer = new u.WebGLRenderer({
			canvas: this.elt,
			context: this.elt.getContext("webgl2", { alpha: !0 }),
			antialias: !0,
			depth: !0
		}), this.renderer.setSize(this.clientWidth, this.clientHeight);
		let n = window.devicePixelRatio;
		this.renderer.setPixelRatio(n), this._fov = 45;
		let r = this.aspect, o = [
			0,
			0,
			1
		];
		this._camera = new u.PerspectiveCamera(this._fov, r, .01, 500), this._camera.layers.enableAll(), this._camera.position.set(1, 1, 1), this._camera.up.set(o[0], o[1], o[2]), this.mouseConfigSet = {
			Default: {
				LEFT: u.MOUSE.ROTATE,
				MIDDLE: u.MOUSE.DOLLY,
				RIGHT: u.MOUSE.PAN
			},
			Shift: {
				LEFT: u.MOUSE.ROTATE,
				MIDDLE: u.MOUSE.DOLLY,
				RIGHT: u.MOUSE.PAN
			},
			Meta: {
				LEFT: u.MOUSE.ROTATE,
				MIDDLE: u.MOUSE.DOLLY,
				RIGHT: u.MOUSE.PAN
			},
			Alt: {
				LEFT: u.MOUSE.ROTATE,
				MIDDLE: u.MOUSE.DOLLY,
				RIGHT: u.MOUSE.PAN
			},
			Control: {
				LEFT: u.MOUSE.ROTATE,
				MIDDLE: u.MOUSE.DOLLY,
				RIGHT: u.MOUSE.PAN
			}
		}, this.controls = new R(this._camera, this.renderer.domElement), this.controls.mouseButtons = this.mouseConfigSet.Default, this.controls.screenSpacePanning = !0, this.transformControls = new Ee(this._camera, this.renderer.domElement), this.transformControls.addEventListener("mouseUp", (e) => {
			if (!(!e.target.object || !(e.target.object instanceof Z))) {
				let t = e.target.allAssociatedObjects;
				if (!t) return;
				let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
				for (let e = 0; e < t.length; e++) n.set(t[e].uuid, Object.assign({}, t[e].userData.lastSave)), r.set(t[e].uuid, Object.assign({}, t[e].save()));
				mt({
					category: "OBJECT_TRANSFORM",
					objectId: e.target.object.uuid,
					recallFunction: (e) => {
						if (e === "UNDO") for (let e = 0; e < t.length; e++) t[e].restore(n.get(t[e].uuid));
						else if (e === "REDO") for (let e = 0; e < t.length; e++) t[e].restore(r.get(t[e].uuid));
					}
				});
			}
		}), this.transformControls.addEventListener("mouseDown", (e) => {
			let t = e.target.allAssociatedObjects;
			if (t) for (let e = 0; e < t.length; e++) t[e].userData.lastSave = t[e].save();
		}), this.transformControls.addEventListener("change", (e) => {
			let t = e.target.allAssociatedObjects;
			if (t !== void 0) {
				let e = t[0] && t[0].position, n = t[0] && t[0].userData.lastSave, r = n && new u.Vector3().fromArray(n.position);
				if (e && r) {
					let n = new u.Vector3().copy(e).sub(r);
					for (let e = 0; e < t.length; e++) t[e].position.set(t[e].userData.lastSave.position[0] + n.x, t[e].userData.lastSave.position[1] + n.y, t[e].userData.lastSave.position[2] + n.z);
					this.overlays.transform.setValues(n.x, n.y, n.z);
				}
			}
		}), this.currentlyMovingObjects = !1, this.pickHelper = new _t(this.scene, this._camera, this.renderer.domElement), this.fog = new u.FogExp2(t, .015), this.scene.fog = this.fog, this.composer = new ve(this.renderer), this.renderPass = new ye(this.scene, this._camera), this.composer.addPass(this.renderPass), this.settingHandlers = {}, this.settingHandlers.lightHelpersVisible = (e) => {
			console.log(e), this.lights.setHelpersVisible(e);
		}, a.addMessageHandler("SET_RENDERER_SHOULD_ANIMATE", (e, ...t) => {
			this.shouldAnimate = t[0];
		}), a.addMessageHandler("RENDERER_SHOULD_CHANGE_BACKGROUND", (e, ...t) => {
			this.background = t[0], this.needsToRender = !0;
		}), a.addMessageHandler("RENDERER_SHOULD_CHANGE_FOG_COLOR", (e, ...t) => {
			this.fogColor = t[0], this.needsToRender = !0;
		}), a.addMessageHandler("SHOULD_REMOVE_CONTAINER", (e, ...t) => {
			let n = t[0], r = this.scene.getObjectByProperty("uuid", n);
			r && r.parent && r.parent.remove(r), this.needsToRender = !0;
		}), a.addMessageHandler("LOOK_ALONG_AXIS", (e, ...t) => {
			let n = t[0];
			if (!At[n]) {
				console.warn("invalid args");
				return;
			}
			let r = this.camera.position.distanceTo(this.controls.target), i = this.controls.target.clone(), a = X.linear, o = () => {
				this.controls.target.set(i.x, i.y, i.z), this.orientationControl.axis = n, this.storeCameraState(), this.needsToRender = !0;
			}, s = this.controls.target.clone().add(At[n].clone().multiplyScalar(r)), c = jt[n].clone();
			this.smoothCameraToQuat({
				position: s,
				target: i,
				duration: 125,
				onFinish: o,
				easingFunction: a,
				quat: c
			}), this.needsToRender = !0;
		}), a.addMessageHandler("TOGGLE_RENDERER_STATS_VISIBLE", () => {
			this.stats.hidden ? this.stats.unhide() : this.stats.hide();
		}), a.addMessageHandler("GET_RENDERER_STATS_VISIBLE", () => !this.stats.hidden), this.addCleanupListener(window, "mouseup", (e) => {
			this.firstPersonControls?.active || (this.storeCameraState(), this.needsToRender = !0);
		}), this.addCleanupListener(window, "keydown", (e) => {
			this.modifierKeyState.hasOwnProperty(e.key) && (this.modifierKeyState[e.key] += 1);
		}), this.addCleanupListener(window, "keyup", (e) => {
			this.modifierKeyState.hasOwnProperty(e.key) && --this.modifierKeyState[e.key];
		});
		let l = Bt(() => {
			this.requestRender();
		}, 30);
		this.renderer.domElement.addEventListener("mousemove", l), this.renderer.domElement.addEventListener("wheel", (e) => {
			this.requestRender(), s.setScope("EDITOR");
		}), this.renderer.domElement.addEventListener("mousedown", (e) => {
			if (this.firstPersonControls?.active) return;
			s.setScope("EDITOR");
			let t = this.pickHelper.pick(e, [this.workspace, this.interactables]);
			if (t.pickedObject) {
				if (e.button === 0) {
					let n = this.pickHelper.getPickedPoint();
					this.cursor.position.set(n[0], n[1], n[2]), this.currentlyMovingObjects || (e.shiftKey ? i("APPEND_SELECTION", [t.pickedObject]) : e.altKey || i("SET_SELECTION", [t.pickedObject]));
				}
			} else e.button === 0 && !e.shiftKey && !e.altKey && i("PHASE_OUT");
			this.requestRender();
		}), this.controls.addEventListener("change", this.onOrbitControlsChange);
		let d = JSON.parse(lt.camera), f = Yt.getItem("camera");
		f && (d = JSON.parse(f)), d && d.object && (d.object.pos && this.camera.position.fromArray(d.object.pos), d.object.quat && this.camera.quaternion.fromArray(d.object.quat), this.camera.near = d.object.near, this.camera.far = d.object.far, d.object.type === "PerspectiveCamera" ? (this.camera = new u.PerspectiveCamera(this.camera.fov, r, this.camera.near, this.camera.far), this.camera.zoom = d.object.zoom) : d.object.type === "OrthographicCamera" && (this.camera = new u.OrthographicCamera(d.object.left, d.object.right, d.object.top, d.object.bottom, this.camera.near, this.camera.far), this.camera.zoom = d.object.zoom), this.controls.target.fromArray(d.object.target || [
			0,
			0,
			0
		]));
		let p = JSON.parse(Yt.getItem("orientationControl") || lt.orientationControl);
		this.orientationControl = new Mt("#orientation-overlay", {
			width: 160,
			height: 160,
			axis: p.axis
		}), this.orientationControl.addClickListener((e) => {
			e.target.match(/top|bottom|right|left|front|back/gi) && a.postMessage("LOOK_ALONG_AXIS", e.target);
		}), this.firstPersonControls = new Ft(this.elt, this);
		let m = this.camera.position.clone().sub(this.controls.target).normalize().multiplyScalar(this.orientationControl.cameraDistance);
		this.orientationControl.setCameraTransforms(m, this.camera.quaternion), this.stats = new ue(), this.overlays.global.addCell("FPS", this.stats.fpsPanelValue, {
			id: "fps",
			hidden: !1,
			formatter: (e) => String(Math.round(e)) + " Hz"
		}), this.stats.memPanel && this.overlays.global.addCell("Heap", this.stats.memPanelValue, {
			id: "heap",
			hidden: !1,
			formatter: (e) => String(Math.round(e)) + " MB"
		}), this.elt.parentElement?.appendChild(this.stats.container), this.stats.hide(), this.render(), this._pendingTheme &&= (this.applyTheme(this._pendingTheme), void 0), setTimeout(() => {
			this.needsToRender = !0;
		}, 100);
	}
	onOrbitControlsChange(e) {
		if (this.orientationControl) {
			let e = this.camera.position.clone().sub(this.controls.target).normalize().multiplyScalar(this.orientationControl.cameraDistance);
			this.orientationControl.setCameraTransforms(e, this.camera.quaternion), this.orientationControl.axis = "none";
		}
	}
	storeCameraState() {
		let e = this.camera.toJSON();
		e.object.quat = this.camera.quaternion.toArray(), e.object.pos = this.camera.position.toArray(), e.object.zoom = this.camera.zoom, e.object.target = this.controls.target.toArray();
		let t = this.orientationControl.save();
		Yt.setItem("camera", JSON.stringify(e)), Yt.setItem("orientationControl", JSON.stringify(t));
	}
	resetControls() {
		let e = this.controls.target.clone();
		this.controls.dispose(), this.controls = new R(this.camera, this.renderer.domElement), this.controls.target.set(e.x, e.y, e.z), this.controls.mouseButtons = this.mouseConfigSet.Default, this.controls.screenSpacePanning = !0, this.controls.update(), this.controls.addEventListener("change", this.onOrbitControlsChange), this.needsToRender = !0;
	}
	setOrtho(e) {
		let t = this.orientationControl.axis, n = this.camera.near, r = this.camera.far, i = this.camera instanceof u.PerspectiveCamera && this.camera.fov || this.fov, a = this.camera instanceof u.PerspectiveCamera && this.camera.getFilmWidth() || 35, o = this.camera instanceof u.PerspectiveCamera && this.camera.getFilmHeight() || 35 / this.aspect, s = this.controls.target.toArray();
		if (e) {
			let e = o / 2, t = -e, i = a / 2, s = -i, c = new u.OrthographicCamera(s, i, e, t, n, r);
			this.camera = c, this.camera.layers.enableAll();
		} else this.camera = new u.PerspectiveCamera(i, this.aspect, n, r), this.camera.layers.enableAll();
		this.controls.target.fromArray(s);
		let c = this.camera.position.clone().sub(this.controls.target).normalize().multiplyScalar(this.orientationControl.cameraDistance);
		this.orientationControl.setCameraTransforms(c, this.camera.quaternion), this.orientationControl.axis = t, this.updateCursorSize();
	}
	resize() {
		this.renderer.setSize(this.renderer.domElement.parentElement?.clientWidth || 0, this.renderer.domElement.parentElement?.clientHeight || 0), this.composer.setSize(this.renderer.domElement.parentElement?.clientWidth || 0, this.renderer.domElement.parentElement?.clientHeight || 0);
	}
	resizeCanvasToDisplaySize(e) {
		let t = this.renderer.domElement, n = t.clientWidth, r = t.clientHeight;
		(t.width !== n || t.height !== r || e) && (this.renderer.setSize(n, r, !1), this.composer.setSize(n, r), this.camera instanceof u.OrthographicCamera ? (this.camera.left = -t.width / 2, this.camera.right = t.width / 2, this.camera.top = t.height / 2, this.camera.bottom = -t.height / 2) : this.camera.aspect = t.width / t.height, this.camera.updateProjectionMatrix());
	}
	checkresize() {
		(this.renderer.domElement.width !== (this.renderer.domElement.parentElement?.clientWidth || 0) || this.renderer.domElement.height !== (this.renderer.domElement.parentElement?.clientHeight || 0)) && this.resize();
	}
	settingChanged(e, t) {
		this.settingHandlers[e](t);
	}
	addRays(e) {
		this.scene.add(e);
	}
	add(e) {
		this.workspaceCursor.add(e), this.needsToRender = !0;
	}
	remove(e) {
		this.workspaceCursor.remove(e), this.needsToRender = !0;
	}
	addModel(e) {
		this.workspaceCursor.add(e), this.needsToRender = !0;
	}
	addRoom(e) {
		this.workspaceCursor.add(e), this.needsToRender = !0;
	}
	getCenteredCanvasBounds() {
		let e = this.renderer.domElement.height / 2, t = this.renderer.domElement.width / 2;
		return {
			top: e,
			bottom: -e,
			left: -t,
			right: t
		};
	}
	getOrthoBounds() {
		return this.camera instanceof u.OrthographicCamera ? [
			this.camera.top,
			this.camera.bottom,
			this.camera.left,
			this.camera.right
		] : [
			this.orthoCamera.top,
			this.orthoCamera.bottom,
			this.orthoCamera.left,
			this.orthoCamera.right
		];
	}
	quat2angle(e) {
		return Ue(e);
	}
	angle2quat(e) {
		return We(e);
	}
	applyQuatAngle(e, t, n, r) {
		let i = new u.Vector3(t, n, r);
		i.normalize();
		let a = new Ge(e, i).toQuaternion();
		this.camera.applyQuaternion(a), this.camera.updateProjectionMatrix(), this.needsToRender = !0;
	}
	roll(e) {
		let t = new Ge(e, new u.Vector3(0, 0, 1)).toQuaternion();
		this.camera.applyQuaternion(t), this.camera.updateProjectionMatrix(), this.needsToRender = !0;
	}
	smoothCameraTo(e) {
		let t = this.camera.position.clone(), n = this.controls.target.clone(), r = e.target || n.clone(), i = new Ke(e.duration || 1e3, () => {}), a = e.easingFunction || X.linear;
		this.smoothingCamera = !0, this.smoothingCameraCallback = () => {
			let o = i.tick(), s = a(o), c = Je(t, e.position, s), l = Je(n, r, s);
			this.camera.position.set(c.x, c.y, c.z), this.camera.lookAt(l), this.controls.target.set(l.x, l.y, l.z);
			let u = this.camera.position.clone().sub(l).normalize().multiplyScalar(this.orientationControl.cameraDistance);
			this.orientationControl.setCameraTransforms(u, this.camera.quaternion), o === 1 && (this.smoothingCamera = !1, e.onFinish && e.onFinish(i), this.storeCameraState());
		}, i.start();
	}
	smoothCameraToQuat(e) {
		let t = this.camera.position.clone(), n = this.controls.target.clone().distanceTo(t), r = this.camera.quaternion.clone(), i = e.quat || r.clone(), a = new Ke(e.duration || 1e3, (e) => {}), o = e.easingFunction || X.linear;
		this.smoothingCamera = !0, this.smoothingCameraCallback = () => {
			let s = a.tick(), c = o(s), l = Je(t, e.position, c), d = new u.Quaternion();
			d.copy(r);
			let f = d.slerp(i, c);
			this.camera.position.set(l.x, l.y, l.z), this.camera.quaternion.copy(f);
			let p = new u.Vector3();
			this.camera.getWorldDirection(p);
			let m = p.multiplyScalar(n), h = this.camera.position.clone().add(m), g = this.camera.position.clone().sub(h).normalize().multiplyScalar(this.orientationControl.cameraDistance);
			this.orientationControl.setCameraTransforms(g, this.camera.quaternion), s === 1 && (this.smoothingCamera = !1, e.onFinish && e.onFinish(a), this.storeCameraState());
		}, a.start();
	}
	update() {
		this.smoothingCamera ? (this.needsToRender = !0, this.smoothingCameraCallback()) : (this.fdtd2drunning || this.fdtd3drunning) && (this.needsToRender = !0);
	}
	updateStats() {
		this.stats.update(), this.overlays.global.setCellValue("fps", this.stats.fpsPanelValue), this.stats.memPanel && this.overlays.global.setCellValue("heap", this.stats.memPanelValue);
	}
	updateCursorSize() {
		this.camera instanceof u.OrthographicCamera ? this.cursor.sprite.scale.setScalar(1 / this.camera.zoom) : this.cursor.sprite.scale.setScalar(.035);
	}
	requestRender() {
		this.needsToRender = !0, this.isIdle && (this.isIdle = !1, requestAnimationFrame(this.render));
	}
	render() {
		this.update(), this.resizeCanvasToDisplaySize();
		let e = this.needsToRender || this.shouldAnimate;
		e && (this.composer.render(), this.updateCursorSize(), this.updateStats(), this.orientationControl.shouldRender = !0, a.postMessage("RENDERER_UPDATED"), i("RENDERER_UPDATED", void 0), this.needsToRender = !1), this.orientationControl.shouldRender && this.orientationControl.render(), e || this.orientationControl.shouldRender ? (this.isIdle = !1, requestAnimationFrame(this.render)) : (this.isIdle = !0, setTimeout(() => requestAnimationFrame(this.render), 50));
	}
	get isPerformingOperation() {
		return this.currentlyMovingObjects;
	}
	get camera() {
		return this._camera;
	}
	set camera(e) {
		let t = new u.Quaternion().copy(this._camera.quaternion), n = new u.Vector3().copy(this._camera.position);
		this._camera = e, this._camera.up.set(0, 0, 1), this.controls.object = this._camera, this.controls.update(), this.transformControls.camera = this._camera, this._camera.position.set(n.x, n.y, n.z), this._camera.setRotationFromQuaternion(t), this._camera.quaternion.normalize(), this._camera.updateProjectionMatrix(), this.renderPass.camera.uuid !== this._camera.uuid && (this.renderPass.camera = this._camera), this.pickHelper.updateCamera(this._camera), this.requestRender();
	}
	get fogDensity() {
		return this.scene && this.scene.fog && this.scene.fog.density || .015;
	}
	set fogDensity(e) {
		this.scene.fog.density = e;
	}
	get gridVisible() {
		return !this.grid || this.grid.visible;
	}
	set gridVisible(e) {
		this.grid.visible = e, this.needsToRender = !0;
	}
	get cursorVisible() {
		return !this.cursor || this.cursor.visible;
	}
	set cursorVisible(e) {
		this.cursor.visible = e, this.needsToRender = !0;
	}
	get axisVisible() {
		return !this.axes || this.axes.visible;
	}
	set axisVisible(e) {
		this.axes.visible = e, this.needsToRender = !0;
	}
	get zoom() {
		return this.camera && this.camera.zoom || 1;
	}
	set zoom(e) {
		this.camera.zoom = e, this.camera.updateProjectionMatrix(), this.needsToRender = !0;
	}
	get near() {
		return this.camera && this.camera.near || .01;
	}
	set near(e) {
		this.camera.near = e, this.camera.updateProjectionMatrix(), this.needsToRender = !0;
	}
	get far() {
		return this.camera && this.camera.far || 500;
	}
	set far(e) {
		this.camera.far = e, this.camera.updateProjectionMatrix(), this.needsToRender = !0;
	}
	get isOrtho() {
		return this.camera instanceof u.OrthographicCamera;
	}
	set isOrtho(e) {
		e !== this.isOrtho && (this.setOrtho(this.camera instanceof u.PerspectiveCamera), this.needsToRender = !0, this.storeCameraState());
	}
	get background() {
		return this.scene.background.getHexString();
	}
	set background(e) {
		this.scene.background.setStyle(e);
	}
	get fogColor() {
		return this.scene.fog && this.scene.fog.color && this.scene.fog.color.getHexString() || "#000000";
	}
	set fogColor(e) {
		this.scene.fog?.color.setStyle(e);
	}
	applyTheme(e) {
		if (!this.scene) {
			this._pendingTheme = e;
			return;
		}
		this.scene.background.setHex(e.background), this.fog && this.fog.color.setHex(e.fog), this.grid && this.grid.updateColors(e.gridMinor, e.gridMajor, e.gridOpacity, e.gridMajorOpacity), this.needsToRender = !0;
	}
	get fov() {
		return this.camera instanceof u.PerspectiveCamera ? this.camera.fov : this._fov;
	}
	set fov(e) {
		this._fov = e, this.camera instanceof u.PerspectiveCamera && (this.camera.fov = e), this.needsToRender = !0;
	}
	get clientWidth() {
		return this.elt.parentElement.clientWidth;
	}
	get clientHeight() {
		return this.elt.parentElement.clientHeight;
	}
	get aspect() {
		return this.clientWidth / this.clientHeight;
	}
	get mode() {
		return a.postMessage("GET_EDITOR_MODE")[0];
	}
	cleanupFunctions = [];
	addCleanupListener(e, t, n) {
		e.addEventListener(t, n), this.cleanupFunctions.push(() => e.removeEventListener(t, n));
	}
	dispose() {
		this.animationFrameId !== void 0 && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = void 0), this.cleanupFunctions.forEach((e) => e()), this.cleanupFunctions = [], this.composer && this.composer.dispose(), this.renderer && (this.renderer.dispose(), this.renderer.forceContextLoss()), this.controls && this.controls.dispose(), this.transformControls && this.transformControls.dispose(), this.firstPersonControls && this.firstPersonControls.dispose(), this.scene && this.scene.traverse((e) => {
			e instanceof u.Mesh && (e.geometry && e.geometry.dispose(), e.material && (Array.isArray(e.material) ? e.material.forEach((e) => e.dispose()) : e.material.dispose()));
		}), this.textures && Object.values(this.textures).forEach((e) => e.dispose()), this.overlays && (this.overlays.transform.hide(), this.overlays.global.hide()), console.log("[Renderer] Disposed");
	}
	animationFrameId;
}();
n("RENDER", () => {
	$.requestRender();
}), n("RENDERER_SHOULD_ANIMATE", (e) => {
	$.shouldAnimate = e, e && $.requestRender();
}), n("PHASE_OUT", () => {
	$.firstPersonControls?.active ? i("EXIT_FIRST_PERSON") : $.isPerformingOperation ? i("STOP_OPERATIONS") : i("DESELECT_ALL_OBJECTS"), $.requestRender();
}), n("STOP_OPERATIONS", () => {
	$.interactables.remove($.transformControls._root), $.transformControls.detach(), $.currentlyMovingObjects = !1, $.overlays.transform.hide(), $.requestRender();
}), n("MOVE_SELECTED_OBJECTS", () => {
	let e = o.getState().selectedObjects;
	e && e.size > 0 && (e.forEach((e) => e.userData.lastSave = e.save()), s.setScope("EDITOR_MOVING"), $.overlays.transform.setValues(0, 0, 0), $.transformControls.setTranslationSnap(.01), $.overlays.transform.show(), $.currentlyMovingObjects = !0, $.transformControls.attach([...e]), $.interactables.add($.transformControls._root)), $.requestRender();
}), n("TOGGLE_CAMERA_ORTHO", () => {
	$.isOrtho = !$.isOrtho;
}), n("FOCUS_ON_SELECTED_OBJECTS", () => {
	let e = [...o.getState().selectedObjects];
	if (e && e.length > 0) {
		let t = X.linear, n = $.camera.position, r = e[0].position;
		$.smoothCameraTo({
			position: n,
			target: r,
			duration: 125,
			onFinish: () => {
				$.controls.target.set(r.x, r.y, r.z);
			},
			easingFunction: t
		});
	} else {
		let e = X.linear, t = $.camera.position, n = new u.Vector3(0, 0, 0);
		$.smoothCameraTo({
			position: t,
			target: n,
			duration: 125,
			onFinish: () => {
				$.controls.target.set(n.x, n.y, n.z);
			},
			easingFunction: e
		});
	}
	$.requestRender();
}), n("FOCUS_ON_CURSOR", () => {
	let e = X.linear, t = $.camera.position, n = $.cursor.position;
	$.smoothCameraTo({
		position: t,
		target: n,
		duration: 125,
		onFinish: () => {
			$.controls.target.set(n.x, n.y, n.z);
		},
		easingFunction: e
	}), $.requestRender();
}), n("ENTER_FIRST_PERSON", ({ uuid: e }) => {
	$.firstPersonControls.enter(e);
}), n("EXIT_FIRST_PERSON", () => {
	$.firstPersonControls.exit();
}), n("THEME_CHANGED", (e) => {
	$.applyTheme(e.renderer);
});
//#endregion
export { mt as a, nt as c, Ye as d, qe as f, It as i, rt as l, Ht as n, pt as o, me as p, Yt as r, ct as s, $ as t, Z as u };

//# sourceMappingURL=renderer-BeKP35ez.mjs.map