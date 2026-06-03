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
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom">
      <div className="card p-6 rounded-lg space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Award size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">Points Earned!</p>
            <p className="text-3xl font-bold text-primary mt-0.5">+{pointsEarned.toLocaleString()}</p>
          </div>
        </div>

        {/* Current Balance */}
        <div className="bg-surface-2 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">New Balance</p>
          <p className="text-2xl font-bold text-white">{currentPoints.toLocaleString()} points</p>
        </div>

        {/* Tier Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400">Progress to {nextTier}</p>
            <p className="text-xs font-bold text-primary">{tierProgress.pointsNeeded.toLocaleString()} pts left</p>
          </div>
          <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">
            {currentPoints.toLocaleString()} / {tierProgress.totalTierRequirement.toLocaleString()} {tierProgress.tier} tier
          </p>
        </div>

        {/* Action */}
        <div className="text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <TrendingUp size={12} />
            You're earning faster than before!
          </p>
        </div>
      </div>
    </div>
  );
}
