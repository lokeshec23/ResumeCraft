
'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
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
import type { ResumeData } from '@/lib/resumeTypes';
import { generateResumeSummary } from '@/ai/flows/generate-summary-flow';
import { GenerateSummaryInputSchema, type GenerateSummaryInput } from '@/ai/schemas/summarySchemas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface AISummaryGeneratorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentResumeData: ResumeData;
  onSummaryGenerated: (summary: string) => void;
  children?: ReactNode; // For the trigger button
}

// Refine Zod schema for form within the dialog
const DialogFormSchema = GenerateSummaryInputSchema.pick({
  targetRole: true,
  tone: true,
  lengthPreference: true,
  topSkills: true, // Allow user to add/override some skills for focus
}).extend({
  customKeywords: z.string().optional().describe("Comma-separated keywords or focus areas for the AI."),
});

type DialogFormData = z.infer<typeof DialogFormSchema>;


const AISummaryGeneratorDialog: React.FC<AISummaryGeneratorDialogProps> = ({
  isOpen,
  onOpenChange,
  currentResumeData,
  onSummaryGenerated,
  children
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

  const form = useForm<DialogFormData>({
    resolver: zodResolver(DialogFormSchema),
    defaultValues: {
      targetRole: '',
      tone: 'professional',
      lengthPreference: 'medium',
      topSkills: currentResumeData.skills.slice(0, 5).map(s => s.name).filter(Boolean),
      customKeywords: '',
    },
  });

  const handleSubmit = async (data: DialogFormData) => {
    setIsLoading(true);
    setGeneratedSummary(null);

    const input: GenerateSummaryInput = {
      fullName: currentResumeData.personalDetails.fullName,
      currentSummary: currentResumeData.personalDetails.summary,
      topSkills: data.topSkills?.length ? data.topSkills : currentResumeData.skills.map(s => s.name).filter(Boolean).slice(0,5),
      experienceSnippets: currentResumeData.experience
        .flatMap(exp => exp.responsibilities)
        .filter(Boolean)
        .slice(0, 5), // Take first 5 snippets
      targetRole: data.targetRole,
      tone: data.tone,
      lengthPreference: data.lengthPreference,
    };
     if (data.customKeywords) {
        const keywords = data.customKeywords.split(',').map(k => k.trim()).filter(Boolean);
        input.topSkills = [...(input.topSkills || []), ...keywords];
    }


    try {
      const result = await generateResumeSummary(input);
      setGeneratedSummary(result.generatedSummary);
      toast({ title: 'Summary Generated!', description: 'Review the summary below.' });
    } catch (error) {
      console.error('AI Summary Generation Error:', error);
      toast({
        title: 'Error Generating Summary',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSummary = () => {
    if (generatedSummary) {
      onSummaryGenerated(generatedSummary);
      onOpenChange(false); // Close dialog
      form.reset();
      setGeneratedSummary(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        setGeneratedSummary(null);
      }
      onOpenChange(open);
    }}>
      {children}
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-accent" />
            AI Resume Summary Generator
          </DialogTitle>
          <DialogDescription>
            Let AI help you craft a compelling professional summary. Provide some details or let it use your existing resume data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="targetRole">Target Role/Industry (Optional)</Label>
            <Input
              id="targetRole"
              placeholder="e.g., Senior Software Engineer, Marketing"
              {...form.register('targetRole')}
              className="mt-1"
            />
          </div>
           <div>
            <Label htmlFor="customKeywords">Additional Keywords/Focus (Optional)</Label>
            <Input
              id="customKeywords"
              placeholder="e.g., leadership, innovation, SaaS"
              {...form.register('customKeywords')}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords to guide the AI.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select
                defaultValue="professional"
                onValueChange={(value) => form.setValue('tone', value as GenerateSummaryInput['tone'])}
              >
                <SelectTrigger id="tone" className="mt-1">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="results-oriented">Results-Oriented</SelectItem>
                  <SelectItem value="dynamic">Dynamic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lengthPreference">Length</Label>
               <Select
                defaultValue="medium"
                onValueChange={(value) => form.setValue('lengthPreference', value as GenerateSummaryInput['lengthPreference'])}
              >
                <SelectTrigger id="lengthPreference" className="mt-1">
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
          
          {/* Consider showing a preview of topSkills used from resumeData or allow editing */}


          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Summary
          </Button>
        </form>

        {generatedSummary && (
          <div className="mt-4 space-y-2 p-4 border border-dashed border-accent/50 rounded-md bg-accent/5">
            <Label className="text-base font-semibold text-primary">Generated Summary:</Label>
            <Textarea
              value={generatedSummary}
              readOnly
              rows={5}
              className="bg-background"
            />
            <Button onClick={handleUseSummary} className="w-full mt-2">
              Use This Summary
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

export default AISummaryGeneratorDialog;

    
