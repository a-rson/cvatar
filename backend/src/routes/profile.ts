import { FastifyInstance } from "fastify";
import { prisma, logger } from "../lib";
import { verifyJWT, requireProvider } from "../middleware";

export async function profileRoutes(server: FastifyInstance) {
  server.get(
    "/profile/:id",
    { preHandler: [verifyJWT.optional] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = request.user; // may be undefined
      const tokenValue = request.headers["authorization-token"] as
        | string
        | undefined;

      const profile = await prisma.profile.findUnique({
        where: { id },
        include: {
          candidate: {
            include: { workExperience: true, techStack: true, documents: true },
          },
          company: { include: { techStack: true } },
          botPersona: true,
        },
      });

      if (!profile)
        return reply.status(404).send({ error: "Profile not found." });

      // Case 1: Admin
      if (user?.type === "admin") return reply.send(profile);

      // Case 2: Owner
      if (user && profile.userId === user.id) return reply.send(profile);

      // Case 3: Token
      if (tokenValue) {
        const token = await prisma.token.findUnique({
          where: { token: tokenValue },
          include: { profile: true },
        });

        if (token && token.profileId === id && !token.used) {
          // Optionally: mark token as used if it's one-time
          if (token.type === "one-time") {
            await prisma.token.update({
              where: { id: token.id },
              data: { used: true },
            });
          }

          // Log the access
          await prisma.tokenAccessLog.create({
            data: {
              tokenId: token.id,
              userId: user?.id,
              profileId: id,
            },
          });

          return reply.send(profile);
        }
      }

      return reply
        .status(403)
        .send({ error: "Access denied. Valid token or ownership required." });
    }
  );

  // DELETE /profile/:id
  server.delete(
    "/profile/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = request.user;

      if (!user) {
        logger.error(
          "JWT verified but request.user is undefined — should not happen."
        );
        return reply.status(500).send({ error: "Internal server error." });
      }

      const profile = await prisma.profile.findUnique({ where: { id } });

      if (!profile)
        return reply.status(404).send({ error: "Profile not found." });

      if (profile.userId !== user.id && user.type !== "admin") {
        return reply
          .status(403)
          .send({ error: "Forbidden: not your profile." });
      }

      if (profile.userId !== user.id && user.type !== "admin") {
        return reply
          .status(403)
          .send({ error: "Forbidden: not your profile." });
      }

      await prisma.profile.delete({ where: { id } });

      reply.send({ message: "Profile deleted." });
    }
  );
}
