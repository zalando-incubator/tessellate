# tessellate-server

Web service runtime for tessellate services.

### TessellateServer

```typescript
import { TessellateServer } from 'tessellate-server'
```

##### constructor()

There are no options.

##### use(middleware: Middleware, defer: boolean = false): TessellateServer

Add koa [Middleware](https://github.com/koajs/koa/wiki#middleware) that runs **before** any routes are handled. If `defer` is set to `true`, the middleware will run **after** all routes. Also see [koa.app.use](https://github.com/koajs/koa/blob/v2.x/docs/api/index.md#appusefunction).

##### start(port: number, metricsPort?: number): Promise<TessellateServer>

Start the koa application server and an optional [prometheus](https://github.com/siimon/prom-client) metrics server on the specified ports. If no `metricsPort` is provided, prometheus will not be started.

##### TessellateServer.router

[koa-router](https://github.com/alexmingoia/koa-router) instance. Use it to add routes.

##### stop(): Promise<any>

Stop all koa servers.

### conf

```typescript
import { conf } from 'tessellate-server'
```

A hierarchical configuration provider inspired by [nconf](https://github.com/indexzero/nconf).

* `set(key: string, value: any)`
* `get(key: string): any`
* `getString(key: string): string`
* `getNumber(key: string): number`
* `getBoolean(key: string): boolean`
* `getObject(key: string): object`
* `withEnv(prefix?: string)`
* `withFile(file: string)`
* `withDefaults(defaults: object, name?: string)`

### Problem

```typescript
import { Problem } from 'tessellate-server'
```

A throwable Error class modeled after [Zalando Problem](https://github.com/zalando/problem).

### Example

Run `npm start` or check out the code below:

```typescript
import { TessellateServer, Problem } from '../src'

const server = new TessellateServer();

server.use((_, next) => {
  console.log('Hi, this is middleware.');
  return next();
});

server.router.get('/', ctx => ctx.body = 'Hello!');

server.router.get('/teapot', ctx => ctx.throw(
  new Problem({
    title: 'Teapot',
    detail: 'I am a teapot.',
    status: 418
  }))
);

server.start(3001);
```
