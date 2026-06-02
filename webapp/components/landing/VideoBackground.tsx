'use client'

import { useState, useEffect, useRef } from 'react'

const VIDEOS = [
  '/videos/hero-1.mp4',
  '/videos/hero-2.mp4',
  '/videos/hero-3.mp4',
]

const DISPLAY_DURATION = 8000
const FADE_DURATION = 2000

export default function VideoBackground() {
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState(1)
  const [fading, setFading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % VIDEOS.length)
        setNext(n => (n + 1) % VIDEOS.length)
        setFading(false)
      }, FADE_DURATION)
    }, DISPLAY_DURATION)

    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">

      {/* Video actual */}
      <video
        key={current}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity"
        style={{
          opacity: fading ? 0 : 1,
          transitionDuration: `${FADE_DURATION}ms`,
        }}
      >
        <source src={VIDEOS[current]} type="video/mp4" />
      </video>

      {/* Video siguiente (precargado) */}
      <video
        key={`next-${next}`}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity"
        style={{
          opacity: fading ? 1 : 0,
          transitionDuration: `${FADE_DURATION}ms`,
        }}
      >
        <source src={VIDEOS[next]} type="video/mp4" />
      </video>

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Vignette radial */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />

    </div>
  )
}
