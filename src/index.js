'use strict'

const glob = require('glob')
const mergeOptions = require('merge-options')

const fs = require('fs')
const cp = require('child_process')
const bl = require('bl')

module.exports = function scriptor ({ files, showOutput, options, shell }) {
  if (!shell) {
    shell = fs.existsSync('/bin/bash') ? '/bin/bash' : '/bin/sh'
  }

  async function spawn (cmd, ...args) {
    const objs = [
      showOutput ? { stdio: 'inherit' } : { stdio: ['pipe', 'pipe', 'inherit'] },
      { shell },
      options || {}
    ].concat(args.filter(a => typeof a === 'object'))

    const strs = args.filter(a => typeof a !== 'object').map(String)

    const cpOptions = objs.reduce((a, b) => mergeOptions(a, b), {})

    return new Promise((resolve, reject) => {
      const p = cp.spawn(cmd, strs, cpOptions)

      if (p.stdout) {
        p.stdout = p.stdout.pipe(bl())
      }

      if (p.stderr) {
        p.stderr = p.stderr.pipe(bl())
      }

      p.once('close', (code, sig) => {
        if (code) {
          return reject(new Error(`Exited with code ${code}`))
        }

        if (sig) {
          return reject(new Error(`Exited with signal ${sig}`))
        }

        return resolve(p)
      })
      p.once('error', reject)
    })
  }

  files = files.concat([
    files.filter(g => !glob.hasMagic(g)).filter(f => fs.existsSync(f)),
    ...files.filter(g => glob.hasMagic(g)).map(g => glob.sync(g)).filter(r => r.length)
  ])

  const o = {}

  files.forEach(file => {

  })
}
