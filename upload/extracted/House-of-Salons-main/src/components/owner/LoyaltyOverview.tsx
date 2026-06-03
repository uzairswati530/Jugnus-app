import { Gift, Users, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { LOYALTY_STATS, RECENT_REDEMPTIONS, formatPKR } from '../../data/constants';

export default function LoyaltyOverview() {
  const remainingRedeemable = LOYALTY_STATS.pointsIssued - LOYALTY_STATS.pointsRedeemed;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Gift size={24} className="text-primary" />
        <h2 className="text-2xl font-bold text-white">Loyalty Overview</h2>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Members', value: LOYALTY_STATS.totalMembers.toLocaleString(), icon: <Users size={18} />, color: 'text-blue-400' },
          { label: 'New This Month', value: `+${LOYALTY_STATS.newThisMonth}`, icon: <TrendingUp size={18} />, color: 'text-green-400' },
          { label: 'Points Issued', value: LOYALTY_STATS.pointsIssued.toLocaleString(), icon: <TrendingUp size={18} />, color: 'text-amber-400' },
          { label: 'Points Redeemed', value: LOYALTY_STATS.pointsRedeemed.toLocaleString(), icon: <TrendingDown size={18} />, color: 'text-red-400' },
          { label: 'Remaining', value: remainingRedeemable.toLocaleString(), icon: <Award size={18} />, color: 'text-purple-400' },
        ].map(m => (
          <div key={m.label} className="card p-4">
            <div className={`${m.color} opacity-80 mb-3`}>{m.icon}</div>
            <p className="text-sm text-gray-500 mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-white">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Tier Breakdown */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-5">Tier Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(LOYALTY_STATS.tierBreakdown).map(([tier, count], i) => {
            const tierColors: Record<string, { bg: string; text: string }> = {
              Bronze: { bg: 'bg-amber-800/20', text: 'text-amber-600' },
              Silver: { bg: 'bg-gray-400/10', text: 'text-gray-300' },
              Gold: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
            };
            const total = LOYALTY_STATS.totalMembers;
            const percentage = (count / total) * 100;
            const colors = tierColors[tier] || { bg: 'bg-gray-800/20', text: 'text-gray-400' };

            return (
              <div key={tier}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${colors.text}`}>{tier}</span>
                  <span className="text-sm font-bold text-white">{count} members ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${colors.bg}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Redemptions */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-5">Recent Redemptions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary-border">
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Customer</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Branch</th>
                <th className="text-right py-3 px-2 text-gray-400 font-medium">Points Used</th>
                <th className="text-right py-3 px-2 text-gray-400 font-medium">Discount</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_REDEMPTIONS.map((r, i) => (
                <tr key={i} className={`border-b ${i < RECENT_REDEMPTIONS.length - 1 ? 'border-white/5' : 'border-transparent'}`}>
                  <td className="py-3.5 px-2 font-medium text-white">{r.customerName}</td>
                  <td className="py-3.5 px-2 text-gray-400">{r.branch}</td>
                  <td className="py-3.5 px-2 text-right text-amber-400 font-semibold">{r.pointsUsed.toLocaleString()}</td>
                  <td className="py-3.5 px-2 text-right text-green-400 font-semibold">{formatPKR(r.discountGiven)}</td>
                  <td className="py-3.5 px-2 text-gray-500">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
