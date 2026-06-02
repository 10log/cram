import * as THREE from 'three';
export interface SketchProps {
    normal: THREE.Vector3;
    point: THREE.Vector3;
}
declare class Sketch extends THREE.Group {
    sketchPlane: THREE.Plane;
    sketchPlaneMesh: THREE.Mesh;
    sketchPlaneMaterial: THREE.MeshLambertMaterial;
    sketchPlaneNormal: THREE.Vector3;
    sketchPlaneCentroid: THREE.Vector3;
    constructor(props: SketchProps);
}
export { Sketch };
export default Sketch;
