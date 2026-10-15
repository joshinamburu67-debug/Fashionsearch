import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Sparkles, History, RefreshCcw, Search, LogOut, Play } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import IntroLoadingScreen from './components/IntroLoadingScreen';
import CostumeSlideshow, { DEMO_OUTFITS } from './components/CostumeSlideshow';
import LoginScreen from './components/LoginScreen';
import CameraModal from './components/CameraModal';
import CostumeAnalysisCard from './components/CostumeAnalysisCard';
import PriceComparisonList from './components/PriceComparisonList';
import Header from './components/Header';
import { auth, onAuthStateChanged, logoutUser } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // Loading intro on initial link open

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Finding Costume & Comparing Store Prices...');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [activeComparison, setActiveComparison] = useState(null);
  const [activeImageUrl, setActiveImageUrl] = useState(null);

  const [recentSearches, setRecentSearches] = useState([]);
  const fileInputRef = useRef(null);
  const analysisSectionRef = useRef(null);

  // Auto-scroll to the exact location of the uploaded product
  useEffect(() => {
    if (activeAnalysis && analysisSectionRef.current) {
      setTimeout(() => {
        analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [activeAnalysis]);

  // 1. Listen for Firebase Authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch recent searches
  useEffect(() => {
    if (user) {
      fetch(`${API_BASE_URL}/api/searches`)
        .then(res => res.json())
        .then(data => setRecentSearches(data))
        .catch(err => console.log('Could not load recent searches', err));
    }
  }, [user]);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setActiveAnalysis(null);
    setActiveComparison(null);
    setActiveImageUrl(null);
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setLoadingMessage("Reading costume with Gemini Vision AI...");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_type', 'upload');

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setActiveImageUrl(previewUrl);

    try {
      const response = await fetch(`${API_BASE_URL}/api/search/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setActiveAnalysis(data.costume_analysis);
      setActiveComparison(data.comparison);
      if (data.image_url) {
        const fullUrl = data.image_url.startsWith('http') || !API_BASE_URL ? data.image_url : `${API_BASE_URL}${data.image_url}`;
        setActiveImageUrl(fullUrl);
      }

      fetch(`${API_BASE_URL}/api/searches`)
        .then(r => r.json())
        .then(list => setRecentSearches(list));

    } catch (error) {
      console.error(error);
      alert("Error analyzing costume. Please try another image or pick one of the demo outfits in the slideshow!");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  // Handle camera capture snapshot
  const handleCameraCapture = async (base64Image, sourceType = 'camera') => {
    setIsLoading(true);
    setLoadingMessage("Scanning captured costume photo...");
    setActiveImageUrl(base64Image);

    try {
      const response = await fetch(`${API_BASE_URL}/api/search/base64`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          source_type: sourceType,
        }),
      });

      if (!response.ok) throw new Error("Camera analysis failed");

      const data = await response.json();
      setActiveAnalysis(data.costume_analysis);
      setActiveComparison(data.comparison);
      if (data.image_url) {
        const fullUrl = data.image_url.startsWith('http') || !API_BASE_URL ? data.image_url : `${API_BASE_URL}${data.image_url}`;
        setActiveImageUrl(fullUrl);
      }

      fetch(`${API_BASE_URL}/api/searches`)
        .then(r => r.json())
        .then(list => setRecentSearches(list));

    } catch (error) {
      console.error(error);
      alert("Error analyzing camera capture. Please try again!");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  // Handle demo costume selection from Slideshow
  const handleSelectSample = (sample) => {
    setIsLoading(true);
    setLoadingMessage(`Comparing store deals for ${sample.costume_name}...`);
    setActiveImageUrl(sample.image_url);

    setTimeout(() => {
      // Set instantaneous rich analysis & multi-store comparison
      setActiveAnalysis({
        costume_name: sample.costume_name,
        detected_color: sample.detected_color,
        detected_length: sample.detected_length,
        detected_category: sample.detected_category,
        detected_fabric: sample.detected_fabric || "Cotton & Silk Blend",
        detected_pattern: sample.detected_pattern || "Designer Styled",
        detected_style: sample.detected_style || "Contemporary",
        color_hex: sample.color_hex || "#38BDF8",
        summary: sample.summary || "High-demand outfit with price disparity across multiple platforms."
      });

      const lowest = sample.lowest_price || 1499;
      const original = sample.original_price || (lowest + 800);
      const bestStore = sample.best_store || "Amazon";

      setActiveComparison({
        lowest_price: lowest,
        lowest_store: bestStore,
        max_savings: original - lowest,
        products: [
          {
            store_name: "Amazon",
            title: `${sample.costume_name} (Prime Verified)`,
            price: bestStore.includes("Amazon") ? lowest : lowest + 350,
            original_price: original,
            discount_percent: bestStore.includes("Amazon") ? sample.discount_percent || 35 : 18,
            rating: 4.6,
            review_count: 2480,
            product_url: "https://www.amazon.in",
            affiliate_url: "https://www.amazon.in",
            image_url: sample.image_url,
            in_stock: true,
            delivery_info: "Next-Day Prime Delivery",
            is_lowest_price: bestStore.includes("Amazon"),
            badge: bestStore.includes("Amazon") ? "Lowest Price" : null
          },
          {
            store_name: "Myntra",
            title: `${sample.costume_name} - Runway Collection`,
            price: bestStore.includes("Myntra") ? lowest : lowest + 420,
            original_price: original,
            discount_percent: bestStore.includes("Myntra") ? sample.discount_percent || 30 : 15,
            rating: 4.5,
            review_count: 1450,
            product_url: "https://www.myntra.com",
            affiliate_url: "https://www.myntra.com",
            image_url: sample.image_url,
            in_stock: true,
            delivery_info: "2-3 business days",
            is_lowest_price: bestStore.includes("Myntra"),
            badge: bestStore.includes("Myntra") ? "Best Deal" : "Trending"
          },
          {
            store_name: "Ajio",
            title: `${sample.costume_name} Fashion Edit`,
            price: bestStore.includes("Ajio") ? lowest : lowest + 550,
            original_price: original,
            discount_percent: bestStore.includes("Ajio") ? sample.discount_percent || 28 : 12,
            rating: 4.3,
            review_count: 980,
            product_url: "https://www.ajio.com",
            affiliate_url: "https://www.ajio.com",
            image_url: sample.image_url,
            in_stock: true,
            delivery_info: "3-4 days standard",
            is_lowest_price: bestStore.includes("Ajio"),
            badge: bestStore.includes("Ajio") ? "Exclusive Price" : null
          },
          {
            store_name: "Zara",
            title: `${sample.costume_name} Signature Cut`,
            price: original + 200,
            original_price: original + 200,
            discount_percent: 0,
            rating: 4.7,
            review_count: 820,
            product_url: "https://www.zara.com",
            affiliate_url: "https://www.zara.com",
            image_url: sample.image_url,
            in_stock: true,
            delivery_info: "Express Shipping",
            is_lowest_price: false,
            badge: "Designer Cut"
          }
        ]
      });

      setIsLoading(false);
    }, 900);
  };

  // 1. Initial Loading Page when user opens the link:
  // Realistic Serpent emerges from 'S' letter, circles screen, enters 50mm x 50mm magnifying glass, reveals site!
  if (showIntro) {
    return <IntroLoadingScreen onComplete={() => setShowIntro(false)} />;
  }

  // 2. Initial Auth Loading State
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold text-brand-700 uppercase tracking-widest">Fashionsearch Auth</p>
      </div>
    );
  }

  // 3. If user is not authenticated with Google, show Login Screen
  if (!user) {
    return <LoginScreen onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className={`min-h-screen bg-brand-50 text-slate-800 ${isMobileFrame ? 'py-8 px-4 flex items-center justify-center' : ''}`}>
      {/* Search / Upload Processing Overlay */}
      {isLoading && <LoadingScreen statusMessage={loadingMessage} />}

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* App Shell: Mobile Frame mode or Full View */}
      <div className={`w-full ${isMobileFrame ? 'mobile-device-frame relative shadow-2xl flex flex-col' : 'max-w-2xl mx-auto min-h-screen flex flex-col'}`}>
        
        {/* Header with user profile and sign out */}
        <Header
          onOpenCam={() => setIsCameraOpen(true)}
          onReplayIntro={() => setShowIntro(true)}
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 pb-20">
          
          {/* Hero Banner */}
          {!activeAnalysis && (
            <div className="text-center my-4 sm:my-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-200 text-brand-700 text-xs font-semibold mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Hi, {user.displayName ? user.displayName.split(' ')[0] : 'Fashionista'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Snap Any Costume. <br />
                <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-brand-700 bg-clip-text text-transparent">
                  Find Lowest Price Across Stores.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Gemini AI detects color, length & style, then matches prices across Amazon, Myntra, Ajio & Zara.
              </p>
            </div>
          )}

          {/* Action Center: Upload or Take Pic */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              {/* Take a Pic (Camera) */}
              <button
                onClick={() => setIsCameraOpen(true)}
                className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-brand-600 to-sky-600 text-white shadow-lg shadow-brand-500/25 active:scale-98 hover:shadow-brand-500/40 transition duration-200"
              >
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md mb-2 group-hover:scale-110 transition">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-bold tracking-tight">Take a Pic</span>
                <span className="text-[11px] text-brand-100 font-medium">Live Camera</span>
              </button>

              {/* Upload a Costume Photo */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-white hover:bg-brand-50 border-2 border-dashed border-brand-300 text-slate-800 shadow-sm active:scale-98 transition duration-200"
              >
                <div className="p-3 rounded-2xl bg-brand-100 text-brand-600 mb-2 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold tracking-tight text-slate-900">Upload Pic</span>
                <span className="text-[11px] text-slate-500 font-medium">From Gallery</span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                />
              </button>
            </div>
          </div>

          {/* Demo Costumes Slideshow (Slides one after another with at least 4 outfits) */}
          {!activeAnalysis && (
            <CostumeSlideshow
              onSelectOutfit={handleSelectSample}
              isLoading={isLoading}
            />
          )}

          {/* Active Costume Analysis Card */}
          {activeAnalysis && (
            <div
              ref={analysisSectionRef}
              id="uploaded-product-location"
              className="animate-in fade-in duration-300 scroll-mt-24"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  AI Recognition Result
                </span>
                <button
                  onClick={() => {
                    setActiveAnalysis(null);
                    setActiveComparison(null);
                    setActiveImageUrl(null);
                  }}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                >
                  <RefreshCcw className="w-3 h-3" />
                  New Search
                </button>
              </div>

              <CostumeAnalysisCard
                analysis={activeAnalysis}
                imageUrl={activeImageUrl}
              />
            </div>
          )}

          {/* Multi-Store Price Comparison List */}
          {activeComparison && (
            <div className="animate-in fade-in duration-300">
              <PriceComparisonList comparison={activeComparison} />
            </div>
          )}

          {/* Recent Searches (Clean, no PG 17 Data text) */}
          {recentSearches.length > 0 && !activeAnalysis && (
            <div className="text-left mt-6">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  Recent Searches
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Saved History</span>
              </div>

              <div className="space-y-2">
                {recentSearches.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="glass-panel p-3 rounded-2xl flex items-center justify-between border border-brand-100 hover:bg-white transition"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full border border-slate-200"
                        style={{ backgroundColor: item.color_hex || '#38bdf8' }}
                      ></span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.costume_name}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {item.detected_color} • {item.detected_length}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">
                      {item.product_count || 4} Stores
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Mobile Sticky Footer (Clean, no PG 17 Data option) */}
        <footer className="sticky bottom-0 z-20 glass-panel border-t border-brand-100 py-2.5 px-4 text-center">
          <div className="flex items-center justify-around text-xs font-semibold text-slate-500">
            <button
              onClick={() => {
                setActiveAnalysis(null);
                setActiveComparison(null);
                setActiveImageUrl(null);
              }}
              className="flex flex-col items-center gap-0.5 text-brand-700 active:scale-95 transition"
            >
              <Search className="w-4 h-4" />
              <span className="text-[10px]">Explore</span>
            </button>

            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center justify-center -mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-brand-500 to-sky-400 text-white shadow-lg shadow-brand-500/30 active:scale-90 transition"
              title="Camera Lens"
            >
              <Camera className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowIntro(true)}
              className="flex flex-col items-center gap-0.5 hover:text-brand-700 active:scale-95 transition"
              title="Replay Serpent Intro"
            >
              <Play className="w-4 h-4 text-sky-500" />
              <span className="text-[10px]">Serpent Intro</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-rose-600 active:scale-95 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[10px]">Sign Out</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
