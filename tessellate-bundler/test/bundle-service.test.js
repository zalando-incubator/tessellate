// @flow

import fs from 'mz/fs'
import path from 'path'
import * as bundleService from '../src/bundle-service'

describe('bundle-service', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

  it('should make a bundle from a source string', async () => {
    const source = await fs.readFile(path.resolve(__dirname, 'fixtures', 'fragment-script.js'))
    const bundle = await bundleService.make(source)
    expect(bundle.js).toBeDefined()
    expect(bundle.css).not.toBeDefined()
    expect(bundle.js.name).toMatch(/\.js$/)
    expect(bundle.js.source).toMatchSnapshot()
  })
})
