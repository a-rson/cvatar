import { FastifyInstance } from "fastify";
import { prisma } from "../lib";
import { verifyJWT, requireProvider } from "../middleware";
import { companyProfileSchema } from "../schema";

export async function companyProfileRoutes(server: FastifyInstance) {
  server.post(
    "/company-profile",
    { preHandler: [verifyJWT, requireProvider] },
    async (request, reply) => {
      const user = request.user;
      if (!user) {
        return reply.status(500).send({ error: "Internal server error" });
      }

      const parsed = companyProfileSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply
          .status(400)
          .send({ error: "Invalid input", details: parsed.error.flatten() });
      }

      const {
        name,
        companyName,
        description,
        logoUrl,
        services = [],
        techStack = { languages: [], frameworks: [], tools: [] },
        teamSize,
        contactEmail,
        contactPhone,
      } = parsed.data;

      try {
        // 1. Get or create the user's Profile
        const profile = await prisma.profile.upsert({
          where: { userId: user.id },
          update: {},
          create: { user: { connect: { id: user.id } } },
        });

        // 2. Create the company subprofile
        const createdCompany = await prisma.companyProfile.create({
          data: {
            profileId: profile.id,
            name,
            companyName,
            description,
            logoUrl,
            services,
            teamSize,
            contactEmail,
            contactPhone,
            techStack: {
              create: [
                ...techStack.languages.map((name) => ({
                  category: "language",
                  name,
                })),
                ...techStack.frameworks.map((name) => ({
                  category: "framework",
                  name,
                })),
                ...techStack.tools.map((name) => ({
                  category: "tool",
                  name,
                })),
              ],
            },
          },
          include: {
            techStack: true,
          },
        });

        reply.code(201).send(createdCompany);
      } catch (error) {
        console.error("Company profile creation failed:", error);
        reply.code(500).send({ error: "Failed to create company profile." });
      }
    }
  );
}
