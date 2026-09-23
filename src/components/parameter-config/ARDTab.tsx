import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps, Theme } from '@mui/material/styles';

import { ARD } from '../../compute/ard';
import { emit, on } from '../../messenger';
import { useContainer, useSolver } from '../../store';
import { createPropertyInputs, useSolverProperty } from './SolverComponents';
import SourceReceiverMatrix from './SourceReceiverMatrix';
import PropertyRow from './property-row/PropertyRow';
import PropertyRowLabel from './property-row/PropertyRowLabel';
import { PropertyRowCheckbox } from './property-row/PropertyRowCheckbox';
import { PropertyRowNumberInput } from './property-row/PropertyRowNumberInput';
import { PropertyRowSelect } from './property-row/PropertyRowSelect';
import SolverControlBar from './SolverControlBar';
import SectionLabel from './property-row/SectionLabel';

export interface ARDTabProps {
  uuid: string;
}

const { PropertyNumberInput, PropertyCheckboxInput } =
  createPropertyInputs<ARD>('ARD_SET_PROPERTY');

const costRowSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: '2fr 3fr',
  fontSize: '0.75rem',
  px: 0.5,
  py: '1px',
  userSelect: 'none',
};

const costLabelSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  color: 'text.secondary',
};

const costValueSx = (warn: boolean): SxProps<Theme> => ({
  fontSize: '0.75rem',
  fontVariantNumeric: 'tabular-nums',
  color: warn ? 'warning.main' : 'text.primary',
});

/** Minutes past which the estimate is worth colouring. */
const SLOW_RUN_SECONDS = 60;

/**
 * Human-readable duration. Seconds below a minute, then minutes, then hours —
 * nobody needs "4821 s".
 */
function formatSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  if (seconds < 1) return '< 1 s';
  if (seconds < 90) return `${Math.round(seconds)} s`;
  if (seconds < 90 * 60) return `${Math.round(seconds / 60)} min`;
  return `${(seconds / 3600).toFixed(1)} h`;
}

