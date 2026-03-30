'use client'

import { useState, useEffect, useRef, useCallback, CSSProperties, ReactNode } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

/* ─── Types ────────────────────────────────────────────────────────────────── */

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
  timeAtJob: string
  incomeType: string
  incomeAmount: string
  incomeStability: string
  housingType: string
  monthlyBudget: string
  creditScore: string
  contactTime: string
}

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const TOTAL_STEPS = 19

const LANDSCAPE: Record<string, string> = {
  default:     'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1600&q=80',
  Sedan:       'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80',
  SUV:         'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
  Truck:       'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1600&q=80',
  Van:         'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=80',
  Coupe:       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
  Convertible: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
  Electric:    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80',
  Other:       'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1600&q=80',
}

const HOME_IMAGE = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600&q=80'

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Northwest Territories', 'Nunavut', 'Yukon',
]

const VEHICLE_TYPES = ['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Convertible', 'Electric', 'Other']

const VEHICLE_BRANDS = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Hyundai',
  'Kia', 'Nissan', 'Subaru', 'Volkswagen', 'Jeep', 'Ram', 'GMC', 'Lexus',
  'Acura', 'Mazda', 'Volvo', 'Tesla', 'Dodge', 'Chrysler', 'Buick', 'Cadillac',
  'Lincoln', 'Infiniti', 'Genesis', 'Rivian', 'Lucid', 'Other',
]

const AGE_RANGES        = ['Under 25', '25–34', '35–44', '45–54', '55–64', '65+']
const EMPLOYMENT_OPTS   = ['Employed', 'Self-Employed', 'Retired', 'Student', 'Other']
const INCOME_TYPES      = ['Salary', 'Hourly', 'Commission', 'Business', 'Pension', 'Disability', 'Other']
const INCOME_AMOUNTS    = ['Under $1,500/mo', '$1,500–$2,500/mo', '$2,500–$4,000/mo', '$4,000–$6,000/mo', '$6,000+/mo']
const INCOME_STABILITY  = ['Under 3 months', '3–6 months', '6–12 months', '1–2 years', '2+ years']
const HOUSING_OPTS      = ['Own', 'Rent', 'Live with family', 'Other']
const BUDGET_OPTS       = ['Under $300/mo', '$300–$400/mo', '$400–$500/mo', '$500–$700/mo', '$700+/mo']
const CREDIT_OPTS       = ['Excellent (750+)', 'Good (700–749)', 'Fair (650–699)', 'Poor (600–649)', 'Bad (below 600)', 'Not sure']
const CONTACT_OPTS      = ['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–9pm)', 'Anytime']

const EMPTY: FormData = {
  vehicleType: '', vehicleBrand: '', firstName: '', lastName: '',
  email: '', phone: '', isCanadian: '', zeroDown: '', ageRange: '',
  street: '', city: '', province: '', postalCode: '',
  employment: '', company: '', jobTitle: '', timeAtJob: '',
  incomeType: '', incomeAmount: '', incomeStability: '',
  housingType: '', monthlyBudget: '', creditScore: '', contactTime: '',
}

/* ─── Design Tokens ──────────────────────────────────────────────────────────── */

const C = {
  bg:          '#FFFFFF',
  pageBg:      '#FEFCF8',
  textHero:    '#0F172A',
  textPrimary: '#1E293B',
  textMuted:   '#64748B',
  textFaint:   '#94A3B8',
  blue:        '#2563EB',
  blueLight:   '#EFF6FF',
  blueMid:     '#DBEAFE',
  blueDark:    '#1D4ED8',
  amber:       '#F59E0B',
  amberLight:  '#FEF3C7',
  green:       '#10B981',
  border:      '#E2E8F0',
  borderFocus: '#2563EB',
  pill:        '#F8FAFC',
  pillHover:   '#F1F5F9',
  pillSelBg:   '#EFF6FF',
  pillSelBdr:  '#2563EB',
  pillSelTxt:  '#1D4ED8',
  shadow:      'rgba(15,23,42,0.07)',
  shadowMd:    'rgba(15,23,42,0.12)',
}

/* ─── SVG Car Illustrations ──────────────────────────────────────────────────── */

function WheelAnim({ cx, cy, r, fill = '#374151', dur = '0.85s' }: {
  cx: number; cy: number; r: number; fill?: string; dur?: string
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r + 5} fill="#1F2937" />
      <circle cx={cx} cy={cy} r={r} fill={fill}>
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur={dur} repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={Math.max(3, r - 6)} fill="#9CA3AF" />
    </>
  )
}

