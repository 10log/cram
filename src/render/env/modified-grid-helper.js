/**
 * @author mrdoob / http://mrdoob.com/
 */

import {
  LineSegments,
  LineBasicMaterial,
  Float32BufferAttribute,
  BufferGeometry,
  Color
} from "three";

class ModifiedGridHelper extends LineSegments {
  constructor(size = 10, divisions = 10, color1 = 0x444444, color2 = 0x888888, skipFunction) {
    const c1 = new Color(color1);
    const c2 = new Color(color2);

    const center = divisions / 2;
    const step = size / divisions;
    const halfSize = size / 2;

    const vertices = [];
    const colors = [];

    for (let i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {
      if (skipFunction(i)) {
        vertices.push(-halfSize, k, 0, halfSize, k, 0);
        vertices.push(k, -halfSize, 0, k, halfSize, 0);

        const color = i === center ? c1 : c2;

        color.toArray(colors, j);
        j += 3;
        color.toArray(colors, j);
        j += 3;
        color.toArray(colors, j);
        j += 3;
        color.toArray(colors, j);
        j += 3;
      }
    }

    const geometry = new BufferGeometry();
    geometry.name = "grid-helper-geometry";
    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

    const material = new LineBasicMaterial({
      vertexColors: true,
      name: "grid-helper-material"
    });

    super(geometry, material);
  }

  copy(source) {
    super.copy(source);
    this.geometry.copy(source.geometry);
    this.material.copy(source.material);
    return this;
  }

  clone() {
    return new this.constructor().copy(this);
  }
}

export { ModifiedGridHelper };
