
import React, { useEffect, useState } from 'react';
import { AppState, RecommendedSlot } from '../types';
import { Button } from './Button';
import { getStrategistCommentary } from '../services/geminiService';
import { BookingModal } from './BookingModal';

interface DashboardProps {
  state: AppState;
  onRefresh: () => void;
}

// Mock connected barber data
const CONNECTED_BARBER = {
  name: 'James Wilson',
  shop: "James' Cuts",
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
  rating: 4.9,
  clientSince: 'January 2026'
};

// Mock booked appointments
const BOOKED_APPOINTMENTS = [
  {
    id: '1',
    date: '2026-01-12',
    time: '10:00 AM',
    service: 'Haircut',
    status: 'confirmed' as const,
    barberName: 'James Wilson'
  }
];

// Fallback demo recommendations when API is unavailable
const DEMO_RECOMMENDATIONS: RecommendedSlot[] = [
  {
    date: '2026-01-12',
    reason: 'Perfect timing before your growth hits the messy stage',
    score: 'optimal',
    event: 'Weekly refresh'
  },
  {
    date: '2026-01-15',
    reason: 'Stay crisp for the upcoming weekend',
    score: 'good',
    event: 'Weekend prep'
  },
  {
    date: '2026-01-19',
    reason: 'Monday fresh start - great for work week',
    score: 'good',
    event: 'Work week'
  },
  {
    date: '2026-01-23',
    reason: 'Right on your natural 2-week cycle',
    score: 'good',
    event: 'Regular maintenance'
  },
  {
    date: '2026-01-26',
    reason: 'End of month shape-up',
    score: 'good',
    event: 'Monthly reset'
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ state, onRefresh }) => {
  const [commentary, setCommentary] = useState("Finding your perfect timing...");
  const [isCommentaryLoading, setIsCommentaryLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<RecommendedSlot | null>(null);
  const [bookedSlot, setBookedSlot] = useState<RecommendedSlot | null>(null);
  const [calendarDropdownId, setCalendarDropdownId] = useState<string | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState(BOOKED_APPOINTMENTS);
  const [dynamicRecommendations, setDynamicRecommendations] = useState<RecommendedSlot[]>([]);

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    text: false,
    reminder24h: true,
    reminder1h: true
  });

  // Generate next recommendations based on client's cadence
  const generateNextRecommendations = (fromDate: string, cadence: string) => {
    const baseDate = new Date(fromDate);
    const newRecs: RecommendedSlot[] = [];

    // Determine days between appointments based on cadence
    const daysToAdd = cadence === 'fast' ? 7 : cadence === 'average' ? 14 : 28;

    // Generate 4-5 future recommendations
    for (let i = 1; i <= 5; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(nextDate.getDate() + (daysToAdd * i));

      const reasons = [
        `Right on your ${daysToAdd === 7 ? 'weekly' : daysToAdd === 14 ? '2-week' : 'monthly'} cycle`,
        'Perfect timing to stay fresh',
        'Optimal based on your lifestyle',
        'Great time for a touch-up',
        'Stay looking sharp'
      ];

      newRecs.push({
        date: nextDate.toISOString().split('T')[0],
        reason: reasons[i - 1],
        score: i === 1 ? 'optimal' : 'good',
        event: i === 1 ? 'Next recommended' : 'Future option'
      });
    }

    return newRecs;
  };

  // Generate Google Calendar link
  const getGoogleCalendarLink = (apt: typeof BOOKED_APPOINTMENTS[0]) => {
    const startDate = new Date(`${apt.date}T${apt.time.replace(' AM', ':00').replace(' PM', ':00')}`);
    if (apt.time.includes('PM') && !apt.time.includes('12:')) {
      startDate.setHours(startDate.getHours() + 12);
    }
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour appointment

    const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, '');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${apt.service} with ${apt.barberName}`,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: `Your ${apt.service.toLowerCase()} appointment at ${CONNECTED_BARBER.shop}`,
      location: CONNECTED_BARBER.shop
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Generate ICS file for Apple Calendar
  const downloadICSFile = (apt: typeof BOOKED_APPOINTMENTS[0]) => {
    const startDate = new Date(`${apt.date}T${apt.time.replace(' AM', ':00').replace(' PM', ':00')}`);
    if (apt.time.includes('PM') && !apt.time.includes('12:')) {
      startDate.setHours(startDate.getHours() + 12);
    }
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatICSDate = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, -1);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lineup//Appointment//EN
BEGIN:VEVENT
UID:${apt.id}@lineup.app
DTSTAMP:${formatICSDate(new Date())}Z
DTSTART:${formatICSDate(startDate)}Z
DTEND:${formatICSDate(endDate)}Z
SUMMARY:${apt.service} with ${apt.barberName}
DESCRIPTION:Your ${apt.service.toLowerCase()} appointment at ${CONNECTED_BARBER.shop}
LOCATION:${CONNECTED_BARBER.shop}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `appointment-${apt.date}.ics`;
    link.click();
    setCalendarDropdownId(null);
  };

  // Use dynamic recommendations after booking, API recommendations, or demo data
  const recommendations = dynamicRecommendations.length > 0
    ? dynamicRecommendations
    : state.recommendations.length > 0
      ? state.recommendations
      : DEMO_RECOMMENDATIONS;

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
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleBookClick = (slot: RecommendedSlot) => {
    setSelectedSlot(slot);
  };

  const handleConfirmBooking = () => {
    if (selectedSlot) {
      // Add to upcoming appointments
      const newAppointment = {
        id: `apt-${Date.now()}`,
        date: selectedSlot.date,
        time: '10:00 AM', // Default time, would be selected in real app
        service: 'Haircut',
        status: 'confirmed' as const,
        barberName: CONNECTED_BARBER.name
      };
      setUpcomingAppointments(prev => [...prev, newAppointment]);

      // Generate next recommendations based on booked date and user's cadence
      const cadence = state.profile?.growthRate || 'average';
      const nextRecs = generateNextRecommendations(selectedSlot.date, cadence);
      setDynamicRecommendations(nextRecs);

      setBookedSlot(selectedSlot);
      setSelectedSlot(null);
    }
  };

  // Get the optimal recommendation
  const optimalSlot = recommendations.find(r => r.score === 'optimal');
  const otherSlots = recommendations.filter(r => r.score !== 'optimal');

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Connected Barber Banner */}
      <section className="bg-white rounded-2xl p-4 border border-[#e5e4e0] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={CONNECTED_BARBER.avatar}
            alt={CONNECTED_BARBER.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#161616]">{CONNECTED_BARBER.name}</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Connected</span>
            </div>
            <span className="text-xs text-slate-400">{CONNECTED_BARBER.shop}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="iconify text-yellow-500" data-icon="solar:star-bold"></span>
          <span className="font-bold text-[#161616]">{CONNECTED_BARBER.rating}</span>
        </div>
      </section>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <section className="bg-[#f3f2ee] rounded-2xl p-6 border border-[#e5e4e0]">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Your Appointments</h3>
          <div className="space-y-3">
            {upcomingAppointments.map(apt => (
              <div key={apt.id} className="bg-white rounded-xl p-4 border border-[#e5e4e0] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c0563b] flex items-center justify-center text-white">
                    <span className="iconify text-2xl" data-icon="solar:calendar-bold"></span>
                  </div>
                  <div>
                    <div className="font-bold text-[#161616]">{formatDate(apt.date)}</div>
                    <div className="text-sm text-slate-500">{apt.time} • {apt.service}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    apt.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : apt.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {apt.status === 'confirmed' ? 'Confirmed' : apt.status === 'pending' ? 'Pending' : apt.status}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setCalendarDropdownId(calendarDropdownId === apt.id ? null : apt.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f3f2ee] hover:bg-[#e5e4e0] text-[#161616] text-xs font-bold transition-colors"
                    >
                      <span className="iconify" data-icon="solar:calendar-add-bold"></span>
                      Add to Calendar
                    </button>
                    {calendarDropdownId === apt.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#e5e4e0] overflow-hidden z-50">
                        <a
                          href={getGoogleCalendarLink(apt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setCalendarDropdownId(null)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#f3f2ee] transition-colors"
                        >
                          <span className="iconify text-lg text-[#4285F4]" data-icon="logos:google-calendar"></span>
                          <span className="text-sm font-medium text-[#161616]">Google Calendar</span>
                        </a>
                        <button
                          onClick={() => downloadICSFile(apt)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f3f2ee] transition-colors border-t border-[#f3f2ee]"
                        >
                          <span className="iconify text-lg text-slate-600" data-icon="solar:calendar-bold"></span>
                          <span className="text-sm font-medium text-[#161616]">Apple Calendar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Booking Confirmation Success */}
      {bookedSlot && (
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-[32px] p-8 text-white text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <span className="iconify text-4xl" data-icon="solar:check-circle-bold"></span>
          </div>
          <h2 className="text-2xl font-bold mb-2">You're booked!</h2>
          <p className="text-emerald-100 mb-1">{formatDate(bookedSlot.date)}</p>
          <p className="text-sm text-emerald-200">{bookedSlot.reason}</p>

          {/* Show next recommendation preview */}
          {dynamicRecommendations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-xs uppercase tracking-widest text-emerald-200 mb-2">Your next recommended visit</p>
              <p className="text-lg font-bold">{formatDate(dynamicRecommendations[0].date)}</p>
              <p className="text-sm text-emerald-200">{dynamicRecommendations[0].reason}</p>
            </div>
          )}

          <button
            onClick={() => setBookedSlot(null)}
            className="mt-6 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white"
          >
            View all upcoming recommendations
          </button>
        </div>
      )}

      {/* Personal Welcome */}
      {!bookedSlot && (
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#161616] tracking-tight">
            Hey {state.profile?.name.split(' ')[0]}, looking good!
          </h1>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">
            {isCommentaryLoading ? "Finding your perfect timing..." : commentary}
          </p>
        </section>
      )}

      {/* Primary Recommendation - Make it obvious and easy */}
      {!bookedSlot && optimalSlot && (
        <section className="bg-gradient-to-br from-[#c0563b] to-[#a64932] rounded-[32px] p-8 md:p-10 text-white shadow-xl shadow-[#c0563b]/20 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-6">
            <span className="iconify text-2xl" data-icon="solar:star-bold"></span>
            <span className="text-sm font-bold uppercase tracking-widest opacity-80">Best time for you</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold">{formatDate(optimalSlot.date)}</h2>
              <p className="text-lg text-white/80 max-w-md">{optimalSlot.reason}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => handleBookClick(optimalSlot)}
              className="bg-white text-[#c0563b] hover:bg-white/90 px-8 py-4 text-lg font-bold shrink-0"
            >
              Book This Date
            </Button>
          </div>
        </section>
      )}

      {/* Other Options */}
      {!bookedSlot && otherSlots.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 text-center">
            Other good times
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherSlots.map((rec, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#e5e4e0] hover:border-[#c0563b]/30 hover:shadow-lg transition-all group cursor-pointer"
                onClick={() => handleBookClick(rec)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-[#161616] group-hover:text-[#c0563b] transition-colors">
                      {formatDate(rec.date)}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">{rec.reason}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#f3f2ee] group-hover:bg-[#c0563b] flex items-center justify-center transition-colors">
                    <span className="iconify text-slate-400 group-hover:text-white transition-colors" data-icon="solar:arrow-right-bold"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mini Calendar with recommended dates highlighted */}
      {!bookedSlot && (
        <section className="bg-white rounded-[32px] p-8 border border-[#e5e4e0] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#161616] flex items-center gap-2">
              <span className="iconify text-[#c0563b]" data-icon="solar:calendar-bold"></span>
              Your Schedule
            </h3>
            <span className="text-sm text-slate-500">January 2026</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-bold text-slate-400 py-2">{day}</div>
            ))}
            {/* Generate calendar days - Jan 2026 starts on Thursday */}
            {[...Array(4)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const isRecommended = recommendations.some(r => {
                const recDay = new Date(r.date).getDate();
                return recDay === day;
              });
              const isOptimal = recommendations.some(r => {
                const recDay = new Date(r.date).getDate();
                return recDay === day && r.score === 'optimal';
              });
              const isToday = day === 6;
              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isOptimal
                      ? 'bg-[#c0563b] text-white shadow-md'
                      : isRecommended
                      ? 'bg-[#fbeee0] text-[#c0563b]'
                      : isToday
                      ? 'bg-[#161616] text-white'
                      : 'hover:bg-[#f3f2ee] text-[#161616]'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#c0563b]"></div>
              <span>Best time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#fbeee0]"></div>
              <span>Good option</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#161616]"></div>
              <span>Today</span>
            </div>
          </div>
        </section>
      )}

      {/* Your Rhythm Card - Personal, not business metrics */}
      {!bookedSlot && (
        <section className="bg-[#f3f2ee] rounded-[32px] p-8 border border-[#e5e4e0]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#161616] flex items-center justify-center">
              <span className="iconify text-white text-2xl" data-icon="solar:user-bold"></span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#161616]">Your Preferences</h3>
              <p className="text-sm text-slate-500">Based on your lifestyle</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-[#c0563b]">
                {state.profile?.growthRate === 'fast' ? '1 week' : state.profile?.growthRate === 'average' ? '2-3 wks' : '1 month'}
              </div>
              <div className="text-xs text-slate-500 mt-1">Your cycle</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-[#161616]">
                {state.profile?.weeklyRhythm === 'busy-midweek' ? 'Weekdays' : state.profile?.weeklyRhythm === 'social-weekend' ? 'Weekends' : 'Flexible'}
              </div>
              <div className="text-xs text-slate-500 mt-1">Peak time</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center col-span-2 md:col-span-1">
              <div className="text-2xl font-bold text-emerald-600">Fresh</div>
              <div className="text-xs text-slate-500 mt-1">Status</div>
            </div>
          </div>

          <button
            onClick={onRefresh}
            className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#c0563b] flex items-center gap-2 mx-auto transition-colors"
          >
            <span className="iconify" data-icon="solar:refresh-bold-duotone"></span>
            Refresh recommendations
          </button>
        </section>
      )}

      {/* Notification Settings */}
      {!bookedSlot && (
        <section className="bg-white rounded-[32px] p-8 border border-[#e5e4e0]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#c0563b] flex items-center justify-center">
              <span className="iconify text-white text-2xl" data-icon="solar:bell-bing-bold"></span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#161616]">Reminders</h3>
              <p className="text-sm text-slate-500">How would you like to be notified?</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Notification channels */}
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex-1 flex items-center justify-between p-4 bg-[#f3f2ee] rounded-xl cursor-pointer hover:bg-[#e5e4e0] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="iconify text-xl text-[#161616]" data-icon="solar:letter-bold"></span>
                  <span className="font-medium text-[#161616]">Email</span>
                </div>
                <div
                  onClick={() => setNotifPrefs(p => ({ ...p, email: !p.email }))}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${notifPrefs.email ? 'bg-[#c0563b]' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifPrefs.email ? 'left-5' : 'left-0.5'}`}></div>
                </div>
              </label>

              <label className="flex-1 flex items-center justify-between p-4 bg-[#f3f2ee] rounded-xl cursor-pointer hover:bg-[#e5e4e0] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="iconify text-xl text-[#161616]" data-icon="solar:phone-bold"></span>
                  <span className="font-medium text-[#161616]">Text</span>
                </div>
                <div
                  onClick={() => setNotifPrefs(p => ({ ...p, text: !p.text }))}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${notifPrefs.text ? 'bg-[#c0563b]' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifPrefs.text ? 'left-5' : 'left-0.5'}`}></div>
                </div>
              </label>
            </div>

            {/* Reminder timing */}
            <div className="pt-4 border-t border-[#f3f2ee]">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Remind me</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setNotifPrefs(p => ({ ...p, reminder24h: !p.reminder24h }))}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    notifPrefs.reminder24h
                      ? 'bg-[#c0563b] text-white'
                      : 'bg-[#f3f2ee] text-[#555] hover:bg-[#e5e4e0]'
                  }`}
                >
                  24 hours before
                </button>
                <button
                  onClick={() => setNotifPrefs(p => ({ ...p, reminder1h: !p.reminder1h }))}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    notifPrefs.reminder1h
                      ? 'bg-[#c0563b] text-white'
                      : 'bg-[#f3f2ee] text-[#555] hover:bg-[#e5e4e0]'
                  }`}
                >
                  1 hour before
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Modal */}
      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};
