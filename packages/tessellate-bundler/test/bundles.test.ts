/// <reference types="jest" />

import { Context } from 'koa';
import fs = require('mz/fs');
import path = require('path');
import createBundle from '../src/epics/bundles';

describe('bundles', () => {
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
    const result = await createBundle(ctx);
    expect(result.body).toBeDefined();
  });
});
