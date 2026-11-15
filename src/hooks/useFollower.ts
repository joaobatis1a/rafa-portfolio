import { useCallback, type MouseEvent } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/** Posição suavizada do ponteiro, para elementos que acompanham o cursor (só transform). */
export function useFollower() {
  const rawX = useMotionValue(-400)
  const rawY = useMotionValue(-400)
  const x = useSpring(rawX, { stiffness: 260, damping: 28, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 260, damping: 28, mass: 0.5 })

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    },
    [rawX, rawY],
  )

  return { x, y, onMouseMove }
}
