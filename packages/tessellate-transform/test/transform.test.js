// @flow

import fs from 'mz/fs'
import path from 'path'
import transform from '../lib/transform'

describe('transform', () => {
  it('should transform a simple JSX file', async () => {
    const buffer = await fs.readFile(path.resolve(__dirname, './fixtures/simple.jsx'))
    const result = transform('.jsx', buffer.toString(), {})
    expect(result).toMatchSnapshot()
  })

  it('should transform a JSX file with custom classes', async () => {
    const buffer = await fs.readFile(path.resolve(__dirname, './fixtures/custom.jsx'))
    const result = transform('.jsx', buffer.toString(), {typePrefix: 'my-prefix'})
    expect(result).toMatchSnapshot()
  })
})
