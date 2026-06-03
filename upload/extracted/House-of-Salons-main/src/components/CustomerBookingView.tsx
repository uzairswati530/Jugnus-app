import { useState } from 'react';
import { Check, ChevronRight, MapPin, Clock, Star, Phone, User, MessageSquare, Gift, Award, Share2, Tag } from 'lucide-react';
import {
  BRANCHES,
  FEMALE_SERVICES,
  MALE_SERVICES,
  STYLISTS,
  LOYALTY_HISTORY,
  formatPKR,
  generateTimeSlots,
  generateRedemptionCode,
  type Service,
  type Stylist,
} from '../data/constants';
import RedeemPoints from './RedeemPoints';
import RedemptionHistory from './RedemptionHistory';
import PointsNotification from './PointsNotification';

type BookingStep = 1 | 2 | 3 | 4;
type CustomerTab = 'booking' | 'loyalty';

interface BookingState {
  branch: typeof BRANCHES[0] | null;
  service: Service | null;
  stylist: Stylist | null;
  slot: string;
  name: string;
  phone: string;
  redemptionCode: string;
}

const INITIAL_BOOKING: BookingState = {
  branch: null,
  service: null,
  stylist: null,
  slot: '',
  name: '',
  phone: '',
  redemptionCode: '',
};

const STEP_LABELS = ['Branch', 'Service', 'Stylist & Time', 'Your Details'];

interface PointsEarned {
  amount: number;
  tier: string;
  pointsNeeded: number;
  totalTierRequirement: number;
}

