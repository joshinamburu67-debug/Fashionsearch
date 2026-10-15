import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase';
import { Sparkles, Camera, TrendingDown, ShieldCheck, ArrowRight, AlertCircle, ExternalLink, UserCheck } from 'lucide-react';

export default function LoginScreen({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorObj, setErrorObj] = useState(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorObj(null);
    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        if (error.includes('configuration-not-found')) {
          setErrorObj({
            code: 'configuration-not-found',
            title: 'Google Sign-In Not Enabled in Firebase Console',
            message: 'In your Firebase Console, Google Authentication needs to be turned ON (takes 30 seconds).',
            link: 'https://console.firebase.google.com/project/fashionsearch-57146/authentication/providers'
          });
        } else if (error.includes('unauthorized-domain')) {
          setErrorObj({
            code: 'unauthorized-domain',
            title: 'Domain Not Authorized in Firebase',
            message: 'Add "localhost" or "127.0.0.1" to Authorized Domains in Firebase Console Settings.',
            link: 'https://console.firebase.google.com/project/fashionsearch-57146/authentication/settings'
          });
        } else if (error.includes('popup-closed-by-user')) {
          setErrorObj({
            code: 'popup-closed',
            title: 'Sign-In Window Closed',
            message: 'You closed the Google sign-in window before completing the login.',
          });
        } else {
          setErrorObj({
            code: 'generic',
            title: 'Authentication Error',
            message: error,
          });
        }
      } else if (user) {
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }
    } catch (err) {
      setErrorObj({
        code: 'exception',
        title: 'Sign-in Failed',
        message: err.message || 'An unexpected error occurred during Google Sign-In.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    // Provide an immediate demo account so user can test the app without blockers
    const guestUser = {
      uid: 'guest-' + Date.now(),
      displayName: 'Fashion Explorer (Guest)',
      email: 'guest@fashionsearch.ai',
      photoURL: null,
      isAnonymous: true
    };
    if (onLoginSuccess) {
      onLoginSuccess(guestUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-100 flex flex-col justify-between items-center p-6 text-slate-800 select-none overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-200/50 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-10 w-60 h-60 bg-sky-200/40 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Brand Bar */}
      <div className="w-full max-w-sm flex items-center justify-between z-10 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-brand-200 shadow-sm text-xs font-bold text-brand-700">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Fashionsearch AI Lens</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Firebase Auth</span>
      </div>

      {/* Centerpiece Hero */}
      <div className="w-full max-w-sm z-10 flex flex-col items-center text-center my-auto py-6">
        
        {/* Animated S Snake around F Brand Logo */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center mb-6 snake-glow">
          <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-xl" fill="none">
            <defs>
              <linearGradient id="fGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>
              <linearGradient id="snakeGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="snakeBellyLogin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="100%" stopColor="#E0F2FE" />
              </linearGradient>
              <filter id="softGlowLogin" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Letter F */}
            <g id="letter-F">
              <rect x="78" y="32" width="22" height="136" rx="6" fill="url(#fGradLogin)" />
              <rect x="78" y="32" width="68" height="20" rx="6" fill="url(#fGradLogin)" />
              <rect x="78" y="88" width="50" height="18" rx="5" fill="url(#fGradLogin)" />
              <path d="M82 36 L82 162" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            </g>

            {/* Snake S */}
            <g id="snake-S" filter="url(#softGlowLogin)">
              <path
                d="M 148 48 C 130 18, 62 20, 56 60 C 50 100, 150 96, 144 140 C 138 180, 70 182, 52 152"
                stroke="#0369A1"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                className="snake-s-path"
                d="M 152 46 C 132 16, 60 18, 54 62 C 48 102, 152 98, 146 142 C 140 184, 68 186, 48 154"
                stroke="url(#snakeGradLogin)"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <path
                d="M 150 46 C 131 19, 64 21, 58 62 C 52 100, 148 98, 142 140 C 136 180, 72 182, 52 154"
                stroke="url(#snakeBellyLogin)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 6"
                opacity="0.9"
              />
              <g transform="translate(152, 46) rotate(-25)">
                <ellipse cx="0" cy="0" rx="9" ry="6" fill="#0284C7" />
                <ellipse cx="0" cy="0" rx="7" ry="4" fill="#38BDF8" />
                <circle cx="3" cy="-2" r="1.8" fill="#FFFFFF" />
                <path d="M 9 0 L 14 -2 M 9 0 L 14 2" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          Welcome to <br />
          <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">
            Fashionsearch
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-xs leading-relaxed">
          Snap any outfit, let Gemini AI identify color & length, and compare real-time prices across Amazon, Myntra, Ajio & Zara.
        </p>

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-2 gap-2 w-full my-4 text-left">
          <div className="glass-panel p-2.5 rounded-2xl flex items-center gap-2 border border-brand-100 shadow-sm">
            <div className="p-1.5 rounded-xl bg-brand-100 text-brand-600">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-800">Costume Lens</p>
              <p className="text-[9px] text-slate-400">Live Camera Snap</p>
            </div>
          </div>

          <div className="glass-panel p-2.5 rounded-2xl flex items-center gap-2 border border-brand-100 shadow-sm">
            <div className="p-1.5 rounded-xl bg-sky-100 text-sky-600">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-800">Price Compare</p>
              <p className="text-[9px] text-slate-400">6+ Fashion Apps</p>
            </div>
          </div>
        </div>

        {/* Detailed Friendly Error Box with 1-click Solution */}
        {errorObj && (
          <div className="w-full mb-4 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-slate-800 text-xs text-left shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{errorObj.title}</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed mb-2.5">
              {errorObj.message}
            </p>
            {errorObj.link && (
              <a
                href={errorObj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-sm transition active:scale-95"
              >
                <span>Enable Google in Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-brand-200 hover:border-brand-400 text-slate-800 font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-3 relative disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-600 font-medium">Connecting Google...</span>
            </div>
          ) : (
            <>
              {/* Official Google G Logo */}
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4 text-brand-500 group-hover:translate-x-1 transition ml-auto" />
            </>
          )}
        </button>

        {/* Guest Demo Mode Option */}
        <div className="w-full mt-3 flex items-center justify-center">
          <button
            onClick={handleGuestLogin}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-brand-50 transition active:scale-95"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Or Continue as Guest (Instant Access)</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-400 mt-3 font-light">
          Secured by Firebase Authentication • No password required
        </p>
      </div>

      {/* Footer info */}
      <div className="w-full max-w-sm z-10 flex items-center justify-center gap-1.5 text-[11px] text-brand-700/80 font-medium pb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
        <span>Gemini Vision AI • Multi-Store Price Comparison</span>
      </div>
    </div>
  );
}
