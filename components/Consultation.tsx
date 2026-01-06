
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button } from './Button';

interface ConsultationProps {
  onComplete: (profile: UserProfile) => void;
  onClientDemo?: () => void;
  onBarberDemo?: () => void;
  startAtStep?: number;
}

export const Consultation: React.FC<ConsultationProps> = ({ onComplete, onClientDemo, onBarberDemo, startAtStep = 0 }) => {
  const [step, setStep] = useState(startAtStep); // 0 is Landing Page, 1+ is consultation
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    hairType: 'medium',
    growthRate: 'average',
    weeklyRhythm: 'consistent',
    lastCutDate: new Date().toISOString().split('T')[0]
  });
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const toggleEvent = (eventId: string) => {
    if (eventId === 'none') {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(prev =>
        prev.includes(eventId)
          ? prev.filter(e => e !== eventId)
          : [...prev.filter(e => e !== 'none'), eventId]
      );
    }
  };

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
            <h1 className="text-6xl md:text-8xl font-extrabold text-[#161616] tracking-tight leading-[0.9] hero-animate hero-animate-1">
              Your clients, <br/> always <span className="italic">fresh.</span>
            </h1>
            <p className="text-xl text-[#161616] max-w-md leading-relaxed hero-animate hero-animate-2">
              Lineup learns your clients' schedules, events, and lifestyle—then books them at the perfect time. <span className="font-bold underline decoration-[#c0563b] decoration-2 underline-offset-4">Full chairs, zero chasing.</span>
            </p>
            <div className="flex flex-col items-start gap-4 hero-animate hero-animate-3">
              <Button variant="primary" onClick={nextStep} className="px-10 py-4 text-lg btn-hover">
                Start free trial
              </Button>
              <span className="text-xs text-slate-500 font-medium ml-4">No credit card required</span>
            </div>
          </div>
          
          <div className="relative hero-animate hero-animate-4">
            {/* Premium On-Brand Calendar */}
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl scale-in border border-[#e5e4e0]" style={{animationDelay: '0.3s'}}>
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

                {/* Upcoming Appointments Preview with Context */}
                <div className="mt-6 pt-5 border-t border-[#e5e4e0]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Today's Schedule</span>
                    <span className="text-[10px] font-bold text-[#c0563b]">7 appointments</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      {time: '9:00 AM', name: 'Marcus K.', context: 'Job interview Friday'},
                      {time: '10:30 AM', name: 'James T.', context: 'Wedding Saturday'},
                      {time: '12:00 PM', name: 'David W.', context: 'Regular 2-week cycle'},
                    ].map((apt, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-[#f3f2ee] animate-pop-in" style={{animationDelay: `${1.5 + i * 0.15}s`, opacity: 0}}>
                        <div className="w-8 h-8 rounded-lg bg-[#c0563b] flex items-center justify-center text-white text-xs font-bold">
                          {apt.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#161616]">{apt.name}</p>
                          <p className="text-[10px] text-[#c0563b] font-semibold">{apt.context}</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{apt.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="bg-[#161616] py-32">
          <div className="max-w-7xl mx-auto px-6">
            {/* Problem Statement */}
            <div className="text-center mb-20 reveal-section">
              <span className="bg-[#c0563b]/20 text-[#c0563b] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">The Problem</span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mt-8 max-w-4xl mx-auto">
                Clients forget to book until they already look rough.
              </h2>
            </div>

            {/* Problem Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              {[
                { icon: "solar:clock-circle-bold-duotone", title: "Clients Forget", desc: "They wait until they look in the mirror and panic. By then, you're fully booked." },
                { icon: "solar:chat-round-dots-bold-duotone", title: "Barbers Chase", desc: "Endless texts, DMs, and reminders. You're a stylist, not a secretary." },
                { icon: "solar:chair-bold-duotone", title: "Chairs Sit Empty", desc: "Last-minute cancellations. No-shows. Revenue walking out the door." }
              ].map((problem, i) => (
                <div key={i} className={`bg-white/5 border border-white/10 rounded-3xl p-8 text-center card-hover reveal-section reveal-delay-${i + 1}`}>
                  <span className="iconify text-[#c0563b] text-5xl mb-4" data-icon={problem.icon}></span>
                  <h3 className="text-xl font-bold text-white mb-2">{problem.title}</h3>
                  <p className="text-slate-400 text-sm">{problem.desc}</p>
                </div>
              ))}
            </div>

            {/* The Solution */}
            <div className="text-center">
              <span className="bg-[#c0563b] text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">The Solution</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mt-8 max-w-3xl mx-auto">
                Smart booking that learns your clients' lives.
              </h2>
              <p className="text-xl text-slate-300 mt-6 max-w-2xl mx-auto">
                Lineup asks clients about their lifestyle—work, travel, events, how much they care about staying fresh—then automatically recommends when they should come in.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 bg-[#f3f2ee]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal-section">
              <span className="bg-[#fbeee0] text-[#c0563b] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">How It Works</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#161616] tracking-tight mt-6">
                Simple for everyone.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* For Clients */}
              <div className="bg-white rounded-[32px] p-8 border border-[#e5e4e0] shadow-sm card-hover reveal-section reveal-delay-1">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#161616] flex items-center justify-center">
                    <span className="iconify text-white text-2xl" data-icon="solar:user-bold"></span>
                  </div>
                  <h3 className="text-2xl font-black text-[#161616]">For Clients</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Take the lifestyle quiz", desc: "Work schedule, travel, events, social life, freshness priority" },
                    { step: "2", title: "Get smart recommendations", desc: "AI suggests optimal appointment times based on your life" },
                    { step: "3", title: "Barber approves", desc: "Your stylist confirms the booking with full context" },
                    { step: "4", title: "Never look rough again", desc: "Smart reminders before big events and meetings" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[#f3f2ee]">
                      <div className="w-8 h-8 rounded-xl bg-[#c0563b] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#161616]">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* For Barbers */}
              <div className="bg-[#161616] rounded-[32px] p-8 border border-white/10 card-hover reveal-section reveal-delay-2">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#c0563b] flex items-center justify-center">
                    <span className="iconify text-white text-2xl" data-icon="solar:scissors-bold"></span>
                  </div>
                  <h3 className="text-2xl font-black text-white">For Barbers</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Set your availability", desc: "Services, hours, location—you're in control" },
                    { step: "2", title: "Receive smart requests", desc: "See why clients need each date (job interview, wedding, etc.)" },
                    { step: "3", title: "Approve with context", desc: "Client insights: last visit, usual cadence, preferences" },
                    { step: "4", title: "Full chairs, zero chasing", desc: "Loyal clients book themselves. You just cut." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5">
                      <div className="w-8 h-8 rounded-xl bg-[#c0563b] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Difference - Competitive Positioning */}
        <section className="bg-[#161616] py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal-section">
              <span className="bg-[#c0563b] text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">The Difference</span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mt-8 max-w-4xl mx-auto">
                Not just booking.<br/><span className="text-[#c0563b]">Client retention.</span>
              </h2>
              <p className="text-xl text-slate-300 mt-6 max-w-2xl mx-auto">
                Every booking platform asks "when do you want to come in?" Lineup tells clients when they <span className="italic font-semibold">should</span> come in.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              {/* Traditional Booking */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 reveal-section reveal-delay-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                    <span className="iconify text-slate-400 text-xl" data-icon="solar:calendar-minimalistic-bold"></span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">Traditional Booking</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { text: "Client thinks \"I need a cut\"", icon: "solar:user-speak-bold-duotone" },
                    { text: "Client picks any available time", icon: "solar:clock-circle-bold-duotone" },
                    { text: "Barber sees just a name and time", icon: "solar:document-bold-duotone" },
                    { text: "Client forgets, no-shows, looks rough", icon: "solar:sad-circle-bold-duotone" },
                    { text: "One-time transaction", icon: "solar:hand-money-bold-duotone" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400">
                      <span className="iconify text-xl opacity-50" data-icon={item.icon}></span>
                      <span className="text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lineup */}
              <div className="bg-gradient-to-br from-[#c0563b] to-[#a64932] rounded-3xl p-8 shadow-xl shadow-[#c0563b]/20 reveal-section reveal-delay-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="iconify text-white text-xl" data-icon="solar:scissors-bold"></span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Lineup</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { text: "Lineup tells client \"You need a cut\"", icon: "solar:bell-bing-bold-duotone" },
                    { text: "Lineup recommends the optimal time", icon: "solar:star-bold-duotone" },
                    { text: "Barber sees why this date matters", icon: "solar:lightbulb-bolt-bold-duotone" },
                    { text: "Client gets reminded before key moments", icon: "solar:check-circle-bold-duotone" },
                    { text: "Ongoing relationship with rhythm", icon: "solar:heart-bold-duotone" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <span className="iconify text-xl text-white/80" data-icon={item.icon}></span>
                      <span className="text-sm font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom tagline */}
            <div className="text-center reveal-section reveal-delay-3">
              <p className="text-2xl md:text-3xl font-bold text-white max-w-2xl mx-auto">
                Other platforms help you <span className="text-slate-400">manage bookings</span>.<br/>
                Lineup helps you <span className="text-[#c0563b]">never lose a client</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Client Context Feature Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 space-y-24">
           {/* Smart Context Demo */}
           <div className="bg-white rounded-[40px] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center shadow-sm border border-[#e5e4e0] reveal-section">
              <div className="space-y-8">
                <span className="bg-[#fbeee0] text-[#c0563b] px-3 py-1 rounded font-black text-[10px] uppercase tracking-widest">Smart Context</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#161616] leading-[1.1]">
                  See <span className="italic">why</span> clients need each appointment.
                </h2>
                <p className="text-lg text-slate-600">
                  No more guessing. Every booking comes with context—job interviews, weddings, first dates. You know exactly why they're in your chair.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={nextStep} variant="primary">Start free trial</Button>
                  <span className="text-xs text-slate-500 flex items-center">No credit card required</span>
                </div>
              </div>
              <div className="space-y-3">
                 {/* Example booking requests with context */}
                 {[
                   { name: "Marcus K.", time: "Tomorrow, 9:00 AM", reason: "Job interview Friday", priority: "high", lastVisit: "3 weeks ago" },
                   { name: "James T.", time: "Thursday, 2:00 PM", reason: "Wedding this weekend", priority: "high", lastVisit: "2 weeks ago" },
                   { name: "David W.", time: "Next Monday", reason: "Regular 2-week cycle", priority: "normal", lastVisit: "12 days ago" },
                 ].map((booking, i) => (
                   <div key={i} className="bg-[#f3f2ee] rounded-2xl p-4 border border-[#e5e4e0]">
                     <div className="flex items-start justify-between mb-3">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-[#c0563b] flex items-center justify-center text-white font-bold text-sm">
                           {booking.name.split(' ').map(n => n[0]).join('')}
                         </div>
                         <div>
                           <h4 className="font-bold text-[#161616]">{booking.name}</h4>
                           <p className="text-xs text-slate-500">{booking.time}</p>
                         </div>
                       </div>
                       <div className="flex gap-2">
                         <button className="px-3 py-1 rounded-lg bg-[#c0563b] text-white text-xs font-bold">Approve</button>
                         <button className="px-3 py-1 rounded-lg bg-white border border-[#e5e4e0] text-xs font-bold">Reschedule</button>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 flex-wrap">
                       <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${booking.priority === 'high' ? 'bg-[#c0563b]/10 text-[#c0563b]' : 'bg-slate-100 text-slate-600'}`}>
                         {booking.reason}
                       </span>
                       <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                         Last visit: {booking.lastVisit}
                       </span>
                     </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Key Features Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5e4e0] space-y-4 card-hover reveal-section reveal-delay-1">
                 <span className="iconify text-4xl text-[#c0563b]" data-icon="solar:calendar-search-bold-duotone"></span>
                 <h3 className="text-xl font-extrabold">Lifestyle Quiz</h3>
                 <p className="text-slate-600 text-sm">Work schedule, travel plans, events, social life—we learn how your clients live.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5e4e0] space-y-4 card-hover reveal-section reveal-delay-2">
                 <span className="iconify text-4xl text-[#c0563b]" data-icon="solar:magic-stick-3-bold-duotone"></span>
                 <h3 className="text-xl font-extrabold">AI Recommendations</h3>
                 <p className="text-slate-600 text-sm">Smart suggestions for when clients should book based on their life rhythm.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5e4e0] space-y-4 card-hover reveal-section reveal-delay-3">
                 <span className="iconify text-4xl text-[#c0563b]" data-icon="solar:bell-bing-bold-duotone"></span>
                 <h3 className="text-xl font-extrabold">Event Reminders</h3>
                 <p className="text-slate-600 text-sm">Automatic nudges before big moments—interviews, dates, trips, birthdays.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5e4e0] space-y-4 card-hover reveal-section reveal-delay-1">
                 <span className="iconify text-4xl text-[#c0563b]" data-icon="solar:users-group-rounded-bold-duotone"></span>
                 <h3 className="text-xl font-extrabold">Client Insights</h3>
                 <p className="text-slate-600 text-sm">See last visit, usual cadence, freshness priority for every client.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5e4e0] space-y-4 card-hover reveal-section reveal-delay-2">
                 <span className="iconify text-4xl text-[#c0563b]" data-icon="solar:check-circle-bold-duotone"></span>
                 <h3 className="text-xl font-extrabold">Barber Approval</h3>
                 <p className="text-slate-600 text-sm">You stay in control. Approve, decline, or suggest alternatives for any booking.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5e4e0] space-y-4 card-hover reveal-section reveal-delay-3">
                 <span className="iconify text-4xl text-[#c0563b]" data-icon="solar:graph-up-bold-duotone"></span>
                 <h3 className="text-xl font-extrabold">Smart Scheduling</h3>
                 <p className="text-slate-600 text-sm">Track and optimize each client's natural booking rhythm over time.</p>
              </div>
           </div>

           {/* See It In Action - Demo Section */}
           <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-sm border border-[#e5e4e0]">
              <div className="text-center mb-12">
                <span className="bg-[#fbeee0] text-[#c0563b] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">Try It Now</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#161616] tracking-tight mt-6">
                  See it in action.
                </h2>
                <p className="text-lg text-slate-500 mt-4 max-w-xl mx-auto">
                  Experience Lineup from both sides—as a client getting smart recommendations, or as a stylist managing bookings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Demo Card */}
                <div className="bg-[#f3f2ee] rounded-3xl p-8 border border-[#e5e4e0] card-hover group reveal-section reveal-delay-1">
                  <div className="w-16 h-16 rounded-2xl bg-[#161616] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="iconify text-white text-3xl" data-icon="solar:user-bold"></span>
                  </div>
                  <h3 className="text-2xl font-black text-[#161616] mb-3">Client Experience</h3>
                  <p className="text-slate-500 mb-6">See how Lineup learns your schedule and recommends the perfect booking times based on your lifestyle.</p>
                  <ul className="space-y-2 mb-8 text-sm">
                    <li className="flex items-center gap-2 text-slate-600">
                      <span className="iconify text-[#c0563b]" data-icon="solar:check-circle-bold"></span>
                      Smart appointment recommendations
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <span className="iconify text-[#c0563b]" data-icon="solar:check-circle-bold"></span>
                      Event-aware scheduling
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <span className="iconify text-[#c0563b]" data-icon="solar:check-circle-bold"></span>
                      Personalized booking cadence
                    </li>
                  </ul>
                  {onClientDemo && (
                    <Button variant="dark" onClick={onClientDemo} className="w-full btn-hover">Try Client Demo</Button>
                  )}
                </div>

                {/* Stylist Demo Card */}
                <div className="bg-[#161616] rounded-3xl p-8 border border-white/10 card-hover group reveal-section reveal-delay-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#c0563b] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                    <span className="iconify text-white text-3xl" data-icon="solar:scissors-bold"></span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Stylist Dashboard</h3>
                  <p className="text-slate-400 mb-6">See how stylists receive smart booking requests with full client context and insights.</p>
                  <ul className="space-y-2 mb-8 text-sm">
                    <li className="flex items-center gap-2 text-slate-300">
                      <span className="iconify text-[#c0563b]" data-icon="solar:check-circle-bold"></span>
                      See why clients need each date
                    </li>
                    <li className="flex items-center gap-2 text-slate-300">
                      <span className="iconify text-[#c0563b]" data-icon="solar:check-circle-bold"></span>
                      Client insights & history
                    </li>
                    <li className="flex items-center gap-2 text-slate-300">
                      <span className="iconify text-[#c0563b]" data-icon="solar:check-circle-bold"></span>
                      Approve, decline, or reschedule
                    </li>
                  </ul>
                  {onBarberDemo && (
                    <Button variant="primary" onClick={onBarberDemo} className="w-full btn-hover">Try Stylist Demo</Button>
                  )}
                </div>
              </div>
           </div>

           {/* Works for Everyone */}
           <div className="text-center bg-[#161616] rounded-[40px] p-12 md:p-20 reveal-section">
              <span className="bg-[#c0563b] text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">For Everyone</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-8">
                Barbers. Stylists. Salons. Spas.
              </h2>
              <p className="text-xl text-slate-300 mt-6 max-w-2xl mx-auto">
                Any recurring personal service. Whether you're running a multi-chair shop or working independently, Lineup adapts to your workflow.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
                <span>Independent stylists</span>
                <span>•</span>
                <span>Barbershops</span>
                <span>•</span>
                <span>Hair salons</span>
                <span>•</span>
                <span>Spas & aestheticians</span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                <Button onClick={nextStep} variant="primary" className="px-8">Start free trial</Button>
              </div>
           </div>
        </section>
      </div>
    );
  }

  // 3-step Consultation (Lifestyle-focused with better curation)
  return (
    <div className="max-w-xl mx-auto py-24 px-6">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-12 bg-[#c0563b] rounded"></div>
          <span className="text-xs font-black uppercase tracking-widest text-[#555]">Quick Setup {step}/3</span>
        </div>
        <h1 className="text-5xl font-extrabold text-[#161616] mb-4 tracking-tight">
          {step === 1 && "Let's get you set up."}
          {step === 2 && "What's your lifestyle like?"}
          {step === 3 && "Any big moments coming up?"}
        </h1>
        <p className="text-lg text-slate-500">
          {step === 1 && "We'll use this to recommend the perfect booking times."}
          {step === 2 && "This helps us understand when you need to look your best."}
          {step === 3 && "We'll make sure you're fresh for what matters."}
        </p>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-2 tracking-widest">Your Name</label>
              <input
                type="text"
                placeholder="Marcus"
                value={profile.name || ''}
                className="w-full bg-white border-2 border-[#e5e4e0] rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c0563b] text-[#161616] font-bold"
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-3 tracking-widest">How often do you typically get a cut?</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'fast', label: 'Every week', desc: 'I like to stay tight at all times', icon: 'solar:fire-bold-duotone' },
                  { id: 'average', label: 'Every 2-3 weeks', desc: 'Regular maintenance, balanced approach', icon: 'solar:calendar-bold-duotone' },
                  { id: 'slow', label: 'Once a month or longer', desc: 'I let it grow out between cuts', icon: 'solar:clock-circle-bold-duotone' }
                ].map((rate) => (
                  <button
                    key={rate.id}
                    onClick={() => setProfile({ ...profile, growthRate: rate.id as any })}
                    className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${profile.growthRate === rate.id ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555] hover:border-[#c0563b]/30'}`}
                  >
                    <span className={`iconify text-2xl ${profile.growthRate === rate.id ? 'text-[#c0563b]' : 'text-slate-400'}`} data-icon={rate.icon}></span>
                    <div>
                      <div className="font-bold">{rate.label}</div>
                      <div className="text-sm opacity-60">{rate.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-3 tracking-widest">When do you need to look your sharpest?</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'busy-midweek', label: 'Weekdays for work', desc: 'Meetings, clients, presentations', icon: 'solar:case-round-bold-duotone' },
                  { id: 'social-weekend', label: 'Weekends for social', desc: 'Dates, events, going out with friends', icon: 'solar:sun-bold-duotone' },
                  { id: 'consistent', label: 'Always fresh, no exceptions', desc: "I never want to look rough", icon: 'solar:star-bold-duotone' }
                ].map((rhythm) => (
                  <button
                    key={rhythm.id}
                    onClick={() => setProfile({ ...profile, weeklyRhythm: rhythm.id as any })}
                    className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${profile.weeklyRhythm === rhythm.id ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555] hover:border-[#c0563b]/30'}`}
                  >
                    <span className={`iconify text-2xl ${profile.weeklyRhythm === rhythm.id ? 'text-[#c0563b]' : 'text-slate-400'}`} data-icon={rhythm.icon}></span>
                    <div>
                      <div className="font-bold">{rhythm.label}</div>
                      <div className="text-sm opacity-60">{rhythm.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-3 tracking-widest">How much does looking fresh matter to you?</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'low', label: 'Casual', desc: "It's not a big deal" },
                  { id: 'medium', label: 'Important', desc: 'I care about my appearance' },
                  { id: 'high', label: 'Critical', desc: 'First impressions matter' }
                ].map((priority) => (
                  <button
                    key={priority.id}
                    onClick={() => setProfile({ ...profile, hairType: priority.id as any })}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${profile.hairType === priority.id ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555] hover:border-[#c0563b]/30'}`}
                  >
                    <div className="font-bold text-sm">{priority.label}</div>
                    <div className="text-[10px] opacity-60 mt-1">{priority.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-2 tracking-widest">When was your last haircut?</label>
              <input
                type="date"
                value={profile.lastCutDate}
                className="w-full bg-white border-2 border-[#e5e4e0] rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c0563b] text-[#161616] font-bold"
                onChange={(e) => setProfile({ ...profile, lastCutDate: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-2">This helps us calculate your ideal timing</p>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-3 tracking-widest">Any upcoming events? (Select all that apply)</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'interview', label: 'Job interview', icon: 'solar:case-round-bold-duotone' },
                  { id: 'wedding', label: 'Wedding', icon: 'solar:heart-bold-duotone' },
                  { id: 'date', label: 'First date', icon: 'solar:hearts-bold-duotone' },
                  { id: 'trip', label: 'Trip/vacation', icon: 'solar:airplane-bold-duotone' },
                  { id: 'photo', label: 'Photo shoot', icon: 'solar:camera-bold-duotone' },
                  { id: 'none', label: 'Nothing specific', icon: 'solar:calendar-minimalistic-bold-duotone' }
                ].map((event) => {
                  const isSelected = event.id === 'none'
                    ? selectedEvents.length === 0
                    : selectedEvents.includes(event.id);
                  return (
                    <button
                      key={event.id}
                      onClick={() => toggleEvent(event.id)}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]'
                          : 'border-[#e5e4e0] bg-white text-[#555] hover:border-[#c0563b]/30'
                      }`}
                    >
                      <span className={`iconify text-xl ${isSelected ? 'text-[#c0563b]' : 'text-slate-400'}`} data-icon={event.icon}></span>
                      <span className="font-bold text-sm">{event.label}</span>
                      {isSelected && event.id !== 'none' && (
                        <span className="iconify ml-auto text-[#c0563b]" data-icon="solar:check-circle-bold"></span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-3">We'll remind you to book before these events</p>
            </div>
          </div>
        )}

        <div className="pt-8 flex justify-between items-center">
          <Button variant="ghost" onClick={() => step > 1 ? setStep(step - 1) : setStep(0)}>Back</Button>
          {step < 3 ? (
            <Button variant="dark" onClick={nextStep} disabled={step === 1 && !profile.name}>Continue</Button>
          ) : (
            <Button variant="primary" onClick={finish} className="px-10">Get My Schedule</Button>
          )}
        </div>
      </div>
    </div>
  );
};
