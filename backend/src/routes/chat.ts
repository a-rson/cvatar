import { FastifyInstance } from "fastify";
import { redis, prisma } from "../lib";
import { verifyJWT } from "../middleware";
import { buildPrompt } from "../utils";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function chatRoutes(server: FastifyInstance) {
  // Chat interaction
  server.post(
    "/chat/:profileId",
    { preHandler: [verifyJWT.optional] },
    async (request, reply) => {
      const { profileId } = request.params as { profileId: string };
      const { message } = request.body as { message: string };
      const user = request.user;
      const tokenHeader = request.headers["authorization-token"] as
        | string
        | undefined;

      if (!message)
        return reply.status(400).send({ error: "Message is required." });

      const profile = await prisma.profile.findUnique({
        where: { id: profileId },
        include: {
          candidate: {
            include: { workExperience: true, techStack: true, documents: true },
          },
          company: {
            include: { techStack: true },
          },
          botPersona: true,
        },
      });

      if (!profile)
        return reply.status(404).send({ error: "Profile not found." });

      const isOwner = user && profile.userId === user.id;

      // Token-based access (for client)
      let token;
      if (!isOwner) {
        if (!tokenHeader)
          return reply.status(403).send({ error: "Token required." });

        const redisEntry = await redis.get(`token:${tokenHeader}`);
        if (!redisEntry)
          return reply.status(403).send({ error: "Token invalid or expired." });

        token = await prisma.token.findUnique({
          where: { token: tokenHeader },
        });
        if (!token || token.profileId !== profileId || token.used) {
          return reply.status(403).send({ error: "Invalid token." });
        }
      }

      const persona = profile.botPersona;
      const prompt = buildPrompt(profile, persona);

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: message },
        ],
      });

      const botReply =
        chatCompletion.choices[0].message?.content || "No response generated.";

      // Log messages to ChatLog
      await prisma.chatLog.create({
        data: {
          botPersonaId: persona!.id,
          message,
          sender: isOwner ? "provider" : "client",
        },
      });

      await prisma.chatLog.create({
        data: {
          botPersonaId: persona!.id,
          message: botReply,
          sender: "bot",
        },
      });

      return reply.send({ response: botReply });
    }
  );
}
