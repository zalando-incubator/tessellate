// @flow

import type { JSONMap, ParseOptions, ParseCallbacks, ParseResult, Parser } from './';

type JSONObject = { [key: string]: number | string | boolean | null | JSONType };
type JSONArray = Array<number | string | boolean | null | JSONObject>;
type JSONType = JSONObject | JSONArray;

const defaultJsonMap = {
  typeKeys: ['type'],
  childrenKeys: ['children'],
  typeMap: {}
};

function findType(json: JSONObject, jsonMap: JSONMap): ?string {
  for (let key of jsonMap.typeKeys) {
    if (key in json && typeof json[key] === 'string') {
      if (jsonMap.typeMap && json[key] in jsonMap.typeMap) return jsonMap.typeMap[json[key]];
      else return json[key];
    }
  }
}

function parseType(json: JSONObject, jsonMap: JSONMap, prefix?: string): ?string {
  const type = findType(json, jsonMap);
  return type && prefix && /^[A-Z]/.test(type) ? `${prefix}${type}` : type;
}

function processJSONObject(json: JSONObject, callbacks: ParseCallbacks, opts: ParseOptions) {
  const jsonMap = opts.jsonMap || defaultJsonMap;
  const type = parseType(json, jsonMap, opts.typePrefix);
  const props = {};
  const childrenAndLiteralKeys = [];
  const literalKeys = jsonMap.literalKeys || [];
  const ignoreKeys = jsonMap.ignoreKeys || [];

  for (let key of Object.keys(json)) {
    if (jsonMap.childrenKeys.includes(key) || literalKeys.includes(key)) {
      childrenAndLiteralKeys.push(key);
    } else if (!ignoreKeys.includes(key) && !jsonMap.typeKeys.includes(key)) {
      props[key] = json[key];
    }
  }

  let jsonNode: ParseResult | null = null;

  if (type) {
    jsonNode = {
      type,
      props: Object.keys(props).length > 0 ? props : null,
      children: ([]: Array<ParseResult>)
    };
  }

  if (jsonNode) callbacks.onEnter(jsonNode);

  for (let key of childrenAndLiteralKeys) {
    if (
      jsonMap.childrenKeys.includes(key) && jsonNode && json[key] && typeof json[key] === 'object'
    ) {
      parseJSON(json[key], callbacks, opts);
    } else if (literalKeys.includes(key) && typeof json[key] === 'string') {
      callbacks.onLiteral(json[key]);
    }
  }

  if (jsonNode) callbacks.onLeave(jsonNode);
}

function parseJSON(json: JSONType, callbacks: ParseCallbacks, opts: ParseOptions) {
  if (Array.isArray(json)) {
    for (let object of json) {
      if (object && typeof object === 'object') {
        processJSONObject(object, callbacks, opts);
      } else if (typeof object === 'string') {
        callbacks.onLiteral(object);
      }
    }
  } else {
    processJSONObject(json, callbacks, opts);
  }
}

export default function createParser(opts: ParseOptions = {}): Parser<string | JSONType> {
  return (json: string | JSONType, callbacks: ParseCallbacks) => {
    const object = typeof json === 'string' ? JSON.parse(json) : json;
    return parseJSON(object, callbacks, opts);
  };
}
