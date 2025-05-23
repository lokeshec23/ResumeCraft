
'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { ResumeData } from '@/lib/resumeTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Plus, X, Sparkles } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AIResponsibilityGeneratorDialog from '../AIResponsibilityGeneratorDialog';

const ExperienceSection: React.FC = () => {
  const { control, register, setValue, watch } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  const [aiDialogState, setAiDialogState] = useState<{isOpen: boolean, expIndex: number | null}>({isOpen: false, expIndex: null});

  const allSkills = watch('skills');

  const openAIDialog = (expIndex: number) => {
    setAiDialogState({isOpen: true, expIndex});
  };

  const handleGeneratedResponsibilities = (newResponsibilities: string[]) => {
    if (aiDialogState.expIndex !== null) {
      const currentResponsibilities = watch(`experience.${aiDialogState.expIndex}.responsibilities`) || [];
      setValue(`experience.${aiDialogState.expIndex}.responsibilities`, [...currentResponsibilities, ...newResponsibilities], { shouldValidate: true, shouldDirty: true });
    }
  };
  
  const currentExperienceEntry = aiDialogState.expIndex !== null ? watch(`experience.${aiDialogState.expIndex}`) : null;


  const addNewEntry = () => {
    append({
      id: `exp-${Date.now()}`,
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      responsibilities: [], 
    });
  };

  const addResponsibility = (expIndex: number) => {
    const experienceEntry = control.getValues(`experience.${expIndex}`);
    control.setValue(`experience.${expIndex}.responsibilities`, [...(experienceEntry.responsibilities || []), '']);
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    const experienceEntry = control.getValues(`experience.${expIndex}`);
    const updatedResponsibilities = (experienceEntry.responsibilities || []).filter((_, i) => i !== respIndex);
    control.setValue(`experience.${expIndex}.responsibilities`, updatedResponsibilities);
  };


  return (
    <div className="space-y-6">
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 border border-border/70 rounded-lg space-y-4 relative shadow-sm bg-card/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`experience.${index}.company`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Google" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`experience.${index}.jobTitle`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`experience.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jan 2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`experience.${index}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dec 2022 or Present" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormItem>
             <div className="flex justify-between items-center mb-1">
                <FormLabel>Responsibilities</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => openAIDialog(index)}
                  className="text-accent hover:text-accent/90 hover:bg-accent/10 px-2 py-1 text-xs"
                  disabled={!watch(`experience.${index}.jobTitle`) || !watch(`experience.${index}.company`)}
                >
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  AI Assist
                </Button>
            </div>
            <div className="space-y-2">
              {(item.responsibilities || []).map((_, respIndex) => ( 
                <div key={`${item.id}-resp-${respIndex}`} className="flex items-start space-x-2"> 
                  <Textarea
                    {...register(`experience.${index}.responsibilities.${respIndex}` as const)}
                    placeholder={`Responsibility ${respIndex + 1}`}
                    className="flex-grow"
                    rows={2} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 shrink-0 mt-1"
                    onClick={() => removeResponsibility(index, respIndex)}
                    aria-label="Remove responsibility"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => addResponsibility(index)} className="mt-2 text-accent border-accent/50 hover:bg-accent/10 hover:text-accent">
              <Plus className="mr-2 h-3 w-3" /> Add Responsibility
            </Button>
             {(control.getFieldState(`experience.${index}.responsibilities`)?.error) && (
              <FormMessage>{control.getFieldState(`experience.${index}.responsibilities`)?.error?.root?.message}</FormMessage>
            )}
          </FormItem>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
            onClick={() => remove(index)}
            aria-label="Remove experience entry"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addNewEntry} className="w-full text-accent border-accent hover:bg-accent/10 hover:text-accent">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
      </Button>

      {currentExperienceEntry && aiDialogState.expIndex !== null && (
         <AIResponsibilityGeneratorDialog
            isOpen={aiDialogState.isOpen && aiDialogState.expIndex !== null}
            onOpenChange={(isOpen) => setAiDialogState({ isOpen, expIndex: isOpen ? aiDialogState.expIndex : null })}
            experienceEntryData={{
                jobTitle: currentExperienceEntry.jobTitle,
                company: currentExperienceEntry.company,
                responsibilities: currentExperienceEntry.responsibilities || [],
            }}
            allSkills={allSkills || []}
            onResponsibilitiesGenerated={handleGeneratedResponsibilities}
        />
      )}
    </div>
  );
};

export default ExperienceSection;
