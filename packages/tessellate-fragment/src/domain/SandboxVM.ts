import vm = require('vm');

function isExport(thing?: any): boolean {
  return typeof thing === 'object' || typeof thing === 'function';
}

export default class SandboxVM {
  private readonly globals: object;

  constructor(globals: object = {}) {
    this.globals = globals;
  }

  public run(source: string): any {
    const globals = {
      module: {
        exports: {}
      },
      exports: {}
    };
    globals.module.exports = globals.exports;
    const script = new vm.Script(source, { displayErrors: true });
    const sandbox = Object.assign({}, globals, this.globals);
    const context = vm.createContext(sandbox);
    const result = script.runInContext(context);

    if (result && isExport(result.default)) return result.default;
    if (isExport(result)) return result;
    if (isExport(sandbox.module.exports)) return sandbox.module.exports;
    if (isExport(sandbox.exports)) return sandbox.exports;
    else return {};
  }
}
