
import React, { useState } from 'react';
import { Button } from './Button';

// Types
interface ClientProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  clientSince: string;
  // Quiz answers
  workSchedule: string;
  travelFrequency: string;
  socialLife: string;
  freshnessPriority: number;
  preferredCadence: string;
  preferredTime: string;
  // Computed/tracked
  lastVisit: string;
  totalVisits: number;
  notes: string;
  upcomingEvents: { date: string; event: string }[];
}

interface Notification {
  id: string;
  type: 'new_client' | 'quiz_update' | 'change_request' | 'overdue' | 'appointment';
  clientId: string;
  clientName: string;
  clientAvatar: string;
  message: string;
  detail: string;
  timestamp: string;
  read: boolean;
}

interface ScheduledAppointment {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  date: string;
  time: string;
  service: string;
  reason: string;
  status: 'recommended' | 'confirmed' | 'pending';
  isAiRecommended: boolean;
}

// Mock Data
const MOCK_CLIENTS: ClientProfile[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1503467913725-8484b65b0715?q=80&w=200&auto=format&fit=crop',
    phone: '(555) 123-4567',
    email: 'marcus.j@email.com',
    clientSince: 'March 2024',
    workSchedule: '9-5 Corporate',
    travelFrequency: '1-2 trips/month',
    socialLife: 'Active - weekends',
    freshnessPriority: 9,
    preferredCadence: 'Every 2 weeks',
    preferredTime: 'Mornings',
    lastVisit: 'Dec 15, 2025',
    totalVisits: 18,
    notes: 'Prefers skin fade, likes to chat about sports. Tips well.',
    upcomingEvents: [
      { date: 'Jan 10', event: 'Job Interview' },
      { date: 'Jan 25', event: 'Wedding (guest)' }
    ]
  },
  {
    id: '2',
    name: 'Aaron Smith',
    avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=200&auto=format&fit=crop',
    phone: '(555) 234-5678',
    email: 'aaron.s@email.com',
    clientSince: 'June 2024',
    workSchedule: 'Remote/Flexible',
    travelFrequency: 'Rarely',
    socialLife: 'Moderate',
    freshnessPriority: 7,
    preferredCadence: 'Every 3 weeks',
    preferredTime: 'Afternoons',
    lastVisit: 'Dec 20, 2025',
    totalVisits: 9,
    notes: 'Beard trim specialist. Sensitive scalp - use gentle products.',
    upcomingEvents: [
      { date: 'Jan 9', event: 'Anniversary Dinner' }
    ]
  },
  {
    id: '3',
    name: 'Derrick Williams',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    phone: '(555) 345-6789',
    email: 'derrick.w@email.com',
    clientSince: 'January 2024',
    workSchedule: 'Shift work',
    travelFrequency: 'Never',
    socialLife: 'Very active',
    freshnessPriority: 10,
    preferredCadence: 'Weekly',
    preferredTime: 'Any',
    lastVisit: 'Dec 28, 2025',
    totalVisits: 42,
    notes: 'VIP client. Always wants the freshest fade. Flexible with timing.',
    upcomingEvents: []
  },
  {
    id: '4',
    name: 'Tyler Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    phone: '(555) 456-7890',
    email: 'tyler.c@email.com',
    clientSince: 'Today',
    workSchedule: 'Startup founder',
    travelFrequency: '3-4 trips/month',
    socialLife: 'Networking events',
    freshnessPriority: 8,
    preferredCadence: 'Every 2 weeks',
    preferredTime: 'Early mornings',
    lastVisit: 'Never',
    totalVisits: 0,
    notes: '',
    upcomingEvents: [
      { date: 'Jan 15', event: 'Investor Pitch' },
      { date: 'Jan 22', event: 'Conference Speaker' }
    ]
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'new_client',
    clientId: '4',
    clientName: 'Tyler Chen',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    message: 'New client completed profile',
    detail: 'View recommended schedule for the next 3 months',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'n2',
    type: 'quiz_update',
    clientId: '1',
    clientName: 'Marcus Johnson',
    clientAvatar: 'https://images.unsplash.com/photo-1503467913725-8484b65b0715?q=80&w=200&auto=format&fit=crop',
    message: 'Updated his profile',
    detail: 'Added job interview on Jan 10 and wedding on Jan 25',
    timestamp: '5 hours ago',
    read: false
  },
  {
    id: 'n3',
    type: 'change_request',
    clientId: '2',
    clientName: 'Aaron Smith',
    clientAvatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=200&auto=format&fit=crop',
    message: 'Requested to reschedule',
    detail: 'Move Jan 9, 4:30 PM to Jan 10, 2:00 PM',
    timestamp: 'Yesterday',
    read: true
  },
  {
    id: 'n4',
    type: 'overdue',
    clientId: '3',
    clientName: 'Derrick Williams',
    clientAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    message: '9 days since last cut',
    detail: 'Usually comes weekly. Send a reminder?',
    timestamp: 'Yesterday',
    read: true
  },
  {
    id: 'n5',
    type: 'appointment',
    clientId: '1',
    clientName: 'Marcus Johnson',
    clientAvatar: 'https://images.unsplash.com/photo-1503467913725-8484b65b0715?q=80&w=200&auto=format&fit=crop',
    message: 'Appointment tomorrow',
    detail: 'Jan 8, 2:00 PM - Fade + Lineup (Job interview Friday)',
    timestamp: 'Today',
    read: false
  }
];

