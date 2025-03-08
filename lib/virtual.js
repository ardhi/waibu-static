import path from 'path'

async function virtual (ctx, prefix) {
  const { importPkg, eachPlugins, readConfig, resolvePath, getModuleDir, importModule } = this.app.bajo
  const { getPluginPrefix } = this.app.waibu
  const fastifyStatic = await importPkg('waibu:waibu-fastify-static')
  const { fs } = this.app.bajo.lib
  const { isEmpty, isPlainObject } = this.app.bajo.lib._
  const isRouteDisabled = await importModule('waibu:/lib/webapp-scope/is-route-disabled.js')
  const me = this
  await ctx.register(async (childCtx) => {
    await eachPlugins(async function ({ dir, ns, alias }) {
      let virts = await readConfig(`${dir}/${me.name}/virtual.*`, { ns, ignoreError: true, defValue: [] })
      if (isEmpty(virts)) return undefined
      if (isPlainObject(virts)) virts = [virts]
      for (const v of virts) {
        if (isEmpty(v.prefix)) {
          me.log.warn('staticVirtualMustHavePrefix%s', ns)
          continue
        }
        if (isEmpty(v.root)) {
          me.log.warn('staticVirtualMustHaveRoot%s%s', v.prefix, ns)
          continue
        }
        if (!path.isAbsolute(v.root)) {
          if (v.root.startsWith('data:')) {
            let [vPlugin, vPath] = v.root.slice(5).split(':')
            if (!vPath) {
              vPath = vPlugin
              vPlugin = ns
            }
            v.root = resolvePath(`${me.app.bajo.dir.data}/plugins/${vPlugin}/${vPath}`)
          } else {
            try {
              const parts = v.root.split(':')
              if (parts.length === 1) v.root = resolvePath(`${dir}/${v.root}`)
              else {
                let [vPlugin, vMod] = parts[0].split('.')
                const vPath = parts[1]
                if (!vMod) {
                  vMod = vPlugin
                  vPlugin = ns
                }
                const dir = getModuleDir(vMod, vPlugin)
                v.root = dir
                if (!isEmpty(vPath)) v.root += vPath
              }
            } catch (err) {}
          }
        }
        if (!fs.existsSync(v.root)) {
          me.log.warn('rootOnVirtualNotExists%s%s', v.prefix, ns)
          continue
        }
        const prefix = getPluginPrefix(ns, 'waibuStatic')
        const p = v.prefix
        v.prefix = `${prefix === '' ? '' : ('/' + prefix)}/${p}`
        v.decorateReply = false
        if (ns === me.app.bajo.mainNs) {
          v.decorateReply = true
        }
        if (await isRouteDisabled.call(me, v.prefix, 'GET', me.config.disabled)) {
          me.log.warn('routeDisabled%s%s', `${prefix}${v.prefix}`, 'GET')
          return
        }
        v.config = v.config ?? {}
        v.config.webApp = me.name
        v.config.ns = ns
        me.log.trace('servingVirtual%s', `${me.virtualDir(ns)}/${p}/*`)
        await childCtx.register(fastifyStatic, v)
      }
    }, { useBajo: true })
  }, { prefix: me.app.waibu.config.prefixVirtual })
}

export default virtual
