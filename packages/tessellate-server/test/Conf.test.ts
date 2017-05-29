import path = require('path');
import conf from '../src/conf';

describe('Conf', () => {
  conf.withFile(path.resolve(__dirname, 'conf.yaml'));

  it('should store a value', () => {
    const foo = conf.get('foo');
    expect(foo).toBe('bar');
  });

  it('should store a string value', () => {
    const foo = conf.getString('foo');
    expect(foo).toBe('bar');
  });

  it('should store an object value', () => {
    const bar = conf.getObject('bar');
    expect(bar).toEqual({ what: 'is', code: 42 });
  });

  it('should set a value', () => {
    conf.set('newValue', '41');
    const value = conf.get('newValue');
    expect(value).toEqual('41');
  });

  it('should use defaults', () => {
    conf.withDefaults({ SOME_DEFAULT: 'default' });
    const value = conf.get('SOME_DEFAULT');
    expect(value).toEqual('default');
  });
});
