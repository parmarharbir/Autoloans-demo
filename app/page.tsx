'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

// ─── Types ───────────────────────────────────────────────────────────────────

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
  company: string
  jobTitle: string
  incomeType: string
  incomeAmount: string
  incomeStability: string
  housingType: string
  housingPayment: string
  monthlyBudget: string
  creditScore: string
  contactTime: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 19

const ROAD_IMAGES: Record<string, string> = {
  default:           'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1400&q=85',
  Sedan:             'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=85',
  SUV:               'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85',
  Truck:             'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1400&q=85',
  Van:               'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=85',
  Coupe:             'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
  Convertible:       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=85',
  'Electric/Hybrid': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=85',
  Other:             'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1400&q=85',
}

const HOME_IMAGE = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=85'

const CAR_IMAGES: Record<string, string> = {
  default:           'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=85',
  Sedan:             'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=85',
  SUV:               'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=85',
  Truck:             'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=85',
  Van:               'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=85',
  Coupe:             'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=85',
  Convertible:       'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=600&q=85',
  'Electric/Hybrid': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=85',
  Other:             'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=85',
}

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Northwest Territories', 'Nunavut', 'Yukon',
]

const VEHICLE_TYPES = ['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Convertible', 'Electric/Hybrid', 'Other']

const VEHICLE_BRANDS = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Dodge', 'Hyundai', 'Kia', 'Nissan',
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Mazda', 'Subaru', 'Jeep', 'RAM',
  'GMC', 'Chrysler', 'Pontiac', 'Buick', 'Cadillac', 'Lincoln', 'Acura', 'Lexus',
  'Infiniti', 'Volvo', 'Land Rover', 'Porsche', 'Tesla', 'Other',
]

const AGE_RANGES         = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+']
const EMPLOYMENT_OPTIONS = ['Full-time', 'Part-time', 'Self-employed', 'Seasonal', 'Disability/EI', 'Retired', 'Student', 'Other']
const INCOME_TYPES       = ['Salary', 'Hourly', 'Self-employed', 'Pension', 'Disability', 'EI / Social Assistance', 'Other']
const INCOME_AMOUNTS     = ['Under $1,500/mo', '$1,500–$2,500/mo', '$2,500–$4,000/mo', '$4,000–$6,000/mo', '$6,000+/mo']
const INCOME_STABILITY   = ['< 3 months', '3–6 months', '6–12 months', '1–2 years', '2+ years']
const HOUSING_TYPES      = ['Own (no mortgage)', 'Own (with mortgage)', 'Renting', 'Living with family', 'Other']
const BUDGET_OPTIONS     = ['Under $300/mo', '$300–$400/mo', '$400–$500/mo', '$500–$700/mo', '$700+/mo']
const CREDIT_SCORES      = ['No credit history', 'Poor (300–579)', 'Fair (580–669)', 'Good (670–739)', 'Very Good (740–799)', 'Exceptional (800+)']
const CONTACT_TIMES      = ['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–9pm)', 'Anytime']

const EMPTY_FORM: FormData = {
  vehicleType: '', vehicleBrand: '', firstName: '', lastName: '',
  email: '', phone: '', isCanadian: '', zeroDown: '', ageRange: '',
  street: '', city: '', province: '', postalCode: '',
  employment: '', company: '', jobTitle: '', incomeType: '',
  incomeAmount: '', incomeStability: '', housingType: '', housingPayment: '',
  monthlyBudget: '', creditScore: '', contactTime: '',
}

// ─── Confetti ────────────────────────────────────────────────────────────────

function Confetti() {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#06b6d4'][i % 8],
    left: `${(i / 50) * 100 + (Math.random() - 0.5) * 4}%`,
    delay: `${(i % 14) * 0.13}s`,
    size: `${5 + (i % 5) * 2}px`,
    duration: `${2.0 + (i % 8) * 0.28}s`,
    round: i % 3 !== 0,
  }))
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 30 }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-12px',
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Driving Scene ────────────────────────────────────────────────────────────

interface DrivingSceneProps {
  vehicleType: string
  isSuccess: boolean
  carRef: React.RefObject<HTMLDivElement>
}

