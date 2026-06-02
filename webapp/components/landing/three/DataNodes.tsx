'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DataNodesProps {
  count: number
  drawConnections: boolean
  pointer: React.RefObject<{ x: number; y: number }>
}

/**
 * Organic "sensor network": a handful of larger glowing data nodes with thin
 * connection lines between near neighbours — the visual language of an IoT mesh
 * over a field.
 *
 * Nodes: one InstancedMesh (1 draw call). Each node pulses by writing a scale
 * into a reused Matrix4 each frame — zero allocation in the loop.
 * Connections: a single LineSegments built once from precomputed neighbour
 * pairs; only rendered on the high tier (extra overdraw on mobile).
 */
export default function DataNodes({
  count,
  drawConnections,
  pointer,
}: DataNodesProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // Reusable scratch objects (never allocate inside useFrame).
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Node positions + per-node pulse phase, baked once.
  const nodes = useMemo(() => {
    const arr: { pos: THREE.Vector3; phase: number; baseScale: number }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 8 - 4,
        ),
        phase: Math.random() * Math.PI * 2,
        baseScale: Math.random() * 0.12 + 0.1,
      })
    }
    return arr
  }, [count])

  // Connection line geometry — link each node to its nearest few neighbours.
  const lineGeometry = useMemo(() => {
    if (!drawConnections) return null
    const verts: number[] = []
    const maxDist = 7
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < maxDist) {
          verts.push(
            nodes[i].pos.x,
            nodes[i].pos.y,
            nodes[i].pos.z,
            nodes[j].pos.x,
            nodes[j].pos.y,
            nodes[j].pos.z,
          )
        }
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(verts, 3),
    )
    return geo
  }, [nodes, drawConnections])

  useEffect(() => {
    return () => lineGeometry?.dispose()
  }, [lineGeometry])

  useFrame((state, delta) => {
    const group = groupRef.current
    const mesh = meshRef.current
    const t = state.clock.elapsedTime

    if (mesh) {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        // Pulse scale between ~0.8x and ~1.25x of base.
        const pulse = 1 + Math.sin(t * 1.4 + n.phase) * 0.22
        const s = n.baseScale * pulse
        dummy.position.copy(n.pos)
        dummy.scale.setScalar(s)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }

    if (group) {
      group.rotation.y += delta * 0.015
      const target = pointer.current
      if (target) {
        group.rotation.x += (target.y * 0.08 - group.rotation.x) * 0.04
        group.position.x += (target.x * 0.4 - group.position.x) * 0.04
      }
    }
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#5bffb0"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>

      {lineGeometry && (
        <lineSegments geometry={lineGeometry} renderOrder={-1}>
          <lineBasicMaterial
            color="#2ec4b6"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  )
}
