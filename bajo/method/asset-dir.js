function assetDir (ns) {
  const { getPluginPrefix } = this.app.waibu
  const prefix = getPluginPrefix(this.name)
  const dir = prefix === '' ? '' : `/${prefix}`
  if (!ns) return dir
  if (ns === this.app.bajo.mainNs && this.config.mountMainAsRoot) return dir
  const plugin = this.app.bajo.getPlugin(ns)
  return dir + '/' + getPluginPrefix(plugin.name)
}

export default assetDir
