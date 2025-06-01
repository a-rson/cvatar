import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../lib";
import { config } from "../config";
import { registerSchema, loginSchema } from "../schema";
import { createToken } from "../utils";
import { JWTUserPayload } from "../types";

export async function authRoutes(server: FastifyInstance) {
  server.post("/auth/register", async (request, reply) => {
    const validationResult = registerSchema.safeParse(request.body);
    if (!validationResult.success) {
      return reply.status(400).send({
        error: "Invalid input",
        details: validationResult.error.flatten(),
      });
    }
    const { email, password, type } = validationResult.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return reply.status(409).send({ error: "Email already registered" });
    const hashedPassword = await bcrypt.hash(
      password,
      config.jwtTokenSaltRounds
    );
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, type },
    });

    const token = createToken(user as JWTUserPayload);
    return { token };
  });

  server.post("/auth/login", async (request, reply) => {
    const validationResult = loginSchema.safeParse(request.body);
    if (!validationResult.success) {
      return reply.status(400).send({ error: "Invalid input" });
    }
    const { email, password } = validationResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = createToken(user as JWTUserPayload);
    return { token };
  });
}
