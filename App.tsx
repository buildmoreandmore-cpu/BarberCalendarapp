
import React, { useState, useEffect } from 'react';
import { UserProfile, AppState } from './types';
import { Consultation } from './components/Consultation';
import { Dashboard } from './components/Dashboard';
import { BarberDashboard } from './components/BarberDashboard';
import { getStyleRecommendations } from './services/geminiService';
import { Button } from './components/Button';

type ViewMode = 'landing' | 'client' | 'barber';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('lineup_view_mode');
    return (saved as ViewMode) || 'landing';
  });

  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('lineup_state');
    return saved ? JSON.parse(saved) : {
      onboardingComplete: false,
      profile: null,
      recommendations: [],
      streak: 94 // Used as retention score in barber view
    };
  });

  // Demo mode state
  const [clientDemoMode, setClientDemoMode] = useState(false);

  // Demo mode launcher for client view - starts consultation flow
  const launchClientDemo = () => {
    // Reset state and start consultation at step 1
    setAppState({
      onboardingComplete: false,
      profile: null,
      recommendations: [],
      streak: 94
    });
    setClientDemoMode(true);
    setViewMode('landing');
  };

  const [isLoading, setIsLoading] = useState(false);
  const [showClientNotifications, setShowClientNotifications] = useState(false);

  // Mock client notifications
  const clientNotifications = [
    { id: '1', type: 'confirmed', message: 'Your appointment on Jan 12 has been confirmed by James', timestamp: '2 hours ago', read: false },
    { id: '2', type: 'reminder', message: 'Reminder: Haircut tomorrow at 10:00 AM', timestamp: '1 day ago', read: true },
    { id: '3', type: 'tip', message: 'Tip: Add your appointment to your calendar so you don\'t forget', timestamp: '2 days ago', read: true }
  ];
  const unreadClientNotifications = clientNotifications.filter(n => !n.read).length;

  useEffect(() => {
    localStorage.setItem('lineup_state', JSON.stringify(appState));
    localStorage.setItem('lineup_view_mode', viewMode);
  }, [appState, viewMode]);

  const handleConsultationComplete = async (profile: UserProfile) => {
    setIsLoading(true);
    setClientDemoMode(false); // Reset demo mode
    try {
      const recommendations = await getStyleRecommendations(profile);
      setAppState({
        ...appState,
        profile,
        onboardingComplete: true,
        recommendations
      });
      setViewMode('client');
    } catch (error) {
      console.error("Consultation processing failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    if (!appState.profile) return;
    setIsLoading(true);
    const recs = await getStyleRecommendations(appState.profile);
    setAppState(prev => ({ ...prev, recommendations: recs }));
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#f3f2ee] flex flex-col items-center justify-center z-50">
        <div className="relative mb-8">
           <span className="iconify text-[#c0563b]" data-icon="solar:scissors-bold-duotone" style={{ fontSize: '80px' }}></span>
           <div className="absolute inset-0 bg-[#c0563b]/10 blur-3xl rounded-full -z-10 animate-pulse"></div>
        </div>
        <h2 className="text-4xl font-extrabold text-[#161616] mb-2 tracking-tight">Syncing Schedule</h2>
        <p className="text-[#555] font-medium animate-pulse uppercase tracking-widest text-xs">Optimizing client cycles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ee] text-[#161616] selection:bg-[#c0563b] selection:text-white">
      {/* Navigation - Kit Style */}
      <nav className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setViewMode('landing')}
          >
            <div className="flex items-center gap-2">
              <span className="iconify text-[#c0563b] text-4xl" data-icon="solar:scissors-bold-duotone"></span>
              <span className="text-3xl font-black text-[#161616] tracking-tighter">Lineup</span>
            </div>
            <span className="px-2 py-0.5 bg-[#161616] text-white text-[10px] font-bold uppercase tracking-wider rounded">Demo</span>
          </div>
          
          <div className="flex items-center gap-4">
             {viewMode === 'landing' ? (
               <>
                 <button
                   onClick={() => setViewMode('barber')}
                   className="hidden md:block text-xs font-bold text-[#555] hover:text-[#c0563b] transition-colors"
                 >
                   Stylist Dashboard
                 </button>
                 <Button variant="primary" onClick={launchClientDemo}>
                   Take the Lifestyle Quiz
                 </Button>
               </>
             ) : (
               <>
                 <div className="flex items-center gap-1 bg-[#e5e4e0] p-1 rounded-full">
                   <button
                     onClick={launchClientDemo}
                     className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'client' ? 'bg-white text-[#161616] shadow-sm' : 'text-[#555] hover:text-[#161616]'}`}
                   >
                     Client
                   </button>
                   <button
                     onClick={() => setViewMode('barber')}
                     className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'barber' ? 'bg-white text-[#161616] shadow-sm' : 'text-[#555] hover:text-[#161616]'}`}
                   >
                     Stylist
                   </button>
                 </div>
                 <div className="relative">
                   <button
                     onClick={() => setShowClientNotifications(!showClientNotifications)}
                     className="text-[#161616] hover:text-[#c0563b] transition-colors relative"
                   >
                     <span className="iconify text-2xl" data-icon="solar:bell-bing-bold-duotone"></span>
                     {unreadClientNotifications > 0 && (
                       <span className="absolute -top-1 -right-1 bg-[#c0563b] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                         {unreadClientNotifications}
                       </span>
                     )}
                   </button>

                   {/* Notification Dropdown */}
                   {showClientNotifications && viewMode === 'client' && (
                     <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e5e4e0] overflow-hidden z-50">
                       <div className="p-4 border-b border-[#e5e4e0] flex items-center justify-between">
                         <h3 className="font-bold text-[#161616]">Notifications</h3>
                         <button className="text-xs text-[#c0563b] font-bold">Mark all read</button>
                       </div>
                       <div className="max-h-80 overflow-y-auto">
                         {clientNotifications.map(notif => (
                           <div
                             key={notif.id}
                             className={`p-4 border-b border-[#f3f2ee] hover:bg-[#f3f2ee] transition-colors ${!notif.read ? 'bg-[#fbeee0]/30' : ''}`}
                           >
                             <div className="flex items-start gap-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                 notif.type === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                                 notif.type === 'reminder' ? 'bg-orange-100 text-orange-600' :
                                 'bg-blue-100 text-blue-600'
                               }`}>
                                 <span className="iconify text-lg" data-icon={
                                   notif.type === 'confirmed' ? 'solar:check-circle-bold' :
                                   notif.type === 'reminder' ? 'solar:alarm-bold' :
                                   'solar:lightbulb-bolt-bold'
                                 }></span>
                               </div>
                               <div className="flex-1">
                                 <p className="text-sm text-[#161616]">{notif.message}</p>
                                 <p className="text-xs text-slate-400 mt-1">{notif.timestamp}</p>
                               </div>
                               {!notif.read && (
                                 <div className="w-2 h-2 rounded-full bg-[#c0563b] flex-shrink-0 mt-2"></div>
                               )}
                             </div>
                           </div>
                         ))}
                       </div>
                       <div className="p-3 bg-[#f3f2ee] text-center">
                         <button className="text-xs font-bold text-[#c0563b]">View all notifications</button>
                       </div>
                     </div>
                   )}
                 </div>
                 <button className="flex items-center gap-3 px-2 py-2 rounded-full border border-[#e5e4e0] bg-white hover:shadow-md transition-all">
                   <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                     {viewMode === 'barber' ? (
                       <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                     ) : (
                       appState.profile?.name?.[0] || 'M'
                     )}
                   </div>
                 </button>
               </>
             )}
          </div>
        </div>
      </nav>

      <main className="pb-24">
        {viewMode === 'landing' && (
          <Consultation
            onComplete={handleConsultationComplete}
            onClientDemo={launchClientDemo}
            onBarberDemo={() => setViewMode('barber')}
            startAtStep={clientDemoMode ? 1 : 0}
          />
        )}
        {viewMode === 'client' && (
          <Dashboard state={appState} onRefresh={refreshRecommendations} />
        )}
        {viewMode === 'barber' && (
          <BarberDashboard />
        )}
      </main>

      <footer className="border-t border-[#e5e4e0] py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
             <div className="space-y-6">
               <div className="flex items-center gap-2">
                 <span className="iconify text-[#c0563b] text-2xl" data-icon="solar:scissors-bold-duotone"></span>
                 <span className="text-xl font-black text-[#161616] tracking-tighter">Lineup</span>
               </div>
               <p className="text-[#555] max-w-xs font-medium leading-relaxed">Smart scheduling for stylists. Keep your chair full and your clients coming back.</p>
               <div className="flex gap-5 opacity-50 items-center">
                  <span className="iconify text-3xl text-[#161616]" data-icon="solar:calendar-bold-duotone"></span>
                  <span className="iconify text-3xl text-[#161616]" data-icon="solar:bell-bing-bold-duotone"></span>
                  <span className="iconify text-3xl text-[#161616]" data-icon="solar:chart-2-bold-duotone"></span>
                  <span className="iconify text-3xl text-[#161616]" data-icon="solar:users-group-rounded-bold-duotone"></span>
               </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-[#161616]">For Stylists</h5>
                   <ul className="space-y-2 text-xs font-bold text-[#555]">
                      <li><a href="#" className="hover:text-[#c0563b]">Smart Scheduling</a></li>
                      <li><a href="#" className="hover:text-[#c0563b]">Client Management</a></li>
                      <li><a href="#" className="hover:text-[#c0563b]">Auto Reminders</a></li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-[#161616]">Support</h5>
                   <ul className="space-y-2 text-xs font-bold text-[#555]">
                      <li><a href="#" className="hover:text-[#c0563b]">Help Center</a></li>
                      <li><a href="#" className="hover:text-[#c0563b]">Contact Us</a></li>
                      <li><a href="#" className="hover:text-[#c0563b]">FAQ</a></li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-[#161616]">Legal</h5>
                   <ul className="space-y-2 text-xs font-bold text-[#555]">
                      <li><a href="#" className="hover:text-[#c0563b]">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-[#c0563b]">Terms of Service</a></li>
                   </ul>
                </div>
             </div>
          </div>
          <div className="pt-12 border-t border-[#f3f2ee] flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#ccc]">
             <span>© 2026 Lineup. Built for stylists.</span>
             <div className="flex gap-4">
                <a href="#" className="hover:text-[#c0563b]"><span className="iconify" data-icon="solar:letter-bold-duotone"></span></a>
                <a href="#" className="hover:text-[#c0563b]"><span className="iconify" data-icon="mdi:instagram"></span></a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
