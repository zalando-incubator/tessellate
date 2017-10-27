const http = require('http');
const path = require('path');
const Tailor = require('node-tailor');

const filterRequestHeaders = (attributes, request) => {
  const { headers = {} } = request;
  return headers;
};

const requireJSVersion = '2.3.5';

const options = {
  templatesPath: path.resolve(__dirname, 'templates'),
  amdLoaderUrl: `https://cdnjs.cloudflare.com/ajax/libs/require.js/${requireJSVersion}/require.min.js`,
  filterRequestHeaders
};

const tailor = new Tailor(options);
const server = http.createServer(tailor.requestHandler);
const port = 3005;

server.listen(port);
console.info('Tailor is listening on port %d', port);
