"use server"
import { db } from "../../../lib/db";
import { event, goal } from "../../../lib/schemas";
import { CalendarEvent } from "../utils/types";
import { and, eq, gte, lte, or } from "drizzle-orm";

type Props = {
    startOfWeek: Date
    endOfWeek: Date
}
const getCalendarEvents = async ({ startOfWeek, endOfWeek }: Props): Promise<CalendarEvent[]> => await db.select({
    id: event.id,
    start: event.start,
    end: event.end,
    title: event.title,
    allDay: event.allDay,
    goalId: event.goalId,
    goalTitle: goal.title,
    completed: event.completed,
    goalColor: goal.color
}).from(event)
    .leftJoin(goal, eq(goal.id, event.goalId))
    .orderBy(event.start)
    .where(
        or(
            and(
                gte(event.start, startOfWeek),
                lte(event.start, endOfWeek)
            ),
            and(
                gte(event.end, startOfWeek),
                lte(event.end, endOfWeek)
            )
        )
    )


export { getCalendarEvents }