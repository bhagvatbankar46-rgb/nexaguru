
import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

const InstallGuide: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Detect PWA Install Prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // If already installed or not installable/iOS, hide button
  if (!deferredPrompt && !isIOS) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-royal-gold hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
      >
        <Download size={18} />
        <span className="hidden sm:inline">Download App</span>
      </button>

      {/* iOS Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-strong w-full max-w-sm p-6 rounded-2xl border border-royal-gold/30 relative">
            <button 
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-bold text-royal-gold mb-4 font-royal">Install on iPhone</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <Share size={20} className="text-blue-400" />
                <p>1. Tap the <span className="font-bold text-white">Share</span> button below.</p>
              </div>
              <div className="flex items-center gap-3">
                <PlusSquare size={20} className="text-gray-400" />
                <p>2. Scroll down and tap <span className="font-bold text-white">Add to Home Screen</span>.</p>
              </div>
            </div>
            <div className="mt-6 text-center">
               <p className="text-xs text-gray-500">This adds NexaGuru to your home screen for full screen experience.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallGuide;
