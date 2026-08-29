import { emit, on } from "../../messenger";
import { addSolver, removeSolver, setSolverProperty, useSolver, useContainer } from "../../store";
import type { BeamTraceSolver } from "./index";

type BeamTraceSolverCtor = new (...args: any[]) => BeamTraceSolver;

declare global {
  interface EventTypes {
    ADD_BEAMTRACE: BeamTraceSolver | undefined;
    REMOVE_BEAMTRACE: string;
    BEAMTRACE_SET_PROPERTY: SetPropertyPayload<BeamTraceSolver>;
    BEAMTRACE_CALCULATE: string;
    BEAMTRACE_CALCULATE_COMPLETE: string;
    BEAMTRACE_RESET: string;
    BEAMTRACE_PLAY_IR: string;
    BEAMTRACE_DOWNLOAD_IR: string;
    BEAMTRACE_DOWNLOAD_AMBISONIC_IR: { uuid: string; order: number };
    BEAMTRACE_PLAY_BINAURAL_IR: { uuid: string; order: number };
    BEAMTRACE_DOWNLOAD_BINAURAL_IR: { uuid: string; order: number };
    BEAMTRACE_DOWNLOAD_OCTAVE_IR: string;
    BEAMTRACE_QUICK_ESTIMATE: string;
    BEAMTRACE_QUICK_ESTIMATE_COMPLETE: string;
    SHOULD_ADD_BEAMTRACE: undefined;
  }
}

export function registerBeamTraceEvents(SolverClass: BeamTraceSolverCtor) {
  on("BEAMTRACE_SET_PROPERTY", setSolverProperty);
  on("REMOVE_BEAMTRACE", removeSolver);
  on("ADD_BEAMTRACE", addSolver(SolverClass));

  on("BEAMTRACE_CALCULATE", (uuid: string) => {
    const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
    solver.calculate();
    setTimeout(() => emit("BEAMTRACE_CALCULATE_COMPLETE", uuid), 0);
  });

  on("BEAMTRACE_RESET", (uuid: string) => {
    (useSolver.getState().solvers[uuid] as BeamTraceSolver).reset();
  });

  on("BEAMTRACE_PLAY_IR", (uuid: string) => {
    const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
    solver.playImpulseResponse().catch((err: Error) => {
      window.alert(err.message || "Failed to play impulse response");
    });
  });

  on("BEAMTRACE_DOWNLOAD_IR", (uuid: string) => {
    const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
    const containers = useContainer.getState().containers;
    const sourceName = solver.sourceIDs.length > 0 ? containers[solver.sourceIDs[0]]?.name || "source" : "source";
    const receiverName = solver.receiverIDs.length > 0 ? containers[solver.receiverIDs[0]]?.name || "receiver" : "receiver";
    const filename = `ir-beamtrace-${sourceName}-${receiverName}`.replace(/[^a-zA-Z0-9-_]/g, "_");
    solver.downloadImpulseResponse(filename).catch((err: Error) => {
      window.alert(err.message || "Failed to download impulse response");
    });
  });

  on("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", ({ uuid, order }: { uuid: string; order: number }) => {
    const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
    const containers = useContainer.getState().containers;
    const sourceName = solver.sourceIDs.length > 0 ? containers[solver.sourceIDs[0]]?.name || "source" : "source";
    const receiverName = solver.receiverIDs.length > 0 ? containers[solver.receiverIDs[0]]?.name || "receiver" : "receiver";
    const filename = `ir-beamtrace-ambi-${sourceName}-${receiverName}`.replace(/[^a-zA-Z0-9-_]/g, "_");
    solver.downloadAmbisonicImpulseResponse(filename, order).catch((err: Error) => {
      window.alert(err.message || "Failed to download ambisonic impulse response");
    });
  });

  on("BEAMTRACE_PLAY_BINAURAL_IR", ({ uuid, order }: { uuid: string; order: number }) => {
    const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
    solver.playBinauralImpulseResponse(order).catch((err: Error) => {
      window.alert(err.message || "Failed to play binaural impulse response");
    });
  });

  on("BEAMTRACE_DOWNLOAD_BINAURAL_IR", ({ uuid, order }: { uuid: string; order: number }) => {
    const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
    const containers = useContainer.getState().containers;
    const sourceName = solver.sourceIDs.length > 0 ? containers[solver.sourceIDs[0]]?.name || "source" : "source";
    const receiverName = solver.receiverIDs.length > 0 ? containers[solver.receiverIDs[0]]?.name || "receiver" : "receiver";
    const filename = `ir-beamtrace-${sourceName}-${receiverName}`.replace(/[^a-zA-Z0-9-_]/g, "_");
    solver.downloadBinauralImpulseResponse(filename, order).catch((err: Error) => {
      window.alert(err.message || "Failed to download binaural impulse response");
    });
  });

  on("BEAMTRACE_DOWNLOAD_OCTAVE_IR", (uuid: string) => {
    const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
    const containers = useContainer.getState().containers;
    const sourceName = solver.sourceIDs.length > 0 ? containers[solver.sourceIDs[0]]?.name || "source" : "source";
    const receiverName = solver.receiverIDs.length > 0 ? containers[solver.receiverIDs[0]]?.name || "receiver" : "receiver";
    const filename = `ir-beamtrace-${sourceName}-${receiverName}`.replace(/[^a-zA-Z0-9-_]/g, "_");
    try {
      solver.downloadOctaveBandIR(filename);
    } catch (err: any) {
      window.alert(err.message || "Failed to download octave-band impulse responses");
    }
  });

  on("BEAMTRACE_QUICK_ESTIMATE", (uuid: string) => {
    (useSolver.getState().solvers[uuid] as BeamTraceSolver).startQuickEstimate();
  });

  on("SHOULD_ADD_BEAMTRACE", () => {
    emit("ADD_BEAMTRACE", undefined);
  });
}
