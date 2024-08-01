function routePath (item) {
  const { breakNsPath } = this.app.bajo
  const { isEmpty } = this.app.bajo.lib._
  if (isEmpty(item) || item.startsWith('http') || item.startsWith('/')) return item
  let [ns, path, subNs] = breakNsPath(item, this.name)
  ns = subNs === ('virtual') ? this.virtualDir(ns) : this.assetDir(ns)
  return ns + path
}

export default routePath
