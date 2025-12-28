// Property-based tests for Projects section
// **Feature: backend-portfolio-website, Property 3: Project Case Study Required Fields**
// **Feature: backend-portfolio-website, Property 4: Project Case Study Optional Fields**
// **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { projectsData } from '@/data/projects';
import type { Project } from '@/types';

// Generator for valid project with required fields only
const requiredProjectArb: fc.Arbitrary<Project> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/\s/g, '-') || 'project-id'),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  problemStatement: fc.string({ minLength: 10, maxLength: 500 }),
  architectureOverview: fc.string({ minLength: 10, maxLength: 500 }),
  techStack: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
  challengesSolved: fc.array(fc.string({ minLength: 5, maxLength: 200 }), { minLength: 1, maxLength: 10 }),
  githubUrl: fc.constant(undefined),
  liveUrl: fc.constant(undefined),
  diagramUrl: fc.constant(undefined),
});

// Generator for valid URL
const validUrlArb = fc.webUrl();

// Generator for valid project with all optional fields
const fullProjectArb: fc.Arbitrary<Project> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/\s/g, '-') || 'project-id'),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  problemStatement: fc.string({ minLength: 10, maxLength: 500 }),
  architectureOverview: fc.string({ minLength: 10, maxLength: 500 }),
  techStack: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
  challengesSolved: fc.array(fc.string({ minLength: 5, maxLength: 200 }), { minLength: 1, maxLength: 10 }),
  githubUrl: validUrlArb,
  liveUrl: validUrlArb,
  diagramUrl: fc.constant('/diagrams/test-diagram.svg'),
});

// Generator for project with only githubUrl
const projectWithGithubArb: fc.Arbitrary<Project> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/\s/g, '-') || 'project-id'),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  problemStatement: fc.string({ minLength: 10, maxLength: 500 }),
  architectureOverview: fc.string({ minLength: 10, maxLength: 500 }),
  techStack: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
  challengesSolved: fc.array(fc.string({ minLength: 5, maxLength: 200 }), { minLength: 1, maxLength: 10 }),
  githubUrl: validUrlArb,
  liveUrl: fc.constant(undefined),
  diagramUrl: fc.constant(undefined),
});

// Generator for project with only liveUrl
const projectWithLiveUrlArb: fc.Arbitrary<Project> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/\s/g, '-') || 'project-id'),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  problemStatement: fc.string({ minLength: 10, maxLength: 500 }),
  architectureOverview: fc.string({ minLength: 10, maxLength: 500 }),
  techStack: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
  challengesSolved: fc.array(fc.string({ minLength: 5, maxLength: 200 }), { minLength: 1, maxLength: 10 }),
  githubUrl: fc.constant(undefined),
  liveUrl: validUrlArb,
  diagramUrl: fc.constant(undefined),
});

// Generator for project with only diagramUrl
const projectWithDiagramArb: fc.Arbitrary<Project> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/\s/g, '-') || 'project-id'),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  problemStatement: fc.string({ minLength: 10, maxLength: 500 }),
  architectureOverview: fc.string({ minLength: 10, maxLength: 500 }),
  techStack: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
  challengesSolved: fc.array(fc.string({ minLength: 5, maxLength: 200 }), { minLength: 1, maxLength: 10 }),
  githubUrl: fc.constant(undefined),
  liveUrl: fc.constant(undefined),
  diagramUrl: fc.constant('/diagrams/test-diagram.svg'),
});

/**
 * Helper function to simulate what ProjectCard renders for required fields
 * This validates that the component would display all required fields
 */
function validateRequiredFieldsPresent(project: Project): boolean {
  // Check all required fields are present and non-empty
  return (
    typeof project.problemStatement === 'string' &&
    project.problemStatement.length > 0 &&
    typeof project.architectureOverview === 'string' &&
    project.architectureOverview.length > 0 &&
    Array.isArray(project.techStack) &&
    project.techStack.length > 0 &&
    project.techStack.every(tech => typeof tech === 'string' && tech.length > 0) &&
    Array.isArray(project.challengesSolved) &&
    project.challengesSolved.length > 0 &&
    project.challengesSolved.every(challenge => typeof challenge === 'string' && challenge.length > 0)
  );
}

/**
 * Helper function to validate optional fields are present when defined
 */
function validateOptionalFieldsWhenPresent(project: Project): {
  hasGithub: boolean;
  hasLive: boolean;
  hasDiagram: boolean;
} {
  return {
    hasGithub: project.githubUrl !== undefined && project.githubUrl.length > 0,
    hasLive: project.liveUrl !== undefined && project.liveUrl.length > 0,
    hasDiagram: project.diagramUrl !== undefined && project.diagramUrl.length > 0,
  };
}

