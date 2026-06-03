'use client'

import { useState, useEffect, useRef } from 'react'
import TechSidebar from '@/components/landing/TechSidebar'

const VIDEOS = ['/videos/hero-2.mp4', '/videos/hero-3.mp4', '/videos/hero-4.mp4']
const DISPLAY_MS = 10000
const FADE_MS = 1500

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % VIDEOS.length)
    }, DISPLAY_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <main style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg, #0a2e0a 0%, #1a5c1a 50%, #0d3d0d 100%)' }}>

      {VIDEOS.map((src, i) => (
        <video
          key={src}
          autoPlay
          loop
          muted
          playsInline
          preload={i === 0 ? 'auto' : 'none'}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: i === activeIndex ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.35)',
        zIndex: 1,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'white',
        textAlign: 'center',
        padding: '0 24px',
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px' }}>
          Aiagro.cl
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.8 }}>
          Inteligencia agrícola para decisiones que importan
        </p>
      </div>

      <TechSidebar />

    </main>
  )
}
