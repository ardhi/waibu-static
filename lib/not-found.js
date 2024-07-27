import serveDefault from './serve-default.js'

async function notFound (ctx) {
  const handler = await serveDefault.call(this, 404)
  ctx.setNotFoundHandler(handler)
}

export default notFound
