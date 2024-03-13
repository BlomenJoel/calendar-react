ALTER TABLE "event" ADD COLUMN "title" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "start" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "end" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "allDay" boolean NOT NULL;