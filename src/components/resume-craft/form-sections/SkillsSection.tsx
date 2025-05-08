'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import type { ResumeData } from '@/lib/resumeTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const SkillsSection: React.FC = () => {
  const { control } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const addNewEntry = () => {
    append({
      id: `skill-${Date.now()}`,
      name: '',
      category: '',
    });
  };

  return (
    <div className="space-y-6">
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 border border-border/70 rounded-lg space-y-4 relative shadow-sm bg-card/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormField
              control={control}
              name={`skills.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Python, Project Management" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`skills.${index}.category`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Programming Language, Tool" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
            onClick={() => remove(index)}
            aria-label="Remove skill entry"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addNewEntry} className="w-full text-accent border-accent hover:bg-accent/10 hover:text-accent">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
      </Button>
    </div>
  );
};

export default SkillsSection;
