import { FastifyRequest, FastifyReply } from "fastify";

export function requireRole(...allowedRoles: string[]) {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user;

    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.type)) {
      return res
        .status(403)
        .send({ error: `Forbidden for role: ${user.type}` });
    }
  };
}

export const requireProvider = requireRole("provider");
export const requireAdmin = requireRole("admin");
export const requireClient = requireRole("client");
