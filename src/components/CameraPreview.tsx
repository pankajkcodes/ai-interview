"use client";

import { useEffect, useRef, useState } from "react";
import { VideoOff, User, Wifi } from "lucide-react";
import { motion } from "framer-motion";

export default function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720, facingMode: "user" }, 
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => setIsReady(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Camera access denied.");
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
    <div style={{
      position: 'absolute', inset: 0,
      background: '#080c10',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {error ? (
        /* ── No camera state ── */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', gap: '1rem', padding: '1.5rem' }}>
          {/* Avatar placeholder */}
          <div style={{
            width: '5rem', height: '5rem', borderRadius: '50%',
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '0.5rem',
          }}>
            <User size={32} color="rgba(59,130,246,0.5)" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>No Camera</p>
            <p style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>Enable camera access<br />in browser settings</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: 'rgba(218,54,51,0.08)', border: '1px solid rgba(218,54,51,0.2)', borderRadius: '999px' }}>
            <VideoOff size={10} color="#da3633" />
            <span style={{ fontSize: '0.5625rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#da3633' }}>Offline</span>
          </div>
        </div>
      ) : (
        /* ── Live camera view ── */
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
              opacity: isReady ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />

          {/* Loading shimmer while camera warms up */}
          {!isReady && (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #080c10 0%, #0d1117 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
              >
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="rgba(59,130,246,0.4)" />
                </div>
                <span style={{ fontSize: '0.5625rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Starting camera...</span>
              </motion.div>
            </div>
          )}

          {/* Top-right: LIVE badge */}
          {isReady && (
            <div style={{ position: 'absolute', top: '0.875rem', right: '0.875rem', zIndex: 20, display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px' }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', background: '#ef4444' }}
              />
              <span style={{ fontSize: '0.5625rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>Live</span>
            </div>
          )}

          {/* Bottom gradient scrim */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5rem', background: 'linear-gradient(to top, rgba(8,12,16,0.9), transparent)', zIndex: 10, pointerEvents: 'none' }} />

          {/* Bottom-left: CANDIDATE badge */}
          <div style={{ position: 'absolute', bottom: '0.875rem', left: '0.875rem', zIndex: 20, display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'rgba(59,130,246,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '999px' }}>
            <User size={10} color="#60a5fa" />
            <span style={{ fontSize: '0.5625rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#60a5fa' }}>Candidate</span>
          </div>

          {/* Bottom-right: signal strength */}
          <div style={{ position: 'absolute', bottom: '0.875rem', right: '0.875rem', zIndex: 20, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Wifi size={10} color="rgba(16,185,129,0.7)" />
            <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(16,185,129,0.7)' }}>HD</span>
          </div>
        </div>
      )}
    </div>
  );
}
