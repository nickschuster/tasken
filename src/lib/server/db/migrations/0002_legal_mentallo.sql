CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"token_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	CONSTRAINT "verification_token_hash_unique" UNIQUE("token_hash")
);
