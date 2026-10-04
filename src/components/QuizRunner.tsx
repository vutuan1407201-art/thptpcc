import { useMemo, useState, type ReactNode } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'

export type RunnerQuestion = {
  prompt: string
  answers: string[]
  correctIndex: number
  note?: string
}

export type QuizResult = { score: number; total: number; seconds: number }

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F']
const OPTION_TINTS = ['bg-violet/12', 'bg-amber/15', 'bg-mint/15', 'bg-coral/12', 'bg-paper-deep', 'bg-paper-deep']

function praiseFor(ratio: number) {
  if (ratio === 1) return 'Tuyệt đối! Không sai một câu nào.'
  if (ratio >= 0.8) return 'Rất tốt, chỉ còn vài câu nữa là trọn vẹn.'
  if (ratio >= 0.5) return 'Khá rồi đó. Làm lại một lượt sẽ nhớ lâu hơn.'
  return 'Chưa sao cả — xem lại phần giải thích rồi thử lại nhé.'
}

/**
 * The shared multiple-choice engine. Used by the built-in topic quizzes and by
 * quizzes opened from a shared link.
 */
export function QuizRunner({
  questions,
  resultExtra,
  onRestart,
}: {
  questions: RunnerQuestion[]
  resultExtra?: (result: QuizResult) => ReactNode
  onRestart?: () => void
}) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [wrongShake, setWrongShake] = useState(0)
  const [finishedAt, setFinishedAt] = useState<number | null>(null)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const question = questions[index]
  const isLast = index === questions.length - 1
  const answered = picked !== null

  const result = useMemo<QuizResult>(
    () => ({
      score,
      total: questions.length,
      seconds: Math.round(((finishedAt ?? Date.now()) - startedAt) / 1000),
    }),
    [score, questions.length, finishedAt, startedAt],
  )

  function choose(optionIndex: number) {
    if (answered) return
    setPicked(optionIndex)
    if (optionIndex === question.correctIndex) {
      setScore((value) => value + 1)
    } else {
      setWrongShake((value) => value + 1)
    }
  }

  function next() {
    if (isLast) {
      setFinishedAt(Date.now())
      return
    }
    setIndex((value) => value + 1)
    setPicked(null)
  }

  function restart() {
    setIndex(0)
    setPicked(null)
    setScore(0)
    setFinishedAt(null)
    setStartedAt(Date.now())
    onRestart?.()
  }

  if (finishedAt !== null) {
    const ratio = result.score / result.total
    return (
      <div className="pop-in card-pop bg-paper p-6 sm:p-8">
        <p className="text-sm font-semibold tracking-wide text-ink-soft uppercase">Kết quả</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <p className="font-display text-6xl leading-none text-violet-deep">{result.score}</p>
          <p className="font-display text-2xl text-ink-soft">/ {result.total} câu đúng</p>
        </div>
        <div className="mt-4 h-4 overflow-hidden rounded-full border-2 border-ink bg-paper-deep">
          <div
            className="h-full bg-mint transition-[width] duration-700 ease-out"
            style={{ width: `${Math.round(ratio * 100)}%` }}
          />
        </div>
        <p className="mt-4 text-lg">{praiseFor(ratio)}</p>
        <p className="mt-1 text-sm text-ink-soft">
          Thời gian làm bài: {Math.floor(result.seconds / 60)} phút {result.seconds % 60} giây.
        </p>

        <button
          type="button"
          onClick={restart}
          className="press card-pop-sm mt-6 flex items-center gap-2 bg-amber px-5 py-3 font-display text-lg"
        >
          <RotateCcw size={18} />
          Làm lại
        </button>

        {resultExtra ? <div className="mt-6">{resultExtra(result)}</div> : null}
      </div>
    )
  }

  return (
    <div className="card-pop bg-paper p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="font-display text-lg">
          Câu {index + 1}
          <span className="text-ink-soft"> / {questions.length}</span>
        </p>
        <p className="card-pop-sm bg-mint/20 px-3 py-1 font-display text-base">{score} điểm</p>
      </div>

      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {questions.map((_, dotIndex) => (
          <span
            key={dotIndex}
            className={`h-2 flex-1 rounded-full ${
              dotIndex < index ? 'bg-violet' : dotIndex === index ? 'bg-amber' : 'bg-paper-deep'
            }`}
          />
        ))}
      </div>

      <h2 key={index} className="rise-in mt-6 text-2xl leading-snug sm:text-3xl">
        {question.prompt}
      </h2>

      <div key={`options-${index}`} className="mt-6 grid gap-3 sm:grid-cols-2">
        {question.answers.map((answer, optionIndex) => {
          const isCorrect = optionIndex === question.correctIndex
          const isPicked = optionIndex === picked
          const state = !answered
            ? 'idle'
            : isCorrect
              ? 'correct'
              : isPicked
                ? 'wrong'
                : 'dim'

          return (
            <button
              key={optionIndex}
              type="button"
              onClick={() => choose(optionIndex)}
              disabled={answered}
              className={[
                'card-pop-sm flex items-center gap-3 p-4 text-left text-lg',
                state === 'idle' ? `press ${OPTION_TINTS[optionIndex % OPTION_TINTS.length]}` : '',
                state === 'correct' ? 'bg-mint text-ink' : '',
                state === 'wrong' ? `bg-coral text-paper ${wrongShake ? 'shake' : ''}` : '',
                state === 'dim' ? 'bg-paper opacity-55' : '',
              ].join(' ')}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-ink bg-paper/70 font-display text-base">
                {state === 'correct' ? (
                  <Check size={17} />
                ) : state === 'wrong' ? (
                  <X size={17} />
                ) : (
                  OPTION_LABELS[optionIndex % OPTION_LABELS.length]
                )}
              </span>
              <span className="min-w-0">{answer}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="pop-in mt-5 flex flex-col gap-4 border-t-2 border-dashed border-paper-deep pt-5 sm:flex-row sm:items-center">
          <p className="flex-1 text-base">
            <span className="font-display text-lg">
              {picked === question.correctIndex ? 'Chính xác. ' : 'Chưa đúng. '}
            </span>
            {question.note ??
              (picked === question.correctIndex
                ? 'Tiếp tục câu sau nhé.'
                : `Đáp án đúng là "${question.answers[question.correctIndex]}".`)}
          </p>
          <button
            type="button"
            onClick={next}
            className="press card-pop-sm bg-violet px-5 py-3 font-display text-lg text-paper"
          >
            {isLast ? 'Xem kết quả' : 'Câu tiếp theo'}
          </button>
        </div>
      )}
    </div>
  )
}
