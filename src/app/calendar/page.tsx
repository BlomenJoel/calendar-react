'use server'

import { eq, or, gte, and, lte } from 'drizzle-orm'
import { db } from '../../../lib/db'
import { event, goal, role } from '../../../lib/schemas'
import { SideMenu } from '../ui/side-menu'
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import { authOptions } from '../utils/authOptions'
import { NewCalendar } from '../ui/new-calendar'

type CreateCalendarEvent = typeof event.$inferInsert

export default async function calendar() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/")
    }

    const now = new Date();

    // Calculate the start of the week (Monday)
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - ((dayOfWeek + 6) % 7)); // Adjust to Monday
    startOfThisWeek.setHours(0, 0, 0, 0); // Set to start of day

    // Calculate the end of the week (Sunday)
    const endOfThisWeek = new Date(startOfThisWeek);
    endOfThisWeek.setDate(startOfThisWeek.getDate() + 6);
    endOfThisWeek.setHours(23, 59, 59, 999); // Set to end of day

    const calendarEvents = await db.select({
        id: event.id,
        start: event.start,
        end: event.end,
        title: event.title,
        allDay: event.allDay,
        goalId: event.goalId,
        goalTitle: goal.title,
    }).from(event)
        .leftJoin(goal, eq(goal.id, event.goalId))
        .orderBy(event.start)
        .where(
            or(
                and(
                    gte(event.start, startOfThisWeek),
                    lte(event.start, endOfThisWeek)
                ),
                and(
                    gte(event.end, startOfThisWeek),
                    lte(event.end, endOfThisWeek)
                )
            )
        )

    const roles = await db.select().from(role).where(eq(role.userId, session.user.id))
    const goals = await db.select().from(goal).where(eq(goal.userId, session.user.id))
    const createCalendarEvent = async (newEvent: CreateCalendarEvent) => {
        "use server";
        await db.insert(event).values(newEvent)
    }

    return (<div className='flex flex-row p-4'>
        <SideMenu />
        <NewCalendar.Table
            calendarEvents={calendarEvents}
            goals={goals}
            createCalendarEvent={createCalendarEvent}
        />
    </div>
    )
}
