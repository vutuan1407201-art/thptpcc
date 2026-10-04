# Chơi Mà Học

A small Vietnamese-language learning-games site for primary school pupils. Four games, no accounts,
no installs — and every quiz a teacher or pupil creates gets its own short shareable link that anyone
can open and play.

## What's in it

| Screen | Path | What it does |
|--------|------|--------------|
| Trang chủ | `/` | Landing page, game catalogue, and a box to open a shared quiz by its 6-character code |
| Toán nhanh | `/toan-nhanh` | 60-second arithmetic drill, three difficulty levels, on-screen keypad plus physical-keyboard input, streaks and a local best score |
| Lật thẻ ghi nhớ | `/ghi-nho` | Memory pair-matching over two icon decks, with move counter, timer and a 3-star rating |
| Trắc nghiệm | `/trac-nghiem`, `/trac-nghiem/$slug` | Three built-in topics (English, science, Vietnamese geography), 10 questions each with explanations |
| Tạo đề | `/tao-de` | Build a custom multiple-choice quiz, save it, and get a short shareable link |
| Làm đề được chia sẻ | `/de/$code` | Anyone who opens the link plays the quiz and can put their name on the scoreboard |
| Bảng điểm | `/de/$code/bang-diem` | Ranked results for one shared quiz |

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React 19, TanStack Router v1) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 with custom theme tokens in `src/styles.css` |
| Icons | lucide-react |
| Data | Netlify Database (managed Postgres) via Drizzle ORM |
| Images | Netlify Image CDN, artwork generated with Netlify AI Gateway |
| Language | TypeScript 5.9 (strict) |
| Hosting | Netlify |

## Running locally

```bash
pnpm install
netlify dev --port 8889   # emulates Netlify Database, Image CDN and functions
```

`pnpm dev` also works for pure UI work, but the quiz-sharing screens need `netlify dev` so the
database connection is available.

Database migrations live in `netlify/database/migrations` and are applied automatically on deploy.
After editing `db/schema.ts`, regenerate them:

```bash
npx drizzle-kit generate --name <describe_the_change>
```

## Possible next steps

The product is complete as described above. Natural extensions, none of them required:

- Let a quiz owner edit or close an existing quiz (currently a quiz is immutable once saved).
- Add more built-in topics and memory decks — both are plain data in `src/games/content.ts`.
- Per-question statistics on the scoreboard, to show which questions the class found hardest.
