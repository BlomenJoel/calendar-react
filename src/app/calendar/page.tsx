'use server'

import { db } from '../../../lib/db'
import { event } from '../../../lib/schemas'
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import { authOptions } from '../utils/authOptions'
import { NewCalendar } from '../ui/new-calendar'
import { getGoals } from '../actions/getGoals'
import { getProfile } from '../actions/getProfile'

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

    const profile = await getProfile()

    return (<div className='flex flex-row p-4'>
        <div>
            <NewCalendar.TopBar goals={goals} profile={profile} />
            <NewCalendar.Table
                goals={goals}
                createCalendarEvent={createCalendarEvent}
            />
        </div>
    </div>
    )
}
