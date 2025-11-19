
import React from 'react';
import { Plus } from 'lucide-react';

interface CreditDisplayProps {
  credits: number;
  onAddCredits: () => void;
}

const CreditDisplay: React.FC<CreditDisplayProps> = ({ credits, onAddCredits }) => {
  const isLow = credits < 5;

  return (
    <div className="flex items-center gap-0.5 bg-white/5 border border-white/10 rounded-full p-1 pl-4 pr-1 hover:border-royal-gold/30 transition-all group">
      <div className="flex flex-col mr-3">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold leading-none mb-0.5">Balance</span>
        <span className={`text-sm font-bold leading-none font-mono ${isLow ? 'text-red-400' : 'text-white group-hover:text-royal-gold transition-colors'}`}>
          {credits} Credits
        </span>
      </div>
      <button 
        onClick={onAddCredits}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-royal-gold text-black hover:bg-[#F3E5AB] transition-colors active:scale-95 shadow-lg shadow-black/20"
      >
        <Plus size={14} strokeWidth={3} />
      </button>
    </div>
  );
};

export default CreditDisplay;
