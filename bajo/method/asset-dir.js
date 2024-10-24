function assetDir (ns) {
  const { getAppPrefix } = this.app.waibu
  const prefix = getAppPrefix(this.name)
  const dir = prefix === '' ? '' : `/${prefix}`
  if (!ns) return dir
  if (ns === this.app.bajo.mainNs && this.config.mountMainAsRoot) return dir
  const plugin = this.app.bajo.getPlugin(ns)
  return dir + '/' + getAppPrefix(plugin.name)
}

export default assetDir
