import React from 'react';
import { useKintsugiStore, Effect } from '@/store/kintsugiStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
const EffectControls: React.FC<{ effect: Effect }> = ({ effect }) => {
  const toggleEffect = useKintsugiStore((s) => s.toggleEffect);
  const setEffectParam = useKintsugiStore((s) => s.setEffectParam);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor={`${effect.id}-switch`} className="text-base font-medium">
          Enable {effect.name}
        </Label>
        <Switch
          id={`${effect.id}-switch`}
          checked={effect.active}
          onCheckedChange={() => toggleEffect(effect.id)}
          aria-label={`Toggle ${effect.name} effect`}
        />
      </div>
      {Object.entries(effect.params).map(([paramKey, param]) => (
        <div key={paramKey} className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor={`${effect.id}-${paramKey}-slider`}>{param.label}</Label>
            <span className="text-sm font-mono text-muted-foreground w-12 text-right">{param.value.toFixed(0)}</span>
          </div>
          <Slider
            id={`${effect.id}-${paramKey}-slider`}
            value={[param.value]}
            min={param.min}
            max={param.max}
            step={param.step}
            onValueChange={([val]) => setEffectParam(effect.id, paramKey, val)}
            disabled={!effect.active}
          />
        </div>
      ))}
    </div>
  );
};
export function ControlPanel() {
  const effects = useKintsugiStore((s) => s.effects);
  const resetEffects = useKintsugiStore((s) => s.resetEffects);
  const image = useKintsugiStore((s) => s.image);
  return (
    <aside className="w-full h-full bg-background border-r border-border flex flex-col">
      <header className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Kintsugi</h2>
        <Button variant="ghost" size="icon" onClick={resetEffects} disabled={!image} aria-label="Reset all effects">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['visual-effects']} className="w-full">
            <AccordionItem value="visual-effects">
              <AccordionTrigger className="text-lg">Visual Effects</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-8">
                {Object.values(effects).map((effect) => (
                  <EffectControls key={effect.id} effect={effect} />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
      <footer className="p-4 border-t border-border text-xs text-muted-foreground">
        Built with ❤️ at Cloudflare
      </footer>
    </aside>
  );
}