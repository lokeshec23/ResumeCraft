
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import type { ProjectEntry } from '@/lib/resumeTypes';
import { generateProjectDescription } from '@/ai/flows/generate-project-description-flow';
import { GenerateProjectDescriptionInputSchema, type GenerateProjectDescriptionInput } from '@/ai/schemas/projectSchemas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AIProjectDescriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectEntryData: Pick<ProjectEntry, 'name' | 'description' | 'technologies'>;
  onDescriptionGenerated: (description: string) => void;
  children?: ReactNode; 
}

const DialogFormSchema = GenerateProjectDescriptionInputSchema.pick({
  projectGoal: true,
  myRole: true,
  tone: true,
  length: true,
});

type DialogFormData = z.infer<typeof DialogFormSchema>;

const AIProjectDescriptionDialog: React.FC<AIProjectDescriptionDialogProps> = ({
  isOpen,
  onOpenChange,
  projectEntryData,
  onDescriptionGenerated,
  children
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);

  const form = useForm<DialogFormData>({
    resolver: zodResolver(DialogFormSchema),
    defaultValues: {
      projectGoal: '',
      myRole: '',
      tone: 'impact-focused',
      length: 'medium',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        projectGoal: '',
        myRole: '',
        tone: 'impact-focused',
        length: 'medium',
      });
      setGeneratedDescription(null);
    }
  }, [isOpen, form]);

  const handleSubmit = async (data: DialogFormData) => {
    setIsLoading(true);
    setGeneratedDescription(null);

    const input: GenerateProjectDescriptionInput = {
      projectName: projectEntryData.name,
      currentDescription: projectEntryData.description,
      technologiesUsed: projectEntryData.technologies,
      projectGoal: data.projectGoal,
      myRole: data.myRole,
      tone: data.tone,
      length: data.length,
    };

    try {
      const result = await generateProjectDescription(input);
      setGeneratedDescription(result.generatedDescription);
      toast({ title: 'Description Generated!', description: 'Review the project description below.' });
    } catch (error) {
      console.error('AI Project Description Generation Error:', error);
      toast({
        title: 'Error Generating Description',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDescription = () => {
    if (generatedDescription) {
      onDescriptionGenerated(generatedDescription);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-accent" />
            AI Project Description Generator
          </DialogTitle>
          <DialogDescription>
            For project: {projectEntryData.name}. Provide details to craft a compelling description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="projectGoal">Project Goal/Purpose (Optional)</Label>
            <Input
              id="projectGoal"
              placeholder="e.g., To streamline a checkout process"
              {...form.register('projectGoal')}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="myRole">Your Role/Key Contributions (Optional)</Label>
            <Input
              id="myRole"
              placeholder="e.g., Led frontend development, Designed the UI"
              {...form.register('myRole')}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={form.watch('tone')}
                onValueChange={(value) => form.setValue('tone', value as GenerateProjectDescriptionInput['tone'])}
              >
                <SelectTrigger id="tone" className="mt-1">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="impact-focused">Impact-Focused</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="length">Length</Label>
               <Select
                value={form.watch('length')}
                onValueChange={(value) => form.setValue('length', value as GenerateProjectDescriptionInput['length'])}
              >
                <SelectTrigger id="length" className="mt-1">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                  <SelectItem value="medium">Medium (2-3 sentences)</SelectItem>
                  <SelectItem value="long">Long (3-4 sentences)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Description
          </Button>
        </form>

        {generatedDescription && (
          <div className="mt-4 space-y-2 p-4 border border-dashed border-accent/50 rounded-md bg-accent/5">
            <Label className="text-base font-semibold text-primary">Generated Description:</Label>
            <Textarea
              value={generatedDescription}
              readOnly
              rows={5}
              className="bg-background"
            />
            <Button onClick={handleUseDescription} className="w-full mt-2">
              Use This Description
            </Button>
          </div>
        )}

        <DialogFooter className="mt-2 sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIProjectDescriptionDialog;
