import React, { useState } from 'react';
import { Plus, X, Clock, CheckCircle, Users, Calendar, Scissors, Award, Search } from 'lucide-react';
import {
  TODAY_APPOINTMENTS,
  WALKIN_QUEUE,
  type Appointment,
  type AppointmentStatus,
  type WalkIn,
  type WalkInStatus,
} from '../data/constants';
import LoyaltyLookupModal from './LoyaltyLookupModal';
import PointsAwardPopup from './PointsAwardPopup';
import Toast from './Toast';

const STATUS_CYCLE: AppointmentStatus[] = ['Confirmed', 'In Progress', 'Done'];

const TIER_BADGES: Record<string, { bg: string; text: string }> = {
  Bronze: { bg: 'bg-amber-800/20', text: 'text-amber-600' },
  Silver: { bg: 'bg-gray-400/10', text: 'text-gray-300' },
  Gold: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
};

interface AppointmentWithLoyalty extends Appointment {
  tierBadge?: 'Bronze' | 'Silver' | 'Gold';
}

interface WalkInWithLoyalty extends WalkIn {
  tierBadge?: 'Bronze' | 'Silver' | 'Gold';
  loyaltyPhone?: string;
}

// Mock loyalty data
const LOYALTY_DATA: Record<string, { tier: 'Bronze' | 'Silver' | 'Gold'; points: number }> = {
  'Fatima Zaidi': { tier: 'Gold', points: 6500 },
  'Hina Khan': { tier: 'Gold', points: 5200 },
  'Sana Riaz': { tier: 'Silver', points: 2450 },
  'Zara Butt': { tier: 'Bronze', points: 750 },
};

function StatusBadge({ status }: { status: AppointmentStatus | WalkInStatus }) {
  const classes: Record<string, string> = {
    Confirmed: 'badge-confirmed',
    'In Progress': 'badge-inprogress',
    Done: 'badge-done',
    Waiting: 'badge-waiting',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${classes[status] ?? 'badge-waiting'}`}>
      {status}
    </span>
  );
}

function TierBadge({ tier }: { tier: 'Bronze' | 'Silver' | 'Gold' }) {
  const colors = TIER_BADGES[tier];
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} border-opacity-40`}>
      {tier}
    </span>
  );
}

interface WalkInModalProps {
  onClose: () => void;
  onAdd: (entry: Omit<WalkInWithLoyalty, 'id' | 'estimatedWait' | 'status'>) => void;
}

