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

  fastify.get("/api/file/list", fileWorker.listAllFiles);

  fastify.get("/api/file/:id", fileWorker.downloadFile); /// :id - подставить параметр (номер) в адресной строке в браузере

  fastify.get("/api/sql_demo", SQL_SaveFromPostgres);

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
        <button formaction="/api/file/upload" type="submit">send to PostgresQL</button>
        <br><br>
        <button formaction="/api/file/save" type="submit">save to /uploads</button>
        
        </form>       
        
        
        <input id="picInput" placeholder="1">
        <a id="ref" href="><button>Download file from Postgres with Sequelize-model</button></a>
        </form>
        
<br><br>
<a href="/api/sql_demo"><button>Save demo file from Postgres with sql-query</button></a>

        <script>
        let input = document.querySelector("#picInput")
        let ref = document.querySelector("#ref")
        input.onchange = ()=> ref.href = "/api/file/"+input.value

        </script>
        `
    );
  });

  fastify.post(
    "/api/file/save",
    { preHandler: disk_upload.single("avatar") },
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
