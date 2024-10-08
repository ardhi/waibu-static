function assetDir (ns) {
  const dir = this.config.prefix === '' ? '' : `/${this.config.prefix}`
  if (!ns) return dir
  if (ns === this.app.bajo.mainNs && this.config.mountMainAsRoot) return dir
  const plugin = this.app.bajo.getPlugin(ns)
  return dir + '/' + plugin.config.prefix
}

export default assetDir
