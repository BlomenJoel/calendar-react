import { evaluations, event, goal, role, roleScores } from '../../../../lib/schemas';

export * from './progressBar'

type Color = {
    color: string | null
}
export type Goal = typeof goal.$inferSelect;
export type GoalWithColor = typeof goal.$inferSelect & Color;
export type Role = typeof role.$inferSelect;
export type RoleScore = typeof roleScores.$inferSelect;
export type RoleWithScores = Role & { roleScores: RoleScore & { evaluation: typeof evaluations.$inferSelect } }
export type Score = typeof roleScores.$inferSelect;
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

