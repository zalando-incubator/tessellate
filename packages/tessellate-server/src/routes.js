// @flow

import Router from 'koa-router'
import { Observable, Subject } from 'rxjs'

export type RouteDefinitions = { [name: string]: {| path: string; methods: Array<string>; |}; };
type RouteInitializerEntry<T> = {| name: string; method: string; initializer: RouteInitializer<T>; |};
type RouteInitializer<T> = (init?: (observable: Observable<T>) => Observable<*>) => Observable<T>;
export type RouteInitializerIndex<T> = { [name: string]: { [method: string]: RouteInitializer<T>; }; };
export type Context = { ctx: Object; next: () => Promise<any>; };

function toPromise(observable: Observable<*>): Promise<any> {
  return new Promise((resolve, reject) => observable.subscribe(resolve, reject))
}

function safeInit<T>(init?: (arg: T) => T): (arg: T) => T {
  return (arg: T) => {
    if (!init) return arg
    else return init(arg)
  }
}

function createRouteInitializer(router: Router, name: string, path: string, method: string): RouteInitializer<Context> {

  return (init?: (observable: Observable<Context>) => Observable<*>) => {
    const subject: Subject<Context> = new Subject()
    const observable = safeInit(init)(subject).publish()
    let connected = false

    router.register(path, [method], (ctx, next) => {
      // Observable that is going to complete the request.
      const promise = toPromise(observable)
      if (!connected) {
        observable.connect()
        connected = true
      }
      subject.next({ctx, next})
      return promise
    }, {
      name
    })

    return observable
  }
}

function *routeInitializerEntries(router: Router, definitions: RouteDefinitions): Iterable<RouteInitializerEntry<Context>> {
  for (let name of Object.keys(definitions)) {
    const route = definitions[name]
    for (let method of route.methods) {
      yield {
        name,
        method,
        initializer: createRouteInitializer(router, name, route.path, method)
      }
    }
  }
}

function initializeRoutes(router: Router, definitions: RouteDefinitions): RouteInitializerIndex<Context> {
  const observables = {}
  for (let route of routeInitializerEntries(router, definitions)) {
    observables[route.name] = {[route.method.toLowerCase()]: route.initializer}
  }
  return observables
}

export const router = new Router()
export const routes = (definitions: RouteDefinitions) => initializeRoutes(router, definitions)
