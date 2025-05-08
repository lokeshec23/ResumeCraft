'use client';

import type { ReactNode } from 'react';
import type { ResumeData } from '@/lib/resumeTypes';
import PersonalDetailsSection from './form-sections/PersonalDetailsSection';
import EducationSection from './form-sections/EducationSection';
import ExperienceSection from './form-sections/ExperienceSection';
import ProjectsSection from './form-sections/ProjectsSection';
import SkillsSection from './form-sections/SkillsSection';
import { User, Briefcase, GraduationCap, Lightbulb, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormSectionConfig {
  name: string;
  icon: React.ElementType;
  component: React.FC;
  id: keyof ResumeData | 'summary'; // Use a unique ID, can map to ResumeData keys
}

const formSections: FormSectionConfig[] = [
  { name: 'Personal Details', icon: User, component: PersonalDetailsSection, id: 'personalDetails' },
  { name: 'Education', icon: GraduationCap, component: EducationSection, id: 'education' },
  { name: 'Experience', icon: Briefcase, component: ExperienceSection, id: 'experience' },
  { name: 'Projects', icon: Lightbulb, component: ProjectsSection, id: 'projects' },
  { name: 'Skills', icon: Wrench, component: SkillsSection, id: 'skills' },
];

const ResumeFormWrapper: React.FC = () => {
  return (
    <div className="space-y-6">
      {formSections.map((section) => {
        const SectionComponent = section.component;
        const SectionIcon = section.icon;
        return (
          <Card key={section.id} className="shadow-lg border-border/70">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center text-lg sm:text-xl text-primary">
                <SectionIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                {section.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <SectionComponent />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ResumeFormWrapper;
