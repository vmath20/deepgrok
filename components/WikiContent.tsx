'use client';

import { useEffect, useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import type { WikiSection } from '@/lib/types';
import { processMarkdownWithReferences } from '@/lib/reference-formatter';

interface WikiContentProps {
  sections: WikiSection[];
  rawMarkdown?: string;
  onSectionChange?: (sectionId: string) => void;
  sourceUrl?: string;
}

export function WikiContent({ sections, rawMarkdown, onSectionChange, sourceUrl }: WikiContentProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      // Find all headings (h1-h4) with IDs
      const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], [data-section-id]');
      let currentSection = '';

      headings.forEach((element) => {
        const rect = element.getBoundingClientRect();
        // Check if element is in the top part of viewport
        if (rect.top <= 150 && rect.bottom >= 0) {
          currentSection = element.getAttribute('id') || element.getAttribute('data-section-id') || '';
        }
      });

      if (currentSection && currentSection !== activeSection) {
        console.log('📍 Active section changed to:', currentSection);
        setActiveSection(currentSection);
        onSectionChange?.(currentSection);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, onSectionChange]);

  // Process references on the frontend
  const processedContent = useMemo(() => {
    if (!rawMarkdown) return null;
    const { content } = processMarkdownWithReferences(rawMarkdown);
    return content;
  }, [rawMarkdown]);

  if (processedContent) {
    return (
      <ScrollArea className="h-screen">
        <div className="max-w-5xl mx-auto pl-6 pr-40 pt-4 pb-10">
          <MarkdownRenderer content={processedContent} baseUrl={sourceUrl} />
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-screen">
      <div className="max-w-5xl mx-auto pl-6 pr-40 pt-4 pb-10">
        {sections.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No content available. Try searching for a Grokipedia topic.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

interface SectionRendererProps {
  section: WikiSection;
}

function SectionRenderer({ section }: SectionRendererProps) {
  const HeadingTag = `h${section.level}` as keyof JSX.IntrinsicElements;

  return (
    <div
      data-section-id={section.anchor}
      id={section.anchor}
      className="scroll-mt-24"
    >
      <HeadingTag className={`font-bold mb-5 ${
        section.level === 2 ? 'text-4xl text-foreground/90' : 
        section.level === 3 ? 'text-3xl text-foreground/85' : 
        'text-2xl text-foreground/80'
      }`}>
        {section.title}
      </HeadingTag>
      {section.content && (
        <div className="mb-8">
          <MarkdownRenderer content={section.content} />
        </div>
      )}
      {section.subsections && section.subsections.length > 0 && (
        <div className="ml-6 space-y-8 border-l-2 border-primary/10 pl-6">
          {section.subsections.map((subsection) => (
            <SectionRenderer key={subsection.id} section={subsection} />
          ))}
        </div>
      )}
    </div>
  );
}

