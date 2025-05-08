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
    <ScrollArea className={cn("h-full rounded-lg shadow-xl bg-card", className)}>
      <div id={PREVIEW_CONTAINER_ID} className="p-2 sm:p-4 md:p-0 print:p-0 print:shadow-none print:bg-white"> {/* Ensure preview container has specific ID */}
        <div className="aspect-[210/297] w-full max-w-full mx-auto overflow-hidden print:overflow-visible"> {/* A4 aspect ratio */}
          <SelectedTemplateComponent data={resumeData} />
        </div>
      </div>
    </ScrollArea>
  );
};

export default ResumePreviewWrapper;
