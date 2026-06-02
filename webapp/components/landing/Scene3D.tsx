'use client'

import { Suspense, useCallback, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import GradientBackdrop from './three/GradientBackdrop'
import ParticleField from './three/ParticleField'
import DataNodes from './three/DataNodes'
import { getSceneBudget } from './three/perf'

/**
 * The full R3F background scene. Imported by VideoBackground via
 * next/dynamic({ ssr: false }) so WebGL never runs on the server.
 *
 * Composition (back to front): animated shader gradient → connection mesh +
 * data nodes → drifting particle field. The whole Canvas is decorative
 * (aria-hidden); semantics live in the hero text above it.
 *
 * Performance:
 *  - Budget (counts, DPR ceiling, connections) chosen per device tier.
 *  - PerformanceMonitor lowers a DPR factor when frames drop; AdaptiveDpr
 *    applies it and pixelates under sustained load instead of stuttering.
 *  - Shared pointer ref drives parallax without React re-renders.
 */
export default function Scene3D() {
  const budget = useMemo(() => getSceneBudget(), [])
  const pointer = useRef({ x: 0, y: 0 })

  // DPR factor adjusted by PerformanceMonitor (1 = full budget.dprMax).
  const [dprFactor, setDprFactor] = useState(1)

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!budget.enableParallax) return
      // Normalise to [-1, 1] relative to viewport.
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    },
    [budget.enableParallax],
  )

  return (
    <Canvas
      aria-hidden="true"
      gl={{
        antialias: budget.tier === 'high',
        powerPreference: 'high-performance',
        alpha: false,
      }}
      dpr={[1, budget.dprMax * dprFactor]}
      camera={{ position: [0, 0, 12], fov: 60 }}
      onPointerMove={handlePointerMove}
      // R3F's Canvas root div must keep its default width/height:100%. Overriding
      // it with `position:absolute; inset:0` made the ResizeObserver measure 0x0
      // on first paint (no drawing buffer -> black). Fill the parent explicitly.
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {/* Drop DPR under sustained load; recover when frames are healthy. */}
      <PerformanceMonitor
        onDecline={() => setDprFactor((f) => Math.max(0.6, f - 0.2))}
        onIncline={() => setDprFactor((f) => Math.min(1, f + 0.1))}
      />
      <AdaptiveDpr pixelated />

      <Suspense fallback={null}>
        <GradientBackdrop />
        <DataNodes
          count={budget.nodeCount}
          drawConnections={budget.drawConnections}
          pointer={pointer}
        />
        <ParticleField count={budget.particleCount} pointer={pointer} />
      </Suspense>
    </Canvas>
  )
}
