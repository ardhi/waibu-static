import path from 'path'

async function serveDefault (code) {
  const { fs } = this.app.lib
  const { isEmpty } = this.app.lib._
  const me = this

  return function (err, req, reply) {
    const ext = path.extname(req.url)
    code = err ? (err.statusCode ?? code) : code
    reply.code(code)
    let file
    if (!isEmpty(ext)) {
      file = `${me.app[me.app.mainNs].dir}/extend/${me.ns}/asset/rsc/${code}${ext}`
      if (!fs.existsSync(file)) file = `${me.dir.pkg}/extend/${me.ns}/asset/rsc/${code}${ext}`
    }
    if (!fs.existsSync(file)) {
      file = `${me.app[me.app.mainNs].dir}/extend/${me.ns}/asset/rsc/${code}.txt`
      if (!fs.existsSync(file)) file = `${me.dir.pkg}/extend/${me.ns}/asset/rsc/${code}.txt`
      if (!fs.existsSync(file)) file = `${me.dir.pkg}/extend/${me.ns}/asset/rsc/500.txt`
    }
    const content = fs.readFileSync(file, { encoding: 'utf8' })
    return reply.send(content)
  }
}

export default serveDefault
