const path = require("path");

const { upload, multer } = require("../config/multer.config");
const fileWorker = require("../controllers/file.controller.js");

const SQL_SaveFromPostgres = require("../controllers/sql_save.js");

async function routes(fastify, options) {
  fastify.register(multer.contentParser);

  fastify.post(
    "/api/file/upload",
    { preHandler: upload.single("avatar") },
    fileWorker.uploadFile
  );

  fastify.get("/api/file/list", fileWorker.listAllFiles);

  fastify.get("/api/file/:id", fileWorker.downloadFile); /// :id - параметр указывается в адресной строке в браузере

  fastify.get("/api/sql_demo", SQL_SaveFromPostgres); /// :id - параметр указывается в адресной строке в браузере

  fastify.get("/api/main", async (request, reply) => {
    reply.type("text/html").send(
      `
        <h1>Save pockemon</h1>
        
        <form method="POST" enctype="multipart/form-data"> 
    
        <input type="text" name="pockemon" placeholder="pockemon name"/>
        <br><br>

        <label for="avatar">Choose file to upload</label>
        <input id="avatar" type="file" name="avatar">
        
        <br><br><br>
        <button formaction="/api/file/upload" type="submit">save to PostgresQL</button>
        <br><br>
        <button formaction="/api/file/save" type="submit">save to File</button>
        
        </form>       
        <a href="/api/sql_demo"><button>Save demo file from Postgres (sql)</button></a>
        
        `
    );
  });

  fastify.post(
    "/api/file/save",
    { preHandler: upload.single("avatar") }, //TODO не загружает файл на диск
    (request, reply) => {
      let dir = path.join(__dirname, "..", "/uploads");

      reply.type("text/html").send(`
        <p>You've saved succesfully saved pokemon "${request.body.pockemon}" to file: ${dir}/${request.file.originalname} </p>
        <a href="/api/main"><button>Back</button></a>
        `);
    }
  );

  fastify.get("/", async (request, reply) => reply.redirect("/api/main"));
}

module.exports = routes;
