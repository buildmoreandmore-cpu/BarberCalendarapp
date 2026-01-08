
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

  // Use API recommendations if available, otherwise use demo data
  const recommendations = state.recommendations.length > 0 ? state.recommendations : DEMO_RECOMMENDATIONS;

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
      {BOOKED_APPOINTMENTS.length > 0 && (
        <section className="bg-[#f3f2ee] rounded-2xl p-6 border border-[#e5e4e0]">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Your Appointments</h3>
          <div className="space-y-3">
            {BOOKED_APPOINTMENTS.map(apt => (
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
                  <button className="text-slate-400 hover:text-[#c0563b]">
                    <span className="iconify text-xl" data-icon="solar:menu-dots-bold"></span>
                  </button>
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
          <button
            onClick={() => setBookedSlot(null)}
            className="mt-6 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white"
          >
            View other options
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