function DrivingScene({ vehicleType, isSuccess, carRef }: DrivingSceneProps) {
  const roadImg = ROAD_IMAGES[vehicleType] ?? ROAD_IMAGES.default
  const carImg  = CAR_IMAGES[vehicleType]  ?? CAR_IMAGES.default

  return (
    <div style={{
      position: 'relative',
      height: '45%',
      flexShrink: 0,
      overflow: 'hidden',
      background: '#060610',
    }}>

      {/* Road — animated pan at 120% width */}
      <AnimatePresence>
        <motion.div
          key={roadImg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '120%',
            height: '100%',
            animation: isSuccess ? 'none' : 'roadPan 25s linear infinite',
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={roadImg}
              alt="Scenic road"
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="120vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Home image — crossfades in on success */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: isSuccess ? 1 : 0,
        transition: 'opacity 2s ease',
        zIndex: 2,
      }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src={HOME_IMAGE}
            alt="Beautiful home"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
            sizes="100vw"
          />
        </div>
      </div>

      {/* Bottom gradient fade into card */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '48%',
        background: 'linear-gradient(to bottom, transparent, rgba(8,8,20,0.92))',
        zIndex: 5,
        pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.48) 100%)',
        zIndex: 4,
        pointerEvents: 'none',
      }} />

      {/* Lens flare */}
      <div style={{
        position: 'absolute',
        top: '9%',
        right: '7%',
        width: '140px',
        height: '140px',
        background: 'radial-gradient(circle, rgba(255,255,220,0.58) 0%, rgba(255,200,80,0.18) 45%, transparent 70%)',
        borderRadius: '50%',
        animation: 'lensFlare 4s ease-in-out infinite',
        zIndex: 6,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }} />

      {/* Speed lines */}
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top: `${20 + i * 14}%`,
            width: `${65 + i * 28}px`,
            height: '1.5px',
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '2px',
            animation: `speedLine ${1.0 + i * 0.38}s linear infinite`,
            animationDelay: `${i * 0.25}s`,
            zIndex: 6,
            pointerEvents: 'none',
            transformOrigin: 'left center',
          }}
        />
      ))}

      {/* Car */}
      <div
        ref={carRef}
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '3%',
          width: '44%',
          maxWidth: '500px',
          height: '155px',
          animation: isSuccess ? 'none' : 'carBob 2s ease-in-out infinite',
          zIndex: 8,
          filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.75))',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <AnimatePresence>
            <motion.div
              key={carImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src={carImg}
                alt="Your vehicle"
                fill
                style={{ objectFit: 'contain', objectPosition: 'bottom left' }}
                sizes="44vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Confetti on success */}
      {isSuccess && <Confetti />}

    </div>
  )
}

// ─── UI Atoms ─────────────────────────────────────────────────────────────────

function PillOpt({ label, selected, onClick, compact }: {
  label: string
  selected: boolean
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)',
        border: `1px solid ${selected ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.12)'}`,
        boxShadow: selected ? '0 0 20px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
        borderRadius: '14px',
        padding: compact ? '10px 13px' : '16px 20px',
        color: selected ? 'white' : 'rgba(255,255,255,0.82)',
        fontSize: compact ? '13px' : '15px',
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        textAlign: 'left' as const,
        width: '100%',
        lineHeight: 1.3,
      }}
      onMouseEnter={e => {
        if (!selected) {
          const el = e.currentTarget
          el.style.background = 'rgba(255,255,255,0.14)'
          el.style.borderColor = 'rgba(255,255,255,0.32)'
          el.style.transform = 'scale(1.02)'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          const el = e.currentTarget
          el.style.background = 'rgba(255,255,255,0.07)'
          el.style.borderColor = 'rgba(255,255,255,0.12)'
          el.style.transform = 'scale(1)'
        }
      }}
    >
      {label}
    </button>
  )
}

function TxtInput({ label, value, onChange, type = 'text', placeholder }: {
  label?: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '14px 16px',
          color: 'white',
          fontSize: '15px',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box' as const,
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.7)'
          e.currentTarget.style.boxShadow = '0 0 16px rgba(99,102,241,0.18)'
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}

