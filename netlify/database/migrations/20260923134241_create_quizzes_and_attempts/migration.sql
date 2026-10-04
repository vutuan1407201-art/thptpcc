CREATE TABLE "attempts" (
	"id" serial PRIMARY KEY,
	"quiz_code" text NOT NULL,
	"player_name" text NOT NULL,
	"score" integer NOT NULL,
	"total" integer NOT NULL,
	"seconds" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" serial PRIMARY KEY,
	"code" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"subject" text DEFAULT '' NOT NULL,
	"author_name" text DEFAULT '' NOT NULL,
	"questions" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "attempts_quiz_code_idx" ON "attempts" ("quiz_code");--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_quiz_code_quizzes_code_fkey" FOREIGN KEY ("quiz_code") REFERENCES "quizzes"("code");