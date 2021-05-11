// Require the framework and instantiate it

require("dotenv").config();

const fastify = require("fastify")({
  logger: true,
});

const routes = require("./routes/router.js");

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
