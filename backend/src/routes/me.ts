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
      include: { candidate: true, company: true },
      orderBy: { createdAt: "desc" },
    });

    return profiles.map((p) => ({
      id: p.id,
      createdAt: p.createdAt,
      type: p.candidate ? "Candidate" : p.company ? "Company" : "Unknown",
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
      token: t.token,
      profileId: t.profileId,
      type: t.type,
      used: t.used,
      expiresAt: t.expiresAt,
      createdAt: t.createdAt,
    }));
  });
}
