const path = require("path");
const fs = require("fs");

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

      // create uploads/sql directory

      reply.type("text/html").send(`
        <p>You've saved succesfully saved pokemon "${request.body.pockemon}" to file: ${dir}/${request.file.originalname} </p>
        <a href="/api/main"><button>Back</button></a>
        `);
    }
  );

  fastify.get("/api/file/list", fileWorker.listAllFiles);

  fastify.get("/api/file/:id", fileWorker.downloadFile); /// :id - подставить параметр (номер) в адресной строке в браузере

  fastify.get("/api/sql_demo", SQL_SaveFromPostgres);

  fastify.get("/api/main", async (request, reply) => {
    reply.type("text/html").send(
      `
      <!DOCTYPE html>
      <html>
          <head>
              <meta charset="utf-8">
          </head>
          <body>
          <h1>Save pockemon</h1>
          <a href="/api/file/list">List all files from Postgres</a>
  <br><br>Upload new:
          <form method="POST" enctype="multipart/form-data"> 
      
          <input type="text" name="pockemon" placeholder="pockemon name"/>
          <br><br>
  
          <label for="avatar">Choose file to upload</label>
          <input id="avatar" type="file" name="avatar">
          
          <br><br><br>
          <button formaction="/api/file/upload" type="submit">sync to PostgresQL via Sequelize model</button>
          <br><br>
          <button formaction="/api/file/save" type="submit">save to local /uploads folder</button>
          
          </form>       
          
  
          Download: 
          <br><br>
          Pic number <1>
          
          <a id="ref" href="/api/file/1">Download file by ID from Postgres with Sequelize-model</a>
          
          
  <br><br>
  <a href="/api/sql_demo"><button>Save DEMO file (not yours) from Postgres with sql-query</button></a>
  
          <br><br><br>
          <h3>Задание: </h3>
          <div>
          Сделать UI (input, например radiobutton) для выбора номера картинки, которую загружаем. Решить двумя путями:<br>
          1. Попроще. Через обращение к существующему API-route ("api/file/:id), который получает номер из адреса. Надо просто динамически менять этот номер, 
          в зависимости от выбора UI.
  
          <br>2. Сделать еще одну форму и еще один API-route для получения картинок вида "api/fileById".
          <br>Нужно чтобы route получал все данные как multipart/form-data, пример есть выше в форме для загрузки.
          </div>
          



          </body>
      </html>

       `
    );
  });

  fastify.get("/", async (request, reply) => reply.redirect("/api/main"));
}

module.exports = routes;
