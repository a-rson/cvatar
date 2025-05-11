import Fastify from "fastify";
import { userRoutes, profileRoutes, tokenRoutes, authRoutes } from "./routes";
import { loggerOptions, logger } from "./lib";
import { config } from "./config";

const server = Fastify({ logger: loggerOptions });

server.register(userRoutes);
server.register(profileRoutes);
server.register(tokenRoutes);
server.register(authRoutes);

server.addHook("onRequest", async (request) => {
  request.log.info(
    {
      method: request.method,
      url: request.url,
      // ip: request.ip,
      // userId: request.user?.id,
    },
    "📥 Incoming request"
  );
});

server.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error }, "❌ Unhandled error occurred");
  reply.status(500).send({ error: "Internal Server Error" });
});

server.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    logger.error(err, "❌ Server failed to start");
    process.exit(1);
  }
  logger.info(
    {
      env: config.env,
      logLevel: config.logLevel,
      isDev: config.isDev,
      address,
    },
    "🚀 Cvatar backend is running"
  );
});
