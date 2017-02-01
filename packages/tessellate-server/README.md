# tessellate-server

Web service runtime for tessellate services.

### TessellateServer

```
import { TessellateServer } from 'tessellate-server'
```

##### constructor(options: Options = {})

* `name: string` Optional application name (see [koa.app.name](https://github.com/koajs/koa/blob/v2.x/docs/api/index.md#settings))

##### use(middleware: Middleware, defer: boolean = false): TessellateServer

Add koa [Middleware](https://github.com/koajs/koa/wiki#middleware) that runs **before** any routes are handled. If `defer` is set to `true`, the middleware will run **after** all routes. Also see [koa.app.use](https://github.com/koajs/koa/blob/v2.x/docs/api/index.md#appusefunction).

##### start(port: number | string, metricsPort?: number | string): Promise<TessellateServer>

Start the koa application server and [prometheus](https://github.com/siimon/prom-client) metrics server on the specified ports. The default value for `metricsPort` is `port + 1`.

##### TessellateServer.router

[koa-rx-router](https://github.com/mfellner/koa-router-rx) instance. Use it to add routes.

##### stop(): Promise<any>

Stop all koa servers.

### nconf

```javascript
import { nconf } from 'tessellate-server'
```

Wrapper around [nconf](https://github.com/indexzero/nconf) with default values and convenience methods.

* `set(key: string, value: any)` - see [nconf](https://github.com/indexzero/nconf)
* `get(key: string)` - see [nconf](https://github.com/indexzero/nconf)
* `getObject(key: string): Object` - see `get`
* `getString(key: string): string` - see `get`
* `argv(args: Object)` - see [nconf](https://github.com/indexzero/nconf#argv)
* `defaults(defaults: Object)` - see [nconf](https://github.com/indexzero/nconf)

### Problem

```javascript
import { Problem } from 'tessellate-server'
```

A throwable Error class modeled after [Zalando Problem](https://github.com/zalando/problem).

### Example

Run `npm start` or check out the code below:

```javascript
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
```
