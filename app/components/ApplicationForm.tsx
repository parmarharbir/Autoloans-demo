"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const provinces = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Nova Scotia", "Ontario",
  "Prince Edward Island", "Quebec", "Saskatchewan",
  "Northwest Territories", "Nunavut", "Yukon",
];

const employmentOptions = [
  "Employed Full-Time",
  "Employed Part-Time",
  "Self-Employed",
  "Seasonal / Contract",
  "Disability / ODSP / AISH",
  "EI / Social Assistance",
  "Pension / Retirement",
  "Student",
];

const incomeOptions = [
  "Under $1,500 / month",
  "$1,500 – $2,499 / month",
  "$2,500 – $3,999 / month",
  "$4,000 – $5,999 / month",
  "$6,000+ / month",
];

const loanAmounts = [
  "$5,000 – $10,000",
  "$10,000 – $15,000",
  "$15,000 – $25,000",
  "$25,000 – $40,000",
  "$40,000+",
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  province: string;
  employment: string;
  income: string;
  loanAmount: string;
};

type FormErrors = Partial<FormData>;

export default function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    province: "",
    employment: "",
    income: "",
    loanAmount: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email required";
    if (formData.phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Valid phone required";
    if (!formData.province) newErrors.province = "Required";
    if (!formData.employment) newErrors.employment = "Required";
    if (!formData.income) newErrors.income = "Required";
    if (!formData.loanAmount) newErrors.loanAmount = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field: keyof FormData) =>
    `w-full bg-white/5 border ${
      errors[field] ? "border-red-500/60" : "border-white/10 focus:border-blue-500/60"
    } rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/10`;

  const selectClass = (field: keyof FormData) =>
    `w-full bg-[#0d1117] border ${
      errors[field] ? "border-red-500/60" : "border-white/10 focus:border-blue-500/60"
    } rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-200 focus:bg-[#111820] appearance-none cursor-pointer`;

  return (
    <section id="apply" className="relative py-28 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-700/10 blur-[130px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            Free Application — No Obligation
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
            Start Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
              Application
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-lg mx-auto">
            Takes 2 minutes. No hard credit check. Get a response within 24
            hours — often the same day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass rounded-3xl border border-white/[0.08] p-8 md:p-12 shadow-[0_0_80px_rgba(59,130,246,0.08)]"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">
                  Application Received!
                </h3>
                <p className="text-white/60 mb-6 max-w-md mx-auto">
                  Thank you, {formData.firstName}! One of our approval
                  specialists will contact you at{" "}
                  <span className="text-blue-400">{formData.email}</span> within
                  the next 24 hours — usually much sooner.
                </p>
                <div className="glass rounded-2xl p-5 border border-white/5 max-w-sm mx-auto text-sm text-white/50">
                  <div className="flex justify-between mb-2">
                    <span>Requested Amount:</span>
                    <span className="text-amber-400 font-semibold">{formData.loanAmount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Province:</span>
                    <span className="text-white/80">{formData.province}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reference #:</span>
                    <span className="text-blue-400 font-mono">
                      AL-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Row 1: Name */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      className={inputClass("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      className={inputClass("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Contact */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="(416) 555-0100"
                      value={formData.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={inputClass("phone")}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Row 3: Province + Employment */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                      Province / Territory
                    </label>
                    <select
                      value={formData.province}
                      onChange={(e) => update("province", e.target.value)}
                      className={selectClass("province")}
                    >
                      <option value="" disabled>Select province...</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    {errors.province && (
                      <p className="text-red-400 text-xs mt-1">{errors.province}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                      Employment Status
                    </label>
                    <select
                      value={formData.employment}
                      onChange={(e) => update("employment", e.target.value)}
                      className={selectClass("employment")}
                    >
                      <option value="" disabled>Select status...</option>
                      {employmentOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    {errors.employment && (
                      <p className="text-red-400 text-xs mt-1">{errors.employment}</p>
                    )}
                  </div>
                </div>

                {/* Row 4: Income + Loan Amount */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                      Monthly Income
                    </label>
                    <select
                      value={formData.income}
                      onChange={(e) => update("income", e.target.value)}
                      className={selectClass("income")}
                    >
                      <option value="" disabled>Select range...</option>
                      {incomeOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    {errors.income && (
                      <p className="text-red-400 text-xs mt-1">{errors.income}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                      Desired Loan Amount
                    </label>
                    <select
                      value={formData.loanAmount}
                      onChange={(e) => update("loanAmount", e.target.value)}
                      className={selectClass("loanAmount")}
                    >
                      <option value="" disabled>Select amount...</option>
                      {loanAmounts.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    {errors.loanAmount && (
                      <p className="text-red-400 text-xs mt-1">{errors.loanAmount}</p>
                    )}
                  </div>
                </div>

                {/* Consent + Submit */}
                <div className="pt-4 space-y-4">
                  <p className="text-xs text-white/30 leading-relaxed">
                    By submitting this form, you consent to be contacted by
                    AutoLoans.ca and its lending partners regarding your auto
                    loan inquiry. This is a soft inquiry only and will not
                    affect your credit score.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 text-white font-bold text-lg transition-all duration-200 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] hover:scale-[1.01] disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Get My Free Approval
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/30"
        >
          {[
            "256-bit SSL Encryption",
            "No Hard Credit Check",
            "Privacy Protected",
            "Free — No Obligation",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
