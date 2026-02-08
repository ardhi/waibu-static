async function asset (prefix) {
  const { importPkg, eachPlugins, readConfig, importModule } = this.app.bajo
  const { fs } = this.app.lib
  const { getPluginPrefix } = this.app.waibu
  const fastifyStatic = await importPkg('waibu:waibu-fastify-static')
  const isRouteDisabled = await importModule('waibu:/lib/webapp-scope/is-route-disabled.js')
  const me = this
  this.log.trace('serving%s', this.t('assets'))
  await eachPlugins(async function ({ dir }) {
    const { ns } = this
    const root = `${dir}/extend/${me.ns}/asset`
    if (ns === me.app.mainNs) fs.ensureDirSync(root)
    else if (!fs.existsSync(root)) return undefined
    const opts = await readConfig(`${dir}/extend/${me.ns}/options.*`, { ns, ignoreError: true })
    opts.root = root
    opts.prefix = '/' + getPluginPrefix(ns, 'waibuStatic')
    const fullPath = `/${prefix}${opts.prefix}`.replaceAll('//', '/')
    if (await isRouteDisabled.call(me, fullPath, 'GET', me.config.disabled)) {
      me.log.warn('routeDisabled%s%s', `${fullPath}`, 'GET')
      return
    }
    opts.decorateReply = false
    if (ns === me.app.mainNs) {
      opts.decorateReply = true
    }
    me.log.trace(`- ${me.assetDir(ns)}/*`)
    opts.config = opts.config ?? {}
    opts.config.webApp = me.ns
    opts.config.ns = ns
    opts.config.subNs = 'asset'
    await me.webAppCtx.register(fastifyStatic, opts)
  })
}

export default asset
