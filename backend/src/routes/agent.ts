import { FastifyInstance } from "fastify";
import { prisma } from "../lib";
import { verifyJWT } from "../middleware";
import { agentSchema } from "../schema";
import { getSubProfileById } from "../utils";

export async function agentRoutes(server: FastifyInstance) {
  server.patch(
    "/agent/:subProfileId",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { subProfileId } = request.params as { subProfileId: string };
      const user = request.user!;
      const body = request.body;

      const parseResult = agentSchema.safeParse(body);
      if (!parseResult.success) {
        return reply.status(400).send({
          error: "Invalid input",
          details: parseResult.error.flatten(),
        });
      }

      const { subProfile, type } =
        (await getSubProfileById(subProfileId, {
          include: { profile: true },
        })) ?? {};

      if (!subProfile) {
        return reply.status(404).send({ error: "Sub-profile not found." });
      }

      if (subProfile.profile.userId !== user.id) {
        return reply
          .status(403)
          .send({ error: "Unauthorized to update this profile." });
      }

      const {
        name,
        language,
        style,
        tone,
        answerLength,
        introPrompt,
        disclaimerText,
        customInstructions,
      } = parseResult.data;

      const where =
        type === "candidate"
          ? { candidateProfileId: subProfileId }
          : { companyProfileId: subProfileId };

      const updatedAgent = await prisma.agent.upsert({
        where,
        update: {
          name,
          language,
          style,
          tone,
          answerLength,
          introPrompt,
          disclaimerText,
          customInstructions,
        },
        create: {
          ...where,
          name,
          language,
          style,
          tone,
          answerLength,
          introPrompt,
          disclaimerText,
          customInstructions,
        },
      });

      return reply.send(updatedAgent);
    }
  );
}
