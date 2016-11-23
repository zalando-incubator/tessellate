// @flow

import type { FileType } from '../'

import createJSXParser from './jsx-parser'
import createJSONParse from './json-parser'

type JSONMap = {
  typeKeys: Array<string>;
  childrenKeys: Array<string>;
  literalKeys: Array<string>;
  ignoreKeys: Array<string>;
};

export type ParseOptions = {
  typePrefix?: string;
  jsonMap?: JSONMap;
};

type ParseResultObject = {
  type: string;
  props: Object | null;
  children: Array<ParseResultObject | ParseResultString>;
};

type ParseResultString = string;

export type ParseResult = ParseResultObject | ParseResultString;

export type ParseCallbacks = {|
  onEnter: (node: ParseResult) => void;
  onLeave: (node: ParseResult) => void;
  onLiteral: (literal: string) => void;
|};

export type Parser = (content: string, callbacks: ParseCallbacks) => void

export default function createParser(type: FileType, opts: ParseOptions): Parser {
  switch(type)  {
    case '.jsx':
      return createJSXParser(opts)
    case '.json':
      return createJSONParse(opts)
    default:
      throw new Error(`Unsupported type ${type}`)
  }
}
