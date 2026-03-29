'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface FormData {
  vehicleBrand: string
  vehicleType: string
  firstName: string
  lastName: string
  email: string
  phone: string
  isCanadian: string
  zeroDown: string
  ageRange: string
  streetAddress: string
  city: string
  province: string
  postalCode: string
  employmentStatus: string
  companyName: string
  jobTitle: string
  incomeType: string
  incomeAmount: string
  incomeStable: string
  housingType: string
  monthlyPayment: string
  monthlyBudget: string
  creditScore: string
  contactTime: string
}

const emptyForm: FormData = {
  vehicleBrand: '', vehicleType: '', firstName: '', lastName: '',
  email: '', phone: '', isCanadian: '', zeroDown: '',
  ageRange: '', streetAddress: '', city: '', province: '',
  postalCode: '', employmentStatus: '', companyName: '',
  jobTitle: '', incomeType: '', incomeAmount: '',
  incomeStable: '', housingType: '', monthlyPayment: '',
  monthlyBudget: '', creditScore: '', contactTime: '',
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const TOTAL_STEPS = 19

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon',
]

const BG: string[] = [
  'linear-gradient(135deg,#0a1628 0%,#0d2137 55%,#1a1a2e 100%)',   // 1 navy
  'linear-gradient(135deg,#9a3412 0%,#ea580c 55%,#fb923c 100%)',   // 2 orange
  'linear-gradient(135deg,#713f12 0%,#ca8a04 55%,#facc15 100%)',   // 3 yellow
  'linear-gradient(135deg,#14532d 0%,#16a34a 55%,#4ade80 100%)',   // 4 green
  'linear-gradient(135deg,#134e4a 0%,#0d9488 55%,#2dd4bf 100%)',   // 5 teal
  'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#60a5fa 100%)',   // 6 blue
  'linear-gradient(135deg,#4c1d95 0%,#7c3aed 55%,#a78bfa 100%)',   // 7 purple
  'linear-gradient(135deg,#831843 0%,#db2777 55%,#f9a8d4 100%)',   // 8 pink
  'linear-gradient(135deg,#9a3412 0%,#ea580c 55%,#fb923c 100%)',   // 9 orange
  'linear-gradient(135deg,#052e16 0%,#15803d 55%,#4ade80 100%)',   // 10 green
  'linear-gradient(135deg,#052e16 0%,#15803d 55%,#4ade80 100%)',   // 11 green
  'linear-gradient(135deg,#713f12 0%,#ca8a04 55%,#facc15 100%)',   // 12 yellow
  'linear-gradient(135deg,#831843 0%,#db2777 55%,#f9a8d4 100%)',   // 13 pink
  'linear-gradient(135deg,#500724 0%,#9d174d 55%,#ec4899 100%)',   // 14 deep pink
  'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#60a5fa 100%)',   // 15 blue
  'linear-gradient(135deg,#2e1065 0%,#6d28d9 55%,#c084fc 100%)',   // 16 purple
  'linear-gradient(135deg,#052e16 0%,#166534 55%,#22c55e 100%)',   // 17 green
  'linear-gradient(135deg,#431407 0%,#c2410c 55%,#fdba74 100%)',   // 18 orange
  'linear-gradient(135deg,#831843 0%,#6d28d9 50%,#1e3a8a 100%)',   // 19 pink→blue
]

// ─────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}
const slideTrans = { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as const }

// ─────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100)
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-black/20">
      <motion.div
        className="h-full bg-blue-400"
        style={{ boxShadow: '0 0 8px rgba(96,165,250,0.9)' }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
      {step > 1 && step < TOTAL_STEPS && (
        <motion.span
          className="absolute right-3 top-2.5 text-white/60 text-xs font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {pct}%
        </motion.span>
      )}
    </div>
  )
}

function Logo() {
  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <span className="text-xl leading-none">🚗</span>
      <span
        className="font-bold text-white text-base tracking-tight"
        style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
      >
        AutoLoans.ca
      </span>
    </div>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-medium mb-5 group"
    >
      <svg
        className="group-hover:-translate-x-0.5 transition-transform"
        width="16" height="16" viewBox="0 0 16 16" fill="currentColor"
      >
        <path d="M8.354 1.646a.5.5 0 010 .708L3.707 7H14.5a.5.5 0 010 1H3.707l4.647 4.646a.5.5 0 01-.708.708l-5.5-5.5a.5.5 0 010-.708l5.5-5.5a.5.5 0 01.708 0z" />
      </svg>
      Back
    </button>
  )
}

