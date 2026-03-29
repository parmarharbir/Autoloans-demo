"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Toronto, ON",
    rating: 5,
    text: "I was turned down by my bank twice and thought I'd never get a car loan. AutoLoans.ca got me approved in less than 12 hours. I'm driving a 2021 Honda Civic now — I couldn't believe it.",
    vehicle: "2021 Honda Civic",
    amount: "$18,500",
    avatar: "SM",
    color: "blue",
  },
  {
    name: "David K.",
    location: "Calgary, AB",
    rating: 5,
    text: "After my consumer proposal, I thought financing was impossible. The team here found me a lender willing to work with my situation. Payments are affordable and I'm rebuilding my credit every month.",
    vehicle: "2020 Ford F-150",
    amount: "$32,000",
    avatar: "DK",
    color: "amber",
  },
  {
    name: "Marie-Claude B.",
    location: "Montréal, QC",
    rating: 5,
    text: "Très professionnel et rapide! I applied on a Thursday evening and had my approval by Friday morning. The process was completely online — so convenient. Highly recommend to anyone with credit challenges.",
    vehicle: "2022 Toyota RAV4",
    amount: "$28,000",
    avatar: "MB",
    color: "blue",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="relative py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            Real Canadian Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
            Thousands{" "}
            <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
              Approved
            </span>{" "}
            &amp; Driving
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Don&apos;t take our word for it. Here&apos;s what some of our
            customers have to say.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="glass rounded-2xl p-7 border border-white/5 hover:border-amber-500/20 transition-all duration-300 flex flex-col gap-5"
            >
              {/* Quote icon */}
              <div className="text-4xl text-blue-500/30 font-serif leading-none">&ldquo;</div>

              {/* Stars */}
              <StarRating count={t.rating} />

              {/* Text */}
              <p className="text-white/70 text-sm leading-relaxed flex-1">
                {t.text}
              </p>

              {/* Vehicle badge */}
              <div className="flex items-center gap-2 text-xs">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                  <path d="M3 11L5 5h14l2 6M3 11v6h2m14 0h2v-6M3 11h18M7 17a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white/50">{t.vehicle}</span>
                <span className="text-white/20">•</span>
                <span
                  className={
                    t.color === "blue" ? "text-blue-400" : "text-amber-400"
                  }
                >
                  {t.amount}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    t.color === "blue"
                      ? "bg-blue-600/20 text-blue-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/40">{t.location}</div>
                </div>
                <div className="ml-auto">
                  <div className="text-xs text-green-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Verified
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 glass rounded-2xl p-8 border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: "47,000+", label: "Canadians Helped" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "$500M+", label: "Total Funded" },
            { value: "10 yrs", label: "In Business" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
