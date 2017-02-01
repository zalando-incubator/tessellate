// @flow

import nconf from '../src/nconf'

describe('nconf', () => {
  it('should store a value', () => {
    const foo = nconf.get('FOO')
    expect(foo).toBe('bar')
  })

  it('should store a string value', () => {
    const foo = nconf.getString('FOO')
    expect(foo).toBe('bar')
  })

  it('should store an object value', () => {
    const bar = nconf.getObject('BAR')
    expect(bar).toEqual({what: 'is', code: 42})
  })

  it('should set a value', () => {
    nconf.set('NEW_VALUE', 41)
    const value = nconf.get('NEW_VALUE')
    expect(value).toEqual(41)
  })

  it('should use defaults', () => {
    nconf.defaults({'SOME_DEFAULT': 'default'})
    const value = nconf.get('SOME_DEFAULT')
    expect(value).toEqual('default')
  })
})
