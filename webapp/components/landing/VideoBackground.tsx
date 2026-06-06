'use client'

import { useState, useEffect, useRef } from 'react'

const VIDEOS = [
  'https://res.cloudinary.com/djsmiyodp/video/upload/q_auto/f_auto/v1780782341/hero-8_tjozyo.mp4',
  'https://res.cloudinary.com/djsmiyodp/video/upload/q_auto/f_auto/v1780782370/hero-9_nz0spz.mp4',
  'https://res.cloudinary.com/djsmiyodp/video/upload/q_auto/f_auto/v1780782379/hero-10_hq3ukw.mp4',
  'https://res.cloudinary.com/djsmiyodp/video/upload/q_auto/f_auto/v1780782387/hero-11_g5s9wi.mp4',
]
const DISPLAY_MS = 10000
const FADE_MS = 1500

export default function VideoBackground() {
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      {VIDEOS.map((src, i) => (
        <video
          key={src}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === activeIndex ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}

      {/* Un solo overlay — solo para legibilidad del texto */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          zIndex: 1,
        }}
      />
    </div>
  )
}
