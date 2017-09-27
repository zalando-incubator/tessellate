import fs = require('mz/fs');
import path = require('path');
import generateScript from '../../src/domain/generate-script';

describe('script-builder', () => {
  (jest as any).setTimeout(30000);

  it('should build a fragment script string from a content structure', async () => {
    const json = await fs.readFile(path.resolve(__dirname, '../fixtures/content.json'));
    const layout = JSON.parse(json.toString());
    const result = generateScript({ layout, content: {} });
    expect(typeof result).toBe('string');
    expect(result).toMatchSnapshot();
  });

  it('should build a fragment script string with multiple component imports', async () => {
    const layout = {
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
    const result = generateScript({ layout, content: {} });
    expect(typeof result).toBe('string');
    expect(result).toMatchSnapshot();
  });
});
