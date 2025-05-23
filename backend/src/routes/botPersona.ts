import { FastifyInstance } from "fastify";
import { prisma, logger } from "../lib";
import { verifyJWT, requireProvider } from "../middleware";

export async function botPersonaRoutes(server: FastifyInstance) {
  server.patch(
    "/bot-persona/:profileId",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      console.log('got to this route')
      const { profileId } = request.params as { profileId: string };
      const { language, style, introPrompt } = request.body as {
        language: string;
        style: string;
        introPrompt: string;
      };

      const user = request.user!;
      const profile = await prisma.profile.findUnique({
        where: { id: profileId },
      });

      if (!profile || profile.userId !== user.id) {
        return reply
          .status(403)
          .send({ error: "Unauthorized to update this profile." });
      }

      const updatedPersona = await prisma.botPersona.upsert({
        where: { profileId },
        update: { language, style, introPrompt },
        create: {
          profileId,
          language,
          style,
          introPrompt,
        },
      });

      return reply.send(updatedPersona);
    }
  );
}
