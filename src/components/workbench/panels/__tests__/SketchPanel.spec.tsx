/**
 * SketchPanel tests.
 *
 * The renderer and the object layer are mocked, but the FloorplanTool is real
 * and runs against a real three.js camera and a real DOM element — so clicking
 * on the "canvas" genuinely drives the draft the way it will in the app.
 *
 * Camera setup matches floorplan-tool.spec.ts: a 10x10 orthographic frustum
 * over a 100x100 element, looking down -Z.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import * as THREE from 'three';

import { SketchPanel } from '../SketchPanel';
import { addRoomFromMesh } from '../../../../objects/room-from-mesh';
import { setFloorplan } from '../../../../objects/room-mesh-editor';
import { useContainer } from '../../../../store';
import { floorplanToMesh } from '../../../../compute/geometry/floorplan';
import { applyEdit } from '../../../../compute/geometry/room-mesh';
import { ROOM_MESH_KEY } from '../../../../objects/mesh-userdata';

const SIZE = 100;

const { fakeRenderer } = vi.hoisted(() => {
  return { fakeRenderer: { current: null as unknown } };
});

vi.mock('../../../../render/renderer', () => ({
  get renderer() {
    return fakeRenderer.current;
  },
}));

vi.mock('../../../../messenger', () => ({
  messenger: {
    addMessageHandler: vi.fn(() => ['APP_MOUNTED', 0]),
    removeMessageHandler: vi.fn(),
  },
  emit: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
}));

vi.mock('../../../../objects/room-from-mesh', async () => {
  // Only the Room-constructing half is stubbed; the userData accessor is real,
  // so adoption is exercised against the actual storage the app uses.
  const { getRoomMesh } = await import('../../../../objects/mesh-userdata');
  return {
    addRoomFromMesh: vi.fn(() => ({ uuid: 'room-1', name: 'sketched room' })),
    getRoomMesh,
  };
});

vi.mock('../../../../objects/room-mesh-editor', () => ({
  setFloorplan: vi.fn(),
}));

vi.mock('../../../../store/material-store', () => ({
  useMaterial: {
    getState: () => ({ materials: new Map([['m1', { uuid: 'm1', name: 'Default' }]]) }),
  },
}));

let canvas: HTMLElement;

function buildRenderer() {
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);

  canvas = document.createElement('div');
  canvas.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: SIZE, height: SIZE, right: SIZE, bottom: SIZE, x: 0, y: 0 }) as DOMRect;
  document.body.appendChild(canvas);

  return {
    scene: new THREE.Scene(),
    camera,
    workspace: new THREE.Object3D(),
    renderer: { domElement: canvas },
    needsToRender: false,
  };
}

/** Screen coords for a world ground point. */
function screenFor(x: number, y: number) {
  return { clientX: ((x / 5) * 0.5 + 0.5) * SIZE, clientY: (0.5 - (y / 5) * 0.5) * SIZE };
}

function clickGround(x: number, y: number) {
  const { clientX, clientY } = screenFor(x, y);
  fireEvent(canvas, new MouseEvent('pointerdown', { clientX, clientY, button: 0, bubbles: true }));
}

const numberInput = (name: string) =>
  document.querySelector(`input[name="${name}"]`) as HTMLInputElement;

const pointCount = () => screen.getByTestId('point-count').textContent?.trim() ?? '';
const perimeter = () => screen.getByTestId('perimeter').textContent?.replace(/\s+/g, ' ').trim();

/** Draw a square, leaving the outline open. */
function drawSquare() {
  fireEvent.click(screen.getByTestId('toggle-drawing'));
  for (const [x, y] of [[0, 0], [4, 0], [4, 4], [0, 4]]) clickGround(x, y);
}

beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
  fakeRenderer.current = buildRenderer();
  useContainer.setState({ containers: {}, version: 0 });
});

