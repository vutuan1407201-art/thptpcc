import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import '../styles.css'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'

const siteName = 'Chơi Mà Học'
const siteDescription =
  'Bốn trò chơi học tập nho nhỏ cho học sinh tiểu học: toán nhanh, lật thẻ ghi nhớ, trắc nghiệm kiến thức và đề thi tự tạo chia sẻ bằng một đường liên kết.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: `${siteName} — trò chơi học tập cho học sinh tiểu học` },
      { name: 'description', content: siteDescription },
      { name: 'theme-color', content: '#f7f5fd' },
      { property: 'og:title', content: siteName },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/img/hero.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'icon', href: '/favicon.ico' }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body className="paper-grid min-h-screen">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="font-display text-7xl text-violet">404</p>
      <h1 className="mt-3 text-3xl">Không tìm thấy trang này</h1>
      <p className="mt-3 text-ink-soft">
        Có thể đường liên kết đã bị gõ sai một chữ. Thử quay về trang chủ và chọn lại trò chơi nhé.
      </p>
      <a
        href="/"
        className="press card-pop-sm mt-8 inline-block bg-amber px-6 py-3 font-display text-lg text-ink"
      >
        Về trang chủ
      </a>
    </div>
  )
}
