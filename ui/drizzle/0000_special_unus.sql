CREATE TYPE "public"."actionn" AS ENUM('reset_password', 'verify_email');--> statement-breakpoint
CREATE TABLE "users" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid")
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
CREATE TABLE "password_traits" (
	"user_uuid" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"is_email_verified" boolean DEFAULT false,
	CONSTRAINT "password_traits_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "github_traits" (
	"user_uuid" uuid PRIMARY KEY NOT NULL,
	"user_id" integer,
	"username" text,
	CONSTRAINT "github_traits_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "github_traits_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "google_traits" (
	"user_uuid" uuid PRIMARY KEY NOT NULL,
	"user_id" text,
	"username" text,
	CONSTRAINT "google_traits_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "google_traits_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "live_track_sessions" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"link" text,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "live_track_sessions_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_tokens" ADD CONSTRAINT "action_tokens_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_traits" ADD CONSTRAINT "password_traits_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_traits" ADD CONSTRAINT "github_traits_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "google_traits" ADD CONSTRAINT "google_traits_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_track_sessions" ADD CONSTRAINT "live_track_sessions_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "password_traits" USING btree (lower("email"));