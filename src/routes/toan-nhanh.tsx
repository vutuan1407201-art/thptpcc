import { createFileRoute } from '@tanstack/react-router'

import { MathGame } from '../components/MathGame'
import { PageIntro } from '../components/PageIntro'

export const Route = createFileRoute('/toan-nhanh')({
  component: MathPage,
  head: () => ({
    meta: [
      { title: 'Toán nhanh 60 giây — Chơi Mà Học' },
      {
        name: 'description',
        content:
          'Luyện cộng, trừ, nhân, chia trong 60 giây với ba mức độ từ dễ đến khó. Trả lời đúng được thưởng thêm thời gian.',
      },
    ],
  }),
})

function MathPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <PageIntro eyebrow="Trò chơi 1" title="Toán nhanh 60 giây">
        Làm càng nhiều phép tính càng tốt trước khi hết giờ. Mỗi câu đúng được thêm 1 giây, nên trả
        lời càng chắc thì lượt chơi càng dài.
      </PageIntro>
      <div className="mt-8">
        <MathGame />
      </div>
    </div>
  )
}
