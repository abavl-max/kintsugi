import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Download } from 'lucide-react';
interface ExportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getCanvasDataURL: (format: 'image/png' | 'image/jpeg', quality?: number) => string | undefined;
}
export function ExportDialog({ isOpen, onOpenChange, getCanvasDataURL }: ExportDialogProps) {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(92);
  const [isDownloading, setIsDownloading] = useState(false);
  const handleExport = () => {
    setIsDownloading(true);
    try {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = getCanvasDataURL(mimeType, quality / 100);
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `kintsugi-artwork.${format}`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Failed to get canvas data URL.");
        // Here you might want to show a toast notification to the user
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsDownloading(false);
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Artwork</DialogTitle>
          <DialogDescription>
            Choose your desired format and settings to download your creation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label>File Format</Label>
            <RadioGroup defaultValue="png" value={format} onValueChange={(value) => setFormat(value as 'png' | 'jpeg')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="format-png" />
                <Label htmlFor="format-png">PNG</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jpeg" id="format-jpeg" />
                <Label htmlFor="format-jpeg">JPEG</Label>
              </div>
            </RadioGroup>
          </div>
          {format === 'jpeg' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="quality-slider">Quality</Label>
                <span className="text-sm font-mono text-muted-foreground w-12 text-right">{quality}</span>
              </div>
              <Slider
                id="quality-slider"
                value={[quality]}
                min={10}
                max={100}
                step={1}
                onValueChange={([val]) => setQuality(val)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleExport} disabled={isDownloading} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}