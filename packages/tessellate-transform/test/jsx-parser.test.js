import createParser from '../lib/parsers/jsx-parser';
import { traverse } from './helpers';

describe('jsx-parser', () => {
  it('should traverse a JSX tree', () => {
    const jsx = '<div><h1>Hello, world!</h1></div>';
    const parse = createParser();
    const result = traverse(parse, jsx);

    expect(result.nodes.length).toEqual(0);
    expect(result.entered[0].type).toEqual('div');
    expect(result.entered[1].type).toEqual('h1');
    expect(result.left.length).toEqual(2);
    expect(result.literals).toEqual(['Hello, world!']);
  });
});
