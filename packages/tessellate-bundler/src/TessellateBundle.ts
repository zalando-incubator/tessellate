export type JSBundle = {
  name: string;
  source: string;
};

export type CSSBundle = {
  name: string;
  source: string;
};

type TessellateBundle = {
  js: JSBundle;
  css?: CSSBundle;
};

export default TessellateBundle;
