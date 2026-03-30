'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'

// ─── Scene configs ────────────────────────────────────────────────────────────

interface SceneCfg {
  skyTurbidity: number
  skyRayleigh: number
  sunPos: [number, number, number]
  fogColor: string
  fogNear: number
  fogFar: number
  terrainColor: string
  carColor: string
  ambientInt: number
  sunInt: number
  envType: 'city' | 'mountain' | 'desert' | 'coast' | 'track' | 'night' | 'country'
  isNight: boolean
}

const CFGS: Record<string, SceneCfg> = {
  Sedan:           { skyTurbidity: 8,   skyRayleigh: 0.5, sunPos: [0.8,0.08,0],   fogColor:'#ff9a4d', fogNear:15, fogFar:80,  terrainColor:'#4a5568', carColor:'#2563EB', ambientInt:0.6, sunInt:2.2, envType:'city',     isNight:false },
  SUV:             { skyTurbidity: 2,   skyRayleigh: 1.2, sunPos: [0.4,0.5,0.2],  fogColor:'#c8dff5', fogNear:20, fogFar:120, terrainColor:'#4a6741', carColor:'#15803D', ambientInt:0.8, sunInt:3.0, envType:'mountain',  isNight:false },
  Truck:           { skyTurbidity: 12,  skyRayleigh: 2.0, sunPos: [0.9,0.1,0],    fogColor:'#f5d4a0', fogNear:15, fogFar:100, terrainColor:'#7a5c2a', carColor:'#C2410C', ambientInt:0.7, sunInt:2.5, envType:'desert',    isNight:false },
  Van:             { skyTurbidity: 4,   skyRayleigh: 0.8, sunPos: [0.2,0.35,0.8], fogColor:'#b8d4f0', fogNear:18, fogFar:90,  terrainColor:'#4a6a6a', carColor:'#7C3AED', ambientInt:0.9, sunInt:2.0, envType:'coast',     isNight:false },
  Coupe:           { skyTurbidity: 15,  skyRayleigh: 3.0, sunPos: [0.95,0.03,0],  fogColor:'#8aa0c0', fogNear:10, fogFar:70,  terrainColor:'#2a2a3a', carColor:'#DC2626', ambientInt:0.5, sunInt:1.5, envType:'track',     isNight:false },
  Convertible:     { skyTurbidity: 7,   skyRayleigh: 1.5, sunPos: [0.75,0.12,0.3],fogColor:'#ffb77a', fogNear:18, fogFar:100, terrainColor:'#5a6a40', carColor:'#D97706', ambientInt:0.9, sunInt:2.5, envType:'coast',     isNight:false },
  'Electric/Hybrid':{ skyTurbidity: 0.5, skyRayleigh: 0.2, sunPos: [0,-0.5,0],    fogColor:'#1a2a4a', fogNear:8,  fogFar:60,  terrainColor:'#1a1a2e', carColor:'#0EA5E9', ambientInt:0.3, sunInt:0.5, envType:'night',     isNight:true  },
  Other:           { skyTurbidity: 3,   skyRayleigh: 0.9, sunPos: [0.3,0.45,0.1], fogColor:'#c8d8e8', fogNear:20, fogFar:110, terrainColor:'#5a6a4a', carColor:'#4B5563', ambientInt:0.8, sunInt:2.5, envType:'country',   isNight:false },
  default:         { skyTurbidity: 5,   skyRayleigh: 1.0, sunPos: [0.5,0.3,0],    fogColor:'#c8d8e8', fogNear:20, fogFar:100, terrainColor:'#4a5a4a', carColor:'#4B5563', ambientInt:0.7, sunInt:2.0, envType:'country',   isNight:false },
}

// ─── Road ────────────────────────────────────────────────────────────────────

