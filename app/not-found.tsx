'use client';

import { useRouter } from 'next/navigation';
import { BrandShader } from '@/components/BrandShader';
import { GitHubStarButton } from '@/components/GitHubStarButton';
import { DiscordButton } from '@/components/DiscordButton';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center relative">
        {/* Social Buttons - Top Right */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <DiscordButton />
          <GitHubStarButton />
        </div>

        <div className="text-center space-y-6">
          {/* ColorPanels Shader */}
          <div className="mx-auto">
            <BrandShader size="large" />
          </div>

          {/* Text */}
          <h2 className="text-3xl font-light text-foreground mt-8">
            This page doesn't exist... yet
          </h2>

          {/* Return Home Button */}
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            size="lg"
            className="mt-6"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to home
          </Button>
        </div>
      </div>
    </div>
  );
}

