import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Tag, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';

export const DEMO_OUTFITS = [
  {
    id: 'demo-1',
    costume_name: 'Sky Blue Tiered Floral Maxi Dress',
    detected_color: 'Sky Blue & Floral',
    detected_length: 'Maxi (Floor Length)',
    detected_category: 'Dresses & Gowns',
    detected_fabric: 'Chiffon Silk Blend',
    detected_pattern: 'Botanical Floral',
    detected_style: 'Boho Resort Elegance',
    color_hex: '#38BDF8',
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    summary: 'Graceful cascading tiered silhouette in pastel sky blue with delicate botanical floral accents.',
    best_store: 'Amazon',
    lowest_price: 1499,
    original_price: 2299,
    discount_percent: 35,
    deal_highlight: 'Save ₹800 on Amazon'
  },
  {
    id: 'demo-2',
    costume_name: 'Vintage Washed Oversized Denim Jacket',
    detected_color: 'Ice Blue Denim',
    detected_length: 'Waist Length',
    detected_category: 'Jackets & Outerwear',
    detected_fabric: '100% Rigid Cotton Denim',
    detected_pattern: 'Acid Washed Solid',
    detected_style: 'Urban Streetwear',
    color_hex: '#0284C7',
    image_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    summary: 'Classic trucker cut with dropped shoulders, distressed seams, and silver-tone metallic buttons.',
    best_store: 'Ajio',
    lowest_price: 1899,
    original_price: 2599,
    discount_percent: 27,
    deal_highlight: 'Save ₹700 on Ajio'
  },
  {
    id: 'demo-3',
    costume_name: 'Emerald Royal Silk Anarkali Gown',
    detected_color: 'Emerald Green & Gold',
    detected_length: 'Floor Length',
    detected_category: 'Ethnic Festive',
    detected_fabric: 'Chanderi Silk Blend',
    detected_pattern: 'Gold Zari Embroidery',
    detected_style: 'Royal Celebration',
    color_hex: '#059669',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    summary: 'Opulent pleated flared gown with intricate golden zari motifs across the neckline and hem.',
    best_store: 'Myntra',
    lowest_price: 3299,
    original_price: 4499,
    discount_percent: 27,
    deal_highlight: 'Save ₹1,200 on Myntra'
  },
  {
    id: 'demo-4',
    costume_name: 'Pastel Coral Ribbed Knit Crop Top',
    detected_color: 'Coral Peach',
    detected_length: 'Cropped (Above Navel)',
    detected_category: 'Tops & Tees',
    detected_fabric: 'Ribbed Stretch Cotton',
    detected_pattern: 'Textured Ribbed',
    detected_style: 'Y2K Minimalist',
    color_hex: '#F43F5E',
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    summary: 'Fitted sleeveless square-neck crop silhouette designed for high-waisted styling.',
    best_store: 'Amazon',
    lowest_price: 799,
    original_price: 1299,
    discount_percent: 38,
    deal_highlight: 'Save ₹500 on Amazon'
  },
  {
    id: 'demo-5',
    costume_name: 'Midnight Black Velvet Evening Blazer',
    detected_color: 'Midnight Black',
    detected_length: 'Hip Length',
    detected_category: 'Suits & Blazers',
    detected_fabric: 'Plush Silk Velvet',
    detected_pattern: 'Solid Lustrous',
    detected_style: 'Haute Couture Formal',
    color_hex: '#0F172A',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    summary: 'Tailored single-breasted evening jacket with peaked satin lapels and deep midnight sheen.',
    best_store: 'Zara / Ajio',
    lowest_price: 2999,
    original_price: 3999,
    discount_percent: 25,
    deal_highlight: 'Save ₹1,000 across stores'
  },
  {
    id: 'demo-6',
    costume_name: 'Crimson Red Bohemian Tiered Sundress',
    detected_color: 'Crimson Ruby',
    detected_length: 'Midi (Calf Length)',
    detected_category: 'Dresses',
    detected_fabric: 'Breezy Linen Weave',
    detected_pattern: 'Solid Vibrant',
    detected_style: 'Mediterranean Summer',
    color_hex: '#E11D48',
    image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    summary: 'Vibrant ruffled tiered sundress featuring adjustable bow straps and a flowy A-line cut.',
    best_store: 'Myntra',
    lowest_price: 1399,
    original_price: 2099,
    discount_percent: 33,
    deal_highlight: 'Save ₹700 on Myntra'
  }
];

