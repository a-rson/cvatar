import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware";
import { prisma } from "../lib";
import {
  updateCandidateProfileSchema,
  updateCompanyProfileSchema,
} from "../schema";
import { getSubProfileById } from "../utils";

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

  server.get(
    "/me/sub-profiles",
    { preHandler: [verifyJWT] },
    async (request) => {
      const subProfiles = await prisma.profile.findMany({
        where: { userId: request.user!.id },
        include: {
          candidateProfiles: { include: { agent: true } },
          companyProfiles: { include: { agent: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return subProfiles.flatMap((profile) => [
        ...profile.candidateProfiles.map((cp) => ({
          id: cp.id,
          name: cp.name,
          createdAt: profile.createdAt,
          type: "Candidate",
          hasAgent: !!cp.agent,
        })),
        ...profile.companyProfiles.map((cp) => ({
          id: cp.id,
          name: cp.name,
          createdAt: profile.createdAt,
          type: "Company",
          hasAgent: !!cp.agent,
        })),
      ]);
    }
  );

  server.patch(
    "/me/sub-profile/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = request.user!;
      const body = request.body;

      const result = await getSubProfileById(id, { includeProfile: true });

      if (!result) {
        return reply.status(404).send({ error: "Sub-profile not found." });
      }

      const { subProfile, type } = result;

      if (subProfile.profile.userId !== user.id) {
        return reply.status(403).send({ error: "Forbidden" });
      }

      if (type === "candidate") {
        const parsed = updateCandidateProfileSchema.safeParse(body);
        if (!parsed.success) {
          return reply
            .status(400)
            .send({ error: "Invalid input", details: parsed.error.flatten() });
        }

        const updated = await prisma.candidateProfile.update({
          where: { id },
          data: parsed.data,
        });

        return reply.send(updated);
      }
      const parsed = updateCompanyProfileSchema.safeParse(body);
      if (!parsed.success) {
        return reply
          .status(400)
          .send({ error: "Invalid input", details: parsed.error.flatten() });
      }

      const updated = await prisma.companyProfile.update({
        where: { id },
        data: parsed.data,
      });

      return reply.send(updated);
    }
  );

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
      candidateProfileId: t.candidateProfileId,
      companyProfileId: t.companyProfileId,
      type: t.type,
      used: t.used,
      expiresAt: t.expiresAt,
      createdAt: t.createdAt,
    }));
  });

  server.get(
    "/me/sub-profile/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = request.user!;

      const result = await getSubProfileById(id, { includeProfile: true });

      if (!result) {
        return reply.status(404).send({ error: "Sub-profile not found." });
      }

      const { subProfile, type } = result;

      if (subProfile.profile.userId !== user.id) {
        return reply.status(403).send({ error: "Forbidden" });
      }

      if (type === "candidate") {
        return reply.send({
          profileType: "Candidate",
          documents: subProfile.profile.documents,
          ...subProfile,
        });
      }
      return reply.send({
        profileType: "Company",
        documents: subProfile.profile.documents,
        ...subProfile,
      });
    }
  );

  server.delete(
    "/me/sub-profile/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = request.user!;

      const result = await getSubProfileById(id, { includeProfile: true });

      if (!result) {
        return reply.status(404).send({ error: "Sub-profile not found." });
      }

      const { subProfile, type } = result;

      if (subProfile.profile.userId !== user.id) {
        return reply.status(403).send({ error: "Forbidden" });
      }

      if (type === "candidate") {
        await prisma.candidateProfile.delete({ where: { id } });
        return reply.send({ success: true, type: "Candidate" });
      }

      await prisma.companyProfile.delete({ where: { id } });
      return reply.send({ success: true, type: "Company" });
    }
  );
}
