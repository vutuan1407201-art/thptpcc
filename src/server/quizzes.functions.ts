import { createServerFn } from '@tanstack/react-start'
import { desc, eq, sql } from 'drizzle-orm'

import { db } from '../../db/index.js'
import { attempts, quizzes, type QuizQuestion } from '../../db/schema.js'

/** Link codes avoid 0/O and 1/I so they survive being read aloud in class. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function makeCode(length = 6) {
  let code = ''
  for (let index = 0; index < length; index += 1) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return code
}

function trimTo(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export type NewQuizInput = {
  title: string
  subject: string
  authorName: string
  questions: QuizQuestion[]
}

/**
 * Validates a draft coming from the "Tạo đề" form. Throws with a Vietnamese
 * message so the form can show it directly.
 */
function parseQuizInput(data: unknown): NewQuizInput {
  const raw = (data ?? {}) as Record<string, unknown>
  const title = trimTo(raw.title, 120)
  if (title.length < 3) {
    throw new Error('Tên đề cần ít nhất 3 ký tự.')
  }

  const rawQuestions = Array.isArray(raw.questions) ? raw.questions : []
  const questions: QuizQuestion[] = []

  for (const [index, item] of rawQuestions.entries()) {
    const entry = (item ?? {}) as Record<string, unknown>
    const prompt = trimTo(entry.prompt, 300)
    const answers = (Array.isArray(entry.answers) ? entry.answers : [])
      .map((answer) => trimTo(answer, 160))
      .filter((answer) => answer.length > 0)
    const correctIndex = Number(entry.correctIndex)

    if (!prompt) {
      throw new Error(`Câu ${index + 1} còn thiếu nội dung câu hỏi.`)
    }
    if (answers.length < 2) {
      throw new Error(`Câu ${index + 1} cần ít nhất 2 phương án trả lời.`)
    }
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= answers.length) {
      throw new Error(`Câu ${index + 1} chưa chọn đáp án đúng.`)
    }

    questions.push({ prompt, answers, correctIndex })
  }

  if (questions.length === 0) {
    throw new Error('Đề cần có ít nhất 1 câu hỏi.')
  }
  if (questions.length > 30) {
    throw new Error('Mỗi đề chỉ nhận tối đa 30 câu hỏi.')
  }

  return {
    title,
    subject: trimTo(raw.subject, 60),
    authorName: trimTo(raw.authorName, 60),
    questions,
  }
}

/** Saves a new quiz and returns the short code used in its shareable link. */
export const createQuiz = createServerFn({ method: 'POST' })
  .inputValidator(parseQuizInput)
  .handler(async ({ data }) => {
    // Codes are random; retry a few times in the unlikely event of a collision.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = makeCode()
      try {
        const [row] = await db
          .insert(quizzes)
          .values({
            code,
            title: data.title,
            subject: data.subject,
            authorName: data.authorName,
            questions: data.questions,
          })
          .returning({ code: quizzes.code })
        return { code: row.code }
      } catch (error) {
        const message = error instanceof Error ? error.message : ''
        if (!message.includes('quizzes_code_unique')) throw error
      }
    }
    throw new Error('Không tạo được mã đề, bạn thử lại lần nữa nhé.')
  })

export const getQuiz = createServerFn({ method: 'GET' })
  .inputValidator((data: { code: string }) => ({ code: String(data.code).toUpperCase().slice(0, 12) }))
  .handler(async ({ data }) => {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.code, data.code)).limit(1)
    return quiz ?? null
  })

export const getScoreboard = createServerFn({ method: 'GET' })
  .inputValidator((data: { code: string }) => ({ code: String(data.code).toUpperCase().slice(0, 12) }))
  .handler(async ({ data }) => {
    const [quiz] = await db
      .select({ title: quizzes.title, subject: quizzes.subject, authorName: quizzes.authorName })
      .from(quizzes)
      .where(eq(quizzes.code, data.code))
      .limit(1)

    if (!quiz) return null

    const rows = await db
      .select({
        id: attempts.id,
        playerName: attempts.playerName,
        score: attempts.score,
        total: attempts.total,
        seconds: attempts.seconds,
        createdAt: attempts.createdAt,
      })
      .from(attempts)
      .where(eq(attempts.quizCode, data.code))
      .orderBy(desc(attempts.score), attempts.seconds, desc(attempts.createdAt))
      .limit(50)

    return { quiz, rows }
  })

/** Records a finished play-through so the quiz owner can see class results. */
export const saveAttempt = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    code: string
    playerName: string
    score: number
    total: number
    seconds: number
  }) => ({
    code: String(data.code).toUpperCase().slice(0, 12),
    playerName: trimTo(data.playerName, 40) || 'Bạn ẩn danh',
    score: Math.max(0, Math.floor(Number(data.score) || 0)),
    total: Math.max(1, Math.floor(Number(data.total) || 1)),
    seconds: Math.max(0, Math.min(36000, Math.floor(Number(data.seconds) || 0))),
  }))
  .handler(async ({ data }) => {
    const [quiz] = await db
      .select({ code: quizzes.code })
      .from(quizzes)
      .where(eq(quizzes.code, data.code))
      .limit(1)

    if (!quiz) throw new Error('Không tìm thấy đề này.')

    await db.insert(attempts).values({
      quizCode: data.code,
      playerName: data.playerName,
      score: Math.min(data.score, data.total),
      total: data.total,
      seconds: data.seconds,
    })

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(attempts)
      .where(eq(attempts.quizCode, data.code))

    return { saved: true, totalPlays: count }
  })
