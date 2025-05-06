import { FastifyInstance } from "fastify";
import { v4 as uuidv4 } from "uuid";
import redis from "../lib/redis";
import { generateQRCodeUrl } from "../lib/qrcode";
import { config } from "../config";

interface TokenRequest {
  profileId: string;
  expiresIn: number; // sec.
  isOneTime: boolean;
}

export async function tokenRoutes(server: FastifyInstance) {
  server.post("/token", async (request, reply) => {
    const { profileId, expiresIn, isOneTime } = request.body as TokenRequest;

    const token = uuidv4();

    await redis.set(
      `token:${token}`,
      JSON.stringify({ profileId, isOneTime, used: false }),
      "EX",
      expiresIn
    );

    const qrUrl = `${config.baseUrl}/token/${token}`;
    const qrImage = await generateQRCodeUrl(qrUrl);

    return { token, qrUrl, qrImage };
  });
}
