import Fastify from "fastify";
import { userRoutes, profileRoutes, tokenRoutes, authRoutes } from "./routes";

const server = Fastify({ logger: true });

server.register(userRoutes);
server.register(profileRoutes);
server.register(tokenRoutes);
server.register(authRoutes);

server.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server listening at ${address}`);
});
