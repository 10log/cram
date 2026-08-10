/**
 * Floorplan tool tests.
 *
 * Real three.js and real DOM events. An orthographic camera looking straight
 * down the -Z axis makes the screen-to-ground mapping exactly predictable:
 * with a 10x10 frustum over a 100x100 element, NDC (1,1) is world (5,5).
 *
 * The drawing rules themselves are covered in sketch-input.spec.ts; what is
 * tested here is the plumbing — projection, event wiring, preview buffers and
 * teardown.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as THREE from 'three';
import { FloorplanTool } from '../floorplan-tool';

const SIZE = 100;

function makeCamera(): THREE.OrthographicCamera {
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  return camera;
}

function makeElement(): HTMLElement {
  const el = document.createElement('div');
  el.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: SIZE, height: SIZE, right: SIZE, bottom: SIZE, x: 0, y: 0 }) as DOMRect;
  document.body.appendChild(el);
  return el;
}

/** Screen coords for a world ground point, given the camera above. */
function screenFor(x: number, y: number) {
  return { clientX: ((x / 5) * 0.5 + 0.5) * SIZE, clientY: (0.5 - (y / 5) * 0.5) * SIZE };
}

function pointer(type: string, x: number, y: number, button = 0): MouseEvent {
  const { clientX, clientY } = screenFor(x, y);
  return new MouseEvent(type, { clientX, clientY, button, bubbles: true });
}

let element: HTMLElement;
let parent: THREE.Object3D;
let tool: FloorplanTool;

function makeTool(options: Partial<ConstructorParameters<typeof FloorplanTool>[0]> = {}) {
  return new FloorplanTool({
    domElement: element,
    camera: makeCamera(),
    parent,
    settings: { gridSize: 0, ortho: false, closeDistance: 0.5 },
    ...options,
  });
}

const linePositions = (t: FloorplanTool) =>
  (t.group.children[0] as THREE.Line).geometry.getAttribute('position');
const markerPositions = (t: FloorplanTool) =>
  (t.group.children[1] as THREE.Points).geometry.getAttribute('position');

beforeEach(() => {
  element = makeElement();
  parent = new THREE.Object3D();
});

afterEach(() => {
  tool?.dispose();
  element.remove();
});

describe('construction', () => {
  it('parents its preview group', () => {
    tool = makeTool();
    expect(parent.children).toContain(tool.group);
  });

  it('starts hidden, empty and disabled', () => {
    tool = makeTool();
    expect(tool.group.visible).toBe(false);
    expect(tool.enabled).toBe(false);
    expect(tool.draft.points).toEqual([]);
  });

  it('merges partial settings over the defaults', () => {
    tool = makeTool({ settings: { ortho: true } });
    expect(tool.getSettings()).toMatchObject({ ortho: true, gridSize: 0.25 });
  });
});

describe('screenToGround', () => {
  beforeEach(() => {
    tool = makeTool();
  });

  it('maps the element centre to the world origin', () => {
    const point = tool.screenToGround({ clientX: 50, clientY: 50 })!;
    expect(point.x).toBeCloseTo(0);
    expect(point.y).toBeCloseTo(0);
  });

  it('maps the top-right corner to the frustum corner', () => {
    const point = tool.screenToGround({ clientX: SIZE, clientY: 0 })!;
    expect(point.x).toBeCloseTo(5);
    expect(point.y).toBeCloseTo(5);
  });

  it('inverts the y axis, since screen y grows downward', () => {
    const point = tool.screenToGround({ clientX: 50, clientY: SIZE })!;
    expect(point.y).toBeCloseTo(-5);
  });

  it('round-trips the helper used by these tests', () => {
    const point = tool.screenToGround(screenFor(2, -3))!;
    expect(point.x).toBeCloseTo(2);
    expect(point.y).toBeCloseTo(-3);
  });

  it('returns null when the element has no size', () => {
    element.getBoundingClientRect = () => ({ left: 0, top: 0, width: 0, height: 0 }) as DOMRect;
    expect(tool.screenToGround({ clientX: 1, clientY: 1 })).toBeNull();
  });

  it('returns null when the ray runs parallel to the ground', () => {
    // Held at z=5 looking along +Y: parallel to the plane and never touching it.
    // (A camera at z=0 would be *coplanar*, and three.js reports the ray origin
    // as an intersection in that case rather than a miss.)
    const sideOn = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
    sideOn.position.set(0, -10, 5);
    sideOn.up.set(0, 0, 1);
    sideOn.lookAt(0, 0, 5);
    sideOn.updateMatrixWorld(true);

    const parallel = makeTool({ camera: sideOn });
    expect(parallel.screenToGround({ clientX: 50, clientY: 50 })).toBeNull();
    parallel.dispose();
  });

  it('projects onto a raised plane when baseZ is set', () => {
    const raised = makeTool({ baseZ: 3 });
    expect(raised.screenToGround({ clientX: 50, clientY: 50 })).toEqual({ x: 0, y: 0 });
    raised.dispose();
  });
});

