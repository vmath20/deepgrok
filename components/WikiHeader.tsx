'use client';

import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WikiHeaderProps {
  title: string;
  lastUpdated?: string;
  source?: string;
}

export function WikiHeader({ title, lastUpdated, source }: WikiHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-card to-card/95">
      <div className="max-w-5xl mx-auto px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          {title}
        </h1>
        {source && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(source, '_blank')}
              className="shadow-sm hover:shadow-md transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-2" />
              View Source
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

