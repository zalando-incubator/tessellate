(function() {
  'use strict';
  var fragments = document.getElementsByTagName('fragment');
  var fragmentPaths = {};
  var fragmentNames = [];
  var i, fragmentName, fragmentSrc;

  for (i = 0; i < fragments.length; i += 1) {
    fragmentName = fragments[i].getAttribute('id');
    fragmentSrc = fragments[i].getAttribute('src').replace(/\.js$/, '');
    fragmentNames.push(fragmentName);
    fragmentPaths[fragmentName] = fragmentSrc;
  }

  var libraryPaths = {
    react: 'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react.min',
    'react-dom': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react-dom.min'
  };

  requirejs.config({
    paths: Object.assign({}, libraryPaths, fragmentPaths)
  });

  function isFunction(object) {
    return object && typeof object === 'function';
  }

  function getRenderFunction(umd) {
    if (isFunction(umd.default)) return umd.default;
    else if (isFunction(umd.exports)) return umd.exports;
    else if (umd.module && isFunction(umd.module.exports)) return umd.module.exports;
    else console.error('No exported function found in module.');
  }

  // RequireJS function to require all fragment scripts.
  // Callback will we called with the loaded modules.
  require(fragmentNames, function() {
    var i,
      render = null;

    console.debug('Render fragments:', fragmentNames.join(','));

    for (i = 0; i < fragmentNames.length; i += 1) {
      render = getRenderFunction(arguments[i]);
      if (render) render(document.getElementById(fragmentNames[i]));
    }
  }, function(error) {
    console.error(error);
  });
})();
