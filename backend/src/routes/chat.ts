import { FastifyInstance } from "fastify";
import { redis, prisma } from "../lib";
import { verifyJWT } from "../middleware";
import { buildPrompt } from "../utils";
import { OpenAI } from "openai";
import { getSubProfileById } from "../utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function chatRoutes(server: FastifyInstance) {
  server.post(
    "/chat/:subProfileId",
    { preHandler: [verifyJWT.optional] },
    async (request, reply) => {
      const subProfileId = (request.params as any).subProfileId;
      const profileType = (request.query as any).profileType as
        | "candidate"
        | "company";
      const { message } = request.body as { message: string };

      if (!profileType || !["candidate", "company"].includes(profileType)) {
        return reply
          .status(400)
          .send({ error: "Missing or invalid profile type." });
      }

      if (!message) {
        return reply.status(400).send({ error: "Message is required." });
      }
      const user = request.user;
      const tokenHeader = request.headers["authorization-token"] as
        | string
        | undefined;

      const getSubProfileResult = await getSubProfileById(
        subProfileId,
        profileType,
        {
          includeProfile: true,
        }
      );

      if (!getSubProfileResult) {
        return reply.status(404).send({ error: "Sub-profile not found." });
      }

      const { subProfile } = getSubProfileResult;

      if (!subProfile) {
        return reply.status(404).send({ error: "Sub-profile not found." });
      }

      if (!subProfile.agent) {
        return reply
          .status(400)
          .send({ error: "Agent not configured for this sub-profile." });
      }

      const isOwner = user && subProfile.profile.userId === user.id;

      if (!isOwner) {
        if (!tokenHeader) {
          return reply.status(403).send({ error: "Token required." });
        }

        const redisEntry = await redis.get(`token:${tokenHeader}`);
        if (!redisEntry) {
          return reply.status(403).send({ error: "Token invalid or expired." });
        }

        const token = await prisma.token.findUnique({
          where: { token: tokenHeader },
        });

        const validTarget =
          token &&
          !token.used &&
          ((profileType === "candidate" &&
            token.candidateProfileId === subProfileId) ||
            (profileType === "company" &&
              token.companyProfileId === subProfileId));

        if (!validTarget) {
          return reply.status(403).send({ error: "Invalid token." });
        }

        if (token.type === "one_time") {
          await prisma.token.update({
            where: { id: token.id },
            data: { used: true },
          });
        }

        await prisma.tokenAccessLog.create({
          data: {
            tokenId: token.id,
            userId: user?.id,
            candidateProfileId: token.candidateProfileId ?? undefined,
            companyProfileId: token.companyProfileId ?? undefined,
          },
        });
      }

      const prompt = buildPrompt(subProfile, subProfile.agent);

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: message },
        ],
      });

      const agentReply =
        chatCompletion.choices[0].message?.content || "No response generated.";

      await prisma.chatLog.createMany({
        data: [
          {
            agentId: subProfile.agent.id,
            message,
            sender: isOwner ? "provider" : "client",
          },
          {
            agentId: subProfile.agent.id,
            message: agentReply,
            sender: "agent",
          },
        ],
      });

      return reply.send({ response: agentReply });
    }
  );
}
