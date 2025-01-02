ALTER TABLE "role_scores" RENAME COLUMN "timestamp" TO "startTimestamp";--> statement-breakpoint
ALTER TABLE "role_scores" ADD COLUMN "endTimestamp" timestamp NOT NULL;