'use client';

import { useState } from 'react';
import { MessageSquare, TrendingUp, LayoutDashboard, Briefcase, Gift, Users, Settings, Calendar } from 'lucide-react';
import { BRANCHES, formatPKR } from '@/lib/constants';
import BranchDeepDive from './owner/branch-deep-dive';
import RevenueAnalytics from './owner/revenue-analytics';
import LoyaltyOverview from './owner/loyalty-overview';
import StaffScreen from './owner/staff-screen';
import ServicesManagement from './owner/services-management';
import StaffManagement from './owner/staff-management';
import CalendarComponent from './calendar';

type OwnerTab = 'overview' | 'branch' | 'revenue' | 'loyalty' | 'staff' | 'services' | 'staff-mgmt' | 'calendar';

function StylistBar({ stylists }: { stylists: { name: string; busy: boolean }[] }) {
  return (
    <div className="mt-3">
      <p className="text-xs text-gray-400 mb-1.5">Stylists</p>
      <div className="flex gap-1.5 flex-wrap">
        {stylists.map(s => (
          <div
            key={s.name}
            title={s.name}
            className={`h-2 flex-1 min-w-[20px] rounded-full ${s.busy ? 'bg-[#C5A044]' : 'bg-gray-300'}`}
          />
        ))}
      </div>
      <div className="flex gap-3 mt-1.5">
        <span className="text-xs text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C5A044] mr-1" />
          Busy ({stylists.filter(s => s.busy).length})
        </span>
        <span className="text-xs text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1" />
          Free ({stylists.filter(s => !s.busy).length})
        </span>
      </div>
    </div>
  );
}