function SelectInput({ label, value, onChange, options }: {
  label?: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
        }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: 'rgba(14,14,30,0.98)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '14px 16px',
          color: value ? 'white' : 'rgba(255,255,255,0.32)',
          fontSize: '15px',
          outline: 'none',
          width: '100%',
          cursor: 'pointer',
          appearance: 'none' as const,
        }}
      >
        <option value="" style={{ color: 'rgba(200,200,200,0.6)', background: '#0e0e1e' }}>Select…</option>
        {options.map(o => (
          <option key={o} value={o} style={{ color: 'white', background: '#0e0e1e' }}>{o}</option>
        ))}
      </select>
    </div>
  )
}

function ContBtn({ onClick, disabled = false, children }: {
  onClick: () => void
  disabled?: boolean
  children?: React.ReactNode
}) {
  const label = children ?? 'Continue →'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: '56px',
        background: disabled ? 'rgba(99,102,241,0.2)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        boxShadow: disabled ? 'none' : '0 0 32px rgba(99,102,241,0.5), 0 4px 20px rgba(0,0,0,0.35)',
        borderRadius: '14px',
        border: 'none',
        color: disabled ? 'rgba(255,255,255,0.3)' : 'white',
        fontSize: '16px',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {label}
    </button>
  )
}

// ─── Step Content ─────────────────────────────────────────────────────────────

interface StepProps {
  step: number
  formData: FormData
  update: (field: keyof FormData, value: string) => void
  onNext: () => void
  onVehicleSelect: (type: string) => void
}

