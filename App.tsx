
import React, { useState, useEffect } from 'react';
import { INITIAL_CREDITS, COST_PER_IMAGE, User } from './types';
import CreditDisplay from './components/CreditDisplay';
import SubscriptionModal from './components/SubscriptionModal';
import SupportModal from './components/SupportModal';
import GiftCodeModal from './components/GiftCodeModal';
import ImageGenerator from './components/ImageGenerator';
import AdminPanel from './components/AdminPanel';
import AuthScreen from './components/AuthScreen';
import { Crown, Headphones, Gift, Sparkles, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Session
  useEffect(() => {
    const currentUserEmail = localStorage.getItem('royal_current_user');
    const usersStr = localStorage.getItem('royal_users');
    
    if (currentUserEmail && usersStr) {
      const users = JSON.parse(usersStr);
      const currentUser = users[currentUserEmail];
      if (currentUser) {
        setUser(currentUser);
        setCredits(currentUser.credits);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save user data whenever credits change
  const updateUserInStorage = (updatedUser: User) => {
    setUser(updatedUser);
    setCredits(updatedUser.credits);
    
    const usersStr = localStorage.getItem('royal_users');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      users[updatedUser.email] = updatedUser;
      localStorage.setItem('royal_users', JSON.stringify(users));
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCredits(loggedInUser.credits);
    localStorage.setItem('royal_current_user', loggedInUser.email);
  };

  const handleLogout = () => {
    setUser(null);
    setCredits(0);
    localStorage.removeItem('royal_current_user');
  };

  const handleConsumeCredit = () => {
    if (!user) return;
    const newCredits = Math.max(0, user.credits - COST_PER_IMAGE);
    updateUserInStorage({ ...user, credits: newCredits });
  };

  const handleAddCredits = (amount: number) => {
    if (!user) return;
    const newCredits = user.credits + amount;
    updateUserInStorage({ ...user, credits: newCredits });
  };

  const openSubscription = (message?: string) => {
    setSubscriptionMessage(message || null);
    setIsSubscriptionOpen(true);
  };

  const closeSubscription = () => {
    setIsSubscriptionOpen(false);
    setSubscriptionMessage(null);
  };

  const handleRedeemGift = (code: string): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Please login first.' };
    
    if (user.redeemedGift) {
      return { success: false, message: 'You have already used a gift code.' };
    }

    const normalizedCode = code.toUpperCase();
    let bonus = 0;

    if (normalizedCode === 'NEXA0909') bonus = 10;
    else if (normalizedCode === 'GURU1212') bonus = 30;
    else if (normalizedCode === 'SN1010') bonus = 20;
    else return { success: false, message: 'Invalid or expired code.' };

    const updatedUser = { ...user, credits: user.credits + bonus, redeemedGift: true };
    updateUserInStorage(updatedUser);

    return { success: true, message: `Success! ${bonus} credits added.` };
  };

  if (!isInitialized) return null;

  // Show Auth Screen if not logged in
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#0B1120] via-[#0f172a] to-[#020617] text-gray-100 selection:bg-royal-gold/30 selection:text-white pb-20 overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-royal-gold/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B1120]/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
               <div className="p-2 bg-royal-gold/10 rounded-lg border border-royal-gold/20 group-hover:border-royal-gold/50 transition-colors">
                 <Crown className="text-royal-gold" size={24} strokeWidth={2} />
               </div>
               <h1 className="text-xl font-bold tracking-wider text-white font-royal flex flex-col leading-none">
                  <span>NEXA</span>
                  <span className="text-royal-gold text-sm tracking-[0.2em]">GURU</span>
               </h1>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
               
               {/* Desktop/Tablet Menu */}
               <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsGiftOpen(true)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-royal-gold hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                  >
                    <Gift size={18} />
                    <span>Gift Code</span>
                  </button>

                  <button
                    onClick={() => setIsSupportOpen(true)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                  >
                    <Headphones size={18} />
                    <span>Support</span>
                  </button>
               </div>

               {/* Mobile Icons (Visible only on small screens) */}
               <button onClick={() => setIsGiftOpen(true)} className="sm:hidden p-2 text-gray-300 hover:text-royal-gold">
                 <Gift size={20} />
               </button>
               <button onClick={() => setIsSupportOpen(true)} className="sm:hidden p-2 text-gray-300 hover:text-white">
                 <Headphones size={20} />
               </button>

              <div className="h-8 w-px bg-white/10 mx-2"></div>

              <CreditDisplay 
                credits={credits} 
                onAddCredits={() => openSubscription()} 
              />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="ml-2 p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all border border-white/5 hover:border-red-500/30 group"
                title="Logout"
              >
                <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-12 flex flex-col items-center">
        
        {/* Hero Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-royal-gold/5 border border-royal-gold/20 text-royal-gold text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <Sparkles size={12} />
            <span>Next Gen AI Architecture</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-royal text-white mb-6 leading-tight drop-shadow-2xl">
             Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-gold to-[#F3E5AB]">Visual</span> Intelligence
          </h2>
          
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Logged in as <span className="text-white font-medium border-b border-royal-gold/50 pb-0.5">{user.email}</span>. 
            Experience the power of Imagen 4.0 to transform your concepts into high-fidelity digital assets.
          </p>
        </div>

        {/* Tool Container */}
        <div className="w-full relative">
            {/* Decorative border gradient */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-royal-gold/20 to-transparent rounded-3xl opacity-50 pointer-events-none"></div>
            
            <div className="relative bg-[#0B1120]/60 backdrop-blur-sm rounded-3xl p-1 sm:p-2 shadow-2xl">
                <ImageGenerator 
                canGenerate={credits >= COST_PER_IMAGE}
                onConsumeCredit={handleConsumeCredit}
                onOpenSubscription={openSubscription}
                />
            </div>
        </div>

      </main>

      {/* Modals */}
      <SubscriptionModal 
        isOpen={isSubscriptionOpen} 
        onClose={closeSubscription}
        alertMessage={subscriptionMessage}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <GiftCodeModal 
        isOpen={isGiftOpen}
        onClose={() => setIsGiftOpen(false)}
        onRedeem={handleRedeemGift}
      />

      <AdminPanel onAddCredits={handleAddCredits} />

    </div>
  );
};

export default App;
