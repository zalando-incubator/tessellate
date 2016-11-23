// @flow

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
