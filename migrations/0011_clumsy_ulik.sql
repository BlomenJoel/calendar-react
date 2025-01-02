CREATE TABLE IF NOT EXISTS "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "role_scores" DROP CONSTRAINT "role_scores_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "role_scores" ADD COLUMN "evaluationId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_scores" ADD CONSTRAINT "role_scores_evaluationId_evaluations_id_fk" FOREIGN KEY ("evaluationId") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "role_scores" DROP COLUMN IF EXISTS "endTimestamp";--> statement-breakpoint
ALTER TABLE "role_scores" DROP COLUMN IF EXISTS "startTimestamp";--> statement-breakpoint
ALTER TABLE "role_scores" DROP COLUMN IF EXISTS "userId";