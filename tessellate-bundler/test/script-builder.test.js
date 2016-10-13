// @flow

jest.mock('uuid')

import fs from 'mz/fs'
import path from 'path'
import * as scriptBuilder from '../src/script-builder'

describe('script-builder', () => {
  const uuid = require('uuid')
  uuid.v4.mockImplementation(mockUUID())

  it('should fragment script string from a content structure', async () => {
    const json = await fs.readFile(path.resolve(__dirname, 'fixtures', 'content.json'))
    const element = JSON.parse(json)
    const result = scriptBuilder.build(element)
    expect(typeof result).toBe('string')
    expect(result).toMatchSnapshot()
  })
})

function mockUUID(): () => number {
  let i = 0
  return () => ++i
}
