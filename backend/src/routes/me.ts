import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware";
import { prisma } from "../lib";

type UpdateCandidateProfileDTO = {
  name: string;
  firstName: string;
  lastName: string;
  description: string;
  maritalStatus: string;
  education: string[];
  spokenLanguages: string[];
  yearsOfExperience: number;
  softSkills: string[];
};

type UpdateCompanyProfileDTO = {
  name: string;
  companyName: string;
  description: string;
  logoUrl?: string;
  services: string[];
  teamSize: number;
  contactEmail: string;
  contactPhone?: string;
};

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
    "/me/subProfiles",
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

      console.log("REQUEST BODY: ", body);

      const candidate = await prisma.candidateProfile.findUnique({
        where: { id },
        include: { profile: true },
      });

      if (candidate) {
        if (candidate.profile.userId !== user.id) {
          return reply.status(403).send({ error: "Unauthorized" });
        }

        const {
          name,
          firstName,
          lastName,
          description,
          maritalStatus,
          education,
          spokenLanguages,
          yearsOfExperience,
          softSkills,
        } = body as UpdateCandidateProfileDTO;

        const updated = await prisma.candidateProfile.update({
          where: { id },
          data: {
            name,
            firstName,
            lastName,
            description,
            maritalStatus,
            education,
            spokenLanguages,
            yearsOfExperience,
            softSkills,
          },
        });

        return reply.send(updated);
      }

      // Try company
      const company = await prisma.companyProfile.findUnique({
        where: { id },
        include: { profile: true },
      });

      if (company) {
        if (company.profile.userId !== user.id) {
          return reply.status(403).send({ error: "Unauthorized" });
        }

        const {
          name,
          companyName,
          description,
          logoUrl,
          services,
          teamSize,
          contactEmail,
          contactPhone,
        } = body as UpdateCompanyProfileDTO;

        const updated = await prisma.companyProfile.update({
          where: { id },
          data: {
            name,
            companyName,
            description,
            logoUrl,
            services,
            teamSize,
            contactEmail,
            contactPhone,
          },
        });

        return reply.send(updated);
      }

      return reply.status(404).send({ error: "Sub-profile not found." });
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

      // Try candidate profile
      const candidate = await prisma.candidateProfile.findUnique({
        where: { id },
        include: {
          workExperience: true,
          techStack: true,
          agent: true,
          profile: {
            include: { documents: true },
          },
        },
      });

      if (candidate && candidate.profile.userId === user.id) {
        return reply.send({
          profileType: "Candidate",
          documents: candidate.profile.documents,
          ...candidate,
        });
      }

      // Try company profile
      const company = await prisma.companyProfile.findUnique({
        where: { id },
        include: {
          techStack: true,
          agent: true,
          profile: {
            include: { documents: true },
          },
        },
      });

      if (company && company.profile.userId === user.id) {
        return reply.send({
          profileType: "Company",
          documents: company.profile.documents,
          ...company,
        });
      }

      return reply
        .status(403)
        .send({ error: "Forbidden. You do not own this profile." });
    }
  );

  server.delete(
    "/me/sub-profile/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = request.user!;

      const candidate = await prisma.candidateProfile.findUnique({
        where: { id },
        include: { profile: true },
      });

      if (candidate && candidate.profile.userId === user.id) {
        await prisma.candidateProfile.delete({ where: { id } });
        return reply.send({ success: true, type: "candidate" });
      }

      const company = await prisma.companyProfile.findUnique({
        where: { id },
        include: { profile: true },
      });

      if (company && company.profile.userId === user.id) {
        await prisma.companyProfile.delete({ where: { id } });
        return reply.send({ success: true, type: "company" });
      }

      return reply.status(403).send({ error: "Forbidden or not found." });
    }
  );
}
