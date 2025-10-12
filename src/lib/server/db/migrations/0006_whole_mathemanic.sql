ALTER TABLE "task" ADD COLUMN "completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN "is_completed";