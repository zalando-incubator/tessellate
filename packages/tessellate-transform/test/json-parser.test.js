// @flow

import createParser from '../lib/parsers/json-parser'

describe('json-parser', () => {
  const jsonMap = {
    typeKeys: ['class'],
    childrenKeys: ['elements'],
    literalKeys: ['text'],
    ignoreKeys: []
  }
  const parse = createParser({jsonMap})
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

  it('should traverse a JSON tree', () => {
    const nodes = []
    let entered = 0
    let left = 0
    let literals = 0

    parse(json, {
      onEnter: node => {
        entered += 1
        nodes.push(node)
      },
      onLeave: node => {
        left += 1
        expect(node).toBe(nodes.pop())
      },
      onLiteral: string => {
        literals += 1
        expect(string).toBe('Hello, world!')
      }
    })

    expect(nodes.length).toEqual(0)
    expect(entered).toEqual(2)
    expect(left).toEqual(2)
    expect(literals).toEqual(1)
  })
})
