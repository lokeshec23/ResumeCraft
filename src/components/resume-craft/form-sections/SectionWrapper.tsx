'use client';

import type { ReactNode } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { LucideIcon } from 'lucide-react';

interface SectionWrapperProps {
  title: string;
  icon: LucideIcon;
  value: string; // Unique value for AccordionItem
  children: ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, icon: Icon, value, children }) => {
  return (
    <AccordionItem value={value} className="border-b border-border/50">
      <AccordionTrigger className="py-4 px-3 hover:bg-muted/50 rounded-t-md transition-colors">
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold text-foreground">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4 bg-card rounded-b-md shadow-inner">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};

export default SectionWrapper;