function SedanCar() {
  return (
    <svg viewBox="0 0 280 95" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="140" cy="91" rx="118" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="10" y="53" width="260" height="30" rx="9" fill="#2563EB" />
      <rect x="192" y="40" width="58" height="23" rx="5" fill="#2563EB" />
      <path d="M62 53 Q76 21 100 16 L188 16 Q208 21 218 53 Z" fill="#3B82F6" />
      <path d="M76 51 Q87 24 104 19 L145 19 Q154 26 155 51 Z" fill="#BFDBFE" opacity="0.9" />
      <path d="M162 51 Q170 25 182 19 L196 19 Q210 26 216 51 Z" fill="#BFDBFE" opacity="0.85" />
      <line x1="157" y1="53" x2="157" y2="83" stroke="#1D4ED8" strokeWidth="1.5" />
      <rect x="13" y="61" width="17" height="9" rx="3" fill="#FEF9C3" />
      <rect x="250" y="61" width="17" height="9" rx="3" fill="#FCA5A5" />
      <rect x="12" y="72" width="24" height="6" rx="2" fill="#1D4ED8" />
      <ellipse cx="66" cy="40" rx="8" ry="5" fill="#3B82F6" />
      <WheelAnim cx={70} cy={81} r={11} dur="0.8s" />
      <WheelAnim cx={210} cy={81} r={11} dur="0.8s" />
    </svg>
  )
}

function SUVCar() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="140" cy="104" rx="118" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="10" y="48" width="260" height="46" rx="9" fill="#16A34A" />
      <path d="M52 48 Q60 12 82 8 L210 8 Q228 13 234 48 Z" fill="#22C55E" />
      <path d="M65 46 Q73 16 90 11 L148 11 Q157 18 158 46 Z" fill="#BBF7D0" opacity="0.85" />
      <path d="M165 46 Q170 16 183 11 L205 11 Q220 19 226 46 Z" fill="#BBF7D0" opacity="0.82" />
      <rect x="75" y="7" width="142" height="4" rx="2" fill="#15803D" />
      <rect x="12" y="59" width="20" height="11" rx="3" fill="#FEF9C3" />
      <rect x="248" y="59" width="20" height="11" rx="3" fill="#FCA5A5" />
      <ellipse cx="55" cy="33" rx="9" ry="5.5" fill="#22C55E" />
      <line x1="130" y1="48" x2="130" y2="94" stroke="#15803D" strokeWidth="1.5" />
      <line x1="176" y1="48" x2="176" y2="94" stroke="#15803D" strokeWidth="1.5" />
      <rect x="10" y="88" width="38" height="7" rx="2" fill="#15803D" />
      <WheelAnim cx={72} cy={91} r={12} fill="#374151" dur="0.9s" />
      <WheelAnim cx={210} cy={91} r={12} fill="#374151" dur="0.9s" />
    </svg>
  )
}

function TruckCar() {
  return (
    <svg viewBox="0 0 320 108" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="160" cy="104" rx="140" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="160" y="44" width="150" height="50" rx="4" fill="#C2410C" />
      <rect x="157" y="40" width="154" height="11" rx="3" fill="#B45309" />
      <rect x="10" y="43" width="162" height="52" rx="9" fill="#EA580C" />
      <path d="M38 43 Q50 10 76 6 L155 6 Q168 11 168 43 Z" fill="#F97316" />
      <path d="M53 41 Q64 13 80 8 L148 8 Q160 14 163 41 Z" fill="#FED7AA" opacity="0.85" />
      <rect x="12" y="57" width="20" height="11" rx="3" fill="#FEF9C3" />
      <rect x="294" y="57" width="18" height="11" rx="3" fill="#FCA5A5" />
      <ellipse cx="38" cy="32" rx="9" ry="5.5" fill="#F97316" />
      <line x1="106" y1="43" x2="106" y2="95" stroke="#C2410C" strokeWidth="1.5" />
      <line x1="160" y1="40" x2="160" y2="95" stroke="#92400E" strokeWidth="3" />
      <line x1="245" y1="40" x2="245" y2="95" stroke="#92400E" strokeWidth="2" />
      <WheelAnim cx={75} cy={92} r={12} fill="#374151" dur="0.85s" />
      <WheelAnim cx={245} cy={92} r={12} fill="#374151" dur="0.85s" />
    </svg>
  )
}

function VanCar() {
  return (
    <svg viewBox="0 0 280 118" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="140" cy="114" rx="118" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="10" y="18" width="260" height="88" rx="9" fill="#6D28D9" />
      <rect x="10" y="18" width="65" height="88" rx="9" fill="#7C3AED" />
      <path d="M14 56 Q17 26 30 19 L68 19 Q70 26 68 56 Z" fill="#DDD6FE" opacity="0.85" />
      <rect x="82" y="23" width="52" height="40" rx="5" fill="#DDD6FE" opacity="0.75" />
      <rect x="148" y="23" width="52" height="40" rx="5" fill="#DDD6FE" opacity="0.75" />
      <rect x="212" y="23" width="44" height="40" rx="5" fill="#DDD6FE" opacity="0.7" />
      <line x1="142" y1="18" x2="142" y2="106" stroke="#5B21B6" strokeWidth="2" />
      <rect x="12" y="72" width="18" height="11" rx="3" fill="#FEF9C3" />
      <rect x="250" y="72" width="18" height="11" rx="3" fill="#FCA5A5" />
      <rect x="10" y="44" width="13" height="20" rx="3" fill="#7C3AED" />
      <WheelAnim cx={65} cy={100} r={11} fill="#374151" dur="0.9s" />
      <WheelAnim cx={215} cy={100} r={11} fill="#374151" dur="0.9s" />
    </svg>
  )
}

