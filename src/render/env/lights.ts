import * as THREE from "three";
import Container from "../../objects/container";

export default class Lights extends Container {
  constructor(name?: string) {
    super(name || "lights");
    this.add(new Container("ambientLights"));
    this.add(new Container("geometryLights"));
    this.add(new Container("helpers"));
    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    ambientLight.layers.enableAll();
    this.ambientLights.add(ambientLight);
  }
  setHelpersVisible(visible) {
    this.helpers.visible = visible;
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
}
