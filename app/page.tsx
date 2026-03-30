'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 19
const TIMESTAMPS = Array.from({ length: TOTAL_STEPS }, (_, i) =>
  parseFloat(((i / (TOTAL_STEPS - 1)) * 4.8).toFixed(3))
)

const TEXT_SHADOW = '0 2px 12px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)'
const CARD_SHADOW = '0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(245,200,66,0.08)'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  vehicleType: string
  vehicleBrand: string
  firstName: string
  lastName: string
  email: string
  phone: string
  isCanadian: string
  zeroDown: string
  ageRange: string
  street: string
  city: string
  province: string
  postalCode: string
  employment: string
  employerName: string
  jobTitle: string
  timeAtJob: string
  incomeType: string
  incomeAmount: string
  incomeStability: string
  housingType: string
  monthlyBudget: string
  creditScore: string
  contactTime: string
}

const EMPTY_FORM: FormData = {
  vehicleType: '', vehicleBrand: '', firstName: '', lastName: '',
  email: '', phone: '', isCanadian: '', zeroDown: '', ageRange: '',
  street: '', city: '', province: '', postalCode: '',
  employment: '', employerName: '', jobTitle: '', timeAtJob: '',
  incomeType: '', incomeAmount: '', incomeStability: '',
  housingType: '', monthlyBudget: '', creditScore: '', contactTime: '',
}

// ─── Options ──────────────────────────────────────────────────────────────────

const VEHICLE_TYPES  = ['Sedan','SUV','Truck','Van','Coupe','Convertible','Electric','Other']
const VEHICLE_BRANDS = [
  'Toyota','Honda','Ford','Chevrolet','BMW','Mercedes','Audi','Hyundai',
  'Kia','Nissan','Subaru','Volkswagen','Jeep','Ram','GMC','Lexus',
  'Acura','Mazda','Volvo','Tesla','Dodge','Chrysler','Buick','Cadillac',
  'Lincoln','Infiniti','Genesis','Rivian','Lucid','Other',
]
const AGE_RANGES         = ['Under 25','25\u201334','35\u201344','45\u201354','55\u201364','65+']
const PROVINCES          = ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan','Northwest Territories','Nunavut','Yukon']
const EMPLOYMENT_OPTIONS = ['Employed','Self-Employed','Retired','Student','Other']
const INCOME_TYPES       = ['Salary','Hourly','Commission','Business','Pension','Disability','Other']
const HOUSING_TYPES      = ['Own','Rent','Live with family','Other']
const BUDGET_OPTIONS     = ['Under $300','$300\u2013$400','$400\u2013$500','$500\u2013$700','$700+']
const CREDIT_SCORES      = ['Excellent 750+','Good 700\u2013749','Fair 650\u2013699','Poor 600\u2013649','Bad below 600','Not sure']
const CONTACT_TIMES      = ['Morning','Afternoon','Evening','Anytime']

// ─── Shared UI ────────────────────────────────────────────────────────────────

function StepHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
      style={{ fontFamily: 'var(--font-playfair), Georgia, serif', textShadow: TEXT_SHADOW }}
    >
      {children}
    </motion.h2>
  )
}

function PillButton({
  label, selected, onClick, delay = 0,
}: {
  label: string; selected: boolean; onClick: () => void; delay?: number
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={[
        'px-5 py-3 rounded-full text-sm font-medium border transition-all duration-200',
        selected
          ? 'bg-[#F5C842] text-black border-[#F5C842] shadow-lg'
          : 'bg-white/20 text-white border-white/30 backdrop-blur-md hover:bg-white/30',
      ].join(' ')}
    >
      {label}
    </motion.button>
  )
}

function GlassInput({
  placeholder, value, onChange, type = 'text', delay = 0,
}: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string; delay?: number
}) {
  return (
    <motion.input
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/15 backdrop-blur-md border border-white/30 rounded-xl px-4 py-3.5 text-white placeholder-white/50 focus:outline-none focus:border-[#F5C842]/80 focus:bg-white/20 transition-all text-base"
    />
  )
}

function GlassSelect({
  placeholder, value, onChange, options, delay = 0,
}: {
  placeholder: string; value: string; onChange: (v: string) => void; options: string[]; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="relative w-full"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/15 backdrop-blur-md border border-white/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#F5C842]/80 transition-all text-base appearance-none cursor-pointer"
        style={{ colorScheme: 'dark' }}
      >
        <option value="" disabled style={{ background: '#1a1208' }}>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} style={{ background: '#1a1208' }}>{o}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-xs">
        &#9662;
      </div>
    </motion.div>
  )
}

function NextButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      whileHover={!disabled ? { scale: 1.04, boxShadow: '0 8px 32px rgba(245,200,66,0.4)' } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={[
        'mt-7 px-9 py-3.5 rounded-full font-semibold text-base transition-all',
        disabled
          ? 'bg-white/10 text-white/35 cursor-not-allowed border border-white/15'
          : 'bg-[#F5C842] text-black shadow-xl',
      ].join(' ')}
    >
      Continue &#8594;
    </motion.button>
  )
}

// ─── Step Components ──────────────────────────────────────────────────────────

function Step0({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-xl mx-auto">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-[#F5C842] text-sm font-semibold tracking-widest uppercase mb-3"
        style={{ textShadow: TEXT_SHADOW }}
      >
        $0 Down Options Available
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif', textShadow: TEXT_SHADOW }}
      >
        Get Approved For a Vehicle
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="text-white/90 text-lg sm:text-xl mb-8"
        style={{ textShadow: TEXT_SHADOW }}
      >
        No Matter Your Credit or Situation
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.44 }}
        className="flex flex-wrap justify-center gap-2 mb-9"
      >
        {['Bad Credit','No Credit','Bankruptcy','Collections'].map((t) => (
          <span
            key={t}
            className="bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs px-3 py-1.5 rounded-full"
          >
            &#10003; {t}
          </span>
        ))}
      </motion.div>
      <motion.button
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.58, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(245,200,66,0.5)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="bg-[#F5C842] text-black font-bold text-lg px-10 py-4 rounded-full shadow-2xl"
      >
        Begin My Journey &#8594;
      </motion.button>
    </div>
  )
}

function Step1({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-lg mx-auto">
      <StepHeading>What type of vehicle are you looking for?</StepHeading>
      <div className="flex flex-wrap justify-center gap-3 mt-7">
        {VEHICLE_TYPES.map((t, i) => (
          <PillButton key={t} label={t} selected={value === t} onClick={() => onSelect(t)} delay={i * 0.06} />
        ))}
      </div>
    </div>
  )
}

function Step2({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
      <StepHeading>Which brand catches your eye?</StepHeading>
      <div className="flex flex-wrap justify-center gap-2 mt-7 max-h-64 overflow-y-auto px-2 pb-2">
        {VEHICLE_BRANDS.map((b, i) => (
          <PillButton key={b} label={b} selected={value === b} onClick={() => onSelect(b)} delay={Math.min(i * 0.025, 0.4)} />
        ))}
      </div>
    </div>
  )
}

function Step3({ form, onChange }: { form: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-md mx-auto w-full">
      <StepHeading>What&apos;s your name?</StepHeading>
      <div className="flex flex-col gap-4 mt-7 w-full">
        <GlassInput placeholder="First name" value={form.firstName} onChange={(v) => onChange('firstName', v)} delay={0.12} />
        <GlassInput placeholder="Last name"  value={form.lastName}  onChange={(v) => onChange('lastName',  v)} delay={0.22} />
      </div>
    </div>
  )
}

function Step4({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-md mx-auto w-full">
      <StepHeading>What&apos;s your email address?</StepHeading>
      <div className="mt-7 w-full">
        <GlassInput placeholder="your@email.com" value={value} onChange={onChange} type="email" delay={0.12} />
      </div>
    </div>
  )
}

function Step5({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-md mx-auto w-full">
      <StepHeading>What&apos;s your phone number?</StepHeading>
      <div className="mt-7 w-full">
        <GlassInput placeholder="(555) 123-4567" value={value} onChange={onChange} type="tel" delay={0.12} />
      </div>
    </div>
  )
}

function Step6({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-md mx-auto">
      <StepHeading>Are you a Canadian resident?</StepHeading>
      <div className="flex gap-4 mt-7">
        {['Yes','No'].map((v, i) => (
          <PillButton key={v} label={v} selected={value === v} onClick={() => onSelect(v)} delay={i * 0.1} />
        ))}
      </div>
    </div>
  )
}

function Step7({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-md mx-auto">
      <StepHeading>Do you have a down payment?</StepHeading>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22 }}
        className="text-white/65 text-sm mt-2"
        style={{ textShadow: TEXT_SHADOW }}
      >
        $0 down options available
      </motion.p>
      <div className="flex gap-4 mt-6">
        {['Yes','No'].map((v, i) => (
          <PillButton key={v} label={v} selected={value === v} onClick={() => onSelect(v)} delay={i * 0.1} />
        ))}
      </div>
    </div>
  )
}

