CREATE TABLE IF NOT EXISTS "role_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roleId" uuid NOT NULL,
	"desiredScore" integer NOT NULL,
	"currentScore" integer NOT NULL,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_scores" ADD CONSTRAINT "role_scores_roleId_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
