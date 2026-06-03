'use client';

import { useEffect, useState } from 'react';
import { Award, TrendingUp } from 'lucide-react';

interface PointsNotificationProps {
  pointsEarned: number;
  currentPoints: number;
  tierProgress: {
    tier: string;
    pointsNeeded: number;
    totalTierRequirement: number;
  };
  onClose: () => void;
}

export default function PointsNotification({
  pointsEarned,
  currentPoints,
  tierProgress,
  onClose,
}: PointsNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const progressPercent = ((tierProgress.totalTierRequirement - tierProgress.pointsNeeded) / tierProgress.totalTierRequirement) * 100;
  const nextTier = tierProgress.tier === 'Bronze' ? 'Silver' : tierProgress.tier === 'Silver' ? 'Gold' : 'Platinum';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in">
      <div className="card p-6 rounded-lg space-y-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#C5A044]/20 border border-[#C5A044]/40 flex items-center justify-center">
            <Award size={24} className="text-[#C5A044]" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">Points Earned!</p>
            <p className="text-3xl font-bold text-[#C5A044] mt-0.5">+{pointsEarned.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-[#F5F5F5] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">New Balance</p>
          <p className="text-2xl font-bold text-gray-900">{currentPoints.toLocaleString()} points</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500">Progress to {nextTier}</p>
            <p className="text-xs font-bold text-[#C5A044]">{tierProgress.pointsNeeded.toLocaleString()} pts left</p>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C5A044] to-[#D4AF37] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">
            {currentPoints.toLocaleString()} / {tierProgress.totalTierRequirement.toLocaleString()} {tierProgress.tier} tier
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <TrendingUp size={12} />
            You&apos;re earning faster than before!
          </p>
        </div>
      </div>
    </div>
  );
}