function Step8({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-lg mx-auto">
      <StepHeading>What&apos;s your age range?</StepHeading>
      <div className="flex flex-wrap justify-center gap-3 mt-7">
        {AGE_RANGES.map((a, i) => (
          <PillButton key={a} label={a} selected={value === a} onClick={() => onSelect(a)} delay={i * 0.07} />
        ))}
      </div>
    </div>
  )
}

function Step9({ form, onChange }: { form: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-md mx-auto w-full">
      <StepHeading>What&apos;s your address?</StepHeading>
      <div className="flex flex-col gap-4 mt-7 w-full">
        <GlassInput placeholder="Street address"              value={form.street}     onChange={(v) => onChange('street',     v)} delay={0.10} />
        <GlassInput placeholder="City"                        value={form.city}       onChange={(v) => onChange('city',       v)} delay={0.16} />
        <GlassSelect placeholder="Select province..."          value={form.province}   onChange={(v) => onChange('province',   v)} options={PROVINCES} delay={0.22} />
        <GlassInput placeholder="Postal code (e.g. A1B 2C3)"  value={form.postalCode} onChange={(v) => onChange('postalCode', v)} delay={0.28} />
      </div>
    </div>
  )
}

function Step10({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-lg mx-auto">
      <StepHeading>What&apos;s your employment status?</StepHeading>
      <div className="flex flex-wrap justify-center gap-3 mt-7">
        {EMPLOYMENT_OPTIONS.map((e, i) => (
          <PillButton key={e} label={e} selected={value === e} onClick={() => onSelect(e)} delay={i * 0.07} />
        ))}
      </div>
    </div>
  )
}

function Step11({ form, onChange }: { form: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-md mx-auto w-full">
      <StepHeading>Tell us about your work</StepHeading>
      <div className="flex flex-col gap-4 mt-7 w-full">
        <GlassInput placeholder="Employer name"                    value={form.employerName} onChange={(v) => onChange('employerName', v)} delay={0.10} />
        <GlassInput placeholder="Job title"                        value={form.jobTitle}     onChange={(v) => onChange('jobTitle',     v)} delay={0.17} />
        <GlassInput placeholder="Time at this job (e.g. 2 years)"  value={form.timeAtJob}    onChange={(v) => onChange('timeAtJob',    v)} delay={0.24} />
      </div>
    </div>
  )
}

function Step12({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-lg mx-auto">
      <StepHeading>What type of income do you receive?</StepHeading>
      <div className="flex flex-wrap justify-center gap-3 mt-7">
        {INCOME_TYPES.map((t, i) => (
          <PillButton key={t} label={t} selected={value === t} onClick={() => onSelect(t)} delay={i * 0.07} />
        ))}
      </div>
    </div>
  )
}

function Step13({ form, onChange }: { form: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-md mx-auto w-full">
      <StepHeading>Tell us about your income</StepHeading>
      <div className="flex flex-col gap-4 mt-7 w-full">
        <GlassInput placeholder="Monthly amount (e.g. $3,500)"       value={form.incomeAmount}    onChange={(v) => onChange('incomeAmount',    v)} delay={0.12} />
        <GlassInput placeholder="How long have you had this income?"  value={form.incomeStability} onChange={(v) => onChange('incomeStability', v)} delay={0.22} />
      </div>
    </div>
  )
}

function Step14({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-lg mx-auto">
      <StepHeading>What&apos;s your housing situation?</StepHeading>
      <div className="flex flex-wrap justify-center gap-3 mt-7">
        {HOUSING_TYPES.map((h, i) => (
          <PillButton key={h} label={h} selected={value === h} onClick={() => onSelect(h)} delay={i * 0.08} />
        ))}
      </div>
    </div>
  )
}

function Step15({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-lg mx-auto">
      <StepHeading>What&apos;s your monthly car budget?</StepHeading>
      <div className="flex flex-wrap justify-center gap-3 mt-7">
        {BUDGET_OPTIONS.map((b, i) => (
          <PillButton key={b} label={b} selected={value === b} onClick={() => onSelect(b)} delay={i * 0.08} />
        ))}
      </div>
    </div>
  )
}

function Step16({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-lg mx-auto">
      <StepHeading>How would you rate your credit?</StepHeading>
      <div className="flex flex-wrap justify-center gap-3 mt-7">
        {CREDIT_SCORES.map((c, i) => (
          <PillButton key={c} label={c} selected={value === c} onClick={() => onSelect(c)} delay={i * 0.08} />
        ))}
      </div>
    </div>
  )
}

