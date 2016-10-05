// @flow

import vm from 'vm'

export default class SandboxVM {
  globals: Object;

  constructor(globals: Object = {}) {
    this.globals = globals
  }

  run(source: string) {
    const script = new vm.Script(source, {displayErrors: true})
    const sandbox = Object.assign({}, this.globals)
    const context = vm.createContext(sandbox)
    console.log('run in context...')
    const result = script.runInContext(context)
    return result.default || result
  }
}
