import { FastifyInstance } from "fastify";
import { prisma } from "../lib";
import { verifyJWT, requireProvider } from "../middleware";
import { candidateProfileSchema } from "../schema";

export async function candidateProfileRoutes(server: FastifyInstance) {
  server.post(
    "/candidate-profile",
    {
      preHandler: [verifyJWT, requireProvider],
    },
    async (request, reply) => {
      const data = await request.parts();

      const fields: Record<string, any> = {};
      let avatarFile: any = null;

      for await (const part of data) {
        if (part.type === "file" && part.fieldname === "avatar") {
          avatarFile = part;
        } else if (part.type === "field") {
          fields[part.fieldname] = part.value;
        }
      }

      // Parse fields like arrays/numbers from strings
      const parsedData = {
        ...fields,
        education: fields.education?.split(",") ?? [],
        spokenLanguages: fields.spokenLanguages?.split(",") ?? [],
        softSkills: fields.softSkills?.split(",") ?? [],
        yearsOfExperience: parseInt(fields.yearsOfExperience),
      };

      const parsed = candidateProfileSchema.safeParse(parsedData);
      if (!parsed.success) {
        return reply
          .status(400)
          .send({ error: "Invalid input", details: parsed.error.flatten() });
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
      } = parsed.data;

      const avatarBuffer = avatarFile ? await avatarFile.toBuffer() : null;

      let avatarUrl: string | null = null;

      if (avatarBuffer) {
        const fileName = `avatar-${Date.now()}.${avatarFile.filename
          .split(".")
          .pop()}`;
        const fs = await import("fs/promises");
        const path = `./public/uploads/${fileName}`;
        await fs.writeFile(path, avatarBuffer);
        avatarUrl = `/uploads/${fileName}`;
      }

      const profile = await prisma.profile.upsert({
        where: { userId: request.user!.id },
        update: {},
        create: { user: { connect: { id: request.user!.id } } },
      });

      const createdCandidate = await prisma.candidateProfile.create({
        data: {
          profileId: profile.id,
          name,
          firstName,
          lastName,
          description,
          maritalStatus,
          education,
          spokenLanguages,
          yearsOfExperience,
          softSkills,
          avatarUrl: avatarUrl || undefined,
        },
      });

      return reply.code(201).send(createdCandidate);
    }
  );
}
