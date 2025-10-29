'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DiscordButton() {
  const handleClick = () => {
    window.open('https://discord.gg/FYTsbtRpv7', '_blank');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      className="rounded-full border-border/50 hover:border-border"
      aria-label="Join Discord"
    >
      <MessageSquare className="h-5 w-5" />
    </Button>
  );
}

