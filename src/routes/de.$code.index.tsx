import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Check, ClipboardList, Play, SearchX } from 'lucide-react'

import { QuizRunner, type QuizResult } from '../components/QuizRunner'
import { ShareLink } from '../components/ShareLink'
import { getQuiz, saveAttempt } from '../server/quizzes.functions'

export const Route = createFileRoute('/de/$code/')({
  loader: async ({ params }) => {
    const quiz = await getQuiz({ data: { code: params.code } })
    return { quiz }
  },
  component: SharedQuizPage,
  head: ({ loaderData }) => ({
    meta: loaderData?.quiz
      ? [
          { title: `${loaderData.quiz.title} — Chơi Mà Học` },
          {
            name: 'description',
            content: `Đề trắc nghiệm ${loaderData.quiz.questions.length} câu${
              loaderData.quiz.subject ? ` môn ${loaderData.quiz.subject}` : ''
            }. Mở link là làm được ngay.`,
          },
        ]
      : [{ title: 'Không tìm thấy đề — Chơi Mà Học' }],
  }),
})

function SharedQuizPage() {
  const { quiz } = Route.useLoaderData()
  const { code } = Route.useParams()
  const [playerName, setPlayerName] = useState('')
  const [started, setStarted] = useState(false)

  if (!quiz) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <span className="card-pop-sm inline-grid h-16 w-16 place-items-center bg-coral/20">
          <SearchX size={28} />
        </span>
        <h1 className="mt-6 text-3xl">Không tìm thấy đề có mã {code}</h1>
        <p className="mt-3 text-ink-soft">
          Có thể mã bị gõ thiếu một ký tự, hoặc đường liên kết bị cắt ngắn khi gửi. Em thử kiểm tra
          lại mã với người đã gửi nhé.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="press card-pop-sm bg-amber px-5 py-3 font-display text-lg">
            Về trang chủ
          </Link>
          <Link to="/tao-de" className="press card-pop-sm bg-paper px-5 py-3 font-display text-lg">
            Tự tạo một đề
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="rise-in">
        <p className="text-xs font-semibold tracking-wider text-violet-deep uppercase">
          Đề được chia sẻ · mã {quiz.code}
        </p>
        <h1 className="mt-1.5 text-4xl sm:text-5xl">{quiz.title}</h1>
        <p className="mt-3 text-lg text-ink-soft">
          {quiz.questions.length} câu hỏi
          {quiz.subject ? ` · môn ${quiz.subject}` : ''}
          {quiz.authorName ? ` · soạn bởi ${quiz.authorName}` : ''}
        </p>
      </div>

      {!started ? (
        <div className="card-pop mt-8 bg-paper p-6 sm:p-8">
          <h2 className="text-2xl">Em tên là gì?</h2>
          <p className="mt-2 text-ink-soft">
            Ghi tên để kết quả của em hiện trên bảng điểm của đề này. Không muốn ghi tên thì bỏ trống
            cũng được.
          </p>
          <input
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="VD: Minh Anh"
            maxLength={40}
            className="mt-5 w-full rounded-xl border-2 border-ink bg-paper-deep px-4 py-3 text-lg"
          />
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="press card-pop-sm mt-5 flex items-center gap-2 bg-violet px-6 py-3.5 font-display text-xl text-paper"
          >
            <Play size={19} />
            Bắt đầu làm bài
          </button>
          <p className="mt-5 border-t-2 border-dashed border-paper-deep pt-5 text-sm text-ink-soft">
            <Link
              to="/de/$code/bang-diem"
              params={{ code: quiz.code }}
              className="underline decoration-violet decoration-2"
            >
              Xem bảng điểm của đề này
            </Link>{' '}
            trước khi làm cũng được.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <QuizRunner
            questions={quiz.questions}
            resultExtra={(result) => (
              <SaveResult code={quiz.code} playerName={playerName} result={result} />
            )}
          />
        </div>
      )}
    </div>
  )
}

/** Lets the player push their finished run onto the quiz scoreboard, once. */
function SaveResult({
  code,
  playerName,
  result,
}: {
  code: string
  playerName: string
  result: QuizResult
}) {
  const [name, setName] = useState(playerName)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function save() {
    setState('saving')
    try {
      await saveAttempt({
        data: {
          code,
          playerName: name,
          score: result.score,
          total: result.total,
          seconds: result.seconds,
        },
      })
      setState('saved')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="card-pop-sm bg-paper-deep p-5">
        {state === 'saved' ? (
          <>
            <p className="flex items-center gap-2 font-display text-xl">
              <Check size={19} />
              Đã ghi vào bảng điểm
            </p>
            <Link
              to="/de/$code/bang-diem"
              params={{ code }}
              className="press card-pop-sm mt-4 inline-flex items-center gap-2 bg-amber px-5 py-3 font-display text-lg"
            >
              <ClipboardList size={18} />
              Xem bảng điểm
            </Link>
          </>
        ) : (
          <>
            <p className="font-display text-xl">Ghi kết quả vào bảng điểm</p>
            <p className="mt-1.5 text-sm text-ink-soft">
              Người soạn đề sẽ thấy tên và số câu đúng của em.
            </p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Tên của em"
                maxLength={40}
                className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-paper px-4 py-2.5"
              />
              <button
                type="button"
                onClick={save}
                disabled={state === 'saving'}
                className="press card-pop-sm bg-mint px-5 py-2.5 font-display text-lg whitespace-nowrap disabled:opacity-60"
              >
                {state === 'saving' ? 'Đang ghi…' : 'Ghi tên'}
              </button>
            </div>
            {state === 'error' && (
              <p className="mt-3 text-sm font-medium text-coral">
                Chưa ghi được, em thử bấm lại lần nữa nhé.
              </p>
            )}
          </>
        )}
      </div>

      <ShareLink path={`/de/${code}`} label="Gửi đề này cho bạn khác" />
    </div>
  )
}
