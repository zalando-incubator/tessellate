// @flow

import uuid from 'uuid'
import logger from '../logger'
import { camelCase } from 'change-case'
import FragmentScript from './FragmentScript'
import CreateElementScript from './CreateElementScript'
import { Problem } from '../error'

const log = logger('script-builder')

export type ElementType = {
  type: string;
  props: { [key: string]: any } | null;
  children?: Array<ElementType | string>;
}

type ReactScript = {
  script: string;
  props: Object;
  imports: Object;
}

class ElementProblem extends Problem {
  constructor(detail: string) {
    super({title: 'Element error.', detail, status: 400})
  }
}

export function build(element: ElementType): string {
  log.debug('Build fragment script...')
  const {script, props, imports} = toReactScript(element)
  return FragmentScript({reactElement: script, props, imports})
}

function toReactScript(element: ElementType | string, props: Object = {}, imports: Object = {}): ReactScript {
  // Atomic element, e.g. string content of a headline.
  if (typeof element === 'string')
    return {script: `"${element}"`, props, imports}

  const {className, imported} = parseElementType(element)
  const id = uuid.v4()
  props[id] = element.props

  if (imported)
    imports[imported.name] = imported.module

  const children = toReactScripts(element.children, props, imports)

  const {childScripts, childProps} = children.reduce(({childScripts, childProps}, {script, props}) => ({
    childScripts: childScripts.concat(script),
    childProps: Object.assign(childProps, props)
  }), {childScripts: [], childProps: {}})

  const script = CreateElementScript({className, propsId: id, children: childScripts})

  return {script, props: Object.assign(props, childProps), imports}
}

function toReactScripts(elements: ?Array<ElementType | string>, props: Object, imports: Object): Array<ReactScript> {
  if (Array.isArray(elements))
    return elements.map(child => toReactScript(child, props, imports))
  else
    return []
}

function parseElementType(element: ElementType): {|className: string, imported?: {name: string, module: string}|} {
  const parts = element.type.split('.')
  if (parts.length > 2)
    throw new ElementProblem(`Illegal element type ${element.type}`)
  if (parts.length === 2) {
    const name = camelCase(parts[0])
    const module = parts[0]
    const className = `${name}.${parts[1]}`
    return {className, imported: {name, module}}
  } else {
    const name = camelCase(element.type)
    const module = element.type
    const className = `'${name}'`
    return  {className}
  }
}
