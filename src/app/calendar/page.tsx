'use server'

import { eq, or, gte, and, lte } from 'drizzle-orm'
import { db } from '../../../lib/db'
import { event, goal, role } from '../../../lib/schemas'
import { SideMenu } from '../ui/side-menu'
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import { authOptions } from '../utils/authOptions'
import { NewCalendar } from '../ui/new-calendar'
import { getGoals } from '../actions/getGoals'

type CreateCalendarEvent = typeof event.$inferInsert

export default async function calendar() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/")
    }

    // const roles = await db.select().from(role).where(eq(role.userId, session.user.id))
    const goals = await getGoals()
    const createCalendarEvent = async (newEvent: CreateCalendarEvent) => {
        "use server";
        await db.insert(event).values(newEvent)
    }

    return (<div className='flex flex-row p-4'>
        <SideMenu />
        <div>
            <NewCalendar.TopBar goals={goals} />
            <NewCalendar.Table
                goals={goals}
                createCalendarEvent={createCalendarEvent}
            />
        </div>
    </div>
    )
}
