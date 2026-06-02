'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count: number
  /** Shared pointer parallax target in NDC-ish range [-1, 1]. */
  pointer: React.RefObject<{ x: number; y: number }>
}

/**
 * Floating field of agricultural "data points" — evokes IoT sensors and
 * satellite telemetry drifting in space.
 *
 * Single THREE.Points → one draw call regardless of count. Positions and
 * per-point sizes are baked once into typed arrays. Motion is achieved by
 * slowly rotating + bobbing the parent group in useFrame (no per-vertex CPU
 * work) plus an eased pointer parallax.
 *
 * A soft round sprite is generated procedurally on a canvas (created once) so
 * we don't ship a texture asset and avoid square "blocky" points.
 */
export default function ParticleField({ count, pointer }: ParticleFieldProps) {
  const groupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)

  // Bake geometry attributes once.
  const { positions, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const colors = new Float32Array(count * 3)

    // Two agricultural accent colors: crop green and a brighter sensor lime.
    const green = new THREE.Color('#3ddc84')
    const lime = new THREE.Color('#9be87f')
    const teal = new THREE.Color('#2ec4b6')

    for (let i = 0; i < count; i++) {
      // Distribute in a wide, shallow slab so it reads as a horizon field.
      const r = Math.pow(Math.random(), 0.6) * 14 // bias toward center
      const theta = Math.random() * Math.PI * 2
      positions[i * 3 + 0] = Math.cos(theta) * r
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = Math.sin(theta) * r - 4

      sizes[i] = Math.random() * 0.08 + 0.02

      const c = Math.random()
      const col = c < 0.6 ? green : c < 0.85 ? lime : teal
      colors[i * 3 + 0] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    return { positions, sizes, colors }
  }, [count])

  // Soft circular sprite, built once.
  const sprite = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.35, 'rgba(255,255,255,0.6)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Dispose GPU resources on unmount to avoid leaks across route changes.
  useEffect(() => {
    return () => {
      sprite.dispose()
      pointsRef.current?.geometry.dispose()
      const mat = pointsRef.current?.material
      if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((m) => m.dispose())
    }
  }, [sprite])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return

    // Slow continuous drift.
    group.rotation.y += delta * 0.02
    group.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3

    // Eased pointer parallax (ref-driven, no React re-render).
    const target = pointer.current
    if (target) {
      group.rotation.x += (target.y * 0.12 - group.rotation.x) * 0.04
      group.rotation.z += (-target.x * 0.06 - group.rotation.z) * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          map={sprite}
          vertexColors
          transparent
          alphaTest={0.01}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          opacity={0.9}
        />
      </points>
    </group>
  )
}
