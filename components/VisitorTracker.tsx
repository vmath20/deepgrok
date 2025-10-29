'use client';

import { useEffect } from 'react';
import { trackVisitor } from '@/lib/analytics';

export function VisitorTracker() {
  useEffect(() => {
    // Track visitor on component mount
    trackVisitor();
  }, []);

  return null; // This component doesn't render anything
}

