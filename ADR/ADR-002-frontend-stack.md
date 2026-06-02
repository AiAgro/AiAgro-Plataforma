# ADR-002 — Stack Frontend y Estructura Monorepo
Fecha: 2026-06-02
Estado: Aceptado
Decisor: Mauricio (Director General)

## Contexto
Fase 1 requiere construir una WebApp con landing inmersiva
(video de fondo + elementos 3D) y login cerrado.
Se debe decidir el framework frontend, la librería 3D
y la estructura del proyecto dentro del monorepo.

## Decisión

### Framework
Next.js 14 con App Router y TypeScript.
Razones: SSR/SSG, optimización de imágenes y videos,
integración nativa con Vercel, ecosistema maduro.

### Estilos
Tailwind CSS.
Razones: utilidades atómicas, responsive nativo,
consistencia con el ecosistema Next.js.

### 3D e inmersión
React Three Fiber + Three.js + @react-three/drei.
Razones: abstracción React sobre Three.js,
componentes 3D reutilizables, rendimiento optimizado.

### Video de fondo
next/video o elemento HTML5 nativo con lazy loading.
Razones: optimización nativa, sin dependencia extra.

### Estructura en monorepo
C:\Users\Mauricio\AiAgro\
└── webapp\          ← proyecto Next.js aquí
    ├── app\
    ├── components\
    ├── public\
    └── ...

### Autenticación (Fase 1)
Supabase Auth con @supabase/ssr.
Razones: integración nativa con el backend oficial,
SSR compatible, RLS automático.

## Alternativas consideradas
- Vite + React: descartado por ausencia de SSR nativo
- Remix: descartado por menor integración con Vercel
- Vue/Nuxt: descartado por consistencia de stack
- Babylon.js: descartado, Three.js tiene mayor comunidad

## Consecuencias
- Positivo: stack probado, desplegable en Vercel con zero-config
- Positivo: React Three Fiber permite componentes 3D reutilizables
- Neutral: TypeScript requiere tipado explícito desde el inicio
- A monitorear: rendimiento de escenas 3D en dispositivos móviles

## Referencias
- ADR-001: Stack tecnológico oficial
- DOCS/ARCHITECTURE.md: Capa de Presentación
- ENC-007: Inicialización del proyecto
