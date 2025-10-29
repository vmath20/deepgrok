'use client';

import { GrainGradient } from '@paper-design/shaders-react';
import { useEffect, useState } from 'react';

export function HeroGradient() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const backgroundColor = isDark ? '#000A0F' : '#FFFFFF';

  return (
    <GrainGradient 
      colors={['#C4730B', '#BDAD5F', '#D8CCC7']} 
      colorBack="#00000000" 
      speed={1} 
      scale={1} 
      rotation={0} 
      offsetX={0} 
      offsetY={0} 
      softness={0.48} 
      intensity={0} 
      noise={0} 
      shape="wave" 
      style={{ 
        backgroundColor, 
        borderRadius: '0px', 
        height: '450px', 
        width: '100vw'
      }} 
    />
  );
}

