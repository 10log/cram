/**
 * SketchPanel - draw a floorplan and extrude it into a room.
 *
 * Owns the drawing session: it mounts a FloorplanTool against the renderer's
 * camera and canvas, mirrors the tool's draft into React state, and turns a
 * closed outline into a Room via the geometry adapter.
 *
 * Once a room exists the panel keeps editing it: changing the height or nudging
 * a point calls `setFloorplan`, which reconciles the existing Surfaces rather
 * than rebuilding them, so acoustic material assignments survive. Those edits
 * go through history, so ctrl-Z works on them like anything else.
 *
 * Note on modes: there is an `EditorModes.SKETCH` enum, but nothing reacts to
 * it — the handlers are empty stubs and it lives on the legacy `cram.state`
 * global. Drawing is gated on this panel's own toggle instead.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import type { SxProps, Theme } from '@mui/material/styles';

import { renderer } from '../../../render/renderer';
import { messenger } from '../../../messenger';
import { FloorplanTool } from '../../../render/floorplan-tool';

// The shared properties-panel vocabulary, as used by RayTracerTab, RT60Tab,
// TransformTable and the rest of parameter-config. Reusing it keeps spacing,
// type scale and control styling identical across panels.
import PropertyRow from '../../parameter-config/property-row/PropertyRow';
import PropertyRowLabel from '../../parameter-config/property-row/PropertyRowLabel';
import PropertyRowButton from '../../parameter-config/property-row/PropertyRowButton';
import PropertyRowCheckbox from '../../parameter-config/property-row/PropertyRowCheckbox';
import PropertyRowNumberInput from '../../parameter-config/property-row/PropertyRowNumberInput';
import SectionLabel from '../../parameter-config/property-row/SectionLabel';

import {
  closeDraft,
  draftFromPoints,
  draftIssues,
  draftPerimeter,
  emptyDraft,
  toFloorplanParams,
  type SketchDraft,
} from '../../../compute/geometry/sketch-input';
import { floorplanSource } from '../../../compute/geometry/room-mesh';
import { floorplanToMesh } from '../../../compute/geometry/floorplan';
import { addRoomFromMesh, getRoomMesh } from '../../../objects/room-from-mesh';
import { setFloorplan } from '../../../objects/room-mesh-editor';
import { useMaterial } from '../../../store/material-store';
import { useContainer } from '../../../store';
import type Room from '../../../objects/room';

const DEFAULT_HEIGHT = 2.5;
const DEFAULT_GRID = 0.25;

const containerSx: SxProps<Theme> = {
  height: '100%',
  overflow: 'auto',
  bgcolor: 'background.paper',
  pb: 1,
};

/** Matches PropertyRowLabel's type scale, for read-only values in a row. */
const summaryTextSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  color: 'text.primary',
  pl: 1,
};

const hintTextSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  color: 'text.secondary',
  px: 1,
  py: 0.5,
};

/** Two number fields sharing one property row, as Position x/y/z does. */
const pointFieldsSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
};

const alertSx: SxProps<Theme> = {
  mx: 1,
  my: 0.5,
  fontSize: '0.75rem',
  py: 0,
  '& .MuiAlert-message': { py: 0.75 },
};

function defaultMaterial() {
  return [...useMaterial.getState().materials.values()][0];
}

