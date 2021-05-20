const path = require("path");

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

  fastify.register(require('fastify-static'), {
    root: path.join(__dirname,'..','uploads'),
    prefix: '/uploads/', // optional: default '/'
    list: true
  })

  fastify.get("/api/main", async (request, reply) => {
     return reply.sendFile('api.html', path.join(__dirname,'..','view'));
  })

  fastify.get("/", async (request, reply) => {
    return reply.sendFile('index.html',path.join(__dirname,'..','client','public'));
  }
  )

}
module.exports = routes;
