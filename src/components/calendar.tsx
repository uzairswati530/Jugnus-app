'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { TODAY_APPOINTMENTS, BRANCHES, formatPKR } from '@/lib/constants';

type CalendarView = 'month' | 'week' | 'day';

interface CalendarEvent {
  id: string;
  title: string;
  service: string;
  stylist: string;
  time: string;
  date: string;
  branch?: string;
  status: string;
}

interface CalendarProps {
  view?: 'owner' | 'receptionist';
  defaultBranch?: string;
}

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export default function CalendarComponent({ view = 'owner', defaultBranch = 'f7' }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const today = new Date();
  const events: CalendarEvent[] = TODAY_APPOINTMENTS.map(apt => ({
    id: apt.id,
    title: apt.customerName,
    service: apt.service,
    stylist: apt.stylist,
    time: apt.time,
    date: new Date().toISOString().split('T')[0],
    branch: selectedBranch,
    status: apt.status,
  }));

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days: (Date | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const goToToday = () => setCurrentDate(new Date());
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const formatMonth = () => currentDate.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
        <div className="flex items-center gap-3">
          {view === 'owner' && (
            <select
              className="input-dark px-4 py-2.5 text-sm"
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
            >
              {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          )}
          <div className="flex gap-1 p-1 bg-[#FAFAFA] rounded-lg border border-[rgba(197,160,68,0.3)]">
            {(['month', 'week', 'day'] as CalendarView[]).map(v => (
              <button
                key={v}
                onClick={() => setCalendarView(v)}
                className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition-all
                  ${calendarView === v ? 'bg-[#C5A044] text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {calendarView === 'month' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="btn-ghost p-2">
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-900 min-w-[200px] text-center">{formatMonth()}</h3>
            <button onClick={nextMonth} className="btn-ghost p-2">
              <ChevronRight size={20} />
            </button>
            <button onClick={goToToday} className="btn-ghost px-4 py-2 text-sm ml-4">
              Today
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-500 py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const isToday = day && isSameDay(day, today);
              const isPast = day && day < today && !isToday;
              const dayEvents = day ? events.filter(e => isSameDay(day, new Date(e.date))) : [];

              return (
                <div
                  key={i}
                  className={`aspect-square p-2 rounded-lg border-2 transition-all cursor-pointer
                    ${!day ? 'bg-transparent border-transparent' : isPast ? 'bg-gray-100 border-gray-200 opacity-50' : isToday ? 'border-[#C5A044] bg-[rgba(197,160,68,0.1)]' : 'bg-white border-[rgba(197,160,68,0.15)] hover:border-[#C5A044]'}`}
                >
                  {day && (
                    <>
                      <p className={`text-xs font-bold ${isToday ? 'text-[#C5A044]' : isPast ? 'text-gray-400' : 'text-gray-900'}`}>
                        {day.getDate()}
                      </p>
                      <div className="flex gap-0.5 mt-1 flex-wrap">
                        {dayEvents.map((e, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedEvent(e)}
                            className="w-1.5 h-1.5 rounded-full bg-[#C5A044] hover:bg-[#D4AF37] transition-colors cursor-pointer"
                            title={`${e.title}: ${e.service}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {calendarView === 'week' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="btn-ghost p-2">
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-900">Week View</h3>
            <button onClick={nextMonth} className="btn-ghost p-2">
              <ChevronRight size={20} />
            </button>
            <button onClick={goToToday} className="btn-ghost px-4 py-2 text-sm ml-4">
              Today
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[800px]">
              {[0, 1, 2, 3, 4, 5, 6].map(i => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() - d.getDay() + i);
                const dayEvents = events.filter(e => isSameDay(d, new Date(e.date)));

                return (
                  <div key={i} className="card-2 p-3 rounded-lg">
                    <p className="text-xs font-bold text-gray-500 mb-2">{d.toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    <div className="space-y-1">
                      {dayEvents.map(e => (
                        <div
                          key={e.id}
                          onClick={() => setSelectedEvent(e)}
                          className="text-xs bg-[rgba(197,160,68,0.1)] border border-[rgba(197,160,68,0.3)] rounded p-1.5 cursor-pointer hover:bg-[rgba(197,160,68,0.2)] transition-colors"
                        >
                          <p className="font-semibold text-gray-900 truncate">{e.title}</p>
                          <p className="text-gray-500 truncate">{e.service}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{e.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {calendarView === 'day' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentDate(new Date(currentDate.getTime() - 86400000))} className="btn-ghost p-2">
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-900">{currentDate.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <button onClick={() => setCurrentDate(new Date(currentDate.getTime() + 86400000))} className="btn-ghost p-2">
              <ChevronRight size={20} />
            </button>
            <button onClick={goToToday} className="btn-ghost px-4 py-2 text-sm ml-4">
              Today
            </button>
          </div>

          <div className="space-y-2">
            {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(hour => {
              const timeStr = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
              const hourEvents = events.filter(e => e.time.includes(String(hour).padStart(2, '0')));

              return (
                <div key={hour} className="flex gap-3">
                  <div className="w-20 text-xs font-medium text-gray-400 text-right pt-1 shrink-0">{timeStr}</div>
                  <div className="flex-1 min-h-[60px] bg-[#FAFAFA] rounded-lg border border-[rgba(197,160,68,0.15)] p-3">
                    {hourEvents.map(e => (
                      <div
                        key={e.id}
                        onClick={() => setSelectedEvent(e)}
                        className="bg-[rgba(197,160,68,0.1)] border border-[rgba(197,160,68,0.3)] rounded p-2 mb-2 cursor-pointer hover:bg-[rgba(197,160,68,0.2)] transition-colors"
                      >
                        <p className="text-sm font-semibold text-gray-900">{e.title}</p>
                        <p className="text-xs text-gray-500">{e.service}</p>
                        <p className="text-xs text-gray-400 mt-1">{e.stylist}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="card p-6 max-w-sm mx-4 space-y-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-500">{selectedEvent.service}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-900 transition-colors text-2xl -mt-2"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Stylist</span>
                <span className="text-gray-900 font-medium">{selectedEvent.stylist}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="text-gray-900 font-medium flex items-center gap-1"><Clock size={14} />{selectedEvent.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${selectedEvent.status === 'Done' ? 'bg-green-100 text-green-700' : selectedEvent.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {selectedEvent.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[rgba(197,160,68,0.2)]">
              <button onClick={() => setSelectedEvent(null)} className="btn-ghost flex-1 py-2.5 text-sm">
                Close
              </button>
              <button className="btn-primary flex-1 py-2.5 text-sm">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
