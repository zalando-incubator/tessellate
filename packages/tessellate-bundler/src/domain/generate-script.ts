import { camelCase } from 'change-case';
import jsonPointer = require('json-ptr');
import prettier = require('prettier');

function getImportScript(moduleName: string, imported: string[]): string {
  const defaultImports = imported
    .filter(i => i.startsWith('default:'))
    .map(i => i.substring('default:'.length));
  const namedImports = imported.filter(i => !i.startsWith('default:'));
  const scripts: string[] = [];

  if (defaultImports.length === 1) {
    scripts.push(`import ${defaultImports[0]} from '${moduleName}';`);
  } else if (defaultImports.length > 1) {
    throw new Error(`More than 1 default import for ${moduleName}: ${defaultImports}`);
  }
  if (namedImports.length > 0) {
    scripts.push(`import { ${namedImports.join(', ')} } from '${moduleName}';`);
  }
  return scripts.join('\n');
}

export type Props = { [key: string]: any } | null;
type Imports = { [name: string]: string[] };

type ScriptArgs = {
  rootId: string;
  props: Props;
  elementScript: string;
  imports: Imports;
};

function getRootScript({ rootId, props, elementScript, imports }: ScriptArgs): string {
  const script = `
  import React from 'react';
  import ReactDOM from 'react-dom';
  ${Object.keys(imports)
    .map(name => getImportScript(name, imports[name]))
    .join('\n')}

  export const Root = props => {
    return (
      <div id="${rootId}" data-props={JSON.stringify(props)}>
        {getElements(props)}
      </div>
    );
  };

  const getElements = props => {
    const bundledProps = ${JSON.stringify(props)};
    const mergedProps = Object.assign({}, bundledProps, props);
    const getProps = pointerFn => pointerFn(mergedProps);
    return ${elementScript.trim()};
  };

  export default function render(element) {
    const props = JSON.parse(element.getAttribute('data-props'));
    ReactDOM.render(getElements(props), element);
  }
  `;
  return prettier.format(script);
}

function resolveElementType(type: string): { className: string; imports: Imports } {
  // Try to match '<node-module-name>.<component-name>'
  const [moduleName, componentName] = type.split('.');

  if (moduleName && componentName) {
    // Add a module import based on the type.
    let className: string;
    const imports: Imports = {};

    if (componentName === 'default') {
      // Import is 'import <import-name> from <node-module-name>'
      const importName = camelCase(moduleName);
      imports[moduleName] = [`default:${importName}`];
      className = importName;
    } else {
      // Import is 'import { <component-name> } from '<node-module-name>'
      const [importName] = (componentName.match(/^([^\.]+)\.?(.+)?/) || []).slice(1);
      imports[moduleName] = [importName];
      className = componentName;
    }

    return { className, imports };
  } else if (moduleName) {
    // Type is a literal React component name (e.g. 'div')
    return { className: `'${moduleName}'`, imports: {} };
  } else {
    throw new Error(`Illegal element type ${type}`);
  }
}

function resolveReference(ref: string): string {
  const pointerFn = jsonPointer.create(ref).get.toString();
  return `getProps(${pointerFn})`;
}

function resolvePropValue(prop: any): any {
  if (typeof prop === 'object' && typeof prop.$ref === 'string') {
    return resolveReference(prop.$ref);
  } else {
    return prop;
  }
}

function resolveProps(props: Props): Props | null {
  if (!props) return null;
  return Object.keys(props).reduce(
    (obj, key) => Object.assign(obj, { [key]: resolvePropValue(props[key]) }),
    {}
  );
}

function stringifyProps(props: Props): string {
  if (props === null) {
    return 'null';
  }
  let s = '{';
  for (const key of Object.getOwnPropertyNames(props)) {
    if (s !== '{') s += ', ';
    const val = props[key];
    if (typeof val === 'string' && val.startsWith('getProps(function')) {
      s += `"${key}": ${val}`;
    } else {
      s += `"${key}": ${JSON.stringify(val)}`;
    }
  }
  return s + '}';
}

type Ref = {
  $ref: string;
};

type LayoutObject = {
  type: string;
  props: Props | null;
  children: LayoutElement[];
};

type LayoutElement = LayoutObject | string | Ref;

type ScriptObject = { script: string; imports: Imports };

function stringToScript(s: string): ScriptObject {
  return { script: `\`${s}\``, imports: {} };
}

function refToScript(ref: Ref): ScriptObject {
  return { script: `${resolveReference(ref.$ref)}.toString()`, imports: {} };
}

function objectToScript(element: LayoutObject): ScriptObject {
  const { className, imports } = resolveElementType(element.type);
  const props = resolveProps(element.props);
  const children = (element.children || []).map(elementToScript);
  const childScripts = children.map(child => child.script);
  const childImports = children.map(child => child.imports);
  const mergedImports: Imports = {};

  // Merge all unique imports.
  for (const imp of [imports, ...childImports]) {
    for (const key of Object.getOwnPropertyNames(imp)) {
      for (const value of imp[key]) {
        if (key in mergedImports) {
          if (!mergedImports[key].includes(value)) {
            mergedImports[key].push(value);
          }
        } else {
          mergedImports[key] = [value];
        }
      }
    }
  }

  const script = `
  React.createElement(
    ${className},
    ${stringifyProps(props)}${childScripts.length ? ', ' : ''}
    ${childScripts.join(', ')}
  )
  `;

  return { script, imports: mergedImports };
}

function elementToScript(element: LayoutElement): ScriptObject {
  if (typeof element !== 'object') {
    return stringToScript(element);
  }
  if (element.hasOwnProperty('$ref')) {
    return refToScript(element as Ref);
  }
  return objectToScript(element as LayoutObject);
}

export type Args = {
  layout: any;
  content: Props;
  rootId?: string;
};

export default function generateScript(args: Args) {
  if (
    typeof args.layout !== 'object' ||
    typeof args.layout.type !== 'string' ||
    typeof args.layout.props !== 'object' ||
    !Array.isArray(args.layout.children)
  ) {
    throw new Error('Illegal argument: not a layout element.');
  }

  const { script, imports } = elementToScript(args.layout);

  return getRootScript({
    rootId: args.rootId || 'root',
    props: args.content,
    elementScript: script,
    imports
  });
}
