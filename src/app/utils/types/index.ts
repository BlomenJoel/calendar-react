import { goal, role } from '../../../../lib/schemas';

export * from './progressBar'

export type Goal = typeof goal.$inferSelect;
export type Role = typeof role.$inferSelect