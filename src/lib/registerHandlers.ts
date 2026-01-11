/**
 * Register all message handlers for CRAM.
 *
 * This file consolidates the ~50 messenger handlers that were previously
 * scattered throughout index.tsx into a single initialization function.
 *
 * Called by CRAMEditor during component initialization.
 */

import { ToastProps } from "@blueprintjs/core";
import { v4 as uuid } from 'uuid';
import hotkeys from "hotkeys-js";
import * as THREE from "three";

import Messenger, { emit, messenger } from "../messenger";
import { history, Directions, addMoment } from "../history";
import Renderer from "../render/renderer";

// Objects
import Container from "../objects/container";
import Source from "../objects/source";
import Receiver from "../objects/receiver";
import Room from "../objects/room";
import Surface from "../objects/surface";
import Model from "../objects/model";
import AudioFile from "../objects/audio-file";
import Sketch from "../objects/sketch";

// Solvers
import RayTracer from "../compute/raytracer";
import { ImageSourceSolver, ImageSourceSolverParams } from "../compute/raytracer/image-source/index";
import RT60 from "../compute/rt";
import EnergyDecay from "../compute/energy-decay";

// Import handlers
import * as importHandlers from "../import-handlers";
import { fileType, allowed } from "../common/file-type";

// Constants
import { EditorModes } from "../constants/editor-modes";
import { Processes } from "../constants/processes";

// Database
import { AcousticMaterial } from "../db/acoustic-material";

// Store
import { useAppStore } from "../store";

// Types
import type { State, Cram } from "../index";
import type { KeyValuePair } from "../common/key-value-pair";

/**
 * Register all message handlers on the given messenger instance.
 *
 * @param cram - The Cram state object
 * @param messengerInstance - The Messenger instance to register handlers on (defaults to singleton)
 */
