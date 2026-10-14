import React from 'react';
import { Sparkles, Palette, Ruler, Tag, Scissors, Compass } from 'lucide-react';

export default function CostumeAnalysisCard({ analysis, imageUrl }) {
  if (!analysis) return null;

  const {
    costume_name,
    detected_color,
    detected_length,
    detected_category,
    detected_fabric,
    detected_pattern,
    detected_style,
    color_hex = "#38BDF8",
    summary
  } = analysis;

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-lg shadow-brand-500/5 mb-5 border border-brand-100 transition-all">
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        {/* Uploaded / Captured Image preview */}
        <div className="relative w-full sm:w-32 h-48 sm:h-36 rounded-2xl overflow-hidden shadow-md flex-shrink-0 bg-brand-100/50">
          <img
            src={imageUrl}
            alt={costume_name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-300" />
            Gemini Vision
          </div>
        </div>

        {/* Costume Attributes */}
        <div className="flex-1 w-full text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
              {detected_category || "Apparel"}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              AI Classified
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug mb-2 font-sans">
            {costume_name}
          </h2>

          {summary && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {summary}
            </p>
          )}

          {/* Key tags grid: Color & Length specifically emphasized */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Color Tag */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-brand-100 shadow-sm">
              <span
                className="w-4 h-4 rounded-full border border-slate-200 flex-shrink-0 shadow-sm"
                style={{ backgroundColor: color_hex }}
              ></span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Color</p>
                <p className="font-semibold text-slate-800 truncate">{detected_color}</p>
              </div>
            </div>

            {/* Length Tag */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-brand-100 shadow-sm">
              <Ruler className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Length</p>
                <p className="font-semibold text-slate-800 truncate">{detected_length}</p>
              </div>
            </div>

            {/* Fabric Tag */}
            {detected_fabric && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-brand-100 shadow-sm">
                <Scissors className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Fabric</p>
                  <p className="font-semibold text-slate-800 truncate">{detected_fabric}</p>
                </div>
              </div>
            )}

            {/* Style Tag */}
            {detected_style && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-brand-100 shadow-sm">
                <Compass className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Style</p>
                  <p className="font-semibold text-slate-800 truncate">{detected_style}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
