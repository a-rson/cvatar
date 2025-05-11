import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../lib";
import { config } from "../config";
import { verifyJWT } from "../middleware";
import { credentialsSchema } from "../schema";
import { createToken } from "../utils";

export async function authRoutes(server: FastifyInstance) {
  server.post("/auth/register", async (request, reply) => {
    const validationResult = credentialsSchema.safeParse(request.body);
    if (!validationResult.success) {
      return reply.status(400).send({ error: "Invalid input" });
    }
    const { email, password } = validationResult.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return reply.status(409).send({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(
      password,
      config.jwtTokenSaltRounds
    );
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = createToken(user);
    return { token };
  });

  server.post("/auth/login", async (request, reply) => {
    const validationResult = credentialsSchema.safeParse(request.body);
    if (!validationResult.success) {
      return reply.status(400).send({ error: "Invalid input" });
    }
    const { email, password } = validationResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = createToken(user);
    return { token };
  });

  server.get("/me", { preHandler: verifyJWT }, async (request, reply) => {
    // once through verifyJWT middleware, extracted data about 'some' user is available in request object
    const user = await prisma.user.findUnique({
      // verifyJWT guarantees request.user exists
      where: { id: request.user!.id },
    });

    if (!user) return reply.status(404).send({ error: "User not found" });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  });
}
