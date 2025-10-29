'use client';

import { useState } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  variant?: 'default' | 'nav' | 'hero';
}

export function SearchBar({ onSearch, isLoading = false, variant = 'default' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
          <Input
            type="text"
            placeholder="Search DeepGrok..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-16 bg-transparent pl-12 pr-16 text-base text-white placeholder:text-white/60 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/15 text-white hover:bg-white/25 transition disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    );
  }

  const inputClasses =
    variant === 'nav'
      ? 'h-10 rounded-full pl-10 pr-4 bg-muted/40 border-2 border-border/50 focus-visible:ring-0 focus-visible:ring-offset-0'
      : 'pl-12 h-12 text-base border-2 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all';

  const wrapperClasses = variant === 'nav' ? 'gap-2' : 'gap-3';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {variant === 'nav' ? (
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={inputClasses}
            disabled={isLoading}
            maxLength={500}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      ) : (
        <div className={`flex ${wrapperClasses}`}>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search DeepGrok topic or paste URL..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={inputClasses}
              disabled={isLoading}
              maxLength={500}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !query.trim()}
            className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>
      )}
    </form>
  );
}

