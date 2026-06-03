'use client';

import { Award, Check } from 'lucide-react';

interface PointsAwardPopupProps {
  customerName: string;
  serviceName: string;
  servicePrice: number;
  onConfirm: () => void;
  onSkip: () => void;
}

export default function PointsAwardPopup({
  customerName,
  serviceName,
  servicePrice,
  onConfirm,
  onSkip,
}: PointsAwardPopupProps) {
  const pointsToAward = servicePrice;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card p-6 max-w-sm mx-4 rounded-lg space-y-5 animate-in">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 mx-auto">
          <Award size={28} className="text-amber-600" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-gray-900">Award Loyalty Points?</h3>
          <p className="text-sm text-gray-500">Add points to {customerName}&apos;s account for this visit.</p>
        </div>

        <div className="card-2 p-4 rounded-lg text-center space-y-1">
          <p className="text-xs text-gray-500">{serviceName}</p>
          <p className="text-3xl font-bold text-[#C5A044]">+{pointsToAward.toLocaleString()}</p>
          <p className="text-xs text-gray-400">points</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="btn-ghost flex-1 py-2.5 text-sm"
          >
            Skip
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
