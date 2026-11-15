/** Easing e durações compartilhados — um único "tempo" de movimento para o site todo. */
export const ease = [0.22, 1, 0.36, 1] as const

export const dur = {
  fast: 0.5,
  base: 0.9,
  slow: 1.3,
}

/** Tempos da abertura do hero (quadro → expansão → texto), compartilhados com o menu. */
export const INTRO = { expand: 1.1, text: 2.0, done: 2.3 }

export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' } as const
