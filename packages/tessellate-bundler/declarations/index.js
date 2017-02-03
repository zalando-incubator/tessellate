declare type TessellateBundle = {
  js: {
    name: string;
    source: string;
  };
  css?: {
    name: string;
    source: string;
  };
};

declare type TessellateElement = {
  type: string;
  style?: string;
  props: { [key: string]: any } | null;
  children?: Array<TessellateElement | string>;
};