describe('readiness', () => {
  it('renders nothing until the renderer has a scene', () => {
    fakeRenderer.current = { ...(buildRenderer() as object), scene: undefined };
    const { container } = render(<SketchPanel />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders once the renderer is up', () => {
    render(<SketchPanel />);
    expect(screen.getByText('Floorplan')).toBeTruthy();
  });
});

describe('drawing', () => {
  it('toggles the tool on and off', () => {
    render(<SketchPanel />);
    const toggle = screen.getByTestId('toggle-drawing');
    expect(toggle.textContent).toBe('Draw');

    fireEvent.click(toggle);
    expect(toggle.textContent).toBe('Stop drawing');

    fireEvent.click(toggle);
    expect(toggle.textContent).toBe('Draw');
  });

  it('ignores canvas clicks until drawing is started', () => {
    render(<SketchPanel />);
    clickGround(2, 2);
    expect(pointCount()).toBe('0');
  });

  it('adds a point per click', () => {
    render(<SketchPanel />);
    drawSquare();
    expect(pointCount()).toBe('4');
  });

  it('uses the singular for one point', () => {
    render(<SketchPanel />);
    fireEvent.click(screen.getByTestId('toggle-drawing'));
    clickGround(1, 1);
    expect(pointCount()).toBe('1');
  });

  it('lists each point with its coordinates', () => {
    render(<SketchPanel />);
    drawSquare();
    expect(numberInput('point-1-x').value).toBe('4');
    expect(numberInput('point-1-y').value).toBe('0');
  });

  it('reports the perimeter', () => {
    render(<SketchPanel />);
    drawSquare();
    expect(perimeter()).toBe('12.00 m');
  });

  it('undoes the last point', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Undo last point' }));
    expect(pointCount()).toBe('3');
  });

  it('clears the outline', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Clear outline' }));
    expect(pointCount()).toBe('0');
  });
});

describe('closing the outline', () => {
  it('disables Close until there are three points', () => {
    render(<SketchPanel />);
    fireEvent.click(screen.getByTestId('toggle-drawing'));
    clickGround(0, 0);
    clickGround(4, 0);
    expect(screen.getByRole('button', { name: 'Close outline' })).toBeDisabled();
  });

  it('closes via the button', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));
    expect(pointCount()).toContain('(closed)');
  });

  it('closes by clicking back on the start point', () => {
    render(<SketchPanel />);
    drawSquare();
    clickGround(0.1, 0.1);
    expect(pointCount()).toContain('(closed)');
  });
});

describe('creating a room', () => {
  it('keeps Create disabled while the outline is open', () => {
    render(<SketchPanel />);
    drawSquare();
    expect(screen.getByRole('button', { name: 'Create room' })).toBeDisabled();
  });

  it('enables Create once closed and valid', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));
    expect(screen.getByRole('button', { name: 'Create room' })).toBeEnabled();
  });

  it('builds the room from the drawn outline and height', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create room' }));

    expect(addRoomFromMesh).toHaveBeenCalledTimes(1);
    const [mesh, options] = vi.mocked(addRoomFromMesh).mock.calls[0];
    expect(mesh.faces.map((f) => f.id)).toEqual([
      'floor',
      'ceiling',
      'wall-0',
      'wall-1',
      'wall-2',
      'wall-3',
    ]);
    expect(options.acousticMaterial).toMatchObject({ uuid: 'm1' });
  });

  it('extrudes to the height shown in the panel', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));
    fireEvent.change(numberInput('height'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create room' }));

    const [mesh] = vi.mocked(addRoomFromMesh).mock.calls[0];
    expect(Math.max(...mesh.vertices.map((v) => v[2]))).toBeCloseTo(4);
  });

  it('stops drawing and offers a fresh start once a room exists', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create room' }));

    expect(screen.getByTestId('toggle-drawing').textContent).toBe('Draw');
    expect(screen.getByRole('button', { name: 'Start a new room' })).toBeTruthy();
  });

  it('cannot create the same room twice', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create room' }));
    expect(screen.getByRole('button', { name: 'Create room' })).toBeDisabled();
  });

  it('surfaces a failure instead of throwing', () => {
    vi.mocked(addRoomFromMesh).mockImplementationOnce(() => {
      throw new Error('boom');
    });
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create room' }));

    expect(within(screen.getByTestId('sketch-error')).getByText(/boom/)).toBeTruthy();
  });
});

