export type JSBundle = {
  name: string;
  source: Buffer;
};

export type CSSBundle = {
  name: string;
  source: Buffer;
};

export type TessellateBundle = {
  js: JSBundle;
  css?: CSSBundle;
};

export default TessellateBundle;
