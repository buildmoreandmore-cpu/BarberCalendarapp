
import React, { useEffect, useState } from 'react';
import { AppState, RecommendedSlot } from '../types';
import { Button } from './Button';
import { getStrategistCommentary } from '../services/geminiService';
import { BookingModal } from './BookingModal';

interface DashboardProps {
  state: AppState;
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onRefresh }) => {
  const [commentary, setCommentary] = useState("Analyzing your cycle...");
  const [isCommentaryLoading, setIsCommentaryLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<RecommendedSlot | null>(null);

  useEffect(() => {
    const fetchCommentary = async () => {
      if (state.profile) {
        setIsCommentaryLoading(true);
        const text = await getStrategistCommentary(state.profile, state.recommendations);
        setCommentary(text);
        setIsCommentaryLoading(false);
      }
    };
    fetchCommentary();
  }, [state.profile, state.recommendations]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBookClick = (slot: RecommendedSlot) => {
    setSelectedSlot(slot);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Strategy Header */}
      <section className="bg-white border border-[#e5e4e0] rounded-[32px] p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <span className="iconify text-[#c0563b]" data-icon="solar:magic-stick-bold-duotone" style={{ fontSize: '180px' }}></span>
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
             <span className="bg-[#fbeee0] text-[#c0563b] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Chair Active</span>
             <span className="text-slate-400">•</span>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{state.profile?.hairType} Master</span>
          </div>
          <h1 className="text-5xl font-extrabold text-[#161616] tracking-tight">Welcome, {state.profile?.name.split(' ')[0]}</h1>
          <p className="text-2xl text-slate-600 font-medium leading-tight max-w-3xl italic">
            "{isCommentaryLoading ? "..." : commentary}"
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
             <div className="bg-[#f3f2ee] px-6 py-4 rounded-2xl flex items-center gap-4 border border-[#e5e4e0]">
                <span className="iconify text-orange-600 text-3xl" data-icon="solar:fire-bold-duotone"></span>
                <div>
                   <div className="text-[10px] font-black uppercase text-slate-400">Retention Score</div>
                   <div className="text-xl font-bold">{state.streak}% Loyalty</div>
                </div>
             </div>
             <div className="bg-[#f3f2ee] px-6 py-4 rounded-2xl flex items-center gap-4 border border-[#e5e4e0]">
                <span className="iconify text-[#c0563b] text-3xl" data-icon="solar:clocks-value-bold-duotone"></span>
                <div>
                   <div className="text-[10px] font-black uppercase text-slate-400">Next Slot</div>
                   <div className="text-xl font-bold">Smart Scheduled</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#161616] flex items-center gap-2">
              <span className="iconify text-[#c0563b]" data-icon="solar:calendar-date-bold-duotone"></span>
              Smart Booking Slots
            </h2>
            <button onClick={onRefresh} className="text-[#555] hover:text-[#161616] text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="iconify" data-icon="solar:refresh-bold-duotone"></span> Recalculate
            </button>
          </div>

          <div className="space-y-4">
            {state.recommendations.map((rec, idx) => (
              <div 
                key={idx}
                className={`group p-6 rounded-2xl border-2 transition-all duration-300 ${
                  rec.score === 'optimal' 
                    ? 'bg-white border-[#c0563b] shadow-lg shadow-[#c0563b]/5' 
                    : 'bg-white border-[#e5e4e0] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                      rec.score === 'optimal' ? 'bg-[#c0563b] text-white' : 'bg-[#f3f2ee] text-[#161616]'
                    }`}>
                      <span className="iconify" data-icon="solar:scissors-bold-duotone"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xl font-extrabold text-[#161616]">{formatDate(rec.date)}</span>
                        {rec.score === 'optimal' && (
                           <span className="bg-[#c0563b] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Max Fill</span>
                        )}
                      </div>
                      <p className="text-slate-500 font-medium text-sm leading-snug max-w-sm">{rec.reason}</p>
                    </div>
                  </div>
                  <Button 
                    variant={rec.score === 'optimal' ? 'primary' : 'secondary'} 
                    onClick={() => handleBookClick(rec)}
                  >
                    Confirm Slot
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-[#e5e4e0] rounded-[24px] p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-[#161616] flex items-center gap-2">
              <span className="iconify text-orange-600" data-icon="solar:info-circle-bold-duotone"></span>
              Inventory Analysis
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase text-slate-400">Chair Utilization</span>
                  <span className="text-xs font-bold text-[#c0563b] italic">Peak Capacity</span>
               </div>
               <div className="h-4 bg-[#f3f2ee] rounded-full overflow-hidden p-1">
                  <div className="h-full bg-[#c0563b] rounded-full" style={{ width: '40%' }}></div>
               </div>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Based on current data, your chair has <b>8 open gaps</b> next week. Cadence is currently filling these via growth-triggered outreach.
               </p>
            </div>
            <div className="pt-4 border-t border-[#f3f2ee]">
               <div className="flex gap-3">
                  <span className="iconify text-[#c0563b] shrink-0 mt-1" data-icon="solar:check-read-bold-duotone"></span>
                  <p className="text-xs font-bold text-[#161616]">Outreach automation is active. Churn prediction is down 12% MoM.</p>
               </div>
            </div>
          </div>

          <div className="bg-[#161616] rounded-[24px] p-8 text-white space-y-4">
             <h4 className="text-xl font-bold">Scaling Tactics</h4>
             <ul className="space-y-4">
                {[
                  { icon: 'solar:water-drop-bold-duotone', text: 'Upsell matte clay after-care' },
                  { icon: 'solar:calendar-mark-bold-duotone', text: 'Enable 48hr growth outreach' },
                  { icon: 'solar:star-bold-duotone', text: 'Premium event surge pricing' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <span className="iconify text-[#c0563b]" data-icon={item.icon}></span>
                    <span className="text-xs font-medium text-slate-300">{item.text}</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>

      {selectedSlot && (
        <BookingModal 
          slot={selectedSlot} 
          onClose={() => setSelectedSlot(null)}
          onConfirm={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
};
