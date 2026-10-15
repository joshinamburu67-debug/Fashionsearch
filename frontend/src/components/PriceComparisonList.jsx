import React, { useState } from 'react';
import { ExternalLink, Star, ShieldCheck, ArrowDown, TrendingDown, Store, ShoppingBag } from 'lucide-react';

export default function PriceComparisonList({ comparison }) {
  if (!comparison || !comparison.products || comparison.products.length === 0) {
    return null;
  }

  const { products, stats } = comparison;
  const [selectedStore, setSelectedStore] = useState('ALL');
  const [sortBy, setSortBy] = useState('price_asc'); // 'price_asc', 'discount_desc', 'rating_desc'

  const storesList = ['ALL', ...Array.from(new Set(products.map(p => p.store_name)))];

  // Filter products
  const filtered = products.filter(p => selectedStore === 'ALL' || p.store_name === selectedStore);

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'discount_desc') return (b.discount_percent || 0) - (a.discount_percent || 0);
    if (sortBy === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const getStoreBadgeColor = (storeName) => {
    switch (storeName.toLowerCase()) {
      case 'amazon':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'myntra':
        return 'bg-pink-100 text-pink-900 border-pink-200';
      case 'ajio':
        return 'bg-indigo-100 text-indigo-900 border-indigo-200';
      case 'flipkart':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'meesho':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'zara':
        return 'bg-slate-900 text-white border-slate-700';
      case 'h&m':
        return 'bg-red-100 text-red-900 border-red-200';
      default:
        return 'bg-brand-100 text-brand-900 border-brand-200';
    }
  };

  return (
    <div className="w-full text-left">
      {/* Price Comparison Summary Banner */}
      {stats && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 text-white p-4 shadow-lg shadow-brand-500/20 mb-5">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-brand-100 uppercase tracking-wider flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> Best Price Across {stats.total_stores_compared} Stores
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black tracking-tight">₹{stats.lowest_price}</span>
                <span className="text-xs text-brand-100 line-through">₹{stats.highest_price}</span>
                <span className="text-xs font-bold bg-white text-brand-700 px-2 py-0.5 rounded-full shadow-sm">
                  Save up to {stats.max_savings_percent}%
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-brand-100 block">Lowest on</span>
              <span className="font-bold text-sm bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg inline-block border border-white/30">
                {stats.best_deal_store}
              </span>
            </div>
          </div>

          {/* Decorative wave background */}
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        </div>
      )}

      {/* Filter Tabs & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        {/* Store pills (horizontal scrollable on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {storesList.map(store => (
            <button
              key={store}
              onClick={() => setSelectedStore(store)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStore === store
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white/80 text-slate-600 hover:bg-white border border-brand-100'
              }`}
            >
              {store === 'ALL' ? 'All Stores' : store}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-brand-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="discount_desc">Highest Discount</option>
          <option value="rating_desc">Top Customer Rated</option>
        </select>
      </div>

      {/* Product Comparison Cards */}
      <div className="space-y-3">
        {sorted.map((item, index) => {
          const isLowest = item.is_lowest_price || item.price === stats?.lowest_price;

          return (
            <div
              key={`${item.store_name}-${index}`}
              className={`relative rounded-2xl p-4 transition-all duration-200 ${
                isLowest
                  ? 'bg-white border-2 border-brand-400 shadow-md shadow-brand-400/15 ring-2 ring-brand-100'
                  : 'glass-panel hover:bg-white border border-brand-100 hover:shadow-md'
              }`}
            >
              {/* Lowest Price or Special Badge */}
              {isLowest && (
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
                  ⚡ Lowest Price Found
                </div>
              )}

              <div className="flex items-center gap-3 sm:gap-4">
                {/* Product Thumbnail */}
                <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/80">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Store Mini Logo Tag */}
                  <span className={`absolute bottom-1 left-1 right-1 text-center py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${getStoreBadgeColor(item.store_name)} shadow-sm`}>
                    {item.store_name}
                  </span>
                </div>

                {/* Info & Price */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.store_name}
                    </span>
                    {item.badge && !isLowest && (
                      <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 text-[10px] font-medium border border-brand-200">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1 leading-snug mb-1.5">
                    {item.title}
                  </h3>

                  {/* Delivery & Rating */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                    <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                      {item.rating} <span className="text-slate-400 font-normal">({item.review_count})</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium truncate">
                      {item.delivery_info}
                    </span>
                  </div>

                  {/* Price & CTA Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        ₹{item.price}
                      </span>
                      {item.original_price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.original_price}
                        </span>
                      )}
                      {item.discount_percent > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {item.discount_percent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Direct Buy / Store Link */}
                    <a
                      href={item.product_url || item.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm ${
                        item.store_name.toLowerCase() === 'amazon'
                          ? 'bg-[#FF9900] hover:bg-[#F28B00] text-slate-900'
                          : 'bg-brand-600 hover:bg-brand-700 text-white'
                      }`}
                    >
                      <span>View on {item.store_name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
