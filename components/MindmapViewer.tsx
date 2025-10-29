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
              const colors = ['#FF9D00', '#809BFF', '#6D2EFF', '#F15CFF', '#FFD557', '#FD4F30'];
              const depth = node.state?.depth || 0;
              return colors[depth % colors.length];
            },
            paddingX: 12,
            spacingVertical: 10,
            spacingHorizontal: 80,
            autoFit: true,
          }, root);

          // Fit the mindmap to viewport
          mm.fit();
          
          // Style text to be white
          setTimeout(() => {
            if (svgRef.current) {
              const textElements = svgRef.current.querySelectorAll('foreignObject');
              textElements.forEach((el) => {
                const div = el.querySelector('div');
                if (div) {
                  div.style.color = 'white';
                  div.style.fontSize = '14px';
                  div.style.fontWeight = '500';
                }
              });
            }
          }, 100);
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
    <div className="w-full h-full bg-black rounded-lg border border-white/10 overflow-hidden">
      <style>{`
        .markmap-node text {
          fill: white !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }
        .markmap-node circle {
          stroke-width: 2 !important;
        }
        .markmap-link {
          stroke-width: 2 !important;
        }
      `}</style>
      <svg
        ref={svgRef}
        className="w-full h-full mindmap-svg"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
}
