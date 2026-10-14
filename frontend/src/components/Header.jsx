import React from 'react';
import { Camera, Database, Smartphone, Monitor, Sparkles } from 'lucide-react';

export default function Header({
  onOpenCam,
  onOpenSqlModal,
  isMobileFrame,
  setIsMobileFrame,
  dbStatus
}) {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-brand-100 px-4 py-3 sm:px-6 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand with F & S Snake Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 text-white shadow-md shadow-brand-500/20">
            {/* Micro S snake wrapped around F */}
            <svg viewBox="0 0 100 100" className="w-6 h-6 filter drop-shadow" fill="none">
              {/* F vertical & arms */}
              <rect x="36" y="20" width="12" height="60" rx="3" fill="#FFFFFF" />
              <rect x="36" y="20" width="34" height="10" rx="3" fill="#FFFFFF" />
              <rect x="36" y="44" width="24" height="9" rx="2.5" fill="#FFFFFF" />
              {/* S snake winding around */}
              <path
                d="M 72 26 C 62 10, 26 12, 24 34 C 22 56, 74 54, 70 74 C 66 94, 30 92, 22 78"
                stroke="#BAE6FD"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle cx="72" cy="26" r="3.5" fill="#38BDF8" />
            </svg>
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none flex items-center gap-1">
              Fashion<span className="text-brand-600">search</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">AI Costume Lens & Price Compare</p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* PostgreSQL 17 File Badge */}
          <button
            onClick={onOpenSqlModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-semibold transition active:scale-95"
            title="View PostgreSQL 17 Export file"
          >
            <Database className="w-3.5 h-3.5 text-brand-600" />
            <span>PG 17 Data</span>
          </button>

          {/* Mobile view frame toggle (on desktop) */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="p-2 rounded-xl bg-white hover:bg-brand-50 border border-brand-100 text-slate-600 hover:text-brand-600 transition active:scale-95"
            title={isMobileFrame ? "Switch to Responsive View" : "Simulate Mobile Screen"}
          >
            {isMobileFrame ? (
              <Monitor className="w-4 h-4 text-brand-600" />
            ) : (
              <Smartphone className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Quick Camera Snapshot Button */}
          <button
            onClick={onOpenCam}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Take Pic</span>
          </button>
        </div>
      </div>
    </header>
  );
}
