'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Dynamic imports (no SSR) ─────────────────────────────────────────────────

const DriveScene = dynamic(() => import('./components/DriveScene'), { ssr: false })

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
  incomeAmount: string
  housingType: string
  monthlyBudget: string
  creditScore: string
  contactTime: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 19

const EMPTY_FORM: FormData = {
  vehicleType: '', vehicleBrand: '', firstName: '', lastName: '',
  email: '', phone: '', isCanadian: '', zeroDown: '', ageRange: '',
  street: '', city: '', province: '', postalCode: '',
  employment: '', incomeAmount: '', housingType: '', monthlyBudget: '',
  creditScore: '', contactTime: '',
}

const VEHICLE_TYPES = [
  { label: 'Sedan',          icon: '🚗' },
  { label: 'SUV',            icon: '🚙' },
  { label: 'Truck',          icon: '🛻' },
  { label: 'Van',            icon: '🚐' },
  { label: 'Coupe',          icon: '🏎' },
  { label: 'Convertible',    icon: '🚘' },
  { label: 'Electric/Hybrid',icon: '⚡' },
  { label: 'Other',          icon: '🚖' },
]

const VEHICLE_BRANDS = [
  'Toyota','Honda','Ford','Chevrolet','Dodge','Hyundai','Kia','Nissan',
  'BMW','Mercedes-Benz','Audi','Volkswagen','Mazda','Subaru','Jeep','RAM',
  'GMC','Chrysler','Buick','Cadillac','Lincoln','Acura','Lexus','Infiniti',
  'Volvo','Land Rover','Porsche','Tesla','Other',
]

const AGE_RANGES         = ['18–24','25–34','35–44','45–54','55–64','65+']
const EMPLOYMENT_OPTIONS = ['Full-time','Part-time','Self-employed','Seasonal','Disability/EI','Retired','Student','Other']
const INCOME_AMOUNTS     = ['Under $1,500/mo','$1,500–$2,500/mo','$2,500–$4,000/mo','$4,000–$6,000/mo','$6,000+/mo']
const HOUSING_TYPES      = ['Own (no mortgage)','Own (with mortgage)','Renting','Living with family','Other']
const BUDGET_OPTIONS     = ['Under $300/mo','$300–$400/mo','$400–$500/mo','$500–$700/mo','$700+/mo']
const CREDIT_SCORES      = ['No credit history','Poor (300–579)','Fair (580–669)','Good (670–739)','Very Good (740–799)','Exceptional (800+)']
const CONTACT_TIMES      = ['Morning (8am–12pm)','Afternoon (12pm–5pm)','Evening (5pm–9pm)','Anytime']
const PROVINCES          = ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan','Northwest Territories','Nunavut','Yukon']

// ─── Scene accent colours (match DriveScene) ──────────────────────────────────

const ACCENT: Record<string, string> = {
  Sedan:            '#2563EB',
  SUV:              '#15803D',
  Truck:            '#C2410C',
  Van:              '#7C3AED',
  Coupe:            '#DC2626',
  Convertible:      '#D97706',
  'Electric/Hybrid':'#0EA5E9',
  Other:            '#4B5563',
  default:          '#6366F1',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return m
}

// ─── Mobile background ────────────────────────────────────────────────────────

const MOBILE_GRADIENTS: Record<string, string> = {
  Sedan:            'linear-gradient(160deg,#0f172a 0%,#1e3a5f 40%,#c2410c 100%)',
  SUV:              'linear-gradient(160deg,#052e16 0%,#166534 50%,#1e40af 100%)',
  Truck:            'linear-gradient(160deg,#1c0700 0%,#7a2c00 45%,#f97316 100%)',
  Van:              'linear-gradient(160deg,#1e1b4b 0%,#4c1d95 50%,#0ea5e9 100%)',
  Coupe:            'linear-gradient(160deg,#0a0a0a 0%,#7f1d1d 50%,#dc2626 100%)',
  Convertible:      'linear-gradient(160deg,#431407 0%,#b45309 50%,#fde68a 100%)',
  'Electric/Hybrid':'linear-gradient(160deg,#020617 0%,#0c1445 50%,#0ea5e9 100%)',
  Other:            'linear-gradient(160deg,#0f172a 0%,#374151 55%,#6b7280 100%)',
  default:          'linear-gradient(160deg,#0f172a 0%,#1e293b 55%,#334155 100%)',
}

