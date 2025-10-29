'use client';

import { useEffect, useRef, useState } from 'react';

interface MindmapViewerProps {
  markdown: string;
}

export function MindmapViewer({ markdown }: MindmapViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!svgRef.current || !markdown) return;

    let mounted = true;

    const loadMarkmap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { Markmap } = await import('markmap-view');
        const { Transformer } = await import('markmap-lib');

        if (!mounted) return;

        const transformer = new Transformer();
        const { root } = transformer.transform(markdown);

        if (svgRef.current) {
          const mm = Markmap.create(svgRef.current, {
            duration: 500,
            maxWidth: 300,
            color: (node: any) => {
              const colors = ['#FF9D00', '#809BFF', '#6D2EFF', '#F15CFF', '#FFD557'];
              const depth = node.state?.depth || 0;
              return colors[depth % colors.length];
            },
          }, root);

          // Fit the mindmap to viewport
          mm.fit();
        }
      } catch (err) {
        console.error('Error loading markmap:', err);
        setError('Failed to render mindmap');
      }
    };

    loadMarkmap();

    return () => {
      mounted = false;
    };
  }, [markdown]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background rounded-lg border overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
}
