import { exit } from 'node:process';
import {
	event, goal, role, users
} from './schemas';
import { db } from './db';
import { getRandomDate } from './utils';

if (process.env.NODE_ENV !== 'development') {
	console.error('SEED CAN NOT RUN AGAINST ANYTHING OTHER THAN DEV!');
	exit(1);
}

// Clear existing
await db.delete(event);
await db.delete(role)
await db.delete(goal)
await db.delete(users);

// Generate entities
type CalendarEvent = typeof event.$inferInsert;
type User = typeof users.$inferInsert;
type Role = typeof role.$inferInsert;
type Goal = typeof goal.$inferInsert;

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

// USER
const newUser: User = {
	id: crypto.randomUUID(),
	email: "blomenjoel@gmail.com",
};

await db.insert(users).values(newUser)

// ROLES
const roles: Role[] = [{ title: "friend", userId: newUser.id! }, { title: "co-worker", userId: newUser.id! }]
await db.insert(role).values(roles)
// ROLES
const goals: Goal[] = [{ title: "be a friend", userId: newUser.id! }, { title: "cooking a meal", userId: newUser.id! }]
await db.insert(goal).values(goals)
