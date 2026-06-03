import { useState } from 'react';
import { Scissors, LayoutDashboard, BarChart3, CalendarCheck } from 'lucide-react';
import ReceptionistView from './components/ReceptionistView';
import OwnerView from './components/OwnerView';
import CustomerBookingView from './components/CustomerBookingView';

type View = 'receptionist' | 'owner' | 'booking';

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'receptionist', label: 'Receptionist', icon: <LayoutDashboard size={18} /> },
  { id: 'owner', label: 'Owner', icon: <BarChart3 size={18} /> },
  { id: 'booking', label: 'Customer Booking', icon: <CalendarCheck size={18} /> },
];

export default function App() {
  const [view, setView] = useState<View>('receptionist');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Scissors size={18} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-white text-base tracking-tight">House of Salons</span>
              <span className="font-bold text-primary text-base tracking-tight"> OS</span>
            </div>
          </div>

          <nav className="flex gap-1 p-1 bg-surface rounded-xl border border-primary-border overflow-x-auto">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${view === item.id
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
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

      <footer className="border-t border-white/5 py-4 text-center text-xs text-gray-700">
        House of Salons OS — Premium Salon Management
      </footer>
    </div>
  );
}
