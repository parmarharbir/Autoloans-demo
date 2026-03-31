'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ======================================================
   TYPES
====================================================== */

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

type QPos = 'center' | 'bot-left' | 'bot-right' | 'top-left' | 'top-right' | 'bot-center'

/* ======================================================
   CONSTANTS
====================================================== */

const TOTAL_FRAMES = 240
const PX_PER_FRAME = 20
const TOTAL_SCROLL = TOTAL_FRAMES * PX_PER_FRAME

const EMPTY: FormData = {
  vehicleType: '', vehicleBrand: '', firstName: '', lastName: '',
  email: '', phone: '', isCanadian: '', zeroDown: '', ageRange: '',
  street: '', city: '', province: '', postalCode: '',
  employment: '', employerName: '', jobTitle: '', timeAtJob: '',
  incomeType: '', incomeAmount: '', incomeStability: '',
  housingType: '', monthlyBudget: '', creditScore: '', contactTime: '',
}

const BRANDS = [
  'Toyota','Honda','Ford','Chevrolet','Dodge','RAM','GMC','Nissan','Hyundai','Kia',
  'Jeep','Mazda','Subaru','Volkswagen','BMW','Mercedes-Benz','Audi','Lexus','Infiniti','Acura',
  'Volvo','Cadillac','Buick','Lincoln','Chrysler','Mitsubishi','Land Rover','Porsche','Tesla','Other'
]

/* ======================================================
   STEP DEFINITIONS
====================================================== */

interface StepDef {
  frame: number
  pos: QPos
  id: string
}

const STEPS: StepDef[] = [
  { frame: 13,  pos: 'bot-left',   id: 'vehicleType' },
  { frame: 26,  pos: 'bot-right',  id: 'vehicleBrand' },
  { frame: 39,  pos: 'top-left',   id: 'name' },
  { frame: 52,  pos: 'top-right',  id: 'email' },
  { frame: 65,  pos: 'bot-center', id: 'phone' },
  { frame: 78,  pos: 'top-left',   id: 'isCanadian' },
  { frame: 91,  pos: 'top-right',  id: 'zeroDown' },
  { frame: 104, pos: 'bot-left',   id: 'ageRange' },
  { frame: 117, pos: 'bot-right',  id: 'address' },
  { frame: 130, pos: 'top-left',   id: 'employment' },
  { frame: 143, pos: 'top-right',  id: 'jobDetails' },
  { frame: 156, pos: 'bot-left',   id: 'incomeType' },
  { frame: 169, pos: 'bot-right',  id: 'incomeAmount' },
  { frame: 182, pos: 'top-left',   id: 'housingType' },
  { frame: 195, pos: 'top-right',  id: 'monthlyBudget' },
  { frame: 208, pos: 'bot-left',   id: 'creditScore' },
  { frame: 221, pos: 'bot-right',  id: 'contactTime' },
  { frame: 234, pos: 'center',     id: 'success' },
]

/* ======================================================
   HELPERS
====================================================== */

function frameSrc(n: number) {
  return '/frames/frame_' + String(n).padStart(4, '0') + '.jpg'
}

function scrollToFrame(frame: number) {
  window.scrollTo({ top: (frame - 1) * PX_PER_FRAME, behavior: 'smooth' })
}

/* ======================================================
   POSITION STYLES
====================================================== */

const posStyle: Record<QPos, React.CSSProperties> = {
  center:     { top: '50%', left: '50%', transform: 'translate(-50%,-50%)', maxWidth: 480 },
  'bot-left': { bottom: 32, left: 32, maxWidth: 380 },
  'bot-right':{ bottom: 32, right: 32, maxWidth: 380 },
  'top-left': { top: 32, left: 32, maxWidth: 380 },
  'top-right':{ top: 32, right: 32, maxWidth: 380 },
  'bot-center':{ bottom: 32, left: '50%', transform: 'translateX(-50%)', maxWidth: 380 },
}

/* ======================================================
   CARD COMPONENT
====================================================== */

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,250,240,0.92)',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  fontFamily: 'var(--font-inter), sans-serif',
}

function Card({ pos, children }: { pos: QPos; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ position: 'absolute', ...posStyle[pos], ...cardStyle, zIndex: 20 }}
    >
      {children}
    </motion.div>
  )
}

