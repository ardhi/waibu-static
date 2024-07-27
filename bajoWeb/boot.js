import asset from '../lib/asset.js'
import virtual from '../lib/virtual.js'
// import notFound from '../lib/not-found.js'
import error from '../lib/error.js'

const boot = {
  level: 10,
  handler: async function boot () {
    const { importModule, runHook } = this.app.bajo
    const prefix = this.config.prefix
    const routeHook = await importModule('wakatobi:/lib/webapp-scope/route-hook.js')
    const handleCors = await importModule('wakatobi:/lib/webapp-scope/handle-cors.js')
    const handleHelmet = await importModule('wakatobi:/lib/webapp-scope/handle-helmet.js')
    const handleCompress = await importModule('wakatobi:/lib/webapp-scope/handle-compress.js')
    const handleRateLimit = await importModule('wakatobi:/lib/webapp-scope/handle-rate-limit.js')
    await this.app.wakatobi.instance.register(async (ctx) => {
      this.instance = ctx
      await runHook(`${this.name}:afterCreateContext`, ctx)
      await handleRateLimit.call(this, ctx, this.config.rateLimit)
      await handleCors.call(this, ctx, this.config.cors)
      await handleHelmet.call(this, ctx, this.config.helmet)
      await handleCompress.call(this, ctx, this.config.compress)
      await routeHook.call(this, this.name)
      await error.call(this, ctx)
      await asset.call(this, ctx, prefix)
      await virtual.call(this, ctx, prefix)
      // await notFound.call(this, ctx)
    }, { prefix })
  }
}

export default boot
