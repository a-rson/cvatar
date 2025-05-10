import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { config } from "../config";

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env");
}
const JWT_SECRET = process.env.JWT_SECRET!;

export async function authRoutes(server: FastifyInstance) {
  server.post("/auth/register", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return reply.status(400).send({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(
      password,
      config.jwtTokenSaltRounds
    );
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return { token };
  });

  server.post("/auth/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.status(401).send({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.status(401).send({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return { token };
  });

  server.get("/me", async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return reply.status(401).send({ error: "Missing token" });

    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (!user) return reply.status(404).send({ error: "User not found" });
      return { id: user.id, email: user.email, createdAt: user.createdAt };
    } catch (err) {
      return reply.status(401).send({ error: "Invalid token" });
    }
  });
}
