import React, { useState, useEffect } from 'react';
import { useKintsugiStore, Effect, Preset } from '@/store/kintsugiStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Trash2, Check, Save, Download } from 'lucide-react';
import { TemplateSelector } from './TemplateSelector';
import { ExportDialog } from './ExportDialog';
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
            <span className="text-sm font-mono text-muted-foreground w-12 text-right">
              {param.step < 1 ? param.value.toFixed(2) : param.value.toFixed(0)}
            </span>
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
const PresetItem: React.FC<{ preset: Preset }> = ({ preset }) => {
  const applyPreset = useKintsugiStore((s) => s.applyPreset);
  const deletePreset = useKintsugiStore((s) => s.deletePreset);
  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
      <span className="text-sm font-medium truncate pr-2">{preset.name}</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyPreset(preset.id)} aria-label={`Apply ${preset.name} preset`}>
          <Check className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/80 hover:text-destructive" onClick={() => deletePreset(preset.id)} aria-label={`Delete ${preset.name} preset`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
export function ControlPanel() {
  const effects = useKintsugiStore((s) => s.effects);
  const resetEffects = useKintsugiStore((s) => s.resetEffects);
  const image = useKintsugiStore((s) => s.image);
  const templateId = useKintsugiStore((s) => s.templateId);
  const presets = useKintsugiStore((s) => s.presets);
  const loadPresets = useKintsugiStore((s) => s.loadPresets);
  const addPreset = useKintsugiStore((s) => s.addPreset);
  const [presetName, setPresetName] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const isCanvasActive = !!image || !!templateId;
  useEffect(() => {
    loadPresets();
  }, [loadPresets]);
  const handleSavePreset = () => {
    addPreset(presetName);
    setPresetName('');
  };
  const getCanvasDataURL = (format: 'image/png' | 'image/jpeg', quality?: number): string | undefined => {
    const canvas = document.querySelector('canvas');
    return canvas?.toDataURL(format, quality);
  };
  return (
    <>
      <aside className="w-full h-full bg-background border-r border-border flex flex-col">
        <header className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Kintsugi</h2>
          <Button variant="ghost" size="icon" onClick={resetEffects} disabled={!isCanvasActive} aria-label="Reset all effects">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </header>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <Accordion type="multiple" defaultValue={['templates']} className="w-full">
              <AccordionItem value="templates">
                <AccordionTrigger className="text-lg">Templates</AccordionTrigger>
                <AccordionContent className="pt-4">
                  <TemplateSelector />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="visual-effects">
                <AccordionTrigger className="text-lg">Visual Effects</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-8">
                  {Object.values(effects).map((effect) => (
                    <EffectControls key={effect.id} effect={effect} />
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="presets">
                <AccordionTrigger className="text-lg">Presets</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="preset-name">Save Current Effects</Label>
                    <div className="flex gap-2">
                      <Input
                        id="preset-name"
                        placeholder="Preset name..."
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        disabled={!isCanvasActive}
                      />
                      <Button onClick={handleSavePreset} disabled={!presetName.trim() || !isCanvasActive} aria-label="Save preset">
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {presets.length > 0 ? (
                      presets.map((preset) => <PresetItem key={preset.id} preset={preset} />)
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No presets saved yet.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
        <footer className="p-4 border-t border-border">
          <Button className="w-full" disabled={!isCanvasActive} onClick={() => setIsExportOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export Image
          </Button>
        </footer>
      </aside>
      <ExportDialog 
        isOpen={isExportOpen} 
        onOpenChange={setIsExportOpen} 
        getCanvasDataURL={getCanvasDataURL}
      />
    </>
  );
}