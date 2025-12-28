// Skills categorization data
// Requirements: 3.1, 3.2, 3.3, 3.4, 3.5

import { SkillCategory } from '@/types';

export const skillsData: SkillCategory[] = [
  {
    id: 'backend',
    name: 'Backend',
    skills: [
      { name: 'Java / Spring Boot', icon: 'java', proficiency: 90 },
      { name: 'REST APIs', icon: 'api', proficiency: 95 },
      { name: 'Microservices', icon: 'microservices', proficiency: 85 },
      { name: 'Security', icon: 'security', proficiency: 80 },
    ],
  },
  {
    id: 'databases',
    name: 'Databases',
    skills: [
      { name: 'PostgreSQL', icon: 'postgresql', proficiency: 90 },
      { name: 'MySQL', icon: 'mysql', proficiency: 85 },
      { name: 'Redis', icon: 'redis', proficiency: 80 },
    ],
  },
  {
    id: 'system-design',
    name: 'System Design',
    skills: [
      { name: 'Caching', icon: 'cache', proficiency: 85 },
      { name: 'Load Balancing', icon: 'loadbalancer', proficiency: 80 },
      { name: 'Messaging', icon: 'messaging', proficiency: 85 },
      { name: 'Observability', icon: 'observability', proficiency: 80 },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    skills: [
      { name: 'Docker', icon: 'docker', proficiency: 85 },
      { name: 'Jenkins', icon: 'jenkins', proficiency: 80 },
      { name: 'AWS', icon: 'aws', proficiency: 75 },
      { name: 'Kubernetes', icon: 'kubernetes', proficiency: 70 },
    ],
  },
];
