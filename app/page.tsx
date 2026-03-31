'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ══════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════ */

interface FormData {
  vehicleType: string; vehicleBrand: string
  firstName: string; lastName: string
  email: string; phone: string
  isCanadian: string; zeroDown: string; ageRange: string
  street: string; city: string; province: string; postalCode: string
  employment: string; employerName: string; jobTitle: string; timeAtJob: string
  incomeType: string; incomeAmount: string; incomeStability: string
  housingType: string; monthlyBudget: string; creditScore: string; contactTime: string
}

type QPos = 'center' | 'left' | 'right' | 'bot-left' | 'bot-right' | 'top-left' | 'top-right' | 'top' | 'bottom'

/* ══════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════ */

const EMPTY: FormData = {
  vehicleType: '', vehicleBrand: '', firstName: '', lastName: '',
  email: '', phone: '', isCanadian: '', zeroDown: '', ageRange: '',
  street: '', city: '', province: '', postalCode: '',
  employment: '', employerName: '', jobTitle: '', timeAtJob: '',
  incomeType: '', incomeAmount: '', incomeStability: '',
  housingType: '', monthlyBudget: '', creditScore: '', contactTime: '',
}

// Car image + position per step
const STEP_CAR = [
  { img: 'sedan-hero',     x: '50%', y: '50%', sc: 1.20, r:  0 }, // 0 hero
  { img: 'sedan-hero',     x: '72%', y: '50%', sc: 1.00, r:  2 }, // 1
  { img: 'sedan-side',     x: '28%', y: '50%', sc: 0.90, r: -2 }, // 2
  { img: 'sedan-front',    x: '70%', y: '30%', sc: 0.85, r:  3 }, // 3
  { img: 'sedan-side',     x: '30%', y: '30%', sc: 0.85, r: -3 }, // 4
  { img: 'sedan-overhead', x: '50%', y: '22%', sc: 1.00, r:  0 }, // 5
  { img: 'sedan-rear',     x: '70%', y: '72%', sc: 0.90, r:  2 }, // 6
  { img: 'sedan-hero',     x: '30%', y: '72%', sc: 0.90, r: -2 }, // 7
  { img: 'sedan-side',     x: '70%', y: '50%', sc: 1.10, r:  2 }, // 8
  { img: 'sedan-front',    x: '30%', y: '50%', sc: 0.95, r: -2 }, // 9
  { img: 'sedan-wheel',    x: '50%', y: '75%', sc: 1.00, r:  0 }, // 10
  { img: 'sedan-hero',     x: '70%', y: '28%', sc: 0.85, r:  3 }, // 11
  { img: 'sedan-rear',     x: '30%', y: '28%', sc: 0.85, r: -3 }, // 12
  { img: 'sedan-interior', x: '50%', y: '50%', sc: 1.05, r:  0 }, // 13
  { img: 'sedan-side',     x: '70%', y: '50%', sc: 0.90, r:  2 }, // 14
  { img: 'sedan-overhead', x: '30%', y: '50%', sc: 0.90, r: -2 }, // 15
  { img: 'sedan-front',    x: '50%', y: '22%', sc: 1.00, r:  0 }, // 16
  { img: 'sedan-road',     x: '68%', y: '70%', sc: 0.85, r:  3 }, // 17
  { img: 'sedan-hero',     x: '50%', y: '50%', sc: 1.30, r:  0 }, // 18 success
]

// Question card position per step
const QPOS: QPos[] = [
  'center',    // 0 hero
  'left',      // 1
  'right',     // 2
  'bot-left',  // 3
  'bot-right', // 4
  'bottom',    // 5
  'top-left',  // 6
  'top-right', // 7
  'left',      // 8
  'right',     // 9
  'top',       // 10
  'bot-left',  // 11
  'bot-right', // 12
  'bottom',    // 13
  'left',      // 14
  'right',     // 15
  'bottom',    // 16
  'top-left',  // 17
  'center',    // 18 success
]

