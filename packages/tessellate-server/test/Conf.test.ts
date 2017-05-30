import path = require('path');
import { Conf } from '../src/conf';

describe('Conf', () => {
  let conf: Conf;

  beforeEach(() => conf = new Conf());

  test('load a JSON file', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    expect(conf.get('example')).toBe('value');
  });

  test('load a YAML file', () => {
    conf.withFile(path.resolve(__dirname, 'conf.yaml'));
    expect(conf.get('example')).toBe('value');
  });

  test('override a value', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    conf.set('example', 'other');
    expect(conf.get('example')).toBe('other');
  });

  test('get an object', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    expect(conf.getObject('object')).toEqual({
      'whatIsCode': 42,
      'tautology': true
    });
  });

  test('get an array', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    expect(conf.getObject('array')).toEqual(['one', 'two']);
  });

  test('get a string', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    expect(conf.get('example')).toBe('value');
    expect(conf.getString('example')).toBe('value');
  });

  test('get number as string', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    expect(conf.getString('number')).toBe('42');
  });

  test('get a number', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    expect(conf.get('number')).toBe(42);
    expect(conf.getNumber('number')).toBe(42);
  });

  test('get a boolean', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    expect(conf.get('boolean')).toBe(true);
    expect(conf.getBoolean('boolean')).toBe(true);
  });

  test('get string as boolean', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    expect(conf.getBoolean('example')).toBe(true);
  });

  test('get an unset value as boolean', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    expect(conf.getBoolean('nothing')).toBe(false);
  });

  test('throw an IllegalTypeError', () => {
    conf.withFile(path.resolve(__dirname, 'conf.json'));
    expect(() => conf.getNumber('example')).toThrow();
  });

  test('get values from a store', () => {
    conf.withStore({ someDefault: 'default' });
    expect(conf.get('someDefault')).toEqual('default');
  });

  test('respect store order', () => {
    conf.withStore({ other: 'someValue' }, 'first');
    conf.withStore({ example: 'firstValue' }, 'second');
    conf.withStore({ example: 'secondValue' }, 'third');
    expect(conf.get('example')).toEqual('firstValue');
  });

  test('get environment variable as string', () => {
    process.env['EXAMPLE'] = 'value';
    conf.withEnv();
    expect(conf.get('EXAMPLE')).toEqual('value');
  });

  test('get environment variable as number', () => {
    process.env['NUMBER'] = '42';
    conf.withEnv();
    expect(conf.getNumber('NUMBER')).toEqual(42);
  });

  test('transform environment variable names to CONSTANT_CASE', () => {
    process.env['SOME_EXAMPLE'] = 'value';
    conf.withEnv();
    expect(conf.get('someExample')).toEqual('value');
  });

  test('use environment variable prefixes', () => {
    process.env['TEST_EXAMPLE'] = 'value';
    conf.withEnv('test');
    expect(conf.get('example')).toEqual('value');
  });
});
