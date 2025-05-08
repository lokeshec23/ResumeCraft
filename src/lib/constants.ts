import type { ResumeData, ResumeTemplate, TemplateId } from './resumeTypes';
import DefaultTemplate from '@/components/resume-craft/templates/DefaultTemplate';
import ModernTemplate from '@/components/resume-craft/templates/ModernTemplate';
import CreativeTemplate from '@/components/resume-craft/templates/CreativeTemplate';
import TechnicalTemplate from '@/components/resume-craft/templates/TechnicalTemplate';

export const DEFAULT_RESUME_DATA: ResumeData = {
  personalDetails: {
    fullName: '', // John Doe
    email: '', // john.doe@example.com
    phoneNumber: '', // 123-456-7890
    address: '', // 123 Main St, Anytown, USA
    linkedin: '', // linkedin.com/in/johndoe
    github: '', // github.com/johndoe
    portfolio: '', // johndoe.dev
    summary: '', // A highly motivated and results-oriented professional...
  },
  education: [
    // {
    //   id: 'edu1',
    //   institution: 'University of Example',
    //   degree: 'B.S. in Computer Science',
    //   fieldOfStudy: 'Computer Science',
    //   startDate: '2016',
    //   endDate: '2020',
    //   description: 'Relevant coursework: Data Structures, Algorithms, Web Development.',
    // },
  ],
  experience: [
    // {
    //   id: 'exp1',
    //   company: 'Tech Solutions Inc.',
    //   jobTitle: 'Software Engineer',
    //   startDate: '2020',
    //   endDate: 'Present',
    //   responsibilities: [
    //     '', // Default to one empty responsibility
    //   ],
    // },
  ],
  projects: [
    // {
    //   id: 'proj1',
    //   name: 'Personal Portfolio Website',
    //   description: 'A responsive website to showcase my projects and skills.',
    //   technologies: ['React', 'Next.js', 'Tailwind CSS'],
    //   link: 'johndoe.dev',
    // },
  ],
  skills: [
    // { id: 'skill1', name: 'JavaScript', category: 'Programming Languages' },
    // { id: 'skill2', name: 'React', category: 'Frameworks/Libraries' },
    // { id: 'skill3', name: 'Node.js', category: 'Backend' },
    // { id: 'skill4', name: 'Git', category: 'Tools' },
    // { id: 'skill5', name: 'Agile Methodologies', category: 'Soft Skills' },
  ],
};

export const TEMPLATES: ResumeTemplate[] = [
  {
    id: 'default',
    name: 'Classic Professional',
    component: DefaultTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/default_template_v1/300/400', // Updated seed for potentially new image
  },
  {
    id: 'modern',
    name: 'Modern Minimalist',
    component: ModernTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/modern_template_v1/300/400', // Updated seed
  },
  {
    id: 'creative',
    name: 'Creative Flair',
    component: CreativeTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/creative_template_v1/300/400',
  },
  {
    id: 'technical',
    name: 'Developer Focus',
    component: TechnicalTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/technical_template_v1/300/400',
  },
];

export const PREVIEW_CONTAINER_ID = 'resume-preview-content';
