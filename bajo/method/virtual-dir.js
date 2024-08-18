function virtualDir (ns) {
  const { trim } = this.app.bajo.lib._
  const plugin = this.app.bajo.getPlugin(ns)
  let dir = trim(`/${this.config.prefix}/${this.app.waibu.config.prefixVirtual}`, '/')
  dir = `/${dir}/${plugin.alias}`
  return dir
}

export default virtualDir
