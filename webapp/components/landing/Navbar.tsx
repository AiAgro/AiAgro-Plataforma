import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Nombre */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-xl tracking-tight">
            Aiagro
            <span className="text-green-400">.cl</span>
          </span>
        </Link>

        {/* CTA Login */}
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-white border border-white/30
                     rounded-lg hover:bg-white/10 transition-all duration-200
                     backdrop-blur-sm"
        >
          Ingresar
        </Link>
      </div>
    </nav>
  )
}
