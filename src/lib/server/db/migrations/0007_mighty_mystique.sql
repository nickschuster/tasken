ALTER TABLE "task_group" ADD COLUMN "color" text DEFAULT '#90EE90';--> statement-breakpoint
ALTER TABLE "task_group" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;