'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/TopNav';
import { WikiSidebar } from '@/components/WikiSidebar';
import { WikiHeader } from '@/components/WikiHeader';
import { WikiContent } from '@/components/WikiContent';
import { SearchModal } from '@/components/SearchModal';
import { PageNotFound } from '@/components/PageNotFound';
import { LoadingState } from '@/components/LoadingState';
import { HeroGradient } from '@/components/HeroGradient';
import { ChatBox } from '@/components/ChatBox';
import { MindmapButton } from '@/components/MindmapButton';
import type { WikiData } from '@/lib/types';
import { SearchBar } from '@/components/SearchBar';
import { checkClientRateLimit } from '@/lib/client-rate-limiter';
import { exportToPDF } from '@/lib/pdf-exporter';
import { copyAsMarkdown } from '@/lib/markdown-exporter';

export default function Home() {
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [is404, setIs404] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (query: string) => {
    // Client-side rate limit check
    const rateCheck = checkClientRateLimit();
    
    if (!rateCheck.allowed) {
      const seconds = Math.ceil(rateCheck.resetIn / 1000);
      setError(`Rate limit exceeded. Please wait ${seconds} seconds before searching again.`);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setIs404(false);
    
    try {
      const isUrl = query.startsWith('http://') || query.startsWith('https://');
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isUrl ? { url: query } : { topic: query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle rate limit error specifically
        if (response.status === 429) {
          throw new Error(errorData.message || 'Rate limit exceeded. Please try again later.');
        }
        
        throw new Error(errorData.error || 'Failed to fetch wiki data');
      }

      const data: WikiData = await response.json();
      
      // Check if the page doesn't exist
      const rawMarkdown = data.rawMarkdown || '';
      if (rawMarkdown.includes("This page doesn't exist... yet") || 
          rawMarkdown.includes("This page doesn&#39;t exist... yet")) {
        setIs404(true);
        setWikiData(null);
      } else {
        setWikiData(data);
        setIs404(false);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      setIs404(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReturnHome = () => {
    setWikiData(null);
    setError(null);
    setIs404(false);
  };

  const handleExport = async () => {
    if (!wikiData) return;
    
    try {
      await exportToPDF({
        title: wikiData.title,
        url: wikiData.metadata?.source,
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleCopyMarkdown = async () => {
    if (!wikiData) return;
    
    try {
      await copyAsMarkdown(wikiData.title, wikiData.rawMarkdown || '');
    } catch (error) {
      console.error('Copy markdown failed:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      <TopNav onSearch={handleSearch} isLoading={isLoading} showSearch={!!wikiData} showExport={!!wikiData && !isLoading && !error && !is404} onExport={handleExport} onCopyMarkdown={handleCopyMarkdown} />

      {isLoading ? (
        <LoadingState />
      ) : is404 ? (
        <PageNotFound onReturnHome={handleReturnHome} />
      ) : error ? (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center space-y-4 max-w-md p-8 bg-card rounded-2xl border shadow-lg">
            <h2 className="text-2xl font-bold">Error Loading Content</h2>
            <p className="text-muted-foreground leading-relaxed">{error}</p>
          </div>
        </div>
      ) : wikiData ? (
        <>
          <div className="flex-1 flex overflow-hidden">
            <WikiSidebar
              toc={wikiData.tableOfContents}
              title={wikiData.title}
              activeSection={activeSection}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
              <WikiContent
                sections={wikiData.sections}
                rawMarkdown={wikiData.rawMarkdown}
                onSectionChange={setActiveSection}
                sourceUrl={wikiData.metadata?.source}
              />
            </div>
          </div>
          
          {/* Mindmap Button */}
          <MindmapButton 
            pageUrl={wikiData.metadata?.source || ''}
            pageMarkdown={wikiData.rawMarkdown || ''}
            pageTitle={wikiData.title}
          />
          
          {/* Chat with Page */}
          <ChatBox pageContext={wikiData.rawMarkdown || ''} pageTitle={wikiData.title} />
        </>
      ) : (
        <div className="relative flex-1 overflow-hidden">
          {/* Grain Gradient - positioned at bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-0">
            <HeroGradient />
          </div>

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight leading-[0.9] tracking-tight">
              <span className="block">Search anything.</span>
              <span className="block">Find the truth.</span>
            </h1>
            <div className="mt-10 w-full max-w-3xl mb-20">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} variant="hero" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

