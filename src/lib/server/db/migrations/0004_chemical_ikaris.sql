CREATE TABLE "task_group" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text
);
--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "is_important" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "task_group_id" text;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "due_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "task_group" ADD CONSTRAINT "task_group_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_task_group_id_task_group_id_fk" FOREIGN KEY ("task_group_id") REFERENCES "public"."task_group"("id") ON DELETE set null ON UPDATE no action;