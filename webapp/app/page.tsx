import VideoBackground from '@/components/landing/VideoBackground'
import TechSidebar from '@/components/landing/TechSidebar'

export default function HomePage() {
  return (
    <main className="relative min-h-screen">

      <VideoBackground />

      <div className="relative z-[2] flex flex-col items-start justify-start min-h-screen text-white px-6 pt-[64px] md:px-12 md:pt-[80px]">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 tracking-tight">
          Aiagro.cl
        </h1>
        <p className="text-sm md:text-base opacity-80">
          Inteligencia agrícola para decisiones que importan
        </p>
      </div>

      <TechSidebar />

    </main>
  )
}
