import Solver, { SolverParams } from "../solver";
import { emit, on } from "../../messenger";
import { Vector3 } from "three";
import {
  addSolver,
  removeSolver,
  setSolverProperty,
  useContainer
} from "../../store";
import { v4 as uuid } from 'uuid';
import { ResultKind, Result } from "../../store/result-store";
import { whole_octave } from "../acoustics";
import { soundSpeed } from "../acoustics/sound-speed";
import { airAttenuation } from "../acoustics/air-attenuation";
import Room from "../../objects/room";
import Source from "../../objects/source";
import Receiver from "../../objects/receiver";
import { BRDF } from "./brdf";
import { DirectionalResponse } from "./directional-response";
import { Response } from "./response";
import { buildPatchesFromRoom, PatchSet } from "./patch";
import {
  ShootingContext,
  selectShootingPatch,
  totalUnshotEnergy,
  shootFromPatch,
  injectSourceEnergy,
  gatherAtReceiver,
} from "./form-factor";

export interface ARTProps extends SolverParams {
  roomID?: string;
  sourceIDs?: string[];
  receiverIDs?: string[];
  maxEdgeLength?: number;
  brdfDetail?: number;
  raysPerShoot?: number;
  maxIterations?: number;
  convergenceThreshold?: number;
  temperature?: number;
  sampleRate?: number;
}

export type ARTSaveObject = {
  uuid: string;
  name: string;
  kind: string;
  autoCalculate: boolean;
  roomID?: string;
  sourceIDs?: string[];
  receiverIDs?: string[];
  maxEdgeLength?: number;
  brdfDetail?: number;
  raysPerShoot?: number;
  maxIterations?: number;
  convergenceThreshold?: number;
  temperature?: number;
  sampleRate?: number;
};

const defaults = {
  name: "Acoustic Radiance Transfer"
};

export class ART extends Solver {
  public uuid: string;
  public roomID: string;
  public sourceIDs: string[];
  public receiverIDs: string[];

  /** Tessellation patch size in meters */
  public maxEdgeLength: number;
  /** Icosahedron subdivision level (0=6 bins, 1=~18 bins, 2=~66 bins) */
  public brdfDetail: number;
  /** Rays per shooting iteration */
  public raysPerShoot: number;
  /** Maximum shooting iterations */
  public maxIterations: number;
  /** Stop when unshot/initial < threshold */
  public convergenceThreshold: number;
  /** Temperature in Celsius for speed of sound and air absorption */
  public temperature: number;
  /** Internal temporal sample rate in Hz */
  public sampleRate: number;
  /** Octave band center frequencies to compute */
  public frequencies: number[];
  /** Initial source energy */
  public initialEnergy: number;
  /** Number of rays for source injection */
  public sourceRays: number;

  /** Iteration count from last calculation */
  public lastIterationCount: number;
  /** Patch count from last calculation */
  public lastPatchCount: number;

  constructor(props: ARTProps = defaults) {
    super(props);
    this.kind = "art";
    this.name = props.name || defaults.name;
    this.uuid = uuid();

    const rooms = useContainer.getState().getRooms();
    this.roomID = props.roomID || (rooms.length > 0 ? rooms[0].uuid : '');

    this.sourceIDs = props.sourceIDs || [];
    this.receiverIDs = props.receiverIDs || [];

    this.maxEdgeLength = props.maxEdgeLength ?? 0.5;
    this.brdfDetail = props.brdfDetail ?? 1;
    this.raysPerShoot = props.raysPerShoot ?? 200;
    this.maxIterations = props.maxIterations ?? 100;
    this.convergenceThreshold = props.convergenceThreshold ?? 0.01;
    this.temperature = props.temperature ?? 20;
    this.sampleRate = props.sampleRate ?? 1000;

    this.frequencies = whole_octave.slice(4, 11); // 125 Hz to 8000 Hz
    this.initialEnergy = 500;
    this.sourceRays = 500;

    this.lastIterationCount = 0;
    this.lastPatchCount = 0;
  }

