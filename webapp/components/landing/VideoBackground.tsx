'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useReducedMotion, isWebGLAvailable } from './three/useReducedMotion'

// R3F scene must never render on the server (WebGL is client-only).
const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => null,
})

interface VideoBackgroundProps {
  src?: string
  fallbackColor?: string
}

export default function VideoBackground({
  src,
  fallbackColor = '#0a1a0a',
}: VideoBackgroundProps) {
  const reducedMotion = useReducedMotion()
  const [canRenderScene, setCanRenderScene] = useState(false)

  // Decide on the client whether the immersive scene is viable.
  useEffect(() => {
    if (!reducedMotion && isWebGLAvailable()) setCanRenderScene(true)
    else setCanRenderScene(false)
  }, [reducedMotion])

  // If a video src is supplied, the original video path takes precedence.
  const showScene = !src && canRenderScene

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated/gradient base layer — always present as the WebGL fallback
          and as the canvas backdrop while the dynamic chunk loads. */}
      <div
        className="absolute inset-0 w-full h-full landing-gradient"
        style={{
          background: `linear-gradient(135deg, ${fallbackColor} 0%, #0d2d2a 45%, #102f1c 100%)`,
        }}
      />

      {/* Immersive 3D scene (decorative). */}
      {showScene && (
        <div className="absolute inset-0">
          <Scene3D />
        </div>
      )}

      {/* Video path preserved for when a real asset is provided. */}
      {src && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Readability overlay — keeps white hero text AA-compliant over the
          brighter, animated scene. Slightly lighter than before since the
          scene is darker than a video would be. */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-black/40" />

      {/* Subtle vignette to anchor the center where the hero sits. */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .landing-gradient {
          background-size: 200% 200%;
          animation: landing-pan 24s ease-in-out infinite;
        }
        @keyframes landing-pan {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-gradient { animation: none; }
        }
      `,
        }}
      />
    </div>
  )
}
