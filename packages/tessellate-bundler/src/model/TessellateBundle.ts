export type File = {
  name: string;
  data: Buffer;
};

export type TessellateBundle = {
  [extname: string]: File[];
};

export default TessellateBundle;
