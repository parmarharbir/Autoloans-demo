'use client'

import React, { useState, useCallback, useEffect, useRef, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, ContactShadows, Html, useTexture } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

type QPos = 'center' | 'left' | 'right' | 'bot-left' | 'bot-right' | 'top-left' | 'top-right' | 'top' | 'bottom'

/* ======================================================
   CONSTANTS
====================================================== */

const EMPTY: FormData = {
  vehicleType: '', vehicleBrand: '', firstName: '', lastName: '',
  email: '', phone: '', isCanadian: '', zeroDown: '', ageRange: '',
  street: '', city: '', province: '', postalCode: '',
  employment: '', employerName: '', jobTitle: '', timeAtJob: '',
  incomeType: '', incomeAmount: '', incomeStability: '',
  housingType: '', monthlyBudget: '', creditScore: '', contactTime: '',
}

const CAM_POSITIONS: [number, number, number][] = [
  [4, 1.5, 6],    // Step 0: 3/4 front hero
  [6, 1.2, 2],    // Step 1: side-front angle
  [-6, 1.2, 2],   // Step 2: opposite side
  [0, 3, 4],      // Step 3: elevated front
  [4, 0.8, -5],   // Step 4: rear 3/4
  [0, 8, 0.1],    // Step 5: top-down overhead
  [-4, 1.2, -5],  // Step 6: rear opposite
  [3, 1.5, 5],    // Step 7: classic 3/4 return
  [6, 0.5, 0],    // Step 8: low side shot
  [-5, 1.8, 3],   // Step 9: wide side
  [1, 0.3, 1.5],  // Step 10: wheel level close
  [4, 2, 4],      // Step 11: elevated 3/4
  [-3, 1.5, -4],  // Step 12: rear elevated
  [0, 1.2, 3],    // Step 13: straight front close
  [5, 1, 2],      // Step 14: side close
  [-4, 3, 4],     // Step 15: wide elevated
  [0, 1.5, 5],    // Step 16: straight front
  [3, 0.8, 3],    // Step 17: driving angle
  [0, 4, 8],      // Step 18: pull-back reveal
]

const QPOS: QPos[] = [
  'center', 'left', 'right', 'bot-left', 'bot-right',
  'bottom', 'top-left', 'top-right', 'left', 'right',
  'top', 'bot-left', 'bot-right', 'bottom', 'left',
  'right', 'bottom', 'top-left', 'center',
]

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

const TOTAL_STEPS = 19
const PX_PER_STEP = 300
const TOTAL_HEIGHT = TOTAL_STEPS * PX_PER_STEP

/* ======================================================
   POSITION HELPER
====================================================== */

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

/* ======================================================
   SHARED MICRO-COMPONENTS
====================================================== */

function QH({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="font-bold text-[#0a1628] leading-snug mb-5"
      style={{
        fontFamily: 'var(--font-playfair), Georgia, serif',
        fontSize: 'clamp(1.5rem, 3.2vw, 2.5rem)',
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
          : 'bg-white text-[#1a1a1a] border-stone-200 hover:border-yellow-400 hover:shadow-md'
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

/* ======================================================
   3D SCENE — FERRARI + ENVIRONMENT
====================================================== */

function FerrariModel() {
  const { scene } = useGLTF('https://threejs.org/examples/models/gltf/ferrari.glb')
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c0392b',
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.5,
  }), [])

  useEffect(() => {
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      child.castShadow = true
      child.receiveShadow = true
      // Apply red to body parts; keep glass transparent
      if (child.name === 'body') {
        child.material = bodyMat
      }
    })
  }, [scene, bodyMat])

  // Continuous auto-rotation
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <primitive object={scene} scale={1.4} />
    </group>
  )
}

// Preload for fast load
useGLTF.preload('https://threejs.org/examples/models/gltf/ferrari.glb')

interface CameraRigProps {
  camTarget: React.MutableRefObject<THREE.Vector3>
}

function CameraRig({ camTarget }: CameraRigProps) {
  const { camera } = useThree()
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.5, 0), [])

  useFrame(() => {
    camera.position.lerp(camTarget.current, 0.06)
    camera.lookAt(lookTarget)
  })

  return null
}

