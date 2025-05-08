'use client';

import type { TemplateId } from '@/lib/resumeTypes';
import { TEMPLATES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelectTemplate }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Choose a Template</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedTemplate}
          onValueChange={(value) => onSelectTemplate(value as TemplateId)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {TEMPLATES.map((template) => (
            <Label
              key={template.id}
              htmlFor={template.id}
              className={`relative flex flex-col items-center justify-between rounded-md border-2 p-3 hover:border-accent cursor-pointer transition-all
                ${selectedTemplate === template.id ? 'border-accent ring-2 ring-accent' : 'border-muted hover:border-muted-foreground/50'}`}
            >
              <RadioGroupItem value={template.id} id={template.id} className="sr-only" />
              {template.thumbnailUrl && (
                <div className="mb-2 rounded-md overflow-hidden aspect-[3/4] w-full relative shadow-inner">
                   <Image
                    src={template.thumbnailUrl}
                    alt={`${template.name} thumbnail`}
                    width={150}
                    height={200}
                    className="object-cover w-full h-full"
                    data-ai-hint="resume template"
                  />
                </div>
              )}
              <span className="text-sm font-medium text-center text-foreground">{template.name}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
