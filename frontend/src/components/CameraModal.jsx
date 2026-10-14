import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Zap, Sparkles, AlertCircle } from 'lucide-react';

export default function CameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // Default to rear camera for costumes
  const [error, setError] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported on this device/browser.");
      }

      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 1920 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Could not start live video stream:", err);
      setError("Camera access unavailable or blocked. You can still take a picture using your mobile camera button below!");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current) return;

    // Flash animation
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();
    onCapture(dataUrl, 'camera');
    onClose();
  };

  const handleFallbackFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        stopCamera();
        onCapture(reader.result, 'camera');
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between items-center text-white safe-paddings">
      {/* Top Controls Bar */}
      <div className="w-full max-w-md px-5 pt-6 pb-3 flex items-center justify-between z-20">
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md active:scale-95 transition"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-semibold tracking-wide text-brand-200 uppercase">Costume Lens</h2>
          <p className="text-[11px] text-white/70">Point at dress, jacket, or outfit</p>
        </div>

        <button
          onClick={handleFlipCamera}
          className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md active:scale-95 transition"
          title="Flip Camera"
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Viewfinder */}
      <div className="relative w-full max-w-md flex-1 mx-auto flex items-center justify-center overflow-hidden px-4">
        {/* Shutter flash screen */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-40 transition-opacity duration-200"></div>
        )}

        {error ? (
          <div className="glass-panel text-slate-800 p-6 rounded-3xl mx-4 text-center max-w-sm">
            <AlertCircle className="w-12 h-12 text-brand-600 mx-auto mb-3" />
            <h3 className="font-bold text-base mb-1 text-slate-900">Live Camera Fallback</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">{error}</p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white font-medium rounded-2xl shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition"
            >
              <Camera className="w-4 h-4" />
              Open Device Camera
            </button>
          </div>
        ) : (
          <div className="relative w-full h-[70vh] max-h-[580px] rounded-3xl overflow-hidden border-2 border-brand-300/40 shadow-2xl bg-slate-900">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Scanning Focus Corners */}
            <div className="absolute inset-6 pointer-events-none border border-white/20 rounded-2xl">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-400 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-400 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-400 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-400 rounded-br-xl"></div>

              {/* Center Target Scan Laser */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_10px_#38bdf8] animate-pulse"></div>

              {/* Guide Tag */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-medium text-white/90 whitespace-nowrap">
                Fit entire costume in frame
              </div>
            </div>
          </div>
        )}

        {/* Hidden mobile camera file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFallbackFileInput}
        />
      </div>

      {/* Bottom Shutter Controls */}
      <div className="w-full max-w-md px-6 pb-8 pt-4 flex items-center justify-around z-20">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center text-xs text-white/80 active:scale-95 transition"
        >
          <div className="p-3 rounded-full bg-white/15 backdrop-blur-md mb-1">
            <Sparkles className="w-5 h-5 text-brand-300" />
          </div>
          <span>Native Cam</span>
        </button>

        {/* Big Shutter Button */}
        <button
          onClick={handleCapture}
          className="relative group p-1.5 rounded-full border-4 border-white active:scale-90 transition duration-150"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600 shadow-[0_0_20px_rgba(56,189,248,0.6)] group-hover:from-brand-300 group-hover:to-brand-500 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-white/60"></div>
          </div>
        </button>

        <button
          onClick={startCamera}
          className="flex flex-col items-center text-xs text-white/80 active:scale-95 transition"
        >
          <div className="p-3 rounded-full bg-white/15 backdrop-blur-md mb-1">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
}
