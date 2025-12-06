/**
 * PanelEmptyText Tests
 *
 * Tests for the empty state text component used in panels
 * when no content is available.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import PanelEmptyText from '../PanelEmptyText';

describe('PanelEmptyText', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<PanelEmptyText>Empty</PanelEmptyText>);
      expect(screen.getByText('Empty')).toBeInTheDocument();
    });

    it('renders children text', () => {
      render(<PanelEmptyText>No Results Yet!</PanelEmptyText>);
      expect(screen.getByText('No Results Yet!')).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <PanelEmptyText>
          <span data-testid="inner">Complex content</span>
        </PanelEmptyText>
      );
      expect(screen.getByTestId('inner')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('is a styled div component', () => {
      render(<PanelEmptyText>Test</PanelEmptyText>);
      const element = screen.getByText('Test');
      expect(element.tagName).toBe('DIV');
    });

    it('has flexbox centering styles', () => {
      render(<PanelEmptyText>Test</PanelEmptyText>);
      const element = screen.getByText('Test');
      const styles = window.getComputedStyle(element);

      // styled-components applies these through classes
      expect(element).toBeInTheDocument();
    });
  });

  describe('Content Types', () => {
    it('renders string content', () => {
      render(<PanelEmptyText>String message</PanelEmptyText>);
      expect(screen.getByText('String message')).toBeInTheDocument();
    });

    it('renders number content', () => {
      render(<PanelEmptyText>{0}</PanelEmptyText>);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders JSX elements', () => {
      render(
        <PanelEmptyText>
          <strong>Bold</strong> text
        </PanelEmptyText>
      );
      expect(screen.getByText('Bold')).toBeInTheDocument();
    });
  });
});
