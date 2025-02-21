async function asset (ctx, prefix) {
  const { importPkg, eachPlugins, readConfig, importModule } = this.app.bajo
  const { fs } = this.app.bajo.lib
  const { getPluginPrefix } = this.app.waibu
  const fastifyStatic = await importPkg('waibu:@fastify/static')
  const isRouteDisabled = await importModule('waibu:/lib/webapp-scope/is-route-disabled.js')
  const me = this
  await eachPlugins(async function ({ dir, ns, alias }) {
    const root = `${dir}/${me.name}/asset`
    if (ns === me.app.bajo.mainNs) fs.ensureDirSync(root)
    else if (!fs.existsSync(root)) return undefined
    const opts = await readConfig(`${dir}/${me.name}/options.*`, { ns, ignoreError: true })
    opts.root = root
    opts.prefix = '/' + getPluginPrefix(ns, 'waibuStatic')
    if (await isRouteDisabled.call(me, opts.prefix, 'GET', me.config.disabled)) {
      me.log.warn('routeDisabled%s%s', `${prefix}${opts.prefix}`, 'GET')
      return
    }
    opts.decorateReply = false
    if (ns === me.app.bajo.mainNs) {
      opts.decorateReply = true
    }
    me.log.trace('servingAsset%s', `${me.assetDir(ns)}/*`)
    opts.config = opts.config ?? {}
    opts.config.webApp = me.name
    opts.config.ns = ns
    await ctx.register(fastifyStatic, opts)
  })
}

export default asset
