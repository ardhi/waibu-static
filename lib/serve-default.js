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
      file = `${me.app[me.app.mainNs].dir}/extend/${me.ns}/resource/${code}${ext}`
      if (!fs.existsSync(file)) file = `${me.dir.pkg}/extend/${me.ns}/resource/${code}${ext}`
    }
    if (!fs.existsSync(file)) {
      file = `${me.app[me.app.mainNs].dir}/extend/${me.ns}/resource/${code}.txt`
      if (!fs.existsSync(file)) file = `${me.dir.pkg}/extend/${me.ns}/resource/${code}.txt`
      if (!fs.existsSync(file)) file = `${me.dir.pkg}/extend/${me.ns}/resource/500.txt`
    }
    if (err) console.log(err)
    const content = fs.readFileSync(file, { encoding: 'utf8' })
    return reply.send(content)
    /*
    const stream = fs.createReadStream(file)
    reply.header('Content-Type', 'application/octet-stream')
    reply.send(stream)
    */
  }
}

export default serveDefault