function Road() {
  const meshRef = useRef<THREE.Mesh>(null)

  const tex = useMemo(() => {
    const sz = 512
    const c = document.createElement('canvas')
    c.width = sz; c.height = sz
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#1e1e1e'
    ctx.fillRect(0, 0, sz, sz)
    // grain
    for (let i = 0; i < 3000; i++) {
      const b = 20 + Math.random() * 20
      ctx.fillStyle = `rgb(${b},${b},${b})`
      ctx.fillRect(Math.random() * sz, Math.random() * sz, 2, 2)
    }
    // shoulder lines
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 8
    ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(28, sz); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(sz - 28, 0); ctx.lineTo(sz - 28, sz); ctx.stroke()
    // center dashes
    ctx.lineWidth = 5
    ctx.setLineDash([60, 60])
    ctx.beginPath(); ctx.moveTo(sz / 2, 0); ctx.lineTo(sz / 2, sz); ctx.stroke()
    const t = new THREE.CanvasTexture(c)
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    t.repeat.set(1, 14)
    return t
  }, [])

  useFrame((_, dt) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      if (mat.map) mat.map.offset.y += dt * 0.65
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[7, 220]} />
      <meshStandardMaterial map={tex} roughness={0.9} metalness={0.08} />
    </mesh>
  )
}

// ─── Terrain ─────────────────────────────────────────────────────────────────

function Terrain({ color }: { color: string }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-32, -0.12, -10]}>
        <planeGeometry args={[56, 220]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[32, -0.12, -10]}>
        <planeGeometry args={[56, 220]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </>
  )
}

// ─── Environment props ────────────────────────────────────────────────────────

type EnvPropData = { lx: number; rx: number; z0: number; scale: number; h: number }

function EnvProps({ envType, terrainColor }: { envType: SceneCfg['envType']; terrainColor: string }) {
  const COUNT = 22
  const lRefs = useRef<(THREE.Group | null)[]>([])
  const rRefs = useRef<(THREE.Group | null)[]>([])
  const zPos  = useRef<number[]>([])

  const data = useMemo<EnvPropData[]>(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      lx:    -(5 + Math.random() * 9),
      rx:      5 + Math.random() * 9,
      z0:    -8 - i * 5,
      scale:  0.55 + Math.random() * 0.75,
      h:      2.5 + Math.random() * 4,
    })),
  [envType])

  useEffect(() => {
    zPos.current = data.map(d => d.z0)
  }, [data])

  useFrame((_, dt) => {
    for (let i = 0; i < COUNT; i++) {
      zPos.current[i] = (zPos.current[i] ?? -8 - i * 5) + dt * 18
      if (zPos.current[i] > 14) zPos.current[i] = -105 - Math.random() * 15
      const z = zPos.current[i]
      if (lRefs.current[i]) lRefs.current[i]!.position.z = z
      if (rRefs.current[i]) rRefs.current[i]!.position.z = z
    }
  })

  function Prop({ h }: { h: number }) {
    if (envType === 'city' || envType === 'night') {
      const emissive = envType === 'night' ? '#1E40AF' : '#000000'
      const emissiveInt = envType === 'night' ? 0.4 : 0
      return (
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[1.4, h, 1.4]} />
          <meshStandardMaterial color={envType === 'night' ? '#0F172A' : terrainColor} emissive={emissive} emissiveIntensity={emissiveInt} />
        </mesh>
      )
    }
    if (envType === 'desert') {
      return (
        <mesh position={[0, h * 0.3, 0]}>
          <boxGeometry args={[0.55, h * 0.6, 0.55]} />
          <meshStandardMaterial color="#8B7355" roughness={1} />
        </mesh>
      )
    }
    if (envType === 'track') {
      return (
        <group>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.18, 1.1, 0.18]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.16, 8]} />
            <meshStandardMaterial color="#1F2937" />
          </mesh>
        </group>
      )
    }
    // tree (mountain, coast, country)
    return (
      <group>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.11, 0.16, 0.9, 6]} />
          <meshStandardMaterial color="#5C4033" />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <coneGeometry args={[0.68, 1.5, 7]} />
          <meshStandardMaterial color="#2D6A4F" />
        </mesh>
        <mesh position={[0, 1.95, 0]}>
          <coneGeometry args={[0.48, 1.15, 7]} />
          <meshStandardMaterial color="#1B4332" />
        </mesh>
      </group>
    )
  }

  return (
    <>
      {data.map((d, i) => (
        <group key={`l${i}`} ref={el => { lRefs.current[i] = el }} position={[d.lx, 0, d.z0]} scale={d.scale}>
          <Prop h={d.h} />
        </group>
      ))}
      {data.map((d, i) => (
        <group key={`r${i}`} ref={el => { rRefs.current[i] = el }} position={[d.rx, 0, d.z0]} scale={d.scale}>
          <Prop h={d.h} />
        </group>
      ))}
    </>
  )
}

