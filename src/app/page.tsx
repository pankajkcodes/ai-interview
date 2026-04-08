"use client";

import { INTERVIEW_ROLES } from "@/lib/gemini";
import Link from "next/link";
import { ArrowRight, Mic, Video, Sparkles, ShieldCheck, Cpu, Trophy, MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="pt-40 pb-32 no-underline">
      {/* Hero Section */}
      <section className="relative z-10 text-center mb-32 max-w-5xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold mb-10 tracking-widest uppercase mx-auto w-fit"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>Next-Generation AI Evaluation</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-8xl font-black mb-10 gradient-text tracking-tighter"
        >
          Ace Your Next <br /> Technical Interview.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-gray-400 text-2xl mb-16 leading-relaxed max-w-3xl mx-auto font-light"
        >
          Experience zero-latency simulations powered by **Gemini 3 Flash**. 
          Get instant, industry-standard feedback tailored to your career trajectory.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <Link href="#specializations" className="btn-primary no-underline">
            Start Free Session <ArrowRight size={20} />
          </Link>
          <button className="btn-secondary">
            View Sample Feedback
          </button>
        </motion.div>
      </section>

      {/* Trust Bar / Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 mb-40">
        <div className="grid grid-cols-1 md-grid-cols-3 gap-8">
          {[
            { icon: Video, title: "Pro Environment", desc: "Studio-quality video & audio simulations.", color: "text-blue-400" },
            { icon: Mic, title: "Voice Logic", desc: "Advanced NLP for natural technical discussions.", color: "text-purple-400" },
            { icon: ShieldCheck, title: "Real-time Scoring", desc: "Instant evaluation based on FAANG rubrics.", color: "text-emerald-400" }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-10 group"
            >
              <feature.icon className={`${feature.color} mb-6 transition-transform`} size={32} />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Role Selection Grid */}
      <section id="specializations" className="w-full relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md-flex-row items-center justify-between mb-16 border-b border-white/10 pb-10">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black mb-6">Select Specialization</h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
                Choose your focus area. Our AI adaptive engine generates unique questions 
                based on real-world scenarios for each specific role.
              </p>
            </div>
            <div className="stat-badge">
              <Trophy size={16} className="text-yellow-500" style={{ opacity: 0.5 }} /> 12.4k Simulations Completed
            </div>
          </header>

          <div className="role-grid">
            {INTERVIEW_ROLES.map((role, idx) => (
              <motion.div 
                key={role.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Link 
                  href={`/interview?role=${role.id}`} 
                  className="glass-card flex flex-col h-full group no-underline text-inherit relative overflow-hidden p-0 border-white/10"
                >
                  {/* Role Accent Header */}
                  <div className="role-card-header" style={{ background: role.bgGradient }} />
                  
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-8">
                       <div className="icon-container relative overflow-hidden" style={{ width: '3.5rem', height: '3.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Cpu size={28} className="text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                      <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all">
                         <MousePointerClick size={20} className="text-blue-500" style={{ opacity: 0.5 }} />
                      </div>
                    </div>

                    <h3 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors uppercase tracking-tight no-underline">
                      {role.name}
                    </h3>
                    
                    <p className="text-gray-500 text-base leading-relaxed mb-10 flex-grow font-medium">
                      {role.description}
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-white/10 group-hover:border-white/20 transition-colors">
                      <span className="text-xs font-black tracking-widest text-blue-500 uppercase group-hover:text-white transition-colors" style={{ opacity: 0.8 }}>
                        Ready to Begin
                      </span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                        <ArrowRight size={16} className="text-blue-500 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </main>
  );
}
