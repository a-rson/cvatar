import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({ error: "Invalid or expired token" });
  }
}
