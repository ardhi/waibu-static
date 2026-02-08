import serveDefault from './serve-default.js'

async function error (err, req, reply) {
  const handler = await serveDefault.call(this, 500)
  return handler(err, req, reply)
}

export default error
