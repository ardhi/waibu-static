import asset from '../../lib/asset.js'
import virtual from '../../lib/virtual.js'
import errorHandler from '../../lib/error.js'
import notFoundHandler from '../../lib/not-found.js'

const boot = {
  level: 10,
  errorHandler,
  notFoundHandler,
  handler: async function boot (prefix) {
    const { importModule } = this.app.bajo
    const routeHook = await importModule('waibu:/lib/webapp-scope/route-hook.js')
    const handleCors = await importModule('waibu:/lib/webapp-scope/handle-cors.js')
    const handleHelmet = await importModule('waibu:/lib/webapp-scope/handle-helmet.js')
    const handleCompress = await importModule('waibu:/lib/webapp-scope/handle-compress.js')
    const handleRateLimit = await importModule('waibu:/lib/webapp-scope/handle-rate-limit.js')

    await handleRateLimit.call(this, this.config.rateLimit)
    await handleCors.call(this, this.config.cors)
    await handleHelmet.call(this, this.config.helmet)
    await handleCompress.call(this, this.config.compress)
    await routeHook.call(this, this.ns)
    await asset.call(this, prefix)
    await virtual.call(this, prefix)
  }
}

export default boot
