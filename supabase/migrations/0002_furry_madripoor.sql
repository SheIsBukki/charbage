ALTER TABLE "tagsToPostsTable" DROP CONSTRAINT "tagsToPostsTable_postId_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tagsToPostsTable" ADD CONSTRAINT "tagsToPostsTable_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_name_unique" UNIQUE("name");