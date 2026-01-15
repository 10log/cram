import * as THREE from "three";
import Container from "../objects/container";
type point = {
  x: number;
  y: number;
};
const dist = (p1: point, p2: THREE.Vector3) => Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2);
const THRESHOLD = 1e-8;
export default class PickHelper {
  pickPosition: THREE.Vector2;
  raycaster: THREE.Raycaster;
  pickedObject: any;
  pickedPoint: THREE.Vector3;
  pickedObjectSavedColor: number;
  hover: null;
  scene: any;
  camera: any;
  objects: Container[];
  mount: any;
  __pickedObject: any;
  __pickedPoint: any;
  constructor(scene: THREE.Scene, camera: THREE.Camera, mount: HTMLElement) {
    this.pickPosition = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedPoint = new THREE.Vector3(0, 0, 0);
    this.pickedObjectSavedColor = 0;
    this.hover = null;
    this.scene = scene;
    this.camera = camera;
    this.objects = [] as Container[];
    this.mount = mount;
  }

  // This really needs to be refactored... what a mess
  pick(event: MouseEvent, objects = this.objects, _scene = this.scene, _camera = this.camera, mount = this.mount) {
    this.setPickPosition(event, mount);
    this.raycaster.setFromCamera(this.pickPosition, this.camera);

    const intersectedObjects = this.raycaster.intersectObjects(objects, true);

    if (intersectedObjects.length) {
      let clickedOnSourceReceiver = false;
      let sourceReceiverIndex = 0;
      let clickedOnTransformControl = false;
      let transformControlIndex = 0;

      // console.log(intersectedObjects);

      const indicesWithinThreshold = [] as number[];
      for (let i = 0; i < intersectedObjects.length; i++) {
        const d = dist(this.pickPosition, intersectedObjects[i].point.clone().project(this.camera));
        if (d < THRESHOLD) {
          indicesWithinThreshold.push(i);
        }

        const obj = intersectedObjects[i].object as THREE.Object3D & Record<string, unknown>;
        const parent = obj.parent as (THREE.Object3D & Record<string, unknown>) | null;
        const grandparent = parent?.parent as (THREE.Object3D & Record<string, unknown>) | null;
        if (
          obj["isTransformControlsRoot"] ||
          obj["isTransformControlsGizmo"] ||
          obj["isTransformControlsPlane"] ||
          parent?.["isTransformControlsRoot"] ||
          parent?.["isTransformControlsGizmo"] ||
          (obj &&
            parent &&
            grandparent &&
            (grandparent["type"] === "TransformControlsGizmo" ||
              grandparent["isTransformControlsRoot"]))
        ) {
          clickedOnTransformControl = true;
          transformControlIndex = i;
        } else if (
          obj &&
          parent &&
          parent["kind"] &&
          (parent["kind"] as string).match(/source|receiver/gi)
        ) {
          clickedOnSourceReceiver = true;
          sourceReceiverIndex = i;
        }
      }

      if (clickedOnTransformControl) {
        return {
          clickedOnTransformControl,
          clickedOnSourceReceiver,
          pickedObject: intersectedObjects[transformControlIndex].object
        };
      } else if (clickedOnSourceReceiver) {
        this.pickedObject = intersectedObjects[sourceReceiverIndex].object.parent;
        this.pickedPoint = intersectedObjects[sourceReceiverIndex].point;

        return {
          clickedOnTransformControl,
          clickedOnSourceReceiver,
          pickedObject: this.pickedObject
        };
      } else if (indicesWithinThreshold[0]) {
        this.pickedObject = intersectedObjects[indicesWithinThreshold[0]].object.parent;
        this.pickedPoint = intersectedObjects[indicesWithinThreshold[0]].point;
        return {
          clickedOnSourceReceiver,
          clickedOnTransformControl,
          pickedObject: this.pickedObject
        };
      } else {
        this.pickedObject = intersectedObjects[0].object.parent;
        this.pickedPoint = intersectedObjects[0].point;
        return {
          clickedOnSourceReceiver,
          clickedOnTransformControl,
          pickedObject: this.pickedObject
        };
      }
    } else {
      this.pickedObject = false;
    }
    return {
      clickedOnSourceReceiver: false,
      clickedOnTransformControl: false,
      pickedObject: false
    };
  }

  getPickedPoint() {
    return [this.pickedPoint.x, this.pickedPoint.y, this.pickedPoint.z];
  }

  pickOnce(event: MouseEvent, scene: THREE.Scene, camera: THREE.Camera, mount: HTMLElement) {
    this.setPickPosition(event, mount);
    let normalizedPosition = this.pickPosition;

    this.raycaster.setFromCamera(normalizedPosition, camera);

    const intersectedObjects = this.raycaster.intersectObjects(scene.children, true);
    if (intersectedObjects.length) {
      if (intersectedObjects[0].object === this.pickedObject) {
        return false;
      }
      this.pickedObject = intersectedObjects[0].object;
    } else {
      this.pickedObject = false;
    }
    return this.pickedObject;
  }

  pickCenter(scene: THREE.Scene, camera: THREE.Camera, mount: HTMLElement) {
    this.setPickPositionCenter(mount);
    let normalizedPosition = this.pickPosition;

    this.raycaster.setFromCamera(normalizedPosition, camera);

    const intersectedObjects = this.raycaster.intersectObjects(scene.children, true);
    if (intersectedObjects.length) {
      this.pickedObject = intersectedObjects[0].object;
    } else {
      this.pickedObject = false;
    }
    return this.pickedObject;
  }

  setPickPosition(event: MouseEvent, mount: HTMLElement) {
    const pos = this.getCanvasRelativePosition(event, mount);
    // console.log(pos);
    // console.log(mount.clientWidth, mount.clientHeight);
    this.pickPosition.x = (pos.x / mount.clientWidth) * 2 - 1;
    this.pickPosition.y = (pos.y / mount.clientHeight) * -2 + 1;
  }

  setPickPositionCenter(mount: HTMLElement) {
    const pos = { x: mount.clientWidth / 2, y: mount.clientHeight / 2 };
    this.pickPosition.x = (pos.x / mount.clientWidth) * 2 - 1;
    this.pickPosition.y = (pos.y / mount.clientHeight) * -2 + 1;
  }

  getCanvasRelativePosition(event: MouseEvent, mount: HTMLElement) {
    const rect = mount.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  clearPickPosition() {
    this.pickPosition.x = -100000;
    this.pickPosition.y = -100000;
  }

  updateCamera(camera: THREE.Camera) {
    this.camera = camera;
  }
}
