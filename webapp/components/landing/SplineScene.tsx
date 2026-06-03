'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
})

export default function SplineScene() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Spline
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          style={{ width: '100%', height: '100%', opacity: 0.4 }}
        />
      </Suspense>
    </div>
  )
}
