import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Link2, Sparkles } from 'lucide-react'

import { quizTopics } from '../games/content'

export const Route = createFileRoute('/')({
  component: Home,
})

type GameCard = {
  to: '/tao-de' | '/toan-nhanh' | '/ghi-nho' | '/trac-nghiem'
  title: string
  blurb: string
  image: string
  tint: string
  badge: string
  featured?: boolean
}

const games: GameCard[] = [
  {
    to: '/tao-de',
    title: 'Tạo đề & chia sẻ link',
    blurb:
      'Soạn bộ câu hỏi của riêng em hoặc của cả lớp, bấm lưu là có ngay một đường liên kết ngắn để gửi cho bạn bè. Ai mở link cũng làm được bài và tên có trên bảng điểm.',
    image: '/img/game-create.png',
    tint: 'bg-violet/15',
    badge: 'Chia sẻ được',
    featured: true,
  },
  {
    to: '/toan-nhanh',
    title: 'Toán nhanh 60 giây',
    blurb: 'Cộng, trừ, nhân, chia dưới đồng hồ bấm giây. Trả lời đúng được thưởng thêm thời gian.',
    image: '/img/game-math.png',
    tint: 'bg-amber/20',
    badge: '3 mức độ',
  },
  {
    to: '/ghi-nho',
    title: 'Lật thẻ ghi nhớ',
    blurb: 'Tìm 8 cặp thẻ giống nhau bằng ít lượt mở nhất. Vừa luyện trí nhớ vừa học từ mới.',
    image: '/img/game-memory.png',
    tint: 'bg-mint/20',
    badge: '2 bộ thẻ',
  },
  {
    to: '/trac-nghiem',
    title: 'Trắc nghiệm kiến thức',
    blurb: 'Tiếng Anh, khoa học và địa lý Việt Nam, mỗi chủ đề 10 câu kèm lời giải thích.',
    image: '/img/game-vocab.png',
    tint: 'bg-coral/15',
    badge: `${quizTopics.length} chủ đề`,
  },
]

function img(path: string, width: number) {
  return `/.netlify/images?url=${encodeURIComponent(path)}&w=${width}&fm=webp`
}

function Home() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  function openCode(event: React.FormEvent) {
    event.preventDefault()
    const cleaned = code.trim().toUpperCase()
    if (cleaned.length < 4) return
    navigate({ to: '/de/$code', params: { code: cleaned } })
  }

  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Hero: text left, illustration right, deliberately off-balance. */}
      <section className="grid items-center gap-8 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-16">
        <div className="rise-in">
          <p className="card-pop-sm inline-flex -rotate-1 items-center gap-2 bg-amber px-3.5 py-1.5 text-sm font-semibold">
            <Sparkles size={15} />
            Miễn phí, không cần đăng nhập
          </p>
          <h1 className="mt-5 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Học mà như
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">đang chơi</span>
              <span className="absolute inset-x-0 bottom-1.5 z-0 h-4 -rotate-1 bg-mint/70" />
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft sm:text-xl">
            Bốn trò chơi nho nhỏ cho học sinh tiểu học: toán nhanh, lật thẻ ghi nhớ, trắc nghiệm kiến
            thức và đề thi tự soạn. Mỗi đề em tạo ra đều có một đường liên kết riêng để gửi cho cả lớp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/toan-nhanh"
              className="press card-pop-sm flex items-center gap-2 bg-violet px-6 py-3.5 font-display text-xl text-paper"
            >
              Chơi thử ngay
              <ArrowRight size={19} />
            </Link>
            <Link
              to="/tao-de"
              className="press card-pop-sm flex items-center gap-2 bg-paper px-6 py-3.5 font-display text-xl"
            >
              <Link2 size={19} />
              Tạo đề chia sẻ
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="card-pop overflow-hidden bg-paper p-2 sm:rotate-1">
            <img
              src={img('/img/hero.png', 900)}
              alt="Ba bạn nhỏ cùng ngồi chơi một trò chơi học tập trên máy tính bảng"
              width={900}
              height={383}
              className="w-full rounded-xl"
            />
          </div>
          <p className="card-pop-sm absolute -bottom-5 left-4 -rotate-2 bg-mint px-4 py-2 font-display text-lg sm:left-8">
            30 câu hỏi có sẵn
          </p>
        </div>
      </section>

      {/* Game catalogue as an asymmetric bento, featured card spans two rows. */}
      <section className="py-12" id="tro-choi">
        <h2 className="text-3xl sm:text-4xl">Chọn một trò để bắt đầu</h2>
        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.to}
              to={game.to}
              className={[
                'press card-pop group flex flex-col overflow-hidden',
                game.tint,
                game.featured ? 'lg:col-span-2 lg:flex-row' : '',
              ].join(' ')}
            >
              <div className={game.featured ? 'lg:w-1/2 lg:shrink-0' : ''}>
                <img
                  src={img(game.image, game.featured ? 640 : 520)}
                  alt=""
                  className="h-44 w-full object-cover lg:h-full"
                />
              </div>
              <div className="flex flex-1 flex-col border-t-2 border-ink bg-paper p-5 lg:border-t-0">
                <p className="text-xs font-semibold tracking-wider text-violet-deep uppercase">
                  {game.badge}
                </p>
                <h3 className="mt-2 text-2xl">{game.title}</h3>
                <p className="mt-2 flex-1 text-ink-soft">{game.blurb}</p>
                <p className="mt-4 flex items-center gap-1.5 font-display text-lg">
                  Vào chơi
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Open a shared quiz by code — the other half of the link feature. */}
      <section className="py-12">
        <div className="card-pop grid gap-8 bg-ink p-6 text-paper sm:p-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-3xl sm:text-4xl">Có link hoặc mã đề của bạn?</h2>
            <p className="mt-3 text-lg text-paper/75">
              Mỗi đề được chia sẻ có một mã gồm 6 ký tự, ví dụ <code className="text-amber">K7QM2P</code>.
              Nhập mã vào đây là mở được bài làm ngay, không cần dán cả đường liên kết dài.
            </p>
            <ol className="mt-6 space-y-2.5 text-paper/75">
              {[
                'Soạn đề trong trang Tạo đề.',
                'Chép đường liên kết rồi gửi vào nhóm lớp.',
                'Xem bảng điểm của cả lớp trên cùng một đề.',
              ].map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-amber font-display text-sm text-amber">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <form onSubmit={openCode} className="card-pop-sm self-start bg-paper p-5 text-ink">
            <label htmlFor="quiz-code" className="font-display text-xl">
              Mở đề bằng mã
            </label>
            <input
              id="quiz-code"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase().slice(0, 8))}
              placeholder="VD: K7QM2P"
              className="mt-3 w-full rounded-xl border-2 border-ink bg-paper-deep px-4 py-3 text-center font-display text-3xl tracking-[0.2em] uppercase placeholder:text-ink-soft/50 placeholder:tracking-normal placeholder:text-lg"
            />
            <button
              type="submit"
              disabled={code.trim().length < 4}
              className="press card-pop-sm mt-4 w-full bg-amber py-3 font-display text-xl disabled:opacity-45"
            >
              Mở đề
            </button>
            <p className="mt-3 text-sm text-ink-soft">
              Chưa có mã nào? <Link to="/tao-de" className="underline decoration-violet decoration-2">Tự tạo một đề</Link> rồi
              gửi cho bạn cùng bàn.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