describe('camera replacement', () => {
  // Renderer.setOrtho swaps renderer.camera for a new instance, so a tool
  // holding the original would keep raycasting through an invisible camera.
  it('follows a camera getter when the camera is replaced', () => {
    let current = makeCamera();
    const following = makeTool({ camera: () => current });

    const before = following.screenToGround({ clientX: SIZE, clientY: 0 })!;
    expect(before.x).toBeCloseTo(5);

    // A wider frustum, as a projection toggle would produce.
    const wider = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 100);
    wider.position.set(0, 0, 10);
    wider.lookAt(0, 0, 0);
    wider.updateMatrixWorld(true);
    current = wider;

    const after = following.screenToGround({ clientX: SIZE, clientY: 0 })!;
    expect(after.x).toBeCloseTo(10);
    following.dispose();
  });

  it('still accepts a plain camera', () => {
    tool = makeTool({ camera: makeCamera() });
    expect(tool.screenToGround({ clientX: 50, clientY: 50 })!.x).toBeCloseTo(0);
  });
});

describe('pointer interaction', () => {
  beforeEach(() => {
    tool = makeTool();
    tool.enable();
  });

  it('commits a point on left click', () => {
    element.dispatchEvent(pointer('pointerdown', 2, 3));
    expect(tool.draft.points).toHaveLength(1);
    expect(tool.draft.points[0].x).toBeCloseTo(2);
    expect(tool.draft.points[0].y).toBeCloseTo(3);
  });

  it('ignores right click', () => {
    element.dispatchEvent(pointer('pointerdown', 2, 3, 2));
    expect(tool.draft.points).toEqual([]);
  });

  it('tracks the cursor on move', () => {
    element.dispatchEvent(pointer('pointermove', 1, -1));
    expect(tool.draft.cursor!.x).toBeCloseTo(1);
    expect(tool.draft.cursor!.y).toBeCloseTo(-1);
  });

  it('clears the cursor when the pointer leaves', () => {
    element.dispatchEvent(pointer('pointermove', 1, 1));
    element.dispatchEvent(new MouseEvent('pointerleave', { bubbles: true }));
    expect(tool.draft.cursor).toBeNull();
  });

  it('ignores events once disabled', () => {
    tool.disable();
    element.dispatchEvent(pointer('pointerdown', 2, 3));
    expect(tool.draft.points).toEqual([]);
  });

  it('closes the outline when clicking back on the start', () => {
    const onClose = vi.fn();
    tool.dispose();
    tool = makeTool({ onClose });
    tool.enable();

    for (const [x, y] of [[0, 0], [4, 0], [4, 4], [0, 4]]) {
      element.dispatchEvent(pointer('pointerdown', x, y));
    }
    element.dispatchEvent(pointer('pointerdown', 0.1, 0.1));

    expect(tool.draft.closed).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('reports every change', () => {
    const onChange = vi.fn();
    tool.dispose();
    tool = makeTool({ onChange });
    tool.enable();

    element.dispatchEvent(pointer('pointerdown', 1, 1));
    element.dispatchEvent(pointer('pointermove', 2, 2));

    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('does not fire onChange when nothing actually changed', () => {
    const onChange = vi.fn();
    tool.dispose();
    tool = makeTool({ onChange });
    tool.enable();

    // Two identical clicks: the second is swallowed as a repeat.
    element.dispatchEvent(pointer('pointerdown', 1, 1));
    element.dispatchEvent(pointer('pointerdown', 1, 1));

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('keyboard', () => {
  beforeEach(() => {
    tool = makeTool();
    tool.enable();
    for (const [x, y] of [[0, 0], [4, 0], [4, 4]]) {
      element.dispatchEvent(pointer('pointerdown', x, y));
    }
  });

  it('closes on Enter', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(tool.draft.closed).toBe(true);
  });

  it('steps back on Backspace', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    expect(tool.draft.points).toHaveLength(2);
  });

  it('discards the outline on Escape', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(tool.draft.points).toEqual([]);
    expect(tool.draft.closed).toBe(false);
  });

  it('ignores unrelated keys', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(tool.draft.points).toHaveLength(3);
  });

  describe('does not hijack typing', () => {
    // The listener sits on window so shortcuts work with the viewport focused,
    // which also puts it in front of every form field on the page.
    const dispatchFrom = (el: HTMLElement, key: string) => {
      document.body.appendChild(el);
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      el.remove();
    };

    it('ignores Backspace from a number input', () => {
      const input = document.createElement('input');
      input.type = 'number';
      dispatchFrom(input, 'Backspace');
      expect(tool.draft.points).toHaveLength(3);
    });

    it('ignores Escape from a text input', () => {
      const input = document.createElement('input');
      dispatchFrom(input, 'Escape');
      expect(tool.draft.points).toHaveLength(3);
    });

    it('ignores Enter from a textarea', () => {
      dispatchFrom(document.createElement('textarea'), 'Enter');
      expect(tool.draft.closed).toBe(false);
    });

    it('ignores Delete from a contenteditable element', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      Object.defineProperty(div, 'isContentEditable', { value: true });
      dispatchFrom(div, 'Delete');
      expect(tool.draft.points).toHaveLength(3);
    });

    it('still responds to keys from elsewhere on the page', () => {
      dispatchFrom(document.createElement('div'), 'Enter');
      expect(tool.draft.closed).toBe(true);
    });
  });

  it('stops listening once disabled', () => {
    tool.disable();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(tool.draft.points).toHaveLength(3);
  });
});

describe('preview geometry', () => {
  beforeEach(() => {
    tool = makeTool();
    tool.enable();
  });

  it('draws a rubber band from the committed points to the cursor', () => {
    element.dispatchEvent(pointer('pointerdown', 0, 0));
    element.dispatchEvent(pointer('pointerdown', 4, 0));
    element.dispatchEvent(pointer('pointermove', 4, 3));

    expect(linePositions(tool).count).toBe(3);
    expect(markerPositions(tool).count).toBe(2);
  });

  it('places preview vertices on the drawing plane', () => {
    const raised = makeTool({ baseZ: 2 });
    raised.enable();
    element.dispatchEvent(pointer('pointerdown', 1, 1));

    expect(linePositions(raised).getZ(0)).toBeCloseTo(2);
    raised.dispose();
  });

  it('returns to the start once closed', () => {
    for (const [x, y] of [[0, 0], [4, 0], [4, 4], [0, 4]]) {
      element.dispatchEvent(pointer('pointerdown', x, y));
    }
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    const positions = linePositions(tool);
    expect(positions.count).toBe(5);
    expect(positions.getX(4)).toBeCloseTo(positions.getX(0));
    expect(positions.getY(4)).toBeCloseTo(positions.getY(0));
  });

  it('empties when reset', () => {
    element.dispatchEvent(pointer('pointerdown', 1, 1));
    tool.reset();
    expect(linePositions(tool).count).toBe(0);
    expect(markerPositions(tool).count).toBe(0);
  });
});

describe('lifecycle', () => {
  it('shows and hides the preview with enable/disable', () => {
    tool = makeTool();
    tool.enable();
    expect(tool.group.visible).toBe(true);
    tool.disable();
    expect(tool.group.visible).toBe(false);
  });

  it('tolerates repeated enable and disable', () => {
    tool = makeTool();
    tool.enable();
    tool.enable();
    tool.disable();
    tool.disable();
    expect(tool.enabled).toBe(false);
  });

  it('detaches from its parent on dispose', () => {
    tool = makeTool();
    tool.dispose();
    expect(parent.children).not.toContain(tool.group);
  });

  it('stops handling events after dispose', () => {
    tool = makeTool();
    tool.enable();
    tool.dispose();
    element.dispatchEvent(pointer('pointerdown', 2, 2));
    expect(tool.draft.points).toEqual([]);
  });
});

describe('snapping is delegated, not reimplemented', () => {
  it('applies the grid setting to clicks', () => {
    tool = makeTool({ settings: { gridSize: 1, ortho: false, closeDistance: 0.5 } });
    tool.enable();
    element.dispatchEvent(pointer('pointerdown', 2.4, 3.4));
    expect(tool.draft.points[0]).toEqual({ x: 2, y: 3 });
  });

  it('applies an ortho setting changed at runtime', () => {
    tool = makeTool();
    tool.enable();
    element.dispatchEvent(pointer('pointerdown', 0, 0));
    tool.setSettings({ ortho: true });
    element.dispatchEvent(pointer('pointerdown', 4, 1));

    expect(tool.draft.points[1].y).toBeCloseTo(0);
  });
});
