/**
 * #90: Transform fields dropped a typed "-" because the input was re-rendered
 * from the store before the value parsed.
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useContainer } from '../../../store';
import TransformTable from '../TransformTable';

const emitted: Array<{ event: string; payload: any }> = [];
const storeRef: { current: typeof import('../../../store').useContainer | null } = { current: null };

vi.mock('../../../messenger', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../messenger')>();
  return {
    ...actual,
    emit: (event: string, payload: any) => {
      emitted.push({ event, payload });
      // Mirror setContainerProperty: write onto the container, bump version.
      const store = storeRef.current!;
      (store.getState().containers[payload.uuid] as any)[payload.property] = payload.value;
      store.setState((state) => ({ version: state.version + 1 }));
    },
  };
});

storeRef.current = useContainer;

const UUID = 'src-1';

beforeEach(() => {
  emitted.length = 0;
  act(() => {
    useContainer.setState((state) => ({
      containers: {
        ...state.containers,
        [UUID]: {
          x: 3.7, y: 0, z: 0,
          scalex: 1, scaley: 1, scalez: 1,
          rotationx: 0, rotationy: 0, rotationz: Math.PI / 2,
        } as any,
      },
      version: state.version + 1,
    }));
  });
});

const cells = () => screen.getAllByRole('spinbutton') as HTMLInputElement[];

describe('TransformTable typed input (#90)', () => {
  it('Position X accepts a negative value typed from an emptied field', () => {
    render(<TransformTable uuid={UUID} event="SOURCE_SET_PROPERTY" />);
    const x = cells()[0];
    expect(x.value).toBe('3.7');

    fireEvent.change(x, { target: { value: '' } });
    expect(x.value).toBe(''); // not snapped back to 3.7
    fireEvent.change(x, { target: { value: '-9.6' } });
    fireEvent.blur(x);

    expect(emitted.at(-1)).toEqual({
      event: 'SOURCE_SET_PROPERTY',
      payload: { uuid: UUID, property: 'x', value: -9.6 },
    });
    expect((useContainer.getState().containers[UUID] as any).x).toBe(-9.6);
    expect(x.value).toBe('-9.6');
  });

  it('rotation is typed in degrees and emitted in radians, negatives included', () => {
    render(<TransformTable uuid={UUID} event="SOURCE_SET_PROPERTY" />);
    const rz = cells()[8];
    expect(rz.value).toBe('90');

    fireEvent.change(rz, { target: { value: '' } });
    fireEvent.change(rz, { target: { value: '-45' } });
    fireEvent.blur(rz);

    expect(emitted.at(-1)!.payload.property).toBe('rotationz');
    expect(emitted.at(-1)!.payload.value).toBeCloseTo(-Math.PI / 4, 12);
    expect(rz.value).toBe('-45');
  });

  it('nothing is emitted for an unparsable draft, and blur restores the stored value', () => {
    render(<TransformTable uuid={UUID} event="SOURCE_SET_PROPERTY" />);
    const x = cells()[0];

    fireEvent.change(x, { target: { value: '' } });
    expect(emitted).toHaveLength(0);
    fireEvent.blur(x);
    expect(x.value).toBe('3.7');
  });
});
