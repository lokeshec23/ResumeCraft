import type { ResumeData, ResumeTemplate, TemplateId } from './resumeTypes';
import DefaultTemplate from '@/components/resume-craft/templates/DefaultTemplate';
import ModernTemplate from '@/components/resume-craft/templates/ModernTemplate';

export const DEFAULT_RESUME_DATA: ResumeData = {
  personalDetails: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    portfolio: 'johndoe.dev',
    summary: 'A highly motivated and results-oriented professional with X years of experience in Y. Passionate about Z and seeking a challenging role in a dynamic organization.',
  },
  education: [
    {
      id: 'edu1',
      institution: 'University of Example',
      degree: 'B.S. in Computer Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2016',
      endDate: '2020',
      description: 'Relevant coursework: Data Structures, Algorithms, Web Development.',
    },
  ],
  experience: [
    {
      id: 'exp1',
      company: 'Tech Solutions Inc.',
      jobTitle: 'Software Engineer',
      startDate: '2020',
      endDate: 'Present',
      responsibilities: [
        '', // Default to one empty responsibility
      ],
    },
  ],
  projects: [
    {
      id: 'proj1',
      name: 'Personal Portfolio Website',
      description: 'A responsive website to showcase my projects and skills.',
      technologies: ['React', 'Next.js', 'Tailwind CSS'],
      link: 'johndoe.dev',
    },
  ],
  skills: [
    { id: 'skill1', name: 'JavaScript', category: 'Programming Languages' },
    { id: 'skill2', name: 'React', category: 'Frameworks/Libraries' },
    { id: 'skill3', name: 'Node.js', category: 'Backend' },
    { id: 'skill4', name: 'Git', category: 'Tools' },
    { id: 'skill5', name: 'Agile Methodologies', category: 'Soft Skills' },
  ],
};

export const TEMPLATES: ResumeTemplate[] = [
  {
    id: 'default',
    name: 'Classic Professional',
    component: DefaultTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/default_template/300/400',
  },
  {
    id: 'modern',
    name: 'Modern Minimalist',
    component: ModernTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/modern_template/300/400',
  },
];

export const PREVIEW_CONTAINER_ID = 'resume-preview-content';
