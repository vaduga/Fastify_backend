import qs from "qs";
import { SaveFromSequelize } from "../controllers/seq_save.js";

import multer from "fastify-multer";
const upload = multer({ dest: "./uploads" });

async function routes(fastify, options) {
  fastify.register(multer.contentParser);

  fastify.get("/client/read", async (request, reply) => {
    reply.type("text/html").send(
      `
    
        <h1>Read</h1>
        <form action="/client/write" method="POST" enctype="multipart/form-data"> 
    
        <input type="text" name="name"/>
        <input type="file" name="avatar"/>
        <input type="submit"/>
        
        </form>
        
        
        `
    );
  });

  fastify.post(
    "/client/write",
    { preHandler: upload.single("avatar") },
    (request, reply) => {
      console.dir(request.file);

      console.log("heyey" + request.body.name);

      reply.type("text/html").send(`
        <p>You've sent ${request.body.name} </p>
        <a href="/client/read"><button>Back</button></a>

        <a href="/client/save"><button>Demo save from Postgres with SequelizeBack</button></a>
        `);
    }
  );

  fastify.get("/client/save", async (request, reply) => SaveFromSequelize());

  fastify.get("/", async (request, reply) => reply.redirect("/client/read"));
}

export { routes };
