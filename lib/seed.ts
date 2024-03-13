import { exit } from 'node:process';
import {
event
} from './schemas';
import { db, queryClient } from './db';
import { eq } from 'drizzle-orm';

if (process.env.NODE_ENV !== 'development') {
	console.error('SEED CAN NOT RUN AGAINST ANYTHING OTHER THAN DEV!');
	exit(1);
}

// Clear existing
await db.delete(event);

// Generate entities
type CalendarEvent = typeof event.$inferInsert;


const calendarEventsToInsert: CalendarEvent[] = [];

for (let index = 0; index < 500; index++) {
	const uuid = crypto.randomUUID();

	calendarEventsToInsert.push({
		id: uuid,
	});
}

await db.insert(event).values(calendarEventsToInsert);

queryClient.end();
