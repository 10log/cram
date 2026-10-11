import { C as e, E as t, S as n, T as r, a as i, b as a, c as o, d as s, g as c, h as l, i as u, j as d, l as f, p, t as m, x as h, y as g } from "./FileSaver.min-BXKs1cBL.mjs";
import { a as _, c as v, d as y, i as b, l as x, n as S, o as C, r as w, s as T, t as E, u as D } from "./renderer-OG8Zfwhb.mjs";
import { a as O, c as ee, d as te, f as ne, g as k, h as re, i as ie, l as ae, m as oe, n as se, o as A, p as ce, t as le, u as ue } from "./store-BubwJyeH.mjs";
import "./acoustics-SIlOec_Y.mjs";
import { n as de, r as fe } from "./convert-GmiMppOk.mjs";
import { n as pe, o as me, r as he, t as ge } from "./recording-D6qgIUE6.mjs";
import { r as _e, t as ve } from "./room-C-DW0_mt.mjs";
import "./css-B48fe771.mjs";
import { n as ye, t as be } from "./hrtf-data-D6qGJN2M.mjs";
import { t as xe } from "./gpu-context-BQmqThE1.mjs";
import * as j from "three";
import { AdditiveBlending as Se, AnimationClip as Ce, Bone as we, Box3 as Te, BufferAttribute as Ee, BufferGeometry as De, ClampToEdgeWrapping as Oe, Color as ke, ColorManagement as Ae, DirectionalLight as je, DoubleSide as Me, FileLoader as Ne, Float32BufferAttribute as Pe, FrontSide as Fe, Group as Ie, ImageBitmapLoader as Le, InstancedBufferAttribute as Re, InstancedMesh as ze, InterleavedBuffer as Be, InterleavedBufferAttribute as Ve, Interpolant as He, InterpolateDiscrete as Ue, InterpolateLinear as We, Line as Ge, LineBasicMaterial as Ke, LineLoop as qe, LineSegments as Je, LinearFilter as Ye, LinearMipmapLinearFilter as Xe, LinearMipmapNearestFilter as Ze, LinearSRGBColorSpace as Qe, Loader as $e, LoaderUtils as et, Material as tt, MathUtils as nt, Matrix4 as rt, Mesh as it, MeshBasicMaterial as at, MeshPhongMaterial as ot, MeshPhysicalMaterial as st, MeshStandardMaterial as ct, MirroredRepeatWrapping as lt, NearestFilter as ut, NearestMipmapLinearFilter as dt, NearestMipmapNearestFilter as ft, NumberKeyframeTrack as pt, Object3D as mt, OrthographicCamera as ht, PerspectiveCamera as gt, PointLight as _t, Points as vt, PointsMaterial as yt, PropertyBinding as bt, Quaternion as xt, QuaternionKeyframeTrack as St, RepeatWrapping as Ct, SRGBColorSpace as wt, Skeleton as Tt, SkinnedMesh as Et, Sphere as Dt, SpotLight as Ot, Texture as kt, TextureLoader as At, TriangleFanDrawMode as jt, TriangleStripDrawMode as Mt, TrianglesDrawMode as Nt, Vector2 as Pt, Vector3 as Ft, VectorKeyframeTrack as It } from "three";
import { create as Lt } from "zustand";
import { useShallow as M } from "zustand/react/shallow";
import Rt from "chroma-js";
import { forwardRef as zt, memo as Bt, useCallback as N, useEffect as P, useImperativeHandle as Vt, useMemo as F, useReducer as Ht, useRef as I, useState as L } from "react";
import { Button as R, Dialog as Ut, DialogActions as Wt, DialogContent as Gt, DialogTitle as Kt, Divider as qt, IconButton as Jt, Menu as Yt, MenuItem as Xt, Paper as Zt, SvgIcon as Qt, Table as $t, TableBody as en, TableCell as tn, TableContainer as nn, TableHead as rn, TableRow as an, TextField as on } from "@mui/material";
import { Fragment as z, jsx as B, jsxs as V } from "react/jsx-runtime";
import H from "@mui/material/Box";
import sn from "@mui/material/AppBar";
import cn from "@mui/material/Toolbar";
import ln from "@mui/material/Button";
import un from "@mui/material/ButtonGroup";
import dn from "@mui/material/Menu";
import fn from "@mui/material/MenuItem";
import pn from "@mui/material/Divider";
import mn from "@mui/material/IconButton";
import hn from "@mui/icons-material/Settings";
import U from "@mui/material/Typography";
import { keyframes as gn } from "@emotion/react";
import _n from "@mui/material/Drawer";
import vn from "@mui/material/InputAdornment";
import yn from "@mui/material/TextField";
import bn from "@mui/material/List";
import xn from "@mui/material/ListItemButton";
import Sn from "@mui/material/Link";
import Cn from "@mui/icons-material/Search";
import wn from "@mui/icons-material/Close";
import Tn from "@mui/icons-material/Check";
import { SimpleTreeView as En } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem as Dn } from "@mui/x-tree-view/TreeItem";
import On from "@mui/icons-material/ExpandMore";
import kn from "@mui/icons-material/ChevronRight";
import An from "@mui/icons-material/Timeline";
import jn from "@mui/icons-material/Wifi";
import Mn from "@mui/icons-material/Mic";
import { Actions as Nn, Layout as Pn, Model as Fn } from "flexlayout-react";
import In from "@mui/material/ListItem";
import Ln from "@mui/material/ListItemIcon";
import Rn from "@mui/material/ListItemText";
import zn from "@mui/icons-material/Visibility";
import Bn from "@mui/icons-material/VisibilityOff";
import Vn from "@mui/icons-material/Delete";
import Hn from "@mui/icons-material/Home";
import Un from "@mui/icons-material/GraphicEq";
import Wn from "@mui/icons-material/Sensors";
import Gn from "@mui/icons-material/Square";
import Kn from "@mui/icons-material/ViewInAr";
import qn from "@mui/material/Collapse";
import Jn from "@mui/material/Tooltip";
import Yn from "@mui/icons-material/InfoOutlined";
import Xn from "@mui/material/Checkbox";
import Zn from "@mui/material/Select";
import Qn from "@mui/icons-material/PlayArrow";
import $n from "@mui/icons-material/Autorenew";
import er from "@mui/material/ToggleButton";
import tr from "@mui/material/ToggleButtonGroup";
import nr from "@mui/icons-material/Pause";
import rr from "@mui/icons-material/Stop";
import ir from "@mui/icons-material/RestartAlt";
import ar from "@mui/material/CircularProgress";
import or from "@mui/material/Slider";
import sr from "@mui/icons-material/Add";
import cr from "@mui/icons-material/Remove";
import lr from "@mui/material/Tabs";
import ur from "@mui/material/Tab";
import { Bar as dr, BarGroup as fr, LinePath as pr } from "@visx/shape";
import { Group as mr } from "@visx/group";
import { scaleBand as hr, scaleLinear as gr, scaleOrdinal as _r } from "@visx/scale";
import { AxisBottom as vr, AxisLeft as yr } from "@visx/axis";
import { Grid as br, GridRows as xr } from "@visx/grid";
import { ParentSize as Sr } from "@visx/responsive";
import Cr from "@mui/material/FormControl";
import { LegendOrdinal as wr } from "@visx/legend";
import Tr from "@mui/icons-material/Category";
import Er from "@mui/icons-material/MoreVert";
import Dr from "@mui/icons-material/Clear";
import Or from "@mui/icons-material/ScatterPlot";
import kr from "@mui/icons-material/AccountTree";
import Ar from "@mui/icons-material/GridOn";
import jr from "@mui/icons-material/BarChart";
import Mr from "@mui/icons-material/BlurOn";
import Nr from "@mui/icons-material/Waves";
import Pr from "@mui/icons-material/ContentCopy";
import Fr from "@mui/icons-material/Calculate";
//#region src/common/map.ts
function Ir(e, t, n, r, i) {
	return r + (e - t) / (n - t) * (i - r);
}
//#endregion
//#region src/common/dir-interpolation.ts
var Lr = /* @__PURE__ */ d(m());
function Rr(e, t, n, r, i, a) {
	let o, s = r.theta - n.theta, c = i.phi - r.phi, l = t - n.theta, u = e - n.phi;
	return o = n.directivity * ((s - l) / s) * (u / c) + a.directivity * (l / s * (u / c)) + r.directivity * ((s - l) / s) * ((c - u) / c) + i.directivity * (l / s) * ((c - u) / c), o;
}
//#endregion
//#region src/objects/source.ts
var zr = { color: 10668418 }, Br = [
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
], Vr = class extends D {
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
		super(e || "new source"), this.kind = "source", this.signalSource = 1, this.previousX = this.position.x, this.previousY = this.position.y, this.previousZ = this.position.z, this.shouldClearPreviousPosition = !1, this._initialSPL = 120, this._initialIntensity = fe(de(this._initialSPL)), this.amplitude = 1, this.frequency = 100, this.phase = 0, this.value = 0, this.previousValue = 0, this.velocity = 0, this.rgba = [
			0,
			0,
			0,
			1
		], this.fdtdSamples = [], this.directivityHandler = new Ur(0), this.selectedMaterial = new j.MeshMatcapMaterial({
			fog: !1,
			color: Rt(zr.color).brighten(1).num(),
			matcap: x,
			name: "source-selected-material"
		}), this.normalMaterial = new j.MeshMatcapMaterial({
			fog: !1,
			color: zr.color,
			matcap: v,
			name: "source-material"
		}), this.mesh = new j.Mesh(new j.SphereGeometry(.1, 32, 16), this.normalMaterial), this.mesh.userData.kind = "source", this.add(this.mesh), this.f = t && t.f || ((e) => Math.sin(e)), this.theta = t && t.theta || 180, this.phi = t && t.phi || 360, this.numRays = 0, this.select = () => {
			if (!this.selected) {
				this.selected = !0;
				let e = Rt(this.mesh.material.color.getHex()).brighten(1).num();
				this.selectedMaterial.color.setHex(e), this.mesh.material = this.selectedMaterial;
			}
		}, this.deselect = () => {
			this.selected && (this.selected = !1, this.mesh.material = this.normalMaterial);
		}, this.renderCallback = (e) => {}, this.updateWave = this.updateWave.bind(this), this.updatePreviousPosition = this.updatePreviousPosition.bind(this), this.getWhiteNoiseSample = this.getWhiteNoiseSample.bind(this), this.getOscillatorSample = this.getOscillatorSample.bind(this), this.getPinkNoiseSample = this.getPinkNoiseSample.bind(this), this.generatePinkNoiseSamples = this.generatePinkNoiseSamples.bind(this), this.pinkNoiseSamples = /* @__PURE__ */ new Float32Array(1024), this.generatePinkNoiseSamples(), E.add(this);
	}
	dispose() {
		E.remove(this), super.dispose();
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
		this.velocity = this.value - this.previousValue, this.rgba[0] = Ir(this.value, -2, 2, 0, 255), this.rgba[1] = Ir(this.velocity, -2, 2, 0, 255), this.rgba[3] = 0;
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
		let e = pe(this.fdtdSamples, this.fdtdSampleRate);
		Lr.default.saveAs(new Blob([e], { type: "text/plain;charset=utf-8" }), `fdtdsamples-source-${this.name}.txt`), this.fdtdSampleRate && this.fdtdSampleRate > 0 && Lr.default.saveAs(new Blob([ge(this.fdtdSamples, this.fdtdSampleRate)], { type: "audio/wav" }), `fdtdsamples-source-${this.name}.wav`);
	}
	getColorAsNumber() {
		return this.mesh.material.color.getHex();
	}
	getColorAsString() {
		return "#" + this.mesh.material.color.getHexString();
	}
	onModeChange(e) {
		switch (e) {
			case me.OBJECT: break;
			case me.SKETCH: break;
			case me.EDIT:
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
n("ADD_SOURCE", te(Vr)), n("REMOVE_SOURCE", oe), n("SOURCE_SET_PROPERTY", re), n("SOURCE_CALL_METHOD", ne);
var Hr = () => y("source"), Ur = class {
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
			case 0: return de(this.sensitivity[0] + e);
			case 1:
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
				return console.log(f), console.log(p), console.log(m), console.log(h), de(Rr(n, r, f, p, m, h) + this.sensitivity[d] + e);
			default: return de(this.sensitivity[0] + e);
		}
	}
}, Wr = /* @__PURE__ */ function(e) {
	return e.OMNIDIRECTIONAL = "omni", e.CARDIOID = "cardioid", e.SUPERCARDIOID = "supercardioid", e.FIGURE_EIGHT = "figure8", e;
}({});
function Gr(e, t) {
	switch (e) {
		case "omni": return 1;
		case "cardioid": return .5 + .5 * Math.cos(t);
		case "supercardioid": return .37 + .63 * Math.cos(t);
		case "figure8": return Math.cos(t);
		default: return 1;
	}
}
var Kr = {
	color: 14511983,
	selectedColor: 10472447
}, qr = class extends D {
	mesh;
	selectedMaterial;
	normalMaterial;
	fdtdSamples;
	fdtdSampleRate;
	directivityPattern = "omni";
	constructor(e, t) {
		super(e || "new receiver"), this.kind = "receiver", this.fdtdSamples = [], this.selectedMaterial = new j.MeshMatcapMaterial({
			fog: !1,
			color: Kr.color,
			matcap: x,
			name: "receiver-selected-material"
		}), this.normalMaterial = new j.MeshMatcapMaterial({
			fog: !1,
			color: Kr.color,
			matcap: v,
			name: "receiver-material"
		}), this.mesh = new j.Mesh(new j.SphereGeometry(.1, 32, 16), this.normalMaterial), this.mesh.userData.kind = "receiver", this.add(this.mesh), this.select = () => {
			if (!this.selected) {
				this.selected = !0;
				let e = Rt(this.mesh.material.color.getHex()).brighten(1).num();
				this.selectedMaterial.color.setHex(e), this.mesh.material = this.selectedMaterial;
			}
		}, this.deselect = () => {
			this.selected && (this.selected = !1, this.mesh.material = this.normalMaterial);
		}, this.renderCallback = (e) => {}, E.add(this);
	}
	getGain(e) {
		if (this.directivityPattern === "omni") return 1;
		let t = new j.Vector3(0, 0, 1).applyEuler(this.rotation), n = new j.Vector3(e[0], e[1], e[2]), r = t.angleTo(n);
		return Gr(this.directivityPattern, r);
	}
	dispose() {
		E.remove(this), super.dispose();
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
		return this.directivityPattern = t && Object.values(Wr).includes(t) ? t : "omni", this;
	}
	clearSamples() {
		this.fdtdSamples = [];
	}
	fdtdOutput() {
		return this.fdtdSampleRate && this.fdtdSampleRate > 0 ? he(this.fdtdSamples, this.fdtdSampleRate) : [...this.fdtdSamples];
	}
	saveSamples() {
		if (this.fdtdSamples.length === 0) return;
		let e = this.fdtdOutput(), t = pe(e, this.fdtdSampleRate);
		Lr.default.saveAs(new Blob([t], { type: "text/plain;charset=utf-8" }), `fdtdsamples-receiver-${this.name}.txt`), this.fdtdSampleRate && this.fdtdSampleRate > 0 && Lr.default.saveAs(new Blob([ge(e, this.fdtdSampleRate)], { type: "audio/wav" }), `fdtdsamples-receiver-${this.name}.wav`);
	}
	getColorAsNumber() {
		return this.mesh.material.color.getHex();
	}
	getColorAsString() {
		return "#" + this.mesh.material.color.getHexString();
	}
	onModeChange(e) {
		switch (e) {
			case me.OBJECT: break;
			case me.SKETCH: break;
			case me.EDIT:
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
n("ADD_RECEIVER", te(qr)), n("REMOVE_RECEIVER", oe), n("RECEIVER_SET_PROPERTY", re);
var Jr = () => y("receiver"), { min: Yr, max: Xr } = Math, Zr = class extends D {
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
		let f = new j.BufferGeometry();
		f.setIndex(o);
		let p = new j.Float32BufferAttribute(l, 3);
		p.setUsage(j.DynamicDrawUsage), f.setAttribute("position", p), f.setAttribute("normal", new j.Float32BufferAttribute(u, 3)), f.setAttribute("color", new j.Float32BufferAttribute(d, 3));
		let m = /* @__PURE__ */ new Set(), h = (e) => `${Yr(...e)}${Xr(...e)}`, g = s(m);
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
		let _ = new j.MeshPhongMaterial({
			fog: !1,
			transparent: !0,
			side: j.DoubleSide,
			vertexColors: !0,
			depthWrite: !0,
			depthTest: !1
		}), v = new j.MeshPhongMaterial({
			color: 11184810,
			specular: 16777215,
			shininess: 250,
			side: j.DoubleSide,
			vertexColors: !0
		}), y = new j.BufferGeometry();
		this.mesh = new j.Mesh(f, [_, v]), this.add(this.mesh), y.setIndex(c), y.setAttribute("position", p);
		let b = new j.LineBasicMaterial({
			color: 16777215,
			transparent: !0
		});
		this.add(new j.LineSegments(y, b)), this.mesh.geometry.computeBoundingBox(), this.mesh.geometry.computeBoundingSphere();
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
}, Qr = class {
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
}, $r = class extends j.Group {
	sketchPlane;
	sketchPlaneMesh;
	sketchPlaneMaterial;
	sketchPlaneNormal;
	sketchPlaneCentroid;
	constructor(e) {
		super(), this.sketchPlaneNormal = e.normal, this.sketchPlaneCentroid = e.point, this.sketchPlane = new j.Plane(), this.sketchPlane.setFromNormalAndCoplanarPoint(this.sketchPlaneNormal, this.sketchPlaneCentroid).normalize();
		var t = new j.PlaneGeometry(1e3, 1e3);
		let n = new j.Vector3();
		this.sketchPlane.coplanarPoint(n);
		var r = new j.Vector3().copy(n).add(this.sketchPlane.normal);
		t.lookAt(r), t.translate(n.x, n.y, n.z), this.sketchPlaneMaterial = new j.MeshLambertMaterial({
			color: 12351748,
			side: j.DoubleSide,
			transparent: !0,
			opacity: .05
		}), this.sketchPlaneMesh = new j.Mesh(t, this.sketchPlaneMaterial), this.add(this.sketchPlaneMesh);
	}
}, ei = /* @__PURE__ */ new Map();
function ti(e, t) {
	ei.set(e, t);
}
async function ni(e, t, n) {
	let r = ei.get(e);
	if (!r) throw Error(`Unknown solver type: ${e}`);
	return r(t, n);
}
ti("ray-tracer", async (e, t) => {
	let { default: n } = await import("./raytracer-Dsq8Xbb8.mjs");
	return new n(t);
}), ti("image-source", async (e, t) => {
	let { ImageSourceSolver: n } = await import("./image-source-BKcn7KMM.mjs");
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
}), ti("rt60", async (e, t) => {
	let { default: n } = await import("./rt-CClhSnYv.mjs");
	return new n();
}), ti("energydecay", async (e, t) => {
	let { default: n } = await import("./energy-decay-Z3J_0dPf.mjs");
	return new n();
}), ti("fdtd-2d", async (e, t) => {
	let { default: n } = await import("./2d-fdtd-C_pZErbP.mjs");
	return new n();
}), ti("beam-trace", async (e, t) => {
	let { BeamTraceSolver: n } = await import("./beam-trace-B15Lw-u4.mjs");
	return new n();
}), ti("art", async (e, t) => {
	let { ART: n } = await import("./art-D_zKa082.mjs");
	return new n();
}), ti("ard", async (e, t) => {
	let { ARD: n } = await import("./ard-B6Fwh4Pm.mjs");
	return new n(t);
});
//#endregion
//#region node_modules/three/examples/jsm/loaders/STLLoader.js
var ri = class extends $e {
	constructor(e) {
		super(e);
	}
	load(e, t, n, r) {
		let i = this, a = new Ne(this.manager);
		a.setPath(this.path), a.setResponseType("arraybuffer"), a.setRequestHeader(this.requestHeader), a.setWithCredentials(this.withCredentials), a.load(e, function(n) {
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
			for (let e = 0; e < 70; e++) t.getUint32(e, !1) == 1129270351 && t.getUint8(e + 4) == 82 && t.getUint8(e + 5) == 61 && (o = !0, s = new Float32Array(n * 3 * 3), c = t.getUint8(e + 6) / 255, l = t.getUint8(e + 7) / 255, u = t.getUint8(e + 8) / 255, d = t.getUint8(e + 9) / 255);
			let f = new De(), p = new Float32Array(n * 3 * 3), m = new Float32Array(n * 3 * 3), h = new ke();
			for (let e = 0; e < n; e++) {
				let n = 84 + e * 50, d = t.getFloat32(n, !0), f = t.getFloat32(n + 4, !0), g = t.getFloat32(n + 8, !0);
				if (o) {
					let e = t.getUint16(n + 48, !0);
					e & 32768 ? (r = c, i = l, a = u) : (r = (e & 31) / 31, i = (e >> 5 & 31) / 31, a = (e >> 10 & 31) / 31);
				}
				for (let c = 1; c <= 3; c++) {
					let l = n + c * 12, u = e * 3 * 3 + (c - 1) * 3;
					p[u] = t.getFloat32(l, !0), p[u + 1] = t.getFloat32(l + 4, !0), p[u + 2] = t.getFloat32(l + 8, !0), m[u] = d, m[u + 1] = f, m[u + 2] = g, o && (h.setRGB(r, i, a, wt), s[u] = h.r, s[u + 1] = h.g, s[u + 2] = h.b);
				}
			}
			return f.setAttribute("position", new Ee(p, 3)), f.setAttribute("normal", new Ee(m, 3)), o && (f.setAttribute("color", new Ee(s, 3)), f.hasColors = !0, f.alpha = d), f;
		}
		function i(e) {
			let t = new De(), n = /solid([\s\S]*?)endsolid/g, r = /facet([\s\S]*?)endfacet/g, i = /solid\s(.+)/, a = 0, o = "[\\s]+([+-]?(?:\\d*)(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)", s = RegExp("vertex" + o + o + o, "g"), c = RegExp("normal" + o + o + o, "g"), l = [], u = [], d = [], f = new Ft(), p, m = 0, h = 0, g = 0;
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
			return t.setAttribute("position", new Pe(l, 3)), t.setAttribute("normal", new Pe(u, 3)), t;
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
}, ii = class extends $e {
	constructor(e) {
		super(e), this.debug = !1, this.group = null, this.materials = [], this.meshes = [];
	}
	load(e, t, n, r) {
		let i = this, a = this.path === "" ? et.extractUrlBase(e) : this.path, o = new Ne(this.manager);
		o.setPath(this.path), o.setResponseType("arraybuffer"), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(e, function(n) {
			try {
				t(i.parse(n, a));
			} catch (t) {
				r ? r(t) : console.error(t), i.manager.itemError(e);
			}
		}, n, r);
	}
	parse(e, t) {
		this.group = new Ie(), this.materials = [], this.meshes = [], this.readFile(e, t);
		for (let e = 0; e < this.meshes.length; e++) this.group.add(this.meshes[e]);
		return this.group;
	}
	readFile(e, t) {
		let n = new ai(new DataView(e), 0, this.debugMessage);
		if (n.id === si || n.id === ci || n.id === oi) {
			let e = n.readChunk();
			for (; e;) {
				if (e.id === li) {
					let t = e.readDWord();
					this.debugMessage("3DS file version: " + t);
				} else e.id === gi ? this.readMeshData(e, t) : this.debugMessage("Unknown main chunk: " + e.hexId);
				e = n.readChunk();
			}
		}
		this.debugMessage("Parsed " + this.meshes.length + " meshes");
	}
	readMeshData(e, t) {
		let n = e.readChunk();
		for (; n;) {
			if (n.id === _i) {
				let e = +n.readDWord();
				this.debugMessage("Mesh Version: " + e);
			} else if (n.id === vi) {
				let e = n.readFloat();
				this.debugMessage("Master scale: " + e), this.group.scale.set(e, e, e);
			} else n.id === zi ? (this.debugMessage("Named Object"), this.readNamedObject(n)) : n.id === yi ? (this.debugMessage("Material"), this.readMaterialEntry(n, t)) : this.debugMessage("Unknown MDATA chunk: " + n.hexId);
			n = e.readChunk();
		}
	}
	readNamedObject(e) {
		let t = e.readString(), n = e.readChunk();
		for (; n;) {
			if (n.id === Bi) {
				let e = this.readMesh(n);
				e.name = t, this.meshes.push(e);
			} else this.debugMessage("Unknown named object chunk: " + n.hexId);
			n = e.readChunk();
		}
	}
	readMaterialEntry(e, t) {
		let n = e.readChunk(), r = new ot();
		for (; n;) {
			if (n.id === bi) r.name = n.readString(), this.debugMessage("   Name: " + r.name);
			else if (n.id === Oi) this.debugMessage("   Wireframe"), r.wireframe = !0;
			else if (n.id === ki) {
				let e = n.readByte();
				r.wireframeLinewidth = e, this.debugMessage("   Wireframe Thickness: " + e);
			} else if (n.id === Ei) r.side = Me, this.debugMessage("   DoubleSided");
			else if (n.id === Di) this.debugMessage("   Additive Blending"), r.blending = Se;
			else if (n.id === Si) this.debugMessage("   Diffuse Color"), r.color = this.readColor(n);
			else if (n.id === Ci) this.debugMessage("   Specular Color"), r.specular = this.readColor(n);
			else if (n.id === xi) this.debugMessage("   Ambient color"), r.color = this.readColor(n);
			else if (n.id === wi) {
				let e = this.readPercentage(n);
				r.shininess = e * 100, this.debugMessage("   Shininess : " + e);
			} else if (n.id === Ti) {
				let e = this.readPercentage(n);
				r.opacity = 1 - e, this.debugMessage("  Transparency : " + e), r.transparent = r.opacity < 1;
			} else n.id === Ai ? (this.debugMessage("   ColorMap"), r.map = this.readMap(n, t)) : n.id === Mi ? (this.debugMessage("   BumpMap"), r.bumpMap = this.readMap(n, t)) : n.id === ji ? (this.debugMessage("   OpacityMap"), r.alphaMap = this.readMap(n, t)) : n.id === Ni ? (this.debugMessage("   SpecularMap"), r.specularMap = this.readMap(n, t)) : this.debugMessage("   Unknown material chunk: " + n.hexId);
			n = e.readChunk();
		}
		this.materials[r.name] = r;
	}
	readMesh(e) {
		let t = e.readChunk(), n = new De(), r = new ot(), i = new it(n, r);
		for (i.name = "mesh"; t;) {
			if (t.id === Vi) {
				let e = t.readWord();
				this.debugMessage("   Vertex: " + e);
				let r = [];
				for (let n = 0; n < e; n++) r.push(t.readFloat()), r.push(t.readFloat()), r.push(t.readFloat());
				n.setAttribute("position", new Pe(r, 3));
			} else if (t.id === Hi) this.readFaceArray(t, i);
			else if (t.id === Wi) {
				let e = t.readWord();
				this.debugMessage("   UV: " + e);
				let r = [];
				for (let n = 0; n < e; n++) r.push(t.readFloat()), r.push(t.readFloat());
				n.setAttribute("uv", new Pe(r, 2));
			} else if (t.id === Gi) {
				this.debugMessage("   Transformation Matrix (TODO)");
				let e = [];
				for (let n = 0; n < 12; n++) e[n] = t.readFloat();
				let r = new rt();
				r.elements[0] = e[0], r.elements[1] = e[6], r.elements[2] = e[3], r.elements[3] = e[9], r.elements[4] = e[2], r.elements[5] = e[8], r.elements[6] = e[5], r.elements[7] = e[11], r.elements[8] = e[1], r.elements[9] = e[7], r.elements[10] = e[4], r.elements[11] = e[10], r.elements[12] = 0, r.elements[13] = 0, r.elements[14] = 0, r.elements[15] = 1, r.transpose();
				let a = new rt();
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
			if (n.id === Ui) {
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
		let n = e.readChunk(), r = {}, i = new At(this.manager);
		for (i.setPath(this.resourcePath || t).setCrossOrigin(this.crossOrigin); n;) {
			if (n.id === Pi) {
				let e = n.readString();
				r = i.load(e), this.debugMessage("      File: " + t + e);
			} else n.id === Li ? (r.offset.x = n.readFloat(), this.debugMessage("      OffsetX: " + r.offset.x)) : n.id === Ri ? (r.offset.y = n.readFloat(), this.debugMessage("      OffsetY: " + r.offset.y)) : n.id === Fi ? (r.repeat.x = n.readFloat(), this.debugMessage("      RepeatX: " + r.repeat.x)) : n.id === Ii ? (r.repeat.y = n.readFloat(), this.debugMessage("      RepeatY: " + r.repeat.y)) : this.debugMessage("      Unknown map chunk: " + n.hexId);
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
		let t = e.readChunk(), n = new ke();
		if (t.id === di || t.id === fi) {
			let e = t.readByte(), r = t.readByte(), i = t.readByte();
			n.setRGB(e / 255, r / 255, i / 255), this.debugMessage("      Color: " + n.r + ", " + n.g + ", " + n.b);
		} else if (t.id === ui || t.id === pi) {
			let e = t.readFloat(), r = t.readFloat(), i = t.readFloat();
			n.setRGB(e, r, i), this.debugMessage("      Color: " + n.r + ", " + n.g + ", " + n.b);
		} else this.debugMessage("      Unknown color chunk: " + t.hexId);
		return n;
	}
	readPercentage(e) {
		let t = e.readChunk();
		switch (t.id) {
			case mi: return t.readShort() / 100;
			case hi: return t.readFloat();
			default: return this.debugMessage("      Unknown percentage chunk: " + t.hexId), 0;
		}
	}
	debugMessage(e) {
		this.debug && console.log(e);
	}
}, ai = class e {
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
}, oi = 19789, si = 15786, ci = 49725, li = 2, ui = 16, di = 17, fi = 18, pi = 19, mi = 48, hi = 49, gi = 15677, _i = 15678, vi = 256, yi = 45055, bi = 40960, xi = 40976, Si = 40992, Ci = 41008, wi = 41024, Ti = 41040, Ei = 41089, Di = 41091, Oi = 41093, ki = 41095, Ai = 41472, ji = 41488, Mi = 41520, Ni = 41476, Pi = 41728, Fi = 41812, Ii = 41814, Li = 41816, Ri = 41818, zi = 16384, Bi = 16640, Vi = 16656, Hi = 16672, Ui = 16688, Wi = 16704, Gi = 16736;
//#endregion
//#region node_modules/three/examples/jsm/utils/BufferGeometryUtils.js
function Ki(e, t) {
	if (t === Nt) return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), e;
	if (t === jt || t === Mt) {
		let n = e.getIndex();
		if (n === null) {
			let t = [], r = e.getAttribute("position");
			if (r !== void 0) {
				for (let e = 0; e < r.count; e++) t.push(e);
				e.setIndex(t), n = e.getIndex();
			} else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), e;
		}
		let r = n.count - 2, i = [];
		if (t === jt) for (let e = 1; e <= r; e++) i.push(n.getX(0)), i.push(n.getX(e)), i.push(n.getX(e + 1));
		else for (let e = 0; e < r; e++) e % 2 == 0 ? (i.push(n.getX(e)), i.push(n.getX(e + 1)), i.push(n.getX(e + 2))) : (i.push(n.getX(e + 2)), i.push(n.getX(e + 1)), i.push(n.getX(e)));
		return i.length / 3 !== r && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."), e.setIndex(i), e.clearGroups(), e;
	}
	return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", t), e;
}
//#endregion
//#region node_modules/three/examples/jsm/utils/SkeletonUtils.js
function qi(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = e.clone();
	return Ji(e, r, function(e, r) {
		t.set(r, e), n.set(e, r);
	}), r.traverse(function(e) {
		if (!e.isSkinnedMesh) return;
		let r = e, i = t.get(e), a = i.skeleton.bones;
		r.skeleton = i.skeleton.clone(), r.bindMatrix.copy(i.bindMatrix), r.skeleton.bones = a.map(function(e) {
			return n.get(e);
		}), r.bind(r.skeleton, r.bindMatrix);
	}), r;
}
function Ji(e, t, n) {
	n(e, t);
	for (let r = 0; r < e.children.length; r++) Ji(e.children[r], t.children[r], n);
}
//#endregion
//#region node_modules/three/examples/jsm/loaders/GLTFLoader.js
var Yi = class extends $e {
	constructor(e) {
		super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(e) {
			return new ea(e);
		}), this.register(function(e) {
			return new ta(e);
		}), this.register(function(e) {
			return new ua(e);
		}), this.register(function(e) {
			return new da(e);
		}), this.register(function(e) {
			return new fa(e);
		}), this.register(function(e) {
			return new ra(e);
		}), this.register(function(e) {
			return new ia(e);
		}), this.register(function(e) {
			return new aa(e);
		}), this.register(function(e) {
			return new oa(e);
		}), this.register(function(e) {
			return new $i(e);
		}), this.register(function(e) {
			return new sa(e);
		}), this.register(function(e) {
			return new na(e);
		}), this.register(function(e) {
			return new la(e);
		}), this.register(function(e) {
			return new ca(e);
		}), this.register(function(e) {
			return new Zi(e);
		}), this.register(function(e) {
			return new pa(e, G.EXT_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new pa(e, G.KHR_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new ma(e);
		});
	}
	load(e, t, n, r) {
		let i = this, a;
		if (this.resourcePath !== "") a = this.resourcePath;
		else if (this.path !== "") {
			let t = et.extractUrlBase(e);
			a = et.resolveURL(t, this.path);
		} else a = et.extractUrlBase(e);
		this.manager.itemStart(e);
		let o = function(t) {
			r ? r(t) : console.error(t), i.manager.itemError(e), i.manager.itemEnd(e);
		}, s = new Ne(this.manager);
		s.setPath(this.path), s.setResponseType("arraybuffer"), s.setRequestHeader(this.requestHeader), s.setWithCredentials(this.withCredentials), s.load(e, function(n) {
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
			if (s.decode(new Uint8Array(e, 0, 4)) === ha) {
				try {
					a[G.KHR_BINARY_GLTF] = new va(e);
				} catch (e) {
					r && r(e);
					return;
				}
				i = JSON.parse(a[G.KHR_BINARY_GLTF].content);
			} else i = JSON.parse(s.decode(e));
		} else i = e;
		if (i.asset === void 0 || i.asset.version[0] < 2) {
			r && r(/* @__PURE__ */ Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
			return;
		}
		let c = new Wa(i, {
			path: t || this.resourcePath || "",
			crossOrigin: this.crossOrigin,
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
				case G.KHR_MATERIALS_UNLIT:
					a[t] = new Qi();
					break;
				case G.KHR_DRACO_MESH_COMPRESSION:
					a[t] = new ya(i, this.dracoLoader);
					break;
				case G.KHR_TEXTURE_TRANSFORM:
					a[t] = new ba();
					break;
				case G.KHR_MESH_QUANTIZATION:
					a[t] = new xa();
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
function Xi() {
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
function W(e, t, n) {
	let r = e.json.materials[t];
	return r.extensions && r.extensions[n] ? r.extensions[n] : null;
}
var G = {
	KHR_BINARY_GLTF: "KHR_binary_glTF",
	KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
	KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
	KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
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
}, Zi = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_LIGHTS_PUNCTUAL, this.cache = {
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
		let i = t.json, a = ((i.extensions && i.extensions[this.name] || {}).lights || [])[e], o, s = new ke(16777215);
		a.color !== void 0 && s.setRGB(a.color[0], a.color[1], a.color[2], Qe);
		let c = a.range === void 0 ? 0 : a.range;
		switch (a.type) {
			case "directional":
				o = new je(s), o.target.position.set(0, 0, -1), o.add(o.target);
				break;
			case "point":
				o = new _t(s), o.distance = c;
				break;
			case "spot":
				o = new Ot(s), o.distance = c, a.spot = a.spot || {}, a.spot.innerConeAngle = a.spot.innerConeAngle === void 0 ? 0 : a.spot.innerConeAngle, a.spot.outerConeAngle = a.spot.outerConeAngle === void 0 ? Math.PI / 4 : a.spot.outerConeAngle, o.angle = a.spot.outerConeAngle, o.penumbra = 1 - a.spot.innerConeAngle / a.spot.outerConeAngle, o.target.position.set(0, 0, -1), o.add(o.target);
				break;
			default: throw Error("THREE.GLTFLoader: Unexpected light type: " + a.type);
		}
		return o.position.set(0, 0, 0), Ia(o, a), a.intensity !== void 0 && (o.intensity = a.intensity), o.name = t.createUniqueName(a.name || "light_" + e), r = Promise.resolve(o), t.cache.add(n, r), r;
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
}, Qi = class {
	constructor() {
		this.name = G.KHR_MATERIALS_UNLIT;
	}
	getMaterialType() {
		return at;
	}
	extendParams(e, t, n) {
		let r = [];
		e.color = new ke(1, 1, 1), e.opacity = 1;
		let i = t.pbrMetallicRoughness;
		if (i) {
			if (Array.isArray(i.baseColorFactor)) {
				let t = i.baseColorFactor;
				e.color.setRGB(t[0], t[1], t[2], Qe), e.opacity = t[3];
			}
			i.baseColorTexture !== void 0 && r.push(n.assignTexture(e, "map", i.baseColorTexture, wt));
		}
		return Promise.all(r);
	}
}, $i = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_MATERIALS_EMISSIVE_STRENGTH;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		return n === null || n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength), Promise.resolve();
	}
}, ea = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_MATERIALS_CLEARCOAT;
	}
	getMaterialType(e) {
		return W(this.parser, e, this.name) === null ? null : st;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor), n.clearcoatTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)), n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor), n.clearcoatRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)), n.clearcoatNormalTexture !== void 0 && (r.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)), n.clearcoatNormalTexture.scale !== void 0)) {
			let e = n.clearcoatNormalTexture.scale;
			t.clearcoatNormalScale = new Pt(e, e);
		}
		return Promise.all(r);
	}
}, ta = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_MATERIALS_DISPERSION;
	}
	getMaterialType(e) {
		return W(this.parser, e, this.name) === null ? null : st;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		return n === null || (t.dispersion = n.dispersion === void 0 ? 0 : n.dispersion), Promise.resolve();
	}
}, na = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_MATERIALS_IRIDESCENCE;
	}
	getMaterialType(e) {
		return W(this.parser, e, this.name) === null ? null : st;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor), n.iridescenceTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)), n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = n.iridescenceThicknessMinimum), n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = n.iridescenceThicknessMaximum), n.iridescenceThicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)), Promise.all(r);
	}
}, ra = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_MATERIALS_SHEEN;
	}
	getMaterialType(e) {
		return W(this.parser, e, this.name) === null ? null : st;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (t.sheenColor = new ke(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, n.sheenColorFactor !== void 0) {
			let e = n.sheenColorFactor;
			t.sheenColor.setRGB(e[0], e[1], e[2], Qe);
		}
		return n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor), n.sheenColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, wt)), n.sheenRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)), Promise.all(r);
	}
}, ia = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_MATERIALS_TRANSMISSION;
	}
	getMaterialType(e) {
		return W(this.parser, e, this.name) === null ? null : st;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor), n.transmissionTexture !== void 0 && r.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)), Promise.all(r);
	}
}, aa = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_MATERIALS_VOLUME;
	}
	getMaterialType(e) {
		return W(this.parser, e, this.name) === null ? null : st;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.thickness = n.thicknessFactor === void 0 ? 0 : n.thicknessFactor, n.thicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "thicknessMap", n.thicknessTexture)), t.attenuationDistance = n.attenuationDistance || Infinity;
		let i = n.attenuationColor || [
			1,
			1,
			1
		];
		return t.attenuationColor = new ke().setRGB(i[0], i[1], i[2], Qe), Promise.all(r);
	}
}, oa = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_MATERIALS_IOR;
	}
	getMaterialType(e) {
		return W(this.parser, e, this.name) === null ? null : st;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		return n === null || (t.ior = n.ior === void 0 ? 1.5 : n.ior, t.ior === 0 && (t.ior = 1e3)), Promise.resolve();
	}
}, sa = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_MATERIALS_SPECULAR;
	}
	getMaterialType(e) {
		return W(this.parser, e, this.name) === null ? null : st;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.specularIntensity = n.specularFactor === void 0 ? 1 : n.specularFactor, n.specularTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularIntensityMap", n.specularTexture));
		let i = n.specularColorFactor || [
			1,
			1,
			1
		];
		return t.specularColor = new ke().setRGB(i[0], i[1], i[2], Qe), n.specularColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, wt)), Promise.all(r);
	}
}, ca = class {
	constructor(e) {
		this.parser = e, this.name = G.EXT_MATERIALS_BUMP;
	}
	getMaterialType(e) {
		return W(this.parser, e, this.name) === null ? null : st;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return t.bumpScale = n.bumpFactor === void 0 ? 1 : n.bumpFactor, n.bumpTexture !== void 0 && r.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)), Promise.all(r);
	}
}, la = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_MATERIALS_ANISOTROPY;
	}
	getMaterialType(e) {
		return W(this.parser, e, this.name) === null ? null : st;
	}
	extendMaterialParams(e, t) {
		let n = W(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength), n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation), n.anisotropyTexture !== void 0 && r.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)), Promise.all(r);
	}
}, ua = class {
	constructor(e) {
		this.parser = e, this.name = G.KHR_TEXTURE_BASISU;
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
}, da = class {
	constructor(e) {
		this.parser = e, this.name = G.EXT_TEXTURE_WEBP;
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
}, fa = class {
	constructor(e) {
		this.parser = e, this.name = G.EXT_TEXTURE_AVIF;
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
}, pa = class {
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
}, ma = class {
	constructor(e) {
		this.name = G.EXT_MESH_GPU_INSTANCING, this.parser = e;
	}
	createNodeMesh(e) {
		let t = this.parser.json, n = t.nodes[e];
		if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
		let r = t.meshes[n.mesh];
		for (let e of r.primitives) if (e.mode !== Ta.TRIANGLES && e.mode !== Ta.TRIANGLE_STRIP && e.mode !== Ta.TRIANGLE_FAN && e.mode !== void 0) return null;
		let i = n.extensions[this.name].attributes, a = [], o = {};
		for (let e in i) a.push(this.parser.getDependency("accessor", i[e]).then((t) => (o[e] = t, o[e])));
		return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((e) => {
			let t = e.pop(), n = t.isGroup ? t.children : [t], r = e[0].count, i = [];
			for (let e of n) {
				let t = new rt(), n = new Ft(), a = new xt(), s = new Ft(1, 1, 1), c = new ze(e.geometry, e.material, r);
				for (let e = 0; e < r; e++) o.TRANSLATION && n.fromBufferAttribute(o.TRANSLATION, e), o.ROTATION && a.fromBufferAttribute(o.ROTATION, e), o.SCALE && s.fromBufferAttribute(o.SCALE, e), c.setMatrixAt(e, t.compose(n, a, s));
				let l = null;
				for (let e in o) if (e === "_COLOR_0") {
					let t = o[e];
					c.instanceColor = new Re(t.array, t.itemSize, t.normalized);
				} else if (e !== "TRANSLATION" && e !== "ROTATION" && e !== "SCALE") {
					if (l === null) {
						let e = c.geometry;
						l = new De(), l.name = e.name;
						for (let t in e.attributes) l.setAttribute(t, e.attributes[t]);
						for (let t in e.morphAttributes) l.morphAttributes[t] = e.morphAttributes[t];
						e.index !== null && l.setIndex(e.index), l.morphTargetsRelative = e.morphTargetsRelative;
						for (let t of e.groups) l.addGroup(t.start, t.count, t.materialIndex);
						e.boundingBox !== null && (l.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (l.boundingSphere = e.boundingSphere.clone()), l.drawRange.start = e.drawRange.start, l.drawRange.count = e.drawRange.count, l.userData = Object.assign({}, e.userData), c.geometry = l;
					}
					let t = o[e];
					l.setAttribute(e, new Re(t.array, t.itemSize, t.normalized));
				}
				mt.prototype.copy.call(c, e), this.parser.assignFinalMaterial(c), i.push(c);
			}
			return t.isGroup ? (t.clear(), t.add(...i), t) : i[0];
		}));
	}
}, ha = "glTF", ga = 12, _a = {
	JSON: 1313821514,
	BIN: 5130562
}, va = class {
	constructor(e) {
		this.name = G.KHR_BINARY_GLTF, this.content = null, this.body = null;
		let t = new DataView(e, 0, ga), n = new TextDecoder();
		if (this.header = {
			magic: n.decode(new Uint8Array(e.slice(0, 4))),
			version: t.getUint32(4, !0),
			length: t.getUint32(8, !0)
		}, this.header.magic !== ha) throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
		if (this.header.version < 2) throw Error("THREE.GLTFLoader: Legacy binary file detected.");
		let r = this.header.length - ga, i = new DataView(e, ga), a = 0;
		for (; a < r;) {
			let t = i.getUint32(a, !0);
			a += 4;
			let r = i.getUint32(a, !0);
			if (a += 4, r === _a.JSON) {
				let r = new Uint8Array(e, ga + a, t);
				this.content = n.decode(r);
			} else if (r === _a.BIN) {
				let n = ga + a;
				this.body = e.slice(n, n + t);
			}
			a += t;
		}
		if (this.content === null) throw Error("THREE.GLTFLoader: JSON content not found.");
	}
}, ya = class {
	constructor(e, t) {
		if (!t) throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
		this.name = G.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
	}
	decodePrimitive(e, t) {
		let n = this.json, r = this.dracoLoader, i = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, s = {}, c = {};
		for (let e in a) {
			let t = Aa[e] || e.toLowerCase();
			o[t] = a[e];
		}
		for (let t in e.attributes) {
			let r = Aa[t] || t.toLowerCase();
			if (a[t] !== void 0) {
				let i = n.accessors[e.attributes[t]];
				c[r] = Ea[i.componentType].name, s[r] = i.normalized === !0;
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
				}, o, c, Qe, n);
			});
		});
	}
}, ba = class {
	constructor() {
		this.name = G.KHR_TEXTURE_TRANSFORM;
	}
	extendTexture(e, t) {
		if ((t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0) return e;
		if (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), t.rotation !== void 0) {
			let t = Math.cos(e.rotation), n = Math.sin(e.rotation);
			e.matrix.set(e.repeat.x * t, e.repeat.y * n, e.offset.x, -e.repeat.x * n, e.repeat.y * t, e.offset.y, 0, 0, 1), e.matrixAutoUpdate = !1;
		}
		return e.needsUpdate = !0, e;
	}
}, xa = class {
	constructor() {
		this.name = G.KHR_MESH_QUANTIZATION;
	}
}, Sa = class extends He {
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
}, Ca = new xt(), wa = class extends Sa {
	interpolate_(e, t, n, r) {
		let i = super.interpolate_(e, t, n, r);
		return Ca.fromArray(i).normalize().toArray(i), i;
	}
}, Ta = {
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
}, Ea = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
}, Da = {
	9728: ut,
	9729: Ye,
	9984: ft,
	9985: Ze,
	9986: dt,
	9987: Xe
}, Oa = {
	33071: Oe,
	33648: lt,
	10497: Ct
}, ka = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT2: 4,
	MAT3: 9,
	MAT4: 16
}, Aa = {
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
}, ja = {
	scale: "scale",
	translation: "position",
	rotation: "quaternion",
	weights: "morphTargetInfluences"
}, Ma = {
	CUBICSPLINE: void 0,
	LINEAR: We,
	STEP: Ue
}, Na = {
	OPAQUE: "OPAQUE",
	MASK: "MASK",
	BLEND: "BLEND"
};
function Pa(e) {
	return e.DefaultMaterial === void 0 && (e.DefaultMaterial = new ct({
		color: 16777215,
		emissive: 0,
		metalness: 1,
		roughness: 1,
		transparent: !1,
		depthTest: !0,
		side: Fe
	})), e.DefaultMaterial;
}
function Fa(e, t, n) {
	for (let r in n.extensions) e[r] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[r] = n.extensions[r]);
}
function Ia(e, t) {
	t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function La(e, t, n) {
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
function Ra(e, t) {
	if (e.updateMorphTargets(), t.weights !== void 0) for (let n = 0, r = t.weights.length; n < r; n++) e.morphTargetInfluences[n] = t.weights[n];
	if (t.extras && Array.isArray(t.extras.targetNames)) {
		let n = t.extras.targetNames;
		if (e.morphTargetInfluences.length === n.length) {
			e.morphTargetDictionary = {};
			for (let t = 0, r = n.length; t < r; t++) e.morphTargetDictionary[n[t]] = t;
		} else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
	}
}
function za(e) {
	let t, n = e.extensions && e.extensions[G.KHR_DRACO_MESH_COMPRESSION];
	if (t = n ? "draco:" + n.bufferView + ":" + n.indices + ":" + Ba(n.attributes) : e.indices + ":" + Ba(e.attributes) + ":" + e.mode, e.targets !== void 0) for (let n = 0, r = e.targets.length; n < r; n++) t += ":" + Ba(e.targets[n]);
	return t;
}
function Ba(e) {
	let t = "", n = Object.keys(e).sort();
	for (let r = 0, i = n.length; r < i; r++) t += n[r] + ":" + e[n[r]] + ";";
	return t;
}
function Va(e) {
	switch (e) {
		case Int8Array: return 1 / 127;
		case Uint8Array: return 1 / 255;
		case Int16Array: return 1 / 32767;
		case Uint16Array: return 1 / 65535;
		default: throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
	}
}
function Ha(e) {
	return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0 ? "image/webp" : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
var Ua = new rt(), Wa = class {
	constructor(e = {}, t = {}) {
		this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Xi(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = {
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
		this.textureLoader = typeof createImageBitmap > "u" || n && r < 17 || i && a < 98 ? new At(this.options.manager) : new Le(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new Ne(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
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
			return Fa(i, a, r), Ia(a, r), Promise.all(n._invokeAll(function(e) {
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
		if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[G.KHR_BINARY_GLTF].body);
		let r = this.options;
		return new Promise(function(e, i) {
			n.load(et.resolveURL(t.uri, r.path), e, void 0, function() {
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
			let e = ka[r.type], t = Ea[r.componentType], n = r.normalized === !0, i = new t(r.count * e);
			return Promise.resolve(new Ee(i, e, n));
		}
		let i = [];
		return r.bufferView === void 0 ? i.push(null) : i.push(this.getDependency("bufferView", r.bufferView)), r.sparse !== void 0 && (i.push(this.getDependency("bufferView", r.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", r.sparse.values.bufferView))), Promise.all(i).then(function(e) {
			let i = e[0], a = ka[r.type], o = Ea[r.componentType], s = o.BYTES_PER_ELEMENT, c = s * a, l = r.byteOffset || 0, u = r.bufferView === void 0 ? void 0 : n.bufferViews[r.bufferView].byteStride, d = r.normalized === !0, f, p;
			if (u && u !== c) {
				let e = Math.floor(l / u), n = "InterleavedBuffer:" + r.bufferView + ":" + r.componentType + ":" + e + ":" + r.count, c = t.cache.get(n);
				c || (f = new o(i, e * u, r.count * u / s), c = new Be(f, u / s), t.cache.add(n, c)), p = new Ve(c, a, l % u / s, d);
			} else f = i === null ? new o(r.count * a) : new o(i, l, r.count * a), p = new Ee(f, a, d);
			if (r.sparse !== void 0) {
				let t = ka.SCALAR, n = Ea[r.sparse.indices.componentType], s = r.sparse.indices.byteOffset || 0, c = r.sparse.values.byteOffset || 0, l = new n(e[1], s, r.sparse.count * t), u = new o(e[2], c, r.sparse.count * a);
				i !== null && (p = new Ee(p.array.slice(), p.itemSize, p.normalized)), p.normalized = !1;
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
			return t.magFilter = Da[n.magFilter] || Ye, t.minFilter = Da[n.minFilter] || Xe, t.wrapS = Oa[n.wrapS] || Ct, t.wrapT = Oa[n.wrapT] || Ct, t.generateMipmaps = !t.isCompressedTexture && t.minFilter !== ut && t.minFilter !== Ye, r.associations.set(t, { textures: e }), t;
		}).catch(function() {
			return null;
		});
		return this.textureCache[s] = c, c;
	}
	loadImageSource(e, t) {
		let n = this, r = this.json, i = this.options;
		if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((e) => e.clone());
		let a = r.images[e], o = self.URL || self.webkitURL, s = a.uri || "", c = !1;
		if (a.bufferView !== void 0) s = n.getDependency("bufferView", a.bufferView).then(function(e) {
			c = !0;
			let t = new Blob([e], { type: a.mimeType });
			return s = o.createObjectURL(t), s;
		});
		else if (a.uri === void 0) throw Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
		let l = Promise.resolve(s).then(function(e) {
			return new Promise(function(n, r) {
				let a = n;
				t.isImageBitmapLoader === !0 && (a = function(e) {
					let t = new kt(e);
					t.needsUpdate = !0, n(t);
				}), t.load(et.resolveURL(e, i.path), a, void 0, r);
			});
		}).then(function(e) {
			return c === !0 && o.revokeObjectURL(s), Ia(e, a), e.userData.mimeType = a.mimeType || Ha(a.uri), e;
		}).catch(function(e) {
			throw console.error("THREE.GLTFLoader: Couldn't load texture", s), e;
		});
		return this.sourceCache[e] = l, l;
	}
	assignTexture(e, t, n, r) {
		let i = this;
		return this.getDependency("texture", n.index).then(function(a) {
			if (!a) return null;
			if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), i.extensions[G.KHR_TEXTURE_TRANSFORM]) {
				let e = n.extensions === void 0 ? void 0 : n.extensions[G.KHR_TEXTURE_TRANSFORM];
				if (e) {
					let t = i.associations.get(a);
					a = i.extensions[G.KHR_TEXTURE_TRANSFORM].extendTexture(a, e), i.associations.set(a, t);
				}
			}
			return r !== void 0 && (a.colorSpace = r), e[t] = a, a;
		});
	}
	assignFinalMaterial(e) {
		let t = e.geometry, n = e.material, r = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
		if (e.isPoints) {
			let e = "PointsMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new yt(), tt.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, t.sizeAttenuation = !1, this.cache.add(e, t)), n = t;
		} else if (e.isLine) {
			let e = "LineBasicMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new Ke(), tt.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, this.cache.add(e, t)), n = t;
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
		return ct;
	}
	loadMaterial(e) {
		let t = this, n = this.json, r = this.extensions, i = n.materials[e], a, o = {}, s = i.extensions || {}, c = [];
		if (s[G.KHR_MATERIALS_UNLIT]) {
			let e = r[G.KHR_MATERIALS_UNLIT];
			a = e.getMaterialType(), c.push(e.extendParams(o, i, t));
		} else {
			let n = i.pbrMetallicRoughness || {};
			if (o.color = new ke(1, 1, 1), o.opacity = 1, Array.isArray(n.baseColorFactor)) {
				let e = n.baseColorFactor;
				o.color.setRGB(e[0], e[1], e[2], Qe), o.opacity = e[3];
			}
			n.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", n.baseColorTexture, wt)), o.metalness = n.metallicFactor === void 0 ? 1 : n.metallicFactor, o.roughness = n.roughnessFactor === void 0 ? 1 : n.roughnessFactor, n.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", n.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", n.metallicRoughnessTexture))), a = this._invokeOne(function(t) {
				return t.getMaterialType && t.getMaterialType(e);
			}), c.push(Promise.all(this._invokeAll(function(t) {
				return t.extendMaterialParams && t.extendMaterialParams(e, o);
			})));
		}
		i.doubleSided === !0 && (o.side = Me);
		let l = i.alphaMode || Na.OPAQUE;
		if (l === Na.BLEND ? (o.transparent = !0, o.depthWrite = !1) : (o.transparent = !1, l === Na.MASK && (o.alphaTest = i.alphaCutoff === void 0 ? .5 : i.alphaCutoff)), i.normalTexture !== void 0 && a !== at && (c.push(t.assignTexture(o, "normalMap", i.normalTexture)), o.normalScale = new Pt(1, 1), i.normalTexture.scale !== void 0)) {
			let e = i.normalTexture.scale;
			o.normalScale.set(e, e);
		}
		if (i.occlusionTexture !== void 0 && a !== at && (c.push(t.assignTexture(o, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && a !== at) {
			let e = i.emissiveFactor;
			o.emissive = new ke().setRGB(e[0], e[1], e[2], Qe);
		}
		return i.emissiveTexture !== void 0 && a !== at && c.push(t.assignTexture(o, "emissiveMap", i.emissiveTexture, wt)), Promise.all(c).then(function() {
			let n = new a(o);
			return i.name && (n.name = i.name), Ia(n, i), t.associations.set(n, { materials: e }), i.extensions && Fa(r, n, i), n;
		});
	}
	createUniqueName(e) {
		let t = bt.sanitizeNodeName(e || "");
		return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
	}
	loadGeometries(e) {
		let t = this, n = this.extensions, r = this.primitiveCache;
		function i(e) {
			return n[G.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then(function(n) {
				return Ka(n, e, t);
			});
		}
		let a = [];
		for (let n = 0, o = e.length; n < o; n++) {
			let o = e[n], s = za(o), c = r[s];
			if (c) a.push(c.promise);
			else {
				let e;
				e = o.extensions && o.extensions[G.KHR_DRACO_MESH_COMPRESSION] ? i(o) : Ka(new De(), o, t), o.mode === Ta.TRIANGLE_STRIP ? e = e.then((e) => Ki(e, Mt)) : o.mode === Ta.TRIANGLE_FAN && (e = e.then((e) => Ki(e, jt))), r[s] = {
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
			let t = a[e].material === void 0 ? Pa(this.cache) : this.getDependency("material", a[e].material);
			o.push(t);
		}
		return o.push(t.loadGeometries(a)), Promise.all(o).then(async function(n) {
			let o = n.slice(0, n.length - 1), s = n[n.length - 1], c = [];
			for (let n = 0, l = s.length; n < l; n++) {
				let l = s[n], u = a[n], d, f = o[n];
				if (u.mode === Ta.TRIANGLES || u.mode === Ta.TRIANGLE_STRIP || u.mode === Ta.TRIANGLE_FAN || u.mode === void 0) {
					let e = i.isSkinnedMesh === !0, t = l.hasAttribute("skinIndex") && l.hasAttribute("skinWeight");
					e && t === !1 && console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."), d = e && t ? new Et(l, f) : new it(l, f), d.isSkinnedMesh === !0 && d.normalizeSkinWeights();
				} else if (u.mode === Ta.LINES) d = new Je(l, f);
				else if (u.mode === Ta.LINE_STRIP) d = new Ge(l, f);
				else if (u.mode === Ta.LINE_LOOP) d = new qe(l, f);
				else if (u.mode === Ta.POINTS) d = new vt(l, f);
				else throw Error("THREE.GLTFLoader: Primitive mode unsupported: " + u.mode);
				Object.keys(d.geometry.morphAttributes).length > 0 && Ra(d, i), d.name = t.createUniqueName(i.name || "mesh_" + e), Ia(d, i), u.extensions && Fa(r, d, u), t.assignFinalMaterial(d), c.push(d);
			}
			for (let n = 0, r = c.length; n < r; n++) t.associations.set(c[n], {
				meshes: e,
				primitives: n
			});
			if (c.length === 1) return i.extensions && Fa(r, c[0], i), c[0];
			let l = new Ie();
			i.extensions && Fa(r, l, i), t.associations.set(l, { meshes: e });
			for (let e = 0, t = c.length; e < t; e++) l.add(c[e]);
			return l;
		});
	}
	loadCamera(e) {
		let t, n = this.json.cameras[e], r = n[n.type];
		if (!r) console.warn("THREE.GLTFLoader: Missing camera parameters.");
		else return n.type === "perspective" ? t = new gt(nt.radToDeg(r.yfov), r.aspectRatio || 1, r.znear || 1, r.zfar || 2e6) : n.type === "orthographic" && (t = new ht(-r.xmag, r.xmag, r.ymag, -r.ymag, r.znear, r.zfar)), n.name && (t.name = this.createUniqueName(n.name)), Ia(t, n), Promise.resolve(t);
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
					let t = new rt();
					n !== null && t.fromArray(n.array, e * 16), a.push(t);
				} else console.warn("THREE.GLTFLoader: Joint \"%s\" could not be found.", t.joints[e]);
			}
			return new Tt(i, a);
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
			let u = new Ce(i, void 0, l);
			return Ia(u, r), u;
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
				e.isSkinnedMesh && e.bind(r, Ua);
			});
			for (let e = 0, r = n.length; e < r; e++) t.add(n[e]);
			if (t.userData.pivot !== void 0 && n.length > 0) {
				let e = t.userData.pivot, r = n[0];
				t.pivot = new Ft().fromArray(e), t.position.x -= e[0], t.position.y -= e[1], t.position.z -= e[2], r.position.set(0, 0, 0), delete t.userData.pivot;
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
			if (o = i.isBone === !0 ? new we() : t.length > 1 ? new Ie() : t.length === 1 ? t[0] : new mt(), o !== t[0]) for (let e = 0, n = t.length; e < n; e++) o.add(t[e]);
			if (i.name && (o.userData.name = i.name, o.name = a), Ia(o, i), i.extensions && Fa(n, o, i), i.matrix !== void 0) {
				let e = new rt();
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
		let t = this.extensions, n = this.json.scenes[e], r = this, i = new Ie();
		n.name && (i.name = r.createUniqueName(n.name)), Ia(i, n), n.extensions && Fa(t, i, n);
		let a = n.nodes || [], o = [];
		for (let e = 0, t = a.length; e < t; e++) o.push(r.getDependency("node", a[e]));
		return Promise.all(o).then(function(e) {
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				n.parent === null ? i.add(n) : i.add(qi(n));
			}
			return r.associations = ((e) => {
				let t = /* @__PURE__ */ new Map();
				for (let [e, n] of r.associations) (e instanceof tt || e instanceof kt) && t.set(e, n);
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
		ja[i.path] === ja.weights ? (c(e), e.isGroup && e.children.forEach(c)) : s.push(o);
		let l;
		switch (ja[i.path]) {
			case ja.weights:
				l = pt;
				break;
			case ja.rotation:
				l = St;
				break;
			case ja.translation:
			case ja.scale:
				l = It;
				break;
			default: switch (n.itemSize) {
				case 1:
					l = pt;
					break;
				default: l = It;
			}
		}
		let u = r.interpolation === void 0 ? We : Ma[r.interpolation], d = this._getArrayFromAccessor(n);
		for (let e = 0, n = s.length; e < n; e++) {
			let n = new l(s[e] + "." + ja[i.path], t.array, d, u);
			r.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(n), a.push(n);
		}
		return a;
	}
	_getArrayFromAccessor(e) {
		let t = e.array;
		if (e.normalized) {
			let e = Va(t.constructor), n = new Float32Array(t.length);
			for (let r = 0, i = t.length; r < i; r++) n[r] = t[r] * e;
			t = n;
		}
		return t;
	}
	_createCubicSplineTrackInterpolant(e) {
		e.createInterpolant = function(e) {
			return new (this instanceof St ? wa : Sa)(this.times, this.values, this.getValueSize() / 3, e);
		}, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
	}
};
function Ga(e, t, n) {
	let r = t.attributes, i = new Te();
	if (r.POSITION !== void 0) {
		let e = n.json.accessors[r.POSITION], t = e.min, a = e.max;
		if (t !== void 0 && a !== void 0) {
			if (i.set(new Ft(t[0], t[1], t[2]), new Ft(a[0], a[1], a[2])), e.normalized) {
				let t = Va(Ea[e.componentType]);
				i.min.multiplyScalar(t), i.max.multiplyScalar(t);
			}
		} else {
			console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			return;
		}
	} else return;
	let a = t.targets;
	if (a !== void 0) {
		let e = new Ft(), t = new Ft();
		for (let r = 0, i = a.length; r < i; r++) {
			let i = a[r];
			if (i.POSITION !== void 0) {
				let r = n.json.accessors[i.POSITION], a = r.min, o = r.max;
				if (a !== void 0 && o !== void 0) {
					if (t.setX(Math.max(Math.abs(a[0]), Math.abs(o[0]))), t.setY(Math.max(Math.abs(a[1]), Math.abs(o[1]))), t.setZ(Math.max(Math.abs(a[2]), Math.abs(o[2]))), r.normalized) {
						let e = Va(Ea[r.componentType]);
						t.multiplyScalar(e);
					}
					e.max(t);
				} else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			}
		}
		i.expandByVector(e);
	}
	e.boundingBox = i;
	let o = new Dt();
	i.getCenter(o.center), o.radius = i.min.distanceTo(i.max) / 2, e.boundingSphere = o;
}
function Ka(e, t, n) {
	let r = t.attributes, i = [];
	function a(t, r) {
		return n.getDependency("accessor", t).then(function(t) {
			e.setAttribute(r, t);
		});
	}
	for (let t in r) {
		let n = Aa[t] || t.toLowerCase();
		n in e.attributes || i.push(a(r[t], n));
	}
	if (t.indices !== void 0 && !e.index) {
		let r = n.getDependency("accessor", t.indices).then(function(t) {
			e.setIndex(t);
		});
		i.push(r);
	}
	return Ae.workingColorSpace !== Qe && "COLOR_0" in r && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ae.workingColorSpace}" not supported.`), Ia(e, t), Ga(e, t, n), Promise.all(i).then(function() {
		return t.targets === void 0 ? e : La(e, t.targets, n);
	});
}
//#endregion
//#region src/import-handlers/obj.ts
var qa = class {
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
}, Ja = class extends j.Loader {
	load(e, t, n, r) {
		let i = this, a = new j.Texture(), o = new j.FileLoader(this.manager);
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
			} else a = i.subarray(r, r += t ? n.width * n.height : c);
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
}, Ya = class extends j.Loader {
	load(e, t, n, r) {
		var i = this, a = i.path === "" ? j.LoaderUtils.extractUrlBase(e) : i.path, o = new j.FileLoader(i.manager);
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
			return "three_default_" + L++;
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
							a = i.getAttribute("id"), t.sources[a] = We(i);
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
			R.animations[e.getAttribute("id")] = t;
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
			for (var a in n) if (n.hasOwnProperty(a)) {
				var o = n[a], s = r[o.sampler], c = s.inputs.INPUT, l = s.inputs.OUTPUT, u = i[c], d = i[l];
				T(b(o, u, d), t);
			}
			return t;
		}
		function y(e) {
			return m(R.animations[e], v);
		}
		function b(e, t, n) {
			var r = R.nodes[e.id], i = kt(r.id), a = r.transforms[e.sid], o = r.matrix.clone().transpose(), s, c, l, u, d, f, p = {};
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
			for (var i = 0; i < 16; i++) E(n, i, t.elements[i]);
			return n;
			function a(e, t) {
				return e.time - t.time;
			}
		}
		var S = new j.Vector3(), C = new j.Vector3(), w = new j.Quaternion();
		function T(e, t) {
			for (var n = e.keyframes, r = e.name, i = [], a = [], o = [], s = [], c = 0, l = n.length; c < l; c++) {
				var u = n[c], d = u.time, f = u.value;
				vt.fromArray(f).transpose(), vt.decompose(S, w, C), i.push(d), a.push(S.x, S.y, S.z), o.push(w.x, w.y, w.z, w.w), s.push(C.x, C.y, C.z);
			}
			return a.length > 0 && t.push(new j.VectorKeyframeTrack(r + ".position", i, a)), o.length > 0 && t.push(new j.QuaternionKeyframeTrack(r + ".quaternion", i, o)), s.length > 0 && t.push(new j.VectorKeyframeTrack(r + ".scale", i, s)), t;
		}
		function E(e, t, n) {
			for (var r, i = !0, a = 0, o = e.length; a < o; a++) r = e[a], r.value[t] === void 0 ? r.value[t] = null : i = !1;
			if (i === !0) for (a = 0, o = e.length; a < o; a++) r = e[a], r.value[t] = n;
			else D(e, t);
		}
		function D(e, t) {
			for (var n, r, i = 0, a = e.length; i < a; i++) {
				var o = e[i];
				if (o.value[t] === null) {
					if (n = O(e, i, t), r = ee(e, i, t), n === null) {
						o.value[t] = r.value[t];
						continue;
					}
					if (r === null) {
						o.value[t] = n.value[t];
						continue;
					}
					te(o, n, r, t);
				}
			}
		}
		function O(e, t, n) {
			for (; t >= 0;) {
				var r = e[t];
				if (r.value[n] !== null) return r;
				t--;
			}
			return null;
		}
		function ee(e, t, n) {
			for (; t < e.length;) {
				var r = e[t];
				if (r.value[n] !== null) return r;
				t++;
			}
			return null;
		}
		function te(e, t, n, r) {
			n.time - t.time === 0 ? e.value[r] = t.value[r] : e.value[r] = (e.time - t.time) * (n.value[r] - t.value[r]) / (n.time - t.time) + t.value[r];
		}
		function ne(e) {
			for (var t = {
				name: e.getAttribute("id") || "default",
				start: parseFloat(e.getAttribute("start") || 0),
				end: parseFloat(e.getAttribute("end") || 0),
				animations: []
			}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "instance_animation" && t.animations.push(o(i.getAttribute("url")));
			}
			R.clips[e.getAttribute("id")] = t;
		}
		function k(e) {
			for (var t = [], n = e.name, r = e.end - e.start || -1, i = e.animations, a = 0, o = i.length; a < o; a++) for (var s = y(i[a]), c = 0, l = s.length; c < l; c++) t.push(s[c]);
			return new j.AnimationClip(n, r, t);
		}
		function re(e) {
			return m(R.clips[e], k);
		}
		function ie(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "skin":
						t.id = o(i.getAttribute("source")), t.skin = ae(i);
						break;
					case "morph": t.id = o(i.getAttribute("source")), console.warn("THREE.DAELoader: Morph target animation not supported yet.");
				}
			}
			R.controllers[e.getAttribute("id")] = t;
		}
		function ae(e) {
			for (var t = { sources: {} }, n = 0, r = e.childNodes.length; n < r; n++) {
				var a = e.childNodes[n];
				if (a.nodeType === 1) switch (a.nodeName) {
					case "bind_shape_matrix":
						t.bindShapeMatrix = i(a.textContent);
						break;
					case "source":
						var o = a.getAttribute("id");
						t.sources[o] = We(a);
						break;
					case "joints":
						t.joints = oe(a);
						break;
					case "vertex_weights": t.vertexWeights = se(a);
				}
			}
			return t;
		}
		function oe(e) {
			for (var t = { inputs: {} }, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1 && i.nodeName === "input") {
					var a = i.getAttribute("semantic"), s = o(i.getAttribute("source"));
					t.inputs[a] = s;
				}
			}
			return t;
		}
		function se(e) {
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
		function A(e) {
			var t = { id: e.id }, n = R.geometries[t.id];
			return e.skin !== void 0 && (t.skin = ce(e.skin), n.sources.skinIndices = t.skin.indices, n.sources.skinWeights = t.skin.weights), t;
		}
		function ce(e) {
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
			for (n.bindMatrix = e.bindShapeMatrix ? new j.Matrix4().fromArray(e.bindShapeMatrix).transpose() : new j.Matrix4().identity(), p = 0, h = l.array.length; p < h; p++) {
				var x = l.array[p], S = new j.Matrix4().fromArray(u.array, p * u.stride).transpose();
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
		function le(e) {
			return m(R.controllers[e], A);
		}
		function ue(e) {
			var t = { init_from: n(e, "init_from")[0].textContent };
			R.images[e.getAttribute("id")] = t;
		}
		function de(e) {
			return e.build === void 0 ? e.init_from : e.build;
		}
		function fe(e) {
			var t = R.images[e];
			return t === void 0 ? (console.warn("THREE.DAELoader: Couldn't find image with ID:", e), null) : m(t, de);
		}
		function pe(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "profile_COMMON" && (t.profile = me(i));
			}
			R.effects[e.getAttribute("id")] = t;
		}
		function me(e) {
			for (var t = {
				surfaces: {},
				samplers: {}
			}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "newparam":
						he(i, t);
						break;
					case "technique":
						t.technique = ve(i);
						break;
					case "extra": t.extra = we(i);
				}
			}
			return t;
		}
		function he(e, t) {
			for (var n = e.getAttribute("sid"), r = 0, i = e.childNodes.length; r < i; r++) {
				var a = e.childNodes[r];
				if (a.nodeType === 1) switch (a.nodeName) {
					case "surface":
						t.surfaces[n] = ge(a);
						break;
					case "sampler2D": t.samplers[n] = _e(a);
				}
			}
		}
		function ge(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "init_from" && (t.init_from = i.textContent);
			}
			return t;
		}
		function _e(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "source" && (t.source = i.textContent);
			}
			return t;
		}
		function ve(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "constant":
					case "lambert":
					case "blinn":
					case "phong": t.type = i.nodeName, t.parameters = ye(i);
				}
			}
			return t;
		}
		function ye(e) {
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
						t[i.nodeName] = be(i);
						break;
					case "transparent": t[i.nodeName] = {
						opaque: i.getAttribute("opaque"),
						data: be(i)
					};
				}
			}
			return t;
		}
		function be(e) {
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
						extra: xe(a)
					};
				}
			}
			return t;
		}
		function xe(e) {
			for (var t = { technique: {} }, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "extra" && Se(i, t);
			}
			return t;
		}
		function Se(e, t) {
			for (var n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "technique" && Ce(i, t);
			}
		}
		function Ce(e, t) {
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
		function we(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "technique" && (t.technique = Te(i));
			}
			return t;
		}
		function Te(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "double_sided" && (t[i.nodeName] = parseInt(i.textContent));
			}
			return t;
		}
		function Ee(e) {
			return e;
		}
		function De(e) {
			return m(R.effects[e], Ee);
		}
		function Oe(e) {
			for (var t = { name: e.getAttribute("name") }, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "instance_effect" && (t.url = o(i.getAttribute("url")));
			}
			R.materials[e.getAttribute("id")] = t;
		}
		function ke(e) {
			var t, n = e.slice((e.lastIndexOf(".") - 1 >>> 0) + 2);
			switch (n = n.toLowerCase(), n) {
				case "tga":
					t = F;
					break;
				default: t = Vt;
			}
			return t;
		}
		function Ae(e) {
			var t = De(e.url), n = t.profile.technique, r = t.profile.extra, i;
			switch (n.type) {
				case "phong":
				case "blinn":
					i = new j.MeshPhongMaterial();
					break;
				case "lambert":
					i = new j.MeshLambertMaterial();
					break;
				default: i = new j.MeshBasicMaterial();
			}
			i.name = e.name || "";
			function a(e) {
				var n = t.profile.samplers[e.id], r = null;
				if (n !== void 0) {
					var i = t.profile.surfaces[n.source];
					r = fe(i.init_from);
				} else console.warn("THREE.DAELoader: Undefined sampler. Access image directly (see #12530)."), r = fe(e.id);
				if (r !== null) {
					var a = ke(r);
					if (a !== void 0) {
						var o = a.load(r), s = e.extra;
						if (s !== void 0 && s.technique !== void 0 && c(s.technique) === !1) {
							var l = s.technique;
							o.wrapS = l.wrapU ? j.RepeatWrapping : j.ClampToEdgeWrapping, o.wrapT = l.wrapV ? j.RepeatWrapping : j.ClampToEdgeWrapping, o.offset.set(l.offsetU || 0, l.offsetV || 0), o.repeat.set(l.repeatU || 1, l.repeatV || 1);
						} else o.wrapS = j.RepeatWrapping, o.wrapT = j.RepeatWrapping;
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
			return r !== void 0 && r.technique !== void 0 && r.technique.double_sided === 1 && (i.side = j.DoubleSide), i;
		}
		function je(e) {
			return m(R.materials[e], Ae);
		}
		function Me(e) {
			for (var t = { name: e.getAttribute("name") }, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "optics" && (t.optics = Ne(i));
			}
			R.cameras[e.getAttribute("id")] = t;
		}
		function Ne(e) {
			for (var t = 0; t < e.childNodes.length; t++) {
				var n = e.childNodes[t];
				if (n.nodeName === "technique_common") return Pe(n);
			}
			return {};
		}
		function Pe(e) {
			for (var t = {}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				switch (r.nodeName) {
					case "perspective":
					case "orthographic": t.technique = r.nodeName, t.parameters = Fe(r);
				}
			}
			return t;
		}
		function Fe(e) {
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
		function Ie(e) {
			var t;
			switch (e.optics.technique) {
				case "perspective":
					t = new j.PerspectiveCamera(e.optics.parameters.yfov, e.optics.parameters.aspect_ratio, e.optics.parameters.znear, e.optics.parameters.zfar);
					break;
				case "orthographic":
					var n = e.optics.parameters.ymag, r = e.optics.parameters.xmag, i = e.optics.parameters.aspect_ratio;
					r = r === void 0 ? n * i : r, n = n === void 0 ? r / i : n, r *= .5, n *= .5, t = new j.OrthographicCamera(-r, r, n, -n, e.optics.parameters.znear, e.optics.parameters.zfar);
					break;
				default: t = new j.PerspectiveCamera();
			}
			return t.name = e.name || "", t;
		}
		function Le(e) {
			var t = R.cameras[e];
			return t === void 0 ? (console.warn("THREE.DAELoader: Couldn't find camera with ID:", e), null) : m(t, Ie);
		}
		function Re(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				i.nodeType === 1 && i.nodeName === "technique_common" && (t = ze(i));
			}
			R.lights[e.getAttribute("id")] = t;
		}
		function ze(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var i = e.childNodes[n];
				if (i.nodeType === 1) switch (i.nodeName) {
					case "directional":
					case "point":
					case "spot":
					case "ambient": t.technique = i.nodeName, t.parameters = Be(i);
				}
			}
			return t;
		}
		function Be(e) {
			for (var t = {}, n = 0, r = e.childNodes.length; n < r; n++) {
				var a = e.childNodes[n];
				if (a.nodeType === 1) switch (a.nodeName) {
					case "color":
						var o = i(a.textContent);
						t.color = new j.Color().fromArray(o);
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
		function Ve(e) {
			var t;
			switch (e.technique) {
				case "directional":
					t = new j.DirectionalLight();
					break;
				case "point":
					t = new j.PointLight();
					break;
				case "spot":
					t = new j.SpotLight();
					break;
				case "ambient": t = new j.AmbientLight();
			}
			return e.parameters.color && t.color.copy(e.parameters.color), e.parameters.distance && (t.distance = e.parameters.distance), t;
		}
		function He(e) {
			var t = R.lights[e];
			return t === void 0 ? (console.warn("THREE.DAELoader: Couldn't find light with ID:", e), null) : m(t, Ve);
		}
		function Ue(e) {
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
								t.sources[o] = We(a);
								break;
							case "vertices":
								t.vertices = Ge(a);
								break;
							case "polygons":
								console.warn("THREE.DAELoader: Unsupported primitive type: ", a.nodeName);
								break;
							case "lines":
							case "linestrips":
							case "polylist":
							case "triangles":
								t.primitives.push(Ke(a));
								break;
							default: console.log(a);
						}
					}
				}
				R.geometries[e.getAttribute("id")] = t;
			}
		}
		function We(e) {
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
		function Ge(e) {
			for (var t = {}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				r.nodeType === 1 && (t[r.getAttribute("semantic")] = o(r.getAttribute("source")));
			}
			return t;
		}
		function Ke(e) {
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
		function qe(e) {
			for (var t = {}, n = 0; n < e.length; n++) {
				var r = e[n];
				t[r.type] === void 0 && (t[r.type] = []), t[r.type].push(r);
			}
			return t;
		}
		function Je(e) {
			for (var t = 0, n = 0, r = e.length; n < r; n++) e[n].hasUV === !0 && t++;
			t > 0 && t < e.length && (e.uvsNeedsFix = !0);
		}
		function Ye(e) {
			var t = {}, n = e.sources, r = e.vertices, i = e.primitives;
			if (i.length === 0) return {};
			var a = qe(i);
			for (var o in a) {
				var s = a[o];
				Je(s), t[o] = Xe(s, n, r);
			}
			return t;
		}
		function Xe(e, t, n) {
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
			}, d = new j.BufferGeometry(), f = [], p = 0, m = 0; m < e.length; m++) {
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
										if (Ze(h, t[C], x.offset, i.array), i.stride = t[C].stride, t.skinWeights && t.skinIndices && (Ze(h, t.skinIndices, x.offset, l.array), Ze(h, t.skinWeights, x.offset, u.array)), h.hasUV === !1 && e.uvsNeedsFix === !0) for (var _ = (i.array.length - w) / i.stride, T = 0; T < _; T++) o.array.push(0, 0);
										break;
									case "NORMAL":
										Ze(h, t[C], x.offset, a.array), a.stride = t[C].stride;
										break;
									case "COLOR":
										Ze(h, t[C], x.offset, c.array), c.stride = t[C].stride;
										break;
									case "TEXCOORD":
										Ze(h, t[C], x.offset, o.array), o.stride = t[C].stride;
										break;
									case "TEXCOORD1":
										Ze(h, t[C], x.offset, s.array), o.stride = t[C].stride;
										break;
									default: console.warn("THREE.DAELoader: Semantic \"%s\" not handled in geometry build process.", S);
								}
							}
							break;
						case "NORMAL":
							Ze(h, t[x.id], x.offset, a.array), a.stride = t[x.id].stride;
							break;
						case "COLOR":
							Ze(h, t[x.id], x.offset, c.array), c.stride = t[x.id].stride;
							break;
						case "TEXCOORD":
							Ze(h, t[x.id], x.offset, o.array), o.stride = t[x.id].stride;
							break;
						case "TEXCOORD1": Ze(h, t[x.id], x.offset, s.array), s.stride = t[x.id].stride;
					}
				}
			}
			return i.array.length > 0 && d.setAttribute("position", new j.Float32BufferAttribute(i.array, i.stride)), a.array.length > 0 && d.setAttribute("normal", new j.Float32BufferAttribute(a.array, a.stride)), c.array.length > 0 && d.setAttribute("color", new j.Float32BufferAttribute(c.array, c.stride)), o.array.length > 0 && d.setAttribute("uv", new j.Float32BufferAttribute(o.array, o.stride)), s.array.length > 0 && d.setAttribute("uv2", new j.Float32BufferAttribute(s.array, s.stride)), l.array.length > 0 && d.setAttribute("skinIndex", new j.Float32BufferAttribute(l.array, l.stride)), u.array.length > 0 && d.setAttribute("skinWeight", new j.Float32BufferAttribute(u.array, u.stride)), r.data = d, r.type = e[0].type, r.materialKeys = f, r;
		}
		function Ze(e, t, n, r) {
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
		function Qe(e) {
			return m(R.geometries[e], Ye);
		}
		function $e(e) {
			for (var t = {
				name: e.getAttribute("name") || "",
				joints: {},
				links: []
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				r.nodeType === 1 && r.nodeName === "technique_common" && nt(r, t);
			}
			R.kinematicsModels[e.getAttribute("id")] = t;
		}
		function et(e) {
			return e.build === void 0 ? e : e.build;
		}
		function tt(e) {
			return m(R.kinematicsModels[e], et);
		}
		function nt(e, t) {
			for (var n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "joint":
						t.joints[r.getAttribute("sid")] = rt(r);
						break;
					case "link": t.links.push(at(r));
				}
			}
		}
		function rt(e) {
			for (var t, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "prismatic":
					case "revolute": t = it(r);
				}
			}
			return t;
		}
		function it(e, t) {
			for (var t = {
				sid: e.getAttribute("sid"),
				name: e.getAttribute("name") || "",
				axis: new j.Vector3(),
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
		function at(e) {
			for (var t = {
				sid: e.getAttribute("sid"),
				name: e.getAttribute("name") || "",
				attachments: [],
				transforms: []
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "attachment_full":
						t.attachments.push(ot(r));
						break;
					case "matrix":
					case "translate":
					case "rotate": t.transforms.push(st(r));
				}
			}
			return t;
		}
		function ot(e) {
			for (var t = {
				joint: e.getAttribute("joint").split("/").pop(),
				transforms: [],
				links: []
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				if (r.nodeType === 1) switch (r.nodeName) {
					case "link":
						t.links.push(at(r));
						break;
					case "matrix":
					case "translate":
					case "rotate": t.transforms.push(st(r));
				}
			}
			return t;
		}
		function st(e) {
			var t = { type: e.nodeName }, n = i(e.textContent);
			switch (t.type) {
				case "matrix":
					t.obj = new j.Matrix4(), t.obj.fromArray(n).transpose();
					break;
				case "translate":
					t.obj = new j.Vector3(), t.obj.fromArray(n);
					break;
				case "rotate": t.obj = new j.Vector3(), t.obj.fromArray(n), t.angle = j.MathUtils.degToRad(n[3]);
			}
			return t;
		}
		function ct(e) {
			for (var t = {
				name: e.getAttribute("name") || "",
				rigidBodies: {}
			}, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				r.nodeType === 1 && r.nodeName === "rigid_body" && (t.rigidBodies[r.getAttribute("name")] = {}, lt(r, t.rigidBodies[r.getAttribute("name")]));
			}
			R.physicsModels[e.getAttribute("id")] = t;
		}
		function lt(e, t) {
			for (var n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				r.nodeType === 1 && r.nodeName === "technique_common" && ut(r, t);
			}
		}
		function ut(e, t) {
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
		function dt(e) {
			for (var t = { bindJointAxis: [] }, n = 0; n < e.childNodes.length; n++) {
				var r = e.childNodes[n];
				r.nodeType === 1 && r.nodeName === "bind_joint_axis" && t.bindJointAxis.push(ft(r));
			}
			R.kinematicsScenes[o(e.getAttribute("url"))] = t;
		}
		function ft(e) {
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
		function pt(e) {
			return e.build === void 0 ? e : e.build;
		}
		function mt(e) {
			return m(R.kinematicsScenes[e], pt);
		}
		function ht() {
			var e = Object.keys(R.kinematicsModels)[0], t = Object.keys(R.kinematicsScenes)[0], n = Object.keys(R.visualScenes)[0];
			if (e === void 0 || t === void 0) return;
			for (var r = tt(e), i = mt(t), a = Nt(n), o = i.bindJointAxis, s = {}, c = 0, l = o.length; c < l; c++) {
				var u = o[c], d = M.querySelector("[sid=\"" + u.target + "\"]");
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
						transforms: gt(t),
						joint: i,
						position: i.zeroPosition
					});
				});
			}
			var m = new j.Matrix4();
			I = {
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
							vt.identity();
							for (var c = 0; c < o.length; c++) {
								var l = o[c];
								if (l.sid && l.sid.indexOf(e) !== -1) switch (r.type) {
									case "revolute":
										vt.multiply(m.makeRotationAxis(a, j.MathUtils.degToRad(t)));
										break;
									case "prismatic":
										vt.multiply(m.makeTranslation(a.x * t, a.y * t, a.z * t));
										break;
									default: console.warn("THREE.DAELoader: Unknown joint type: " + r.type);
								}
								else switch (l.type) {
									case "matrix":
										vt.multiply(l.obj);
										break;
									case "translate":
										vt.multiply(m.makeTranslation(l.obj.x, l.obj.y, l.obj.z));
										break;
									case "scale":
										vt.scale(l.obj);
										break;
									case "rotate": vt.multiply(m.makeRotationAxis(l.obj, l.angle));
								}
							}
							i.matrix.copy(vt), i.matrix.decompose(i.position, i.quaternion, i.scale), s[e].position = t;
						}
					} else console.log("THREE.DAELoader: " + e + " does not exist.");
				}
			};
		}
		function gt(e) {
			for (var t = [], n = M.querySelector("[id=\"" + e.id + "\"]"), r = 0; r < n.childNodes.length; r++) {
				var a = n.childNodes[r];
				if (a.nodeType === 1) switch (a.nodeName) {
					case "matrix":
						var o = i(a.textContent), s = new j.Matrix4().fromArray(o).transpose();
						t.push({
							sid: a.getAttribute("sid"),
							type: a.nodeName,
							obj: s
						});
						break;
					case "translate":
					case "scale":
						var o = i(a.textContent), c = new j.Vector3().fromArray(o);
						t.push({
							sid: a.getAttribute("sid"),
							type: a.nodeName,
							obj: c
						});
						break;
					case "rotate":
						var o = i(a.textContent), c = new j.Vector3().fromArray(o), l = j.MathUtils.degToRad(o[3]);
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
		function _t(e) {
			for (var t = e.getElementsByTagName("node"), n = 0; n < t.length; n++) {
				var r = t[n];
				r.hasAttribute("id") === !1 && r.setAttribute("id", s());
			}
		}
		var vt = new j.Matrix4(), yt = new j.Vector3();
		function bt(e) {
			for (var t = {
				name: e.getAttribute("name") || "",
				type: e.getAttribute("type"),
				id: e.getAttribute("id"),
				sid: e.getAttribute("sid"),
				matrix: new j.Matrix4(),
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
						t.nodes.push(r.getAttribute("id")), bt(r);
						break;
					case "instance_camera":
						t.instanceCameras.push(o(r.getAttribute("url")));
						break;
					case "instance_controller":
						t.instanceControllers.push(xt(r));
						break;
					case "instance_light":
						t.instanceLights.push(o(r.getAttribute("url")));
						break;
					case "instance_geometry":
						t.instanceGeometries.push(xt(r));
						break;
					case "instance_node":
						t.instanceNodes.push(o(r.getAttribute("url")));
						break;
					case "matrix":
						var a = i(r.textContent);
						t.matrix.multiply(vt.fromArray(a).transpose()), t.transforms[r.getAttribute("sid")] = r.nodeName;
						break;
					case "translate":
						var a = i(r.textContent);
						yt.fromArray(a), t.matrix.multiply(vt.makeTranslation(yt.x, yt.y, yt.z)), t.transforms[r.getAttribute("sid")] = r.nodeName;
						break;
					case "rotate":
						var a = i(r.textContent), s = j.MathUtils.degToRad(a[3]);
						t.matrix.multiply(vt.makeRotationAxis(yt.fromArray(a), s)), t.transforms[r.getAttribute("sid")] = r.nodeName;
						break;
					case "scale":
						var a = i(r.textContent);
						t.matrix.scale(yt.fromArray(a)), t.transforms[r.getAttribute("sid")] = r.nodeName;
						break;
					case "extra": break;
					default: console.log(r);
				}
			}
			return Ot(t.id) ? console.warn("THREE.DAELoader: There is already a node with ID %s. Exclude current node from further processing.", t.id) : R.nodes[t.id] = t, t;
		}
		function xt(e) {
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
		function St(e, t) {
			for (var n = [], r = [], i = 0, a, o; i < e.length; i++) {
				var s = e[i], c;
				if (Ot(s)) c = kt(s), Ct(c, t, n);
				else if (Mt(s)) for (var l = R.visualScenes[s].children, a = 0; a < l.length; a++) {
					var u = l[a];
					if (u.type === "JOINT") {
						var c = kt(u.id);
						Ct(c, t, n);
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
			return new j.Skeleton(d, f);
		}
		function Ct(e, t, n) {
			e.traverse(function(e) {
				if (e.isBone === !0) {
					for (var r, i = 0; i < t.length; i++) {
						var a = t[i];
						if (a.name === e.name) {
							r = a.boneInverse;
							break;
						}
					}
					r === void 0 && (r = new j.Matrix4()), n.push({
						bone: e,
						boneInverse: r,
						processed: !1
					});
				}
			});
		}
		function wt(e) {
			for (var t = [], n = e.matrix, r = e.nodes, i = e.type, a = e.instanceCameras, o = e.instanceControllers, s = e.instanceLights, c = e.instanceGeometries, l = e.instanceNodes, u = 0, d = r.length; u < d; u++) t.push(kt(r[u]));
			for (var u = 0, d = a.length; u < d; u++) {
				var f = Le(a[u]);
				f !== null && t.push(f.clone());
			}
			for (var u = 0, d = o.length; u < d; u++) for (var p = o[u], m = le(p.id), h = Qe(m.id), g = Dt(h, p.materials), _ = p.skeletons, v = m.skin.joints, y = St(_, v), b = 0, x = g.length; b < x; b++) {
				var S = g[b];
				S.isSkinnedMesh && (S.bind(y, m.skin.bindMatrix), S.normalizeSkinWeights()), t.push(S);
			}
			for (var u = 0, d = s.length; u < d; u++) {
				var C = He(s[u]);
				C !== null && t.push(C.clone());
			}
			for (var u = 0, d = c.length; u < d; u++) for (var p = c[u], h = Qe(p.id), g = Dt(h, p.materials), b = 0, x = g.length; b < x; b++) t.push(g[b]);
			for (var u = 0, d = l.length; u < d; u++) t.push(kt(l[u]).clone());
			var S;
			if (r.length === 0 && t.length === 1) S = t[0];
			else {
				S = i === "JOINT" ? new j.Bone() : new j.Group();
				for (var u = 0; u < t.length; u++) S.add(t[u]);
			}
			return S.name === "" && (S.name = i === "JOINT" ? e.sid : e.name), S.matrix.copy(n), S.matrix.decompose(S.position, S.quaternion, S.scale), S;
		}
		var Tt = new j.MeshBasicMaterial({ color: 16711935 });
		function Et(e, t) {
			for (var n = [], r = 0, i = e.length; r < i; r++) {
				var a = t[e[r]];
				a === void 0 ? (console.warn("THREE.DAELoader: Material with key %s not found. Apply fallback material.", e[r]), n.push(Tt)) : n.push(je(a));
			}
			return n;
		}
		function Dt(e, t) {
			var n = [];
			for (var r in e) {
				var i = e[r], a = Et(i.materialKeys, t);
				a.length === 0 && (r === "lines" || r === "linestrips" ? a.push(new j.LineBasicMaterial()) : a.push(new j.MeshPhongMaterial()));
				var o = i.data.attributes.skinIndex !== void 0;
				if (o) for (var s = 0, c = a.length; s < c; s++) a[s].skinning = !0;
				var l = a.length === 1 ? a[0] : a, u;
				switch (r) {
					case "lines":
						u = new j.LineSegments(i.data, l);
						break;
					case "linestrips":
						u = new j.Line(i.data, l);
						break;
					case "triangles":
					case "polylist": u = o ? new j.SkinnedMesh(i.data, l) : new j.Mesh(i.data, l);
				}
				n.push(u);
			}
			return n;
		}
		function Ot(e) {
			return R.nodes[e] !== void 0;
		}
		function kt(e) {
			return m(R.nodes[e], wt);
		}
		function At(e) {
			var t = {
				name: e.getAttribute("name"),
				children: []
			};
			_t(e);
			for (var r = n(e, "node"), i = 0; i < r.length; i++) t.children.push(bt(r[i]));
			R.visualScenes[e.getAttribute("id")] = t;
		}
		function jt(e) {
			var t = new j.Group();
			t.name = e.name;
			for (var n = e.children, r = 0; r < n.length; r++) {
				var i = n[r];
				t.add(kt(i.id));
			}
			return t;
		}
		function Mt(e) {
			return R.visualScenes[e] !== void 0;
		}
		function Nt(e) {
			return m(R.visualScenes[e], jt);
		}
		function Pt(e) {
			var t = n(e, "instance_visual_scene")[0];
			return Nt(o(t.getAttribute("url")));
		}
		function Ft() {
			var e = R.clips;
			if (c(e) === !0) {
				if (c(R.animations) === !1) {
					var t = [];
					for (var n in R.animations) for (var r = y(n), i = 0, a = r.length; i < a; i++) t.push(r[i]);
					Ht.push(new j.AnimationClip("default", -1, t));
				}
			} else for (var n in e) Ht.push(re(n));
		}
		function It(e) {
			for (var t = "", n = [e]; n.length;) {
				var r = n.shift();
				r.nodeType === Node.TEXT_NODE ? t += r.textContent : (t += "\n", n.push.apply(n, r.childNodes));
			}
			return t.trim();
		}
		if (e.length === 0) return { scene: new j.Scene() };
		var Lt = new DOMParser().parseFromString(e, "application/xml"), M = n(Lt, "COLLADA")[0], Rt = Lt.getElementsByTagName("parsererror")[0];
		if (Rt !== void 0) {
			var zt = n(Rt, "div")[0], Bt = zt ? zt.textContent : It(Rt);
			return console.error("THREE.DAELoader: Failed to parse collada file.\n", Bt), null;
		}
		var N = M.getAttribute("version");
		console.log("THREE.DAELoader: File version", N);
		var P = l(n(M, "asset")[0]), Vt = new j.TextureLoader(this.manager);
		Vt.setPath(this.resourcePath || t).setCrossOrigin(this.crossOrigin);
		var F;
		Ja && (F = new Ja(this.manager), F.setPath(this.resourcePath || t));
		let Ht = [], I = {}, L = 0, R = {
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
		f(M, "library_animations", "animation", h), f(M, "library_animation_clips", "animation_clip", ne), f(M, "library_controllers", "controller", ie), f(M, "library_images", "image", ue), f(M, "library_effects", "effect", pe), f(M, "library_materials", "material", Oe), f(M, "library_cameras", "camera", Me), f(M, "library_lights", "light", Re), f(M, "library_geometries", "geometry", Ue), f(M, "library_nodes", "node", bt), f(M, "library_visual_scenes", "visual_scene", At), f(M, "library_kinematics_models", "kinematics_model", $e), f(M, "library_physics_models", "physics_model", ct), f(M, "scene", "instance_kinematics_scene", dt), p(R.animations, v), p(R.clips, k), p(R.controllers, A), p(R.images, de), p(R.effects, Ee), p(R.materials, Ae), p(R.cameras, Ie), p(R.lights, Ve), p(R.geometries, Ye), p(R.visualScenes, jt), Ft(), ht();
		var Ut = Pt(n(M, "scene")[0]);
		return P.upAxis === "Z_UP" && Ut.quaternion.setFromEuler(new j.Euler(-Math.PI / 2, 0, 0)), Ut.scale.multiplyScalar(P.unit), {
			animations: Ht,
			kinematics: I,
			library: R,
			scene: Ut
		};
	}
}, Xa = class {
	constructor(e) {
		this._pointer = 0, this._eof = !1, this._data = e;
	}
	next() {
		if (!this.hasNext()) throw this._eof ? Error("Cannot call 'next' after EOF group has been read") : Error("Unexpected end of input: EOF group not read before end of file. Ended on code " + this._data[this._pointer]);
		let e = { code: parseInt(this._data[this._pointer]) };
		return this._pointer++, e.value = Za(e.code, this._data[this._pointer].trim()), this._pointer++, e.code === 0 && e.value === "EOF" && (this._eof = !0), this.lastReadGroup = e, e;
	}
	peek() {
		if (!this.hasNext()) throw this._eof ? Error("Cannot call 'next' after EOF group has been read") : Error("Unexpected end of input: EOF group not read before end of file. Ended on code " + this._data[this._pointer]);
		let e = { code: parseInt(this._data[this._pointer]) };
		return e.value = Za(e.code, this._data[this._pointer + 1].trim()), e;
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
function Za(e, t) {
	return e <= 9 ? t : e >= 10 && e <= 59 ? parseFloat(t) : e >= 60 && e <= 99 ? parseInt(t) : e >= 100 && e <= 109 ? t : e >= 110 && e <= 149 ? parseFloat(t) : e >= 160 && e <= 179 ? parseInt(t) : e >= 210 && e <= 239 ? parseFloat(t) : e >= 270 && e <= 289 ? parseInt(t) : e >= 290 && e <= 299 ? Qa(t) : e >= 300 && e <= 369 ? t : e >= 370 && e <= 389 ? parseInt(t) : e >= 390 && e <= 399 ? t : e >= 400 && e <= 409 ? parseInt(t) : e >= 410 && e <= 419 ? t : e >= 420 && e <= 429 ? parseInt(t) : e >= 430 && e <= 439 ? t : e >= 440 && e <= 459 ? parseInt(t) : e >= 460 && e <= 469 ? parseFloat(t) : e >= 470 && e <= 481 || e === 999 || e >= 1e3 && e <= 1009 ? t : e >= 1010 && e <= 1059 ? parseFloat(t) : e >= 1060 && e <= 1071 ? parseInt(t) : (console.log("WARNING: Group code does not have a defined type: %j", {
		code: e,
		value: t
	}), t);
}
function Qa(e) {
	if (e === "0") return !1;
	if (e === "1") return !0;
	throw TypeError("String '" + e + "' cannot be cast to Boolean type");
}
//#endregion
//#region node_modules/dxf-parser/dist/AutoCadColorIndex.js
var $a = [
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
//#endregion
//#region node_modules/dxf-parser/dist/ParseHelpers.js
function eo(e) {
	return $a[e];
}
function K(e) {
	let t = {};
	e.rewind();
	let n = e.next(), r = n.code;
	if (t.x = n.value, r += 10, n = e.next(), n.code != r) throw Error("Expected code for point value to be " + r + " but got " + n.code + ".");
	return t.y = n.value, r += 10, n = e.next(), n.code == r ? (t.z = n.value, t) : (e.rewind(), t);
}
function to(e, t, n) {
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
			e.colorIndex = t.value, e.color = eo(Math.abs(t.value));
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
//#endregion
//#region node_modules/dxf-parser/dist/entities/3dface.js
var no = class {
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
					n.vertices = ro(e, t), t = e.lastReadGroup;
					break;
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
};
function ro(e, t) {
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
//#endregion
//#region node_modules/dxf-parser/dist/entities/arc.js
var io = class {
	constructor() {
		this.ForEntityName = "ARC";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.center = K(e);
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
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, ao = class {
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
					n.startPoint = K(e);
					break;
				case 11:
					n.endPoint = K(e);
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
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, oo = class {
	constructor() {
		this.ForEntityName = "CIRCLE";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.center = K(e);
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
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, so = class {
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
					n.anchorPoint = K(e);
					break;
				case 11:
					n.middleOfText = K(e);
					break;
				case 12:
					n.insertionPoint = K(e);
					break;
				case 13:
					n.linearOrAngularPoint1 = K(e);
					break;
				case 14:
					n.linearOrAngularPoint2 = K(e);
					break;
				case 15:
					n.diameterOrRadiusPoint = K(e);
					break;
				case 16:
					n.arcPoint = K(e);
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
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, co = class {
	constructor() {
		this.ForEntityName = "ELLIPSE";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.center = K(e);
					break;
				case 11:
					n.majorAxisEndPoint = K(e);
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
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, lo = class {
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
					n.position = K(e);
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
					n.extrusionDirection = K(e);
					break;
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, uo = class {
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
					n.vertices.unshift(K(e));
					break;
				case 11:
					n.vertices.push(K(e));
					break;
				case 210:
					n.extrusionDirection = K(e);
					break;
				case 100: break;
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, fo = class {
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
					n.vertices = po(r, e);
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
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
};
function po(e, t) {
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
//#endregion
//#region node_modules/dxf-parser/dist/entities/mtext.js
var mo = class {
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
					n.position = K(e);
					break;
				case 11:
					n.directionVector = K(e);
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
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, ho = class {
	constructor() {
		this.ForEntityName = "POINT";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.position = K(e);
					break;
				case 39:
					n.thickness = t.value;
					break;
				case 210:
					n.extrusionDirection = K(e);
					break;
				case 100: break;
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, go = class {
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
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, _o = class {
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
					n.extrusionDirection = K(e);
					break;
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n.vertices = vo(e, t), n;
	}
};
function vo(e, t) {
	let n = new go(), r = [];
	for (; !e.isEOF();) if (t.code === 0) {
		if (t.value === "VERTEX") r.push(n.parseEntity(e, t)), t = e.lastReadGroup;
		else if (t.value === "SEQEND") {
			yo(e, t);
			break;
		}
	}
	return r;
}
function yo(e, t) {
	let n = { type: t.value };
	for (t = e.next(); !e.isEOF() && t.code != 0;) to(n, t, e), t = e.next();
	return n;
}
//#endregion
//#region node_modules/dxf-parser/dist/entities/solid.js
var bo = class {
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
					n.points[0] = K(e);
					break;
				case 11:
					n.points[1] = K(e);
					break;
				case 12:
					n.points[2] = K(e);
					break;
				case 13:
					n.points[3] = K(e);
					break;
				case 210:
					n.extrusionDirection = K(e);
					break;
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, xo = class {
	constructor() {
		this.ForEntityName = "SPLINE";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.controlPoints ||= [], n.controlPoints.push(K(e));
					break;
				case 11:
					n.fitPoints ||= [], n.fitPoints.push(K(e));
					break;
				case 12:
					n.startTangent = K(e);
					break;
				case 13:
					n.endTangent = K(e);
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
					n.normalVector = K(e);
					break;
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, So = class {
	constructor() {
		this.ForEntityName = "TEXT";
	}
	parseEntity(e, t) {
		let n = { type: t.value };
		for (t = e.next(); !e.isEOF() && t.code !== 0;) {
			switch (t.code) {
				case 10:
					n.startPoint = K(e);
					break;
				case 11:
					n.endPoint = K(e);
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
				default: to(n, t, e);
			}
			t = e.next();
		}
		return n;
	}
}, q = /* @__PURE__ */ d((/* @__PURE__ */ t(((e, t) => {
	(function(e, n) {
		typeof define == "function" && define.amd ? define(n) : typeof t == "object" && t.exports ? t.exports = n() : e.log = n();
	})(e, function() {
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
q.default.setLevel("error");
function Co(e) {
	e.registerEntityHandler(no), e.registerEntityHandler(io), e.registerEntityHandler(ao), e.registerEntityHandler(oo), e.registerEntityHandler(so), e.registerEntityHandler(co), e.registerEntityHandler(lo), e.registerEntityHandler(uo), e.registerEntityHandler(fo), e.registerEntityHandler(mo), e.registerEntityHandler(ho), e.registerEntityHandler(_o), e.registerEntityHandler(bo), e.registerEntityHandler(xo), e.registerEntityHandler(So);
}
var wo = class {
	constructor() {
		this._entityHandlers = {}, Co(this);
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
		let t = {}, n = 0, r = new Xa(e.split(/\r\n|\r|\n/g));
		if (!r.hasNext()) throw Error("Empty file");
		let i = this, a;
		function o() {
			for (a = r.next(); !r.isEOF();) if (a.code === 0 && a.value === "SECTION") {
				if (a = r.next(), a.code !== 2) {
					console.error("Unexpected code %s after 0:SECTION", Do(a)), a = r.next();
					continue;
				}
				a.value === "HEADER" ? (q.default.debug("> HEADER"), t.header = s(), q.default.debug("<")) : a.value === "BLOCKS" ? (q.default.debug("> BLOCKS"), t.blocks = c(), q.default.debug("<")) : a.value === "ENTITIES" ? (q.default.debug("> ENTITIES"), t.entities = _(!1), q.default.debug("<")) : a.value === "TABLES" ? (q.default.debug("> TABLES"), t.tables = u(), q.default.debug("<")) : a.value === "EOF" ? q.default.debug("EOF") : q.default.warn("Skipping section '%s'", a.value);
			} else a = r.next();
		}
		function s() {
			let e = null, t = null, n = {};
			for (a = r.next();;) {
				if (To(a, 0, "ENDSEC")) {
					e && (n[e] = t);
					break;
				}
				a.code === 9 ? (e && (n[e] = t), e = a.value) : a.code === 10 ? t = { x: a.value } : a.code === 20 ? t.y = a.value : a.code === 30 ? t.z = a.value : t = a.value, a = r.next();
			}
			return a = r.next(), n;
		}
		function c() {
			let e = {};
			for (a = r.next(); a.value !== "EOF" && !To(a, 0, "ENDSEC");) if (To(a, 0, "BLOCK")) {
				q.default.debug("block {");
				let t = l();
				q.default.debug("}"), y(t), t.name ? e[t.name] = t : q.default.error("block with handle \"" + t.handle + "\" is missing a name.");
			} else Eo(a), a = r.next();
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
					default: Eo(a), a = r.next();
				}
				if (To(a, 0, "ENDBLK")) {
					a = r.next();
					break;
				}
			}
			return e;
		}
		function u() {
			let e = {};
			for (a = r.next(); a.value !== "EOF" && !To(a, 0, "ENDSEC");) To(a, 0, "TABLE") ? (a = r.next(), g[a.value] ? (q.default.debug(a.value + " Table {"), e[g[a.value].tableName] = f(a), q.default.debug("}")) : q.default.debug("Unhandled Table " + a.value)) : a = r.next();
			return a = r.next(), e;
		}
		let d = "ENDTAB";
		function f(e) {
			let t = g[e.value], n = {}, i = 0;
			for (a = r.next(); !To(a, 0, d);) switch (a.code) {
				case 5:
					n.handle = a.value, a = r.next();
					break;
				case 330:
					n.ownerHandle = a.value, a = r.next();
					break;
				case 100:
					a.value === "AcDbSymbolTable" || Eo(a), a = r.next();
					break;
				case 70:
					i = a.value, a = r.next();
					break;
				case 0:
					a.value === t.dxfSymbolName ? n[t.tableRecordsProperty] = t.parseTableRecords() : (Eo(a), a = r.next());
					break;
				default: Eo(a), a = r.next();
			}
			let o = n[t.tableRecordsProperty];
			if (o) {
				let e = (() => {
					if (o.constructor === Array) return o.length;
					if (typeof o == "object") return Object.keys(o).length;
				})();
				i !== e && q.default.warn("Parsed " + e + " " + t.dxfSymbolName + "'s but expected " + i);
			}
			return a = r.next(), n;
		}
		function p() {
			let e = [], t = {};
			for (q.default.debug("ViewPort {"), a = r.next(); !To(a, 0, d);) switch (a.code) {
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
					a.value === "VPORT" && (q.default.debug("}"), e.push(t), q.default.debug("ViewPort {"), t = {}, a = r.next());
					break;
				default: Eo(a), a = r.next();
			}
			return q.default.debug("}"), e.push(t), e;
		}
		function m() {
			let e = {}, t = {}, n = 0, i;
			for (q.default.debug("LType {"), a = r.next(); !To(a, 0, "ENDTAB");) switch (a.code) {
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
					q.default.debug("}"), n > 0 && n !== t.pattern.length && q.default.warn("lengths do not match on LTYPE pattern"), e[i] = t, t = {}, q.default.debug("LType {"), a = r.next();
					break;
				default: a = r.next();
			}
			return q.default.debug("}"), e[i] = t, e;
		}
		function h() {
			let e = {}, t = {}, n;
			for (q.default.debug("Layer {"), a = r.next(); !To(a, 0, "ENDTAB");) switch (a.code) {
				case 2:
					t.name = a.value, n = a.value, a = r.next();
					break;
				case 62:
					t.visible = a.value >= 0, t.colorIndex = Math.abs(a.value), t.color = Oo(t.colorIndex), a = r.next();
					break;
				case 70:
					t.frozen = !!(a.value & 1) || !!(a.value & 2), a = r.next();
					break;
				case 0:
					a.value === "LAYER" && (q.default.debug("}"), e[n] = t, q.default.debug("Layer {"), t = {}, n = void 0, a = r.next());
					break;
				default: Eo(a), a = r.next();
			}
			return q.default.debug("}"), e[n] = t, e;
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
					q.default.debug(a.value + " {");
					let n = e.parseEntity(r, a);
					a = r.lastReadGroup, q.default.debug("}"), y(n), t.push(n);
				} else {
					q.default.warn("Unhandled entity " + a.value), a = r.next();
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
function To(e, t, n) {
	return e.code === t && e.value === n;
}
function Eo(e) {
	q.default.debug("unhandled group " + Do(e));
}
function Do(e) {
	return e.code + ":" + e.value;
}
function Oo(e) {
	return $a[e];
}
//#endregion
//#region node_modules/dxf-parser/dist/index.js
var ko = wo, Ao = .001, jo = (e) => {
	let t = 0;
	for (let n of e) {
		let e = Math.abs(Math.fround(n) - n);
		e > t && (t = e);
	}
	return t;
}, Mo = (e) => {
	if (e.length === 0 || jo(e) <= Ao) return null;
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
}, No = (e, t) => t ? e.map((e, n) => e - t[n % 3]) : e, Po = ["POLYLINE", "3DFACE"], Fo = (e) => !!e && Number.isFinite(e.x) && Number.isFinite(e.y) && Number.isFinite(e.z), Io = (e, t) => t.flat().reverse().map((t) => e[t]).flat(), Lo = (e) => {
	let t = [...new Set(e.entities.map((e) => e.type))].filter(Boolean);
	return t.length === 0 ? "This DXF file contains no entities to import." : `No importable geometry found in this DXF file. It contains ${t.sort().join(", ")}, and this importer reads ${Po.join(" and ")} entities. Re-exporting the drawing as a 3D mesh usually resolves this.`;
};
function Ro(e) {
	let t;
	try {
		t = new ko().parseSync(e);
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
			positions: Io(t, n)
		});
	});
	let i = /* @__PURE__ */ new Map();
	if (n.entities.filter((e) => e.type === "3DFACE").forEach((e) => {
		let t = (e.vertices ?? []).filter(Fo);
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
			positions: Io(e, t)
		});
	}), r.length === 0) throw Error(Lo(n));
	let a = Mo(r.flatMap((e) => e.positions));
	return {
		meshes: r.map(({ layer: e, positions: t }) => ({
			layer: e,
			positions: No(t, a)
		})),
		offset: a
	};
}
//#endregion
//#region src/import-handlers/dxf.ts
var zo = (e, t, n) => {
	let r = new De();
	return r.setAttribute("position", new Ee(new Float32Array(e), 3, !1)), t && r.setAttribute("normals", new Ee(new Float32Array(t), 3, !1)), n && r.setAttribute("texCoords", new Ee(new Float32Array(n), 3, !1)), r;
};
function Bo(e) {
	let t = [...ee.getState().materials.values()][0], { meshes: n, offset: r } = e, i = /* @__PURE__ */ new Map();
	n.forEach(({ layer: e, positions: n }, r) => {
		i.has(e) || i.set(e, new D(e));
		let a = zo(n);
		a.computeVertexNormals(), a.setAttribute("normals", a.getAttribute("normal"));
		let o = t, s = new _e(`untitled-${r}`, {
			acousticMaterial: o,
			geometry: a
		});
		i.get(e).add(s);
	});
	let a = new ve("new room", { surfaces: [...i.values()] });
	return r && (a.position.set(r[0], r[1], r[2]), a.updateMatrixWorld(!0), console.info(`DXF coordinates exceed float32 precision; geometry recentred by [${r.map((e) => e.toFixed(3)).join(", ")}] and the offset moved onto the room transform.`)), a;
}
function Vo(e) {
	return Bo(Ro(e));
}
function Ho(e) {
	if (typeof Worker > "u") return Promise.resolve(Vo(e));
	let t;
	try {
		t = new Worker(new URL(
			/* @vite-ignore */
			"/assets/dxf.worker-DxHXVuwj.js",
			"" + import.meta.url
		), { type: "module" });
	} catch {
		return Promise.resolve(Vo(e));
	}
	return new Promise((n, r) => {
		t.addEventListener("message", (e) => {
			t.terminate();
			let i = e.data;
			i.ok ? n(Bo({
				meshes: i.meshes,
				offset: i.offset
			})) : r(Error(i.message));
		}), t.addEventListener("error", (i) => {
			t.terminate();
			try {
				n(Vo(e));
			} catch (e) {
				r(e instanceof Error ? e : Error(String(i.message)));
			}
		}), t.postMessage({ data: e });
	});
}
//#endregion
//#region src/import-handlers/index.ts
function Uo(e) {
	return new ii().parse(e, "/");
}
function Wo(e) {
	return new ri().parse(e);
}
function Go(e) {
	let t = new qa(e).parse(), [n, r, i] = t.models.reduce((e, t) => [
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
			let d = new j.BufferGeometry();
			d.setAttribute("position", new j.BufferAttribute(new Float32Array(c), 3, !1)), l.length > 0 ? d.setAttribute("normals", new j.BufferAttribute(new Float32Array(l), 3, !1)) : (d.computeVertexNormals(), d.setAttribute("normals", d.getAttribute("normal"))), u.length > 0 && d.setAttribute("texCoords", new j.BufferAttribute(new Float32Array(u), 3, !1));
			let f = t.size > 1 ? o : e.name || o;
			a.push({
				name: f,
				geometry: d
			});
		}
	}), a;
}
function Ko(e) {
	let t = new Ya();
	var n = new DOMParser().parseFromString(e, "application/xml");
	return Object.assign(window, { xml: n }), t.parse(e, void 0);
}
function qo(e) {
	return new Promise((t, n) => {
		new Yi().parse(e, "", (e) => {
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
//#endregion
//#region src/common/file-type.ts
var J = {
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
}, Jo = {
	wav: !0,
	stl: !0,
	obj: !0,
	dae: !0,
	dxf: !0,
	glb: !0,
	gltf: !0
}, Yo = {
	html: J.CODE,
	js: J.CODE,
	png: J.IMAGE,
	css: J.CODE,
	txt: J.CODE,
	md: J.CODE,
	lock: J.CODE,
	ts: J.CODE,
	json: J.CODE,
	yml: J.CODE,
	abec: J.TEXT,
	rtf: J.TEXT,
	TXT: J.TEXT,
	dxf: J.FILE,
	pdf: J.PDF,
	vips: J.FILE,
	vacs: J.FILE,
	asc: J.FILE,
	msh: J.TEXT,
	stp: J.FILE,
	jpg: J.IMAGE,
	tmd: J.FILE,
	xls: J.EXCEL,
	skp: J.FILE,
	dae: J.FILE,
	svg: J.CODE,
	res: J.FILE,
	dpr: J.FILE,
	pas: J.FILE,
	dll: J.CODE,
	vsix: J.FILE,
	st: J.FILE,
	ico: J.FILE,
	step: J.FILE,
	py: J.CODE,
	sh: J.CODE,
	FOR: J.CODE,
	o: J.CODE,
	h: J.CODE,
	c: J.CODE,
	scss: J.CODE,
	map: J.CODE,
	cpp: J.CODE,
	mm: J.CODE,
	java: J.CODE,
	m: J.CODE,
	app: J.FILE,
	wav: J.AUDIO,
	sofa: J.FILE,
	bin: J.FILE,
	nib: J.FILE,
	rc: J.FILE,
	sln: J.FILE,
	LGPL: J.FILE,
	hh: J.CODE,
	main: J.CODE,
	cxx: J.CODE,
	dtd: J.CODE,
	cc: J.CODE,
	cu: J.CODE,
	dat: J.CODE,
	f: J.CODE,
	in: J.FILE,
	BSD: J.FILE,
	dox: J.FILE,
	MPL2: J.FILE,
	GPL: J.FILE,
	bz2: J.FILE,
	log: J.FILE,
	4: J.FILE,
	out: J.FILE,
	pc: J.FILE,
	dir: J.FILE,
	make: J.FILE,
	a: J.FILE,
	11: J.FILE,
	lib: J.FILE,
	pdb: J.FILE,
	el: J.FILE,
	toml: J.FILE,
	opts: J.FILE,
	mjs: J.FILE,
	yaml: J.FILE,
	foo: J.FILE,
	0: J.FILE,
	1: J.FILE,
	flow: J.FILE,
	idea: J.FILE,
	xml: J.FILE,
	iml: J.FILE,
	bnf: J.FILE,
	DOCS: J.FILE,
	hbs: J.FILE,
	pick: J.FILE,
	pyc: J.FILE,
	jsx: J.CODE,
	less: J.CODE,
	com: J.FILE,
	php: J.CODE,
	zip: J.FILE,
	csv: J.FILE,
	mp3: J.FILE,
	ttf: J.FILE,
	exe: J.FILE,
	chm: J.FILE,
	ppm: J.FILE,
	toy: J.FILE,
	hpp: J.FILE,
	ac: J.FILE,
	am: J.FILE,
	sub: J.FILE,
	deps: J.FILE,
	Po: J.FILE,
	m4: J.FILE,
	Plo: J.FILE,
	lol: J.FILE,
	err: J.FILE,
	3: J.FILE,
	glsl: J.FILE,
	dSYM: J.FILE,
	hmap: J.FILE,
	d: J.FILE,
	dia: J.FILE,
	doc: J.FILE,
	docx: J.FILE,
	bat: J.FILE,
	iss: J.FILE,
	ui: J.FILE,
	odt: J.FILE,
	bmp: J.FILE,
	PNG: J.FILE,
	stl: J.FILE,
	md3: J.FILE,
	tga: J.FILE,
	ply: J.FILE,
	obj: J.FILE,
	mtl: J.FILE,
	md2: J.FILE,
	"3d": J.FILE,
	uc: J.FILE,
	pmx: J.FILE,
	jpeg: J.IMAGE,
	"7z": J.FILE,
	mdl: J.FILE,
	MDL: J.FILE,
	ase: J.FILE,
	nff: J.FILE,
	mat: J.FILE,
	NFF: J.FILE,
	fbx: J.FILE,
	b3d: J.FILE,
	pk3: J.FILE,
	lws: J.FILE,
	JPG: J.FILE,
	lwo: J.FILE,
	m3: J.FILE,
	"3DS": J.FILE,
	"3ds": J.FILE,
	x3d: J.FILE,
	hmp: J.FILE,
	x: J.FILE,
	mdc: J.FILE,
	amf: J.FILE,
	glb: J.FILE,
	gltf: J.FILE,
	frag: J.FILE,
	vert: J.FILE,
	ogex: J.FILE,
	ASE: J.FILE,
	FBX: J.FILE,
	DAE: J.FILE,
	smd: J.FILE,
	off: J.FILE,
	raw: J.FILE,
	zgl: J.FILE,
	xgl: J.FILE,
	bvh: J.FILE,
	STL: J.FILE,
	max: J.FILE,
	q3o: J.FILE,
	q3s: J.FILE,
	ter: J.FILE,
	lxo: J.FILE,
	ms3d: J.FILE,
	"3mf": J.FILE,
	csm: J.FILE,
	sib: J.FILE,
	irr: J.FILE,
	X: J.FILE,
	WRL: J.FILE,
	wrl: J.FILE,
	ifc: J.FILE,
	cob: J.FILE,
	inl: J.FILE,
	asm: J.FILE,
	adb: J.FILE,
	ads: J.FILE,
	gpr: J.FILE,
	mak: J.FILE,
	cs: J.FILE,
	def: J.FILE,
	S: J.FILE,
	pk: J.FILE,
	msc: J.FILE,
	686: J.FILE,
	bor: J.FILE,
	gcc: J.FILE,
	keep: J.FILE,
	pump: J.FILE,
	hlsl: J.FILE,
	xib: J.FILE,
	pch: J.FILE,
	exp: J.FILE,
	tpl: J.FILE,
	mk: J.FILE,
	i: J.FILE,
	rst: J.FILE,
	sty: J.FILE,
	f03: J.FILE,
	pl: J.FILE,
	dft: J.FILE,
	rdft: J.FILE,
	texi: J.FILE,
	eps: J.FILE,
	bfnn: J.FILE,
	refs: J.FILE,
	info: J.FILE,
	fig: J.FILE,
	tex: J.FILE,
	ml: J.FILE,
	mli: J.FILE,
	pde: J.FILE,
	hs: J.FILE,
	ipch: J.FILE,
	r: J.FILE,
	vst3: J.FILE,
	vst: J.FILE,
	room: J.FILE,
	icns: J.FILE,
	std: J.FILE,
	gyp: J.FILE,
	node: J.FILE,
	gypi: J.FILE,
	conf: J.FILE,
	targ: J.FILE,
	lcov: J.FILE,
	snyk: J.FILE,
	"md~": J.FILE,
	crt: J.FILE,
	key: J.FILE,
	bak: J.FILE,
	tar: J.FILE,
	jade: J.FILE,
	cmd: J.FILE,
	name: J.FILE,
	MIT: J.FILE,
	tgz: J.FILE,
	jst: J.FILE,
	gz: J.FILE,
	test: J.FILE,
	tmpl: J.FILE,
	file: J.FILE,
	tlog: J.FILE,
	vs: J.FILE,
	suo: J.FILE,
	mov: J.VIDEO,
	db: J.FILE,
	user: J.FILE,
	htm: J.FILE,
	mode: J.FILE,
	pug: J.FILE,
	psd: J.FILE,
	asar: J.FILE,
	pak: J.FILE,
	snap: J.FILE,
	eot: J.FILE,
	woff: J.FILE,
	geo: J.FILE,
	finc: J.FILE,
	f90: J.FILE,
	F90: J.FILE,
	md5: J.FILE,
	swf: J.FILE,
	tail: J.FILE,
	stat: J.FILE,
	ejs: J.FILE,
	priv: J.FILE,
	pem: J.FILE,
	pub: J.FILE,
	bar: J.FILE,
	wmf: J.FILE,
	cfg: J.FILE,
	tsx: J.FILE,
	cert: J.FILE,
	"un~": J.FILE,
	9: J.FILE,
	8: J.FILE,
	ls: J.FILE,
	uniq: J.FILE,
	gv: J.FILE,
	ps: J.FILE,
	env: J.FILE,
	keys: J.FILE,
	so: J.FILE,
	pac: J.FILE,
	erb: J.FILE,
	idl: J.FILE,
	omit: J.FILE,
	mkd: J.FILE,
	data: J.FILE,
	wasm: J.FILE,
	gif: J.FILE,
	lint: J.FILE,
	io: J.FILE,
	tags: J.FILE,
	jsm: J.FILE,
	rdoc: J.FILE,
	sage: J.FILE,
	tsv: J.FILE,
	rt: J.FILE,
	dmg: J.FILE,
	otf: J.FILE,
	scpt: J.FILE,
	jxa: J.FILE,
	mkb: J.FILE,
	icf: J.FILE,
	kbd: J.FILE,
	ini: J.FILE,
	docs: J.FILE,
	spec: J.FILE,
	rb: J.FILE,
	po: J.FILE,
	pot: J.FILE,
	LIB: J.FILE,
	l: J.FILE,
	y: J.FILE,
	"c++": J.FILE,
	"h++": J.FILE,
	"2/m4": J.FILE,
	asv: J.FILE,
	p: J.FILE,
	mid: J.FILE,
	12: J.FILE,
	10: J.FILE,
	"js~": J.FILE,
	remy: J.FILE,
	get: J.FILE,
	cnf: J.FILE,
	cub: J.FILE,
	wxs: J.FILE,
	swp: J.FILE,
	blob: J.FILE,
	pyd: J.FILE,
	pyx: J.FILE,
	vtu: J.FILE,
	mph: J.FILE,
	egg: J.FILE,
	mo: J.FILE,
	ogg: J.AUDIO,
	aac: J.AUDIO,
	asd: J.FILE,
	7: J.FILE,
	vrt: J.FILE,
	mp4: J.VIDEO,
	gpu: J.FILE,
	htc: J.FILE,
	item: J.FILE,
	base: J.FILE,
	npy: J.FILE,
	py3: J.CODE,
	pb: J.FILE,
	h5: J.FILE,
	tif: J.FILE,
	go: J.CODE,
	bats: J.CODE,
	fish: J.FILE,
	aiff: J.FILE,
	rej: J.FILE,
	orig: J.FILE,
	gnu: J.FILE,
	sql: J.CODE,
	wat: J.CODE,
	rs: J.CODE
};
function Xo(e) {
	return e.split(".").slice(-1)[0];
}
var Zo = {
	ICONS: J,
	assoc: Yo,
	allowed: Jo,
	fileType: Xo
};
//#endregion
//#region src/lib/registerHandlers.ts
function Qo(e, t = h) {
	let n = t;
	n.addMessageHandler("GET_SELECTED_OBJECTS", () => e.state.selectedObjects), n.addMessageHandler("GET_SELECTED_OBJECT_TYPES", () => e.state.selectedObjects.map((e) => e.kind)), n.addMessageHandler("FETCH_ROOMS", () => {
		let t = Object.keys(e.state.containers).filter((t) => e.state.containers[t].kind === "room");
		if (t && t.length > 0) return t.map((t) => e.state.containers[t]);
	}), n.addMessageHandler("FETCH_CONTAINER", (t, ...n) => n && n[0] && e.state.containers[n[0]]), n.addMessageHandler("FETCH_ALL_MATERIALS", () => e.state.materials), n.addMessageHandler("SEARCH_ALL_MATERIALS", (t, ...n) => e.state.materialSearcher.search(n[0])), n.addMessageHandler("SHOULD_ADD_RAYTRACER", async (t, ...n) => {
		let r = await ni("ray-tracer", e, (n && n[0] || {})[0]);
		return e.state.solvers[r.uuid] = r, a("ADD_RAYTRACER", r), r;
	}), n.addMessageHandler("SHOULD_ADD_IMAGE_SOURCE", async (t, ...n) => {
		let r = await ni("image-source", e);
		return e.state.solvers[r.uuid] = r, a("ADD_IMAGESOURCE", r), r;
	}), n.addMessageHandler("SHOULD_REMOVE_SOLVER", (t, n) => {
		e.state.solvers && e.state.solvers[n] && (e.state.solvers[n].dispose(), delete e.state.solvers[n], a("REMOVE_RAYTRACER", n));
	}), n.addMessageHandler("SHOULD_ADD_RT60", async (t, ...n) => {
		let r = await ni("rt60", e);
		return e.state.solvers[r.uuid] = r, a("ADD_RT60", r), r;
	}), n.addMessageHandler("SHOULD_ADD_ENERGYDECAY", async (t, ...n) => {
		let r = await ni("energydecay", e);
		return e.state.solvers[r.uuid] = r, a("ADD_ENERGYDECAY", r), r;
	}), n.addMessageHandler("SHOULD_ADD_BEAMTRACE", async (t, ...n) => {
		let r = await ni("beam-trace", e);
		return e.state.solvers[r.uuid] = r, a("ADD_BEAMTRACE", r), r;
	}), n.addMessageHandler("SHOULD_ADD_FDTD_2D", async (t, ...n) => {
		let r = await ni("fdtd-2d", e);
		return e.state.solvers[r.uuid] = r, a("ADD_FDTD_2D", r), r;
	}), n.addMessageHandler("SHOULD_ADD_ART", async (t, ...n) => {
		let r = await ni("art", e);
		return e.state.solvers[r.uuid] = r, a("ADD_ART", r), r;
	}), n.addMessageHandler("SHOULD_ADD_ARD", async (t, ...n) => {
		let r = await ni("ard", e);
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
		let i = new Vr("new source"), o = !0;
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
		let i = new qr("new receiver"), o = !0;
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
			if (Jo[Xo(t.name)]) {
				let r = URL.createObjectURL(t);
				switch (Xo(t.name)) {
					case "dxf":
						{
							let e = await (await fetch(r)).text();
							try {
								let t = await Ho(e);
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
							let i = await (await fetch(r)).text(), o = Go(i);
							console.log(o);
							let s = o.map((t) => new _e(t.name, {
								geometry: t.geometry,
								acousticMaterial: e.state.materials[0]
							})), c = new ve("new room", {
								surfaces: s,
								originalFileName: t.name,
								originalFileData: i
							});
							e.state.containers[c.uuid] = c, e.state.renderer.addRoom(c), a("ADD_ROOM", c), n.postMessage("ADDED_ROOM", c);
						}
						break;
					case "stl":
						{
							let t = new Zr("new model", { bufferGeometry: Wo(await (await fetch(r)).arrayBuffer()) });
							e.state.containers[t.uuid] = t, e.state.renderer.addModel(t), n.postMessage("ADDED_MODEL", t);
						}
						break;
					case "dae":
						{
							let e = Ko(await (await fetch(r)).text());
							console.log(e);
						}
						break;
					case "3ds":
						{
							console.log("load 3ds");
							let e = Uo(await (await fetch(r)).arrayBuffer());
							console.log(e);
						}
						break;
					case "glb":
					case "gltf":
						{
							let t = await qo(await (await fetch(r)).arrayBuffer());
							for (let r of t) {
								let t = new Zr(r.name || "imported model", { bufferGeometry: r.geometry });
								e.state.containers[t.uuid] = t, e.state.renderer.addModel(t), n.postMessage("ADDED_MODEL", t);
							}
						}
						break;
					case "wav": try {
						let e = await (await fetch(r)).arrayBuffer();
						new AudioContext().decodeAudioData(e, (e) => {
							let r = [];
							for (let t = 0; t < e.numberOfChannels; t++) r.push(e.getChannelData(t));
							let i = new Qr({
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
				if (r && r instanceof _e) return r;
			}
			return null;
		}).filter((e) => e);
	}), n.addMessageHandler("ASSIGN_MATERIAL", (t, i) => {
		let a = 0, o = [];
		for (let t = 0; t < e.state.selectedObjects.length; t++) e.state.selectedObjects[t] instanceof _e && (o.push({
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
		if (me[n[0]]) {
			e.state.editorMode = me[n[0]];
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
			if (n instanceof _e) {
				let t = new $r({
					normal: n._triangles[0].getNormal(new j.Vector3()),
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
						let e = new Vr("new source", { ...t }).restore(t);
						n.postMessage("SHOULD_ADD_SOURCE", e, !1);
					}
					break;
				case "receiver":
					{
						let e = new qr("new receiver", { ...t }).restore(t);
						n.postMessage("SHOULD_ADD_RECEIVER", e, !1);
					}
					break;
				case "room": {
					let n = new ve(t.name || "room").restore(t);
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
//#endregion
//#region src/objects/events.ts
function $o() {
	n("REMOVE_CONTAINERS", (e) => {
		let t = k.getState().containers, n = typeof e == "string" ? [e] : e;
		n.forEach((e) => t[e].dispose()), k.getState().set((e) => {
			e.containers = l(n, t);
		});
	});
	let e = (e, t) => new e().restore(t);
	n("RESTORE_CONTAINERS", (t) => {
		a("REMOVE_CONTAINERS", ce()), t.forEach((t) => {
			switch (t.kind) {
				case "source":
					a("ADD_SOURCE", e(Vr, t));
					break;
				case "receiver":
					a("ADD_RECEIVER", e(qr, t));
					break;
				case "room": a("ADD_ROOM", e(ve, t));
			}
		});
	}), n("DESELECT_ALL_OBJECTS", () => {
		k.getState().set((e) => {
			Object.keys(e.containers).forEach((t) => {
				e.containers[t].deselect();
			}), e.selectedObjects.clear();
		});
	}), n("SET_SELECTION", (e) => {
		k.getState().set((t) => {
			for (let e of t.selectedObjects) e.deselect();
			t.selectedObjects.clear(), e.forEach((e) => {
				let n = t.containers[e.uuid];
				n && (n.select(), t.selectedObjects.add(n));
			}), t.version++;
		}), se.setScope("EDITOR"), a("RENDER", void 0);
	}), n("APPEND_SELECTION", (e) => {
		se.setScope("EDITOR"), k.getState().set((t) => {
			e.forEach((e) => {
				e.select(), t.selectedObjects.add(e);
			});
		}), a("RENDER", void 0);
	}), n("TOGGLE_CONTAINER_VISIBLE", (e) => {
		k.getState().set((t) => {
			let n = t.containers[e];
			n && (n.visible = !n.visible, t.version++);
		}), a("RENDER", void 0);
	});
}
//#endregion
//#region src/compute/events.ts
async function es(e, t) {
	switch (e) {
		case "ray-tracer": {
			let { default: e } = await import("./raytracer-Dsq8Xbb8.mjs");
			return new e(t).restore(t);
		}
		case "rt60": {
			let { default: e } = await import("./rt-CClhSnYv.mjs");
			return new e().restore(t);
		}
		case "art": {
			let { default: e } = await import("./art-D_zKa082.mjs");
			return new e(t).restore(t);
		}
		case "image-source": {
			let { default: e } = await import("./image-source-BKcn7KMM.mjs");
			return new e(t).restore(t);
		}
		case "beam-trace": {
			let { BeamTraceSolver: e } = await import("./beam-trace-B15Lw-u4.mjs");
			return new e().restore(t);
		}
		case "ard": {
			let { default: e } = await import("./ard-B6Fwh4Pm.mjs");
			return new e(t).restore(t);
		}
		default: throw Error(`Unknown solver kind: ${e}`);
	}
}
function ts() {
	import("./events-CCpKzQBF.mjs").then((e) => e.default()), n("LOG_SOLVER", (e) => {
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
			let e = await es(t.kind, t);
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
//#endregion
//#region src/compute/auto-calculate.ts
var ns = 300, rs = null, is = !1, as = !1, os = [
	"beam-trace",
	"rt60",
	"art"
];
function ss() {
	let { solvers: e } = f.getState();
	return Object.values(e).filter((e) => os.includes(e.kind));
}
function cs() {
	if (as || is) return;
	let e = ss();
	e.length !== 0 && (as = !0, a("SHOW_AUTO_CALC_PROGRESS", {
		message: "Auto-calculating...",
		solverCount: e.length
	}));
}
function ls() {
	if (is) return;
	let e = ss();
	e.length === 0 ? as && (as = !1, a("HIDE_AUTO_CALC_PROGRESS", void 0)) : (is = !0, requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			try {
				e.forEach((e) => {
					e.calculate(), e.kind === "beam-trace" && a("BEAMTRACE_CALCULATE_COMPLETE", e.uuid);
				});
			} finally {
				is = !1, as = !1, a("HIDE_AUTO_CALC_PROGRESS", void 0);
			}
		});
	}));
}
function us() {
	cs(), rs && clearTimeout(rs), rs = setTimeout(() => {
		rs = null, ls();
	}, ns);
}
function ds() {
	return A.getState().autoCalculate;
}
function fs() {
	!is && ds() && us();
}
function ps() {
	g("SURFACE_SET_PROPERTY", fs), g("ROOM_SET_PROPERTY", fs), g("SOURCE_SET_PROPERTY", fs), g("RECEIVER_SET_PROPERTY", fs), [
		"RAYTRACER_SET_PROPERTY",
		"RT60_SET_PROPERTY",
		"FDTD2D_SET_PROPERTY",
		"IMAGESOURCE_SET_PROPERTY",
		"ART_SET_PROPERTY",
		"BEAMTRACE_SET_PROPERTY",
		"ENERGYDECAY_SET_PROPERTY"
	].forEach((e) => {
		g(e, (e) => {
			e?.property !== "autoCalculate" && fs();
		});
	}), n("AUTO_CALCULATE_TRIGGER", () => {
		ls();
	});
}
//#endregion
//#region src/events.ts
function ms() {
	$o(), ts(), ps();
}
//#endregion
//#region src/common/browser-report.ts
function hs(e) {
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
//#endregion
//#region src/lib/init.ts
var gs = {};
ae.forEach((e) => {
	gs[e.uuid] = e;
});
var _s = JSON.parse(w.getItem("layout") || T);
Qo({
	state: {
		leftPanelInitialSize: _s.leftPanelInitialSize,
		bottomPanelInitialSize: _s.bottomPanelInitialSize,
		rightPanelInitialSize: _s.rightPanelInitialSize,
		rightPanelTopInitialSize: _s.rightPanelTopInitialSize,
		audiofiles: {},
		time: 0,
		selectedObjects: [],
		materialsIndex: gs,
		materials: ae,
		materialSearcher: new ue(ae, { keySelector: (e) => e.material }),
		sources: [],
		receivers: [],
		containers: {},
		constructions: {},
		sketches: {},
		solvers: {},
		renderer: E,
		editorMode: me.OBJECT,
		currentProcess: b.NONE,
		browser: hs(navigator.userAgent)
	},
	messenger: h,
	meta: { version: "0.2.1" }
}, h), ms(), console.log("[CRAM] Library mode initialized");
//#endregion
//#region src/common/dayt.ts
function vs(e) {
	return new Date(e).toString().split(/\s+/gim).slice(1, 5).join(" ");
}
//#endregion
//#region src/components/ImportDialog.tsx
var ys = [
	"rgba(255,0,0,.2)",
	"rgba(0,0,0,0)",
	"rgba(0,255,0,.2)"
], bs = (e) => {
	let t = document.querySelector("#temp-file-import") || document.createElement("input");
	t.type = "file", t.setAttribute("style", "display: none;"), t.setAttribute("id", "temp-file-import"), document.body.appendChild(t), t.addEventListener("change", (n) => {
		let r = n.target;
		r && r.files && e(Array.from(r.files)), t.remove();
	}), t.click();
};
function xs() {
	let [e, t] = L(1), [n, r] = L([]), { importDialogVisible: i, set: a } = A(M((e) => c(["importDialogVisible", "set"], e))), o = () => {
		a((e) => {
			e.importDialogVisible = !1;
		});
	};
	return /* @__PURE__ */ V(Ut, {
		open: i,
		onClose: o,
		transitionDuration: 0,
		maxWidth: "sm",
		fullWidth: !0,
		sx: { "& .MuiDialog-paper": { minWidth: "350px" } },
		children: [
			/* @__PURE__ */ B(Kt, { children: "Import" }),
			/* @__PURE__ */ V(Gt, {
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
				children: [/* @__PURE__ */ B("div", {
					style: { backgroundColor: ys[e] },
					className: "drop-zone",
					onClick: () => bs((e) => {
						r(e), t(1);
					}),
					children: /* @__PURE__ */ B("div", {
						style: {
							color: "gray",
							fontSize: "12pt",
							width: "100%",
							textAlign: "center"
						},
						children: "Drag files or click to browse"
					})
				}), n.length > 0 && /* @__PURE__ */ B(nn, {
					component: Zt,
					sx: { mt: 2 },
					children: /* @__PURE__ */ V($t, {
						size: "small",
						children: [/* @__PURE__ */ B(rn, { children: /* @__PURE__ */ V(an, { children: [
							/* @__PURE__ */ B(tn, { children: ".ico" }),
							/* @__PURE__ */ B(tn, { children: "name" }),
							/* @__PURE__ */ B(tn, { children: "last-modified" }),
							/* @__PURE__ */ B(tn, { children: "valid" })
						] }) }), /* @__PURE__ */ B(en, { children: n.map((e, t) => {
							let n = e.name.split(".").slice(-1)[0];
							return /* @__PURE__ */ V(an, {
								hover: !0,
								children: [
									/* @__PURE__ */ B(tn, { children: /* @__PURE__ */ B("div", { className: "icon " + (Zo.assoc[n] || Zo.ICONS.FILE) }) }),
									/* @__PURE__ */ B(tn, { children: e.name }),
									/* @__PURE__ */ B(tn, { children: vs(e.lastModified) }),
									/* @__PURE__ */ B(tn, { children: Zo.allowed[n] ? "✓" : "x" })
								]
							}, e.name + t);
						}) })]
					})
				})]
			}),
			/* @__PURE__ */ V(Wt, { children: [/* @__PURE__ */ B(R, {
				onClick: o,
				children: "Cancel"
			}), /* @__PURE__ */ B(R, {
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
	A.getState().set((t) => {
		t.importDialogVisible = e;
	});
});
//#endregion
//#region src/components/SaveDialog.tsx
var Ss = () => {
	let { projectName: e, saveDialogVisible: t, set: n } = A(M((e) => c([
		"projectName",
		"saveDialogVisible",
		"set"
	], e))), [r, i] = L(e), o = () => {
		n((e) => {
			e.saveDialogVisible = !1;
		});
	};
	return /* @__PURE__ */ V(Ut, {
		open: t,
		onClose: o,
		transitionDuration: 100,
		maxWidth: "sm",
		fullWidth: !0,
		children: [
			/* @__PURE__ */ B(Kt, { children: "Save Project" }),
			/* @__PURE__ */ B(Gt, { children: /* @__PURE__ */ B(on, {
				autoFocus: !0,
				margin: "dense",
				label: "File name",
				type: "text",
				fullWidth: !0,
				variant: "outlined",
				value: r,
				onChange: (e) => i(e.target.value)
			}) }),
			/* @__PURE__ */ V(Wt, { children: [/* @__PURE__ */ B(R, {
				onClick: o,
				children: "Cancel"
			}), /* @__PURE__ */ B(R, {
				variant: "contained",
				color: "success",
				onClick: () => {
					a("SAVE", o);
				},
				children: "Save"
			})] })
		]
	});
}, Cs = {
	display: "flex",
	justifyContent: "space-between"
}, ws = {
	display: "flex",
	justifyContent: "space-between"
}, Ts = { minWidth: "10px" };
function Es(e) {
	let t = e.hotkey.join("");
	return /* @__PURE__ */ V(H, {
		sx: Cs,
		children: [/* @__PURE__ */ B("div", { children: e.text }), /* @__PURE__ */ B(H, {
			sx: ws,
			children: e.hotkey.map((n, r) => /* @__PURE__ */ B(H, {
				component: "span",
				sx: Ts,
				children: n
			}, t + e.text + String(r)))
		})]
	});
}
//#endregion
//#region src/constants/characters.ts
var Ds = {
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
}, Os = Lt((e) => ({
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
})), ks = {
	textTransform: "none",
	minWidth: "auto",
	px: 1.5,
	py: .25,
	fontSize: "9pt",
	color: "text.primary",
	"&:hover": { backgroundColor: "action.hover" }
}, As = {
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
function js(t) {
	let { closeMenu: n } = Os();
	return /* @__PURE__ */ B(fn, {
		onClick: () => {
			e(t.message), n();
		},
		disabled: t.disabled,
		children: /* @__PURE__ */ B(Es, {
			text: t.label,
			hotkey: t.hotkey || [""]
		})
	});
}
var Ms = ({ label: e, hotkey: t, disabled: n, event: r, args: i }) => {
	let { closeMenu: o } = Os();
	return /* @__PURE__ */ B(fn, {
		onClick: () => {
			a(r, i), o();
		},
		disabled: n,
		children: /* @__PURE__ */ B(Es, {
			text: e,
			hotkey: t || [""]
		})
	});
};
function Ns() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = Os(), i = e === "file";
	return /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B(ln, {
		size: "small",
		sx: ks,
		onClick: (e) => {
			n("file", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "File"
	}), /* @__PURE__ */ V(dn, {
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
		slotProps: { paper: As },
		children: [
			/* @__PURE__ */ B(Ms, {
				label: "New",
				event: "NEW",
				hotkey: [Ds.SHIFT, "N"]
			}),
			/* @__PURE__ */ B(Ms, {
				label: "Open",
				event: "OPEN",
				hotkey: [Ds.COMMAND, "O"]
			}),
			/* @__PURE__ */ B(Ms, {
				label: "Save",
				event: "SAVE",
				hotkey: [Ds.COMMAND, "S"]
			}),
			/* @__PURE__ */ B(pn, {}),
			/* @__PURE__ */ B(Ms, {
				label: "Import",
				event: "SHOW_IMPORT_DIALOG",
				args: !0,
				hotkey: [Ds.COMMAND, "I"]
			})
		]
	})] });
}
function Ps() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = Os(), i = e === "edit";
	return /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B(ln, {
		size: "small",
		sx: ks,
		onClick: (e) => {
			n("edit", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "Edit"
	}), /* @__PURE__ */ V(dn, {
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
		slotProps: { paper: As },
		children: [
			/* @__PURE__ */ B(js, {
				label: "Undo",
				message: "UNDO",
				hotkey: [Ds.COMMAND, "Z"],
				disabled: !0
			}),
			/* @__PURE__ */ B(js, {
				label: "Redo",
				message: "REDO",
				hotkey: [
					Ds.SHIFT,
					Ds.COMMAND,
					"Z"
				],
				disabled: !0
			}),
			/* @__PURE__ */ B(pn, {}),
			/* @__PURE__ */ B(js, {
				label: "Duplicate",
				message: "SHOULD_DUPLICATE_SELECTED_OBJECTS",
				hotkey: [Ds.SHIFT, "D"],
				disabled: !0
			}),
			/* @__PURE__ */ B(pn, {}),
			/* @__PURE__ */ B(js, {
				label: "Cut",
				message: "CUT",
				hotkey: [Ds.COMMAND, "X"],
				disabled: !0
			}),
			/* @__PURE__ */ B(js, {
				label: "Copy",
				message: "COPY",
				hotkey: [Ds.COMMAND, "C"],
				disabled: !0
			}),
			/* @__PURE__ */ B(js, {
				label: "Paste",
				message: "PASTE",
				hotkey: [Ds.COMMAND, "V"],
				disabled: !0
			})
		]
	})] });
}
function Fs() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = Os(), i = e === "add";
	return /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B(ln, {
		size: "small",
		sx: ks,
		onClick: (e) => {
			n("add", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "Add"
	}), /* @__PURE__ */ V(dn, {
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
		slotProps: { paper: As },
		children: [
			/* @__PURE__ */ B(js, {
				label: "Source",
				message: "SHOULD_ADD_SOURCE"
			}),
			/* @__PURE__ */ B(js, {
				label: "Receiver",
				message: "SHOULD_ADD_RECEIVER"
			}),
			/* @__PURE__ */ B(pn, {}),
			/* @__PURE__ */ B(js, {
				label: "Sketch",
				message: "SHOULD_ADD_SKETCH",
				disabled: !0
			}),
			/* @__PURE__ */ B(pn, {}),
			/* @__PURE__ */ B(js, {
				label: "Ray Tracer",
				message: "SHOULD_ADD_RAYTRACER"
			}),
			/* @__PURE__ */ B(js, {
				label: "Image Source",
				message: "SHOULD_ADD_IMAGE_SOURCE"
			}),
			/* @__PURE__ */ B(Ms, {
				label: "Beam Tracer",
				event: "SHOULD_ADD_BEAMTRACE"
			}),
			/* @__PURE__ */ B(Ms, {
				label: "2D-FDTD",
				event: "ADD_FDTD_2D"
			}),
			/* @__PURE__ */ B(js, {
				label: "Statistical RT",
				message: "SHOULD_ADD_RT60"
			}),
			/* @__PURE__ */ B(js, {
				label: "Energy Decay",
				message: "SHOULD_ADD_ENERGYDECAY"
			}),
			/* @__PURE__ */ B(Ms, {
				label: "Acoustic Radiance Transfer",
				event: "ADD_ART"
			}),
			/* @__PURE__ */ B(Ms, {
				label: "Adaptive Rectangular Decomposition",
				event: "ADD_ARD"
			})
		]
	})] });
}
function Is() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = Os(), i = e === "view";
	return /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B(ln, {
		size: "small",
		sx: ks,
		onClick: (e) => {
			n("view", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "View"
	}), /* @__PURE__ */ V(dn, {
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
		slotProps: { paper: As },
		children: [
			/* @__PURE__ */ B(js, {
				label: "Clear Local Storage",
				message: "CLEAR_LOCAL_STORAGE"
			}),
			/* @__PURE__ */ B(js, {
				label: "Toggle Renderer Stats",
				message: "TOGGLE_RENDERER_STATS_VISIBLE"
			}),
			/* @__PURE__ */ B(Ms, {
				label: "Toggle Results Panel",
				event: "TOGGLE_RESULTS_PANEL",
				hotkey: [Ds.SHIFT, "R"]
			}),
			/* @__PURE__ */ B(pn, {}),
			/* @__PURE__ */ B(Ms, {
				label: "Reset Layout",
				event: "RESET_LAYOUT"
			})
		]
	})] });
}
function Ls() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = Os(), i = e === "tools";
	return /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B(ln, {
		size: "small",
		sx: ks,
		onClick: (e) => {
			n("tools", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "Tools"
	}), /* @__PURE__ */ V(dn, {
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
		slotProps: { paper: As },
		children: [/* @__PURE__ */ B(js, {
			label: "CLF Viewer",
			message: "OPEN_CLF_VIEWER"
		}), /* @__PURE__ */ B(js, {
			label: "Image Source Test",
			message: "SHOULD_ADD_IMAGE_SOURCE"
		})]
	})] });
}
function Rs() {
	let { openMenu: e, anchorEl: t, openMenuWithAnchor: n, closeMenu: r } = Os(), i = e === "examples";
	return /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B(ln, {
		size: "small",
		sx: ks,
		onClick: (e) => {
			n("examples", e.currentTarget);
		},
		"aria-haspopup": "true",
		"aria-expanded": i,
		children: "Examples"
	}), /* @__PURE__ */ V(dn, {
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
		slotProps: { paper: As },
		children: [
			/* @__PURE__ */ B(Ms, {
				label: "Shoebox",
				event: "OPEN_EXAMPLE",
				args: "shoebox"
			}),
			/* @__PURE__ */ B(Ms, {
				label: "Concord",
				event: "OPEN_EXAMPLE",
				args: "concord"
			}),
			/* @__PURE__ */ B(Ms, {
				label: "Auditorium",
				event: "OPEN_EXAMPLE",
				args: "auditorium"
			})
		]
	})] });
}
var zs = () => {
	let e = A((e) => e.projectName);
	return /* @__PURE__ */ B(H, {
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
}, Bs = {
	height: "var(--main-nav_bar__height)",
	minHeight: "var(--main-nav_bar__height)",
	backgroundColor: "background.paper",
	color: "text.primary",
	boxShadow: "none",
	borderBottom: "1px solid",
	borderColor: "divider"
}, Vs = {
	minHeight: "var(--main-nav_bar__height) !important",
	height: "var(--main-nav_bar__height)",
	px: 1,
	display: "flex",
	justifyContent: "space-between"
}, Hs = {
	display: "flex",
	alignItems: "center",
	height: "var(--main-nav_bar__height)",
	flex: 1
}, Us = {
	fontSize: "12pt",
	fontWeight: 500,
	mr: 1
};
function Ws() {
	return /* @__PURE__ */ B(sn, {
		position: "static",
		sx: Bs,
		children: /* @__PURE__ */ V(cn, {
			disableGutters: !0,
			sx: Vs,
			children: [
				/* @__PURE__ */ V(H, {
					sx: Hs,
					children: [
						/* @__PURE__ */ B(H, {
							sx: Us,
							children: "cram"
						}),
						/* @__PURE__ */ B(pn, {
							orientation: "vertical",
							flexItem: !0,
							sx: { mx: 1 }
						}),
						/* @__PURE__ */ V(un, {
							variant: "text",
							size: "small",
							children: [
								/* @__PURE__ */ B(Ns, {}),
								/* @__PURE__ */ B(Ps, {}),
								/* @__PURE__ */ B(Fs, {}),
								/* @__PURE__ */ B(Is, {}),
								/* @__PURE__ */ B(Ls, {}),
								/* @__PURE__ */ B(Rs, {})
							]
						})
					]
				}),
				/* @__PURE__ */ B(zs, {}),
				/* @__PURE__ */ B(H, {
					sx: {
						...Hs,
						justifyContent: "flex-end"
					},
					children: /* @__PURE__ */ B(mn, {
						size: "small",
						onClick: () => e("SHOW_SETTINGS_DRAWER"),
						sx: { p: .5 },
						children: /* @__PURE__ */ B(hn, { fontSize: "small" })
					})
				})
			]
		})
	});
}
//#endregion
//#region src/components/ProgressIndicator.tsx
var Gs = gn`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`, Ks = gn`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`, qs = gn`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
`, Js = (e) => ({
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
	animation: `${e ? Gs : Ks} 0.2s ease-out forwards`,
	pointerEvents: e ? "auto" : "none"
}), Ys = {
	fontSize: 12,
	color: "#1c2127",
	whiteSpace: "nowrap"
}, Xs = {
	width: 120,
	height: 4,
	bgcolor: "#e1e4e8",
	borderRadius: "2px",
	overflow: "hidden"
}, Zs = (e, t) => ({
	height: "100%",
	bgcolor: "#2d72d2",
	borderRadius: "2px",
	transition: "width 0.2s ease-out",
	width: t ? "50%" : `${e}%`,
	animation: t ? `${qs} 1s ease-in-out infinite` : "none"
}), Qs = () => {
	let e = A((e) => e.progress);
	if (!e.visible) return null;
	let t = e.progress < 0;
	return /* @__PURE__ */ V(H, {
		sx: Js(e.visible),
		children: [
			/* @__PURE__ */ B(U, {
				component: "span",
				sx: Ys,
				children: e.message
			}),
			/* @__PURE__ */ B(H, {
				sx: Xs,
				children: /* @__PURE__ */ B(H, { sx: Zs(e.progress, t) })
			}),
			!t && /* @__PURE__ */ V(U, {
				component: "span",
				sx: Ys,
				children: [Math.round(e.progress), "%"]
			})
		]
	});
}, $s = gn`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`, ec = gn`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`, tc = gn`
  to {
    transform: rotate(360deg);
  }
`, nc = (e) => ({
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
	animation: `${e ? $s : ec} 0.2s ease-out forwards`,
	pointerEvents: e ? "auto" : "none",
	fontSize: 12
}), rc = {
	width: 14,
	height: 14,
	border: "2px solid #2d72d2",
	borderTopColor: "transparent",
	borderRadius: "50%",
	animation: `${tc} 0.8s linear infinite`
}, ic = () => {
	let [e, t] = L({
		visible: !1,
		message: "",
		solverCount: 0
	});
	return P(() => {
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
	}, []), e.visible ? /* @__PURE__ */ V(H, {
		sx: nc(e.visible),
		children: [
			/* @__PURE__ */ B(H, { sx: rc }),
			/* @__PURE__ */ B(U, {
				component: "span",
				sx: {
					color: "#1c2127",
					whiteSpace: "nowrap"
				},
				children: e.message
			}),
			e.solverCount > 1 && /* @__PURE__ */ V(U, {
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
}, ac = Rt.scale([
	"black",
	"navy",
	"red",
	"yellow",
	"white"
]).mode("lch").correctLightness(!0);
function oc(e) {
	return e instanceof Array ? `linear-gradient(90deg, ${e.map((t, n) => {
		let r = 100 * (n + 1) / 9;
		return `${ac(e[n])} ${Math.round(r)}%`;
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
		return `${ac(e[String(t)])} ${Math.round(r)}%`;
	}).join(",")})`;
}
//#endregion
//#region src/components/tree-item-label/TreeItemLabel.tsx
var sc = {
	display: "flex",
	alignItems: "center",
	width: "100%",
	minHeight: 24
}, cc = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: 28,
	"& .MuiSvgIcon-root": { fontSize: 16 }
}, lc = {
	display: "flex",
	flexDirection: "column",
	minWidth: 0,
	flex: 1
}, uc = {
	fontSize: "0.75rem",
	fontWeight: 400,
	lineHeight: 1.4,
	color: "text.primary",
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap"
}, dc = {
	fontSize: "0.625rem",
	fontWeight: 400,
	lineHeight: 1.4,
	color: "text.secondary"
};
function fc(e) {
	let t = {};
	return e.onClick && (t.onClick = e.onClick), /* @__PURE__ */ V(H, {
		sx: sc,
		...t,
		children: [e.icon && /* @__PURE__ */ B(H, {
			sx: cc,
			children: e.icon
		}), /* @__PURE__ */ V(H, {
			sx: lc,
			children: [typeof e.label == "string" ? /* @__PURE__ */ B(U, {
				component: "span",
				sx: uc,
				children: e.label
			}) : e.label, e.meta && /* @__PURE__ */ B(U, {
				component: "span",
				sx: dc,
				children: e.meta
			})]
		})]
	});
}
//#endregion
//#region src/components/ContextMenu.tsx
function pc(e) {
	let [t, n] = L(null), r = e.items || [
		"Delete",
		"!seperator",
		"Add To Global Variables",
		"Log to Console"
	], i = N((e) => {
		e.preventDefault(), n(t === null ? {
			mouseX: e.clientX + 2,
			mouseY: e.clientY - 6
		} : null);
	}, [t]), a = N(() => {
		n(null);
	}, []), o = N((t) => {
		e.handleMenuItemClick(t), a();
	}, [e.handleMenuItemClick, a]);
	return /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B("div", {
		onContextMenu: i,
		children: e.children
	}), /* @__PURE__ */ B(Yt, {
		open: t !== null,
		onClose: a,
		anchorReference: "anchorPosition",
		anchorPosition: t === null ? void 0 : {
			top: t.mouseY,
			left: t.mouseX
		},
		slotProps: { paper: { sx: { bgcolor: "background.paper" } } },
		children: r.map((e, t) => e === "!seperator" ? /* @__PURE__ */ B(qt, {}, "context-menu-item-" + e + String(t)) : /* @__PURE__ */ B(Xt, {
			onClick: o,
			"data-text": e,
			children: e
		}, "context-menu-item-" + e))
	})] });
}
//#endregion
//#region src/components/icons/NodesIcon.tsx
function mc(e) {
	return /* @__PURE__ */ B(Qt, {
		...e,
		children: /* @__PURE__ */ V("svg", {
			width: "24",
			height: "24",
			viewBox: "-4 -4 24 24",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ B("path", {
					d: "M4 12C4 13.1046 3.10457 14 2 14C0.89543 14 0 13.1046 0 12C0 10.8954 0.89543 10 2 10C3.10457 10 4 10.8954 4 12Z",
					fill: "black"
				}),
				/* @__PURE__ */ B("path", {
					d: "M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z",
					fill: "black"
				}),
				/* @__PURE__ */ B("path", {
					d: "M9 2C9 3.10457 8.10457 4 7 4C5.89543 4 5 3.10457 5 2C5 0.89543 5.89543 0 7 0C8.10457 0 9 0.89543 9 2Z",
					fill: "black"
				}),
				/* @__PURE__ */ B("path", {
					d: "M7 2L2 12H12L7 2Z",
					stroke: "black"
				})
			]
		})
	});
}
//#endregion
//#region src/components/icons/RoomIcon.tsx
function hc(e) {
	return /* @__PURE__ */ B(Qt, {
		...e,
		children: /* @__PURE__ */ V("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			id: "Layer_1",
			"data-name": "Layer 1",
			viewBox: "0 0 31 28",
			children: [
				/* @__PURE__ */ B("polygon", {
					points: "6.473 10.456 15.492 5.332 24.524 10.455 15.485 15.865 6.473 10.456",
					fill: "#ebebeb"
				}),
				/* @__PURE__ */ B("polygon", {
					points: "6.473 10.456 15.489 15.866 15.492 26.635 6.472 21.259 6.473 10.456",
					fill: "#90908f"
				}),
				/* @__PURE__ */ B("polygon", {
					points: "24.524 10.455 24.528 21.305 15.492 26.635 15.492 15.866 24.524 10.455",
					fill: "#c6c7c8"
				}),
				/* @__PURE__ */ B("path", {
					d: "M24.49414,9.897l-8.5-4.83105a1.00013,1.00013,0,0,0-.98828,0l-8.5,4.83105A1.00006,1.00006,0,0,0,6,10.76642V20.99231a.99993.99993,0,0,0,.48816.85907L14.989,26.91681a1,1,0,0,0,1.021.00159l8.49915-5.02747A1.0001,1.0001,0,0,0,25,21.03027V10.76642A1.00006,1.00006,0,0,0,24.49414,9.897ZM15.5,5.93555l8.17548,4.6466L15.501,15.419l-8.14533-4.8545ZM7,20.99219V11.51678l8,4.76691V25.76Zm9,4.77118V16.28473l8-4.73181v9.47735Z",
					fill: "#535353"
				})
			]
		})
	});
}
//#endregion
//#region src/components/icons/SourceIcon.tsx
function gc(e) {
	return /* @__PURE__ */ B(jn, {
		transform: "rotate(45)",
		fillOpacity: .95,
		...e
	});
}
//#endregion
//#region src/components/icons/ReceiverIcon.tsx
function _c(e) {
	return /* @__PURE__ */ B(Mn, { ...e });
}
//#endregion
//#region src/components/object-view/ObjectView.tsx
var vc = {
	flexGrow: 1,
	"& .MuiTreeItem-content": { py: .25 },
	"& .MuiTreeItem-content.Mui-selected": { bgcolor: "transparent" },
	"& .MuiTreeItem-content.Mui-selected:hover": { bgcolor: "transparent" },
	"& .MuiTreeItem-content.Mui-selected.Mui-focused": { bgcolor: "transparent" },
	"& .MuiTreeItem-content.Mui-focused": { bgcolor: "transparent" },
	"& .MuiTreeItem-content:hover": { bgcolor: "action.hover" },
	"& .MuiTreeItem-iconContainer": { width: "auto" },
	"& .MuiTreeItem-group": { ml: 1.75 }
}, yc = {
	bgcolor: "action.selected",
	borderRadius: .5
}, bc = Bt(function e(t) {
	let { container: r, expanded: i, setExpanded: o, parent: s } = t, [c, l] = L(r.selected), [u, d] = L(r.name), f = r.uuid, p = r.uuid, m = u || "untitled", h = N((e) => {
		r.kind !== "room" && a(e.shiftKey ? "APPEND_SELECTION" : "SET_SELECTION", [r]);
	}, [r]);
	P(() => n("APPEND_SELECTION", (e) => {
		e.includes(r) && l(!0);
	}), [r]), P(() => n("SET_SELECTION", (e) => {
		l(e.includes(r));
	}), [r]);
	let g = `${r.kind.toUpperCase()}_SET_PROPERTY`;
	P(() => n(g, ({ uuid: e, property: t, value: n }) => {
		e === r.uuid && t === "name" && d(n);
	}), [r.uuid, g]);
	let _ = /* @__PURE__ */ B(fc, { label: m }), v = /* @__PURE__ */ B(fc, {
		icon: /* @__PURE__ */ B(hc, { fontSize: "inherit" }),
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
	if (r.parent?.uuid !== s) return /* @__PURE__ */ B(z, {});
	let S = /* @__PURE__ */ B(fc, {
		icon: /* @__PURE__ */ B(mc, { fontSize: "inherit" }),
		label: m
	}), C = /* @__PURE__ */ B(fc, {
		icon: /* @__PURE__ */ B(gc, { fontSize: "inherit" }),
		label: m
	}), w = /* @__PURE__ */ B(fc, {
		icon: /* @__PURE__ */ B(_c, { fontSize: "inherit" }),
		label: m
	}), T = {
		onClick: h,
		sx: c ? yc : void 0
	};
	switch (r.kind) {
		case "surface": return /* @__PURE__ */ B(pc, {
			handleMenuItemClick: y,
			items: b,
			children: /* @__PURE__ */ B(Dn, {
				label: S,
				slotProps: { content: T },
				draggable: !0,
				itemId: p
			})
		}, f + "context-menu");
		case "source": return /* @__PURE__ */ B(pc, {
			handleMenuItemClick: y,
			items: b,
			children: /* @__PURE__ */ B(Dn, {
				label: C,
				slotProps: { content: T },
				draggable: !0,
				itemId: p
			})
		}, f + "context-menu");
		case "receiver": return /* @__PURE__ */ B(pc, {
			handleMenuItemClick: y,
			items: b,
			children: /* @__PURE__ */ B(Dn, {
				label: w,
				slotProps: { content: T },
				draggable: !0,
				itemId: p
			})
		}, f + "context-menu");
		case "room": return /* @__PURE__ */ B(pc, {
			handleMenuItemClick: y,
			items: b,
			children: /* @__PURE__ */ B(Dn, {
				label: v,
				slots: {
					collapseIcon: On,
					expandIcon: kn
				},
				onKeyDown: x,
				draggable: !0,
				itemId: p,
				children: r.children.filter((e) => e instanceof D && e.parent?.uuid === r.uuid).map((t) => /* @__PURE__ */ B(e, {
					parent: r.uuid,
					container: t,
					expanded: i,
					setExpanded: o
				}, t.uuid + "-map-children"))
			})
		}, f + "context-menu");
		case "container": return /* @__PURE__ */ B(pc, {
			handleMenuItemClick: y,
			items: b,
			children: /* @__PURE__ */ B(Dn, {
				label: _,
				slots: {
					collapseIcon: On,
					expandIcon: kn
				},
				onKeyDown: x,
				draggable: !0,
				itemId: p,
				children: r.children.filter((e) => e instanceof D && e.parent?.uuid === r.uuid).map((t) => /* @__PURE__ */ B(e, {
					parent: r.uuid,
					container: t,
					expanded: i,
					setExpanded: o
				}, t.uuid + "-map-children"))
			})
		}, f + "context-menu");
		default: return /* @__PURE__ */ B(z, {});
	}
});
function xc() {
	let { containers: e, getWorkspace: t } = k(M((e) => c(["containers", "getWorkspace"], e))), [n, r] = L(["containers"]), i = Object.keys(e).length === 0, a = /* @__PURE__ */ B(fc, { label: /* @__PURE__ */ B("span", {
		style: {
			fontWeight: 400,
			color: i ? "var(--mui-palette-text-disabled)" : "var(--mui-palette-text-primary)"
		},
		children: "Objects"
	}) }), o = Object.keys(e), s = t();
	return s ? /* @__PURE__ */ B(En, {
		expandedItems: n,
		onExpandedItemsChange: (e, t) => r(t),
		disableSelection: !0,
		sx: vc,
		children: /* @__PURE__ */ B(Dn, {
			label: a,
			slots: {
				collapseIcon: On,
				expandIcon: kn
			},
			onKeyDown: (e) => {
				e.preventDefault();
			},
			itemId: "containers",
			children: o.map((t) => /* @__PURE__ */ B(bc, {
				parent: s ? s.uuid : "",
				container: e[t],
				expanded: n,
				setExpanded: r
			}, e[t].uuid + "tree-item-container"))
		})
	}) : /* @__PURE__ */ B(z, {});
}
//#endregion
//#region src/components/MaterialSearch.tsx
var Sc = (e, t) => e < t ? e : t, Cc = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	py: .5,
	px: 1,
	fontSize: "0.75rem",
	"&:hover": { bgcolor: "action.hover" }
}, wc = {
	...Cc,
	bgcolor: "primary.light",
	"&:hover": { bgcolor: "primary.light" }
}, Tc = {
	width: 100,
	height: 16,
	borderRadius: .5
}, Ec = {
	textAlign: "center",
	px: .5
}, Dc = ({ item: e }) => {
	let { set: t, selectedMaterial: n } = ee(M((e) => c(["set", "selectedMaterial"], e))), r = n === e.uuid;
	return /* @__PURE__ */ V(xn, {
		onClick: () => t((t) => {
			t.selectedMaterial = e.uuid;
		}),
		selected: r,
		sx: r ? wc : Cc,
		children: [/* @__PURE__ */ B(U, {
			variant: "body2",
			sx: {
				fontSize: "0.75rem",
				flex: 1
			},
			children: e.material
		}), /* @__PURE__ */ B(H, { sx: {
			...Tc,
			background: oc(e.absorption)
		} })]
	});
}, Oc = ({ absorption: e }) => {
	let t = Object.keys(e);
	return /* @__PURE__ */ B(H, {
		sx: {
			display: "flex",
			gap: .5,
			my: 1
		},
		children: t.map((t) => /* @__PURE__ */ V(H, {
			sx: Ec,
			children: [/* @__PURE__ */ V(U, {
				variant: "caption",
				color: "text.secondary",
				sx: { display: "block" },
				children: [t, "Hz"]
			}), /* @__PURE__ */ B(U, {
				variant: "body2",
				sx: { fontWeight: 500 },
				children: e[t]
			})]
		}, `${t}-${e[t]}`))
	});
}, kc = () => {
	let e = ee((e) => e.materials.get(e.selectedMaterial));
	return e ? /* @__PURE__ */ V(H, {
		sx: { mt: 2 },
		children: [
			/* @__PURE__ */ B(U, {
				variant: "subtitle1",
				sx: { fontWeight: 600 },
				children: e.name
			}),
			/* @__PURE__ */ V(H, {
				sx: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				},
				children: [/* @__PURE__ */ B(U, {
					variant: "body2",
					children: e.material
				}), /* @__PURE__ */ B(U, {
					variant: "caption",
					color: "text.secondary",
					children: e.uuid
				})]
			}),
			/* @__PURE__ */ B(Oc, { absorption: e.absorption })
		]
	}) : /* @__PURE__ */ B(U, {
		variant: "body2",
		color: "text.secondary",
		sx: { py: 2 },
		children: "Nothing Selected"
	});
}, Ac = () => {
	let { bufferLength: e, query: t, search: n } = ee(M((e) => c([
		"bufferLength",
		"query",
		"search"
	], e))), r = F(() => n(t), [t, n]);
	return /* @__PURE__ */ B(bn, {
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
		children: r.slice(0, Sc(e, r.length)).map((e) => /* @__PURE__ */ B(Dc, { item: e }, `item-${e.uuid}`))
	});
}, jc = () => {
	let e = k((e) => e.selectedObjects), t = F(() => [...e].filter((e) => e.kind === "surface"), [e]), n = ee((e) => e.materials.get(e.selectedMaterial));
	return /* @__PURE__ */ B(H, {
		sx: { mt: 2 },
		children: /* @__PURE__ */ B(ln, {
			variant: "contained",
			color: "success",
			startIcon: /* @__PURE__ */ B(Tn, {}),
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
}, Mc = () => {
	let { query: e, set: t } = ee(M((e) => c(["query", "set"], e))), { materialDrawerOpen: n, set: r } = A(M((e) => c(["materialDrawerOpen", "set"], e))), i = (e) => t((t) => {
		t.query = e;
	}), a = () => r((e) => {
		e.materialDrawerOpen = !1;
	});
	return /* @__PURE__ */ V(_n, {
		anchor: "right",
		open: n,
		onClose: a,
		sx: { "& .MuiDrawer-paper": {
			width: "100%",
			maxWidth: 600,
			bgcolor: "background.paper"
		} },
		children: [/* @__PURE__ */ V(H, {
			sx: {
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				p: 2,
				borderBottom: 1,
				borderColor: "divider"
			},
			children: [/* @__PURE__ */ B(U, {
				variant: "h6",
				children: "Material Selection"
			}), /* @__PURE__ */ B(mn, {
				onClick: a,
				size: "small",
				children: /* @__PURE__ */ B(wn, {})
			})]
		}), /* @__PURE__ */ V(H, {
			sx: {
				display: "grid",
				gridTemplateColumns: "1fr 2fr",
				flex: 1,
				overflow: "hidden",
				bgcolor: "background.paper"
			},
			children: [/* @__PURE__ */ B(H, {
				sx: {
					overflow: "auto",
					p: 2,
					borderRight: 1,
					borderColor: "divider"
				},
				children: /* @__PURE__ */ B(xc, {})
			}), /* @__PURE__ */ V(H, {
				sx: {
					overflow: "auto",
					p: 2,
					display: "flex",
					flexDirection: "column"
				},
				children: [
					/* @__PURE__ */ B(yn, {
						size: "small",
						fullWidth: !0,
						placeholder: "Search materials...",
						value: e,
						onChange: (e) => i(e.target.value),
						sx: { mb: 1 },
						slotProps: { input: { startAdornment: /* @__PURE__ */ B(vn, {
							position: "start",
							children: /* @__PURE__ */ B(Cn, {
								fontSize: "small",
								color: "action"
							})
						}) } }
					}),
					/* @__PURE__ */ B(Ac, {}),
					/* @__PURE__ */ B(Sn, {
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
					/* @__PURE__ */ B(pn, { sx: { my: 2 } }),
					/* @__PURE__ */ B(kc, {}),
					/* @__PURE__ */ B(jc, {})
				]
			})]
		})]
	});
}, Nc = {
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
}, Pc = {
	CANVAS: "canvas",
	OBJECTS: "objects",
	SOLVERS: "solvers",
	RENDERER: "renderer",
	RESULTS: "results"
}, Fc = {
	height: "100%",
	width: "100%",
	userSelect: "none"
};
function Ic({ children: e }) {
	return /* @__PURE__ */ B(H, {
		id: "editor-container",
		sx: Fc,
		children: e
	});
}
//#endregion
//#region src/components/workbench/panels/CanvasPanel.tsx
function Lc() {
	let e = I(null), t = I(null), n = I(null), r = I(null), i = I(null);
	return P(() => {
		e.current && h.postMessage("APP_MOUNTED", e.current);
		let t = i.current, n = null;
		return t && (n = new ResizeObserver(() => {
			E.checkresize(), E.needsToRender = !0;
		}), n.observe(t)), () => {
			n?.disconnect();
		};
	}, []), /* @__PURE__ */ B("div", {
		ref: i,
		style: {
			width: "100%",
			height: "100%",
			position: "relative"
		},
		children: /* @__PURE__ */ V(Ic, { children: [
			/* @__PURE__ */ B("div", {
				id: "response-overlay",
				className: "response_overlay response_overlay-hidden",
				ref: t
			}),
			/* @__PURE__ */ B("div", {
				id: "canvas_overlay",
				ref: n
			}),
			/* @__PURE__ */ B("div", {
				id: "orientation-overlay",
				ref: r
			}),
			/* @__PURE__ */ B("canvas", {
				id: "renderer-canvas",
				ref: e
			})
		] })
	});
}
//#endregion
//#region src/components/parameter-config/property-row/PropertyRow.tsx
var Rc = {
	display: "grid",
	gridTemplateColumns: "2fr 3fr",
	userSelect: "none",
	fontSize: "0.75rem",
	mb: .5,
	px: .5,
	alignItems: "center",
	"&:last-child": { mb: 0 }
};
function Y(e) {
	return /* @__PURE__ */ B(H, {
		sx: Rc,
		children: e.children
	});
}
//#endregion
//#region src/components/parameter-config/property-row/PropertyRowFolder.tsx
var zc = {
	display: "flex",
	alignItems: "center",
	gap: .5,
	py: .5,
	cursor: "pointer",
	userSelect: "none",
	"&:hover": { bgcolor: "action.hover" }
}, Bc = { pb: .5 }, Vc = {
	pt: .5,
	pb: .5
}, Hc = {
	fontSize: "0.75rem",
	fontWeight: 500,
	color: "text.primary"
};
function Uc(e) {
	return /* @__PURE__ */ V(H, {
		sx: Bc,
		children: [/* @__PURE__ */ V(H, {
			sx: zc,
			onClick: () => e.onOpenClose(e.id),
			children: [e.open ? /* @__PURE__ */ B(On, { sx: {
				fontSize: 16,
				color: "text.secondary"
			} }) : /* @__PURE__ */ B(kn, { sx: {
				fontSize: 16,
				color: "text.secondary"
			} }), /* @__PURE__ */ B(U, {
				sx: Hc,
				children: e.label
			})]
		}), /* @__PURE__ */ B(qn, {
			in: e.open,
			children: /* @__PURE__ */ B(H, {
				sx: Vc,
				children: e.children
			})
		})]
	});
}
//#endregion
//#region src/components/parameter-config/property-row/PropertyRowLabel.tsx
var Wc = {
	textAlign: "right",
	minWidth: "100px",
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
	gap: "4px"
}, Gc = {
	fontSize: "0.75rem",
	color: "text.secondary",
	lineHeight: 1.5
}, Kc = {
	fontSize: 12,
	color: "text.disabled",
	cursor: "help"
}, qc = {
	bgcolor: "grey.800",
	color: "common.white",
	fontSize: "0.7rem",
	lineHeight: 1.4,
	px: 1.5,
	py: .75,
	maxWidth: 260,
	boxShadow: 2
}, Jc = { color: "grey.800" };
function X({ label: e, tooltip: t, hasToolTip: n }) {
	return n && t ? /* @__PURE__ */ V(H, {
		sx: Wc,
		children: [/* @__PURE__ */ B(U, {
			component: "span",
			sx: Gc,
			children: e
		}), /* @__PURE__ */ B(Jn, {
			title: t,
			placement: "left",
			arrow: !0,
			enterDelay: 300,
			slotProps: {
				tooltip: { sx: qc },
				arrow: { sx: Jc }
			},
			children: /* @__PURE__ */ B(Yn, { sx: Kc })
		})]
	}) : /* @__PURE__ */ B(H, {
		sx: Wc,
		children: /* @__PURE__ */ B(U, {
			component: "span",
			sx: Gc,
			children: e
		})
	});
}
//#endregion
//#region src/components/parameter-config/property-row/PropertyRowCheckbox.tsx
var Yc = {
	ml: "0.5em",
	mt: "1px",
	p: 0,
	"& .MuiSvgIcon-root": { fontSize: 16 }
}, Xc = ({ value: e, onChange: t }) => /* @__PURE__ */ B(Xn, {
	checked: e,
	onChange: (e) => t({ value: e.currentTarget.checked }),
	sx: Yc,
	size: "small"
}), Zc = {
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
}, Qc = ({ value: e, onChange: t }) => /* @__PURE__ */ B(yn, {
	type: "text",
	size: "small",
	variant: "outlined",
	value: e,
	onChange: (e) => t({ value: e.currentTarget.value }),
	sx: Zc
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
		textAlign: "center",
		"&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
			WebkitAppearance: "none",
			m: 0
		},
		MozAppearance: "textfield"
	},
	"& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
	"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" }
}, el = ({ value: e, onChange: t, step: n = 1, min: r, max: i }) => {
	let a = I(null), o = I(e), s = I(n), c = I(r), l = I(i), u = I(t);
	o.current = e, s.current = n, c.current = r, l.current = i, u.current = t, P(() => {
		let e = a.current;
		if (!e) return;
		let t = (e) => {
			e.preventDefault();
			let t = e.deltaY < 0 ? s.current : -s.current, n = o.current + t;
			c.current !== void 0 && (n = Math.max(c.current, n)), l.current !== void 0 && (n = Math.min(l.current, n)), Number.isNaN(n) || u.current({ value: n });
		};
		return e.addEventListener("wheel", t, { passive: !1 }), () => e.removeEventListener("wheel", t);
	}, []);
	let d = N((e) => {
		let n = e.currentTarget.valueAsNumber;
		Number.isNaN(n) || t({ value: n });
	}, [t]);
	return /* @__PURE__ */ B(yn, {
		inputRef: a,
		type: "number",
		size: "small",
		variant: "outlined",
		value: e,
		onChange: d,
		slotProps: { htmlInput: {
			step: n,
			min: r,
			max: i
		} },
		sx: $c
	});
}, tl = {
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
}, nl = ({ value: e, onChange: t, step: n = 1, min: r, max: i }) => {
	let a = I(null), o = I(e), s = I(n), c = I(r), l = I(i), u = I(t);
	o.current = e, s.current = n, c.current = r, l.current = i, u.current = t, P(() => {
		let e = a.current;
		if (!e) return;
		let t = (e) => {
			e.preventDefault();
			let t = e.deltaY < 0 ? s.current : -s.current, n = o.current + t;
			c.current !== void 0 && (n = Math.max(c.current, n)), l.current !== void 0 && (n = Math.min(l.current, n)), Number.isNaN(n) || u.current({ value: n });
		};
		return e.addEventListener("wheel", t, { passive: !1 }), () => e.removeEventListener("wheel", t);
	}, []);
	let d = N((e) => {
		let n = e.currentTarget.valueAsNumber;
		Number.isNaN(n) || t({ value: n });
	}, [t]);
	return /* @__PURE__ */ B(H, {
		component: "input",
		type: "number",
		ref: a,
		onChange: d,
		value: e,
		step: n,
		min: r,
		max: i,
		sx: tl
	});
}, rl = {
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
}, il = {
	fontSize: "0.75rem",
	py: .5
}, al = ({ value: e, onChange: t, options: n }) => /* @__PURE__ */ B(Zn, {
	size: "small",
	value: e,
	onChange: (e) => t({ value: e.target.value }),
	sx: rl,
	MenuProps: { slotProps: { paper: { sx: { bgcolor: "background.paper" } } } },
	children: n.map(({ value: e, label: t }, n) => /* @__PURE__ */ B(fn, {
		value: e,
		sx: il,
		children: t
	}, `${e}-${t}-${n}`))
});
//#endregion
//#region src/components/parameter-config/ContainerComponents.tsx
function ol(e, t, n) {
	return [k((n) => (n.version, n.containers[e][t])), (r) => a(n, {
		uuid: e,
		property: t,
		value: r.value
	})];
}
var sl = (e, t) => ({ uuid: n, property: r, options: i }) => {
	let [a, o] = ol(n, r, e);
	return /* @__PURE__ */ B(t, {
		value: a,
		onChange: o,
		options: i
	});
}, cl = (e) => ({ uuid: t, property: n, label: r, tooltip: i, options: a }) => /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
	label: r,
	hasToolTip: !0,
	tooltip: i
}), /* @__PURE__ */ B("div", { children: p(n).map((n, r) => /* @__PURE__ */ B(e, {
	uuid: t,
	property: n,
	options: a
}, `${t}-${String(n)}-${r}`)) })] }), ll = (e) => ({
	PropertyTextInput: cl(sl(e, Qc)),
	PropertyNumberInput: cl(sl(e, el)),
	PropertyCheckboxInput: cl(sl(e, Xc)),
	PropertyVectorInput: cl(sl(e, nl)),
	PropertySelect: cl(sl(e, al))
}), ul = (e) => {
	let [t, n] = L(e);
	return [t, () => void n(!t)];
}, dl = {
	display: "flex",
	justifyContent: "space-around"
}, fl = {
	mx: 1,
	my: .25,
	width: "100%",
	fontSize: "0.75rem",
	textTransform: "none",
	py: .25,
	minHeight: 24
};
function pl({ label: e, onClick: t, disabled: n, ...r }) {
	return /* @__PURE__ */ B(H, {
		sx: dl,
		children: /* @__PURE__ */ B(ln, {
			variant: "outlined",
			size: "small",
			color: "inherit",
			sx: fl,
			onClick: t,
			disabled: n,
			...r,
			children: e
		})
	});
}
//#endregion
//#region src/components/parameter-config/property-row/PropertyButton.tsx
var ml = ({ args: e, event: t, label: n, tooltip: r, buttonLabel: i = n, disabled: o }) => /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
	label: n,
	hasToolTip: !0,
	tooltip: r
}), /* @__PURE__ */ B(pl, {
	onClick: (n) => a(t, e),
	label: i,
	disabled: o
})] }), hl = { pb: .5 }, gl = {
	display: "flex",
	alignItems: "center",
	gap: .5,
	py: .5,
	cursor: "pointer",
	userSelect: "none",
	"&:hover": { bgcolor: "action.hover" }
}, _l = {
	fontSize: "0.75rem",
	fontWeight: 500,
	color: "text.primary"
}, vl = {
	width: "100%",
	borderCollapse: "collapse",
	fontSize: "0.75rem"
}, yl = {
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
}, bl = {
	"& td": {
		p: "2px 4px",
		fontSize: "0.75rem"
	},
	"& td:first-of-type": {
		fontWeight: 500,
		color: "text.primary",
		pl: 1
	}
}, xl = {
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
}, Sl = 180 / Math.PI, Cl = Math.PI / 180, wl = (e) => e === "rotationx" || e === "rotationy" || e === "rotationz", Tl = ({ uuid: e, property: t, event: n }) => {
	let r = I(null), i = k((n) => (n.version, n.containers[e][t])), o = wl(t), s = o ? Math.round(i * Sl * 10) / 10 : i, c = I(s), l = I(e), u = I(t), d = I(n);
	return c.current = s, l.current = e, u.current = t, d.current = n, P(() => {
		let e = r.current;
		if (!e) return;
		let t = (e) => {
			e.preventDefault();
			let t = e.deltaY < 0 ? 1 : -1, n = c.current + t, r = o ? n * Cl : n;
			Number.isNaN(r) || a(d.current, {
				uuid: l.current,
				property: u.current,
				value: r
			});
		};
		return e.addEventListener("wheel", t, { passive: !1 }), () => e.removeEventListener("wheel", t);
	}, []), /* @__PURE__ */ B(yn, {
		inputRef: r,
		type: "number",
		size: "small",
		variant: "outlined",
		value: s,
		onChange: (r) => {
			let i = r.currentTarget.valueAsNumber, s = o ? i * Cl : i;
			Number.isNaN(s) || a(n, {
				uuid: e,
				property: t,
				value: s
			});
		},
		slotProps: {
			htmlInput: { step: 1 },
			input: o ? { endAdornment: /* @__PURE__ */ B(vn, {
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
		sx: xl
	});
};
function El({ uuid: e, event: t }) {
	let [n, r] = ul(!0);
	return /* @__PURE__ */ V(H, {
		sx: hl,
		children: [/* @__PURE__ */ V(H, {
			sx: gl,
			onClick: r,
			children: [B(n ? On : kn, { sx: {
				fontSize: 16,
				color: "text.secondary"
			} }), /* @__PURE__ */ B(U, {
				sx: _l,
				children: "Transform"
			})]
		}), /* @__PURE__ */ B(qn, {
			in: n,
			children: /* @__PURE__ */ V(H, {
				component: "table",
				sx: vl,
				children: [/* @__PURE__ */ B(H, {
					component: "thead",
					children: /* @__PURE__ */ V(H, {
						component: "tr",
						sx: yl,
						children: [
							/* @__PURE__ */ B(H, { component: "th" }),
							/* @__PURE__ */ B(H, {
								component: "th",
								children: "X"
							}),
							/* @__PURE__ */ B(H, {
								component: "th",
								children: "Y"
							}),
							/* @__PURE__ */ B(H, {
								component: "th",
								children: "Z"
							})
						]
					})
				}), /* @__PURE__ */ V(H, {
					component: "tbody",
					children: [
						/* @__PURE__ */ V(H, {
							component: "tr",
							sx: bl,
							children: [
								/* @__PURE__ */ B(H, {
									component: "td",
									children: "Position"
								}),
								/* @__PURE__ */ B(H, {
									component: "td",
									children: /* @__PURE__ */ B(Tl, {
										uuid: e,
										property: "x",
										event: t
									})
								}),
								/* @__PURE__ */ B(H, {
									component: "td",
									children: /* @__PURE__ */ B(Tl, {
										uuid: e,
										property: "y",
										event: t
									})
								}),
								/* @__PURE__ */ B(H, {
									component: "td",
									children: /* @__PURE__ */ B(Tl, {
										uuid: e,
										property: "z",
										event: t
									})
								})
							]
						}),
						/* @__PURE__ */ V(H, {
							component: "tr",
							sx: bl,
							children: [
								/* @__PURE__ */ B(H, {
									component: "td",
									children: "Scale"
								}),
								/* @__PURE__ */ B(H, {
									component: "td",
									children: /* @__PURE__ */ B(Tl, {
										uuid: e,
										property: "scalex",
										event: t
									})
								}),
								/* @__PURE__ */ B(H, {
									component: "td",
									children: /* @__PURE__ */ B(Tl, {
										uuid: e,
										property: "scaley",
										event: t
									})
								}),
								/* @__PURE__ */ B(H, {
									component: "td",
									children: /* @__PURE__ */ B(Tl, {
										uuid: e,
										property: "scalez",
										event: t
									})
								})
							]
						}),
						/* @__PURE__ */ V(H, {
							component: "tr",
							sx: bl,
							children: [
								/* @__PURE__ */ B(H, {
									component: "td",
									children: "Rotation"
								}),
								/* @__PURE__ */ B(H, {
									component: "td",
									children: /* @__PURE__ */ B(Tl, {
										uuid: e,
										property: "rotationx",
										event: t
									})
								}),
								/* @__PURE__ */ B(H, {
									component: "td",
									children: /* @__PURE__ */ B(Tl, {
										uuid: e,
										property: "rotationy",
										event: t
									})
								}),
								/* @__PURE__ */ B(H, {
									component: "td",
									children: /* @__PURE__ */ B(Tl, {
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
//#endregion
//#region src/components/parameter-config/SourceTab.tsx
var { PropertyNumberInput: Dl, PropertySelect: Ol } = ll("SOURCE_SET_PROPERTY"), kl = ({ uuid: e }) => /* @__PURE__ */ B(El, {
	uuid: e,
	event: "SOURCE_SET_PROPERTY"
}), Al = ({ uuid: e }) => {
	let [t, n] = ul(!0);
	return /* @__PURE__ */ V(Uc, {
		label: "Configuration",
		open: t,
		onOpenClose: n,
		children: [/* @__PURE__ */ B(Dl, {
			uuid: e,
			label: "θ Theta",
			property: "theta",
			tooltip: "Sets theta"
		}), /* @__PURE__ */ B(Dl, {
			uuid: e,
			label: "φ Phi",
			property: "phi",
			tooltip: "Sets phi"
		})]
	});
}, jl = ({ uuid: e }) => {
	let [t, n] = ul(!0);
	return /* @__PURE__ */ V(Uc, {
		label: "FDTD Config",
		open: t,
		onOpenClose: n,
		children: [
			/* @__PURE__ */ B(Ol, {
				uuid: e,
				label: "Signal Source",
				tooltip: "The source thats generating it's signal",
				property: "signalSource",
				options: Br
			}),
			/* @__PURE__ */ B(Dl, {
				uuid: e,
				label: "Frequency",
				property: "frequency",
				tooltip: "The source's frequency"
			}),
			/* @__PURE__ */ B(Dl, {
				uuid: e,
				label: "Amplitude",
				property: "amplitude",
				tooltip: "The source's amplitude"
			}),
			/* @__PURE__ */ B(ml, {
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
}, Ml = ({ uuid: e }) => /* @__PURE__ */ V("div", { children: [
	/* @__PURE__ */ B(kl, { uuid: e }),
	/* @__PURE__ */ B(ml, {
		label: "First Person View",
		tooltip: "Look through this source and adjust its orientation",
		event: "ENTER_FIRST_PERSON",
		args: { uuid: e }
	}),
	/* @__PURE__ */ B(Al, { uuid: e }),
	/* @__PURE__ */ B(jl, { uuid: e })
] }), { PropertySelect: Nl } = ll("RECEIVER_SET_PROPERTY"), Pl = [
	{
		value: Wr.OMNIDIRECTIONAL,
		label: "Omnidirectional"
	},
	{
		value: Wr.CARDIOID,
		label: "Cardioid"
	},
	{
		value: Wr.SUPERCARDIOID,
		label: "Supercardioid"
	},
	{
		value: Wr.FIGURE_EIGHT,
		label: "Figure-8"
	}
], Fl = ({ uuid: e }) => /* @__PURE__ */ B(El, {
	uuid: e,
	event: "RECEIVER_SET_PROPERTY"
}), Il = ({ uuid: e }) => {
	let [t, n] = ul(!0);
	return /* @__PURE__ */ B(Uc, {
		label: "Directivity",
		open: t,
		onOpenClose: n,
		children: /* @__PURE__ */ B(Nl, {
			uuid: e,
			label: "Pattern",
			property: "directivityPattern",
			tooltip: "Receiver directivity pattern for microphone modeling",
			options: Pl
		})
	});
}, Ll = ({ uuid: e }) => /* @__PURE__ */ V("div", { children: [
	/* @__PURE__ */ B(Fl, { uuid: e }),
	/* @__PURE__ */ B(ml, {
		label: "First Person View",
		tooltip: "Look through this receiver and adjust its orientation",
		event: "ENTER_FIRST_PERSON",
		args: { uuid: e }
	}),
	/* @__PURE__ */ B(Il, { uuid: e })
] }), Rl = ({ uuid: e }) => /* @__PURE__ */ B(El, {
	uuid: e,
	event: "ROOM_SET_PROPERTY"
}), zl = ({ uuid: e }) => {
	let [t, n] = ul(!0), [r, i] = ol(e, "temperature", "ROOM_SET_PROPERTY"), [a, o] = ol(e, "humidity", "ROOM_SET_PROPERTY");
	return /* @__PURE__ */ V(Uc, {
		label: "Environment",
		open: t,
		onOpenClose: n,
		children: [/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Temperature",
			hasToolTip: !0,
			tooltip: "Temperature in Celsius (affects speed of sound and air absorption)"
		}), /* @__PURE__ */ B(el, {
			value: r,
			onChange: i,
			step: 1,
			min: -20,
			max: 50
		})] }), /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Humidity",
			hasToolTip: !0,
			tooltip: "Relative humidity in % (affects air absorption)"
		}), /* @__PURE__ */ B(el, {
			value: a,
			onChange: o,
			step: 1,
			min: 5,
			max: 95
		})] })]
	});
}, Bl = ({ uuid: e }) => /* @__PURE__ */ V("div", { children: [/* @__PURE__ */ B(Rl, { uuid: e }), /* @__PURE__ */ B(zl, { uuid: e })] }), { PropertyNumberInput: Vl, PropertyCheckboxInput: Hl } = ll("SURFACE_SET_PROPERTY"), Ul = ({ uuid: e }) => {
	let [t, n] = ol(e, "isTessellated", "SURFACE_SET_PROPERTY");
	return t ? /* @__PURE__ */ B(Hl, {
		uuid: e,
		label: "Tessellation",
		property: "tessellatedMeshVisible",
		tooltip: "Shows/hides the tessellation of this surface"
	}) : null;
}, Wl = ({ uuid: e }) => {
	let [t, n] = ul(!0);
	return /* @__PURE__ */ V(Uc, {
		label: "Visual",
		open: t,
		onOpenClose: n,
		children: [
			/* @__PURE__ */ B(Hl, {
				uuid: e,
				label: "Wireframe",
				property: "wireframeVisible",
				tooltip: "Shows/hides the wireframe of this surface"
			}),
			/* @__PURE__ */ B(Ul, { uuid: e }),
			/* @__PURE__ */ B(Hl, {
				uuid: e,
				label: "Vertex Normals",
				property: "displayVertexNormals",
				tooltip: "Shows/hides the vertex normals of this surface"
			})
		]
	});
}, Gl = ({ uuid: e }) => /* @__PURE__ */ B(El, {
	uuid: e,
	event: "SURFACE_SET_PROPERTY"
}), Kl = ({ uuid: e }) => {
	let t = k((t) => t.containers[e].acousticMaterial.name), [, r] = Ht((e) => e + 1, 0);
	return P(() => n("ASSIGN_MATERIAL", ({ target: t }) => {
		p(t).reduce((t, n) => t || n.uuid === e, !1) && r();
	}), [e]), /* @__PURE__ */ B(ml, {
		label: "Material",
		buttonLabel: t,
		event: "OPEN_MATERIAL_DRAWER",
		args: void 0,
		tooltip: "Opens the material search screen"
	});
}, ql = ({ uuid: e }) => {
	let [t, n] = ul(!0);
	return /* @__PURE__ */ B(Uc, {
		label: "Material",
		open: t,
		onOpenClose: n,
		children: /* @__PURE__ */ B(Kl, { uuid: e })
	});
}, Jl = ({ uuid: e }) => {
	let [t, n] = ul(!0);
	return /* @__PURE__ */ B(Uc, {
		label: "Scattering",
		open: t,
		onOpenClose: n,
		children: /* @__PURE__ */ B(Vl, {
			uuid: e,
			label: "Scattering Coefficient",
			tooltip: "Sets this surface's scattering coefficient",
			property: "scatteringCoefficient"
		})
	});
}, Yl = ({ uuid: e }) => /* @__PURE__ */ V("div", { children: [
	/* @__PURE__ */ B(Wl, { uuid: e }),
	/* @__PURE__ */ B(Gl, { uuid: e }),
	/* @__PURE__ */ B(ql, { uuid: e }),
	/* @__PURE__ */ B(Jl, { uuid: e })
] }), Xl = {
	height: "100%",
	overflow: "auto",
	bgcolor: "background.paper"
}, Zl = {
	py: .25,
	px: 1,
	"&.Mui-selected": {
		bgcolor: "primary.light",
		"&:hover": { bgcolor: "primary.light" }
	}
}, Ql = {
	py: .5,
	px: 1.5,
	bgcolor: "background.default",
	borderBottom: 1,
	borderColor: "divider"
}, $l = {
	py: 3,
	px: 2,
	textAlign: "center"
}, eu = {
	p: 1,
	"& > *": { mb: .5 }
}, tu = {
	room: /* @__PURE__ */ B(Hn, { fontSize: "small" }),
	source: /* @__PURE__ */ B(Un, { fontSize: "small" }),
	receiver: /* @__PURE__ */ B(Wn, { fontSize: "small" }),
	surface: /* @__PURE__ */ B(Gn, { fontSize: "small" })
};
function nu({ uuid: e, name: t, type: n, visible: r, selected: i, onSelect: a, onToggleVisibility: o, onDelete: s, onHover: c, onUnhover: l }) {
	return /* @__PURE__ */ B(In, {
		disablePadding: !0,
		sx: Zl,
		onMouseEnter: c,
		onMouseLeave: l,
		secondaryAction: /* @__PURE__ */ V(H, {
			sx: {
				display: "flex",
				gap: .25
			},
			children: [/* @__PURE__ */ B(mn, {
				size: "small",
				onClick: o,
				sx: { p: .25 },
				children: B(r ? zn : Bn, { sx: { fontSize: 16 } })
			}), /* @__PURE__ */ B(mn, {
				size: "small",
				onClick: s,
				sx: { p: .25 },
				children: /* @__PURE__ */ B(Vn, { sx: { fontSize: 16 } })
			})]
		}),
		children: /* @__PURE__ */ V(xn, {
			onClick: a,
			selected: i,
			dense: !0,
			sx: { py: .25 },
			children: [/* @__PURE__ */ B(Ln, {
				sx: { minWidth: 28 },
				children: tu[n] || /* @__PURE__ */ B(Kn, { fontSize: "small" })
			}), /* @__PURE__ */ B(Rn, {
				primary: t,
				slotProps: { primary: {
					noWrap: !0,
					sx: { fontSize: "0.75rem" }
				} }
			})]
		})
	});
}
function ru() {
	let [t, n] = L(null), { containers: r, version: i } = k(M((e) => ({
		containers: e.containers,
		version: e.version
	}))), o = F(() => {
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
	}, [r, i]), s = o.rooms.length + o.sources.length + o.receivers.length + o.surfaces.length, c = N((t) => {
		n(t), e("SELECT_OBJECT", t);
		let i = r[t];
		i && a("SET_SELECTION", [i]);
	}, [r]), l = N((e) => {
		a("TOGGLE_CONTAINER_VISIBLE", e);
	}, []), u = N((e) => {
		a("REMOVE_CONTAINERS", e), t === e && n(null);
	}, [t]), d = N((e) => {
		a("SURFACE_HOVER", e);
	}, []), f = N((e) => {
		a("SURFACE_UNHOVER", e);
	}, []), p = t ? r[t] : null, m = () => {
		if (!p) return null;
		switch (p.kind) {
			case "source": return /* @__PURE__ */ B(Ml, { uuid: t });
			case "receiver": return /* @__PURE__ */ B(Ll, { uuid: t });
			case "room": return /* @__PURE__ */ B(Bl, { uuid: t });
			case "surface": return /* @__PURE__ */ B(Yl, { uuid: t });
			default: return /* @__PURE__ */ B(U, {
				variant: "body2",
				color: "text.secondary",
				children: "Unknown object type"
			});
		}
	}, h = (e, n, r, i = !1) => n.length === 0 ? null : /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B(In, {
		sx: Ql,
		children: /* @__PURE__ */ V(U, {
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
	}), n.map((e) => /* @__PURE__ */ B(nu, {
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
	return /* @__PURE__ */ V(H, {
		sx: Xl,
		children: [s === 0 ? /* @__PURE__ */ B(H, {
			sx: $l,
			children: /* @__PURE__ */ B(U, {
				variant: "body2",
				color: "text.secondary",
				sx: { fontSize: "0.75rem" },
				children: "No objects. Import a model or add from menu."
			})
		}) : /* @__PURE__ */ V(bn, {
			dense: !0,
			disablePadding: !0,
			children: [
				h("ROOMS", o.rooms, "room"),
				h("SOURCES", o.sources, "source"),
				h("RECEIVERS", o.receivers, "receiver"),
				h("SURFACES", o.surfaces, "surface", !0)
			]
		}), p && /* @__PURE__ */ V(z, { children: [
			/* @__PURE__ */ B(pn, {}),
			/* @__PURE__ */ B(H, {
				sx: {
					px: 1.5,
					py: .5,
					bgcolor: "action.hover"
				},
				children: /* @__PURE__ */ V(U, {
					variant: "subtitle2",
					sx: {
						fontWeight: 600,
						fontSize: "0.75rem"
					},
					children: [p.name || p.kind, " Properties"]
				})
			}),
			/* @__PURE__ */ B(H, {
				sx: eu,
				children: m()
			})
		] })]
	});
}
//#endregion
//#region src/components/parameter-config/SolverComponents.tsx
function Z(e, t, n) {
	return [f((n) => (n.version, n.solvers[e]?.[t])), (r) => a(n, {
		uuid: e,
		property: t,
		value: r.value
	})];
}
var iu = (e, t) => ({ uuid: n, property: r, label: i, tooltip: a, elementProps: o }) => {
	let [s, c] = Z(n, r, e);
	return /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
		label: i,
		hasToolTip: !0,
		tooltip: a
	}), /* @__PURE__ */ B(t, {
		value: s,
		onChange: c,
		...o
	})] });
}, au = (e) => ({
	PropertyTextInput: iu(e, Qc),
	PropertyNumberInput: iu(e, el),
	PropertyCheckboxInput: iu(e, Xc)
}), ou = ({ args: e, event: t, label: n, tooltip: r, disabled: i }) => /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
	label: n,
	hasToolTip: !0,
	tooltip: r
}), /* @__PURE__ */ B(pl, {
	onClick: (n) => a(t, e),
	label: n,
	disabled: i
})] }), su = (e) => ({
	p: "4px 8px",
	overflowX: "auto",
	opacity: e ? .5 : 1,
	pointerEvents: e ? "none" : "auto"
}), cu = {
	width: "100%",
	borderCollapse: "collapse",
	fontSize: 11,
	"& th, & td": {
		p: "4px 6px",
		transition: "background-color 0.1s"
	}
}, lu = {
	textAlign: "center",
	fontWeight: 500,
	color: "text.primary",
	borderBottom: "1px solid",
	borderColor: "divider",
	whiteSpace: "nowrap",
	maxWidth: 80,
	overflow: "hidden",
	textOverflow: "ellipsis"
}, uu = {
	fontWeight: 500,
	color: "text.primary",
	borderRight: "1px solid",
	borderColor: "divider",
	whiteSpace: "nowrap",
	maxWidth: 80,
	overflow: "hidden",
	textOverflow: "ellipsis"
}, du = {
	textAlign: "center",
	cursor: "pointer",
	userSelect: "none",
	borderBottom: "1px solid",
	borderColor: "action.hover"
}, fu = { bgcolor: "action.hover" }, pu = {
	textAlign: "right",
	fontWeight: 400,
	fontSize: 10,
	color: "text.disabled",
	borderBottom: "1px solid",
	borderRight: "1px solid",
	borderColor: "divider"
}, mu = {
	p: "12px 8px",
	fontSize: 11,
	color: "text.disabled",
	fontStyle: "italic",
	textAlign: "center"
}, hu = {
	fontSize: 14,
	fontWeight: 700,
	color: "primary.main",
	lineHeight: 1
}, gu = {
	fontSize: 14,
	fontWeight: 400,
	color: "text.disabled",
	lineHeight: 1
}, _u = Bt(({ uuid: e, disabled: t = !1, eventType: n = "RAYTRACER_SET_PROPERTY" }) => {
	let r = k((e) => e.containers), i = k((e) => e.version), [a, o] = L(null), s = F(() => Object.values(r).filter((e) => e.kind === "source").map((e) => ({
		uuid: e.uuid,
		name: e.name
	})), [r, i]), c = F(() => Object.values(r).filter((e) => e.kind === "receiver").map((e) => ({
		uuid: e.uuid,
		name: e.name
	})), [r, i]), [l, u] = Z(e, "sourceIDs", n), [d, f] = Z(e, "receiverIDs", n), p = l || [], m = d || [], h = s.length > 0 && c.length > 0 && (p.length === 0 || m.length === 0), g = N((e, t) => p.includes(e) && m.includes(t), [p, m]), _ = N((e, t) => {
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
	return s.length === 0 && c.length === 0 ? /* @__PURE__ */ B(U, {
		sx: mu,
		children: "Add sources and receivers to configure pairs"
	}) : s.length === 0 ? /* @__PURE__ */ B(U, {
		sx: mu,
		children: "Add sources to configure pairs"
	}) : c.length === 0 ? /* @__PURE__ */ B(U, {
		sx: mu,
		children: "Add receivers to configure pairs"
	}) : /* @__PURE__ */ B(H, {
		sx: {
			...su(t),
			...h && {
				bgcolor: "rgba(244,67,54,0.08)",
				borderRadius: 1
			}
		},
		children: /* @__PURE__ */ V(H, {
			component: "table",
			sx: cu,
			onMouseLeave: () => o(null),
			children: [/* @__PURE__ */ B("thead", { children: /* @__PURE__ */ V("tr", { children: [/* @__PURE__ */ B(H, {
				component: "th",
				sx: pu,
				children: "Src \\ Rec"
			}), c.map((e, t) => /* @__PURE__ */ B(H, {
				component: "th",
				sx: a && a.col === t ? {
					...lu,
					...fu
				} : lu,
				title: e.name,
				children: e.name
			}, e.uuid))] }) }), /* @__PURE__ */ B("tbody", { children: s.map((e, t) => /* @__PURE__ */ V("tr", { children: [/* @__PURE__ */ B(H, {
				component: "td",
				sx: a && a.row === t ? {
					...uu,
					...fu
				} : uu,
				title: e.name,
				children: e.name
			}), c.map((n, r) => {
				let i = g(e.uuid, n.uuid), s = a && (a.row === t || a.col === r);
				return /* @__PURE__ */ B(H, {
					component: "td",
					sx: s ? {
						...du,
						...fu
					} : du,
					onClick: () => _(e.uuid, n.uuid),
					onMouseEnter: () => o({
						row: t,
						col: r
					}),
					title: `${e.name} \u2192 ${n.name}`,
					children: /* @__PURE__ */ B(U, {
						component: "span",
						sx: i ? hu : gu,
						children: i ? "✓" : "·"
					})
				}, `${e.uuid}-${n.uuid}`);
			})] }, e.uuid)) })]
		})
	});
}), vu = { bgcolor: "background.paper" }, yu = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center"
}, bu = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
	gap: 1.5,
	py: 1
}, xu = (e) => ({
	border: 2,
	borderColor: e ? "primary.main" : "divider",
	borderRadius: 2,
	p: 1,
	cursor: "pointer",
	bgcolor: e ? "action.selected" : "background.paper",
	transition: "all 0.15s",
	"&:hover": { borderColor: e ? "primary.main" : "text.secondary" }
}), Su = {
	display: "flex",
	gap: .5,
	justifyContent: "center",
	mb: .75
}, Cu = {
	width: 80,
	height: 100,
	objectFit: "cover",
	borderRadius: 4
}, wu = ({ open: e, onClose: t, selectedId: n, onSelect: r }) => {
	let [i, a] = L([]), [o, s] = L("");
	return P(() => {
		e && be().then(a).catch((e) => s(e.message));
	}, [e]), /* @__PURE__ */ V(Ut, {
		open: e,
		onClose: t,
		maxWidth: "md",
		fullWidth: !0,
		slotProps: { paper: { sx: vu } },
		children: [/* @__PURE__ */ V(Kt, {
			sx: yu,
			children: ["Select HRTF Subject", /* @__PURE__ */ B(Jt, {
				onClick: t,
				size: "small",
				"aria-label": "close",
				children: "✕"
			})]
		}), /* @__PURE__ */ V(Gt, { children: [o && /* @__PURE__ */ B("div", {
			style: {
				color: "red",
				marginBottom: 8
			},
			children: o
		}), /* @__PURE__ */ B(H, {
			sx: bu,
			children: i.map((e) => /* @__PURE__ */ V(H, {
				onClick: () => {
					r(e.id), t();
				},
				sx: xu(e.id === n),
				children: [
					/* @__PURE__ */ V(H, {
						sx: Su,
						children: [e.thumbnailLeft && /* @__PURE__ */ B("img", {
							src: ye(e.thumbnailLeft),
							alt: `${e.id} left ear`,
							style: Cu
						}), e.thumbnailRight && /* @__PURE__ */ B("img", {
							src: ye(e.thumbnailRight),
							alt: `${e.id} right ear`,
							style: Cu
						})]
					}),
					/* @__PURE__ */ B(H, {
						sx: {
							fontWeight: 600,
							fontSize: 12,
							textAlign: "center"
						},
						children: e.name
					}),
					/* @__PURE__ */ B(H, {
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
}, Tu = {
	display: "flex",
	gap: .5,
	px: .5,
	py: .5,
	borderBottom: "1px solid",
	borderColor: "divider"
}, Eu = {
	flex: 1,
	minWidth: 0,
	py: .25,
	fontSize: "0.7rem",
	textTransform: "none"
};
function Du({ onPlayPause: e, onStop: t, onReset: n, isRunning: r = !1, canRun: i = !0, hasResults: a = !1 }) {
	return /* @__PURE__ */ V(H, {
		sx: Tu,
		children: [
			e && /* @__PURE__ */ B(Jn, {
				title: r ? "Pause simulation" : "Start simulation",
				placement: "top",
				children: /* @__PURE__ */ B("span", {
					style: {
						flex: 1,
						display: "flex"
					},
					children: /* @__PURE__ */ B(ln, {
						variant: r ? "contained" : "outlined",
						size: "small",
						sx: Eu,
						onClick: e,
						disabled: !i,
						startIcon: B(r ? nr : Qn, { sx: { fontSize: 16 } }),
						children: r ? "Pause" : "Run"
					})
				})
			}),
			t && /* @__PURE__ */ B(Jn, {
				title: "Stop and discard in-progress pass",
				placement: "top",
				children: /* @__PURE__ */ B("span", {
					style: {
						flex: 1,
						display: "flex"
					},
					children: /* @__PURE__ */ B(ln, {
						variant: "outlined",
						size: "small",
						sx: Eu,
						onClick: t,
						disabled: !r,
						startIcon: /* @__PURE__ */ B(rr, { sx: { fontSize: 16 } }),
						children: "Stop"
					})
				})
			}),
			n && /* @__PURE__ */ B(Jn, {
				title: "Clear all traced rays and results",
				placement: "top",
				children: /* @__PURE__ */ B("span", {
					style: {
						flex: 1,
						display: "flex"
					},
					children: /* @__PURE__ */ B(ln, {
						variant: "outlined",
						size: "small",
						sx: Eu,
						onClick: n,
						disabled: !a || r,
						startIcon: /* @__PURE__ */ B(ir, { sx: { fontSize: 16 } }),
						children: "Reset"
					})
				})
			})
		]
	});
}
//#endregion
//#region src/components/parameter-config/property-row/SectionLabel.tsx
var Ou = {
	py: .5,
	borderBottom: "1px solid",
	borderColor: "divider"
}, ku = {
	fontSize: "0.75rem",
	fontWeight: 500,
	color: "text.secondary",
	pl: "4px"
};
function Q({ label: e }) {
	return /* @__PURE__ */ B(H, {
		sx: Ou,
		children: /* @__PURE__ */ B(U, {
			sx: ku,
			children: e
		})
	});
}
//#endregion
//#region src/components/parameter-config/RayTracerTab.tsx
var { PropertyTextInput: Au, PropertyNumberInput: ju, PropertyCheckboxInput: Mu } = au("RAYTRACER_SET_PROPERTY"), Nu = {
	width: "100%",
	"& .MuiToggleButton-root": {
		flex: 1,
		py: .25,
		fontSize: "0.7rem",
		textTransform: "none",
		fontWeight: 500
	}
}, Pu = {
	px: .5,
	py: .5
}, Fu = {
	display: "flex",
	alignItems: "center",
	gap: .25,
	flex: 1
}, Iu = {
	fontSize: "0.6rem",
	color: "text.disabled",
	minWidth: 10,
	textAlign: "center"
}, Lu = [
	"125",
	"250",
	"500",
	"1k",
	"2k",
	"4k",
	"8k"
], Ru = {
	display: "grid",
	gridTemplateColumns: "repeat(7, 1fr)",
	gap: 0,
	px: .5,
	mb: .5
}, zu = {
	fontSize: "0.6rem",
	color: "text.disabled",
	textAlign: "center",
	pb: .25
}, Bu = {
	fontSize: "0.7rem",
	fontFamily: "monospace",
	color: "text.primary",
	textAlign: "center"
}, Vu = ({ uuid: e }) => {
	let [t] = Z(e, "isRunning", "RAYTRACER_SET_PROPERTY"), [n] = Z(e, "validRayCount", "RAYTRACER_SET_PROPERTY"), [r] = Z(e, "gpuEnabled", "RAYTRACER_SET_PROPERTY"), [i] = Z(e, "runningWithoutReceivers", "RAYTRACER_SET_PROPERTY"), [o] = Z(e, "impulseResponsePlaying", "RAYTRACER_SET_PROPERTY"), [s] = Z(e, "binauralPlaying", "RAYTRACER_SET_PROPERTY"), [c] = Z(e, "hrtfSubjectId", "RAYTRACER_SET_PROPERTY"), [l] = Z(e, "convergenceMetrics", "RAYTRACER_SET_PROPERTY"), [u, d] = Z(e, "headYaw", "RAYTRACER_SET_PROPERTY"), [f, p] = Z(e, "headPitch", "RAYTRACER_SET_PROPERTY"), [m, h] = Z(e, "headRoll", "RAYTRACER_SET_PROPERTY"), g = F(() => xe(), []), [_, v] = L("1"), [y, b] = L("1"), [x, S] = L(!1), [C, w] = L("");
	P(() => {
		let e = c || "D1";
		be().then((t) => {
			let n = t.find((t) => t.id === e);
			w(n ? n.name : e);
		}).catch(() => w(e));
	}, [c]);
	let T = !!n && n > 0, D = !r, O = l && Number.isFinite(l.convergenceRatio) ? (l.convergenceRatio * 100).toFixed(1) + "%" : "--", ee = l?.estimatedT30 ? l.estimatedT30.map((e) => e > 0 ? e.toFixed(2) : "--") : null, te = N(() => {
		a("RAYTRACER_SET_PROPERTY", {
			uuid: e,
			property: "isRunning",
			value: !t
		});
	}, [e, t]), ne = N(() => {
		a("RAYTRACER_SET_PROPERTY", {
			uuid: e,
			property: "isRunning",
			value: !1
		});
	}, [e]), k = N(() => {
		a("RAYTRACER_CLEAR_RAYS", e);
	}, [e]), re = N((t, n) => {
		n !== null && a("RAYTRACER_SET_PROPERTY", {
			uuid: e,
			property: "gpuEnabled",
			value: n === "gpu"
		});
	}, [e]), ie = N(() => {
		a("RAYTRACER_DOWNLOAD_AMBISONIC_IR", {
			uuid: e,
			order: parseInt(_)
		});
	}, [e, _]), ae = N(() => {
		a("RAYTRACER_PLAY_BINAURAL_IR", {
			uuid: e,
			order: parseInt(y)
		});
	}, [e, y]), oe = N(() => {
		a("RAYTRACER_DOWNLOAD_BINAURAL_IR", {
			uuid: e,
			order: parseInt(y)
		});
	}, [e, y]), se = N((t) => {
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
	return P(() => {
		let t = E.overlays.global.cells, n = e + "-valid-ray-count";
		return t.has(n) && t.get(n).show(), () => {
			t.has(n) && t.get(n).hide();
		};
	}, [e]), /* @__PURE__ */ V("div", { children: [
		/* @__PURE__ */ B(Du, {
			onPlayPause: te,
			onStop: ne,
			onReset: k,
			isRunning: !!t,
			canRun: !0,
			hasResults: T
		}),
		/* @__PURE__ */ B(H, {
			sx: Pu,
			children: /* @__PURE__ */ V(tr, {
				value: r && g ? "gpu" : "cpu",
				exclusive: !0,
				onChange: re,
				size: "small",
				sx: Nu,
				children: [/* @__PURE__ */ B(er, {
					value: "cpu",
					children: "CPU"
				}), /* @__PURE__ */ B(Jn, {
					title: g ? "" : "WebGPU is not supported in this browser",
					placement: "top",
					children: /* @__PURE__ */ B("span", {
						style: {
							flex: 1,
							display: "flex"
						},
						children: /* @__PURE__ */ B(er, {
							value: "gpu",
							disabled: !g,
							sx: { flex: 1 },
							children: "GPU"
						})
					})
				})]
			})
		}),
		/* @__PURE__ */ B(Q, { label: "Source / Receiver Pairs" }),
		/* @__PURE__ */ B(Mu, {
			uuid: e,
			label: "Ignore Receivers",
			property: "runningWithoutReceivers",
			tooltip: "Run rays without checking receiver intersections — useful for visualization-only mode"
		}),
		/* @__PURE__ */ B(_u, {
			uuid: e,
			disabled: i
		}),
		/* @__PURE__ */ B(Q, { label: "Parameters" }),
		/* @__PURE__ */ B(ju, {
			uuid: e,
			label: "Order",
			property: "reflectionOrder",
			tooltip: "Maximum number of specular reflections each ray can undergo before termination"
		}),
		/* @__PURE__ */ B(ju, {
			uuid: e,
			label: "Max Paths",
			property: "maxStoredPaths",
			tooltip: "Maximum valid paths stored per source-receiver pair. Oldest paths are evicted when the buffer is full.",
			elementProps: {
				step: 1e3,
				min: 1
			}
		}),
		/* @__PURE__ */ B(Mu, {
			uuid: e,
			label: "Edge Diffraction",
			property: "edgeDiffractionEnabled",
			tooltip: "Uniform Theory of Diffraction (UTD) — models sound bending around convex edges using Keller's geometrical theory, adding diffracted contributions at each wedge."
		}),
		D && /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B(ju, {
			uuid: e,
			label: "Rate (ms)",
			property: "updateInterval",
			tooltip: "Interval between ray-tracing callbacks in milliseconds. Lower values give faster visual feedback but use more CPU."
		}), /* @__PURE__ */ B(ju, {
			uuid: e,
			label: "Passes",
			property: "passes",
			tooltip: "Number of rays launched per callback interval. Higher values improve convergence speed at the cost of UI responsiveness."
		})] }),
		!D && /* @__PURE__ */ B(ju, {
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
		/* @__PURE__ */ B(Mu, {
			uuid: e,
			label: "Hybrid Method",
			property: "hybrid",
			tooltip: "Combines deterministic image-source calculation for early reflections with stochastic ray tracing for late reflections, improving accuracy at low orders."
		}),
		/* @__PURE__ */ B(Au, {
			uuid: e,
			label: "Transition Order",
			property: "transitionOrder",
			tooltip: "Reflection order at which the solver switches from image-source to ray tracing in hybrid mode"
		}),
		/* @__PURE__ */ B(Mu, {
			uuid: e,
			label: "Late Reverb Tail",
			property: "lateReverbTailEnabled",
			tooltip: "Synthesize a stochastic noise tail to extend the impulse response beyond the ray-traced data, using energy decay parameters estimated from the simulation."
		}),
		/* @__PURE__ */ B(ju, {
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
		/* @__PURE__ */ B(ju, {
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
		/* @__PURE__ */ B(Q, { label: "Convergence" }),
		/* @__PURE__ */ B(Mu, {
			uuid: e,
			label: "Auto-Stop",
			property: "autoStop",
			tooltip: "Automatically halt the simulation when the coefficient of variation of T30 estimates across octave bands falls below the threshold"
		}),
		/* @__PURE__ */ B(ju, {
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
		/* @__PURE__ */ B(ju, {
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
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Conv. Ratio",
			hasToolTip: !0,
			tooltip: "Current maximum coefficient of variation of T30 across all octave bands — decreases toward the threshold as more rays are traced"
		}), /* @__PURE__ */ B(H, {
			sx: {
				fontSize: "0.75rem",
				fontFamily: "monospace",
				px: 1,
				color: "text.primary",
				textAlign: "center"
			},
			children: O
		})] }),
		/* @__PURE__ */ B(Q, { label: "Est. T30" }),
		/* @__PURE__ */ V(H, {
			sx: Ru,
			children: [Lu.map((e) => /* @__PURE__ */ B(H, {
				sx: zu,
				children: e
			}, e)), ee ? ee.map((e, t) => /* @__PURE__ */ B(H, {
				sx: Bu,
				children: e
			}, t)) : Lu.map((e, t) => /* @__PURE__ */ B(H, {
				sx: Bu,
				children: "--"
			}, t))]
		}),
		/* @__PURE__ */ B(Q, { label: "Visualization" }),
		/* @__PURE__ */ B(ju, {
			uuid: e,
			label: "Point Size",
			property: "pointSize",
			tooltip: "Radius in pixels of each surface intersection point rendered in the viewport"
		}),
		/* @__PURE__ */ B(Mu, {
			uuid: e,
			label: "Rays Visible",
			property: "raysVisible",
			tooltip: "Show or hide ray path lines in the 3D viewport"
		}),
		/* @__PURE__ */ B(Mu, {
			uuid: e,
			label: "Points Visible",
			property: "pointsVisible",
			tooltip: "Show or hide intersection points where rays hit surfaces"
		}),
		/* @__PURE__ */ B(Q, { label: "Impulse Response" }),
		/* @__PURE__ */ B(ou, {
			event: "RAYTRACER_PLAY_IR",
			args: e,
			label: "Play",
			tooltip: "Auralise the broadband impulse response through the default audio output",
			disabled: o
		}),
		/* @__PURE__ */ B(ou, {
			event: "RAYTRACER_DOWNLOAD_IR",
			args: e,
			label: "Download",
			tooltip: "Export the broadband impulse response as a mono WAV file"
		}),
		/* @__PURE__ */ B(ou, {
			event: "RAYTRACER_DOWNLOAD_IR_OCTAVE",
			args: e,
			label: "Download by Octave",
			tooltip: "Export separate WAV files for each octave-band filtered impulse response"
		}),
		/* @__PURE__ */ B(Q, { label: "Ambisonic Output" }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Order",
			hasToolTip: !0,
			tooltip: "Ambisonic order — 1st (4 ch FOA), 2nd (9 ch HOA), or 3rd (16 ch HOA). Higher orders capture finer spatial detail."
		}), /* @__PURE__ */ B(al, {
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
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "",
			hasToolTip: !0,
			tooltip: "Download a multi-channel WAV in ACN channel order with N3D normalisation"
		}), /* @__PURE__ */ B(pl, {
			onClick: ie,
			label: "Download",
			disabled: !T
		})] }),
		/* @__PURE__ */ B(Q, { label: "Binaural Output" }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Order",
			hasToolTip: !0,
			tooltip: "Ambisonic order used for binaural decoding via HRTF convolution"
		}), /* @__PURE__ */ B(al, {
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
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "HRTF Subject",
			hasToolTip: !0,
			tooltip: "Head-Related Transfer Function dataset used for spatial audio rendering — different subjects have different ear geometries"
		}), /* @__PURE__ */ B(pl, {
			onClick: () => S(!0),
			label: C || c || "D1"
		})] }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Head Orientation",
			hasToolTip: !0,
			tooltip: "Listener head rotation in degrees — Yaw: horizontal (positive = left), Pitch: vertical (positive = up), Roll: tilt (positive = right ear down)"
		}), /* @__PURE__ */ V(H, {
			sx: Fu,
			children: [
				/* @__PURE__ */ B(H, {
					component: "span",
					sx: Iu,
					children: "Y"
				}),
				/* @__PURE__ */ B(el, {
					value: u ?? 0,
					onChange: ({ value: e }) => d(e),
					step: 5,
					min: -180,
					max: 180
				}),
				/* @__PURE__ */ B(H, {
					component: "span",
					sx: Iu,
					children: "P"
				}),
				/* @__PURE__ */ B(el, {
					value: f ?? 0,
					onChange: ({ value: e }) => p(e),
					step: 5,
					min: -90,
					max: 90
				}),
				/* @__PURE__ */ B(H, {
					component: "span",
					sx: Iu,
					children: "R"
				}),
				/* @__PURE__ */ B(el, {
					value: m ?? 0,
					onChange: ({ value: e }) => h(e),
					step: 5,
					min: -90,
					max: 90
				})
			]
		})] }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, { label: "" }), /* @__PURE__ */ B(pl, {
			onClick: ae,
			label: "Play Binaural",
			disabled: !T || s
		})] }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, { label: "" }), /* @__PURE__ */ B(pl, {
			onClick: oe,
			label: "Download Stereo WAV",
			disabled: !T
		})] }),
		/* @__PURE__ */ B(wu, {
			open: x,
			onClose: () => S(!1),
			selectedId: c || "D1",
			onSelect: se
		})
	] });
}, { PropertyNumberInput: Hu, PropertyCheckboxInput: Uu } = au("IMAGESOURCE_SET_PROPERTY"), Wu = ({ uuid: e }) => {
	let t = N(() => {
		a("UPDATE_IMAGESOURCE", e);
	}, [e]), n = N(() => {
		a("RESET_IMAGESOURCE", e);
	}, [e]);
	return /* @__PURE__ */ V("div", { children: [
		/* @__PURE__ */ B(Du, {
			onPlayPause: t,
			onReset: n,
			canRun: !0,
			hasResults: !0
		}),
		/* @__PURE__ */ B(Q, { label: "Calculation" }),
		/* @__PURE__ */ B(Hu, {
			uuid: e,
			label: "Maximum Order",
			property: "maxReflectionOrderReset",
			tooltip: "Maximum image-source reflection depth. Each order mirrors the source across every surface, producing deterministic specular paths — computation grows exponentially with order."
		}),
		/* @__PURE__ */ B(Q, { label: "Source / Receiver Pairs" }),
		/* @__PURE__ */ B(_u, {
			uuid: e,
			eventType: "IMAGESOURCE_SET_PROPERTY"
		}),
		/* @__PURE__ */ B(Q, { label: "Visualization" }),
		/* @__PURE__ */ B(Uu, {
			uuid: e,
			label: "Show Sources",
			property: "imageSourcesVisible",
			tooltip: "Display virtual image sources in the 3D viewport — mirrored copies of the source generated at each reflection order"
		}),
		/* @__PURE__ */ B(Uu, {
			uuid: e,
			label: "Show Paths",
			property: "rayPathsVisible",
			tooltip: "Display specular reflection paths from source to receiver through each image-source mirror sequence"
		}),
		/* @__PURE__ */ B(Q, { label: "Impulse Response" }),
		/* @__PURE__ */ B(ou, {
			event: "IMAGESOURCE_PLAY_IR",
			args: e,
			label: "Play",
			tooltip: "Auralise the impulse response computed from deterministic image-source reflections",
			disabled: !1
		}),
		/* @__PURE__ */ B(ou, {
			event: "IMAGESOURCE_DOWNLOAD_IR",
			args: e,
			label: "Download",
			tooltip: "Export the impulse response as a mono WAV file"
		}),
		/* @__PURE__ */ B(Q, { label: "Developer" }),
		/* @__PURE__ */ B(ou, {
			event: "CALCULATE_LTP",
			args: e,
			label: "Calculate LTP",
			tooltip: "Compute Level-Time Progression — energy arrival over time from image-source paths, useful for analysing early reflection structure"
		})
	] });
}, { PropertyNumberInput: Gu } = au("RT60_SET_PROPERTY"), Ku = ({ uuid: e }) => {
	let { noResults: t } = f(M((t) => c(["noResults"], t.solvers[e]))), [, r] = Ht((e) => e + 1, 0);
	return P(() => n("UPDATE_RT60", (e) => {
		r();
	}), [r]), /* @__PURE__ */ V("div", { children: [
		/* @__PURE__ */ B(Q, { label: "Settings" }),
		/* @__PURE__ */ B(Gu, {
			uuid: e,
			label: "Room Volume",
			property: "displayVolume",
			tooltip: "Override the automatically computed room volume (m³). Used in Sabine, Eyring, and Fitzroy reverberation time formulas.",
			elementProps: { step: .01 }
		}),
		/* @__PURE__ */ B(Q, { label: "Export" }),
		/* @__PURE__ */ B(ou, {
			event: "DOWNLOAD_RT60_RESULTS",
			args: e,
			label: "Download RT Results",
			disabled: t,
			tooltip: "Export reverberation time results (T20, T30, EDT) per octave band as a CSV file"
		})
	] });
}, qu = ({ uuid: e }) => /* @__PURE__ */ V("div", { children: [
	/* @__PURE__ */ B(Q, { label: "Input" }),
	/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, { label: "Upload IR" }), /* @__PURE__ */ B("div", {
		style: { alignItems: "center" },
		children: /* @__PURE__ */ B("input", {
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
	/* @__PURE__ */ B(ou, {
		event: "CALCULATE_AC_PARAMS",
		args: e,
		label: "Calculate Parameters",
		tooltip: "Derive acoustical parameters (T20, T30, EDT, C50, C80, D50, D80, Ts) from the uploaded impulse response using Schroeder backward integration"
	})
] }), { PropertyNumberInput: Ju } = au("BEAMTRACE_SET_PROPERTY"), Yu = {
	display: "flex",
	alignItems: "center",
	gap: 1,
	px: 1,
	py: .5,
	borderBottom: "1px solid",
	borderColor: "divider",
	minHeight: 28
}, Xu = (e) => ({
	fontSize: "0.7rem",
	color: e ? "warning.main" : "text.secondary",
	fontWeight: e ? 500 : 400
}), Zu = [
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
], Qu = {
	display: "flex",
	alignItems: "center",
	gap: .25,
	flex: 1
}, $u = {
	fontSize: "0.6rem",
	color: "text.disabled",
	minWidth: 10,
	textAlign: "center"
}, ed = [
	"125",
	"250",
	"500",
	"1k",
	"2k",
	"4k",
	"8k"
], td = {
	display: "grid",
	gridTemplateColumns: "repeat(7, 1fr)",
	gap: 0,
	px: .5,
	mb: .5
}, nd = {
	fontSize: "0.6rem",
	color: "text.disabled",
	textAlign: "center",
	pb: .25
}, rd = {
	fontSize: "0.7rem",
	fontFamily: "monospace",
	color: "text.primary",
	textAlign: "center"
}, id = ({ percent: e, overflow: t }) => {
	let n = t ? "#ff4444" : e > 80 ? "#ffaa00" : "#44aa44";
	return /* @__PURE__ */ B("div", {
		style: {
			width: "60px",
			height: "8px",
			background: "#333",
			borderRadius: "4px",
			overflow: "hidden",
			marginRight: "8px"
		},
		children: /* @__PURE__ */ B("div", { style: {
			width: `${Math.min(e, 100)}%`,
			height: "100%",
			background: n,
			transition: "width 0.2s"
		} })
	});
}, ad = ({ uuid: e }) => {
	let t = f((t) => t.solvers[e]), [n] = Z(e, "visualizationMode", "BEAMTRACE_SET_PROPERTY");
	return P(() => {
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
}, od = ({ uuid: e }) => {
	let [t, r] = L(!1), [i, o] = L(!1), [, s] = Ht((e) => e + 1, 0), c = f((t) => t.solvers[e]), l = c?.numValidPaths || 0, u = c?.lastMetrics, d = u?.bufferUsage, p = l > 0, m = !p, h = (() => {
		let e = c?.responseByIntensity;
		if (e) {
			let t = Object.keys(e)[0];
			if (t) {
				let n = Object.keys(e[t])[0];
				if (n && e[t][n].t30) return e[t][n].t30.map((e) => e.m < 0 ? (-60 / e.m).toFixed(2) : "--");
			}
		}
		return c?.estimatedT30 ? c.estimatedT30.map((e) => e > 0 ? e.toFixed(2) : "--") : null;
	})(), [g, _] = Z(e, "visualizationMode", "BEAMTRACE_SET_PROPERTY"), [v, y] = Z(e, "showAllBeams", "BEAMTRACE_SET_PROPERTY"), b = g === "beams" || g === "both", [x, S] = L("1"), [C, w] = L("1"), [T, E] = L(!1), [D, O] = L(""), [ee] = Z(e, "hrtfSubjectId", "BEAMTRACE_SET_PROPERTY"), [te, ne] = Z(e, "headYaw", "BEAMTRACE_SET_PROPERTY"), [k, re] = Z(e, "headPitch", "BEAMTRACE_SET_PROPERTY"), [ie, ae] = Z(e, "headRoll", "BEAMTRACE_SET_PROPERTY"), [oe] = Z(e, "binauralPlaying", "BEAMTRACE_SET_PROPERTY"), [se, A] = Z(e, "edgeDiffractionEnabled", "BEAMTRACE_SET_PROPERTY"), [ce, le] = Z(e, "lateReverbTailEnabled", "BEAMTRACE_SET_PROPERTY");
	P(() => {
		let e = ee || "D1";
		be().then((t) => {
			let n = t.find((t) => t.id === e);
			O(n ? n.name : e);
		}).catch(() => O(e));
	}, [ee]), P(() => {
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
	let ue = N(() => {
		r(!0), a("BEAMTRACE_CALCULATE", e);
	}, [e]), de = N(() => {
		a("BEAMTRACE_RESET", e);
	}, [e]), fe = N(() => {
		a("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", {
			uuid: e,
			order: parseInt(x)
		});
	}, [e, x]), pe = N(() => {
		a("BEAMTRACE_PLAY_BINAURAL_IR", {
			uuid: e,
			order: parseInt(C)
		});
	}, [e, C]), me = N(() => {
		a("BEAMTRACE_DOWNLOAD_BINAURAL_IR", {
			uuid: e,
			order: parseInt(C)
		});
	}, [e, C]), he = N(() => {
		o(!0), a("BEAMTRACE_QUICK_ESTIMATE", e);
	}, [e]), ge = N((t) => {
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
	return /* @__PURE__ */ V("div", { children: [
		/* @__PURE__ */ B(ad, { uuid: e }),
		/* @__PURE__ */ V(H, {
			sx: Yu,
			children: [
				t ? /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B(ar, {
					size: 12,
					thickness: 5,
					color: "warning"
				}), /* @__PURE__ */ B(U, {
					sx: Xu(!0),
					children: "Unfolding surfaces..."
				})] }) : p ? /* @__PURE__ */ V(U, {
					sx: Xu(!1),
					children: [
						l.toLocaleString(),
						" path",
						l === 1 ? "" : "s",
						" found"
					]
				}) : /* @__PURE__ */ B(U, {
					sx: Xu(!1),
					children: "Ready"
				}),
				/* @__PURE__ */ B(H, { sx: { flex: 1 } }),
				!t && /* @__PURE__ */ B(U, {
					component: "span",
					onClick: ue,
					sx: {
						fontSize: "0.65rem",
						color: "primary.main",
						cursor: "pointer",
						"&:hover": { textDecoration: "underline" }
					},
					children: "Recalculate"
				}),
				p && !t && /* @__PURE__ */ B(U, {
					component: "span",
					onClick: de,
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
		/* @__PURE__ */ B(Q, { label: "Calculation" }),
		/* @__PURE__ */ B(Ju, {
			uuid: e,
			label: "Max Reflection Order",
			property: "maxReflectionOrderReset",
			tooltip: "Maximum surface-unfolding depth. All valid specular paths are found deterministically and instantaneously via geometric surface unfolding — no stochastic sampling. Complexity grows with order; 1–6 recommended."
		}),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Edge Diffraction",
			hasToolTip: !0,
			tooltip: "Uniform Theory of Diffraction (UTD) — models sound bending around convex edges, adding diffracted contributions at each room edge"
		}), /* @__PURE__ */ B(Xc, {
			value: se || !1,
			onChange: ({ value: e }) => A(e)
		})] }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "",
			hasToolTip: !0,
			tooltip: "Shoot 500 random rays to quickly estimate RT60 per octave band"
		}), /* @__PURE__ */ B(pl, {
			onClick: he,
			label: i ? "Estimating..." : "Quick Estimate",
			disabled: i
		})] }),
		/* @__PURE__ */ B(Q, { label: "Source / Receiver Pairs" }),
		/* @__PURE__ */ B(_u, {
			uuid: e,
			eventType: "BEAMTRACE_SET_PROPERTY"
		}),
		/* @__PURE__ */ B(Q, { label: "Visualization" }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Display Mode",
			hasToolTip: !0,
			tooltip: "Visualization style: ray paths show specular reflection chains, beam cones show the volumetric unfolded regions, or both overlaid"
		}), /* @__PURE__ */ B(al, {
			value: g || "rays",
			onChange: _,
			options: Zu
		})] }),
		b && /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Show All Beams",
			hasToolTip: !0,
			tooltip: "Display all unfolded beam cones including geometrically invalid or orphaned ones — useful for debugging surface-unfolding coverage"
		}), /* @__PURE__ */ B(Xc, {
			value: v || !1,
			onChange: ({ value: e }) => y(e)
		})] }),
		/* @__PURE__ */ B(Q, { label: "Statistics" }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, { label: "Valid Paths" }), /* @__PURE__ */ B(H, {
			sx: {
				fontSize: "0.75rem",
				fontFamily: "monospace",
				px: 1,
				color: "text.primary",
				textAlign: "center"
			},
			children: l
		})] }),
		u && /* @__PURE__ */ V(z, { children: [
			/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, { label: "Raycasts" }), /* @__PURE__ */ B(H, {
				sx: {
					fontSize: "0.75rem",
					fontFamily: "monospace",
					px: 1,
					color: "text.primary",
					textAlign: "center"
				},
				children: u.raycastCount
			})] }),
			/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, { label: "Cache Hits" }), /* @__PURE__ */ B(H, {
				sx: {
					fontSize: "0.75rem",
					fontFamily: "monospace",
					px: 1,
					color: "text.primary",
					textAlign: "center"
				},
				children: u.failPlaneCacheHits
			})] }),
			/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, { label: "Buckets Skipped" }), /* @__PURE__ */ B(H, {
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
		d && /* @__PURE__ */ V(z, { children: [
			/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
				label: "Lines Buffer",
				hasToolTip: !0,
				tooltip: `${d.linesUsed.toLocaleString()} / ${d.linesCapacity.toLocaleString()} vertices`
			}), /* @__PURE__ */ V("div", {
				style: {
					display: "flex",
					alignItems: "center",
					padding: "4px 8px"
				},
				children: [/* @__PURE__ */ B(id, {
					percent: d.linesPercent,
					overflow: d.overflowWarning
				}), /* @__PURE__ */ V("span", {
					style: {
						fontSize: "11px",
						color: d.linesPercent > 80 ? "#ffaa00" : "#888"
					},
					children: [d.linesPercent.toFixed(1), "%"]
				})]
			})] }),
			/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
				label: "Points Buffer",
				hasToolTip: !0,
				tooltip: `${d.pointsUsed.toLocaleString()} / ${d.pointsCapacity.toLocaleString()} points`
			}), /* @__PURE__ */ V("div", {
				style: {
					display: "flex",
					alignItems: "center",
					padding: "4px 8px"
				},
				children: [/* @__PURE__ */ B(id, {
					percent: d.pointsPercent,
					overflow: d.overflowWarning
				}), /* @__PURE__ */ V("span", {
					style: {
						fontSize: "11px",
						color: d.pointsPercent > 80 ? "#ffaa00" : "#888"
					},
					children: [d.pointsPercent.toFixed(1), "%"]
				})]
			})] }),
			d.overflowWarning && /* @__PURE__ */ B(Y, { children: /* @__PURE__ */ B("span", {
				style: {
					color: "#ff4444",
					fontSize: "11px",
					padding: "4px 8px"
				},
				children: "Buffer overflow! Reduce reflection order."
			}) })
		] }),
		/* @__PURE__ */ B(Q, { label: "Est. T30" }),
		/* @__PURE__ */ V(H, {
			sx: td,
			children: [ed.map((e) => /* @__PURE__ */ B(H, {
				sx: nd,
				children: e
			}, e)), h ? h.map((e, t) => /* @__PURE__ */ B(H, {
				sx: rd,
				children: e
			}, t)) : ed.map((e, t) => /* @__PURE__ */ B(H, {
				sx: rd,
				children: "--"
			}, t))]
		}),
		/* @__PURE__ */ B(Q, { label: "Impulse Response" }),
		/* @__PURE__ */ B(ou, {
			event: "BEAMTRACE_PLAY_IR",
			args: e,
			label: "Play",
			tooltip: "Auralise the impulse response computed from beam-traced specular paths",
			disabled: m
		}),
		/* @__PURE__ */ B(ou, {
			event: "BEAMTRACE_DOWNLOAD_IR",
			args: e,
			label: "Download",
			tooltip: "Export the impulse response as a mono WAV file",
			disabled: m
		}),
		/* @__PURE__ */ B(ou, {
			event: "BEAMTRACE_DOWNLOAD_OCTAVE_IR",
			args: e,
			label: "Download by Octave",
			tooltip: "Export per-octave-band impulse responses as individual WAV files",
			disabled: m
		}),
		/* @__PURE__ */ B(Q, { label: "Late Reverberation" }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Late Reverb Tail",
			hasToolTip: !0,
			tooltip: "Synthesize a noise tail extending the IR beyond specular paths, using energy decay parameters estimated from the computed paths"
		}), /* @__PURE__ */ B(Xc, {
			value: ce || !1,
			onChange: ({ value: e }) => le(e)
		})] }),
		/* @__PURE__ */ B(Ju, {
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
		/* @__PURE__ */ B(Ju, {
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
		/* @__PURE__ */ B(Q, { label: "Ambisonic Output" }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Order",
			hasToolTip: !0,
			tooltip: "Ambisonic order — 1st (4 ch FOA), 2nd (9 ch HOA), or 3rd (16 ch HOA). Higher orders capture finer spatial detail."
		}), /* @__PURE__ */ B(al, {
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
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "",
			hasToolTip: !0,
			tooltip: "Download a multi-channel WAV in ACN channel order with N3D normalisation"
		}), /* @__PURE__ */ B(pl, {
			onClick: fe,
			label: "Download",
			disabled: m
		})] }),
		/* @__PURE__ */ B(Q, { label: "Binaural Output" }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Order",
			hasToolTip: !0,
			tooltip: "Ambisonic order used for binaural decoding via HRTF convolution"
		}), /* @__PURE__ */ B(al, {
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
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "HRTF Subject",
			hasToolTip: !0,
			tooltip: "Head-Related Transfer Function dataset used for spatial audio rendering — different subjects have different ear geometries"
		}), /* @__PURE__ */ B(pl, {
			onClick: () => E(!0),
			label: D || ee || "D1"
		})] }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Head Orientation",
			hasToolTip: !0,
			tooltip: "Listener head rotation in degrees — Yaw: horizontal (positive = left), Pitch: vertical (positive = up), Roll: tilt (positive = right ear down)"
		}), /* @__PURE__ */ V(H, {
			sx: Qu,
			children: [
				/* @__PURE__ */ B(H, {
					component: "span",
					sx: $u,
					children: "Y"
				}),
				/* @__PURE__ */ B(el, {
					value: te ?? 0,
					onChange: ({ value: e }) => ne(e),
					step: 5,
					min: -180,
					max: 180
				}),
				/* @__PURE__ */ B(H, {
					component: "span",
					sx: $u,
					children: "P"
				}),
				/* @__PURE__ */ B(el, {
					value: k ?? 0,
					onChange: ({ value: e }) => re(e),
					step: 5,
					min: -90,
					max: 90
				}),
				/* @__PURE__ */ B(H, {
					component: "span",
					sx: $u,
					children: "R"
				}),
				/* @__PURE__ */ B(el, {
					value: ie ?? 0,
					onChange: ({ value: e }) => ae(e),
					step: 5,
					min: -90,
					max: 90
				})
			]
		})] }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, { label: "" }), /* @__PURE__ */ B(pl, {
			onClick: pe,
			label: "Play Binaural",
			disabled: m || oe
		})] }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, { label: "" }), /* @__PURE__ */ B(pl, {
			onClick: me,
			label: "Download Stereo WAV",
			disabled: m
		})] }),
		/* @__PURE__ */ B(wu, {
			open: T,
			onClose: () => E(!1),
			selectedId: ee || "D1",
			onSelect: ge
		})
	] });
}, sd = {
	display: "grid",
	gridTemplateColumns: "1fr 2fr 1fr",
	alignItems: "center",
	fontSize: "0.75rem",
	userSelect: "none"
}, cd = {
	textAlign: "right",
	minWidth: "100px",
	pr: 1
}, ld = {
	fontSize: "0.75rem",
	color: "text.secondary"
}, ud = {
	display: "flex",
	alignItems: "center",
	gap: .5,
	mx: 1
}, dd = {
	flex: 1,
	mx: .5,
	"& .MuiSlider-thumb": {
		width: 12,
		height: 12
	},
	"& .MuiSlider-track": { height: 4 },
	"& .MuiSlider-rail": { height: 4 }
}, fd = {
	p: .25,
	minWidth: 20,
	width: 20,
	height: 20,
	"& .MuiSvgIcon-root": { fontSize: 14 }
}, pd = {
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
}, md = (e) => Number.isInteger(e) ? 0 : e.toString().split(".").slice(-1)[0].length, hd = (e, t, n) => e < t ? t : e > n ? n : e;
function gd({ id: e, value: t, onChange: n, min: r, max: i, step: a, label: o, tooltipText: s, hasToolTip: c }) {
	let l = md(a), [u, d] = L(Number(t.toFixed(l))), [f, p] = L(!1), m = N((t, r) => {
		let i = Array.isArray(r) ? r[0] : r;
		d(i), n({
			id: e,
			value: i
		});
	}, [e, n]), h = N(() => {
		let t = hd(u - a, r, i);
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
	]), g = N(() => {
		let t = hd(u + a, r, i);
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
	]), _ = N((e) => {
		let t = e.currentTarget.value;
		d(Number(t === "." ? "0." : t));
	}, []), v = N(() => {
		p(!1);
		let t = hd(Number(u.toFixed(l)), r, i);
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
	]), y = N((e) => {
		e.key === "Enter" ? e.target.blur() : e.key === "Escape" && (d(t), e.target.blur());
	}, [t]), b = /* @__PURE__ */ B(U, {
		sx: ld,
		children: o
	});
	return /* @__PURE__ */ V(H, {
		sx: sd,
		children: [
			/* @__PURE__ */ B(H, {
				sx: cd,
				children: c && s ? /* @__PURE__ */ B(Jn, {
					title: s,
					placement: "left",
					arrow: !0,
					enterDelay: 500,
					children: b
				}) : b
			}),
			/* @__PURE__ */ V(H, {
				sx: ud,
				children: [
					/* @__PURE__ */ B(mn, {
						size: "small",
						onClick: h,
						sx: fd,
						children: /* @__PURE__ */ B(cr, {})
					}),
					/* @__PURE__ */ B(or, {
						size: "small",
						value: t,
						min: r,
						max: i,
						step: a,
						onChange: m,
						sx: dd
					}),
					/* @__PURE__ */ B(mn, {
						size: "small",
						onClick: g,
						sx: fd,
						children: /* @__PURE__ */ B(sr, {})
					})
				]
			}),
			/* @__PURE__ */ B(yn, {
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
				sx: pd
			})
		]
	});
}
//#endregion
//#region src/components/parameter-config/FDTD_2DTab.tsx
var _d = {
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
}, vd = {
	fontSize: "0.75rem",
	py: .5
}, yd = ({ uuid: e }) => {
	let t = Hr(), n = Jr(), r = f((t) => t.solvers[e]), [i, a] = L(r.uniforms.colorBrightness.value), [o, s] = L(r.mesh.scale.z), [c, l] = L(r.heightmapVariable.material.uniforms.damping.value), [u, d] = L(r.numPasses), [p, m] = L(r.running), [h, g] = L(r.recording), [_, v] = L(r.getWireframeVisible()), [y, b] = L(r.frequencyDependentWalls), [x, S] = L(!1), [C, w] = L(!1), [T, E] = L(!1), [D, O] = L(r.sourceKeys), ee = t.filter((e) => !r.sources[e.uuid]), [te, ne] = L(!1), [k, re] = L(r.receiverKeys), ie = n.filter((e) => !r.receivers[e.uuid]);
	return /* @__PURE__ */ V("div", { children: [
		/* @__PURE__ */ V(Uc, {
			id: "view",
			label: "View",
			open: x,
			onOpenClose: () => S(!x),
			children: [
				/* @__PURE__ */ B(gd, {
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
				/* @__PURE__ */ B(gd, {
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
				/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
					hasToolTip: x,
					label: "Wireframe",
					tooltip: "Display mesh as wirefame"
				}), /* @__PURE__ */ B(Xc, {
					onChange: (e) => {
						r.setWireframeVisible(e.value), v(e.value);
					},
					value: _
				})] })
			]
		}),
		/* @__PURE__ */ V(Uc, {
			id: "sim-params",
			label: "Simulation Parameters",
			open: C,
			onOpenClose: () => w(!C),
			children: [
				/* @__PURE__ */ B(gd, {
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
				/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
					hasToolTip: C,
					label: "Frequency-dependent walls",
					tooltip: "Each wall follows its material's whole octave-band spectrum in one run, fitted as passive resonant (series-RLC) branches, instead of one coefficient at 500 Hz. Switching restarts the field."
				}), /* @__PURE__ */ B(Xc, {
					onChange: (e) => {
						r.setFrequencyDependentWalls(e.value), b(e.value);
					},
					value: y
				})] }),
				/* @__PURE__ */ B(gd, {
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
		/* @__PURE__ */ V(Uc, {
			id: "sim-sources",
			label: "Sources",
			open: T,
			onOpenClose: () => E(!T),
			children: [/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
				hasToolTip: T,
				label: "Source",
				tooltip: "All available sources"
			}), /* @__PURE__ */ V(Zn, {
				size: "small",
				value: "",
				displayEmpty: !0,
				onChange: (e) => {
					let n = t.filter((t) => t.uuid === e.target.value);
					n[0] && r.addSource(n[0]), O(r.sourceKeys);
				},
				sx: _d,
				MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } },
				children: [/* @__PURE__ */ B(fn, {
					value: "",
					disabled: !0,
					sx: vd,
					children: "Select Source"
				}), ee.map((e) => /* @__PURE__ */ B(fn, {
					value: e.uuid,
					sx: vd,
					children: e.name
				}, e.uuid))]
			})] }), D.map((e) => /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
				hasToolTip: !1,
				label: r.sources[e] && r.sources[e].name
			}), /* @__PURE__ */ B(pl, {
				label: "Remove",
				onClick: (t) => {
					O(r.sourceKeys.filter((t) => t !== e)), r.removeSource(e);
				}
			})] }, e))]
		}),
		/* @__PURE__ */ V(Uc, {
			id: "sim-receivers",
			label: "Receivers",
			open: te,
			onOpenClose: () => ne(!te),
			children: [/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
				hasToolTip: te,
				label: "Receiver",
				tooltip: "All available receivers"
			}), /* @__PURE__ */ V(Zn, {
				size: "small",
				value: "",
				displayEmpty: !0,
				onChange: (e) => {
					let t = n.filter((t) => t.uuid === e.target.value);
					t[0] && r.addReceiver(t[0]), re(r.receiverKeys);
				},
				sx: _d,
				MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } },
				children: [/* @__PURE__ */ B(fn, {
					value: "",
					disabled: !0,
					sx: vd,
					children: "Select Receiver"
				}), ie.map((e) => /* @__PURE__ */ B(fn, {
					value: e.uuid,
					sx: vd,
					children: e.name
				}, e.uuid))]
			})] }), k.map((e) => /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
				hasToolTip: !1,
				label: r.receivers[e].name
			}), /* @__PURE__ */ B(pl, {
				label: "Remove",
				onClick: (t) => {
					re(r.receiverKeys.filter((t) => t !== e)), r.removeReceiver(e);
				}
			})] }, e))]
		}),
		/* @__PURE__ */ B(Y, { children: /* @__PURE__ */ B(X, {
			label: `Simulated ${Number(r.time).toFixed(4)} s · ${Math.round(1 / r.dt)} Hz · walls to ${Math.round(r.impedanceFrequencyLimit)} Hz`,
			tooltip: "Simulated time, FDTD sample rate (1/dt), and the highest frequency the walls deliver their absorption at on this grid. Above that they read as more reflective than their materials — use a smaller cell size. A material's coefficient is read as random-incidence (Sabine) absorption, as the database measured it: each wall absorbs that fraction of a diffuse field."
		}) }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Run/Pause",
			tooltip: "Runs or pauses the simulation"
		}), /* @__PURE__ */ B(pl, {
			onClick: (e) => {
				r.running ? (r.stop(), m(!1)) : (r.run(), m(!0));
			},
			label: p ? "Pause" : "Run"
		})] }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Recording",
			tooltip: "Starts/stops recording"
		}), /* @__PURE__ */ B(pl, {
			onClick: (e) => {
				r.recording ? (r.stopRecording(), g(!1)) : (r.startRecording(), g(!0));
			},
			label: h ? "Stop" : "Record"
		})] }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Clear",
			tooltip: "Clears the grid"
		}), /* @__PURE__ */ B(pl, {
			onClick: r.clear,
			label: "Clear"
		})] })
	] });
}, { PropertyNumberInput: bd } = au("ART_SET_PROPERTY"), xd = ({ uuid: e }) => {
	let t = k((e) => e.containers), n = k((e) => e.version), r = F(() => Object.values(t).filter((e) => e.kind === "room").map((e) => ({
		value: e.uuid,
		label: e.name
	})), [t, n]), [i, o] = Z(e, "roomID", "ART_SET_PROPERTY"), s = N(() => {
		a("CALCULATE_ART", e);
	}, [e]);
	return /* @__PURE__ */ V("div", { children: [
		/* @__PURE__ */ B(Du, {
			onPlayPause: s,
			canRun: !0
		}),
		/* @__PURE__ */ B(Q, { label: "Room" }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Room",
			hasToolTip: !0,
			tooltip: "Room geometry to tessellate into radiosity patches for energy exchange computation"
		}), /* @__PURE__ */ B(al, {
			value: i || "",
			onChange: o,
			options: r.length > 0 ? r : [{
				value: "",
				label: "No rooms available"
			}]
		})] }),
		/* @__PURE__ */ B(Q, { label: "Source / Receiver Pairs" }),
		/* @__PURE__ */ B(_u, {
			uuid: e,
			eventType: "ART_SET_PROPERTY"
		}),
		/* @__PURE__ */ B(Q, { label: "Solver Settings" }),
		/* @__PURE__ */ B(bd, {
			uuid: e,
			label: "Max Edge Length",
			property: "maxEdgeLength",
			tooltip: "Maximum triangle edge length during adaptive tessellation (metres). Smaller values create finer radiosity patches for more spatial detail at the cost of computation time.",
			elementProps: {
				step: .1,
				min: .05
			}
		}),
		/* @__PURE__ */ B(bd, {
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
		/* @__PURE__ */ B(bd, {
			uuid: e,
			label: "Rays per Shoot",
			property: "raysPerShoot",
			tooltip: "Number of stochastic rays emitted per progressive shooting iteration to estimate form factors between surface patches",
			elementProps: {
				step: 50,
				min: 10
			}
		}),
		/* @__PURE__ */ B(bd, {
			uuid: e,
			label: "Max Iterations",
			property: "maxIterations",
			tooltip: "Maximum progressive radiosity shooting iterations before the solver halts — each iteration distributes the highest-energy unshot patch",
			elementProps: {
				step: 10,
				min: 1
			}
		}),
		/* @__PURE__ */ B(bd, {
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
		/* @__PURE__ */ B(bd, {
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
}, { PropertyNumberInput: Sd, PropertyCheckboxInput: Cd } = au("ARD_SET_PROPERTY"), wd = {
	display: "grid",
	gridTemplateColumns: "2fr 3fr",
	fontSize: "0.75rem",
	px: .5,
	py: "1px",
	userSelect: "none"
}, Td = {
	fontSize: "0.75rem",
	color: "text.secondary"
}, Ed = (e) => ({
	fontSize: "0.75rem",
	fontVariantNumeric: "tabular-nums",
	color: e ? "warning.main" : "text.primary"
}), Dd = 60;
function Od(e) {
	return !Number.isFinite(e) || e <= 0 ? "—" : e < 1 ? "< 1 s" : e < 90 ? `${Math.round(e)} s` : e < 5400 ? `${Math.round(e / 60)} min` : `${(e / 3600).toFixed(1)} h`;
}
function kd(e) {
	return Math.round(e).toLocaleString("en-US");
}
function Ad(e) {
	let t = [kd(e.stepsPerRun)];
	return e.sources > 1 && t.push(`${e.sources} sources`), e.bands > 1 && t.push(`${e.bands} bands`), t.join(" x ");
}
function jd({ label: e, value: t, tooltip: n, warn: r = !1 }) {
	return /* @__PURE__ */ V(H, {
		sx: wd,
		children: [/* @__PURE__ */ B(Jn, {
			title: n,
			placement: "left",
			children: /* @__PURE__ */ B(U, {
				sx: Td,
				children: e
			})
		}), /* @__PURE__ */ B(U, {
			sx: Ed(r),
			children: t
		})]
	});
}
var Md = ({ uuid: e }) => {
	let t = k((e) => e.containers), r = k((e) => e.version), i = f((e) => e.version), o = f((t) => t.solvers[e]), [s, c] = L(0), [l, u] = L(!1), d = F(() => Object.values(t).filter((e) => e.kind === "room").map((e) => ({
		value: e.uuid,
		label: e.name
	})), [t, r]), [p, m] = Z(e, "roomID", "ARD_SET_PROPERTY"), [h, g] = Z(e, "dimensions", "ARD_SET_PROPERTY"), [_, v] = Z(e, "slice", "ARD_SET_PROPERTY"), [y, b] = Z(e, "boundary", "ARD_SET_PROPERTY"), [x, S] = Z(e, "sliceCoordinate", "ARD_SET_PROPERTY"), C = h === 2, w = x == null, T = N((e) => {
		S({ value: e.value ? null : _ === "xy" ? 0 : 1.2 });
	}, [S, _]);
	P(() => n("ARD_PROGRESS", (t) => {
		t.uuid === e && (c(t.progress), u(t.progress > 0 && t.progress < 1));
	}), [e]);
	let E = N(() => {
		l ? (o?.cancel(), u(!1)) : a("CALCULATE_ARD", e);
	}, [
		l,
		o,
		e
	]), D = F(() => o ? {
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
	]), O = (o?.sourceIDs?.length ?? 0) > 0 && (o?.receiverIDs?.length ?? 0) > 0;
	return /* @__PURE__ */ V("div", { children: [
		/* @__PURE__ */ B(Du, {
			onPlayPause: E,
			isRunning: l,
			canRun: !!p && O || l
		}),
		/* @__PURE__ */ B(Q, { label: "Estimated Cost" }),
		D ? /* @__PURE__ */ V(z, { children: [
			/* @__PURE__ */ B(jd, {
				label: "Grid",
				value: D.dimensions === 2 ? `${D.slice} plane @ ${(D.dx * 100).toFixed(1)} cm` : `${D.grid.x} x ${D.grid.y} x ${D.grid.z} @ ${(D.dx * 100).toFixed(1)} cm`,
				tooltip: "Voxel grid the run would allocate, from the room's bounding box, and the cell size that follows from fMax and cells per wavelength. A 2D run still voxelizes the room in three dimensions — it takes one plane out of the result, so the air region matches what a 3D run would have used at that height."
			}),
			/* @__PURE__ */ B(jd, {
				label: "Cells stepped",
				value: kd(D.simulated),
				tooltip: D.boundary === "pml" ? "Air cells plus absorbing wall slabs — what actually costs time each step. Smaller than the allocated grid, most of which is padding for the slabs to grow into. Switching the boundary to impedance drops the slabs entirely, typically cutting this by two thirds." : "Air cells — what actually costs time each step. Impedance boundaries add none: they force cells the air region already contains."
			}),
			/* @__PURE__ */ B(jd, {
				label: "Steps",
				value: Ad(D),
				tooltip: "Time steps per run, and how many runs there are. One full simulation per source — several sources at once would leave every receiver recording their sum — and, with per-band runs, one per octave band on top of that. Receivers are free: they are probes into a field being computed anyway."
			}),
			/* @__PURE__ */ B(jd, {
				label: "Estimated time",
				value: Od(D.seconds),
				tooltip: D.boundary === "pml" ? "Rough, from measured throughput of about 1.25 million cell-steps per second on this boundary. An order of magnitude, not a quote — and it does not include voxelization or the per-thickness wall calibration. Note the rate is per stepped cell and a slab has two to five times as many of them, so a PML run is three to five times slower in wall clock than the same room on an impedance boundary." : "Rough, from measured throughput of about 1.0 million cell-steps per second on this boundary. An order of magnitude, not a quote. A room whose cell extents are all powers of two runs two to three times faster, because the DCT takes its radix-2 path instead of Bluestein.",
				warn: D.seconds > Dd
			}),
			l && /* @__PURE__ */ B(jd, {
				label: "Progress",
				value: `${Math.round(s * 100)}%`,
				tooltip: "Steps completed across every source and band in this run."
			})
		] }) : null,
		/* @__PURE__ */ B(Q, { label: "Room" }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Room",
			hasToolTip: !0,
			tooltip: "Room geometry to voxelize. The surfaces must enclose a volume — an open model leaks and the solver refuses to run."
		}), /* @__PURE__ */ B(al, {
			value: p || "",
			onChange: m,
			options: d.length > 0 ? d : [{
				value: "",
				label: "No rooms available"
			}]
		})] }),
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Dimensions",
			hasToolTip: !0,
			tooltip: "3D solves the room. 2D solves a plane through it — which is a different room, one that is uniform and unbounded along the collapsed axis: sound spreads as 1/sqrt(r) and there are no modes across the missing axis. It is the only mode that reaches 4 kHz on anything but a cupboard, and it is for seeing wavefronts in plan, not for reading a reverberation time."
		}), /* @__PURE__ */ B(al, {
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
		C && /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Plane",
			hasToolTip: !0,
			tooltip: "Which plane to cut. Floor plan collapses height; section collapses depth. The cut goes through the first source unless a height is set, since a source is inside the room by construction."
		}), /* @__PURE__ */ B(al, {
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
		C && /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Cut at Source",
			hasToolTip: !0,
			tooltip: "Cut through the first source, which is inside the room by construction because it seeds the flood fill. Turn it off to set a height — useful on a building with more than one storey, where the source's own plane may not be the one you want."
		}), /* @__PURE__ */ B(Xc, {
			value: w,
			onChange: T
		})] }), !w && /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: _ === "xy" ? "Cut at Z (m)" : "Cut at Y (m)",
			hasToolTip: !0,
			tooltip: "Where to cut, in metres along the collapsed axis. A plane outside the room — or in the padding the wall slabs grow into — falls back to the widest plane, and the run says which one it used."
		}), /* @__PURE__ */ B(el, {
			value: x ?? 0,
			onChange: S,
			step: .1
		})] })] }),
		/* @__PURE__ */ B(Q, { label: "Source / Receiver Pairs" }),
		/* @__PURE__ */ B(_u, {
			uuid: e,
			eventType: "ARD_SET_PROPERTY"
		}),
		/* @__PURE__ */ B(Q, { label: "Solver Settings" }),
		/* @__PURE__ */ B(Sd, {
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
		/* @__PURE__ */ B(Sd, {
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
		/* @__PURE__ */ B(Sd, {
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
		/* @__PURE__ */ B(Sd, {
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
		/* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
			label: "Boundary",
			hasToolTip: !0,
			tooltip: "How a room surface absorbs. Impedance puts the condition on the face itself: no extra cells, no grid padding, a looser time step, and measurably closer to the material's absorption coefficient at every grid resolution tested. PML parks a graded absorbing slab outside each face — 2 to 5 times the room in cells, padding on every side to grow into, and a tighter cap on the Courant number. PML is kept because it is what the solver was originally validated against. Either way, a material's absorption coefficient is read as random-incidence (Sabine) absorption: each wall is built to absorb that fraction of a diffuse field, which is how the coefficients in the material database were measured."
		}), /* @__PURE__ */ B(al, {
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
		y === "pml" && /* @__PURE__ */ B(Sd, {
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
		/* @__PURE__ */ B(Sd, {
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
		/* @__PURE__ */ B(Sd, {
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
		/* @__PURE__ */ B(Cd, {
			uuid: e,
			label: "Per-Band Runs",
			property: "perBandRuns",
			tooltip: `Run the simulation once per octave band with that band's absorption, then add the filtered results. ARD's boundary treatment is frequency-independent by construction, so this is the only way to honour a material's octave-band α — at one full run per band. Off, every surface uses its α at ${D?.referenceFrequency ?? 500} Hz.`
		})
	] });
}, Nd = gn`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`, Pd = {
	height: "100%",
	overflow: "auto",
	bgcolor: "background.paper"
}, Fd = {
	py: .25,
	px: 1,
	"&.Mui-selected": {
		bgcolor: "primary.light",
		"&:hover": { bgcolor: "primary.light" }
	}
}, Id = {
	p: 1,
	"& > *": { mb: .5 }
}, Ld = (e, t) => ({
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
		animation: t ? `${Nd} 1s linear infinite` : "none"
	}
}), Rd = {
	"ray-tracer": Vu,
	"image-source": Wu,
	rt60: Ku,
	"energy-decay": qu,
	energydecay: qu,
	"beam-trace": od,
	"fdtd-2d": yd,
	art: xd,
	ard: Md
}, zd = {
	"ray-tracer": "Monte Carlo ray tracing",
	"image-source": "Image source method",
	rt60: "Statistical reverberation",
	"fdtd-2d": "Finite-difference time-domain",
	energydecay: "Energy decay analysis",
	art: "Acoustic radiance transfer",
	ard: "Wave-based adaptive rectangular decomposition",
	"beam-trace": "Specular beam solver"
};
function Bd({ uuid: e, name: t, type: n, selected: r, onSelect: i, onRun: a, onDelete: o }) {
	return /* @__PURE__ */ B(In, {
		disablePadding: !0,
		sx: Fd,
		secondaryAction: /* @__PURE__ */ V(H, {
			sx: {
				display: "flex",
				gap: .25
			},
			children: [/* @__PURE__ */ B(mn, {
				size: "small",
				onClick: a,
				color: "primary",
				sx: { p: .25 },
				children: /* @__PURE__ */ B(Qn, { sx: { fontSize: 16 } })
			}), /* @__PURE__ */ B(mn, {
				size: "small",
				onClick: o,
				sx: { p: .25 },
				children: /* @__PURE__ */ B(Vn, { sx: { fontSize: 16 } })
			})]
		}),
		children: /* @__PURE__ */ V(xn, {
			onClick: i,
			selected: r,
			dense: !0,
			sx: { py: .25 },
			children: [/* @__PURE__ */ B(Ln, {
				sx: { minWidth: 28 },
				children: /* @__PURE__ */ B(Kn, { fontSize: "small" })
			}), /* @__PURE__ */ B(Rn, {
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
function Vd() {
	let [e, t] = L(null), n = f((e) => e.solvers), r = A((e) => e.autoCalculate), i = A((e) => e.progress.visible), o = F(() => Object.keys(n).map((e) => ({
		uuid: e,
		name: n[e].name || e.slice(0, 8),
		type: zd[n[e].kind] || n[e].kind || "Unknown"
	})), [n]), s = N((e) => {
		t(e);
	}, []), c = N((e) => {
		a("RUN_SOLVER", e);
	}, []), l = N((n) => {
		a("REMOVE_SOLVERS", n), e === n && t(null);
	}, [e]), u = N((e) => {
		e.stopPropagation(), a("SET_AUTO_CALCULATE", !r);
	}, [r]), d = e ? n[e] : null;
	return /* @__PURE__ */ V(H, {
		sx: Pd,
		children: [
			/* @__PURE__ */ V(H, {
				sx: {
					display: "flex",
					alignItems: "center",
					px: 1.5,
					py: .5,
					bgcolor: "action.hover"
				},
				children: [/* @__PURE__ */ V(U, {
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
				}), /* @__PURE__ */ B(Jn, {
					title: r ? "Auto-calculate ON" : "Auto-calculate OFF",
					children: /* @__PURE__ */ B(H, {
						component: "span",
						role: "button",
						tabIndex: 0,
						onClick: u,
						onKeyDown: (e) => {
							(e.key === "Enter" || e.key === " ") && u(e);
						},
						sx: Ld(r, r && i),
						children: /* @__PURE__ */ B($n, {})
					})
				})]
			}),
			/* @__PURE__ */ B(bn, {
				dense: !0,
				disablePadding: !0,
				children: o.map((t) => /* @__PURE__ */ B(Bd, {
					uuid: t.uuid,
					name: t.name,
					type: t.type,
					selected: e === t.uuid,
					onSelect: () => s(t.uuid),
					onRun: () => c(t.uuid),
					onDelete: () => l(t.uuid)
				}, t.uuid))
			}),
			d && /* @__PURE__ */ V(z, { children: [
				/* @__PURE__ */ B(pn, {}),
				/* @__PURE__ */ B(H, {
					sx: {
						px: 1.5,
						py: .5,
						bgcolor: "action.hover"
					},
					children: /* @__PURE__ */ V(U, {
						variant: "subtitle2",
						sx: {
							fontWeight: 600,
							fontSize: "0.75rem"
						},
						children: [d.name, " Settings"]
					})
				}),
				/* @__PURE__ */ B(H, {
					sx: Id,
					children: (() => {
						if (!d) return null;
						let t = Rd[d.kind];
						return t ? /* @__PURE__ */ B(t, { uuid: e }) : /* @__PURE__ */ V(U, {
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
//#endregion
//#region src/components/parameter-config/RendererTab.tsx
function Hd(e, t) {
	let [n, r] = L(E[e]);
	return [n, N((n) => {
		E[e] = n, t && t(E), r(n);
	}, [e])];
}
var Ud = (e) => e.camera?.updateProjectionMatrix(), Wd = ({ label: e, property: t, tooltip: n, updateFn: r, min: i, max: a, step: o }) => {
	let [s, c] = Hd(t, r);
	return /* @__PURE__ */ B(gd, {
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
}, Gd = ({ label: e, tooltip: t, property: n, onText: r, offText: i, updateFn: a }) => {
	let [o, s] = Hd(n, a);
	return /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
		label: e,
		tooltip: t
	}), /* @__PURE__ */ B(pl, {
		onClick: () => s(!o),
		label: o ? r : i
	})] });
}, Kd = ({ label: e, tooltip: t, property: n, updateFn: r }) => {
	let [i, a] = Hd(n, r);
	return /* @__PURE__ */ V(Y, { children: [/* @__PURE__ */ B(X, {
		label: e,
		tooltip: t
	}), /* @__PURE__ */ B(Xc, {
		value: i,
		onChange: (e) => a(e.value)
	})] });
}, qd = () => {
	let [e, t] = ul(!0);
	return /* @__PURE__ */ V(Uc, {
		label: "Camera Properties",
		open: e,
		onOpenClose: t,
		children: [
			/* @__PURE__ */ B(Wd, {
				property: "fov",
				label: "Field of View",
				tooltip: "Sets the perspective camera's field of view",
				min: 1,
				max: 90,
				step: .1,
				updateFn: Ud
			}),
			/* @__PURE__ */ B(Wd, {
				property: "zoom",
				label: "Zoom",
				tooltip: "Sets the orthographic camera's zoom",
				min: .001,
				max: 10,
				step: .001,
				updateFn: Ud
			}),
			/* @__PURE__ */ B(Wd, {
				property: "near",
				label: "Near",
				tooltip: "Sets the camera's near clipping distance",
				min: .1,
				max: 50,
				step: .01,
				updateFn: Ud
			}),
			/* @__PURE__ */ B(Wd, {
				property: "far",
				label: "Far",
				tooltip: "Sets the camera's far clipping distance",
				min: 1,
				max: 2e3,
				step: 1,
				updateFn: Ud
			}),
			/* @__PURE__ */ B(Gd, {
				property: "isOrtho",
				label: "Camera Style",
				tooltip: "Toggles between perspective/orthographic",
				onText: "Orthographic",
				offText: "Perspective",
				updateFn: () => a("TOGGLE_CAMERA_ORTHO")
			})
		]
	});
}, Jd = () => {
	let [e, t] = ul(!0);
	return /* @__PURE__ */ V(Uc, {
		label: "Environment Properties",
		open: e,
		onOpenClose: t,
		children: [
			/* @__PURE__ */ B(Wd, {
				property: "fogDensity",
				label: "Fog Density",
				tooltip: "Sets the scene's fog density",
				min: .001,
				max: .1,
				step: .001,
				updateFn: () => E.needsToRender = !0
			}),
			/* @__PURE__ */ B(Kd, {
				property: "gridVisible",
				label: "Grid",
				tooltip: "Toggles the grid visibility"
			}),
			/* @__PURE__ */ B(Kd, {
				property: "axisVisible",
				label: "Axis",
				tooltip: "Toggles the axis visibility"
			})
		]
	});
}, Yd = () => {
	let [e, t] = ul(!0);
	return /* @__PURE__ */ B(Uc, {
		label: "Editor Properties",
		open: e,
		onOpenClose: t,
		children: /* @__PURE__ */ B(Kd, {
			label: "Cursor",
			tooltip: "Toggles the cursor",
			property: "cursorVisible"
		})
	});
};
function Xd() {
	return /* @__PURE__ */ V("div", { children: [
		/* @__PURE__ */ B(qd, {}),
		/* @__PURE__ */ B(Jd, {}),
		/* @__PURE__ */ B(Yd, {})
	] });
}
//#endregion
//#region src/components/workbench/panels/RendererPanel.tsx
var Zd = {
	height: "100%",
	overflow: "auto",
	bgcolor: "background.paper",
	p: 1
};
function Qd() {
	let [e, t] = L(!!E.scene);
	return P(() => {
		if (e) return;
		let [n, r] = h.addMessageHandler("APP_MOUNTED", () => {
			t(!0);
		});
		return E.scene && t(!0), () => h.removeMessageHandler(n, r);
	}, [e]), e ? /* @__PURE__ */ B(H, {
		sx: Zd,
		children: /* @__PURE__ */ B(Xd, {})
	}) : null;
}
//#endregion
//#region node_modules/internmap/src/index.js
var $d = class extends Map {
	constructor(e, t = rf) {
		if (super(), Object.defineProperties(this, {
			_intern: { value: /* @__PURE__ */ new Map() },
			_key: { value: t }
		}), e != null) for (let [t, n] of e) this.set(t, n);
	}
	get(e) {
		return super.get(ef(this, e));
	}
	has(e) {
		return super.has(ef(this, e));
	}
	set(e, t) {
		return super.set(tf(this, e), t);
	}
	delete(e) {
		return super.delete(nf(this, e));
	}
};
function ef({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : n;
}
function tf({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : (e.set(r, n), n);
}
function nf({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) && (n = e.get(r), e.delete(r)), n;
}
function rf(e) {
	return typeof e == "object" && e ? e.valueOf() : e;
}
//#endregion
//#region node_modules/d3-scale/src/init.js
function af(e, t) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			this.range(e);
			break;
		default: this.range(t).domain(e);
	}
	return this;
}
//#endregion
//#region node_modules/d3-scale/src/ordinal.js
var of = Symbol("implicit");
function sf() {
	var e = new $d(), t = [], n = [], r = of;
	function i(i) {
		let a = e.get(i);
		if (a === void 0) {
			if (r !== of) return r;
			e.set(i, a = t.push(i) - 1);
		}
		return n[a % n.length];
	}
	return i.domain = function(n) {
		if (!arguments.length) return t.slice();
		t = [], e = new $d();
		for (let r of n) e.has(r) || e.set(r, t.push(r) - 1);
		return i;
	}, i.range = function(e) {
		return arguments.length ? (n = Array.from(e), i) : n.slice();
	}, i.unknown = function(e) {
		return arguments.length ? (r = e, i) : r;
	}, i.copy = function() {
		return sf(t, n).unknown(r);
	}, af.apply(i, arguments), i;
}
//#endregion
//#region node_modules/d3-time/src/interval.js
var cf = /* @__PURE__ */ new Date(), lf = /* @__PURE__ */ new Date();
function uf(e, t, n, r) {
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
	}, i.filter = (n) => uf((t) => {
		if (t >= t) for (; e(t), !n(t);) t.setTime(t - 1);
	}, (e, r) => {
		if (e >= e) {
			if (r < 0) for (; ++r <= 0;) for (; t(e, -1), !n(e););
			else for (; --r >= 0;) for (; t(e, 1), !n(e););
		}
	}), n && (i.count = (t, r) => (cf.setTime(+t), lf.setTime(+r), e(cf), e(lf), Math.floor(n(cf, lf))), i.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? i.filter(r ? (t) => r(t) % e === 0 : (t) => i.count(0, t) % e === 0) : i)), i;
}
var df = 6e4, ff = df * 60 * 24, pf = ff * 7;
ff * 30, ff * 365;
//#endregion
//#region node_modules/d3-time/src/day.js
var mf = uf((e) => e.setHours(0, 0, 0, 0), (e, t) => e.setDate(e.getDate() + t), (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * df) / ff, (e) => e.getDate() - 1);
mf.range;
var hf = uf((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / ff, (e) => e.getUTCDate() - 1);
hf.range, uf((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / ff, (e) => Math.floor(e / ff)).range;
//#endregion
//#region node_modules/d3-time/src/week.js
function gf(e) {
	return uf((t) => {
		t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setDate(e.getDate() + t * 7);
	}, (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * df) / pf);
}
var _f = gf(0), vf = gf(1), yf = gf(2), bf = gf(3), xf = gf(4), Sf = gf(5), Cf = gf(6);
_f.range, vf.range, yf.range, bf.range, xf.range, Sf.range, Cf.range;
function wf(e) {
	return uf((t) => {
		t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setUTCDate(e.getUTCDate() + t * 7);
	}, (e, t) => (t - e) / pf);
}
var Tf = wf(0), Ef = wf(1), Df = wf(2), Of = wf(3), kf = wf(4), Af = wf(5), jf = wf(6);
Tf.range, Ef.range, Df.range, Of.range, kf.range, Af.range, jf.range;
//#endregion
//#region node_modules/d3-time/src/year.js
var Mf = uf((e) => {
	e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
	e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
Mf.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : uf((t) => {
	t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, n) => {
	t.setFullYear(t.getFullYear() + n * e);
}), Mf.range;
var Nf = uf((e) => {
	e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
Nf.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : uf((t) => {
	t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, n) => {
	t.setUTCFullYear(t.getUTCFullYear() + n * e);
}), Nf.range;
//#endregion
//#region node_modules/d3-time-format/src/locale.js
function Pf(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
		return t.setFullYear(e.y), t;
	}
	return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Ff(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
		return t.setUTCFullYear(e.y), t;
	}
	return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function If(e, t, n) {
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
function Lf(e) {
	var t = e.dateTime, n = e.date, r = e.time, i = e.periods, a = e.days, o = e.shortDays, s = e.months, c = e.shortMonths, l = Uf(i), u = Wf(i), d = Uf(a), f = Wf(a), p = Uf(o), m = Wf(o), h = Uf(s), g = Wf(s), _ = Uf(c), v = Wf(c), y = {
		a: re,
		A: ie,
		b: ae,
		B: oe,
		c: null,
		d: dp,
		e: dp,
		f: gp,
		g: Dp,
		G: kp,
		H: fp,
		I: pp,
		j: mp,
		L: hp,
		m: _p,
		M: vp,
		p: se,
		q: A,
		Q: Qp,
		s: $p,
		S: yp,
		u: bp,
		U: xp,
		V: Cp,
		w: wp,
		W: Tp,
		x: null,
		X: null,
		y: Ep,
		Y: Op,
		Z: Ap,
		"%": Zp
	}, b = {
		a: ce,
		A: le,
		b: ue,
		B: de,
		c: null,
		d: jp,
		e: jp,
		f: Ip,
		g: qp,
		G: Yp,
		H: Mp,
		I: Np,
		j: Pp,
		L: Fp,
		m: Lp,
		M: Rp,
		p: fe,
		q: pe,
		Q: Qp,
		s: $p,
		S: zp,
		u: Bp,
		U: Vp,
		V: Up,
		w: Wp,
		W: Gp,
		x: null,
		X: null,
		y: Kp,
		Y: Jp,
		Z: Xp,
		"%": Zp
	}, x = {
		a: E,
		A: D,
		b: O,
		B: ee,
		c: te,
		d: tp,
		e: tp,
		f: sp,
		g: Zf,
		G: Xf,
		H: rp,
		I: rp,
		j: np,
		L: op,
		m: ep,
		M: ip,
		p: T,
		q: $f,
		Q: lp,
		s: up,
		S: ap,
		u: Kf,
		U: qf,
		V: Jf,
		w: Gf,
		W: Yf,
		x: ne,
		X: k,
		y: Zf,
		Y: Xf,
		Z: Qf,
		"%": cp
	};
	y.x = S(n, y), y.X = S(r, y), y.c = S(t, y), b.x = S(n, b), b.X = S(r, b), b.c = S(t, b);
	function S(e, t) {
		return function(n) {
			var r = [], i = -1, a = 0, o = e.length, s, c, l;
			for (n instanceof Date || (n = /* @__PURE__ */ new Date(+n)); ++i < o;) e.charCodeAt(i) === 37 && (r.push(e.slice(a, i)), (c = Rf[s = e.charAt(++i)]) == null ? c = s === "e" ? " " : "0" : s = e.charAt(++i), (l = t[s]) && (s = l(n, c)), r.push(s), a = i + 1);
			return r.push(e.slice(a, i)), r.join("");
		};
	}
	function C(e, t) {
		return function(n) {
			var r = If(1900, void 0, 1), i = w(r, e, n += "", 0), a, o;
			if (i != n.length) return null;
			if ("Q" in r) return new Date(r.Q);
			if ("s" in r) return new Date(r.s * 1e3 + ("L" in r ? r.L : 0));
			if (t && !("Z" in r) && (r.Z = 0), "p" in r && (r.H = r.H % 12 + r.p * 12), r.m === void 0 && (r.m = "q" in r ? r.q : 0), "V" in r) {
				if (r.V < 1 || r.V > 53) return null;
				"w" in r || (r.w = 1), "Z" in r ? (a = Ff(If(r.y, 0, 1)), o = a.getUTCDay(), a = o > 4 || o === 0 ? Ef.ceil(a) : Ef(a), a = hf.offset(a, (r.V - 1) * 7), r.y = a.getUTCFullYear(), r.m = a.getUTCMonth(), r.d = a.getUTCDate() + (r.w + 6) % 7) : (a = Pf(If(r.y, 0, 1)), o = a.getDay(), a = o > 4 || o === 0 ? vf.ceil(a) : vf(a), a = mf.offset(a, (r.V - 1) * 7), r.y = a.getFullYear(), r.m = a.getMonth(), r.d = a.getDate() + (r.w + 6) % 7);
			} else ("W" in r || "U" in r) && ("w" in r || (r.w = "u" in r ? r.u % 7 : +("W" in r)), o = "Z" in r ? Ff(If(r.y, 0, 1)).getUTCDay() : Pf(If(r.y, 0, 1)).getDay(), r.m = 0, r.d = "W" in r ? (r.w + 6) % 7 + r.W * 7 - (o + 5) % 7 : r.w + r.U * 7 - (o + 6) % 7);
			return "Z" in r ? (r.H += r.Z / 100 | 0, r.M += r.Z % 100, Ff(r)) : Pf(r);
		};
	}
	function w(e, t, n, r) {
		for (var i = 0, a = t.length, o = n.length, s, c; i < a;) {
			if (r >= o) return -1;
			if (s = t.charCodeAt(i++), s === 37) {
				if (s = t.charAt(i++), c = x[s in Rf ? t.charAt(i++) : s], !c || (r = c(e, n, r)) < 0) return -1;
			} else if (s != n.charCodeAt(r++)) return -1;
		}
		return r;
	}
	function T(e, t, n) {
		var r = l.exec(t.slice(n));
		return r ? (e.p = u.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function E(e, t, n) {
		var r = p.exec(t.slice(n));
		return r ? (e.w = m.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function D(e, t, n) {
		var r = d.exec(t.slice(n));
		return r ? (e.w = f.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function O(e, t, n) {
		var r = _.exec(t.slice(n));
		return r ? (e.m = v.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function ee(e, t, n) {
		var r = h.exec(t.slice(n));
		return r ? (e.m = g.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function te(e, n, r) {
		return w(e, t, n, r);
	}
	function ne(e, t, r) {
		return w(e, n, t, r);
	}
	function k(e, t, n) {
		return w(e, r, t, n);
	}
	function re(e) {
		return o[e.getDay()];
	}
	function ie(e) {
		return a[e.getDay()];
	}
	function ae(e) {
		return c[e.getMonth()];
	}
	function oe(e) {
		return s[e.getMonth()];
	}
	function se(e) {
		return i[+(e.getHours() >= 12)];
	}
	function A(e) {
		return 1 + ~~(e.getMonth() / 3);
	}
	function ce(e) {
		return o[e.getUTCDay()];
	}
	function le(e) {
		return a[e.getUTCDay()];
	}
	function ue(e) {
		return c[e.getUTCMonth()];
	}
	function de(e) {
		return s[e.getUTCMonth()];
	}
	function fe(e) {
		return i[+(e.getUTCHours() >= 12)];
	}
	function pe(e) {
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
var Rf = {
	"-": "",
	_: " ",
	0: "0"
}, zf = /^\s*\d+/, Bf = /^%/, Vf = /[\\^$*+?|[\]().{}]/g;
function $(e, t, n) {
	var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", a = i.length;
	return r + (a < n ? Array(n - a + 1).join(t) + i : i);
}
function Hf(e) {
	return e.replace(Vf, "\\$&");
}
function Uf(e) {
	return RegExp("^(?:" + e.map(Hf).join("|") + ")", "i");
}
function Wf(e) {
	return new Map(e.map((e, t) => [e.toLowerCase(), t]));
}
function Gf(e, t, n) {
	var r = zf.exec(t.slice(n, n + 1));
	return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function Kf(e, t, n) {
	var r = zf.exec(t.slice(n, n + 1));
	return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function qf(e, t, n) {
	var r = zf.exec(t.slice(n, n + 2));
	return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function Jf(e, t, n) {
	var r = zf.exec(t.slice(n, n + 2));
	return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function Yf(e, t, n) {
	var r = zf.exec(t.slice(n, n + 2));
	return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function Xf(e, t, n) {
	var r = zf.exec(t.slice(n, n + 4));
	return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function Zf(e, t, n) {
	var r = zf.exec(t.slice(n, n + 2));
	return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function Qf(e, t, n) {
	var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
	return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function $f(e, t, n) {
	var r = zf.exec(t.slice(n, n + 1));
	return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function ep(e, t, n) {
	var r = zf.exec(t.slice(n, n + 2));
	return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function tp(e, t, n) {
	var r = zf.exec(t.slice(n, n + 2));
	return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function np(e, t, n) {
	var r = zf.exec(t.slice(n, n + 3));
	return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function rp(e, t, n) {
	var r = zf.exec(t.slice(n, n + 2));
	return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function ip(e, t, n) {
	var r = zf.exec(t.slice(n, n + 2));
	return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function ap(e, t, n) {
	var r = zf.exec(t.slice(n, n + 2));
	return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function op(e, t, n) {
	var r = zf.exec(t.slice(n, n + 3));
	return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function sp(e, t, n) {
	var r = zf.exec(t.slice(n, n + 6));
	return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function cp(e, t, n) {
	var r = Bf.exec(t.slice(n, n + 1));
	return r ? n + r[0].length : -1;
}
function lp(e, t, n) {
	var r = zf.exec(t.slice(n));
	return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function up(e, t, n) {
	var r = zf.exec(t.slice(n));
	return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function dp(e, t) {
	return $(e.getDate(), t, 2);
}
function fp(e, t) {
	return $(e.getHours(), t, 2);
}
function pp(e, t) {
	return $(e.getHours() % 12 || 12, t, 2);
}
function mp(e, t) {
	return $(1 + mf.count(Mf(e), e), t, 3);
}
function hp(e, t) {
	return $(e.getMilliseconds(), t, 3);
}
function gp(e, t) {
	return hp(e, t) + "000";
}
function _p(e, t) {
	return $(e.getMonth() + 1, t, 2);
}
function vp(e, t) {
	return $(e.getMinutes(), t, 2);
}
function yp(e, t) {
	return $(e.getSeconds(), t, 2);
}
function bp(e) {
	var t = e.getDay();
	return t === 0 ? 7 : t;
}
function xp(e, t) {
	return $(_f.count(Mf(e) - 1, e), t, 2);
}
function Sp(e) {
	var t = e.getDay();
	return t >= 4 || t === 0 ? xf(e) : xf.ceil(e);
}
function Cp(e, t) {
	return e = Sp(e), $(xf.count(Mf(e), e) + (Mf(e).getDay() === 4), t, 2);
}
function wp(e) {
	return e.getDay();
}
function Tp(e, t) {
	return $(vf.count(Mf(e) - 1, e), t, 2);
}
function Ep(e, t) {
	return $(e.getFullYear() % 100, t, 2);
}
function Dp(e, t) {
	return e = Sp(e), $(e.getFullYear() % 100, t, 2);
}
function Op(e, t) {
	return $(e.getFullYear() % 1e4, t, 4);
}
function kp(e, t) {
	var n = e.getDay();
	return e = n >= 4 || n === 0 ? xf(e) : xf.ceil(e), $(e.getFullYear() % 1e4, t, 4);
}
function Ap(e) {
	var t = e.getTimezoneOffset();
	return (t > 0 ? "-" : (t *= -1, "+")) + $(t / 60 | 0, "0", 2) + $(t % 60, "0", 2);
}
function jp(e, t) {
	return $(e.getUTCDate(), t, 2);
}
function Mp(e, t) {
	return $(e.getUTCHours(), t, 2);
}
function Np(e, t) {
	return $(e.getUTCHours() % 12 || 12, t, 2);
}
function Pp(e, t) {
	return $(1 + hf.count(Nf(e), e), t, 3);
}
function Fp(e, t) {
	return $(e.getUTCMilliseconds(), t, 3);
}
function Ip(e, t) {
	return Fp(e, t) + "000";
}
function Lp(e, t) {
	return $(e.getUTCMonth() + 1, t, 2);
}
function Rp(e, t) {
	return $(e.getUTCMinutes(), t, 2);
}
function zp(e, t) {
	return $(e.getUTCSeconds(), t, 2);
}
function Bp(e) {
	var t = e.getUTCDay();
	return t === 0 ? 7 : t;
}
function Vp(e, t) {
	return $(Tf.count(Nf(e) - 1, e), t, 2);
}
function Hp(e) {
	var t = e.getUTCDay();
	return t >= 4 || t === 0 ? kf(e) : kf.ceil(e);
}
function Up(e, t) {
	return e = Hp(e), $(kf.count(Nf(e), e) + (Nf(e).getUTCDay() === 4), t, 2);
}
function Wp(e) {
	return e.getUTCDay();
}
function Gp(e, t) {
	return $(Ef.count(Nf(e) - 1, e), t, 2);
}
function Kp(e, t) {
	return $(e.getUTCFullYear() % 100, t, 2);
}
function qp(e, t) {
	return e = Hp(e), $(e.getUTCFullYear() % 100, t, 2);
}
function Jp(e, t) {
	return $(e.getUTCFullYear() % 1e4, t, 4);
}
function Yp(e, t) {
	var n = e.getUTCDay();
	return e = n >= 4 || n === 0 ? kf(e) : kf.ceil(e), $(e.getUTCFullYear() % 1e4, t, 4);
}
function Xp() {
	return "+0000";
}
function Zp() {
	return "%";
}
function Qp(e) {
	return +e;
}
function $p(e) {
	return Math.floor(e / 1e3);
}
//#endregion
//#region node_modules/d3-time-format/src/defaultLocale.js
var em, tm, nm;
rm({
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
function rm(e) {
	return em = Lf(e), tm = em.format, nm = em.parse, em.utcFormat, em.utcParse, em;
}
//#endregion
//#region src/components/results/LTPChart.tsx
var im = (e) => e.time, am = (e) => e.pressure[0], om = (e, t) => [...Array(t - e)].map((t, n) => e + n), sm = Rt.scale(["#ff8a0b", "#000080"]).mode("lch"), cm = (e) => sm.colors(e), lm = {
	display: "flex",
	flexDirection: "column"
}, um = {
	display: "flex",
	justifyContent: "center"
}, dm = {
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	gap: 3,
	px: 2,
	py: .5
}, fm = {
	display: "flex",
	flex: 1
}, pm = () => {
	let [e, t] = L(0);
	return [e, () => t(e + 1)];
}, mm = ({ uuid: e, width: t = 400, height: r = 200, events: i = !1, plotOrders: a, solverKind: o, chartMode: s = "ltp", yRange: l = "auto" }) => {
	let { info: u, data: d, from: p } = O(M((t) => c([
		"info",
		"data",
		"from"
	], t.results[e]))), [m, h] = pm(), [g, _] = L(d), v = F(() => !g || !a ? g : g.filter((e) => a.includes(e.order)), [g, a]);
	P(() => n("UPDATE_RESULT", (t) => {
		t.uuid === e && _(t.result.data);
	}), [e]);
	let y = t - 60, b = r - 60, x = F(() => gr({
		range: [0, y],
		domain: [0, g && g.length > 0 ? Math.max(...g.map(im)) : 1]
	}), [y, g]), S = F(() => {
		if (!g || g.length === 0) return gr({
			range: [b, 0],
			domain: [0, 1]
		});
		let e = Math.max(...g.map(am)), t = l === "auto" ? Math.min(...g.map(am)) * .75 : e - l;
		return gr({
			range: [b, 0],
			domain: [t, e]
		});
	}, [
		b,
		g,
		l
	]), C = F(() => sf(om(0, u.maxOrder + 1), cm(u.maxOrder + 1)), [u.maxOrder]), w = F(() => v ? [...v].sort((e, t) => im(e) - im(t)) : [], [v]);
	return !g || g.length === 0 ? /* @__PURE__ */ B("svg", {
		width: t,
		height: r,
		children: /* @__PURE__ */ B("text", {
			x: t / 2,
			y: r / 2,
			textAnchor: "middle",
			children: "No data yet - click \"Update\" to calculate"
		})
	}) : /* @__PURE__ */ V("svg", {
		width: t,
		height: r,
		children: [
			/* @__PURE__ */ B(br, {
				xScale: x,
				yScale: S,
				width: y,
				height: b,
				left: 60
			}),
			s === "etc" ? /* @__PURE__ */ B(mr, {
				left: 60,
				children: /* @__PURE__ */ B(pr, {
					data: w,
					x: (e) => x(im(e)),
					y: (e) => S(am(e)),
					stroke: "#2563eb",
					strokeWidth: 1.5
				})
			}) : /* @__PURE__ */ B(mr, { children: v.map((e) => {
				let t = im(e), n = b - S(am(e)), r = x(t) + 60, a = b - n;
				return /* @__PURE__ */ B(dr, {
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
			/* @__PURE__ */ B(vr, {
				scale: x,
				top: b,
				left: 60,
				label: "Time (s)"
			}),
			/* @__PURE__ */ B(yr, {
				scale: S,
				left: 60,
				label: s === "etc" ? "Energy (dB)" : "Sound Pressure Level (dB re: 20uPa)"
			})
		]
	});
}, hm = ({ uuid: e, width: t = 400, height: r = 300, events: i = !1 }) => {
	let { name: o, info: s, from: l } = O(M((t) => c([
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
	], p = u?.kind, [m, h] = L([0, s.maxOrder]), [g, _] = L(s.maxOrder), [v, y] = L("ltp"), [b, x] = L("auto"), S = F(() => Array.from({ length: m[1] - m[0] + 1 }, (e, t) => m[0] + t), [m]);
	return P(() => n("UPDATE_RESULT", (t) => {
		if (t.uuid === e) {
			let e = t.result.info.maxOrder;
			_(e), h((t) => [t[0], Math.max(t[1], e)]);
		}
	}), [e]), P(() => {
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
	}, [l]), t < 10 ? null : /* @__PURE__ */ V(H, {
		sx: lm,
		children: [
			/* @__PURE__ */ B(U, {
				sx: um,
				children: o
			}),
			/* @__PURE__ */ V(H, {
				sx: dm,
				children: [
					/* @__PURE__ */ V(tr, {
						value: v,
						exclusive: !0,
						onChange: (e, t) => {
							t && y(t);
						},
						size: "small",
						children: [/* @__PURE__ */ B(er, {
							value: "ltp",
							children: "LTP"
						}), /* @__PURE__ */ B(er, {
							value: "etc",
							children: "ETC"
						})]
					}),
					/* @__PURE__ */ B(U, {
						variant: "body2",
						sx: { whiteSpace: "nowrap" },
						children: "Orders"
					}),
					/* @__PURE__ */ B(or, {
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
					/* @__PURE__ */ B(U, {
						variant: "body2",
						sx: { whiteSpace: "nowrap" },
						children: "Y Range"
					}),
					/* @__PURE__ */ B(Cr, {
						size: "small",
						children: /* @__PURE__ */ V(Zn, {
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
								/* @__PURE__ */ B(fn, {
									value: "auto",
									sx: {
										fontSize: "0.75rem",
										py: .5
									},
									children: "Auto"
								}),
								/* @__PURE__ */ B(fn, {
									value: 10,
									sx: {
										fontSize: "0.75rem",
										py: .5
									},
									children: "10 dB"
								}),
								/* @__PURE__ */ B(fn, {
									value: 20,
									sx: {
										fontSize: "0.75rem",
										py: .5
									},
									children: "20 dB"
								}),
								/* @__PURE__ */ B(fn, {
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
					/* @__PURE__ */ B(U, {
						variant: "body2",
						sx: { whiteSpace: "nowrap" },
						children: "Octave Band"
					}),
					/* @__PURE__ */ B(Cr, {
						size: "small",
						children: /* @__PURE__ */ B(Zn, {
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
							children: d.map((e) => /* @__PURE__ */ V(fn, {
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
			/* @__PURE__ */ B(H, {
				sx: fm,
				children: /* @__PURE__ */ B(Sr, {
					debounceTime: 10,
					children: ({ width: t }) => /* @__PURE__ */ B(mm, {
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
}, gm = "#48beff", _m = "#43c593", vm = "#14453d", ym = "#000000";
nm("%Y-%m-%d"), tm("%b %d");
var bm = (e) => e.frequency.toString(), xm = {
	display: "flex",
	flexDirection: "column"
}, Sm = {
	display: "flex",
	justifyContent: "center"
}, Cm = {
	display: "flex",
	flexDirection: "row",
	flex: 1
}, wm = {
	display: "flex",
	flex: 8,
	width: "80%"
}, Tm = () => {
	let [e, t] = L(0);
	return [e, () => t(e + 1)];
}, Em = ({ uuid: e, width: t = 500, height: r = 300, events: i = !1 }) => {
	let { data: a } = O(M((t) => c(["data"], t.results[e]))), [o, s] = Tm(), [l, u] = L(a), d = Object.keys(l[0]).filter((e) => e !== "frequency"), f = hr({
		domain: l.map(bm),
		padding: .2
	}), p = hr({
		domain: d,
		padding: .1
	}), m = gr({ domain: [0, Math.round(Math.max(...l.map((e) => Math.max(...d.map((t) => Number(e[t]))))) * 1.5 * 10) / 10] }), h = _r({
		domain: d,
		range: [
			gm,
			_m,
			vm
		]
	});
	P(() => n("UPDATE_RESULT", (t) => {
		t.uuid === e && u(t.result.data);
	}), [e]);
	let g = t - 60, _ = r - 30;
	return f.rangeRound([0, g]), p.rangeRound([0, f.bandwidth()]), m.range([_, 0]), console.log(l), t < 10 ? null : /* @__PURE__ */ V("svg", {
		width: t,
		height: r,
		children: [
			/* @__PURE__ */ B(xr, {
				scale: m,
				width: g,
				height: _,
				left: 60
			}),
			/* @__PURE__ */ B(mr, {
				left: 60,
				children: /* @__PURE__ */ B(fr, {
					data: l,
					keys: d,
					height: _,
					x0: bm,
					x0Scale: f,
					x1Scale: p,
					yScale: m,
					color: h,
					children: (e) => e.map((e) => /* @__PURE__ */ B(mr, {
						left: e.x0,
						children: e.bars.map((t) => /* @__PURE__ */ B("rect", {
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
			/* @__PURE__ */ B(vr, {
				top: _,
				left: 60,
				scale: f,
				stroke: ym,
				tickStroke: ym,
				label: "Octave Band (Hz)",
				tickLabelProps: () => ({
					fill: ym,
					fontSize: 11,
					textAnchor: "middle"
				})
			}),
			/* @__PURE__ */ B(yr, {
				scale: m,
				stroke: ym,
				left: 60,
				tickStroke: ym,
				label: "Reverberation Time (s)",
				tickLabelProps: () => ({
					fill: ym,
					fontSize: 11,
					textAnchor: "end"
				})
			})
		]
	});
}, Dm = ({ uuid: e, width: t = 500, height: n = 300, events: r = !1 }) => {
	let { data: i } = O(M((t) => c(["data"], t.results[e]))), a = Object.keys(i[0]).filter((e) => e !== "frequency"), o = _r({
		domain: a,
		range: [
			gm,
			_m,
			vm
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
	return t < 10 ? null : /* @__PURE__ */ V(H, {
		sx: xm,
		children: [/* @__PURE__ */ B(U, {
			sx: Sm,
			children: "Statistical RT60 Results"
		}), /* @__PURE__ */ V(H, {
			sx: Cm,
			children: [/* @__PURE__ */ B(H, {
				sx: wm,
				children: /* @__PURE__ */ B(Em, {
					width: t,
					height: n,
					uuid: e,
					events: r
				})
			}), /* @__PURE__ */ B(H, {
				sx: xm,
				children: /* @__PURE__ */ B(wr, {
					scale: o,
					labelFormat: (e) => s(e)
				})
			})]
		})]
	});
}, Om = {
	display: "flex",
	flexDirection: "column"
}, km = {
	display: "flex",
	justifyContent: "center"
}, Am = {
	display: "flex",
	flexDirection: "row",
	flex: 1
}, jm = {
	display: "flex",
	flex: 8,
	width: "100%"
}, Mm = {
	display: "flex",
	flexDirection: "column",
	p: "8px 16px",
	fontSize: 12
}, Nm = (e) => e.time, Pm = (e) => e.amplitude, Fm = ({ uuid: e, width: t = 400, height: r = 200 }) => {
	let { data: i } = O(M((t) => c(["data"], t.results[e]))), [a, o] = L(i);
	P(() => n("UPDATE_RESULT", (t) => {
		t.uuid === e && o(t.result.data);
	}), [e]);
	let s = t - 60, l = r - 60;
	if (!a || a.length === 0) return /* @__PURE__ */ B("svg", {
		width: t,
		height: r,
		children: /* @__PURE__ */ B("text", {
			x: t / 2,
			y: r / 2,
			textAnchor: "middle",
			children: "No impulse response data"
		})
	});
	let u = Math.max(...a.map(Nm)), d = Math.max(...a.map((e) => Math.abs(e.amplitude)));
	if (!Number.isFinite(u) || u <= 0 || !Number.isFinite(d) || d <= 0) return /* @__PURE__ */ B("svg", {
		width: t,
		height: r,
		children: /* @__PURE__ */ B("text", {
			x: t / 2,
			y: r / 2,
			textAnchor: "middle",
			children: "Invalid impulse response data"
		})
	});
	let f = gr({
		range: [0, s],
		domain: [0, u]
	}), p = gr({
		range: [l, 0],
		domain: [-d, d]
	});
	return /* @__PURE__ */ V("svg", {
		width: t,
		height: r,
		children: [
			/* @__PURE__ */ B(br, {
				xScale: f,
				yScale: p,
				width: s,
				height: l,
				left: 60
			}),
			/* @__PURE__ */ B(mr, {
				left: 60,
				children: /* @__PURE__ */ B(pr, {
					data: a,
					x: (e) => f(Nm(e)),
					y: (e) => p(Pm(e)),
					stroke: "#2563eb",
					strokeWidth: 1
				})
			}),
			/* @__PURE__ */ B(vr, {
				scale: f,
				top: l,
				left: 60,
				label: "Time (s)"
			}),
			/* @__PURE__ */ B(yr, {
				scale: p,
				left: 60,
				label: "Amplitude"
			})
		]
	});
}, Im = ({ uuid: e, width: t = 400, height: n = 300, events: r = !1 }) => {
	let { name: i, info: a, kind: o } = O(M((t) => c([
		"name",
		"info",
		"kind"
	], t.results[e]))), s = o === ie.EnergyDecay, l = s ? a.binRate : a.sampleRate;
	return t < 10 ? null : /* @__PURE__ */ V(H, {
		sx: Om,
		children: [/* @__PURE__ */ B(U, {
			sx: km,
			children: i
		}), /* @__PURE__ */ V(H, {
			sx: Am,
			children: [/* @__PURE__ */ B(H, {
				sx: jm,
				children: /* @__PURE__ */ B(Sr, {
					debounceTime: 10,
					children: ({ width: t }) => /* @__PURE__ */ B(Fm, {
						width: t,
						height: n,
						uuid: e,
						events: r
					})
				})
			}), /* @__PURE__ */ V(H, {
				sx: Mm,
				children: [
					/* @__PURE__ */ V("div", { children: [
						/* @__PURE__ */ B("b", { children: "Source:" }),
						" ",
						a.sourceName
					] }),
					/* @__PURE__ */ V("div", { children: [
						/* @__PURE__ */ B("b", { children: "Receiver:" }),
						" ",
						a.receiverName
					] }),
					/* @__PURE__ */ V("div", { children: [
						/* @__PURE__ */ V("b", { children: [s ? "Energy bin rate" : "Sample Rate", ":"] }),
						" ",
						l,
						" Hz"
					] }),
					s && /* @__PURE__ */ B("div", { children: "Broadband energy envelope — not a convolutable IR" })
				]
			})]
		})]
	});
}, Lm = {
	height: "100%",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	color: "#b4b8bb"
};
function Rm({ children: e }) {
	return /* @__PURE__ */ B(H, {
		sx: Lm,
		children: e
	});
}
//#endregion
//#region src/components/ResultsPanel.tsx
var zm = {
	minHeight: 28,
	bgcolor: "action.hover",
	borderBottom: 1,
	borderColor: "divider",
	"& .MuiTabs-indicator": { height: 2 }
}, Bm = {
	minHeight: 28,
	py: 0,
	px: 1.5,
	fontSize: "0.75rem",
	textTransform: "none",
	minWidth: 0
}, Vm = Bt(({ uuid: e }) => {
	let t = O((t) => t.results[e].name);
	return /* @__PURE__ */ B("span", { children: t });
}), Hm = (e) => Object.keys(e.results), Um = () => {
	let e = O(M(Hm)), [t, r] = L(0), i = N((e) => {
		setTimeout(() => {
			let t = Object.keys(O.getState().results).indexOf(e);
			t !== -1 && r(t);
		}, 0);
	}, []);
	P(() => n("ADD_RESULT", (e) => {
		Object.keys(O.getState().results).length === 1 && i(e.uuid);
	}), [i]), P(() => n("SELECT_RESULT_TAB", (e) => i(e)), [i]);
	let a = Math.min(t, Math.max(e.length - 1, 0)), o = e[a];
	return e.length > 0 ? /* @__PURE__ */ V(H, {
		sx: {
			height: "100%",
			display: "flex",
			flexDirection: "column"
		},
		children: [/* @__PURE__ */ B(lr, {
			value: a,
			onChange: (e, t) => r(t),
			variant: "scrollable",
			scrollButtons: "auto",
			sx: zm,
			children: e.map((e) => /* @__PURE__ */ B(ur, {
				label: /* @__PURE__ */ B(Vm, { uuid: e }),
				sx: Bm
			}, e))
		}), /* @__PURE__ */ B(H, {
			sx: {
				flex: 1,
				overflow: "auto"
			},
			children: o && /* @__PURE__ */ B(Wm, { uuid: o })
		})]
	}) : /* @__PURE__ */ B(Rm, { children: "No Results Yet!" });
}, Wm = Bt(({ uuid: e }) => {
	switch (O((t) => t.results[e]?.kind)) {
		case "linear-time-progression": return /* @__PURE__ */ B(hm, {
			uuid: e,
			events: !0
		});
		case "statisticalRT60": return /* @__PURE__ */ B(Dm, {
			uuid: e,
			events: !0
		});
		case "impulseResponse":
		case "energyDecay": return /* @__PURE__ */ B(Im, {
			uuid: e,
			events: !0
		});
		default: return null;
	}
}), Gm = {
	height: "100%",
	overflow: "auto",
	bgcolor: "background.paper"
};
function Km() {
	return /* @__PURE__ */ B(H, {
		sx: Gm,
		children: /* @__PURE__ */ B(Um, {})
	});
}
//#endregion
//#region src/components/workbench/WorkbenchLayout.tsx
var qm = "flexlayout";
function Jm() {
	try {
		let e = w.getItem(qm);
		if (e) return JSON.parse(e);
	} catch (e) {
		console.warn("[WorkbenchLayout] Failed to parse stored layout:", e);
	}
	return Nc;
}
function Ym() {
	let e = I(null), t = I(null);
	t.current === null && (t.current = Fn.fromJson(Jm()));
	let r = t.current, i = N((e) => {
		let t = e.getComponent();
		switch (t) {
			case "CanvasPanel": return /* @__PURE__ */ B(Lc, {});
			case "ObjectsPanel": return /* @__PURE__ */ B(ru, {});
			case "SolversPanel": return /* @__PURE__ */ B(Vd, {});
			case "RendererPanel": return /* @__PURE__ */ B(Qd, {});
			case "ResultsPanel": return /* @__PURE__ */ B(Km, {});
			default: return /* @__PURE__ */ V("div", {
				style: {
					padding: 16,
					color: "var(--mui-palette-text-secondary)"
				},
				children: ["Unknown component: ", t]
			});
		}
	}, []), a = N((e) => {
		try {
			let t = e.toJson();
			w.setItem(qm, JSON.stringify(t));
		} catch (e) {
			console.warn("[WorkbenchLayout] Failed to persist layout:", e);
		}
	}, []);
	return P(() => n("TOGGLE_RESULTS_PANEL", () => {
		r && r.getNodeById(Pc.RESULTS) && r.doAction(Nn.selectTab(Pc.RESULTS));
	}), [r]), P(() => n("RESET_LAYOUT", () => {
		w.removeItem(qm);
		let n = Fn.fromJson(Nc);
		t.current = n, e.current && window.location.reload();
	}), []), /* @__PURE__ */ B("div", {
		style: {
			flex: 1,
			position: "relative",
			overflow: "hidden"
		},
		children: /* @__PURE__ */ B(Pn, {
			ref: e,
			model: r,
			factory: i,
			onModelChange: a,
			realtimeResize: !0
		})
	});
}
//#endregion
//#region src/components/App.tsx
function Xm({ showNavBar: e = !0, onMount: t }) {
	return P(() => {
		t?.();
	}, []), /* @__PURE__ */ V("div", {
		style: {
			width: "100%",
			height: "100%",
			display: "flex",
			flexDirection: "column"
		},
		children: [
			e && /* @__PURE__ */ B(Ws, {}),
			/* @__PURE__ */ B(Qs, {}),
			/* @__PURE__ */ B(ic, {}),
			/* @__PURE__ */ B(Mc, {}),
			/* @__PURE__ */ B(xs, {}),
			/* @__PURE__ */ B(Ss, {}),
			/* @__PURE__ */ B(Ym, {})
		]
	});
}
//#endregion
//#region src/lib/CRAMEditor.tsx
var Zm = zt(function(e, t) {
	let { initialProject: n, onSave: r, onProjectChange: i, onError: o, storagePrefix: s = "cram", showNavBar: c = !0, themeMode: l } = e, u = I(!1);
	S(s), P(() => {
		if (i) return A.subscribe((e, t) => {
			if (e.hasUnsavedChanges && !t.hasUnsavedChanges) try {
				let e = d();
				i(e);
			} catch (e) {
				o?.(e);
			}
		});
	}, [i, o]), P(() => {
		n && u.current && a("RESTORE", { json: n });
	}, [n]), P(() => {
		l && a("SET_THEME_MODE", l);
	}, [l]), P(() => (u.current = !0, () => {
		console.log("[CRAMEditor] Unmounting - cleaning up resources..."), u.current = !1;
		try {
			E.dispose();
		} catch (e) {
			console.warn("[CRAMEditor] Error disposing renderer:", e);
		}
		try {
			h.clear();
		} catch (e) {
			console.warn("[CRAMEditor] Error clearing messenger:", e);
		}
		try {
			le();
		} catch (e) {
			console.warn("[CRAMEditor] Error resetting stores:", e);
		}
		console.log("[CRAMEditor] Cleanup complete");
	}), []);
	let d = N(() => {
		let e = h.postMessage("SAVE_CONTAINERS")[0] || [], t = h.postMessage("SAVE_SOLVERS")[0] || [], { projectName: n, version: r } = A.getState();
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
	return Vt(t, () => ({
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
	}), [d, r]), /* @__PURE__ */ B(Xm, { showNavBar: c });
}), Qm = {
	position: "relative",
	width: "100%",
	height: "100%",
	userSelect: "none",
	overflow: "hidden"
};
function $m() {
	try {
		let e = w.getItem("layout");
		if (e) return JSON.parse(e);
	} catch (e) {
		console.warn("Failed to parse layout from localStorage:", e);
	}
	return JSON.parse(T);
}
var eh = zt(function(e, t) {
	let { initialProject: n, onSave: r, onProjectChange: i, onError: o, storagePrefix: s = "cram" } = e, c = I(null), l = I(null), u = I(null), d = I(null), f = I(!1);
	S(s), I($m()), P(() => {
		if (i) return A.subscribe((e, t) => {
			if (e.hasUnsavedChanges && !t.hasUnsavedChanges) try {
				let e = p();
				i(e);
			} catch (e) {
				o?.(e);
			}
		});
	}, [i, o]), P(() => {
		n && f.current && a("RESTORE", { json: n });
	}, [n]), P(() => {
		c.current && h.postMessage("APP_MOUNTED", c.current), f.current = !0;
		let e = c.current?.parentElement, t = null;
		return e && (t = new ResizeObserver(() => {
			E.checkresize(), E.needsToRender = !0;
		}), t.observe(e)), () => {
			console.log("[CRAMCanvas] Unmounting - cleaning up resources..."), f.current = !1, t && t.disconnect();
			try {
				E.dispose();
			} catch (e) {
				console.warn("[CRAMCanvas] Error disposing renderer:", e);
			}
			try {
				h.clear();
			} catch (e) {
				console.warn("[CRAMCanvas] Error clearing messenger:", e);
			}
			try {
				le();
			} catch (e) {
				console.warn("[CRAMCanvas] Error resetting stores:", e);
			}
			console.log("[CRAMCanvas] Cleanup complete");
		};
	}, []);
	let p = N(() => {
		let e = h.postMessage("SAVE_CONTAINERS")[0] || [], t = h.postMessage("SAVE_SOLVERS")[0] || [], { projectName: n, version: r } = A.getState();
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
	return Vt(t, () => ({
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
	}), [p, r]), /* @__PURE__ */ V(z, { children: [
		/* @__PURE__ */ B(Qs, {}),
		/* @__PURE__ */ B(ic, {}),
		/* @__PURE__ */ B(Mc, {}),
		/* @__PURE__ */ B(xs, {}),
		/* @__PURE__ */ B(Ss, {}),
		/* @__PURE__ */ V(H, {
			sx: Qm,
			children: [
				/* @__PURE__ */ B("div", {
					id: "response-overlay",
					className: "response_overlay response_overlay-hidden",
					ref: d
				}),
				/* @__PURE__ */ B("div", {
					id: "canvas_overlay",
					ref: l
				}),
				/* @__PURE__ */ B("div", {
					id: "orientation-overlay",
					ref: u
				}),
				/* @__PURE__ */ B("canvas", {
					id: "renderer-canvas",
					ref: c
				})
			]
		})
	] });
}), th = (e, t) => ({
	display: "flex",
	alignItems: "center",
	p: "4px 8px",
	bgcolor: t ? "#cce5ff" : e ? "#e8ecef" : "transparent",
	borderLeft: t ? "2px solid #2d72d2" : "2px solid transparent",
	cursor: "pointer",
	userSelect: "none",
	"&:hover": { bgcolor: t ? "#b3d7ff" : "#e8ecef" }
}), nh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "4px",
	color: "#5c6670",
	"& svg": { fontSize: 16 }
}, rh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "6px",
	color: "#5c6670",
	"& svg": { fontSize: 14 }
}, ih = {
	flex: 1,
	fontSize: 12,
	fontWeight: 500,
	color: "#1c2127",
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap"
}, ah = {
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
}, oh = (e) => ({
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
}), sh = {
	room: hc,
	source: gc,
	receiver: _c,
	surface: mc
};
function ch({ name: e, kind: t, expanded: n, selected: r, visible: i, onToggle: a, onSelect: o, onVisibilityToggle: s, onNameChange: c, onMouseEnter: l, onMouseLeave: u }) {
	let [d, f] = L(!1), [p, m] = L(e), h = I(null), g = sh[t] || mc;
	return P(() => {
		m(e);
	}, [e]), P(() => {
		d && h.current && (h.current.focus(), h.current.select());
	}, [d]), /* @__PURE__ */ V(H, {
		sx: th(n, r),
		onClick: (e) => {
			d || o(e);
		},
		onMouseEnter: l,
		onMouseLeave: u,
		children: [
			/* @__PURE__ */ B(H, {
				sx: nh,
				onClick: (e) => {
					e.stopPropagation(), a();
				},
				children: B(n ? On : kn, {})
			}),
			/* @__PURE__ */ B(H, {
				sx: rh,
				children: /* @__PURE__ */ B(g, {})
			}),
			d ? /* @__PURE__ */ B(H, {
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
				sx: ah
			}) : /* @__PURE__ */ B(H, {
				sx: ih,
				onDoubleClick: (e) => {
					e.stopPropagation(), f(!0);
				},
				children: e
			}),
			/* @__PURE__ */ B(H, {
				sx: oh(i),
				onClick: (e) => {
					e.stopPropagation(), s();
				},
				children: B(i ? zn : Bn, {})
			})
		]
	});
}
//#endregion
//#region src/components/object-cards/ObjectCard.tsx
var lh = { borderBottom: "1px solid #e1e4e8" }, uh = (e) => ({
	display: e ? "block" : "none",
	pl: "20px"
}), dh = { py: "4px" }, fh = { borderTop: "1px solid #e1e4e8" }, ph = /* @__PURE__ */ new Map([
	["room", Bl],
	["source", Ml],
	["receiver", Ll],
	["surface", Yl]
]);
function mh({ uuid: e, defaultExpanded: t = !1, isChild: r = !1 }) {
	let [i, o] = L(t), [s, c] = L(!1), [l, u] = L(""), [d, f] = L(!0), p = k((t) => t.containers[e]), m = k((e) => e.version), h = F(() => p?.kind === "room" ? p.allSurfaces.map((e) => e.uuid) : [], [p, m]);
	P(() => {
		p && (u(p.name || "Untitled"), f(p.visible));
	}, [p, m]), P(() => {
		let t = p?.kind ? `${p.kind.toUpperCase()}_SET_PROPERTY` : null;
		if (t) return n(t, ({ uuid: t, property: n, value: r }) => {
			t === e && n === "name" && u(r);
		});
	}, [e, p?.kind]), P(() => {
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
	let g = N(() => {
		o((e) => !e);
	}, []), _ = N((e) => {
		p && a(e.shiftKey ? "APPEND_SELECTION" : "SET_SELECTION", [p]);
	}, [p]), v = N(() => {
		p?.kind === "surface" && a("SURFACE_HOVER", e);
	}, [p?.kind, e]), y = N(() => {
		p?.kind === "surface" && a("SURFACE_UNHOVER", e);
	}, [p?.kind, e]), b = N(() => {
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
	]), x = N((t) => {
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
	let S = p.kind || "object", C = ph.get(S);
	return /* @__PURE__ */ V(H, {
		sx: lh,
		children: [/* @__PURE__ */ B(ch, {
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
		}), /* @__PURE__ */ V(H, {
			sx: uh(i),
			children: [C && /* @__PURE__ */ B(H, {
				sx: dh,
				children: /* @__PURE__ */ B(C, { uuid: e })
			}), h.length > 0 && /* @__PURE__ */ B(H, {
				sx: fh,
				children: h.map((e) => /* @__PURE__ */ B(mh, {
					uuid: e,
					isChild: !0
				}, e))
			})]
		})]
	});
}
//#endregion
//#region src/components/object-cards/ObjectCardList.tsx
var hh = { overflowY: "auto" }, gh = (e) => ({
	display: "flex",
	alignItems: "center",
	p: "4px 8px",
	bgcolor: e ? "#e8ecef" : "transparent",
	cursor: "pointer",
	userSelect: "none",
	borderBottom: "1px solid #e1e4e8",
	"&:hover": { bgcolor: "#e8ecef" }
}), _h = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "4px",
	color: "#5c6670",
	"& svg": { fontSize: 16 }
}, vh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "6px",
	color: "#5c6670",
	"& svg": { fontSize: 14 }
}, yh = {
	flex: 1,
	fontSize: 12,
	fontWeight: 500,
	color: "#1c2127"
}, bh = {
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
}, xh = (e) => ({
	display: e ? "block" : "none",
	pl: "20px"
}), Sh = {
	p: "24px 16px",
	textAlign: "center",
	color: "#8c959f",
	fontSize: 13
};
function Ch() {
	let [e, t] = L(!0), n = k(M((e) => e.containers)), r = F(() => {
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
	return /* @__PURE__ */ V(H, {
		sx: hh,
		children: [/* @__PURE__ */ V(H, {
			sx: gh(e),
			onClick: () => t(!e),
			children: [
				/* @__PURE__ */ B(H, {
					sx: _h,
					children: B(e ? On : kn, {})
				}),
				/* @__PURE__ */ B(H, {
					sx: vh,
					children: /* @__PURE__ */ B(Tr, {})
				}),
				/* @__PURE__ */ B(U, {
					sx: yh,
					children: "Objects"
				}),
				i > 0 && /* @__PURE__ */ B(H, {
					sx: bh,
					children: i
				})
			]
		}), /* @__PURE__ */ B(H, {
			sx: xh(e),
			children: i === 0 ? /* @__PURE__ */ B(U, {
				sx: Sh,
				children: "No objects yet. Import a model or add objects from the menu."
			}) : /* @__PURE__ */ V(z, { children: [
				r.rooms.map((e) => /* @__PURE__ */ B(mh, { uuid: e }, e)),
				r.sources.map((e) => /* @__PURE__ */ B(mh, { uuid: e }, e)),
				r.receivers.map((e) => /* @__PURE__ */ B(mh, { uuid: e }, e))
			] })
		})]
	});
}
//#endregion
//#region src/components/solver-cards/SolverCardHeader.tsx
var wh = gn`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`, Th = (e) => ({
	display: "flex",
	alignItems: "center",
	p: "4px 8px",
	bgcolor: e ? "#e8ecef" : "transparent",
	cursor: "pointer",
	userSelect: "none",
	"&:hover": { bgcolor: "#e8ecef" },
	"&:hover .menu-button": { opacity: 1 }
}), Eh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "4px",
	color: "#5c6670",
	"& svg": { fontSize: 16 }
}, Dh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "6px",
	color: "#5c6670",
	"& svg": { fontSize: 14 }
}, Oh = {
	flex: 1,
	fontSize: 12,
	fontWeight: 500,
	color: "#1c2127",
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap"
}, kh = {
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
}, Ah = (e, t) => ({
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
		animation: t ? `${wh} 1s linear infinite` : "none"
	},
	"&:hover": {
		bgcolor: e ? "transparent" : "#d0d7de",
		color: e ? "#c0c0c0" : "#1c2127"
	}
}), jh = {
	"ray-tracer": Or,
	"image-source": kr,
	"fdtd-2d": Ar,
	rt60: jr,
	energydecay: Un,
	art: Mr,
	ard: Nr,
	renderer: hn,
	"beam-trace": An
};
function Mh({ name: e, kind: t, expanded: n, canCalculate: r = !1, isCalculating: i = !1, onToggle: a, onCalculate: o, onClear: s, onDelete: c, onDuplicate: l }) {
	let u = jh[t] || Or, [d, f] = L(null), p = !!d, m = (e) => {
		e.stopPropagation(), o?.();
	}, h = (e) => {
		e.stopPropagation(), s?.();
	}, g = (e) => {
		e.stopPropagation(), f(e.currentTarget);
	}, _ = () => {
		f(null);
	};
	return /* @__PURE__ */ V(H, {
		sx: Th(n),
		onClick: a,
		children: [
			/* @__PURE__ */ B(H, {
				sx: Eh,
				children: B(n ? On : kn, {})
			}),
			/* @__PURE__ */ B(H, {
				sx: Dh,
				children: /* @__PURE__ */ B(u, {})
			}),
			/* @__PURE__ */ B(H, {
				sx: Oh,
				children: e
			}),
			o && /* @__PURE__ */ B(H, {
				sx: Ah(!r || i, i),
				onClick: m,
				title: i ? "Calculating..." : "Calculate",
				children: /* @__PURE__ */ B(Qn, {})
			}),
			s && /* @__PURE__ */ B(H, {
				sx: Ah(i, !1),
				onClick: h,
				title: "Clear",
				children: /* @__PURE__ */ B(Dr, {})
			}),
			(c || l) && /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B(H, {
				component: "button",
				type: "button",
				className: "menu-button",
				sx: kh,
				onClick: g,
				children: /* @__PURE__ */ B(Er, {})
			}), /* @__PURE__ */ V(dn, {
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
				children: [l && /* @__PURE__ */ V(fn, {
					onClick: () => {
						_(), l?.();
					},
					children: [/* @__PURE__ */ B(Ln, { children: /* @__PURE__ */ B(Pr, { fontSize: "small" }) }), /* @__PURE__ */ B(Rn, { children: "Duplicate" })]
				}), c && /* @__PURE__ */ V(fn, {
					onClick: () => {
						_(), c?.();
					},
					sx: { color: "error.main" },
					children: [/* @__PURE__ */ B(Ln, { children: /* @__PURE__ */ B(Vn, {
						fontSize: "small",
						color: "error"
					}) }), /* @__PURE__ */ B(Rn, { children: "Delete" })]
				})]
			})] })
		]
	});
}
//#endregion
//#region src/components/solver-cards/SolverCard.tsx
var Nh = { borderBottom: "1px solid #e1e4e8" }, Ph = (e) => ({
	display: e ? "block" : "none",
	pl: "20px"
}), Fh = { py: "4px" }, Ih = /* @__PURE__ */ new Map([
	["image-source", Wu],
	["ray-tracer", Vu],
	["rt60", Ku],
	["fdtd-2d", yd],
	["energydecay", qu],
	["art", xd],
	["ard", Md],
	["beam-trace", od]
]);
function Lh({ uuid: e, defaultExpanded: t = !1 }) {
	let [r, o] = L(t), [s, c] = L(!1), l = f((t) => t.solvers[e]), u = N(() => {
		o((e) => !e);
	}, []), d = N(() => {
		i(e);
	}, [e]);
	P(() => {
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
	let p = F(() => {
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
	}, [l]), m = N(() => {
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
	}, [l, e]), h = N(() => {
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
	].includes(l.kind), v = Ih.get(l.kind);
	return /* @__PURE__ */ V(H, {
		sx: Nh,
		children: [/* @__PURE__ */ B(Mh, {
			name: l.name,
			kind: l.kind,
			expanded: r,
			canCalculate: p,
			isCalculating: s,
			onToggle: u,
			onCalculate: g ? m : void 0,
			onClear: _ ? h : void 0,
			onDelete: d
		}), /* @__PURE__ */ B(H, {
			sx: Ph(r),
			children: v && /* @__PURE__ */ B(H, {
				sx: Fh,
				children: /* @__PURE__ */ B(v, { uuid: e })
			})
		})]
	});
}
//#endregion
//#region src/components/solver-cards/RendererCard.tsx
var Rh = { borderBottom: "1px solid #e1e4e8" }, zh = (e) => ({
	display: e ? "block" : "none",
	pl: "20px"
}), Bh = { py: "4px" };
function Vh({ defaultExpanded: e = !1 }) {
	let [t, n] = L(e), r = N(() => {
		n((e) => !e);
	}, []);
	return /* @__PURE__ */ V(H, {
		sx: Rh,
		children: [/* @__PURE__ */ B(Mh, {
			name: "Renderer",
			kind: "renderer",
			expanded: t,
			onToggle: r
		}), /* @__PURE__ */ B(H, {
			sx: zh(t),
			children: /* @__PURE__ */ B(H, {
				sx: Bh,
				children: /* @__PURE__ */ B(Xd, {})
			})
		})]
	});
}
//#endregion
//#region src/components/solver-cards/SolverCardList.tsx
var Hh = gn`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`, Uh = { overflowY: "auto" }, Wh = (e) => ({
	display: "flex",
	alignItems: "center",
	p: "4px 8px",
	bgcolor: e ? "#e8ecef" : "transparent",
	cursor: "pointer",
	userSelect: "none",
	borderBottom: "1px solid #e1e4e8",
	"&:hover": { bgcolor: "#e8ecef" }
}), Gh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "4px",
	color: "#5c6670",
	"& svg": { fontSize: 16 }
}, Kh = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 16,
	height: 16,
	mr: "6px",
	color: "#5c6670",
	"& svg": { fontSize: 14 }
}, qh = {
	flex: 1,
	fontSize: 12,
	fontWeight: 500,
	color: "#1c2127"
}, Jh = {
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
}, Yh = (e, t) => ({
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
		animation: t ? `${Hh} 1s linear infinite` : "none"
	}
}), Xh = (e) => ({
	display: e ? "block" : "none",
	pl: "20px"
}), Zh = {
	p: "16px",
	textAlign: "center",
	color: "#8c959f",
	fontSize: 12
};
function Qh() {
	let [e, t] = L(!0), n = f((e) => e.solvers), r = A((e) => e.autoCalculate), i = A((e) => e.progress.visible), o = F(() => Object.keys(n), [n]), s = o.length + 1;
	return /* @__PURE__ */ V(H, {
		sx: Uh,
		children: [/* @__PURE__ */ V(H, {
			sx: Wh(e),
			onClick: () => t(!e),
			children: [
				/* @__PURE__ */ B(H, {
					sx: Gh,
					children: B(e ? On : kn, {})
				}),
				/* @__PURE__ */ B(H, {
					sx: Kh,
					children: /* @__PURE__ */ B(Fr, {})
				}),
				/* @__PURE__ */ B(H, {
					sx: qh,
					children: "Solvers"
				}),
				/* @__PURE__ */ B(H, {
					sx: Jh,
					children: s
				}),
				/* @__PURE__ */ B(H, {
					component: "button",
					sx: Yh(r, r && i),
					onClick: (e) => {
						e.stopPropagation(), a("SET_AUTO_CALCULATE", !r);
					},
					title: r ? "Auto-calculate enabled" : "Auto-calculate disabled",
					children: /* @__PURE__ */ B($n, {})
				})
			]
		}), /* @__PURE__ */ V(H, {
			sx: Xh(e),
			children: [o.length > 0 ? o.map((e) => /* @__PURE__ */ B(Lh, { uuid: e }, e)) : /* @__PURE__ */ B(H, {
				sx: Zh,
				children: "No solvers yet. Add one from the menu."
			}), /* @__PURE__ */ B(Vh, {})]
		})]
	});
}
var $h = {
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
}, eg = {
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
}, tg = {
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
//#endregion
//#region src/examples/events.ts
n("OPEN_EXAMPLE", (e) => {
	let { hasUnsavedChanges: t } = A.getState();
	if (t && !confirm("Open an example? Unsaved data will be lost.")) return;
	let n = ng[e];
	a("RESTORE", { json: n });
});
//#endregion
//#region src/examples/index.ts
var ng = {
	shoebox: $h,
	concord: eg,
	auditorium: tg
};
//#endregion
export { eh as CRAMCanvas, Zm as CRAMEditor, Zm as default, Ch as ObjectsPanel, Qh as SolversPanel, ng as examples };

//# sourceMappingURL=index.js.map