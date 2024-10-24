function virtualDir (ns) {
  const { getAppPrefix } = this.app.waibu
  const { trim } = this.app.bajo.lib._
  const plugin = this.app.bajo.getPlugin(ns)
  let dir = trim(`/${getAppPrefix(this.name)}/${this.app.waibu.config.prefixVirtual}`, '/')
  dir = `/${dir}/${getAppPrefix(plugin.name)}`
  return dir
}

export default virtualDir
