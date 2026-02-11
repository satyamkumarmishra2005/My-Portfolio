// Project case studies data
// Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6

import { Project } from '@/types';

export const projectsData: Project[] = [
  
  {
    id: 'EazyBank',
    title: 'Eazy Bank ',
    problemStatement:
      'Traditional banking systems struggle with scalability, deployment complexity, and service reliability, making it difficult to deliver cloud-native digital banking experiences with minimal downtime.',
    architectureOverview:
      'Built a cloud-native microservices architecture with 4+ independent services (Accounts, Cards, Loans, Messaging) using Spring Cloud for configuration management, Docker/Kubernetes for containerization, and Kafka for asynchronous messaging.',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'Spring Cloud', 'Docker', 'Kubernetes', 'Kafka'],
    challengesSolved: [
      'Implemented Spring Cloud Config Server achieving 90% reduction in deployment configuration errors',
      'Containerized services with Docker and orchestrated via Kubernetes, reducing downtime by 70%',
      'Integrated Kafka for asynchronous inter-service communication and event-driven workflows',
      'Built comprehensive health checks and monitoring dashboards enabling 60% faster issue resolution',
    ],
    githubUrl: 'https://github.com/satyamkumarmishra2005/eazy-bank-Microservice',
  },
  {
    id: 'emergency-response',
    title: 'Emergency Response Management System',
    problemStatement:
      'Emergency services lacked a unified platform for citizens to report incidents and for responders to be assigned efficiently, resulting in delayed response times and poor coordination between services.',
    architectureOverview:
      'Developed a microservices-based emergency response platform with Keycloak for secure authentication, Apache Kafka for event-driven communication, and automated responder allocation based on availability and proximity.',
    techStack: ['Java', 'Spring Boot', 'Apache Kafka', 'Keycloak', 'PostgreSQL', 'Google Maps API'],
    challengesSolved: [
      'Implemented secure role-based access control (citizen, responder, admin) with Keycloak integration',
      'Built event-driven Alert Service publishing emergency events to Kafka for decoupled communication',
      'Designed automated responder allocation with status lifecycle management (Available → Assigned → Dispatched)',
      'Created Notification Service for automated email alerts on responder assignment and dispatch',
      'Integrating Google Maps API for real-time incident visualization and responder proximity tracking',
    ],
    githubUrl: 'https://github.com/satyamkumarmishra2005/emergency-response-management',
  },

  {
    id: 'medisort',
    title: 'Medisort',
    problemStatement:
      'Users struggle to manage medical prescriptions scattered across PDFs and images, leading to missed doses, delayed refills, and poor medication adherence due to lack of timely reminders and organization.',
    architectureOverview:
      'Built an intelligent medicine management system using OCR-based prescription parsing, backend scheduling for dose reminders, stock-based refill prediction, and secure cloud storage for medical documents with structured metadata',
    techStack: ['Java', 'Spring Boot',  'PostgreSQL','OCR (Tesseract)', 'AWS' ],
    challengesSolved: [
      'Automated medicine end-date calculation and refill prediction',
      'Reduced missed-dose probability using time-based and escalation reminders',
      'Enabled smart refill detection and automatic schedule recalculation',
      'Built scalable reminder workflows with user acknowledgment tracking',
      'Delivered clean, human-centric dashboard for real-time health visibility',
      'Implemented secure cloud storage for medical documents with structured metadata',
    ],
    githubUrl: 'https://github.com/satyamkumarmishra2005/Medisort-fullstack',
    // liveUrl: 'https://cache-demo.example.com',
    // diagramUrl: '/diagrams/distributed-cache-architecture.svg',
  },
];
