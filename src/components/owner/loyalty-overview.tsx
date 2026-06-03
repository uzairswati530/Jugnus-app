'use client';

import { Gift, Users, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { LOYALTY_STATS, RECENT_REDEMPTIONS, formatPKR } from '@/lib/constants';

export default function LoyaltyOverview() {
  const remainingRedeemable = LOYALTY_STATS.pointsIssued - LOYALTY_STATS.pointsRedeemed;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Gift size={24} className="text-[#C5A044]" />
        <h2 className="text-2xl font-bold text-gray-900">Loyalty Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Members', value: LOYALTY_STATS.totalMembers.toLocaleString(), icon: <Users size={18} />, color: 'text-blue-600' },
          { label: 'New This Month', value: `+${LOYALTY_STATS.newThisMonth}`, icon: <TrendingUp size={18} />, color: 'text-green-600' },
          { label: 'Points Issued', value: LOYALTY_STATS.pointsIssued.toLocaleString(), icon: <TrendingUp size={18} />, color: 'text-amber-600' },
          { label: 'Points Redeemed', value: LOYALTY_STATS.pointsRedeemed.toLocaleString(), icon: <TrendingDown size={18} />, color: 'text-red-600' },
          { label: 'Remaining', value: remainingRedeemable.toLocaleString(), icon: <Award size={18} />, color: 'text-purple-600' },
        ].map(m => (
          <div key={m.label} className="card p-4">
            <div className={`${m.color} opacity-80 mb-3`}>{m.icon}</div>
            <p className="text-sm text-gray-500 mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Tier Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(LOYALTY_STATS.tierBreakdown).map(([tier, count]) => {
            const tierColors: Record<string, { bg: string; text: string; bar: string }> = {
              Bronze: { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-500' },
              Silver: { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-400' },
              Gold: { bg: 'bg-yellow-50', text: 'text-yellow-600', bar: 'bg-yellow-500' },
            };
            const total = LOYALTY_STATS.totalMembers;
            const percentage = (count / total) * 100;
            const colors = tierColors[tier] || { bg: 'bg-gray-100', text: 'text-gray-400', bar: 'bg-gray-400' };

            return (
              <div key={tier}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${colors.text}`}>{tier}</span>
                  <span className="text-sm font-bold text-gray-900">{count} members ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${colors.bar}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Recent Redemptions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(197,160,68,0.2)]">
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Customer</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Branch</th>
                <th className="text-right py-3 px-2 text-gray-500 font-medium">Points Used</th>
                <th className="text-right py-3 px-2 text-gray-500 font-medium">Discount</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_REDEMPTIONS.map((r, i) => (
                <tr key={i} className={`border-b ${i < RECENT_REDEMPTIONS.length - 1 ? 'border-gray-100' : 'border-transparent'}`}>
                  <td className="py-3.5 px-2 font-medium text-gray-900">{r.customerName}</td>
                  <td className="py-3.5 px-2 text-gray-500">{r.branch}</td>
                  <td className="py-3.5 px-2 text-right text-amber-600 font-semibold">{r.pointsUsed.toLocaleString()}</td>
                  <td className="py-3.5 px-2 text-right text-green-600 font-semibold">{formatPKR(r.discountGiven)}</td>
                  <td className="py-3.5 px-2 text-gray-400">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
