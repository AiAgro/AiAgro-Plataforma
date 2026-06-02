'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks the user's `prefers-reduced-motion` setting reactively.
 *
 * Returns `true` when the user has requested reduced motion. We start `false`
 * to keep SSR output deterministic, then sync on mount. Consumers should treat
 * the 3D scene as opt-in: skip it entirely when this is true.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => setReduced(mq.matches)
    update()

    // addEventListener is the modern API; all target browsers support it.
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}

/**
 * Best-effort WebGL availability check. Used to fall back to the CSS gradient
 * on devices/browsers where a WebGL context can't be created.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return false
    // Release the probe context immediately. Browsers cap simultaneous WebGL
    // contexts (~16); leaking one here on every mount/HMR can exhaust the pool
    // and make the real <Canvas> fail to acquire a context (renders black).
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}
