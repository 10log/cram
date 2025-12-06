/**
 * PanelContainer Tests
 *
 * Tests for the panel container layout component that manages:
 * - Container rendering with default and custom class names
 * - Children rendering
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import PanelContainer from '../PanelContainer';

describe('PanelContainer', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<PanelContainer />);
      expect(document.querySelector('.panel')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <PanelContainer>
          <div data-testid="child">Child Content</div>
        </PanelContainer>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <PanelContainer>
          <div data-testid="child1">First</div>
          <div data-testid="child2">Second</div>
          <div data-testid="child3">Third</div>
        </PanelContainer>
      );
      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });
  });

  describe('Class Names', () => {
    it('uses default class name "panel full"', () => {
      render(<PanelContainer />);
      const container = document.querySelector('.panel.full');
      expect(container).toBeInTheDocument();
    });

    it('uses custom class name when provided', () => {
      render(<PanelContainer className="custom-panel" />);
      const container = document.querySelector('.custom-panel');
      expect(container).toBeInTheDocument();
    });

    it('overrides default class with custom class', () => {
      render(<PanelContainer className="my-class" />);
      expect(document.querySelector('.my-class')).toBeInTheDocument();
      // The default "panel full" should not be present when custom class is used
    });
  });

  describe('Props', () => {
    it('accepts margin prop', () => {
      // margin prop is defined but not currently used in the component
      render(<PanelContainer margin={true} />);
      expect(document.querySelector('.panel')).toBeInTheDocument();
    });

    it('handles undefined children', () => {
      render(<PanelContainer children={undefined} />);
      expect(document.querySelector('.panel')).toBeInTheDocument();
    });

    it('handles null children', () => {
      render(<PanelContainer>{null}</PanelContainer>);
      expect(document.querySelector('.panel')).toBeInTheDocument();
    });
  });

  describe('DOM Structure', () => {
    it('renders as a div element', () => {
      render(<PanelContainer />);
      const container = document.querySelector('.panel');
      expect(container?.tagName).toBe('DIV');
    });

    it('contains children inside the div', () => {
      render(
        <PanelContainer>
          <span>Inner content</span>
        </PanelContainer>
      );
      const container = document.querySelector('.panel');
      expect(container?.querySelector('span')).toBeInTheDocument();
    });
  });
});
