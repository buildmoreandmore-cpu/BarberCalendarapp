
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button } from './Button';

interface ConsultationProps {
  onComplete: (profile: UserProfile) => void;
}

export const Consultation: React.FC<ConsultationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0 is Landing Page
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    hairType: 'straight',
    growthRate: 'average',
    weeklyRhythm: 'consistent',
    lastCutDate: new Date().toISOString().split('T')[0]
  });

  const nextStep = () => setStep(prev => prev + 1);
  
  const finish = () => {
    if (profile.name && profile.hairType && profile.growthRate) {
      onComplete(profile as UserProfile);
    }
  };

  if (step === 0) {
    return (
      <div className="bg-[#f3f2ee]">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-extrabold text-[#161616] tracking-tight leading-[0.9]">
              Your clients, <br/> always <span className="italic">fresh.</span>
            </h1>
            <p className="text-xl text-[#161616] max-w-md leading-relaxed">
              Cadence learns your clients' schedules, events, and lifestyle—then books them at the perfect time. <span className="font-bold underline decoration-[#c0563b] decoration-2 underline-offset-4">Full chairs, zero chasing.</span>
            </p>
            <div className="flex flex-col items-start gap-4">
              <Button variant="primary" onClick={nextStep} className="px-10 py-4 text-lg">
                Start free trial
              </Button>
              <span className="text-xs text-slate-500 font-medium ml-4">No credit card required</span>
            </div>
          </div>
          
          <div className="relative">
            {/* Premium On-Brand Calendar */}
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl animate-fade-in-up border border-[#e5e4e0]">
              {/* Header with gradient accent */}
              <div className="bg-gradient-to-r from-[#161616] to-[#2a2a2a] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#c0563b] flex items-center justify-center">
                      <span className="iconify text-white text-2xl" data-icon="solar:calendar-bold"></span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">January 2025</h3>
                      <p className="text-slate-400 text-xs font-semibold">Your booking calendar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-xs font-bold text-white">Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Body */}
              <div className="p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={i} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">{day}</div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Week 1 */}
                  {[null, null, null, 1, 2, 3, 4].map((day, i) => (
                    <div key={`w1-${i}`} className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold ${day ? 'bg-[#f3f2ee] text-[#161616] hover:bg-[#e5e4e0] transition-colors cursor-pointer' : ''}`}>
                      {day && <span>{day}</span>}
                    </div>
                  ))}

                  {/* Week 2 */}
                  {[5, 6, 7, 8, 9, 10, 11].map((day, i) => {
                    const bookings = {6: 3, 7: 5, 9: 4, 10: 6};
                    const count = bookings[day as keyof typeof bookings];
                    return (
                      <div key={`w2-${i}`} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer ${count ? 'bg-[#fbeee0] text-[#c0563b] animate-pop-in' : 'bg-[#f3f2ee] text-[#161616] hover:bg-[#e5e4e0]'}`} style={count ? {animationDelay: `${0.3 + i * 0.08}s`, opacity: 0} : {}}>
                        <span>{day}</span>
                        {count && <div className="w-1.5 h-1.5 rounded-full bg-[#c0563b] mt-0.5"></div>}
                      </div>
                    );
                  })}

                  {/* Week 3 - Current Week */}
                  {[12, 13, 14, 15, 16, 17, 18].map((day, i) => {
                    const isToday = day === 15;
                    const bookings = {13: 4, 14: 5, 15: 7, 16: 3, 17: 5};
                    const count = bookings[day as keyof typeof bookings];
                    return (
                      <div key={`w3-${i}`} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer ${isToday ? 'bg-[#c0563b] text-white shadow-lg shadow-[#c0563b]/30 scale-110 animate-pulse-booking' : count ? 'bg-[#fbeee0] text-[#c0563b] animate-pop-in' : 'bg-[#f3f2ee] text-[#161616] hover:bg-[#e5e4e0]'}`} style={count && !isToday ? {animationDelay: `${0.6 + i * 0.08}s`, opacity: 0} : {}}>
                        <span className={isToday ? 'text-base' : ''}>{day}</span>
                        {isToday && <span className="text-[7px] font-black uppercase tracking-wider opacity-80">Today</span>}
                        {count && !isToday && <div className="w-1.5 h-1.5 rounded-full bg-[#c0563b] mt-0.5"></div>}
                      </div>
                    );
                  })}

                  {/* Week 4 */}
                  {[19, 20, 21, 22, 23, 24, 25].map((day, i) => {
                    const bookings = {20: 4, 21: 6, 22: 5, 23: 3};
                    const count = bookings[day as keyof typeof bookings];
                    return (
                      <div key={`w4-${i}`} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer ${count ? 'bg-[#fbeee0] text-[#c0563b] animate-pop-in' : 'bg-[#f3f2ee] text-[#161616] hover:bg-[#e5e4e0]'}`} style={count ? {animationDelay: `${0.9 + i * 0.08}s`, opacity: 0} : {}}>
                        <span>{day}</span>
                        {count && <div className="w-1.5 h-1.5 rounded-full bg-[#c0563b] mt-0.5"></div>}
                      </div>
                    );
                  })}

                  {/* Week 5 */}
                  {[26, 27, 28, 29, 30, 31, null].map((day, i) => {
                    const bookings = {27: 2, 28: 4, 29: 3, 30: 5};
                    const count = day ? bookings[day as keyof typeof bookings] : undefined;
                    return (
                      <div key={`w5-${i}`} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all ${day ? (count ? 'bg-[#fbeee0] text-[#c0563b] animate-pop-in cursor-pointer' : 'bg-[#f3f2ee] text-[#161616] hover:bg-[#e5e4e0] cursor-pointer') : ''}`} style={count ? {animationDelay: `${1.2 + i * 0.08}s`, opacity: 0} : {}}>
                        {day && <span>{day}</span>}
                        {count && <div className="w-1.5 h-1.5 rounded-full bg-[#c0563b] mt-0.5"></div>}
                      </div>
                    );
                  })}
                </div>

                {/* Upcoming Appointments Preview */}
                <div className="mt-6 pt-5 border-t border-[#e5e4e0]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Today's Schedule</span>
                    <span className="text-[10px] font-bold text-[#c0563b]">7 appointments</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      {time: '9:00 AM', name: 'Marcus K.', service: 'Fade + Beard'},
                      {time: '10:30 AM', name: 'James T.', service: 'Line Up'},
                      {time: '12:00 PM', name: 'David W.', service: 'Full Service'},
                    ].map((apt, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-[#f3f2ee] animate-pop-in" style={{animationDelay: `${1.5 + i * 0.15}s`, opacity: 0}}>
                        <div className="w-8 h-8 rounded-lg bg-[#c0563b] flex items-center justify-center text-white text-xs font-bold">
                          {apt.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#161616]">{apt.name}</p>
                          <p className="text-[10px] text-slate-500">{apt.service}</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#c0563b]">{apt.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="bg-[#161616] py-32">
          <div className="max-w-7xl mx-auto px-6 text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <h2 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight leading-[0.9]">
              Build a chair <br/> with <span className="text-[#c0563b]">purpose.</span>
            </h2>
            <div className="space-y-6">
              <p className="text-xl text-slate-300 font-medium leading-relaxed">
                You're in the business of maintaining relationships, not just cutting hair. You value your time and the consistency of your income. We do too.
              </p>
              <p className="text-lg text-slate-400">
                Cadence helps you keep your books full without sending a single text—<span className="text-[#c0563b] italic">a smarter workflow.</span>
              </p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 mt-20 flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
             {[
               { name: "Sloane J.", role: "Master Stylist", img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop" },
               { name: "Marcus T.", role: "Shop Owner", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop" },
               { name: "Elena M.", role: "Professional Groomer", img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=400&auto=format&fit=crop" },
               { name: "David K.", role: "Senior Barber", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop" }
             ].map((person, i) => (
               <div key={i} className="min-w-[280px] bg-[#1a1a1a] p-4 rounded-3xl border border-white/5 group">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 grayscale">
                    <img src={person.img} className="w-full h-full object-cover" alt={person.name} />
                  </div>
                  <h4 className="text-white font-bold text-lg">{person.name}</h4>
                  <p className="text-slate-500 text-xs uppercase tracking-widest">{person.role}</p>
               </div>
             ))}
          </div>
        </section>

        {/* Case Study Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 space-y-24">
           <div className="bg-white rounded-[40px] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center shadow-sm border border-[#e5e4e0]">
              <div className="space-y-8">
                <span className="bg-[#fbeee0] text-[#c0563b] px-3 py-1 rounded font-black text-[10px] uppercase tracking-widest">Grow with Cadence</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#161616] leading-[1.1]">
                  Marcus used Cadence to keep his chair 100% booked across three cities.
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={nextStep} variant="primary">Start free trial</Button>
                  <span className="text-xs text-slate-500 flex items-center">No credit card required</span>
                </div>
              </div>
              <div className="bg-[#f3f2ee] rounded-3xl p-6 relative">
                 <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#e5e4e0]">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-[#c0563b] flex items-center justify-center text-white overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="Marcus" />
                      </div>
                      <div>
                        <h4 className="font-bold">Marcus Kay</h4>
                        <p className="text-xs text-slate-500">Master Barber</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                       <div className="h-2 bg-slate-100 rounded-full w-4/5"></div>
                       <div className="h-8 bg-[#c0563b]/10 border border-[#c0563b]/20 rounded-lg flex items-center px-3 gap-2">
                         <span className="iconify text-[#c0563b]" data-icon="solar:calendar-mark-bold-duotone"></span>
                         <span className="text-[10px] font-black uppercase text-[#c0563b]">Smart Booked: Oct 12 - 2:00 PM</span>
                       </div>
                    </div>
                 </div>
                 <div className="absolute -bottom-10 -right-4 bg-[#161616] text-white p-3 rounded-xl text-[10px] font-bold shadow-2xl">
                    Marcus's Smart Schedule
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5e4e0] space-y-4">
                 <h3 className="text-3xl font-extrabold">What's in Marcus's Kit?</h3>
                 <ul className="space-y-4">
                   {['Growth Analysis', 'Event Tracking', 'Auto-Booking', 'Churn Prevention'].map(item => (
                     <li key={item} className="flex items-center gap-3 font-bold text-[#161616]">
                       <span className="iconify text-orange-500" data-icon="solar:check-circle-bold-duotone"></span>
                       {item}
                     </li>
                   ))}
                 </ul>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5e4e0] flex flex-col justify-center text-center space-y-2">
                 <h4 className="text-5xl font-black text-[#161616]">100%</h4>
                 <p className="text-slate-500 font-medium">Chair utilization target met</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5e4e0] space-y-4">
                 <h4 className="text-xl font-bold">Client Breakdown</h4>
                 <div className="flex items-center justify-center py-4">
                    <span className="iconify text-6xl text-[#c0563b]" data-icon="solar:chart-2-bold-duotone"></span>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Recurring</span>
                       <span>85%</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                       <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#c0563b]"></div> Referral</span>
                       <span>15%</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    );
  }

  // Actual Consultation Steps (Using the lighter theme)
  return (
    <div className="max-w-xl mx-auto py-24 px-6">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-12 bg-[#c0563b] rounded"></div>
          <span className="text-xs font-black uppercase tracking-widest text-[#555]">Consultation Phase {step}/4</span>
        </div>
        <h1 className="text-5xl font-extrabold text-[#161616] mb-4 tracking-tight">
          {step === 1 && "Let's start with the basics."}
          {step === 2 && "How does it grow?"}
          {step === 3 && "What's your rhythm?"}
          {step === 4 && "Final calibration."}
        </h1>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-2 tracking-widest">Full Name</label>
              <input 
                type="text"
                placeholder="Marcus Kay"
                className="w-full bg-white border-2 border-[#e5e4e0] rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c0563b] text-[#161616] font-bold"
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['straight', 'wavy', 'curly', 'coily'].map((type) => (
                <button
                  key={type}
                  onClick={() => setProfile({ ...profile, hairType: type as any })}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${profile.hairType === type ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555]'}`}
                >
                  <span className="capitalize font-bold">{type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'slow', label: 'Slow', desc: '1 month between cuts.' },
                { id: 'average', label: 'Average', desc: '2-3 week cycle.' },
                { id: 'fast', label: 'Fast', desc: 'Weekly maintenance.' }
              ].map((rate) => (
                <button
                  key={rate.id}
                  onClick={() => setProfile({ ...profile, growthRate: rate.id as any })}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${profile.growthRate === rate.id ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555]'}`}
                >
                  <div className="font-bold text-lg">{rate.label}</div>
                  <div className="text-sm opacity-60 font-medium">{rate.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'social-weekend', label: 'Social Weekend', desc: 'Peak look for Friday-Sunday.' },
                { id: 'busy-midweek', label: 'Professional Midweek', desc: 'Peak look for Tue-Thu meetings.' },
                { id: 'consistent', label: 'Consistent', desc: 'Stay fresh regardless of day.' }
              ].map((rhythm) => (
                <button
                  key={rhythm.id}
                  onClick={() => setProfile({ ...profile, weeklyRhythm: rhythm.id as any })}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${profile.weeklyRhythm === rhythm.id ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555]'}`}
                >
                  <div className="font-bold text-lg">{rhythm.label}</div>
                  <div className="text-sm opacity-60 font-medium">{rhythm.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-2 tracking-widest">Last Haircut Date</label>
              <input 
                type="date"
                value={profile.lastCutDate}
                className="w-full bg-white border-2 border-[#e5e4e0] rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c0563b] text-[#161616] font-bold"
                onChange={(e) => setProfile({ ...profile, lastCutDate: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="pt-8 flex justify-between items-center">
          <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
          {step < 4 ? (
            <Button variant="dark" onClick={nextStep} disabled={step === 1 && !profile.name}>Continue</Button>
          ) : (
            <Button variant="primary" onClick={finish} className="px-10">Finalize Strategy</Button>
          )}
        </div>
      </div>
    </div>
  );
};
