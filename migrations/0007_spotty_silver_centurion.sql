ALTER TABLE "profiles" ADD COLUMN "firstName" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "lastName" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "firstName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "lastName";