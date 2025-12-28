// Property-based tests for 3D interaction responsiveness
// **Feature: backend-portfolio-website, Property 1: 3D Scene Interaction Responsiveness**
// **Validates: Requirements 1.4**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as THREE from 'three';

/**
 * Since React Three Fiber components require WebGL context which isn't available
 * in jsdom, we test the core interaction logic that the NetworkGraph uses.
 * 
 * The NetworkGraph component uses:
 * 1. Mouse position normalization (-1 to 1 range)
 * 2. Scroll progress (0 to 1 range)
 * 3. Rotation interpolation based on these inputs
 * 
 * This test validates that the mathematical transformations respond correctly
 * to any valid input within the expected ranges.
 */

/**
 * Normalizes mouse position to -1 to 1 range
 * This is the same logic used in NetworkGraph's handlePointerMove
 */
function normalizeMousePosition(
  clientX: number,
  clientY: number,
  width: number,
  height: number
): { x: number; y: number } {
  const x = (clientX / width) * 2 - 1;
  const y = -(clientY / height) * 2 + 1;
  return { x, y };
}

/**
 * Calculates target rotation based on mouse position
 * This mirrors the logic in NetworkGraph's useFrame callback
 */
function calculateTargetRotation(
  mouseX: number,
  mouseY: number,
  scrollProgress: number
): { x: number; y: number } {
  const scrollRotation = scrollProgress * Math.PI * 0.25;
  return {
    x: mouseY * 0.15 + scrollRotation * 0.3,
    y: mouseX * 0.2,
  };
}

/**
 * Interpolates rotation using THREE.MathUtils.lerp
 * This mirrors the smooth interpolation in NetworkGraph
 */
function interpolateRotation(
  current: number,
  target: number,
  delta: number,
  factor: number = 2
): number {
  return THREE.MathUtils.lerp(current, target, delta * factor);
}

