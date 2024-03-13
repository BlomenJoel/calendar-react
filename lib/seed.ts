import { exit } from 'node:process';
import {
event
} from './schemas';
import { db, queryClient } from './db';
import { getRandomDate } from './utils';

if (process.env.NODE_ENV !== 'development') {
	console.error('SEED CAN NOT RUN AGAINST ANYTHING OTHER THAN DEV!');
	exit(1);
}

// Clear existing
await db.delete(event);

// Generate entities
type CalendarEvent = typeof event.$inferInsert;


const calendarEventsToInsert: CalendarEvent[] = [];

const twoWeeksEarlier = new Date()
twoWeeksEarlier.setDate(twoWeeksEarlier.getDate() - 14)

const twoWeeksLater = new Date()
twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)

for (let index = 0; index < 500; index++) {
	const uuid = crypto.randomUUID();
	const start = getRandomDate(twoWeeksEarlier, twoWeeksLater)
	const end = new Date(start.getTime())
	end.setTime(end.getTime() + 1)

	calendarEventsToInsert.push({
		id: uuid,
		allDay: false,
		end,
		start,
		title: `Generated #${index}`
	});
}

await db.insert(event).values(calendarEventsToInsert);

queryClient.end();
