"use-strict";

var fragments = document.getElementsByTagName('fragment')
var fragmentPaths = {}
var fragmentNames = []
var i = 0
for (i = 0; i < fragments.length; i += 1) {
  var fragmentName = fragments[i].getAttribute('id')
  var fragmentSrc = fragments[i].getAttribute('src').replace(/\.js$/, '')
  fragmentNames.push(fragmentName)
  fragmentPaths[fragmentName] = fragmentSrc
}

var paths = {
  'react': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react.min',
  'react-dom': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react-dom.min'
}

requirejs.config({
  paths: Object.assign({}, paths, fragmentPaths)
})

require(fragmentNames, function() {
  var i = 0
  var fragment = null
  for (i = 0; i < fragmentNames.length; i += 1) {
    arguments[i].default(document.getElementById(fragmentNames[i]))
  }
}, function(error) {
  console.error(error)
})
