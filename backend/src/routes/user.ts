import { FastifyInstance } from "fastify";
import { prisma } from "../lib";
import bcrypt from "bcryptjs";

export async function userRoutes(server: FastifyInstance) {
  server.post("/user", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      reply.code(201).send(user);
    } catch (error: any) {
      if (error.code === "P2002") {
        return reply.status(409).send({ error: "Email already in use." });
      }

      console.error(error);
      reply.status(500).send({ error: "Internal server error." });
    }
  });
}
