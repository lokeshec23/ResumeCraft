'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import type { ResumeData } from '@/lib/resumeTypes';
import PersonalDetailsSection from './form-sections/PersonalDetailsSection';
import EducationSection from './form-sections/EducationSection';
import ExperienceSection from './form-sections/ExperienceSection';
import ProjectsSection from './form-sections/ProjectsSection';
import SkillsSection from './form-sections/SkillsSection';
import { User, Briefcase, GraduationCap, Lightbulb, Wrench, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);

  const handleNext = () => {
    const nextStep = Math.min(currentStep + 1, formSections.length - 1);
    setCurrentStep(nextStep);
    setMaxVisitedStep((prevMax) => Math.max(prevMax, nextStep));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex <= maxVisitedStep) {
      setCurrentStep(stepIndex);
    }
  };

  const ActiveSectionComponent = formSections[currentStep].component;
  const CurrentSectionIcon = formSections[currentStep].icon;
  const currentSectionTitle = formSections[currentStep].name;

  return (
    <div className="space-y-6">
      {/* Stepper Navigation Indicators */}
      <div className="mb-8 p-3 sm:p-4 rounded-lg border bg-card shadow">
        <div className="flex items-start justify-between gap-1 sm:gap-2">
          {formSections.map((section, index) => (
            <React.Fragment key={section.id}>
              <button
                onClick={() => goToStep(index)}
                disabled={index > maxVisitedStep}
                className={cn(
                  "flex flex-col items-center text-center transition-colors duration-200 group w-1/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md py-1",
                  index === currentStep ? "text-accent font-semibold" : "text-muted-foreground",
                  index < currentStep ? "text-primary hover:text-primary/80" : "hover:text-foreground",
                  index > maxVisitedStep ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                )}
                aria-current={index === currentStep ? "step" : undefined}
              >
                <div
                  className={cn(
                    "rounded-full border-2 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mb-1 transition-all duration-200 shrink-0",
                    index === currentStep ? "bg-accent border-accent text-accent-foreground scale-110" : "border-border group-hover:border-muted-foreground",
                    index < currentStep ? "bg-primary border-primary text-primary-foreground" : "",
                    index > maxVisitedStep ? "bg-muted border-muted" : "group-hover:border-foreground/50"
                  )}
                >
                  {index < currentStep ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <section.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>
                <span className="text-xxs sm:text-xs leading-tight line-clamp-2">{section.name}</span>
              </button>
              {index < formSections.length - 1 && (
                <div className={cn(
                    "flex-1 h-0.5 mt-3.5 sm:mt-4 rounded-full",
                     // Line color logic
                    index < currentStep ? "bg-primary" : "bg-border" ,
                    index === currentStep && index < maxVisitedStep ? "bg-primary" : "" // Ensure line to next visited step is also primary
                  )} 
                  role="separator"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <Card className="shadow-lg border-border/70">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center text-lg sm:text-xl text-primary">
            <CurrentSectionIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            {currentSectionTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ActiveSectionComponent />
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between items-center">
        <Button onClick={handlePrev} disabled={currentStep === 0} variant="outline" className="px-6 py-2">
          Previous
        </Button>
        <p className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {formSections.length}
        </p>
        {currentStep < formSections.length - 1 ? (
          <Button onClick={handleNext} variant="default" className="px-6 py-2 bg-primary hover:bg-primary/90">
            Next
          </Button>
        ) : (
          <Button 
            onClick={() => alert("Congratulations! You've completed your resume details. (Final submission/preview step would go here)")} 
            variant="default"
            className="px-6 py-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Finish
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResumeFormWrapper;