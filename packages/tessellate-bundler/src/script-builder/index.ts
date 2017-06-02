import uuid = require('uuid');
import { camelCase } from 'change-case';
import { log, Problem } from 'tessellate-server';
import TessellateElement from '../TessellateElement';
import createElementScript from './CreateElementScript';
import fragmentScript from './FragmentScript';

export type ReactScript = {
  script: string;
  props: { [key: string]: any };
  imports: { [key: string]: any };
};

type PropsType = { [key: string]: any };
type ImportsType = { [key: string]: (string[] | string) };

class ElementProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'TessellateElement error.', detail, status: 400 });
  }
}

function processChildren(children: ReactScript[]) {
  return children.reduce(
    ({ childScripts, childProps }, { script, props }) => ({
      childScripts: childScripts.concat(script),
      childProps: Object.assign(childProps, props)
    }),
    { childScripts: [] as string[], childProps: {} }
  );
}

export function build(element: TessellateElement): string {
  log.debug('Build fragment script...');
  const { script, props, imports } = toReactScript(element);
  return fragmentScript({ reactElement: script, rootID: uuid.v4(), props, imports });
}

function toReactScript(
  element: TessellateElement | string,
  props: PropsType = {},
  imports: ImportsType = {}
): ReactScript {
  // Atomic element, e.g. string content of a headline.
  if (typeof element === 'string') return { script: `\`${element}\``, props, imports };

  const { className } = parseElementType(element, imports);
  const id = uuid.v4();
  props[id] = element.props;

  const children = toReactScripts(element.children, props, imports);
  const { childScripts, childProps } = processChildren(children);

  const script = createElementScript({ className, propsId: id, children: childScripts });

  return { script, props: Object.assign(props, childProps), imports };
}

function toReactScripts(
  elements: Array<TessellateElement | string> | string | undefined,
  props: PropsType,
  imports: ImportsType
): ReactScript[] {
  if (typeof elements === 'string') return [toReactScript(elements, props, imports)];
  if (Array.isArray(elements)) return elements.map(child => toReactScript(child, props, imports));
  else return [];
}

function parseElementType(
  element: TessellateElement,
  imports: ImportsType
): { className: string, imports: ImportsType } {
  if (!element.type) throw new ElementProblem('Missing element type on ' + JSON.stringify(element));

  // Try to match '<node-module-name>.<component-name>'
  const [moduleName, componentName] = (element.type.match(/^([^\.]+)\.?(.+)?/) || []).slice(1);

  if (moduleName && componentName) {
    // If a style attribute is present, add a module import for it.

    if (element.style) {
      const styleImport = camelCase(element.style);
      imports[element.style] = styleImport;
    }

    // Add a module import based on the type.
    let className;
    // Them import is 'import <import-name> from <node-module-name>'
    if (componentName === 'default') {
      const importName: string = camelCase(moduleName);
      imports[moduleName] = importName;
      className = importName;
    } else {
      // The import is 'import { <component-name> } from '<node-module-name>'
      className = componentName;
      const [importName] = (componentName.match(/^([^\.]+)\.?(.+)?/) || []).slice(1);
      const imported = imports[moduleName];
      if (Array.isArray(imported)) {
        if (!imports[moduleName].includes(importName)) {
          imports[moduleName] = imported.concat(importName);
        }
      } else {
        imports[moduleName] = [importName];
      }
    }

    return { className, imports };
  } else if (moduleName) {
    // Type is a literal React component name (e.g. 'div')
    const name: string = camelCase(moduleName);
    const className = `'${name}'`;
    return { className, imports };
  } else throw new ElementProblem(`Illegal element type ${element.type}`);
}
