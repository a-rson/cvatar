import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware";
import { prisma } from "../lib";

export async function meRoutes(server: FastifyInstance) {
  server.get("/me", { preHandler: [verifyJWT] }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.id },
    });

    if (!user) return reply.status(404).send({ error: "User not found" });

    return {
      id: user.id,
      email: user.email,
      type: user.type,
      createdAt: user.createdAt,
    };
  });

  server.get("/me/profiles", { preHandler: [verifyJWT] }, async (request) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: request.user!.id },
      include: { candidate: true, company: true, botPersona: true },
      orderBy: { createdAt: "desc" },
    });

    return profiles.map((p) => ({
      id: p.id,
      name: p.candidate?.name || p.company?.name || "Unnamed",
      createdAt: p.createdAt,
      type: p.candidate ? "Candidate" : p.company ? "Company" : "Unknown",
      hasBotPersona: !!p.botPersona,
    }));
  });

  server.get("/me/tokens", { preHandler: [verifyJWT] }, async (request) => {
    const userId = request.user!.id;

    const tokens = await prisma.token.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: "desc" },
    });

    return tokens.map((t) => ({
      id: t.id,
      name: t.name,
      token: t.token,
      profileId: t.profileId,
      type: t.type,
      used: t.used,
      expiresAt: t.expiresAt,
      createdAt: t.createdAt,
    }));
  });

  server.get(
    "/me/profile/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = request.user!;

      const profile = await prisma.profile.findUnique({
        where: { id },
        include: {
          candidate: {
            include: {
              workExperience: true,
              techStack: true,
              documents: true,
            },
          },
          company: {
            include: {
              techStack: true,
            },
          },
          botPersona: true,
        },
      });

      if (!profile) {
        return reply.status(404).send({ error: "Profile not found." });
      }

      if (profile.userId !== user.id) {
        return reply
          .status(403)
          .send({ error: "Forbidden. You do not own this profile." });
      }

      return reply.send(profile);
    }
  );
}
