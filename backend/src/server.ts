import Fastify from "fastify";
import {
  adminRoutes,
  authRoutes,
  profileRoutes,
  candidateProfileRoutes,
  companyProfileRoutes,
  tokenRoutes,
} from "./routes";
import { loggerOptions, logger } from "./lib";
import { config } from "./config";
import cors from "@fastify/cors";

const server = Fastify({ logger: loggerOptions });

server.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});
server.register(adminRoutes);
server.register(authRoutes);
server.register(tokenRoutes);
server.register(profileRoutes);
server.register(candidateProfileRoutes);
server.register(companyProfileRoutes);

server.addHook("onRequest", async (request) => {
  request.log.info(
    { method: request.method, url: request.url },
    "📥 Incoming request"
  );
});

server.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error }, "❌ Unhandled error occurred");
  reply.status(500).send({ error: "Internal Server Error" });
});

/** Only start listening if not in test environment -
 * Fastify instance is still fully functional in-memory.
 */
if (require.main === module) {
  server.ready().then(() => {
    if (config.isDev) {
      logger.info(`Registered routes: \n${server.printRoutes()}`);
    }

    server.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        logger.error(err, "❌ Server failed to start");
        process.exit(1);
      }
      logger.info({ address }, "🚀 Cvatar backend is running");
    });
  });
}

export { server };