function BranchCard({ branch, onDive }: { branch: typeof BRANCHES[0]; onDive: (id: string) => void }) {
  return (
    <button
      onClick={() => onDive(branch.id)}
      className="card p-5 flex flex-col gap-4 cursor-pointer transition-all hover:border-[#C5A044] text-left"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-tight">{branch.name}</h3>
          <p className="text-xs text-gray-400 mt-1">{branch.phone}</p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-[rgba(197,160,68,0.1)] border border-[rgba(197,160,68,0.3)] flex items-center justify-center">
          <Briefcase size={16} className="text-[#C5A044]" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="card-2 p-2.5 text-center rounded-lg">
          <p className="text-lg font-bold text-amber-600">{branch.activeQueue}</p>
          <p className="text-xs text-gray-400 mt-0.5">Queue</p>
        </div>
        <div className="card-2 p-2.5 text-center rounded-lg">
          <p className="text-lg font-bold text-blue-600">{branch.todayBookings}</p>
          <p className="text-xs text-gray-400 mt-0.5">Bookings</p>
        </div>
        <div className="card-2 p-2.5 text-center rounded-lg">
          <p className="text-sm font-bold text-green-600">{formatPKR(branch.revenue.today)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Revenue</p>
        </div>
      </div>

      <StylistBar stylists={branch.stylists} />
    </button>
  );
}

const NAV_ITEMS: { id: OwnerTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
  { id: 'branch', label: 'Branch Deep-Dive', icon: <Briefcase size={16} /> },
  { id: 'revenue', label: 'Revenue Analytics', icon: <TrendingUp size={16} /> },
  { id: 'loyalty', label: 'Loyalty', icon: <Gift size={16} /> },
  { id: 'staff', label: 'Staff', icon: <Users size={16} /> },
  { id: 'services', label: 'Services', icon: <Settings size={16} /> },
  { id: 'staff-mgmt', label: 'Staff Mgmt', icon: <Users size={16} /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={16} /> },
];

export default function OwnerView() {
  const [tab, setTab] = useState<OwnerTab>('overview');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const totalToday = BRANCHES.reduce((sum, b) => sum + b.revenue.today, 0);
  const totalWeek = BRANCHES.reduce((sum, b) => sum + b.revenue.week, 0);
  const totalMonth = BRANCHES.reduce((sum, b) => sum + b.revenue.month, 0);

  const whatsappSummary = () => {
    const date = now.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const lines = [
      `*Jugnu's Salon — Daily Report*`,
      `_${date}_`,
      ``,
      `*Revenue Summary:*`,
      ...BRANCHES.map(b => `• ${b.name}: ${formatPKR(b.revenue.today)}`),
      ``,
      `*Total Today:* ${formatPKR(totalToday)}`,
      `*Total This Week:* ${formatPKR(totalWeek)}`,
    ];
    const msg = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/923429309166?text=${msg}`, '_blank');
  };

  if (tab === 'branch' && selectedBranchId) {
    return (
      <BranchDeepDive
        branchId={selectedBranchId}
        onBack={() => setSelectedBranchId(null)}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">
            {now.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{greeting}, Owner</h2>
        </div>
        <button
          onClick={whatsappSummary}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm self-start md:self-auto"
        >
          <MessageSquare size={16} />
          WhatsApp Report
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-[#FAFAFA] rounded-lg border border-[rgba(197,160,68,0.3)] overflow-x-auto">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setTab(item.id);
              if (item.id !== 'branch') setSelectedBranchId(null);
            }}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all
              ${tab === item.id && !selectedBranchId
                ? 'bg-[#C5A044] text-white'
                : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Today's Total Revenue", value: formatPKR(totalToday), icon: <TrendingUp size={20} />, color: 'text-green-600' },
              { label: 'Total Bookings Today', value: BRANCHES.reduce((s, b) => s + b.todayBookings, 0), icon: <LayoutDashboard size={20} />, color: 'text-blue-600' },
              { label: 'Active Queue Across Branches', value: BRANCHES.reduce((s, b) => s + b.activeQueue, 0), icon: <Users size={20} />, color: 'text-amber-600' },
            ].map(stat => (
              <div key={stat.label} className="card p-4 flex items-center gap-4">
                <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">All Branches</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BRANCHES.map(branch => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  onDive={id => {
                    setSelectedBranchId(id);
                    setTab('branch');
                  }}
                />
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} className="text-[#C5A044]" />
              <h2 className="text-lg font-bold text-gray-900">Revenue Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(197,160,68,0.2)]">
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Branch</th>
                    <th className="text-right py-3 px-2 text-gray-500 font-medium">Today</th>
                    <th className="text-right py-3 px-2 text-gray-500 font-medium">This Week</th>
                    <th className="text-right py-3 px-2 text-gray-500 font-medium">This Month</th>
                  </tr>
                </thead>
                <tbody>
                  {BRANCHES.map((b, i) => (
                    <tr key={b.id} className={`border-b ${i < BRANCHES.length - 1 ? 'border-gray-100' : 'border-transparent'}`}>
                      <td className="py-3.5 px-2 font-medium text-gray-900">{b.name}</td>
                      <td className="py-3.5 px-2 text-right text-green-600">{formatPKR(b.revenue.today)}</td>
                      <td className="py-3.5 px-2 text-right text-blue-600">{formatPKR(b.revenue.week)}</td>
                      <td className="py-3.5 px-2 text-right text-amber-600">{formatPKR(b.revenue.month)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-[rgba(197,160,68,0.2)]">
                    <td className="py-3.5 px-2 font-bold text-gray-900">Total</td>
                    <td className="py-3.5 px-2 text-right font-bold text-green-600">{formatPKR(totalToday)}</td>
                    <td className="py-3.5 px-2 text-right font-bold text-blue-600">{formatPKR(totalWeek)}</td>
                    <td className="py-3.5 px-2 text-right font-bold text-amber-600">{formatPKR(totalMonth)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'revenue' && (
        <RevenueAnalytics period={period} onPeriodChange={setPeriod} />
      )}

      {tab === 'loyalty' && <LoyaltyOverview />}

      {tab === 'staff' && <StaffScreen />}

      {tab === 'services' && <ServicesManagement />}

      {tab === 'staff-mgmt' && <StaffManagement />}

      {tab === 'calendar' && <CalendarComponent view="owner" />}
    </div>
  );
}
