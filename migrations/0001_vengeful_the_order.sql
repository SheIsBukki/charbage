ALTER TABLE "posts" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "updatedAt" timestamp (3) DEFAULT now();