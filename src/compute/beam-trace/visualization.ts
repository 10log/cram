import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import chroma from "chroma-js";
import type { BeamVisualizationData, Solver3D } from "beam-trace";
import Receiver from "../../objects/receiver";
import { renderer } from "../../render/renderer";
import type { BeamTracePath, VisualizationMode } from "./paths";

const colorScale = chroma.scale(["#ff8a0b", "#000080"]).mode("lch");

export function getOrderColor(order: number, maxOrder: number): number {
  const numColors = maxOrder + 1;
  const colors = colorScale.colors(numColors);
  const colorIndex = Math.min(order, numColors - 1);
  const color = chroma(colors[colorIndex]);
  return parseInt(color.hex().slice(1), 16);
}

export function createHighlightLine(): THREE.Mesh {
  const line = new MeshLine();
  line.setPoints(new Float32Array(0));
  const material = new MeshLineMaterial({
    lineWidth: 0.1,
    color: 0xff0000,
    sizeAttenuation: 1,
  });
  return new THREE.Mesh(line, material);
}

export function disposeObject3D(child: THREE.Object3D) {
  if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
    child.geometry?.dispose();
    const material = child.material;
    if (Array.isArray(material)) {
      for (const mat of material) {
        if (mat instanceof THREE.Material) mat.dispose();
      }
    } else if (material instanceof THREE.Material) {
      material.dispose();
    }
  }
}

export function clearGroup(group: THREE.Group) {
  while (group.children.length > 0) {
    const child = group.children[0];
    group.remove(child);
    disposeObject3D(child);
  }
}

export function clearVisualization(virtualSourcesGroup: THREE.Group) {
  renderer.markup.clearLines();
  renderer.markup.clearPoints();
  clearGroup(virtualSourcesGroup);
}

