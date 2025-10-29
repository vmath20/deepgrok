'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { WikiSidebar } from '@/components/WikiSidebar';
import { WikiContent } from '@/components/WikiContent';
import { SearchModal } from '@/components/SearchModal';
import { PageNotFound } from '@/components/PageNotFound';
import { LoadingState } from '@/components/LoadingState';
import { ChatBox } from '@/components/ChatBox';
import { MindmapButton } from '@/components/MindmapButton';
import type { WikiData } from '@/lib/types';
import { checkClientRateLimit } from '@/lib/client-rate-limiter';
import { exportToPDF } from '@/lib/pdf-exporter';
import { copyAsMarkdown } from '@/lib/markdown-exporter';

export default function WikiPage() {
  const params = useParams();
  const router = useRouter();
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is404, setIs404] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Extract topic from URL
  const slug = params.slug as string[];
  const topic = slug ? slug.join('/') : '';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-load page on mount or when topic changes
  useEffect(() => {
    if (topic) {
      handleSearch(topic);
      
      // Handle URL fragment (scroll to section after load)
      const hash = window.location.hash.substring(1); // Remove #
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 1000); // Wait for content to render
      }
    }
  }, [topic]);

  const handleSearch = async (query: string) => {
    const rateCheck = checkClientRateLimit();
    
    if (!rateCheck.allowed) {
      const seconds = Math.ceil(rateCheck.resetIn / 1000);
      setError(`Rate limit exceeded. Please wait ${seconds} seconds before searching again.`);
      setIsLoading(false);
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
        
        if (response.status === 429) {
          throw new Error(errorData.message || 'Rate limit exceeded. Please try again later.');
        }
        
        throw new Error(errorData.error || 'Failed to fetch wiki data');
      }

      const data: WikiData = await response.json();
      
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
    router.push('/');
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
        onSearch={(query) => {
          handleSearch(query);
          router.push(`/page/${encodeURIComponent(query.replace(/\s+/g, '_'))}`);
        }}
        isLoading={isLoading}
      />
      <TopNav 
        onSearch={(query) => {
          handleSearch(query);
          router.push(`/page/${encodeURIComponent(query.replace(/\s+/g, '_'))}`);
        }} 
        isLoading={isLoading} 
        showSearch={!!wikiData} 
        showExport={!!wikiData && !isLoading && !error && !is404} 
        onExport={handleExport}
        onCopyMarkdown={handleCopyMarkdown}
      />

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
      ) : null}
    </div>
  );
}

