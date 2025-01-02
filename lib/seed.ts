import { exit } from 'node:process';
import {
	evaluations,
	event, goal, role, roleScores, users
} from './schemas';
import { db } from './db';
import { getRandomDate } from './utils';

if (process.env.NODE_ENV !== 'development') {
	console.error('SEED CAN NOT RUN AGAINST ANYTHING OTHER THAN DEV!');
	exit(1);
}

// Clear existing
// await db.delete(event);
// await db.delete(role)
// await db.delete(roleScores)
// await db.delete(goal)
// await db.delete(users);

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

// await db.insert(event).values(calendarEventsToInsert);

// USER
const newUser: User = {
	id: crypto.randomUUID(),
	email: "blomenjoel@gmail.com",
};

// const user = await db.insert(users).values(newUser).returning({ userId: users.id })

// ROLES

// Define some roles
// const rolesData = [
// 	{
// 		id: crypto.randomUUID(),
// 		userId: 'd9b8d800-a057-4931-8a8c-5bc396b54b87',
// 		title: 'Admin',
// 		description: 'Admin role',
// 		color: '#000000',
// 	},
// 	{
// 		id: crypto.randomUUID(),
// 		userId: 'd9b8d800-a057-4931-8a8c-5bc396b54b87',
// 		title: 'Editor',
// 		description: 'Editor role',
// 		color: '#FF5733',
// 	},
// 	{
// 		id: crypto.randomUUID(),
// 		userId: 'd9b8d800-a057-4931-8a8c-5bc396b54b87',
// 		title: 'Viewer',
// 		description: 'Viewer role',
// 		color: '#33FF57',
// 	},
// ];

// await db.insert(role).values(rolesData).returning({ roleId: role.id })

const rolesIds = [
	{
		id: '2b2dc5a6-c0a5-4e32-a7f2-916e85f94361'
	},
	{
		id: '72c2d525-39ce-491f-9d46-5d97317f83ed'
	},
	{
		id: '99a2a6d8-ab80-4dd5-9c9f-b09627461a61'
	},
	{
		id: 'a2fc7bff-70a9-4861-be39-70891754c50e'
	},
	{
		id: 'b1a722e0-8bff-4e00-9327-16a393530768'
	},
]

const evaluationId1 = crypto.randomUUID()
const evaluationId2 = crypto.randomUUID()

const evaluationss: typeof evaluations.$inferInsert[] = [{
	userId: 'd9b8d800-a057-4931-8a8c-5bc396b54b87',
	id: evaluationId1,
	endTimestamp: new Date(),
	startTimestamp: new Date(new Date().setDate(new Date().getDate() - 14)), // Two weeks ago
},
{
	userId: 'd9b8d800-a057-4931-8a8c-5bc396b54b87',
	id: evaluationId2,
	createdTimestamp: new Date(new Date().setDate(new Date().getDate() - 14)), // Two weeks ago
	endTimestamp: new Date(new Date().setDate(new Date().getDate() - 14)), // Two weeks ago
	startTimestamp: new Date(new Date().setDate(new Date().getDate() - 28)), // Two weeks ago
},
]

await db.insert(evaluations).values(evaluationss)
// Define some scores for each role
const scoresData: typeof roleScores.$inferInsert[] = rolesIds.flatMap((roleData) => [
	{
		evaluationId: evaluationId1,
		id: crypto.randomUUID(),
		roleId: roleData.id,
		desiredScore: Math.floor(Math.random() * 8), // Random score for example
		currentScore: Math.floor(Math.random() * 8),
	},
	{
		evaluationId: evaluationId1,
		id: crypto.randomUUID(),
		roleId: roleData.id,
		desiredScore: Math.floor(Math.random() * 8),
		currentScore: Math.floor(Math.random() * 8),
	},
]);
scoresData.map(async score => {
	await db.insert(roleScores).values(score)
}
)

// Roles with scores
// GOALS
// const goals: Goal[] = [{ title: "be a friend", userId: newUser.id!, description: "some-desc", roleId: insertedIds[0].roleId }, { title: "cooking a meal", userId: newUser.id!, description: "some-desc", roleId: insertedIds[1].roleId }]
// await db.insert(goal).values(goals)
