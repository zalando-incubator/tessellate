/// <reference types="jest" />

jest.mock('mkdirp', () => (_: string, callback: () => void) => callback());
require('mz/fs').writeFile = jest.fn(() => Promise.resolve());

import { Context } from 'koa';
import fs = require('mz/fs');
import path = require('path');
import createBundle from '../src/epics/bundles';

describe('bundles', () => {
  beforeEach(() => jest.resetAllMocks());

  test('create bundle response', async () => {
    const json = await fs.readFile(path.resolve(__dirname, 'fixtures', 'content.json'));
    const body = json.toString();
    const ctx = {
      params: {
        domain: 'foo',
        name: 'bar'
      },
      request: {
        body
      }
    } as Context;

    await createBundle(ctx);

    expect(ctx.status).toBe(201);
    expect(typeof ctx.body).toBe('object');
  });
});
