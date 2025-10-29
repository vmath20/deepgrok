'use client';

import Image from 'next/image';
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
      <Image 
        src="/icons8-discord-50.svg" 
        alt="Discord" 
        width={20} 
        height={20}
        className="h-5 w-5"
      />
    </Button>
  );
}

