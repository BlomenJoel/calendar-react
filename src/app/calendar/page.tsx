'use server'

import { eq } from 'drizzle-orm'
import { db } from '../../../lib/db'
import { event, goal, role } from '../../../lib/schemas'
import { Calendar } from '../ui/calendar'
import { SideMenu } from '../ui/side-menu'
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation'

type CalendarEvent = typeof event.$inferInsert

export default async function calendar() {
    const session = await getServerSession(authOptions)
    if(!session) {
        redirect("/")
    }
    const calendarEvents = await db.select({
        id: event.id,
        start: event.start,
        end: event.end,
        title: event.title,
        allDay: event.allDay
    }).from(event).orderBy(event.start)

    const roles = await db.select().from(role).where(eq(role.userId, session.user.id))
    const goals = await db.select().from(goal).where(eq(goal.userId, session.user.id))
    const createCalendarEvent = async (newEvent: CalendarEvent) => {
        "use server";
        await db.insert(event).values(newEvent)
    }

    return (<div className='flex flex-row p-4'>
            <SideMenu />
            

        <Calendar 
        calendarEvents={calendarEvents} 
        roles={roles}
        goals={goals}
        createCalendarEvent={createCalendarEvent} 
        />
        </div>
    )
}
