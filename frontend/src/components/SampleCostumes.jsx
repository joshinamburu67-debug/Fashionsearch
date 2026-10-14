import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SampleCostumes({ samples = [], onSelectSample, isLoading }) {
  if (!samples || samples.length === 0) return null;

  return (
    <div className="mb-6 text-left">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          Or Try Instant Sample Outfits
        </h3>
        <span className="text-[11px] text-brand-600 font-semibold">1-Tap Analyze</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {samples.map((sample) => (
          <button
            key={sample.id}
            disabled={isLoading}
            onClick={() => onSelectSample(sample)}
            className="group relative rounded-2xl overflow-hidden glass-panel hover:bg-white border border-brand-100 hover:border-brand-300 p-2 text-left transition-all active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-2 bg-slate-100">
              <img
                src={sample.image_url}
                alt={sample.costume_name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span
                className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: sample.color_hex }}
              ></span>
            </div>

            <p className="text-[10px] font-bold text-brand-600 uppercase tracking-tight truncate">
              {sample.detected_length}
            </p>
            <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">
              {sample.costume_name}
            </h4>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
              <span>{sample.detected_category}</span>
              <ArrowRight className="w-3 h-3 text-brand-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
