import { useState } from 'react';
import { X, Search, Award, Plus, Minus, Gift, Calendar, TrendingUp } from 'lucide-react';

interface LoyaltyCustomer {
  phone: string;
  name: string;
  tier: 'Bronze' | 'Silver' | 'Gold';
  pointsBalance: number;
  lastVisit?: string;
  activeRedemptionCode?: string;
}

interface LoyaltyLookupModalProps {
  onClose: () => void;
  onGenerateCode?: (phone: string, code: string) => void;
}

const MOCK_CUSTOMERS: Record<string, LoyaltyCustomer> = {
  '03001234567': { phone: '0300-1234567', name: 'Fatima Zaidi', tier: 'Gold', pointsBalance: 6500, lastVisit: '28 May 2026', activeRedemptionCode: 'HOS-482910' },
  '03119876543': { phone: '0311-9876543', name: 'Sana Riaz', tier: 'Silver', pointsBalance: 2450, lastVisit: '15 May 2026' },
  '03331122334': { phone: '0333-1122334', name: 'Zara Butt', tier: 'Bronze', pointsBalance: 750, lastVisit: '02 May 2026' },
  '03455566778': { phone: '0345-5566778', name: 'Hina Khan', tier: 'Gold', pointsBalance: 5200, lastVisit: '01 Jun 2026' },
};

const tierColors: Record<string, { bg: string; text: string; border: string }> = {
  Bronze: { bg: 'bg-amber-800/20', text: 'text-amber-600', border: 'border-amber-800/40' },
  Silver: { bg: 'bg-gray-400/10', text: 'text-gray-300', border: 'border-gray-400/30' },
  Gold: { bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/30' },
};

export default function LoyaltyLookupModal({ onClose, onGenerateCode }: LoyaltyLookupModalProps) {
  const [searchPhone, setSearchPhone] = useState('');
  const [customer, setCustomer] = useState<LoyaltyCustomer | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [pointsToDeduct, setPointsToDeduct] = useState('');
  const [showAddPoints, setShowAddPoints] = useState(false);
  const [showDeductPoints, setShowDeductPoints] = useState(false);
  const [showGenerateCode, setShowGenerateCode] = useState(false);

  const handleSearch = () => {
    const normalized = searchPhone.replace(/\D/g, '').slice(-10);
    const key = normalized;
    if (MOCK_CUSTOMERS[key]) {
      setCustomer(MOCK_CUSTOMERS[key]);
    } else {
      setCustomer(null);
    }
  };

  const handleAddPoints = () => {
    if (customer && pointsToAdd && parseInt(pointsToAdd) > 0) {
      setCustomer(prev => prev ? { ...prev, pointsBalance: prev.pointsBalance + parseInt(pointsToAdd) } : null);
      setShowAddPoints(false);
      setPointsToAdd('');
    }
  };

  const handleDeductPoints = () => {
    if (customer && pointsToDeduct && parseInt(pointsToDeduct) > 0) {
      const newBalance = Math.max(0, customer.pointsBalance - parseInt(pointsToDeduct));
      setCustomer(prev => prev ? { ...prev, pointsBalance: newBalance } : null);
      setShowDeductPoints(false);
      setPointsToDeduct('');
    }
  };

  const handleGenerateCode = () => {
    if (customer && customer.pointsBalance >= 500) {
      const num = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      const code = `HOS-${num}`;
      setCustomer(prev => prev ? { ...prev, activeRedemptionCode: code } : null);
      setShowGenerateCode(false);
      if (onGenerateCode) onGenerateCode(customer.phone, code);
    }
  };

  const tc = customer ? tierColors[customer.tier] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-4">
      <div className="card w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award size={20} className="text-primary" />
            Loyalty Lookup
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
            <div className="flex gap-2">
              <input
                type="tel"
                className="input-dark flex-1 px-4 py-2.5"
                placeholder="0300-0000000"
                value={searchPhone}
                onChange={e => setSearchPhone(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} className="btn-primary px-4 py-2.5 flex items-center gap-2">
                <Search size={16} />
              </button>
            </div>
          </div>
        </div>

        {!customer && searchPhone && (
          <div className="card-2 p-4 rounded-lg text-center">
            <p className="text-gray-500 text-sm">No customer found. Try another phone number.</p>
          </div>
        )}

        {customer && (
          <div className="space-y-5">
            {/* Customer Info Card */}
            <div className="card-2 p-5 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-white">{customer.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{customer.phone}</p>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full border ${tc?.bg} ${tc?.text} ${tc?.border}`}>
                  {customer.tier}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Points Balance</p>
                  <p className="text-2xl font-bold text-primary">{customer.pointsBalance.toLocaleString()}</p>
                </div>
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Discount Available</p>
                  <p className="text-2xl font-bold text-green-400">Rs {Math.floor(customer.pointsBalance / 100) * 100}</p>
                </div>
              </div>

              {customer.lastVisit && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  Last visit: {customer.lastVisit}
                </div>
              )}

              {customer.activeRedemptionCode && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <p className="text-xs text-amber-600 font-medium mb-1">Active Redemption Code</p>
                  <p className="font-mono text-sm text-amber-400 font-bold">{customer.activeRedemptionCode}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowAddPoints(!showAddPoints)}
                className="btn-ghost py-2.5 flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} />
                Add Points
              </button>
              <button
                onClick={() => setShowDeductPoints(!showDeductPoints)}
                className="btn-ghost py-2.5 flex items-center justify-center gap-2 text-sm"
              >
                <Minus size={16} />
                Deduct Points
              </button>
              <button
                onClick={() => setShowGenerateCode(!showGenerateCode)}
                disabled={customer.pointsBalance < 500}
                className={`btn-primary py-2.5 flex items-center justify-center gap-2 text-sm col-span-2
                  ${customer.pointsBalance < 500 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Gift size={16} />
                Generate Redemption Code
              </button>
            </div>

            {/* Add Points */}
            {showAddPoints && (
              <div className="card-2 p-4 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Points to Add</label>
                  <input
                    type="number"
                    className="input-dark w-full px-4 py-2.5"
                    placeholder="Enter amount"
                    value={pointsToAdd}
                    onChange={e => setPointsToAdd(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowAddPoints(false);
                      setPointsToAdd('');
                    }}
                    className="btn-ghost flex-1 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button onClick={handleAddPoints} className="btn-primary flex-1 py-2 text-sm">
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Deduct Points */}
            {showDeductPoints && (
              <div className="card-2 p-4 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Points to Deduct</label>
                  <input
                    type="number"
                    className="input-dark w-full px-4 py-2.5"
                    placeholder="Enter amount"
                    value={pointsToDeduct}
                    onChange={e => setPointsToDeduct(e.target.value)}
                    min="0"
                    max={customer.pointsBalance}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowDeductPoints(false);
                      setPointsToDeduct('');
                    }}
                    className="btn-ghost flex-1 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button onClick={handleDeductPoints} className="btn-primary flex-1 py-2 text-sm">
                    Deduct
                  </button>
                </div>
              </div>
            )}

            {/* Generate Code */}
            {showGenerateCode && (
              <div className="card-2 p-4 rounded-lg space-y-3">
                <p className="text-sm text-gray-400">Generate a new redemption code for {customer.name}?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowGenerateCode(false)}
                    className="btn-ghost flex-1 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button onClick={handleGenerateCode} className="btn-primary flex-1 py-2 text-sm">
                    Generate Code
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