function StepContent({ step, formData, update, onNext, onVehicleSelect }: StepProps) {
  const col2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
  const col3: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }
  const col1: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' }

  switch (step) {

    // ── Step 0: Landing ──────────────────────────────────────────────────────
    case 0:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(99,102,241,0.16)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '20px', padding: '5px 12px', marginBottom: '14px',
              fontSize: '11px', color: 'rgba(180,180,255,0.9)', fontWeight: 700, letterSpacing: '0.07em',
            }}>
              🇨🇦 CANADA&apos;S #1 AUTO LOAN NETWORK
            </div>
            <h1 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
              Get Approved Today.<br />
              <span style={{
                background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Bad Credit Welcome.
              </span>
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
            30+ lenders competing for your business. 2-minute application.
            Same-day decisions across all Canadian provinces.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
            {['✓ No credit check to apply', '✓ All credit types', '✓ Same-day approval'].map(t => (
              <div key={t} style={{
                background: 'rgba(99,102,241,0.11)', border: '1px solid rgba(99,102,241,0.26)',
                borderRadius: '20px', padding: '5px 12px', fontSize: '12px', color: 'rgba(190,190,255,0.85)',
              }}>
                {t}
              </div>
            ))}
          </div>
          <ContBtn onClick={onNext}>Start My Application →</ContBtn>
          <p style={{ textAlign: 'center' as const, color: 'rgba(255,255,255,0.24)', fontSize: '11px', margin: 0 }}>
            Free to apply · No obligation · 100% Canadian
          </p>
        </div>
      )

    // ── Step 1: Vehicle Type ──────────────────────────────────────────────────
    case 1:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>What type of vehicle?</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              Pick one and watch your road change.
            </p>
          </div>
          <div style={col2}>
            {VEHICLE_TYPES.map(type => (
              <PillOpt
                key={type}
                label={type}
                selected={formData.vehicleType === type}
                onClick={() => { update('vehicleType', type); onVehicleSelect(type) }}
              />
            ))}
          </div>
          {formData.vehicleType && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
              <ContBtn onClick={onNext} />
            </motion.div>
          )}
        </div>
      )

    // ── Step 2: Vehicle Brand ─────────────────────────────────────────────────
    case 2:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Which brand interests you?</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              Or the brand you&apos;re hoping to get approved for.
            </p>
          </div>
          <div style={col3}>
            {VEHICLE_BRANDS.map(brand => (
              <PillOpt key={brand} label={brand} selected={formData.vehicleBrand === brand}
                onClick={() => update('vehicleBrand', brand)} compact />
            ))}
          </div>
          <ContBtn onClick={onNext} disabled={!formData.vehicleBrand} />
        </div>
      )

    // ── Step 3: Name ──────────────────────────────────────────────────────────
    case 3:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>What&apos;s your name?</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              Lenders will use this to personalize your offer.
            </p>
          </div>
          <div style={col2}>
            <TxtInput label="First name" value={formData.firstName} onChange={v => update('firstName', v)} placeholder="John" />
            <TxtInput label="Last name"  value={formData.lastName}  onChange={v => update('lastName', v)}  placeholder="Smith" />
          </div>
          <ContBtn onClick={onNext} disabled={!formData.firstName || !formData.lastName} />
        </div>
      )

    // ── Step 4: Email ─────────────────────────────────────────────────────────
    case 4:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Your email address?</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              We&apos;ll send your approval details here.
            </p>
          </div>
          <TxtInput type="email" value={formData.email} onChange={v => update('email', v)} placeholder="john@example.com" />
          <ContBtn onClick={onNext} disabled={!formData.email.includes('@')} />
        </div>
      )

    // ── Step 5: Phone ─────────────────────────────────────────────────────────
    case 5:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Best phone number?</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              Our lenders may call with same-day offers.
            </p>
          </div>
          <TxtInput type="tel" value={formData.phone} onChange={v => update('phone', v)} placeholder="(416) 555-0123" />
          <ContBtn onClick={onNext} disabled={formData.phone.replace(/\D/g, '').length < 10} />
        </div>
      )

    // ── Step 6: Canadian Residency ────────────────────────────────────────────
    case 6:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Are you a Canadian resident?</h2>
          <div style={col1}>
            {['Yes, I am a Canadian resident', 'No, I am not currently a resident'].map(opt => (
              <PillOpt key={opt} label={opt} selected={formData.isCanadian === opt}
                onClick={() => { update('isCanadian', opt); setTimeout(onNext, 320) }} />
            ))}
          </div>
        </div>
      )

    // ── Step 7: Zero Down ─────────────────────────────────────────────────────
    case 7:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Interested in $0 down?</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              Many of our lenders offer zero down programs.
            </p>
          </div>
          <div style={col1}>
            {['Yes — I want $0 down', 'No — I have a down payment'].map(opt => (
              <PillOpt key={opt} label={opt} selected={formData.zeroDown === opt}
                onClick={() => { update('zeroDown', opt); setTimeout(onNext, 320) }} />
            ))}
          </div>
        </div>
      )

    // ── Step 8: Age ───────────────────────────────────────────────────────────
    case 8:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Your age range?</h2>
          <div style={col3}>
            {AGE_RANGES.map(age => (
              <PillOpt key={age} label={age} selected={formData.ageRange === age}
                onClick={() => { update('ageRange', age); setTimeout(onNext, 320) }} />
            ))}
          </div>
        </div>
      )

    // ── Step 9: Address ───────────────────────────────────────────────────────
    case 9:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Your current address?</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              Required for lender matching in your province.
            </p>
          </div>
          <TxtInput label="Street address" value={formData.street}     onChange={v => update('street', v)}     placeholder="123 Main Street" />
          <div style={col2}>
            <TxtInput label="City"        value={formData.city}       onChange={v => update('city', v)}       placeholder="Toronto" />
            <TxtInput label="Postal code" value={formData.postalCode} onChange={v => update('postalCode', v)} placeholder="M5V 2T6" />
          </div>
          <SelectInput label="Province" value={formData.province} onChange={v => update('province', v)} options={PROVINCES} />
          <ContBtn onClick={onNext} disabled={!formData.street || !formData.city || !formData.province || !formData.postalCode} />
        </div>
      )

    // ── Step 10: Employment ───────────────────────────────────────────────────
    case 10:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Employment status?</h2>
          <div style={col2}>
            {EMPLOYMENT_OPTIONS.map(opt => (
              <PillOpt key={opt} label={opt} selected={formData.employment === opt}
                onClick={() => { update('employment', opt); setTimeout(onNext, 320) }} />
            ))}
          </div>
        </div>
      )

    // ── Step 11: Company / Job ────────────────────────────────────────────────
    case 11:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Tell us about your job</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              Helps lenders confirm your income stability.
            </p>
          </div>
          <TxtInput label="Company name" value={formData.company}  onChange={v => update('company', v)}  placeholder="Acme Corp" />
          <TxtInput label="Job title"    value={formData.jobTitle} onChange={v => update('jobTitle', v)} placeholder="Sales Manager" />
          <ContBtn onClick={onNext} disabled={!formData.company || !formData.jobTitle} />
        </div>
      )

    // ── Step 12: Income Type ──────────────────────────────────────────────────
    case 12:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>How do you receive income?</h2>
          <div style={col1}>
            {INCOME_TYPES.map(type => (
              <PillOpt key={type} label={type} selected={formData.incomeType === type}
                onClick={() => { update('incomeType', type); setTimeout(onNext, 320) }} />
            ))}
          </div>
        </div>
      )

    // ── Step 13: Income Amount + Stability ───────────────────────────────────
    case 13:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Monthly income?</h2>
          <div style={col1}>
            {INCOME_AMOUNTS.map(amt => (
              <PillOpt key={amt} label={amt} selected={formData.incomeAmount === amt} onClick={() => update('incomeAmount', amt)} />
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 700, margin: '4px 0 0', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
            How long at this income level?
          </p>
          <div style={col2}>
            {INCOME_STABILITY.map(s => (
              <PillOpt key={s} label={s} selected={formData.incomeStability === s} onClick={() => update('incomeStability', s)} compact />
            ))}
          </div>
          <ContBtn onClick={onNext} disabled={!formData.incomeAmount || !formData.incomeStability} />
        </div>
      )

    // ── Step 14: Housing ──────────────────────────────────────────────────────
    case 14:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Current housing situation?</h2>
          <div style={col1}>
            {HOUSING_TYPES.map(type => (
              <PillOpt key={type} label={type} selected={formData.housingType === type} onClick={() => update('housingType', type)} />
            ))}
          </div>
          <TxtInput
            label="Monthly housing payment (optional)"
            value={formData.housingPayment}
            onChange={v => update('housingPayment', v)}
            placeholder="$1,200"
          />
          <ContBtn onClick={onNext} disabled={!formData.housingType} />
        </div>
      )

    // ── Step 15: Monthly Budget ───────────────────────────────────────────────
    case 15:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Monthly car payment budget?</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              We&apos;ll match you with lenders who fit your range.
            </p>
          </div>
          <div style={col1}>
            {BUDGET_OPTIONS.map(opt => (
              <PillOpt key={opt} label={opt} selected={formData.monthlyBudget === opt}
                onClick={() => { update('monthlyBudget', opt); setTimeout(onNext, 320) }} />
            ))}
          </div>
        </div>
      )

    // ── Step 16: Credit Score ─────────────────────────────────────────────────
    case 16:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Credit score range?</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              All credit types accepted — no judgment here.
            </p>
          </div>
          <div style={col1}>
            {CREDIT_SCORES.map(score => (
              <PillOpt key={score} label={score} selected={formData.creditScore === score}
                onClick={() => { update('creditScore', score); setTimeout(onNext, 320) }} />
            ))}
          </div>
        </div>
      )

    // ── Step 17: Contact Time ─────────────────────────────────────────────────
    case 17:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Best time to reach you?</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', margin: 0 }}>
              One last step — almost there!
            </p>
          </div>
          <div style={col1}>
            {CONTACT_TIMES.map(time => (
              <PillOpt key={time} label={time} selected={formData.contactTime === time}
                onClick={() => { update('contactTime', time); setTimeout(onNext, 380) }} />
            ))}
          </div>
        </div>
      )

    // ── Step 18: Success ──────────────────────────────────────────────────────
    case 18:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center' as const }}>
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.12 }}
            style={{ fontSize: '54px', lineHeight: 1 }}
          >
            🎉
          </motion.div>
          <div>
            <h2 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 800, margin: '0 0 8px' }}>
              You&apos;re Pre-Approved{formData.firstName ? `, ${formData.firstName}` : ''}!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              Your application is on its way to our network of{' '}
              <strong style={{ color: '#a78bfa' }}>30+ lenders</strong>.
              Expect a call within <strong style={{ color: '#a78bfa' }}>2–4 hours</strong>.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[
              { icon: '📱', label: 'Check phone',   sub: 'Lenders calling soon' },
              { icon: '📧', label: 'Check email',   sub: formData.email ? formData.email.split('@')[0] + '…' : 'Details incoming' },
              { icon: '🚗', label: 'Start dreaming', sub: formData.vehicleType || 'Your new ride' },
            ].map(item => (
              <motion.div
                key={item.icon}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + 0.1 * ['📱','📧','🚗'].indexOf(item.icon) }}
                style={{
                  background: 'rgba(99,102,241,0.13)',
                  border: '1px solid rgba(99,102,241,0.26)',
                  borderRadius: '16px',
                  padding: '14px 10px',
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '5px' }}>{item.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.42)', marginTop: '2px' }}>{item.sub}</div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            style={{
              background: 'rgba(16,185,129,0.11)',
              border: '1px solid rgba(16,185,129,0.28)',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '13px',
              color: 'rgba(52,211,153,0.88)',
              lineHeight: 1.5,
            }}
          >
            ✓ Application submitted securely · No obligation · Free service
          </motion.div>
        </div>
      )

    default:
      return null
  }
}

