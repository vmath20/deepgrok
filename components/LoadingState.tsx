'use client';

import { BrandShader } from '@/components/BrandShader';
import { useEffect, useState } from 'react';

export function LoadingState() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* ColorPanels Shader */}
        <div className="mx-auto">
          <BrandShader size="large" />
        </div>

        {/* Loading Text with Animated Dots */}
        <h2 className="text-3xl font-light text-foreground mt-8">
          Loading{dots}
        </h2>
      </div>
    </div>
  );
}

