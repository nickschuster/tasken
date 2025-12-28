ALTER TABLE "task" ADD COLUMN "repeat_unit" text;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "repeat_interval" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "repeat_days" text;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "repeat_time" text;--> statement-breakpoint
