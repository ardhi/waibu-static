async function factory (pkgName) {
  const me = this

  return class WaibuStatic extends this.lib.BajoPlugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'wstatic'
      this.dependencies = ['waibu']
      this.routePathHandlers = ['asset', 'virtual']
      this.config = {
        waibu: {
          prefix: 'asset'
        },
        mountMainAsRoot: false,
        auth: ['basic', 'apiKey', 'jwt'],
        cors: {},
        helmet: {},
        compress: false,
        rateLimit: false,
        disabled: []
      }
    }

    init = async () => {
      const { trim } = this.lib._
      this.config.waibu = this.config.waibu ?? {}
      this.config.waibu.prefix = trim(this.config.waibu.prefix, '/')
    }

    assetDir = (ns) => {
      const { getPluginPrefix } = this.app.waibu
      const prefix = getPluginPrefix(this.name, 'waibuStatic')
      const dir = prefix === '' ? '' : `/${prefix}`
      if (!ns) return dir
      return dir + '/' + getPluginPrefix(ns, 'waibuStatic')
    }

    routePath = (name) => {
      const { ns, fullPath, subNs } = this.app.bajo.breakNsPath(name)
      if (subNs === 'virtual') return `${this.virtualDir(ns)}${fullPath}`
      if (subNs === 'asset') return `${this.assetDir(ns)}${fullPath}`
    }

    virtualDir = (ns) => {
      const { getPluginPrefix } = this.app.waibu
      const { trimEnd } = this.lib._
      const plugin = this.app.bajo.getPlugin(ns)
      const prefix = getPluginPrefix(this.name, 'waibuStatic')
      const virtPrefix = this.app.waibu.config.prefixVirtual
      const dir = prefix === '' ? '' : `/${prefix}`
      return trimEnd(`${dir}/${virtPrefix}/${getPluginPrefix(plugin.name, 'waibuStatic')}`, '/')
    }
  }
}

export default factory
