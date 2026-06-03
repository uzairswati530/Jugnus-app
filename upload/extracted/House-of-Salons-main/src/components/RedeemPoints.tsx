import { useState } from 'react';
import { Copy, Check, Gift, TrendingUp, AlertCircle } from 'lucide-react';

interface RedemptionState {
  code: string;
  pointsUsed: number;
  discountAmount: number;
  isValid: boolean;
}

interface RedeemPointsProps {
  pointsBalance: number;
  onRedeem: (code: string, pointsUsed: number, discountAmount: number) => void;
}

export default function RedeemPoints({ pointsBalance, onRedeem }: RedeemPointsProps) {
  const [showRedemption, setShowRedemption] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(500);
  const [generatedCode, setGeneratedCode] = useState<RedemptionState | null>(null);
  const [copied, setCopied] = useState(false);

  const maxRedeemable = Math.floor(pointsBalance / 100) * 100;
  const discountAmount = Math.floor(pointsToRedeem / 100) * 100;
  const canRedeem = pointsBalance >= 500;

  const generateCode = () => {
    const num = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const code = `HOS-${num}`;
    setGeneratedCode({
      code,
      pointsUsed: pointsToRedeem,
      discountAmount,
      isValid: true,
    });
    onRedeem(code, pointsToRedeem, discountAmount);
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (generatedCode) {
    return (
      <div className="card p-6 rounded-xl">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto">
            <Check size={32} className="text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Redemption Code Generated!</h3>
            <p className="text-gray-400 text-sm mt-1">{generatedCode.pointsUsed.toLocaleString()} points redeemed</p>
          </div>

          <div className="bg-surface-2 border border-primary-border rounded-lg p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your Redemption Code</p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-3xl font-bold text-primary font-mono">{generatedCode.code}</p>
              <button
                onClick={copyCode}
                className="btn-ghost p-3"
                title="Copy code"
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-400 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-amber-400 font-semibold">Show this code to the receptionist</p>
                <p className="text-gray-400 text-xs mt-1">before payment to apply your {generatedCode.discountAmount.toLocaleString()} rupee discount.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="card-2 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-500">Points Used</p>
              <p className="text-lg font-bold text-primary mt-1">{generatedCode.pointsUsed.toLocaleString()}</p>
            </div>
            <div className="card-2 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-500">Discount</p>
              <p className="text-lg font-bold text-green-400 mt-1">Rs {generatedCode.discountAmount.toLocaleString()}</p>
            </div>
          </div>

          <button
            onClick={() => setGeneratedCode(null)}
            className="btn-ghost w-full py-2.5 text-sm"
          >
            Generate Another Code
          </button>
        </div>
      </div>
    );
  }

  if (showRedemption) {
    return (
      <div className="card p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Gift size={18} className="text-primary" />
            Redeem Points
          </h3>
          <button
            onClick={() => setShowRedemption(false)}
            className="text-gray-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        {!canRedeem && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-sm text-red-400">Minimum 500 points required to redeem. You have {pointsBalance.toLocaleString()} points.</p>
          </div>
        )}

        {canRedeem && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Points to Redeem</label>
              <input
                type="range"
                min={500}
                max={maxRedeemable}
                step={100}
                value={pointsToRedeem}
                onChange={e => setPointsToRedeem(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-gray-500">500 points min</span>
                <span className="text-primary font-bold">{pointsToRedeem.toLocaleString()} points</span>
                <span className="text-gray-500">{maxRedeemable.toLocaleString()} max</span>
              </div>
            </div>

            <div className="bg-primary-dim border border-primary-border rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Discount Amount</p>
              <p className="text-3xl font-bold text-primary">Rs {discountAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-2">Conversion: 100 points = Rs 100</p>
            </div>

            <button
              onClick={generateCode}
              className="btn-primary w-full py-3 font-semibold"
            >
              Generate Redemption Code
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card p-5 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Available to Redeem</p>
          <p className="text-3xl font-bold text-primary mt-1">{Math.floor(pointsBalance / 100) * 100} points</p>
          <p className="text-sm text-gray-400 mt-1">= Rs {Math.floor(pointsBalance / 100) * 100} discount</p>
        </div>
        <button
          onClick={() => setShowRedemption(true)}
          disabled={!canRedeem}
          className={`btn-primary px-6 py-2.5 text-sm ${!canRedeem ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Redeem
        </button>
      </div>
    </div>
  );
}
