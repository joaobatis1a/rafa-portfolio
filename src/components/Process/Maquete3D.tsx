import { useEffect, useRef } from 'react'
import { createMaquete, type Maquete } from './maqueteScene'

interface Props {
  stage: number
  className?: string
  /** chamado se o navegador não conseguir criar o contexto WebGL */
  onFail: () => void
}

/** Carregado sob demanda (React.lazy): o Three.js fica num chunk separado. */
export default function Maquete3D({ stage, className = '', onFail }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maquete = useRef<Maquete | null>(null)
  const stageRef = useRef(stage)
  stageRef.current = stage

  useEffect(() => {
    try {
      maquete.current = createMaquete(boxRef.current!, canvasRef.current!)
      maquete.current.setStage(stageRef.current)
    } catch {
      onFail()
    }
    return () => {
      maquete.current?.dispose()
      maquete.current = null
    }
  }, [onFail])

  useEffect(() => {
    maquete.current?.setStage(stage)
  }, [stage])

  return (
    <div ref={boxRef} className={`cursor-grab touch-pan-y active:cursor-grabbing ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Maquete 3D esquemática de uma loja, que ganha paredes, mobiliário, materiais e luzes a cada etapa"
        className="block h-full w-full"
      />
    </div>
  )
}
