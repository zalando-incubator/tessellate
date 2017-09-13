/// <reference types="jest" />

jest.mock('mkdirp', () => (_: string, callback: () => void) => callback());
require('mz/fs').writeFile = jest.fn(() => Promise.resolve());

import fs = require('mz/fs');
import path = require('path');
import createWebpackSandbox from 'webpack-sandboxed';
import * as bundleService from '../src/bundle-service';

describe('bundle-service', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

  beforeEach(() => (jest.resetAllMocks()));

  test('ensure webpack-sandboxed works', async () => {
    const webpackSandbox = await createWebpackSandbox();
    const [bundle] = await webpackSandbox.run('module.exports = 42;');
    expect(Object.keys(bundle).length).toBe(1);
    expect(Object.keys(bundle)[0]).toMatch(/^main\.\S+\.js$/);
  });

  test('make a bundle from a source string', async () => {
    const source = await fs.readFile(path.resolve(__dirname, 'fixtures', 'fragment-script.js'));
    const bundle = await bundleService.make(source.toString());
    expect(bundle.js).toBeDefined();
    expect(bundle.css).not.toBeDefined();
    expect(bundle.js.name).toMatch(/\.js$/);
    expect(bundle.js.source.toString()).toMatchSnapshot();
  });
});