function HighwayBackground() {
  const texture = useTexture('/images/highway-bg.png')
  return (
    <mesh position={[0, 0, -8]} rotation={[0, 0, 0]}>
      <planeGeometry args={[30, 20]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

interface Scene3DProps {
  camTarget: React.MutableRefObject<THREE.Vector3>
}

function Scene3D({ camTarget }: Scene3DProps) {
  return (
    <>
      <ambientLight intensity={0.8} color='#FFF3E0' />
      <directionalLight position={[10, 8, 5]} intensity={2} color='#FFB347' castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} color='#87CEEB' />

      <Suspense fallback={null}>
        <HighwayBackground />
        <FerrariModel />
      </Suspense>

      <ContactShadows
        position={[0, -0.49, 0]}
        opacity={0.8}
        blur={2.5}
        far={4}
        resolution={512}
      />

      <CameraRig camTarget={camTarget} />

      <EffectComposer>
        <Bloom threshold={0.8} strength={0.3} radius={0.4} />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </>
  )
}

/* ======================================================
   PROGRESS BAR
====================================================== */

function ProgressBar({ step }: { step: number }) {
  const pct = ((step) / (TOTAL_STEPS - 1)) * 100
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-[#F5C842] to-[#F5A800]"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}

/* ======================================================
   STEP CARD WRAPPER
====================================================== */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-[#e8dfd0] p-7 w-full max-w-sm pointer-events-auto"
      style={{ boxShadow: '0 20px 60px rgba(10,22,40,0.12), 0 4px 16px rgba(10,22,40,0.08)' }}
    >
      {children}
    </motion.div>
  )
}

/* ======================================================
   SUCCESS STEP (step 18)
====================================================== */

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
        You are Pre-Approved!
      </motion.h2>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.44 }}
        className="text-[#6b7280] mb-6 text-sm"
      >
        A specialist will contact you shortly
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}
        className="bg-white rounded-2xl shadow-xl border border-[#e0d4c0] p-6 text-left space-y-3 max-w-sm mx-auto mb-6"
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

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="text-[#0a1628] font-semibold text-sm tracking-wide"
      >
        Our Team Will Be In Touch
      </motion.p>
    </div>
  )
}

/* ======================================================
   FORM OVERLAY — ALL 19 STEPS
====================================================== */

interface OverlayProps {
  step: number
  form: FormData
  set: (k: keyof FormData, v: string) => void
  next: () => void
  mobile: boolean
}

