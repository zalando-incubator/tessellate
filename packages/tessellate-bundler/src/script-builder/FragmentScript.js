// @flow

type FragmentArgs = {|
  reactElement: string;
  rootID: string;
  props: { [key: string]: any };
  imports: { [key: string]: string };
|}

function importScript(module: string, imported: Array<string> | string): string {
  if (Array.isArray(imported)) {
    return `import { ${imported.join(', ')} } from '${module}'`
  } else {
    return `import ${imported} from '${module}'`
  }
}

export default function fragmentScript(args: FragmentArgs): string {
  return `
  import React, { Component } from 'react'
  import ReactDOM from 'react-dom'
  ${Object.keys(args.imports).map(name => importScript(name, args.imports[name])).join('\n')}

  const BUNDLED_PROPS = ${JSON.stringify(args.props)}

  export class Fragment extends Component {
    render() {
      const props = Object.assign({}, BUNDLED_PROPS, this.props)
      return (<div id="${args.rootID}" data-props={JSON.stringify(this.props)}>
        {${args.reactElement}}
      </div>)
    }
  }

  export default function render(element) {
    const fragmentRoot = document.getElementById('${args.rootID}')
    const props = JSON.parse(fragmentRoot.getAttribute('data-props'))
    ReactDOM.render(<Fragment {...props}/>, element)
  }
  `.trim().replace(/^\s+/gm, '')
}