function Step17({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center px-6 max-w-lg mx-auto">
      <StepHeading>When&apos;s the best time to reach you?</StepHeading>
      <div className="flex flex-wrap justify-center gap-3 mt-7">
        {CONTACT_TIMES.map((t, i) => (
          <PillButton key={t} label={t} selected={value === t} onClick={() => onSelect(t)} delay={i * 0.1} />
        ))}
      </div>
    </div>
  )
}

function Step18({ form }: { form: FormData }) {
  const confetti = useMemo(() =>
    Array.from({ length: 64 }, (_, i) => ({
      id:       i,
      left:     (i * 7.3)   % 100,
      delay:    (i * 0.127) % 3,
      color:    (['#F5C842','#FFF7DC','#FFD700','#FFFACD','#FFF0A0','#ffffff'] as const)[i % 6],
      width:    5 + (i % 7),
      height:   3 + (i % 4),
      duration: 2.4 + (i % 3) * 0.6,
    }))
  , [])

  const summaryRows: [string, string][] = [
    ['Name',    `${form.firstName} ${form.lastName}`.trim()],
    ['Vehicle', [form.vehicleType, form.vehicleBrand].filter(Boolean).join(' \u2014 ')],
    ['Credit',  form.creditScore],
    ['Budget',  form.monthlyBudget ? `${form.monthlyBudget}/mo` : ''],
    ['Contact', [form.contactTime, form.phone].filter(Boolean).join(' \u00b7 ')],
  ]

  return (
    <div className="flex flex-col items-center text-center px-6 max-w-lg mx-auto">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute rounded-sm"
            style={{
              left:            `${c.left}%`,
              top:             '-12px',
              width:           c.width,
              height:          c.height,
              backgroundColor: c.color,
              animation:       `confettiFall ${c.duration}s ease-in ${c.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, delay: 0.1 }}
        className="text-6xl mb-4 select-none"
      >
        &#127881;
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl sm:text-5xl font-bold text-white mb-2"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif', textShadow: TEXT_SHADOW }}
      >
        You&apos;re Pre-Approved!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[#F5C842] text-base mb-7"
        style={{ textShadow: TEXT_SHADOW }}
      >
        A specialist will contact you shortly
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.62 }}
        className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-6 w-full text-left space-y-3"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <p className="text-[#F5C842] font-semibold text-xs uppercase tracking-widest mb-3">
          Application Summary
        </p>
        {summaryRows.filter(([, v]) => v).map(([label, val]) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <span className="text-white/55">{label}</span>
            <span className="text-white font-medium text-right">{val}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Step position map ────────────────────────────────────────────────────────

interface StepLayout {
  css: React.CSSProperties
  x?: string
  fullOverlay?: boolean
}

const _TL: StepLayout = { css: { top: '10%',    left:   '8%' } }
const _TR: StepLayout = { css: { top: '10%',    right:  '8%' } }
const _BL: StepLayout = { css: { bottom: '15%', left:   '8%' } }
const _BR: StepLayout = { css: { bottom: '15%', right:  '8%' } }
const _TC: StepLayout = { css: { top: '10%',    left: '50%' }, x: '-50%' }
const _BC: StepLayout = { css: { bottom: '15%', left: '50%' }, x: '-50%' }
const _FO: StepLayout = { css: {}, fullOverlay: true }

const STEP_LAYOUTS: StepLayout[] = [
  _FO, // 0  hero
  _TL, // 1
  _TR, // 2
  _BL, // 3
  _BR, // 4
  _TC, // 5
  _BC, // 6
  _TL, // 7
  _TR, // 8
  _BL, // 9
  _BR, // 10
  _TL, // 11
  _TR, // 12
  _BL, // 13
  _BR, // 14
  _TC, // 15
  _BC, // 16
  _TL, // 17
  _FO, // 18 success
]

// ─── Main Funnel ──────────────────────────────────────────────────────────────

export default function FunnelPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const videoRef        = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video  = videoRef.current
    if (!video) return
    const target = TIMESTAMPS[step]
    const doSeek = () => { video.currentTime = target }
    if (video.readyState >= 2) {
      doSeek()
    } else {
      video.addEventListener('canplay', doSeek, { once: true })
    }
    return () => video.removeEventListener('canplay', doSeek)
  }, [step])

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), [])
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), [])

  const setField = useCallback((key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
  }, [])

  const selectAndNext = useCallback((key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setTimeout(next, 190)
  }, [next])

  const isTextStep = [3, 4, 5, 9, 11, 13].includes(step)

  const canContinue = (): boolean => {
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

  const renderStep = () => {
    switch (step) {
      case  0: return <Step0  onNext={next} />
      case  1: return <Step1  value={form.vehicleType}   onSelect={(v) => selectAndNext('vehicleType',   v)} />
      case  2: return <Step2  value={form.vehicleBrand}  onSelect={(v) => selectAndNext('vehicleBrand',  v)} />
      case  3: return <Step3  form={form} onChange={setField} />
      case  4: return <Step4  value={form.email}         onChange={(v) => setField('email',         v)} />
      case  5: return <Step5  value={form.phone}         onChange={(v) => setField('phone',         v)} />
      case  6: return <Step6  value={form.isCanadian}    onSelect={(v) => selectAndNext('isCanadian',    v)} />
      case  7: return <Step7  value={form.zeroDown}      onSelect={(v) => selectAndNext('zeroDown',      v)} />
      case  8: return <Step8  value={form.ageRange}      onSelect={(v) => selectAndNext('ageRange',      v)} />
      case  9: return <Step9  form={form} onChange={setField} />
      case 10: return <Step10 value={form.employment}    onSelect={(v) => selectAndNext('employment',    v)} />
      case 11: return <Step11 form={form} onChange={setField} />
      case 12: return <Step12 value={form.incomeType}    onSelect={(v) => selectAndNext('incomeType',    v)} />
      case 13: return <Step13 form={form} onChange={setField} />
      case 14: return <Step14 value={form.housingType}   onSelect={(v) => selectAndNext('housingType',   v)} />
      case 15: return <Step15 value={form.monthlyBudget} onSelect={(v) => selectAndNext('monthlyBudget', v)} />
      case 16: return <Step16 value={form.creditScore}   onSelect={(v) => selectAndNext('creditScore',   v)} />
      case 17: return <Step17 value={form.contactTime}   onSelect={(v) => selectAndNext('contactTime',   v)} />
      case 18: return <Step18 form={form} />
      default: return null
    }
  }

  const layout = STEP_LAYOUTS[step]

  const motionStyle: React.CSSProperties = layout.fullOverlay
    ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    : { position: 'fixed', zIndex: 10, maxWidth: '420px', width: 'calc(100% - 2rem)', ...layout.css }

  const motionBase = { opacity: 0, y: 44, ...(layout.x ? { x: layout.x } : {}) }
  const motionShow = { opacity: 1, y: 0,  ...(layout.x ? { x: layout.x } : {}) }
  const motionHide = { opacity: 0, y: -32, ...(layout.x ? { x: layout.x } : {}) }

  return (
    <main className="relative w-full h-screen overflow-hidden">

      {/* Video — never unmounted, always rendered, position:fixed z-0 */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        src="/videos/sedan.mp4"
      />

      {/* Warm golden-hour overlay */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(20,10,0,0.28) 0%, rgba(10,5,0,0.10) 40%, rgba(20,10,0,0.44) 100%)',
        }}
      />

      {/* Gold progress bar */}
      {step > 0 && step < 18 && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 20, background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-full bg-[#F5C842]"
            animate={{ width: `${(step / 17) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ boxShadow: '0 0 8px rgba(245,200,66,0.6)' }}
          />
        </div>
      )}

      {/* Back button */}
      {step > 0 && step < 18 && (
        <button
          onClick={back}
          style={{ position: 'fixed', top: '1.25rem', left: '1rem', zIndex: 20 }}
          className="text-white/65 hover:text-white text-xs flex items-center gap-1 transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
        >
          &#8592; Back
        </button>
      )}

      {/* Step counter */}
      {step > 0 && step < 18 && (
        <div
          style={{ position: 'fixed', top: '1.25rem', right: '1rem', zIndex: 20 }}
          className="text-white/50 text-xs bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
        >
          {step} / 17
        </div>
      )}

      {/* Floating step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={motionBase}
          animate={motionShow}
          exit={motionHide}
          transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={motionStyle}
        >
          {layout.fullOverlay ? (
            <div
              className="w-full h-full flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.45) 100%)' }}
            >
              {renderStep()}
            </div>
          ) : (
            <div
              className="backdrop-blur-sm rounded-2xl p-5 w-full flex flex-col items-center"
              style={{ background: 'rgba(0,0,0,0.15)' }}
            >
              {renderStep()}
              {isTextStep && (
                <NextButton onClick={next} disabled={!canContinue()} />
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </main>
  )
}
