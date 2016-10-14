// @flow

import uuid from 'uuid'
import logger from '../logger'
import { camelCase, constantCase } from 'change-case'
import FragmentScript from './FragmentScript'
import CreateElementScript from './CreateElementScript'
import { Problem } from '../error'

const log = logger('script-builder')

export type ElementType = {
  type: string;
  style?: string;
  props: { [key: string]: any } | null;
  children?: Array<ElementType | string>;
}

type ReactScript = {
  script: string;
  props: Object;
  imports: Object;
}

type PropsType = {[key: string]: any}
type ImportsType = {[key: string]: string}

class ElementProblem extends Problem {
  constructor(detail: string) {
    super({title: 'Element error.', detail, status: 400})
  }
}

export function build(element: ElementType): string {
  log.debug('Build fragment script...')
  const {script, props, imports} = toReactScript(element)
  return FragmentScript({reactElement: script, rootID: uuid.v4(), props, imports})
}

function toReactScript(element: ElementType | string, props: PropsType = {}, imports: ImportsType = {}): ReactScript {
  // Atomic element, e.g. string content of a headline.
  if (typeof element === 'string')
    return {script: `\`${element}\``, props, imports}

  const {className, imported} = parseElementType(element)
  const id = uuid.v4()
  props[id] = element.props

  if (imported) Object.assign(imports, imported)

  const children = toReactScripts(element.children, props, imports)

  const {childScripts, childProps} = children.reduce(({childScripts, childProps}, {script, props}) => ({
    childScripts: childScripts.concat(script),
    childProps: Object.assign(childProps, props)
  }), {childScripts: [], childProps: {}})

  const script = CreateElementScript({className, propsId: id, children: childScripts})

  return {script, props: Object.assign(props, childProps), imports}
}

function toReactScripts(elements: ?Array<ElementType | string>, props: PropsType, imports: ImportsType): Array<ReactScript> {
  if (Array.isArray(elements))
    return elements.map(child => toReactScript(child, props, imports))
  else
    return []
}

function parseElementType(element: ElementType): {|className: string; imported?: ImportsType;|} {
  if (!element.type)
    throw new ElementProblem('Missing element type on ' + JSON.stringify(element))

  // Try to match '<node-module-name>.<component-name>'
  const [_, moduleName, componentName] = element.type.match(/^([^\.]+)\.?(.+)?/) || []

  if (moduleName && componentName) {
    // Module imports for this element.
    const imported = {}
    // Add a module import based on the type.
    const importName: string = camelCase(moduleName)
    imported[importName] = moduleName
    // If a style attribute is present, add a module import for it.
    const style: ?string = constantCase(element.style)
    if (style) imported[style] = element.style
    // The React class name is '<import-name>.<component-name>'
    const className = `${importName}.${componentName}`
    return {className, imported}
  }
  // Type is a literal React component name (e.g. 'div')
  else if (moduleName) {
    const name: string = camelCase(moduleName)
    const module = moduleName
    const className = `'${name}'`
    return  {className}
  }
  else
    throw new ElementProblem(`Illegal element type ${element.type}`)
}