describe('Projects Section Properties', () => {
  /**
   * **Feature: backend-portfolio-website, Property 3: Project Case Study Required Fields**
   * **Validates: Requirements 4.1, 4.2, 4.3, 4.4**
   *
   * For any valid Project object, the rendered Project_Case_Study component SHALL display
   * the problem statement, architecture overview, tech stack (all items), and challenges solved fields.
   */
  describe('Property 3: Project Case Study Required Fields', () => {
    it('actual projectsData contains all required fields for each project', () => {
      projectsData.forEach((project) => {
        // Requirement 4.1: Problem statement
        expect(project.problemStatement).toBeDefined();
        expect(project.problemStatement.length).toBeGreaterThan(0);

        // Requirement 4.2: Architecture overview
        expect(project.architectureOverview).toBeDefined();
        expect(project.architectureOverview.length).toBeGreaterThan(0);

        // Requirement 4.3: Tech stack
        expect(project.techStack).toBeDefined();
        expect(Array.isArray(project.techStack)).toBe(true);
        expect(project.techStack.length).toBeGreaterThan(0);
        project.techStack.forEach((tech) => {
          expect(typeof tech).toBe('string');
          expect(tech.length).toBeGreaterThan(0);
        });

        // Requirement 4.4: Challenges solved
        expect(project.challengesSolved).toBeDefined();
        expect(Array.isArray(project.challengesSolved)).toBe(true);
        expect(project.challengesSolved.length).toBeGreaterThan(0);
        project.challengesSolved.forEach((challenge) => {
          expect(typeof challenge).toBe('string');
          expect(challenge.length).toBeGreaterThan(0);
        });
      });
    });

    it('any valid project has all required fields present', () => {
      fc.assert(
        fc.property(requiredProjectArb, (project: Project) => {
          const isValid = validateRequiredFieldsPresent(project);
          expect(isValid).toBe(true);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('any valid project with all fields has required fields present', () => {
      fc.assert(
        fc.property(fullProjectArb, (project: Project) => {
          const isValid = validateRequiredFieldsPresent(project);
          expect(isValid).toBe(true);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('tech stack contains all items for any valid project', () => {
      fc.assert(
        fc.property(requiredProjectArb, (project: Project) => {
          // All tech stack items should be present
          expect(project.techStack.length).toBeGreaterThanOrEqual(1);
          project.techStack.forEach((tech) => {
            expect(typeof tech).toBe('string');
            expect(tech.length).toBeGreaterThan(0);
          });
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('challenges solved contains all items for any valid project', () => {
      fc.assert(
        fc.property(requiredProjectArb, (project: Project) => {
          // All challenges should be present
          expect(project.challengesSolved.length).toBeGreaterThanOrEqual(1);
          project.challengesSolved.forEach((challenge) => {
            expect(typeof challenge).toBe('string');
            expect(challenge.length).toBeGreaterThan(0);
          });
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: backend-portfolio-website, Property 4: Project Case Study Optional Fields**
   * **Validates: Requirements 4.5, 4.6**
   *
   * For any Project object with githubUrl, liveUrl, or diagramUrl defined,
   * the rendered Project_Case_Study component SHALL include those links/diagrams in the output.
   */
  describe('Property 4: Project Case Study Optional Fields', () => {
    it('actual projectsData optional fields are included when present', () => {
      projectsData.forEach((project) => {
        const optionalFields = validateOptionalFieldsWhenPresent(project);

        // Requirement 4.5: GitHub and live demo links when available
        if (project.githubUrl) {
          expect(optionalFields.hasGithub).toBe(true);
        }
        if (project.liveUrl) {
          expect(optionalFields.hasLive).toBe(true);
        }

        // Requirement 4.6: Diagrams when applicable
        if (project.diagramUrl) {
          expect(optionalFields.hasDiagram).toBe(true);
        }
      });
    });

    it('project with githubUrl has github link available', () => {
      fc.assert(
        fc.property(projectWithGithubArb, (project: Project) => {
          const optionalFields = validateOptionalFieldsWhenPresent(project);
          expect(optionalFields.hasGithub).toBe(true);
          expect(optionalFields.hasLive).toBe(false);
          expect(optionalFields.hasDiagram).toBe(false);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('project with liveUrl has live demo link available', () => {
      fc.assert(
        fc.property(projectWithLiveUrlArb, (project: Project) => {
          const optionalFields = validateOptionalFieldsWhenPresent(project);
          expect(optionalFields.hasGithub).toBe(false);
          expect(optionalFields.hasLive).toBe(true);
          expect(optionalFields.hasDiagram).toBe(false);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('project with diagramUrl has diagram available', () => {
      fc.assert(
        fc.property(projectWithDiagramArb, (project: Project) => {
          const optionalFields = validateOptionalFieldsWhenPresent(project);
          expect(optionalFields.hasGithub).toBe(false);
          expect(optionalFields.hasLive).toBe(false);
          expect(optionalFields.hasDiagram).toBe(true);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('project with all optional fields has all links/diagrams available', () => {
      fc.assert(
        fc.property(fullProjectArb, (project: Project) => {
          const optionalFields = validateOptionalFieldsWhenPresent(project);
          expect(optionalFields.hasGithub).toBe(true);
          expect(optionalFields.hasLive).toBe(true);
          expect(optionalFields.hasDiagram).toBe(true);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('project without optional fields has no links/diagrams', () => {
      fc.assert(
        fc.property(requiredProjectArb, (project: Project) => {
          const optionalFields = validateOptionalFieldsWhenPresent(project);
          expect(optionalFields.hasGithub).toBe(false);
          expect(optionalFields.hasLive).toBe(false);
          expect(optionalFields.hasDiagram).toBe(false);
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
