import { FastifyInstance } from "fastify";
import { prisma, logger } from "../lib";
import { verifyJWT } from "../middleware";

export async function profileRoutes(server: FastifyInstance) {
  server.get(
    "/profile/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = request.user!;

      const profile = await prisma.profile.findUnique({
        where: { id },
        include: {
          candidateProfiles: true,
          companyProfiles: true,
        },
      });

      if (!profile)
        return reply.status(404).send({ error: "Profile not found." });

      if (profile.userId !== user.id && user.type !== "admin") {
        return reply
          .status(403)
          .send({ error: "Forbidden: not your profile." });
      }

      return reply.send(profile);
    }
  );

  server.delete(
    "/profile/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = request.user!;

      const profile = await prisma.profile.findUnique({ where: { id } });

      if (!profile)
        return reply.status(404).send({ error: "Profile not found." });

      if (profile.userId !== user.id && user.type !== "admin") {
        return reply
          .status(403)
          .send({ error: "Forbidden: not your profile." });
      }

      await prisma.profile.delete({ where: { id } });

      return reply.send({ message: "Profile deleted." });
    }
  );
}
