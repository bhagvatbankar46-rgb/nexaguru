import React, { useState } from 'react';
import { ShieldCheck, Plus } from 'lucide-react';

interface AdminPanelProps {
  onAddCredits: (amount: number) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddCredits }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('49');

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-gray-600 hover:text-royal-gold transition-colors border border-white/5"
        title="Admin Panel"
      >
        <ShieldCheck size={16} />
      </button>
    );
  }

  const handleAdd = () => {
    const val = parseInt(amount);
    if (!isNaN(val) && val > 0) {
      onAddCredits(val);
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-64 glass-strong rounded-xl p-4 border border-white/10 shadow-2xl">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Tools</h4>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">×</button>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-gray-300">Simulate Payment Credit Add:</p>
        <div className="flex gap-2">
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-royal-gold"
          />
          <button 
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;