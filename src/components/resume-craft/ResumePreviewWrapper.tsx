
'use client';

import type { ResumeData, TemplateId } from '@/lib/resumeTypes';
import { TEMPLATES, PREVIEW_CONTAINER_ID } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ResumePreviewWrapperProps {
  resumeData: ResumeData;
  selectedTemplateId: TemplateId;
  className?: string;
}

const ResumePreviewWrapper: React.FC<ResumePreviewWrapperProps> = ({ resumeData, selectedTemplateId, className }) => {
  const SelectedTemplateComponent = TEMPLATES.find(t => t.id === selectedTemplateId)?.component;

  if (!SelectedTemplateComponent) {
    return <div className="p-4 text-destructive">Error: Template not found.</div>;
  }

  return (
    // The className (e.g., h-full) is applied to the ScrollArea
    // bg-muted/30 provides a slightly different background for the scroll area itself
    <ScrollArea className={cn("h-full rounded-b-lg", className)}> 
      {/* This div is the direct child of ScrollArea's viewport, providing padding for the "paper" */}
      <div id={PREVIEW_CONTAINER_ID} className="p-2 sm:p-4 print:p-0 print:shadow-none print:bg-white flex justify-center items-start">
        {/* This div represents the "paper" with A4 aspect ratio, background, and shadow */}
        <div className="aspect-[210/297] w-full max-w-full mx-auto overflow-hidden print:overflow-visible bg-card shadow-lg print:shadow-none">
          <SelectedTemplateComponent data={resumeData} />
        </div>
      </div>
    </ScrollArea>
  );
};

export default ResumePreviewWrapper;
    
