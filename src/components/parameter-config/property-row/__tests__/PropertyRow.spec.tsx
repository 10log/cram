/**
 * PropertyRow Component Tests
 *
 * Tests for the base PropertyRow container component used throughout
 * the parameter configuration panels.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyRow from '../PropertyRow';

describe('PropertyRow', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <PropertyRow>
          <span data-testid="child">Test Child</span>
        </PropertyRow>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <PropertyRow>
          <span data-testid="child1">First</span>
          <span data-testid="child2">Second</span>
          <span data-testid="child3">Third</span>
        </PropertyRow>
      );
      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });

    it('renders text children', () => {
      render(<PropertyRow>Plain text content</PropertyRow>);
      expect(screen.getByText('Plain text content')).toBeInTheDocument();
    });

    it('renders nested elements', () => {
      render(
        <PropertyRow>
          <div>
            <span data-testid="nested">Nested content</span>
          </div>
        </PropertyRow>
      );
      expect(screen.getByTestId('nested')).toBeInTheDocument();
    });
  });

  describe('Container Structure', () => {
    it('creates a container element', () => {
      const { container } = render(
        <PropertyRow>
          <span>Content</span>
        </PropertyRow>
      );
      // The styled-component creates a div
      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInstanceOf(HTMLDivElement);
    });

    it('children are rendered inside the container', () => {
      const { container } = render(
        <PropertyRow>
          <span data-testid="content">Content</span>
        </PropertyRow>
      );
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv.querySelector('[data-testid="content"]')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders empty children without error', () => {
      expect(() => render(<PropertyRow>{null}</PropertyRow>)).not.toThrow();
    });

    it('renders with fragment children', () => {
      render(
        <PropertyRow>
          <>
            <span data-testid="frag1">Fragment 1</span>
            <span data-testid="frag2">Fragment 2</span>
          </>
        </PropertyRow>
      );
      expect(screen.getByTestId('frag1')).toBeInTheDocument();
      expect(screen.getByTestId('frag2')).toBeInTheDocument();
    });

    it('renders with conditional children', () => {
      const showSecond = true;
      render(
        <PropertyRow>
          <span data-testid="always">Always</span>
          {showSecond && <span data-testid="conditional">Conditional</span>}
        </PropertyRow>
      );
      expect(screen.getByTestId('always')).toBeInTheDocument();
      expect(screen.getByTestId('conditional')).toBeInTheDocument();
    });
  });
});
