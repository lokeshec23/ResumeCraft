
'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { ResumeData } from '@/lib/resumeTypes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import AISummaryGeneratorDialog from '../AISummaryGeneratorDialog';

const PersonalDetailsSection: React.FC = () => {
  const { control, watch, setValue } = useFormContext<ResumeData>();
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const currentResumeData = watch(); // Get all form data

  const handleGeneratedSummary = (summary: string) => {
    setValue('personalDetails.summary', summary, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FormField
          control={control}
          name="personalDetails.fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personalDetails.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FormField
          control={control}
          name="personalDetails.phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personalDetails.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address / Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., City, State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="personalDetails.summary"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center mb-1">
              <FormLabel>Summary / Objective</FormLabel>
              <AISummaryGeneratorDialog
                isOpen={isAiDialogOpen}
                onOpenChange={setIsAiDialogOpen}
                currentResumeData={currentResumeData}
                onSummaryGenerated={handleGeneratedSummary}
              >
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAiDialogOpen(true)}
                  className="text-accent hover:text-accent/90 hover:bg-accent/10 px-2 py-1 text-xs"
                >
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  AI Generate
                </Button>
              </AISummaryGeneratorDialog>
            </div>
            <FormControl>
              <Textarea placeholder="A brief professional summary or career objective..." {...field} rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <FormField
          control={control}
          name="personalDetails.linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile URL</FormLabel>
              <FormControl>
                <Input placeholder="linkedin.com/in/yourprofile" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personalDetails.github"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Profile URL</FormLabel>
              <FormControl>
                <Input placeholder="github.com/yourusername" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personalDetails.portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio/Website URL</FormLabel>
              <FormControl>
                <Input placeholder="yourportfolio.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PersonalDetailsSection;

    