export function registerMessageHandlers(
  cram: Cram,
  messengerInstance: Messenger = messenger
): void {
  const msg = messengerInstance;

  msg.addMessageHandler("GET_SELECTED_OBJECTS", () => {
    return cram.state.selectedObjects;
  });

  msg.addMessageHandler("GET_SELECTED_OBJECT_TYPES", () => {
    return cram.state.selectedObjects.map((obj) => obj.kind);
  });

  msg.addMessageHandler("FETCH_ROOMS", () => {
    const roomkeys = Object.keys(cram.state.containers).filter((x) => {
      return cram.state.containers[x].kind === "room";
    });
    if (roomkeys && roomkeys.length > 0) {
      return roomkeys.map((x) => cram.state.containers[x] as Room);
    }
  });

  msg.addMessageHandler("FETCH_CONTAINER", (acc, ...args) => {
    return args && args[0] && cram.state.containers[args[0]];
  });

  msg.addMessageHandler("FETCH_ALL_MATERIALS", () => {
    return cram.state.materials;
  });

  msg.addMessageHandler("SEARCH_ALL_MATERIALS", (acc, ...args) => {
    const res = cram.state.materialSearcher.search(args[0]);
    return res;
  });

  msg.addMessageHandler("SHOULD_ADD_RAYTRACER", (acc, ...args) => {
    const props = (args && args[0]) || {};
    const raytracer = new RayTracer({
      ...props[0],
      renderer: cram.state.renderer,
      containers: cram.state.containers
    });
    cram.state.solvers[raytracer.uuid] = raytracer;
    emit("ADD_RAYTRACER", raytracer);
    return raytracer;
  });

  msg.addMessageHandler("SHOULD_ADD_IMAGE_SOURCE", (_acc, ..._args) => {
    const defaults: ImageSourceSolverParams = {
      name: "Image Source",
      roomID: "",
      sourceIDs: [] as string[],
      surfaceIDs: [] as string[],
      receiverIDs: [] as string[],
      maxReflectionOrder: 2,
      imageSourcesVisible: false,
      rayPathsVisible: true,
      plotOrders: [0, 1, 2],
      frequencies: [125, 250, 500, 1000, 2000, 4000, 8000],
    };
    const imagesource = new ImageSourceSolver(defaults);
    cram.state.solvers[imagesource.uuid] = imagesource;
    emit("ADD_IMAGESOURCE", imagesource);
    return imagesource;
  });

  msg.addMessageHandler("SHOULD_REMOVE_SOLVER", (acc, id) => {
    if (cram.state.solvers && cram.state.solvers[id]) {
      cram.state.solvers[id].dispose();
      delete cram.state.solvers[id];
      emit("REMOVE_RAYTRACER", id);
    }
  });

  msg.addMessageHandler("SHOULD_ADD_RT60", (_acc, ..._args) => {
    const rt60 = new RT60();
    cram.state.solvers[rt60.uuid] = rt60;
    emit("ADD_RT60", rt60);
    return rt60;
  });

  msg.addMessageHandler("SHOULD_ADD_ENERGYDECAY", (_acc, ..._args) => {
    const ed = new EnergyDecay();
    cram.state.solvers[ed.uuid] = ed;
    emit("ADD_ENERGYDECAY", ed);
    return ed;
  });

  msg.addMessageHandler("RAYTRACER_CALCULATE_RESPONSE", (acc, id, frequencies) => {
    cram.state.solvers[id] instanceof RayTracer &&
      (cram.state.solvers[id] as RayTracer).calculateReflectionLoss(frequencies);
  });

  msg.addMessageHandler("RAYTRACER_QUICK_ESTIMATE", (acc, id) => {
    cram.state.solvers[id] instanceof RayTracer && (cram.state.solvers[id] as RayTracer).startQuickEstimate();
  });

  msg.addMessageHandler("FETCH_ALL_SOURCES", (acc, ...args) => {
    return cram.state.sources.map((x) => {
      if (args && args[0] && args[0] instanceof Array) {
        return args[0].map((y) => cram.state.containers[x][y]);
      } else return cram.state.containers[x];
    });
  });

  msg.addMessageHandler("FETCH_ALL_SOURCES_AS_MAP", () => {
    const sourcemap = new Map<string, Source>();
    for (let i = 0; i < cram.state.sources.length; i++) {
      sourcemap.set(cram.state.sources[i], cram.state.containers[cram.state.sources[i]] as Source);
    }
    return sourcemap;
  });

  msg.addMessageHandler("FETCH_ALL_RECEIVERS", (acc, ...args) => {
    return cram.state.receivers.map((x) => {
      if (args && args[0] && args[0] instanceof Array) {
        return args[0].map((y) => cram.state.containers[x][y]);
      } else return cram.state.containers[x];
    });
  });

  msg.addMessageHandler("FETCH_SOURCE", (acc, ...args) => {
    return cram.state.containers[args[0]];
  });

  msg.addMessageHandler("SHOULD_ADD_SOURCE", (acc, ...args) => {
    const source = new Source("new source");
    let shouldAddMoment = true;
    if (args && args[0]) {
      if (!args[1]) {
        source.uuid = args[0].uuid;
      }
      source.position.set(args[0].position.x, args[0].position.y, args[0].position.z);
      source.scale.set(args[0].scale.x, args[0].scale.y, args[0].scale.z);
      if (!args[1]) {
        source.name = args[0].name;
      } else {
        source.name = args[0].name + "-copy";
      }
      source.visible = args[0].visible;
      shouldAddMoment = args[1] || false;
    }
    const staticSource = {
      uuid: source.uuid,
      position: source.position.clone(),
      scale: source.scale.clone(),
      name: source.name,
      color: source.color,
      visible: source.visible
    };
    cram.state.containers[source.uuid] = source;
    cram.state.sources.push(source.uuid);
    cram.state.renderer.add(source);
    emit("ADD_SOURCE", source);
    Object.keys(cram.state.solvers).forEach((x) => {
      cram.state.solvers[x] instanceof RayTracer && (cram.state.solvers[x] as RayTracer).addSource(source);
    });

    if (shouldAddMoment) {
      addMoment({
        category: "SHOULD_ADD_SOURCE",
        objectId: source.uuid,
        recallFunction: (direction: keyof Directions) => {
          if (direction === "UNDO") {
            msg.postMessage("SHOULD_REMOVE_CONTAINER", staticSource.uuid);
          } else if (direction === "REDO") {
            msg.postMessage("SHOULD_ADD_SOURCE", staticSource, false);
          }
        }
      });
    }

    return source;
  });

  msg.addMessageHandler("SHOULD_REMOVE_CONTAINER", (acc, id) => {
    if (cram.state.containers[id]) {
      switch (cram.state.containers[id].kind) {
        case "source":
          cram.state.sources = cram.state.sources.reduce((a, b) => {
            if (b !== id) {
              a.push(b);
            }
            return a;
          }, [] as string[]);
          break;
        case "receiver":
          cram.state.receivers = cram.state.receivers.reduce((a, b) => {
            if (b !== id) {
              a.push(b);
            }
            return a;
          }, [] as string[]);
          break;
      }
      cram.state.selectedObjects = cram.state.selectedObjects.filter((x) => x.uuid !== id);
      cram.state.renderer.remove(cram.state.containers[id]);
      delete cram.state.containers[id];
    }
  });

  msg.addMessageHandler("SHOULD_ADD_RECEIVER", (acc, ...args) => {
    const rec = new Receiver("new receiver");
    let shouldAddMoment = true;
    if (args && args[0]) {
      if (!args[1]) {
        rec.uuid = args[0].uuid;
      }
      rec.position.set(args[0].position.x, args[0].position.y, args[0].position.z);
      rec.scale.set(args[0].scale.x, args[0].scale.y, args[0].scale.z);
      if (!args[1]) {
        rec.name = args[0].name;
      } else {
        rec.name = args[0].name + "-copy";
      }
      rec.visible = args[0].visible;
      shouldAddMoment = args[1] || false;
    }
    const staticRec = {
      uuid: rec.uuid,
      position: rec.position.clone(),
      scale: rec.scale.clone(),
      name: rec.name,
      color: rec.color,
      visible: rec.visible
    };
    cram.state.containers[rec.uuid] = rec;
    cram.state.receivers.push(rec.uuid);
    cram.state.renderer.add(rec);
    emit("ADD_RECEIVER", rec);
    Object.keys(cram.state.solvers).forEach((x) => {
      cram.state.solvers[x] instanceof RayTracer && (cram.state.solvers[x] as RayTracer).addReceiver(rec);
    });

    if (shouldAddMoment) {
      addMoment({
        category: "SHOULD_ADD_RECEIVER",
        objectId: rec.uuid,
        recallFunction: (direction: keyof Directions) => {
          if (direction === "UNDO") {
            msg.postMessage("SHOULD_REMOVE_CONTAINER", staticRec.uuid);
          } else if (direction === "REDO") {
            msg.postMessage("SHOULD_ADD_RECEIVER", staticRec, false);
          }
        }
      });
    }

    return rec;
  });

  msg.addMessageHandler("SHOULD_DUPLICATE_SELECTED_OBJECTS", () => {
    const objs = [] as Container[];
    const selection = msg.postMessage("GET_SELECTED_OBJECTS")[0];
    if (selection && selection.length > 0) {
      for (let i = 0; i < selection.length; i++) {
        switch (selection[i].kind) {
          case "source":
            objs.push(msg.postMessage("SHOULD_ADD_SOURCE", selection[i], true)[0]);
            break;
          case "receiver":
            objs.push(msg.postMessage("SHOULD_ADD_RECEIVER", selection[i], true)[0]);
            break;
          default:
            break;
        }
      }
    }

    msg.postMessage("SET_SELECTION", objs);
  });

  msg.addMessageHandler("GET_CONTAINERS", () => {
    return cram.state.containers;
  });

  msg.addMessageHandler("ADDED_ROOM", (acc, ...args) => {
    args[0];
  });
  msg.addMessageHandler("ADDED_MODEL", (acc, ...args) => {
    args[0];
  });

  msg.addMessageHandler("ADDED_AUDIO_FILE", (acc, args) => {
    const audiofile = args[0] as AudioFile;
    cram.state.audiofiles[audiofile.uuid] = audiofile;
  });

  msg.addMessageHandler("IMPORT_FILE", (acc, ...args) => {
    const files = Array.from(args[0]);
    files.forEach(async (file: File) => {
      if (allowed[fileType(file.name)]) {
        const objectURL = URL.createObjectURL(file);
        switch (fileType(file.name)) {
          case "dxf":
            {
              const result = await (await fetch(objectURL)).text();
              const room = importHandlers.dxf(result);
              emit("ADD_ROOM", room);
              console.log(room);
            } break;
          case "obj":
            {
              const result = await (await fetch(objectURL)).text();
              const models = importHandlers.obj(result);
              console.log(models);
              const surfaces = models.map(
                (model) =>
                  new Surface(model.name, {
                    geometry: model.geometry,
                    acousticMaterial: cram.state.materials[0]
                  })
              );
              const room = new Room("new room", {
                surfaces,
                originalFileName: file.name,
                originalFileData: result
              });
              cram.state.containers[room.uuid] = room;
              cram.state.renderer.addRoom(room);
              emit("ADD_ROOM", room);
              msg.postMessage("ADDED_ROOM", room);
            }
            break;
          case "stl":
            {
              const binary = await (await fetch(objectURL)).arrayBuffer();
              const geom = importHandlers.stl2(binary);
              const model = new Model("new model", { bufferGeometry: geom });
              cram.state.containers[model.uuid] = model;
              cram.state.renderer.addModel(model);
              msg.postMessage("ADDED_MODEL", model);
            }
            break;
          case "dae":
            {
              const result = await (await fetch(objectURL)).text();
              const models = importHandlers.dae(result);
              console.log(models);
            }
            break;

          case "3ds":
            {
              console.log("load 3ds");
              const result = await (await fetch(objectURL)).arrayBuffer();
              const models = importHandlers.tds(result);
              console.log(models);
            }
            break;
          case "wav":
            try {
              const result = await (await fetch(objectURL)).arrayBuffer();
              const audioContext = new AudioContext();
              audioContext.decodeAudioData(result, (buffer: AudioBuffer) => {
                const channelData = [] as Float32Array[];
                for (let i = 0; i < buffer.numberOfChannels; i++) {
                  channelData.push(buffer.getChannelData(i));
                }
                const audioFile = new AudioFile({
                  name: file.name,
                  filename: file.name,
                  sampleRate: buffer.sampleRate,
                  length: buffer.length,
                  duration: buffer.duration,
                  numberOfChannels: buffer.numberOfChannels,
                  channelData
                });
                msg.postMessage("ADDED_AUDIO_FILE", audioFile);
              });
              console.log(result);
            } catch (e) {
              console.error(e);
            }
            break;
          default:
            break;
        }
      }
    });
  });

  msg.addMessageHandler("APP_MOUNTED", (acc, ...args) => {
    cram.state.renderer.init(args[0]);
  });

  msg.addMessageHandler("RENDERER_UPDATED", () => {
    cram.state.time += 0.01666666667;
    if (cram.state.selectedObjects.length > 0) {
      cram.state.selectedObjects.forEach((x) => {
        x.renderCallback(cram.state.time);
      });
    }
  });

  msg.addMessageHandler("RAYTRACER_SHOULD_PLAY", (acc, ...args) => {
    if (cram.state.solvers[args[0]] instanceof RayTracer) {
      (cram.state.solvers[args[0]] as RayTracer).isRunning = true;
    }
    return cram.state.solvers[args[0]] && cram.state.solvers[args[0]].running;
  });

  msg.addMessageHandler("RAYTRACER_SHOULD_PAUSE", (acc, ...args) => {
    if (cram.state.solvers[args[0]] instanceof RayTracer) {
      (cram.state.solvers[args[0]] as RayTracer).isRunning = false;
    }
    return cram.state.solvers[args[0]].running;
  });

  msg.addMessageHandler("RAYTRACER_SHOULD_CLEAR", (acc, ...args) => {
    if (cram.state.solvers[args[0]] instanceof RayTracer) {
      (cram.state.solvers[args[0]] as RayTracer).clearRays();
    }
  });

  msg.addMessageHandler("FETCH_SURFACES", (acc, ...args) => {
    let ids = args[0];
    if (typeof ids === "string") {
      ids = [ids];
    }
    if (ids) {
      const surfaces = ids
        .map((id) => {
          const rooms = msg.postMessage("FETCH_ROOMS")[0];
          if (rooms && rooms.length > 0) {
            for (let i = 0; i < rooms.length; i++) {
              const room = rooms[i] as Room;
              const surface = room.surfaces.getObjectByProperty("uuid", id);
              if (surface && surface instanceof Surface) {
                return surface;
              }
            }
          }
          return null;
        })
        .filter((x) => x);
      return surfaces;
    }
  });

  msg.addMessageHandler("ASSIGN_MATERIAL", (acc, material) => {
    let surfaceCount = 0;
    const previousAcousticMaterials = [] as Array<{ uuid: string; acousticMaterial: AcousticMaterial }>;
    for (let i = 0; i < cram.state.selectedObjects.length; i++) {
      if (cram.state.selectedObjects[i] instanceof Surface) {
        previousAcousticMaterials.push({
          uuid: cram.state.selectedObjects[i].uuid,
          acousticMaterial: (cram.state.selectedObjects[i] as Surface)._acousticMaterial
        });
        (cram.state.selectedObjects[i] as Surface)._acousticMaterial = material;
        surfaceCount++;
      }
    }
    addMoment({
      category: "ASSIGN_MATERIAL",
      objectId: uuid(),
      recallFunction: () => {
        const surfaces = msg.postMessage(
          "FETCH_SURFACES",
          previousAcousticMaterials.map((x) => x.uuid)
        )[0];
        for (let i = 0; i < previousAcousticMaterials.length; i++) {
          if (surfaces[i].uuid === previousAcousticMaterials[i].uuid) {
            (surfaces[i] as Surface)._acousticMaterial = previousAcousticMaterials[i].acousticMaterial;
          }
        }
      }
    });
    if (surfaceCount > 0) {
      msg.postMessage("SHOW_TOAST", {
        message: `Assigned material to ${surfaceCount} surface${surfaceCount > 1 ? "s" : ""}.`,
        intent: "success",
        timeout: 1750,
        icon: "tick"
      } as ToastProps);
    } else {
      msg.postMessage("SHOW_TOAST", {
        message: `No surfaces are selected.`,
        intent: "warning",
        timeout: 1750,
        icon: "issue"
      } as ToastProps);
    }
  });

  // for the settings drawer
  msg.addMessageHandler("SETTING_CHANGE", (acc, ...args) => {
    const { setting, value } = args[0];
    console.log(setting, value);
    cram.state.renderer.settingChanged(setting, value);
  });

  // new project
  msg.addMessageHandler("NEW", () => {
    Object.keys(cram.state.solvers).forEach((x) => {
      msg.postMessage("SHOULD_REMOVE_SOLVER", x);
    });
    Object.keys(cram.state.containers).forEach((x) => {
      msg.postMessage("SHOULD_REMOVE_CONTAINER", x);
    });
    msg.postMessage("DESELECT_ALL_OBJECTS");
  });

  msg.addMessageHandler("CAN_UNDO", () => {
    return history.canUndo;
  });

  msg.addMessageHandler("CAN_REDO", () => {
    return history.canRedo;
  });

  msg.addMessageHandler("UNDO", () => {
    history.undo();
    return [history.canUndo, history.canRedo];
  });

  msg.addMessageHandler("REDO", () => {
    history.redo();
    return [history.canUndo, history.canRedo];
  });

  msg.addMessageHandler("GET_RENDERER", () => {
    return cram.state.renderer;
  });

  msg.addMessageHandler("SET_EDITOR_MODE", (acc, ...args) => {
    if (EditorModes[args[0]]) {
      cram.state.editorMode = EditorModes[args[0]];
      for (const key in cram.state.containers) {
        cram.state.containers[key].onModeChange(cram.state.editorMode);
      }
      for (const key in cram.state.solvers) {
        cram.state.solvers[key].onModeChange(cram.state.editorMode);
      }
    }
    cram.state.renderer.needsToRender = true;
  });

  msg.addMessageHandler("GET_EDITOR_MODE", () => {
    return cram.state.editorMode;
  });

  msg.addMessageHandler("SET_PROCESS", (acc, ...args) => {
    if (Processes[args[0]]) {
      cram.state.currentProcess = Processes[args[0]];
      cram.state.renderer.currentProcess = cram.state.currentProcess;
      cram.state.renderer.needsToRender = true;
    }
  });

  msg.addMessageHandler("GET_PROCESS", () => {
    return cram.state.currentProcess;
  });

  msg.addMessageHandler("SHOULD_ADD_SKETCH", () => {
    const selectedObjects = msg.postMessage("GET_SELECTED_OBJECTS")[0];
    if (selectedObjects && selectedObjects[selectedObjects.length - 1]) {
      const surface = selectedObjects[selectedObjects.length - 1];
      if (surface instanceof Surface) {
        const sketch = new Sketch({
          normal: surface._triangles[0].getNormal(new THREE.Vector3()),
          point: surface.center
        });
        cram.state.sketches[sketch.uuid] = sketch;
        cram.state.renderer.sketches.add(cram.state.sketches[sketch.uuid]);
      }
    }
  });

  msg.addMessageHandler("SHOULD_REMOVE_SKETCH", (acc, id) => {
    if (cram.state.sketches[id]) {
      cram.state.renderer.sketches.remove(cram.state.sketches[id]);
      delete cram.state.sketches[id];
    }
  });

  msg.addMessageHandler("SAVE_CONTAINERS", () => {
    const keys = Object.keys(cram.state.containers);
    const saveObjects = keys.map((key) => cram.state.containers[key].save());
    return saveObjects;
  });

  msg.addMessageHandler("SAVE_SOLVERS", () => {
    const keys = Object.keys(cram.state.solvers);
    const saveObjects = keys.map((key) => cram.state.solvers[key].save());
    return saveObjects;
  });

  msg.addMessageHandler("RESTORE_CONTAINERS", (acc, ...args) => {
    const keys = Object.keys(cram.state.containers);
    keys.forEach((key) => {
      msg.postMessage("SHOULD_REMOVE_CONTAINER", key);
    });
    if (args && args[0] && args[0] instanceof Array) {
      args[0].forEach((saveObj) => {
        switch (saveObj["kind"]) {
          case "source":
            {
              const src = new Source("new source", { ...saveObj }).restore(saveObj);
              msg.postMessage("SHOULD_ADD_SOURCE", src, false);
            }
            break;
          case "receiver":
            {
              const rec = new Receiver("new receiver", { ...saveObj }).restore(saveObj);
              msg.postMessage("SHOULD_ADD_RECEIVER", rec, false);
            }
            break;
          case "room":
            {
              const room = new Room(saveObj.name || "room").restore(saveObj);
              cram.state.containers[room.uuid] = room;
              emit("ADD_ROOM", room);
              cram.state.renderer.addRoom(room);
            }
            break;
          default:
            break;
        }
      });
    }
  });

  msg.addMessageHandler("RESTORE_SOLVERS", (acc, ...args) => {
    const keys = Object.keys(cram.state.solvers);
    keys.forEach((key) => {
      msg.postMessage("SHOULD_REMOVE_SOLVER", key);
    });
    if (args && args[0] && args[0] instanceof Array) {
      args[0].forEach((saveObj) => {
        switch (saveObj["kind"]) {
          case "ray-tracer":
            {
              const props = args && args[0];
              msg.postMessage("SHOULD_ADD_RAYTRACER", props);
            }
            break;
          case "rt60":
            {
              const props = args && args[0];
              msg.postMessage("SHOULD_ADD_RT60", props);
            }
            break;
          default:
            break;
        }
      });
    }
  });

  msg.addMessageHandler("OPEN", () => {
    const tempinput = document.createElement("input");
    tempinput.type = "file";
    tempinput.accept = "application/json";
    tempinput.setAttribute("style", "display: none");
    document.body.appendChild(tempinput);
    tempinput.addEventListener("change", async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) {
        tempinput.remove();
        return;
      }
      const file = files[0];
      const objectURL = URL.createObjectURL(file);
      try {
        const result = await (await fetch(objectURL)).text();
        const json = JSON.parse(result);
        msg.postMessage("RESTORE", { file, json });

        tempinput.remove();
      } catch (e) {
        console.warn(e);
      }
    });
    tempinput.click();
  });

  msg.addMessageHandler("RESTORE", (acc, ...args) => {
    const props = args && args[0];
    const file = props.file;
    const json = props.json;
    const version = (json.meta && json.meta.version) || "0.0.0";
    console.log(version);
    const { gte } = require("semver");
    if (gte(version, "0.2.1")) {
      console.log(json);
      msg.postMessage("RESTORE_CONTAINERS", json.containers);
      msg.postMessage("RESTORE_SOLVERS", json.solvers);
      msg.postMessage("SET_PROJECT_NAME", json.meta.name);
    } else {
      msg.postMessage("RESTORE_CONTAINERS", json);
      msg.postMessage("SET_PROJECT_NAME", file.name.replace(".json", ""));
    }
  });

  console.log('[registerMessageHandlers] Registered all message handlers');
}
