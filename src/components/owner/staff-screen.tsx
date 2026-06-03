'use client';

import { Users } from 'lucide-react';
import { ALL_STYLISTS_STATUS, formatPKR } from '@/lib/constants';

export default function StaffScreen() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'With Client':
        return 'bg-amber-100 border-amber-300 text-amber-700';
      case 'Available':
        return 'bg-green-100 border-green-300 text-green-700';
      case 'Off Today':
        return 'bg-gray-100 border-gray-300 text-gray-500';
      default:
        return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Users size={24} className="text-[#C5A044]" />
        <h2 className="text-2xl font-bold text-gray-900">Staff Directory</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Stylists', value: ALL_STYLISTS_STATUS.length, color: 'text-blue-600' },
          { label: 'Active Today', value: ALL_STYLISTS_STATUS.filter(s => s.status !== 'Off Today').length, color: 'text-green-600' },
          { label: 'Total Revenue Today', value: formatPKR(ALL_STYLISTS_STATUS.reduce((s, st) => s + st.revenueToday, 0)), color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="card p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(197,160,68,0.2)]">
              <th className="text-left py-3 px-3 text-gray-500 font-medium">Name</th>
              <th className="text-left py-3 px-3 text-gray-500 font-medium">Specialty</th>
              <th className="text-left py-3 px-3 text-gray-500 font-medium">Branches</th>
              <th className="text-center py-3 px-3 text-gray-500 font-medium">Bookings Today</th>
              <th className="text-right py-3 px-3 text-gray-500 font-medium">Revenue</th>
              <th className="text-center py-3 px-3 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ALL_STYLISTS_STATUS.map((stylist, i) => (
              <tr key={stylist.id} className={`border-b ${i < ALL_STYLISTS_STATUS.length - 1 ? 'border-gray-100' : 'border-transparent'}`}>
                <td className="py-4 px-3 font-medium text-gray-900">{stylist.name}</td>
                <td className="py-4 px-3 text-gray-500">{stylist.specialty}</td>
                <td className="py-4 px-3 text-gray-500 text-xs">{stylist.branch}</td>
                <td className="py-4 px-3 text-center font-semibold text-gray-900">{stylist.bookingsToday}</td>
                <td className="py-4 px-3 text-right font-semibold text-green-600">{formatPKR(stylist.revenueToday)}</td>
                <td className="py-4 px-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(stylist.status)}`}>
                    {stylist.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top by Revenue Today</h3>
          <div className="space-y-3">
            {ALL_STYLISTS_STATUS
              .sort((a, b) => b.revenueToday - a.revenueToday)
              .slice(0, 5)
              .map((s, i) => (
                <div key={s.id} className="flex items-center justify-between p-3 card-2 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#C5A044] w-6">{i + 1}.</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.bookingsToday} bookings</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-green-600">{formatPKR(s.revenueToday)}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top by Bookings Today</h3>
          <div className="space-y-3">
            {ALL_STYLISTS_STATUS
              .sort((a, b) => b.bookingsToday - a.bookingsToday)
              .slice(0, 5)
              .map((s, i) => (
                <div key={s.id} className="flex items-center justify-between p-3 card-2 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#C5A044] w-6">{i + 1}.</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.specialty}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-amber-600">{s.bookingsToday}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
