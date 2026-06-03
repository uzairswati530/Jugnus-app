import { useState } from 'react';
import { MessageSquare, TrendingUp, LayoutDashboard, Briefcase, Gift, Users, Settings, Calendar } from 'lucide-react';
import { BRANCHES, formatPKR } from '../data/constants';
import BranchDeepDive from './owner/BranchDeepDive';
import RevenueAnalytics from './owner/RevenueAnalytics';
import LoyaltyOverview from './owner/LoyaltyOverview';
import StaffScreen from './owner/StaffScreen';
import ServicesManagement from './owner/ServicesManagement';
import StaffManagement from './owner/StaffManagement';
import CalendarComponent from './Calendar';

type OwnerTab = 'overview' | 'branch' | 'revenue' | 'loyalty' | 'staff' | 'services' | 'staff-mgmt' | 'calendar';

function StylistBar({ stylists }: { stylists: { name: string; busy: boolean }[] }) {
  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-1.5">Stylists</p>
      <div className="flex gap-1.5 flex-wrap">
        {stylists.map(s => (
          <div
            key={s.name}
            title={s.name}
            className={`h-2 flex-1 min-w-[20px] rounded-full ${s.busy ? 'bg-primary' : 'bg-gray-700'}`}
          />
        ))}
      </div>
      <div className="flex gap-3 mt-1.5">
        <span className="text-xs text-gray-500">
          <span className="inline-block w-2 h-2 rounded-full bg-primary mr-1" />
          Busy ({stylists.filter(s => s.busy).length})
        </span>
        <span className="text-xs text-gray-500">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-700 mr-1" />
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
      className="card p-5 flex flex-col gap-4 cursor-pointer transition-all hover:border-primary text-left"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-white text-base leading-tight">{branch.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{branch.phone}</p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-primary-dim border border-primary-border flex items-center justify-center">
          <Briefcase size={16} className="text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="card-2 p-2.5 text-center rounded-lg">
          <p className="text-lg font-bold text-amber-400">{branch.activeQueue}</p>
          <p className="text-xs text-gray-500 mt-0.5">Queue</p>
        </div>
        <div className="card-2 p-2.5 text-center rounded-lg">
          <p className="text-lg font-bold text-blue-400">{branch.todayBookings}</p>
          <p className="text-xs text-gray-500 mt-0.5">Bookings</p>
        </div>
        <div className="card-2 p-2.5 text-center rounded-lg">
          <p className="text-sm font-bold text-green-400">{formatPKR(branch.revenue.today)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Revenue</p>
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
      `*House of Salons — Daily Report*`,
      `_${date}_`,
      ``,
      `*Revenue Summary:*`,
      ...BRANCHES.map(b => `• ${b.name}: ${formatPKR(b.revenue.today)}`),
      ``,
      `*Total Today:* ${formatPKR(totalToday)}`,
      `*Total This Week:* ${formatPKR(totalWeek)}`,
    ];
    const msg = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/923001655518?text=${msg}`, '_blank');
  };

  // Branch Deep-Dive View
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
      {/* Header with Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            {now.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="text-2xl font-bold text-white mt-1">{greeting}, Owner</h2>
        </div>
        <button
          onClick={whatsappSummary}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm self-start md:self-auto"
        >
          <MessageSquare size={16} />
          WhatsApp Report
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-surface rounded-lg border border-primary-border overflow-x-auto">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setTab(item.id);
              if (item.id !== 'branch') setSelectedBranchId(null);
            }}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all
              ${tab === item.id && !selectedBranchId
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Today's Total Revenue", value: formatPKR(totalToday), icon: <TrendingUp size={20} />, color: 'text-green-400' },
              { label: 'Total Bookings Today', value: BRANCHES.reduce((s, b) => s + b.todayBookings, 0), icon: <LayoutDashboard size={20} />, color: 'text-blue-400' },
              { label: 'Active Queue Across Branches', value: BRANCHES.reduce((s, b) => s + b.activeQueue, 0), icon: <Users size={20} />, color: 'text-amber-400' },
            ].map(stat => (
              <div key={stat.label} className="card p-4 flex items-center gap-4">
                <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Branch Cards Grid */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">All Branches</h3>
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

          {/* Revenue Comparison Table */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-white">Revenue Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary-border">
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Branch</th>
                    <th className="text-right py-3 px-2 text-gray-400 font-medium">Today</th>
                    <th className="text-right py-3 px-2 text-gray-400 font-medium">This Week</th>
                    <th className="text-right py-3 px-2 text-gray-400 font-medium">This Month</th>
                  </tr>
                </thead>
                <tbody>
                  {BRANCHES.map((b, i) => (
                    <tr key={b.id} className={`border-b ${i < BRANCHES.length - 1 ? 'border-white/5' : 'border-transparent'}`}>
                      <td className="py-3.5 px-2 font-medium text-white">{b.name}</td>
                      <td className="py-3.5 px-2 text-right text-green-400">{formatPKR(b.revenue.today)}</td>
                      <td className="py-3.5 px-2 text-right text-blue-400">{formatPKR(b.revenue.week)}</td>
                      <td className="py-3.5 px-2 text-right text-amber-400">{formatPKR(b.revenue.month)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-primary-border">
                    <td className="py-3.5 px-2 font-bold text-white">Total</td>
                    <td className="py-3.5 px-2 text-right font-bold text-green-400">{formatPKR(totalToday)}</td>
                    <td className="py-3.5 px-2 text-right font-bold text-blue-400">{formatPKR(totalWeek)}</td>
                    <td className="py-3.5 px-2 text-right font-bold text-amber-400">{formatPKR(totalMonth)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Analytics Tab */}
      {tab === 'revenue' && (
        <RevenueAnalytics period={period} onPeriodChange={setPeriod} />
      )}

      {/* Loyalty Overview Tab */}
      {tab === 'loyalty' && <LoyaltyOverview />}

      {/* Staff Screen Tab */}
      {tab === 'staff' && <StaffScreen />}

      {/* Services Management Tab */}
      {tab === 'services' && <ServicesManagement />}

      {/* Staff Management Tab */}
      {tab === 'staff-mgmt' && <StaffManagement />}

      {/* Calendar Tab */}
      {tab === 'calendar' && <CalendarComponent view="owner" />}
    </div>
  );
}
