// @flow

type FragmentArgs = {|
  reactElement: string;
  rootID: string;
  props: { [key: string]: any };
  imports: { [key: string]: string };
|}

function ImportScript(name: string, module: string): string {
  return `import ${name} from '${module}'`
}

export default function FragmentScript(args: FragmentArgs): string {
  return `
  import React, { Component } from 'react'
  import ReactDOM from 'react-dom'
  ${Object.keys(args.imports).map(name => ImportScript(name, args.imports[name])).join('\n')}

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
