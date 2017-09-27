# tessellate-server

Web service runtime for tessellate services. It contains the following modules:

* [TessellateServer](#tessellateserver) – Application and metrics server.
* [conf](#conf) – Configuration module.
* [Problem](#problem) – Custom error class.
* [log](#log) – Logging module.
* [request](#request) – HTTP client.
  * [request/AuthorizationProvider](#requestauthorizationprovider) – Authorization providers.
  * [request/tokens](#requesttokens) – OAuth2 token providers.

## TessellateServer

```javascript
import { TessellateServer } from 'tessellate-server'
const server = new TessellateServer()
```

```javascript
server.use(middleware: Middleware, defer: boolean = false): TessellateServer
```

Add koa [Middleware](https://github.com/koajs/koa/wiki#middleware) that runs **before** any routes are handled. If `defer` is set to `true`, the middleware will run **after** all routes. Also see [koa.app.use](https://github.com/koajs/koa/blob/v2.x/docs/api/index.md#appusefunction).

```javascript
server.start(port: number, metricsPort?: number): Promise<TessellateServer>
```

Start the koa application server and an optional [prometheus](https://github.com/siimon/prom-client) metrics server on the specified ports. If no `metricsPort` is provided, prometheus will not be started.

```javascript
server.router: Router
```

[koa-router](https://github.com/alexmingoia/koa-router) instance. Use it to add routes.

```javascript
server.stop(): Promise<void>
```

Stop all koa servers.

## conf

```javascript
import { conf } from 'tessellate-server'
```

An instance of the hierarchical configuration provider [typeconf](https://github.com/mfellner/typeconf).

## Problem

```javascript
import { Problem } from 'tessellate-server'
```

A throwable Error class modeled after [Zalando Problem](https://github.com/zalando/problem).

## log

```javascript
import { log } from 'tessellate-server'
```

A [winston](https://github.com/winstonjs/winston) logger intance.

## Example

Run `npm start` or check out the code below:

```javascript
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

## Documentation

[Read the TypeDocs](https://cdn.rawgit.com/zalando-incubator/tessellate/88-consider-typescript/packages/tessellate-server/doc/index.html).
