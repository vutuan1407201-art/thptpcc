import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Backpack,
  Bird,
  Bike,
  Book,
  Clock,
  Cloud,
  Fish,
  Flower2,
  Key,
  Lamp,
  Leaf,
  Pencil,
  RotateCcw,
  Snail,
  Sun,
  TreeDeciduous,
  Umbrella,
  type LucideIcon,
} from 'lucide-react'

import type { MemorySet } from '../games/content'

const ICONS: Record<string, LucideIcon> = {
  sun: Sun,
  cloud: Cloud,
  flower: Flower2,
  tree: TreeDeciduous,
  fish: Fish,
  bird: Bird,
  snail: Snail,
  leaf: Leaf,
  book: Book,
  pencil: Pencil,
  backpack: Backpack,
  clock: Clock,
  bike: Bike,
  umbrella: Umbrella,
  key: Key,
  lamp: Lamp,
}

const TINTS = [
  'bg-violet/15',
  'bg-amber/20',
  'bg-mint/20',
  'bg-coral/15',
  'bg-violet/25',
  'bg-amber/30',
  'bg-mint/30',
  'bg-coral/25',
]

type Card = { id: number; pairIndex: number; icon: string; label: string }

function buildDeck(set: MemorySet): Card[] {
  const cards = set.pairs.flatMap((pair, pairIndex) => [
    { id: pairIndex * 2, pairIndex, icon: pair.icon, label: pair.label },
    { id: pairIndex * 2 + 1, pairIndex, icon: pair.icon, label: pair.label },
  ])

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[cards[index], cards[swap]] = [cards[swap], cards[index]]
  }
  return cards
}

export function MemoryGame({ set }: { set: MemorySet }) {
  const [deck, setDeck] = useState<Card[]>(() => buildDeck(set))
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [lastMatch, setLastMatch] = useState<string | null>(null)
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const done = matched.length === set.pairs.length

  useEffect(() => {
    setDeck(buildDeck(set))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setSeconds(0)
    setLastMatch(null)
  }, [set])

  useEffect(() => {
    if (done) return
    const id = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(id)
  }, [done, deck])

  useEffect(() => () => {
    if (lockTimer.current) clearTimeout(lockTimer.current)
  }, [])

  const perfectMoves = set.pairs.length
  const stars = useMemo(() => {
    if (moves <= perfectMoves + 3) return 3
    if (moves <= perfectMoves + 8) return 2
    return 1
  }, [moves, perfectMoves])

  function flip(cardId: number) {
    const card = deck.find((item) => item.id === cardId)
    if (!card || flipped.length >= 2) return
    if (flipped.includes(cardId) || matched.includes(card.pairIndex)) return

    const nextFlipped = [...flipped, cardId]
    setFlipped(nextFlipped)
    if (nextFlipped.length < 2) return

    setMoves((value) => value + 1)
    const [firstId, secondId] = nextFlipped
    const first = deck.find((item) => item.id === firstId)
    const second = deck.find((item) => item.id === secondId)

    if (first && second && first.pairIndex === second.pairIndex) {
      setMatched((value) => [...value, first.pairIndex])
      setLastMatch(first.label)
      setFlipped([])
      return
    }

    lockTimer.current = setTimeout(() => setFlipped([]), 780)
  }

  function restart() {
    setDeck(buildDeck(set))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setSeconds(0)
    setLastMatch(null)
  }

  return (
    <div className="card-pop bg-paper p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <p className="card-pop-sm bg-paper-deep px-3 py-1.5 font-display text-lg">
          {matched.length} / {set.pairs.length} cặp
        </p>
        <p className="card-pop-sm bg-paper-deep px-3 py-1.5 font-display text-lg">{moves} lượt mở</p>
        <p className="card-pop-sm bg-paper-deep px-3 py-1.5 font-display text-lg">
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
        </p>
        <button
          type="button"
          onClick={restart}
          className="press card-pop-sm ml-auto flex items-center gap-2 bg-paper px-4 py-2 font-display text-base"
        >
          <RotateCcw size={16} />
          Xếp lại
        </button>
      </div>

      <p className="mt-3 min-h-6 text-sm text-ink-soft" aria-live="polite">
        {done
          ? 'Hoàn thành! Em đã tìm được tất cả các cặp.'
          : lastMatch
            ? `Vừa tìm được cặp: ${lastMatch}.`
            : 'Mở hai thẻ giống nhau để ghép thành một cặp.'}
      </p>

      <div className="mt-5 grid grid-cols-4 gap-2.5 sm:gap-3">
        {deck.map((card, position) => {
          const isMatched = matched.includes(card.pairIndex)
          const isFlipped = flipped.includes(card.id) || isMatched
          const Icon = ICONS[card.icon] ?? Sun

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(card.id)}
              disabled={isFlipped}
              aria-label={isFlipped ? card.label : `Thẻ số ${position + 1}, chưa mở`}
              className={[
                'card-pop-sm relative grid aspect-square place-items-center overflow-hidden',
                isFlipped
                  ? `flip-face ${TINTS[card.pairIndex % TINTS.length]} ${isMatched ? '' : 'ring-2 ring-ink ring-inset'}`
                  : 'press bg-violet',
                isMatched ? 'opacity-90' : '',
              ].join(' ')}
            >
              {isFlipped ? (
                <span className="flex flex-col items-center gap-1 px-1">
                  <Icon size={30} strokeWidth={2.2} />
                  <span className="text-[11px] leading-tight font-medium sm:text-xs">{card.label}</span>
                </span>
              ) : (
                <span className="font-display text-2xl text-paper/80">?</span>
              )}
            </button>
          )
        })}
      </div>

      {done && (
        <div className="pop-in card-pop-sm mt-6 bg-mint/25 p-5">
          <p className="font-display text-2xl">
            Xong rồi! {'★'.repeat(stars)}
            <span className="text-ink-soft">{'★'.repeat(3 - stars)}</span>
          </p>
          <p className="mt-1 text-ink-soft">
            {set.pairs.length} cặp trong {moves} lượt mở, mất {Math.floor(seconds / 60)} phút{' '}
            {seconds % 60} giây.
            {stars === 3 ? ' Trí nhớ rất tốt!' : ' Thử lại xem có ít lượt hơn được không nhé.'}
          </p>
          <button
            type="button"
            onClick={restart}
            className="press card-pop-sm mt-4 flex items-center gap-2 bg-amber px-5 py-3 font-display text-lg"
          >
            <RotateCcw size={18} />
            Chơi lại
          </button>
        </div>
      )}
    </div>
  )
}
