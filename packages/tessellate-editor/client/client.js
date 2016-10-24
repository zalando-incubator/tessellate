import React from 'react'
import ReactDOM from 'react-dom'
import yaml from 'js-yaml'
import Root from './containers/Root'
import config from '../config.yaml'

const options = yaml.safeLoad(config)

ReactDOM.render(<Root options={options}/>, document.getElementById('main'))
