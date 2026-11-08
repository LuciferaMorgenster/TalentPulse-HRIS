import React, { useState } from 'react';
import { Heart, Copy, Check, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { Translations } from '../translations';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, t }) => {
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(15);
  const paypalEmail = 'luciferamorgenster@gmail.com';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(paypalEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getPaypalUrl = (amount?: number | null) => {
    const base = `https://www.paypal.com/donate/?business=${encodeURIComponent(paypalEmail)}&no_recurring=0&currency_code=EUR`;
    return amount ? `${base}&amount=${amount}` : base;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 id="support-modal-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t.supportTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                TalentPulse HRIS · Independent Project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={t.supportClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.supportDesc}
          </p>

          {/* PayPal Account Box */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              {t.supportPaypalAccount}
            </span>
            <div className="flex items-center justify-between gap-3">
              <code className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100 truncate">
                {paypalEmail}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">{t.supportCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Amount presets */}
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">
              {t.supportAmounts}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 15, 30, 50].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                    selectedAmount === amt
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  €{amt}
                </button>
              ))}
            </div>
          </div>

          {/* PayPal direct CTA button */}
          <div className="pt-2">
            <a
              href={getPaypalUrl(selectedAmount)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .77-.655h7.24c3.084 0 5.405.794 6.326 2.176.924 1.385.835 3.32-.24 5.302-.977 1.802-2.584 3.033-4.646 3.559l-.495.127-.417 2.628-.024.153a.64.64 0 0 1-.632.535H9.68l-.894 5.617a.64.64 0 0 1-.633.535h-1.077z" />
              </svg>
              <span>{t.supportButtonText} {selectedAmount ? `(€${selectedAmount})` : ''}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t.supportNote}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {t.supportClose}
          </button>
        </div>
      </div>
    </div>
  );
};
