// @flow

import dispatch from '../dispatch'

import type Router from 'koa-router'
import type Route from '.'

export function health(router: Router): Route {
  return router.get('fragment', '/fragment', async (ctx) => {
    const {headers, query} = ctx.request
    const result = await dispatch('fragment', {headers, query})
    ctx.set(result.headers)
    ctx.body = result.body
  })
}
