/**
 * TreeViewComponent Tests
 *
 * Tests for the tree view component that manages:
 * - Hierarchical data display
 * - Expand/collapse functionality
 * - Checkbox selection
 * - Delete functionality
 * - Custom styling
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TreeViewComponent from '../TreeViewComponent';

// Mock CSS import
vi.mock('../TreeViewComponent.css', () => ({}));

// Mock react-transition-group
vi.mock('react-transition-group', () => ({
  TransitionGroup: ({ children }: any) => <div data-testid="transition-group">{children}</div>,
  CSSTransition: ({ children }: any) => <div data-testid="css-transition">{children}</div>,
}));

describe('TreeViewComponent', () => {
  const mockOnUpdateCb = vi.fn();
  const mockOnCheckToggleCb = vi.fn();
  const mockOnDeleteCb = vi.fn().mockReturnValue(true);
  const mockOnExpandToggleCb = vi.fn();

  const defaultProps = {
    data: [],
    onUpdateCb: mockOnUpdateCb,
    getStyleClassCb: () => '',
    isCheckable: () => true,
    isDeletable: () => true,
    isExpandable: () => true,
    onCheckToggleCb: mockOnCheckToggleCb,
    onDeleteCb: mockOnDeleteCb,
    onExpandToggleCb: mockOnExpandToggleCb,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<TreeViewComponent {...defaultProps} />);
      expect(document.querySelector('.tree-view')).toBeInTheDocument();
    });

    it('displays no children message when data is empty', () => {
      render(<TreeViewComponent {...defaultProps} />);
      // Component shows no-children container when data is empty
      expect(document.querySelector('.tree-view-no-children')).toBeInTheDocument();
    });

    it('accepts custom noChildrenAvailableMessage prop', () => {
      render(
        <TreeViewComponent
          {...defaultProps}
          noChildrenAvailableMessage="Empty tree"
        />
      );
      // Component accepts custom message prop
      expect(document.querySelector('.tree-view-no-children')).toBeInTheDocument();
    });

    it('renders nodes when data is provided', () => {
      const data = [
        { id: '1', name: 'Node 1' },
        { id: '2', name: 'Node 2' },
      ];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      // Component renders tree-view-node elements for each data item
      const nodes = document.querySelectorAll('.tree-view-node');
      expect(nodes.length).toBe(2);
    });
  });

  describe('Checkbox Functionality', () => {
    it('renders checkbox for each node by default', () => {
      const data = [{ id: '1', name: 'Node 1' }];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('checkbox is unchecked by default', () => {
      const data = [{ id: '1', name: 'Node 1', isChecked: false }];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });

    it('checkbox reflects isChecked state', () => {
      const data = [{ id: '1', name: 'Node 1', isChecked: true }];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('calls onCheckToggleCb when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const data = [{ id: '1', name: 'Node 1', isChecked: false }];
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          onCheckToggleCb={mockOnCheckToggleCb}
        />
      );

      await user.click(screen.getByRole('checkbox'));
      expect(mockOnCheckToggleCb).toHaveBeenCalled();
    });

    it('hides checkbox when isCheckable returns false', () => {
      const data = [{ id: '1', name: 'Node 1' }];
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          isCheckable={() => false}
        />
      );

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('renders expand button by default', () => {
      const data = [{ id: '1', name: 'Node 1' }];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      expect(document.querySelector('.tree-view-triangle-btn')).toBeInTheDocument();
    });

    it('shows right arrow when node is collapsed', () => {
      const data = [{ id: '1', name: 'Node 1', isExpanded: false }];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      expect(document.querySelector('.tree-view-triangle-btn-right')).toBeInTheDocument();
    });

    it('shows down arrow when node is expanded', () => {
      const data = [{ id: '1', name: 'Node 1', isExpanded: true }];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      expect(document.querySelector('.tree-view-triangle-btn-down')).toBeInTheDocument();
    });

    it('calls onExpandToggleCb when expand button is clicked', async () => {
      const user = userEvent.setup();
      const data = [{ id: '1', name: 'Node 1', isExpanded: false }];
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          onExpandToggleCb={mockOnExpandToggleCb}
        />
      );

      const expandBtn = document.querySelector('.tree-view-triangle-btn');
      await user.click(expandBtn!);

      expect(mockOnExpandToggleCb).toHaveBeenCalled();
    });

    it('hides expand button when isExpandable returns false', () => {
      const data = [{ id: '1', name: 'Node 1' }];
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          isExpandable={() => false}
        />
      );

      expect(document.querySelector('.tree-view-triangle-btn-none')).toBeInTheDocument();
    });
  });

  describe('Delete Functionality', () => {
    it('renders delete button by default', () => {
      const data = [{ id: '1', name: 'Node 1' }];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      expect(document.querySelector('.delete-btn')).toBeInTheDocument();
    });

    it('renders custom delete element', () => {
      const data = [{ id: '1', name: 'Node 1' }];
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          deleteElement={<span data-testid="custom-delete">Delete</span>}
        />
      );

      expect(screen.getByTestId('custom-delete')).toBeInTheDocument();
    });

    it('calls onDeleteCb when delete button is clicked', async () => {
      const user = userEvent.setup();
      const data = [{ id: '1', name: 'Node 1' }];
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          onDeleteCb={mockOnDeleteCb}
        />
      );

      const deleteBtn = document.querySelector('.delete-btn');
      await user.click(deleteBtn!);

      expect(mockOnDeleteCb).toHaveBeenCalled();
    });

    it('hides delete button when isDeletable returns false', () => {
      const data = [{ id: '1', name: 'Node 1' }];
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          isDeletable={() => false}
        />
      );

      expect(document.querySelector('.delete-btn')).not.toBeInTheDocument();
    });
  });

  describe('Nested Children', () => {
    it('renders children container when node is expanded', () => {
      const data = [
        {
          id: '1',
          name: 'Parent',
          isExpanded: true,
          children: [{ id: '1-1', name: 'Child 1' }],
        },
      ];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      expect(document.querySelector('.tree-view-children-container')).toBeInTheDocument();
    });

    it('hides children when node is collapsed', () => {
      const data = [
        {
          id: '1',
          name: 'Parent',
          isExpanded: false,
          children: [{ id: '1-1', name: 'Child 1' }],
        },
      ];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      // When collapsed, children container should not be present
      expect(document.querySelector('.tree-view-children-container')).not.toBeInTheDocument();
    });

    it('renders children container when expanded', () => {
      const data = [
        {
          id: '1',
          name: 'Parent',
          isExpanded: true,
          children: [],
        },
      ];
      render(<TreeViewComponent {...defaultProps} data={data} />);

      expect(document.querySelector('.tree-view-children-container')).toBeInTheDocument();
    });
  });

  describe('Custom Keywords', () => {
    it('uses custom keywordLabel', () => {
      const data = [{ id: '1', title: 'Custom Label' }];
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          keywordLabel="title"
        />
      );

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });

    it('accepts custom keywordChildren prop', () => {
      const data = [{ id: '1', name: 'Node 1' }];
      // Component accepts keywordChildren to customize children property name
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          keywordChildren="items"
        />
      );

      expect(document.querySelector('.tree-view')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom style class from getStyleClassCb', () => {
      const data = [{ id: '1', name: 'Node 1' }];
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          getStyleClassCb={() => ' custom-class'}
        />
      );

      expect(document.querySelector('.tree-view-node.custom-class')).toBeInTheDocument();
    });
  });

  describe('Update Callback', () => {
    it('calls onUpdateCb when data changes', async () => {
      const user = userEvent.setup();
      const data = [{ id: '1', name: 'Node 1', isChecked: false }];
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
        />
      );

      await user.click(screen.getByRole('checkbox'));
      expect(mockOnUpdateCb).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('accepts loadingElement prop', () => {
      const data = [{ id: '1', name: 'Node 1' }];
      // Component accepts loadingElement prop for showing loading state
      render(
        <TreeViewComponent
          {...defaultProps}
          data={data}
          loadingElement={<div data-testid="loading">Loading...</div>}
        />
      );

      expect(document.querySelector('.tree-view')).toBeInTheDocument();
    });
  });
});
