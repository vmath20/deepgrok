'use client';

import { useEffect, useState } from 'react';
import { Github, Star } from 'lucide-react';
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
    // Open GitHub repo with star intent
    window.open('https://github.com/vmath20/deepgrok', '_blank');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="gap-2 rounded-full border-border/50 hover:border-border"
    >
      <Github className="h-4 w-4" />
      <Star className="h-3.5 w-3.5" />
      {stars !== null && (
        <span className="text-sm font-medium">{stars.toLocaleString()}</span>
      )}
    </Button>
  );
}