// Huge ghost text behind each question
const GHOST = [
  'APPROVED', 'TYPE', 'BRAND', 'NAME', 'EMAIL',
  'PHONE', 'CANADA', 'DOWN', 'AGE', 'HOME',
  'WORK', 'JOB', 'INCOME', 'SALARY', 'HOUSE',
  'BUDGET', 'CREDIT', 'CALL', 'YES',
]

/* ── Option data ── */
const VTYPES  = ['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Convertible', 'Electric', 'Other']
const BRANDS  = ['Toyota','Honda','Ford','Chevrolet','BMW','Mercedes','Audi','Hyundai','Kia','Nissan','Subaru','Volkswagen','Jeep','Ram','GMC','Lexus','Acura','Mazda','Volvo','Tesla','Dodge','Chrysler','Buick','Cadillac','Lincoln','Infiniti','Genesis','Rivian','Lucid','Other']
const AGES    = ['Under 25', '25–34', '35–44', '45–54', '55–64', '65+']
const PROVS   = ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan','Northwest Territories','Nunavut','Yukon']
const EMPLS   = ['Employed', 'Self-Employed', 'Retired', 'Student', 'Other']
const ITYPES  = ['Salary', 'Hourly', 'Commission', 'Business', 'Pension', 'Disability', 'Other']
const HOUSE   = ['Own', 'Rent', 'Live with family', 'Other']
const BUDGET  = ['Under $300', '$300–$400', '$400–$500', '$500–$700', '$700+']
const CREDIT  = ['Excellent 750+', 'Good 700–749', 'Fair 650–699', 'Poor 600–649', 'Bad below 600', 'Not sure']
const CTIMES  = ['Morning', 'Afternoon', 'Evening', 'Anytime']

/* ══════════════════════════════════════════════════════
   POSITION HELPER
   Full-inset flex container — no CSS transform needed,
   so Framer Motion opacity animation never conflicts.
══════════════════════════════════════════════════════ */

function cardContainer(pos: QPos, mobile: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none',
  }
  if (mobile) {
    return {
      ...base,
      alignItems: pos === 'center' ? 'center' : 'flex-end',
      justifyContent: 'center',
      paddingBottom: pos === 'center' ? 0 : '5vh',
    }
  }
  switch (pos) {
    case 'center':    return { ...base, alignItems: 'center',     justifyContent: 'center' }
    case 'left':      return { ...base, alignItems: 'center',     justifyContent: 'flex-start', paddingLeft: '4vw' }
    case 'right':     return { ...base, alignItems: 'center',     justifyContent: 'flex-end',   paddingRight: '4vw' }
    case 'bot-left':  return { ...base, alignItems: 'flex-end',   justifyContent: 'flex-start', padding: '0 4vw 10vh 4vw' }
    case 'bot-right': return { ...base, alignItems: 'flex-end',   justifyContent: 'flex-end',   padding: '0 4vw 10vh 4vw' }
    case 'top-left':  return { ...base, alignItems: 'flex-start', justifyContent: 'flex-start', padding: '14vh 4vw 0 4vw' }
    case 'top-right': return { ...base, alignItems: 'flex-start', justifyContent: 'flex-end',   padding: '14vh 4vw 0 4vw' }
    case 'top':       return { ...base, alignItems: 'flex-start', justifyContent: 'center',     paddingTop: '14vh' }
    case 'bottom':    return { ...base, alignItems: 'flex-end',   justifyContent: 'center',     paddingBottom: '10vh' }
  }
}

/* ══════════════════════════════════════════════════════
   SHARED MICRO-COMPONENTS
══════════════════════════════════════════════════════ */

function QH({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="font-bold text-[#0a1628] leading-snug mb-5"
      style={{
        fontFamily: 'var(--font-playfair), Georgia, serif',
        fontSize: 'clamp(1.4rem, 3.2vw, 2.5rem)',
      }}
    >
      {children}
    </motion.h2>
  )
}