// ─── Wheel ────────────────────────────────────────────────────────────────────

function Wheel({ pos }: { pos: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.x += dt * 8 })
  return (
    <group position={pos}>
      <mesh ref={ref} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 0.16, 8]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

// ─── Car models ───────────────────────────────────────────────────────────────

function Sedan({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.8, 0.6, 3.8]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.74, -0.1]}>
        <boxGeometry args={[1.7, 0.52, 2.2]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.74, -0.1]}>
        <boxGeometry args={[1.71, 0.38, 2.1]} />
        <meshStandardMaterial color="#BFDBFE" transparent opacity={0.65} roughness={0.08} />
      </mesh>
      <mesh position={[0.68, 0.3, -1.92]}><boxGeometry args={[0.3, 0.14, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.6} /></mesh>
      <mesh position={[-0.68, 0.3, -1.92]}><boxGeometry args={[0.3, 0.14, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.6} /></mesh>
      <mesh position={[0.68, 0.3, 1.92]}><boxGeometry args={[0.3, 0.14, 0.05]} /><meshStandardMaterial color="#FCA5A5" emissive="#EF4444" emissiveIntensity={0.9} /></mesh>
      <mesh position={[-0.68, 0.3, 1.92]}><boxGeometry args={[0.3, 0.14, 0.05]} /><meshStandardMaterial color="#FCA5A5" emissive="#EF4444" emissiveIntensity={0.9} /></mesh>
      <Wheel pos={[ 0.98, 0.25, -1.3]} /><Wheel pos={[-0.98, 0.25, -1.3]} />
      <Wheel pos={[ 0.98, 0.25,  1.3]} /><Wheel pos={[-0.98, 0.25,  1.3]} />
    </group>
  )
}

function SUV({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.42, 0]}><boxGeometry args={[1.9, 0.84, 4.0]} /><meshStandardMaterial color={color} metalness={0.4} roughness={0.5} /></mesh>
      <mesh position={[0, 0.97, 0]}><boxGeometry args={[1.85, 0.68, 3.5]} /><meshStandardMaterial color={color} metalness={0.4} roughness={0.5} /></mesh>
      <mesh position={[0, 0.97, 0]}><boxGeometry args={[1.86, 0.5, 3.4]} /><meshStandardMaterial color="#BBF7D0" transparent opacity={0.55} roughness={0.08} /></mesh>
      <mesh position={[0, 1.36, 0]}><boxGeometry args={[1.6, 0.06, 3.2]} /><meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0.72, 0.44, -2.03]}><boxGeometry args={[0.32, 0.2, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.6} /></mesh>
      <mesh position={[-0.72, 0.44, -2.03]}><boxGeometry args={[0.32, 0.2, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.6} /></mesh>
      <mesh position={[0.72, 0.44, 2.03]}><boxGeometry args={[0.32, 0.2, 0.05]} /><meshStandardMaterial color="#FCA5A5" emissive="#EF4444" emissiveIntensity={0.9} /></mesh>
      <mesh position={[-0.72, 0.44, 2.03]}><boxGeometry args={[0.32, 0.2, 0.05]} /><meshStandardMaterial color="#FCA5A5" emissive="#EF4444" emissiveIntensity={0.9} /></mesh>
      <Wheel pos={[ 1.05, 0.28, -1.5]} /><Wheel pos={[-1.05, 0.28, -1.5]} />
      <Wheel pos={[ 1.05, 0.28,  1.5]} /><Wheel pos={[-1.05, 0.28,  1.5]} />
    </group>
  )
}

