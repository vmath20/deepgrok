'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function DiscordButton() {
  const handleClick = () => {
    window.open('https://discord.gg/FYTsbtRpv7', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
      aria-label="Join Discord"
    >
      <Image 
        src="/icons8-discord-50.svg" 
        alt="Discord" 
        width={20} 
        height={20}
        className="h-5 w-5 invert brightness-0"
        style={{ filter: 'invert(1) brightness(2)' }}
      />
      <span className="text-sm font-medium">Discord</span>
    </button>
  );
}

