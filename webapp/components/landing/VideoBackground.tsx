'use client'

interface VideoBackgroundProps {
  src?: string
  fallbackColor?: string
}

export default function VideoBackground({
  src,
  fallbackColor = '#0a1a0a',
}: VideoBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Overlay oscuro semitransparente */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Video de fondo */}
      {src ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        /* Fallback: gradiente cuando no hay video */
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(135deg, ${fallbackColor} 0%, #1a3a1a 50%, #0d2d0d 100%)`,
          }}
        />
      )}
    </div>
  )
}