function Truck({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.44, -1.2]}><boxGeometry args={[1.9, 0.88, 1.8]} /><meshStandardMaterial color={color} metalness={0.4} roughness={0.5} /></mesh>
      <mesh position={[0, 0.96, -1.2]}><boxGeometry args={[1.85, 0.68, 1.6]} /><meshStandardMaterial color={color} metalness={0.4} roughness={0.5} /></mesh>
      <mesh position={[0, 0.96, -1.2]}><boxGeometry args={[1.82, 0.5, 1.55]} /><meshStandardMaterial color="#FED7AA" transparent opacity={0.6} roughness={0.08} /></mesh>
      <mesh position={[0, 0.25, 1.3]}><boxGeometry args={[1.9, 0.5, 2.2]} /><meshStandardMaterial color={color} metalness={0.3} roughness={0.6} /></mesh>
      <mesh position={[ 0.9, 0.54, 1.3]}><boxGeometry args={[0.1, 0.3, 2.2]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[-0.9, 0.54, 1.3]}><boxGeometry args={[0.1, 0.3, 2.2]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.44, 2.43]}><boxGeometry args={[1.9, 0.5, 0.08]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.72, 0.44, -2.12]}><boxGeometry args={[0.3, 0.2, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.6} /></mesh>
      <mesh position={[-0.72, 0.44, -2.12]}><boxGeometry args={[0.3, 0.2, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.6} /></mesh>
      <Wheel pos={[ 1.05, 0.26, -1.6]} /><Wheel pos={[-1.05, 0.26, -1.6]} />
      <Wheel pos={[ 1.05, 0.26,  1.6]} /><Wheel pos={[-1.05, 0.26,  1.6]} />
    </group>
  )
}

function Van({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.7, 0]}><boxGeometry args={[2.0, 1.4, 4.2]} /><meshStandardMaterial color={color} metalness={0.4} roughness={0.5} /></mesh>
      <mesh position={[0, 0.85, -2.12]}><boxGeometry args={[1.7, 0.8, 0.05]} /><meshStandardMaterial color="#DDD6FE" transparent opacity={0.65} roughness={0.08} /></mesh>
      <mesh position={[ 1.02, 0.8, -0.55]}><boxGeometry args={[0.05, 0.42, 0.8]} /><meshStandardMaterial color="#DDD6FE" transparent opacity={0.65} roughness={0.08} /></mesh>
      <mesh position={[ 1.02, 0.8,  0.45]}><boxGeometry args={[0.05, 0.42, 0.8]} /><meshStandardMaterial color="#DDD6FE" transparent opacity={0.65} roughness={0.08} /></mesh>
      <mesh position={[-1.02, 0.8, -0.55]}><boxGeometry args={[0.05, 0.42, 0.8]} /><meshStandardMaterial color="#DDD6FE" transparent opacity={0.65} roughness={0.08} /></mesh>
      <mesh position={[-1.02, 0.8,  0.45]}><boxGeometry args={[0.05, 0.42, 0.8]} /><meshStandardMaterial color="#DDD6FE" transparent opacity={0.65} roughness={0.08} /></mesh>
      <mesh position={[ 0.7, 0.5, -2.13]}><boxGeometry args={[0.35, 0.22, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.6} /></mesh>
      <mesh position={[-0.7, 0.5, -2.13]}><boxGeometry args={[0.35, 0.22, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.6} /></mesh>
      <mesh position={[ 0.7, 0.5,  2.13]}><boxGeometry args={[0.35, 0.22, 0.05]} /><meshStandardMaterial color="#FCA5A5" emissive="#EF4444" emissiveIntensity={0.9} /></mesh>
      <mesh position={[-0.7, 0.5,  2.13]}><boxGeometry args={[0.35, 0.22, 0.05]} /><meshStandardMaterial color="#FCA5A5" emissive="#EF4444" emissiveIntensity={0.9} /></mesh>
      <Wheel pos={[ 1.08, 0.27, -1.5]} /><Wheel pos={[-1.08, 0.27, -1.5]} />
      <Wheel pos={[ 1.08, 0.27,  1.5]} /><Wheel pos={[-1.08, 0.27,  1.5]} />
    </group>
  )
}

