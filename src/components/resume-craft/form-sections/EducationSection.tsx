
'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { ResumeData } from '@/lib/resumeTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Sparkles } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AIEducationDescriptionDialog from '../AIEducationDescriptionDialog';

const EducationSection: React.FC = () => {
  const { control, setValue, watch } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const [aiDialogState, setAiDialogState] = useState<{isOpen: boolean, index: number | null}>({isOpen: false, index: null});

  const openAIDialog = (index: number) => {
    setAiDialogState({isOpen: true, index});
  };

  const handleGeneratedDescription = (description: string) => {
    if (aiDialogState.index !== null) {
      setValue(`education.${aiDialogState.index}.description`, description, { shouldValidate: true, shouldDirty: true });
    }
  };

  const currentEducationEntry = aiDialogState.index !== null ? watch(`education.${aiDialogState.index}`) : null;


  const addNewEntry = () => {
    append({
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  return (
    <div className="space-y-6">
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 border border-border/70 rounded-lg space-y-4 relative shadow-sm bg-card/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`education.${index}.institution`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., University of California, Berkeley" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`education.${index}.degree`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bachelor of Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name={`education.${index}.fieldOfStudy`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field of Study</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`education.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sep 2018 or 2018" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`education.${index}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., May 2022 or Present" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name={`education.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center mb-1">
                  <FormLabel>Description (Optional)</FormLabel>
                   <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openAIDialog(index)}
                      className="text-accent hover:text-accent/90 hover:bg-accent/10 px-2 py-1 text-xs"
                      disabled={!watch(`education.${index}.institution`) || !watch(`education.${index}.degree`)}
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      AI Assist
                    </Button>
                </div>
                <FormControl>
                  <Textarea placeholder="e.g., Relevant coursework, honors, GPA (if noteworthy)" {...field} rows={2}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
            onClick={() => remove(index)}
            aria-label="Remove education entry"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addNewEntry} className="w-full text-accent border-accent hover:bg-accent/10 hover:text-accent">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Education
      </Button>

      {currentEducationEntry && aiDialogState.index !== null && (
        <AIEducationDescriptionDialog
          isOpen={aiDialogState.isOpen && aiDialogState.index !== null}
          onOpenChange={(isOpen) => setAiDialogState({ isOpen, index: isOpen ? aiDialogState.index : null })}
          educationEntryData={{
            institution: currentEducationEntry.institution,
            degree: currentEducationEntry.degree,
            fieldOfStudy: currentEducationEntry.fieldOfStudy,
            description: currentEducationEntry.description,
          }}
          onDescriptionGenerated={handleGeneratedDescription}
        />
      )}
    </div>
  );
};

export default EducationSection;
