function routePath (item) {
  const { breakNsPath } = this.app.bajo
  let [ns, path, subNs] = breakNsPath(item, this.name)
  ns = subNs === ('virtual') ? this.virtualDir(ns) : this.assetDir(ns)
  return ns + path
}

export default routePath
