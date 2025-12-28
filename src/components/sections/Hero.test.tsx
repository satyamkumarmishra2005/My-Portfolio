import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: React.PropsWithChildren<object>) => <header {...props}>{children}</header>,
    h1: ({ children, ...props }: React.PropsWithChildren<object>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.PropsWithChildren<object>) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
  },
}));

// Mock the 3D components to avoid WebGL issues in tests
vi.mock('next/dynamic', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: (_importFn: () => Promise<{ default: React.ComponentType }>, _options?: { ssr?: boolean }) => {
    // Return a mock component that renders a fallback
    const MockComponent = ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="mock-3d-scene">{children}</div>
    );
    MockComponent.displayName = 'MockDynamicComponent';
    return MockComponent;
  },
}));

// Mock the hooks
vi.mock('@/hooks/useScrollProgress', () => ({
  useScrollProgress: () => ({ progress: 0, scrollY: 0, scrollHeight: 1000, viewportHeight: 800, direction: 'none' }),
}));

describe('Hero Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Rendering', () => {
    it('renders the name correctly', () => {
      render(<Hero name="Test Name" title="Test Title" tagline="Test Tagline" />);
      // New format: "Hi, I'm [FirstName]"
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm Test");
    });

    it('renders the title correctly', () => {
      render(<Hero name="Test Name" title="Backend / Platform Engineering" tagline="Test Tagline" />);
      expect(screen.getByText('Backend / Platform Engineering')).toBeInTheDocument();
    });

    it('renders the tagline correctly', () => {
      render(<Hero name="Test Name" title="Test Title" tagline="Building scalable systems" />);
      expect(screen.getByText('Building scalable systems')).toBeInTheDocument();
    });

    it('uses default content from heroContent when no props provided', () => {
      render(<Hero />);
      // New format shows first name only in gradient
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm Satyam");
      expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    });
  });

  describe('Semantic HTML Structure', () => {
    it('renders as a section element', () => {
      render(<Hero />);
      const section = screen.getByRole('region', { name: /hero section/i });
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });

    it('has proper aria-label for accessibility', () => {
      render(<Hero />);
      expect(screen.getByLabelText(/hero section/i)).toBeInTheDocument();
    });

    it('renders h1 for the name', () => {
      render(<Hero name="Test Name" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('3D Fallback Behavior', () => {
    it('renders the 3D scene container or fallback', () => {
      render(<Hero />);
      // In test environment, the static fallback is rendered (no WebGL)
      const fallback = screen.getByLabelText('Decorative background');
      expect(fallback).toBeInTheDocument();
    });
  });
});
