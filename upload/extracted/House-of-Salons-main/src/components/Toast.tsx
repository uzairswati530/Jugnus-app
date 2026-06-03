import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom">
      <div className="card p-4 rounded-lg flex items-center gap-3 shadow-lg">
        <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0">
          <Check size={16} className="text-green-400" />
        </div>
        <p className="text-sm text-white font-medium">{message}</p>
      </div>
    </div>
  );
}
