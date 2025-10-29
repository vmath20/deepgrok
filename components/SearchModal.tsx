'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BrandShader } from '@/components/BrandShader';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchModal({ isOpen, onClose, onSearch, isLoading = false }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    // Focus input when modal opens
    const timer = setTimeout(() => {
      const input = document.getElementById('search-modal-input');
      input?.focus();
    }, 100);

    // Close on Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm" />

        {/* Loading State */}
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-xl px-6">
            <div className="mx-auto">
              <BrandShader size="large" />
            </div>
            <h2 className="text-3xl font-light text-foreground mt-8">
              Loading{dots}
            </h2>
            
            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Note: We only support a limited number of articles currently indexed on Grokipedia, which is why some pages won't work.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/3 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2">
        <form onSubmit={handleSubmit} className="relative">
          <div className="rounded-2xl border bg-card shadow-2xl">
            <div className="flex items-center border-b px-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                id="search-modal-input"
                type="text"
                placeholder="Search DeepGrok topic or paste URL..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-16 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
                autoComplete="off"
                maxLength={500}
              />
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 hover:bg-accent"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="px-4 py-3 text-xs text-muted-foreground">
              Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">Enter</kbd> to
              search
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

