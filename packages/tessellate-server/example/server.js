// @flow

import { TessellateServer } from '../src'

const server = new TessellateServer()

server.router.get('/', observable => observable.mapTo('Hello, tessellate!'))

server.start(3001)
console.log('listening on http://localhost:3001')
