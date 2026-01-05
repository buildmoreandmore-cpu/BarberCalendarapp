
import React, { useState } from 'react';
import { Button } from './Button';

interface ClientRequest {
  id: string;
  name: string;
  avatar: string;
  date: string;
  time: string;
  service: string;
  reason: string;
  lastVisit: string;
  cadence: string;
  priority: number;
  status: 'pending' | 'confirmed';
}

const MOCK_REQUESTS: ClientRequest[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1503467913725-8484b65b0715?q=80&w=200&auto=format&fit=crop',
    date: 'Jan 8, 2026',
    time: '2:00 PM',
    service: 'Fade + Lineup',
    reason: 'Job interview on Jan 10',
    lastVisit: 'Dec 15, 2024',
    cadence: 'Every 2 weeks',
    priority: 9,
    status: 'pending'
  },
  {
    id: '2',
    name: 'Aaron Smith',
    avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=200&auto=format&fit=crop',
    date: 'Jan 9, 2026',
    time: '4:30 PM',
    service: 'Beard Trim + Hot Towel',
    reason: 'Anniversary dinner',
    lastVisit: 'Dec 20, 2024',
    cadence: 'Every 3 weeks',
    priority: 8,
    status: 'pending'
  },
  {
    id: '3',
    name: 'Derrick Rose',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    date: 'Jan 10, 2026',
    time: '11:00 AM',
    service: 'Classic Taper',
    reason: 'Weekly maintenance',
    lastVisit: 'Dec 28, 2024',
    cadence: 'Weekly',
    priority: 7,
    status: 'pending'
  }
];

const UPCOMING_BOOKINGS: ClientRequest[] = [
  {
    id: '101',
    name: 'James Morrison',
    avatar: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=200&auto=format&fit=crop',
    date: 'Today',
    time: '10:00 AM',
    service: 'Fade + Design',
    reason: '',
    lastVisit: '',
    cadence: '',
    priority: 0,
    status: 'confirmed'
  }
];

export const BarberDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming'>('pending');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const selectedClient = MOCK_REQUESTS.find(r => r.id === selectedClientId);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Sunday, January 4</div>
          <h1 className="text-5xl font-extrabold text-[#161616] tracking-tight">Good evening, James</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="px-4"><span className="iconify" data-icon="solar:calendar-bold-duotone"></span> View Calendar</Button>
          <Button variant="primary" className="px-8">+ New Manual Entry</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: '47', icon: 'solar:users-group-two-rounded-bold-duotone', color: 'text-brand-primary' },
          { label: 'This Week', value: '12 booked', icon: 'solar:calendar-minimalistic-bold-duotone', color: 'text-brand-primary' },
          { label: 'Completion Rate', value: '94%', icon: 'solar:chart-square-bold-duotone', color: 'text-emerald-500' },
          { label: 'Avg Rating', value: '4.9★', icon: 'solar:star-bold-duotone', color: 'text-orange-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-[#e5e4e0] shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-[#f3f2ee] flex items-center justify-center text-2xl ${stat.color}`}>
              <span className="iconify" data-icon={stat.icon}></span>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400">{stat.label}</div>
              <div className="text-xl font-bold text-[#161616]">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 bg-[#e5e4e0] p-1 rounded-full w-fit">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-[#161616] shadow-sm' : 'text-[#555] hover:text-[#161616]'}`}
            >
              Pending Requests (3)
            </button>
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-[#161616] shadow-sm' : 'text-[#555] hover:text-[#161616]'}`}
            >
              Upcoming
            </button>
          </div>

          <div className="space-y-3">
            {activeTab === 'pending' ? (
              MOCK_REQUESTS.map(req => (
                <div 
                  key={req.id}
                  onClick={() => setSelectedClientId(req.id)}
                  className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedClientId === req.id ? 'bg-white border-[#c0563b]' : 'bg-white/50 border-transparent hover:border-[#e5e4e0]'}`}
                >
                  <div className="flex items-start gap-4">
                    <img src={req.avatar} className="w-12 h-12 rounded-xl object-cover" alt={req.name} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-[#161616]">{req.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400">{req.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span className="font-bold text-[#161616]">{req.time}</span>
                        <span>•</span>
                        <span>{req.service}</span>
                      </div>
                      {req.reason && (
                        <div className="bg-[#fbeee0] text-[#c0563b] text-[10px] px-2 py-1 rounded-lg font-bold flex items-center gap-1.5 w-fit">
                          <span className="iconify" data-icon="solar:lightbulb-bold-duotone"></span>
                          {req.reason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              UPCOMING_BOOKINGS.map(req => (
                <div key={req.id} className="p-4 rounded-2xl border-2 border-transparent bg-white/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={req.avatar} className="w-12 h-12 rounded-xl object-cover" alt={req.name} />
                    <div>
                      <h4 className="font-bold text-[#161616]">{req.name}</h4>
                      <div className="text-xs text-slate-500">{req.time} • {req.service}</div>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Confirmed</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Detail Panel */}
        <div className="lg:col-span-7 bg-white rounded-[32px] border border-[#e5e4e0] shadow-sm overflow-hidden sticky top-8 min-h-[500px] flex flex-col">
          {selectedClient ? (
            <div className="p-10 space-y-10 flex-1">
              {/* Header Info */}
              <div className="flex items-center gap-6">
                <img src={selectedClient.avatar} className="w-20 h-20 rounded-[24px] object-cover" />
                <div>
                  <h2 className="text-3xl font-extrabold text-[#161616] tracking-tight">{selectedClient.name}</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Client since 2024</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12">
                {/* Booking Details */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Booking Details</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Requested Date', value: selectedClient.date },
                      { label: 'Requested Time', value: selectedClient.time },
                      { label: 'Service', value: selectedClient.service },
                      { label: 'Reason', value: selectedClient.reason || 'Routine Visit' }
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-[#f3f2ee]">
                        <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                        <span className="text-xs font-bold text-[#161616]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Insights */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Client Insights</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Last Visit', value: selectedClient.lastVisit },
                      { label: 'Usual Cadence', value: selectedClient.cadence },
                      { label: 'Freshness Priority', value: `${selectedClient.priority}/10` }
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-[#f3f2ee]">
                        <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                        <span className="text-xs font-bold text-[#161616]">{item.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-slate-500 font-medium">Growth Stage</span>
                      <span className="bg-[#fbeee0] text-[#c0563b] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Optimal Window</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-10 flex flex-col gap-3">
                <Button variant="primary" className="py-5 text-lg">Approve Booking</Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" className="font-bold">Decline</Button>
                  <Button variant="outline" className="font-bold">Suggest Alternative Time</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6 opacity-40">
              <span className="iconify text-8xl text-slate-300" data-icon="solar:hand-shake-bold-duotone"></span>
              <div>
                <h3 className="text-2xl font-extrabold text-[#161616]">Select a request</h3>
                <p className="text-sm font-medium text-slate-500">View client details and approve bookings</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
