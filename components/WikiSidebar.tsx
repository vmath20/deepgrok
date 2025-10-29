'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { TocItem } from '@/lib/types';

interface WikiSidebarProps {
  toc: TocItem[];
  title?: string;
  activeSection?: string;
}

export function WikiSidebar({ toc, title, activeSection }: WikiSidebarProps) {
  const [clickedSection, setClickedSection] = useState<string>('');

  // Update clicked section when scrolling changes active section
  useEffect(() => {
    if (activeSection) {
      setClickedSection(activeSection);
    }
  }, [activeSection]);

  const handleTitleClick = () => {
    setClickedSection('top');
    
    // Try to find the H1 with the title text and scroll to it
    const h1Elements = document.querySelectorAll('h1');
    if (h1Elements.length > 0) {
      h1Elements[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSectionClick = (anchor: string) => {
    setClickedSection(anchor);
  };

  return (
    <div className="h-screen w-72 bg-card/50 backdrop-blur-sm">
      <ScrollArea className="h-screen">
        <nav className="p-3 pt-4 pb-64">
          {toc.length === 0 && !title ? (
            <p className="text-sm text-muted-foreground px-2">No sections available</p>
          ) : (
            <ul className="space-y-1">
              {title && (
                <li>
                  <button
                    onClick={handleTitleClick}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-2 py-2.5 text-base font-semibold transition-colors w-full text-left',
                      clickedSection === 'top' ? 'text-white' : 'text-[#ababab] hover:text-white'
                    )}
                  >
                    <span className="w-1.5 flex-shrink-0">
                      {clickedSection === 'top' && <span className="h-1.5 w-1.5 rounded-full bg-white block"></span>}
                    </span>
                    <span className="leading-tight">{title}</span>
                  </button>
                </li>
              )}
              {toc.map((item) => (
                <TocItemComponent
                  key={item.anchor}
                  item={item}
                  clickedSection={clickedSection}
                  onSectionClick={handleSectionClick}
                  depth={0}
                />
              ))}
            </ul>
          )}
        </nav>
      </ScrollArea>
    </div>
  );
}

interface TocItemComponentProps {
  item: TocItem;
  clickedSection: string;
  onSectionClick: (anchor: string) => void;
  depth?: number;
}

function TocItemComponent({ item, clickedSection, onSectionClick, depth = 0 }: TocItemComponentProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = clickedSection === item.anchor;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSectionClick(item.anchor);
    
    const element = document.getElementById(item.anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <li>
      <a
        href={`#${item.anchor}`}
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
          isActive ? 'text-white font-medium' : 'text-[#ababab] hover:text-white',
          depth > 0 && 'ml-3'
        )}
      >
        <span className="w-1.5 flex-shrink-0">
          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white block"></span>}
        </span>
        <span className="leading-tight">{item.title}</span>
      </a>
      {/* Always show children, no collapse/expand */}
      {hasChildren && (
        <ul className="space-y-1 mt-1">
          {item.children.map((child) => (
            <TocItemComponent
              key={child.anchor}
              item={child}
              clickedSection={clickedSection}
              onSectionClick={onSectionClick}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
