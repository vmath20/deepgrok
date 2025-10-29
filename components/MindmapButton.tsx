'use client';

import { useState } from 'react';
import { Network, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MindmapViewer } from '@/components/MindmapViewer';

interface MindmapButtonProps {
  pageUrl: string;
  pageMarkdown: string;
  pageTitle: string;
}

export function MindmapButton({ pageUrl, pageMarkdown, pageTitle }: MindmapButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mindmapMarkdown, setMindmapMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: pageUrl,
          markdown: pageMarkdown,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate mindmap');
      }

      const data = await response.json();
      setMindmapMarkdown(data.mindmap);
    } catch (err) {
      console.error('Mindmap generation error:', err);
      setError('Failed to generate mindmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Mindmap Button */}
      <div className="fixed bottom-28 right-8 z-50">
        <Button
          onClick={handleGenerate}
          className="rounded-full h-14 w-14 shadow-2xl bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 text-white"
          size="icon"
          aria-label="Generate Mindmap"
        >
          <Network className="h-6 w-6" />
        </Button>
      </div>

      {/* Mindmap Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-5xl h-[80vh] -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-2xl border bg-card shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Header */}
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Mindmap</h2>
                  <p className="text-sm text-muted-foreground">{pageTitle}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground">Generating mindmap...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <p className="text-destructive">{error}</p>
                      <Button onClick={handleGenerate}>Try Again</Button>
                    </div>
                  </div>
                ) : mindmapMarkdown ? (
                  <MindmapViewer markdown={mindmapMarkdown} />
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