describe('editing an existing room', () => {
  function createRoom() {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create room' }));
  }

  it('re-extrudes when the height changes', () => {
    createRoom();
    fireEvent.change(numberInput('height'), { target: { value: '3.5' } });

    expect(setFloorplan).toHaveBeenCalledTimes(1);
    const [, params] = vi.mocked(setFloorplan).mock.calls[0];
    expect(params.height).toBe(3.5);
  });

  it('re-extrudes when a point is edited numerically', () => {
    createRoom();
    fireEvent.change(numberInput('point-1-x'), { target: { value: '6' } });
    fireEvent.change(numberInput('height'), { target: { value: '3' } });

    const [, params] = vi.mocked(setFloorplan).mock.calls.at(-1)!;
    expect(params.points[1].x).toBe(6);
  });

  it('does not re-extrude before a room exists', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.change(numberInput('height'), { target: { value: '3' } });
    expect(setFloorplan).not.toHaveBeenCalled();
  });

  it('reports a failed re-extrude', () => {
    vi.mocked(setFloorplan).mockImplementationOnce(() => {
      throw new Error('bad plan');
    });
    createRoom();
    fireEvent.change(numberInput('height'), { target: { value: '3' } });
    expect(within(screen.getByTestId('sketch-error')).getByText(/bad plan/)).toBeTruthy();
  });

  it('detaches from the room when starting a new one', () => {
    createRoom();
    fireEvent.click(screen.getByRole('button', { name: 'Start a new room' }));
    fireEvent.change(numberInput('height'), { target: { value: '3' } });
    expect(setFloorplan).not.toHaveBeenCalled();
  });
});

describe('numeric point entry', () => {
  it('updates the listed coordinate', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.change(numberInput('point-0-x'), { target: { value: '-2' } });
    expect(numberInput('point-0-x').value).toBe('-2');
  });

  it('feeds the edited outline into the created room', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.change(numberInput('point-2-x'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create room' }));

    const [mesh] = vi.mocked(addRoomFromMesh).mock.calls[0];
    expect(Math.max(...mesh.vertices.map((v) => v[0]))).toBeCloseTo(8);
  });
});

describe('snap settings', () => {
  it('applies the grid to new clicks', () => {
    render(<SketchPanel />);
    fireEvent.change(numberInput('gridSize'), { target: { value: '1' } });
    fireEvent.click(screen.getByTestId('toggle-drawing'));
    clickGround(2.4, 3.4);

    expect(numberInput('point-0-x').value).toBe('2');
    expect(numberInput('point-0-y').value).toBe('3');
  });

  it('constrains to axes when ortho is enabled', () => {
    render(<SketchPanel />);
    fireEvent.change(numberInput('gridSize'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByTestId('toggle-drawing'));
    clickGround(0, 0);
    clickGround(4, 1);

    expect(Number(numberInput('point-1-y').value)).toBeCloseTo(0);
  });
});

describe('validation feedback', () => {
  it('warns about a self-intersecting outline', () => {
    render(<SketchPanel />);
    fireEvent.change(numberInput('gridSize'), { target: { value: '0' } });
    fireEvent.click(screen.getByTestId('toggle-drawing'));
    for (const [x, y] of [[0, 0], [4, 4], [4, 0], [0, 3]]) clickGround(x, y);
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));

    expect(within(screen.getByTestId('sketch-issues')).getByText(/cross each other/)).toBeTruthy();
  });

  it('blocks creation while the outline is invalid', () => {
    render(<SketchPanel />);
    fireEvent.change(numberInput('gridSize'), { target: { value: '0' } });
    fireEvent.click(screen.getByTestId('toggle-drawing'));
    for (const [x, y] of [[0, 0], [4, 4], [4, 0], [0, 3]]) clickGround(x, y);
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));

    expect(screen.getByRole('button', { name: 'Create room' })).toBeDisabled();
  });

  it('shows no warning for a valid outline', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.click(screen.getByRole('button', { name: 'Close outline' }));
    expect(screen.queryByTestId('sketch-issues')).toBeNull();
  });
});

