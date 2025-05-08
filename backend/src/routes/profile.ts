import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function profileRoutes(server: FastifyInstance) {
  server.post("/candidate-profile", async (request, reply) => {
    const {
      userId,
      firstName,
      lastName,
      description,
      maritalStatus,
      education,
      spokenLanguages,
      yearsOfExperience,
      softSkills,
      avatarUrl,
      workExperience,
      techStack,
    } = request.body as any;

    const createdProfile = await prisma.profile.create({
      data: {
        user: {
          connect: { id: userId },
        },
        candidate: {
          create: {
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
  });

  server.post("/company-profile", async (request, reply) => {
    const {
      userId,
      companyName,
      description,
      logoUrl,
      services,
      techStack,
      teamSize,
      contactEmail,
      contactPhone,
    } = request.body as any;

    try {
      const createdProfile = await prisma.profile.create({
        data: {
          user: {
            connect: { id: userId },
          },
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
  });

  server.get("/profile/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

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
        company: true,
        botPersona: true,
        tokens: true,
      },
    });

    if (!profile) {
      return reply.status(404).send({ error: "Profile not found" });
    }

    reply.send(profile);
  });

  server.delete("/profile/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const deletedProfile = await prisma.profile.delete({
        where: { id },
      });

      reply.code(200).send({
        message: "Profile deleted successfully.",
        profile: deletedProfile,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        reply.code(404).send({ error: "Profile not found." });
      } else {
        console.error(error);
        reply.code(500).send({ error: "Internal server error." });
      }
    }
  });
}
