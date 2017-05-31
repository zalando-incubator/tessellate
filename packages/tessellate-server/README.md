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

```typescript
import { TessellateServer } from 'tessellate-server'
const server = new TessellateServer()
```

```typescript
server.use(middleware: Middleware, defer: boolean = false): TessellateServer
```

Add koa [Middleware](https://github.com/koajs/koa/wiki#middleware) that runs **before** any routes are handled. If `defer` is set to `true`, the middleware will run **after** all routes. Also see [koa.app.use](https://github.com/koajs/koa/blob/v2.x/docs/api/index.md#appusefunction).

```typescript
server.start(port: number, metricsPort?: number): Promise<TessellateServer>
```

Start the koa application server and an optional [prometheus](https://github.com/siimon/prom-client) metrics server on the specified ports. If no `metricsPort` is provided, prometheus will not be started.

```typescript
server.router: Router
```

[koa-router](https://github.com/alexmingoia/koa-router) instance. Use it to add routes.

```typescript
server.stop(): Promise<void>
```

Stop all koa servers.

## conf

```typescript
import { conf } from 'tessellate-server'
```

A hierarchical configuration provider inspired by [nconf](https://github.com/indexzero/nconf).


```typescript
conf.set(key: string, value: any): Conf
conf.get(key: string): any
conf.getString(key: string): string
conf.getNumber(key: string): number
conf.getBoolean(key: string): boolean
conf.getObject(key: string): object
conf.withEnv(prefix?: string): Conf
conf.withFile(file: string): Conf
conf.withStore(defaults: object, name?: string): Conf
```

## Problem

```typescript
import { Problem } from 'tessellate-server'
```

A throwable Error class modeled after [Zalando Problem](https://github.com/zalando/problem).

## log

```typescript
import { log } from 'tessellate-server'
```

A [winston](https://github.com/winstonjs/winston) logger intance.

## request

```typescript
import { request } from 'tessellate-server'
request(options: request.Options, provider?: AuthorizationProvider): Promise<FullResponse>
```

A request client based on [request-promise-native](https://github.com/request/request-promise-native);

* `options`: [request options](https://github.com/request/request#requestoptions-callback) object
* `provider`: optional `AuthorizationProvider`

### request/AuthorizationProvider

```typescript
import { 
  basicAuthorizationProvider,
  oauth2AuthorizationProvider
} from 'tessellate-server/request/AuthorizationProvider'
```

Create authorization providers, functions that return authorization options for the request client.

```typescript
type AuthorizationProvider = () => Promise<AuthOptions>
type basicAuthorizationProvider = (credentials: { user: string, pass: string }) => AuthorizationProvider
type oauth2AuthorizationProvider = (supplier: TokenProvider.TokenSupplier) => AuthorizationProvider
```

### request/tokens

```typescript
import { 
  LocalProvider,
  PasswordCredentialsFlowProvider
} from 'tessellate-server/request/tokens'
```

Token providers can provide tokens using the OAuth2 authentication scheme.

## Example

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

## Documentation

[Read the TypeDocs](https://cdn.rawgit.com/zalando-incubator/tessellate/88-consider-typescript/packages/tessellate-server/doc/index.html).