export default function CostumeSlideshow({ onSelectOutfit, isLoading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideTimerRef = useRef(null);

  const total = DEMO_OUTFITS.length;

  // Auto-slide effect (slides one after another every 3.8 seconds)
  useEffect(() => {
    if (isPaused) return;

    slideTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3800);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isPaused, total]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const currentOutfit = DEMO_OUTFITS[currentIndex];

  return (
    <div
      className="mb-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slideshow Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-brand-500/10 text-brand-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Trending Demo Costumes
            </h3>
            <p className="text-[10px] text-slate-400">
              Slide-show showcase • Tap any outfit to auto-detect deals
            </p>
          </div>
        </div>

        {/* Slide Counter & Play State */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
            {currentIndex + 1} / {total}
          </span>
          {/* Pause / Live indicator */}
          <span
            className={`w-2 h-2 rounded-full ${
              isPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'
            }`}
            title={isPaused ? 'Slideshow Paused' : 'Auto-sliding'}
          ></span>
        </div>
      </div>

      {/* Main Slideshow Frame */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-brand-200/80 shadow-xl shadow-brand-500/10">
        
        {/* Carousel Container (Smooth Slide Animation) */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {DEMO_OUTFITS.map((outfit) => (
            <div
              key={outfit.id}
              className="w-full flex-shrink-0 flex flex-col sm:flex-row items-center p-3.5 sm:p-5 gap-4"
            >
              {/* Costume Image Container with Color Badge */}
              <div className="relative w-full sm:w-5/12 aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-md bg-slate-100 group">
                <img
                  src={outfit.image_url}
                  alt={outfit.costume_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Color Hex Indicator */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-semibold">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white"
                    style={{ backgroundColor: outfit.color_hex }}
                  ></span>
                  <span>{outfit.detected_color.split('&')[0]}</span>
                </div>

                {/* Length Badge */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-brand-600/90 backdrop-blur-md text-white text-[10px] font-bold shadow">
                  {outfit.detected_length.split('(')[0]}
                </div>

                {/* Discount Tag */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500 text-white text-[11px] font-black shadow-md">
                  <Tag className="w-3 h-3" />
                  <span>{outfit.discount_percent}% OFF</span>
                </div>
              </div>

              {/* Costume Details & Price Match Summary */}
              <div className="w-full sm:w-7/12 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                      {outfit.detected_category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {outfit.detected_style}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {outfit.costume_name}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {outfit.summary}
                  </p>

                  {/* Multi-Store Price Comparison Tag */}
                  <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-brand-50 to-sky-50 border border-brand-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Lowest Available Price</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-slate-900">
                          ₹{outfit.lowest_price}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{outfit.original_price}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {outfit.best_store} Deal
                      </span>
                      <p className="text-[10px] text-brand-600 font-semibold mt-0.5">
                        {outfit.deal_highlight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 1-Click Action to Select / Test Outfit */}
                <div className="mt-4 pt-3 border-t border-brand-100/70 flex items-center gap-2">
                  <button
                    disabled={isLoading}
                    onClick={() => onSelectOutfit(outfit)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-700 hover:to-sky-600 active:scale-98 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Compare Stores for This Outfit</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous outfit"
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md border border-brand-100 transition active:scale-90 backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next outfit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md border border-brand-100 transition active:scale-90 backdrop-blur-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Bottom Pagination Dots */}
        <div className="py-2.5 flex items-center justify-center gap-1.5 border-t border-brand-100/60 bg-white/40 backdrop-blur-sm">
          {DEMO_OUTFITS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all rounded-full ${
                currentIndex === idx
                  ? 'w-6 h-2 bg-brand-600'
                  : 'w-2 h-2 bg-brand-200 hover:bg-brand-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
