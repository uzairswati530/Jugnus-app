'use client';

import { ChevronLeft, MapPin, Clock, Scissors, TrendingUp } from 'lucide-react';
import { BRANCHES, TODAY_APPOINTMENTS, WALKIN_QUEUE, BRANCH_SERVICES_TODAY, STYLISTS, formatPKR } from '@/lib/constants';

interface BranchDeepDiveProps {
  branchId: string;
  onBack: () => void;
}

export default function BranchDeepDive({ branchId, onBack }: BranchDeepDiveProps) {
  const branch = BRANCHES.find(b => b.id === branchId);
  if (!branch) return null;

  const topServices = BRANCH_SERVICES_TODAY(branchId);
  const branchAppointments = TODAY_APPOINTMENTS.filter((_, i) => i < 4);
  const branchQueue = WALKIN_QUEUE.slice(0, 2);

  const stylistCards = branch.stylists.map((s, i) => {
    const status = i % 2 === 0 ? 'With Client' : 'Available';
    const statusColor = status === 'With Client' ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-green-100 border-green-300 text-green-700';
    const stylistInfo = STYLISTS.find(st => st.name === s.name);
    return { ...s, status, statusColor, specialty: stylistInfo?.specialty ?? '' };
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={20} />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[rgba(197,160,68,0.1)] border border-[rgba(197,160,68,0.3)] flex items-center justify-center">
            <MapPin size={18} className="text-[#C5A044]" />
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900">{branch.name}</h2>
            <p className="text-xs md:text-sm text-gray-500">{branch.phone}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {[
          { label: 'Queue Active', value: branch.activeQueue, color: 'text-amber-600' },
          { label: 'Bookings Today', value: branch.todayBookings, color: 'text-blue-600' },
          { label: 'Revenue Today', value: formatPKR(branch.revenue.today), color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className={`text-xs font-medium mt-1 ${s.color}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-[#C5A044]" />
            Today&apos;s Appointments
          </h3>
          <div className="space-y-3">
            {branchAppointments.map(apt => (
              <div key={apt.id} className="card-2 p-3 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">{apt.customerName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{apt.service}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{apt.time}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded badge-${apt.status.toLowerCase().replace(' ', '')}`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 card p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#C5A044]" />
            Live Queue
          </h3>
          <div className="space-y-3">
            {branchQueue.map((w, i) => (
              <div key={w.id} className="card-2 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#C5A044] text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-gray-900">{w.customerName}</p>
                </div>
                <p className="text-xs text-gray-500">{w.service}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">~{w.estimatedWait} min</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded badge-${w.status.toLowerCase()}`}>
                    {w.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 card p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Scissors size={18} className="text-[#C5A044]" />
            Top Services Today
          </h3>
          <div className="space-y-3">
            {topServices.map((s, i) => (
              <div key={i} className="card-2 p-3 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.count} bookings</p>
                  </div>
                  <p className="text-sm font-bold text-green-600">{formatPKR(s.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Scissors size={18} className="text-[#C5A044]" />
          Stylists Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {stylistCards.map(s => (
            <div key={s.name} className={`card-2 p-4 rounded-lg text-center border ${s.statusColor.split(' ')[2]}`}>
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-lg ${s.statusColor.split(' ')[0]} ${s.statusColor.split(' ')[1]}`}>
                {s.name.charAt(0)}
              </div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{s.name}</p>
              <p className="text-xs text-gray-500 mt-1">{s.specialty}</p>
              <div className={`text-xs font-bold mt-2 ${s.statusColor.split(' ')[2]}`}>{s.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
