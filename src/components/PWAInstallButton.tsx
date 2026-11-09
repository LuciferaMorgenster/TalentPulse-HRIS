import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Translations } from '../translations';

interface PWAInstallButtonProps {
  t: Translations;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ t }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-900 transition-colors shadow-2xs whitespace-nowrap"
        title="Install TalentPulse as Progressive Web App"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t.installApp}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
          title="Install on iOS Home Screen"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.installAppIOS}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Install TalentPulse on iOS
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                    1
                  </div>
                  <p>
                    Tap the <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 inline" /> Share</strong> button in Safari's bottom toolbar.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                    2
                  </div>
                  <p>
                    Scroll down and select <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                    3
                  </div>
                  <p>
                    Confirm by tapping <strong className="text-slate-900 dark:text-white">Add</strong> in the top-right corner.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Also offer a manual install prompt button if beforeinstallprompt hasn't fired yet or on other platforms
  return (
    <button
      type="button"
      onClick={install}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-900 transition-colors shadow-2xs whitespace-nowrap"
      title="Install TalentPulse as Progressive Web App"
    >
      <Download className="w-3.5 h-3.5" />
      <span className="hidden md:inline">{t.installApp}</span>
    </button>
  );
};
