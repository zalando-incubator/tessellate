// @flow

import createParser from '../lib/parsers/jsx-parser'

describe('jsx-parser', () => {
  const parse = createParser()
  const jsx = '<div><h1>Hello, world!</h1></div>'

  it('should traverse a JSX tree', () => {
    const nodes = []
    let entered = 0
    let left = 0
    let literals = 0

    parse(jsx, {
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