  calculate(): void {
    const containers = useContainer.getState().containers;
    const room = containers[this.roomID] as Room;
    if (!room) {
      console.error("ART: No room found");
      return;
    }

    // Find sources and receivers
    const sources: Source[] = [];
    const receivers: Receiver[] = [];
    for (const id of this.sourceIDs) {
      const s = containers[id];
      if (s && s.kind === "source") sources.push(s as Source);
    }
    for (const id of this.receiverIDs) {
      const r = containers[id];
      if (r && r.kind === "receiver") receivers.push(r as Receiver);
    }

    if (sources.length === 0 || receivers.length === 0) {
      console.warn("ART: Need at least one source and one receiver");
      return;
    }

    // Step 1: Tessellate and build patches
    const c = soundSpeed(this.temperature);
    const patchSet = buildPatchesFromRoom(room, this.maxEdgeLength);
    const nPatches = patchSet.patches.length;
    this.lastPatchCount = nPatches;

    if (nPatches === 0) {
      console.error("ART: Tessellation produced no patches");
      return;
    }

    // Step 2: Create BRDF
    const brdf = new BRDF(this.brdfDetail);
    const responseLength = Math.ceil(this.sampleRate * 5); // 5 second initial response

    // Step 3: Run per frequency band
    for (const source of sources) {
      const sourcePos = new Vector3();
      source.getWorldPosition(sourcePos);

      for (const receiver of receivers) {
        const receiverPos = new Vector3();
        receiver.getWorldPosition(receiverPos);

        // Accumulate broadband response from all frequency bands
        const bandResponses: Response[] = [];

        for (const freq of this.frequencies) {
          // Per-band material properties
          const absorptions: number[] = [];
          const scatterings: number[] = [];
          for (const patch of patchSet.patches) {
            absorptions.push(patch.absorption(freq));
            scatterings.push(patch.scattering(freq));
          }

          // Air absorption: convert from dB/m to Nepers/m
          const airAbsDb = airAttenuation([freq], this.temperature)[0];
          const airAbsNepers = airAbsDb / (20 / Math.LN10);

          // Initialize energy buffers
          const unshotEnergy: DirectionalResponse[] = [];
          const totalEnergy: DirectionalResponse[] = [];
          for (let i = 0; i < nPatches; i++) {
            unshotEnergy[i] = new DirectionalResponse(brdf.nSlots, responseLength);
            totalEnergy[i] = new DirectionalResponse(brdf.nSlots, responseLength);
          }

          // Build shooting context
          const ctx: ShootingContext = {
            patchSet,
            unshotEnergy,
            totalEnergy,
            brdf,
            absorptions,
            scatterings,
            airAbsNepers,
            speedOfSound: c,
            sampleRate: this.sampleRate,
            raysPerShoot: this.raysPerShoot,
          };

          // Step 4: Inject source emission
          injectSourceEnergy(sourcePos, this.initialEnergy, ctx, this.sourceRays);

          // Step 5: Progressive shooting loop
          const initialTotal = totalUnshotEnergy(unshotEnergy);
          let iteration = 0;

          while (iteration < this.maxIterations) {
            const currentUnshot = totalUnshotEnergy(unshotEnergy);
            if (initialTotal > 0 && currentUnshot / initialTotal < this.convergenceThreshold) {
              break;
            }

            const shootIdx = selectShootingPatch(unshotEnergy);
            if (unshotEnergy[shootIdx].sum() < 1e-20) break;

            shootFromPatch(ctx, shootIdx);
            iteration++;
          }

          this.lastIterationCount = iteration;

          // Step 6: Gather at receiver
          const bandResponse = gatherAtReceiver(receiverPos, ctx);
          bandResponses.push(bandResponse);
        }

        // Step 7: Combine frequency bands by summing
        let maxLen = 0;
        for (const br of bandResponses) {
          if (br.buffer.length > maxLen) maxLen = br.buffer.length;
        }

        const combined = new Float32Array(maxLen);
        for (const br of bandResponses) {
          for (let i = 0; i < br.buffer.length; i++) {
            combined[i] += br.buffer[i];
          }
        }

        // Normalize to max amplitude
        let maxVal = 0;
        for (let i = 0; i < combined.length; i++) {
          if (Math.abs(combined[i]) > maxVal) maxVal = Math.abs(combined[i]);
        }
        if (maxVal > 0) {
          for (let i = 0; i < combined.length; i++) {
            combined[i] /= maxVal;
          }
        }

        // Step 8: Emit result
        const displayData: { time: number; amplitude: number }[] = [];
        const step = Math.max(1, Math.floor(combined.length / 2000));
        for (let i = 0; i < combined.length; i += step) {
          displayData.push({
            time: i / this.sampleRate,
            amplitude: combined[i],
          });
        }

        // Trim trailing silence
        let lastNonZero = displayData.length - 1;
        while (lastNonZero > 0 && Math.abs(displayData[lastNonZero].amplitude) < 1e-10) {
          lastNonZero--;
        }
        const trimmedData = displayData.slice(0, lastNonZero + 1);

        const sourceName = source.name || 'source';
        const receiverName = receiver.name || 'receiver';
        const resultUuid = `${this.uuid}-art-ir-${source.uuid}-${receiver.uuid}`;

        const result: Result<ResultKind.ImpulseResponse> = {
          kind: ResultKind.ImpulseResponse,
          name: `ART IR: ${sourceName} → ${receiverName}`,
          uuid: resultUuid,
          from: this.uuid,
          info: {
            sampleRate: this.sampleRate,
            sourceName,
            receiverName,
            sourceId: source.uuid,
            receiverId: receiver.uuid,
          },
          data: trimmedData.length > 0 ? trimmedData : [{ time: 0, amplitude: 0 }],
        };

        emit("ADD_RESULT", result);
      }
    }
  }

