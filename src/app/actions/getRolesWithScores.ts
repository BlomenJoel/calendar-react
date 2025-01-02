"use server"
import { getServerSession } from "next-auth";
import { db } from "../../../lib/db";
import { evaluations, role, roleScores } from "../../../lib/schemas";
import { authOptions } from "../utils/authOptions";
import { Role, RoleWithScores } from "../utils/types";
import { eq } from "drizzle-orm";
const getRolesWithScores = async (evaluationId: string): Promise<RoleWithScores[]> => {
    const session = await getServerSession(authOptions);
    if (!session) {
        console.warn("Missing session when getting roles with scores", session);
        return [];
    }
    const rolesWithScores = await db
        .select({
            role,
            roleScores,
            evaluation: evaluations,
        })
        .from(role)
        .where(eq(evaluations.id, evaluationId))
        .leftJoin(roleScores, eq(role.id, roleScores.roleId))
        .leftJoin(evaluations, eq(roleScores.evaluationId, evaluations.id));


    return rolesWithScores.map(roleWithScores => ({
        ...roleWithScores.role,
        roleScores: { evaluation: roleWithScores.evaluation, ...roleWithScores.roleScores } as any // Return only the first roleScore
    }));
};



export { getRolesWithScores }