function CoupeCar() {
  return (
    <svg viewBox="0 0 280 88" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="140" cy="84" rx="118" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="10" y="53" width="260" height="24" rx="9" fill="#DC2626" />
      <path d="M80 53 Q96 20 120 14 L185 14 Q214 20 240 53 Z" fill="#EF4444" />
      <path d="M94 51 Q110 22 126 16 L158 16 Q170 25 170 51 Z" fill="#FECACA" opacity="0.85" />
      <path d="M175 51 Q190 22 207 16 L220 16 Q233 26 237 51 Z" fill="#FECACA" opacity="0.82" />
      <line x1="170" y1="53" x2="170" y2="77" stroke="#B91C1C" strokeWidth="1.5" />
      <rect x="14" y="59" width="18" height="6" rx="3" fill="#FEF9C3" />
      <rect x="248" y="59" width="18" height="6" rx="3" fill="#FCA5A5" />
      <rect x="240" y="50" width="22" height="5" rx="2" fill="#B91C1C" />
      <ellipse cx="82" cy="38" rx="8" ry="4" fill="#EF4444" />
      <rect x="12" y="67" width="22" height="6" rx="2" fill="#B91C1C" />
      <WheelAnim cx={74} cy={75} r={12} fill="#374151" dur="0.75s" />
      <WheelAnim cx={210} cy={75} r={12} fill="#374151" dur="0.75s" />
    </svg>
  )
}

function ConvertibleCar() {
  return (
    <svg viewBox="0 0 280 88" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="140" cy="84" rx="118" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="10" y="50" width="260" height="28" rx="9" fill="#D97706" />
      <path d="M85 50 Q95 30 108 26 L152 26 Q163 28 163 50 Z" fill="#FDE68A" opacity="0.8" />
      <path d="M91 48 Q100 30 110 27 L150 27 Q160 30 161 48 Z" fill="#FEF3C7" opacity="0.65" />
      <circle cx="128" cy="33" r="10" fill="#92400E" opacity="0.55" />
      <circle cx="174" cy="35" r="9" fill="#92400E" opacity="0.45" />
      <line x1="161" y1="50" x2="161" y2="78" stroke="#B45309" strokeWidth="1.5" />
      <rect x="14" y="56" width="18" height="8" rx="3" fill="#FEF9C3" />
      <rect x="248" y="56" width="18" height="8" rx="3" fill="#FCA5A5" />
      <ellipse cx="85" cy="40" rx="8" ry="4" fill="#F59E0B" />
      <rect x="248" y="70" width="18" height="5" rx="2" fill="#B45309" />
      <WheelAnim cx={72} cy={76} r={11} fill="#374151" dur="0.75s" />
      <WheelAnim cx={210} cy={76} r={11} fill="#374151" dur="0.75s" />
    </svg>
  )
}

function ElectricCar() {
  return (
    <svg viewBox="0 0 280 92" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="140" cy="88" rx="118" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="15" y="50" width="250" height="30" rx="13" fill="#0891B2" />
      <path d="M70 50 Q88 16 115 10 L175 10 Q200 16 215 50 Z" fill="#06B6D4" />
      <path d="M78 48 Q94 18 117 12 L167 12 Q184 20 187 48 Z" fill="#BAE6FD" opacity="0.85" />
      <rect x="17" y="56" width="24" height="5" rx="2.5" fill="#E0F2FE" />
      <rect x="239" y="56" width="24" height="5" rx="2.5" fill="#E0F2FE" />
      <rect x="16" y="63" width="12" height="7" rx="2" fill="#22D3EE" />
      <path d="M20 63 L18 67 L21 67 L19 70" stroke="white" strokeWidth="1.5" fill="none" />
      <line x1="161" y1="50" x2="161" y2="80" stroke="#0E7490" strokeWidth="1.5" />
      <ellipse cx="72" cy="36" rx="8" ry="4" fill="#06B6D4" />
      <WheelAnim cx={72} cy={78} r={11} fill="#374151" dur="0.85s" />
      <WheelAnim cx={210} cy={78} r={11} fill="#374151" dur="0.85s" />
    </svg>
  )
}