function Coupe({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.22, 0]}><boxGeometry args={[1.85, 0.44, 3.8]} /><meshStandardMaterial color={color} metalness={0.65} roughness={0.25} /></mesh>
      <mesh position={[0, 0.55, 0.3]}><boxGeometry args={[1.78, 0.5, 2.4]} /><meshStandardMaterial color={color} metalness={0.65} roughness={0.25} /></mesh>
      <mesh position={[0, 0.57, 0.3]}><boxGeometry args={[1.79, 0.34, 2.3]} /><meshStandardMaterial color="#1e1e2e" transparent opacity={0.82} roughness={0.08} /></mesh>
      <mesh position={[0, 0.49, 1.91]}><boxGeometry args={[1.6, 0.08, 0.3]} /><meshStandardMaterial color={color} metalness={0.65} roughness={0.25} /></mesh>
      <mesh position={[ 0.72, 0.22, -1.92]}><boxGeometry args={[0.3, 0.09, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.8} /></mesh>
      <mesh position={[-0.72, 0.22, -1.92]}><boxGeometry args={[0.3, 0.09, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.8} /></mesh>
      <mesh position={[ 0.72, 0.22,  1.92]}><boxGeometry args={[0.3, 0.09, 0.05]} /><meshStandardMaterial color="#FCA5A5" emissive="#EF4444" emissiveIntensity={1.0} /></mesh>
      <mesh position={[-0.72, 0.22,  1.92]}><boxGeometry args={[0.3, 0.09, 0.05]} /><meshStandardMaterial color="#FCA5A5" emissive="#EF4444" emissiveIntensity={1.0} /></mesh>
      <Wheel pos={[ 1.02, 0.22, -1.35]} /><Wheel pos={[-1.02, 0.22, -1.35]} />
      <Wheel pos={[ 1.02, 0.22,  1.35]} /><Wheel pos={[-1.02, 0.22,  1.35]} />
    </group>
  )
}

function Convertible({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.22, 0]}><boxGeometry args={[1.85, 0.44, 3.6]} /><meshStandardMaterial color={color} metalness={0.5} roughness={0.35} /></mesh>
      <mesh position={[0, 0.57, -0.2]}><boxGeometry args={[1.78, 0.46, 1.4]} /><meshStandardMaterial color={color} metalness={0.5} roughness={0.35} /></mesh>
      <mesh position={[0, 0.61, -0.2]}><boxGeometry args={[1.65, 0.3, 1.35]} /><meshStandardMaterial color="#FEF3C7" transparent opacity={0.5} roughness={0.08} /></mesh>
      <mesh position={[ 0.35, 0.38, 0.5]}><boxGeometry args={[0.5, 0.18, 0.7]} /><meshStandardMaterial color="#92400E" roughness={0.9} /></mesh>
      <mesh position={[-0.35, 0.38, 0.5]}><boxGeometry args={[0.5, 0.18, 0.7]} /><meshStandardMaterial color="#92400E" roughness={0.9} /></mesh>
      <mesh position={[ 0.72, 0.22, -1.82]}><boxGeometry args={[0.3, 0.12, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.6} /></mesh>
      <mesh position={[-0.72, 0.22, -1.82]}><boxGeometry args={[0.3, 0.12, 0.05]} /><meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.6} /></mesh>
      <Wheel pos={[ 1.02, 0.22, -1.25]} /><Wheel pos={[-1.02, 0.22, -1.25]} />
      <Wheel pos={[ 1.02, 0.22,  1.25]} /><Wheel pos={[-1.02, 0.22,  1.25]} />
    </group>
  )
}

