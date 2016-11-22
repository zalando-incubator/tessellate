// @flow

import parseJSX from './parsers/jsx-parser'

export type File = {|
  content: string;
  extname: '.jsx' | '.json' | '.yaml' | '.xml';
|};

export type ParseOptions = {
  typePrefix?: string;
};

export async function parse(file: File, opts: ParseOptions): Promise<Object> {
  switch(file.extname) {
    case '.jsx':
      return parseJSX(file.content, opts)
    default:
      throw new Error(`Unsupported file type ${file.extname}`)
  }
}
