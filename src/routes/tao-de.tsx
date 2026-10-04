import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Check, Plus, Trash2, Wand2 } from 'lucide-react'

import { PageIntro } from '../components/PageIntro'
import { ShareLink } from '../components/ShareLink'
import { createQuiz } from '../server/quizzes.functions'

export const Route = createFileRoute('/tao-de')({
  component: CreateQuizPage,
  head: () => ({
    meta: [
      { title: 'Tạo đề và chia sẻ bằng link — Chơi Mà Học' },
      {
        name: 'description',
        content:
          'Tự soạn bộ câu hỏi trắc nghiệm rồi nhận một đường liên kết ngắn để gửi cho cả lớp cùng làm và xem bảng điểm.',
      },
    ],
  }),
})

type DraftQuestion = { prompt: string; answers: string[]; correctIndex: number }

const emptyQuestion = (): DraftQuestion => ({ prompt: '', answers: ['', '', '', ''], correctIndex: 0 })

const SAMPLE: { title: string; subject: string; questions: DraftQuestion[] } = {
  title: 'Ôn tập tuần 8 — lớp 4B',
  subject: 'Toán và Tiếng Việt',
  questions: [
    {
      prompt: 'Số lớn nhất có ba chữ số khác nhau là số nào?',
      answers: ['999', '987', '900', '876'],
      correctIndex: 1,
    },
    {
      prompt: 'Từ nào sau đây là từ ghép?',
      answers: ['Lung linh', 'Xe đạp', 'Rì rào', 'Lấp lánh'],
      correctIndex: 1,
    },
    {
      prompt: 'Một giờ có bao nhiêu phút?',
      answers: ['30 phút', '60 phút', '90 phút', '100 phút'],
      correctIndex: 1,
    },
  ],
}

