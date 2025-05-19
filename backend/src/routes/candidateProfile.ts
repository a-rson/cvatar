import { FastifyInstance } from "fastify";
import { prisma } from "../lib";
import { verifyJWT, requireProvider } from "../middleware";

export async function candidateProfileRoutes(server: FastifyInstance) {
  server.post(
    "/candidate-profile",
    { preHandler: [verifyJWT, requireProvider] },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        return reply.status(500).send({ error: "Internal server error" });
      }

      // const existingProfile = await prisma.profile.findFirst({
      //   where: { userId: user.id },
      //   include: {
      //     candidate: true,
      //     company: true,
      //   },
      // });

      // if (existingProfile?.candidate) {
      //   return reply
      //     .status(400)
      //     .send({ error: "Candidate profile already exists." });
      // }

      // if (existingProfile?.company) {
      //   return reply.status(400).send({
      //     error: "Cannot create candidate profile when company profile exists.",
      //   });
      // }

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
        avatarUrl,
        workExperience = [],
        techStack = { languages: [], frameworks: [], tools: [] },
      } = request.body as any;

      const createdProfile = await prisma.profile.create({
        data: {
          user: { connect: { id: user.id } },
          candidate: {
            create: {
              name,
              firstName,
              lastName,
              description,
              maritalStatus,
              education,
              spokenLanguages,
              yearsOfExperience,
              softSkills,
              avatarUrl,
              workExperience: {
                create: workExperience.map((item: any) => ({
                  position: item.position,
                  company: item.company,
                  years: item.years,
                })),
              },
              techStack: {
                create: [
                  ...techStack.languages.map((name: string) => ({
                    category: "language",
                    name,
                  })),
                  ...techStack.frameworks.map((name: string) => ({
                    category: "framework",
                    name,
                  })),
                  ...techStack.tools.map((name: string) => ({
                    category: "tool",
                    name,
                  })),
                ],
              },
            },
          },
        },
        include: {
          candidate: {
            include: {
              workExperience: true,
              techStack: true,
            },
          },
        },
      });

      reply.code(201).send(createdProfile);
    }
  );
}
