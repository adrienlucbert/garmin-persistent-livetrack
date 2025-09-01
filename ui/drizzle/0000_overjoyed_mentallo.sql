CREATE TYPE "public"."actionn" AS ENUM('recover_password', 'verify_email');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"is_email_verified" boolean DEFAULT false,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_uuid" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "action_tokens" (
	"user_uuid" uuid NOT NULL,
	"token" text NOT NULL,
	"action" "actionn" NOT NULL,
	"expires_at" timestamp with time zone,
	CONSTRAINT "action_tokens_user_uuid_action_unique" UNIQUE("user_uuid","action")
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_uuid_users_id_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_tokens" ADD CONSTRAINT "action_tokens_user_uuid_users_id_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "users" USING btree (lower("email"));