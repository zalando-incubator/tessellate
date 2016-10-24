// @flow

import dispatch from '../dispatch'
import { CREATE_BUNDLE, EXPORT_BUNDLE } from '../actions/bundles'

import type Router from 'koa-router'
import type Route from '.'

export function health(router: Router): Route {
  return router
    .get('bundles', '/bundles/:domain/:name', async (ctx) => {
      const {domain, name} = ctx.params
      const element = {} // FIXME
      const bundle = await dispatch(CREATE_BUNDLE, {domain, name, element})
      // const result = await dispatch(EXPORT_BUNDLE, {bundle})
      // ctx.set(headers)
      ctx.body = bundle
    })
    .post('bundles', '/bundles/:domain/:name', async (ctx) => {
      const {domain, name} = ctx.params
      const element = ctx.request.body
      const {bundle} = await dispatch(CREATE_BUNDLE, {domain, name, element})
      const {js, css} = await dispatch(EXPORT_BUNDLE, {domain, name, bundle})

      ctx.body = {js, css}
      ctx.status = 201
    })
}
