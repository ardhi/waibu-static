function assetDir (ns) {
  const { getPluginPrefix } = this.app.waibu
  const prefix = getPluginPrefix(this.name, 'waibuStatic')
  const dir = prefix === '' ? '' : `/${prefix}`
  if (!ns) return dir
  return dir + '/' + getPluginPrefix(ns, 'waibuStatic')
}

export default assetDir
