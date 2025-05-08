
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
import { Download, Edit3, Palette, Bot, Eye, X, ChevronDown, UserCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { exportToPdf } from '@/lib/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggleButton } from '@/components/theme/ThemeToggleButton';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
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
  const { user, isLoggedIn, logout } = useAuth();

  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: DEFAULT_RESUME_DATA, 
    mode: 'onChange', 
  });

  const resumeData = methods.watch(); 

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleExportPng = async () => {
    toast({ title: "Processing PNG", description: "Your resume is being generated..." });
    const input = document.getElementById(PREVIEW_CONTAINER_ID);
    if (!input) {
      toast({ title: "Error", description: "Could not find resume content for PNG.", variant: "destructive" });
      return;
    }
    try {
      const originalOverflow = input.style.overflow;
      const parentContainer = input.parentElement;
      let originalParentOverflow: string | undefined;

      if (parentContainer) {
        originalParentOverflow = parentContainer.style.overflow;
        parentContainer.style.overflow = 'visible'; 
      }
      input.style.overflow = 'visible';


      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: process.env.NODE_ENV === 'development',
        width: input.scrollWidth, 
        height: input.scrollHeight, 
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
      });

      input.style.overflow = originalOverflow; 
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
        <p className="text-lg text-foreground">Loading AI Resume Architect Editor...</p>
      </div>
    );
  }
  
  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-screen bg-background"> {/* Changed min-h-screen to h-screen for fixed height */}
        <header className="bg-primary text-primary-foreground p-2 sm:p-3 shadow-md sticky top-0 z-50">
          <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
            <Link href="/" className="text-lg sm:text-xl font-bold flex items-center">
              <Bot className="mr-1.5 h-5 w-5 sm:h-6 sm:w-6" /> AI Resume Architect
            </Link>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <ThemeToggleButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary"
                    className="bg-accent/80 hover:bg-accent text-accent-foreground px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm gap-1 [&_svg]:size-3.5 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    <Download /> Download <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-xl">
                  <DropdownMenuItem onClick={handleExportPdf} className="hover:bg-accent/10">
                    Download as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPng} className="hover:bg-accent/10">
                    Download as PNG
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                    Download as SVG (coming soon)
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                    Download as DOC (coming soon)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {isLoggedIn && user && (
                <>
                  <span className="text-xs sm:text-sm hidden md:flex items-center gap-1 text-primary-foreground/80">
                    <UserCircle className="h-4 w-4" />
                    {user.email}
                  </span>
                   <Link href="/dashboard" passHref>
                    <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 py-1 text-xs sm:px-2.5 sm:text-sm gap-1 [&_svg]:size-3.5">
                       <LayoutDashboard /> Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout} 
                    className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 py-1 text-xs sm:px-2.5 sm:text-sm gap-1 [&_svg]:size-3.5"
                  >
                    <LogOut /> Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col md:flex-row gap-4 p-2 sm:p-4 overflow-hidden"> {/* overflow-hidden is key here */}
          {/* Left Pane: Editor/Templates */}
          <div className="w-full md:w-2/5 lg:w-1/3 xl:w-2/5 flex-shrink-0 flex flex-col">
            <Card className="flex-grow flex flex-col overflow-hidden shadow-lg">
              <Tabs defaultValue="editor" className="w-full flex-grow flex flex-col">
                <TabsList className="grid w-full grid-cols-2 rounded-none rounded-t-lg">
                  <TabsTrigger value="editor" className="py-2 sm:py-2.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
                    <Edit3 className="mr-1 sm:mr-1.5 h-3.5 w-3.5" /> Editor
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="py-2 sm:py-2.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
                    <Palette className="mr-1 sm:mr-1.5 h-3.5 w-3.5" /> Templates
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="flex-grow overflow-hidden p-1 sm:p-2 md:p-3">
                   <ScrollArea className="h-full pr-1 sm:pr-2"> {/* h-full enables scroll within this area */}
                      <ResumeFormWrapper />
                   </ScrollArea>
                </TabsContent>
                <TabsContent value="templates" className="flex-grow overflow-hidden p-1 sm:p-2 md:p-3">
                   <ScrollArea className="h-full pr-1 sm:pr-2"> {/* h-full enables scroll within this area */}
                      <TemplateSelector selectedTemplate={selectedTemplate} onSelectTemplate={setSelectedTemplate} />
                   </ScrollArea>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Pane: Live Preview */}
          <div className="flex-grow flex flex-col min-h-0"> {/* min-h-0 is important for flex item with overflow */}
            <Card className="flex-grow flex flex-col overflow-hidden shadow-lg">
              <CardHeader className="p-3 sm:p-4 border-b">
                <CardTitle className="text-base sm:text-lg flex items-center">
                    <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary"/>
                    Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-0 overflow-hidden"> {/* Remove padding, ResumePreviewWrapper handles it */}
                 <ResumePreviewWrapper 
                    resumeData={resumeData} 
                    selectedTemplateId={selectedTemplate}
                    className="h-full bg-muted/30" // h-full enables scroll within ResumePreviewWrapper
                  />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </FormProvider>
  );
};

export default ResumeBuilder;
    
