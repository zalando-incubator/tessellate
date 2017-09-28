export type File = {
  name: string;
  data: Buffer;
};

export type TessellateBundle = {
  js: File[];
  css: File[];
};

export default TessellateBundle;
