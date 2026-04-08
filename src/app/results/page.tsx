"use client";

import { useEffect, useState } from "react";
import { handleInterviewFinisher } from "@/app/actions";
import { CheckCircle2, ChevronLeft, Loader2, Star, Target, TrendingUp, XCircle, BrainCircuit, Award, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Evaluation {
  totalScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  detailedFeedback: {
    question: string;
    answer: string;
    score: number;
    comment: string;
  }[];
}

export default function ResultsPage() {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function evaluate() {
      const data = localStorage.getItem("interview_results");
      if (!data) {
        setError("No interview data found. Please start a new session.");
        setIsLoading(false);
        return;
      }

      const { role, history } = JSON.parse(data);
      const result = await handleInterviewFinisher(role, history);

      if (result.success && result.evaluation) {
        setEvaluation(result.evaluation);
      } else {
        setError(result.error || "Failed to analyze interview performance.");
      }
      setIsLoading(false);
    }

    evaluate();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 relative">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1)_0%,_transparent_50%)] pointer-events-none" />
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full" 
          />
          <div className="bg-white/5 p-8 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl relative z-10">
            <Loader2 className="animate-spin text-blue-400" size={84} />
            <BrainCircuit size={42} className="absolute inset-0 m-auto text-blue-400/50" />
          </div>
        </div>
        <div className="text-center relative z-10 max-w-sm">
          <h2 className="text-3xl font-black mb-4 gradient-text">Generating Intelligence Report</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Gemini is cross-referencing your semantic accuracy and technical depth against industry benchmarks.
          </p>
        </div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <div className="p-8 glass-card border-red-500/20 max-w-md">
          <XCircle size={64} className="text-red-500 mb-6 mx-auto" />
          <h2 className="text-2xl font-black mb-4">Analysis Failed</h2>
          <p className="text-gray-500 mb-8 font-medium">{error}</p>
          <Link href="/" className="btn-primary w-full justify-center">Return to Command Center</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-20 px-6 max-w-6xl mx-auto overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vh] pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-8">
        <Link href="/" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group">
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-[10px] tracking-widest uppercase">BACK TO DASHBOARD</span>
        </Link>
        <div className="flex items-center gap-3 px-6 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black tracking-widest uppercase">
          <Award size={16} /> PERFORMANCE REPORT GENERATED
        </div>
      </div>

      {/* Main Score & Summary: Premium Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 items-stretch">
        
        {/* Score Circle Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 glass-card flex flex-col items-center justify-center text-center p-12 border-blue-500/10 relative overflow-hidden group h-full"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(59,130,246,0.1)_0%,_transparent_60%)]" />
          
          <div className="relative mb-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative z-10"
            >
              <svg className="w-64 h-64 transform -rotate-90">
                <circle cx="128" cy="128" r="118" fill="none" stroke="currentColor" strokeWidth="16" className="text-white/5" />
                <motion.circle
                  cx="128" cy="128" r="118" fill="none" stroke="url(#gradientScore)" strokeWidth="16"
                  strokeDasharray={741}
                  initial={{ strokeDashoffset: 741 }}
                  animate={{ strokeDashoffset: 741 - (741 * evaluation.totalScore) / 100 }}
                  transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-black text-white tracking-tighter">{evaluation.totalScore}%</span>
                <span className="text-[12px] font-black text-blue-400 tracking-[0.3em] mt-2">TOTAL QUOTIENT</span>
              </div>
            </motion.div>
            <div className={`absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full transition-opacity duration-1000 ${evaluation.totalScore > 80 ? 'opacity-100' : 'opacity-20'}`} />
          </div>
          
          <p className="text-lg text-gray-400 leading-relaxed font-medium italic relative z-10">
            &ldquo;{evaluation.summary}&rdquo;
          </p>
        </motion.div>

        {/* Strengths & Weaknesses Stack */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 flex flex-col gap-10 h-full"
        >
          <div className="glass-card flex-grow p-10 border-white/5 bg-white/[0.02]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section>
                <h3 className="flex items-center gap-3 text-sm font-black text-green-400 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
                  <Sparkles size={18} /> PROMINENT STRENGTHS
                </h3>
                <ul className="space-y-6">
                  {evaluation.strengths.map((str, i) => (
                    <motion.li 
                      key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-4 text-gray-300 text-sm font-medium"
                    >
                      <div className="mt-1 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                      {str}
                    </motion.li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="flex items-center gap-3 text-sm font-black text-red-400 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
                  <Target size={18} /> GROWTH OPPORTUNITIES
                </h3>
                <ul className="space-y-6">
                  {evaluation.weaknesses.map((weak, i) => (
                    <motion.li 
                      key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-4 text-gray-300 text-sm font-medium"
                    >
                      <div className="mt-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                      {weak}
                    </motion.li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Conversation Analysis */}
      <div className="mb-12 flex items-center justify-between">
        <h2 className="text-4xl font-black tracking-tight">Conversation Lab</h2>
        <div className="text-[10px] font-black text-gray-500 tracking-widest uppercase">DEEP SEMANTIC BREAKDOWN</div>
      </div>

      <div className="flex flex-col gap-8 mb-32">
        {evaluation.detailedFeedback.map((fb, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-0 border-white/5 overflow-hidden group hover:border-blue-500/20"
          >
            <div className="p-8 flex flex-col lg:flex-row gap-10 items-stretch h-full">
              {/* Question Meta */}
              <div className="lg:w-1/3 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-10">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">QUESTION {idx + 1}</div>
                <h4 className="text-xl font-bold leading-snug mb-6 flex-grow">{fb.question}</h4>
                
                <div className="mt-auto flex items-center gap-4">
                   <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center group-hover:border-blue-500/40 transition-all">
                      <span className="text-xl font-black text-blue-400">{fb.score}</span>
                      <span className="text-[8px] font-black text-gray-600 uppercase">SCORE</span>
                   </div>
                   <div className="flex-grow h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${fb.score * 10}%` }}
                        viewport={{ once: true }}
                        className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                      />
                   </div>
                </div>
              </div>

              {/* Response Breakdown */}
              <div className="lg:w-2/3 flex flex-col gap-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">YOUR RESPONSE</span>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl italic text-gray-400 text-sm leading-relaxed">
                    &ldquo;{fb.answer}&rdquo;
                  </div>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                     <Zap size={14} className="text-blue-500" />
                     <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase">EVALUATOR INSIGHT</span>
                   </div>
                   <p className="text-gray-200 text-sm leading-relaxed font-medium">
                     {fb.comment}
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Retake Call to Action: Premium Float */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-12 text-center border-blue-500/20 relative overflow-hidden group shadow-3xl"
      >
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(59,130,246,0.05)_0%,_transparent_40%,_rgba(139,92,246,0.05)_100%)] group-hover:scale-110 transition-transform duration-1000" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-8 border border-blue-500/20 pulse-glow">
             <TrendingUp size={32} className="text-blue-400" />
          </div>
          <h2 className="text-5xl font-black mb-6 tracking-tighter">Ready for another simulation?</h2>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
            Practice is the only way to intuition. Switch roles or refine your current specialization to track your growth across sessions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/" className="btn-primary px-12 py-5 text-lg shadow-blue-500/40">
              New Specialization <Sparkles size={20} />
            </Link>
            <button 
              onClick={() => window.print()} 
              className="px-12 py-5 rounded-2xl glass-card font-black text-gray-400 hover:text-white border-white/10 hover:border-white/20 text-[10px] tracking-widest uppercase"
            >
              Export Analytics PDF
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
