import createParser from '../lib/parsers/json-parser'
import { traverse } from './helpers'

describe('json-parser', () => {

  it('should traverse a default JSON tree', () => {
    const json = {
      type: 'div',
      id: 'test',
      children: [
        {
          type: 'h1',
          id: 'heading',
          children: ['Hello, world!']
        }
      ]
    }
    const parse = createParser()
    const result = traverse(parse, json)

    expect(result.nodes.length).toEqual(0)
    expect(result.entered[0].type).toEqual('div')
    expect(result.entered[1].type).toEqual('h1')
    expect(result.left.length).toEqual(2)
    expect(result.literals).toEqual(['Hello, world!'])
  })

  it('should traverse a custom JSON tree', () => {
    const json = {
      class: 'div',
      id: 'test',
      elements: [
        {
          class: 'h1',
          id: 'heading',
          text: 'Hello, world!'
        }
      ]
    }
    const parse = createParser({
      jsonMap: {
        typeKeys: ['class'],
        childrenKeys: ['elements'],
        literalKeys: ['text']
      }
    })
    const result = traverse(parse, json)

    expect(result.nodes.length).toEqual(0)
    expect(result.entered[0].type).toEqual('div')
    expect(result.entered[1].type).toEqual('h1')
    expect(result.left.length).toEqual(2)
    expect(result.literals).toEqual(['Hello, world!'])
  })

  it('should map type names', () => {
    const json = {
      type: 'wrapper',
      children: [
        {
          type: 'heading',
          children: ['Hello, world!']
        }
      ]
    }
    const parse = createParser({
      jsonMap: {
        typeKeys: ['type'],
        childrenKeys: ['children'],
        typeMap: {
          wrapper: 'div',
          heading: 'h1'
        }
      }
    })

    const result = traverse(parse, json)

    expect(result.entered[0].type).toBe('div')
    expect(result.entered[1].type).toBe('h1')
    expect(result.literals).toEqual(['Hello, world!'])
  })

  it('should parse object type properties', () => {
    const json = {
      type: 'h1',
      style: {
        color: 'red'
      },
      children: ['click me']
    }

    const result = traverse(createParser(), json)

    expect(result.entered[0].props).toEqual({
      style: {
        color: 'red'
      }
    })
  })
})
