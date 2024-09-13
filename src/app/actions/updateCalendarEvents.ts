"use server"
import { db } from "../../../lib/db";
import { event, goal } from "../../../lib/schemas";
import { CalendarEvent } from "../utils/types";
import { eq } from "drizzle-orm";

const updateCalendarEvents = async (newEvent: CalendarEvent): Promise<CalendarEvent> => {
    const res = await db.update(event)
        .set(newEvent)
        .where(eq(event.id, newEvent.id!))
        .returning({
            id: event.id,
            start: event.start,
            end: event.end,
            title: event.title,
            completed: event.completed,
            allDay: event.allDay,
            goalId: event.goalId,
        })
    if (res.length === 1) {
        return ({
            ...res[0],
            goalColor: newEvent.goalColor,
            goalTitle: newEvent.goalTitle
        })
    }
    console.error('Updating calendar event succeded, but with invalid result', res)
    throw new Error('Updating calendar event succeded, but with invalid result')
}

export { updateCalendarEvents }