// @flow

import fs from 'fs';
import path from 'path';
import nconf from 'nconf';
import yaml from 'js-yaml';

function fileExists(file: string): boolean {
  try {
    fs.statSync(file);
  } catch (e) {
    if (e.code == 'ENOENT') return false;
    else throw e;
  }
  return true;
}

function readFile(file: string, parser: (s: string) => Object): Object {
  try {
    return parser(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    process.stderr.write(`Unable to read ${file}`);
    return {};
  }
}

function readJsonFile(file: string): Object {
  return readFile(file, JSON.parse);
}

function readYamlFile(file: string): Object {
  return readFile(file, yaml.safeLoad);
}

function readYamlOrJsonFile(file: string): Object {
  const basePath = file.replace(path.extname(file), '');
  const jsonPath = basePath + '.json';
  const yamlPath = basePath + '.yaml';

  if (fileExists(yamlPath)) {
    return readYamlFile(yamlPath);
  } else if (fileExists(jsonPath)) {
    return readJsonFile(jsonPath);
  } else {
    process.stderr.write(`No such file: ${file}`);
    return {};
  }
}

const readConfigFile = () => readYamlOrJsonFile(path.resolve(process.cwd(), 'config'));

class IllegalTypeError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function parseConfigValue(value: mixed): Object {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      throw new IllegalTypeError('Cannot parse: ' + value);
    }
  } else if (typeof value === 'object' && value) {
    return value;
  } else {
    throw new IllegalTypeError('Not a valid object: ' + JSON.stringify(value));
  }
}

nconf
  .use('memory')
  .argv()
  .env()
  .add('config', { type: 'literal', store: readConfigFile() })
  .defaults({
    MORGAN_FORMAT: 'common',
    MORGAN_THRESHOLD: 0
  });

export default {
  set: (key: string, value: any) => nconf.set(key, value),
  get: (key: string) => nconf.get(key),
  getObject: (key: string) => parseConfigValue(nconf.get(key)),
  getString: (key: string) => '' + nconf.get(key),
  argv: function(args: Object) {
    nconf.argv(args);
    return this;
  },
  defaults: function(defaults: Object) {
    nconf.defaults(defaults);
    return this;
  }
};
