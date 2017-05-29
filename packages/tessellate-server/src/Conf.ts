import fs = require('fs');
import path = require('path');
import changeCase = require('change-case');

function readFile(file: string, parser: (s: string) => Object): Object {
  try {
    return parser(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    process.stderr.write(`Unable to read ${file}`);
    return {};
  }
}

function readConfigFile(filePath: string): object {
  const extname = path.extname(filePath);

  switch (extname) {
    case '.yml':
    case '.yaml':
      return readFile(filePath, require('js-yaml').safeLoad);
    case '.json':
      return readFile(filePath, JSON.parse);
    default:
      console.error(`No such file: ${filePath}\n`);
      return {};
  }
}

class IllegalTypeError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type Store = { [key: string]: any };

export class Conf {
  private override: Store;
  private stores: { [name: string]: Store };
  private storeNames: string[];

  constructor() {
    this.override = {};
    this.stores = {};
    this.storeNames = [];
  }

  private resolve(name: string): any {
    if (name in this.override) {
      return this.override[name];
    }

    for (let key of this.storeNames) {
      if (name in this.stores[key]) {
        return this.stores[key][name];
      }
    }
  }

  private exists(name: string): boolean {
    if (name in this.override) {
      return true;
    }

    for (let key in this.stores) {
      if (name in this.stores[key]) {
        return true;
      }
    }
    return false;
  }

  private addStore(store: Store, name: string): void {
    this.stores[name] = store;
    this.storeNames.push(name);
  }

  withEnv(prefix: string = ''): Conf {
    const prefixValue = changeCase.constant(prefix);
    const store = new Proxy({}, {
      get: (_, name: string) => {
        const keyValue = changeCase.constant(name);
        const envName = prefixValue ? `${prefixValue}_${keyValue}` : keyValue;

        if (envName in process.env) {
          return process.env[envName];
        }
      }
    });
    const storeName = prefixValue ? `ENV_${prefixValue}` : 'ENV';
    this.addStore(store, storeName);
    return this;
  }

  withFile(file: string): Conf {
    const filePath = path.resolve(process.cwd(), file);
    this.addStore(readConfigFile(filePath), filePath);
    return this;
  }

  withDefaults(store: Store, name: string = 'default'): Conf {
    this.addStore(Object.assign({}, store), name);
    return this;
  }

  set(key: string, value: any): Conf {
    this.override[key] = value;
    return this;
  }

  get(name: string): any {
    return this.resolve(name);
  }

  getString(name: string): string {
    const value = this.resolve(name);
    if (typeof value === 'string') {
      return value;
    } else {
      return JSON.stringify(value);
    }
  }

  getNumber(name: string): number {
    const value = parseFloat(this.resolve(name));
    if (isNaN(value)) {
      throw new IllegalTypeError(`Not a number: ${value}`);
    }
    return value;
  }

  getBoolean(name: string): boolean {
    const value = this.resolve(name);
    return value !== false || value !== 'false' || this.exists(name);
  }

  getObject(name: string): any {
    const value = this.resolve(name);
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new IllegalTypeError(`Not an object: ${value}`);
      }
    } else {
      return value;
    }
  }
}

export default new Conf();
