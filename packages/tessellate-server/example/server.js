// @flow

import { TessellateServer, Problem } from '../src'
import { Observable } from 'rxjs'

const server = new TessellateServer()

server.use((ctx, next) => {
  console.log('Hi, this is middleware.')
  return next()
})

server.router.get('/', o => o.mapTo('Hello!'))

server.router.get('/error', o => o.switchMapTo(Observable.throw(
  new Problem({
    title: 'Teapot',
    detail: 'I am a teapot.',
    status: 418
  }))
))

server.start(3001)
