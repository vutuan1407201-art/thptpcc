import { Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export function PageIntro({
  eyebrow,
  title,
  children,
  backTo = '/',
  backLabel = 'Tất cả trò chơi',
}: {
  eyebrow: string
  title: string
  children?: ReactNode
  backTo?: string
  backLabel?: string
}) {
  return (
    <div className="rise-in">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ChevronLeft size={16} />
        {backLabel}
      </Link>
      <p className="mt-4 text-xs font-semibold tracking-wider text-violet-deep uppercase">{eyebrow}</p>
      <h1 className="mt-1.5 text-4xl sm:text-5xl">{title}</h1>
      {children ? <div className="mt-3 max-w-2xl text-lg text-ink-soft">{children}</div> : null}
    </div>
  )
}
