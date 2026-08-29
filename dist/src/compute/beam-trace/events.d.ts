import { BeamTraceSolver } from './index';
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
        BEAMTRACE_DOWNLOAD_AMBISONIC_IR: {
            uuid: string;
            order: number;
        };
        BEAMTRACE_PLAY_BINAURAL_IR: {
            uuid: string;
            order: number;
        };
        BEAMTRACE_DOWNLOAD_BINAURAL_IR: {
            uuid: string;
            order: number;
        };
        BEAMTRACE_DOWNLOAD_OCTAVE_IR: string;
        BEAMTRACE_QUICK_ESTIMATE: string;
        BEAMTRACE_QUICK_ESTIMATE_COMPLETE: string;
        SHOULD_ADD_BEAMTRACE: undefined;
    }
}
export declare function registerBeamTraceEvents(SolverClass: BeamTraceSolverCtor): void;
export {};