function CreateQuizPage() {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [questions, setQuestions] = useState<DraftQuestion[]>([emptyQuestion()])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedCode, setSavedCode] = useState<string | null>(null)

  function updateQuestion(index: number, patch: Partial<DraftQuestion>) {
    setQuestions((list) => list.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function updateAnswer(questionIndex: number, answerIndex: number, value: string) {
    setQuestions((list) =>
      list.map((item, i) =>
        i === questionIndex
          ? { ...item, answers: item.answers.map((answer, j) => (j === answerIndex ? value : answer)) }
          : item,
      ),
    )
  }

  function loadSample() {
    setTitle(SAMPLE.title)
    setSubject(SAMPLE.subject)
    setQuestions(SAMPLE.questions.map((question) => ({ ...question, answers: [...question.answers] })))
    setError(null)
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const result = await createQuiz({
        data: { title, subject, authorName, questions },
      })
      setSavedCode(result.code)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Chưa lưu được đề, em thử lại nhé.')
    } finally {
      setSaving(false)
    }
  }

  if (savedCode) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="pop-in card-pop bg-paper p-6 sm:p-8">
          <p className="card-pop-sm inline-flex items-center gap-2 bg-mint px-3.5 py-1.5 font-display text-base">
            <Check size={16} />
            Đã lưu đề
          </p>
          <h1 className="mt-5 text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-2 text-ink-soft">
            Mã đề của em là{' '}
            <strong className="font-display text-2xl tracking-[0.15em] text-violet-deep">
              {savedCode}
            </strong>
            . Gửi mã này hoặc đường liên kết bên dưới cho các bạn.
          </p>

          <div className="mt-6">
            <ShareLink path={`/de/${savedCode}`} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/de/$code"
              params={{ code: savedCode }}
              className="press card-pop-sm bg-violet px-5 py-3 font-display text-lg text-paper"
            >
              Làm thử đề này
            </Link>
            <Link
              to="/de/$code/bang-diem"
              params={{ code: savedCode }}
              className="press card-pop-sm bg-paper px-5 py-3 font-display text-lg"
            >
              Xem bảng điểm
            </Link>
            <button
              type="button"
              onClick={() => {
                setSavedCode(null)
                setTitle('')
                setSubject('')
                setQuestions([emptyQuestion()])
              }}
              className="press card-pop-sm bg-paper px-5 py-3 font-display text-lg"
            >
              Soạn đề khác
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <PageIntro eyebrow="Trò chơi 4" title="Tạo đề & chia sẻ link">
        Soạn câu hỏi của em, bấm lưu là có ngay một đường liên kết ngắn. Bạn bè mở liên kết đó sẽ làm
        được đề và tên các bạn sẽ hiện trên bảng điểm của đề.
      </PageIntro>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div className="card-pop bg-paper p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl">Thông tin đề</h2>
            <button
              type="button"
              onClick={loadSample}
              className="press card-pop-sm flex items-center gap-2 bg-amber px-3.5 py-2 font-display text-base"
            >
              <Wand2 size={16} />
              Dùng đề mẫu
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="font-medium">Tên đề</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="VD: Ôn tập tuần 8 — lớp 4B"
                className="mt-1.5 w-full rounded-xl border-2 border-ink bg-paper-deep px-4 py-2.5"
                required
                maxLength={120}
              />
            </label>
            <label>
              <span className="font-medium">Môn học (không bắt buộc)</span>
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="VD: Toán"
                className="mt-1.5 w-full rounded-xl border-2 border-ink bg-paper-deep px-4 py-2.5"
                maxLength={60}
              />
            </label>
            <label>
              <span className="font-medium">Người soạn (không bắt buộc)</span>
              <input
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                placeholder="VD: Cô Hạnh"
                className="mt-1.5 w-full rounded-xl border-2 border-ink bg-paper-deep px-4 py-2.5"
                maxLength={60}
              />
            </label>
          </div>
        </div>

        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="card-pop bg-paper p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl">Câu {questionIndex + 1}</h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => setQuestions((list) => list.filter((_, i) => i !== questionIndex))}
                  className="press card-pop-sm flex items-center gap-1.5 bg-coral/20 px-3 py-1.5 text-sm font-medium"
                >
                  <Trash2 size={15} />
                  Xóa câu
                </button>
              )}
            </div>

            <textarea
              value={question.prompt}
              onChange={(event) => updateQuestion(questionIndex, { prompt: event.target.value })}
              placeholder="Nhập câu hỏi ở đây"
              rows={2}
              className="mt-3 w-full resize-y rounded-xl border-2 border-ink bg-paper-deep px-4 py-2.5"
              required
              maxLength={300}
            />

            <p className="mt-4 text-sm font-medium text-ink-soft">
              Các phương án — chọn ô tròn ở phương án đúng
            </p>
            <div className="mt-2 grid gap-2.5">
              {question.answers.map((answer, answerIndex) => (
                <label
                  key={answerIndex}
                  className={[
                    'flex items-center gap-3 rounded-xl border-2 px-3 py-2',
                    question.correctIndex === answerIndex
                      ? 'border-ink bg-mint/20'
                      : 'border-paper-deep bg-paper',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name={`correct-${questionIndex}`}
                    checked={question.correctIndex === answerIndex}
                    onChange={() => updateQuestion(questionIndex, { correctIndex: answerIndex })}
                    className="h-5 w-5 shrink-0 accent-violet"
                    aria-label={`Đáp án đúng là phương án ${answerIndex + 1}`}
                  />
                  <input
                    value={answer}
                    onChange={(event) => updateAnswer(questionIndex, answerIndex, event.target.value)}
                    placeholder={`Phương án ${answerIndex + 1}${answerIndex > 1 ? ' (có thể để trống)' : ''}`}
                    className="min-w-0 flex-1 bg-transparent py-1 outline-none"
                    maxLength={160}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setQuestions((list) => [...list, emptyQuestion()])}
          disabled={questions.length >= 30}
          className="press card-pop-sm flex w-full items-center justify-center gap-2 bg-paper-deep py-3.5 font-display text-lg disabled:opacity-45"
        >
          <Plus size={19} />
          Thêm câu hỏi ({questions.length}/30)
        </button>

        {error && (
          <p className="card-pop-sm shake bg-coral/20 p-4 font-medium" role="alert">
            {error}
          </p>
        )}

        <div className="card-pop-sm flex flex-wrap items-center gap-4 bg-ink p-5 text-paper">
          <p className="flex-1 text-paper/75">
            Lưu xong em sẽ nhận được mã đề 6 ký tự và một đường liên kết để chia sẻ.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="press card-pop-sm bg-amber px-6 py-3 font-display text-xl text-ink disabled:opacity-60"
          >
            {saving ? 'Đang lưu…' : 'Lưu & lấy link'}
          </button>
        </div>
      </form>
    </div>
  )
}