/* ======================================================
   PILL BUTTON
====================================================== */

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: 24,
        border: selected ? '2px solid #b45309' : '2px solid #d6c9b0',
        background: selected ? '#b45309' : 'transparent',
        color: selected ? '#fff' : '#374151',
        cursor: 'pointer',
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: 14,
        fontWeight: selected ? 600 : 400,
        transition: 'all 0.15s',
        margin: '4px',
      }}
    >
      {label}
    </button>
  )
}

/* ======================================================
   CONTINUE BUTTON
====================================================== */

function ContinueBtn({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        marginTop: 16,
        width: '100%',
        padding: '12px 0',
        borderRadius: 12,
        border: 'none',
        background: disabled ? '#d6c9b0' : 'linear-gradient(135deg,#b45309,#92400e)',
        color: '#fff',
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: 15,
        fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'opacity 0.2s',
      }}
    >
      Continue →
    </button>
  )
}

/* ======================================================
   INPUT
====================================================== */

function Input({ placeholder, value, onChange, type = 'text' }: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: 10,
        border: '1.5px solid #d6c9b0',
        background: 'rgba(255,255,255,0.8)',
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: 14,
        color: '#1f2937',
        outline: 'none',
        boxSizing: 'border-box',
        marginBottom: 8,
      }}
    />
  )
}

/* ======================================================
   QUESTION LABEL
====================================================== */

function QLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--font-playfair), serif',
      fontSize: 17,
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: 14,
      lineHeight: 1.3,
    }}>
      {children}
    </p>
  )
}

/* ======================================================
   QUESTION PANELS
====================================================== */

interface QPanelProps {
  form: FormData
  setForm: (f: FormData) => void
  onNext: () => void
  stepId: string
  pos: QPos
}

