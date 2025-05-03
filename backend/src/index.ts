import Fastify from "fastify";

const server = Fastify();

server.get("/", async (request, reply) => {
  return { hello: "cvatar backend 👋" };
});

const start = async () => {
  try {
    await server.listen({ port: 3001, host: "0.0.0.0" });
    console.log("🚀 Server running at http://localhost:3001");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
