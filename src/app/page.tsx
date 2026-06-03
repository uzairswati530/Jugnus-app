'use client';

import { useState } from 'react';
import { Scissors, LayoutDashboard, BarChart3, CalendarCheck, Menu, X } from 'lucide-react';
import ReceptionistView from '@/components/receptionist-view';
import OwnerView from '@/components/owner-view';
import CustomerBookingView from '@/components/customer-booking-view';

type View = 'receptionist' | 'owner' | 'booking';

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'receptionist', label: 'Receptionist', icon: <LayoutDashboard size={18} /> },
  { id: 'owner', label: 'Owner', icon: <BarChart3 size={18} /> },
  { id: 'booking', label: 'Book Now', icon: <CalendarCheck size={18} /> },
];

export default function Home() {
  const [view, setView] = useState<View>('receptionist');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: View) => {
    setView(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-[rgba(197,160,68,0.2)] bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#C5A044] flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Jugnu's Salon" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-gray-900 text-sm md:text-base tracking-tight">Jugnu&apos;s </span>
              <span className="font-bold text-[#C5A044] text-sm md:text-base tracking-tight">Salon</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1 p-1 bg-[#FAFAFA] rounded-xl border border-[rgba(197,160,68,0.2)]">
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
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[#FAFAFA] border border-[rgba(197,160,68,0.2)]"
          >
            {mobileMenuOpen ? <X size={20} className="text-gray-600" /> : <Menu size={20} className="text-gray-600" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[rgba(197,160,68,0.15)] bg-white px-4 py-3 space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${view === item.id
                    ? 'bg-[#C5A044] text-white'
                    : 'text-gray-600 hover:bg-[#FAFAFA] hover:text-gray-900'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="header-underline" />
      </header>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[rgba(197,160,68,0.2)] safe-area-bottom">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all
                ${view === item.id ? 'text-[#C5A044]' : 'text-gray-400'}`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-0 md:px-2 pb-16 md:pb-0">
        {view === 'receptionist' && <ReceptionistView />}
        {view === 'owner' && <OwnerView />}
        {view === 'booking' && <CustomerBookingView />}
      </main>

      <footer className="hidden md:block border-t border-[rgba(197,160,68,0.15)] py-4 text-center text-xs text-gray-400 bg-[#FAFAFA]">
        Jugnu&apos;s Salon — Premium Beauty &amp; Style
      </footer>
    </div>
  );
}
