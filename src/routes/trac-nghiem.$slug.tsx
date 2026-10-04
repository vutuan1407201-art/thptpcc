import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { PageIntro } from '../components/PageIntro'
import { QuizRunner } from '../components/QuizRunner'
import { findQuizTopic } from '../games/content'

export const Route = createFileRoute('/trac-nghiem/$slug')({
  loader: ({ params }) => {
    const topic = findQuizTopic(params.slug)
    if (!topic) throw notFound()
    return { topic }
  },
  component: TopicQuiz,
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.topic.title} — Chơi Mà Học` },
          { name: 'description', content: loaderData.topic.blurb },
        ]
      : [],
  }),
})

function TopicQuiz() {
  const { topic } = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <PageIntro
        eyebrow="Trắc nghiệm"
        title={topic.title}
        backTo="/trac-nghiem"
        backLabel="Tất cả chủ đề"
      >
        {topic.blurb}
      </PageIntro>

      <div className="mt-8">
        <QuizRunner
          key={topic.slug}
          questions={topic.questions}
          resultExtra={() => (
            <div className="card-pop-sm bg-paper-deep p-5">
              <p className="font-display text-xl">Thử chủ đề khác nhé</p>
              <p className="mt-1.5 text-ink-soft">
                Còn hai chủ đề nữa đang chờ em ở{' '}
                <Link to="/trac-nghiem" className="underline decoration-violet decoration-2">
                  trang trắc nghiệm
                </Link>
                , hoặc tự{' '}
                <Link to="/tao-de" className="underline decoration-amber decoration-2">
                  soạn một đề mới
                </Link>{' '}
                để đố các bạn.
              </p>
            </div>
          )}
        />
      </div>
    </div>
  )
}
