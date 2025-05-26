import { FastifyInstance } from "fastify";
import { prisma } from "../lib";
import { verifyJWT } from "../middleware";
import { agentSchema } from "../schema/agent";

export async function agentRoutes(server: FastifyInstance) {
  server.patch(
    "/agent/:subProfileId",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { subProfileId } = request.params as { subProfileId: string };

      console.log(request.body);

      const parseResult = agentSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          error: "Invalid input",
          details: parseResult.error.flatten(),
        });
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
        profileType,
      } = parseResult.data;

      const user = request.user!;
      let subprofile: any = null;

      if (profileType === "candidate") {
        subprofile = await prisma.candidateProfile.findUnique({
          where: { id: subProfileId },
          include: { profile: true },
        });
      } else {
        subprofile = await prisma.companyProfile.findUnique({
          where: { id: subProfileId },
          include: { profile: true },
        });
      }

      // split into two?
      if (!subprofile || subprofile.profile.userId !== user.id) {
        return reply
          .status(403)
          .send({ error: "Unauthorized to update this profile." });
      }

      const where =
        profileType === "candidate"
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
