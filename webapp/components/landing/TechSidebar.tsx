'use client'

import { useState } from 'react'

interface TechItem {
  id: string
  label: string
  icon: React.ReactNode
  title: string
  description: string
  subtitle?: string
  capabilities: string[]
}

const TECH_ITEMS: TechItem[] = [
  {
    id: 'satelital',
    label: 'Satélite',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
           strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <path d="M12 2L8 6l4 4 4-4-4-4z" />
        <path d="M2 12l4-4 4 4-4 4-4-4z" />
        <path d="M22 12l-4-4-4 4 4 4 4-4z" />
        <path d="M12 22l-4-4 4-4 4 4-4 4z" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        <line x1="4" y1="4" x2="8" y2="8" />
        <line x1="20" y1="4" x2="16" y2="8" />
      </svg>
    ),
    title: 'Imágenes Satelitales',
    description: 'Utilizamos imágenes satelitales multiespectrales de alta resolución para monitorear el estado de tus cultivos desde el espacio. Analizamos índices como NDVI, NDRE y EVI para detectar estrés hídrico, deficiencias nutricionales y enfermedades antes de que sean visibles a simple vista.',
    capabilities: [
      'Monitoreo NDVI en tiempo real',
      'Detección temprana de estrés hídrico',
      'Mapas de vigor vegetativo',
      'Análisis histórico por temporada',
      'Cobertura de campos completos',
    ],
  },
  {
    id: 'drone',
    label: 'Drone',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
           strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <line x1="9" y1="9" x2="4" y2="4" />
        <line x1="15" y1="9" x2="20" y2="4" />
        <line x1="9" y1="15" x2="4" y2="20" />
        <line x1="15" y1="15" x2="20" y2="20" />
        <ellipse cx="4" cy="4" rx="3" ry="1" transform="rotate(-45 4 4)" />
        <ellipse cx="20" cy="4" rx="3" ry="1" transform="rotate(45 20 4)" />
        <ellipse cx="4" cy="20" rx="3" ry="1" transform="rotate(45 4 20)" />
        <ellipse cx="20" cy="20" rx="3" ry="1" transform="rotate(-45 20 20)" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Drones Agrícolas',
    description: 'Nuestros drones equipados con sensores multiespectrales y termales vuelan sobre tus campos capturando datos de precisión centimétrica. Generamos ortomosaicos, modelos de elevación y mapas de prescripción para aplicaciones variables de insumos.',
    capabilities: [
      'Imágenes multiespectrales de precisión',
      'Mapas termales de canopia',
      'Ortomosaicos de alta resolución',
      'Modelos de elevación digital',
      'Mapas de prescripción variable',
    ],
  },
  {
    id: 'iot',
    label: 'IoT',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
           strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <circle cx="12" cy="12" r="2" />
        <path d="M8.5 8.5a5 5 0 0 1 7 0" />
        <path d="M5.5 5.5a9 9 0 0 1 13 0" />
        <circle cx="4" cy="17" r="1.5" />
        <circle cx="20" cy="17" r="1.5" />
        <circle cx="12" cy="21" r="1.5" />
        <line x1="5" y1="16" x2="10" y2="13" />
        <line x1="19" y1="16" x2="14" y2="13" />
        <line x1="12" y1="19" x2="12" y2="14" />
      </svg>
    ),
    title: 'Sensores IoT Agrícola',
    description: 'Desplegamos una red de sensores inteligentes en tu campo que monitorean en tiempo real las condiciones del suelo, clima y cultivo. Los datos se transmiten continuamente a nuestra plataforma donde la IA los analiza para generar alertas y recomendaciones precisas.',
    capabilities: [
      'Humedad y temperatura de suelo',
      'Estación meteorológica en campo',
      'Sensores de flujo de savia',
      'Monitoreo de riego en tiempo real',
      'Alertas automáticas de anomalías',
    ],
  },
  {
    id: 'nodo',
    label: 'Nodo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
           strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="12" cy="12" r="6" strokeDasharray="2 2" opacity={0.6} />
        <circle cx="12" cy="12" r="10" strokeDasharray="2 3" opacity={0.3} />
        <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="20" cy="9" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="20" cy="15" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="20" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="4" cy="15" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="4" cy="9" r="1.5" fill="currentColor" stroke="none" />
        <line x1="12" y1="9.5" x2="12" y2="5.5" opacity={0.7} />
        <line x1="14" y1="10.5" x2="18.5" y2="9.5" opacity={0.7} />
        <line x1="14" y1="13.5" x2="18.5" y2="14.5" opacity={0.7} />
        <line x1="12" y1="14.5" x2="12" y2="18.5" opacity={0.7} />
        <line x1="10" y1="13.5" x2="5.5" y2="14.5" opacity={0.7} />
        <line x1="10" y1="10.5" x2="5.5" y2="9.5" opacity={0.7} />
      </svg>
    ),
    title: 'Nodo Territorial Inteligente',
    description: 'Un nodo territorial inteligente es una unidad física y digital instalada estratégicamente en el territorio, capaz de recopilar datos locales, procesarlos mediante inteligencia artificial, conectar sensores, personas, equipos y plataformas, y entregar información útil para la toma de decisiones en tiempo real.',
    subtitle: 'Territorio + Datos + Sensores + IA + Conectividad + Decisión',
    capabilities: [
      'Cobertura WiFi territorial de 30 hectáreas por nodo',
      'Internet satelital propio — sin depender de conectividad existente',
      'Captura de imágenes por trabajadores en campo vía WiFi del nodo',
      'Análisis en tiempo real por agentes de IA de Aiagro',
      'Integración de toda la IoT existente: sensores, estaciones, pluviómetros',
      'Drones de monitoreo de seguridad y captación de datos',
      'Detección de estrés hídrico, plagas, enfermedades y anomalías',
      'Dashboard unificado con alertas, reportes y recomendaciones',
    ],
  },
]

