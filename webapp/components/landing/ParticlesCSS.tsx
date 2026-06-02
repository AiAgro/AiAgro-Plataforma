'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.5 + 0.1,
  }))
}

export default function ParticlesCSS() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(generateParticles(60))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUp {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 4px rgba(74,222,128,0.3); }
          50% { box-shadow: 0 0 12px rgba(74,222,128,0.8); }
        }
      `}} />
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-green-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s ${p.delay}s infinite linear,
                        pulse-glow ${p.duration / 3}s ${p.delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  )
}