function PillOpt({
  label, icon, selected, onClick,
}: {
  label: string; icon?: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-4 rounded-full font-semibold text-lg transition-all duration-150 shadow-md
        ${selected
          ? 'bg-white text-gray-900 shadow-xl ring-4 ring-white/40 scale-[1.01]'
          : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/20 hover:scale-[1.005]'
        }`}
    >
      {icon && <span className="text-2xl shrink-0 leading-none">{icon}</span>}
      <span className="flex-1 text-left">{label}</span>
      {selected && (
        <svg className="w-5 h-5 text-blue-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}

function TxtInput({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div className="w-full">
      <label className="block text-white/80 text-xs font-semibold mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/90 text-gray-800 placeholder-gray-400 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-4 focus:ring-white/50 focus:bg-white transition-all shadow-lg"
      />
    </div>
  )
}

function ContBtn({ onClick, disabled = false, label = 'CONTINUE →' }: {
  onClick: () => void; disabled?: boolean; label?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-5 rounded-full font-bold text-xl tracking-wider shadow-2xl transition-all duration-200
        ${disabled
          ? 'bg-blue-500/40 text-white/50 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98] hover:shadow-[0_8px_30px_rgba(59,130,246,0.5)]'
        }`}
    >
      {label}
    </button>
  )
}

function Heading({ text, sub }: { text: string; sub?: string }) {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        {text}
      </h2>
      {sub && <p className="text-white/70 text-sm mt-2 leading-relaxed">{sub}</p>}
    </div>
  )
}

