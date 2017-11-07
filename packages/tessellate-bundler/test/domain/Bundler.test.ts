jest.mock('mkdirp', () => (_: string, callback: () => void) => callback());
require('mz/fs').writeFile = jest.fn(() => Promise.resolve());

import fs = require('mz/fs');
import path = require('path');
import createWebpackSandbox from 'webpack-sandboxed';
import Bundler from '../../src/domain/Bundler';
import WebpackFactory from '../../src/domain/WebpackFactory';

describe('Bundler', () => {
  (jest as any).setTimeout(30000);

  beforeEach(() => jest.resetAllMocks());

  test('ensure webpack-sandboxed works', async () => {
    const webpackSandbox = await createWebpackSandbox();
    const [bundle] = await webpackSandbox.run('module.exports = 42;');
    expect(Object.keys(bundle).length).toBe(1);
    expect(Object.keys(bundle)[0]).toMatch(/^main\.\S+\.js$/);
  });

  test('make a bundle from a source string', async () => {
    const webpackRunner = await new WebpackFactory().createInstance();
    const bundler = new Bundler({ webpackRunner });

    const source = await fs.readFile(path.resolve(__dirname, '../fixtures/fragment-script.js'));
    const bundle = await bundler.compile(source.toString());
    expect(bundle.js).toBeDefined();
    expect(bundle.css).toBeUndefined();
    expect(bundle.js[0].name).toMatch(/\.js$/);
    expect(bundle.js[0].data.toString()).toMatchSnapshot();
  });
});
