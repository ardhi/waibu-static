function virtualDir (ns) {
  const { getPluginPrefix } = this.app.waibu
  const { trim } = this.app.bajo.lib._
  const plugin = this.app.bajo.getPlugin(ns)
  let dir = trim(`/${getPluginPrefix(this.name, 'waibuStatic')}/${this.app.waibu.config.prefixVirtual}`, '/')
  dir = `/${dir}/${getPluginPrefix(plugin.name, 'waibuStatic')}`
  return dir
}

export default virtualDir
