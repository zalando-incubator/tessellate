// @flow

import vm from 'vm'

function isExport(thing: ?mixed): boolean {
  return typeof thing === 'object' || typeof thing === 'function'
}

export default class SandboxVM {
  globals: Object;

  constructor(globals: Object = {}) {
    this.globals = globals
  }

  run(source: string): Object {
    const globals = {
      module: {},
      exports: {}
    }
    globals.module.exports = globals.exports
    const script = new vm.Script(source, {displayErrors: true})
    const sandbox = Object.assign({}, globals, this.globals)
    const context = vm.createContext(sandbox)
    const result = script.runInContext(context)

    if (result && isExport(result.default))
      return result.default
    if (isExport(result))
      return result
    if (isExport(sandbox.module.exports))
      return sandbox.module.exports
    if (isExport(sandbox.exports))
      return sandbox.exports
    else
      return {}
  }
}
