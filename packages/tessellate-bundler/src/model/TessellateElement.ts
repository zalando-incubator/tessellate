export type TessellateElement = {
  type: string;
  style?: string;
  props: { [key: string]: any } | null;
  children?: Array<TessellateElement | string>;
};

export default TessellateElement;
