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
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        minHeight: '100vh',
        color: 'white',
        textAlign: 'left',
        padding: '0 24px',
        paddingBottom: '80px',
        paddingLeft: '48px',
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          Aiagro.cl
        </h1>
        <p style={{ fontSize: '1rem', opacity: 0.8 }}>
          Inteligencia agrícola para decisiones que importan
        </p>
      </div>

      <TechSidebar />

    </main>
  )
}
