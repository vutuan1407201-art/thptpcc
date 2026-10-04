import { Link } from '@tanstack/react-router'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-paper-deep">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display text-base text-ink">Chơi Mà Học</span> — trò chơi học tập
          miễn phí, không cần đăng nhập.
        </p>
        <p className="flex gap-4">
          <Link to="/tao-de" className="underline decoration-violet decoration-2 hover:text-ink">
            Tạo đề cho lớp
          </Link>
          <Link to="/trac-nghiem" className="underline decoration-amber decoration-2 hover:text-ink">
            Ôn trắc nghiệm
          </Link>
        </p>
      </div>
    </footer>
  )
}
