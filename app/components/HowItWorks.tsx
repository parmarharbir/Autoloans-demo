"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Apply Online",
    description:
      "Fill out our secure 2-minute application. No SIN number required, no hard credit checks — just the basics to get started.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M9 12h6M9 16h6M9 8h6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "blue",
  },
  {
    step: "02",
    title: "Get Approved",
    description:
      "Our team matches you with lenders from our network of 30+ partners. We specialize in bad credit, no credit, and even recent bankruptcies.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "amber",
  },
  {
    step: "03",
    title: "Drive Away",
    description:
      "Pick your vehicle from thousands of options across Canada. Sign your paperwork and drive away — often the same day.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M3 11L5 5h14l2 6M3 11v6h2m14 0h2v-6M3 11h18M7 17a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "blue",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
            How It{" "}
            <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Getting approved for your car loan takes just minutes. Here&apos;s
            how our streamlined process works.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[calc(16.6%+2rem)] right-[calc(16.6%+2rem)] h-px bg-gradient-to-r from-blue-500/50 via-amber-500/50 to-blue-500/50" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step number circle */}
              <div
                className={`relative w-20 h-20 rounded-2xl flex items-center justify-center mb-8 z-10 transition-transform duration-300 group-hover:scale-110 ${
                  step.color === "blue"
                    ? "bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                    : "bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                }`}
              >
                {step.icon}
                <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#0a0a0f] border border-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                  {step.step}
                </div>
              </div>

              {/* Card */}
              <div className="glass rounded-2xl p-6 border border-white/5 hover:border-blue-500/20 transition-all duration-300 w-full">
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
