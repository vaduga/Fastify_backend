// Require the framework and instantiate it

require("dotenv").config();

const fastify = require("fastify")({
  logger: true,
});

// подключаем БД
const db = require("./config/db.config.js");

// синхронизируем Модели с Таблицами БД. force: true сотрет все записи в тех таблицах, к которым мы определили модели)
db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and Resync with { force: true }");
});

// Declare routes

fastify.register(require("./routes/router.js"));

// Run the server!
fastify.listen(process.env.PORT, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
