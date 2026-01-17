/**
 * Solver Store Tests
 *
 * Tests for the Zustand-based solver state management store.
 * Verifies add/remove operations, property setting, and method calling.
 */

import {
  useSolver,
  addSolver,
  removeSolver,
  setSolverProperty,
  callSolverMethod,
  getSolverKeys,
} from '../solver-store';
import Solver from '../../compute/solver';

// Mock uuid to have predictable test values
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

// Concrete implementation of Solver for testing
class TestSolver extends Solver {
  testValue: number = 0;
  asyncCalled: boolean = false;
  syncCalled: boolean = false;

  constructor(name?: string) {
    super({ name: name || 'TestSolver' });
    this.kind = 'test-solver';
  }

  update() {
    this.testValue += 1;
  }

  syncMethod(value: number) {
    this.syncCalled = true;
    this.testValue = value;
  }

  async asyncMethod(value: number) {
    this.asyncCalled = true;
    this.testValue = value;
    return value;
  }

  save() {
    return {
      ...super.save(),
      testValue: this.testValue,
    };
  }

  restore(state: any) {
    super.restore(state);
    this.testValue = state.testValue || 0;
    return this;
  }
}

describe('Solver Store', () => {
  // Reset store before each test
  beforeEach(() => {
    useSolver.setState({ solvers: {} });
  });

  describe('Initial State', () => {
    it('starts with empty solvers object', () => {
      const state = useSolver.getState();
      expect(state.solvers).toEqual({});
    });

    it('keys() returns empty array initially', () => {
      const state = useSolver.getState();
      expect(state.keys()).toEqual([]);
    });

    it('getSolverKeys returns empty array initially', () => {
      expect(getSolverKeys()).toEqual([]);
    });
  });

  describe('addSolver', () => {
    it('adds a new solver instance to the store', () => {
      const solver = new TestSolver('MySolver');
      const add = addSolver(TestSolver);
      add(solver);

      const state = useSolver.getState();
      expect(state.solvers[solver.uuid]).toBe(solver);
    });

    it('creates a new solver if none provided', () => {
      const add = addSolver(TestSolver);
      add(undefined);

      const state = useSolver.getState();
      const keys = Object.keys(state.solvers);
      expect(keys.length).toBe(1);
      expect(state.solvers[keys[0]]).toBeInstanceOf(TestSolver);
    });

    it('can add multiple solvers', () => {
      const solver1 = new TestSolver('Solver1');
      const solver2 = new TestSolver('Solver2');
      const solver3 = new TestSolver('Solver3');

      const add = addSolver(TestSolver);
      add(solver1);
      add(solver2);
      add(solver3);

      const state = useSolver.getState();
      expect(Object.keys(state.solvers).length).toBe(3);
      expect(state.solvers[solver1.uuid]).toBe(solver1);
      expect(state.solvers[solver2.uuid]).toBe(solver2);
      expect(state.solvers[solver3.uuid]).toBe(solver3);
    });

    it('updates keys() after adding solver', () => {
      const solver = new TestSolver('MySolver');
      const add = addSolver(TestSolver);
      add(solver);

      const state = useSolver.getState();
      expect(state.keys()).toContain(solver.uuid);
    });
  });

  describe('removeSolver', () => {
    it('removes a solver from the store', () => {
      const solver = new TestSolver('MySolver');
      const add = addSolver(TestSolver);
      add(solver);

      // Verify it's there
      expect(useSolver.getState().solvers[solver.uuid]).toBe(solver);

      // Remove it
      removeSolver(solver.uuid);

      // Verify it's gone
      expect(useSolver.getState().solvers[solver.uuid]).toBeUndefined();
    });

    it('removes only the specified solver', () => {
      const solver1 = new TestSolver('Solver1');
      const solver2 = new TestSolver('Solver2');

      const add = addSolver(TestSolver);
      add(solver1);
      add(solver2);

      removeSolver(solver1.uuid);

      const state = useSolver.getState();
      expect(state.solvers[solver1.uuid]).toBeUndefined();
      expect(state.solvers[solver2.uuid]).toBe(solver2);
    });

    it('handles removing non-existent solver gracefully', () => {
      // Should not throw
      expect(() => removeSolver('non-existent-uuid')).not.toThrow();
    });

    it('updates keys() after removing solver', () => {
      const solver = new TestSolver('MySolver');
      const add = addSolver(TestSolver);
      add(solver);

      removeSolver(solver.uuid);

      const state = useSolver.getState();
      expect(state.keys()).not.toContain(solver.uuid);
    });
  });

  describe('setSolverProperty', () => {
    it('sets a property on the solver', () => {
      const solver = new TestSolver('MySolver');
      const add = addSolver(TestSolver);
      add(solver);

      setSolverProperty({
        uuid: solver.uuid,
        property: 'testValue',
        value: 42,
      });

      expect(solver.testValue).toBe(42);
    });

    it('sets the name property', () => {
      const solver = new TestSolver('OldName');
      const add = addSolver(TestSolver);
      add(solver);

      setSolverProperty({
        uuid: solver.uuid,
        property: 'name',
        value: 'NewName',
      });

      expect(solver.name).toBe('NewName');
    });

    it('sets the running property', () => {
      const solver = new TestSolver('MySolver');
      const add = addSolver(TestSolver);
      add(solver);

      expect(solver.running).toBe(false);

      setSolverProperty({
        uuid: solver.uuid,
        property: 'running',
        value: true,
      });

      expect(solver.running).toBe(true);
    });
  });

  describe('callSolverMethod', () => {
    it('calls a synchronous method on the solver', () => {
      const solver = new TestSolver('MySolver');
      const add = addSolver(TestSolver);
      add(solver);

      callSolverMethod({
        uuid: solver.uuid,
        method: 'syncMethod',
        args: 100,
        isAsync: false,
      });

      expect(solver.syncCalled).toBe(true);
      expect(solver.testValue).toBe(100);
    });

    it('calls an asynchronous method on the solver', async () => {
      const solver = new TestSolver('MySolver');
      const add = addSolver(TestSolver);
      add(solver);

      callSolverMethod({
        uuid: solver.uuid,
        method: 'asyncMethod',
        args: 200,
        isAsync: true,
      });

      // Wait for async method to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(solver.asyncCalled).toBe(true);
      expect(solver.testValue).toBe(200);
    });

    it('calls update method', () => {
      const solver = new TestSolver('MySolver');
      solver.update = vi.fn();

      const add = addSolver(TestSolver);
      add(solver);

      callSolverMethod({
        uuid: solver.uuid,
        method: 'update',
        args: undefined,
        isAsync: false,
      });

      expect(solver.update).toHaveBeenCalled();
    });

    it('handles errors gracefully', () => {
      const solver = new TestSolver('MySolver');
      const add = addSolver(TestSolver);
      add(solver);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation();

      // Call non-existent method
      callSolverMethod({
        uuid: solver.uuid,
        method: 'nonExistentMethod',
        args: undefined,
        isAsync: false,
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('handles calling method on non-existent solver', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation();

      callSolverMethod({
        uuid: 'non-existent-uuid',
        method: 'update',
        args: undefined,
        isAsync: false,
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getSolverKeys', () => {
    it('returns all solver UUIDs', () => {
      const solver1 = new TestSolver('Solver1');
      const solver2 = new TestSolver('Solver2');

      const add = addSolver(TestSolver);
      add(solver1);
      add(solver2);

      const keys = getSolverKeys();
      expect(keys).toContain(solver1.uuid);
      expect(keys).toContain(solver2.uuid);
      expect(keys.length).toBe(2);
    });
  });

  describe('Solver Lifecycle', () => {
    it('supports full lifecycle: add, modify, remove', () => {
      const solver = new TestSolver('LifecycleSolver');
      const add = addSolver(TestSolver);

      // Add
      add(solver);
      expect(getSolverKeys()).toContain(solver.uuid);

      // Modify
      setSolverProperty({
        uuid: solver.uuid,
        property: 'testValue',
        value: 50,
      });
      expect(solver.testValue).toBe(50);

      // Remove
      removeSolver(solver.uuid);
      expect(getSolverKeys()).not.toContain(solver.uuid);
    });

    it('solver save/restore preserves state', () => {
      const solver = new TestSolver('SaveRestoreSolver');
      solver.testValue = 123;

      const saved = solver.save();

      const restoredSolver = new TestSolver();
      restoredSolver.restore(saved);

      expect(restoredSolver.name).toBe('SaveRestoreSolver');
      expect(restoredSolver.testValue).toBe(123);
    });
  });

  describe('Immer Integration', () => {
    it('mutations through set() use Immer produce', () => {
      const solver = new TestSolver('ImmerSolver');
      const add = addSolver(TestSolver);
      add(solver);

      // Direct mutation through the set function should work via Immer
      useSolver.getState().set((draft) => {
        draft.solvers[solver.uuid].name = 'MutatedName';
      });

      expect(solver.name).toBe('MutatedName');
    });
  });
});
