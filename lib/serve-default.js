import path from 'path'

async function serveDefault (code) {
  const { fs } = this.lib
  const { isEmpty } = this.lib._
  const e = code >= 500
  const me = this

  return function (...args) {
    // const error = err ? args[0] : undefined
    const err = e ? args[0] : undefined
    const req = e ? args[1] : args[0]
    const reply = e ? args[2] : args[1]
    const ext = path.extname(req.url)
    code = err ? (err.statusCode ?? code) : code
    reply.code(code)
    let file
    if (!isEmpty(ext)) {
      file = `${me.app[me.app.bajo.mainNs].dir}/extend/${me.name}/resource/${code}${ext}`
      if (!fs.existsSync(file)) file = `${me.dir.pkg}/extend/${me.name}/resource/${code}${ext}`
    }
    if (!fs.existsSync(file)) {
      file = `${me.app[me.app.bajo.mainNs].dir}/extend/${me.name}/resource/${code}.txt`
      if (!fs.existsSync(file)) file = `${me.dir.pkg}/extend/${me.name}/resource/${code}.txt`
      if (!fs.existsSync(file)) file = `${me.dir.pkg}/extend/${me.name}/resource/500.txt`
    }
    if (err) console.log(err)
    const content = fs.readFileSync(file, { encoding: 'utf8' })
    reply.send(content)
    /*
    const stream = fs.createReadStream(file)
    reply.header('Content-Type', 'application/octet-stream')
    reply.send(stream)
    */
  }
}

export default serveDefault
