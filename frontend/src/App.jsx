import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Sparkles, History, RefreshCcw, Search, ExternalLink, SlidersHorizontal, ArrowUpRight, Database } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import CameraModal from './components/CameraModal';
import CostumeAnalysisCard from './components/CostumeAnalysisCard';
import PriceComparisonList from './components/PriceComparisonList';
import Header from './components/Header';
import SampleCostumes from './components/SampleCostumes';
import PostgresExportModal from './components/PostgresExportModal';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Finding Costume & Comparing Store Prices...');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [activeComparison, setActiveComparison] = useState(null);
  const [activeImageUrl, setActiveImageUrl] = useState(null);

  const [samples, setSamples] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const fileInputRef = useRef(null);

  // Initial load: Fetch samples and initial search data
  useEffect(() => {
    fetch('/api/sample-costumes')
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(err => console.log('Could not load samples', err));

    fetch('/api/searches')
      .then(res => res.json())
      .then(data => setRecentSearches(data))
      .catch(err => console.log('Could not load recent searches', err));
  }, []);

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
      const response = await fetch('/api/search/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setActiveAnalysis(data.costume_analysis);
      setActiveComparison(data.comparison);
      if (data.image_url) {
        setActiveImageUrl(data.image_url);
      }

      // Refresh recent searches
      fetch('/api/searches')
        .then(r => r.json())
        .then(list => setRecentSearches(list));

    } catch (error) {
      console.error(error);
      alert("Error analyzing costume. Please try another image or pick one of the sample costumes!");
    } finally {
      // Artificial grace period to appreciate the water bar wave
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
      const response = await fetch('/api/search/base64', {
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
        setActiveImageUrl(data.image_url);
      }

      fetch('/api/searches')
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

  // Handle sample costume selection
  const handleSelectSample = (sample) => {
    setIsLoading(true);
    setLoadingMessage(`Finding deals for ${sample.costume_name}...`);
    setActiveImageUrl(sample.image_url);

    // Call API using sample's details
    setTimeout(async () => {
      try {
        // Fetch price comparison based on sample costume
        const fakeFileBlob = await fetch(sample.image_url).then(r => r.blob());
        const fakeFile = new File([fakeFileBlob], "sample.jpg", { type: "image/jpeg" });

        const formData = new FormData();
        formData.append('file', fakeFile);
        formData.append('source_type', 'sample');

        const resp = await fetch('/api/search/upload', {
          method: 'POST',
          body: formData,
        });

        if (resp.ok) {
          const resJson = await resp.json();
          setActiveAnalysis(resJson.costume_analysis || sample);
          setActiveComparison(resJson.comparison);
        } else {
          setActiveAnalysis(sample);
        }
      } catch (e) {
        setActiveAnalysis(sample);
      } finally {
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className={`min-h-screen bg-brand-50 text-slate-800 ${isMobileFrame ? 'py-8 px-4 flex items-center justify-center' : ''}`}>
      {/* Loading Overlay with F & S Snake logo and flowing Water Bar */}
      {isLoading && <LoadingScreen statusMessage={loadingMessage} />}

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* PostgreSQL 17 Export Modal */}
      <PostgresExportModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* App Shell: Mobile Frame mode or Full View */}
      <div className={`w-full ${isMobileFrame ? 'mobile-device-frame relative shadow-2xl flex flex-col' : 'max-w-2xl mx-auto min-h-screen flex flex-col'}`}>
        
        {/* Header */}
        <Header
          onOpenCam={() => setIsCameraOpen(true)}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 pb-20">
          
          {/* Hero Banner / Instructions */}
          {!activeAnalysis && (
            <div className="text-center my-4 sm:my-6">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-brand-200 text-brand-700 text-xs font-semibold mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                AI Visual Fashion Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Snap Any Costume. <br />
                <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-brand-700 bg-clip-text text-transparent">
                  Find Lowest Price Across Stores.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Gemini AI detects color, length & style, then matches prices across Amazon, Myntra, Ajio, Zara & more.
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

          {/* Active Costume Analysis Card */}
          {activeAnalysis && (
            <div className="animate-in fade-in duration-300">
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

          {/* Quick Demo Samples (Visible when no active analysis or at bottom) */}
          <SampleCostumes
            samples={samples}
            onSelectSample={handleSelectSample}
            isLoading={isLoading}
          />

          {/* Recent Searches Saved to PostgreSQL */}
          {recentSearches.length > 0 && !activeAnalysis && (
            <div className="text-left mt-6">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  Recent Searches (PostgreSQL 17)
                </h3>
                <button
                  onClick={() => setIsSqlModalOpen(true)}
                  className="text-[11px] font-semibold text-brand-600 hover:underline"
                >
                  View SQL Dump
                </button>
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
                      {item.product_count || 6} Stores
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Mobile Sticky Footer */}
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
              onClick={() => setIsSqlModalOpen(true)}
              className="flex flex-col items-center gap-0.5 hover:text-brand-700 active:scale-95 transition"
            >
              <Database className="w-4 h-4 text-slate-400" />
              <span className="text-[10px]">PG 17 Data</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