export function beamHasValidPath(
  beam: BeamVisualizationData,
  paths: BeamTracePath[],
): boolean {
  const polygonPath = beam.polygonPath;
  if (!polygonPath || polygonPath.length === 0) return false;

  const targetOrder = beam.reflectionOrder;

  for (const path of paths) {
    if (path.order !== targetOrder) continue;
    let matches = true;
    for (let i = 0; i < polygonPath.length; i++) {
      const pathIndex = targetOrder - i;
      const pathPolygonId = path.polygonIds[pathIndex];
      if (pathPolygonId !== polygonPath[i]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
}

export function drawPaths(params: {
  validPaths: BeamTracePath[];
  visibleOrders: number[];
  maxReflectionOrder: number;
  virtualSourcesGroup: THREE.Group;
  lastMetrics: { bufferUsage?: ReturnType<typeof renderer.markup.getUsageStats> } | null;
}) {
  const { validPaths, visibleOrders, maxReflectionOrder, virtualSourcesGroup, lastMetrics } = params;
  const filteredPaths = validPaths.filter(path => visibleOrders.includes(path.order));

  filteredPaths.forEach(path => {
    const colorHex = getOrderColor(path.order, maxReflectionOrder);
    const r = ((colorHex >> 16) & 0xff) / 255;
    const g = ((colorHex >> 8) & 0xff) / 255;
    const b = (colorHex & 0xff) / 255;
    const color: [number, number, number] = [r, g, b];

    for (let i = 0; i < path.points.length - 1; i++) {
      const p1 = path.points[i];
      const p2 = path.points[i + 1];
      renderer.markup.addLine(
        [p1.x, p1.y, p1.z],
        [p2.x, p2.y, p2.z],
        color,
        color,
      );
    }
  });

  filteredPaths.forEach(path => {
    if (path.bandEnergy && path.points.length === 3) {
      const diffPt = path.points[1];
      const colorHex = getOrderColor(path.order, maxReflectionOrder);
      const geom = new THREE.SphereGeometry(0.06, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: colorHex });
      const sphere = new THREE.Mesh(geom, mat);
      sphere.position.copy(diffPt);
      virtualSourcesGroup.add(sphere);
    }
  });

  const usageStats = renderer.markup.getUsageStats();
  if (lastMetrics) {
    lastMetrics.bufferUsage = usageStats;
  }

  if (usageStats.overflowWarning) {
    console.error(`⚠️ Path buffer overflow! Lines: ${usageStats.linesUsed}/${usageStats.linesCapacity}. Reduce reflection order.`);
  } else if (usageStats.linesPercent > 80) {
    console.warn(`Buffer usage high: Lines ${usageStats.linesPercent.toFixed(1)}%`);
  }
}

export interface BeamDrawHost {
  btSolver: Solver3D | null;
  validPaths: BeamTracePath[];
  visibleOrders: number[];
  maxReflectionOrder: number;
  showAllBeams: boolean;
  virtualSourcesGroup: THREE.Group;
  virtualSourceMap: Map<THREE.Mesh, BeamVisualizationData & { polygonPath: number[] }>;
  selectedVirtualSource: THREE.Mesh | null;
}

export function drawBeams(host: BeamDrawHost) {
  if (!host.btSolver) return;

  clearGroup(host.virtualSourcesGroup);
  host.virtualSourceMap.clear();
  host.selectedVirtualSource = null;

  const paths = host.validPaths;
  const beamData = host.btSolver.getBeamsForVisualization(host.maxReflectionOrder);

  beamData.forEach((beam: BeamVisualizationData) => {
    if (!host.visibleOrders.includes(beam.reflectionOrder)) return;

    const hasValidPath = beamHasValidPath(beam, paths);
    if (!hasValidPath && !host.showAllBeams) return;

    const radius = Math.max(0.05, 0.10 - beam.reflectionOrder * 0.01);
    const colorHex = getOrderColor(beam.reflectionOrder, host.maxReflectionOrder);

    let finalColor = colorHex;
    if (!hasValidPath) {
      const r = ((colorHex >> 16) & 0xff) * 0.4 + 128 * 0.6;
      const g = ((colorHex >> 8) & 0xff) * 0.4 + 128 * 0.6;
      const b = (colorHex & 0xff) * 0.4 + 128 * 0.6;
      finalColor = (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
    }

    const vs = new THREE.Vector3(beam.virtualSource[0], beam.virtualSource[1], beam.virtualSource[2]);

    const vsGeom = new THREE.SphereGeometry(radius, 12, 12);
    const vsMat = new THREE.MeshStandardMaterial({
      color: finalColor,
      transparent: !hasValidPath,
      opacity: hasValidPath ? 1.0 : 0.4,
      roughness: 0.6,
      metalness: 0.1,
    });
    const vsMesh = new THREE.Mesh(vsGeom, vsMat);
    vsMesh.position.copy(vs);
    host.virtualSourcesGroup.add(vsMesh);

    if (hasValidPath) {
      host.virtualSourceMap.set(vsMesh, {
        ...beam,
        polygonPath: beam.polygonPath || [],
      });
    }

    const apertureVerts = beam.apertureVertices;
    if (apertureVerts && apertureVerts.length >= 3) {
      const aperturePoints = apertureVerts.map(v => new THREE.Vector3(v[0], v[1], v[2]));

      const fillGeom = new THREE.BufferGeometry();
      const positions = new Float32Array(aperturePoints.length * 3);
      for (let i = 0; i < aperturePoints.length; i++) {
        positions[i * 3] = aperturePoints[i].x;
        positions[i * 3 + 1] = aperturePoints[i].y;
        positions[i * 3 + 2] = aperturePoints[i].z;
      }
      fillGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const indices: number[] = [];
      for (let i = 1; i < aperturePoints.length - 1; i++) {
        indices.push(0, i, i + 1);
      }
      fillGeom.setIndex(indices);
      fillGeom.computeVertexNormals();

      const fillMat = new THREE.MeshBasicMaterial({
        color: finalColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: hasValidPath ? 0.20 : 0.08,
        depthWrite: false,
      });
      host.virtualSourcesGroup.add(new THREE.Mesh(fillGeom, fillMat));

      const outlineGeom = new THREE.BufferGeometry().setFromPoints(aperturePoints);
      const outlineMat = new THREE.LineBasicMaterial({
        color: finalColor,
        transparent: true,
        opacity: hasValidPath ? 0.50 : 0.20,
      });
      host.virtualSourcesGroup.add(new THREE.LineLoop(outlineGeom, outlineMat));

      const conePositions: THREE.Vector3[] = [];
      for (const ap of aperturePoints) {
        conePositions.push(vs.clone(), ap);
      }
      const coneGeom = new THREE.BufferGeometry().setFromPoints(conePositions);
      const coneMat = new THREE.LineBasicMaterial({
        color: finalColor,
        transparent: true,
        opacity: hasValidPath ? 0.35 : 0.12,
      });
      host.virtualSourcesGroup.add(new THREE.LineSegments(coneGeom, coneMat));
    }
  });

  renderer.needsToRender = true;
}

export function highlightVirtualSourcePath(params: {
  beam: BeamVisualizationData & { polygonPath: number[] };
  validPaths: BeamTracePath[];
  maxReflectionOrder: number;
  receiver: Receiver | undefined;
  selectedPath: THREE.Mesh;
  selectedBeamsGroup: THREE.Group;
}) {
  const { beam, validPaths, maxReflectionOrder, receiver, selectedPath, selectedBeamsGroup } = params;

  (selectedPath.geometry as MeshLine).setPoints(new Float32Array(0));
  clearGroup(selectedBeamsGroup);

  const colorHex = getOrderColor(beam.reflectionOrder, maxReflectionOrder);
  const vs = new THREE.Vector3(beam.virtualSource[0], beam.virtualSource[1], beam.virtualSource[2]);
  if (!receiver) return;
  const receiverPos = receiver.position.clone();

  const dashedMaterial = new THREE.LineDashedMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.4,
    dashSize: 0.3,
    gapSize: 0.15,
  });
  const unfoldedLineGeom = new THREE.BufferGeometry().setFromPoints([vs, receiverPos]);
  const unfoldedLine = new THREE.Line(unfoldedLineGeom, dashedMaterial);
  unfoldedLine.computeLineDistances();
  selectedBeamsGroup.add(unfoldedLine);

  const highlightGeom = new THREE.SphereGeometry(0.18, 16, 16);
  const highlightMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.4,
  });
  const highlightMesh = new THREE.Mesh(highlightGeom, highlightMat);
  highlightMesh.position.copy(vs);
  selectedBeamsGroup.add(highlightMesh);

  const polygonPath = beam.polygonPath;
  if (!polygonPath || polygonPath.length === 0) return;

  const targetOrder = beam.reflectionOrder;

  for (const path of validPaths) {
    if (path.order !== targetOrder) continue;
    let matches = true;
    for (let i = 0; i < polygonPath.length; i++) {
      const pathIndex = targetOrder - i;
      const pathPolygonId = path.polygonIds[pathIndex];
      if (pathPolygonId !== polygonPath[i]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      const points = path.points;
      const numReflections = path.order;

      for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        const segLen = start.distanceTo(end);
        const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const segmentOrder = numReflections - i;
        const segColor = (segmentOrder === 0) ? 0xffffff : getOrderColor(segmentOrder, maxReflectionOrder);

        const cylGeom = new THREE.CylinderGeometry(0.025, 0.025, segLen, 8);
        const cylMat = new THREE.MeshBasicMaterial({ color: segColor });
        const cyl = new THREE.Mesh(cylGeom, cylMat);
        cyl.position.copy(midPoint);
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        cyl.setRotationFromQuaternion(quaternion);
        selectedBeamsGroup.add(cyl);
      }

      for (let i = 1; i < path.points.length - 1; i++) {
        const pointOrder = numReflections - i + 1;
        const pointColor = getOrderColor(pointOrder, maxReflectionOrder);
        const pointGeom = new THREE.SphereGeometry(0.08, 12, 12);
        const pointMat = new THREE.MeshBasicMaterial({ color: pointColor });
        const pointMesh = new THREE.Mesh(pointGeom, pointMat);
        pointMesh.position.copy(path.points[i]);
        selectedBeamsGroup.add(pointMesh);
      }

      renderer.needsToRender = true;
      return;
    }
  }

  renderer.needsToRender = true;
}

