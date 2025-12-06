import {
  useContainer,
  addContainer,
  getContainerKeys,
} from '../container-store';
import Container from '../../objects/container';

// Helper to reset store between tests
const resetStore = () => {
  useContainer.setState({
    containers: {},
    selectedObjects: new Set(),
  }, true);
};

describe('container-store', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('initial state', () => {
    it('starts with empty containers', () => {
      const state = useContainer.getState();
      expect(state.containers).toEqual({});
    });

    it('starts with empty selectedObjects', () => {
      const state = useContainer.getState();
      expect(state.selectedObjects.size).toBe(0);
    });
  });

  describe('addContainer', () => {
    it('adds a container to the store', () => {
      const container = new Container('TestContainer');
      addContainer(Container)(container);

      const state = useContainer.getState();
      expect(state.containers[container.uuid]).toBe(container);
    });

    it('uses container uuid as key', () => {
      const container = new Container('Test');
      const uuid = container.uuid;

      addContainer(Container)(container);

      const keys = Object.keys(useContainer.getState().containers);
      expect(keys).toContain(uuid);
    });

    it('can add multiple containers', () => {
      const container1 = new Container('First');
      const container2 = new Container('Second');

      addContainer(Container)(container1);
      addContainer(Container)(container2);

      const state = useContainer.getState();
      expect(Object.keys(state.containers).length).toBe(2);
    });

    it('creates new container if none provided', () => {
      addContainer(Container)(undefined);

      const state = useContainer.getState();
      expect(Object.keys(state.containers).length).toBe(1);
    });
  });

  describe('getContainerKeys', () => {
    it('returns empty array when no containers', () => {
      const keys = getContainerKeys();
      expect(keys).toEqual([]);
    });

    it('returns all container uuids', () => {
      const container1 = new Container('First');
      const container2 = new Container('Second');

      addContainer(Container)(container1);
      addContainer(Container)(container2);

      const keys = getContainerKeys();
      expect(keys).toContain(container1.uuid);
      expect(keys).toContain(container2.uuid);
      expect(keys.length).toBe(2);
    });
  });

  describe('direct state manipulation', () => {
    it('can set state directly', () => {
      const container = new Container('Test');

      useContainer.setState({
        containers: { [container.uuid]: container },
        selectedObjects: new Set(),
      });

      expect(useContainer.getState().containers[container.uuid]).toBe(container);
    });

    it('can update containers via setState', () => {
      const container1 = new Container('First');
      const container2 = new Container('Second');

      addContainer(Container)(container1);

      useContainer.setState(state => ({
        ...state,
        containers: {
          ...state.containers,
          [container2.uuid]: container2,
        },
      }));

      expect(Object.keys(useContainer.getState().containers).length).toBe(2);
    });

    it('can remove container via setState', () => {
      const container = new Container('Test');
      addContainer(Container)(container);

      const { [container.uuid]: removed, ...rest } = useContainer.getState().containers;
      useContainer.setState(state => ({
        ...state,
        containers: rest,
      }));

      expect(useContainer.getState().containers[container.uuid]).toBeUndefined();
    });
  });

  describe('subscription', () => {
    it('notifies subscribers on state change', () => {
      const callback = jest.fn();
      const unsubscribe = useContainer.subscribe(callback);

      const container = new Container('Test');
      addContainer(Container)(container);

      expect(callback).toHaveBeenCalled();

      unsubscribe();
    });

    it('unsubscribe stops notifications', () => {
      const callback = jest.fn();
      const unsubscribe = useContainer.subscribe(callback);
      unsubscribe();

      const container = new Container('Test');
      addContainer(Container)(container);

      // Should not be called after unsubscribe
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('selectedObjects management', () => {
    it('can add to selectedObjects via setState', () => {
      const container = new Container('Test');
      addContainer(Container)(container);

      useContainer.setState(state => {
        const newSelected = new Set(state.selectedObjects);
        newSelected.add(container);
        return { ...state, selectedObjects: newSelected };
      });

      expect(useContainer.getState().selectedObjects.has(container)).toBe(true);
    });

    it('can clear selectedObjects', () => {
      const container = new Container('Test');
      addContainer(Container)(container);

      useContainer.setState(state => {
        const newSelected = new Set(state.selectedObjects);
        newSelected.add(container);
        return { ...state, selectedObjects: newSelected };
      });

      useContainer.setState(state => ({
        ...state,
        selectedObjects: new Set(),
      }));

      expect(useContainer.getState().selectedObjects.size).toBe(0);
    });
  });

  describe('container operations', () => {
    it('containers have correct kind', () => {
      const container = new Container('Test');
      addContainer(Container)(container);

      const stored = useContainer.getState().containers[container.uuid];
      expect(stored.kind).toBe('container');
    });

    it('containers preserve properties after storage', () => {
      const container = new Container('Test');
      container.position.set(1, 2, 3);
      container.visible = false;

      addContainer(Container)(container);

      const stored = useContainer.getState().containers[container.uuid];
      expect(stored.name).toBe('Test');
      expect(stored.position.x).toBe(1);
      expect(stored.position.y).toBe(2);
      expect(stored.position.z).toBe(3);
      expect(stored.visible).toBe(false);
    });
  });
});
