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

  fastify.get("/api/main", async (request, reply) => {
    reply.type("text/html").send(
      `
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
        Pic number
        <input id="picInput" placeholder="1">
        <a id="ref" href="/api/file/1">Download file by ID from Postgres with Sequelize-model</a>
        </form>
        
<br><br>
<a href="/api/sql_demo"><button>Save DEMO file (not yours) from Postgres with sql-query</button></a>

        <script>
        let input = document.querySelector("#picInput")
        let ref = document.querySelector("#ref")
        input.onchange = ()=> ref.href = "/api/file/"+input.value

        </script>
        `
    );
  });

  fastify.get("/", async (request, reply) => reply.redirect("/api/main"));
}

module.exports = routes;