function FormOverlay({ step, form, set, next, mobile }: OverlayProps) {
  const pos = QPOS[step]

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
      <AnimatePresence mode="wait">
        <div key={step} style={cardContainer(pos, mobile)}>
          {step === 0 && (
            <Card>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="w-2 h-2 rounded-full bg-[#F5C842]" />
                <span className="text-xs text-[#9a8a7a] font-medium tracking-widest uppercase">AutoLoans.ca</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="font-bold text-[#0a1628] leading-tight mb-3"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
              >
                Get Approved For a Vehicle
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                className="text-[#6b7280] text-sm mb-5 leading-relaxed"
              >
                Bad credit, no credit — we work with 30+ lenders to get you behind the wheel.
              </motion.p>
              <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}
                className="space-y-1.5 mb-6 text-sm text-[#3a3a3a]"
              >
                {['2-minute application', 'No impact on credit score', 'All provinces accepted', 'Instant pre-approval'].map(t => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="text-[#F5C842] font-bold">✓</span> {t}
                  </li>
                ))}
              </motion.ul>
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={next}
                className="w-full py-3.5 rounded-full bg-[#0a1628] text-white font-semibold text-sm shadow-lg hover:bg-[#162238] transition-colors pointer-events-auto"
              >
                Begin My Journey →
              </motion.button>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <QH>What are you looking for?</QH>
              <div className="flex flex-wrap gap-2">
                {VTYPES.map((v, i) => (
                  <Pill key={v} label={v} sel={form.vehicleType === v}
                    onClick={() => { set('vehicleType', v); setTimeout(next, 260) }} delay={i * 0.04} />
                ))}
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <QH>Which brand?</QH>
              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                {BRANDS.map((b, i) => (
                  <Pill key={b} label={b} sel={form.vehicleBrand === b}
                    onClick={() => { set('vehicleBrand', b); setTimeout(next, 260) }} delay={i * 0.02} />
                ))}
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <QH>What is your name?</QH>
              <div className="space-y-3">
                <Inp ph="First name" val={form.firstName} onChange={v => set('firstName', v)} delay={0.05} />
                <Inp ph="Last name" val={form.lastName} onChange={v => set('lastName', v)} delay={0.1} />
              </div>
              <ContBtn onClick={next} disabled={!form.firstName || !form.lastName} />
            </Card>
          )}

          {step === 4 && (
            <Card>
              <QH>Your email address?</QH>
              <Inp ph="you@example.com" type="email" val={form.email} onChange={v => set('email', v)} delay={0.05} />
              <ContBtn onClick={next} disabled={!form.email.includes('@')} />
            </Card>
          )}

          {step === 5 && (
            <Card>
              <QH>Best phone number?</QH>
              <Inp ph="(xxx) xxx-xxxx" type="tel" val={form.phone} onChange={v => set('phone', v)} delay={0.05} />
              <ContBtn onClick={next} disabled={form.phone.length < 10} />
            </Card>
          )}

          {step === 6 && (
            <Card>
              <QH>Are you a Canadian resident?</QH>
              <div className="flex gap-3">
                {['Yes', 'No'].map((v, i) => (
                  <Pill key={v} label={v} sel={form.isCanadian === v}
                    onClick={() => { set('isCanadian', v); setTimeout(next, 260) }} delay={i * 0.08} />
                ))}
              </div>
            </Card>
          )}

          {step === 7 && (
            <Card>
              <QH>Interested in $0 down?</QH>
              <div className="flex gap-3">
                {['Yes', 'No'].map((v, i) => (
                  <Pill key={v} label={v} sel={form.zeroDown === v}
                    onClick={() => { set('zeroDown', v); setTimeout(next, 260) }} delay={i * 0.08} />
                ))}
              </div>
            </Card>
          )}

          {step === 8 && (
            <Card>
              <QH>Your age range?</QH>
              <div className="flex flex-wrap gap-2">
                {AGES.map((a, i) => (
                  <Pill key={a} label={a} sel={form.ageRange === a}
                    onClick={() => { set('ageRange', a); setTimeout(next, 260) }} delay={i * 0.06} />
                ))}
              </div>
            </Card>
          )}

          {step === 9 && (
            <Card>
              <QH>Where are you located?</QH>
              <div className="space-y-3">
                <Inp ph="Street address" val={form.street} onChange={v => set('street', v)} delay={0.05} />
                <Inp ph="City" val={form.city} onChange={v => set('city', v)} delay={0.1} />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <select
                      value={form.province}
                      onChange={e => set('province', e.target.value)}
                      className="w-full bg-white border border-[#e0d4c0] rounded-xl px-3 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#F5C842] pointer-events-auto"
                    >
                      <option value="">Province</option>
                      {PROVS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="w-28">
                    <Inp ph="Postal Code" val={form.postalCode} onChange={v => set('postalCode', v)} delay={0.15} />
                  </div>
                </div>
              </div>
              <ContBtn onClick={next} disabled={!form.city || !form.province} />
            </Card>
          )}

          {step === 10 && (
            <Card>
              <QH>How do you earn your income?</QH>
              <div className="flex flex-wrap gap-2">
                {EMPLS.map((e, i) => (
                  <Pill key={e} label={e} sel={form.employment === e}
                    onClick={() => { set('employment', e); setTimeout(next, 260) }} delay={i * 0.06} />
                ))}
              </div>
            </Card>
          )}

          {step === 11 && (
            <Card>
              <QH>Tell us about your work</QH>
              <div className="space-y-3">
                <Inp ph="Employer / Business name" val={form.employerName} onChange={v => set('employerName', v)} delay={0.05} />
                <Inp ph="Job title" val={form.jobTitle} onChange={v => set('jobTitle', v)} delay={0.1} />
                <Inp ph="Time at this job (e.g. 2 years)" val={form.timeAtJob} onChange={v => set('timeAtJob', v)} delay={0.15} />
              </div>
              <ContBtn onClick={next} disabled={!form.employerName} />
            </Card>
          )}

          {step === 12 && (
            <Card>
              <QH>How are you paid?</QH>
              <div className="flex flex-wrap gap-2">
                {ITYPES.map((t, i) => (
                  <Pill key={t} label={t} sel={form.incomeType === t}
                    onClick={() => { set('incomeType', t); setTimeout(next, 260) }} delay={i * 0.05} />
                ))}
              </div>
            </Card>
          )}

          {step === 13 && (
            <Card>
              <QH>Monthly income + stability</QH>
              <div className="space-y-3">
                <Inp ph="Monthly income (e.g. $3,500)" val={form.incomeAmount} onChange={v => set('incomeAmount', v)} delay={0.05} />
                <Inp ph="Income stability (e.g. Full-time, Part-time)" val={form.incomeStability} onChange={v => set('incomeStability', v)} delay={0.1} />
              </div>
              <ContBtn onClick={next} disabled={!form.incomeAmount} />
            </Card>
          )}

          {step === 14 && (
            <Card>
              <QH>Your housing situation?</QH>
              <div className="flex flex-wrap gap-2">
                {HOUSE.map((h, i) => (
                  <Pill key={h} label={h} sel={form.housingType === h}
                    onClick={() => { set('housingType', h); setTimeout(next, 260) }} delay={i * 0.07} />
                ))}
              </div>
            </Card>
          )}

          {step === 15 && (
            <Card>
              <QH>Monthly car payment budget?</QH>
              <div className="flex flex-wrap gap-2">
                {BUDGET.map((b, i) => (
                  <Pill key={b} label={b} sel={form.monthlyBudget === b}
                    onClick={() => { set('monthlyBudget', b); setTimeout(next, 260) }} delay={i * 0.06} />
                ))}
              </div>
            </Card>
          )}

          {step === 16 && (
            <Card>
              <QH>How is your credit?</QH>
              <div className="flex flex-wrap gap-2">
                {CREDIT.map((c, i) => (
                  <Pill key={c} label={c} sel={form.creditScore === c}
                    onClick={() => { set('creditScore', c); setTimeout(next, 260) }} delay={i * 0.05} />
                ))}
              </div>
            </Card>
          )}

          {step === 17 && (
            <Card>
              <QH>Best time to reach you?</QH>
              <div className="flex flex-wrap gap-2">
                {CTIMES.map((t, i) => (
                  <Pill key={t} label={t} sel={form.contactTime === t}
                    onClick={() => { set('contactTime', t); setTimeout(next, 260) }} delay={i * 0.07} />
                ))}
              </div>
            </Card>
          )}

          {step === 18 && (
            <Card>
              <Step18 form={form} />
            </Card>
          )}
        </div>
      </AnimatePresence>
    </div>
  )
}

