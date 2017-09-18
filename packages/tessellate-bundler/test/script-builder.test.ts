jest.mock('uuid');

import fs = require('mz/fs');
import path = require('path');
import * as scriptBuilder from '../src/script-builder';

describe('script-builder', () => {
  (jest as any).setTimeout(20000);

  const uuid = require('uuid');
  uuid.v4.mockImplementation(mockUUID());

  it('should build a fragment script string from a content structure', async () => {
    const json = await fs.readFile(path.resolve(__dirname, 'fixtures', 'content.json'));
    const element = JSON.parse(json.toString());
    const result = scriptBuilder.build(element);
    expect(typeof result).toBe('string');
    expect(result).toMatchSnapshot();
  });

  it('should build a fragment script string with multiple component imports', async () => {
    const element = {
      type: 'node-module-a.MyComponent1',
      props: null,
      children: [
        {
          type: 'node-module-a.MyComponent2',
          props: null,
          children: []
        },
        {
          type: 'node-module-a.MyComponent2',
          props: null,
          children: []
        },
        {
          type: 'node-module-b.MyComponent.FooBar',
          props: null,
          children: []
        }
      ]
    };
    const result = scriptBuilder.build(element);
    expect(typeof result).toBe('string');
    expect(result).toMatchSnapshot();
  });
});

function mockUUID(): () => number {
  let i = 0;
  return () => ++i;
}
