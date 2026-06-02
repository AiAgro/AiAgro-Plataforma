import VideoBackground from '@/components/landing/VideoBackground'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* Video de fondo — sin src usa gradiente fallback */}
      <VideoBackground />

      {/* Navbar fija */}
      <Navbar />

      {/* Hero principal */}
      <HeroSection />
    </main>
  )
}
