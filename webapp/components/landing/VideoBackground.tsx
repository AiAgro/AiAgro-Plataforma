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
  // Brighter agricultural green so the fallback reads clearly as green, not
  // black, even before/without WebGL. (#0a1a0a was effectively black once the
  // dark overlays were stacked on top.)
  fallbackColor = '#114b35',
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
          background: `linear-gradient(135deg, ${fallbackColor} 0%, #155e45 45%, #0d3b2c 100%)`,
        }}
      />

      {/* Immersive 3D scene (decorative). */}
      {showScene && (
        // Explicit width/height (not just inset-0) so R3F's ResizeObserver
        // always measures a real size on first paint and allocates a drawing
        // buffer. An absolute box with only `inset-0` could measure 0x0 on
        // mount, leaving the canvas black.
        <div
          className="absolute inset-0"
          style={{ width: '100%', height: '100%' }}
        >
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
      <div className="absolute inset-0 z-10 pointer-events-none bg-black/25" />

      {/* Subtle vignette to anchor the center where the hero sits. Lightened so
          the green base/scene stays visible at the edges instead of crushing
          to black. */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)',
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
