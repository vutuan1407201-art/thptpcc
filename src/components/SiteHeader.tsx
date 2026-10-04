import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Trang chủ' },
  { to: '/toan-nhanh', label: 'Toán nhanh' },
  { to: '/ghi-nho', label: 'Lật thẻ ghi nhớ' },
  { to: '/trac-nghiem', label: 'Trắc nghiệm' },
  { to: '/tao-de', label: 'Tạo đề' },
] as const

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="card-pop-sm grid h-10 w-10 place-items-center bg-violet font-display text-xl text-paper">
            C
          </span>
          <span className="font-display text-2xl leading-none">Chơi Mà Học</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
              activeProps={{ className: 'bg-ink text-paper hover:bg-ink hover:text-paper' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="card-pop-sm ml-auto grid h-10 w-10 place-items-center bg-paper md:hidden"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav className="border-t-2 border-ink bg-paper px-5 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 font-medium text-ink-soft"
              activeProps={{ className: 'bg-paper-deep text-ink' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