// ─── Question Card ────────────────────────────────────────────────────────────

interface QuestionCardProps {
  step: number
  formData: FormData
  update: (field: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
  onVehicleSelect: (type: string) => void
}

function QuestionCard({ step, formData, update, onNext, onBack, onVehicleSelect }: QuestionCardProps) {
  const progress = Math.round((step / (TOTAL_STEPS - 1)) * 100)

  return (
    <div style={{
      flex: 1,
      position: 'relative',
      background: 'rgba(10,10,30,0.88)',
      backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '28px 28px 0 0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0,
    }}>

      {/* Progress bar */}
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', flexShrink: 0, position: 'relative' }}>
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
            boxShadow: '0 0 12px rgba(99,102,241,0.85)',
            borderRadius: '2px',
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Nav bar */}
      {step > 0 && step < 18 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px 0',
          flexShrink: 0,
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '13px',
              padding: '6px 13px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            ← Back
          </button>
          <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: '12px', fontWeight: 500 }}>
            {step} / {TOTAL_STEPS - 1}
          </div>
        </div>
      )}

      {/* Scrollable step content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px 28px',
        paddingTop: step > 0 && step < 18 ? '14px' : '24px',
      }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{
              duration: 0.32,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <StepContent
              step={step}
              formData={formData}
              update={update}
              onNext={onNext}
              onVehicleSelect={onVehicleSelect}
            />
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [step, setStep]               = useState(0)
  const [formData, setFormData]       = useState<FormData>(EMPTY_FORM)
  const [vehicleType, setVehicleType] = useState('default')
  const carRef = useRef<HTMLDivElement>(null)

  // Lock body scroll to prevent page from scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // GSAP: car settles on success
  useEffect(() => {
    const el = carRef.current
    if (step === 18 && el) {
      gsap.fromTo(el, { x: 0 }, {
        x: 34,
        duration: 0.55,
        ease: 'power2.out',
        onComplete: () => { gsap.to(el, { x: 0, duration: 0.55, ease: 'power2.inOut' }) },
      })
    }
  }, [step])

  const update = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleNext = useCallback(() => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)), [])
  const handleBack = useCallback(() => setStep(s => Math.max(s - 1, 0)), [])
  const handleVehicleSelect = useCallback((type: string) => setVehicleType(type), [])

  return (
    <main style={{
      height: '100svh',
      overflow: 'hidden',
      background: '#080812',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>

      {/* Logo */}
      <div style={{
        position: 'absolute',
        top: '14px',
        left: '18px',
        zIndex: 100,
        fontSize: '17px',
        fontWeight: 800,
        color: 'white',
        textShadow: '0 2px 18px rgba(0,0,0,0.95)',
        letterSpacing: '-0.01em',
        pointerEvents: 'none',
        userSelect: 'none' as const,
      }}>
        🚗 AutoLoans.ca
      </div>

      {/* Driving scene — top 45% */}
      <DrivingScene
        vehicleType={vehicleType}
        isSuccess={step === 18}
        carRef={carRef as React.RefObject<HTMLDivElement>}
      />

      {/* Question card — bottom 55% */}
      <QuestionCard
        step={step}
        formData={formData}
        update={update}
        onNext={handleNext}
        onBack={handleBack}
        onVehicleSelect={handleVehicleSelect}
      />

    </main>
  )
}
