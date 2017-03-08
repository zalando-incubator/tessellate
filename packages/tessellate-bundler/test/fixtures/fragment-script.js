import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export class Fragment extends Component {
  render() {
    return <h1>Welcome to {this.props.requestURI}!</h1>;
  }
}

export default function render(element) {
  const props = JSON.parse(element.getAttribute('data-props'));
  ReactDOM.render(<Fragment {...props} />, element);
}
