import React, { useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useKintsugiStore } from '@/store/kintsugiStore';
import { applyPixelate, applyRgbShift, applyNoise, applyScanLines, applyGlitchLines } from '@/lib/effects';
import { templates } from '@/lib/templates';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
export function PreviewCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const image = useKintsugiStore((s) => s.image);
  const setImage = useKintsugiStore((s) => s.setImage);
  const effects = useKintsugiStore((s) => s.effects);
  const templateId = useKintsugiStore((s) => s.templateId);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, [setImage]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false,
    noClick: !!templateId,
    noKeyboard: !!templateId,
  });
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!ctx || !canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const maxWidth = parent.clientWidth - 64; // with padding
    const maxHeight = parent.clientHeight - 64;
    let newWidth = Math.min(maxWidth, 1024); // Cap width for templates
    let newHeight = newWidth / (16/9);
    if (image) {
        const aspectRatio = image.width / image.height;
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = newHeight * aspectRatio;
        }
    } else if (templateId) {
        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * (16/9);
        }
    } else {
        return; // No image or template, do nothing
    }
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw source
    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else if (templateId && templates[templateId]) {
      ctx.fillStyle = '#0A0A0A'; // Match background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      templates[templateId].draw(ctx, canvas.width, canvas.height);
    }
    // Apply effects
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (effects.pixelate.active) {
      imageData = applyPixelate(imageData, { blockSize: effects.pixelate.params.blockSize.value });
    }
    if (effects.rgbShift.active) {
      imageData = applyRgbShift(imageData, { offset: effects.rgbShift.params.offset.value });
    }
    if (effects.noise.active) {
      imageData = applyNoise(imageData, { amount: effects.noise.params.amount.value });
    }
    if (effects.scanLines.active) {
      imageData = applyScanLines(imageData, {
        lineWidth: effects.scanLines.params.lineWidth.value,
        lineGap: effects.scanLines.params.lineGap.value,
        lineAlpha: effects.scanLines.params.lineAlpha.value,
      });
    }
    if (effects.glitchLines.active) {
        imageData = applyGlitchLines(imageData, {
            amount: effects.glitchLines.params.amount.value,
            blockHeight: effects.glitchLines.params.blockHeight.value,
        });
    }
    ctx.putImageData(imageData, 0, 0);
  }, [image, effects, templateId]);
  const isCanvasActive = !!image || !!templateId;
  return (
    <main className="w-full h-full bg-muted/20 flex items-center justify-center p-8 md:p-12">
      {!isCanvasActive ? (
        <div
          {...getRootProps()}
          className={cn(
            'w-full h-full max-w-3xl max-h-[70vh] border-2 border-dashed border-muted-foreground/50 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-300',
            isDragActive ? 'bg-accent/20 border-accent' : 'hover:bg-muted/50 hover:border-muted-foreground'
          )}
        >
          <input {...getInputProps()} />
          <div className="p-8 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <UploadCloud className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">
              {isDragActive ? 'Drop the image here...' : 'Upload an Image'}
            </h3>
            <p className="text-muted-foreground">
              Drag and drop an image file, or click to select one.
            </p>
            <p className="text-sm text-muted-foreground/80">Or choose a template from the panel on the left.</p>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50"
        />
      )}
    </main>
  );
}