/** Thousands separators, because these numbers reach eight digits. */
function formatCount(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

/**
 * The steps row, spelling out every multiplier rather than folding them in.
 *
 * "10,400" for two sources across four bands hides both the thing the user
 * controls (how many sources they asked for) and the thing they toggled
 * (per-band runs). "2,600 x 2 sources x 4 bands" says where the number came
 * from, which is the only way the line can be acted on.
 */
function formatSteps(cost: { stepsPerRun: number; sources: number; bands: number }): string {
  const parts = [formatCount(cost.stepsPerRun)];
  if (cost.sources > 1) parts.push(`${cost.sources} sources`);
  if (cost.bands > 1) parts.push(`${cost.bands} bands`);
  return parts.join(' x ');
}

function CostRow({ label, value, tooltip, warn = false }: {
  label: string;
  value: string;
  tooltip: string;
  warn?: boolean;
}) {
  return (
    <Box sx={costRowSx}>
      <Tooltip title={tooltip} placement="left">
        <Typography sx={costLabelSx}>{label}</Typography>
      </Tooltip>
      <Typography sx={costValueSx(warn)}>{value}</Typography>
    </Box>
  );
}

export const ARDTab = ({ uuid }: ARDTabProps) => {
  const containers = useContainer((state) => state.containers);
  const version = useContainer((state) => state.version);
  const solverVersion = useSolver((state) => state.version);
  const solver = useSolver((state) => state.solvers[uuid] as ARD | undefined);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  const rooms = useMemo(() => {
    return Object.values(containers)
      .filter((c) => c.kind === 'room')
      .map((c) => ({ value: c.uuid, label: c.name }));
  }, [containers, version]);

  const [roomID, setRoomID] = useSolverProperty<ARD, 'roomID'>(
    uuid, 'roomID', 'ARD_SET_PROPERTY',
  );
  const [dimensions, setDimensions] = useSolverProperty<ARD, 'dimensions'>(
    uuid, 'dimensions', 'ARD_SET_PROPERTY',
  );
  const [slice, setSlice] = useSolverProperty<ARD, 'slice'>(
    uuid, 'slice', 'ARD_SET_PROPERTY',
  );
  const [sliceCoordinate, setSliceCoordinate] = useSolverProperty<ARD, 'sliceCoordinate'>(
    uuid, 'sliceCoordinate', 'ARD_SET_PROPERTY',
  );
  const twoDimensional = dimensions === 2;
  const cutAtSource = sliceCoordinate === null || sliceCoordinate === undefined;

  const toggleCutAtSource = useCallback(
    (event: { value: boolean }) => {
      // `sliceCoordinate` is `number | null` and the number input cannot emit
      // null, so the checkbox owns that half of the state. Turning it off needs
      // a starting height: 1.2 m is the conventional plan cut for a floor plan,
      // and 0 is the centre for a section.
      setSliceCoordinate({ value: event.value ? null : (slice === 'xy' ? 0 : 1.2) });
    },
    [setSliceCoordinate, slice],
  );

  useEffect(() => {
    return on('ARD_PROGRESS', (payload) => {
      if (payload.uuid !== uuid) return;
      setProgress(payload.progress);
      setRunning(payload.progress > 0 && payload.progress < 1);
    });
  }, [uuid]);

  const handleRun = useCallback(() => {
    if (running) {
      // The control bar's button is a play/pause toggle; ARD cannot pause —
      // the state is a whole wave field across several partitions — so the
      // second press cancels. Stopping and restarting is the same cost as
      // never having paused.
      solver?.cancel();
      setRunning(false);
      return;
    }
    emit('CALCULATE_ARD', uuid);
  }, [running, solver, uuid]);

  // Recomputed on every store version bump, since the estimate depends on the
  // room's geometry as well as on this solver's own settings.
  const cost = useMemo(() => {
    if (!solver) return null;
    void version;
    void solverVersion;
    const grid = solver.estimatedGrid;
    return {
      grid,
      dimensions: solver.dimensions,
      slice: solver.slice,
      cells: solver.estimatedCellCount,
      simulated: solver.estimatedSimulatedCells,
      steps: solver.estimatedSteps,
      stepsPerRun: solver.estimatedStepsPerRun,
      sources: Math.max(1, solver.sourceIDs?.length ?? 0),
      seconds: solver.estimatedSeconds,
      bands: solver.bands.length,
      referenceFrequency: solver.referenceFrequency,
      dx: solver.cellSize,
    };
  }, [solver, version, solverVersion]);

  const hasPairs =
    (solver?.sourceIDs?.length ?? 0) > 0 && (solver?.receiverIDs?.length ?? 0) > 0;
  const canRun = Boolean(roomID) && hasPairs;

  return (
    <div>
      <SolverControlBar
        onPlayPause={handleRun}
        isRunning={running}
        canRun={canRun || running}
      />

      {/* Cost — first, not last. ARD is O(fMax^4) and a careless fMax turns a
          ten-second run into an hour, so the numbers belong where they are
          read before the button is pressed rather than after. */}
      <SectionLabel label="Estimated Cost" />
      {cost ? (
        <>
          <CostRow
            label="Grid"
            value={
              cost.dimensions === 2
                ? `${cost.slice} plane @ ${(cost.dx * 100).toFixed(1)} cm`
                : `${cost.grid.x} x ${cost.grid.y} x ${cost.grid.z} @ ${(cost.dx * 100).toFixed(1)} cm`
            }
            tooltip="Voxel grid the run would allocate, from the room's bounding box, and the cell size that follows from fMax and cells per wavelength. A 2D run still voxelizes the room in three dimensions — it takes one plane out of the result, so the air region matches what a 3D run would have used at that height."
          />
          <CostRow
            label="Cells stepped"
            value={formatCount(cost.simulated)}
            tooltip="Air cells plus absorbing wall slabs — what actually costs time each step. Smaller than the allocated grid, most of which is padding for the slabs to grow into."
          />
          <CostRow
            label="Steps"
            value={formatSteps(cost)}
            tooltip="Time steps per run, and how many runs there are. One full simulation per source — several sources at once would leave every receiver recording their sum — and, with per-band runs, one per octave band on top of that. Receivers are free: they are probes into a field being computed anyway."
          />
          <CostRow
            label="Estimated time"
            value={formatSeconds(cost.seconds)}
            tooltip="Rough, from measured throughput of about 1.35 million cell-steps per second. An order of magnitude, not a quote — and it does not include voxelization or the per-thickness wall calibration."
            warn={cost.seconds > SLOW_RUN_SECONDS}
          />
          {running && (
            <CostRow
              label="Progress"
              value={`${Math.round(progress * 100)}%`}
              tooltip="Steps completed across every source and band in this run."
            />
          )}
        </>
      ) : null}

      {/* Room */}
      <SectionLabel label="Room" />
      <PropertyRow>
        <PropertyRowLabel
          label="Room"
          hasToolTip
          tooltip="Room geometry to voxelize. The surfaces must enclose a volume — an open model leaks and the solver refuses to run."
        />
        <PropertyRowSelect
          value={roomID || ''}
          onChange={setRoomID}
          options={rooms.length > 0 ? rooms : [{ value: '', label: 'No rooms available' }]}
        />
      </PropertyRow>

      {/* Dimensions */}
      <PropertyRow>
        <PropertyRowLabel
          label="Dimensions"
          hasToolTip
          tooltip="3D solves the room. 2D solves a plane through it — which is a different room, one that is uniform and unbounded along the collapsed axis: sound spreads as 1/sqrt(r) and there are no modes across the missing axis. It is the only mode that reaches 4 kHz on anything but a cupboard, and it is for seeing wavefronts in plan, not for reading a reverberation time."
        />
        <PropertyRowSelect
          value={String(dimensions ?? 3)}
          onChange={(event) =>
            setDimensions({ value: Number((event as { value: string }).value) as 2 | 3 })
          }
          options={[
            { value: '3', label: '3D — the room' },
            { value: '2', label: '2D — a plane through it' },
          ]}
        />
      </PropertyRow>
      {twoDimensional && (
        <PropertyRow>
          <PropertyRowLabel
            label="Plane"
            hasToolTip
            tooltip="Which plane to cut. Floor plan collapses height; section collapses depth. The cut goes through the first source unless a height is set, since a source is inside the room by construction."
          />
          <PropertyRowSelect
            value={slice ?? 'xz'}
            onChange={setSlice}
            options={[
              { value: 'xz', label: 'Floor plan (XZ)' },
              { value: 'xy', label: 'Section (XY)' },
            ]}
          />
        </PropertyRow>
      )}

      {twoDimensional && (
        <>
          <PropertyRow>
            <PropertyRowLabel
              label="Cut at Source"
              hasToolTip
              tooltip="Cut through the first source, which is inside the room by construction because it seeds the flood fill. Turn it off to set a height — useful on a building with more than one storey, where the source's own plane may not be the one you want."
            />
            <PropertyRowCheckbox value={cutAtSource} onChange={toggleCutAtSource} />
          </PropertyRow>
          {!cutAtSource && (
            <PropertyRow>
              <PropertyRowLabel
                label={slice === 'xy' ? 'Cut at Z (m)' : 'Cut at Y (m)'}
                hasToolTip
                tooltip="Where to cut, in metres along the collapsed axis. A plane outside the room — or in the padding the wall slabs grow into — falls back to the widest plane, and the run says which one it used."
              />
              <PropertyRowNumberInput
                value={sliceCoordinate ?? 0}
                onChange={setSliceCoordinate}
                step={0.1}
              />
            </PropertyRow>
          )}
        </>
      )}

      {/* Source / Receiver Pairs */}
      <SectionLabel label="Source / Receiver Pairs" />
      <SourceReceiverMatrix uuid={uuid} eventType="ARD_SET_PROPERTY" />

      {/* Solver Settings */}
      <SectionLabel label="Solver Settings" />
      <PropertyNumberInput
        uuid={uuid}
        label="Max Frequency"
        property="fMax"
        tooltip="Upper frequency limit in Hz, and the cost dial: the grid is c/(n·fMax), so cells go as fMax³ and steps as fMax — the run is O(fMax⁴). Doubling 1 kHz to 2 kHz is roughly sixteen times the work. The result carries nothing above about 1.3·fMax whatever sample rate it is written at."
        elementProps={{ step: 100, min: 50, max: 8000 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Cells / Wavelength"
        property="cellsPerWavelength"
        tooltip="Spatial sampling density at fMax. ARD's headline property is that 2.6 is enough — its interior update is exact per mode, with no numerical dispersion to out-run. Raising it costs cells cubed and buys little."
        elementProps={{ step: 0.2, min: 2, max: 10 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Courant Number"
        property="courant"
        tooltip="Requested c·Δt/Δx. The DCT interior has no stability limit at all, but absorbing wall slabs do and every partition shares one time step, so on a 3D room this is capped near 0.446 however high you set it."
        elementProps={{ step: 0.05, min: 0.05, max: 1 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="IR Length"
        property="irLength"
        tooltip="Length of the impulse response in seconds. Steps scale linearly with it — make it long enough to hold the decay and no longer."
        elementProps={{ step: 0.1, min: 0.05, max: 10 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Wall Thickness"
        property="wallThickness"
        tooltip="Absorbing layer depth in cells. Thicker reaches a higher absorption coefficient and costs proportionally more cells: 4 cells reach α 0.81, 8 reach 0.958, 20 reach 0.999 at roughly five times the room's own cell count."
        elementProps={{ step: 2, min: 4, max: 20 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Sample Rate"
        property="sampleRate"
        tooltip="Output sample rate in Hz. The simulation itself runs far slower than this — about 6.5 kHz at the defaults — so the result is upsampled on its way out and is band-limited whatever rate you choose."
        elementProps={{ step: 100, min: 8000, max: 96000 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Humidity"
        property="humidity"
        tooltip="Relative humidity in percent, for air attenuation. Temperature comes from the room."
        elementProps={{ step: 5, min: 0, max: 100 }}
      />
      <PropertyCheckboxInput
        uuid={uuid}
        label="Per-Band Runs"
        property="perBandRuns"
        tooltip={
          'Run the simulation once per octave band with that band\'s absorption, then add the filtered results. ARD\'s boundary treatment is frequency-independent by construction, so this is the only way to honour a material\'s octave-band α — at one full run per band. Off, every surface uses its α at ' +
          `${cost?.referenceFrequency ?? 500} Hz.`
        }
      />
    </div>
  );
};

export default ARDTab;
