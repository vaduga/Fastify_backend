// Require the framework and instantiate it
import f from "fastify";
import { routes } from "./routes/router.js";

const fastify = f({
  logger: true,
});

fastify.register(routes);

// Declare a route

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