export default function TechSidebar() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const active = TECH_ITEMS.find(t => t.id === activeModal)

  return (
    <>
      {/* Estilos responsive */}
      <style dangerouslySetInnerHTML={{ __html: `
        .tech-sidebar {
          position: fixed;
          z-index: 30;
          display: flex;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          flex-direction: column;
          gap: 12px;
        }
        @media (max-width: 767px) {
          .tech-sidebar {
            top: 16px;
            right: auto;
            left: 50%;
            transform: translateX(-50%);
            flex-direction: row;
            gap: 8px;
          }
        }
        .tech-btn {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.15);
          background-color: rgba(0,0,0,0.45);
          backdrop-filter: blur(12px);
          color: rgba(255,255,255,0.75);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          gap: 2px;
          padding: 0;
        }
        @media (max-width: 767px) {
          .tech-btn {
            width: 60px;
            height: 60px;
            border-radius: 12px;
          }
        }
        .tech-btn:hover {
          background-color: rgba(22,163,74,0.35);
          border-color: rgba(74,222,128,0.5);
          color: #4ade80;
          transform: scale(1.08);
        }
        .tech-label {
          font-size: 8px;
          letter-spacing: 0.05em;
          margin-top: 1px;
        }
      `}} />

      {/* Panel de íconos */}
      <div className="tech-sidebar">
        {TECH_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModal(item.id)}
            title={item.label}
            className="tech-btn"
          >
            {item.icon}
            <span className="tech-label">
              {item.label.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* Modal */}
      {activeModal && active && (
        <div
          onClick={() => setActiveModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'rgba(5,20,5,0.95)',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '520px',
              width: '100%',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '22px',
                cursor: 'pointer',
                lineHeight: 1,
                padding: '4px 8px',
              }}
            >
              ×
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: 'rgba(22,163,74,0.2)',
                border: '1px solid rgba(74,222,128,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4ade80',
                flexShrink: 0,
              }}>
                {active.icon}
              </div>
              <div>
                <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                  {active.title}
                </h2>
                {active.subtitle && (
                  <p style={{
                    color: '#4ade80',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginTop: '4px',
                    marginBottom: 0,
                  }}>
                    {active.subtitle}
                  </p>
                )}
              </div>
            </div>

            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              marginBottom: '20px',
            }}>
              {active.description}
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <p style={{
                color: '#4ade80',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}>
                Capacidades
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {active.capabilities.map((cap, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: '0.88rem',
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#4ade80',
                      flexShrink: 0,
                      marginTop: '6px',
                    }} />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
