
import React, { useState } from 'react';
import { generateImageFromPrompt } from '../services/geminiService';
import { Loader2, Download, Sparkles, ImageIcon, AlertCircle } from 'lucide-react';

interface ImageGeneratorProps {
  canGenerate: boolean;
  onConsumeCredit: () => void;
  onOpenSubscription: (reason: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ 
  canGenerate, 
  onConsumeCredit, 
  onOpenSubscription 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!canGenerate) {
      onOpenSubscription("Your credits are finished. Please upgrade your plan.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setImage(null);
    
    try {
      onConsumeCredit();
      const result = await generateImageFromPrompt(prompt);
      setImage(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = `nexaguru-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-700">
      
      {/* Input Card */}
      <div className="glass p-4 sm:p-6 rounded-2xl border border-white/10 relative group hover:border-royal-gold/30 transition-colors">
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your imagination here..."
          className="w-full bg-transparent text-white placeholder-gray-500 min-h-[120px] sm:min-h-[140px] resize-none focus:outline-none text-base sm:text-lg leading-relaxed"
          style={{ fontSize: '16px' }} /* Prevents iOS zoom */
        />

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
                GENERATING...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                GENERATE IMAGE
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
            <p className="text-royal-gold text-sm animate-pulse font-medium tracking-widest uppercase">Creating Masterpiece...</p>
          </div>
        ) : image ? (
          <div className="w-full max-w-lg bg-black p-2 rounded-2xl border border-royal-gold/30 shadow-2xl animate-in zoom-in-95 duration-500">
            <img 
              src={image} 
              alt="Generated Art" 
              className="w-full h-auto rounded-xl"
            />
            <button 
              onClick={handleDownload}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold hover:bg-royal-gold transition-colors"
            >
              <Download size={18} />
              Download Image
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 opacity-40">
            <ImageIcon size={48} className="text-white mb-2" />
            <p className="text-sm text-gray-400">Your masterpiece will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;