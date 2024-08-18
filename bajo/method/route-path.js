function routePath (name) {
  const { ns, path, subNs } = this.app.bajo.breakNsPath(name)
  if (subNs === 'virtual') return `${this.virtualDir(ns)}${path}`
  if (subNs === 'asset') return `${this.assetDir(ns)}${path}`
}

export default routePath