function ProgressBar({ step }: { step: BookingStep }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEP_LABELS.map((label, i) => {
        const num = (i + 1) as BookingStep;
        const done = step > num;
        const active = step === num;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${done ? 'step-done' : active ? 'step-active' : 'step-pending'}`}>
                {done ? <Check size={14} /> : num}
              </div>
              <span className={`text-xs mt-1.5 text-center leading-tight hidden md:block
                ${active ? 'text-white font-medium' : done ? 'text-green-400' : 'text-gray-600'}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 rounded ${step > num ? 'bg-green-500' : step === num ? 'bg-primary' : 'bg-gray-800'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1Branch({ booking, onSelect }: { booking: BookingState; onSelect: (b: typeof BRANCHES[0]) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Choose a Branch</h2>
      <p className="text-gray-500 text-sm mb-6">Select the House of Salons location you'd like to visit.</p>
      <div className="space-y-3">
        {BRANCHES.map(branch => (
          <button
            key={branch.id}
            onClick={() => onSelect(branch)}
            className={`w-full text-left card-2 p-5 rounded-xl flex items-center justify-between transition-all
              ${booking.branch?.id === branch.id ? 'border-primary bg-primary-dim' : 'hover:border-primary/50'}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-dim border border-primary-border flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-white">{branch.name}</p>
                <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5">
                  <Phone size={12} />{branch.phone}
                </p>
                <p className="text-xs text-gray-600 mt-1">{branch.todayBookings} bookings today · {branch.activeQueue} in queue</p>
              </div>
            </div>
            <ChevronRight size={18} className={booking.branch?.id === branch.id ? 'text-primary' : 'text-gray-600'} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2Service({ booking, onSelect }: { booking: BookingState; onSelect: (s: Service) => void }) {
  const isMale = booking.branch?.id === 'bahria-male';
  const services = isMale ? MALE_SERVICES : FEMALE_SERVICES;
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Select a Service</h2>
      <p className="text-gray-500 text-sm mb-6">
        Showing {isMale ? 'male' : 'female'} services for <span className="text-white">{booking.branch?.name}</span>
      </p>
      <div className="space-y-2.5">
        {services.map(service => (
          <button
            key={service.name}
            onClick={() => onSelect(service)}
            className={`w-full text-left card-2 p-4 rounded-xl flex items-center justify-between transition-all
              ${booking.service?.name === service.name ? 'border-primary bg-primary-dim' : 'hover:border-primary/50'}`}
          >
            <div>
              <p className="font-semibold text-white">{service.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} />{service.duration} min</span>
                <span className="text-sm font-bold text-primary">{formatPKR(service.price)}</span>
              </div>
            </div>
            {booking.service?.name === service.name && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Check size={12} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3Stylist({ booking, onSelectStylist, onSelectSlot }:
  { booking: BookingState; onSelectStylist: (s: Stylist) => void; onSelectSlot: (t: string) => void }) {
  const slots = generateTimeSlots();
  const branchStylists = STYLISTS.filter(s => booking.branch && s.branches.includes(booking.branch.id));

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Choose Stylist & Time</h2>
      <p className="text-gray-500 text-sm mb-6">Select your preferred stylist and an available time slot.</p>

      <div className="space-y-4 mb-6">
        {branchStylists.map(stylist => (
          <div
            key={stylist.id}
            className={`card-2 p-4 rounded-xl transition-all cursor-pointer
              ${booking.stylist?.id === stylist.id ? 'border-primary' : 'hover:border-primary/50'}`}
            onClick={() => onSelectStylist(stylist)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary-dim border border-primary-border flex items-center justify-center shrink-0">
                <User size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{stylist.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><Star size={10} className="text-amber-400" />{stylist.specialty}</p>
              </div>
              {booking.stylist?.id === stylist.id && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check size={10} />
                </div>
              )}
            </div>
            {booking.stylist?.id === stylist.id && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Available time slots:</p>
                <div className="flex flex-wrap gap-1.5">
                  {slots.map(slot => {
                    const isBooked = stylist.bookedSlots.some(b => slot.startsWith(b));
                    const isSelected = booking.slot === slot;
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={e => { e.stopPropagation(); onSelectSlot(slot); }}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all
                          ${isBooked ? 'slot-booked' : isSelected ? 'slot-selected' : 'slot-available'}`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4Details({ booking, onChange, onConfirm, onWhatsApp, appliedDiscount }:
  {
    booking: BookingState;
    onChange: (field: 'name' | 'phone' | 'redemptionCode', val: string) => void;
    onConfirm: () => void;
    onWhatsApp: () => void;
    appliedDiscount: number;
  }) {
  const isValid = booking.name.trim().length > 1 && booking.phone.trim().length > 9;
  const totalPrice = booking.service?.price ?? 0;
  const finalPrice = Math.max(0, totalPrice - appliedDiscount);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Your Details</h2>
      <p className="text-gray-500 text-sm mb-6">Review your booking and confirm.</p>

      <div className="card-2 p-4 rounded-xl mb-6 space-y-2.5">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">Booking Summary</p>
        {[
          { label: 'Branch', value: booking.branch?.name },
          { label: 'Service', value: booking.service?.name },
          { label: 'Duration', value: booking.service ? `${booking.service.duration} minutes` : '' },
          { label: 'Stylist', value: booking.stylist?.name },
          { label: 'Time Slot', value: booking.slot || 'Not selected' },
          { label: 'Price', value: formatPKR(totalPrice), highlight: true },
          ...(appliedDiscount > 0 ? [
            { label: 'Discount Applied', value: `- ${formatPKR(appliedDiscount)}`, highlight: true, color: 'text-green-400' },
            { label: 'Final Amount', value: formatPKR(finalPrice), highlight: true, color: 'text-primary' }
          ] : [])
        ].map(item => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-gray-500">{item.label}</span>
            <span className={`font-medium text-right ${item.color || 'text-white'}`}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Name</label>
          <input
            type="text"
            className="input-dark w-full px-4 py-3"
            placeholder="Enter your full name"
            value={booking.name}
            onChange={e => onChange('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
          <input
            type="tel"
            className="input-dark w-full px-4 py-3"
            placeholder="0300-0000000"
            value={booking.phone}
            onChange={e => onChange('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Redemption Code (Optional)</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="input-dark flex-1 px-4 py-3 uppercase"
              placeholder="HOS-XXXXXX"
              value={booking.redemptionCode}
              onChange={e => onChange('redemptionCode', e.target.value.toUpperCase())}
              maxLength={10}
            />
            {appliedDiscount > 0 && (
              <div className="flex items-center gap-2 px-3 py-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Check size={18} className="text-green-400" />
                <span className="text-sm font-semibold text-green-400">{formatPKR(appliedDiscount)}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">Have a redemption code? Enter it here to apply discount</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onConfirm}
          disabled={!isValid}
          className={`btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold
            ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Check size={16} />
          Confirm Booking
        </button>
        <button
          onClick={onWhatsApp}
          disabled={!isValid}
          className={`btn-ghost flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold
            ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <MessageSquare size={16} />
          Book via WhatsApp
        </button>
      </div>
    </div>
  );
}

function BookingConfirmed({ booking, onReset, pointsEarned, currentPoints }: { booking: BookingState; onReset: () => void; pointsEarned: PointsEarned | null; currentPoints: number }) {
  const totalPoints = LOYALTY_HISTORY.reduce((s, h) => s + h.points, 0) + (booking.service?.price ?? 0);
  const tier = totalPoints >= 5000 ? 'Gold' : totalPoints >= 1000 ? 'Silver' : 'Bronze';
  const tierColors: Record<string, string> = {
    Bronze: 'text-amber-600',
    Silver: 'text-gray-300',
    Gold: 'text-yellow-400',
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto">
        <Check size={36} className="text-green-400" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
        <p className="text-gray-400 mt-2">Your appointment has been successfully scheduled.</p>
      </div>
      <div className="card-2 p-5 rounded-xl text-left space-y-3">
        {[
          { label: 'Name', value: booking.name },
          { label: 'Phone', value: booking.phone },
          { label: 'Branch', value: booking.branch?.name },
          { label: 'Service', value: booking.service?.name },
          { label: 'Stylist', value: booking.stylist?.name },
          { label: 'Time', value: booking.slot },
          { label: 'Amount', value: booking.service ? formatPKR(booking.service.price) : '' },
        ].map(item => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-gray-500">{item.label}</span>
            <span className="text-white font-medium">{item.value}</span>
          </div>
        ))}
      </div>

      {pointsEarned && (
        <div className="card p-5 rounded-xl text-left">
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-primary" />
            <p className="font-semibold text-white text-sm">Loyalty Points Earned</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-primary">+{pointsEarned.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">Points added to your balance</p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${tierColors[pointsEarned.tier]}`}>{pointsEarned.tier}</p>
              <p className="text-xs text-gray-500">Current tier</p>
            </div>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${((pointsEarned.totalTierRequirement - pointsEarned.pointsNeeded) / pointsEarned.totalTierRequirement) * 100}%` }} />
          </div>
          <p className="text-xs text-gray-600 mt-2">{pointsEarned.pointsNeeded.toLocaleString()} points to next tier</p>
        </div>
      )}

      <button onClick={onReset} className="btn-ghost w-full py-2.5 text-sm">
        Book Another Appointment
      </button>
    </div>
  );
}

function LoyaltySection({ loyaltyBalance }: { loyaltyBalance: number }) {
  const totalPoints = LOYALTY_HISTORY.reduce((s, h) => s + h.points, 0) + loyaltyBalance;
  const tier = totalPoints >= 5000 ? 'Gold' : totalPoints >= 1000 ? 'Silver' : 'Bronze';
  const tierColors: Record<string, { bg: string; text: string; border: string }> = {
    Bronze: { bg: 'bg-amber-800/20', text: 'text-amber-600', border: 'border-amber-800/40' },
    Silver: { bg: 'bg-gray-400/10', text: 'text-gray-300', border: 'border-gray-400/30' },
    Gold: { bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/30' },
  };
  const tc = tierColors[tier];

  const [generatedCodes, setGeneratedCodes] = useState<Array<{ code: string; pointsUsed: number; discountAmount: number; date: string }>>([]);

  return (
    <div className="space-y-5">
      <div className="card p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white flex items-center gap-2"><Gift size={16} className="text-primary" />Your Loyalty Points</h3>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>{tier}</span>
        </div>
        <p className="text-4xl font-bold text-white">{totalPoints.toLocaleString()}<span className="text-lg font-normal text-gray-500 ml-2">pts</span></p>
        <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((totalPoints / 5000) * 100, 100)}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          {tier === 'Gold' ? 'Maximum tier reached!' : `${(5000 - totalPoints).toLocaleString()} pts to Gold`}
        </p>
        <div className="mt-4 text-xs text-gray-500 space-y-0.5">
          <p>Bronze: 0 – 999 pts · Silver: 1,000 – 4,999 pts · Gold: 5,000+ pts</p>
          <p>Earn 1 point for every Rs 1 spent.</p>
        </div>
      </div>

      <RedeemPoints
        pointsBalance={totalPoints}
        onRedeem={(code, pointsUsed, discountAmount) => {
          setGeneratedCodes(prev => [...prev, {
            code,
            pointsUsed,
            discountAmount,
            date: new Date().toLocaleDateString('en-PK'),
          }]);
        }}
      />

      {generatedCodes.length > 0 && (
        <RedemptionHistory
          redemptions={generatedCodes.map((c, i) => ({
            date: c.date,
            code: c.code,
            pointsUsed: c.pointsUsed,
            discountReceived: c.discountAmount,
            branch: 'F10 Markaz',
          }))}
        />
      )}

      <div className="card p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm">Visit History</h3>
          <button className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
            <Share2 size={12} />
            Share Referral
          </button>
        </div>
        <div className="space-y-3">
          {LOYALTY_HISTORY.map((h, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div>
                <p className="text-white font-medium">{h.service}</p>
                <p className="text-xs text-gray-500">{h.date}</p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-semibold">+{h.points.toLocaleString()} pts</p>
                <p className="text-xs text-gray-500">{formatPKR(h.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CustomerBookingView() {
  const [tab, setTab] = useState<CustomerTab>('booking');
  const [step, setStep] = useState<BookingStep>(1);
  const [booking, setBooking] = useState<BookingState>(INITIAL_BOOKING);
  const [confirmed, setConfirmed] = useState(false);
  const [pointsNotification, setPointsNotification] = useState<PointsEarned | null>(null);
  const [loyaltyBalance, setLoyaltyBalance] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const canNext = () => {
    if (step === 1) return !!booking.branch;
    if (step === 2) return !!booking.service;
    if (step === 3) return !!booking.stylist && !!booking.slot;
    return false;
  };

  const goNext = () => { if (canNext()) setStep(s => (s + 1) as BookingStep); };
  const goBack = () => setStep(s => Math.max(1, s - 1) as BookingStep);

  const validateRedemptionCode = (code: string) => {
    // Check if code format is valid (HOS-XXXXXX)
    if (!/^HOS-\d{6}$/.test(code)) return 0;
    // For demo: all valid codes give Rs 500 discount
    return 500;
  };

  const handleRedemptionCodeChange = (code: string) => {
    setBooking(prev => ({ ...prev, redemptionCode: code }));
    const discount = validateRedemptionCode(code);
    setAppliedDiscount(discount);
  };

  const handleWhatsApp = () => {
    const lines = [
      `*New Booking — House of Salons*`,
      `Name: ${booking.name}`,
      `Phone: ${booking.phone}`,
      `Branch: ${booking.branch?.name}`,
      `Service: ${booking.service?.name}`,
      `Price: ${booking.service ? formatPKR(booking.service.price) : ''}`,
      `Stylist: ${booking.stylist?.name}`,
      `Time: ${booking.slot}`,
      ...(booking.redemptionCode ? [`Redemption Code: ${booking.redemptionCode}`] : []),
    ];
    window.open(`https://wa.me/923001655518?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  };

  const handleConfirm = () => {
    const servicePrice = booking.service?.price ?? 0;
    const pointsEarned = servicePrice;
    const currentBalance = loyaltyBalance + pointsEarned;
    const newTier = currentBalance >= 5000 ? 'Gold' : currentBalance >= 1000 ? 'Silver' : 'Bronze';
    const nextTierThreshold = newTier === 'Bronze' ? 1000 : newTier === 'Silver' ? 5000 : 10000;
    const pointsToNextTier = Math.max(0, nextTierThreshold - currentBalance);

    setPointsNotification({
      amount: pointsEarned,
      tier: newTier,
      pointsNeeded: pointsToNextTier,
      totalTierRequirement: nextTierThreshold,
    });

    // Deduct redemption points if code was used
    if (appliedDiscount > 0) {
      setLoyaltyBalance(prev => Math.max(0, prev - (appliedDiscount / 1 * 100)));
    }

    setLoyaltyBalance(currentBalance);
    setConfirmed(true);
  };

  const handleReset = () => {
    setBooking(INITIAL_BOOKING);
    setStep(1);
    setConfirmed(false);
    setAppliedDiscount(0);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      {pointsNotification && (
        <PointsNotification
          pointsEarned={pointsNotification.amount}
          currentPoints={loyaltyBalance}
          tierProgress={{
            tier: pointsNotification.tier,
            pointsNeeded: pointsNotification.pointsNeeded,
            totalTierRequirement: pointsNotification.totalTierRequirement,
          }}
          onClose={() => setPointsNotification(null)}
        />
      )}

      <div className="flex gap-1 mb-6 p-1 rounded-lg bg-surface-2 border border-primary-border w-fit">
        {(['booking', 'loyalty'] as CustomerTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-all
              ${tab === t
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            {t === 'booking' ? 'Book Appointment' : 'Loyalty & Points'}
          </button>
        ))}
      </div>

      {tab === 'loyalty' ? (
        <LoyaltySection loyaltyBalance={loyaltyBalance} />
      ) : confirmed ? (
        <BookingConfirmed
          booking={booking}
          onReset={handleReset}
          pointsEarned={pointsNotification}
          currentPoints={loyaltyBalance}
        />
      ) : (
        <div>
          <ProgressBar step={step} />
          {step === 1 && (
            <Step1Branch booking={booking} onSelect={b => { setBooking(prev => ({ ...prev, branch: b })); }} />
          )}
          {step === 2 && (
            <Step2Service booking={booking} onSelect={s => { setBooking(prev => ({ ...prev, service: s })); }} />
          )}
          {step === 3 && (
            <Step3Stylist
              booking={booking}
              onSelectStylist={s => setBooking(prev => ({ ...prev, stylist: s, slot: '' }))}
              onSelectSlot={t => setBooking(prev => ({ ...prev, slot: t }))}
            />
          )}
          {step === 4 && (
            <Step4Details
              booking={booking}
              onChange={(f, v) => {
                if (f === 'redemptionCode') {
                  handleRedemptionCodeChange(v);
                } else {
                  setBooking(prev => ({ ...prev, [f]: v }));
                }
              }}
              onConfirm={handleConfirm}
              onWhatsApp={handleWhatsApp}
              appliedDiscount={appliedDiscount}
            />
          )}

          {step < 4 && (
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button onClick={goBack} className="btn-ghost px-6 py-2.5 text-sm">
                  Back
                </button>
              )}
              <button
                onClick={goNext}
                disabled={!canNext()}
                className={`btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2
                  ${!canNext() ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