function WalkInModal({ onClose, onAdd }: WalkInModalProps) {
  const [form, setForm] = useState({ customerName: '', phone: '', service: '', stylist: '', loyaltyMember: false, loyaltyPhone: '', redeemPoints: false });
  const [loyaltyFound, setLoyaltyFound] = useState<{ tier: 'Bronze' | 'Silver' | 'Gold'; points: number; name: string } | null>(null);

  const services = [
    'Haircut', 'Beard Trim', 'Haircut + Beard', 'Haircut with Blow Dry',
    'Wash & Blow Dry', 'Party Makeup', 'Acrylic Nails', 'Facial (Basic)',
    'Facial', 'Hair Color', 'Hair Color (Global)', 'Head Massage',
  ];
  const stylists = ['Ayesha Khan', 'Sara Ahmed', 'Nadia Malik', 'Usman Ali', 'Bilal Sheikh'];

  const handleLoyaltyLookup = () => {
    const mockCustomers: Record<string, { tier: 'Bronze' | 'Silver' | 'Gold'; points: number; name: string }> = {
      '03001234567': { tier: 'Gold', points: 6500, name: 'Fatima Zaidi' },
      '03119876543': { tier: 'Silver', points: 2450, name: 'Sana Riaz' },
      '03331122334': { tier: 'Bronze', points: 750, name: 'Zara Butt' },
      '03455566778': { tier: 'Gold', points: 5200, name: 'Hina Khan' },
    };
    const normalized = form.loyaltyPhone.replace(/\D/g, '').slice(-10);
    if (mockCustomers[normalized]) {
      setLoyaltyFound(mockCustomers[normalized]);
      setForm(f => ({ ...f, customerName: mockCustomers[normalized].name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.service || !form.stylist) return;
    onAdd({
      customerName: form.customerName,
      phone: form.phone,
      service: form.service,
      stylist: form.stylist,
      tierBadge: loyaltyFound?.tier,
      loyaltyPhone: loyaltyFound ? form.loyaltyPhone : undefined,
    });
    onClose();
  };

  const discountPrice = form.redeemPoints && loyaltyFound && loyaltyFound.points >= 500 ? 500 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="card w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Add Walk-in</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loyalty Member */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.loyaltyMember}
                onChange={e => setForm(f => ({ ...f, loyaltyMember: e.target.checked, loyaltyFound: null, loyaltyPhone: '' }))}
                className="w-4 h-4 rounded bg-surface border border-primary-border cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-300">Loyalty Member?</span>
            </label>
          </div>

          {/* Loyalty Lookup */}
          {form.loyaltyMember && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Enter Phone to Load Profile</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  className="input-dark flex-1 px-4 py-2.5"
                  placeholder="0300-0000000"
                  value={form.loyaltyPhone}
                  onChange={e => setForm(f => ({ ...f, loyaltyPhone: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={handleLoyaltyLookup}
                  className="btn-ghost px-4 py-2.5 flex items-center gap-2"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Loyalty Profile Display */}
          {loyaltyFound && (
            <div className="card-2 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{loyaltyFound.name}</p>
                <TierBadge tier={loyaltyFound.tier} />
              </div>
              <p className="text-xs text-gray-500">{loyaltyFound.points.toLocaleString()} points available</p>
              {loyaltyFound.points >= 500 && (
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.redeemPoints}
                    onChange={e => setForm(f => ({ ...f, redeemPoints: e.target.checked }))}
                    className="w-3 h-3 rounded bg-surface border border-primary-border cursor-pointer"
                  />
                  <span className="text-xs font-medium text-green-400">Redeem Points (Rs 500 off)</span>
                </label>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Customer Name</label>
            <input
              type="text"
              className="input-dark w-full px-4 py-2.5"
              placeholder="Full name"
              value={form.customerName}
              onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
            <input
              type="tel"
              className="input-dark w-full px-4 py-2.5"
              placeholder="0300-0000000"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Service</label>
            <select
              className="input-dark w-full px-4 py-2.5"
              value={form.service}
              onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
              required
            >
              <option value="">Select service</option>
              {services.map(s => <option key={s} value={s}>{discountPrice && s === form.service ? `${s} (Rs 500 off)` : s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Stylist</label>
            <select
              className="input-dark w-full px-4 py-2.5"
              value={form.stylist}
              onChange={e => setForm(f => ({ ...f, stylist: e.target.value }))}
              required
            >
              <option value="">Select stylist</option>
              {stylists.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2.5 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">
              Add to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReceptionistView() {
  const [appointments, setAppointments] = useState<AppointmentWithLoyalty[]>(TODAY_APPOINTMENTS.map(a => ({
    ...a,
    tierBadge: LOYALTY_DATA[a.customerName]?.tier,
  })));
  const [queue, setQueue] = useState<WalkInWithLoyalty[]>(WALKIN_QUEUE);
  const [showModal, setShowModal] = useState(false);
  const [showLoyaltyLookup, setShowLoyaltyLookup] = useState(false);
  const [pointsAward, setPointsAward] = useState<{ appointmentId: string; customerName: string; serviceName: string; servicePrice: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cycleStatus = (id: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id !== id) return a;
      const idx = STATUS_CYCLE.indexOf(a.status);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      if (next === 'Done') {
        const appointment = prev.find(ap => ap.id === id);
        if (appointment?.tierBadge) {
          const servicePrice = appointment.service === 'Bridal Makeup' ? 40000 :
                               appointment.service === 'Party Makeup' ? 8000 : 2000;
          setPointsAward({ appointmentId: id, customerName: appointment.customerName, serviceName: appointment.service, servicePrice });
        }
      }
      return { ...a, status: next };
    }));
  };

  const handleAwardPoints = () => {
    if (pointsAward) {
      setToastMessage(`✓ ${pointsAward.servicePrice.toLocaleString()} points added to ${pointsAward.customerName}'s account`);
      setPointsAward(null);
    }
  };

  const cycleQueueStatus = (id: string) => {
    const cycle: WalkInStatus[] = ['Waiting', 'In Progress', 'Done'];
    setQueue(prev => prev.map(w => {
      if (w.id !== id) return w;
      const idx = cycle.indexOf(w.status);
      const next = cycle[(idx + 1) % cycle.length];
      if (next === 'Done' && w.tierBadge) {
        const servicePrice = w.service === 'Haircut' ? 1200 : w.service === 'Haircut + Beard' ? 1700 : 600;
        setPointsAward({ appointmentId: id, customerName: w.customerName, serviceName: w.service, servicePrice });
      }
      return { ...w, status: next };
    }));
  };

  const markDone = (id: string) => {
    setQueue(prev => prev.map(w => w.id === id ? { ...w, status: 'Done' } : w));
  };

  const addWalkIn = (entry: Omit<WalkInWithLoyalty, 'id' | 'estimatedWait' | 'status'>) => {
    const waitingCount = queue.filter(w => w.status === 'Waiting').length;
    const newEntry: WalkInWithLoyalty = {
      ...entry,
      id: `w${Date.now()}`,
      estimatedWait: (waitingCount + 1) * 20,
      status: 'Waiting',
    };
    setQueue(prev => [...prev, newEntry]);
  };

  const totalBookings = appointments.length;
  const totalWalkIns = queue.length;
  const inChair = appointments.filter(a => a.status === 'In Progress').length + queue.filter(w => w.status === 'In Progress').length;
  const completed = appointments.filter(a => a.status === 'Done').length + queue.filter(w => w.status === 'Done').length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {showLoyaltyLookup && <LoyaltyLookupModal onClose={() => setShowLoyaltyLookup(false)} />}
      {pointsAward && (
        <PointsAwardPopup
          customerName={pointsAward.customerName}
          serviceName={pointsAward.serviceName}
          servicePrice={pointsAward.servicePrice}
          onConfirm={handleAwardPoints}
          onSkip={() => setPointsAward(null)}
        />
      )}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      {showModal && <WalkInModal onClose={() => setShowModal(false)} onAdd={addWalkIn} />}

      {/* Header with Loyalty Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Receptionist Dashboard</h2>
        <button
          onClick={() => setShowLoyaltyLookup(true)}
          className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-sm"
        >
          <Award size={16} />
          Loyalty Lookup
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Calendar size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-white">Today's Appointments</h2>
            <span className="ml-auto text-xs font-medium bg-primary-dim text-primary border border-primary-border px-2 py-0.5 rounded-full">
              {appointments.length}
            </span>
          </div>
          <div className="space-y-3">
            {appointments.map(apt => (
              <div key={apt.id} className="card-2 p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{apt.customerName}</p>
                      {apt.tierBadge && <TierBadge tier={apt.tierBadge} />}
                    </div>
                    <p className="text-sm text-gray-400">{apt.service}</p>
                  </div>
                  <button
                    onClick={() => cycleStatus(apt.id)}
                    className="cursor-pointer"
                    title="Click to update status"
                  >
                    <StatusBadge status={apt.status} />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={12} />{apt.time}</span>
                  <span className="flex items-center gap-1"><Scissors size={12} />{apt.stylist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Users size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-white">Walk-in Queue</h2>
            <span className="ml-auto text-xs font-medium bg-primary-dim text-primary border border-primary-border px-2 py-0.5 rounded-full">
              {queue.filter(w => w.status !== 'Done').length} active
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 mb-5 text-sm"
          >
            <Plus size={16} />
            Add Walk-in
          </button>
          <div className="space-y-3">
            {queue.map((w, i) => (
              <div key={w.id} className={`card-2 p-4 flex flex-col gap-2 ${w.status === 'Done' ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-primary-dim border border-primary-border text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{w.customerName}</p>
                        {w.tierBadge && <TierBadge tier={w.tierBadge} />}
                      </div>
                      <p className="text-sm text-gray-400">{w.service}</p>
                    </div>
                  </div>
                  <button onClick={() => cycleQueueStatus(w.id)} className="cursor-pointer shrink-0">
                    <StatusBadge status={w.status} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Scissors size={12} />{w.stylist}</span>
                    {w.status !== 'Done' && (
                      <span className="flex items-center gap-1"><Clock size={12} />~{w.estimatedWait} min wait</span>
                    )}
                  </div>
                  {w.status !== 'Done' && (
                    <button
                      onClick={() => markDone(w.id)}
                      className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                    >
                      <CheckCircle size={14} />
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: totalBookings, icon: <Calendar size={20} />, color: 'text-blue-400' },
          { label: 'Total Walk-ins', value: totalWalkIns, icon: <Users size={20} />, color: 'text-amber-400' },
          { label: 'Currently In Chair', value: inChair, icon: <Scissors size={20} />, color: 'text-primary' },
          { label: 'Completed Today', value: completed, icon: <CheckCircle size={20} />, color: 'text-green-400' },
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
    </div>
  );
}
