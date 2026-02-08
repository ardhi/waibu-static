import serveDefault from './serve-default.js'

async function notFound (err, req, reply) {
  const handler = await serveDefault.call(this, 404)
  return handler(err, req, reply)
}

export default notFound
