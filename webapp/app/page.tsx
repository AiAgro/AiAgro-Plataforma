import VideoBackground from '@/components/landing/VideoBackground'
import TechSidebar from '@/components/landing/TechSidebar'

export default function HomePage() {
  return (
    <main style={{ position: 'relative', minHeight: '100vh' }}>

      <VideoBackground />

      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'white',
        textAlign: 'center',
        padding: '0 24px',
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px' }}>
          Aiagro.cl
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.8 }}>
          Inteligencia agrícola para decisiones que importan
        </p>
      </div>

      <TechSidebar />

    </main>
  )
}
