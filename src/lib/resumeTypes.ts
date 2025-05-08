import type { ReactNode } from 'react';

export interface PersonalDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  responsibilities: string[]; // Kept as array of strings
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface SkillEntry {
  id: string;
  name: string;
  category?: string; // e.g., Programming Languages, Tools, Soft Skills
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillEntry[];
}

export type TemplateId = 'default' | 'modern';

export interface ResumeTemplateComponentProps {
  data: ResumeData;
}

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  component: React.FC<ResumeTemplateComponentProps>;
  thumbnailUrl?: string; // For visual selection
}
