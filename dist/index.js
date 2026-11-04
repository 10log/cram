import { C as e, E as t, S as n, T as r, a as i, b as a, c as o, d as s, g as c, h as l, i as u, j as d, l as f, p, t as m, x as h, y as g } from "./FileSaver.min-C7ZD-uW3.mjs";
import { a as _, c as v, d as y, i as b, l as x, n as S, o as C, r as w, s as ee, t as T, u as E } from "./renderer-Ca4ltx3N.mjs";
import "./acoustics-Cs_0VALc.mjs";
import { n as te, o as D, r as ne, t as re } from "./recording-BNt8sVtX.mjs";
import { n as ie, r as ae } from "./convert-BWB5KhF2.mjs";
import { a as oe, c as se, d as ce, f as le, g as O, h as ue, i as de, l as fe, m as pe, n as me, o as k, p as he, t as ge, u as _e } from "./store-Cb8r9O09.mjs";
import { r as ve, t as ye } from "./room-DybgS1e4.mjs";
import "./css-B48fe771.mjs";
import { n as be, t as xe } from "./hrtf-data-BrLbPFiq.mjs";
import { t as Se } from "./gpu-context-f_gdgxcB.mjs";
import * as A from "three";
import { AdditiveBlending as Ce, AnimationClip as we, Bone as Te, Box3 as Ee, BufferAttribute as De, BufferGeometry as Oe, ClampToEdgeWrapping as ke, Color as Ae, ColorManagement as je, DirectionalLight as Me, DoubleSide as Ne, FileLoader as Pe, Float32BufferAttribute as Fe, FrontSide as Ie, Group as Le, ImageBitmapLoader as Re, InstancedBufferAttribute as ze, InstancedMesh as Be, InterleavedBuffer as Ve, InterleavedBufferAttribute as He, Interpolant as Ue, InterpolateDiscrete as We, InterpolateLinear as Ge, Line as Ke, LineBasicMaterial as qe, LineLoop as Je, LineSegments as Ye, LinearFilter as Xe, LinearMipmapLinearFilter as Ze, LinearMipmapNearestFilter as Qe, LinearSRGBColorSpace as $e, Loader as et, LoaderUtils as tt, Material as nt, MathUtils as rt, Matrix4 as it, Mesh as at, MeshBasicMaterial as ot, MeshPhongMaterial as st, MeshPhysicalMaterial as ct, MeshStandardMaterial as lt, MirroredRepeatWrapping as ut, NearestFilter as dt, NearestMipmapLinearFilter as ft, NearestMipmapNearestFilter as pt, NumberKeyframeTrack as mt, Object3D as ht, OrthographicCamera as gt, PerspectiveCamera as _t, PointLight as vt, Points as yt, PointsMaterial as bt, PropertyBinding as xt, Quaternion as St, QuaternionKeyframeTrack as Ct, RepeatWrapping as wt, SRGBColorSpace as Tt, Skeleton as Et, SkinnedMesh as Dt, Sphere as Ot, SpotLight as kt, Texture as At, TextureLoader as jt, TriangleFanDrawMode as Mt, TriangleStripDrawMode as Nt, TrianglesDrawMode as Pt, Vector2 as Ft, Vector3 as It, VectorKeyframeTrack as Lt } from "three";
import { create as Rt } from "zustand";
import { useShallow as j } from "zustand/react/shallow";
import zt from "chroma-js";
import { forwardRef as Bt, memo as Vt, useCallback as M, useEffect as N, useImperativeHandle as Ht, useMemo as P, useReducer as Ut, useRef as F, useState as I } from "react";
import { Button as L, Dialog as Wt, DialogActions as Gt, DialogContent as Kt, DialogTitle as qt, Divider as Jt, IconButton as Yt, Menu as Xt, MenuItem as Zt, Paper as Qt, SvgIcon as $t, Table as en, TableBody as tn, TableCell as nn, TableContainer as rn, TableHead as an, TableRow as on, TextField as sn } from "@mui/material";
import { Fragment as R, jsx as z, jsxs as B } from "react/jsx-runtime";
import V from "@mui/material/Box";
import cn from "@mui/material/AppBar";
import ln from "@mui/material/Toolbar";
import un from "@mui/material/Button";
import dn from "@mui/material/ButtonGroup";
import fn from "@mui/material/Menu";
import pn from "@mui/material/MenuItem";
import mn from "@mui/material/Divider";
import hn from "@mui/material/IconButton";
import gn from "@mui/icons-material/Settings";
import H from "@mui/material/Typography";
import { keyframes as _n } from "@emotion/react";
import vn from "@mui/material/Drawer";
import yn from "@mui/material/InputAdornment";
import bn from "@mui/material/TextField";
import xn from "@mui/material/List";
import Sn from "@mui/material/ListItemButton";
import Cn from "@mui/material/Link";
import wn from "@mui/icons-material/Search";
import Tn from "@mui/icons-material/Close";
import En from "@mui/icons-material/Check";
import { SimpleTreeView as Dn } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem as On } from "@mui/x-tree-view/TreeItem";
import kn from "@mui/icons-material/ExpandMore";
import An from "@mui/icons-material/ChevronRight";
import jn from "@mui/icons-material/Timeline";
import Mn from "@mui/icons-material/Wifi";
import Nn from "@mui/icons-material/Mic";
import { Actions as Pn, Layout as Fn, Model as In } from "flexlayout-react";
import Ln from "@mui/material/ListItem";
import Rn from "@mui/material/ListItemIcon";
import zn from "@mui/material/ListItemText";
import Bn from "@mui/icons-material/Visibility";
import Vn from "@mui/icons-material/VisibilityOff";
import Hn from "@mui/icons-material/Delete";
import Un from "@mui/icons-material/Home";
import Wn from "@mui/icons-material/GraphicEq";
import Gn from "@mui/icons-material/Sensors";
import Kn from "@mui/icons-material/Square";
import qn from "@mui/icons-material/ViewInAr";
import Jn from "@mui/material/Collapse";
import Yn from "@mui/material/Tooltip";
import Xn from "@mui/icons-material/InfoOutlined";
import Zn from "@mui/material/Checkbox";
import Qn from "@mui/material/Select";
import $n from "@mui/icons-material/PlayArrow";
import er from "@mui/icons-material/Autorenew";
import tr from "@mui/material/ToggleButton";
import nr from "@mui/material/ToggleButtonGroup";
import rr from "@mui/icons-material/Pause";
import ir from "@mui/icons-material/Stop";
import ar from "@mui/icons-material/RestartAlt";
import or from "@mui/material/CircularProgress";
import sr from "@mui/material/Slider";
import cr from "@mui/icons-material/Add";
import lr from "@mui/icons-material/Remove";
import ur from "@mui/material/Tabs";
import dr from "@mui/material/Tab";
import { Bar as fr, BarGroup as pr, LinePath as mr } from "@visx/shape";
import { Group as hr } from "@visx/group";
import { scaleBand as gr, scaleLinear as _r, scaleOrdinal as vr } from "@visx/scale";
import { AxisBottom as yr, AxisLeft as br } from "@visx/axis";
import { Grid as xr, GridRows as Sr } from "@visx/grid";
import { ParentSize as Cr } from "@visx/responsive";
import wr from "@mui/material/FormControl";
import { LegendOrdinal as Tr } from "@visx/legend";
import Er from "@mui/icons-material/Category";
import Dr from "@mui/icons-material/MoreVert";
import Or from "@mui/icons-material/Clear";
import kr from "@mui/icons-material/ScatterPlot";
import Ar from "@mui/icons-material/AccountTree";
import jr from "@mui/icons-material/GridOn";
import Mr from "@mui/icons-material/BarChart";
import Nr from "@mui/icons-material/BlurOn";
import Pr from "@mui/icons-material/Waves";
import Fr from "@mui/icons-material/ContentCopy";
import Ir from "@mui/icons-material/Calculate";
// src/common/map.ts
function Lr(e, t, n, r, i) {
	return r + (e - t) / (n - t) * (i - r);
}
// src/common/dir-interpolation.ts
var Rr = /* @__PURE__ */ d(m());
function zr(e, t, n, r, i, a) {
	let o, s = r.theta - n.theta, c = i.phi - r.phi, l = t - n.theta, u = e - n.phi;
	return o = n.directivity * ((s - l) / s) * (u / c) + a.directivity * (l / s * (u / c)) + r.directivity * ((s - l) / s) * ((c - u) / c) + i.directivity * (l / s) * ((c - u) / c), o;
}
// src/objects/source.ts
var Br = { color: 10668418 }, Vr = [
	{
		value: "0",
		label: "None"
	},
	{
		value: "1",
		label: "Oscillator"
	},
	{
		value: "2",
		label: "Pink Noise"
	},
	{
		value: "3",
		label: "White Noise"
	},
	{
		value: "4",
		label: "Pulse"
	}
], Hr = class extends E {
	f;
	theta;
	phi;
	numRays;
	mesh;
	selectedMaterial;
	normalMaterial;
	amplitude;
	frequency;
	phase;
	value;
	previousValue;
	velocity;
	rgba;
	previousX;
	previousY;
	previousZ;
	shouldClearPreviousPosition;
	pinkNoiseSamples;
	signalSource;
	_initialSPL;
	_initialIntensity;
	fdtdSamples;
	fdtdSampleRate;
	directivityHandler;
	constructor(e, t) {
		super(e || "new source"), this.kind = "source", this.signalSource = 1, this.previousX = this.position.x, this.previousY = this.position.y, this.previousZ = this.position.z, this.shouldClearPreviousPosition = !1, this._initialSPL = 120, this._initialIntensity = ae(ie(this._initialSPL)), this.amplitude = 1, this.frequency = 100, this.phase = 0, this.value = 0, this.previousValue = 0, this.velocity = 0, this.rgba = [
			0,
			0,
			0,
			1
		], this.fdtdSamples = [], this.directivityHandler = new Wr(0), this.selectedMaterial = new A.MeshMatcapMaterial({
			fog: !1,
			color: zt(Br.color).brighten(1).num(),
			matcap: x,
			name: "source-selected-material"
		}), this.normalMaterial = new A.MeshMatcapMaterial({
			fog: !1,
			color: Br.color,
			matcap: v,
			name: "source-material"
		}), this.mesh = new A.Mesh(new A.SphereGeometry(.1, 32, 16), this.normalMaterial), this.mesh.userData.kind = "source", this.add(this.mesh), this.f = t && t.f || ((e) => Math.sin(e)), this.theta = t && t.theta || 180, this.phi = t && t.phi || 360, this.numRays = 0, this.select = () => {
			if (!this.selected) {
				this.selected = !0;
				let e = zt(this.mesh.material.color.getHex()).brighten(1).num();
				this.selectedMaterial.color.setHex(e), this.mesh.material = this.selectedMaterial;
			}
		}, this.deselect = () => {
			this.selected && (this.selected = !1, this.mesh.material = this.normalMaterial);
		}, this.renderCallback = (e) => {}, this.updateWave = this.updateWave.bind(this), this.updatePreviousPosition = this.updatePreviousPosition.bind(this), this.getWhiteNoiseSample = this.getWhiteNoiseSample.bind(this), this.getOscillatorSample = this.getOscillatorSample.bind(this), this.getPinkNoiseSample = this.getPinkNoiseSample.bind(this), this.generatePinkNoiseSamples = this.generatePinkNoiseSamples.bind(this), this.pinkNoiseSamples = /* @__PURE__ */ new Float32Array(1024), this.generatePinkNoiseSamples(), T.add(this);
	}
	dispose() {
		T.remove(this), super.dispose();
	}
	save() {
		return {
			kind: this.kind,
			name: this.name,
			visible: this.visible,
			position: this.position.toArray(),
			scale: this.scale.toArray(),
			rotation: this.rotation.toArray().slice(0, 3),
			color: this.getColorAsNumber(),
			uuid: this.uuid,
			signalSource: this.signalSource,
			amplitude: this.amplitude,
			frequency: this.frequency,
			phase: this.phase
		};
	}
	restore(e) {
		return this.name = e.name, this.visible = e.visible, this.position.set(e.position[0], e.position[1], e.position[2]), this.scale.set(e.scale[0], e.scale[1], e.scale[2]), this.rotation.set(Number(e.rotation[0]), Number(e.rotation[1]), Number(e.rotation[2])), this.color = e.color, this.uuid = e.uuid, e.signalSource !== void 0 && (this.signalSource = e.signalSource), e.amplitude !== void 0 && (this.amplitude = e.amplitude), e.frequency !== void 0 && (this.frequency = e.frequency), e.phase !== void 0 && (this.phase = e.phase), this;
	}
	updatePreviousPosition() {
		this.previousX = this.position.x, this.previousY = this.position.y, this.previousZ = this.position.z;
	}
	updateWave(e, t, n) {
		switch ((this.position.x !== this.previousX || this.position.y !== this.previousY || this.position.z !== this.previousZ) && (this.shouldClearPreviousPosition = !0), this.previousValue = this.value, this.signalSource) {
			case 0:
				this.value = 0;
				break;
			case 1:
				this.value = this.getOscillatorSample(e);
				break;
			case 2:
				this.value = this.getPinkNoiseSample(t);
				break;
			case 3:
				this.value = this.getWhiteNoiseSample();
				break;
			case 4: this.value = this.getPulseSample(e, n);
		}
		this.velocity = this.value - this.previousValue, this.rgba[0] = Lr(this.value, -2, 2, 0, 255), this.rgba[1] = Lr(this.velocity, -2, 2, 0, 255), this.rgba[3] = 0;
	}
	recordSample() {
		this.fdtdSamples.push(this.value);
	}
	getWhiteNoiseSample() {
		return Math.random() * 2 - 1;
	}
	getOscillatorSample(e) {
		return this.amplitude * Math.sin(2 * Math.PI * this.frequency * e + this.phase);
	}
	getPulseSample(e, t) {
		return e % (1 / this.frequency) < t ? this.amplitude : 0;
	}
	getPinkNoiseSample(e) {
		return e % this.pinkNoiseSamples.length === this.pinkNoiseSamples.length - 1 && this.generatePinkNoiseSamples(), this.pinkNoiseSamples[e % this.pinkNoiseSamples.length];
	}
	generatePinkNoiseSamples() {
		let e = 0, t = 0, n = 0, r = 0, i = 0, a = 0, o = 0;
		for (var s = 0; s < this.pinkNoiseSamples.length; s++) {
			var c = Math.random() * 2 - 1;
			e = .99886 * e + c * .0555179, t = .99332 * t + c * .0750759, n = .969 * n + c * .153852, r = .8665 * r + c * .3104856, i = .55 * i + c * .5329522, a = -.7616 * a - c * .016898, this.pinkNoiseSamples[s] = e + t + n + r + i + a + o + c * .5362, this.pinkNoiseSamples[s] *= .11, o = c * .115926;
		}
	}
	clearSamples() {
		this.fdtdSamples = [];
	}
	saveSamples() {
		if (this.fdtdSamples.length === 0) return;
		let e = te(this.fdtdSamples, this.fdtdSampleRate);
		Rr.default.saveAs(new Blob([e], { type: "text/plain;charset=utf-8" }), `fdtdsamples-source-${this.name}.txt`), this.fdtdSampleRate && this.fdtdSampleRate > 0 && Rr.default.saveAs(new Blob([re(this.fdtdSamples, this.fdtdSampleRate)], { type: "audio/wav" }), `fdtdsamples-source-${this.name}.wav`);
	}
	getColorAsNumber() {
		return this.mesh.material.color.getHex();
	}
	getColorAsString() {
		return "#" + this.mesh.material.color.getHexString();
	}
	onModeChange(e) {
		switch (e) {
			case D.OBJECT: break;
			case D.SKETCH: break;
			case D.EDIT:
		}
	}
	get color() {
		return "#" + this.mesh.material.color.getHexString();
	}
	set color(e) {
		typeof e == "string" ? (this.mesh.material.color.setStyle(e), this.normalMaterial.color.setStyle(e), this.selectedMaterial.color.setStyle(e)) : (this.mesh.material.color.setHex(e), this.normalMaterial.color.setHex(e), this.selectedMaterial.color.setHex(e));
	}
	get initialSPL() {
		return this._initialSPL;
	}
	set initialSPL(e) {
		this._initialSPL = e;
	}
	get initialIntensity() {
		return this._initialIntensity;
	}
	get brief() {
		return {
			uuid: this.uuid,
			name: this.name,
			selected: this.selected,
			kind: this.kind,
			children: []
		};
	}
};
n("ADD_SOURCE", ce(Hr)), n("REMOVE_SOURCE", pe), n("SOURCE_SET_PROPERTY", ue), n("SOURCE_CALL_METHOD", le);
var Ur = () => y("source"), Wr = class {
	dirDataList;
	frequencies;
	sensitivity;
	sourceDirType;
	phi;
	theta;
	clfData;
	constructor(e, t) {
		switch (this.sourceDirType = e, e) {
			case 0:
				this.frequencies = [0], this.dirDataList = [], this.phi = [], this.theta = [], this.sensitivity = [90];
				break;
			case 1:
				t ? (this.frequencies = t.frequencies, this.dirDataList = t.directivity, this.phi = t.phi, this.theta = t.theta, this.sensitivity = t.sensitivity, this.clfData = t) : (console.error("DH CLF Import Type specified but no CLFResult data was provided"), this.frequencies = [0], this.dirDataList = [], this.phi = [], this.theta = [], this.sensitivity = [], this.clfData = t);
				break;
			default: this.frequencies = [0], this.dirDataList = [], this.phi = [], this.theta = [], this.sensitivity = [], console.error("Unknown Source Directivity Type");
		}
	}
	getPressureAtPosition(e, t, n, r) {
		switch (this.sourceDirType) {
			case 0: return ie(this.sensitivity[0] + e);
			case 1: {
				if (!this.clfData) return 0;
				let i = this.clfData.angleres, a = Math.round(n / i) * i, o, s;
				a > n ? (o = a, s = o - i) : (s = a, o = s + i), o === 360 && (o = 0);
				let c = Math.round(r / i) * i, l, u;
				c > r ? (l = c, u = l - i) : (u = c, l = u + i);
				let d = this.frequencies.indexOf(t);
				d === -1 && console.error("invalid frequency");
				let f = {
					phi: s,
					theta: u,
					directivity: this.dirDataList[d].directivity[s / i][u / i]
				}, p = {
					phi: s,
					theta: l,
					directivity: this.dirDataList[d].directivity[s / i][l / i]
				}, m = {
					phi: o,
					theta: u,
					directivity: this.dirDataList[d].directivity[o / i][u / i]
				}, h = {
					phi: o,
					theta: l,
					directivity: this.dirDataList[d].directivity[o / i][l / i]
				};
				return console.log(f), console.log(p), console.log(m), console.log(h), ie(zr(n, r, f, p, m, h) + this.sensitivity[d] + e);
			}
			default: return ie(this.sensitivity[0] + e);
		}
	}
}, Gr = /* @__PURE__ */ function(e) {
	return e.OMNIDIRECTIONAL = "omni", e.CARDIOID = "cardioid", e.SUPERCARDIOID = "supercardioid", e.FIGURE_EIGHT = "figure8", e;
}({});
function Kr(e, t) {
	switch (e) {
		case "omni": return 1;
		case "cardioid": return .5 + .5 * Math.cos(t);
		case "supercardioid": return .37 + .63 * Math.cos(t);
		case "figure8": return Math.cos(t);
		default: return 1;
	}
}
var qr = {
	color: 14511983,
	selectedColor: 10472447
}, Jr = class extends E {
	mesh;
	selectedMaterial;
	normalMaterial;
	fdtdSamples;
	fdtdSampleRate;
	directivityPattern = "omni";
	constructor(e, t) {
		super(e || "new receiver"), this.kind = "receiver", this.fdtdSamples = [], this.selectedMaterial = new A.MeshMatcapMaterial({
			fog: !1,
			color: qr.color,
			matcap: x,
			name: "receiver-selected-material"
		}), this.normalMaterial = new A.MeshMatcapMaterial({
			fog: !1,
			color: qr.color,
			matcap: v,
			name: "receiver-material"
		}), this.mesh = new A.Mesh(new A.SphereGeometry(.1, 32, 16), this.normalMaterial), this.mesh.userData.kind = "receiver", this.add(this.mesh), this.select = () => {
			if (!this.selected) {
				this.selected = !0;
				let e = zt(this.mesh.material.color.getHex()).brighten(1).num();
				this.selectedMaterial.color.setHex(e), this.mesh.material = this.selectedMaterial;
			}
		}, this.deselect = () => {
			this.selected && (this.selected = !1, this.mesh.material = this.normalMaterial);
		}, this.renderCallback = (e) => {}, T.add(this);
	}
	getGain(e) {
		if (this.directivityPattern === "omni") return 1;
		let t = new A.Vector3(0, 0, 1).applyEuler(this.rotation), n = new A.Vector3(e[0], e[1], e[2]), r = t.angleTo(n);
		return Kr(this.directivityPattern, r);
	}
	dispose() {
		T.remove(this), super.dispose();
	}
	save() {
		let e = this.name, t = this.visible, n = this.position.toArray(), r = this.scale.toArray(), i = this.rotation.toArray().slice(0, 3), a = this.getColorAsNumber(), o = this.uuid;
		return {
			kind: this.kind,
			name: e,
			visible: t,
			position: n,
			scale: r,
			rotation: i,
			color: a,
			uuid: o,
			directivityPattern: this.directivityPattern
		};
	}
	restore(e) {
		this.name = e.name, this.visible = e.visible, this.position.set(e.position[0], e.position[1], e.position[2]), this.scale.set(e.scale[0], e.scale[1], e.scale[2]), this.rotation.set(Number(e.rotation[0]), Number(e.rotation[1]), Number(e.rotation[2])), this.color = e.color, this.uuid = e.uuid;
		let t = e.directivityPattern;
		return this.directivityPattern = t && Object.values(Gr).includes(t) ? t : "omni", this;
	}
	clearSamples() {
		this.fdtdSamples = [];
	}
	fdtdOutput() {
		return this.fdtdSampleRate && this.fdtdSampleRate > 0 ? ne(this.fdtdSamples, this.fdtdSampleRate) : [...this.fdtdSamples];
	}
	saveSamples() {
		if (this.fdtdSamples.length === 0) return;
		let e = this.fdtdOutput(), t = te(e, this.fdtdSampleRate);
		Rr.default.saveAs(new Blob([t], { type: "text/plain;charset=utf-8" }), `fdtdsamples-receiver-${this.name}.txt`), this.fdtdSampleRate && this.fdtdSampleRate > 0 && Rr.default.saveAs(new Blob([re(e, this.fdtdSampleRate)], { type: "audio/wav" }), `fdtdsamples-receiver-${this.name}.wav`);
	}
	getColorAsNumber() {
		return this.mesh.material.color.getHex();
	}
	getColorAsString() {
		return "#" + this.mesh.material.color.getHexString();
	}
	onModeChange(e) {
		switch (e) {
			case D.OBJECT: break;
			case D.SKETCH: break;
			case D.EDIT:
		}
	}
	get color() {
		return "#" + this.mesh.material.color.getHexString();
	}
	set color(e) {
		typeof e == "string" ? (this.mesh.material.color.setStyle(e), this.normalMaterial.color.setStyle(e), this.selectedMaterial.color.setStyle(e)) : (this.mesh.material.color.setHex(e), this.normalMaterial.color.setHex(e), this.selectedMaterial.color.setHex(e));
	}
	get brief() {
		return {
			uuid: this.uuid,
			name: this.name,
			selected: this.selected,
			kind: this.kind,
			children: []
		};
	}
};
n("ADD_RECEIVER", ce(Jr)), n("REMOVE_RECEIVER", pe), n("RECEIVER_SET_PROPERTY", ue);
var Yr = () => y("receiver"), { min: Xr, max: Zr } = Math, Qr = class extends E {
	boundingBox;
	volume;
	mesh;
	constructor(e, t) {
		super(e), this.kind = "model", this.init(t, !0);
	}
	init(e, t = !1) {
		let { bufferGeometry: n } = e, r = n.getAttribute("position"), i = n.getAttribute("NORMAL"), a = /* @__PURE__ */ new Map(), o = [], c = [], l = [], u = [], d = [];
		for (let e = 0; e < r.count; e++) {
			let t = "";
			t += r.array[e * r.itemSize + 0].toFixed(6), t += r.array[e * r.itemSize + 1].toFixed(6), t += r.array[e * r.itemSize + 2].toFixed(6), a.has(t) || (a.set(t, a.size), l.push(r.array[e * r.itemSize + 0], r.array[e * r.itemSize + 1], r.array[e * r.itemSize + 2]), u.push(i.array[e * i.itemSize + 0], i.array[e * i.itemSize + 1], i.array[e * i.itemSize + 2]), d.push(.7, .6, .8)), o.push(a.get(t));
		}
		let f = new A.BufferGeometry();
		f.setIndex(o);
		let p = new A.Float32BufferAttribute(l, 3);
		p.setUsage(A.DynamicDrawUsage), f.setAttribute("position", p), f.setAttribute("normal", new A.Float32BufferAttribute(u, 3)), f.setAttribute("color", new A.Float32BufferAttribute(d, 3));
		let m = /* @__PURE__ */ new Set(), h = (e) => `${Xr(...e)}${Zr(...e)}`, g = s(m);
		for (let e = 0; e < o.length / 3; e++) {
			let t = o[e * 3 + 0], n = o[e * 3 + 1], r = o[e * 3 + 2];
			[
				[t, n],
				[n, r],
				[r, t]
			].forEach((e) => {
				let t = h(e);
				g(t) && c.push(...e);
			});
		}
		f.addGroup(0, 72, 1);
		let _ = new A.MeshPhongMaterial({
			fog: !1,
			transparent: !0,
			side: A.DoubleSide,
			vertexColors: !0,
			depthWrite: !0,
			depthTest: !1
		}), v = new A.MeshPhongMaterial({
			color: 11184810,
			specular: 16777215,
			shininess: 250,
			side: A.DoubleSide,
			vertexColors: !0
		}), y = new A.BufferGeometry();
		this.mesh = new A.Mesh(f, [_, v]), this.add(this.mesh), y.setIndex(c), y.setAttribute("position", p);
		let b = new A.LineBasicMaterial({
			color: 16777215,
			transparent: !0
		});
		this.add(new A.LineSegments(y, b)), this.mesh.geometry.computeBoundingBox(), this.mesh.geometry.computeBoundingSphere();
	}
	get vertexBuffer() {
		return this.mesh.geometry.getAttribute("position");
	}
	setVertexPosition(e, t, n, r) {
		this.vertexBuffer.setXYZ(e, t, n, r).needsUpdate = !0;
	}
	save() {
		return {
			kind: this.kind,
			name: this.name,
			uuid: this.uuid,
			visible: this.visible,
			position: this.position.toArray(),
			rotation: this.rotation.toArray().slice(0, 3),
			scale: this.scale.toArray()
		};
	}
	restore(e) {
		return this.visible = e.visible, this.position.set(e.position[0], e.position[1], e.position[2]), this.rotation.set(e.rotation[0], e.rotation[1], e.rotation[2], "XYZ"), this.scale.set(e.scale[0], e.scale[1], e.scale[2]), this.uuid = e.uuid, this;
	}
	select() {}
	deselect() {}
	calculateBoundingBox() {}
	signedVolumeOfTriangle(e, t, n) {
		return e.dot(t.clone().cross(n)) / 6;
	}
	volumeOfMesh() {}
	get brief() {
		return {
			uuid: this.uuid,
			name: this.name,
			selected: this.selected,
			children: [],
			kind: this.kind
		};
	}
}, $r = class {
	uuid;
	name;
	filename;
	duration;
	length;
	numberOfChannels;
	sampleRate;
	channelData;
	constructor(e) {
		this.uuid = r(), this.name = e.name, this.filename = e.filename, this.duration = e.duration, this.sampleRate = e.sampleRate, this.length = e.length, this.numberOfChannels = e.numberOfChannels, this.channelData = e.channelData;
	}
	downsample(e) {
		let t = this.sampleRate, n = this.channelData[0].length, r = t / e, i = n / r, a = [];
		for (let e = 0; e < this.numberOfChannels; e++) {
			let t = new Float32Array(i - 1);
			for (let n = 0; n < i - 1; n++) {
				let i = n * r, a = Math.floor(i), o = a + 1, s = i - Math.floor(i), c = this.channelData[e][a] + (this.channelData[e][o] - this.channelData[e][a]) * s;
				t[n] = c;
			}
			a.push(t);
		}
		return a;
	}
}, ei = class extends A.Group {
	sketchPlane;
	sketchPlaneMesh;
	sketchPlaneMaterial;
	sketchPlaneNormal;
	sketchPlaneCentroid;
	constructor(e) {
		super(), this.sketchPlaneNormal = e.normal, this.sketchPlaneCentroid = e.point, this.sketchPlane = new A.Plane(), this.sketchPlane.setFromNormalAndCoplanarPoint(this.sketchPlaneNormal, this.sketchPlaneCentroid).normalize();
		var t = new A.PlaneGeometry(1e3, 1e3);
		let n = new A.Vector3();
		this.sketchPlane.coplanarPoint(n);
		var r = new A.Vector3().copy(n).add(this.sketchPlane.normal);
		t.lookAt(r), t.translate(n.x, n.y, n.z), this.sketchPlaneMaterial = new A.MeshLambertMaterial({
			color: 12351748,
			side: A.DoubleSide,
			transparent: !0,
			opacity: .05
		}), this.sketchPlaneMesh = new A.Mesh(t, this.sketchPlaneMaterial), this.add(this.sketchPlaneMesh);
	}
}, ti = /* @__PURE__ */ new Map();
function ni(e, t) {
	ti.set(e, t);
}
async function ri(e, t, n) {
	let r = ti.get(e);
	if (!r) throw Error(`Unknown solver type: ${e}`);
	return r(t, n);
}
ni("ray-tracer", async (e, t) => {
	let { default: n } = await import("./raytracer-HTlzDwVA.mjs");
	return new n(t);
}), ni("image-source", async (e, t) => {
	let { ImageSourceSolver: n } = await import("./image-source-8WXJD5JQ.mjs");
	return new n({
		name: "Image Source",
		roomID: "",
		sourceIDs: [],
		surfaceIDs: [],
		receiverIDs: [],
		maxReflectionOrder: 2,
		imageSourcesVisible: !1,
		rayPathsVisible: !0,
		plotOrders: [
			0,
			1,
			2
		],
		frequencies: [
			125,
			250,
			500,
			1e3,
			2e3,
			4e3,
			8e3
		],
		...t
	});
}), ni("rt60", async (e, t) => {
	let { default: n } = await import("./rt-BXAnNt2t.mjs");
	return new n();
}), ni("energydecay", async (e, t) => {
	let { default: n } = await import("./energy-decay-DlXZUnk2.mjs");
	return new n();
}), ni("fdtd-2d", async (e, t) => {
	let { default: n } = await import("./2d-fdtd-mO3GKNR3.mjs");
	return new n();
}), ni("beam-trace", async (e, t) => {
	let { BeamTraceSolver: n } = await import("./beam-trace-D_40fITR.mjs");
	return new n();
}), ni("art", async (e, t) => {
	let { ART: n } = await import("./art-Dal1aavR.mjs");
	return new n();
}), ni("ard", async (e, t) => {
	let { ARD: n } = await import("./ard-CnpF2sat.mjs");
	return new n(t);
});
// node_modules/three/examples/jsm/loaders/STLLoader.js
var ii = class extends et {
	constructor(e) {
		super(e);
	}
	load(e, t, n, r) {
		let i = this, a = new Pe(this.manager);
		a.setPriority(this.priority), a.setCache(this.cache), a.setPath(this.path), a.setResponseType("arraybuffer"), a.setRequestHeader(this.requestHeader), a.setWithCredentials(this.withCredentials), a.load(e, function(n) {
			try {
				t(i.parse(n));
			} catch (t) {
				r ? r(t) : console.error(t), i.manager.itemError(e);
			}
		}, n, r);
	}
	parse(e) {
		function t(e) {
			let t = new DataView(e);
			if (84 + t.getUint32(80, !0) * 50 === t.byteLength) return !0;
			let r = [
				115,
				111,
				108,
				105,
				100
			];
			for (let e = 0; e < 5; e++) if (n(r, t, e)) return !1;
			return !0;
		}
		function n(e, t, n) {
			for (let r = 0, i = e.length; r < i; r++) if (e[r] !== t.getUint8(n + r)) return !1;
			return !0;
		}
		function r(e) {
			let t = new DataView(e), n = t.getUint32(80, !0), r, i, a, o = !1, s, c, l, u, d;
			for (let e = 0; e <= 70; e++) t.getUint32(e, !1) == 1129270351 && t.getUint8(e + 4) == 82 && t.getUint8(e + 5) == 61 && (o = !0, s = new Float32Array(n * 3 * 3), c = t.getUint8(e + 6) / 255, l = t.getUint8(e + 7) / 255, u = t.getUint8(e + 8) / 255, d = t.getUint8(e + 9) / 255);
			let f = new Oe(), p = new Float32Array(n * 3 * 3), m = new Float32Array(n * 3 * 3), h = new Ae();
			for (let e = 0; e < n; e++) {
				let n = 84 + e * 50, d = t.getFloat32(n, !0), f = t.getFloat32(n + 4, !0), g = t.getFloat32(n + 8, !0);
				if (o) {
					let e = t.getUint16(n + 48, !0);
					e & 32768 ? (r = c, i = l, a = u) : (r = (e & 31) / 31, i = (e >> 5 & 31) / 31, a = (e >> 10 & 31) / 31);
				}
				for (let c = 1; c <= 3; c++) {
					let l = n + c * 12, u = e * 3 * 3 + (c - 1) * 3;
					p[u] = t.getFloat32(l, !0), p[u + 1] = t.getFloat32(l + 4, !0), p[u + 2] = t.getFloat32(l + 8, !0), m[u] = d, m[u + 1] = f, m[u + 2] = g, o && (h.setRGB(r, i, a, Tt), s[u] = h.r, s[u + 1] = h.g, s[u + 2] = h.b);
				}
			}
			return f.setAttribute("position", new De(p, 3)), f.setAttribute("normal", new De(m, 3)), o && (f.setAttribute("color", new De(s, 3)), f.hasColors = !0, f.alpha = d), f;
		}
		function i(e) {
			let t = new Oe(), n = /solid([\s\S]*?)endsolid/g, r = /facet([\s\S]*?)endfacet/g, i = /solid\s(.+)/, a = 0, o = "[\\s]+([+-]?(?:\\d*)(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)", s = RegExp("vertex" + o + o + o, "g"), c = RegExp("normal" + o + o + o, "g"), l = [], u = [], d = [], f = new It(), p, m = 0, h = 0, g = 0;
			for (; (p = n.exec(e)) !== null;) {
				h = g;
				let e = p[0], n = (p = i.exec(e)) === null ? "" : p[1];
				for (d.push(n); (p = r.exec(e)) !== null;) {
					let e = 0, t = 0, n = p[0];
					for (; (p = c.exec(n)) !== null;) f.x = parseFloat(p[1]), f.y = parseFloat(p[2]), f.z = parseFloat(p[3]), t++;
					for (; (p = s.exec(n)) !== null;) l.push(parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3])), u.push(f.x, f.y, f.z), e++, g++;
					t !== 1 && console.error("THREE.STLLoader: Something isn't right with the normal of face number " + a), e !== 3 && console.error("THREE.STLLoader: Something isn't right with the vertices of face number " + a), a++;
				}
				let o = h, _ = g - h;
				t.userData.groupNames = d, t.addGroup(o, _, m), m++;
			}
			return t.setAttribute("position", new Fe(l, 3)), t.setAttribute("normal", new Fe(u, 3)), t;
		}
		function a(e) {
			return typeof e == "string" ? e : new TextDecoder().decode(e);
		}
		function o(e) {
			if (typeof e == "string") {
				let t = new Uint8Array(e.length);
				for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n) & 255;
				return t.buffer || t;
			}
			return e;
		}
		let s = o(e);
		return t(s) ? r(s) : i(a(e));
	}
}, ai = class extends et {
	constructor(e) {
		super(e), this.debug = !1, this.group = null, this.materials = [], this.meshes = [];
	}
	load(e, t, n, r) {
		let i = this, a = this.path === "" ? tt.extractUrlBase(e) : this.path, o = new Pe(this.manager);
		o.setPriority(this.priority), o.setCache(this.cache), o.setPath(this.path), o.setResponseType("arraybuffer"), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(e, function(n) {
			try {
				t(i.parse(n, a));
			} catch (t) {
				r ? r(t) : console.error(t), i.manager.itemError(e);
			}
		}, n, r);
	}
	parse(e, t) {
		this.group = new Le(), this.materials = [], this.meshes = [], this.readFile(e, t);
		for (let e = 0; e < this.meshes.length; e++) this.group.add(this.meshes[e]);
		return this.group;
	}
	readFile(e, t) {
		let n = new oi(new DataView(e), 0, this.debugMessage);
		if (n.id === ci || n.id === li || n.id === si) {
			let e = n.readChunk();
			for (; e;) {
				if (e.id === ui) {
					let t = e.readDWord();
					this.debugMessage("3DS file version: " + t);
				} else e.id === _i ? this.readMeshData(e, t) : this.debugMessage("Unknown main chunk: " + e.hexId);
				e = n.readChunk();
			}
		}
		this.debugMessage("Parsed " + this.meshes.length + " meshes");
	}
	readMeshData(e, t) {
		let n = e.readChunk();
		for (; n;) {
			if (n.id === vi) {
				let e = +n.readDWord();
				this.debugMessage("Mesh Version: " + e);
			} else if (n.id === yi) {
				let e = n.readFloat();
				this.debugMessage("Master scale: " + e), this.group.scale.set(e, e, e);
			} else n.id === Bi ? (this.debugMessage("Named Object"), this.readNamedObject(n)) : n.id === bi ? (this.debugMessage("Material"), this.readMaterialEntry(n, t)) : this.debugMessage("Unknown MDATA chunk: " + n.hexId);
			n = e.readChunk();
		}
	}
	readNamedObject(e) {
		let t = e.readString(), n = e.readChunk();
		for (; n;) {
			if (n.id === Vi) {
				let e = this.readMesh(n);
				e.name = t, this.meshes.push(e);
			} else this.debugMessage("Unknown named object chunk: " + n.hexId);
			n = e.readChunk();
		}
	}
	readMaterialEntry(e, t) {
		let n = e.readChunk(), r = new st();
		for (; n;) {
			if (n.id === xi) r.name = n.readString(), this.debugMessage("   Name: " + r.name);
			else if (n.id === ki) this.debugMessage("   Wireframe"), r.wireframe = !0;
			else if (n.id === Ai) {
				let e = n.readByte();
				r.wireframeLinewidth = e, this.debugMessage("   Wireframe Thickness: " + e);
			} else if (n.id === Di) r.side = Ne, this.debugMessage("   DoubleSided");
			else if (n.id === Oi) this.debugMessage("   Additive Blending"), r.blending = Ce;
			else if (n.id === Ci) this.debugMessage("   Diffuse Color"), r.color = this.readColor(n);
			else if (n.id === wi) this.debugMessage("   Specular Color"), r.specular = this.readColor(n);
			else if (n.id === Si) this.debugMessage("   Ambient color"), r.color = this.readColor(n);
			else if (n.id === Ti) {
				let e = this.readPercentage(n);
				r.shininess = e * 100, this.debugMessage("   Shininess : " + e);
			} else if (n.id === Ei) {
				let e = this.readPercentage(n);
				r.opacity = 1 - e, this.debugMessage("  Transparency : " + e), r.transparent = r.opacity < 1;
			} else n.id === ji ? (this.debugMessage("   ColorMap"), r.map = this.readMap(n, t)) : n.id === Ni ? (this.debugMessage("   BumpMap"), r.bumpMap = this.readMap(n, t)) : n.id === Mi ? (this.debugMessage("   OpacityMap"), r.alphaMap = this.readMap(n, t)) : n.id === Pi ? (this.debugMessage("   SpecularMap"), r.specularMap = this.readMap(n, t)) : this.debugMessage("   Unknown material chunk: " + n.hexId);
			n = e.readChunk();
		}
		this.materials[r.name] = r;
	}
	readMesh(e) {
		let t = e.readChunk(), n = new Oe(), r = new st(), i = new at(n, r);
		for (i.name = "mesh"; t;) {
			if (t.id === Hi) {
				let e = t.readWord();
				this.debugMessage("   Vertex: " + e);
				let r = [];
				for (let n = 0; n < e; n++) r.push(t.readFloat()), r.push(t.readFloat()), r.push(t.readFloat());
				n.setAttribute("position", new Fe(r, 3));
			} else if (t.id === Ui) this.readFaceArray(t, i);
			else if (t.id === Gi) {
				let e = t.readWord();
				this.debugMessage("   UV: " + e);
				let r = [];
				for (let n = 0; n < e; n++) r.push(t.readFloat()), r.push(t.readFloat());
				n.setAttribute("uv", new Fe(r, 2));
			} else if (t.id === Ki) {
				this.debugMessage("   Transformation Matrix (TODO)");
				let e = [];
				for (let n = 0; n < 12; n++) e[n] = t.readFloat();
				let r = new it();
				r.elements[0] = e[0], r.elements[1] = e[6], r.elements[2] = e[3], r.elements[3] = e[9], r.elements[4] = e[2], r.elements[5] = e[8], r.elements[6] = e[5], r.elements[7] = e[11], r.elements[8] = e[1], r.elements[9] = e[7], r.elements[10] = e[4], r.elements[11] = e[10], r.elements[12] = 0, r.elements[13] = 0, r.elements[14] = 0, r.elements[15] = 1, r.transpose();
				let a = new it();
				a.copy(r).invert(), n.applyMatrix4(a), r.decompose(i.position, i.quaternion, i.scale);
			} else this.debugMessage("   Unknown mesh chunk: " + t.hexId);
			t = e.readChunk();
		}
		return n.computeVertexNormals(), i;
	}
	readFaceArray(e, t) {
		let n = e.readWord();
		this.debugMessage("   Faces: " + n);
		let r = [];
		for (let t = 0; t < n; ++t) r.push(e.readWord(), e.readWord(), e.readWord()), e.readWord();
		t.geometry.setIndex(r);
		let i = 0, a = 0;
		for (; !e.endOfChunk;) {
			let n = e.readChunk();
			if (n.id === Wi) {
				this.debugMessage("      Material Group");
				let e = this.readMaterialGroup(n), r = e.index.length * 3;
				t.geometry.addGroup(a, r, i), a += r, i++;
				let o = this.materials[e.name];
				Array.isArray(t.material) === !1 && (t.material = []), o !== void 0 && t.material.push(o);
			} else this.debugMessage("      Unknown face array chunk: " + n.hexId);
		}
		t.material.length === 1 && (t.material = t.material[0]);
	}
	readMap(e, t) {
		let n = e.readChunk(), r = {}, i = new jt(this.manager);
		for (i.setPriority(this.priority), i.setCache(this.cache), i.setPath(this.resourcePath || t).setCrossOrigin(this.crossOrigin); n;) {
			if (n.id === Fi) {
				let e = n.readString();
				r = i.load(e), this.debugMessage("      File: " + t + e);
			} else n.id === Ri ? (r.offset.x = n.readFloat(), this.debugMessage("      OffsetX: " + r.offset.x)) : n.id === zi ? (r.offset.y = n.readFloat(), this.debugMessage("      OffsetY: " + r.offset.y)) : n.id === Ii ? (r.repeat.x = n.readFloat(), this.debugMessage("      RepeatX: " + r.repeat.x)) : n.id === Li ? (r.repeat.y = n.readFloat(), this.debugMessage("      RepeatY: " + r.repeat.y)) : this.debugMessage("      Unknown map chunk: " + n.hexId);
			n = e.readChunk();
		}
		return r;
	}
	readMaterialGroup(e) {
		let t = e.readString(), n = e.readWord();
		this.debugMessage("         Name: " + t), this.debugMessage("         Faces: " + n);
		let r = [];
		for (let t = 0; t < n; ++t) r.push(e.readWord());
		return {
			name: t,
			index: r
		};
	}
	readColor(e) {
		let t = e.readChunk(), n = new Ae();
		if (t.id === fi || t.id === pi) {
			let e = t.readByte(), r = t.readByte(), i = t.readByte();
			n.setRGB(e / 255, r / 255, i / 255), this.debugMessage("      Color: " + n.r + ", " + n.g + ", " + n.b);
		} else if (t.id === di || t.id === mi) {
			let e = t.readFloat(), r = t.readFloat(), i = t.readFloat();
			n.setRGB(e, r, i), this.debugMessage("      Color: " + n.r + ", " + n.g + ", " + n.b);
		} else this.debugMessage("      Unknown color chunk: " + t.hexId);
		return n;
	}
	readPercentage(e) {
		let t = e.readChunk();
		switch (t.id) {
			case hi: return t.readShort() / 100;
			case gi: return t.readFloat();
			default: return this.debugMessage("      Unknown percentage chunk: " + t.hexId), 0;
		}
	}
	debugMessage(e) {
		this.debug && console.log(e);
	}
}, oi = class e {
	constructor(e, t, n) {
		this.data = e, this.offset = t, this.position = t, this.debugMessage = n, this.debugMessage instanceof Function && (this.debugMessage = function() {}), this.id = this.readWord(), this.size = this.readDWord(), this.end = this.offset + this.size, this.end > e.byteLength && this.debugMessage("Bad chunk size for chunk at " + t);
	}
	readChunk() {
		if (this.endOfChunk) return null;
		try {
			let t = new e(this.data, this.position, this.debugMessage);
			return this.position += t.size, t;
		} catch {
			return this.debugMessage("Unable to read chunk at " + this.position), null;
		}
	}
	get hexId() {
		return this.id.toString(16);
	}
	get endOfChunk() {
		return this.position >= this.end;
	}
	readByte() {
		let e = this.data.getUint8(this.position, !0);
		return this.position += 1, e;
	}
	readFloat() {
		try {
			let e = this.data.getFloat32(this.position, !0);
			return this.position += 4, e;
		} catch (e) {
			return this.debugMessage(e + " " + this.position + " " + this.data.byteLength), 0;
		}
	}
	readInt() {
		let e = this.data.getInt32(this.position, !0);
		return this.position += 4, e;
	}
	readShort() {
		let e = this.data.getInt16(this.position, !0);
		return this.position += 2, e;
	}
	readDWord() {
		let e = this.data.getUint32(this.position, !0);
		return this.position += 4, e;
	}
	readWord() {
		let e = this.data.getUint16(this.position, !0);
		return this.position += 2, e;
	}
	readString() {
		let e = "", t = this.readByte();
		for (; t;) e += String.fromCharCode(t), t = this.readByte();
		return e;
	}
}, si = 19789, ci = 15786, li = 49725, ui = 2, di = 16, fi = 17, pi = 18, mi = 19, hi = 48, gi = 49, _i = 15677, vi = 15678, yi = 256, bi = 45055, xi = 40960, Si = 40976, Ci = 40992, wi = 41008, Ti = 41024, Ei = 41040, Di = 41089, Oi = 41091, ki = 41093, Ai = 41095, ji = 41472, Mi = 41488, Ni = 41520, Pi = 41476, Fi = 41728, Ii = 41812, Li = 41814, Ri = 41816, zi = 41818, Bi = 16384, Vi = 16640, Hi = 16656, Ui = 16672, Wi = 16688, Gi = 16704, Ki = 16736;
// node_modules/three/examples/jsm/utils/BufferGeometryUtils.js
function qi(e, t) {
	if (t === Pt) return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), e;
	if (t === Mt || t === Nt) {
		let n = e.getIndex();
		if (n === null) {
			let t = [], r = e.getAttribute("position");
			if (r !== void 0) {
				for (let e = 0; e < r.count; e++) t.push(e);
				e.setIndex(t), n = e.getIndex();
			} else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), e;
		}
		let r = n.count - 2, i = [];
		if (t === Mt) for (let e = 1; e <= r; e++) i.push(n.getX(0)), i.push(n.getX(e)), i.push(n.getX(e + 1));
		else for (let e = 0; e < r; e++) e % 2 == 0 ? (i.push(n.getX(e)), i.push(n.getX(e + 1)), i.push(n.getX(e + 2))) : (i.push(n.getX(e + 2)), i.push(n.getX(e + 1)), i.push(n.getX(e)));
		return i.length / 3 !== r && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."), e.setIndex(i), e.clearGroups(), e;
	}
	return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", t), e;
}
// node_modules/three/examples/jsm/utils/SkeletonUtils.js
function Ji(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = e.clone();
	return Yi(e, r, function(e, r) {
		t.set(r, e), n.set(e, r);
	}), r.traverse(function(e) {
		if (!e.isSkinnedMesh) return;
		let r = e, i = t.get(e), a = i.skeleton.bones;
		r.skeleton = i.skeleton.clone(), r.bindMatrix.copy(i.bindMatrix), r.skeleton.bones = a.map(function(e) {
			return n.get(e);
		}), r.bind(r.skeleton, r.bindMatrix);
	}), r;
}
function Yi(e, t, n) {
	n(e, t);
	for (let r = 0; r < e.children.length; r++) Yi(e.children[r], t.children[r], n);
}
// node_modules/three/examples/jsm/loaders/GLTFLoader.js
var Xi = class extends et {
	constructor(e) {
		super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(e) {
			return new ta(e);
		}), this.register(function(e) {
			return new na(e);
		}), this.register(function(e) {
			return new ra(e);
		}), this.register(function(e) {
			return new fa(e);
		}), this.register(function(e) {
			return new pa(e);
		}), this.register(function(e) {
			return new ma(e);
		}), this.register(function(e) {
			return new aa(e);
		}), this.register(function(e) {
			return new oa(e);
		}), this.register(function(e) {
			return new sa(e);
		}), this.register(function(e) {
			return new ca(e);
		}), this.register(function(e) {
			return new ea(e);
		}), this.register(function(e) {
			return new la(e);
		}), this.register(function(e) {
			return new ia(e);
		}), this.register(function(e) {
			return new da(e);
		}), this.register(function(e) {
			return new ua(e);
		}), this.register(function(e) {
			return new Qi(e);
		}), this.register(function(e) {
			return new ha(e, W.EXT_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new ha(e, W.KHR_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new ga(e);
		});
	}
	load(e, t, n, r) {
		let i = this, a;
		if (this.resourcePath !== "") a = this.resourcePath;
		else if (this.path !== "") {
			let t = tt.extractUrlBase(e);
			a = tt.resolveURL(t, this.path);
		} else a = tt.extractUrlBase(e);
		this.manager.itemStart(e);
		let o = function(t) {
			r ? r(t) : console.error(t), i.manager.itemError(e), i.manager.itemEnd(e);
		}, s = new Pe(this.manager);
		s.setPriority(this.priority), s.setCache(this.cache), s.setPath(this.path), s.setResponseType("arraybuffer"), s.setRequestHeader(this.requestHeader), s.setWithCredentials(this.withCredentials), s.load(e, function(n) {
			try {
				i.parse(n, a, function(n) {
					t(n), i.manager.itemEnd(e);
				}, o);
			} catch (e) {
				o(e);
			}
		}, n, o);
	}
	setDRACOLoader(e) {
		return this.dracoLoader = e, this;
	}
	setKTX2Loader(e) {
		return this.ktx2Loader = e, this;
	}
	setMeshoptDecoder(e) {
		return this.meshoptDecoder = e, this;
	}
	register(e) {
		return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
	}
	unregister(e) {
		return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
	}
	parse(e, t, n, r) {
		let i, a = {}, o = {}, s = new TextDecoder();
		if (typeof e == "string") i = JSON.parse(e);
		else if (e instanceof ArrayBuffer) {
			if (s.decode(new Uint8Array(e, 0, 4)) === _a) {
				try {
					a[W.KHR_BINARY_GLTF] = new ba(e);
				} catch (e) {
					r && r(e);
					return;
				}
				i = JSON.parse(a[W.KHR_BINARY_GLTF].content);
			} else i = JSON.parse(s.decode(e));
		} else i = e;
		if (i.asset === void 0 || i.asset.version[0] < 2) {
			r && r(/* @__PURE__ */ Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
			return;
		}
		let c = new Ka(i, {
			path: t || this.resourcePath || "",
			crossOrigin: this.crossOrigin,
			priority: this.priority,
			cache: this.cache,
			withCredentials: this.withCredentials,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder
		});
		c.fileLoader.setRequestHeader(this.requestHeader);
		for (let e = 0; e < this.pluginCallbacks.length; e++) {
			let t = this.pluginCallbacks[e](c);
			t.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), o[t.name] = t, a[t.name] = !0;
		}
		if (i.extensionsUsed) for (let e = 0; e < i.extensionsUsed.length; ++e) {
			let t = i.extensionsUsed[e], n = i.extensionsRequired || [];
			switch (t) {
				case W.KHR_MATERIALS_UNLIT:
					a[t] = new $i();
					break;
				case W.KHR_DRACO_MESH_COMPRESSION:
					a[t] = new xa(i, this.dracoLoader);
					break;
				case W.KHR_TEXTURE_TRANSFORM:
					a[t] = new Sa();
					break;
				case W.KHR_MESH_QUANTIZATION:
					a[t] = new Ca();
					break;
				default: n.indexOf(t) >= 0 && o[t] === void 0 && console.warn("THREE.GLTFLoader: Unknown extension \"" + t + "\".");
			}
		}
		c.setExtensions(a), c.setPlugins(o), c.parse(n, r);
	}
	parseAsync(e, t) {
		let n = this;
		return new Promise(function(r, i) {
			n.parse(e, t, r, i);
		});
	}
};
function Zi() {
	let e = {};
	return {
		get: function(t) {
			return e[t];
		},
		add: function(t, n) {
			e[t] = n;
		},
		remove: function(t) {
			delete e[t];
		},
		removeAll: function() {
			e = {};
		}
	};
}
function U(e, t, n) {
	let r = e.json.materials[t];
	return r.extensions && r.extensions[n] ? r.extensions[n] : null;
}
var W = {
	KHR_BINARY_GLTF: "KHR_binary_glTF",
	KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
	KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
	KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
	KHR_MATERIALS_DIFFUSE_ROUGHNESS: "KHR_materials_diffuse_roughness",
	KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
	KHR_MATERIALS_IOR: "KHR_materials_ior",
	KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
	KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
	KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
	KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
	KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
	KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
	KHR_MATERIALS_VOLUME: "KHR_materials_volume",
	KHR_TEXTURE_BASISU: "KHR_texture_basisu",
	KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
	KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
	KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
	EXT_MATERIALS_BUMP: "EXT_materials_bump",
	EXT_TEXTURE_WEBP: "EXT_texture_webp",
	EXT_TEXTURE_AVIF: "EXT_texture_avif",
	EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
	KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
	EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
}, Qi = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_LIGHTS_PUNCTUAL, this.cache = {
			refs: {},
			uses: {}
		};
	}
	_markDefs() {
		let e = this.parser, t = this.parser.json.nodes || [];
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n];
			r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
		}
	}
	_loadLight(e) {
		let t = this.parser, n = "light:" + e, r = t.cache.get(n);
		if (r) return r;
		let i = t.json, a = ((i.extensions && i.extensions[this.name] || {}).lights || [])[e], o, s = new Ae(16777215);
		a.color !== void 0 && s.setRGB(a.color[0], a.color[1], a.color[2], $e);
		let c = a.range === void 0 ? 0 : a.range;
		switch (a.type) {
			case "directional":
				o = new Me(s), o.target.position.set(0, 0, -1), o.add(o.target);
				break;
			case "point":
				o = new vt(s), o.distance = c;
				break;
			case "spot":
				o = new kt(s), o.distance = c, a.spot = a.spot || {}, a.spot.innerConeAngle = a.spot.innerConeAngle === void 0 ? 0 : a.spot.innerConeAngle, a.spot.outerConeAngle = a.spot.outerConeAngle === void 0 ? Math.PI / 4 : a.spot.outerConeAngle, o.angle = a.spot.outerConeAngle, o.penumbra = 1 - a.spot.innerConeAngle / a.spot.outerConeAngle, o.target.position.set(0, 0, -1), o.add(o.target);
				break;
			default: throw Error("THREE.GLTFLoader: Unexpected light type: " + a.type);
		}
		return o.position.set(0, 0, 0), Ra(o, a), a.intensity !== void 0 && (o.intensity = a.intensity), o.name = t.createUniqueName(a.name || "light_" + e), r = Promise.resolve(o), t.cache.add(n, r), r;
	}
	getDependency(e, t) {
		if (e === "light") return this._loadLight(t);
	}
	createNodeAttachment(e) {
		let t = this, n = this.parser, r = n.json.nodes[e], i = (r.extensions && r.extensions[this.name] || {}).light;
		return i === void 0 ? null : this._loadLight(i).then(function(e) {
			return n._getNodeRef(t.cache, i, e);
		});
	}
}, $i = class {
	constructor() {
		this.name = W.KHR_MATERIALS_UNLIT;
	}
	getMaterialType() {
		return ot;
	}
	extendParams(e, t, n) {
		let r = [];
		e.color = new Ae(1, 1, 1), e.opacity = 1;
		let i = t.pbrMetallicRoughness;
		if (i) {
			if (Array.isArray(i.baseColorFactor)) {
				let t = i.baseColorFactor;
				e.color.setRGB(t[0], t[1], t[2], $e), e.opacity = t[3];
			}
			i.baseColorTexture !== void 0 && r.push(n.assignTexture(e, "map", i.baseColorTexture, Tt));
		}
		return Promise.all(r);
	}
}, ea = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_EMISSIVE_STRENGTH;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		return n === null || n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength), Promise.resolve();
	}
}, ta = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_CLEARCOAT;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor), n.clearcoatTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)), n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor), n.clearcoatRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)), n.clearcoatNormalTexture !== void 0 && (r.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)), n.clearcoatNormalTexture.scale !== void 0)) {
			let e = n.clearcoatNormalTexture.scale;
			t.clearcoatNormalScale = new Ft(e, e);
		}
		return Promise.all(r);
	}
}, na = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_DIFFUSE_ROUGHNESS;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return t.diffuseRoughness = n.diffuseRoughnessFactor === void 0 ? 0 : n.diffuseRoughnessFactor, n.diffuseRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "diffuseRoughnessMap", n.diffuseRoughnessTexture)), Promise.all(r);
	}
}, ra = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_DISPERSION;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		return n === null || (t.dispersion = n.dispersion === void 0 ? 0 : n.dispersion), Promise.resolve();
	}
}, ia = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_IRIDESCENCE;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor), n.iridescenceTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)), n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor), n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessMinimum = n.iridescenceThicknessMinimum), n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessMaximum = n.iridescenceThicknessMaximum), n.iridescenceThicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)), Promise.all(r);
	}
}, aa = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_SHEEN;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (t.sheenColor = new Ae(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, n.sheenColorFactor !== void 0) {
			let e = n.sheenColorFactor;
			t.sheenColor.setRGB(e[0], e[1], e[2], $e);
		}
		return n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor), n.sheenColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, Tt)), n.sheenRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)), Promise.all(r);
	}
}, oa = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_TRANSMISSION;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor), n.transmissionTexture !== void 0 && r.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)), Promise.all(r);
	}
}, sa = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_VOLUME;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.thickness = n.thicknessFactor === void 0 ? 0 : n.thicknessFactor, n.thicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "thicknessMap", n.thicknessTexture)), t.attenuationDistance = n.attenuationDistance || Infinity;
		let i = n.attenuationColor || [
			1,
			1,
			1
		];
		return t.attenuationColor = new Ae().setRGB(i[0], i[1], i[2], $e), Promise.all(r);
	}
}, ca = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_IOR;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		return n === null || (t.ior = n.ior === void 0 ? 1.5 : n.ior, t.ior === 0 && (t.ior = 1e3)), Promise.resolve();
	}
}, la = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_SPECULAR;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.specularIntensity = n.specularFactor === void 0 ? 1 : n.specularFactor, n.specularTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularIntensityMap", n.specularTexture));
		let i = n.specularColorFactor || [
			1,
			1,
			1
		];
		return t.specularColor = new Ae().setRGB(i[0], i[1], i[2], $e), n.specularColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, Tt)), Promise.all(r);
	}
}, ua = class {
	constructor(e) {
		this.parser = e, this.name = W.EXT_MATERIALS_BUMP;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return t.bumpScale = n.bumpFactor === void 0 ? 1 : n.bumpFactor, n.bumpTexture !== void 0 && r.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)), Promise.all(r);
	}
}, da = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_ANISOTROPY;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : ct;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength), n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation), n.anisotropyTexture !== void 0 && r.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)), Promise.all(r);
	}
}, fa = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_TEXTURE_BASISU;
	}
	loadTexture(e) {
		let t = this.parser, n = t.json, r = n.textures[e];
		if (!r.extensions || !r.extensions[this.name]) return null;
		let i = r.extensions[this.name], a = t.options.ktx2Loader;
		if (!a) {
			if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
			return null;
		}
		return t.loadTextureImage(e, i.source, a);
	}
}, pa = class {
	constructor(e) {
		this.parser = e, this.name = W.EXT_TEXTURE_WEBP;
	}
	loadTexture(e) {
		let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
		if (!i.extensions || !i.extensions[t]) return null;
		let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
		if (o.uri) {
			let e = n.options.manager.getHandler(o.uri);
			e !== null && (s = e);
		}
		return n.loadTextureImage(e, a.source, s);
	}
}, ma = class {
	constructor(e) {
		this.parser = e, this.name = W.EXT_TEXTURE_AVIF;
	}
	loadTexture(e) {
		let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
		if (!i.extensions || !i.extensions[t]) return null;
		let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
		if (o.uri) {
			let e = n.options.manager.getHandler(o.uri);
			e !== null && (s = e);
		}
		return n.loadTextureImage(e, a.source, s);
	}
}, ha = class {
	constructor(e, t) {
		this.name = t, this.parser = e;
	}
	loadBufferView(e) {
		let t = this.parser.json, n = t.bufferViews[e];
		if (n.extensions && n.extensions[this.name]) {
			let e = n.extensions[this.name], r = this.parser.getDependency("buffer", e.buffer), i = this.parser.options.meshoptDecoder;
			if (!i || !i.supported) {
				if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
				return null;
			}
			return r.then(function(t) {
				let n = e.byteOffset || 0, r = e.byteLength || 0, a = e.count, o = e.byteStride, s = new Uint8Array(t, n, r);
				return i.decodeGltfBufferAsync ? i.decodeGltfBufferAsync(a, o, s, e.mode, e.filter).then(function(e) {
					return e.buffer;
				}) : i.ready.then(function() {
					let t = new ArrayBuffer(a * o);
					return i.decodeGltfBuffer(new Uint8Array(t), a, o, s, e.mode, e.filter), t;
				});
			});
		}
		return null;
	}
}, ga = class {
	constructor(e) {
		this.name = W.EXT_MESH_GPU_INSTANCING, this.parser = e;
	}
	createNodeMesh(e) {
		let t = this.parser.json, n = t.nodes[e];
		if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
		let r = t.meshes[n.mesh];
		for (let e of r.primitives) if (e.mode !== Da.TRIANGLES && e.mode !== Da.TRIANGLE_STRIP && e.mode !== Da.TRIANGLE_FAN && e.mode !== void 0) return null;
		let i = n.extensions[this.name].attributes, a = [], o = {};
		for (let e in i) a.push(this.parser.getDependency("accessor", i[e]).then((t) => (o[e] = t, o[e])));
		return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((e) => {
			let t = e.pop(), n = t.isGroup ? t.children : [t], r = e[0].count, i = [];
			for (let e of n) {
				let t = new it(), n = new It(), a = new St(), s = new It(1, 1, 1), c = new Be(e.geometry, e.material, r);
				for (let e = 0; e < r; e++) o.TRANSLATION && n.fromBufferAttribute(o.TRANSLATION, e), o.ROTATION && a.fromBufferAttribute(o.ROTATION, e), o.SCALE && s.fromBufferAttribute(o.SCALE, e), c.setMatrixAt(e, t.compose(n, a, s));
				let l = null;
				for (let e in o) if (e === "_COLOR_0") {
					let t = o[e];
					c.instanceColor = new ze(t.array, t.itemSize, t.normalized);
				} else if (e !== "TRANSLATION" && e !== "ROTATION" && e !== "SCALE") {
					if (l === null) {
						let e = c.geometry;
						l = new Oe(), l.name = e.name;
						for (let t in e.attributes) l.setAttribute(t, e.attributes[t]);
						for (let t in e.morphAttributes) l.morphAttributes[t] = e.morphAttributes[t];
						e.index !== null && l.setIndex(e.index), l.morphTargetsRelative = e.morphTargetsRelative;
						for (let t of e.groups) l.addGroup(t.start, t.count, t.materialIndex);
						e.boundingBox !== null && (l.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (l.boundingSphere = e.boundingSphere.clone()), l.drawRange.start = e.drawRange.start, l.drawRange.count = e.drawRange.count, l.userData = Object.assign({}, e.userData), c.geometry = l;
					}
					let t = o[e];
					l.setAttribute(e, new ze(t.array, t.itemSize, t.normalized));
				}
				ht.prototype.copy.call(c, e), this.parser.assignFinalMaterial(c), i.push(c);
			}
			return t.isGroup ? (t.clear(), t.add(...i), t) : i[0];
		}));
	}
}, _a = "glTF", va = 12, ya = {
	JSON: 1313821514,
	BIN: 5130562
}, ba = class {
	constructor(e) {
		this.name = W.KHR_BINARY_GLTF, this.content = null, this.body = null;
		let t = new DataView(e, 0, va), n = new TextDecoder();
		if (this.header = {
			magic: n.decode(new Uint8Array(e.slice(0, 4))),
			version: t.getUint32(4, !0),
			length: t.getUint32(8, !0)
		}, this.header.magic !== _a) throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
		if (this.header.version < 2) throw Error("THREE.GLTFLoader: Legacy binary file detected.");
		let r = this.header.length - va, i = new DataView(e, va), a = 0;
		for (; a < r;) {
			let t = i.getUint32(a, !0);
			a += 4;
			let r = i.getUint32(a, !0);
			if (a += 4, r === ya.JSON) {
				let r = new Uint8Array(e, va + a, t);
				this.content = n.decode(r);
			} else if (r === ya.BIN) {
				let n = va + a;
				this.body = e.slice(n, n + t);
			}
			a += t;
		}
		if (this.content === null) throw Error("THREE.GLTFLoader: JSON content not found.");
	}
}, xa = class {
	constructor(e, t) {
		if (!t) throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
		this.name = W.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
	}
	decodePrimitive(e, t) {
		let n = this.json, r = this.dracoLoader, i = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, s = {}, c = {};
		for (let e in a) {
			let t = Ma[e] || e.toLowerCase();
			o[t] = a[e];
		}
		for (let t in e.attributes) {
			let r = Ma[t] || t.toLowerCase();
			if (a[t] !== void 0) {
				let i = n.accessors[e.attributes[t]];
				c[r] = Oa[i.componentType].name, s[r] = i.normalized === !0;
			}
		}
		return t.getDependency("bufferView", i).then(function(e) {
			return new Promise(function(t, n) {
				r.decodeDracoFile(e, function(e) {
					for (let t in e.attributes) {
						let n = e.attributes[t], r = s[t];
						r !== void 0 && (n.normalized = r);
					}
					t(e);
				}, o, c, $e, n);
			});
		});
	}
}, Sa = class {
	constructor() {
		this.name = W.KHR_TEXTURE_TRANSFORM;
	}
	extendTexture(e, t) {
		if ((t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0) return e;
		if (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), t.rotation !== void 0) {
			let t = Math.cos(e.rotation), n = Math.sin(e.rotation);
			e.matrix.set(e.repeat.x * t, e.repeat.y * n, e.offset.x, -e.repeat.x * n, e.repeat.y * t, e.offset.y, 0, 0, 1), e.matrixAutoUpdate = !1;
		}
		return e.needsUpdate = !0, e;
	}
}, Ca = class {
	constructor() {
		this.name = W.KHR_MESH_QUANTIZATION;
	}
}, wa = class extends Ue {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	copySampleValue_(e) {
		let t = this.resultBuffer, n = this.sampleValues, r = this.valueSize, i = e * r * 3 + r;
		for (let e = 0; e !== r; e++) t[e] = n[i + e];
		return t;
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = o * 2, c = o * 3, l = r - t, u = (n - t) / l, d = u * u, f = d * u, p = e * c, m = p - c, h = -2 * f + 3 * d, g = f - d, _ = 1 - h, v = g - d + u;
		for (let e = 0; e !== o; e++) {
			let t = a[m + e + o], n = a[m + e + s] * l, r = a[p + e + o], c = a[p + e] * l;
			i[e] = _ * t + v * n + h * r + g * c;
		}
		return i;
	}
}, Ta = new St(), Ea = class extends wa {
	interpolate_(e, t, n, r) {
		let i = super.interpolate_(e, t, n, r);
		return Ta.fromArray(i).normalize().toArray(i), i;
	}
}, Da = {
	FLOAT: 5126,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
}, Oa = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
}, ka = {
	9728: dt,
	9729: Xe,
	9984: pt,
	9985: Qe,
	9986: ft,
	9987: Ze
}, Aa = {
	33071: ke,
	33648: ut,
	10497: wt
}, ja = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT2: 4,
	MAT3: 9,
	MAT4: 16
}, Ma = {
	POSITION: "position",
	NORMAL: "normal",
	TANGENT: "tangent",
	TEXCOORD_0: "uv",
	TEXCOORD_1: "uv1",
	TEXCOORD_2: "uv2",
	TEXCOORD_3: "uv3",
	COLOR_0: "color",
	WEIGHTS_0: "skinWeight",
	JOINTS_0: "skinIndex"
}, Na = {
	scale: "scale",
	translation: "position",
	rotation: "quaternion",
	weights: "morphTargetInfluences"
}, Pa = {
	CUBICSPLINE: void 0,
	LINEAR: Ge,
	STEP: We
}, Fa = {
	OPAQUE: "OPAQUE",
	MASK: "MASK",
	BLEND: "BLEND"
};
function Ia(e) {
	return e.DefaultMaterial === void 0 && (e.DefaultMaterial = new lt({
		color: 16777215,
		emissive: 0,
		metalness: 1,
		roughness: 1,
		transparent: !1,
		depthTest: !0,
		side: Ie
	})), e.DefaultMaterial;
}
function La(e, t, n) {
	for (let r in n.extensions) e[r] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[r] = n.extensions[r]);
}
function Ra(e, t) {
	t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function za(e, t, n) {
	let r = !1, i = !1, a = !1;
	for (let e = 0, n = t.length; e < n; e++) {
		let n = t[e];
		if (n.POSITION !== void 0 && (r = !0), n.NORMAL !== void 0 && (i = !0), n.COLOR_0 !== void 0 && (a = !0), r && i && a) break;
	}
	if (!r && !i && !a) return Promise.resolve(e);
	let o = [], s = [], c = [];
	for (let l = 0, u = t.length; l < u; l++) {
		let u = t[l];
		if (r) {
			let t = u.POSITION === void 0 ? e.attributes.position : n.getDependency("accessor", u.POSITION);
			o.push(t);
		}
		if (i) {
			let t = u.NORMAL === void 0 ? e.attributes.normal : n.getDependency("accessor", u.NORMAL);
			s.push(t);
		}
		if (a) {
			let t = u.COLOR_0 === void 0 ? e.attributes.color : n.getDependency("accessor", u.COLOR_0);
			c.push(t);
		}
	}
	return Promise.all([
		Promise.all(o),
		Promise.all(s),
		Promise.all(c)
	]).then(function(t) {
		let n = t[0], o = t[1], s = t[2];
		return r && (e.morphAttributes.position = n), i && (e.morphAttributes.normal = o), a && (e.morphAttributes.color = s), e.morphTargetsRelative = !0, e;
	});
}
function Ba(e, t) {
	if (e.updateMorphTargets(), t.weights !== void 0) for (let n = 0, r = t.weights.length; n < r; n++) e.morphTargetInfluences[n] = t.weights[n];
	if (t.extras && Array.isArray(t.extras.targetNames)) {
		let n = t.extras.targetNames;
		if (e.morphTargetInfluences.length === n.length) {
			e.morphTargetDictionary = {};
			for (let t = 0, r = n.length; t < r; t++) e.morphTargetDictionary[n[t]] = t;
		} else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
	}
}
function Va(e) {
	let t, n = e.extensions && e.extensions[W.KHR_DRACO_MESH_COMPRESSION];
	if (t = n ? "draco:" + n.bufferView + ":" + n.indices + ":" + Ha(n.attributes) : e.indices + ":" + Ha(e.attributes) + ":" + e.mode, e.targets !== void 0) for (let n = 0, r = e.targets.length; n < r; n++) t += ":" + Ha(e.targets[n]);
	return t;
}
function Ha(e) {
	let t = "", n = Object.keys(e).sort();
	for (let r = 0, i = n.length; r < i; r++) t += n[r] + ":" + e[n[r]] + ";";
	return t;
}
function Ua(e) {
	switch (e) {
		case Int8Array: return 1 / 127;
		case Uint8Array: return 1 / 255;
		case Int16Array: return 1 / 32767;
		case Uint16Array: return 1 / 65535;
		default: throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
	}
}
function Wa(e) {
	return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0 ? "image/webp" : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
var Ga = new it(), Ka = class {
	constructor(e = {}, t = {}) {
		this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Zi(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = {
			refs: {},
			uses: {}
		}, this.cameraCache = {
			refs: {},
			uses: {}
		}, this.lightCache = {
			refs: {},
			uses: {}
		}, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
		let n = !1, r = -1, i = !1, a = -1;
		if (typeof navigator < "u" && navigator.userAgent !== void 0) {
			let e = navigator.userAgent;
			n = /^((?!chrome|android).)*safari/i.test(e) === !0;
			let t = e.match(/Version\/(\d+)/);
			r = n && t ? parseInt(t[1], 10) : -1, i = e.indexOf("Firefox") > -1, a = i ? e.match(/Firefox\/([0-9]+)\./)[1] : -1;
		}
		typeof createImageBitmap > "u" || n && r < 17 || i && a < 98 ? (this.textureLoader = new jt(this.options.manager), this.textureLoader.setPriority(this.options.priority), this.textureLoader.setCache(this.options.cache)) : (this.textureLoader = new Re(this.options.manager), this.textureLoader.setPriority(this.options.priority), this.textureLoader.setCache(this.options.cache)), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setWithCredentials(this.options.withCredentials), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new Pe(this.options.manager), this.fileLoader.setPriority(this.options.priority), this.fileLoader.setCache(this.options.cache), this.fileLoader.setResponseType("arraybuffer"), (this.options.withCredentials || this.options.crossOrigin === "use-credentials") && this.fileLoader.setWithCredentials(!0);
	}
	setExtensions(e) {
		this.extensions = e;
	}
	setPlugins(e) {
		this.plugins = e;
	}
	parse(e, t) {
		let n = this, r = this.json, i = this.extensions;
		this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(e) {
			return e._markDefs && e._markDefs();
		}), Promise.all(this._invokeAll(function(e) {
			return e.beforeRoot && e.beforeRoot();
		})).then(function() {
			return Promise.all([
				n.getDependencies("scene"),
				n.getDependencies("animation"),
				n.getDependencies("camera")
			]);
		}).then(function(t) {
			let a = {
				scene: t[0][r.scene || 0],
				scenes: t[0],
				animations: t[1],
				cameras: t[2],
				asset: r.asset,
				parser: n,
				userData: {}
			};
			return La(i, a, r), Ra(a, r), Promise.all(n._invokeAll(function(e) {
				return e.afterRoot && e.afterRoot(a);
			})).then(function() {
				for (let e of a.scenes) e.updateMatrixWorld();
				e(a);
			});
		}).catch(t);
	}
	_markDefs() {
		let e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n].joints;
			for (let t = 0, n = r.length; t < n; t++) e[r[t]].isBone = !0;
		}
		for (let t = 0, r = e.length; t < r; t++) {
			let r = e[t];
			r.mesh !== void 0 && (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (n[r.mesh].isSkinnedMesh = !0)), r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera);
		}
	}
	_addNodeRef(e, t) {
		t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
	}
	_getNodeRef(e, t, n) {
		if (e.refs[t] <= 1) return n;
		let r = n.clone(), i = (e, t) => {
			let n = this.associations.get(e);
			n != null && this.associations.set(t, n);
			for (let [n, r] of e.children.entries()) i(r, t.children[n]);
		};
		return i(n, r), r.name += "_instance_" + e.uses[t]++, r;
	}
	_invokeOne(e) {
		let t = Object.values(this.plugins);
		t.push(this);
		for (let n = 0; n < t.length; n++) {
			let r = e(t[n]);
			if (r) return r;
		}
		return null;
	}
	_invokeAll(e) {
		let t = Object.values(this.plugins);
		t.unshift(this);
		let n = [];
		for (let r = 0; r < t.length; r++) {
			let i = e(t[r]);
			i && n.push(i);
		}
		return n;
	}
	getDependency(e, t) {
		let n = e + ":" + t, r = this.cache.get(n);
		if (!r) {
			switch (e) {
				case "scene":
					r = this.loadScene(t);
					break;
				case "node":
					r = this._invokeOne(function(e) {
						return e.loadNode && e.loadNode(t);
					});
					break;
				case "mesh":
					r = this._invokeOne(function(e) {
						return e.loadMesh && e.loadMesh(t);
					});
					break;
				case "accessor":
					r = this.loadAccessor(t);
					break;
				case "bufferView":
					r = this._invokeOne(function(e) {
						return e.loadBufferView && e.loadBufferView(t);
					});
					break;
				case "buffer":
					r = this.loadBuffer(t);
					break;
				case "material":
					r = this._invokeOne(function(e) {
						return e.loadMaterial && e.loadMaterial(t);
					});
					break;
				case "texture":
					r = this._invokeOne(function(e) {
						return e.loadTexture && e.loadTexture(t);
					});
					break;
				case "skin":
					r = this.loadSkin(t);
					break;
				case "animation":
					r = this._invokeOne(function(e) {
						return e.loadAnimation && e.loadAnimation(t);
					});
					break;
				case "camera":
					r = this.loadCamera(t);
					break;
				default: if (r = this._invokeOne(function(n) {
					return n != this && n.getDependency && n.getDependency(e, t);
				}), !r) throw Error("Unknown type: " + e);
			}
			this.cache.add(n, r);
		}
		return r;
	}
	getDependencies(e) {
		let t = this.cache.get(e);
		if (!t) {
			let n = this, r = this.json[e + (e === "mesh" ? "es" : "s")] || [];
			t = Promise.all(r.map(function(t, r) {
				return n.getDependency(e, r);
			})), this.cache.add(e, t);
		}
		return t;
	}
	loadBuffer(e) {
		let t = this.json.buffers[e], n = this.fileLoader;
		if (t.type && t.type !== "arraybuffer") throw Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
		if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[W.KHR_BINARY_GLTF].body);
		let r = this.options;
		return new Promise(function(e, i) {
			n.load(tt.resolveURL(t.uri, r.path), e, void 0, function() {
				i(/* @__PURE__ */ Error("THREE.GLTFLoader: Failed to load buffer \"" + t.uri + "\"."));
			});
		});
	}
	loadBufferView(e) {
		let t = this.json.bufferViews[e];
		return this.getDependency("buffer", t.buffer).then(function(e) {
			let n = t.byteLength || 0, r = t.byteOffset || 0;
			return e.slice(r, r + n);
		});
	}
	loadAccessor(e) {
		let t = this, n = this.json, r = this.json.accessors[e];
		if (r.bufferView === void 0 && r.sparse === void 0) {
			let e = ja[r.type], t = Oa[r.componentType], n = r.normalized === !0, i = new t(r.count * e);
			return Promise.resolve(new De(i, e, n));
		}
		let i = [];
		return r.bufferView === void 0 ? i.push(null) : i.push(this.getDependency("bufferView", r.bufferView)), r.sparse !== void 0 && (i.push(this.getDependency("bufferView", r.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", r.sparse.values.bufferView))), Promise.all(i).then(function(e) {
			let i = e[0], a = ja[r.type], o = Oa[r.componentType], s = o.BYTES_PER_ELEMENT, c = s * a, l = r.byteOffset || 0, u = r.bufferView === void 0 ? void 0 : n.bufferViews[r.bufferView].byteStride, d = r.normalized === !0, f, p;
			if (u && u !== c) {
				let e = Math.floor(l / u), n = "InterleavedBuffer:" + r.bufferView + ":" + r.componentType + ":" + e + ":" + r.count, c = t.cache.get(n);
				c || (f = new o(i, e * u, r.count * u / s), c = new Ve(f, u / s), t.cache.add(n, c)), p = new He(c, a, l % u / s, d);
			} else f = i === null ? new o(r.count * a) : new o(i, l, r.count * a), p = new De(f, a, d);
			if (r.sparse !== void 0) {
				let t = ja.SCALAR, n = Oa[r.sparse.indices.componentType], s = r.sparse.indices.byteOffset || 0, c = r.sparse.values.byteOffset || 0, l = new n(e[1], s, r.sparse.count * t), u = new o(e[2], c, r.sparse.count * a);
				i !== null && (p = new De(p.array.slice(), p.itemSize, p.normalized)), p.normalized = !1;
				for (let e = 0, t = l.length; e < t; e++) {
					let t = l[e];
					if (p.setX(t, u[e * a]), a >= 2 && p.setY(t, u[e * a + 1]), a >= 3 && p.setZ(t, u[e * a + 2]), a >= 4 && p.setW(t, u[e * a + 3]), a >= 5) throw Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
				}
				p.normalized = d;
			}
			return p;
		});
	}
	loadTexture(e) {
		let t = this.json, n = this.options, r = t.textures[e].source, i = t.images[r], a = this.textureLoader;
		if (i.uri) {
			let e = n.manager.getHandler(i.uri);
			e !== null && (a = e);
		}
		return this.loadTextureImage(e, r, a);
	}
	loadTextureImage(e, t, n) {
		let r = this, i = this.json, a = i.textures[e], o = i.images[t], s = (o.uri || o.bufferView) + ":" + a.sampler;
		if (this.textureCache[s]) return this.textureCache[s];
		let c = this.loadImageSource(t, n).then(function(t) {
			t.flipY = !1, t.name = a.name || o.name || "", t.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === !1 && (t.name = o.uri);
			let n = (i.samplers || {})[a.sampler] || {};
			return t.magFilter = ka[n.magFilter] || Xe, t.minFilter = ka[n.minFilter] || Ze, t.wrapS = Aa[n.wrapS] || wt, t.wrapT = Aa[n.wrapT] || wt, t.generateMipmaps = !t.isCompressedTexture && t.minFilter !== dt && t.minFilter !== Xe, r.associations.set(t, { textures: e }), t;
		}).catch(function() {
			return null;
		});
		return this.textureCache[s] = c, c;
	}
	loadImageSource(e, t) {
		let n = this, r = this.json, i = this.options;
		if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((e) => e.clone());
		let a = r.images[e], o = self.URL || self.webkitURL, s = a.uri || "", c = !1, l;
		if (t.isKTX2Loader === !0 && a.bufferView !== void 0) l = n.getDependency("bufferView", a.bufferView).then(function(e) {
			return new Promise(function(n, r) {
				t.parse(e, n, r);
			});
		});
		else {
			if (a.bufferView !== void 0) s = n.getDependency("bufferView", a.bufferView).then(function(e) {
				c = !0;
				let t = new Blob([e], { type: a.mimeType });
				return s = o.createObjectURL(t), s;
			});
			else if (a.uri === void 0) throw Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
			l = Promise.resolve(s).then(function(e) {
				return new Promise(function(n, r) {
					let a = n;
					t.isImageBitmapLoader === !0 && (a = function(e) {
						let t = new At(e);
						t.needsUpdate = !0, n(t);
					}), t.load(tt.resolveURL(e, i.path), a, void 0, r);
				});
			});
		}
		let u = l.then(function(e) {
			return c === !0 && o.revokeObjectURL(s), Ra(e, a), e.userData.mimeType = a.mimeType || Wa(a.uri), e;
		}).catch(function(e) {
			throw console.error("THREE.GLTFLoader: Couldn't load texture", s), e;
		});
		return this.sourceCache[e] = u, u;
	}
	assignTexture(e, t, n, r) {
		let i = this;
		return this.getDependency("texture", n.index).then(function(a) {
			if (!a) return null;
			if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), i.extensions[W.KHR_TEXTURE_TRANSFORM]) {
				let e = n.extensions === void 0 ? void 0 : n.extensions[W.KHR_TEXTURE_TRANSFORM];
				if (e) {
					let t = i.associations.get(a);
					a = i.extensions[W.KHR_TEXTURE_TRANSFORM].extendTexture(a, e), i.associations.set(a, t);
				}
			}
			return r !== void 0 && (a.colorSpace = r), e[t] = a, a;
		});
	}
	assignFinalMaterial(e) {
		let t = e.geometry, n = e.material, r = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
		if (e.isPoints) {
			let e = "PointsMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new bt(), nt.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, t.sizeAttenuation = !1, this.cache.add(e, t)), n = t;
		} else if (e.isLine) {
			let e = "LineBasicMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new qe(), nt.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, this.cache.add(e, t)), n = t;
		}
		if (r || i || a) {
			let e = "ClonedMaterial:" + n.uuid + ":";
			r && (e += "derivative-tangents:"), i && (e += "vertex-colors:"), a && (e += "flat-shading:");
			let t = this.cache.get(e);
			t || (t = n.clone(), i && (t.vertexColors = !0), a && (t.flatShading = !0), r && (t.normalScale && (t.normalScale.y *= -1), t.clearcoatNormalScale && (t.clearcoatNormalScale.y *= -1)), this.cache.add(e, t), this.associations.set(t, this.associations.get(n))), n = t;
		}
		e.material = n;
	}
	getMaterialType() {
		return lt;
	}
	loadMaterial(e) {
		let t = this, n = this.json, r = this.extensions, i = n.materials[e], a, o = {}, s = i.extensions || {}, c = [];
		if (s[W.KHR_MATERIALS_UNLIT]) {
			let e = r[W.KHR_MATERIALS_UNLIT];
			a = e.getMaterialType(), c.push(e.extendParams(o, i, t));
		} else {
			let n = i.pbrMetallicRoughness || {};
			if (o.color = new Ae(1, 1, 1), o.opacity = 1, Array.isArray(n.baseColorFactor)) {
				let e = n.baseColorFactor;
				o.color.setRGB(e[0], e[1], e[2], $e), o.opacity = e[3];
			}
			n.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", n.baseColorTexture, Tt)), o.metalness = n.metallicFactor === void 0 ? 1 : n.metallicFactor, o.roughness = n.roughnessFactor === void 0 ? 1 : n.roughnessFactor, n.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", n.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", n.metallicRoughnessTexture))), a = this._invokeOne(function(t) {
				return t.getMaterialType && t.getMaterialType(e);
			}), c.push(Promise.all(this._invokeAll(function(t) {
				return t.extendMaterialParams && t.extendMaterialParams(e, o);
			})));
		}
		i.doubleSided === !0 && (o.side = Ne);
		let l = i.alphaMode || Fa.OPAQUE;
		if (l === Fa.BLEND ? (o.transparent = !0, o.depthWrite = !1) : (o.transparent = !1, l === Fa.MASK && (o.alphaTest = i.alphaCutoff === void 0 ? .5 : i.alphaCutoff)), i.normalTexture !== void 0 && a !== ot && (c.push(t.assignTexture(o, "normalMap", i.normalTexture)), o.normalScale = new Ft(1, 1), i.normalTexture.scale !== void 0)) {
			let e = i.normalTexture.scale;
			o.normalScale.set(e, e);
		}
		if (i.occlusionTexture !== void 0 && a !== ot && (c.push(t.assignTexture(o, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && a !== ot) {
			let e = i.emissiveFactor;
			o.emissive = new Ae().setRGB(e[0], e[1], e[2], $e);
		}
		return i.emissiveTexture !== void 0 && a !== ot && c.push(t.assignTexture(o, "emissiveMap", i.emissiveTexture, Tt)), Promise.all(c).then(function() {
			let n = new a(o);
			return i.name && (n.name = i.name), Ra(n, i), t.associations.set(n, { materials: e }), i.extensions && La(r, n, i), n;
		});
	}
	createUniqueName(e) {
		let t = xt.sanitizeNodeName(e || "");
		return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
	}
	loadGeometries(e) {
		let t = this, n = this.extensions, r = this.primitiveCache;
		function i(e) {
			return n[W.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then(function(n) {
				return Ja(n, e, t);
			});
		}
		let a = [];
		for (let n = 0, o = e.length; n < o; n++) {
			let o = e[n], s = Va(o), c = r[s];
			if (c) a.push(c.promise);
			else {
				let e;
				e = o.extensions && o.extensions[W.KHR_DRACO_MESH_COMPRESSION] ? i(o) : Ja(new Oe(), o, t), o.mode === Da.TRIANGLE_STRIP ? e = e.then((e) => qi(e, Nt)) : o.mode === Da.TRIANGLE_FAN && (e = e.then((e) => qi(e, Mt))), r[s] = {
					primitive: o,
					promise: e
				}, a.push(e);
			}
		}
		return Promise.all(a);
	}
	loadMesh(e) {
		let t = this, n = this.json, r = this.extensions, i = n.meshes[e], a = i.primitives, o = [];
		for (let e = 0, t = a.length; e < t; e++) {
			let t = a[e].material === void 0 ? Ia(this.cache) : this.getDependency("material", a[e].material);
			o.push(t);
		}
		return o.push(t.loadGeometries(a)), Promise.all(o).then(async function(n) {
			let o = n.slice(0, n.length - 1), s = n[n.length - 1], c = [];
			for (let n = 0, l = s.length; n < l; n++) {
				let l = s[n], u = a[n], d, f = o[n];
				if (u.mode === Da.TRIANGLES || u.mode === Da.TRIANGLE_STRIP || u.mode === Da.TRIANGLE_FAN || u.mode === void 0) {
					let e = i.isSkinnedMesh === !0, t = l.hasAttribute("skinIndex") && l.hasAttribute("skinWeight");
					e && t === !1 && console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."), d = e && t ? new Dt(l, f) : new at(l, f), d.isSkinnedMesh === !0 && d.normalizeSkinWeights();
				} else if (u.mode === Da.LINES) d = new Ye(l, f);
				else if (u.mode === Da.LINE_STRIP) d = new Ke(l, f);
				else if (u.mode === Da.LINE_LOOP) d = new Je(l, f);
				else if (u.mode === Da.POINTS) d = new yt(l, f);
				else throw Error("THREE.GLTFLoader: Primitive mode unsupported: " + u.mode);
				Object.keys(d.geometry.morphAttributes).length > 0 && Ba(d, i), d.name = t.createUniqueName(i.name || "mesh_" + e), Ra(d, i), u.extensions && La(r, d, u), t.assignFinalMaterial(d), c.push(d);
			}
			for (let n = 0, r = c.length; n < r; n++) t.associations.set(c[n], {
				meshes: e,
				primitives: n
			});
			if (c.length === 1) return i.extensions && La(r, c[0], i), c[0];
			let l = new Le();
			i.extensions && La(r, l, i), t.associations.set(l, { meshes: e });
			for (let e = 0, t = c.length; e < t; e++) l.add(c[e]);
			return l;
		});
	}
	loadCamera(e) {
		let t, n = this.json.cameras[e], r = n[n.type];
		if (!r) console.warn("THREE.GLTFLoader: Missing camera parameters.");
		else return n.type === "perspective" ? t = new _t(rt.radToDeg(r.yfov), r.aspectRatio || 1, r.znear || 1, r.zfar || 2e6) : n.type === "orthographic" && (t = new gt(-r.xmag, r.xmag, r.ymag, -r.ymag, r.znear, r.zfar)), n.name && (t.name = this.createUniqueName(n.name)), Ra(t, n), Promise.resolve(t);
	}
	loadSkin(e) {
		let t = this.json.skins[e], n = [];
		for (let e = 0, r = t.joints.length; e < r; e++) n.push(this._loadNodeShallow(t.joints[e]));
		return t.inverseBindMatrices === void 0 ? n.push(null) : n.push(this.getDependency("accessor", t.inverseBindMatrices)), Promise.all(n).then(function(e) {
			let n = e.pop(), r = e, i = [], a = [];
			for (let e = 0, o = r.length; e < o; e++) {
				let o = r[e];
				if (o) {
					i.push(o);
					let t = new it();
					n !== null && t.fromArray(n.array, e * 16), a.push(t);
				} else console.warn("THREE.GLTFLoader: Joint \"%s\" could not be found.", t.joints[e]);
			}
			return new Et(i, a);
		});
	}
	loadAnimation(e) {
		let t = this.json, n = this, r = t.animations[e], i = r.name ? r.name : "animation_" + e, a = [], o = [], s = [], c = [], l = [];
		for (let e = 0, t = r.channels.length; e < t; e++) {
			let t = r.channels[e], n = r.samplers[t.sampler], i = t.target, u = i.node, d = r.parameters === void 0 ? n.input : r.parameters[n.input], f = r.parameters === void 0 ? n.output : r.parameters[n.output];
			i.node !== void 0 && (a.push(this.getDependency("node", u)), o.push(this.getDependency("accessor", d)), s.push(this.getDependency("accessor", f)), c.push(n), l.push(i));
		}
		return Promise.all([
			Promise.all(a),
			Promise.all(o),
			Promise.all(s),
			Promise.all(c),
			Promise.all(l)
		]).then(function(e) {
			let t = e[0], a = e[1], o = e[2], s = e[3], c = e[4], l = [];
			for (let e = 0, r = t.length; e < r; e++) {
				let r = t[e], i = a[e], u = o[e], d = s[e], f = c[e];
				if (r === void 0) continue;
				r.updateMatrix && r.updateMatrix();
				let p = n._createAnimationTracks(r, i, u, d, f);
				if (p) for (let e = 0; e < p.length; e++) l.push(p[e]);
			}
			let u = new we(i, void 0, l);
			return Ra(u, r), u;
		});
	}
	createNodeMesh(e) {
		let t = this.json, n = this, r = t.nodes[e];
		return r.mesh === void 0 ? null : n.getDependency("mesh", r.mesh).then(function(e) {
			let t = n._getNodeRef(n.meshCache, r.mesh, e);
			return r.weights !== void 0 && t.traverse(function(e) {
				if (e.isMesh) for (let t = 0, n = r.weights.length; t < n; t++) e.morphTargetInfluences[t] = r.weights[t];
			}), t;
		});
	}
	loadNode(e) {
		let t = this.json, n = this, r = t.nodes[e], i = n._loadNodeShallow(e), a = [], o = r.children || [];
		for (let e = 0, t = o.length; e < t; e++) a.push(n.getDependency("node", o[e]));
		let s = r.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", r.skin);
		return Promise.all([
			i,
			Promise.all(a),
			s
		]).then(function(e) {
			let t = e[0], n = e[1], r = e[2];
			r !== null && t.traverse(function(e) {
				e.isSkinnedMesh && e.bind(r, Ga);
			});
			for (let e = 0, r = n.length; e < r; e++) t.add(n[e]);
			if (t.userData.pivot !== void 0 && n.length > 0) {
				let e = t.userData.pivot, r = n[0];
				t.pivot = new It().fromArray(e), t.position.x -= e[0], t.position.y -= e[1], t.position.z -= e[2], r.position.set(0, 0, 0), delete t.userData.pivot;
			}
			return t;
		});
	}
	_loadNodeShallow(e) {
		let t = this.json, n = this.extensions, r = this;
		if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
		let i = t.nodes[e], a = i.name ? r.createUniqueName(i.name) : "", o = [], s = r._invokeOne(function(t) {
			return t.createNodeMesh && t.createNodeMesh(e);
		});
		return s && o.push(s), i.camera !== void 0 && o.push(r.getDependency("camera", i.camera).then(function(e) {
			return r._getNodeRef(r.cameraCache, i.camera, e);
		})), r._invokeAll(function(t) {
			return t.createNodeAttachment && t.createNodeAttachment(e);
		}).forEach(function(e) {
			o.push(e);
		}), this.nodeCache[e] = Promise.all(o).then(function(t) {
			let o;
			if (o = i.isBone === !0 ? new Te() : t.length > 1 ? new Le() : t.length === 1 ? t[0] : new ht(), o !== t[0]) for (let e = 0, n = t.length; e < n; e++) o.add(t[e]);
			if (i.name && (o.userData.name = i.name, o.name = a), Ra(o, i), i.extensions && La(n, o, i), i.matrix !== void 0) {
				let e = new it();
				e.fromArray(i.matrix), o.applyMatrix4(e);
			} else i.translation !== void 0 && o.position.fromArray(i.translation), i.rotation !== void 0 && o.quaternion.fromArray(i.rotation), i.scale !== void 0 && o.scale.fromArray(i.scale);
			if (!r.associations.has(o)) r.associations.set(o, {});
			else if (i.mesh !== void 0 && r.meshCache.refs[i.mesh] > 1) {
				let e = r.associations.get(o);
				r.associations.set(o, { ...e });
			}
			return r.associations.get(o).nodes = e, o;
		}), this.nodeCache[e];
	}
	loadScene(e) {
		let t = this.extensions, n = this.json.scenes[e], r = this, i = new Le();
		n.name && (i.name = r.createUniqueName(n.name)), Ra(i, n), n.extensions && La(t, i, n);
		let a = n.nodes || [], o = [];
		for (let e = 0, t = a.length; e < t; e++) o.push(r.getDependency("node", a[e]));
		return Promise.all(o).then(function(e) {
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				n.parent === null ? i.add(n) : i.add(Ji(n));
			}
			return r.associations = ((e) => {
				let t = /* @__PURE__ */ new Map();
				for (let [e, n] of r.associations) (e instanceof nt || e instanceof At) && t.set(e, n);
				return e.traverse((e) => {
					let n = r.associations.get(e);
					n != null && t.set(e, n);
				}), t;
			})(i), i;
		});
	}
	_createAnimationTracks(e, t, n, r, i) {
		let a = [], o = e.name ? e.name : e.uuid, s = [];
		function c(e) {
			e.morphTargetInfluences && s.push(e.name ? e.name : e.uuid);
		}
		Na[i.path] === Na.weights ? (c(e), e.isGroup && e.children.forEach(c)) : s.push(o);
		let l;
		switch (Na[i.path]) {
			case Na.weights:
				l = mt;
				break;
			case Na.rotation:
				l = Ct;
				break;
			case Na.translation:
			case Na.scale:
				l = Lt;
				break;
			default: switch (n.itemSize) {
				case 1:
					l = mt;
					break;
				default: l = Lt;
			}
		}
		let u = r.interpolation === void 0 ? Ge : Pa[r.interpolation], d = this._getArrayFromAccessor(n);
		for (let e = 0, n = s.length; e < n; e++) {
			let n = new l(s[e] + "." + Na[i.path], t.array, d, u);
			r.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(n), a.push(n);
		}
		return a;
	}
	_getArrayFromAccessor(e) {
		let t = e.array;
		if (e.normalized) {
			let e = Ua(t.constructor), n = new Float32Array(t.length);
			for (let r = 0, i = t.length; r < i; r++) n[r] = t[r] * e;
			t = n;
		}
		return t;
	}
	_createCubicSplineTrackInterpolant(e) {
		e.createInterpolant = function(e) {
			return new (this instanceof Ct ? Ea : wa)(this.times, this.values, this.getValueSize() / 3, e);
		}, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
	}
};
function qa(e, t, n) {
	let r = t.attributes, i = new Ee();
	if (r.POSITION !== void 0) {
		let e = n.json.accessors[r.POSITION], t = e.min, a = e.max;
		if (t !== void 0 && a !== void 0) {
			if (i.set(new It(t[0], t[1], t[2]), new It(a[0], a[1], a[2])), e.normalized) {
				let t = Ua(Oa[e.componentType]);
				i.min.multiplyScalar(t), i.max.multiplyScalar(t);
			}
		} else {
			console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			return;
		}
	} else return;
	let a = t.targets;
	if (a !== void 0) {
		let e = new It(), t = new It();
		for (let r = 0, i = a.length; r < i; r++) {
			let i = a[r];
			if (i.POSITION !== void 0) {
				let r = n.json.accessors[i.POSITION], a = r.min, o = r.max;
				if (a !== void 0 && o !== void 0) {
					if (t.setX(Math.max(Math.abs(a[0]), Math.abs(o[0]))), t.setY(Math.max(Math.abs(a[1]), Math.abs(o[1]))), t.setZ(Math.max(Math.abs(a[2]), Math.abs(o[2]))), r.normalized) {
						let e = Ua(Oa[r.componentType]);
						t.multiplyScalar(e);
					}
					e.max(t);
				} else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			}
		}
		i.expandByVector(e);
	}
	e.boundingBox = i;
	let o = new Ot();
	i.getCenter(o.center), o.radius = i.min.distanceTo(i.max) / 2, e.boundingSphere = o;
}
function Ja(e, t, n) {
	let r = t.attributes, i = [];
	function a(t, r) {
		return n.getDependency("accessor", t).then(function(t) {
			e.setAttribute(r, t);
		});
	}
	for (let t in r) {
		let n = Ma[t] || t.toLowerCase();
		n in e.attributes || i.push(a(r[t], n));
	}
	if (t.indices !== void 0 && !e.index) {
		let r = n.getDependency("accessor", t.indices).then(function(t) {
			e.setIndex(t);
		});
		i.push(r);
	}
	return je.workingColorSpace !== $e && "COLOR_0" in r && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${je.workingColorSpace}" not supported.`), Ra(e, t), qa(e, t, n), Promise.all(i).then(function() {
		return t.targets === void 0 ? e : za(e, t.targets, n);
	});
}
// src/import-handlers/obj.ts
var Ya = class {
	fileContents;
	defaultModelName = "untitled";
	currentMaterial = "";
	currentGroup = "";
	smoothingGroup = 0;
	result = {
		materialLibraries: [],
		models: []
	};
	constructor(e, t) {
		this.fileContents = e, t !== void 0 && (this.defaultModelName = t);
	}
	parseAsync() {
		return new Promise((e, t) => {
			try {
				e(this.parse());
			} catch (e) {
				t(e);
			}
		});
	}
	parse() {
		let e = (e) => {
			let t = e.indexOf("#");
			return t > -1 ? e.substring(0, t) : e;
		}, t = this.fileContents.split("\n");
		for (let n of t) {
			let t = e(n).replace(/\s\s+/g, " ").trim().split(" ");
			switch (t[0].toLowerCase()) {
				case "o":
					this.parseObject(t);
					break;
				case "g":
					this.parseGroup(t);
					break;
				case "v":
					this.parseVertexCoords(t);
					break;
				case "vt":
					this.parseTextureCoords(t);
					break;
				case "vn":
					this.parseVertexNormal(t);
					break;
				case "s":
					this.parseSmoothShadingStatement(t);
					break;
				case "f":
					this.parsePolygon(t);
					break;
				case "mtllib":
					this.parseMtlLib(t);
					break;
				case "usemtl": this.parseUseMtl(t);
			}
		}
		return this.result;
	}
	currentModel() {
		return this.result.models.length === 0 && (this.result.models.push({
			faces: [],
			name: this.defaultModelName,
			textureCoords: [],
			vertexNormals: [],
			vertices: []
		}), this.currentGroup = "", this.smoothingGroup = 0), this.result.models[this.result.models.length - 1];
	}
	parseObject(e) {
		let t = e.length >= 2 ? e[1] : this.defaultModelName;
		this.result.models.push({
			faces: [],
			name: t,
			textureCoords: [],
			vertexNormals: [],
			vertices: []
		}), this.currentGroup = "", this.smoothingGroup = 0;
	}
	parseGroup(e) {
		if (e.length !== 2) throw Error("Group statements must have exactly 1 argument (eg. g group_1)");
		this.currentGroup = e[1];
	}
	parseVertexCoords(e) {
		let t = e.length >= 2 ? parseFloat(e[1]) : 0, n = e.length >= 3 ? parseFloat(e[2]) : 0, r = e.length >= 4 ? parseFloat(e[3]) : 0;
		this.currentModel().vertices.push({
			x: t,
			y: n,
			z: r
		});
	}
	parseTextureCoords(e) {
		let t = e.length >= 2 ? parseFloat(e[1]) : 0, n = e.length >= 3 ? parseFloat(e[2]) : 0, r = e.length >= 4 ? parseFloat(e[3]) : 0;
		this.currentModel().textureCoords.push({
			u: t,
			v: n,
			w: r
		});
	}
	parseVertexNormal(e) {
		let t = e.length >= 2 ? parseFloat(e[1]) : 0, n = e.length >= 3 ? parseFloat(e[2]) : 0, r = e.length >= 4 ? parseFloat(e[3]) : 0;
		this.currentModel().vertexNormals.push({
			x: t,
			y: n,
			z: r
		});
	}
	parsePolygon(e) {
		let t = e.length - 1;
		if (t < 3) throw Error("Face statement has less than 3 vertices");
		let n = {
			group: this.currentGroup,
			material: this.currentMaterial,
			smoothingGroup: this.smoothingGroup,
			vertices: []
		};
		for (let r = 0; r < t; r += 1) {
			let t = e[r + 1].split("/");
			if (t.length < 1 || t.length > 3) throw Error("Two many values (separated by /) for a single vertex");
			let i = 0, a = 0, o = parseInt(t[0], 10);
			if (t.length > 1 && t[1] !== "" && (i = parseInt(t[1], 10)), t.length > 2 && (a = parseInt(t[2], 10)), o === 0) throw Error("Faces uses invalid vertex index of 0");
			o < 0 && (o = this.currentModel().vertices.length + 1 + o), n.vertices.push({
				textureCoordsIndex: i,
				vertexIndex: o,
				vertexNormalIndex: a
			});
		}
		this.currentModel().faces.push(n);
	}
	parseMtlLib(e) {
		e.length >= 2 && this.result.materialLibraries.push(e[1]);
	}
	parseUseMtl(e) {
		e.length >= 2 && (this.currentMaterial = e[1]);
	}
	parseSmoothShadingStatement(e) {
		if (e.length !== 2) throw Error("Smoothing group statements must have exactly 1 argument (eg. s <number|off>)");
		let t = e[1].toLowerCase() === "off" ? 0 : parseInt(e[1], 10);
		this.smoothingGroup = t;
	}
}, Xa = class extends A.Loader {
	load(e, t, n, r) {
		let i = this, a = new A.Texture(), o = new A.FileLoader(this.manager);
		return o.setResponseType("arraybuffer"), o.setPath(this.path), o.load(e, function(e) {
			a.image = i.parse(e), a.needsUpdate = !0, t !== void 0 && t(a);
		}, n, r), a;
	}
	parse(e) {
		function t(e) {
			switch (e.image_type) {
				case 1:
				case 9:
					(e.colormap_length > 256 || e.colormap_size !== 24 || e.colormap_type !== 1) && console.error("THREE.TGALoader: Invalid type colormap data for indexed type.");
					break;
				case 2:
				case 3:
				case 10:
				case 11:
					e.colormap_type && console.error("THREE.TGALoader: Invalid type colormap data for colormap type.");
					break;
				case 0:
					console.error("THREE.TGALoader: No data.");
					break;
				default: console.error("THREE.TGALoader: Invalid type \"%s\".", e.image_type);
			}
			(e.width <= 0 || e.height <= 0) && console.error("THREE.TGALoader: Invalid image size."), e.pixel_size !== 8 && e.pixel_size !== 16 && e.pixel_size !== 24 && e.pixel_size !== 32 && console.error("THREE.TGALoader: Invalid pixel size \"%s\".", e.pixel_size);
		}
		function n(e, t, n, r, i) {
			let a, o, s = n.pixel_size >> 3, c = n.width * n.height * s;
			if (t && (o = i.subarray(r, r += n.colormap_length * (n.colormap_size >> 3))), e) {
				a = new Uint8Array(c);
				let e, t, n, o = 0, l = new Uint8Array(s);
				for (; o < c;) if (e = i[r++], t = (e & 127) + 1, e & 128) {
					for (n = 0; n < s; ++n) l[n] = i[r++];
					for (n = 0; n < t; ++n) a.set(l, o + n * s);
					o += s * t;
				} else {
					for (t *= s, n = 0; n < t; ++n) a[o + n] = i[r++];
					o += t;
				}
			} else a = i.subarray(r, r + (t ? n.width * n.height : c));
			return {
				pixel_data: a,
				palettes: o
			};
		}
		function r(e, t, n, r, i, a, o, s, c) {
			let l = c, u, d = 0, p, m, h = f.width;
			for (m = t; m !== r; m += n) for (p = i; p !== o; p += a, d++) u = s[d], e[(p + h * m) * 4 + 3] = 255, e[(p + h * m) * 4 + 2] = l[u * 3 + 0], e[(p + h * m) * 4 + 1] = l[u * 3 + 1], e[(p + h * m) * 4 + 0] = l[u * 3 + 2];
			return e;
		}
		function i(e, t, n, r, i, a, o, s) {
			let c, l = 0, u, d, p = f.width;
			for (d = t; d !== r; d += n) for (u = i; u !== o; u += a, l += 2) c = s[l + 0] + (s[l + 1] << 8), e[(u + p * d) * 4 + 0] = (c & 31744) >> 7, e[(u + p * d) * 4 + 1] = (c & 992) >> 2, e[(u + p * d) * 4 + 2] = (c & 31) >> 3, e[(u + p * d) * 4 + 3] = c & 32768 ? 0 : 255;
			return e;
		}
		function a(e, t, n, r, i, a, o, s) {
			let c = 0, l, u, d = f.width;
			for (u = t; u !== r; u += n) for (l = i; l !== o; l += a, c += 3) e[(l + d * u) * 4 + 3] = 255, e[(l + d * u) * 4 + 2] = s[c + 0], e[(l + d * u) * 4 + 1] = s[c + 1], e[(l + d * u) * 4 + 0] = s[c + 2];
			return e;
		}
		function o(e, t, n, r, i, a, o, s) {
			let c = 0, l, u, d = f.width;
			for (u = t; u !== r; u += n) for (l = i; l !== o; l += a, c += 4) e[(l + d * u) * 4 + 2] = s[c + 0], e[(l + d * u) * 4 + 1] = s[c + 1], e[(l + d * u) * 4 + 0] = s[c + 2], e[(l + d * u) * 4 + 3] = s[c + 3];
			return e;
		}
		function s(e, t, n, r, i, a, o, s) {
			let c, l = 0, u, d, p = f.width;
			for (d = t; d !== r; d += n) for (u = i; u !== o; u += a, l++) c = s[l], e[(u + p * d) * 4 + 0] = c, e[(u + p * d) * 4 + 1] = c, e[(u + p * d) * 4 + 2] = c, e[(u + p * d) * 4 + 3] = 255;
			return e;
		}
		function c(e, t, n, r, i, a, o, s) {
			let c = 0, l, u, d = f.width;
			for (u = t; u !== r; u += n) for (l = i; l !== o; l += a, c += 2) e[(l + d * u) * 4 + 0] = s[c + 0], e[(l + d * u) * 4 + 1] = s[c + 0], e[(l + d * u) * 4 + 2] = s[c + 0], e[(l + d * u) * 4 + 3] = s[c + 1];
			return e;
		}
		function l(e, t, n, l, u) {
			let d, p, m, g, _, v;
			switch ((f.flags & 48) >> 4) {
				default:
				case 2:
					d = 0, m = 1, _ = t, p = 0, g = 1, v = n;
					break;
				case 0:
					d = 0, m = 1, _ = t, p = n - 1, g = -1, v = -1;
					break;
				case 3:
					d = t - 1, m = -1, _ = -1, p = 0, g = 1, v = n;
					break;
				case 1: d = t - 1, m = -1, _ = -1, p = n - 1, g = -1, v = -1;
			}
			if (h) switch (f.pixel_size) {
				case 8:
					s(e, p, g, v, d, m, _, l);
					break;
				case 16:
					c(e, p, g, v, d, m, _, l);
					break;
				default: console.error("THREE.TGALoader: Format not supported.");
			}
			else switch (f.pixel_size) {
				case 8:
					r(e, p, g, v, d, m, _, l, u);
					break;
				case 16:
					i(e, p, g, v, d, m, _, l);
					break;
				case 24:
					a(e, p, g, v, d, m, _, l);
					break;
				case 32:
					o(e, p, g, v, d, m, _, l);
					break;
				default: console.error("THREE.TGALoader: Format not supported.");
			}
			return e;
		}
		e.byteLength < 19 && console.error("THREE.TGALoader: Not enough data to contain header.");
		let u = new Uint8Array(e), d = 0, f = {
			id_length: u[d++],
			colormap_type: u[d++],
			image_type: u[d++],
			colormap_index: u[d++] | u[d++] << 8,
			colormap_length: u[d++] | u[d++] << 8,
			colormap_size: u[d++],
			origin: [u[d++] | u[d++] << 8, u[d++] | u[d++] << 8],
			width: u[d++] | u[d++] << 8,
			height: u[d++] | u[d++] << 8,
			pixel_size: u[d++],
			flags: u[d++]
		};
		t(f), f.id_length + d > e.byteLength && console.error("THREE.TGALoader: No data."), d += f.id_length;
		let p = !1, m = !1, h = !1;
		switch (f.image_type) {
			case 9:
				p = !0, m = !0;
				break;
			case 1:
				m = !0;
				break;
			case 10:
				p = !0;
				break;
			case 2: break;
			case 11:
				p = !0, h = !0;
				break;
			case 3: h = !0;
		}
		let g = typeof OffscreenCanvas < "u", _ = g ? new OffscreenCanvas(f.width, f.height) : document.createElement("canvas");
		_.width = f.width, _.height = f.height;
		let v = _.getContext("2d"), y = v.createImageData(f.width, f.height), b = n(p, m, f, d, u);
		return l(y.data, f.width, f.height, b.pixel_data, b.palettes), v.putImageData(y, 0, 0), g ? _.transferToImageBitmap() : _;
	}
}, Za = class extends A.Loader {
	load(e, t, n, r) {
		var i = this, a = i.path === "" ? A.LoaderUtils.extractUrlBase(e) : i.path, o = new A.FileLoader(i.manager);
		o.setPath(i.path), o.load(e, function(e) {
			t(i.parse(e, a));
		}, n, r);
	}
	parse(e, t) {
		function n(e, t) {
			for (var n = [], r = e.childNodes, i = 0, a = r.length; i < a; i++) {
				var o = r[i];
				o.nodeName === t && n.push(o);
			}
			return n;
		}
		function r(e) {
			if (e.length === 0) return [];
			for (var t = e.trim().split(/\s+/), n = Array(t.length), r = 0, i = t.length; r < i; r++) n[r] = t[r];
			return n;
		}
		function i(e) {
			if (e.length === 0) return [];
			for (var t = e.trim().split(/\s+/), n = Array(t.length), r = 0, i = t.length; r < i; r++) n[r] = parseFloat(t[r]);
			return n;
		}
		function a(e) {
			if (e.length === 0) return [];
			for (var t = e.trim().split(/\s+/), n = Array(t.length), r = 0, i = t.length; r < i; r++) n[r] = parseInt(t[r]);
			return n;
		}
		function o(e) {
			return e.substring(1);
		}
		function s() {
			return "three_default_" + I++;
		}
		function c(e) {
			return Object.keys(e).length === 0;
		}
		function l(e) {
			return {
				unit: u(n(e, "unit")[0]),
				upAxis: d(n(e, "up_axis")[0])
			};
		}
		function u(e) {
			return e !== void 0 && e.hasAttribute("meter") === !0 ? parseFloat(e.getAttribute("meter")) : 1;
		}
		function d(e) {
			return e === void 0 ? "Y_UP" : e.textContent;
		}
		function f(e, t, r, i) {
			var a = n(e, t)[0];
			if (a !== void 0) for (var o = n(a, r), s = 0; s < o.length; s++) i(o[s]);
		}
		function p(e, t) {
			for (var n in e) {
				var r = e[n];
				r.build = t(e[n]);
			}
		}
		function m(e, t) {
			return e.build === void 0 && (e.build = t(e)), e.build;
		}
		function h(e) {
			for (var t = {
				sources: {},
				samplers: {},
				channels: {}
			}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) {
					var a;
					switch (i.nodeName) {
						case "source":
							a = i.getAttribute("id"), t.sources[a] = Ge(i);
							break;
						case "sampler":
							a = i.getAttribute("id"), t.samplers[a] = g(i);
							break;
						case "channel":
							a = i.getAttribute("target"), t.channels[a] = _(i);
							break;
						default: console.log(i);
					}
				}
			}
			L.animations[e.getAttribute("id")] = t;
		}
		function g(e) {
			for (var t = { inputs: {} }, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1 && i.nodeName === "input") {
					var a = o(i.getAttribute("source")), s = i.getAttribute("semantic");
					t.inputs[s] = a;
				}
			}
			return t;
		}
		function _(e) {
			var t = {}, n = e.getAttribute("target").split("/"), r = n.shift(), i = n.shift(), a = i.indexOf("(") !== -1, s = i.indexOf(".") !== -1;
			if (s) n = i.split("."), i = n.shift(), t.member = n.shift();
			else if (a) {
				var c = i.split("(");
				i = c.shift();
				for (var l = 0; l < c.length; l++) c[l] = parseInt(c[l].replace(/\)/, ""));
				t.indices = c;
			}
			return t.id = r, t.sid = i, t.arraySyntax = a, t.memberSyntax = s, t.sampler = o(e.getAttribute("source")), t;
		}
		function v(e) {
			var t = [], n = e.channels, r = e.samplers, i = e.sources;
			for (var a in n) if (Object.hasOwn(n, a)) {
				var o = n[a], s = r[o.sampler], c = s.inputs.INPUT, l = s.inputs.OUTPUT, u = i[c], d = i[l];
				ee(b(o, u, d), t);
			}
			return t;
		}
		function y(e) {
			return m(L.animations[e], v);
		}
		function b(e, t, n) {
			var r = L.nodes[e.id], i = At(r.id), a = r.transforms[e.sid], o = r.matrix.clone().transpose(), s, c, l, u, d, f, p = {};
			switch (a) {
				case "matrix":
					for (l = 0, u = t.array.length; l < u; l++) if (s = t.array[l], c = l * n.stride, p[s] === void 0 && (p[s] = {}), e.arraySyntax === !0) {
						var m = n.array[c], h = e.indices[0] + 4 * e.indices[1];
						p[s][h] = m;
					} else for (d = 0, f = n.stride; d < f; d++) p[s][d] = n.array[c + d];
					break;
				case "translate":
					console.warn("THREE.DAELoader: Animation transform type \"%s\" not yet implemented.", a);
					break;
				case "rotate":
					console.warn("THREE.DAELoader: Animation transform type \"%s\" not yet implemented.", a);
					break;
				case "scale": console.warn("THREE.DAELoader: Animation transform type \"%s\" not yet implemented.", a);
			}
			var g = x(p, o);
			return {
				name: i.uuid,
				keyframes: g
			};
		}
		function x(e, t) {
			var n = [];
			for (var r in e) n.push({
				time: parseFloat(r),
				value: e[r]
			});
			n.sort(a);
			for (var i = 0; i < 16; i++) T(n, i, t.elements[i]);
			return n;
			function a(e, t) {
				return e.time - t.time;
			}
		}
		var S = new A.Vector3(), C = new A.Vector3(), w = new A.Quaternion();
		function ee(e, t) {
			for (var n = e.keyframes, r = e.name, i = [], a = [], o = [], s = [], c = 0, l = n.length; c < l; c++) {
				var u = n[c], d = u.time, f = u.value;
				yt.fromArray(f).transpose(), yt.decompose(S, w, C), i.push(d), a.push(S.x, S.y, S.z), o.push(w.x, w.y, w.z, w.w), s.push(C.x, C.y, C.z);
			}
			return a.length > 0 && t.push(new A.VectorKeyframeTrack(r + ".position", i, a)), o.length > 0 && t.push(new A.QuaternionKeyframeTrack(r + ".quaternion", i, o)), s.length > 0 && t.push(new A.VectorKeyframeTrack(r + ".scale", i, s)), t;
		}
		function T(e, t, n) {
			for (var r, i = !0, a = 0, o = e.length; a < o; a++) r = e[a], r.value[t] === void 0 ? r.value[t] = null : i = !1;
			if (i === !0) for (a = 0, o = e.length; a < o; a++) r = e[a], r.value[t] = n;
			else E(e, t);
		}
		function E(e, t) {
			for (var n, r, i = 0, a = e.length; i < a; i++) {
				var o = e[i];
				if (o.value[t] === null) {
					if (n = te(e, i, t), r = D(e, i, t), n === null) {
						o.value[t] = r.value[t];
						continue;
					}
					if (r === null) {
						o.value[t] = n.value[t];
						continue;
					}
					ne(o, n, r, t);
				}
			}
		}
		function te(e, t, n) {
			for (; t >= 0;) {
				var r = e[t];
				if (r.value[n] !== null) return r;
				t--;
			}
			return null;
		}
		function D(e, t, n) {
			for (; t < e.length;) {
				var r = e[t];
				if (r.value[n] !== null) return r;
				t++;
			}
			return null;
		}
		function ne(e, t, n, r) {
			n.time - t.time === 0 ? e.value[r] = t.value[r] : e.value[r] = (e.time - t.time) * (n.value[r] - t.value[r]) / (n.time - t.time) + t.value[r];
		}
		function re(e) {
			for (var t = {
				name: e.getAttribute("id") || "default",
				start: parseFloat(e.getAttribute("start") || 0),
				end: parseFloat(e.getAttribute("end") || 0),
				animations: []
			}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "instance_animation" && t.animations.push(o(i.getAttribute("url")));
			}
			L.clips[e.getAttribute("id")] = t;
		}
		function ie(e) {
			for (var t = [], n = e.name, r = e.end - e.start || -1, i = e.animations, a = 0, o = i.length; a < o; a++) for (var s = y(i[a]), c = 0, l = s.length; c < l; c++) t.push(s[c]);
			return new A.AnimationClip(n, r, t);
		}
		function ae(e) {
			return m(L.clips[e], ie);
		}
		function oe(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "skin":
						t.id = o(i.getAttribute("source")), t.skin = se(i);
						break;
					case "morph": t.id = o(i.getAttribute("source")), console.warn("THREE.DAELoader: Morph target animation not supported yet.");
				}
			}
			L.controllers[e.getAttribute("id")] = t;
		}
		function se(e) {
			for (var t = { sources: {} }, n = 0, r = e.childNodes.length; n < r; n++) {
				var a = e.childNodes[n];
				if (a.nodeType === 1) switch (a.nodeName) {
					case "bind_shape_matrix":
						t.bindShapeMatrix = i(a.textContent);
						break;
					case "source":
						var o = a.getAttribute("id");
						t.sources[o] = Ge(a);
						break;
					case "joints":
						t.joints = ce(a);
						break;
					case "vertex_weights": t.vertexWeights = le(a);
				}
			}
			return t;
		}
		function ce(e) {
			for (var t = { inputs: {} }, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1 && i.nodeName === "input") {
					var a = i.getAttribute("semantic"), s = o(i.getAttribute("source"));
					t.inputs[a] = s;
				}
			}
			return t;
		}
		function le(e) {
			for (var t = { inputs: {} }, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "input":
						var s = i.getAttribute("semantic"), c = o(i.getAttribute("source")), l = parseInt(i.getAttribute("offset"));
						t.inputs[s] = {
							id: c,
							offset: l
						};
						break;
					case "vcount":
						t.vcount = a(i.textContent);
						break;
					case "v": t.v = a(i.textContent);
				}
			}
			return t;
		}
		function O(e) {
			var t = { id: e.id }, n = L.geometries[t.id];
			return e.skin !== void 0 && (t.skin = ue(e.skin), n.sources.skinIndices = t.skin.indices, n.sources.skinWeights = t.skin.weights), t;
		}
		function ue(e) {
			for (var t = 4, n = {
				joints: [],
				indices: {
					array: [],
					stride: t
				},
				weights: {
					array: [],
					stride: t
				}
			}, r = e.sources, i = e.vertexWeights, a = i.vcount, o = i.v, s = i.inputs.JOINT.offset, c = i.inputs.WEIGHT.offset, l = e.sources[e.joints.inputs.JOINT], u = e.sources[e.joints.inputs.INV_BIND_MATRIX], d = r[i.inputs.WEIGHT.id].array, f = 0, p = 0, m, h = a.length; p < h; p++) {
				var g = a[p], _ = [];
				for (m = 0; m < g; m++) {
					var v = o[f + s], y = d[o[f + c]];
					_.push({
						index: v,
						weight: y
					}), f += 2;
				}
				for (_.sort(C), m = 0; m < t; m++) {
					var b = _[m];
					b === void 0 ? (n.indices.array.push(0), n.weights.array.push(0)) : (n.indices.array.push(b.index), n.weights.array.push(b.weight));
				}
			}
			for (n.bindMatrix = e.bindShapeMatrix ? new A.Matrix4().fromArray(e.bindShapeMatrix).transpose() : new A.Matrix4().identity(), p = 0, h = l.array.length; p < h; p++) {
				var x = l.array[p], S = new A.Matrix4().fromArray(u.array, p * u.stride).transpose();
				n.joints.push({
					name: x,
					boneInverse: S
				});
			}
			return n;
			function C(e, t) {
				return t.weight - e.weight;
			}
		}
		function de(e) {
			return m(L.controllers[e], O);
		}
		function fe(e) {
			var t = { init_from: n(e, "init_from")[0].textContent };
			L.images[e.getAttribute("id")] = t;
		}
		function pe(e) {
			return e.build === void 0 ? e.init_from : e.build;
		}
		function me(e) {
			var t = L.images[e];
			return t === void 0 ? (console.warn("THREE.DAELoader: Couldn't find image with ID:", e), null) : m(t, pe);
		}
		function k(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "profile_COMMON" && (t.profile = he(i));
			}
			L.effects[e.getAttribute("id")] = t;
		}
		function he(e) {
			for (var t = {
				surfaces: {},
				samplers: {}
			}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "newparam":
						ge(i, t);
						break;
					case "technique":
						t.technique = ye(i);
						break;
					case "extra": t.extra = Te(i);
				}
			}
			return t;
		}
		function ge(e, t) {
			for (var n = e.getAttribute("sid"), r = 0, i = e.childNodes.length; r < i; r++) {
				var a = e.childNodes[r];
				if (a.nodeType === 1) switch (a.nodeName) {
					case "surface":
						t.surfaces[n] = _e(a);
						break;
					case "sampler2D": t.samplers[n] = ve(a);
				}
			}
		}
		function _e(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "init_from" && (t.init_from = i.textContent);
			}
			return t;
		}
		function ve(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "source" && (t.source = i.textContent);
			}
			return t;
		}
		function ye(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "constant":
					case "lambert":
					case "blinn":
					case "phong": t.type = i.nodeName, t.parameters = be(i);
				}
			}
			return t;
		}
		function be(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "emission":
					case "diffuse":
					case "specular":
					case "bump":
					case "ambient":
					case "shininess":
					case "transparency":
						t[i.nodeName] = xe(i);
						break;
					case "transparent": t[i.nodeName] = {
						opaque: i.getAttribute("opaque"),
						data: xe(i)
					};
				}
			}
			return t;
		}
		function xe(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var a = e.childNodes[n];
				if (a.nodeType === 1) switch (a.nodeName) {
					case "color":
						t[a.nodeName] = i(a.textContent);
						break;
					case "float":
						t[a.nodeName] = parseFloat(a.textContent);
						break;
					case "texture": t[a.nodeName] = {
						id: a.getAttribute("texture"),
						extra: Se(a)
					};
				}
			}
			return t;
		}
		function Se(e) {
			for (var t = { technique: {} }, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "extra" && Ce(i, t);
			}
			return t;
		}
		function Ce(e, t) {
			for (var n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "technique" && we(i, t);
			}
		}
		function we(e, t) {
			for (var n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "repeatU":
					case "repeatV":
					case "offsetU":
					case "offsetV":
						t.technique[i.nodeName] = parseFloat(i.textContent);
						break;
					case "wrapU":
					case "wrapV": i.textContent.toUpperCase() === "TRUE" ? t.technique[i.nodeName] = 1 : i.textContent.toUpperCase() === "FALSE" ? t.technique[i.nodeName] = 0 : t.technique[i.nodeName] = parseInt(i.textContent);
				}
			}
		}
		function Te(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "technique" && (t.technique = Ee(i));
			}
			return t;
		}
		function Ee(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "double_sided" && (t[i.nodeName] = parseInt(i.textContent));
			}
			return t;
		}
		function De(e) {
			return e;
		}
		function Oe(e) {
			return m(L.effects[e], De);
		}
		function ke(e) {
			for (var t = { name: e.getAttribute("name") }, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "instance_effect" && (t.url = o(i.getAttribute("url")));
			}
			L.materials[e.getAttribute("id")] = t;
		}
		function Ae(e) {
			var t, n = e.slice((e.lastIndexOf(".") - 1 >>> 0) + 2);
			switch (n = n.toLowerCase(), n) {
				case "tga":
					t = P;
					break;
				default: t = Ht;
			}
			return t;
		}
		function je(e) {
			var t = Oe(e.url), n = t.profile.technique, r = t.profile.extra, i;
			switch (n.type) {
				case "phong":
				case "blinn":
					i = new A.MeshPhongMaterial();
					break;
				case "lambert":
					i = new A.MeshLambertMaterial();
					break;
				default: i = new A.MeshBasicMaterial();
			}
			i.name = e.name || "";
			function a(e) {
				var n = t.profile.samplers[e.id], r;
				if (n !== void 0) {
					var i = t.profile.surfaces[n.source];
					r = me(i.init_from);
				} else console.warn("THREE.DAELoader: Undefined sampler. Access image directly (see #12530)."), r = me(e.id);
				if (r !== null) {
					var a = Ae(r);
					if (a !== void 0) {
						var o = a.load(r), s = e.extra;
						if (s !== void 0 && s.technique !== void 0 && c(s.technique) === !1) {
							var l = s.technique;
							o.wrapS = l.wrapU ? A.RepeatWrapping : A.ClampToEdgeWrapping, o.wrapT = l.wrapV ? A.RepeatWrapping : A.ClampToEdgeWrapping, o.offset.set(l.offsetU || 0, l.offsetV || 0), o.repeat.set(l.repeatU || 1, l.repeatV || 1);
						} else o.wrapS = A.RepeatWrapping, o.wrapT = A.RepeatWrapping;
						return o;
					}
					return console.warn("THREE.DAELoader: Loader for texture %s not found.", r), null;
				}
				return console.warn("THREE.DAELoader: Couldn't create texture with ID:", e.id), null;
			}
			var o = n.parameters;
			for (var s in o) {
				var l = o[s];
				switch (s) {
					case "diffuse":
						l.color && i.color.fromArray(l.color), l.texture && (i.map = a(l.texture));
						break;
					case "specular":
						l.color && i.specular && i.specular.fromArray(l.color), l.texture && (i.specularMap = a(l.texture));
						break;
					case "bump":
						l.texture && (i.normalMap = a(l.texture));
						break;
					case "ambient":
						l.texture && (i.lightMap = a(l.texture), i.lightMap.channel = 0);
						break;
					case "shininess":
						l.float && i.shininess && (i.shininess = l.float);
						break;
					case "emission": l.color && i.emissive && i.emissive.fromArray(l.color), l.texture && (i.emissiveMap = a(l.texture));
				}
			}
			var u = o.transparent, d = o.transparency;
			if (d === void 0 && u && (d = { float: 1 }), u === void 0 && d && (u = {
				opaque: "A_ONE",
				data: { color: [
					1,
					1,
					1,
					1
				] }
			}), u && d) {
				if (u.data.texture) i.transparent = !0;
				else {
					var f = u.data.color;
					switch (u.opaque) {
						case "A_ONE":
							i.opacity = f[3] * d.float;
							break;
						case "RGB_ZERO":
							i.opacity = 1 - f[0] * d.float;
							break;
						case "A_ZERO":
							i.opacity = 1 - f[3] * d.float;
							break;
						case "RGB_ONE":
							i.opacity = f[0] * d.float;
							break;
						default: console.warn("THREE.DAELoader: Invalid opaque type \"%s\" of transparent tag.", u.opaque);
					}
					i.opacity < 1 && (i.transparent = !0);
				}
			}
			return r !== void 0 && r.technique !== void 0 && r.technique.double_sided === 1 && (i.side = A.DoubleSide), i;
		}
		function Me(e) {
			return m(L.materials[e], je);
		}
		function Ne(e) {
			for (var t = { name: e.getAttribute("name") }, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "optics" && (t.optics = Pe(i));
			}
			L.cameras[e.getAttribute("id")] = t;
		}
		function Pe(e) {
			for (var t = 0; t < e.childNodes.length; t++) {
				var n = e.childNodes[t];
				if (n.nodeName === "technique_common") return Fe(n);
			}
			return {};
		}
		function Fe(e) {
			for (var t = {}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				switch (r.nodeName) {
					case "perspective":
					case "orthographic": t.technique = r.nodeName, t.parameters = Ie(r);
				}
			}
			return t;
		}
		function Ie(e) {
			for (var t = {}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				switch (r.nodeName) {
					case "xfov":
					case "yfov":
					case "xmag":
					case "ymag":
					case "znear":
					case "zfar":
					case "aspect_ratio": t[r.nodeName] = parseFloat(r.textContent);
				}
			}
			return t;
		}
		function Le(e) {
			var t;
			switch (e.optics.technique) {
				case "perspective":
					t = new A.PerspectiveCamera(e.optics.parameters.yfov, e.optics.parameters.aspect_ratio, e.optics.parameters.znear, e.optics.parameters.zfar);
					break;
				case "orthographic":
					var n = e.optics.parameters.ymag, r = e.optics.parameters.xmag, i = e.optics.parameters.aspect_ratio;
					r = r === void 0 ? n * i : r, n = n === void 0 ? r / i : n, r *= .5, n *= .5, t = new A.OrthographicCamera(-r, r, n, -n, e.optics.parameters.znear, e.optics.parameters.zfar);
					break;
				default: t = new A.PerspectiveCamera();
			}
			return t.name = e.name || "", t;
		}
		function Re(e) {
			var t = L.cameras[e];
			return t === void 0 ? (console.warn("THREE.DAELoader: Couldn't find camera with ID:", e), null) : m(t, Le);
		}
		function ze(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "technique_common" && (t = Be(i));
			}
			L.lights[e.getAttribute("id")] = t;
		}
		function Be(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "directional":
					case "point":
					case "spot":
					case "ambient": t.technique = i.nodeName, t.parameters = Ve(i);
				}
			}
			return t;
		}
		function Ve(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var a = e.childNodes[n];
				if (a.nodeType === 1) switch (a.nodeName) {
					case "color":
						var o = i(a.textContent);
						t.color = new A.Color().fromArray(o);
						break;
					case "falloff_angle":
						t.falloffAngle = parseFloat(a.textContent);
						break;
					case "quadratic_attenuation":
						var s = parseFloat(a.textContent);
						t.distance = s ? Math.sqrt(1 / s) : 0;
				}
			}
			return t;
		}
		function He(e) {
			var t;
			switch (e.technique) {
				case "directional":
					t = new A.DirectionalLight();
					break;
				case "point":
					t = new A.PointLight();
					break;
				case "spot":
					t = new A.SpotLight();
					break;
				case "ambient": t = new A.AmbientLight();
			}
			return e.parameters.color && t.color.copy(e.parameters.color), e.parameters.distance && (t.distance = e.parameters.distance), t;
		}
		function Ue(e) {
			var t = L.lights[e];
			return t === void 0 ? (console.warn("THREE.DAELoader: Couldn't find light with ID:", e), null) : m(t, He);
		}
		function We(e) {
			var t = {
				name: e.getAttribute("name"),
				sources: {},
				vertices: {},
				primitives: []
			}, r = n(e, "mesh")[0];
			if (r !== void 0) {
				for (var i = 0; i < r.childNodes.length; i++) {
					var a = r.childNodes[i];
					if (a.nodeType === 1) {
						var o = a.getAttribute("id");
						switch (a.nodeName) {
							case "source":
								t.sources[o] = Ge(a);
								break;
							case "vertices":
								t.vertices = Ke(a);
								break;
							case "polygons":
								console.warn("THREE.DAELoader: Unsupported primitive type: ", a.nodeName);
								break;
							case "lines":
							case "linestrips":
							case "polylist":
							case "triangles":
								t.primitives.push(qe(a));
								break;
							default: console.log(a);
						}
					}
				}
				L.geometries[e.getAttribute("id")] = t;
			}
		}
		function Ge(e) {
			for (var t = {
				array: [],
				stride: 3
			}, a = 0; a < e.childNodes.length; a++) {
				var o = e.childNodes[a];
				if (o.nodeType === 1) switch (o.nodeName) {
					case "float_array":
						t.array = i(o.textContent);
						break;
					case "Name_array":
						t.array = r(o.textContent);
						break;
					case "technique_common":
						var s = n(o, "accessor")[0];
						s !== void 0 && (t.stride = parseInt(s.getAttribute("stride")));
				}
			}
			return t;
		}
		function Ke(e) {
			for (var t = {}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				r.nodeType === 1 && (t[r.getAttribute("semantic")] = o(r.getAttribute("source")));
			}
			return t;
		}
		function qe(e) {
			for (var t = {
				type: e.nodeName,
				material: e.getAttribute("material"),
				count: parseInt(e.getAttribute("count")),
				inputs: {},
				stride: 0,
				hasUV: !1
			}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "input":
						var s = o(i.getAttribute("source")), c = i.getAttribute("semantic"), l = parseInt(i.getAttribute("offset")), u = parseInt(i.getAttribute("set")), d = u > 0 ? c + u : c;
						t.inputs[d] = {
							id: s,
							offset: l
						}, t.stride = Math.max(t.stride, l + 1), c === "TEXCOORD" && (t.hasUV = !0);
						break;
					case "vcount":
						t.vcount = a(i.textContent);
						break;
					case "p": t.p = a(i.textContent);
				}
			}
			return t;
		}
		function Je(e) {
			for (var t = {}, n = 0; n < e.length; n++) {
				var r = e[n];
				t[r.type] === void 0 && (t[r.type] = []), t[r.type].push(r);
			}
			return t;
		}
		function Ye(e) {
			for (var t = 0, n = 0, r = e.length; n < r; n++) e[n].hasUV === !0 && t++;
			t > 0 && t < e.length && (e.uvsNeedsFix = !0);
		}
		function Xe(e) {
			var t = {}, n = e.sources, r = e.vertices, i = e.primitives;
			if (i.length === 0) return {};
			var a = Je(i);
			for (var o in a) {
				var s = a[o];
				Ye(s), t[o] = Ze(s, n, r);
			}
			return t;
		}
		function Ze(e, t, n) {
			for (var r = {}, i = {
				array: [],
				stride: 0
			}, a = {
				array: [],
				stride: 0
			}, o = {
				array: [],
				stride: 0
			}, s = {
				array: [],
				stride: 0
			}, c = {
				array: [],
				stride: 0
			}, l = {
				array: [],
				stride: 4
			}, u = {
				array: [],
				stride: 4
			}, d = new A.BufferGeometry(), f = [], p = 0, m = 0; m < e.length; m++) {
				var h = e[m], g = h.inputs, _ = 0;
				switch (h.type) {
					case "lines":
					case "linestrips":
						_ = h.count * 2;
						break;
					case "triangles":
						_ = h.count * 3;
						break;
					case "polylist":
						for (var v = 0; v < h.count; v++) {
							var y = h.vcount[v];
							switch (y) {
								case 3:
									_ += 3;
									break;
								case 4:
									_ += 6;
									break;
								default: _ += (y - 2) * 3;
							}
						}
						break;
					default: console.warn("THREE.DAELoader: Unknow primitive type:", h.type);
				}
				for (var b in d.addGroup(p, _, m), p += _, h.material && f.push(h.material), g) {
					var x = g[b];
					switch (b) {
						case "VERTEX":
							for (var S in n) {
								var C = n[S];
								switch (S) {
									case "POSITION":
										var w = i.array.length;
										if (Qe(h, t[C], x.offset, i.array), i.stride = t[C].stride, t.skinWeights && t.skinIndices && (Qe(h, t.skinIndices, x.offset, l.array), Qe(h, t.skinWeights, x.offset, u.array)), h.hasUV === !1 && e.uvsNeedsFix === !0) for (var _ = (i.array.length - w) / i.stride, ee = 0; ee < _; ee++) o.array.push(0, 0);
										break;
									case "NORMAL":
										Qe(h, t[C], x.offset, a.array), a.stride = t[C].stride;
										break;
									case "COLOR":
										Qe(h, t[C], x.offset, c.array), c.stride = t[C].stride;
										break;
									case "TEXCOORD":
										Qe(h, t[C], x.offset, o.array), o.stride = t[C].stride;
										break;
									case "TEXCOORD1":
										Qe(h, t[C], x.offset, s.array), o.stride = t[C].stride;
										break;
									default: console.warn("THREE.DAELoader: Semantic \"%s\" not handled in geometry build process.", S);
								}
							}
							break;
						case "NORMAL":
							Qe(h, t[x.id], x.offset, a.array), a.stride = t[x.id].stride;
							break;
						case "COLOR":
							Qe(h, t[x.id], x.offset, c.array), c.stride = t[x.id].stride;
							break;
						case "TEXCOORD":
							Qe(h, t[x.id], x.offset, o.array), o.stride = t[x.id].stride;
							break;
						case "TEXCOORD1": Qe(h, t[x.id], x.offset, s.array), s.stride = t[x.id].stride;
					}
				}
			}
			return i.array.length > 0 && d.setAttribute("position", new A.Float32BufferAttribute(i.array, i.stride)), a.array.length > 0 && d.setAttribute("normal", new A.Float32BufferAttribute(a.array, a.stride)), c.array.length > 0 && d.setAttribute("color", new A.Float32BufferAttribute(c.array, c.stride)), o.array.length > 0 && d.setAttribute("uv", new A.Float32BufferAttribute(o.array, o.stride)), s.array.length > 0 && d.setAttribute("uv2", new A.Float32BufferAttribute(s.array, s.stride)), l.array.length > 0 && d.setAttribute("skinIndex", new A.Float32BufferAttribute(l.array, l.stride)), u.array.length > 0 && d.setAttribute("skinWeight", new A.Float32BufferAttribute(u.array, u.stride)), r.data = d, r.type = e[0].type, r.materialKeys = f, r;
		}
		function Qe(e, t, n, r) {
			var i = e.p, a = e.stride, o = e.vcount;
			function s(e) {
				for (var t = i[e + n] * l, a = t + l; t < a; t++) r.push(c[t]);
			}
			var c = t.array, l = t.stride;
			if (e.vcount !== void 0) for (var u = 0, d = 0, f = o.length; d < f; d++) {
				var p = o[d];
				if (p === 4) {
					var m = u + a * 0, h = u + a * 1, g = u + a * 2, _ = u + a * 3;
					s(m), s(h), s(_), s(h), s(g), s(_);
				} else if (p === 3) {
					var m = u + a * 0, h = u + a * 1, g = u + a * 2;
					s(m), s(h), s(g);
				} else if (p > 4) for (var v = 1, y = p - 2; v <= y; v++) {
					var m = u + a * 0, h = u + a * v, g = u + a * (v + 1);
					s(m), s(h), s(g);
				}
				u += a * p;
			}
			else for (var d = 0, f = i.length; d < f; d += a) s(d);
		}
		function $e(e) {
			return m(L.geometries[e], Xe);
		}
		function et(e) {
			for (var t = {
				name: e.getAttribute("name") || "",
				joints: {},
				links: []
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				r.nodeType === 1 && r.nodeName === "technique_common" && rt(r, t);
			}
			L.kinematicsModels[e.getAttribute("id")] = t;
		}
		function tt(e) {
			return e.build === void 0 ? e : e.build;
		}
		function nt(e) {
			return m(L.kinematicsModels[e], tt);
		}
		function rt(e, t) {
			for (var n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "joint":
						t.joints[r.getAttribute("sid")] = it(r);
						break;
					case "link": t.links.push(ot(r));
				}
			}
		}
		function it(e) {
			for (var t, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "prismatic":
					case "revolute": t = at(r);
				}
			}
			return t;
		}
		function at(e, t) {
			for (var t = {
				sid: e.getAttribute("sid"),
				name: e.getAttribute("name") || "",
				axis: new A.Vector3(),
				limits: {
					min: 0,
					max: 0
				},
				type: e.nodeName,
				static: !1,
				zeroPosition: 0,
				middlePosition: 0
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "axis":
						var a = i(r.textContent);
						t.axis.fromArray(a);
						break;
					case "limits":
						var o = r.getElementsByTagName("max")[0], s = r.getElementsByTagName("min")[0];
						t.limits.max = parseFloat(o.textContent), t.limits.min = parseFloat(s.textContent);
				}
			}
			return t.limits.min >= t.limits.max && (t.static = !0), t.middlePosition = (t.limits.min + t.limits.max) / 2, t;
		}
		function ot(e) {
			for (var t = {
				sid: e.getAttribute("sid"),
				name: e.getAttribute("name") || "",
				attachments: [],
				transforms: []
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "attachment_full":
						t.attachments.push(st(r));
						break;
					case "matrix":
					case "translate":
					case "rotate": t.transforms.push(ct(r));
				}
			}
			return t;
		}
		function st(e) {
			for (var t = {
				joint: e.getAttribute("joint").split("/").pop(),
				transforms: [],
				links: []
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "link":
						t.links.push(ot(r));
						break;
					case "matrix":
					case "translate":
					case "rotate": t.transforms.push(ct(r));
				}
			}
			return t;
		}
		function ct(e) {
			var t = { type: e.nodeName }, n = i(e.textContent);
			switch (t.type) {
				case "matrix":
					t.obj = new A.Matrix4(), t.obj.fromArray(n).transpose();
					break;
				case "translate":
					t.obj = new A.Vector3(), t.obj.fromArray(n);
					break;
				case "rotate": t.obj = new A.Vector3(), t.obj.fromArray(n), t.angle = A.MathUtils.degToRad(n[3]);
			}
			return t;
		}
		function lt(e) {
			for (var t = {
				name: e.getAttribute("name") || "",
				rigidBodies: {}
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				r.nodeType === 1 && r.nodeName === "rigid_body" && (t.rigidBodies[r.getAttribute("name")] = {}, ut(r, t.rigidBodies[r.getAttribute("name")]));
			}
			L.physicsModels[e.getAttribute("id")] = t;
		}
		function ut(e, t) {
			for (var n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				r.nodeType === 1 && r.nodeName === "technique_common" && dt(r, t);
			}
		}
		function dt(e, t) {
			for (var n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "inertia":
						t.inertia = i(r.textContent);
						break;
					case "mass": t.mass = i(r.textContent)[0];
				}
			}
		}
		function ft(e) {
			for (var t = { bindJointAxis: [] }, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				r.nodeType === 1 && r.nodeName === "bind_joint_axis" && t.bindJointAxis.push(pt(r));
			}
			L.kinematicsScenes[o(e.getAttribute("url"))] = t;
		}
		function pt(e) {
			for (var t = { target: e.getAttribute("target").split("/").pop() }, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1 && r.nodeName === "axis") {
					t.axis = r.getElementsByTagName("param")[0].textContent;
					var i = t.axis.split("inst_").pop().split("axis")[0];
					t.jointIndex = i.substr(0, i.length - 1);
				}
			}
			return t;
		}
		function mt(e) {
			return e.build === void 0 ? e : e.build;
		}
		function ht(e) {
			return m(L.kinematicsScenes[e], mt);
		}
		function gt() {
			var e = Object.keys(L.kinematicsModels)[0], t = Object.keys(L.kinematicsScenes)[0], n = Object.keys(L.visualScenes)[0];
			if (e === void 0 || t === void 0) return;
			for (var r = nt(e), i = ht(t), a = Pt(n), o = i.bindJointAxis, s = {}, c = 0, l = o.length; c < l; c++) {
				var u = o[c], d = j.querySelector("[sid=\"" + u.target + "\"]");
				if (d) {
					var f = d.parentElement;
					p(u.jointIndex, f);
				}
			}
			function p(e, t) {
				var n = t.getAttribute("name"), i = r.joints[e];
				a.traverse(function(r) {
					r.name === n && (s[e] = {
						object: r,
						transforms: _t(t),
						joint: i,
						position: i.zeroPosition
					});
				});
			}
			var m = new A.Matrix4();
			F = {
				joints: r && r.joints,
				getJointValue: function(e) {
					var t = s[e];
					if (t) return t.position;
					console.warn("THREE.DAELoader: Joint " + e + " doesn't exist.");
				},
				setJointValue: function(e, t) {
					var n = s[e];
					if (n) {
						var r = n.joint;
						if (t > r.limits.max || t < r.limits.min) console.warn("THREE.DAELoader: Joint " + e + " value " + t + " outside of limits (min: " + r.limits.min + ", max: " + r.limits.max + ").");
						else if (r.static) console.warn("THREE.DAELoader: Joint " + e + " is static.");
						else {
							var i = n.object, a = r.axis, o = n.transforms;
							yt.identity();
							for (var c = 0; c < o.length; c++) {
								var l = o[c];
								if (l.sid && l.sid.indexOf(e) !== -1) switch (r.type) {
									case "revolute":
										yt.multiply(m.makeRotationAxis(a, A.MathUtils.degToRad(t)));
										break;
									case "prismatic":
										yt.multiply(m.makeTranslation(a.x * t, a.y * t, a.z * t));
										break;
									default: console.warn("THREE.DAELoader: Unknown joint type: " + r.type);
								}
								else switch (l.type) {
									case "matrix":
										yt.multiply(l.obj);
										break;
									case "translate":
										yt.multiply(m.makeTranslation(l.obj.x, l.obj.y, l.obj.z));
										break;
									case "scale":
										yt.scale(l.obj);
										break;
									case "rotate": yt.multiply(m.makeRotationAxis(l.obj, l.angle));
								}
							}
							i.matrix.copy(yt), i.matrix.decompose(i.position, i.quaternion, i.scale), s[e].position = t;
						}
					} else console.log("THREE.DAELoader: " + e + " does not exist.");
				}
			};
		}
		function _t(e) {
			for (var t = [], n = j.querySelector("[id=\"" + e.id + "\"]"), r = 0; r < n.childNodes.length; r++) {
				var a = n.childNodes[r];
				if (a.nodeType === 1) switch (a.nodeName) {
					case "matrix":
						var o = i(a.textContent), s = new A.Matrix4().fromArray(o).transpose();
						t.push({
							sid: a.getAttribute("sid"),
							type: a.nodeName,
							obj: s
						});
						break;
					case "translate":
					case "scale":
						var o = i(a.textContent), c = new A.Vector3().fromArray(o);
						t.push({
							sid: a.getAttribute("sid"),
							type: a.nodeName,
							obj: c
						});
						break;
					case "rotate":
						var o = i(a.textContent), c = new A.Vector3().fromArray(o), l = A.MathUtils.degToRad(o[3]);
						t.push({
							sid: a.getAttribute("sid"),
							type: a.nodeName,
							obj: c,
							angle: l
						});
				}
			}
			return t;
		}
		function vt(e) {
			for (var t = e.getElementsByTagName("node"), n = 0; n < t.length; n++) {
				var r = t[n];
				r.hasAttribute("id") === !1 && r.setAttribute("id", s());
			}
		}
		var yt = new A.Matrix4(), bt = new A.Vector3();
		function xt(e) {
			for (var t = {
				name: e.getAttribute("name") || "",
				type: e.getAttribute("type"),
				id: e.getAttribute("id"),
				sid: e.getAttribute("sid"),
				matrix: new A.Matrix4(),
				nodes: [],
				instanceCameras: [],
				instanceControllers: [],
				instanceLights: [],
				instanceGeometries: [],
				instanceNodes: [],
				transforms: {}
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "node":
						t.nodes.push(r.getAttribute("id")), xt(r);
						break;
					case "instance_camera":
						t.instanceCameras.push(o(r.getAttribute("url")));
						break;
					case "instance_controller":
						t.instanceControllers.push(St(r));
						break;
					case "instance_light":
						t.instanceLights.push(o(r.getAttribute("url")));
						break;
					case "instance_geometry":
						t.instanceGeometries.push(St(r));
						break;
					case "instance_node":
						t.instanceNodes.push(o(r.getAttribute("url")));
						break;
					case "matrix":
						var a = i(r.textContent);
						t.matrix.multiply(yt.fromArray(a).transpose()), t.transforms[r.getAttribute("sid")] = r.nodeName;
						break;
					case "translate":
						var a = i(r.textContent);
						bt.fromArray(a), t.matrix.multiply(yt.makeTranslation(bt.x, bt.y, bt.z)), t.transforms[r.getAttribute("sid")] = r.nodeName;
						break;
					case "rotate":
						var a = i(r.textContent), s = A.MathUtils.degToRad(a[3]);
						t.matrix.multiply(yt.makeRotationAxis(bt.fromArray(a), s)), t.transforms[r.getAttribute("sid")] = r.nodeName;
						break;
					case "scale":
						var a = i(r.textContent);
						t.matrix.scale(bt.fromArray(a)), t.transforms[r.getAttribute("sid")] = r.nodeName;
						break;
					case "extra": break;
					default: console.log(r);
				}
			}
			return kt(t.id) ? console.warn("THREE.DAELoader: There is already a node with ID %s. Exclude current node from further processing.", t.id) : L.nodes[t.id] = t, t;
		}
		function St(e) {
			for (var t = {
				id: o(e.getAttribute("url")),
				materials: {},
				skeletons: []
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				switch (r.nodeName) {
					case "bind_material":
						for (var i = r.getElementsByTagName("instance_material"), a = 0; a < i.length; a++) {
							var s = i[a], c = s.getAttribute("symbol"), l = s.getAttribute("target");
							t.materials[c] = o(l);
						}
						break;
					case "skeleton": t.skeletons.push(o(r.textContent));
				}
			}
			return t;
		}
		function Ct(e, t) {
			for (var n = [], r = [], i = 0, a, o; i < e.length; i++) {
				var s = e[i], c;
				if (kt(s)) c = At(s), wt(c, t, n);
				else if (Nt(s)) for (var l = L.visualScenes[s].children, a = 0; a < l.length; a++) {
					var u = l[a];
					if (u.type === "JOINT") {
						var c = At(u.id);
						wt(c, t, n);
					}
				}
				else console.error("THREE.DAELoader: Unable to find root bone of skeleton with ID:", s);
			}
			for (i = 0; i < t.length; i++) for (a = 0; a < n.length; a++) if (o = n[a], o.bone.name === t[i].name) {
				r[i] = o, o.processed = !0;
				break;
			}
			for (i = 0; i < n.length; i++) o = n[i], o.processed === !1 && (r.push(o), o.processed = !0);
			var d = [], f = [];
			for (i = 0; i < r.length; i++) o = r[i], d.push(o.bone), f.push(o.boneInverse);
			return new A.Skeleton(d, f);
		}
		function wt(e, t, n) {
			e.traverse(function(e) {
				if (e.isBone === !0) {
					for (var r, i = 0; i < t.length; i++) {
						var a = t[i];
						if (a.name === e.name) {
							r = a.boneInverse;
							break;
						}
					}
					r === void 0 && (r = new A.Matrix4()), n.push({
						bone: e,
						boneInverse: r,
						processed: !1
					});
				}
			});
		}
		function Tt(e) {
			for (var t = [], n = e.matrix, r = e.nodes, i = e.type, a = e.instanceCameras, o = e.instanceControllers, s = e.instanceLights, c = e.instanceGeometries, l = e.instanceNodes, u = 0, d = r.length; u < d; u++) t.push(At(r[u]));
			for (var u = 0, d = a.length; u < d; u++) {
				var f = Re(a[u]);
				f !== null && t.push(f.clone());
			}
			for (var u = 0, d = o.length; u < d; u++) for (var p = o[u], m = de(p.id), h = $e(m.id), g = Ot(h, p.materials), _ = p.skeletons, v = m.skin.joints, y = Ct(_, v), b = 0, x = g.length; b < x; b++) {
				var S = g[b];
				S.isSkinnedMesh && (S.bind(y, m.skin.bindMatrix), S.normalizeSkinWeights()), t.push(S);
			}
			for (var u = 0, d = s.length; u < d; u++) {
				var C = Ue(s[u]);
				C !== null && t.push(C.clone());
			}
			for (var u = 0, d = c.length; u < d; u++) for (var p = c[u], h = $e(p.id), g = Ot(h, p.materials), b = 0, x = g.length; b < x; b++) t.push(g[b]);
			for (var u = 0, d = l.length; u < d; u++) t.push(At(l[u]).clone());
			var S;
			if (r.length === 0 && t.length === 1) S = t[0];
			else {
				S = i === "JOINT" ? new A.Bone() : new A.Group();
				for (var u = 0; u < t.length; u++) S.add(t[u]);
			}
			return S.name === "" && (S.name = i === "JOINT" ? e.sid : e.name), S.matrix.copy(n), S.matrix.decompose(S.position, S.quaternion, S.scale), S;
		}
		var Et = new A.MeshBasicMaterial({ color: 16711935 });
		function Dt(e, t) {
			for (var n = [], r = 0, i = e.length; r < i; r++) {
				var a = t[e[r]];
				a === void 0 ? (console.warn("THREE.DAELoader: Material with key %s not found. Apply fallback material.", e[r]), n.push(Et)) : n.push(Me(a));
			}
			return n;
		}
		function Ot(e, t) {
			var n = [];
			for (var r in e) {
				var i = e[r], a = Dt(i.materialKeys, t);
				a.length === 0 && (r === "lines" || r === "linestrips" ? a.push(new A.LineBasicMaterial()) : a.push(new A.MeshPhongMaterial()));
				var o = i.data.attributes.skinIndex !== void 0;
				if (o) for (var s = 0, c = a.length; s < c; s++) a[s].skinning = !0;
				var l = a.length === 1 ? a[0] : a, u;
				switch (r) {
					case "lines":
						u = new A.LineSegments(i.data, l);
						break;
					case "linestrips":
						u = new A.Line(i.data, l);
						break;
					case "triangles":
					case "polylist": u = o ? new A.SkinnedMesh(i.data, l) : new A.Mesh(i.data, l);
				}
				n.push(u);
			}
			return n;
		}
		function kt(e) {
			return L.nodes[e] !== void 0;
		}
		function At(e) {
			return m(L.nodes[e], Tt);
		}
		function jt(e) {
			var t = {
				name: e.getAttribute("name"),
				children: []
			};
			vt(e);
			for (var r = n(e, "node"), i = 0; i < r.length; i++) t.children.push(xt(r[i]));
			L.visualScenes[e.getAttribute("id")] = t;
		}
		function Mt(e) {
			var t = new A.Group();
			t.name = e.name;
			for (var n = e.children, r = 0; r < n.length; r++) {
				var i = n[r];
				t.add(At(i.id));
			}
			return t;
		}
		function Nt(e) {
			return L.visualScenes[e] !== void 0;
		}
		function Pt(e) {
			return m(L.visualScenes[e], Mt);
		}
		function Ft(e) {
			var t = n(e, "instance_visual_scene")[0];
			return Pt(o(t.getAttribute("url")));
		}
		function It() {
			var e = L.clips;
			if (c(e) === !0) {
				if (c(L.animations) === !1) {
					var t = [];
					for (var n in L.animations) for (var r = y(n), i = 0, a = r.length; i < a; i++) t.push(r[i]);
					Ut.push(new A.AnimationClip("default", -1, t));
				}
			} else for (var n in e) Ut.push(ae(n));
		}
		function Lt(e) {
			for (var t = "", n = [e]; n.length;) {
				var r = n.shift();
				r.nodeType === Node.TEXT_NODE ? t += r.textContent : (t += "\n", n.push(...r.childNodes));
			}
			return t.trim();
		}
		if (e.length === 0) return { scene: new A.Scene() };
		var Rt = new DOMParser().parseFromString(e, "application/xml"), j = n(Rt, "COLLADA")[0], zt = Rt.getElementsByTagName("parsererror")[0];
		if (zt !== void 0) {
			var Bt = n(zt, "div")[0], Vt = Bt ? Bt.textContent : Lt(zt);
			return console.error("THREE.DAELoader: Failed to parse collada file.\n", Vt), null;
		}
		var M = j.getAttribute("version");
		console.log("THREE.DAELoader: File version", M);
		var N = l(n(j, "asset")[0]), Ht = new A.TextureLoader(this.manager);
		Ht.setPath(this.resourcePath || t).setCrossOrigin(this.crossOrigin);
		var P;
		Xa && (P = new Xa(this.manager), P.setPath(this.resourcePath || t));
		let Ut = [], F = {}, I = 0, L = {
			animations: {},
			clips: {},
			controllers: {},
			images: {},
			effects: {},
			materials: {},
			cameras: {},
			lights: {},
			geometries: {},
			nodes: {},
			visualScenes: {},
			kinematicsModels: {},
			physicsModels: {},
			kinematicsScenes: {}
		};
		f(j, "library_animations", "animation", h), f(j, "library_animation_clips", "animation_clip", re), f(j, "library_controllers", "controller", oe), f(j, "library_images", "image", fe), f(j, "library_effects", "effect", k), f(j, "library_materials", "material", ke), f(j, "library_cameras", "camera", Ne), f(j, "library_lights", "light", ze), f(j, "library_geometries", "geometry", We), f(j, "library_nodes", "node", xt), f(j, "library_visual_scenes", "visual_scene", jt), f(j, "library_kinematics_models", "kinematics_model", et), f(j, "library_physics_models", "physics_model", lt), f(j, "scene", "instance_kinematics_scene", ft), p(L.animations, v), p(L.clips, ie), p(L.controllers, O), p(L.images, pe), p(L.effects, De), p(L.materials, je), p(L.cameras, Le), p(L.lights, He), p(L.geometries, Xe), p(L.visualScenes, Mt), It(), gt();
		var Wt = Ft(n(j, "scene")[0]);
		return N.upAxis === "Z_UP" && Wt.quaternion.setFromEuler(new A.Euler(-Math.PI / 2, 0, 0)), Wt.scale.multiplyScalar(N.unit), {
			animations: Ut,
			kinematics: F,
			library: L,
			scene: Wt
		};
	}
}, Qa = class {
	constructor(e) {
		this._pointer = 0, this._eof = !1, this._data = e;
	}
	next() {
		if (!this.hasNext()) throw this._eof ? Error("Cannot call 'next' after EOF group has been read") : Error("Unexpected end of input: EOF group not read before end of file. Ended on code " + this._data[this._pointer]);
		let e = { code: parseInt(this._data[this._pointer]) };
		return this._pointer++, e.value = $a(e.code, this._data[this._pointer].trim()), this._pointer++, e.code === 0 && e.value === "EOF" && (this._eof = !0), this.lastReadGroup = e, e;
	}
	peek() {
		if (!this.hasNext()) throw this._eof ? Error("Cannot call 'next' after EOF group has been read") : Error("Unexpected end of input: EOF group not read before end of file. Ended on code " + this._data[this._pointer]);
		let e = { code: parseInt(this._data[this._pointer]) };
		return e.value = $a(e.code, this._data[this._pointer + 1].trim()), e;
	}
	rewind(e = 1) {
		this._pointer -= e * 2;
	}
	hasNext() {
		return !(this._eof || this._pointer > this._data.length - 2);
	}
	isEOF() {
		return this._eof;
	}
};
function $a(e, t) {
	return e <= 9 ? t : e >= 10 && e <= 59 ? parseFloat(t) : e >= 60 && e <= 99 ? parseInt(t) : e >= 100 && e <= 109 ? t : e >= 110 && e <= 149 ? parseFloat(t) : e >= 160 && e <= 179 ? parseInt(t) : e >= 210 && e <= 239 ? parseFloat(t) : e >= 270 && e <= 289 ? parseInt(t) : e >= 290 && e <= 299 ? eo(t) : e >= 300 && e <= 369 ? t : e >= 370 && e <= 389 ? parseInt(t) : e >= 390 && e <= 399 ? t : e >= 400 && e <= 409 ? parseInt(t) : e >= 410 && e <= 419 ? t : e >= 420 && e <= 429 ? parseInt(t) : e >= 430 && e <= 439 ? t : e >= 440 && e <= 459 ? parseInt(t) : e >= 460 && e <= 469 ? parseFloat(t) : e >= 470 && e <= 481 || e === 999 || e >= 1e3 && e <= 1009 ? t : e >= 1010 && e <= 1059 ? parseFloat(t) : e >= 1060 && e <= 1071 ? parseInt(t) : (console.log("WARNING: Group code does not have a defined type: %j", {
		code: e,
		value: t
	}), t);
}
function eo(e) {
	if (e === "0") return !1;
	if (e === "1") return !0;
	throw TypeError("String '" + e + "' cannot be cast to Boolean type");
}
// node_modules/dxf-parser/dist/AutoCadColorIndex.js
var to = [
	0,
	16711680,
	16776960,
	65280,
	65535,
	255,
	16711935,
	16777215,
	8421504,
	12632256,
	16711680,
	16744319,
	13369344,
	13395558,
	10027008,
	10046540,
	8323072,
	8339263,
	4980736,
	4990502,
	16727808,
	16752511,
	13382400,
	13401958,
	10036736,
	10051404,
	8331008,
	8343359,
	4985600,
	4992806,
	16744192,
	16760703,
	13395456,
	13408614,
	10046464,
	10056268,
	8339200,
	8347455,
	4990464,
	4995366,
	16760576,
	16768895,
	13408512,
	13415014,
	10056192,
	10061132,
	8347392,
	8351551,
	4995328,
	4997670,
	16776960,
	16777087,
	13421568,
	13421670,
	10000384,
	10000460,
	8355584,
	8355647,
	5000192,
	5000230,
	12582656,
	14679935,
	10079232,
	11717734,
	7510016,
	8755276,
	6258432,
	7307071,
	3755008,
	4344870,
	8388352,
	12582783,
	6736896,
	10079334,
	5019648,
	7510092,
	4161280,
	6258495,
	2509824,
	3755046,
	4194048,
	10485631,
	3394560,
	8375398,
	2529280,
	6264908,
	2064128,
	5209919,
	1264640,
	3099686,
	65280,
	8388479,
	52224,
	6736998,
	38912,
	5019724,
	32512,
	4161343,
	19456,
	2509862,
	65343,
	8388511,
	52275,
	6737023,
	38950,
	5019743,
	32543,
	4161359,
	19475,
	2509871,
	65407,
	8388543,
	52326,
	6737049,
	38988,
	5019762,
	32575,
	4161375,
	19494,
	2509881,
	65471,
	8388575,
	52377,
	6737074,
	39026,
	5019781,
	32607,
	4161391,
	19513,
	2509890,
	65535,
	8388607,
	52428,
	6737100,
	39064,
	5019800,
	32639,
	4161407,
	19532,
	2509900,
	49151,
	8380415,
	39372,
	6730444,
	29336,
	5014936,
	24447,
	4157311,
	14668,
	2507340,
	32767,
	8372223,
	26316,
	6724044,
	19608,
	5010072,
	16255,
	4153215,
	9804,
	2505036,
	16383,
	8364031,
	13260,
	6717388,
	9880,
	5005208,
	8063,
	4149119,
	4940,
	2502476,
	255,
	8355839,
	204,
	6710988,
	152,
	5000344,
	127,
	4145023,
	76,
	2500172,
	4129023,
	10452991,
	3342540,
	8349388,
	2490520,
	6245528,
	2031743,
	5193599,
	1245260,
	3089996,
	8323327,
	12550143,
	6684876,
	10053324,
	4980888,
	7490712,
	4128895,
	6242175,
	2490444,
	3745356,
	12517631,
	14647295,
	10027212,
	11691724,
	7471256,
	8735896,
	6226047,
	7290751,
	3735628,
	4335180,
	16711935,
	16744447,
	13369548,
	13395660,
	9961624,
	9981080,
	8323199,
	8339327,
	4980812,
	4990540,
	16711871,
	16744415,
	13369497,
	13395634,
	9961586,
	9981061,
	8323167,
	8339311,
	4980793,
	4990530,
	16711807,
	16744383,
	13369446,
	13395609,
	9961548,
	9981042,
	8323135,
	8339295,
	4980774,
	4990521,
	16711743,
	16744351,
	13369395,
	13395583,
	9961510,
	9981023,
	8323103,
	8339279,
	4980755,
	4990511,
	3355443,
	5987163,
	8684676,
	11382189,
	14079702,
	16777215
];
// node_modules/dxf-parser/dist/ParseHelpers.js
function no(e) {
	return to[e];
}
function G(e) {
	let t = {};
	e.rewind();
	let n = e.next(), r = n.code;
	if (t.x = n.value, r += 10, n = e.next(), n.code != r) throw Error("Expected code for point value to be " + r + " but got " + n.code + ".");
	return t.y = n.value, r += 10, n = e.next(), n.code == r ? (t.z = n.value, t) : (e.rewind(), t);
}
function ro(e, t, n) {
	switch (t.code) {
		case 0:
			e.type = t.value;
			break;
		case 5:
			e.handle = t.value;
			break;
		case 6:
			e.lineType = t.value;
			break;
		case 8:
			e.layer = t.value;
			break;
		case 48:
			e.lineTypeScale = t.value;
			break;
		case 60:
			e.visible = t.value === 0;
			break;
		case 62:
			e.colorIndex = t.value, e.color = no(Math.abs(t.value));
			break;
		case 67:
			e.inPaperSpace = t.value !== 0;
			break;
		case 100: break;
		case 101:
			for (; t.code != 0;) t = n.next();
			n.rewind();
			break;
		case 330:
			e.ownerHandle = t.value;
			break;
		case 347:
			e.materialObjectHandle = t.value;
			break;
		case 370:
			e.lineweight = t.value;
			break;
		case 420:
			e.color = t.value;
			break;
		case 1e3:
			e.extendedData = e.extendedData || {}, e.extendedData.customStrings = e.extendedData.customStrings || [], e.extendedData.customStrings.push(t.value);
			break;
		case 1001:
			e.extendedData = e.extendedData || {}, e.extendedData.applicationName = t.value;
			break;
		default: return !1;
	}
	return !0;
}
// node_modules/dxf-parser/dist/entities/3dface.js
var io = class {
	constructor() {
		this.ForEntityName = "3DFACE";
	}
	parseEntity(e, t) {
		let n = {
			type: t.value,
			vertices: []
		};
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 70:
					n.shape = (t.value & 1) == 1, n.hasContinuousLinetypePattern = (t.value & 128) == 128;
					break;
				case 10:
					n.vertices = ao(e, t), t = e.lastReadGroup;
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
};
function ao(e, t) {
	var n = [], r = !1, i = !1, a = 4;
	for (let s = 0; s <= a; s++) {
		for (var o = {}; !e.isEOF() && !(t.code === 0 || i);) {
			switch (t.code) {
				case 10:
				case 11:
				case 12:
				case 13:
					if (r) {
						i = !0;
						continue;
					}
					o.x = t.value, r = !0;
					break;
				case 20:
				case 21:
				case 22:
				case 23:
					o.y = t.value;
					break;
				case 30:
				case 31:
				case 32:
				case 33:
					o.z = t.value;
					break;
				default: return n;
			}
			t = e.next();
		}
		n.push(o), r = !1, i = !1;
	}
	return e.rewind(), n;
}
// node_modules/dxf-parser/dist/entities/arc.js
var oo = class {
	constructor() {
		this.ForEntityName = "ARC";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.center = G(e);
					break;
				case 40:
					n.radius = t.value;
					break;
				case 50:
					n.startAngle = Math.PI / 180 * t.value;
					break;
				case 51:
					n.endAngle = Math.PI / 180 * t.value, n.angleLength = n.endAngle - n.startAngle;
					break;
				case 210:
					n.extrusionDirectionX = t.value;
					break;
				case 220:
					n.extrusionDirectionY = t.value;
					break;
				case 230:
					n.extrusionDirectionZ = t.value;
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, so = class {
	constructor() {
		this.ForEntityName = "ATTDEF";
	}
	parseEntity(e, t) {
		var n = {
			type: t.value,
			scale: 1,
			textStyle: "STANDARD"
		};
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 1:
					n.text = t.value;
					break;
				case 2:
					n.tag = t.value;
					break;
				case 3:
					n.prompt = t.value;
					break;
				case 7:
					n.textStyle = t.value;
					break;
				case 10:
					n.startPoint = G(e);
					break;
				case 11:
					n.endPoint = G(e);
					break;
				case 39:
					n.thickness = t.value;
					break;
				case 40:
					n.textHeight = t.value;
					break;
				case 41:
					n.scale = t.value;
					break;
				case 50:
					n.rotation = t.value;
					break;
				case 51:
					n.obliqueAngle = t.value;
					break;
				case 70:
					n.invisible = !!(t.value & 1), n.constant = !!(t.value & 2), n.verificationRequired = !!(t.value & 4), n.preset = !!(t.value & 8);
					break;
				case 71:
					n.backwards = !!(t.value & 2), n.mirrored = !!(t.value & 4);
					break;
				case 72:
					n.horizontalJustification = t.value;
					break;
				case 73:
					n.fieldLength = t.value;
					break;
				case 74:
					n.verticalJustification = t.value;
					break;
				case 100: break;
				case 210:
					n.extrusionDirectionX = t.value;
					break;
				case 220:
					n.extrusionDirectionY = t.value;
					break;
				case 230:
					n.extrusionDirectionZ = t.value;
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, co = class {
	constructor() {
		this.ForEntityName = "CIRCLE";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.center = G(e);
					break;
				case 40:
					n.radius = t.value;
					break;
				case 50:
					n.startAngle = Math.PI / 180 * t.value;
					break;
				case 51:
					let r = Math.PI / 180 * t.value;
					n.angleLength = r < n.startAngle ? r + 2 * Math.PI - n.startAngle : r - n.startAngle, n.endAngle = r;
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, lo = class {
	constructor() {
		this.ForEntityName = "DIMENSION";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 2:
					n.block = t.value;
					break;
				case 10:
					n.anchorPoint = G(e);
					break;
				case 11:
					n.middleOfText = G(e);
					break;
				case 12:
					n.insertionPoint = G(e);
					break;
				case 13:
					n.linearOrAngularPoint1 = G(e);
					break;
				case 14:
					n.linearOrAngularPoint2 = G(e);
					break;
				case 15:
					n.diameterOrRadiusPoint = G(e);
					break;
				case 16:
					n.arcPoint = G(e);
					break;
				case 70:
					n.dimensionType = t.value;
					break;
				case 71:
					n.attachmentPoint = t.value;
					break;
				case 42:
					n.actualMeasurement = t.value;
					break;
				case 1:
					n.text = t.value;
					break;
				case 50:
					n.angle = t.value;
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, uo = class {
	constructor() {
		this.ForEntityName = "ELLIPSE";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.center = G(e);
					break;
				case 11:
					n.majorAxisEndPoint = G(e);
					break;
				case 40:
					n.axisRatio = t.value;
					break;
				case 41:
					n.startAngle = t.value;
					break;
				case 42:
					n.endAngle = t.value;
					break;
				case 2:
					n.name = t.value;
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, fo = class {
	constructor() {
		this.ForEntityName = "INSERT";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 2:
					n.name = t.value;
					break;
				case 41:
					n.xScale = t.value;
					break;
				case 42:
					n.yScale = t.value;
					break;
				case 43:
					n.zScale = t.value;
					break;
				case 10:
					n.position = G(e);
					break;
				case 50:
					n.rotation = t.value;
					break;
				case 70:
					n.columnCount = t.value;
					break;
				case 71:
					n.rowCount = t.value;
					break;
				case 44:
					n.columnSpacing = t.value;
					break;
				case 45:
					n.rowSpacing = t.value;
					break;
				case 210:
					n.extrusionDirection = G(e);
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, po = class {
	constructor() {
		this.ForEntityName = "LINE";
	}
	parseEntity(e, t) {
		let n = {
			type: t.value,
			vertices: []
		};
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.vertices.unshift(G(e));
					break;
				case 11:
					n.vertices.push(G(e));
					break;
				case 210:
					n.extrusionDirection = G(e);
					break;
				case 100: break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, mo = class {
	constructor() {
		this.ForEntityName = "LWPOLYLINE";
	}
	parseEntity(e, t) {
		let n = {
			type: t.value,
			vertices: []
		}, r = 0;
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 38:
					n.elevation = t.value;
					break;
				case 39:
					n.depth = t.value;
					break;
				case 70:
					n.shape = (t.value & 1) == 1, n.hasContinuousLinetypePattern = (t.value & 128) == 128;
					break;
				case 90:
					r = t.value;
					break;
				case 10:
					n.vertices = ho(r, e);
					break;
				case 43:
					t.value !== 0 && (n.width = t.value);
					break;
				case 210:
					n.extrusionDirectionX = t.value;
					break;
				case 220:
					n.extrusionDirectionY = t.value;
					break;
				case 230:
					n.extrusionDirectionZ = t.value;
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
};
function ho(e, t) {
	if (!e || e <= 0) throw Error("n must be greater than 0 verticies");
	let n = [], r = !1, i = !1, a = t.lastReadGroup;
	for (let o = 0; o < e; o++) {
		let e = {};
		for (; !t.isEOF() && !(a.code === 0 || i);) {
			switch (a.code) {
				case 10:
					if (r) {
						i = !0;
						continue;
					}
					e.x = a.value, r = !0;
					break;
				case 20:
					e.y = a.value;
					break;
				case 30:
					e.z = a.value;
					break;
				case 40:
					e.startWidth = a.value;
					break;
				case 41:
					e.endWidth = a.value;
					break;
				case 42:
					a.value != 0 && (e.bulge = a.value);
					break;
				default: return t.rewind(), r && n.push(e), t.rewind(), n;
			}
			a = t.next();
		}
		n.push(e), r = !1, i = !1;
	}
	return t.rewind(), n;
}
// node_modules/dxf-parser/dist/entities/mtext.js
var go = class {
	constructor() {
		this.ForEntityName = "MTEXT";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 3:
					n.text ? n.text += t.value : n.text = t.value;
					break;
				case 1:
					n.text ? n.text += t.value : n.text = t.value;
					break;
				case 10:
					n.position = G(e);
					break;
				case 11:
					n.directionVector = G(e);
					break;
				case 40:
					n.height = t.value;
					break;
				case 41:
					n.width = t.value;
					break;
				case 50:
					n.rotation = t.value;
					break;
				case 71:
					n.attachmentPoint = t.value;
					break;
				case 72:
					n.drawingDirection = t.value;
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, _o = class {
	constructor() {
		this.ForEntityName = "POINT";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.position = G(e);
					break;
				case 39:
					n.thickness = t.value;
					break;
				case 210:
					n.extrusionDirection = G(e);
					break;
				case 100: break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, vo = class {
	constructor() {
		this.ForEntityName = "VERTEX";
	}
	parseEntity(e, t) {
		var n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.x = t.value;
					break;
				case 20:
					n.y = t.value;
					break;
				case 30:
					n.z = t.value;
					break;
				case 40: break;
				case 41: break;
				case 42:
					t.value != 0 && (n.bulge = t.value);
					break;
				case 70:
					n.curveFittingVertex = !!(t.value & 1), n.curveFitTangent = !!(t.value & 2), n.splineVertex = !!(t.value & 8), n.splineControlPoint = !!(t.value & 16), n.threeDPolylineVertex = !!(t.value & 32), n.threeDPolylineMesh = !!(t.value & 64), n.polyfaceMeshVertex = !!(t.value & 128);
					break;
				case 50: break;
				case 71:
					n.faceA = t.value;
					break;
				case 72:
					n.faceB = t.value;
					break;
				case 73:
					n.faceC = t.value;
					break;
				case 74:
					n.faceD = t.value;
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, yo = class {
	constructor() {
		this.ForEntityName = "POLYLINE";
	}
	parseEntity(e, t) {
		var n = {
			type: t.value,
			vertices: []
		};
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10: break;
				case 20: break;
				case 30: break;
				case 39:
					n.thickness = t.value;
					break;
				case 40: break;
				case 41: break;
				case 70:
					n.shape = !!(t.value & 1), n.includesCurveFitVertices = !!(t.value & 2), n.includesSplineFitVertices = !!(t.value & 4), n.is3dPolyline = !!(t.value & 8), n.is3dPolygonMesh = !!(t.value & 16), n.is3dPolygonMeshClosed = !!(t.value & 32), n.isPolyfaceMesh = !!(t.value & 64), n.hasContinuousLinetypePattern = !!(t.value & 128);
					break;
				case 71: break;
				case 72: break;
				case 73: break;
				case 74: break;
				case 75: break;
				case 210:
					n.extrusionDirection = G(e);
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n.vertices = bo(e, t), n;
	}
};
function bo(e, t) {
	let n = new vo(), r = [];
	for (; !e.isEOF();) if (t.code === 0) {
		if (t.value === "VERTEX") r.push(n.parseEntity(e, t)), t = e.lastReadGroup;
		else if (t.value === "SEQEND") {
			xo(e, t);
			break;
		}
	}
	return r;
}
function xo(e, t) {
	let n = { type: t.value };
	for (t = e.next(); !e.isEOF() && t.code != 0;) ro(n, t, e), t = e.next();
	return n;
}
// node_modules/dxf-parser/dist/entities/solid.js
var So = class {
	constructor() {
		this.ForEntityName = "SOLID";
	}
	parseEntity(e, t) {
		let n = {
			type: t.value,
			points: []
		};
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.points[0] = G(e);
					break;
				case 11:
					n.points[1] = G(e);
					break;
				case 12:
					n.points[2] = G(e);
					break;
				case 13:
					n.points[3] = G(e);
					break;
				case 210:
					n.extrusionDirection = G(e);
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, Co = class {
	constructor() {
		this.ForEntityName = "SPLINE";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.controlPoints ||= [], n.controlPoints.push(G(e));
					break;
				case 11:
					n.fitPoints ||= [], n.fitPoints.push(G(e));
					break;
				case 12:
					n.startTangent = G(e);
					break;
				case 13:
					n.endTangent = G(e);
					break;
				case 40:
					n.knotValues ||= [], n.knotValues.push(t.value);
					break;
				case 70:
					t.value & 1 && (n.closed = !0), t.value & 2 && (n.periodic = !0), t.value & 4 && (n.rational = !0), t.value & 8 && (n.planar = !0), t.value & 16 && (n.planar = !0, n.linear = !0);
					break;
				case 71:
					n.degreeOfSplineCurve = t.value;
					break;
				case 72:
					n.numberOfKnots = t.value;
					break;
				case 73:
					n.numberOfControlPoints = t.value;
					break;
				case 74:
					n.numberOfFitPoints = t.value;
					break;
				case 210:
					n.normalVector = G(e);
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, wo = class {
	constructor() {
		this.ForEntityName = "TEXT";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.startPoint = G(e);
					break;
				case 11:
					n.endPoint = G(e);
					break;
				case 40:
					n.textHeight = t.value;
					break;
				case 41:
					n.xScale = t.value;
					break;
				case 50:
					n.rotation = t.value;
					break;
				case 1:
					n.text = t.value;
					break;
				case 72:
					n.halign = t.value;
					break;
				case 73:
					n.valign = t.value;
					break;
				default: ro(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, K = /* @__PURE__ */ d((/* @__PURE__ */ t(((e, t, n) => {
	(function(e, n) {
		typeof define == "function" && define.amd ? define(n) : typeof t == "object" && t.exports ? t.exports = n() : e.log = n();
	})(n, function() {
		var e = function() {}, t = "undefined", n = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent), r = [
			"trace",
			"debug",
			"info",
			"warn",
			"error"
		], i = {}, a = null;
		function o(e, t) {
			var n = e[t];
			if (typeof n.bind == "function") return n.bind(e);
			try {
				return Function.prototype.bind.call(n, e);
			} catch {
				return function() {
					return Function.prototype.apply.apply(n, [e, arguments]);
				};
			}
		}
		function s() {
			console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
		}
		function c(r) {
			return r === "debug" && (r = "log"), typeof console === t ? !1 : r === "trace" && n ? s : console[r] === void 0 ? console.log === void 0 ? e : o(console, "log") : o(console, r);
		}
		function l() {
			for (var n = this.getLevel(), i = 0; i < r.length; i++) {
				var a = r[i];
				this[a] = i < n ? e : this.methodFactory(a, n, this.name);
			}
			if (this.log = this.debug, typeof console === t && n < this.levels.SILENT) return "No console available for logging";
		}
		function u(e) {
			return function() {
				typeof console !== t && (l.call(this), this[e].apply(this, arguments));
			};
		}
		function d(e, t, n) {
			return c(e) || u.apply(this, arguments);
		}
		function f(e, n) {
			var o = this, s, c, u, f = "loglevel";
			typeof e == "string" ? f += ":" + e : typeof e == "symbol" && (f = void 0);
			function p(e) {
				var n = (r[e] || "silent").toUpperCase();
				if (typeof window !== t && f) {
					try {
						window.localStorage[f] = n;
						return;
					} catch {}
					try {
						window.document.cookie = encodeURIComponent(f) + "=" + n + ";";
					} catch {}
				}
			}
			function m() {
				var e;
				if (typeof window !== t && f) {
					try {
						e = window.localStorage[f];
					} catch {}
					if (typeof e === t) try {
						var n = window.document.cookie, r = encodeURIComponent(f), i = n.indexOf(r + "=");
						i !== -1 && (e = /^([^;]+)/.exec(n.slice(i + r.length + 1))[1]);
					} catch {}
					return o.levels[e] === void 0 && (e = void 0), e;
				}
			}
			function h() {
				if (typeof window !== t && f) {
					try {
						window.localStorage.removeItem(f);
					} catch {}
					try {
						window.document.cookie = encodeURIComponent(f) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
					} catch {}
				}
			}
			function g(e) {
				var t = e;
				if (typeof t == "string" && o.levels[t.toUpperCase()] !== void 0 && (t = o.levels[t.toUpperCase()]), typeof t == "number" && t >= 0 && t <= o.levels.SILENT) return t;
				throw TypeError("log.setLevel() called with invalid level: " + e);
			}
			o.name = e, o.levels = {
				TRACE: 0,
				DEBUG: 1,
				INFO: 2,
				WARN: 3,
				ERROR: 4,
				SILENT: 5
			}, o.methodFactory = n || d, o.getLevel = function() {
				return u ?? c ?? s;
			}, o.setLevel = function(e, t) {
				return u = g(e), t !== !1 && p(u), l.call(o);
			}, o.setDefaultLevel = function(e) {
				c = g(e), m() || o.setLevel(e, !1);
			}, o.resetLevel = function() {
				u = null, h(), l.call(o);
			}, o.enableAll = function(e) {
				o.setLevel(o.levels.TRACE, e);
			}, o.disableAll = function(e) {
				o.setLevel(o.levels.SILENT, e);
			}, o.rebuild = function() {
				if (a !== o && (s = g(a.getLevel())), l.call(o), a === o) for (var e in i) i[e].rebuild();
			}, s = g(a ? a.getLevel() : "WARN");
			var _ = m();
			_ != null && (u = g(_)), l.call(o);
		}
		a = new f(), a.getLogger = function(e) {
			if (typeof e != "symbol" && typeof e != "string" || e === "") throw TypeError("You must supply a name when creating a logger.");
			var t = i[e];
			return t ||= i[e] = new f(e, a.methodFactory), t;
		};
		var p = typeof window === t ? void 0 : window.log;
		return a.noConflict = function() {
			return typeof window !== t && window.log === a && (window.log = p), a;
		}, a.getLoggers = function() {
			return i;
		}, a.default = a, a;
	});
})))());
K.default.setLevel("error");
function To(e) {
	e.registerEntityHandler(io), e.registerEntityHandler(oo), e.registerEntityHandler(so), e.registerEntityHandler(co), e.registerEntityHandler(lo), e.registerEntityHandler(uo), e.registerEntityHandler(fo), e.registerEntityHandler(po), e.registerEntityHandler(mo), e.registerEntityHandler(go), e.registerEntityHandler(_o), e.registerEntityHandler(yo), e.registerEntityHandler(So), e.registerEntityHandler(Co), e.registerEntityHandler(wo);
}
var Eo = class {
	constructor() {
		this._entityHandlers = {}, To(this);
	}
	parse(e) {
		return typeof e == "string" ? this._parse(e) : (console.error("Cannot read dxf source of type `" + typeof e), null);
	}
	registerEntityHandler(e) {
		let t = new e();
		this._entityHandlers[t.ForEntityName] = t;
	}
	parseSync(e) {
		return this.parse(e);
	}
	parseStream(e) {
		let t = "", n = this;
		return new Promise((r, i) => {
			e.on("data", (e) => {
				t += e;
			}), e.on("end", () => {
				try {
					r(n._parse(t));
				} catch (e) {
					i(e);
				}
			}), e.on("error", (e) => {
				i(e);
			});
		});
	}
	_parse(e) {
		let t = {}, n = 0, r = new Qa(e.split(/\r\n|\r|\n/g));
		if (!r.hasNext()) throw Error("Empty file");
		let i = this, a;
		function o() {
			for (a = r.next(); !r.isEOF();) if (a.code === 0 && a.value === "SECTION") {
				if (a = r.next(), a.code !== 2) {
					console.error("Unexpected code %s after 0:SECTION", ko(a)), a = r.next();
					continue;
				}
				a.value === "HEADER" ? (K.default.debug("> HEADER"), t.header = s(), K.default.debug("<")) : a.value === "BLOCKS" ? (K.default.debug("> BLOCKS"), t.blocks = c(), K.default.debug("<")) : a.value === "ENTITIES" ? (K.default.debug("> ENTITIES"), t.entities = _(!1), K.default.debug("<")) : a.value === "TABLES" ? (K.default.debug("> TABLES"), t.tables = u(), K.default.debug("<")) : a.value === "EOF" ? K.default.debug("EOF") : K.default.warn("Skipping section '%s'", a.value);
			} else a = r.next();
		}
		function s() {
			let e = null, t = null, n = {};
			for (a = r.next();;) {
				if (Do(a, 0, "ENDSEC")) {
					e && (n[e] = t);
					break;
				}
				a.code === 9 ? (e && (n[e] = t), e = a.value) : a.code === 10 ? t = { x: a.value } : a.code === 20 ? t.y = a.value : a.code === 30 ? t.z = a.value : t = a.value, a = r.next();
			}
			return a = r.next(), n;
		}
		function c() {
			let e = {};
			for (a = r.next(); a.value !== "EOF" && !Do(a, 0, "ENDSEC");) if (Do(a, 0, "BLOCK")) {
				K.default.debug("block {");
				let t = l();
				K.default.debug("}"), y(t), t.name ? e[t.name] = t : K.default.error("block with handle \"" + t.handle + "\" is missing a name.");
			} else Oo(a), a = r.next();
			return e;
		}
		function l() {
			let e = {};
			for (a = r.next(); a.value !== "EOF";) {
				switch (a.code) {
					case 1:
						e.xrefPath = a.value, a = r.next();
						break;
					case 2:
						e.name = a.value, a = r.next();
						break;
					case 3:
						e.name2 = a.value, a = r.next();
						break;
					case 5:
						e.handle = a.value, a = r.next();
						break;
					case 8:
						e.layer = a.value, a = r.next();
						break;
					case 10:
						e.position = v(a), a = r.next();
						break;
					case 67:
						e.paperSpace = !!(a.value && a.value == 1), a = r.next();
						break;
					case 70:
						a.value != 0 && (e.type = a.value), a = r.next();
						break;
					case 100:
						a = r.next();
						break;
					case 330:
						e.ownerHandle = a.value, a = r.next();
						break;
					case 0:
						if (a.value == "ENDBLK") break;
						e.entities = _(!0);
						break;
					default: Oo(a), a = r.next();
				}
				if (Do(a, 0, "ENDBLK")) {
					a = r.next();
					break;
				}
			}
			return e;
		}
		function u() {
			let e = {};
			for (a = r.next(); a.value !== "EOF" && !Do(a, 0, "ENDSEC");) Do(a, 0, "TABLE") ? (a = r.next(), g[a.value] ? (K.default.debug(a.value + " Table {"), e[g[a.value].tableName] = f(a), K.default.debug("}")) : K.default.debug("Unhandled Table " + a.value)) : a = r.next();
			return a = r.next(), e;
		}
		let d = "ENDTAB";
		function f(e) {
			let t = g[e.value], n = {}, i = 0;
			for (a = r.next(); !Do(a, 0, d);) switch (a.code) {
				case 5:
					n.handle = a.value, a = r.next();
					break;
				case 330:
					n.ownerHandle = a.value, a = r.next();
					break;
				case 100:
					a.value === "AcDbSymbolTable" || Oo(a), a = r.next();
					break;
				case 70:
					i = a.value, a = r.next();
					break;
				case 0:
					a.value === t.dxfSymbolName ? n[t.tableRecordsProperty] = t.parseTableRecords() : (Oo(a), a = r.next());
					break;
				default: Oo(a), a = r.next();
			}
			let o = n[t.tableRecordsProperty];
			if (o) {
				let e = (() => {
					if (o.constructor === Array) return o.length;
					if (typeof o == "object") return Object.keys(o).length;
				})();
				i !== e && K.default.warn("Parsed " + e + " " + t.dxfSymbolName + "'s but expected " + i);
			}
			return a = r.next(), n;
		}
		function p() {
			let e = [], t = {};
			for (K.default.debug("ViewPort {"), a = r.next(); !Do(a, 0, d);) switch (a.code) {
				case 2:
					t.name = a.value, a = r.next();
					break;
				case 10:
					t.lowerLeftCorner = v(a), a = r.next();
					break;
				case 11:
					t.upperRightCorner = v(a), a = r.next();
					break;
				case 12:
					t.center = v(a), a = r.next();
					break;
				case 13:
					t.snapBasePoint = v(a), a = r.next();
					break;
				case 14:
					t.snapSpacing = v(a), a = r.next();
					break;
				case 15:
					t.gridSpacing = v(a), a = r.next();
					break;
				case 16:
					t.viewDirectionFromTarget = v(a), a = r.next();
					break;
				case 17:
					t.viewTarget = v(a), a = r.next();
					break;
				case 42:
					t.lensLength = a.value, a = r.next();
					break;
				case 43:
					t.frontClippingPlane = a.value, a = r.next();
					break;
				case 44:
					t.backClippingPlane = a.value, a = r.next();
					break;
				case 45:
					t.viewHeight = a.value, a = r.next();
					break;
				case 50:
					t.snapRotationAngle = a.value, a = r.next();
					break;
				case 51:
					t.viewTwistAngle = a.value, a = r.next();
					break;
				case 79:
					t.orthographicType = a.value, a = r.next();
					break;
				case 110:
					t.ucsOrigin = v(a), a = r.next();
					break;
				case 111:
					t.ucsXAxis = v(a), a = r.next();
					break;
				case 112:
					t.ucsYAxis = v(a), a = r.next();
					break;
				case 110:
					t.ucsOrigin = v(a), a = r.next();
					break;
				case 281:
					t.renderMode = a.value, a = r.next();
					break;
				case 281:
					t.defaultLightingType = a.value, a = r.next();
					break;
				case 292:
					t.defaultLightingOn = a.value, a = r.next();
					break;
				case 330:
					t.ownerHandle = a.value, a = r.next();
					break;
				case 63:
				case 421:
				case 431:
					t.ambientColor = a.value, a = r.next();
					break;
				case 0:
					a.value === "VPORT" && (K.default.debug("}"), e.push(t), K.default.debug("ViewPort {"), t = {}, a = r.next());
					break;
				default: Oo(a), a = r.next();
			}
			return K.default.debug("}"), e.push(t), e;
		}
		function m() {
			let e = {}, t = {}, n = 0, i;
			for (K.default.debug("LType {"), a = r.next(); !Do(a, 0, "ENDTAB");) switch (a.code) {
				case 2:
					t.name = a.value, i = a.value, a = r.next();
					break;
				case 3:
					t.description = a.value, a = r.next();
					break;
				case 73:
					n = a.value, n > 0 && (t.pattern = []), a = r.next();
					break;
				case 40:
					t.patternLength = a.value, a = r.next();
					break;
				case 49:
					t.pattern.push(a.value), a = r.next();
					break;
				case 0:
					K.default.debug("}"), n > 0 && n !== t.pattern.length && K.default.warn("lengths do not match on LTYPE pattern"), e[i] = t, t = {}, K.default.debug("LType {"), a = r.next();
					break;
				default: a = r.next();
			}
			return K.default.debug("}"), e[i] = t, e;
		}
		function h() {
			let e = {}, t = {}, n;
			for (K.default.debug("Layer {"), a = r.next(); !Do(a, 0, "ENDTAB");) switch (a.code) {
				case 2:
					t.name = a.value, n = a.value, a = r.next();
					break;
				case 62:
					t.visible = a.value >= 0, t.colorIndex = Math.abs(a.value), t.color = Ao(t.colorIndex), a = r.next();
					break;
				case 70:
					t.frozen = !!(a.value & 1) || !!(a.value & 2), a = r.next();
					break;
				case 0:
					a.value === "LAYER" && (K.default.debug("}"), e[n] = t, K.default.debug("Layer {"), t = {}, n = void 0, a = r.next());
					break;
				default: Oo(a), a = r.next();
			}
			return K.default.debug("}"), e[n] = t, e;
		}
		let g = {
			VPORT: {
				tableRecordsProperty: "viewPorts",
				tableName: "viewPort",
				dxfSymbolName: "VPORT",
				parseTableRecords: p
			},
			LTYPE: {
				tableRecordsProperty: "lineTypes",
				tableName: "lineType",
				dxfSymbolName: "LTYPE",
				parseTableRecords: m
			},
			LAYER: {
				tableRecordsProperty: "layers",
				tableName: "layer",
				dxfSymbolName: "LAYER",
				parseTableRecords: h
			}
		};
		function _(e) {
			let t = [], n = e ? "ENDBLK" : "ENDSEC";
			for (e || (a = r.next());;) if (a.code === 0) {
				if (a.value === n) break;
				let e = i._entityHandlers[a.value];
				if (e != null) {
					K.default.debug(a.value + " {");
					let n = e.parseEntity(r, a);
					a = r.lastReadGroup, K.default.debug("}"), y(n), t.push(n);
				} else {
					K.default.warn("Unhandled entity " + a.value), a = r.next();
					continue;
				}
			} else a = r.next();
			return n == "ENDSEC" && (a = r.next()), t;
		}
		function v(e) {
			let t = {}, n = e.code;
			if (t.x = e.value, n += 10, e = r.next(), e.code != n) throw Error("Expected code for point value to be " + n + " but got " + e.code + ".");
			return t.y = e.value, n += 10, e = r.next(), e.code == n ? (t.z = e.value, t) : (r.rewind(), t);
		}
		function y(e) {
			if (!e) throw TypeError("entity cannot be undefined or null");
			e.handle ||= n++;
		}
		return o(), t;
	}
};
function Do(e, t, n) {
	return e.code === t && e.value === n;
}
function Oo(e) {
	K.default.debug("unhandled group " + ko(e));
}
function ko(e) {
	return e.code + ":" + e.value;
}
function Ao(e) {
	return to[e];
}
// node_modules/dxf-parser/dist/index.js
var jo = Eo, Mo = .001, No = (e) => {
	let t = 0;
	for (let n of e) {
		let e = Math.abs(Math.fround(n) - n);
		e > t && (t = e);
	}
	return t;
}, Po = (e) => {
	if (e.length === 0 || No(e) <= Mo) return null;
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r = 0; r < e.length; r += 3) for (let i = 0; i < 3; i++) {
		let a = e[r + i];
		a < t[i] && (t[i] = a), a > n[i] && (n[i] = a);
	}
	return [
		0,
		1,
		2
	].map((e) => (t[e] + n[e]) / 2);
}, Fo = (e, t) => t ? e.map((e, n) => e - t[n % 3]) : e, Io = ["POLYLINE", "3DFACE"], Lo = (e) => !!e && Number.isFinite(e.x) && Number.isFinite(e.y) && Number.isFinite(e.z), Ro = (e, t) => t.flat().reverse().map((t) => e[t]).flat(), zo = (e) => {
	let t = [...new Set(e.entities.map((e) => e.type))].filter(Boolean);
	return t.length === 0 ? "This DXF file contains no entities to import." : `No importable geometry found in this DXF file. It contains ${t.sort().join(", ")}, and this importer reads ${Io.join(" and ")} entities. Re-exporting the drawing as a 3D mesh usually resolves this.`;
};
function Bo(e) {
	let t;
	try {
		t = new jo().parseSync(e);
	} catch (e) {
		let t = e instanceof Error ? e.message : String(e);
		throw Error(`Could not parse DXF file: ${t}`, { cause: e });
	}
	if (!t) throw Error("Could not parse DXF file: the parser returned no data.");
	let n = t;
	if (!Array.isArray(n.entities)) throw Error("Could not read DXF file: no ENTITIES section was found.");
	let r = [];
	n.entities.filter((e) => e.type === "POLYLINE").forEach((e) => {
		let t = [], n = [];
		e.vertices.forEach((e) => {
			if (e.faceA) {
				let [t, r, i, a] = [
					e.faceA,
					e.faceB,
					e.faceC,
					e.faceD
				].map((e) => e ? Math.abs(e) - 1 : -1);
				n.push([
					t,
					r,
					i
				]), a >= 0 && a !== i && n.push([
					t,
					i,
					a
				]);
			} else t.push([
				e.x,
				e.y,
				e.z
			]);
		}), r.push({
			layer: e.layer,
			positions: Ro(t, n)
		});
	});
	let i = /* @__PURE__ */ new Map();
	if (n.entities.filter((e) => e.type === "3DFACE").forEach((e) => {
		let t = (e.vertices ?? []).filter(Lo);
		if (t.length < 3) return;
		let n = e.layer;
		i.has(n) || i.set(n, {
			vertices: [],
			indices: []
		});
		let r = i.get(n), a = r.vertices.length;
		t.forEach((e) => r.vertices.push([
			e.x,
			e.y,
			e.z
		])), r.indices.push([
			a,
			a + 1,
			a + 2
		]), t.length >= 4 && r.indices.push([
			a,
			a + 2,
			a + 3
		]);
	}), i.forEach(({ vertices: e, indices: t }, n) => {
		r.push({
			layer: n,
			positions: Ro(e, t)
		});
	}), r.length === 0) throw Error(zo(n));
	let a = Po(r.flatMap((e) => e.positions));
	return {
		meshes: r.map(({ layer: e, positions: t }) => ({
			layer: e,
			positions: Fo(t, a)
		})),
		offset: a
	};
}
// src/import-handlers/dxf.ts
var Vo = (e, t, n) => {
	let r = new Oe();
	return r.setAttribute("position", new De(new Float32Array(e), 3, !1)), t && r.setAttribute("normals", new De(new Float32Array(t), 3, !1)), n && r.setAttribute("texCoords", new De(new Float32Array(n), 3, !1)), r;
};
function Ho(e) {
	let t = [...se.getState().materials.values()][0], { meshes: n, offset: r } = e, i = /* @__PURE__ */ new Map();
	n.forEach(({ layer: e, positions: n }, r) => {
		i.has(e) || i.set(e, new E(e));
		let a = Vo(n);
		a.computeVertexNormals(), a.setAttribute("normals", a.getAttribute("normal"));
		let o = t, s = new ve(`untitled-${r}`, {
			acousticMaterial: o,
			geometry: a
		});
		i.get(e).add(s);
	});
	let a = new ye("new room", { surfaces: [...i.values()] });
	return r && (a.position.set(r[0], r[1], r[2]), a.updateMatrixWorld(!0), console.info(`DXF coordinates exceed float32 precision; geometry recentred by [${r.map((e) => e.toFixed(3)).join(", ")}] and the offset moved onto the room transform.`)), a;
}
function Uo(e) {
	return Ho(Bo(e));
}
function Wo(e) {
	if (typeof Worker > "u") return Promise.resolve(Uo(e));
	let t;
	try {
		t = new Worker(new URL(
			/* @vite-ignore */
			"/assets/dxf.worker-pVRydtuR.js",
			"" + import.meta.url
		), { type: "module" });
	} catch {
		return Promise.resolve(Uo(e));
	}
	return new Promise((n, r) => {
		t.addEventListener("message", (e) => {
			t.terminate();
			let i = e.data;
			i.ok ? n(Ho({
				meshes: i.meshes,
				offset: i.offset
			})) : r(Error(i.message));
		}), t.addEventListener("error", (i) => {
			t.terminate();
			try {
				n(Uo(e));
			} catch (e) {
				r(e instanceof Error ? e : Error(String(i.message)));
			}
		}), t.postMessage({ data: e });
	});
}
// src/import-handlers/index.ts
function Go(e) {
	return new ai().parse(e, "/");
}
function Ko(e) {
	return new ii().parse(e);
}
function qo(e) {
	let t = new Ya(e).parse(), [n, r, i] = t.models.reduce((e, t) => [
		e[0].concat(t.vertices),
		e[1].concat(t.vertexNormals),
		e[2].concat(t.textureCoords)
	], [
		[],
		[],
		[]
	]), a = [];
	return t.models.forEach((e) => {
		let t = /* @__PURE__ */ new Map();
		e.faces.forEach((n) => {
			let r = n.group || n.material || e.name || "default";
			t.has(r) || t.set(r, []), t.get(r).push(n);
		});
		for (let [o, s] of t) {
			let c = [], l = [], u = [];
			if (s.forEach((e) => {
				e.vertices.forEach((e) => {
					let t = n[e.vertexIndex - 1];
					t && c.push(t.x, t.y, t.z);
					let a = r[e.vertexNormalIndex - 1];
					a && l.push(a.x, a.y, a.z);
					let o = i[e.textureCoordsIndex - 1];
					o && u.push(o.u, o.v, o.w);
				});
			}), c.length === 0) continue;
			let d = new A.BufferGeometry();
			d.setAttribute("position", new A.BufferAttribute(new Float32Array(c), 3, !1)), l.length > 0 ? d.setAttribute("normals", new A.BufferAttribute(new Float32Array(l), 3, !1)) : (d.computeVertexNormals(), d.setAttribute("normals", d.getAttribute("normal"))), u.length > 0 && d.setAttribute("texCoords", new A.BufferAttribute(new Float32Array(u), 3, !1));
			let f = t.size > 1 ? o : e.name || o;
			a.push({
				name: f,
				geometry: d
			});
		}
	}), a;
}
function Jo(e) {
	let t = new Za();
	var n = new DOMParser().parseFromString(e, "application/xml");
	return Object.assign(window, { xml: n }), t.parse(e, void 0);
}
function Yo(e) {
	return new Promise((t, n) => {
		new Xi().parse(e, "", (e) => {
			let n = [];
			e.scene.traverse((e) => {
				if (e.isMesh) {
					let t = e, r = t.geometry.clone();
					r.applyMatrix4(t.matrixWorld), n.push({
						name: t.name || `mesh-${n.length}`,
						geometry: r
					});
				}
			}), t(n);
		}, (e) => {
			n(e);
		});
	});
}
// src/common/file-type.ts
var q = {
	FILE_FILLED: "icon-file",
	TEXT_FILLED: "icon-file-text",
	FILES: "icon-files-o",
	ARCHIVE: "icon-file-archive-o",
	AUDIO: "icon-file-audio-o",
	CODE: "icon-file-code-o",
	EXCEL: "icon-file-excel-o",
	IMAGE: "icon-file-image-o",
	FILE: "icon-file-o",
	PDF: "icon-file-pdf-o",
	POWERPOINT: "icon-file-powerpoint-o",
	TEXT: "icon-file-text-o",
	VIDEO: "icon-file-video-o",
	WORD: "file-word-o"
}, Xo = {
	wav: !0,
	stl: !0,
	obj: !0,
	dae: !0,
	dxf: !0,
	glb: !0,
	gltf: !0
}, Zo = {
	html: q.CODE,
	js: q.CODE,
	png: q.IMAGE,
	css: q.CODE,
	txt: q.CODE,
	md: q.CODE,
	lock: q.CODE,
	ts: q.CODE,
	json: q.CODE,
	yml: q.CODE,
	abec: q.TEXT,
	rtf: q.TEXT,
	TXT: q.TEXT,
	dxf: q.FILE,
	pdf: q.PDF,
	vips: q.FILE,
	vacs: q.FILE,
	asc: q.FILE,
	msh: q.TEXT,
	stp: q.FILE,
	jpg: q.IMAGE,
	tmd: q.FILE,
	xls: q.EXCEL,
	skp: q.FILE,
	dae: q.FILE,
	svg: q.CODE,
	res: q.FILE,
	dpr: q.FILE,
	pas: q.FILE,
	dll: q.CODE,
	vsix: q.FILE,
	st: q.FILE,
	ico: q.FILE,
	step: q.FILE,
	py: q.CODE,
	sh: q.CODE,
	FOR: q.CODE,
	o: q.CODE,
	h: q.CODE,
	c: q.CODE,
	scss: q.CODE,
	map: q.CODE,
	cpp: q.CODE,
	mm: q.CODE,
	java: q.CODE,
	m: q.CODE,
	app: q.FILE,
	wav: q.AUDIO,
	sofa: q.FILE,
	bin: q.FILE,
	nib: q.FILE,
	rc: q.FILE,
	sln: q.FILE,
	LGPL: q.FILE,
	hh: q.CODE,
	main: q.CODE,
	cxx: q.CODE,
	dtd: q.CODE,
	cc: q.CODE,
	cu: q.CODE,
	dat: q.CODE,
	f: q.CODE,
	in: q.FILE,
	BSD: q.FILE,
	dox: q.FILE,
	MPL2: q.FILE,
	GPL: q.FILE,
	bz2: q.FILE,
	log: q.FILE,
	4: q.FILE,
	out: q.FILE,
	pc: q.FILE,
	dir: q.FILE,
	make: q.FILE,
	a: q.FILE,
	11: q.FILE,
	lib: q.FILE,
	pdb: q.FILE,
	el: q.FILE,
	toml: q.FILE,
	opts: q.FILE,
	mjs: q.FILE,
	yaml: q.FILE,
	foo: q.FILE,
	0: q.FILE,
	1: q.FILE,
	flow: q.FILE,
	idea: q.FILE,
	xml: q.FILE,
	iml: q.FILE,
	bnf: q.FILE,
	DOCS: q.FILE,
	hbs: q.FILE,
	pick: q.FILE,
	pyc: q.FILE,
	jsx: q.CODE,
	less: q.CODE,
	com: q.FILE,
	php: q.CODE,
	zip: q.FILE,
	csv: q.FILE,
	mp3: q.FILE,
	ttf: q.FILE,
	exe: q.FILE,
	chm: q.FILE,
	ppm: q.FILE,
	toy: q.FILE,
	hpp: q.FILE,
	ac: q.FILE,
	am: q.FILE,
	sub: q.FILE,
	deps: q.FILE,
	Po: q.FILE,
	m4: q.FILE,
	Plo: q.FILE,
	lol: q.FILE,
	err: q.FILE,
	3: q.FILE,
	glsl: q.FILE,
	dSYM: q.FILE,
	hmap: q.FILE,
	d: q.FILE,
	dia: q.FILE,
	doc: q.FILE,
	docx: q.FILE,
	bat: q.FILE,
	iss: q.FILE,
	ui: q.FILE,
	odt: q.FILE,
	bmp: q.FILE,
	PNG: q.FILE,
	stl: q.FILE,
	md3: q.FILE,
	tga: q.FILE,
	ply: q.FILE,
	obj: q.FILE,
	mtl: q.FILE,
	md2: q.FILE,
	"3d": q.FILE,
	uc: q.FILE,
	pmx: q.FILE,
	jpeg: q.IMAGE,
	"7z": q.FILE,
	mdl: q.FILE,
	MDL: q.FILE,
	ase: q.FILE,
	nff: q.FILE,
	mat: q.FILE,
	NFF: q.FILE,
	fbx: q.FILE,
	b3d: q.FILE,
	pk3: q.FILE,
	lws: q.FILE,
	JPG: q.FILE,
	lwo: q.FILE,
	m3: q.FILE,
	"3DS": q.FILE,
	"3ds": q.FILE,
	x3d: q.FILE,
	hmp: q.FILE,
	x: q.FILE,
	mdc: q.FILE,
	amf: q.FILE,
	glb: q.FILE,
	gltf: q.FILE,
	frag: q.FILE,
	vert: q.FILE,
	ogex: q.FILE,
	ASE: q.FILE,
	FBX: q.FILE,
	DAE: q.FILE,
	smd: q.FILE,
	off: q.FILE,
	raw: q.FILE,
	zgl: q.FILE,
	xgl: q.FILE,
	bvh: q.FILE,
	STL: q.FILE,
	max: q.FILE,
	q3o: q.FILE,
	q3s: q.FILE,
	ter: q.FILE,
	lxo: q.FILE,
	ms3d: q.FILE,
	"3mf": q.FILE,
	csm: q.FILE,
	sib: q.FILE,
	irr: q.FILE,
	X: q.FILE,
	WRL: q.FILE,
	wrl: q.FILE,
	ifc: q.FILE,
	cob: q.FILE,
	inl: q.FILE,
	asm: q.FILE,
	adb: q.FILE,
	ads: q.FILE,
	gpr: q.FILE,
	mak: q.FILE,
	cs: q.FILE,
	def: q.FILE,
	S: q.FILE,
	pk: q.FILE,
	msc: q.FILE,
	686: q.FILE,
	bor: q.FILE,
	gcc: q.FILE,
	keep: q.FILE,
	pump: q.FILE,
	hlsl: q.FILE,
	xib: q.FILE,
	pch: q.FILE,
	exp: q.FILE,
	tpl: q.FILE,
	mk: q.FILE,
	i: q.FILE,
	rst: q.FILE,
	sty: q.FILE,
	f03: q.FILE,
	pl: q.FILE,
	dft: q.FILE,
	rdft: q.FILE,
	texi: q.FILE,
	eps: q.FILE,
	bfnn: q.FILE,
	refs: q.FILE,
	info: q.FILE,
	fig: q.FILE,
	tex: q.FILE,
	ml: q.FILE,
	mli: q.FILE,
	pde: q.FILE,
	hs: q.FILE,
	ipch: q.FILE,
	r: q.FILE,
	vst3: q.FILE,
	vst: q.FILE,
	room: q.FILE,
	icns: q.FILE,
	std: q.FILE,
	gyp: q.FILE,
	node: q.FILE,
	gypi: q.FILE,
	conf: q.FILE,
	targ: q.FILE,
	lcov: q.FILE,
	snyk: q.FILE,
	"md~": q.FILE,
	crt: q.FILE,
	key: q.FILE,
	bak: q.FILE,
	tar: q.FILE,
	jade: q.FILE,
	cmd: q.FILE,
	name: q.FILE,
	MIT: q.FILE,
	tgz: q.FILE,
	jst: q.FILE,
	gz: q.FILE,
	test: q.FILE,
	tmpl: q.FILE,
	file: q.FILE,
	tlog: q.FILE,
	vs: q.FILE,
	suo: q.FILE,
	mov: q.VIDEO,
	db: q.FILE,
	user: q.FILE,
	htm: q.FILE,
	mode: q.FILE,
	pug: q.FILE,
	psd: q.FILE,
	asar: q.FILE,
	pak: q.FILE,
	snap: q.FILE,
	eot: q.FILE,
	woff: q.FILE,
	geo: q.FILE,
	finc: q.FILE,
	f90: q.FILE,
	F90: q.FILE,
	md5: q.FILE,
	swf: q.FILE,
	tail: q.FILE,
	stat: q.FILE,
	ejs: q.FILE,
	priv: q.FILE,
	pem: q.FILE,
	pub: q.FILE,
	bar: q.FILE,
	wmf: q.FILE,
	cfg: q.FILE,
	tsx: q.FILE,
	cert: q.FILE,
	"un~": q.FILE,
	9: q.FILE,
	8: q.FILE,
	ls: q.FILE,
	uniq: q.FILE,
	gv: q.FILE,
	ps: q.FILE,
	env: q.FILE,
	keys: q.FILE,
	so: q.FILE,
	pac: q.FILE,
	erb: q.FILE,
	idl: q.FILE,
	omit: q.FILE,
	mkd: q.FILE,
	data: q.FILE,
	wasm: q.FILE,
	gif: q.FILE,
	lint: q.FILE,
	io: q.FILE,
	tags: q.FILE,
	jsm: q.FILE,
	rdoc: q.FILE,
	sage: q.FILE,
	tsv: q.FILE,
	rt: q.FILE,
	dmg: q.FILE,
	otf: q.FILE,
	scpt: q.FILE,
	jxa: q.FILE,
	mkb: q.FILE,
	icf: q.FILE,
	kbd: q.FILE,
	ini: q.FILE,
	docs: q.FILE,
	spec: q.FILE,
	rb: q.FILE,
	po: q.FILE,
	pot: q.FILE,
	LIB: q.FILE,
	l: q.FILE,
	y: q.FILE,
	"c++": q.FILE,
	"h++": q.FILE,
	"2/m4": q.FILE,
	asv: q.FILE,
	p: q.FILE,
	mid: q.FILE,
	12: q.FILE,
	10: q.FILE,
	"js~": q.FILE,
	remy: q.FILE,
	get: q.FILE,
	cnf: q.FILE,
	cub: q.FILE,
	wxs: q.FILE,
	swp: q.FILE,
	blob: q.FILE,
	pyd: q.FILE,
	pyx: q.FILE,
	vtu: q.FILE,
	mph: q.FILE,
	egg: q.FILE,
	mo: q.FILE,
	ogg: q.AUDIO,
	aac: q.AUDIO,
	asd: q.FILE,
	7: q.FILE,
	vrt: q.FILE,
	mp4: q.VIDEO,
	gpu: q.FILE,
	htc: q.FILE,
	item: q.FILE,
	base: q.FILE,
	npy: q.FILE,
	py3: q.CODE,
	pb: q.FILE,
	h5: q.FILE,
	tif: q.FILE,
	go: q.CODE,
	bats: q.CODE,
	fish: q.FILE,
	aiff: q.FILE,
	rej: q.FILE,
	orig: q.FILE,
	gnu: q.FILE,
	sql: q.CODE,
	wat: q.CODE,
	rs: q.CODE
};
function Qo(e) {
	return e.split(".").slice(-1)[0];
}
var $o = {
	ICONS: q,
	assoc: Zo,
	allowed: Xo,
	fileType: Qo
};
// src/lib/registerHandlers.ts
function es(e, t = h) {
	let n = t;
	n.addMessageHandler("GET_SELECTED_OBJECTS", () => e.state.selectedObjects), n.addMessageHandler("GET_SELECTED_OBJECT_TYPES", () => e.state.selectedObjects.map((e) => e.kind)), n.addMessageHandler("FETCH_ROOMS", () => {
		let t = Object.keys(e.state.containers).filter((t) => e.state.containers[t].kind === "room");
		if (t && t.length > 0) return t.map((t) => e.state.containers[t]);
	}), n.addMessageHandler("FETCH_CONTAINER", (t, ...n) => n && n[0] && e.state.containers[n[0]]), n.addMessageHandler("FETCH_ALL_MATERIALS", () => e.state.materials), n.addMessageHandler("SEARCH_ALL_MATERIALS", (t, ...n) => e.state.materialSearcher.search(n[0])), n.addMessageHandler("SHOULD_ADD_RAYTRACER", async (t, ...n) => {
		let r = await ri("ray-tracer", e, (n && n[0] || {})[0]);
		return e.state.solvers[r.uuid] = r, a("ADD_RAYTRACER", r), r;
	}), n.addMessageHandler("SHOULD_ADD_IMAGE_SOURCE", async (t, ...n) => {
		let r = await ri("image-source", e);
		return e.state.solvers[r.uuid] = r, a("ADD_IMAGESOURCE", r), r;
	}), n.addMessageHandler("SHOULD_REMOVE_SOLVER", (t, n) => {
		e.state.solvers && e.state.solvers[n] && (e.state.solvers[n].dispose(), delete e.state.solvers[n], a("REMOVE_RAYTRACER", n));
	}), n.addMessageHandler("SHOULD_ADD_RT60", async (t, ...n) => {
		let r = await ri("rt60", e);
		return e.state.solvers[r.uuid] = r, a("ADD_RT60", r), r;
	}), n.addMessageHandler("SHOULD_ADD_ENERGYDECAY", async (t, ...n) => {
		let r = await ri("energydecay", e);
		return e.state.solvers[r.uuid] = r, a("ADD_ENERGYDECAY", r), r;
	}), n.addMessageHandler("SHOULD_ADD_BEAMTRACE", async (t, ...n) => {
		let r = await ri("beam-trace", e);
		return e.state.solvers[r.uuid] = r, a("ADD_BEAMTRACE", r), r;
	}), n.addMessageHandler("SHOULD_ADD_FDTD_2D", async (t, ...n) => {
		let r = await ri("fdtd-2d", e);
		return e.state.solvers[r.uuid] = r, a("ADD_FDTD_2D", r), r;
	}), n.addMessageHandler("SHOULD_ADD_ART", async (t, ...n) => {
		let r = await ri("art", e);
		return e.state.solvers[r.uuid] = r, a("ADD_ART", r), r;
	}), n.addMessageHandler("SHOULD_ADD_ARD", async (t, ...n) => {
		let r = await ri("ard", e);
		return e.state.solvers[r.uuid] = r, a("ADD_ARD", r), r;
	}), n.addMessageHandler("RAYTRACER_CALCULATE_RESPONSE", (t, n, r) => {
		let i = e.state.solvers[n];
		i?.kind === "ray-tracer" && "calculateReflectionLoss" in i && i.calculateReflectionLoss(r);
	}), n.addMessageHandler("RAYTRACER_QUICK_ESTIMATE", (t, n) => {
		let r = e.state.solvers[n];
		r?.kind === "ray-tracer" && "startQuickEstimate" in r && r.startQuickEstimate();
	}), n.addMessageHandler("FETCH_ALL_SOURCES", (t, ...n) => e.state.sources.map((t) => n && n[0] && n[0] instanceof Array ? n[0].map((n) => e.state.containers[t][n]) : e.state.containers[t])), n.addMessageHandler("FETCH_ALL_SOURCES_AS_MAP", () => {
		let t = /* @__PURE__ */ new Map();
		for (let n = 0; n < e.state.sources.length; n++) t.set(e.state.sources[n], e.state.containers[e.state.sources[n]]);
		return t;
	}), n.addMessageHandler("FETCH_ALL_RECEIVERS", (t, ...n) => e.state.receivers.map((t) => n && n[0] && n[0] instanceof Array ? n[0].map((n) => e.state.containers[t][n]) : e.state.containers[t])), n.addMessageHandler("FETCH_SOURCE", (t, ...n) => e.state.containers[n[0]]), n.addMessageHandler("SHOULD_ADD_SOURCE", (t, ...r) => {
		let i = new Hr("new source"), o = !0;
		r && r[0] && (r[1] || (i.uuid = r[0].uuid), i.position.set(r[0].position.x, r[0].position.y, r[0].position.z), i.scale.set(r[0].scale.x, r[0].scale.y, r[0].scale.z), i.name = r[1] ? r[0].name + "-copy" : r[0].name, i.visible = r[0].visible, o = r[1] || !1);
		let s = {
			uuid: i.uuid,
			position: i.position.clone(),
			scale: i.scale.clone(),
			name: i.name,
			color: i.color,
			visible: i.visible
		};
		return e.state.containers[i.uuid] = i, e.state.sources.push(i.uuid), e.state.renderer.add(i), a("ADD_SOURCE", i), Object.keys(e.state.solvers).forEach((t) => {
			let n = e.state.solvers[t];
			n?.kind === "ray-tracer" && "addSource" in n && n.addSource(i);
		}), o && _({
			category: "SHOULD_ADD_SOURCE",
			objectId: i.uuid,
			recallFunction: (e) => {
				e === "UNDO" ? n.postMessage("SHOULD_REMOVE_CONTAINER", s.uuid) : e === "REDO" && n.postMessage("SHOULD_ADD_SOURCE", s, !1);
			}
		}), i;
	}), n.addMessageHandler("SHOULD_REMOVE_CONTAINER", (t, n) => {
		if (e.state.containers[n]) {
			switch (e.state.containers[n].kind) {
				case "source":
					e.state.sources = e.state.sources.reduce((e, t) => (t !== n && e.push(t), e), []);
					break;
				case "receiver": e.state.receivers = e.state.receivers.reduce((e, t) => (t !== n && e.push(t), e), []);
			}
			e.state.selectedObjects = e.state.selectedObjects.filter((e) => e.uuid !== n), e.state.renderer.remove(e.state.containers[n]), delete e.state.containers[n];
		}
	}), n.addMessageHandler("SHOULD_ADD_RECEIVER", (t, ...r) => {
		let i = new Jr("new receiver"), o = !0;
		r && r[0] && (r[1] || (i.uuid = r[0].uuid), i.position.set(r[0].position.x, r[0].position.y, r[0].position.z), i.scale.set(r[0].scale.x, r[0].scale.y, r[0].scale.z), i.name = r[1] ? r[0].name + "-copy" : r[0].name, i.visible = r[0].visible, o = r[1] || !1);
		let s = {
			uuid: i.uuid,
			position: i.position.clone(),
			scale: i.scale.clone(),
			name: i.name,
			color: i.color,
			visible: i.visible
		};
		return e.state.containers[i.uuid] = i, e.state.receivers.push(i.uuid), e.state.renderer.add(i), a("ADD_RECEIVER", i), Object.keys(e.state.solvers).forEach((t) => {
			let n = e.state.solvers[t];
			n?.kind === "ray-tracer" && "addReceiver" in n && n.addReceiver(i);
		}), o && _({
			category: "SHOULD_ADD_RECEIVER",
			objectId: i.uuid,
			recallFunction: (e) => {
				e === "UNDO" ? n.postMessage("SHOULD_REMOVE_CONTAINER", s.uuid) : e === "REDO" && n.postMessage("SHOULD_ADD_RECEIVER", s, !1);
			}
		}), i;
	}), n.addMessageHandler("SHOULD_DUPLICATE_SELECTED_OBJECTS", () => {
		let e = [], t = n.postMessage("GET_SELECTED_OBJECTS")[0];
		if (t && t.length > 0) for (let r = 0; r < t.length; r++) switch (t[r].kind) {
			case "source":
				e.push(n.postMessage("SHOULD_ADD_SOURCE", t[r], !0)[0]);
				break;
			case "receiver": e.push(n.postMessage("SHOULD_ADD_RECEIVER", t[r], !0)[0]);
		}
		n.postMessage("SET_SELECTION", e);
	}), n.addMessageHandler("GET_CONTAINERS", () => e.state.containers), n.addMessageHandler("ADDED_ROOM", (e, ...t) => {
		t[0];
	}), n.addMessageHandler("ADDED_MODEL", (e, ...t) => {
		t[0];
	}), n.addMessageHandler("ADDED_AUDIO_FILE", (t, n) => {
		let r = n[0];
		e.state.audiofiles[r.uuid] = r;
	}), n.addMessageHandler("IMPORT_FILE", (t, ...r) => {
		Array.from(r[0]).forEach(async (t) => {
			if (Xo[Qo(t.name)]) {
				let r = URL.createObjectURL(t);
				switch (Qo(t.name)) {
					case "dxf":
						{
							let e = await (await fetch(r)).text();
							try {
								let t = await Wo(e);
								a("ADD_ROOM", t), console.log(t);
							} catch (e) {
								let t = e instanceof Error ? e.message : String(e);
								console.error(t), n.postMessage("SHOW_TOAST", {
									message: t,
									intent: "warning",
									timeout: 4e3
								});
							}
						}
						break;
					case "obj":
						{
							let i = await (await fetch(r)).text(), o = qo(i);
							console.log(o);
							let s = o.map((t) => new ve(t.name, {
								geometry: t.geometry,
								acousticMaterial: e.state.materials[0]
							})), c = new ye("new room", {
								surfaces: s,
								originalFileName: t.name,
								originalFileData: i
							});
							e.state.containers[c.uuid] = c, e.state.renderer.addRoom(c), a("ADD_ROOM", c), n.postMessage("ADDED_ROOM", c);
						}
						break;
					case "stl":
						{
							let t = new Qr("new model", { bufferGeometry: Ko(await (await fetch(r)).arrayBuffer()) });
							e.state.containers[t.uuid] = t, e.state.renderer.addModel(t), n.postMessage("ADDED_MODEL", t);
						}
						break;
					case "dae":
						{
							let e = Jo(await (await fetch(r)).text());
							console.log(e);
						}
						break;
					case "3ds":
						{
							console.log("load 3ds");
							let e = Go(await (await fetch(r)).arrayBuffer());
							console.log(e);
						}
						break;
					case "glb":
					case "gltf":
						{
							let t = await Yo(await (await fetch(r)).arrayBuffer());
							for (let r of t) {
								let t = new Qr(r.name || "imported model", { bufferGeometry: r.geometry });
								e.state.containers[t.uuid] = t, e.state.renderer.addModel(t), n.postMessage("ADDED_MODEL", t);
							}
						}
						break;
					case "wav": try {
						let e = await (await fetch(r)).arrayBuffer();
						new AudioContext().decodeAudioData(e, (e) => {
							let r = [];
							for (let t = 0; t < e.numberOfChannels; t++) r.push(e.getChannelData(t));
							let i = new $r({
								name: t.name,
								filename: t.name,
								sampleRate: e.sampleRate,
								length: e.length,
								duration: e.duration,
								numberOfChannels: e.numberOfChannels,
								channelData: r
							});
							n.postMessage("ADDED_AUDIO_FILE", i);
						}), console.log(e);
					} catch (e) {
						console.error(e);
					}
				}
			}
		});
	}), n.addMessageHandler("APP_MOUNTED", (t, ...n) => {
		e.state.renderer.init(n[0]);
	}), n.addMessageHandler("RENDERER_UPDATED", () => {
		e.state.time += .01666666667, e.state.selectedObjects.length > 0 && e.state.selectedObjects.forEach((t) => {
			t.renderCallback(e.state.time);
		});
	}), n.addMessageHandler("RAYTRACER_SHOULD_PLAY", (t, ...n) => {
		let r = e.state.solvers[n[0]];
		return r?.kind === "ray-tracer" && "isRunning" in r && (r.isRunning = !0), r?.running;
	}), n.addMessageHandler("RAYTRACER_SHOULD_PAUSE", (t, ...n) => {
		let r = e.state.solvers[n[0]];
		return r?.kind === "ray-tracer" && "isRunning" in r && (r.isRunning = !1), r?.running;
	}), n.addMessageHandler("RAYTRACER_SHOULD_CLEAR", (t, ...n) => {
		let r = e.state.solvers[n[0]];
		r?.kind === "ray-tracer" && "clearRays" in r && r.clearRays();
	}), n.addMessageHandler("FETCH_SURFACES", (e, ...t) => {
		let r = t[0];
		if (typeof r == "string" && (r = [r]), r) return r.map((e) => {
			let t = n.postMessage("FETCH_ROOMS")[0];
			if (t && t.length > 0) for (let n = 0; n < t.length; n++) {
				let r = t[n].surfaces.getObjectByProperty("uuid", e);
				if (r && r instanceof ve) return r;
			}
			return null;
		}).filter((e) => e);
	}), n.addMessageHandler("ASSIGN_MATERIAL", (t, i) => {
		let a = 0, o = [];
		for (let t = 0; t < e.state.selectedObjects.length; t++) e.state.selectedObjects[t] instanceof ve && (o.push({
			uuid: e.state.selectedObjects[t].uuid,
			acousticMaterial: e.state.selectedObjects[t]._acousticMaterial
		}), e.state.selectedObjects[t]._acousticMaterial = i, a++);
		_({
			category: "ASSIGN_MATERIAL",
			objectId: r(),
			recallFunction: () => {
				let e = n.postMessage("FETCH_SURFACES", o.map((e) => e.uuid))[0];
				for (let t = 0; t < o.length; t++) e[t].uuid === o[t].uuid && (e[t]._acousticMaterial = o[t].acousticMaterial);
			}
		}), a > 0 ? n.postMessage("SHOW_TOAST", {
			message: `Assigned material to ${a} surface${a > 1 ? "s" : ""}.`,
			intent: "success",
			timeout: 1750
		}) : n.postMessage("SHOW_TOAST", {
			message: "No surfaces are selected.",
			intent: "warning",
			timeout: 1750
		});
	}), n.addMessageHandler("SETTING_CHANGE", (t, ...n) => {
		let { setting: r, value: i } = n[0];
		console.log(r, i), e.state.renderer.settingChanged(r, i);
	}), n.addMessageHandler("NEW", () => {
		Object.keys(e.state.solvers).forEach((e) => {
			n.postMessage("SHOULD_REMOVE_SOLVER", e);
		}), Object.keys(e.state.containers).forEach((e) => {
			n.postMessage("SHOULD_REMOVE_CONTAINER", e);
		}), n.postMessage("DESELECT_ALL_OBJECTS");
	}), n.addMessageHandler("CAN_UNDO", () => C.canUndo), n.addMessageHandler("CAN_REDO", () => C.canRedo), n.addMessageHandler("UNDO", () => (C.undo(), [C.canUndo, C.canRedo])), n.addMessageHandler("REDO", () => (C.redo(), [C.canUndo, C.canRedo])), n.addMessageHandler("GET_RENDERER", () => e.state.renderer), n.addMessageHandler("SET_EDITOR_MODE", (t, ...n) => {
		if (D[n[0]]) {
			e.state.editorMode = D[n[0]];
			for (let t in e.state.containers) e.state.containers[t].onModeChange(e.state.editorMode);
			for (let t in e.state.solvers) e.state.solvers[t].onModeChange(e.state.editorMode);
		}
		e.state.renderer.needsToRender = !0;
	}), n.addMessageHandler("GET_EDITOR_MODE", () => e.state.editorMode), n.addMessageHandler("SET_PROCESS", (t, ...n) => {
		b[n[0]] && (e.state.currentProcess = b[n[0]], e.state.renderer.currentProcess = e.state.currentProcess, e.state.renderer.needsToRender = !0);
	}), n.addMessageHandler("GET_PROCESS", () => e.state.currentProcess), n.addMessageHandler("SHOULD_ADD_SKETCH", () => {
		let t = n.postMessage("GET_SELECTED_OBJECTS")[0];
		if (t && t[t.length - 1]) {
			let n = t[t.length - 1];
			if (n instanceof ve) {
				let t = new ei({
					normal: n._triangles[0].getNormal(new A.Vector3()),
					point: n.center
				});
				e.state.sketches[t.uuid] = t, e.state.renderer.sketches.add(e.state.sketches[t.uuid]);
			}
		}
	}), n.addMessageHandler("SHOULD_REMOVE_SKETCH", (t, n) => {
		e.state.sketches[n] && (e.state.renderer.sketches.remove(e.state.sketches[n]), delete e.state.sketches[n]);
	}), n.addMessageHandler("SAVE_CONTAINERS", () => Object.keys(e.state.containers).map((t) => e.state.containers[t].save())), n.addMessageHandler("SAVE_SOLVERS", () => Object.keys(e.state.solvers).map((t) => e.state.solvers[t].save())), n.addMessageHandler("RESTORE_CONTAINERS", (t, ...r) => {
		Object.keys(e.state.containers).forEach((e) => {
			n.postMessage("SHOULD_REMOVE_CONTAINER", e);
		}), r && r[0] && r[0] instanceof Array && r[0].forEach((t) => {
			switch (t.kind) {
				case "source":
					{
						let e = new Hr("new source", { ...t }).restore(t);
						n.postMessage("SHOULD_ADD_SOURCE", e, !1);
					}
					break;
				case "receiver":
					{
						let e = new Jr("new receiver", { ...t }).restore(t);
						n.postMessage("SHOULD_ADD_RECEIVER", e, !1);
					}
					break;
				case "room": {
					let n = new ye(t.name || "room").restore(t);
					e.state.containers[n.uuid] = n, a("ADD_ROOM", n), e.state.renderer.addRoom(n);
				}
			}
		});
	}), n.addMessageHandler("RESTORE_SOLVERS", (t, ...r) => {
		Object.keys(e.state.solvers).forEach((e) => {
			n.postMessage("SHOULD_REMOVE_SOLVER", e);
		}), r && r[0] && r[0] instanceof Array && r[0].forEach((e) => {
			switch (e.kind) {
				case "ray-tracer":
					{
						let e = r && r[0];
						n.postMessage("SHOULD_ADD_RAYTRACER", e);
					}
					break;
				case "rt60": {
					let e = r && r[0];
					n.postMessage("SHOULD_ADD_RT60", e);
				}
			}
		});
	}), n.addMessageHandler("OPEN", () => {
		let e = document.createElement("input");
		e.type = "file", e.accept = "application/json", e.setAttribute("style", "display: none"), document.body.appendChild(e), e.addEventListener("change", async (t) => {
			let r = t.target.files;
			if (!r) {
				e.remove();
				return;
			}
			let i = r[0], a = URL.createObjectURL(i);
			try {
				let t = await (await fetch(a)).text(), r = JSON.parse(t);
				n.postMessage("RESTORE", {
					file: i,
					json: r
				}), e.remove();
			} catch (e) {
				console.warn(e);
			}
		}), e.click();
	}), n.addMessageHandler("RESTORE", (e, ...t) => {
		let r = t && t[0], i = r.file, a = r.json;
		((e, t) => {
			let n = (e) => e.split(".").map((e) => parseInt(e, 10) || 0), [r, i, a] = n(e), [o, s, c] = n(t);
			return r === o ? i === s ? a >= c : i > s : r > o;
		})(a.meta && a.meta.version || "0.0.0", "0.2.1") ? (n.postMessage("RESTORE_CONTAINERS", a.containers), n.postMessage("RESTORE_SOLVERS", a.solvers), n.postMessage("SET_PROJECT_NAME", a.meta.name)) : (n.postMessage("RESTORE_CONTAINERS", a), n.postMessage("SET_PROJECT_NAME", i.name.replace(".json", "")));
	}), console.log("[registerMessageHandlers] Registered all message handlers");
}
// src/objects/events.ts
function ts() {
	n("REMOVE_CONTAINERS", (e) => {
		let t = O.getState().containers, n = typeof e == "string" ? [e] : e;
		n.forEach((e) => t[e].dispose()), O.getState().set((e) => {
			e.containers = l(n, t);
		});
	});
	let e = (e, t) => new e().restore(t);
	n("RESTORE_CONTAINERS", (t) => {
		a("REMOVE_CONTAINERS", he()), t.forEach((t) => {
			switch (t.kind) {
				case "source":
					a("ADD_SOURCE", e(Hr, t));
					break;
				case "receiver":
					a("ADD_RECEIVER", e(Jr, t));
					break;
				case "room": a("ADD_ROOM", e(ye, t));
			}
		});
	}), n("DESELECT_ALL_OBJECTS", () => {
		O.getState().set((e) => {
			Object.keys(e.containers).forEach((t) => {
				e.containers[t].deselect();
			}), e.selectedObjects.clear();
		});
	}), n("SET_SELECTION", (e) => {
		O.getState().set((t) => {
			for (let e of t.selectedObjects) e.deselect();
			t.selectedObjects.clear(), e.forEach((e) => {
				let n = t.containers[e.uuid];
				n && (n.select(), t.selectedObjects.add(n));
			}), t.version++;
		}), me.setScope("EDITOR"), a("RENDER", void 0);
	}), n("APPEND_SELECTION", (e) => {
		me.setScope("EDITOR"), O.getState().set((t) => {
			e.forEach((e) => {
				e.select(), t.selectedObjects.add(e);
			});
		}), a("RENDER", void 0);
	}), n("TOGGLE_CONTAINER_VISIBLE", (e) => {
		O.getState().set((t) => {
			let n = t.containers[e];
			n && (n.visible = !n.visible, t.version++);
		}), a("RENDER", void 0);
	});
}
// src/compute/events.ts
async function ns(e, t) {
	switch (e) {
		case "ray-tracer": {
			let { default: e } = await import("./raytracer-HTlzDwVA.mjs");
			return new e(t).restore(t);
		}
		case "rt60": {
			let { default: e } = await import("./rt-BXAnNt2t.mjs");
			return new e().restore(t);
		}
		case "art": {
			let { default: e } = await import("./art-Dal1aavR.mjs");
			return new e(t).restore(t);
		}
		case "image-source": {
			let { default: e } = await import("./image-source-8WXJD5JQ.mjs");
			return new e(t).restore(t);
		}
		case "beam-trace": {
			let { BeamTraceSolver: e } = await import("./beam-trace-D_40fITR.mjs");
			return new e().restore(t);
		}
		case "ard": {
			let { default: e } = await import("./ard-CnpF2sat.mjs");
			return new e(t).restore(t);
		}
		default: throw Error(`Unknown solver kind: ${e}`);
	}
}
function rs() {
	import("./events-Blso0HK1.mjs").then((e) => e.default()), n("LOG_SOLVER", (e) => {
		console.log(f.getState().solvers[e]);
	}), n("REMOVE_SOLVERS", (e) => {
		let t = f.getState().solvers, n = typeof e == "string" ? [e] : e;
		n.forEach((e) => t[e].dispose()), f.getState().set((e) => {
			e.solvers = l(n, t);
		});
	}), n("RESTORE_SOLVERS", (t) => {
		o(e(t));
	});
	let e = async (e) => {
		a("REMOVE_SOLVERS", u());
		for (let t of e) try {
			let e = await ns(t.kind, t);
			switch (t.kind) {
				case "ray-tracer":
					a("ADD_RAYTRACER", e);
					break;
				case "rt60":
					a("ADD_RT60", e);
					break;
				case "art":
					a("ADD_ART", e);
					break;
				case "image-source":
					f.getState().set((t) => {
						t.solvers[e.uuid] = e;
					});
					break;
				case "beam-trace":
					a("ADD_BEAMTRACE", e);
					break;
				case "ard": a("ADD_ARD", e);
			}
		} catch (e) {
			console.error(`Failed to restore solver ${t.kind}:`, e);
		}
	};
}
// src/compute/auto-calculate.ts
var is = 300, as = null, os = !1, ss = !1, cs = [
	"beam-trace",
	"rt60",
	"art"
];
function ls() {
	let { solvers: e } = f.getState();
	return Object.values(e).filter((e) => cs.includes(e.kind));
}
function us() {
	if (ss || os) return;
	let e = ls();
	e.length !== 0 && (ss = !0, a("SHOW_AUTO_CALC_PROGRESS", {
		message: "Auto-calculating...",
		solverCount: e.length
	}));
}
function ds() {
	if (os) return;
	let e = ls();
	e.length === 0 ? ss && (ss = !1, a("HIDE_AUTO_CALC_PROGRESS", void 0)) : (os = !0, requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			try {
				e.forEach((e) => {
					e.calculate(), e.kind === "beam-trace" && a("BEAMTRACE_CALCULATE_COMPLETE", e.uuid);
				});
			} finally {
				os = !1, ss = !1, a("HIDE_AUTO_CALC_PROGRESS", void 0);
			}
		});
	}));
}
function fs() {
	us(), as && clearTimeout(as), as = setTimeout(() => {
		as = null, ds();
	}, is);
}
function ps() {
	return k.getState().autoCalculate;
}
function ms() {
	!os && ps() && fs();
}
function hs() {
	g("SURFACE_SET_PROPERTY", ms), g("ROOM_SET_PROPERTY", ms), g("SOURCE_SET_PROPERTY", ms), g("RECEIVER_SET_PROPERTY", ms), [
		"RAYTRACER_SET_PROPERTY",
		"RT60_SET_PROPERTY",
		"FDTD2D_SET_PROPERTY",
		"IMAGESOURCE_SET_PROPERTY",
		"ART_SET_PROPERTY",
		"BEAMTRACE_SET_PROPERTY",
		"ENERGYDECAY_SET_PROPERTY"
	].forEach((e) => {
		g(e, (e) => {
			e?.property !== "autoCalculate" && ms();
		});
	}), n("AUTO_CALCULATE_TRIGGER", () => {
		ds();
	});
}
// src/events.ts
function gs() {
	ts(), rs(), hs();
}
// src/common/browser-report.ts
function _s(e) {
	let t, n, r;
	e ||= navigator.userAgent;
	let i = {
		timestamp: "",
		browser: {
			name: "",
			version: ""
		},
		cookies: !0,
		flash: { version: "" },
		ip: "",
		java: { version: "" },
		os: {
			name: "",
			version: ""
		},
		screen: {
			colors: 0,
			dppx: 0,
			height: 0,
			width: 0
		},
		scripts: !0,
		userAgent: e,
		viewport: {
			height: 0,
			layout: {
				height: 0,
				width: 0
			},
			width: 0,
			zoom: 0
		},
		lang: [""],
		websockets: !0
	};
	switch ((e.indexOf("Trident") >= 0 || e.indexOf("MSIE") >= 0) && (e.indexOf("Mobile") >= 0 ? i.browser.name = "IE Mobile" : i.browser.name = "Internet Explorer"), e.indexOf("Firefox") >= 0 && e.indexOf("Seamonkey") === -1 && (e.indexOf("Android") >= 0 ? i.browser.name = "Firefox for Android" : i.browser.name = "Firefox"), e.indexOf("Safari") >= 0 && e.indexOf("Chrome") === -1 && e.indexOf("Chromium") === -1 && e.indexOf("Android") === -1 && (e.indexOf("CriOS") >= 0 ? i.browser.name = "Chrome for iOS" : e.indexOf("FxiOS") >= 0 ? i.browser.name = "Firefox for iOS" : i.browser.name = "Safari"), e.indexOf("Chrome") >= 0 && (e.match(/\bChrome\/[.0-9]* Mobile\b/) ? e.match(/\bVersion\/\d+\.\d+\b/) || e.match(/\bwv\b/) ? i.browser.name = "WebView on Android" : i.browser.name = "Chrome for Android" : i.browser.name = "Chrome"), e.indexOf("Android") >= 0 && e.indexOf("Chrome") === -1 && e.indexOf("Chromium") === -1 && e.indexOf("Trident") === -1 && e.indexOf("Firefox") === -1 && (i.browser.name = "Android Browser"), e.indexOf("Edge") >= 0 && (i.browser.name = "Edge"), e.indexOf("UCBrowser") >= 0 && (i.browser.name = "UC Browser for Android"), e.indexOf("SamsungBrowser") >= 0 && (i.browser.name = "Samsung Internet"), (e.indexOf("OPR") >= 0 || e.indexOf("Opera") >= 0) && (e.indexOf("Opera Mini") >= 0 ? i.browser.name = "Opera Mini" : e.indexOf("Opera Mobi") >= 0 || e.indexOf("Opera Tablet") >= 0 || e.indexOf("Mobile") >= 0 ? i.browser.name = "Opera Mobile" : i.browser.name = "Opera"), (e.indexOf("BB10") >= 0 || e.indexOf("PlayBook") >= 0 || e.indexOf("BlackBerry") >= 0) && (i.browser.name = "BlackBerry"), e.indexOf("MQQBrowser") >= 0 && (i.browser.name = "QQ Browser"), n = null, i.browser.name) {
		case "Chrome":
		case "Chrome for Android":
		case "WebView on Android":
			n = e.match(/Chrome\/((\d+\.)+\d+)/);
			break;
		case "Firefox":
		case "Firefox for Android":
			n = e.match(/Firefox\/((\d+\.)+\d+)/);
			break;
		case "Firefox for iOS":
			n = e.match(/FxiOS\/((\d+\.)+\d+)/);
			break;
		case "Edge":
		case "Internet Explorer":
		case "IE Mobile":
			e.indexOf("Edge") >= 0 ? n = e.match(/Edge\/((\d+\.)+\d+)/) : e.indexOf("rv:11") >= 0 ? n = e.match(/rv:((\d+\.)+\d+)/) : e.indexOf("MSIE") >= 0 && (n = e.match(/MSIE ((\d+\.)+\d+)/));
			break;
		case "Safari":
			n = e.match(/Version\/((\d+\.)+\d+)/);
			break;
		case "Android Browser":
			n = e.match(/Android ((\d+\.)+\d+)/);
			break;
		case "UC Browser for Android":
			n = e.match(/UCBrowser\/((\d+\.)+\d+)/);
			break;
		case "Samsung Internet":
			n = e.match(/SamsungBrowser\/((\d+\.)+\d+)/);
			break;
		case "Opera Mini":
			n = e.match(/Opera Mini\/((\d+\.)+\d+)/);
			break;
		case "Opera":
			n = e.match(/OPR/) ? e.match(/OPR\/((\d+\.)+\d+)/) : e.match(/Version/) ? e.match(/Version\/((\d+\.)+\d+)/) : e.match(/Opera\/((\d+\.)+\d+)/);
			break;
		case "BlackBerry":
			n = e.match(/Version\/((\d+\.)+\d+)/);
			break;
		case "QQ Browser":
			n = e.match(/MQQBrowser\/((\d+\.)+\d+)/);
			break;
		default: n = e.match(/\/((\d+\.)+\d+)$/);
	}
	n && n[1] && (i.browser.version = n[1]), i.viewport.width = window.innerWidth || document.documentElement.clientWidth, i.viewport.height = window.innerHeight || document.documentElement.clientHeight;
	try {
		Object.defineProperty({}, "x", {}), t = !0;
	} catch {
		t = !1;
	}
	function a(e) {
		window.console && (console.warn ? console.warn(e) : console.log(e));
	}
	switch (t && Object.defineProperty(i.browser, "size", { get: function() {
		return a("browser.size is deprecated; use viewport.width and viewport.height"), i.viewport.width + " x " + i.viewport.height;
	} }), i.viewport.layout.width = document.documentElement.clientWidth, i.viewport.layout.height = document.documentElement.clientHeight, i.viewport.zoom = i.viewport.layout.width / i.viewport.width, r = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx", r = r.replace(/[xy]/g, function(e) {
		var t = Math.random() * 16 | 0;
		return (e === "x" ? t : t & 3 | 8).toString(16);
	}), document.cookie = r, i.cookies = document.cookie.indexOf(r) >= 0, document.cookie = r + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;", (function(e) {
		var t, r, a;
		if (e) for (r = e.length, t = 0; t < r; t += 1) a = e.item(t), a && (a.name.indexOf("Flash") >= 0 && (n = a.description.match(/\b((\d+\.)+\d+)\b/), n && n[1] && (i.flash.version = n[1])), a.name.indexOf("Java") >= 0 && (n = a.description.match(/\b((\d+\.)+\d+)\b/), n && n[1] && (i.java.version = n[1])));
	})(navigator.plugins), e.indexOf("Windows") >= 0 && (e.indexOf("Windows Phone") >= 0 ? i.os.name = "Windows Phone" : i.os.name = "Windows"), e.indexOf("OS X") >= 0 && e.indexOf("Android") === -1 && (i.os.name = "OS X"), e.indexOf("Linux") >= 0 && (i.os.name = "Linux"), e.indexOf("like Mac OS X") >= 0 && (i.os.name = "iOS"), (e.indexOf("Android") >= 0 || e.indexOf("Adr") >= 0) && e.indexOf("Windows Phone") === -1 && (i.os.name = "Android"), e.indexOf("BB10") >= 0 && (i.os.name = "BlackBerry"), e.indexOf("RIM Tablet OS") >= 0 && (i.os.name = "BlackBerry Tablet OS"), e.indexOf("BlackBerry") >= 0 && (i.os.name = "BlackBerryOS"), e.indexOf("CrOS") >= 0 && (i.os.name = "Chrome OS"), e.indexOf("KAIOS") >= 0 && (i.os.name = "KaiOS"), n = null, i.os.name) {
		case "Windows":
		case "Windows Phone":
			if (e.indexOf("Win16") >= 0) i.os.version = "3.1.1";
			else if (e.indexOf("Windows CE") >= 0) i.os.version = "CE";
			else if (e.indexOf("Windows 95") >= 0) i.os.version = "95";
			else if (e.indexOf("Windows 98") >= 0) e.indexOf("Windows 98; Win 9x 4.90") >= 0 ? i.os.version = "Millennium Edition" : i.os.version = "98";
			else if (n = e.match(/Win(?:dows)?(?: Phone)?[ _]?(?:(?:NT|9x) )?((?:(\d+\.)*\d+)|XP|ME|CE)\b/), n && n[1]) switch (n[1]) {
				case "6.4":
					n[1] = "10.0";
					break;
				case "6.3":
					n[1] = "8.1";
					break;
				case "6.2":
					n[1] = "8";
					break;
				case "6.1":
					n[1] = "7";
					break;
				case "6.0":
					n[1] = "Vista";
					break;
				case "5.2":
					n[1] = "Server 2003";
					break;
				case "5.1":
					n[1] = "XP";
					break;
				case "5.01":
					n[1] = "2000 SP1";
					break;
				case "5.0":
					n[1] = "2000";
					break;
				case "4.0": n[1] = "4.0";
			}
			break;
		case "OS X":
			n = e.match(/OS X ((\d+[._])+\d+)\b/);
			break;
		case "Linux":
			i.os.version = "";
			break;
		case "iOS":
			n = e.match(/OS ((\d+[._])+\d+) like Mac OS X/);
			break;
		case "Android":
			n = e.match(/(?:Android|Adr) (\d+([._]\d+)*)/);
			break;
		case "BlackBerry":
		case "BlackBerryOS":
			n = e.match(/Version\/((\d+\.)+\d+)/);
			break;
		case "BlackBerry Tablet OS":
			n = e.match(/RIM Tablet OS ((\d+\.)+\d+)/);
			break;
		case "Chrome OS":
			i.os.version = i.browser.version;
			break;
		case "KaiOS":
			n = e.match(/KAIOS\/(\d+(\.\d+)*)/);
			break;
		default: i.os.version = "";
	}
	if (n && n[1] && (n[1] = n[1].replace(/_/g, "."), i.os.version = n[1]), i.os.name === "OS X" && i.os.version) {
		var o = i.os.version.split(".");
		if (o.length >= 2) {
			var s = parseInt(o[1], 10);
			s <= 7 ? i.os.name = "Mac OS X" : s >= 12 ? i.os.name = "macOS" : i.os.name = "OS X";
		}
	}
	return i.screen.width = screen.width, i.screen.height = screen.height, i.screen.colors = screen.colorDepth, window.devicePixelRatio && !isNaN(window.devicePixelRatio) ? i.screen.dppx = window.devicePixelRatio : i.screen.dppx = 1, t && Object.defineProperty(i.screen, "size", { get: function() {
		return a("screen.size is deprecated; use screen.width and screen.height"), i.screen.width + " x " + i.screen.height;
	} }), t && Object.defineProperty(i.screen, "resolution", { get: function() {
		return a("screen.resolution is deprecated; multiply screen.width and screen.height by screen.dppx"), i.screen.dppx * i.screen.width + " x " + i.screen.dppx * i.screen.height;
	} }), i.websockets = !!window.WebSocket, i.lang = [String(navigator.languages) || String(navigator.language)], i.timestamp = (/* @__PURE__ */ new Date()).toString(), i;
}
// src/lib/init.ts
var vs = {};
fe.forEach((e) => {
	vs[e.uuid] = e;
});
var ys = JSON.parse(w.getItem("layout") || ee);
es({
	state: {
		leftPanelInitialSize: ys.leftPanelInitialSize,
		bottomPanelInitialSize: ys.bottomPanelInitialSize,
		rightPanelInitialSize: ys.rightPanelInitialSize,
		rightPanelTopInitialSize: ys.rightPanelTopInitialSize,
		audiofiles: {},
		time: 0,
		selectedObjects: [],
		materialsIndex: vs,
		materials: fe,
		materialSearcher: new _e(fe, { keySelector: (e) => e.material }),
		sources: [],
		receivers: [],
		containers: {},
		constructions: {},
		sketches: {},
		solvers: {},
		renderer: T,
		editorMode: D.OBJECT,
		currentProcess: b.NONE,
		browser: _s(navigator.userAgent)
	},
	messenger: h,
	meta: { version: "0.2.1" }
}, h), gs(), console.log("[CRAM] Library mode initialized");
// src/common/dayt.ts
function bs(e) {
	return new Date(e).toString().split(/\s+/gim).slice(1, 5).join(" ");
}
// src/components/ImportDialog.tsx
var xs = [
	"rgba(255,0,0,.2)",
	"rgba(0,0,0,0)",
	"rgba(0,255,0,.2)"
], Ss = (e) => {
	let t = document.querySelector("#temp-file-import") || document.createElement("input");
	t.type = "file", t.setAttribute("style", "display: none;"), t.setAttribute("id", "temp-file-import"), document.body.appendChild(t), t.addEventListener("change", (n) => {
		let r = n.target;
		r && r.files && e(Array.from(r.files)), t.remove();
	}), t.click();
};
function Cs() {
	let [e, t] = I(1), [n, r] = I([]), { importDialogVisible: i, set: a } = k(j((e) => c(["importDialogVisible", "set"], e))), o = () => {
		a((e) => {
			e.importDialogVisible = !1;
		});
	};
	return /* @__PURE__ */ B(Wt, {
		open: i,
		onClose: o,
		transitionDuration: 0,
		maxWidth: "sm",
		fullWidth: !0,
		sx: { "& .MuiDialog-paper": { minWidth: "350px" } },
		children: [
			/* @__PURE__ */ z(qt, { children: "Import" }),
			/* @__PURE__ */ B(Kt, {
				onDragLeave: () => t(1),
				onDragOver: (e) => {
					let { types: n, items: r } = e.dataTransfer, i = !0;
					for (let e = 0; e < n.length; e++) i &&= r[e].kind === "file";
					t(i ? 2 : 0), e.stopPropagation(), e.preventDefault();
				},
				onDrop: (e) => {
					let { files: n } = e.dataTransfer, i = Array.from(n);
					r(i), t(1), e.preventDefault(), e.stopPropagation();
				},
				children: [/* @__PURE__ */ z("div", {
					style: { backgroundColor: xs[e] },
					className: "drop-zone",
					onClick: () => Ss((e) => {
						r(e), t(1);
					}),
					children: /* @__PURE__ */ z("div", {
						style: {
							color: "gray",
							fontSize: "12pt",
							width: "100%",
							textAlign: "center"
						},
						children: "Drag files or click to browse"
					})
				}), n.length > 0 && /* @__PURE__ */ z(rn, {
					component: Qt,
					sx: { mt: 2 },
					children: /* @__PURE__ */ B(en, {
						size: "small",
						children: [/* @__PURE__ */ z(an, { children: /* @__PURE__ */ B(on, { children: [
							/* @__PURE__ */ z(nn, { children: ".ico" }),
							/* @__PURE__ */ z(nn, { children: "name" }),
							/* @__PURE__ */ z(nn, { children: "last-modified" }),
							/* @__PURE__ */ z(nn, { children: "valid" })
						] }) }), /* @__PURE__ */ z(tn, { children: n.map((e, t) => {
							let n = e.name.split(".").slice(-1)[0];
							return /* @__PURE__ */ B(on, {
								hover: !0,
								children: [
									/* @__PURE__ */ z(nn, { children: /* @__PURE__ */ z("div", { className: "icon " + ($o.assoc[n] || $o.ICONS.FILE) }) }),
									/* @__PURE__ */ z(nn, { children: e.name }),
									/* @__PURE__ */ z(nn, { children: bs(e.lastModified) }),
									/* @__PURE__ */ z(nn, { children: $o.allowed[n] ? "✓" : "x" })
								]
							}, e.name + t);
						}) })]
					})
				})]
			}),
			/* @__PURE__ */ B(Gt, { children: [/* @__PURE__ */ z(L, {
				onClick: o,
				children: "Cancel"
			}), /* @__PURE__ */ z(L, {
				variant: "contained",
				color: "primary",
				disabled: n.length === 0,
				onClick: () => {
					h.postMessage("IMPORT_FILE", n), r([]), o();
				},
				children: "Import"
			})] })
		]
	});
}
n("SHOW_IMPORT_DIALOG", (e) => {
	k.getState().set((t) => {
		t.importDialogVisible = e;
	});
});
// src/components/SaveDialog.tsx
var ws = () => {
	let { projectName: e, saveDialogVisible: t, set: n } = k(j((e) => c([
		"projectName",
		"saveDialogVisible",
		"set"
	], e))), [r, i] = I(e), o = () => {
		n((e) => {
			e.saveDialogVisible = !1;
		});
	};
	return /* @__PURE__ */ B(Wt, {
		open: t,
		onClose: o,
		transitionDuration: 100,
		maxWidth: "sm",
		fullWidth: !0,
		children: [
			/* @__PURE__ */ z(qt, { children: "Save Project" }),
			/* @__PURE__ */ z(Kt, { children: /* @__PURE__ */ z(sn, {
				autoFocus: !0,
				margin: "dense",
				label: "File name",
				type: "text",
				fullWidth: !0,
				variant: "outlined",
				value: r,
				onChange: (e) => i(e.target.value)
			}) }),
			/* @__PURE__ */ B(Gt, { children: [/* @__PURE__ */ z(L, {
				onClick: o,
				children: "Cancel"
			}), /* @__PURE__ */ z(L, {
				variant: "contained",
				color: "success",
				onClick: () => {
					a("SAVE", o);
				},
				children: "Save"
			})] })
		]
	});
}, Ts = {
	display: "flex",
	justifyContent: "space-between"
}, Es = {
	display: "flex",
	justifyContent: "space-between"
}, Ds = { minWidth: "10px" };
function Os(e) {
	let t = e.hotkey.join("");
	return /* @__PURE__ */ B(V, {
		sx: Ts,
		children: [/* @__PURE__ */ z("div", { children: e.text }), /* @__PURE__ */ z(V, {
			sx: Es,
			children: e.hotkey.map((n, r) => /* @__PURE__ */ z(V, {
				component: "span",
				sx: Ds,
				children: n
			}, t + e.text + String(r)))
		})]
	});
}
// src/constants/characters.ts
var ks = {
	COMMAND: "⌘",
	CONTROL: "⌃",
	SHIFT: "⇧",
	OPTION: "⌥",
	DELETE: "⌫",
	DELETE_FORWARDS: "⌦",
	UP_ARROW: "↑",
	RIGHT_ARROW: "→",
	LEFT_ARROW: "←",
	DOWN_ARROW: "↓",
	TAB: "⇥",
	ESCAPE: "⎋"
}, As = Rt((e) => ({
	openMenu: null,
	anchorEl: null,
	openMenuWithAnchor: (t, n) => e({
		openMenu: t,
		anchorEl: n
	}),
	closeMenu: () => e({
		openMenu: null,
		anchorEl: null
	})
})), js = {
	textTransform: "none",
	minWidth: "auto",
	px: 1.5,
	py: .25,
	fontSize: "9pt",
	color: "text.primary",
	"&:hover": { backgroundColor: "action.hover" }
}, Ms = {
	elevation: 4,
	sx: {
		minWidth: 180,
		bgcolor: "background.paper",
		"& .MuiMenuItem-root": {
			fontSize: "9pt",
			py: .5,
			px: 1.5
		}
	}
};
function Ns(t) {
	let { closeMenu: n } = As();
	return /* @__PURE__ */ z(pn, {
		onClick: () => {
			e(t.message), n();
		},
		disabled: t.disabled,
		children: /* @__PURE__ */ z(Os, {
			text: t.label,
			hotkey: t.hotkey || [""]
		})
	});
}
var Ps = ({ label: e, hotkey: t, disabled: n, event: r, args: i }) => {
	let { closeMenu: o } = As();
	return /* @__PURE__ */ z(pn, {
		onClick: () => {
			a(r, i), o();
		},
		disabled: n,
		children: /* @__PURE__ */ z(Os, {
			text: e,
			hotkey: t || [""]
		})
	});
};
function Fs() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = As(), i = e === "file";
	return /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z(un, {
		size: "small",
		sx: js,
		onClick: (e) => {
			n("file", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "File"
	}), /* @__PURE__ */ B(fn, {
		anchorEl: t,
		open: i,
		onClose: r,
		anchorOrigin: {
			vertical: "bottom",
			horizontal: "left"
		},
		transformOrigin: {
			vertical: "top",
			horizontal: "left"
		},
		slotProps: { paper: Ms },
		children: [
			/* @__PURE__ */ z(Ps, {
				label: "New",
				event: "NEW",
				hotkey: [ks.SHIFT, "N"]
			}),
			/* @__PURE__ */ z(Ps, {
				label: "Open",
				event: "OPEN",
				hotkey: [ks.COMMAND, "O"]
			}),
			/* @__PURE__ */ z(Ps, {
				label: "Save",
				event: "SAVE",
				hotkey: [ks.COMMAND, "S"]
			}),
			/* @__PURE__ */ z(mn, {}),
			/* @__PURE__ */ z(Ps, {
				label: "Import",
				event: "SHOW_IMPORT_DIALOG",
				args: !0,
				hotkey: [ks.COMMAND, "I"]
			})
		]
	})] });
}
function Is() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = As(), i = e === "edit";
	return /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z(un, {
		size: "small",
		sx: js,
		onClick: (e) => {
			n("edit", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "Edit"
	}), /* @__PURE__ */ B(fn, {
		anchorEl: t,
		open: i,
		onClose: r,
		anchorOrigin: {
			vertical: "bottom",
			horizontal: "left"
		},
		transformOrigin: {
			vertical: "top",
			horizontal: "left"
		},
		slotProps: { paper: Ms },
		children: [
			/* @__PURE__ */ z(Ns, {
				label: "Undo",
				message: "UNDO",
				hotkey: [ks.COMMAND, "Z"],
				disabled: !0
			}),
			/* @__PURE__ */ z(Ns, {
				label: "Redo",
				message: "REDO",
				hotkey: [
					ks.SHIFT,
					ks.COMMAND,
					"Z"
				],
				disabled: !0
			}),
			/* @__PURE__ */ z(mn, {}),
			/* @__PURE__ */ z(Ns, {
				label: "Duplicate",
				message: "SHOULD_DUPLICATE_SELECTED_OBJECTS",
				hotkey: [ks.SHIFT, "D"],
				disabled: !0
			}),
			/* @__PURE__ */ z(mn, {}),
			/* @__PURE__ */ z(Ns, {
				label: "Cut",
				message: "CUT",
				hotkey: [ks.COMMAND, "X"],
				disabled: !0
			}),
			/* @__PURE__ */ z(Ns, {
				label: "Copy",
				message: "COPY",
				hotkey: [ks.COMMAND, "C"],
				disabled: !0
			}),
			/* @__PURE__ */ z(Ns, {
				label: "Paste",
				message: "PASTE",
				hotkey: [ks.COMMAND, "V"],
				disabled: !0
			})
		]
	})] });
}
function Ls() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = As(), i = e === "add";
	return /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z(un, {
		size: "small",
		sx: js,
		onClick: (e) => {
			n("add", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "Add"
	}), /* @__PURE__ */ B(fn, {
		anchorEl: t,
		open: i,
		onClose: r,
		anchorOrigin: {
			vertical: "bottom",
			horizontal: "left"
		},
		transformOrigin: {
			vertical: "top",
			horizontal: "left"
		},
		slotProps: { paper: Ms },
		children: [
			/* @__PURE__ */ z(Ns, {
				label: "Source",
				message: "SHOULD_ADD_SOURCE"
			}),
			/* @__PURE__ */ z(Ns, {
				label: "Receiver",
				message: "SHOULD_ADD_RECEIVER"
			}),
			/* @__PURE__ */ z(mn, {}),
			/* @__PURE__ */ z(Ns, {
				label: "Sketch",
				message: "SHOULD_ADD_SKETCH",
				disabled: !0
			}),
			/* @__PURE__ */ z(mn, {}),
			/* @__PURE__ */ z(Ns, {
				label: "Ray Tracer",
				message: "SHOULD_ADD_RAYTRACER"
			}),
			/* @__PURE__ */ z(Ns, {
				label: "Image Source",
				message: "SHOULD_ADD_IMAGE_SOURCE"
			}),
			/* @__PURE__ */ z(Ps, {
				label: "Beam Tracer",
				event: "SHOULD_ADD_BEAMTRACE"
			}),
			/* @__PURE__ */ z(Ps, {
				label: "2D-FDTD",
				event: "ADD_FDTD_2D"
			}),
			/* @__PURE__ */ z(Ns, {
				label: "Statistical RT",
				message: "SHOULD_ADD_RT60"
			}),
			/* @__PURE__ */ z(Ns, {
				label: "Energy Decay",
				message: "SHOULD_ADD_ENERGYDECAY"
			}),
			/* @__PURE__ */ z(Ps, {
				label: "Acoustic Radiance Transfer",
				event: "ADD_ART"
			}),
			/* @__PURE__ */ z(Ps, {
				label: "Adaptive Rectangular Decomposition",
				event: "ADD_ARD"
			})
		]
	})] });
}
function Rs() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = As(), i = e === "view";
	return /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z(un, {
		size: "small",
		sx: js,
		onClick: (e) => {
			n("view", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "View"
	}), /* @__PURE__ */ B(fn, {
		anchorEl: t,
		open: i,
		onClose: r,
		anchorOrigin: {
			vertical: "bottom",
			horizontal: "left"
		},
		transformOrigin: {
			vertical: "top",
			horizontal: "left"
		},
		slotProps: { paper: Ms },
		children: [
			/* @__PURE__ */ z(Ns, {
				label: "Clear Local Storage",
				message: "CLEAR_LOCAL_STORAGE"
			}),
			/* @__PURE__ */ z(Ns, {
				label: "Toggle Renderer Stats",
				message: "TOGGLE_RENDERER_STATS_VISIBLE"
			}),
			/* @__PURE__ */ z(Ps, {
				label: "Toggle Results Panel",
				event: "TOGGLE_RESULTS_PANEL",
				hotkey: [ks.SHIFT, "R"]
			}),
			/* @__PURE__ */ z(mn, {}),
			/* @__PURE__ */ z(Ps, {
				label: "Reset Layout",
				event: "RESET_LAYOUT"
			})
		]
	})] });
}
function zs() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = As(), i = e === "tools";
	return /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z(un, {
		size: "small",
		sx: js,
		onClick: (e) => {
			n("tools", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "Tools"
	}), /* @__PURE__ */ B(fn, {
		anchorEl: t,
		open: i,
		onClose: r,
		anchorOrigin: {
			vertical: "bottom",
			horizontal: "left"
		},
		transformOrigin: {
			vertical: "top",
			horizontal: "left"
		},
		slotProps: { paper: Ms },
		children: [/* @__PURE__ */ z(Ns, {
			label: "CLF Viewer",
			message: "OPEN_CLF_VIEWER"
		}), /* @__PURE__ */ z(Ns, {
			label: "Image Source Test",
			message: "SHOULD_ADD_IMAGE_SOURCE"
		})]
	})] });
}
function Bs() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = As(), i = e === "examples";
	return /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z(un, {
		size: "small",
		sx: js,
		onClick: (e) => {
			n("examples", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "Examples"
	}), /* @__PURE__ */ B(fn, {
		anchorEl: t,
		open: i,
		onClose: r,
		anchorOrigin: {
			vertical: "bottom",
			horizontal: "left"
		},
		transformOrigin: {
			vertical: "top",
			horizontal: "left"
		},
		slotProps: { paper: Ms },
		children: [
			/* @__PURE__ */ z(Ps, {
				label: "Shoebox",
				event: "OPEN_EXAMPLE",
				args: "shoebox"
			}),
			/* @__PURE__ */ z(Ps, {
				label: "Concord",
				event: "OPEN_EXAMPLE",
				args: "concord"
			}),
			/* @__PURE__ */ z(Ps, {
				label: "Auditorium",
				event: "OPEN_EXAMPLE",
				args: "auditorium"
			})
		]
	})] });
}
var Vs = () => {
	let e = k((e) => e.projectName);
	return /* @__PURE__ */ z(V, {
		className: "main-nav_bar-projectname_text",
		sx: {
			flex: 1,
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			fontSize: "10pt",
			fontWeight: 200
		},
		children: e
	});
}, Hs = {
	height: "var(--main-nav_bar__height)",
	minHeight: "var(--main-nav_bar__height)",
	backgroundColor: "background.paper",
	color: "text.primary",
	boxShadow: "none",
	borderBottom: "1px solid",
	borderColor: "divider"
}, Us = {
	minHeight: "var(--main-nav_bar__height) !important",
	height: "var(--main-nav_bar__height)",
	px: 1,
	display: "flex",
	justifyContent: "space-between"
}, Ws = {
	display: "flex",
	alignItems: "center",
	height: "var(--main-nav_bar__height)",
	flex: 1
}, Gs = {
	fontSize: "12pt",
	fontWeight: 500,
	mr: 1
};
function Ks() {
	return /* @__PURE__ */ z(cn, {
		position: "static",
		sx: Hs,
		children: /* @__PURE__ */ B(ln, {
			disableGutters: !0,
			sx: Us,
			children: [
				/* @__PURE__ */ B(V, {
					sx: Ws,
					children: [
						/* @__PURE__ */ z(V, {
							sx: Gs,
							children: "cram"
						}),
						/* @__PURE__ */ z(mn, {
							orientation: "vertical",
							flexItem: !0,
							sx: { mx: 1 }
						}),
						/* @__PURE__ */ B(dn, {
							variant: "text",
							size: "small",
							children: [
								/* @__PURE__ */ z(Fs, {}),
								/* @__PURE__ */ z(Is, {}),
								/* @__PURE__ */ z(Ls, {}),
								/* @__PURE__ */ z(Rs, {}),
								/* @__PURE__ */ z(zs, {}),
								/* @__PURE__ */ z(Bs, {})
							]
						})
					]
				}),
				/* @__PURE__ */ z(Vs, {}),
				/* @__PURE__ */ z(V, {
					sx: {
						...Ws,
						justifyContent: "flex-end"
					},
					children: /* @__PURE__ */ z(hn, {
						size: "small",
						onClick: () => e("SHOW_SETTINGS_DRAWER"),
						sx: { p: .5 },
						children: /* @__PURE__ */ z(gn, { fontSize: "small" })
					})
				})
			]
		})
	});
}
// src/components/ProgressIndicator.tsx
var qs = _n`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`, Js = _n`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`, Ys = _n`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
`, Xs = (e) => ({
	position: "fixed",
	top: 50,
	left: "50%",
	transform: "translateX(-50%)",
	zIndex: 1e3,
	display: "flex",
	alignItems: "center",
	gap: "12px",
	p: "8px 16px",
	bgcolor: "#fff",
	border: "1px solid #d0d7de",
	borderRadius: "6px",
	boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
	animation: `${e ? qs : Js} 0.2s ease-out forwards`,
	pointerEvents: e ? "auto" : "none"
}), Zs = {
	fontSize: 12,
	color: "#1c2127",
	whiteSpace: "nowrap"
}, Qs = {
	width: 120,
	height: 4,
	bgcolor: "#e1e4e8",
	borderRadius: "2px",
	overflow: "hidden"
}, $s = (e, t) => ({
	height: "100%",
	bgcolor: "#2d72d2",
	borderRadius: "2px",
	transition: "width 0.2s ease-out",
	width: t ? "50%" : `${e}%`,
	animation: t ? `${Ys} 1s ease-in-out infinite` : "none"
}), ec = () => {
	let e = k((e) => e.progress);
	if (!e.visible) return null;
	let t = e.progress < 0;
	return /* @__PURE__ */ B(V, {
		sx: Xs(e.visible),
		children: [
			/* @__PURE__ */ z(H, {
				component: "span",
				sx: Zs,
				children: e.message
			}),
			/* @__PURE__ */ z(V, {
				sx: Qs,
				children: /* @__PURE__ */ z(V, { sx: $s(e.progress, t) })
			}),
			!t && /* @__PURE__ */ B(H, {
				component: "span",
				sx: Zs,
				children: [Math.round(e.progress), "%"]
			})
		]
	});
}, tc = _n`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`, nc = _n`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`, rc = _n`
  to {
    transform: rotate(360deg);
  }
`, ic = (e) => ({
	position: "fixed",
	bottom: 16,
	right: 16,
	zIndex: 1e3,
	display: "flex",
	alignItems: "center",
	gap: "10px",
	p: "8px 14px",
	bgcolor: "rgba(255, 255, 255, 0.95)",
	border: "1px solid #d0d7de",
	borderRadius: "6px",
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
	animation: `${e ? tc : nc} 0.2s ease-out forwards`,
	pointerEvents: e ? "auto" : "none",
	fontSize: 12
}), ac = {
	width: 14,
	height: 14,
	border: "2px solid #2d72d2",
	borderTopColor: "transparent",
	borderRadius: "50%",
	animation: `${rc} 0.8s linear infinite`
}, oc = () => {
	let [e, t] = I({
		visible: !1,
		message: "",
		solverCount: 0
	});
	return N(() => {
		let e = n("SHOW_AUTO_CALC_PROGRESS", ({ message: e, solverCount: n }) => {
			t({
				visible: !0,
				message: e,
				solverCount: n
			});
		}), r = n("HIDE_AUTO_CALC_PROGRESS", () => {
			t((e) => ({
				...e,
				visible: !1
			}));
		});
		return () => {
			e(), r();
		};
	}, []), e.visible ? /* @__PURE__ */ B(V, {
		sx: ic(e.visible),
		children: [
			/* @__PURE__ */ z(V, { sx: ac }),
			/* @__PURE__ */ z(H, {
				component: "span",
				sx: {
					color: "#1c2127",
					whiteSpace: "nowrap"
				},
				children: e.message
			}),
			e.solverCount > 1 && /* @__PURE__ */ B(H, {
				component: "span",
				sx: {
					color: "#5c7080",
					fontSize: 11
				},
				children: [
					"(",
					e.solverCount,
					" solvers)"
				]
			})
		]
	}) : null;
}, sc = zt.scale([
	"black",
	"navy",
	"red",
	"yellow",
	"white"
]).mode("lch").correctLightness(!0);
function cc(e) {
	return e instanceof Array ? `linear-gradient(90deg, ${e.map((t, n) => {
		let r = 100 * (n + 1) / 9;
		return `${sc(e[n])} ${Math.round(r)}%`;
	}).join(",")})` : `linear-gradient(90deg, ${[
		63,
		125,
		250,
		500,
		1e3,
		2e3,
		4e3,
		8e3
	].map((t, n) => {
		let r = 100 * (n + 1) / 9;
		return `${sc(e[String(t)])} ${Math.round(r)}%`;
	}).join(",")})`;
}
// src/components/tree-item-label/TreeItemLabel.tsx
var lc = {
	display: "flex",
	alignItems: "center",
	width: "100%",
	minHeight: 24
}, uc = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: 28,
	"& .MuiSvgIcon-root": { fontSize: 16 }
}, dc = {
	display: "flex",
	flexDirection: "column",
	minWidth: 0,
	flex: 1
}, fc = {
	fontSize: "0.75rem",
	fontWeight: 400,
	lineHeight: 1.4,
	color: "text.primary",
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap"
}, pc = {
	fontSize: "0.625rem",
	fontWeight: 400,
	lineHeight: 1.4,
	color: "text.secondary"
};
function mc(e) {
	let t = {};
	return e.onClick && (t.onClick = e.onClick), /* @__PURE__ */ B(V, {
		sx: lc,
		...t,
		children: [e.icon && /* @__PURE__ */ z(V, {
			sx: uc,
			children: e.icon
		}), /* @__PURE__ */ B(V, {
			sx: dc,
			children: [typeof e.label == "string" ? /* @__PURE__ */ z(H, {
				component: "span",
				sx: fc,
				children: e.label
			}) : e.label, e.meta && /* @__PURE__ */ z(H, {
				component: "span",
				sx: pc,
				children: e.meta
			})]
		})]
	});
}
// src/components/ContextMenu.tsx
function hc(e) {
	let [t, n] = I(null), r = e.items || [
		"Delete",
		"!seperator",
		"Add To Global Variables",
		"Log to Console"
	], i = M((e) => {
		e.preventDefault(), n(t === null ? {
			mouseX: e.clientX + 2,
			mouseY: e.clientY - 6
		} : null);
	}, [t]), a = M(() => {
		n(null);
	}, []), { handleMenuItemClick: o } = e, s = M((e) => {
		o(e), a();
	}, [o, a]);
	return /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z("div", {
		onContextMenu: i,
		children: e.children
	}), /* @__PURE__ */ z(Xt, {
		open: t !== null,
		onClose: a,
		anchorReference: "anchorPosition",
		anchorPosition: t === null ? void 0 : {
			top: t.mouseY,
			left: t.mouseX
		},
		slotProps: { paper: { sx: { bgcolor: "background.paper" } } },
		children: r.map((e, t) => e === "!seperator" ? /* @__PURE__ */ z(Jt, {}, "context-menu-item-" + e + String(t)) : /* @__PURE__ */ z(Zt, {
			onClick: s,
			"data-text": e,
			children: e
		}, "context-menu-item-" + e))
	})] });
}
// src/components/icons/NodesIcon.tsx
function gc(e) {
	return /* @__PURE__ */ z($t, {
		...e,
		children: /* @__PURE__ */ B("svg", {
			width: "24",
			height: "24",
			viewBox: "-4 -4 24 24",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ z("path", {
					d: "M4 12C4 13.1046 3.10457 14 2 14C0.89543 14 0 13.1046 0 12C0 10.8954 0.89543 10 2 10C3.10457 10 4 10.8954 4 12Z",
					fill: "black"
				}),
				/* @__PURE__ */ z("path", {
					d: "M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z",
					fill: "black"
				}),
				/* @__PURE__ */ z("path", {
					d: "M9 2C9 3.10457 8.10457 4 7 4C5.89543 4 5 3.10457 5 2C5 0.89543 5.89543 0 7 0C8.10457 0 9 0.89543 9 2Z",
					fill: "black"
				}),
				/* @__PURE__ */ z("path", {
					d: "M7 2L2 12H12L7 2Z",
					stroke: "black"
				})
			]
		})
	});
}
// src/components/icons/RoomIcon.tsx
function _c(e) {
	return /* @__PURE__ */ z($t, {
		...e,
		children: /* @__PURE__ */ B("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			id: "Layer_1",
			"data-name": "Layer 1",
			viewBox: "0 0 31 28",
			children: [
				/* @__PURE__ */ z("polygon", {
					points: "6.473 10.456 15.492 5.332 24.524 10.455 15.485 15.865 6.473 10.456",
					fill: "#ebebeb"
				}),
				/* @__PURE__ */ z("polygon", {
					points: "6.473 10.456 15.489 15.866 15.492 26.635 6.472 21.259 6.473 10.456",
					fill: "#90908f"
				}),
				/* @__PURE__ */ z("polygon", {
					points: "24.524 10.455 24.528 21.305 15.492 26.635 15.492 15.866 24.524 10.455",
					fill: "#c6c7c8"
				}),
				/* @__PURE__ */ z("path", {
					d: "M24.49414,9.897l-8.5-4.83105a1.00013,1.00013,0,0,0-.98828,0l-8.5,4.83105A1.00006,1.00006,0,0,0,6,10.76642V20.99231a.99993.99993,0,0,0,.48816.85907L14.989,26.91681a1,1,0,0,0,1.021.00159l8.49915-5.02747A1.0001,1.0001,0,0,0,25,21.03027V10.76642A1.00006,1.00006,0,0,0,24.49414,9.897ZM15.5,5.93555l8.17548,4.6466L15.501,15.419l-8.14533-4.8545ZM7,20.99219V11.51678l8,4.76691V25.76Zm9,4.77118V16.28473l8-4.73181v9.47735Z",
					fill: "#535353"
				})
			]
		})
	});
}
// src/components/icons/SourceIcon.tsx
function vc(e) {
	return /* @__PURE__ */ z(Mn, {
		transform: "rotate(45)",
		fillOpacity: .95,
		...e
	});
}
// src/components/icons/ReceiverIcon.tsx
function yc(e) {
	return /* @__PURE__ */ z(Nn, { ...e });
}
// src/components/object-view/ObjectView.tsx
var bc = {
	flexGrow: 1,
	"& .MuiTreeItem-content": { py: .25 },
	"& .MuiTreeItem-content.Mui-selected": { bgcolor: "transparent" },
	"& .MuiTreeItem-content.Mui-selected:hover": { bgcolor: "transparent" },
	"& .MuiTreeItem-content.Mui-selected.Mui-focused": { bgcolor: "transparent" },
	"& .MuiTreeItem-content.Mui-focused": { bgcolor: "transparent" },
	"& .MuiTreeItem-content:hover": { bgcolor: "action.hover" },
	"& .MuiTreeItem-iconContainer": { width: "auto" },
	"& .MuiTreeItem-group": { ml: 1.75 }
}, xc = {
	bgcolor: "action.selected",
	borderRadius: .5
}, Sc = Vt(function e(t) {
	let { container: r, expanded: i, setExpanded: o, parent: s } = t, [c, l] = I(r.selected), [u, d] = I(r.name), f = r.uuid, p = r.uuid, m = u || "untitled", h = M((e) => {
		r.kind !== "room" && a(e.shiftKey ? "APPEND_SELECTION" : "SET_SELECTION", [r]);
	}, [r]);
	N(() => n("APPEND_SELECTION", (e) => {
		e.includes(r) && l(!0);
	}), [r]), N(() => n("SET_SELECTION", (e) => {
		l(e.includes(r));
	}), [r]);
	let g = `${r.kind.toUpperCase()}_SET_PROPERTY`;
	N(() => n(g, ({ uuid: e, property: t, value: n }) => {
		e === r.uuid && t === "name" && d(n);
	}), [r.uuid, g]);
	let _ = /* @__PURE__ */ z(mc, { label: m }), v = /* @__PURE__ */ z(mc, {
		icon: /* @__PURE__ */ z(_c, { fontSize: "inherit" }),
		label: m
	}), y = (e) => {
		if (e.target.textContent) switch (e.target.textContent) {
			case "Delete":
				{
					let e = new Set(i);
					r.traverse((t) => {
						e.has(t.uuid) && e.delete(t.uuid);
					}), a("DESELECT_ALL_OBJECTS"), o([...e]);
					let t = [];
					r.traverse((e) => {
						e.kind && [
							"surface",
							"source",
							"receiver",
							"room"
						].includes(e.kind) && t.push(e.uuid);
					}), a("REMOVE_CONTAINERS", t);
				}
				break;
			case "Log to Console": console.log(r);
		}
	}, b = ["Delete", "Log to Console"], x = (e) => {
		e.preventDefault();
	};
	if (r.parent?.uuid !== s) return /* @__PURE__ */ z(R, {});
	let S = /* @__PURE__ */ z(mc, {
		icon: /* @__PURE__ */ z(gc, { fontSize: "inherit" }),
		label: m
	}), C = /* @__PURE__ */ z(mc, {
		icon: /* @__PURE__ */ z(vc, { fontSize: "inherit" }),
		label: m
	}), w = /* @__PURE__ */ z(mc, {
		icon: /* @__PURE__ */ z(yc, { fontSize: "inherit" }),
		label: m
	}), ee = {
		onClick: h,
		sx: c ? xc : void 0
	};
	switch (r.kind) {
		case "surface": return /* @__PURE__ */ z(hc, {
			handleMenuItemClick: y,
			items: b,
			children: /* @__PURE__ */ z(On, {
				label: S,
				slotProps: { content: ee },
				draggable: !0,
				itemId: p
			})
		}, f + "context-menu");
		case "source": return /* @__PURE__ */ z(hc, {
			handleMenuItemClick: y,
			items: b,
			children: /* @__PURE__ */ z(On, {
				label: C,
				slotProps: { content: ee },
				draggable: !0,
				itemId: p
			})
		}, f + "context-menu");
		case "receiver": return /* @__PURE__ */ z(hc, {
			handleMenuItemClick: y,
			items: b,
			children: /* @__PURE__ */ z(On, {
				label: w,
				slotProps: { content: ee },
				draggable: !0,
				itemId: p
			})
		}, f + "context-menu");
		case "room": return /* @__PURE__ */ z(hc, {
			handleMenuItemClick: y,
			items: b,
			children: /* @__PURE__ */ z(On, {
				label: v,
				slots: {
					collapseIcon: kn,
					expandIcon: An
				},
				onKeyDown: x,
				draggable: !0,
				itemId: p,
				children: r.children.filter((e) => e instanceof E && e.parent?.uuid === r.uuid).map((t) => /* @__PURE__ */ z(e, {
					parent: r.uuid,
					container: t,
					expanded: i,
					setExpanded: o
				}, t.uuid + "-map-children"))
			})
		}, f + "context-menu");
		case "container": return /* @__PURE__ */ z(hc, {
			handleMenuItemClick: y,
			items: b,
			children: /* @__PURE__ */ z(On, {
				label: _,
				slots: {
					collapseIcon: kn,
					expandIcon: An
				},
				onKeyDown: x,
				draggable: !0,
				itemId: p,
				children: r.children.filter((e) => e instanceof E && e.parent?.uuid === r.uuid).map((t) => /* @__PURE__ */ z(e, {
					parent: r.uuid,
					container: t,
					expanded: i,
					setExpanded: o
				}, t.uuid + "-map-children"))
			})
		}, f + "context-menu");
		default: return /* @__PURE__ */ z(R, {});
	}
});
function Cc() {
	let { containers: e, getWorkspace: t } = O(j((e) => c(["containers", "getWorkspace"], e))), [n, r] = I(["containers"]), i = Object.keys(e).length === 0, a = /* @__PURE__ */ z(mc, { label: /* @__PURE__ */ z("span", {
		style: {
			fontWeight: 400,
			color: i ? "var(--mui-palette-text-disabled)" : "var(--mui-palette-text-primary)"
		},
		children: "Objects"
	}) }), o = Object.keys(e), s = t();
	return s ? /* @__PURE__ */ z(Dn, {
		expandedItems: n,
		onExpandedItemsChange: (e, t) => r(t),
		disableSelection: !0,
		sx: bc,
		children: /* @__PURE__ */ z(On, {
			label: a,
			slots: {
				collapseIcon: kn,
				expandIcon: An
			},
			onKeyDown: (e) => {
				e.preventDefault();
			},
			itemId: "containers",
			children: o.map((t) => /* @__PURE__ */ z(Sc, {
				parent: s ? s.uuid : "",
				container: e[t],
				expanded: n,
				setExpanded: r
			}, e[t].uuid + "tree-item-container"))
		})
	}) : /* @__PURE__ */ z(R, {});
}
// src/components/MaterialSearch.tsx
var wc = (e, t) => e < t ? e : t, Tc = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	py: .5,
	px: 1,
	fontSize: "0.75rem",
	"&:hover": { bgcolor: "action.hover" }
}, Ec = {
	...Tc,
	bgcolor: "primary.light",
	"&:hover": { bgcolor: "primary.light" }
}, Dc = {
	width: 100,
	height: 16,
	borderRadius: .5
}, Oc = {
	textAlign: "center",
	px: .5
}, kc = ({ item: e }) => {
	let { set: t, selectedMaterial: n } = se(j((e) => c(["set", "selectedMaterial"], e))), r = n === e.uuid;
	return /* @__PURE__ */ B(Sn, {
		onClick: () => t((t) => {
			t.selectedMaterial = e.uuid;
		}),
		selected: r,
		sx: r ? Ec : Tc,
		children: [/* @__PURE__ */ z(H, {
			variant: "body2",
			sx: {
				fontSize: "0.75rem",
				flex: 1
			},
			children: e.material
		}), /* @__PURE__ */ z(V, { sx: {
			...Dc,
			background: cc(e.absorption)
		} })]
	});
}, Ac = ({ absorption: e }) => {
	let t = Object.keys(e);
	return /* @__PURE__ */ z(V, {
		sx: {
			display: "flex",
			gap: .5,
			my: 1
		},
		children: t.map((t) => /* @__PURE__ */ B(V, {
			sx: Oc,
			children: [/* @__PURE__ */ B(H, {
				variant: "caption",
				color: "text.secondary",
				sx: { display: "block" },
				children: [t, "Hz"]
			}), /* @__PURE__ */ z(H, {
				variant: "body2",
				sx: { fontWeight: 500 },
				children: e[t]
			})]
		}, `${t}-${e[t]}`))
	});
}, jc = () => {
	let e = se((e) => e.materials.get(e.selectedMaterial));
	return e ? /* @__PURE__ */ B(V, {
		sx: { mt: 2 },
		children: [
			/* @__PURE__ */ z(H, {
				variant: "subtitle1",
				sx: { fontWeight: 600 },
				children: e.name
			}),
			/* @__PURE__ */ B(V, {
				sx: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				},
				children: [/* @__PURE__ */ z(H, {
					variant: "body2",
					children: e.material
				}), /* @__PURE__ */ z(H, {
					variant: "caption",
					color: "text.secondary",
					children: e.uuid
				})]
			}),
			/* @__PURE__ */ z(Ac, { absorption: e.absorption })
		]
	}) : /* @__PURE__ */ z(H, {
		variant: "body2",
		color: "text.secondary",
		sx: { py: 2 },
		children: "Nothing Selected"
	});
}, Mc = () => {
	let { bufferLength: e, query: t, search: n } = se(j((e) => c([
		"bufferLength",
		"query",
		"search"
	], e))), r = P(() => n(t), [t, n]);
	return /* @__PURE__ */ z(xn, {
		sx: {
			maxHeight: "25vh",
			overflow: "auto",
			bgcolor: "background.paper",
			border: 1,
			borderColor: "divider",
			borderRadius: 1,
			boxShadow: "inset 0 0 8px rgba(0,0,0,0.1)",
			p: 0
		},
		children: r.slice(0, wc(e, r.length)).map((e) => /* @__PURE__ */ z(kc, { item: e }, `item-${e.uuid}`))
	});
}, Nc = () => {
	let e = O((e) => e.selectedObjects), t = P(() => [...e].filter((e) => e.kind === "surface"), [e]), n = se((e) => e.materials.get(e.selectedMaterial));
	return /* @__PURE__ */ z(V, {
		sx: { mt: 2 },
		children: /* @__PURE__ */ z(un, {
			variant: "contained",
			color: "success",
			startIcon: /* @__PURE__ */ z(En, {}),
			disabled: t.length === 0,
			onClick: () => {
				n && a("ASSIGN_MATERIAL", {
					material: n,
					target: t
				});
			},
			children: "Assign"
		})
	});
}, Pc = () => {
	let { query: e, set: t } = se(j((e) => c(["query", "set"], e))), { materialDrawerOpen: n, set: r } = k(j((e) => c(["materialDrawerOpen", "set"], e))), i = (e) => t((t) => {
		t.query = e;
	}), a = () => r((e) => {
		e.materialDrawerOpen = !1;
	});
	return /* @__PURE__ */ B(vn, {
		anchor: "right",
		open: n,
		onClose: a,
		sx: { "& .MuiDrawer-paper": {
			width: "100%",
			maxWidth: 600,
			bgcolor: "background.paper"
		} },
		children: [/* @__PURE__ */ B(V, {
			sx: {
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				p: 2,
				borderBottom: 1,
				borderColor: "divider"
			},
			children: [/* @__PURE__ */ z(H, {
				variant: "h6",
				children: "Material Selection"
			}), /* @__PURE__ */ z(hn, {
				onClick: a,
				size: "small",
				children: /* @__PURE__ */ z(Tn, {})
			})]
		}), /* @__PURE__ */ B(V, {
			sx: {
				display: "grid",
				gridTemplateColumns: "1fr 2fr",
				flex: 1,
				overflow: "hidden",
				bgcolor: "background.paper"
			},
			children: [/* @__PURE__ */ z(V, {
				sx: {
					overflow: "auto",
					p: 2,
					borderRight: 1,
					borderColor: "divider"
				},
				children: /* @__PURE__ */ z(Cc, {})
			}), /* @__PURE__ */ B(V, {
				sx: {
					overflow: "auto",
					p: 2,
					display: "flex",
					flexDirection: "column"
				},
				children: [
					/* @__PURE__ */ z(bn, {
						size: "small",
						fullWidth: !0,
						placeholder: "Search materials...",
						value: e,
						onChange: (e) => i(e.target.value),
						sx: { mb: 1 },
						slotProps: { input: { startAdornment: /* @__PURE__ */ z(yn, {
							position: "start",
							children: /* @__PURE__ */ z(wn, {
								fontSize: "small",
								color: "action"
							})
						}) } }
					}),
					/* @__PURE__ */ z(Mc, {}),
					/* @__PURE__ */ z(Cn, {
						component: "button",
						variant: "body2",
						onClick: () => t((e) => {
							e.bufferLength += 15;
						}),
						sx: {
							mt: 1,
							textAlign: "left"
						},
						children: "show more..."
					}),
					/* @__PURE__ */ z(mn, { sx: { my: 2 } }),
					/* @__PURE__ */ z(jc, {}),
					/* @__PURE__ */ z(Nc, {})
				]
			})]
		})]
	});
}, Fc = {
	global: {
		tabEnablePopout: !1,
		tabEnableRename: !1,
		tabSetMinHeight: 100,
		tabSetMinWidth: 200,
		borderMinSize: 100,
		borderAutoSelectTabWhenOpen: !0,
		borderAutoSelectTabWhenClosed: !0
	},
	borders: [{
		type: "border",
		location: "right",
		size: 320,
		selected: 0,
		children: [
			{
				type: "tab",
				id: "objects",
				name: "Objects",
				component: "ObjectsPanel",
				enableClose: !1,
				enablePopout: !1
			},
			{
				type: "tab",
				id: "solvers",
				name: "Solvers",
				component: "SolversPanel",
				enableClose: !1,
				enablePopout: !1
			},
			{
				type: "tab",
				id: "renderer",
				name: "Renderer",
				component: "RendererPanel",
				enableClose: !1,
				enablePopout: !1
			}
		]
	}],
	layout: {
		type: "row",
		children: [{
			type: "row",
			weight: 100,
			children: [{
				type: "tabset",
				id: "main",
				weight: 75,
				children: [{
					type: "tab",
					id: "canvas",
					name: "Canvas",
					component: "CanvasPanel",
					enableClose: !1,
					enableDrag: !1,
					enableRename: !1
				}],
				enableTabStrip: !1
			}, {
				type: "tabset",
				id: "results-tabset",
				weight: 25,
				minHeight: 100,
				children: [{
					type: "tab",
					id: "results",
					name: "Results",
					component: "ResultsPanel",
					enableClose: !1,
					enablePopout: !1
				}]
			}]
		}]
	}
}, Ic = {
	CANVAS: "canvas",
	OBJECTS: "objects",
	SOLVERS: "solvers",
	RENDERER: "renderer",
	RESULTS: "results"
}, Lc = {
	height: "100%",
	width: "100%",
	userSelect: "none"
};
function Rc({ children: e }) {
	return /* @__PURE__ */ z(V, {
		id: "editor-container",
		sx: Lc,
		children: e
	});
}
// src/components/workbench/panels/CanvasPanel.tsx
function zc() {
	let e = F(null), t = F(null), n = F(null), r = F(null), i = F(null);
	return N(() => {
		e.current && h.postMessage("APP_MOUNTED", e.current);
		let t = i.current, n = null;
		return t && (n = new ResizeObserver(() => {
			T.checkresize(), T.needsToRender = !0;
		}), n.observe(t)), () => {
			n?.disconnect();
		};
	}, []), /* @__PURE__ */ z("div", {
		ref: i,
		style: {
			width: "100%",
			height: "100%",
			position: "relative"
		},
		children: /* @__PURE__ */ B(Rc, { children: [
			/* @__PURE__ */ z("div", {
				id: "response-overlay",
				className: "response_overlay response_overlay-hidden",
				ref: t
			}),
			/* @__PURE__ */ z("div", {
				id: "canvas_overlay",
				ref: n
			}),
			/* @__PURE__ */ z("div", {
				id: "orientation-overlay",
				ref: r
			}),
			/* @__PURE__ */ z("canvas", {
				id: "renderer-canvas",
				ref: e
			})
		] })
	});
}
// src/components/parameter-config/property-row/PropertyRowFolder.tsx
var Bc = {
	display: "flex",
	alignItems: "center",
	gap: .5,
	py: .5,
	cursor: "pointer",
	userSelect: "none",
	"&:hover": { bgcolor: "action.hover" }
}, Vc = { pb: .5 }, Hc = {
	pt: .5,
	pb: .5
}, Uc = {
	fontSize: "0.75rem",
	fontWeight: 500,
	color: "text.primary"
};
function Wc(e) {
	return /* @__PURE__ */ B(V, {
		sx: Vc,
		children: [/* @__PURE__ */ B(V, {
			sx: Bc,
			onClick: () => e.onOpenClose(e.id),
			children: [e.open ? /* @__PURE__ */ z(kn, { sx: {
				fontSize: 16,
				color: "text.secondary"
			} }) : /* @__PURE__ */ z(An, { sx: {
				fontSize: 16,
				color: "text.secondary"
			} }), /* @__PURE__ */ z(H, {
				sx: Uc,
				children: e.label
			})]
		}), /* @__PURE__ */ z(Jn, {
			in: e.open,
			children: /* @__PURE__ */ z(V, {
				sx: Hc,
				children: e.children
			})
		})]
	});
}
// src/components/parameter-config/property-row/PropertyRow.tsx
var Gc = {
	display: "grid",
	gridTemplateColumns: "2fr 3fr",
	userSelect: "none",
	fontSize: "0.75rem",
	mb: .5,
	px: .5,
	alignItems: "center",
	"&:last-child": { mb: 0 }
};
function J(e) {
	return /* @__PURE__ */ z(V, {
		sx: Gc,
		children: e.children
	});
}
// src/components/parameter-config/property-row/PropertyRowLabel.tsx
var Kc = {
	textAlign: "right",
	minWidth: "100px",
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
	gap: "4px"
}, qc = {
	fontSize: "0.75rem",
	color: "text.secondary",
	lineHeight: 1.5
}, Jc = {
	fontSize: 12,
	color: "text.disabled",
	cursor: "help"
}, Yc = {
	bgcolor: "grey.800",
	color: "common.white",
	fontSize: "0.7rem",
	lineHeight: 1.4,
	px: 1.5,
	py: .75,
	maxWidth: 260,
	boxShadow: 2
}, Xc = { color: "grey.800" };
function Y({ label: e, tooltip: t, hasToolTip: n }) {
	return n && t ? /* @__PURE__ */ B(V, {
		sx: Kc,
		children: [/* @__PURE__ */ z(H, {
			component: "span",
			sx: qc,
			children: e
		}), /* @__PURE__ */ z(Yn, {
			title: t,
			placement: "left",
			arrow: !0,
			enterDelay: 300,
			slotProps: {
				tooltip: { sx: Yc },
				arrow: { sx: Xc }
			},
			children: /* @__PURE__ */ z(Xn, { sx: Jc })
		})]
	}) : /* @__PURE__ */ z(V, {
		sx: Kc,
		children: /* @__PURE__ */ z(H, {
			component: "span",
			sx: qc,
			children: e
		})
	});
}
// src/components/parameter-config/property-row/PropertyRowCheckbox.tsx
var Zc = {
	ml: "0.5em",
	mt: "1px",
	p: 0,
	"& .MuiSvgIcon-root": { fontSize: 16 }
}, Qc = ({ value: e, onChange: t }) => /* @__PURE__ */ z(Zn, {
	checked: e,
	onChange: (e) => t({ value: e.currentTarget.checked }),
	sx: Zc,
	size: "small"
}), $c = {
	ml: 1,
	mr: 1,
	"& .MuiInputBase-root": {
		fontSize: "0.75rem",
		height: 24
	},
	"& .MuiInputBase-input": {
		py: .5,
		px: 1,
		textAlign: "center"
	},
	"& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
	"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" }
}, el = ({ value: e, onChange: t }) => /* @__PURE__ */ z(bn, {
	type: "text",
	size: "small",
	variant: "outlined",
	value: e,
	onChange: (e) => t({ value: e.currentTarget.value }),
	sx: $c
});
// src/components/hooks/use-number-draft.ts
function tl(e) {
	let t = e.trim();
	if (t === "") return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function nl(e, t) {
	let [n, r] = I(null), i = M((e) => {
		let n = e.currentTarget.value;
		r(n);
		let i = tl(n);
		i !== null && t(i);
	}, [t]), a = M(() => r(null), []), o = M((e) => {
		(e.key === "Enter" || e.key === "Escape") && r(null);
	}, []);
	return {
		text: n ?? String(e),
		onChange: i,
		onBlur: a,
		onKeyDown: o,
		clearDraft: a
	};
}
// src/components/parameter-config/property-row/PropertyRowNumberInput.tsx
var rl = {
	ml: 1,
	mr: 1,
	"& .MuiInputBase-root": {
		fontSize: "0.75rem",
		height: 24
	},
	"& .MuiInputBase-input": {
		py: .5,
		px: 1,
		textAlign: "center",
		"&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
			WebkitAppearance: "none",
			m: 0
		},
		MozAppearance: "textfield"
	},
	"& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
	"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" }
}, il = ({ value: e, onChange: t, step: n = 1, min: r, max: i }) => {
	let a = F(null), o = F(e), s = F(n), c = F(r), l = F(i), u = F(t);
	o.current = e, s.current = n, c.current = r, l.current = i, u.current = t;
	let d = nl(e, (e) => u.current({ value: e })), f = F(d.clearDraft);
	return f.current = d.clearDraft, N(() => {
		let e = a.current;
		if (!e) return;
		let t = (e) => {
			e.preventDefault(), f.current();
			let t = e.deltaY < 0 ? s.current : -s.current, n = o.current + t;
			c.current !== void 0 && (n = Math.max(c.current, n)), l.current !== void 0 && (n = Math.min(l.current, n)), Number.isNaN(n) || u.current({ value: n });
		};
		return e.addEventListener("wheel", t, { passive: !1 }), () => e.removeEventListener("wheel", t);
	}, []), /* @__PURE__ */ z(bn, {
		inputRef: a,
		type: "number",
		size: "small",
		variant: "outlined",
		value: d.text,
		onChange: d.onChange,
		onBlur: d.onBlur,
		onKeyDown: d.onKeyDown,
		slotProps: { htmlInput: {
			step: n,
			min: r,
			max: i
		} },
		sx: rl
	});
}, al = {
	width: "30%",
	ml: "0.5em",
	textAlign: "center",
	outline: "none",
	border: "none",
	borderRadius: "2px",
	bgcolor: "rgba(246, 248, 250, 0.75)",
	p: "0 10px",
	verticalAlign: "middle",
	color: "#182026",
	transition: "box-shadow 0.05s cubic-bezier(0.4, 1, 0.75, 0.9)",
	appearance: "none",
	"&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
		WebkitAppearance: "none",
		m: 0
	},
	MozAppearance: "textfield",
	"&:hover": {
		outline: "none",
		boxShadow: "0 0 0 0 rgba(19,124,189,0), 0 0 0 0 rgba(19,124,189,0), inset 0 0 0 1px rgba(16,22,26,.15), inset 0 1px 1px rgba(16,22,26,.2)",
		bgcolor: "rgba(246, 248, 250, 1.0)"
	},
	"&:focus": {
		boxShadow: "0 0 0 0 rgba(19,124,189,0), 0 0 0 0 rgba(19,124,189,0), inset 0 0 0 1px rgba(16,22,26,.15), inset 0 1px 1px rgba(16,22,26,.2)",
		bgcolor: "rgba(246, 248, 250, 0.75)"
	}
}, ol = ({ value: e, onChange: t, step: n = 1, min: r, max: i }) => {
	let a = F(null), o = F(e), s = F(n), c = F(r), l = F(i), u = F(t);
	o.current = e, s.current = n, c.current = r, l.current = i, u.current = t, N(() => {
		let e = a.current;
		if (!e) return;
		let t = (e) => {
			e.preventDefault();
			let t = e.deltaY < 0 ? s.current : -s.current, n = o.current + t;
			c.current !== void 0 && (n = Math.max(c.current, n)), l.current !== void 0 && (n = Math.min(l.current, n)), Number.isNaN(n) || u.current({ value: n });
		};
		return e.addEventListener("wheel", t, { passive: !1 }), () => e.removeEventListener("wheel", t);
	}, []);
	let d = M((e) => {
		let n = e.currentTarget.valueAsNumber;
		Number.isNaN(n) || t({ value: n });
	}, [t]);
	return /* @__PURE__ */ z(V, {
		component: "input",
		type: "number",
		ref: a,
		onChange: d,
		value: e,
		step: n,
		min: r,
		max: i,
		sx: al
	});
}, sl = {
	ml: 1,
	mr: 1,
	fontSize: "0.75rem",
	height: 24,
	bgcolor: "background.paper",
	"& .MuiSelect-select": {
		py: .25,
		px: 1
	},
	"& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
	"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" }
}, cl = {
	fontSize: "0.75rem",
	py: .5
}, ll = ({ value: e, onChange: t, options: n }) => /* @__PURE__ */ z(Qn, {
	size: "small",
	value: e,
	onChange: (e) => t({ value: e.target.value }),
	sx: sl,
	MenuProps: { slotProps: { paper: { sx: { bgcolor: "background.paper" } } } },
	children: n.map(({ value: e, label: t }, n) => /* @__PURE__ */ z(pn, {
		value: e,
		sx: cl,
		children: t
	}, `${e}-${t}-${n}`))
});
// src/components/parameter-config/ContainerComponents.tsx
function ul(e, t, n) {
	return [O((n) => (n.version, n.containers[e][t])), (r) => a(n, {
		uuid: e,
		property: t,
		value: r.value
	})];
}
var dl = (e, t) => ({ uuid: n, property: r, options: i }) => {
	let [a, o] = ul(n, r, e);
	return /* @__PURE__ */ z(t, {
		value: a,
		onChange: o,
		options: i
	});
}, fl = (e) => ({ uuid: t, property: n, label: r, tooltip: i, options: a }) => /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
	label: r,
	hasToolTip: !0,
	tooltip: i
}), /* @__PURE__ */ z("div", { children: p(n).map((n, r) => /* @__PURE__ */ z(e, {
	uuid: t,
	property: n,
	options: a
}, `${t}-${String(n)}-${r}`)) })] }), pl = (e) => ({
	PropertyTextInput: fl(dl(e, el)),
	PropertyNumberInput: fl(dl(e, il)),
	PropertyCheckboxInput: fl(dl(e, Qc)),
	PropertyVectorInput: fl(dl(e, ol)),
	PropertySelect: fl(dl(e, ll))
}), ml = (e) => {
	let [t, n] = I(e);
	return [t, () => void n(!t)];
}, hl = {
	display: "flex",
	justifyContent: "space-around"
}, gl = {
	mx: 1,
	my: .25,
	width: "100%",
	fontSize: "0.75rem",
	textTransform: "none",
	py: .25,
	minHeight: 24
};
function _l({ label: e, onClick: t, disabled: n, ...r }) {
	return /* @__PURE__ */ z(V, {
		sx: hl,
		children: /* @__PURE__ */ z(un, {
			variant: "outlined",
			size: "small",
			color: "inherit",
			sx: gl,
			onClick: t,
			disabled: n,
			...r,
			children: e
		})
	});
}
// src/components/parameter-config/property-row/PropertyButton.tsx
var vl = ({ args: e, event: t, label: n, tooltip: r, buttonLabel: i = n, disabled: o }) => /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
	label: n,
	hasToolTip: !0,
	tooltip: r
}), /* @__PURE__ */ z(_l, {
	onClick: (n) => a(t, e),
	label: i,
	disabled: o
})] }), yl = { pb: .5 }, bl = {
	display: "flex",
	alignItems: "center",
	gap: .5,
	py: .5,
	cursor: "pointer",
	userSelect: "none",
	"&:hover": { bgcolor: "action.hover" }
}, xl = {
	fontSize: "0.75rem",
	fontWeight: 500,
	color: "text.primary"
}, Sl = {
	width: "100%",
	borderCollapse: "collapse",
	fontSize: "0.75rem"
}, Cl = {
	"& th": {
		p: "2px 4px",
		fontWeight: 500,
		color: "text.secondary",
		textAlign: "center",
		fontSize: "0.75rem"
	},
	"& th:first-of-type": {
		width: 60,
		textAlign: "left",
		pl: 1
	}
}, wl = {
	"& td": {
		p: "2px 4px",
		fontSize: "0.75rem"
	},
	"& td:first-of-type": {
		fontWeight: 500,
		color: "text.primary",
		pl: 1
	}
}, Tl = {
	width: "100%",
	"& .MuiInputBase-root": {
		fontSize: "0.75rem",
		height: 24
	},
	"& .MuiInputBase-input": {
		py: .5,
		px: 1,
		textAlign: "center",
		"&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
			WebkitAppearance: "none",
			m: 0
		},
		MozAppearance: "textfield"
	},
	"& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
	"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" }
}, El = 180 / Math.PI, Dl = Math.PI / 180, Ol = (e) => e === "rotationx" || e === "rotationy" || e === "rotationz", kl = ({ uuid: e, property: t, event: n }) => {
	let r = F(null), i = O((n) => (n.version, n.containers[e][t])), o = Ol(t), s = o ? Math.round(i * El * 10) / 10 : i, c = F(s), l = F(e), u = F(t), d = F(n), f = nl(s, (r) => {
		let i = o ? r * Dl : r;
		a(n, {
			uuid: e,
			property: t,
			value: i
		});
	}), p = F(f.clearDraft);
	return p.current = f.clearDraft, c.current = s, l.current = e, u.current = t, d.current = n, N(() => {
		let e = r.current;
		if (!e) return;
		let t = (e) => {
			e.preventDefault(), p.current();
			let t = e.deltaY < 0 ? 1 : -1, n = c.current + t, r = Ol(u.current) ? n * Dl : n;
			Number.isNaN(r) || a(d.current, {
				uuid: l.current,
				property: u.current,
				value: r
			});
		};
		return e.addEventListener("wheel", t, { passive: !1 }), () => e.removeEventListener("wheel", t);
	}, []), /* @__PURE__ */ z(bn, {
		inputRef: r,
		type: "number",
		size: "small",
		variant: "outlined",
		value: f.text,
		onChange: f.onChange,
		onBlur: f.onBlur,
		onKeyDown: f.onKeyDown,
		slotProps: {
			htmlInput: { step: 1 },
			input: o ? { endAdornment: /* @__PURE__ */ z(yn, {
				position: "end",
				sx: {
					mr: 0,
					"& .MuiTypography-root": {
						fontSize: "0.7rem",
						color: "text.secondary"
					}
				},
				children: "°"
			}) } : void 0
		},
		sx: Tl
	});
};
function Al({ uuid: e, event: t }) {
	let [n, r] = ml(!0);
	return /* @__PURE__ */ B(V, {
		sx: yl,
		children: [/* @__PURE__ */ B(V, {
			sx: bl,
			onClick: r,
			children: [z(n ? kn : An, { sx: {
				fontSize: 16,
				color: "text.secondary"
			} }), /* @__PURE__ */ z(H, {
				sx: xl,
				children: "Transform"
			})]
		}), /* @__PURE__ */ z(Jn, {
			in: n,
			children: /* @__PURE__ */ B(V, {
				component: "table",
				sx: Sl,
				children: [/* @__PURE__ */ z(V, {
					component: "thead",
					children: /* @__PURE__ */ B(V, {
						component: "tr",
						sx: Cl,
						children: [
							/* @__PURE__ */ z(V, { component: "th" }),
							/* @__PURE__ */ z(V, {
								component: "th",
								children: "X"
							}),
							/* @__PURE__ */ z(V, {
								component: "th",
								children: "Y"
							}),
							/* @__PURE__ */ z(V, {
								component: "th",
								children: "Z"
							})
						]
					})
				}), /* @__PURE__ */ B(V, {
					component: "tbody",
					children: [
						/* @__PURE__ */ B(V, {
							component: "tr",
							sx: wl,
							children: [
								/* @__PURE__ */ z(V, {
									component: "td",
									children: "Position"
								}),
								/* @__PURE__ */ z(V, {
									component: "td",
									children: /* @__PURE__ */ z(kl, {
										uuid: e,
										property: "x",
										event: t
									})
								}),
								/* @__PURE__ */ z(V, {
									component: "td",
									children: /* @__PURE__ */ z(kl, {
										uuid: e,
										property: "y",
										event: t
									})
								}),
								/* @__PURE__ */ z(V, {
									component: "td",
									children: /* @__PURE__ */ z(kl, {
										uuid: e,
										property: "z",
										event: t
									})
								})
							]
						}),
						/* @__PURE__ */ B(V, {
							component: "tr",
							sx: wl,
							children: [
								/* @__PURE__ */ z(V, {
									component: "td",
									children: "Scale"
								}),
								/* @__PURE__ */ z(V, {
									component: "td",
									children: /* @__PURE__ */ z(kl, {
										uuid: e,
										property: "scalex",
										event: t
									})
								}),
								/* @__PURE__ */ z(V, {
									component: "td",
									children: /* @__PURE__ */ z(kl, {
										uuid: e,
										property: "scaley",
										event: t
									})
								}),
								/* @__PURE__ */ z(V, {
									component: "td",
									children: /* @__PURE__ */ z(kl, {
										uuid: e,
										property: "scalez",
										event: t
									})
								})
							]
						}),
						/* @__PURE__ */ B(V, {
							component: "tr",
							sx: wl,
							children: [
								/* @__PURE__ */ z(V, {
									component: "td",
									children: "Rotation"
								}),
								/* @__PURE__ */ z(V, {
									component: "td",
									children: /* @__PURE__ */ z(kl, {
										uuid: e,
										property: "rotationx",
										event: t
									})
								}),
								/* @__PURE__ */ z(V, {
									component: "td",
									children: /* @__PURE__ */ z(kl, {
										uuid: e,
										property: "rotationy",
										event: t
									})
								}),
								/* @__PURE__ */ z(V, {
									component: "td",
									children: /* @__PURE__ */ z(kl, {
										uuid: e,
										property: "rotationz",
										event: t
									})
								})
							]
						})
					]
				})]
			})
		})]
	});
}
// src/components/parameter-config/SourceTab.tsx
var { PropertyNumberInput: jl, PropertySelect: Ml } = pl("SOURCE_SET_PROPERTY"), Nl = ({ uuid: e }) => /* @__PURE__ */ z(Al, {
	uuid: e,
	event: "SOURCE_SET_PROPERTY"
}), Pl = ({ uuid: e }) => {
	let [t, n] = ml(!0);
	return /* @__PURE__ */ B(Wc, {
		label: "Configuration",
		open: t,
		onOpenClose: n,
		children: [/* @__PURE__ */ z(jl, {
			uuid: e,
			label: "θ Theta",
			property: "theta",
			tooltip: "Sets theta"
		}), /* @__PURE__ */ z(jl, {
			uuid: e,
			label: "φ Phi",
			property: "phi",
			tooltip: "Sets phi"
		})]
	});
}, Fl = ({ uuid: e }) => {
	let [t, n] = ml(!0);
	return /* @__PURE__ */ B(Wc, {
		label: "FDTD Config",
		open: t,
		onOpenClose: n,
		children: [
			/* @__PURE__ */ z(Ml, {
				uuid: e,
				label: "Signal Source",
				tooltip: "The source thats generating it's signal",
				property: "signalSource",
				options: Vr
			}),
			/* @__PURE__ */ z(jl, {
				uuid: e,
				label: "Frequency",
				property: "frequency",
				tooltip: "The source's frequency"
			}),
			/* @__PURE__ */ z(jl, {
				uuid: e,
				label: "Amplitude",
				property: "amplitude",
				tooltip: "The source's amplitude"
			}),
			/* @__PURE__ */ z(vl, {
				label: "Signal Data",
				tooltip: "The source's signal data",
				event: "SOURCE_CALL_METHOD",
				args: {
					uuid: e,
					method: "saveSamples"
				}
			})
		]
	});
}, Il = ({ uuid: e }) => /* @__PURE__ */ B("div", { children: [
	/* @__PURE__ */ z(Nl, { uuid: e }),
	/* @__PURE__ */ z(vl, {
		label: "First Person View",
		tooltip: "Look through this source and adjust its orientation",
		event: "ENTER_FIRST_PERSON",
		args: { uuid: e }
	}),
	/* @__PURE__ */ z(Pl, { uuid: e }),
	/* @__PURE__ */ z(Fl, { uuid: e })
] }), { PropertySelect: Ll } = pl("RECEIVER_SET_PROPERTY"), Rl = [
	{
		value: Gr.OMNIDIRECTIONAL,
		label: "Omnidirectional"
	},
	{
		value: Gr.CARDIOID,
		label: "Cardioid"
	},
	{
		value: Gr.SUPERCARDIOID,
		label: "Supercardioid"
	},
	{
		value: Gr.FIGURE_EIGHT,
		label: "Figure-8"
	}
], zl = ({ uuid: e }) => /* @__PURE__ */ z(Al, {
	uuid: e,
	event: "RECEIVER_SET_PROPERTY"
}), Bl = ({ uuid: e }) => {
	let [t, n] = ml(!0);
	return /* @__PURE__ */ z(Wc, {
		label: "Directivity",
		open: t,
		onOpenClose: n,
		children: /* @__PURE__ */ z(Ll, {
			uuid: e,
			label: "Pattern",
			property: "directivityPattern",
			tooltip: "Receiver directivity pattern for microphone modeling",
			options: Rl
		})
	});
}, Vl = ({ uuid: e }) => /* @__PURE__ */ B("div", { children: [
	/* @__PURE__ */ z(zl, { uuid: e }),
	/* @__PURE__ */ z(vl, {
		label: "First Person View",
		tooltip: "Look through this receiver and adjust its orientation",
		event: "ENTER_FIRST_PERSON",
		args: { uuid: e }
	}),
	/* @__PURE__ */ z(Bl, { uuid: e })
] }), Hl = ({ uuid: e }) => /* @__PURE__ */ z(Al, {
	uuid: e,
	event: "ROOM_SET_PROPERTY"
}), Ul = ({ uuid: e }) => {
	let [t, n] = ml(!0), [r, i] = ul(e, "temperature", "ROOM_SET_PROPERTY"), [a, o] = ul(e, "humidity", "ROOM_SET_PROPERTY");
	return /* @__PURE__ */ B(Wc, {
		label: "Environment",
		open: t,
		onOpenClose: n,
		children: [/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Temperature",
			hasToolTip: !0,
			tooltip: "Temperature in Celsius (affects speed of sound and air absorption)"
		}), /* @__PURE__ */ z(il, {
			value: r,
			onChange: i,
			step: 1,
			min: -20,
			max: 50
		})] }), /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Humidity",
			hasToolTip: !0,
			tooltip: "Relative humidity in % (affects air absorption)"
		}), /* @__PURE__ */ z(il, {
			value: a,
			onChange: o,
			step: 1,
			min: 5,
			max: 95
		})] })]
	});
}, Wl = ({ uuid: e }) => /* @__PURE__ */ B("div", { children: [/* @__PURE__ */ z(Hl, { uuid: e }), /* @__PURE__ */ z(Ul, { uuid: e })] }), { PropertyNumberInput: Gl, PropertyCheckboxInput: Kl } = pl("SURFACE_SET_PROPERTY"), ql = ({ uuid: e }) => {
	let [t, n] = ul(e, "isTessellated", "SURFACE_SET_PROPERTY");
	return t ? /* @__PURE__ */ z(Kl, {
		uuid: e,
		label: "Tessellation",
		property: "tessellatedMeshVisible",
		tooltip: "Shows/hides the tessellation of this surface"
	}) : null;
}, Jl = ({ uuid: e }) => {
	let [t, n] = ml(!0);
	return /* @__PURE__ */ B(Wc, {
		label: "Visual",
		open: t,
		onOpenClose: n,
		children: [
			/* @__PURE__ */ z(Kl, {
				uuid: e,
				label: "Wireframe",
				property: "wireframeVisible",
				tooltip: "Shows/hides the wireframe of this surface"
			}),
			/* @__PURE__ */ z(ql, { uuid: e }),
			/* @__PURE__ */ z(Kl, {
				uuid: e,
				label: "Vertex Normals",
				property: "displayVertexNormals",
				tooltip: "Shows/hides the vertex normals of this surface"
			})
		]
	});
}, Yl = ({ uuid: e }) => /* @__PURE__ */ z(Al, {
	uuid: e,
	event: "SURFACE_SET_PROPERTY"
}), Xl = ({ uuid: e }) => {
	let t = O((t) => t.containers[e].acousticMaterial.name), [, r] = Ut((e) => e + 1, 0);
	return N(() => n("ASSIGN_MATERIAL", ({ target: t }) => {
		p(t).reduce((t, n) => t || n.uuid === e, !1) && r();
	}), [e]), /* @__PURE__ */ z(vl, {
		label: "Material",
		buttonLabel: t,
		event: "OPEN_MATERIAL_DRAWER",
		args: void 0,
		tooltip: "Opens the material search screen"
	});
}, Zl = ({ uuid: e }) => {
	let [t, n] = ml(!0);
	return /* @__PURE__ */ z(Wc, {
		label: "Material",
		open: t,
		onOpenClose: n,
		children: /* @__PURE__ */ z(Xl, { uuid: e })
	});
}, Ql = ({ uuid: e }) => {
	let [t, n] = ml(!0);
	return /* @__PURE__ */ z(Wc, {
		label: "Scattering",
		open: t,
		onOpenClose: n,
		children: /* @__PURE__ */ z(Gl, {
			uuid: e,
			label: "Scattering Coefficient",
			tooltip: "Sets this surface's scattering coefficient",
			property: "scatteringCoefficient"
		})
	});
}, $l = ({ uuid: e }) => /* @__PURE__ */ B("div", { children: [
	/* @__PURE__ */ z(Jl, { uuid: e }),
	/* @__PURE__ */ z(Yl, { uuid: e }),
	/* @__PURE__ */ z(Zl, { uuid: e }),
	/* @__PURE__ */ z(Ql, { uuid: e })
] }), eu = {
	height: "100%",
	overflow: "auto",
	bgcolor: "background.paper"
}, tu = {
	py: .25,
	px: 1,
	"&.Mui-selected": {
		bgcolor: "primary.light",
		"&:hover": { bgcolor: "primary.light" }
	}
}, nu = {
	py: .5,
	px: 1.5,
	bgcolor: "background.default",
	borderBottom: 1,
	borderColor: "divider"
}, ru = {
	py: 3,
	px: 2,
	textAlign: "center"
}, iu = {
	p: 1,
	"& > *": { mb: .5 }
}, au = {
	room: /* @__PURE__ */ z(Un, { fontSize: "small" }),
	source: /* @__PURE__ */ z(Wn, { fontSize: "small" }),
	receiver: /* @__PURE__ */ z(Gn, { fontSize: "small" }),
	surface: /* @__PURE__ */ z(Kn, { fontSize: "small" })
};
function ou({ uuid: e, name: t, type: n, visible: r, selected: i, onSelect: a, onToggleVisibility: o, onDelete: s, onHover: c, onUnhover: l }) {
	return /* @__PURE__ */ z(Ln, {
		disablePadding: !0,
		sx: tu,
		onMouseEnter: c,
		onMouseLeave: l,
		secondaryAction: /* @__PURE__ */ B(V, {
			sx: {
				display: "flex",
				gap: .25
			},
			children: [/* @__PURE__ */ z(hn, {
				size: "small",
				onClick: o,
				sx: { p: .25 },
				children: z(r ? Bn : Vn, { sx: { fontSize: 16 } })
			}), /* @__PURE__ */ z(hn, {
				size: "small",
				onClick: s,
				sx: { p: .25 },
				children: /* @__PURE__ */ z(Hn, { sx: { fontSize: 16 } })
			})]
		}),
		children: /* @__PURE__ */ B(Sn, {
			onClick: a,
			selected: i,
			dense: !0,
			sx: { py: .25 },
			children: [/* @__PURE__ */ z(Rn, {
				sx: { minWidth: 28 },
				children: au[n] || /* @__PURE__ */ z(qn, { fontSize: "small" })
			}), /* @__PURE__ */ z(zn, {
				primary: t,
				slotProps: { primary: {
					noWrap: !0,
					sx: { fontSize: "0.75rem" }
				} }
			})]
		})
	});
}
function su() {
	let [t, n] = I(null), { containers: r, version: i } = O(j((e) => ({
		containers: e.containers,
		version: e.version
	}))), o = P(() => {
		let e = {
			rooms: [],
			sources: [],
			receivers: [],
			surfaces: []
		};
		return Object.keys(r).forEach((t) => {
			let n = r[t], i = {
				uuid: t,
				name: n.name || t.slice(0, 8),
				visible: n.visible !== !1
			};
			switch (n.kind) {
				case "room":
					e.rooms.push(i);
					break;
				case "source":
					e.sources.push(i);
					break;
				case "receiver":
					e.receivers.push(i);
					break;
				case "surface": e.surfaces.push(i);
			}
		}), e;
	}, [r, i]), s = o.rooms.length + o.sources.length + o.receivers.length + o.surfaces.length, c = M((t) => {
		n(t), e("SELECT_OBJECT", t);
		let i = r[t];
		i && a("SET_SELECTION", [i]);
	}, [r]), l = M((e) => {
		a("TOGGLE_CONTAINER_VISIBLE", e);
	}, []), u = M((e) => {
		a("REMOVE_CONTAINERS", e), t === e && n(null);
	}, [t]), d = M((e) => {
		a("SURFACE_HOVER", e);
	}, []), f = M((e) => {
		a("SURFACE_UNHOVER", e);
	}, []), p = t ? r[t] : null, m = () => {
		if (!p) return null;
		switch (p.kind) {
			case "source": return /* @__PURE__ */ z(Il, { uuid: t });
			case "receiver": return /* @__PURE__ */ z(Vl, { uuid: t });
			case "room": return /* @__PURE__ */ z(Wl, { uuid: t });
			case "surface": return /* @__PURE__ */ z($l, { uuid: t });
			default: return /* @__PURE__ */ z(H, {
				variant: "body2",
				color: "text.secondary",
				children: "Unknown object type"
			});
		}
	}, h = (e, n, r, i = !1) => n.length === 0 ? null : /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z(Ln, {
		sx: nu,
		children: /* @__PURE__ */ B(H, {
			variant: "caption",
			color: "text.secondary",
			sx: { fontWeight: 600 },
			children: [
				e,
				" (",
				n.length,
				")"
			]
		})
	}), n.map((e) => /* @__PURE__ */ z(ou, {
		uuid: e.uuid,
		name: e.name,
		type: r,
		visible: e.visible,
		selected: t === e.uuid,
		onSelect: () => c(e.uuid),
		onToggleVisibility: () => l(e.uuid),
		onDelete: () => u(e.uuid),
		onHover: i ? () => d(e.uuid) : void 0,
		onUnhover: i ? () => f(e.uuid) : void 0
	}, e.uuid))] });
	return /* @__PURE__ */ B(V, {
		sx: eu,
		children: [s === 0 ? /* @__PURE__ */ z(V, {
			sx: ru,
			children: /* @__PURE__ */ z(H, {
				variant: "body2",
				color: "text.secondary",
				sx: { fontSize: "0.75rem" },
				children: "No objects. Import a model or add from menu."
			})
		}) : /* @__PURE__ */ B(xn, {
			dense: !0,
			disablePadding: !0,
			children: [
				h("ROOMS", o.rooms, "room"),
				h("SOURCES", o.sources, "source"),
				h("RECEIVERS", o.receivers, "receiver"),
				h("SURFACES", o.surfaces, "surface", !0)
			]
		}), p && /* @__PURE__ */ B(R, { children: [
			/* @__PURE__ */ z(mn, {}),
			/* @__PURE__ */ z(V, {
				sx: {
					px: 1.5,
					py: .5,
					bgcolor: "action.hover"
				},
				children: /* @__PURE__ */ B(H, {
					variant: "subtitle2",
					sx: {
						fontWeight: 600,
						fontSize: "0.75rem"
					},
					children: [p.name || p.kind, " Properties"]
				})
			}),
			/* @__PURE__ */ z(V, {
				sx: iu,
				children: m()
			})
		] })]
	});
}
// src/components/parameter-config/SolverComponents.tsx
function X(e, t, n) {
	return [f((n) => (n.version, n.solvers[e]?.[t])), (r) => a(n, {
		uuid: e,
		property: t,
		value: r.value
	})];
}
var cu = (e, t) => ({ uuid: n, property: r, label: i, tooltip: a, elementProps: o }) => {
	let [s, c] = X(n, r, e);
	return /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
		label: i,
		hasToolTip: !0,
		tooltip: a
	}), /* @__PURE__ */ z(t, {
		value: s,
		onChange: c,
		...o
	})] });
}, lu = (e) => ({
	PropertyTextInput: cu(e, el),
	PropertyNumberInput: cu(e, il),
	PropertyCheckboxInput: cu(e, Qc)
}), uu = ({ args: e, event: t, label: n, tooltip: r, disabled: i }) => /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
	label: n,
	hasToolTip: !0,
	tooltip: r
}), /* @__PURE__ */ z(_l, {
	onClick: (n) => a(t, e),
	label: n,
	disabled: i
})] }), du = (e) => ({
	p: "4px 8px",
	overflowX: "auto",
	opacity: e ? .5 : 1,
	pointerEvents: e ? "none" : "auto"
}), fu = {
	width: "100%",
	borderCollapse: "collapse",
	fontSize: 11,
	"& th, & td": {
		p: "4px 6px",
		transition: "background-color 0.1s"
	}
}, pu = {
	textAlign: "center",
	fontWeight: 500,
	color: "text.primary",
	borderBottom: "1px solid",
	borderColor: "divider",
	whiteSpace: "nowrap",
	maxWidth: 80,
	overflow: "hidden",
	textOverflow: "ellipsis"
}, mu = {
	fontWeight: 500,
	color: "text.primary",
	borderRight: "1px solid",
	borderColor: "divider",
	whiteSpace: "nowrap",
	maxWidth: 80,
	overflow: "hidden",
	textOverflow: "ellipsis"
}, hu = {
	textAlign: "center",
	cursor: "pointer",
	userSelect: "none",
	borderBottom: "1px solid",
	borderColor: "action.hover"
}, gu = { bgcolor: "action.hover" }, _u = {
	textAlign: "right",
	fontWeight: 400,
	fontSize: 10,
	color: "text.disabled",
	borderBottom: "1px solid",
	borderRight: "1px solid",
	borderColor: "divider"
}, vu = {
	p: "12px 8px",
	fontSize: 11,
	color: "text.disabled",
	fontStyle: "italic",
	textAlign: "center"
}, yu = {
	fontSize: 14,
	fontWeight: 700,
	color: "primary.main",
	lineHeight: 1
}, bu = {
	fontSize: 14,
	fontWeight: 400,
	color: "text.disabled",
	lineHeight: 1
}, xu = Vt(({ uuid: e, disabled: t = !1, eventType: n = "RAYTRACER_SET_PROPERTY" }) => {
	let r = O((e) => e.containers), i = O((e) => e.version), [a, o] = I(null), s = P(() => Object.values(r).filter((e) => e.kind === "source").map((e) => ({
		uuid: e.uuid,
		name: e.name
	})), [r, i]), c = P(() => Object.values(r).filter((e) => e.kind === "receiver").map((e) => ({
		uuid: e.uuid,
		name: e.name
	})), [r, i]), [l, u] = X(e, "sourceIDs", n), [d, f] = X(e, "receiverIDs", n), p = P(() => l || [], [l]), m = P(() => d || [], [d]), h = s.length > 0 && c.length > 0 && (p.length === 0 || m.length === 0), g = M((e, t) => p.includes(e) && m.includes(t), [p, m]), _ = M((e, t) => {
		if (p.includes(e) && m.includes(t)) m.length === 1 && u({ value: p.filter((t) => t !== e) }), p.length === 1 && f({ value: m.filter((e) => e !== t) });
		else {
			let n = p.includes(e) ? p : [...p, e], r = m.includes(t) ? m : [...m, t];
			n !== p && u({ value: n }), r !== m && f({ value: r });
		}
	}, [
		p,
		m,
		u,
		f
	]);
	return s.length === 0 && c.length === 0 ? /* @__PURE__ */ z(H, {
		sx: vu,
		children: "Add sources and receivers to configure pairs"
	}) : s.length === 0 ? /* @__PURE__ */ z(H, {
		sx: vu,
		children: "Add sources to configure pairs"
	}) : c.length === 0 ? /* @__PURE__ */ z(H, {
		sx: vu,
		children: "Add receivers to configure pairs"
	}) : /* @__PURE__ */ z(V, {
		sx: {
			...du(t),
			...h && {
				bgcolor: "rgba(244,67,54,0.08)",
				borderRadius: 1
			}
		},
		children: /* @__PURE__ */ B(V, {
			component: "table",
			sx: fu,
			onMouseLeave: () => o(null),
			children: [/* @__PURE__ */ z("thead", { children: /* @__PURE__ */ B("tr", { children: [/* @__PURE__ */ z(V, {
				component: "th",
				sx: _u,
				children: "Src \\ Rec"
			}), c.map((e, t) => /* @__PURE__ */ z(V, {
				component: "th",
				sx: a && a.col === t ? {
					...pu,
					...gu
				} : pu,
				title: e.name,
				children: e.name
			}, e.uuid))] }) }), /* @__PURE__ */ z("tbody", { children: s.map((e, t) => /* @__PURE__ */ B("tr", { children: [/* @__PURE__ */ z(V, {
				component: "td",
				sx: a && a.row === t ? {
					...mu,
					...gu
				} : mu,
				title: e.name,
				children: e.name
			}), c.map((n, r) => {
				let i = g(e.uuid, n.uuid), s = a && (a.row === t || a.col === r);
				return /* @__PURE__ */ z(V, {
					component: "td",
					sx: s ? {
						...hu,
						...gu
					} : hu,
					onClick: () => _(e.uuid, n.uuid),
					onMouseEnter: () => o({
						row: t,
						col: r
					}),
					title: `${e.name} \u2192 ${n.name}`,
					children: /* @__PURE__ */ z(H, {
						component: "span",
						sx: i ? yu : bu,
						children: i ? "✓" : "·"
					})
				}, `${e.uuid}-${n.uuid}`);
			})] }, e.uuid)) })]
		})
	});
}), Su = { bgcolor: "background.paper" }, Cu = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center"
}, wu = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
	gap: 1.5,
	py: 1
}, Tu = (e) => ({
	border: 2,
	borderColor: e ? "primary.main" : "divider",
	borderRadius: 2,
	p: 1,
	cursor: "pointer",
	bgcolor: e ? "action.selected" : "background.paper",
	transition: "all 0.15s",
	"&:hover": { borderColor: e ? "primary.main" : "text.secondary" }
}), Eu = {
	display: "flex",
	gap: .5,
	justifyContent: "center",
	mb: .75
}, Du = {
	width: 80,
	height: 100,
	objectFit: "cover",
	borderRadius: 4
}, Ou = ({ open: e, onClose: t, selectedId: n, onSelect: r }) => {
	let [i, a] = I([]), [o, s] = I("");
	return N(() => {
		e && xe().then(a).catch((e) => s(e.message));
	}, [e]), /* @__PURE__ */ B(Wt, {
		open: e,
		onClose: t,
		maxWidth: "md",
		fullWidth: !0,
		slotProps: { paper: { sx: Su } },
		children: [/* @__PURE__ */ B(qt, {
			sx: Cu,
			children: ["Select HRTF Subject", /* @__PURE__ */ z(Yt, {
				onClick: t,
				size: "small",
				"aria-label": "close",
				children: "✕"
			})]
		}), /* @__PURE__ */ B(Kt, { children: [o && /* @__PURE__ */ z("div", {
			style: {
				color: "red",
				marginBottom: 8
			},
			children: o
		}), /* @__PURE__ */ z(V, {
			sx: wu,
			children: i.map((e) => /* @__PURE__ */ B(V, {
				onClick: () => {
					r(e.id), t();
				},
				sx: Tu(e.id === n),
				children: [
					/* @__PURE__ */ B(V, {
						sx: Eu,
						children: [e.thumbnailLeft && /* @__PURE__ */ z("img", {
							src: be(e.thumbnailLeft),
							alt: `${e.id} left ear`,
							style: Du
						}), e.thumbnailRight && /* @__PURE__ */ z("img", {
							src: be(e.thumbnailRight),
							alt: `${e.id} right ear`,
							style: Du
						})]
					}),
					/* @__PURE__ */ z(V, {
						sx: {
							fontWeight: 600,
							fontSize: 12,
							textAlign: "center"
						},
						children: e.name
					}),
					/* @__PURE__ */ z(V, {
						sx: {
							fontSize: 11,
							color: "text.secondary",
							textAlign: "center"
						},
						children: e.description
					})
				]
			}, e.id))
		})] })]
	});
}, ku = {
	display: "flex",
	gap: .5,
	px: .5,
	py: .5,
	borderBottom: "1px solid",
	borderColor: "divider"
}, Au = {
	flex: 1,
	minWidth: 0,
	py: .25,
	fontSize: "0.7rem",
	textTransform: "none"
};
function ju({ onPlayPause: e, onStop: t, onReset: n, isRunning: r = !1, canRun: i = !0, hasResults: a = !1 }) {
	return /* @__PURE__ */ B(V, {
		sx: ku,
		children: [
			e && /* @__PURE__ */ z(Yn, {
				title: r ? "Pause simulation" : "Start simulation",
				placement: "top",
				children: /* @__PURE__ */ z("span", {
					style: {
						flex: 1,
						display: "flex"
					},
					children: /* @__PURE__ */ z(un, {
						variant: r ? "contained" : "outlined",
						size: "small",
						sx: Au,
						onClick: e,
						disabled: !i,
						startIcon: z(r ? rr : $n, { sx: { fontSize: 16 } }),
						children: r ? "Pause" : "Run"
					})
				})
			}),
			t && /* @__PURE__ */ z(Yn, {
				title: "Stop and discard in-progress pass",
				placement: "top",
				children: /* @__PURE__ */ z("span", {
					style: {
						flex: 1,
						display: "flex"
					},
					children: /* @__PURE__ */ z(un, {
						variant: "outlined",
						size: "small",
						sx: Au,
						onClick: t,
						disabled: !r,
						startIcon: /* @__PURE__ */ z(ir, { sx: { fontSize: 16 } }),
						children: "Stop"
					})
				})
			}),
			n && /* @__PURE__ */ z(Yn, {
				title: "Clear all traced rays and results",
				placement: "top",
				children: /* @__PURE__ */ z("span", {
					style: {
						flex: 1,
						display: "flex"
					},
					children: /* @__PURE__ */ z(un, {
						variant: "outlined",
						size: "small",
						sx: Au,
						onClick: n,
						disabled: !a || r,
						startIcon: /* @__PURE__ */ z(ar, { sx: { fontSize: 16 } }),
						children: "Reset"
					})
				})
			})
		]
	});
}
// src/components/parameter-config/property-row/SectionLabel.tsx
var Mu = {
	py: .5,
	borderBottom: "1px solid",
	borderColor: "divider"
}, Nu = {
	fontSize: "0.75rem",
	fontWeight: 500,
	color: "text.secondary",
	pl: "4px"
};
function Z({ label: e }) {
	return /* @__PURE__ */ z(V, {
		sx: Mu,
		children: /* @__PURE__ */ z(H, {
			sx: Nu,
			children: e
		})
	});
}
// src/components/parameter-config/RayTracerTab.tsx
var { PropertyTextInput: Pu, PropertyNumberInput: Fu, PropertyCheckboxInput: Iu } = lu("RAYTRACER_SET_PROPERTY"), Lu = {
	width: "100%",
	"& .MuiToggleButton-root": {
		flex: 1,
		py: .25,
		fontSize: "0.7rem",
		textTransform: "none",
		fontWeight: 500
	}
}, Ru = {
	px: .5,
	py: .5
}, zu = {
	display: "flex",
	alignItems: "center",
	gap: .25,
	flex: 1
}, Bu = {
	fontSize: "0.6rem",
	color: "text.disabled",
	minWidth: 10,
	textAlign: "center"
}, Vu = [
	"125",
	"250",
	"500",
	"1k",
	"2k",
	"4k",
	"8k"
], Hu = {
	display: "grid",
	gridTemplateColumns: "repeat(7, 1fr)",
	gap: 0,
	px: .5,
	mb: .5
}, Uu = {
	fontSize: "0.6rem",
	color: "text.disabled",
	textAlign: "center",
	pb: .25
}, Wu = {
	fontSize: "0.7rem",
	fontFamily: "monospace",
	color: "text.primary",
	textAlign: "center"
}, Gu = ({ uuid: e }) => {
	let [t] = X(e, "isRunning", "RAYTRACER_SET_PROPERTY"), [n] = X(e, "validRayCount", "RAYTRACER_SET_PROPERTY"), [r] = X(e, "gpuEnabled", "RAYTRACER_SET_PROPERTY"), [i] = X(e, "runningWithoutReceivers", "RAYTRACER_SET_PROPERTY"), [o] = X(e, "impulseResponsePlaying", "RAYTRACER_SET_PROPERTY"), [s] = X(e, "binauralPlaying", "RAYTRACER_SET_PROPERTY"), [c] = X(e, "hrtfSubjectId", "RAYTRACER_SET_PROPERTY"), [l] = X(e, "convergenceMetrics", "RAYTRACER_SET_PROPERTY"), [u, d] = X(e, "headYaw", "RAYTRACER_SET_PROPERTY"), [f, p] = X(e, "headPitch", "RAYTRACER_SET_PROPERTY"), [m, h] = X(e, "headRoll", "RAYTRACER_SET_PROPERTY"), g = P(() => Se(), []), [_, v] = I("1"), [y, b] = I("1"), [x, S] = I(!1), [C, w] = I("");
	N(() => {
		let e = c || "D1";
		xe().then((t) => {
			let n = t.find((t) => t.id === e);
			w(n ? n.name : e);
		}).catch(() => w(e));
	}, [c]);
	let ee = !!n && n > 0, E = !r, te = l && Number.isFinite(l.convergenceRatio) ? (l.convergenceRatio * 100).toFixed(1) + "%" : "--", D = l?.estimatedT30 ? l.estimatedT30.map((e) => e > 0 ? e.toFixed(2) : "--") : null, ne = M(() => {
		a("RAYTRACER_SET_PROPERTY", {
			uuid: e,
			property: "isRunning",
			value: !t
		});
	}, [e, t]), re = M(() => {
		a("RAYTRACER_SET_PROPERTY", {
			uuid: e,
			property: "isRunning",
			value: !1
		});
	}, [e]), ie = M(() => {
		a("RAYTRACER_CLEAR_RAYS", e);
	}, [e]), ae = M((t, n) => {
		n !== null && a("RAYTRACER_SET_PROPERTY", {
			uuid: e,
			property: "gpuEnabled",
			value: n === "gpu"
		});
	}, [e]), oe = M(() => {
		a("RAYTRACER_DOWNLOAD_AMBISONIC_IR", {
			uuid: e,
			order: parseInt(_)
		});
	}, [e, _]), se = M(() => {
		a("RAYTRACER_PLAY_BINAURAL_IR", {
			uuid: e,
			order: parseInt(y)
		});
	}, [e, y]), ce = M(() => {
		a("RAYTRACER_DOWNLOAD_BINAURAL_IR", {
			uuid: e,
			order: parseInt(y)
		});
	}, [e, y]), le = M((t) => {
		a("RAYTRACER_SET_PROPERTY", {
			uuid: e,
			property: "hrtfSubjectId",
			value: t
		}), a("RAYTRACER_SET_PROPERTY", {
			uuid: e,
			property: "binauralImpulseResponse",
			value: void 0
		});
	}, [e]);
	return N(() => {
		let t = T.overlays.global.cells, n = e + "-valid-ray-count";
		return t.has(n) && t.get(n).show(), () => {
			t.has(n) && t.get(n).hide();
		};
	}, [e]), /* @__PURE__ */ B("div", { children: [
		/* @__PURE__ */ z(ju, {
			onPlayPause: ne,
			onStop: re,
			onReset: ie,
			isRunning: !!t,
			canRun: !0,
			hasResults: ee
		}),
		/* @__PURE__ */ z(V, {
			sx: Ru,
			children: /* @__PURE__ */ B(nr, {
				value: r && g ? "gpu" : "cpu",
				exclusive: !0,
				onChange: ae,
				size: "small",
				sx: Lu,
				children: [/* @__PURE__ */ z(tr, {
					value: "cpu",
					children: "CPU"
				}), /* @__PURE__ */ z(Yn, {
					title: g ? "" : "WebGPU is not supported in this browser",
					placement: "top",
					children: /* @__PURE__ */ z("span", {
						style: {
							flex: 1,
							display: "flex"
						},
						children: /* @__PURE__ */ z(tr, {
							value: "gpu",
							disabled: !g,
							sx: { flex: 1 },
							children: "GPU"
						})
					})
				})]
			})
		}),
		/* @__PURE__ */ z(Z, { label: "Source / Receiver Pairs" }),
		/* @__PURE__ */ z(Iu, {
			uuid: e,
			label: "Ignore Receivers",
			property: "runningWithoutReceivers",
			tooltip: "Run rays without checking receiver intersections — useful for visualization-only mode"
		}),
		/* @__PURE__ */ z(xu, {
			uuid: e,
			disabled: i
		}),
		/* @__PURE__ */ z(Z, { label: "Parameters" }),
		/* @__PURE__ */ z(Fu, {
			uuid: e,
			label: "Order",
			property: "reflectionOrder",
			tooltip: "Maximum number of specular reflections each ray can undergo before termination"
		}),
		/* @__PURE__ */ z(Fu, {
			uuid: e,
			label: "Max Paths",
			property: "maxStoredPaths",
			tooltip: "Maximum valid paths stored per source-receiver pair. Oldest paths are evicted when the buffer is full.",
			elementProps: {
				step: 1e3,
				min: 1
			}
		}),
		/* @__PURE__ */ z(Iu, {
			uuid: e,
			label: "Edge Diffraction",
			property: "edgeDiffractionEnabled",
			tooltip: "Uniform Theory of Diffraction (UTD) — models sound bending around convex edges using Keller's geometrical theory, adding diffracted contributions at each wedge."
		}),
		E && /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z(Fu, {
			uuid: e,
			label: "Rate (ms)",
			property: "updateInterval",
			tooltip: "Interval between ray-tracing callbacks in milliseconds. Lower values give faster visual feedback but use more CPU."
		}), /* @__PURE__ */ z(Fu, {
			uuid: e,
			label: "Passes",
			property: "passes",
			tooltip: "Number of rays launched per callback interval. Higher values improve convergence speed at the cost of UI responsiveness."
		})] }),
		!E && /* @__PURE__ */ z(Fu, {
			uuid: e,
			label: "Batch Size",
			property: "gpuBatchSize",
			tooltip: "Number of rays dispatched per WebGPU compute pass. Larger batches improve throughput but increase per-frame latency.",
			elementProps: {
				step: 1e3,
				min: 1e3,
				max: 5e4
			}
		}),
		/* @__PURE__ */ z(Iu, {
			uuid: e,
			label: "Hybrid Method",
			property: "hybrid",
			tooltip: "Combines deterministic image-source calculation for early reflections with stochastic ray tracing for late reflections, improving accuracy at low orders."
		}),
		/* @__PURE__ */ z(Pu, {
			uuid: e,
			label: "Transition Order",
			property: "transitionOrder",
			tooltip: "Reflection order at which the solver switches from image-source to ray tracing in hybrid mode"
		}),
		/* @__PURE__ */ z(Iu, {
			uuid: e,
			label: "Late Reverb Tail",
			property: "lateReverbTailEnabled",
			tooltip: "Synthesize a stochastic noise tail to extend the impulse response beyond the ray-traced data, using energy decay parameters estimated from the simulation."
		}),
		/* @__PURE__ */ z(Fu, {
			uuid: e,
			label: "Crossfade Time (s)",
			property: "tailCrossfadeTime",
			tooltip: "Time (seconds) at which the crossfade from ray-traced to synthetic tail begins. Set to 0 for automatic detection based on energy curve.",
			elementProps: {
				step: .1,
				min: 0,
				max: 5
			}
		}),
		/* @__PURE__ */ z(Fu, {
			uuid: e,
			label: "Crossfade Dur. (s)",
			property: "tailCrossfadeDuration",
			tooltip: "Duration of the Hann-windowed crossfade between ray-traced and synthetic tail regions",
			elementProps: {
				step: .01,
				min: .01,
				max: .5
			}
		}),
		/* @__PURE__ */ z(Z, { label: "Convergence" }),
		/* @__PURE__ */ z(Iu, {
			uuid: e,
			label: "Auto-Stop",
			property: "autoStop",
			tooltip: "Automatically halt the simulation when the coefficient of variation of T30 estimates across octave bands falls below the threshold"
		}),
		/* @__PURE__ */ z(Fu, {
			uuid: e,
			label: "Threshold",
			property: "convergenceThreshold",
			tooltip: "Target coefficient of variation for T30 estimates across octave bands (125 Hz – 8 kHz). Lower values require more rays but yield more stable results.",
			elementProps: {
				step: .001,
				min: .001,
				max: 1
			}
		}),
		/* @__PURE__ */ z(Fu, {
			uuid: e,
			label: "RR Threshold",
			property: "rrThreshold",
			tooltip: "Russian Roulette termination threshold — rays with energy below this fraction of their initial energy are probabilistically terminated, keeping the estimator unbiased.",
			elementProps: {
				step: .01,
				min: .01,
				max: 1
			}
		}),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Conv. Ratio",
			hasToolTip: !0,
			tooltip: "Current maximum coefficient of variation of T30 across all octave bands — decreases toward the threshold as more rays are traced"
		}), /* @__PURE__ */ z(V, {
			sx: {
				fontSize: "0.75rem",
				fontFamily: "monospace",
				px: 1,
				color: "text.primary",
				textAlign: "center"
			},
			children: te
		})] }),
		/* @__PURE__ */ z(Z, { label: "Est. T30" }),
		/* @__PURE__ */ B(V, {
			sx: Hu,
			children: [Vu.map((e) => /* @__PURE__ */ z(V, {
				sx: Uu,
				children: e
			}, e)), D ? D.map((e, t) => /* @__PURE__ */ z(V, {
				sx: Wu,
				children: e
			}, t)) : Vu.map((e, t) => /* @__PURE__ */ z(V, {
				sx: Wu,
				children: "--"
			}, t))]
		}),
		/* @__PURE__ */ z(Z, { label: "Visualization" }),
		/* @__PURE__ */ z(Fu, {
			uuid: e,
			label: "Point Size",
			property: "pointSize",
			tooltip: "Radius in pixels of each surface intersection point rendered in the viewport"
		}),
		/* @__PURE__ */ z(Iu, {
			uuid: e,
			label: "Rays Visible",
			property: "raysVisible",
			tooltip: "Show or hide ray path lines in the 3D viewport"
		}),
		/* @__PURE__ */ z(Iu, {
			uuid: e,
			label: "Points Visible",
			property: "pointsVisible",
			tooltip: "Show or hide intersection points where rays hit surfaces"
		}),
		/* @__PURE__ */ z(Z, { label: "Impulse Response" }),
		/* @__PURE__ */ z(uu, {
			event: "RAYTRACER_PLAY_IR",
			args: e,
			label: "Play",
			tooltip: "Auralise the broadband impulse response through the default audio output",
			disabled: o
		}),
		/* @__PURE__ */ z(uu, {
			event: "RAYTRACER_DOWNLOAD_IR",
			args: e,
			label: "Download",
			tooltip: "Export the broadband impulse response as a mono WAV file"
		}),
		/* @__PURE__ */ z(uu, {
			event: "RAYTRACER_DOWNLOAD_IR_OCTAVE",
			args: e,
			label: "Download by Octave",
			tooltip: "Export separate WAV files for each octave-band filtered impulse response"
		}),
		/* @__PURE__ */ z(Z, { label: "Ambisonic Output" }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Order",
			hasToolTip: !0,
			tooltip: "Ambisonic order — 1st (4 ch FOA), 2nd (9 ch HOA), or 3rd (16 ch HOA). Higher orders capture finer spatial detail."
		}), /* @__PURE__ */ z(ll, {
			value: _,
			onChange: ({ value: e }) => v(e),
			options: [
				{
					value: "1",
					label: "1st Order (4 ch)"
				},
				{
					value: "2",
					label: "2nd Order (9 ch)"
				},
				{
					value: "3",
					label: "3rd Order (16 ch)"
				}
			]
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "",
			hasToolTip: !0,
			tooltip: "Download a multi-channel WAV in ACN channel order with N3D normalisation"
		}), /* @__PURE__ */ z(_l, {
			onClick: oe,
			label: "Download",
			disabled: !ee
		})] }),
		/* @__PURE__ */ z(Z, { label: "Binaural Output" }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Order",
			hasToolTip: !0,
			tooltip: "Ambisonic order used for binaural decoding via HRTF convolution"
		}), /* @__PURE__ */ z(ll, {
			value: y,
			onChange: ({ value: e }) => b(e),
			options: [
				{
					value: "1",
					label: "1st Order (4 ch)"
				},
				{
					value: "2",
					label: "2nd Order (9 ch)"
				},
				{
					value: "3",
					label: "3rd Order (16 ch)"
				}
			]
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "HRTF Subject",
			hasToolTip: !0,
			tooltip: "Head-Related Transfer Function dataset used for spatial audio rendering — different subjects have different ear geometries"
		}), /* @__PURE__ */ z(_l, {
			onClick: () => S(!0),
			label: C || c || "D1"
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Head Orientation",
			hasToolTip: !0,
			tooltip: "Listener head rotation in degrees — Yaw: horizontal (positive = left), Pitch: vertical (positive = up), Roll: tilt (positive = right ear down)"
		}), /* @__PURE__ */ B(V, {
			sx: zu,
			children: [
				/* @__PURE__ */ z(V, {
					component: "span",
					sx: Bu,
					children: "Y"
				}),
				/* @__PURE__ */ z(il, {
					value: u ?? 0,
					onChange: ({ value: e }) => d(e),
					step: 5,
					min: -180,
					max: 180
				}),
				/* @__PURE__ */ z(V, {
					component: "span",
					sx: Bu,
					children: "P"
				}),
				/* @__PURE__ */ z(il, {
					value: f ?? 0,
					onChange: ({ value: e }) => p(e),
					step: 5,
					min: -90,
					max: 90
				}),
				/* @__PURE__ */ z(V, {
					component: "span",
					sx: Bu,
					children: "R"
				}),
				/* @__PURE__ */ z(il, {
					value: m ?? 0,
					onChange: ({ value: e }) => h(e),
					step: 5,
					min: -90,
					max: 90
				})
			]
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, { label: "" }), /* @__PURE__ */ z(_l, {
			onClick: se,
			label: "Play Binaural",
			disabled: !ee || s
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, { label: "" }), /* @__PURE__ */ z(_l, {
			onClick: ce,
			label: "Download Stereo WAV",
			disabled: !ee
		})] }),
		/* @__PURE__ */ z(Ou, {
			open: x,
			onClose: () => S(!1),
			selectedId: c || "D1",
			onSelect: le
		})
	] });
}, { PropertyNumberInput: Ku, PropertyCheckboxInput: qu } = lu("IMAGESOURCE_SET_PROPERTY"), Ju = ({ uuid: e }) => {
	let t = M(() => {
		a("UPDATE_IMAGESOURCE", e);
	}, [e]), n = M(() => {
		a("RESET_IMAGESOURCE", e);
	}, [e]);
	return /* @__PURE__ */ B("div", { children: [
		/* @__PURE__ */ z(ju, {
			onPlayPause: t,
			onReset: n,
			canRun: !0,
			hasResults: !0
		}),
		/* @__PURE__ */ z(Z, { label: "Calculation" }),
		/* @__PURE__ */ z(Ku, {
			uuid: e,
			label: "Maximum Order",
			property: "maxReflectionOrderReset",
			tooltip: "Maximum image-source reflection depth. Each order mirrors the source across every surface, producing deterministic specular paths — computation grows exponentially with order."
		}),
		/* @__PURE__ */ z(Z, { label: "Source / Receiver Pairs" }),
		/* @__PURE__ */ z(xu, {
			uuid: e,
			eventType: "IMAGESOURCE_SET_PROPERTY"
		}),
		/* @__PURE__ */ z(Z, { label: "Visualization" }),
		/* @__PURE__ */ z(qu, {
			uuid: e,
			label: "Show Sources",
			property: "imageSourcesVisible",
			tooltip: "Display virtual image sources in the 3D viewport — mirrored copies of the source generated at each reflection order"
		}),
		/* @__PURE__ */ z(qu, {
			uuid: e,
			label: "Show Paths",
			property: "rayPathsVisible",
			tooltip: "Display specular reflection paths from source to receiver through each image-source mirror sequence"
		}),
		/* @__PURE__ */ z(Z, { label: "Impulse Response" }),
		/* @__PURE__ */ z(uu, {
			event: "IMAGESOURCE_PLAY_IR",
			args: e,
			label: "Play",
			tooltip: "Auralise the impulse response computed from deterministic image-source reflections",
			disabled: !1
		}),
		/* @__PURE__ */ z(uu, {
			event: "IMAGESOURCE_DOWNLOAD_IR",
			args: e,
			label: "Download",
			tooltip: "Export the impulse response as a mono WAV file"
		}),
		/* @__PURE__ */ z(Z, { label: "Developer" }),
		/* @__PURE__ */ z(uu, {
			event: "CALCULATE_LTP",
			args: e,
			label: "Calculate LTP",
			tooltip: "Compute Level-Time Progression — energy arrival over time from image-source paths, useful for analysing early reflection structure"
		})
	] });
}, { PropertyNumberInput: Yu } = lu("RT60_SET_PROPERTY"), Xu = ({ uuid: e }) => {
	let { noResults: t } = f(j((t) => c(["noResults"], t.solvers[e]))), [, r] = Ut((e) => e + 1, 0);
	return N(() => n("UPDATE_RT60", (e) => {
		r();
	}), [r]), /* @__PURE__ */ B("div", { children: [
		/* @__PURE__ */ z(Z, { label: "Settings" }),
		/* @__PURE__ */ z(Yu, {
			uuid: e,
			label: "Room Volume",
			property: "displayVolume",
			tooltip: "Override the automatically computed room volume (m³). Used in Sabine, Eyring, and Fitzroy reverberation time formulas.",
			elementProps: { step: .01 }
		}),
		/* @__PURE__ */ z(Z, { label: "Export" }),
		/* @__PURE__ */ z(uu, {
			event: "DOWNLOAD_RT60_RESULTS",
			args: e,
			label: "Download RT Results",
			disabled: t,
			tooltip: "Export reverberation time results (T20, T30, EDT) per octave band as a CSV file"
		})
	] });
}, Zu = ({ uuid: e }) => /* @__PURE__ */ B("div", { children: [
	/* @__PURE__ */ z(Z, { label: "Input" }),
	/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, { label: "Upload IR" }), /* @__PURE__ */ z("div", {
		style: { alignItems: "center" },
		children: /* @__PURE__ */ z("input", {
			type: "file",
			id: "irinput",
			accept: ".wav",
			onChange: (t) => {
				let n = new FileReader();
				n.addEventListener("loadend", (t) => {
					a("ENERGYDECAY_SET_PROPERTY", {
						uuid: e,
						property: "broadbandIR",
						value: n.result
					});
				}), n.readAsArrayBuffer(t.target.files[0]);
			}
		})
	})] }),
	/* @__PURE__ */ z(uu, {
		event: "CALCULATE_AC_PARAMS",
		args: e,
		label: "Calculate Parameters",
		tooltip: "Derive acoustical parameters (T20, T30, EDT, C50, C80, D50, D80, Ts) from the uploaded impulse response using Schroeder backward integration"
	})
] }), { PropertyNumberInput: Qu } = lu("BEAMTRACE_SET_PROPERTY"), $u = {
	display: "flex",
	alignItems: "center",
	gap: 1,
	px: 1,
	py: .5,
	borderBottom: "1px solid",
	borderColor: "divider",
	minHeight: 28
}, ed = (e) => ({
	fontSize: "0.7rem",
	color: e ? "warning.main" : "text.secondary",
	fontWeight: e ? 500 : 400
}), td = [
	{
		value: "rays",
		label: "Rays Only"
	},
	{
		value: "beams",
		label: "Beams Only"
	},
	{
		value: "both",
		label: "Both"
	}
], nd = {
	display: "flex",
	alignItems: "center",
	gap: .25,
	flex: 1
}, rd = {
	fontSize: "0.6rem",
	color: "text.disabled",
	minWidth: 10,
	textAlign: "center"
}, id = [
	"125",
	"250",
	"500",
	"1k",
	"2k",
	"4k",
	"8k"
], ad = {
	display: "grid",
	gridTemplateColumns: "repeat(7, 1fr)",
	gap: 0,
	px: .5,
	mb: .5
}, od = {
	fontSize: "0.6rem",
	color: "text.disabled",
	textAlign: "center",
	pb: .25
}, sd = {
	fontSize: "0.7rem",
	fontFamily: "monospace",
	color: "text.primary",
	textAlign: "center"
}, cd = ({ percent: e, overflow: t }) => {
	let n = t ? "#ff4444" : e > 80 ? "#ffaa00" : "#44aa44";
	return /* @__PURE__ */ z("div", {
		style: {
			width: "60px",
			height: "8px",
			background: "#333",
			borderRadius: "4px",
			overflow: "hidden",
			marginRight: "8px"
		},
		children: /* @__PURE__ */ z("div", { style: {
			width: `${Math.min(e, 100)}%`,
			height: "100%",
			background: n,
			transition: "width 0.2s"
		} })
	});
}, ld = ({ uuid: e }) => {
	let t = f((t) => t.solvers[e]), [n] = X(e, "visualizationMode", "BEAMTRACE_SET_PROPERTY");
	return N(() => {
		let r = (r) => {
			if (r.target instanceof HTMLInputElement || r.target instanceof HTMLTextAreaElement) return;
			let i = t?.maxReflectionOrder ?? 3;
			switch (r.key) {
				case "+":
				case "=":
				case "ArrowUp":
					i < 6 && a("BEAMTRACE_SET_PROPERTY", {
						uuid: e,
						property: "maxReflectionOrderReset",
						value: i + 1
					}), r.preventDefault();
					break;
				case "-":
				case "_":
				case "ArrowDown":
					i > 0 && a("BEAMTRACE_SET_PROPERTY", {
						uuid: e,
						property: "maxReflectionOrderReset",
						value: i - 1
					}), r.preventDefault();
					break;
				case "b":
				case "B": n === "rays" ? a("BEAMTRACE_SET_PROPERTY", {
					uuid: e,
					property: "visualizationMode",
					value: "beams"
				}) : a("BEAMTRACE_SET_PROPERTY", {
					uuid: e,
					property: "visualizationMode",
					value: "rays"
				}), r.preventDefault();
			}
		};
		return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
	}, [
		e,
		t?.maxReflectionOrder,
		n
	]), null;
}, ud = ({ uuid: e }) => {
	let [t, r] = I(!1), [i, o] = I(!1), [, s] = Ut((e) => e + 1, 0), c = f((t) => t.solvers[e]), l = c?.numValidPaths || 0, u = c?.lastMetrics, d = u?.bufferUsage, p = l > 0, m = !p, h = (() => {
		let e = c?.responseByIntensity;
		if (e) {
			let t = Object.keys(e)[0];
			if (t) {
				let n = Object.keys(e[t])[0];
				if (n && e[t][n].t30) return e[t][n].t30.map((e) => e.m < 0 ? (-60 / e.m).toFixed(2) : "--");
			}
		}
		return c?.estimatedT30 ? c.estimatedT30.map((e) => e > 0 ? e.toFixed(2) : "--") : null;
	})(), [g, _] = X(e, "visualizationMode", "BEAMTRACE_SET_PROPERTY"), [v, y] = X(e, "showAllBeams", "BEAMTRACE_SET_PROPERTY"), b = g === "beams" || g === "both", [x, S] = I("1"), [C, w] = I("1"), [ee, T] = I(!1), [E, te] = I(""), [D] = X(e, "hrtfSubjectId", "BEAMTRACE_SET_PROPERTY"), [ne, re] = X(e, "headYaw", "BEAMTRACE_SET_PROPERTY"), [ie, ae] = X(e, "headPitch", "BEAMTRACE_SET_PROPERTY"), [oe, se] = X(e, "headRoll", "BEAMTRACE_SET_PROPERTY"), [ce] = X(e, "binauralPlaying", "BEAMTRACE_SET_PROPERTY"), [le, O] = X(e, "edgeDiffractionEnabled", "BEAMTRACE_SET_PROPERTY"), [ue, de] = X(e, "lateReverbTailEnabled", "BEAMTRACE_SET_PROPERTY");
	N(() => {
		let e = D || "D1";
		xe().then((t) => {
			let n = t.find((t) => t.id === e);
			te(n ? n.name : e);
		}).catch(() => te(e));
	}, [D]), N(() => {
		let t = n("BEAMTRACE_CALCULATE_COMPLETE", (t) => {
			t === e && (r(!1), s());
		}), i = n("BEAMTRACE_RESET", (t) => {
			t === e && s();
		}), a = n("BEAMTRACE_QUICK_ESTIMATE_COMPLETE", (t) => {
			t === e && (o(!1), s());
		});
		return () => {
			t(), i(), a();
		};
	}, [e]);
	let fe = M(() => {
		r(!0), a("BEAMTRACE_CALCULATE", e);
	}, [e]), pe = M(() => {
		a("BEAMTRACE_RESET", e);
	}, [e]), me = M(() => {
		a("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", {
			uuid: e,
			order: parseInt(x)
		});
	}, [e, x]), k = M(() => {
		a("BEAMTRACE_PLAY_BINAURAL_IR", {
			uuid: e,
			order: parseInt(C)
		});
	}, [e, C]), he = M(() => {
		a("BEAMTRACE_DOWNLOAD_BINAURAL_IR", {
			uuid: e,
			order: parseInt(C)
		});
	}, [e, C]), ge = M(() => {
		o(!0), a("BEAMTRACE_QUICK_ESTIMATE", e);
	}, [e]), _e = M((t) => {
		a("BEAMTRACE_SET_PROPERTY", {
			uuid: e,
			property: "hrtfSubjectId",
			value: t
		}), a("BEAMTRACE_SET_PROPERTY", {
			uuid: e,
			property: "binauralImpulseResponse",
			value: void 0
		});
	}, [e]);
	return /* @__PURE__ */ B("div", { children: [
		/* @__PURE__ */ z(ld, { uuid: e }),
		/* @__PURE__ */ B(V, {
			sx: $u,
			children: [
				t ? /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z(or, {
					size: 12,
					thickness: 5,
					color: "warning"
				}), /* @__PURE__ */ z(H, {
					sx: ed(!0),
					children: "Unfolding surfaces..."
				})] }) : p ? /* @__PURE__ */ B(H, {
					sx: ed(!1),
					children: [
						l.toLocaleString(),
						" path",
						l === 1 ? "" : "s",
						" found"
					]
				}) : /* @__PURE__ */ z(H, {
					sx: ed(!1),
					children: "Ready"
				}),
				/* @__PURE__ */ z(V, { sx: { flex: 1 } }),
				!t && /* @__PURE__ */ z(H, {
					component: "span",
					onClick: fe,
					sx: {
						fontSize: "0.65rem",
						color: "primary.main",
						cursor: "pointer",
						"&:hover": { textDecoration: "underline" }
					},
					children: "Recalculate"
				}),
				p && !t && /* @__PURE__ */ z(H, {
					component: "span",
					onClick: pe,
					sx: {
						fontSize: "0.65rem",
						color: "text.disabled",
						cursor: "pointer",
						ml: 1,
						"&:hover": {
							textDecoration: "underline",
							color: "text.secondary"
						}
					},
					children: "Clear"
				})
			]
		}),
		/* @__PURE__ */ z(Z, { label: "Calculation" }),
		/* @__PURE__ */ z(Qu, {
			uuid: e,
			label: "Max Reflection Order",
			property: "maxReflectionOrderReset",
			tooltip: "Maximum surface-unfolding depth. All valid specular paths are found deterministically and instantaneously via geometric surface unfolding — no stochastic sampling. Complexity grows with order; 1–6 recommended."
		}),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Edge Diffraction",
			hasToolTip: !0,
			tooltip: "Uniform Theory of Diffraction (UTD) — models sound bending around convex edges, adding diffracted contributions at each room edge"
		}), /* @__PURE__ */ z(Qc, {
			value: le || !1,
			onChange: ({ value: e }) => O(e)
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "",
			hasToolTip: !0,
			tooltip: "Shoot 500 random rays to quickly estimate RT60 per octave band"
		}), /* @__PURE__ */ z(_l, {
			onClick: ge,
			label: i ? "Estimating..." : "Quick Estimate",
			disabled: i
		})] }),
		/* @__PURE__ */ z(Z, { label: "Source / Receiver Pairs" }),
		/* @__PURE__ */ z(xu, {
			uuid: e,
			eventType: "BEAMTRACE_SET_PROPERTY"
		}),
		/* @__PURE__ */ z(Z, { label: "Visualization" }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Display Mode",
			hasToolTip: !0,
			tooltip: "Visualization style: ray paths show specular reflection chains, beam cones show the volumetric unfolded regions, or both overlaid"
		}), /* @__PURE__ */ z(ll, {
			value: g || "rays",
			onChange: _,
			options: td
		})] }),
		b && /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Show All Beams",
			hasToolTip: !0,
			tooltip: "Display all unfolded beam cones including geometrically invalid or orphaned ones — useful for debugging surface-unfolding coverage"
		}), /* @__PURE__ */ z(Qc, {
			value: v || !1,
			onChange: ({ value: e }) => y(e)
		})] }),
		/* @__PURE__ */ z(Z, { label: "Statistics" }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, { label: "Valid Paths" }), /* @__PURE__ */ z(V, {
			sx: {
				fontSize: "0.75rem",
				fontFamily: "monospace",
				px: 1,
				color: "text.primary",
				textAlign: "center"
			},
			children: l
		})] }),
		u && /* @__PURE__ */ B(R, { children: [
			/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, { label: "Raycasts" }), /* @__PURE__ */ z(V, {
				sx: {
					fontSize: "0.75rem",
					fontFamily: "monospace",
					px: 1,
					color: "text.primary",
					textAlign: "center"
				},
				children: u.raycastCount
			})] }),
			/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, { label: "Cache Hits" }), /* @__PURE__ */ z(V, {
				sx: {
					fontSize: "0.75rem",
					fontFamily: "monospace",
					px: 1,
					color: "text.primary",
					textAlign: "center"
				},
				children: u.failPlaneCacheHits
			})] }),
			/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, { label: "Buckets Skipped" }), /* @__PURE__ */ z(V, {
				sx: {
					fontSize: "0.75rem",
					fontFamily: "monospace",
					px: 1,
					color: "text.primary",
					textAlign: "center"
				},
				children: u.bucketsSkipped
			})] })
		] }),
		d && /* @__PURE__ */ B(R, { children: [
			/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
				label: "Lines Buffer",
				hasToolTip: !0,
				tooltip: `${d.linesUsed.toLocaleString()} / ${d.linesCapacity.toLocaleString()} vertices`
			}), /* @__PURE__ */ B("div", {
				style: {
					display: "flex",
					alignItems: "center",
					padding: "4px 8px"
				},
				children: [/* @__PURE__ */ z(cd, {
					percent: d.linesPercent,
					overflow: d.overflowWarning
				}), /* @__PURE__ */ B("span", {
					style: {
						fontSize: "11px",
						color: d.linesPercent > 80 ? "#ffaa00" : "#888"
					},
					children: [d.linesPercent.toFixed(1), "%"]
				})]
			})] }),
			/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
				label: "Points Buffer",
				hasToolTip: !0,
				tooltip: `${d.pointsUsed.toLocaleString()} / ${d.pointsCapacity.toLocaleString()} points`
			}), /* @__PURE__ */ B("div", {
				style: {
					display: "flex",
					alignItems: "center",
					padding: "4px 8px"
				},
				children: [/* @__PURE__ */ z(cd, {
					percent: d.pointsPercent,
					overflow: d.overflowWarning
				}), /* @__PURE__ */ B("span", {
					style: {
						fontSize: "11px",
						color: d.pointsPercent > 80 ? "#ffaa00" : "#888"
					},
					children: [d.pointsPercent.toFixed(1), "%"]
				})]
			})] }),
			d.overflowWarning && /* @__PURE__ */ z(J, { children: /* @__PURE__ */ z("span", {
				style: {
					color: "#ff4444",
					fontSize: "11px",
					padding: "4px 8px"
				},
				children: "Buffer overflow! Reduce reflection order."
			}) })
		] }),
		/* @__PURE__ */ z(Z, { label: "Est. T30" }),
		/* @__PURE__ */ B(V, {
			sx: ad,
			children: [id.map((e) => /* @__PURE__ */ z(V, {
				sx: od,
				children: e
			}, e)), h ? h.map((e, t) => /* @__PURE__ */ z(V, {
				sx: sd,
				children: e
			}, t)) : id.map((e, t) => /* @__PURE__ */ z(V, {
				sx: sd,
				children: "--"
			}, t))]
		}),
		/* @__PURE__ */ z(Z, { label: "Impulse Response" }),
		/* @__PURE__ */ z(uu, {
			event: "BEAMTRACE_PLAY_IR",
			args: e,
			label: "Play",
			tooltip: "Auralise the impulse response computed from beam-traced specular paths",
			disabled: m
		}),
		/* @__PURE__ */ z(uu, {
			event: "BEAMTRACE_DOWNLOAD_IR",
			args: e,
			label: "Download",
			tooltip: "Export the impulse response as a mono WAV file",
			disabled: m
		}),
		/* @__PURE__ */ z(uu, {
			event: "BEAMTRACE_DOWNLOAD_OCTAVE_IR",
			args: e,
			label: "Download by Octave",
			tooltip: "Export per-octave-band impulse responses as individual WAV files",
			disabled: m
		}),
		/* @__PURE__ */ z(Z, { label: "Late Reverberation" }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Late Reverb Tail",
			hasToolTip: !0,
			tooltip: "Synthesize a noise tail extending the IR beyond specular paths, using energy decay parameters estimated from the computed paths"
		}), /* @__PURE__ */ z(Qc, {
			value: ue || !1,
			onChange: ({ value: e }) => de(e)
		})] }),
		/* @__PURE__ */ z(Qu, {
			uuid: e,
			label: "Crossfade Time (s)",
			property: "tailCrossfadeTime",
			tooltip: "Time in seconds where the synthesized tail begins to crossfade with ray-traced IR. 0 = auto-detect from last path arrival.",
			elementProps: {
				step: .1,
				min: 0,
				max: 5
			}
		}),
		/* @__PURE__ */ z(Qu, {
			uuid: e,
			label: "Crossfade Dur. (s)",
			property: "tailCrossfadeDuration",
			tooltip: "Duration in seconds of the Hann crossfade window between specular IR and synthesized tail",
			elementProps: {
				step: .01,
				min: .01,
				max: .5
			}
		}),
		/* @__PURE__ */ z(Z, { label: "Ambisonic Output" }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Order",
			hasToolTip: !0,
			tooltip: "Ambisonic order — 1st (4 ch FOA), 2nd (9 ch HOA), or 3rd (16 ch HOA). Higher orders capture finer spatial detail."
		}), /* @__PURE__ */ z(ll, {
			value: x,
			onChange: ({ value: e }) => S(e),
			options: [
				{
					value: "1",
					label: "1st Order (4 ch)"
				},
				{
					value: "2",
					label: "2nd Order (9 ch)"
				},
				{
					value: "3",
					label: "3rd Order (16 ch)"
				}
			]
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "",
			hasToolTip: !0,
			tooltip: "Download a multi-channel WAV in ACN channel order with N3D normalisation"
		}), /* @__PURE__ */ z(_l, {
			onClick: me,
			label: "Download",
			disabled: m
		})] }),
		/* @__PURE__ */ z(Z, { label: "Binaural Output" }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Order",
			hasToolTip: !0,
			tooltip: "Ambisonic order used for binaural decoding via HRTF convolution"
		}), /* @__PURE__ */ z(ll, {
			value: C,
			onChange: ({ value: e }) => w(e),
			options: [
				{
					value: "1",
					label: "1st Order (4 ch)"
				},
				{
					value: "2",
					label: "2nd Order (9 ch)"
				},
				{
					value: "3",
					label: "3rd Order (16 ch)"
				}
			]
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "HRTF Subject",
			hasToolTip: !0,
			tooltip: "Head-Related Transfer Function dataset used for spatial audio rendering — different subjects have different ear geometries"
		}), /* @__PURE__ */ z(_l, {
			onClick: () => T(!0),
			label: E || D || "D1"
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Head Orientation",
			hasToolTip: !0,
			tooltip: "Listener head rotation in degrees — Yaw: horizontal (positive = left), Pitch: vertical (positive = up), Roll: tilt (positive = right ear down)"
		}), /* @__PURE__ */ B(V, {
			sx: nd,
			children: [
				/* @__PURE__ */ z(V, {
					component: "span",
					sx: rd,
					children: "Y"
				}),
				/* @__PURE__ */ z(il, {
					value: ne ?? 0,
					onChange: ({ value: e }) => re(e),
					step: 5,
					min: -180,
					max: 180
				}),
				/* @__PURE__ */ z(V, {
					component: "span",
					sx: rd,
					children: "P"
				}),
				/* @__PURE__ */ z(il, {
					value: ie ?? 0,
					onChange: ({ value: e }) => ae(e),
					step: 5,
					min: -90,
					max: 90
				}),
				/* @__PURE__ */ z(V, {
					component: "span",
					sx: rd,
					children: "R"
				}),
				/* @__PURE__ */ z(il, {
					value: oe ?? 0,
					onChange: ({ value: e }) => se(e),
					step: 5,
					min: -90,
					max: 90
				})
			]
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, { label: "" }), /* @__PURE__ */ z(_l, {
			onClick: k,
			label: "Play Binaural",
			disabled: m || ce
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, { label: "" }), /* @__PURE__ */ z(_l, {
			onClick: he,
			label: "Download Stereo WAV",
			disabled: m
		})] }),
		/* @__PURE__ */ z(Ou, {
			open: ee,
			onClose: () => T(!1),
			selectedId: D || "D1",
			onSelect: _e
		})
	] });
}, dd = {
	display: "grid",
	gridTemplateColumns: "1fr 2fr 1fr",
	alignItems: "center",
	fontSize: "0.75rem",
	userSelect: "none"
}, fd = {
	textAlign: "right",
	minWidth: "100px",
	pr: 1
}, pd = {
	fontSize: "0.75rem",
	color: "text.secondary"
}, md = {
	display: "flex",
	alignItems: "center",
	gap: .5,
	mx: 1
}, hd = {
	flex: 1,
	mx: .5,
	"& .MuiSlider-thumb": {
		width: 12,
		height: 12
	},
	"& .MuiSlider-track": { height: 4 },
	"& .MuiSlider-rail": { height: 4 }
}, gd = {
	p: .25,
	minWidth: 20,
	width: 20,
	height: 20,
	"& .MuiSvgIcon-root": { fontSize: 14 }
}, _d = {
	width: 70,
	"& .MuiInputBase-root": {
		fontSize: "0.75rem",
		height: 24
	},
	"& .MuiInputBase-input": {
		py: .5,
		px: 1,
		textAlign: "center",
		"&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
			WebkitAppearance: "none",
			m: 0
		},
		MozAppearance: "textfield"
	},
	"& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" }
}, vd = (e) => Number.isInteger(e) ? 0 : e.toString().split(".").slice(-1)[0].length, yd = (e, t, n) => e < t ? t : e > n ? n : e;
function bd({ id: e, value: t, onChange: n, min: r, max: i, step: a, label: o, tooltipText: s, hasToolTip: c }) {
	let l = vd(a), [u, d] = I(Number(t.toFixed(l))), [f, p] = I(!1), m = M((t, r) => {
		let i = Array.isArray(r) ? r[0] : r;
		d(i), n({
			id: e,
			value: i
		});
	}, [e, n]), h = M(() => {
		let t = yd(u - a, r, i);
		d(t), n({
			id: e,
			value: t
		});
	}, [
		e,
		u,
		a,
		r,
		i,
		n
	]), g = M(() => {
		let t = yd(u + a, r, i);
		d(t), n({
			id: e,
			value: t
		});
	}, [
		e,
		u,
		a,
		r,
		i,
		n
	]), _ = M((e) => {
		let t = e.currentTarget.value;
		d(Number(t === "." ? "0." : t));
	}, []), v = M(() => {
		p(!1);
		let t = yd(Number(u.toFixed(l)), r, i);
		d(t), n({
			id: e,
			value: t
		});
	}, [
		e,
		u,
		l,
		r,
		i,
		n
	]), y = M((e) => {
		e.key === "Enter" ? e.target.blur() : e.key === "Escape" && (d(t), e.target.blur());
	}, [t]), b = /* @__PURE__ */ z(H, {
		sx: pd,
		children: o
	});
	return /* @__PURE__ */ B(V, {
		sx: dd,
		children: [
			/* @__PURE__ */ z(V, {
				sx: fd,
				children: c && s ? /* @__PURE__ */ z(Yn, {
					title: s,
					placement: "left",
					arrow: !0,
					enterDelay: 500,
					children: b
				}) : b
			}),
			/* @__PURE__ */ B(V, {
				sx: md,
				children: [
					/* @__PURE__ */ z(hn, {
						size: "small",
						onClick: h,
						sx: gd,
						children: /* @__PURE__ */ z(lr, {})
					}),
					/* @__PURE__ */ z(sr, {
						size: "small",
						value: t,
						min: r,
						max: i,
						step: a,
						onChange: m,
						sx: hd
					}),
					/* @__PURE__ */ z(hn, {
						size: "small",
						onClick: g,
						sx: gd,
						children: /* @__PURE__ */ z(cr, {})
					})
				]
			}),
			/* @__PURE__ */ z(bn, {
				type: "number",
				size: "small",
				variant: "outlined",
				value: f ? u : t,
				onFocus: () => {
					d(t), p(!0);
				},
				onBlur: v,
				onChange: _,
				onKeyDown: y,
				slotProps: { htmlInput: {
					min: r,
					max: i,
					step: a
				} },
				sx: _d
			})
		]
	});
}
// src/components/parameter-config/FDTD_2DTab.tsx
var xd = {
	fontSize: "0.75rem",
	height: 24,
	minWidth: 120,
	bgcolor: "background.paper",
	"& .MuiSelect-select": {
		py: .25,
		px: 1
	},
	"& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
	"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" }
}, Sd = {
	fontSize: "0.75rem",
	py: .5
}, Cd = ({ uuid: e }) => {
	let t = Ur(), n = Yr(), r = f((t) => t.solvers[e]), [i, a] = I(r.uniforms.colorBrightness.value), [o, s] = I(r.mesh.scale.z), [c, l] = I(r.heightmapVariable.material.uniforms.damping.value), [u, d] = I(r.numPasses), [p, m] = I(r.running), [h, g] = I(r.recording), [_, v] = I(r.getWireframeVisible()), [y, b] = I(r.frequencyDependentWalls), [x, S] = I(!1), [C, w] = I(!1), [ee, T] = I(!1), [E, te] = I(r.sourceKeys), D = t.filter((e) => !r.sources[e.uuid]), [ne, re] = I(!1), [ie, ae] = I(r.receiverKeys), oe = n.filter((e) => !r.receivers[e.uuid]);
	return /* @__PURE__ */ B("div", { children: [
		/* @__PURE__ */ B(Wc, {
			id: "view",
			label: "View",
			open: x,
			onOpenClose: () => S(!x),
			children: [
				/* @__PURE__ */ z(bd, {
					id: "colorBrightness",
					label: "Color Brightness",
					labelPosition: "left",
					tooltipText: "Changes the color brightness",
					min: 0,
					max: 40,
					step: .1,
					value: i,
					hasToolTip: x,
					onChange: (e) => {
						r.uniforms.colorBrightness.value = e.value, a(e.value);
					}
				}),
				/* @__PURE__ */ z(bd, {
					id: "heightScale",
					label: "Height Scale",
					labelPosition: "left",
					tooltipText: "Height Scale",
					min: 0,
					max: 1,
					step: .001,
					hasToolTip: x,
					value: o,
					onChange: (e) => {
						r.mesh.scale.setZ(e.value === 0 ? .001 : e.value), s(e.value);
					}
				}),
				/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
					hasToolTip: x,
					label: "Wireframe",
					tooltip: "Display mesh as wirefame"
				}), /* @__PURE__ */ z(Qc, {
					onChange: (e) => {
						r.setWireframeVisible(e.value), v(e.value);
					},
					value: _
				})] })
			]
		}),
		/* @__PURE__ */ B(Wc, {
			id: "sim-params",
			label: "Simulation Parameters",
			open: C,
			onOpenClose: () => w(!C),
			children: [
				/* @__PURE__ */ z(bd, {
					id: "damping",
					label: "Damping",
					labelPosition: "left",
					tooltipText: "Numerical sponge on velocity, not absorption. 1 is off and is the default — surfaces carry their own materials. Below 1 it double-counts against them, imposes a decay that changes with cell size, and is only conditionally stable: 0.999 diverges on a 6 x 4 m room at 6 cm cells.",
					min: .999,
					max: 1,
					step: 1e-5,
					hasToolTip: C,
					value: c,
					onChange: (e) => {
						r.heightmapVariable.material.uniforms.damping.value = e.value, l(e.value);
					}
				}),
				/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
					hasToolTip: C,
					label: "Frequency-dependent walls",
					tooltip: "Each wall follows its material's whole octave-band spectrum in one run, fitted as passive resonant (series-RLC) branches, instead of one coefficient at 500 Hz. Switching restarts the field."
				}), /* @__PURE__ */ z(Qc, {
					onChange: (e) => {
						r.setFrequencyDependentWalls(e.value), b(e.value);
					},
					value: y
				})] }),
				/* @__PURE__ */ z(bd, {
					id: "numPasses",
					label: "Passes",
					labelPosition: "left",
					tooltipText: "Display steps per frame. Recording uses wall-clock / dt, not this slider.",
					min: 1,
					max: 30,
					step: 1,
					hasToolTip: C,
					value: u,
					onChange: (e) => {
						r.numPasses = e.value, d(e.value);
					}
				})
			]
		}),
		/* @__PURE__ */ B(Wc, {
			id: "sim-sources",
			label: "Sources",
			open: ee,
			onOpenClose: () => T(!ee),
			children: [/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
				hasToolTip: ee,
				label: "Source",
				tooltip: "All available sources"
			}), /* @__PURE__ */ B(Qn, {
				size: "small",
				value: "",
				displayEmpty: !0,
				onChange: (e) => {
					let n = t.filter((t) => t.uuid === e.target.value);
					n[0] && r.addSource(n[0]), te(r.sourceKeys);
				},
				sx: xd,
				MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } },
				children: [/* @__PURE__ */ z(pn, {
					value: "",
					disabled: !0,
					sx: Sd,
					children: "Select Source"
				}), D.map((e) => /* @__PURE__ */ z(pn, {
					value: e.uuid,
					sx: Sd,
					children: e.name
				}, e.uuid))]
			})] }), E.map((e) => /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
				hasToolTip: !1,
				label: r.sources[e] && r.sources[e].name
			}), /* @__PURE__ */ z(_l, {
				label: "Remove",
				onClick: (t) => {
					te(r.sourceKeys.filter((t) => t !== e)), r.removeSource(e);
				}
			})] }, e))]
		}),
		/* @__PURE__ */ B(Wc, {
			id: "sim-receivers",
			label: "Receivers",
			open: ne,
			onOpenClose: () => re(!ne),
			children: [/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
				hasToolTip: ne,
				label: "Receiver",
				tooltip: "All available receivers"
			}), /* @__PURE__ */ B(Qn, {
				size: "small",
				value: "",
				displayEmpty: !0,
				onChange: (e) => {
					let t = n.filter((t) => t.uuid === e.target.value);
					t[0] && r.addReceiver(t[0]), ae(r.receiverKeys);
				},
				sx: xd,
				MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } },
				children: [/* @__PURE__ */ z(pn, {
					value: "",
					disabled: !0,
					sx: Sd,
					children: "Select Receiver"
				}), oe.map((e) => /* @__PURE__ */ z(pn, {
					value: e.uuid,
					sx: Sd,
					children: e.name
				}, e.uuid))]
			})] }), ie.map((e) => /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
				hasToolTip: !1,
				label: r.receivers[e].name
			}), /* @__PURE__ */ z(_l, {
				label: "Remove",
				onClick: (t) => {
					ae(r.receiverKeys.filter((t) => t !== e)), r.removeReceiver(e);
				}
			})] }, e))]
		}),
		/* @__PURE__ */ z(J, { children: /* @__PURE__ */ z(Y, {
			label: `Simulated ${Number(r.time).toFixed(4)} s · ${Math.round(1 / r.dt)} Hz · walls to ${Math.round(r.impedanceFrequencyLimit)} Hz`,
			tooltip: "Simulated time, FDTD sample rate (1/dt), and the highest frequency the walls deliver their absorption at on this grid. Above that they read as more reflective than their materials — use a smaller cell size. A material's coefficient is read as random-incidence (Sabine) absorption, as the database measured it: each wall absorbs that fraction of a diffuse field."
		}) }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Run/Pause",
			tooltip: "Runs or pauses the simulation"
		}), /* @__PURE__ */ z(_l, {
			onClick: (e) => {
				r.running ? (r.stop(), m(!1)) : (r.run(), m(!0));
			},
			label: p ? "Pause" : "Run"
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Recording",
			tooltip: "Starts/stops recording"
		}), /* @__PURE__ */ z(_l, {
			onClick: (e) => {
				r.recording ? (r.stopRecording(), g(!1)) : (r.startRecording(), g(!0));
			},
			label: h ? "Stop" : "Record"
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Clear",
			tooltip: "Clears the grid"
		}), /* @__PURE__ */ z(_l, {
			onClick: r.clear,
			label: "Clear"
		})] })
	] });
}, { PropertyNumberInput: wd } = lu("ART_SET_PROPERTY"), Td = ({ uuid: e }) => {
	let t = O((e) => e.containers), n = O((e) => e.version), r = P(() => Object.values(t).filter((e) => e.kind === "room").map((e) => ({
		value: e.uuid,
		label: e.name
	})), [t, n]), [i, o] = X(e, "roomID", "ART_SET_PROPERTY"), s = M(() => {
		a("CALCULATE_ART", e);
	}, [e]);
	return /* @__PURE__ */ B("div", { children: [
		/* @__PURE__ */ z(ju, {
			onPlayPause: s,
			canRun: !0
		}),
		/* @__PURE__ */ z(Z, { label: "Room" }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Room",
			hasToolTip: !0,
			tooltip: "Room geometry to tessellate into radiosity patches for energy exchange computation"
		}), /* @__PURE__ */ z(ll, {
			value: i || "",
			onChange: o,
			options: r.length > 0 ? r : [{
				value: "",
				label: "No rooms available"
			}]
		})] }),
		/* @__PURE__ */ z(Z, { label: "Source / Receiver Pairs" }),
		/* @__PURE__ */ z(xu, {
			uuid: e,
			eventType: "ART_SET_PROPERTY"
		}),
		/* @__PURE__ */ z(Z, { label: "Solver Settings" }),
		/* @__PURE__ */ z(wd, {
			uuid: e,
			label: "Max Edge Length",
			property: "maxEdgeLength",
			tooltip: "Maximum triangle edge length during adaptive tessellation (metres). Smaller values create finer radiosity patches for more spatial detail at the cost of computation time.",
			elementProps: {
				step: .1,
				min: .05
			}
		}),
		/* @__PURE__ */ z(wd, {
			uuid: e,
			label: "BRDF Detail",
			property: "brdfDetail",
			tooltip: "Hemisphere discretization level for directional energy exchange. Level 0 = 6 bins, 1 ≈ 18 bins, 2 ≈ 66 bins. Higher levels model more complex reflection patterns but increase memory and compute cost.",
			elementProps: {
				step: 1,
				min: 0,
				max: 3
			}
		}),
		/* @__PURE__ */ z(wd, {
			uuid: e,
			label: "Rays per Shoot",
			property: "raysPerShoot",
			tooltip: "Number of stochastic rays emitted per progressive shooting iteration to estimate form factors between surface patches",
			elementProps: {
				step: 50,
				min: 10
			}
		}),
		/* @__PURE__ */ z(wd, {
			uuid: e,
			label: "Max Iterations",
			property: "maxIterations",
			tooltip: "Maximum progressive radiosity shooting iterations before the solver halts — each iteration distributes the highest-energy unshot patch",
			elementProps: {
				step: 10,
				min: 1
			}
		}),
		/* @__PURE__ */ z(wd, {
			uuid: e,
			label: "Convergence",
			property: "convergenceThreshold",
			tooltip: "Ratio of remaining unshot energy to initial energy at which the solver stops. Lower values yield more accurate steady-state energy distributions but require more iterations.",
			elementProps: {
				step: .005,
				min: .001,
				max: .5
			}
		}),
		/* @__PURE__ */ z(wd, {
			uuid: e,
			label: "Sample Rate",
			property: "sampleRate",
			tooltip: "Temporal resolution for time-dependent energy exchange between patches (Hz). Higher rates capture faster energy fluctuations but increase computation.",
			elementProps: {
				step: 100,
				min: 100,
				max: 44100
			}
		})
	] });
}, { PropertyNumberInput: Ed, PropertyCheckboxInput: Dd } = lu("ARD_SET_PROPERTY"), Od = {
	display: "grid",
	gridTemplateColumns: "2fr 3fr",
	fontSize: "0.75rem",
	px: .5,
	py: "1px",
	userSelect: "none"
}, kd = {
	fontSize: "0.75rem",
	color: "text.secondary"
}, Ad = (e) => ({
	fontSize: "0.75rem",
	fontVariantNumeric: "tabular-nums",
	color: e ? "warning.main" : "text.primary"
}), jd = 60;
function Md(e) {
	return !Number.isFinite(e) || e <= 0 ? "—" : e < 1 ? "< 1 s" : e < 90 ? `${Math.round(e)} s` : e < 5400 ? `${Math.round(e / 60)} min` : `${(e / 3600).toFixed(1)} h`;
}
function Nd(e) {
	return Math.round(e).toLocaleString("en-US");
}
function Pd(e) {
	let t = [Nd(e.stepsPerRun)];
	return e.sources > 1 && t.push(`${e.sources} sources`), e.bands > 1 && t.push(`${e.bands} bands`), t.join(" x ");
}
function Fd({ label: e, value: t, tooltip: n, warn: r = !1 }) {
	return /* @__PURE__ */ B(V, {
		sx: Od,
		children: [/* @__PURE__ */ z(Yn, {
			title: n,
			placement: "left",
			children: /* @__PURE__ */ z(H, {
				sx: kd,
				children: e
			})
		}), /* @__PURE__ */ z(H, {
			sx: Ad(r),
			children: t
		})]
	});
}
var Id = ({ uuid: e }) => {
	let t = O((e) => e.containers), r = O((e) => e.version), i = f((e) => e.version), o = f((t) => t.solvers[e]), [s, c] = I(0), [l, u] = I(!1), d = P(() => Object.values(t).filter((e) => e.kind === "room").map((e) => ({
		value: e.uuid,
		label: e.name
	})), [t, r]), [p, m] = X(e, "roomID", "ARD_SET_PROPERTY"), [h, g] = X(e, "dimensions", "ARD_SET_PROPERTY"), [_, v] = X(e, "slice", "ARD_SET_PROPERTY"), [y, b] = X(e, "boundary", "ARD_SET_PROPERTY"), [x, S] = X(e, "sliceCoordinate", "ARD_SET_PROPERTY"), C = h === 2, w = x == null, ee = M((e) => {
		S({ value: e.value ? null : _ === "xy" ? 0 : 1.2 });
	}, [S, _]);
	N(() => n("ARD_PROGRESS", (t) => {
		t.uuid === e && (c(t.progress), u(t.progress > 0 && t.progress < 1));
	}), [e]);
	let T = M(() => {
		l ? (o?.cancel(), u(!1)) : a("CALCULATE_ARD", e);
	}, [
		l,
		o,
		e
	]), E = P(() => o ? {
		grid: o.estimatedGrid,
		dimensions: o.dimensions,
		slice: o.slice,
		cells: o.estimatedCellCount,
		simulated: o.estimatedSimulatedCells,
		steps: o.estimatedSteps,
		stepsPerRun: o.estimatedStepsPerRun,
		sources: Math.max(1, o.sourceIDs?.length ?? 0),
		seconds: o.estimatedSeconds,
		bands: o.bands.length,
		referenceFrequency: o.referenceFrequency,
		boundary: o.boundary,
		dx: o.cellSize
	} : null, [
		o,
		r,
		i
	]), te = (o?.sourceIDs?.length ?? 0) > 0 && (o?.receiverIDs?.length ?? 0) > 0;
	return /* @__PURE__ */ B("div", { children: [
		/* @__PURE__ */ z(ju, {
			onPlayPause: T,
			isRunning: l,
			canRun: !!p && te || l
		}),
		/* @__PURE__ */ z(Z, { label: "Estimated Cost" }),
		E ? /* @__PURE__ */ B(R, { children: [
			/* @__PURE__ */ z(Fd, {
				label: "Grid",
				value: E.dimensions === 2 ? `${E.slice} plane @ ${(E.dx * 100).toFixed(1)} cm` : `${E.grid.x} x ${E.grid.y} x ${E.grid.z} @ ${(E.dx * 100).toFixed(1)} cm`,
				tooltip: "Voxel grid the run would allocate, from the room's bounding box, and the cell size that follows from fMax and cells per wavelength. A 2D run still voxelizes the room in three dimensions — it takes one plane out of the result, so the air region matches what a 3D run would have used at that height."
			}),
			/* @__PURE__ */ z(Fd, {
				label: "Cells stepped",
				value: Nd(E.simulated),
				tooltip: E.boundary === "pml" ? "Air cells plus absorbing wall slabs — what actually costs time each step. Smaller than the allocated grid, most of which is padding for the slabs to grow into. Switching the boundary to impedance drops the slabs entirely, typically cutting this by two thirds." : "Air cells — what actually costs time each step. Impedance boundaries add none: they force cells the air region already contains."
			}),
			/* @__PURE__ */ z(Fd, {
				label: "Steps",
				value: Pd(E),
				tooltip: "Time steps per run, and how many runs there are. One full simulation per source — several sources at once would leave every receiver recording their sum — and, with per-band runs, one per octave band on top of that. Receivers are free: they are probes into a field being computed anyway."
			}),
			/* @__PURE__ */ z(Fd, {
				label: "Estimated time",
				value: Md(E.seconds),
				tooltip: E.boundary === "pml" ? "Rough, from measured throughput of about 1.25 million cell-steps per second on this boundary. An order of magnitude, not a quote — and it does not include voxelization or the per-thickness wall calibration. Note the rate is per stepped cell and a slab has two to five times as many of them, so a PML run is three to five times slower in wall clock than the same room on an impedance boundary." : "Rough, from measured throughput of about 1.0 million cell-steps per second on this boundary. An order of magnitude, not a quote. A room whose cell extents are all powers of two runs two to three times faster, because the DCT takes its radix-2 path instead of Bluestein.",
				warn: E.seconds > jd
			}),
			l && /* @__PURE__ */ z(Fd, {
				label: "Progress",
				value: `${Math.round(s * 100)}%`,
				tooltip: "Steps completed across every source and band in this run."
			})
		] }) : null,
		/* @__PURE__ */ z(Z, { label: "Room" }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Room",
			hasToolTip: !0,
			tooltip: "Room geometry to voxelize. The surfaces must enclose a volume — an open model leaks and the solver refuses to run."
		}), /* @__PURE__ */ z(ll, {
			value: p || "",
			onChange: m,
			options: d.length > 0 ? d : [{
				value: "",
				label: "No rooms available"
			}]
		})] }),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Dimensions",
			hasToolTip: !0,
			tooltip: "3D solves the room. 2D solves a plane through it — which is a different room, one that is uniform and unbounded along the collapsed axis: sound spreads as 1/sqrt(r) and there are no modes across the missing axis. It is the only mode that reaches 4 kHz on anything but a cupboard, and it is for seeing wavefronts in plan, not for reading a reverberation time."
		}), /* @__PURE__ */ z(ll, {
			value: String(h ?? 3),
			onChange: (e) => g({ value: Number(e.value) }),
			options: [{
				value: "3",
				label: "3D — the room"
			}, {
				value: "2",
				label: "2D — a plane through it"
			}]
		})] }),
		C && /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Plane",
			hasToolTip: !0,
			tooltip: "Which plane to cut. Floor plan collapses height; section collapses depth. The cut goes through the first source unless a height is set, since a source is inside the room by construction."
		}), /* @__PURE__ */ z(ll, {
			value: _ ?? "xz",
			onChange: v,
			options: [{
				value: "xz",
				label: "Floor plan (XZ)"
			}, {
				value: "xy",
				label: "Section (XY)"
			}]
		})] }),
		C && /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Cut at Source",
			hasToolTip: !0,
			tooltip: "Cut through the first source, which is inside the room by construction because it seeds the flood fill. Turn it off to set a height — useful on a building with more than one storey, where the source's own plane may not be the one you want."
		}), /* @__PURE__ */ z(Qc, {
			value: w,
			onChange: ee
		})] }), !w && /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: _ === "xy" ? "Cut at Z (m)" : "Cut at Y (m)",
			hasToolTip: !0,
			tooltip: "Where to cut, in metres along the collapsed axis. A plane outside the room — or in the padding the wall slabs grow into — falls back to the widest plane, and the run says which one it used."
		}), /* @__PURE__ */ z(il, {
			value: x ?? 0,
			onChange: S,
			step: .1
		})] })] }),
		/* @__PURE__ */ z(Z, { label: "Source / Receiver Pairs" }),
		/* @__PURE__ */ z(xu, {
			uuid: e,
			eventType: "ARD_SET_PROPERTY"
		}),
		/* @__PURE__ */ z(Z, { label: "Solver Settings" }),
		/* @__PURE__ */ z(Ed, {
			uuid: e,
			label: "Max Frequency",
			property: "fMax",
			tooltip: "Upper frequency limit in Hz, and the cost dial: the grid is c/(n·fMax), so cells go as fMax³ and steps as fMax — the run is O(fMax⁴). Doubling 1 kHz to 2 kHz is roughly sixteen times the work. The result carries nothing above about 1.3·fMax whatever sample rate it is written at.",
			elementProps: {
				step: 100,
				min: 50,
				max: 8e3
			}
		}),
		/* @__PURE__ */ z(Ed, {
			uuid: e,
			label: "Cells / Wavelength",
			property: "cellsPerWavelength",
			tooltip: "Spatial sampling density at fMax. ARD's headline property is that 2.6 is enough — its interior update is exact per mode, with no numerical dispersion to out-run. Raising it costs cells cubed and buys little.",
			elementProps: {
				step: .2,
				min: 2,
				max: 10
			}
		}),
		/* @__PURE__ */ z(Ed, {
			uuid: e,
			label: "Courant Number",
			property: "courant",
			tooltip: y === "pml" ? "Requested c·Δt/Δx. The DCT interior has no stability limit at all, but absorbing wall slabs do and every partition shares one time step, so on a 3D room this is capped near 0.446 however high you set it." : "Requested c·Δt/Δx. The DCT interior has no stability limit; impedance boundaries have a measured one of 0.55 − 0.05α, so a room of highly absorbing surfaces is capped at 0.50 and a live one at 0.55. Either way that is above the 0.446 a PML slab would impose.",
			elementProps: {
				step: .05,
				min: .05,
				max: 1
			}
		}),
		/* @__PURE__ */ z(Ed, {
			uuid: e,
			label: "IR Length",
			property: "irLength",
			tooltip: "Length of the impulse response in seconds. Steps scale linearly with it — make it long enough to hold the decay and no longer.",
			elementProps: {
				step: .1,
				min: .05,
				max: 10
			}
		}),
		/* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
			label: "Boundary",
			hasToolTip: !0,
			tooltip: "How a room surface absorbs. Impedance puts the condition on the face itself: no extra cells, no grid padding, a looser time step, and measurably closer to the material's absorption coefficient at every grid resolution tested. PML parks a graded absorbing slab outside each face — 2 to 5 times the room in cells, padding on every side to grow into, and a tighter cap on the Courant number. PML is kept because it is what the solver was originally validated against. Either way, a material's absorption coefficient is read as random-incidence (Sabine) absorption: each wall is built to absorb that fraction of a diffuse field, which is how the coefficients in the material database were measured."
		}), /* @__PURE__ */ z(ll, {
			value: y ?? "impedance",
			onChange: b,
			options: [{
				value: "impedance",
				label: "Impedance — on the face"
			}, {
				value: "pml",
				label: "PML — absorbing slab"
			}]
		})] }),
		y === "pml" && /* @__PURE__ */ z(Ed, {
			uuid: e,
			label: "Wall Thickness",
			property: "wallThickness",
			tooltip: "Absorbing layer depth in cells. Thicker reaches a higher absorption coefficient and costs proportionally more cells: 4 cells reach α 0.81, 8 reach 0.958, 20 reach 0.999 at roughly five times the room's own cell count.",
			elementProps: {
				step: 2,
				min: 4,
				max: 20
			}
		}),
		/* @__PURE__ */ z(Ed, {
			uuid: e,
			label: "Sample Rate",
			property: "sampleRate",
			tooltip: "Output sample rate in Hz. The simulation itself runs far slower than this — about 6.5 kHz at the defaults — so the result is upsampled on its way out and is band-limited whatever rate you choose.",
			elementProps: {
				step: 100,
				min: 8e3,
				max: 96e3
			}
		}),
		/* @__PURE__ */ z(Ed, {
			uuid: e,
			label: "Humidity",
			property: "humidity",
			tooltip: "Relative humidity in percent, for air attenuation. Temperature comes from the room.",
			elementProps: {
				step: 5,
				min: 0,
				max: 100
			}
		}),
		/* @__PURE__ */ z(Dd, {
			uuid: e,
			label: "Per-Band Runs",
			property: "perBandRuns",
			tooltip: `Run the simulation once per octave band with that band's absorption, then add the filtered results. ARD's boundary treatment is frequency-independent by construction, so this is the only way to honour a material's octave-band α — at one full run per band. Off, every surface uses its α at ${E?.referenceFrequency ?? 500} Hz.`
		})
	] });
}, Ld = _n`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`, Rd = {
	height: "100%",
	overflow: "auto",
	bgcolor: "background.paper"
}, zd = {
	py: .25,
	px: 1,
	"&.Mui-selected": {
		bgcolor: "primary.light",
		"&:hover": { bgcolor: "primary.light" }
	}
}, Bd = {
	p: 1,
	"& > *": { mb: .5 }
}, Vd = (e, t) => ({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	width: 24,
	height: 24,
	ml: .5,
	borderRadius: "50%",
	cursor: "pointer",
	bgcolor: e ? "primary.main" : "transparent",
	color: e ? "primary.contrastText" : "text.secondary",
	"&:hover": { bgcolor: e ? "primary.dark" : "action.hover" },
	"& svg": {
		fontSize: 16,
		animation: t ? `${Ld} 1s linear infinite` : "none"
	}
}), Hd = {
	"ray-tracer": Gu,
	"image-source": Ju,
	rt60: Xu,
	"energy-decay": Zu,
	energydecay: Zu,
	"beam-trace": ud,
	"fdtd-2d": Cd,
	art: Td,
	ard: Id
}, Ud = {
	"ray-tracer": "Monte Carlo ray tracing",
	"image-source": "Image source method",
	rt60: "Statistical reverberation",
	"fdtd-2d": "Finite-difference time-domain",
	energydecay: "Energy decay analysis",
	art: "Acoustic radiance transfer",
	ard: "Wave-based adaptive rectangular decomposition",
	"beam-trace": "Specular beam solver"
};
function Wd({ uuid: e, name: t, type: n, selected: r, onSelect: i, onRun: a, onDelete: o }) {
	return /* @__PURE__ */ z(Ln, {
		disablePadding: !0,
		sx: zd,
		secondaryAction: /* @__PURE__ */ B(V, {
			sx: {
				display: "flex",
				gap: .25
			},
			children: [/* @__PURE__ */ z(hn, {
				size: "small",
				onClick: a,
				color: "primary",
				sx: { p: .25 },
				children: /* @__PURE__ */ z($n, { sx: { fontSize: 16 } })
			}), /* @__PURE__ */ z(hn, {
				size: "small",
				onClick: o,
				sx: { p: .25 },
				children: /* @__PURE__ */ z(Hn, { sx: { fontSize: 16 } })
			})]
		}),
		children: /* @__PURE__ */ B(Sn, {
			onClick: i,
			selected: r,
			dense: !0,
			sx: { py: .25 },
			children: [/* @__PURE__ */ z(Rn, {
				sx: { minWidth: 28 },
				children: /* @__PURE__ */ z(qn, { fontSize: "small" })
			}), /* @__PURE__ */ z(zn, {
				primary: t,
				secondary: n,
				slotProps: {
					primary: {
						noWrap: !0,
						sx: { fontSize: "0.75rem" }
					},
					secondary: { sx: { fontSize: "0.625rem" } }
				}
			})]
		})
	});
}
function Gd() {
	let [e, t] = I(null), n = f((e) => e.solvers), r = k((e) => e.autoCalculate), i = k((e) => e.progress.visible), o = P(() => Object.keys(n).map((e) => ({
		uuid: e,
		name: n[e].name || e.slice(0, 8),
		type: Ud[n[e].kind] || n[e].kind || "Unknown"
	})), [n]), s = M((e) => {
		t(e);
	}, []), c = M((e) => {
		a("RUN_SOLVER", e);
	}, []), l = M((n) => {
		a("REMOVE_SOLVERS", n), e === n && t(null);
	}, [e]), u = M((e) => {
		e.stopPropagation(), a("SET_AUTO_CALCULATE", !r);
	}, [r]), d = e ? n[e] : null;
	return /* @__PURE__ */ B(V, {
		sx: Rd,
		children: [
			/* @__PURE__ */ B(V, {
				sx: {
					display: "flex",
					alignItems: "center",
					px: 1.5,
					py: .5,
					bgcolor: "action.hover"
				},
				children: [/* @__PURE__ */ B(H, {
					variant: "subtitle2",
					sx: {
						fontWeight: 600,
						fontSize: "0.75rem",
						flex: 1
					},
					children: [
						"Solvers (",
						o.length,
						")"
					]
				}), /* @__PURE__ */ z(Yn, {
					title: r ? "Auto-calculate ON" : "Auto-calculate OFF",
					children: /* @__PURE__ */ z(V, {
						component: "span",
						role: "button",
						tabIndex: 0,
						onClick: u,
						onKeyDown: (e) => {
							(e.key === "Enter" || e.key === " ") && u(e);
						},
						sx: Vd(r, r && i),
						children: /* @__PURE__ */ z(er, {})
					})
				})]
			}),
			/* @__PURE__ */ z(xn, {
				dense: !0,
				disablePadding: !0,
				children: o.map((t) => /* @__PURE__ */ z(Wd, {
					uuid: t.uuid,
					name: t.name,
					type: t.type,
					selected: e === t.uuid,
					onSelect: () => s(t.uuid),
					onRun: () => c(t.uuid),
					onDelete: () => l(t.uuid)
				}, t.uuid))
			}),
			d && /* @__PURE__ */ B(R, { children: [
				/* @__PURE__ */ z(mn, {}),
				/* @__PURE__ */ z(V, {
					sx: {
						px: 1.5,
						py: .5,
						bgcolor: "action.hover"
					},
					children: /* @__PURE__ */ B(H, {
						variant: "subtitle2",
						sx: {
							fontWeight: 600,
							fontSize: "0.75rem"
						},
						children: [d.name, " Settings"]
					})
				}),
				/* @__PURE__ */ z(V, {
					sx: Bd,
					children: (() => {
						if (!d) return null;
						let t = Hd[d.kind];
						return t ? /* @__PURE__ */ z(t, { uuid: e }) : /* @__PURE__ */ B(H, {
							variant: "body2",
							color: "text.secondary",
							children: ["Unknown solver type: ", d.kind]
						});
					})()
				})
			] })
		]
	});
}
// src/components/parameter-config/RendererTab.tsx
function Kd(e, t) {
	let [n, r] = I(T[e]);
	return [n, M((n) => {
		T[e] = n, t && t(T), r(n);
	}, [e, t])];
}
var qd = (e) => e.camera?.updateProjectionMatrix(), Jd = ({ label: e, property: t, tooltip: n, updateFn: r, min: i, max: a, step: o }) => {
	let [s, c] = Kd(t, r);
	return /* @__PURE__ */ z(bd, {
		id: t,
		label: e,
		labelPosition: "left",
		hasToolTip: !0,
		tooltipText: n,
		min: i,
		max: a,
		step: o,
		value: s,
		onChange: ({ value: e }) => c(e)
	});
}, Yd = ({ label: e, tooltip: t, property: n, onText: r, offText: i, updateFn: a }) => {
	let [o, s] = Kd(n, a);
	return /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
		label: e,
		tooltip: t
	}), /* @__PURE__ */ z(_l, {
		onClick: () => s(!o),
		label: o ? r : i
	})] });
}, Xd = ({ label: e, tooltip: t, property: n, updateFn: r }) => {
	let [i, a] = Kd(n, r);
	return /* @__PURE__ */ B(J, { children: [/* @__PURE__ */ z(Y, {
		label: e,
		tooltip: t
	}), /* @__PURE__ */ z(Qc, {
		value: i,
		onChange: (e) => a(e.value)
	})] });
}, Zd = () => {
	let [e, t] = ml(!0);
	return /* @__PURE__ */ B(Wc, {
		label: "Camera Properties",
		open: e,
		onOpenClose: t,
		children: [
			/* @__PURE__ */ z(Jd, {
				property: "fov",
				label: "Field of View",
				tooltip: "Sets the perspective camera's field of view",
				min: 1,
				max: 90,
				step: .1,
				updateFn: qd
			}),
			/* @__PURE__ */ z(Jd, {
				property: "zoom",
				label: "Zoom",
				tooltip: "Sets the orthographic camera's zoom",
				min: .001,
				max: 10,
				step: .001,
				updateFn: qd
			}),
			/* @__PURE__ */ z(Jd, {
				property: "near",
				label: "Near",
				tooltip: "Sets the camera's near clipping distance",
				min: .1,
				max: 50,
				step: .01,
				updateFn: qd
			}),
			/* @__PURE__ */ z(Jd, {
				property: "far",
				label: "Far",
				tooltip: "Sets the camera's far clipping distance",
				min: 1,
				max: 2e3,
				step: 1,
				updateFn: qd
			}),
			/* @__PURE__ */ z(Yd, {
				property: "isOrtho",
				label: "Camera Style",
				tooltip: "Toggles between perspective/orthographic",
				onText: "Orthographic",
				offText: "Perspective",
				updateFn: () => a("TOGGLE_CAMERA_ORTHO")
			})
		]
	});
}, Qd = () => {
	let [e, t] = ml(!0);
	return /* @__PURE__ */ B(Wc, {
		label: "Environment Properties",
		open: e,
		onOpenClose: t,
		children: [
			/* @__PURE__ */ z(Jd, {
				property: "fogDensity",
				label: "Fog Density",
				tooltip: "Sets the scene's fog density",
				min: .001,
				max: .1,
				step: .001,
				updateFn: () => T.needsToRender = !0
			}),
			/* @__PURE__ */ z(Xd, {
				property: "gridVisible",
				label: "Grid",
				tooltip: "Toggles the grid visibility"
			}),
			/* @__PURE__ */ z(Xd, {
				property: "axisVisible",
				label: "Axis",
				tooltip: "Toggles the axis visibility"
			})
		]
	});
}, $d = () => {
	let [e, t] = ml(!0);
	return /* @__PURE__ */ z(Wc, {
		label: "Editor Properties",
		open: e,
		onOpenClose: t,
		children: /* @__PURE__ */ z(Xd, {
			label: "Cursor",
			tooltip: "Toggles the cursor",
			property: "cursorVisible"
		})
	});
};
function ef() {
	return /* @__PURE__ */ B("div", { children: [
		/* @__PURE__ */ z(Zd, {}),
		/* @__PURE__ */ z(Qd, {}),
		/* @__PURE__ */ z($d, {})
	] });
}
// src/components/workbench/panels/RendererPanel.tsx
var tf = {
	height: "100%",
	overflow: "auto",
	bgcolor: "background.paper",
	p: 1
};
function nf() {
	let [e, t] = I(!!T.scene);
	return N(() => {
		if (e) return;
		let [n, r] = h.addMessageHandler("APP_MOUNTED", () => {
			t(!0);
		});
		return T.scene && t(!0), () => h.removeMessageHandler(n, r);
	}, [e]), e ? /* @__PURE__ */ z(V, {
		sx: tf,
		children: /* @__PURE__ */ z(ef, {})
	}) : null;
}
// node_modules/internmap/src/index.js
var rf = class extends Map {
	constructor(e, t = cf) {
		if (super(), Object.defineProperties(this, {
			_intern: { value: /* @__PURE__ */ new Map() },
			_key: { value: t }
		}), e != null) for (let [t, n] of e) this.set(t, n);
	}
	get(e) {
		return super.get(af(this, e));
	}
	has(e) {
		return super.has(af(this, e));
	}
	set(e, t) {
		return super.set(of(this, e), t);
	}
	delete(e) {
		return super.delete(sf(this, e));
	}
};
function af({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : n;
}
function of({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : (e.set(r, n), n);
}
function sf({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) && (n = e.get(r), e.delete(r)), n;
}
function cf(e) {
	return typeof e == "object" && e ? e.valueOf() : e;
}
// node_modules/d3-scale/src/init.js
function lf(e, t) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			this.range(e);
			break;
		default: this.range(t).domain(e);
	}
	return this;
}
// node_modules/d3-scale/src/ordinal.js
var uf = Symbol("implicit");
function df() {
	var e = new rf(), t = [], n = [], r = uf;
	function i(i) {
		let a = e.get(i);
		if (a === void 0) {
			if (r !== uf) return r;
			e.set(i, a = t.push(i) - 1);
		}
		return n[a % n.length];
	}
	return i.domain = function(n) {
		if (!arguments.length) return t.slice();
		t = [], e = new rf();
		for (let r of n) e.has(r) || e.set(r, t.push(r) - 1);
		return i;
	}, i.range = function(e) {
		return arguments.length ? (n = Array.from(e), i) : n.slice();
	}, i.unknown = function(e) {
		return arguments.length ? (r = e, i) : r;
	}, i.copy = function() {
		return df(t, n).unknown(r);
	}, lf.apply(i, arguments), i;
}
// node_modules/d3-time/src/interval.js
var ff = /* @__PURE__ */ new Date(), pf = /* @__PURE__ */ new Date();
function mf(e, t, n, r) {
	function i(t) {
		return e(t = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+t)), t;
	}
	return i.floor = (t) => (e(t = /* @__PURE__ */ new Date(+t)), t), i.ceil = (n) => (e(n = /* @__PURE__ */ new Date(n - 1)), t(n, 1), e(n), n), i.round = (e) => {
		let t = i(e), n = i.ceil(e);
		return e - t < n - e ? t : n;
	}, i.offset = (e, n) => (t(e = /* @__PURE__ */ new Date(+e), n == null ? 1 : Math.floor(n)), e), i.range = (n, r, a) => {
		let o = [];
		if (n = i.ceil(n), a = a == null ? 1 : Math.floor(a), !(n < r) || !(a > 0)) return o;
		let s;
		do
			o.push(s = /* @__PURE__ */ new Date(+n)), t(n, a), e(n);
		while (s < n && n < r);
		return o;
	}, i.filter = (n) => mf((t) => {
		if (t >= t) for (; e(t), !n(t);) t.setTime(t - 1);
	}, (e, r) => {
		if (e >= e) {
			if (r < 0) for (; ++r <= 0;) for (; t(e, -1), !n(e););
			else for (; --r >= 0;) for (; t(e, 1), !n(e););
		}
	}), n && (i.count = (t, r) => (ff.setTime(+t), pf.setTime(+r), e(ff), e(pf), Math.floor(n(ff, pf))), i.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? i.filter(r ? (t) => r(t) % e === 0 : (t) => i.count(0, t) % e === 0) : i)), i;
}
var hf = 6e4, gf = hf * 60 * 24, _f = gf * 7, vf = mf((e) => e.setHours(0, 0, 0, 0), (e, t) => e.setDate(e.getDate() + t), (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * hf) / gf, (e) => e.getDate() - 1);
vf.range;
var yf = mf((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / gf, (e) => e.getUTCDate() - 1);
yf.range, mf((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / gf, (e) => Math.floor(e / gf)).range;
// node_modules/d3-time/src/week.js
function bf(e) {
	return mf((t) => {
		t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setDate(e.getDate() + t * 7);
	}, (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * hf) / _f);
}
var xf = bf(0), Sf = bf(1), Cf = bf(2), wf = bf(3), Tf = bf(4), Ef = bf(5), Df = bf(6);
xf.range, Sf.range, Cf.range, wf.range, Tf.range, Ef.range, Df.range;
function Of(e) {
	return mf((t) => {
		t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setUTCDate(e.getUTCDate() + t * 7);
	}, (e, t) => (t - e) / _f);
}
var kf = Of(0), Af = Of(1), jf = Of(2), Mf = Of(3), Nf = Of(4), Pf = Of(5), Ff = Of(6);
kf.range, Af.range, jf.range, Mf.range, Nf.range, Pf.range, Ff.range;
// node_modules/d3-time/src/year.js
var If = mf((e) => {
	e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
	e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
If.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : mf((t) => {
	t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, n) => {
	t.setFullYear(t.getFullYear() + n * e);
}), If.range;
var Lf = mf((e) => {
	e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
Lf.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : mf((t) => {
	t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, n) => {
	t.setUTCFullYear(t.getUTCFullYear() + n * e);
}), Lf.range;
// node_modules/d3-time-format/src/locale.js
function Rf(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
		return t.setFullYear(e.y), t;
	}
	return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function zf(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
		return t.setUTCFullYear(e.y), t;
	}
	return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function Bf(e, t, n) {
	return {
		y: e,
		m: t,
		d: n,
		H: 0,
		M: 0,
		S: 0,
		L: 0
	};
}
function Vf(e) {
	var t = e.dateTime, n = e.date, r = e.time, i = e.periods, a = e.days, o = e.shortDays, s = e.months, c = e.shortMonths, l = Kf(i), u = qf(i), d = Kf(a), f = qf(a), p = Kf(o), m = qf(o), h = Kf(s), g = qf(s), _ = Kf(c), v = qf(c), y = {
		a: ae,
		A: oe,
		b: se,
		B: ce,
		c: null,
		d: mp,
		e: mp,
		f: yp,
		g: Ap,
		G: Mp,
		H: hp,
		I: gp,
		j: _p,
		L: vp,
		m: bp,
		M: xp,
		p: le,
		q: O,
		Q: tm,
		s: nm,
		S: Sp,
		u: Cp,
		U: wp,
		V: Ep,
		w: Dp,
		W: Op,
		x: null,
		X: null,
		y: kp,
		Y: jp,
		Z: Np,
		"%": em
	}, b = {
		a: ue,
		A: de,
		b: fe,
		B: pe,
		c: null,
		d: Pp,
		e: Pp,
		f: zp,
		g: Xp,
		G: Qp,
		H: Fp,
		I: Ip,
		j: Lp,
		L: Rp,
		m: Bp,
		M: Vp,
		p: me,
		q: k,
		Q: tm,
		s: nm,
		S: Hp,
		u: Up,
		U: Wp,
		V: Kp,
		w: qp,
		W: Jp,
		x: null,
		X: null,
		y: Yp,
		Y: Zp,
		Z: $p,
		"%": em
	}, x = {
		a: T,
		A: E,
		b: te,
		B: D,
		c: ne,
		d: ip,
		e: ip,
		f: up,
		g: ep,
		G: $f,
		H: op,
		I: op,
		j: ap,
		L: lp,
		m: rp,
		M: sp,
		p: ee,
		q: np,
		Q: fp,
		s: pp,
		S: cp,
		u: Yf,
		U: Xf,
		V: Zf,
		w: Jf,
		W: Qf,
		x: re,
		X: ie,
		y: ep,
		Y: $f,
		Z: tp,
		"%": dp
	};
	y.x = S(n, y), y.X = S(r, y), y.c = S(t, y), b.x = S(n, b), b.X = S(r, b), b.c = S(t, b);
	function S(e, t) {
		return function(n) {
			var r = [], i = -1, a = 0, o = e.length, s, c, l;
			for (n instanceof Date || (n = /* @__PURE__ */ new Date(+n)); ++i < o;) e.charCodeAt(i) === 37 && (r.push(e.slice(a, i)), (c = Hf[s = e.charAt(++i)]) == null ? c = s === "e" ? " " : "0" : s = e.charAt(++i), (l = t[s]) && (s = l(n, c)), r.push(s), a = i + 1);
			return r.push(e.slice(a, i)), r.join("");
		};
	}
	function C(e, t) {
		return function(n) {
			var r = Bf(1900, void 0, 1), i = w(r, e, n += "", 0), a, o;
			if (i != n.length) return null;
			if ("Q" in r) return new Date(r.Q);
			if ("s" in r) return new Date(r.s * 1e3 + ("L" in r ? r.L : 0));
			if (t && !("Z" in r) && (r.Z = 0), "p" in r && (r.H = r.H % 12 + r.p * 12), r.m === void 0 && (r.m = "q" in r ? r.q : 0), "V" in r) {
				if (r.V < 1 || r.V > 53) return null;
				"w" in r || (r.w = 1), "Z" in r ? (a = zf(Bf(r.y, 0, 1)), o = a.getUTCDay(), a = o > 4 || o === 0 ? Af.ceil(a) : Af(a), a = yf.offset(a, (r.V - 1) * 7), r.y = a.getUTCFullYear(), r.m = a.getUTCMonth(), r.d = a.getUTCDate() + (r.w + 6) % 7) : (a = Rf(Bf(r.y, 0, 1)), o = a.getDay(), a = o > 4 || o === 0 ? Sf.ceil(a) : Sf(a), a = vf.offset(a, (r.V - 1) * 7), r.y = a.getFullYear(), r.m = a.getMonth(), r.d = a.getDate() + (r.w + 6) % 7);
			} else ("W" in r || "U" in r) && ("w" in r || (r.w = "u" in r ? r.u % 7 : +("W" in r)), o = "Z" in r ? zf(Bf(r.y, 0, 1)).getUTCDay() : Rf(Bf(r.y, 0, 1)).getDay(), r.m = 0, r.d = "W" in r ? (r.w + 6) % 7 + r.W * 7 - (o + 5) % 7 : r.w + r.U * 7 - (o + 6) % 7);
			return "Z" in r ? (r.H += r.Z / 100 | 0, r.M += r.Z % 100, zf(r)) : Rf(r);
		};
	}
	function w(e, t, n, r) {
		for (var i = 0, a = t.length, o = n.length, s, c; i < a;) {
			if (r >= o) return -1;
			if (s = t.charCodeAt(i++), s === 37) {
				if (s = t.charAt(i++), c = x[s in Hf ? t.charAt(i++) : s], !c || (r = c(e, n, r)) < 0) return -1;
			} else if (s != n.charCodeAt(r++)) return -1;
		}
		return r;
	}
	function ee(e, t, n) {
		var r = l.exec(t.slice(n));
		return r ? (e.p = u.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function T(e, t, n) {
		var r = p.exec(t.slice(n));
		return r ? (e.w = m.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function E(e, t, n) {
		var r = d.exec(t.slice(n));
		return r ? (e.w = f.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function te(e, t, n) {
		var r = _.exec(t.slice(n));
		return r ? (e.m = v.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function D(e, t, n) {
		var r = h.exec(t.slice(n));
		return r ? (e.m = g.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function ne(e, n, r) {
		return w(e, t, n, r);
	}
	function re(e, t, r) {
		return w(e, n, t, r);
	}
	function ie(e, t, n) {
		return w(e, r, t, n);
	}
	function ae(e) {
		return o[e.getDay()];
	}
	function oe(e) {
		return a[e.getDay()];
	}
	function se(e) {
		return c[e.getMonth()];
	}
	function ce(e) {
		return s[e.getMonth()];
	}
	function le(e) {
		return i[+(e.getHours() >= 12)];
	}
	function O(e) {
		return 1 + ~~(e.getMonth() / 3);
	}
	function ue(e) {
		return o[e.getUTCDay()];
	}
	function de(e) {
		return a[e.getUTCDay()];
	}
	function fe(e) {
		return c[e.getUTCMonth()];
	}
	function pe(e) {
		return s[e.getUTCMonth()];
	}
	function me(e) {
		return i[+(e.getUTCHours() >= 12)];
	}
	function k(e) {
		return 1 + ~~(e.getUTCMonth() / 3);
	}
	return {
		format: function(e) {
			var t = S(e += "", y);
			return t.toString = function() {
				return e;
			}, t;
		},
		parse: function(e) {
			var t = C(e += "", !1);
			return t.toString = function() {
				return e;
			}, t;
		},
		utcFormat: function(e) {
			var t = S(e += "", b);
			return t.toString = function() {
				return e;
			}, t;
		},
		utcParse: function(e) {
			var t = C(e += "", !0);
			return t.toString = function() {
				return e;
			}, t;
		}
	};
}
var Hf = {
	"-": "",
	_: " ",
	0: "0"
}, Q = /^\s*\d+/, Uf = /^%/, Wf = /[\\^$*+?|[\]().{}]/g;
function $(e, t, n) {
	var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", a = i.length;
	return r + (a < n ? Array(n - a + 1).join(t) + i : i);
}
function Gf(e) {
	return e.replace(Wf, "\\$&");
}
function Kf(e) {
	return RegExp("^(?:" + e.map(Gf).join("|") + ")", "i");
}
function qf(e) {
	return new Map(e.map((e, t) => [e.toLowerCase(), t]));
}
function Jf(e, t, n) {
	var r = Q.exec(t.slice(n, n + 1));
	return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function Yf(e, t, n) {
	var r = Q.exec(t.slice(n, n + 1));
	return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function Xf(e, t, n) {
	var r = Q.exec(t.slice(n, n + 2));
	return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function Zf(e, t, n) {
	var r = Q.exec(t.slice(n, n + 2));
	return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function Qf(e, t, n) {
	var r = Q.exec(t.slice(n, n + 2));
	return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function $f(e, t, n) {
	var r = Q.exec(t.slice(n, n + 4));
	return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function ep(e, t, n) {
	var r = Q.exec(t.slice(n, n + 2));
	return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function tp(e, t, n) {
	var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
	return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function np(e, t, n) {
	var r = Q.exec(t.slice(n, n + 1));
	return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function rp(e, t, n) {
	var r = Q.exec(t.slice(n, n + 2));
	return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function ip(e, t, n) {
	var r = Q.exec(t.slice(n, n + 2));
	return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function ap(e, t, n) {
	var r = Q.exec(t.slice(n, n + 3));
	return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function op(e, t, n) {
	var r = Q.exec(t.slice(n, n + 2));
	return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function sp(e, t, n) {
	var r = Q.exec(t.slice(n, n + 2));
	return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function cp(e, t, n) {
	var r = Q.exec(t.slice(n, n + 2));
	return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function lp(e, t, n) {
	var r = Q.exec(t.slice(n, n + 3));
	return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function up(e, t, n) {
	var r = Q.exec(t.slice(n, n + 6));
	return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function dp(e, t, n) {
	var r = Uf.exec(t.slice(n, n + 1));
	return r ? n + r[0].length : -1;
}
function fp(e, t, n) {
	var r = Q.exec(t.slice(n));
	return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function pp(e, t, n) {
	var r = Q.exec(t.slice(n));
	return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function mp(e, t) {
	return $(e.getDate(), t, 2);
}
function hp(e, t) {
	return $(e.getHours(), t, 2);
}
function gp(e, t) {
	return $(e.getHours() % 12 || 12, t, 2);
}
function _p(e, t) {
	return $(1 + vf.count(If(e), e), t, 3);
}
function vp(e, t) {
	return $(e.getMilliseconds(), t, 3);
}
function yp(e, t) {
	return vp(e, t) + "000";
}
function bp(e, t) {
	return $(e.getMonth() + 1, t, 2);
}
function xp(e, t) {
	return $(e.getMinutes(), t, 2);
}
function Sp(e, t) {
	return $(e.getSeconds(), t, 2);
}
function Cp(e) {
	var t = e.getDay();
	return t === 0 ? 7 : t;
}
function wp(e, t) {
	return $(xf.count(If(e) - 1, e), t, 2);
}
function Tp(e) {
	var t = e.getDay();
	return t >= 4 || t === 0 ? Tf(e) : Tf.ceil(e);
}
function Ep(e, t) {
	return e = Tp(e), $(Tf.count(If(e), e) + (If(e).getDay() === 4), t, 2);
}
function Dp(e) {
	return e.getDay();
}
function Op(e, t) {
	return $(Sf.count(If(e) - 1, e), t, 2);
}
function kp(e, t) {
	return $(e.getFullYear() % 100, t, 2);
}
function Ap(e, t) {
	return e = Tp(e), $(e.getFullYear() % 100, t, 2);
}
function jp(e, t) {
	return $(e.getFullYear() % 1e4, t, 4);
}
function Mp(e, t) {
	var n = e.getDay();
	return e = n >= 4 || n === 0 ? Tf(e) : Tf.ceil(e), $(e.getFullYear() % 1e4, t, 4);
}
function Np(e) {
	var t = e.getTimezoneOffset();
	return (t > 0 ? "-" : (t *= -1, "+")) + $(t / 60 | 0, "0", 2) + $(t % 60, "0", 2);
}
function Pp(e, t) {
	return $(e.getUTCDate(), t, 2);
}
function Fp(e, t) {
	return $(e.getUTCHours(), t, 2);
}
function Ip(e, t) {
	return $(e.getUTCHours() % 12 || 12, t, 2);
}
function Lp(e, t) {
	return $(1 + yf.count(Lf(e), e), t, 3);
}
function Rp(e, t) {
	return $(e.getUTCMilliseconds(), t, 3);
}
function zp(e, t) {
	return Rp(e, t) + "000";
}
function Bp(e, t) {
	return $(e.getUTCMonth() + 1, t, 2);
}
function Vp(e, t) {
	return $(e.getUTCMinutes(), t, 2);
}
function Hp(e, t) {
	return $(e.getUTCSeconds(), t, 2);
}
function Up(e) {
	var t = e.getUTCDay();
	return t === 0 ? 7 : t;
}
function Wp(e, t) {
	return $(kf.count(Lf(e) - 1, e), t, 2);
}
function Gp(e) {
	var t = e.getUTCDay();
	return t >= 4 || t === 0 ? Nf(e) : Nf.ceil(e);
}
function Kp(e, t) {
	return e = Gp(e), $(Nf.count(Lf(e), e) + (Lf(e).getUTCDay() === 4), t, 2);
}
function qp(e) {
	return e.getUTCDay();
}
function Jp(e, t) {
	return $(Af.count(Lf(e) - 1, e), t, 2);
}
function Yp(e, t) {
	return $(e.getUTCFullYear() % 100, t, 2);
}
function Xp(e, t) {
	return e = Gp(e), $(e.getUTCFullYear() % 100, t, 2);
}
function Zp(e, t) {
	return $(e.getUTCFullYear() % 1e4, t, 4);
}
function Qp(e, t) {
	var n = e.getUTCDay();
	return e = n >= 4 || n === 0 ? Nf(e) : Nf.ceil(e), $(e.getUTCFullYear() % 1e4, t, 4);
}
function $p() {
	return "+0000";
}
function em() {
	return "%";
}
function tm(e) {
	return +e;
}
function nm(e) {
	return Math.floor(e / 1e3);
}
// node_modules/d3-time-format/src/defaultLocale.js
var rm, im, am;
om({
	dateTime: "%x, %X",
	date: "%-m/%-d/%Y",
	time: "%-I:%M:%S %p",
	periods: ["AM", "PM"],
	days: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	],
	shortDays: [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	months: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	shortMonths: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]
});
function om(e) {
	return rm = Vf(e), im = rm.format, am = rm.parse, rm.utcFormat, rm.utcParse, rm;
}
// src/components/results/LTPChart.tsx
var sm = (e) => e.time, cm = (e) => e.pressure[0], lm = (e, t) => [...Array(t - e)].map((t, n) => e + n), um = zt.scale(["#ff8a0b", "#000080"]).mode("lch"), dm = (e) => um.colors(e), fm = {
	display: "flex",
	flexDirection: "column"
}, pm = {
	display: "flex",
	justifyContent: "center"
}, mm = {
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	gap: 3,
	px: 2,
	py: .5
}, hm = {
	display: "flex",
	flex: 1
}, gm = () => {
	let [e, t] = I(0);
	return [e, () => t(e + 1)];
}, _m = ({ uuid: e, width: t = 400, height: r = 200, events: i = !1, plotOrders: a, solverKind: o, chartMode: s = "ltp", yRange: l = "auto" }) => {
	let { info: u, data: d, from: p } = oe(j((t) => c([
		"info",
		"data",
		"from"
	], t.results[e]))), [m, h] = gm(), [g, _] = I(d), v = P(() => !g || !a ? g : g.filter((e) => a.includes(e.order)), [g, a]);
	N(() => n("UPDATE_RESULT", (t) => {
		t.uuid === e && _(t.result.data);
	}), [e]);
	let y = t - 60, b = r - 60, x = P(() => _r({
		range: [0, y],
		domain: [0, g && g.length > 0 ? Math.max(...g.map(sm)) : 1]
	}), [y, g]), S = P(() => {
		if (!g || g.length === 0) return _r({
			range: [b, 0],
			domain: [0, 1]
		});
		let e = Math.max(...g.map(cm)), t = l === "auto" ? Math.min(...g.map(cm)) * .75 : e - l;
		return _r({
			range: [b, 0],
			domain: [t, e]
		});
	}, [
		b,
		g,
		l
	]), C = P(() => df(lm(0, u.maxOrder + 1), dm(u.maxOrder + 1)), [u.maxOrder]), w = P(() => v ? [...v].sort((e, t) => sm(e) - sm(t)) : [], [v]);
	return !g || g.length === 0 ? /* @__PURE__ */ z("svg", {
		width: t,
		height: r,
		children: /* @__PURE__ */ z("text", {
			x: t / 2,
			y: r / 2,
			textAnchor: "middle",
			children: "No data yet - click \"Update\" to calculate"
		})
	}) : /* @__PURE__ */ B("svg", {
		width: t,
		height: r,
		children: [
			/* @__PURE__ */ z(xr, {
				xScale: x,
				yScale: S,
				width: y,
				height: b,
				left: 60
			}),
			s === "etc" ? /* @__PURE__ */ z(hr, {
				left: 60,
				children: /* @__PURE__ */ z(mr, {
					data: w,
					x: (e) => x(sm(e)),
					y: (e) => S(cm(e)),
					stroke: "#2563eb",
					strokeWidth: 1.5
				})
			}) : /* @__PURE__ */ z(hr, { children: v.map((e) => {
				let t = sm(e), n = b - S(cm(e)), r = x(t) + 60, a = b - n;
				return /* @__PURE__ */ z(fr, {
					x: r,
					y: a,
					width: 3,
					height: n,
					fill: C(e.order),
					className: "test-bar-class",
					onMouseOver: () => {},
					onClick: () => {
						if (!i) return;
						let t = f.getState().solvers[p];
						t && "toggleRayPathHighlight" in t && t.toggleRayPathHighlight(e.uuid);
					}
				}, `bar-${e.arrival}`);
			}) }),
			/* @__PURE__ */ z(yr, {
				scale: x,
				top: b,
				left: 60,
				label: "Time (s)"
			}),
			/* @__PURE__ */ z(br, {
				scale: S,
				left: 60,
				label: s === "etc" ? "Energy (dB)" : "Sound Pressure Level (dB re: 20uPa)"
			})
		]
	});
}, vm = ({ uuid: e, width: t = 400, height: r = 300, events: i = !1 }) => {
	let { name: o, info: s, from: l } = oe(j((t) => c([
		"name",
		"info",
		"from"
	], t.results[e]))), u = f((e) => e.solvers[l]), d = u?.frequencies ?? [
		125,
		250,
		500,
		1e3,
		2e3,
		4e3,
		8e3
	], p = u?.kind, [m, h] = I([0, s.maxOrder]), [g, _] = I(s.maxOrder), [v, y] = I("ltp"), [b, x] = I("auto"), S = P(() => Array.from({ length: m[1] - m[0] + 1 }, (e, t) => m[0] + t), [m]);
	return N(() => n("UPDATE_RESULT", (t) => {
		if (t.uuid === e) {
			let e = t.result.info.maxOrder;
			_(e), h((t) => [t[0], Math.max(t[1], e)]);
		}
	}), [e]), N(() => {
		let e = n("IMAGESOURCE_SET_PROPERTY", (e) => {
			if (e.uuid === l && e.property === "plotOrders") {
				let t = e.value;
				t.length > 0 && h([Math.min(...t), Math.max(...t)]);
			}
		}), t = n("BEAMTRACE_SET_PROPERTY", (e) => {
			if (e.uuid === l && e.property === "plotOrders") {
				let t = e.value;
				t.length > 0 && h([Math.min(...t), Math.max(...t)]);
			}
		});
		return () => {
			e(), t();
		};
	}, [l]), t < 10 ? null : /* @__PURE__ */ B(V, {
		sx: fm,
		children: [
			/* @__PURE__ */ z(H, {
				sx: pm,
				children: o
			}),
			/* @__PURE__ */ B(V, {
				sx: mm,
				children: [
					/* @__PURE__ */ B(nr, {
						value: v,
						exclusive: !0,
						onChange: (e, t) => {
							t && y(t);
						},
						size: "small",
						children: [/* @__PURE__ */ z(tr, {
							value: "ltp",
							children: "LTP"
						}), /* @__PURE__ */ z(tr, {
							value: "etc",
							children: "ETC"
						})]
					}),
					/* @__PURE__ */ z(H, {
						variant: "body2",
						sx: { whiteSpace: "nowrap" },
						children: "Orders"
					}),
					/* @__PURE__ */ z(sr, {
						value: m,
						onChange: (e, t) => {
							let n = t;
							h(n);
							let r = Array.from({ length: n[1] - n[0] + 1 }, (e, t) => n[0] + t);
							a(p === "beam-trace" ? "BEAMTRACE_SET_PROPERTY" : "IMAGESOURCE_SET_PROPERTY", {
								uuid: l,
								property: "plotOrders",
								value: r
							});
						},
						min: 0,
						max: g,
						marks: !0,
						valueLabelDisplay: "auto",
						disableSwap: !0,
						sx: {
							minWidth: 200,
							maxWidth: 300
						}
					}),
					/* @__PURE__ */ z(H, {
						variant: "body2",
						sx: { whiteSpace: "nowrap" },
						children: "Y Range"
					}),
					/* @__PURE__ */ z(wr, {
						size: "small",
						children: /* @__PURE__ */ B(Qn, {
							value: b,
							onChange: (e) => x(e.target.value),
							sx: {
								bgcolor: "background.paper",
								minWidth: 90,
								fontSize: "0.75rem",
								height: 24,
								"& .MuiSelect-select": {
									py: .25,
									px: 1
								}
							},
							MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } },
							children: [
								/* @__PURE__ */ z(pn, {
									value: "auto",
									sx: {
										fontSize: "0.75rem",
										py: .5
									},
									children: "Auto"
								}),
								/* @__PURE__ */ z(pn, {
									value: 10,
									sx: {
										fontSize: "0.75rem",
										py: .5
									},
									children: "10 dB"
								}),
								/* @__PURE__ */ z(pn, {
									value: 20,
									sx: {
										fontSize: "0.75rem",
										py: .5
									},
									children: "20 dB"
								}),
								/* @__PURE__ */ z(pn, {
									value: 30,
									sx: {
										fontSize: "0.75rem",
										py: .5
									},
									children: "30 dB"
								})
							]
						})
					}),
					/* @__PURE__ */ z(H, {
						variant: "body2",
						sx: { whiteSpace: "nowrap" },
						children: "Octave Band"
					}),
					/* @__PURE__ */ z(wr, {
						size: "small",
						children: /* @__PURE__ */ z(Qn, {
							value: s.frequency[0],
							onChange: (e) => {
								a(p === "beam-trace" ? "BEAMTRACE_SET_PROPERTY" : "IMAGESOURCE_SET_PROPERTY", {
									uuid: l,
									property: "plotFrequency",
									value: e.target.value
								});
							},
							sx: {
								bgcolor: "background.paper",
								minWidth: 100,
								fontSize: "0.75rem",
								height: 24,
								"& .MuiSelect-select": {
									py: .25,
									px: 1
								}
							},
							MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } },
							children: d.map((e) => /* @__PURE__ */ B(pn, {
								value: e,
								sx: {
									fontSize: "0.75rem",
									py: .5
								},
								children: [e, " Hz"]
							}, e))
						})
					})
				]
			}),
			/* @__PURE__ */ z(V, {
				sx: hm,
				children: /* @__PURE__ */ z(Cr, {
					debounceTime: 10,
					children: ({ width: t }) => /* @__PURE__ */ z(_m, {
						width: t,
						height: r,
						uuid: e,
						events: i,
						plotOrders: S,
						solverKind: p,
						chartMode: v,
						yRange: b
					})
				})
			})
		]
	});
}, ym = "#48beff", bm = "#43c593", xm = "#14453d", Sm = "#000000";
am("%Y-%m-%d"), im("%b %d");
var Cm = (e) => e.frequency.toString(), wm = {
	display: "flex",
	flexDirection: "column"
}, Tm = {
	display: "flex",
	justifyContent: "center"
}, Em = {
	display: "flex",
	flexDirection: "row",
	flex: 1
}, Dm = {
	display: "flex",
	flex: 8,
	width: "80%"
}, Om = () => {
	let [e, t] = I(0);
	return [e, () => t(e + 1)];
}, km = ({ uuid: e, width: t = 500, height: r = 300, events: i = !1 }) => {
	let { data: a } = oe(j((t) => c(["data"], t.results[e]))), [o, s] = Om(), [l, u] = I(a), d = Object.keys(l[0]).filter((e) => e !== "frequency"), f = gr({
		domain: l.map(Cm),
		padding: .2
	}), p = gr({
		domain: d,
		padding: .1
	}), m = _r({ domain: [0, Math.round(Math.max(...l.map((e) => Math.max(...d.map((t) => Number(e[t]))))) * 1.5 * 10) / 10] }), h = vr({
		domain: d,
		range: [
			ym,
			bm,
			xm
		]
	});
	N(() => n("UPDATE_RESULT", (t) => {
		t.uuid === e && u(t.result.data);
	}), [e]);
	let g = t - 60, _ = r - 30;
	return f.rangeRound([0, g]), p.rangeRound([0, f.bandwidth()]), m.range([_, 0]), console.log(l), t < 10 ? null : /* @__PURE__ */ B("svg", {
		width: t,
		height: r,
		children: [
			/* @__PURE__ */ z(Sr, {
				scale: m,
				width: g,
				height: _,
				left: 60
			}),
			/* @__PURE__ */ z(hr, {
				left: 60,
				children: /* @__PURE__ */ z(pr, {
					data: l,
					keys: d,
					height: _,
					x0: Cm,
					x0Scale: f,
					x1Scale: p,
					yScale: m,
					color: h,
					children: (e) => e.map((e) => /* @__PURE__ */ z(hr, {
						left: e.x0,
						children: e.bars.map((t) => /* @__PURE__ */ z("rect", {
							x: t.x,
							y: t.y,
							width: 15,
							height: t.height,
							fill: t.color,
							rx: 4,
							onClick: () => {
								if (!i) return;
								let { key: e, value: n } = t;
								alert(JSON.stringify({
									key: e,
									value: n
								}));
							}
						}, `bar-group-bar-${e.index}-${t.index}-${t.value}-${t.key}`))
					}, `bar-group-${e.index}-${e.x0}`))
				})
			}),
			/* @__PURE__ */ z(yr, {
				top: _,
				left: 60,
				scale: f,
				stroke: Sm,
				tickStroke: Sm,
				label: "Octave Band (Hz)",
				tickLabelProps: () => ({
					fill: Sm,
					fontSize: 11,
					textAnchor: "middle"
				})
			}),
			/* @__PURE__ */ z(br, {
				scale: m,
				stroke: Sm,
				left: 60,
				tickStroke: Sm,
				label: "Reverberation Time (s)",
				tickLabelProps: () => ({
					fill: Sm,
					fontSize: 11,
					textAnchor: "end"
				})
			})
		]
	});
}, Am = ({ uuid: e, width: t = 500, height: n = 300, events: r = !1 }) => {
	let { data: i } = oe(j((t) => c(["data"], t.results[e]))), a = Object.keys(i[0]).filter((e) => e !== "frequency"), o = vr({
		domain: a,
		range: [
			ym,
			bm,
			xm
		]
	});
	function s(e) {
		switch (e) {
			case "sabine": return "Sabine";
			case "eyring": return "Norris-Eyring";
			case "ap": return "Arau-Puchades";
			default: return "error";
		}
	}
	return t < 10 ? null : /* @__PURE__ */ B(V, {
		sx: wm,
		children: [/* @__PURE__ */ z(H, {
			sx: Tm,
			children: "Statistical RT60 Results"
		}), /* @__PURE__ */ B(V, {
			sx: Em,
			children: [/* @__PURE__ */ z(V, {
				sx: Dm,
				children: /* @__PURE__ */ z(km, {
					width: t,
					height: n,
					uuid: e,
					events: r
				})
			}), /* @__PURE__ */ z(V, {
				sx: wm,
				children: /* @__PURE__ */ z(Tr, {
					scale: o,
					labelFormat: (e) => s(e)
				})
			})]
		})]
	});
}, jm = {
	display: "flex",
	flexDirection: "column"
}, Mm = {
	display: "flex",
	justifyContent: "center"
}, Nm = {
	display: "flex",
	flexDirection: "row",
	flex: 1
}, Pm = {
	display: "flex",
	flex: 8,
	width: "100%"
}, Fm = {
	display: "flex",
	flexDirection: "column",
	p: "8px 16px",
	fontSize: 12
}, Im = (e) => e.time, Lm = (e) => e.amplitude, Rm = ({ uuid: e, width: t = 400, height: r = 200 }) => {
	let { data: i } = oe(j((t) => c(["data"], t.results[e]))), [a, o] = I(i);
	N(() => n("UPDATE_RESULT", (t) => {
		t.uuid === e && o(t.result.data);
	}), [e]);
	let s = t - 60, l = r - 60;
	if (!a || a.length === 0) return /* @__PURE__ */ z("svg", {
		width: t,
		height: r,
		children: /* @__PURE__ */ z("text", {
			x: t / 2,
			y: r / 2,
			textAnchor: "middle",
			children: "No impulse response data"
		})
	});
	let u = Math.max(...a.map(Im)), d = Math.max(...a.map((e) => Math.abs(e.amplitude)));
	if (!Number.isFinite(u) || u <= 0 || !Number.isFinite(d) || d <= 0) return /* @__PURE__ */ z("svg", {
		width: t,
		height: r,
		children: /* @__PURE__ */ z("text", {
			x: t / 2,
			y: r / 2,
			textAnchor: "middle",
			children: "Invalid impulse response data"
		})
	});
	let f = _r({
		range: [0, s],
		domain: [0, u]
	}), p = _r({
		range: [l, 0],
		domain: [-d, d]
	});
	return /* @__PURE__ */ B("svg", {
		width: t,
		height: r,
		children: [
			/* @__PURE__ */ z(xr, {
				xScale: f,
				yScale: p,
				width: s,
				height: l,
				left: 60
			}),
			/* @__PURE__ */ z(hr, {
				left: 60,
				children: /* @__PURE__ */ z(mr, {
					data: a,
					x: (e) => f(Im(e)),
					y: (e) => p(Lm(e)),
					stroke: "#2563eb",
					strokeWidth: 1
				})
			}),
			/* @__PURE__ */ z(yr, {
				scale: f,
				top: l,
				left: 60,
				label: "Time (s)"
			}),
			/* @__PURE__ */ z(br, {
				scale: p,
				left: 60,
				label: "Amplitude"
			})
		]
	});
}, zm = ({ uuid: e, width: t = 400, height: n = 300, events: r = !1 }) => {
	let { name: i, info: a, kind: o } = oe(j((t) => c([
		"name",
		"info",
		"kind"
	], t.results[e]))), s = o === de.EnergyDecay, l = s ? a.binRate : a.sampleRate;
	return t < 10 ? null : /* @__PURE__ */ B(V, {
		sx: jm,
		children: [/* @__PURE__ */ z(H, {
			sx: Mm,
			children: i
		}), /* @__PURE__ */ B(V, {
			sx: Nm,
			children: [/* @__PURE__ */ z(V, {
				sx: Pm,
				children: /* @__PURE__ */ z(Cr, {
					debounceTime: 10,
					children: ({ width: t }) => /* @__PURE__ */ z(Rm, {
						width: t,
						height: n,
						uuid: e,
						events: r
					})
				})
			}), /* @__PURE__ */ B(V, {
				sx: Fm,
				children: [
					/* @__PURE__ */ B("div", { children: [
						/* @__PURE__ */ z("b", { children: "Source:" }),
						" ",
						a.sourceName
					] }),
					/* @__PURE__ */ B("div", { children: [
						/* @__PURE__ */ z("b", { children: "Receiver:" }),
						" ",
						a.receiverName
					] }),
					/* @__PURE__ */ B("div", { children: [
						/* @__PURE__ */ B("b", { children: [s ? "Energy bin rate" : "Sample Rate", ":"] }),
						" ",
						l,
						" Hz"
					] }),
					s && /* @__PURE__ */ z("div", { children: "Broadband energy envelope — not a convolutable IR" })
				]
			})]
		})]
	});
}, Bm = {
	height: "100%",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	color: "#b4b8bb"
};
function Vm({ children: e }) {
	return /* @__PURE__ */ z(V, {
		sx: Bm,
		children: e
	});
}
// src/components/ResultsPanel.tsx
var Hm = {
	minHeight: 28,
	bgcolor: "action.hover",
	borderBottom: 1,
	borderColor: "divider",
	"& .MuiTabs-indicator": { height: 2 }
}, Um = {
	minHeight: 28,
	py: 0,
	px: 1.5,
	fontSize: "0.75rem",
	textTransform: "none",
	minWidth: 0
}, Wm = Vt(({ uuid: e }) => {
	let t = oe((t) => t.results[e].name);
	return /* @__PURE__ */ z("span", { children: t });
}), Gm = (e) => Object.keys(e.results), Km = () => {
	let e = oe(j(Gm)), [t, r] = I(0), i = M((e) => {
		setTimeout(() => {
			let t = Object.keys(oe.getState().results).indexOf(e);
			t !== -1 && r(t);
		}, 0);
	}, []);
	N(() => n("ADD_RESULT", (e) => {
		Object.keys(oe.getState().results).length === 1 && i(e.uuid);
	}), [i]), N(() => n("SELECT_RESULT_TAB", (e) => i(e)), [i]);
	let a = Math.min(t, Math.max(e.length - 1, 0)), o = e[a];
	return e.length > 0 ? /* @__PURE__ */ B(V, {
		sx: {
			height: "100%",
			display: "flex",
			flexDirection: "column"
		},
		children: [/* @__PURE__ */ z(ur, {
			value: a,
			onChange: (e, t) => r(t),
			variant: "scrollable",
			scrollButtons: "auto",
			sx: Hm,
			children: e.map((e) => /* @__PURE__ */ z(dr, {
				label: /* @__PURE__ */ z(Wm, { uuid: e }),
				sx: Um
			}, e))
		}), /* @__PURE__ */ z(V, {
			sx: {
				flex: 1,
				overflow: "auto"
			},
			children: o && /* @__PURE__ */ z(qm, { uuid: o })
		})]
	}) : /* @__PURE__ */ z(Vm, { children: "No Results Yet!" });
}, qm = Vt(({ uuid: e }) => {
	switch (oe((t) => t.results[e]?.kind)) {
		case "linear-time-progression": return /* @__PURE__ */ z(vm, {
			uuid: e,
			events: !0
		});
		case "statisticalRT60": return /* @__PURE__ */ z(Am, {
			uuid: e,
			events: !0
		});
		case "impulseResponse":
		case "energyDecay": return /* @__PURE__ */ z(zm, {
			uuid: e,
			events: !0
		});
		default: return null;
	}
}), Jm = {
	height: "100%",
	overflow: "auto",
	bgcolor: "background.paper"
};
function Ym() {
	return /* @__PURE__ */ z(V, {
		sx: Jm,
		children: /* @__PURE__ */ z(Km, {})
	});
}
// src/components/workbench/WorkbenchLayout.tsx
var Xm = "flexlayout";
function Zm() {
	try {
		let e = w.getItem(Xm);
		if (e) return JSON.parse(e);
	} catch (e) {
		console.warn("[WorkbenchLayout] Failed to parse stored layout:", e);
	}
	return Fc;
}
function Qm() {
	let e = F(null), t = F(null);
	t.current === null && (t.current = In.fromJson(Zm()));
	let r = t.current, i = M((e) => {
		let t = e.getComponent();
		switch (t) {
			case "CanvasPanel": return /* @__PURE__ */ z(zc, {});
			case "ObjectsPanel": return /* @__PURE__ */ z(su, {});
			case "SolversPanel": return /* @__PURE__ */ z(Gd, {});
			case "RendererPanel": return /* @__PURE__ */ z(nf, {});
			case "ResultsPanel": return /* @__PURE__ */ z(Ym, {});
			default: return /* @__PURE__ */ B("div", {
				style: {
					padding: 16,
					color: "var(--mui-palette-text-secondary)"
				},
				children: ["Unknown component: ", t]
			});
		}
	}, []), a = M((e) => {
		try {
			let t = e.toJson();
			w.setItem(Xm, JSON.stringify(t));
		} catch (e) {
			console.warn("[WorkbenchLayout] Failed to persist layout:", e);
		}
	}, []);
	return N(() => n("TOGGLE_RESULTS_PANEL", () => {
		r && r.getNodeById(Ic.RESULTS) && r.doAction(Pn.selectTab(Ic.RESULTS));
	}), [r]), N(() => n("RESET_LAYOUT", () => {
		w.removeItem(Xm);
		let n = In.fromJson(Fc);
		t.current = n, e.current && window.location.reload();
	}), []), /* @__PURE__ */ z("div", {
		style: {
			flex: 1,
			position: "relative",
			overflow: "hidden"
		},
		children: /* @__PURE__ */ z(Fn, {
			ref: e,
			model: r,
			factory: i,
			onModelChange: a,
			realtimeResize: !0
		})
	});
}
// src/components/App.tsx
function $m({ showNavBar: e = !0, onMount: t }) {
	let n = F(t);
	return N(() => {
		n.current?.();
	}, []), /* @__PURE__ */ B("div", {
		style: {
			width: "100%",
			height: "100%",
			display: "flex",
			flexDirection: "column"
		},
		children: [
			e && /* @__PURE__ */ z(Ks, {}),
			/* @__PURE__ */ z(ec, {}),
			/* @__PURE__ */ z(oc, {}),
			/* @__PURE__ */ z(Pc, {}),
			/* @__PURE__ */ z(Cs, {}),
			/* @__PURE__ */ z(ws, {}),
			/* @__PURE__ */ z(Qm, {})
		]
	});
}
// src/lib/CRAMEditor.tsx
var eh = Bt(function(e, t) {
	let { initialProject: n, onSave: r, onProjectChange: i, onError: o, storagePrefix: s = "cram", showNavBar: c = !0, themeMode: l } = e, u = F(!1);
	S(s);
	let d = M(() => {
		let e = h.postMessage("SAVE_CONTAINERS")[0] || [], t = h.postMessage("SAVE_SOLVERS")[0] || [], { projectName: n, version: r } = k.getState();
		return {
			meta: {
				version: r,
				name: n,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			},
			containers: e,
			solvers: t
		};
	}, []);
	return N(() => {
		if (i) return k.subscribe((e, t) => {
			if (e.hasUnsavedChanges && !t.hasUnsavedChanges) try {
				let e = d();
				i(e);
			} catch (e) {
				o?.(e);
			}
		});
	}, [
		i,
		o,
		d
	]), N(() => {
		n && u.current && a("RESTORE", { json: n });
	}, [n]), N(() => {
		l && a("SET_THEME_MODE", l);
	}, [l]), N(() => (u.current = !0, () => {
		console.log("[CRAMEditor] Unmounting - cleaning up resources..."), u.current = !1;
		try {
			T.dispose();
		} catch (e) {
			console.warn("[CRAMEditor] Error disposing renderer:", e);
		}
		try {
			h.clear();
		} catch (e) {
			console.warn("[CRAMEditor] Error clearing messenger:", e);
		}
		try {
			ge();
		} catch (e) {
			console.warn("[CRAMEditor] Error resetting stores:", e);
		}
		console.log("[CRAMEditor] Cleanup complete");
	}), []), Ht(t, () => ({
		newProject: () => {
			a("NEW", void 0);
		},
		save: () => {
			let e = d();
			return r?.(e), e;
		},
		load: (e) => {
			h.postMessage("RESTORE", { json: e });
		},
		openExample: (e) => {
			a("OPEN_EXAMPLE", e);
		},
		importFile: async (e) => new Promise((t, n) => {
			try {
				h.postMessage("IMPORT_FILE", [e]), setTimeout(t, 100);
			} catch (e) {
				n(e);
			}
		}),
		addSource: () => {
			h.postMessage("SHOULD_ADD_SOURCE");
		},
		addReceiver: () => {
			h.postMessage("SHOULD_ADD_RECEIVER");
		},
		addSolver: (e) => {
			let t = {
				raytracer: "SHOULD_ADD_RAYTRACER",
				"image-source": "SHOULD_ADD_IMAGE_SOURCE",
				"beam-trace": "SHOULD_ADD_BEAMTRACE",
				"fdtd-2d": "SHOULD_ADD_FDTD_2D",
				rt60: "SHOULD_ADD_RT60",
				"energy-decay": "SHOULD_ADD_ENERGYDECAY",
				art: "SHOULD_ADD_ART",
				ard: "SHOULD_ADD_ARD"
			}[e];
			t && h.postMessage(t);
		},
		undo: () => {
			h.postMessage("UNDO");
		},
		redo: () => {
			h.postMessage("REDO");
		},
		toggleResultsPanel: () => {
			a("TOGGLE_RESULTS_PANEL", void 0);
		}
	}), [d, r]), /* @__PURE__ */ z($m, { showNavBar: c });
}), th = {
	position: "relative",
	width: "100%",
	height: "100%",
	userSelect: "none",
	overflow: "hidden"
}, nh = Bt(function(e, t) {
	let { initialProject: n, onSave: r, onProjectChange: i, onError: o, storagePrefix: s = "cram" } = e, c = F(null), l = F(null), u = F(null), d = F(null), f = F(!1);
	S(s);
	let p = M(() => {
		let e = h.postMessage("SAVE_CONTAINERS")[0] || [], t = h.postMessage("SAVE_SOLVERS")[0] || [], { projectName: n, version: r } = k.getState();
		return {
			meta: {
				version: r,
				name: n,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			},
			containers: e,
			solvers: t
		};
	}, []);
	return N(() => {
		if (i) return k.subscribe((e, t) => {
			if (e.hasUnsavedChanges && !t.hasUnsavedChanges) try {
				let e = p();
				i(e);
			} catch (e) {
				o?.(e);
			}
		});
	}, [
		i,
		o,
		p
	]), N(() => {
		n && f.current && a("RESTORE", { json: n });
	}, [n]), N(() => {
		c.current && h.postMessage("APP_MOUNTED", c.current), f.current = !0;
		let e = c.current?.parentElement, t = null;
		return e && (t = new ResizeObserver(() => {
			T.checkresize(), T.needsToRender = !0;
		}), t.observe(e)), () => {
			console.log("[CRAMCanvas] Unmounting - cleaning up resources..."), f.current = !1, t && t.disconnect();
			try {
				T.dispose();
			} catch (e) {
				console.warn("[CRAMCanvas] Error disposing renderer:", e);
			}
			try {
				h.clear();
			} catch (e) {
				console.warn("[CRAMCanvas] Error clearing messenger:", e);
			}
			try {
				ge();
			} catch (e) {
				console.warn("[CRAMCanvas] Error resetting stores:", e);
			}
			console.log("[CRAMCanvas] Cleanup complete");
		};
	}, []), Ht(t, () => ({
		newProject: () => {
			a("NEW", void 0);
		},
		save: () => {
			let e = p();
			return r?.(e), e;
		},
		load: (e) => {
			a("RESTORE", { json: e });
		},
		importFile: async (e) => new Promise((t, n) => {
			try {
				h.postMessage("IMPORT_FILE", [e]), setTimeout(t, 100);
			} catch (e) {
				n(e);
			}
		}),
		addSource: () => {
			h.postMessage("SHOULD_ADD_SOURCE");
		},
		addReceiver: () => {
			h.postMessage("SHOULD_ADD_RECEIVER");
		},
		addSolver: (e) => {
			let t = {
				raytracer: "SHOULD_ADD_RAYTRACER",
				"image-source": "SHOULD_ADD_IMAGE_SOURCE",
				"beam-trace": "SHOULD_ADD_BEAMTRACE",
				"fdtd-2d": "ADD_FDTD_2D",
				rt60: "SHOULD_ADD_RT60",
				"energy-decay": "SHOULD_ADD_ENERGYDECAY",
				art: "ADD_ART",
				ard: "ADD_ARD"
			}[e];
			t && (t.startsWith("SHOULD_") ? h.postMessage(t) : a(t, void 0));
		},
		undo: () => {
			h.postMessage("UNDO");
		},
		redo: () => {
			h.postMessage("REDO");
		},
		openExample: (e) => {
			a("OPEN_EXAMPLE", e);
		},
		toggleResultsPanel: () => {
			a("TOGGLE_RESULTS_PANEL", void 0);
		}
	}), [p, r]), /* @__PURE__ */ B(R, { children: [
		/* @__PURE__ */ z(ec, {}),
		/* @__PURE__ */ z(oc, {}),
		/* @__PURE__ */ z(Pc, {}),
		/* @__PURE__ */ z(Cs, {}),
		/* @__PURE__ */ z(ws, {}),
		/* @__PURE__ */ B(V, {
			sx: th,
			children: [
				/* @__PURE__ */ z("div", {
					id: "response-overlay",
					className: "response_overlay response_overlay-hidden",
					ref: d
				}),
				/* @__PURE__ */ z("div", {
					id: "canvas_overlay",
					ref: l
				}),
				/* @__PURE__ */ z("div", {
					id: "orientation-overlay",
					ref: u
				}),
				/* @__PURE__ */ z("canvas", {
					id: "renderer-canvas",
					ref: c
				})
			]
		})
	] });
}), rh = (e, t) => ({
	display: "flex",
	alignItems: "center",
	p: "4px 8px",
	bgcolor: t ? "#cce5ff" : e ? "#e8ecef" : "transparent",
	borderLeft: t ? "2px solid #2d72d2" : "2px solid transparent",
	cursor: "pointer",
	userSelect: "none",
	"&:hover": { bgcolor: t ? "#b3d7ff" : "#e8ecef" }
}), ih = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "4px",
	color: "#5c6670",
	"& svg": { fontSize: 16 }
}, ah = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "6px",
	color: "#5c6670",
	"& svg": { fontSize: 14 }
}, oh = {
	flex: 1,
	fontSize: 12,
	fontWeight: 500,
	color: "#1c2127",
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap"
}, sh = {
	flex: 1,
	fontSize: 12,
	fontWeight: 500,
	color: "#1c2127",
	border: "1px solid #2d72d2",
	borderRadius: "2px",
	p: "0 4px",
	outline: "none",
	bgcolor: "white",
	minWidth: 0
}, ch = (e) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 18,
	height: 18,
	borderRadius: "3px",
	color: e ? "#8c959f" : "#d0d7de",
	opacity: +!e,
	"& svg": { fontSize: 14 },
	".MuiBox-root:hover > &": { opacity: 1 },
	"&:hover": {
		bgcolor: "#d0d7de",
		color: "#1c2127"
	}
}), lh = {
	room: _c,
	source: vc,
	receiver: yc,
	surface: gc
};
function uh({ name: e, kind: t, expanded: n, selected: r, visible: i, onToggle: a, onSelect: o, onVisibilityToggle: s, onNameChange: c, onMouseEnter: l, onMouseLeave: u }) {
	let [d, f] = I(!1), [p, m] = I(e), h = F(null), g = lh[t] || gc;
	return N(() => {
		m(e);
	}, [e]), N(() => {
		d && h.current && (h.current.focus(), h.current.select());
	}, [d]), /* @__PURE__ */ B(V, {
		sx: rh(n, r),
		onClick: (e) => {
			d || o(e);
		},
		onMouseEnter: l,
		onMouseLeave: u,
		children: [
			/* @__PURE__ */ z(V, {
				sx: ih,
				onClick: (e) => {
					e.stopPropagation(), a();
				},
				children: z(n ? kn : An, {})
			}),
			/* @__PURE__ */ z(V, {
				sx: ah,
				children: /* @__PURE__ */ z(g, {})
			}),
			d ? /* @__PURE__ */ z(V, {
				component: "input",
				ref: h,
				value: p,
				onChange: (e) => {
					m(e.target.value);
				},
				onBlur: () => {
					f(!1), p.trim() && p !== e ? c(p.trim()) : m(e);
				},
				onKeyDown: (t) => {
					t.key === "Enter" ? t.currentTarget.blur() : t.key === "Escape" && (m(e), f(!1));
				},
				onClick: (e) => {
					e.stopPropagation();
				},
				sx: sh
			}) : /* @__PURE__ */ z(V, {
				sx: oh,
				onDoubleClick: (e) => {
					e.stopPropagation(), f(!0);
				},
				children: e
			}),
			/* @__PURE__ */ z(V, {
				sx: ch(i),
				onClick: (e) => {
					e.stopPropagation(), s();
				},
				children: z(i ? Bn : Vn, {})
			})
		]
	});
}
// src/components/object-cards/ObjectCard.tsx
var dh = { borderBottom: "1px solid #e1e4e8" }, fh = (e) => ({
	display: e ? "block" : "none",
	pl: "20px"
}), ph = { py: "4px" }, mh = { borderTop: "1px solid #e1e4e8" }, hh = /* @__PURE__ */ new Map([
	["room", Wl],
	["source", Il],
	["receiver", Vl],
	["surface", $l]
]);
function gh({ uuid: e, defaultExpanded: t = !1, isChild: r = !1 }) {
	let [i, o] = I(t), [s, c] = I(!1), [l, u] = I(""), [d, f] = I(!0), p = O((t) => t.containers[e]), m = O((e) => e.version), h = P(() => p?.kind === "room" ? p.allSurfaces.map((e) => e.uuid) : [], [p, m]);
	N(() => {
		p && (u(p.name || "Untitled"), f(p.visible));
	}, [p, m]), N(() => {
		let t = p?.kind ? `${p.kind.toUpperCase()}_SET_PROPERTY` : null;
		if (t) return n(t, ({ uuid: t, property: n, value: r }) => {
			t === e && n === "name" && u(r);
		});
	}, [e, p?.kind]), N(() => {
		let t = n("SET_SELECTION", (t) => {
			c(t.some((t) => t.uuid === e));
		}), r = n("APPEND_SELECTION", (t) => {
			t.some((t) => t.uuid === e) && c(!0);
		}), i = n("DESELECT_ALL_OBJECTS", () => {
			c(!1);
		});
		return () => {
			t(), r(), i();
		};
	}, [e]);
	let g = M(() => {
		o((e) => !e);
	}, []), _ = M((e) => {
		p && a(e.shiftKey ? "APPEND_SELECTION" : "SET_SELECTION", [p]);
	}, [p]), v = M(() => {
		p?.kind === "surface" && a("SURFACE_HOVER", e);
	}, [p?.kind, e]), y = M(() => {
		p?.kind === "surface" && a("SURFACE_UNHOVER", e);
	}, [p?.kind, e]), b = M(() => {
		if (p) {
			let t = `${p.kind.toUpperCase()}_SET_PROPERTY`;
			a(t, {
				uuid: e,
				property: "visible",
				value: !d
			}), f(!d);
		}
	}, [
		p,
		e,
		d
	]), x = M((t) => {
		if (p) {
			let n = `${p.kind.toUpperCase()}_SET_PROPERTY`;
			a(n, {
				uuid: e,
				property: "name",
				value: t
			}), u(t);
		}
	}, [p, e]);
	if (!p) return null;
	let S = p.kind || "object", C = hh.get(S);
	return /* @__PURE__ */ B(V, {
		sx: dh,
		children: [/* @__PURE__ */ z(uh, {
			name: l,
			kind: S,
			expanded: i,
			selected: s,
			visible: d,
			onToggle: g,
			onSelect: _,
			onVisibilityToggle: b,
			onNameChange: x,
			onMouseEnter: v,
			onMouseLeave: y
		}), /* @__PURE__ */ B(V, {
			sx: fh(i),
			children: [C && /* @__PURE__ */ z(V, {
				sx: ph,
				children: /* @__PURE__ */ z(C, { uuid: e })
			}), h.length > 0 && /* @__PURE__ */ z(V, {
				sx: mh,
				children: h.map((e) => /* @__PURE__ */ z(gh, {
					uuid: e,
					isChild: !0
				}, e))
			})]
		})]
	});
}
// src/components/object-cards/ObjectCardList.tsx
var _h = { overflowY: "auto" }, vh = (e) => ({
	display: "flex",
	alignItems: "center",
	p: "4px 8px",
	bgcolor: e ? "#e8ecef" : "transparent",
	cursor: "pointer",
	userSelect: "none",
	borderBottom: "1px solid #e1e4e8",
	"&:hover": { bgcolor: "#e8ecef" }
}), yh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "4px",
	color: "#5c6670",
	"& svg": { fontSize: 16 }
}, bh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "6px",
	color: "#5c6670",
	"& svg": { fontSize: 14 }
}, xh = {
	flex: 1,
	fontSize: 12,
	fontWeight: 500,
	color: "#1c2127"
}, Sh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: 14,
	height: 14,
	p: "0 4px",
	bgcolor: "#8c959f",
	borderRadius: "7px",
	fontSize: 10,
	fontWeight: 600,
	color: "white"
}, Ch = (e) => ({
	display: e ? "block" : "none",
	pl: "20px"
}), wh = {
	p: "24px 16px",
	textAlign: "center",
	color: "#8c959f",
	fontSize: 13
};
function Th() {
	let [e, t] = I(!0), n = O(j((e) => e.containers)), r = P(() => {
		let e = {
			rooms: [],
			sources: [],
			receivers: []
		};
		return Object.keys(n).forEach((t) => {
			switch (n[t].kind) {
				case "room":
					e.rooms.push(t);
					break;
				case "source":
					e.sources.push(t);
					break;
				case "receiver": e.receivers.push(t);
			}
		}), e;
	}, [n]), i = r.rooms.length + r.sources.length + r.receivers.length;
	return /* @__PURE__ */ B(V, {
		sx: _h,
		children: [/* @__PURE__ */ B(V, {
			sx: vh(e),
			onClick: () => t(!e),
			children: [
				/* @__PURE__ */ z(V, {
					sx: yh,
					children: z(e ? kn : An, {})
				}),
				/* @__PURE__ */ z(V, {
					sx: bh,
					children: /* @__PURE__ */ z(Er, {})
				}),
				/* @__PURE__ */ z(H, {
					sx: xh,
					children: "Objects"
				}),
				i > 0 && /* @__PURE__ */ z(V, {
					sx: Sh,
					children: i
				})
			]
		}), /* @__PURE__ */ z(V, {
			sx: Ch(e),
			children: i === 0 ? /* @__PURE__ */ z(H, {
				sx: wh,
				children: "No objects yet. Import a model or add objects from the menu."
			}) : /* @__PURE__ */ B(R, { children: [
				r.rooms.map((e) => /* @__PURE__ */ z(gh, { uuid: e }, e)),
				r.sources.map((e) => /* @__PURE__ */ z(gh, { uuid: e }, e)),
				r.receivers.map((e) => /* @__PURE__ */ z(gh, { uuid: e }, e))
			] })
		})]
	});
}
// src/components/solver-cards/SolverCardHeader.tsx
var Eh = _n`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`, Dh = (e) => ({
	display: "flex",
	alignItems: "center",
	p: "4px 8px",
	bgcolor: e ? "#e8ecef" : "transparent",
	cursor: "pointer",
	userSelect: "none",
	"&:hover": { bgcolor: "#e8ecef" },
	"&:hover .menu-button": { opacity: 1 }
}), Oh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "4px",
	color: "#5c6670",
	"& svg": { fontSize: 16 }
}, kh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "6px",
	color: "#5c6670",
	"& svg": { fontSize: 14 }
}, Ah = {
	flex: 1,
	fontSize: 12,
	fontWeight: 500,
	color: "#1c2127",
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap"
}, jh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 18,
	height: 18,
	borderRadius: "3px",
	border: "none",
	background: "transparent",
	p: 0,
	color: "#8c959f",
	opacity: 0,
	cursor: "pointer",
	"& svg": { fontSize: 14 },
	"&:hover": {
		bgcolor: "#d0d7de",
		color: "#1c2127"
	}
}, Mh = (e, t) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 18,
	height: 18,
	mr: "4px",
	borderRadius: "3px",
	color: e ? "#c0c0c0" : "#8c959f",
	cursor: e ? "default" : "pointer",
	pointerEvents: e ? "none" : "auto",
	"& svg": {
		fontSize: 14,
		animation: t ? `${Eh} 1s linear infinite` : "none"
	},
	"&:hover": {
		bgcolor: e ? "transparent" : "#d0d7de",
		color: e ? "#c0c0c0" : "#1c2127"
	}
}), Nh = {
	"ray-tracer": kr,
	"image-source": Ar,
	"fdtd-2d": jr,
	rt60: Mr,
	energydecay: Wn,
	art: Nr,
	ard: Pr,
	renderer: gn,
	"beam-trace": jn
};
function Ph({ name: e, kind: t, expanded: n, canCalculate: r = !1, isCalculating: i = !1, onToggle: a, onCalculate: o, onClear: s, onDelete: c, onDuplicate: l }) {
	let u = Nh[t] || kr, [d, f] = I(null), p = !!d, m = (e) => {
		e.stopPropagation(), o?.();
	}, h = (e) => {
		e.stopPropagation(), s?.();
	}, g = (e) => {
		e.stopPropagation(), f(e.currentTarget);
	}, _ = () => {
		f(null);
	};
	return /* @__PURE__ */ B(V, {
		sx: Dh(n),
		onClick: a,
		children: [
			/* @__PURE__ */ z(V, {
				sx: Oh,
				children: z(n ? kn : An, {})
			}),
			/* @__PURE__ */ z(V, {
				sx: kh,
				children: /* @__PURE__ */ z(u, {})
			}),
			/* @__PURE__ */ z(V, {
				sx: Ah,
				children: e
			}),
			o && /* @__PURE__ */ z(V, {
				sx: Mh(!r || i, i),
				onClick: m,
				title: i ? "Calculating..." : "Calculate",
				children: /* @__PURE__ */ z($n, {})
			}),
			s && /* @__PURE__ */ z(V, {
				sx: Mh(i, !1),
				onClick: h,
				title: "Clear",
				children: /* @__PURE__ */ z(Or, {})
			}),
			(c || l) && /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z(V, {
				component: "button",
				type: "button",
				className: "menu-button",
				sx: jh,
				onClick: g,
				children: /* @__PURE__ */ z(Dr, {})
			}), /* @__PURE__ */ B(fn, {
				anchorEl: d,
				open: p,
				onClose: _,
				anchorOrigin: {
					vertical: "bottom",
					horizontal: "right"
				},
				transformOrigin: {
					vertical: "top",
					horizontal: "right"
				},
				slotProps: { paper: { sx: { bgcolor: "background.paper" } } },
				children: [l && /* @__PURE__ */ B(pn, {
					onClick: () => {
						_(), l?.();
					},
					children: [/* @__PURE__ */ z(Rn, { children: /* @__PURE__ */ z(Fr, { fontSize: "small" }) }), /* @__PURE__ */ z(zn, { children: "Duplicate" })]
				}), c && /* @__PURE__ */ B(pn, {
					onClick: () => {
						_(), c?.();
					},
					sx: { color: "error.main" },
					children: [/* @__PURE__ */ z(Rn, { children: /* @__PURE__ */ z(Hn, {
						fontSize: "small",
						color: "error"
					}) }), /* @__PURE__ */ z(zn, { children: "Delete" })]
				})]
			})] })
		]
	});
}
// src/components/solver-cards/SolverCard.tsx
var Fh = { borderBottom: "1px solid #e1e4e8" }, Ih = (e) => ({
	display: e ? "block" : "none",
	pl: "20px"
}), Lh = { py: "4px" }, Rh = /* @__PURE__ */ new Map([
	["image-source", Ju],
	["ray-tracer", Gu],
	["rt60", Xu],
	["fdtd-2d", Cd],
	["energydecay", Zu],
	["art", Td],
	["ard", Id],
	["beam-trace", ud]
]);
function zh({ uuid: e, defaultExpanded: t = !1 }) {
	let [r, o] = I(t), [s, c] = I(!1), l = f((t) => t.solvers[e]), u = M(() => {
		o((e) => !e);
	}, []), d = M(() => {
		i(e);
	}, [e]);
	N(() => {
		if (l) {
			if (l.kind === "beam-trace") {
				let t = n("BEAMTRACE_CALCULATE", (t) => {
					t === e && c(!0);
				}), r = n("BEAMTRACE_CALCULATE_COMPLETE", (t) => {
					t === e && c(!1);
				});
				return () => {
					t(), r();
				};
			}
			if (l.kind === "ard") {
				let t = n("ARD_PROGRESS", ({ uuid: t, progress: n }) => {
					t === e && c(n > 0 && n < 1);
				});
				return () => {
					t();
				};
			}
		}
	}, [l, e]);
	let p = P(() => {
		if (!l) return !1;
		let e = l, t = (e.sourceIDs?.length ?? 0) > 0 && (e.receiverIDs?.length ?? 0) > 0;
		switch (l.kind) {
			case "beam-trace":
			case "image-source":
			case "ray-tracer": return t;
			case "ard": return t && !!e.roomID;
			case "rt60": return !0;
			default: return !1;
		}
	}, [l]), m = M(() => {
		if (l) switch (l.kind) {
			case "beam-trace":
				a("BEAMTRACE_CALCULATE", e);
				break;
			case "image-source":
				a("UPDATE_IMAGESOURCE", e);
				break;
			case "ray-tracer":
				a("RAYTRACER_SET_PROPERTY", {
					uuid: e,
					property: "isRunning",
					value: !0
				});
				break;
			case "ard": a("CALCULATE_ARD", e);
		}
	}, [l, e]), h = M(() => {
		if (l) switch (l.kind) {
			case "beam-trace":
				a("BEAMTRACE_RESET", e);
				break;
			case "image-source":
				a("RESET_IMAGESOURCE", e);
				break;
			case "ray-tracer": a("RAYTRACER_CLEAR_RAYS", e);
		}
	}, [l, e]);
	if (!l) return null;
	let g = [
		"beam-trace",
		"image-source",
		"ray-tracer",
		"ard"
	].includes(l.kind), _ = [
		"beam-trace",
		"image-source",
		"ray-tracer"
	].includes(l.kind), v = Rh.get(l.kind);
	return /* @__PURE__ */ B(V, {
		sx: Fh,
		children: [/* @__PURE__ */ z(Ph, {
			name: l.name,
			kind: l.kind,
			expanded: r,
			canCalculate: p,
			isCalculating: s,
			onToggle: u,
			onCalculate: g ? m : void 0,
			onClear: _ ? h : void 0,
			onDelete: d
		}), /* @__PURE__ */ z(V, {
			sx: Ih(r),
			children: v && /* @__PURE__ */ z(V, {
				sx: Lh,
				children: /* @__PURE__ */ z(v, { uuid: e })
			})
		})]
	});
}
// src/components/solver-cards/RendererCard.tsx
var Bh = { borderBottom: "1px solid #e1e4e8" }, Vh = (e) => ({
	display: e ? "block" : "none",
	pl: "20px"
}), Hh = { py: "4px" };
function Uh({ defaultExpanded: e = !1 }) {
	let [t, n] = I(e), r = M(() => {
		n((e) => !e);
	}, []);
	return /* @__PURE__ */ B(V, {
		sx: Bh,
		children: [/* @__PURE__ */ z(Ph, {
			name: "Renderer",
			kind: "renderer",
			expanded: t,
			onToggle: r
		}), /* @__PURE__ */ z(V, {
			sx: Vh(t),
			children: /* @__PURE__ */ z(V, {
				sx: Hh,
				children: /* @__PURE__ */ z(ef, {})
			})
		})]
	});
}
// src/components/solver-cards/SolverCardList.tsx
var Wh = _n`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`, Gh = { overflowY: "auto" }, Kh = (e) => ({
	display: "flex",
	alignItems: "center",
	p: "4px 8px",
	bgcolor: e ? "#e8ecef" : "transparent",
	cursor: "pointer",
	userSelect: "none",
	borderBottom: "1px solid #e1e4e8",
	"&:hover": { bgcolor: "#e8ecef" }
}), qh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "4px",
	color: "#5c6670",
	"& svg": { fontSize: 16 }
}, Jh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "6px",
	color: "#5c6670",
	"& svg": { fontSize: 14 }
}, Yh = {
	flex: 1,
	fontSize: 12,
	fontWeight: 500,
	color: "#1c2127"
}, Xh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: 14,
	height: 14,
	px: "4px",
	bgcolor: "#8c959f",
	borderRadius: "7px",
	fontSize: 10,
	fontWeight: 600,
	color: "white"
}, Zh = (e, t) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 22,
	height: 22,
	ml: "6px",
	p: 0,
	border: "none",
	borderRadius: "4px",
	bgcolor: e ? "#2d72d2" : "transparent",
	color: e ? "white" : "#5c6670",
	cursor: "pointer",
	transition: "background-color 0.15s, color 0.15s",
	"&:hover": { bgcolor: e ? "#215db0" : "#d3d8de" },
	"& svg": {
		fontSize: 16,
		animation: t ? `${Wh} 1s linear infinite` : "none"
	}
}), Qh = (e) => ({
	display: e ? "block" : "none",
	pl: "20px"
}), $h = {
	p: "16px",
	textAlign: "center",
	color: "#8c959f",
	fontSize: 12
};
function eg() {
	let [e, t] = I(!0), n = f((e) => e.solvers), r = k((e) => e.autoCalculate), i = k((e) => e.progress.visible), o = P(() => Object.keys(n), [n]), s = o.length + 1;
	return /* @__PURE__ */ B(V, {
		sx: Gh,
		children: [/* @__PURE__ */ B(V, {
			sx: Kh(e),
			onClick: () => t(!e),
			children: [
				/* @__PURE__ */ z(V, {
					sx: qh,
					children: z(e ? kn : An, {})
				}),
				/* @__PURE__ */ z(V, {
					sx: Jh,
					children: /* @__PURE__ */ z(Ir, {})
				}),
				/* @__PURE__ */ z(V, {
					sx: Yh,
					children: "Solvers"
				}),
				/* @__PURE__ */ z(V, {
					sx: Xh,
					children: s
				}),
				/* @__PURE__ */ z(V, {
					component: "button",
					sx: Zh(r, r && i),
					onClick: (e) => {
						e.stopPropagation(), a("SET_AUTO_CALCULATE", !r);
					},
					title: r ? "Auto-calculate enabled" : "Auto-calculate disabled",
					children: /* @__PURE__ */ z(er, {})
				})
			]
		}), /* @__PURE__ */ B(V, {
			sx: Qh(e),
			children: [o.length > 0 ? o.map((e) => /* @__PURE__ */ z(zh, { uuid: e }, e)) : /* @__PURE__ */ z(V, {
				sx: $h,
				children: "No solvers yet. Add one from the menu."
			}), /* @__PURE__ */ z(Uh, {})]
		})]
	});
}
var tg = {
	meta: {
		version: "0.2.1",
		name: "shoebox",
		timestamp: "2021-03-26T08:06:59.213Z"
	},
	containers: [
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Floors", "Various"],
				manufacturer: "",
				name: "Wood Floor",
				material: "Wood floor",
				absorption: {
					63: .06,
					125: .15,
					250: .11,
					500: .1,
					1e3: .07,
					2e3: .06,
					4e3: .07,
					8e3: .07
				},
				nrc: .09,
				source: "Egan",
				description: "",
				uuid: "1PgJwgIAqHwMj99A"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "339B4C51-51C8-4B05-9AB2-74391E210FB3",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-6,
								0,
								2.8299999237060547,
								0,
								4,
								2.8299999237060547,
								-6,
								4,
								2.8299999237060547,
								-6,
								0,
								2.8299999237060547,
								0,
								0,
								2.8299999237060547,
								0,
								4,
								2.8299999237060547
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.875,
								.5,
								0,
								.625,
								.75,
								0,
								.625,
								.5,
								0,
								.875,
								.5,
								0,
								.875,
								.75,
								0,
								.625,
								.75,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							-3,
							2,
							2.8299999237060547
						],
						radius: 3.605551275463989
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "floor",
			position: [
				0,
				0,
				-2.8299999237060547
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "1857F829-AB09-4DB5-A538-87CE6FACCF4C"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Gypsum board"],
				manufacturer: "",
				name: "Gypsum Board",
				material: "Gypsum board, 2 layers 5/8in on studs 16inoc w/batt",
				absorption: {
					63: .06,
					125: .28,
					250: .12,
					500: .1,
					1e3: .07,
					2e3: .13,
					4e3: .09,
					8e3: .09
				},
				nrc: .11,
				source: "Egan",
				description: "",
				uuid: "xmzQfq6zBKEec4TS"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "A2093E5B-D6EB-4503-B287-9EE173014B5B",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								4,
								2.8299999237060547,
								0,
								0,
								0,
								0,
								4,
								0,
								0,
								4,
								2.8299999237060547,
								0,
								0,
								2.8299999237060547,
								0,
								0,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.625,
								.75,
								0,
								.375,
								1,
								0,
								.375,
								.75,
								0,
								.625,
								.75,
								0,
								.625,
								1,
								0,
								.375,
								1,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							0,
							2,
							1.4149999618530273
						],
						radius: 2.4499438548758765
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "wall4",
			position: [
				-6,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "6641528A-B8AF-4BDB-B627-14AA1401EDFB"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Gypsum board"],
				manufacturer: "",
				name: "Gypsum Board",
				material: "Gypsum board, 2 layers 5/8in on studs 16inoc w/batt",
				absorption: {
					63: .06,
					125: .28,
					250: .12,
					500: .1,
					1e3: .07,
					2e3: .13,
					4e3: .09,
					8e3: .09
				},
				nrc: .11,
				source: "Egan",
				description: "",
				uuid: "xmzQfq6zBKEec4TS"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "DDF1FD55-2407-429C-92D8-AFE0E1FE9F0C",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-6,
								4,
								2.8299999237060547,
								0,
								4,
								0,
								-6,
								4,
								0,
								-6,
								4,
								2.8299999237060547,
								0,
								4,
								2.8299999237060547,
								0,
								4,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.625,
								.5,
								0,
								.375,
								.75,
								0,
								.375,
								.5,
								0,
								.625,
								.5,
								0,
								.625,
								.75,
								0,
								.375,
								.75,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							-3,
							4,
							1.4149999618530273
						],
						radius: 3.31696018849248
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "wall3",
			position: [
				0,
				-4,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "F925EC4C-7AEA-48FC-9363-EB79CA106FE0"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Gypsum board"],
				manufacturer: "",
				name: "Gypsum Board",
				material: "Gypsum board, 2 layers 5/8in on studs 16inoc w/batt",
				absorption: {
					63: .06,
					125: .28,
					250: .12,
					500: .1,
					1e3: .07,
					2e3: .13,
					4e3: .09,
					8e3: .09
				},
				nrc: .11,
				source: "Egan",
				description: "",
				uuid: "xmzQfq6zBKEec4TS"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "8DD060AB-9B56-40E9-9296-EE0BD5719908",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-6,
								0,
								2.8299999237060547,
								-6,
								4,
								0,
								-6,
								0,
								0,
								-6,
								0,
								2.8299999237060547,
								-6,
								4,
								2.8299999237060547,
								-6,
								4,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.625,
								.25,
								0,
								.375,
								.5,
								0,
								.375,
								.25,
								0,
								.625,
								.25,
								0,
								.625,
								.5,
								0,
								.375,
								.5,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							-6,
							2,
							1.4149999618530273
						],
						radius: 2.4499438548758765
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "wall2",
			position: [
				6,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "535C0DEC-3940-4954-B272-ECC1B6CB224E"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Gypsum board"],
				manufacturer: "",
				name: "Gypsum Board",
				material: "Gypsum board, 2 layers 5/8in on studs 16inoc w/batt",
				absorption: {
					63: .06,
					125: .28,
					250: .12,
					500: .1,
					1e3: .07,
					2e3: .13,
					4e3: .09,
					8e3: .09
				},
				nrc: .11,
				source: "Egan",
				description: "",
				uuid: "xmzQfq6zBKEec4TS"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "6946BD37-4367-44C7-B79C-53238F129BA3",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								0,
								2.8299999237060547,
								-6,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								2.8299999237060547,
								-6,
								0,
								2.8299999237060547,
								-6,
								0,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.625,
								0,
								0,
								.375,
								.25,
								0,
								.375,
								0,
								0,
								.625,
								0,
								0,
								.625,
								.25,
								0,
								.375,
								.25,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							-3,
							0,
							1.4149999618530273
						],
						radius: 3.31696018849248
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "wall1",
			position: [
				0,
				4,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "23DCFCDB-53AA-473A-A23C-BEB0FE4A85F5"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Ceiling", " Ceiling Systems"],
				manufacturer: "",
				name: "Dampa Linar 100 Ceiling System",
				material: "Dampa Linar 100 Ceiling System",
				absorption: {
					63: .34,
					125: .48,
					250: .67,
					500: .69,
					1e3: .61,
					2e3: .46,
					4e3: .49,
					8e3: .52
				},
				nrc: .61,
				source: "SH",
				description: "",
				uuid: "s9OvPvd4RDogxQn7"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "B8A7A35C-D863-4A13-86CB-07EC6D6F9249",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-6,
								4,
								0,
								0,
								0,
								0,
								-6,
								0,
								0,
								-6,
								4,
								0,
								0,
								4,
								0,
								0,
								0,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.375,
								.5,
								0,
								.125,
								.75,
								0,
								.125,
								.5,
								0,
								.375,
								.5,
								0,
								.375,
								.75,
								0,
								.125,
								.75,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							-3,
							2,
							0
						],
						radius: 3.605551275463989
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "ceil",
			position: [
				0,
				0,
				2.8299999237060547
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "BB39378A-EA8B-4FC0-9BA9-EB845F9F41F4"
		},
		{
			surfaces: [
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Floors", "Various"],
						manufacturer: "",
						name: "Wood Floor",
						material: "Wood floor",
						absorption: {
							63: .06,
							125: .15,
							250: .11,
							500: .1,
							1e3: .07,
							2e3: .06,
							4e3: .07,
							8e3: .07
						},
						nrc: .09,
						source: "Egan",
						description: "",
						uuid: "1PgJwgIAqHwMj99A"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "339B4C51-51C8-4B05-9AB2-74391E210FB3",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										-6,
										0,
										2.8299999237060547,
										0,
										4,
										2.8299999237060547,
										-6,
										4,
										2.8299999237060547,
										-6,
										0,
										2.8299999237060547,
										0,
										0,
										2.8299999237060547,
										0,
										4,
										2.8299999237060547
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										.875,
										.5,
										0,
										.625,
										.75,
										0,
										.625,
										.5,
										0,
										.875,
										.5,
										0,
										.875,
										.75,
										0,
										.625,
										.75,
										0
									],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									-3,
									2,
									2.8299999237060547
								],
								radius: 3.605551275463989
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "floor",
					position: [
						0,
						0,
						-2.8299999237060547
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "1857F829-AB09-4DB5-A538-87CE6FACCF4C"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Walls", "Gypsum board"],
						manufacturer: "",
						name: "Gypsum Board",
						material: "Gypsum board, 2 layers 5/8in on studs 16inoc w/batt",
						absorption: {
							63: .06,
							125: .28,
							250: .12,
							500: .1,
							1e3: .07,
							2e3: .13,
							4e3: .09,
							8e3: .09
						},
						nrc: .11,
						source: "Egan",
						description: "",
						uuid: "xmzQfq6zBKEec4TS"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "A2093E5B-D6EB-4503-B287-9EE173014B5B",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										4,
										2.8299999237060547,
										0,
										0,
										0,
										0,
										4,
										0,
										0,
										4,
										2.8299999237060547,
										0,
										0,
										2.8299999237060547,
										0,
										0,
										0
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										.625,
										.75,
										0,
										.375,
										1,
										0,
										.375,
										.75,
										0,
										.625,
										.75,
										0,
										.625,
										1,
										0,
										.375,
										1,
										0
									],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									0,
									2,
									1.4149999618530273
								],
								radius: 2.4499438548758765
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "wall4",
					position: [
						-6,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "6641528A-B8AF-4BDB-B627-14AA1401EDFB"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Walls", "Gypsum board"],
						manufacturer: "",
						name: "Gypsum Board",
						material: "Gypsum board, 2 layers 5/8in on studs 16inoc w/batt",
						absorption: {
							63: .06,
							125: .28,
							250: .12,
							500: .1,
							1e3: .07,
							2e3: .13,
							4e3: .09,
							8e3: .09
						},
						nrc: .11,
						source: "Egan",
						description: "",
						uuid: "xmzQfq6zBKEec4TS"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "DDF1FD55-2407-429C-92D8-AFE0E1FE9F0C",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										-6,
										4,
										2.8299999237060547,
										0,
										4,
										0,
										-6,
										4,
										0,
										-6,
										4,
										2.8299999237060547,
										0,
										4,
										2.8299999237060547,
										0,
										4,
										0
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										.625,
										.5,
										0,
										.375,
										.75,
										0,
										.375,
										.5,
										0,
										.625,
										.5,
										0,
										.625,
										.75,
										0,
										.375,
										.75,
										0
									],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									-3,
									4,
									1.4149999618530273
								],
								radius: 3.31696018849248
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "wall3",
					position: [
						0,
						-4,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "F925EC4C-7AEA-48FC-9363-EB79CA106FE0"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Walls", "Gypsum board"],
						manufacturer: "",
						name: "Gypsum Board",
						material: "Gypsum board, 2 layers 5/8in on studs 16inoc w/batt",
						absorption: {
							63: .06,
							125: .28,
							250: .12,
							500: .1,
							1e3: .07,
							2e3: .13,
							4e3: .09,
							8e3: .09
						},
						nrc: .11,
						source: "Egan",
						description: "",
						uuid: "xmzQfq6zBKEec4TS"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "8DD060AB-9B56-40E9-9296-EE0BD5719908",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										-6,
										0,
										2.8299999237060547,
										-6,
										4,
										0,
										-6,
										0,
										0,
										-6,
										0,
										2.8299999237060547,
										-6,
										4,
										2.8299999237060547,
										-6,
										4,
										0
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										.625,
										.25,
										0,
										.375,
										.5,
										0,
										.375,
										.25,
										0,
										.625,
										.25,
										0,
										.625,
										.5,
										0,
										.375,
										.5,
										0
									],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									-6,
									2,
									1.4149999618530273
								],
								radius: 2.4499438548758765
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "wall2",
					position: [
						6,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "535C0DEC-3940-4954-B272-ECC1B6CB224E"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Walls", "Gypsum board"],
						manufacturer: "",
						name: "Gypsum Board",
						material: "Gypsum board, 2 layers 5/8in on studs 16inoc w/batt",
						absorption: {
							63: .06,
							125: .28,
							250: .12,
							500: .1,
							1e3: .07,
							2e3: .13,
							4e3: .09,
							8e3: .09
						},
						nrc: .11,
						source: "Egan",
						description: "",
						uuid: "xmzQfq6zBKEec4TS"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "6946BD37-4367-44C7-B79C-53238F129BA3",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										0,
										2.8299999237060547,
										-6,
										0,
										0,
										0,
										0,
										0,
										0,
										0,
										2.8299999237060547,
										-6,
										0,
										2.8299999237060547,
										-6,
										0,
										0
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										.625,
										0,
										0,
										.375,
										.25,
										0,
										.375,
										0,
										0,
										.625,
										0,
										0,
										.625,
										.25,
										0,
										.375,
										.25,
										0
									],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									-3,
									0,
									1.4149999618530273
								],
								radius: 3.31696018849248
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "wall1",
					position: [
						0,
						4,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "23DCFCDB-53AA-473A-A23C-BEB0FE4A85F5"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Ceiling", " Ceiling Systems"],
						manufacturer: "",
						name: "Dampa Linar 100 Ceiling System",
						material: "Dampa Linar 100 Ceiling System",
						absorption: {
							63: .34,
							125: .48,
							250: .67,
							500: .69,
							1e3: .61,
							2e3: .46,
							4e3: .49,
							8e3: .52
						},
						nrc: .61,
						source: "SH",
						description: "",
						uuid: "s9OvPvd4RDogxQn7"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "B8A7A35C-D863-4A13-86CB-07EC6D6F9249",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										-6,
										4,
										0,
										0,
										0,
										0,
										-6,
										0,
										0,
										-6,
										4,
										0,
										0,
										4,
										0,
										0,
										0,
										0
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										.375,
										.5,
										0,
										.125,
										.75,
										0,
										.125,
										.5,
										0,
										.375,
										.5,
										0,
										.375,
										.75,
										0,
										.125,
										.75,
										0
									],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									-3,
									2,
									0
								],
								radius: 3.605551275463989
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "ceil",
					position: [
						0,
						0,
						2.8299999237060547
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "BB39378A-EA8B-4FC0-9BA9-EB845F9F41F4"
				}
			],
			kind: "room",
			name: "new room",
			uuid: "0D3FE423-FA7C-40E7-B701-CF78A6A401CC",
			units: 2,
			originalFileData: "# Blender v2.91.0 OBJ File: ''\n# www.blender.org\nmtllib shoebox.mtl\no Cube.001_Cube.002\nv 0.000000 0.000000 2.830000\nv -6.000000 0.000000 2.830000\nv 0.000000 4.000000 2.830000\nv -6.000000 4.000000 2.830000\nvt 0.875000 0.500000\nvt 0.625000 0.750000\nvt 0.625000 0.500000\nvt 0.875000 0.750000\nvn 0.0000 0.0000 1.0000\nusemtl None\ns off\nf 2/1/1 3/2/1 4/3/1\nf 2/1/1 1/4/1 3/2/1\no Cube.002_Cube.003\nv 0.000000 0.000000 0.000000\nv 0.000000 0.000000 2.830000\nv 0.000000 4.000000 0.000000\nv 0.000000 4.000000 2.830000\nvt 0.625000 0.750000\nvt 0.375000 1.000000\nvt 0.375000 0.750000\nvt 0.625000 1.000000\nvn 1.0000 0.0000 0.0000\nusemtl None\ns off\nf 8/5/2 5/6/2 7/7/2\nf 8/5/2 6/8/2 5/6/2\no Cube.003_Cube.004\nv 0.000000 4.000000 0.000000\nv 0.000000 4.000000 2.830000\nv -6.000000 4.000000 0.000000\nv -6.000000 4.000000 2.830000\nvt 0.625000 0.500000\nvt 0.375000 0.750000\nvt 0.375000 0.500000\nvt 0.625000 0.750000\nvn 0.0000 1.0000 0.0000\nusemtl None\ns off\nf 12/9/3 9/10/3 11/11/3\nf 12/9/3 10/12/3 9/10/3\no Cube.004_Cube.005\nv -6.000000 0.000000 0.000000\nv -6.000000 0.000000 2.830000\nv -6.000000 4.000000 0.000000\nv -6.000000 4.000000 2.830000\nvt 0.625000 0.250000\nvt 0.375000 0.500000\nvt 0.375000 0.250000\nvt 0.625000 0.500000\nvn -1.0000 0.0000 0.0000\nusemtl None\ns off\nf 14/13/4 15/14/4 13/15/4\nf 14/13/4 16/16/4 15/14/4\no Cube.005_Cube.006\nv 0.000000 0.000000 0.000000\nv 0.000000 0.000000 2.830000\nv -6.000000 0.000000 0.000000\nv -6.000000 0.000000 2.830000\nvt 0.625000 0.000000\nvt 0.375000 0.250000\nvt 0.375000 0.000000\nvt 0.625000 0.250000\nvn 0.0000 -1.0000 0.0000\nusemtl None\ns off\nf 18/17/5 19/18/5 17/19/5\nf 18/17/5 20/20/5 19/18/5\no Cube.006_Cube.007\nv 0.000000 0.000000 0.000000\nv -6.000000 0.000000 0.000000\nv 0.000000 4.000000 0.000000\nv -6.000000 4.000000 0.000000\nvt 0.375000 0.500000\nvt 0.125000 0.750000\nvt 0.125000 0.500000\nvt 0.375000 0.750000\nvn 0.0000 0.0000 -1.0000\nusemtl None\ns off\nf 24/21/6 21/22/6 22/23/6\nf 24/21/6 23/24/6 21/22/6\n",
			originalFileName: "shoebox.obj",
			visible: !0,
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			]
		},
		{
			kind: "source",
			name: "new source",
			visible: !0,
			position: [
				-1.58,
				1.42,
				1.73
			],
			scale: [
				1,
				1,
				1
			],
			rotation: [
				0,
				0,
				0,
				"XYZ"
			],
			color: 13958322,
			uuid: "7D40D118-D86D-4823-8392-9D7A36381742"
		},
		{
			kind: "receiver",
			name: "new receiver",
			visible: !0,
			position: [
				-4.43,
				2.52,
				1.21
			],
			scale: [
				1,
				1,
				1
			],
			rotation: [
				0,
				0,
				0,
				"XYZ"
			],
			color: 14511983,
			uuid: "6C6C6EB3-B060-40A0-BF0F-A3F3D9D03B3E"
		}
	],
	solvers: [{
		name: "Ray Tracer",
		kind: "ray-tracer",
		uuid: "f77ccadb-0652-4919-8171-6ec70e16a390",
		roomID: "0D3FE423-FA7C-40E7-B701-CF78A6A401CC",
		sourceIDs: ["7D40D118-D86D-4823-8392-9D7A36381742"],
		surfaceIDs: [
			"1857F829-AB09-4DB5-A538-87CE6FACCF4C",
			"6641528A-B8AF-4BDB-B627-14AA1401EDFB",
			"F925EC4C-7AEA-48FC-9363-EB79CA106FE0",
			"535C0DEC-3940-4954-B272-ECC1B6CB224E",
			"23DCFCDB-53AA-473A-A23C-BEB0FE4A85F5",
			"BB39378A-EA8B-4FC0-9BA9-EB845F9F41F4"
		],
		receiverIDs: ["6C6C6EB3-B060-40A0-BF0F-A3F3D9D03B3E"],
		updateInterval: 5,
		passes: 1e3,
		pointSize: 2,
		reflectionOrder: 50,
		runningWithoutReceivers: !1,
		raysVisible: !0,
		pointsVisible: !0,
		invertedDrawStyle: !1,
		plotStyle: { mode: "lines" },
		paths: {}
	}]
}, ng = {
	meta: {
		version: "0.2.1",
		name: "concord",
		timestamp: "2021-03-23T00:10:21.760Z"
	},
	containers: [
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Gypsum board"],
				manufacturer: "",
				name: "Gypsum Board",
				material: "Gypsum board, 2+2 @ 5/8in on 3-5/8in studs",
				absorption: {
					63: .04,
					125: .15,
					250: .08,
					500: .06,
					1e3: .05,
					2e3: .05,
					4e3: .04,
					8e3: .04
				},
				nrc: .06,
				source: "wjhw?",
				description: "",
				uuid: "I1esImsQrKZl0AAw"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "3C4CDBD3-E04D-45F6-ABAE-D910EE0BCC11",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								12.430130004882812,
								2.3483328819274902,
								4.876800060272217,
								12.430130004882812,
								5.575300216674805,
								4.876800060272217,
								12.430130004882812,
								5.575300216674805,
								0,
								12.430130004882812,
								5.575300216674805,
								0,
								12.430130004882812,
								0,
								0,
								12.430130004882812,
								0,
								2.9337000846862793,
								12.430130004882812,
								0,
								2.9337000846862793,
								12.430130004882812,
								2.3483328819274902,
								4.876800060272217,
								12.430130004882812,
								5.575300216674805,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							12.430130004882812,
							2.7876501083374023,
							2.4384000301361084
						],
						radius: 3.7036182083850524
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "right1",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "59F599B3-6554-4999-A93C-597E4B5275C1"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Gypsum board"],
				manufacturer: "",
				name: "Gypsum Board",
				material: "Gypsum board, 2+2 @ 5/8in on 3-5/8in studs",
				absorption: {
					63: .04,
					125: .15,
					250: .08,
					500: .06,
					1e3: .05,
					2e3: .05,
					4e3: .04,
					8e3: .04
				},
				nrc: .06,
				source: "wjhw?",
				description: "",
				uuid: "I1esImsQrKZl0AAw"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "BD80155E-DA08-4122-A819-D7C873E060D0",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								6.215065002441406,
								5.575300216674805,
								4.876800060272217,
								12.430130004882812,
								5.575300216674805,
								0,
								12.430130004882812,
								5.575300216674805,
								4.876800060272217,
								6.215065002441406,
								5.575300216674805,
								4.876800060272217,
								6.215065002441406,
								5.575300216674805,
								0,
								12.430130004882812,
								5.575300216674805,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							9.32259750366211,
							5.575300216674805,
							2.4384000301361084
						],
						radius: 3.950006702919727
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "back1",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "FDDD16D3-6E8D-4B4B-B4A1-D622E9D6D31D"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Drapery", "Drapery"],
				manufacturer: "",
				name: "Fiberglass Fabric Curtain",
				material: "Fiberglass fabric curtain, 8.5 oz/sq yd (50% fullness) Egan",
				absorption: {
					63: .03,
					125: .09,
					250: .32,
					500: .68,
					1e3: .83,
					2e3: .39,
					4e3: .76,
					8e3: .99
				},
				nrc: .56,
				source: "SH",
				description: "",
				uuid: "3sUxVxHXIi9Gc6Zi"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "2E5E970F-6DFD-4269-A688-FD15AE36512B",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								6.215065002441406,
								10.855531692504883,
								0,
								6.215065002441406,
								5.575300216674805,
								4.876800060272217,
								6.215065002441406,
								10.855531692504883,
								4.876800060272217,
								6.215065002441406,
								10.855531692504883,
								0,
								6.215065002441406,
								5.575300216674805,
								0,
								6.215065002441406,
								5.575300216674805,
								4.876800060272217
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							6.215065002441406,
							8.215415954589844,
							2.4384000301361084
						],
						radius: 3.593884502394929
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "right2",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "EA9AA1BF-BA53-4D0E-ACB0-95E7291666FC"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Gypsum board"],
				manufacturer: "",
				name: "Gypsum Board",
				material: "Gypsum board, 1 layer 5/8in on studs 16inoc w/batt",
				absorption: {
					63: .07,
					125: .55,
					250: .14,
					500: .08,
					1e3: .04,
					2e3: .12,
					4e3: .11,
					8e3: .11
				},
				nrc: .1,
				source: "Egan",
				description: "",
				uuid: "th2PuWU5EhCsaon3"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "29275BAA-EC84-4AF7-868A-E05EA60BD17A",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								10.855531692504883,
								0,
								6.215065002441406,
								10.855531692504883,
								4.876800060272217,
								0,
								10.855531692504883,
								4.876800060272217,
								0,
								10.855531692504883,
								0,
								6.215065002441406,
								10.855531692504883,
								0,
								6.215065002441406,
								10.855531692504883,
								4.876800060272217
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							3.107532501220703,
							10.855531692504883,
							2.4384000301361084
						],
						radius: 3.950006702919727
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "back2",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "8C87C786-5188-48F7-BFD4-946EF78D1E65"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Gypsum board"],
				manufacturer: "",
				name: "Gypsum Board",
				material: "Gypsum board, 2+2 @ 5/8in on 3-5/8in studs",
				absorption: {
					63: .04,
					125: .15,
					250: .08,
					500: .06,
					1e3: .05,
					2e3: .05,
					4e3: .04,
					8e3: .04
				},
				nrc: .06,
				source: "wjhw?",
				description: "",
				uuid: "I1esImsQrKZl0AAw"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "F08D41DC-1461-412C-A97D-BF65AFA8EE1E",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								2.3483328819274902,
								4.876800060272217,
								0,
								0,
								0,
								0,
								10.855531692504883,
								0,
								0,
								10.855531692504883,
								0,
								0,
								10.855531692504883,
								4.876800060272217,
								0,
								2.3483328819274902,
								4.876800060272217,
								0,
								2.3483328819274902,
								4.876800060272217,
								0,
								0,
								2.9337000846862793,
								0,
								0,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							0,
							5.427765846252441,
							2.4384000301361084
						],
						radius: 5.950330813384434
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "left",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "ED91F1C5-D2D0-42A0-8686-4B46303256FE"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Diffusion", "Diffusion Products"],
				manufacturer: "",
				name: "Diffuse Signature Wood (1\" Standoff Sides Open)",
				material: "Diffuse Signature Wood (1\" Standoff Sides Open)",
				absorption: {
					63: 0,
					125: 0,
					250: .02,
					500: .06,
					1e3: .16,
					2e3: .13,
					4e3: .15,
					8e3: .17
				},
				nrc: .09,
				source: "SH",
				description: "",
				uuid: "tgGAnP5OCLWlPFF4"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "088EC67F-85BA-4323-BB08-C0213F5F6CA2",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								12.430130004882812,
								0,
								0,
								0,
								0,
								2.9337000846862793,
								12.430130004882812,
								0,
								2.9337000846862793,
								12.430130004882812,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								2.9337000846862793
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							6.215065002441406,
							0,
							1.4668500423431396
						],
						radius: 6.3858188223041585
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "front",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "0AECC234-8C09-4D6B-AA82-DC0A99B42F2D"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Ceiling", " Ceiling Systems"],
				manufacturer: "",
				name: "Barrisol Stretched Ceiling Over 3\" Fiberglass",
				material: "Barrisol Stretched Ceiling over 3\" fiberglass",
				absorption: {
					63: .18,
					125: .26,
					250: .58,
					500: .57,
					1e3: .43,
					2e3: .36,
					4e3: .36,
					8e3: .36
				},
				nrc: .49,
				source: "SH",
				description: "",
				uuid: "Wz4CjrpqIYGba8G0"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "95B298C8-96A1-41A1-9A71-D7C446A0AB46",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								12.430130004882812,
								0,
								2.9337000846862793,
								0,
								2.3483328819274902,
								4.876800060272217,
								12.430130004882812,
								2.3483328819274902,
								4.876800060272217,
								12.430130004882812,
								0,
								2.9337000846862793,
								0,
								0,
								2.9337000846862793,
								0,
								2.3483328819274902,
								4.876800060272217
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								.637499988079071,
								-.7705000042915344,
								0,
								.637499988079071,
								-.7705000042915344,
								0,
								.637499988079071,
								-.7705000042915344,
								0,
								.637499988079071,
								-.7705000042915344,
								0,
								.637499988079071,
								-.7705000042915344,
								0,
								.637499988079071,
								-.7705000042915344
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							6.215065002441406,
							1.1741664409637451,
							3.905250072479248
						],
						radius: 6.399188166825382
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "slope",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "ABA66075-FD1A-4820-B591-66EE2A92CFDB"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Ceiling", " Ceiling Systems"],
				manufacturer: "",
				name: "Dampa Linar 100 Ceiling System",
				material: "Dampa Linar 100 Ceiling System",
				absorption: {
					63: .34,
					125: .48,
					250: .67,
					500: .69,
					1e3: .61,
					2e3: .46,
					4e3: .49,
					8e3: .52
				},
				nrc: .61,
				source: "SH",
				description: "",
				uuid: "s9OvPvd4RDogxQn7"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "333C7898-A815-420A-89D6-3D96BB178242",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								12.430130004882812,
								2.3483328819274902,
								4.876800060272217,
								6.215065002441406,
								5.575300216674805,
								4.876800060272217,
								12.430130004882812,
								5.575300216674805,
								4.876800060272217,
								6.215065002441406,
								5.575300216674805,
								4.876800060272217,
								0,
								10.855531692504883,
								4.876800060272217,
								6.215065002441406,
								10.855531692504883,
								4.876800060272217,
								12.430130004882812,
								2.3483328819274902,
								4.876800060272217,
								0,
								2.3483328819274902,
								4.876800060272217,
								6.215065002441406,
								5.575300216674805,
								4.876800060272217,
								6.215065002441406,
								5.575300216674805,
								4.876800060272217,
								0,
								2.3483328819274902,
								4.876800060272217,
								0,
								10.855531692504883,
								4.876800060272217
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							6.215065002441406,
							6.6019322872161865,
							4.876800060272217
						],
						radius: 7.531277506853956
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "ceil",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "522A95C7-E134-4D1C-92DD-8672102F06E6"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Floors", "Various"],
				manufacturer: "",
				name: "Wood Floor",
				material: "Wood floor",
				absorption: {
					63: .06,
					125: .15,
					250: .11,
					500: .1,
					1e3: .07,
					2e3: .06,
					4e3: .07,
					8e3: .07
				},
				nrc: .09,
				source: "Egan",
				description: "",
				uuid: "1PgJwgIAqHwMj99A"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "203BF944-7E6E-4539-B678-F2064CCC8619",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								6.215065002441406,
								5.575300216674805,
								0,
								12.430130004882812,
								0,
								0,
								12.430130004882812,
								5.575300216674805,
								0,
								6.215065002441406,
								5.575300216674805,
								0,
								0,
								10.855531692504883,
								0,
								0,
								0,
								0,
								6.215065002441406,
								5.575300216674805,
								0,
								0,
								0,
								0,
								12.430130004882812,
								0,
								0,
								6.215065002441406,
								5.575300216674805,
								0,
								6.215065002441406,
								10.855531692504883,
								0,
								0,
								10.855531692504883,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1
							],
							normalized: !1
						},
						texCoords: {
							itemSize: 3,
							type: "Float32Array",
							array: [],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							6.215065002441406,
							5.427765846252441,
							0
						],
						radius: 8.25152562053324
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "floor",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "34B96D2E-706E-45E8-91D2-0F8FF35AA11E"
		},
		{
			surfaces: [
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Walls", "Gypsum board"],
						manufacturer: "",
						name: "Gypsum Board",
						material: "Gypsum board, 2+2 @ 5/8in on 3-5/8in studs",
						absorption: {
							63: .04,
							125: .15,
							250: .08,
							500: .06,
							1e3: .05,
							2e3: .05,
							4e3: .04,
							8e3: .04
						},
						nrc: .06,
						source: "wjhw?",
						description: "",
						uuid: "I1esImsQrKZl0AAw"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "3C4CDBD3-E04D-45F6-ABAE-D910EE0BCC11",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										12.430130004882812,
										2.3483328819274902,
										4.876800060272217,
										12.430130004882812,
										5.575300216674805,
										4.876800060272217,
										12.430130004882812,
										5.575300216674805,
										0,
										12.430130004882812,
										5.575300216674805,
										0,
										12.430130004882812,
										0,
										0,
										12.430130004882812,
										0,
										2.9337000846862793,
										12.430130004882812,
										0,
										2.9337000846862793,
										12.430130004882812,
										2.3483328819274902,
										4.876800060272217,
										12.430130004882812,
										5.575300216674805,
										0
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									12.430130004882812,
									2.7876501083374023,
									2.4384000301361084
								],
								radius: 3.7036182083850524
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "right1",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "59F599B3-6554-4999-A93C-597E4B5275C1"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Walls", "Gypsum board"],
						manufacturer: "",
						name: "Gypsum Board",
						material: "Gypsum board, 2+2 @ 5/8in on 3-5/8in studs",
						absorption: {
							63: .04,
							125: .15,
							250: .08,
							500: .06,
							1e3: .05,
							2e3: .05,
							4e3: .04,
							8e3: .04
						},
						nrc: .06,
						source: "wjhw?",
						description: "",
						uuid: "I1esImsQrKZl0AAw"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "BD80155E-DA08-4122-A819-D7C873E060D0",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										6.215065002441406,
										5.575300216674805,
										4.876800060272217,
										12.430130004882812,
										5.575300216674805,
										0,
										12.430130004882812,
										5.575300216674805,
										4.876800060272217,
										6.215065002441406,
										5.575300216674805,
										4.876800060272217,
										6.215065002441406,
										5.575300216674805,
										0,
										12.430130004882812,
										5.575300216674805,
										0
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									9.32259750366211,
									5.575300216674805,
									2.4384000301361084
								],
								radius: 3.950006702919727
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "back1",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "FDDD16D3-6E8D-4B4B-B4A1-D622E9D6D31D"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Drapery", "Drapery"],
						manufacturer: "",
						name: "Fiberglass Fabric Curtain",
						material: "Fiberglass fabric curtain, 8.5 oz/sq yd (50% fullness) Egan",
						absorption: {
							63: .03,
							125: .09,
							250: .32,
							500: .68,
							1e3: .83,
							2e3: .39,
							4e3: .76,
							8e3: .99
						},
						nrc: .56,
						source: "SH",
						description: "",
						uuid: "3sUxVxHXIi9Gc6Zi"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "2E5E970F-6DFD-4269-A688-FD15AE36512B",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										6.215065002441406,
										10.855531692504883,
										0,
										6.215065002441406,
										5.575300216674805,
										4.876800060272217,
										6.215065002441406,
										10.855531692504883,
										4.876800060272217,
										6.215065002441406,
										10.855531692504883,
										0,
										6.215065002441406,
										5.575300216674805,
										0,
										6.215065002441406,
										5.575300216674805,
										4.876800060272217
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									6.215065002441406,
									8.215415954589844,
									2.4384000301361084
								],
								radius: 3.593884502394929
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "right2",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "EA9AA1BF-BA53-4D0E-ACB0-95E7291666FC"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Walls", "Gypsum board"],
						manufacturer: "",
						name: "Gypsum Board",
						material: "Gypsum board, 1 layer 5/8in on studs 16inoc w/batt",
						absorption: {
							63: .07,
							125: .55,
							250: .14,
							500: .08,
							1e3: .04,
							2e3: .12,
							4e3: .11,
							8e3: .11
						},
						nrc: .1,
						source: "Egan",
						description: "",
						uuid: "th2PuWU5EhCsaon3"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "29275BAA-EC84-4AF7-868A-E05EA60BD17A",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										10.855531692504883,
										0,
										6.215065002441406,
										10.855531692504883,
										4.876800060272217,
										0,
										10.855531692504883,
										4.876800060272217,
										0,
										10.855531692504883,
										0,
										6.215065002441406,
										10.855531692504883,
										0,
										6.215065002441406,
										10.855531692504883,
										4.876800060272217
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									3.107532501220703,
									10.855531692504883,
									2.4384000301361084
								],
								radius: 3.950006702919727
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "back2",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "8C87C786-5188-48F7-BFD4-946EF78D1E65"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Walls", "Gypsum board"],
						manufacturer: "",
						name: "Gypsum Board",
						material: "Gypsum board, 2+2 @ 5/8in on 3-5/8in studs",
						absorption: {
							63: .04,
							125: .15,
							250: .08,
							500: .06,
							1e3: .05,
							2e3: .05,
							4e3: .04,
							8e3: .04
						},
						nrc: .06,
						source: "wjhw?",
						description: "",
						uuid: "I1esImsQrKZl0AAw"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "F08D41DC-1461-412C-A97D-BF65AFA8EE1E",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										2.3483328819274902,
										4.876800060272217,
										0,
										0,
										0,
										0,
										10.855531692504883,
										0,
										0,
										10.855531692504883,
										0,
										0,
										10.855531692504883,
										4.876800060272217,
										0,
										2.3483328819274902,
										4.876800060272217,
										0,
										2.3483328819274902,
										4.876800060272217,
										0,
										0,
										2.9337000846862793,
										0,
										0,
										0
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									0,
									5.427765846252441,
									2.4384000301361084
								],
								radius: 5.950330813384434
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "left",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "ED91F1C5-D2D0-42A0-8686-4B46303256FE"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Diffusion", "Diffusion Products"],
						manufacturer: "",
						name: "Diffuse Signature Wood (1\" Standoff Sides Open)",
						material: "Diffuse Signature Wood (1\" Standoff Sides Open)",
						absorption: {
							63: 0,
							125: 0,
							250: .02,
							500: .06,
							1e3: .16,
							2e3: .13,
							4e3: .15,
							8e3: .17
						},
						nrc: .09,
						source: "SH",
						description: "",
						uuid: "tgGAnP5OCLWlPFF4"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "088EC67F-85BA-4323-BB08-C0213F5F6CA2",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										12.430130004882812,
										0,
										0,
										0,
										0,
										2.9337000846862793,
										12.430130004882812,
										0,
										2.9337000846862793,
										12.430130004882812,
										0,
										0,
										0,
										0,
										0,
										0,
										0,
										2.9337000846862793
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									6.215065002441406,
									0,
									1.4668500423431396
								],
								radius: 6.3858188223041585
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "front",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "0AECC234-8C09-4D6B-AA82-DC0A99B42F2D"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Ceiling", " Ceiling Systems"],
						manufacturer: "",
						name: "Barrisol Stretched Ceiling Over 3\" Fiberglass",
						material: "Barrisol Stretched Ceiling over 3\" fiberglass",
						absorption: {
							63: .18,
							125: .26,
							250: .58,
							500: .57,
							1e3: .43,
							2e3: .36,
							4e3: .36,
							8e3: .36
						},
						nrc: .49,
						source: "SH",
						description: "",
						uuid: "Wz4CjrpqIYGba8G0"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "95B298C8-96A1-41A1-9A71-D7C446A0AB46",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										12.430130004882812,
										0,
										2.9337000846862793,
										0,
										2.3483328819274902,
										4.876800060272217,
										12.430130004882812,
										2.3483328819274902,
										4.876800060272217,
										12.430130004882812,
										0,
										2.9337000846862793,
										0,
										0,
										2.9337000846862793,
										0,
										2.3483328819274902,
										4.876800060272217
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										.637499988079071,
										-.7705000042915344,
										0,
										.637499988079071,
										-.7705000042915344,
										0,
										.637499988079071,
										-.7705000042915344,
										0,
										.637499988079071,
										-.7705000042915344,
										0,
										.637499988079071,
										-.7705000042915344,
										0,
										.637499988079071,
										-.7705000042915344
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									6.215065002441406,
									1.1741664409637451,
									3.905250072479248
								],
								radius: 6.399188166825382
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "slope",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "ABA66075-FD1A-4820-B591-66EE2A92CFDB"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Ceiling", " Ceiling Systems"],
						manufacturer: "",
						name: "Dampa Linar 100 Ceiling System",
						material: "Dampa Linar 100 Ceiling System",
						absorption: {
							63: .34,
							125: .48,
							250: .67,
							500: .69,
							1e3: .61,
							2e3: .46,
							4e3: .49,
							8e3: .52
						},
						nrc: .61,
						source: "SH",
						description: "",
						uuid: "s9OvPvd4RDogxQn7"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "333C7898-A815-420A-89D6-3D96BB178242",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										12.430130004882812,
										2.3483328819274902,
										4.876800060272217,
										6.215065002441406,
										5.575300216674805,
										4.876800060272217,
										12.430130004882812,
										5.575300216674805,
										4.876800060272217,
										6.215065002441406,
										5.575300216674805,
										4.876800060272217,
										0,
										10.855531692504883,
										4.876800060272217,
										6.215065002441406,
										10.855531692504883,
										4.876800060272217,
										12.430130004882812,
										2.3483328819274902,
										4.876800060272217,
										0,
										2.3483328819274902,
										4.876800060272217,
										6.215065002441406,
										5.575300216674805,
										4.876800060272217,
										6.215065002441406,
										5.575300216674805,
										4.876800060272217,
										0,
										2.3483328819274902,
										4.876800060272217,
										0,
										10.855531692504883,
										4.876800060272217
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1,
										0,
										0,
										-1
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									6.215065002441406,
									6.6019322872161865,
									4.876800060272217
								],
								radius: 7.531277506853956
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "ceil",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "522A95C7-E134-4D1C-92DD-8672102F06E6"
				},
				{
					kind: "surface",
					visible: !0,
					acousticMaterial: {
						tags: ["Floors", "Various"],
						manufacturer: "",
						name: "Wood Floor",
						material: "Wood floor",
						absorption: {
							63: .06,
							125: .15,
							250: .11,
							500: .1,
							1e3: .07,
							2e3: .06,
							4e3: .07,
							8e3: .07
						},
						nrc: .09,
						source: "Egan",
						description: "",
						uuid: "1PgJwgIAqHwMj99A"
					},
					geometry: {
						metadata: {
							version: 4.5,
							type: "BufferGeometry",
							generator: "BufferGeometry.toJSON"
						},
						uuid: "203BF944-7E6E-4539-B678-F2064CCC8619",
						type: "BufferGeometry",
						name: "surface-geometry",
						data: {
							attributes: {
								position: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										6.215065002441406,
										5.575300216674805,
										0,
										12.430130004882812,
										0,
										0,
										12.430130004882812,
										5.575300216674805,
										0,
										6.215065002441406,
										5.575300216674805,
										0,
										0,
										10.855531692504883,
										0,
										0,
										0,
										0,
										6.215065002441406,
										5.575300216674805,
										0,
										0,
										0,
										0,
										12.430130004882812,
										0,
										0,
										6.215065002441406,
										5.575300216674805,
										0,
										6.215065002441406,
										10.855531692504883,
										0,
										0,
										10.855531692504883,
										0
									],
									normalized: !1
								},
								normals: {
									itemSize: 3,
									type: "Float32Array",
									array: [
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1,
										0,
										0,
										1
									],
									normalized: !1
								},
								texCoords: {
									itemSize: 3,
									type: "Float32Array",
									array: [],
									normalized: !1
								}
							},
							boundingSphere: {
								center: [
									6.215065002441406,
									5.427765846252441,
									0
								],
								radius: 8.25152562053324
							}
						}
					},
					displayVertexNormals: !1,
					fillSurface: !0,
					wireframeVisible: !1,
					edgesVisible: !0,
					name: "floor",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "34B96D2E-706E-45E8-91D2-0F8FF35AA11E"
				}
			],
			kind: "room",
			name: "new room",
			uuid: "77F26146-94CF-46F8-870D-BB5A41C9D802",
			units: 2,
			originalFileData: "",
			originalFileName: "",
			visible: !0,
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			]
		},
		{
			kind: "source",
			name: "new source",
			visible: !0,
			position: [
				3.7,
				9.9,
				1
			],
			scale: [
				1,
				1,
				1
			],
			rotation: [
				0,
				0,
				0,
				"XYZ"
			],
			color: 10668418,
			uuid: "2825008E-9269-4453-BB81-2290852E5A81"
		},
		{
			kind: "receiver",
			name: "new receiver",
			visible: !0,
			position: [
				10.8,
				3.8000000000000003,
				1.2000000000000002
			],
			scale: [
				1,
				1,
				1
			],
			rotation: [
				0,
				0,
				0,
				"XYZ"
			],
			color: 14511983,
			uuid: "3198FEAC-8F9F-4362-8FB8-ADE61D8A708A"
		}
	],
	solvers: [{
		name: "Ray Tracer",
		kind: "ray-tracer",
		uuid: "1d67c7f8-9c6f-43db-9b20-01b3c6f2feab",
		roomID: "77F26146-94CF-46F8-870D-BB5A41C9D802",
		sourceIDs: ["2825008E-9269-4453-BB81-2290852E5A81"],
		surfaceIDs: [
			"59F599B3-6554-4999-A93C-597E4B5275C1",
			"FDDD16D3-6E8D-4B4B-B4A1-D622E9D6D31D",
			"EA9AA1BF-BA53-4D0E-ACB0-95E7291666FC",
			"8C87C786-5188-48F7-BFD4-946EF78D1E65",
			"ED91F1C5-D2D0-42A0-8686-4B46303256FE",
			"0AECC234-8C09-4D6B-AA82-DC0A99B42F2D",
			"ABA66075-FD1A-4820-B591-66EE2A92CFDB",
			"522A95C7-E134-4D1C-92DD-8672102F06E6",
			"34B96D2E-706E-45E8-91D2-0F8FF35AA11E"
		],
		receiverIDs: ["3198FEAC-8F9F-4362-8FB8-ADE61D8A708A"],
		updateInterval: 5,
		passes: 500,
		pointSize: 2,
		reflectionOrder: 500,
		runningWithoutReceivers: !1,
		raysVisible: !0,
		pointsVisible: !0,
		invertedDrawStyle: !1,
		plotStyle: { mode: "lines" },
		paths: {}
	}]
}, rg = {
	meta: {
		version: "0.2.1",
		name: "auditorium",
		timestamp: "2021-04-29T11:59:27.330Z"
	},
	containers: [
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Floors", "Wood"],
				manufacturer: "",
				name: "Wood Stage Floor (T&G)",
				material: "Wood Stage Floor (T&G), 2 layers 1/2in, on joists",
				absorption: {
					63: .04,
					125: .1,
					250: .07,
					500: .06,
					1e3: .06,
					2e3: .06,
					4e3: .06,
					8e3: .06
				},
				nrc: .06,
				source: "Beranek (JASA '98)",
				description: "",
				uuid: "ZdwcxUjnCaTijM8d"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "400B3C98-438F-414E-9A39-2D5BAC219DC3",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								3.6396543979644775,
								14.278063774108887,
								-.6776000261306763,
								3.6396543979644775,
								14.278063774108887,
								0,
								3.6396543979644775,
								-.7260642051696777,
								-.6776000261306763,
								3.6396543979644775,
								-.7260642051696777,
								0,
								3.6396543979644775,
								-.7260642051696777,
								-.6776000261306763,
								3.6396543979644775,
								14.278063774108887,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							3.6396543979644775,
							6.7759997844696045,
							-.33880001306533813
						],
						radius: 7.509710350838808
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-0",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "684C19AC-22BD-45FE-898C-C5166936CDDD"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Floors", "Wood"],
				manufacturer: "",
				name: "Wood Stage Floor (T&G)",
				material: "Wood Stage Floor (T&G), 2 layers 1/2in, on joists",
				absorption: {
					63: .04,
					125: .1,
					250: .07,
					500: .06,
					1e3: .06,
					2e3: .06,
					4e3: .06,
					8e3: .06
				},
				nrc: .06,
				source: "Beranek (JASA '98)",
				description: "",
				uuid: "ZdwcxUjnCaTijM8d"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "E97F47E2-3237-4B92-A531-B8C3A9AF9885",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								3.6396543979644775,
								-.7260642051696777,
								0,
								3.6396543979644775,
								14.278063774108887,
								0,
								3.388000011444092,
								-1.3552000522613525,
								0,
								3.6396543979644775,
								14.278063774108887,
								0,
								3.388000011444092,
								14.90719985961914,
								0,
								3.388000011444092,
								-1.3552000522613525,
								0,
								3.388000011444092,
								-1.3552000522613525,
								0,
								3.388000011444092,
								14.90719985961914,
								0,
								0,
								0,
								0,
								0,
								13.552000045776367,
								0,
								0,
								0,
								0,
								3.388000011444092,
								14.90719985961914,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							1.8198271989822388,
							6.775999903678894,
							0
						],
						radius: 8.28103729572734
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-16",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "019734C7-A913-4997-AF56-4127C064DCBC"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Tectum",
				material: "Tectum, 1in, against solid backing",
				absorption: {
					63: 0,
					125: .06,
					250: .13,
					500: .24,
					1e3: .45,
					2e3: .82,
					4e3: .64,
					8e3: .64
				},
				nrc: .41,
				source: "Tectum Company",
				description: "",
				uuid: "W2wCsvqJV0a1RMGw"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "AA8A615E-B0F8-4810-9B76-E960FD96910E",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								25.27349090576172,
								0,
								8.243200302124023,
								25.27349090576172,
								0,
								.5723999738693237,
								23.240692138671875,
								-4.500878810882568,
								8.243200302124023,
								23.240692138671875,
								-4.500878810882568,
								.5723999738693237,
								23.240692138671875,
								-4.500878810882568,
								8.243200302124023,
								25.27349090576172,
								0,
								.5723999738693237
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-.9113596677780151,
								.4116109311580658,
								0,
								-.9113596677780151,
								.4116109311580658,
								0,
								-.9113596677780151,
								.4116109311580658,
								0,
								-.9113596677780151,
								.4116109311580658,
								0,
								-.9113596677780151,
								.4116109311580658,
								0,
								-.9113596677780151,
								.4116109311580658,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							24.257091522216797,
							-2.250439405441284,
							4.407800137996674
						],
						radius: 4.561561097192662
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-1",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "C4C1198C-8ECF-4945-8DBE-BECEBD6261D4"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Tectum",
				material: "Tectum, 1in, against solid backing",
				absorption: {
					63: 0,
					125: .06,
					250: .13,
					500: .24,
					1e3: .45,
					2e3: .82,
					4e3: .64,
					8e3: .64
				},
				nrc: .41,
				source: "Tectum Company",
				description: "",
				uuid: "W2wCsvqJV0a1RMGw"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "592E5C4E-1FF7-4AAE-8332-3EA1AF4A7B58",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								25.27349090576172,
								13.552000045776367,
								8.243200302124023,
								25.27349090576172,
								13.552000045776367,
								.5723999738693237,
								25.951091766357422,
								6.776000022888184,
								8.243200302124023,
								25.951091766357422,
								6.776000022888184,
								.5723999738693237,
								25.951091766357422,
								6.776000022888184,
								8.243200302124023,
								25.27349090576172,
								13.552000045776367,
								.5723999738693237
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-.9950371980667114,
								-.09950384497642517,
								0,
								-.9950371980667114,
								-.09950384497642517,
								0,
								-.9950371980667114,
								-.09950384497642517,
								0,
								-.9950371980667114,
								-.09950384497642517,
								0,
								-.9950371980667114,
								-.09950384497642517,
								0,
								-.9950371980667114,
								-.09950384497642517,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							25.61229133605957,
							10.164000034332275,
							4.407800137996674
						],
						radius: 5.128705901892141
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-2",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "BC98D1A7-A671-4D2C-A9B9-243FC24E6272"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Tectum",
				material: "Tectum, 1in, against solid backing",
				absorption: {
					63: 0,
					125: .06,
					250: .13,
					500: .24,
					1e3: .45,
					2e3: .82,
					4e3: .64,
					8e3: .64
				},
				nrc: .41,
				source: "Tectum Company",
				description: "",
				uuid: "W2wCsvqJV0a1RMGw"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "86233816-C227-485D-BCFB-3495AB27841E",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								25.951091766357422,
								6.776000022888184,
								8.243200302124023,
								25.951091766357422,
								6.776000022888184,
								.5723999738693237,
								25.27349090576172,
								0,
								8.243200302124023,
								25.27349090576172,
								0,
								.5723999738693237,
								25.27349090576172,
								0,
								8.243200302124023,
								25.951091766357422,
								6.776000022888184,
								.5723999738693237
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-.9950371980667114,
								.09950384497642517,
								0,
								-.9950371980667114,
								.09950384497642517,
								0,
								-.9950371980667114,
								.09950384497642517,
								0,
								-.9950371980667114,
								.09950384497642517,
								0,
								-.9950371980667114,
								.09950384497642517,
								0,
								-.9950371980667114,
								.09950384497642517,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							25.61229133605957,
							3.388000011444092,
							4.407800137996674
						],
						radius: 5.128705901892141
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-5",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "002B910B-36C7-478E-BF82-44A5E5827359"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Tectum",
				material: "Tectum, 1in, against solid backing",
				absorption: {
					63: 0,
					125: .06,
					250: .13,
					500: .24,
					1e3: .45,
					2e3: .82,
					4e3: .64,
					8e3: .64
				},
				nrc: .41,
				source: "Tectum Company",
				description: "",
				uuid: "W2wCsvqJV0a1RMGw"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "75B764E2-FFE8-476A-9917-7C248BD99988",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								23.240692138671875,
								18.052879333496094,
								8.243200302124023,
								23.240692138671875,
								18.052879333496094,
								.5723999738693237,
								25.27349090576172,
								13.552000045776367,
								8.243200302124023,
								25.27349090576172,
								13.552000045776367,
								.5723999738693237,
								25.27349090576172,
								13.552000045776367,
								8.243200302124023,
								23.240692138671875,
								18.052879333496094,
								.5723999738693237
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-.9113596677780151,
								-.411610871553421,
								0,
								-.9113596677780151,
								-.411610871553421,
								0,
								-.9113596677780151,
								-.411610871553421,
								0,
								-.9113596677780151,
								-.411610871553421,
								0,
								-.9113596677780151,
								-.411610871553421,
								0,
								-.9113596677780151,
								-.411610871553421,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							24.257091522216797,
							15.80243968963623,
							4.407800137996674
						],
						radius: 4.561561214816119
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-13",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "150F4026-17E8-4FA2-947C-7CCE8766672F"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["People", "Various"],
				manufacturer: "",
				name: "Audience In Upholstered Seats",
				material: "Audience in upholstered seats",
				absorption: {
					63: 0,
					125: .18,
					250: .4,
					500: .46,
					1e3: .46,
					2e3: .51,
					4e3: .46,
					8e3: .46
				},
				nrc: .46,
				source: "Hann Tucker",
				description: "",
				uuid: "QFCVbDYrU5uWvhK2"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "538BB9A3-68A2-425A-B70F-CD45E476386D",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								25.951091766357422,
								6.776000022888184,
								.5723999738693237,
								25.27349090576172,
								13.552000045776367,
								.5723999738693237,
								25.27349090576172,
								0,
								.5723999738693237,
								25.27349090576172,
								13.552000045776367,
								.5723999738693237,
								23.240692138671875,
								18.052879333496094,
								.5723999738693237,
								25.27349090576172,
								0,
								.5723999738693237,
								23.240692138671875,
								-4.500878810882568,
								.5723999738693237,
								25.27349090576172,
								0,
								.5723999738693237,
								23.240692138671875,
								18.052879333496094,
								.5723999738693237
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							24.59589195251465,
							6.776000261306763,
							.5723999738693237
						],
						radius: 11.358017791156218
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-3",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "95922F62-13C2-4C06-A997-99B18DE92370"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["People", "Various"],
				manufacturer: "",
				name: "Audience In Upholstered Seats",
				material: "Audience in upholstered seats",
				absorption: {
					63: 0,
					125: .18,
					250: .4,
					500: .46,
					1e3: .46,
					2e3: .51,
					4e3: .46,
					8e3: .46
				},
				nrc: .46,
				source: "Hann Tucker",
				description: "",
				uuid: "QFCVbDYrU5uWvhK2"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "EE864F8C-261F-4F61-B437-8B57B0567E6E",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								13.076691627502441,
								-4.500878810882568,
								.07240000367164612,
								13.076691627502441,
								18.052879333496094,
								.07240000367164612,
								3.6396543979644775,
								-.7260642051696777,
								-.6776000261306763,
								3.6396543979644775,
								14.278063774108887,
								-.6776000261306763,
								3.6396543979644775,
								-.7260642051696777,
								-.6776000261306763,
								13.076691627502441,
								18.052879333496094,
								.07240000367164612
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-.07922429591417313,
								0,
								.9968568086624146,
								-.07922429591417313,
								0,
								.9968568086624146,
								-.07922429591417313,
								0,
								.9968568086624146,
								-.07922429591417313,
								0,
								.9968568086624146,
								-.07922429591417313,
								0,
								.9968568086624146,
								-.07922429591417313,
								0,
								.9968568086624146
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							8.35817301273346,
							6.776000261306763,
							-.3026000112295151
						],
						radius: 12.230005909151432
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-17",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "12438BB0-6F74-48E6-A9BE-B8223FBBB05B"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["People", "Various"],
				manufacturer: "",
				name: "Audience In Upholstered Seats",
				material: "Audience in upholstered seats",
				absorption: {
					63: 0,
					125: .18,
					250: .4,
					500: .46,
					1e3: .46,
					2e3: .51,
					4e3: .46,
					8e3: .46
				},
				nrc: .46,
				source: "Hann Tucker",
				description: "",
				uuid: "QFCVbDYrU5uWvhK2"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "4ED29942-85B9-4630-A710-A701DC4A2A5F",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								23.240692138671875,
								-4.500878810882568,
								.5723999738693237,
								23.240692138671875,
								18.052879333496094,
								.5723999738693237,
								13.076691627502441,
								-4.500878810882568,
								.07240000367164612,
								13.076691627502441,
								18.052879333496094,
								.07240000367164612,
								13.076691627502441,
								-4.500878810882568,
								.07240000367164612,
								23.240692138671875,
								18.052879333496094,
								.5723999738693237
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-.04913381114602089,
								0,
								.9987922310829163,
								-.04913381114602089,
								0,
								.9987922310829163,
								-.04913381114602089,
								0,
								.9987922310829163,
								-.04913381114602089,
								0,
								.9987922310829163,
								-.04913381114602089,
								0,
								.9987922310829163,
								-.04913381114602089,
								0,
								.9987922310829163
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							18.158691883087158,
							6.776000261306763,
							.3223999887704849
						],
						radius: 12.37162997341475
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-18",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "B35F8F84-7DE4-4AE4-ABD1-08F6856713D0"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Plaster On Lath",
				material: "Plaster on lath",
				absorption: {
					63: .05,
					125: .14,
					250: .1,
					500: .06,
					1e3: .05,
					2e3: .04,
					4e3: .03,
					8e3: .03
				},
				nrc: .06,
				source: "Egan",
				description: "",
				uuid: "gRbBSYkSbePlqUoe"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "99A4D26C-5E26-4692-8C0D-CF185378CFA0",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								13.076691627502441,
								-4.500878810882568,
								7.493199825286865,
								13.076691627502441,
								-4.500878810882568,
								.07240000367164612,
								3.6396543979644775,
								-.7260642051696777,
								4.743199825286865,
								3.6396543979644775,
								-.7260642051696777,
								4.743199825286865,
								13.076691627502441,
								-4.500878810882568,
								.07240000367164612,
								3.6396543979644775,
								-.7260642051696777,
								0,
								3.6396543979644775,
								-.7260642051696777,
								-.6776000261306763,
								3.6396543979644775,
								-.7260642051696777,
								0,
								13.076691627502441,
								-4.500878810882568,
								.07240000367164612
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.3713906407356262,
								.9284766912460327,
								0,
								.3713906407356262,
								.9284766912460327,
								0,
								.3713906407356262,
								.9284766912460327,
								0,
								.3713906407356262,
								.9284766912460327,
								0,
								.3713906407356262,
								.9284766912460327,
								0,
								.3713906407356262,
								.9284766912460327,
								0,
								.3713906407356262,
								.9284766912460327,
								0,
								.3713906407356262,
								.9284766912460327,
								0,
								.3713906407356262,
								.9284766912460327,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							8.35817301273346,
							-2.613471508026123,
							3.4077998995780945
						],
						radius: 6.5205227396105645
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-4",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "5BCC2696-DB53-4AD8-8DD7-65A838026F6C"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Plaster On Lath",
				material: "Plaster on lath",
				absorption: {
					63: .05,
					125: .14,
					250: .1,
					500: .06,
					1e3: .05,
					2e3: .04,
					4e3: .03,
					8e3: .03
				},
				nrc: .06,
				source: "Egan",
				description: "",
				uuid: "gRbBSYkSbePlqUoe"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "6689D2A1-9B38-489C-9B43-42D02F03C7DB",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								15.076691627502441,
								18.052879333496094,
								8.243200302124023,
								13.076691627502441,
								18.052879333496094,
								7.493199825286865,
								23.240692138671875,
								18.052879333496094,
								8.243200302124023,
								23.240692138671875,
								18.052879333496094,
								8.243200302124023,
								13.076691627502441,
								18.052879333496094,
								7.493199825286865,
								23.240692138671875,
								18.052879333496094,
								.5723999738693237,
								13.076691627502441,
								18.052879333496094,
								.07240000367164612,
								23.240692138671875,
								18.052879333496094,
								.5723999738693237,
								13.076691627502441,
								18.052879333496094,
								7.493199825286865
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							18.158691883087158,
							18.052879333496094,
							4.157800152897835
						],
						radius: 6.520523060081951
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-6",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "E89777FF-93D0-456E-97D0-9CDD4961BB17"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Plaster On Lath",
				material: "Plaster on lath",
				absorption: {
					63: .05,
					125: .14,
					250: .1,
					500: .06,
					1e3: .05,
					2e3: .04,
					4e3: .03,
					8e3: .03
				},
				nrc: .06,
				source: "Egan",
				description: "",
				uuid: "gRbBSYkSbePlqUoe"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "DA4B11D6-24CC-472A-98D1-3E106C740E0C",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								13.076691627502441,
								18.052879333496094,
								7.493199825286865,
								3.6396543979644775,
								14.278063774108887,
								4.743199825286865,
								13.076691627502441,
								18.052879333496094,
								.07240000367164612,
								3.6396543979644775,
								14.278063774108887,
								4.743199825286865,
								3.6396543979644775,
								14.278063774108887,
								0,
								13.076691627502441,
								18.052879333496094,
								.07240000367164612,
								3.6396543979644775,
								14.278063774108887,
								-.6776000261306763,
								13.076691627502441,
								18.052879333496094,
								.07240000367164612,
								3.6396543979644775,
								14.278063774108887,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.3713907301425934,
								-.9284766912460327,
								0,
								.3713907301425934,
								-.9284766912460327,
								0,
								.3713907301425934,
								-.9284766912460327,
								0,
								.3713907301425934,
								-.9284766912460327,
								0,
								.3713907301425934,
								-.9284766912460327,
								0,
								.3713907301425934,
								-.9284766912460327,
								0,
								.3713907301425934,
								-.9284766912460327,
								0,
								.3713907301425934,
								-.9284766912460327,
								0,
								.3713907301425934,
								-.9284766912460327,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							8.35817301273346,
							16.16547155380249,
							3.4077998995780945
						],
						radius: 6.520522877634167
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-10",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "5612A937-9C2D-46F5-B75A-6C996F10815B"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Plaster On Lath",
				material: "Plaster on lath",
				absorption: {
					63: .05,
					125: .14,
					250: .1,
					500: .06,
					1e3: .05,
					2e3: .04,
					4e3: .03,
					8e3: .03
				},
				nrc: .06,
				source: "Egan",
				description: "",
				uuid: "gRbBSYkSbePlqUoe"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "5081D021-FEB7-41F7-91CD-DE1EF838C595",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								15.076691627502441,
								-4.500878810882568,
								8.243200302124023,
								23.240692138671875,
								-4.500878810882568,
								8.243200302124023,
								13.076691627502441,
								-4.500878810882568,
								7.493199825286865,
								23.240692138671875,
								-4.500878810882568,
								8.243200302124023,
								23.240692138671875,
								-4.500878810882568,
								.5723999738693237,
								13.076691627502441,
								-4.500878810882568,
								7.493199825286865,
								13.076691627502441,
								-4.500878810882568,
								.07240000367164612,
								13.076691627502441,
								-4.500878810882568,
								7.493199825286865,
								23.240692138671875,
								-4.500878810882568,
								.5723999738693237
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							18.158691883087158,
							-4.500878810882568,
							4.157800152897835
						],
						radius: 6.520523060081951
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-19",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "EAC1B97E-7C9F-4455-86E5-6688C117C43D"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Plaster On Lath",
				material: "Plaster on lath",
				absorption: {
					63: .05,
					125: .14,
					250: .1,
					500: .06,
					1e3: .05,
					2e3: .04,
					4e3: .03,
					8e3: .03
				},
				nrc: .06,
				source: "Egan",
				description: "",
				uuid: "gRbBSYkSbePlqUoe"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "1ED2615E-F9E7-477F-8751-E38570B227C2",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								25.951091766357422,
								6.776000022888184,
								8.243200302124023,
								25.27349090576172,
								0,
								8.243200302124023,
								25.27349090576172,
								13.552000045776367,
								8.243200302124023,
								25.27349090576172,
								13.552000045776367,
								8.243200302124023,
								25.27349090576172,
								0,
								8.243200302124023,
								23.240692138671875,
								18.052879333496094,
								8.243200302124023,
								25.27349090576172,
								0,
								8.243200302124023,
								23.240692138671875,
								-4.500878810882568,
								8.243200302124023,
								23.240692138671875,
								18.052879333496094,
								8.243200302124023,
								23.240692138671875,
								18.052879333496094,
								8.243200302124023,
								23.240692138671875,
								-4.500878810882568,
								8.243200302124023,
								15.076691627502441,
								18.052879333496094,
								8.243200302124023,
								15.076691627502441,
								-4.500878810882568,
								8.243200302124023,
								15.076691627502441,
								18.052879333496094,
								8.243200302124023,
								23.240692138671875,
								-4.500878810882568,
								8.243200302124023
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							20.51389169692993,
							6.776000261306763,
							8.243200302124023
						],
						radius: 12.519231054811794
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-7",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "ACC14F91-9609-4D98-BD92-DE179F50F4DF"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Concrete Block"],
				manufacturer: "",
				name: "Cmu",
				material: "CMU, painted",
				absorption: {
					63: .03,
					125: .1,
					250: .05,
					500: .06,
					1e3: .07,
					2e3: .09,
					4e3: .08,
					8e3: .08
				},
				nrc: .07,
				source: "wjhw?",
				description: "",
				uuid: "ByswUBFezm3zBKiE"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "447AAFC5-9DAB-428B-BFF8-90CE2859CED1",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								0,
								4.743199825286865,
								3.388000011444092,
								-1.3552000522613525,
								4.743199825286865,
								0,
								0,
								0,
								3.388000011444092,
								-1.3552000522613525,
								0,
								0,
								0,
								0,
								3.388000011444092,
								-1.3552000522613525,
								4.743199825286865
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.3713906705379486,
								.9284766912460327,
								0,
								.3713906705379486,
								.9284766912460327,
								0,
								.3713906705379486,
								.9284766912460327,
								0,
								.3713906705379486,
								.9284766912460327,
								0,
								.3713906705379486,
								.9284766912460327,
								0,
								.3713906705379486,
								.9284766912460327,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							1.694000005722046,
							-.6776000261306763,
							2.3715999126434326
						],
						radius: 2.9922005214304943
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-8",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "8C2E6B59-4406-46AA-BFFC-0DD3A540CC2B"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Concrete Block"],
				manufacturer: "",
				name: "Cmu",
				material: "CMU, painted",
				absorption: {
					63: .03,
					125: .1,
					250: .05,
					500: .06,
					1e3: .07,
					2e3: .09,
					4e3: .08,
					8e3: .08
				},
				nrc: .07,
				source: "wjhw?",
				description: "",
				uuid: "ByswUBFezm3zBKiE"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "CE7D1DD2-4D3C-4974-9990-04CB566F3914",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								3.388000011444092,
								14.90719985961914,
								4.743199825286865,
								0,
								13.552000045776367,
								4.743199825286865,
								3.388000011444092,
								14.90719985961914,
								0,
								0,
								13.552000045776367,
								0,
								3.388000011444092,
								14.90719985961914,
								0,
								0,
								13.552000045776367,
								4.743199825286865
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.37139061093330383,
								-.9284766912460327,
								0,
								.37139061093330383,
								-.9284766912460327,
								0,
								.37139061093330383,
								-.9284766912460327,
								0,
								.37139061093330383,
								-.9284766912460327,
								0,
								.37139061093330383,
								-.9284766912460327,
								0,
								.37139061093330383,
								-.9284766912460327,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							1.694000005722046,
							14.229599952697754,
							2.3715999126434326
						],
						radius: 2.9922004944349068
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-9",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "23667DCD-801B-4519-AE5D-D24386E78799"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Concrete Block"],
				manufacturer: "",
				name: "Cmu",
				material: "CMU, painted",
				absorption: {
					63: .03,
					125: .1,
					250: .05,
					500: .06,
					1e3: .07,
					2e3: .09,
					4e3: .08,
					8e3: .08
				},
				nrc: .07,
				source: "wjhw?",
				description: "",
				uuid: "ByswUBFezm3zBKiE"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "AC13C7F5-F22B-4EB1-ABF2-19323297501A",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								3.6396543979644775,
								-.7260642051696777,
								4.743199825286865,
								3.6396543979644775,
								-.7260642051696777,
								0,
								3.388000011444092,
								-1.3552000522613525,
								4.743199825286865,
								3.388000011444092,
								-1.3552000522613525,
								0,
								3.388000011444092,
								-1.3552000522613525,
								4.743199825286865,
								3.6396543979644775,
								-.7260642051696777,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-.9284766912460327,
								.3713907301425934,
								0,
								-.9284766912460327,
								.3713907301425934,
								0,
								-.9284766912460327,
								.3713907301425934,
								0,
								-.9284766912460327,
								.3713907301425934,
								0,
								-.9284766912460327,
								.3713907301425934,
								0,
								-.9284766912460327,
								.3713907301425934,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							3.5138272047042847,
							-1.0406321287155151,
							2.3715999126434326
						],
						radius: 2.395677692582626
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-11",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "09FB51AD-73E9-480E-A3E5-6932C31787DE"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Concrete Block"],
				manufacturer: "",
				name: "Cmu",
				material: "CMU, painted",
				absorption: {
					63: .03,
					125: .1,
					250: .05,
					500: .06,
					1e3: .07,
					2e3: .09,
					4e3: .08,
					8e3: .08
				},
				nrc: .07,
				source: "wjhw?",
				description: "",
				uuid: "ByswUBFezm3zBKiE"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "0C7929BE-458F-413B-BC92-D7FBF0D28AB8",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								3.388000011444092,
								14.90719985961914,
								4.743199825286865,
								3.388000011444092,
								14.90719985961914,
								0,
								3.6396543979644775,
								14.278063774108887,
								4.743199825286865,
								3.6396543979644775,
								14.278063774108887,
								0,
								3.6396543979644775,
								14.278063774108887,
								4.743199825286865,
								3.388000011444092,
								14.90719985961914,
								0
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								-.9284766912460327,
								-.37139061093330383,
								0,
								-.9284766912460327,
								-.37139061093330383,
								0,
								-.9284766912460327,
								-.37139061093330383,
								0,
								-.9284766912460327,
								-.37139061093330383,
								0,
								-.9284766912460327,
								-.37139061093330383,
								0,
								-.9284766912460327,
								-.37139061093330383,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							3.5138272047042847,
							14.592631816864014,
							2.3715999126434326
						],
						radius: 2.395677708235577
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-12",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "94111689-BEE4-4E6E-98FA-8CEBFC57DE7B"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Concrete Block"],
				manufacturer: "",
				name: "Cmu",
				material: "CMU, painted",
				absorption: {
					63: .03,
					125: .1,
					250: .05,
					500: .06,
					1e3: .07,
					2e3: .09,
					4e3: .08,
					8e3: .08
				},
				nrc: .07,
				source: "wjhw?",
				description: "",
				uuid: "ByswUBFezm3zBKiE"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "41B752A6-4A0A-4F6E-9EB0-B5E799D8D9C4",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								13.552000045776367,
								0,
								0,
								13.552000045776367,
								4.743199825286865,
								0,
								0,
								0,
								0,
								0,
								4.743199825286865,
								0,
								0,
								0,
								0,
								13.552000045776367,
								4.743199825286865
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0,
								1,
								0,
								0
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							0,
							6.776000022888184,
							2.3715999126434326
						],
						radius: 7.179043282766235
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-15",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "DF5D8BCC-C7BF-41EC-994B-09CCCD4D67C7"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Plaster On Lath",
				material: "Plaster on lath",
				absorption: {
					63: .05,
					125: .14,
					250: .1,
					500: .06,
					1e3: .05,
					2e3: .04,
					4e3: .03,
					8e3: .03
				},
				nrc: .06,
				source: "Egan",
				description: "",
				uuid: "gRbBSYkSbePlqUoe"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "899F381E-5921-4775-9F58-92044872FF55",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								3.6396543979644775,
								14.278063774108887,
								4.743199825286865,
								3.6396543979644775,
								-.7260642051696777,
								4.743199825286865,
								3.388000011444092,
								14.90719985961914,
								4.743199825286865,
								3.6396543979644775,
								-.7260642051696777,
								4.743199825286865,
								3.388000011444092,
								-1.3552000522613525,
								4.743199825286865,
								3.388000011444092,
								14.90719985961914,
								4.743199825286865,
								3.388000011444092,
								14.90719985961914,
								4.743199825286865,
								3.388000011444092,
								-1.3552000522613525,
								4.743199825286865,
								0,
								13.552000045776367,
								4.743199825286865,
								0,
								0,
								4.743199825286865,
								0,
								13.552000045776367,
								4.743199825286865,
								3.388000011444092,
								-1.3552000522613525,
								4.743199825286865
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1,
								0,
								0,
								-1
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							1.8198271989822388,
							6.775999903678894,
							4.743199825286865
						],
						radius: 8.28103729572734
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-14",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "E8C1CCA5-3787-4C6B-8A87-2F6B6C1709B6"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Plaster On Lath",
				material: "Plaster on lath",
				absorption: {
					63: .05,
					125: .14,
					250: .1,
					500: .06,
					1e3: .05,
					2e3: .04,
					4e3: .03,
					8e3: .03
				},
				nrc: .06,
				source: "Egan",
				description: "",
				uuid: "gRbBSYkSbePlqUoe"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "57731404-5792-4623-B964-263A68EFD1AD",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								15.076691627502441,
								18.052879333496094,
								8.243200302124023,
								15.076691627502441,
								-4.500878810882568,
								8.243200302124023,
								13.076691627502441,
								18.052879333496094,
								7.493199825286865,
								13.076691627502441,
								-4.500878810882568,
								7.493199825286865,
								13.076691627502441,
								18.052879333496094,
								7.493199825286865,
								15.076691627502441,
								-4.500878810882568,
								8.243200302124023
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.3511236310005188,
								0,
								-.9363291263580322,
								.3511236310005188,
								0,
								-.9363291263580322,
								.3511236310005188,
								0,
								-.9363291263580322,
								.3511236310005188,
								0,
								-.9363291263580322,
								.3511236310005188,
								0,
								-.9363291263580322,
								.3511236310005188,
								0,
								-.9363291263580322
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							14.076691627502441,
							6.776000261306763,
							7.868200063705444
						],
						radius: 11.327339793066848
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-20",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "871ED5D3-5913-47D3-8585-D6C3BDB05F4E"
		},
		{
			kind: "surface",
			visible: !0,
			acousticMaterial: {
				tags: ["Walls", "Various"],
				manufacturer: "",
				name: "Plaster On Lath",
				material: "Plaster on lath",
				absorption: {
					63: .05,
					125: .14,
					250: .1,
					500: .06,
					1e3: .05,
					2e3: .04,
					4e3: .03,
					8e3: .03
				},
				nrc: .06,
				source: "Egan",
				description: "",
				uuid: "gRbBSYkSbePlqUoe"
			},
			geometry: {
				metadata: {
					version: 4.5,
					type: "BufferGeometry",
					generator: "BufferGeometry.toJSON"
				},
				uuid: "8B8AAEEE-9E0B-486F-837A-74A372F11975",
				type: "BufferGeometry",
				name: "surface-geometry",
				data: {
					attributes: {
						position: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								13.076691627502441,
								18.052879333496094,
								7.493199825286865,
								13.076691627502441,
								-4.500878810882568,
								7.493199825286865,
								3.6396543979644775,
								14.278063774108887,
								4.743199825286865,
								3.6396543979644775,
								-.7260642051696777,
								4.743199825286865,
								3.6396543979644775,
								14.278063774108887,
								4.743199825286865,
								13.076691627502441,
								-4.500878810882568,
								7.493199825286865
							],
							normalized: !1
						},
						normals: {
							itemSize: 3,
							type: "Float32Array",
							array: [
								.2797684967517853,
								0,
								-.9600675106048584,
								.2797684967517853,
								0,
								-.9600675106048584,
								.2797684967517853,
								0,
								-.9600675106048584,
								.2797684967517853,
								0,
								-.9600675106048584,
								.2797684967517853,
								0,
								-.9600675106048584,
								.2797684967517853,
								0,
								-.9600675106048584
							],
							normalized: !1
						}
					},
					boundingSphere: {
						center: [
							8.35817301273346,
							6.776000261306763,
							6.118199825286865
						],
						radius: 12.3013432001023
					}
				}
			},
			displayVertexNormals: !1,
			fillSurface: !0,
			wireframeVisible: !1,
			edgesVisible: !0,
			name: "untitled-21",
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			uuid: "258494C4-8017-4C71-A8CA-32E17274FEA9"
		},
		{
			surfaces: [
				{
					kind: "container",
					visible: !0,
					name: "STAGE_FLOOR",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "C25652F3-D7EC-42DE-82CA-1A4CCCE37874",
					children: [{
						kind: "surface",
						visible: !0,
						acousticMaterial: {
							tags: ["Floors", "Wood"],
							manufacturer: "",
							name: "Wood Stage Floor (T&G)",
							material: "Wood Stage Floor (T&G), 2 layers 1/2in, on joists",
							absorption: {
								63: .04,
								125: .1,
								250: .07,
								500: .06,
								1e3: .06,
								2e3: .06,
								4e3: .06,
								8e3: .06
							},
							nrc: .06,
							source: "Beranek (JASA '98)",
							description: "",
							uuid: "ZdwcxUjnCaTijM8d"
						},
						geometry: {
							metadata: {
								version: 4.5,
								type: "BufferGeometry",
								generator: "BufferGeometry.toJSON"
							},
							uuid: "400B3C98-438F-414E-9A39-2D5BAC219DC3",
							type: "BufferGeometry",
							name: "surface-geometry",
							data: {
								attributes: {
									position: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											3.6396543979644775,
											14.278063774108887,
											-.6776000261306763,
											3.6396543979644775,
											14.278063774108887,
											0,
											3.6396543979644775,
											-.7260642051696777,
											-.6776000261306763,
											3.6396543979644775,
											-.7260642051696777,
											0,
											3.6396543979644775,
											-.7260642051696777,
											-.6776000261306763,
											3.6396543979644775,
											14.278063774108887,
											0
										],
										normalized: !1
									},
									normals: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0
										],
										normalized: !1
									}
								},
								boundingSphere: {
									center: [
										3.6396543979644775,
										6.7759997844696045,
										-.33880001306533813
									],
									radius: 7.509710350838808
								}
							}
						},
						displayVertexNormals: !1,
						fillSurface: !0,
						wireframeVisible: !1,
						edgesVisible: !0,
						name: "untitled-0",
						position: [
							0,
							0,
							0
						],
						rotation: [
							0,
							0,
							0
						],
						scale: [
							1,
							1,
							1
						],
						uuid: "684C19AC-22BD-45FE-898C-C5166936CDDD"
					}, {
						kind: "surface",
						visible: !0,
						acousticMaterial: {
							tags: ["Floors", "Wood"],
							manufacturer: "",
							name: "Wood Stage Floor (T&G)",
							material: "Wood Stage Floor (T&G), 2 layers 1/2in, on joists",
							absorption: {
								63: .04,
								125: .1,
								250: .07,
								500: .06,
								1e3: .06,
								2e3: .06,
								4e3: .06,
								8e3: .06
							},
							nrc: .06,
							source: "Beranek (JASA '98)",
							description: "",
							uuid: "ZdwcxUjnCaTijM8d"
						},
						geometry: {
							metadata: {
								version: 4.5,
								type: "BufferGeometry",
								generator: "BufferGeometry.toJSON"
							},
							uuid: "E97F47E2-3237-4B92-A531-B8C3A9AF9885",
							type: "BufferGeometry",
							name: "surface-geometry",
							data: {
								attributes: {
									position: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											3.6396543979644775,
											-.7260642051696777,
											0,
											3.6396543979644775,
											14.278063774108887,
											0,
											3.388000011444092,
											-1.3552000522613525,
											0,
											3.6396543979644775,
											14.278063774108887,
											0,
											3.388000011444092,
											14.90719985961914,
											0,
											3.388000011444092,
											-1.3552000522613525,
											0,
											3.388000011444092,
											-1.3552000522613525,
											0,
											3.388000011444092,
											14.90719985961914,
											0,
											0,
											0,
											0,
											0,
											13.552000045776367,
											0,
											0,
											0,
											0,
											3.388000011444092,
											14.90719985961914,
											0
										],
										normalized: !1
									},
									normals: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1,
											0,
											0,
											1
										],
										normalized: !1
									}
								},
								boundingSphere: {
									center: [
										1.8198271989822388,
										6.775999903678894,
										0
									],
									radius: 8.28103729572734
								}
							}
						},
						displayVertexNormals: !1,
						fillSurface: !0,
						wireframeVisible: !1,
						edgesVisible: !0,
						name: "untitled-16",
						position: [
							0,
							0,
							0
						],
						rotation: [
							0,
							0,
							0
						],
						scale: [
							1,
							1,
							1
						],
						uuid: "019734C7-A913-4997-AF56-4127C064DCBC"
					}]
				},
				{
					kind: "container",
					visible: !0,
					name: "BACK_WALL",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "50EAB1A6-F698-4B51-943F-6B1DB50A9316",
					children: [
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Various"],
								manufacturer: "",
								name: "Tectum",
								material: "Tectum, 1in, against solid backing",
								absorption: {
									63: 0,
									125: .06,
									250: .13,
									500: .24,
									1e3: .45,
									2e3: .82,
									4e3: .64,
									8e3: .64
								},
								nrc: .41,
								source: "Tectum Company",
								description: "",
								uuid: "W2wCsvqJV0a1RMGw"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "AA8A615E-B0F8-4810-9B76-E960FD96910E",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												25.27349090576172,
												0,
												8.243200302124023,
												25.27349090576172,
												0,
												.5723999738693237,
												23.240692138671875,
												-4.500878810882568,
												8.243200302124023,
												23.240692138671875,
												-4.500878810882568,
												.5723999738693237,
												23.240692138671875,
												-4.500878810882568,
												8.243200302124023,
												25.27349090576172,
												0,
												.5723999738693237
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												-.9113596677780151,
												.4116109311580658,
												0,
												-.9113596677780151,
												.4116109311580658,
												0,
												-.9113596677780151,
												.4116109311580658,
												0,
												-.9113596677780151,
												.4116109311580658,
												0,
												-.9113596677780151,
												.4116109311580658,
												0,
												-.9113596677780151,
												.4116109311580658,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											24.257091522216797,
											-2.250439405441284,
											4.407800137996674
										],
										radius: 4.561561097192662
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-1",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "C4C1198C-8ECF-4945-8DBE-BECEBD6261D4"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Various"],
								manufacturer: "",
								name: "Tectum",
								material: "Tectum, 1in, against solid backing",
								absorption: {
									63: 0,
									125: .06,
									250: .13,
									500: .24,
									1e3: .45,
									2e3: .82,
									4e3: .64,
									8e3: .64
								},
								nrc: .41,
								source: "Tectum Company",
								description: "",
								uuid: "W2wCsvqJV0a1RMGw"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "592E5C4E-1FF7-4AAE-8332-3EA1AF4A7B58",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												25.27349090576172,
												13.552000045776367,
												8.243200302124023,
												25.27349090576172,
												13.552000045776367,
												.5723999738693237,
												25.951091766357422,
												6.776000022888184,
												8.243200302124023,
												25.951091766357422,
												6.776000022888184,
												.5723999738693237,
												25.951091766357422,
												6.776000022888184,
												8.243200302124023,
												25.27349090576172,
												13.552000045776367,
												.5723999738693237
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												-.9950371980667114,
												-.09950384497642517,
												0,
												-.9950371980667114,
												-.09950384497642517,
												0,
												-.9950371980667114,
												-.09950384497642517,
												0,
												-.9950371980667114,
												-.09950384497642517,
												0,
												-.9950371980667114,
												-.09950384497642517,
												0,
												-.9950371980667114,
												-.09950384497642517,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											25.61229133605957,
											10.164000034332275,
											4.407800137996674
										],
										radius: 5.128705901892141
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-2",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "BC98D1A7-A671-4D2C-A9B9-243FC24E6272"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Various"],
								manufacturer: "",
								name: "Tectum",
								material: "Tectum, 1in, against solid backing",
								absorption: {
									63: 0,
									125: .06,
									250: .13,
									500: .24,
									1e3: .45,
									2e3: .82,
									4e3: .64,
									8e3: .64
								},
								nrc: .41,
								source: "Tectum Company",
								description: "",
								uuid: "W2wCsvqJV0a1RMGw"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "86233816-C227-485D-BCFB-3495AB27841E",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												25.951091766357422,
												6.776000022888184,
												8.243200302124023,
												25.951091766357422,
												6.776000022888184,
												.5723999738693237,
												25.27349090576172,
												0,
												8.243200302124023,
												25.27349090576172,
												0,
												.5723999738693237,
												25.27349090576172,
												0,
												8.243200302124023,
												25.951091766357422,
												6.776000022888184,
												.5723999738693237
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												-.9950371980667114,
												.09950384497642517,
												0,
												-.9950371980667114,
												.09950384497642517,
												0,
												-.9950371980667114,
												.09950384497642517,
												0,
												-.9950371980667114,
												.09950384497642517,
												0,
												-.9950371980667114,
												.09950384497642517,
												0,
												-.9950371980667114,
												.09950384497642517,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											25.61229133605957,
											3.388000011444092,
											4.407800137996674
										],
										radius: 5.128705901892141
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-5",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "002B910B-36C7-478E-BF82-44A5E5827359"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Various"],
								manufacturer: "",
								name: "Tectum",
								material: "Tectum, 1in, against solid backing",
								absorption: {
									63: 0,
									125: .06,
									250: .13,
									500: .24,
									1e3: .45,
									2e3: .82,
									4e3: .64,
									8e3: .64
								},
								nrc: .41,
								source: "Tectum Company",
								description: "",
								uuid: "W2wCsvqJV0a1RMGw"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "75B764E2-FFE8-476A-9917-7C248BD99988",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												23.240692138671875,
												18.052879333496094,
												8.243200302124023,
												23.240692138671875,
												18.052879333496094,
												.5723999738693237,
												25.27349090576172,
												13.552000045776367,
												8.243200302124023,
												25.27349090576172,
												13.552000045776367,
												.5723999738693237,
												25.27349090576172,
												13.552000045776367,
												8.243200302124023,
												23.240692138671875,
												18.052879333496094,
												.5723999738693237
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												-.9113596677780151,
												-.411610871553421,
												0,
												-.9113596677780151,
												-.411610871553421,
												0,
												-.9113596677780151,
												-.411610871553421,
												0,
												-.9113596677780151,
												-.411610871553421,
												0,
												-.9113596677780151,
												-.411610871553421,
												0,
												-.9113596677780151,
												-.411610871553421,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											24.257091522216797,
											15.80243968963623,
											4.407800137996674
										],
										radius: 4.561561214816119
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-13",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "150F4026-17E8-4FA2-947C-7CCE8766672F"
						}
					]
				},
				{
					kind: "container",
					visible: !0,
					name: "FLOOR",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "22B49FEC-509E-4278-A6EE-C8C7E484A4CD",
					children: [
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["People", "Various"],
								manufacturer: "",
								name: "Audience In Upholstered Seats",
								material: "Audience in upholstered seats",
								absorption: {
									63: 0,
									125: .18,
									250: .4,
									500: .46,
									1e3: .46,
									2e3: .51,
									4e3: .46,
									8e3: .46
								},
								nrc: .46,
								source: "Hann Tucker",
								description: "",
								uuid: "QFCVbDYrU5uWvhK2"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "538BB9A3-68A2-425A-B70F-CD45E476386D",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												25.951091766357422,
												6.776000022888184,
												.5723999738693237,
												25.27349090576172,
												13.552000045776367,
												.5723999738693237,
												25.27349090576172,
												0,
												.5723999738693237,
												25.27349090576172,
												13.552000045776367,
												.5723999738693237,
												23.240692138671875,
												18.052879333496094,
												.5723999738693237,
												25.27349090576172,
												0,
												.5723999738693237,
												23.240692138671875,
												-4.500878810882568,
												.5723999738693237,
												25.27349090576172,
												0,
												.5723999738693237,
												23.240692138671875,
												18.052879333496094,
												.5723999738693237
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											24.59589195251465,
											6.776000261306763,
											.5723999738693237
										],
										radius: 11.358017791156218
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-3",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "95922F62-13C2-4C06-A997-99B18DE92370"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["People", "Various"],
								manufacturer: "",
								name: "Audience In Upholstered Seats",
								material: "Audience in upholstered seats",
								absorption: {
									63: 0,
									125: .18,
									250: .4,
									500: .46,
									1e3: .46,
									2e3: .51,
									4e3: .46,
									8e3: .46
								},
								nrc: .46,
								source: "Hann Tucker",
								description: "",
								uuid: "QFCVbDYrU5uWvhK2"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "EE864F8C-261F-4F61-B437-8B57B0567E6E",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												13.076691627502441,
												-4.500878810882568,
												.07240000367164612,
												13.076691627502441,
												18.052879333496094,
												.07240000367164612,
												3.6396543979644775,
												-.7260642051696777,
												-.6776000261306763,
												3.6396543979644775,
												14.278063774108887,
												-.6776000261306763,
												3.6396543979644775,
												-.7260642051696777,
												-.6776000261306763,
												13.076691627502441,
												18.052879333496094,
												.07240000367164612
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												-.07922429591417313,
												0,
												.9968568086624146,
												-.07922429591417313,
												0,
												.9968568086624146,
												-.07922429591417313,
												0,
												.9968568086624146,
												-.07922429591417313,
												0,
												.9968568086624146,
												-.07922429591417313,
												0,
												.9968568086624146,
												-.07922429591417313,
												0,
												.9968568086624146
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											8.35817301273346,
											6.776000261306763,
											-.3026000112295151
										],
										radius: 12.230005909151432
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-17",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "12438BB0-6F74-48E6-A9BE-B8223FBBB05B"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["People", "Various"],
								manufacturer: "",
								name: "Audience In Upholstered Seats",
								material: "Audience in upholstered seats",
								absorption: {
									63: 0,
									125: .18,
									250: .4,
									500: .46,
									1e3: .46,
									2e3: .51,
									4e3: .46,
									8e3: .46
								},
								nrc: .46,
								source: "Hann Tucker",
								description: "",
								uuid: "QFCVbDYrU5uWvhK2"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "4ED29942-85B9-4630-A710-A701DC4A2A5F",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												23.240692138671875,
												-4.500878810882568,
												.5723999738693237,
												23.240692138671875,
												18.052879333496094,
												.5723999738693237,
												13.076691627502441,
												-4.500878810882568,
												.07240000367164612,
												13.076691627502441,
												18.052879333496094,
												.07240000367164612,
												13.076691627502441,
												-4.500878810882568,
												.07240000367164612,
												23.240692138671875,
												18.052879333496094,
												.5723999738693237
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												-.04913381114602089,
												0,
												.9987922310829163,
												-.04913381114602089,
												0,
												.9987922310829163,
												-.04913381114602089,
												0,
												.9987922310829163,
												-.04913381114602089,
												0,
												.9987922310829163,
												-.04913381114602089,
												0,
												.9987922310829163,
												-.04913381114602089,
												0,
												.9987922310829163
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											18.158691883087158,
											6.776000261306763,
											.3223999887704849
										],
										radius: 12.37162997341475
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-18",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "B35F8F84-7DE4-4AE4-ABD1-08F6856713D0"
						}
					]
				},
				{
					kind: "container",
					visible: !0,
					name: "SIDE_WALLS",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "6FD07351-E2A3-48B5-A97E-4CF1292754D1",
					children: [
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Various"],
								manufacturer: "",
								name: "Plaster On Lath",
								material: "Plaster on lath",
								absorption: {
									63: .05,
									125: .14,
									250: .1,
									500: .06,
									1e3: .05,
									2e3: .04,
									4e3: .03,
									8e3: .03
								},
								nrc: .06,
								source: "Egan",
								description: "",
								uuid: "gRbBSYkSbePlqUoe"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "99A4D26C-5E26-4692-8C0D-CF185378CFA0",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												13.076691627502441,
												-4.500878810882568,
												7.493199825286865,
												13.076691627502441,
												-4.500878810882568,
												.07240000367164612,
												3.6396543979644775,
												-.7260642051696777,
												4.743199825286865,
												3.6396543979644775,
												-.7260642051696777,
												4.743199825286865,
												13.076691627502441,
												-4.500878810882568,
												.07240000367164612,
												3.6396543979644775,
												-.7260642051696777,
												0,
												3.6396543979644775,
												-.7260642051696777,
												-.6776000261306763,
												3.6396543979644775,
												-.7260642051696777,
												0,
												13.076691627502441,
												-4.500878810882568,
												.07240000367164612
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												.3713906407356262,
												.9284766912460327,
												0,
												.3713906407356262,
												.9284766912460327,
												0,
												.3713906407356262,
												.9284766912460327,
												0,
												.3713906407356262,
												.9284766912460327,
												0,
												.3713906407356262,
												.9284766912460327,
												0,
												.3713906407356262,
												.9284766912460327,
												0,
												.3713906407356262,
												.9284766912460327,
												0,
												.3713906407356262,
												.9284766912460327,
												0,
												.3713906407356262,
												.9284766912460327,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											8.35817301273346,
											-2.613471508026123,
											3.4077998995780945
										],
										radius: 6.5205227396105645
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-4",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "5BCC2696-DB53-4AD8-8DD7-65A838026F6C"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Various"],
								manufacturer: "",
								name: "Plaster On Lath",
								material: "Plaster on lath",
								absorption: {
									63: .05,
									125: .14,
									250: .1,
									500: .06,
									1e3: .05,
									2e3: .04,
									4e3: .03,
									8e3: .03
								},
								nrc: .06,
								source: "Egan",
								description: "",
								uuid: "gRbBSYkSbePlqUoe"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "6689D2A1-9B38-489C-9B43-42D02F03C7DB",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												15.076691627502441,
												18.052879333496094,
												8.243200302124023,
												13.076691627502441,
												18.052879333496094,
												7.493199825286865,
												23.240692138671875,
												18.052879333496094,
												8.243200302124023,
												23.240692138671875,
												18.052879333496094,
												8.243200302124023,
												13.076691627502441,
												18.052879333496094,
												7.493199825286865,
												23.240692138671875,
												18.052879333496094,
												.5723999738693237,
												13.076691627502441,
												18.052879333496094,
												.07240000367164612,
												23.240692138671875,
												18.052879333496094,
												.5723999738693237,
												13.076691627502441,
												18.052879333496094,
												7.493199825286865
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												0,
												-1,
												0,
												0,
												-1,
												0,
												0,
												-1,
												0,
												0,
												-1,
												0,
												0,
												-1,
												0,
												0,
												-1,
												0,
												0,
												-1,
												0,
												0,
												-1,
												0,
												0,
												-1,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											18.158691883087158,
											18.052879333496094,
											4.157800152897835
										],
										radius: 6.520523060081951
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-6",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "E89777FF-93D0-456E-97D0-9CDD4961BB17"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Various"],
								manufacturer: "",
								name: "Plaster On Lath",
								material: "Plaster on lath",
								absorption: {
									63: .05,
									125: .14,
									250: .1,
									500: .06,
									1e3: .05,
									2e3: .04,
									4e3: .03,
									8e3: .03
								},
								nrc: .06,
								source: "Egan",
								description: "",
								uuid: "gRbBSYkSbePlqUoe"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "DA4B11D6-24CC-472A-98D1-3E106C740E0C",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												13.076691627502441,
												18.052879333496094,
												7.493199825286865,
												3.6396543979644775,
												14.278063774108887,
												4.743199825286865,
												13.076691627502441,
												18.052879333496094,
												.07240000367164612,
												3.6396543979644775,
												14.278063774108887,
												4.743199825286865,
												3.6396543979644775,
												14.278063774108887,
												0,
												13.076691627502441,
												18.052879333496094,
												.07240000367164612,
												3.6396543979644775,
												14.278063774108887,
												-.6776000261306763,
												13.076691627502441,
												18.052879333496094,
												.07240000367164612,
												3.6396543979644775,
												14.278063774108887,
												0
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												.3713907301425934,
												-.9284766912460327,
												0,
												.3713907301425934,
												-.9284766912460327,
												0,
												.3713907301425934,
												-.9284766912460327,
												0,
												.3713907301425934,
												-.9284766912460327,
												0,
												.3713907301425934,
												-.9284766912460327,
												0,
												.3713907301425934,
												-.9284766912460327,
												0,
												.3713907301425934,
												-.9284766912460327,
												0,
												.3713907301425934,
												-.9284766912460327,
												0,
												.3713907301425934,
												-.9284766912460327,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											8.35817301273346,
											16.16547155380249,
											3.4077998995780945
										],
										radius: 6.520522877634167
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-10",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "5612A937-9C2D-46F5-B75A-6C996F10815B"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Various"],
								manufacturer: "",
								name: "Plaster On Lath",
								material: "Plaster on lath",
								absorption: {
									63: .05,
									125: .14,
									250: .1,
									500: .06,
									1e3: .05,
									2e3: .04,
									4e3: .03,
									8e3: .03
								},
								nrc: .06,
								source: "Egan",
								description: "",
								uuid: "gRbBSYkSbePlqUoe"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "5081D021-FEB7-41F7-91CD-DE1EF838C595",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												15.076691627502441,
												-4.500878810882568,
												8.243200302124023,
												23.240692138671875,
												-4.500878810882568,
												8.243200302124023,
												13.076691627502441,
												-4.500878810882568,
												7.493199825286865,
												23.240692138671875,
												-4.500878810882568,
												8.243200302124023,
												23.240692138671875,
												-4.500878810882568,
												.5723999738693237,
												13.076691627502441,
												-4.500878810882568,
												7.493199825286865,
												13.076691627502441,
												-4.500878810882568,
												.07240000367164612,
												13.076691627502441,
												-4.500878810882568,
												7.493199825286865,
												23.240692138671875,
												-4.500878810882568,
												.5723999738693237
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											18.158691883087158,
											-4.500878810882568,
											4.157800152897835
										],
										radius: 6.520523060081951
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-19",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "EAC1B97E-7C9F-4455-86E5-6688C117C43D"
						}
					]
				},
				{
					kind: "container",
					visible: !0,
					name: "FLAT_CEILING",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "2CFEC12E-3B4B-4FF6-A980-F48C4DFF00DD",
					children: [{
						kind: "surface",
						visible: !0,
						acousticMaterial: {
							tags: ["Walls", "Various"],
							manufacturer: "",
							name: "Plaster On Lath",
							material: "Plaster on lath",
							absorption: {
								63: .05,
								125: .14,
								250: .1,
								500: .06,
								1e3: .05,
								2e3: .04,
								4e3: .03,
								8e3: .03
							},
							nrc: .06,
							source: "Egan",
							description: "",
							uuid: "gRbBSYkSbePlqUoe"
						},
						geometry: {
							metadata: {
								version: 4.5,
								type: "BufferGeometry",
								generator: "BufferGeometry.toJSON"
							},
							uuid: "1ED2615E-F9E7-477F-8751-E38570B227C2",
							type: "BufferGeometry",
							name: "surface-geometry",
							data: {
								attributes: {
									position: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											25.951091766357422,
											6.776000022888184,
											8.243200302124023,
											25.27349090576172,
											0,
											8.243200302124023,
											25.27349090576172,
											13.552000045776367,
											8.243200302124023,
											25.27349090576172,
											13.552000045776367,
											8.243200302124023,
											25.27349090576172,
											0,
											8.243200302124023,
											23.240692138671875,
											18.052879333496094,
											8.243200302124023,
											25.27349090576172,
											0,
											8.243200302124023,
											23.240692138671875,
											-4.500878810882568,
											8.243200302124023,
											23.240692138671875,
											18.052879333496094,
											8.243200302124023,
											23.240692138671875,
											18.052879333496094,
											8.243200302124023,
											23.240692138671875,
											-4.500878810882568,
											8.243200302124023,
											15.076691627502441,
											18.052879333496094,
											8.243200302124023,
											15.076691627502441,
											-4.500878810882568,
											8.243200302124023,
											15.076691627502441,
											18.052879333496094,
											8.243200302124023,
											23.240692138671875,
											-4.500878810882568,
											8.243200302124023
										],
										normalized: !1
									},
									normals: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1
										],
										normalized: !1
									}
								},
								boundingSphere: {
									center: [
										20.51389169692993,
										6.776000261306763,
										8.243200302124023
									],
									radius: 12.519231054811794
								}
							}
						},
						displayVertexNormals: !1,
						fillSurface: !0,
						wireframeVisible: !1,
						edgesVisible: !0,
						name: "untitled-7",
						position: [
							0,
							0,
							0
						],
						rotation: [
							0,
							0,
							0
						],
						scale: [
							1,
							1,
							1
						],
						uuid: "ACC14F91-9609-4D98-BD92-DE179F50F4DF"
					}]
				},
				{
					kind: "container",
					visible: !0,
					name: "STAGE_WALLS",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "744E318D-EC60-406E-880D-596711954480",
					children: [
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Concrete Block"],
								manufacturer: "",
								name: "Cmu",
								material: "CMU, painted",
								absorption: {
									63: .03,
									125: .1,
									250: .05,
									500: .06,
									1e3: .07,
									2e3: .09,
									4e3: .08,
									8e3: .08
								},
								nrc: .07,
								source: "wjhw?",
								description: "",
								uuid: "ByswUBFezm3zBKiE"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "447AAFC5-9DAB-428B-BFF8-90CE2859CED1",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												0,
												0,
												4.743199825286865,
												3.388000011444092,
												-1.3552000522613525,
												4.743199825286865,
												0,
												0,
												0,
												3.388000011444092,
												-1.3552000522613525,
												0,
												0,
												0,
												0,
												3.388000011444092,
												-1.3552000522613525,
												4.743199825286865
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												.3713906705379486,
												.9284766912460327,
												0,
												.3713906705379486,
												.9284766912460327,
												0,
												.3713906705379486,
												.9284766912460327,
												0,
												.3713906705379486,
												.9284766912460327,
												0,
												.3713906705379486,
												.9284766912460327,
												0,
												.3713906705379486,
												.9284766912460327,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											1.694000005722046,
											-.6776000261306763,
											2.3715999126434326
										],
										radius: 2.9922005214304943
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-8",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "8C2E6B59-4406-46AA-BFFC-0DD3A540CC2B"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Concrete Block"],
								manufacturer: "",
								name: "Cmu",
								material: "CMU, painted",
								absorption: {
									63: .03,
									125: .1,
									250: .05,
									500: .06,
									1e3: .07,
									2e3: .09,
									4e3: .08,
									8e3: .08
								},
								nrc: .07,
								source: "wjhw?",
								description: "",
								uuid: "ByswUBFezm3zBKiE"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "CE7D1DD2-4D3C-4974-9990-04CB566F3914",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												3.388000011444092,
												14.90719985961914,
												4.743199825286865,
												0,
												13.552000045776367,
												4.743199825286865,
												3.388000011444092,
												14.90719985961914,
												0,
												0,
												13.552000045776367,
												0,
												3.388000011444092,
												14.90719985961914,
												0,
												0,
												13.552000045776367,
												4.743199825286865
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												.37139061093330383,
												-.9284766912460327,
												0,
												.37139061093330383,
												-.9284766912460327,
												0,
												.37139061093330383,
												-.9284766912460327,
												0,
												.37139061093330383,
												-.9284766912460327,
												0,
												.37139061093330383,
												-.9284766912460327,
												0,
												.37139061093330383,
												-.9284766912460327,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											1.694000005722046,
											14.229599952697754,
											2.3715999126434326
										],
										radius: 2.9922004944349068
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-9",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "23667DCD-801B-4519-AE5D-D24386E78799"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Concrete Block"],
								manufacturer: "",
								name: "Cmu",
								material: "CMU, painted",
								absorption: {
									63: .03,
									125: .1,
									250: .05,
									500: .06,
									1e3: .07,
									2e3: .09,
									4e3: .08,
									8e3: .08
								},
								nrc: .07,
								source: "wjhw?",
								description: "",
								uuid: "ByswUBFezm3zBKiE"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "AC13C7F5-F22B-4EB1-ABF2-19323297501A",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												3.6396543979644775,
												-.7260642051696777,
												4.743199825286865,
												3.6396543979644775,
												-.7260642051696777,
												0,
												3.388000011444092,
												-1.3552000522613525,
												4.743199825286865,
												3.388000011444092,
												-1.3552000522613525,
												0,
												3.388000011444092,
												-1.3552000522613525,
												4.743199825286865,
												3.6396543979644775,
												-.7260642051696777,
												0
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												-.9284766912460327,
												.3713907301425934,
												0,
												-.9284766912460327,
												.3713907301425934,
												0,
												-.9284766912460327,
												.3713907301425934,
												0,
												-.9284766912460327,
												.3713907301425934,
												0,
												-.9284766912460327,
												.3713907301425934,
												0,
												-.9284766912460327,
												.3713907301425934,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											3.5138272047042847,
											-1.0406321287155151,
											2.3715999126434326
										],
										radius: 2.395677692582626
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-11",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "09FB51AD-73E9-480E-A3E5-6932C31787DE"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Concrete Block"],
								manufacturer: "",
								name: "Cmu",
								material: "CMU, painted",
								absorption: {
									63: .03,
									125: .1,
									250: .05,
									500: .06,
									1e3: .07,
									2e3: .09,
									4e3: .08,
									8e3: .08
								},
								nrc: .07,
								source: "wjhw?",
								description: "",
								uuid: "ByswUBFezm3zBKiE"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "0C7929BE-458F-413B-BC92-D7FBF0D28AB8",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												3.388000011444092,
												14.90719985961914,
												4.743199825286865,
												3.388000011444092,
												14.90719985961914,
												0,
												3.6396543979644775,
												14.278063774108887,
												4.743199825286865,
												3.6396543979644775,
												14.278063774108887,
												0,
												3.6396543979644775,
												14.278063774108887,
												4.743199825286865,
												3.388000011444092,
												14.90719985961914,
												0
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												-.9284766912460327,
												-.37139061093330383,
												0,
												-.9284766912460327,
												-.37139061093330383,
												0,
												-.9284766912460327,
												-.37139061093330383,
												0,
												-.9284766912460327,
												-.37139061093330383,
												0,
												-.9284766912460327,
												-.37139061093330383,
												0,
												-.9284766912460327,
												-.37139061093330383,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											3.5138272047042847,
											14.592631816864014,
											2.3715999126434326
										],
										radius: 2.395677708235577
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-12",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "94111689-BEE4-4E6E-98FA-8CEBFC57DE7B"
						},
						{
							kind: "surface",
							visible: !0,
							acousticMaterial: {
								tags: ["Walls", "Concrete Block"],
								manufacturer: "",
								name: "Cmu",
								material: "CMU, painted",
								absorption: {
									63: .03,
									125: .1,
									250: .05,
									500: .06,
									1e3: .07,
									2e3: .09,
									4e3: .08,
									8e3: .08
								},
								nrc: .07,
								source: "wjhw?",
								description: "",
								uuid: "ByswUBFezm3zBKiE"
							},
							geometry: {
								metadata: {
									version: 4.5,
									type: "BufferGeometry",
									generator: "BufferGeometry.toJSON"
								},
								uuid: "41B752A6-4A0A-4F6E-9EB0-B5E799D8D9C4",
								type: "BufferGeometry",
								name: "surface-geometry",
								data: {
									attributes: {
										position: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												0,
												13.552000045776367,
												0,
												0,
												13.552000045776367,
												4.743199825286865,
												0,
												0,
												0,
												0,
												0,
												4.743199825286865,
												0,
												0,
												0,
												0,
												13.552000045776367,
												4.743199825286865
											],
											normalized: !1
										},
										normals: {
											itemSize: 3,
											type: "Float32Array",
											array: [
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0,
												1,
												0,
												0
											],
											normalized: !1
										}
									},
									boundingSphere: {
										center: [
											0,
											6.776000022888184,
											2.3715999126434326
										],
										radius: 7.179043282766235
									}
								}
							},
							displayVertexNormals: !1,
							fillSurface: !0,
							wireframeVisible: !1,
							edgesVisible: !0,
							name: "untitled-15",
							position: [
								0,
								0,
								0
							],
							rotation: [
								0,
								0,
								0
							],
							scale: [
								1,
								1,
								1
							],
							uuid: "DF5D8BCC-C7BF-41EC-994B-09CCCD4D67C7"
						}
					]
				},
				{
					kind: "container",
					visible: !0,
					name: "STAGE_CEILING",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "94B92F44-E01B-40A3-B783-CD1CF3AA2BC6",
					children: [{
						kind: "surface",
						visible: !0,
						acousticMaterial: {
							tags: ["Walls", "Various"],
							manufacturer: "",
							name: "Plaster On Lath",
							material: "Plaster on lath",
							absorption: {
								63: .05,
								125: .14,
								250: .1,
								500: .06,
								1e3: .05,
								2e3: .04,
								4e3: .03,
								8e3: .03
							},
							nrc: .06,
							source: "Egan",
							description: "",
							uuid: "gRbBSYkSbePlqUoe"
						},
						geometry: {
							metadata: {
								version: 4.5,
								type: "BufferGeometry",
								generator: "BufferGeometry.toJSON"
							},
							uuid: "899F381E-5921-4775-9F58-92044872FF55",
							type: "BufferGeometry",
							name: "surface-geometry",
							data: {
								attributes: {
									position: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											3.6396543979644775,
											14.278063774108887,
											4.743199825286865,
											3.6396543979644775,
											-.7260642051696777,
											4.743199825286865,
											3.388000011444092,
											14.90719985961914,
											4.743199825286865,
											3.6396543979644775,
											-.7260642051696777,
											4.743199825286865,
											3.388000011444092,
											-1.3552000522613525,
											4.743199825286865,
											3.388000011444092,
											14.90719985961914,
											4.743199825286865,
											3.388000011444092,
											14.90719985961914,
											4.743199825286865,
											3.388000011444092,
											-1.3552000522613525,
											4.743199825286865,
											0,
											13.552000045776367,
											4.743199825286865,
											0,
											0,
											4.743199825286865,
											0,
											13.552000045776367,
											4.743199825286865,
											3.388000011444092,
											-1.3552000522613525,
											4.743199825286865
										],
										normalized: !1
									},
									normals: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1,
											0,
											0,
											-1
										],
										normalized: !1
									}
								},
								boundingSphere: {
									center: [
										1.8198271989822388,
										6.775999903678894,
										4.743199825286865
									],
									radius: 8.28103729572734
								}
							}
						},
						displayVertexNormals: !1,
						fillSurface: !0,
						wireframeVisible: !1,
						edgesVisible: !0,
						name: "untitled-14",
						position: [
							0,
							0,
							0
						],
						rotation: [
							0,
							0,
							0
						],
						scale: [
							1,
							1,
							1
						],
						uuid: "E8C1CCA5-3787-4C6B-8A87-2F6B6C1709B6"
					}]
				},
				{
					kind: "container",
					visible: !0,
					name: "SLOPED_CEILING",
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0
					],
					scale: [
						1,
						1,
						1
					],
					uuid: "E6294A9E-6F2C-4828-B186-788F0352FA0C",
					children: [{
						kind: "surface",
						visible: !0,
						acousticMaterial: {
							tags: ["Walls", "Various"],
							manufacturer: "",
							name: "Plaster On Lath",
							material: "Plaster on lath",
							absorption: {
								63: .05,
								125: .14,
								250: .1,
								500: .06,
								1e3: .05,
								2e3: .04,
								4e3: .03,
								8e3: .03
							},
							nrc: .06,
							source: "Egan",
							description: "",
							uuid: "gRbBSYkSbePlqUoe"
						},
						geometry: {
							metadata: {
								version: 4.5,
								type: "BufferGeometry",
								generator: "BufferGeometry.toJSON"
							},
							uuid: "57731404-5792-4623-B964-263A68EFD1AD",
							type: "BufferGeometry",
							name: "surface-geometry",
							data: {
								attributes: {
									position: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											15.076691627502441,
											18.052879333496094,
											8.243200302124023,
											15.076691627502441,
											-4.500878810882568,
											8.243200302124023,
											13.076691627502441,
											18.052879333496094,
											7.493199825286865,
											13.076691627502441,
											-4.500878810882568,
											7.493199825286865,
											13.076691627502441,
											18.052879333496094,
											7.493199825286865,
											15.076691627502441,
											-4.500878810882568,
											8.243200302124023
										],
										normalized: !1
									},
									normals: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											.3511236310005188,
											0,
											-.9363291263580322,
											.3511236310005188,
											0,
											-.9363291263580322,
											.3511236310005188,
											0,
											-.9363291263580322,
											.3511236310005188,
											0,
											-.9363291263580322,
											.3511236310005188,
											0,
											-.9363291263580322,
											.3511236310005188,
											0,
											-.9363291263580322
										],
										normalized: !1
									}
								},
								boundingSphere: {
									center: [
										14.076691627502441,
										6.776000261306763,
										7.868200063705444
									],
									radius: 11.327339793066848
								}
							}
						},
						displayVertexNormals: !1,
						fillSurface: !0,
						wireframeVisible: !1,
						edgesVisible: !0,
						name: "untitled-20",
						position: [
							0,
							0,
							0
						],
						rotation: [
							0,
							0,
							0
						],
						scale: [
							1,
							1,
							1
						],
						uuid: "871ED5D3-5913-47D3-8585-D6C3BDB05F4E"
					}, {
						kind: "surface",
						visible: !0,
						acousticMaterial: {
							tags: ["Walls", "Various"],
							manufacturer: "",
							name: "Plaster On Lath",
							material: "Plaster on lath",
							absorption: {
								63: .05,
								125: .14,
								250: .1,
								500: .06,
								1e3: .05,
								2e3: .04,
								4e3: .03,
								8e3: .03
							},
							nrc: .06,
							source: "Egan",
							description: "",
							uuid: "gRbBSYkSbePlqUoe"
						},
						geometry: {
							metadata: {
								version: 4.5,
								type: "BufferGeometry",
								generator: "BufferGeometry.toJSON"
							},
							uuid: "8B8AAEEE-9E0B-486F-837A-74A372F11975",
							type: "BufferGeometry",
							name: "surface-geometry",
							data: {
								attributes: {
									position: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											13.076691627502441,
											18.052879333496094,
											7.493199825286865,
											13.076691627502441,
											-4.500878810882568,
											7.493199825286865,
											3.6396543979644775,
											14.278063774108887,
											4.743199825286865,
											3.6396543979644775,
											-.7260642051696777,
											4.743199825286865,
											3.6396543979644775,
											14.278063774108887,
											4.743199825286865,
											13.076691627502441,
											-4.500878810882568,
											7.493199825286865
										],
										normalized: !1
									},
									normals: {
										itemSize: 3,
										type: "Float32Array",
										array: [
											.2797684967517853,
											0,
											-.9600675106048584,
											.2797684967517853,
											0,
											-.9600675106048584,
											.2797684967517853,
											0,
											-.9600675106048584,
											.2797684967517853,
											0,
											-.9600675106048584,
											.2797684967517853,
											0,
											-.9600675106048584,
											.2797684967517853,
											0,
											-.9600675106048584
										],
										normalized: !1
									}
								},
								boundingSphere: {
									center: [
										8.35817301273346,
										6.776000261306763,
										6.118199825286865
									],
									radius: 12.3013432001023
								}
							}
						},
						displayVertexNormals: !1,
						fillSurface: !0,
						wireframeVisible: !1,
						edgesVisible: !0,
						name: "untitled-21",
						position: [
							0,
							0,
							0
						],
						rotation: [
							0,
							0,
							0
						],
						scale: [
							1,
							1,
							1
						],
						uuid: "258494C4-8017-4C71-A8CA-32E17274FEA9"
					}]
				}
			],
			kind: "room",
			name: "new room",
			uuid: "2822163E-C892-4474-A3AB-BCD8210F2C3D",
			units: 2,
			originalFileData: "",
			originalFileName: "",
			visible: !0,
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			]
		}
	],
	solvers: []
};
// src/examples/events.ts
n("OPEN_EXAMPLE", (e) => {
	let { hasUnsavedChanges: t } = k.getState();
	if (t && !confirm("Open an example? Unsaved data will be lost.")) return;
	let n = ig[e];
	a("RESTORE", { json: n });
});
// src/examples/index.ts
var ig = {
	shoebox: tg,
	concord: ng,
	auditorium: rg
};
export { nh as CRAMCanvas, eh as CRAMEditor, eh as default, Th as ObjectsPanel, eg as SolversPanel, ig as examples };

//# sourceMappingURL=index.js.map