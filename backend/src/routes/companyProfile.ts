import { FastifyInstance } from "fastify";
import { prisma } from "../lib";
import { verifyJWT, requireProvider } from "../middleware";

export async function companyProfileRoutes(server: FastifyInstance) {
  server.post(
    "/company-profile",
    { preHandler: [verifyJWT, requireProvider] },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        return reply.status(500).send({ error: "Internal server error" });
      }

      const {
        companyName,
        description,
        logoUrl,
        services = [],
        techStack = [],
        teamSize,
        contactEmail,
        contactPhone,
      } = request.body as any;

      const existingProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
        include: {
          company: true,
          candidate: true,
        },
      });

      if (existingProfile?.company) {
        return reply
          .status(400)
          .send({ error: "Company profile already exists." });
      }

      if (existingProfile?.candidate) {
        return reply.status(400).send({
          error: "Cannot create company profile when candidate profile exists.",
        });
      }

      try {
        const createdProfile = await prisma.profile.create({
          data: {
            user: { connect: { id: user.id } },
            company: {
              create: {
                companyName,
                description,
                logoUrl,
                services,
                techStack: {
                  create: techStack.map((name: string) => ({
                    category: "tool",
                    name,
                  })),
                },
                teamSize,
                contactEmail,
                contactPhone,
              },
            },
          },
          include: {
            company: {
              include: {
                techStack: true,
              },
            },
          },
        });

        reply.code(201).send(createdProfile);
      } catch (error) {
        console.error("Company profile creation failed:", error);
        reply.code(500).send({ error: "Failed to create company profile." });
      }
    }
  );
}
