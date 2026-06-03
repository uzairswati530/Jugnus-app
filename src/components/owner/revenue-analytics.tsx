'use client';

import { BarChart3, TrendingUp } from 'lucide-react';
import { BRANCHES, TOP_SERVICES_MONTH, HOURS_HEATMAP, formatPKR } from '@/lib/constants';

interface RevenueAnalyticsProps {
  period: 'today' | 'week' | 'month';
  onPeriodChange: (p: 'today' | 'week' | 'month') => void;
}

export default function RevenueAnalytics({ period, onPeriodChange }: RevenueAnalyticsProps) {
  const branchRevenues = BRANCHES.map(b => ({
    name: b.name.split(',')[0],
    today: b.revenue.today,
    week: b.revenue.week,
    month: b.revenue.month,
  }));

  const getPeriodValue = (br: typeof branchRevenues[0]) => br[period];
  const maxRevenue = Math.max(...branchRevenues.map(getPeriodValue));

  const hours = Object.entries(HOURS_HEATMAP).map(([time, value]) => ({ time, value }));
  const maxHourValue = Math.max(...hours.map(h => h.value));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 size={20} className="text-[#C5A044]" />
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Revenue Analytics</h2>
      </div>

      <div className="flex gap-2 p-1 bg-[#FAFAFA] rounded-lg border border-[rgba(197,160,68,0.3)] w-fit">
        {(['today', 'week', 'month'] as const).map(p => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize
              ${period === p ? 'bg-[#C5A044] text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-[#C5A044]" />
          Branch Revenue Comparison
        </h3>
        <div className="space-y-4">
          {branchRevenues.map(br => {
            const value = getPeriodValue(br);
            const percentage = (value / maxRevenue) * 100;
            return (
              <div key={br.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{br.name}</span>
                  <span className="text-sm font-bold text-[#C5A044]">{formatPKR(value)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C5A044] rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Top 5 Services This Month</h3>
          <div className="space-y-3">
            {TOP_SERVICES_MONTH.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 card-2 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{i + 1}. {s.service}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.count} bookings</p>
                </div>
                <p className="text-sm font-bold text-green-600">{formatPKR(s.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Busiest Day</h4>
            <p className="text-3xl font-bold text-gray-900">Saturday</p>
            <p className="text-xs text-gray-500 mt-1">42% of weekly revenue</p>
          </div>
          <div className="card p-6">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Average Revenue/Day</h4>
            <p className="text-3xl font-bold text-green-600">{formatPKR(126800)}</p>
            <p className="text-xs text-gray-500 mt-1">Across all branches</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Busiest Hours Heatmap</h3>
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1.5">
          {hours.map((h, i) => {
            const intensity = (h.value / maxHourValue) * 100;
            const bgColor = intensity > 75 ? 'bg-[#C5A044]' : intensity > 50 ? 'bg-[#D4AF37]' : intensity > 25 ? 'bg-[#E8D5A0]' : 'bg-gray-200';
            return (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-full aspect-square rounded-lg ${bgColor} transition-all hover:opacity-80`} title={`${h.time}: ${h.value} clients`} />
                <span className="text-xs text-gray-400 mt-1 text-center leading-tight">{h.time.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-200" />
            Low
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#E8D5A0]" />
            Medium
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#D4AF37]" />
            High
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#C5A044]" />
            Peak
          </div>
        </div>
      </div>
    </div>
  );
}
