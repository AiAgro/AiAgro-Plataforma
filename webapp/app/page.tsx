import VideoBackground from '@/components/landing/VideoBackground'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import ParticlesCSS from '@/components/landing/ParticlesCSS'
import SplineScene from '@/components/landing/SplineScene'

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black">

      {/* CAPA 1: Videos con crossfade */}
      <VideoBackground />

      {/* CAPA 2: Partículas CSS */}
      <ParticlesCSS />

      {/* CAPA 3: Escena Spline 3D (decorativa) */}
      <SplineScene />

      {/* Navbar */}
      <Navbar />

      {/* Hero content */}
      <HeroSection />

    </main>
  )
}
