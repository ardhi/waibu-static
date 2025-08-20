import path from 'path'

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

    routePath = (name, { uriEncoded = true } = {}) => {
      let { ns, fullPath, subNs } = this.app.bajo.breakNsPath(name)
      const prefix = subNs === 'virtual' ? this.virtualDir(ns) : this.assetDir(ns)
      if (uriEncoded) fullPath = fullPath.split('/').map(p => encodeURI(p)).join('/')
      return `${prefix}${fullPath}`.replace('//', '/')
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

    listResources = async (rsc) => {
      const { getPluginPrefix } = this.app.waibu
      const { fastGlob } = this.lib
      const { isEmpty, map, camelCase } = this.lib._
      const { breakNsPath, importPkg } = this.app.bajo
      const mime = await importPkg('waibu:mime')
      const { ns, subNs, path: _path } = breakNsPath(rsc)
      if (subNs === 'virtual') return [] // only for assets
      const root = `${this.app[ns].dir.pkg}/extend/${this.name}/asset`
      let pattern = root
      if (!isEmpty(_path)) pattern += _path
      if (!_path.includes('*')) pattern += '/**/*'
      const prefix = `${this.config.waibu.prefix}/${getPluginPrefix(ns, this.name)}`
      const files = map(await fastGlob(pattern), file => {
        const href = `/${prefix}${file.replace(root, '')}`
        const ext = path.extname(file)
        const mimeType = mime.getType(ext) ?? ''
        const base = path.basename(file, ext)
        const name = camelCase(base)
        return {
          file,
          href,
          name,
          mimeType
        }
      })
      return files
    }
  }
}

export default factory