function Electric({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.28, 0]}><boxGeometry args={[1.85, 0.56, 3.9]} /><meshStandardMaterial color={color} metalness={0.75} roughness={0.15} /></mesh>
      <mesh position={[0, 0.7, 0]}><boxGeometry args={[1.78, 0.5, 2.8]} /><meshStandardMaterial color={color} metalness={0.75} roughness={0.15} /></mesh>
      <mesh position={[0, 0.72, 0]}><boxGeometry args={[1.79, 0.36, 2.7]} /><meshStandardMaterial color="#1E40AF" transparent opacity={0.45} roughness={0.05} /></mesh>
      <mesh position={[0, 0.28, -1.97]}><boxGeometry args={[1.7, 0.06, 0.05]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} /></mesh>
      <mesh position={[0, 0.28,  1.97]}><boxGeometry args={[1.7, 0.06, 0.05]} /><meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={2.5} /></mesh>
      <mesh position={[0, -0.02, 0]}><boxGeometry args={[1.5, 0.04, 3.5]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.55} /></mesh>
      <Wheel pos={[ 1.02, 0.25, -1.4]} /><Wheel pos={[-1.02, 0.25, -1.4]} />
      <Wheel pos={[ 1.02, 0.25,  1.4]} /><Wheel pos={[-1.02, 0.25,  1.4]} />
    </group>
  )
}

const CAR_MAP: Record<string, React.ComponentType<{ color: string }>> = {
  Sedan, SUV, Truck, Van, Coupe, Convertible, 'Electric/Hybrid': Electric, Other: Sedan,
}

function CarModel({ vehicleType, bob = true }: { vehicleType: string; bob?: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const cfg = CFGS[vehicleType] || CFGS.default
  const Model = CAR_MAP[vehicleType] || Sedan
  useFrame(state => {
    if (ref.current && bob) {
      const t = state.clock.elapsedTime
      ref.current.position.y = Math.sin(t * 2.4) * 0.022 + Math.sin(t * 1.3) * 0.01
      ref.current.rotation.z = Math.sin(t * 1.7) * 0.007
    }
  })
  return (
    <group ref={ref}>
      <Model color={cfg.carColor} />
    </group>
  )
}

// ─── Parking success scene ────────────────────────────────────────────────────

function ParkingScene({ vehicleType }: { vehicleType: string }) {
  const carRef   = useRef<THREE.Group>(null)
  const startRef = useRef<number | null>(null)

  useFrame(state => {
    if (!carRef.current) return
    if (startRef.current === null) startRef.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - startRef.current
    const t = Math.min(elapsed / 2.8, 1)
    const e = 1 - Math.pow(1 - t, 3)
    carRef.current.position.z = THREE.MathUtils.lerp(-22, 1.8, e)
    if (t > 0.8) {
      const pt = (t - 0.8) / 0.2
      carRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.14, pt)
    }
  })

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#16A34A" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.5]}>
        <planeGeometry args={[7.5, 14]} />
        <meshStandardMaterial color="#D1D5DB" />
      </mesh>
      {/* House */}
      <group position={[0, 0, -9]}>
        <mesh position={[0, 1.6, 0]}><boxGeometry args={[7, 3.2, 5]} /><meshStandardMaterial color="#F3F4F6" /></mesh>
        <mesh position={[0, 3.7, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[4.3, 2.2, 4]} /><meshStandardMaterial color="#B91C1C" /></mesh>
        <mesh position={[0, 0.9, 2.51]}><boxGeometry args={[0.95, 1.9, 0.06]} /><meshStandardMaterial color="#92400E" /></mesh>
        <mesh position={[-1.7, 1.6, 2.51]}><boxGeometry args={[1.1, 1.1, 0.06]} /><meshStandardMaterial color="#BFDBFE" transparent opacity={0.8} /></mesh>
        <mesh position={[ 1.7, 1.6, 2.51]}><boxGeometry args={[1.1, 1.1, 0.06]} /><meshStandardMaterial color="#BFDBFE" transparent opacity={0.8} /></mesh>
        <mesh position={[3.0, 1.1, 2.51]}><boxGeometry args={[2.2, 2.2, 0.06]} /><meshStandardMaterial color="#9CA3AF" /></mesh>
      </group>
      {/* Trees */}
      {([-5, 5] as number[]).map(x => (
        <group key={x} position={[x, 0, -6]}>
          <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.12, 0.17, 1.1, 6]} /><meshStandardMaterial color="#5C4033" /></mesh>
          <mesh position={[0, 1.5, 0]}><sphereGeometry args={[0.75, 8, 8]} /><meshStandardMaterial color="#15803D" /></mesh>
        </group>
      ))}
      <group ref={carRef} position={[0, 0, -22]}>
        <CarModel vehicleType={vehicleType} bob={false} />
      </group>
    </>
  )
}

