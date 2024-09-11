import { event, goal, role } from '../../../../lib/schemas';

export * from './progressBar'

export type Goal = typeof goal.$inferSelect;
export type Role = typeof role.$inferSelect;
export type CalendarEvent = {
    id: string;
    start: Date;
    end: Date;
    title: string;
    allDay: boolean;
    goalId: string | null;
    goalTitle: string | null;
    goalColor: string | null
}

