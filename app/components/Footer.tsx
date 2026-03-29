"use client";

import { motion } from "framer-motion";

const links = {
  Company: ["About Us", "How It Works", "Privacy Policy", "Terms of Service"],
  Services: ["Bad Credit Loans", "No Credit Loans", "First Time Buyers", "New Canadians"],
  Provinces: ["Ontario", "British Columbia", "Alberta", "Quebec", "All Provinces"],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 11L5 5h14l2 6M3 11v6h2m14 0h2v-6M3 11h18M7 17a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">Auto</span>
                <span className="text-blue-400">Loans</span>
                <span className="text-amber-400">.ca</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Canada&apos;s trusted auto loan service for people with
              bad credit, no credit, or unique financial situations.
            </p>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span className="text-xs text-white/40 ml-1">4.9/5 from 2,400+ reviews</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/25">
            &copy; 2026 AutoLoans.ca — All rights reserved. Not a bank or financial institution.
          </p>
          <p className="text-xs text-white/20 text-center md:text-right max-w-md">
            AutoLoans.ca is a loan referral service. Rates and approvals vary by lender and applicant profile. This is not an offer to lend.
          </p>
        </div>
      </div>
    </footer>
  );
}
