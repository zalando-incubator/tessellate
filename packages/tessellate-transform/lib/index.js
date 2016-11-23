// @flow

import parseJSX from './parsers/jsx-parser'

import type { ParseOptions } from './parsers'

export type File = {|
  content: string;
  extname: '.jsx' | '.json' | '.yaml' | '.xml';
|};

export default async function parse(file: File, opts: ParseOptions): Promise<*> {
  switch(file.extname) {
    case '.jsx':
      return parseJSX(file.content, opts)
    default:
      throw new Error(`Unsupported file type ${file.extname}`)
  }
}
