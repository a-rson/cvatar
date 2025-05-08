import Fastify from "fastify";
import { userRoutes } from "./routes/user";
import { profileRoutes } from "./routes/profile";
import { tokenRoutes } from "./routes/token";

const fastify = Fastify({ logger: true });

fastify.register(userRoutes);
fastify.register(profileRoutes);
fastify.register(tokenRoutes);

fastify.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
