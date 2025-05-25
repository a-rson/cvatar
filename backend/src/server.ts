import Fastify from "fastify";
import {
  adminRoutes,
  authRoutes,
  profileRoutes,
  candidateProfileRoutes,
  companyProfileRoutes,
  tokenRoutes,
  meRoutes,
  agentRoutes,
  chatRoutes,
} from "./routes";
import { loggerOptions, logger } from "./lib";
import { config } from "./config";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";

const server = Fastify({ logger: loggerOptions });

server.register(fastifyMultipart, {
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

server.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://172.18.0.5:5173",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

server.register(meRoutes);
server.register(authRoutes);
server.register(adminRoutes);
server.register(tokenRoutes);
server.register(profileRoutes);
server.register(chatRoutes);
server.register(agentRoutes);
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
