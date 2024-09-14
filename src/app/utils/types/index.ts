import { event, goal, role } from '../../../../lib/schemas';

export * from './progressBar'

type Color = {
    color: string | null
}
export type Goal = typeof goal.$inferSelect;
export type GoalWithColor = typeof goal.$inferSelect & Color;
export type Role = typeof role.$inferSelect;
export type CalendarEvent = {
    id: string;
    start: Date;
    end: Date;
    title: string;
    completed: boolean;
    allDay: boolean;
    goalId: string | null;
    goalTitle: string | null;
} & Color

