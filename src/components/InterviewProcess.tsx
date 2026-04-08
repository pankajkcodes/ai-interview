"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Send, AlertCircle, Loader2, StopCircle, Video, VideoOff, MessageSquare, Sparkles, X } from "lucide-react";
import { handleInterviewStep, handleInterviewFinisher } from "@/app/actions";
import { useRouter } from "next/navigation";
import AIInterviewerVisual from "./AIInterviewerVisual";
import { motion, AnimatePresence } from "framer-motion";
import "../app/interview/interview.css";
import { getAIConfig } from "@/lib/storage";

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
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  const recognitionRef = useRef<any>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
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
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
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
      const config = getAIConfig() || undefined;
      const result = await handleInterviewStep(role, { questionIndex: index, previousQA: history }, config);
      if (result.success && result.content) {
        if (result.content.includes("INTERVIEW_COMPLETE")) {
          localStorage.setItem("interview_results", JSON.stringify({ role, history }));
          const evaluationResult = await handleInterviewFinisher(role, history, config);
          if (evaluationResult.success) {
            localStorage.setItem("interview_evaluation", JSON.stringify(evaluationResult.evaluation));
          }
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
    setFeedback(null);
    const newHistory = [...previousQA, { question: currentQuestion, answer }];
    setPreviousQA(newHistory);
    setAnswer("");
    if (questionIndex < 4) {
      setQuestionIndex(prev => prev + 1);
      startStep(questionIndex + 1, newHistory);
    } else {
      startStep(questionIndex + 1, newHistory);
    }
  };

  // Ask AI for quick feedback on the current answer without advancing
  const handleAskFeedback = async () => {
    if (!answer.trim() || isFeedbackLoading) return;
    setIsFeedbackLoading(true);
    setFeedback(null);
    try {
      const config = getAIConfig() || undefined;
      const prompt = `You are a technical interviewer. The candidate was asked: "${currentQuestion}". Their answer was: "${answer}". Give brief, constructive feedback in 2-3 sentences. Focus on what was good and one thing to improve.`;
      const result = await handleInterviewStep(prompt, { questionIndex: 0, previousQA: [] }, config);
      if (result.success && result.content) {
        setFeedback(result.content);
      } else {
        setFeedback("Could not get feedback. Please check your API key in Console Setup.");
      }
    } catch {
      setFeedback("Failed to get feedback. Please try again.");
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const hasAnswer = answer.trim().length > 0 && !isListening;

  return (
    <div className="iv-room-container">
      <div className="iv-viewport">
        <AIInterviewerVisual isSpeaking={isSpeaking} isLoading={isLoading} />

        {/* Bottom-left AI label */}
        <div className="video-overlay-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: isSpeaking ? '#60a5fa' : '#374151', transition: 'background 0.3s' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>Gemini Advanced</span>
        </div>

        {/* Top-right session chips */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 20, display: 'flex', gap: '0.5rem' }}>
          <div style={{ padding: '0.3rem 0.8rem', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.12em', color: '#60a5fa', textTransform: 'uppercase' }}>Q {questionIndex + 1} / 5</span>
          </div>
          <div style={{ padding: '0.3rem 0.8rem', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}>{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {/* Current Question caption */}
        <AnimatePresence mode="wait">
          {showTranscript && !isLoading && currentQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{ position: 'absolute', left: '2rem', right: '2rem', bottom: '2rem', zIndex: 30, display: 'flex', justifyContent: 'center' }}
            >
              <div style={{ background: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem 1.75rem', borderRadius: '1.5rem', maxWidth: '48rem', width: '100%' }}>
                <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, fontWeight: 500, margin: 0 }}>{currentQuestion}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading / Error Overlay */}
        <AnimatePresence>
          {(isLoading || error) && (
            <div className="iv-overlay-full">
              {error ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', background: '#0a0a0a', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '1.5rem', maxWidth: '26rem', width: '90%' }}>
                  <AlertCircle color="#ef4444" size={40} style={{ margin: '0 auto 1.25rem', display: 'block' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Neural Error</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>{error}</p>
                  <button onClick={() => startStep(questionIndex, previousQA)} className="btn-primary u-w-full u-justify-center" style={{ fontSize: '0.8125rem', padding: '0.875rem' }}>
                    Reinitialize Link
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 color="#3b82f6" size={48} />
                  </motion.div>
                  <span style={{ fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.35em', color: '#60a5fa', textTransform: 'uppercase' }}>Processing Question</span>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Feedback Panel */}
        <AnimatePresence>
          {(feedback || isFeedbackLoading) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ position: 'absolute', top: '5rem', right: '1.5rem', zIndex: 100, width: '22rem', background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '1.25rem', padding: '1.25rem', boxShadow: '0 0 40px rgba(139,92,246,0.1), 0 20px 40px rgba(0,0,0,0.6)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={14} color="#a78bfa" />
                  <span style={{ fontSize: '0.5625rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a78bfa' }}>AI Feedback</span>
                </div>
                <button onClick={() => setFeedback(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: '0.25rem' }}>
                  <X size={14} />
                </button>
              </div>
              {isFeedbackLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 size={16} color="#a78bfa" />
                  </motion.div>
                  <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>Analyzing your answer...</span>
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, margin: 0 }}>{feedback}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <div className="iv-control-bar">

        {/* Left: Mute / Video */}
        <div className="iv-source-group">
          <button className={`iv-btn ${isMuted ? 'danger' : ''}`} onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            <span className="iv-btn-text">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
          <button className={`iv-btn ${isVideoOff ? 'danger' : ''}`} onClick={() => setIsVideoOff(!isVideoOff)}>
            {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
            <span className="iv-btn-text">{isVideoOff ? 'Start' : 'Stop'}</span>
          </button>
        </div>

        {/* Center Hub */}
        <div className="iv-interaction-hub">

          <button className={`iv-btn ${showTranscript ? 'active' : ''}`} onClick={() => setShowTranscript(!showTranscript)}>
            <MessageSquare size={17} />
            <span className="iv-btn-text">Captions</span>
          </button>

          <div className="iv-hub-divider" />

          {isListening ? (
            <button className="iv-primary-action recording" onClick={toggleListening}>
              <StopCircle size={19} />
              <span className="iv-btn-text" style={{ color: 'rgba(255,255,255,0.9)' }}>Stop</span>
            </button>
          ) : (
            <button disabled={isLoading} className="iv-primary-action ready" onClick={toggleListening}>
              <Mic size={19} />
              <span className="iv-btn-text" style={{ color: 'rgba(255,255,255,0.9)' }}>{answer ? 'Re-rec' : 'Record'}</span>
            </button>
          )}

          <div className="iv-hub-divider" />

          <button
            disabled={!hasAnswer || isFeedbackLoading}
            onClick={handleAskFeedback}
            className="iv-btn"
            style={hasAnswer ? { background: 'rgba(139,92,246,0.12)', borderColor: 'rgba(139,92,246,0.3)', color: '#a78bfa' } : {}}
          >
            <Sparkles size={17} />
            <span className="iv-btn-text" style={{ color: hasAnswer ? '#a78bfa' : undefined }}>Ask AI</span>
          </button>

          <div className="iv-hub-divider" />

          <button
            disabled={!hasAnswer || isLoading}
            onClick={handleSubmitAnswer}
            className="iv-btn"
            style={hasAnswer ? { background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' } : {}}
          >
            <Send size={17} />
            <span className="iv-btn-text" style={{ color: hasAnswer ? '#10b981' : undefined }}>Submit</span>
          </button>

        </div>

        {/* Right: Exit */}
        <div className="iv-management-group">
          <button onClick={() => router.push("/")} className="iv-exit-btn">Exit</button>
        </div>
      </div>

      {/* Live transcript toast */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="iv-toast"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '0.5625rem', fontWeight: 900, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Live Signal</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500, lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
              "{answer || 'Listening...'}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
