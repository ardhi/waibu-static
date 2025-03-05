function routePath (name) {
  const { ns, fullPath, subNs } = this.app.bajo.breakNsPath(name)
  if (subNs === 'virtual') return `${this.virtualDir(ns)}${fullPath}`
  if (subNs === 'asset') return `${this.assetDir(ns)}${fullPath}`
}

export default routePath
