"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Any Credit Accepted",
    description:
      "Bad credit, no credit, divorce, consumer proposal, or bankruptcy — we've helped thousands of Canadians just like you.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "blue",
    stat: "All Credits",
  },
  {
    title: "30+ Lender Network",
    description:
      "We partner with major banks, credit unions, and specialty auto lenders across Canada to find you the best possible rate.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 110 8 4 4 0 010-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "amber",
    stat: "30+ Partners",
  },
  {
    title: "Same Day Response",
    description:
      "Our approval specialists work fast. Most applicants receive a response within 24 hours — many the same day they apply.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "blue",
    stat: "< 24 Hours",
  },
  {
    title: "Rebuild Your Credit",
    description:
      "Every on-time payment with our lenders is reported to the credit bureaus, helping you build a stronger credit score over time.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "amber",
    stat: "Credit Builder",
  },
  {
    title: "No Hidden Fees",
    description:
      "Our service is 100% free to apply. We are compensated by lenders only when you successfully obtain financing — no surprise charges.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "blue",
    stat: "100% Free",
  },
  {
    title: "All Provinces Served",
    description:
      "From BC to Newfoundland — we serve all 10 provinces and 3 territories. Wherever you are in Canada, we can help.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "amber",
    stat: "All Canada",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="benefits" className="relative py-28 px-6">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-900/10 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            Why AutoLoans.ca
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
            Built for{" "}
            <span className="bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent">
              Canadians Like You
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            We understand that life happens. That&apos;s why we built a service
            that puts people first — not credit scores.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative glass rounded-2xl p-7 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.08)] overflow-hidden"
            >
              {/* Background hover glow */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  feature.color === "blue"
                    ? "bg-gradient-to-br from-blue-600/5 to-transparent"
                    : "bg-gradient-to-br from-amber-500/5 to-transparent"
                }`}
              />

              {/* Stat badge */}
              <div className="absolute top-5 right-5">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    feature.color === "blue"
                      ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {feature.stat}
                </span>
              </div>

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                  feature.color === "blue"
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {feature.icon}
              </div>

              <h3 className="text-lg font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
