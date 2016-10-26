import React from 'react'
import ReactDOM from 'react-dom'
import yaml from 'js-yaml'
import Root from './containers/Root'

const element = document.getElementById('main')
const options = JSON.parse(element.getAttribute('data-props'))
ReactDOM.render(<Root options={options}/>, element)
