// @flow

import vm from 'vm'

export default class SandboxVM {
  globals: Object;

  constructor(globals: Object = {}) {
    this.globals = globals
  }

  run(source: string) {
    const globals = {
      module: {},
      exports: {}
    }
    globals.module.exports = globals.exports
    const script = new vm.Script(source, {displayErrors: true})
    const sandbox = Object.assign({}, globals, this.globals)
    const context = vm.createContext(sandbox)
    const result = script.runInContext(context)
    return result ? result || result.default : sandbox.module.exports || sandbox.exports
  }
}