const MOCK_SCHEDULE: ScheduledAppointment[] = [
  { id: 's1', clientId: '1', clientName: 'Marcus Johnson', clientAvatar: MOCK_CLIENTS[0].avatar, date: '2026-01-08', time: '2:00 PM', service: 'Fade + Lineup', reason: 'Job interview Jan 10', status: 'confirmed', isAiRecommended: true },
  { id: 's2', clientId: '2', clientName: 'Aaron Smith', clientAvatar: MOCK_CLIENTS[1].avatar, date: '2026-01-09', time: '4:30 PM', service: 'Beard Trim', reason: 'Anniversary dinner', status: 'pending', isAiRecommended: true },
  { id: 's3', clientId: '3', clientName: 'Derrick Williams', clientAvatar: MOCK_CLIENTS[2].avatar, date: '2026-01-10', time: '11:00 AM', service: 'Classic Taper', reason: 'Weekly maintenance', status: 'confirmed', isAiRecommended: false },
  { id: 's4', clientId: '1', clientName: 'Marcus Johnson', clientAvatar: MOCK_CLIENTS[0].avatar, date: '2026-01-22', time: '10:00 AM', service: 'Fade + Lineup', reason: '3 days before wedding', status: 'recommended', isAiRecommended: true },
  { id: 's5', clientId: '4', clientName: 'Tyler Chen', clientAvatar: MOCK_CLIENTS[3].avatar, date: '2026-01-13', time: '8:00 AM', service: 'Executive Cut', reason: '2 days before investor pitch', status: 'recommended', isAiRecommended: true },
  { id: 's6', clientId: '4', clientName: 'Tyler Chen', clientAvatar: MOCK_CLIENTS[3].avatar, date: '2026-01-27', time: '8:00 AM', service: 'Executive Cut', reason: 'Regular 2-week cadence', status: 'recommended', isAiRecommended: true },
  { id: 's7', clientId: '2', clientName: 'Aaron Smith', clientAvatar: MOCK_CLIENTS[1].avatar, date: '2026-01-30', time: '3:00 PM', service: 'Beard Trim', reason: 'Regular 3-week cadence', status: 'recommended', isAiRecommended: true },
];

type MainTab = 'inbox' | 'clients' | 'calendar';

