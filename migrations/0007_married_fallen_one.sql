ALTER TABLE "role" ADD COLUMN "color" varchar DEFAULT '#000000' NOT NULL;--> statement-breakpoint
ALTER TABLE "goal" DROP COLUMN IF EXISTS "color";