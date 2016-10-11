// @flow

import Router from 'koa-router'
import * as health from './health'
import * as bundles from './bundles'

export type Route = (router: Router) => Router
export type RouteSet = { [key: string]: Route }

function values<T>(object: { [key: string]: T }): Array<T> {
  return Object.keys(object).map(key => object[key])
}

function initializeRoutes(router: Router, ...routes: Array<RouteSet>): Router {
  return routes.reduce((routes, set) => routes.concat(values(set)), [])
               .reduce((router, route) => route(router), router)
}

const router = initializeRoutes(new Router(), health, bundles)

export default router.routes()
