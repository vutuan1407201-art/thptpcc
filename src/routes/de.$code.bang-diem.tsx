import { Link, createFileRoute } from '@tanstack/react-router'
import { SearchX, Trophy } from 'lucide-react'

import { ShareLink } from '../components/ShareLink'
import { getScoreboard } from '../server/quizzes.functions'

export const Route = createFileRoute('/de/$code/bang-diem')({
  loader: async ({ params }) => {
    const board = await getScoreboard({ data: { code: params.code } })
    return { board }
  },
  component: Scoreboard,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.board
          ? `Bảng điểm — ${loaderData.board.quiz.title}`
          : 'Bảng điểm — Chơi Mà Học',
      },
    ],
  }),
})

function medalFor(position: number) {
  if (position === 0) return 'bg-amber'
  if (position === 1) return 'bg-paper-deep'
  if (position === 2) return 'bg-coral/40'
  return 'bg-paper'
}

function Scoreboard() {
  const { board } = Route.useLoaderData()
  const { code } = Route.useParams()

  if (!board) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <span className="card-pop-sm inline-grid h-16 w-16 place-items-center bg-coral/20">
          <SearchX size={28} />
        </span>
        <h1 className="mt-6 text-3xl">Không có đề nào mang mã {code}</h1>
        <Link to="/" className="press card-pop-sm mt-8 inline-block bg-amber px-5 py-3 font-display text-lg">
          Về trang chủ
        </Link>
      </div>
    )
  }

  const { quiz, rows } = board

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="rise-in">
        <Link
          to="/de/$code"
          params={{ code }}
          className="text-sm font-medium text-ink-soft hover:text-ink"
        >
          ← Làm đề này
        </Link>
        <p className="mt-4 text-xs font-semibold tracking-wider text-violet-deep uppercase">
          Bảng điểm · mã {code}
        </p>
        <h1 className="mt-1.5 text-4xl sm:text-5xl">{quiz.title}</h1>
        <p className="mt-3 text-lg text-ink-soft">
          {rows.length > 0
            ? `${rows.length} lượt làm bài đã được ghi lại.`
            : 'Chưa có ai làm đề này.'}
          {quiz.authorName ? ` Đề do ${quiz.authorName} soạn.` : ''}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="card-pop mt-8 bg-paper p-6 sm:p-8">
          <span className="card-pop-sm inline-grid h-14 w-14 place-items-center bg-paper-deep">
            <Trophy size={26} />
          </span>
          <h2 className="mt-5 text-2xl">Bảng điểm đang trống</h2>
          <p className="mt-2 text-ink-soft">
            Gửi đường liên kết bên dưới cho các bạn. Mỗi lần có ai làm xong và ghi tên, kết quả sẽ
            xuất hiện ở đây.
          </p>
          <div className="mt-6">
            <ShareLink path={`/de/${code}`} />
          </div>
        </div>
      ) : (
        <>
          <ol className="mt-8 space-y-2.5">
            {rows.map((row, position) => (
              <li
                key={row.id}
                className={`card-pop-sm flex items-center gap-4 p-4 ${medalFor(position)}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-paper font-display text-lg">
                  {position + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-xl">{row.playerName}</span>
                  <span className="block text-sm text-ink-soft">
                    {Math.floor(row.seconds / 60)} phút {row.seconds % 60} giây
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-display text-2xl">
                    {row.score}
                    <span className="text-ink-soft">/{row.total}</span>
                  </span>
                  <span className="block text-sm text-ink-soft">
                    {Math.round((row.score / row.total) * 100)}%
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <ShareLink path={`/de/${code}`} label="Gửi thêm cho bạn khác" />
          </div>
        </>
      )}
    </div>
  )
}