describe('3D Scene Interaction Properties', () => {
  /**
   * **Feature: backend-portfolio-website, Property 1: 3D Scene Interaction Responsiveness**
   * **Validates: Requirements 1.4**
   * 
   * For any mouse movement or scroll event within the 3D visualization bounds,
   * the scene state SHALL update to reflect the interaction within the same animation frame.
   */
  describe('Property 1: Scene responds to all valid interactions', () => {
    it('normalizes any mouse position within viewport to -1 to 1 range', () => {
      // Generator for viewport and mouse position together
      const viewportAndMouseArb = fc
        .record({
          width: fc.integer({ min: 320, max: 3840 }),
          height: fc.integer({ min: 240, max: 2160 }),
        })
        .chain(({ width, height }) =>
          fc.record({
            width: fc.constant(width),
            height: fc.constant(height),
            clientX: fc.integer({ min: 0, max: width }),
            clientY: fc.integer({ min: 0, max: height }),
          })
        );

      fc.assert(
        fc.property(viewportAndMouseArb, ({ width, height, clientX, clientY }) => {
          const normalized = normalizeMousePosition(clientX, clientY, width, height);

          // Normalized values should always be in -1 to 1 range
          expect(normalized.x).toBeGreaterThanOrEqual(-1);
          expect(normalized.x).toBeLessThanOrEqual(1);
          expect(normalized.y).toBeGreaterThanOrEqual(-1);
          expect(normalized.y).toBeLessThanOrEqual(1);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('produces different rotation targets for different mouse positions', () => {
      // Generator for normalized mouse positions with meaningful differences
      // Using a minimum threshold to avoid floating point precision issues
      // The threshold needs to be large enough that after multiplication by 0.15 or 0.2,
      // the result is still distinguishable from zero
      const MIN_DIFF = 1e-6;
      
      const normalizedMouseArb = fc.record({
        x: fc.double({ min: -1, max: 1, noNaN: true }),
        y: fc.double({ min: -1, max: 1, noNaN: true }),
      });

      // Generator for scroll progress
      const scrollProgressArb = fc.double({ min: 0, max: 1, noNaN: true });

      fc.assert(
        fc.property(
          normalizedMouseArb,
          normalizedMouseArb,
          scrollProgressArb,
          (mouse1, mouse2, scrollProgress) => {
            // Skip if positions are too close (within floating point precision)
            // Need to account for the multiplication factors (0.15 and 0.2)
            const dx = Math.abs(mouse1.x - mouse2.x);
            const dy = Math.abs(mouse1.y - mouse2.y);
            if (dx < MIN_DIFF && dy < MIN_DIFF) {
              return true;
            }

            const rotation1 = calculateTargetRotation(mouse1.x, mouse1.y, scrollProgress);
            const rotation2 = calculateTargetRotation(mouse2.x, mouse2.y, scrollProgress);

            // Different mouse positions should produce different rotations
            // Account for floating point precision in the comparison
            const rotationDiffX = Math.abs(rotation1.x - rotation2.x);
            const rotationDiffY = Math.abs(rotation1.y - rotation2.y);
            // The minimum expected difference is MIN_DIFF * min(0.15, 0.2) = MIN_DIFF * 0.15
            const minExpectedDiff = MIN_DIFF * 0.1;
            const isDifferent = rotationDiffX > minExpectedDiff || rotationDiffY > minExpectedDiff;
            expect(isDifferent).toBe(true);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('produces different rotation targets for different scroll positions', () => {
      // Generator for normalized mouse position
      const normalizedMouseArb = fc.record({
        x: fc.double({ min: -1, max: 1, noNaN: true }),
        y: fc.double({ min: -1, max: 1, noNaN: true }),
      });

      // Generator for distinct scroll progress values
      const distinctScrollArb = fc.tuple(
        fc.double({ min: 0, max: 0.49, noNaN: true }),
        fc.double({ min: 0.51, max: 1, noNaN: true })
      );

      fc.assert(
        fc.property(normalizedMouseArb, distinctScrollArb, (mouse, [scroll1, scroll2]) => {
          const rotation1 = calculateTargetRotation(mouse.x, mouse.y, scroll1);
          const rotation2 = calculateTargetRotation(mouse.x, mouse.y, scroll2);

          // Different scroll positions should produce different X rotations
          expect(rotation1.x).not.toBe(rotation2.x);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('interpolation moves current value toward target', () => {
      // Generator for rotation values
      const rotationArb = fc.double({ min: -Math.PI, max: Math.PI, noNaN: true });
      // Generator for delta time (typical frame times)
      const deltaArb = fc.double({ min: 0.001, max: 0.1, noNaN: true });
      
      // Epsilon for floating-point comparison - accounts for precision limits
      const EPSILON = 1e-10;

      fc.assert(
        fc.property(rotationArb, rotationArb, deltaArb, (current, target, delta) => {
          // Skip cases where current and target are too close (floating-point precision issues)
          if (Math.abs(current - target) < EPSILON) {
            return true;
          }
          
          const interpolated = interpolateRotation(current, target, delta);

          if (current < target) {
            // Should move toward target (increase), with epsilon tolerance
            expect(interpolated).toBeGreaterThanOrEqual(current - EPSILON);
            expect(interpolated).toBeLessThanOrEqual(target + EPSILON);
          } else {
            // Should move toward target (decrease), with epsilon tolerance
            expect(interpolated).toBeLessThanOrEqual(current + EPSILON);
            expect(interpolated).toBeGreaterThanOrEqual(target - EPSILON);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('rotation values stay within reasonable bounds for any input', () => {
      // Generator for extreme but valid inputs
      const extremeMouseArb = fc.record({
        x: fc.constantFrom(-1, 0, 1),
        y: fc.constantFrom(-1, 0, 1),
      });
      const extremeScrollArb = fc.constantFrom(0, 0.5, 1);

      fc.assert(
        fc.property(extremeMouseArb, extremeScrollArb, (mouse, scroll) => {
          const rotation = calculateTargetRotation(mouse.x, mouse.y, scroll);

          // Rotation values should be bounded (not infinite or NaN)
          expect(Number.isFinite(rotation.x)).toBe(true);
          expect(Number.isFinite(rotation.y)).toBe(true);

          // X rotation should be within reasonable range
          // Max: 1 * 0.15 + 1 * PI * 0.25 * 0.3 ≈ 0.385
          expect(Math.abs(rotation.x)).toBeLessThan(1);

          // Y rotation should be within reasonable range
          // Max: 1 * 0.2 = 0.2
          expect(Math.abs(rotation.y)).toBeLessThanOrEqual(0.2);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
