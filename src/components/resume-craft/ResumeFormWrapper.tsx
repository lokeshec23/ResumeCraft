'use client';

import type { Control } from 'react-hook-form';
import type { ResumeData } from '@/lib/resumeTypes';
import { Accordion } from '@/components/ui/accordion';
import SectionWrapper from './form-sections/SectionWrapper';
import PersonalDetailsSection from './form-sections/PersonalDetailsSection';
import EducationSection from './form-sections/EducationSection';
import ExperienceSection from './form-sections/ExperienceSection';
import ProjectsSection from './form-sections/ProjectsSection';
import SkillsSection from './form-sections/SkillsSection';
import { User, Briefcase, GraduationCap, Lightbulb, Wrench } from 'lucide-react';

interface ResumeFormWrapperProps {
  control: Control<ResumeData>;
}

const ResumeFormWrapper: React.FC<ResumeFormWrapperProps> = ({ control }) => {
  return (
    <Accordion type="multiple" defaultValue={['personalDetails']} className="w-full space-y-1">
      <SectionWrapper title="Personal Details" icon={User} value="personalDetails">
        <PersonalDetailsSection />
      </SectionWrapper>
      <SectionWrapper title="Education" icon={GraduationCap} value="education">
        <EducationSection />
      </SectionWrapper>
      <SectionWrapper title="Experience" icon={Briefcase} value="experience">
        <ExperienceSection />
      </SectionWrapper>
      <SectionWrapper title="Projects" icon={Lightbulb} value="projects">
        <ProjectsSection />
      </SectionWrapper>
      <SectionWrapper title="Skills" icon={Wrench} value="skills">
        <SkillsSection />
      </SectionWrapper>
    </Accordion>
  );
};

export default ResumeFormWrapper;
