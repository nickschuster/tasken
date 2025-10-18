ALTER TABLE "task_group" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "task_group" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;