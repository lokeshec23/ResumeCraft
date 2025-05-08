
'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { ResumeData } from '@/lib/resumeTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Plus, X, Sparkles } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AIProjectDescriptionDialog from '../AIProjectDescriptionDialog';

const ProjectsSection: React.FC = () => {
  const { control, register, setValue, watch } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  const [aiDialogState, setAiDialogState] = useState<{isOpen: boolean, projIndex: number | null}>({isOpen: false, projIndex: null});

  const openAIDialog = (projIndex: number) => {
    setAiDialogState({isOpen: true, projIndex});
  };

  const handleGeneratedDescription = (description: string) => {
    if (aiDialogState.projIndex !== null) {
      setValue(`projects.${aiDialogState.projIndex}.description`, description, { shouldValidate: true, shouldDirty: true });
    }
  };
  
  const currentProjectEntry = aiDialogState.projIndex !== null ? watch(`projects.${aiDialogState.projIndex}`) : null;

  const addNewEntry = () => {
    append({
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [], 
      link: '',
    });
  };

  const addTechnology = (projIndex: number) => {
    const projectEntry = control.getValues(`projects.${projIndex}`);
    control.setValue(`projects.${projIndex}.technologies`, [...(projectEntry.technologies || []), '']);
  };

  const removeTechnology = (projIndex: number, techIndex: number) => {
    const projectEntry = control.getValues(`projects.${projIndex}`);
    const updatedTechnologies = (projectEntry.technologies || []).filter((_, i) => i !== techIndex);
    control.setValue(`projects.${projIndex}.technologies`, updatedTechnologies);
  };


  return (
    <div className="space-y-6">
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 border border-border/70 rounded-lg space-y-4 relative shadow-sm bg-card/50">
          <FormField
            control={control}
            name={`projects.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., E-commerce Platform" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`projects.${index}.description`}
            render={({ field }) => (
              <FormItem>
                 <div className="flex justify-between items-center mb-1">
                    <FormLabel>Description</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openAIDialog(index)}
                      className="text-accent hover:text-accent/90 hover:bg-accent/10 px-2 py-1 text-xs"
                      disabled={!watch(`projects.${index}.name`)}
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      AI Assist
                    </Button>
                </div>
                <FormControl>
                  <Textarea placeholder="Briefly describe the project, its purpose, and your role." {...field} rows={3}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormItem>
            <FormLabel>Technologies Used</FormLabel>
            <div className="space-y-2">
              {(item.technologies || []).map((_, techIndex) => ( 
                <div key={`${item.id}-tech-${techIndex}`} className="flex items-center space-x-2">
                  <Input
                    {...register(`projects.${index}.technologies.${techIndex}` as const)}
                    placeholder={`Technology ${techIndex + 1} (e.g., React, Python)`}
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => removeTechnology(index, techIndex)}
                    aria-label="Remove technology"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => addTechnology(index)} className="mt-2 text-accent border-accent/50 hover:bg-accent/10 hover:text-accent">
              <Plus className="mr-2 h-3 w-3" /> Add Technology
            </Button>
             {(control.getFieldState(`projects.${index}.technologies`)?.error) && (
                <FormMessage>{control.getFieldState(`projects.${index}.technologies`)?.error?.root?.message}</FormMessage>
            )}
          </FormItem>

          <FormField
            control={control}
            name={`projects.${index}.link`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Link (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., github.com/user/project or projectdemo.com" {...field} />
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
            aria-label="Remove project entry"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addNewEntry} className="w-full text-accent border-accent hover:bg-accent/10 hover:text-accent">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Project
      </Button>

       {currentProjectEntry && aiDialogState.projIndex !== null && (
         <AIProjectDescriptionDialog
            isOpen={aiDialogState.isOpen && aiDialogState.projIndex !== null}
            onOpenChange={(isOpen) => setAiDialogState({ isOpen, projIndex: isOpen ? aiDialogState.projIndex : null })}
            projectEntryData={{
                name: currentProjectEntry.name,
                description: currentProjectEntry.description,
                technologies: currentProjectEntry.technologies || [],
            }}
            onDescriptionGenerated={handleGeneratedDescription}
        />
      )}
    </div>
  );
};

export default ProjectsSection;
