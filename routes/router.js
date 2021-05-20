const path = require("path");
const fastifyStatic = require("fastify-static");

const {
  disk_upload,
  memory_upload,
  multer,
} = require("../config/multer.config");

const fileWorker = require("../controllers/file.controller.js");
const SQL_SaveFromPostgres = require("../controllers/sql_save.js");

async function routes(fastify, options) {
  fastify.register(multer.contentParser);

  fastify.post(
    "/api/file/upload",
    { preHandler: memory_upload.single("avatar") },
    fileWorker.uploadToDB
  );

  fastify.post(
    "/api/file/save",
    { preHandler: disk_upload.single("avatar") },
    (request, reply) => {
      let dir = path.join(__dirname, "..", "/uploads");

      reply.type("text/html").send(`
        <p>You've saved succesfully saved pokemon "${request.body.pockemon}" to file: ${dir}/${reply.request.file.filename} </p>
        <a href="/api/main"><button>Back</button></a>
        `);
    }
  );

  fastify.get("/api/file/list", fileWorker.listAllFiles);

  fastify.get("/api/file/:id", fileWorker.downloadFile); /// :id - подставить параметр (номер) в адресной строке в браузере

  fastify.get("/api/sql_demo", SQL_SaveFromPostgres);

  // first static plugin
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "..", "client", "build"),
    prefix: "/client/build/", // optional: default '/'
    list: true,
    index: false, // prevent index.html autoload
  });

  // second static plugin
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "..", "uploads"),
    prefix: "/uploads/",
    decorateReply: false, // the reply decorator has been added by the first plugin registration
    list: true,
    index: false,
  });

  fastify.get("/api/main", async (request, reply) => {
    return reply.sendFile("api.html", path.join(__dirname, "..", "view"));
  });

  fastify.get("/", async (request, reply) => {
    return reply.sendFile(
      "index.html",
      path.join(__dirname, "..", "client", "build")
    );
  });
}
module.exports = routes;
