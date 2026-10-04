import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { MemoryGame } from '../components/MemoryGame'
import { PageIntro } from '../components/PageIntro'
import { memorySets } from '../games/content'

export const Route = createFileRoute('/ghi-nho')({
  component: MemoryPage,
  head: () => ({
    meta: [
      { title: 'Lật thẻ ghi nhớ — Chơi Mà Học' },
      {
        name: 'description',
        content:
          'Trò chơi lật thẻ tìm cặp giống nhau với hai bộ thẻ: thiên nhiên và đồ vật quanh em. Luyện trí nhớ và học từ mới.',
      },
    ],
  }),
})

function MemoryPage() {
  const [setSlug, setSetSlug] = useState(memorySets[0].slug)
  const activeSet = memorySets.find((item) => item.slug === setSlug) ?? memorySets[0]

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <PageIntro eyebrow="Trò chơi 2" title="Lật thẻ ghi nhớ">
        Mở hai thẻ một lúc. Nếu hai thẻ giống nhau thì chúng sẽ mở luôn, nếu khác nhau thì úp lại và
        em phải nhớ vị trí cho lượt sau.
      </PageIntro>

      <div className="mt-7 flex flex-wrap gap-2.5">
        {memorySets.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setSetSlug(item.slug)}
            className={[
              'press card-pop-sm px-4 py-2.5 font-display text-lg',
              item.slug === setSlug ? 'bg-violet text-paper' : 'bg-paper',
            ].join(' ')}
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="mt-2.5 text-ink-soft">{activeSet.blurb}</p>

      <div className="mt-6">
        <MemoryGame set={activeSet} />
      </div>
    </div>
  )
}
