import { FastifyRequest, FastifyReply } from "fastify";
import { JWTUserPayload } from "../types";
import jwt from "jsonwebtoken";

export async function verifyJWT(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTUserPayload;
    req.user = decoded;
  } catch {
    return reply.status(401).send({ error: "Invalid token" });
  }
}

// attach optional version
verifyJWT.optional = async function (request: FastifyRequest) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return;

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTUserPayload;
    request.user = decoded;
  } catch {
    // Ignore silently if token invalid or expired
  }
};
