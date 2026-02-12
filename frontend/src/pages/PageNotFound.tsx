import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Rocket, ChevronRight } from "lucide-react";

const PageNotFound: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#000814] px-4 overflow-hidden">
      
      {/* 1. CINEMATIC BACKGROUND ELEMENTS */}
      {/* Animated Glowing Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -60, 0],
          y: [0, 40, 0] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" 
      />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* 2. MAIN 3D INTERACTIVE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ rotateY: 5, rotateX: -5 }}
        className="relative w-full max-w-lg bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-14 text-center shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-10"
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        {/* Floating Rocket Icon */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block mb-4 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner"
        >
          <Rocket className="text-cyan-400" size={40} />
        </motion.div>

        {/* 404 Glitch Text */}
        <div className="relative inline-block">
          <motion.h1
            className="text-[100px] sm:text-[140px] font-black leading-none tracking-tighter text-white"
            style={{ textShadow: "0 0 20px rgba(34,211,238,0.5)" }}
          >
            404
          </motion.h1>
          <motion.span 
             animate={{ opacity: [0, 1, 0] }}
             transition={{ repeat: Infinity, duration: 0.1, repeatDelay: 2 }}
             className="absolute top-0 left-0 text-[100px] sm:text-[140px] font-black leading-none tracking-tighter text-purple-500 opacity-70 -translate-x-1"
          >
            404
          </motion.span>
        </div>

        {/* Subtext */}
        <div className="mt-4 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Lost in Space?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
            The coordinates you provided lead to a black hole. Let's get you back to safety.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link
              to="/"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_15px_30px_rgba(34,211,238,0.3)] hover:shadow-cyan-400/50 transition-all duration-300"
            >
              <Home size={20} />
              MISSION CONTROL
            </Link>
          </motion.div>

          <motion.button 
            whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white border border-white/10 transition-all w-full sm:w-auto"
          >
            GO BACK <ChevronRight size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Particles/Stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: Math.random() 
          }}
          animate={{ 
            y: [null, Math.random() * -100],
            opacity: [0.2, 0.8, 0.2] 
          }}
          transition={{ 
            duration: Math.random() * 5 + 5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
        />
      ))}
    </div>
  );
};

export default PageNotFound;