import React = require('react');
import ReactDOM = require('react-dom');
import Root from './components/Root';

const options = { bundleTarget: localStorage.getItem('TESSELLATE_BUNDLE_TARGET') || '' };
ReactDOM.render(React.createElement(Root, options), document.getElementById('main'));
