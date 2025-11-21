
import React, { useState, useRef } from 'react';
import { generateImageFromPrompt, generateVideoFromPrompt } from '../services/geminiService';
import { Loader2, Download, Sparkles, ImageIcon, AlertCircle, Video, Film, Image as ImageIconLucide } from 'lucide-react';
import { COST_PER_IMAGE, COST_PER_VIDEO } from '../types';

interface ImageGeneratorProps {
  canGenerate: (cost: number) => boolean;
  onConsumeCredit: (cost: number) => void;
  onOpenSubscription: (reason: string) => void;
}

type Mode = 'image' | 'video';
type AspectRatio = '16:9' | '9:16';

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ 
  canGenerate, 
  onConsumeCredit, 
  onOpenSubscription 
}) => {
  const [mode, setMode] = useState<Mode>('image');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const cost = mode === 'image' ? COST_PER_IMAGE : COST_PER_VIDEO;

    if (!canGenerate(cost)) {
      onOpenSubscription(`You need ${cost} credits to generate a ${mode}. Please upgrade.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultUrl(null);
    setLoadingMessage(mode === 'image' ? 'Creating Masterpiece...' : 'Directing Scene (This takes a moment)...');
    
    try {
      onConsumeCredit(cost);
      let result;
      if (mode === 'image') {
        result = await generateImageFromPrompt(prompt);
      } else {
        result = await generateVideoFromPrompt(prompt, aspectRatio);
      }
      setResultUrl(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to generate ${mode}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultUrl) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = `nexaguru-${mode}-${Date.now()}.${mode === 'image' ? 'jpg' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-700">
      
      {/* Mode Switcher */}
      <div className="flex p-1 bg-black/40 rounded-xl mb-4 border border-white/10 w-full sm:w-fit mx-auto">
        <button
          onClick={() => { setMode('image'); setError(null); }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            mode === 'image' 
              ? 'bg-royal-gold text-black shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIconLucide size={16} />
          <span>Image</span>
        </button>
        <button
          onClick={() => { setMode('video'); setError(null); }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            mode === 'video' 
              ? 'bg-royal-gold text-black shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Video size={16} />
          <span>Veo Video</span>
        </button>
      </div>

      {/* Input Card */}
      <div className="glass p-4 sm:p-6 rounded-2xl border border-white/10 relative group hover:border-royal-gold/30 transition-colors">
        
        <div className="absolute top-4 right-4 text-xs font-mono text-royal-gold/70 border border-royal-gold/20 px-2 py-1 rounded">
           Cost: {mode === 'image' ? COST_PER_IMAGE : COST_PER_VIDEO} Credits
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={mode === 'image' 
            ? "Describe your imagination here (Hindi, Marathi, English supported)..." 
            : "Describe the motion video scene you want to create..."}
          className="w-full bg-transparent text-white placeholder-gray-500 min-h-[120px] sm:min-h-[140px] resize-none focus:outline-none text-base sm:text-lg leading-relaxed"
          style={{ fontSize: '16px' }} /* Prevents iOS zoom */
        />

        {/* Video Controls */}
        {mode === 'video' && (
          <div className="flex flex-wrap gap-3 mb-4 animate-in slide-in-from-top-2">
             <span className="text-xs text-gray-400 uppercase tracking-wider self-center mr-2">Aspect Ratio:</span>
             <button 
               onClick={() => setAspectRatio('16:9')}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${aspectRatio === '16:9' ? 'bg-white/10 border-royal-gold text-royal-gold' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
             >
               16:9 Landscape
             </button>
             <button 
               onClick={() => setAspectRatio('9:16')}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${aspectRatio === '9:16' ? 'bg-white/10 border-royal-gold text-royal-gold' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
             >
               9:16 Portrait
             </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-500/10 p-2 rounded-lg">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end mt-2">
           <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className={`
              w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300
              ${!prompt.trim() || isLoading 
                ? 'bg-white/10 text-gray-500 cursor-not-allowed' 
                : 'bg-royal-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {mode === 'image' ? 'GENERATING...' : 'CREATING VIDEO...'}
              </>
            ) : (
              <>
                {mode === 'image' ? <Sparkles size={18} /> : <Film size={18} />}
                {mode === 'image' ? 'GENERATE IMAGE' : 'GENERATE VEO VIDEO'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="mt-8 flex justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-royal-gold/30 blur-xl rounded-full animate-pulse"></div>
              <Loader2 size={48} className="text-royal-gold animate-spin relative z-10" />
            </div>
            <p className="text-royal-gold text-sm animate-pulse font-medium tracking-widest uppercase text-center">
              {loadingMessage}
            </p>
          </div>
        ) : resultUrl ? (
          <div className="w-full max-w-lg bg-black p-2 rounded-2xl border border-royal-gold/30 shadow-2xl animate-in zoom-in-95 duration-500">
            {mode === 'image' ? (
              <img 
                src={resultUrl} 
                alt="Generated Art" 
                className="w-full h-auto rounded-xl"
              />
            ) : (
              <video 
                src={resultUrl} 
                controls 
                autoPlay 
                loop
                className="w-full h-auto rounded-xl bg-gray-900"
              />
            )}
            
            <button 
              onClick={handleDownload}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold hover:bg-royal-gold transition-colors"
            >
              <Download size={18} />
              Download {mode === 'image' ? 'Image' : 'Video'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 opacity-40">
            {mode === 'image' ? <ImageIcon size={48} className="text-white mb-2" /> : <Film size={48} className="text-white mb-2" />}
            <p className="text-sm text-gray-400">Your {mode} masterpiece will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
