
'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ResumeData, TemplateId } from '@/lib/resumeTypes';
import { DEFAULT_RESUME_DATA, TEMPLATES, PREVIEW_CONTAINER_ID } from '@/lib/constants';
import ResumeFormWrapper from './ResumeFormWrapper';
import ResumePreviewWrapper from './ResumePreviewWrapper';
import TemplateSelector from './TemplateSelector';
import { Button } from '@/components/ui/button';
import { Download, Edit3, Palette, Bot, Eye, X, ChevronDown } from 'lucide-react';
import { exportToPdf } from '@/lib/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggleButton } from '@/components/theme/ThemeToggleButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import html2canvas from 'html2canvas';


// Basic Zod schema (can be expanded for more detailed validation)
const resumeSchema = z.object({
  personalDetails: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address').or(z.literal('')),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    linkedin: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
    summary: z.string().optional(),
  }),
  education: z.array(z.object({
    id: z.string(),
    institution: z.string().min(1, 'Institution name is required'),
    degree: z.string().min(1, 'Degree is required'),
    fieldOfStudy: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    description: z.string().optional(),
  })),
  experience: z.array(z.object({
    id: z.string(),
    company: z.string().min(1, 'Company name is required'),
    jobTitle: z.string().min(1, 'Job title is required'),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    responsibilities: z.array(z.string().min(1, "Responsibility cannot be empty")).min(0), // Allow 0 responsibilities initially
  })),
  projects: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Project description is required'),
    technologies: z.array(z.string().min(1, "Technology cannot be empty")).min(0), // Allow 0 technologies initially
    link: z.string().url().optional().or(z.literal('')),
  })),
  skills: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Skill name is required'),
    category: z.string().optional(),
  })),
});

const ResumeBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(TEMPLATES[0].id);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: DEFAULT_RESUME_DATA, 
    mode: 'onChange', 
  });

  const resumeData = methods.watch(); 

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDialogExportPdf = async () => {
    toast({ title: "Processing PDF", description: "Your resume is being generated..." });
    try {
      await exportToPdf(PREVIEW_CONTAINER_ID, `${resumeData.personalDetails.fullName?.replace(/\s+/g, '_') || 'Resume'}_Resume`);
      toast({ title: "Success!", description: "Your resume has been downloaded as a PDF.", variant: "default" });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({ title: "Error", description: "Could not generate PDF. Please try again.", variant: "destructive" });
    }
  };

  const handleDialogExportPng = async () => {
    toast({ title: "Processing PNG", description: "Your resume is being generated..." });
    const input = document.getElementById(PREVIEW_CONTAINER_ID);
    if (!input) {
      toast({ title: "Error", description: "Could not find resume content for PNG.", variant: "destructive" });
      return;
    }
    try {
      // Ensure content is fully visible for canvas capture
      const originalOverflow = input.style.overflow;
      const parentContainer = input.parentElement;
      let originalParentOverflow: string | undefined;

      if (parentContainer) {
        originalParentOverflow = parentContainer.style.overflow;
        parentContainer.style.overflow = 'visible'; 
      }
      input.style.overflow = 'visible';


      const canvas = await html2canvas(input, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // If using external images
        logging: process.env.NODE_ENV === 'development',
        width: input.scrollWidth, // Capture full content width
        height: input.scrollHeight, // Capture full content height
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
      });

      input.style.overflow = originalOverflow; // Restore original style
      if (parentContainer && originalParentOverflow !== undefined) {
        parentContainer.style.overflow = originalParentOverflow;
      }

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${resumeData.personalDetails.fullName?.replace(/\s+/g, '_') || 'Resume'}_Resume.png`;
      link.href = imgData;
      link.click();
      toast({ title: "Success!", description: "Your resume has been downloaded as a PNG.", variant: "default" });
    } catch (error) {
      console.error("PNG Export Error:", error);
      toast({ title: "Error", description: "Could not generate PNG. Please try again.", variant: "destructive" });
    }
  };


  if (!mounted) {
    return ( 
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-lg text-foreground">Loading AI Resume Architect...</p>
      </div>
    );
  }
  
  return (
    <FormProvider {...methods}>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground p-2 sm:p-3 shadow-md sticky top-0 z-50">
          <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold flex items-center">
              <Bot className="mr-1.5 h-5 w-5 sm:h-6 sm:w-6" /> AI Resume Architect
            </h1>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <ThemeToggleButton />
              <Button 
                variant="secondary"
                onClick={() => setIsPreviewOpen(true)}
                className="text-secondary-foreground bg-accent/20 hover:bg-accent/30 px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm gap-1 [&_svg]:size-3.5"
              >
                <Eye /> Preview
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-2 sm:p-4 flex justify-center">
          <div className="w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <Tabs defaultValue="editor" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none rounded-t-lg">
                    <TabsTrigger value="editor" className="py-2 sm:py-2.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
                      <Edit3 className="mr-1 sm:mr-1.5 h-3.5 w-3.5" /> Editor
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="py-2 sm:py-2.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
                      <Palette className="mr-1 sm:mr-1.5 h-3.5 w-3.5" /> Templates
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="editor" className="p-1 sm:p-2 md:p-3 max-h-[calc(100vh-120px)] sm:max-h-[calc(100vh-130px)] overflow-hidden">
                     <ScrollArea className="h-[calc(100vh-170px)] sm:h-[calc(100vh-180px)] pr-1 sm:pr-2">
                        <ResumeFormWrapper />
                     </ScrollArea>
                  </TabsContent>
                  <TabsContent value="templates" className="p-1 sm:p-2 md:p-3 max-h-[calc(100vh-120px)] sm:max-h-[calc(100vh-130px)] overflow-hidden">
                     <ScrollArea className="h-[calc(100vh-170px)] sm:h-[calc(100vh-180px)] pr-1 sm:pr-2">
                        <TemplateSelector selectedTemplate={selectedTemplate} onSelectTemplate={setSelectedTemplate} />
                     </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-[850px] w-[90vw] h-[90vh] flex flex-col p-0 sm:p-0 rounded-lg shadow-2xl">
            <DialogHeader className="p-3 sm:p-4 border-b sticky top-0 bg-background z-10">
              <DialogTitle className="text-lg">Resume Preview</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="absolute right-2 top-2 sm:right-3 sm:top-2.5">
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </DialogHeader>
            <div className="flex-grow overflow-hidden">
              <ResumePreviewWrapper 
                resumeData={resumeData} 
                selectedTemplateId={selectedTemplate}
                className="h-full bg-muted/30" 
              />
            </div>
            <DialogFooter className="p-3 sm:p-4 border-t sticky bottom-0 bg-background z-10 flex flex-wrap justify-center sm:justify-end items-end gap-2">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-accent to-primary text-accent-foreground hover:from-accent/80 hover:to-primary/80 hover:shadow-lg active:scale-95 transition-all duration-150 ease-in-out transform hover:scale-[1.02]"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDialogExportPdf}>
                    Download as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDialogExportPng}>
                    Download as PNG
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    Download as SVG (coming soon)
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    Download as DOC (coming soon)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FormProvider>
  );
};

export default ResumeBuilder;
    
