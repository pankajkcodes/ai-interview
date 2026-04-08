"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  
  if (pathname !== "/") return null;

  return (
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
          <Link href="#features" className="nav-link">Features</Link>
          <Link href="#specializations" className="nav-link">Specializations</Link>
          <Link href="#results" className="nav-link">Past Results</Link>
          <button className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}>Sign In</button>
        </div>
      </motion.nav>
    </div>
  );
}