// Animated background blobs / particles
function BgBlobs({ hero }: { hero?: boolean }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  if (!ready) return null

  if (hero) {
    const pts = [
      { l: '5%', dur: '4.2s', del: '0s', sz: 2 }, { l: '12%', dur: '5.1s', del: '1s', sz: 3 },
      { l: '19%', dur: '3.8s', del: '0.5s', sz: 1 }, { l: '26%', dur: '4.8s', del: '2s', sz: 2 },
      { l: '33%', dur: '5.5s', del: '0.3s', sz: 3 }, { l: '40%', dur: '4s', del: '1.5s', sz: 2 },
      { l: '47%', dur: '3.5s', del: '0.8s', sz: 1 }, { l: '54%', dur: '4.6s', del: '2.3s', sz: 3 },
      { l: '61%', dur: '5.2s', del: '0.2s', sz: 2 }, { l: '68%', dur: '4.3s', del: '1.2s', sz: 1 },
      { l: '75%', dur: '3.9s', del: '0.7s', sz: 3 }, { l: '82%', dur: '5.0s', del: '1.8s', sz: 2 },
      { l: '89%', dur: '4.4s', del: '0.4s', sz: 1 }, { l: '95%', dur: '3.7s', del: '2.1s', sz: 3 },
      { l: '8%', dur: '4.9s', del: '1.3s', sz: 2 }, { l: '22%', dur: '5.3s', del: '0.6s', sz: 1 },
      { l: '37%', dur: '4.1s', del: '1.9s', sz: 3 }, { l: '52%', dur: '3.6s', del: '0.9s', sz: 2 },
      { l: '72%', dur: '5.4s', del: '1.6s', sz: 1 }, { l: '91%', dur: '4.7s', del: '0.1s', sz: 3 },
    ]
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {pts.map((p, i) => (
          <div
            key={i}
            className="absolute bottom-0 rounded-full bg-white/50"
            style={{ left: p.l, width: p.sz, height: p.sz, animationName: 'particleFloat', animationDuration: p.dur, animationDelay: p.del, animationIterationCount: 'infinite', animationTimingFunction: 'linear' }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" style={{ animationName: 'blobAnim', animationDuration: '9s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" style={{ animationName: 'blobAnim2', animationDuration: '13s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' }} />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-80 h-80 bg-white/10 blur-3xl"
        style={{ top: '-5rem', right: '-5rem', animationName: 'blobAnim', animationDuration: '9s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
      />
      <div
        className="absolute w-64 h-64 bg-white/8 blur-3xl"
        style={{ bottom: '-4rem', left: '-4rem', animationName: 'blobAnim2', animationDuration: '12s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out', borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }}
      />
      <div
        className="absolute w-48 h-48 bg-white/5 blur-2xl"
        style={{ top: '40%', left: '60%', animationName: 'blobAnim', animationDuration: '15s', animationDelay: '3s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out', borderRadius: '50%' }}
      />
    </div>
  )
}

// Confetti for success page
function Confetti() {
  const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#84cc16', '#a855f7']
  const items = Array.from({ length: 30 }, (_, i) => ({
    color: colors[i % colors.length],
    left: `${(i * 3.4) % 100}%`,
    delay: `${(i * 0.15) % 2}s`,
    dur: `${2.2 + (i * 0.18) % 1.5}s`,
    w: 5 + (i % 4) * 2,
    h: 8 + (i % 3) * 3,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {items.map((p, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{ left: p.left, width: p.w, height: p.h, backgroundColor: p.color, borderRadius: 2, animationName: 'confettiFall', animationDuration: p.dur, animationDelay: p.delay, animationIterationCount: '4', animationTimingFunction: 'ease-in' }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP COMPONENTS
// ─────────────────────────────────────────────

function Step1({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-3.5rem)] px-6 text-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="mb-6"
      >
        <svg width="130" height="86" viewBox="0 0 130 86" fill="none" className="drop-shadow-2xl mx-auto">
          <ellipse cx="65" cy="76" rx="55" ry="6" fill="rgba(0,0,0,0.25)" />
          <rect x="8" y="42" width="114" height="26" rx="5" fill="#2563eb" />
          <path d="M16 42 L32 18 L98 18 L114 42 Z" fill="#3b82f6" />
          <rect x="34" y="22" width="24" height="15" rx="3" fill="rgba(255,255,255,0.85)" />
          <rect x="62" y="22" width="30" height="15" rx="3" fill="rgba(255,255,255,0.85)" />
          <circle cx="30" cy="68" r="11" fill="#1e3a8a" />
          <circle cx="30" cy="68" r="7" fill="#dbeafe" />
          <circle cx="30" cy="68" r="3.5" fill="#1e3a8a" />
          <circle cx="100" cy="68" r="11" fill="#1e3a8a" />
          <circle cx="100" cy="68" r="7" fill="#dbeafe" />
          <circle cx="100" cy="68" r="3.5" fill="#1e3a8a" />
          <rect x="106" y="48" width="15" height="7" rx="2" fill="#fbbf24" />
          <rect x="9" y="48" width="12" height="7" rx="2" fill="#ef4444" />
          <rect x="8" y="55" width="4" height="4" rx="1" fill="#ef4444" opacity="0.6" />
        </svg>
      </motion.div>

      <motion.h1
        className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4"
        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Get Approved for Your<br />
        <span className="text-blue-400">Auto Loan</span> Today
      </motion.h1>

      <motion.p
        className="text-white/70 text-lg mb-8 max-w-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Bad credit welcome. Fast approvals across Canada. No obligation.
      </motion.p>

      <motion.button
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl px-12 py-5 rounded-full shadow-2xl transition-colors duration-200 hover:shadow-[0_8px_40px_rgba(59,130,246,0.6)]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        Start My Application →
      </motion.button>

      <motion.div
        className="flex flex-wrap justify-center gap-3 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {[
          { icon: '✅', text: '97% Approval Rate' },
          { icon: '⚡', text: '60 Second Application' },
          { icon: '🛡️', text: 'No Obligation' },
        ].map(b => (
          <div key={b.text} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm font-semibold">
            <span>{b.icon}</span>
            <span>{b.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Step2({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  const brands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Hyundai', 'Nissan', 'Kia', 'Mazda', 'RAM', 'Dodge', 'Jeep', 'Other']
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">🚘</div>
      <Heading text="What vehicle brand are you interested in?" />
      <div className="grid grid-cols-2 gap-3 mb-6">
        {brands.map(b => (
          <button
            key={b}
            onClick={() => onChange(b)}
            className={`py-4 px-4 rounded-full font-semibold text-base transition-all duration-150 shadow-md text-center
              ${value === b
                ? 'bg-white text-gray-900 shadow-xl ring-4 ring-white/40 scale-[1.02]'
                : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/20'
              }`}
          >
            {b}
          </button>
        ))}
      </div>
      <ContBtn onClick={onNext} disabled={!value} />
    </div>
  )
}

function Step3({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  const types = [
    { label: 'Sedan', icon: '🚗' }, { label: 'SUV', icon: '🚙' },
    { label: 'Truck', icon: '🛻' }, { label: 'Van / Minivan', icon: '🚐' },
    { label: 'Coupe', icon: '🏎️' }, { label: 'Convertible', icon: '🚘' },
    { label: 'Electric / Hybrid', icon: '⚡' },
  ]
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">🔍</div>
      <Heading text="What type of vehicle are you looking for?" />
      <div className="flex flex-col gap-3 mb-6">
        {types.map(t => (
          <PillOpt key={t.label} label={t.label} icon={t.icon} selected={value === t.label} onClick={() => onChange(t.label)} />
        ))}
      </div>
      <ContBtn onClick={onNext} disabled={!value} />
    </div>
  )
}

function Step4({ back, first, last, onFirst, onLast, onNext }: { back: () => void; first: string; last: string; onFirst: (v: string) => void; onLast: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">👤</div>
      <Heading text="What is your name?" />
      <div className="flex flex-col gap-4 mb-6">
        <TxtInput label="First Name" value={first} onChange={onFirst} placeholder="Jane" />
        <TxtInput label="Last Name" value={last} onChange={onLast} placeholder="Smith" />
      </div>
      <ContBtn onClick={onNext} disabled={!first.trim() || !last.trim()} />
    </div>
  )
}

function Step5({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">✉️</div>
      <Heading text="What is your email address?" sub="We'll send your approval details here" />
      <div className="mb-6">
        <TxtInput label="Email Address" value={value} onChange={onChange} placeholder="jane@example.com" type="email" />
      </div>
      <ContBtn onClick={onNext} disabled={!value.includes('@') || !value.includes('.')} />
    </div>
  )
}

function Step6({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">📱</div>
      <Heading text="What is your phone number?" />
      <div className="mb-4">
        <TxtInput label="Phone Number" value={value} onChange={onChange} placeholder="(555) 555-5555" type="tel" />
      </div>
      <p className="text-white/50 text-xs text-center mb-6 leading-relaxed">
        By continuing, you agree to be contacted by our loan specialists
      </p>
      <ContBtn onClick={onNext} disabled={value.replace(/\D/g, '').length < 10} />
    </div>
  )
}

function Step7({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">🍁</div>
      <Heading text="Are you a Canadian citizen or permanent resident?" />
      <div className="grid grid-cols-2 gap-4 mb-6">
        {['Yes', 'No'].map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`py-6 rounded-full font-bold text-2xl transition-all duration-150 shadow-md
              ${value === opt
                ? 'bg-white text-gray-900 shadow-xl ring-4 ring-white/40 scale-[1.02]'
                : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/20'
              }`}
          >
            {opt === 'Yes' ? '✓ YES' : '✗ NO'}
          </button>
        ))}
      </div>
      <ContBtn onClick={onNext} disabled={!value} />
    </div>
  )
}

function Step8({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">💰</div>
      <Heading text="Are you interested in $0 down payment options?" />
      <div className="grid grid-cols-2 gap-4 mb-6">
        {['Yes', 'No'].map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`py-6 rounded-full font-bold text-2xl transition-all duration-150 shadow-md
              ${value === opt
                ? 'bg-white text-gray-900 shadow-xl ring-4 ring-white/40 scale-[1.02]'
                : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/20'
              }`}
          >
            {opt === 'Yes' ? '✓ YES' : '✗ NO'}
          </button>
        ))}
      </div>
      <ContBtn onClick={onNext} disabled={!value} />
    </div>
  )
}

function Step9({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  const ranges = ['18–25', '26–35', '36–45', '46–55', '56–65', '65+']
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">🎂</div>
      <Heading text="What is your age range?" />
      <div className="grid grid-cols-2 gap-3 mb-6">
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => onChange(r)}
            className={`py-4 rounded-full font-semibold text-lg transition-all duration-150 shadow-md
              ${value === r
                ? 'bg-white text-gray-900 shadow-xl ring-4 ring-white/40 scale-[1.02]'
                : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/20'
              }`}
          >
            {r}
          </button>
        ))}
      </div>
      <ContBtn onClick={onNext} disabled={!value} />
    </div>
  )
}

function Step10({ back, form, update, onNext }: { back: () => void; form: FormData; update: (k: keyof FormData, v: string) => void; onNext: () => void }) {
  const canContinue = form.streetAddress.trim() && form.city.trim() && form.province && form.postalCode.trim()
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">🏠</div>
      <Heading text="What is your current address?" />
      <div className="flex flex-col gap-4 mb-6">
        <TxtInput label="Street Address" value={form.streetAddress} onChange={v => update('streetAddress', v)} placeholder="123 Main Street" />
        <TxtInput label="City" value={form.city} onChange={v => update('city', v)} placeholder="Toronto" />
        <div>
          <label className="block text-white/80 text-xs font-semibold mb-1.5 uppercase tracking-wider">Province</label>
          <select
            value={form.province}
            onChange={e => update('province', e.target.value)}
            className="w-full bg-white/90 text-gray-800 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-4 focus:ring-white/50 focus:bg-white transition-all shadow-lg appearance-none"
          >
            <option value="">Select Province / Territory</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <TxtInput label="Postal Code" value={form.postalCode} onChange={v => update('postalCode', v)} placeholder="A1A 1A1" />
      </div>
      <ContBtn onClick={onNext} disabled={!canContinue} />
    </div>
  )
}

function Step11({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  const statuses = [
    { label: 'Employed', icon: '💼' }, { label: 'Retired', icon: '🏖️' },
    { label: 'Student', icon: '🎓' }, { label: 'Self-Employed', icon: '🏢' },
    { label: 'Unemployed', icon: '🔍' }, { label: 'Other', icon: '📋' },
  ]
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">💼</div>
      <Heading text="What is your employment status?" />
      <div className="flex flex-col gap-3 mb-6">
        {statuses.map(s => (
          <PillOpt key={s.label} label={s.label} icon={s.icon} selected={value === s.label} onClick={() => onChange(s.label)} />
        ))}
      </div>
      <ContBtn onClick={onNext} disabled={!value} />
    </div>
  )
}

function Step12({ back, company, jobTitle, onCompany, onJob, onNext }: { back: () => void; company: string; jobTitle: string; onCompany: (v: string) => void; onJob: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">🏢</div>
      <Heading text="Tell us about your employer." sub="Don't worry, we won't contact your employer. This helps us get you the best rates." />
      <div className="flex flex-col gap-4 mb-6">
        <TxtInput label="Company Name" value={company} onChange={onCompany} placeholder="Acme Corp" />
        <TxtInput label="Job Title" value={jobTitle} onChange={onJob} placeholder="Sales Manager" />
      </div>
      <ContBtn onClick={onNext} disabled={!company.trim() || !jobTitle.trim()} />
    </div>
  )
}

function Step13({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  const types = [
    { label: 'Annual Salary', icon: '📅' },
    { label: 'Monthly Income', icon: '🗓️' },
    { label: 'Hourly Wage', icon: '⏱️' },
  ]
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">💵</div>
      <Heading text="How do you receive your income?" />
      <div className="flex flex-col gap-3 mb-6">
        {types.map(t => (
          <PillOpt key={t.label} label={t.label} icon={t.icon} selected={value === t.label} onClick={() => onChange(t.label)} />
        ))}
      </div>
      <ContBtn onClick={onNext} disabled={!value} />
    </div>
  )
}

function Step14({ back, incomeType, amount, stable, onAmount, onStable, onNext }: {
  back: () => void; incomeType: string; amount: string; stable: string
  onAmount: (v: string) => void; onStable: (v: string) => void; onNext: () => void
}) {
  const labelMap: Record<string, string> = {
    'Annual Salary': 'What is your annual income?',
    'Monthly Income': 'What is your monthly income?',
    'Hourly Wage': 'What is your hourly wage?',
  }
  const question = labelMap[incomeType] ?? 'What is your annual income?'
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">📊</div>
      <Heading text={question} />
      <div className="mb-7">
        <TxtInput label="Amount ($)" value={amount} onChange={onAmount} placeholder="e.g. 55,000" />
      </div>
      <Heading text="Have you been receiving this income for 3+ months?" />
      <div className="grid grid-cols-2 gap-4 mb-6">
        {['Yes', 'No'].map(opt => (
          <button
            key={opt}
            onClick={() => onStable(opt)}
            className={`py-5 rounded-full font-bold text-xl transition-all duration-150 shadow-md
              ${stable === opt
                ? 'bg-white text-gray-900 shadow-xl ring-4 ring-white/40 scale-[1.02]'
                : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/20'
              }`}
          >
            {opt === 'Yes' ? '✓ YES' : '✗ NO'}
          </button>
        ))}
      </div>
      <ContBtn onClick={onNext} disabled={!amount.trim() || !stable} />
    </div>
  )
}

function Step15({ back, housing, payment, onHousing, onPayment, onNext }: {
  back: () => void; housing: string; payment: string
  onHousing: (v: string) => void; onPayment: (v: string) => void; onNext: () => void
}) {
  const showPayment = housing === 'Rent' || housing === 'Own'
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">🏡</div>
      <Heading text="Do you rent or own your home?" />
      <div className="flex flex-col gap-3 mb-4">
        {['Rent', 'Own', 'Other'].map(opt => (
          <PillOpt key={opt} label={opt} selected={housing === opt} onClick={() => onHousing(opt)} />
        ))}
      </div>
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-4"
          >
            <TxtInput
              label={housing === 'Rent' ? 'Monthly Rent Amount ($)' : 'Monthly Mortgage Payment ($)'}
              value={payment}
              onChange={onPayment}
              placeholder="e.g. 1,500"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ContBtn onClick={onNext} disabled={!housing || (showPayment && !payment.trim())} />
    </div>
  )
}

function Step16({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  const budgets = [
    { label: 'Under $300/month', icon: '💚' },
    { label: '$300–$500/month', icon: '💛' },
    { label: '$500–$700/month', icon: '🧡' },
    { label: 'Over $700/month', icon: '❤️' },
  ]
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">💳</div>
      <Heading text="What is your monthly car payment budget?" />
      <div className="flex flex-col gap-3 mb-6">
        {budgets.map(b => (
          <PillOpt key={b.label} label={b.label} icon={b.icon} selected={value === b.label} onClick={() => onChange(b.label)} />
        ))}
      </div>
      <ContBtn onClick={onNext} disabled={!value} />
    </div>
  )
}

function Step17({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  const scores = [
    { label: '750+ (Excellent)', icon: '⭐' },
    { label: '650–749 (Good)', icon: '😊' },
    { label: '580–649 (Fair)', icon: '😐' },
    { label: 'Under 579 (Poor)', icon: '😟' },
    { label: 'Bankruptcy / Consumer Proposal', icon: '📄' },
    { label: 'Not Sure', icon: '🤔' },
  ]
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">📈</div>
      <Heading text="What is your estimated credit score?" sub="We can get you approved at the best rate possible, regardless of your credit situation" />
      <div className="flex flex-col gap-3 mb-6">
        {scores.map(s => (
          <PillOpt key={s.label} label={s.label} icon={s.icon} selected={value === s.label} onClick={() => onChange(s.label)} />
        ))}
      </div>
      <ContBtn onClick={onNext} disabled={!value} />
    </div>
  )
}

function Step18({ back, value, onChange, onNext }: { back: () => void; value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-4 pb-8">
      <BackBtn onClick={back} />
      <div className="text-[80px] text-center mb-3 leading-none">📅</div>
      <Heading text="When is the best time to contact you?" sub="(Optional)" />
      <div className="mb-6">
        <label className="block text-white/80 text-xs font-semibold mb-1.5 uppercase tracking-wider">Preferred Date & Time</label>
        <input
          type="datetime-local"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white/90 text-gray-800 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-4 focus:ring-white/50 focus:bg-white transition-all shadow-lg"
        />
      </div>
      <ContBtn onClick={onNext} label="SUBMIT APPLICATION →" />
    </div>
  )
}

function Step19() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-3.5rem)] px-6 text-center">
      <Confetti />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center mb-6 shadow-2xl"
      >
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <path d="M14 28L24 38L42 18" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <motion.h1
        className="text-5xl font-bold text-white mb-3"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Success! 🎉
      </motion.h1>

      <motion.p
        className="text-white/90 text-xl font-medium mb-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Your application has been submitted successfully.
      </motion.p>

      <motion.p
        className="text-white/70 text-base max-w-xs leading-relaxed mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        One of our pre-qualification specialists will contact you shortly.
      </motion.p>

      {/* Animated wave */}
      <motion.div
        className="w-full max-w-sm overflow-hidden rounded-2xl"
        style={{ height: 56 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div style={{ display: 'flex', width: '200%', animationName: 'waveScroll', animationDuration: '4s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }}>
          <svg viewBox="0 0 600 56" preserveAspectRatio="none" style={{ width: '50%', height: 56, flexShrink: 0 }}>
            <path d="M0,28 C75,56 175,0 300,28 C425,56 525,0 600,28 L600,56 L0,56 Z" fill="rgba(255,255,255,0.2)" />
          </svg>
          <svg viewBox="0 0 600 56" preserveAspectRatio="none" style={{ width: '50%', height: 56, flexShrink: 0 }}>
            <path d="M0,28 C75,56 175,0 300,28 C425,56 525,0 600,28 L600,56 L0,56 Z" fill="rgba(255,255,255,0.2)" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[
          { icon: '📞', text: 'Expect a call within 24h' },
          { icon: '📧', text: 'Check your email' },
        ].map(item => (
          <div key={item.text} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3 text-white text-sm font-semibold">
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export default function FunnelPage() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [form, setForm] = useState<FormData>(emptyForm)

  const next = () => { setDirection(1); setStep(s => s + 1) }
  const back = () => { setDirection(-1); setStep(s => s - 1) }
  const update = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    console.log('AutoLoans.ca — Form submitted:', form)
    next()
  }

  function renderStep() {
    switch (step) {
      case 1:  return <Step1 onStart={next} />
      case 2:  return <Step2 back={back} value={form.vehicleBrand} onChange={v => update('vehicleBrand', v)} onNext={next} />
      case 3:  return <Step3 back={back} value={form.vehicleType} onChange={v => update('vehicleType', v)} onNext={next} />
      case 4:  return <Step4 back={back} first={form.firstName} last={form.lastName} onFirst={v => update('firstName', v)} onLast={v => update('lastName', v)} onNext={next} />
      case 5:  return <Step5 back={back} value={form.email} onChange={v => update('email', v)} onNext={next} />
      case 6:  return <Step6 back={back} value={form.phone} onChange={v => update('phone', v)} onNext={next} />
      case 7:  return <Step7 back={back} value={form.isCanadian} onChange={v => update('isCanadian', v)} onNext={next} />
      case 8:  return <Step8 back={back} value={form.zeroDown} onChange={v => update('zeroDown', v)} onNext={next} />
      case 9:  return <Step9 back={back} value={form.ageRange} onChange={v => update('ageRange', v)} onNext={next} />
      case 10: return <Step10 back={back} form={form} update={update} onNext={next} />
      case 11: return <Step11 back={back} value={form.employmentStatus} onChange={v => update('employmentStatus', v)} onNext={next} />
      case 12: return <Step12 back={back} company={form.companyName} jobTitle={form.jobTitle} onCompany={v => update('companyName', v)} onJob={v => update('jobTitle', v)} onNext={next} />
      case 13: return <Step13 back={back} value={form.incomeType} onChange={v => update('incomeType', v)} onNext={next} />
      case 14: return <Step14 back={back} incomeType={form.incomeType} amount={form.incomeAmount} stable={form.incomeStable} onAmount={v => update('incomeAmount', v)} onStable={v => update('incomeStable', v)} onNext={next} />
      case 15: return <Step15 back={back} housing={form.housingType} payment={form.monthlyPayment} onHousing={v => update('housingType', v)} onPayment={v => update('monthlyPayment', v)} onNext={next} />
      case 16: return <Step16 back={back} value={form.monthlyBudget} onChange={v => update('monthlyBudget', v)} onNext={next} />
      case 17: return <Step17 back={back} value={form.creditScore} onChange={v => update('creditScore', v)} onNext={next} />
      case 18: return <Step18 back={back} value={form.contactTime} onChange={v => update('contactTime', v)} onNext={handleSubmit} />
      case 19: return <Step19 />
      default: return null
    }
  }

  return (
    <div className="relative" style={{ minHeight: '100svh' }}>
      {/* Crossfading background gradient */}
      <AnimatePresence>
        <motion.div
          key={`bg-${step}`}
          className="fixed inset-0 -z-10"
          style={{ background: BG[step - 1] }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10">
        <BgBlobs hero={step === 1} />
      </div>

      <Logo />
      <ProgressBar step={step} />

      {/* Step content with slide transitions */}
      <div
        className="flex flex-col items-center justify-center overflow-x-hidden"
        style={{ minHeight: '100svh', paddingTop: '3.5rem', paddingBottom: '2rem' }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
