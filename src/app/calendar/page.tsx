'use server'

import { db } from '../../../lib/db'
import { event } from '../../../lib/schemas'
import { Calendar } from '../ui/calendar'
import { SideMenu } from '../ui/side-menu'

type CalendarEvent = typeof event.$inferInsert

export default async function calendar() {
    const calendarEvents = await db.select({
        id: event.id,
        start: event.start,
        end: event.end,
        title: event.title,
        allDay: event.allDay
    }).from(event).orderBy(event.start)

    const createCalendarEvent = async (newEvent: CalendarEvent) => {
        "use server";
        await db.insert(event).values(newEvent)
    }

    return (
        <div className='flex flex-row'>
            <SideMenu />
            

        <Calendar 
      calendarEvents={calendarEvents}
        createCalendarEvent={createCalendarEvent} 
        />
        </div>
    )
}
