'use client';

import { BrandShader } from '@/components/BrandShader';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface PageNotFoundProps {
  onReturnHome: () => void;
}

export function PageNotFound({ onReturnHome }: PageNotFoundProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
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
          onClick={onReturnHome}
          variant="outline"
          size="lg"
          className="mt-6"
        >
          <Home className="h-4 w-4 mr-2" />
          Return to home
        </Button>
      </div>
    </div>
  );
}

