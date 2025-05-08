'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import type { ResumeData } from '@/lib/resumeTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const EducationSection: React.FC = () => {
  const { control } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

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
                <FormLabel>Description (Optional)</FormLabel>
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
    </div>
  );
};

export default EducationSection;