export function highlightPathByIndex(params: {
  pathIndex: number;
  validPaths: BeamTracePath[];
  maxReflectionOrder: number;
  btSolver: Solver3D | null;
  receiver: Receiver | undefined;
  selectedPath: THREE.Mesh;
  selectedBeamsGroup: THREE.Group;
}) {
  const {
    pathIndex, validPaths, maxReflectionOrder, btSolver, receiver,
    selectedPath, selectedBeamsGroup,
  } = params;

  const sortedPaths = [...validPaths].sort((a, b) => a.arrivalTime - b.arrivalTime);
  if (pathIndex < 0 || pathIndex >= sortedPaths.length) {
    console.warn("BeamTraceSolver: Path index out of bounds:", pathIndex);
    return;
  }

  const path = sortedPaths[pathIndex];
  (selectedPath.geometry as MeshLine).setPoints(new Float32Array(0));
  clearGroup(selectedBeamsGroup);

  const pathColorHex = getOrderColor(path.order, maxReflectionOrder);
  const rayMaterial = new THREE.LineBasicMaterial({
    color: pathColorHex,
    linewidth: 2,
    transparent: false,
  });

  for (let i = 0; i < path.points.length - 1; i++) {
    const segmentGeom = new THREE.BufferGeometry().setFromPoints([
      path.points[i],
      path.points[i + 1],
    ]);
    selectedBeamsGroup.add(new THREE.Line(segmentGeom, rayMaterial));
  }

  if (btSolver && receiver) {
    const beamData = btSolver.getBeamsForVisualization(maxReflectionOrder);
    const lastPolygonId = path.polygonIds[path.order];
    if (lastPolygonId !== null) {
      const matchingBeam = beamData.find((beam: BeamVisualizationData) =>
        beam.polygonId === lastPolygonId && beam.reflectionOrder === path.order
      );
      if (matchingBeam) {
        const dashedMaterial = new THREE.LineDashedMaterial({
          color: pathColorHex,
          linewidth: 1,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.7,
        });
        const virtualSourcePos = new THREE.Vector3(
          matchingBeam.virtualSource[0],
          matchingBeam.virtualSource[1],
          matchingBeam.virtualSource[2],
        );
        const dashedLineGeom = new THREE.BufferGeometry().setFromPoints([
          virtualSourcePos, receiver.position.clone(),
        ]);
        const dashedLine = new THREE.Line(dashedLineGeom, dashedMaterial);
        dashedLine.computeLineDistances();
        selectedBeamsGroup.add(dashedLine);
      }
    }
  }

  console.log(`BeamTraceSolver: Highlighting path ${pathIndex} with order ${path.order}, arrival time ${path.arrivalTime.toFixed(4)}s`);
  renderer.needsToRender = true;
}

