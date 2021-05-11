const qs = require("qs");
const path = require("path");
const SaveFromSequelize = require("../controllers/seq_save.js");

const multer = require("fastify-multer");

const upload = multer({ dest: "./uploads" });

async function routes(fastify, options) {
  fastify.register(multer.contentParser);

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
      let dir = path.join(__dirname, "..", "/uploads");

      reply.type("text/html").send(`
        <p>You've succesfully saved pokemon "${request.body.name}" to file: ${dir}/${request.file.filename} </p>
        <a href="/client/read"><button>Back</button></a>
        `);
    }
  );

  fastify.post(
    "/client/saveToPG",
    { preHandler: upload.single("avatar") },
    async (request, reply) => {
      reply.type("text/html").send(`
        <p>You've sent ${request.body.name} to PostgresQL database!</p>
        <a href="/client/read"><button>Back</button></a>

        <button onclick=${SaveFromSequelize()}>Demo save from Postgres with Sequelize</button></a>
        `);
    }
  );

  //${SaveFromSequelize}

  fastify.get("/", async (request, reply) => reply.redirect("/client/read"));
}

module.exports = routes;
