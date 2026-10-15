import React from 'react';
import { Camera, Smartphone, Monitor, LogOut, Play, Sparkles } from 'lucide-react';

export default function Header({
  onOpenCam,
  onReplayIntro,
  isMobileFrame,
  setIsMobileFrame,
  user,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-brand-100 px-3 py-2.5 sm:px-6 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand with F & S Snake Logo - Clickable to Replay Intro */}
        <div
          onClick={onReplayIntro}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Click to replay Serpent Intro Animation"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            {/* Micro S snake wrapped around F */}
            <svg viewBox="0 0 100 100" className="w-5 h-5 sm:w-6 sm:h-6 filter drop-shadow" fill="none">
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
            <h1 className="text-sm sm:text-lg font-black tracking-tight text-slate-900 leading-none flex items-center gap-1">
              Fashion<span className="text-brand-600">search</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">AI Costume Lens & Price Compare</p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Replay Serpent Intro Animation Button */}
          <button
            onClick={onReplayIntro}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold transition active:scale-95"
            title="Replay Serpent & 50mm Lens Intro"
          >
            <Play className="w-3 h-3 text-sky-600 fill-sky-600" />
            <span className="hidden xs:inline">Play Intro</span>
          </button>

          {/* Mobile view frame toggle (on desktop) */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="hidden sm:block p-2 rounded-xl bg-white hover:bg-brand-50 border border-brand-100 text-slate-600 hover:text-brand-600 transition active:scale-95"
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
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Take Pic</span>
          </button>

          {/* User Profile & Sign Out */}
          {user && (
            <div className="flex items-center gap-1.5 pl-1 border-l border-brand-200">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand-300 object-cover shadow-sm"
                  title={user.displayName || user.email}
                />
              ) : (
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-300"
                  title={user.email}
                >
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}

              <button
                onClick={onLogout}
                className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition active:scale-95"
                title="Sign out of Google"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