function OtherCar() {
  return (
    <svg viewBox="0 0 280 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="140" cy="92" rx="118" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="12" y="54" width="256" height="30" rx="9" fill="#64748B" />
      <path d="M65 54 Q78 22 100 17 L190 17 Q208 22 218 54 Z" fill="#94A3B8" />
      <path d="M79 52 Q89 24 103 19 L147 19 Q155 26 157 52 Z" fill="#CBD5E1" opacity="0.85" />
      <path d="M164 52 Q170 25 180 19 L192 19 Q204 27 215 52 Z" fill="#CBD5E1" opacity="0.82" />
      <line x1="160" y1="54" x2="160" y2="84" stroke="#475569" strokeWidth="1.5" />
      <rect x="15" y="62" width="17" height="9" rx="3" fill="#FEF9C3" />
      <rect x="248" y="62" width="17" height="9" rx="3" fill="#FCA5A5" />
      <ellipse cx="68" cy="40" rx="8" ry="4.5" fill="#94A3B8" />
      <WheelAnim cx={72} cy={82} r={11} fill="#374151" dur="0.85s" />
      <WheelAnim cx={210} cy={82} r={11} fill="#374151" dur="0.85s" />
    </svg>
  )
}

function DefaultCar() {
  return (
    <svg viewBox="0 0 280 95" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="140" cy="91" rx="118" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="10" y="53" width="260" height="30" rx="9" fill="#6366F1" />
      <rect x="192" y="40" width="58" height="23" rx="5" fill="#6366F1" />
      <path d="M62 53 Q76 21 100 16 L188 16 Q208 21 218 53 Z" fill="#818CF8" />
      <path d="M76 51 Q87 24 104 19 L145 19 Q154 26 155 51 Z" fill="#C7D2FE" opacity="0.9" />
      <path d="M162 51 Q170 25 182 19 L196 19 Q210 26 216 51 Z" fill="#C7D2FE" opacity="0.85" />
      <rect x="13" y="61" width="17" height="9" rx="3" fill="#FEF9C3" />
      <rect x="250" y="61" width="17" height="9" rx="3" fill="#FCA5A5" />
      <WheelAnim cx={70} cy={81} r={11} dur="0.8s" />
      <WheelAnim cx={210} cy={81} r={11} dur="0.8s" />
    </svg>
  )
}

function CarSVG({ type }: { type: string }) {
  switch (type) {
    case 'Sedan':       return <SedanCar />
    case 'SUV':         return <SUVCar />
    case 'Truck':       return <TruckCar />
    case 'Van':         return <VanCar />
    case 'Coupe':       return <CoupeCar />
    case 'Convertible': return <ConvertibleCar />
    case 'Electric':    return <ElectricCar />
    case 'Other':       return <OtherCar />
    default:            return <DefaultCar />
  }
}

/* ─── Confetti ──────────────────────────────────────────────────────────────── */

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: ['#3B82F6','#10B981','#F59E0B','#EC4899','#8B5CF6','#EF4444','#06B6D4','#F97316'][i % 8],
    left: `${(i / 60) * 102 - 1}%`,
    delay: `${(i % 15) * 0.11}s`,
    size: `${5 + (i % 5) * 2}px`,
    duration: `${2.0 + (i % 9) * 0.25}s`,
    round: i % 3 !== 0,
  }))
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 30 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          top: '-14px',
          left: p.left,
          width: p.size,
          height: p.size,
          background: p.color,
          borderRadius: p.round ? '50%' : '2px',
          animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
        }} />
      ))}
    </div>
  )
}

/* ─── Driving Scene ──────────────────────────────────────────────────────────── */

