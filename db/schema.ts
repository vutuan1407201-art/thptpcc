import { pgTable, serial, text, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core'

/** A question belonging to a user-created quiz. Stored as JSON on the quiz row. */
export type QuizQuestion = {
  prompt: string
  answers: string[]
  correctIndex: number
}

/** Quizzes created in the "Tạo đề" screen. `code` is the short, shareable link id. */
export const quizzes = pgTable('quizzes', {
  id: serial().primaryKey(),
  code: text().notNull().unique(),
  title: text().notNull(),
  subject: text().notNull().default(''),
  authorName: text('author_name').notNull().default(''),
  questions: jsonb().$type<QuizQuestion[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

/** One finished play-through of a shared quiz, used for the per-quiz scoreboard. */
export const attempts = pgTable(
  'attempts',
  {
    id: serial().primaryKey(),
    quizCode: text('quiz_code')
      .notNull()
      .references(() => quizzes.code),
    playerName: text('player_name').notNull(),
    score: integer().notNull(),
    total: integer().notNull(),
    seconds: integer().notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [index('attempts_quiz_code_idx').on(table.quizCode)],
)
