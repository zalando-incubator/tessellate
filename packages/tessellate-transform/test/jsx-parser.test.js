// @flow

import fs from 'mz/fs'
import path from 'path'
import parse from '../lib/parsers/jsx-parser'

describe('jsx-parser', () => {
  it('should parse a simple JSX file', async () => {
    const buffer = await fs.readFile(path.resolve(__dirname, './fixtures/simple.jsx'))
    const result = parse(buffer.toString(), {})
    expect(result).toMatchSnapshot()
  })

  it('should parse a JSX file with custom classes', async () => {
    const buffer = await fs.readFile(path.resolve(__dirname, './fixtures/custom.jsx'))
    const result = parse(buffer.toString(), {typePrefix: 'my-prefix'})
    expect(result).toMatchSnapshot()
  })
})