function Pill({
  label, sel, onClick, delay = 0,
}: { label: string; sel: boolean; onClick: () => void; delay?: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.22 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium border-[1.5px] transition-colors duration-150 ${
        sel
          ? 'bg-[#F5C842] text-[#0a1628] border-[#F5C842] shadow-md'
          : 'bg-white text-[#1a1a1a] border-[#e0d4c0] hover:border-[#F5C842] hover:shadow-sm'
      }`}
    >
      {label}
    </motion.button>
  )
}

function Inp({
  ph, val, onChange, type = 'text', delay = 0,
}: { ph: string; val: string; onChange: (v: string) => void; type?: string; delay?: number }) {
  return (
    <motion.input
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.22 }}
      type={type}
      placeholder={ph}
      value={val}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white border border-[#e0d4c0] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-[#b0a090] focus:outline-none focus:border-[#F5C842] focus:ring-2 focus:ring-[#F5C842]/20 text-sm transition-all"
    />
  )
}

function ContBtn({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`mt-5 px-8 py-3 rounded-full font-semibold text-sm transition-all ${
        disabled
          ? 'bg-[#e8dfd0] text-[#a09080] cursor-not-allowed'
          : 'bg-[#0a1628] text-white shadow-lg hover:shadow-xl hover:bg-[#162238]'
      }`}
    >
      Continue →
    </motion.button>
  )
}

/* ══════════════════════════════════════════════════════
   SUCCESS STEP (step 18)
══════════════════════════════════════════════════════ */

function Step18({ form }: { form: FormData }) {
  const pieces = useMemo(() =>
    Array.from({ length: 56 }, (_, i) => ({
      id: i,
      left: (i * 7.3) % 100,
      delay: (i * 0.13) % 3,
      color: ['#F5C842', '#0a1628', '#F5A800', '#FFD700', '#c8b45a', '#ffffff'][i % 6],
      w: 5 + (i % 7), h: 3 + (i % 4),
      dur: 2.4 + (i % 3) * 0.6,
    }))
  , [])

  const rows: [string, string][] = [
    ['Name',    `${form.firstName} ${form.lastName}`.trim()],
    ['Vehicle', [form.vehicleType, form.vehicleBrand].filter(Boolean).join(' — ')],
    ['Credit',  form.creditScore],
    ['Budget',  form.monthlyBudget ? `${form.monthlyBudget}/mo` : ''],
    ['Contact', [form.contactTime, form.phone].filter(Boolean).join(' · ')],
  ]

  return (
    <div className="text-center w-full px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
        {pieces.map(c => (
          <div key={c.id} className="absolute rounded-sm" style={{
            left: `${c.left}%`, top: '-12px',
            width: c.w, height: c.h, backgroundColor: c.color,
            animation: `confettiFall ${c.dur}s ease-in ${c.delay}s infinite`,
          }} />
        ))}
      </div>

      <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, delay: 0.1 }}
        className="text-5xl mb-3 select-none"
      >🎉</motion.div>

      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
        className="font-bold text-[#0a1628] mb-2"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
      >
        You&apos;re Pre-Approved!
      </motion.h2>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.44 }}
        className="text-[#6b7280] mb-6 text-sm"
      >
        A specialist will contact you shortly
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}
        className="bg-white rounded-2xl shadow-xl border border-[#e0d4c0] p-6 text-left space-y-3 max-w-sm mx-auto"
      >
        <p className="text-[#c49a00] font-bold text-xs uppercase tracking-widest mb-4">
          Application Summary
        </p>
        {rows.filter(([, v]) => v).map(([label, val]) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <span className="text-[#9a8a7a]">{label}</span>
            <span className="text-[#0a1628] font-medium text-right">{val}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */

export default function FunnelPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [mobile, setMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Sync scroll position → step
  useEffect(() => {
    const onScroll = () => {
      const s = Math.round(window.scrollY / window.innerHeight)
      setStep(Math.min(Math.max(s, 0), 18))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = useCallback((n: number) => {
    window.scrollTo({ top: Math.max(0, n) * window.innerHeight, behavior: 'smooth' })
  }, [])

  const next = useCallback(() => goTo(step + 1), [step, goTo])
  const back = useCallback(() => goTo(step - 1), [step, goTo])

  const set = useCallback((k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
  }, [])

  // Select a pill option and auto-advance
  const pick = useCallback((k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setTimeout(() => goTo(step + 1), 200)
  }, [step, goTo])

  // Log completed form
  useEffect(() => {
    if (step === 18) console.log('AutoLoans form submission:', form)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const canNext = (): boolean => {
    switch (step) {
      case  3: return !!(form.firstName.trim() && form.lastName.trim())
      case  4: return !!form.email.trim()
      case  5: return !!form.phone.trim()
      case  9: return !!(form.street.trim() && form.city.trim() && form.province)
      case 11: return !!form.employerName.trim()
      case 13: return !!form.incomeAmount.trim()
      default: return true
    }
  }

  const isTextStep = [3, 4, 5, 9, 11, 13].includes(step)
  const car  = STEP_CAR[step]
  const pos  = QPOS[step]
  const ghost = GHOST[step]

  /* ── Step content renderer ── */
  const renderContent = (): React.ReactNode => {
    switch (step) {

      /* ── HERO ── */
      case 0: return (
        <div className="text-center max-w-2xl mx-auto px-6">
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[#c49a00] text-xs font-bold tracking-widest uppercase mb-3"
          >
            $0 Down Options Available
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-bold text-[#0a1628] leading-tight mb-3"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
          >
            Get Approved<br />For a Vehicle
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
            className="text-[#4a5568] text-lg mb-7"
          >
            No Matter Your Credit or Situation
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.44 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {['Bad Credit', 'No Credit', 'Bankruptcy', 'Collections'].map(t => (
              <span key={t} className="bg-[#0a1628] text-white text-xs px-4 py-1.5 rounded-full">✓ {t}</span>
            ))}
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.56, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(10,22,40,0.22)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => goTo(1)}
            className="bg-[#0a1628] text-white font-bold text-lg px-10 py-4 rounded-full shadow-2xl"
          >
            Begin My Journey →
          </motion.button>
        </div>
      )

      case 1: return (
        <>
          <QH>What are you looking for?</QH>
          <div className="flex flex-wrap gap-2">
            {VTYPES.map((t, i) => <Pill key={t} label={t} sel={form.vehicleType === t} onClick={() => pick('vehicleType', t)} delay={i * 0.05} />)}
          </div>
        </>
      )

      case 2: return (
        <>
          <QH>Which brand catches your eye?</QH>
          <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1 pb-1">
            {BRANDS.map((b, i) => <Pill key={b} label={b} sel={form.vehicleBrand === b} onClick={() => pick('vehicleBrand', b)} delay={Math.min(i * 0.02, 0.3)} />)}
          </div>
        </>
      )

      case 3: return (
        <>
          <QH>What&apos;s your name?</QH>
          <div className="flex flex-col gap-3 w-full">
            <Inp ph="First name" val={form.firstName} onChange={v => set('firstName', v)} delay={0.1} />
            <Inp ph="Last name"  val={form.lastName}  onChange={v => set('lastName',  v)} delay={0.18} />
          </div>
          <ContBtn onClick={next} disabled={!canNext()} />
        </>
      )

      case 4: return (
        <>
          <QH>Your email address?</QH>
          <Inp ph="you@email.com" val={form.email} onChange={v => set('email', v)} type="email" delay={0.1} />
          <ContBtn onClick={next} disabled={!canNext()} />
        </>
      )

      case 5: return (
        <>
          <QH>Best phone number?</QH>
          <Inp ph="(555) 123-4567" val={form.phone} onChange={v => set('phone', v)} type="tel" delay={0.1} />
          <ContBtn onClick={next} disabled={!canNext()} />
        </>
      )

      case 6: return (
        <>
          <QH>Are you a Canadian resident?</QH>
          <div className="flex gap-3">
            {['Yes', 'No'].map((v, i) => <Pill key={v} label={v} sel={form.isCanadian === v} onClick={() => pick('isCanadian', v)} delay={i * 0.1} />)}
          </div>
        </>
      )

      case 7: return (
        <>
          <QH>Interested in $0 down?</QH>
          <p className="text-[#6b7280] text-sm -mt-3 mb-4">No down payment required</p>
          <div className="flex gap-3">
            {['Yes', 'No'].map((v, i) => <Pill key={v} label={v} sel={form.zeroDown === v} onClick={() => pick('zeroDown', v)} delay={i * 0.1} />)}
          </div>
        </>
      )

      case 8: return (
        <>
          <QH>Your age range?</QH>
          <div className="flex flex-wrap gap-2">
            {AGES.map((a, i) => <Pill key={a} label={a} sel={form.ageRange === a} onClick={() => pick('ageRange', a)} delay={i * 0.07} />)}
          </div>
        </>
      )

      case 9: return (
        <>
          <QH>Where are you located?</QH>
          <div className="flex flex-col gap-3 w-full">
            <Inp ph="Street address"              val={form.street}     onChange={v => set('street',     v)} delay={0.08} />
            <Inp ph="City"                        val={form.city}       onChange={v => set('city',       v)} delay={0.14} />
            <motion.select
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              value={form.province}
              onChange={e => set('province', e.target.value)}
              className="w-full bg-white border border-[#e0d4c0] rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:border-[#F5C842] text-sm"
            >
              <option value="">Select province…</option>
              {PROVS.map(p => <option key={p} value={p}>{p}</option>)}
            </motion.select>
            <Inp ph="Postal code (e.g. A1B 2C3)"  val={form.postalCode} onChange={v => set('postalCode', v)} delay={0.26} />
          </div>
          <ContBtn onClick={next} disabled={!canNext()} />
        </>
      )

      case 10: return (
        <>
          <QH>How do you earn your income?</QH>
          <div className="flex flex-wrap gap-2">
            {EMPLS.map((e, i) => <Pill key={e} label={e} sel={form.employment === e} onClick={() => pick('employment', e)} delay={i * 0.07} />)}
          </div>
        </>
      )

      case 11: return (
        <>
          <QH>Tell us about your work</QH>
          <div className="flex flex-col gap-3 w-full">
            <Inp ph="Employer name"                  val={form.employerName} onChange={v => set('employerName', v)} delay={0.08} />
            <Inp ph="Job title"                      val={form.jobTitle}     onChange={v => set('jobTitle',     v)} delay={0.15} />
            <Inp ph="Time at this job (e.g. 2 yrs)"  val={form.timeAtJob}    onChange={v => set('timeAtJob',    v)} delay={0.22} />
          </div>
          <ContBtn onClick={next} disabled={!canNext()} />
        </>
      )

      case 12: return (
        <>
          <QH>How are you paid?</QH>
          <div className="flex flex-wrap gap-2">
            {ITYPES.map((t, i) => <Pill key={t} label={t} sel={form.incomeType === t} onClick={() => pick('incomeType', t)} delay={i * 0.07} />)}
          </div>
        </>
      )

      case 13: return (
        <>
          <QH>Monthly income &amp; stability</QH>
          <div className="flex flex-col gap-3 w-full">
            <Inp ph="Monthly amount (e.g. $3,500)"    val={form.incomeAmount}    onChange={v => set('incomeAmount',    v)} delay={0.1}  />
            <Inp ph="How long at this income level?"  val={form.incomeStability} onChange={v => set('incomeStability', v)} delay={0.18} />
          </div>
          <ContBtn onClick={next} disabled={!canNext()} />
        </>
      )

      case 14: return (
        <>
          <QH>Your housing situation?</QH>
          <div className="flex flex-wrap gap-2">
            {HOUSE.map((h, i) => <Pill key={h} label={h} sel={form.housingType === h} onClick={() => pick('housingType', h)} delay={i * 0.08} />)}
          </div>
        </>
      )

      case 15: return (
        <>
          <QH>Monthly car payment budget?</QH>
          <div className="flex flex-wrap gap-2">
            {BUDGET.map((b, i) => <Pill key={b} label={b} sel={form.monthlyBudget === b} onClick={() => pick('monthlyBudget', b)} delay={i * 0.08} />)}
          </div>
        </>
      )

      case 16: return (
        <>
          <QH>How&apos;s your credit?</QH>
          <div className="flex flex-wrap gap-2">
            {CREDIT.map((c, i) => <Pill key={c} label={c} sel={form.creditScore === c} onClick={() => pick('creditScore', c)} delay={i * 0.08} />)}
          </div>
        </>
      )

      case 17: return (
        <>
          <QH>Best time to reach you?</QH>
          <div className="flex flex-wrap gap-2">
            {CTIMES.map((t, i) => <Pill key={t} label={t} sel={form.contactTime === t} onClick={() => pick('contactTime', t)} delay={i * 0.1} />)}
          </div>
        </>
      )

      case 18: return <Step18 form={form} />

      default: return null
    }
  }

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    /* 1900vh scroll space — each of 19 steps occupies 100vh */
    <div style={{ height: '1900vh' }}>

      {/* Sticky viewport — stays fixed while outer div scrolls */}
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FFFBF5 0%, #FFF3E0 60%, #FFF8ED 100%)' }}
      >

        {/* ── Ghost text: huge decorative word behind content ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" style={{ zIndex: 0 }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={ghost}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 0.034, scale: 1 }}
              exit={{ opacity: 0, scale: 1.07 }}
              transition={{ duration: 0.7 }}
              className="font-black text-[#0a1628] whitespace-nowrap"
              style={{ fontSize: 'clamp(5rem, 22vw, 20rem)', letterSpacing: '-0.03em' }}
            >
              {ghost}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── Floating car ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ zIndex: 5 }}
          animate={{ left: car.x, top: car.y, scale: car.sc, rotate: car.r }}
          transition={{ duration: 0.95, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Center on anchor point, then float */}
          <div style={{ transform: 'translate(-50%, -50%)' }}>
            <motion.div
              animate={{ y: [0, -11, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={car.img}
                  src={`/images/${car.img}.png`}
                  alt="Vehicle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  draggable={false}
                  style={{
                    width: mobile ? 'clamp(180px, 60vw, 300px)' : 'clamp(300px, 38vw, 580px)',
                    height: 'auto',
                    filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.18)) drop-shadow(0 8px 24px rgba(0,0,0,0.1))',
                    userSelect: 'none',
                  }}
                />
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Gold progress bar ── */}
        {step > 0 && step < 18 && (
          <div className="fixed top-0 left-0 right-0 z-50" style={{ height: 3, background: '#f0e8d8' }}>
            <motion.div
              className="h-full"
              animate={{ width: `${(step / 17) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ background: '#F5C842', boxShadow: '0 0 8px rgba(245,200,66,0.55)' }}
            />
          </div>
        )}

        {/* ── Back button ── */}
        {step > 0 && step < 18 && (
          <button
            onClick={back}
            className="fixed top-4 left-4 z-50 text-[#6b7280] hover:text-[#0a1628] text-xs flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#e0d4c0] shadow-sm transition-colors"
          >
            ← Back
          </button>
        )}

        {/* ── Step counter ── */}
        {step > 0 && step < 18 && (
          <div className="fixed top-4 right-4 z-50 text-[#9a8a7a] text-xs bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#e0d4c0] shadow-sm">
            {step} / 17
          </div>
        )}

        {/* ── Question card
              Full-inset absolute flex container so we avoid CSS transform conflicts.
              AnimatePresence keys on step so old card fades out before new fades in.
        ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            style={{ ...cardContainer(pos, mobile), zIndex: 20 }}
          >
            <div
              style={{
                maxWidth: pos === 'center' ? 640 : (mobile ? 'calc(100vw - 2rem)' : 420),
                width: '100%',
                pointerEvents: 'auto',
              }}
            >
              {pos === 'center' ? (
                /* Hero + success: text sits directly on cream bg, no card */
                <div className="text-center">
                  {renderContent()}
                </div>
              ) : (
                /* All other steps: frosted white card */
                <div
                  className="rounded-2xl border border-[#e8dfd0] p-6"
                  style={{
                    background: 'rgba(255,252,248,0.92)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {renderContent()}
                  {isTextStep && (
                    <p className="text-[#c0b0a0] text-xs mt-3">You can also scroll to advance</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Scroll nudge on hero ── */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="text-[#9a8a7a] text-xs tracking-wide">scroll to explore</span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-8 rounded-full"
              style={{ background: 'linear-gradient(to bottom, #9a8a7a, transparent)' }}
            />
          </motion.div>
        )}

      </div>{/* /sticky */}
    </div>
  )
}
