// @flow

import transform from './transform';
import createParser from './parsers';

import type { ParseOptions, ParseResult } from './parsers';

export type FileType = '.jsx' | '.json' | '.yaml' | '.xml';

export type File = {|
  content: string,
  extname: FileType
|};

export type TransformOptions = {
  root?: string
};

function createRootNode(type: string): ParseResult {
  return {
    type,
    props: null,
    children: []
  };
}

export default function transformWithOptions(file: File, opts: ParseOptions & TransformOptions): * {
  const root = opts.root ? createRootNode(opts.root) : null;
  return transform(file.content, createParser(file.extname, opts), root);
}
