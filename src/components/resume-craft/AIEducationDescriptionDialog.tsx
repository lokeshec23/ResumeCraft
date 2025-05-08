
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
import type { EducationEntry } from '@/lib/resumeTypes';
import { generateEducationDescription } from '@/ai/flows/generate-education-description-flow';
import { GenerateEducationDescriptionInputSchema, type GenerateEducationDescriptionInput } from '@/ai/schemas/educationSchemas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AIEducationDescriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  educationEntryData: Pick<EducationEntry, 'institution' | 'degree' | 'fieldOfStudy' | 'description'>;
  onDescriptionGenerated: (description: string) => void;
  children?: ReactNode; // For the trigger button
}

const DialogFormSchema = GenerateEducationDescriptionInputSchema.pick({
  tone: true,
  length: true,
  focusPoints: true,
}).extend({
  customFocusPoints: z.string().optional().describe("Comma-separated custom focus points for the AI."),
});

type DialogFormData = z.infer<typeof DialogFormSchema>;

const AIEducationDescriptionDialog: React.FC<AIEducationDescriptionDialogProps> = ({
  isOpen,
  onOpenChange,
  educationEntryData,
  onDescriptionGenerated,
  children
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);

  const form = useForm<DialogFormData>({
    resolver: zodResolver(DialogFormSchema),
    defaultValues: {
      tone: 'professional',
      length: 'medium',
      focusPoints: [],
      customFocusPoints: '',
    },
  });

 useEffect(() => {
    if (isOpen) {
      form.reset({
        tone: 'professional',
        length: 'medium',
        focusPoints: [],
        customFocusPoints: '',
      });
      setGeneratedDescription(null);
    }
  }, [isOpen, form]);

  const handleSubmit = async (data: DialogFormData) => {
    setIsLoading(true);
    setGeneratedDescription(null);

    const focusPoints = data.customFocusPoints
      ? data.customFocusPoints.split(',').map(fp => fp.trim()).filter(Boolean)
      : [];

    const input: GenerateEducationDescriptionInput = {
      institution: educationEntryData.institution,
      degree: educationEntryData.degree,
      fieldOfStudy: educationEntryData.fieldOfStudy,
      currentDescription: educationEntryData.description,
      tone: data.tone,
      length: data.length,
      focusPoints: focusPoints.length > 0 ? focusPoints : undefined,
    };

    try {
      const result = await generateEducationDescription(input);
      setGeneratedDescription(result.generatedDescription);
      toast({ title: 'Description Generated!', description: 'Review the description below.' });
    } catch (error) {
      console.error('AI Education Description Generation Error:', error);
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
            AI Education Description Generator
          </DialogTitle>
          <DialogDescription>
            Enhance the description for your education entry: {educationEntryData.degree} at {educationEntryData.institution}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="customFocusPoints">Key Achievements/Coursework (Optional)</Label>
            <Input
              id="customFocusPoints"
              placeholder="e.g., Dean's List, Thesis on AI, Capstone Project"
              {...form.register('customFocusPoints')}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Comma-separated points to highlight.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={form.watch('tone')}
                onValueChange={(value) => form.setValue('tone', value as GenerateEducationDescriptionInput['tone'])}
              >
                <SelectTrigger id="tone" className="mt-1">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="length">Length</Label>
               <Select
                value={form.watch('length')}
                onValueChange={(value) => form.setValue('length', value as GenerateEducationDescriptionInput['length'])}
              >
                <SelectTrigger id="length" className="mt-1">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (1 sentence)</SelectItem>
                  <SelectItem value="medium">Medium (1-2 sentences)</SelectItem>
                  <SelectItem value="long">Long (2-3 sentences)</SelectItem>
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
              rows={4}
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

export default AIEducationDescriptionDialog;
