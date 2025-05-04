import Fastify from "fastify";
import { profileRoutes } from "./routes/profile";

const fastify = Fastify({ logger: true });

fastify.register(profileRoutes);

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