function DrivingScene({ vehicleType, isSuccess }: { vehicleType: string; isSuccess: boolean }) {
  const carRef = useRef<HTMLDivElement>(null)
  const landscape = LANDSCAPE[vehicleType] ?? LANDSCAPE.default

  useEffect(() => {
    if (!carRef.current) return
    if (isSuccess) {
      gsap.to(carRef.current, {
        x: '28vw',
        duration: 2.8,
        ease: 'power3.out',
      })
    } else {
      gsap.set(carRef.current, { x: 0 })
    }
  }, [isSuccess])

  return (
    <div style={{
      position: 'relative',
      height: '45svh',
      minHeight: '220px',
      maxHeight: '440px',
      flexShrink: 0,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #87CEEB 0%, #B8E4F9 45%, #D4EED0 80%, #E8F5E9 100%)',
    }}>

      {/* Landscape image — pans horizontally while driving */}
      <AnimatePresence>
        <motion.div
          key={landscape}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '120%', height: '100%',
            animation: isSuccess ? 'none' : 'roadPan 28s linear infinite',
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={landscape}
              alt="Scenic road"
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="120vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Airy warm overlay — makes images feel lighter/brighter */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(255,249,235,0.18) 0%, rgba(255,255,255,0.08) 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Home image — crossfades in on success */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isSuccess ? 1 : 0 }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0, zIndex: 3 }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src={HOME_IMAGE}
            alt="Your new home"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 55%' }}
            sizes="100vw"
          />
        </div>
      </motion.div>

      {/* Road surface + dashed line */}
      <div style={{
        position: 'absolute', bottom: '14%', left: 0, right: 0, height: '18%', zIndex: 4,
        background: 'rgba(0,0,0,0.04)',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: '2px',
          background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 35px, transparent 35px, transparent 70px)',
          animation: isSuccess ? 'none' : 'roadPan 1.8s linear infinite',
        }} />
      </div>

      {/* Speed lines — light, subtle, motion sense */}
      {!isSuccess && [0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute',
          left: 0,
          top: `${40 + i * 8}%`,
          width: `${55 + i * 30}px`,
          height: '1.5px',
          background: `rgba(255,255,255,${0.4 - i * 0.06})`,
          borderRadius: '2px',
          animation: `speedLine ${0.85 + i * 0.3}s linear infinite`,
          animationDelay: `${i * 0.22}s`,
          zIndex: 5,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Car */}
      <div
        ref={carRef}
        style={{
          position: 'absolute',
          bottom: '14%',
          left: '4%',
          width: 'min(44%, 400px)',
          height: '45%',
          animation: isSuccess ? 'none' : 'carBob 2.4s ease-in-out infinite',
          zIndex: 7,
          filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.18)) drop-shadow(0 2px 6px rgba(0,0,0,0.1))',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={vehicleType || 'default'}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%', height: '100%' }}
          >
            <CarSVG type={vehicleType} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sun / lens flare */}
      <div style={{
        position: 'absolute', top: '7%', right: '8%',
        width: '90px', height: '90px',
        background: 'radial-gradient(circle, rgba(255,245,160,0.75) 0%, rgba(255,220,80,0.35) 45%, transparent 70%)',
        borderRadius: '50%',
        animation: 'lensFlare 5s ease-in-out infinite',
        zIndex: 6,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }} />

      {/* Confetti on success */}
      {isSuccess && <Confetti />}

      {/* Bottom gradient fade into white card area */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 60%, #FFFFFF 100%)',
        zIndex: 8, pointerEvents: 'none',
      }} />
    </div>
  )
}

/* ─── Progress Bar ──────────────────────────────────────────────────────────── */

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round(((step) / 17) * 100)
  return (
    <div style={{ padding: '16px 24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: C.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Step {step} of 17
        </span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: C.blue }}>{pct}%</span>
      </div>
      <div style={{ height: '4px', background: C.border, borderRadius: '99px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)',
            borderRadius: '99px',
          }}
        />
      </div>
    </div>
  )
}

/* ─── Reusable Form Components ───────────────────────────────────────────────── */

function Pill({ label, selected, onClick, icon }: {
  label: string; selected: boolean; onClick: () => void; icon?: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 18px',
        borderRadius: '999px',
        fontSize: '14px',
        fontWeight: selected ? 600 : 500,
        border: `1.5px solid ${selected ? C.pillSelBdr : C.border}`,
        background: selected ? C.pillSelBg : C.pill,
        color: selected ? C.pillSelTxt : C.textPrimary,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        outline: 'none',
        boxShadow: selected ? `0 0 0 3px ${C.blueMid}` : 'none',
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
      {selected && <span style={{ color: C.blue, marginLeft: '2px' }}>✓</span>}
    </button>
  )
}

function TxtField({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '12px',
          border: `1.5px solid ${C.border}`,
          fontSize: '15px',
          color: C.textPrimary,
          background: '#FAFAFA',
          outline: 'none',
          transition: 'border-color 0.15s',
          boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = C.borderFocus}
        onBlur={e => e.target.style.borderColor = C.border}
      />
    </div>
  )
}

function SelField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '12px',
          border: `1.5px solid ${C.border}`,
          fontSize: '15px',
          color: value ? C.textPrimary : C.textFaint,
          background: '#FAFAFA',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394A3B8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          paddingRight: '40px',
        }}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function ContinueBtn({ onClick, disabled = false, label = 'Continue →' }: {
  onClick: () => void; disabled?: boolean; label?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '16px',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: 700,
        color: disabled ? '#94A3B8' : '#FFFFFF',
        background: disabled
          ? '#F1F5F9'
          : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 4px 14px rgba(37,99,235,0.38)',
        transition: 'all 0.18s ease',
        letterSpacing: '0.01em',
      }}
    >
      {label}
    </button>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        color: C.textMuted,
        padding: '8px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      ← Back
    </button>
  )
}

/* ─── Card Wrapper ──────────────────────────────────────────────────────────── */

