import { useCallback, useEffect, useRef, useState } from 'react'
import { Delete, Flame, RotateCcw, Timer, Trophy } from 'lucide-react'

type LevelKey = 'de' | 'vua' | 'kho'

const LEVELS: { key: LevelKey; label: string; hint: string; seconds: number }[] = [
  { key: 'de', label: 'Dễ', hint: 'Cộng, trừ trong phạm vi 20', seconds: 60 },
  { key: 'vua', label: 'Vừa', hint: 'Cộng, trừ trong 100 và bảng nhân', seconds: 60 },
  { key: 'kho', label: 'Khó', hint: 'Nhân, chia và phép tính hỗn hợp', seconds: 75 },
]

type Problem = { text: string; answer: number }

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeProblem(level: LevelKey): Problem {
  if (level === 'de') {
    const a = randomInt(2, 18)
    const b = randomInt(1, 20 - a)
    if (Math.random() < 0.5) return { text: `${a} + ${b}`, answer: a + b }
    const sum = a + b
    return { text: `${sum} − ${b}`, answer: a }
  }

  if (level === 'vua') {
    const pick = Math.random()
    if (pick < 0.4) {
      const a = randomInt(11, 89)
      const b = randomInt(6, 99 - a)
      return { text: `${a} + ${b}`, answer: a + b }
    }
    if (pick < 0.7) {
      const a = randomInt(25, 99)
      const b = randomInt(4, a - 1)
      return { text: `${a} − ${b}`, answer: a - b }
    }
    const a = randomInt(2, 9)
    const b = randomInt(2, 9)
    return { text: `${a} × ${b}`, answer: a * b }
  }

  const pick = Math.random()
  if (pick < 0.4) {
    const a = randomInt(3, 12)
    const b = randomInt(3, 12)
    return { text: `${a} × ${b}`, answer: a * b }
  }
  if (pick < 0.75) {
    const b = randomInt(3, 12)
    const answer = randomInt(3, 12)
    return { text: `${b * answer} : ${b}`, answer }
  }
  const a = randomInt(2, 9)
  const b = randomInt(2, 9)
  const c = randomInt(2, 20)
  return { text: `${a} × ${b} + ${c}`, answer: a * b + c }
}

const STORAGE_KEY = 'choi-ma-hoc:toan-nhanh:best'

