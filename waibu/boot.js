import asset from '../lib/asset.js'
import virtual from '../lib/virtual.js'
// import notFound from '../lib/not-found.js'
import error from '../lib/error.js'

const boot = {
  level: 10,
  handler: async function boot (ctx, prefix) {
    const { importModule } = this.app.bajo
    const routeHook = await importModule('waibu:/lib/webapp-scope/route-hook.js')
    const handleCors = await importModule('waibu:/lib/webapp-scope/handle-cors.js')
    const handleHelmet = await importModule('waibu:/lib/webapp-scope/handle-helmet.js')
    const handleCompress = await importModule('waibu:/lib/webapp-scope/handle-compress.js')
    const handleRateLimit = await importModule('waibu:/lib/webapp-scope/handle-rate-limit.js')

    await handleRateLimit.call(this, ctx, this.config.rateLimit)
    await handleCors.call(this, ctx, this.config.cors)
    await handleHelmet.call(this, ctx, this.config.helmet)
    await handleCompress.call(this, ctx, this.config.compress)
    await routeHook.call(this, this.name)
    await error.call(this, ctx)
    await asset.call(this, ctx, prefix)
    await virtual.call(this, ctx, prefix)
    // await notFound.call(this, ctx)
  }
}

export default boot
