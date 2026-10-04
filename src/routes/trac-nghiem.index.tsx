import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { PageIntro } from '../components/PageIntro'
import { quizTopics } from '../games/content'

export const Route = createFileRoute('/trac-nghiem/')({
  component: TopicList,
  head: () => ({
    meta: [
      { title: 'Trắc nghiệm kiến thức — Chơi Mà Học' },
      {
        name: 'description',
        content:
          'Ba chủ đề trắc nghiệm cho học sinh tiểu học: tiếng Anh cơ bản, khoa học quanh ta và địa lý Việt Nam.',
      },
    ],
  }),
})

const TINTS = ['bg-amber/20', 'bg-mint/20', 'bg-coral/15']

function TopicList() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <PageIntro eyebrow="Trò chơi 3" title="Trắc nghiệm kiến thức">
        Mỗi chủ đề gồm 10 câu hỏi. Sau mỗi câu em sẽ thấy ngay đáp án đúng kèm lời giải thích ngắn,
        nên làm sai cũng học được điều mới.
      </PageIntro>

      <div className="mt-8 grid gap-4">
        {quizTopics.map((topic, index) => (
          <Link
            key={topic.slug}
            to="/trac-nghiem/$slug"
            params={{ slug: topic.slug }}
            className={`press card-pop group flex items-center gap-5 p-5 ${TINTS[index % TINTS.length]}`}
          >
            <span className="card-pop-sm grid h-14 w-14 shrink-0 place-items-center bg-paper font-display text-2xl">
              {topic.questions.length}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-2xl">{topic.title}</span>
              <span className="block text-ink-soft">{topic.blurb}</span>
            </span>
            <ArrowRight size={22} className="shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      <div className="card-pop-sm mt-8 bg-paper p-5">
        <p className="font-display text-xl">Muốn có chủ đề riêng của lớp mình?</p>
        <p className="mt-1.5 text-ink-soft">
          Trang <Link to="/tao-de" className="underline decoration-violet decoration-2">Tạo đề</Link> cho
          phép em tự soạn câu hỏi và nhận một đường liên kết để gửi cho các bạn cùng làm.
        </p>
      </div>
    </div>
  )
}