// ─── Camera controller ────────────────────────────────────────────────────────

function CameraController({ isSuccess }: { isSuccess: boolean }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(2.5, 1.8, 5))
  const targetLook = useRef(new THREE.Vector3(0, 0.5, -2))

  useEffect(() => {
    if (isSuccess) {
      targetPos.current.set(6, 3.5, 9)
      targetLook.current.set(0, 1.2, -5)
    } else {
      targetPos.current.set(2.5, 1.8, 5)
      targetLook.current.set(0, 0.5, -2)
    }
  }, [isSuccess])

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.025)
    const look = targetLook.current
    camera.lookAt(look.x, look.y, look.z)
  })

  return null
}

// ─── Scene contents ───────────────────────────────────────────────────────────

function SceneContents({ vehicleType, step, isSuccess }: DriveSceneProps) {
  const cfg = CFGS[vehicleType] || CFGS.default

  return (
    <>
      <CameraController isSuccess={isSuccess} />
      <ambientLight intensity={isSuccess ? 1.1 : cfg.ambientInt} color={cfg.isNight ? '#1E3A5F' : '#ffffff'} />
      <directionalLight
        position={[cfg.sunPos[0] * 50, cfg.sunPos[1] * 50, cfg.sunPos[2] * 50 - 20]}
        intensity={isSuccess ? 2.5 : cfg.sunInt}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {cfg.isNight && !isSuccess && (
        <>
          <pointLight position={[0, 0.3, 0]} color="#0EA5E9" intensity={2.2} distance={5} />
          <pointLight position={[0, 2, -25]} color="#0EA5E9" intensity={0.6} distance={35} />
        </>
      )}

      {!isSuccess ? (
        <>
          {!cfg.isNight
            ? <Sky turbidity={cfg.skyTurbidity} rayleigh={cfg.skyRayleigh} sunPosition={cfg.sunPos} mieDirectionalG={0.8} />
            : <>
                <color attach="background" args={['#060818']} />
                <Stars radius={80} depth={50} count={3000} factor={4} saturation={0.8} fade />
              </>
          }
          <fog attach="fog" args={[cfg.fogColor, cfg.fogNear, cfg.fogFar]} />
          <Road />
          <Terrain color={cfg.terrainColor} />
          {vehicleType && step > 1 && <EnvProps envType={cfg.envType} terrainColor={cfg.terrainColor} />}
          <group position={[0, 0, 0]}>
            <CarModel vehicleType={vehicleType || 'Sedan'} />
          </group>
        </>
      ) : (
        <>
          <Sky turbidity={3} rayleigh={1} sunPosition={[0.4, 0.5, 0.2]} />
          <fog attach="fog" args={['#c8dff5', 25, 120]} />
          <ParkingScene vehicleType={vehicleType || 'Sedan'} />
        </>
      )}
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export interface DriveSceneProps {
  vehicleType: string
  step: number
  isSuccess: boolean
}

export default function DriveScene(props: DriveSceneProps) {
  return (
    <Canvas
      camera={{ position: [2.5, 1.8, 5], fov: 60, near: 0.1, far: 400 }}
      shadows
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: false }}
    >
      <SceneContents {...props} />
    </Canvas>
  )
}
