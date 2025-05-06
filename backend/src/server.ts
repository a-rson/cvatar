import Fastify from "fastify";
import { profileRoutes } from "./routes/profile";
import { tokenRoutes } from "./routes/token";

const fastify = Fastify({ logger: true });

fastify.register(profileRoutes);
fastify.register(tokenRoutes);

fastify.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
