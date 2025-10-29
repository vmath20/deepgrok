'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GitHubStarButton() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    // Fetch star count from GitHub API
    fetch('https://api.github.com/repos/vmath20/deepgrok')
      .then((res) => res.json())
      .then((data) => {
        setStars(data.stargazers_count || 0);
      })
      .catch((err) => {
        console.error('Failed to fetch GitHub stars:', err);
      });
  }, []);

  const handleClick = () => {
    // Open GitHub repo
    window.open('https://github.com/vmath20/deepgrok', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
      aria-label="GitHub Repository"
    >
      <Image 
        src="/icons8-github-50.svg" 
        alt="GitHub" 
        width={20} 
        height={20}
        className="h-5 w-5"
      />
      <span className="text-sm font-medium">GitHub</span>
      <Star className="h-3.5 w-3.5 text-yellow-500" fill="currentColor" />
      {stars !== null && (
        <span className="text-sm font-medium">{stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}</span>
      )}
    </button>
  );
}

