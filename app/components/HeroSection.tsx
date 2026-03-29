"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const CarScene = dynamic(() => import("./CarScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  ),
});

const trustBadges = [
  { icon: "✓", label: "No Credit Check Required" },
  { icon: "⚡", label: "Same Day Approval" },
  { icon: "🏆", label: "99% Approval Rate" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <CarScene />
      </div>

      {/* Gradient overlay at bottom to blend into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen px-6 pt-20">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 text-sm text-blue-400 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Canada&apos;s #1 Bad Credit Auto Loan Service
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                <span className="text-white">Get Approved</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400 bg-clip-text text-transparent animate-gradient-shift">
                  Today.
                </span>
                <br />
                <span className="text-white/90 text-4xl md:text-5xl lg:text-6xl">
                  Bad Credit Welcome.
                </span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg md:text-xl text-white/60 leading-relaxed max-w-lg"
            >
              We work with <span className="text-white font-semibold">30+ Canadian lenders</span> to
              get you behind the wheel — regardless of your credit history.
              Fast, confidential, and completely free to apply.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#apply"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all duration-200 animate-pulse-glow hover:scale-105"
              >
                Apply Now — It&apos;s Free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-white/80 hover:text-white font-semibold text-lg transition-all duration-200 hover:border-white/20"
              >
                How It Works
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              {trustBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-white/50"
                >
                  <span className="text-blue-400 font-bold">{badge.icon}</span>
                  {badge.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {[
              { value: "30+", label: "Lending Partners", color: "blue" },
              { value: "99%", label: "Approval Rate", color: "amber" },
              { value: "24hr", label: "Fast Response", color: "blue" },
              { value: "$500M+", label: "Loans Funded", color: "amber" },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-colors duration-300"
              >
                <div
                  className={`text-3xl font-extrabold mb-1 ${
                    stat.color === "blue" ? "text-blue-400" : "text-amber-400"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
