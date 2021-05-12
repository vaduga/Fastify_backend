const path = require("path");

const { upload, multer } = require("../config/multer.config");
const fileWorker = require("../controllers/file.controller.js");

async function routes(fastify, options) {
  fastify.register(multer.contentParser);

  fastify.post(
    "/api/file/upload",
    { preHandler: upload.single("file") },
    fileWorker.uploadFile
  );

  fastify.get("/api/file/list", fileWorker.listAllFiles);

  fastify.get("/api/file/:id", fileWorker.downloadFile); /// :id - параметр указывается в адресной строке в браузере

  fastify.get("/client/read", async (request, reply) => {
    reply.type("text/html").send(
      `
        <h1>Save pockemon</h1>
        
        <form method="POST" enctype="multipart/form-data"> 
    
        <input type="text" name="name" placeholder="pockemon name"/>
        <br><br>

        <label for="file">Choose file to upload</label>
        <input id="file" type="file" name="avatar">
        
        <br><br><br>
        <button formaction="/client/saveToPG" type="submit">save to PostgresQL</button>
        <br><br>
        <button formaction="/client/saveToFile" type="submit">save to File</button>
        
        </form>       
        `
    );
  });

  fastify.post(
    "/client/saveToFile",
    { preHandler: upload.single("avatar") },
    (request, reply) => {
      let dir = path.join(__dirname, "/uploads");

      reply.type("text/html").send(`
        <p>You've succesfully saved pokemon "${request.body.name}" to file: ${dir}/${request.file.originalname} </p>
        <a href="/client/read"><button>Back</button></a>
        `);
    }
  );

  fastify.post(
    "/client/saveToPG",
    { preHandler: upload.single("avatar") },
    async (request, reply) => {
      const SQL_SaveFromPostgres = require("../controllers/sql_save.js");

      reply.type("text/html").send(`
        <p>You've sent ${request.body.name} to PostgresQL database!</p>
        <a href="/client/read"><button>Back</button></a>

        <button onclick=${SQL_SaveFromPostgres()}>Demo save from Postgres with Sequelize</button></a>
        `);
    }
  );

  //${SaveFromSequelize}

  fastify.get("/", async (request, reply) => reply.redirect("/client/read"));
}

module.exports = routes;
