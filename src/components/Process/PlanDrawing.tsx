import { useId, type ReactNode, type SVGProps } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { ease } from '../../animations/variants'

/**
 * Planta esquemática de uma loja, desenhada em camadas.
 * É uma ilustração genérica do método, não a planta de nenhum projeto real.
 * stage 0 = prancha em branco … 5 = prancha completa.
 */
export function PlanDrawing({ stage, className = '' }: { stage: number; className?: string }) {
  const reduce = useReducedMotion()
  const hatch = useId()
  const arrow = useId()
  const dur = reduce ? 0 : 1.1

  const at = (n: number, delay = 0) => ({
    initial: false as const,
    animate: { pathLength: stage >= n ? 1 : 0, opacity: stage >= n ? 1 : 0 },
    transition: { duration: dur, ease, delay: stage >= n && !reduce ? delay : 0 },
  })
  const fade = (n: number, delay = 0) => ({
    initial: false as const,
    animate: { opacity: stage >= n ? 1 : 0 },
    transition: { duration: reduce ? 0 : 0.8, delay: stage >= n && !reduce ? delay : 0 },
  })

  const ink = { stroke: 'currentColor', fill: 'none', strokeLinecap: 'square' as const }
  const zone: SVGProps<SVGRectElement> = { fill: 'none', stroke: '#9F927F', strokeWidth: 1, strokeDasharray: '5 5' }
  const label = (x: number, y: number, t: string): ReactNode => (
    <text x={x} y={y} fill="#7a6e5c" fontSize="9" letterSpacing="1.6" className="font-sans font-semibold">
      {t}
    </text>
  )
  const lights = [[130, 112], [230, 112], [330, 112], [430, 112], [140, 205], [350, 215], [440, 205], [420, 290]]

  return (
    <svg viewBox="0 0 600 420" role="img" aria-label="Planta esquemática que ganha detalhes a cada etapa do processo" className={`h-auto w-full text-obsidian ${className}`}>
      <defs>
        <pattern id={hatch} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <marker id={arrow} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1 L9 5 L0 9" fill="none" stroke="#9F927F" strokeWidth="1.4" />
        </marker>
      </defs>

      {/* 5 — piso aplicado */}
      <m.rect x="60" y="60" width="480" height="300" fill="#D6CABB" {...fade(5)} style={{ opacity: 0 }} animate={{ opacity: stage >= 5 ? 0.4 : 0 }} />

      {/* 1 — diagnóstico: envoltória, abertura, pilar, cotas */}
      <m.path d="M250 360 H60 V60 H540 V360 H310" {...ink} strokeWidth="5" {...at(1)} />
      <m.path d="M310 360 V300 M310 300 A60 60 0 0 0 250 360" {...ink} strokeWidth="1" {...at(1, 0.4)} />
      <m.path d="M380 56 H500 M380 64 H500" {...ink} strokeWidth="1" {...at(1, 0.5)} />
      <m.rect x="433" y="223" width="14" height="14" fill="currentColor" {...fade(1, 0.6)} />
      <m.g {...fade(1, 0.7)} {...ink} strokeWidth="1">
        <path d="M60 22 H540 M55 27 L65 17 M535 27 L545 17" />
        <path d="M24 60 V360 M19 65 L29 55 M19 365 L29 355" />
        <path d="M568 60 V210 V360 M563 65 L573 55 M563 215 L573 205 M563 365 L573 355" />
        <text x="300" y="15" textAnchor="middle" fill="currentColor" stroke="none" fontSize="10" className="font-sans">A</text>
        <text x="14" y="215" textAnchor="middle" fill="currentColor" stroke="none" fontSize="10" transform="rotate(-90 14 215)" className="font-sans">B</text>
      </m.g>

      {/* Legenda da prancha e norte */}
      <m.g {...fade(1, 0.9)}>
        <text x="60" y="408" fill="currentColor" fontSize="8" letterSpacing="2" className="font-sans font-semibold">
          PLANTA BAIXA · ESQUEMÁTICA
        </text>
        <g {...ink} strokeWidth="1.2">
          <path d="M572 408 V382" />
          <path d="M572 380 L567 390 H577 Z" fill="currentColor" />
          <text x="572" y="376" textAnchor="middle" fill="currentColor" stroke="none" fontSize="9" className="font-sans font-semibold">N</text>
        </g>
      </m.g>

      {/* 2 — conceito: zonas e fluxo */}
      <m.g {...fade(2)}>
        <rect x="80" y="82" width="200" height="118" {...zone} />
        <rect x="300" y="82" width="220" height="120" {...zone} />
        <rect x="400" y="250" width="120" height="90" {...zone} />
        <rect x="80" y="240" width="130" height="100" {...zone} />
        {label(90, 99, 'EXPOSIÇÃO')}
        {label(310, 99, 'ATENDIMENTO')}
        {label(410, 267, 'CAIXA')}
        {label(90, 257, 'APOIO')}
      </m.g>
      <m.path d="M280 356 V290 C280 240 235 232 225 190 S300 150 350 150" fill="none" stroke="#9F927F" strokeWidth="1.6" strokeDasharray="3 6" markerEnd={`url(#${arrow})`} {...at(2, 0.5)} />

      {/* 3 — desenvolvimento: mobiliário e pontos de luz */}
      <m.g {...ink} strokeWidth="1.5" {...fade(3)}>
        <rect x="66" y="84" width="12" height="112" />
        <rect x="90" y="66" width="250" height="10" />
        <rect x="232" y="150" width="110" height="34" rx="2" />
        <rect x="112" y="128" width="54" height="26" />
        <rect x="112" y="166" width="54" height="26" />
        <rect x="428" y="300" width="92" height="28" />
        <rect x="140" y="290" width="60" height="40" />
      </m.g>
      <m.g {...fade(3, 0.5)}>
        {lights.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="14" fill="none" stroke="#9F927F" strokeWidth="0.8" strokeDasharray="2 3" />
            <circle cx={x} cy={y} r="3" fill="currentColor" />
          </g>
        ))}
      </m.g>

      {/* 4 — detalhamento: hachura, corte, chamada de detalhe */}
      <m.g {...fade(4)}>
        <path d="M54 54 H546 V60 H54 Z M54 60 H60 V366 H54 Z M540 60 H546 V366 H540 Z M54 360 H250 V366 H54 Z M310 360 H546 V366 H310 Z" fill={`url(#${hatch})`} stroke="currentColor" strokeWidth="0.8" />
      </m.g>
      <m.g {...ink} strokeWidth="1.2" {...fade(4, 0.4)}>
        <path d="M190 52 V382" strokeDasharray="14 4 2 4" />
        <circle cx="190" cy="42" r="9" /> <circle cx="190" cy="392" r="9" />
        <text x="190" y="45.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="10" className="font-sans font-semibold">A</text>
        <text x="190" y="395.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="10" className="font-sans font-semibold">A</text>
        <circle cx="240" cy="270" r="20" strokeDasharray="3 3" />
        <path d="M254 256 L290 232" />
        <text x="240" y="273.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11" className="font-sans font-semibold">1</text>
      </m.g>

      {/* 5 — entrega: mobiliário preenchido e carimbo */}
      <m.g fill="currentColor" {...fade(5, 0.3)} style={{ opacity: 0 }} animate={{ opacity: stage >= 5 ? 0.88 : 0 }}>
        <rect x="232" y="150" width="110" height="34" rx="2" />
        <rect x="428" y="300" width="92" height="28" />
      </m.g>
      <m.g {...fade(5, 0.6)} transform="rotate(-8 450 160)">
        <rect x="395" y="142" width="110" height="36" rx="3" fill="#F5F2EC" stroke="#9F927F" strokeWidth="1.4" />
        <text x="450" y="165" textAnchor="middle" fill="#7a6e5c" fontSize="12" letterSpacing="3" className="font-sans font-semibold">ENTREGA</text>
      </m.g>
    </svg>
  )
}
