'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Full-screen animated gradient backdrop.
 *
 * Implemented as a single fullscreen-triangle-ish plane rendered with a custom
 * ShaderMaterial. The fragment shader layers value-noise FBM over a vertical
 * green→teal→deep-blue ramp, producing slow, organic depth. This replaces the
 * flat CSS gradient with something that breathes.
 *
 * Performance notes:
 *  - One draw call, no lighting, depthTest/depthWrite off (it's the backmost layer).
 *  - `mediump` precision so mid-range mobile GPUs stay fast.
 *  - Only `uTime` mutates per frame; no allocations in useFrame.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Position is already in clip-ish space via an ortho-scaled plane; pass through.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  // Cheap hash + value noise (no texture lookups).
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep interpolation
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Fractal Brownian Motion — 4 octaves is enough for a soft cloud.
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // Vertical base ramp: brighter agricultural green near the bottom horizon,
    // fading up into a deep teal/blue "night sky over fields".
    vec3 deep   = vec3(0.02, 0.07, 0.06);  // near-black green
    vec3 teal   = vec3(0.03, 0.18, 0.16);  // deep teal
    vec3 green  = vec3(0.05, 0.30, 0.18);  // crop green glow

    float vertical = smoothstep(0.0, 1.0, uv.y);
    vec3 base = mix(green, deep, vertical);
    base = mix(base, teal, smoothstep(0.2, 0.8, uv.y) * 0.6);

    // Flowing noise field for depth. Aspect-correct so it isn't stretched.
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y) * 2.4;
    float flow = fbm(p + vec2(uTime * 0.03, uTime * -0.02));
    flow = fbm(p + flow + vec2(0.0, uTime * 0.015));

    // Use the flow to push subtle teal/green light variation.
    vec3 col = base + (teal - deep) * flow * 0.55;
    col += green * pow(flow, 3.0) * 0.25;

    // Gentle vignette to focus attention center/top where the hero text sits.
    vec2 d = uv - 0.5;
    float vignette = smoothstep(0.95, 0.25, length(d));
    col *= mix(0.7, 1.0, vignette);

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function GradientBackdrop() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    // size intentionally excluded: we update the vec2 in place on resize below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((_, delta) => {
    const mat = matRef.current
    if (!mat) return
    mat.uniforms.uTime.value += delta
    // Keep resolution in sync without reallocating the Vector2.
    mat.uniforms.uResolution.value.set(size.width, size.height)
  })

  return (
    // Plane spans clip space directly (positions used raw in the vertex shader).
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}
