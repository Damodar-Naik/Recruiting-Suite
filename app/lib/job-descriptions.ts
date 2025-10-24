// FILE: app\lib\job-descriptions.ts

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  level: 'junior' | 'mid' | 'senior' | 'lead';
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredExperience: number;
  responsibilities: string[];
  qualifications: string[];
}

export const jobDescriptions: { [key: string]: JobDescription } = {
  frontend: {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    department: 'Engineering',
    level: 'mid',
    description: 'We are looking for a skilled Frontend Engineer to build responsive, user-friendly web applications using modern JavaScript frameworks. You will work closely with designers and backend engineers to deliver exceptional user experiences.',
    requiredSkills: [
      'JavaScript',
      'TypeScript',
      'React',
      'HTML5',
      'CSS3',
      'Responsive Design',
      'REST APIs',
      'Git'
    ],
    preferredSkills: [
      'Next.js',
      'Vue.js',
      'Angular',
      'Webpack',
      'Jest',
      'Cypress',
      'GraphQL',
      'Web Performance',
      'Accessibility'
    ],
    requiredExperience: 3,
    responsibilities: [
      'Develop responsive web applications using React and TypeScript',
      'Collaborate with UI/UX designers to implement design systems',
      'Optimize applications for maximum speed and scalability',
      'Write clean, maintainable, and testable code',
      'Participate in code reviews and technical discussions',
      'Troubleshoot and debug applications'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      'Proven experience with modern frontend frameworks',
      'Strong understanding of web fundamentals',
      'Experience with version control systems',
      'Knowledge of frontend testing strategies'
    ]
  },

  backend: {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    department: 'Engineering',
    level: 'mid',
    description: 'We seek a Backend Engineer to design, build, and maintain scalable server-side systems. You will develop APIs, work with databases, and ensure system reliability and performance.',
    requiredSkills: [
      'Node.js',
      'Python',
      'Java',
      'REST APIs',
      'SQL',
      'NoSQL',
      'Database Design',
      'API Design',
      'Git'
    ],
    preferredSkills: [
      'GraphQL',
      'Docker',
      'Kubernetes',
      'AWS',
      'Microservices',
      'Redis',
      'Message Queues',
      'System Design',
      'Performance Optimization'
    ],
    requiredExperience: 3,
    responsibilities: [
      'Design and develop scalable backend services and APIs',
      'Implement database schemas and optimize queries',
      'Build and maintain microservices architecture',
      'Ensure system security and data protection',
      'Monitor and optimize application performance',
      'Collaborate with frontend and DevOps teams'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      'Strong knowledge of backend programming languages',
      'Experience with relational and non-relational databases',
      'Understanding of system design principles',
      'Knowledge of API security best practices'
    ]
  },

  fullstack: {
    id: 'fullstack-engineer',
    title: 'Fullstack Engineer',
    department: 'Engineering',
    level: 'senior',
    description: 'We are looking for a versatile Fullstack Engineer who can work across the entire stack, from frontend UI to backend services. You will be responsible for delivering complete features and solutions.',
    requiredSkills: [
      'JavaScript/TypeScript',
      'React',
      'Node.js',
      'HTML/CSS',
      'REST APIs',
      'SQL',
      'Git',
      'System Design'
    ],
    preferredSkills: [
      'Next.js',
      'Express.js',
      'PostgreSQL',
      'MongoDB',
      'Docker',
      'AWS',
      'GraphQL',
      'Testing',
      'CI/CD'
    ],
    requiredExperience: 4,
    responsibilities: [
      'Develop end-to-end features across frontend and backend',
      'Design and implement database schemas',
      'Create responsive user interfaces',
      'Build and maintain RESTful APIs',
      'Write comprehensive tests for all components',
      'Deploy and monitor applications in production'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      'Proven fullstack development experience',
      'Strong understanding of web technologies',
      'Experience with both relational and non-relational databases',
      'Knowledge of software architecture patterns'
    ]
  },

  devops: {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    level: 'mid',
    description: 'We need a DevOps Engineer to build and maintain our cloud infrastructure, implement CI/CD pipelines, and ensure system reliability and scalability.',
    requiredSkills: [
      'Docker',
      'Kubernetes',
      'AWS/Azure/GCP',
      'CI/CD',
      'Linux',
      'Bash',
      'Infrastructure as Code',
      'Monitoring',
      'Git'
    ],
    preferredSkills: [
      'Terraform',
      'Ansible',
      'Jenkins',
      'GitLab CI',
      'Prometheus',
      'Grafana',
      'Helm',
      'Network Security',
      'Database Administration'
    ],
    requiredExperience: 3,
    responsibilities: [
      'Design and maintain cloud infrastructure',
      'Implement and optimize CI/CD pipelines',
      'Automate deployment and scaling processes',
      'Monitor system performance and reliability',
      'Ensure system security and compliance',
      'Troubleshoot production issues'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      'Experience with cloud platforms and containerization',
      'Knowledge of infrastructure as code tools',
      'Understanding of networking and security principles',
      'Experience with monitoring and logging tools'
    ]
  },

  ai_engineer: {
    id: 'ai-engineer',
    title: 'AI Engineer',
    department: 'AI/ML',
    level: 'senior',
    description: 'We are seeking an AI Engineer to develop and deploy machine learning models, work with large datasets, and build intelligent systems that solve complex business problems.',
    requiredSkills: [
      'Python',
      'Machine Learning',
      'Deep Learning',
      'TensorFlow/PyTorch',
      'Data Preprocessing',
      'SQL',
      'Statistics',
      'Git'
    ],
    preferredSkills: [
      'Natural Language Processing',
      'Computer Vision',
      'MLOps',
      'AWS SageMaker',
      'Docker',
      'Kubernetes',
      'Big Data Technologies',
      'Model Deployment',
      'A/B Testing'
    ],
    requiredExperience: 4,
    responsibilities: [
      'Develop and train machine learning models',
      'Preprocess and analyze large datasets',
      'Deploy models to production environments',
      'Optimize model performance and accuracy',
      'Collaborate with data engineers and software developers',
      'Research and implement state-of-the-art AI techniques'
    ],
    qualifications: [
      "Master's or PhD in Computer Science, AI, or related field",
      'Strong background in mathematics and statistics',
      'Experience with ML frameworks and libraries',
      'Knowledge of model deployment and monitoring',
      'Publications or projects in AI/ML field'
    ]
  }
};

// Helper functions
export const getJobDescription = (role: string): JobDescription => {
  const key = role.toLowerCase().replace(/\s+/g, '_');
  return jobDescriptions[key] || jobDescriptions.frontend;
};

export const getAllJobDescriptions = (): JobDescription[] => {
  return Object.values(jobDescriptions);
};

export const getJobDescriptionText = (role: string): string => {
  const job = getJobDescription(role);
  
  return `
Position: ${job.title}
Level: ${job.level}
Department: ${job.department}

Job Description:
${job.description}

Required Skills: ${job.requiredSkills.join(', ')}
Preferred Skills: ${job.preferredSkills.join(', ')}
Required Experience: ${job.requiredExperience} years

Key Responsibilities:
${job.responsibilities.map(resp => `• ${resp}`).join('\n')}

Qualifications:
${job.qualifications.map(qual => `• ${qual}`).join('\n')}
  `.trim();
};