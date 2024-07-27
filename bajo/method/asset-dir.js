function assetDir (ns) {
  const dir = this.config.prefix === '' ? '' : `/${this.config.prefix}`
  if (!ns) return dir
  if (ns === this.app.bajo.mainNs && this.config.mountAppAsRoot) return dir
  const plugin = this.app.bajo.getPlugin(ns)
  return dir + '/' + plugin.alias
}

export default assetDir
