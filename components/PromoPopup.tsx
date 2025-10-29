'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('deepgrok_promo_seen');
    
    if (hasSeenPopup) {
      return;
    }

    // Show popup after 10 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('deepgrok_promo_seen', 'true');
  };

  const handleFollow = () => {
    // Open X.com profile in new tab with follow intent
    window.open('https://x.com/intent/follow?screen_name=theadistar', '_blank');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[101] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative rounded-3xl bg-gradient-to-br from-white to-gray-100 shadow-2xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-10 rounded-full bg-gray-200 p-2 hover:bg-gray-300 transition-colors"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>

          {/* Content */}
          <div className="p-8 pb-6">
            {/* Video Embed */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/fsBt2Q5a8_A?autoplay=0&rel=0"
                title="DeepGrok Introduction"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Text Content */}
            <div className="text-center space-y-3 mb-6">
              <div className="inline-block px-4 py-1.5 bg-gray-200 rounded-full">
                <p className="text-sm font-medium text-gray-700">What's New - October, 2025</p>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Introducing DeepGrok
              </h2>
              
              <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                Open Source Grokipedia
              </p>
            </div>

            {/* Follow Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleFollow}
                size="lg"
                className="rounded-full bg-black hover:bg-gray-800 text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Follow @theadistar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

