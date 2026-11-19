import { ArrowUpRight } from 'lucide-react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid' | 'outline' | 'light' | 'ghost-light'

const styles: Record<Variant, string> = {
  solid: 'bg-obsidian text-ivory hover:bg-graphite',
  outline: 'border border-obsidian/40 text-obsidian hover:bg-obsidian hover:text-ivory',
  light: 'bg-ivory text-obsidian hover:bg-sand',
  'ghost-light': 'border border-ivory/50 text-ivory hover:bg-ivory hover:text-obsidian',
}

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  children: ReactNode
  arrow?: boolean
}

/** Botão-link com seta que desliza no hover. Sempre um <a> com destino real. */
export function Button({ variant = 'solid', children, arrow = true, className = '', ...rest }: ButtonProps) {
  return (
    <a
      {...rest}
      className={`group inline-flex min-h-12 items-center gap-3 whitespace-nowrap px-7 py-4 eyebrow transition-colors duration-500 ease-editorial ${styles[variant]} ${className}`}
    >
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          aria-hidden
          size={15}
          className="transition-transform duration-500 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </a>
  )
}
