'use server'

import { eq } from 'drizzle-orm'
import { db } from '../../../lib/db'
import { event, goal, role } from '../../../lib/schemas'
import { SideMenu } from '../ui/side-menu'
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import { authOptions } from '../utils/authOptions'
import { NewCalendar } from '../ui/new-calendar'
import { CalendarEvent } from '../utils/types'

export default async function calendar() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/")
    }
    const calendarEvents = await db.select({
        id: event.id,
        start: event.start,
        end: event.end,
        title: event.title,
        allDay: event.allDay,
        goalId: event.goalId
    }).from(event).orderBy(event.start)

    const roles = await db.select().from(role).where(eq(role.userId, session.user.id))
    const goals = await db.select().from(goal).where(eq(goal.userId, session.user.id))
    const createCalendarEvent = async (newEvent: CalendarEvent) => {
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
