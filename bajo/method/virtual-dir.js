function virtualDir (ns) {
  const { getPluginPrefix } = this.app.waibu
  const { trim } = this.app.bajo.lib._
  const plugin = this.app.bajo.getPlugin(ns)
  let dir = trim(`/${getPluginPrefix(this.name)}/${this.app.waibu.config.prefixVirtual}`, '/')
  dir = `/${dir}/${getPluginPrefix(plugin.name)}`
  return dir
}

export default virtualDir
