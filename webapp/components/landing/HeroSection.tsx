'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'

/**
 * Hero content rendered above the immersive 3D background.
 *
 * Entrance animations and the green text glow are implemented with scoped
 * styled-jsx keyframes (no animation library needed). Every animated element
 * carries a staggered `animation-delay`; a single `prefers-reduced-motion`
 * media query disables all motion and reveals content instantly.
 */
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Badge superior */}
      <div
        className="hero-reveal mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                   border border-green-500/30 bg-green-900/20 backdrop-blur-sm"
        style={{ animationDelay: '0.05s' }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-300 text-sm font-medium">
          Agricultura de precisión con IA
        </span>
      </div>

      {/* Título principal con glow verde */}
      <h1
        className="hero-reveal hero-title text-5xl md:text-7xl font-bold text-white mb-6
                   leading-tight tracking-tight max-w-4xl"
        style={{ animationDelay: '0.15s' }}
      >
        Inteligencia agrícola{' '}
        <span className="hero-accent text-green-400">
          para decisiones que importan
        </span>
      </h1>

      {/* Descripción */}
      <p
        className="hero-reveal text-lg md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed"
        style={{ animationDelay: '0.3s' }}
      >
        Transforma datos de tus campos en decisiones agronómicas claras,
        respaldadas por imágenes satelitales, sensores IoT e inteligencia
        artificial.
      </p>

      {/* CTAs */}
      <div
        className="hero-reveal flex flex-col sm:flex-row gap-4 items-center"
        style={{ animationDelay: '0.45s' }}
      >
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

      {/* Indicador scroll */}
      <div
        className="hero-reveal absolute bottom-8 left-1/2 -translate-x-1/2
                   flex flex-col items-center gap-2 text-white/40"
        style={{ animationDelay: '0.7s' }}
      >
        <span className="text-xs tracking-widest uppercase">Explorar</span>
        <div className="scroll-line w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Staggered entrance: fade + rise. */
        .hero-reveal {
          opacity: 0;
          transform: translateY(24px);
          animation: hero-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes hero-rise {
          to { opacity: 1; transform: translateY(0); }
        }
        /* Subtle green glow on the title; accent span glows a touch more. */
        .hero-title {
          text-shadow: 0 0 24px rgba(61,220,132,0.18), 0 0 60px rgba(61,220,132,0.1);
        }
        .hero-accent {
          text-shadow: 0 0 18px rgba(61,220,132,0.55), 0 0 40px rgba(61,220,132,0.3);
          animation: accent-pulse 4.5s ease-in-out infinite;
        }
        @keyframes accent-pulse {
          0%, 100% { text-shadow: 0 0 18px rgba(61,220,132,0.45), 0 0 40px rgba(61,220,132,0.25); }
          50% { text-shadow: 0 0 26px rgba(61,220,132,0.7), 0 0 60px rgba(61,220,132,0.4); }
        }
        .scroll-line { animation: scroll-bob 1.8s ease-in-out infinite; }
        @keyframes scroll-bob {
          0%, 100% { transform: scaleY(1); opacity: 0.4; }
          50% { transform: scaleY(1.4); opacity: 0.8; }
        }
        /* Respect reduced-motion: instant reveal, no looping motion. */
        @media (prefers-reduced-motion: reduce) {
          .hero-reveal { opacity: 1; transform: none; animation: none; }
          .hero-accent, .scroll-line { animation: none; }
        }
      `,
        }}
      />
    </section>
  )
}
