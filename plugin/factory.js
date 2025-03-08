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
      const { trim } = this.app.bajo.lib._
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
      const { trim } = this.app.bajo.lib._
      const plugin = this.app.bajo.getPlugin(ns)
      let dir = trim(`/${getPluginPrefix(this.name, 'waibuStatic')}/${this.app.waibu.config.prefixVirtual}`, '/')
      dir = `/${dir}/${getPluginPrefix(plugin.name, 'waibuStatic')}`
      return dir
    }
  }
}

export default factory
