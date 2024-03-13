'use server'

import { db } from '../../../lib/db'
import { event } from '../../../lib/schemas'
import { Calendar } from '../ui/calendar'



export default async function calendar() {
    const calendarEvents = await db.select({
        id: event.id,
        start: event.start,
        end: event.end,
        title: event.title,
        allDay: event.allDay
    }).from(event).orderBy(event.start)

    return (
        <Calendar calendarEvents={calendarEvents} />
    )

}
