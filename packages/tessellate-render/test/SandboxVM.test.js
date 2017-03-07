import SandboxVM from '../lib/SandboxVM'

describe('SandboxVM', () => {
  it('should evaluate a function export', () => {
    const sandbox = new SandboxVM()
    const result = sandbox.run('exports = () => 42')
    expect(typeof result).toBe('function')
    expect(result()).toBe(42)
  })

  it('should evaluate an object export', () => {
    const sandbox = new SandboxVM()
    const result = sandbox.run('exports = {test: 42}')
    expect(typeof result).toBe('object')
    expect(result).toEqual({test: 42})
  })

  it('should evaluate a module.exports export', () => {
    const sandbox = new SandboxVM()
    const result = sandbox.run('module.exports = {test: 42}')
    expect(result).toEqual({test: 42})
  })

  it('should return an empty object if nothing is exported', () => {
    const sandbox = new SandboxVM()
    const result = sandbox.run('42')
    expect(result).toEqual({})
  })
})
