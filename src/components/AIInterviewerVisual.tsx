"use client";

import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

interface AIInterviewerVisualProps {
  isSpeaking: boolean;
  isLoading: boolean;
}

export default function AIInterviewerVisual({ isSpeaking, isLoading }: AIInterviewerVisualProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0d1117] group overflow-hidden">
      
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] transition-all duration-1000 blur-[120px] rounded-full 
          ${isSpeaking ? 'bg-blue-500/10 scale-110' : 'bg-blue-600/[0.03] scale-100'}`} 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      {/* Central Visual Core */}
      <motion.div
        animate={isSpeaking ? { 
          scale: [1, 1.02, 1],
        } : { 
          scale: 1,
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 p-16 rounded-full border border-white/[0.03] bg-white/[0.01] backdrop-blur-3xl shadow-[0_0_100px_rgba(59,130,246,0.05)]"
      >
        <div className="relative">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <BrainCircuit size={100} className="text-blue-500/20" />
            </motion.div>
          ) : (
            <BrainCircuit 
              size={100} 
              className={`transition-all duration-700 ${isSpeaking ? 'text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-white/10'}`} 
            />
          )}

          {/* Voice Waveform Indicator */}
          {isSpeaking && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 h-10">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [12, 32, 12] }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-1.5 bg-blue-400/80 rounded-full"
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Top Left Identity */}
      <div className="absolute top-10 left-10 flex flex-col gap-1">
        <span className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase opacity-50">Virtual Interviewer</span>
        <span className="text-sm font-bold text-white/40 tracking-tight">Gemini Advanced Core</span>
      </div>

      {/* Bottom Status Hub */}
      <motion.div 
        animate={isSpeaking ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 flex items-center gap-3 px-5 py-2 bg-white/[0.03] backdrop-blur-md rounded-full border border-white/5"
      >
        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500' : isSpeaking ? 'bg-blue-400 animate-pulse' : 'bg-emerald-500/40'}`} />
        <span className="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">
          {isLoading ? 'Processing Knowledge' : isSpeaking ? 'Transmitting Data' : 'Monitoring Input'}
        </span>
      </motion.div>
      
    </div>
  );
}
