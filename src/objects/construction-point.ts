
import * as THREE from 'three';
import Container from './container';
import { SPRITE_DISC2 } from './asset-store';


export interface ConstructionPointProps {
  /** point vector */
  point: THREE.Vector3;
}

class ConstructionPoint extends Container {
  point: THREE.Points;
  constructor(name: string, props: ConstructionPointProps) {
    super(name);

    this.kind = "construction-point";

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([props.point.x, props.point.y, props.point.z], 3));
    const material = new THREE.PointsMaterial({
      size: 12,
      sizeAttenuation: false,
      color: 0x80aff6,
      map: SPRITE_DISC2,
      fog: false,
      opacity: 0.8,
      alphaTest: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
      blending: 4,
      depthTest: false,
      name: "construction-point-material"
    });
    this.point = new THREE.Points(geometry, material);
    this.add(this.point);
  }
  select() {
    this.selected = true;
    (this.point.material as THREE.PointsMaterial).color.setHex(0x3070FF);
  }
  deselect() {
    this.selected = false;
    (this.point.material as THREE.PointsMaterial).color.setHex(0x80aff6);
  }
}

export { ConstructionPoint }
export default ConstructionPoint;