const SQUARE = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];

/** A minimal stand-in for a Room restored from a save file. */
function seedRoom(userData: Record<string, unknown>, kind = 'room') {
  const roomLike = { uuid: 'restored-room', name: 'sketched room', kind, userData };
  useContainer.setState({
    containers: { 'restored-room': roomLike } as never,
    version: 1,
  });
  return roomLike;
}

const savedMesh = (height = 3) =>
  JSON.parse(JSON.stringify(floorplanToMesh({ points: SQUARE, height })));

describe('adopting a room from the project', () => {
  it('picks up a sketched room already in the scene', () => {
    seedRoom({ [ROOM_MESH_KEY]: savedMesh(3) });
    render(<SketchPanel />);

    expect(pointCount()).toContain('4');
    expect(pointCount()).toContain('(closed)');
  });

  it('restores the saved height', () => {
    seedRoom({ [ROOM_MESH_KEY]: savedMesh(3.75) });
    render(<SketchPanel />);
    expect(numberInput('height').value).toBe('3.75');
  });

  it('restores the outline coordinates', () => {
    seedRoom({ [ROOM_MESH_KEY]: savedMesh() });
    render(<SketchPanel />);
    expect(numberInput('point-1-x').value).toBe('4');
    expect(numberInput('point-2-y').value).toBe('3');
  });

  it('offers to start a new room, showing it is adopted', () => {
    seedRoom({ [ROOM_MESH_KEY]: savedMesh() });
    render(<SketchPanel />);
    expect(screen.getByRole('button', { name: 'Start a new room' })).toBeTruthy();
  });

  it('edits the adopted room rather than creating another', () => {
    const roomLike = seedRoom({ [ROOM_MESH_KEY]: savedMesh(3) });
    render(<SketchPanel />);

    fireEvent.change(numberInput('height'), { target: { value: '5' } });

    expect(setFloorplan).toHaveBeenCalledTimes(1);
    const [target, params] = vi.mocked(setFloorplan).mock.calls[0];
    expect(target).toBe(roomLike);
    expect(params.height).toBe(5);
    expect(addRoomFromMesh).not.toHaveBeenCalled();
  });

  it('adopts a room that appears after mount, as on project load', () => {
    render(<SketchPanel />);
    expect(pointCount()).toBe('0');

    // Wrapped in act: the store update originates outside React, so the
    // subscription-driven re-render has to be flushed before asserting.
    act(() => {
      seedRoom({ [ROOM_MESH_KEY]: savedMesh() });
    });

    expect(pointCount()).toContain('4');
  });

  it('ignores an imported room with no mesh', () => {
    seedRoom({});
    render(<SketchPanel />);
    expect(pointCount()).toBe('0');
    expect(screen.queryByRole('button', { name: 'Start a new room' })).toBeNull();
  });

  it('ignores a mesh whose floorplan provenance is malformed', () => {
    const mesh = savedMesh();
    mesh.source = { kind: 'manual' };
    seedRoom({ [ROOM_MESH_KEY]: mesh });
    render(<SketchPanel />);
    expect(pointCount()).toBe('0');
  });

  it('ignores containers that are not rooms', () => {
    seedRoom({ [ROOM_MESH_KEY]: savedMesh() }, 'surface');
    render(<SketchPanel />);
    expect(pointCount()).toBe('0');
  });

  it('does not re-adopt after the user starts a new room', () => {
    seedRoom({ [ROOM_MESH_KEY]: savedMesh() });
    render(<SketchPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Start a new room' }));

    expect(pointCount()).toBe('0');
    expect(screen.queryByRole('button', { name: 'Start a new room' })).toBeNull();
  });
});

describe('a room edited past its floorplan', () => {
  const detachedMesh = () => {
    const mesh = floorplanToMesh({ points: SQUARE, height: 3 });
    return JSON.parse(
      JSON.stringify(applyEdit(mesh, { kind: 'move-vertex', id: 0, to: [-2, -2, 0] }))
    );
  };

  it('is adopted but flagged', () => {
    seedRoom({ [ROOM_MESH_KEY]: detachedMesh() });
    render(<SketchPanel />);
    expect(screen.getByTestId('sketch-detached')).toBeTruthy();
  });

  it('does not show a floorplan that no longer describes it', () => {
    seedRoom({ [ROOM_MESH_KEY]: detachedMesh() });
    render(<SketchPanel />);
    expect(pointCount()).toBe('0');
  });

  it('locks the height field', () => {
    seedRoom({ [ROOM_MESH_KEY]: detachedMesh() });
    render(<SketchPanel />);
    expect(numberInput('height').disabled).toBe(true);
  });

  it('refuses to re-extrude, which would discard the direct edits', () => {
    seedRoom({ [ROOM_MESH_KEY]: detachedMesh() });
    render(<SketchPanel />);

    fireEvent.change(numberInput('height'), { target: { value: '5' } });

    expect(setFloorplan).not.toHaveBeenCalled();
  });

  it('can be set aside to sketch a new room', () => {
    seedRoom({ [ROOM_MESH_KEY]: detachedMesh() });
    render(<SketchPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Start a new room' }));
    expect(screen.queryByTestId('sketch-detached')).toBeNull();
  });
});

describe('number fields', () => {
  it('adjusts on wheel and swallows the scroll, as every CRAM number field does', () => {
    // Shared behaviour from PropertyRowNumberInput: the wheel nudges the value
    // by one step and calls preventDefault, so the panel does not also scroll.
    // Worth pinning because the panel can show a long list of coordinates.
    render(<SketchPanel />);
    drawSquare();

    const input = numberInput('point-0-x');
    const before = Number(input.value);
    const event = new WheelEvent('wheel', { deltaY: -1, cancelable: true, bubbles: true });

    act(() => {
      input.dispatchEvent(event);
    });

    expect(event.defaultPrevented).toBe(true);
    expect(Number(numberInput('point-0-x').value)).toBeCloseTo(before + 0.1);
  });

  it('does not adjust on wheel when the field is disabled', () => {
    const mesh = floorplanToMesh({ points: SQUARE, height: 3 });
    seedRoom({
      [ROOM_MESH_KEY]: JSON.parse(
        JSON.stringify(applyEdit(mesh, { kind: 'move-vertex', id: 0, to: [-2, -2, 0] }))
      ),
    });
    render(<SketchPanel />);

    const input = numberInput('height');
    const before = input.value;
    act(() => {
      input.dispatchEvent(new WheelEvent('wheel', { deltaY: -1, cancelable: true, bubbles: true }));
    });

    expect(numberInput('height').value).toBe(before);
  });

  it('ignores a cleared field rather than reading it as zero', () => {
    render(<SketchPanel />);
    drawSquare();
    fireEvent.change(numberInput('point-0-x'), { target: { value: '' } });
    expect(numberInput('point-0-x').value).toBe('0');
  });

  it('disables every field for a detached room', () => {
    const mesh = floorplanToMesh({ points: SQUARE, height: 3 });
    seedRoom({
      [ROOM_MESH_KEY]: JSON.parse(
        JSON.stringify(applyEdit(mesh, { kind: 'move-vertex', id: 0, to: [-2, -2, 0] }))
      ),
    });
    render(<SketchPanel />);
    expect(numberInput('height').disabled).toBe(true);
  });
});
