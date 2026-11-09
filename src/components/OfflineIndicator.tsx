import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Translations } from '../translations';

interface OfflineIndicatorProps {
  t: Translations;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ t }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-2 text-xs font-semibold shadow-xl border border-slate-700/60 dark:border-slate-200 animate-in slide-in-from-bottom-2">
      <WifiOff className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0" />
      <span>{t.offlineBanner}</span>
    </div>
  );
};
