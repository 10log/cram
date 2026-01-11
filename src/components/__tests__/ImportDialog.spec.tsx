/**
 * ImportDialog Tests
 *
 * Tests for the import dialog component that manages:
 * - Dialog visibility based on store state
 * - File drag and drop handling
 * - File list display
 * - Import button functionality
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImportDialog, { DROP_ALLOWED } from '../ImportDialog';
import { useAppStore } from '../../store/app-store';

// Mock MUI components
jest.mock('@mui/material', () => ({
  Dialog: ({ open, children, onClose }: any) =>
    open ? (
      <div data-testid="dialog" role="dialog">
        <button data-testid="close-button" onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogContent: ({ children }: any) => <div className="dialog-body">{children}</div>,
  DialogActions: ({ children }: any) => <div data-testid="dialog-actions">{children}</div>,
  Button: ({ children, onClick, disabled, variant, color }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  TableContainer: ({ children }: any) => <div>{children}</div>,
  TableHead: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  Paper: ({ children }: any) => <div>{children}</div>,
}));

// Mock messenger
jest.mock('../../messenger', () => ({
  messenger: {
    postMessage: jest.fn(),
  },
  on: jest.fn(() => jest.fn()),
  emit: jest.fn(),
}));

// Mock file-type
jest.mock('../../common/file-type', () => ({
  __esModule: true,
  default: {
    assoc: { obj: 'icon-obj', stl: 'icon-stl' },
    allowed: { obj: true, stl: true, txt: false },
    ICONS: { FILE: 'icon-file' },
  },
}));

// Mock dayt
jest.mock('../../common/dayt', () => ({
  mmm_dd_yyyy: (timestamp: number) => 'Jan 01, 2024',
}));

describe('ImportDialog', () => {
  const originalState = useAppStore.getState();

  beforeEach(() => {
    jest.clearAllMocks();
    useAppStore.setState({
      ...originalState,
      importDialogVisible: false,
    });
  });

  afterEach(() => {
    cleanup();
    useAppStore.setState(originalState);
  });

  describe('Visibility', () => {
    it('is hidden when importDialogVisible is false', () => {
      useAppStore.setState({ importDialogVisible: false });
      render(<ImportDialog />);
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });

    it('is visible when importDialogVisible is true', () => {
      useAppStore.setState({ importDialogVisible: true });
      render(<ImportDialog />);
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('displays dialog title', () => {
      useAppStore.setState({ importDialogVisible: true });
      render(<ImportDialog />);
      // Dialog title is rendered in an h2 element
      expect(screen.getByRole('heading', { name: 'Import' })).toBeInTheDocument();
    });
  });

  describe('Drop Zone', () => {
    beforeEach(() => {
      useAppStore.setState({ importDialogVisible: true });
    });

    it('displays drop zone text', () => {
      render(<ImportDialog />);
      expect(screen.getByText('Drag files or click to browse')).toBeInTheDocument();
    });

    it('has drop-zone class', () => {
      render(<ImportDialog />);
      const dropZone = document.querySelector('.drop-zone');
      expect(dropZone).toBeInTheDocument();
    });
  });

  describe('Import Button', () => {
    beforeEach(() => {
      useAppStore.setState({ importDialogVisible: true });
    });

    it('renders Import button', () => {
      render(<ImportDialog />);
      // Dialog has two "Import" - one in title, one as button
      const imports = screen.getAllByText('Import');
      expect(imports.length).toBe(2);
    });

    it('Import button is disabled when no files', () => {
      render(<ImportDialog />);
      // Find button by role and disabled attribute
      const buttons = screen.getAllByRole('button');
      const importButton = buttons.find(btn => btn.textContent === 'Import');
      expect(importButton).toBeDisabled();
    });
  });

  describe('Close Dialog', () => {
    beforeEach(() => {
      useAppStore.setState({ importDialogVisible: true });
    });

    it('closes when onClose is triggered', async () => {
      const user = userEvent.setup();
      render(<ImportDialog />);

      await user.click(screen.getByTestId('close-button'));

      expect(useAppStore.getState().importDialogVisible).toBe(false);
    });
  });

  describe('DROP_ALLOWED enum', () => {
    it('has NO value of 0', () => {
      expect(DROP_ALLOWED.NO).toBe(0);
    });

    it('has IDK value of 1', () => {
      expect(DROP_ALLOWED.IDK).toBe(1);
    });

    it('has YES value of 2', () => {
      expect(DROP_ALLOWED.YES).toBe(2);
    });
  });

  describe('Dialog Actions', () => {
    beforeEach(() => {
      useAppStore.setState({ importDialogVisible: true });
    });

    it('renders dialog actions container', () => {
      render(<ImportDialog />);
      expect(screen.getByTestId('dialog-actions')).toBeInTheDocument();
    });
  });
});
