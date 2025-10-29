'use client';

import { useEffect, useRef } from 'react';
import { Markmap } from 'markmap-view';
import { Transformer } from 'markmap-lib';

interface MindmapViewerProps {
  markdown: string;
}

export function MindmapViewer({ markdown }: MindmapViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<Markmap | null>(null);

  useEffect(() => {
    if (!svgRef.current || !markdown) return;

    const transformer = new Transformer();
    const { root } = transformer.transform(markdown);

    if (markmapRef.current) {
      markmapRef.current.setData(root);
      markmapRef.current.fit();
    } else {
      markmapRef.current = Markmap.create(svgRef.current, {
        duration: 500,
        maxWidth: 300,
        color: (node) => {
          const colors = ['#FF9D00', '#809BFF', '#6D2EFF', '#F15CFF', '#FFD557'];
          return colors[node.state?.depth % colors.length] || '#809BFF';
        },
      }, root);
    }

    return () => {
      markmapRef.current?.destroy();
      markmapRef.current = null;
    };
  }, [markdown]);

  return (
    <div className="w-full h-full bg-background rounded-lg border">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
}

