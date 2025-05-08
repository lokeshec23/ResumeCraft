
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
import { Loader2, Sparkles, Wand2, PlusCircle, X } from 'lucide-react';
import type { ExperienceEntry, ResumeData } from '@/lib/resumeTypes';
import { generateExperienceResponsibility } from '@/ai/flows/generate-experience-responsibility-flow';
import { GenerateResponsibilityInputSchema, type GenerateResponsibilityInput } from '@/ai/schemas/experienceSchemas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AIResponsibilityGeneratorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  experienceEntryData: Pick<ExperienceEntry, 'jobTitle' | 'company' | 'responsibilities'>;
  allSkills: ResumeData['skills']; // To suggest skills
  onResponsibilitiesGenerated: (responsibilities: string[]) => void;
  children?: ReactNode; 
}

const DialogFormSchema = GenerateResponsibilityInputSchema.pick({
  skillsToHighlight: true,
  tone: true,
  quantity: true,
}).extend({
  customSkills: z.string().optional().describe("Comma-separated custom skills or keywords for the AI."),
});

type DialogFormData = z.infer<typeof DialogFormSchema>;

const AIResponsibilityGeneratorDialog: React.FC<AIResponsibilityGeneratorDialogProps> = ({
  isOpen,
  onOpenChange,
  experienceEntryData,
  allSkills,
  onResponsibilitiesGenerated,
  children
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResponsibilities, setGeneratedResponsibilities] = useState<string[] | null>(null);
  const [selectedResponsibilities, setSelectedResponsibilities] = useState<string[]>([]);

  const form = useForm<DialogFormData>({
    resolver: zodResolver(DialogFormSchema),
    defaultValues: {
      skillsToHighlight: allSkills.slice(0, 3).map(s => s.name).filter(Boolean),
      tone: 'action-oriented',
      quantity: 3,
      customSkills: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        skillsToHighlight: allSkills.slice(0, 3).map(s => s.name).filter(Boolean),
        tone: 'action-oriented',
        quantity: 3,
        customSkills: '',
      });
      setGeneratedResponsibilities(null);
      setSelectedResponsibilities([]);
    }
  }, [isOpen, form, allSkills]);

  const handleSubmit = async (data: DialogFormData) => {
    setIsLoading(true);
    setGeneratedResponsibilities(null);
    setSelectedResponsibilities([]);

    const skills = data.customSkills
      ? data.customSkills.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    
    const input: GenerateResponsibilityInput = {
      jobTitle: experienceEntryData.jobTitle,
      company: experienceEntryData.company,
      existingResponsibilities: experienceEntryData.responsibilities,
      skillsToHighlight: skills.length > 0 ? skills : (data.skillsToHighlight || []),
      tone: data.tone,
      quantity: data.quantity || 1,
    };

    try {
      const result = await generateExperienceResponsibility(input);
      setGeneratedResponsibilities(result.generatedResponsibilities);
      toast({ title: 'Responsibilities Generated!', description: 'Select the ones you want to use.' });
    } catch (error) {
      console.error('AI Responsibility Generation Error:', error);
      toast({
        title: 'Error Generating Responsibilities',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleResponsibility = (resp: string) => {
    setSelectedResponsibilities(prev => 
      prev.includes(resp) ? prev.filter(r => r !== resp) : [...prev, resp]
    );
  };

  const handleAddSelectedResponsibilities = () => {
    if (selectedResponsibilities.length > 0) {
      onResponsibilitiesGenerated(selectedResponsibilities);
      onOpenChange(false);
    } else {
        toast({
            title: "No Responsibilities Selected",
            description: "Please select at least one responsibility to add.",
            variant: "destructive"
        })
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-accent" />
            AI Responsibility Generator
          </DialogTitle>
          <DialogDescription>
            For: {experienceEntryData.jobTitle} at {experienceEntryData.company}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="customSkills">Skills/Keywords to Highlight (Optional)</Label>
            <Input
              id="customSkills"
              placeholder="e.g., Python, project management, UI/UX"
              {...form.register('customSkills')}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Comma-separated. Overrides suggestions if filled.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={form.watch('tone')}
                onValueChange={(value) => form.setValue('tone', value as GenerateResponsibilityInput['tone'])}
              >
                <SelectTrigger id="tone" className="mt-1">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action-oriented">Action-Oriented</SelectItem>
                  <SelectItem value="results-focused">Results-Focused</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="collaborative">Collaborative</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="quantity">Number to Generate</Label>
              <Select
                value={form.watch('quantity')?.toString()}
                onValueChange={(value) => form.setValue('quantity', parseInt(value) as GenerateResponsibilityInput['quantity'])}
              >
                <SelectTrigger id="quantity" className="mt-1">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
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
            Generate Responsibilities
          </Button>
        </form>

        {generatedResponsibilities && generatedResponsibilities.length > 0 && (
          <div className="mt-4 space-y-2 p-4 border border-dashed border-accent/50 rounded-md bg-accent/5">
            <Label className="text-base font-semibold text-primary">Generated Responsibilities (Select to Add):</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {generatedResponsibilities.map((resp, index) => (
                <div key={index} 
                     className={`p-2 rounded-md cursor-pointer flex items-start transition-all text-sm
                                ${selectedResponsibilities.includes(resp) ? 'bg-accent/20 border border-accent' : 'bg-background hover:bg-muted/70'}`}
                     onClick={() => handleToggleResponsibility(resp)}>
                  <span className={`mr-2 mt-1 inline-block h-4 w-4 rounded-sm border border-primary flex-shrink-0 transition-colors
                                  ${selectedResponsibilities.includes(resp) ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}>
                     {selectedResponsibilities.includes(resp) && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span>{resp}</span>
                </div>
              ))}
            </div>
            <Button onClick={handleAddSelectedResponsibilities} className="w-full mt-3" disabled={selectedResponsibilities.length === 0}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Selected to Resume ({selectedResponsibilities.length})
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

export default AIResponsibilityGeneratorDialog;
