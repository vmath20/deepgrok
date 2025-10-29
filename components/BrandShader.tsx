'use client';

import { ColorPanels } from '@paper-design/shaders-react';
import { useEffect, useState } from 'react';

interface BrandShaderProps {
  size?: 'small' | 'large';
}

export function BrandShader({ size = 'large' }: BrandShaderProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check current theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const dimensions = size === 'small' 
    ? { height: '40px', width: '40px' }
    : { height: '320px', width: '480px' };

  const backgroundColor = isDark ? '#000000' : '#FFFFFF';

  return (
    <ColorPanels 
      colors={['#ff9d00', '#fd4f30', '#809bff', '#6d2eff', '#333aff', '#f15cff', '#ffd557']} 
      colorBack="#00000000" 
      speed={0.5} 
      scale={0.8} 
      density={3} 
      angle1={0} 
      angle2={0} 
      length={1.1} 
      edges={false}
      blur={0} 
      fadeIn={1} 
      fadeOut={0.3} 
      gradient={0} 
      rotation={0} 
      offsetX={0} 
      offsetY={0} 
      style={{ 
        backgroundColor, 
        ...dimensions,
        borderRadius: size === 'small' ? '8px' : '16px'
      }} 
    />
  );
}