export const BarberDashboard: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTab>('inbox');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [clients] = useState(MOCK_CLIENTS);
  const [schedule, setSchedule] = useState(MOCK_SCHEDULE);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(0); // 0 = January, 1 = February, etc.

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const selectedNotification = notifications.find(n => n.id === selectedNotificationId);
  const unreadCount = notifications.filter(n => !n.read).length;

  const showToast = (message: string) => {
    setShowConfirmation(message);
    setTimeout(() => setShowConfirmation(null), 3000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const approveAppointment = (appointmentId: string) => {
    setSchedule(prev => prev.map(s => s.id === appointmentId ? { ...s, status: 'confirmed' } : s));
    showToast('Appointment confirmed!');
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_client': return 'solar:user-plus-bold-duotone';
      case 'quiz_update': return 'solar:pen-new-square-bold-duotone';
      case 'change_request': return 'solar:calendar-bold-duotone';
      case 'overdue': return 'solar:alarm-bold-duotone';
      case 'appointment': return 'solar:bell-bing-bold-duotone';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'new_client': return 'bg-emerald-500';
      case 'quiz_update': return 'bg-blue-500';
      case 'change_request': return 'bg-orange-500';
      case 'overdue': return 'bg-red-500';
      case 'appointment': return 'bg-[#c0563b]';
    }
  };

  // Calendar helpers
  const months = ['January', 'February', 'March'];
  const getDaysInMonth = (monthOffset: number) => {
    const days = [31, 28, 31]; // Jan, Feb, Mar 2026
    return days[monthOffset];
  };
  const getFirstDayOfMonth = (monthOffset: number) => {
    const firstDays = [4, 0, 0]; // Jan 2026 starts on Thursday (4), Feb on Sunday (0), Mar on Sunday (0)
    return firstDays[monthOffset];
  };

  const getAppointmentsForDate = (monthOffset: number, day: number) => {
    const month = String(monthOffset + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `2026-${month}-${dayStr}`;
    return schedule.filter(s => s.date === dateStr);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Confirmation Toast */}
      {showConfirmation && (
        <div className="fixed top-24 right-6 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-lg animate-fade-in-up z-50 flex items-center gap-3">
          <span className="iconify text-2xl" data-icon="solar:check-circle-bold"></span>
          <span className="font-bold">{showConfirmation}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Monday, January 6, 2026</div>
          <h1 className="text-4xl font-extrabold text-[#161616] tracking-tight">Good evening, James</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Main Navigation */}
          <div className="flex items-center gap-1 bg-[#e5e4e0] p-1 rounded-full">
            <button
              onClick={() => setMainTab('inbox')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${mainTab === 'inbox' ? 'bg-white text-[#161616] shadow-sm' : 'text-[#555] hover:text-[#161616]'}`}
            >
              <span className="iconify" data-icon="solar:inbox-bold-duotone"></span>
              Inbox
              {unreadCount > 0 && (
                <span className="bg-[#c0563b] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
            <button
              onClick={() => setMainTab('clients')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${mainTab === 'clients' ? 'bg-white text-[#161616] shadow-sm' : 'text-[#555] hover:text-[#161616]'}`}
            >
              <span className="iconify" data-icon="solar:users-group-rounded-bold-duotone"></span>
              Clients
            </button>
            <button
              onClick={() => setMainTab('calendar')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${mainTab === 'calendar' ? 'bg-white text-[#161616] shadow-sm' : 'text-[#555] hover:text-[#161616]'}`}
            >
              <span className="iconify" data-icon="solar:calendar-bold-duotone"></span>
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Clients', value: '47', icon: 'solar:users-group-two-rounded-bold-duotone', color: 'text-[#c0563b]' },
          { label: 'This Week', value: '12 booked', icon: 'solar:calendar-minimalistic-bold-duotone', color: 'text-[#c0563b]' },
          { label: 'Pending', value: `${schedule.filter(s => s.status === 'pending' || s.status === 'recommended').length} requests`, icon: 'solar:clock-circle-bold-duotone', color: 'text-orange-500' },
          { label: 'Completion Rate', value: '94%', icon: 'solar:chart-square-bold-duotone', color: 'text-emerald-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#e5e4e0] shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl bg-[#f3f2ee] flex items-center justify-center text-xl ${stat.color}`}>
              <span className="iconify" data-icon={stat.icon}></span>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400">{stat.label}</div>
              <div className="text-lg font-bold text-[#161616]">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      {mainTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Notifications</h2>
            <div className="space-y-2">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => { setSelectedNotificationId(notif.id); markAsRead(notif.id); setSelectedClientId(notif.clientId); }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedNotificationId === notif.id ? 'bg-white border-[#c0563b]' : notif.read ? 'bg-white/50 border-transparent hover:border-[#e5e4e0]' : 'bg-white border-[#e5e4e0]'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img src={notif.clientAvatar} className="w-12 h-12 rounded-xl object-cover" alt={notif.clientName} />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg ${getNotificationColor(notif.type)} flex items-center justify-center`}>
                        <span className="iconify text-white text-sm" data-icon={getNotificationIcon(notif.type)}></span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-[#161616] truncate">{notif.clientName}</h4>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-1 truncate">{notif.detail}</p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-[#c0563b] flex-shrink-0 mt-2"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#e5e4e0] shadow-sm overflow-hidden min-h-[600px]">
            {selectedClient && selectedNotification ? (
              <div className="p-8 space-y-6">
                {/* Client Header */}
                <div className="flex items-center gap-4">
                  <img src={selectedClient.avatar} className="w-16 h-16 rounded-2xl object-cover" alt={selectedClient.name} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-extrabold text-[#161616]">{selectedClient.name}</h2>
                    <p className="text-slate-400 text-sm">Client since {selectedClient.clientSince} • {selectedClient.totalVisits} visits</p>
                  </div>
                  {selectedNotification.type === 'new_client' && (
                    <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">New</span>
                  )}
                </div>

                {/* Notification Context */}
                <div className={`p-4 rounded-xl ${getNotificationColor(selectedNotification.type)} bg-opacity-10`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`iconify ${getNotificationColor(selectedNotification.type).replace('bg-', 'text-')}`} data-icon={getNotificationIcon(selectedNotification.type)}></span>
                    <span className="font-bold text-[#161616]">{selectedNotification.message}</span>
                  </div>
                  <p className="text-sm text-slate-600">{selectedNotification.detail}</p>
                </div>

                {/* Quiz Answers / Profile */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Lifestyle Profile</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Work Schedule', value: selectedClient.workSchedule, icon: 'solar:case-round-bold-duotone' },
                      { label: 'Travel', value: selectedClient.travelFrequency, icon: 'solar:airplane-bold-duotone' },
                      { label: 'Social Life', value: selectedClient.socialLife, icon: 'solar:users-group-rounded-bold-duotone' },
                      { label: 'Freshness Priority', value: `${selectedClient.freshnessPriority}/10`, icon: 'solar:star-bold-duotone' },
                      { label: 'Preferred Cadence', value: selectedClient.preferredCadence, icon: 'solar:calendar-bold-duotone' },
                      { label: 'Preferred Time', value: selectedClient.preferredTime, icon: 'solar:clock-circle-bold-duotone' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#f3f2ee] rounded-xl">
                        <span className="iconify text-[#c0563b] text-lg" data-icon={item.icon}></span>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</div>
                          <div className="text-sm font-bold text-[#161616]">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events */}
                {selectedClient.upcomingEvents.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Upcoming Events</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.upcomingEvents.map((event, i) => (
                        <div key={i} className="bg-[#fbeee0] text-[#c0563b] px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                          <span className="iconify" data-icon="solar:calendar-mark-bold-duotone"></span>
                          {event.date}: {event.event}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Recommended Schedule */}
                {selectedNotification.type === 'new_client' && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">AI Recommended Schedule</h3>
                    <div className="space-y-2">
                      {schedule.filter(s => s.clientId === selectedClient.id && s.isAiRecommended).map(apt => (
                        <div key={apt.id} className="flex items-center justify-between p-3 bg-[#f3f2ee] rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#c0563b] flex items-center justify-center text-white font-bold text-sm">
                              {apt.date.split('-')[2]}
                            </div>
                            <div>
                              <div className="font-bold text-[#161616]">{apt.time} - {apt.service}</div>
                              <div className="text-xs text-slate-500">{apt.reason}</div>
                            </div>
                          </div>
                          {apt.status === 'recommended' ? (
                            <Button variant="primary" className="text-xs px-4 py-2" onClick={() => approveAppointment(apt.id)}>Approve</Button>
                          ) : (
                            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                              <span className="iconify" data-icon="solar:check-circle-bold"></span> Confirmed
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedClient.notes && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Notes</h3>
                    <p className="text-sm text-slate-600 bg-[#f3f2ee] p-3 rounded-xl">{selectedClient.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex gap-3">
                  {selectedNotification.type === 'new_client' && (
                    <Button variant="primary" className="flex-1" onClick={() => showToast('Schedule approved!')}>
                      Approve All Recommendations
                    </Button>
                  )}
                  {selectedNotification.type === 'change_request' && (
                    <>
                      <Button variant="primary" className="flex-1" onClick={() => showToast('Change approved!')}>Approve Change</Button>
                      <Button variant="secondary" onClick={() => showToast('Change declined')}>Decline</Button>
                    </>
                  )}
                  {selectedNotification.type === 'overdue' && (
                    <Button variant="primary" className="flex-1" onClick={() => showToast('Reminder sent!')}>
                      <span className="iconify mr-2" data-icon="solar:bell-bing-bold-duotone"></span>
                      Send Reminder
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => { setMainTab('clients'); }}>View Full Profile</Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-40">
                <span className="iconify text-7xl text-slate-300 mb-4" data-icon="solar:inbox-bold-duotone"></span>
                <h3 className="text-xl font-bold text-[#161616]">Select a notification</h3>
                <p className="text-sm text-slate-500">View details and take action</p>
              </div>
            )}
          </div>
        </div>
      )}

      {mainTab === 'clients' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Clients List */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">All Clients ({clients.length})</h2>
            <div className="space-y-2">
              {clients.map(client => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedClientId === client.id ? 'bg-white border-[#c0563b]' : 'bg-white/50 border-transparent hover:border-[#e5e4e0]'}`}
                >
                  <div className="flex items-center gap-3">
                    <img src={client.avatar} className="w-12 h-12 rounded-xl object-cover" alt={client.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-[#161616]">{client.name}</h4>
                      <p className="text-xs text-slate-500">{client.preferredCadence} • Last: {client.lastVisit}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#c0563b]">{client.freshnessPriority}/10</div>
                      <div className="text-[10px] text-slate-400">Priority</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Detail */}
          <div className="lg:col-span-8 bg-white rounded-[24px] border border-[#e5e4e0] shadow-sm overflow-hidden min-h-[600px]">
            {selectedClient ? (
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img src={selectedClient.avatar} className="w-20 h-20 rounded-2xl object-cover" alt={selectedClient.name} />
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#161616]">{selectedClient.name}</h2>
                      <p className="text-slate-500">{selectedClient.email}</p>
                      <p className="text-slate-400 text-sm">{selectedClient.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#c0563b]">{selectedClient.totalVisits}</div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Total Visits</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#f3f2ee] p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#161616]">{selectedClient.freshnessPriority}/10</div>
                    <div className="text-xs text-slate-500">Freshness Priority</div>
                  </div>
                  <div className="bg-[#f3f2ee] p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#161616]">{selectedClient.preferredCadence.replace('Every ', '')}</div>
                    <div className="text-xs text-slate-500">Visit Cadence</div>
                  </div>
                  <div className="bg-[#f3f2ee] p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#161616]">{selectedClient.lastVisit.split(',')[0]}</div>
                    <div className="text-xs text-slate-500">Last Visit</div>
                  </div>
                </div>

                {/* Full Profile */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Lifestyle</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Work', value: selectedClient.workSchedule },
                        { label: 'Travel', value: selectedClient.travelFrequency },
                        { label: 'Social', value: selectedClient.socialLife },
                        { label: 'Preferred Time', value: selectedClient.preferredTime },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-[#f3f2ee]">
                          <span className="text-sm text-slate-500">{item.label}</span>
                          <span className="text-sm font-bold text-[#161616]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Upcoming Events</h3>
                    {selectedClient.upcomingEvents.length > 0 ? (
                      <div className="space-y-2">
                        {selectedClient.upcomingEvents.map((event, i) => (
                          <div key={i} className="bg-[#fbeee0] p-3 rounded-xl">
                            <div className="font-bold text-[#c0563b]">{event.event}</div>
                            <div className="text-xs text-slate-500">{event.date}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No upcoming events</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Notes</h3>
                  <textarea
                    className="w-full p-4 bg-[#f3f2ee] rounded-xl border-2 border-transparent focus:border-[#c0563b] focus:outline-none text-sm"
                    rows={3}
                    defaultValue={selectedClient.notes}
                    placeholder="Add notes about this client..."
                  />
                </div>

                {/* Scheduled Appointments */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Scheduled Appointments</h3>
                  <div className="space-y-2">
                    {schedule.filter(s => s.clientId === selectedClient.id).map(apt => (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-[#f3f2ee] rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${apt.status === 'confirmed' ? 'bg-emerald-500' : apt.status === 'pending' ? 'bg-orange-500' : 'bg-[#c0563b]'}`}>
                            {apt.date.split('-')[2]}
                          </div>
                          <div>
                            <div className="font-bold text-[#161616]">{apt.time} - {apt.service}</div>
                            <div className="text-xs text-slate-500">{apt.reason}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : apt.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-[#fbeee0] text-[#c0563b]'}`}>
                          {apt.status === 'recommended' ? 'AI Suggested' : apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-40">
                <span className="iconify text-7xl text-slate-300 mb-4" data-icon="solar:user-bold-duotone"></span>
                <h3 className="text-xl font-bold text-[#161616]">Select a client</h3>
                <p className="text-sm text-slate-500">View profile and manage appointments</p>
              </div>
            )}
          </div>
        </div>
      )}

      {mainTab === 'calendar' && (
        <div className="space-y-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-[#161616]">{months[calendarMonth]} 2026</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalendarMonth(Math.max(0, calendarMonth - 1))}
                disabled={calendarMonth === 0}
                className="w-10 h-10 rounded-xl bg-[#e5e4e0] flex items-center justify-center disabled:opacity-30"
              >
                <span className="iconify" data-icon="solar:arrow-left-bold"></span>
              </button>
              <button
                onClick={() => setCalendarMonth(Math.min(2, calendarMonth + 1))}
                disabled={calendarMonth === 2}
                className="w-10 h-10 rounded-xl bg-[#e5e4e0] flex items-center justify-center disabled:opacity-30"
              >
                <span className="iconify" data-icon="solar:arrow-right-bold"></span>
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500"></div>
              <span className="text-slate-600">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span className="text-slate-600">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#c0563b]"></div>
              <span className="text-slate-600">AI Recommended</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-[24px] border border-[#e5e4e0] p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-black text-slate-400 uppercase py-2">{day}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for first day offset */}
              {[...Array(getFirstDayOfMonth(calendarMonth))].map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}

              {/* Day cells */}
              {[...Array(getDaysInMonth(calendarMonth))].map((_, i) => {
                const day = i + 1;
                const appointments = getAppointmentsForDate(calendarMonth, day);
                const isToday = calendarMonth === 0 && day === 6;

                return (
                  <div
                    key={day}
                    className={`aspect-square p-2 rounded-xl border-2 transition-all ${isToday ? 'border-[#161616] bg-[#161616]' : appointments.length > 0 ? 'border-[#e5e4e0] bg-white hover:border-[#c0563b]' : 'border-transparent hover:bg-[#f3f2ee]'}`}
                  >
                    <div className={`text-sm font-bold mb-1 ${isToday ? 'text-white' : 'text-[#161616]'}`}>{day}</div>
                    <div className="space-y-1">
                      {appointments.slice(0, 2).map(apt => (
                        <div
                          key={apt.id}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${apt.status === 'confirmed' ? 'bg-emerald-500 text-white' : apt.status === 'pending' ? 'bg-orange-500 text-white' : 'bg-[#c0563b] text-white'}`}
                        >
                          {apt.clientName.split(' ')[0]}
                        </div>
                      ))}
                      {appointments.length > 2 && (
                        <div className="text-[9px] text-slate-400 font-bold">+{appointments.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming List */}
          <div className="bg-white rounded-[24px] border border-[#e5e4e0] p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Upcoming This Month</h3>
            <div className="space-y-2">
              {schedule
                .filter(s => s.date.startsWith(`2026-${String(calendarMonth + 1).padStart(2, '0')}`))
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-[#f3f2ee] rounded-xl">
                    <div className="flex items-center gap-4">
                      <img src={apt.clientAvatar} className="w-10 h-10 rounded-xl object-cover" alt={apt.clientName} />
                      <div>
                        <div className="font-bold text-[#161616]">{apt.clientName}</div>
                        <div className="text-xs text-slate-500">{apt.date.split('-')[2]} {months[calendarMonth]} • {apt.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {apt.reason && (
                        <div className="bg-[#fbeee0] text-[#c0563b] text-[10px] px-2 py-1 rounded-lg font-bold hidden md:block">
                          {apt.reason}
                        </div>
                      )}
                      {apt.status === 'recommended' ? (
                        <Button variant="primary" className="text-xs px-3 py-1.5" onClick={() => approveAppointment(apt.id)}>Approve</Button>
                      ) : (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                          {apt.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
