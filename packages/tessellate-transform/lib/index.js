// @flow

import transform from './transform'
import createParser from './parsers'

import type { ParseOptions } from './parsers'

export type FileType = '.jsx' | '.json' | '.yaml' | '.xml';

export type File = {|
  content: string;
  extname: FileType;
|};

export default async function parse(file: File, opts: ParseOptions): Promise<*> {
  return transform(file.content, createParser(file.extname, opts))
}
