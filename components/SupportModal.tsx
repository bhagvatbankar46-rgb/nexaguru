import React from 'react';
import { X, Mail, MessageCircle } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 font-poppins">
      <div className="glass-strong w-full max-w-md rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] border border-royal-gold/30 text-center">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-300"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-royal-gold mb-2 font-royal tracking-wide">
          Customer Support
        </h2>
        <p className="text-gray-400 font-light mb-8 text-sm">
          Connect with NexaGuru directly.
        </p>

        <div className="space-y-4 text-left">
          {/* WhatsApp */}
          <a 
            href="https://wa.me/917840928609" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-all group cursor-pointer"
          >
            <div className="p-3 bg-[#25D366]/20 rounded-full text-[#25D366] group-hover:scale-110 transition-transform">
              <MessageCircle size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">WhatsApp Support</p>
              <p className="text-lg font-semibold text-white font-poppins tracking-wide group-hover:text-[#25D366] transition-colors">
                +91 7840928609
              </p>
            </div>
          </a>

          {/* Email */}
          <a 
            href="mailto:bhagvatbankari46@gmail.com"
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group cursor-pointer"
          >
            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-sm sm:text-base font-semibold text-white font-poppins break-all group-hover:text-blue-400 transition-colors">
                bhagvatbankari46@gmail.com
              </p>
            </div>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            Nexa Guru Premium Assistance
          </p>
        </div>

      </div>
    </div>
  );
};

export default SupportModal;