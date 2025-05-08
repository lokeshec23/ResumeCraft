
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
import { Download, LayoutDashboard, Eye, Edit3, Share2, Palette, Bot } from 'lucide-react';
import { exportToPdf } from '@/lib/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggleButton } from '@/components/theme/ThemeToggleButton';

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

  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: DEFAULT_RESUME_DATA, 
    mode: 'onChange', 
  });

  const resumeData = methods.watch(); 

  useEffect(() => {
    setMounted(true);
    // Example of loading from localStorage if desired
    // const savedData = localStorage.getItem('resumeData');
    // if (savedData) {
    //   try {
    //     const parsedData = JSON.parse(savedData);
    //     // Ensure data structure compatibility before resetting
    //     methods.reset(parsedData);
    //   } catch (e) {
    //     console.error("Failed to parse saved resume data", e);
    //     // Fallback to default if parsing fails
    //     methods.reset(DEFAULT_RESUME_DATA);
    //   }
    // } else {
    //    methods.reset(DEFAULT_RESUME_DATA); // Ensure form has defaults if nothing in LS
    // }
    // const savedTemplate = localStorage.getItem('selectedTemplate');
    // if (savedTemplate && TEMPLATES.find(t => t.id === savedTemplate)) {
    //   setSelectedTemplate(savedTemplate as TemplateId);
    // }
  }, [methods]);

  // useEffect(() => {
  //   if (mounted) {
  //     localStorage.setItem('resumeData', JSON.stringify(resumeData));
  //     localStorage.setItem('selectedTemplate', selectedTemplate);
  //   }
  // }, [resumeData, selectedTemplate, mounted]);

  const handleExportPdf = async () => {
    toast({ title: "Processing PDF", description: "Your resume is being generated..." });
    try {
      await exportToPdf(PREVIEW_CONTAINER_ID, `${resumeData.personalDetails.fullName?.replace(/\s+/g, '_') || 'Resume'}_Resume`);
      toast({ title: "Success!", description: "Your resume has been downloaded as a PDF.", variant: "default" });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({ title: "Error", description: "Could not generate PDF. Please try again.", variant: "destructive" });
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
        <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-50">
          <div className="container mx-auto flex flex-wrap justify-between items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center">
              <Bot className="mr-2 h-6 w-6 sm:h-7 sm:w-7" /> AI Resume Architect
            </h1>
            <div className="flex items-center space-x-2">
              <ThemeToggleButton />
              <Button variant="secondary" onClick={handleExportPdf} className="bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
                <Download className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Download PDF
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-5 xl:col-span-4">
            <Card className="shadow-lg h-full">
              <CardContent className="p-0">
                <Tabs defaultValue="editor" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none rounded-t-lg">
                    <TabsTrigger value="editor" className="py-2.5 sm:py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
                      <Edit3 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Editor
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="py-2.5 sm:py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
                      <Palette className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Templates
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="editor" className="p-1 sm:p-2 md:p-4 max-h-[calc(100vh-150px)] overflow-hidden">
                     <ScrollArea className="h-[calc(100vh-200px)] pr-2 sm:pr-3">
                        <ResumeFormWrapper control={methods.control} />
                     </ScrollArea>
                  </TabsContent>
                  <TabsContent value="templates" className="p-1 sm:p-2 md:p-4 max-h-[calc(100vh-150px)] overflow-hidden">
                     <ScrollArea className="h-[calc(100vh-200px)] pr-2 sm:pr-3">
                        <TemplateSelector selectedTemplate={selectedTemplate} onSelectTemplate={setSelectedTemplate} />
                     </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            <div className="sticky top-20 sm:top-24"> 
              <ResumePreviewWrapper 
                resumeData={resumeData} 
                selectedTemplateId={selectedTemplate}
                className="max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-120px)]" 
              />
            </div>
          </div>
        </main>
        
        <footer className="bg-primary text-primary-foreground p-3 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} AI Resume Architect. Built with Next.js & ShadCN UI.</p>
        </footer>
      </div>
    </FormProvider>
  );
};

export default ResumeBuilder;