export function SketchPanel() {
  const [ready, setReady] = useState(() => !!renderer.scene);
  const [draft, setDraft] = useState<SketchDraft>(emptyDraft);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID);
  const [ortho, setOrtho] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set when the adopted room's mesh has been edited directly, so its floorplan
  // no longer describes it.
  const [detached, setDetached] = useState(false);
  // Once the user explicitly starts a new room, stop re-adopting the old one.
  const [adoptionDismissed, setAdoptionDismissed] = useState(false);

  const toolRef = useRef<FloorplanTool | null>(null);
  // State, not a ref: the "start a new room" section and the Create button's
  // disabled state both depend on it, so it has to trigger a render.
  const [room, setRoom] = useState<Room | null>(null);

  // The renderer is initialised on APP_MOUNTED; its camera and canvas do not
  // exist before that, so the tool cannot be built yet.
  useEffect(() => {
    if (ready) return;
    const [msg, id] = messenger.addMessageHandler('APP_MOUNTED', () => setReady(true));
    if (renderer.scene) setReady(true);
    return () => messenger.removeMessageHandler(msg, id);
  }, [ready]);

  useEffect(() => {
    if (!ready || toolRef.current) return;

    const tool = new FloorplanTool({
      domElement: renderer.renderer.domElement,
      // Getter, not a snapshot: toggling ortho/perspective replaces
      // renderer.camera with a new instance.
      camera: () => renderer.camera,
      parent: renderer.workspace,
      settings: { gridSize, ortho },
      onChange: (next) => {
        setDraft(next);
        renderer.needsToRender = true;
      },
    });
    toolRef.current = tool;

    return () => {
      tool.dispose();
      toolRef.current = null;
    };
    // Settings are pushed separately; rebuilding the tool on every change would
    // discard the outline in progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    toolRef.current?.setSettings({ gridSize, ortho });
  }, [gridSize, ortho]);

  /** Push an edited draft back into the tool so the preview follows. */
  const applyDraft = useCallback((next: SketchDraft) => {
    const tool = toolRef.current;
    if (tool) tool.setDraft(next);
    else setDraft(next);
  }, []);

  // Rooms arrive asynchronously — a project load replaces the whole container
  // store — so this watches the store rather than running once on mount.
  //
  // Subscribes to `containers` rather than `version`: addContainer and
  // removeContainer replace the containers map without bumping version, so a
  // version subscription would never see a room arrive.
  const containers = useContainer((state) => state.containers);

  useEffect(() => {
    if (room || adoptionDismissed) return;

    const candidates = useContainer.getState().getRooms();
    for (const candidate of candidates) {
      const mesh = getRoomMesh(candidate);
      if (!mesh) continue;
      const source = floorplanSource(mesh);
      if (!source) continue;

      setRoom(candidate);
      setDetached(source.detached);
      // A detached mesh has been edited beyond its plan, so the stored points
      // no longer describe the room. Showing them would misrepresent it, and
      // re-extruding from them would silently discard those edits.
      if (!source.detached) {
        setHeight(source.params.height);
        applyDraft(draftFromPoints(source.params.points));
      }
      return;
    }
  }, [containers, room, adoptionDismissed, applyDraft]);

  const toggleDrawing = useCallback(() => {
    const tool = toolRef.current;
    if (!tool) return;
    if (tool.enabled) {
      tool.disable();
      setDrawing(false);
    } else {
      tool.enable();
      setDrawing(true);
    }
    renderer.needsToRender = true;
  }, []);

  const handleClear = useCallback(() => {
    toolRef.current?.reset();
    setError(null);
  }, []);

  const handleUndo = useCallback(() => toolRef.current?.undo(), []);

  const handleClose = useCallback(() => {
    const tool = toolRef.current;
    if (tool) tool.close();
    else setDraft((d) => closeDraft(d));
  }, []);

  /** Re-extrude the room already on screen, preserving its materials. */
  const reextrude = useCallback(
    (nextHeight: number, nextDraft: SketchDraft) => {
      const params = toFloorplanParams(nextDraft, nextHeight);
      // Refuse to re-extrude a mesh that has been edited past its plan: doing
      // so would throw those edits away without asking.
      if (!room || !params || detached) return;
      try {
        setFloorplan(room, params, { acousticMaterial: defaultMaterial() });
        setError(null);
        renderer.needsToRender = true;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [room, detached]
  );

  const handlePointChange = useCallback(
    (index: number, axis: 'x' | 'y', value: number) => {
      const next = {
        ...draft,
        points: draft.points.map((p, i) => (i === index ? { ...p, [axis]: value } : p)),
      };
      applyDraft(next);
      // Moving a point has to reach the room too, not just the preview.
      // reextrude is a no-op while the outline is open or no room exists.
      reextrude(height, next);
    },
    [draft, applyDraft, reextrude, height]
  );

  const handleHeightChange = useCallback(
    (value: number) => {
      setHeight(value);
      reextrude(value, draft);
    },
    [draft, reextrude]
  );

  const handleCreate = useCallback(() => {
    const params = toFloorplanParams(draft, height);
    if (!params) return;
    try {
      const created = addRoomFromMesh(floorplanToMesh(params), {
        acousticMaterial: defaultMaterial(),
        name: 'sketched room',
      });
      setRoom(created);
      setError(null);
      toolRef.current?.disable();
      setDrawing(false);
      renderer.needsToRender = true;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [draft, height]);

  const handleStartNew = useCallback(() => {
    setRoom(null);
    setDetached(false);
    setAdoptionDismissed(true);
    toolRef.current?.reset();
    setError(null);
  }, []);

  const issues = draftIssues(draft, height);
  const canCreate = draft.closed && issues.length === 0 && !room;
  const perimeter = draftPerimeter(draft);

  if (!ready) return null;

  return (
    <Box sx={containerSx}>
      <SectionLabel label="Floorplan" />

      <PropertyRow>
        <PropertyRowLabel
          label="Height"
          hasToolTip
          tooltip="Ceiling height of the extruded room, in metres."
        />
        <PropertyRowNumberInput
          name="height"
          value={height}
          step={0.1}
          min={0}
          disabled={detached}
          onChange={({ value }) => handleHeightChange(value)}
        />
      </PropertyRow>

      <PropertyRow>
        <PropertyRowLabel
          label="Grid"
          hasToolTip
          tooltip="Snap spacing for new points, in metres. Set to 0 to draw freely."
        />
        <PropertyRowNumberInput
          name="gridSize"
          value={gridSize}
          step={0.05}
          min={0}
          onChange={({ value }) => setGridSize(value)}
        />
      </PropertyRow>

      <PropertyRow>
        <PropertyRowLabel
          label="Ortho"
          hasToolTip
          tooltip="Constrain each wall to run horizontally or vertically from the previous point."
        />
        <PropertyRowCheckbox value={ortho} onChange={({ value }) => setOrtho(value)} />
      </PropertyRow>

      <SectionLabel label="Outline" />

      <PropertyRowButton
        label={drawing ? 'Stop drawing' : 'Draw'}
        onClick={toggleDrawing}
        data-testid="toggle-drawing"
      />
      <PropertyRowButton
        label="Undo last point"
        onClick={handleUndo}
        disabled={draft.points.length === 0 && !draft.closed}
      />
      <PropertyRowButton
        label="Clear outline"
        onClick={handleClear}
        disabled={draft.points.length === 0}
      />

      <PropertyRow>
        <PropertyRowLabel label="Points" />
        <Typography sx={summaryTextSx} data-testid="point-count">
          {draft.points.length}
          {draft.closed ? ' (closed)' : ''}
        </Typography>
      </PropertyRow>

      <PropertyRow>
        <PropertyRowLabel label="Perimeter" />
        <Typography sx={summaryTextSx} data-testid="perimeter">
          {perimeter.toFixed(2)} m
        </Typography>
      </PropertyRow>

      {draft.points.map((point, index) => (
        <PropertyRow key={index}>
          <PropertyRowLabel label={`Point ${index + 1}`} />
          <Box sx={pointFieldsSx}>
            <PropertyRowNumberInput
              name={`point-${index}-x`}
              value={point.x}
              step={0.1}
              disabled={detached}
              onChange={({ value }) => handlePointChange(index, 'x', value)}
            />
            <PropertyRowNumberInput
              name={`point-${index}-y`}
              value={point.y}
              step={0.1}
              disabled={detached}
              onChange={({ value }) => handlePointChange(index, 'y', value)}
            />
          </Box>
        </PropertyRow>
      ))}

      <PropertyRowButton
        label="Close outline"
        onClick={handleClose}
        disabled={draft.closed || draft.points.length < 3}
      />
      <PropertyRowButton label="Create room" onClick={handleCreate} disabled={!canCreate} />

      {issues.length > 0 && (
        <Alert severity="warning" sx={alertSx} data-testid="sketch-issues">
          {issues.map((issue) => issue.message).join('; ')}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={alertSx} data-testid="sketch-error">
          {error}
        </Alert>
      )}

      {detached && (
        <Alert severity="info" sx={alertSx} data-testid="sketch-detached">
          This room has been edited directly, so its floorplan no longer describes it. Start a
          new room to sketch again.
        </Alert>
      )}

      {room && (
        <>
          <SectionLabel label="Room" />
          <Typography sx={hintTextSx}>
            {detached
              ? 'Plan editing is unavailable for this room.'
              : 'Editing the height or a point updates the room in place.'}
          </Typography>
          <PropertyRowButton label="Start a new room" onClick={handleStartNew} />
        </>
      )}
    </Box>
  );
}

export default SketchPanel;
