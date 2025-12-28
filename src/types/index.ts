// TypeScript interfaces for Portfolio Website

/**
 * Represents a project case study with problem, architecture, and solutions
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */
export interface Project {
  id: string;
  title: string;
  problemStatement: string;
  architectureOverview: string;
  techStack: string[];
  challengesSolved: string[];
  githubUrl?: string;
  liveUrl?: string;
  diagramUrl?: string;
}

/**
 * Represents a single skill with proficiency level
 */
export interface Skill {
  name: string;
  icon: string;
  proficiency: number; // 0-100
}

/**
 * Represents a category of skills (Backend, Databases, etc.)
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */
export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

/**
 * Represents a work experience entry with scale, complexity, and impact
 * Requirements: 5.2
 */
export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  scale: string;
  complexity: string;
  impact: string[];
}

/**
 * Contact form submission data
 * Requirements: 6.3, 6.4
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Contact form validation result
 */
export interface ContactFormValidation {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    message?: string;
  };
}

/**
 * Props for 3D scene components
 */
export interface ThreeSceneProps {
  enableInteraction: boolean;
  quality: 'high' | 'medium' | 'low';
}

/**
 * Data for network graph nodes in 3D visualization
 */
export interface NodeData {
  id: string;
  position: [number, number, number];
  connections: string[];
  label?: string;
}

/**
 * Represents a notable accomplishment, award, or recognition
 * Requirements: 3.1, 3.2
 */
export interface Achievement {
  id: string;
  title: string;
  event: string;
  date: string;
  description: string;
  icon?: string;
  link?: string;
  category?: 'hackathon' | 'competition' | 'certification' | 'award';
  images?: string[]; // Array of image paths for gallery
}
