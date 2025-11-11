import { useEffect } from 'react';
import { ControlPanel } from '@/components/ControlPanel';
import { PreviewCanvas } from '@/components/PreviewCanvas';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useTheme } from '@/hooks/use-theme';
export function HomePage() {
  const { isDark, toggleTheme } = useTheme();
  useEffect(() => {
    // Force dark theme for this application
    if (!isDark) {
      toggleTheme();
    }
  }, [isDark, toggleTheme]);
  return (
    <div className="w-screen h-screen bg-background text-foreground overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="min-h-full min-w-full">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <ControlPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <PreviewCanvas />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}