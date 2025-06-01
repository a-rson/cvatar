import { FastifyInstance } from "fastify";
import { prisma } from "../lib";
import { verifyJWT } from "../middleware";

export async function documentRoutes(server: FastifyInstance) {
  // Manual document creation - provided title and content instead of document upload
  server.post(
    "/document",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const userId = request.user!.id;
      const { title, content } = request.body as {
        title: string;
        content: string;
      };

      const profile = await prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return reply.status(404).send({ error: "Profile not found" });
      }

      const doc = await prisma.document.create({
        data: {
          title,
          content,
          profileId: profile.id,
        },
      });

      return reply.code(201).send(doc);
    }
  );

  // Document upload - pdf only
  server.post(
    "/document/upload",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const userId = request.user!.id;
      const data = await request.file();
      if (!data) return reply.status(400).send({ error: "No file uploaded." });

      const buffer = await data.toBuffer();
      const content = buffer.toString("utf-8");
      const title = data.filename;

      const profile = await prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return reply.status(404).send({ error: "Profile not found" });
      }

      const doc = await prisma.document.create({
        data: {
          title,
          content,
          profileId: profile.id,
        },
      });

      return reply.code(201).send(doc);
    }
  );

  server.delete(
    "/document/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const userId = request.user!.id;

      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          profile: { select: { userId: true } },
        },
      });

      if (!document) {
        return reply.status(404).send({ error: "Document not found" });
      }

      if (document.profile.userId !== userId) {
        return reply.status(403).send({ error: "Forbidden" });
      }

      await prisma.document.delete({ where: { id } });

      return reply.send({ success: true });
    }
  );
}
