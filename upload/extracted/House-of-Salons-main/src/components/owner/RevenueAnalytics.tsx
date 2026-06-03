import { BarChart3, TrendingUp } from 'lucide-react';
import { BRANCHES, TOP_SERVICES_MONTH, HOURS_HEATMAP, formatPKR } from '../../data/constants';

interface RevenueAnalyticsProps {
  period: 'today' | 'week' | 'month';
  onPeriodChange: (p: 'today' | 'week' | 'month') => void;
}

export default function RevenueAnalytics({ period, onPeriodChange }: RevenueAnalyticsProps) {
  const revenuePeriods: Record<'today' | 'week' | 'month', 'today' | 'week' | 'month'> = { today: 'today', week: 'week', month: 'month' };

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 size={24} className="text-primary" />
        <h2 className="text-2xl font-bold text-white">Revenue Analytics</h2>
      </div>

      {/* Period Toggle */}
      <div className="flex gap-2 p-1 bg-surface rounded-lg border border-primary-border w-fit">
        {(['today', 'week', 'month'] as const).map(p => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize
              ${period === p ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {/* Branch Comparison Bar Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary" />
          Branch Revenue Comparison
        </h3>
        <div className="space-y-4">
          {branchRevenues.map(br => {
            const value = getPeriodValue(br);
            const percentage = (value / maxRevenue) * 100;
            return (
              <div key={br.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{br.name}</span>
                  <span className="text-sm font-bold text-primary">{formatPKR(value)}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-5">Top 5 Services This Month</h3>
          <div className="space-y-3">
            {TOP_SERVICES_MONTH.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 card-2 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-white">{i + 1}. {s.service}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.count} bookings</p>
                </div>
                <p className="text-sm font-bold text-green-400">{formatPKR(s.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-4">
          <div className="card p-6">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Busiest Day</h4>
            <p className="text-3xl font-bold text-white">Saturday</p>
            <p className="text-xs text-gray-500 mt-1">42% of weekly revenue</p>
          </div>
          <div className="card p-6">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Average Revenue/Day</h4>
            <p className="text-3xl font-bold text-green-400">{formatPKR(126800)}</p>
            <p className="text-xs text-gray-500 mt-1">Across all branches</p>
          </div>
        </div>
      </div>

      {/* Hours Heatmap */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-5">Busiest Hours Heatmap</h3>
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1.5">
          {hours.map((h, i) => {
            const intensity = (h.value / maxHourValue) * 100;
            const bgColor = intensity > 75 ? 'bg-primary' : intensity > 50 ? 'bg-orange-600' : intensity > 25 ? 'bg-amber-700' : 'bg-gray-800';
            return (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-full aspect-square rounded-lg ${bgColor} transition-all hover:opacity-80`} title={`${h.time}: ${h.value} clients`} />
                <span className="text-xs text-gray-500 mt-1 text-center leading-tight">{h.time.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-800" />
            Low
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-700" />
            Medium
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-600" />
            High
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary" />
            Peak
          </div>
        </div>
      </div>
    </div>
  );
}
