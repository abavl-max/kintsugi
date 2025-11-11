import React from 'react';
import { useKintsugiStore } from '@/store/kintsugiStore';
import { templates, TemplateId } from '@/lib/templates';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
export function TemplateSelector() {
  const setTemplate = useKintsugiStore((s) => s.setTemplate);
  const currentTemplateId = useKintsugiStore((s) => s.templateId);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(templates).map(([id, { name, preview }]) => (
          <button
            key={id}
            onClick={() => setTemplate(id as TemplateId)}
            className={cn(
              'p-0 border-2 rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              currentTemplateId === id ? 'border-accent' : 'border-transparent hover:border-muted-foreground/50'
            )}
            aria-pressed={currentTemplateId === id}
          >
            <Card className="w-full h-full bg-muted/50 hover:bg-muted/80">
              <CardContent className="p-3 flex flex-col items-center gap-2">
                <div className="w-full aspect-video bg-background rounded-md flex items-center justify-center overflow-hidden">
                  {preview}
                </div>
                <span className="text-xs font-medium text-foreground truncate">{name}</span>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}