import { FastifyInstance } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { redis, generateQRCodeUrl, prisma } from "../lib";
import { config } from "../config";
import { verifyJWT } from "../middleware";

interface TokenRequest {
  profileId: string;
  name: string,
  expiresIn: number; // sec.
  isOneTime: boolean;
}

export async function tokenRoutes(server: FastifyInstance) {
  server.post("/token", { preHandler: [verifyJWT] }, async (request, reply) => {
    const { profileId, name, expiresIn, isOneTime } = request.body as TokenRequest;
    const tokenValue = uuidv4();
    const userId = request.user!.id;

    // Store in Redis (for session or temp validation)
    await redis.set(
      `token:${tokenValue}`,
      JSON.stringify({ profileId, name, isOneTime, used: false }),
      "EX",
      expiresIn
    );

    // Also store in DB for persistence and listing
    const dbToken = await prisma.token.create({
      data: {
        token: tokenValue,
        profileId,
        name,
        createdById: userId,
        type: isOneTime ? "one-time" : "time-limited",
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        wasStoredInRedis: true,
      },
    });

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
}
