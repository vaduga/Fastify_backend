
import qs from 'qs'

async function routes (fastify, options) {

  fastify.addContentTypeParser('application/x-www-form-urlencoded', function (request, payload, done) {
    let body = ''
    payload.on('data', function (data) {
      body += data
    })
    payload.on('end', function () {
      try {
        const parsed = qs.parse(body)
        done(null, parsed)
      } catch (e) {
        done(e)
      }
    })
    payload.on('error', done)
  })




    fastify.get('/client/read', async (request, reply) => {
reply.type('text/html').send(
        `
    
        <h1>Read</h1>
        <form action="/client/write" method="POST"> 
    
        <input type="text" name="name"/>
        <input type="submit"/>
        
        </form>
        
        
        `
)
    }
    )

    fastify.post('/client/write', async (request, reply) => {

        console.dir(request.body.name);
        
        reply.type('text/html').send(`
        <p>You've sent ${request.body.name} </p>
        <a href="/client/read"><button>Back</button></a>
        `)
      })


    fastify.get('/', async (request, reply) => reply.redirect('/client/read'))
    }
  
  
  export {routes}