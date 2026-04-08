"use client";

import { useEffect, useRef, useState } from "react";
import { Video, VideoOff, User } from "lucide-react";

export default function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 }, 
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera access denied. Please check your browser permissions.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-[#0d1117] overflow-hidden flex items-center justify-center p-4">
      {error ? (
        <div className="w-full flex flex-col items-center justify-center bg-black/40 text-red-400 p-8 text-center rounded-2xl">
          <VideoOff size={48} className="mb-4 opacity-50 transition-opacity group-hover:opacity-100" />
          <p className="font-bold tracking-tight">{error}</p>
        </div>
      ) : (
        <div 
          className="relative bg-black rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          style={{ width: '100%', aspectRatio: '16/9', maxHeight: '100%' }}
        >
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
          />
          
          {/* Status Overlay - Top Right */}
          <div className="absolute top-4 right-4 z-20 flex animate-in fade-in duration-700">
             <div className="px-3 py-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-black tracking-widest text-white/90 uppercase">LIVE FEED</span>
             </div>
          </div>

          {/* Candidate Badge - Bottom Left */}
          <div className="absolute bottom-4 left-4 z-20 animate-in slide-in-from-bottom-2 duration-700">
             <div className="px-3 py-1.5 bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-lg flex items-center gap-2">
                <User size={12} className="text-blue-400" />
                <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">CANDIDATE</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
