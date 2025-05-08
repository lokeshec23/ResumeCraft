import type { ResumeData, ResumeTemplate, TemplateId } from './resumeTypes';
import DefaultTemplate from '@/components/resume-craft/templates/DefaultTemplate';
import ModernTemplate from '@/components/resume-craft/templates/ModernTemplate';
import CreativeTemplate from '@/components/resume-craft/templates/CreativeTemplate';
import TechnicalTemplate from '@/components/resume-craft/templates/TechnicalTemplate';
import ElegantTemplate from '@/components/resume-craft/templates/ElegantTemplate';
import CompactTemplate from '@/components/resume-craft/templates/CompactTemplate';
import LeftAlignedModernTemplate from '@/components/resume-craft/templates/LeftAlignedModernTemplate';
import ArtisticTemplate from '@/components/resume-craft/templates/ArtisticTemplate';


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
    thumbnailUrl: 'https://picsum.photos/seed/default_template_v2/300/400', 
    aiHint: 'classic professional',
  },
  {
    id: 'modern',
    name: 'Modern Minimalist',
    component: ModernTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/modern_template_v2/300/400',
    aiHint: 'modern minimalist',
  },
  {
    id: 'creative',
    name: 'Creative Flair',
    component: CreativeTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/creative_template_v2/300/400',
    aiHint: 'creative flair',
  },
  {
    id: 'technical',
    name: 'Developer Focus',
    component: TechnicalTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/technical_template_v2/300/400',
    aiHint: 'developer focus',
  },
  {
    id: 'elegant',
    name: 'Elegant Sophisticate',
    component: ElegantTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/elegant_template_v1/300/400',
    aiHint: 'elegant resume',
  },
  {
    id: 'compact',
    name: 'Compact Professional',
    component: CompactTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/compact_template_v1/300/400',
    aiHint: 'compact resume',
  },
  {
    id: 'left-aligned-modern',
    name: 'Sidebar Modern',
    component: LeftAlignedModernTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/sidebar_modern_v1/300/400',
    aiHint: 'sidebar modern',
  },
  {
    id: 'artistic',
    name: 'Artistic Showcase',
    component: ArtisticTemplate,
    thumbnailUrl: 'https://picsum.photos/seed/artistic_template_v1/300/400',
    aiHint: 'artistic resume',
  },
];

export const PREVIEW_CONTAINER_ID = 'resume-preview-content';