  save() {
    const { name, kind, uuid, autoCalculate, roomID, sourceIDs, receiverIDs,
            maxEdgeLength, brdfDetail, raysPerShoot, maxIterations,
            convergenceThreshold, temperature, sampleRate } = this;
    return {
      name, kind, uuid, autoCalculate, roomID, sourceIDs, receiverIDs,
      maxEdgeLength, brdfDetail, raysPerShoot, maxIterations,
      convergenceThreshold, temperature, sampleRate,
    } as ARTSaveObject;
  }

  restore(state: ARTSaveObject) {
    super.restore(state);
    this.kind = state.kind;
    if (state.roomID !== undefined) this.roomID = state.roomID;
    if (state.sourceIDs !== undefined) this.sourceIDs = state.sourceIDs;
    if (state.receiverIDs !== undefined) this.receiverIDs = state.receiverIDs;
    if (state.maxEdgeLength !== undefined) this.maxEdgeLength = state.maxEdgeLength;
    if (state.brdfDetail !== undefined) this.brdfDetail = state.brdfDetail;
    if (state.raysPerShoot !== undefined) this.raysPerShoot = state.raysPerShoot;
    if (state.maxIterations !== undefined) this.maxIterations = state.maxIterations;
    if (state.convergenceThreshold !== undefined) this.convergenceThreshold = state.convergenceThreshold;
    if (state.temperature !== undefined) this.temperature = state.temperature;
    if (state.sampleRate !== undefined) this.sampleRate = state.sampleRate;
    return this;
  }

  get rooms() {
    return useContainer.getState().getRooms();
  }

  get room(): Room {
    return useContainer.getState().containers[this.roomID] as Room;
  }

  get noResults(): boolean {
    return this.lastIterationCount === 0;
  }
}

export default ART;

// this allows for nice type checking with 'on' and 'emit' from messenger
declare global {
  interface EventTypes {
    ADD_ART: ART | undefined;
    REMOVE_ART: string;
    ART_SET_PROPERTY: {
      uuid: string;
      property: keyof ART;
      value: ART[EventTypes["ART_SET_PROPERTY"]["property"]];
    };
    CALCULATE_ART: string;
  }
}

// add event listener
on("ADD_ART", addSolver(ART));
on("REMOVE_ART", removeSolver);
on("ART_SET_PROPERTY", setSolverProperty);
on("CALCULATE_ART", (uuid: string) => {
  const solver = useSolver.getState().solvers[uuid] as ART;
  if (solver) solver.calculate();
});

// need this import at the end to avoid circular dependency issues
import { useSolver } from "../../store";
