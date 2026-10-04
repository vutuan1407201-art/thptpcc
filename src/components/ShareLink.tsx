import { useEffect, useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'

/**
 * Shows the full, absolute link to a quiz so it can be pasted into a chat
 * group. The origin is only known in the browser, hence the effect.
 */
export function ShareLink({ path, label }: { path: string; label?: string }) {
  const [origin, setOrigin] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const url = origin ? `${origin}${path}` : path

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="card-pop-sm bg-paper p-4">
      <p className="font-display text-lg">{label ?? 'Đường liên kết chia sẻ'}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
          className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-paper-deep px-3 py-2.5 font-mono text-sm"
          aria-label="Đường liên kết chia sẻ"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="press card-pop-sm flex items-center gap-2 bg-amber px-4 py-2.5 font-display text-base whitespace-nowrap"
          >
            {copied ? <Check size={17} /> : <Copy size={17} />}
            {copied ? 'Đã chép' : 'Chép link'}
          </button>
          <a
            href={path}
            className="press card-pop-sm flex items-center gap-2 bg-paper px-4 py-2.5 font-display text-base whitespace-nowrap"
          >
            <ExternalLink size={17} />
            Mở
          </a>
        </div>
      </div>
      <p className="mt-2.5 text-sm text-ink-soft">
        Ai mở đường liên kết này cũng làm được đề, không cần đăng nhập hay cài đặt gì.
      </p>
    </div>
  )
}
