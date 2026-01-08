
import React, { useState, useEffect } from 'react';
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

  // Update step when startAtStep prop changes (for demo mode)
  useEffect(() => {
    setStep(startAtStep);
  }, [startAtStep]);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    hairType: 'medium',
    growthRate: 'average',
    weeklyRhythm: 'consistent',
    lastCutDate: new Date().toISOString().split('T')[0]
  });
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  // Path selection and custom dates state (must be at top level for React hooks)
  const [path, setPath] = useState<'barber' | 'stylist' | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customDates, setCustomDates] = useState<{date: string, reason: string}[]>([]);
  const [showAddDate, setShowAddDate] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(s => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  const addCustomDate = () => {
    if (newDate && newReason) {
      setCustomDates(prev => [...prev, { date: newDate, reason: newReason }]);
      setNewDate('');
      setNewReason('');
      setShowAddDate(false);
    }
  };

  const removeCustomDate = (index: number) => {
    setCustomDates(prev => prev.filter((_, i) => i !== index));
  };

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
                Take the Lifestyle Quiz
              </Button>
              <span className="text-xs text-slate-500 font-medium ml-4">See how personalized scheduling works</span>
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

        {/* Lifestyle Photo Strip - Infinite Scroll */}
        <section className="py-16 overflow-hidden bg-[#161616]">
          <div className="flex gap-4 animate-scroll" style={{ width: 'fit-content' }}>
            {/* First set of images */}
            {[
              { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=400&auto=format&fit=crop", alt: "Barbershop interior" },
              { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400&auto=format&fit=crop", alt: "Barber cutting hair" },
              { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop", alt: "Classic barber chair" },
              { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop", alt: "Stylist at work" },
              { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=400&auto=format&fit=crop", alt: "Modern salon" },
              { src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop", alt: "Barber tools" },
              { src: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=400&auto=format&fit=crop", alt: "Hair styling" },
              { src: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?q=80&w=400&auto=format&fit=crop", alt: "Barbershop vibe" },
            ].map((img, i) => (
              <div key={`a-${i}`} className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=400&auto=format&fit=crop", alt: "Barbershop interior" },
              { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400&auto=format&fit=crop", alt: "Barber cutting hair" },
              { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop", alt: "Classic barber chair" },
              { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop", alt: "Stylist at work" },
              { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=400&auto=format&fit=crop", alt: "Modern salon" },
              { src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop", alt: "Barber tools" },
              { src: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=400&auto=format&fit=crop", alt: "Hair styling" },
              { src: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?q=80&w=400&auto=format&fit=crop", alt: "Barbershop vibe" },
            ].map((img, i) => (
              <div key={`b-${i}`} className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
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

           {/* See It In Action Section */}
           <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-sm border border-[#e5e4e0]">
              <div className="text-center mb-12">
                <span className="bg-[#fbeee0] text-[#c0563b] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">Preview</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#161616] tracking-tight mt-6">
                  Experience it yourself.
                </h2>
                <p className="text-lg text-slate-500 mt-4 max-w-xl mx-auto">
                  See how Lineup works—take the lifestyle quiz for personalized recommendations, or preview the stylist dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Experience Card */}
                <div className="bg-[#f3f2ee] rounded-3xl p-8 border border-[#e5e4e0] card-hover group reveal-section reveal-delay-1">
                  <div className="w-16 h-16 rounded-2xl bg-[#161616] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="iconify text-white text-3xl" data-icon="solar:user-bold"></span>
                  </div>
                  <h3 className="text-2xl font-black text-[#161616] mb-3">Your Personalized Experience</h3>
                  <p className="text-slate-500 mb-6">Take a quick quiz and see how Lineup recommends the perfect booking times based on your lifestyle.</p>
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
                    <Button variant="dark" onClick={onClientDemo} className="w-full btn-hover">Take the Lifestyle Quiz</Button>
                  )}
                </div>

                {/* Stylist Dashboard Card */}
                <div className="bg-[#161616] rounded-3xl p-8 border border-white/10 card-hover group reveal-section reveal-delay-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#c0563b] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                    <span className="iconify text-white text-3xl" data-icon="solar:scissors-bold"></span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Stylist Dashboard</h3>
                  <p className="text-slate-400 mb-6">Preview what stylists see—smart booking requests with full client context and insights.</p>
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
                    <Button variant="primary" onClick={onBarberDemo} className="w-full btn-hover">View Stylist Dashboard</Button>
                  )}
                </div>
              </div>
           </div>

           {/* Works for Everyone */}
           <div className="bg-[#161616] rounded-[40px] p-12 md:p-20 reveal-section overflow-hidden">
              <div className="text-center mb-12">
                <span className="bg-[#c0563b] text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">For Everyone</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-8">
                  Barbers. Stylists. Salons. Spas.
                </h2>
                <p className="text-xl text-slate-300 mt-6 max-w-2xl mx-auto">
                  Any recurring personal service. Whether you're running a multi-chair shop or working independently, Lineup adapts to your workflow.
                </p>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                  { src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=300&auto=format&fit=crop", label: "Barbershops" },
                  { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=300&auto=format&fit=crop", label: "Hair Salons" },
                  { src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=300&auto=format&fit=crop", label: "Independent Stylists" },
                  { src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=300&auto=format&fit=crop", label: "Spas" },
                ].map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="aspect-square rounded-2xl overflow-hidden">
                      <img src={item.src} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    <span className="absolute bottom-3 left-3 text-white font-bold text-sm">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={nextStep} variant="primary" className="px-8">Start free trial</Button>
                </div>
              </div>
           </div>
        </section>
      </div>
    );
  }

  // Total steps based on path
  const totalSteps = path ? 3 : 0;
  const currentStep = step;

  // Path selection screen
  if (step === 1 && !path) {
    return (
      <div className="max-w-xl mx-auto py-24 px-6">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-[#161616] mb-4 tracking-tight">
            Who do you see?
          </h1>
          <p className="text-lg text-slate-500">
            We'll tailor your experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => setPath('barber')}
            className="p-8 rounded-2xl border-2 border-[#e5e4e0] bg-white hover:border-[#c0563b] hover:bg-[#c0563b]/5 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#161616] flex items-center justify-center group-hover:bg-[#c0563b] transition-colors">
                <span className="iconify text-white text-3xl" data-icon="solar:scissors-bold"></span>
              </div>
              <div>
                <div className="text-xl font-bold text-[#161616]">Barber</div>
                <div className="text-sm text-slate-500">Cuts, fades, lineups</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPath('stylist')}
            className="p-8 rounded-2xl border-2 border-[#e5e4e0] bg-white hover:border-[#c0563b] hover:bg-[#c0563b]/5 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#161616] flex items-center justify-center group-hover:bg-[#c0563b] transition-colors">
                <span className="iconify text-white text-3xl" data-icon="solar:magic-stick-3-bold"></span>
              </div>
              <div>
                <div className="text-xl font-bold text-[#161616]">Hair Stylist</div>
                <div className="text-sm text-slate-500">Cuts, color, styling</div>
              </div>
            </div>
          </button>
        </div>

        <div className="pt-8">
          <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
        </div>
      </div>
    );
  }

  // Quiz content based on path
  const getStepContent = () => {
    if (path === 'barber') {
      return {
        1: {
          title: "Let's get started.",
          subtitle: "Quick questions to set up your schedule."
        },
        2: {
          title: "What's your week like?",
          subtitle: "This helps us recommend the best times."
        },
        3: {
          title: "Anything coming up?",
          subtitle: "We'll time your cut right before."
        }
      };
    } else {
      return {
        1: {
          title: "Let's get started.",
          subtitle: "Quick questions to set up your schedule."
        },
        2: {
          title: "What's your routine like?",
          subtitle: "This helps us recommend the best times."
        },
        3: {
          title: "Anything coming up?",
          subtitle: "We'll time your appointment right before."
        }
      };
    }
  };

  const stepContent = getStepContent();

  return (
    <div className="max-w-xl mx-auto py-24 px-6">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-12 bg-[#c0563b] rounded"></div>
          <span className="text-xs font-black uppercase tracking-widest text-[#555]">Step {currentStep}/{totalSteps}</span>
        </div>
        <h1 className="text-5xl font-extrabold text-[#161616] mb-4 tracking-tight">
          {stepContent[currentStep as keyof typeof stepContent]?.title}
        </h1>
        <p className="text-lg text-slate-500">
          {stepContent[currentStep as keyof typeof stepContent]?.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* STEP 1: The Basics */}
        {step === 1 && path && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-2 tracking-widest">Your name</label>
              <input
                type="text"
                placeholder="Marcus"
                value={profile.name || ''}
                className="w-full bg-white border-2 border-[#e5e4e0] rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c0563b] text-[#161616] font-bold"
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-2 tracking-widest">Birthday</label>
              <input
                type="date"
                className="w-full bg-white border-2 border-[#e5e4e0] rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c0563b] text-[#161616] font-bold"
                onChange={(e) => setProfile({ ...profile, birthday: e.target.value } as any)}
              />
              <p className="text-xs text-slate-400 mt-2">We'll remind you before your birthday</p>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-2 tracking-widest">
                {path === 'barber' ? 'When was your last cut?' : 'When was your last appointment?'}
              </label>
              <input
                type="date"
                value={profile.lastCutDate}
                className="w-full bg-white border-2 border-[#e5e4e0] rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c0563b] text-[#161616] font-bold"
                onChange={(e) => setProfile({ ...profile, lastCutDate: e.target.value })}
              />
            </div>

            {/* Barber: Cut frequency */}
            {path === 'barber' && (
              <div>
                <label className="block text-xs font-black uppercase text-[#161616] mb-3 tracking-widest">How often do you get a cut?</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'fast', label: 'Weekly' },
                    { id: 'average', label: 'Every 2-3 weeks' },
                    { id: 'slow', label: 'Monthly or longer' }
                  ].map((rate) => (
                    <button
                      key={rate.id}
                      onClick={() => setProfile({ ...profile, growthRate: rate.id as any })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${profile.growthRate === rate.id ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555] hover:border-[#c0563b]/30'}`}
                    >
                      <div className="font-bold">{rate.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stylist: Services */}
            {path === 'stylist' && (
              <div>
                <label className="block text-xs font-black uppercase text-[#161616] mb-3 tracking-widest">What services do you usually get?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'cut', label: 'Cut' },
                    { id: 'color', label: 'Color' },
                    { id: 'highlights', label: 'Highlights' },
                    { id: 'blowout', label: 'Blowout/Styling' },
                    { id: 'treatment', label: 'Treatment' }
                  ].map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${selectedServices.includes(service.id) ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555] hover:border-[#c0563b]/30'}`}
                    >
                      <div className="font-bold text-sm">{service.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Schedule */}
        {step === 2 && path && (
          <div className="space-y-6">
            {/* Stylist: Appointment frequency */}
            {path === 'stylist' && (
              <div>
                <label className="block text-xs font-black uppercase text-[#161616] mb-3 tracking-widest">How often do you book appointments?</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'fast', label: 'Every few weeks' },
                    { id: 'average', label: 'Monthly' },
                    { id: 'slow', label: 'Every 6-8 weeks', desc: 'Color touch-ups' },
                    { id: 'asneeded', label: 'As needed' }
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      onClick={() => setProfile({ ...profile, growthRate: freq.id as any })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${profile.growthRate === freq.id ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555] hover:border-[#c0563b]/30'}`}
                    >
                      <div className="font-bold">{freq.label}</div>
                      {freq.desc && <div className="text-xs text-slate-400">{freq.desc}</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase text-[#161616] mb-3 tracking-widest">
                {path === 'barber' ? 'When do you need to look sharp?' : 'When do you need to look your best?'}
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'busy-midweek', label: 'Weekdays', desc: 'Work, meetings' },
                  { id: 'social-weekend', label: 'Weekends', desc: 'Social, events' },
                  { id: 'consistent', label: 'Both equally' }
                ].map((rhythm) => (
                  <button
                    key={rhythm.id}
                    onClick={() => setProfile({ ...profile, weeklyRhythm: rhythm.id as any })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${profile.weeklyRhythm === rhythm.id ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555] hover:border-[#c0563b]/30'}`}
                  >
                    <div className="font-bold">{rhythm.label}</div>
                    {rhythm.desc && <div className="text-xs text-slate-400">{rhythm.desc}</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Barber: Travel frequency */}
            {path === 'barber' && (
              <div>
                <label className="block text-xs font-black uppercase text-[#161616] mb-3 tracking-widest">Do you travel often?</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'rarely', label: 'Not really' },
                    { id: 'sometimes', label: 'A few times a year' },
                    { id: 'often', label: 'Frequently' }
                  ].map((travel) => (
                    <button
                      key={travel.id}
                      onClick={() => setProfile({ ...profile, travelFrequency: travel.id } as any)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${(profile as any).travelFrequency === travel.id ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]' : 'border-[#e5e4e0] bg-white text-[#555] hover:border-[#c0563b]/30'}`}
                    >
                      <div className="font-bold">{travel.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Events */}
        {step === 3 && path && (
          <div className="space-y-6">
            <div>
              <div className="grid grid-cols-2 gap-3">
                {(path === 'barber' ? [
                  { id: 'wedding', label: 'Wedding' },
                  { id: 'interview', label: 'Job interview' },
                  { id: 'vacation', label: 'Vacation' },
                  { id: 'meeting', label: 'Important meeting' },
                  { id: 'date', label: 'Date' },
                  { id: 'none', label: 'Nothing right now' }
                ] : [
                  { id: 'wedding', label: 'Wedding' },
                  { id: 'event', label: 'Special event' },
                  { id: 'vacation', label: 'Vacation' },
                  { id: 'photo', label: 'Photo shoot' },
                  { id: 'date', label: 'Date' },
                  { id: 'none', label: 'Nothing right now' }
                ]).map((event) => {
                  const isSelected = event.id === 'none'
                    ? selectedEvents.length === 0
                    : selectedEvents.includes(event.id);
                  return (
                    <button
                      key={event.id}
                      onClick={() => toggleEvent(event.id)}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#c0563b] bg-[#c0563b]/5 text-[#161616]'
                          : 'border-[#e5e4e0] bg-white text-[#555] hover:border-[#c0563b]/30'
                      }`}
                    >
                      <span className="font-bold text-sm">{event.label}</span>
                      {isSelected && event.id !== 'none' && (
                        <span className="iconify text-[#c0563b]" data-icon="solar:check-circle-bold"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date picker for selected event */}
            {selectedEvents.length > 0 && selectedEvents[0] !== 'none' && (
              <div className="bg-[#f3f2ee] rounded-2xl p-5">
                <label className="block text-xs font-black uppercase text-[#161616] mb-2 tracking-widest">
                  When is it?
                </label>
                <input
                  type="date"
                  className="w-full bg-white border-2 border-[#e5e4e0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#c0563b] text-[#161616] font-bold"
                  onChange={(e) => setProfile({ ...profile, upcomingEventDate: e.target.value } as any)}
                />
                <p className="text-xs text-slate-400 mt-2">We'll schedule you 1-2 days before</p>
              </div>
            )}

            {/* Add custom date section */}
            <div className="border-t border-[#e5e4e0] pt-6">
              {!showAddDate ? (
                <button
                  onClick={() => setShowAddDate(true)}
                  className="flex items-center gap-2 text-sm font-bold text-[#c0563b] hover:text-[#a64932] transition-colors"
                >
                  <span className="iconify text-lg" data-icon="solar:add-circle-bold"></span>
                  Add another date
                </button>
              ) : (
                <div className="bg-[#f3f2ee] rounded-2xl p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-[#161616] mb-2 tracking-widest">Date</label>
                    <input
                      type="date"
                      value={newDate}
                      className="w-full bg-white border-2 border-[#e5e4e0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#c0563b] text-[#161616] font-bold"
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-[#161616] mb-2 tracking-widest">Reason</label>
                    <select
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      className="w-full bg-white border-2 border-[#e5e4e0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#c0563b] text-[#161616] font-bold"
                    >
                      <option value="">Select a reason</option>
                      <option value="work">Work event</option>
                      <option value="social">Social event</option>
                      <option value="travel">Travel</option>
                      <option value="special">Special occasion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={addCustomDate} disabled={!newDate || !newReason}>Add</Button>
                    <Button variant="ghost" onClick={() => setShowAddDate(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              {/* Show added custom dates */}
              {customDates.length > 0 && (
                <div className="mt-4 space-y-2">
                  {customDates.map((cd, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#e5e4e0]">
                      <div>
                        <span className="font-bold text-sm text-[#161616]">{new Date(cd.date).toLocaleDateString()}</span>
                        <span className="text-xs text-slate-400 ml-2">{cd.reason}</span>
                      </div>
                      <button onClick={() => removeCustomDate(i)} className="text-slate-400 hover:text-red-500">
                        <span className="iconify" data-icon="solar:close-circle-bold"></span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-8 flex justify-between items-center">
          <Button variant="ghost" onClick={() => {
            if (step === 1 && path) {
              setPath(null);
            } else if (step > 1) {
              setStep(step - 1);
            } else {
              setStep(0);
            }
          }}>Back</Button>
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
