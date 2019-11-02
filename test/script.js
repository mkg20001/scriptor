'use strict'

/* eslint-env mocha */

const scriptor = require('..')
const path = require('path')

const scripts = path.join(__dirname, 's', '*.sh')

const assert = require('assert').strict

describe('script', () => {
  it('should find scripts', async () => {
    const s = scriptor({ files: [scripts] })
    assert(s.test)
  })
})