const MOBILE_SUCCESS = 'linear-gradient(160deg,#052e16 0%,#166534 45%,#86efac 100%)'

function MobileBg({ vehicleType, isSuccess }: { vehicleType: string; isSuccess: boolean }) {
  const bg = isSuccess
    ? MOBILE_SUCCESS
    : (MOBILE_GRADIENTS[vehicleType] || MOBILE_GRADIENTS.default)
  return (
    <div
      className="absolute inset-0 transition-all duration-[1200ms]"
      style={{ background: bg }}
    >
      {/* Animated road stripes */}
      {!isSuccess && (
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute left-1/2 top-0 w-[3px] h-full bg-white"
            style={{ animation: 'roadScroll 0.5s linear infinite', transform: 'translateX(-50%)' }} />
          <div className="absolute left-[calc(50%-60px)] top-0 w-[3px] h-full bg-white"
            style={{ animation: 'roadScroll 0.5s linear infinite 0.25s' }} />
          <div className="absolute left-[calc(50%+60px)] top-0 w-[3px] h-full bg-white"
            style={{ animation: 'roadScroll 0.5s linear infinite 0.1s' }} />
        </div>
      )}
    </div>
  )
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#FCD34D','#34D399','#60A5FA','#F87171','#A78BFA','#FB923C','#F472B6']

function Confetti() {
  const pieces = useRef(
    Array.from({ length: 68 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${6 + Math.random() * 10}px`,
      height: `${10 + Math.random() * 14}px`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: `${Math.random() * 2.5}s`,
      duration: `${2.8 + Math.random() * 2}s`,
    }))
  ).current

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            background: p.color,
            animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, accent }: { step: number; accent: string }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100)
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-white/50 tracking-widest uppercase">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-xs font-bold" style={{ color: accent }}>{pct}%</span>
      </div>
      <div className="h-[3px] rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: accent }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

const cardVariants = {
  enter:  (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit:   (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0, scale: 0.96 }),
}

function Card({ children, direction }: { children: React.ReactNode; direction: number }) {
  return (
    <motion.div
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

// ─── Pill button ──────────────────────────────────────────────────────────────

function Pill({
  label, icon, selected, accent, onClick,
}: { label: string; icon?: string; selected: boolean; accent: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left"
      style={{
        background: selected ? `${accent}22` : 'rgba(255,255,255,0.07)',
        borderColor: selected ? accent : 'rgba(255,255,255,0.15)',
        color: selected ? '#ffffff' : 'rgba(255,255,255,0.75)',
        boxShadow: selected ? `0 0 0 1px ${accent}, 0 4px 20px ${accent}44` : 'none',
      }}
    >
      {icon && <span className="text-lg leading-none">{icon}</span>}
      <span>{label}</span>
      {selected && <span className="ml-auto text-xs opacity-80">✓</span>}
    </button>
  )
}

// ─── Text input ───────────────────────────────────────────────────────────────

function TextInput({
  value, onChange, placeholder, type = 'text', accent,
}: { value: string; onChange: (v: string) => void; placeholder: string; type?: string; accent: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-5 py-4 rounded-2xl text-base font-medium placeholder-white/30 outline-none transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.07)',
        border: `1.5px solid ${value ? accent : 'rgba(255,255,255,0.15)'}`,
        color: '#ffffff',
        boxShadow: value ? `0 0 0 1px ${accent}55, 0 4px 20px ${accent}33` : 'none',
      }}
    />
  )
}

// ─── Step question wrapper ────────────────────────────────────────────────────

function Q({
  title, subtitle, children,
}: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white leading-tight">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-white/50">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── Individual steps ────────────────────────────────────────────────────────

function Step1({ form, update, onNext }: StepProps) {
  return (
    <Q title="What type of vehicle are you looking for?" subtitle="Choose your ride — it sets the scene.">
      <div className="grid grid-cols-2 gap-2.5">
        {VEHICLE_TYPES.map(v => (
          <Pill
            key={v.label}
            label={v.label}
            icon={v.icon}
            selected={form.vehicleType === v.label}
            accent={ACCENT[v.label] || ACCENT.default}
            onClick={() => { update('vehicleType', v.label); setTimeout(onNext, 260) }}
          />
        ))}
      </div>
    </Q>
  )
}

function Step2({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What brand are you interested in?" subtitle="Any brand — we work with all.">
      <div className="grid grid-cols-2 gap-2">
        {VEHICLE_BRANDS.map(b => (
          <Pill
            key={b}
            label={b}
            selected={form.vehicleBrand === b}
            accent={accent}
            onClick={() => { update('vehicleBrand', b); setTimeout(onNext, 220) }}
          />
        ))}
      </div>
    </Q>
  )
}

function Step3({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your first name?">
      <TextInput value={form.firstName} onChange={v => update('firstName', v)} placeholder="First name" accent={accent} />
      <NextBtn disabled={!form.firstName.trim()} onClick={onNext} accent={accent} />
    </Q>
  )
}

function Step4({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title={`Nice to meet you, ${form.firstName}! Last name?`}>
      <TextInput value={form.lastName} onChange={v => update('lastName', v)} placeholder="Last name" accent={accent} />
      <NextBtn disabled={!form.lastName.trim()} onClick={onNext} accent={accent} />
    </Q>
  )
}

function Step5({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your email address?" subtitle="We'll send your approval details here.">
      <TextInput value={form.email} onChange={v => update('email', v)} placeholder="you@example.com" type="email" accent={accent} />
      <NextBtn disabled={!form.email.includes('@')} onClick={onNext} accent={accent} />
    </Q>
  )
}

function Step6({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your phone number?" subtitle="A specialist will call you with your offer.">
      <TextInput value={form.phone} onChange={v => update('phone', v)} placeholder="(xxx) xxx-xxxx" type="tel" accent={accent} />
      <NextBtn disabled={form.phone.replace(/\D/g, '').length < 10} onClick={onNext} accent={accent} />
    </Q>
  )
}

function Step7({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="Are you a Canadian citizen or permanent resident?">
      <div className="grid grid-cols-2 gap-3">
        {['Yes','No'].map(v => (
          <Pill key={v} label={v} selected={form.isCanadian === v} accent={accent}
            onClick={() => { update('isCanadian', v); setTimeout(onNext, 220) }} />
        ))}
      </div>
    </Q>
  )
}

function Step8({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="Are you interested in $0 down payment?" subtitle="We have programs for all situations.">
      <div className="grid grid-cols-2 gap-3">
        {['Yes, $0 down','No, I have a down payment'].map(v => (
          <Pill key={v} label={v} selected={form.zeroDown === v} accent={accent}
            onClick={() => { update('zeroDown', v); setTimeout(onNext, 220) }} />
        ))}
      </div>
    </Q>
  )
}

function Step9({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your age range?">
      <div className="grid grid-cols-3 gap-2.5">
        {AGE_RANGES.map(a => (
          <Pill key={a} label={a} selected={form.ageRange === a} accent={accent}
            onClick={() => { update('ageRange', a); setTimeout(onNext, 220) }} />
        ))}
      </div>
    </Q>
  )
}

function Step10({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your street address?">
      <TextInput value={form.street} onChange={v => update('street', v)} placeholder="123 Main Street" accent={accent} />
      <NextBtn disabled={!form.street.trim()} onClick={onNext} accent={accent} />
    </Q>
  )
}

function Step11({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What city do you live in?">
      <TextInput value={form.city} onChange={v => update('city', v)} placeholder="City" accent={accent} />
      <NextBtn disabled={!form.city.trim()} onClick={onNext} accent={accent} />
    </Q>
  )
}

function Step12({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="Which province or territory?">
      <div className="grid grid-cols-2 gap-2">
        {PROVINCES.map(p => (
          <Pill key={p} label={p} selected={form.province === p} accent={accent}
            onClick={() => { update('province', p); setTimeout(onNext, 220) }} />
        ))}
      </div>
    </Q>
  )
}

function Step13({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your postal code?">
      <TextInput value={form.postalCode} onChange={v => update('postalCode', v.toUpperCase())} placeholder="A1A 1A1" accent={accent} />
      <NextBtn disabled={form.postalCode.replace(/\s/g, '').length < 6} onClick={onNext} accent={accent} />
    </Q>
  )
}

function Step14({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your employment status?">
      <div className="grid grid-cols-2 gap-2.5">
        {EMPLOYMENT_OPTIONS.map(e => (
          <Pill key={e} label={e} selected={form.employment === e} accent={accent}
            onClick={() => { update('employment', e); setTimeout(onNext, 220) }} />
        ))}
      </div>
    </Q>
  )
}

function Step15({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your monthly income?" subtitle="Before taxes — all income types accepted.">
      <div className="grid grid-cols-1 gap-2.5">
        {INCOME_AMOUNTS.map(i => (
          <Pill key={i} label={i} selected={form.incomeAmount === i} accent={accent}
            onClick={() => { update('incomeAmount', i); setTimeout(onNext, 220) }} />
        ))}
      </div>
    </Q>
  )
}

function Step16({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your current housing situation?">
      <div className="grid grid-cols-1 gap-2.5">
        {HOUSING_TYPES.map(h => (
          <Pill key={h} label={h} selected={form.housingType === h} accent={accent}
            onClick={() => { update('housingType', h); setTimeout(onNext, 220) }} />
        ))}
      </div>
    </Q>
  )
}

function Step17({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your monthly car payment budget?">
      <div className="grid grid-cols-1 gap-2.5">
        {BUDGET_OPTIONS.map(b => (
          <Pill key={b} label={b} selected={form.monthlyBudget === b} accent={accent}
            onClick={() => { update('monthlyBudget', b); setTimeout(onNext, 220) }} />
        ))}
      </div>
    </Q>
  )
}

function Step18({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="What's your approximate credit score?" subtitle="No credit or bad credit? No problem.">
      <div className="grid grid-cols-1 gap-2.5">
        {CREDIT_SCORES.map(c => (
          <Pill key={c} label={c} selected={form.creditScore === c} accent={accent}
            onClick={() => { update('creditScore', c); setTimeout(onNext, 220) }} />
        ))}
      </div>
    </Q>
  )
}

function Step19({ form, update, accent, onNext }: StepProps) {
  return (
    <Q title="When's the best time to reach you?" subtitle="Almost there — one last question.">
      <div className="grid grid-cols-2 gap-2.5">
        {CONTACT_TIMES.map(t => (
          <Pill key={t} label={t} selected={form.contactTime === t} accent={accent}
            onClick={() => { update('contactTime', t); setTimeout(onNext, 260) }} />
        ))}
      </div>
    </Q>
  )
}

// ─── Next button ──────────────────────────────────────────────────────────────

function NextBtn({ onClick, disabled, accent }: { onClick: () => void; disabled: boolean; accent: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 mt-1"
      style={{
        background: disabled ? 'rgba(255,255,255,0.08)' : accent,
        color: disabled ? 'rgba(255,255,255,0.3)' : '#ffffff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : `0 4px 24px ${accent}66`,
      }}
    >
      Continue →
    </button>
  )
}

// ─── Step props type ──────────────────────────────────────────────────────────

interface StepProps {
  form: FormData
  update: (field: keyof FormData, value: string) => void
  accent: string
  onNext: () => void
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ form }: { form: FormData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center px-6 py-12 space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
        style={{ background: 'rgba(16,185,129,0.2)', border: '2px solid #10B981' }}
      >
        🏠
      </motion.div>
      <div>
        <h2 className="text-3xl font-black text-white leading-tight">
          You're Pre-Approved,<br />
          <span style={{ color: '#34D399' }}>{form.firstName}!</span>
        </h2>
        <p className="mt-3 text-white/60 text-sm max-w-xs mx-auto">
          A specialist will call you at your preferred time to confirm your{' '}
          <strong className="text-white">{form.vehicleType || 'vehicle'}</strong> loan details.
        </p>
      </div>
      <div className="w-full max-w-xs rounded-2xl p-4 space-y-2.5"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
        {[
          ['Contact', form.phone || form.email],
          ['Province', form.province],
          ['Credit', form.creditScore],
          ['Budget', form.monthlyBudget],
        ].filter(([, v]) => v).map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-white/40">{label}</span>
            <span className="text-white font-medium">{value}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 text-xs text-white/35">
        <span>🔒 256-bit encrypted</span>
        <span>•</span>
        <span>30+ Canadian lenders</span>
      </div>
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="px-8 py-4 rounded-2xl font-bold text-sm"
        style={{ background: '#10B981', color: '#fff', boxShadow: '0 4px 24px #10B98155' }}
      >
        ✅ Application Submitted
      </motion.div>
    </motion.div>
  )
}

// ─── Main funnel ──────────────────────────────────────────────────────────────

export default function AutoLoansFunnel() {
  const [step, setStep]       = useState(1)
  const [dir, setDir]         = useState(1)
  const [form, setForm]       = useState<FormData>(EMPTY_FORM)
  const [showSuccess, setShowSuccess] = useState(false)
  const isMobile = useIsMobile()

  const accent = ACCENT[form.vehicleType] || ACCENT.default

  const update = useCallback((field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const next = useCallback(() => {
    if (step >= TOTAL_STEPS) {
      setShowSuccess(true)
    } else {
      setDir(1)
      setStep(s => s + 1)
    }
  }, [step])

  const back = useCallback(() => {
    if (step > 1) {
      setDir(-1)
      setStep(s => s - 1)
    }
  }, [step])

  const stepProps: StepProps = { form, update, accent, onNext: next }

  const STEPS: ((props: StepProps) => React.ReactElement)[] = [
    Step1, Step2, Step3, Step4, Step5, Step6, Step7,
    Step8, Step9, Step10, Step11, Step12, Step13,
    Step14, Step15, Step16, Step17, Step18, Step19,
  ]

  const StepComponent = STEPS[step - 1]

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* ── Scene layer ── */}
      {isMobile
        ? <MobileBg vehicleType={form.vehicleType} isSuccess={showSuccess} />
        : <DriveScene vehicleType={form.vehicleType} step={step} isSuccess={showSuccess} />
      }

      {/* ── Gradient overlay so cards are readable ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* ── Confetti ── */}
      {showSuccess && <Confetti />}

      {/* ── Logo ── */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
        <span
          className="text-lg font-black tracking-tight"
          style={{ color: accent, textShadow: `0 0 20px ${accent}88` }}
        >
          autoloans<span className="text-white">.ca</span>
        </span>
      </div>

      {/* ── Trust badge ── */}
      <div className="absolute top-4 right-4 z-30 hidden sm:flex items-center gap-1.5 text-xs text-white/40">
        <span>🔒</span>
        <span>256-bit SSL</span>
      </div>

      {/* ── Main panel ── */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-6 px-4 pt-2">
        <div className="w-full max-w-lg">
          {!showSuccess ? (
            <>
              <ProgressBar step={step} accent={accent} />
              <div
                className="rounded-3xl p-6 overflow-y-auto"
                style={{
                  background: 'rgba(10,10,15,0.72)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  maxHeight: 'calc(100dvh - 100px)',
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 24px 48px rgba(0,0,0,0.6), 0 0 60px ${accent}22`,
                }}
              >
                {/* Step content */}
                <AnimatePresence mode="wait" custom={dir}>
                  <Card key={step} direction={dir}>
                    <StepComponent {...stepProps} />
                  </Card>
                </AnimatePresence>

                {/* Back button */}
                {step > 1 && (
                  <button
                    onClick={back}
                    className="mt-5 w-full py-2.5 rounded-xl text-sm text-white/35 hover:text-white/60 transition-colors"
                  >
                    ← Back
                  </button>
                )}
              </div>
            </>
          ) : (
            <div
              className="rounded-3xl overflow-y-auto"
              style={{
                background: 'rgba(10,10,15,0.82)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(16,185,129,0.3)',
                maxHeight: 'calc(100dvh - 80px)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.7), 0 0 60px rgba(16,185,129,0.2)',
              }}
            >
              <SuccessScreen form={form} />
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom trust strip ── */}
      {!showSuccess && (
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center gap-5 pb-2 text-[10px] text-white/20 pointer-events-none">
          <span>99% Approval Rate</span>
          <span>·</span>
          <span>30+ Lenders</span>
          <span>·</span>
          <span>All Provinces</span>
        </div>
      )}
    </div>
  )
}
