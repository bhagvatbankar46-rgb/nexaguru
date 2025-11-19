
import React, { useState } from 'react';
import { X, Gift, Check, AlertCircle } from 'lucide-react';

interface GiftCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (code: string) => { success: boolean; message: string };
}

const GiftCodeModal: React.FC<GiftCodeModalProps> = ({ isOpen, onClose, onRedeem }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!code.trim()) return;
    const result = onRedeem(code.trim());
    setStatus(result.success ? 'success' : 'error');
    setMsg(result.message);
    
    if (result.success) {
      setTimeout(() => {
        onClose();
        setCode('');
        setStatus('idle');
        setMsg('');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 font-poppins">
      <div className="glass-strong w-full max-w-md rounded-2xl p-6 relative border border-royal-gold/30 text-center shadow-[0_0_50px_rgba(212,175,55,0.1)]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-300"
        >
          <X size={24} />
        </button>
        
        <div className="flex justify-center mb-4">
            <div className="p-4 bg-royal-gold/10 rounded-full border border-royal-gold/30">
                <Gift size={32} className="text-royal-gold" />
            </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 font-royal">Redeem Gift Code</h2>
        <p className="text-gray-400 text-sm mb-6">Enter your exclusive code to unlock bonus credits.</p>

        <div className="relative mb-4">
            <input 
                type="text" 
                value={code}
                onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setStatus('idle');
                    setMsg('');
                }}
                placeholder="ENTER CODE"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-center text-lg tracking-widest font-bold text-white focus:border-royal-gold focus:outline-none transition-colors placeholder-gray-600"
            />
        </div>

        {status === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-sm mb-4 animate-pulse bg-red-900/20 py-2 rounded-lg border border-red-500/20">
                <AlertCircle size={16} />
                {msg}
            </div>
        )}

        {status === 'success' && (
             <div className="flex items-center justify-center gap-2 text-green-400 text-sm mb-4 animate-in zoom-in bg-green-900/20 py-2 rounded-lg border border-green-500/20">
                <Check size={16} />
                {msg}
            </div>
        )}

        <button 
            onClick={handleSubmit}
            disabled={!code || status === 'success'}
            className="w-full py-3 bg-gradient-to-r from-royal-gold to-[#f9e8b6] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-royal"
        >
            {status === 'success' ? 'REDEEMED' : 'REDEEM CODE'}
        </button>

      </div>
    </div>
  );
};

export default GiftCodeModal;
