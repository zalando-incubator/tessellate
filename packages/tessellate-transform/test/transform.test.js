import fs from 'mz/fs'
import path from 'path'
import transform from '../lib/transform'
import createJSXParser from '../lib/parsers/jsx-parser'
import createJSONParser from '../lib/parsers/json-parser'

describe('transform', () => {
  it('should transform a simple JSX file', async () => {
    const buffer = await fs.readFile(path.resolve(__dirname, './fixtures/simple.jsx'))
    const result = transform(buffer.toString(), createJSXParser())
    expect(result).toMatchSnapshot()
  })

  it('should transform a JSX file with custom classes', async () => {
    const buffer = await fs.readFile(path.resolve(__dirname, './fixtures/custom.jsx'))
    const result = transform(buffer.toString(), createJSXParser({typePrefix: 'my-prefix'}))
    expect(result).toMatchSnapshot()
  })

  it('should transform a simple JSON file', async () => {
    const buffer = await fs.readFile(path.resolve(__dirname, './fixtures/simple.json'))
    const result = transform(buffer.toString(), createJSONParser())
    expect(result).toMatchSnapshot()
  })

  it('should wrap a result in the provided root node', async () => {
    const root = {
      type: 'myroot',
      props: null,
      children: []
    }
    const buffer = await fs.readFile(path.resolve(__dirname, './fixtures/simple.json'))
    const result = transform(buffer.toString(), createJSONParser(), root)

    expect(typeof result).toBe('object')
    expect(result.type).toBe(root.type)
    expect(Array.isArray(result.children)).toBe(true)
  })

  it('transform an array of elements', async () => {
    const root = {
      type: 'myroot',
      props: null,
      children: []
    }
    const buffer = await fs.readFile(path.resolve(__dirname, './fixtures/array.json'))
    const result = transform(buffer.toString(), createJSONParser(), root)

    expect(typeof result).toBe('object')
    expect(result.type).toBe(root.type)
    expect(result).toMatchSnapshot()
  })
})
