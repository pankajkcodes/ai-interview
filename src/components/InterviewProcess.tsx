"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Send, Volume2, AudioLines, AlertCircle, RefreshCcw, Loader2, StopCircle, User, MoreHorizontal, Video, VideoOff, Layout, LogOut, MessageSquare, Sparkles } from "lucide-react";
import { handleInterviewStep } from "@/app/actions";
import { useRouter } from "next/navigation";
import AIInterviewerVisual from "./AIInterviewerVisual";
import { motion, AnimatePresence } from "framer-motion";
import "../app/interview/interview.css";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface InterviewProcessProps {
  role: string;
}

export default function InterviewProcess({ role }: InterviewProcessProps) {
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousQA, setPreviousQA] = useState<{ question: string, answer: string }[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);

  const recognitionRef = useRef<any>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    // Stabilized Initial Start
    if (!hasStarted.current) {
        hasStarted.current = true;
        startStep(0, []);
    }
  }, []);

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startStep = async (index: number, history: { question: string, answer: string }[]) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`[Interview] Fetching step ${index} for ${role}...`);
      const result = await handleInterviewStep(role, { questionIndex: index, previousQA: history });
      
      if (result.success && result.content) {
        if (result.content.includes("INTERVIEW_COMPLETE")) {
          localStorage.setItem("interview_results", JSON.stringify({ role, history }));
          router.push("/results");
          return;
        }
        setCurrentQuestion(result.content);
        speak(result.content);
      } else {
        setError(result.error || "Neural link synchronization failed.");
      }
    } catch (e) {
      setError("AI Engine connection lost. Please verify your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setAnswer("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    const newHistory = [...previousQA, { question: currentQuestion, answer }];
    setPreviousQA(newHistory);
    setAnswer("");
    if (questionIndex < 4) {
      setQuestionIndex(prev => prev + 1);
      startStep(questionIndex + 1, newHistory);
    } else {
      localStorage.setItem("interview_results", JSON.stringify({ role, history: newHistory }));
      router.push("/results");
    }
  };

  return (
    <div className="iv-room-container">
      
      <div className="iv-viewport">
        <AIInterviewerVisual isSpeaking={isSpeaking} isLoading={isLoading} />
        
        {/* Overlays */}
        <div className="video-overlay-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-xs font-bold text-white tracking-wide">Gemini Advanced</span>
        </div>

        <div className="absolute top-6 right-6 z-20 flex gap-4">
           <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
              <span className="text-[10px] font-black tracking-widest text-blue-400">SESSION: 0{questionIndex + 1}</span>
           </div>
           <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
              <span className="text-[10px] font-black tracking-widest text-white/30">{formatTime(elapsedTime)}</span>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {showTranscript && !isLoading && currentQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-x-10 bottom-10 z-30"
            >
              <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-3xl max-w-2xl mx-auto">
                 <p className="text-base text-white/80 leading-relaxed font-medium">
                   {currentQuestion}
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(isLoading || error) && (
            <div className="iv-overlay-full">
              {error ? (
                <div className="text-center p-12 bg-black border border-red-500/20 rounded-3xl max-w-sm">
                  <AlertCircle className="text-red-500 mx-auto mb-6" size={48} />
                  <h4 className="text-xl font-black text-white uppercase mb-2">Neural Error</h4>
                  <p className="text-sm text-gray-500 mb-10 leading-relaxed">{error}</p>
                  <button onClick={() => startStep(questionIndex, previousQA)} className="btn-primary w-full u-justify-center">REINITIALIZE LINK</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <Loader2 className="animate-spin text-blue-500" size={64} />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase">Constructing Scene</span>
                    <span className="text-[8px] font-bold text-white/10 uppercase tracking-[0.2em] mt-1">Protocol Secured</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid-Based Control Bar */}
      <div className="iv-control-bar">
        
        {/* Left: Sources */}
        <div className="iv-source-group">
          <button className={`iv-btn ${isMuted ? 'danger active' : ''}`} onClick={() => setIsMuted(!isMuted)}>
             <div className="iv-btn-icon">{isMuted ? <MicOff size={22} /> : <Mic size={22} />}</div>
             <span className="iv-btn-text">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
          <button className={`iv-btn ${isVideoOff ? 'danger active' : ''}`} onClick={() => setIsVideoOff(!isVideoOff)}>
             <div className="iv-btn-icon">{isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}</div>
             <span className="iv-btn-text">{isVideoOff ? 'Start' : 'Stop'}</span>
          </button>
        </div>

        {/* Center: Interaction */}
        <div className="iv-interaction-hub">
          <button className={`iv-btn ${showTranscript ? 'active' : ''}`} onClick={() => setShowTranscript(!showTranscript)}>
             <div className="iv-btn-icon"><MessageSquare size={22} /></div>
             <span className="iv-btn-text">Captions</span>
          </button>

          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.05)', margin: '0 8px' }} />

          {isListening ? (
             <button className="iv-btn iv-primary-action recording" onClick={toggleListening}>
                <StopCircle size={24} />
                <span className="text-[9px] font-black uppercase">Recording...</span>
             </button>
          ) : (
             <button
               disabled={isLoading}
               className="iv-btn iv-primary-action ready"
               onClick={toggleListening}
             >
                <Mic size={24} />
                <span className="text-[9px] font-black uppercase">Record Answer</span>
             </button>
          )}

          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.05)', margin: '0 8px' }} />

          <button
            disabled={!answer.trim() || isLoading}
            className={`iv-btn ${!answer.trim() ? 'opacity-20' : ''}`}
            onClick={handleSubmitAnswer}
          >
             <div className="iv-btn-icon" style={{ color: '#10b981' }}><Send size={22} /></div>
             <span className="iv-btn-text" style={{ color: '#10b981' }}>Submit</span>
          </button>
        </div>

        {/* Right: Management */}
        <div className="iv-management-group">
           <button 
             onClick={() => router.push("/")}
             className="px-8 py-3 bg-[#da3633]/10 border border-[#da3633]/20 hover:bg-[#da3633] text-[#da3633] hover:text-white rounded-xl text-[10px] font-black tracking-[0.2em] transition-all"
           >
             EXIT SESSION
           </button>
        </div>

      </div>

      {/* Voice Transcript Floating */}
      <AnimatePresence>
        {isListening && (
          <div className="iv-toast">
             <div className="flex items-center gap-2 mb-3">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
               <span className="text-[9px] font-black text-white/40 tracking-widest uppercase">Live Signal</span>
             </div>
             <p className="text-sm text-white/90 font-medium leading-relaxed italic">
               "{answer || 'Waiting for audio signal...'}"
             </p>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
