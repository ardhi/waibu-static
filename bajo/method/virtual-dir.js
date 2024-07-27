function virtualDir (ns) {
  const plugin = this.app.bajo.getPlugin(ns)
  let dir = this.config.prefix === '' ? `/${this.config.virtualPrefix}` : `/${this.config.prefix}/${this.config.virtualPrefix}`
  dir += '/' + plugin.alias
  return dir
}

export default virtualDir
