
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
    const saved = localStorage.getItem('cadence_view_mode');
    return (saved as ViewMode) || 'landing';
  });

  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('cadence_state');
    return saved ? JSON.parse(saved) : {
      onboardingComplete: false,
      profile: null,
      recommendations: [],
      streak: 94 // Used as retention score in barber view
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('cadence_state', JSON.stringify(appState));
    localStorage.setItem('cadence_view_mode', viewMode);
  }, [appState, viewMode]);

  const handleConsultationComplete = async (profile: UserProfile) => {
    setIsLoading(true);
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
          <div className="flex items-center gap-12">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setViewMode('landing')}
            >
              <span className="iconify text-[#c0563b] text-4xl" data-icon="solar:scissors-bold-duotone"></span>
              <span className="text-3xl font-black text-[#161616] tracking-tighter">Cadence</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-1 bg-[#e5e4e0] p-1.5 rounded-full">
              {viewMode === 'barber' ? (
                <>
                  {['Dashboard', 'Calendar', 'Clients', 'Settings'].map(item => (
                    <button key={item} className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${item === 'Dashboard' ? 'bg-white text-[#161616]' : 'text-[#555] hover:bg-white/50'}`}>
                      {item}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {['Features', 'Use Cases', 'Resources', 'Pricing'].map(item => (
                    <button key={item} className="px-5 py-1.5 rounded-full text-xs font-bold text-[#161616] hover:bg-white transition-all">
                      {item}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {viewMode === 'landing' ? (
               <>
                 <button
                  onClick={() => setViewMode('barber')}
                  className="text-xs font-black uppercase text-[#161616] px-4 hover:text-[#c0563b] transition-colors"
                >
                  Demo
                </button>
                 <Button variant="primary" onClick={() => setViewMode('landing')}>Start free trial</Button>
               </>
             ) : (
               <>
                 <button className="text-[#161616] hover:text-[#c0563b] transition-colors">
                    <span className="iconify text-2xl" data-icon="solar:bell-bing-bold-duotone"></span>
                 </button>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setViewMode(viewMode === 'barber' ? 'client' : 'barber')}
                      className="text-[10px] font-black uppercase text-slate-400 hover:text-[#c0563b]"
                    >
                      Switch View
                    </button>
                    <button className="flex items-center gap-3 px-2 py-2 rounded-full border border-[#e5e4e0] bg-white hover:shadow-md transition-all">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                        {viewMode === 'barber' ? (
                          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                        ) : (
                          appState.profile?.name?.[0] || 'U'
                        )}
                      </div>
                    </button>
                 </div>
               </>
             )}
          </div>
        </div>
      </nav>

      <main className="pb-24">
        {viewMode === 'landing' && (
          <Consultation onComplete={handleConsultationComplete} />
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
                 <span className="text-xl font-black text-[#161616] tracking-tighter">Cadence</span>
               </div>
               <p className="text-[#555] max-w-xs font-medium leading-relaxed">Smart scheduling for barbers. Keep your chair full and your clients coming back.</p>
               <div className="flex gap-5 opacity-50 items-center">
                  <span className="iconify text-3xl text-[#161616]" data-icon="solar:calendar-bold-duotone"></span>
                  <span className="iconify text-3xl text-[#161616]" data-icon="solar:bell-bing-bold-duotone"></span>
                  <span className="iconify text-3xl text-[#161616]" data-icon="solar:chart-2-bold-duotone"></span>
                  <span className="iconify text-3xl text-[#161616]" data-icon="solar:users-group-rounded-bold-duotone"></span>
               </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-[#161616]">For Barbers</h5>
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
             <span>© 2025 Cadence. Built for barbers.</span>
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