function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      maxWidth: '560px',
      margin: '0 auto',
      padding: '24px 24px 36px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function Q({ text, sub }: { text: string; sub?: string }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2 style={{
        fontSize: 'clamp(20px, 5vw, 26px)',
        fontWeight: 800,
        color: C.textHero,
        lineHeight: 1.22,
        margin: 0,
        letterSpacing: '-0.01em',
      }}>{text}</h2>
      {sub && <p style={{ margin: '6px 0 0', fontSize: '14px', color: C.textMuted, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  )
}

function PillGrid({ options, value, onChange, icons }: {
  options: string[]; value: string; onChange: (v: string) => void; icons?: string[]
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
      {options.map((opt, i) => (
        <Pill key={opt} label={opt} selected={value === opt} onClick={() => onChange(opt)} icon={icons?.[i]} />
      ))}
    </div>
  )
}

/* ─── Step Content ───────────────────────────────────────────────────────────── */

interface StepProps {
  step: number
  form: FormData
  set: (field: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}

function StepContent({ step, form, set, onNext, onBack }: StepProps) {
  switch (step) {

    /* ── Step 0: Landing Hero ────────────────────────────────────── */
    case 0: return (
      <Card>
        <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: C.amberLight, borderRadius: '999px', padding: '6px 16px',
            marginBottom: '16px',
          }}>
            <span style={{ fontSize: '13px' }}>🍁</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Canada&apos;s #1 Auto Loan Broker
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 7vw, 38px)',
            fontWeight: 900,
            color: C.textHero,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 12px',
          }}>
            Your Dream Car<br />
            <span style={{ color: C.blue }}>Awaits You</span>
          </h1>
          <p style={{
            fontSize: '15px', color: C.textMuted, lineHeight: 1.6,
            margin: '0 0 24px', maxWidth: '380px', marginLeft: 'auto', marginRight: 'auto',
          }}>
            Get pre-approved in minutes — regardless of your credit history.
            We work with 30+ lenders across every Canadian province.
          </p>
          <ContinueBtn onClick={onNext} label="Start My Application →" />
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '20px',
            marginTop: '20px', flexWrap: 'wrap',
          }}>
            {[['✓', '99% Approval Rate'], ['✓', 'No Hard Credit Check'], ['✓', 'Same-Day Response']].map(([icon, text]) => (
              <span key={text} style={{ fontSize: '12px', fontWeight: 600, color: C.textMuted, display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ color: C.green }}>{icon}</span> {text}
              </span>
            ))}
          </div>
        </div>
      </Card>
    )

    /* ── Step 1: Vehicle Type ─────────────────────────────────────── */
    case 1: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="What type of vehicle are you looking for?" sub="We'll match you with the right lenders for your vehicle." />
        <PillGrid
          options={VEHICLE_TYPES}
          value={form.vehicleType}
          onChange={v => set('vehicleType', v)}
          icons={['🚗','🚙','🛻','🚐','🏎️','🚘','⚡','🚌']}
        />
        <ContinueBtn onClick={onNext} disabled={!form.vehicleType} />
      </Card>
    )

    /* ── Step 2: Vehicle Brand ────────────────────────────────────── */
    case 2: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="Which brand interests you most?" sub="Pick the brand you have in mind — or select 'Other'." />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {VEHICLE_BRANDS.map(b => (
            <Pill key={b} label={b} selected={form.vehicleBrand === b} onClick={() => set('vehicleBrand', b)} />
          ))}
        </div>
        <ContinueBtn onClick={onNext} disabled={!form.vehicleBrand} />
      </Card>
    )

    /* ── Step 3: Name ────────────────────────────────────────────── */
    case 3: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="What's your name?" sub="We'll use this to personalize your pre-approval." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <TxtField label="First Name" value={form.firstName} onChange={v => set('firstName', v)} placeholder="e.g. Sarah" />
          <TxtField label="Last Name" value={form.lastName} onChange={v => set('lastName', v)} placeholder="e.g. Dupont" />
        </div>
        <ContinueBtn onClick={onNext} disabled={!form.firstName.trim() || !form.lastName.trim()} />
      </Card>
    )

    /* ── Step 4: Email ───────────────────────────────────────────── */
    case 4: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text={`Hi ${form.firstName || 'there'} 👋 What's your email?`} sub="We'll send your pre-approval confirmation here." />
        <div style={{ marginBottom: '20px' }}>
          <TxtField label="Email Address" value={form.email} onChange={v => set('email', v)} type="email" placeholder="you@example.com" />
        </div>
        <ContinueBtn onClick={onNext} disabled={!form.email.trim() || !form.email.includes('@')} />
      </Card>
    )

    /* ── Step 5: Phone ───────────────────────────────────────────── */
    case 5: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="What's the best phone number to reach you?" sub="Our team will call you within 24 hours — never spam." />
        <div style={{ marginBottom: '20px' }}>
          <TxtField label="Phone Number" value={form.phone} onChange={v => set('phone', v)} type="tel" placeholder="(604) 555-0192" />
        </div>
        <ContinueBtn onClick={onNext} disabled={form.phone.replace(/\D/g,'').length < 10} />
      </Card>
    )

    /* ── Step 6: Canadian Resident ────────────────────────────────── */
    case 6: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="Are you a Canadian resident?" sub="Our loans are available to Canadian residents only." />
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Pill label="Yes 🇨🇦" selected={form.isCanadian === 'Yes'} onClick={() => set('isCanadian', 'Yes')} />
          <Pill label="No" selected={form.isCanadian === 'No'} onClick={() => set('isCanadian', 'No')} />
        </div>
        {form.isCanadian === 'No' && (
          <div style={{
            background: '#FEF3C7', borderRadius: '12px', padding: '14px 16px',
            marginBottom: '16px', border: '1px solid #FDE68A',
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#92400E', fontWeight: 500 }}>
              ⚠️ Unfortunately our auto loans are only available to Canadian residents at this time.
            </p>
          </div>
        )}
        <ContinueBtn onClick={onNext} disabled={!form.isCanadian || form.isCanadian === 'No'} />
      </Card>
    )

    /* ── Step 7: Down Payment ─────────────────────────────────────── */
    case 7: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="Interested in $0 down payment options?" sub="We have lenders that offer zero down — even with bad credit." />
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Pill label="Yes please!" selected={form.zeroDown === 'Yes'} onClick={() => set('zeroDown', 'Yes')} />
          <Pill label="I have a down payment" selected={form.zeroDown === 'No'} onClick={() => set('zeroDown', 'No')} />
        </div>
        <ContinueBtn onClick={onNext} disabled={!form.zeroDown} />
      </Card>
    )

    /* ── Step 8: Age Range ────────────────────────────────────────── */
    case 8: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="What is your age range?" />
        <PillGrid options={AGE_RANGES} value={form.ageRange} onChange={v => set('ageRange', v)} />
        <ContinueBtn onClick={onNext} disabled={!form.ageRange} />
      </Card>
    )

    /* ── Step 9: Address ──────────────────────────────────────────── */
    case 9: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="What's your current address?" sub="We use this to match you with local lenders." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <TxtField label="Street Address" value={form.street} onChange={v => set('street', v)} placeholder="123 Maple Street" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <TxtField label="City" value={form.city} onChange={v => set('city', v)} placeholder="Vancouver" />
            <TxtField label="Postal Code" value={form.postalCode} onChange={v => set('postalCode', v)} placeholder="V5K 0A1" />
          </div>
          <SelField label="Province" value={form.province} onChange={v => set('province', v)} options={PROVINCES} />
        </div>
        <ContinueBtn onClick={onNext} disabled={!form.street.trim() || !form.city.trim() || !form.province || !form.postalCode.trim()} />
      </Card>
    )

    /* ── Step 10: Employment Status ───────────────────────────────── */
    case 10: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="What's your current employment status?" />
        <PillGrid
          options={EMPLOYMENT_OPTS}
          value={form.employment}
          onChange={v => set('employment', v)}
          icons={['💼','🔧','🎓','📚','✦']}
        />
        <ContinueBtn onClick={onNext} disabled={!form.employment} />
      </Card>
    )

    /* ── Step 11: Job Details ─────────────────────────────────────── */
    case 11: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="Tell us about your job" sub="This helps us find the best rate for you." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <TxtField label="Employer Name" value={form.company} onChange={v => set('company', v)} placeholder="e.g. RBC, Tim Hortons, Self" />
          <TxtField label="Job Title" value={form.jobTitle} onChange={v => set('jobTitle', v)} placeholder="e.g. Sales Manager" />
          <SelField label="Time at This Job" value={form.timeAtJob} onChange={v => set('timeAtJob', v)} options={['Under 3 months','3–6 months','6–12 months','1–2 years','2–5 years','5+ years']} />
        </div>
        <ContinueBtn onClick={onNext} disabled={!form.company.trim() || !form.jobTitle.trim() || !form.timeAtJob} />
      </Card>
    )

    /* ── Step 12: Income Type ─────────────────────────────────────── */
    case 12: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="What type of income do you receive?" />
        <PillGrid options={INCOME_TYPES} value={form.incomeType} onChange={v => set('incomeType', v)} />
        <ContinueBtn onClick={onNext} disabled={!form.incomeType} />
      </Card>
    )

    /* ── Step 13: Income Amount + Stability ───────────────────────── */
    case 13: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="How much is your monthly income?" sub="Select the range that best describes your situation." />
        <p style={{ fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Monthly Amount</p>
        <PillGrid options={INCOME_AMOUNTS} value={form.incomeAmount} onChange={v => set('incomeAmount', v)} />
        <p style={{ fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 8px' }}>Income Stability</p>
        <PillGrid options={INCOME_STABILITY} value={form.incomeStability} onChange={v => set('incomeStability', v)} />
        <ContinueBtn onClick={onNext} disabled={!form.incomeAmount || !form.incomeStability} />
      </Card>
    )

    /* ── Step 14: Housing Situation ───────────────────────────────── */
    case 14: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="What's your current housing situation?" />
        <PillGrid
          options={HOUSING_OPTS}
          value={form.housingType}
          onChange={v => set('housingType', v)}
          icons={['🏠','🏢','👨‍👩‍👧','✦']}
        />
        <ContinueBtn onClick={onNext} disabled={!form.housingType} />
      </Card>
    )

    /* ── Step 15: Monthly Car Budget ──────────────────────────────── */
    case 15: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="What's your monthly car payment budget?" sub="This helps us find loans that fit your budget perfectly." />
        <PillGrid options={BUDGET_OPTS} value={form.monthlyBudget} onChange={v => set('monthlyBudget', v)} />
        <ContinueBtn onClick={onNext} disabled={!form.monthlyBudget} />
      </Card>
    )

    /* ── Step 16: Credit Score ────────────────────────────────────── */
    case 16: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="How would you describe your credit score?" sub="All scores welcome — bad credit or no credit is OK." />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {CREDIT_OPTS.map(c => (
            <Pill key={c} label={c} selected={form.creditScore === c} onClick={() => set('creditScore', c)} />
          ))}
        </div>
        <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 16px', lineHeight: 1.5 }}>
          💙 We specialize in helping Canadians with all credit types — including bad credit and no credit history.
        </p>
        <ContinueBtn onClick={onNext} disabled={!form.creditScore} />
      </Card>
    )

    /* ── Step 17: Contact Time ────────────────────────────────────── */
    case 17: return (
      <Card>
        <BackBtn onClick={onBack} />
        <Q text="When's the best time to contact you?" sub="Our loan specialists will reach out within 24 hours." />
        <PillGrid
          options={CONTACT_OPTS}
          value={form.contactTime}
          onChange={v => set('contactTime', v)}
          icons={['🌅','☀️','🌆','🕐']}
        />
        <ContinueBtn onClick={onNext} disabled={!form.contactTime} label="Submit My Application 🎉" />
      </Card>
    )

    /* ── Step 18: SUCCESS ─────────────────────────────────────────── */
    case 18: return (
      <Card style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            fontSize: '64px',
            animation: 'successPulse 2.5s ease-in-out infinite',
            display: 'block',
            marginBottom: '8px',
          }}>
            🎉
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 6vw, 34px)',
            fontWeight: 900,
            color: C.textHero,
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}>
            You&apos;re Pre-Approved!
          </h2>
          <p style={{ fontSize: '15px', color: C.textMuted, margin: '0 0 24px', lineHeight: 1.6 }}>
            Congratulations{form.firstName ? `, ${form.firstName}` : ''}! Your application has been received.
            A loan specialist will contact you within 24 hours.
          </p>

          {/* Summary card */}
          <div style={{
            background: C.blueLight,
            border: `1px solid ${C.blueMid}`,
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '20px',
            textAlign: 'left',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
              Your Application Summary
            </p>
            {[
              ['Vehicle', [form.vehicleType, form.vehicleBrand].filter(Boolean).join(' ')],
              ['Budget', form.monthlyBudget],
              ['Credit', form.creditScore],
              ['Contact Time', form.contactTime],
            ].map(([k, v]) => v ? (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${C.blueMid}` }}>
                <span style={{ fontSize: '13px', color: C.textMuted, fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: '13px', color: C.textPrimary, fontWeight: 600 }}>{v}</span>
              </div>
            ) : null)}
          </div>

          {/* What's next */}
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: C.textPrimary, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              What happens next
            </p>
            {[
              ['📞', 'A loan specialist calls you', `within ${form.contactTime?.toLowerCase() || '24 hours'}`],
              ['🏦', 'We match you with lenders', 'from our network of 30+'],
              ['🚗', 'You drive away', 'in your new vehicle!'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>{title}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Card>
    )

    default: return null
  }
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */

export default function Page() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<FormData>(EMPTY)

  const next = useCallback(() => {
    setDir(1)
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1))
  }, [])

  const back = useCallback(() => {
    setDir(-1)
    setStep(s => Math.max(s - 1, 0))
  }, [])

  const set = useCallback((field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  // Log & prepare to POST on success
  useEffect(() => {
    if (step === 18) {
      console.log('AutoLoans.ca — Application Submitted:', form)
      // Ready to POST:
      // fetch('/api/apply', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form),
      // })
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.98 }),
    center:            () => ({ x: 0, opacity: 1, scale: 1 }),
    exit:  (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.98 }),
  }

  return (
    <main style={{
      height: '100svh',
      display: 'flex',
      flexDirection: 'column',
      background: '#FFFFFF',
      overflow: 'hidden',
    }}>
      {/* Cinematic driving scene — always visible */}
      <DrivingScene vehicleType={form.vehicleType} isSuccess={step === 18} />

      {/* Progress bar (steps 1–17) */}
      {step >= 1 && step <= 17 && <ProgressBar step={step} />}

      {/* Form steps */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#FFFFFF' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepContent step={step} form={form} set={set} onNext={next} onBack={back} />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
