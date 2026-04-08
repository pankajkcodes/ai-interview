"use client";

import { useSearchParams } from "next/navigation";
import CameraPreview from "@/components/CameraPreview";
import InterviewProcess from "@/components/InterviewProcess";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Maximize2, ShieldCheck, Loader2 } from "lucide-react";

function InterviewContent() {
  const searchParams = useSearchParams();
  const roleId = searchParams.get("role") || "flutter";

  return (
    <main style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      
      {/* 1. Main Application Substrate */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0a0a0a',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.8)'
        }}
      >
        
        {/* Top Header - Using Inline Style for Absolute Safety */}
        <div style={{
            height: '64px',
            background: '#0d1117',
            borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.1)', marginLeft: '8px' }} />
            <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.3em', color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase' }}>
                Secure Interview Room
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '99px', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={14} className="text-emerald-500" />
              <span style={{ fontSize: '9px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Identity Verified</span>
            </div>
            <Maximize2 size={16} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
 
        {/* 2. Symmetrical View Grid */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', padding: '16px', gap: '16px', background: '#030303' }}>
            
            {/* AI Side */}
            <div style={{ flex: 1, position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', background: '#0d1117', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <InterviewProcess role={roleId} />
            </div>

            {/* Candidate Side */}
            <div style={{ flex: 1, position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', background: '#0d1117', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <CameraPreview />
            </div>

        </div>

      </motion.div>
    </main>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={
      <div style={{ position: 'fixed', inset: 0, background: '#030303', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <Loader2 color="#3b82f6" size={48} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.5625rem', fontWeight: 900, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Establishing Encrypted Link</span>
      </div>
    }>
      <InterviewContent />
    </Suspense>
  );
}
