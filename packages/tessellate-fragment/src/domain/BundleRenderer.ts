import React = require('react');
import ReactDOMServer = require('react-dom/server');
import SandboxVM from './SandboxVM';

export default class BundleRenderer {
  private readonly sandbox: SandboxVM;

  constructor() {
    this.sandbox = new SandboxVM({ require });
  }

  public renderToString(source: string, props: object = {}): string {
    const { Fragment } = this.sandbox.run(source);
    return ReactDOMServer.renderToString(React.createElement(Fragment, props));
  }
}
