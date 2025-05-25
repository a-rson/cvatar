import { FastifyInstance, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { redis, generateQRCodeUrl, prisma } from "../lib";
import { config } from "../config";
import { verifyJWT } from "../middleware";
import { Token } from "@prisma/client";

interface TokenRequest {
  subprofileId: string;
  profileType: "candidate" | "company";
  name: string;
  expiresIn: number; // sec
  isOneTime: boolean;
}

export async function tokenRoutes(server: FastifyInstance) {
  server.post("/token", { preHandler: [verifyJWT] }, async (request, reply) => {
    const { subprofileId, profileType, name, expiresIn, isOneTime } =
      request.body as TokenRequest;

    const tokenValue = uuidv4();
    const userId = request.user!.id;

    // Save to Redis
    await redis.set(
      `token:${tokenValue}`,
      JSON.stringify({
        subprofileId,
        profileType,
        name,
        isOneTime,
        used: false,
      }),
      "EX",
      expiresIn
    );

    // Build data object for Prisma
    const tokenData: any = {
      token: tokenValue,
      name,
      createdById: userId,
      type: isOneTime ? "one_time" : "time_limited",
      expiresAt: new Date(Date.now() + expiresIn * 1000),
      wasStoredInRedis: true,
    };

    if (profileType === "candidate") {
      tokenData.candidateProfileId = subprofileId;
    } else {
      tokenData.companyProfileId = subprofileId;
    }

    const dbToken = await prisma.token.create({ data: tokenData });

    const qrUrl = `${config.baseUrl}/token/${tokenValue}`;
    const qrImage = await generateQRCodeUrl(qrUrl);

    return { token: dbToken.token, qrUrl, qrImage };
  });

  server.delete(
    "/token/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const token = await prisma.token.findUnique({ where: { id } });

      if (!token) {
        return reply.status(404).send({ error: "Token not found" });
      }

      const isOwner = token.createdById === request.user!.id;
      const isAdmin = request.user!.type === "admin";

      if (!isOwner && !isAdmin) {
        return reply.status(403).send({ error: "Forbidden" });
      }

      await prisma.token.delete({ where: { id } });
      return reply.send({ success: true });
    }
  );

  server.post(
    "/token/:id/end",
    { preHandler: [verifyJWT.optional] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const token = await prisma.token.findUnique({ where: { id } });

      if (!token) return reply.status(404).send({ error: "Token not found." });

      const user = request.user;
      const accessToken = request.headers["authorization-token"] as
        | string
        | undefined;

      // Case 1: Authenticated
      if (user) {
        const isCreator = user.id === token.createdById;
        const isAdmin = user.type === "admin";
        if (!isCreator && !isAdmin) {
          return reply
            .status(403)
            .send({ error: "Unauthorized to end this session." });
        }
        return await updateAndSendToken(reply, id, token);
      }

      // Case 2: Anonymous via access token
      if (!accessToken || accessToken !== token.token || token.used) {
        return reply
          .status(403)
          .send({ error: "Unauthorized to end this session." });
      }

      return await updateAndSendToken(reply, id, token);
    }
  );
}

async function updateAndSendToken(
  reply: FastifyReply,
  id: string,
  token: Token
) {
  await prisma.token.update({ where: { id }, data: { used: true } });
  await redis.del(`token:${token.token}`);

  return reply.send({
    success: true,
    message: "Session ended and token invalidated.",
  });
}