/* ======================================================
   MOBILE FALLBACK SCENE
====================================================== */

function MobileBackground({ step }: { step: number }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F0] via-[#FFEFD0] to-[#F5E6C8]">
      {/* Static car silhouette bg gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, #F5C842 0%, transparent 70%)',
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/sedan-hero.png"
        alt="Vehicle"
        className="absolute bottom-[30vh] left-1/2 -translate-x-1/2 w-[90vw] max-w-sm object-contain opacity-70 transition-opacity duration-500"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    </div>
  )
}

/* ======================================================
   MAIN PAGE
====================================================== */

export default function FunnelPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [mobile, setMobile] = useState(false)

  const scrollWrapRef = useRef<HTMLDivElement>(null)
  const camTarget = useRef(new THREE.Vector3(4, 1.5, 6))

  // Detect mobile
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // GSAP ScrollTrigger — camera orbit
  useEffect(() => {
    if (mobile) return
    const el = scrollWrapRef.current
    if (!el) return

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress
        const stepF = progress * (TOTAL_STEPS - 1)
        const idx = Math.min(Math.floor(stepF), TOTAL_STEPS - 2)
        const t = stepF - idx

        const from = CAM_POSITIONS[idx]
        const to = CAM_POSITIONS[idx + 1]

        camTarget.current.set(
          from[0] + (to[0] - from[0]) * t,
          from[1] + (to[1] - from[1]) * t,
          from[2] + (to[2] - from[2]) * t,
        )

        const newStep = Math.round(stepF)
        setStep(prev => prev !== newStep ? newStep : prev)
      },
    })

    return () => { trigger.kill() }
  }, [mobile])

  const set = useCallback((k: keyof FormData, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }))
  }, [])

  // On mobile, next scrolls to the next step
  const next = useCallback(() => {
    if (mobile) {
      setStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1))
      return
    }
    // On desktop, scroll to next step's position
    const nextStep = Math.min(step + 1, TOTAL_STEPS - 1)
    const targetScroll = (nextStep / (TOTAL_STEPS - 1)) * TOTAL_HEIGHT
    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }, [mobile, step])

  /* ── MOBILE LAYOUT ── */
  if (mobile) {
    return (
      <div className="relative min-h-screen bg-[#FFF8F0]">
        <ProgressBar step={step} />
        <MobileBackground step={step} />
        <div style={{ position: 'relative', zIndex: 20, minHeight: '100vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 16px 48px' }}>
          <AnimatePresence mode="wait">
            <div key={step} style={{ width: '100%', maxWidth: 400, pointerEvents: 'auto' }}>
              {step === 0 && (
                <Card>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#F5C842]" />
                    <span className="text-xs text-[#9a8a7a] font-medium tracking-widest uppercase">AutoLoans.ca</span>
                  </motion.div>
                  <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="font-bold text-[#0a1628] leading-tight mb-3"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2rem' }}
                  >
                    Get Approved For a Vehicle
                  </motion.h1>
                  <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="space-y-1.5 mb-6 text-sm text-[#3a3a3a]"
                  >
                    {['2-minute application', 'No credit impact', 'All provinces accepted'].map(t => (
                      <li key={t} className="flex items-center gap-2">
                        <span className="text-[#F5C842] font-bold">✓</span> {t}
                      </li>
                    ))}
                  </motion.ul>
                  <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={next}
                    className="w-full py-3.5 rounded-full bg-[#0a1628] text-white font-semibold text-sm shadow-lg pointer-events-auto"
                  >
                    Begin My Journey →
                  </motion.button>
                </Card>
              )}
              {step !== 0 && (
                <FormOverlay step={step} form={form} set={set} next={next} mobile={true} />
              )}
            </div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  /* ── DESKTOP LAYOUT: tall scroll + sticky canvas ── */
  return (
    <div ref={scrollWrapRef} style={{ height: TOTAL_HEIGHT, position: 'relative' }}>
      <ProgressBar step={step} />

      {/* Sticky viewport */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* R3F Canvas */}
        <Canvas
          camera={{ position: [5, 2, 8], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          shadows
          style={{ position: 'absolute', inset: 0 }}
          dpr={[1, 1.5]}
        >
          <Scene3D camTarget={camTarget} />
        </Canvas>

        {/* Step counter ghost text */}
        <div style={{
          position: 'absolute', bottom: '2vh', left: '50%', transform: 'translateX(-50%)',
          zIndex: 15, pointerEvents: 'none',
          color: 'rgba(10,22,40,0.12)',
          fontSize: 'clamp(5rem, 15vw, 12rem)',
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          userSelect: 'none',
          lineHeight: 1,
        }}>
          {['DRIVE','CHOOSE','BRAND','NAME','EMAIL','PHONE','CANADA','DOWN','AGE','HOME',
            'EARN','WORK','PAY','INCOME','LIVE','BUDGET','CREDIT','CALL','APPROVE'][step]}
        </div>

        {/* Scroll hint on step 0 */}
        <AnimatePresence>
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', bottom: '4vh', right: '4vw',
                zIndex: 25, pointerEvents: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}
            >
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#9a8a7a', textTransform: 'uppercase' }}>Scroll</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #F5C842, transparent)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form overlay */}
        <FormOverlay step={step} form={form} set={set} next={next} mobile={false} />
      </div>
    </div>
  )
}
