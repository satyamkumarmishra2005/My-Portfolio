// Achievements data
// Requirements: 3.3

import { Achievement } from '@/types';

export const achievementsData: Achievement[] = [
  {
    id: 'sih-2025',
    title: 'SIH 2025 Finalist',
    event: 'Smart India Hackathon 2025',
    date: '2025',
    description: 'Selected as a finalist in Smart India Hackathon 2025',
    icon: 'trophy',
    category: 'hackathon',
    images: ['/SIH1.jpg', '/SIH2.jpeg'],
  },
  {
    id: 'ide-bootcamp',
    title: 'Secured 5th Position',
    event: 'IDE BOOTCAMP Phase 2',
    date: '2025',
    description: 'Achieved 5th position in IDE BOOTCAMP Phase 2',
    icon: 'medal',
    category: 'competition',
    images: ['/IDE1.jpeg', '/IDE2.jpeg'],
  },
];
