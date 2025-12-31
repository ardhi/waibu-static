import path from 'path'

/**
 * Plugin factory
 *
 * @param {string} pkgName - NPM package name
 * @returns {class}
 */
async function factory (pkgName) {
  const me = this

  /**
   * WaibuStatic class
   *
   * @class
   */
  class WaibuStatic extends this.app.baseClass.Base {
    static alias = 'wstatic'
    static dependencies = ['waibu']

    constructor () {
      super(pkgName, me.app)
      this.routePathHandlers = ['asset', 'virtual']
      this.config = {
        waibu: {
          prefix: 'asset'
        },
        waibuStatic: {
          prefix: 'static'
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
      const { trim } = this.app.lib._
      this.config.waibu.prefix = trim(this.config.waibu.prefix, '/')
    }

    assetDir = (ns) => {
      const { getPluginPrefix } = this.app.waibu
      const prefix = this.config.waibu.prefix
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
      const { trimEnd } = this.app.lib._
      const plugin = this.app.bajo.getPlugin(ns)
      const prefix = this.config.waibu.prefix
      const virtPrefix = this.app.waibu.config.prefixVirtual
      const dir = prefix === '' ? '' : `/${prefix}`
      return trimEnd(`${dir}/${virtPrefix}/${getPluginPrefix(plugin.ns, 'waibuStatic')}`, '/')
    }

    listResources = async (rsc) => {
      const { getPluginPrefix } = this.app.waibu
      const { fastGlob } = this.app.lib
      const { isEmpty, map, camelCase } = this.app.lib._
      const { breakNsPath, importPkg } = this.app.bajo
      const mime = await importPkg('waibu:mime')
      const { ns, subNs, path: _path } = breakNsPath(rsc)
      if (subNs === 'virtual') return [] // only for assets
      const root = `${this.app[ns].dir.pkg}/extend/${this.ns}/asset`
      let pattern = root
      if (!isEmpty(_path)) pattern += _path
      if (!_path.includes('*')) pattern += '/**/*'
      const prefix = `${this.config.waibu.prefix}/${getPluginPrefix(ns, this.ns)}`
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

  return WaibuStatic
}

export default factory