export function MathGame() {
  const [level, setLevel] = useState<LevelKey>('vua')
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [problem, setProblem] = useState<Problem>(() => makeProblem('vua'))
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [feedback, setFeedback] = useState<'none' | 'right' | 'wrong'>('none')
  const [timeLeft, setTimeLeft] = useState(LEVELS[1].seconds)
  const [best, setBest] = useState<number | null>(null)

  const levelConfig = LEVELS.find((item) => item.key === level) ?? LEVELS[1]
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) setBest(Number(stored) || 0)
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          clearInterval(id)
          setPhase('over')
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'over') return
    setBest((current) => {
      if (current !== null && current >= score) return current
      window.localStorage.setItem(STORAGE_KEY, String(score))
      return score
    })
  }, [phase, score])

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
  }, [])

  const start = useCallback(
    (nextLevel: LevelKey) => {
      const config = LEVELS.find((item) => item.key === nextLevel) ?? LEVELS[1]
      setLevel(nextLevel)
      setPhase('playing')
      setProblem(makeProblem(nextLevel))
      setInput('')
      setScore(0)
      setMisses(0)
      setStreak(0)
      setBestStreak(0)
      setFeedback('none')
      setTimeLeft(config.seconds)
    },
    [],
  )

  const submit = useCallback(() => {
    if (phase !== 'playing' || input === '') return
    const correct = Number(input) === problem.answer

    if (correct) {
      setScore((value) => value + 1)
      setStreak((value) => {
        const next = value + 1
        setBestStreak((top) => Math.max(top, next))
        return next
      })
      setFeedback('right')
      setProblem(makeProblem(level))
      setTimeLeft((value) => value + 1)
    } else {
      setMisses((value) => value + 1)
      setStreak(0)
      setFeedback('wrong')
    }

    setInput('')
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    feedbackTimer.current = setTimeout(() => setFeedback('none'), 420)
  }, [phase, input, problem, level])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (phase !== 'playing') return
      if (event.key >= '0' && event.key <= '9') {
        setInput((value) => (value.length < 5 ? value + event.key : value))
      } else if (event.key === 'Backspace') {
        setInput((value) => value.slice(0, -1))
      } else if (event.key === 'Enter') {
        submit()
      } else if (event.key === '-') {
        setInput((value) => (value.startsWith('-') ? value.slice(1) : `-${value}`))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, submit])

  if (phase === 'idle') {
    return (
      <div className="card-pop bg-paper p-6 sm:p-8">
        <h2 className="text-2xl">Chọn mức độ rồi bắt đầu</h2>
        <p className="mt-2 text-ink-soft">
          Mỗi câu trả lời đúng được 1 điểm và thưởng thêm 1 giây. Trả lời sai không bị trừ điểm, chỉ
          mất chuỗi đúng liên tiếp.
        </p>
        <div className="mt-6 grid gap-3">
          {LEVELS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => start(item.key)}
              className="press card-pop-sm flex items-center gap-4 bg-paper-deep p-4 text-left"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-ink bg-amber font-display text-xl">
                {item.label.charAt(0)}
              </span>
              <span>
                <span className="block font-display text-xl">{item.label}</span>
                <span className="block text-sm text-ink-soft">{item.hint}</span>
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-sm text-ink-soft">
                <Timer size={15} />
                {item.seconds}s
              </span>
            </button>
          ))}
        </div>
        {best !== null && best > 0 && (
          <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
            <Trophy size={16} />
            Điểm cao nhất của em trên máy này: <strong className="text-ink">{best}</strong>
          </p>
        )}
      </div>
    )
  }

  if (phase === 'over') {
    const accuracy = score + misses > 0 ? Math.round((score / (score + misses)) * 100) : 0
    return (
      <div className="pop-in card-pop bg-paper p-6 sm:p-8">
        <p className="text-sm font-semibold tracking-wide text-ink-soft uppercase">Hết giờ</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <p className="font-display text-6xl leading-none text-violet-deep">{score}</p>
          <p className="font-display text-2xl text-ink-soft">câu đúng</p>
        </div>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Độ chính xác', value: `${accuracy}%` },
            { label: 'Chuỗi dài nhất', value: `${bestStreak} câu` },
            { label: 'Trả lời sai', value: `${misses} lần` },
          ].map((stat) => (
            <div key={stat.label} className="card-pop-sm bg-paper-deep p-4">
              <dt className="text-sm text-ink-soft">{stat.label}</dt>
              <dd className="font-display text-2xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
        {best !== null && score >= best && score > 0 && (
          <p className="mt-5 card-pop-sm inline-flex items-center gap-2 bg-mint/25 px-4 py-2 font-display text-lg">
            <Trophy size={18} />
            Kỷ lục mới!
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => start(level)}
            className="press card-pop-sm flex items-center gap-2 bg-amber px-5 py-3 font-display text-lg"
          >
            <RotateCcw size={18} />
            Chơi lại mức {levelConfig.label}
          </button>
          <button
            type="button"
            onClick={() => setPhase('idle')}
            className="press card-pop-sm bg-paper px-5 py-3 font-display text-lg"
          >
            Đổi mức độ
          </button>
        </div>
      </div>
    )
  }

  const keypad = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '-', '0', 'del']

  return (
    <div className="card-pop bg-paper p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <p className="card-pop-sm flex items-center gap-2 bg-paper-deep px-3 py-1.5 font-display text-lg">
          <Timer size={17} />
          {timeLeft}s
        </p>
        <p className="card-pop-sm bg-mint/20 px-3 py-1.5 font-display text-lg">{score} điểm</p>
        {streak >= 3 && (
          <p className="pop-in card-pop-sm flex items-center gap-1.5 bg-coral/20 px-3 py-1.5 font-display text-lg">
            <Flame size={17} />
            {streak} liên tiếp
          </p>
        )}
        <p className="ml-auto text-sm text-ink-soft">Mức {levelConfig.label}</p>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-ink bg-paper-deep">
        <div
          className="h-full bg-violet transition-[width] duration-1000 ease-linear"
          style={{ width: `${Math.min(100, (timeLeft / levelConfig.seconds) * 100)}%` }}
        />
      </div>

      <div
        className={[
          'card-pop-sm mt-6 flex flex-wrap items-center justify-center gap-4 p-6 text-center',
          feedback === 'right' ? 'bg-mint/30' : feedback === 'wrong' ? 'bg-coral/25 shake' : 'bg-paper-deep',
        ].join(' ')}
      >
        <p className="font-display text-4xl sm:text-5xl">{problem.text}</p>
        <p className="font-display text-4xl text-ink-soft sm:text-5xl">=</p>
        <p
          className="min-w-24 rounded-xl border-2 border-dashed border-ink bg-paper px-4 py-1 font-display text-4xl sm:text-5xl"
          aria-live="polite"
        >
          {input || <span className="text-ink-soft">?</span>}
        </p>
      </div>

      <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2.5">
        {keypad.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (key === 'del') setInput((value) => value.slice(0, -1))
              else if (key === '-') setInput((value) => (value.startsWith('-') ? value.slice(1) : `-${value}`))
              else setInput((value) => (value.length < 5 ? value + key : value))
            }}
            className="press card-pop-sm bg-paper py-3.5 font-display text-2xl"
            aria-label={key === 'del' ? 'Xóa một chữ số' : key === '-' ? 'Dấu âm' : key}
          >
            {key === 'del' ? <Delete size={20} className="mx-auto" /> : key}
          </button>
        ))}
        <button
          type="button"
          onClick={submit}
          disabled={input === ''}
          className="press card-pop-sm col-span-3 bg-violet py-3.5 font-display text-2xl text-paper disabled:opacity-45"
        >
          Trả lời
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-ink-soft">
        Dùng bàn phím máy tính cũng được: gõ số rồi nhấn Enter.
      </p>
    </div>
  )
}
