import { FastifyInstance } from "fastify";
import { prisma } from "../lib";
import { verifyJWT, requireAdmin } from "../middleware";

export async function adminRoutes(server: FastifyInstance) {
  server.get(
    "/admin/users",
    { preHandler: [verifyJWT, requireAdmin] },
    async () => {
      const users = await prisma.user.findMany();
      return users;
    }
  );

  server.get(
    "/admin/users/:id",
    { preHandler: [verifyJWT, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) return reply.status(404).send({ error: "User not found" });
      return user;
    }
  );

  server.delete(
    "/admin/users/:id",
    { preHandler: [verifyJWT, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        await prisma.user.delete({ where: { id } });
        return reply.send({ success: true });
      } catch (err) {
        return reply
          .status(404)
          .send({ error: "User not found or cannot be deleted" });
      }
    }
  );

  server.put(
    "/admin/users/:id",
    { preHandler: [verifyJWT, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const data = request.body as { email?: string; type?: string };

      try {
        const updated = await prisma.user.update({
          where: { id },
          data,
        });
        return updated;
      } catch (err) {
        return reply.status(400).send({ error: "Failed to update user" });
      }
    }
  );

  server.get(
    "/admin/logs/token-access",
    { preHandler: [verifyJWT, requireAdmin] },
    async () => {
      const logs = await prisma.tokenAccessLog.findMany({
        orderBy: { accessedAt: "desc" },
        include: { token: true, user: true, profile: true },
      });
      return logs;
    }
  );
}
