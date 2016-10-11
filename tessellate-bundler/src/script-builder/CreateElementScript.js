// @flow

type CreateElementArgs = {|
  className: string;
  propsId: string;
  children: Array<string>;
|}

export default function CreateElementScript(args: CreateElementArgs): string {
  return `
  React.createElement(
    ${args.className},
    props["${args.propsId}"] ${args.children.length ? ', ' : ''}
    ${args.children.join(', ')}
  )
  `.trim().replace(/^\s+/gm, '')
}
