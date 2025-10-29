'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderWithLinkProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id: string;
  children: React.ReactNode;
  baseUrl?: string;
}

export function HeaderWithLink({ level, id, children, baseUrl }: HeaderWithLinkProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = baseUrl ? `${baseUrl}#${id}` : `${window.location.origin}${window.location.pathname}#${id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const headingClasses = cn(
    'group relative scroll-mt-24',
    level === 1 && 'text-4xl font-bold mt-10 mb-6 pb-3 border-b-2 border-primary/20 text-white',
    level === 2 && 'text-3xl font-bold mt-8 mb-4 pb-3 border-b-2 border-border/40 text-white',
    level === 3 && 'text-2xl font-semibold mt-6 mb-3 text-white',
    level === 4 && 'text-xl font-semibold mt-5 mb-2 text-white'
  );
  
  return (
    <HeadingTag id={id} className={headingClasses}>
      {children}
      <span className="relative inline-block">
        <button
          onClick={handleCopyLink}
          className="ml-2 inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copy link"
        >
          <Link2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
        {copied && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300 whitespace-nowrap">
            <div className="bg-card border rounded-xl shadow-xl px-4 py-2 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Link copied!</span>
            </div>
          </div>
        )}
      </span>
    </HeadingTag>
  );
}

