"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Settings } from "lucide-react";
import SettingsModal from "./SettingsModal";

export default function Navbar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  if (pathname !== "/") return null;

  return (
    <>
      <div className="nav-pill">
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="nav-container"
        >
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              AI INTERVIEWER
            </span>
          </Link>
          
          <div className="nav-links">
            <Link href="#features" className="nav-link" style={{ color: '#9ca3af', fontWeight: 600, fontSize: '0.875rem' }}>Features</Link>
            <Link href="#specializations" className="nav-link" style={{ color: '#9ca3af', fontWeight: 600, fontSize: '0.875rem' }}>Specializations</Link>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: '#9ca3af',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '0.75rem',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Settings size={16} /> Console Setup
            </button>
          </div>
        </motion.nav>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
