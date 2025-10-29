"use client";

import { SearchBar } from "@/components/SearchBar";
import { BrandShader } from "@/components/BrandShader";
import { Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitHubStarButton } from "@/components/GitHubStarButton";
import { DiscordButton } from "@/components/DiscordButton";

interface TopNavProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  showSearch?: boolean;
  showExport?: boolean;
  onExport?: () => void;
  onCopyMarkdown?: () => void;
}

export function TopNav({ onSearch, isLoading, showSearch = true, showExport = false, onExport, onCopyMarkdown }: TopNavProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo with ColorPanels */}
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className="flex-shrink-0">
              <BrandShader size="small" />
            </div>
            <span className="font-normal tracking-normal" style={{ fontSize: '163%', lineHeight: '150%', letterSpacing: '0%' }}>DeepGrok</span>
          </div>

          {/* Center: Search */}
          {showSearch && (
            <div className="flex-1 max-w-xl">
              <SearchBar onSearch={onSearch} isLoading={isLoading} variant="nav" />
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2 min-w-[220px]">
            {showExport && (
              <>
                <DiscordButton />
                <GitHubStarButton />
                {onCopyMarkdown && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy as Markdown"
                    onClick={onCopyMarkdown}
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                )}
                {onExport && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Export to PDF"
                    onClick={onExport}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
