/**
 * Device-tier detection for graceful degradation.
 *
 * We classify the device once at module load on the client. The result drives
 * particle counts, whether connection lines render, and the DPR ceiling.
 *
 * Heuristics (cheap, no benchmark):
 *  - hardwareConcurrency: logical CPU cores. <4 is a strong "low-end" signal.
 *  - deviceMemory: RAM in GB (Chromium only). <=4 → treat as low.
 *  - coarse pointer / no hover: almost always a phone/tablet → reduce work.
 */

export type DeviceTier = 'high' | 'low'

export interface SceneBudget {
  tier: DeviceTier
  /** Number of points in the floating data/particle field. */
  particleCount: number
  /** Number of larger "sensor" data nodes. */
  nodeCount: number
  /** Whether to draw connection lines between nodes (extra geometry + overdraw). */
  drawConnections: boolean
  /** Upper bound for the renderer device pixel ratio. */
  dprMax: number
  /** Whether pointer-driven parallax should run (off for touch). */
  enableParallax: boolean
}

function detectTier(): DeviceTier {
  if (typeof window === 'undefined') return 'low'

  const cores = navigator.hardwareConcurrency ?? 4
  // deviceMemory is non-standard; guard access.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4

  const coarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: none), (pointer: coarse)').matches

  if (cores < 4 || memory <= 4 || coarsePointer) return 'low'
  return 'high'
}

export function getSceneBudget(): SceneBudget {
  const tier = detectTier()

  if (tier === 'low') {
    return {
      tier,
      particleCount: 1400,
      nodeCount: 7,
      drawConnections: false,
      dprMax: 1.5,
      enableParallax: false,
    }
  }

  return {
    tier,
    particleCount: 5000,
    nodeCount: 14,
    drawConnections: true,
    dprMax: 2,
    enableParallax: true,
  }
}
