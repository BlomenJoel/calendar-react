ALTER TABLE "role" DROP CONSTRAINT "role_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "goal" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "goal" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "goal" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "goal" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "role" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role" ADD CONSTRAINT "role_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
