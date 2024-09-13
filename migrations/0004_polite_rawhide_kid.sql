ALTER TABLE "goal" ALTER COLUMN "color" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "completed" boolean DEFAULT false NOT NULL;