/**
 * SaveDialog Tests
 *
 * Tests for the save dialog component that manages:
 * - Dialog visibility based on store state
 * - File name input
 * - Cancel and Save button actions
 */

import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveDialog } from '../SaveDialog';
import { useAppStore } from '../../store/app-store';

// Mock MUI Dialog components
vi.mock('@mui/material', () => ({
  Dialog: ({ open, children }: any) =>
    open ? (
      <div data-testid="dialog" role="dialog">
        {children}
      </div>
    ) : null,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogContent: ({ children }: any) => <div className="dialog-body">{children}</div>,
  DialogActions: ({ children }: any) => <div className="dialog-footer">{children}</div>,
  Button: ({ children, onClick, color, variant }: any) => (
    <button onClick={onClick} data-intent={color}>
      {children}
    </button>
  ),
  TextField: ({ label, value, onChange, ...props }: any) => (
    <input
      aria-label={label}
      value={value}
      onChange={(e) => onChange && onChange(e)}
      {...props}
    />
  ),
}));

// Mock messenger
vi.mock('../../messenger', () => ({
  on: vi.fn(() => vi.fn()),
  emit: vi.fn(),
}));

describe('SaveDialog', () => {
  const originalState = useAppStore.getState();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store
    useAppStore.setState({
      ...originalState,
      projectName: 'test-project',
      saveDialogVisible: false,
    });
  });

  afterEach(() => {
    cleanup();
    useAppStore.setState(originalState);
  });

  describe('Visibility', () => {
    it('is hidden when saveDialogVisible is false', () => {
      useAppStore.setState({ saveDialogVisible: false });
      render(<SaveDialog />);
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });

    it('is visible when saveDialogVisible is true', () => {
      useAppStore.setState({ saveDialogVisible: true });
      render(<SaveDialog />);
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('displays dialog title', () => {
      useAppStore.setState({ saveDialogVisible: true });
      render(<SaveDialog />);
      expect(screen.getByText('Save Project')).toBeInTheDocument();
    });
  });

  describe('File Name Input', () => {
    beforeEach(() => {
      useAppStore.setState({ saveDialogVisible: true, projectName: 'my-project' });
    });

    it('displays input field', () => {
      render(<SaveDialog />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('initializes with project name from store', () => {
      render(<SaveDialog />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('my-project');
    });

    it('updates value on user input', async () => {
      const user = userEvent.setup();
      render(<SaveDialog />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.clear(input);
      await user.type(input, 'new-project-name');

      expect(input.value).toBe('new-project-name');
    });
  });

  describe('Cancel Button', () => {
    beforeEach(() => {
      useAppStore.setState({ saveDialogVisible: true });
    });

    it('renders Cancel button', () => {
      render(<SaveDialog />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('closes dialog when Cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<SaveDialog />);

      await user.click(screen.getByText('Cancel'));

      expect(useAppStore.getState().saveDialogVisible).toBe(false);
    });
  });

  describe('Save Button', () => {
    beforeEach(() => {
      useAppStore.setState({ saveDialogVisible: true });
    });

    it('renders Save button', () => {
      render(<SaveDialog />);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('has success intent', () => {
      render(<SaveDialog />);
      const saveButton = screen.getByText('Save');
      expect(saveButton).toHaveAttribute('data-intent', 'success');
    });

    it('emits SAVE event when clicked', async () => {
      const { emit } = await import('../../messenger');
      const user = userEvent.setup();
      render(<SaveDialog />);

      await user.click(screen.getByText('Save'));

      expect(emit).toHaveBeenCalledWith('SAVE', expect.any(Function));
    });
  });

  describe('Dialog Structure', () => {
    beforeEach(() => {
      useAppStore.setState({ saveDialogVisible: true });
    });

    it('contains dialog body with input', () => {
      render(<SaveDialog />);
      const body = document.querySelector('.dialog-body');
      expect(body).toBeInTheDocument();
      expect(body?.querySelector('input')).toBeInTheDocument();
    });

    it('contains dialog footer with buttons', () => {
      render(<SaveDialog />);
      const footer = document.querySelector('.dialog-footer');
      expect(footer).toBeInTheDocument();
    });
  });
});
