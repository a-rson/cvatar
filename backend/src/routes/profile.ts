import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function profileRoutes(server: FastifyInstance) {
  server.post("/profile", async (request, reply) => {
    const {
      userId,
      firstName,
      lastName,
      maritalStatus,
      education,
      spokenLanguages,
      yearsOfExperience,
      softSkills,
      avatarUrl,
      workExperience,
      techStack,
    } = request.body as any;

    const createdProfile = await prisma.candidateProfile.create({
      data: {
        userId,
        firstName,
        lastName,
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
      include: {
        workExperience: true,
        techStack: true,
      },
    });

    reply.send(createdProfile);
  });

  server.get("/profile/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const profile = await prisma.candidateProfile.findUnique({
      where: { id },
      include: {
        workExperience: true,
        techStack: true,
        documents: true,
      },
    });

    if (!profile) {
      return reply.status(404).send({ error: "Profile not found" });
    }

    reply.send(profile);
  });
}
