'use client';

import { useState } from 'react';
import { Scissors, LayoutDashboard, BarChart3, CalendarCheck } from 'lucide-react';
import ReceptionistView from '@/components/receptionist-view';
import OwnerView from '@/components/owner-view';
import CustomerBookingView from '@/components/customer-booking-view';

type View = 'receptionist' | 'owner' | 'booking';

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'receptionist', label: 'Receptionist', icon: <LayoutDashboard size={18} /> },
  { id: 'owner', label: 'Owner', icon: <BarChart3 size={18} /> },
  { id: 'booking', label: 'Customer Booking', icon: <CalendarCheck size={18} /> },
];

export default function Home() {
  const [view, setView] = useState<View>('receptionist');

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-[rgba(197,160,68,0.2)] bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#C5A044] flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Jugnu's Salon" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-gray-900 text-base tracking-tight">Jugnu&apos;s </span>
              <span className="font-bold text-[#C5A044] text-base tracking-tight">Salon</span>
            </div>
          </div>

          <nav className="flex gap-1 p-1 bg-[#FAFAFA] rounded-xl border border-[rgba(197,160,68,0.2)] overflow-x-auto">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${view === item.id
                    ? 'bg-[#C5A044] text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white'
                  }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="header-underline" />
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-0 md:px-2">
        {view === 'receptionist' && <ReceptionistView />}
        {view === 'owner' && <OwnerView />}
        {view === 'booking' && <CustomerBookingView />}
      </main>

      <footer className="border-t border-[rgba(197,160,68,0.15)] py-4 text-center text-xs text-gray-400 bg-[#FAFAFA]">
        Jugnu&apos;s Salon — Premium Beauty &amp; Style
      </footer>
    </div>
  );
}