function QuestionPanel({ form, setForm, onNext, stepId, pos }: QPanelProps) {
  const set = (key: keyof FormData) => (val: string) => setForm({ ...form, [key]: val })

  const panels: Record<string, React.ReactNode> = {
    vehicleType: (
      <>
        <QLabel>What are you looking for?</QLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {['Sedan','SUV','Truck','Van','Coupe','Convertible','Electric','Other'].map(v => (
            <Pill key={v} label={v} selected={form.vehicleType === v} onClick={() => {
              setForm({ ...form, vehicleType: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    vehicleBrand: (
      <>
        <QLabel>Which brand?</QLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', maxHeight: 180, overflowY: 'auto' }}>
          {BRANDS.map(v => (
            <Pill key={v} label={v} selected={form.vehicleBrand === v} onClick={() => {
              setForm({ ...form, vehicleBrand: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    name: (
      <>
        <QLabel>What is your name?</QLabel>
        <Input placeholder="First name" value={form.firstName} onChange={set('firstName')} />
        <Input placeholder="Last name" value={form.lastName} onChange={set('lastName')} />
        <ContinueBtn onClick={onNext} disabled={!form.firstName || !form.lastName} />
      </>
    ),
    email: (
      <>
        <QLabel>Your email address?</QLabel>
        <Input placeholder="you@example.com" value={form.email} onChange={set('email')} type="email" />
        <ContinueBtn onClick={onNext} disabled={!form.email} />
      </>
    ),
    phone: (
      <>
        <QLabel>Best phone number?</QLabel>
        <Input placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} type="tel" />
        <ContinueBtn onClick={onNext} disabled={!form.phone} />
      </>
    ),
    isCanadian: (
      <>
        <QLabel>Canadian resident?</QLabel>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {['Yes','No'].map(v => (
            <Pill key={v} label={v} selected={form.isCanadian === v} onClick={() => {
              setForm({ ...form, isCanadian: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    zeroDown: (
      <>
        <QLabel>Zero down payment?</QLabel>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {['Yes','No'].map(v => (
            <Pill key={v} label={v} selected={form.zeroDown === v} onClick={() => {
              setForm({ ...form, zeroDown: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    ageRange: (
      <>
        <QLabel>Age range?</QLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {['18-24','25-34','35-44','45-54','55-64','65+'].map(v => (
            <Pill key={v} label={v} selected={form.ageRange === v} onClick={() => {
              setForm({ ...form, ageRange: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    address: (
      <>
        <QLabel>Where are you located?</QLabel>
        <Input placeholder="Street address" value={form.street} onChange={set('street')} />
        <Input placeholder="City" value={form.city} onChange={set('city')} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Province"
            value={form.province}
            onChange={e => set('province')(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #d6c9b0', background: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-inter),sans-serif', fontSize: 14, color: '#1f2937', outline: 'none', marginBottom: 8 }}
          />
          <input
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={e => set('postalCode')(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #d6c9b0', background: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-inter),sans-serif', fontSize: 14, color: '#1f2937', outline: 'none', marginBottom: 8 }}
          />
        </div>
        <ContinueBtn onClick={onNext} disabled={!form.street || !form.city} />
      </>
    ),
    employment: (
      <>
        <QLabel>How do you earn your income?</QLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {['Employed','Self-Employed','Retired','Disability','Other'].map(v => (
            <Pill key={v} label={v} selected={form.employment === v} onClick={() => {
              setForm({ ...form, employment: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    jobDetails: (
      <>
        <QLabel>Tell us about your work</QLabel>
        <Input placeholder="Employer name" value={form.employerName} onChange={set('employerName')} />
        <Input placeholder="Job title" value={form.jobTitle} onChange={set('jobTitle')} />
        <Input placeholder="Time at job (e.g. 2 years)" value={form.timeAtJob} onChange={set('timeAtJob')} />
        <ContinueBtn onClick={onNext} disabled={!form.employerName} />
      </>
    ),
    incomeType: (
      <>
        <QLabel>How are you paid?</QLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {['Weekly','Bi-Weekly','Semi-Monthly','Monthly','Hourly','Commission','Other'].map(v => (
            <Pill key={v} label={v} selected={form.incomeType === v} onClick={() => {
              setForm({ ...form, incomeType: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    incomeAmount: (
      <>
        <QLabel>Monthly income?</QLabel>
        <Input placeholder="Gross monthly (e.g. $3500)" value={form.incomeAmount} onChange={set('incomeAmount')} />
        <Input placeholder="Net monthly (take-home)" value={form.incomeStability} onChange={set('incomeStability')} />
        <ContinueBtn onClick={onNext} disabled={!form.incomeAmount} />
      </>
    ),
    housingType: (
      <>
        <QLabel>Housing situation?</QLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {['Own','Rent','Live with Family','Other'].map(v => (
            <Pill key={v} label={v} selected={form.housingType === v} onClick={() => {
              setForm({ ...form, housingType: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    monthlyBudget: (
      <>
        <QLabel>Monthly car budget?</QLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {['Under $300','$300–$500','$500–$700','$700–$1000','$1000+'].map(v => (
            <Pill key={v} label={v} selected={form.monthlyBudget === v} onClick={() => {
              setForm({ ...form, monthlyBudget: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    creditScore: (
      <>
        <QLabel>How is your credit?</QLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {['Excellent (750+)','Good (700-749)','Fair (650-699)','Poor (600-649)','Very Poor (<600)','No Credit'].map(v => (
            <Pill key={v} label={v} selected={form.creditScore === v} onClick={() => {
              setForm({ ...form, creditScore: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    contactTime: (
      <>
        <QLabel>Best time to reach you?</QLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {['Morning','Afternoon','Evening','Anytime'].map(v => (
            <Pill key={v} label={v} selected={form.contactTime === v} onClick={() => {
              setForm({ ...form, contactTime: v })
              setTimeout(onNext, 400)
            }} />
          ))}
        </div>
      </>
    ),
    success: (
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 36, marginBottom: 8 }}>🎉</p>
        <p style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 22,
          fontWeight: 700,
          color: '#92400e',
          marginBottom: 8,
        }}>You are Pre-Approved!</p>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
          Our team will contact you shortly to finalize your loan.
        </p>
        <div style={{
          background: 'rgba(180,83,9,0.08)',
          borderRadius: 12,
          padding: '12px 16px',
          textAlign: 'left',
          fontSize: 13,
          color: '#374151',
          lineHeight: 1.7,
        }}>
          <strong>Vehicle:</strong> {form.vehicleType} {form.vehicleBrand && `— ${form.vehicleBrand}`}<br/>
          <strong>Name:</strong> {form.firstName} {form.lastName}<br/>
          <strong>Contact:</strong> {form.phone} · {form.email}<br/>
          <strong>Budget:</strong> {form.monthlyBudget || '—'} / month<br/>
          <strong>Best time:</strong> {form.contactTime || '—'}
        </div>
      </div>
    ),
  }

  const content = panels[stepId]
  if (!content) return null
  return <Card pos={pos}>{content}</Card>
}

/* ======================================================
   PRELOADER
====================================================== */

function FramePreloader({ currentFrame }: { currentFrame: number }) {
  const ahead = 10
  const start = Math.max(1, currentFrame - 2)
  const end = Math.min(TOTAL_FRAMES, currentFrame + ahead)
  const frames: number[] = []
  for (let i = start; i <= end; i++) frames.push(i)

  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden>
      {frames.map(n => (
        <img key={n} src={frameSrc(n)} alt="" loading="eager" style={{ width: 1, height: 1 }} />
      ))}
    </div>
  )
}

/* ======================================================
   MAIN PAGE
====================================================== */

export default function Page() {
  const [frame, setFrame] = useState(1)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [heroComplete, setHeroComplete] = useState(false)
  const [vh, setVh] = useState(800)
  const rafRef = useRef<number | null>(null)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    setVh(window.innerHeight)
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Scroll → frame mapping
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        lastScrollRef.current = scrollY
        const progress = scrollY / TOTAL_SCROLL
        const f = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(progress * TOTAL_FRAMES) + 1))
        setFrame(f)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Determine active step
  const activeStep = (() => {
    if (frame <= 12) return null // hero
    if (frame >= 234) return STEPS[STEPS.length - 1]
    // find the step whose frame is closest and <= current frame
    for (let i = STEPS.length - 1; i >= 0; i--) {
      if (frame >= STEPS[i].frame) return STEPS[i]
    }
    return null
  })()

  const onNext = useCallback(() => {
    if (!activeStep) return
    const idx = STEPS.indexOf(activeStep)
    const nextStep = STEPS[idx + 1]
    if (nextStep) {
      scrollToFrame(nextStep.frame)
    }
  }, [activeStep])

  const showHero = frame <= 12 && !heroComplete

  return (
    <div style={{ position: 'relative', height: TOTAL_SCROLL + vh, background: '#000' }}>
      {/* STICKY VIEWPORT */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* FRAME IMAGE */}
        <img
          src={frameSrc(frame)}
          alt="Scene"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading="eager"
        />

        {/* PRELOADER */}
        <FramePreloader currentFrame={frame} />

        {/* HERO OVERLAY */}
        <AnimatePresence>
          {showHero && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 30,
              }}
            >
              <div style={{ textAlign: 'center', padding: '0 24px', maxWidth: 600 }}>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: 'clamp(32px, 6vw, 52px)',
                    fontWeight: 800,
                    color: '#fff',
                    lineHeight: 1.15,
                    marginBottom: 12,
                  }}
                >
                  Get Approved For<br />a Vehicle
                </motion.h1>
                <motion.p
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: 'clamp(15px, 2.5vw, 20px)',
                    color: 'rgba(255,255,255,0.88)',
                    marginBottom: 28,
                  }}
                >
                  No Matter Your Credit / Situation
                </motion.p>
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 auto 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    maxWidth: 340,
                  }}
                >
                  {[
                    '✓ Bad credit, no credit, bankruptcy — OK',
                    '✓ 30+ Canadian lenders ready to help',
                    '✓ Fast approvals, all provinces',
                    '✓ 100% free, no obligation',
                  ].map(t => (
                    <li key={t} style={{
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.9)',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      padding: '8px 14px',
                      textAlign: 'left',
                    }}>
                      {t}
                    </li>
                  ))}
                </motion.ul>
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setHeroComplete(true)
                    scrollToFrame(13)
                  }}
                  style={{
                    padding: '16px 40px',
                    borderRadius: 50,
                    border: 'none',
                    background: 'linear-gradient(135deg,#f59e0b,#b45309)',
                    color: '#fff',
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: 18,
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.01em',
                    boxShadow: '0 4px 24px rgba(180,83,9,0.4)',
                  }}
                >
                  Begin My Journey →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QUESTION OVERLAYS */}
        <AnimatePresence mode="wait">
          {activeStep && !showHero && (
            <QuestionPanel
              key={activeStep.id}
              form={form}
              setForm={setForm}
              onNext={onNext}
              stepId={activeStep.id}
              pos={activeStep.pos}
            />
          )}
        </AnimatePresence>

        {/* SUCCESS FULL OVERLAY */}
        <AnimatePresence>
          {frame >= 234 && (
            <motion.div
              key="success-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(120,53,15,0.55)',
                zIndex: 10,
              }}
            />
          )}
        </AnimatePresence>

        {/* FRAME COUNTER (dev hint — remove for prod) */}
        {/* <div style={{ position:'absolute', bottom:8, right:8, color:'rgba(255,255,255,0.4)', fontSize:11, fontFamily:'monospace', zIndex:50 }}>
          frame {frame}
        </div> */}
      </div>
    </div>
  )
}