export function redrawVisualization(params: {
  mode: VisualizationMode;
  validPaths: BeamTracePath[];
  btSolver: Solver3D | null;
  virtualSourcesGroup: THREE.Group;
  drawBeamsFn: () => void;
  drawPathsFn: () => void;
}) {
  clearVisualization(params.virtualSourcesGroup);
  switch (params.mode) {
    case "rays":
      if (params.validPaths.length > 0) params.drawPathsFn();
      break;
    case "beams":
      if (params.btSolver) params.drawBeamsFn();
      break;
    case "both":
      if (params.validPaths.length > 0) params.drawPathsFn();
      if (params.btSolver) params.drawBeamsFn();
      break;
  }
  renderer.needsToRender = true;
}

export interface ClickHost {
  virtualSourceMap: Map<THREE.Mesh, BeamVisualizationData & { polygonPath: number[] }>;
  selectedVirtualSource: THREE.Mesh | null;
  clickHandler: ((event: MouseEvent) => void) | null;
  hoverHandler: ((event: MouseEvent) => void) | null;
  onSelectBeam: (beam: BeamVisualizationData & { polygonPath: number[] }) => void;
  onDeselect: () => void;
}

export function removeClickHandler(host: ClickHost) {
  const canvas = renderer.renderer.domElement;
  if (host.clickHandler) {
    canvas.removeEventListener("click", host.clickHandler);
    host.clickHandler = null;
  }
  if (host.hoverHandler) {
    canvas.removeEventListener("mousemove", host.hoverHandler);
    host.hoverHandler = null;
    canvas.style.cursor = "default";
  }
}

export function setupClickHandler(host: ClickHost) {
  removeClickHandler(host);
  const canvas = renderer.renderer.domElement;

  const getMouseNDC = (event: MouseEvent): THREE.Vector2 => {
    const rect = canvas.getBoundingClientRect();
    return new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
  };

  host.hoverHandler = (event: MouseEvent) => {
    if (host.virtualSourceMap.size === 0) {
      canvas.style.cursor = "default";
      return;
    }
    const mouse = getMouseNDC(event);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, renderer.camera);
    const intersects = raycaster.intersectObjects(Array.from(host.virtualSourceMap.keys()));
    canvas.style.cursor = intersects.length > 0 ? "pointer" : "default";
  };

  host.clickHandler = (event: MouseEvent) => {
    if (event.button !== 0) return;
    if (host.virtualSourceMap.size === 0) return;
    const mouse = getMouseNDC(event);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, renderer.camera);
    const intersects = raycaster.intersectObjects(Array.from(host.virtualSourceMap.keys()));
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const beam = host.virtualSourceMap.get(clickedMesh);
      if (beam) {
        if (host.selectedVirtualSource === clickedMesh) {
          host.selectedVirtualSource = null;
          host.onDeselect();
        } else {
          host.selectedVirtualSource = clickedMesh;
          host.onSelectBeam(beam);
        }
      }
    }
  };

  canvas.addEventListener("click", host.clickHandler);
  canvas.addEventListener("mousemove", host.hoverHandler);
}
