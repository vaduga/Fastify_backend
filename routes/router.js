


async function routes (fastify, options) {
    fastify.get('/client/read', async (request, reply) => (

        `
    
        <h1>Read</h1>
        <form action="/client/write" method="POST"> 
    
        <input type="text" name="name"/>
        <input type="submit"/>
        
        </form>
        
        
        `)

    )

    fastify.post('/client/write', async (request, reply) => {

        console.dir(request.body.name);
        
        return (`
        You've sent ${req.body.name}
        <a href="/client/read"><button>Back</button></a>
        `)
      })


    fastify.get('/', async (request, reply) => reply.redirect('/client/read'))
    }
  
  
  export {routes}