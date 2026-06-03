import { History } from 'lucide-react';

interface Redemption {
  date: string;
  code: string;
  pointsUsed: number;
  discountReceived: number;
  branch: string;
}

interface RedemptionHistoryProps {
  redemptions: Redemption[];
}

export default function RedemptionHistory({ redemptions }: RedemptionHistoryProps) {
  if (redemptions.length === 0) {
    return (
      <div className="card p-6 rounded-xl text-center">
        <History size={24} className="text-gray-600 mx-auto mb-2" />
        <p className="text-gray-500">No redemptions yet</p>
      </div>
    );
  }

  return (
    <div className="card p-5 rounded-xl">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <History size={18} className="text-primary" />
        Redemption History
      </h3>
      <div className="space-y-2">
        {redemptions.map((r, i) => (
          <div key={i} className="card-2 p-3.5 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{r.code}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>{r.date}</span>
                <span>•</span>
                <span>{r.branch}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-amber-400">{r.pointsUsed.toLocaleString()} pts</p>
              <p className="text-xs text-green-400 mt-0.5">Rs {r.discountReceived.toLocaleString()} off</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
