import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center z-20">

      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                      border border-green-500/40 bg-green-900/30 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-300 text-sm font-medium tracking-wide">
          Agricultura de precisión con IA
        </span>
      </div>

      {/* Título con glow */}
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight
                     tracking-tight max-w-4xl"
          style={{ textShadow: '0 0 40px rgba(74,222,128,0.3)' }}>
        Inteligencia agrícola{' '}
        <span className="text-green-400"
              style={{ textShadow: '0 0 60px rgba(74,222,128,0.6)' }}>
          para decisiones que importan
        </span>
      </h1>

      {/* Descripción */}
      <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
        Transforma datos de tus campos en decisiones agronómicas claras,
        respaldadas por imágenes satelitales, sensores IoT e inteligencia artificial.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link href="/login">
          <Button variant="primary" size="lg">
            Acceder a la plataforma
          </Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" size="lg">
            Conocer más
          </Button>
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2
                      flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs tracking-widest uppercase">Explorar</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>

    </section>
  )
}
