
import React, { useState, useEffect } from 'react';
import { PLANS, Plan } from '../types';
import { X, Check, AlertCircle, Crown, MessageCircle } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertMessage?: string | null;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, alertMessage }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setShowConfirmation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // CONFIRMATION VIEW (After Payment Click)
  // ---------------------------------------------------------------------------
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 font-poppins">
        <div className="glass-strong w-full max-w-md rounded-2xl p-8 relative text-center border border-royal-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.15)]">
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-300"
            >
              <X size={24} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-[#25D366]/10 rounded-full border border-[#25D366]/30 animate-pulse">
                    <MessageCircle size={48} className="text-[#25D366]" />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4 font-royal tracking-wide">Payment Initiated</h3>
            
            <p className="text-gray-300 mb-8 text-sm sm:text-base leading-relaxed">
                If you have completed the payment, you will definitely receive your credits. 
                To claim them, contact me on WhatsApp at <span className="text-royal-gold font-bold text-lg">7840928609</span>
            </p>

            <a 
                href="https://wa.me/917840928609?text=Hello%20NexaGuru,%20I%20have%20made%20a%20payment%20for%20credits.%20Please%20check."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/30 mb-4"
            >
                <MessageCircle size={20} />
                Contact on WhatsApp
            </a>

            <button 
                onClick={() => setShowConfirmation(false)}
                className="text-sm text-gray-500 hover:text-white transition-colors underline decoration-gray-700 underline-offset-4"
            >
                Back to Plans
            </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // PLAN SELECTION VIEW
  // ---------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 font-poppins">
      <div className="glass-strong w-full max-w-4xl rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] border border-royal-gold/30 text-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-300"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-royal-gold mb-2 font-poppins tracking-wide">
            Buy Credits / Support NexaGuru
          </h2>
          
          {alertMessage ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-full text-red-200 animate-pulse mt-2">
              <AlertCircle size={16} />
              <span className="font-semibold text-sm">{alertMessage}</span>
            </div>
          ) : (
             <p className="text-gray-400 font-light">Choose a plan to unlock premium creation limits.</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {PLANS.map((plan: Plan) => {
             // Generate smart UPI link with amount pre-filled
             const upiLink = `upi://pay?pa=7840928609@ybl&pn=NexaGuru%20AI&cu=INR&am=${plan.price}`;
             
             return (
            <div 
              key={plan.id} 
              className="relative p-6 rounded-2xl text-center transition-transform hover:-translate-y-1 duration-300"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
               {plan.id === 'pro' && (
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-royal-gold text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                   <Crown size={12} /> BEST VALUE
                 </div>
               )}

              <h3 className="text-xl font-semibold text-white mb-2 mt-2">{plan.name}</h3>
              
              <div className="text-4xl font-bold text-royal-gold mb-1">
                ₹{plan.price}
              </div>
              <p className="text-sm text-gray-400 mb-6">{plan.credits} Premium Credits</p>
              
              <div className="text-left space-y-2 mb-8 pl-4">
                 {plan.features.map((f, i) => (
                   <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={14} className="text-royal-gold"/> {f}
                   </div>
                 ))}
              </div>

              {/* Payment Section */}
              <div className="border-t border-white/10 pt-6">
                <p className="text-sm mb-1 text-gray-300">📌 Your UPI ID:</p>
                <p className="font-semibold text-lg text-[#00eaff] mb-4 tracking-wide">
                    7840928609@ybl
                </p>

                <a href={upiLink}
                   target="_blank"
                   rel="noreferrer"
                   onClick={() => setShowConfirmation(true)}
                   className="inline-block w-full py-3 border-2 border-royal-gold text-royal-gold rounded-xl font-semibold text-lg hover:bg-royal-gold hover:text-black transition-all duration-200 active:scale-95"
                >
                  Pay with UPI
                </a>

                <p className="text-[12px] opacity-80 mt-4 text-gray-400">
                  ❤️ Thank you for supporting NexaGuru AI
                </p>
                
                <p className="text-[10px] text-gray-600 italic mt-2">
                  *Screenshot required for activation
                </p>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
